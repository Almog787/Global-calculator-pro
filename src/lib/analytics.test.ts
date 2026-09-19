import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  GA_MEASUREMENT_ID,
  GTM_ID,
  trackEvent,
  trackPageView,
  trackCalculation,
  trackExcelExport,
  trackScenarioComparison,
  trackPWAEvent,
  trackWidgetInteraction,
  trackLanguageChange,
  trackFormSubmission
} from './analytics';
import fs from 'fs';
import path from 'path';

describe('Google Analytics 4 & GTM Tracking Suite', () => {
  beforeEach(() => {
    // Setup window mock for node test environment
    (globalThis as any).window = {
      dataLayer: [],
      gtag: vi.fn(),
      location: {
        href: 'https://globalcalcpro.com/he/mortgage-calculator'
      }
    };
    (globalThis as any).document = {
      title: 'מחשבון משכנתא'
    };
  });

  describe('Tag IDs & HTML Configuration', () => {
    it('should have correct GA4 and GTM IDs configured', () => {
      expect(GA_MEASUREMENT_ID).toBe('G-VBS74DCCQ8');
      expect(GTM_ID).toBe('GTM-P88SNBVB');
    });

    it('should have GTM and gtag.js scripts present in index.html', () => {
      const indexPath = path.join(process.cwd(), 'index.html');
      const indexHtml = fs.readFileSync(indexPath, 'utf8');

      expect(indexHtml).toContain(GTM_ID);
      expect(indexHtml).toContain(GA_MEASUREMENT_ID);
      expect(indexHtml).toContain('https://www.googletagmanager.com/gtm.js');
      expect(indexHtml).toContain('https://www.googletagmanager.com/gtag/js');
      expect(indexHtml).toContain('https://www.googletagmanager.com/ns.html?id=GTM-P88SNBVB');
    });
  });

  describe('Event Tracking Functionality', () => {
    it('should dispatch custom events to both gtag and dataLayer', () => {
      trackEvent('custom_calc_action', { foo: 'bar' });

      expect(window.gtag).toHaveBeenCalledWith('event', 'custom_calc_action', expect.objectContaining({ foo: 'bar' }));
      expect(window.dataLayer).toContainEqual(expect.objectContaining({
        event: 'custom_calc_action',
        foo: 'bar'
      }));
    });

    it('should track virtual pageviews on SPA navigation', () => {
      trackPageView('/he/mortgage-calculator', 'מחשבון משכנתא', 'he');

      expect(window.gtag).toHaveBeenCalledWith('event', 'page_view', expect.objectContaining({
        page_path: '/he/mortgage-calculator',
        page_title: 'מחשבון משכנתא',
        language: 'he'
      }));

      expect(window.dataLayer).toContainEqual(expect.objectContaining({
        event: 'virtual_page_view',
        page_path: '/he/mortgage-calculator',
        language: 'he'
      }));
    });

    it('should track calculations with metadata', () => {
      trackCalculation('mortgage', { principal: 1000000, rate: 5, years: 30 });

      expect(window.gtag).toHaveBeenCalledWith('event', 'calculate', expect.objectContaining({
        calculator_name: 'mortgage',
        principal: 1000000,
        rate: 5,
        years: 30
      }));
    });

    it('should track Excel exports', () => {
      trackExcelExport('mortgage', 'he', { principal: 1200000, monthlyPayment: 6000 });

      expect(window.gtag).toHaveBeenCalledWith('event', 'export_excel', expect.objectContaining({
        calculator_type: 'mortgage',
        export_format: 'xlsx',
        language: 'he',
        principal: 1200000
      }));
    });

    it('should track Scenario comparisons', () => {
      trackScenarioComparison('mortgage', { diffMonthly: -350, interestSavingsPercent: 12.5 });

      expect(window.gtag).toHaveBeenCalledWith('event', 'compare_scenarios', expect.objectContaining({
        calculator_type: 'mortgage',
        diffMonthly: -350,
        interestSavingsPercent: 12.5
      }));
    });

    it('should track PWA install actions', () => {
      trackPWAEvent('install_click');
      expect(window.gtag).toHaveBeenCalledWith('event', 'pwa_interaction', expect.objectContaining({
        pwa_action: 'install_click'
      }));
    });

    it('should track widget embed code copies', () => {
      trackWidgetInteraction('copy_code', 'mortgage-calculator', 'iframe', 'light');

      expect(window.gtag).toHaveBeenCalledWith('event', 'widget_interaction', expect.objectContaining({
        widget_action: 'copy_code',
        widget_slug: 'mortgage-calculator',
        code_format: 'iframe',
        theme: 'light'
      }));
    });

    it('should track language changes', () => {
      trackLanguageChange('en', 'he');

      expect(window.gtag).toHaveBeenCalledWith('event', 'language_change', expect.objectContaining({
        from_language: 'en',
        to_language: 'he'
      }));
    });

    it('should track form submissions', () => {
      trackFormSubmission('contact', true);

      expect(window.gtag).toHaveBeenCalledWith('event', 'form_submission', expect.objectContaining({
        form_name: 'contact',
        status: 'success'
      }));
    });
  });
});
