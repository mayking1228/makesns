# MakeSNS

한국어·영어·일본어·스페인어·말레이어·브라질 포르투갈어·인도네시아어·터키어 크리에이터 도구 사이트. CRM과 별도 프로젝트입니다. Next.js App Router 정적 내보내기를 Nginx로 제공하며, 단축링크만 전용 Node·SQLite 서비스로 처리합니다. 이미지·문자 편집·QR 입력은 브라우저에서 처리합니다. 새 변경의 운영 반영은 배포 파일을 서버로 전송한 뒤 실행하는 방식입니다. 현재 문자 라이브러리 확장 작업은 운영 배포 전입니다.

## 구성

- `/`: 언어 선택. 브라우저 언어는 안내에만 사용하며 강제 이동하지 않습니다.
- `/en/`, `/ko/`, `/ja/`, `/es/`, `/ms/`, `/pt-BR/`, `/id/`, `/tr/`: 홈·소개글 예시·도구 목록.
- `/{lang}/caption/`: 빈 줄 유지·글자/해시태그 수·복사.
- `/{lang}/fonts/`: 26종 글자 스타일·문자 변환과 48종 텍스트 장식. 한글·이모지는 보존하며 폰트를 설치하지 않습니다.
- `/{lang}/symbols/`: 별·하트·화살표·프레임·표정, 문구 감싸기·복사. 분류 선택·검색·즐겨찾기·최근 복사를 지원합니다.
- `/{lang}/resizer/`: 1:1, 4:5, 9:16, 16:9 자르기/확대. JPG·PNG·WebP 출력, 이미지별 위치 설정, 순차 일괄 처리와 ZIP 저장.
- `/{lang}/privacy/`, robots.txt, sitemap.xml, 언어별 canonical·hreflang·Open Graph·Twitter 메타정보.

## 개발

Node.js 22 이상, pnpm 11.19.0. 의존성은 lockfile로 고정합니다.

```bash
pnpm install --frozen-lockfile --ignore-scripts
pnpm test
pnpm typecheck
pnpm dev
```

개발 주소는 http://127.0.0.1:3010. 운영용 파일은 `pnpm build` 후 `out/`에 생성됩니다. `pnpm preview`로 빌드 결과를 로컬에서 확인할 수 있습니다. HTML 파일을 파일 탐색기에서 직접 열면 클립보드·정적 경로 동작이 다를 수 있으니 HTTP 서버로 확인하세요. 외부 폰트·이미지를 받지 않아 빌드에 별도 API 키가 필요하지 않습니다.

## 이미지·개인정보

이미지·문자 편집·QR 입력은 업로드하지 않습니다. 단축링크의 원본 URL은 전용 서버에 저장합니다. 도구 처리에는 로그인·외부 API가 필요하지 않습니다. 방문자가 동의한 경우에만 Google Analytics 4 스크립트·분석 쿠키를 사용합니다. 분석은 거부해도 모든 도구를 사용할 수 있습니다. 다만 호스팅의 일반 접속 로그에는 IP·요청 경로가 남을 수 있습니다. 한 번에 최대 5개, 파일당 12MiB, 합계 40MiB. 파일 헤더에서 40MP 초과·허용하지 않는 형식을 먼저 거부하고, 브라우저 디코딩 후에도 크기를 확인합니다. SVG·HEIC·애니메이션 WebP/APNG는 지원하지 않습니다. 일부 특이한 이미지 헤더는 안전하게 거부될 수 있습니다. 출력 긴 변은 최대 2500px이며 현재 프리셋은 1080/1350/1920px입니다. 기기 메모리나 Canvas 구현에 따라 한도 안에서도 실패할 수 있으며 오류를 표시합니다. JPEG 투명 배경은 흰색으로 채웁니다. 작은 원본을 확대하면 품질이 낮아질 수 있습니다.

이미지의 세로 방향은 브라우저의 EXIF 처리에 따릅니다. ZIP의 각 이미지는 개별 설정이 있으면 적용하고, 설정하지 않은 이미지는 가운데 자르기를 사용합니다. 비율 변경은 모든 이미지의 자르기 위치를 초기화합니다. 플랫폼별 최신 권장 규격과 글자 수 산정은 앱마다 다르므로 게시 전 확인하세요.

## 배포

정적 페이지는 몇 MB 규모입니다. QR 도구는 서버가 필요 없고, 단축링크만 독립 Node 서비스와 전용 SQLite 저장소를 사용합니다. 현재 CRM 폴더·PM2·DB·인증키는 건드리지 않습니다.

`makesns-static.tar.gz`의 `install-static.sh`는 해시 검증 후 `/opt/makesns/releases/`에 파일을 설치하고 `current` 링크를 원자적으로 교체합니다. 이전 버전과 해시된 JS 파일을 보존해 구 화면을 열어둔 사용자의 청크 오류를 줄입니다. Nginx 설정 활성화나 인증서 발급은 하지 않습니다. 예시 설정은 검토용 `makesns-http.conf.example`에 있습니다.

다음 단계는 makesns.com DNS A 레코드를 139.162.84.156에 연결한 상태를 확인하고, 기존 호스트 설정과 겹치지 않는 별도 Nginx 사이트·Let's Encrypt HTTPS를 구성하는 것입니다. www는 DNS 여부를 확인한 뒤 별도로 추가합니다. CDN/압축·캐시 헤더는 실제 호스팅 구성에서 확인합니다.

## 검증과 다음 단계

단위 검증: 줄바꿈·문자 통계·Unicode 변환·자르기 좌표·파일 한도·이미지 헤더·다국어 메타정보. 브라우저: 한국어·영어·일본어 페이지·복사·탭·실제 PNG/ZIP 다운로드·모바일 폭·외부 요청 여부. 실제 파일 크기/해상도도 확인합니다. Lighthouse 95점은 목표이며 측정된 성능 점수를 주장하지 않습니다. iOS Safari·Android 실기기에서 다운로드/복사·메모리 사용을 추가 확인하는 것이 좋습니다.

다음 언어는 실제 사용자 피드백과 검색 자료를 보고 선택합니다. 언어별 사용 가이드를 정적으로 제공하며, 배포 후 기존 Google Search Console 속성에서 새 언어의 색인 상태를 확인합니다. GA4는 동의한 사용자에 한해 고정 스키마로 동작합니다.


## 선택적 GA4 분석

측정 ID `G-NV7DJD8JET`. Google Analytics 웹 스트림의 향상된 측정은 사용자 확인으로 꺼져 있습니다. 기본 동의 상태는 미선택이며 동의 전 Google 스크립트·분석 요청을 만들지 않습니다. 거부도 동의와 같은 단계에 표시하고 화면 하단 쿠키 설정에서 변경할 수 있습니다. 철회 시 GA 비활성화 플래그·쿠키 삭제 후 페이지를 다시 열어 SDK를 제거합니다. 다른 탭의 동의 변경도 반영합니다.

페이지 방문·복사 성공·이미지/ZIP 저장 요청을 고정 스키마로 보냅니다. 언어·도구·출력 형식·규격·파일 수만 사용하며 입력 문구·파일·파일명·클립보드 내용을 보내지 않습니다. URL의 쿼리·해시도 제외하고 리퍼러는 도메인만 사용합니다. 광고 개인화와 Google 신호는 비활성화합니다. Google의 기기 정보·대략적인 지역·쿠키 처리는 개인정보 안내 및 Google 정책을 참고합니다. 자동 향상된 측정을 다시 켜면 이 설계의 수집 범위를 벗어날 수 있으므로 계속 꺼둡니다.

Nginx CSP는 MakeSNS 관리 호스트에 한해 Google 태그 스크립트와 google-analytics.com 하위 도메인 연결을 허용해야 합니다. `makesns-analytics-update` 적용 스크립트가 알려진 기존 정책만 변경하고 실패 시 이전 사이트와 CSP를 복구합니다. 기존 구버전 도메인 설치 스크립트를 다시 실행하면 CSP가 이전 값으로 돌아갈 수 있으니 이후에는 정적 배포 설치 또는 최신 분석 설정을 사용합니다. 운영 데이터 수신 여부는 배포 후 실제 동의 방문자의 GA4 실시간 보고서에서 확인합니다.


## 일본어 확장

/ja/ 및 caption/fonts/symbols/resizer/privacy 정적 페이지를 제공합니다. 일본어 홈·도구 UI·오류·가이드·FAQ·동의 화면을 포함하고, 모든 언어의 hreflang·canonical·사이트맵을 서로 연결합니다. 검색 설명은 80자 이내입니다. 일본어 문자열 자체는 꾸미기 변환 대상이 아니며 영문·숫자만 스타일을 바꿉니다. GA4 측정 ID는 그대로 사용하고 ui_language=ja로 기록합니다. 기존 GA4의 ui_language 맞춤 측정기준을 다시 만들 필요가 없습니다.

makesns-ja-update의 apply-ja.sh는 기존 MakeSNS current를 보존한 뒤 정적 사이트만 교체합니다. HTTPS의 각 일본어 페이지·HTML 언어·canonical·hreflang·네이버 인증 및 일본어 사이트맵을 확인하고 실패 시 이전 current 링크로 복구합니다. Nginx·CRM·DB·인증서를 변경하지 않습니다. 기존 분석 동의 선택도 같은 브라우저 저장소 키로 유지합니다.


## 日本語フォント / 일본어 전용 글꼴

일본어 페이지는 @fontsource-variable/noto-sans-jp 5.3.1의 Noto Sans JP Variable을 자체 호스팅합니다. 가중치 100~900, font-display:swap, Unicode 범위별 WOFF2를 사용해 실제 표시 문자에 필요한 부분만 브라우저가 받습니다. Google Fonts CDN을 호출하지 않으며 기존 font-src self 정책을 유지합니다. 로딩 전/실패 시 Hiragino Sans, Hiragino Kaku Gothic ProN, Yu Gothic, Meiryo를 차례로 사용합니다. 영문·한국어 페이지의 본문 글꼴은 유지하고 브랜드 로고는 Arial로 통일합니다. 라이선스는 /fonts/noto-sans-jp-LICENSE.txt에 함께 배포합니다. 이 변경은 글꼴 도구의 Unicode 변환 결과 자체를 바꾸지 않습니다.

## Japanese copy

Japanese menus, button labels, examples, help text, errors, privacy copy and SEO descriptions use consistent Japanese SNS terminology: 改行ツール / おしゃれ文字 / 特殊文字・顔文字 / 画像リサイズ. Image editing uses トリミング and 保存形式; downloads are described as starting, not as confirmed device saves. Latin-only Unicode transformations are explained explicitly. Other locales, routes, analytics consent and processing behavior are unchanged.

## Profile showcase and editor

`/en/profile/`, `/ko/profile/`, `/ja/profile/` provide five localized fictional before/after profile themes. Localized homepages show the gallery below the hero, and navigation/tool pages link to the editor. The preview uses first-line display names and remaining-line bios, fictional account counts, theme colors and inline SVG illustrations with no external images or embeds. Mobile supports before/after switching and horizontal swipes; desktop shows both cards.

Copying a gallery template loads the editor after clipboard success. Loading without clipboard access is also available. Gallery browsing preserves draft text; replacing a dirty draft requires a visible confirmation. Edits are kept only in component memory and are discarded when leaving the page; raw input is never stored or included in URLs, analytics or requests. Only known sample IDs can be passed in URL fragments. The counter measures the bio separately from the display name; users must verify limits and rendering in the destination app and paste name/bio into the appropriate fields.

All sample bios fit within 150 UTF-16 units as well as grapheme clusters. Profile page metadata, language links, sitemap and consent-only `copy_complete` analytics use `tool_name=profile` and `ui_language` without draft content. This is not an official Instagram integration; mockups and business information are illustrative.

### Profile mockup appearance

Profile previews use neutral white/black interface chrome, a story-ring avatar, username header, post/follower/following statistics, blue follow and gray message placeholders, story highlights, grid/Reels/tagged icons, and three portrait post covers. Before and after use identical account and post samples, changing only the displayed name/bio. These are illustrative local mockups, not live Instagram embeds or pixel-identical guarantees; post covers are original graphic placeholders. All edit/copy and privacy behavior remains unchanged.

## Profile completion workflow — phase 1

The path is template choice → personal details → styles/symbols → preview and separate display-name/bio copies. New profiles start blank unless a template is explicitly chosen. The editor offers an embedded style/symbol picker; applying a font changes only the display name, while symbol insertion replaces the selected bio range without splitting emoji clusters. Decorative names can be converted back to plain Latin before restyling.

Font and symbol pages offer favorites and recently copied choices; fonts also offer script, bold, sans-serif, decorative and classic categories. “Use as profile name” and “Add to profile” transfer the chosen text through tab-scoped browser storage, never a URL or a server request. Favorites/recent history (`makesns.library.v1`, localStorage) contain only allowlisted style IDs and catalog symbols, not input sentences; history is unique and bounded to 24 entries. Favorites and history work without analytics consent. Multiple open pickers synchronize through browser events. Storage errors fall back to in-memory choices with a visible warning.

Profile drafts (`makesns.profile.draft.v1`, sessionStorage) contain the actual text and handle for continuation in the current tab. They restore after navigation/reload; a pending template does not overwrite edited text without confirmation. The user can clear the draft. Tab restoration behavior depends on the browser, so shared-device users should clear drafts explicitly. A write-only storage failure keeps the newest in-memory draft rather than restoring stale persisted text. Font/symbol transfer payloads are consumed once. Privacy notices describe the local storage behavior in all three languages.

Consent-only `profile_complete` events record successful final copy actions with only `tool_name=profile`, `ui_language`, and `copy_part=name|bio|all`. One person may copy multiple fields, so event counts are not unique completed-profile counts. No text, handle, favorites or draft data is sent. The current workspace has no GA4 read connector or property credentials; actual usage ranking has not been analyzed.

Whole-image/padding/background export is now implemented, as described below. Localized usage/example pages are now implemented below; analysis of actual GA4 usage remains future work.

## Whole-image fitting and padding

The resizer now offers Crop to fill and Fit whole image in all three languages. Fit keeps the full source inside the target ratio, centered, with 0–25% minimum padding per edge and a preset/custom background or transparency. Preview canvas and download export share the same drawing code. The chosen ratio/layout/padding/background apply to every selected file, while crop positions remain per image. No image upload or storage is added.

Selecting a transparent background switches JPG to PNG. If the user then chooses JPG, the preview and exported image use white, with an explanation. PNG/WebP can preserve alpha. Output filename extensions and download metrics use actual exported formats. Existing file/type/pixel limits and sequential ZIP processing remain. Optional analytics fit_mode is limited to crop|contain; colors, padding values, filenames and pixels are never analytics payloads.

Validation includes deterministic geometry tests, actual browser PNG pixel equality between preview and downloaded output, all target ratios/padding values, preserved source borders, custom background pixels, transparent PNG/WebP, white JPEG, crop-mode regression, downloaded ZIP inspection, and EN/KO/JA desktop/mobile layouts. Usage/example pages are described below. Review of actual GA4 statistics remains future work.

### Restyling existing template names

The café templates use small-cap spellings such as ɢɪʟ-ᴅᴏɴɢ and ʜᴀʀᴜ. These are now normalized to ordinary Latin capitals before comparing the 18 styles, along with the existing decorative alphabets. Pasted styled names also normalize before conversion. Empty inputs show style-specific samples with copy/apply disabled. Names containing only unsupported scripts remain unchanged, with separately labeled English comparison samples that are never copied or applied as part of the name.

## Localized usage examples

`/en/examples/`, `/ko/examples/`, `/ja/examples/` introduce three practical guides per language: `profile-bio`, `caption-spacing`, and `symbols`. The 12 new static routes include real before/after sample text, four usage steps, practical tips and FAQs, localized titles/descriptions, canonical/hreflang links, breadcrumb JSON-LD and sitemap entries. Homes, navigation, footers and relevant tool pages link to them.

Profile examples link to known theme IDs and preserve the existing dirty-draft confirmation. Symbol examples can append a chosen phrase without replacing the current name/handle/bio; overlong insertions are refused intact. Caption samples open the caption editor using only allowlisted public sample IDs in URL fragments. Unknown fragments do not load text or erase an existing caption. No typed text or drafts are put into URLs.

Known example routes participate in consent-only page/copy analytics under tool_name=examples; arbitrary guide paths and query/hash text are excluded. Search indexing and traffic results have not been claimed or measured. The sitemap URL is unchanged and now contains 34 content routes. Actual GA4 review remains the next task once property data can be provided/read.

### Example language consistency

English and Japanese owned profile/caption/usage examples are checked against Hangul syllable and Jamo ranges. When switching languages, an exact, unedited built-in profile draft is localized to the target language. Modified personal text/handles are preserved. Shared kaomoji that use Hangul letters as facial features have non-Hangul display/copy variants in EN/JA; canonical favorite/history IDs remain unchanged, including existing saved entries. Korean catalog display remains unchanged. Language-selector labels and personally written text are outside this sample-only localization behavior.

## QR & short links (2026-10-31)

`/{lang}/qr-code/`: browser-only QR generation, PNG 512/1024/2048 and SVG, UTF-8 content up to 1,500 bytes. No third-party QR API. `/{lang}/short-links/`: persistent public short URLs, immediate **302** redirect (explicit user choice), separate `/s/<code>/info` destination/report page, expiry and deletion via private management link. This URL feature is the exception to browser-only processing.

Standalone backend: `services/links/server.mjs` (Node >=22.13, built-in SQLite; no package dependencies), loopback3015, own `/var/lib/makesns-links/` data, own `makesns-links.service` and dedicated user. It does not use CRM DB, PM2, OAuth or credentials. In local development, route `/api/short-links*` and `/s/*` to this backend; static export by itself intentionally cannot create links.

No visit tracking. Management keys are returned once, saved in browser localStorage (latest50) and stored only as SHA256 hashes in SQLite. Clearing browser history does not delete public links. Destination URLs and browser keys are functional stored data; do not use URLs containing private documents or authentication tokens. Same-origin writes, limited body/URL sizes, HTTP(S) destinations only, private literal-address blocking, rate/cap limits. No destination fetches. IP request quotas are in memory and reset on restart, not durable anti-bot protection.

Use the cumulative `makesns-links-update.tar.gz` deployment rather than static installer alone. It adds only MakeSNS proxy locations, preserves both existing CSP declarations, checks the public API via local HTTPS/SNI, and restores previous site/config/service code on validation failure. Own data is retained on rollback. Back up and migrate `/var/lib/makesns-links/` with the `/s/` path to preserve shared links.

Validation: decoded actual multilingual QR PNG, valid SVG dimensions, direct302, expiry410, deletion keys, restart persistence, origin/URL/rate/cap rejection, escaped report page, analytics field allowlist; localized43-page SEO checks, desktop/mobile browser flow, simulated first-install/redeploy rollback. Production installation still needs to be run by the user.

## Five languages

Routes es (Español) and ms (Bahasa Melayu) join en/ko/ja. Each includes all tools, guides, 13 local profile templates, consent/privacy messages, SEO and a dedicated social image. See docs/LOCALIZATION.md for the dictionary and sample conventions. The five-language deployment also updates the isolated short-link service’s destination/report messages while preserving its own data.

## 인도네시아어 추가 (2026-11-01)

/id/는 /ms/와 독립적으로 운영합니다. 519개 문구·현지 예시 13종과 언어별 대표 이미지가 포함됩니다. 인도네시아어 추가 시점에는 7개 언어, 사이트맵 99개 페이지였습니다. 최신 배포·검증 범위는 docs/TURKISH-ROLLOUT.md를 참고하세요.

## 터키어 및 국기 (2026-11-01)

/tr/에 터키어 도구와 독립 프로필 13종을 추가했습니다. 8개 언어·사이트맵 113개 페이지입니다. 언어 선택은 로컬 SVG 국기와 언어명을 함께 표시합니다. 터키어 특수문자는 원문과 꾸미기 글꼴에서 보존하며, 검색에서만 표기를 유연하게 처리합니다. CRM 로그인 응답을 배포 전후 읽기 전용으로 검사합니다.

## 문자 라이브러리 확장

글자 스타일 26종·장식 48종·문자 1,596개와 다국어 분류·검색·바로 복사·문자 모으기를 제공합니다. 기존 즐겨찾기·프로필을 보존합니다. 변경 범위와 데이터 출처는 docs/LIBRARY-EXPANSION.md를 참고하세요.

## GitHub 보관과 자동 검사

최신 범위·운영 배포 상태·CI 구성은 [GitHub 개발 인계](docs/GITHUB-HANDOFF-2026-11-01.md)를 참고하세요. GitHub 업로드는 운영 서버 변경을 실행하지 않습니다.

## 서버 자동 배포

[GitHub Actions 최초 연결](docs/AUTO-DEPLOY.md)을 참고하세요. 최초 SSH 계정 설정과 Secrets 2개 등록 후 수동 배포를 확인하고, `MAKESNS_AUTO_DEPLOY=true`로 main push 자동 배포를 켭니다. 정적 사이트 전용이며 단축링크 백엔드·CRM은 변경하지 않습니다.
