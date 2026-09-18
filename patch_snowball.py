import re

with open('src/pages/calculators/DebtSnowball.tsx', 'r') as f:
    content = f.read()

# Add import
import_stmt = "import { calculateDebtSnowball, DebtItem } from '../../lib/math/finance';\n"
content = content.replace("import { getGuideData } from '../../data/guideTranslations';", 
                          "import { getGuideData } from '../../data/guideTranslations';\n" + import_stmt)

# Remove local DebtItem interface
content = re.sub(r'interface DebtItem \{[^}]+\}', '', content)

# Replace useEffect block
old_effect = re.search(r'  useEffect\(\(\) => \{\n    const simulatePayoff =.*?  \}, \[debts, extraPayment\]\);', content, re.DOTALL)
if old_effect:
    new_effect = """  useEffect(() => {
    setResults(calculateDebtSnowball(debts, extraPayment));
  }, [debts, extraPayment]);"""
    content = content.replace(old_effect.group(0), new_effect)
else:
    print("Could not find useEffect block")

with open('src/pages/calculators/DebtSnowball.tsx', 'w') as f:
    f.write(content)
