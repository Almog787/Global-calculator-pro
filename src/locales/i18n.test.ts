import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';

const SUPPORTED_LANGUAGES = ['en', 'he', 'es', 'fr', 'ar'] as const;
type Lang = (typeof SUPPORTED_LANGUAGES)[number];

function getKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
      keys.push(...getKeys(v as Record<string, unknown>, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function findEmptyValues(obj: Record<string, unknown>, prefix = ''): string[] {
  const empty: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'string') {
      if (v.trim() === '') {
        empty.push(fullKey);
      }
    } else if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
      empty.push(...findEmptyValues(v as Record<string, unknown>, fullKey));
    }
  }
  return empty;
}

describe('i18n & Locales Integrity Suite', () => {
  const localesDir = path.resolve(__dirname);
  const localeData: Record<Lang, Record<string, unknown>> = {} as Record<Lang, Record<string, unknown>>;

  beforeAll(() => {
    for (const lang of SUPPORTED_LANGUAGES) {
      const filePath = path.join(localesDir, `${lang}.json`);
      expect(fs.existsSync(filePath), `Locale file missing for ${lang}`).toBe(true);
      const content = fs.readFileSync(filePath, 'utf8');
      localeData[lang] = JSON.parse(content);
    }
  });

  it('should have valid JSON files for all supported languages', () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      expect(typeof localeData[lang]).toBe('object');
      expect(Object.keys(localeData[lang]).length).toBeGreaterThan(0);
    }
  });

  it('should have exact key parity with the English baseline', () => {
    const enKeys = new Set(getKeys(localeData['en']));
    expect(enKeys.size).toBeGreaterThan(100);

    for (const lang of SUPPORTED_LANGUAGES) {
      if (lang === 'en') continue;
      const langKeys = new Set(getKeys(localeData[lang]));
      const missingKeys = [...enKeys].filter((k) => !langKeys.has(k));
      const extraKeys = [...langKeys].filter((k) => !enKeys.has(k));

      expect(missingKeys, `Missing keys in ${lang}`).toEqual([]);
      expect(extraKeys, `Unexpected extra keys in ${lang}`).toEqual([]);
    }
  });

  it('should not contain any empty or whitespace-only translation strings', () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      const emptyValues = findEmptyValues(localeData[lang]);
      expect(emptyValues, `Found empty strings in ${lang}`).toEqual([]);
    }
  });

  it('should define correct text direction (dir) for each language', () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      const ui = localeData[lang].ui as { dir?: string } | undefined;
      expect(ui?.dir, `ui.dir is missing in ${lang}`).toBeDefined();

      if (lang === 'he' || lang === 'ar') {
        expect(ui?.dir, `${lang} should be RTL`).toBe('rtl');
      } else {
        expect(ui?.dir, `${lang} should be LTR`).toBe('ltr');
      }
    }
  });
});
