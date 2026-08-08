import { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import { useI18n } from '../contexts/i18n';
import Breadcrumbs from '../components/Breadcrumbs';
import RelatedCalculators from '../components/RelatedCalculators';
import CopyButton from '../components/CopyButton';

const conversions: Record<string, Record<string, (v: number) => number>> = {
  length: {
    'm-ft': v => v * 3.2808398950131,
    'ft-m': v => v / 3.2808398950131,
    'km-mi': v => v * 0.62137119223733,
    'mi-km': v => v / 0.62137119223733,
  },
  weight: {
    'kg-lbs': v => v * 2.2046226218488,
    'lbs-kg': v => v / 2.2046226218488,
  },
  temp: {
    'c-f': v => (v * 9/5) + 32,
    'f-c': v => (v - 32) * 5/9,
  }
};

export default function UnitConverter() {
  const { t, lang } = useI18n();
  const [val, setVal] = useState<number | ''>(1);
  const [cat, setCat] = useState('length');
  const [type, setType] = useState('m-ft');

  const numericVal = typeof val === 'number' ? val : 0;
  const res = conversions[cat]?.[type]?.(numericVal) || 0;

  useEffect(() => {
    const handler = setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'calculate', {
          event_category: 'Unit Converter',
          category: cat,
          conversion_type: type,
          value: numericVal
        });
      }
    }, 2000);
    return () => clearTimeout(handler);
  }, [numericVal, cat, type]);

  const numFormat = new Intl.NumberFormat(lang === 'en' ? 'en-US' : lang, { maximumFractionDigits: 4 });

  const categoryNames: Record<string, string> = {
    length: t.length,
    weight: t.weight,
    temp: t.temp
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-2">
      <Breadcrumbs items={[{ label: t.catAll || 'Library', path: `/${lang}/all` }, { label: t.unitConvTitle }]} />
      <article className="w-full bg-white rounded-2xl p-6 md:p-8 shadow-xs border border-stone-200/80">
        <SEO
        title={t.unitConvTitle}
        description={t.unitConvDesc}
        canonicalUrl={`/${lang}/unit-converter`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: t.unitConvTitle,
          description: t.unitConvDesc,
          applicationCategory: 'CalculatorApplication',
          operatingSystem: 'Any',
          url: `https://globalcalcpro.com/${lang}/unit-converter`
        }}
      />
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-headline font-bold text-stone-900 tracking-tight mb-2">{t.unitConvTitle}</h1>
          <p className="text-stone-500 text-sm md:text-base leading-relaxed max-w-lg">{t.unitConvExplanation}</p>
        </div>

        <div className="space-y-6">
          <div className="flex border-b border-stone-200">
            {['length', 'weight', 'temp'].map(c => (
              <button
                key={c}
                type="button"
                onClick={() => { setCat(c); setType(Object.keys(conversions[c])[0]); }}
                className={`flex-1 pb-3 pt-2 font-bold uppercase tracking-wider text-xs transition-colors border-b-2 -mb-[2px] cursor-pointer ${cat === c ? 'text-blue-600 border-blue-600' : 'text-stone-600 border-transparent hover:text-stone-900'}`}
              >
                {categoryNames[c]}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-5 bg-stone-50/60 p-5 rounded-2xl border border-stone-200/60">
              <div>
                <label className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1.5 block">Conversion Type</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all cursor-pointer"
                  dir="ltr"
                >
                  {Object.keys(conversions[cat]).map(k => {
                    const [from, to] = k.split('-');
                    return <option key={k} value={k}>{from.toUpperCase()} ➝ {to.toUpperCase()}</option>;
                  })}
                </select>
              </div>

              <div>
                <label className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1.5 block">Value to Convert</label>
                <input
                  type="number"
                  value={val}
                  onChange={e => setVal(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xl font-bold text-stone-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all shadow-2xs"
                />
              </div>
            </div>

            <div className="bg-stone-900 text-white rounded-2xl p-6 flex flex-col justify-between shadow-xs border border-stone-800 h-full">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs tracking-wider uppercase font-bold text-stone-600">Converted Value</span>
                  <CopyButton textToCopy={numFormat.format(res)} className="bg-stone-800 text-white border-stone-700 hover:bg-white hover:text-stone-900" />
                </div>
                <div className="text-3xl md:text-5xl font-headline font-bold text-blue-400 tracking-tight my-2 truncate" dir="ltr">
                  {!isNaN(res) ? numFormat.format(res) : '0'}
                </div>
              </div>
              <div className="text-xs text-stone-600 border-t border-stone-800 pt-3 font-mono">
                {type.replace('-', ' ➝ ').toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </article>
      <RelatedCalculators currentId="unit" />
    </div>
  );
}
