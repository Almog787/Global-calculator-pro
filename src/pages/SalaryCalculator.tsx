import FAQ from '../components/FAQ';
import { useDeferredValue, useEffect, useMemo } from 'react';
import SEO from '../components/SEO';
import Decimal from 'decimal.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useI18n } from '../contexts/i18n';
import Breadcrumbs from '../components/Breadcrumbs';
import RelatedCalculators from '../components/RelatedCalculators';
import { getGuideData } from '../data/guideTranslations';
import { Link } from 'react-router-dom';
import { useCalculatorState } from '../hooks/useCalculatorState';
import ShareActions from '../components/ShareActions';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function SalaryCalculator() {
  const { t, lang } = useI18n();
  const guide = getGuideData('salary', lang);
  
  const { state, updateState, saveToHistory, loadFromHistory, getHistory } = useCalculatorState('salary', {
    amount: 50000,
    frequency: 'yearly'
  });

  const { amount, frequency } = state;
  const setAmount = (v: number) => updateState({ amount: v });
  const setFrequency = (v: string) => updateState({ frequency: v });
  
  const results = useMemo(() => {
    try {
      const decAmt = new Decimal(amount || 0);
      let decYearly = new Decimal(0);

      switch(frequency) {
        case 'hourly':
          decYearly = decAmt.mul(40).mul(52);
          break;
        case 'weekly':
          decYearly = decAmt.mul(52);
          break;
        case 'monthly':
          decYearly = decAmt.mul(12);
          break;
        case 'yearly':
        default:
          decYearly = decAmt;
          break;
      }

      const hourly = decYearly.div(2080).toNumber();
      const weekly = decYearly.div(52).toNumber();
      const monthly = decYearly.div(12).toNumber();
      const yearly = decYearly.toNumber();

      return { hourly, weekly, monthly, yearly };
    } catch {
      return { hourly: 0, weekly: 0, monthly: 0, yearly: 0 };
    }
  }, [amount, frequency]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'calculate', {
          event_category: 'Salary Calculator',
          amount,
          frequency
        });
      }
    }, 2000);
    return () => clearTimeout(handler);
  }, [amount, frequency]);

  const defaultCurrency = lang === 'he' ? 'ILS' : lang === 'fr' || lang === 'es' ? 'EUR' : 'USD';
  const currencyFormat = new Intl.NumberFormat(lang === 'en' ? 'en-US' : lang, { style: 'currency', currency: defaultCurrency, minimumFractionDigits: 0, maximumFractionDigits: 2 });

  const chartData = {
    labels: [t.hourly, t.weekly, t.monthly, t.yearly],
    datasets: [
      {
        label: t.salaryAmount || 'Salary',
        data: [results.hourly, results.weekly, results.monthly, results.yearly],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#6366f1'],
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    animation: false as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => currencyFormat.format(context.raw || 0),
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value: any) => currencyFormat.format(value),
          font: { size: 11 },
        },
        grid: {
          color: '#f3f4f6',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const deferredChartData = useDeferredValue(chartData);

  return (
    <div className="w-full">
      <Breadcrumbs items={[{ label: t.catAll || 'Library', path: `/${lang}/all` }, { label: t.salaryTitle }]} />
      <div className="w-full h-full flex flex-col lg:flex-row gap-8 items-start relative">
      <SEO
        title={t.salaryTitle}
        description={t.salaryDesc}
        canonicalUrl={`/${lang}/salary-calculator`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: t.salaryTitle,
          description: t.salaryDesc,
          applicationCategory: 'CalculatorApplication',
          operatingSystem: 'Any',
          url: `https://globalcalcpro.com/${lang}/salary-calculator`
        }}
      />
      
      {/* Input Form */}
      <div className="flex-1 w-full bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-stone-200 flex flex-col">
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight mb-3">{t.salaryTitle}</h2>
          <p className="text-stone-500 font-medium text-[15px] leading-relaxed max-w-sm">{t.salaryExplanation}</p>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-8">
            <div className="group">
              <label className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">{t.salaryAmount}</label>
              <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-3xl md:text-4xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" />
            </div>
            <div className="group">
              <label className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">{t.salaryFrequency}</label>
              <select value={frequency} onChange={e => setFrequency(e.target.value)} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-3xl md:text-4xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors cursor-pointer">
                <option value="hourly">{t.hourly}</option>
                <option value="weekly">{t.weekly}</option>
                <option value="monthly">{t.monthly}</option>
                <option value="yearly">{t.yearly}</option>
              </select>
            </div>
          </div>
        </div>

        <ShareActions
          onSaveHistory={saveToHistory}
          historyEntries={getHistory()}
          onLoadHistory={loadFromHistory}
        />
      </div>
      
      {/* Sticky Results Dashboard */}
      <div className="w-full lg:w-[420px] shrink-0 lg:sticky lg:top-24 flex flex-col gap-6">
        <div className="bg-stone-900 rounded-3xl p-8 shadow-2xl border border-stone-800 text-white flex flex-col">
          <div className="mb-8">
            <span className="text-[11px] tracking-widest uppercase font-bold text-stone-400 block mb-3">{t.yearly}</span>
            <div className="text-5xl font-black text-white tracking-tighter" dir="ltr">{currencyFormat.format(results.yearly)}</div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[11px] tracking-widest uppercase font-bold text-stone-400 block mb-1">{t.monthly}</span>
                <div className="text-lg font-bold text-blue-400" dir="ltr">{currencyFormat.format(results.monthly)}</div>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[11px] tracking-widest uppercase font-bold text-stone-400 block mb-1">{t.weekly}</span>
                <div className="text-lg font-bold text-blue-400" dir="ltr">{currencyFormat.format(results.weekly)}</div>
              </div>
          </div>
          <div className="w-full h-[240px] bg-white/5 p-4 rounded-2xl border border-white/10" dir="ltr">
            <Bar data={deferredChartData} options={chartOptions} />
          </div>
        </div>
        
        {/* Cross-Sell Box */}
        <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 shadow-sm">
          <h3 className="font-bold text-blue-900 text-lg mb-2">
            {lang === 'he' ? 'קונים דירה בקרוב?' : 'Buying a home soon?'}
          </h3>
          <p className="text-blue-800/80 text-sm mb-4">
            {lang === 'he' 
              ? 'בדקו איזה תקציב דירה מתאים לשכר שלכם, עם מחשבון המשכנתא שלנו.'
              : 'See how much house you can afford based on your salary with our Mortgage Calculator.'}
          </p>
          <Link 
            to={`/${lang}/calculators/mortgage-affordability?income=${results.monthly}`}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-xl transition-colors text-sm"
          >
            {lang === 'he' ? 'למחשבון המשכנתא' : 'To Mortgage Calculator'}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={lang === 'he' ? 'rotate-180' : ''}><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </Link>
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
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-bold">1</span>
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

      <RelatedCalculators currentId="salary" />
    </div>
  );
}
