# MakeSNS GitHub Actions → 운영 서버

대상: `mayking1228/makesns`의 `main` → `139.162.84.156` → `/opt/makesns/current/site`.

## 동작

GitHub에서 잠긴 의존성 설치 → 타입/88개 도구 테스트/배포 테스트 → 정적 빌드 → 8개 언어 화면 라벨/113개 페이지 SEO 검사 → 정적 전용 압축파일 생성 → 제한된 SSH 계정에 스트림 전송 → 서버 검사/교체 순서다. VPS에서 Node 빌드나 npm 설치를 하지 않는다.

최초에는 자동 배포가 꺼져 있다. Actions의 `Deploy MakeSNS`를 수동 실행하여 첫 성공을 확인한 뒤 저장소 변수 `MAKESNS_AUTO_DEPLOY=true`를 설정하면 main push마다 같은 검사를 거쳐 운영에 반영한다. 수동 실행도 main만 허용한다. `production` 환경을 사용하므로 GitHub 요금제에서 지원하면 승인자/브랜치 보호를 추가할 수 있다. 환경 승인이 설정되어 있다고 가정하지 않는다. 별도 개발 도메인/개발 서버는 이 작업에서 생성하지 않는다.

서버 수신기는 root 소유 코드로 고정한다. 배포 계정 `makesns-deploy`에는 sudo나 일반 SSH 셸을 주지 않고 authorized_keys의 forced command와 restrict로 전송 명령만 허용한다. 키는 MakeSNS 정적 release와 current 링크만 관리하며 CRM, PM2, DB, Nginx, 인증서, 단축링크 서비스 권한은 주지 않는다.

압축 크기·파일 수·전체 크기·경로 탈출·심볼릭/하드 링크·중복 멤버·파일별 SHA256·배포 커밋 메타정보를 확인한다. 이전 release는 남기고 current 심볼릭 링크를 원자적으로 바꾼다. 이전 해시 자산도 보존한다. Nginx 로컬 HTTPS로 사이트맵의 전체 페이지와 참조 CSS/JS의 실제 바이트를 비교하고, 공개 HTTPS의 버전 파일·8개 언어 특수문자 페이지도 비교한다. CRM 로그인과 단축링크 health는 전후 읽기만 한다. 검사 실패와 수신 프로세스의 정상 종료 신호에는 이전 current로 복구한다. 강제 전원 종료/SIGKILL은 복구 코드 실행을 보장하지 않으므로 이전 경로는 release-info.json에도 보존한다. 자동 release 삭제나 고객 DB migration은 하지 않는다.

## 최초 설정: 서버 root

제공한 `makesns-github-deploy-setup.tar.gz`를 서버 /tmp로 올린 뒤 압축을 풀고 `setup-github-deploy.sh`를 한 번 실행한다. 번들 SHA256과 기존 사이트·CRM·단축링크 응답을 먼저 검사한다. 설치되는 수신기는 `/usr/local/libexec/makesns-github-deploy/receive-static.py`이며 root 소유다. `/opt/makesns`와 `releases` 디렉터리 자체만 배포 계정 소유로 바꾸고 기존 release 파일은 재귀 chown하지 않는다. 공용 배포 lock 파일 두 개의 그룹 접근도 설정한다. 전용 계정의 SSH 공개키 인증까지 loopback에서 시험하지만 사이트 교체는 하지 않는다.

전용 개인키는 서버 `/root/.config/makesns-deploy/github-actions`에 권한 600으로 생성한다. 실제 값은 배포 번들, Git, 채팅에 들어 있지 않다. 기존 키가 있으면 재사용한다. 서버 ED25519 공개 호스트키로 known_hosts를 생성하며 GitHub에서 SSH 호스트 검증을 끄지 않는다. 키 폐기/재발급 시 서버 authorized_keys와 GitHub Secret을 함께 갱신한다.

## GitHub Secrets 두 개

저장소 **Settings → Secrets and variables → Actions → New repository secret**:

1. `MAKESNS_SSH_KEY`: 서버 `/root/.config/makesns-deploy/github-actions` 파일 전체 내용.
2. `MAKESNS_SSH_KNOWN_HOSTS`: 서버 `/root/.config/makesns-deploy/known_hosts` 파일 전체 내용.

Mac의 새 터미널에서 다음 명령으로 클립보드에 복사하고 GitHub Secret 입력란에 직접 붙여넣는다. 서버에서 이 명령을 실행하면 Mac 클립보드에 복사되지 않는다. 개인키를 채팅이나 이슈/문서에 붙여넣지 않는다.

```bash
ssh root@139.162.84.156 'cat /root/.config/makesns-deploy/github-actions' | pbcopy
```

첫 Secret 저장 후 두 번째 값을 복사한다.

```bash
ssh root@139.162.84.156 'cat /root/.config/makesns-deploy/known_hosts' | pbcopy
```

## 최초 배포와 자동 배포 켜기

1. **Actions → Deploy MakeSNS → Run workflow**, 브랜치 main, 운영 확인 체크 후 실행.
2. 워크플로와 사이트를 확인한다. `/deploy-version.json`의 revision은 실행한 Git 커밋과 같아야 한다.
3. **Settings → Secrets and variables → Actions → Variables → New repository variable**에서 이름 `MAKESNS_AUTO_DEPLOY`, 값 `true`를 등록한다.
4. 이후 main push마다 검사 후 운영 정적 사이트를 자동 갱신한다. 끄려면 변수를 `false`로 바꾸거나 삭제한다. 삭제는 이미 실행 중인 배포를 취소하지 않는다.

Secrets 등록, SSH 최초 설정, 첫 실제 GitHub 배포 성공은 별개 단계다. 저장소에 워크플로를 올렸다는 사실만으로 서버 연결 완료라고 보고하지 않는다.

## 범위와 장애 확인

이번 자동 배포는 **정적 프런트엔드 전용**이다. `services/links` 소스는 Git에 보관하고 테스트하지만 backend service 업데이트는 이 수신기가 수행하지 않는다. DB·서버 스키마·단축링크 API 변경은 별도 배포/호환 검토가 필요하다. 새 수신기 버전도 root 설정 번들을 다시 실행해야 갱신된다. 네트워크 방화벽이 GitHub runner의 SSH를 막으면 기존 SSH 설정/접근 정책을 확인해야 하며 이 스크립트는 방화벽이나 sshd_config를 변경하지 않는다.

실패한 release는 진단을 위해 남으며 이전 active 경로는 `/opt/makesns/releases/site-gh-.../release-info.json`에 있다. 복구가 실행되면 GitHub 배포 단계도 실패로 표시된다. `current`와 운영 공개 버전을 확인한 뒤 원인을 해결해 재실행한다. CRM/단축링크 health가 기존부터 실패하면 사이트 변경 전에 중단한다.

## 개인키 형식 오류

`Load key ...: error in libcrypto`는 서버 접속 전에 개인키 파싱이 실패한 상태다. MAKESNS_SSH_KEY에는 `/root/...` 경로나 .pub 공개키가 아닌 github-actions 개인키 파일 전체(시작/끝 줄 포함)를 실제 줄바꿈으로 넣는다. 워크플로는 CRLF/마지막 줄바꿈을 정리하고 ssh-keygen으로 파싱을 확인한다. 오류 시 키 내용이나 provider 출력은 표시하지 않고 재등록 방법을 안내한다.

Secret 수정 후에는 이전 실행의 Re-run이 아니라 main 기준 새 Run workflow를 실행해야 최신 워크플로 변경도 적용된다. 실행 환경은 ubuntu-24.04로 고정하고 Node 24용 checkout v6/setup-node v6/pnpm action-setup v5의 확인한 커밋을 사용한다. 이 변경이 실제 서버 인증 성공을 의미하지는 않는다.

## 최초 연결 확인 기록 · 2026-11-01

사용자가 수동 배포 실행 `41303801527`의 성공을 확인했다. 이후 main push 자동 배포를 시험하기 위해 이 문서 기록을 추가한다. 사이트 기능과 서버 설정은 변경하지 않는다. 자동 배포 시험의 성공 여부는 해당 push의 Deploy MakeSNS 실행 결과와 `/deploy-version.json`의 커밋 번호를 대조해 별도로 확인한다.
