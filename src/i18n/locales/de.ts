import type { Messages } from '../types';

const de: Messages = {
  inputLabel: 'YouTube-Link oder Video-ID',
  inputPlaceholder: 'YouTube-Link einfügen: Video, Shorts, Livestream oder Playlist',
  inputHint: 'Mehrere Links auf einmal möglich, einer pro Zeile.',
  paste: 'Einfügen',
  submit: 'Thumbnails abrufen',
  clearInput: 'Eingabe löschen',
  recent: 'Zuletzt',
  clearRecent: 'Verlauf löschen',
  noTargets: 'Kein YouTube-Link und keine Video-ID gefunden. Prüfe die Adresse und versuche es erneut.',
  tooMany: 'Es werden nur die ersten {max} Videos angezeigt.',
  pasteBlocked: 'Der Browser hat den Zugriff auf die Zwischenablage blockiert. Füge mit Strg+V oder ⌘V ein.',

  optFormat: 'Format',
  formatOriginal: 'Original (JPG)',
  optCrop: 'Schwarze Balken entfernen',
  optCropHint: 'Schneidet beim Herunterladen oder Kopieren die Letterbox-Balken aus 4:3-Bildern.',
  optFilename: 'Dateiname',
  filenameId: 'Video-ID',
  filenameTitle: 'Titel + Video-ID',
  formatFallback: 'Dieser Browser kann keine {format}-Dateien erstellen, daher wurde PNG verwendet.',

  loading: 'Wird geladen…',
  unavailable: 'Nicht verfügbar',
  metaUnavailable:
    'Videodetails sind nicht verfügbar (privat, entfernt oder eingeschränkt), Thumbnails können aber noch existieren.',
  notFound: 'Keine Thumbnails gefunden. Das Video ist möglicherweise privat oder entfernt, oder die ID ist falsch.',
  networkError: 'Netzwerkfehler. Prüfe deine Verbindung und versuche es erneut.',
  retry: 'Erneut versuchen',
  playlistCover: 'Playlist „{title}“: Das Titelvideo wird angezeigt.',
  playlistUnavailable:
    'Diese Playlist kann nicht gelesen werden. Sie ist möglicherweise privat oder eine persönliche Liste wie „Später ansehen“.',

  sectionThumbnails: 'Thumbnails',
  sectionThumbnailsHint: 'Das Video-Thumbnail in allen Größen, die YouTube bereitstellt.',
  sectionOriginal: 'Frames im Originalformat',
  sectionOriginalHint:
    'Von YouTube im ursprünglichen Seitenverhältnis des Videos aufgenommene Frames, ohne schwarze Balken: hochkant bei Shorts, bis 1080p.',
  sectionFrames: 'Automatisch erzeugte Frames',
  sectionFramesHint: 'Die drei Frames, die YouTube automatisch vom Anfang, aus der Mitte und vom Ende des Videos auswählt.',
  sectionWebp: 'WebP-Versionen',
  sectionWebpHint:
    'Kleinere WebP-Dateien von YouTube. Öffne eine zum Speichern oder stelle das Format auf WebP, um jedes Bild umzuwandeln.',
  sectionEmbed: 'Einbettungscode',
  sectionEmbedHint: 'Ein anklickbares Thumbnail für Blogs, READMEs und Foren.',

  colors: 'Farben',
  copyColor: '{color} kopieren',

  sizeMaxres: 'Maximale Auflösung',
  size720: 'HD 720p',
  sizeSd: 'Standard',
  sizeHq: 'Hoch',
  sizeMq: 'Mittel',
  sizeDefault: 'Klein',
  frameN: 'Frame {n}',
  firstFrame: 'Erster Frame',
  imageSize: 'Größe',

  best: 'Beste',
  downloadBest: 'Beste Qualität laden',
  downloadZip: 'Alle herunterladen (ZIP)',
  downloadEverything: 'Alle Videos herunterladen (ZIP)',
  zipping: 'ZIP wird erstellt…',
  download: 'Herunterladen',
  copyImage: 'Bild kopieren',
  copyImageUrl: 'Bild-URL kopieren',
  copyVideoLink: 'Videolink kopieren',
  openImage: 'Bild öffnen',
  openVideo: 'Auf YouTube ansehen',
  share: 'Teilen',
  remove: 'Entfernen',
  showImages: 'Bilder anzeigen',
  hideImages: 'Bilder ausblenden',
  copied: 'Kopiert',
  copyFailed: 'Kopieren nicht möglich. Dein Browser erlaubt es hier möglicherweise nicht.',
  downloadFailed: 'Download fehlgeschlagen. Bitte versuche es erneut.',
  close: 'Schließen',
  videoCount: 'Videos: {n}',

  badgeShorts: 'Hochformat (Shorts)',
  badgeCustom: 'Eigenes Thumbnail',
  badgeAuto: 'Auto-Frame {n} ist das Thumbnail',

  embedUrl: 'Bild-URL',
  copy: 'Kopieren',

  disclaimer:
    'Thumbnails gehören ihren Urhebern. Achte bei der Weiterverwendung auf das Urheberrecht. Nicht mit YouTube oder Google verbunden.',
};

export default de;
