/**
 * Catalog of the image files i.ytimg.com serves for a video.
 * See docs/youtube-thumbnails.md for how each one behaves.
 */

export type SizeKey = 'maxres' | 'sd' | 'hq' | 'mq' | 'default';
export type VariantGroup = 'thumbnail' | 'original' | 'frame';
export type FrameNumber = 1 | 2 | 3;

export interface Variant {
  /** File stem on the CDN, e.g. `maxresdefault`, `oar2`, `hq3`. */
  readonly key: string;
  readonly group: VariantGroup;
  readonly size?: SizeKey;
  /** 1–3: frames YouTube captures through the video. 0: its first frame. */
  readonly frame?: 0 | FrameNumber;
  /** Nominal size. Absent for files served at the video's native resolution. */
  readonly width?: number;
  readonly height?: number;
}

export interface SizeSpec {
  readonly key: SizeKey;
  readonly width: number;
  readonly height: number;
  readonly stem: string;
  readonly framePrefix: string;
}

export const SIZES: readonly SizeSpec[] = [
  { key: 'maxres', width: 1280, height: 720, stem: 'maxresdefault', framePrefix: 'maxres' },
  { key: 'sd', width: 640, height: 480, stem: 'sddefault', framePrefix: 'sd' },
  { key: 'hq', width: 480, height: 360, stem: 'hqdefault', framePrefix: 'hq' },
  { key: 'mq', width: 320, height: 180, stem: 'mqdefault', framePrefix: 'mq' },
  { key: 'default', width: 120, height: 90, stem: 'default', framePrefix: '' },
];

export const FRAME_NUMBERS: readonly FrameNumber[] = [1, 2, 3];

/** The video thumbnail, largest first. */
export const THUMBNAILS: readonly Variant[] = SIZES.map((s) => ({
  key: s.stem,
  group: 'thumbnail',
  size: s.key,
  width: s.width,
  height: s.height,
}));

/** Same image as `maxresdefault`; worth trying only when that one is missing. */
export const HQ720: Variant = { key: 'hq720', group: 'thumbnail', size: 'maxres', width: 1280, height: 720 };

/** Frames at the video's own resolution and aspect ratio (vertical for Shorts, up to 1080p). */
export const ORIGINALS: readonly Variant[] = [
  { key: 'oar1', group: 'original', frame: 1 },
  { key: 'oar2', group: 'original', frame: 2 },
  { key: 'oar3', group: 'original', frame: 3 },
  { key: 'frame0', group: 'original', frame: 0 },
];

export function frameVariant(frame: FrameNumber, size: SizeKey): Variant {
  const spec = SIZES.find((s) => s.key === size)!;
  return {
    key: `${spec.framePrefix}${frame}`,
    group: 'frame',
    size,
    frame,
    width: spec.width,
    height: spec.height,
  };
}

/** Auto-generated frames 1–3 in every size. */
export const FRAMES: readonly Variant[] = FRAME_NUMBERS.flatMap((n) => SIZES.map((s) => frameVariant(n, s.key)));

export const CDN_ORIGIN = 'https://i.ytimg.com';

/**
 * JPEGs under /vi/ are served with `Access-Control-Allow-Origin: *`, so pages can fetch them.
 * WebP files under /vi_webp/ are not, so they can only be displayed or opened.
 */
export function imageUrl(id: string, key: string, format: 'jpg' | 'webp' = 'jpg'): string {
  return format === 'webp' ? `${CDN_ORIGIN}/vi_webp/${id}/${key}.webp` : `${CDN_ORIGIN}/vi/${id}/${key}.jpg`;
}
