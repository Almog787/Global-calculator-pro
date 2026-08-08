import { test, expect } from '@playwright/test';
import { calculators } from '../src/data/calculators';

test.describe('Calculators E2E Tests', () => {
  // Test the home page
  test('Home page should load without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignore expected Vite/HMR errors in preview environments
        if (!text.includes('failed to connect to websocket') && !text.includes('Vite') && !text.includes('net::ERR_CONNECTION_REFUSED')) {
          errors.push(text);
        }
      }
    });

    await page.goto('/');
    
    // Wait for the app to mount
    await page.waitForSelector('main', { state: 'visible' });
    
    // Check if there are no critical errors
    expect(errors.length).toBe(0);
  });

  // Dynamically test all calculators
  for (const calc of calculators) {
    test(`Calculator: ${calc.fallbackTitle} should load without errors at ${calc.path}`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (err) => errors.push(err.message));
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          const text = msg.text();
          // Ignore expected Vite/HMR errors in preview environments
          if (!text.includes('failed to connect to websocket') && !text.includes('Vite') && !text.includes('net::ERR_CONNECTION_REFUSED')) {
            errors.push(text);
          }
        }
      });

      await page.goto(calc.path);
      
      // Wait for the app to be mounted and title to be set (basic sanity check)
      await page.waitForSelector('main', { state: 'visible' });

      // The React app should not crash (usually a crash results in a blank screen or error boundary)
      const rootElement = await page.locator('#root').innerHTML();
      expect(rootElement.length).toBeGreaterThan(0);
      
      // Verify no console errors
      expect(errors).toEqual([]);
    });
  }
});
