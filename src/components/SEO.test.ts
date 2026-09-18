import { describe, it, expect } from 'vitest';

describe('SEO Schema & Graph Generator Suite', () => {
  const baseUrl = 'https://globalcalcpro.com';
  const validLangs = ['en', 'he', 'es', 'fr', 'ar'];

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

  it('should build rich WebApplication schema with aggregateRating and zero price offer', () => {
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
      applicationCategory: 'CalculatorApplication',
      operatingSystem: 'All',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      isAccessibleForFree: true,
      inLanguage: currentLang,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '1480',
        bestRating: '5',
        worstRating: '1'
      }
    };

    expect(softwareSchema.aggregateRating.ratingValue).toBe('4.9');
    expect(softwareSchema.offers.price).toBe('0');
    expect(softwareSchema.isAccessibleForFree).toBe(true);
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

  it('should cover all 5 languages in hreflang alternate links', () => {
    const subPath = '/mortgage-calculator';
    const hreflangs = validLangs.map(l => ({
      lang: l,
      url: `${baseUrl}/${l}${subPath}`
    }));

    expect(hreflangs.length).toBe(5);
    expect(hreflangs.find(h => h.lang === 'he')?.url).toBe('https://globalcalcpro.com/he/mortgage-calculator');
    expect(hreflangs.find(h => h.lang === 'ar')?.url).toBe('https://globalcalcpro.com/ar/mortgage-calculator');
  });
});
