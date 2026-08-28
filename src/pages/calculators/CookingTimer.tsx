import React, { useState } from 'react';
import { Flame, Clock } from 'lucide-react';
import { useI18n } from '../../contexts/i18n';
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

export default function CookingTimer() {
  const { lang, t } = useI18n();
  const { system, setSystem } = useMeasurementSystem();
  
  const [meatType, setMeatType] = useState<MeatType>('beef');
  const [doneness, setDoneness] = useState<Doneness>('medium');
  const [weight, setWeight] = useState<number>(1.5); // Stored as kg initially

  const displayWeight = system === 'metric' ? weight : weight * 2.20462;
  const handleWeightChange = (val: number) => {
    setWeight(system === 'metric' ? val : val / 2.20462);
  };

  // Safe fallback if doneness doesn't exist for a meat type
  const currentRule = COOKING_DATA[meatType][doneness] || COOKING_DATA[meatType]['well_done'] || Object.values(COOKING_DATA[meatType])[0];

  const totalMinutes = system === 'metric' 
    ? (weight * currentRule.minutesPerKg) + currentRule.baseMinutes
    : ((weight * 2.20462) * currentRule.minutesPerLb) + currentRule.baseMinutes;
    
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);

  const renderMeatOptions = () => {
    return [
      { id: 'beef', he: 'בקר', en: 'Beef' },
      { id: 'chicken', he: 'עוף', en: 'Chicken' },
      { id: 'pork', he: 'חזיר', en: 'Pork' },
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
        {lang === 'he' ? opt.he : opt.en}
      </button>
    ));
  };

  const renderDonenessOptions = () => {
    if (meatType === 'chicken') return null; // Chicken is always well done
    
    let options = [];
    if (meatType === 'beef') {
      options = [
        { id: 'rare', he: 'רייר (נא)', en: 'Rare' },
        { id: 'medium_rare', he: 'מדיום רייר', en: 'Medium Rare' },
        { id: 'medium', he: 'מדיום', en: 'Medium' },
        { id: 'well_done', he: 'וול דאן (עשוי היטב)', en: 'Well Done' },
      ];
    } else if (meatType === 'pork') {
      options = [
        { id: 'medium', he: 'מדיום', en: 'Medium' },
        { id: 'well_done', he: 'וול דאן', en: 'Well Done' },
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
        {lang === 'he' ? opt.he : opt.en}
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
              {lang === 'he' ? 'מחשבון זמני צלייה' : 'Meat Roasting Timer'}
            </h1>
          </div>
        </div>
        <MeasurementToggle system={system} onChange={setSystem} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-3">
              {lang === 'he' ? 'סוג בשר' : 'Meat Type'}
            </label>
            <div className="flex gap-2">
              {renderMeatOptions()}
            </div>
          </div>

          {meatType !== 'chicken' && (
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-3">
                {lang === 'he' ? 'מידת עשייה' : 'Doneness'}
              </label>
              <div className="flex flex-wrap gap-2">
                {renderDonenessOptions()}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-2">
              {lang === 'he' ? 'משקל הנתח' : 'Meat Weight'} ({system === 'metric' ? 'kg' : 'lbs'})
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
            {lang === 'he' ? 'זמן צלייה משוער' : 'Estimated Cooking Time'}
          </p>
          <div className="text-4xl sm:text-5xl font-bold text-primary mb-6 flex items-baseline gap-2">
            {hours > 0 && <span>{hours}<span className="text-xl sm:text-2xl text-on-surface-variant font-normal ml-1 rtl:mr-1">h</span></span>}
            <span>{minutes}<span className="text-xl sm:text-2xl text-on-surface-variant font-normal ml-1 rtl:mr-1">m</span></span>
          </div>
          
          <div className="w-full bg-surface-container-lowest rounded-xl p-4 border border-border-subtle/50">
            <p className="text-sm text-on-surface-variant mb-1">
              {lang === 'he' ? 'טמפרטורת תנור מומלצת' : 'Recommended Oven Temp'}
            </p>
            <p className="text-xl font-bold text-on-surface">
              {system === 'metric' ? `${currentRule.tempC}°C` : `${currentRule.tempF}°F`}
            </p>
          </div>
        </div>
      </div>

      <ShareActions />
    </div>
  );
}
