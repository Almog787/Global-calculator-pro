import { describe, it, expect } from 'vitest';
import { calculateMortgage, calculateCompoundInterest, calculateDebtSnowball } from './finance';

describe('Financial Math Engine', () => {
  describe('calculateMortgage', () => {
    it('should accurately calculate standard 30-year fixed mortgage', () => {
      // 1,000,000 loan at 4% for 30 years
      const result = calculateMortgage(1000000, 4, 30);
      expect(result.monthlyPayment).toBeCloseTo(4774.15, 1);
      expect(result.totalInterest).toBeCloseTo(718695, -1);
    });

    it('should handle zero interest rate loans correctly', () => {
      // 120,000 at 0% for 10 years (120 months) => 1,000/mo, 0 interest
      const result = calculateMortgage(120000, 0, 10);
      expect(result.monthlyPayment).toBe(1000);
      expect(result.totalInterest).toBe(0);
    });

    it('should handle zero principal or zero years gracefully without throwing', () => {
      expect(calculateMortgage(0, 5, 30)).toEqual({ monthlyPayment: 0, totalInterest: 0 });
      expect(calculateMortgage(500000, 5, 0)).toEqual({ monthlyPayment: 0, totalInterest: 0 });
    });
  });

  describe('calculateCompoundInterest', () => {
    it('should calculate compound interest with lump sum and zero monthly deposit', () => {
      // 10,000 principal at 5% compounded monthly for 10 years
      const result = calculateCompoundInterest(10000, 5, 10, 0);
      expect(result.futureValue).toBeCloseTo(16470.09, 1);
      expect(result.totalContributions).toBe(10000);
      expect(result.totalInterest).toBeCloseTo(6470.09, 1);
      expect(result.scheduleData.length).toBe(11); // Year 0 to 10
    });

    it('should calculate compound interest with monthly deposits', () => {
      // 5,000 principal, 7% annual, 5 years, 200 monthly
      const result = calculateCompoundInterest(5000, 7, 5, 200);
      expect(result.futureValue).toBeGreaterThan(19000);
      expect(result.totalContributions).toBe(5000 + (200 * 60));
      expect(result.totalInterest).toBe(result.futureValue - result.totalContributions);
    });

    it('should handle 0% interest rate as purely linear contribution', () => {
      const result = calculateCompoundInterest(1000, 0, 2, 100);
      // 1000 + 100 * 24 = 3400
      expect(result.futureValue).toBe(3400);
      expect(result.totalContributions).toBe(3400);
      expect(result.totalInterest).toBe(0);
    });
  });

  describe('calculateDebtSnowball', () => {
    it('should accelerate payoff when extra payment is provided', () => {
      const debts = [
        { id: 1, bal: 1000, rate: 18, min: 50 },
        { id: 2, bal: 5000, rate: 12, min: 100 }
      ];
      const result = calculateDebtSnowball(debts, 200);

      expect(result.snowballMonths).toBeLessThan(result.baseMonths);
      expect(result.snowballInterest).toBeLessThan(result.baseInterest);
    });

    it('should handle empty debt list gracefully', () => {
      const result = calculateDebtSnowball([], 100);
      expect(result.baseMonths).toBe(0);
      expect(result.snowballMonths).toBe(0);
    });
  });
});
