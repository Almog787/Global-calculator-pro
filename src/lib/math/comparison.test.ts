import { describe, it, expect } from 'vitest';
import {
  compareMortgages,
  compareCompoundInterest
} from './finance';

describe('Financial Scenario Comparison Engine', () => {
  describe('compareMortgages (Plan A vs Plan B)', () => {
    it('should return zero difference when comparing identical scenarios', () => {
      const scenario = { principal: 1000000, rate: 5, years: 30 };
      const result = compareMortgages(scenario, scenario);

      expect(result.diffMonthly).toBe(0);
      expect(result.diffTotalInterest).toBe(0);
      expect(result.diffTotalPaid).toBe(0);
      expect(result.interestSavingsPercent).toBe(0);
      expect(result.scenarioA.monthlyPayment).toBe(result.scenarioB.monthlyPayment);
      expect(result.scenarioA.totalInterest).toBe(result.scenarioB.totalInterest);
    });

    it('should accurately calculate savings from a lower interest rate', () => {
      // Plan A: 1,000,000 at 5.5% for 30 years
      // Plan B: 1,000,000 at 4.5% for 30 years (1% rate reduction)
      const planA = { principal: 1000000, rate: 5.5, years: 30 };
      const planB = { principal: 1000000, rate: 4.5, years: 30 };

      const result = compareMortgages(planA, planB);

      // Monthly payment in Plan B should be noticeably lower
      expect(result.scenarioB.monthlyPayment).toBeLessThan(result.scenarioA.monthlyPayment);
      expect(result.diffMonthly).toBeLessThan(0);

      // Total interest in Plan B should save over 200,000
      expect(result.diffTotalInterest).toBeLessThan(-150000);
      expect(result.interestSavingsPercent).toBeGreaterThan(15);
      expect(result.diffTotalPaid).toBe(result.diffTotalInterest);
    });

    it('should calculate trade-offs of shortening the loan term', () => {
      // Plan A: 800,000 at 5% for 30 years
      // Plan B: 800,000 at 5% for 20 years (10 years shorter)
      const planA = { principal: 800000, rate: 5, years: 30 };
      const planB = { principal: 800000, rate: 5, years: 20 };

      const result = compareMortgages(planA, planB);

      // Monthly payment is higher for 20 years
      expect(result.diffMonthly).toBeGreaterThan(0);
      expect(result.scenarioB.monthlyPayment).toBeGreaterThan(result.scenarioA.monthlyPayment);

      // But total interest paid is drastically lower
      expect(result.diffTotalInterest).toBeLessThan(-200000);
      expect(result.interestSavingsPercent).toBeGreaterThan(30);
    });

    it('should calculate impact of a higher down payment (lower principal)', () => {
      // Plan A: 1,200,000 loan at 5% for 25 years
      // Plan B: 1,000,000 loan (extra 200,000 down payment) at 5% for 25 years
      const planA = { principal: 1200000, rate: 5, years: 25 };
      const planB = { principal: 1000000, rate: 5, years: 25 };

      const result = compareMortgages(planA, planB);

      expect(result.diffMonthly).toBeLessThan(0);
      expect(result.diffTotalInterest).toBeLessThan(0);
      expect(result.diffTotalPaid).toBeLessThan(-200000);
      expect(result.interestSavingsPercent).toBeCloseTo(17, 0);
    });

    it('should handle zero principal or zero term gracefully without errors', () => {
      const zeroPlan = { principal: 0, rate: 5, years: 30 };
      const validPlan = { principal: 500000, rate: 5, years: 25 };

      expect(() => compareMortgages(zeroPlan, validPlan)).not.toThrow();
      expect(() => compareMortgages(validPlan, zeroPlan)).not.toThrow();
    });
  });

  describe('compareCompoundInterest (Plan A vs Plan B)', () => {
    it('should return zero difference when comparing identical compound plans', () => {
      const plan = { principal: 10000, rate: 7, years: 10, contribution: 500 };
      const result = compareCompoundInterest(plan, plan);

      expect(result.diffFutureValue).toBe(0);
      expect(result.diffContributions).toBe(0);
      expect(result.diffInterest).toBe(0);
      expect(result.gainPercentage).toBe(0);
      expect(result.scenarioA.futureValue).toBe(result.scenarioB.futureValue);
    });

    it('should demonstrate wealth explosion from higher annual return rate', () => {
      // Plan A: 50,000 initial + 1,000/mo at 6% for 20 years
      // Plan B: 50,000 initial + 1,000/mo at 9% for 20 years (+3% return)
      const planA = { principal: 50000, rate: 6, years: 20, contribution: 1000 };
      const planB = { principal: 50000, rate: 9, years: 20, contribution: 1000 };

      const result = compareCompoundInterest(planA, planB);

      // Contributions are identical
      expect(result.diffContributions).toBe(0);
      expect(result.scenarioA.totalContributions).toBe(result.scenarioB.totalContributions);

      // Plan B wealth is significantly higher
      expect(result.diffFutureValue).toBeGreaterThan(250000);
      expect(result.diffInterest).toBe(result.diffFutureValue);
      expect(result.gainPercentage).toBeGreaterThan(40);
    });

    it('should calculate impact of increasing monthly contributions', () => {
      // Plan A: 10,000 initial + 500/mo at 7% for 15 years
      // Plan B: 10,000 initial + 1,000/mo at 7% for 15 years (+$500/mo)
      const planA = { principal: 10000, rate: 7, years: 15, contribution: 500 };
      const planB = { principal: 10000, rate: 7, years: 15, contribution: 1000 };

      const result = compareCompoundInterest(planA, planB);

      // Out-of-pocket deposits difference: 500 * 12 * 15 = 90,000
      expect(result.diffContributions).toBe(90000);

      // Future value difference is much larger than 90,000 due to compound interest on extra deposits
      expect(result.diffFutureValue).toBeGreaterThan(150000);
      expect(result.diffInterest).toBeGreaterThan(60000);
      expect(result.gainPercentage).toBeGreaterThan(80);
    });

    it('should evaluate impact of extending the investment time horizon', () => {
      // Plan A: 20,000 initial + 800/mo at 8% for 15 years
      // Plan B: 20,000 initial + 800/mo at 8% for 25 years (+10 years)
      const planA = { principal: 20000, rate: 8, years: 15, contribution: 800 };
      const planB = { principal: 20000, rate: 8, years: 25, contribution: 800 };

      const result = compareCompoundInterest(planA, planB);

      expect(result.diffFutureValue).toBeGreaterThan(400000);
      expect(result.gainPercentage).toBeGreaterThan(100);
    });

    it('should handle zero interest rate or zero deposit plans gracefully', () => {
      const zeroRatePlan = { principal: 5000, rate: 0, years: 5, contribution: 100 };
      const positiveRatePlan = { principal: 5000, rate: 5, years: 5, contribution: 100 };

      const result = compareCompoundInterest(zeroRatePlan, positiveRatePlan);

      expect(result.scenarioA.totalInterest).toBe(0);
      expect(result.scenarioB.totalInterest).toBeGreaterThan(0);
      expect(result.diffContributions).toBe(0);
      expect(result.diffFutureValue).toBeGreaterThan(0);
    });
  });
});
