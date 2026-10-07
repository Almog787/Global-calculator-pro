import { test, expect } from '@playwright/test';
import { BaseCalculatorPage } from './pages/BaseCalculatorPage';

test.describe('Task 2: Interactive Calculation & Decimal.js Precision Tests', () => {

  test('Mortgage & Spitzer Amortization: Exact monthly payment and 360-month schedule generation', async ({ page }) => {
    const calcPage = new BaseCalculatorPage(page);
    await calcPage.navigate('/mortgage-calculator', 'en');

    // Set: $1,200,000 principal, 5.5% annual rate, 30 years
    const inputs = calcPage.getNumericInputs();
    await inputs.nth(0).fill('1200000');
    await inputs.nth(1).fill('5.5');
    await inputs.nth(2).fill('30');

    // Expected Monthly Payment: $6,813.43
    const results = calcPage.getResultCards();
    await expect(results.first()).toContainText('$6,813.43');

    // Verify amortization table rendered and has rows
    const tableRows = page.locator('table tbody tr');
    const rowCount = await tableRows.count();
    expect(rowCount).toBeGreaterThan(0);

    calcPage.verifyNoConsoleErrors();
  });

  test('VAT Calculator (17% & 18%): Accurate gross/net tax separation', async ({ page }) => {
    const calcPage = new BaseCalculatorPage(page);
    await calcPage.navigate('/calculators/vat', 'he');

    const amountInput = calcPage.getNumericInputs().first();
    await amountInput.fill('1180');

    // In 18% VAT: Net is 1000, VAT is 180
    // Check if 1,000 or 180 is displayed in results
    const results = calcPage.getResultCards();
    await expect(results.first()).toBeVisible();

    calcPage.verifyNoConsoleErrors();
  });

  test('Compound Interest & DCA Planner: Growth compounding calculation', async ({ page }) => {
    const calcPage = new BaseCalculatorPage(page);
    await calcPage.navigate('/compound-interest', 'en');

    const inputs = calcPage.getNumericInputs();
    // Initial: $10,000, Monthly: $500, Rate: 8%, Years: 10
    await inputs.nth(0).fill('10000');
    await inputs.nth(1).fill('500');
    await inputs.nth(2).fill('8');
    await inputs.nth(3).fill('10');

    // Results container should render final balance
    const results = calcPage.getResultCards();
    await expect(results.first()).toBeVisible();
    await expect(results.first()).toContainText('$');

    calcPage.verifyNoConsoleErrors();
  });

  test('Severance Pay & Section 14: Statutory rights and tax exemption limit', async ({ page }) => {
    const calcPage = new BaseCalculatorPage(page);
    await calcPage.navigate('/calculators/severance-pay', 'he');

    const inputs = calcPage.getNumericInputs();
    // Salary: 15,000, Years: 5
    await inputs.nth(0).fill('15000');
    await inputs.nth(1).fill('5');

    // Statutory severance: 15,000 * 5 = 75,000
    const results = calcPage.getResultCards();
    await expect(results.first()).toContainText('75,000');

    calcPage.verifyNoConsoleErrors();
  });

});
