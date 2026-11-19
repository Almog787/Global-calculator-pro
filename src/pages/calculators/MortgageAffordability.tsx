import React, { useMemo } from 'react';
import { Home } from 'lucide-react';
import { useI18n, Language } from '../../contexts/i18n';
import { useCalculatorState } from '../../hooks/useCalculatorState';
import ShareActions from '../../components/ShareActions';

const dict: Record<Language, {
  title: string;
  monthlyIncome: string;
  monthlyDebts: string;
  downPayment: string;
  interestRate: string;
  termYears: string;
  maxHomePrice: string;
  maxLoanAmount: string;
  maxMonthlyPayment: string;
  footnote: string;
  currency: string;
}> = {
  en: {
    title: 'Mortgage Affordability Calculator',
    monthlyIncome: 'Monthly Income (Net)',
    monthlyDebts: 'Monthly Debts & Loans',
    downPayment: 'Down Payment',
    interestRate: 'Interest Rate (%)',
    termYears: 'Term (Years)',
    maxHomePrice: 'Estimated Max Home Price',
    maxLoanAmount: 'Max Loan Amount',
    maxMonthlyPayment: 'Max Monthly Payment',
    footnote: '* Based on a 36% debt-to-income rule of thumb. Consult a mortgage advisor for personalized underwriting.',
    currency: '$',
  },
  he: {
    title: 'מחשבון כמה משכנתא אפשר לקחת?',
    monthlyIncome: 'הכנסה חודשית (נטו)',
    monthlyDebts: 'הלוואות קיימות והתחייבויות (חודשי)',
    downPayment: 'הון עצמי',
    interestRate: 'ריבית משוערת (%)',
    termYears: 'תקופה (שנים)',
    maxHomePrice: 'תקציב מקסימלי לקניית דירה',
    maxLoanAmount: 'משכנתא מקסימלית',
    maxMonthlyPayment: 'החזר חודשי משוער',
    footnote: '* החישוב מבוסס על כלל אצבע שלפיו ההחזר החודשי לא יעלה על 36% מההכנסה הפנויה. יש להתייעץ עם יועץ משכנתאות.',
    currency: '₪',
  },
  es: {
    title: 'Calculadora de Capacidad Hipotecaria',
    monthlyIncome: 'Ingreso Mensual Neto',
    monthlyDebts: 'Deudas y Préstamos Mensuales',
    downPayment: 'Pago Inicial (Entrada)',
    interestRate: 'Tasa de Interés (%)',
    termYears: 'Plazo (Años)',
    maxHomePrice: 'Precio Máximo Estimado de Vivienda',
    maxLoanAmount: 'Préstamo Máximo',
    maxMonthlyPayment: 'Cuota Mensual Máxima',
    footnote: '* Basado en la regla del 36% de relación deuda-ingreso. Consulte a un asesor hipotecario.',
    currency: '€',
  },
  fr: {
    title: 'Calculateur de Capacité d\'Emprunt Immobilier',
    monthlyIncome: 'Revenu Mensuel Net',
    monthlyDebts: 'Charges et Crédits Mensuels',
    downPayment: 'Apport Personnel',
    interestRate: 'Taux d\'Intérêt (%)',
    termYears: 'Durée (Ans)',
    maxHomePrice: 'Budget Immobilier Maximal Estimé',
    maxLoanAmount: 'Capacité d\'Emprunt Maximale',
    maxMonthlyPayment: 'Mensualité Maximale',
    footnote: '* Calcul basé sur un taux d’endettement recommandé de 36 %. Consultez un courtier immobilier.',
    currency: '€',
  },
  ar: {
    title: 'حاسبة القدرة على تحمل الرهن العقاري',
    monthlyIncome: 'الدخل الشهري (الصافي)',
    monthlyDebts: 'الالتزامات والأقساط الشهرية',
    downPayment: 'الدفعة المقدمة',
    interestRate: 'نسبة الفائدة التقديرية (%)',
    termYears: 'مدة التمويل (سنوات)',
    maxHomePrice: 'أقصى ميزانية مقدرة لشراء منزل',
    maxLoanAmount: 'الحد الأقصى لمبلغ القرض',
    maxMonthlyPayment: 'أقصى قسط شهري',
    footnote: '* يعتمد الحساب على قاعدة 36% من نسبة الدين إلى الدخل. استشر مستشار تمويل عقاري.',
    currency: '$',
  },
  ru: {
    title: 'Калькулятор доступной ипотеки',
    monthlyIncome: 'Чистый доход в месяц',
    monthlyDebts: 'Текущие платежи по кредитам',
    downPayment: 'Первоначальный взнос',
    interestRate: 'Процентная ставка (%)',
    termYears: 'Срок (лет)',
    maxHomePrice: 'Максимальная стоимость жилья',
    maxLoanAmount: 'Максимальная сумма ипотеки',
    maxMonthlyPayment: 'Максимальный платеж в месяц',
    footnote: '* Расчет основан на правиле 36% долговой нагрузки (DTI). Для точного одобрения обратитесь в банк.',
    currency: '$',
  },
};

export default function MortgageAffordability() {
  const { lang } = useI18n();
  const t = dict[lang] || dict.en;
  
  const { state, updateState, saveToHistory, loadFromHistory, getHistory } = useCalculatorState('mortgage-affordability', {
    income: 15000,
    debts: 2000,
    downPayment: 300000,
    interestRate: 4.5,
    loanTerm: 30
  });

  const { income, debts, downPayment, interestRate, loanTerm } = state;

  const setIncome = (v: number) => updateState({ income: v });
  const setDebts = (v: number) => updateState({ debts: v });
  const setDownPayment = (v: number) => updateState({ downPayment: v });
  const setInterestRate = (v: number) => updateState({ interestRate: v });
  const setLoanTerm = (v: number) => updateState({ loanTerm: v });

  const { maxMonthlyPayment, maxLoan, maxHomePrice } = useMemo(() => {
    const mmp = (income * 0.36) - debts;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;
    const ml = monthlyRate > 0 
      ? mmp * ((Math.pow(1 + monthlyRate, numPayments) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, numPayments)))
      : mmp * numPayments;
      
    const mhp = Math.max(0, ml + downPayment);
    return { maxMonthlyPayment: mmp, maxLoan: ml, maxHomePrice: mhp };
  }, [income, debts, downPayment, interestRate, loanTerm]);

  const defaultCurrency = t.currency;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-surface-container-lowest rounded-3xl shadow-sm border border-border-subtle">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <Home className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">
          {t.title}
        </h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-2">
              {t.monthlyIncome}
            </label>
            <div className="relative">
              <span className="absolute top-1/2 -translate-y-1/2 ltr:left-4 rtl:right-4 text-on-surface-variant">{defaultCurrency}</span>
              <input type="number" value={income || ''} onChange={e => setIncome(Number(e.target.value))} className="w-full ltr:pl-8 rtl:pr-8 px-4 py-3 bg-surface-container-low border border-border-subtle rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-on-surface" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-2">
              {t.monthlyDebts}
            </label>
            <div className="relative">
              <span className="absolute top-1/2 -translate-y-1/2 ltr:left-4 rtl:right-4 text-on-surface-variant">{defaultCurrency}</span>
              <input type="number" value={debts || ''} onChange={e => setDebts(Number(e.target.value))} className="w-full ltr:pl-8 rtl:pr-8 px-4 py-3 bg-surface-container-low border border-border-subtle rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-on-surface" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-2">
              {t.downPayment}
            </label>
            <div className="relative">
              <span className="absolute top-1/2 -translate-y-1/2 ltr:left-4 rtl:right-4 text-on-surface-variant">{defaultCurrency}</span>
              <input type="number" value={downPayment || ''} onChange={e => setDownPayment(Number(e.target.value))} className="w-full ltr:pl-8 rtl:pr-8 px-4 py-3 bg-surface-container-low border border-border-subtle rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-on-surface" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-2">
                {t.interestRate}
              </label>
              <input type="number" step="0.1" value={interestRate || ''} onChange={e => setInterestRate(Number(e.target.value))} className="w-full px-4 py-3 bg-surface-container-low border border-border-subtle rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-on-surface" />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-2">
                {t.termYears}
              </label>
              <input type="number" value={loanTerm || ''} onChange={e => setLoanTerm(Number(e.target.value))} className="w-full px-4 py-3 bg-surface-container-low border border-border-subtle rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-on-surface" />
            </div>
          </div>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-900/10 p-6 sm:p-8 rounded-3xl flex flex-col justify-center border border-indigo-100 dark:border-indigo-900/30">
          <p className="text-sm text-indigo-700 dark:text-indigo-300 font-medium mb-2">
            {t.maxHomePrice}
          </p>
          <p className="text-4xl sm:text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-6" dir="ltr">
            {defaultCurrency}{maxHomePrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-indigo-200/50 dark:border-indigo-800/30">
              <span className="text-on-surface-variant">{t.maxLoanAmount}</span>
              <span className="font-semibold text-on-surface" dir="ltr">{defaultCurrency}{Math.max(0, maxLoan).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-indigo-200/50 dark:border-indigo-800/30">
              <span className="text-on-surface-variant">{t.maxMonthlyPayment}</span>
              <span className="font-semibold text-on-surface" dir="ltr">{defaultCurrency}{Math.max(0, maxMonthlyPayment).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
          <p className="text-xs text-on-surface-variant/70 mt-6">
            {t.footnote}
          </p>
        </div>
      </div>

      <ShareActions
        onSaveHistory={saveToHistory}
        historyEntries={getHistory()}
        onLoadHistory={loadFromHistory}
      />
    </div>
  );
}

