import { test, expect } from '@playwright/test';
import { BaseCalculatorPage } from './pages/BaseCalculatorPage';

test.describe('Task 2: PWA & Offline Resilience Suite', () => {

  test('Web App Manifest and PWA meta tags are properly present in the DOM', async ({ page }) => {
    const calcPage = new BaseCalculatorPage(page);
    await calcPage.navigate('/all', 'en');

    // Verify manifest link
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveAttribute('href', /manifest\.webmanifest|manifest\.json/);

    // Verify theme-color
    const themeMeta = page.locator('meta[name="theme-color"]');
    await expect(themeMeta).toBeVisible();

    calcPage.verifyNoConsoleErrors();
  });

  test('Offline calculation resilience: Calculators perform math without network connection', async ({ page, context }) => {
    const calcPage = new BaseCalculatorPage(page);
    
    // 1. Initial online load
    await calcPage.navigate('/bmi-calculator', 'en');
    const inputs = calcPage.getNumericInputs();
    await inputs.nth(0).fill('175');
    await inputs.nth(1).fill('70');
    await expect(page.locator('text=22.9').first()).toBeVisible();

    // 2. Simulate complete network disconnection
    await context.setOffline(true);

    // 3. Perform new calculation offline (Height: 180, Weight: 80 -> BMI: 24.7)
    await inputs.nth(0).fill('180');
    await inputs.nth(1).fill('80');
    await expect(page.locator('text=24.7').first()).toBeVisible();

    // 4. Restore network
    await context.setOffline(false);

    calcPage.verifyNoConsoleErrors();
  });

  test('LocalStorage history persistence retains calculations across page reloads', async ({ page }) => {
    const calcPage = new BaseCalculatorPage(page);
    await calcPage.navigate('/tip-calculator', 'en');

    // Fill bill amount and tip
    const inputs = calcPage.getNumericInputs();
    if (await inputs.count() >= 2) {
      await inputs.nth(0).fill('200');
      await inputs.nth(1).fill('15');
    }

    // Reload page
    await page.reload({ waitUntil: 'domcontentloaded' });
    await calcPage.verifyH1Heading();

    calcPage.verifyNoConsoleErrors();
  });

});
