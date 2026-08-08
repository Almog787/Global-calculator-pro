import { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import { useI18n } from '../contexts/i18n';
import Breadcrumbs from '../components/Breadcrumbs';
import RelatedCalculators from '../components/RelatedCalculators';

export default function AgeCalculator() {
  const { t, lang } = useI18n();
  const [dob, setDob] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 30);
    return d.toISOString().split('T')[0];
  });
  
  const [age, setAge] = useState({ years: 0, months: 0, days: 0 });

  useEffect(() => {
    if (!dob) return;
    
    const birthDate = new Date(dob);
    const today = new Date();
    
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();
    
    if (months < 0 || (months === 0 && days < 0)) {
      years--;
      months += 12;
    }
    
    if (days < 0) {
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, birthDate.getDate());
      days = Math.floor((today.getTime() - lastMonth.getTime()) / (1000 * 60 * 60 * 24));
      months--;
      if (months < 0) {
        months += 12;
      }
    }
    
    setAge({ years, months, days });
  }, [dob]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'calculate', {
          event_category: 'Age Calculator',
          dob
        });
      }
    }, 2000);
    return () => clearTimeout(handler);
  }, [dob]);

  return (
    <div className="w-full">
      <Breadcrumbs items={[{ label: t.catAll || 'Library', path: `/${lang}/all` }, { label: t.ageTitle }]} />
      <article className="w-full h-full flex flex-col bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-stone-200">
      <SEO
        title={t.ageTitle}
        description={t.ageDesc}
        canonicalUrl={`/${lang}/age-calculator`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: t.ageTitle,
          description: t.ageDesc,
          applicationCategory: 'CalculatorApplication',
          operatingSystem: 'Any',
          url: `https://globalcalcpro.com/${lang}/age-calculator`
        }}
      />
      <div className="mb-10">
        <h2 className="text-2xl md:text-3xl font-headline text-stone-900 tracking-tight mb-3">{t.ageTitle}</h2>
        <p className="text-stone-500 font-medium text-[15px] leading-relaxed max-w-sm">{t.ageExplanation}</p>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-8">
          <div>
            <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.dateOfBirth}</label>
            <input type="date" value={dob} onChange={e => setDob(e.target.value)} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl md:text-3xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-stone-200">
          <div className="mb-6">
            <span className="text-xs tracking-wider uppercase font-bold text-stone-600 block mb-4">{t.exactAge}</span>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                <div className="text-4xl md:text-5xl font-headline font-bold text-stone-900 tracking-tight mb-1" dir="ltr">{age.years}</div>
                <div className="text-sm font-medium text-stone-500 uppercase tracking-wider">{t.yearsOld}</div>
              </div>
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                <div className="text-4xl md:text-5xl font-headline font-bold text-stone-900 tracking-tight mb-1" dir="ltr">{age.months}</div>
                <div className="text-sm font-medium text-stone-500 uppercase tracking-wider">{t.monthsOld}</div>
              </div>
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                <div className="text-4xl md:text-5xl font-headline font-bold text-stone-900 tracking-tight mb-1" dir="ltr">{age.days}</div>
                <div className="text-sm font-medium text-stone-500 uppercase tracking-wider">{t.daysOld}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
      <RelatedCalculators currentId="age" />
    </div>
  );
}
