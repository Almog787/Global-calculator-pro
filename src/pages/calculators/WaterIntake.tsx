import React, { useState } from 'react';
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
