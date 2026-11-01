#!/usr/bin/env python3
"""Root-installed forced SSH command. Only installs validated static artifacts."""
import fcntl
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import signal
import subprocess
import sys
import tarfile
import tempfile
import time
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote

BASE = Path('/opt/makesns')
MAX_ARCHIVE = 64 * 1024 * 1024
MAX_TOTAL = 256 * 1024 * 1024
LANGS = ('en', 'ko', 'ja', 'es', 'ms', 'pt-BR', 'id', 'tr')

class DeployError(Exception):
    pass

def require(ok, message):
    if not ok:
        raise DeployError(message)

def safe_name(name):
    require(isinstance(name, str) and name and not name.startswith('/'), 'Invalid artifact path')
    require('\\' not in name and not any(ord(c) < 32 for c in name), 'Invalid artifact path')
    require(all(p not in ('', '.', '..') and not p.startswith('.') for p in name.split('/')), 'Invalid artifact path')
    return PurePosixPath(name)

def digest(data):
    return hashlib.sha256(data).hexdigest()

def unpack(archive, destination):
    seen = set()
    total = 0
    with tarfile.open(fileobj=archive, mode='r:gz') as tar:
        for i, member in enumerate(tar):
            require(i < 6000, 'Too many artifact entries')
            name = member.name.rstrip('/') if member.isdir() else member.name
            path = safe_name(name)
            require(name not in seen, 'Duplicate artifact path')
            seen.add(name)
            require(member.isdir() or member.isreg(), 'Links and special files are forbidden')
            require(not getattr(member, 'sparse', None), 'Sparse files are forbidden')
            require(path.parts[0] == 'site' or name == 'manifest.json', 'Unexpected artifact entry')
            target = destination.joinpath(*path.parts)
            if member.isdir():
                target.mkdir(parents=True, exist_ok=True)
                continue
            require(0 <= member.size <= 16 * 1024 * 1024, 'Artifact file too large')
            total += member.size
            require(total <= MAX_TOTAL, 'Unpacked artifact too large')
            target.parent.mkdir(parents=True, exist_ok=True)
            source = tar.extractfile(member)
            require(source is not None, 'Unreadable archive entry')
            with target.open('xb') as out:
                shutil.copyfileobj(source, out)
    require((destination / 'manifest.json').is_file(), 'Missing artifact manifest')
    require((destination / 'manifest.json').stat().st_size <= 2 * 1024 * 1024, 'Manifest too large')
    manifest = json.loads((destination / 'manifest.json').read_text())
    require(manifest.get('schema') == 1 and re.fullmatch(r'[0-9a-f]{40}', manifest.get('revision', '')), 'Invalid manifest version')
    hashes = manifest.get('files')
    require(isinstance(hashes, dict) and 1 <= len(hashes) <= 5000, 'Invalid file manifest')
    site = destination / 'site'
    actual = {str(f.relative_to(site)) for f in site.rglob('*') if f.is_file()}
    require(actual == set(hashes), 'Manifest file set mismatch')
    for name, expected in hashes.items():
        safe_name(name)
        require(isinstance(expected, str) and re.fullmatch(r'[0-9a-f]{64}', expected), 'Invalid file checksum')
        require(digest((site / name).read_bytes()) == expected, 'Artifact checksum mismatch: ' + name)
    for lang in LANGS:
        for suffix in ('index.html', 'symbols/index.html', 'profile/index.html'):
            require((site / lang / suffix).is_file(), 'Incomplete language artifact')
    require((site / 'sitemap.xml').is_file() and (site / 'robots.txt').is_file(), 'Missing search metadata')
    require(json.loads((site / 'deploy-version.json').read_text()) == {'revision': manifest['revision']}, 'Revision metadata mismatch')
    return manifest

class Assets(HTMLParser):
    def __init__(self):
        super().__init__()
        self.paths = set()
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        url = attrs.get('src', '') if tag == 'script' else attrs.get('href', '') if tag == 'link' and attrs.get('rel') == 'stylesheet' else ''
        if url.startswith('/_next/static/'):
            self.paths.add(url)

def fetch_url(host, path, public=False):
    args = ['curl', '--silent', '--show-error', '--fail', '--compressed', '--connect-timeout', '3', '--max-time', '12', '--max-filesize', str(8 * 1024 * 1024), '-H', 'Cache-Control: no-cache']
    if not public:
        args += ['--resolve', host + ':443:127.0.0.1']
    args += ['https://' + host + path]
    return subprocess.run(args, check=True, capture_output=True, timeout=16).stdout

def switch(base, target):
    temporary = base / ('.github-current-' + str(os.getpid()))
    try:
        temporary.symlink_to(target)
        os.replace(temporary, base / 'current')
    finally:
        temporary.unlink(missing_ok=True)

def verify(site, manifest, fetch):
    paths = {'/', '/robots.txt', '/sitemap.xml', '/deploy-version.json'}
    for node in ET.parse(site / 'sitemap.xml').iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc'):
        url = urlsplit(node.text or '')
        require(url.scheme == 'https' and url.netloc == 'makesns.com' and not url.query and not url.fragment, 'Unexpected sitemap URL')
        paths.add(url.path)
    for lang in LANGS:
        require('/' + lang + '/symbols/' in paths, 'Incomplete language sitemap')
    assets = set()
    for path in sorted(paths):
        name = path.lstrip('/')
        if path.endswith('/'):
            name += 'index.html'
        safe_name(name)
        require(name in manifest['files'], 'Unlisted served path')
        body = fetch('makesns.com', path, False)
        require(digest(body) == manifest['files'][name], 'Nginx response differs from artifact: ' + path)
        if name.endswith('.html'):
            parser = Assets()
            parser.feed(body.decode())
            assets.update(parser.paths)
    for path in sorted(assets):
        name = unquote(urlsplit(path).path).lstrip('/')
        safe_name(name)
        require(name in manifest['files'], 'Unlisted page asset')
        require(digest(fetch('makesns.com', path, False)) == manifest['files'][name], 'Static asset response differs: ' + path)
    for path in ['/deploy-version.json'] + ['/' + lang + '/symbols/' for lang in LANGS]:
        name = path.lstrip('/') + ('index.html' if path.endswith('/') else '')
        require(digest(fetch('makesns.com', path, True)) == manifest['files'][name], 'Public response differs from artifact: ' + path)
    fetch('entercrews.net', '/login', False)
    require(json.loads(fetch('makesns.com', '/api/short-links/health', False)).get('ok') is True, 'Short link service health check failed')

def deploy(archive, base=BASE, fetch=fetch_url):
    require((base / '.makesns-static').is_file(), 'Existing static site marker missing')
    current = base / 'current'
    require(current.is_symlink(), 'Current site is not a symlink')
    previous_link = os.readlink(current)
    previous = current.resolve(strict=True)
    releases = (base / 'releases').resolve(strict=True)
    require(previous.parent == releases and (previous / 'site').is_dir(), 'Unexpected existing release path')
    require(b'<' in fetch('entercrews.net', '/login', False), 'CRM baseline check failed')
    require(json.loads(fetch('makesns.com', '/api/short-links/health', False)).get('ok') is True, 'Short link baseline check failed')
    with tempfile.TemporaryDirectory(prefix='makesns-receive-') as scratch:
        payload = Path(scratch)
        manifest = unpack(archive, payload)
        release = Path(tempfile.mkdtemp(prefix='site-gh-' + manifest['revision'][:12] + '-', dir=releases))
        shutil.copytree(payload / 'site', release / 'site')
        # Keep existing hashed assets for clients that still have an older page open.
        old_assets = previous / 'site/_next/static'
        if old_assets.is_dir():
            for old in old_assets.rglob('*'):
                require(not old.is_symlink(), 'Unexpected symlink in previous static assets')
                if old.is_file():
                    target = release / 'site/_next/static' / old.relative_to(old_assets)
                    if not target.exists():
                        target.parent.mkdir(parents=True, exist_ok=True)
                        shutil.copyfile(old, target)
        (release / 'release-info.json').write_text(json.dumps({'revision': manifest['revision'], 'previous': previous_link, 'created_at': int(time.time())}) + '\n')
        for item in [release, *release.rglob('*')]:
            item.chmod(0o755 if item.is_dir() else 0o644)
        try:
            switch(base, 'releases/' + release.name)
            verify(release / 'site', manifest, fetch)
        except BaseException:
            switch(base, previous_link)
            print('배포 검사 실패. 이전 MakeSNS 사이트로 복구했습니다.', file=sys.stderr, flush=True)
            raise
        print('MakeSNS 배포 완료: ' + manifest['revision'], flush=True)
        print('이전 사이트 보존: ' + str(previous), flush=True)
        return manifest['revision']

def timeout_handler(signum, frame):
    raise DeployError('Deployment timed out')

def main():
    require(os.environ.get('SSH_ORIGINAL_COMMAND', '') in ('', 'deploy'), 'Only static deployment is allowed')
    for signum in (signal.SIGALRM, signal.SIGTERM, signal.SIGINT, signal.SIGHUP):
        signal.signal(signum, timeout_handler)
    signal.alarm(600)
    with (BASE.parent / 'makesns-domain-setup.lock').open('r+') as first, Path('/tmp/makesns-static-deploy.lock').open('r+') as second:
        for lock in (first, second):
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        with tempfile.TemporaryFile() as archive:
            count = 0
            while True:
                chunk = sys.stdin.buffer.read(1024 * 1024)
                if not chunk:
                    break
                count += len(chunk)
                require(count <= MAX_ARCHIVE, 'Archive exceeds 64 MiB')
                archive.write(chunk)
            require(count > 0, 'Empty artifact')
            archive.seek(0)
            deploy(archive)
    signal.alarm(0)

if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        print('MakeSNS deployment failed: ' + (str(error) if isinstance(error, DeployError) else type(error).__name__), file=sys.stderr)
        sys.exit(1)
