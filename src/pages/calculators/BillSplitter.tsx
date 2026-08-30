import React, { useState } from 'react';
import { Users } from 'lucide-react';

export default function BillSplitter() {
  const [totalBill, setTotalBill] = useUrlState<number>('totalBill', 250);
  const [tipPercentage, setTipPercentage] = useUrlState<number>('tipPercentage', 15);
  const [numPeople, setNumPeople] = useUrlState<number>('numPeople', 4);

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
                <button key={r} onClick={() => setTipPercentage(r)} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${tipPercentage === r ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
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
