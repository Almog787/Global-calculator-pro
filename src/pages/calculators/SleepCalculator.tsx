import React, { useState } from 'react';
import { Moon, Sun, Clock } from 'lucide-react';
import { useI18n } from '../../contexts/i18n';
import ShareActions from '../../components/ShareActions';

export default function SleepCalculator() {
  const { lang } = useI18n();
  const [mode, setMode] = useState<'wake' | 'sleep'>('wake');
  const [time, setTime] = useState<string>('07:00');

  // Parse HH:mm to minutes from midnight
  const parseTime = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  // Format minutes from midnight back to HH:mm
  const formatTime = (totalMins: number) => {
    let m = Math.round(totalMins);
    // handle negative times (previous day)
    while (m < 0) m += 24 * 60;
    // handle overflow (next day)
    m = m % (24 * 60);
    
    const h = Math.floor(m / 60);
    const mins = m % 60;
    
    // Add AM/PM for English
    if (lang === 'en') {
      const ampm = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 || 12;
      return `${h12}:${mins.toString().padStart(2, '0')} ${ampm}`;
    }
    
    return `${h.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const inputMins = parseTime(time);
  const cycleLength = 90; // Average sleep cycle is 90 mins
  const fallAsleepTime = 15; // Average time to fall asleep

  const suggestedTimes: number[] = [];

  if (mode === 'wake') {
    // Want to wake up at `inputMins`. Need to sleep at...
    // 6 cycles = 9 hours
    // 5 cycles = 7.5 hours
    // 4 cycles = 6 hours
    // 3 cycles = 4.5 hours
    for (let cycles = 6; cycles >= 3; cycles--) {
      suggestedTimes.push(inputMins - (cycles * cycleLength) - fallAsleepTime);
    }
  } else {
    // Going to sleep at `inputMins`. Need to wake up at...
    for (let cycles = 3; cycles <= 6; cycles++) {
      suggestedTimes.push(inputMins + (cycles * cycleLength) + fallAsleepTime);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 bg-surface-container-lowest rounded-3xl shadow-sm border border-border-subtle">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <Moon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">
            {lang === 'he' ? 'מחשבון שעות שינה' : 'Sleep Cycle Calculator'}
          </h1>
          <p className="text-on-surface-variant mt-1 text-sm">
            {lang === 'he' ? 'תתעוררו רעננים בסוף מחזור שינה' : 'Wake up refreshed at the end of a sleep cycle'}
          </p>
        </div>
      </div>

      <div className="bg-surface-container-low rounded-2xl p-6 mb-8 border border-border-subtle">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={() => setMode('wake')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-colors ${
              mode === 'wake'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high border border-border-subtle'
            }`}
          >
            <Sun className="w-5 h-5" />
            {lang === 'he' ? 'אני רוצה לקום ב...' : 'I want to wake up at...'}
          </button>
          <button
            onClick={() => setMode('sleep')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-colors ${
              mode === 'sleep'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high border border-border-subtle'
            }`}
          >
            <Moon className="w-5 h-5" />
            {lang === 'he' ? 'אני הולך לישון ב...' : 'I am going to sleep at...'}
          </button>
        </div>

        <div className="flex flex-col items-center">
          <label className="block text-sm font-medium text-on-surface-variant mb-3">
            {mode === 'wake' 
              ? (lang === 'he' ? 'מתי תרצו להתעורר?' : 'When do you want to wake up?')
              : (lang === 'he' ? 'מתי תלכו לישון?' : 'When are you going to sleep?')}
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="bg-surface-container-lowest border border-border-subtle rounded-xl px-6 py-4 text-3xl font-bold text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all text-center"
          />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="font-bold text-lg text-on-surface text-center">
          {mode === 'wake'
            ? (lang === 'he' ? 'כדי לקום רעננים, כדאי ללכת לישון ב:' : 'To wake up refreshed, try to sleep at:')
            : (lang === 'he' ? 'אם תלכו לישון עכשיו, כדאי לכוון שעון ל:' : 'If you sleep now, you should wake up at:')}
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {suggestedTimes.map((mins, i) => {
            const cycles = mode === 'wake' ? 6 - i : 3 + i;
            const isOptimal = cycles === 5 || cycles === 6; // 7.5 or 9 hours is optimal
            
            return (
              <div 
                key={i} 
                className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center transition-all ${
                  isOptimal 
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 shadow-sm transform hover:-translate-y-1' 
                    : 'bg-surface-container-lowest border-border-subtle opacity-80'
                }`}
              >
                <span className={`text-2xl font-bold mb-1 ${isOptimal ? 'text-indigo-600 dark:text-indigo-400' : 'text-on-surface'}`}>
                  {formatTime(mins)}
                </span>
                <span className="text-xs text-on-surface-variant font-medium">
                  {cycles} {lang === 'he' ? 'מחזורים' : 'cycles'}
                </span>
                <span className="text-xs text-on-surface-variant opacity-75 mt-1">
                  ({cycles * 1.5} {lang === 'he' ? 'שעות שינה' : 'hours'})
                </span>
              </div>
            );
          })}
        </div>
        
        <p className="text-xs text-center text-on-surface-variant/70 mt-4 max-w-lg mx-auto">
          {lang === 'he' 
            ? '* החישוב כולל 15 דקות בממוצע שלוקח לאדם להירדם. אדם בוגר צריך בממוצע 5-6 מחזורי שינה מלאים בלילה.'
            : '* Calculation includes an average of 15 minutes to fall asleep. An adult typically needs 5-6 full sleep cycles.'}
        </p>
      </div>

      <ShareActions />
    </div>
  );
}
