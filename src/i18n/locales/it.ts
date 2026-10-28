import type { Messages } from '../types';

const it: Messages = {
  inputLabel: 'Link di YouTube o ID del video',
  inputPlaceholder: 'Incolla un link di YouTube: video, Shorts, live o playlist',
  inputHint: 'Puoi aggiungere più link insieme, uno per riga.',
  paste: 'Incolla',
  submit: 'Ottieni miniature',
  clearInput: 'Cancella testo',
  recent: 'Recenti',
  clearRecent: 'Cancella cronologia',
  noTargets: "Nessun link di YouTube o ID video trovato. Controlla l'indirizzo e riprova.",
  tooMany: 'Vengono mostrati solo i primi {max} video.',
  pasteBlocked: "Il browser ha bloccato l'accesso agli appunti. Incolla con Ctrl+V o ⌘V.",

  optFormat: 'Formato',
  formatOriginal: 'Originale (JPG)',
  optCrop: 'Rimuovi bande nere',
  optCropHint: 'Ritaglia le bande nere dalle immagini 4:3 quando le scarichi o le copi.',
  optFilename: 'Nome file',
  filenameId: 'ID video',
  filenameTitle: 'Titolo + ID video',
  formatFallback: 'Questo browser non può creare file {format}, quindi è stato usato PNG.',

  loading: 'Caricamento…',
  unavailable: 'Non disponibile',
  metaUnavailable:
    'I dettagli del video non sono disponibili (privato, rimosso o con restrizioni), ma le miniature potrebbero esistere ancora.',
  notFound: "Nessuna miniatura trovata. Il video potrebbe essere privato o rimosso, oppure l'ID è errato.",
  networkError: 'Errore di rete. Controlla la connessione e riprova.',
  retry: 'Riprova',
  playlistCover: 'Playlist “{title}”: viene mostrato il video di copertina.',
  playlistUnavailable:
    'Impossibile leggere questa playlist. Potrebbe essere privata o un elenco personale come Guarda più tardi.',

  sectionThumbnails: 'Miniature',
  sectionThumbnailsHint: 'La miniatura del video in tutte le dimensioni offerte da YouTube.',
  sectionOriginal: 'Fotogrammi in proporzioni originali',
  sectionOriginalHint:
    'Fotogrammi acquisiti da YouTube nelle proporzioni originali del video, senza bande nere: verticali per gli Shorts, fino a 1080p.',
  originalMissing: 'Questo video non ha fotogrammi 1–3 in proporzioni originali. YouTube di solito li conserva solo per gli Shorts e i video più vecchi.',
  sectionFrames: 'Fotogrammi automatici',
  sectionFramesHint: "I tre fotogrammi che YouTube sceglie automaticamente dall'inizio, dalla metà e dalla fine del video.",
  sectionWebp: 'Versioni WebP',
  sectionWebpHint:
    'File WebP più leggeri forniti da YouTube. Aprine uno per salvarlo, oppure imposta il formato WebP per convertire qualsiasi immagine.',
  sectionEmbed: 'Codice di incorporamento',
  sectionEmbedHint: 'Una miniatura cliccabile per blog, README e forum.',

  colors: 'Colori',
  copyColor: 'Copia {color}',

  sizeMaxres: 'Risoluzione massima',
  size720: 'HD 720p',
  sizeSd: 'Standard',
  sizeHq: 'Alta',
  sizeMq: 'Media',
  sizeDefault: 'Piccola',
  frameN: 'Fotogramma {n}',
  firstFrame: 'Primo fotogramma',
  imageSize: 'Dimensione',

  best: 'Migliore',
  downloadBest: 'Scarica la migliore',
  downloadZip: 'Scarica tutto (ZIP)',
  downloadEverything: 'Scarica tutti i video (ZIP)',
  zipping: 'Preparazione dello ZIP…',
  download: 'Scarica',
  copyImage: 'Copia immagine',
  copyImageUrl: 'Copia URL immagine',
  copyVideoLink: 'Copia link del video',
  openImage: 'Apri immagine',
  openVideo: 'Guarda su YouTube',
  share: 'Condividi',
  remove: 'Rimuovi',
  showImages: 'Mostra immagini',
  hideImages: 'Nascondi immagini',
  copied: 'Copiato',
  copyFailed: 'Impossibile copiare. Il browser potrebbe non consentirlo qui.',
  downloadFailed: 'Download non riuscito. Riprova.',
  close: 'Chiudi',
  videoCount: 'Video: {n}',

  badgeShorts: 'Verticale (Shorts)',
  badgeCustom: 'Miniatura personalizzata',
  badgeAuto: 'La miniatura è il fotogramma automatico {n}',

  embedUrl: 'URL immagine',
  copy: 'Copia',

  disclaimer:
    "Le miniature appartengono ai loro creatori. Rispetta il diritto d'autore quando le riutilizzi. Non affiliato a YouTube o Google.",
};

export default it;
