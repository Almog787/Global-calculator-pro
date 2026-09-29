import React, { useDeferredValue, useMemo } from 'react';
import { Target } from 'lucide-react';
import { useI18n } from '../../contexts/i18n';
import SEO from '../../components/SEO';
import Breadcrumbs from '../../components/Breadcrumbs';
import RelatedCalculators from '../../components/RelatedCalculators';
import CalculatorGuide from '../../components/CalculatorGuide';
import ScenarioPresets from '../../components/ScenarioPresets';
import ShareActions from '../../components/ShareActions';
import CountUp from '../../components/CountUp';
import ShinyText from '../../components/ShinyText';
import FAQ from '../../components/FAQ';
import DisclaimerNotice from '../../components/DisclaimerNotice';
import { useCalculatorState } from '../../hooks/useCalculatorState';
import Decimal from 'decimal.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Legend, Filler);

const localDict = {
  en: {
    title: 'Break-Even Calculator',
    subtitle: 'Determine Sales Volume & Revenue Needed to Cover All Costs and Turn a Profit',
    description: 'Calculate your exact break-even point in units and revenue. Discover contribution margins, safety margins, and model profitability across various pricing strategies.',
    fixedCosts: 'Total Fixed Costs',
    fixedCostsDesc: 'Monthly or annual overhead (rent, salaries, software, insurance)',
    pricePerUnit: 'Sales Price Per Unit',
    pricePerUnitDesc: 'Revenue earned per single unit or service sold',
    variableCostPerUnit: 'Variable Cost Per Unit',
    variableCostPerUnitDesc: 'Direct cost per unit (materials, labor, shipping, payment fees)',
    expectedUnits: 'Estimated Sales Volume (Units)',
    expectedUnitsDesc: 'Optional: Forecast your net profit/loss at this volume',
    breakEvenUnits: 'Break-Even Units',
    breakEvenRevenue: 'Break-Even Revenue',
    contributionMargin: 'Contribution Margin / Unit',
    marginRatio: 'Contribution Margin Ratio',
    netProfitAtVolume: 'Net Profit at Estimated Sales',
    lossNotice: 'Selling price must be higher than variable cost to break even.',
    chartTitle: 'Cost vs Revenue Break-Even Curves',
    revenueLine: 'Total Revenue',
    totalCostLine: 'Total Costs (Fixed + Variable)',
    fixedCostLine: 'Fixed Costs Base',
    faqTitle: 'Frequently Asked Questions: Break-Even Analysis',
  },
  he: {
    title: 'מחשבון נקודת איזון (Break-Even)',
    subtitle: 'חישוב כמות יחידות ומחזור מכירות נדרש לכיסוי כל ההוצאות ומעבר לרווחיות',
    description: 'מחשבון נקודת איזון עסקי: חישוב כמות היחידות ומחזור המכירות לכיסוי הוצאות קבועות ומשתנות, מרווח תרומה (Contribution Margin) ותרשים אינטראקטיבי.',
    fixedCosts: 'סך הוצאות קבועות',
    fixedCostsDesc: 'הוצאות שאינן תלויות בכמות המכירות (שכירות, שכר קבוע, תוכנות, ביטוח)',
    pricePerUnit: 'מחיר מכירה ליחידה',
    pricePerUnitDesc: 'הכנסה המתקבלת מכל יחידה או שירות שנמכרים',
    variableCostPerUnit: 'הוצאה משתנה ליחידה',
    variableCostPerUnitDesc: 'חומרי גלם, אריזה, עמלות סליקה ומשלוח ליחידה בודדת',
    expectedUnits: 'כמות מכירות חזויה (ביחידות)',
    expectedUnitsDesc: 'אופציונלי: צפה ברווח / הפסד הצפוי ברמת מכירות זו',
    breakEvenUnits: 'יחידות לנקודת איזון',
    breakEvenRevenue: 'מחזור כספי לאיזון',
    contributionMargin: 'מרווח תרומה ליחידה',
    marginRatio: 'יחס מרווח תרומה',
    netProfitAtVolume: 'רווח נקי בהיקף החזוי',
    lossNotice: 'מחיר המכירה חייב להיות גבוה מהעלות המשתנה כדי להגיע לאיזון.',
    chartTitle: 'תרשים הוצאות מול הכנסות ונקודת איזון',
    revenueLine: 'סך הכנסות ממכירות',
    totalCostLine: 'סך עלויות (קבועות + משתנות)',
    fixedCostLine: 'עלויות קבועות',
    faqTitle: 'שאלות ותשובות נפוצות: ניתוח נקודת איזון עסקית',
  },
  es: {
    title: 'Calculadora de Punto de Equilibrio (Break-Even)',
    subtitle: 'Determina las ventas e ingresos necesarios para cubrir costos y generar ganancias',
    description: 'Calcula tu punto de equilibrio exacto en unidades e ingresos. Analiza margen de contribución y rentabilidad empresarial.',
    fixedCosts: 'Costos Fijos Totales',
    fixedCostsDesc: 'Alquiler, sueldos base, seguros, software',
    pricePerUnit: 'Precio de Venta por Unidad',
    pricePerUnitDesc: 'Ingreso por unidad vendida',
    variableCostPerUnit: 'Costo Variable por Unidad',
    variableCostPerUnitDesc: 'Materiales, comisiones, empaque',
    expectedUnits: 'Ventas Estimadas (Unidades)',
    expectedUnitsDesc: 'Pronóstico de beneficio a este volumen',
    breakEvenUnits: 'Unidades de Equilibrio',
    breakEvenRevenue: 'Ingresos de Equilibrio',
    contributionMargin: 'Margen de Contribución',
    marginRatio: 'Ratio de Margen de Contribución',
    netProfitAtVolume: 'Beneficio Neto Estimado',
    lossNotice: 'El precio de venta debe ser mayor al costo variable.',
    chartTitle: 'Curvas de Costo vs Ingresos',
    revenueLine: 'Ingresos Totales',
    totalCostLine: 'Costos Totales',
    fixedCostLine: 'Costos Fijos',
    faqTitle: 'Preguntas Frecuentes sobre Punto de Equilibrio',
  },
  fr: {
    title: 'Calculateur de Seuil de Rentabilité (Point Mort)',
    subtitle: 'Calculez le volume de ventes requis pour couvrir vos coûts et faire des bénéfices',
    description: 'Déterminez le seuil de rentabilité en unités et en chiffre d\'affaires avec analyse de marge sur coûts variables.',
    fixedCosts: 'Coûts Fixes Totaux',
    fixedCostsDesc: 'Loyer, salaires fixes, assurances, logiciels',
    pricePerUnit: 'Prix de Vente Unitaire',
    pricePerUnitDesc: 'Revenu par unité vendue',
    variableCostPerUnit: 'Coût Variable Unitaire',
    variableCostPerUnitDesc: 'Matières premières, commissions, livraison',
    expectedUnits: 'Ventes Prévues (Unités)',
    expectedUnitsDesc: 'Bénéfice estimé pour ce volume',
    breakEvenUnits: 'Unités au Seuil',
    breakEvenRevenue: 'Chiffre d\'Affaires au Seuil',
    contributionMargin: 'Marge sur Coût Variable',
    marginRatio: 'Taux de Marge',
    netProfitAtVolume: 'Bénéfice Net Prévu',
    lossNotice: 'Le prix de vente doit être supérieur au coût variable.',
    chartTitle: 'Courbes de Coûts et Revenus',
    revenueLine: 'Chiffre d\'Affaires Total',
    totalCostLine: 'Coûts Totaux',
    fixedCostLine: 'Coûts Fixes',
    faqTitle: 'Questions Fréquentes sur le Seuil de Rentabilité',
  },
  ar: {
    title: 'حاسبة نقطة التعادل (Break-Even)',
    subtitle: 'حدد حجم المبيعات والإيرادات المطلوبة لتغطية كافة التكاليف وتحقيق الأرباح',
    description: 'احسب نقطة التعادل بدقة بالوحدات والإيرادات المالية، مع هامش المساهمة ومخطط الأرباح التفاعلي.',
    fixedCosts: 'إجمالي التكاليف الثابتة',
    fixedCostsDesc: 'الإيجار، الرواتب، الاشتراكات، التأمين',
    pricePerUnit: 'سعر بيع الوحدة',
    pricePerUnitDesc: 'الإيراد المحقق من بيع وحدة واحدة',
    variableCostPerUnit: 'التكلفة المتغيرة للوحدة',
    variableCostPerUnitDesc: 'المواد الخام، الشحن، عمولات الدفع',
    expectedUnits: 'حجم المبيعات المتوقع (بالوحدات)',
    expectedUnitsDesc: 'توقع صافي الربح أو الخسارة عند هذا الحجم',
    breakEvenUnits: 'وحدات نقطة التعادل',
    breakEvenRevenue: 'إيرادات نقطة التعادل',
    contributionMargin: 'هامش المساهمة للوحدة',
    marginRatio: 'نسبة هامش المساهمة',
    netProfitAtVolume: 'صافي الربح عند المبيعات المتوقعة',
    lossNotice: 'يجب أن يكون سعر البيع أعلى من التكلفة المتغيرة لتحقيق التعادل.',
    chartTitle: 'منحنيات التكاليف والإيرادات ونقطة التعادل',
    revenueLine: 'إجمالي الإيرادات',
    totalCostLine: 'إجمالي التكاليف (ثابتة + متغيرة)',
    fixedCostLine: 'التكاليف الثابتة',
    faqTitle: 'الأسئلة الشائعة حول نقطة التعادل',
  }
};

export default function BreakEven() {
  const { lang, guides } = useI18n();
  const guide = guides['break-even'] || { guideTitle: 'Guide & Formulas', guideDesc: 'Comprehensive calculation breakdown and FAQs.', faq: [] };
  const t = localDict[lang as keyof typeof localDict] || localDict.en;

  const { state, updateState, saveToHistory, loadFromHistory, getHistory } = useCalculatorState('break-even', {
    fixedCosts: 15000,
    pricePerUnit: 120,
    variableCostPerUnit: 45,
    expectedUnits: 300,
  });

  const { fixedCosts, pricePerUnit, variableCostPerUnit, expectedUnits } = state;

  const setFixedCosts = (v: number) => updateState({ fixedCosts: v });
  const setPricePerUnit = (v: number) => updateState({ pricePerUnit: v });
  const setVariableCostPerUnit = (v: number) => updateState({ variableCostPerUnit: v });
  const setExpectedUnits = (v: number) => updateState({ expectedUnits: v });

  const currencySymbol = lang === 'he' ? '₪' : (lang === 'fr' || lang === 'es' ? '€' : '$');

  const results = useMemo(() => {
    try {
      const decFixed = new Decimal(fixedCosts || 0);
      const decPrice = new Decimal(pricePerUnit || 0);
      const decVar = new Decimal(variableCostPerUnit || 0);
      const decExpected = new Decimal(expectedUnits || 0);

      const contributionMargin = decPrice.sub(decVar);
      
      if (contributionMargin.isNegative() || contributionMargin.isZero()) {
        return {
          isValid: false,
          breakEvenUnits: 0,
          breakEvenRevenue: 0,
          contributionMargin: contributionMargin.toNumber(),
          marginRatio: 0,
          netProfit: 0,
        };
      }

      const marginRatio = decPrice.isZero() ? new Decimal(0) : contributionMargin.div(decPrice);
      const breakEvenUnits = decFixed.div(contributionMargin);
      const breakEvenRevenue = breakEvenUnits.mul(decPrice);

      const totalRevenueAtExp = decExpected.mul(decPrice);
      const totalCostAtExp = decFixed.add(decExpected.mul(decVar));
      const netProfit = totalRevenueAtExp.sub(totalCostAtExp);

      return {
        isValid: true,
        breakEvenUnits: Math.ceil(breakEvenUnits.toNumber()),
        breakEvenRevenue: Math.round(breakEvenRevenue.toNumber()),
        contributionMargin: contributionMargin.toNumber(),
        marginRatio: marginRatio.mul(100).toNumber(),
        netProfit: Math.round(netProfit.toNumber()),
      };
    } catch {
      return {
        isValid: false,
        breakEvenUnits: 0,
        breakEvenRevenue: 0,
        contributionMargin: 0,
        marginRatio: 0,
        netProfit: 0,
      };
    }
  }, [fixedCosts, pricePerUnit, variableCostPerUnit, expectedUnits]);

  const chartData = useMemo(() => {
    const maxUnits = Math.max(results.breakEvenUnits * 2, (expectedUnits || 0) * 1.5, 50);
    const steps = 8;
    const stepSize = Math.ceil(maxUnits / steps);

    const labels: string[] = [];
    const revenuePoints: number[] = [];
    const totalCostPoints: number[] = [];
    const fixedCostPoints: number[] = [];

    for (let i = 0; i <= steps; i++) {
      const units = i * stepSize;
      labels.push(`${units}`);
      revenuePoints.push(units * pricePerUnit);
      totalCostPoints.push(fixedCosts + (units * variableCostPerUnit));
      fixedCostPoints.push(fixedCosts);
    }

    return {
      labels,
      datasets: [
        {
          label: t.revenueLine,
          data: revenuePoints,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: false,
          tension: 0.2,
          borderWidth: 3,
        },
        {
          label: t.totalCostLine,
          data: totalCostPoints,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.05)',
          fill: false,
          tension: 0.2,
          borderWidth: 3,
        },
        {
          label: t.fixedCostLine,
          data: fixedCostPoints,
          borderColor: '#94a3b8',
          borderDash: [6, 6],
          fill: false,
          borderWidth: 2,
        },
      ],
    };
  }, [results.breakEvenUnits, expectedUnits, pricePerUnit, fixedCosts, variableCostPerUnit, t]);

  const deferredChartData = useDeferredValue(chartData);

  const presets = [
    {
      label: lang === 'he' ? 'חנות איקומרס / מוצר פיזי' : 'E-commerce Physical Product',
      values: { fixedCosts: 8000, pricePerUnit: 150, variableCostPerUnit: 60, expectedUnits: 200 }
    },
    {
      label: lang === 'he' ? 'מינוי תוכנה (SaaS)' : 'SaaS Software Subscription',
      values: { fixedCosts: 25000, pricePerUnit: 49, variableCostPerUnit: 5, expectedUnits: 800 }
    },
    {
      label: lang === 'he' ? 'בית קפה / מסעדה' : 'Coffee Shop / Bistro',
      values: { fixedCosts: 35000, pricePerUnit: 25, variableCostPerUnit: 8, expectedUnits: 3000 }
    },
    {
      label: lang === 'he' ? 'שירותי ייעוץ ופרילנס' : 'Consulting & Professional Service',
      values: { fixedCosts: 5000, pricePerUnit: 400, variableCostPerUnit: 50, expectedUnits: 35 }
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      <SEO
        title={t.title}
        description={t.description}
        keywords={['break even calculator', 'contribution margin', 'נקודת איזון', 'מחשבון נקודת איזון', 'עסקים']}
      />

      <Breadcrumbs
        items={[
          { label: lang === 'he' ? 'עסקים ופיננסים' : 'Finance & Business', path: `/${lang}/category/finance` },
          { label: t.title },
        ]}
      />

      {/* Scenario Presets */}
      <ScenarioPresets
        presets={presets}
        onSelect={(val) => {
          if (val.fixedCosts !== undefined) setFixedCosts(val.fixedCosts);
          if (val.pricePerUnit !== undefined) setPricePerUnit(val.pricePerUnit);
          if (val.variableCostPerUnit !== undefined) setVariableCostPerUnit(val.variableCostPerUnit);
          if (val.expectedUnits !== undefined) setExpectedUnits(val.expectedUnits);
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form */}
        <div className="lg:col-span-7 bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3.5 pb-4 border-b border-stone-100 dark:border-stone-800">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
                {t.title}
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-medium">
                {t.subtitle}
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Fixed Costs */}
            <div>
              <label htmlFor="be-fixed" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                {t.fixedCosts} ({currencySymbol})
              </label>
              <input
                id="be-fixed"
                type="number"
                min="0"
                value={fixedCosts}
                onChange={(e) => setFixedCosts(Math.max(0, Number(e.target.value)))}
                className="w-full bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-3.5 text-xl font-bold text-stone-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
              />
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{t.fixedCostsDesc}</p>
            </div>

            {/* Price & Variable Cost 2-col */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="be-price" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  {t.pricePerUnit} ({currencySymbol})
                </label>
                <input
                  id="be-price"
                  type="number"
                  min="0"
                  value={pricePerUnit}
                  onChange={(e) => setPricePerUnit(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-3.5 text-xl font-bold text-stone-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                />
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{t.pricePerUnitDesc}</p>
              </div>

              <div>
                <label htmlFor="be-var" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  {t.variableCostPerUnit} ({currencySymbol})
                </label>
                <input
                  id="be-var"
                  type="number"
                  min="0"
                  value={variableCostPerUnit}
                  onChange={(e) => setVariableCostPerUnit(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-3.5 text-xl font-bold text-stone-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                />
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{t.variableCostPerUnitDesc}</p>
              </div>
            </div>

            {/* Expected Sales Volume */}
            <div>
              <label htmlFor="be-units" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                {t.expectedUnits}
              </label>
              <input
                id="be-units"
                type="number"
                min="0"
                value={expectedUnits}
                onChange={(e) => setExpectedUnits(Math.max(0, Number(e.target.value)))}
                className="w-full bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-3.5 text-xl font-bold text-stone-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
              />
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{t.expectedUnitsDesc}</p>
            </div>
          </div>

          <ShareActions
            calculatorTitle={t.title}
            calculatorPath="/calculators/break-even"
            onSaveHistory={saveToHistory}
            historyEntries={getHistory()}
            onLoadHistory={loadFromHistory}
          />
        </div>

        {/* Right Sticky Dashboard */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          <div className="bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-800 text-white flex flex-col gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
                  {t.breakEvenUnits}
                </span>
                <ShinyText text="BREAK-EVEN" speed={3} className="text-[10px] text-emerald-400 font-mono" />
              </div>
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-white flex items-baseline gap-2" dir="ltr">
                <CountUp to={results.breakEvenUnits} duration={0.6} />
                <span className="text-lg font-bold text-stone-400">{lang === 'he' ? 'יחידות' : 'Units'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1">
                  {t.breakEvenRevenue}
                </span>
                <div className="text-lg sm:text-xl font-bold text-emerald-400" dir="ltr">
                  <CountUp to={results.breakEvenRevenue} prefix={`${currencySymbol} `} duration={0.6} />
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1">
                  {t.contributionMargin}
                </span>
                <div className="text-lg sm:text-xl font-bold text-amber-400" dir="ltr">
                  <CountUp to={Math.round(results.contributionMargin * 100) / 100} prefix={`${currencySymbol} `} duration={0.6} />
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1">
                  {t.marginRatio}
                </span>
                <div className="text-lg sm:text-xl font-bold text-blue-400" dir="ltr">
                  <CountUp to={Math.round(results.marginRatio * 10) / 10} suffix="%" duration={0.6} />
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1">
                  {t.netProfitAtVolume}
                </span>
                <div className={`text-lg sm:text-xl font-bold ${results.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`} dir="ltr">
                  <CountUp to={results.netProfit} prefix={`${currencySymbol} `} duration={0.6} />
                </div>
              </div>
            </div>

            {/* Visual Line Chart */}
            <div className="w-full h-[220px] bg-white/5 p-3 rounded-2xl border border-white/10" dir="ltr">
              <Line
                data={deferredChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  animation: false,
                  plugins: {
                    legend: { labels: { color: '#e2e8f0', font: { size: 10 } } },
                    tooltip: { mode: 'index', intersect: false },
                  },
                  scales: {
                    x: { ticks: { color: '#94a3b8', font: { size: 9 } }, grid: { display: false } },
                    y: { ticks: { color: '#94a3b8', font: { size: 9 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <DisclaimerNotice type="financial" />

      <CalculatorGuide guideKey="break-even" category="finance" />

      <FAQ items={guide.faq} />

      <RelatedCalculators currentId="break-even" />
    </div>
  );
}
