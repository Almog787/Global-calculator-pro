import { test, expect } from '@playwright/test';
import { calculators } from '../src/data/calculators';
import { BaseCalculatorPage } from './pages/BaseCalculatorPage';

test.describe('Dynamic Calculator Matrix Suite (47+ Calculators)', () => {
  // 1. Test Home / Catalog page in all primary locales
  const locales = ['en', 'he', 'es', 'fr', 'ar', 'ru'] as const;

  for (const lang of locales) {
    const isRtl = lang === 'he' || lang === 'ar';

    test(`Home Page [/${lang}] should mount with correct direction and zero errors`, async ({ page }) => {
      const calcPage = new BaseCalculatorPage(page);
      await calcPage.navigate('/all', lang);

      // Verify direction
      await calcPage.verifyDirection(isRtl ? 'rtl' : 'ltr');

      // Verify no raw translation keys
      await calcPage.verifyNoMissingTranslations();

      // Verify H1 heading
      await calcPage.verifyH1Heading();

      // Zero console errors
      calcPage.verifyNoConsoleErrors();
    });
  }

  // 2. Loop through all calculators defined in the system
  for (const calc of calculators) {
    test(`[Sanity Matrix] Calculator: ${calc.fallbackTitle} (${calc.path})`, async ({ page }) => {
      const calcPage = new BaseCalculatorPage(page);
      
      // Navigate in English
      await calcPage.navigate(calc.path, 'en');
      await calcPage.verifyH1Heading();
      await calcPage.verifyNoMissingTranslations();
      
      // Check that at least one input exists on the interactive tool
      const inputs = calcPage.getNumericInputs();
      const inputCount = await inputs.count();
      expect(inputCount).toBeGreaterThan(0);

      // Verify no console crashes
      calcPage.verifyNoConsoleErrors();
    });

    // Test Hebrew localized version for key core calculators
    if (['mortgage-calculator', 'compound-interest', 'percentage-finder', 'vat', 'severance-pay', 'salary-calculator', 'bmi-calculator'].some(k => calc.path.includes(k))) {
      test(`[Hebrew RTL Matrix] Calculator: ${calc.fallbackTitle} at /he${calc.path.startsWith('/') ? '' : '/'}${calc.path}`, async ({ page }) => {
        const calcPage = new BaseCalculatorPage(page);
        await calcPage.navigate(calc.path, 'he');

        // Verify RTL
        await calcPage.verifyDirection('rtl');
        await calcPage.verifyH1Heading();
        await calcPage.verifyNoMissingTranslations();

        calcPage.verifyNoConsoleErrors();
      });
    }
  }
});
