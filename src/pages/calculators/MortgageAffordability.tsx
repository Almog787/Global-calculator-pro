import React, { useMemo } from 'react';
import { Home } from 'lucide-react';
import { useI18n } from '../../contexts/i18n';
import { useCalculatorState } from '../../hooks/useCalculatorState';
import ShareActions from '../../components/ShareActions';

export default function MortgageAffordability() {
  const { lang } = useI18n();
  
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

  const defaultCurrency = lang === 'he' ? '₪' : '$';

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-surface-container-lowest rounded-3xl shadow-sm border border-border-subtle">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <Home className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">
          {lang === 'he' ? 'מחשבון כמה משכנתא אפשר לקחת?' : 'Mortgage Affordability Calculator'}
        </h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-2">
              {lang === 'he' ? 'הכנסה חודשית (נטו)' : 'Monthly Income (Net)'}
            </label>
            <div className="relative">
              <span className="absolute top-1/2 -translate-y-1/2 ltr:left-4 rtl:right-4 text-on-surface-variant">{defaultCurrency}</span>
              <input type="number" value={income || ''} onChange={e => setIncome(Number(e.target.value))} className="w-full ltr:pl-8 rtl:pr-8 px-4 py-3 bg-surface-container-low border border-border-subtle rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-on-surface" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-2">
              {lang === 'he' ? 'הלוואות קיימות והתחייבויות (חודשי)' : 'Monthly Debts'}
            </label>
            <div className="relative">
              <span className="absolute top-1/2 -translate-y-1/2 ltr:left-4 rtl:right-4 text-on-surface-variant">{defaultCurrency}</span>
              <input type="number" value={debts || ''} onChange={e => setDebts(Number(e.target.value))} className="w-full ltr:pl-8 rtl:pr-8 px-4 py-3 bg-surface-container-low border border-border-subtle rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-on-surface" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-2">
              {lang === 'he' ? 'הון עצמי' : 'Down Payment'}
            </label>
            <div className="relative">
              <span className="absolute top-1/2 -translate-y-1/2 ltr:left-4 rtl:right-4 text-on-surface-variant">{defaultCurrency}</span>
              <input type="number" value={downPayment || ''} onChange={e => setDownPayment(Number(e.target.value))} className="w-full ltr:pl-8 rtl:pr-8 px-4 py-3 bg-surface-container-low border border-border-subtle rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-on-surface" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-2">
                {lang === 'he' ? 'ריבית משוערת (%)' : 'Interest Rate (%)'}
              </label>
              <input type="number" step="0.1" value={interestRate || ''} onChange={e => setInterestRate(Number(e.target.value))} className="w-full px-4 py-3 bg-surface-container-low border border-border-subtle rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-on-surface" />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-2">
                {lang === 'he' ? 'תקופה (שנים)' : 'Term (Years)'}
              </label>
              <input type="number" value={loanTerm || ''} onChange={e => setLoanTerm(Number(e.target.value))} className="w-full px-4 py-3 bg-surface-container-low border border-border-subtle rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-on-surface" />
            </div>
          </div>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-900/10 p-6 sm:p-8 rounded-3xl flex flex-col justify-center border border-indigo-100 dark:border-indigo-900/30">
          <p className="text-sm text-indigo-700 dark:text-indigo-300 font-medium mb-2">
            {lang === 'he' ? 'תקציב מקסימלי לקניית דירה' : 'Estimated Max Home Price'}
          </p>
          <p className="text-4xl sm:text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-6" dir="ltr">
            {defaultCurrency}{maxHomePrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-indigo-200/50 dark:border-indigo-800/30">
              <span className="text-on-surface-variant">{lang === 'he' ? 'משכנתא מקסימלית' : 'Max Loan Amount'}</span>
              <span className="font-semibold text-on-surface" dir="ltr">{defaultCurrency}{Math.max(0, maxLoan).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-indigo-200/50 dark:border-indigo-800/30">
              <span className="text-on-surface-variant">{lang === 'he' ? 'החזר חודשי משוער' : 'Max Monthly Payment'}</span>
              <span className="font-semibold text-on-surface" dir="ltr">{defaultCurrency}{Math.max(0, maxMonthlyPayment).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
          <p className="text-xs text-on-surface-variant/70 mt-6">
            {lang === 'he' ? '* החישוב מבוסס על כלל אצבע שלפיו ההחזר החודשי לא יעלה על 36% מההכנסה הפנויה. יש להתייעץ עם יועץ משכנתאות.' : '* Based on a 36% debt-to-income rule of thumb.'}
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
