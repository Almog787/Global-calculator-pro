import React, { useState } from 'react';
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
