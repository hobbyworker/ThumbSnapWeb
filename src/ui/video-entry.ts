import { loadImage, probeImage, type LoadedImage } from '../core/fetcher';
import { extractPalette, sameBytes } from '../core/image';
import { fetchOEmbed, type OEmbedInfo } from '../core/oembed';
import { targetKey, type Target } from '../core/parse';
import {
  FRAME_NUMBERS,
  HQ720,
  ORIGINALS,
  SIZES,
  THUMBNAILS,
  frameVariant,
  imageUrl,
  type FrameNumber,
  type SizeKey,
  type Variant,
} from '../core/variants';

export type SlotState =
  | { readonly status: 'idle' | 'loading' | 'missing' | 'error' }
  | { readonly status: 'ok'; readonly image: LoadedImage; readonly src: string };

export type MetaState =
  | { readonly status: 'loading' | 'unavailable' | 'error' }
  | { readonly status: 'ok'; readonly info: OEmbedInfo };

export type WebpState =
  | { readonly status: 'loading' | 'missing' }
  | { readonly status: 'ok'; readonly width: number; readonly height: number };

/** Whether the thumbnail is one of the auto frames (byte-identical to hq1–3) or an upload. */
export type ThumbnailSource = { readonly kind: 'custom' } | { readonly kind: 'auto'; readonly frame: FrameNumber };

export type Section = 'original' | 'frames' | 'webp' | 'embed';
export type EntryPhase = 'resolving' | 'loading' | 'ready' | 'notfound' | 'error' | 'playlist-failed';

const IDLE: SlotState = { status: 'idle' };

/** State and loading logic for one video (or playlist cover video). Rendering lives in render.ts. */
export class VideoEntry {
  readonly key: string;
  readonly target: Target;
  /** The video ID, or for a playlist the ID of its cover video once known. */
  id?: string;
  playlistTitle?: string;
  meta: MetaState = { status: 'loading' };
  source?: ThumbnailSource;
  palette?: string[];
  expanded = true;
  readonly open: Record<Section, boolean> = { original: true, frames: false, webp: false, embed: false };
  readonly frameSize = new Map<FrameNumber, SizeKey>();

  #playlistFailed = false;
  #started = false;
  readonly #slots = new Map<string, SlotState>();
  readonly #pending = new Map<string, Promise<SlotState>>();
  readonly #webp = new Map<string, WebpState>();
  readonly #objectUrls: string[] = [];
  readonly #abort = new AbortController();
  readonly #onChange: () => void;

  constructor(target: Target, onChange: () => void) {
    this.target = target;
    this.key = targetKey(target);
    this.#onChange = onChange;
    if (target.kind === 'video') this.id = target.id;
  }

  get started(): boolean {
    return this.#started;
  }

  get title(): string | undefined {
    return this.meta.status === 'ok' ? this.meta.info.title : undefined;
  }

  get phase(): EntryPhase {
    if (this.#playlistFailed) return 'playlist-failed';
    if (!this.id) return 'resolving';
    const states = THUMBNAILS.map((v) => this.slot(v.key).status);
    if (states.includes('ok')) return 'ready';
    if (states.includes('idle') || states.includes('loading')) return 'loading';
    return states.every((s) => s === 'missing') ? 'notfound' : 'error';
  }

  /** Thumbnail cards: the five sizes, plus hq720 when it stands in for a missing maxresdefault. */
  get thumbnails(): Variant[] {
    return this.slot(HQ720.key).status === 'ok' ? [THUMBNAILS[0], HQ720, ...THUMBNAILS.slice(1)] : [...THUMBNAILS];
  }

  slot(key: string): SlotState {
    return this.#slots.get(key) ?? IDLE;
  }

  webp(key: string): WebpState | undefined {
    return this.#webp.get(key);
  }

  /**
   * Largest thumbnail, decided only once every larger size has answered (so a fast small file
   * is never labelled best while maxresdefault is still loading).
   */
  best(): { variant: Variant; image: LoadedImage; src: string } | undefined {
    const maxres = this.slot(THUMBNAILS[0].key).status;
    for (const variant of [THUMBNAILS[0], HQ720, ...THUMBNAILS.slice(1)]) {
      // hq720 is only requested once maxresdefault turns out to be missing.
      if (variant === HQ720 && maxres !== 'missing') continue;
      const state = this.slot(variant.key);
      if (state.status === 'ok') return { variant, image: state.image, src: state.src };
      if (state.status === 'idle' || state.status === 'loading') return undefined;
    }
    return undefined;
  }

  /** Largest thumbnail loaded so far, for showing something while best() is undecided. */
  preview(): { image: LoadedImage; src: string } | undefined {
    for (const variant of this.thumbnails) {
      const state = this.slot(variant.key);
      if (state.status === 'ok') return { image: state.image, src: state.src };
    }
    return undefined;
  }

  /** True when YouTube reports a vertical player or the original frames are portrait. */
  get vertical(): boolean {
    if (this.meta.status === 'ok' && this.meta.info.vertical) return true;
    const oar = this.slot('oar1');
    return oar.status === 'ok' && oar.image.height > oar.image.width;
  }

  async start(): Promise<void> {
    if (this.#started) return;
    this.#started = true;
    if (this.target.kind === 'playlist') {
      const res = await fetchOEmbed(this.target, this.#abort.signal);
      if (this.#abort.signal.aborted) return;
      if (res.status !== 'ok' || !res.info.videoId) {
        this.#playlistFailed = true;
        this.meta = { status: res.status === 'error' ? 'error' : 'unavailable' };
        this.#changed();
        return;
      }
      this.playlistTitle = res.info.title;
      this.id = res.info.videoId;
      this.#changed();
    }
    await Promise.all([this.#loadMeta(), this.#loadThumbnails()]);
  }

  /** Loads a variant once; concurrent and later calls share the result. */
  ensure(variant: Variant): Promise<SlotState> {
    const current = this.slot(variant.key);
    if (current.status === 'ok' || current.status === 'missing') return Promise.resolve(current);
    const pending = this.#pending.get(variant.key);
    if (pending) return pending;
    const promise = this.#load(variant).finally(() => this.#pending.delete(variant.key));
    this.#pending.set(variant.key, promise);
    return promise;
  }

  setOpen(section: Section, open: boolean): void {
    if (this.open[section] === open) return;
    this.open[section] = open;
    if (open) void this.loadSection(section);
    this.#changed();
  }

  selectFrameSize(frame: FrameNumber, size: SizeKey): void {
    this.frameSize.set(frame, size);
    void this.ensure(frameVariant(frame, size));
    this.#changed();
  }

  async loadSection(section: Section): Promise<void> {
    if (!this.id) return;
    if (section === 'original') await Promise.all(ORIGINALS.map((v) => this.ensure(v)));
    else if (section === 'frames') await Promise.all(FRAME_NUMBERS.map((n) => this.#bestFrame(n)));
    else if (section === 'webp') await this.#probeWebp(this.id);
  }

  /** What a ZIP holds: every thumbnail, the original frames and the largest size of each auto frame. */
  async collect(): Promise<{ variant: Variant; image: LoadedImage }[]> {
    await Promise.all([this.loadSection('original'), this.loadSection('frames')]);
    const frames = FRAME_NUMBERS.flatMap((n) => {
      const size = this.frameSize.get(n);
      return size ? [frameVariant(n, size)] : [];
    });
    return [...this.thumbnails, ...ORIGINALS, ...frames].flatMap((variant) => {
      const state = this.slot(variant.key);
      return state.status === 'ok' ? [{ variant, image: state.image }] : [];
    });
  }

  /** Requests again whatever failed with a network error. */
  retry(): void {
    if (!this.id) {
      this.#playlistFailed = false;
      this.#started = false;
      this.meta = { status: 'loading' };
      void this.start();
      return;
    }
    for (const [key, state] of this.#slots) if (state.status === 'error') this.#slots.delete(key);
    if (this.meta.status === 'error') {
      this.meta = { status: 'loading' };
      void this.#loadMeta();
    }
    void this.#loadThumbnails();
    if (this.open.frames) void this.loadSection('frames');
    this.#changed();
  }

  dispose(): void {
    this.#abort.abort();
    for (const url of this.#objectUrls.splice(0)) URL.revokeObjectURL(url);
  }

  async #loadMeta(): Promise<void> {
    const res = await fetchOEmbed({ kind: 'video', id: this.id! }, this.#abort.signal);
    if (this.#abort.signal.aborted) return;
    this.meta = res.status === 'ok' ? { status: 'ok', info: res.info } : { status: res.status };
    this.#changed();
  }

  async #loadThumbnails(): Promise<void> {
    const [maxres] = await Promise.all(THUMBNAILS.map((v) => this.ensure(v)));
    if (this.#abort.signal.aborted) return;
    if (maxres.status === 'missing') await this.ensure(HQ720);
    if (this.open.original) void this.loadSection('original');
    void this.#analyze();
  }

  /** Dominant colors of the thumbnail, and whether it is an auto frame or a custom upload. */
  async #analyze(): Promise<void> {
    const best = this.best();
    if (best && !this.palette) {
      try {
        this.palette = await extractPalette(best.image.blob);
        this.#changed();
      } catch {
        // Palette is decorative; ignore decoding failures.
      }
    }
    const hq = this.slot('hqdefault');
    if (hq.status !== 'ok' || this.source) return;
    const frames = await Promise.all(FRAME_NUMBERS.map((n) => this.ensure(frameVariant(n, 'hq'))));
    if (this.#abort.signal.aborted) return;
    let compared = false;
    for (const [i, state] of frames.entries()) {
      if (state.status !== 'ok') continue;
      compared = true;
      if (await sameBytes(hq.image.blob, state.image.blob)) {
        this.source = { kind: 'auto', frame: FRAME_NUMBERS[i] };
        this.#changed();
        return;
      }
    }
    // Live streams have no auto frames, so nothing can be said about them.
    if (compared) {
      this.source = { kind: 'custom' };
      this.#changed();
    }
  }

  /** Chooses the largest size that exists for an auto frame (unless the user picked one). */
  async #bestFrame(frame: FrameNumber): Promise<void> {
    const chosen = this.frameSize.get(frame);
    if (chosen) {
      await this.ensure(frameVariant(frame, chosen));
      return;
    }
    for (const size of SIZES) {
      const state = await this.ensure(frameVariant(frame, size.key));
      if (state.status === 'ok') {
        if (!this.frameSize.has(frame)) this.frameSize.set(frame, size.key);
        this.#changed();
        return;
      }
      if (state.status !== 'missing') return;
    }
  }

  async #probeWebp(id: string): Promise<void> {
    await Promise.all(
      THUMBNAILS.map(async (variant) => {
        if (this.#webp.has(variant.key)) return;
        this.#webp.set(variant.key, { status: 'loading' });
        this.#changed();
        const size = await probeImage(imageUrl(id, variant.key, 'webp'), variant.width);
        if (this.#abort.signal.aborted) return;
        this.#webp.set(variant.key, size ? { status: 'ok', ...size } : { status: 'missing' });
        this.#changed();
      }),
    );
  }

  async #load(variant: Variant): Promise<SlotState> {
    if (!this.id) return IDLE;
    this.#slots.set(variant.key, { status: 'loading' });
    this.#changed();
    const res = await loadImage(imageUrl(this.id, variant.key), this.#abort.signal);
    if (this.#abort.signal.aborted) return IDLE;
    let state: SlotState;
    if (res.status === 'ok') {
      const src = URL.createObjectURL(res.image.blob);
      this.#objectUrls.push(src);
      state = { status: 'ok', image: res.image, src };
    } else {
      state = { status: res.status };
    }
    this.#slots.set(variant.key, state);
    this.#changed();
    return state;
  }

  #changed(): void {
    if (!this.#abort.signal.aborted) this.#onChange();
  }
}
