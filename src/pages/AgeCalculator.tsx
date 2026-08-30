import { useEffect } from 'react';
import SEO from '../components/SEO';
import { useI18n } from '../contexts/i18n';
import Breadcrumbs from '../components/Breadcrumbs';
import RelatedCalculators from '../components/RelatedCalculators';
import FAQ from '../components/FAQ';
import { getGuideData } from '../data/guideTranslations';

export default function AgeCalculator() {
  const { t, lang } = useI18n();
  const guide = getGuideData('age', lang);
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
    
    if (isNaN(birthDate.getTime()) || birthDate > today) {
      setAge({ years: 0, months: 0, days: 0 });
      return;
    }
    
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
      <div className="w-full h-full flex flex-col lg:flex-row gap-8 items-start relative">
      
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
      
      {/* Input Form */}
      <div className="flex-1 w-full bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-stone-200 flex flex-col">
        <div className="mb-10">
          
        <h2 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight mb-3">{t.ageTitle}</h2>
        <p className="text-stone-500 font-medium text-[15px] leading-relaxed max-w-sm">{t.ageExplanation}</p>
      
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-8">
            
          <div className="group">
<label className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">{t.dateOfBirth}</label>
            <input type="date" value={dob} onChange={e => setDob(e.target.value)} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-3xl md:text-4xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" />
          </div>
        
          </div>
        </div>
      </div>
      
      {/* Sticky Results Dashboard */}
      <div className="w-full lg:w-[420px] shrink-0 lg:sticky lg:top-24 bg-stone-900 rounded-3xl p-8 shadow-2xl border border-stone-800 text-white flex flex-col">
          
          <div className="mb-6">
            <span className="text-xs tracking-wider uppercase font-bold text-stone-400 block mb-4">{t.exactAge}</span>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-4xl md:text-5xl font-headline font-bold text-white tracking-tight mb-1" dir="ltr">{age.years}</div>
                <div className="text-sm font-medium text-stone-400 uppercase tracking-wider">{t.yearsOld}</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-4xl md:text-5xl font-headline font-bold text-white tracking-tight mb-1" dir="ltr">{age.months}</div>
                <div className="text-sm font-medium text-stone-400 uppercase tracking-wider">{t.monthsOld}</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-4xl md:text-5xl font-headline font-bold text-white tracking-tight mb-1" dir="ltr">{age.days}</div>
                <div className="text-sm font-medium text-stone-400 uppercase tracking-wider">{t.daysOld}</div>
              </div>
            </div>
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
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-orange-100 text-orange-700 text-xs font-bold">1</span>
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

      <RelatedCalculators currentId="age" />
    </div>
  );
}
