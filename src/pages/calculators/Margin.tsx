import { useDeferredValue, useEffect, useState } from 'react';
import { useUrlState } from '../../hooks/useUrlState';
import SEO from '../../components/SEO';
import FAQ from '../../components/FAQ';
import RelatedCalculators from '../../components/RelatedCalculators';
import Decimal from 'decimal.js';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useI18n } from '../../contexts/i18n';
import { getGuideData } from '../../data/guideTranslations';

ChartJS.register(ArcElement, Tooltip, Legend);

const localDict = {
  en: {
    title: 'Margin Calculator',
    description: 'Quickly calculate your gross profit and profit margin from cost and revenue.',
    cost: 'Cost of Goods Sold',
    revenue: 'Revenue / Sales Price',
    grossProfit: 'Gross Profit',
    margin: 'Profit Margin (%)',
    markup: 'Markup (%)',
  },
  he: {
    title: 'מחשבון שולי רווח (Margin)',
    description: 'חשב במהירות את הרווח הגולמי ואת שולי הרווח מתוך העלות וההכנסות.',
    cost: 'עלות המכר',
    revenue: 'הכנסות / מחיר מכירה',
    grossProfit: 'רווח גולמי',
    margin: 'שולי רווח (%)',
    markup: 'רווח עלות (Markup %)',
  },
  es: {
    title: 'Calculadora de Margen',
    description: 'Calcula rápidamente tu beneficio bruto y margen de beneficio a partir del costo y los ingresos.',
    cost: 'Costo',
    revenue: 'Ingresos / Precio de Venta',
    grossProfit: 'Beneficio Bruto',
    margin: 'Margen de Beneficio (%)',
    markup: 'Margen sobre Costo (%)',
  },
  fr: {
    title: 'Calculatrice de Marge',
    description: 'Calculez rapidement votre marge brute et votre bénéfice à partir du coût et des revenus.',
    cost: 'Coût',
    revenue: 'Revenus / Prix de Vente',
    grossProfit: 'Bénéfice Brut',
    margin: 'Marge de Bénéfice (%)',
    markup: 'Marge sur Coût (%)',
  },
  ar: {
    title: 'حاسبة هامش الربح',
    description: 'احسب إجمالي الربح وهامش الربح من التكلفة والإيرادات.',
    cost: 'التكلفة',
    revenue: 'الإيرادات / سعر البيع',
    grossProfit: 'إجمالي الربح',
    margin: 'هامش الربح (%)',
    markup: 'الزيادة على التكلفة (%)',
  }
};

export default function Margin() {
  const { lang } = useI18n();
  const guide = getGuideData('margin', lang);
  const t = localDict[lang as keyof typeof localDict] || localDict.en;

  const [cost, setCost] = useUrlState('cost', 50);
  const [revenue, setRevenue] = useUrlState('revenue', 120);

  const [results, setResults] = useState({
    grossProfit: 0,
    margin: 0,
    markup: 0,
  });

  useEffect(() => {
    try {
      const decCost = new Decimal(cost || 0);
      const decRevenue = new Decimal(revenue || 0);

      const profit = decRevenue.sub(decCost);
      
      let margin = new Decimal(0);
      if (!decRevenue.isZero()) {
        margin = profit.div(decRevenue).mul(100);
      }

      let markup = new Decimal(0);
      if (!decCost.isZero()) {
        markup = profit.div(decCost).mul(100);
      }

      setResults({
        grossProfit: profit.isFinite() ? profit.toNumber() : 0,
        margin: margin.isFinite() ? margin.toNumber() : 0,
        markup: markup.isFinite() ? markup.toNumber() : 0,
      });
    } catch {
      setResults({ grossProfit: 0, margin: 0, markup: 0 });
    }
  }, [cost, revenue]);

  const defaultCurrency = lang === 'he' ? 'ILS' : 'USD';
  const currencyFormat = new Intl.NumberFormat(lang === 'en' ? 'en-US' : lang, { 
    style: 'currency', currency: defaultCurrency, minimumFractionDigits: 0, maximumFractionDigits: 2 
  });
  const percentFormat = new Intl.NumberFormat(lang === 'en' ? 'en-US' : lang, { 
    style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 
  });

  const chartData = {
    labels: [t.cost, t.grossProfit],
    datasets: [
      {
        data: [cost, results.grossProfit > 0 ? results.grossProfit : 0],
        backgroundColor: ['#ef4444', '#10b981'],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    animation: false as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.label}: ${currencyFormat.format(context.raw || 0)}`,
        },
      },
    },
    cutout: '70%',
  };

  const deferredChartData = useDeferredValue(chartData);

  return (
    <div>
      <article className="w-full h-full flex flex-col lg:flex-row gap-8 items-start relative">
      {/* Input Form */}
      <div className="flex-[1.5] w-full bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-stone-200 flex flex-col">
      <SEO
        title={t.title}
        description={t.description}
        canonicalUrl={`/${lang}/calculators/margin`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: t.title,
          description: t.description,
          applicationCategory: 'CalculatorApplication',
          operatingSystem: 'Any',
          url: `https://globalcalcpro.com/${lang}/calculators/margin`
        }}
      />

      <div className="flex-[1.5] flex flex-col">
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight mb-3">{t.title}</h1>
          <p className="text-stone-500 font-medium text-[15px] leading-relaxed max-w-md">{t.description}</p>
        </div>

        <div className="space-y-8">
          <div className="group">
<label className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">{t.cost}</label>
            <input type="number" value={cost} onChange={e => setCost(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl md:text-3xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" />
          </div>
          <div className="group">
<label className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">{t.revenue}</label>
            <input type="number" value={revenue} onChange={e => setRevenue(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl md:text-3xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" />
          </div>
        </div></div>
      </div>
      {/* Sticky Results Dashboard */}
      <div className="flex-1 w-full lg:w-[420px] shrink-0 lg:sticky lg:top-24 bg-stone-900 rounded-3xl p-8 shadow-2xl border border-stone-800 text-white flex flex-col justify-between">

        <div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8">
            <div>
              <span className="text-xs tracking-wider uppercase font-bold text-stone-400 block mb-1">{t.margin}</span>
              <div className="text-2xl md:text-3xl font-headline text-blue-600" dir="ltr">{percentFormat.format(results.margin)}%</div>
            </div>
            <div>
              <span className="text-xs tracking-wider uppercase font-bold text-stone-400 block mb-1">{t.markup}</span>
              <div className="text-xl md:text-2xl font-black text-stone-900" dir="ltr">{percentFormat.format(results.markup)}%</div>
            </div>
            <div>
              <span className="text-xs tracking-wider uppercase font-bold text-stone-400 block mb-1">{t.grossProfit}</span>
              <div className="text-xl md:text-2xl font-black text-stone-900" dir="ltr">{currencyFormat.format(results.grossProfit)}</div>
            </div>
          </div>
        </div>
      
        <div className="w-full h-[240px] bg-white/5 p-4 rounded-2xl border border-white/10 mt-6" dir="ltr">
          <Doughnut data={deferredChartData} options={chartOptions} />
        </div>
      </div>
    </article>

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

      <RelatedCalculators currentId="margin" />
    </div>
  );
}
