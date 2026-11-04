import { describe, it, expect } from 'vitest';
import { calculatePurchasingPower } from './purchasingPower';

describe('Purchasing Power & Cost of Living Calculator Engine', () => {
  it('should return valid calculations between Tel Aviv and Singapore', () => {
    const result = calculatePurchasingPower({
      sourceCityId: 'tel-aviv',
      targetCityId: 'singapore',
      sourceMonthlySalary: 15000,
    });

    expect(result.sourceCity.id).toBe('tel-aviv');
    expect(result.targetCity.id).toBe('singapore');
    expect(result.sourceSalary).toBe(15000);
    expect(result.equivalentTargetSalary).toBeGreaterThan(0);
    expect(result.exchangeRateSourceToTarget).toBeGreaterThan(0);
    expect(typeof result.livingCostDiffPercentage).toBe('number');
  });

  it('should handle same city comparison cleanly', () => {
    const result = calculatePurchasingPower({
      sourceCityId: 'new-york',
      targetCityId: 'new-york',
      sourceMonthlySalary: 5000,
    });

    expect(result.livingCostDiffPercentage).toBe(0);
    expect(result.rentDiffPercentage).toBe(0);
    expect(result.equivalentTargetSalary).toBe(5000);
    expect(result.exchangeRateSourceToTarget).toBe(1);
  });

  it('should handle zero or negative input gracefully without throwing', () => {
    const result = calculatePurchasingPower({
      sourceCityId: 'london',
      targetCityId: 'berlin',
      sourceMonthlySalary: -500,
    });

    expect(result.equivalentTargetSalary).toBe(0);
    expect(result.sourceSalary).toBe(0);
  });

  it('should support custom user exchange rate overrides', () => {
    const resultWithDefault = calculatePurchasingPower({
      sourceCityId: 'tel-aviv',
      targetCityId: 'new-york',
      sourceMonthlySalary: 10000,
    });

    const resultWithCustom = calculatePurchasingPower({
      sourceCityId: 'tel-aviv',
      targetCityId: 'new-york',
      sourceMonthlySalary: 10000,
      customExchangeRate: 0.30, // 1 ILS = 0.30 USD
    });

    expect(resultWithCustom.exchangeRateSourceToTarget).toBe(0.30);
    expect(resultWithCustom.equivalentTargetSalary).not.toBe(resultWithDefault.equivalentTargetSalary);
  });
});
