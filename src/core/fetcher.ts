/** Loading thumbnail images from the CDN. */

export interface LoadedImage {
  readonly url: string;
  readonly blob: Blob;
  readonly width: number;
  readonly height: number;
}

export type LoadResult =
  | { readonly status: 'ok'; readonly image: LoadedImage }
  | { readonly status: 'missing' }
  | { readonly status: 'error'; readonly error: unknown };

export async function measureImage(blob: Blob): Promise<{ width: number; height: number }> {
  if (typeof createImageBitmap === 'function') {
    const bitmap = await createImageBitmap(blob);
    const size = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return size;
  }
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return { width: img.naturalWidth, height: img.naturalHeight };
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Fetches an image as a Blob. A missing file is a 404 (whose body is a 120×90 grey placeholder),
 * so the status code alone tells whether the variant exists.
 */
export async function loadImage(url: string, signal?: AbortSignal): Promise<LoadResult> {
  try {
    const res = await fetch(url, { mode: 'cors', credentials: 'omit', signal });
    if (res.status === 404) return { status: 'missing' };
    if (!res.ok) return { status: 'error', error: new Error(`HTTP ${res.status}`) };
    const blob = await res.blob();
    const { width, height } = await measureImage(blob);
    return { status: 'ok', image: { url, blob, width, height } };
  } catch (error) {
    return { status: 'error', error };
  }
}

/**
 * Checks an image that cannot be fetched (no CORS) by displaying it.
 * Browsers render the 120×90 placeholder of a 404, so anything that small is treated as missing
 * unless the variant really is that small.
 */
export function probeImage(url: string, expectedWidth = 0): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      const { naturalWidth: width, naturalHeight: height } = img;
      resolve(expectedWidth > 120 && width === 120 && height === 90 ? null : { width, height });
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}
