import type { Messages } from '../types';

const vi: Messages = {
  inputLabel: 'Liên kết YouTube hoặc ID video',
  inputPlaceholder: 'Dán liên kết YouTube: video, Shorts, trực tiếp hoặc danh sách phát',
  inputHint: 'Có thể thêm nhiều liên kết cùng lúc, mỗi dòng một liên kết.',
  paste: 'Dán',
  submit: 'Lấy hình thu nhỏ',
  clearInput: 'Xóa nội dung nhập',
  recent: 'Gần đây',
  clearRecent: 'Xóa lịch sử',
  noTargets: 'Không tìm thấy liên kết YouTube hoặc ID video. Hãy kiểm tra địa chỉ rồi thử lại.',
  tooMany: 'Chỉ hiển thị {max} video đầu tiên.',
  pasteBlocked: 'Trình duyệt đã chặn quyền truy cập bộ nhớ tạm. Hãy dán bằng Ctrl+V hoặc ⌘V.',

  optFormat: 'Định dạng',
  formatOriginal: 'Gốc (JPG)',
  optCrop: 'Xóa viền đen',
  optCropHint: 'Cắt viền đen trên và dưới của ảnh 4:3 khi tải xuống hoặc sao chép.',
  optFilename: 'Tên tệp',
  filenameId: 'ID video',
  filenameTitle: 'Tiêu đề + ID video',
  formatFallback: 'Trình duyệt này không tạo được tệp {format} nên đã dùng PNG.',

  loading: 'Đang tải…',
  unavailable: 'Không có',
  metaUnavailable:
    'Không lấy được thông tin video (riêng tư, đã bị xóa hoặc bị hạn chế), nhưng hình thu nhỏ có thể vẫn còn.',
  notFound: 'Không tìm thấy hình thu nhỏ. Video có thể ở chế độ riêng tư, đã bị xóa hoặc ID không đúng.',
  networkError: 'Lỗi mạng. Hãy kiểm tra kết nối rồi thử lại.',
  retry: 'Thử lại',
  playlistCover: 'Danh sách phát “{title}”: đang hiển thị video ảnh bìa.',
  playlistUnavailable:
    'Không đọc được danh sách phát này. Có thể đây là danh sách riêng tư hoặc danh sách cá nhân như Xem sau.',

  sectionThumbnails: 'Hình thu nhỏ',
  sectionThumbnailsHint: 'Hình thu nhỏ của video ở mọi kích thước mà YouTube cung cấp.',
  sectionOriginal: 'Khung hình tỷ lệ gốc',
  sectionOriginalHint:
    'Khung hình YouTube chụp theo tỷ lệ khung hình gốc của video, không có viền đen: dọc với Shorts, tối đa 1080p.',
  sectionFrames: 'Khung hình tự động',
  sectionFramesHint: 'Ba khung hình YouTube tự động chọn từ phần đầu, giữa và cuối video.',
  sectionWebp: 'Bản WebP',
  sectionWebpHint:
    'Tệp WebP nhẹ hơn từ YouTube. Mở để lưu, hoặc chọn định dạng WebP để chuyển đổi bất kỳ ảnh nào.',
  sectionEmbed: 'Mã nhúng',
  sectionEmbedHint: 'Hình thu nhỏ có thể nhấp vào, dành cho blog, README và diễn đàn.',

  colors: 'Màu sắc',
  copyColor: 'Sao chép {color}',

  sizeMaxres: 'Độ phân giải tối đa',
  size720: 'HD 720p',
  sizeSd: 'Tiêu chuẩn',
  sizeHq: 'Cao',
  sizeMq: 'Trung bình',
  sizeDefault: 'Nhỏ',
  frameN: 'Khung hình {n}',
  firstFrame: 'Khung hình đầu tiên',
  imageSize: 'Kích thước',

  best: 'Tốt nhất',
  downloadBest: 'Tải bản tốt nhất',
  downloadZip: 'Tải tất cả (ZIP)',
  downloadEverything: 'Tải mọi video (ZIP)',
  zipping: 'Đang chuẩn bị ZIP…',
  download: 'Tải xuống',
  copyImage: 'Sao chép ảnh',
  copyImageUrl: 'Sao chép URL ảnh',
  copyVideoLink: 'Sao chép liên kết video',
  openImage: 'Mở ảnh',
  openVideo: 'Xem trên YouTube',
  share: 'Chia sẻ',
  remove: 'Xóa',
  showImages: 'Hiện ảnh',
  hideImages: 'Ẩn ảnh',
  copied: 'Đã sao chép',
  copyFailed: 'Không thể sao chép. Trình duyệt có thể không cho phép ở đây.',
  downloadFailed: 'Tải xuống không thành công. Vui lòng thử lại.',
  close: 'Đóng',
  videoCount: 'Video: {n}',

  badgeShorts: 'Dọc (Shorts)',
  badgeCustom: 'Hình thu nhỏ tùy chỉnh',
  badgeAuto: 'Khung hình tự động {n} là hình thu nhỏ',

  embedUrl: 'URL ảnh',
  copy: 'Sao chép',

  disclaimer:
    'Hình thu nhỏ thuộc về người sáng tạo. Hãy tôn trọng bản quyền khi sử dụng lại. Không liên kết với YouTube hay Google.',
};

export default vi;
