/**
 * Google Analytics 4 (GA4) and Google Tag Manager (GTM) Event Tracking Helper
 * Provides unified, safe, and typed event dispatching across GlobalCalc Pro.
 */

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID = 'G-VBS74DCCQ8';
export const GTM_ID = 'GTM-P88SNBVB';

/**
 * Safely push an event to GTM dataLayer and Google Analytics gtag
 */
export function trackEvent(eventName: string, params: Record<string, any> = {}): void {
  if (typeof window === 'undefined') return;

  // 1. Dispatch to GA4 via gtag if available
  if (typeof window.gtag === 'function') {
    try {
      window.gtag('event', eventName, params);
    } catch {
      // Ignore tracking errors
    }
  }

  // 2. Dispatch to GTM dataLayer
  if (Array.isArray(window.dataLayer)) {
    try {
      window.dataLayer.push({
        event: eventName,
        ...params,
        timestamp: new Date().toISOString()
      });
    } catch {
      // Ignore tracking errors
    }
  }
}

/**
 * Track SPA Virtual Pageviews on route changes
 */
export function trackPageView(pagePath: string, pageTitle?: string, language?: string): void {
  if (typeof window === 'undefined') return;

  const title = pageTitle || document.title;
  const location = window.location.href;

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: title,
      page_location: location,
      language: language || 'en'
    });
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: 'virtual_page_view',
      page_path: pagePath,
      page_title: title,
      page_location: location,
      language: language || 'en'
    });
  }
}

/**
 * Track Calculator calculation event
 */
export function trackCalculation(
  calculatorName: string,
  params: Record<string, any> = {}
): void {
  trackEvent('calculate', {
    event_category: 'Calculator',
    calculator_name: calculatorName,
    ...params
  });
}

/**
 * Track Excel (.xlsx) schedule / summary export
 */
export function trackExcelExport(
  calculatorType: 'mortgage' | 'compound' | 'table' | string,
  language: string = 'he',
  details: Record<string, any> = {}
): void {
  trackEvent('export_excel', {
    event_category: 'Export',
    calculator_type: calculatorType,
    export_format: 'xlsx',
    language,
    ...details
  });
}

/**
 * Track Scenario Comparison (Plan A vs Plan B)
 */
export function trackScenarioComparison(
  calculatorType: 'mortgage' | 'compound' | string,
  details: Record<string, any> = {}
): void {
  trackEvent('compare_scenarios', {
    event_category: 'Comparison',
    calculator_type: calculatorType,
    ...details
  });
}

/**
 * Track PWA Installation prompt events
 */
export function trackPWAEvent(
  action: 'prompt_shown' | 'install_click' | 'install_accepted' | 'install_dismissed' | 'ios_guide_viewed',
  details: Record<string, any> = {}
): void {
  trackEvent('pwa_interaction', {
    event_category: 'PWA',
    pwa_action: action,
    ...details
  });
}

/**
 * Track Widget interactions & Embed code copy
 */
export function trackWidgetInteraction(
  action: 'copy_code' | 'change_theme' | 'change_size' | 'preview_device',
  widgetSlug: string,
  format?: string,
  theme?: string
): void {
  trackEvent('widget_interaction', {
    event_category: 'Widgets',
    widget_action: action,
    widget_slug: widgetSlug,
    code_format: format,
    theme
  });
}

/**
 * Track UI Language Switch
 */
export function trackLanguageChange(fromLang: string, toLang: string): void {
  trackEvent('language_change', {
    event_category: 'Localization',
    from_language: fromLang,
    to_language: toLang
  });
}

/**
 * Track user contact / feedback form submission
 */
export function trackFormSubmission(
  formName: 'contact' | 'suggest_feature' | string,
  success: boolean
): void {
  trackEvent('form_submission', {
    event_category: 'Engagement',
    form_name: formName,
    status: success ? 'success' : 'failure'
  });
}
