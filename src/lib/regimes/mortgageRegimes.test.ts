import { describe, it, expect } from 'vitest';
import { MORTGAGE_REGIMES, getRegimeByCountry } from './mortgageRegimes';

describe('mortgageRegimes', () => {
  it('contains valid configurations for key markets', () => {
    expect(MORTGAGE_REGIMES.IL).toBeDefined();
    expect(MORTGAGE_REGIMES.US).toBeDefined();
    expect(MORTGAGE_REGIMES.EU).toBeDefined();
    expect(MORTGAGE_REGIMES.UK).toBeDefined();
  });

  it('correctly associates Israel with ILS currency and standard tracks', () => {
    const il = MORTGAGE_REGIMES.IL;
    expect(il.currency).toBe('ILS');
    expect(il.currencySymbol).toBe('₪');
    expect(il.tracks.length).toBeGreaterThan(0);
    expect(il.tracks.some(t => t.id === 'il-klatz')).toBe(true);
    expect(il.tracks.some(t => t.id === 'il-prime')).toBe(true);
  });

  it('correctly associates US with USD currency and 30Y fixed', () => {
    const us = MORTGAGE_REGIMES.US;
    expect(us.currency).toBe('USD');
    expect(us.currencySymbol).toBe('$');
    expect(us.tracks.some(t => t.id === 'us-30y-fixed')).toBe(true);
  });

  it('finds regime by country code or falls back to CUSTOM', () => {
    expect(getRegimeByCountry('IL').countryCode).toBe('IL');
    expect(getRegimeByCountry('US').countryCode).toBe('US');
    expect(getRegimeByCountry('UNKNOWN' as any).id).toBe('CUSTOM');
  });
});
