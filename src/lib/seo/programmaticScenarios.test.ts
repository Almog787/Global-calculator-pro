import { describe, it, expect } from 'vitest';
import {
  POPULAR_MORTGAGE_SCENARIOS,
  POPULAR_COMPOUND_SCENARIOS,
  getProgrammaticFaqs
} from './programmaticScenarios';

describe('programmaticScenarios', () => {
  it('defines valid scenarios for mortgage long-tail keywords', () => {
    expect(POPULAR_MORTGAGE_SCENARIOS.length).toBeGreaterThan(0);
    const oneMillion = POPULAR_MORTGAGE_SCENARIOS.find(s => s.id === 'mortgage-1m-30y-5p');
    expect(oneMillion).toBeDefined();
    expect(oneMillion?.params.principal).toBe(1000000);
    expect(oneMillion?.params.years).toBe(30);
    expect(oneMillion?.title.he).toContain('1,000,000');
  });

  it('defines valid scenarios for compound interest DCA targets', () => {
    expect(POPULAR_COMPOUND_SCENARIOS.length).toBeGreaterThan(0);
    const scenario = POPULAR_COMPOUND_SCENARIOS.find(s => s.id === 'compound-500-20y-8p');
    expect(scenario).toBeDefined();
    expect(scenario?.params.rate).toBe(8.0);
  });

  it('retrieves FAQ items for programmatic schema.org inclusion', () => {
    const faqs = getProgrammaticFaqs('mortgage');
    expect(faqs.length).toBeGreaterThan(0);
    expect(typeof faqs[0].question).toBe('string');
    expect(typeof faqs[0].answer).toBe('string');
  });
});
