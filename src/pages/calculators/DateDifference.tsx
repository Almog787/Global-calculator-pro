import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { useI18n, Language } from '../../contexts/i18n';

const dict: Record<Language, {
  title: string;
  startDate: string;
  endDate: string;
  totalDiff: string;
  days: string;
  weekdays: string;
  weeks: string;
  weeksUnit: string;
  years: string;
  yearsUnit: string;
}> = {
  en: {
    title: 'Date Difference Calculator',
    startDate: 'Start Date',
    endDate: 'End Date',
    totalDiff: 'Total Difference',
    days: 'Days',
    weekdays: 'Weekdays (Mon-Fri)',
    weeks: 'Weeks',
    weeksUnit: 'weeks',
    years: 'Years',
    yearsUnit: 'years',
  },
  he: {
    title: 'מחשבון הפרש בין תאריכים',
    startDate: 'תאריך התחלה',
    endDate: 'תאריך סיום',
    totalDiff: 'סך ההפרש',
    days: 'ימים',
    weekdays: 'ימי עסקים (שני-שישי)',
    weeks: 'שבועות',
    weeksUnit: 'שבועות',
    years: 'שנים',
    yearsUnit: 'שנים',
  },
  es: {
    title: 'Calculadora de Diferencia de Fechas',
    startDate: 'Fecha de Inicio',
    endDate: 'Fecha de Fin',
    totalDiff: 'Diferencia Total',
    days: 'Días',
    weekdays: 'Días laborables (Lun-Vie)',
    weeks: 'Semanas',
    weeksUnit: 'semanas',
    years: 'Años',
    yearsUnit: 'años',
  },
  fr: {
    title: 'Calculateur d\'Écart entre Deux Dates',
    startDate: 'Date de Début',
    endDate: 'Date de Fin',
    totalDiff: 'Différence Totale',
    days: 'Jours',
    weekdays: 'Jours ouvrés (Lun-Ven)',
    weeks: 'Semaines',
    weeksUnit: 'semaines',
    years: 'Années',
    yearsUnit: 'ans',
  },
  ar: {
    title: 'حاسبة الفرق بين تاريخين',
    startDate: 'تاريخ البداية',
    endDate: 'تاريخ النهاية',
    totalDiff: 'إجمالي الفرق',
    days: 'يوم',
    weekdays: 'أيام العمل (الإثنين-الجمعة)',
    weeks: 'الأسابيع',
    weeksUnit: 'أسبوع',
    years: 'السنوات',
    yearsUnit: 'سنة',
  },
  ru: {
    title: 'Калькулятор разницы между датами',
    startDate: 'Начальная дата',
    endDate: 'Конечная дата',
    totalDiff: 'Общая разница',
    days: 'дней',
    weekdays: 'Рабочих дней (Пн-Пт)',
    weeks: 'Недели',
    weeksUnit: 'нед.',
    years: 'Годы',
    yearsUnit: 'лет',
  },
};

export default function DateDifference() {
  const { lang } = useI18n();
  const t = dict[lang] || dict.en;

  const [date1, setDate1] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [date2, setDate2] = useState<string>(() =>
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  let businessDays = 0;
  const curDate = new Date(Math.min(d1.getTime(), d2.getTime()));
  const endDate = new Date(Math.max(d1.getTime(), d2.getTime()));
  
  while (curDate < endDate) {
    const dayOfWeek = curDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) businessDays++;
    curDate.setDate(curDate.getDate() + 1);
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400">
          <Calendar className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          {t.title}
        </h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.startDate}</label>
            <input type="date" value={date1} onChange={e => setDate1(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.endDate}</label>
            <input type="date" value={date2} onChange={e => setDate2(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white" />
          </div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/10 p-6 sm:p-8 rounded-3xl flex flex-col justify-center">
          <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-2">{t.totalDiff}</p>
          <p className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            {diffDays} <span className="text-2xl sm:text-3xl text-slate-500 font-normal">{t.days}</span>
          </p>
          <div className="space-y-4 pt-4 border-t border-purple-200 dark:border-purple-900/30">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">{t.weekdays}</span>
              <span className="font-semibold text-slate-900 dark:text-white">{businessDays} {t.days}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">{t.weeks}</span>
              <span className="font-semibold text-slate-900 dark:text-white">{(diffDays / 7).toFixed(1)} {t.weeksUnit}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">{t.years}</span>
              <span className="font-semibold text-slate-900 dark:text-white">{(diffDays / 365.25).toFixed(2)} {t.yearsUnit}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

