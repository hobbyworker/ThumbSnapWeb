<p align="center"><img src="../.github/icon.png" width="128" height="128" alt="Biểu tượng ứng dụng"></p>

<h1 align="center">Công cụ trích xuất hình thu nhỏ và khung hình YouTube cho web</h1>

<p align="center">
  <img alt="Web Component" src="https://img.shields.io/badge/Web%20Component-custom%20element-29ABE2?logo=webcomponentsdotorg&logoColor=white">
  <img alt="Runs in the browser: no server, no API key" src="https://img.shields.io/badge/runs%20in%20the%20browser-no%20server%20·%20no%20API%20key-2EA44F">
  <img alt="TypeScript 7" src="https://img.shields.io/badge/TypeScript-7-3178C6?logo=typescript&logoColor=white">
  <img alt="Lit 3" src="https://img.shields.io/badge/Lit-3-324FFF?logo=lit&logoColor=white">
  <a href="../LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-yellow"></a>
</p>

<p align="center"><a href="../README.md">English</a> · <a href="README.ko.md">한국어</a> · <a href="README.de.md">Deutsch</a> · <a href="README.es.md">Español</a> · <a href="README.fr.md">Français</a> · <a href="README.id.md">Bahasa Indonesia</a> · <a href="README.it.md">Italiano</a> · <a href="README.ja.md">日本語</a> · <a href="README.pl.md">Polski</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <b>Tiếng Việt</b> · <a href="README.zh-Hans.md">简体中文</a> · <a href="README.zh-Hant.md">繁體中文</a></p>

Web component nhận liên kết YouTube và tìm ra mọi hình ảnh mà YouTube cung cấp cho từng video — hình thu nhỏ ở mọi kích
thước, khung hình theo đúng tỷ lệ khung hình của video, và các khung hình YouTube tự chọn — để tải xuống, sao chép,
chuyển đổi hoặc lưu thành tệp ZIP. Công cụ chạy hoàn toàn trong trình duyệt: không cần máy chủ, không cần khóa API.

<p align="center"><img src="../.github/screenshot.jpg" width="720" alt="ThumbSnap khi đã tải một video: ô liên kết, tùy chọn định dạng và tên tệp, cùng tiêu đề, kênh, huy hiệu, màu sắc và các nút tải xuống của video"></p>

| Hình ảnh | Tệp | Kích thước | Video nào có |
|---|---|---|---|
| Hình thu nhỏ | `maxresdefault` · `sddefault` · `hqdefault` · `mqdefault` · `default`, và `hq720` khi thiếu `maxresdefault` | từ 1280×720 xuống 120×90 | mọi video; các kích thước 4:3 có viền đen trên và dưới, và video tải lên ở độ phân giải thấp không có 1280×720 hay 640×480 |
| Khung hình tỷ lệ gốc | `oar1`–`oar3`, và `frame0` (khung hình đầu tiên) | 1080×1920 với Shorts, tối đa 1920×1080 với video khác | Shorts và video cũ hơn; video thông thường gần đây chỉ có `frame0` |
| Khung hình tự động | `1`–`3` ở năm kích thước, lớn nhất là `maxres1`–`maxres3` | từ 1280×720 xuống 120×90 | mọi video trừ video phát trực tiếp |
| Bản WebP | các kích thước của hình thu nhỏ, trong `vi_webp` | như hình thu nhỏ | chỉ hiển thị và mở được — YouTube gửi chúng mà không có CORS |

YouTube không cho biết tệp nào trong số này tồn tại, nên ThumbSnap yêu cầu từng tệp và đọc phản hồi: tệp không tồn tại
sẽ trả về mã 404 kèm một ảnh giữ chỗ màu xám 120×90. Công cụ so sánh từng byte của hình thu nhỏ với các khung hình tự
động để phân biệt hình thu nhỏ được tải lên với hình được tạo tự động, và lấy tiêu đề, kênh cũng như việc video có phải
dạng dọc hay không từ endpoint oEmbed của YouTube. Những gì tìm ra khi thăm dò YouTube được ghi lại trong
[docs/youtube-thumbnails.md](youtube-thumbnails.md).

Công cụ có 13 ngôn ngữ — tiếng Anh, tiếng Hàn, tiếng Nhật, tiếng Trung (Giản thể và Phồn thể), tiếng Đức, tiếng Tây Ban
Nha, tiếng Pháp, tiếng Ý, tiếng Bồ Đào Nha, tiếng Ba Lan, tiếng Indonesia và tiếng Việt — và theo ngôn ngữ của trang
chứa nó. Với các ngôn ngữ khác, công cụ hiển thị bằng tiếng Anh. Công cụ cũng theo chế độ tối của trang.

Mã nguồn trong kho này được cấp phép MIT. Tên ThumbSnap và biểu tượng của nó không nằm trong mã nguồn này. Biểu tượng ở
đầu trang chỉ để minh họa: biểu tượng này không thuộc phạm vi giấy phép MIT và cũng không có trong các bản build từ kho
này. ThumbSnap không liên kết với YouTube hay Google, và hình thu nhỏ thuộc về người sáng tạo.

## Dùng thử

ThumbSnap chạy trên [hobbyworker.me](https://hobbyworker.me/vi/services/thumbsnap/), với đủ 13 ngôn ngữ.

## Yêu cầu

- Trình duyệt đời mới: Chrome hoặc Edge 111 trở lên, Safari 16.4 trở lên, Firefox 113 trở lên.
- Truy cập được `i.ytimg.com` (hình ảnh) và `www.youtube.com` (oEmbed). Công cụ không kết nối tới nơi nào khác.
- Sao chép ảnh và chia sẻ cần trang an toàn — HTTPS hoặc `localhost`.

## Build

```sh
npm install
npm run dev     # trang demo, có nút chuyển ngôn ngữ và chủ đề
npm test        # kiểm thử đơn vị (Vitest)
npm run build   # dist/thumbsnap.js, source map của nó và THIRD_PARTY_LICENSES.txt
```

Đã kiểm tra việc build và kiểm thử với Node.js 24.

`dist/thumbsnap.js` là một ES module duy nhất đã gồm Lit, và đăng ký `<thumb-snap>` khi được tải. Hãy phân phối kèm
`THIRD_PARTY_LICENSES.txt`.

## Cách dùng

1. Dán một hoặc nhiều liên kết YouTube hoặc ID video. Liên kết watch, `youtu.be`, Shorts, trực tiếp, nhúng và
   `music.youtube.com` đều dùng được, còn liên kết danh sách phát sẽ cho ra video ảnh bìa của danh sách. Liên kết vừa
   dán được tải ngay; muốn thêm nhiều liên kết thì đặt mỗi liên kết trên một dòng, hoặc thả liên kết vào công cụ.
2. Hình thu nhỏ hiện ra ở mọi kích thước YouTube có, mỗi ảnh kèm kích thước thực và dung lượng tệp, và ảnh lớn nhất được
   đánh dấu **Tốt nhất**.
   <p align="center"><img src="../.github/thumbnails.jpg" width="720" alt="Phần Hình thu nhỏ: năm kích thước từ 1280×720 đến 120×90, ảnh lớn nhất được đánh dấu Tốt nhất, mỗi ảnh có nút tải xuống, sao chép, liên kết, chia sẻ và mở"></p>
3. **Khung hình tỷ lệ gốc** là những gì YouTube chụp theo đúng hình dạng của video — với video Shorts, đó là ba khung
   hình dọc 1080×1920 và khung hình đầu tiên.
   <p align="center"><img src="../.github/shorts.jpg" width="720" alt="Khung hình tỷ lệ gốc của một video Shorts: ba khung hình 1080×1920 và khung hình đầu tiên 268×480"></p>
4. **Khung hình tự động** là ba khung hình YouTube tự chọn; các con số bên dưới mỗi khung hình dùng để chuyển giữa năm
   kích thước.
   <p align="center"><img src="../.github/frames.jpg" width="720" alt="Khung hình tự động 1 đến 3 ở 1280×720, với các nút kích thước 1280, 640, 480, 320 và 120"></p>
5. Mọi ảnh đều có thể tải xuống, sao chép dưới dạng ảnh, sao chép địa chỉ, chia sẻ (trên thiết bị chia sẻ được tệp) hoặc
   mở. **Tải bản tốt nhất** và **Tải tất cả (ZIP)** áp dụng cho cả video; khi có nhiều video, **Tải mọi video (ZIP)**
   đặt từng video vào một thư mục riêng.
6. **Định dạng** chuyển sang PNG hoặc WebP (chỉ những định dạng trình duyệt mã hóa được mới được đưa ra),
   **Xóa viền đen** cắt viền đen khỏi ảnh 4:3, và **Tên tệp** dùng ID video, hoặc tiêu đề kèm ID.
7. **Mã nhúng** cung cấp Markdown và HTML cho một hình thu nhỏ có thể nhấp vào. Thanh địa chỉ giữ `?v=` nên có thể chia
   sẻ kết quả, và các video gần đây được lưu lại trong trình duyệt.
   <p align="center"><img src="../.github/embed.jpg" width="720" alt="Mã nhúng: Markdown, HTML và URL ảnh, mỗi mục có một nút Sao chép"></p>

## Dùng trong trang web

```html
<script type="module" src="thumbsnap.js"></script>
<thumb-snap></thumb-snap>
```

| Thuộc tính | Mặc định | |
|---|---|---|
| `locale` | thuộc tính `lang` gần nhất | `en` `ko` `ja` `zh-hans` `zh-hant` `id` `es` `fr` `pt` `vi` `de` `it` `pl`; các thẻ ngôn ngữ như `zh-TW` hoặc `pt-BR` cũng được ánh xạ |
| `theme` | `auto` | `auto` theo `data-theme`, `data-color-scheme` hoặc `data-bs-theme` trên `<html>`, class `dark` hoặc `light` của nó, hoặc `color-scheme` của nó, rồi đến hệ thống; `light` và `dark` cố định chủ đề |
| `value` | | liên kết hoặc ID cần tải khi khởi động |
| `no-url-sync` | tắt | không động đến `?v=` và `?list=` trên thanh địa chỉ |
| `no-history` | tắt | không lưu video gần đây vào `localStorage` |
| `max-videos` | `20` | số video tối đa được tải trong một lần |

- Thuộc tính tùy chỉnh CSS: `--thumbsnap-accent`, `--thumbsnap-accent-hover`, `--thumbsnap-radius`, `--thumbsnap-font`.
- Mọi thao tác đều phát ra sự kiện `thumbsnap` (bubbling, composed). `detail` của sự kiện là
  `{ action, videoId?, variant?, format?, count? }`, và `action` là `resolve`, `download`, `download-zip`, `copy-image`,
  `copy-text`, `share` hoặc `error`.
- `load(text)` tải liên kết như thể chúng được gõ vào; `clear()` làm trống công cụ.
- Nội dung có `slot="footer"` hiển thị bên dưới công cụ. Thay vào đó, lớp con có thể ghi đè `renderFooter()`: import
  `src/index.ts` — tệp này không đăng ký gì — rồi đăng ký phần tử bằng `defineThumbSnap()`.

Các thành phần cơ bản — `parseTarget`, `extractTargets`, `imageUrl`, `loadImage`, `fetchOEmbed`, `transformImage`,
`findContentRect`, `extractPalette`, `createZip` và nhiều hàm khác — cũng được export để dùng mà không cần giao diện.

## Cấu trúc

```
src/
├── core/       liên kết, các tệp trên CDN, tải và thăm dò, oEmbed, cắt ảnh, chuyển đổi và màu sắc, ZIP, tên tệp (không có giao diện)
├── i18n/       en (gốc), ko, ja, zh-hans, zh-hant, id, es, fr, pt, vi, de, it, pl
├── ui/         phần tử <thumb-snap> (Lit) — ngôn ngữ và chủ đề của trang, trạng thái của từng video, template, style
├── index.ts    API công khai; không đăng ký gì
└── auto.ts     điểm vào của bundle; đăng ký <thumb-snap>
tests/          Vitest — liên kết, tệp, ZIP, cắt ảnh, oEmbed, các tệp ngôn ngữ, chọn kích thước tốt nhất
docs/           những gì YouTube cung cấp, và các README này
index.html      trang demo
```

Mọi tệp ngôn ngữ có cùng các khóa và placeholder như `en.ts`; trình kiểm tra kiểu và các bài kiểm thử bảo đảm điều đó.

## Hạn chế

- YouTube không công bố tài liệu nào về các tệp này. Tệp nào tồn tại và nằm ở đâu đều có thể thay đổi.
- Hình thu nhỏ được tải lên được phân biệt với hình tạo tự động bằng cách so sánh byte với `hq1`–`hq3`. Nếu người sáng
  tạo chọn một trong các gợi ý khác của Studio, hình đó cũng trông như được tải lên.
- Tệp WebP từ YouTube chỉ mở được: không có CORS, trang không thể lưu hay chuyển đổi chúng. Chuyển JPEG sang WebP cũng
  cho cùng kết quả.
- Các tệp cần chữ ký của YouTube — ảnh bìa dọc của video Shorts, bản xem trước dạng động, storyboard — cùng toàn bộ danh
  sách phát hay kênh đều nằm ngoài tầm với nếu không có máy chủ.
- Việc kiểm tra các tệp không tồn tại để lại lỗi 404 trong console của trình duyệt.
