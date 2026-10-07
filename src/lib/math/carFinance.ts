import Decimal from 'decimal.js';

export interface CarFinanceInputs {
  vehiclePrice: number;
  downPayment: number;
  loanTermMonths: number;
  loanInterestRateAnnual: number; // e.g. 5.5 for 5.5%
  salesTaxPercent: number; // e.g. 7 for 7%
  feesAndRegistration: number;
  
  // Lease specific inputs
  leaseTermMonths: number;
  leaseMoneyFactorOrApr: number; // APR % or Money Factor
  leaseDownPayment: number;
  leaseMonthlyPaymentCustom?: number; // Optional direct input
  leaseResidualPercent: number; // e.g. 55 for 55% of MSRP
  leaseDispositionFee: number;
  leaseAcquisitionFee: number;

  // Comparison parameters
  investmentReturnRateAnnual: number; // Opportunity cost on cash e.g. 6%
  annualDepreciationRate: number; // e.g. 15 for 15% annual depreciation
}

export interface ComparisonScenario {
  monthlyPayment: number;
  upfrontOutOfPocket: number;
  totalPaymentsOverTerm: number;
  totalInterestOrFinanceCharges: number;
  residualVehicleValue: number;
  netCostOfOwnership: number; // (Total paid + Upfront) - Vehicle Equity retained
  opportunityCostOfCapital: number;
}

export interface CarFinanceResult {
  finance: ComparisonScenario;
  lease: ComparisonScenario;
  cash: ComparisonScenario;
  recommendedOption: 'finance' | 'lease' | 'cash';
  recommendationReason: string;
  monthlySavingsLeaseVsFinance: number;
  netDifferenceFinanceVsLease: number;
  amortizationSchedule: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    remainingBalance: number;
    vehicleValue: number;
  }>;
}

/**
 * Calculates and compares Loan Financing vs Leasing vs Cash Purchase
 */
export function calculateCarFinanceComparison(inputs: CarFinanceInputs): CarFinanceResult {
  const price = new Decimal(Math.max(0, inputs.vehiclePrice || 0));
  const taxRate = new Decimal(Math.max(0, inputs.salesTaxPercent || 0)).dividedBy(100);
  const taxAmount = price.times(taxRate);
  const totalPurchaseCost = price.plus(taxAmount).plus(inputs.feesAndRegistration || 0);

  const termMonths = Math.max(1, inputs.loanTermMonths || 36);
  const leaseMonths = Math.max(1, inputs.leaseTermMonths || 36);
  const oppRateAnnual = new Decimal(Math.max(0, inputs.investmentReturnRateAnnual || 0)).dividedBy(100);
  const oppRateMonthly = oppRateAnnual.dividedBy(12);

  // -------------------------------------------------------------
  // 1. LOAN FINANCING
  // -------------------------------------------------------------
  const loanDown = Decimal.min(totalPurchaseCost, new Decimal(Math.max(0, inputs.downPayment || 0)));
  const loanPrincipal = totalPurchaseCost.minus(loanDown);
  const loanRateAnnual = new Decimal(Math.max(0, inputs.loanInterestRateAnnual || 0)).dividedBy(100);
  const loanRateMonthly = loanRateAnnual.dividedBy(12);

  let loanMonthlyPayment = new Decimal(0);
  if (loanPrincipal.gt(0)) {
    if (loanRateMonthly.eq(0)) {
      loanMonthlyPayment = loanPrincipal.dividedBy(termMonths);
    } else {
      const onePlusRToN = loanRateMonthly.plus(1).pow(termMonths);
      loanMonthlyPayment = loanPrincipal.times(loanRateMonthly.times(onePlusRToN)).dividedBy(onePlusRToN.minus(1));
    }
  }

  const totalLoanPayments = loanMonthlyPayment.times(termMonths);
  const totalLoanInterest = Decimal.max(0, totalLoanPayments.minus(loanPrincipal));

  // Depreciation Curve for owned car
  const annualDeprec = new Decimal(Math.max(0, inputs.annualDepreciationRate || 15)).dividedBy(100);
  const monthlyDeprecRate = new Decimal(1).minus(new Decimal(1).minus(annualDeprec).pow(new Decimal(1).dividedBy(12)));

  let currentCarValue = price;
  let remainingLoanBalance = loanPrincipal;
  const amortizationSchedule: CarFinanceResult['amortizationSchedule'] = [];

  for (let m = 1; m <= Math.max(termMonths, leaseMonths); m++) {
    let interestForMonth = new Decimal(0);
    let principalForMonth = new Decimal(0);

    if (m <= termMonths && remainingLoanBalance.gt(0)) {
      interestForMonth = remainingLoanBalance.times(loanRateMonthly);
      principalForMonth = Decimal.min(remainingLoanBalance, loanMonthlyPayment.minus(interestForMonth));
      remainingLoanBalance = Decimal.max(0, remainingLoanBalance.minus(principalForMonth));
    }

    currentCarValue = currentCarValue.times(new Decimal(1).minus(monthlyDeprecRate));

    amortizationSchedule.push({
      month: m,
      payment: m <= termMonths ? Number(loanMonthlyPayment.toFixed(2)) : 0,
      principal: Number(principalForMonth.toFixed(2)),
      interest: Number(interestForMonth.toFixed(2)),
      remainingBalance: Number(remainingLoanBalance.toFixed(2)),
      vehicleValue: Number(currentCarValue.toFixed(2)),
    });
  }

  // Vehicle residual value at comparison horizon (using leaseMonths as standard horizon)
  const horizonDeprecValue = price.times(new Decimal(1).minus(annualDeprec).pow(new Decimal(leaseMonths).dividedBy(12)));
  const loanBalanceAtHorizon = leaseMonths <= termMonths 
    ? (amortizationSchedule[leaseMonths - 1]?.remainingBalance ?? 0)
    : 0;
  const loanEquityAtHorizon = Decimal.max(0, horizonDeprecValue.minus(loanBalanceAtHorizon));

  // Opportunity cost on loan down payment
  const loanOppCost = loanDown.times(oppRateMonthly.plus(1).pow(leaseMonths).minus(1));
  const loanTotalPaidSoFar = loanDown.plus(loanMonthlyPayment.times(Math.min(termMonths, leaseMonths)));
  const netCostFinance = loanTotalPaidSoFar.plus(loanOppCost).minus(loanEquityAtHorizon);

  // -------------------------------------------------------------
  // 2. LEASE OPTION
  // -------------------------------------------------------------
  const leaseDown = new Decimal(Math.max(0, inputs.leaseDownPayment || 0));
  const leaseResidualPct = new Decimal(Math.max(0, inputs.leaseResidualPercent || 55)).dividedBy(100);
  const leaseResidualValue = price.times(leaseResidualPct);
  const leaseAcqFee = new Decimal(inputs.leaseAcquisitionFee || 0);
  const leaseDispFee = new Decimal(inputs.leaseDispositionFee || 0);

  let leaseMonthly: Decimal;
  if (inputs.leaseMonthlyPaymentCustom && inputs.leaseMonthlyPaymentCustom > 0) {
    leaseMonthly = new Decimal(inputs.leaseMonthlyPaymentCustom);
  } else {
    // Standard Lease Payment Formula: Depreciation Fee + Finance/Rent Charge
    const grossCapCost = price.plus(leaseAcqFee);
    const capCostReduction = leaseDown;
    const adjustedCapCost = Decimal.max(0, grossCapCost.minus(capCostReduction));
    const depreciationCharge = adjustedCapCost.minus(leaseResidualValue).dividedBy(leaseMonths);
    
    // Money factor is approx APR / 2400
    let moneyFactor = new Decimal(inputs.leaseMoneyFactorOrApr || 4).dividedBy(2400);
    if (inputs.leaseMoneyFactorOrApr && inputs.leaseMoneyFactorOrApr < 0.05) {
      moneyFactor = new Decimal(inputs.leaseMoneyFactorOrApr);
    }
    const financeCharge = adjustedCapCost.plus(leaseResidualValue).times(moneyFactor);
    const baseMonthlyLease = Decimal.max(0, depreciationCharge.plus(financeCharge));
    leaseMonthly = baseMonthlyLease.times(taxRate.plus(1));
  }

  const totalLeasePayments = leaseMonthly.times(leaseMonths);
  const leaseUpfrontTotal = leaseDown.plus(leaseAcqFee);
  const leaseOppCost = leaseUpfrontTotal.times(oppRateMonthly.plus(1).pow(leaseMonths).minus(1));
  const netCostLease = leaseUpfrontTotal.plus(totalLeasePayments).plus(leaseDispFee).plus(leaseOppCost);

  // -------------------------------------------------------------
  // 3. CASH PURCHASE
  // -------------------------------------------------------------
  const cashUpfront = totalPurchaseCost;
  const cashOppCost = cashUpfront.times(oppRateMonthly.plus(1).pow(leaseMonths).minus(1));
  const cashNetCost = cashUpfront.plus(cashOppCost).minus(horizonDeprecValue);

  // -------------------------------------------------------------
  // RECOMMENDATION LOGIC
  // -------------------------------------------------------------
  let recommendedOption: 'finance' | 'lease' | 'cash';
  let recommendationReason: string;

  if (netCostFinance.lte(netCostLease) && netCostFinance.lte(cashNetCost)) {
    recommendedOption = 'finance';
    recommendationReason = 'Financing provides the optimal balance of equity accumulation and lower net cost over time compared to leasing.';
  } else if (cashNetCost.lte(netCostFinance) && cashNetCost.lte(netCostLease)) {
    recommendedOption = 'cash';
    recommendationReason = 'Cash purchase eliminates all interest and finance fees, achieving the lowest overall cost of ownership.';
  } else {
    recommendedOption = 'lease';
    recommendationReason = 'Leasing keeps monthly commitments lower and shields you against depreciation risks if you upgrade every 3 years.';
  }

  return {
    finance: {
      monthlyPayment: Number(loanMonthlyPayment.toFixed(2)),
      upfrontOutOfPocket: Number(loanDown.toFixed(2)),
      totalPaymentsOverTerm: Number(totalLoanPayments.toFixed(2)),
      totalInterestOrFinanceCharges: Number(totalLoanInterest.toFixed(2)),
      residualVehicleValue: Number(horizonDeprecValue.toFixed(2)),
      netCostOfOwnership: Number(netCostFinance.toFixed(2)),
      opportunityCostOfCapital: Number(loanOppCost.toFixed(2)),
    },
    lease: {
      monthlyPayment: Number(leaseMonthly.toFixed(2)),
      upfrontOutOfPocket: Number(leaseUpfrontTotal.toFixed(2)),
      totalPaymentsOverTerm: Number(totalLeasePayments.toFixed(2)),
      totalInterestOrFinanceCharges: Number(totalLeasePayments.minus(price.minus(leaseResidualValue)).toFixed(2)),
      residualVehicleValue: 0, // No equity retained at lease end unless purchased
      netCostOfOwnership: Number(netCostLease.toFixed(2)),
      opportunityCostOfCapital: Number(leaseOppCost.toFixed(2)),
    },
    cash: {
      monthlyPayment: 0,
      upfrontOutOfPocket: Number(cashUpfront.toFixed(2)),
      totalPaymentsOverTerm: 0,
      totalInterestOrFinanceCharges: 0,
      residualVehicleValue: Number(horizonDeprecValue.toFixed(2)),
      netCostOfOwnership: Number(cashNetCost.toFixed(2)),
      opportunityCostOfCapital: Number(cashOppCost.toFixed(2)),
    },
    recommendedOption,
    recommendationReason,
    monthlySavingsLeaseVsFinance: Number(loanMonthlyPayment.minus(leaseMonthly).toFixed(2)),
    netDifferenceFinanceVsLease: Number(netCostLease.minus(netCostFinance).toFixed(2)),
    amortizationSchedule,
  };
}
