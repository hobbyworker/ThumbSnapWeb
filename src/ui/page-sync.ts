import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { DEFAULT_LOCALE, resolveLocale, type Locale } from '../i18n';

export type ThemeSetting = 'auto' | 'light' | 'dark';
export type ColorScheme = 'light' | 'dark';

interface Host extends ReactiveControllerHost, HTMLElement {
  locale?: string;
  theme?: ThemeSetting;
}

function browserLocale(): Locale | null {
  for (const tag of navigator.languages ?? [navigator.language]) {
    const locale = resolveLocale(tag);
    if (locale) return locale;
  }
  return null;
}

/**
 * Follows the page the element sits in: its language (`lang` on the element or an ancestor) and its
 * color scheme. Sites mark dark mode in different ways, so several are checked before the OS setting:
 * `data-theme` (Hugo FixIt and many others), `.dark` (Tailwind), and an inline `color-scheme`.
 */
export class PageSync implements ReactiveController {
  locale: Locale = DEFAULT_LOCALE;
  scheme: ColorScheme = 'light';

  readonly #host: Host;
  #observer?: MutationObserver;
  #media?: MediaQueryList;
  readonly #onChange = () => {
    if (this.refresh()) this.#host.requestUpdate();
  };

  constructor(host: Host) {
    this.#host = host;
    host.addController(this);
  }

  hostConnected(): void {
    this.#media = window.matchMedia('(prefers-color-scheme: dark)');
    this.#media.addEventListener('change', this.#onChange);
    this.#observer = new MutationObserver(this.#onChange);
    this.#observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang', 'data-theme', 'data-color-scheme', 'data-bs-theme', 'class', 'style'],
    });
    this.#observer.observe(this.#host, { attributes: true, attributeFilter: ['lang'] });
    this.refresh();
  }

  hostDisconnected(): void {
    this.#observer?.disconnect();
    this.#media?.removeEventListener('change', this.#onChange);
  }

  /** Recomputes locale and scheme. Returns true when either changed. */
  refresh(): boolean {
    const locale =
      resolveLocale(this.#host.locale) ??
      resolveLocale(this.#host.closest('[lang]')?.getAttribute('lang')) ??
      browserLocale() ??
      DEFAULT_LOCALE;
    const scheme = this.#resolveScheme();
    const changed = locale !== this.locale || scheme !== this.scheme;
    this.locale = locale;
    this.scheme = scheme;
    return changed;
  }

  #resolveScheme(): ColorScheme {
    const setting = this.#host.theme;
    if (setting === 'light' || setting === 'dark') return setting;
    const root = document.documentElement;
    for (const name of ['data-theme', 'data-color-scheme', 'data-bs-theme']) {
      const value = root.getAttribute(name);
      if (value === 'dark' || value === 'light') return value;
    }
    if (root.classList.contains('dark')) return 'dark';
    if (root.classList.contains('light')) return 'light';
    // FixIt sets only `color-scheme` (no data-theme) when the stored choice is light.
    const inline = root.style.colorScheme;
    if (inline === 'dark' || inline === 'light') return inline;
    return this.#media?.matches ? 'dark' : 'light';
  }
}
