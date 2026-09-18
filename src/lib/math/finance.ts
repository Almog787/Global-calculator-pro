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
