<p align="center"><img src="../.github/icon.png" width="128" height="128" alt="App 圖像"></p>

<h1 align="center">網頁版 YouTube 縮圖和畫面擷取工具</h1>

<p align="center">
  <img alt="Web Component" src="https://img.shields.io/badge/Web%20Component-custom%20element-29ABE2?logo=webcomponentsdotorg&logoColor=white">
  <img alt="Runs in the browser: no server, no API key" src="https://img.shields.io/badge/runs%20in%20the%20browser-no%20server%20·%20no%20API%20key-2EA44F">
  <img alt="TypeScript 7" src="https://img.shields.io/badge/TypeScript-7-3178C6?logo=typescript&logoColor=white">
  <img alt="Lit 3" src="https://img.shields.io/badge/Lit-3-324FFF?logo=lit&logoColor=white">
  <a href="../LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-yellow"></a>
</p>

<p align="center"><a href="../README.md">English</a> · <a href="README.ko.md">한국어</a> · <a href="README.de.md">Deutsch</a> · <a href="README.es.md">Español</a> · <a href="README.fr.md">Français</a> · <a href="README.id.md">Bahasa Indonesia</a> · <a href="README.it.md">Italiano</a> · <a href="README.ja.md">日本語</a> · <a href="README.pl.md">Polski</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.vi.md">Tiếng Việt</a> · <a href="README.zh-Hans.md">简体中文</a> · <b>繁體中文</b></p>

這是一個 Web 元件：輸入 YouTube 連結，它就會找出 YouTube 為每部影片提供的所有圖片——各種尺寸的縮圖、保持影片原始長寬比的畫面，以及 YouTube 自動選出的畫面——供你下載、複製、轉換或打包成 ZIP 儲存。它完全在瀏覽器中執行，不需要伺服器，也不需要 API 金鑰。

<p align="center"><img src="../.github/screenshot.jpg" width="720" alt="已載入影片的 ThumbSnap：連結輸入欄位、格式和檔案名稱選項，以及影片的標題、頻道、徽章、顏色和下載按鈕"></p>

| 圖片 | 檔案 | 尺寸 | 適用影片 |
|---|---|---|---|
| 縮圖 | `maxresdefault`、`sddefault`、`hqdefault`、`mqdefault`、`default`，缺少 `maxresdefault` 時還有 `hq720` | 1280×720 至 120×90 | 所有影片；4:3 尺寸帶有上下黑邊，低解析度上傳的影片沒有 1280×720 和 640×480 |
| 原始比例畫面 | `oar1`–`oar3`，以及 `frame0`（第一張畫面） | Shorts 為 1080×1920，其他影片最高 1920×1080 | Shorts 和較早的影片；近期的一般影片只有 `frame0` |
| 自動產生的畫面 | `1`–`3`，各有五種尺寸，最大的是 `maxres1`–`maxres3` | 1280×720 至 120×90 | 直播以外的所有影片 |
| WebP 版本 | 縮圖的各個尺寸，位於 `vi_webp` 下 | 與縮圖相同 | 只能顯示和開啟——YouTube 傳送它們時不帶 CORS |

YouTube 不會說明其中哪些檔案存在，所以 ThumbSnap 會逐一請求每個檔案，並讀取回應：不存在的檔案會以 404 傳回，並附帶一張灰色的 120×90 佔位圖。它會逐位元組比較縮圖和自動產生的畫面，藉此分辨上傳的縮圖和自動產生的縮圖，並透過 YouTube 的 oEmbed 端點取得標題、頻道以及影片是否為直式。探查 YouTube 的結果記錄在 [docs/youtube-thumbnails.md](youtube-thumbnails.md) 中。

本工具提供 13 種語言：英文、韓文、日文、中文（簡體、繁體）、德文、西班牙文、法文、義大利文、葡萄牙文、波蘭文、印尼文和越南文。工具會依照所在頁面的語言顯示，其他語言則顯示英文。它也會跟隨頁面的深色模式。

本儲存庫的原始碼採用 MIT 授權條款。ThumbSnap 這個名稱及其圖像不包含在此原始碼中。最上方的圖像僅供展示，不在 MIT 授權條款的範圍內，以本儲存庫建置出的檔案也不包含它。ThumbSnap 與 YouTube 及 Google 無關，縮圖的版權屬於其創作者。

## 試用

ThumbSnap 已在 [hobbyworker.me](https://hobbyworker.me/zh-hant/tools/thumbsnap/) 上線，支援全部 13 種語言。

## 系統需求

- 較新的瀏覽器：Chrome 或 Edge 111 或以上版本、Safari 16.4 或以上版本、Firefox 113 或以上版本。
- 能夠存取 `i.ytimg.com`（圖片）和 `www.youtube.com`（oEmbed）。不會連線到其他任何地方。
- 複製圖片和分享需要安全的頁面：HTTPS 或 `localhost`。

## 建置

```sh
npm install
npm run dev     # 示範頁面，附語言和主題切換
npm test        # 單元測試（Vitest）
npm run build   # dist/thumbsnap.js、其 source map 和 THIRD_PARTY_LICENSES.txt
```

已在 Node.js 24 上確認建置與測試。

`dist/thumbsnap.js` 是包含 Lit 的單一 ES 模組，載入時會註冊 `<thumb-snap>`。發佈時請一併附上 `THIRD_PARTY_LICENSES.txt`。

## 使用方式

1. 貼上一個或多個 YouTube 連結或影片 ID。支援 watch、`youtu.be`、Shorts、直播、嵌入和 `music.youtube.com` 連結，播放清單則會載入其封面影片。貼上的連結會立即載入；多個連結請每行一個，也可以把連結拖放到工具上。
2. 縮圖會以 YouTube 提供的所有尺寸列出，每張都標示實際尺寸和檔案大小，最大的那張標記為**最佳**。
   <p align="center"><img src="../.github/thumbnails.jpg" width="720" alt="「縮圖」區段：從 1280×720 到 120×90 的五種尺寸，最大的標記為「最佳」，每張都有下載、複製、連結、分享和開啟按鈕"></p>
3. **原始比例畫面**是 YouTube 依影片本身的形狀擷取的畫面——若是 Shorts，則是三張 1080×1920 的直式畫面和它的第一張畫面。
   <p align="center"><img src="../.github/shorts.jpg" width="720" alt="Shorts 的原始比例畫面：三張 1080×1920 的畫面，以及 268×480 的第一張畫面"></p>
4. **自動產生的畫面**是 YouTube 自動選出的三張畫面；每張下方的數字可在五種尺寸之間切換。
   <p align="center"><img src="../.github/frames.jpg" width="720" alt="自動產生的第 1–3 張畫面（1280×720），以及尺寸按鈕 1280、640、480、320 和 120"></p>
5. 每張圖片都可以下載、複製為圖片、複製網址或開啟，在能分享檔案的裝置上還可以分享。**下載最佳畫質**和**全部下載 (ZIP)** 以整部影片為單位；有多部影片時，**下載所有影片 (ZIP)** 會把每部影片放進各自的資料夾。
6. **格式**可轉換為 PNG 或 WebP（只會列出瀏覽器能編碼的格式），**移除黑邊**會裁掉 4:3 圖片的上下黑邊，**檔案名稱**可以使用影片 ID，或標題加上 ID。
7. **嵌入程式碼**提供可點擊縮圖的 Markdown 和 HTML。網址列會保留 `?v=`，因此可以分享結果；最近的影片會保存在瀏覽器中。
   <p align="center"><img src="../.github/embed.jpg" width="720" alt="嵌入程式碼：Markdown、HTML 和圖片網址，各有一個「複製」按鈕"></p>

## 在網頁中使用

```html
<script type="module" src="thumbsnap.js"></script>
<thumb-snap></thumb-snap>
```

| 屬性 | 預設值 | |
|---|---|---|
| `locale` | 最接近的 `lang` 屬性 | `en` `ko` `ja` `zh-hans` `zh-hant` `id` `es` `fr` `pt` `vi` `de` `it` `pl`；`zh-TW`、`pt-BR` 等語言標籤會對應到相應的語言 |
| `theme` | `auto` | `auto` 依序跟隨 `<html>` 的 `data-theme`、`data-color-scheme` 或 `data-bs-theme`，其 `dark` 或 `light` 類別，或其 `color-scheme`，最後是系統設定；`light` 和 `dark` 則固定主題 |
| `value` | | 啟動時要載入的連結或 ID |
| `no-url-sync` | 關閉 | 不更動網址列中的 `?v=` 和 `?list=` |
| `no-history` | 關閉 | 不在 `localStorage` 中保存最近的影片 |
| `max-videos` | `20` | 一次最多載入的影片數 |

- CSS 自訂屬性：`--thumbsnap-accent`、`--thumbsnap-accent-hover`、`--thumbsnap-radius`、`--thumbsnap-font`。
- 每個操作都會觸發一個可冒泡、composed 的 `thumbsnap` 事件。其 `detail` 為 `{ action, videoId?, variant?, format?, count? }`，`action` 為 `resolve`、`download`、`download-zip`、`copy-image`、`copy-text`、`share` 或 `error`。
- `load(text)` 會像手動輸入一樣載入連結；`clear()` 會清空工具。
- 帶有 `slot="footer"` 的內容會顯示在工具下方。也可以改為在子類別中覆寫 `renderFooter()`：匯入不會註冊任何元素的 `src/index.ts`，再用 `defineThumbSnap()` 註冊元素。

`parseTarget`、`extractTargets`、`imageUrl`、`loadImage`、`fetchOEmbed`、`transformImage`、`findContentRect`、`extractPalette`、`createZip` 等底層函式也一併匯出，可以脫離介面單獨使用。

## 架構

```
src/
├── core/       連結、CDN 上的檔案、載入與探查、oEmbed、裁切、轉換與顏色、ZIP、檔案名稱（不含介面）
├── i18n/       en（原文）、ko、ja、zh-hans、zh-hant、id、es、fr、pt、vi、de、it、pl
├── ui/         <thumb-snap> 元素（Lit）— 頁面的語言和主題、單一影片的狀態、範本、樣式
├── index.ts    公開 API；不註冊任何元素
└── auto.ts     打包檔的進入點；註冊 <thumb-snap>
tests/          Vitest — 連結、檔案、ZIP、裁切、oEmbed、語系檔、最佳尺寸的選擇
docs/           YouTube 提供的內容，以及這些 README
index.html      示範頁面
```

每個語系檔都和 `en.ts` 具有相同的鍵和佔位符，由型別檢查和測試來確保。

## 限制

- YouTube 沒有為這些檔案提供任何說明文件。哪些檔案存在、位於何處，都可能改變。
- 上傳的縮圖和自動產生的縮圖，是透過與 `hq1`–`hq3` 比較位元組來分辨的。創作者如果選用了 YouTube 工作室的其他建議畫面，看起來也會像是上傳的。
- YouTube 的 WebP 檔案只能開啟：由於沒有 CORS，頁面無法儲存或轉換它們。把 JPEG 轉換成 WebP 也能得到相同的結果。
- 近期的一般影片沒有原始比例畫面，因此那三張卡片會顯示「無法提供」。
- 需要 YouTube 簽章的檔案（Shorts 的直式封面、動態預覽、分鏡圖），以及整個播放清單或頻道，沒有伺服器就無法取得。
- 檢查不存在的檔案時，瀏覽器的控制台會留下 404 錯誤。
