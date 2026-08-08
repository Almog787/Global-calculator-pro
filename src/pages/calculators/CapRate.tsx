import { useState, useDeferredValue, useEffect } from 'react';
import SEO from '../../components/SEO';
import Decimal from 'decimal.js';
import { Doughnut } from 'react-chartjs-2';
import { useI18n } from '../../contexts/i18n';

const localDict = {
  en: {
    title: 'Cap Rate Calculator',
    description: 'Calculate the Capitalization Rate and Net Operating Income (NOI) for real estate investments.',
    propertyValue: 'Property Value',
    grossIncome: 'Gross Annual Income',
    operatingExpenses: 'Annual Operating Expenses',
    noi: 'Net Operating Income (NOI)',
    capRate: 'Cap Rate (%)',
  },
  he: {
    title: 'מחשבון שיעור תיוון (Cap Rate)',
    description: 'חשב את שיעור התשואה נטו (Cap Rate) והכנסה תפעולית נטו (NOI) להשקעות נדל"ן.',
    propertyValue: 'שווי הנכס',
    grossIncome: 'הכנסה שנתית גולמית',
    operatingExpenses: 'הוצאות תפעול שנתיות',
    noi: 'הכנסה תפעולית נטו (NOI)',
    capRate: 'שיעור תשואה (%)',
  },
  es: {
    title: 'Calculadora de Cap Rate',
    description: 'Calcula la Tasa de Capitalización y el Ingreso Operativo Neto (NOI) para inversiones inmobiliarias.',
    propertyValue: 'Valor de la Propiedad',
    grossIncome: 'Ingreso Anual Bruto',
    operatingExpenses: 'Gastos Operativos Anuales',
    noi: 'Ingreso Operativo Neto (NOI)',
    capRate: 'Cap Rate (%)',
  },
  fr: {
    title: 'Calculatrice de Taux de Capitalisation',
    description: 'Calculez le taux de capitalisation et le revenu net d\'exploitation (NOI) pour les investissements immobiliers.',
    propertyValue: 'Valeur du Bien',
    grossIncome: 'Revenu Annuel Brut',
    operatingExpenses: 'Dépenses d\'Exploitation Annuelles',
    noi: 'Revenu Net d\'Exploitation (NOI)',
    capRate: 'Taux de Capitalisation (%)',
  },
  ar: {
    title: 'حاسبة معدل الرأسمالية (Cap Rate)',
    description: 'احسب معدل الرأسمالية وصافي الدخل التشغيلي (NOI) للاستثمارات العقارية.',
    propertyValue: 'قيمة العقار',
    grossIncome: 'الدخل السنوي الإجمالي',
    operatingExpenses: 'المصروفات التشغيلية السنوية',
    noi: 'صافي الدخل التشغيلي (NOI)',
    capRate: 'معدل الرأسمالية (%)',
  }
};

export default function CapRate() {
  const { lang, t: globalT } = useI18n();
  const t = localDict[lang as keyof typeof localDict] || localDict.en;

  const [propertyValue, setPropertyValue] = useState(500000);
  const [grossIncome, setGrossIncome] = useState(60000);
  const [operatingExpenses, setOperatingExpenses] = useState(15000);

  const [results, setResults] = useState({ noi: 0, capRate: 0 });

  useEffect(() => {
    try {
      const decVal = new Decimal(propertyValue || 0);
      const decInc = new Decimal(grossIncome || 0);
      const decExp = new Decimal(operatingExpenses || 0);

      const noi = decInc.sub(decExp);
      let cap = new Decimal(0);
      
      if (!decVal.isZero()) {
        cap = noi.div(decVal).mul(100);
      }

      setResults({
        noi: noi.toNumber(),
        capRate: cap.toNumber()
      });
    } catch {
      setResults({ noi: 0, capRate: 0 });
    }
  }, [propertyValue, grossIncome, operatingExpenses]);

  const defaultCurrency = lang === 'he' ? 'ILS' : 'USD';
  const currencyFormat = new Intl.NumberFormat(lang === 'en' ? 'en-US' : lang, { 
    style: 'currency', currency: defaultCurrency, minimumFractionDigits: 0, maximumFractionDigits: 0 
  });
  const percentFormat = new Intl.NumberFormat(lang === 'en' ? 'en-US' : lang, { 
    style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 
  });

  const chartData = {
    labels: [t.noi, t.operatingExpenses],
    datasets: [{
      data: [Math.max(0, results.noi), operatingExpenses],
      backgroundColor: ['#10b981', '#ef4444'],
      borderWidth: 0,
    }],
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
        }
      }
    },
    cutout: '70%',
  };

  const deferredChartData = useDeferredValue(chartData);

  return (
    <article className="w-full h-full flex flex-col lg:flex-row bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-stone-200 gap-10">
      <SEO
        title={t.title}
        description={t.description}
        canonicalUrl="/calculators/cap-rate"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: t.title,
          description: t.description,
          applicationCategory: 'CalculatorApplication',
          operatingSystem: 'Any',
          url: `https://globalcalcpro.com${"/calculators/cap-rate"}`
        }}
      />

      <div className="flex-[1.5] flex flex-col">
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-headline text-stone-900 tracking-tight mb-3">{t.title}</h1>
          <p className="text-stone-500 font-medium text-[15px] leading-relaxed max-w-md">{t.description}</p>
        </div>

        <div className="space-y-8">
          <div>
            <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.propertyValue}</label>
            <input type="number" value={propertyValue} onChange={e => setPropertyValue(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
          </div>
          <div>
            <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.grossIncome}</label>
            <input type="number" value={grossIncome} onChange={e => setGrossIncome(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
          </div>
          <div>
            <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.operatingExpenses}</label>
            <input type="number" value={operatingExpenses} onChange={e => setOperatingExpenses(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-200">
          <div className="grid grid-cols-2 gap-x-4 gap-y-8">
            <div>
              <span className="text-xs tracking-wider uppercase font-bold text-stone-600 block mb-1">{t.capRate}</span>
              <div className="text-3xl md:text-4xl font-headline text-blue-600" dir="ltr">{percentFormat.format(results.capRate)}%</div>
            </div>
            <div>
              <span className="text-xs tracking-wider uppercase font-bold text-stone-600 block mb-1">{t.noi}</span>
              <div className="text-xl md:text-2xl font-headline text-stone-900" dir="ltr">{currencyFormat.format(results.noi)}</div>
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
