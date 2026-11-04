import de from './locales/de';
import en from './locales/en';
import es from './locales/es';
import es419 from './locales/es-419';
import fr from './locales/fr';
import id from './locales/id';
import it from './locales/it';
import ja from './locales/ja';
import ko from './locales/ko';
import pl from './locales/pl';
import pt from './locales/pt';
import ptBr from './locales/pt-br';
import ru from './locales/ru';
import th from './locales/th';
import vi from './locales/vi';
import zhHans from './locales/zh-hans';
import zhHant from './locales/zh-hant';
import type { Messages } from './types';

export type { MessageKey, Messages } from './types';

/** Same codes as the language folders of hobbyworker.me. The order doesn't matter. */
export const LOCALES = ['en', 'ko', 'ja', 'zh-hans', 'zh-hant', 'id', 'es', 'es-419', 'fr', 'pt', 'pt-br', 'vi', 'de', 'it', 'pl', 'ru', 'th'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

const CATALOG: Record<Locale, Messages> = {
  en,
  ko,
  ja,
  'zh-hans': zhHans,
  'zh-hant': zhHant,
  id,
  es,
  'es-419': es419,
  fr,
  pt,
  'pt-br': ptBr,
  vi,
  de,
  it,
  pl,
  ru,
  th,
};

/** BCP 47 tags for Intl APIs. */
const INTL_TAGS: Record<Locale, string> = {
  en: 'en',
  ko: 'ko',
  ja: 'ja',
  'zh-hans': 'zh-Hans',
  'zh-hant': 'zh-Hant',
  id: 'id',
  es: 'es',
  'es-419': 'es-419',
  fr: 'fr',
  pt: 'pt-PT',
  'pt-br': 'pt-BR',
  vi: 'vi',
  de: 'de',
  it: 'it',
  pl: 'pl',
  ru: 'ru',
  th: 'th',
};

/** Regions whose Spanish is es-419 (its parent locale in CLDR), and 419 itself. */
const LATIN_AMERICA = new Set(['419', 'ar', 'bo', 'br', 'bz', 'cl', 'co', 'cr', 'cu', 'do', 'ec', 'gt', 'hn', 'mx', 'ni', 'pa', 'pe', 'pr', 'py', 'sv', 'us', 'uy', 've']);

function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Maps any language tag (`ko-KR`, `zh-TW`, `pt_BR`, …) to a supported locale, or null. */
export function resolveLocale(tag: string | null | undefined): Locale | null {
  if (!tag) return null;
  const value = tag.trim().toLowerCase().replace(/_/g, '-');
  if (isLocale(value)) return value;
  if (value === 'zh' || value.startsWith('zh-')) {
    return /-(?:hant|tw|hk|mo)(?:-|$)/.test(value) ? 'zh-hant' : 'zh-hans';
  }
  const base = value.split('-')[0];
  // Brazil has its own catalog; plain `pt` and every other region get Portugal's.
  if (base === 'pt') return /-br(?:-|$)/.test(value) ? 'pt-br' : 'pt';
  // Latin America and the US get es-419; plain `es`, Spain and every other region get es.
  if (base === 'es') {
    const region = value.split('-').slice(1).find((part) => /^(?:[a-z]{2}|\d{3})$/.test(part));
    return region && LATIN_AMERICA.has(region) ? 'es-419' : 'es';
  }
  if (base === 'in') return 'id'; // legacy code for Indonesian
  return isLocale(base) ? base : null;
}

export function getMessages(locale: Locale): Messages {
  return CATALOG[locale];
}

export function intlTag(locale: Locale): string {
  return INTL_TAGS[locale];
}

/** Replaces `{name}` placeholders. */
export function format(message: string, params: Record<string, string | number>): string {
  return message.replace(/\{(\w+)\}/g, (match, name: string) => (name in params ? String(params[name]) : match));
}

export function formatBytes(bytes: number, locale: Locale): string {
  const mega = bytes >= 1_000_000;
  return new Intl.NumberFormat(intlTag(locale), {
    style: 'unit',
    unit: mega ? 'megabyte' : 'kilobyte',
    unitDisplay: 'short',
    maximumFractionDigits: mega ? 1 : 0,
  }).format(mega ? bytes / 1_000_000 : Math.max(1, bytes / 1000));
}
