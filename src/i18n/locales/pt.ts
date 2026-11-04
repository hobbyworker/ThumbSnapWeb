import type { Messages } from '../types';

const pt: Messages = {
  inputLabel: 'Link do YouTube ou ID do vídeo',
  inputPlaceholder: 'Cole um link do YouTube: vídeo, Shorts, direto ou lista de reprodução',
  inputHint: 'Adicione vários links de uma só vez, um por linha.',
  paste: 'Colar',
  submit: 'Obter miniaturas',
  clearInput: 'Limpar entrada',
  recent: 'Recentes',
  clearRecent: 'Limpar histórico',
  noTargets: 'Não foi encontrado nenhum link do YouTube nem ID de vídeo. Verifique o endereço e tente novamente.',
  tooMany: 'São mostrados apenas os primeiros {max} vídeos.',
  pasteBlocked: 'O browser bloqueou o acesso à área de transferência. Cole com Ctrl+V ou ⌘V.',

  optFormat: 'Formato',
  formatOriginal: 'Original (JPG)',
  optCrop: 'Remover barras pretas',
  optCropHint: 'Recorta as barras pretas das imagens 4:3 ao transferir ou copiar.',
  optFilename: 'Nome do ficheiro',
  filenameId: 'ID do vídeo',
  filenameTitle: 'Título + ID do vídeo',
  formatFallback: 'Este browser não consegue criar ficheiros {format}, por isso foi usado PNG.',

  loading: 'A carregar…',
  unavailable: 'Indisponível',
  metaUnavailable:
    'Os detalhes do vídeo não estão disponíveis (privado, removido ou restrito), mas as miniaturas podem continuar a existir.',
  notFound: 'Não foi encontrada nenhuma miniatura. O vídeo pode ser privado ou ter sido removido, ou o ID pode estar errado.',
  networkError: 'Erro de rede. Verifique a sua ligação e tente novamente.',
  retry: 'Tentar novamente',
  playlistCover: 'Lista de reprodução «{title}»: a mostrar o vídeo de capa.',
  playlistUnavailable:
    'Não é possível ler esta lista de reprodução. Pode ser privada ou uma lista pessoal, como Ver mais tarde.',

  sectionThumbnails: 'Miniaturas',
  sectionThumbnailsHint: 'A miniatura do vídeo em todos os tamanhos que o YouTube disponibiliza.',
  sectionOriginal: 'Fotogramas na proporção original',
  sectionOriginalHint:
    'Fotogramas captados pelo YouTube na proporção original do vídeo, sem barras pretas: verticais nos Shorts, até 1080p.',
  originalMissing: 'Este vídeo não tem os fotogramas 1–3 na proporção original. Normalmente, o YouTube só os guarda para Shorts e vídeos mais antigos.',
  sectionFrames: 'Fotogramas automáticos',
  sectionFramesHint: 'Os três fotogramas que o YouTube escolhe automaticamente do início, do meio e do fim do vídeo.',
  sectionWebp: 'Versões WebP',
  sectionWebpHint:
    'Ficheiros WebP mais leves do YouTube. Abra um para o guardar ou escolha o formato WebP para converter qualquer imagem.',
  sectionEmbed: 'Código de incorporação',
  sectionEmbedHint: 'Uma miniatura clicável para blogues, READMEs e fóruns.',

  colors: 'Cores',
  copyColor: 'Copiar {color}',

  sizeMaxres: 'Resolução máxima',
  size720: 'HD 720p',
  sizeSd: 'Padrão',
  sizeHq: 'Alta',
  sizeMq: 'Média',
  sizeDefault: 'Pequena',
  frameN: 'Fotograma {n}',
  firstFrame: 'Primeiro fotograma',
  imageSize: 'Tamanho',

  best: 'Melhor',
  downloadBest: 'Transferir a melhor',
  downloadZip: 'Transferir tudo (ZIP)',
  downloadEverything: 'Transferir todos os vídeos (ZIP)',
  zipping: 'A preparar o ZIP…',
  download: 'Transferir',
  copyImage: 'Copiar imagem',
  copyImageUrl: 'Copiar URL da imagem',
  copyVideoLink: 'Copiar link do vídeo',
  openImage: 'Abrir imagem',
  openVideo: 'Ver no YouTube',
  share: 'Partilhar',
  remove: 'Remover',
  showImages: 'Mostrar imagens',
  hideImages: 'Ocultar imagens',
  copied: 'Copiado',
  copyFailed: 'Não foi possível copiar. O seu browser pode não o permitir aqui.',
  downloadFailed: 'A transferência falhou. Tente novamente.',
  close: 'Fechar',
  videoCount: 'Vídeos: {n}',

  badgeShorts: 'Vertical (Shorts)',
  badgeCustom: 'Miniatura personalizada',
  badgeAuto: 'O fotograma automático {n} é a miniatura',

  embedUrl: 'URL da imagem',
  copy: 'Copiar',
};

export default pt;
