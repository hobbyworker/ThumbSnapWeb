import de from './locales/de';
import en from './locales/en';
import es from './locales/es';
import fr from './locales/fr';
import id from './locales/id';
import it from './locales/it';
import ja from './locales/ja';
import ko from './locales/ko';
import pl from './locales/pl';
import pt from './locales/pt';
import vi from './locales/vi';
import zhHans from './locales/zh-hans';
import zhHant from './locales/zh-hant';
import type { Messages } from './types';

export type { MessageKey, Messages } from './types';

/** Same codes (and order) as the language folders of hobbyworker.me. */
export const LOCALES = ['en', 'ko', 'ja', 'zh-hans', 'zh-hant', 'id', 'es', 'fr', 'pt', 'vi', 'de', 'it', 'pl'] as const;
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
  fr,
  pt,
  vi,
  de,
  it,
  pl,
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
  fr: 'fr',
  pt: 'pt',
  vi: 'vi',
  de: 'de',
  it: 'it',
  pl: 'pl',
};

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
