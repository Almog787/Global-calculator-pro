import React, { useState } from 'react';
import { Activity } from 'lucide-react';

export default function Bmr() {
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState<number>(75);
  const [height, setHeight] = useState<number>(175);
  const [activity, setActivity] = useState<number>(1.2);

  // Mifflin-St Jeor Equation
  const baseBmr = (10 * weight) + (6.25 * height) - (5 * age);
  const bmr = gender === 'male' ? baseBmr + 5 : baseBmr - 161;
  const tdee = bmr * activity;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center text-teal-600 dark:text-teal-400">
          <Activity className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Daily Calorie Needs
        </h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Age</label>
              <input type="number" value={age || ''} onChange={e => setAge(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Gender</label>
              <select value={gender} onChange={e => setGender(e.target.value as any)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white">
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Weight (kg)</label>
              <input type="number" value={weight || ''} onChange={e => setWeight(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Height (cm)</label>
              <input type="number" value={height || ''} onChange={e => setHeight(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Activity Level</label>
            <select value={activity} onChange={e => setActivity(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white">
              <option value={1.2}>Sedentary (little/no exercise)</option>
              <option value={1.375}>Lightly active (1-3 days/week)</option>
              <option value={1.55}>Moderately active (3-5 days/week)</option>
              <option value={1.725}>Very active (6-7 days/week)</option>
              <option value={1.9}>Extra active (physical job/2x training)</option>
            </select>
          </div>
        </div>
        <div className="bg-teal-50 dark:bg-teal-900/10 p-6 sm:p-8 rounded-3xl flex flex-col justify-center">
          <p className="text-sm text-teal-600 dark:text-teal-400 font-medium mb-2">Maintain Weight (TDEE)</p>
          <p className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-2">
            {Math.round(tdee).toLocaleString()} <span className="text-2xl text-slate-500">kcal/day</span>
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Total Daily Energy Expenditure</p>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-t border-teal-100 dark:border-teal-800/30">
              <span className="text-slate-600 dark:text-slate-400">Mild Weight Loss (0.25kg/wk)</span>
              <span className="font-semibold text-slate-900 dark:text-white">{Math.round(tdee - 250).toLocaleString()} kcal</span>
            </div>
            <div className="flex justify-between items-center py-3 border-t border-teal-100 dark:border-teal-800/30">
              <span className="text-slate-600 dark:text-slate-400">Weight Loss (0.5kg/wk)</span>
              <span className="font-semibold text-slate-900 dark:text-white">{Math.round(tdee - 500).toLocaleString()} kcal</span>
            </div>
            <div className="flex justify-between items-center py-3 border-t border-teal-100 dark:border-teal-800/30">
              <span className="text-slate-600 dark:text-slate-400">Weight Gain (0.5kg/wk)</span>
              <span className="font-semibold text-slate-900 dark:text-white">{Math.round(tdee + 500).toLocaleString()} kcal</span>
            </div>
            <div className="flex justify-between items-center py-3 border-t border-teal-100 dark:border-teal-800/30">
              <span className="text-slate-600 dark:text-slate-400">Basal Metabolic Rate (BMR)</span>
              <span className="font-semibold text-slate-900 dark:text-white">{Math.round(bmr).toLocaleString()} kcal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
