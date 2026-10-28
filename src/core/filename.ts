/** Safe, readable file names for downloads. */

export type FilenameStyle = 'id' | 'title';

const ILLEGAL = /[\\/:*?"<>|\u0000-\u001f\u007f]+/g;

/** Removes characters Windows, macOS or Linux reject and caps the length (in code points). */
export function sanitizeFilename(input: string, maxLength = 80): string {
  const cleaned = input
    .normalize('NFC')
    .replace(ILLEGAL, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^\.+|\.+$/g, '')
    .trim();
  const chars = Array.from(cleaned);
  return chars.length > maxLength ? chars.slice(0, maxLength).join('').trim() : cleaned;
}

/** `dQw4w9WgXcQ`, or `Video title [dQw4w9WgXcQ]` when the title style is chosen and known. */
export function baseName(id: string, title: string | undefined, style: FilenameStyle): string {
  const safeTitle = style === 'title' && title ? sanitizeFilename(title) : '';
  return safeTitle ? `${safeTitle} [${id}]` : id;
}

export function fileName(base: string, variantKey: string, ext: string): string {
  return `${base}-${variantKey}.${ext}`;
}
