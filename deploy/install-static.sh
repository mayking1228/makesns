#!/usr/bin/env bash
set -Eeuo pipefail
umask 022
[[ $(id -u) == 0 ]] || { echo '서버 root 계정으로 실행하세요.'; exit 1; }
exec 9>/tmp/makesns-static-deploy.lock
flock -n 9 || { echo 'MakeSNS 배포가 이미 진행 중입니다.'; exit 1; }
BUNDLE=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
BASE=/opt/makesns
[[ -f "$BUNDLE/site/en/index.html" && -f "$BUNDLE/site/ko/index.html" && -f "$BUNDLE/site/SHA256SUMS" ]] || { echo '정적 배포 파일이 없습니다.'; exit 1; }
if [[ -e "$BASE" && ! -f "$BASE/.makesns-static" ]]; then echo '/opt/makesns에 기존 파일이 있어 중단했습니다. 먼저 경로를 확인하세요.'; exit 1; fi
(cd "$BUNDLE/site" && sha256sum --check --quiet SHA256SUMS)
mkdir -p "$BASE/releases"
touch "$BASE/.makesns-static"
PREVIOUS=
if [[ -e "$BASE/current" || -L "$BASE/current" ]]; then
 [[ -L "$BASE/current" ]] || { echo 'current가 관리용 심볼릭 링크가 아닙니다.'; exit 1; }
 PREVIOUS=$(readlink -f "$BASE/current")
 [[ "$PREVIOUS" == "$BASE/releases/"* && -d "$PREVIOUS/site" ]] || { echo '이전 배포 경로가 예상과 다릅니다.'; exit 1; }
fi
RELEASE=$(mktemp -d "$BASE/releases/site-XXXXXXXX")
cp -a "$BUNDLE/site" "$RELEASE/site"
if [[ -n "$PREVIOUS" && -d "$PREVIOUS/site/_next/static" ]]; then
 mkdir -p "$RELEASE/site/_next/static"
 cp -an "$PREVIOUS/site/_next/static/." "$RELEASE/site/_next/static/"
fi
find "$RELEASE" -type d -exec chmod 755 {} +
find "$RELEASE" -type f -exec chmod 644 {} +
ln -s "releases/$(basename "$RELEASE")" "$BASE/.current-next-$$"
mv -Tf "$BASE/.current-next-$$" "$BASE/current"
printf 'MakeSNS 정적 파일 설치 완료: %s\n' "$RELEASE"
if [[ -n "$PREVIOUS" ]]; then printf '이전 버전 보존: %s\n' "$PREVIOUS"; fi
echo 'CRM·PM2·DB·Nginx 설정은 변경하지 않았습니다. makesns.com 도메인 및 HTTPS 연결은 별도로 진행하세요.'
