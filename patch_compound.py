import re

with open('src/pages/calculators/CompoundInterest.tsx', 'r') as f:
    content = f.read()

# Add import
import_stmt = "import { calculateCompoundInterest } from '../../lib/math/finance';\n"
content = content.replace("import { useCalculatorState } from '../../hooks/useCalculatorState';", 
                          "import { useCalculatorState } from '../../hooks/useCalculatorState';\n" + import_stmt)

# Replace useMemo block
old_memo = """  const { futureValue, totalContributions, totalInterest, scheduleData } = useMemo(() => {
    try {
      const decP = new Decimal(principal || 0);
      const decRate = new Decimal(rate || 0).div(100).div(12);
      const decN = new Decimal(years || 0).mul(12);
      const decContr = new Decimal(contribution || 0);

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

      // Generate schedule data for recharts & table
      const schedule = [];
      for (let i = 0; i <= years; i++) {
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
  }, [principal, rate, years, contribution]);"""

new_memo = """  const { futureValue, totalContributions, totalInterest, scheduleData } = useMemo(() => {
    return calculateCompoundInterest(principal, rate, years, contribution);
  }, [principal, rate, years, contribution]);"""

content = content.replace(old_memo, new_memo)

with open('src/pages/calculators/CompoundInterest.tsx', 'w') as f:
    f.write(content)
