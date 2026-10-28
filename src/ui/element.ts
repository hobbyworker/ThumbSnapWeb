import { LitElement, html, nothing, type CSSResultGroup, type PropertyValues, type TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { baseName, fileName, type FilenameStyle } from '../core/filename';
import { canEncode, transformImage, type OutputFormat } from '../core/image';
import { extractTargets, isVideoId, playlistUrl, targetKey } from '../core/parse';
import { readJson, removeKey, writeJson } from '../core/storage';
import { imageUrl, type Variant } from '../core/variants';
import { createZip, type ZipFile } from '../core/zip';
import { format, formatBytes, getMessages, type Locale, type MessageKey, type Messages } from '../i18n';
import { icons } from './icons';
import { PageSync, type ThemeSetting } from './page-sync';
import { renderEntry, variantLabel, type RenderContext } from './render';
import { styles } from './styles';
import { VideoEntry } from './video-entry';

export interface ThumbSnapOptions {
  format: OutputFormat;
  crop: boolean;
  filename: FilenameStyle;
}

export type ThumbSnapAction = 'resolve' | 'download' | 'download-zip' | 'copy-image' | 'copy-text' | 'share' | 'error';

/** Detail of the `thumbsnap` event, fired (bubbling, composed) for analytics or host integrations. */
export interface ThumbSnapEventDetail {
  readonly action: ThumbSnapAction;
  readonly videoId?: string;
  readonly variant?: string;
  readonly format?: string;
  readonly count?: number;
}

interface HistoryItem {
  readonly id: string;
  readonly title?: string;
  readonly at: number;
}

const OPTIONS_KEY = 'thumbsnap:options';
const HISTORY_KEY = 'thumbsnap:history';
const HISTORY_LIMIT = 8;
const FORMATS: readonly OutputFormat[] = ['original', 'png', 'webp', 'avif'];

function readOptions(): ThumbSnapOptions {
  const raw = readJson(OPTIONS_KEY) as Partial<ThumbSnapOptions> | undefined;
  const stored = raw?.format && FORMATS.includes(raw.format) ? raw.format : 'original';
  return {
    // A choice saved in another browser may not be encodable here.
    format: stored === 'original' || stored === 'png' || canEncode(stored) ? stored : 'original',
    crop: raw?.crop === true,
    filename: raw?.filename === 'title' ? 'title' : 'id',
  };
}

function readHistory(): HistoryItem[] {
  const raw = readJson(HISTORY_KEY);
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (item): item is HistoryItem =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.id === 'string' &&
        isVideoId(item.id) &&
        typeof item.at === 'number' &&
        (item.title === undefined || typeof item.title === 'string'),
    )
    .slice(0, HISTORY_LIMIT);
}

function legacyCopy(text: string): boolean {
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.append(area);
  area.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  area.remove();
  return ok;
}

let shareSupport: boolean | undefined;
function canShareFiles(): boolean {
  shareSupport ??=
    typeof navigator.canShare === 'function' &&
    navigator.canShare({ files: [new File([''], 'thumbnail.jpg', { type: 'image/jpeg' })] });
  return shareSupport;
}

/**
 * `<thumb-snap>`: paste YouTube links, get every thumbnail and frame YouTube serves for them.
 *
 * Attributes: `locale`, `theme` (auto | light | dark), `value`, `no-url-sync`, `no-history`, `max-videos`.
 * Slot: `footer`. Event: `thumbsnap` (see ThumbSnapEventDetail).
 */
export class ThumbSnapElement extends LitElement {
  /** Typed as a group so subclasses can extend it: `static styles = [ThumbSnapElement.styles, css`…`]`. */
  static override styles: CSSResultGroup = styles;

  static override properties = {
    locale: { type: String },
    theme: { type: String },
    value: { type: String },
    noUrlSync: { type: Boolean, attribute: 'no-url-sync' },
    noHistory: { type: Boolean, attribute: 'no-history' },
    maxVideos: { type: Number, attribute: 'max-videos' },
    _input: { state: true },
    _entries: { state: true },
    _options: { state: true },
    _history: { state: true },
    _notice: { state: true },
    _toast: { state: true },
    _zipping: { state: true },
    _viewer: { state: true },
  };

  /** Language override. By default the nearest `lang` attribute (usually `<html lang>`) decides. */
  declare locale: string | undefined;
  /** `auto` follows the page's dark mode markers, then the OS. */
  declare theme: ThemeSetting;
  /** Links or IDs to load when the element starts. */
  declare value: string | undefined;
  /** Don't read `?v=` / `?list=` from the page URL or write them back. */
  declare noUrlSync: boolean;
  /** Don't keep recently viewed videos in localStorage. */
  declare noHistory: boolean;
  declare maxVideos: number;

  private declare _input: string;
  private declare _entries: VideoEntry[];
  private declare _options: ThumbSnapOptions;
  private declare _history: HistoryItem[];
  private declare _notice: string;
  private declare _toast: { key: MessageKey; params?: Record<string, string> } | undefined;
  private declare _zipping: ReadonlySet<string>;
  private declare _viewer: { entry: VideoEntry; variant: Variant } | undefined;

  readonly #page = new PageSync(this);
  readonly #reported = new WeakSet<VideoEntry>();
  #toastTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    super();
    this.theme = 'auto';
    this.noUrlSync = false;
    this.noHistory = false;
    this.maxVideos = 20;
    this._input = '';
    this._entries = [];
    this._options = { format: 'original', crop: false, filename: 'id' };
    this._history = [];
    this._notice = '';
    this._zipping = new Set();
  }

  /** Resolved UI language. */
  protected get currentLocale(): Locale {
    return this.#page.locale;
  }

  protected get messages(): Messages {
    return getMessages(this.#page.locale);
  }

  /** Loads links or IDs as if they had been typed in. */
  load(input: string): void {
    this._input = input.trim();
    this.#submit(this._input);
  }

  /** Clears the input and every result. */
  clear(): void {
    for (const entry of this._entries) entry.dispose();
    this._entries = [];
    this._input = '';
    this._notice = '';
    this.#writeUrl();
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this._options = readOptions();
    this._history = this.noHistory ? [] : readHistory();
    if (!this._entries.length) {
      const initial = this.value?.trim() || (this.noUrlSync ? '' : this.#readUrl());
      if (initial) this.load(initial);
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    clearTimeout(this.#toastTimer);
  }

  protected override willUpdate(changed: PropertyValues): void {
    if (changed.has('locale') || changed.has('theme')) this.#page.refresh();
    this.dataset.scheme = this.#page.scheme;
  }

  protected override updated(changed: PropertyValues): void {
    if (changed.has('_input')) {
      const area = this.renderRoot.querySelector('textarea');
      if (area) this.#autosize(area);
    }
    if (changed.has('_viewer') && this._viewer) {
      const dialog = this.renderRoot.querySelector('dialog');
      if (dialog && !dialog.open) dialog.showModal();
    }
  }

  /** Hook for branded builds: content placed below the tool. Defaults to the `footer` slot. */
  protected renderFooter(): TemplateResult | typeof nothing {
    return html`<slot name="footer"></slot>`;
  }

  override render(): TemplateResult {
    const t = this.messages;
    const multi = this._entries.length > 1;
    const ctx: RenderContext = {
      t,
      locale: this.#page.locale,
      multi,
      canShare: canShareFiles(),
      isZipping: (key) => this._zipping.has(key),
      download: (entry, variant) => void this.#download(entry, variant),
      copyImage: (entry, variant) => this.#copyImage(entry, variant),
      share: (entry, variant) => void this.#share(entry, variant),
      copyText: (text) => void this.#copyText(text),
      view: (entry, variant) => (this._viewer = { entry, variant }),
      zip: (entries, key) => void this.#zip(entries, key),
      remove: (entry) => this.#remove(entry),
      toggle: (entry) => this.#toggle(entry),
    };
    return html`<div class="ts" lang=${this.#page.locale} @dragover=${this.#onDragOver} @drop=${this.#onDrop}>
      ${this.#renderForm(t)} ${this._notice ? html`<p class="msg warn" role="alert">${this._notice}</p>` : nothing}
      ${this.#renderHistory(t)}
      ${multi
        ? html`<div class="batch">
            <span>${format(t.videoCount, { n: this._entries.length })}</span>
            <button type="button" class="btn" ?disabled=${this._zipping.has('*')} @click=${() => void this.#zip(this._entries, '*')}>
              ${icons.archive}<span>${this._zipping.has('*') ? t.zipping : t.downloadEverything}</span>
            </button>
          </div>`
        : nothing}
      ${this._entries.length
        ? html`<div class="results">${repeat(this._entries, (e) => e.key, (e) => renderEntry(e, ctx))}</div>`
        : nothing}
      ${this.renderFooter()}
      <p class="disclaimer">${t.disclaimer}</p>
      ${this.#renderToast(t)} ${this.#renderViewer(t)}
    </div>`;
  }

  /** Also rendered inside the open viewer, since a modal dialog covers (and makes inert) the page. */
  #renderToast(t: Messages): TemplateResult {
    return html`<div class="toast ${this._toast ? 'show' : ''}" role="status" aria-live="polite">
      ${this._toast ? format(t[this._toast.key], this._toast.params ?? {}) : ''}
    </div>`;
  }

  #renderForm(t: Messages): TemplateResult {
    const o = this._options;
    const setOption = (patch: Partial<ThumbSnapOptions>) => {
      this._options = { ...this._options, ...patch };
      writeJson(OPTIONS_KEY, this._options);
    };
    return html`<form class="panel search" novalidate @submit=${this.#onSubmit}>
      <label class="label" for="ts-input">${t.inputLabel}</label>
      <div class="field">
        <textarea
          id="ts-input"
          rows="1"
          .value=${this._input}
          placeholder=${t.inputPlaceholder}
          spellcheck="false"
          autocomplete="off"
          autocapitalize="off"
          enterkeyhint="go"
          aria-describedby="ts-hint"
          @input=${this.#onInput}
          @keydown=${this.#onKeydown}
          @paste=${this.#onPaste}
        ></textarea>
        ${this._input
          ? html`<button type="button" class="icon-btn field-clear" title=${t.clearInput} aria-label=${t.clearInput} @click=${this.#onClear}>
              ${icons.close}
            </button>`
          : nothing}
      </div>
      <div class="search-row">
        <p class="hint" id="ts-hint">${t.inputHint}</p>
        <div class="search-actions">
          <button type="button" class="btn" @click=${this.#onPasteButton}>${icons.paste}<span>${t.paste}</span></button>
          <button type="submit" class="btn primary">${icons.search}<span>${t.submit}</span></button>
        </div>
      </div>
      <div class="options">
        <label class="opt">
          <span>${t.optFormat}</span>
          <select @change=${(e: Event) => setOption({ format: (e.target as HTMLSelectElement).value as OutputFormat })}>
            <option value="original" ?selected=${o.format === 'original'}>${t.formatOriginal}</option>
            <option value="png" ?selected=${o.format === 'png'}>PNG</option>
            ${canEncode('webp') ? html`<option value="webp" ?selected=${o.format === 'webp'}>WebP</option>` : nothing}
            ${canEncode('avif') ? html`<option value="avif" ?selected=${o.format === 'avif'}>AVIF</option>` : nothing}
          </select>
        </label>
        <label class="opt" title=${t.optCropHint}>
          <input
            type="checkbox"
            .checked=${o.crop}
            aria-describedby="ts-crop-hint"
            @change=${(e: Event) => setOption({ crop: (e.target as HTMLInputElement).checked })}
          />
          <span>${t.optCrop}</span>
          <span class="sr-only" id="ts-crop-hint">${t.optCropHint}</span>
        </label>
        <label class="opt">
          <span>${t.optFilename}</span>
          <select @change=${(e: Event) => setOption({ filename: (e.target as HTMLSelectElement).value as FilenameStyle })}>
            <option value="id" ?selected=${o.filename === 'id'}>${t.filenameId}</option>
            <option value="title" ?selected=${o.filename === 'title'}>${t.filenameTitle}</option>
          </select>
        </label>
      </div>
    </form>`;
  }

  #renderHistory(t: Messages): TemplateResult | typeof nothing {
    if (this.noHistory || !this._history.length) return nothing;
    return html`<div class="recent">
      <span class="recent-label">${icons.clock}${t.recent}</span>
      <ul class="chips">
        ${this._history.map(
          (item) => html`<li>
            <button type="button" class="chip" title=${item.title ?? item.id} @click=${() => this.load(`https://youtu.be/${item.id}`)}>
              <img src=${imageUrl(item.id, 'default')} alt="" width="120" height="90" loading="lazy" />
              <span>${item.title ?? item.id}</span>
            </button>
          </li>`,
        )}
      </ul>
      <button type="button" class="link-btn" @click=${this.#clearHistory}>${t.clearRecent}</button>
    </div>`;
  }

  #renderViewer(t: Messages): TemplateResult {
    const viewer = this._viewer;
    const state = viewer?.entry.slot(viewer.variant.key);
    const close = () => this.renderRoot.querySelector('dialog')?.close();
    return html`<dialog
      class="viewer"
      aria-label=${viewer ? variantLabel(viewer.variant, t) : t.openImage}
      @close=${() => (this._viewer = undefined)}
      @click=${(e: MouseEvent) => e.target === e.currentTarget && close()}
    >
      ${viewer && state?.status === 'ok'
        ? html`<figure>
            <img src=${state.src} alt=${variantLabel(viewer.variant, t)} width=${state.image.width} height=${state.image.height} />
            <figcaption>
              <span>
                <strong>${variantLabel(viewer.variant, t)}</strong>
                · ${state.image.width}×${state.image.height} · ${formatBytes(state.image.blob.size, this.#page.locale)}
              </span>
              <span class="viewer-actions">
                <button type="button" class="icon-btn" title=${t.download} aria-label=${t.download} @click=${() => void this.#download(viewer.entry, viewer.variant)}>
                  ${icons.download}
                </button>
                <button type="button" class="icon-btn" title=${t.copyImage} aria-label=${t.copyImage} @click=${() => this.#copyImage(viewer.entry, viewer.variant)}>
                  ${icons.copy}
                </button>
                <button type="button" class="icon-btn" title=${t.close} aria-label=${t.close} @click=${close}>${icons.close}</button>
              </span>
            </figcaption>
          </figure>
          ${this.#renderToast(t)}`
        : nothing}
    </dialog>`;
  }

  // Input handling

  #onSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    this.#submit(this._input);
  };

  #onInput = (e: Event) => {
    this._input = (e.target as HTMLTextAreaElement).value;
  };

  #onKeydown = (e: KeyboardEvent) => {
    // Enter submits (Shift+Enter adds a line). Ignore Enter that confirms an IME composition.
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing && e.keyCode !== 229) {
      e.preventDefault();
      this.#submit(this._input);
    }
  };

  /** A pasted link loads right away. */
  #onPaste = () => {
    setTimeout(() => {
      if (extractTargets(this._input).length) this.#submit(this._input);
    });
  };

  #onPasteButton = async () => {
    try {
      const text = (await navigator.clipboard.readText()).trim();
      if (text) this.load(text);
    } catch {
      this.#showToast('pasteBlocked');
      this.renderRoot.querySelector('textarea')?.focus();
    }
  };

  #onClear = () => {
    this.clear();
    this.renderRoot.querySelector('textarea')?.focus();
  };

  #onDragOver = (e: DragEvent) => {
    const types = Array.from(e.dataTransfer?.types ?? []);
    if (types.includes('text/uri-list') || types.includes('text/plain')) {
      e.preventDefault();
      e.dataTransfer!.dropEffect = 'copy';
    }
  };

  #onDrop = (e: DragEvent) => {
    const text = e.dataTransfer?.getData('text/uri-list') || e.dataTransfer?.getData('text/plain');
    if (!text?.trim()) return;
    e.preventDefault();
    this.load(text);
  };

  #autosize(area: HTMLTextAreaElement): void {
    area.style.height = 'auto';
    area.style.height = `${area.scrollHeight + 2}px`;
  }

  #submit(text: string): void {
    const t = this.messages;
    const targets = extractTargets(text);
    if (!targets.length) {
      this._notice = t.noTargets;
      return;
    }
    const max = Math.max(1, this.maxVideos || 20);
    this._notice = targets.length > max ? format(t.tooMany, { max }) : '';
    const reusable = new Map(this._entries.map((entry) => [entry.key, entry]));
    const chosen = targets.slice(0, max);
    const multi = chosen.length > 1;
    const next = chosen.map((target, i) => {
      const existing = reusable.get(targetKey(target));
      if (existing) {
        reusable.delete(existing.key);
        return existing;
      }
      const entry: VideoEntry = new VideoEntry(target, () => this.#entryChanged(entry));
      // In a batch only the first video opens fully; the rest load their thumbnails only.
      entry.expanded = !multi || i === 0;
      entry.open.original = entry.expanded;
      return entry;
    });
    for (const stale of reusable.values()) stale.dispose();
    this._entries = next;
    for (const entry of next) void entry.start();
    this.#writeUrl();
  }

  #entryChanged(entry: VideoEntry): void {
    this.requestUpdate();
    if (!this.#reported.has(entry) && entry.id && entry.phase === 'ready' && entry.meta.status !== 'loading') {
      this.#reported.add(entry);
      this.#remember(entry);
      this.#emit({ action: 'resolve', videoId: entry.id });
    }
  }

  #remove(entry: VideoEntry): void {
    entry.dispose();
    this._entries = this._entries.filter((e) => e !== entry);
    this.#writeUrl();
  }

  #toggle(entry: VideoEntry): void {
    entry.expanded = !entry.expanded;
    if (entry.expanded) entry.setOpen('original', true);
    this.requestUpdate();
  }

  // Page URL (?v=ID,ID&list=ID) so results can be shared and survive reloads.

  #readUrl(): string {
    const params = new URLSearchParams(location.search);
    const split = (name: string) => params.getAll(name).flatMap((v) => v.split(','));
    const videos = split('v').filter(isVideoId).map((id) => `https://youtu.be/${id}`);
    const lists = split('list').filter((id) => /^[\w-]{2,64}$/.test(id)).map(playlistUrl);
    return [...videos, ...lists].join('\n');
  }

  #writeUrl(): void {
    if (this.noUrlSync) return;
    const url = new URL(location.href);
    url.searchParams.delete('v');
    url.searchParams.delete('list');
    const videos = this._entries.flatMap((e) => (e.target.kind === 'video' ? [e.target.id] : []));
    const lists = this._entries.flatMap((e) => (e.target.kind === 'playlist' ? [e.target.listId] : []));
    if (videos.length) url.searchParams.set('v', videos.join(','));
    if (lists.length) url.searchParams.set('list', lists.join(','));
    const href = url.href.replace(/%2C/g, ',');
    if (href !== location.href) history.replaceState(history.state, '', href);
  }

  // History

  #remember(entry: VideoEntry): void {
    if (this.noHistory || !entry.id) return;
    const item: HistoryItem = { id: entry.id, title: entry.title, at: Date.now() };
    this._history = [item, ...this._history.filter((h) => h.id !== item.id)].slice(0, HISTORY_LIMIT);
    writeJson(HISTORY_KEY, this._history);
  }

  #clearHistory = () => {
    this._history = [];
    removeKey(HISTORY_KEY);
  };

  // Actions

  #base(entry: VideoEntry): string {
    return baseName(entry.id!, entry.title, this._options.filename);
  }

  #save(blob: Blob, name: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.hidden = true;
    this.renderRoot.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }

  async #download(entry: VideoEntry, variant: Variant): Promise<void> {
    const state = entry.slot(variant.key);
    if (state.status !== 'ok' || !entry.id) return;
    try {
      const out = await transformImage(state.image.blob, this._options);
      this.#save(out.blob, fileName(this.#base(entry), variant.key, out.ext));
      if (out.fallbackFrom) this.#showToast('formatFallback', { format: out.fallbackFrom.toUpperCase() });
      this.#emit({ action: 'download', videoId: entry.id, variant: variant.key, format: out.ext });
    } catch (error) {
      this.#fail('downloadFailed', error);
    }
  }

  #copyImage(entry: VideoEntry, variant: Variant): void {
    const state = entry.slot(variant.key);
    if (state.status !== 'ok') return;
    if (typeof ClipboardItem === 'undefined' || !navigator.clipboard?.write) {
      this.#showToast('copyFailed');
      return;
    }
    // The write must start inside the click handler, so pass the PNG as a promise (Safari requires it).
    const png = transformImage(state.image.blob, { format: 'png', crop: this._options.crop }).then((r) => r.blob);
    navigator.clipboard.write([new ClipboardItem({ 'image/png': png })]).then(
      () => {
        this.#showToast('copied');
        this.#emit({ action: 'copy-image', videoId: entry.id, variant: variant.key });
      },
      (error: unknown) => this.#fail('copyFailed', error),
    );
  }

  async #copyText(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      if (!legacyCopy(text)) {
        this.#showToast('copyFailed');
        return;
      }
    }
    this.#showToast('copied');
    this.#emit({ action: 'copy-text' });
  }

  async #share(entry: VideoEntry, variant: Variant): Promise<void> {
    const state = entry.slot(variant.key);
    if (state.status !== 'ok' || !entry.id) return;
    try {
      const out = await transformImage(state.image.blob, this._options);
      const file = new File([out.blob], fileName(this.#base(entry), variant.key, out.ext), { type: out.blob.type });
      await navigator.share({ files: [file], title: entry.title });
      this.#emit({ action: 'share', videoId: entry.id, variant: variant.key });
    } catch (error) {
      if ((error as DOMException)?.name !== 'AbortError') this.#fail('downloadFailed', error);
    }
  }

  async #zip(entries: VideoEntry[], key: string): Promise<void> {
    if (this._zipping.has(key)) return;
    this._zipping = new Set([...this._zipping, key]);
    try {
      const files: ZipFile[] = [];
      let fallback: OutputFormat | undefined;
      const ready = entries.filter((e) => e.id);
      for (const entry of ready) {
        const base = this.#base(entry);
        const folder = ready.length > 1 ? `${base}/` : '';
        for (const { variant, image } of await entry.collect()) {
          const out = await transformImage(image.blob, this._options);
          fallback ??= out.fallbackFrom;
          files.push({ name: folder + fileName(base, variant.key, out.ext), data: out.blob });
        }
      }
      if (!files.length) return;
      const name = ready.length === 1 ? `${this.#base(ready[0])}.zip` : `thumbsnap-${new Date().toISOString().slice(0, 10)}.zip`;
      this.#save(await createZip(files), name);
      if (fallback) this.#showToast('formatFallback', { format: fallback.toUpperCase() });
      this.#emit({
        action: 'download-zip',
        videoId: ready.length === 1 ? ready[0].id : undefined,
        count: files.length,
        format: this._options.format,
      });
    } catch (error) {
      this.#fail('downloadFailed', error);
    } finally {
      const next = new Set(this._zipping);
      next.delete(key);
      this._zipping = next;
    }
  }

  #showToast(key: MessageKey, params?: Record<string, string>): void {
    this._toast = { key, params };
    clearTimeout(this.#toastTimer);
    this.#toastTimer = setTimeout(() => (this._toast = undefined), 2600);
  }

  #fail(key: MessageKey, error: unknown): void {
    console.warn('[thumbsnap]', error);
    this.#showToast(key);
    this.#emit({ action: 'error' });
  }

  #emit(detail: ThumbSnapEventDetail): void {
    this.dispatchEvent(new CustomEvent<ThumbSnapEventDetail>('thumbsnap', { detail, bubbles: true, composed: true }));
  }
}

export function defineThumbSnap(tagName = 'thumb-snap', ctor: CustomElementConstructor = ThumbSnapElement): void {
  if (!customElements.get(tagName)) customElements.define(tagName, ctor);
}

declare global {
  interface HTMLElementTagNameMap {
    'thumb-snap': ThumbSnapElement;
  }
  interface HTMLElementEventMap {
    thumbsnap: CustomEvent<ThumbSnapEventDetail>;
  }
}
