const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const imports = `import BmiCalculator from './pages/BmiCalculator';
import TipCalculator from './pages/TipCalculator';
import SalaryCalculator from './pages/SalaryCalculator';
import AgeCalculator from './pages/AgeCalculator';
`;

code = code.replace(/import { useI18n } from '.\/contexts\/i18n';/, imports + "\nimport { useI18n } from './contexts/i18n';");

const newTabs = `    { id: 'mortgage', path: '/mortgage-calculator', label: t.mortgageTitle },
    { id: 'compound', path: '/compound-interest', label: t.compoundTitle },
    { id: 'percentage', path: '/percentage-finder', label: t.percFinderTitle },
    { id: 'unit', path: '/unit-converter', label: t.unitConvTitle },
    { id: 'bmi', path: '/bmi-calculator', label: t.bmiTitle },
    { id: 'tip', path: '/tip-calculator', label: t.tipTitle },
    { id: 'salary', path: '/salary-calculator', label: t.salaryTitle },
    { id: 'age', path: '/age-calculator', label: t.ageTitle },`;

code = code.replace(/    \{ id: 'mortgage'[\s\S]*?\{ id: 'unit', path: '\/unit-converter', label: t.unitConvTitle \},/m, newTabs);

const newRoutes = `          <Route path="/mortgage-calculator" element={<MortgageCalculator />} />
          <Route path="/compound-interest" element={<CompoundInterest />} />
          <Route path="/percentage-finder" element={<PercentageFinder />} />
          <Route path="/unit-converter" element={<UnitConverter />} />
          <Route path="/bmi-calculator" element={<BmiCalculator />} />
          <Route path="/tip-calculator" element={<TipCalculator />} />
          <Route path="/salary-calculator" element={<SalaryCalculator />} />
          <Route path="/age-calculator" element={<AgeCalculator />} />`;

code = code.replace(/          <Route path="\/mortgage-calculator"[\s\S]*?<Route path="\/unit-converter".*\/>/m, newRoutes);

fs.writeFileSync('src/App.tsx', code);
