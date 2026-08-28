import fs from 'fs';
import path from 'path';

const calculatorsToAdd = [
  {
    id: "mortgage-affordability",
    path: "/calculators/mortgage-affordability",
    fallbackTitle: "Mortgage Affordability",
    description: "Calculate how much house you can afford.",
    category: "real-estate",
    tags: ["mortgage", "afford", "house", "budget", "loan"],
    translations: {
      en: { title: "Mortgage Affordability", description: "Calculate how much house you can afford based on your income." },
      he: { title: "כמה משכנתא אני יכול לקחת?", description: "חשב מהו תקציב קניית הדירה שלך בהתבסס על ההכנסה וההוצאות שלך." },
      es: { title: "Asequibilidad de Hipoteca", description: "Calcula cuánta casa puedes permitirte." },
      fr: { title: "Capacité d'Emprunt Immobilier", description: "Calculez le montant que vous pouvez emprunter." },
      ar: { title: "القدرة على تحمل الرهن العقاري", description: "احسب مقدار المنزل الذي يمكنك تحمل تكلفته." },
    },
    componentName: "MortgageAffordability",
    componentContent: `import React, { useState } from 'react';
import { Home } from 'lucide-react';
import { useI18n } from '../../contexts/i18n';

export default function MortgageAffordability() {
  const { t } = useI18n();
  const [income, setIncome] = useState<number>(15000);
  const [debts, setDebts] = useState<number>(2000);
  const [downPayment, setDownPayment] = useState<number>(300000);
  const [interestRate, setInterestRate] = useState<number>(4.5);
  const [loanTerm, setLoanTerm] = useState<number>(30);

  const maxMonthlyPayment = (income * 0.36) - debts;
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = loanTerm * 12;
  const maxLoan = monthlyRate > 0 
    ? maxMonthlyPayment * ((Math.pow(1 + monthlyRate, numPayments) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, numPayments)))
    : maxMonthlyPayment * numPayments;
    
  const maxHomePrice = Math.max(0, maxLoan + downPayment);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <Home className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Mortgage Affordability Calculator
        </h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Monthly Income</label>
            <input type="number" value={income || ''} onChange={e => setIncome(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Monthly Debts</label>
            <input type="number" value={debts || ''} onChange={e => setDebts(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Down Payment</label>
            <input type="number" value={downPayment || ''} onChange={e => setDownPayment(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Interest Rate (%)</label>
              <input type="number" step="0.1" value={interestRate || ''} onChange={e => setInterestRate(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Term (Years)</label>
              <input type="number" value={loanTerm || ''} onChange={e => setLoanTerm(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-900/10 p-6 sm:p-8 rounded-3xl flex flex-col justify-center">
          <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-2">Estimated Max Home Price</p>
          <p className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            {maxHomePrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-indigo-100 dark:border-indigo-800/30">
              <span className="text-slate-600 dark:text-slate-400">Max Loan Amount</span>
              <span className="font-semibold text-slate-900 dark:text-white">{Math.max(0, maxLoan).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-indigo-100 dark:border-indigo-800/30">
              <span className="text-slate-600 dark:text-slate-400">Max Monthly Payment</span>
              <span className="font-semibold text-slate-900 dark:text-white">{Math.max(0, maxMonthlyPayment).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`
  },
  {
    id: "refinance",
    path: "/calculators/refinance",
    fallbackTitle: "Refinance Calculator",
    description: "Calculate savings from refinancing your mortgage.",
    category: "real-estate",
    tags: ["mortgage", "refinance", "loan", "savings", "house"],
    translations: {
      en: { title: "Refinance Calculator", description: "Calculate potential savings from refinancing your mortgage." },
      he: { title: "מחשבון מיחזור משכנתא", description: "בדוק האם שווה לך למחזר את המשכנתא ומה יהיה החיסכון." },
      es: { title: "Calculadora de Refinanciamiento", description: "Calcula los ahorros al refinanciar." },
      fr: { title: "Calculatrice de Refinancement", description: "Calculez les économies potentielles d'un refinancement." },
      ar: { title: "حاسبة إعادة التمويل", description: "احسب المدخرات المحتملة من إعادة تمويل رهنك العقاري." },
    },
    componentName: "Refinance",
    componentContent: `import React, { useState } from 'react';
import { PiggyBank } from 'lucide-react';

export default function Refinance() {
  const [currentBalance, setCurrentBalance] = useState<number>(300000);
  const [currentRate, setCurrentRate] = useState<number>(5.5);
  const [remainingYears, setRemainingYears] = useState<number>(25);
  
  const [newRate, setNewRate] = useState<number>(4.0);
  const [newYears, setNewYears] = useState<number>(25);
  const [closingCosts, setClosingCosts] = useState<number>(3000);

  const calcPayment = (principal: number, rate: number, years: number) => {
    const monthlyRate = rate / 100 / 12;
    const numPayments = years * 12;
    if (monthlyRate === 0) return principal / numPayments;
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
  };

  const currentPayment = calcPayment(currentBalance, currentRate, remainingYears);
  const newPayment = calcPayment(currentBalance + closingCosts, newRate, newYears);
  const monthlySavings = currentPayment - newPayment;
  const breakEvenMonths = monthlySavings > 0 ? closingCosts / monthlySavings : 0;
  
  const currentTotal = currentPayment * remainingYears * 12;
  const newTotal = newPayment * newYears * 12;
  const lifetimeSavings = currentTotal - newTotal;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <PiggyBank className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Refinance Calculator
        </h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Current Loan</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Loan Balance</label>
              <input type="number" value={currentBalance || ''} onChange={e => setCurrentBalance(Number(e.target.value))} className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Rate (%)</label>
                <input type="number" step="0.1" value={currentRate || ''} onChange={e => setCurrentRate(Number(e.target.value))} className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Remaining Years</label>
                <input type="number" value={remainingYears || ''} onChange={e => setRemainingYears(Number(e.target.value))} className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
          </div>
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl space-y-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">New Loan</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">New Rate (%)</label>
                <input type="number" step="0.1" value={newRate || ''} onChange={e => setNewRate(Number(e.target.value))} className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">New Term (Years)</label>
                <input type="number" value={newYears || ''} onChange={e => setNewYears(Number(e.target.value))} className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Closing Costs</label>
              <input type="number" value={closingCosts || ''} onChange={e => setClosingCosts(Number(e.target.value))} className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
        </div>
        <div className="bg-slate-900 dark:bg-slate-800 p-6 sm:p-8 rounded-3xl flex flex-col justify-center text-white">
          <p className="text-sm text-slate-400 font-medium mb-2">Lifetime Savings</p>
          <p className={\`text-4xl sm:text-5xl font-bold mb-6 \${lifetimeSavings > 0 ? 'text-emerald-400' : 'text-red-400'}\`}>
            {lifetimeSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-slate-800">
              <span className="text-slate-400">Monthly Savings</span>
              <span className={\`font-semibold \${monthlySavings > 0 ? 'text-emerald-400' : 'text-red-400'}\`}>{monthlySavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-800">
              <span className="text-slate-400">Break-Even Point</span>
              <span className="font-semibold">{breakEvenMonths > 0 ? \`\${Math.ceil(breakEvenMonths)} months\` : 'Never'}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-800">
              <span className="text-slate-400">Old Monthly</span>
              <span className="font-semibold">{currentPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-800">
              <span className="text-slate-400">New Monthly</span>
              <span className="font-semibold">{newPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`
  },
  {
    id: "vat",
    path: "/calculators/vat",
    fallbackTitle: "VAT / Sales Tax Calculator",
    description: "Calculate VAT or Sales Tax easily.",
    category: "finance",
    tags: ["vat", "tax", "sales", "business", "finance"],
    translations: {
      en: { title: "VAT Calculator", description: "Calculate VAT or Sales Tax easily." },
      he: { title: "מחשבון מע\"מ", description: "הוסף או הפחת מע\"מ בקלות." },
      es: { title: "Calculadora de IVA", description: "Calcula el IVA o impuesto sobre las ventas." },
      fr: { title: "Calculatrice de TVA", description: "Calculez facilement la TVA." },
      ar: { title: "حاسبة ضريبة القيمة المضافة", description: "احسب ضريبة القيمة المضافة بسهولة." },
    },
    componentName: "Vat",
    componentContent: `import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

export default function Vat() {
  const [amount, setAmount] = useState<number>(100);
  const [rate, setRate] = useState<number>(17); // Default IL VAT
  
  const taxAmountAdd = amount * (rate / 100);
  const totalAdd = amount + taxAmountAdd;
  
  const taxAmountSub = amount - (amount / (1 + (rate / 100)));
  const baseSub = amount - taxAmountSub;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/30 rounded-2xl flex items-center justify-center text-sky-600 dark:text-sky-400">
          <Calculator className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          VAT / Sales Tax
        </h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Amount</label>
            <input type="number" value={amount || ''} onChange={e => setAmount(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tax Rate (%)</label>
            <input type="number" step="0.1" value={rate || ''} onChange={e => setRate(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500" />
            <div className="flex gap-2 mt-3">
              {[17, 20, 21].map(r => (
                <button key={r} onClick={() => setRate(r)} className={\`px-3 py-1 rounded-lg text-sm font-medium transition-colors \${rate === r ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}\`}>
                  {r}%
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-sky-50 dark:bg-sky-900/10 p-6 rounded-3xl">
            <h3 className="text-sky-800 dark:text-sky-300 font-semibold mb-4">Adding Tax (Amount is Net)</h3>
            <div className="flex justify-between items-center py-2 border-b border-sky-100 dark:border-sky-800/30">
              <span className="text-slate-600 dark:text-slate-400">Net Amount</span>
              <span className="font-medium text-slate-900 dark:text-white">{amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-sky-100 dark:border-sky-800/30">
              <span className="text-slate-600 dark:text-slate-400">Tax Amount</span>
              <span className="font-medium text-slate-900 dark:text-white">{taxAmountAdd.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-2 pt-4">
              <span className="text-sky-900 dark:text-sky-200 font-bold">Gross Amount</span>
              <span className="text-xl font-bold text-sky-600 dark:text-sky-400">{totalAdd.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl">
            <h3 className="text-slate-800 dark:text-slate-300 font-semibold mb-4">Removing Tax (Amount is Gross)</h3>
            <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-400">Gross Amount</span>
              <span className="font-medium text-slate-900 dark:text-white">{amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-400">Tax Amount</span>
              <span className="font-medium text-slate-900 dark:text-white">{taxAmountSub.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-2 pt-4">
              <span className="text-slate-900 dark:text-slate-200 font-bold">Net Amount</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white">{baseSub.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`
  },
  {
    id: "break-even",
    path: "/calculators/break-even",
    fallbackTitle: "Break-Even Point Calculator",
    description: "Calculate when your business will become profitable.",
    category: "finance",
    tags: ["business", "profit", "breakeven", "sales", "finance"],
    translations: {
      en: { title: "Break-Even Calculator", description: "Calculate your break-even point." },
      he: { title: "מחשבון נקודת איזון", description: "חשב מתי העסק שלך יתחיל להרוויח." },
      es: { title: "Punto de Equilibrio", description: "Calcula el punto de equilibrio de tu negocio." },
      fr: { title: "Seuil de Rentabilité", description: "Calculez votre seuil de rentabilité." },
      ar: { title: "نقطة التعادل", description: "احسب نقطة التعادل لعملك." },
    },
    componentName: "BreakEven",
    componentContent: `import React, { useState } from 'react';
import { Target } from 'lucide-react';

export default function BreakEven() {
  const [fixedCosts, setFixedCosts] = useState<number>(10000);
  const [pricePerUnit, setPricePerUnit] = useState<number>(50);
  const [variableCostPerUnit, setVariableCostPerUnit] = useState<number>(20);

  const contributionMargin = pricePerUnit - variableCostPerUnit;
  const contributionMarginRatio = pricePerUnit > 0 ? contributionMargin / pricePerUnit : 0;
  
  const breakEvenUnits = contributionMargin > 0 ? fixedCosts / contributionMargin : 0;
  const breakEvenRevenue = breakEvenUnits * pricePerUnit;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400">
          <Target className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Break-Even Calculator
        </h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Fixed Costs</label>
            <input type="number" value={fixedCosts || ''} onChange={e => setFixedCosts(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500" />
            <p className="text-xs text-slate-500 mt-1">Rent, salaries, insurance, etc.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Price Per Unit</label>
            <input type="number" value={pricePerUnit || ''} onChange={e => setPricePerUnit(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Variable Cost Per Unit</label>
            <input type="number" value={variableCostPerUnit || ''} onChange={e => setVariableCostPerUnit(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500" />
            <p className="text-xs text-slate-500 mt-1">Materials, packaging, commissions, etc.</p>
          </div>
        </div>
        <div className="bg-slate-900 dark:bg-slate-800 p-6 sm:p-8 rounded-3xl flex flex-col justify-center text-white">
          <p className="text-sm text-slate-400 font-medium mb-2">Break-Even Units</p>
          <p className="text-4xl sm:text-5xl font-bold text-orange-400 mb-6">
            {Math.ceil(breakEvenUnits).toLocaleString()}
          </p>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-slate-800">
              <span className="text-slate-400">Break-Even Revenue</span>
              <span className="font-semibold text-white">{breakEvenRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-800">
              <span className="text-slate-400">Contribution Margin</span>
              <span className="font-semibold text-white">{contributionMargin.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-800">
              <span className="text-slate-400">Margin Ratio</span>
              <span className="font-semibold text-white">{(contributionMarginRatio * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`
  },
  {
    id: "inflation",
    path: "/calculators/inflation",
    fallbackTitle: "Inflation Calculator",
    description: "Calculate the impact of inflation on purchasing power.",
    category: "finance",
    tags: ["inflation", "money", "purchasing power", "economy", "finance"],
    translations: {
      en: { title: "Inflation Calculator", description: "Calculate the impact of inflation over time." },
      he: { title: "מחשבון אינפלציה", description: "חשב את השפעת האינפלציה על כוח הקנייה לאורך זמן." },
      es: { title: "Calculadora de Inflación", description: "Calcula el impacto de la inflación a lo largo del tiempo." },
      fr: { title: "Calculatrice d'Inflation", description: "Calculez l'impact de l'inflation au fil du temps." },
      ar: { title: "حاسبة التضخم", description: "احسب تأثير التضخم بمرور الوقت." },
    },
    componentName: "Inflation",
    componentContent: `import React, { useState } from 'react';
import { TrendingDown } from 'lucide-react';

export default function Inflation() {
  const [amount, setAmount] = useState<number>(10000);
  const [rate, setRate] = useState<number>(3.5);
  const [years, setYears] = useState<number>(10);

  const futureValue = amount * Math.pow(1 + rate / 100, years);
  const purchasingPower = amount / Math.pow(1 + rate / 100, years);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center text-rose-600 dark:text-rose-400">
          <TrendingDown className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Inflation Calculator
        </h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Initial Amount</label>
            <input type="number" value={amount || ''} onChange={e => setAmount(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Average Inflation Rate (%)</label>
            <input type="number" step="0.1" value={rate || ''} onChange={e => setRate(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Years</label>
            <input type="number" value={years || ''} onChange={e => setYears(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500" />
          </div>
        </div>
        <div className="bg-rose-50 dark:bg-rose-900/10 p-6 sm:p-8 rounded-3xl flex flex-col justify-center">
          <p className="text-sm text-rose-600 dark:text-rose-400 font-medium mb-2">Purchasing Power Value</p>
          <p className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            {purchasingPower.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            In {years} years, your {amount.toLocaleString()} will only buy what {purchasingPower.toLocaleString(undefined, { maximumFractionDigits: 2 })} buys today.
          </p>
          
          <div className="mt-4 pt-4 border-t border-rose-200 dark:border-rose-900/30">
            <p className="text-sm text-rose-600 dark:text-rose-400 font-medium mb-2">Future Cost</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {futureValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              An item costing {amount.toLocaleString()} today will cost this much in {years} years.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
`
  },
  {
    id: "credit-card-payoff",
    path: "/calculators/credit-card-payoff",
    fallbackTitle: "Credit Card Payoff",
    description: "Calculate how long it takes to pay off credit card debt.",
    category: "finance",
    tags: ["credit card", "debt", "payoff", "loan", "interest"],
    translations: {
      en: { title: "Credit Card Payoff", description: "Find out how long it will take to pay off your credit card." },
      he: { title: "סילוק חוב כרטיס אשראי", description: "חשב כמה זמן ייקח לחסל את החוב בכרטיס האשראי שלך." },
      es: { title: "Pago de Tarjeta de Crédito", description: "Descubre cuánto tiempo tomará pagar tu tarjeta de crédito." },
      fr: { title: "Remboursement de Carte de Crédit", description: "Découvrez combien de temps il faudra pour rembourser votre carte." },
      ar: { title: "سداد بطاقة الائتمان", description: "اكتشف المدة التي ستستغرقها لسداد بطاقتك الائتمانية." },
    },
    componentName: "CreditCardPayoff",
    componentContent: `import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';

export default function CreditCardPayoff() {
  const [balance, setBalance] = useState<number>(5000);
  const [rate, setRate] = useState<number>(18.9);
  const [payment, setPayment] = useState<number>(150);

  const calculatePayoff = () => {
    const monthlyRate = rate / 100 / 12;
    if (payment <= balance * monthlyRate) {
      return { months: Infinity, interest: Infinity };
    }
    
    // Formula: N = -log(1 - iA/P) / log(1 + i)
    const months = -Math.log(1 - (monthlyRate * balance) / payment) / Math.log(1 + monthlyRate);
    const totalPaid = months * payment;
    const totalInterest = totalPaid - balance;
    
    return { months: Math.ceil(months), interest: totalInterest, total: totalPaid };
  };

  const result = calculatePayoff();

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400">
          <CreditCard className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Credit Card Payoff
        </h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Credit Card Balance</label>
            <input type="number" value={balance || ''} onChange={e => setBalance(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Interest Rate (APR %)</label>
            <input type="number" step="0.1" value={rate || ''} onChange={e => setRate(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Monthly Payment</label>
            <input type="number" value={payment || ''} onChange={e => setPayment(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500" />
          </div>
        </div>
        <div className="bg-slate-900 dark:bg-slate-800 p-6 sm:p-8 rounded-3xl flex flex-col justify-center text-white">
          {result.months === Infinity ? (
            <div className="text-center p-4">
              <p className="text-red-400 font-bold text-xl">Payment Too Low</p>
              <p className="text-slate-400 text-sm mt-2">Your payment doesn't cover the monthly interest. You will never pay off this debt.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-400 font-medium mb-2">Time to Payoff</p>
              <p className="text-4xl sm:text-5xl font-bold text-red-400 mb-6">
                {Math.floor(result.months / 12)} yrs {result.months % 12} mos
              </p>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-800">
                  <span className="text-slate-400">Total Interest Paid</span>
                  <span className="font-semibold text-white">{result.interest.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-800">
                  <span className="text-slate-400">Total Paid (Prin + Int)</span>
                  <span className="font-semibold text-white">{result.total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
`
  },
  {
    id: "bmr",
    path: "/calculators/bmr",
    fallbackTitle: "BMR / TDEE Calculator",
    description: "Calculate your daily calorie needs.",
    category: "health",
    tags: ["bmr", "tdee", "calories", "health", "fitness", "diet"],
    translations: {
      en: { title: "Calorie Calculator (TDEE)", description: "Calculate your daily calorie needs." },
      he: { title: "מחשבון שריפת קלוריות (BMR/TDEE)", description: "חשב כמה קלוריות הגוף שלך שורף ביום." },
      es: { title: "Calculadora de Calorías (TDEE)", description: "Calcula tus necesidades calóricas diarias." },
      fr: { title: "Calculatrice de Calories (TDEE)", description: "Calculez vos besoins caloriques quotidiens." },
      ar: { title: "حاسبة السعرات الحرارية", description: "احسب احتياجاتك اليومية من السعرات الحرارية." },
    },
    componentName: "Bmr",
    componentContent: `import React, { useState } from 'react';
import { Activity } from 'lucide-react';

export default function Bmr() {
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState<number>(75);
  const [height, setHeight] = useState<number>(175);
  const [activity, setActivity] = useState<number>(1.2);

  // Mifflin-St Jeor Equation
  const baseBmr = (10 * weight) + (6.25 * height) - (5 * age);
  const bmr = gender === 'male' ? baseBmr + 5 : baseBmr - 161;
  const tdee = bmr * activity;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center text-teal-600 dark:text-teal-400">
          <Activity className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Daily Calorie Needs
        </h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Age</label>
              <input type="number" value={age || ''} onChange={e => setAge(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Gender</label>
              <select value={gender} onChange={e => setGender(e.target.value as any)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white">
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Weight (kg)</label>
              <input type="number" value={weight || ''} onChange={e => setWeight(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Height (cm)</label>
              <input type="number" value={height || ''} onChange={e => setHeight(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Activity Level</label>
            <select value={activity} onChange={e => setActivity(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white">
              <option value={1.2}>Sedentary (little/no exercise)</option>
              <option value={1.375}>Lightly active (1-3 days/week)</option>
              <option value={1.55}>Moderately active (3-5 days/week)</option>
              <option value={1.725}>Very active (6-7 days/week)</option>
              <option value={1.9}>Extra active (physical job/2x training)</option>
            </select>
          </div>
        </div>
        <div className="bg-teal-50 dark:bg-teal-900/10 p-6 sm:p-8 rounded-3xl flex flex-col justify-center">
          <p className="text-sm text-teal-600 dark:text-teal-400 font-medium mb-2">Maintain Weight (TDEE)</p>
          <p className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-2">
            {Math.round(tdee).toLocaleString()} <span className="text-2xl text-slate-500">kcal/day</span>
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Total Daily Energy Expenditure</p>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-t border-teal-100 dark:border-teal-800/30">
              <span className="text-slate-600 dark:text-slate-400">Mild Weight Loss (0.25kg/wk)</span>
              <span className="font-semibold text-slate-900 dark:text-white">{Math.round(tdee - 250).toLocaleString()} kcal</span>
            </div>
            <div className="flex justify-between items-center py-3 border-t border-teal-100 dark:border-teal-800/30">
              <span className="text-slate-600 dark:text-slate-400">Weight Loss (0.5kg/wk)</span>
              <span className="font-semibold text-slate-900 dark:text-white">{Math.round(tdee - 500).toLocaleString()} kcal</span>
            </div>
            <div className="flex justify-between items-center py-3 border-t border-teal-100 dark:border-teal-800/30">
              <span className="text-slate-600 dark:text-slate-400">Weight Gain (0.5kg/wk)</span>
              <span className="font-semibold text-slate-900 dark:text-white">{Math.round(tdee + 500).toLocaleString()} kcal</span>
            </div>
            <div className="flex justify-between items-center py-3 border-t border-teal-100 dark:border-teal-800/30">
              <span className="text-slate-600 dark:text-slate-400">Basal Metabolic Rate (BMR)</span>
              <span className="font-semibold text-slate-900 dark:text-white">{Math.round(bmr).toLocaleString()} kcal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`
  },
  {
    id: "water-intake",
    path: "/calculators/water-intake",
    fallbackTitle: "Water Intake Calculator",
    description: "Calculate how much water you should drink daily.",
    category: "health",
    tags: ["water", "hydration", "health", "fitness", "drink"],
    translations: {
      en: { title: "Water Intake Calculator", description: "Calculate how much water you should drink daily." },
      he: { title: "מחשבון צריכת מים", description: "חשב כמה מים עליך לשתות ביום בהתאם למשקל ולפעילות שלך." },
      es: { title: "Calculadora de Agua", description: "Calcula cuánta agua debes beber al día." },
      fr: { title: "Calculatrice d'Hydratation", description: "Calculez la quantité d'eau que vous devez boire par jour." },
      ar: { title: "حاسبة استهلاك المياه", description: "احسب كمية الماء التي يجب أن تشربها يوميًا." },
    },
    componentName: "WaterIntake",
    componentContent: `import React, { useState } from 'react';
import { Droplet } from 'lucide-react';

export default function WaterIntake() {
  const [weight, setWeight] = useState<number>(70);
  const [exerciseMins, setExerciseMins] = useState<number>(30);
  
  // Base water: weight(kg) * 35ml. Plus 350ml per 30 mins exercise
  const baseWater = weight * 35;
  const exerciseWater = (exerciseMins / 30) * 350;
  const totalWaterMl = baseWater + exerciseWater;
  const totalWaterLiters = totalWaterMl / 1000;
  const cups = totalWaterMl / 250; // standard 250ml cup

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
          <Droplet className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Water Intake Calculator
        </h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Weight (kg)</label>
            <input type="number" value={weight || ''} onChange={e => setWeight(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Daily Exercise (Minutes)</label>
            <input type="number" value={exerciseMins || ''} onChange={e => setExerciseMins(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/10 p-6 sm:p-8 rounded-3xl flex flex-col justify-center text-center">
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">Daily Goal</p>
          <p className="text-4xl sm:text-6xl font-bold text-slate-900 dark:text-white mb-2">
            {totalWaterLiters.toFixed(1)} <span className="text-2xl sm:text-3xl text-slate-500">Liters</span>
          </p>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-4">
            Or about <span className="font-bold text-blue-600 dark:text-blue-400">{Math.round(cups)}</span> glasses (250ml)
          </p>
        </div>
      </div>
    </div>
  );
}
`
  },
  {
    id: "date-difference",
    path: "/calculators/date-difference",
    fallbackTitle: "Date Difference",
    description: "Calculate the exact number of days between two dates.",
    category: "lifestyle",
    tags: ["date", "time", "days", "calendar", "business days"],
    translations: {
      en: { title: "Date Difference Calculator", description: "Calculate exact days between dates." },
      he: { title: "מחשבון הפרשי תאריכים", description: "חשב מספר ימים בדיוק בין שני תאריכים (כולל ימי עסקים)." },
      es: { title: "Diferencia de Fechas", description: "Calcula los días exactos entre fechas." },
      fr: { title: "Différence de Dates", description: "Calculez les jours exacts entre deux dates." },
      ar: { title: "حاسبة فرق التواريخ", description: "احسب الأيام الدقيقة بين التواريخ." },
    },
    componentName: "DateDifference",
    componentContent: `import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

export default function DateDifference() {
  const [date1, setDate1] = useState<string>(new Date().toISOString().split('T')[0]);
  const [date2, setDate2] = useState<string>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Rough estimate of business days (5/7 of total days)
  let businessDays = 0;
  const curDate = new Date(Math.min(d1.getTime(), d2.getTime()));
  const endDate = new Date(Math.max(d1.getTime(), d2.getTime()));
  
  while (curDate < endDate) {
    const dayOfWeek = curDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) businessDays++;
    curDate.setDate(curDate.getDate() + 1);
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400">
          <Calendar className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Date Difference
        </h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Start Date</label>
            <input type="date" value={date1} onChange={e => setDate1(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">End Date</label>
            <input type="date" value={date2} onChange={e => setDate2(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white" />
          </div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/10 p-6 sm:p-8 rounded-3xl flex flex-col justify-center">
          <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-2">Total Difference</p>
          <p className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            {diffDays} <span className="text-2xl sm:text-3xl text-slate-500 font-normal">Days</span>
          </p>
          <div className="space-y-4 pt-4 border-t border-purple-200 dark:border-purple-900/30">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">Weekdays (Mon-Fri)</span>
              <span className="font-semibold text-slate-900 dark:text-white">{businessDays} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">Weeks</span>
              <span className="font-semibold text-slate-900 dark:text-white">{(diffDays / 7).toFixed(1)} weeks</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">Years</span>
              <span className="font-semibold text-slate-900 dark:text-white">{(diffDays / 365.25).toFixed(2)} years</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`
  },
  {
    id: "bill-splitter",
    path: "/calculators/bill-splitter",
    fallbackTitle: "Bill Splitter",
    description: "Split restaurant bills and tips among friends.",
    category: "lifestyle",
    tags: ["restaurant", "bill", "split", "tip", "money", "friends"],
    translations: {
      en: { title: "Bill Splitter", description: "Split bills and tips easily." },
      he: { title: "חלוקת חשבון במסעדה", description: "חלק חשבון וטיפ בקלות בין חברים." },
      es: { title: "Divisor de Cuenta", description: "Divide cuentas y propinas fácilmente." },
      fr: { title: "Partage d'Addition", description: "Partagez facilement les additions et pourboires." },
      ar: { title: "مقسم الفاتورة", description: "قسّم الفواتير والإكراميات بسهولة." },
    },
    componentName: "BillSplitter",
    componentContent: `import React, { useState } from 'react';
import { Users } from 'lucide-react';

export default function BillSplitter() {
  const [totalBill, setTotalBill] = useState<number>(250);
  const [tipPercentage, setTipPercentage] = useState<number>(15);
  const [numPeople, setNumPeople] = useState<number>(4);

  const tipAmount = totalBill * (tipPercentage / 100);
  const grandTotal = totalBill + tipAmount;
  const perPerson = numPeople > 0 ? grandTotal / numPeople : 0;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400">
          <Users className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Bill Splitter
        </h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Total Bill Amount</label>
            <input type="number" value={totalBill || ''} onChange={e => setTotalBill(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tip Percentage (%)</label>
            <input type="number" value={tipPercentage || ''} onChange={e => setTipPercentage(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500" />
            <div className="flex gap-2 mt-3">
              {[10, 12, 15, 18, 20].map(r => (
                <button key={r} onClick={() => setTipPercentage(r)} className={\`px-3 py-1 rounded-lg text-sm font-medium transition-colors \${tipPercentage === r ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}\`}>
                  {r}%
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Number of People</label>
            <div className="flex items-center">
              <button onClick={() => setNumPeople(Math.max(1, numPeople - 1))} className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-l-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">-</button>
              <input type="number" value={numPeople || ''} onChange={e => setNumPeople(Number(e.target.value))} className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border-y border-slate-200 dark:border-slate-700 focus:ring-0 text-center" />
              <button onClick={() => setNumPeople(numPeople + 1)} className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-r-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">+</button>
            </div>
          </div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/10 p-6 sm:p-8 rounded-3xl flex flex-col justify-center">
          <p className="text-sm text-amber-600 dark:text-amber-400 font-medium mb-2">Each Person Pays</p>
          <p className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            {perPerson.toFixed(2)}
          </p>
          <div className="space-y-4 pt-4 border-t border-amber-200 dark:border-amber-900/30">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">Bill Amount</span>
              <span className="font-medium text-slate-900 dark:text-white">{totalBill.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">Tip Amount</span>
              <span className="font-medium text-slate-900 dark:text-white">{tipAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-amber-900 dark:text-amber-200 font-bold">Total with Tip</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`
  }
];

// Write components
for (const calc of calculatorsToAdd) {
  const filePath = path.join('src', 'pages', 'calculators', `${calc.componentName}.tsx`);
  fs.writeFileSync(filePath, calc.componentContent);
  console.log(`Created component: ${filePath}`);
}

// Update src/data/calculators.ts
const dataFilePath = path.join('src', 'data', 'calculators.ts');
let content = fs.readFileSync(dataFilePath, 'utf8');

// 1. Inject translations
const translationEntries = calculatorsToAdd.map(c => {
  return `  "${c.id}": {
    en: { title: "${c.translations.en.title}", description: "${c.translations.en.description}" },
    he: { title: "${c.translations.he.title}", description: "${c.translations.he.description}" },
    es: { title: "${c.translations.es.title}", description: "${c.translations.es.description}" },
    fr: { title: "${c.translations.fr.title}", description: "${c.translations.fr.description}" },
    ar: { title: "${c.translations.ar.title}", description: "${c.translations.ar.description}" },
  },`;
}).join('\n');

content = content.replace('export const dynamicTranslations: Record<string, Record<string, { title: string; description: string }>> = {', `export const dynamicTranslations: Record<string, Record<string, { title: string; description: string }>> = {\n${translationEntries}`);

// 2. Inject calculators metadata
const metaEntries = calculatorsToAdd.map(c => {
  return `  {
    id: "${c.id}",
    path: "${c.path}",
    fallbackTitle: "${c.fallbackTitle}",
    description: "${c.description}",
    category: "${c.category}",
    tags: ${JSON.stringify(c.tags)},
  },`;
}).join('\n');

content = content.replace('export const calculators: CalculatorMeta[] = [', `export const calculators: CalculatorMeta[] = [\n${metaEntries}`);

fs.writeFileSync(dataFilePath, content);
console.log('Updated src/data/calculators.ts');
