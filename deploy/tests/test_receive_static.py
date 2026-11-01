import hashlib
import importlib.util
import io
import json
import os
from pathlib import Path
import tarfile
import tempfile
import unittest
from urllib.parse import unquote

spec = importlib.util.spec_from_file_location('receiver', Path(__file__).parents[1] / 'receive-static.py')
receiver = importlib.util.module_from_spec(spec)
spec.loader.exec_module(receiver)
REVISION = 'b' * 40

def files():
    page = b'<html><head><link rel="stylesheet" href="/_next/static/new.css"><script src="/_next/static/new.js"></script></head><body>new</body></html>'
    data = {'index.html': page, 'robots.txt': b'User-agent: *\nAllow: /', '_next/static/new.css': b'body{}', '_next/static/new.js': b'console.log(1)', 'deploy-version.json': json.dumps({'revision': REVISION}).encode()}
    paths = ['/']
    for lang in receiver.LANGS:
        for suffix in ('', 'symbols/', 'profile/'):
            name = lang + '/' + suffix + 'index.html'
            data[name] = page
            paths.append('/' + lang + '/' + suffix)
    data['sitemap.xml'] = ('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + ''.join('<url><loc>https://makesns.com' + p + '</loc></url>' for p in paths) + '</urlset>').encode()
    return data

def artifact(data=None, extras=(), alter_manifest=None):
    data = files() if data is None else data
    hashes = {name: hashlib.sha256(body).hexdigest() for name, body in data.items()}
    manifest = {'schema': 1, 'revision': REVISION, 'files': hashes}
    if alter_manifest:
        alter_manifest(manifest)
    stream = io.BytesIO()
    with tarfile.open(fileobj=stream, mode='w:gz') as tar:
        for name, body in [('manifest.json', json.dumps(manifest).encode()), *[('site/' + n, b) for n, b in data.items()]]:
            info = tarfile.TarInfo(name)
            info.size = len(body)
            tar.addfile(info, io.BytesIO(body))
        for info, body in extras:
            tar.addfile(info, io.BytesIO(body))
    stream.seek(0)
    return stream

class ReceiverTests(unittest.TestCase):
    def reject(self, stream, message):
        with tempfile.TemporaryDirectory() as temp:
            with self.assertRaisesRegex(receiver.DeployError, message):
                receiver.unpack(stream, Path(temp))

    def test_unpack_checks_complete_manifest_and_revision(self):
        with tempfile.TemporaryDirectory() as temp:
            manifest = receiver.unpack(artifact(), Path(temp))
            self.assertEqual(manifest['revision'], REVISION)
            self.assertTrue((Path(temp) / 'site/ko/symbols/index.html').is_file())

    def test_checksum_mismatch(self):
        self.reject(artifact(alter_manifest=lambda m: m['files'].update({'index.html': '0' * 64})), 'checksum mismatch')

    def test_unlisted_files_are_rejected(self):
        info = tarfile.TarInfo('site/unlisted.txt')
        info.size = 1
        self.reject(artifact(extras=[(info, b'x')]), 'file set mismatch')

    def test_traversal_absolute_and_hidden_paths_are_rejected(self):
        for name in ['site/../../outside', '/tmp/outside', 'site/.env', 'site/a\\b']:
            with self.subTest(name=name):
                info = tarfile.TarInfo(name)
                self.reject(artifact(extras=[(info, b'')]), 'Invalid artifact path')

    def test_duplicate_member_is_rejected(self):
        info = tarfile.TarInfo('site/index.html')
        self.reject(artifact(extras=[(info, b'')]), 'Duplicate')

    def test_symbolic_and_hard_links_are_rejected(self):
        for kind in [tarfile.SYMTYPE, tarfile.LNKTYPE]:
            with self.subTest(kind=kind):
                info = tarfile.TarInfo('site/link')
                info.type = kind
                info.linkname = '/etc/passwd'
                self.reject(artifact(extras=[(info, b'')]), 'Links and special files')

    def test_source_or_scripts_outside_site_are_rejected(self):
        info = tarfile.TarInfo('install.sh')
        self.reject(artifact(extras=[(info, b'')]), 'Unexpected artifact entry')

    def test_invalid_revision_is_rejected(self):
        self.reject(artifact(alter_manifest=lambda m: m.update(revision='main; shell')), 'Invalid manifest version')

    def test_missing_language_is_rejected(self):
        data = files()
        data.pop('tr/profile/index.html')
        self.reject(artifact(data), 'Incomplete language')

    def test_revision_metadata_must_match_manifest(self):
        data = files()
        data['deploy-version.json'] = b'{"revision":"other"}'
        self.reject(artifact(data), 'Revision metadata mismatch')

    def installed(self, root):
        base = root / 'makesns'
        previous = base / 'releases/previous'
        (previous / 'site/_next/static').mkdir(parents=True)
        (previous / 'site/index.html').write_text('previous')
        (previous / 'site/_next/static/old.js').write_text('old hashed chunk')
        (base / '.makesns-static').touch()
        (base / 'current').symlink_to('releases/previous')
        return base, previous

    def fetcher(self, base, fail=None):
        crm_calls = 0
        def fetch(host, path, public=False):
            nonlocal crm_calls
            if host == 'entercrews.net':
                crm_calls += 1
                if fail == 'crm-after' and crm_calls > 1:
                    raise receiver.DeployError('CRM after failed')
                return b'<html>CRM login</html>'
            if path == '/api/short-links/health':
                return b'{"ok":false}' if fail == 'health-before' else b'{"ok":true}'
            if fail == 'public' and public:
                return b'old public cached page'
            if fail == 'asset' and path.endswith('.js'):
                return b'old asset'
            name = unquote(path).lstrip('/') + ('index.html' if path.endswith('/') else '')
            return (base / 'current/site' / name).read_bytes()
        return fetch

    def test_success_keeps_prior_assets_and_readable_permissions(self):
        with tempfile.TemporaryDirectory() as temp:
            base, previous = self.installed(Path(temp))
            self.assertEqual(receiver.deploy(artifact(), base, self.fetcher(base)), REVISION)
            self.assertNotEqual((base / 'current').resolve(), previous)
            self.assertEqual((base / 'current/site/_next/static/old.js').read_text(), 'old hashed chunk')
            self.assertEqual((base / 'current').resolve().stat().st_mode & 0o777, 0o755)
            self.assertEqual((base / 'current/site/index.html').stat().st_mode & 0o777, 0o644)
            self.assertEqual((previous / 'site/index.html').read_text(), 'previous')

    def test_encoded_next_route_assets_match_decoded_filenames(self):
        with tempfile.TemporaryDirectory() as temp:
            base, _ = self.installed(Path(temp))
            data = files()
            data['index.html'] = b'<html><script src="/_next/static/chunks/%5Blang%5D/page.js"></script></html>'
            data['_next/static/chunks/[lang]/page.js'] = b'route'
            self.assertEqual(receiver.deploy(artifact(data), base, self.fetcher(base)), REVISION)

    def test_failed_assets_public_response_and_crm_restore_previous_site(self):
        for failure in ['asset', 'public', 'crm-after']:
            with self.subTest(failure=failure), tempfile.TemporaryDirectory() as temp:
                base, previous = self.installed(Path(temp))
                with self.assertRaises(receiver.DeployError):
                    receiver.deploy(artifact(), base, self.fetcher(base, failure))
                self.assertEqual(os.readlink(base / 'current'), 'releases/previous')
                self.assertEqual((previous / 'site/index.html').read_text(), 'previous')

    def test_unhealthy_service_or_bad_artifact_does_not_switch_site(self):
        with tempfile.TemporaryDirectory() as temp:
            base, _ = self.installed(Path(temp))
            with self.assertRaises(receiver.DeployError):
                receiver.deploy(artifact(), base, self.fetcher(base, 'health-before'))
            self.assertEqual(os.readlink(base / 'current'), 'releases/previous')
            with self.assertRaises(receiver.DeployError):
                receiver.deploy(artifact(alter_manifest=lambda m: m['files'].update({'index.html': '0' * 64})), base, self.fetcher(base))
            self.assertEqual(os.readlink(base / 'current'), 'releases/previous')

if __name__ == '__main__':
    unittest.main()
