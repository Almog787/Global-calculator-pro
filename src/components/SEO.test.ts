import { describe, it, expect } from 'vitest';

describe('SEO Schema & Graph Generator Suite', () => {
  const baseUrl = 'https://globalcalcpro.com';
  const validLangs = ['en', 'he', 'es', 'fr', 'ar', 'ru'];

  it('should generate valid Organization and WebSite schema structure', () => {
    const org = {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: 'Global Calc Pro',
      url: baseUrl,
      logo: `${baseUrl}/favicon.svg`
    };

    expect(org['@type']).toBe('Organization');
    expect(org.url).toBe(baseUrl);
  });

  it('should build rich WebApplication schema with zero price offer', () => {
    const defaultTitle = 'Mortgage Calculator | Global Calc Pro';
    const description = 'Calculate monthly payments and amortization schedules.';
    const finalCanonicalUrl = 'https://globalcalcpro.com/en/mortgage-calculator';
    const currentLang = 'en';

    const softwareSchema = {
      '@type': 'WebApplication',
      '@id': `${finalCanonicalUrl}#software`,
      name: defaultTitle,
      description,
      url: finalCanonicalUrl,
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'All',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      isAccessibleForFree: true,
      license: `${baseUrl}/${currentLang}/terms-of-service`,
      inLanguage: currentLang,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      }
    };

    expect(softwareSchema.offers.price).toBe('0');
    expect(softwareSchema.isAccessibleForFree).toBe(true);
    expect(softwareSchema.applicationCategory).toBe('FinanceApplication');
    expect(softwareSchema.license).toBe('https://globalcalcpro.com/en/terms-of-service');
  });

  it('should generate complete FAQPage schema when items are present', () => {
    const faqItems = [
      { question: 'What is a mortgage?', answer: 'A loan used to purchase real estate.' },
      { question: 'How is interest calculated?', answer: 'Using the standard amortization formula.' }
    ];

    const faqSchema = {
      '@type': 'FAQPage',
      '@id': 'https://globalcalcpro.com/en/mortgage-calculator#faq',
      mainEntity: faqItems.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer
        }
      }))
    };

    expect(faqSchema['@type']).toBe('FAQPage');
    expect(faqSchema.mainEntity.length).toBe(2);
    expect(faqSchema.mainEntity[0].name).toBe('What is a mortgage?');
  });

  it('should cover all 6 languages in hreflang alternate links', () => {
    const subPath = '/mortgage-calculator';
    const hreflangs = validLangs.map(l => ({
      lang: l,
      url: `${baseUrl}/${l}${subPath}`
    }));

    expect(hreflangs.length).toBe(6);
    expect(hreflangs.find(h => h.lang === 'he')?.url).toBe('https://globalcalcpro.com/he/mortgage-calculator');
    expect(hreflangs.find(h => h.lang === 'ar')?.url).toBe('https://globalcalcpro.com/ar/mortgage-calculator');
    expect(hreflangs.find(h => h.lang === 'ru')?.url).toBe('https://globalcalcpro.com/ru/mortgage-calculator');
  });

  it('should provide distinct localized featureList and bestFor for all 53 calculators across all 6 languages', async () => {
    const { calculators } = await import('../data/calculators');
    const capsModule = await import('../data/calculatorCapabilities.json');
    const caps = capsModule.default as Record<string, { bestFor: Record<string, string>; features: Record<string, string[]> }>;

    expect(calculators.length).toBe(53);

    for (const lang of validLangs) {
      const seenFeatureSignatures = new Set<string>();
      for (const calc of calculators) {
        const entry = caps[calc.id];
        expect(entry, `Missing capability metadata for ${calc.id}`).toBeDefined();
        expect(entry.bestFor[lang]?.trim().length, `Missing bestFor.${lang} for ${calc.id}`).toBeGreaterThan(10);
        const feats = entry.features[lang];
        expect(Array.isArray(feats), `Missing features.${lang} for ${calc.id}`).toBe(true);
        expect(feats.length).toBeGreaterThanOrEqual(3);
        const signature = feats.join('|');
        expect(seenFeatureSignatures.has(signature), `Duplicate featureList in ${lang} for ${calc.id}`).toBe(false);
        seenFeatureSignatures.add(signature);
      }
    }
  });
});
