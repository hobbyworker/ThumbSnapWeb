import type { Messages } from '../types';

const id: Messages = {
  inputLabel: 'Link YouTube atau ID video',
  inputPlaceholder: 'Tempel link YouTube: video, Shorts, live, atau playlist',
  inputHint: 'Tambahkan beberapa link sekaligus, satu per baris.',
  paste: 'Tempel',
  submit: 'Ambil thumbnail',
  clearInput: 'Hapus input',
  recent: 'Terbaru',
  clearRecent: 'Hapus riwayat',
  noTargets: 'Link YouTube atau ID video tidak ditemukan. Periksa alamatnya, lalu coba lagi.',
  tooMany: 'Hanya {max} video pertama yang ditampilkan.',
  pasteBlocked: 'Browser memblokir akses papan klip. Tempel dengan Ctrl+V atau ⌘V.',

  optFormat: 'Format',
  formatOriginal: 'Asli (JPG)',
  optCrop: 'Hapus bilah hitam',
  optCropHint: 'Memotong bilah hitam letterbox dari gambar 4:3 saat diunduh atau disalin.',
  optFilename: 'Nama file',
  filenameId: 'ID video',
  filenameTitle: 'Judul + ID video',
  formatFallback: 'Browser ini tidak dapat membuat file {format}, jadi PNG yang digunakan.',

  loading: 'Memuat…',
  unavailable: 'Tidak tersedia',
  metaUnavailable: 'Detail video tidak tersedia (pribadi, dihapus, atau dibatasi), tetapi thumbnail mungkin masih ada.',
  notFound: 'Thumbnail tidak ditemukan. Video mungkin pribadi atau dihapus, atau ID-nya salah.',
  networkError: 'Kesalahan jaringan. Periksa koneksi Anda, lalu coba lagi.',
  retry: 'Coba lagi',
  playlistCover: 'Playlist “{title}”: menampilkan video sampulnya.',
  playlistUnavailable: 'Playlist ini tidak dapat dibaca. Mungkin bersifat pribadi atau daftar pribadi seperti Tonton Nanti.',

  sectionThumbnails: 'Thumbnail',
  sectionThumbnailsHint: 'Thumbnail video dalam semua ukuran yang disediakan YouTube.',
  sectionOriginal: 'Frame rasio asli',
  sectionOriginalHint:
    'Frame yang diambil YouTube dengan rasio aspek asli video, tanpa bilah hitam: vertikal untuk Shorts, hingga 1080p.',
  originalMissing: 'Video ini tidak memiliki frame rasio asli 1–3. YouTube biasanya hanya menyediakannya untuk Shorts dan video lama.',
  sectionFrames: 'Frame otomatis',
  sectionFramesHint: 'Tiga frame yang dipilih otomatis oleh YouTube dari awal, tengah, dan akhir video.',
  sectionWebp: 'Versi WebP',
  sectionWebpHint:
    'File WebP yang lebih ringan dari YouTube. Buka untuk menyimpannya, atau setel format ke WebP untuk mengonversi gambar apa pun.',
  sectionEmbed: 'Kode sematan',
  sectionEmbedHint: 'Thumbnail yang dapat diklik untuk blog, README, dan forum.',

  colors: 'Warna',
  copyColor: 'Salin {color}',

  sizeMaxres: 'Resolusi maksimum',
  size720: 'HD 720p',
  sizeSd: 'Standar',
  sizeHq: 'Tinggi',
  sizeMq: 'Sedang',
  sizeDefault: 'Kecil',
  frameN: 'Frame {n}',
  firstFrame: 'Frame pertama',
  imageSize: 'Ukuran',

  best: 'Terbaik',
  downloadBest: 'Unduh kualitas terbaik',
  downloadZip: 'Unduh semua (ZIP)',
  downloadEverything: 'Unduh semua video (ZIP)',
  zipping: 'Menyiapkan ZIP…',
  download: 'Unduh',
  copyImage: 'Salin gambar',
  copyImageUrl: 'Salin URL gambar',
  copyVideoLink: 'Salin link video',
  openImage: 'Buka gambar',
  openVideo: 'Tonton di YouTube',
  share: 'Bagikan',
  remove: 'Hapus',
  showImages: 'Tampilkan gambar',
  hideImages: 'Sembunyikan gambar',
  copied: 'Disalin',
  copyFailed: 'Tidak dapat menyalin. Browser Anda mungkin tidak mengizinkannya di sini.',
  downloadFailed: 'Unduhan gagal. Silakan coba lagi.',
  close: 'Tutup',
  videoCount: 'Video: {n}',

  badgeShorts: 'Vertikal (Shorts)',
  badgeCustom: 'Thumbnail kustom',
  badgeAuto: 'Frame otomatis {n} jadi thumbnail',

  embedUrl: 'URL gambar',
  copy: 'Salin',

  disclaimer:
    'Thumbnail adalah milik kreatornya. Hormati hak cipta saat menggunakannya kembali. Tidak berafiliasi dengan YouTube atau Google.',
};

export default id;
