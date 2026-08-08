import { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import { useI18n } from '../contexts/i18n';
import Breadcrumbs from '../components/Breadcrumbs';
import RelatedCalculators from '../components/RelatedCalculators';

export default function BmiCalculator() {
  const { t, lang } = useI18n();
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(70);
  const [bmi, setBmi] = useState(0);

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
      <article className="w-full h-full flex flex-col bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-stone-200">
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
      <div className="mb-10">
        <h2 className="text-2xl md:text-3xl font-headline text-stone-900 tracking-tight mb-3">{t.bmiTitle}</h2>
        <p className="text-stone-500 font-medium text-[15px] leading-relaxed max-w-sm">{t.bmiExplanation}</p>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-8">
          <div>
            <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.height} (cm)</label>
            <input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl md:text-3xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
          </div>
          <div>
            <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.weightBmi} (kg)</label>
            <input type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl md:text-3xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-stone-200">
          <div className="mb-6">
            <span className="text-xs tracking-wider uppercase font-bold text-stone-600 block mb-2">{t.bmiResult}</span>
            <div className="text-4xl md:text-5xl font-headline font-bold text-stone-900 tracking-tight" dir="ltr">{bmi.toFixed(1)}</div>
          </div>
          <div>
            <span className="text-xs tracking-wider uppercase font-bold text-stone-600 block mb-1">{t.bmiCategory}</span>
            <div className="text-lg md:text-xl font-headline text-stone-600">{getCategory()}</div>
          </div>
        </div>
      </div>
    </article>
      <RelatedCalculators currentId="bmi" />
    </div>
  );
}
