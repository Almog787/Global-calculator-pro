import { useState, useDeferredValue, useEffect } from 'react';
import SEO from '../../components/SEO';
import { Doughnut } from 'react-chartjs-2';
import { useI18n } from '../../contexts/i18n';

const localDict = {
  en: {
    title: 'Debt Snowball Calculator',
    description: 'Calculate how fast you can become debt-free by paying extra toward your smallest debts first.',
    debt1: 'Debt 1 (Smallest)',
    debt2: 'Debt 2',
    debt3: 'Debt 3',
    balance: 'Balance',
    rate: 'Rate (%)',
    minPayment: 'Min Payment',
    extraPayment: 'Extra Monthly Payment',
    monthsSaved: 'Months Saved',
    interestSaved: 'Interest Saved',
    snowballPayoff: 'Snowball Payoff Time',
  },
  he: {
    title: 'מחשבון חיסול חובות כדור השלג',
    description: 'חשב מתי תהיה נקי מחובות על ידי הפניית תשלומים נוספים לחוב הקטן ביותר תחילה.',
    debt1: 'חוב 1 (הקטן ביותר)',
    debt2: 'חוב 2',
    debt3: 'חוב 3',
    balance: 'יתרה',
    rate: 'ריבית (%)',
    minPayment: 'תשלום מינימלי',
    extraPayment: 'החזר חודשי נוסף',
    monthsSaved: 'חודשים שנחסכו',
    interestSaved: 'ריבית שנחסכה',
    snowballPayoff: 'זמן סילוק בכדור שלג',
  },
  es: {
    title: 'Calculadora Bola de Nieve de Deudas',
    description: 'Calcula qué tan rápido puedes liberarte de deudas pagando extra a tus deudas más pequeñas primero.',
    debt1: 'Deuda 1 (Más pequeña)',
    debt2: 'Deuda 2',
    debt3: 'Deuda 3',
    balance: 'Saldo',
    rate: 'Tasa (%)',
    minPayment: 'Pago Mínimo',
    extraPayment: 'Pago Mensual Extra',
    monthsSaved: 'Meses Ahorrados',
    interestSaved: 'Intereses Ahorrados',
    snowballPayoff: 'Tiempo de Liquidación',
  },
  fr: {
    title: 'Calculatrice Boule de Neige de Dettes',
    description: 'Calculez la rapidité avec laquelle vous pouvez rembourser vos dettes en payant un supplément sur les plus petites.',
    debt1: 'Dette 1 (Plus petite)',
    debt2: 'Dette 2',
    debt3: 'Dette 3',
    balance: 'Solde',
    rate: 'Taux (%)',
    minPayment: 'Paiement Minimum',
    extraPayment: 'Paiement Mensuel Supplémentaire',
    monthsSaved: 'Mois Économisés',
    interestSaved: 'Intérêts Économisés',
    snowballPayoff: 'Temps de Remboursement',
  },
  ar: {
    title: 'حاسبة كرة الثلج لسداد الديون',
    description: 'احسب السرعة التي يمكنك بها التخلص من الديون عن طريق دفع مبالغ إضافية للديون الأصغر أولاً.',
    debt1: 'الدين 1 (الأصغر)',
    debt2: 'الدين 2',
    debt3: 'الدين 3',
    balance: 'الرصيد',
    rate: 'الفائدة (%)',
    minPayment: 'الحد الأدنى للدفع',
    extraPayment: 'دفع شهري إضافي',
    monthsSaved: 'الأشهر الموفرة',
    interestSaved: 'الفائدة الموفرة',
    snowballPayoff: 'وقت سداد طريقة كرة الثلج',
  }
};

export default function DebtSnowball() {
  const { lang, t: globalT } = useI18n();
  const t = localDict[lang as keyof typeof localDict] || localDict.en;

  const [debts, setDebts] = useState([
    { id: 1, bal: 5000, rate: 18, min: 150 },
    { id: 2, bal: 10000, rate: 12, min: 250 },
    { id: 3, bal: 25000, rate: 7, min: 400 },
  ]);
  const [extraPayment, setExtraPayment] = useState(500);

  const [results, setResults] = useState({ 
    baseMonths: 0, 
    baseInterest: 0,
    snowballMonths: 0,
    snowballInterest: 0
  });

  const updateDebt = (index: number, field: string, value: number) => {
    const newDebts = [...debts];
    newDebts[index] = { ...newDebts[index], [field]: value };
    setDebts(newDebts);
  };

  useEffect(() => {
    const simulatePayoff = (isSnowball: boolean) => {
      // deep copy
      const simDebts = debts.map(d => ({ ...d, bal: d.bal || 0, rate: (d.rate || 0)/100/12, min: d.min || 0 }))
                          .filter(d => d.bal > 0);
      
      simDebts.sort((a, b) => a.bal - b.bal); // Sort smallest to largest (Snowball)
      
      let totalInterest = 0;
      let months = 0;
      
      // Safety break at 1200 months (100 years)
      while (simDebts.some(d => d.bal > 0) && months < 1200) {
        months++;
        let currentExtra = isSnowball ? (extraPayment || 0) : 0;
        
        // Add interest
        simDebts.forEach(d => {
          if (d.bal > 0) {
            const interest = d.bal * d.rate;
            totalInterest += interest;
            d.bal += interest;
          }
        });

        // Make min payments
        simDebts.forEach(d => {
          if (d.bal > 0) {
            const payment = Math.min(d.bal, d.min);
            d.bal -= payment;
            if (isSnowball && payment < d.min) {
              // Debt paid off this month, remainder of min payment roles into snowball
              currentExtra += (d.min - payment);
            } else if (isSnowball && d.bal <= 0) {
              // Paid off in previous months, full min payment rolls into snowball
              currentExtra += d.min;
            }
          } else if (isSnowball) {
            // Already paid off, min payment rolls into snowball
            currentExtra += d.min;
          }
        });

        // Apply snowball extra to smallest remaining
        if (isSnowball && currentExtra > 0) {
          for (const d of simDebts) {
            if (d.bal > 0 && currentExtra > 0) {
              const payment = Math.min(d.bal, currentExtra);
              d.bal -= payment;
              currentExtra -= payment;
            }
          }
        }
      }
      return { months, totalInterest };
    };

    const base = simulatePayoff(false);
    const snowball = simulatePayoff(true);

    setResults({
      baseMonths: base.months,
      baseInterest: base.totalInterest,
      snowballMonths: snowball.months,
      snowballInterest: snowball.totalInterest
    });
  }, [debts, extraPayment]);

  const defaultCurrency = lang === 'he' ? 'ILS' : 'USD';
  const currencyFormat = new Intl.NumberFormat(lang === 'en' ? 'en-US' : lang, { 
    style: 'currency', currency: defaultCurrency, minimumFractionDigits: 0, maximumFractionDigits: 0 
  });

  const chartData = {
    labels: ['Snowball Interest', t.interestSaved],
    datasets: [{
      data: [results.snowballInterest, Math.max(0, results.baseInterest - results.snowballInterest)],
      backgroundColor: ['#ef4444', '#10b981'],
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

  const formatMonths = (m: number) => {
    if (m >= 1200) return '> 100 Years';
    const yrs = Math.floor(m / 12);
    const mos = m % 12;
    return `${yrs > 0 ? yrs + 'y ' : ''}${mos}m`;
  };

  const deferredChartData = useDeferredValue(chartData);

  return (
    <article className="w-full h-full flex flex-col lg:flex-row bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-stone-200 gap-10">
      <SEO
        title={t.title}
        description={t.description}
        canonicalUrl="/calculators/debt-snowball"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: t.title,
          description: t.description,
          applicationCategory: 'CalculatorApplication',
          operatingSystem: 'Any',
          url: `https://globalcalcpro.com${"/calculators/debt-snowball"}`
        }}
      />

      <div className="flex-[2] flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-headline text-stone-900 tracking-tight mb-3">{t.title}</h1>
          <p className="text-stone-500 font-medium text-[15px] leading-relaxed max-w-lg">{t.description}</p>
        </div>

        <div className="space-y-6">
          {[t.debt1, t.debt2, t.debt3].map((label, i) => (
            <div key={i} className="flex flex-col md:flex-row gap-4 p-4 rounded-xl bg-stone-50 border border-stone-100">
              <div className="w-full md:w-1/3">
                <label className="text-[10px] tracking-wider uppercase font-bold text-stone-600 mb-1 block">{label} - {t.balance}</label>
                <input type="number" value={debts[i].bal} onChange={e => updateDebt(i, 'bal', Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-1 text-lg font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
              </div>
              <div className="w-full md:w-1/3">
                <label className="text-[10px] tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.rate}</label>
                <input type="number" value={debts[i].rate} onChange={e => updateDebt(i, 'rate', Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-1 text-lg font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
              </div>
              <div className="w-full md:w-1/3">
                <label className="text-[10px] tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.minPayment}</label>
                <input type="number" value={debts[i].min} onChange={e => updateDebt(i, 'min', Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-1 text-lg font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
              </div>
            </div>
          ))}

          <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
             <label className="text-[10px] tracking-wider uppercase font-bold text-blue-500 mb-1 block">{t.extraPayment}</label>
             <input type="number" value={extraPayment} onChange={e => setExtraPayment(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-blue-200 px-0 py-1 text-2xl font-headline text-blue-700 focus:ring-0 focus:border-blue-700 transition-colors" />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between border-t lg:border-t-0 lg:border-l lg:rtl:border-r lg:rtl:border-l-0 border-stone-200 pt-10 lg:pt-0 lg:pl-10 lg:rtl:pr-10 lg:rtl:pl-0">
        <div className="space-y-6 mb-8">
           <div>
             <span className="text-xs tracking-wider uppercase font-bold text-stone-600 block mb-1">{t.snowballPayoff}</span>
             <div className="text-3xl font-headline text-blue-600" dir="ltr">{formatMonths(results.snowballMonths)}</div>
           </div>
           <div>
             <span className="text-xs tracking-wider uppercase font-bold text-stone-600 block mb-1">{t.monthsSaved}</span>
             <div className="text-2xl font-headline text-stone-900" dir="ltr">{results.baseMonths >= 1200 ? 'MAX' : Math.max(0, results.baseMonths - results.snowballMonths)} months</div>
           </div>
           <div>
             <span className="text-xs tracking-wider uppercase font-bold text-stone-600 block mb-1">{t.interestSaved}</span>
             <div className="text-2xl font-headline text-stone-900" dir="ltr">{currencyFormat.format(Math.max(0, results.baseInterest - results.snowballInterest))}</div>
           </div>
        </div>
        <div className="w-full h-[220px]" dir="ltr">
          <Doughnut data={deferredChartData} options={chartOptions} />
        </div>
      </div>
    </article>
  );
}
