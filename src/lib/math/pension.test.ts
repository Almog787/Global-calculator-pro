import { describe, it, expect } from 'vitest';
import { calculateRetirementPlan } from './pension';
import { calculateCapitalGains } from './capitalGains';

describe('Pension & Retirement Engine Tests', () => {
  it('should calculate standard pension accumulation and monthly benefit accurately', () => {
    const result = calculateRetirementPlan({
      currentAge: 30,
      retirementAge: 67,
      currentBalance: 50000,
      monthlySalary: 15000,
      contributionRatePercent: 20.83,
      expectedAnnualReturnPercent: 6,
      accumulationFeePercent: 0.2,
      depositFeePercent: 1.5,
      annuityConversionFactor: 200,
      annualInflationPercent: 2.5,
    });

    expect(result.totalAccumulatedNominal).toBeGreaterThan(1000000);
    expect(result.monthlyPensionGross).toBeGreaterThan(5000);
    expect(result.yearlyBreakdown.length).toBe(37); // 67 - 30
    expect(result.totalFeesPaid).toBeGreaterThan(0);
    expect(result.totalContributions).toBeGreaterThan(0);
  });

  it('should handle zero starting balance and zero salary gracefully without NaN', () => {
    const result = calculateRetirementPlan({
      currentAge: 40,
      retirementAge: 67,
      currentBalance: 0,
      monthlySalary: 0,
      contributionRatePercent: 0,
      expectedAnnualReturnPercent: 5,
      accumulationFeePercent: 0.2,
      depositFeePercent: 1,
      annuityConversionFactor: 200,
    });

    expect(result.totalAccumulatedNominal).toBe(0);
    expect(result.monthlyPensionGross).toBe(0);
    expect(Number.isNaN(result.totalAccumulatedNominal)).toBe(false);
  });
});

describe('Capital Gains Tax Engine Tests', () => {
  it('should calculate 25% real tax on inflation-adjusted capital gains', () => {
    const result = calculateCapitalGains({
      buyAmount: 100000,
      sellAmount: 150000,
      totalInflationPercent: 10, // 10% inflation -> adjusted basis 110,000
      lossCarryforward: 0,
      taxRatePercent: 25,
      isNominalOnly: false,
    });

    expect(result.nominalGain).toBe(50000);
    expect(result.adjustedBasis).toBe(110000);
    expect(result.inflationGain).toBe(10000); // 10k tax free
    expect(result.realGain).toBe(40000); // 40k taxable
    expect(result.taxDue).toBe(10000); // 25% of 40k = 10,000
    expect(result.netProfitAfterTax).toBe(40000);
    expect(result.effectiveTaxRatePercent).toBe(20); // 10k tax on 50k nominal = 20%
  });

  it('should apply past loss carryforward to reduce taxable gain', () => {
    const result = calculateCapitalGains({
      buyAmount: 100000,
      sellAmount: 150000,
      totalInflationPercent: 10,
      lossCarryforward: 15000,
      taxRatePercent: 25,
    });

    expect(result.realGain).toBe(40000);
    expect(result.lossOffsetApplied).toBe(15000);
    expect(result.taxableGainAfterOffset).toBe(25000);
    expect(result.taxDue).toBe(6250); // 25% of 25k
  });

  it('should handle capital losses with 0 tax due', () => {
    const result = calculateCapitalGains({
      buyAmount: 100000,
      sellAmount: 80000,
      totalInflationPercent: 5,
    });

    expect(result.nominalGain).toBe(-20000);
    expect(result.taxDue).toBe(0);
    expect(result.netProfitAfterTax).toBe(-20000);
  });
});
