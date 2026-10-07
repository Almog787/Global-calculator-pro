import { Page, Locator, expect } from '@playwright/test';

export type SupportedLanguage = 'en' | 'he' | 'es' | 'fr' | 'ar' | 'ru';

export class BaseCalculatorPage {
  readonly page: Page;
  readonly errors: string[] = [];

  // Semantic Locators
  readonly mainContent: Locator;
  readonly languageSelector: Locator;
  readonly h1Heading: Locator;
  readonly historyButton: Locator;
  readonly searchInput: Locator;
  readonly appWrapper: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainContent = page.getByRole('main');
    this.languageSelector = page.getByRole('combobox', { name: /select language|שפה/i });
    this.h1Heading = page.locator('h1').first();
    this.historyButton = page.getByRole('button', { name: /calculation history|היסטוריית חישובים/i });
    this.searchInput = page.locator('#hero-search-input, input[placeholder*="search" i], input[placeholder*="חיפוש" i]').first();
    this.appWrapper = page.locator('div.min-h-screen').first();

    // Attach listeners for unhandled JavaScript errors and critical console errors
    this.page.on('pageerror', (err) => {
      this.errors.push(`PageError: ${err.message}`);
    });

    this.page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignore benign Vite/HMR WebSocket connection reconnects in test runners
        if (
          !text.includes('failed to connect to websocket') &&
          !text.includes('ERR_CONNECTION_REFUSED') &&
          !text.includes('Vite')
        ) {
          this.errors.push(`ConsoleError: ${text}`);
        }
      }
    });
  }

  /**
   * Navigate to a calculator route with an optional language prefix
   */
  async navigate(path: string, lang: SupportedLanguage = 'en') {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const targetUrl = cleanPath.startsWith(`/${lang}`) ? cleanPath : `/${lang}${cleanPath}`;
    await this.page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
    await expect(this.mainContent).toBeVisible();
  }

  /**
   * Select language via the top navbar select component
   */
  async switchLanguage(targetLang: SupportedLanguage) {
    await this.languageSelector.waitFor({ state: 'visible' });
    await this.languageSelector.selectOption(targetLang);
    await expect(this.page).toHaveURL(new RegExp(`/${targetLang}(/|$)`));
  }

  /**
   * Verify document direction (RTL for he/ar, LTR for en/es/fr/ru)
   */
  async verifyDirection(expectedDir: 'rtl' | 'ltr') {
    await expect(this.appWrapper).toHaveClass(new RegExp(`\\b${expectedDir}\\b`));
  }

  /**
   * Verify H1 heading exists and is non-empty
   */
  async verifyH1Heading() {
    await expect(this.h1Heading).toBeVisible();
    const text = await this.h1Heading.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  }

  /**
   * Verify there are no raw missing translation keys (like undefined, NaN, [object Object], missing_key)
   */
  async verifyNoMissingTranslations() {
    const pageText = await this.page.locator('#root').innerText();
    expect(pageText).not.toContain('missing_key');
    expect(pageText).not.toContain('undefined.undefined');
    expect(pageText).not.toContain('[object Object]');
  }

  /**
   * Verify that no uncaught exceptions occurred
   */
  verifyNoConsoleErrors() {
    expect(this.errors).toEqual([]);
  }

  /**
   * Get all numeric input elements on the current calculator
   */
  getNumericInputs(): Locator {
    return this.page.locator('input[type="number"], input[inputmode="decimal"], input[inputmode="numeric"]');
  }

  /**
   * Get result value cards
   */
  getResultCards(): Locator {
    return this.page.locator('[data-testid="result-card"], .sticky, [class*="result"]');
  }
}
