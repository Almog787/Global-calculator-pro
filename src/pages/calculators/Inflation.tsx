import React, { useState } from 'react';
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
