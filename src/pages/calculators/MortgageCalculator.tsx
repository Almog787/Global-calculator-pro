import { useDeferredValue, useEffect, useMemo } from 'react';
import { useUrlState } from '../../hooks/useUrlState';
import SEO from '../../components/SEO';
import FAQ from '../../components/FAQ';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useI18n } from '../../contexts/i18n';
import Breadcrumbs from '../../components/Breadcrumbs';
import RelatedCalculators from '../../components/RelatedCalculators';
import CalculatorGuide from '../../components/CalculatorGuide';
import ShareActions from '../../components/ShareActions';
import ScenarioPresets from '../../components/ScenarioPresets';
import { calculateMortgage, calculateReverseMortgage } from '../../lib/math/finance';


ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

export default function MortgageCalculator() {
  const { t, lang, guides } = useI18n();
  const guide = guides['mortgage'] || { guideTitle: 'Guide & Formulas', guideDesc: 'Comprehensive calculation breakdown and FAQs.', faq: [] };
  
  const [mode, setMode] = useUrlState<'standard' | 'reverse'>('mode', 'standard');
  const [principal, setPrincipal] = useUrlState('principal', 300000);
  const [targetPayment, setTargetPayment] = useUrlState('targetPayment', 1900);
  const [rate, setRate] = useUrlState('rate', 6.5);
  const [years, setYears] = useUrlState('years', 30);

  const standardResult = useMemo(() => {
    return calculateMortgage(principal, rate, years);
  }, [principal, rate, years]);

  const reverseResult = useMemo(() => {
    return calculateReverseMortgage(targetPayment, rate, years);
  }, [targetPayment, rate, years]);

  const activeMonthlyPayment = mode === 'standard' ? standardResult.monthlyPayment : targetPayment;
  const activePrincipal = mode === 'standard' ? principal : reverseResult.maxLoanAmount;
  const activeTotalInterest = mode === 'standard' ? standardResult.totalInterest : reverseResult.totalInterest;

  useEffect(() => {
    const handler = setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'calculate', {
          event_category: 'Mortgage Calculator',
          mode,
          principal: activePrincipal,
          rate,
          years
        });
      }
    }, 2000);
    return () => clearTimeout(handler);
  }, [mode, activePrincipal, rate, years]);

  const defaultCurrency = lang === 'he' ? 'ILS' : lang === 'fr' || lang === 'es' ? 'EUR' : 'USD';
  const currencyFormat = new Intl.NumberFormat(lang === 'en' ? 'en-US' : lang, { style: 'currency', currency: defaultCurrency, minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const chartData = {
    labels: [t.loanAmount, t.totalInterest],
    datasets: [
      {
        data: [activePrincipal, activeTotalInterest],
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

  const presets = [
    {
      label: { en: 'First Home ($300k)', he: 'דירה ראשונה (300,000 $ / ₪)', es: 'Primera Vivienda ($300k)', fr: 'Premier Logement (300k €)', ar: 'المسكن الأول (300 ألف)' },
      description: { en: '30 Years @ 6.5%', he: '30 שנה בריבית 6.5%', es: '30 años al 6.5%', fr: '30 ans à 6,5%', ar: '30 سنة بفائدة 6.5%' },
      values: { mode: 'standard', principal: 300000, rate: 6.5, years: 30 },
      badge: '30Y'
    },
    {
      label: { en: 'Family Upgrade ($600k)', he: 'שדרוג משפחתי (600,000 $ / ₪)', es: 'Vivienda Familiar ($600k)', fr: 'Logement Familial (600k €)', ar: 'ترقية عائلية (600 ألف)' },
      description: { en: '25 Years @ 6.0%', he: '25 שנה בריבית 6.0%', es: '25 años al 6.0%', fr: '25 ans à 6,0%', ar: '25 سنة بفائدة 6.0%' },
      values: { mode: 'standard', principal: 600000, rate: 6.0, years: 25 },
      badge: '25Y'
    },
    {
      label: { en: 'Fast Payoff 15Y ($250k)', he: 'סילוק מואץ ל-15 שנה', es: 'Pago Rápido 15 Años', fr: 'Remboursement 15 Ans', ar: 'سداد سريع 15 سنة' },
      description: { en: '15 Years @ 5.5%', he: '15 שנה בריבית 5.5%', es: '15 años al 5.5%', fr: '15 ans à 5,5%', ar: '15 سنة بفائدة 5.5%' },
      values: { mode: 'standard', principal: 250000, rate: 5.5, years: 15 },
      badge: '15Y'
    },
    {
      label: { en: 'Target $2,500/mo Budget', he: 'תקציב החזר 2,500 לחודש', es: 'Presupuesto $2,500/mes', fr: 'Budget 2 500 €/mois', ar: 'ميزانية 2,500 شهرياً' },
      description: { en: 'Reverse calculate max loan', he: 'חישוב הלוואה מקסימלית (הפוך)', es: 'Capacidad de préstamo', fr: 'Capacité d\'emprunt', ar: 'أقصى قرض متاح' },
      values: { mode: 'reverse', targetPayment: 2500, rate: 6.5, years: 30 },
      badge: 'REVERSE'
    }
  ];

  const modeLabels = {
    en: { standard: 'Calculate Monthly Payment', reverse: 'Reverse: Borrowing Power / Max Loan' },
    he: { standard: 'חישוב החזר חודשי (רגיל)', reverse: 'חישוב הפוך: כושר קנייה והלוואה מקסימלית' },
    es: { standard: 'Calcular Pago Mensual', reverse: 'Cálculo Inverso: Capacidad de Préstamo' },
    fr: { standard: 'Calculer la Mensualité', reverse: 'Calcul Inverse : Capacité d\'Emprunt' },
    ar: { standard: 'حساب القسط الشهري', reverse: 'حساب عكسي: القدرة الشرائية وأقصى قرض' },
  }[lang] || { standard: 'Calculate Monthly Payment', reverse: 'Reverse: Borrowing Power / Max Loan' };

  return (
    <div className="w-full">
      <Breadcrumbs items={[{ label: t.catAll || 'Library', path: `/${lang}/all` }, { label: t.mortgageTitle }]} />

      <ScenarioPresets
        presets={presets}
        onSelect={(vals) => {
          if (vals.mode) setMode(vals.mode);
          if (vals.principal !== undefined) setPrincipal(vals.principal);
          if (vals.targetPayment !== undefined) setTargetPayment(vals.targetPayment);
          if (vals.rate !== undefined) setRate(vals.rate);
          if (vals.years !== undefined) setYears(vals.years);
        }}
      />

      <div className="w-full h-full flex flex-col lg:flex-row gap-8 items-start relative">
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
      
      {/* Input Form */}
      <div className="flex-1 w-full bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-stone-200 flex flex-col">
        {/* Mode Selector Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-stone-100 rounded-2xl mb-8 border border-stone-200">
          <button
            type="button"
            onClick={() => setMode('standard')}
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              mode === 'standard'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {modeLabels.standard}
          </button>
          <button
            type="button"
            onClick={() => setMode('reverse')}
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              mode === 'reverse'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {modeLabels.reverse}
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight mb-2">
            {mode === 'standard' ? t.mortgageTitle : modeLabels.reverse}
          </h2>
          <p className="text-stone-500 font-medium text-[14px] leading-relaxed max-w-lg">
            {mode === 'standard'
              ? t.mortgageExplanation
              : (lang === 'he' ? 'הזן את ההחזר החודשי הרצוי וגלה איזה סכום משכנתא כולל תוכל לקבל.' : 'Enter your target monthly payment to discover your maximum borrowing power.')}
          </p>
        </div>
        <form toolname="mortgage_calculator" tooldescription="Calculate monthly mortgage payment or reverse borrowing power" onSubmit={e => e.preventDefault()} className="flex-1 flex flex-col justify-between">
          <div className="space-y-8">
            {mode === 'standard' ? (
              <div className="group">
                <label htmlFor="mc-principal" className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">{t.loanAmount}</label>
                <input id="mc-principal" aria-label={t.loanAmount} toolparamdescription="Principal loan amount" type="number" value={principal} onChange={e => setPrincipal(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-3xl md:text-4xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" />
              </div>
            ) : (
              <div className="group">
                <label htmlFor="mc-target-payment" className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">
                  {lang === 'he' ? 'החזר חודשי רצוי' : lang === 'es' ? 'Pago Mensual Deseado' : lang === 'fr' ? 'Mensualité Souhaitée' : lang === 'ar' ? 'القسط الشهري المستهدف' : 'Desired Monthly Payment'}
                </label>
                <input id="mc-target-payment" aria-label="Target monthly payment" type="number" value={targetPayment} onChange={e => setTargetPayment(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-3xl md:text-4xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" />
              </div>
            )}
            <div className="group">
              <label htmlFor="mc-rate" className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">{t.interestRate} (%)</label>
              <input id="mc-rate" aria-label={t.interestRate} toolparamdescription="Annual interest rate percentage" type="number" step="0.1" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-3xl md:text-4xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" />
            </div>
            <div className="group">
              <label htmlFor="mc-years" className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">{t.loanTerm} ({lang === 'he' ? 'שנים' : 'Years'})</label>
              <input id="mc-years" aria-label={t.loanTerm} toolparamdescription="Duration of loan in years" type="number" value={years} onChange={e => setYears(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-3xl md:text-4xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" />
            </div>
          </div>
        </form>
      </div>
      
      {/* Sticky Results Dashboard */}
      <div className="w-full lg:w-[420px] shrink-0 lg:sticky lg:top-24 bg-stone-900 rounded-3xl p-8 shadow-2xl border border-stone-800 text-white flex flex-col">
        <div className="mb-8">
          <span className="text-[11px] tracking-widest uppercase font-bold text-stone-400 block mb-3">
            {mode === 'standard' ? t.monthlyPayment : (lang === 'he' ? 'סכום הלוואה מקסימלי' : lang === 'es' ? 'Monto Máximo de Préstamo' : lang === 'fr' ? 'Capacité d\'Emprunt Maximale' : lang === 'ar' ? 'الحد الأقصى لمبلغ القرض' : 'Maximum Borrowing Power')}
          </span>
          <div className="text-4xl sm:text-5xl font-black text-white tracking-tighter" dir="ltr">
            {currencyFormat.format(mode === 'standard' ? activeMonthlyPayment : activePrincipal)}
          </div>
        </div>
        
        <div className="mb-8 p-5 bg-white/5 rounded-2xl border border-white/10 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[11px] tracking-widest uppercase font-bold text-stone-400">
              {mode === 'standard' ? t.totalInterest : t.monthlyPayment}
            </span>
            <div className="text-lg font-bold text-blue-400" dir="ltr">
              {currencyFormat.format(mode === 'standard' ? activeTotalInterest : activeMonthlyPayment)}
            </div>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-white/10">
            <span className="text-[11px] tracking-widest uppercase font-bold text-stone-400">
              {mode === 'standard' ? (lang === 'he' ? 'סה"כ לתשלום' : 'Total Paid') : t.totalInterest}
            </span>
            <div className="text-sm font-semibold text-stone-300" dir="ltr">
              {currencyFormat.format(mode === 'standard' ? activePrincipal + activeTotalInterest : activeTotalInterest)}
            </div>
          </div>
        </div>
        
        <div className="w-full h-[220px]" dir="ltr">
          <Doughnut data={deferredChartData} options={chartOptions} />
        </div>

        <div className="mt-6 pt-4 border-t border-white/10">
          <ShareActions calculatorTitle={t.mortgageTitle} calculatorPath="/mortgage-calculator" />
        </div>
      </div>
    </div>

      {/* SEO EDUCATIONAL GUIDE & FORMULA BREAKDOWN */}
      <CalculatorGuide
        guideKey="mortgage"
        onApplyPreset={(preset) => {
          if (preset.principal) {
            setMode('standard');
            setPrincipal(Number(preset.principal));
          }
          if (preset.rate) setRate(Number(preset.rate));
          if (preset.years) setYears(Number(preset.years));
        }}
      />

      <FAQ items={guide.faq} />
      
      <RelatedCalculators currentId="mortgage" />
    </div>
  );
}
