import { useDeferredValue, useEffect, useMemo } from 'react';
import { useUrlState } from '../../hooks/useUrlState';
import SEO from '../../components/SEO';
import FAQ from '../../components/FAQ';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useI18n } from '../../contexts/i18n';
import Breadcrumbs from '../../components/Breadcrumbs';
import RelatedCalculators from '../../components/RelatedCalculators';
import CalculatorGuide from '../../components/CalculatorGuide';
import ShareActions from '../../components/ShareActions';
import { calculateMortgage } from '../../lib/math/finance';


ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

export default function MortgageCalculator() {
  const { t, lang, guides } = useI18n();
  const guide = guides['mortgage'] || { guideTitle: 'Guide & Formulas', guideDesc: 'Comprehensive calculation breakdown and FAQs.', faq: [] };
  const [principal, setPrincipal] = useUrlState('principal', 300000);
  const [rate, setRate] = useUrlState('rate', 6.5);
  const [years, setYears] = useUrlState('years', 30);

  const { monthlyPayment, totalInterest } = useMemo(() => {
    return calculateMortgage(principal, rate, years);
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
        <form toolname="mortgage_calculator" tooldescription="Calculate monthly mortgage payment, total interest, and loan amortization" onSubmit={e => e.preventDefault()} className="flex-1 flex flex-col justify-between">
          <div className="space-y-8">
            <div className="group">
              <label htmlFor="mc-principal" className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">{t.loanAmount}</label>
              <input id="mc-principal" aria-label={t.loanAmount} toolparamdescription="Principal loan amount" type="number" value={principal} onChange={e => setPrincipal(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-3xl md:text-4xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" />
            </div>
            <div className="group">
              <label htmlFor="mc-rate" className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">{t.interestRate}</label>
              <input id="mc-rate" aria-label={t.interestRate} toolparamdescription="Annual interest rate percentage" type="number" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-3xl md:text-4xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" />
            </div>
            <div className="group">
              <label htmlFor="mc-years" className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">{t.loanTerm}</label>
              <input id="mc-years" aria-label={t.loanTerm} toolparamdescription="Duration of loan in years" type="number" value={years} onChange={e => setYears(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-3xl md:text-4xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" />
            </div>
          </div>
        </form>
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

        <div className="mt-6 pt-4 border-t border-white/10">
          <ShareActions calculatorTitle={t.mortgageTitle} calculatorPath="/mortgage-calculator" />
        </div>
      </div>
    </div>

      {/* SEO EDUCATIONAL GUIDE & FORMULA BREAKDOWN */}
      <CalculatorGuide
        guideKey="mortgage"
        onApplyPreset={(preset) => {
          if (preset.principal) setPrincipal(Number(preset.principal));
          if (preset.rate) setRate(Number(preset.rate));
          if (preset.years) setYears(Number(preset.years));
        }}
      />

      <FAQ items={guide.faq} />
      
      <RelatedCalculators currentId="mortgage" />
    </div>
  );
}
