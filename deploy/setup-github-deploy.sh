#!/usr/bin/env bash
set -Eeuo pipefail
umask 077
[[ $(id -u) == 0 ]] || { echo '운영 서버 root 터미널에서 실행하세요.'; exit 1; }
ROOT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
for command in python3 curl useradd getent install ssh ssh-keygen flock; do command -v "$command" >/dev/null || { echo "필요 명령 없음: $command"; exit 1; }; done
(cd "$ROOT_DIR" && sha256sum --check --quiet SHA256SUMS)
BASE=/opt/makesns
ACCOUNT=makesns-deploy
MANAGED=/etc/makesns-github-deploy.managed
[[ -d "$BASE" && ! -L "$BASE" && -f "$BASE/.makesns-static" && -L "$BASE/current" && -d "$BASE/releases" && ! -L "$BASE/releases" ]] || { echo '기존 MakeSNS 설치 경로가 예상과 다릅니다.'; exit 1; }
CURRENT=$(readlink -f "$BASE/current")
[[ "$CURRENT" == "$BASE/releases/"* && -d "$CURRENT/site" && ! -L "$CURRENT/site" ]] || { echo '기존 사이트 경로 확인 실패.'; exit 1; }
if getent passwd "$ACCOUNT" >/dev/null && [[ ! -f "$MANAGED" ]]; then echo '같은 이름의 비관리 계정이 있어 중단했습니다.'; exit 1; fi
for file in /opt/makesns-domain-setup.lock /tmp/makesns-static-deploy.lock; do
 [[ ! -L "$file" && ( ! -e "$file" || -f "$file" ) ]] || { echo '잠금 파일 확인 실패.'; exit 1; }
done
exec 8>/opt/makesns-domain-setup.lock
flock -n 8 || { echo '다른 MakeSNS 배포가 진행 중입니다.'; exit 1; }
exec 9>/tmp/makesns-static-deploy.lock
flock -n 9 || { echo '다른 MakeSNS 정적 설치가 진행 중입니다.'; exit 1; }
[[ -f /etc/ssh/ssh_host_ed25519_key.pub ]] || { echo '서버 ED25519 공개 호스트키를 찾을 수 없습니다.'; exit 1; }
curl --silent --show-error --fail --connect-timeout 3 --max-time 10 --resolve entercrews.net:443:127.0.0.1 https://entercrews.net/login -o /dev/null
curl --silent --show-error --fail --connect-timeout 3 --max-time 10 --resolve makesns.com:443:127.0.0.1 https://makesns.com/ -o /dev/null
curl --silent --show-error --fail --connect-timeout 3 --max-time 10 --resolve makesns.com:443:127.0.0.1 https://makesns.com/api/short-links/health | python3 -c 'import json,sys; assert json.load(sys.stdin).get("ok") is True'
python3 -m py_compile "$ROOT_DIR/receive-static.py"
if ! getent passwd "$ACCOUNT" >/dev/null; then
 useradd --system --create-home --home-dir /home/makesns-deploy --shell /bin/sh "$ACCOUNT"
 printf '%s\n' 'MakeSNS GitHub static-only deploy v1' > "$MANAGED"
 chmod 644 "$MANAGED"
fi
[[ $(getent passwd "$ACCOUNT" | cut -d: -f6) == /home/makesns-deploy ]] || { echo '배포 계정 홈 경로 확인 실패.'; exit 1; }
GROUP=$(id -gn "$ACCOUNT")
install -d -m 755 -o root -g root /usr/local/libexec/makesns-github-deploy
install -m 644 -o root -g root "$ROOT_DIR/receive-static.py" /usr/local/libexec/makesns-github-deploy/receive-static.py
install -d -m 700 -o root -g root /root/.config/makesns-deploy
KEY=/root/.config/makesns-deploy/github-actions
if [[ ! -f "$KEY" ]]; then ssh-keygen -q -t ed25519 -N '' -C makesns-github-actions -f "$KEY"; fi
chmod 600 "$KEY"
ssh-keygen -y -P '' -f "$KEY" > "$KEY.pub"
install -d -m 755 -o root -g root /home/makesns-deploy /home/makesns-deploy/.ssh
printf 'restrict,command="/usr/bin/python3 /usr/local/libexec/makesns-github-deploy/receive-static.py" %s\n' "$(cat "$KEY.pub")" > /home/makesns-deploy/.ssh/authorized_keys
chown root:root /home/makesns-deploy/.ssh/authorized_keys
chmod 644 /home/makesns-deploy/.ssh/authorized_keys
# Grant only static release and current-symlink management. No sudo, CRM, or service rights.
chown "$ACCOUNT:$GROUP" "$BASE" "$BASE/releases"
chmod 755 "$BASE" "$BASE/releases"
for file in /opt/makesns-domain-setup.lock /tmp/makesns-static-deploy.lock; do
 touch "$file"
 chown "root:$GROUP" "$file"
 chmod 660 "$file"
done
{ printf '139.162.84.156 '; cat /etc/ssh/ssh_host_ed25519_key.pub; } > /root/.config/makesns-deploy/known_hosts
chmod 600 /root/.config/makesns-deploy/known_hosts
flock -u 9
flock -u 8
# Prove this restricted account accepts the generated key without deploying anything.
SSH_CHECK=$(mktemp)
trap 'rm -f -- "$SSH_CHECK"' EXIT
set +e
ssh -T -i "$KEY" -o BatchMode=yes -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes -o UserKnownHostsFile=/root/.config/makesns-deploy/known_hosts -o HostKeyAlias=139.162.84.156 -o ConnectTimeout=5 makesns-deploy@127.0.0.1 deploy < /dev/null > "$SSH_CHECK" 2>&1
SSH_RESULT=$?
set -e
if [[ "$SSH_RESULT" != 1 ]] || ! grep -q 'Empty artifact' "$SSH_CHECK"; then
 echo '계정·키 설정은 완료했지만 SSH 인증 검사가 실패했습니다. 사이트는 교체하지 않았습니다.'
 cat "$SSH_CHECK"
 exit 1
fi
ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub
printf '%s\n' 'MakeSNS 배포 전용 계정 설정 완료. 현재 사이트는 교체하지 않았습니다.'
printf '%s\n' 'GitHub 저장소 Settings → Secrets and variables → Actions에 다음 두 Secrets를 등록하세요.'
printf '%s\n' 'MAKESNS_SSH_KEY: /root/.config/makesns-deploy/github-actions 파일 내용'
printf '%s\n' 'MAKESNS_SSH_KNOWN_HOSTS: /root/.config/makesns-deploy/known_hosts 파일 내용'
printf '%s\n' '비밀키를 채팅에 보내지 마세요. 등록 후 Actions → Deploy MakeSNS → Run workflow에서 첫 배포를 실행하세요.'
printf '%s\n' '첫 배포 성공 후 Variables에 MAKESNS_AUTO_DEPLOY=true를 설정하면 main push마다 배포합니다.'
printf '%s\n' 'CRM·PM2·DB·Nginx·단축링크 서비스·Google 인증·인증서 변경 없음.'
