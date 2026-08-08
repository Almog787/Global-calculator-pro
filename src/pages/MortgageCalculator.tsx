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

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

export default function MortgageCalculator() {
  const { t, lang } = useI18n();
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
      <article className="w-full h-full flex flex-col lg:flex-row bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-stone-200 gap-10">
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
      
      <div className="flex-1 flex flex-col">
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-headline text-stone-900 tracking-tight mb-3">{t.mortgageTitle}</h2>
          <p className="text-stone-500 font-medium text-[15px] leading-relaxed max-w-sm">{t.mortgageExplanation}</p>
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-8">
            <div>
              <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.loanAmount}</label>
              <input type="number" value={principal} onChange={e => setPrincipal(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl md:text-3xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
            </div>
            <div>
              <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.interestRate}</label>
              <input type="number" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl md:text-3xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
            </div>
            <div>
              <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.loanTerm}</label>
              <input type="number" value={years} onChange={e => setYears(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl md:text-3xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-stone-200">
            <div className="mb-6">
              <span className="text-xs tracking-wider uppercase font-bold text-stone-600 block mb-2">{t.monthlyPayment}</span>
              <div className="text-4xl md:text-5xl font-headline font-bold text-stone-900 tracking-tight" dir="ltr">{currencyFormat.format(monthlyPayment)}</div>
            </div>
            <div>
              <span className="text-xs tracking-wider uppercase font-bold text-stone-600 block mb-1">{t.totalInterest}</span>
              <div className="text-lg md:text-xl font-headline text-stone-600" dir="ltr">{currencyFormat.format(totalInterest)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center border-t lg:border-t-0 lg:border-l lg:rtl:border-r lg:rtl:border-l-0 border-stone-200 pt-10 lg:pt-0 lg:pl-10 lg:rtl:pr-10 lg:rtl:pl-0">
        <div className="w-full h-[320px]" dir="ltr">
          <Doughnut data={deferredChartData} options={chartOptions} />
        </div>
      </div>
    </article>
      
      <FAQ items={[
        {
          question: lang === 'he' ? 'מהו החזר חודשי?' : 'What is a monthly payment?',
          answer: lang === 'he' ? 'הסכום שתצטרך לשלם מדי חודש לבנק. הוא מורכב מקרן (הסכום שלווית) וריבית (העלות על ההלוואה).' : 'The amount you need to pay the bank each month. It consists of the principal (amount borrowed) and interest (cost of borrowing).'
        },
        {
          question: lang === 'he' ? 'איך הריבית משפיעה על המשכנתא?' : 'How does the interest rate affect the mortgage?',
          answer: lang === 'he' ? 'ככל שהריבית גבוהה יותר, תשלם יותר כסף לבנק לאורך חיי ההלוואה. הריבית נקבעת לפי סיכון הלווה ומדדי הכלכלה.' : 'The higher the interest rate, the more money you will pay the bank over the life of the loan. It is determined by borrower risk and economic indicators.'
        },
        {
          question: lang === 'he' ? 'האם כדאי לקחת משכנתא ל-30 שנה?' : 'Should I take a 30-year mortgage?',
          answer: lang === 'he' ? 'משכנתא ארוכה מקטינה את ההחזר החודשי אך מגדילה מאוד את סך הריבית שתשלם לבנק. מומלץ לקצר במידת האפשר.' : 'A longer mortgage reduces the monthly payment but significantly increases the total interest you will pay. It is recommended to shorten it if possible.'
        }
      ]} />
      
      <RelatedCalculators currentId="mortgage" />
    </div>
  );
}
