import Decimal from 'decimal.js';

export interface HouseholdBudgetInput {
  monthlyIncome: number;
  housing: number;
  groceries: number;
  utilities: number;
  transportation: number;
  savings: number;
}

export type BudgetStatus = 'surplus' | 'tight' | 'balanced' | 'deficit' | 'empty';

export type BudgetCategoryId =
  | 'housing'
  | 'groceries'
  | 'utilities'
  | 'transportation'
  | 'savings'
  | 'remaining';

export interface BudgetSlice {
  id: BudgetCategoryId;
  value: number;
  percentOfIncome: number;
  percentOfChart: number;
  color: string;
}

export interface Benchmark503020 {
  needsTarget50: number;
  wantsTarget30: number;
  savingsTarget20: number;
  actualNeedsPercent: number;
  actualSavingsPercent: number;
  actualFreeCashPercent: number;
}

export interface HouseholdBudgetResult {
  monthlyIncome: number;
  housing: number;
  groceries: number;
  utilities: number;
  transportation: number;
  savings: number;
  totalLivingExpenses: number;
  totalAllocated: number;
  remainingBalance: number;
  surplusAmount: number;
  deficitAmount: number;
  expenseSharePercent: number;
  savingsRatePercent: number;
  remainingSharePercent: number;
  allocationPercent: number;
  categoryShares: Record<BudgetCategoryId, number>;
  status: BudgetStatus;
  benchmark503020: Benchmark503020;
  chartSlices: BudgetSlice[];
}

export const BUDGET_SLICE_COLORS: Record<BudgetCategoryId, string> = {
  housing: '#0f766e',
  groceries: '#0284c7',
  utilities: '#d97706',
  transportation: '#6366f1',
  savings: '#10b981',
  remaining: '#94a3b8',
};

function sanitizeNonNegative(value: unknown): Decimal {
  if (typeof value === 'number') {
    if (!Number.isFinite(value) || value < 0) return new Decimal(0);
    return new Decimal(value);
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed >= 0) {
      return new Decimal(parsed);
    }
  }
  return new Decimal(0);
}

function roundTwo(d: Decimal): number {
  return d.isFinite() ? Number(d.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber()) : 0;
}

function roundOne(d: Decimal): number {
  return d.isFinite() ? Number(d.toDecimalPlaces(1, Decimal.ROUND_HALF_UP).toNumber()) : 0;
}

export function calculateHouseholdBudget(input: Partial<HouseholdBudgetInput> = {}): HouseholdBudgetResult {
  const income = sanitizeNonNegative(input.monthlyIncome);
  const housing = sanitizeNonNegative(input.housing);
  const groceries = sanitizeNonNegative(input.groceries);
  const utilities = sanitizeNonNegative(input.utilities);
  const transportation = sanitizeNonNegative(input.transportation);
  const savings = sanitizeNonNegative(input.savings);

  const totalLivingExpenses = housing.add(groceries).add(utilities).add(transportation);
  const totalAllocated = totalLivingExpenses.add(savings);
  const remainingBalance = income.sub(totalAllocated);

  const surplusAmount = Decimal.max(0, remainingBalance);
  const deficitAmount = Decimal.max(0, remainingBalance.neg());

  const pctOfIncome = (part: Decimal): number => {
    if (income.lte(0)) return 0;
    return roundOne(part.div(income).mul(100));
  };

  const expenseSharePercent = pctOfIncome(totalLivingExpenses);
  const savingsRatePercent = pctOfIncome(savings);
  const remainingSharePercent = income.gt(0)
    ? roundOne(remainingBalance.div(income).mul(100))
    : 0;
  const allocationPercent = pctOfIncome(totalAllocated);

  const categoryShares: Record<BudgetCategoryId, number> = {
    housing: pctOfIncome(housing),
    groceries: pctOfIncome(groceries),
    utilities: pctOfIncome(utilities),
    transportation: pctOfIncome(transportation),
    savings: savingsRatePercent,
    remaining: pctOfIncome(surplusAmount),
  };

  let status: BudgetStatus = 'surplus';
  if (income.isZero() && totalAllocated.isZero()) {
    status = 'empty';
  } else if (remainingBalance.lt(0)) {
    status = 'deficit';
  } else if (remainingBalance.isZero()) {
    status = 'balanced';
  } else if (income.gt(0) && remainingBalance.div(income).lt(0.05)) {
    status = 'tight';
  }

  const benchmark503020: Benchmark503020 = {
    needsTarget50: roundTwo(income.mul(0.5)),
    wantsTarget30: roundTwo(income.mul(0.3)),
    savingsTarget20: roundTwo(income.mul(0.2)),
    actualNeedsPercent: expenseSharePercent,
    actualSavingsPercent: savingsRatePercent,
    actualFreeCashPercent: pctOfIncome(surplusAmount),
  };

  const rawEntries: Array<{ id: BudgetCategoryId; amount: Decimal }> = [
    { id: 'housing', amount: housing },
    { id: 'groceries', amount: groceries },
    { id: 'utilities', amount: utilities },
    { id: 'transportation', amount: transportation },
    { id: 'savings', amount: savings },
  ];

  if (surplusAmount.gt(0)) {
    rawEntries.push({ id: 'remaining', amount: surplusAmount });
  }

  const positiveEntries = rawEntries.filter((entry) => entry.amount.gt(0));
  const chartTotal = positiveEntries.reduce((acc, entry) => acc.add(entry.amount), new Decimal(0));

  const chartSlices: BudgetSlice[] = positiveEntries.map((entry) => ({
    id: entry.id,
    value: roundTwo(entry.amount),
    percentOfIncome: categoryShares[entry.id],
    percentOfChart: chartTotal.gt(0) ? roundOne(entry.amount.div(chartTotal).mul(100)) : 0,
    color: BUDGET_SLICE_COLORS[entry.id],
  }));

  return {
    monthlyIncome: roundTwo(income),
    housing: roundTwo(housing),
    groceries: roundTwo(groceries),
    utilities: roundTwo(utilities),
    transportation: roundTwo(transportation),
    savings: roundTwo(savings),
    totalLivingExpenses: roundTwo(totalLivingExpenses),
    totalAllocated: roundTwo(totalAllocated),
    remainingBalance: roundTwo(remainingBalance),
    surplusAmount: roundTwo(surplusAmount),
    deficitAmount: roundTwo(deficitAmount),
    expenseSharePercent,
    savingsRatePercent,
    remainingSharePercent,
    allocationPercent,
    categoryShares,
    status,
    benchmark503020,
    chartSlices,
  };
}
