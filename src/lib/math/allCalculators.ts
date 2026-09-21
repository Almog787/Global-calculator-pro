import Decimal from 'decimal.js';

// -------------------------------------------------------------
// REAL ESTATE & INVESTMENT CALCULATORS
// -------------------------------------------------------------

export interface CapRateResult {
  noi: number;
  capRate: number;
}

export function calculateCapRate(propertyValue: number, grossIncome: number, operatingExpenses: number): CapRateResult {
  try {
    const val = new Decimal(propertyValue || 0);
    const inc = new Decimal(grossIncome || 0);
    const exp = new Decimal(operatingExpenses || 0);

    const noi = inc.sub(exp);
    let cap = new Decimal(0);

    if (val.gt(0)) {
      cap = noi.div(val).mul(100);
    }

    return {
      noi: noi.isFinite() ? noi.toNumber() : 0,
      capRate: cap.isFinite() ? Number(cap.toFixed(2)) : 0
    };
  } catch {
    return { noi: 0, capRate: 0 };
  }
}

export interface MarginResult {
  grossProfit: number;
  margin: number;
  markup: number;
}

export function calculateMargin(cost: number, revenue: number): MarginResult {
  try {
    const decCost = new Decimal(cost || 0);
    const decRev = new Decimal(revenue || 0);

    const grossProfit = decRev.sub(decCost);
    let margin = new Decimal(0);
    let markup = new Decimal(0);

    if (decRev.gt(0)) {
      margin = grossProfit.div(decRev).mul(100);
    }
    if (decCost.gt(0)) {
      markup = grossProfit.div(decCost).mul(100);
    }

    return {
      grossProfit: grossProfit.isFinite() ? grossProfit.toNumber() : 0,
      margin: margin.isFinite() ? Number(margin.toFixed(2)) : 0,
      markup: markup.isFinite() ? Number(markup.toFixed(2)) : 0
    };
  } catch {
    return { grossProfit: 0, margin: 0, markup: 0 };
  }
}

export interface BreakEvenResult {
  breakEvenUnits: number;
  breakEvenRevenue: number;
  contributionMargin: number;
  contributionMarginRatio: number;
}

export function calculateBreakEven(fixedCosts: number, pricePerUnit: number, variableCostPerUnit: number): BreakEvenResult {
  try {
    const fc = new Decimal(fixedCosts || 0);
    const price = new Decimal(pricePerUnit || 0);
    const vc = new Decimal(variableCostPerUnit || 0);

    const cm = price.sub(vc);
    let cmRatio = new Decimal(0);
    let beUnits = new Decimal(0);

    if (price.gt(0)) {
      cmRatio = cm.div(price);
    }
    if (cm.gt(0) && fc.gt(0)) {
      beUnits = fc.div(cm);
    }

    const beRev = beUnits.mul(price);

    return {
      breakEvenUnits: beUnits.isFinite() ? Math.ceil(beUnits.toNumber()) : 0,
      breakEvenRevenue: beRev.isFinite() ? beRev.toNumber() : 0,
      contributionMargin: cm.isFinite() ? cm.toNumber() : 0,
      contributionMarginRatio: cmRatio.isFinite() ? Number(cmRatio.mul(100).toFixed(2)) : 0
    };
  } catch {
    return { breakEvenUnits: 0, breakEvenRevenue: 0, contributionMargin: 0, contributionMarginRatio: 0 };
  }
}

export interface AutoLoanResult {
  loanAmount: number;
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
}

export function calculateAutoLoan(
  vehiclePrice: number,
  downPayment: number = 0,
  tradeIn: number = 0,
  interestRate: number = 5,
  loanTermMonths: number = 60,
  salesTaxRate: number = 0
): AutoLoanResult {
  try {
    const price = new Decimal(vehiclePrice || 0);
    const down = new Decimal(downPayment || 0);
    const trade = new Decimal(tradeIn || 0);
    const tax = price.mul(new Decimal(salesTaxRate || 0).div(100));
    const term = new Decimal(loanTermMonths || 1);

    const loanAmount = Decimal.max(0, price.add(tax).sub(down).sub(trade));

    if (loanAmount.isZero() || term.isZero()) {
      return { loanAmount: 0, monthlyPayment: 0, totalInterest: 0, totalCost: 0 };
    }

    const monthlyRate = new Decimal(interestRate || 0).div(100).div(12);
    let monthlyPayment = new Decimal(0);

    if (monthlyRate.isZero()) {
      monthlyPayment = loanAmount.div(term);
    } else {
      const factor = monthlyRate.add(1).pow(term.toNumber());
      monthlyPayment = loanAmount.mul(monthlyRate.mul(factor)).div(factor.sub(1));
    }

    const totalPaid = monthlyPayment.mul(term);
    const totalInterest = Decimal.max(0, totalPaid.sub(loanAmount));

    return {
      loanAmount: loanAmount.isFinite() ? Math.round(loanAmount.toNumber()) : 0,
      monthlyPayment: monthlyPayment.isFinite() ? Number(monthlyPayment.toFixed(2)) : 0,
      totalInterest: totalInterest.isFinite() ? Math.round(totalInterest.toNumber()) : 0,
      totalCost: totalPaid.isFinite() ? Math.round(totalPaid.toNumber()) : 0
    };
  } catch {
    return { loanAmount: 0, monthlyPayment: 0, totalInterest: 0, totalCost: 0 };
  }
}

export interface CreditCardPayoffResult {
  monthsToPayoff: number;
  totalInterest: number;
  totalPaid: number;
}

export function calculateCreditCardPayoff(balance: number, annualInterestRate: number, monthlyPayment: number): CreditCardPayoffResult {
  try {
    let bal = new Decimal(balance || 0);
    const pmt = new Decimal(monthlyPayment || 0);
    const monthlyRate = new Decimal(annualInterestRate || 0).div(100).div(12);

    if (bal.lte(0) || pmt.lte(0)) {
      return { monthsToPayoff: 0, totalInterest: 0, totalPaid: 0 };
    }

    const firstMonthInterest = bal.mul(monthlyRate);
    if (pmt.lte(firstMonthInterest)) {
      return { monthsToPayoff: Infinity, totalInterest: Infinity, totalPaid: Infinity };
    }

    let months = 0;
    let totalInterest = new Decimal(0);

    while (bal.gt(0) && months < 1200) {
      months++;
      const interest = bal.mul(monthlyRate);
      totalInterest = totalInterest.add(interest);
      bal = bal.add(interest).sub(pmt);
      if (bal.lte(0)) break;
    }

    const totalPaid = new Decimal(balance || 0).add(totalInterest);

    return {
      monthsToPayoff: months,
      totalInterest: totalInterest.isFinite() ? Math.round(totalInterest.toNumber()) : 0,
      totalPaid: totalPaid.isFinite() ? Math.round(totalPaid.toNumber()) : 0
    };
  } catch {
    return { monthsToPayoff: 0, totalInterest: 0, totalPaid: 0 };
  }
}

export interface RoiResult {
  netProfit: number;
  roiPercentage: number;
  annualizedRoi: number;
}

export function calculateRoi(initialInvestment: number, finalValue: number, years: number = 1, additionalCosts: number = 0): RoiResult {
  try {
    const init = new Decimal(initialInvestment || 0);
    const fin = new Decimal(finalValue || 0);
    const costs = new Decimal(additionalCosts || 0);
    const totalInvested = init.add(costs);

    if (totalInvested.lte(0)) {
      return { netProfit: 0, roiPercentage: 0, annualizedRoi: 0 };
    }

    const netProfit = fin.sub(totalInvested);
    const roiPercentage = netProfit.div(totalInvested).mul(100);

    let annualizedRoi = new Decimal(0);
    if (years > 0 && fin.gt(0)) {
      const totalReturnRatio = fin.div(totalInvested);
      const annRatio = Math.pow(totalReturnRatio.toNumber(), 1 / years) - 1;
      annualizedRoi = new Decimal(annRatio * 100);
    }

    return {
      netProfit: netProfit.isFinite() ? netProfit.toNumber() : 0,
      roiPercentage: roiPercentage.isFinite() ? Number(roiPercentage.toFixed(2)) : 0,
      annualizedRoi: annualizedRoi.isFinite() ? Number(annualizedRoi.toFixed(2)) : 0
    };
  } catch {
    return { netProfit: 0, roiPercentage: 0, annualizedRoi: 0 };
  }
}

export interface RefinanceResult {
  monthlySavings: number;
  lifetimeSavings: number;
  breakEvenMonths: number;
}

export function calculateRefinance(
  currentBalance: number,
  currentRate: number,
  currentRemainingYears: number,
  newRate: number,
  newTermYears: number,
  closingCosts: number
): RefinanceResult {
  try {
    const bal = new Decimal(currentBalance || 0);
    if (bal.lte(0)) return { monthlySavings: 0, lifetimeSavings: 0, breakEvenMonths: 0 };

    const curMonthlyRate = new Decimal(currentRate || 0).div(100).div(12);
    const curMonths = new Decimal(currentRemainingYears || 1).mul(12);
    let curPayment = new Decimal(0);

    if (curMonthlyRate.isZero()) {
      curPayment = bal.div(curMonths);
    } else {
      const factor = curMonthlyRate.add(1).pow(curMonths.toNumber());
      curPayment = bal.mul(curMonthlyRate.mul(factor)).div(factor.sub(1));
    }

    const newMonthlyRate = new Decimal(newRate || 0).div(100).div(12);
    const newMonths = new Decimal(newTermYears || 1).mul(12);
    let newPayment = new Decimal(0);

    if (newMonthlyRate.isZero()) {
      newPayment = bal.div(newMonths);
    } else {
      const factor = newMonthlyRate.add(1).pow(newMonths.toNumber());
      newPayment = bal.mul(newMonthlyRate.mul(factor)).div(factor.sub(1));
    }

    const monthlySavings = curPayment.sub(newPayment);
    const costs = new Decimal(closingCosts || 0);

    const totalCurPaid = curPayment.mul(curMonths);
    const totalNewPaid = newPayment.mul(newMonths).add(costs);
    const lifetimeSavings = totalCurPaid.sub(totalNewPaid);

    let breakEvenMonths = 0;
    if (monthlySavings.gt(0)) {
      breakEvenMonths = Math.ceil(costs.div(monthlySavings).toNumber());
    }

    return {
      monthlySavings: monthlySavings.isFinite() ? Number(monthlySavings.toFixed(2)) : 0,
      lifetimeSavings: lifetimeSavings.isFinite() ? Math.round(lifetimeSavings.toNumber()) : 0,
      breakEvenMonths: isFinite(breakEvenMonths) ? breakEvenMonths : 0
    };
  } catch {
    return { monthlySavings: 0, lifetimeSavings: 0, breakEvenMonths: 0 };
  }
}

export interface VatResult {
  netAmount: number;
  vatAmount: number;
  totalAmount: number;
}

export function calculateVat(amount: number, vatRatePercent: number = 18, isVatIncluded: boolean = false): VatResult {
  try {
    const amt = new Decimal(amount || 0);
    const rate = new Decimal(vatRatePercent || 0).div(100);

    if (amt.lte(0)) {
      return { netAmount: 0, vatAmount: 0, totalAmount: 0 };
    }

    let net: Decimal;
    let vat: Decimal;
    let total: Decimal;

    if (isVatIncluded) {
      total = amt;
      net = total.div(rate.add(1));
      vat = total.sub(net);
    } else {
      net = amt;
      vat = net.mul(rate);
      total = net.add(vat);
    }

    return {
      netAmount: net.isFinite() ? Number(net.toFixed(2)) : 0,
      vatAmount: vat.isFinite() ? Number(vat.toFixed(2)) : 0,
      totalAmount: total.isFinite() ? Number(total.toFixed(2)) : 0
    };
  } catch {
    return { netAmount: 0, vatAmount: 0, totalAmount: 0 };
  }
}

export interface TipResult {
  tipAmount: number;
  totalWithTip: number;
  perPersonTip: number;
  perPersonTotal: number;
}

export function calculateTip(billAmount: number, tipPercent: number, numberOfPeople: number = 1): TipResult {
  try {
    const bill = new Decimal(billAmount || 0);
    const pct = new Decimal(tipPercent || 0).div(100);
    const people = Math.max(1, numberOfPeople || 1);

    const tip = bill.mul(pct);
    const total = bill.add(tip);
    const perPersonTip = tip.div(people);
    const perPersonTotal = total.div(people);

    return {
      tipAmount: tip.isFinite() ? Number(tip.toFixed(2)) : 0,
      totalWithTip: total.isFinite() ? Number(total.toFixed(2)) : 0,
      perPersonTip: perPersonTip.isFinite() ? Number(perPersonTip.toFixed(2)) : 0,
      perPersonTotal: perPersonTotal.isFinite() ? Number(perPersonTotal.toFixed(2)) : 0
    };
  } catch {
    return { tipAmount: 0, totalWithTip: 0, perPersonTip: 0, perPersonTotal: 0 };
  }
}

export interface FuelSplitResult {
  totalFuelCost: number;
  litersNeeded: number;
  costPerPerson: number;
}

export function calculateFuelSplit(
  distanceKm: number,
  fuelConsumptionLPer100Km: number,
  pricePerLiter: number,
  passengers: number = 1
): FuelSplitResult {
  try {
    const dist = new Decimal(distanceKm || 0);
    const cons = new Decimal(fuelConsumptionLPer100Km || 0);
    const price = new Decimal(pricePerLiter || 0);
    const count = Math.max(1, passengers || 1);

    const liters = dist.mul(cons).div(100);
    const totalCost = liters.mul(price);
    const perPerson = totalCost.div(count);

    return {
      totalFuelCost: totalCost.isFinite() ? Number(totalCost.toFixed(2)) : 0,
      litersNeeded: liters.isFinite() ? Number(liters.toFixed(2)) : 0,
      costPerPerson: perPerson.isFinite() ? Number(perPerson.toFixed(2)) : 0
    };
  } catch {
    return { totalFuelCost: 0, litersNeeded: 0, costPerPerson: 0 };
  }
}

export interface DownloadTimeResult {
  totalSeconds: number;
  formattedDuration: string;
}

export function calculateDownloadTime(fileSizeMB: number, speedMbps: number): DownloadTimeResult {
  try {
    const mb = new Decimal(fileSizeMB || 0);
    const mbps = new Decimal(speedMbps || 0);

    if (mb.lte(0) || mbps.lte(0)) {
      return { totalSeconds: 0, formattedDuration: '0s' };
    }

    // 1 Megabyte = 8 Megabits
    const totalMbits = mb.mul(8);
    const sec = totalMbits.div(mbps).toNumber();

    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = Math.floor(sec % 60);

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);

    return {
      totalSeconds: Math.round(sec),
      formattedDuration: parts.join(' ')
    };
  } catch {
    return { totalSeconds: 0, formattedDuration: '0s' };
  }
}

export interface WaterIntakeResult {
  dailyWaterLiters: number;
  glassesCount: number;
}

export function calculateWaterIntake(weightKg: number, activityMinutes: number = 0, isHotClimate: boolean = false): WaterIntakeResult {
  try {
    const w = Math.max(0, weightKg || 0);
    const act = Math.max(0, activityMinutes || 0);

    // Base: 35ml per kg of bodyweight
    let ml = w * 35;
    // Activity: +350ml per 30 mins of exercise
    ml += (act / 30) * 350;
    // Climate: +500ml for hot climate
    if (isHotClimate) ml += 500;

    const liters = ml / 1000;
    const glasses = Math.round(ml / 250);

    return {
      dailyWaterLiters: Number(liters.toFixed(2)),
      glassesCount: Math.max(0, glasses)
    };
  } catch {
    return { dailyWaterLiters: 0, glassesCount: 0 };
  }
}

export interface SleepCycleResult {
  recommendedWakeTimes: string[];
}

export function calculateSleepCycles(sleepTimeHours: number, sleepTimeMinutes: number): SleepCycleResult {
  try {
    const baseMinutes = (sleepTimeHours * 60 + sleepTimeMinutes + 14) % 1440; // 14 mins to fall asleep
    const cycles = [4, 5, 6]; // 6h, 7.5h, 9h of sleep (90-min cycles)

    const times = cycles.map(c => {
      const totalMin = (baseMinutes + c * 90) % 1440;
      const h = Math.floor(totalMin / 60).toString().padStart(2, '0');
      const m = (totalMin % 60).toString().padStart(2, '0');
      return `${h}:${m}`;
    });

    return { recommendedWakeTimes: times };
  } catch {
    return { recommendedWakeTimes: [] };
  }
}
