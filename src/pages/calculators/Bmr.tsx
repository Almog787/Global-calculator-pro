import { useUrlState } from '../../hooks/useUrlState';
import React from 'react';
import { Activity } from 'lucide-react';
import { useMeasurementSystem } from '../../hooks/useMeasurementSystem';
import MeasurementToggle from '../../components/MeasurementToggle';
import { useI18n, Language } from '../../contexts/i18n';

const dict: Record<Language, {
  title: string;
  age: string;
  gender: string;
  male: string;
  female: string;
  weight: string;
  height: string;
  kg: string;
  lbs: string;
  cm: string;
  inches: string;
  activityLevel: string;
  actSedentary: string;
  actLight: string;
  actModerate: string;
  actVery: string;
  actExtra: string;
  maintainTdee: string;
  kcalDay: string;
  kcal: string;
  tdeeSubtitle: string;
  mildLoss: string;
  weightLoss: string;
  weightGain: string;
  bmrLabel: string;
}> = {
  en: {
    title: 'BMR & Daily Calorie Needs (TDEE)',
    age: 'Age',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    weight: 'Weight',
    height: 'Height',
    kg: 'kg',
    lbs: 'lbs',
    cm: 'cm',
    inches: 'inches',
    activityLevel: 'Activity Level',
    actSedentary: 'Sedentary (little/no exercise)',
    actLight: 'Lightly active (1-3 days/week)',
    actModerate: 'Moderately active (3-5 days/week)',
    actVery: 'Very active (6-7 days/week)',
    actExtra: 'Extra active (physical job/2x training)',
    maintainTdee: 'Maintain Weight (TDEE)',
    kcalDay: 'kcal/day',
    kcal: 'kcal',
    tdeeSubtitle: 'Total Daily Energy Expenditure',
    mildLoss: 'Mild Weight Loss (0.25kg/wk)',
    weightLoss: 'Weight Loss (0.5kg/wk)',
    weightGain: 'Weight Gain (0.5kg/wk)',
    bmrLabel: 'Basal Metabolic Rate (BMR)',
  },
  he: {
    title: 'מחשבון BMR ושריפת קלוריות יומית (TDEE)',
    age: 'גיל',
    gender: 'מין',
    male: 'זכר',
    female: 'נקבה',
    weight: 'משקל',
    height: 'גובה',
    kg: 'ק"ג',
    lbs: 'ליברות',
    cm: 'ס"מ',
    inches: 'אינצ׳ים',
    activityLevel: 'רמת פעילות גופנית',
    actSedentary: 'יושבני (מעט או ללא פעילות)',
    actLight: 'פעילות קלה (1-3 אימונים בשבוע)',
    actModerate: 'פעילות בינונית (3-5 אימונים בשבוע)',
    actVery: 'פעילות גבוהה (6-7 אימונים בשבוע)',
    actExtra: 'אינטנסיבי במיוחד (עבודה פיזית/פעמיים ביום)',
    maintainTdee: 'שמירה על משקל קיים (TDEE)',
    kcalDay: 'קק"ל/יום',
    kcal: 'קק"ל',
    tdeeSubtitle: 'סך ההוצאה האנרגטית היומית',
    mildLoss: 'ירידה מתונה (0.25 ק"ג לשבוע)',
    weightLoss: 'חיטוב וירידה (0.5 ק"ג לשבוע)',
    weightGain: 'עלייה במסה (0.5 ק"ג לשבוע)',
    bmrLabel: 'קצב חילוף חומרים בסיסי (BMR)',
  },
  es: {
    title: 'Calculadora de TMB y Calorías Diarias (TDEE)',
    age: 'Edad',
    gender: 'Sexo',
    male: 'Hombre',
    female: 'Mujer',
    weight: 'Peso',
    height: 'Altura',
    kg: 'kg',
    lbs: 'lb',
    cm: 'cm',
    inches: 'pulg.',
    activityLevel: 'Nivel de Actividad',
    actSedentary: 'Sedentario (poco o ningún ejercicio)',
    actLight: 'Actividad ligera (1-3 días/sem)',
    actModerate: 'Actividad moderada (3-5 días/sem)',
    actVery: 'Muy activo (6-7 días/sem)',
    actExtra: 'Extra activo (trabajo físico/doble sesión)',
    maintainTdee: 'Mantener Peso (TDEE)',
    kcalDay: 'kcal/día',
    kcal: 'kcal',
    tdeeSubtitle: 'Gasto Energético Diario Total',
    mildLoss: 'Pérdida Suave (0.25kg/sem)',
    weightLoss: 'Pérdida de Peso (0.5kg/sem)',
    weightGain: 'Aumento de Peso (0.5kg/sem)',
    bmrLabel: 'Tasa Metabólica Basal (TMB)',
  },
  fr: {
    title: 'Calculateur de Métabolisme (BMR & TDEE)',
    age: 'Âge',
    gender: 'Sexe',
    male: 'Homme',
    female: 'Femme',
    weight: 'Poids',
    height: 'Taille',
    kg: 'kg',
    lbs: 'lb',
    cm: 'cm',
    inches: 'pouces',
    activityLevel: 'Niveau d\'Activité',
    actSedentary: 'Sédentaire (peu ou pas d\'exercice)',
    actLight: 'Légèrement actif (1-3 jours/sem)',
    actModerate: 'Modérément actif (3-5 jours/sem)',
    actVery: 'Très actif (6-7 jours/sem)',
    actExtra: 'Extrêmement actif (métier physique/sport)',
    maintainTdee: 'Maintien du Poids (TDEE)',
    kcalDay: 'kcal/jour',
    kcal: 'kcal',
    tdeeSubtitle: 'Dépense Énergétique Quotidienne Totale',
    mildLoss: 'Perte Douce (0.25kg/sem)',
    weightLoss: 'Perte de Poids (0.5kg/sem)',
    weightGain: 'Prise de Poids (0.5kg/sem)',
    bmrLabel: 'Métabolisme de Base (BMR)',
  },
  ar: {
    title: 'حاسبة معدل الأيض الأساسي والسعرات اليومية (BMR/TDEE)',
    age: 'العمر',
    gender: 'الجنس',
    male: 'ذكر',
    female: 'أنثى',
    weight: 'الوزن',
    height: 'الطول',
    kg: 'كجم',
    lbs: 'رطل',
    cm: 'سم',
    inches: 'بوصة',
    activityLevel: 'مستوى النشاط البدني',
    actSedentary: 'خامل (قليل أو بدون تمرين)',
    actLight: 'نشاط خفيف (1-3 أيام/أسبوع)',
    actModerate: 'نشاط متوسط (3-5 أيام/أسبوع)',
    actVery: 'نشاط عالٍ (6-7 أيام/أسبوع)',
    actExtra: 'نشاط شاق جداً (عمل بدني أو تمرين مزدوج)',
    maintainTdee: 'تثبيت الوزن (TDEE)',
    kcalDay: 'سعرة/يوم',
    kcal: 'سعرة',
    tdeeSubtitle: 'إجمالي استهلاك الطاقة اليومي',
    mildLoss: 'خسارة وزن خفيفة (0.25 كجم/أسبوع)',
    weightLoss: 'خسارة الوزن (0.5 كجم/أسبوع)',
    weightGain: 'زيادة الوزن (0.5 كجم/أسبوع)',
    bmrLabel: 'معدل الأيض الأساسي (BMR)',
  },
  ru: {
    title: 'Калькулятор базового метаболизма (BMR) и калорий (TDEE)',
    age: 'Возраст',
    gender: 'Пол',
    male: 'Мужской',
    female: 'Женский',
    weight: 'Вес',
    height: 'Рост',
    kg: 'кг',
    lbs: 'фунты',
    cm: 'см',
    inches: 'дюймы',
    activityLevel: 'Уровень активности',
    actSedentary: 'Сидячий образ жизни (минимум нагрузок)',
    actLight: 'Легкая активность (1-3 дня/неделю)',
    actModerate: 'Умеренная активность (3-5 дней/неделю)',
    actVery: 'Высокая активность (6-7 дней/неделю)',
    actExtra: 'Экстремальная нагрузка (физ. труд/спорт)',
    maintainTdee: 'Поддержание веса (TDEE)',
    kcalDay: 'ккал/день',
    kcal: 'ккал',
    tdeeSubtitle: 'Общий суточный расход энергии',
    mildLoss: 'Плавное снижение (0.25 кг/нед)',
    weightLoss: 'Похудение (0.5 кг/нед)',
    weightGain: 'Набор массы (0.5 кг/нед)',
    bmrLabel: 'Базовый метаболизм (BMR)',
  },
};

export default function Bmr() {
  const { lang } = useI18n();
  const t = dict[lang] || dict.en;
  const { system, setSystem } = useMeasurementSystem();
  
  const [age, setAge] = useUrlState<number>('age', 30);
  const [gender, setGender] = useUrlState<'male' | 'female'>('gender', 'male');
  const [weight, setWeight] = useUrlState<number>('weight', 75); // Always in kg
  const [height, setHeight] = useUrlState<number>('height', 175); // Always in cm
  const [activity, setActivity] = useUrlState<number>('activity', 1.2);

  const displayHeight = system === 'metric' ? height : (height / 2.54);
  const displayWeight = system === 'metric' ? weight : (weight * 2.20462);

  const handleHeightChange = (val: number) => {
    setHeight(system === 'metric' ? val : (val * 2.54));
  };

  const handleWeightChange = (val: number) => {
    setWeight(system === 'metric' ? val : (val / 2.20462));
  };

  // Mifflin-St Jeor Equation
  const baseBmr = (10 * weight) + (6.25 * height) - (5 * age);
  const bmr = gender === 'male' ? baseBmr + 5 : baseBmr - 161;
  const tdee = bmr * activity;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center text-teal-600 dark:text-teal-400">
            <Activity className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {t.title}
          </h1>
        </div>
        <MeasurementToggle system={system} onChange={setSystem} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.age}</label>
              <input type="number" value={age || ''} onChange={e => setAge(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.gender}</label>
              <select value={gender} onChange={e => setGender(e.target.value as any)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white">
                <option value="male">{t.male}</option>
                <option value="female">{t.female}</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.weight} ({system === 'metric' ? t.kg : t.lbs})</label>
              <input type="number" value={Math.round(displayWeight * 10) / 10 || ''} onChange={e => handleWeightChange(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.height} ({system === 'metric' ? t.cm : t.inches})</label>
              <input type="number" value={Math.round(displayHeight * 10) / 10 || ''} onChange={e => handleHeightChange(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.activityLevel}</label>
            <select value={activity} onChange={e => setActivity(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white">
              <option value={1.2}>{t.actSedentary}</option>
              <option value={1.375}>{t.actLight}</option>
              <option value={1.55}>{t.actModerate}</option>
              <option value={1.725}>{t.actVery}</option>
              <option value={1.9}>{t.actExtra}</option>
            </select>
          </div>
        </div>
        <div className="bg-teal-50 dark:bg-teal-900/10 p-6 sm:p-8 rounded-3xl flex flex-col justify-center">
          <p className="text-sm text-teal-600 dark:text-teal-400 font-medium mb-2">{t.maintainTdee}</p>
          <p className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-2">
            {Math.round(tdee).toLocaleString()} <span className="text-2xl text-slate-500">{t.kcalDay}</span>
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{t.tdeeSubtitle}</p>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-t border-teal-100 dark:border-teal-800/30">
              <span className="text-slate-600 dark:text-slate-400">{t.mildLoss}</span>
              <span className="font-semibold text-slate-900 dark:text-white">{Math.round(tdee - 250).toLocaleString()} {t.kcal}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-t border-teal-100 dark:border-teal-800/30">
              <span className="text-slate-600 dark:text-slate-400">{t.weightLoss}</span>
              <span className="font-semibold text-slate-900 dark:text-white">{Math.round(tdee - 500).toLocaleString()} {t.kcal}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-t border-teal-100 dark:border-teal-800/30">
              <span className="text-slate-600 dark:text-slate-400">{t.weightGain}</span>
              <span className="font-semibold text-slate-900 dark:text-white">{Math.round(tdee + 500).toLocaleString()} {t.kcal}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-t border-teal-100 dark:border-teal-800/30">
              <span className="text-slate-600 dark:text-slate-400">{t.bmrLabel}</span>
              <span className="font-semibold text-slate-900 dark:text-white">{Math.round(bmr).toLocaleString()} {t.kcal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

