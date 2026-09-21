import { describe, it, expect } from 'vitest';
import {
  AVAILABLE_WIDGETS,
  buildEmbedUrl,
  buildCanonicalUrl,
  generateIframeCode,
  generateReactCode,
  generateWordPressCode,
  EmbedOptions
} from './widgetsConfig';

describe('Embeddable Widgets Configuration & Code Generator Suite', () => {
  const languages = ['en', 'he', 'es', 'fr', 'ar'] as const;

  it('should provide a complete catalog of supported widgets', () => {
    expect(AVAILABLE_WIDGETS.length).toBe(18);

    const expectedIds = [
      'mortgage',
      'compound',
      'salary',
      'bmi',
      'percentage',
      'unit',
      'tip',
      'age',
      'z-score',
      'linear-regression',
      'quadratic',
      'linear-system',
      'base-converter',
      'bitwise',
      'triangle',
      'circle-sector',
      'matrix',
      'complex-numbers'
    ];
    const actualIds = AVAILABLE_WIDGETS.map(w => w.id);
    expect(actualIds).toEqual(expectedIds);
  });

  it('should ensure all widgets have complete multilingual names and descriptions in 5 languages', () => {
    for (const widget of AVAILABLE_WIDGETS) {
      expect(widget.slug).toBeTruthy();
      expect(widget.defaultHeight).toBeGreaterThan(400);

      for (const lang of languages) {
        expect(widget.name[lang]).toBeTruthy();
        expect(typeof widget.name[lang]).toBe('string');
        expect(widget.name[lang].length).toBeGreaterThan(3);

        expect(widget.description[lang]).toBeTruthy();
        expect(typeof widget.description[lang]).toBe('string');
        expect(widget.description[lang].length).toBeGreaterThan(10);
      }
    }
  });

  it('should build accurate embed URLs with language and theme parameters', () => {
    const lightUrl = buildEmbedUrl('mortgage-calculator', 'en', 'light');
    expect(lightUrl).toBe('https://globalcalcpro.com/en/mortgage-calculator?embed=true');

    const darkUrl = buildEmbedUrl('compound-interest', 'he', 'dark');
    expect(darkUrl).toBe('https://globalcalcpro.com/he/compound-interest?embed=true&theme=dark');

    const spanishUrl = buildEmbedUrl('salary-calculator', 'es', 'light');
    expect(spanishUrl).toBe('https://globalcalcpro.com/es/salary-calculator?embed=true');
  });

  it('should build accurate canonical URLs for calculators', () => {
    expect(buildCanonicalUrl('mortgage-calculator', 'fr')).toBe('https://globalcalcpro.com/fr/mortgage-calculator');
    expect(buildCanonicalUrl('bmi-calculator', 'ar')).toBe('https://globalcalcpro.com/ar/bmi-calculator');
  });

  describe('generateIframeCode', () => {
    const widget = AVAILABLE_WIDGETS[0]; // mortgage

    it('should generate valid iframe with security and performance attributes', () => {
      const options: EmbedOptions = {
        widget,
        widgetLang: 'en',
        uiLang: 'en',
        width: '100%',
        height: 680,
        theme: 'light',
        includeBacklink: true
      };

      const code = generateIframeCode(options);

      expect(code).toContain('<iframe');
      expect(code).toContain('src="https://globalcalcpro.com/en/mortgage-calculator?embed=true"');
      expect(code).toContain('width="100%"');
      expect(code).toContain('height="680"');
      expect(code).toContain('loading="lazy"');
      expect(code).toContain('frameborder="0"');
      expect(code).toContain('Powered by <a href="https://globalcalcpro.com/en/mortgage-calculator"');
    });

    it('should omit backlink paragraph when includeBacklink is false', () => {
      const options: EmbedOptions = {
        widget,
        widgetLang: 'he',
        uiLang: 'he',
        width: '380px',
        height: 600,
        theme: 'dark',
        includeBacklink: false
      };

      const code = generateIframeCode(options);

      expect(code).toContain('theme=dark');
      expect(code).not.toContain('<p');
      expect(code).not.toContain('Powered by');
      expect(code).not.toContain('מופעל ע״י');
    });

    it('should translate backlink text for RTL languages (Hebrew and Arabic)', () => {
      const hebrewOptions: EmbedOptions = {
        widget,
        widgetLang: 'he',
        uiLang: 'he',
        width: '100%',
        height: 680,
        theme: 'light',
        includeBacklink: true
      };

      const hebrewCode = generateIframeCode(hebrewOptions);
      expect(hebrewCode).toContain('מופעל ע״י');

      const arabicOptions: EmbedOptions = {
        widget,
        widgetLang: 'ar',
        uiLang: 'ar',
        width: '100%',
        height: 680,
        theme: 'light',
        includeBacklink: true
      };

      const arabicCode = generateIframeCode(arabicOptions);
      expect(arabicCode).toContain('مشغل بواسطة');
    });
  });

  describe('generateReactCode', () => {
    it('should generate clean React component with JSX syntax', () => {
      const widget = AVAILABLE_WIDGETS[1]; // compound
      const options: EmbedOptions = {
        widget,
        widgetLang: 'en',
        uiLang: 'en',
        width: '600px',
        height: 700,
        theme: 'light',
        includeBacklink: true
      };

      const code = generateReactCode(options);

      expect(code).toContain("import React from 'react';");
      expect(code).toContain('export function CompoundWidget() {');
      expect(code).toContain('frameBorder="0"');
      expect(code).toContain('loading="lazy"');
      expect(code).toContain("src=\"https://globalcalcpro.com/en/compound-interest?embed=true\"");
    });
  });

  describe('generateWordPressCode', () => {
    it('should prefix iframe with WordPress HTML block guidance', () => {
      const widget = AVAILABLE_WIDGETS[3]; // bmi
      const options: EmbedOptions = {
        widget,
        widgetLang: 'es',
        uiLang: 'es',
        width: '100%',
        height: 600,
        theme: 'light',
        includeBacklink: true
      };

      const code = generateWordPressCode(options);

      expect(code).toContain('<!-- WordPress Custom HTML Block: Paste the following directly -->');
      expect(code).toContain('src="https://globalcalcpro.com/es/bmi-calculator?embed=true"');
    });
  });
});
