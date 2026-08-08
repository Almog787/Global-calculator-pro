import { useState, useDeferredValue, useEffect } from 'react';
import SEO from '../../components/SEO';
import Decimal from 'decimal.js';
import { Doughnut } from 'react-chartjs-2';
import { useI18n } from '../../contexts/i18n';

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
  const { lang, t: globalT } = useI18n();
  const t = localDict[lang as keyof typeof localDict] || localDict.en;

  const [cost, setCost] = useState(50);
  const [revenue, setRevenue] = useState(120);

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
    <article className="w-full h-full flex flex-col lg:flex-row bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-stone-200 gap-10">
      <SEO
        title={t.title}
        description={t.description}
        canonicalUrl="/calculators/margin"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: t.title,
          description: t.description,
          applicationCategory: 'CalculatorApplication',
          operatingSystem: 'Any',
          url: `https://globalcalcpro.com${"/calculators/margin"}`
        }}
      />

      <div className="flex-[1.5] flex flex-col">
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-headline text-stone-900 tracking-tight mb-3">{t.title}</h1>
          <p className="text-stone-500 font-medium text-[15px] leading-relaxed max-w-md">{t.description}</p>
        </div>

        <div className="space-y-8">
          <div>
            <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.cost}</label>
            <input type="number" value={cost} onChange={e => setCost(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
          </div>
          <div>
            <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.revenue}</label>
            <input type="number" value={revenue} onChange={e => setRevenue(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-200">
          <div className="grid grid-cols-2 gap-x-4 gap-y-8">
            <div>
              <span className="text-xs tracking-wider uppercase font-bold text-stone-600 block mb-1">{t.margin}</span>
              <div className="text-2xl md:text-3xl font-headline text-blue-600" dir="ltr">{percentFormat.format(results.margin)}%</div>
            </div>
            <div>
              <span className="text-xs tracking-wider uppercase font-bold text-stone-600 block mb-1">{t.markup}</span>
              <div className="text-xl md:text-2xl font-headline text-stone-900" dir="ltr">{percentFormat.format(results.markup)}%</div>
            </div>
            <div>
              <span className="text-xs tracking-wider uppercase font-bold text-stone-600 block mb-1">{t.grossProfit}</span>
              <div className="text-xl md:text-2xl font-headline text-stone-900" dir="ltr">{currencyFormat.format(results.grossProfit)}</div>
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
  );
}
