import { describe, it, expect } from 'vitest';
import { SUPPORTED_LANGUAGES, STATIC_ROUTES, buildCanonicalUrl, generateStructuredData } from './routesMetadata';
import fs from 'fs';
import path from 'path';

describe('Prerendering & Metadata Registry Unit Tests', () => {
  it('should support all 5 core languages', () => {
    expect(SUPPORTED_LANGUAGES).toEqual(['en', 'he', 'es', 'fr', 'ar']);
  });

  it('should generate accurate canonical URLs across languages', () => {
    expect(buildCanonicalUrl('en', '/')).toBe('https://globalcalcpro.com/en');
    expect(buildCanonicalUrl('he', '/mortgage-calculator')).toBe('https://globalcalcpro.com/he/mortgage-calculator');
    expect(buildCanonicalUrl('es', '/widgets')).toBe('https://globalcalcpro.com/es/widgets');
  });

  it('should generate valid Schema.org WebApplication JSON-LD payload', () => {
    const schema = generateStructuredData(
      'Mortgage Calculator',
      'Calculate monthly payments and amortization schedules.',
      'https://globalcalcpro.com/en/mortgage-calculator',
      'en',
      'WebApplication'
    );

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('WebApplication');
    expect(schema.name).toBe('Mortgage Calculator');
    expect(schema.url).toBe('https://globalcalcpro.com/en/mortgage-calculator');
    expect(schema.offers.price).toBe('0');
    expect(schema.inLanguage).toBe('en');
  });

  it('should cover all key static pages in STATIC_ROUTES', () => {
    expect(STATIC_ROUTES).toContain('/');
    expect(STATIC_ROUTES).toContain('/all');
    expect(STATIC_ROUTES).toContain('/widgets');
    expect(STATIC_ROUTES).toContain('/contact');
    expect(STATIC_ROUTES).toContain('/about');
    expect(STATIC_ROUTES).toContain('/privacy-policy');
  });

  it('scripts/prerender.js exists and handles structured data injection', () => {
    const prerenderScript = fs.readFileSync(path.resolve(process.cwd(), 'scripts/prerender.js'), 'utf8');
    expect(prerenderScript).toContain('createSchemaJsonLd');
    expect(prerenderScript).toContain('application/ld+json');
    expect(prerenderScript).toContain('rel="canonical"');
    expect(prerenderScript).toContain('hreflang=');
    expect(prerenderScript).toContain('semanticShell');
  });
});
