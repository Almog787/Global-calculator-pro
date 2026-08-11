import { useState, useDeferredValue, useEffect, useMemo } from 'react';
import SEO from '../../components/SEO';
import FAQ from '../../components/FAQ';
import RelatedCalculators from '../../components/RelatedCalculators';
import Decimal from 'decimal.js';
import { Line } from 'react-chartjs-2';
import { useI18n } from '../../contexts/i18n';
import { getGuideData } from '../../data/guideTranslations';

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip as ChartTooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Legend, Filler);

const localDict = {
  en: {
    title: 'Goal Savings Calculator',
    description: 'Calculate how much you need to save monthly to reach your financial goal.',
    goalAmount: 'Target Savings Goal',
    initialSavings: 'Initial Savings',
    years: 'Years to Save',
    interestRate: 'Annual Interest Rate (%)',
    monthlyContribution: 'Required Monthly Contribution',
    totalInterest: 'Total Interest Earned',
  },
  he: {
    title: 'מחשבון חיסכון ליעד',
    description: 'חשב כמה עליך לחסוך מדי חודש כדי להגיע ליעד הפיננסי שלך.',
    goalAmount: 'סכום יעד לחיסכון',
    initialSavings: 'חיסכון התחלתי',
    years: 'שנות חיסכון',
    interestRate: 'ריבית שנתית (%)',
    monthlyContribution: 'הפקדה חודשית נדרשת',
    totalInterest: 'סך ריבית שנצברה',
  },
  es: {
    title: 'Calculadora de Ahorro para Meta',
    description: 'Calcula cuánto necesitas ahorrar mensualmente para alcanzar tu meta financiera.',
    goalAmount: 'Meta de Ahorro',
    initialSavings: 'Ahorro Inicial',
    years: 'Años para Ahorrar',
    interestRate: 'Tasa de Interés Anual (%)',
    monthlyContribution: 'Aporte Mensual Requerido',
    totalInterest: 'Total Intereses Ganados',
  },
  fr: {
    title: 'Calculatrice d\'Épargne Objectif',
    description: 'Calculez combien vous devez épargner chaque mois pour atteindre votre objectif.',
    goalAmount: 'Objectif d\'Épargne',
    initialSavings: 'Épargne Initiale',
    years: 'Années d\'Épargne',
    interestRate: 'Taux d\'Intérêt Annuel (%)',
    monthlyContribution: 'Contribution Mensuelle Requise',
    totalInterest: 'Total des Intérêts Gagnés',
  },
  ar: {
    title: 'حاسبة الادخار للهدف',
    description: 'احسب المبلغ الذي تحتاج إلى ادخاره شهرياً للوصول إلى هدفك المالي.',
    goalAmount: 'المبلغ المستهدف للادخار',
    initialSavings: 'الادخار الأولي',
    years: 'سنوات الادخار',
    interestRate: 'معدل الفائدة السنوي (%)',
    monthlyContribution: 'المساهمة الشهرية المطلوبة',
    totalInterest: 'إجمالي الفائدة المكتسبة',
  }
};

export default function GoalSavings() {
  const { lang } = useI18n();
  const guide = getGuideData('goal-savings', lang);
  const t = localDict[lang as keyof typeof localDict] || localDict.en;

  const [goal, setGoal] = useState(50000);
  const [initial, setInitial] = useState(5000);
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(4);

  const [results, setResults] = useState({ monthly: 0, totalInterest: 0 });

  useEffect(() => {
    try {
      const decGoal = new Decimal(goal || 0);
      const decInitial = new Decimal(initial || 0);
      const decRate = new Decimal(rate || 0).div(100).div(12);
      const decMonths = new Decimal(years || 1).mul(12);

      let requiredMonthly = new Decimal(0);
      let fvOfInitial = decInitial;
      
      if (decRate.isZero()) {
        const remaining = decGoal.sub(decInitial);
        requiredMonthly = remaining.isPositive() ? remaining.div(decMonths) : new Decimal(0);
      } else {
        const rateFactor = decRate.add(1).pow(decMonths.toNumber());
        fvOfInitial = decInitial.mul(rateFactor);
        const remainingGoal = decGoal.sub(fvOfInitial);
        
        if (remainingGoal.isPositive()) {
          requiredMonthly = remainingGoal.mul(decRate).div(rateFactor.sub(1));
        }
      }

      const totalDeposited = decInitial.add(requiredMonthly.mul(decMonths));
      const totalInterest = decGoal.sub(totalDeposited);

      setResults({
        monthly: requiredMonthly.isFinite() ? Math.max(0, requiredMonthly.toNumber()) : 0,
        totalInterest: totalInterest.isFinite() ? Math.max(0, totalInterest.toNumber()) : 0,
      });
    } catch {
      setResults({ monthly: 0, totalInterest: 0 });
    }
  }, [goal, initial, years, rate]);

  const defaultCurrency = lang === 'he' ? 'ILS' : 'USD';
  const currencyFormat = new Intl.NumberFormat(lang === 'en' ? 'en-US' : lang, { 
    style: 'currency', currency: defaultCurrency, minimumFractionDigits: 0, maximumFractionDigits: 0 
  });
  
  const chartData = useMemo(() => {
    const labels = [];
    const balanceData = [];
    const decInitial = new Decimal(initial || 0);
    const decRate = new Decimal(rate || 0).div(100).div(12);
    const decMonthly = new Decimal(results.monthly || 0);

    for (let i = 0; i <= years; i++) {
      labels.push(i === 0 ? '0' : `${i}Y`);
      const m = i * 12;
      let bal;
      
      if (decRate.isZero()) {
        bal = decInitial.add(decMonthly.mul(m));
      } else {
        const rateFactor = decRate.add(1).pow(m);
        const pGrowth = decInitial.mul(rateFactor);
        const cGrowth = decMonthly.mul(rateFactor.sub(1)).div(decRate);
        bal = pGrowth.add(cGrowth);
      }
      balanceData.push(Math.min(goal, Math.round(bal.toNumber())));
    }

    return {
      labels,
      datasets: [
        {
          label: 'Balance',
          data: balanceData,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.3,
        }
      ]
    };
  }, [initial, years, rate, results.monthly, goal]);

  const chartOptions = {
    animation: false as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => currencyFormat.format(context.raw || 0),
        }
      }
    },
    scales: {
      y: {
        ticks: { callback: (val: any) => currencyFormat.format(val), font: { size: 11 } },
        grid: { color: '#f3f4f6' },
      },
      x: { grid: { display: false } },
    }
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
        canonicalUrl="/calculators/goal-savings"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: t.title,
          description: t.description,
          applicationCategory: 'CalculatorApplication',
          operatingSystem: 'Any',
          url: `https://globalcalcpro.com${"/calculators/goal-savings"}`
        }}
      />

      <div className="flex-[1.5] flex flex-col">
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight mb-3">{t.title}</h1>
          <p className="text-stone-500 font-medium text-[15px] leading-relaxed max-w-md">{t.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="group">
<label className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">{t.goalAmount}</label>
            <input type="number" value={goal} onChange={e => setGoal(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl md:text-3xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" />
          </div>
          <div className="group">
<label className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">{t.initialSavings}</label>
            <input type="number" value={initial} onChange={e => setInitial(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl md:text-3xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" />
          </div>
          <div className="group">
<label className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">{t.years}</label>
            <input type="number" value={years} onChange={e => setYears(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl md:text-3xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" />
          </div>
          <div className="group">
<label className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">{t.interestRate}</label>
            <input type="number" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl md:text-3xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" />
          </div>
        </div>
        </div>
      </div>
      {/* Sticky Results Dashboard */}
      <div className="w-full lg:w-[420px] shrink-0 lg:sticky lg:top-24 bg-stone-900 rounded-3xl p-8 shadow-2xl border border-stone-800 text-white flex flex-col">
        <div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8">
            <div>
              <span className="text-xs tracking-wider uppercase font-bold text-stone-400 block mb-1">{t.monthlyContribution}</span>
              <div className="text-3xl md:text-4xl font-headline text-blue-600" dir="ltr">{currencyFormat.format(results.monthly)}</div>
            </div>
            <div>
              <span className="text-xs tracking-wider uppercase font-bold text-stone-400 block mb-1">{t.totalInterest}</span>
              <div className="text-xl md:text-2xl font-black text-stone-900" dir="ltr">{currencyFormat.format(results.totalInterest)}</div>
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

      <RelatedCalculators currentId="goal-savings" />
    </div>
  );
}
