import FAQ from '../components/FAQ';
import { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import { useI18n } from '../contexts/i18n';
import Breadcrumbs from '../components/Breadcrumbs';
import RelatedCalculators from '../components/RelatedCalculators';
import { getGuideData } from '../data/guideTranslations';
import { useMeasurementSystem } from '../hooks/useMeasurementSystem';
import MeasurementToggle from '../components/MeasurementToggle';

export default function BmiCalculator() {
  const { t, lang } = useI18n();
  const guide = getGuideData('bmi', lang);
  const { system, setSystem } = useMeasurementSystem();
  
  const [height, setHeight] = useState(175); // Always in cm
  const [weight, setWeight] = useState(70);  // Always in kg
  const [bmi, setBmi] = useState(0);

  // Conversion helpers for inputs
  const displayHeight = system === 'metric' ? height : (height / 2.54); // cm to inches
  const displayWeight = system === 'metric' ? weight : (weight * 2.20462); // kg to lbs

  const handleHeightChange = (val: number) => {
    setHeight(system === 'metric' ? val : (val * 2.54));
  };

  const handleWeightChange = (val: number) => {
    setWeight(system === 'metric' ? val : (val / 2.20462));
  };

  useEffect(() => {
    if (height > 0 && weight > 0) {
      const heightInMeters = height / 100;
      setBmi(weight / (heightInMeters * heightInMeters));
    }
  }, [height, weight]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'calculate', {
          event_category: 'BMI Calculator',
          height,
          weight
        });
      }
    }, 2000);
    return () => clearTimeout(handler);
  }, [height, weight]);

  const getCategory = () => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  return (
    <div className="w-full">
      <Breadcrumbs items={[{ label: t.catAll || 'Library', path: `/${lang}/all` }, { label: t.bmiTitle }]} />
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
        <div className="mb-8 flex justify-between items-start flex-col sm:flex-row gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight mb-3">{t.bmiTitle}</h2>
            <p className="text-stone-500 font-medium text-[15px] leading-relaxed max-w-sm">{t.bmiExplanation}</p>
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
          </div>
        </div>
      </div>
      
      {/* Sticky Results Dashboard */}
      <div className="w-full lg:w-[420px] shrink-0 lg:sticky lg:top-24 bg-stone-900 rounded-3xl p-8 shadow-2xl border border-stone-800 text-white flex flex-col">
        <div className="mb-8">
          <span className="text-[11px] tracking-widest uppercase font-bold text-stone-400 block mb-3">{t.bmiResult}</span>
          <div className="text-5xl font-black text-white tracking-tighter" dir="ltr">{bmi.toFixed(1)}</div>
        </div>
        
        <div className="mb-8 p-5 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
          <span className="text-[11px] tracking-widest uppercase font-bold text-stone-400 block">{t.bmiCategory}</span>
          <div className="text-xl font-bold text-blue-400">{getCategory()}</div>
        </div>
      </div>
    </div>

      {/* SEO EDUCATIONAL GUIDE & FORMULA BREAKDOWN */}
      <section className="w-full bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-xs border border-stone-200 mt-8 mb-8 space-y-8">
        <div className="border-b border-stone-200 pb-6">
          <h2 className="text-2xl sm:text-3xl font-headline font-bold text-stone-900 tracking-tight mb-3">
            {guide.guideTitle}
          </h2>
          <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
            {guide.guideDesc}
          </p>
        </div>

        {guide.formulaHeading && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-100 text-teal-700 text-xs font-bold">1</span>
              {guide.formulaHeading}
            </h3>
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 font-mono text-xs sm:text-sm text-stone-800 space-y-2">
              {guide.formulaLines?.map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
          </div>
        )}
      </section>

      <FAQ items={guide.faq} />

      <RelatedCalculators currentId="bmi" />
    </div>
  );
}
