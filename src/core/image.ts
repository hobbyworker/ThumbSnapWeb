/** In-browser image processing: letterbox removal, format conversion and color palettes. */

export type OutputFormat = 'original' | 'png' | 'webp' | 'avif' | 'jpeg';
type EncodedFormat = Exclude<OutputFormat, 'original'>;

export interface Rect {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface TransformResult {
  readonly blob: Blob;
  readonly ext: string;
  readonly cropped: boolean;
  /** Set when the browser could not encode the requested format and PNG was used instead. */
  readonly fallbackFrom?: OutputFormat;
}

const MIME: Record<EncodedFormat, string> = {
  png: 'image/png',
  webp: 'image/webp',
  avif: 'image/avif',
  jpeg: 'image/jpeg',
};
const EXT_BY_MIME: Record<string, string> = {
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/jpeg': 'jpg',
};
const RATIOS = [16 / 9, 9 / 16, 4 / 3, 3 / 4, 1, 21 / 9, 1.85, 2.39];

const encodable = new Map<string, boolean>();

/** Whether this browser's canvas can encode the format (Safari has no WebP encoder, few have AVIF). */
export function canEncode(format: EncodedFormat): boolean {
  const mime = MIME[format];
  let ok = encodable.get(mime);
  if (ok === undefined) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    ok = canvas.toDataURL(mime).startsWith(`data:${mime}`);
    encodable.set(mime, ok);
  }
  return ok;
}

export function extensionOf(blob: Blob): string {
  return EXT_BY_MIME[blob.type] ?? 'jpg';
}

function context(width: number, height: number): CanvasRenderingContext2D {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Canvas 2D is unavailable');
  return ctx;
}

function toBlob(canvas: HTMLCanvasElement, mime: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Encoding failed'))), mime, quality);
  });
}

/** Trims a rect that is within 2.5% of a common aspect ratio to that exact ratio, keeping it centred. */
function snapToRatio(rect: Rect, trimmedRows: boolean): Rect {
  const ratio = rect.width / rect.height;
  const target = RATIOS.find((r) => Math.abs(ratio / r - 1) < 0.025);
  if (!target) return rect;
  if (trimmedRows) {
    const height = Math.min(rect.height, Math.round(rect.width / target));
    return { ...rect, y: rect.y + Math.round((rect.height - height) / 2), height };
  }
  const width = Math.min(rect.width, Math.round(rect.height * target));
  return { ...rect, x: rect.x + Math.round((rect.width - width) / 2), width };
}

/**
 * Finds letterbox (top/bottom) or pillarbox (left/right) bars: symmetric runs of rows or columns
 * that are almost entirely near-black. Returns the content rect, or null when there are none.
 */
export function findContentRect(image: ImageData): Rect | null {
  const { width: w, height: h, data } = image;
  const dark = (x: number, y: number) => {
    const i = (y * w + x) * 4;
    return data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114 <= 32;
  };
  const rowIsBar = (y: number) => {
    let n = 0;
    for (let x = 0; x < w; x++) if (dark(x, y)) n++;
    return n >= w * 0.98;
  };
  const columnIsBar = (x: number) => {
    let n = 0;
    for (let y = 0; y < h; y++) if (dark(x, y)) n++;
    return n >= h * 0.98;
  };
  const run = (limit: number, isBar: (i: number) => boolean) => {
    let i = 0;
    while (i < limit && isBar(i)) i++;
    return i;
  };
  const symmetric = (a: number, b: number, length: number) =>
    a >= Math.max(2, length * 0.03) && b >= Math.max(2, length * 0.03) && Math.abs(a - b) <= Math.max(3, length * 0.02);

  const top = run(h / 2, (i) => rowIsBar(i));
  const bottom = run(h / 2, (i) => rowIsBar(h - 1 - i));
  const left = run(w / 2, (i) => columnIsBar(i));
  const right = run(w / 2, (i) => columnIsBar(w - 1 - i));

  const rows = symmetric(top, bottom, h);
  const columns = symmetric(left, right, w);
  if (!rows && !columns) return null;

  const rect: Rect = {
    x: columns ? left : 0,
    y: rows ? top : 0,
    width: columns ? w - left - right : w,
    height: rows ? h - top - bottom : h,
  };
  // Mostly dark pictures are not letterboxed.
  if (rect.width < w * 0.3 || rect.height < h * 0.3) return null;
  return snapToRatio(rect, rows);
}

async function contentRectOf(bitmap: ImageBitmap): Promise<Rect | null> {
  const ctx = context(bitmap.width, bitmap.height);
  ctx.drawImage(bitmap, 0, 0);
  return findContentRect(ctx.getImageData(0, 0, bitmap.width, bitmap.height));
}

/** Converts and/or crops an image. Returns the input untouched when nothing needs to change. */
export async function transformImage(
  blob: Blob,
  options: { format: OutputFormat; crop: boolean; quality?: number },
): Promise<TransformResult> {
  let format = options.format;
  let fallbackFrom: OutputFormat | undefined;
  if (format !== 'original' && format !== 'png' && !canEncode(format)) {
    fallbackFrom = format;
    format = 'png';
  }
  if (format === 'original' && !options.crop) return { blob, ext: extensionOf(blob), cropped: false };

  const bitmap = await createImageBitmap(blob);
  try {
    const rect = options.crop ? await contentRectOf(bitmap) : null;
    if (!rect && format === 'original') return { blob, ext: extensionOf(blob), cropped: false, fallbackFrom };
    const area = rect ?? { x: 0, y: 0, width: bitmap.width, height: bitmap.height };
    const ctx = context(area.width, area.height);
    ctx.drawImage(bitmap, area.x, area.y, area.width, area.height, 0, 0, area.width, area.height);
    const mime = format === 'original' ? blob.type || 'image/jpeg' : MIME[format];
    const out = await toBlob(ctx.canvas, mime, options.quality ?? 0.92);
    return { blob: out, ext: EXT_BY_MIME[mime] ?? 'jpg', cropped: rect !== null, fallbackFrom };
  } finally {
    bitmap.close();
  }
}

function hex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;
}

/** Dominant colors, most common first, skipping near-duplicates and letterbox bars. */
export async function extractPalette(blob: Blob, count = 6): Promise<string[]> {
  const bitmap = await createImageBitmap(blob);
  try {
    const area = (await contentRectOf(bitmap)) ?? { x: 0, y: 0, width: bitmap.width, height: bitmap.height };
    const scale = Math.min(1, 96 / area.width);
    const w = Math.max(1, Math.round(area.width * scale));
    const h = Math.max(1, Math.round(area.height * scale));
    const ctx = context(w, h);
    ctx.drawImage(bitmap, area.x, area.y, area.width, area.height, 0, 0, w, h);
    const { data } = ctx.getImageData(0, 0, w, h);

    // 4 bits per channel buckets, averaged so each color is a real tone from the picture.
    const buckets = new Map<number, { r: number; g: number; b: number; n: number }>();
    for (let i = 0; i < data.length; i += 4) {
      const key = ((data[i] >> 4) << 8) | ((data[i + 1] >> 4) << 4) | (data[i + 2] >> 4);
      const bucket = buckets.get(key) ?? { r: 0, g: 0, b: 0, n: 0 };
      bucket.r += data[i];
      bucket.g += data[i + 1];
      bucket.b += data[i + 2];
      bucket.n++;
      buckets.set(key, bucket);
    }
    const picked: { r: number; g: number; b: number }[] = [];
    for (const { r, g, b, n } of [...buckets.values()].sort((a, z) => z.n - a.n)) {
      const color = { r: r / n, g: g / n, b: b / n };
      const distinct = picked.every((p) => Math.hypot(p.r - color.r, p.g - color.g, p.b - color.b) > 48);
      if (distinct) picked.push(color);
      if (picked.length === count) break;
    }
    return picked.map(({ r, g, b }) => hex(r, g, b));
  } finally {
    bitmap.close();
  }
}

/** Byte-for-byte comparison, used to tell which auto frame (if any) became the thumbnail. */
export async function sameBytes(a: Blob, b: Blob): Promise<boolean> {
  if (a.size !== b.size) return false;
  const [x, y] = await Promise.all([a.arrayBuffer(), b.arrayBuffer()]).then((bufs) => bufs.map((buf) => new Uint8Array(buf)));
  for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) return false;
  return true;
}
