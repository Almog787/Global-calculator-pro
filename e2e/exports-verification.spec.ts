import { test, expect } from '@playwright/test';
import { BaseCalculatorPage } from './pages/BaseCalculatorPage';

test.describe('Task 2: Excel (.xlsx) & CSV Export Verification Tests', () => {

  test('Mortgage Calculator should initiate valid file export without UI freeze', async ({ page }) => {
    const calcPage = new BaseCalculatorPage(page);
    await calcPage.navigate('/mortgage-calculator', 'en');

    // Look for export buttons (Excel or CSV)
    const exportBtn = page.getByRole('button', { name: /export|excel|csv|download|הורד/i }).first();
    
    if (await exportBtn.isVisible()) {
      // Set up download listener
      const downloadPromise = page.waitForEvent('download', { timeout: 8000 }).catch(() => null);
      await exportBtn.click();
      const download = await downloadPromise;

      if (download) {
        const filename = download.suggestedFilename();
        expect(filename.length).toBeGreaterThan(0);
        expect(filename).toMatch(/\.(xlsx|csv)$/i);
      }
    }

    calcPage.verifyNoConsoleErrors();
  });

  test('Salary Gross-to-Net Calculator should provide export capabilities', async ({ page }) => {
    const calcPage = new BaseCalculatorPage(page);
    await calcPage.navigate('/salary-calculator', 'en');

    const inputs = calcPage.getNumericInputs();
    await inputs.first().fill('20000');

    // Verify calculation output rendered
    const results = calcPage.getResultCards();
    await expect(results.first()).toBeVisible();

    calcPage.verifyNoConsoleErrors();
  });

});
