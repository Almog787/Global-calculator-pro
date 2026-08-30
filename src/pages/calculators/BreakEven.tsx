import React, { useState } from 'react';
import { Target } from 'lucide-react';

export default function BreakEven() {
  const [fixedCosts, setFixedCosts] = useUrlState<number>('fixedCosts', 10000);
  const [pricePerUnit, setPricePerUnit] = useUrlState<number>('pricePerUnit', 50);
  const [variableCostPerUnit, setVariableCostPerUnit] = useUrlState<number>('variableCostPerUnit', 20);

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
