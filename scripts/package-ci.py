"""Create a static-only deployment artifact; never include source/runtime data."""
from pathlib import Path
import hashlib
import json
import re
import subprocess
import sys
import tarfile
import tempfile
import shutil

repo = Path(__file__).resolve().parents[1]
revision = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=repo, text=True).strip()
if not re.fullmatch('[0-9a-f]{40}', revision):
    raise SystemExit('Invalid Git revision')
artifact = Path(sys.argv[1]).resolve()
artifact.parent.mkdir(parents=True, exist_ok=True)
with tempfile.TemporaryDirectory(prefix='makesns-ci-') as scratch:
    root = Path(scratch)
    shutil.copytree(repo / 'out', root / 'site')
    (root / 'site/deploy-version.json').write_text(json.dumps({'revision': revision}) + '\n')
    hashes = {}
    for path in sorted((root / 'site').rglob('*')):
        if path.is_symlink():
            raise SystemExit('Build contains a symlink')
        if path.is_file():
            hashes[str(path.relative_to(root / 'site'))] = hashlib.sha256(path.read_bytes()).hexdigest()
    (root / 'manifest.json').write_text(json.dumps({'schema': 1, 'revision': revision, 'files': hashes}, sort_keys=True) + '\n')
    def mode(info):
        info.uid = info.gid = 0
        info.uname = info.gname = ''
        info.mode = 0o755 if info.isdir() else 0o644
        return info
    with tarfile.open(artifact, 'w:gz') as tar:
        for path in sorted(root.iterdir()):
            tar.add(path, arcname=path.name, filter=mode)
print('Static artifact:', artifact.name, len(hashes), 'files, revision', revision)
