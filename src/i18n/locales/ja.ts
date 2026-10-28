import type { Messages } from '../types';

const ja: Messages = {
  inputLabel: 'YouTube のリンクまたは動画 ID',
  inputPlaceholder: 'YouTube のリンクを貼り付け（動画・ショート・ライブ・再生リスト）',
  inputHint: '1 行に 1 つずつ、複数のリンクをまとめて入力できます。',
  paste: '貼り付け',
  submit: 'サムネイルを取得',
  clearInput: '入力を消去',
  recent: '最近の項目',
  clearRecent: '履歴を消去',
  noTargets: 'YouTube のリンクや動画 ID が見つかりません。アドレスを確認してもう一度お試しください。',
  tooMany: '最初の {max} 本の動画のみ表示しています。',
  pasteBlocked: 'ブラウザがクリップボードへのアクセスをブロックしました。Ctrl+V または ⌘V で貼り付けてください。',

  optFormat: '形式',
  formatOriginal: 'オリジナル (JPG)',
  optCrop: '黒帯を除去',
  optCropHint: '4:3 の画像をダウンロード・コピーするときに上下の黒帯を切り取ります。',
  optFilename: 'ファイル名',
  filenameId: '動画 ID',
  filenameTitle: 'タイトル + 動画 ID',
  formatFallback: 'このブラウザは {format} ファイルを作成できないため、PNG で保存しました。',

  loading: '読み込み中…',
  unavailable: '提供なし',
  metaUnavailable: '動画の情報を取得できません（非公開・削除済み・制限付き）。サムネイルは残っている場合があります。',
  notFound: 'サムネイルが見つかりません。動画が非公開か削除されたか、ID が間違っている可能性があります。',
  networkError: 'ネットワークエラーです。接続を確認してもう一度お試しください。',
  retry: '再試行',
  playlistCover: '再生リスト「{title}」：カバー動画を表示しています。',
  playlistUnavailable: 'この再生リストを読み込めません。非公開か、「後で見る」などの個人用リストの可能性があります。',

  sectionThumbnails: 'サムネイル',
  sectionThumbnailsHint: 'YouTube が提供するすべてのサイズの動画サムネイルです。',
  sectionOriginal: 'オリジナル比率のフレーム',
  sectionOriginalHint:
    'YouTube が動画本来のアスペクト比でキャプチャしたフレームで、黒帯がありません。ショートは縦長で、最大 1080p です。',
  sectionFrames: '自動生成フレーム',
  sectionFramesHint: 'YouTube が動画の冒頭・中盤・終盤から自動的に選んだ 3 枚のフレームです。',
  sectionWebp: 'WebP 版',
  sectionWebpHint:
    'YouTube が配信する軽量な WebP ファイルです。開いて保存するか、形式を WebP にすると任意の画像を変換できます。',
  sectionEmbed: '埋め込みコード',
  sectionEmbedHint: 'ブログや README、フォーラム向けのクリックできるサムネイルです。',

  colors: 'カラー',
  copyColor: '{color} をコピー',

  sizeMaxres: '最大解像度',
  size720: 'HD 720p',
  sizeSd: '標準',
  sizeHq: '高画質',
  sizeMq: '中画質',
  sizeDefault: '小',
  frameN: 'フレーム {n}',
  firstFrame: '最初のフレーム',
  imageSize: 'サイズ',

  best: '最高画質',
  downloadBest: '最高画質をダウンロード',
  downloadZip: 'すべてダウンロード (ZIP)',
  downloadEverything: 'すべての動画をダウンロード (ZIP)',
  zipping: 'ZIP を準備中…',
  download: 'ダウンロード',
  copyImage: '画像をコピー',
  copyImageUrl: '画像の URL をコピー',
  copyVideoLink: '動画のリンクをコピー',
  openImage: '画像を開く',
  openVideo: 'YouTube で見る',
  share: '共有',
  remove: '削除',
  showImages: '画像を表示',
  hideImages: '画像を隠す',
  copied: 'コピーしました',
  copyFailed: 'コピーできませんでした。この環境ではブラウザが許可していない可能性があります。',
  downloadFailed: 'ダウンロードに失敗しました。もう一度お試しください。',
  close: '閉じる',
  videoCount: '動画: {n} 本',

  badgeShorts: '縦長（ショート）',
  badgeCustom: 'カスタムサムネイル',
  badgeAuto: '自動フレーム {n} がサムネイル',

  embedUrl: '画像 URL',
  copy: 'コピー',

  disclaimer:
    'サムネイルの権利は制作者に帰属します。再利用する際は著作権を尊重してください。YouTube および Google とは関係ありません。',
};

export default ja;
