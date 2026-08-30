import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

export default function Vat() {
  const [amount, setAmount] = useUrlState<number>('amount', 100);
  const [rate, setRate] = useUrlState<number>('rate', 17); // Default IL VAT
  
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
                <button key={r} onClick={() => setRate(r)} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${rate === r ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
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
