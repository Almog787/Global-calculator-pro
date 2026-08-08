import { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import Decimal from 'decimal.js';
import { useI18n } from '../contexts/i18n';
import Breadcrumbs from '../components/Breadcrumbs';
import RelatedCalculators from '../components/RelatedCalculators';
import CopyButton from '../components/CopyButton';
import PresetChips from '../components/PresetChips';

export default function TipCalculator() {
  const { t, lang } = useI18n();
  const [bill, setBill] = useState<number | ''>(100);
  const [tipPercent, setTipPercent] = useState<number | ''>(15);
  const [people, setPeople] = useState<number | ''>(1);

  const [tipAmount, setTipAmount] = useState(0);
  const [totalPerPerson, setTotalPerPerson] = useState(0);

  useEffect(() => {
    try {
      const decBill = new Decimal(bill || 0);
      const decTipPercent = new Decimal(tipPercent || 0).div(100);
      const decTip = decBill.mul(decTipPercent);
      const decTotal = decBill.add(decTip);
      const decPeople = new Decimal(Math.max(1, Number(people) || 1));

      setTipAmount(decTip.toNumber());
      setTotalPerPerson(decTotal.div(decPeople).toNumber());
    } catch {
      setTipAmount(0);
      setTotalPerPerson(0);
    }
  }, [bill, tipPercent, people]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'calculate', {
          event_category: 'Tip Calculator',
          bill,
          tipPercent,
          people
        });
      }
    }, 2000);
    return () => clearTimeout(handler);
  }, [bill, tipPercent, people]);

  const defaultCurrency = lang === 'he' ? 'ILS' : lang === 'fr' || lang === 'es' ? 'EUR' : 'USD';
  const currencyFormat = new Intl.NumberFormat(lang === 'en' ? 'en-US' : lang, { style: 'currency', currency: defaultCurrency, minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-2">
      <Breadcrumbs items={[{ label: t.catAll || 'Library', path: `/${lang}/all` }, { label: t.tipTitle }]} />
      <article className="w-full bg-white rounded-2xl p-6 md:p-8 shadow-xs border border-stone-200/80">
        <SEO
        title={t.tipTitle}
        description={t.tipDesc}
        canonicalUrl={`/${lang}/tip-calculator`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: t.tipTitle,
          description: t.tipDesc,
          applicationCategory: 'CalculatorApplication',
          operatingSystem: 'Any',
          url: `https://globalcalcpro.com/${lang}/tip-calculator`
        }}
      />
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-headline font-bold text-stone-900 tracking-tight mb-2">{t.tipTitle}</h1>
          <p className="text-stone-500 text-sm md:text-base leading-relaxed max-w-lg">{t.tipExplanation}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-6 bg-stone-50/60 p-5 rounded-2xl border border-stone-200/60">
            <div>
              <label className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1.5 block">{t.billAmount}</label>
              <input
                type="number"
                value={bill}
                onChange={e => setBill(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xl font-bold text-stone-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1.5 block">{t.tipPercentage}</label>
              <input
                type="number"
                value={tipPercent}
                onChange={e => setTipPercent(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xl font-bold text-stone-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
              <PresetChips
                className="mt-2.5"
                presets={[10, 12, 15, 18, 20, 25]}
                selectedValue={typeof tipPercent === 'number' ? tipPercent : undefined}
                onSelect={(val) => setTipPercent(val)}
              />
            </div>
            <div>
              <label className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1.5 block">{t.numberOfPeople}</label>
              <input
                type="number"
                value={people}
                onChange={e => setPeople(e.target.value === '' ? '' : Math.max(1, Number(e.target.value)))}
                className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xl font-bold text-stone-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="bg-stone-900 text-white rounded-2xl p-6 flex flex-col justify-between shadow-xs border border-stone-800 h-full">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs tracking-wider uppercase font-bold text-stone-600 block">{t.totalPerPerson}</span>
                <CopyButton textToCopy={currencyFormat.format(totalPerPerson)} className="bg-stone-800 text-white border-stone-700 hover:bg-white hover:text-stone-900" />
              </div>
              <div className="text-3xl md:text-5xl font-headline font-bold text-emerald-400 tracking-tight my-2" dir="ltr">
                {currencyFormat.format(totalPerPerson)}
              </div>
            </div>

            <div className="border-t border-stone-800 pt-4 mt-6">
              <div className="flex items-center justify-between">
                <span className="text-xs tracking-wider uppercase font-bold text-stone-600 block">{t.tipAmount}</span>
                <CopyButton textToCopy={currencyFormat.format(tipAmount)} className="bg-stone-800 text-white border-stone-700 hover:bg-white hover:text-stone-900" />
              </div>
              <div className="text-xl md:text-2xl font-headline text-stone-200 mt-1 font-semibold" dir="ltr">
                {currencyFormat.format(tipAmount)}
              </div>
            </div>
          </div>
        </div>
      </article>
      <RelatedCalculators currentId="tip" />
    </div>
  );
}
