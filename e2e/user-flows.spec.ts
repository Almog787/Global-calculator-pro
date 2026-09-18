import { test, expect } from '@playwright/test';

test.describe('End-to-End User Flow Tests', () => {

  test('Mortgage Calculator should calculate monthly payment interactively', async ({ page }) => {
    await page.goto('/en/mortgage-calculator');
    await page.waitForSelector('#mc-principal', { state: 'visible' });

    // Fill inputs
    await page.fill('#mc-principal', '1000000');
    await page.fill('#mc-rate', '4');
    await page.fill('#mc-years', '30');

    // Assert monthly payment calculation
    const resultsContainer = page.locator('.sticky, [class*="sticky"]');
    await expect(resultsContainer).toContainText('$4,774.15');
  });

  test('BMI Calculator should calculate BMI and update category', async ({ page }) => {
    await page.goto('/en/bmi-calculator');
    await page.waitForSelector('input[type="number"]', { state: 'visible' });

    const inputs = page.locator('input[type="number"]');
    // First input is height, second is weight
    await inputs.nth(0).fill('180');
    await inputs.nth(1).fill('81');

    // 81 / (1.80^2) = 25.0
    await expect(page.locator('text=25.0').first()).toBeVisible();
  });

  test('URL State parameter restoration on page load', async ({ page }) => {
    // Navigate with pre-defined URL state
    await page.goto('/en/bmi-calculator?height=160&weight=64');
    await page.waitForSelector('input[type="number"]', { state: 'visible' });

    const inputs = page.locator('input[type="number"]');
    await expect(inputs.nth(0)).toHaveValue('160');
    await expect(inputs.nth(1)).toHaveValue('64');

    // 64 / (1.60^2) = 25.0
    await expect(page.locator('text=25.0').first()).toBeVisible();
  });

  test('Language switcher dynamically updates URL and document direction (LTR/RTL)', async ({ page }) => {
    await page.goto('/en');
    await page.waitForSelector('nav', { state: 'visible' });

    const langSelect = page.locator('select[aria-label="Select Language"]');
    await expect(langSelect).toBeVisible();

    // English is LTR
    const appWrapper = page.locator('div.min-h-screen');
    await expect(appWrapper).toHaveClass(/ltr/);

    // Switch to Hebrew (RTL)
    await langSelect.selectOption('he');
    await expect(page).toHaveURL(/\/he/);
    await expect(appWrapper).toHaveClass(/rtl/);

    // Switch to Arabic (RTL)
    await langSelect.selectOption('ar');
    await expect(page).toHaveURL(/\/ar/);
    await expect(appWrapper).toHaveClass(/rtl/);

    // Switch back to French (LTR)
    await langSelect.selectOption('fr');
    await expect(page).toHaveURL(/\/fr/);
    await expect(appWrapper).toHaveClass(/ltr/);
  });

  test('Hero search bar finds calculators and navigates to target', async ({ page }) => {
    await page.goto('/en');
    const searchInput = page.locator('#hero-search-input');
    await expect(searchInput).toBeVisible();

    await searchInput.fill('Mortgage');
    
    // Check results dropdown
    const resultItem = page.locator('button:has-text("Mortgage")').first();
    await expect(resultItem).toBeVisible();

    // Click and verify navigation
    await resultItem.click();
    await expect(page).toHaveURL(/\/en\/mortgage-calculator/);
    await expect(page.locator('#mc-principal')).toBeVisible();
  });

});
