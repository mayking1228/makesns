"""Write Actions SSH credentials without displaying their contents."""
import os
from pathlib import Path
import subprocess
import sys

def write_credentials(directory, env=os.environ, run=subprocess.run):
    key = env.get('DEPLOY_KEY', '').replace('\r\n', '\n').replace('\r', '\n').strip()
    known = env.get('KNOWN_HOSTS', '').replace('\r\n', '\n').replace('\r', '\n').strip()
    if not key.startswith('-----BEGIN OPENSSH PRIVATE KEY-----\n') or not key.endswith('\n-----END OPENSSH PRIVATE KEY-----'):
        raise ValueError('MAKESNS_SSH_KEY에는 서버 개인키 파일 전체를 실제 줄바꿈과 함께 등록하세요. 파일 경로나 .pub 공개키를 넣으면 안 됩니다.')
    if not known:
        raise ValueError('MAKESNS_SSH_KNOWN_HOSTS가 비어 있습니다.')
    directory = Path(directory)
    directory.mkdir(mode=0o700, parents=True, exist_ok=True)
    key_file = directory / 'key'
    known_file = directory / 'known_hosts'
    key_file.write_text(key + '\n')
    known_file.write_text(known + '\n')
    key_file.chmod(0o600)
    known_file.chmod(0o600)
    check = run(['ssh-keygen', '-y', '-P', '', '-f', str(key_file)], capture_output=True)
    if check.returncode:
        raise ValueError('MAKESNS_SSH_KEY 개인키 형식을 읽지 못했습니다. 서버의 github-actions 파일 전체를 다시 복사해 Secret을 수정하세요. 암호 없는 전용 키가 필요합니다.')
    check = run(['ssh-keygen', '-F', '139.162.84.156', '-f', str(known_file)], capture_output=True)
    if check.returncode:
        raise ValueError('MAKESNS_SSH_KNOWN_HOSTS에서 서버 주소를 찾지 못했습니다. 서버 known_hosts 파일 전체를 다시 등록하세요.')
    print('SSH 개인키 형식·서버 호스트키 등록 검사 통과. 키 내용은 출력하지 않았습니다.')

if __name__ == '__main__':
    try:
        write_credentials(sys.argv[1])
    except ValueError as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
