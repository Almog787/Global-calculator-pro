import { describe, it, expect } from 'vitest';
import {
  calculateMortgage,
  generateMortgageAmortizationSchedule,
  calculateCompoundInterest,
  calculateTargetSavings,
  calculateGrossFromNet,
  calculateStockOptionsRsu,
  calculatePurchaseTax,
  calculateAppreciationTax,
  calculateEmployerCost,
  calculateDebtSnowball,
  type DebtItem,
} from './finance';
import { calculateBmi, calculateBmr } from './health';
import {
  calculateCapRate,
  calculateMargin,
  calculateBreakEven,
  calculateAutoLoan,
  calculateCreditCardPayoff,
  calculateRoi,
  calculateRefinance,
  calculateVat,
  calculateTip,
  calculateFuelSplit,
  calculateDownloadTime,
  calculateWaterIntake,
  calculateSleepCycles,
} from './allCalculators';

describe('Phase 2: Mathematical Fuzzing & Boundary Edge Cases Suite', () => {
  describe('Mortgage & Amortization Fuzzing', () => {
    it('should never throw, crash, or produce NaN across 200 random mortgage inputs', () => {
      for (let i = 0; i < 200; i++) {
        const principal = (Math.random() - 0.1) * 20000000;
        const rate = (Math.random() - 0.05) * 30;
        const years = Math.floor((Math.random() - 0.1) * 45);

        const res = calculateMortgage(principal, rate, years);
        expect(Number.isFinite(res.monthlyPayment)).toBe(true);
        expect(Number.isFinite(res.totalInterest)).toBe(true);
        expect(res.monthlyPayment).toBeGreaterThanOrEqual(0);
        expect(res.totalInterest).toBeGreaterThanOrEqual(0);

        const schedule = generateMortgageAmortizationSchedule(principal, rate, years, 120);
        expect(Array.isArray(schedule)).toBe(true);
        if (schedule.length > 0) {
          schedule.forEach(row => {
            expect(Number.isFinite(row.payment)).toBe(true);
            expect(Number.isFinite(row.balance)).toBe(true);
            expect(row.balance).toBeGreaterThanOrEqual(0);
          });
        }
      }
    });

    it('should handle zero interest rate (0% loan) accurately', () => {
      const res = calculateMortgage(120000, 0, 10);
      expect(res.monthlyPayment).toBe(1000);
      expect(res.totalInterest).toBe(0);

      const schedule = generateMortgageAmortizationSchedule(120000, 0, 10);
      expect(schedule.length).toBe(120);
      expect(schedule[0].payment).toBe(1000);
      expect(schedule[0].interest).toBe(0);
      expect(schedule[119].balance).toBe(0);
    });

    it('should handle extreme numbers up to 100 billion without numeric overflow', () => {
      const res = calculateMortgage(100_000_000_000, 4.5, 30);
      expect(res.monthlyPayment).toBeGreaterThan(0);
      expect(Number.isFinite(res.monthlyPayment)).toBe(true);
      expect(Number.isFinite(res.totalInterest)).toBe(true);
    });
  });

  describe('Compound Interest & Savings Fuzzing', () => {
    it('should satisfy monotonic growth across random compound iterations', () => {
      for (let i = 0; i < 150; i++) {
        const principal = Math.random() * 500000;
        const rate = Math.random() * 20;
        const years = Math.floor(Math.random() * 30) + 1;
        const monthly = Math.random() * 5000;

        const res = calculateCompoundInterest(principal, rate, years, monthly);
        expect(Number.isFinite(res.futureValue)).toBe(true);
        expect(Number.isFinite(res.totalContributions)).toBe(true);
        expect(Number.isFinite(res.totalInterest)).toBe(true);
        expect(res.futureValue).toBeGreaterThanOrEqual(res.totalContributions - 0.01);
      }
    });

    it('should handle target savings with 0 rate and zero initial deposit', () => {
      const res = calculateTargetSavings(120000, 0, 10, 0);
      expect(res.requiredMonthlyContribution).toBe(1000);
      expect(res.totalSaved).toBe(120000);
      expect(res.totalInterest).toBe(0);
    });
  });

  describe('Startup Stock Options & RSU Fuzzing', () => {
    it('should keep vesting percentages strictly in [0, 100] across fuzz tests', () => {
      for (let i = 0; i < 150; i++) {
        const shares = Math.floor(Math.random() * 100000);
        const strike = Math.random() * 50;
        const current = Math.random() * 100;
        const monthsElapsed = Math.floor(Math.random() * 72);
        const cliff = Math.floor(Math.random() * 24);

        const res = calculateStockOptionsRsu({
          grantType: i % 2 === 0 ? 'options' : 'rsu',
          quantity: shares,
          strikePrice: strike,
          currentPrice: current,
          exitPrice: current * 1.5,
          vestingYears: 4,
          cliffMonths: cliff,
          monthsElapsed,
          dilutionPercent: Math.random() * 40,
          taxRoute: 'section102_capital',
        });

        expect(res.vestedPercent).toBeGreaterThanOrEqual(0);
        expect(res.vestedPercent).toBeLessThanOrEqual(100);
        expect(res.vestedShares + res.unvestedShares).toBe(res.totalShares);
        expect(res.netProceedsCurrent).toBeLessThanOrEqual(res.grossProceedsCurrent);
      }
    });
  });

  describe('Israeli Purchase & Linear Appreciation Tax Fuzzing', () => {
    it('should calculate purchase tax progressive brackets properly without discontinuities', () => {
      const prices = [0, 1000000, 1978745, 2347040, 5000000, 15000000, 50000000];
      for (const p of prices) {
        const resSingle = calculatePurchaseTax(p, 'single_home');
        const resInvestor = calculatePurchaseTax(p, 'additional_home');

        expect(resSingle.totalTax).toBeGreaterThanOrEqual(0);
        expect(resInvestor.totalTax).toBeGreaterThanOrEqual(resSingle.totalTax);
        expect(resSingle.effectiveTaxRate).toBeLessThanOrEqual(10);
      }
    });

    it('should calculate linear appreciation tax with pre-2014 exemption fractions', () => {
      const res = calculateAppreciationTax({
        purchasePrice: 1000000,
        sellingPrice: 3000000,
        purchaseYear: 2004,
        sellingYear: 2024,
        isSingleHomeExempt: false,
        renovationExpenses: 100000,
      });

      expect(res.totalAppreciationGross).toBe(2000000);
      expect(res.netAppreciation).toBe(1900000);
      expect(res.linearAfter2014Fraction).toBe(0.5); // 10 years out of 20
      expect(res.linearBefore2014Fraction).toBe(0.5);
      expect(res.totalTax).toBe(Math.round(1900000 * 0.5 * 0.25));
    });
  });

  describe('Employer Cost vs Net Salary Fuzzing', () => {
    it('should maintain cost to net multiplier integrity across salaries', () => {
      const salaries = [0, 3000, 7500, 15000, 35000, 65000, 120000];
      for (const s of salaries) {
        const res = calculateEmployerCost({ grossSalary: s });
        expect(res.totalEmployerCost).toBeGreaterThanOrEqual(s);
        expect(res.netSalary).toBeLessThanOrEqual(s);
        expect(res.costToNetMultiplier).toBeGreaterThanOrEqual(s > 0 ? 1 : 0);
      }
    });
  });

  describe('Debt Snowball Simulation Fuzzing', () => {
    it('should pay off debts faster or equal with snowball extra payments', () => {
      const debts: DebtItem[] = [
        { id: 1, bal: 5000, rate: 18, min: 150 },
        { id: 2, bal: 12000, rate: 12, min: 300 },
        { id: 3, bal: 25000, rate: 8, min: 450 },
      ];

      const res = calculateDebtSnowball(debts, 500);
      expect(res.snowballMonths).toBeLessThanOrEqual(res.baseMonths);
      expect(res.snowballInterest).toBeLessThanOrEqual(res.baseInterest);
    });
  });

  describe('Health & Body Metric Fuzzing', () => {
    it('should classify BMI categories accurately across weight and height spectrums', () => {
      expect(calculateBmi(50, 175).status).toBe('underweight');
      expect(calculateBmi(70, 175).status).toBe('normal');
      expect(calculateBmi(85, 175).status).toBe('overweight');
      expect(calculateBmi(110, 175).status).toBe('obese');
      expect(calculateBmi(0, 0).bmi).toBe(0);
    });

    it('should calculate BMR with positive TDEE tiers across gender and equations', () => {
      const maleMifflin = calculateBmr(80, 180, 30, 'male', 'mifflin');
      const femaleHarris = calculateBmr(65, 165, 28, 'female', 'harris');

      expect(maleMifflin.bmr).toBeGreaterThan(1500);
      expect(maleMifflin.tdee.veryActive).toBeGreaterThan(maleMifflin.tdee.sedentary);
      expect(femaleHarris.bmr).toBeGreaterThan(1200);
    });
  });

  describe('Extended Financial & Utility Calculators Fuzzing', () => {
    it('should calculate Gross From Net reverse salary and ROI accurately', () => {
      const grossNet = calculateGrossFromNet(15000, 20, 6, 5);
      expect(grossNet.grossMonthly).toBeGreaterThan(15000);
      expect(grossNet.netMonthly).toBe(15000);

      const roi = calculateRoi(100000, 150000, 3, 5000);
      expect(roi.netProfit).toBe(45000);
      expect(roi.roiPercentage).toBeGreaterThan(40);
      expect(roi.annualizedRoi).toBeGreaterThan(0);
    });

    it('should calculate Cap Rate and Margin without division-by-zero crashes', () => {
      const capZero = calculateCapRate(0, 10000, 2000);
      expect(capZero.capRate).toBe(0);
      expect(capZero.noi).toBe(8000);

      const marginZero = calculateMargin(0, 0);
      expect(marginZero.grossProfit).toBe(0);
      expect(marginZero.margin).toBe(0);

      const marginNormal = calculateMargin(50, 100);
      expect(marginNormal.grossProfit).toBe(50);
      expect(marginNormal.margin).toBe(50);
      expect(marginNormal.markup).toBe(100);
    });

    it('should calculate Break-Even and Auto Loan accurately', () => {
      const be = calculateBreakEven(10000, 50, 20);
      expect(be.contributionMargin).toBe(30);
      expect(be.breakEvenUnits).toBe(334); // ceil(10000 / 30)

      const auto = calculateAutoLoan(150000, 30000, 10000, 4.5, 60);
      expect(auto.loanAmount).toBe(110000);
      expect(auto.monthlyPayment).toBeGreaterThan(0);
      expect(auto.totalCost).toBeGreaterThan(110000);
    });

    it('should handle Credit Card Payoff and Refinance scenarios', () => {
      const cc = calculateCreditCardPayoff(10000, 18, 500);
      expect(cc.monthsToPayoff).toBeGreaterThan(0);
      expect(Number.isFinite(cc.totalInterest)).toBe(true);

      const ref = calculateRefinance(1000000, 5.5, 25, 4.0, 25, 15000);
      expect(ref.monthlySavings).toBeGreaterThan(0);
      expect(ref.breakEvenMonths).toBeGreaterThan(0);
    });

    it('should calculate VAT, Tips, Fuel Split, and Downloads precisely', () => {
      const vatExcl = calculateVat(100, 18, false);
      expect(vatExcl.vatAmount).toBe(18);
      expect(vatExcl.totalAmount).toBe(118);

      const vatIncl = calculateVat(118, 18, true);
      expect(vatIncl.netAmount).toBe(100);
      expect(vatIncl.vatAmount).toBe(18);

      const tip = calculateTip(200, 15, 2);
      expect(tip.tipAmount).toBe(30);
      expect(tip.perPersonTotal).toBe(115);

      const fuel = calculateFuelSplit(300, 8, 7.5, 3);
      expect(fuel.litersNeeded).toBe(24);
      expect(fuel.totalFuelCost).toBe(180);
      expect(fuel.costPerPerson).toBe(60);

      const dl = calculateDownloadTime(1000, 100); // 1000 MB at 100 Mbps = 80s
      expect(dl.totalSeconds).toBe(80);
      expect(dl.formattedDuration).toContain('1m 20s');
    });

    it('should calculate Water Intake and Sleep Cycles seamlessly', () => {
      const water = calculateWaterIntake(70, 60, true);
      expect(water.dailyWaterLiters).toBeGreaterThan(2.5);

      const sleep = calculateSleepCycles(23, 0);
      expect(sleep.recommendedWakeTimes.length).toBe(3);
    });
  });
});
