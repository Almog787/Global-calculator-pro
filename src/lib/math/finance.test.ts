import { describe, it, expect } from 'vitest';
import {
  calculateMortgage,
  calculateCompoundInterest,
  calculateDebtSnowball,
  calculateReverseMortgage,
  calculateTargetSavings,
  calculateGrossFromNet,
  generateMortgageAmortizationSchedule
} from './finance';

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

  describe('calculateReverseMortgage (Target Payment to Max Loan)', () => {
    it('should calculate loan capacity from target monthly payment', () => {
      // For $4,774.15 payment at 4% for 30 years => should yield ~$1,000,000
      const result = calculateReverseMortgage(4774.15, 4, 30);
      expect(result.maxLoanAmount).toBeCloseTo(1000000, -2);
      expect(result.totalPaid).toBeGreaterThan(result.maxLoanAmount);
    });

    it('should handle zero interest correctly in reverse', () => {
      // $1,000/mo for 10 years (120 months) at 0% => $120,000
      const result = calculateReverseMortgage(1000, 0, 10);
      expect(result.maxLoanAmount).toBe(120000);
      expect(result.totalInterest).toBe(0);
    });
  });

  describe('calculateTargetSavings', () => {
    it('should calculate required monthly savings to reach $1,000,000', () => {
      // Goal $1,000,000 at 7% in 30 years with 0 initial deposit
      const result = calculateTargetSavings(1000000, 7, 30, 0);
      expect(result.requiredMonthlyContribution).toBeGreaterThan(700);
      expect(result.requiredMonthlyContribution).toBeLessThan(900);
      expect(result.totalSaved).toBe(1000000);
      expect(result.totalInterest).toBeGreaterThan(600000);
    });
  });

  describe('calculateGrossFromNet', () => {
    it('should calculate gross salary needed for target net', () => {
      // Target net $10,000 with 20% tax, 6% pension, 4% social security (30% total) => $14,286 gross
      const result = calculateGrossFromNet(10000, 20, 6, 4);
      expect(result.grossMonthly).toBe(14286);
      expect(result.netMonthly).toBe(10000);
      expect(result.takeHomeRatio).toBe(70);
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

  describe('generateMortgageAmortizationSchedule', () => {
    it('should generate accurate monthly breakdown with declining balance', () => {
      const schedule = generateMortgageAmortizationSchedule(120000, 5, 10);
      expect(schedule.length).toBe(120);
      expect(schedule[0].period).toBe(1);
      expect(schedule[0].balance).toBeLessThan(120000);
      expect(schedule[119].balance).toBe(0);
      expect(schedule[119].cumulativeInterest).toBeGreaterThan(30000);
    });

    it('should return empty schedule for zero principal or zero years', () => {
      expect(generateMortgageAmortizationSchedule(0, 5, 10)).toEqual([]);
      expect(generateMortgageAmortizationSchedule(100000, 5, 0)).toEqual([]);
    });
  });
});
