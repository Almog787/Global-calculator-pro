import { describe, it, expect } from 'vitest';
import {
  calculateMortgage,
  calculateCompoundInterest,
  calculateDebtSnowball,
  calculateReverseMortgage,
  calculateTargetSavings,
  calculateGrossFromNet,
  generateMortgageAmortizationSchedule,
  calculateStockOptionsRsu,
  calculatePurchaseTax,
  calculateAppreciationTax,
  calculateEmployerCost
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

  describe('calculateStockOptionsRsu', () => {
    it('should calculate 4-year vesting schedule with 1-year cliff accurately', () => {
      // 10,000 options, 18 months elapsed -> 37.5% vested = 3,750 shares
      const result = calculateStockOptionsRsu({
        grantType: 'options',
        quantity: 10000,
        strikePrice: 2,
        currentPrice: 10,
        exitPrice: 25,
        vestingYears: 4,
        cliffMonths: 12,
        monthsElapsed: 18,
        dilutionPercent: 10,
        taxRoute: 'section102_capital'
      });

      expect(result.totalShares).toBe(10000);
      expect(result.vestedShares).toBe(3750);
      expect(result.unvestedShares).toBe(6250);
      expect(result.vestedPercent).toBe(37.5);
      // current gain per share = 10 - 2 = 8. Gross = 3750 * 8 = 30,000
      expect(result.grossProceedsCurrent).toBe(30000);
      // tax @ 25% = 7,500. Net = 22,500
      expect(result.taxEstimatedCurrent).toBe(7500);
      expect(result.netProceedsCurrent).toBe(22500);
      // exit: effective price with 10% dilution = 22.5
      expect(result.effectiveExitPrice).toBe(22.5);
      expect(result.exitScenarios.length).toBe(7);
    });

    it('should return 0 vested shares before 12-month cliff', () => {
      const result = calculateStockOptionsRsu({
        grantType: 'options',
        quantity: 10000,
        strikePrice: 1,
        currentPrice: 10,
        exitPrice: 20,
        vestingYears: 4,
        cliffMonths: 12,
        monthsElapsed: 11,
        dilutionPercent: 0,
        taxRoute: 'section102_capital'
      });
      expect(result.vestedShares).toBe(0);
      expect(result.grossProceedsCurrent).toBe(0);
    });

    it('should calculate RSUs with 0 strike price correctly', () => {
      const result = calculateStockOptionsRsu({
        grantType: 'rsu',
        quantity: 1000,
        strikePrice: 50, // Should be ignored/0 for RSU
        currentPrice: 100,
        exitPrice: 150,
        vestingYears: 4,
        cliffMonths: 12,
        monthsElapsed: 48,
        dilutionPercent: 0,
        taxRoute: 'section102_capital'
      });
      expect(result.vestedShares).toBe(1000);
      expect(result.exerciseCostTotal).toBe(0);
      expect(result.grossProceedsCurrent).toBe(100000);
    });
  });

  describe('calculatePurchaseTax (Real Estate 2026)', () => {
    it('should calculate 0 tax for single home under first bracket (1,978,745 NIS)', () => {
      const result = calculatePurchaseTax(1800000, 'single_home');
      expect(result.totalTax).toBe(0);
      expect(result.effectiveTaxRate).toBe(0);
    });

    it('should calculate tiered tax for luxury single home', () => {
      // 3,000,000 NIS single home
      // 0 to 1,978,745: 0
      // 1,978,745 to 2,347,040 (368,295 * 3.5% = 12,890.325)
      // 2,347,040 to 3,000,000 (652,960 * 5% = 32,648)
      // Total tax = ~45,538 NIS
      const result = calculatePurchaseTax(3000000, 'single_home');
      expect(result.totalTax).toBeCloseTo(45538, -1);
      expect(result.effectiveTaxRate).toBeCloseTo(1.52, 1);
      expect(result.brackets.length).toBe(3);
    });

    it('should calculate 8% tax for additional investor home up to bracket limit', () => {
      // 2,000,000 NIS investor home -> 2,000,000 * 8% = 160,000 NIS
      const result = calculatePurchaseTax(2000000, 'additional_home');
      expect(result.totalTax).toBe(160000);
      expect(result.effectiveTaxRate).toBe(8);
    });
  });

  describe('calculateAppreciationTax (Real Estate 2026)', () => {
    it('should grant full exemption for qualifying single home below ceiling', () => {
      const result = calculateAppreciationTax({
        purchasePrice: 1500000,
        sellingPrice: 3200000,
        purchaseYear: 2015,
        sellingYear: 2026,
        isSingleHomeExempt: true
      });
      expect(result.isExempt).toBe(true);
      expect(result.totalTax).toBe(0);
      expect(result.netProfit).toBe(1700000);
    });

    it('should calculate linear tax after 2014 with deductible expenses', () => {
      // Bought in 2006 for 1,000,000, sold in 2026 for 3,000,000 (20 years)
      // Deductions: 200,000. Net appreciation = 1,800,000
      // 2014 to 2026 = 12 years out of 20 = 60%
      // Taxable = 1,800,000 * 60% = 1,080,000
      // Tax @ 25% = 270,000 NIS
      const result = calculateAppreciationTax({
        purchasePrice: 1000000,
        sellingPrice: 3000000,
        purchaseYear: 2006,
        sellingYear: 2026,
        isSingleHomeExempt: false,
        renovationExpenses: 150000,
        lawyerAndAgentFees: 50000
      });

      expect(result.totalDeductions).toBe(200000);
      expect(result.netAppreciation).toBe(1800000);
      expect(result.linearAfter2014Fraction).toBe(0.6);
      expect(result.totalTax).toBe(270000);
      expect(result.netProfit).toBe(1530000);
    });
  });

  describe('calculateEmployerCost', () => {
    it('should calculate total employer cost and net salary breakdown for 20,000 NIS gross', () => {
      const result = calculateEmployerCost({
        grossSalary: 20000,
        creditPoints: 2.25,
        pensionEmployerPercent: 6.5,
        severancePercent: 8.33,
        studyFundEmployerPercent: 7.5,
        studyFundEmployeePercent: 2.5,
        recuperationMonthly: 180,
        wellnessAndPerks: 500
      });

      expect(result.grossSalary).toBe(20000);
      expect(result.employerPension).toBe(1300); // 6.5% of 20,000
      expect(result.employerSeverance).toBe(1666); // 8.33% of 20,000
      expect(result.employerStudyFund).toBe(1178); // 7.5% of 15,712
      expect(result.totalEmployerCost).toBeGreaterThan(25000);
      expect(result.costToNetMultiplier).toBeGreaterThan(1.5);
      expect(result.netSalary).toBeGreaterThan(13000);
      expect(result.netSalary).toBeLessThan(16000);
    });
  });
});
