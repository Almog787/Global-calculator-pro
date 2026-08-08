import { useState, useDeferredValue, useEffect, useMemo } from 'react';
import SEO from '../components/SEO';
import Decimal from 'decimal.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useI18n } from '../contexts/i18n';
import Breadcrumbs from '../components/Breadcrumbs';
import RelatedCalculators from '../components/RelatedCalculators';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function CompoundInterest() {
  const { t, lang } = useI18n();
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(10);
  const [contribution, setContribution] = useState(500);

  const { futureValue, totalContributions, totalInterest } = useMemo(() => {
    try {
      const decP = new Decimal(principal || 0);
      const decRate = new Decimal(rate || 0).div(100).div(12);
      const decN = new Decimal(years || 0).mul(12);
      const decContr = new Decimal(contribution || 0);

      let fv;

      if (decRate.isZero()) {
        fv = decP.add(decContr.mul(decN));
      } else {
        const rateFactor = decRate.add(1).pow(decN.toNumber());
        const pGrowth = decP.mul(rateFactor);
        const cGrowth = decContr.mul(rateFactor.sub(1)).div(decRate);
        fv = pGrowth.add(cGrowth);
      }

      const tc = decP.add(decContr.mul(decN));
      const ti = fv.sub(tc);

      return {
        futureValue: fv.isFinite() ? fv.toNumber() : 0,
        totalContributions: tc.isFinite() ? tc.toNumber() : 0,
        totalInterest: ti.isFinite() ? ti.toNumber() : 0
      };
    } catch {
      return { futureValue: 0, totalContributions: 0, totalInterest: 0 };
    }
  }, [principal, rate, years, contribution]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'calculate', {
          event_category: 'Compound Interest',
          principal,
          rate,
          years,
          contribution
        });
      }
    }, 2000);
    return () => clearTimeout(handler);
  }, [principal, rate, years, contribution]);

  const defaultCurrency = lang === 'he' ? 'ILS' : lang === 'fr' || lang === 'es' ? 'EUR' : 'USD';
  const currencyFormat = new Intl.NumberFormat(lang === 'en' ? 'en-US' : lang, { style: 'currency', currency: defaultCurrency, minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const compactCurrencyFormat = new Intl.NumberFormat(lang === 'en' ? 'en-US' : lang, { style: 'currency', currency: defaultCurrency, notation: 'compact', compactDisplay: 'short', minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const chartData = useMemo(() => {
    const labels: string[] = [];
    const contribData: number[] = [];
    const interestData: number[] = [];

    const decP = new Decimal(principal || 0);
    const decRate = new Decimal(rate || 0).div(100).div(12);
    const decContr = new Decimal(contribution || 0);

    for (let i = 0; i <= years; i++) {
      labels.push(i === 0 ? '0' : `${i}Y`);
      const n = i * 12;
      let fv;

      if (decRate.isZero()) {
        fv = decP.add(decContr.mul(n));
      } else {
        const rateFactor = decRate.add(1).pow(n);
        const pGrowth = decP.mul(rateFactor);
        const cGrowth = decContr.mul(rateFactor.sub(1)).div(decRate);
        fv = pGrowth.add(cGrowth);
      }

      const tc = decP.add(decContr.mul(n));
      const ti = fv.sub(tc);

      contribData.push(Math.round(tc.toNumber()));
      interestData.push(Math.round(ti.toNumber()));
    }

    return {
      labels,
      datasets: [
        {
          label: t.totalContributions,
          data: contribData,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.15)',
          fill: true,
          tension: 0.3,
        },
        {
          label: t.totalInterestEarned,
          data: interestData,
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.15)',
          fill: true,
          tension: 0.3,
        },
      ],
    };
  }, [principal, rate, years, contribution, t.totalContributions, t.totalInterestEarned]);

  const chartOptions = {
    animation: false as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${currencyFormat.format(context.raw || 0)}`,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (val: any) => compactCurrencyFormat.format(val),
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
      <Breadcrumbs items={[{ label: t.catAll || 'Library', path: `/${lang}/all` }, { label: t.compoundTitle }]} />
      <article className="w-full h-full flex flex-col lg:flex-row bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-stone-200 gap-10">
      <SEO
        title={t.compoundTitle}
        description={t.compoundDesc}
        canonicalUrl={`/${lang}/compound-interest`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: t.compoundTitle,
          description: t.compoundDesc,
          applicationCategory: 'CalculatorApplication',
          operatingSystem: 'Any',
          url: `https://globalcalcpro.com/${lang}/compound-interest`
        }}
      />
      
      <div className="flex-1 flex flex-col">
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-headline text-stone-900 tracking-tight mb-3">{t.compoundTitle}</h2>
          <p className="text-stone-500 font-medium text-[15px] leading-relaxed max-w-sm">{t.compoundExplanation}</p>
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-8">
            <div>
              <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.initialInvestment}</label>
              <input type="number" value={principal} onChange={e => setPrincipal(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl md:text-3xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
            </div>
            <div>
              <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.monthlyContribution}</label>
              <input type="number" value={contribution} onChange={e => setContribution(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl md:text-3xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
            </div>
            <div>
              <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.interestRate}</label>
              <input type="number" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl md:text-3xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
            </div>
            <div>
              <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.yearsToGrow}</label>
              <input type="number" value={years} onChange={e => setYears(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl md:text-3xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-stone-200">
            <div className="mb-6">
              <span className="text-xs tracking-wider uppercase font-bold text-stone-600 block mb-2">{t.futureValue}</span>
              <div className="text-4xl md:text-5xl font-headline font-bold text-stone-900 tracking-tight" dir="ltr">{currencyFormat.format(futureValue)}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs tracking-wider uppercase font-bold text-stone-600 block mb-1">{t.totalContributions}</span>
                <div className="text-lg md:text-xl font-headline text-stone-600" dir="ltr">{currencyFormat.format(totalContributions)}</div>
              </div>
              <div>
                <span className="text-xs tracking-wider uppercase font-bold text-stone-600 block mb-1">{t.totalInterestEarned}</span>
                <div className="text-lg md:text-xl font-headline text-stone-600" dir="ltr">+{currencyFormat.format(totalInterest)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-[1.5] flex flex-col justify-center items-center border-t lg:border-t-0 lg:border-l lg:rtl:border-r lg:rtl:border-l-0 border-stone-200 pt-10 lg:pt-0 lg:pl-10 lg:rtl:pr-10 lg:rtl:pl-0">
        <div className="w-full h-[360px]" dir="ltr">
          <Line data={deferredChartData} options={chartOptions} />
        </div>
      </div>
    </article>
      <RelatedCalculators currentId="compound" />
    </div>
  );
}
