<p align="center"><img src="../.github/icon.png" width="128" height="128" alt="Ikon aplikasi"></p>

<h1 align="center">Alat pengambil thumbnail dan frame YouTube untuk web</h1>

<p align="center">
  <img alt="Web Component" src="https://img.shields.io/badge/Web%20Component-custom%20element-29ABE2?logo=webcomponentsdotorg&logoColor=white">
  <img alt="Runs in the browser: no server, no API key" src="https://img.shields.io/badge/runs%20in%20the%20browser-no%20server%20·%20no%20API%20key-2EA44F">
  <img alt="TypeScript 7" src="https://img.shields.io/badge/TypeScript-7-3178C6?logo=typescript&logoColor=white">
  <img alt="Lit 3" src="https://img.shields.io/badge/Lit-3-324FFF?logo=lit&logoColor=white">
  <a href="../LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-yellow"></a>
</p>

<p align="center"><a href="../README.md">English</a> · <a href="README.ko.md">한국어</a> · <a href="README.de.md">Deutsch</a> · <a href="README.es.md">Español</a> · <a href="README.fr.md">Français</a> · <b>Bahasa Indonesia</b> · <a href="README.it.md">Italiano</a> · <a href="README.ja.md">日本語</a> · <a href="README.pl.md">Polski</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.vi.md">Tiếng Việt</a> · <a href="README.zh-Hans.md">简体中文</a> · <a href="README.zh-Hant.md">繁體中文</a></p>

Komponen web yang menerima link YouTube dan menemukan semua gambar yang disediakan YouTube untuk setiap video —
thumbnail dalam semua ukurannya, frame dengan rasio aspek asli video, dan frame yang dipilih YouTube sendiri — untuk
diunduh, disalin, dikonversi, atau disimpan sebagai ZIP. Semuanya berjalan di browser: tanpa server, tanpa kunci API.

<p align="center"><img src="../.github/screenshot.jpg" width="720" alt="ThumbSnap dengan satu video yang sudah dimuat: kolom link, opsi format dan nama file, serta judul, channel, lencana, warna, dan tombol unduh video itu"></p>

| Gambar | File | Ukuran | Video mana |
|---|---|---|---|
| Thumbnail | `maxresdefault` · `sddefault` · `hqdefault` · `mqdefault` · `default`, ditambah `hq720` jika `maxresdefault` tidak ada | 1280×720 hingga 120×90 | semua video; ukuran 4:3 memiliki bilah hitam, dan video beresolusi rendah tidak punya 1280×720 maupun 640×480 |
| Frame rasio asli | `oar1`–`oar3`, serta `frame0` (frame pertama) | 1080×1920 untuk Shorts, hingga 1920×1080 untuk video lain | Shorts dan video lama; video biasa yang baru hanya punya `frame0` |
| Frame otomatis | `1`–`3` dalam lima ukuran, yang terbesar `maxres1`–`maxres3` | 1280×720 hingga 120×90 | semua video kecuali siaran langsung |
| Versi WebP | ukuran-ukuran thumbnail, di bawah `vi_webp` | sama dengan thumbnail | hanya ditampilkan dan dibuka — YouTube mengirimnya tanpa CORS |

YouTube tidak memberi tahu file mana saja yang ada, jadi ThumbSnap meminta setiap file dan membaca jawabannya: file
yang tidak ada dibalas dengan 404 berisi gambar pengganti abu-abu berukuran 120×90. ThumbSnap membandingkan thumbnail
dengan frame otomatis byte demi byte untuk membedakan thumbnail yang diunggah dari yang dibuat otomatis, serta
mengambil judul, channel, dan apakah videonya vertikal dari endpoint oEmbed YouTube. Temuan dari penyelidikan terhadap
YouTube dicatat di [docs/youtube-thumbnails.md](youtube-thumbnails.md).

Alat ini tersedia dalam 13 bahasa — Inggris, Korea, Jepang, Tionghoa (Sederhana dan Tradisional), Jerman, Spanyol,
Prancis, Italia, Portugis, Polandia, Indonesia, dan Vietnam. Alat ini mengikuti bahasa halaman tempatnya dipasang;
untuk bahasa lainnya, alat ini tampil dalam bahasa Inggris. Begitu pula mode gelap halaman.

Kode sumber di repositori ini berlisensi MIT. Nama ThumbSnap dan ikonnya tidak termasuk dalam kode sumber ini. Ikon di
bagian atas hanya ditampilkan sebagai gambaran: ikon itu tidak dicakup lisensi MIT dan tidak disertakan dalam hasil
build dari repositori ini. ThumbSnap tidak berafiliasi dengan YouTube atau Google, dan thumbnail adalah milik
kreatornya.

## Coba langsung

ThumbSnap berjalan di [hobbyworker.me](https://hobbyworker.me/id/services/thumbsnap/) dalam ke-13 bahasanya.

## Persyaratan

- Browser versi terkini: Chrome atau Edge 111 atau yang lebih baru, Safari 16.4 atau yang lebih baru, Firefox 113 atau
  yang lebih baru.
- Akses ke `i.ytimg.com` (gambar) dan `www.youtube.com` (oEmbed). Tidak ada alamat lain yang dihubungi.
- Menyalin gambar dan berbagi memerlukan halaman yang aman — HTTPS atau `localhost`.

## Build

```sh
npm install
npm run dev     # halaman demo, dengan pengalih bahasa dan tema
npm test        # tes unit (Vitest)
npm run build   # dist/thumbsnap.js, source map-nya, dan THIRD_PARTY_LICENSES.txt
```

Proses build dan pengujian sudah diperiksa dengan Node.js 24.

`dist/thumbsnap.js` adalah satu modul ES yang sudah menyertakan Lit dan mendaftarkan `<thumb-snap>` saat dimuat.
Sertakan `THIRD_PARTY_LICENSES.txt` bersamanya.

## Cara menggunakan

1. Tempel satu atau beberapa link YouTube atau ID video. Link watch, `youtu.be`, Shorts, live, embed, dan
   `music.youtube.com` semuanya bisa dipakai, dan playlist akan memuat video sampulnya. Link yang ditempel langsung
   dimuat; untuk beberapa link, tulis satu per baris, atau seret dan lepas link ke alat ini.
2. Thumbnail ditampilkan dalam semua ukuran yang dimiliki YouTube, masing-masing dengan dimensi sebenarnya dan ukuran
   filenya, dan yang terbesar ditandai **Terbaik**.
   <p align="center"><img src="../.github/thumbnails.jpg" width="720" alt="Bagian Thumbnail: lima ukuran dari 1280×720 hingga 120×90, yang terbesar ditandai Terbaik, masing-masing dengan tombol unduh, salin, salin URL, bagikan, dan buka"></p>
3. **Frame rasio asli** berisi frame yang diambil YouTube dalam bentuk asli videonya — untuk Short, tiga frame
   vertikal 1080×1920 dan frame pertamanya.
   <p align="center"><img src="../.github/shorts.jpg" width="720" alt="Frame rasio asli dari sebuah Short: tiga frame 1080×1920 dan frame pertama 268×480"></p>
4. **Frame otomatis** berisi tiga frame yang dipilih YouTube sendiri; angka di bawah setiap frame dipakai untuk
   berpindah di antara lima ukurannya.
   <p align="center"><img src="../.github/frames.jpg" width="720" alt="Frame otomatis 1 sampai 3 berukuran 1280×720, dengan tombol ukuran 1280, 640, 480, 320, dan 120"></p>
5. Setiap gambar bisa diunduh, disalin sebagai gambar, disalin alamatnya, dibagikan jika perangkat bisa membagikan
   file, atau dibuka. **Unduh kualitas terbaik** dan **Unduh semua (ZIP)** berlaku untuk seluruh video; jika ada
   beberapa video, **Unduh semua video (ZIP)** menaruh setiap video di foldernya sendiri.
6. **Format** mengonversi ke PNG atau WebP (hanya format yang bisa dienkode browser yang ditawarkan),
   **Hapus bilah hitam** memotong bilah letterbox dari gambar 4:3, dan **Nama file** memakai ID video, atau judul dan
   ID-nya.
7. **Kode sematan** memberikan Markdown dan HTML untuk thumbnail yang dapat diklik. Bilah alamat menyimpan `?v=`
   sehingga hasilnya bisa dibagikan, dan video yang baru dibuka tetap tersimpan di browser.
   <p align="center"><img src="../.github/embed.jpg" width="720" alt="Kode sematan: Markdown, HTML, dan URL gambar, masing-masing dengan tombol Salin"></p>

## Cara menggunakan di halaman web

```html
<script type="module" src="thumbsnap.js"></script>
<thumb-snap></thumb-snap>
```

| Atribut | Bawaan | |
|---|---|---|
| `locale` | atribut `lang` terdekat | `en` `ko` `ja` `zh-hans` `zh-hant` `id` `es` `fr` `pt` `vi` `de` `it` `pl`; tag seperti `zh-TW` atau `pt-BR` dipetakan ke bahasa yang sesuai |
| `theme` | `auto` | `auto` mengikuti `data-theme`, `data-color-scheme`, atau `data-bs-theme`, kelas `dark` atau `light`, atau `color-scheme` pada `<html>`, lalu pengaturan sistem; `light` dan `dark` mengunci tema |
| `value` | | link atau ID yang dimuat di awal |
| `no-url-sync` | nonaktif | membiarkan `?v=` dan `?list=` di bilah alamat apa adanya |
| `no-history` | nonaktif | tidak menyimpan video terbaru di `localStorage` |
| `max-videos` | `20` | jumlah video maksimum yang dimuat sekaligus |

- Properti kustom CSS: `--thumbsnap-accent`, `--thumbsnap-accent-hover`, `--thumbsnap-radius`, `--thumbsnap-font`.
- Setiap tindakan memicu event `thumbsnap` dengan `bubbles` dan `composed` aktif. `detail`-nya berupa
  `{ action, videoId?, variant?, format?, count? }`, dan `action` bernilai `resolve`, `download`, `download-zip`,
  `copy-image`, `copy-text`, `share`, atau `error`.
- `load(text)` memuat link seolah-olah diketik langsung; `clear()` mengosongkan alat.
- Konten dengan `slot="footer"` tampil di bawah alat. Sebagai alternatif, subkelas bisa menimpa `renderFooter()`:
  impor `src/index.ts`, yang tidak mendaftarkan apa pun, lalu daftarkan elemennya dengan `defineThumbSnap()`.

Blok penyusunnya — `parseTarget`, `extractTargets`, `imageUrl`, `loadImage`, `fetchOEmbed`, `transformImage`,
`findContentRect`, `extractPalette`, `createZip`, dan lainnya — juga diekspor agar bisa dipakai tanpa antarmuka.

## Struktur

```
src/
├── core/       link, file di CDN, pemuatan dan pengecekan, oEmbed, pemotongan, konversi dan warna, ZIP, nama file (tanpa antarmuka)
├── i18n/       en (sumber), ko, ja, zh-hans, zh-hant, id, es, fr, pt, vi, de, it, pl
├── ui/         elemen <thumb-snap> (Lit) — bahasa dan tema halaman, status satu video, template, gaya
├── index.ts    API publik; tidak mendaftarkan apa pun
└── auto.ts     titik masuk bundle; mendaftarkan <thumb-snap>
tests/          Vitest — link, file, ZIP, pemotongan, oEmbed, katalog, pemilihan ukuran terbaik
docs/           apa yang disediakan YouTube, dan README ini
index.html      halaman demo
```

Setiap katalog memiliki kunci dan placeholder yang sama dengan `en.ts`; pemeriksa tipe dan tes memastikan hal itu.

## Batasan

- YouTube tidak mendokumentasikan satu pun file ini. Apa yang tersedia, dan di mana, bisa berubah.
- Thumbnail yang diunggah dibedakan dari thumbnail otomatis dengan membandingkan byte-nya dengan `hq1`–`hq3`. Jika
  kreator memilih salah satu saran lain dari Studio, thumbnail-nya juga akan terlihat seperti unggahan.
- File WebP dari YouTube hanya bisa dibuka: tanpa CORS, halaman tidak bisa menyimpan atau mengonversinya. Mengonversi
  JPEG ke WebP memberikan hasil yang sama.
- File yang memerlukan tanda tangan YouTube — sampul vertikal Short, pratinjau animasi, storyboard — serta seluruh isi
  playlist atau channel tidak bisa dijangkau tanpa server.
- Memeriksa file yang tidak ada akan meninggalkan galat 404 di konsol browser.
