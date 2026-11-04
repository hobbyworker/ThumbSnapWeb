import type { Messages } from '../types';

const ru: Messages = {
  inputLabel: 'Ссылка на YouTube или ID видео',
  inputPlaceholder: 'Вставьте ссылку на YouTube: видео, Shorts, трансляцию или плейлист',
  inputHint: 'Можно добавить сразу несколько ссылок, по одной в строке.',
  paste: 'Вставить',
  submit: 'Получить превью',
  clearInput: 'Очистить поле',
  recent: 'Недавние',
  clearRecent: 'Очистить историю',
  noTargets: 'Не найдено ни ссылки на YouTube, ни ID видео. Проверьте адрес и попробуйте ещё раз.',
  tooMany: 'Показаны только первые {max} видео.',
  pasteBlocked: 'Браузер запретил доступ к буферу обмена. Вставьте ссылку с помощью Ctrl+V или ⌘V.',

  optFormat: 'Формат',
  formatOriginal: 'Оригинал (JPG)',
  optCrop: 'Убрать чёрные полосы',
  optCropHint: 'Обрезает чёрные полосы у изображений 4:3 при скачивании и копировании.',
  optFilename: 'Имя файла',
  filenameId: 'ID видео',
  filenameTitle: 'Название + ID видео',
  formatFallback: 'Этот браузер не умеет создавать файлы {format}, поэтому использован PNG.',

  loading: 'Загрузка…',
  unavailable: 'Недоступно',
  metaUnavailable:
    'Сведения о видео недоступны (оно закрыто, удалено или с ограничениями), но превью могли сохраниться.',
  notFound: 'Превью не найдены. Возможно, видео закрыто или удалено либо ID указан неверно.',
  networkError: 'Ошибка сети. Проверьте подключение и попробуйте ещё раз.',
  retry: 'Повторить',
  playlistCover: 'Плейлист «{title}»: показано видео с его обложки.',
  playlistUnavailable:
    'Этот плейлист не удалось прочитать. Возможно, он закрыт или это личный список вроде «Смотреть позже».',

  sectionThumbnails: 'Превью',
  sectionThumbnailsHint: 'Превью видео во всех размерах, которые отдаёт YouTube.',
  sectionOriginal: 'Кадры в исходных пропорциях',
  sectionOriginalHint:
    'Кадры, которые YouTube сохранил в исходных пропорциях видео, без чёрных полос: вертикальные у Shorts, до 1080p.',
  originalMissing: 'У этого видео нет кадров 1–3 в исходных пропорциях. Обычно YouTube хранит их только для Shorts и старых видео.',
  sectionFrames: 'Автоматические кадры',
  sectionFramesHint: 'Три кадра, которые YouTube сам выбирает из начала, середины и конца видео.',
  sectionWebp: 'Версии WebP',
  sectionWebpHint:
    'Более лёгкие файлы WebP от YouTube. Откройте файл, чтобы сохранить его, или выберите формат WebP, чтобы преобразовать любое изображение.',
  sectionEmbed: 'Код для вставки',
  sectionEmbedHint: 'Кликабельное превью для блогов, README и форумов.',

  colors: 'Цвета',
  copyColor: 'Копировать {color}',

  sizeMaxres: 'Максимальное разрешение',
  size720: 'HD 720p',
  sizeSd: 'Стандартное',
  sizeHq: 'Высокое',
  sizeMq: 'Среднее',
  sizeDefault: 'Маленькое',
  frameN: 'Кадр {n}',
  firstFrame: 'Первый кадр',
  imageSize: 'Размер',

  best: 'Лучшее',
  downloadBest: 'Скачать лучшее',
  downloadZip: 'Скачать всё (ZIP)',
  downloadEverything: 'Скачать все видео (ZIP)',
  zipping: 'Подготовка ZIP…',
  download: 'Скачать',
  copyImage: 'Копировать изображение',
  copyImageUrl: 'Копировать URL изображения',
  copyVideoLink: 'Копировать ссылку на видео',
  openImage: 'Открыть изображение',
  openVideo: 'Смотреть на YouTube',
  share: 'Поделиться',
  remove: 'Убрать',
  showImages: 'Показать изображения',
  hideImages: 'Скрыть изображения',
  copied: 'Скопировано',
  copyFailed: 'Не удалось скопировать. Возможно, браузер не разрешает это на этой странице.',
  downloadFailed: 'Не удалось скачать. Попробуйте ещё раз.',
  close: 'Закрыть',
  videoCount: 'Видео: {n}',

  badgeShorts: 'Вертикальное (Shorts)',
  badgeCustom: 'Своё превью',
  badgeAuto: 'Превью — автоматический кадр {n}',

  embedUrl: 'URL изображения',
  copy: 'Копировать',
};

export default ru;
