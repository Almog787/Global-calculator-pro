import { describe, it, expect } from 'vitest';
import { calculateHouseholdBudget } from './householdBudget';

describe('calculateHouseholdBudget', () => {
  it('computes total expenses, total allocated, remaining surplus, and category shares accurately', () => {
    const result = calculateHouseholdBudget({
      monthlyIncome: 10000,
      housing: 3000,
      groceries: 1200,
      utilities: 500,
      transportation: 800,
      savings: 2000,
    });

    expect(result.totalLivingExpenses).toBe(5500);
    expect(result.totalAllocated).toBe(7500);
    expect(result.remainingBalance).toBe(2500);
    expect(result.surplusAmount).toBe(2500);
    expect(result.deficitAmount).toBe(0);
    expect(result.expenseSharePercent).toBe(55);
    expect(result.savingsRatePercent).toBe(20);
    expect(result.remainingSharePercent).toBe(25);
    expect(result.allocationPercent).toBe(75);
    expect(result.status).toBe('surplus');
    expect(result.categoryShares).toEqual({
      housing: 30,
      groceries: 12,
      utilities: 5,
      transportation: 8,
      savings: 20,
      remaining: 25,
    });
    expect(result.chartSlices).toHaveLength(6);
    expect(result.benchmark503020).toEqual({
      needsTarget50: 5000,
      wantsTarget30: 3000,
      savingsTarget20: 2000,
      actualNeedsPercent: 55,
      actualSavingsPercent: 20,
      actualFreeCashPercent: 25,
    });
  });

  it('detects monthly deficit when expenses and savings exceed income', () => {
    const result = calculateHouseholdBudget({
      monthlyIncome: 6000,
      housing: 3200,
      groceries: 1400,
      utilities: 600,
      transportation: 700,
      savings: 600,
    });

    expect(result.totalLivingExpenses).toBe(5900);
    expect(result.totalAllocated).toBe(6500);
    expect(result.remainingBalance).toBe(-500);
    expect(result.surplusAmount).toBe(0);
    expect(result.deficitAmount).toBe(500);
    expect(result.status).toBe('deficit');
    expect(result.chartSlices.some((s) => s.id === 'remaining')).toBe(false);
    expect(result.chartSlices).toHaveLength(5);
  });

  it('detects balanced zero-remaining and tight-margin budgets', () => {
    const balanced = calculateHouseholdBudget({
      monthlyIncome: 5000,
      housing: 2000,
      groceries: 1000,
      utilities: 500,
      transportation: 500,
      savings: 1000,
    });
    expect(balanced.remainingBalance).toBe(0);
    expect(balanced.status).toBe('balanced');

    const tight = calculateHouseholdBudget({
      monthlyIncome: 5000,
      housing: 2000,
      groceries: 1000,
      utilities: 500,
      transportation: 400,
      savings: 1000,
    });
    expect(tight.remainingBalance).toBe(100);
    expect(tight.remainingSharePercent).toBe(2);
    expect(tight.status).toBe('tight');
  });

  it('preserves Decimal.js floating-point accuracy on decimal amounts', () => {
    const result = calculateHouseholdBudget({
      monthlyIncome: 4500.3,
      housing: 1500.1,
      groceries: 600.2,
      utilities: 250.15,
      transportation: 300.05,
      savings: 849.8,
    });

    expect(result.totalLivingExpenses).toBe(2650.5);
    expect(result.totalAllocated).toBe(3500.3);
    expect(result.remainingBalance).toBe(1000);
  });

  it('handles zero, negative, NaN, and undefined inputs gracefully without throwing', () => {
    const empty = calculateHouseholdBudget({
      monthlyIncome: 0,
      housing: 0,
      groceries: 0,
      utilities: 0,
      transportation: 0,
      savings: 0,
    });
    expect(empty.status).toBe('empty');
    expect(empty.chartSlices).toHaveLength(0);

    const invalid = calculateHouseholdBudget({
      monthlyIncome: Number.NaN,
      housing: -500,
      groceries: Number.POSITIVE_INFINITY,
      utilities: 200,
      transportation: undefined,
      savings: -10,
    });
    expect(invalid.monthlyIncome).toBe(0);
    expect(invalid.housing).toBe(0);
    expect(invalid.groceries).toBe(0);
    expect(invalid.utilities).toBe(200);
    expect(invalid.remainingBalance).toBe(-200);
    expect(invalid.status).toBe('deficit');
  });
});
