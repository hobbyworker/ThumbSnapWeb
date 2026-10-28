/** Public API. Importing this module has no side effects; call defineThumbSnap() or import ./auto. */
export { ThumbSnapElement, defineThumbSnap } from './ui/element';
export type { ThumbSnapAction, ThumbSnapEventDetail, ThumbSnapOptions } from './ui/element';
export type { ThemeSetting } from './ui/page-sync';
// For subclasses (e.g. a branded footer via renderFooter()) so they share this build's copy of Lit.
export { css, html, nothing, svg } from 'lit';
export type { CSSResultGroup, TemplateResult } from 'lit';

export { extractTargets, isVideoId, parseTarget, playlistUrl, targetKey, watchUrl } from './core/parse';
export type { Target } from './core/parse';
export {
  CDN_ORIGIN,
  FRAMES,
  FRAME_NUMBERS,
  HQ720,
  ORIGINALS,
  SIZES,
  THUMBNAILS,
  frameVariant,
  imageUrl,
} from './core/variants';
export type { FrameNumber, SizeKey, Variant, VariantGroup } from './core/variants';
export { loadImage, probeImage } from './core/fetcher';
export type { LoadResult, LoadedImage } from './core/fetcher';
export { fetchOEmbed, parseOEmbed } from './core/oembed';
export type { OEmbedInfo, OEmbedResult } from './core/oembed';
export { canEncode, extractPalette, findContentRect, transformImage } from './core/image';
export type { OutputFormat, Rect, TransformResult } from './core/image';
export { createZip, crc32 } from './core/zip';
export type { ZipFile } from './core/zip';
export { baseName, fileName, sanitizeFilename } from './core/filename';
export type { FilenameStyle } from './core/filename';
export { htmlSnippet, markdownSnippet } from './core/snippets';

export { DEFAULT_LOCALE, LOCALES, format, getMessages, intlTag, resolveLocale } from './i18n';
export type { Locale, MessageKey, Messages } from './i18n';
