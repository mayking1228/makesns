from pathlib import Path
import hashlib,json,shutil,tarfile,zipfile,sys
repo=Path(__file__).resolve().parents[1]
root=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else repo.parent/'makesns-artifacts'
root.mkdir(parents=True,exist_ok=True)
package=root/'package';package.mkdir(exist_ok=True)
if (package/'site').exists():shutil.rmtree(package/'site')
shutil.copytree(repo/'out',package/'site')
site=package/'site'
manifest=[]
for p in sorted(site.rglob('*')):
 if p.is_file():manifest.append(hashlib.sha256(p.read_bytes()).hexdigest()+'  '+str(p.relative_to(site)))
(site/'SHA256SUMS').write_text('\n'.join(manifest)+'\n')
for name in ['install-static.sh','makesns-http.conf.example']:shutil.copy2(repo/'deploy'/name,package/name)
shutil.copy2(repo/'README.md',package/'README.md')
def mode(i):i.uid=i.gid=0;i.uname=i.gname='';i.mode=0o755 if i.isdir() else 0o644;return i
static=root/'makesns-static.tar.gz'
with tarfile.open(static,'w:gz') as tar:
 for p in sorted(package.iterdir()):tar.add(p,arcname=p.name,filter=mode)
source=root/'makesns-source.zip'
with zipfile.ZipFile(source,'w',compression=zipfile.ZIP_DEFLATED) as archive:
 for p in sorted(repo.rglob('*')):
  rel=p.relative_to(repo)
  if not p.is_file() or any(x in ['node_modules','.next','out','.git'] for x in rel.parts) or p.name.endswith('.tsbuildinfo') or p.name.startswith('.env') or p.suffix in ['.sqlite','.sqlite3','.db'] or '.sqlite-' in p.name or p.name=='ip-salt':continue
  archive.write(p,'makesns/'+str(rel))
for p in [static,source]:p.chmod(0o644)
(root/'SHA256SUMS').write_text('\n'.join(hashlib.sha256(p.read_bytes()).hexdigest()+'  '+p.name for p in [static,source])+'\n')
root.chmod(0o755)
print(json.dumps({'staticBytes':static.stat().st_size,'sourceBytes':source.stat().st_size,'files':len(manifest)},indent=2))
