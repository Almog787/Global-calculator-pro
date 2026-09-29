import { describe, it, expect } from 'vitest';
import { CATEGORY_HUBS, getCategoryHubInfo } from '../../data/categories';
import { getRelatedCalculators, calculators } from '../../data/calculators';

describe('Task 1: Topic Clusters, Category Hubs & Breadcrumbs Suite', () => {
  const supportedLangs = ['en', 'he', 'es', 'fr', 'ar'];
  const expectedCategories = ['finance', 'real-estate', 'health', 'math', 'tech', 'lifestyle'];

  it('should define complete metadata and content for all 6 core categories', () => {
    for (const catId of expectedCategories) {
      expect(CATEGORY_HUBS[catId]).toBeDefined();
      const hub = getCategoryHubInfo(catId);
      expect(hub).toBeDefined();
      expect(hub?.id).toBe(catId);
      expect(hub?.icon).toBeTruthy();

      for (const lang of supportedLangs) {
        expect(hub?.name[lang]).toBeTruthy();
        expect(hub?.seoTitle[lang]).toBeTruthy();
        expect(hub?.seoDescription[lang]).toBeTruthy();
        expect(hub?.heroTitle[lang]).toBeTruthy();
        expect(hub?.heroSubtitle[lang]).toBeTruthy();
        expect(hub?.overview[lang]).toBeTruthy();
        expect(hub?.methodology[lang]).toBeTruthy();
        expect(hub?.tags[lang].length).toBeGreaterThan(2);
      }
    }
  });

  it('should accurately return related calculators from the exact same category cluster', () => {
    // Test 1: Mortgage -> Should return real-estate calculators
    const mortgageRelated = getRelatedCalculators('mortgage', 4);
    expect(mortgageRelated.length).toBe(4);
    expect(mortgageRelated.some(c => c.id === 'mortgage-calculator')).toBe(false);
    expect(mortgageRelated.filter(c => c.category === 'real-estate').length).toBeGreaterThanOrEqual(2);

    // Test 2: Pregnancy -> Should return health calculators
    const pregnancyRelated = getRelatedCalculators('/calculators/pregnancy-calculator', 4);
    expect(pregnancyRelated.length).toBe(4);
    expect(pregnancyRelated.some(c => c.id === 'pregnancy-calculator')).toBe(false);
    expect(pregnancyRelated.filter(c => c.category === 'health').length).toBeGreaterThanOrEqual(2);

    // Test 3: Salary -> Should return finance calculators
    const salaryRelated = getRelatedCalculators('salary', 4);
    expect(salaryRelated.length).toBe(4);
    expect(salaryRelated.some(c => c.id === 'salary-calculator')).toBe(false);
    expect(salaryRelated.filter(c => c.category === 'finance').length).toBeGreaterThanOrEqual(2);
  });

  it('should cover all calculators with valid categories matching category hubs', () => {
    for (const calc of calculators) {
      expect(expectedCategories).toContain(calc.category);
    }
  });
});
