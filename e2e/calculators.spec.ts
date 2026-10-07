import { test, expect } from '@playwright/test';
import { BaseCalculatorPage } from './pages/BaseCalculatorPage';

test.describe('Core Calculators Sanity & Navigation Suite', () => {

  test('Home page mounts with hero section, search bar, and calculator catalog grid', async ({ page }) => {
    const calcPage = new BaseCalculatorPage(page);
    await calcPage.navigate('/all', 'en');

    // Hero Search Bar is visible and functional
    const searchInput = calcPage.searchInput;
    await expect(searchInput).toBeVisible();

    // Verify catalog cards
    const cards = page.locator('a[href*="/en/"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(10);

    calcPage.verifyNoConsoleErrors();
  });

  test('Widgets Hub displays interactive widget code generator and preview', async ({ page }) => {
    const calcPage = new BaseCalculatorPage(page);
    await calcPage.navigate('/widgets', 'en');

    await calcPage.verifyH1Heading();
    await calcPage.verifyNoMissingTranslations();

    // Verify iframe code preview is displayed
    const codeBlock = page.locator('pre, code, textarea');
    await expect(codeBlock.first()).toBeVisible();

    calcPage.verifyNoConsoleErrors();
  });

  test('Category navigation filters calculators correctly', async ({ page }) => {
    const calcPage = new BaseCalculatorPage(page);
    
    // Navigate to Finance Category
    await calcPage.navigate('/category/finance', 'en');
    await calcPage.verifyH1Heading();
    
    // Check that finance calculators are visible
    await expect(page.getByText(/Mortgage|Compound Interest|Salary|VAT/i).first()).toBeVisible();

    // Navigate to Health Category
    await calcPage.navigate('/category/health', 'en');
    await calcPage.verifyH1Heading();
    await expect(page.getByText(/BMI|BMR|Pregnancy|Water/i).first()).toBeVisible();

    calcPage.verifyNoConsoleErrors();
  });

});
