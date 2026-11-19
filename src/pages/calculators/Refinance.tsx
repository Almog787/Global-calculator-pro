import { useUrlState } from '../../hooks/useUrlState';
import React from 'react';
import { PiggyBank } from 'lucide-react';
import { useI18n, Language } from '../../contexts/i18n';

const dict: Record<Language, {
  title: string;
  currentLoan: string;
  loanBalance: string;
  ratePct: string;
  remainingYears: string;
  newLoan: string;
  newRatePct: string;
  newTermYears: string;
  closingCosts: string;
  lifetimeSavings: string;
  monthlySavings: string;
  breakEvenPoint: string;
  months: string;
  never: string;
  oldMonthly: string;
  newMonthly: string;
}> = {
  en: {
    title: 'Mortgage Refinance Calculator',
    currentLoan: 'Current Loan',
    loanBalance: 'Loan Balance',
    ratePct: 'Rate (%)',
    remainingYears: 'Remaining Years',
    newLoan: 'New Loan',
    newRatePct: 'New Rate (%)',
    newTermYears: 'New Term (Years)',
    closingCosts: 'Closing Costs',
    lifetimeSavings: 'Lifetime Savings',
    monthlySavings: 'Monthly Savings',
    breakEvenPoint: 'Break-Even Point',
    months: 'months',
    never: 'Never',
    oldMonthly: 'Old Monthly',
    newMonthly: 'New Monthly',
  },
  he: {
    title: 'מחשבון מחזור משכנתא והלוואות',
    currentLoan: 'הלוואה נוכחית',
    loanBalance: 'יתרת הלוואה לסילוק',
    ratePct: 'ריבית נוכחית (%)',
    remainingYears: 'שנים שנותרו',
    newLoan: 'הלוואה חדשה',
    newRatePct: 'ריבית חדשה (%)',
    newTermYears: 'תקופה חדשה (שנים)',
    closingCosts: 'עמלות פירעון ועלויות סגירה',
    lifetimeSavings: 'חיסכון מצטבר כולל',
    monthlySavings: 'חיסכון חודשי',
    breakEvenPoint: 'נקודת איזון (Break-Even)',
    months: 'חודשים',
    never: 'ללא חיסכון',
    oldMonthly: 'החזר חודשי נוכחי',
    newMonthly: 'החזר חודשי חדש',
  },
  es: {
    title: 'Calculadora de Refinanciamiento Hipotecario',
    currentLoan: 'Préstamo Actual',
    loanBalance: 'Saldo Pendiente',
    ratePct: 'Tasa (%)',
    remainingYears: 'Años Restantes',
    newLoan: 'Nuevo Préstamo',
    newRatePct: 'Nueva Tasa (%)',
    newTermYears: 'Nuevo Plazo (Años)',
    closingCosts: 'Costos de Cierre',
    lifetimeSavings: 'Ahorro Total Estimado',
    monthlySavings: 'Ahorro Mensual',
    breakEvenPoint: 'Punto de Equilibrio',
    months: 'meses',
    never: 'Nunca',
    oldMonthly: 'Cuota Anterior',
    newMonthly: 'Nueva Cuota',
  },
  fr: {
    title: 'Calculateur de Refinancement et Rachat de Crédit',
    currentLoan: 'Prêt Actuel',
    loanBalance: 'Capital Restant Dû',
    ratePct: 'Taux (%)',
    remainingYears: 'Années Restantes',
    newLoan: 'Nouveau Prêt',
    newRatePct: 'Nouveau Taux (%)',
    newTermYears: 'Nouvelle Durée (Ans)',
    closingCosts: 'Frais de Dossier et Garantie',
    lifetimeSavings: 'Économie Totale',
    monthlySavings: 'Économie Mensuelle',
    breakEvenPoint: 'Seuil de Rentabilité',
    months: 'mois',
    never: 'Jamais',
    oldMonthly: 'Ancienne Mensualité',
    newMonthly: 'Nouvelle Mensualité',
  },
  ar: {
    title: 'حاسبة إعادة تمويل الرهن العقاري',
    currentLoan: 'القرض الحالي',
    loanBalance: 'رصيد القرض المتبقي',
    ratePct: 'نسبة الفائدة (%)',
    remainingYears: 'السنوات المتبقية',
    newLoan: 'القرض الجديد',
    newRatePct: 'الفائدة الجديدة (%)',
    newTermYears: 'المدة الجديدة (سنوات)',
    closingCosts: 'رسوم الإغلاق وإعادة التمويل',
    lifetimeSavings: 'إجمالي التوفير المتوقع',
    monthlySavings: 'التوفير الشهري',
    breakEvenPoint: 'نقطة التعادل',
    months: 'شهر',
    never: 'لا يوجد توفير',
    oldMonthly: 'القسط الحالي',
    newMonthly: 'القسط الجديد',
  },
  ru: {
    title: 'Калькулятор рефинансирования ипотеки',
    currentLoan: 'Текущий кредит',
    loanBalance: 'Остаток долга',
    ratePct: 'Ставка (%)',
    remainingYears: 'Осталось лет',
    newLoan: 'Новый кредит',
    newRatePct: 'Новая ставка (%)',
    newTermYears: 'Новый срок (лет)',
    closingCosts: 'Комиссии и расходы',
    lifetimeSavings: 'Общая экономия',
    monthlySavings: 'Экономия в месяц',
    breakEvenPoint: 'Точка окупаемости',
    months: 'мес.',
    never: 'Не окупается',
    oldMonthly: 'Старый платеж',
    newMonthly: 'Новый платеж',
  },
};

export default function Refinance() {
  const { lang } = useI18n();
  const t = dict[lang] || dict.en;

  const [currentBalance, setCurrentBalance] = useUrlState<number>('currentBalance', 300000);
  const [currentRate, setCurrentRate] = useUrlState<number>('currentRate', 5.5);
  const [remainingYears, setRemainingYears] = useUrlState<number>('remainingYears', 25);
  
  const [newRate, setNewRate] = useUrlState<number>('newRate', 4.0);
  const [newYears, setNewYears] = useUrlState<number>('newYears', 25);
  const [closingCosts, setClosingCosts] = useUrlState<number>('closingCosts', 3000);

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
          {t.title}
        </h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">{t.currentLoan}</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.loanBalance}</label>
              <input type="number" value={currentBalance || ''} onChange={e => setCurrentBalance(Number(e.target.value))} className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.ratePct}</label>
                <input type="number" step="0.1" value={currentRate || ''} onChange={e => setCurrentRate(Number(e.target.value))} className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.remainingYears}</label>
                <input type="number" value={remainingYears || ''} onChange={e => setRemainingYears(Number(e.target.value))} className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
          </div>
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl space-y-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">{t.newLoan}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.newRatePct}</label>
                <input type="number" step="0.1" value={newRate || ''} onChange={e => setNewRate(Number(e.target.value))} className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.newTermYears}</label>
                <input type="number" value={newYears || ''} onChange={e => setNewYears(Number(e.target.value))} className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.closingCosts}</label>
              <input type="number" value={closingCosts || ''} onChange={e => setClosingCosts(Number(e.target.value))} className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
        </div>
        <div className="bg-slate-900 dark:bg-slate-800 p-6 sm:p-8 rounded-3xl flex flex-col justify-center text-white">
          <p className="text-sm text-slate-400 font-medium mb-2">{t.lifetimeSavings}</p>
          <p className={`text-4xl sm:text-5xl font-bold mb-6 ${lifetimeSavings > 0 ? 'text-emerald-400' : 'text-red-400'}`} dir="ltr">
            {lifetimeSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-slate-800">
              <span className="text-slate-400">{t.monthlySavings}</span>
              <span className={`font-semibold ${monthlySavings > 0 ? 'text-emerald-400' : 'text-red-400'}`} dir="ltr">{monthlySavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-800">
              <span className="text-slate-400">{t.breakEvenPoint}</span>
              <span className="font-semibold">{breakEvenMonths > 0 ? `${Math.ceil(breakEvenMonths)} ${t.months}` : t.never}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-800">
              <span className="text-slate-400">{t.oldMonthly}</span>
              <span className="font-semibold" dir="ltr">{currentPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-800">
              <span className="text-slate-400">{t.newMonthly}</span>
              <span className="font-semibold" dir="ltr">{newPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

