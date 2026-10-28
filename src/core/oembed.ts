/**
 * Video details from YouTube's oEmbed endpoint. It answers cross-origin requests from any origin
 * and needs no API key.
 */
import { playlistUrl, watchUrl, type Target } from './parse';

export interface OEmbedInfo {
  readonly title?: string;
  readonly author?: string;
  readonly authorUrl?: string;
  /** The embed frame is taller than wide: Shorts and other vertical videos. */
  readonly vertical: boolean;
  /** Video ID found in the thumbnail URL. For a playlist this is its cover video. */
  readonly videoId?: string;
}

export type OEmbedResult =
  | { readonly status: 'ok'; readonly info: OEmbedInfo }
  | { readonly status: 'unavailable' }
  | { readonly status: 'error'; readonly error: unknown };

const ENDPOINT = 'https://www.youtube.com/oembed';
const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", apos: "'" };

function text(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function decodeEntities(value: string): string {
  return value.replace(/&(amp|lt|gt|quot|#39|apos);/g, (_, name: string) => ENTITIES[name]);
}

export function parseOEmbed(data: Record<string, unknown>): OEmbedInfo {
  // Ended live streams come back without `title`; the iframe still carries it.
  const html = text(data.html);
  const iframeTitle = html ? /\btitle="([^"]*)"/.exec(html)?.[1] : undefined;
  const thumbnail = text(data.thumbnail_url);
  const width = Number(data.width);
  const height = Number(data.height);
  return {
    title: text(data.title) ?? (iframeTitle ? text(decodeEntities(iframeTitle)) : undefined),
    author: text(data.author_name),
    authorUrl: text(data.author_url),
    vertical: height > width,
    videoId: thumbnail ? /\/vi(?:_webp)?\/([A-Za-z0-9_-]{11})\//.exec(thumbnail)?.[1] : undefined,
  };
}

export async function fetchOEmbed(target: Target, signal?: AbortSignal): Promise<OEmbedResult> {
  const page = target.kind === 'video' ? watchUrl(target.id) : playlistUrl(target.listId);
  try {
    const res = await fetch(`${ENDPOINT}?format=json&url=${encodeURIComponent(page)}`, { credentials: 'omit', signal });
    // 400: no such video, 401/403: private or embedding disabled, 404: removed.
    if (res.status >= 400 && res.status < 500) return { status: 'unavailable' };
    if (!res.ok) return { status: 'error', error: new Error(`HTTP ${res.status}`) };
    return { status: 'ok', info: parseOEmbed((await res.json()) as Record<string, unknown>) };
  } catch (error) {
    return { status: 'error', error };
  }
}
