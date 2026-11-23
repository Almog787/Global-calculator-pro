import { describe, it, expect } from 'vitest';
import { getCanonicalRedirect } from './legacyRedirects';

describe('getCanonicalRedirect', () => {
  it('routes bare language roots with or without trailing slash directly to /<lang>/all', () => {
    expect(getCanonicalRedirect('/en', 'en')).toBe('/en/all');
    expect(getCanonicalRedirect('/en/', 'en')).toBe('/en/all');
    expect(getCanonicalRedirect('/he/', 'he')).toBe('/he/all');
    expect(getCanonicalRedirect('/ar', 'ar')).toBe('/ar/all');
  });

  it('keeps canonical /<lang>/all and calculator routes untouched', () => {
    expect(getCanonicalRedirect('/en/all', 'en')).toBeNull();
    expect(getCanonicalRedirect('/he/mortgage-calculator', 'he')).toBeNull();
  });

  it('strips trailing slash on localized subpages', () => {
    expect(getCanonicalRedirect('/en/mortgage-calculator/', 'en')).toBe('/en/mortgage-calculator');
  });
});
