<p align="center"><img src="../.github/icon.png" width="128" height="128" alt="앱 아이콘"></p>

<h1 align="center">웹에서 쓰는 YouTube 썸네일 · 프레임 추출 도구</h1>

<p align="center">
  <img alt="Web Component" src="https://img.shields.io/badge/Web%20Component-custom%20element-29ABE2?logo=webcomponentsdotorg&logoColor=white">
  <img alt="Runs in the browser: no server, no API key" src="https://img.shields.io/badge/runs%20in%20the%20browser-no%20server%20·%20no%20API%20key-2EA44F">
  <img alt="TypeScript 7" src="https://img.shields.io/badge/TypeScript-7-3178C6?logo=typescript&logoColor=white">
  <img alt="Lit 3" src="https://img.shields.io/badge/Lit-3-324FFF?logo=lit&logoColor=white">
  <a href="../LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-yellow"></a>
</p>

<p align="center"><a href="../README.md">English</a> · <b>한국어</b> · <a href="README.de.md">Deutsch</a> · <a href="README.es.md">Español</a> · <a href="README.fr.md">Français</a> · <a href="README.id.md">Bahasa Indonesia</a> · <a href="README.it.md">Italiano</a> · <a href="README.ja.md">日本語</a> · <a href="README.pl.md">Polski</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.vi.md">Tiếng Việt</a> · <a href="README.zh-Hans.md">简体中文</a> · <a href="README.zh-Hant.md">繁體中文</a></p>

YouTube 링크를 넣으면 그 영상에 대해 YouTube 가 내어 주는 이미지를 모두 찾아 주는 웹 컴포넌트입니다. 모든 크기의
썸네일, 영상 본래 화면비의 프레임, YouTube 가 스스로 고른 프레임을 내려받거나 복사하고, 형식을 바꾸거나 ZIP 으로
저장합니다. 모든 일이 브라우저 안에서 끝나므로 서버도 API 키도 필요 없습니다.

<p align="center"><img src="../.github/screenshot.jpg" width="720" alt="영상을 불러온 ThumbSnap — 링크 입력란, 형식 · 파일 이름 옵션, 영상의 제목 · 채널 · 배지 · 색상 · 다운로드 버튼"></p>

| 이미지 | 파일 | 크기 | 있는 영상 |
|---|---|---|---|
| 썸네일 | `maxresdefault` · `sddefault` · `hqdefault` · `mqdefault` · `default`, `maxresdefault` 가 없으면 `hq720` | 1280×720 부터 120×90 까지 | 모든 영상. 4:3 크기는 위아래에 검은 띠가 있고, 저해상도로 올린 영상에는 1280×720 · 640×480 이 없음 |
| 원본 비율 프레임 | `oar1`–`oar3`, `frame0`(첫 프레임) | Shorts 는 1080×1920, 그 밖에는 1920×1080 까지 | Shorts 와 오래된 영상. 최근 일반 영상에는 `frame0` 만 있음 |
| 자동 생성 프레임 | `1`–`3` 을 다섯 가지 크기로, 가장 큰 것은 `maxres1`–`maxres3` | 1280×720 부터 120×90 까지 | 라이브를 뺀 모든 영상 |
| WebP 버전 | 썸네일과 같은 크기들, `vi_webp` 아래 | 썸네일과 같음 | 보기와 열기만 — YouTube 가 CORS 없이 보냄 |

YouTube 는 이 가운데 무엇이 있는지 알려 주지 않으므로, ThumbSnap 은 파일마다 요청해서 답을 읽습니다. 없는 파일은 회색
120×90 이미지를 담은 404 로 옵니다. 썸네일을 자동 생성 프레임과 바이트 단위로 비교해 직접 올린 썸네일인지 자동 생성된
것인지 가리고, 제목 · 채널 · 세로 영상 여부는 YouTube 의 oEmbed 로 가져옵니다. YouTube 를 조사하며 알게 된 것은
[docs/youtube-thumbnails.md](youtube-thumbnails.md) 에 정리해 두었습니다.

도구는 13개 언어로 나옵니다 — 영어 · 한국어 · 일본어 · 중국어(간체 · 번체) · 독일어 · 스페인어 · 프랑스어 · 이탈리아어 ·
포르투갈어 · 폴란드어 · 인도네시아어 · 베트남어. 들어간 페이지의 언어를 따르고, 그 밖의 언어에서는 영어로 나옵니다.
페이지의 다크 모드도 따라갑니다.

이 저장소의 소스는 MIT 라이선스입니다. ThumbSnap 이라는 이름과 아이콘은 이 소스에 들어 있지 않습니다. 맨 위의 아이콘은
보여 드리려고 둔 그림으로, MIT 라이선스에 포함되지 않고 이 저장소로 빌드한 결과에도 들어가지 않습니다. ThumbSnap 은
YouTube · Google 과 관련이 없고, 썸네일의 권리는 그 제작자에게 있습니다.

## 써 보기

ThumbSnap 은 [hobbyworker.me](https://hobbyworker.me/ko/services/thumbsnap/) 에서 13개 언어로 쓸 수 있습니다.

## 요구 사항

- 최신 브라우저 — Chrome · Edge 111 이상, Safari 16.4 이상, Firefox 113 이상
- `i.ytimg.com`(이미지)과 `www.youtube.com`(oEmbed)에 접속할 수 있어야 합니다. 그 밖에는 아무 곳에도 접속하지 않습니다.
- 이미지 복사와 공유는 보안 페이지(HTTPS 또는 `localhost`)에서만 됩니다.

## 빌드

```sh
npm install
npm run dev     # 데모 페이지 — 언어 · 테마 전환
npm test        # 단위 테스트 (Vitest)
npm run build   # dist/thumbsnap.js, 소스 맵, THIRD_PARTY_LICENSES.txt
```

Node.js 24 에서 빌드와 테스트를 확인했습니다.

`dist/thumbsnap.js` 는 Lit 을 담은 ES 모듈 하나이고, 불러오면 `<thumb-snap>` 을 등록합니다. 배포할 때는
`THIRD_PARTY_LICENSES.txt` 를 함께 둡니다.

## 쓰는 법

1. YouTube 링크나 동영상 ID 를 하나 이상 붙여 넣습니다. watch · `youtu.be` · Shorts · 라이브 · 임베드 ·
   `music.youtube.com` 링크가 모두 되고, 재생목록은 대표 영상을 가져옵니다. 붙여 넣으면 바로 불러오고, 여러 개는 한 줄에
   하나씩 넣거나 링크를 도구 위로 끌어다 놓습니다.
2. 썸네일이 YouTube 에 있는 모든 크기로, 실제 해상도 · 파일 크기와 함께 나오고, 가장 큰 것에 **최고 화질** 표시가 붙습니다.
   <p align="center"><img src="../.github/thumbnails.jpg" width="720" alt="썸네일 섹션 — 1280×720 부터 120×90 까지 다섯 크기, 가장 큰 것에 최고 화질 표시, 각각 다운로드 · 복사 · 링크 · 공유 · 열기 버튼"></p>
3. **원본 비율 프레임** 은 YouTube 가 영상 본래 모양 그대로 캡처한 것입니다. Shorts 라면 1080×1920 세로 프레임 세 장과 첫
   프레임이 나옵니다.
   <p align="center"><img src="../.github/shorts.jpg" width="720" alt="Shorts 의 원본 비율 프레임 — 1080×1920 프레임 세 장과 268×480 첫 프레임"></p>
4. **자동 생성 프레임** 은 YouTube 가 스스로 고른 프레임 세 장입니다. 각 프레임 아래의 숫자로 다섯 가지 크기를 바꿉니다.
   <p align="center"><img src="../.github/frames.jpg" width="720" alt="1280×720 의 자동 생성 프레임 1–3 과 크기 버튼 1280 · 640 · 480 · 320 · 120"></p>
5. 이미지마다 다운로드 · 이미지 복사 · 주소 복사 · 공유(파일 공유를 지원하는 기기에서) · 열기를 할 수 있습니다.
   **최고 화질 다운로드** 와 **전체 다운로드 (ZIP)** 는 영상 하나 전체를 다루고, 영상이 여럿이면
   **모든 동영상 다운로드 (ZIP)** 가 영상마다 폴더를 나눠 담습니다.
6. **형식** 은 PNG · WebP 로 바꾸고(브라우저가 만들 수 있는 형식만 나옵니다), **검은 여백 제거** 는 4:3 이미지의 검은 띠를
   잘라 내며, **파일 이름** 은 동영상 ID, 또는 제목과 동영상 ID 로 정합니다.
7. **삽입 코드** 는 클릭할 수 있는 썸네일의 Markdown · HTML 을 줍니다. 주소창에 `?v=` 가 남아 결과를 공유할 수 있고,
   최근 항목은 브라우저에 남습니다.
   <p align="center"><img src="../.github/embed.jpg" width="720" alt="삽입 코드 — Markdown · HTML · 이미지 URL, 각각 복사 버튼"></p>

## 페이지에 넣기

```html
<script type="module" src="thumbsnap.js"></script>
<thumb-snap></thumb-snap>
```

| 속성 | 기본값 | |
|---|---|---|
| `locale` | 가장 가까운 `lang` 속성 | `en` `ko` `ja` `zh-hans` `zh-hant` `id` `es` `fr` `pt` `vi` `de` `it` `pl`. `zh-TW` · `pt-BR` 같은 태그도 알맞게 바꿉니다 |
| `theme` | `auto` | `auto` 는 `<html>` 의 `data-theme` · `data-color-scheme` · `data-bs-theme`, `dark` · `light` 클래스, `color-scheme` 을 차례로 보고, 없으면 시스템 설정을 따릅니다. `light` · `dark` 는 고정 |
| `value` | | 시작할 때 불러올 링크나 ID |
| `no-url-sync` | 꺼짐 | 주소창의 `?v=` · `?list=` 를 건드리지 않음 |
| `no-history` | 꺼짐 | 최근 항목을 `localStorage` 에 남기지 않음 |
| `max-videos` | `20` | 한 번에 불러오는 최대 영상 수 |

- CSS 사용자 속성: `--thumbsnap-accent`, `--thumbsnap-accent-hover`, `--thumbsnap-radius`, `--thumbsnap-font`
- 동작마다 버블링 · composed `thumbsnap` 이벤트가 나갑니다. `detail` 은 `{ action, videoId?, variant?, format?, count? }` 이고,
  `action` 은 `resolve` · `download` · `download-zip` · `copy-image` · `copy-text` · `share` · `error` 가운데 하나입니다.
- `load(text)` 는 입력한 것처럼 링크를 불러오고, `clear()` 는 도구를 비웁니다.
- `slot="footer"` 를 단 내용이 도구 아래에 나옵니다. 하위 클래스에서 `renderFooter()` 를 바꿀 수도 있습니다. 이때는
  아무것도 등록하지 않는 `src/index.ts` 를 가져와 `defineThumbSnap()` 으로 직접 등록합니다.

`parseTarget` · `extractTargets` · `imageUrl` · `loadImage` · `fetchOEmbed` · `transformImage` · `findContentRect` ·
`extractPalette` · `createZip` 같은 부품도 화면 없이 쓸 수 있게 내보냅니다.

## 구조

```
src/
├── core/       링크 · CDN 의 파일 · 불러오기와 확인 · oEmbed · 자르기 · 변환 · 색상 · ZIP · 파일 이름 (화면 없음)
├── i18n/       en(원문) · ko · ja · zh-hans · zh-hant · id · es · fr · pt · vi · de · it · pl
├── ui/         <thumb-snap> 요소 (Lit) — 페이지의 언어와 테마, 영상 하나의 상태, 템플릿, 스타일
├── index.ts    공개 API — 아무것도 등록하지 않음
└── auto.ts     번들의 진입점 — <thumb-snap> 을 등록
tests/          Vitest — 링크 · 파일 · ZIP · 자르기 · oEmbed · 번역 카탈로그 · 최고 화질 고르기
docs/           YouTube 가 내어 주는 것, 그리고 이 README 들
index.html      데모 페이지
```

모든 카탈로그는 `en.ts` 와 키 · 자리표시자가 같아야 하고, 타입 검사와 테스트가 이를 지킵니다.

## 한계

- YouTube 는 이 파일들을 문서로 밝히지 않습니다. 무엇이 어디에 있는지는 바뀔 수 있습니다.
- 직접 올린 썸네일과 자동 생성된 것은 `hq1`–`hq3` 과의 바이트 비교로 가립니다. Studio 의 다른 자동 추천을 고른 경우에도
  직접 올린 것으로 보입니다.
- YouTube 의 WebP 파일은 열기만 됩니다. CORS 가 없어 페이지에서 저장하거나 변환할 수 없습니다. JPEG 를 WebP 로 변환하면
  같은 결과를 얻습니다.
- YouTube 의 서명이 필요한 파일 — Shorts 의 세로 커버, 애니메이션 미리보기, 스토리보드 — 과 재생목록 · 채널 전체는 서버
  없이는 가져올 수 없습니다.
- 없는 파일을 확인하는 과정에서 브라우저 콘솔에 404 가 남습니다.
