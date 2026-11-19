import { useUrlState } from '../../hooks/useUrlState';
import React from 'react';
import { Flame, Clock } from 'lucide-react';
import { useI18n, Language } from '../../contexts/i18n';
import ShareActions from '../../components/ShareActions';
import MeasurementToggle from '../../components/MeasurementToggle';
import { useMeasurementSystem } from '../../hooks/useMeasurementSystem';

type MeatType = 'beef' | 'chicken' | 'pork';
type Doneness = 'rare' | 'medium_rare' | 'medium' | 'well_done';

interface CookingRule {
  tempC: number;
  tempF: number;
  minutesPerKg: number;
  minutesPerLb: number;
  baseMinutes: number;
}

const COOKING_DATA: Record<MeatType, Record<string, CookingRule>> = {
  beef: {
    rare: { tempC: 200, tempF: 400, minutesPerKg: 40, minutesPerLb: 18, baseMinutes: 15 },
    medium_rare: { tempC: 200, tempF: 400, minutesPerKg: 44, minutesPerLb: 20, baseMinutes: 20 },
    medium: { tempC: 200, tempF: 400, minutesPerKg: 55, minutesPerLb: 25, baseMinutes: 25 },
    well_done: { tempC: 200, tempF: 400, minutesPerKg: 66, minutesPerLb: 30, baseMinutes: 30 },
  },
  chicken: {
    well_done: { tempC: 190, tempF: 375, minutesPerKg: 45, minutesPerLb: 20, baseMinutes: 20 },
  },
  pork: {
    medium: { tempC: 180, tempF: 350, minutesPerKg: 55, minutesPerLb: 25, baseMinutes: 25 },
    well_done: { tempC: 180, tempF: 350, minutesPerKg: 65, minutesPerLb: 30, baseMinutes: 30 },
  }
};

const dict: Record<Language, {
  title: string;
  meatType: string;
  beef: string;
  chicken: string;
  pork: string;
  doneness: string;
  rare: string;
  mediumRare: string;
  medium: string;
  wellDone: string;
  meatWeight: string;
  kg: string;
  lbs: string;
  estimatedTime: string;
  h: string;
  m: string;
  recommendedTemp: string;
}> = {
  en: {
    title: 'Meat Roasting & Cooking Timer',
    meatType: 'Meat Type',
    beef: 'Beef',
    chicken: 'Chicken',
    pork: 'Pork',
    doneness: 'Doneness',
    rare: 'Rare',
    mediumRare: 'Medium Rare',
    medium: 'Medium',
    wellDone: 'Well Done',
    meatWeight: 'Meat Weight',
    kg: 'kg',
    lbs: 'lbs',
    estimatedTime: 'Estimated Cooking Time',
    h: 'h',
    m: 'm',
    recommendedTemp: 'Recommended Oven Temp',
  },
  he: {
    title: 'מחשבון זמני צלייה ובישול',
    meatType: 'סוג בשר',
    beef: 'בקר',
    chicken: 'עוף',
    pork: 'חזיר',
    doneness: 'מידת עשייה',
    rare: 'רייר (נא)',
    mediumRare: 'מדיום רייר',
    medium: 'מדיום',
    wellDone: 'וול דאן (עשוי היטב)',
    meatWeight: 'משקל הנתח',
    kg: 'ק"ג',
    lbs: 'ליברות',
    estimatedTime: 'זמן צלייה משוער',
    h: 'ש׳',
    m: 'ד׳',
    recommendedTemp: 'טמפרטורת תנור מומלצת',
  },
  es: {
    title: 'Calculadora de Tiempo de Horneado y Asado',
    meatType: 'Tipo de Carne',
    beef: 'Res / Ternera',
    chicken: 'Pollo',
    pork: 'Cerdo',
    doneness: 'Punto de Cocción',
    rare: 'Poco hecho',
    mediumRare: 'Al punto menos',
    medium: 'Al punto',
    wellDone: 'Bien cocido',
    meatWeight: 'Peso de la Pieza',
    kg: 'kg',
    lbs: 'lb',
    estimatedTime: 'Tiempo Estimado de Cocción',
    h: 'h',
    m: 'm',
    recommendedTemp: 'Temperatura de Horno Recomendada',
  },
  fr: {
    title: 'Minuteur de Cuisson et Rôtissage au Four',
    meatType: 'Type de Viande',
    beef: 'Bœuf',
    chicken: 'Poulet',
    pork: 'Porc',
    doneness: 'Cuisson',
    rare: 'Saignant',
    mediumRare: 'À point rosé',
    medium: 'À point',
    wellDone: 'Bien cuit',
    meatWeight: 'Poids de la Pièce',
    kg: 'kg',
    lbs: 'lb',
    estimatedTime: 'Temps de Cuisson Estimé',
    h: 'h',
    m: 'min',
    recommendedTemp: 'Température du Four Recommandée',
  },
  ar: {
    title: 'حاسبة وقت الطهي والشواء في الفرن',
    meatType: 'نوع اللحم',
    beef: 'لحم بقري',
    chicken: 'دجاج',
    pork: 'لحم ضأن / آخر',
    doneness: 'درجة الاستواء',
    rare: 'نصف مطهو (رير)',
    mediumRare: 'متوسط قليل',
    medium: 'متوسط الاستواء',
    wellDone: 'ناضج تماماً',
    meatWeight: 'وزن القطعة',
    kg: 'كجم',
    lbs: 'رطل',
    estimatedTime: 'وقت الطهي المقدر',
    h: 'س',
    m: 'د',
    recommendedTemp: 'درجة حرارة الفرن الموصى بها',
  },
  ru: {
    title: 'Калькулятор времени запекания и готовки',
    meatType: 'Вид мяса',
    beef: 'Говядина',
    chicken: 'Курица',
    pork: 'Свинина',
    doneness: 'Степень прожарки',
    rare: 'С кровью (Rare)',
    mediumRare: 'Слабая (Medium Rare)',
    medium: 'Средняя (Medium)',
    wellDone: 'Полная (Well Done)',
    meatWeight: 'Вес куска',
    kg: 'кг',
    lbs: 'фунты',
    estimatedTime: 'Расчетное время запекания',
    h: 'ч',
    m: 'м',
    recommendedTemp: 'Рекомендуемая температура духовки',
  },
};

export default function CookingTimer() {
  const { lang } = useI18n();
  const t = dict[lang] || dict.en;
  const { system, setSystem } = useMeasurementSystem();
  
  const [meatType, setMeatType] = useUrlState<MeatType>('meatType', 'beef');
  const [doneness, setDoneness] = useUrlState<Doneness>('doneness', 'medium');
  const [weight, setWeight] = useUrlState<number>('weight', 1.5);

  const displayWeight = system === 'metric' ? weight : weight * 2.20462;
  const handleWeightChange = (val: number) => {
    setWeight(system === 'metric' ? val : val / 2.20462);
  };

  const currentRule = COOKING_DATA[meatType][doneness] || COOKING_DATA[meatType]['well_done'] || Object.values(COOKING_DATA[meatType])[0];
  const totalMinutes = system === 'metric' 
    ? (weight * currentRule.minutesPerKg) + currentRule.baseMinutes
    : ((weight * 2.20462) * currentRule.minutesPerLb) + currentRule.baseMinutes;
    
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);

  const renderMeatOptions = () => {
    return [
      { id: 'beef', label: t.beef },
      { id: 'chicken', label: t.chicken },
      { id: 'pork', label: t.pork },
    ].map(opt => (
      <button
        key={opt.id}
        onClick={() => {
          setMeatType(opt.id as MeatType);
          if (opt.id === 'chicken') setDoneness('well_done');
        }}
        className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
          meatType === opt.id
            ? 'bg-primary text-on-primary shadow-sm'
            : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
        }`}
      >
        {opt.label}
      </button>
    ));
  };

  const renderDonenessOptions = () => {
    if (meatType === 'chicken') return null;
    
    let options: { id: string; label: string }[] = [];
    if (meatType === 'beef') {
      options = [
        { id: 'rare', label: t.rare },
        { id: 'medium_rare', label: t.mediumRare },
        { id: 'medium', label: t.medium },
        { id: 'well_done', label: t.wellDone },
      ];
    } else if (meatType === 'pork') {
      options = [
        { id: 'medium', label: t.medium },
        { id: 'well_done', label: t.wellDone },
      ];
    }

    return options.map(opt => (
      <button
        key={opt.id}
        onClick={() => setDoneness(opt.id as Doneness)}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          doneness === opt.id
            ? 'bg-secondary text-on-secondary shadow-sm'
            : 'bg-surface-container border border-border-subtle text-on-surface hover:bg-surface-container-high'
        }`}
      >
        {opt.label}
      </button>
    ));
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 bg-surface-container-lowest rounded-3xl shadow-sm border border-border-subtle">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">
              {t.title}
            </h1>
          </div>
        </div>
        <MeasurementToggle system={system} onChange={setSystem} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-3">
              {t.meatType}
            </label>
            <div className="flex gap-2">
              {renderMeatOptions()}
            </div>
          </div>

          {meatType !== 'chicken' && (
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-3">
                {t.doneness}
              </label>
              <div className="flex flex-wrap gap-2">
                {renderDonenessOptions()}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-2">
              {t.meatWeight} ({system === 'metric' ? t.kg : t.lbs})
            </label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={Math.round(displayWeight * 100) / 100 || ''}
              onChange={(e) => handleWeightChange(Number(e.target.value))}
              className="w-full bg-surface-container-low border border-border-subtle rounded-xl px-4 py-3 text-lg font-semibold text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
        </div>

        <div className="bg-surface-container-low rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-border-subtle">
          <Clock className="w-10 h-10 text-secondary mb-4 opacity-80" />
          <p className="text-sm font-medium text-on-surface-variant uppercase tracking-wider mb-2">
            {t.estimatedTime}
          </p>
          <div className="text-4xl sm:text-5xl font-bold text-primary mb-6 flex items-baseline gap-2" dir="ltr">
            {hours > 0 && <span>{hours}<span className="text-xl sm:text-2xl text-on-surface-variant font-normal ms-1">{t.h}</span></span>}
            <span>{minutes}<span className="text-xl sm:text-2xl text-on-surface-variant font-normal ms-1">{t.m}</span></span>
          </div>
          
          <div className="w-full bg-surface-container-lowest rounded-xl p-4 border border-border-subtle/50">
            <p className="text-sm text-on-surface-variant mb-1">
              {t.recommendedTemp}
            </p>
            <p className="text-xl font-bold text-on-surface" dir="ltr">
              {system === 'metric' ? `${currentRule.tempC}°C` : `${currentRule.tempF}°F`}
            </p>
          </div>
        </div>
      </div>

      <ShareActions />
    </div>
  );
}

