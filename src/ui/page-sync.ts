import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { DEFAULT_LOCALE, resolveLocale, type Locale } from '../i18n';

interface Host extends ReactiveControllerHost, HTMLElement {
  locale?: string;
}

function browserLocale(): Locale | null {
  for (const tag of navigator.languages ?? [navigator.language]) {
    const locale = resolveLocale(tag);
    if (locale) return locale;
  }
  return null;
}

/**
 * Follows the language of the page the element sits in: `lang` on the element or an ancestor, then the browser's.
 * Light or dark is not read from the page: the styles follow the element's CSS `color-scheme` (see styles.ts).
 */
export class PageSync implements ReactiveController {
  locale: Locale = DEFAULT_LOCALE;

  readonly #host: Host;
  #observer?: MutationObserver;
  readonly #onChange = () => {
    if (this.refresh()) this.#host.requestUpdate();
  };

  constructor(host: Host) {
    this.#host = host;
    host.addController(this);
  }

  hostConnected(): void {
    this.#observer = new MutationObserver(this.#onChange);
    this.#observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    this.#observer.observe(this.#host, { attributes: true, attributeFilter: ['lang'] });
    this.refresh();
  }

  hostDisconnected(): void {
    this.#observer?.disconnect();
  }

  /** Recomputes the locale. Returns true when it changed. */
  refresh(): boolean {
    const locale =
      resolveLocale(this.#host.locale) ??
      resolveLocale(this.#host.closest('[lang]')?.getAttribute('lang')) ??
      browserLocale() ??
      DEFAULT_LOCALE;
    const changed = locale !== this.locale;
    this.locale = locale;
    return changed;
  }
}
