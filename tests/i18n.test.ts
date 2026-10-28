import { describe, expect, it } from 'vitest';
import { LOCALES, format, getMessages, resolveLocale } from '../src/i18n';

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
    expect(LOCALES).toEqual(['en', 'ko', 'ja', 'zh-hans', 'zh-hant', 'id', 'es', 'fr', 'pt', 'vi', 'de', 'it', 'pl']);
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
    ['pt-BR', 'pt'],
    ['in', 'id'],
    ['de-AT', 'de'],
  ])('%s → %s', (tag, locale) => {
    expect(resolveLocale(tag)).toBe(locale);
  });

  it.each([[null], [undefined], [''], ['xx'], ['ru']])('%j → null', (tag) => {
    expect(resolveLocale(tag)).toBeNull();
  });
});

describe('format', () => {
  it('fills placeholders and keeps unknown ones', () => {
    expect(format('{a} and {b}', { a: 1 })).toBe('1 and {b}');
  });
});
