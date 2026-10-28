<p align="center"><img src=".github/icon.png" width="128" height="128" alt="App icon"></p>

<h1 align="center">YouTube thumbnail and frame extractor for the web</h1>

<p align="center">
  <img alt="Web Component" src="https://img.shields.io/badge/Web%20Component-custom%20element-29ABE2?logo=webcomponentsdotorg&logoColor=white">
  <img alt="Runs in the browser: no server, no API key" src="https://img.shields.io/badge/runs%20in%20the%20browser-no%20server%20·%20no%20API%20key-2EA44F">
  <img alt="TypeScript 7" src="https://img.shields.io/badge/TypeScript-7-3178C6?logo=typescript&logoColor=white">
  <img alt="Lit 3" src="https://img.shields.io/badge/Lit-3-324FFF?logo=lit&logoColor=white">
  <a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-yellow"></a>
</p>

<p align="center"><b>English</b> · <a href="docs/README.ko.md">한국어</a> · <a href="docs/README.de.md">Deutsch</a> · <a href="docs/README.es.md">Español</a> · <a href="docs/README.fr.md">Français</a> · <a href="docs/README.id.md">Bahasa Indonesia</a> · <a href="docs/README.it.md">Italiano</a> · <a href="docs/README.ja.md">日本語</a> · <a href="docs/README.pl.md">Polski</a> · <a href="docs/README.pt-BR.md">Português (Brasil)</a> · <a href="docs/README.vi.md">Tiếng Việt</a> · <a href="docs/README.zh-Hans.md">简体中文</a> · <a href="docs/README.zh-Hant.md">繁體中文</a></p>

A web component that takes YouTube links and finds every image YouTube serves for each video — the
thumbnail in all its sizes, frames in the video's own aspect ratio, and the frames YouTube picks by
itself — to download, copy, convert or save as a ZIP. It works entirely in the browser: no server,
no API key.

<p align="center"><img src=".github/screenshot.jpg" width="720" alt="ThumbSnap with a video loaded: the link field, the format and file name options, and the video's title, channel, badges, colours and download buttons"></p>

| Images | Files | Size | Which videos |
|---|---|---|---|
| Thumbnail | `maxresdefault` · `sddefault` · `hqdefault` · `mqdefault` · `default`, and `hq720` when `maxresdefault` is missing | 1280×720 down to 120×90 | every video; the 4:3 sizes are letterboxed, and low-resolution uploads have no 1280×720 or 640×480 |
| Original-ratio frames | `oar1`–`oar3`, and `frame0` (the first frame) | 1080×1920 for Shorts, up to 1920×1080 otherwise | Shorts and older videos; recent regular videos have only `frame0` |
| Auto-generated frames | `1`–`3` in five sizes, `maxres1`–`maxres3` the largest | 1280×720 down to 120×90 | every video except live streams |
| WebP versions | the thumbnail sizes, under `vi_webp` | as the thumbnail | shown and opened only — YouTube sends them without CORS |

YouTube doesn't say which of these exist, so ThumbSnap asks for each file and reads the answer: a
missing one comes back as a 404 carrying a grey 120×90 placeholder. It compares the thumbnail with the
auto-generated frames byte for byte to tell an uploaded thumbnail from an auto-generated one, and gets
the title, the channel and whether the video is vertical from YouTube's oEmbed endpoint. What probing
YouTube turned up is written down in [docs/youtube-thumbnails.md](docs/youtube-thumbnails.md).

The tool is available in 13 languages — English, Korean, Japanese, Chinese (Simplified and
Traditional), German, Spanish, French, Italian, Portuguese, Polish, Indonesian and Vietnamese — and
follows the language of the page it sits in. Other languages get English. It follows the page's dark
mode too.

The source in this repository is MIT licensed. The name ThumbSnap and its icon are not part of this
source. The icon at the top is shown for reference only: it is not covered by the MIT license, and
builds from this repository don't include it. ThumbSnap is not affiliated with YouTube or Google, and
thumbnails belong to their creators.

## Try it

ThumbSnap runs on [hobbyworker.me](https://hobbyworker.me/en/tools/thumbsnap/), in all 13 languages.

## Requirements

- A current browser: Chrome or Edge 111 or later, Safari 16.4 or later, Firefox 113 or later.
- Access to `i.ytimg.com` (images) and `www.youtube.com` (oEmbed). Nothing else is contacted.
- Copying images and sharing need a secure page — HTTPS or `localhost`.

## Building

```sh
npm install
npm run dev     # the demo page, with language and theme switches
npm test        # unit tests (Vitest)
npm run build   # dist/thumbsnap.js, its source map and THIRD_PARTY_LICENSES.txt
```

Building and testing have been checked with Node.js 24.

`dist/thumbsnap.js` is a single ES module that includes Lit and registers `<thumb-snap>` when it
loads. Ship `THIRD_PARTY_LICENSES.txt` with it.

## Using it

1. Paste one or more YouTube links or video IDs. Watch, `youtu.be`, Shorts, live, embed and
   `music.youtube.com` links all work, and a playlist brings its cover video. A pasted link loads at
   once; several go one per line, or drop a link onto the tool.
2. The thumbnail comes in every size YouTube has, each with its real size and file size, and the
   largest is marked **Best**.
   <p align="center"><img src=".github/thumbnails.jpg" width="720" alt="The Thumbnails section: five sizes from 1280×720 to 120×90, the largest marked Best, each with download, copy, link, share and open buttons"></p>
3. **Original-ratio frames** are what YouTube captured in the video's own shape — for a Short, three
   vertical 1080×1920 frames and its first frame.
   <p align="center"><img src=".github/shorts.jpg" width="720" alt="Original-ratio frames of a Short: three 1080×1920 frames and a 268×480 first frame"></p>
4. **Auto-generated frames** are the three frames YouTube picks by itself; the numbers under each one
   switch between its five sizes.
   <p align="center"><img src=".github/frames.jpg" width="720" alt="Auto-generated frames 1 to 3 at 1280×720, with size buttons 1280, 640, 480, 320 and 120"></p>
5. Every image can be downloaded, copied as an image, have its address copied, be shared where the
   device can share files, or be opened. **Download best** and **Download all (ZIP)** cover the whole
   video; with several videos, **Download every video (ZIP)** puts each one in its own folder.
6. **Format** converts to PNG or WebP (only what the browser can encode is offered), **Remove black
   bars** crops the letterboxing from 4:3 images, and **File name** uses the video ID, or the title and
   the ID.
7. **Embed code** gives Markdown and HTML for a clickable thumbnail. The address bar keeps `?v=`, so a
   result can be shared, and recent videos stay in the browser.
   <p align="center"><img src=".github/embed.jpg" width="720" alt="Embed code: Markdown, HTML and the image URL, each with a Copy button"></p>

## Using it in a page

```html
<script type="module" src="thumbsnap.js"></script>
<thumb-snap></thumb-snap>
```

| Attribute | Default | |
|---|---|---|
| `locale` | the nearest `lang` attribute | `en` `ko` `ja` `zh-hans` `zh-hant` `id` `es` `fr` `pt` `vi` `de` `it` `pl`; tags such as `zh-TW` or `pt-BR` are mapped |
| `theme` | `auto` | `auto` follows `data-theme`, `data-color-scheme` or `data-bs-theme` on `<html>`, its `dark` or `light` class, or its `color-scheme`, then the system; `light` and `dark` fix it |
| `value` | | links or IDs to load at start |
| `no-url-sync` | off | leaves `?v=` and `?list=` in the address bar alone |
| `no-history` | off | keeps no recent videos in `localStorage` |
| `max-videos` | `20` | the most videos loaded in one go |

- CSS custom properties: `--thumbsnap-accent`, `--thumbsnap-accent-hover`, `--thumbsnap-radius`,
  `--thumbsnap-font`.
- Every action fires a bubbling, composed `thumbsnap` event. Its `detail` is
  `{ action, videoId?, variant?, format?, count? }`, and `action` is `resolve`, `download`,
  `download-zip`, `copy-image`, `copy-text`, `share` or `error`.
- `load(text)` loads links as if they had been typed in; `clear()` empties the tool.
- Content with `slot="footer"` shows under the tool. A subclass can override `renderFooter()` instead:
  import `src/index.ts`, which registers nothing, and register the element with `defineThumbSnap()`.

The building blocks — `parseTarget`, `extractTargets`, `imageUrl`, `loadImage`, `fetchOEmbed`,
`transformImage`, `findContentRect`, `extractPalette`, `createZip` and more — are exported too, for use
without the interface.

## Structure

```
src/
├── core/       links, the CDN's files, loading and probing, oEmbed, cropping, converting and colours, ZIP, file names (no interface)
├── i18n/       en (source), ko, ja, zh-hans, zh-hant, id, es, fr, pt, vi, de, it, pl
├── ui/         the <thumb-snap> element (Lit) — the page's language and theme, one video's state, templates, styles
├── index.ts    the public API; registers nothing
└── auto.ts     the bundle's entry point; registers <thumb-snap>
tests/          Vitest — links, files, ZIP, cropping, oEmbed, the catalogs, choosing the best size
docs/           what YouTube serves, and these READMEs
index.html      the demo page
```

Every catalog has the same keys and placeholders as `en.ts`; the type checker and the tests make sure
of it.

## Limitations

- YouTube documents none of these files. What exists, and where, may change.
- An uploaded thumbnail is told from an auto-generated one by comparing bytes with `hq1`–`hq3`. A
  creator who chose one of Studio's other suggestions looks like an upload too.
- WebP files from YouTube can only be opened: without CORS the page can't save or convert them.
  Converting a JPEG to WebP gives the same result.
- Recent regular videos have no original-ratio frames, so those three cards say Not available.
- Files that need YouTube's signatures — a Short's vertical cover, animated previews, storyboards — and
  whole playlists or channels are out of reach without a server.
- Checking for files that don't exist leaves 404s in the browser console.
