import { useState, useDeferredValue, useEffect, useMemo } from 'react';
import SEO from '../components/SEO';
import FAQ from '../components/FAQ';
import Decimal from 'decimal.js';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useI18n } from '../contexts/i18n';
import Breadcrumbs from '../components/Breadcrumbs';
import RelatedCalculators from '../components/RelatedCalculators';
import { getGuideData } from '../data/guideTranslations';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

export default function MortgageCalculator() {
  const { t, lang } = useI18n();
  const guide = getGuideData('mortgage', lang);
  const [principal, setPrincipal] = useState(300000);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(30);

  const { monthlyPayment, totalInterest } = useMemo(() => {
    try {
      const decP = new Decimal(principal || 0);
      const decR = new Decimal(rate || 0).div(100).div(12);
      const decN = new Decimal(years || 0).mul(12);

      let mp = new Decimal(0);

      if (decR.isZero()) {
        mp = decN.isZero() ? new Decimal(0) : decP.div(decN);
      } else if (!decN.isZero()) {
        const rateFactor = decR.add(1).pow(decN.toNumber());
        mp = decP.mul(decR.mul(rateFactor)).div(rateFactor.sub(1));
      }

      const totalPaid = mp.mul(decN);
      const ti = totalPaid.sub(decP);

      return {
        monthlyPayment: mp.isFinite() ? mp.toNumber() : 0,
        totalInterest: ti.isFinite() ? ti.toNumber() : 0
      };
    } catch {
      return { monthlyPayment: 0, totalInterest: 0 };
    }
  }, [principal, rate, years]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'calculate', {
          event_category: 'Mortgage Calculator',
          principal,
          rate,
          years
        });
      }
    }, 2000);
    return () => clearTimeout(handler);
  }, [principal, rate, years]);

  const defaultCurrency = lang === 'he' ? 'ILS' : lang === 'fr' || lang === 'es' ? 'EUR' : 'USD';
  const currencyFormat = new Intl.NumberFormat(lang === 'en' ? 'en-US' : lang, { style: 'currency', currency: defaultCurrency, minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const chartData = {
    labels: [t.loanAmount, t.totalInterest],
    datasets: [
      {
        data: [principal, totalInterest],
        backgroundColor: ['#2563eb', '#f59e0b'],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    animation: false as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.label}: ${currencyFormat.format(context.raw || 0)}`,
        },
      },
    },
    cutout: '65%',
  };

  const deferredChartData = useDeferredValue(chartData);

  return (
    <div className="w-full">
      <Breadcrumbs items={[{ label: t.catAll || 'Library', path: `/${lang}/all` }, { label: t.mortgageTitle }]} />
      <div className="w-full h-full flex flex-col lg:flex-row gap-8 items-start relative">
      <SEO
        title={t.mortgageTitle}
        description={t.mortgageDesc}
        canonicalUrl={`/${lang}/mortgage-calculator`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: t.mortgageTitle,
          description: t.mortgageDesc,
          applicationCategory: 'CalculatorApplication',
          operatingSystem: 'Any',
          url: `https://globalcalcpro.com/${lang}/mortgage-calculator`
        }}
      />
      
      {/* Input Form */}
      <div className="flex-1 w-full bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-stone-200 flex flex-col">
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight mb-3">{t.mortgageTitle}</h2>
          <p className="text-stone-500 font-medium text-[15px] leading-relaxed max-w-sm">{t.mortgageExplanation}</p>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-8">
            <div className="group">
              <label className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">{t.loanAmount}</label>
              <input type="number" value={principal} onChange={e => setPrincipal(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-3xl md:text-4xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" />
            </div>
            <div className="group">
              <label className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">{t.interestRate}</label>
              <input type="number" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-3xl md:text-4xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" />
            </div>
            <div className="group">
              <label className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">{t.loanTerm}</label>
              <input type="number" value={years} onChange={e => setYears(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-3xl md:text-4xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Sticky Results Dashboard */}
      <div className="w-full lg:w-[420px] shrink-0 lg:sticky lg:top-24 bg-stone-900 rounded-3xl p-8 shadow-2xl border border-stone-800 text-white flex flex-col">
        <div className="mb-8">
          <span className="text-[11px] tracking-widest uppercase font-bold text-stone-400 block mb-3">{t.monthlyPayment}</span>
          <div className="text-5xl font-black text-white tracking-tighter" dir="ltr">{currencyFormat.format(monthlyPayment)}</div>
        </div>
        
        <div className="mb-8 p-5 bg-white/5 rounded-2xl border border-white/10">
          <span className="text-[11px] tracking-widest uppercase font-bold text-stone-400 block mb-1">{t.totalInterest}</span>
          <div className="text-xl font-bold text-blue-400" dir="ltr">{currencyFormat.format(totalInterest)}</div>
        </div>
        
        <div className="w-full h-[240px]" dir="ltr">
          <Doughnut data={deferredChartData} options={chartOptions} />
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
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold">1</span>
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
      
      <RelatedCalculators currentId="mortgage" />
    </div>
  );
}
