import { useState, useDeferredValue, useEffect } from 'react';
import SEO from '../../components/SEO';
import Decimal from 'decimal.js';
import { Bar } from 'react-chartjs-2';
import { useI18n } from '../../contexts/i18n';

const localDict = {
  en: {
    title: 'ROI Calculator',
    description: 'Calculate Return on Investment (ROI) and annualized ROI for your investments.',
    amountInvested: 'Amount Invested',
    amountReturned: 'Amount Returned',
    investmentLength: 'Investment Length (Years)',
    roi: 'ROI (%)',
    investmentGain: 'Investment Gain',
    annualizedRoi: 'Annualized ROI (%)',
  },
  he: {
    title: 'מחשבון החזר השקעה (ROI)',
    description: 'חשב את החזר ההשקעה והתשואה השנתית עבור ההשקעות שלך.',
    amountInvested: 'סכום שהושקע',
    amountReturned: 'סכום שהוחזר',
    investmentLength: 'תקופת השקעה (בשנים)',
    roi: 'החזר השקעה (%)',
    investmentGain: 'רווח מהשקעה',
    annualizedRoi: 'תשואה שנתית (%)',
  },
  es: {
    title: 'Calculadora de ROI',
    description: 'Calcula el Retorno de Inversión (ROI) y el ROI anualizado para tus inversiones.',
    amountInvested: 'Cantidad Invertida',
    amountReturned: 'Cantidad Devuelta',
    investmentLength: 'Duración (Años)',
    roi: 'ROI (%)',
    investmentGain: 'Ganancia',
    annualizedRoi: 'ROI Anualizado (%)',
  },
  fr: {
    title: 'Calculatrice de ROI',
    description: 'Calculez le retour sur investissement (ROI) et le ROI annualisé pour vos investissements.',
    amountInvested: 'Montant Investi',
    amountReturned: 'Montant Retourné',
    investmentLength: 'Durée (Années)',
    roi: 'ROI (%)',
    investmentGain: 'Gain',
    annualizedRoi: 'ROI Annualisé (%)',
  },
  ar: {
    title: 'حاسبة العائد على الاستثمار',
    description: 'احسب العائد على الاستثمار (ROI) والعائد السنوي لاستثماراتك.',
    amountInvested: 'المبلغ المستثمر',
    amountReturned: 'المبلغ العائد',
    investmentLength: 'مدة الاستثمار (بالسنوات)',
    roi: 'العائد (%)',
    investmentGain: 'ربح الاستثمار',
    annualizedRoi: 'العائد السنوي (%)',
  }
};

export default function Roi() {
  const { lang, t: globalT } = useI18n();
  const t = localDict[lang as keyof typeof localDict] || localDict.en;

  const [invested, setInvested] = useState(10000);
  const [returned, setReturned] = useState(15000);
  const [years, setYears] = useState(5);

  const [results, setResults] = useState({
    gain: 0,
    roi: 0,
    annualizedRoi: 0,
  });

  useEffect(() => {
    try {
      const decInvested = new Decimal(invested || 0);
      const decReturned = new Decimal(returned || 0);
      const decYears = new Decimal(years || 1);

      const gain = decReturned.sub(decInvested);
      let roi = new Decimal(0);
      if (!decInvested.isZero()) {
        roi = gain.div(decInvested).mul(100);
      }

      let annRoi = new Decimal(0);
      if (!decInvested.isZero() && !decYears.isZero()) {
        const ratio = decReturned.div(decInvested).toNumber();
        const exponent = 1 / decYears.toNumber();
        annRoi = new Decimal(Math.pow(ratio, exponent) - 1).mul(100);
      }

      setResults({
        gain: gain.isFinite() ? gain.toNumber() : 0,
        roi: roi.isFinite() ? roi.toNumber() : 0,
        annualizedRoi: annRoi.isFinite() ? annRoi.toNumber() : 0,
      });
    } catch {
      setResults({ gain: 0, roi: 0, annualizedRoi: 0 });
    }
  }, [invested, returned, years]);

  const defaultCurrency = lang === 'he' ? 'ILS' : 'USD';
  const currencyFormat = new Intl.NumberFormat(lang === 'en' ? 'en-US' : lang, { 
    style: 'currency', currency: defaultCurrency, minimumFractionDigits: 0, maximumFractionDigits: 2 
  });
  const percentFormat = new Intl.NumberFormat(lang === 'en' ? 'en-US' : lang, { 
    style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 
  });

  const chartData = {
    labels: [t.amountInvested, t.amountReturned],
    datasets: [
      {
        label: 'Amount',
        data: [invested, returned],
        backgroundColor: ['#64748b', '#10b981'],
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    animation: false as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
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
        grid: { color: '#f3f4f6' },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  const deferredChartData = useDeferredValue(chartData);

  return (
    <article className="w-full h-full flex flex-col lg:flex-row bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-stone-200 gap-10">
      <SEO
        title={t.title}
        description={t.description}
        canonicalUrl="/calculators/roi"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: t.title,
          description: t.description,
          applicationCategory: 'CalculatorApplication',
          operatingSystem: 'Any',
          url: `https://globalcalcpro.com${"/calculators/roi"}`
        }}
      />

      <div className="flex-[1.5] flex flex-col">
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-headline text-stone-900 tracking-tight mb-3">{t.title}</h1>
          <p className="text-stone-500 font-medium text-[15px] leading-relaxed max-w-md">{t.description}</p>
        </div>

        <div className="space-y-8">
          <div>
            <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.amountInvested}</label>
            <input type="number" value={invested} onChange={e => setInvested(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
          </div>
          <div>
            <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.amountReturned}</label>
            <input type="number" value={returned} onChange={e => setReturned(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
          </div>
          <div>
            <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.investmentLength}</label>
            <input type="number" value={years} onChange={e => setYears(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-200">
          <div className="grid grid-cols-2 gap-x-4 gap-y-8">
            <div>
              <span className="text-xs tracking-wider uppercase font-bold text-stone-600 block mb-1">{t.investmentGain}</span>
              <div className="text-2xl md:text-3xl font-headline text-stone-900" dir="ltr">{currencyFormat.format(results.gain)}</div>
            </div>
            <div>
              <span className="text-xs tracking-wider uppercase font-bold text-stone-600 block mb-1">{t.roi}</span>
              <div className="text-2xl md:text-3xl font-headline text-blue-600" dir="ltr">{percentFormat.format(results.roi)}%</div>
            </div>
            <div>
              <span className="text-xs tracking-wider uppercase font-bold text-stone-600 block mb-1">{t.annualizedRoi}</span>
              <div className="text-xl md:text-2xl font-headline text-stone-900" dir="ltr">{percentFormat.format(results.annualizedRoi)}%</div>
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
  );
}
