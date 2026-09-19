import FAQ from '../../components/FAQ';
import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import SEO from '../../components/SEO';
import Decimal from 'decimal.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useI18n } from '../../contexts/i18n';
import Breadcrumbs from '../../components/Breadcrumbs';
import RelatedCalculators from '../../components/RelatedCalculators';
import CalculatorGuide from '../../components/CalculatorGuide';
import ScenarioPresets from '../../components/ScenarioPresets';
import { Link } from 'react-router-dom';
import { useCalculatorState } from '../../hooks/useCalculatorState';
import ShareActions from '../../components/ShareActions';
import { calculateGrossFromNet } from '../../lib/math/finance';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function SalaryCalculator() {
  const { t, lang, guides } = useI18n();
  const guide = guides['salary'] || { guideTitle: 'Guide & Formulas', guideDesc: 'Comprehensive calculation breakdown and FAQs.', faq: [] };
  
  const [mode, setMode] = useState<'gross-to-net' | 'net-to-gross'>('gross-to-net');
  const [targetNet, setTargetNet] = useState<number>(10000);
  const [taxRate, setTaxRate] = useState<number>(20);
  const [pensionRate, setPensionRate] = useState<number>(6);
  const [socialSecRate, setSocialSecRate] = useState<number>(4);

  const { state, updateState, saveToHistory, loadFromHistory, getHistory } = useCalculatorState('salary', {
    amount: 50000,
    frequency: 'yearly'
  });

  const { amount, frequency } = state;
  const setAmount = (v: number) => updateState({ amount: v });
  const setFrequency = (v: string) => updateState({ frequency: v });
  
  const results = useMemo(() => {
    try {
      if (mode === 'net-to-gross') {
        const reverse = calculateGrossFromNet(targetNet, taxRate, pensionRate, socialSecRate);
        return {
          hourly: reverse.grossYearly / 2080,
          weekly: reverse.grossYearly / 52,
          monthly: reverse.grossMonthly,
          yearly: reverse.grossYearly,
          netMonthly: reverse.netMonthly,
          netYearly: reverse.netYearly
        };
      }

      const decAmt = new Decimal(amount || 0);
      let decYearly = new Decimal(0);

      switch(frequency) {
        case 'hourly':
          decYearly = decAmt.mul(40).mul(52);
          break;
        case 'weekly':
          decYearly = decAmt.mul(52);
          break;
        case 'monthly':
          decYearly = decAmt.mul(12);
          break;
        case 'yearly':
        default:
          decYearly = decAmt;
          break;
      }

      const hourly = decYearly.div(2080).toNumber();
      const weekly = decYearly.div(52).toNumber();
      const monthly = decYearly.div(12).toNumber();
      const yearly = decYearly.toNumber();

      return {
        hourly,
        weekly,
        monthly,
        yearly,
        netMonthly: monthly * 0.72,
        netYearly: yearly * 0.72
      };
    } catch {
      return { hourly: 0, weekly: 0, monthly: 0, yearly: 0, netMonthly: 0, netYearly: 0 };
    }
  }, [mode, amount, frequency, targetNet, taxRate, pensionRate, socialSecRate]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'calculate', {
          event_category: 'Salary Calculator',
          mode,
          amount,
          frequency,
          targetNet
        });
      }
    }, 2000);
    return () => clearTimeout(handler);
  }, [mode, amount, frequency, targetNet]);

  const defaultCurrency = lang === 'he' ? 'ILS' : lang === 'fr' || lang === 'es' ? 'EUR' : 'USD';
  const currencyFormat = new Intl.NumberFormat(lang === 'en' ? 'en-US' : lang, { style: 'currency', currency: defaultCurrency, minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const presets = [
    {
      label: { en: 'Hourly $35/hr Contractor', he: 'שכר שעתי: 35 $ / ₪ לשעה', es: 'Tarifa Horaria $35/h', fr: 'Taux Horaire 35€/h', ar: 'أجر بالساعة 35' },
      description: { en: '40h/week full-time conversion', he: 'המרה לחישוב חודשי ושנתי מלא', es: 'Conversión tiempo completo', fr: 'Temps plein 40h/sem', ar: 'دوام كامل 40 ساعة' },
      values: { mode: 'gross-to-net', amount: 35, frequency: 'hourly' },
      badge: 'HOURLY'
    },
    {
      label: { en: 'Tech Salary $95k/yr', he: 'משכורת הייטק 95k', es: 'Salario Tech $95k', fr: 'Salaire Cadre 95k €', ar: 'راتب تقني 95 ألف' },
      description: { en: 'Gross yearly to monthly take-home', he: 'המרת שכר שנתי להכנסה חודשית', es: 'Salario anual a mensual', fr: 'Brut annuel vers mensuel', ar: 'الراتب السنوي إلى شهري' },
      values: { mode: 'gross-to-net', amount: 95000, frequency: 'yearly' },
      badge: 'YEARLY'
    },
    {
      label: { en: 'Target $10,000 Net Monthly', he: 'יעד נטו: 10,000 לחודש בכיס', es: 'Meta $10,000 Neto Mensual', fr: 'Cible 10 000 € Net/mois', ar: 'الهدف 10 آلاف صافي شهرياً' },
      description: { en: 'Reverse calculate required gross negotiation', he: 'חישוב הפוך: איזה ברוטו לדרוש בראיון', es: 'Cálculo inverso: sueldo bruto necesario', fr: 'Brut à négocier', ar: 'الراتب الإجمالي المطلوب للتفاوض' },
      values: { mode: 'net-to-gross', targetNet: 10000, taxRate: 20, pensionRate: 6, socialSecRate: 4 },
      badge: 'REVERSE'
    },
    {
      label: { en: 'Executive $15,000 Net', he: 'בכירים: 15,000 נטו לחודש', es: 'Ejecutivo $15,000 Neto', fr: 'Direction 15 000 € Net', ar: 'تنفيذي 15 ألف صافي' },
      description: { en: 'Reverse calculate gross with 35% deductions', he: 'חישוב ברוטו מבוקש עם 35% ניכויים', es: 'Cálculo bruto con 35% retenciones', fr: 'Brut avec 35% charges', ar: 'حساب الإجمالي مع خصم 35%' },
      values: { mode: 'net-to-gross', targetNet: 15000, taxRate: 24, pensionRate: 6, socialSecRate: 5 },
      badge: 'REVERSE'
    }
  ];

  const modeLabels = {
    en: { standard: 'Gross to Net Conversion', reverse: 'Reverse: Target Net ➔ Required Gross' },
    he: { standard: 'המרת שכר ברוטו (רגיל)', reverse: 'חישוב הפוך: יעד נטו ➔ איזה ברוטו לדרוש?' },
    es: { standard: 'Conversión Bruto a Neto', reverse: 'Cálculo Inverso: Neto Deseado ➔ Bruto Requerido' },
    fr: { standard: 'Conversion Brut vers Net', reverse: 'Calcul Inverse : Net Souhaité ➔ Brut Requis' },
    ar: { standard: 'تحويل الراتب الإجمالي (قياسي)', reverse: 'حساب عكسي: الصافي المستهدف ➔ الإجمالي المطلوب' },
  }[lang] || { standard: 'Gross to Net Conversion', reverse: 'Reverse: Target Net ➔ Required Gross' };

  const chartData = {
    labels: [t.hourly, t.weekly, t.monthly, t.yearly],
    datasets: [
      {
        label: t.salaryAmount || 'Salary',
        data: [results.hourly, results.weekly, results.monthly, results.yearly],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#6366f1'],
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    animation: false as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
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
        grid: {
          color: '#f3f4f6',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const deferredChartData = useDeferredValue(chartData);

  return (
    <div className="w-full">
      <Breadcrumbs items={[{ label: t.catAll || 'Library', path: `/${lang}/all` }, { label: t.salaryTitle }]} />

      {/* Programmatic Scenario Presets */}
      <ScenarioPresets
        presets={presets}
        onSelect={(vals) => {
          if (vals.mode) setMode(vals.mode);
          if (vals.amount !== undefined) setAmount(vals.amount);
          if (vals.frequency !== undefined) setFrequency(vals.frequency);
          if (vals.targetNet !== undefined) setTargetNet(vals.targetNet);
          if (vals.taxRate !== undefined) setTaxRate(vals.taxRate);
          if (vals.pensionRate !== undefined) setPensionRate(vals.pensionRate);
          if (vals.socialSecRate !== undefined) setSocialSecRate(vals.socialSecRate);
        }}
      />

      <div className="w-full h-full flex flex-col lg:flex-row gap-8 items-start relative">
      <SEO
        title={t.salaryTitle}
        description={t.salaryDesc}
        canonicalUrl={`/${lang}/salary-calculator`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: t.salaryTitle,
          description: t.salaryDesc,
          applicationCategory: 'CalculatorApplication',
          operatingSystem: 'Any',
          url: `https://globalcalcpro.com/${lang}/salary-calculator`
        }}
      />
      
      {/* Input Form */}
      <div className="flex-1 w-full bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-stone-200 flex flex-col">
        {/* Mode Selector Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-stone-100 rounded-2xl mb-8 border border-stone-200">
          <button
            type="button"
            onClick={() => setMode('gross-to-net')}
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              mode === 'gross-to-net'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {modeLabels.standard}
          </button>
          <button
            type="button"
            onClick={() => setMode('net-to-gross')}
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              mode === 'net-to-gross'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {modeLabels.reverse}
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight mb-2">
            {mode === 'gross-to-net' ? t.salaryTitle : modeLabels.reverse}
          </h2>
          <p className="text-stone-500 font-medium text-[14px] leading-relaxed max-w-lg">
            {mode === 'gross-to-net'
              ? t.salaryExplanation
              : (lang === 'he' ? 'הזן את שכר הנטו שתרצה לקבל בחשבון הבנק, וחשב איזה שכר ברוטו עליך לדרוש במשא ומתן.' : 'Enter your target take-home net salary to calculate the required gross contract amount.')}
          </p>
        </div>

        <form toolname="salary_calculator" tooldescription="Convert pay frequency to gross and net annual salary projections" onSubmit={e => e.preventDefault()} className="flex-1 flex flex-col justify-between">
          <div className="space-y-8">
            {mode === 'gross-to-net' ? (
              <>
                <div className="group">
                  <label htmlFor="sal-amount" className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">{t.salaryAmount}</label>
                  <input id="sal-amount" aria-label={t.salaryAmount} toolparamdescription="Salary rate or payment amount" type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-3xl md:text-4xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" />
                </div>
                <div className="group">
                  <label htmlFor="sal-freq" className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">{t.salaryFrequency}</label>
                  <select id="sal-freq" aria-label={t.salaryFrequency} toolparamdescription="Payment frequency interval" value={frequency} onChange={e => setFrequency(e.target.value)} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-3xl md:text-4xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors cursor-pointer">
                    <option value="hourly">{t.hourly}</option>
                    <option value="weekly">{t.weekly}</option>
                    <option value="monthly">{t.monthly}</option>
                    <option value="yearly">{t.yearly}</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div className="group">
                  <label htmlFor="sal-target-net" className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">
                    {lang === 'he' ? 'שכר נטו חודשי מבוקש' : lang === 'es' ? 'Salario Neto Mensual Deseado' : lang === 'fr' ? 'Net Mensuel Souhaité' : lang === 'ar' ? 'الصافي الشهري المستهدف' : 'Target Net Monthly Salary'}
                  </label>
                  <input id="sal-target-net" aria-label="Target net monthly" type="number" value={targetNet} onChange={e => setTargetNet(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-3xl md:text-4xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="sal-tax-rate" className="text-[11px] font-bold text-stone-500 uppercase block mb-1">
                      {lang === 'he' ? 'מס הכנסה (%)' : 'Income Tax (%)'}
                    </label>
                    <input id="sal-tax-rate" type="number" value={taxRate} onChange={e => setTaxRate(Number(e.target.value))} className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-bold text-stone-900" />
                  </div>
                  <div>
                    <label htmlFor="sal-pension-rate" className="text-[11px] font-bold text-stone-500 uppercase block mb-1">
                      {lang === 'he' ? 'פנסיה/גמל (%)' : 'Pension (%)'}
                    </label>
                    <input id="sal-pension-rate" type="number" value={pensionRate} onChange={e => setPensionRate(Number(e.target.value))} className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-bold text-stone-900" />
                  </div>
                  <div>
                    <label htmlFor="sal-soc-rate" className="text-[11px] font-bold text-stone-500 uppercase block mb-1">
                      {lang === 'he' ? 'ביטוח לאומי (%)' : 'Social Sec (%)'}
                    </label>
                    <input id="sal-soc-rate" type="number" value={socialSecRate} onChange={e => setSocialSecRate(Number(e.target.value))} className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-bold text-stone-900" />
                  </div>
                </div>
              </>
            )}
          </div>
        </form>

        <ShareActions
          calculatorTitle={t.salaryTitle}
          calculatorPath="/salary-calculator"
          onSaveHistory={saveToHistory}
          historyEntries={getHistory()}
          onLoadHistory={loadFromHistory}
        />
      </div>
      
      {/* Sticky Results Dashboard */}
      <div className="w-full lg:w-[420px] shrink-0 lg:sticky lg:top-24 flex flex-col gap-6">
        <div className="bg-stone-900 rounded-3xl p-8 shadow-2xl border border-stone-800 text-white flex flex-col">
          <div className="mb-8">
            <span className="text-[11px] tracking-widest uppercase font-bold text-stone-400 block mb-3">
              {mode === 'gross-to-net' ? t.yearly : (lang === 'he' ? 'שכר ברוטו חודשי נדרש' : 'Required Gross Monthly')}
            </span>
            <div className="text-4xl sm:text-5xl font-black text-white tracking-tighter" dir="ltr">
              {currencyFormat.format(mode === 'gross-to-net' ? results.yearly : results.monthly)}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[11px] tracking-widest uppercase font-bold text-stone-400 block mb-1">
                  {mode === 'gross-to-net' ? t.monthly : (lang === 'he' ? 'שכר ברוטו שנתי' : 'Gross Yearly')}
                </span>
                <div className="text-lg font-bold text-blue-400" dir="ltr">
                  {currencyFormat.format(mode === 'gross-to-net' ? results.monthly : results.yearly)}
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[11px] tracking-widest uppercase font-bold text-stone-400 block mb-1">
                  {lang === 'he' ? 'נטו חודשי' : 'Net Monthly'}
                </span>
                <div className="text-lg font-bold text-emerald-400" dir="ltr">
                  {currencyFormat.format(results.netMonthly)}
                </div>
              </div>
          </div>
          <div className="w-full h-[220px] bg-white/5 p-4 rounded-2xl border border-white/10" dir="ltr">
            <Bar data={deferredChartData} options={chartOptions} />
          </div>
        </div>
        
        {/* Cross-Sell Box */}
        <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 shadow-sm">
          <h3 className="font-bold text-blue-900 text-lg mb-2">
            {lang === 'he' ? 'קונים דירה בקרוב?' : 'Buying a home soon?'}
          </h3>
          <p className="text-blue-800/80 text-sm mb-4">
            {lang === 'he' 
              ? 'בדקו איזה תקציב דירה מתאים לשכר שלכם, עם מחשבון המשכנתא שלנו.'
              : 'See how much house you can afford based on your salary with our Mortgage Calculator.'}
          </p>
          <Link 
            to={`/${lang}/mortgage-calculator`}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-xl transition-colors text-sm"
          >
            {lang === 'he' ? 'למחשבון המשכנתא' : 'To Mortgage Calculator'}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={lang === 'he' ? 'rotate-180' : ''}><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </Link>
        </div>
      </div>
    </div>

      {/* SEO EDUCATIONAL GUIDE & FORMULA BREAKDOWN */}
      <CalculatorGuide
        guideKey="salary"
        onApplyPreset={(preset) => {
          if (preset.amount !== undefined) setAmount(Number(preset.amount));
          if (preset.frequency !== undefined) setFrequency(preset.frequency as any);
        }}
      />

      <FAQ items={guide.faq} />

      <RelatedCalculators currentId="salary" />
    </div>
  );
}
