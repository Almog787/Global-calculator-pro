import { useUrlState } from '../../hooks/useUrlState';
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useI18n, Language } from '../../contexts/i18n';
import ShareActions from '../../components/ShareActions';

const dict: Record<Language, {
  title: string;
  subtitle: string;
  wakeMode: string;
  sleepMode: string;
  wakeQuestion: string;
  sleepQuestion: string;
  wakeResultTitle: string;
  sleepResultTitle: string;
  cycles: string;
  hours: string;
  footnote: string;
}> = {
  en: {
    title: 'Sleep Cycle Calculator',
    subtitle: 'Wake up refreshed at the end of a 90-minute REM sleep cycle',
    wakeMode: 'I want to wake up at...',
    sleepMode: 'I am going to sleep at...',
    wakeQuestion: 'When do you want to wake up?',
    sleepQuestion: 'When are you going to sleep?',
    wakeResultTitle: 'To wake up refreshed, try to sleep at:',
    sleepResultTitle: 'If you sleep now, you should wake up at:',
    cycles: 'cycles',
    hours: 'hours',
    footnote: '* Calculation includes an average of 15 minutes to fall asleep. An adult typically needs 5–6 full sleep cycles.',
  },
  he: {
    title: 'מחשבון שעות ומחזורי שינה',
    subtitle: 'תתעוררו רעננים בסיום מחזור שינה מלא של 90 דקות',
    wakeMode: 'אני רוצה לקום ב...',
    sleepMode: 'אני הולך לישון ב...',
    wakeQuestion: 'מתי תרצו להתעורר?',
    sleepQuestion: 'מתי תלכו לישון?',
    wakeResultTitle: 'כדי לקום רעננים, כדאי ללכת לישון ב:',
    sleepResultTitle: 'אם תלכו לישון עכשיו, כדאי לכוון שעון ל:',
    cycles: 'מחזורים',
    hours: 'שעות שינה',
    footnote: '* החישוב כולל 15 דקות בממוצע שלוקח לאדם להירדם. אדם בוגר צריך בממוצע 5–6 מחזורי שינה מלאים בלילה.',
  },
  es: {
    title: 'Calculadora de Ciclos de Sueño',
    subtitle: 'Despierta renovado al final de un ciclo de sueño de 90 minutos',
    wakeMode: 'Quiero despertar a las...',
    sleepMode: 'Me voy a dormir a las...',
    wakeQuestion: '¿A qué hora quieres despertar?',
    sleepQuestion: '¿A qué hora te vas a dormir?',
    wakeResultTitle: 'Para despertar descansado, intenta dormir a las:',
    sleepResultTitle: 'Si duermes ahora, pon tu alarma a las:',
    cycles: 'ciclos',
    hours: 'horas',
    footnote: '* El cálculo incluye 15 minutos promedio para conciliar el sueño. Un adulto suele necesitar 5–6 ciclos completos.',
  },
  fr: {
    title: 'Calculateur de Cycles de Sommeil',
    subtitle: 'Réveillez-vous en pleine forme à la fin d’un cycle de 90 minutes',
    wakeMode: 'Je veux me réveiller à...',
    sleepMode: 'Je vais me coucher à...',
    wakeQuestion: 'À quelle heure souhaitez-vous vous réveiller ?',
    sleepQuestion: 'À quelle heure allez-vous dormir ?',
    wakeResultTitle: 'Pour vous réveiller reposé, couchez-vous à :',
    sleepResultTitle: 'Si vous dormez à cette heure, programmez votre réveil à :',
    cycles: 'cycles',
    hours: 'heures',
    footnote: '* Le calcul inclut 15 minutes d’endormissement moyen. Un adulte a besoin de 5 à 6 cycles complets par nuit.',
  },
  ar: {
    title: 'حاسبة دورات النوم والاستيقاظ',
    subtitle: 'استيقظ بنشاط في نهاية دورة نوم كاملة مدتها 90 دقيقة',
    wakeMode: 'أريد الاستيقاظ في...',
    sleepMode: 'سأذهب للنوم في...',
    wakeQuestion: 'متى تريد أن تستيقظ؟',
    sleepQuestion: 'متى ستخلد إلى النوم؟',
    wakeResultTitle: 'للاستيقاظ بنشاط، حاول النوم في أحد الأوقات التالية:',
    sleepResultTitle: 'إذا نمت في هذا الوقت، يفضل ضبط المنبه على:',
    cycles: 'دورات',
    hours: 'ساعات نوم',
    footnote: '* يشمل الحساب 15 دقيقة في المتوسط للاستغراق في النوم. يحتاج البالغ عادةً 5–6 دورات نوم كاملة.',
  },
  ru: {
    title: 'Калькулятор циклов и фаз сна',
    subtitle: 'Просыпайтесь бодрым в конце 90-минутного цикла сна',
    wakeMode: 'Я хочу проснуться в...',
    sleepMode: 'Я ложусь спать в...',
    wakeQuestion: 'Во сколько вы хотите проснуться?',
    sleepQuestion: 'Во сколько вы планируете лечь спать?',
    wakeResultTitle: 'Чтобы проснуться бодрым, лучше лечь спать в:',
    sleepResultTitle: 'Если заснуть в это время, ставьте будильник на:',
    cycles: 'циклов',
    hours: 'ч. сна',
    footnote: '* Расчет учитывает в среднем 15 минут на засыпание. Взрослому обычно требуется 5–6 полных циклов сна.',
  },
};

export default function SleepCalculator() {
  const { lang } = useI18n();
  const t = dict[lang] || dict.en;
  const [mode, setMode] = useUrlState<'wake' | 'sleep'>('mode', 'wake');
  const [time, setTime] = useUrlState<string>('time', '07:00');

  const parseTime = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const formatTime = (totalMins: number) => {
    let m = Math.round(totalMins);
    while (m < 0) m += 24 * 60;
    m = m % (24 * 60);
    
    const h = Math.floor(m / 60);
    const mins = m % 60;
    
    if (lang === 'en') {
      const ampm = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 || 12;
      return `${h12}:${mins.toString().padStart(2, '0')} ${ampm}`;
    }
    
    return `${h.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const inputMins = parseTime(time);
  const cycleLength = 90;
  const fallAsleepTime = 15;

  const suggestedTimes: number[] = [];

  if (mode === 'wake') {
    for (let cycles = 6; cycles >= 3; cycles--) {
      suggestedTimes.push(inputMins - (cycles * cycleLength) - fallAsleepTime);
    }
  } else {
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
            {t.title}
          </h1>
          <p className="text-on-surface-variant mt-1 text-sm">
            {t.subtitle}
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
            {t.wakeMode}
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
            {t.sleepMode}
          </button>
        </div>

        <div className="flex flex-col items-center">
          <label className="block text-sm font-medium text-on-surface-variant mb-3">
            {mode === 'wake' ? t.wakeQuestion : t.sleepQuestion}
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
          {mode === 'wake' ? t.wakeResultTitle : t.sleepResultTitle}
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {suggestedTimes.map((mins, i) => {
            const cycles = mode === 'wake' ? 6 - i : 3 + i;
            const isOptimal = cycles === 5 || cycles === 6;
            
            return (
              <div 
                key={i} 
                className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center transition-all ${
                  isOptimal 
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 shadow-sm transform hover:-translate-y-1' 
                    : 'bg-surface-container-lowest border-border-subtle opacity-80'
                }`}
              >
                <span className={`text-2xl font-bold mb-1 ${isOptimal ? 'text-indigo-600 dark:text-indigo-400' : 'text-on-surface'}`} dir="ltr">
                  {formatTime(mins)}
                </span>
                <span className="text-xs text-on-surface-variant font-medium">
                  {cycles} {t.cycles}
                </span>
                <span className="text-xs text-on-surface-variant opacity-75 mt-1">
                  ({cycles * 1.5} {t.hours})
                </span>
              </div>
            );
          })}
        </div>
        
        <p className="text-xs text-center text-on-surface-variant/70 mt-4 max-w-lg mx-auto">
          {t.footnote}
        </p>
      </div>

      <ShareActions />
    </div>
  );
}

