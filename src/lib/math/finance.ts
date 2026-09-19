import Decimal from 'decimal.js';

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
