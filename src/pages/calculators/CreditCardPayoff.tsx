import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';

export default function CreditCardPayoff() {
  const [balance, setBalance] = useState<number>(5000);
  const [rate, setRate] = useState<number>(18.9);
  const [payment, setPayment] = useState<number>(150);

  const calculatePayoff = () => {
    const monthlyRate = rate / 100 / 12;
    if (payment <= balance * monthlyRate) {
      return { months: Infinity, interest: Infinity, total: Infinity };
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
