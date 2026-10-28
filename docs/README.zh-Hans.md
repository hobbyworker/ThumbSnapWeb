<p align="center"><img src="../.github/icon.png" width="128" height="128" alt="应用图标"></p>

<h1 align="center">网页版 YouTube 缩略图和视频帧提取工具</h1>

<p align="center">
  <img alt="Web Component" src="https://img.shields.io/badge/Web%20Component-custom%20element-29ABE2?logo=webcomponentsdotorg&logoColor=white">
  <img alt="Runs in the browser: no server, no API key" src="https://img.shields.io/badge/runs%20in%20the%20browser-no%20server%20·%20no%20API%20key-2EA44F">
  <img alt="TypeScript 7" src="https://img.shields.io/badge/TypeScript-7-3178C6?logo=typescript&logoColor=white">
  <img alt="Lit 3" src="https://img.shields.io/badge/Lit-3-324FFF?logo=lit&logoColor=white">
  <a href="../LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-yellow"></a>
</p>

<p align="center"><a href="../README.md">English</a> · <a href="README.ko.md">한국어</a> · <a href="README.de.md">Deutsch</a> · <a href="README.es.md">Español</a> · <a href="README.fr.md">Français</a> · <a href="README.id.md">Bahasa Indonesia</a> · <a href="README.it.md">Italiano</a> · <a href="README.ja.md">日本語</a> · <a href="README.pl.md">Polski</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.vi.md">Tiếng Việt</a> · <b>简体中文</b> · <a href="README.zh-Hant.md">繁體中文</a></p>

这是一个 Web 组件：输入 YouTube 链接，它就会找出 YouTube 为每个视频提供的所有图片——各种尺寸的缩略图、保持视频原始宽高比的画面，以及 YouTube 自动选取的画面——供你下载、复制、转换或打包成 ZIP 保存。它完全在浏览器中运行，无需服务器，也无需 API 密钥。

<p align="center"><img src="../.github/screenshot.jpg" width="720" alt="已加载视频的 ThumbSnap：链接输入框、格式和文件名选项，以及视频的标题、频道、徽章、颜色和下载按钮"></p>

| 图片 | 文件 | 尺寸 | 适用视频 |
|---|---|---|---|
| 缩略图 | `maxresdefault`、`sddefault`、`hqdefault`、`mqdefault`、`default`，`maxresdefault` 缺失时还有 `hq720` | 1280×720 至 120×90 | 所有视频；4:3 尺寸带有上下黑边，低分辨率上传的视频没有 1280×720 和 640×480 |
| 原始比例画面 | `oar1`–`oar3`，以及 `frame0`（第一帧） | Shorts 为 1080×1920，其他视频最高 1920×1080 | Shorts 和较早的视频；近期的普通视频只有 `frame0` |
| 自动生成的画面 | `1`–`3`，各有五种尺寸，最大的是 `maxres1`–`maxres3` | 1280×720 至 120×90 | 除直播外的所有视频 |
| WebP 版本 | 缩略图的各个尺寸，位于 `vi_webp` 下 | 与缩略图相同 | 只能显示和打开——YouTube 发送它们时不带 CORS |

YouTube 不会说明其中哪些文件存在，所以 ThumbSnap 会逐一请求每个文件，并读取响应：不存在的文件会返回 404，并附带一张灰色的 120×90 占位图。它将缩略图与自动生成的画面逐字节比较，以区分上传的缩略图和自动生成的缩略图，并通过 YouTube 的 oEmbed 端点获取标题、频道以及视频是否为竖屏。探查 YouTube 得到的结果记录在 [docs/youtube-thumbnails.md](youtube-thumbnails.md) 中。

本工具提供 13 种语言：英语、韩语、日语、中文（简体、繁体）、德语、西班牙语、法语、意大利语、葡萄牙语、波兰语、印度尼西亚语和越南语。工具会跟随所在页面的语言，其他语言则显示为英语。它也会跟随页面的深色模式。

本仓库的源代码采用 MIT 许可证。ThumbSnap 这一名称及其图标不包含在此源代码中。顶部的图标仅供展示，不在 MIT 许可证的范围内，用本仓库构建出的文件中也不包含它。ThumbSnap 与 YouTube 及 Google 无关，缩略图的版权归其创作者所有。

## 试用

ThumbSnap 已在 [hobbyworker.me](https://hobbyworker.me/zh-hans/services/thumbsnap/) 上线，支持全部 13 种语言。

## 系统要求

- 较新的浏览器：Chrome 或 Edge 111 或更高版本、Safari 16.4 或更高版本、Firefox 113 或更高版本。
- 能够访问 `i.ytimg.com`（图片）和 `www.youtube.com`（oEmbed）。不会连接其他任何地址。
- 复制图片和分享需要安全的页面：HTTPS 或 `localhost`。

## 构建

```sh
npm install
npm run dev     # 演示页面，带语言和主题切换
npm test        # 单元测试（Vitest）
npm run build   # dist/thumbsnap.js、其 source map 和 THIRD_PARTY_LICENSES.txt
```

已在 Node.js 24 上验证构建和测试。

`dist/thumbsnap.js` 是一个包含 Lit 的单一 ES 模块，加载时会注册 `<thumb-snap>`。发布时请一并附上 `THIRD_PARTY_LICENSES.txt`。

## 使用方法

1. 粘贴一个或多个 YouTube 链接或视频 ID。支持 watch、`youtu.be`、Shorts、直播、嵌入和 `music.youtube.com` 链接，播放列表则会加载其封面视频。粘贴的链接会立即加载；多个链接请每行一个，也可以把链接拖放到工具上。
2. 缩略图会以 YouTube 提供的所有尺寸列出，每张都标明实际尺寸和文件大小，最大的那张标记为**最佳**。
   <p align="center"><img src="../.github/thumbnails.jpg" width="720" alt="“缩略图”部分：从 1280×720 到 120×90 的五种尺寸，最大的标有“最佳”，每张都带有下载、复制、链接、分享和打开按钮"></p>
3. **原始比例画面**是 YouTube 按视频本身的形状截取的画面——如果是 Shorts，则是三张 1080×1920 的竖屏画面和它的第一帧。
   <p align="center"><img src="../.github/shorts.jpg" width="720" alt="Shorts 的原始比例画面：三张 1080×1920 的画面和一张 268×480 的第一帧"></p>
4. **自动生成的画面**是 YouTube 自动选取的三帧画面；每帧下方的数字可在五种尺寸之间切换。
   <p align="center"><img src="../.github/frames.jpg" width="720" alt="自动生成的第 1–3 帧（1280×720），以及尺寸按钮 1280、640、480、320 和 120"></p>
5. 每张图片都可以下载、复制为图片、复制网址或打开，在能分享文件的设备上还可以分享。**下载最佳画质**和**全部下载 (ZIP)** 以整个视频为单位；有多个视频时，**下载所有视频 (ZIP)** 会把每个视频放进各自的文件夹。
6. **格式**可转换为 PNG 或 WebP（只列出浏览器能够编码的格式），**去除黑边**会裁掉 4:3 图片的上下黑边，**文件名**可以使用视频 ID，或者标题加 ID。
7. **嵌入代码**提供可点击缩略图的 Markdown 和 HTML。地址栏会保留 `?v=`，因此可以分享结果；最近的视频会保存在浏览器中。
   <p align="center"><img src="../.github/embed.jpg" width="720" alt="嵌入代码：Markdown、HTML 和图片网址，各带一个“复制”按钮"></p>

## 在网页中使用

```html
<script type="module" src="thumbsnap.js"></script>
<thumb-snap></thumb-snap>
```

| 属性 | 默认值 | |
|---|---|---|
| `locale` | 最近的 `lang` 属性 | `en` `ko` `ja` `zh-hans` `zh-hant` `id` `es` `fr` `pt` `vi` `de` `it` `pl`；`zh-TW`、`pt-BR` 等语言标签会映射到对应的语言 |
| `theme` | `auto` | `auto` 依次跟随 `<html>` 的 `data-theme`、`data-color-scheme` 或 `data-bs-theme`，其 `dark` 或 `light` 类名，或其 `color-scheme`，最后是系统设置；`light` 和 `dark` 则固定主题 |
| `value` | | 启动时加载的链接或 ID |
| `no-url-sync` | 关闭 | 不改动地址栏中的 `?v=` 和 `?list=` |
| `no-history` | 关闭 | 不在 `localStorage` 中保存最近的视频 |
| `max-videos` | `20` | 一次最多加载的视频数 |

- CSS 自定义属性：`--thumbsnap-accent`、`--thumbsnap-accent-hover`、`--thumbsnap-radius`、`--thumbsnap-font`。
- 每个操作都会触发一个可冒泡、composed 的 `thumbsnap` 事件。其 `detail` 为 `{ action, videoId?, variant?, format?, count? }`，`action` 为 `resolve`、`download`、`download-zip`、`copy-image`、`copy-text`、`share` 或 `error`。
- `load(text)` 会像手动输入一样加载链接；`clear()` 会清空工具。
- 带有 `slot="footer"` 的内容会显示在工具下方。也可以改为在子类中重写 `renderFooter()`：导入不注册任何元素的 `src/index.ts`，再用 `defineThumbSnap()` 注册元素。

`parseTarget`、`extractTargets`、`imageUrl`、`loadImage`、`fetchOEmbed`、`transformImage`、`findContentRect`、`extractPalette`、`createZip` 等底层函数也一并导出，可以脱离界面单独使用。

## 结构

```
src/
├── core/       链接、CDN 上的文件、加载与探测、oEmbed、裁剪、转换与颜色、ZIP、文件名（不含界面）
├── i18n/       en（原文）、ko、ja、zh-hans、zh-hant、id、es、fr、pt、vi、de、it、pl
├── ui/         <thumb-snap> 元素（Lit）— 页面的语言和主题、单个视频的状态、模板、样式
├── index.ts    公共 API；不注册任何元素
└── auto.ts     打包入口；注册 <thumb-snap>
tests/          Vitest — 链接、文件、ZIP、裁剪、oEmbed、语言包、最佳尺寸的选择
docs/           YouTube 提供的内容，以及这些 README
index.html      演示页面
```

每个语言包都与 `en.ts` 具有相同的键和占位符，由类型检查和测试来保证。

## 限制

- YouTube 没有为这些文件提供任何文档。哪些文件存在、位于何处，都可能发生变化。
- 上传的缩略图与自动生成的缩略图，是通过与 `hq1`–`hq3` 比较字节来区分的。创作者如果选用了 YouTube 工作室的其他推荐画面，看起来也会像是上传的。
- YouTube 的 WebP 文件只能打开：由于没有 CORS，页面无法保存或转换它们。把 JPEG 转换为 WebP 也能得到同样的结果。
- 需要 YouTube 签名的文件（Shorts 的竖屏封面、动态预览、故事板），以及整个播放列表或频道，没有服务器就无法获取。
- 检查不存在的文件会在浏览器控制台中留下 404 错误。
