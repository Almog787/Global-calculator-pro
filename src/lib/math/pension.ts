import Decimal from 'decimal.js';

export interface RetirementCalculationOptions {
  currentAge: number;
  retirementAge: number;
  currentBalance: number;
  monthlySalary: number;
  contributionRatePercent: number; // e.g. 20.83% (6% employee + 6.5% employer pension + 8.33% severance)
  expectedAnnualReturnPercent: number; // e.g. 6.0%
  accumulationFeePercent: number; // e.g. 0.2% annual fee on total assets
  depositFeePercent: number; // e.g. 1.5% fee on each monthly deposit
  annuityConversionFactor: number; // e.g. 200 (מקדם קצבה)
  annualInflationPercent?: number; // e.g. 2.5%
}

export interface YearPensionProjection {
  yearIndex: number;
  age: number;
  startingBalance: number;
  annualContribution: number;
  annualFees: number;
  annualReturn: number;
  endingBalance: number;
  realEndingBalance: number;
}

export interface RetirementCalculationResult {
  totalAccumulatedNominal: number;
  totalAccumulatedReal: number;
  monthlyPensionGross: number;
  totalContributions: number;
  totalReturns: number;
  totalFeesPaid: number;
  yearlyBreakdown: YearPensionProjection[];
}

export function calculateRetirementPlan(options: RetirementCalculationOptions): RetirementCalculationResult {
  const currentAge = Math.max(18, Math.min(100, Math.floor(options.currentAge || 30)));
  const retirementAge = Math.max(currentAge + 1, Math.min(100, Math.floor(options.retirementAge || 67)));
  const yearsToRetirement = retirementAge - currentAge;

  const currentBal = new Decimal(Math.max(0, options.currentBalance || 0));
  const monthlySal = new Decimal(Math.max(0, options.monthlySalary || 0));
  const contribRate = new Decimal(Math.max(0, options.contributionRatePercent || 0)).div(100);
  const annualReturnRate = new Decimal(Math.max(0, options.expectedAnnualReturnPercent || 0)).div(100);
  const accumFeeRate = new Decimal(Math.max(0, options.accumulationFeePercent || 0)).div(100);
  const depositFeeRate = new Decimal(Math.max(0, options.depositFeePercent || 0)).div(100);
  const conversionFactor = new Decimal(Math.max(50, options.annuityConversionFactor || 200));
  const inflationRate = new Decimal(Math.max(0, options.annualInflationPercent ?? 2.5)).div(100);

  // Monthly deposit after deposit fee
  const grossMonthlyDeposit = monthlySal.mul(contribRate);
  const netMonthlyDeposit = grossMonthlyDeposit.mul(new Decimal(1).sub(depositFeeRate));

  // Net annual growth rate factoring in accumulation fee
  // (1 + r_net) = (1 + r_gross) * (1 - fee_accum)
  const netAnnualGrowthFactor = new Decimal(1).add(annualReturnRate).mul(new Decimal(1).sub(accumFeeRate)).sub(1);

  let runningBalance = currentBal;
  let cumulativeGrossContributions = new Decimal(0);
  let cumulativeFees = new Decimal(0);
  let cumulativeReturns = new Decimal(0);

  const breakdown: YearPensionProjection[] = [];

  for (let y = 1; y <= yearsToRetirement; y++) {
    const ageAtYear = currentAge + y;
    const startBal = runningBalance;

    // Monthly compound simulation for the year
    let yearDepositSum = new Decimal(0);
    let yearFeeSum = new Decimal(0);
    let yearReturnSum = new Decimal(0);

    const monthlyGrossReturnRate = annualReturnRate.div(12);
    const monthlyAccumFeeRate = accumFeeRate.div(12);

    for (let m = 1; m <= 12; m++) {
      const depositFee = grossMonthlyDeposit.mul(depositFeeRate);
      const netDeposit = grossMonthlyDeposit.sub(depositFee);
      yearFeeSum = yearFeeSum.add(depositFee);
      yearDepositSum = yearDepositSum.add(grossMonthlyDeposit);

      // Add deposit to balance
      runningBalance = runningBalance.add(netDeposit);

      // Calculate investment return
      const monthlyReturn = runningBalance.mul(monthlyGrossReturnRate);
      yearReturnSum = yearReturnSum.add(monthlyReturn);

      // Deduct accumulation fee
      const accumFee = runningBalance.mul(monthlyAccumFeeRate);
      yearFeeSum = yearFeeSum.add(accumFee);

      // Update balance
      runningBalance = runningBalance.add(monthlyReturn).sub(accumFee);
    }

    cumulativeGrossContributions = cumulativeGrossContributions.add(yearDepositSum);
    cumulativeFees = cumulativeFees.add(yearFeeSum);
    cumulativeReturns = cumulativeReturns.add(yearReturnSum);

    // Inflation discounting for real value
    const inflationDiscount = new Decimal(1).add(inflationRate).pow(y);
    const realEndingBal = runningBalance.div(inflationDiscount);

    breakdown.push({
      yearIndex: y,
      age: ageAtYear,
      startingBalance: startBal.toNumber(),
      annualContribution: yearDepositSum.toNumber(),
      annualFees: yearFeeSum.toNumber(),
      annualReturn: yearReturnSum.toNumber(),
      endingBalance: runningBalance.toNumber(),
      realEndingBalance: realEndingBal.toNumber(),
    });
  }

  const totalNominal = runningBalance;
  const inflationTotalDiscount = new Decimal(1).add(inflationRate).pow(yearsToRetirement);
  const totalReal = totalNominal.div(inflationTotalDiscount);

  // Monthly Pension = Total Capital / Annuity Conversion Factor
  const monthlyPension = totalNominal.div(conversionFactor);

  return {
    totalAccumulatedNominal: Math.round(totalNominal.toNumber()),
    totalAccumulatedReal: Math.round(totalReal.toNumber()),
    monthlyPensionGross: Math.round(monthlyPension.toNumber()),
    totalContributions: Math.round(cumulativeGrossContributions.toNumber()),
    totalReturns: Math.round(cumulativeReturns.toNumber()),
    totalFeesPaid: Math.round(cumulativeFees.toNumber()),
    yearlyBreakdown: breakdown,
  };
}
