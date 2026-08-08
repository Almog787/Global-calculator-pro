import { useState, useDeferredValue, useEffect } from 'react';
import SEO from '../../components/SEO';
import Decimal from 'decimal.js';
import { Doughnut } from 'react-chartjs-2';
import { useI18n } from '../../contexts/i18n';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// Localized dictionary for true independence
const localDict = {
  en: {
    title: 'Auto Loan Calculator',
    description: 'Calculate your monthly car loan payment, total interest, and total cost precisely.',
    vehiclePrice: 'Vehicle Price',
    downPayment: 'Down Payment',
    interestRate: 'Interest Rate (%)',
    loanTerm: 'Loan Term (Months)',
    monthlyPayment: 'Monthly Payment',
    totalInterest: 'Total Interest',
    principal: 'Principal',
  },
  he: {
    title: 'מחשבון הלוואת רכב',
    description: 'חשב את התשלום החודשי, סך הריבית, והעלות הכוללת של הלוואת הרכב שלך בדיוק מירבי.',
    vehiclePrice: 'מחיר הרכב',
    downPayment: 'מקדמה',
    interestRate: 'ריבית שנתית (%)',
    loanTerm: 'תקופת הלוואה (בחודשים)',
    monthlyPayment: 'תשלום חודשי',
    totalInterest: 'סך ריבית',
    principal: 'קרן',
  },
  es: {
    title: 'Calculadora de Préstamo de Auto',
    description: 'Calcula tu pago mensual, interés total y costo total con precisión.',
    vehiclePrice: 'Precio del Vehículo',
    downPayment: 'Pago Inicial',
    interestRate: 'Tasa de Interés (%)',
    loanTerm: 'Plazo (Meses)',
    monthlyPayment: 'Pago Mensual',
    totalInterest: 'Interés Total',
    principal: 'Capital',
  },
  fr: {
    title: 'Calculatrice de Prêt Auto',
    description: 'Calculez précisément votre paiement mensuel, l\'intérêt total et le coût total.',
    vehiclePrice: 'Prix du Véhicule',
    downPayment: 'Acompte',
    interestRate: 'Taux d\'Intérêt (%)',
    loanTerm: 'Durée (Mois)',
    monthlyPayment: 'Paiement Mensuel',
    totalInterest: 'Intérêt Total',
    principal: 'Capital',
  },
  ar: {
    title: 'حاسبة قروض السيارات',
    description: 'احسب الدفعة الشهرية وإجمالي الفائدة والتكلفة الإجمالية بدقة.',
    vehiclePrice: 'سعر السيارة',
    downPayment: 'الدفعة الأولى',
    interestRate: 'معدل الفائدة (%)',
    loanTerm: 'مدة القرض (بالأشهر)',
    monthlyPayment: 'الدفعة الشهرية',
    totalInterest: 'إجمالي الفائدة',
    principal: 'رأس المال',
  }
};

export default function AutoLoan() {
  const { lang, t: globalT } = useI18n();
  // Fallback to English if language not supported in local dictionary
  const t = localDict[lang as keyof typeof localDict] || localDict.en;

  const [price, setPrice] = useState(30000);
  const [downPayment, setDownPayment] = useState(5000);
  const [rate, setRate] = useState(5);
  const [term, setTerm] = useState(60);

  const [results, setResults] = useState({
    monthlyPayment: 0,
    totalInterest: 0,
    totalCost: 0,
    principal: 0,
  });

  useEffect(() => {
    try {
      const decPrice = new Decimal(price || 0);
      const decDown = new Decimal(downPayment || 0);
      let principalAmt = decPrice.sub(decDown);
      if (principalAmt.isNegative()) principalAmt = new Decimal(0);

      const decRate = new Decimal(rate || 0).div(100).div(12);
      const decTerm = new Decimal(term || 1); // Avoid div by zero

      let mp = new Decimal(0);
      if (principalAmt.isZero()) {
        mp = new Decimal(0);
      } else if (decRate.isZero()) {
        mp = principalAmt.div(decTerm);
      } else {
        const rateFactor = decRate.add(1).pow(decTerm.toNumber());
        mp = principalAmt.mul(decRate.mul(rateFactor)).div(rateFactor.sub(1));
      }

      const totalPaid = mp.mul(decTerm);
      const totalInterest = totalPaid.sub(principalAmt);

      setResults({
        monthlyPayment: mp.isFinite() ? mp.toNumber() : 0,
        totalInterest: totalInterest.isFinite() ? totalInterest.toNumber() : 0,
        totalCost: decDown.add(totalPaid).toNumber(),
        principal: principalAmt.toNumber(),
      });
    } catch {
      setResults({ monthlyPayment: 0, totalInterest: 0, totalCost: 0, principal: 0 });
    }
  }, [price, downPayment, rate, term]);

  const defaultCurrency = lang === 'he' ? 'ILS' : 'USD';
  const currencyFormat = new Intl.NumberFormat(lang === 'en' ? 'en-US' : lang, { 
    style: 'currency', currency: defaultCurrency, minimumFractionDigits: 0, maximumFractionDigits: 2 
  });

  const chartData = {
    labels: [t.principal, t.totalInterest],
    datasets: [
      {
        data: [results.principal, results.totalInterest],
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
        canonicalUrl="/calculators/auto-loan"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: t.title,
          description: t.description,
          applicationCategory: 'CalculatorApplication',
          operatingSystem: 'Any',
          url: `https://globalcalcpro.com${"/calculators/auto-loan"}`
        }}
      />

      <div className="flex-[1.5] flex flex-col">
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-headline text-stone-900 tracking-tight mb-3">{t.title}</h1>
          <p className="text-stone-500 font-medium text-[15px] leading-relaxed max-w-md">{t.description}</p>
        </div>

        <div className="space-y-8">
          <div>
            <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.vehiclePrice}</label>
            <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
          </div>
          <div>
            <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.downPayment}</label>
            <input type="number" value={downPayment} onChange={e => setDownPayment(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
          </div>
          <div>
            <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.interestRate}</label>
            <input type="number" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
          </div>
          <div>
            <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.loanTerm}</label>
            <input type="number" value={term} onChange={e => setTerm(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-200">
          <div className="grid grid-cols-2 gap-x-4 gap-y-8">
            <div>
              <span className="text-xs tracking-wider uppercase font-bold text-stone-600 block mb-1">{t.monthlyPayment}</span>
              <div className="text-2xl md:text-3xl font-headline text-blue-600" dir="ltr">{currencyFormat.format(results.monthlyPayment)}</div>
            </div>
            <div>
              <span className="text-xs tracking-wider uppercase font-bold text-stone-600 block mb-1">{t.totalInterest}</span>
              <div className="text-xl md:text-2xl font-headline text-stone-900" dir="ltr">{currencyFormat.format(results.totalInterest)}</div>
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
