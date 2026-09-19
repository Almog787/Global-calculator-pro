import FAQ from '../../components/FAQ';
import { useEffect, useMemo, useState } from 'react';
import { useUrlState } from '../../hooks/useUrlState';
import SEO from '../../components/SEO';
import { useI18n } from '../../contexts/i18n';
import Breadcrumbs from '../../components/Breadcrumbs';
import RelatedCalculators from '../../components/RelatedCalculators';
import CalculatorGuide from '../../components/CalculatorGuide';
import ShareActions from '../../components/ShareActions';
import ScenarioPresets from '../../components/ScenarioPresets';
import { useMeasurementSystem } from '../../hooks/useMeasurementSystem';
import MeasurementToggle from '../../components/MeasurementToggle';

export default function BmiCalculator() {
  const { t, lang, guides } = useI18n();
  const guide = guides['bmi'] || { guideTitle: 'Guide & Formulas', guideDesc: 'Comprehensive calculation breakdown and FAQs.', faq: [] };
  const { system, setSystem } = useMeasurementSystem();
  
  const [mode, setMode] = useState<'standard' | 'reverse'>('standard');
  const [height, setHeight] = useUrlState('height', 175); // Always in cm
  const [weight, setWeight] = useUrlState('weight', 70);  // Always in kg
  const [targetBmi, setTargetBmi] = useState<number>(22.0);
  const [bmi, setBmi] = useUrlState('bmi', 0);

  // Conversion helpers for inputs
  const displayHeight = system === 'metric' ? height : (height / 2.54); // cm to inches
  const displayWeight = system === 'metric' ? weight : (weight * 2.20462); // kg to lbs

  const handleHeightChange = (val: number) => {
    setHeight(system === 'metric' ? val : (val * 2.54));
  };

  const handleWeightChange = (val: number) => {
    setWeight(system === 'metric' ? val : (val / 2.20462));
  };

  // Standard BMI
  useEffect(() => {
    if (height > 0 && weight > 0) {
      const heightInMeters = height / 100;
      setBmi(weight / (heightInMeters * heightInMeters));
    }
  }, [height, weight]);

  // Reverse Target Weight: Ideal weight for target BMI
  const targetIdealWeightKg = useMemo(() => {
    if (height > 0 && targetBmi > 0) {
      const heightInMeters = height / 100;
      return targetBmi * (heightInMeters * heightInMeters);
    }
    return 0;
  }, [height, targetBmi]);

  const displayTargetWeight = system === 'metric' ? targetIdealWeightKg : (targetIdealWeightKg * 2.20462);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'calculate', {
          event_category: 'BMI Calculator',
          mode,
          height,
          weight,
          targetBmi
        });
      }
    }, 2000);
    return () => clearTimeout(handler);
  }, [mode, height, weight, targetBmi]);

  const getCategory = (val: number = bmi) => {
    if (val < 18.5) return lang === 'he' ? 'תת-משקל' : lang === 'es' ? 'Bajo peso' : lang === 'fr' ? 'Insuffisance pondérale' : lang === 'ar' ? 'نقص الوزن' : 'Underweight';
    if (val < 25) return lang === 'he' ? 'משקל תקין ומומלץ' : lang === 'es' ? 'Peso normal' : lang === 'fr' ? 'Poids normal' : lang === 'ar' ? 'وزن طبيعي' : 'Normal weight';
    if (val < 30) return lang === 'he' ? 'עודף משקל' : lang === 'es' ? 'Sobrepeso' : lang === 'fr' ? 'Surpoids' : lang === 'ar' ? 'زيادة وزن' : 'Overweight';
    return lang === 'he' ? 'השמנת יתר' : lang === 'es' ? 'Obesidad' : lang === 'fr' ? 'Obésité' : lang === 'ar' ? 'سمنة' : 'Obese';
  };

  const presets = [
    {
      label: { en: 'Optimal Baseline (175cm / 70kg)', he: 'משקל תקין ממוצע (175 ס"מ / 70 ק"ג)', es: 'Línea Base Óptima (175cm / 70kg)', fr: 'Référence Optimale (175cm / 70kg)', ar: 'الوزن المثالي (175 سم / 70 كجم)' },
      description: { en: 'BMI 22.9 • Healthy range', he: 'BMI 22.9 • טווח בריא מומלץ', es: 'IMC 22.9 • Rango saludable', fr: 'IMC 22.9 • Poids santé', ar: 'مؤشر 22.9 • نطاق صحي' },
      values: { mode: 'standard', height: 175, weight: 70 },
      badge: 'HEALTHY'
    },
    {
      label: { en: 'Reverse Target: Ideal Weight', he: 'חישוב הפוך: יעד משקל אידיאלי', es: 'Meta Inversa: Peso Ideal', fr: 'Calcul Inverse : Poids Idéal', ar: 'حساب عكسي: الوزن المثالي' },
      description: { en: 'Find target weight for BMI 21.5', he: 'גלה מהו המשקל הדרוש ל-BMI 21.5', es: 'Descubrir peso para IMC 21.5', fr: 'Poids cible pour IMC 21.5', ar: 'الوزن المطلوب لمؤشر 21.5' },
      values: { mode: 'reverse', height: 175, targetBmi: 21.5 },
      badge: 'REVERSE'
    },
    {
      label: { en: 'Athletic / Tall (185cm / 80kg)', he: 'גבוה / ספורטיבי (185 ס"מ / 80 ק"ג)', es: 'Atlético (185cm / 80kg)', fr: 'Grand / Sportif (185cm / 80kg)', ar: 'طويل / رياضي (185 سم / 80 كجم)' },
      description: { en: 'BMI 23.4 • Balanced physique', he: 'BMI 23.4 • מבנה גוף מאוזן', es: 'IMC 23.4 • Físico balanceado', fr: 'IMC 23.4 • Physique équilibré', ar: 'مؤشر 23.4 • بنية متوازنة' },
      values: { mode: 'standard', height: 185, weight: 80 },
      badge: 'ATHLETIC'
    },
    {
      label: { en: 'Petite Healthy (160cm / 54kg)', he: 'גובה 160 ס"מ / 54 ק"ג', es: 'Estatura Media (160cm / 54kg)', fr: 'Petite Taille (160cm / 54kg)', ar: 'قامة متوسطة (160 سم / 54 كجم)' },
      description: { en: 'BMI 21.1 • Perfect center', he: 'BMI 21.1 • מרכז הטווח התקין', es: 'IMC 21.1 • Rango óptimo', fr: 'IMC 21.1 • Parfaitement sain', ar: 'مؤشر 21.1 • مثالي' },
      values: { mode: 'standard', height: 160, weight: 54 },
      badge: 'HEALTHY'
    }
  ];

  const modeLabels = {
    en: { standard: 'Calculate BMI from Weight', reverse: 'Reverse: Target Ideal Weight for BMI' },
    he: { standard: 'חישוב BMI לפי משקל וגובה', reverse: 'חישוב הפוך: מה המשקל האידיאלי לגובה שלי?' },
    es: { standard: 'Calcular IMC por Peso', reverse: 'Cálculo Inverso: Peso Ideal según IMC' },
    fr: { standard: 'Calculer l\'IMC', reverse: 'Calcul Inverse : Poids Idéal pour l\'IMC' },
    ar: { standard: 'حساب مؤشر كتلة الجسم (قياسي)', reverse: 'حساب عكسي: الوزن المثالي لمؤشر مستهدف' },
  }[lang] || { standard: 'Calculate BMI', reverse: 'Reverse Ideal Weight' };

  return (
    <div className="w-full">
      <Breadcrumbs items={[{ label: t.catAll || 'Library', path: `/${lang}/all` }, { label: t.bmiTitle }]} />

      {/* Programmatic Scenario Presets */}
      <ScenarioPresets
        presets={presets}
        onSelect={(vals) => {
          if (vals.mode) setMode(vals.mode);
          if (vals.height !== undefined) setHeight(vals.height);
          if (vals.weight !== undefined) setWeight(vals.weight);
          if (vals.targetBmi !== undefined) setTargetBmi(vals.targetBmi);
        }}
      />

      <div className="w-full h-full flex flex-col lg:flex-row gap-8 items-start relative">
      <SEO
        title={t.bmiTitle}
        description={t.bmiDesc}
        canonicalUrl={`/${lang}/bmi-calculator`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: t.bmiTitle,
          description: t.bmiDesc,
          applicationCategory: 'CalculatorApplication',
          operatingSystem: 'Any',
          url: `https://globalcalcpro.com/${lang}/bmi-calculator`
        }}
      />
      
      {/* Input Form */}
      <div className="flex-1 w-full bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-stone-200 flex flex-col">
        {/* Mode Selector Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-stone-100 rounded-2xl mb-8 border border-stone-200">
          <button
            type="button"
            onClick={() => setMode('standard')}
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              mode === 'standard'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {modeLabels.standard}
          </button>
          <button
            type="button"
            onClick={() => setMode('reverse')}
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              mode === 'reverse'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {modeLabels.reverse}
          </button>
        </div>

        <div className="mb-8 flex justify-between items-start flex-col sm:flex-row gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight mb-2">
              {mode === 'standard' ? t.bmiTitle : modeLabels.reverse}
            </h2>
            <p className="text-stone-500 font-medium text-[14px] leading-relaxed max-w-lg">
              {mode === 'standard'
                ? t.bmiExplanation
                : (lang === 'he' ? 'הזן את הגובה שלך ואת יעד ה-BMI הרצוי (למשל 22.0) כדי לגלות את משקל היעד המדויק שלך.' : 'Enter your height and target BMI to find your exact recommended goal weight.')}
            </p>
          </div>
          <MeasurementToggle system={system} onChange={setSystem} />
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-8">
            <div className="group">
              <label className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">
                {t.height} ({system === 'metric' ? 'cm' : 'inches'})
              </label>
              <input 
                type="number" 
                value={Math.round(displayHeight * 10) / 10} 
                onChange={e => handleHeightChange(Number(e.target.value))} 
                className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-3xl md:text-4xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" 
              />
            </div>

            {mode === 'standard' ? (
              <div className="group">
                <label className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">
                  {t.weightBmi} ({system === 'metric' ? 'kg' : 'lbs'})
                </label>
                <input 
                  type="number" 
                  value={Math.round(displayWeight * 10) / 10} 
                  onChange={e => handleWeightChange(Number(e.target.value))} 
                  className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-3xl md:text-4xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" 
                />
              </div>
            ) : (
              <div className="group">
                <label className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">
                  {lang === 'he' ? 'יעד BMI מבוקש (בריא: 18.5 - 24.9)' : 'Target BMI (Healthy: 18.5 - 24.9)'}
                </label>
                <input 
                  type="number" 
                  step="0.1"
                  value={targetBmi} 
                  onChange={e => setTargetBmi(Number(e.target.value))} 
                  className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-3xl md:text-4xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" 
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Sticky Results Dashboard */}
      <div className="w-full lg:w-[420px] shrink-0 lg:sticky lg:top-24 bg-stone-900 rounded-3xl p-8 shadow-2xl border border-stone-800 text-white flex flex-col">
        <div className="mb-8">
          <span className="text-[11px] tracking-widest uppercase font-bold text-stone-400 block mb-3">
            {mode === 'standard' ? t.bmiResult : (lang === 'he' ? 'משקל יעד מומלץ' : 'Recommended Target Weight')}
          </span>
          <div className="text-5xl font-black text-white tracking-tighter" dir="ltr">
            {mode === 'standard' ? bmi.toFixed(1) : `${displayTargetWeight.toFixed(1)} ${system === 'metric' ? 'kg' : 'lbs'}`}
          </div>
        </div>
        
        <div className="mb-8 p-5 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
          <span className="text-[11px] tracking-widest uppercase font-bold text-stone-400 block">{t.bmiCategory}</span>
          <div className="text-xl font-bold text-blue-400">
            {getCategory(mode === 'standard' ? bmi : targetBmi)}
          </div>
        </div>

        <div className="pt-4 border-t border-white/10">
          <ShareActions calculatorTitle={t.bmiTitle} calculatorPath="/bmi-calculator" />
        </div>
      </div>
    </div>

      {/* SEO EDUCATIONAL GUIDE & FORMULA BREAKDOWN */}
      <CalculatorGuide guideKey="bmi" />

      <FAQ items={guide.faq} />

      <RelatedCalculators currentId="bmi" />
    </div>
  );
}
