import Decimal from 'decimal.js';

export interface MortgageAmortizationRow {
  period: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  cumulativeInterest: number;
  cumulativePrincipal: number;
}

export function generateMortgageAmortizationSchedule(
  principal: number,
  annualRate: number,
  years: number,
  maxPeriods: number = 360
): MortgageAmortizationRow[] {
  try {
    const decP = new Decimal(principal || 0);
    const decR = new Decimal(annualRate || 0).div(100).div(12);
    const totalMonths = Math.min(maxPeriods, (years || 0) * 12);

    if (decP.isZero() || totalMonths === 0) return [];

    let mp = new Decimal(0);
    if (decR.isZero()) {
      mp = decP.div(totalMonths);
    } else {
      const rateFactor = decR.add(1).pow(totalMonths);
      mp = decP.mul(decR.mul(rateFactor)).div(rateFactor.sub(1));
    }

    const schedule: MortgageAmortizationRow[] = [];
    let currentBalance = new Decimal(decP);
    let cumulativeInterest = new Decimal(0);
    let cumulativePrincipal = new Decimal(0);

    for (let month = 1; month <= totalMonths; month++) {
      const interestPayment = decR.isZero() ? new Decimal(0) : currentBalance.mul(decR);
      let principalPayment = mp.sub(interestPayment);

      if (principalPayment.gt(currentBalance)) {
        principalPayment = new Decimal(currentBalance);
      }

      currentBalance = currentBalance.sub(principalPayment);
      if (currentBalance.lt(0.0001) || month === totalMonths) {
        currentBalance = new Decimal(0);
      }

      cumulativeInterest = cumulativeInterest.add(interestPayment);
      cumulativePrincipal = cumulativePrincipal.add(principalPayment);

      schedule.push({
        period: month,
        payment: mp.toDecimalPlaces(2).toNumber(),
        principal: principalPayment.toDecimalPlaces(2).toNumber(),
        interest: interestPayment.toDecimalPlaces(2).toNumber(),
        balance: currentBalance.toDecimalPlaces(2).toNumber(),
        cumulativeInterest: cumulativeInterest.toDecimalPlaces(2).toNumber(),
        cumulativePrincipal: cumulativePrincipal.toDecimalPlaces(2).toNumber()
      });

      if (currentBalance.isZero()) break;
    }

    return schedule;
  } catch {
    return [];
  }
}


export interface MortgageResult {
  monthlyPayment: number;
  totalInterest: number;
}

export function calculateMortgage(principal: number, annualRate: number, years: number): MortgageResult {
  try {
    const decP = new Decimal(principal || 0);
    const decR = new Decimal(annualRate || 0).div(100).div(12);
    const decN = new Decimal(years || 0).mul(12);

    if (decP.isZero() || decN.isZero()) {
      return { monthlyPayment: 0, totalInterest: 0 };
    }

    let mp = new Decimal(0);

    if (decR.isZero()) {
      mp = decN.isZero() ? new Decimal(0) : decP.div(decN);
    } else if (!decN.isZero()) {
      const rateFactor = decR.add(1).pow(decN.toNumber());
      mp = decP.mul(decR.mul(rateFactor)).div(rateFactor.sub(1));
    }

    const totalPaid = mp.mul(decN);
    const ti = totalPaid.sub(decP);

    return {
      monthlyPayment: mp.isFinite() ? mp.toNumber() : 0,
      totalInterest: ti.isFinite() ? ti.toNumber() : 0
    };
  } catch {
    return { monthlyPayment: 0, totalInterest: 0 };
  }
}

export interface ReverseMortgageResult {
  maxLoanAmount: number;
  totalPaid: number;
  totalInterest: number;
}

export function calculateReverseMortgage(targetMonthlyPayment: number, annualRate: number, years: number): ReverseMortgageResult {
  try {
    const decM = new Decimal(targetMonthlyPayment || 0);
    const decR = new Decimal(annualRate || 0).div(100).div(12);
    const decN = new Decimal(years || 0).mul(12);

    if (decM.isZero() || decN.isZero()) {
      return { maxLoanAmount: 0, totalPaid: 0, totalInterest: 0 };
    }

    let principal = new Decimal(0);

    if (decR.isZero()) {
      principal = decM.mul(decN);
    } else {
      const rateFactor = decR.add(1).pow(decN.toNumber());
      // P = M * ( (1+r)^N - 1 ) / ( r * (1+r)^N )
      principal = decM.mul(rateFactor.sub(1)).div(decR.mul(rateFactor));
    }

    const totalPaid = decM.mul(decN);
    const totalInterest = totalPaid.sub(principal);

    return {
      maxLoanAmount: principal.isFinite() ? Math.round(principal.toNumber()) : 0,
      totalPaid: totalPaid.isFinite() ? Math.round(totalPaid.toNumber()) : 0,
      totalInterest: totalInterest.isFinite() ? Math.round(totalInterest.toNumber()) : 0
    };
  } catch {
    return { maxLoanAmount: 0, totalPaid: 0, totalInterest: 0 };
  }
}

export interface TargetSavingsResult {
  requiredMonthlyContribution: number;
  totalSaved: number;
  totalContributions: number;
  totalInterest: number;
}

export function calculateTargetSavings(targetGoal: number, annualRate: number, years: number, initialDeposit: number = 0): TargetSavingsResult {
  try {
    const decFV = new Decimal(targetGoal || 0);
    const decR = new Decimal(annualRate || 0).div(100).div(12);
    const decN = new Decimal(years || 0).mul(12);
    const decP = new Decimal(initialDeposit || 0);

    if (decFV.isZero() || decN.isZero()) {
      return { requiredMonthlyContribution: 0, totalSaved: 0, totalContributions: 0, totalInterest: 0 };
    }

    let pmt = new Decimal(0);

    if (decR.isZero()) {
      const remaining = decFV.sub(decP);
      pmt = remaining.gt(0) ? remaining.div(decN) : new Decimal(0);
    } else {
      const rateFactor = decR.add(1).pow(decN.toNumber());
      const pGrowth = decP.mul(rateFactor);
      const remainingTarget = decFV.sub(pGrowth);

      if (remainingTarget.lte(0)) {
        pmt = new Decimal(0);
      } else {
        // PMT = remainingTarget * r / ( (1+r)^N - 1 )
        pmt = remainingTarget.mul(decR).div(rateFactor.sub(1));
      }
    }

    const totalContributions = decP.add(pmt.mul(decN));
    const totalInterest = decFV.gt(totalContributions) ? decFV.sub(totalContributions) : new Decimal(0);

    return {
      requiredMonthlyContribution: pmt.isFinite() ? Math.max(0, Math.round(pmt.toNumber())) : 0,
      totalSaved: decFV.toNumber(),
      totalContributions: totalContributions.isFinite() ? Math.round(totalContributions.toNumber()) : 0,
      totalInterest: totalInterest.isFinite() ? Math.round(totalInterest.toNumber()) : 0
    };
  } catch {
    return { requiredMonthlyContribution: 0, totalSaved: 0, totalContributions: 0, totalInterest: 0 };
  }
}

export interface GrossNetResult {
  grossMonthly: number;
  grossYearly: number;
  netMonthly: number;
  netYearly: number;
  estimatedTax: number;
  estimatedPension: number;
  estimatedSocialSecurity: number;
  takeHomeRatio: number;
}

export function calculateGrossFromNet(targetNetMonthly: number, taxRate: number = 22, pensionRate: number = 6, socialSecurityRate: number = 5): GrossNetResult {
  try {
    const decNet = new Decimal(targetNetMonthly || 0);
    const totalDeductionPercent = new Decimal(taxRate + pensionRate + socialSecurityRate).div(100);
    const retentionRate = new Decimal(1).sub(totalDeductionPercent);

    if (decNet.isZero() || retentionRate.lte(0)) {
      return { grossMonthly: 0, grossYearly: 0, netMonthly: 0, netYearly: 0, estimatedTax: 0, estimatedPension: 0, estimatedSocialSecurity: 0, takeHomeRatio: 0 };
    }

    const grossMonthly = decNet.div(retentionRate);
    const grossYearly = grossMonthly.mul(12);
    const netYearly = decNet.mul(12);
    const estimatedTax = grossMonthly.mul(taxRate).div(100);
    const estimatedPension = grossMonthly.mul(pensionRate).div(100);
    const estimatedSocialSecurity = grossMonthly.mul(socialSecurityRate).div(100);

    return {
      grossMonthly: Math.round(grossMonthly.toNumber()),
      grossYearly: Math.round(grossYearly.toNumber()),
      netMonthly: Math.round(decNet.toNumber()),
      netYearly: Math.round(netYearly.toNumber()),
      estimatedTax: Math.round(estimatedTax.toNumber()),
      estimatedPension: Math.round(estimatedPension.toNumber()),
      estimatedSocialSecurity: Math.round(estimatedSocialSecurity.toNumber()),
      takeHomeRatio: Math.round(retentionRate.mul(100).toNumber())
    };
  } catch {
    return { grossMonthly: 0, grossYearly: 0, netMonthly: 0, netYearly: 0, estimatedTax: 0, estimatedPension: 0, estimatedSocialSecurity: 0, takeHomeRatio: 0 };
  }
}

export interface CompoundInterestSchedule {
  year: number;
  contributions: number;
  interest: number;
  total: number;
}

export interface CompoundInterestResult {
  futureValue: number;
  totalContributions: number;
  totalInterest: number;
  scheduleData: CompoundInterestSchedule[];
}

export function calculateCompoundInterest(principal: number, annualRate: number, years: number, monthlyContribution: number): CompoundInterestResult {
  try {
    const decP = new Decimal(principal || 0);
    const decRate = new Decimal(annualRate || 0).div(100).div(12);
    const decN = new Decimal(years || 0).mul(12);
    const decContr = new Decimal(monthlyContribution || 0);

    let fv;
    if (decRate.isZero()) {
      fv = decP.add(decContr.mul(decN));
    } else {
      const rateFactor = decRate.add(1).pow(decN.toNumber());
      const pGrowth = decP.mul(rateFactor);
      const cGrowth = decContr.mul(rateFactor.sub(1)).div(decRate);
      fv = pGrowth.add(cGrowth);
    }

    const tc = decP.add(decContr.mul(decN));
    const ti = fv.sub(tc);

    const schedule: CompoundInterestSchedule[] = [];
    for (let i = 0; i <= (years || 0); i++) {
      const n = i * 12;
      let yrFv;
      if (decRate.isZero()) {
        yrFv = decP.add(decContr.mul(n));
      } else {
        const rf = decRate.add(1).pow(n);
        const pg = decP.mul(rf);
        const cg = decContr.mul(rf.sub(1)).div(decRate);
        yrFv = pg.add(cg);
      }
      const yrTc = decP.add(decContr.mul(n));
      const yrTi = yrFv.sub(yrTc);

      schedule.push({
        year: i,
        contributions: Math.round(yrTc.toNumber()),
        interest: Math.round(yrTi.toNumber()),
        total: Math.round(yrFv.toNumber())
      });
    }

    return {
      futureValue: fv.isFinite() ? fv.toNumber() : 0,
      totalContributions: tc.isFinite() ? tc.toNumber() : 0,
      totalInterest: ti.isFinite() ? ti.toNumber() : 0,
      scheduleData: schedule
    };
  } catch {
    return { futureValue: 0, totalContributions: 0, totalInterest: 0, scheduleData: [] };
  }
}

export interface MortgageScenarioParams {
  principal: number;
  rate: number;
  years: number;
}

export interface MortgageComparisonResult {
  scenarioA: MortgageResult & { totalPaid: number };
  scenarioB: MortgageResult & { totalPaid: number };
  diffMonthly: number;
  diffTotalInterest: number;
  diffTotalPaid: number;
  interestSavingsPercent: number;
}

export function compareMortgages(a: MortgageScenarioParams, b: MortgageScenarioParams): MortgageComparisonResult {
  const resA = calculateMortgage(a.principal, a.rate, a.years);
  const resB = calculateMortgage(b.principal, b.rate, b.years);

  const totalPaidA = (resA.monthlyPayment * a.years * 12);
  const totalPaidB = (resB.monthlyPayment * b.years * 12);

  const diffMonthly = resB.monthlyPayment - resA.monthlyPayment;
  const diffTotalInterest = resB.totalInterest - resA.totalInterest;
  const diffTotalPaid = totalPaidB - totalPaidA;

  const interestSavingsPercent = resA.totalInterest > 0
    ? Math.round(((resA.totalInterest - resB.totalInterest) / resA.totalInterest) * 100)
    : 0;

  return {
    scenarioA: { ...resA, totalPaid: Math.round(totalPaidA) },
    scenarioB: { ...resB, totalPaid: Math.round(totalPaidB) },
    diffMonthly: Math.round(diffMonthly),
    diffTotalInterest: Math.round(diffTotalInterest),
    diffTotalPaid: Math.round(diffTotalPaid),
    interestSavingsPercent
  };
}

export interface CompoundScenarioParams {
  principal: number;
  rate: number;
  years: number;
  contribution: number;
}

export interface CompoundComparisonResult {
  scenarioA: CompoundInterestResult;
  scenarioB: CompoundInterestResult;
  diffFutureValue: number;
  diffContributions: number;
  diffInterest: number;
  gainPercentage: number;
}

export function compareCompoundInterest(a: CompoundScenarioParams, b: CompoundScenarioParams): CompoundComparisonResult {
  const resA = calculateCompoundInterest(a.principal, a.rate, a.years, a.contribution);
  const resB = calculateCompoundInterest(b.principal, b.rate, b.years, b.contribution);

  const diffFutureValue = resB.futureValue - resA.futureValue;
  const diffContributions = resB.totalContributions - resA.totalContributions;
  const diffInterest = resB.totalInterest - resA.totalInterest;

  const gainPercentage = resA.futureValue > 0
    ? Math.round(((resB.futureValue - resA.futureValue) / resA.futureValue) * 100)
    : 0;

  return {
    scenarioA: resA,
    scenarioB: resB,
    diffFutureValue: Math.round(diffFutureValue),
    diffContributions: Math.round(diffContributions),
    diffInterest: Math.round(diffInterest),
    gainPercentage
  };
}

export interface DebtItem {
  id: number;
  bal: number;
  rate: number;
  min: number;
}

export interface DebtSnowballResult {
  baseMonths: number;
  baseInterest: number;
  snowballMonths: number;
  snowballInterest: number;
}

export function calculateDebtSnowball(debts: DebtItem[], extraPayment: number): DebtSnowballResult {
  const simulatePayoff = (isSnowball: boolean) => {
    // deep copy and prep rates
    const simDebts: DebtItem[] = debts.map(d => ({ ...d, bal: d.bal || 0, rate: (d.rate || 0)/100/12, min: d.min || 0 }))
                        .filter(d => d.bal > 0);
    
    simDebts.sort((a, b) => a.bal - b.bal);

    let totalInterest = 0;
    let months = 0;
    
    while (simDebts.some(d => d.bal > 0) && months < 1200) {
      months++;
      let currentExtra = isSnowball ? (extraPayment || 0) : 0;
      
      // Add interest
      simDebts.forEach(d => {
        if (d.bal > 0) {
          const interest = d.bal * d.rate;
          totalInterest += interest;
          d.bal += interest;
        }
      });

      // Make min payments
      simDebts.forEach(d => {
        if (d.bal > 0) {
          const payment = Math.min(d.bal, d.min);
          d.bal -= payment;
          if (isSnowball && payment < d.min) {
            currentExtra += (d.min - payment);
          } else if (isSnowball && d.bal <= 0) {
            currentExtra += d.min;
          }
        } else if (isSnowball) {
          currentExtra += d.min;
        }
      });

      // Apply snowball extra
      if (isSnowball && currentExtra > 0) {
        for (const d of simDebts) {
          if (d.bal > 0 && currentExtra > 0) {
            const payment = Math.min(d.bal, currentExtra);
            d.bal -= payment;
            currentExtra -= payment;
          }
        }
      }
    }
    return { months, totalInterest };
  };

  const base = simulatePayoff(false);
  const snowball = simulatePayoff(true);

  return {
    baseMonths: base.months,
    baseInterest: base.totalInterest,
    snowballMonths: snowball.months,
    snowballInterest: snowball.totalInterest
  };
}

// -------------------------------------------------------------
// STOCK OPTIONS & RSU CALCULATOR MATH
// -------------------------------------------------------------

export interface OptionsRsuParams {
  grantType: 'options' | 'rsu';
  quantity: number;
  strikePrice: number;
  currentPrice: number;
  exitPrice: number;
  vestingYears: number;
  cliffMonths: number;
  monthsElapsed: number;
  dilutionPercent: number;
  taxRoute: 'section102_capital' | 'section102_income' | 'standard_capital';
  marginalTaxRate?: number;
}

export interface VestingSchedulePoint {
  month: number;
  year: number;
  vestedShares: number;
  vestedPercent: number;
  vestedGrossValue: number;
}

export interface OptionsRsuResult {
  totalShares: number;
  vestedShares: number;
  unvestedShares: number;
  vestedPercent: number;
  effectiveExitPrice: number;
  grossProceedsCurrent: number;
  grossProceedsExit: number;
  exerciseCostTotal: number;
  exerciseCostVested: number;
  taxEstimatedCurrent: number;
  taxEstimatedExit: number;
  netProceedsCurrent: number;
  netProceedsExit: number;
  effectiveTaxRate: number;
  vestingSchedule: VestingSchedulePoint[];
  exitScenarios: { multiplier: number; sharePrice: number; grossGain: number; netGain: number }[];
}

export function calculateStockOptionsRsu(params: OptionsRsuParams): OptionsRsuResult {
  const {
    grantType,
    quantity = 0,
    strikePrice = 0,
    currentPrice = 0,
    exitPrice = 0,
    vestingYears = 4,
    cliffMonths = 12,
    monthsElapsed = 0,
    dilutionPercent = 0,
    taxRoute = 'section102_capital',
    marginalTaxRate = 47
  } = params;

  const totalMonths = Math.max(1, (vestingYears || 4) * 12);
  const effectiveStrike = grantType === 'rsu' ? 0 : Math.max(0, strikePrice);
  const totalShares = Math.max(0, quantity);

  // Vesting calculation with cliff
  let vestedShares = 0;
  if (monthsElapsed >= cliffMonths) {
    if (monthsElapsed >= totalMonths) {
      vestedShares = totalShares;
    } else {
      vestedShares = Math.floor((totalShares * monthsElapsed) / totalMonths);
    }
  }

  const unvestedShares = totalShares - vestedShares;
  const vestedPercent = totalShares > 0 ? (vestedShares / totalShares) * 100 : 0;

  // Dilution impact on share price at exit
  const effectiveExitPrice = dilutionPercent > 0
    ? exitPrice * (1 - dilutionPercent / 100)
    : exitPrice;

  // Exercise Costs
  const exerciseCostTotal = totalShares * effectiveStrike;
  const exerciseCostVested = vestedShares * effectiveStrike;

  // Gross Gains
  const gainPerShareCurrent = Math.max(0, currentPrice - effectiveStrike);
  const gainPerShareExit = Math.max(0, effectiveExitPrice - effectiveStrike);

  const grossProceedsCurrent = vestedShares * gainPerShareCurrent;
  const grossProceedsExit = totalShares * gainPerShareExit;

  // Tax Rate Determination (Section 102 Israel: 25% capital gains track vs marginal income)
  let effectiveTaxRate = 0.25; // default 25% capital gains
  if (taxRoute === 'section102_income') {
    effectiveTaxRate = (marginalTaxRate || 47) / 100;
  } else if (taxRoute === 'standard_capital') {
    effectiveTaxRate = 0.25;
  }

  const taxEstimatedCurrent = grossProceedsCurrent * effectiveTaxRate;
  const taxEstimatedExit = grossProceedsExit * effectiveTaxRate;

  const netProceedsCurrent = Math.max(0, grossProceedsCurrent - taxEstimatedCurrent);
  const netProceedsExit = Math.max(0, grossProceedsExit - taxEstimatedExit);

  // Generate 48-month Vesting Schedule Points
  const vestingSchedule: VestingSchedulePoint[] = [];
  for (let m = 1; m <= totalMonths; m++) {
    let shares = 0;
    if (m >= cliffMonths) {
      shares = m >= totalMonths ? totalShares : Math.floor((totalShares * m) / totalMonths);
    }
    const percent = totalShares > 0 ? (shares / totalShares) * 100 : 0;
    const value = shares * Math.max(0, currentPrice - effectiveStrike);

    if (m % 3 === 0 || m === cliffMonths || m === totalMonths || m === monthsElapsed) {
      vestingSchedule.push({
        month: m,
        year: Math.ceil(m / 12),
        vestedShares: shares,
        vestedPercent: Number(percent.toFixed(1)),
        vestedGrossValue: Math.round(value)
      });
    }
  }

  // Sensitivity exit scenarios
  const multipliers = [0.5, 1, 1.5, 2, 3, 5, 10];
  const exitScenarios = multipliers.map((mult) => {
    const sp = currentPrice * mult * (1 - dilutionPercent / 100);
    const gross = totalShares * Math.max(0, sp - effectiveStrike);
    const net = gross * (1 - effectiveTaxRate);
    return {
      multiplier: mult,
      sharePrice: Number(sp.toFixed(2)),
      grossGain: Math.round(gross),
      netGain: Math.round(net)
    };
  });

  return {
    totalShares,
    vestedShares,
    unvestedShares,
    vestedPercent: Number(vestedPercent.toFixed(1)),
    effectiveExitPrice: Number(effectiveExitPrice.toFixed(2)),
    grossProceedsCurrent: Math.round(grossProceedsCurrent),
    grossProceedsExit: Math.round(grossProceedsExit),
    exerciseCostTotal: Math.round(exerciseCostTotal),
    exerciseCostVested: Math.round(exerciseCostVested),
    taxEstimatedCurrent: Math.round(taxEstimatedCurrent),
    taxEstimatedExit: Math.round(taxEstimatedExit),
    netProceedsCurrent: Math.round(netProceedsCurrent),
    netProceedsExit: Math.round(netProceedsExit),
    effectiveTaxRate: effectiveTaxRate * 100,
    vestingSchedule,
    exitScenarios
  };
}

// -------------------------------------------------------------
// REAL ESTATE PURCHASE & APPRECIATION TAX MATH (ISRAEL 2026)
// -------------------------------------------------------------

export interface PurchaseTaxBracket {
  from: number;
  to: number;
  rate: number;
  taxableInBracket: number;
  taxInBracket: number;
}

export interface PurchaseTaxResult {
  propertyPrice: number;
  buyerType: 'single_home' | 'additional_home' | 'foreign_resident' | 'commercial' | 'oleh_disabled';
  totalTax: number;
  effectiveTaxRate: number;
  brackets: PurchaseTaxBracket[];
}

export function calculatePurchaseTax(
  price: number,
  buyerType: 'single_home' | 'additional_home' | 'foreign_resident' | 'commercial' | 'oleh_disabled' = 'single_home'
): PurchaseTaxResult {
  const p = Math.max(0, price || 0);

  // Official tax brackets (NIS - Israel Tax Authority standard)
  let bracketDefinitions: { upTo: number; rate: number }[] = [];

  if (buyerType === 'single_home') {
    bracketDefinitions = [
      { upTo: 1978745, rate: 0.0 },
      { upTo: 2347040, rate: 0.035 },
      { upTo: 6055070, rate: 0.05 },
      { upTo: 20183565, rate: 0.08 },
      { upTo: Infinity, rate: 0.10 }
    ];
  } else if (buyerType === 'additional_home' || buyerType === 'foreign_resident') {
    bracketDefinitions = [
      { upTo: 6055070, rate: 0.08 },
      { upTo: Infinity, rate: 0.10 }
    ];
  } else if (buyerType === 'commercial') {
    bracketDefinitions = [
      { upTo: Infinity, rate: 0.06 }
    ];
  } else if (buyerType === 'oleh_disabled') {
    bracketDefinitions = [
      { upTo: 1978745, rate: 0.005 },
      { upTo: Infinity, rate: 0.05 }
    ];
  }

  const brackets: PurchaseTaxBracket[] = [];
  let totalTax = 0;
  let prevLimit = 0;

  for (const b of bracketDefinitions) {
    if (p > prevLimit) {
      const taxable = Math.min(p, b.upTo) - prevLimit;
      const tax = taxable * b.rate;
      totalTax += tax;

      brackets.push({
        from: prevLimit,
        to: b.upTo === Infinity ? -1 : b.upTo,
        rate: b.rate * 100,
        taxableInBracket: Math.round(taxable),
        taxInBracket: Math.round(tax)
      });

      prevLimit = b.upTo;
    } else {
      break;
    }
  }

  const effectiveTaxRate = p > 0 ? (totalTax / p) * 100 : 0;

  return {
    propertyPrice: p,
    buyerType,
    totalTax: Math.round(totalTax),
    effectiveTaxRate: Number(effectiveTaxRate.toFixed(2)),
    brackets
  };
}

export interface AppreciationTaxParams {
  purchasePrice: number;
  sellingPrice: number;
  purchaseYear: number;
  sellingYear: number;
  isSingleHomeExempt: boolean;
  renovationExpenses?: number;
  lawyerAndAgentFees?: number;
  purchaseTaxPaid?: number;
  mortgageRealInterest?: number;
  improvementLevy?: number; // היטל השבחה
}

export interface AppreciationTaxResult {
  totalAppreciationGross: number;
  totalDeductions: number;
  netAppreciation: number;
  isExempt: boolean;
  exemptionReason?: string;
  linearBefore2014Fraction: number;
  linearAfter2014Fraction: number;
  taxableAppreciation: number;
  totalTax: number;
  netProfit: number;
  effectiveTaxRate: number;
}

export function calculateAppreciationTax(params: AppreciationTaxParams): AppreciationTaxResult {
  const {
    purchasePrice = 0,
    sellingPrice = 0,
    purchaseYear = 2010,
    sellingYear = 2026,
    isSingleHomeExempt = false,
    renovationExpenses = 0,
    lawyerAndAgentFees = 0,
    purchaseTaxPaid = 0,
    mortgageRealInterest = 0,
    improvementLevy = 0
  } = params;

  const grossAppreciation = Math.max(0, sellingPrice - purchasePrice);
  const totalDeductions =
    (renovationExpenses || 0) +
    (lawyerAndAgentFees || 0) +
    (purchaseTaxPaid || 0) +
    (mortgageRealInterest || 0) +
    (improvementLevy || 0);

  const netAppreciation = Math.max(0, grossAppreciation - totalDeductions);

  // Single home exemption under section 49b(2) up to ~4,846,000 NIS selling ceiling
  const exemptionCeiling = 4846000;
  if (isSingleHomeExempt && sellingPrice <= exemptionCeiling) {
    return {
      totalAppreciationGross: grossAppreciation,
      totalDeductions,
      netAppreciation,
      isExempt: true,
      exemptionReason: 'פטור מלא לדירת מגורים יחידה מזכה (סעיף 49ב(2) לחוק מיסוי מקרקעין)',
      linearBefore2014Fraction: 0,
      linearAfter2014Fraction: 0,
      taxableAppreciation: 0,
      totalTax: 0,
      netProfit: netAppreciation,
      effectiveTaxRate: 0
    };
  }

  // Linear calculation (Reform from 1.1.2014 - appreciation before 2014 is exempt/0%, after 2014 is 25%)
  const totalHoldingYears = Math.max(1, sellingYear - purchaseYear);
  const yearsAfter2014 = Math.max(0, sellingYear - Math.max(purchaseYear, 2014));
  const linearAfter2014Fraction = purchaseYear < 2014 ? yearsAfter2014 / totalHoldingYears : 1.0;
  const linearBefore2014Fraction = 1.0 - linearAfter2014Fraction;

  const taxableAppreciation = netAppreciation * linearAfter2014Fraction;
  const totalTax = Math.round(taxableAppreciation * 0.25);
  const netProfit = Math.max(0, netAppreciation - totalTax);
  const effectiveTaxRate = netAppreciation > 0 ? (totalTax / netAppreciation) * 100 : 0;

  return {
    totalAppreciationGross: grossAppreciation,
    totalDeductions,
    netAppreciation,
    isExempt: false,
    linearBefore2014Fraction: Number(linearBefore2014Fraction.toFixed(3)),
    linearAfter2014Fraction: Number(linearAfter2014Fraction.toFixed(3)),
    taxableAppreciation: Math.round(taxableAppreciation),
    totalTax,
    netProfit: Math.round(netProfit),
    effectiveTaxRate: Number(effectiveTaxRate.toFixed(2))
  };
}

// -------------------------------------------------------------
// EMPLOYER TOTAL COST VS EMPLOYEE NET SALARY MATH
// -------------------------------------------------------------

export interface EmployerCostParams {
  grossSalary: number;
  creditPoints?: number;
  pensionEmployerPercent?: number; // default 6.5%
  severancePercent?: number; // default 8.33% or 6.0%
  studyFundEmployerPercent?: number; // default 7.5%
  studyFundEmployeePercent?: number; // default 2.5%
  recuperationMonthly?: number; // דמי הבראה יחסי חודשי
  vacationSickProvision?: number; // חופשה ומחלה
  wellnessAndPerks?: number; // תן ביס, רכב, ביטוח בריאות נוסף
}

export interface EmployerCostResult {
  grossSalary: number;
  employerPension: number;
  employerSeverance: number;
  employerStudyFund: number;
  employerNationalInsurance: number;
  employerPerksAndProvisions: number;
  totalEmployerCost: number;
  employerCostPercentage: number;
  incomeTax: number;
  employeeNationalInsurance: number;
  employeePension: number;
  employeeStudyFund: number;
  totalEmployeeDeductions: number;
  netSalary: number;
  netPercentageOfGross: number;
  costToNetMultiplier: number;
}

export function calculateEmployerCost(params: EmployerCostParams): EmployerCostResult {
  const {
    grossSalary = 0,
    creditPoints = 2.25,
    pensionEmployerPercent = 6.5,
    severancePercent = 8.33,
    studyFundEmployerPercent = 7.5,
    studyFundEmployeePercent = 2.5,
    recuperationMonthly = 180,
    vacationSickProvision = 0,
    wellnessAndPerks = 0
  } = params;

  const gross = Math.max(0, grossSalary);

  // 1. Employer Provisions
  const employerPension = (gross * pensionEmployerPercent) / 100;
  const employerSeverance = (gross * severancePercent) / 100;

  // Study fund ceiling for tax exemption is 15,712 NIS
  const studyFundCappedGross = Math.min(gross, 15712);
  const employerStudyFund = (studyFundCappedGross * studyFundEmployerPercent) / 100;

  // National insurance employer part: 3.55% up to 7,522 NIS, 7.6% above up to 49,030 NIS
  const niThreshold = 7522;
  const niMaxCeiling = 49030;
  const niSubjectGross = Math.min(gross, niMaxCeiling);

  const employerNationalInsurance = niSubjectGross <= niThreshold
    ? niSubjectGross * 0.0355
    : niThreshold * 0.0355 + (niSubjectGross - niThreshold) * 0.076;

  const employerPerksAndProvisions = (recuperationMonthly || 0) + (vacationSickProvision || 0) + (wellnessAndPerks || 0);
  const totalEmployerCost = gross + employerPension + employerSeverance + employerStudyFund + employerNationalInsurance + employerPerksAndProvisions;
  const employerCostPercentage = gross > 0 ? (totalEmployerCost / gross) * 100 : 100;

  // 2. Employee Deductions
  // Income Tax Brackets (Monthly):
  // 0 - 7,010: 10%
  // 7,011 - 10,060: 14%
  // 10,061 - 16,150: 20%
  // 16,151 - 22,440: 31%
  // 22,441 - 46,690: 35%
  // 46,691 - 60,130: 47%
  // 60,131+: 50%
  const taxBrackets = [
    { upTo: 7010, rate: 0.10 },
    { upTo: 10060, rate: 0.14 },
    { upTo: 16150, rate: 0.20 },
    { upTo: 22440, rate: 0.31 },
    { upTo: 46690, rate: 0.35 },
    { upTo: 60130, rate: 0.47 },
    { upTo: Infinity, rate: 0.50 }
  ];

  let calculatedTax = 0;
  let prevTaxLimit = 0;
  for (const b of taxBrackets) {
    if (gross > prevTaxLimit) {
      const taxable = Math.min(gross, b.upTo) - prevTaxLimit;
      calculatedTax += taxable * b.rate;
      prevTaxLimit = b.upTo;
    } else {
      break;
    }
  }

  // Credit Points deduction: 242 NIS per credit point monthly
  const creditDiscount = (creditPoints || 2.25) * 242;
  const incomeTax = Math.max(0, calculatedTax - creditDiscount);

  // Employee National Insurance & Health Tax:
  // Up to 7,522 NIS: 3.5%
  // 7,522 to 49,030 NIS: 12%
  const employeeNationalInsurance = niSubjectGross <= niThreshold
    ? niSubjectGross * 0.035
    : niThreshold * 0.035 + (niSubjectGross - niThreshold) * 0.12;

  // Employee Pension (6%) & Study Fund (2.5%)
  const employeePension = (gross * 0.06);
  const employeeStudyFund = (studyFundCappedGross * (studyFundEmployeePercent || 2.5)) / 100;

  const totalEmployeeDeductions = incomeTax + employeeNationalInsurance + employeePension + employeeStudyFund;
  const netSalary = Math.max(0, gross - totalEmployeeDeductions);
  const netPercentageOfGross = gross > 0 ? (netSalary / gross) * 100 : 0;
  const costToNetMultiplier = netSalary > 0 ? totalEmployerCost / netSalary : 0;

  return {
    grossSalary: Math.round(gross),
    employerPension: Math.round(employerPension),
    employerSeverance: Math.round(employerSeverance),
    employerStudyFund: Math.round(employerStudyFund),
    employerNationalInsurance: Math.round(employerNationalInsurance),
    employerPerksAndProvisions: Math.round(employerPerksAndProvisions),
    totalEmployerCost: Math.round(totalEmployerCost),
    employerCostPercentage: Number(employerCostPercentage.toFixed(1)),
    incomeTax: Math.round(incomeTax),
    employeeNationalInsurance: Math.round(employeeNationalInsurance),
    employeePension: Math.round(employeePension),
    employeeStudyFund: Math.round(employeeStudyFund),
    totalEmployeeDeductions: Math.round(totalEmployeeDeductions),
    netSalary: Math.round(netSalary),
    netPercentageOfGross: Number(netPercentageOfGross.toFixed(1)),
    costToNetMultiplier: Number(costToNetMultiplier.toFixed(2))
  };
}

