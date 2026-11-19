import { useUrlState } from '../../hooks/useUrlState';
import React from 'react';
import { Droplet } from 'lucide-react';
import { useMeasurementSystem } from '../../hooks/useMeasurementSystem';
import MeasurementToggle from '../../components/MeasurementToggle';
import { useI18n, Language } from '../../contexts/i18n';

const dict: Record<Language, {
  title: string;
  weight: string;
  kg: string;
  lbs: string;
  exerciseMins: string;
  dailyGoal: string;
  liters: string;
  flOz: string;
  aboutPrefix: string;
  glassesLabel: string;
}> = {
  en: {
    title: 'Daily Water Intake Calculator',
    weight: 'Weight',
    kg: 'kg',
    lbs: 'lbs',
    exerciseMins: 'Daily Exercise (Minutes)',
    dailyGoal: 'Daily Hydration Goal',
    liters: 'Liters',
    flOz: 'fl oz',
    aboutPrefix: 'Or about',
    glassesLabel: 'glasses',
  },
  he: {
    title: 'מחשבון צריכת מים יומית',
    weight: 'משקל גוף',
    kg: 'ק"ג',
    lbs: 'ליברות',
    exerciseMins: 'פעילות גופנית יומית (דקות)',
    dailyGoal: 'יעד שתייה יומי מומלץ',
    liters: 'ליטר',
    flOz: 'אונקיות נוזל',
    aboutPrefix: 'או כ-',
    glassesLabel: 'כוסות מים',
  },
  es: {
    title: 'Calculadora de Consumo Diario de Agua',
    weight: 'Peso',
    kg: 'kg',
    lbs: 'lb',
    exerciseMins: 'Ejercicio Diario (Minutos)',
    dailyGoal: 'Meta Diaria de Hidratación',
    liters: 'Litros',
    flOz: 'fl oz',
    aboutPrefix: 'O aproximadamente',
    glassesLabel: 'vasos',
  },
  fr: {
    title: 'Calculateur de Consommation d\'Eau Quotidienne',
    weight: 'Poids',
    kg: 'kg',
    lbs: 'lb',
    exerciseMins: 'Exercice Quotidien (Minutes)',
    dailyGoal: 'Objectif Quotidien d\'Hydratation',
    liters: 'Litres',
    flOz: 'fl oz',
    aboutPrefix: 'Soit environ',
    glassesLabel: 'verres',
  },
  ar: {
    title: 'حاسبة استهلاك الماء اليومي',
    weight: 'الوزن',
    kg: 'كجم',
    lbs: 'رطل',
    exerciseMins: 'مدة التمرين اليومي (بالدقائق)',
    dailyGoal: 'الهدف اليومي لشرب الماء',
    liters: 'لتر',
    flOz: 'أونصة',
    aboutPrefix: 'أو حوالي',
    glassesLabel: 'أكواب ماء',
  },
  ru: {
    title: 'Калькулятор дневной нормы воды',
    weight: 'Вес тела',
    kg: 'кг',
    lbs: 'фунты',
    exerciseMins: 'Тренировки в день (минут)',
    dailyGoal: 'Дневная норма воды',
    liters: 'литров',
    flOz: 'унций',
    aboutPrefix: 'Или примерно',
    glassesLabel: 'стаканов',
  },
};

export default function WaterIntake() {
  const { lang } = useI18n();
  const t = dict[lang] || dict.en;
  const { system, setSystem } = useMeasurementSystem();
  const [weight, setWeight] = useUrlState<number>('weight', 70); // kg
  const [exerciseMins, setExerciseMins] = useUrlState<number>('exerciseMins', 30);
  
  const displayWeight = system === 'metric' ? weight : (weight * 2.20462);
  const handleWeightChange = (val: number) => {
    setWeight(system === 'metric' ? val : (val / 2.20462));
  };

  // Base water: weight(kg) * 35ml. Plus 350ml per 30 mins exercise
  const baseWater = weight * 35;
  const exerciseWater = (exerciseMins / 30) * 350;
  const totalWaterMl = baseWater + exerciseWater;
  
  const totalWaterLiters = totalWaterMl / 1000;
  const cupsMetric = totalWaterMl / 250; // standard 250ml cup
  
  const totalWaterOz = totalWaterMl / 29.5735;
  const cupsImperial = totalWaterOz / 8; // standard 8oz glass

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Droplet className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {t.title}
          </h1>
        </div>
        <MeasurementToggle system={system} onChange={setSystem} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.weight} ({system === 'metric' ? t.kg : t.lbs})</label>
            <input type="number" value={Math.round(displayWeight * 10) / 10 || ''} onChange={e => handleWeightChange(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.exerciseMins}</label>
            <input type="number" value={exerciseMins || ''} onChange={e => setExerciseMins(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/10 p-6 sm:p-8 rounded-3xl flex flex-col justify-center text-center">
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">{t.dailyGoal}</p>
          <p className="text-4xl sm:text-6xl font-bold text-slate-900 dark:text-white mb-2">
            {system === 'metric' ? totalWaterLiters.toFixed(1) : Math.round(totalWaterOz)} 
            <span className="text-2xl sm:text-3xl text-slate-500 ms-2">
              {system === 'metric' ? t.liters : t.flOz}
            </span>
          </p>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-4">
            {t.aboutPrefix}{' '}
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {Math.round(system === 'metric' ? cupsMetric : cupsImperial)}
            </span>{' '}
            {t.glassesLabel} ({system === 'metric' ? '250ml' : '8 oz'})
          </p>
        </div>
      </div>
    </div>
  );
}

