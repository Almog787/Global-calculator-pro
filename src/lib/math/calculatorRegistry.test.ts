import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  calculators,
  dynamicTranslations,
  searchCalculators,
  getCalculatorsByCategory,
  getCalculatorTitle,
  getCalculatorDescription
} from '../../data/calculators';
import { AVAILABLE_WIDGETS } from '../widgets/widgetsConfig';
import * as allMath from './allCalculators';

describe('Phase 3: Automated Calculator Registry & Universal Test Auto-Discovery Suite', () => {
  const rootDir = process.cwd();
  const calculatorsDir = path.join(rootDir, 'src/pages/calculators');
  const supportedLanguages = ['en', 'he', 'es', 'fr', 'ar'] as const;

  // 1. Auto-Discovery of Calculator Files vs Registry
  describe('Calculator File Auto-Discovery & Registry Integrity', () => {
    const calcFiles = fs.readdirSync(calculatorsDir).filter((file) => file.endsWith('.tsx'));

    it('should find at least 30 calculator components in src/pages/calculators', () => {
      expect(calcFiles.length).toBeGreaterThanOrEqual(30);
    });

    it('should ensure EVERY .tsx calculator file has a corresponding registered entry in calculators.ts', () => {
      const registeredSlugs = new Set(
        calculators.map((c) => {
          const parts = c.path.split('/');
          const slug = parts[parts.length - 1];
          return slug.replace(/-/g, '').toLowerCase();
        })
      );

      const missingFiles: string[] = [];

      for (const file of calcFiles) {
        const cleanFileName = file.replace('.tsx', '').toLowerCase();
        if (!registeredSlugs.has(cleanFileName)) {
          missingFiles.push(file);
        }
      }

      expect(
        missingFiles,
        `The following calculator components exist in /src/pages/calculators/ but are missing from calculators.ts registry: ${missingFiles.join(
          ', '
        )}`
      ).toEqual([]);
    });

    it('should ensure every registered calculator path begins with / or /calculators/', () => {
      for (const calc of calculators) {
        expect(calc.path.startsWith('/')).toBe(true);
        expect(calc.id).toBeTruthy();
        expect(calc.fallbackTitle).toBeTruthy();
        expect(calc.description).toBeTruthy();
        expect(calc.tags.length).toBeGreaterThan(0);
      }
    });
  });

  // 2. Multilingual Translations Verification for All Calculators
  describe('Universal Multilingual Translation Coverage (en, he, es, fr, ar)', () => {
    it('should ensure every dynamic calculator has non-empty title and description across ALL 5 languages', () => {
      const dynamicCalcs = calculators.filter((c) => c.path.startsWith('/calculators/'));

      for (const calc of dynamicCalcs) {
        const translations = dynamicTranslations[calc.id];
        expect(
          translations,
          `Calculator "${calc.id}" (${calc.path}) is missing entry in dynamicTranslations object`
        ).toBeDefined();

        if (translations) {
          for (const lang of supportedLanguages) {
            const langTrans = translations[lang];
            expect(
              langTrans,
              `Calculator "${calc.id}" is missing translation for language "${lang}"`
            ).toBeDefined();
            expect(langTrans?.title?.length).toBeGreaterThan(0);
            expect(langTrans?.description?.length).toBeGreaterThan(0);
          }
        }
      }
    });

    it('should fall back safely when querying titles or descriptions with mock i18n object', () => {
      const mockT = {};
      for (const calc of calculators) {
        const enTitle = getCalculatorTitle(calc, mockT, 'en');
        const heTitle = getCalculatorTitle(calc, mockT, 'he');
        const enDesc = getCalculatorDescription(calc, mockT, 'en');

        expect(enTitle).toBeTruthy();
        expect(heTitle).toBeTruthy();
        expect(enDesc).toBeTruthy();
      }
    });
  });

  // 3. Category & Search Auto-Discovery Verification
  describe('Search & Categorization System Verification', () => {
    const validCategories = ['finance', 'health', 'math', 'lifestyle', 'tech', 'real-estate'];

    it('should assign every calculator to a valid category', () => {
      for (const calc of calculators) {
        expect(validCategories).toContain(calc.category);
      }
    });

    it('should return matching calculators when searching by keywords or tags', () => {
      const mortgageResults = searchCalculators('mortgage');
      expect(mortgageResults.length).toBeGreaterThan(0);

      const taxResults = searchCalculators('tax');
      expect(taxResults.length).toBeGreaterThan(0);

      const healthResults = searchCalculators('health');
      expect(healthResults.length).toBeGreaterThan(0);
    });

    it('should return valid list for getCalculatorsByCategory', () => {
      for (const cat of validCategories) {
        const catCalcs = getCalculatorsByCategory(cat);
        expect(Array.isArray(catCalcs)).toBe(true);
      }
    });
  });

  // 4. Embeddable Widgets Registry Consistency
  describe('Embeddable Widgets Hub Registry Synchronization', () => {
    it('should have valid slug and multilingual names for all AVAILABLE_WIDGETS', () => {
      for (const widget of AVAILABLE_WIDGETS) {
        expect(widget.id).toBeTruthy();
        expect(widget.slug).toBeTruthy();

        for (const lang of supportedLanguages) {
          expect(widget.name[lang]).toBeTruthy();
          expect(widget.description[lang]).toBeTruthy();
        }
      }
    });
  });

  // 5. Dynamic Mathematical Boundary Safety Across All Mathematical Pure Functions
  describe('Mathematical Pure Functions Safety Matrix', () => {
    it('should safely execute all exported math functions with edge case inputs without throwing unhandled exceptions', () => {
      const fnNames = Object.keys(allMath).filter(
        (key) => typeof (allMath as any)[key] === 'function'
      );

      expect(fnNames.length).toBeGreaterThan(10);

      const testInputSets = [
        [0, 0, 0, 0, 0],
        [-100, -5, -10, -2, -1],
        [100000000000, 99.9, 50, 100, 12],
        [NaN, undefined, null, 'invalid', '']
      ];

      for (const name of fnNames) {
        const fn = (allMath as any)[name];
        for (const inputs of testInputSets) {
          expect(() => {
            const res = fn(...inputs);
            // Result should be either number, object, string or boolean, never crash
            expect(res).toBeDefined();
          }).not.toThrow();
        }
      }
    });
  });
});
