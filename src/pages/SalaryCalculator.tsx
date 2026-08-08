import { useState, useDeferredValue, useEffect, useMemo } from 'react';
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
  const [amount, setAmount] = useState(50000);
  const [frequency, setFrequency] = useState('yearly');
  
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
      <article className="w-full h-full flex flex-col lg:flex-row bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-stone-200 gap-10">
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
      
      <div className="flex-1 flex flex-col">
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-headline text-stone-900 tracking-tight mb-3">{t.salaryTitle}</h2>
          <p className="text-stone-500 font-medium text-[15px] leading-relaxed max-w-sm">{t.salaryExplanation}</p>
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-8">
            <div>
              <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.salaryAmount}</label>
              <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl md:text-3xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
            </div>
            <div>
              <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.salaryFrequency}</label>
              <select value={frequency} onChange={e => setFrequency(e.target.value)} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl md:text-3xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors cursor-pointer">
                <option value="hourly">{t.hourly}</option>
                <option value="weekly">{t.weekly}</option>
                <option value="monthly">{t.monthly}</option>
                <option value="yearly">{t.yearly}</option>
              </select>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-stone-200">
            <div className="grid grid-cols-2 gap-x-4 gap-y-8">
              <div>
                <span className="text-xs tracking-wider uppercase font-bold text-stone-600 block mb-1">{t.hourly}</span>
                <div className="text-xl md:text-2xl font-headline text-stone-900" dir="ltr">{currencyFormat.format(results.hourly)}</div>
              </div>
              <div>
                <span className="text-xs tracking-wider uppercase font-bold text-stone-600 block mb-1">{t.weekly}</span>
                <div className="text-xl md:text-2xl font-headline text-stone-900" dir="ltr">{currencyFormat.format(results.weekly)}</div>
              </div>
              <div>
                <span className="text-xs tracking-wider uppercase font-bold text-stone-600 block mb-1">{t.monthly}</span>
                <div className="text-xl md:text-2xl font-headline text-stone-900" dir="ltr">{currencyFormat.format(results.monthly)}</div>
              </div>
              <div>
                <span className="text-xs tracking-wider uppercase font-bold text-stone-600 block mb-1">{t.yearly}</span>
                <div className="text-xl md:text-2xl font-headline text-stone-900" dir="ltr">{currencyFormat.format(results.yearly)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center border-t lg:border-t-0 lg:border-l lg:rtl:border-r lg:rtl:border-l-0 border-stone-200 pt-10 lg:pt-0 lg:pl-10 lg:rtl:pr-10 lg:rtl:pl-0">
        <div className="w-full h-[320px]" dir="ltr">
          <Bar data={deferredChartData} options={chartOptions} />
        </div>
      </div>
    </article>
      <RelatedCalculators currentId="salary" />
    </div>
  );
}
