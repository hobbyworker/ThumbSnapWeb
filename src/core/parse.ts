/** Parsing of YouTube links and bare video IDs. */

export type Target =
  | { readonly kind: 'video'; readonly id: string }
  | { readonly kind: 'playlist'; readonly listId: string };

const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;
const LIST_ID = /^[A-Za-z0-9_-]{2,64}$/;
/** Path prefixes followed by a video ID: /shorts/ID, /embed/ID, /live/ID, … */
const ID_PATHS = new Set(['shorts', 'embed', 'v', 'e', 'live', 'watch', 'vi']);
/** Thumbnail CDN folders followed by a video ID: i.ytimg.com/vi/ID/hqdefault.jpg, … */
const CDN_PATHS = new Set(['vi', 'vi_webp', 'an', 'an_webp', 'sb']);

export function isVideoId(value: string): boolean {
  return VIDEO_ID.test(value);
}

export function targetKey(target: Target): string {
  return target.kind === 'video' ? `v:${target.id}` : `l:${target.listId}`;
}

export function watchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}

export function playlistUrl(listId: string): string {
  return `https://www.youtube.com/playlist?list=${listId}`;
}

function normalizeHost(hostname: string): string {
  const host = hostname.toLowerCase();
  if (host === 'img.youtube.com' || host.endsWith('.ytimg.com')) return 'cdn';
  return host.replace(/^(?:www|m|music|gaming)\./, '');
}

function fromUrl(url: URL, depth: number): Target | null {
  const host = normalizeHost(url.hostname);
  const parts = url.pathname.split('/').filter(Boolean);
  const [head, second] = parts;

  if (host === 'youtu.be') {
    return head && VIDEO_ID.test(head) ? { kind: 'video', id: head } : null;
  }
  if (host === 'cdn') {
    return head && second && CDN_PATHS.has(head) && VIDEO_ID.test(second) ? { kind: 'video', id: second } : null;
  }
  if (host !== 'youtube.com' && host !== 'youtube-nocookie.com' && host !== 'youtube.googleapis.com') {
    return null;
  }

  const v = url.searchParams.get('v');
  if (v && VIDEO_ID.test(v)) return { kind: 'video', id: v };
  // `videoseries` (an embedded playlist) happens to be 11 characters long too.
  if (head && second && ID_PATHS.has(head) && VIDEO_ID.test(second) && second !== 'videoseries') {
    return { kind: 'video', id: second };
  }

  // attribution_link?u=/watch%3Fv%3D… and oembed?url=… wrap another YouTube URL.
  if ((head === 'attribution_link' || head === 'oembed') && depth < 2) {
    const inner = url.searchParams.get('u') ?? url.searchParams.get('url');
    if (inner) {
      try {
        return fromUrl(new URL(inner, 'https://www.youtube.com'), depth + 1);
      } catch {
        return null;
      }
    }
  }

  const list = url.searchParams.get('list');
  return list && LIST_ID.test(list) ? { kind: 'playlist', listId: list } : null;
}

/** Parses one link or video ID. Returns null when it is not a supported YouTube address. */
export function parseTarget(raw: string): Target | null {
  let value = raw.trim().replace(/^[<("'[]+|[>)"'\],.;!?]+$/g, '');
  if (!value) return null;
  if (VIDEO_ID.test(value)) return { kind: 'video', id: value };
  if (!/^[a-z][a-z\d+.-]*:\/\//i.test(value)) value = `https://${value}`;
  try {
    return fromUrl(new URL(value), 0);
  } catch {
    return null;
  }
}

/** Random IDs almost always contain a digit, `-`, `_` or an inner capital; plain words do not. */
function looksLikeId(token: string): boolean {
  return /[\d_-]/.test(token) || /[A-Z]/.test(token.slice(1));
}

/**
 * Finds every YouTube target in free text (one per line, comma separated or mixed with words),
 * in order and without duplicates.
 */
export function extractTargets(text: string): Target[] {
  const tokens = text.split(/[\s,]+/).filter(Boolean);
  const seen = new Set<string>();
  const targets: Target[] = [];
  for (const token of tokens) {
    let target: Target | null = null;
    if (/[./:]/.test(token)) {
      target = parseTarget(token);
    } else if (VIDEO_ID.test(token) && (tokens.length === 1 || looksLikeId(token))) {
      target = { kind: 'video', id: token };
    }
    if (!target) continue;
    const key = targetKey(target);
    if (seen.has(key)) continue;
    seen.add(key);
    targets.push(target);
  }
  return targets;
}
