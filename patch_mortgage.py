import re

with open('src/pages/calculators/MortgageCalculator.tsx', 'r') as f:
    content = f.read()

# Add import
import_stmt = "import { calculateMortgage } from '../../lib/math/finance';\n"
content = content.replace("import { getGuideData } from '../../data/guideTranslations';", 
                          "import { getGuideData } from '../../data/guideTranslations';\n" + import_stmt)

# Replace useMemo block
old_memo = """  const { monthlyPayment, totalInterest } = useMemo(() => {
    try {
      const decP = new Decimal(principal || 0);
      const decR = new Decimal(rate || 0).div(100).div(12);
      const decN = new Decimal(years || 0).mul(12);

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
  }, [principal, rate, years]);"""

new_memo = """  const { monthlyPayment, totalInterest } = useMemo(() => {
    return calculateMortgage(principal, rate, years);
  }, [principal, rate, years]);"""

content = content.replace(old_memo, new_memo)

with open('src/pages/calculators/MortgageCalculator.tsx', 'w') as f:
    f.write(content)
