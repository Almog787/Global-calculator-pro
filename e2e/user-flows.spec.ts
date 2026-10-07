import { test, expect } from '@playwright/test';
import { BaseCalculatorPage } from './pages/BaseCalculatorPage';

test.describe('End-to-End User Flow Tests (Semantic & Zero-Flake)', () => {

  test('Mortgage Calculator calculates monthly payment interactively and updates results', async ({ page }) => {
    const calcPage = new BaseCalculatorPage(page);
    await calcPage.navigate('/mortgage-calculator', 'en');

    await page.waitForSelector('#mc-principal, input[type="number"]', { state: 'visible' });

    // Fill inputs
    const principalInput = page.locator('#mc-principal').or(calcPage.getNumericInputs().nth(0));
    const rateInput = page.locator('#mc-rate').or(calcPage.getNumericInputs().nth(1));
    const yearsInput = page.locator('#mc-years').or(calcPage.getNumericInputs().nth(2));

    await principalInput.fill('1000000');
    await rateInput.fill('4');
    await yearsInput.fill('30');

    // Assert monthly payment calculation ($4,774.15)
    const resultsContainer = page.locator('.sticky, [class*="sticky"], [data-testid="result-card"]');
    await expect(resultsContainer).toContainText('$4,774.15');

    calcPage.verifyNoConsoleErrors();
  });

  test('BMI Calculator calculates BMI and updates weight status category', async ({ page }) => {
    const calcPage = new BaseCalculatorPage(page);
    await calcPage.navigate('/bmi-calculator', 'en');

    const inputs = calcPage.getNumericInputs();
    await inputs.nth(0).fill('180');
    await inputs.nth(1).fill('81');

    // 81 / (1.80^2) = 25.0
    await expect(page.locator('text=25.0').first()).toBeVisible();

    calcPage.verifyNoConsoleErrors();
  });

  test('URL State parameter restoration on initial load', async ({ page }) => {
    const calcPage = new BaseCalculatorPage(page);
    await page.goto('/en/bmi-calculator?height=160&weight=64', { waitUntil: 'domcontentloaded' });

    const inputs = calcPage.getNumericInputs();
    await expect(inputs.nth(0)).toHaveValue('160');
    await expect(inputs.nth(1)).toHaveValue('64');

    // 64 / (1.60^2) = 25.0
    await expect(page.locator('text=25.0').first()).toBeVisible();

    calcPage.verifyNoConsoleErrors();
  });

  test('Hero search bar filters calculators and navigates to target tool', async ({ page }) => {
    const calcPage = new BaseCalculatorPage(page);
    await calcPage.navigate('/all', 'en');

    const searchInput = calcPage.searchInput;
    await expect(searchInput).toBeVisible();

    await searchInput.fill('Mortgage');
    
    // Check results dropdown item
    const resultItem = page.locator('button:has-text("Mortgage"), a:has-text("Mortgage")').first();
    await expect(resultItem).toBeVisible();

    // Click and verify navigation
    await resultItem.click();
    await expect(page).toHaveURL(/\/en\/mortgage-calculator/);

    calcPage.verifyNoConsoleErrors();
  });

});
