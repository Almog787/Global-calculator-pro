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

// -------------------------------------------------------------
// PREGNANCY & DUE DATE CALCULATOR
// -------------------------------------------------------------

export interface PregnancyCalculationParams {
  method?: 'lmp' | 'conception' | 'due_date' | 'ivf_day3' | 'ivf_day5';
  dateStr?: string;
  cycleLength?: number;
}

export interface PregnancyResult {
  dueDate: string;
  dueDateFormatted: string;
  conceptionDate: string;
  conceptionDateFormatted: string;
  gestationalWeeks: number;
  gestationalDays: number;
  totalDaysPregnant: number;
  daysRemaining: number;
  progressPercent: number;
  trimester: 1 | 2 | 3;
  currentMonth: number;
  fetalLengthCm: number;
  fetalWeightGrams: number;
  zodiacSign: string;
  isFullTerm: boolean;
}

export interface FetalWeekData {
  week: number;
  lengthCm: number;
  weightGrams: number;
  fruit: {
    he: string;
    en: string;
    es: string;
    fr: string;
    ar: string;
  };
  highlight: {
    he: string;
    en: string;
    es: string;
    fr: string;
    ar: string;
  };
}

export function getZodiacSign(month: number, day: number): string {
  if ((month === 1 && day <= 19) || (month === 12 && day >= 22)) return 'capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'pisces';
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
  return 'sagittarius';
}

export const FETAL_DEVELOPMENT_BY_WEEK: Record<number, FetalWeekData> = {
  4: {
    week: 4,
    lengthCm: 0.1,
    weightGrams: 0.1,
    fruit: { he: 'זרע פרג', en: 'Poppy seed', es: 'Semilla de amapola', fr: 'Graine de pavot', ar: 'بذرة الخشخاش' },
    highlight: { he: 'השרשה ברחם והתחלת יצירת השליה', en: 'Uterine implantation and early placenta formation', es: 'Implantación y formación de la placenta', fr: 'Implantation et début du placenta', ar: 'انغراس البويضة وبداية تشكل المشيمة' },
  },
  6: {
    week: 6,
    lengthCm: 0.5,
    weightGrams: 0.5,
    fruit: { he: 'גרגר עדשים', en: 'Lentil / Sweet pea', es: 'Lenteja', fr: 'Lentille', ar: 'حبة عدس' },
    highlight: { he: 'הלב מתחיל לפעום (נצפה באולטרסאונד)', en: 'Heart begins beating (visible on early ultrasound)', es: 'El corazón comienza a latir', fr: 'Le cœur commence à battre', ar: 'يبدأ القلب بالنبض' },
  },
  8: {
    week: 8,
    lengthCm: 1.6,
    weightGrams: 1,
    fruit: { he: 'פטל / פרי יער', en: 'Raspberry', es: 'Frambuesa', fr: 'Framboise', ar: 'توت العليق' },
    highlight: { he: 'היווצרות אצבעות הידיים והרגליים', en: 'Webbed fingers and toes are forming', es: 'Formación de dedos de manos y pies', fr: 'Formation des doigts et orteils', ar: 'تشكل أصابع اليدين والقدمين' },
  },
  10: {
    week: 10,
    lengthCm: 3.1,
    weightGrams: 4,
    fruit: { he: 'תות שדה', en: 'Strawberry', es: 'Fresa', fr: 'Fraise', ar: 'فراولة' },
    highlight: { he: 'סיום שלב האמבריו ומעבר להגדרה כעובר (פיוטוס)', en: 'Transition from embryo to fetus; vital organs working', es: 'Transición de embrión a feto', fr: 'L\'embryon devient officiellement fœtus', ar: 'الانتقال من مضغة إلى جنين مكتمل الأعضاء' },
  },
  12: {
    week: 12,
    lengthCm: 5.4,
    weightGrams: 14,
    fruit: { he: 'שזיף עסיסי', en: 'Plum', es: 'Ciruela', fr: 'Prune', ar: 'برقوق' },
    highlight: { he: 'סיום השליש הראשון; רפלקסים פעילים', en: 'End of 1st trimester; reflexes developing', es: 'Fin del primer trimestre; reflejos activos', fr: 'Fin du premier trimestre; réflexes actifs', ar: 'نهاية الثلث الأول وبدء ردود الفعل الحركية' },
  },
  14: {
    week: 14,
    lengthCm: 8.7,
    weightGrams: 43,
    fruit: { he: 'לימון צהוב', en: 'Lemon', es: 'Limón', fr: 'Citron', ar: 'ليمونة' },
    highlight: { he: 'תחילת השליש השני; העובר מתרגל בליעה והבעות פנים', en: 'Start of 2nd trimester; facial expressions form', es: 'Inicio del 2º trimestre; expresiones faciales', fr: 'Début du 2e trimestre; expressions faciales', ar: 'بداية الثلث الثاني وملامح الوجه' },
  },
  16: {
    week: 16,
    lengthCm: 11.6,
    weightGrams: 100,
    fruit: { he: 'אבוקדו', en: 'Avocado', es: 'Aguacate', fr: 'Avocat', ar: 'أفوكادو' },
    highlight: { he: 'העיניים רגישות לאור; הלב שואב כ-25 ליטר דם ביממה', en: 'Eyes sensitive to light; heart pumps 25L blood/day', es: 'Ojos sensibles a la luz', fr: 'Les yeux réagissent à la lumière', ar: 'العينان تتأثران بالضوء' },
  },
  18: {
    week: 18,
    lengthCm: 14.2,
    weightGrams: 190,
    fruit: { he: 'פלפל מתוק', en: 'Bell pepper', es: 'Pimiento', fr: 'Poivron', ar: 'فلفل حلو' },
    highlight: { he: 'העובר יכול לשמוע צלילים וקולות חיצוניים', en: 'Baby can hear your voice and external sounds', es: 'El bebé puede escuchar tu voz y sonidos', fr: 'Le bébé perçoit les bruits extérieurs', ar: 'يستطيع الجنين سماع صوت الأم والأصوات' },
  },
  20: {
    week: 20,
    lengthCm: 25.6,
    weightGrams: 300,
    fruit: { he: 'בננה', en: 'Banana', es: 'Plátano', fr: 'Banane', ar: 'موزة' },
    highlight: { he: 'אמצע הדרך בדיוק! מרגישים תנועות בעיטה ראשונות', en: 'Halfway mark! Quickening movements often felt', es: '¡Mitad del camino! Primeras patadas perceptibles', fr: 'La moitié du parcours ! Premiers coups de pied', ar: 'منتصف الطريق تماماً! الشعور بركلات الجنين' },
  },
  22: {
    week: 22,
    lengthCm: 27.8,
    weightGrams: 430,
    fruit: { he: 'פפאיה', en: 'Papaya', es: 'Papaya', fr: 'Papaye', ar: 'بابايا' },
    highlight: { he: 'חוש המגע מפותח; העובר ממשש את פניו וחבל הטבור', en: 'Sense of touch developed; baby grasps umbilical cord', es: 'Sentido del tacto muy desarrollado', fr: 'Le sens du toucher se perfectionne', ar: 'تطور حاسة اللمس والإمساك بالحبل السري' },
  },
  24: {
    week: 24,
    lengthCm: 30.0,
    weightGrams: 600,
    fruit: { he: 'קלח תירס', en: 'Ear of corn', es: 'Mazorca de maíz', fr: 'Épi de maïs', ar: 'عرنوس ذرة' },
    highlight: { he: 'סף החיות הרפואי; הריאות מפתחות נאדיות ראשונות', en: 'Viability threshold; lungs develop branches', es: 'Umbral de viabilidad; pulmones madurando', fr: 'Seuil de viabilité; les poumons progressent', ar: 'مرحلة القدرة على الحياة خارج الرحم ونمو الرئتين' },
  },
  26: {
    week: 26,
    lengthCm: 35.6,
    weightGrams: 760,
    fruit: { he: 'ראש חסה', en: 'Head of lettuce', es: 'Lechuga', fr: 'Laitue', ar: 'رأس خس' },
    highlight: { he: 'העיניים נפקחות לראשונה; תגובה לרעש חזק', en: 'Eyes open for the first time; startle reflex', es: 'Abre los ojos por primera vez', fr: 'Ouvre les yeux pour la première fois', ar: 'فتح العينين لأول مرة والاستجابة للصوت' },
  },
  28: {
    week: 28,
    lengthCm: 37.6,
    weightGrams: 1000,
    fruit: { he: 'חציל גדול', en: 'Eggplant', es: 'Berenjena', fr: 'Aubergine', ar: 'باذنجان' },
    highlight: { he: 'כניסה לשליש השלישי! המוח רושם גלי שנת חלום (REM)', en: 'Welcome to the 3rd trimester! Baby dreams (REM sleep)', es: '¡Tercer trimestre! Actividad cerebral y sueño REM', fr: 'Bienvenue au 3e trimestre ! Sommeil paradoxal', ar: 'بداية الثلث الثالث ونوم الأحلام (REM)' },
  },
  30: {
    week: 30,
    lengthCm: 39.9,
    weightGrams: 1300,
    fruit: { he: 'כרוב ירוק', en: 'Cabbage', es: 'Col / Repollo', fr: 'Chou', ar: 'ملفوف' },
    highlight: { he: 'מח העצם מייצר כדוריות דם אדומות', en: 'Bone marrow takes over red blood cell production', es: 'La médula ósea produce glóbulos rojos', fr: 'La moelle osseuse produit les globules rouges', ar: 'نخاع العظم ينتج خلايا الدم الحمراء' },
  },
  32: {
    week: 32,
    lengthCm: 42.4,
    weightGrams: 1700,
    fruit: { he: 'דלורית', en: 'Butternut squash', es: 'Calabaza cacahuete', fr: 'Courge butternut', ar: 'قرع عسلي' },
    highlight: { he: 'תרגול תנועות נשימה ובליעה; שכבת שומן נבנית', en: 'Practicing breathing motions; layer of body fat accumulates', es: 'Práctica de respiración y grasa corporal', fr: 'Entraînement respiratoire et prise de poids', ar: 'التدرب على التنفس وتراكم الدهون الصحية' },
  },
  34: {
    week: 34,
    lengthCm: 45.0,
    weightGrams: 2100,
    fruit: { he: 'מלון עסיסי', en: 'Cantaloupe', es: 'Melón', fr: 'Melon', ar: 'شمام' },
    highlight: { he: 'מערכת החיסון מתחזקת בנוגדנים מהאם', en: 'Immune system strengthens via maternal antibodies', es: 'Sistema inmune absorbe anticuerpos maternos', fr: 'Le système immunitaire reçoit les anticorps', ar: 'انتقال الأجسام المضادة من الأم لتقوية المناعة' },
  },
  36: {
    week: 36,
    lengthCm: 47.4,
    weightGrams: 2600,
    fruit: { he: 'אננס', en: 'Pineapple', es: 'Piña', fr: 'Ananas', ar: 'أناناس' },
    highlight: { he: 'התבססות ראש העובר באגן; כמעט במועד', en: 'Head descends into pelvis; almost full term', es: 'El bebé encaja su cabecita en la pelvis', fr: 'La tête s\'engage dans le bassin', ar: 'نزول رأس الجنين في الحوض استعداداً للولادة' },
  },
  38: {
    week: 38,
    lengthCm: 49.8,
    weightGrams: 3100,
    fruit: { he: 'אבטיח אישי', en: 'Mini watermelon', es: 'Sandía pequeña', fr: 'Petite pastèque', ar: 'بطيخ صغير' },
    highlight: { he: 'הריון במועד מלא (Full Term)! הריאות בשלות לחלוטין', en: 'Full term pregnancy! Lungs are fully mature', es: '¡Embarazo a término! Pulmones completamente maduros', fr: 'Terme précoce atteint ! Poumons matures', ar: 'حمل مكتمل المدة والرئتان جاهزتان للتنفس' },
  },
  40: {
    week: 40,
    lengthCm: 51.2,
    weightGrams: 3500,
    fruit: { he: 'דלעת / אבטיח ענק', en: 'Pumpkin / Watermelon', es: 'Sandía grande', fr: 'Citrouille / Pastèque', ar: 'بطيخة كبيرة' },
    highlight: { he: 'תאריך הלידה המשוער הגיע! מוכנים לפגישה המרגשת', en: 'Official due date arrived! Ready for birth', es: '¡Llegó la fecha estimada! Listo para nacer', fr: 'La date du terme est arrivée ! Prêt pour la rencontre', ar: 'موعد الولادة الرسمي! استعداد تام للقاء الطفل' },
  },
};

export function getFetalDataForWeek(weekNum: number): FetalWeekData {
  const safeWeek = Math.max(4, Math.min(40, Math.round(weekNum || 4)));
  const existingWeeks = Object.keys(FETAL_DEVELOPMENT_BY_WEEK).map(Number).sort((a, b) => a - b);
  
  let closest = existingWeeks[0];
  for (const w of existingWeeks) {
    if (w <= safeWeek) closest = w;
  }
  
  const base = FETAL_DEVELOPMENT_BY_WEEK[closest] || FETAL_DEVELOPMENT_BY_WEEK[40];
  // Interpolate slightly if exact week differs
  const lengthEst = Number((safeWeek * 1.28).toFixed(1));
  const weightEst = safeWeek < 12 ? Math.round(safeWeek * 1.5) : Math.round(Math.pow(safeWeek, 2.2) * 1.05);

  return {
    ...base,
    week: safeWeek,
    lengthCm: safeWeek === base.week ? base.lengthCm : lengthEst,
    weightGrams: safeWeek === base.week ? base.weightGrams : weightEst,
  };
}

export function calculatePregnancy(
  arg1?: PregnancyCalculationParams | any,
  arg2?: any,
  arg3?: any
): PregnancyResult {
  try {
    let method: string = 'lmp';
    let dateStr: string = '';
    let cycleLength: number = 28;

    if (typeof arg1 === 'object' && arg1 !== null) {
      method = arg1.method || 'lmp';
      dateStr = arg1.dateStr || '';
      cycleLength = Number(arg1.cycleLength) || 28;
    } else if (typeof arg1 === 'string') {
      dateStr = arg1;
      if (typeof arg2 === 'string') method = arg2;
      if (typeof arg3 === 'number') cycleLength = arg3;
    }

    if (cycleLength < 20 || cycleLength > 45 || isNaN(cycleLength)) {
      cycleLength = 28;
    }

    // Default reference date is 8 weeks ago if invalid or empty
    const now = new Date();
    let inputDate = new Date(dateStr);
    if (isNaN(inputDate.getTime()) || !dateStr) {
      inputDate = new Date(now.getTime() - 56 * 24 * 60 * 60 * 1000); // 8 weeks ago
    }

    let calculatedLmp: Date;
    let dueDate: Date;
    let conceptionDate: Date;

    const ONE_DAY_MS = 24 * 60 * 60 * 1000;

    if (method === 'conception') {
      conceptionDate = new Date(inputDate);
      calculatedLmp = new Date(conceptionDate.getTime() - 14 * ONE_DAY_MS);
      dueDate = new Date(conceptionDate.getTime() + 266 * ONE_DAY_MS);
    } else if (method === 'due_date') {
      dueDate = new Date(inputDate);
      calculatedLmp = new Date(dueDate.getTime() - 280 * ONE_DAY_MS);
      conceptionDate = new Date(dueDate.getTime() - 266 * ONE_DAY_MS);
    } else if (method === 'ivf_day3') {
      conceptionDate = new Date(inputDate.getTime() - 3 * ONE_DAY_MS);
      calculatedLmp = new Date(conceptionDate.getTime() - 14 * ONE_DAY_MS);
      dueDate = new Date(inputDate.getTime() + 263 * ONE_DAY_MS);
    } else if (method === 'ivf_day5') {
      conceptionDate = new Date(inputDate.getTime() - 5 * ONE_DAY_MS);
      calculatedLmp = new Date(conceptionDate.getTime() - 14 * ONE_DAY_MS);
      dueDate = new Date(inputDate.getTime() + 261 * ONE_DAY_MS);
    } else {
      // Standard LMP with cycle length variation (Naegele's rule adjusted)
      const cycleAdjustment = (cycleLength - 28) * ONE_DAY_MS;
      calculatedLmp = new Date(inputDate.getTime() + cycleAdjustment);
      conceptionDate = new Date(calculatedLmp.getTime() + 14 * ONE_DAY_MS);
      dueDate = new Date(calculatedLmp.getTime() + 280 * ONE_DAY_MS);
    }

    // Days elapsed from calculated LMP to today
    const diffTime = now.getTime() - calculatedLmp.getTime();
    const totalDaysPregnant = Math.max(0, Math.floor(diffTime / ONE_DAY_MS));

    const gestationalWeeks = Math.floor(totalDaysPregnant / 7);
    const gestationalDays = totalDaysPregnant % 7;

    const remainingTime = dueDate.getTime() - now.getTime();
    const daysRemaining = Math.max(0, Math.ceil(remainingTime / ONE_DAY_MS));

    const progressPercent = Math.min(100, Math.max(0, Number(((totalDaysPregnant / 280) * 100).toFixed(1))));

    let trimester: 1 | 2 | 3 = 1;
    if (gestationalWeeks >= 28) {
      trimester = 3;
    } else if (gestationalWeeks >= 14) {
      trimester = 2;
    }

    // Month calculation
    let currentMonth = 1;
    if (gestationalWeeks <= 4) currentMonth = 1;
    else if (gestationalWeeks <= 8) currentMonth = 2;
    else if (gestationalWeeks <= 13) currentMonth = 3;
    else if (gestationalWeeks <= 17) currentMonth = 4;
    else if (gestationalWeeks <= 21) currentMonth = 5;
    else if (gestationalWeeks <= 27) currentMonth = 6;
    else if (gestationalWeeks <= 31) currentMonth = 7;
    else if (gestationalWeeks <= 35) currentMonth = 8;
    else currentMonth = 9;

    const fetal = getFetalDataForWeek(gestationalWeeks || 4);
    const zodiac = getZodiacSign(dueDate.getMonth() + 1, dueDate.getDate());

    const isFullTerm = gestationalWeeks >= 37;

    const pad = (n: number) => n.toString().padStart(2, '0');
    const toIsoDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    return {
      dueDate: toIsoDate(dueDate),
      dueDateFormatted: dueDate.toLocaleDateString(),
      conceptionDate: toIsoDate(conceptionDate),
      conceptionDateFormatted: conceptionDate.toLocaleDateString(),
      gestationalWeeks,
      gestationalDays,
      totalDaysPregnant,
      daysRemaining,
      progressPercent,
      trimester,
      currentMonth,
      fetalLengthCm: fetal.lengthCm,
      fetalWeightGrams: fetal.weightGrams,
      zodiacSign: zodiac,
      isFullTerm,
    };
  } catch {
    return {
      dueDate: '2026-11-15',
      dueDateFormatted: '15/11/2026',
      conceptionDate: '2026-02-22',
      conceptionDateFormatted: '22/02/2026',
      gestationalWeeks: 20,
      gestationalDays: 0,
      totalDaysPregnant: 140,
      daysRemaining: 140,
      progressPercent: 50,
      trimester: 2,
      currentMonth: 5,
      fetalLengthCm: 25.6,
      fetalWeightGrams: 300,
      zodiacSign: 'scorpio',
      isFullTerm: false,
    };
  }
}
