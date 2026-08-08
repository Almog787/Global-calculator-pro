import { useState, useDeferredValue, useEffect } from 'react';
import SEO from '../../components/SEO';
import Decimal from 'decimal.js';
import { Doughnut } from 'react-chartjs-2';
import { useI18n } from '../../contexts/i18n';

const localDict = {
  en: {
    title: 'Freelance Net Income Calculator',
    description: 'Calculate your actual take-home pay after business expenses and estimated taxes.',
    grossIncome: 'Annual Gross Income',
    expenses: 'Annual Business Expenses',
    incomeTaxRate: 'Income Tax Rate (%)',
    selfEmploymentTax: 'Self-Employment / Social Tax (%)',
    netIncome: 'Net Take-Home Pay',
    totalTaxes: 'Total Taxes',
    totalExpenses: 'Total Expenses',
  },
  he: {
    title: 'מחשבון הכנסה נטו לפרילנסרים',
    description: 'חשב את ההכנסה נטו שלך (Take-home pay) לאחר ניכוי הוצאות מוכרות, מס הכנסה וביטוח לאומי.',
    grossIncome: 'הכנסה שנתית ברוטו',
    expenses: 'הוצאות עסקיות מוכרות',
    incomeTaxRate: 'מדרגת מס הכנסה ממוצעת (%)',
    selfEmploymentTax: 'ביטוח לאומי / מס בריאות (%)',
    netIncome: 'הכנסה נטו',
    totalTaxes: 'סך מיסים',
    totalExpenses: 'סך הוצאות',
  },
  es: {
    title: 'Calculadora de Ingreso Neto Freelance',
    description: 'Calcula tu ingreso neto real después de gastos comerciales e impuestos estimados.',
    grossIncome: 'Ingreso Anual Bruto',
    expenses: 'Gastos Comerciales Anuales',
    incomeTaxRate: 'Tasa de Impuesto sobre la Renta (%)',
    selfEmploymentTax: 'Impuesto de Trabajo Autónomo (%)',
    netIncome: 'Ingreso Neto Limpio',
    totalTaxes: 'Total de Impuestos',
    totalExpenses: 'Total de Gastos',
  },
  fr: {
    title: 'Calculatrice de Revenu Net Freelance',
    description: 'Calculez votre revenu net réel après déduction des charges et des impôts.',
    grossIncome: 'Revenu Annuel Brut',
    expenses: 'Dépenses Professionnelles',
    incomeTaxRate: 'Taux d\'Impôt sur le Revenu (%)',
    selfEmploymentTax: 'Cotisations Sociales (%)',
    netIncome: 'Revenu Net Disponible',
    totalTaxes: 'Total des Impôts',
    totalExpenses: 'Total des Charges',
  },
  ar: {
    title: 'حاسبة صافي الدخل للمستقلين',
    description: 'احسب دخلك الصافي الفعلي بعد خصم النفقات المهنية والضرائب المقدرة.',
    grossIncome: 'الدخل السنوي الإجمالي',
    expenses: 'النفقات المهنية السنوية',
    incomeTaxRate: 'نسبة ضريبة الدخل (%)',
    selfEmploymentTax: 'الضمان الاجتماعي / العمل الحر (%)',
    netIncome: 'صافي الدخل الصافي',
    totalTaxes: 'إجمالي الضرائب',
    totalExpenses: 'إجمالي النفقات',
  }
};

export default function FreelanceNetIncome() {
  const { lang, t: globalT } = useI18n();
  const t = localDict[lang as keyof typeof localDict] || localDict.en;

  const [gross, setGross] = useState(120000);
  const [expenses, setExpenses] = useState(20000);
  const [incomeTax, setIncomeTax] = useState(15);
  const [seTax, setSeTax] = useState(12);

  const [results, setResults] = useState({ net: 0, taxes: 0, taxableIncome: 0 });

  useEffect(() => {
    try {
      const decGross = new Decimal(gross || 0);
      const decExp = new Decimal(expenses || 0);
      const decIncTax = new Decimal(incomeTax || 0).div(100);
      const decSeTax = new Decimal(seTax || 0).div(100);

      let taxable = decGross.sub(decExp);
      if (taxable.isNegative()) taxable = new Decimal(0);

      const taxes = taxable.mul(decIncTax.add(decSeTax));
      let net = taxable.sub(taxes);
      if (net.isNegative()) net = new Decimal(0);

      setResults({
        net: net.toNumber(),
        taxes: taxes.toNumber(),
        taxableIncome: taxable.toNumber()
      });
    } catch {
      setResults({ net: 0, taxes: 0, taxableIncome: 0 });
    }
  }, [gross, expenses, incomeTax, seTax]);

  const defaultCurrency = lang === 'he' ? 'ILS' : 'USD';
  const currencyFormat = new Intl.NumberFormat(lang === 'en' ? 'en-US' : lang, { 
    style: 'currency', currency: defaultCurrency, minimumFractionDigits: 0, maximumFractionDigits: 0 
  });

  const chartData = {
    labels: [t.netIncome, t.totalTaxes, t.totalExpenses],
    datasets: [{
      data: [results.net, results.taxes, expenses],
      backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
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
        canonicalUrl="/calculators/freelance-net-income"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: t.title,
          description: t.description,
          applicationCategory: 'CalculatorApplication',
          operatingSystem: 'Any',
          url: `https://globalcalcpro.com${"/calculators/freelance-net-income"}`
        }}
      />

      <div className="flex-[1.5] flex flex-col">
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-headline text-stone-900 tracking-tight mb-3">{t.title}</h1>
          <p className="text-stone-500 font-medium text-[15px] leading-relaxed max-w-md">{t.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.grossIncome}</label>
            <input type="number" value={gross} onChange={e => setGross(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
          </div>
          <div>
            <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.expenses}</label>
            <input type="number" value={expenses} onChange={e => setExpenses(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
          </div>
          <div>
            <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.incomeTaxRate}</label>
            <input type="number" value={incomeTax} onChange={e => setIncomeTax(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
          </div>
          <div>
            <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.selfEmploymentTax}</label>
            <input type="number" value={seTax} onChange={e => setSeTax(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-200">
          <div className="grid grid-cols-2 gap-x-4 gap-y-8">
            <div>
              <span className="text-xs tracking-wider uppercase font-bold text-stone-600 block mb-1">{t.netIncome}</span>
              <div className="text-3xl md:text-4xl font-headline text-blue-600" dir="ltr">{currencyFormat.format(results.net)}</div>
            </div>
            <div>
              <span className="text-xs tracking-wider uppercase font-bold text-stone-600 block mb-1">{t.totalTaxes}</span>
              <div className="text-xl md:text-2xl font-headline text-stone-900" dir="ltr">{currencyFormat.format(results.taxes)}</div>
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
