import { html, nothing, type TemplateResult } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { watchUrl } from '../core/parse';
import { htmlSnippet, markdownSnippet } from '../core/snippets';
import {
  FRAME_NUMBERS,
  ORIGINALS,
  SIZES,
  THUMBNAILS,
  frameVariant,
  imageUrl,
  type FrameNumber,
  type Variant,
} from '../core/variants';
import { format, formatBytes, type Locale, type Messages } from '../i18n';
import { icons } from './icons';
import type { Section, VideoEntry } from './video-entry';

/** What the entry templates need from the element. */
export interface RenderContext {
  readonly t: Messages;
  readonly locale: Locale;
  readonly multi: boolean;
  readonly canShare: boolean;
  isZipping(key: string): boolean;
  download(entry: VideoEntry, variant: Variant): void;
  copyImage(entry: VideoEntry, variant: Variant): void;
  share(entry: VideoEntry, variant: Variant): void;
  copyText(text: string): void;
  view(entry: VideoEntry, variant: Variant): void;
  zip(entries: VideoEntry[], key: string): void;
  remove(entry: VideoEntry): void;
  toggle(entry: VideoEntry): void;
}

export function variantLabel(variant: Variant, t: Messages): string {
  if (variant.group !== 'thumbnail') {
    return variant.frame === 0 ? t.firstFrame : format(t.frameN, { n: variant.frame ?? 1 });
  }
  if (variant.key === 'hq720') return t.size720;
  switch (variant.size) {
    case 'maxres':
      return t.sizeMaxres;
    case 'sd':
      return t.sizeSd;
    case 'hq':
      return t.sizeHq;
    case 'mq':
      return t.sizeMq;
    default:
      return t.sizeDefault;
  }
}

function iconButton(icon: TemplateResult, label: string, onClick: () => void): TemplateResult {
  return html`<button type="button" class="icon-btn" title=${label} aria-label=${label} @click=${onClick}>
    ${icon}
  </button>`;
}

function iconLink(icon: TemplateResult, label: string, href: string): TemplateResult {
  return html`<a class="icon-btn" href=${href} target="_blank" rel="noopener noreferrer" title=${label} aria-label=${label}>
    ${icon}
  </a>`;
}

const spinner = (label: string) => html`<span class="spinner" role="img" aria-label=${label}></span>`;

function cardActions(entry: VideoEntry, variant: Variant, c: RenderContext): TemplateResult {
  const { t } = c;
  const url = imageUrl(entry.id!, variant.key);
  return html`<div class="c-actions">
    ${iconButton(icons.download, t.download, () => c.download(entry, variant))}
    ${iconButton(icons.copy, t.copyImage, () => c.copyImage(entry, variant))}
    ${iconButton(icons.link, t.copyImageUrl, () => c.copyText(url))}
    ${c.canShare ? iconButton(icons.share, t.share, () => c.share(entry, variant)) : nothing}
    ${iconLink(icons.external, t.openImage, url)}
  </div>`;
}

function card(
  entry: VideoEntry,
  variant: Variant,
  c: RenderContext,
  options: { best?: boolean; extra?: TemplateResult } = {},
): TemplateResult {
  const { t } = c;
  const state = entry.slot(variant.key);
  const label = variantLabel(variant, t);
  const ok = state.status === 'ok';
  const width = ok ? state.image.width : variant.width;
  const height = ok ? state.image.height : variant.height;
  let preview: TemplateResult;
  if (state.status === 'ok') {
    preview = html`<button type="button" class="preview-btn" aria-label=${`${t.openImage}: ${label}`} @click=${() => c.view(entry, variant)}>
      <img src=${state.src} alt="" width=${state.image.width} height=${state.image.height} decoding="async" />
    </button>`;
  } else if (state.status === 'missing') {
    preview = html`<span class="na">${t.unavailable}</span>`;
  } else if (state.status === 'error') {
    preview = html`<button type="button" class="btn sm" @click=${() => entry.retry()}>${icons.retry}<span>${t.retry}</span></button>`;
  } else {
    preview = spinner(t.loading);
  }
  return html`<figure class="card" data-status=${state.status}>
    <div class="preview">${preview}${options.best && ok ? html`<span class="tag">${t.best}</span>` : nothing}</div>
    <figcaption>
      <span class="c-label">${label}</span>
      <span class="c-meta">
        ${width && height ? `${width}×${height}` : ''}${ok ? ` · ${formatBytes(state.image.blob.size, c.locale)}` : ''}
      </span>
    </figcaption>
    ${options.extra ?? nothing} ${ok ? cardActions(entry, variant, c) : nothing}
  </figure>`;
}

/** An auto frame with a size picker; shows the largest size that exists until the user picks one. */
function frameCard(entry: VideoEntry, frame: FrameNumber, c: RenderContext): TemplateResult {
  const chosen = entry.frameSize.get(frame);
  const pending = SIZES.find((s) => entry.slot(frameVariant(frame, s.key).key).status !== 'missing');
  const variant = frameVariant(frame, chosen ?? pending?.key ?? 'default');
  const chips = html`<div class="size-chips" role="group" aria-label=${c.t.imageSize}>
    ${SIZES.map((s) => {
      const status = entry.slot(frameVariant(frame, s.key).key).status;
      return html`<button
        type="button"
        class="size-chip"
        aria-pressed=${String(s.key === chosen)}
        ?disabled=${status === 'missing'}
        @click=${() => entry.selectFrameSize(frame, s.key)}
      >
        ${s.width}
      </button>`;
    })}
  </div>`;
  return card(entry, variant, c, { extra: chips });
}

/**
 * Original-ratio frames. Recent regular videos have no `oar1`–`oar3`, so once all three have
 * answered missing, their cards give way to one line (the first frame still shows when it exists).
 */
function originals(entry: VideoEntry, c: RenderContext): TemplateResult {
  const statuses = ORIGINALS.filter((v) => v.frame !== 0).map((v) => entry.slot(v.key).status);
  const settled = statuses.every((s) => s !== 'idle' && s !== 'loading');
  const noFrames = settled && statuses.every((s) => s === 'missing');
  const shown = settled ? ORIGINALS.filter((v) => entry.slot(v.key).status !== 'missing') : ORIGINALS;
  return html`${noFrames ? html`<p class="msg">${c.t.originalMissing}</p>` : nothing}
  ${shown.length ? grid(shown.map((v) => card(entry, v, c))) : nothing}`;
}

function webpCard(entry: VideoEntry, variant: Variant, c: RenderContext): TemplateResult {
  const { t } = c;
  const state = entry.webp(variant.key);
  const url = imageUrl(entry.id!, variant.key, 'webp');
  const ok = state?.status === 'ok';
  let preview: TemplateResult;
  if (state?.status === 'ok') {
    preview = html`<a class="preview-btn" href=${url} target="_blank" rel="noopener noreferrer" aria-label=${t.openImage}>
      <img src=${url} alt="" width=${state.width} height=${state.height} decoding="async" />
    </a>`;
  } else if (state?.status === 'missing') {
    preview = html`<span class="na">${t.unavailable}</span>`;
  } else {
    preview = spinner(t.loading);
  }
  return html`<figure class="card" data-status=${state?.status ?? 'loading'}>
    <div class="preview">${preview}</div>
    <figcaption>
      <span class="c-label">${variantLabel(variant, t)}</span>
      <span class="c-meta">${ok ? `${state.width}×${state.height}` : `${variant.width}×${variant.height}`} · WebP</span>
    </figcaption>
    ${ok
      ? html`<div class="c-actions">
          ${iconButton(icons.link, t.copyImageUrl, () => c.copyText(url))} ${iconLink(icons.external, t.openImage, url)}
        </div>`
      : nothing}
  </figure>`;
}

function embedCode(entry: VideoEntry, c: RenderContext): TemplateResult {
  const { t } = c;
  const best = entry.best();
  const input = {
    id: entry.id!,
    title: entry.title,
    imageUrl: best?.image.url ?? imageUrl(entry.id!, 'hqdefault'),
    width: best?.image.width,
    height: best?.image.height,
  };
  const snippets: [string, string][] = [
    ['Markdown', markdownSnippet(input)],
    ['HTML', htmlSnippet(input)],
    [t.embedUrl, input.imageUrl],
  ];
  return html`<div class="snippets">
    ${snippets.map(
      ([label, code]) => html`<div class="snippet">
        <div class="snippet-head">
          <span>${label}</span>
          <button type="button" class="btn sm" @click=${() => c.copyText(code)}>${icons.copy}<span>${t.copy}</span></button>
        </div>
        <pre><code>${code}</code></pre>
      </div>`,
    )}
  </div>`;
}

function collapsible(
  entry: VideoEntry,
  section: Section,
  title: string,
  hint: string,
  content: () => TemplateResult,
): TemplateResult {
  const open = entry.open[section];
  return html`<details
    class="sec"
    ?open=${open}
    @toggle=${(e: Event) => entry.setOpen(section, (e.currentTarget as HTMLDetailsElement).open)}
  >
    <summary>${icons.chevron}<span>${title}</span></summary>
    <p class="sec-hint">${hint}</p>
    ${open ? content() : nothing}
  </details>`;
}

const grid = (items: TemplateResult[]) => html`<div class="grid">${items}</div>`;

/** Why an entry has nothing to show, with a retry for network failures. */
function failure(entry: VideoEntry, c: RenderContext): TemplateResult | typeof nothing {
  const { t } = c;
  const retry = html`<button type="button" class="link-btn" @click=${() => entry.retry()}>${t.retry}</button>`;
  switch (entry.phase) {
    case 'playlist-failed':
      return entry.meta.status === 'error'
        ? html`<p class="msg warn">${t.networkError} ${retry}</p>`
        : html`<p class="msg warn">${t.playlistUnavailable}</p>`;
    case 'notfound':
      return html`<p class="msg warn">${t.notFound}</p>`;
    case 'error':
      return html`<p class="msg warn">${t.networkError} ${retry}</p>`;
    default:
      return nothing;
  }
}

function header(entry: VideoEntry, c: RenderContext): TemplateResult {
  const { t } = c;
  const best = entry.best();
  const cover = best ?? entry.preview();
  const info = entry.meta.status === 'ok' ? entry.meta.info : undefined;
  const id = entry.id;
  const zipping = c.isZipping(entry.key);
  const problem = failure(entry, c);
  const badges: TemplateResult[] = [];
  if (entry.vertical) badges.push(html`<span class="badge">${t.badgeShorts}</span>`);
  if (entry.source?.kind === 'custom') badges.push(html`<span class="badge accent">${t.badgeCustom}</span>`);
  if (entry.source?.kind === 'auto') badges.push(html`<span class="badge">${format(t.badgeAuto, { n: entry.source.frame })}</span>`);

  return html`<header class="v-head">
    <div class="v-cover">
      ${cover
        ? html`<img src=${cover.src} alt="" width=${cover.image.width} height=${cover.image.height} />`
        : entry.phase === 'resolving' || entry.phase === 'loading'
          ? spinner(t.loading)
          : nothing}
    </div>
    <div class="v-info">
      ${entry.playlistTitle ? html`<p class="v-kicker">${format(t.playlistCover, { title: entry.playlistTitle })}</p>` : nothing}
      <h3 class="v-title">
        ${info?.title && id
          ? html`<a href=${watchUrl(id)} target="_blank" rel="noopener noreferrer">${info.title}</a>`
          : html`<code>${id ?? (entry.target.kind === 'playlist' ? entry.target.listId : '')}</code>`}
      </h3>
      ${info?.title
        ? html`<p class="v-sub">
            ${info.author
              ? html`${info.authorUrl
                    ? html`<a href=${info.authorUrl} target="_blank" rel="noopener noreferrer">${info.author}</a>`
                    : info.author}<span aria-hidden="true">·</span>`
              : nothing}
            <code>${id}</code>
          </p>`
        : nothing}
      ${problem}
      ${badges.length ? html`<p class="badges">${badges}</p>` : nothing}
      ${entry.palette?.length
        ? html`<div class="palette" role="group" aria-label=${t.colors}>
            ${entry.palette.map((color) => {
              const label = format(t.copyColor, { color });
              return html`<button
                type="button"
                class="swatch"
                style=${styleMap({ '--swatch': color })}
                title=${label}
                aria-label=${label}
                @click=${() => c.copyText(color)}
              ></button>`;
            })}
          </div>`
        : nothing}
    </div>
    <div class="v-actions">
      ${problem === nothing
        ? html`<button type="button" class="btn primary" ?disabled=${!best} @click=${() => best && c.download(entry, best.variant)}>
              ${icons.download}<span>${t.downloadBest}</span>
            </button>
            <button type="button" class="btn" ?disabled=${!best || zipping} @click=${() => c.zip([entry], entry.key)}>
              ${icons.archive}<span>${zipping ? t.zipping : t.downloadZip}</span>
            </button>`
        : nothing}
      ${id ? iconButton(icons.link, t.copyVideoLink, () => c.copyText(watchUrl(id))) : nothing}
      ${id ? iconLink(icons.play, t.openVideo, watchUrl(id)) : nothing}
      <span class="spacer"></span>
      ${c.multi && problem === nothing
        ? html`<button type="button" class="link-btn" aria-expanded=${String(entry.expanded)} @click=${() => c.toggle(entry)}>
            ${entry.expanded ? t.hideImages : t.showImages}
          </button>`
        : nothing}
    </div>
    ${c.multi
      ? html`<button type="button" class="icon-btn v-remove" title=${t.remove} aria-label=${t.remove} @click=${() => c.remove(entry)}>
          ${icons.close}
        </button>`
      : nothing}
  </header>`;
}

function body(entry: VideoEntry, c: RenderContext): TemplateResult | typeof nothing {
  const { t } = c;
  if (entry.phase !== 'ready' && entry.phase !== 'loading') return nothing;
  const best = entry.best();
  return html`
    ${entry.meta.status === 'unavailable' ? html`<p class="msg">${t.metaUnavailable}</p>` : nothing}
    <section class="sec" aria-label=${t.sectionThumbnails}>
      <h4 class="sec-title">${t.sectionThumbnails}</h4>
      <p class="sec-hint">${t.sectionThumbnailsHint}</p>
      ${grid(entry.thumbnails.map((v) => card(entry, v, c, { best: v.key === best?.variant.key })))}
    </section>
    ${collapsible(entry, 'original', t.sectionOriginal, t.sectionOriginalHint, () => originals(entry, c))}
    ${collapsible(entry, 'frames', t.sectionFrames, t.sectionFramesHint, () =>
      grid(FRAME_NUMBERS.map((n) => frameCard(entry, n, c))),
    )}
    ${collapsible(entry, 'webp', t.sectionWebp, t.sectionWebpHint, () => grid(THUMBNAILS.map((v) => webpCard(entry, v, c))))}
    ${collapsible(entry, 'embed', t.sectionEmbed, t.sectionEmbedHint, () => embedCode(entry, c))}
  `;
}

export function renderEntry(entry: VideoEntry, c: RenderContext): TemplateResult {
  const content = entry.expanded ? body(entry, c) : nothing;
  return html`<article class="panel video ${c.multi ? 'multi' : ''}" data-phase=${entry.phase}>
    ${header(entry, c)} ${content === nothing ? nothing : html`<div class="v-body">${content}</div>`}
  </article>`;
}
