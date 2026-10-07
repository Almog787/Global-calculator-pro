import { describe, it, expect } from 'vitest';
import { calculateCarFinanceComparison } from './carFinance';

describe('Car Finance vs Lease vs Cash Engine', () => {
  it('should calculate loan monthly payment and interest correctly', () => {
    const res = calculateCarFinanceComparison({
      vehiclePrice: 40000,
      downPayment: 5000,
      loanTermMonths: 48,
      loanInterestRateAnnual: 6,
      salesTaxPercent: 0,
      feesAndRegistration: 0,
      leaseTermMonths: 36,
      leaseMoneyFactorOrApr: 4.5,
      leaseDownPayment: 2500,
      leaseResidualPercent: 55,
      leaseDispositionFee: 350,
      leaseAcquisitionFee: 650,
      investmentReturnRateAnnual: 5,
      annualDepreciationRate: 15,
    });

    expect(res.finance.monthlyPayment).toBeGreaterThan(700);
    expect(res.finance.monthlyPayment).toBeLessThan(900);
    expect(res.finance.totalInterestOrFinanceCharges).toBeGreaterThan(3000);
    expect(res.lease.monthlyPayment).toBeGreaterThan(300);
    expect(res.lease.monthlyPayment).toBeLessThan(700);
    expect(res.amortizationSchedule.length).toBe(48);
  });

  it('handles zero down payment and zero interest gracefully', () => {
    const res = calculateCarFinanceComparison({
      vehiclePrice: 30000,
      downPayment: 0,
      loanTermMonths: 60,
      loanInterestRateAnnual: 0,
      salesTaxPercent: 0,
      feesAndRegistration: 0,
      leaseTermMonths: 36,
      leaseMoneyFactorOrApr: 0,
      leaseDownPayment: 0,
      leaseResidualPercent: 50,
      leaseDispositionFee: 0,
      leaseAcquisitionFee: 0,
      investmentReturnRateAnnual: 0,
      annualDepreciationRate: 10,
    });

    expect(res.finance.monthlyPayment).toBe(500); // 30,000 / 60
    expect(res.finance.totalInterestOrFinanceCharges).toBe(0);
    expect(res.cash.monthlyPayment).toBe(0);
  });
});
