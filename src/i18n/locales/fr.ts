import type { Messages } from '../types';

// French typography:   (no-break space) before ':' and inside « ».
const fr: Messages = {
  inputLabel: 'Lien YouTube ou ID de vidéo',
  inputPlaceholder: 'Collez un lien YouTube : vidéo, Shorts, live ou playlist',
  inputHint: 'Ajoutez plusieurs liens à la fois, un par ligne.',
  paste: 'Coller',
  submit: 'Obtenir les miniatures',
  clearInput: 'Effacer la saisie',
  recent: 'Récents',
  clearRecent: "Effacer l'historique",
  noTargets: "Aucun lien YouTube ni ID de vidéo trouvé. Vérifiez l'adresse et réessayez.",
  tooMany: 'Seules les {max} premières vidéos sont affichées.',
  pasteBlocked: "Le navigateur a bloqué l'accès au presse-papiers. Collez avec Ctrl+V ou ⌘V.",

  optFormat: 'Format',
  formatOriginal: 'Original (JPG)',
  optCrop: 'Supprimer les bandes noires',
  optCropHint: 'Recadre les bandes noires des images 4:3 lors du téléchargement ou de la copie.',
  optFilename: 'Nom du fichier',
  filenameId: 'ID de la vidéo',
  filenameTitle: 'Titre + ID de la vidéo',
  formatFallback: 'Ce navigateur ne peut pas créer de fichiers {format} : le format PNG a été utilisé.',

  loading: 'Chargement…',
  unavailable: 'Non disponible',
  metaUnavailable:
    'Les informations de la vidéo sont indisponibles (privée, supprimée ou restreinte), mais les miniatures existent peut-être encore.',
  notFound: "Aucune miniature trouvée. La vidéo est peut-être privée ou supprimée, ou l'ID est erroné.",
  networkError: 'Erreur réseau. Vérifiez votre connexion et réessayez.',
  retry: 'Réessayer',
  playlistCover: 'Playlist « {title} » : affichage de sa vidéo de couverture.',
  playlistUnavailable:
    'Impossible de lire cette playlist. Elle est peut-être privée ou personnelle, comme « À regarder plus tard ».',

  sectionThumbnails: 'Miniatures',
  sectionThumbnailsHint: 'La miniature de la vidéo dans toutes les tailles fournies par YouTube.',
  sectionOriginal: "Images au format d'origine",
  sectionOriginalHint:
    "Images capturées par YouTube au format d'origine de la vidéo, sans bandes noires\u00a0: verticales pour les Shorts, jusqu'en 1080p.",
  originalMissing: "Cette vidéo n'a pas d'images 1–3 au format d'origine. YouTube ne les conserve généralement que pour les Shorts et les vidéos plus anciennes.",
  sectionFrames: 'Images générées automatiquement',
  sectionFramesHint: 'Les trois images que YouTube choisit automatiquement au début, au milieu et à la fin de la vidéo.',
  sectionWebp: 'Versions WebP',
  sectionWebpHint:
    "Fichiers WebP plus légers fournis par YouTube. Ouvrez-en un pour l'enregistrer, ou choisissez le format WebP pour convertir n'importe quelle image.",
  sectionEmbed: "Code d'intégration",
  sectionEmbedHint: 'Une miniature cliquable pour les blogs, les README et les forums.',

  colors: 'Couleurs',
  copyColor: 'Copier {color}',

  sizeMaxres: 'Résolution maximale',
  size720: 'HD 720p',
  sizeSd: 'Standard',
  sizeHq: 'Haute',
  sizeMq: 'Moyenne',
  sizeDefault: 'Petite',
  frameN: 'Image {n}',
  firstFrame: 'Première image',
  imageSize: 'Taille',

  best: 'Meilleure',
  downloadBest: 'Télécharger la meilleure',
  downloadZip: 'Tout télécharger (ZIP)',
  downloadEverything: 'Télécharger toutes les vidéos (ZIP)',
  zipping: 'Préparation du ZIP…',
  download: 'Télécharger',
  copyImage: "Copier l'image",
  copyImageUrl: "Copier l'URL de l'image",
  copyVideoLink: 'Copier le lien de la vidéo',
  openImage: "Ouvrir l'image",
  openVideo: 'Regarder sur YouTube',
  share: 'Partager',
  remove: 'Retirer',
  showImages: 'Afficher les images',
  hideImages: 'Masquer les images',
  copied: 'Copié',
  copyFailed: "Copie impossible. Votre navigateur ne l'autorise peut-être pas ici.",
  downloadFailed: 'Le téléchargement a échoué. Veuillez réessayer.',
  close: 'Fermer',
  videoCount: 'Vidéos : {n}',

  badgeShorts: 'Verticale (Shorts)',
  badgeCustom: 'Miniature personnalisée',
  badgeAuto: "L'image auto {n} sert de miniature",

  embedUrl: "URL de l'image",
  copy: 'Copier',
};

export default fr;
