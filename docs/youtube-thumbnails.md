# YouTube thumbnail files: what exists and how it behaves

These notes come from probing `i.ytimg.com` in October 2026 with five kinds of videos:

| Video | Kind |
| --- | --- |
| `dQw4w9WgXcQ` | HD music video with a custom thumbnail |
| `jNQXAC9IVRw` | 2005 upload, 240p, no custom thumbnail |
| `LXb3EKWsInQ` | 4K video |
| `0HAETg7L15o` | YouTube Short (vertical) |
| `0sfDth4lMLc` | Running live stream |

A wider sample was then checked for the original-ratio frames: 5 recent Shorts, 6 regular videos from 2009–2017 and 9 recent regular videos.

YouTube documents none of this, so treat it as observed behaviour that can change.

## URLs

```
https://i.ytimg.com/vi/{videoId}/{file}.jpg
https://i.ytimg.com/vi_webp/{videoId}/{file}.webp
```

`img.youtube.com` and `i1.ytimg.com` to `i9.ytimg.com` serve the same files.

## Files

| File | Size | Content | Notes |
| --- | --- | --- | --- |
| `default` | 120×90 | Thumbnail | 4:3, letterboxed for 16:9 videos |
| `mqdefault` | 320×180 | Thumbnail | 16:9, no bars |
| `hqdefault` (= `0`) | 480×360 | Thumbnail | 4:3, letterboxed |
| `sddefault` | 640×480 | Thumbnail | 4:3, letterboxed; missing for low-resolution uploads |
| `maxresdefault` | 1280×720 | Thumbnail | Missing for low-resolution uploads |
| `hq720` | 1280×720 | Thumbnail | Byte-identical to `maxresdefault` in every test |
| `1` `2` `3` | 120×90 | Auto frames | Captured at about 25 %, 50 % and 75 % of the video |
| `mq1`–`mq3`, `hq1`–`hq3`, `sd1`–`sd3`, `maxres1`–`maxres3` | per size | Auto frames | `hq720_2`/`hq720_3` equal `maxres2`/`maxres3` |
| `oar1`–`oar3` | varies | Auto frames, original aspect ratio | No black bars. Every Short tested: 1080×1920. Older regular videos: mostly 1280×720 (1920×1080 for one, 320×240 for the 240p one, 1280×720 even for the 4K one). **Recent regular videos: missing** |
| `frame0` | up to 480 px | First frame, original aspect ratio | Present on every video tested: 480×268, 268×480 (Short), 320×240 (240p) |
| `*_live` (`hqdefault_live`, …) | same | Same bytes as the non-live file | Sent without CORS headers, so nothing to gain |
| `oardefault`, `hqdefault_custom_N`, `mqdefault_6s` | | 404 | Only reachable through signed URLs (see below) |

Live streams have the thumbnail files but no auto frames: `1`–`3`, `oar*` and `frame0` all return 404.

## Behaviour that matters for a client

**Missing files** come back as HTTP 404 with a grey 120×90 placeholder (a 1,097-byte JPEG, or a 552-byte WebP under `vi_webp`). Browsers display the placeholder in an `<img>`, so either check the status code with `fetch()` or treat a 120×90 result as missing for any size that should be larger.

**CORS.** JPEGs under `/vi/` carry `Access-Control-Allow-Origin: *` and `Cross-Origin-Resource-Policy: cross-origin`. A page can therefore `fetch()` them as Blobs and download, copy, convert or crop them on a canvas. WebP files under `/vi_webp/` and the `*_live` files have no `Access-Control-Allow-Origin`, so they can only be shown or opened, and they taint a canvas.

**Caching.** Images are sent with `Cache-Control: public, max-age=7200`, 404s with `max-age=30`, and live thumbnails with `max-age=300`.

**Custom or auto thumbnail.** When `hqdefault` is byte-identical to `hq1`, `hq2` or `hq3`, the thumbnail is that auto frame. The 2005 video shows this: `hqdefault` = `hq2`, `default` = `2`, `mqdefault` = `mq2`. Otherwise the creator uploaded a thumbnail. A creator who picked one of Studio's other suggested frames would also look like a custom upload.

**Shorts.** The landscape thumbnail files hold a 16:9 composition. The true vertical frames are `oar1`–`oar3` (1080×1920) and `frame0`. The vertical cover a creator picks is only served through signed URLs.

**Original-ratio frames are not universal.** For 16:9 videos `oar1`–`oar3` are mostly the same size as `maxres1`–`maxres3`, so they matter most for Shorts and other non-16:9 videos. Recent regular uploads don't have them at all.

## oEmbed

```
https://www.youtube.com/oembed?format=json&url={watch or playlist URL}
```

- Echoes any `Origin` back in `Access-Control-Allow-Origin`, so pages can call it directly. No API key.
- Returns `title`, `author_name` and `author_url`. The embed's `width`/`height` (113×200 for a Short against 200×113) reveal vertical videos.
- Works for playlists: it returns the playlist title and the thumbnail of its cover video, whose ID can be read from `thumbnail_url`.
- Returns 400 for IDs that don't exist and 401/403 for private videos or videos with embedding disabled. Ended live streams return only `html`; the title is still in the iframe's `title` attribute.

## Out of reach for a static page

| Wanted | Why not | What would work |
| --- | --- | --- |
| Shorts vertical cover (`oardefault`), animated previews (`an_webp/{id}/mqdefault_6s.webp`) | Need `sqp`/`rs` signatures from YouTube's own pages | A server-side proxy |
| Storyboard sprite sheets (`/sb/{id}/storyboard3_L{n}/M{m}.jpg?sigh=…`) | Signature comes from the player response, which sends no CORS headers | A server-side proxy |
| Channel avatars and banners, every video of a playlist or channel | No public CORS endpoint | YouTube Data API v3 (API key, quota) or a proxy |
| A frame at any timestamp | A cross-origin video can't be drawn onto a canvas | Region/Element Capture in Chromium after the user grants screen capture |
