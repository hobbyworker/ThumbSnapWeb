import { describe, expect, it } from 'vitest';
import { LOCALES, format, formatBytes, getMessages, intlTag, localeDir, resolveLocale } from '../src/i18n';

const PLACEHOLDER = /\{(\w+)\}/g;
const placeholders = (s: string) => [...s.matchAll(PLACEHOLDER)].map((m) => m[1]).sort();

describe('catalogs', () => {
  const en = getMessages('en');

  it.each(LOCALES)('%s has every key, no empty strings and the same placeholders as English', (locale) => {
    const messages = getMessages(locale);
    expect(Object.keys(messages).sort()).toEqual(Object.keys(en).sort());
    for (const [key, value] of Object.entries(messages)) {
      expect(value.trim(), `${locale}.${key}`).not.toBe('');
      expect(placeholders(value), `${locale}.${key}`).toEqual(placeholders(en[key as keyof typeof en]));
    }
  });

  it('matches the languages of hobbyworker.me', () => {
    expect([...LOCALES].sort()).toEqual(
      ['ar', 'de', 'en', 'es', 'es-419', 'fr', 'id', 'it', 'ja', 'ko', 'pl', 'pt', 'pt-br', 'ru', 'th', 'vi', 'zh-hans', 'zh-hant'],
    );
  });

  it('keeps Spain and Latin America apart', () => {
    expect(getMessages('es').frameN).toBe('Fotograma {n}');
    expect(getMessages('es-419').frameN).toBe('Cuadro {n}');
  });

  it('keeps Portugal and Brazil apart', () => {
    expect(getMessages('pt').optFilename).toBe('Nome do ficheiro');
    expect(getMessages('pt-br').optFilename).toBe('Nome do arquivo');
  });
});

describe('resolveLocale', () => {
  it.each([
    ['ko', 'ko'],
    ['ko-KR', 'ko'],
    ['EN_us', 'en'],
    ['zh', 'zh-hans'],
    ['zh-CN', 'zh-hans'],
    ['zh-Hans-SG', 'zh-hans'],
    ['zh-TW', 'zh-hant'],
    ['zh-HK', 'zh-hant'],
    ['zh-Hant', 'zh-hant'],
    ['zh-hant', 'zh-hant'],
    ['pt', 'pt'],
    ['pt-PT', 'pt'],
    ['pt-AO', 'pt'],
    ['pt-BR', 'pt-br'],
    ['pt_BR', 'pt-br'],
    ['pt-br', 'pt-br'],
    ['in', 'id'],
    ['de-AT', 'de'],
    ['es', 'es'],
    ['es-ES', 'es'],
    ['es-GQ', 'es'],
    ['es-419', 'es-419'],
    ['es-MX', 'es-419'],
    ['es-AR', 'es-419'],
    ['es-CO', 'es-419'],
    ['es-CL', 'es-419'],
    ['es-PE', 'es-419'],
    ['es-US', 'es-419'],
    ['es_MX', 'es-419'],
    ['es-Latn-MX', 'es-419'],
    ['ar', 'ar'],
    ['ar-EG', 'ar'],
    ['ar-SA', 'ar'],
    ['ar_AE', 'ar'],
    ['ru-RU', 'ru'],
    ['th-TH', 'th'],
  ])('%s → %s', (tag, locale) => {
    expect(resolveLocale(tag)).toBe(locale);
  });

  it.each([[null], [undefined], [''], ['xx'], ['he']])('%j → null', (tag) => {
    expect(resolveLocale(tag)).toBeNull();
  });
});

describe('intlTag', () => {
  it.each(LOCALES)('%s has a canonical BCP 47 tag', (locale) => {
    expect(Intl.getCanonicalLocales(intlTag(locale))).toEqual([intlTag(locale)]);
  });

  it.each([
    ['pt', 'pt-PT'],
    ['pt-br', 'pt-BR'],
    ['zh-hant', 'zh-Hant'],
  ] as const)('%s → %s', (locale, tag) => {
    expect(intlTag(locale)).toBe(tag);
  });
});

describe('localeDir', () => {
  it('lays Arabic out right to left and the rest left to right', () => {
    expect(localeDir('ar')).toBe('rtl');
    expect(LOCALES.filter((l) => l !== 'ar').every((l) => localeDir(l) === 'ltr')).toBe(true);
  });
});

describe('formatBytes', () => {
  it('writes 0–9 in every locale, Arabic included', () => {
    for (const locale of LOCALES) expect(formatBytes(1_400_000, locale), locale).toMatch(/^1[.,]4\D/);
    expect(formatBytes(65_000, 'ar')).not.toMatch(/[\u0660-\u0669\u06f0-\u06f9]/);
  });
});

describe('format', () => {
  it('fills placeholders and keeps unknown ones', () => {
    expect(format('{a} and {b}', { a: 1 })).toBe('1 and {b}');
  });
});
