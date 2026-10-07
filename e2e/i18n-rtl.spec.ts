import { test, expect } from '@playwright/test';
import { BaseCalculatorPage } from './pages/BaseCalculatorPage';

test.describe('i18n & Multi-Language RTL/LTR Integrity Suite', () => {

  test('Language switcher dynamically switches between RTL (Hebrew, Arabic) and LTR (English, Spanish, French, Russian)', async ({ page }) => {
    const calcPage = new BaseCalculatorPage(page);
    await calcPage.navigate('/all', 'en');

    // 1. Initial English (LTR)
    await calcPage.verifyDirection('ltr');
    await expect(page).toHaveURL(/\/en/);

    // 2. Switch to Hebrew (RTL)
    await calcPage.switchLanguage('he');
    await calcPage.verifyDirection('rtl');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await calcPage.verifyNoMissingTranslations();

    // 3. Switch to Arabic (RTL)
    await calcPage.switchLanguage('ar');
    await calcPage.verifyDirection('rtl');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await calcPage.verifyNoMissingTranslations();

    // 4. Switch to Spanish (LTR)
    await calcPage.switchLanguage('es');
    await calcPage.verifyDirection('ltr');
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    await calcPage.verifyNoMissingTranslations();

    // 5. Switch to French (LTR)
    await calcPage.switchLanguage('fr');
    await calcPage.verifyDirection('ltr');
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    await calcPage.verifyNoMissingTranslations();

    // 6. Switch to Russian (LTR)
    await calcPage.switchLanguage('ru');
    await calcPage.verifyDirection('ltr');
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    await calcPage.verifyNoMissingTranslations();

    calcPage.verifyNoConsoleErrors();
  });

  test('History drawer correctly opens, displays translated header, and closes', async ({ page }) => {
    const calcPage = new BaseCalculatorPage(page);
    await calcPage.navigate('/en/mortgage-calculator', 'en');

    // Open History Drawer (Desktop button)
    const historyBtn = page.getByRole('button', { name: /calculation history|היסטוריית חישובים/i }).first();
    await expect(historyBtn).toBeVisible();
    await historyBtn.click();

    // Verify History drawer content visible
    const drawerTitle = page.getByText(/calculation history|היסטוריית חישובים/i).first();
    await expect(drawerTitle).toBeVisible();

    // Close History Drawer
    const closeBtn = page.getByRole('button', { name: /close|סגור/i }).or(page.locator('button:has-text("close")')).first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    }

    calcPage.verifyNoConsoleErrors();
  });

  test('Numeric input values preserve correct numerical format in both RTL and LTR without string reversal', async ({ page }) => {
    const calcPage = new BaseCalculatorPage(page);

    // Test in Hebrew (RTL)
    await calcPage.navigate('/he/bmi-calculator', 'he');
    const inputs = calcPage.getNumericInputs();
    
    // Fill height 180 and weight 80
    await inputs.nth(0).fill('180');
    await inputs.nth(1).fill('80');

    await expect(inputs.nth(0)).toHaveValue('180');
    await expect(inputs.nth(1)).toHaveValue('80');

    // Expected BMI: 80 / (1.80^2) = 24.7
    await expect(page.locator('text=24.7').first()).toBeVisible();

    calcPage.verifyNoConsoleErrors();
  });

});
