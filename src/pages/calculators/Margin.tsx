import React, { useDeferredValue, useMemo, useState } from 'react';
import { Percent } from 'lucide-react';
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
  ArcElement,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, ChartTooltip, Legend);

const localDict = {
  en: {
    title: 'Margin & Markup Calculator',
    subtitle: 'Calculate Gross Profit, Profit Margin (%), Markup (%) & Target Pricing Instantly',
    description: 'Quickly calculate your gross profit margin and markup from cost and revenue. Or calculate target selling price based on your desired profit margin.',
    modeCostRevenue: 'Calculate Margin from Price',
    modeTargetMargin: 'Calculate Price from Target Margin',
    cost: 'Cost of Goods Sold (COGS)',
    costDesc: 'Direct production or wholesale purchase cost per unit',
    revenue: 'Selling Price / Revenue',
    revenueDesc: 'Customer selling price per unit',
    targetMargin: 'Target Profit Margin (%)',
    targetMarginDesc: 'Desired margin percentage (e.g. 40% margin)',
    quantity: 'Sales Volume / Quantity (Units)',
    quantityDesc: 'Batch quantity for total profit and turnover modeling',
    grossProfit: 'Gross Profit / Unit',
    marginPercent: 'Gross Margin',
    markupPercent: 'Markup on Cost',
    totalRevenue: 'Total Batch Revenue',
    totalProfit: 'Total Batch Gross Profit',
    costShare: 'Cost Share',
    profitShare: 'Profit Share',
    chartTitle: 'Cost vs Profit Breakdown',
    faqTitle: 'Frequently Asked Questions: Profit Margin vs Markup',
  },
  he: {
    title: 'מחשבון שולי רווח ומארקאפ (Margin & Markup)',
    subtitle: 'חישוב רווח גולמי, שולי רווח (%), תוספת על עלות (Markup) ותמחור יעד',
    description: 'מחשבון שולי רווח ומארקאפ מדויק: גלה את שיעור הרווחיות מתוך המחיר או חשב מחיר מכירה מומלץ על פי שולי הרווח הרצויים ותרשים רווח ויזואלי.',
    modeCostRevenue: 'חישוב שולי רווח ממחיר מכירה',
    modeTargetMargin: 'חישוב מחיר מכירה לפי שולי רווח רצויים',
    cost: 'עלות המוצר / שירות (COGS)',
    costDesc: 'עלות ייצור, רכישה בסיטונאות או אספקה ישירה ליחידה',
    revenue: 'מחיר מכירה ללקוח',
    revenueDesc: 'המחיר הסופי שבו נמכרת היחידה',
    targetMargin: 'שולי רווח יעד מבוקשים (%)',
    targetMarginDesc: 'אחוז הרווח הגולמי שברצונך להשאיר מהמכירה (למשל 40%)',
    quantity: 'כמות יחידות / נפח מכירות',
    quantityDesc: 'כמות יחידות לחישוב מחזור כולל ורווחיות מצטברת',
    grossProfit: 'רווח גולמי ליחידה',
    marginPercent: 'שולי רווח (Margin)',
    markupPercent: 'מארקאפ על העלות (Markup)',
    totalRevenue: 'מחזור מכירות כולל',
    totalProfit: 'סך רווח גולמי מצטבר',
    costShare: 'חלק העלות',
    profitShare: 'חלק הרווח',
    chartTitle: 'התפלגות עלות מול רווח גולמי',
    faqTitle: 'שאלות ותשובות נפוצות: ההבדל בין Margin ל-Markup',
  },
  es: {
    title: 'Calculadora de Margen y Markup',
    subtitle: 'Calcula beneficio bruto, margen de beneficio (%) y precio objetivo',
    description: 'Calcula tu margen de beneficio y markup a partir del costo y precio de venta.',
    modeCostRevenue: 'Calcular Margen desde Precio',
    modeTargetMargin: 'Calcular Precio desde Margen',
    cost: 'Costo del Producto (COGS)',
    costDesc: 'Costo directo por unidad',
    revenue: 'Precio de Venta',
    revenueDesc: 'Precio de venta al cliente',
    targetMargin: 'Margen Objetivo (%)',
    targetMarginDesc: 'Porcentaje de margen deseado',
    quantity: 'Cantidad / Unidades',
    quantityDesc: 'Volumen de venta',
    grossProfit: 'Beneficio Bruto / Unidad',
    marginPercent: 'Margen de Beneficio',
    markupPercent: 'Markup sobre Costo',
    totalRevenue: 'Ingresos Totales',
    totalProfit: 'Beneficio Total',
    costShare: 'Costo',
    profitShare: 'Beneficio',
    chartTitle: 'Distribución de Costo vs Ganancia',
    faqTitle: 'Preguntas Frecuentes sobre Margen y Markup',
  },
  fr: {
    title: 'Calculateur de Marge et Taux de Marque',
    subtitle: 'Calculez marge brute (%), taux de marque, coefficient multiplicateur et prix de vente',
    description: 'Déterminez votre marge commerciale et votre taux de marque à partir du coût et du prix.',
    modeCostRevenue: 'Calculer la Marge',
    modeTargetMargin: 'Calculer le Prix selon la Marge',
    cost: 'Coût d\'Achat / Revient',
    costDesc: 'Coût unitaire direct',
    revenue: 'Prix de Vente HT',
    revenueDesc: 'Prix unitaire facturé',
    targetMargin: 'Taux de Marge Souhaité (%)',
    targetMarginDesc: 'Objectif de rentabilité',
    quantity: 'Volume de Ventes',
    quantityDesc: 'Quantité d\'unités vendues',
    grossProfit: 'Marge Brute / Unité',
    marginPercent: 'Taux de Marge',
    markupPercent: 'Taux de Marque',
    totalRevenue: 'Chiffre d\'Affaires Total',
    totalProfit: 'Marge Totale',
    costShare: 'Part du Coût',
    profitShare: 'Part du Bénéfice',
    chartTitle: 'Répartition Coût vs Bénéfice',
    faqTitle: 'Questions Fréquentes sur les Marges Commerciales',
  },
  ar: {
    title: 'حاسبة هامش الربح والزيادة (Margin & Markup)',
    subtitle: 'احسب إجمالي الربح، هامش الربح (%) ونسبة الزيادة على التكلفة بدقة',
    description: 'احسب هامش الربح ونسبة Markup من التكلفة وسعر البيع أو حدد سعر البيع المستهدف بناءً على الهامش المطلوب.',
    modeCostRevenue: 'حساب الهامش من سعر البيع',
    modeTargetMargin: 'حساب السعر من الهامش المستهدف',
    cost: 'تكلفة البضاعة المباعة',
    costDesc: 'تكلفة الشراء أو الإنتاج للوحدة',
    revenue: 'سعر البيع للعميل',
    revenueDesc: 'سعر بيع الوحدة للجمهور',
    targetMargin: 'هامش الربح المستهدف (%)',
    targetMarginDesc: 'نسبة الهامش المرجوة من سعر البيع',
    quantity: 'حجم المبيعات / الكمية',
    quantityDesc: 'عدد الوحدات لحساب الإجمالي',
    grossProfit: 'إجمالي الربح للوحدة',
    marginPercent: 'هامش الربح (Margin)',
    markupPercent: 'الزيادة على التكلفة (Markup)',
    totalRevenue: 'إجمالي الإيرادات',
    totalProfit: 'إجمالي الأرباح',
    costShare: 'نسبة التكلفة',
    profitShare: 'نسبة الربح',
    chartTitle: 'توزيع التكلفة مقابل الربح',
    faqTitle: 'الأسئلة الشائعة حول هامش الربح والـ Markup',
  }
};

export default function Margin() {
  const { lang, guides } = useI18n();
  const guide = guides['margin'] || { guideTitle: 'Guide & Formulas', guideDesc: 'Comprehensive calculation breakdown and FAQs.', faq: [] };
  const t = localDict[lang as keyof typeof localDict] || localDict.en;

  const [calcMode, setCalcMode] = useState<'cost-rev' | 'target-margin'>('cost-rev');

  const { state, updateState, saveToHistory, loadFromHistory, getHistory } = useCalculatorState('margin', {
    cost: 60,
    revenue: 150,
    targetMargin: 60,
    quantity: 100,
  });

  const { cost, revenue, targetMargin, quantity } = state;

  const setCost = (v: number) => updateState({ cost: v });
  const setRevenue = (v: number) => updateState({ revenue: v });
  const setTargetMargin = (v: number) => updateState({ targetMargin: v });
  const setQuantity = (v: number) => updateState({ quantity: v });

  const currencySymbol = lang === 'he' ? '₪' : (lang === 'fr' || lang === 'es' ? '€' : '$');

  const results = useMemo(() => {
    try {
      const decCost = new Decimal(cost || 0);
      const decQty = new Decimal(quantity || 1);

      let effectiveRevenue = new Decimal(revenue || 0);
      let grossProfit = new Decimal(0);
      let margin = new Decimal(0);
      let markup = new Decimal(0);

      if (calcMode === 'target-margin') {
        const decTgt = new Decimal(targetMargin || 0).div(100);
        if (decTgt.lt(1)) {
          // Price = Cost / (1 - Margin)
          effectiveRevenue = decCost.div(new Decimal(1).sub(decTgt));
        } else {
          effectiveRevenue = decCost;
        }
      }

      grossProfit = effectiveRevenue.sub(decCost);

      if (!effectiveRevenue.isZero()) {
        margin = grossProfit.div(effectiveRevenue).mul(100);
      }

      if (!decCost.isZero()) {
        markup = grossProfit.div(decCost).mul(100);
      }

      const totalRev = effectiveRevenue.mul(decQty);
      const totalProf = grossProfit.mul(decQty);

      return {
        unitRevenue: Math.round(effectiveRevenue.toNumber() * 100) / 100,
        grossProfit: Math.round(grossProfit.toNumber() * 100) / 100,
        marginPercent: Math.round(margin.toNumber() * 10) / 10,
        markupPercent: Math.round(markup.toNumber() * 10) / 10,
        totalRevenue: Math.round(totalRev.toNumber()),
        totalProfit: Math.round(totalProf.toNumber()),
      };
    } catch {
      return {
        unitRevenue: 0,
        grossProfit: 0,
        marginPercent: 0,
        markupPercent: 0,
        totalRevenue: 0,
        totalProfit: 0,
      };
    }
  }, [cost, revenue, targetMargin, quantity, calcMode]);

  const chartData = useMemo(() => {
    const costVal = Math.max(0, cost || 0);
    const profitVal = Math.max(0, results.grossProfit || 0);

    return {
      labels: [t.costShare, t.profitShare],
      datasets: [
        {
          data: [costVal, profitVal],
          backgroundColor: ['#94a3b8', '#10b981'],
          borderColor: ['#64748b', '#059669'],
          borderWidth: 2,
        },
      ],
    };
  }, [cost, results.grossProfit, t]);

  const deferredChartData = useDeferredValue(chartData);

  const presets = [
    {
      label: lang === 'he' ? 'קמעונאות ומסחר (מארקאפ 100% / שוליים 50%)' : 'Retail 100% Markup / 50% Margin',
      values: { cost: 50, revenue: 100, targetMargin: 50, quantity: 500 }
    },
    {
      label: lang === 'he' ? 'תוכנה ו-SaaS (שוליים גבוהים 85%)' : 'SaaS High Margin (85%)',
      values: { cost: 15, revenue: 100, targetMargin: 85, quantity: 1000 }
    },
    {
      label: lang === 'he' ? 'מסעדנות ומזון (שולי רווח 65%)' : 'Restaurant & Food (65% Margin)',
      values: { cost: 28, revenue: 80, targetMargin: 65, quantity: 800 }
    },
    {
      label: lang === 'he' ? 'סיטונאות וסחר כבד (שולי רווח 15%)' : 'Wholesale Low Margin (15%)',
      values: { cost: 170, revenue: 200, targetMargin: 15, quantity: 5000 }
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      <SEO
        title={t.title}
        description={t.description}
        keywords={['margin calculator', 'markup calculator', 'שולי רווח', 'מארקאפ', 'רווח גולמי', 'תמחור']}
      />

      <Breadcrumbs
        items={[
          { label: lang === 'he' ? 'עסקים ופיננסים' : 'Finance & Business', path: `/${lang}/category/finance` },
          { label: t.title },
        ]}
      />

      <ScenarioPresets
        presets={presets}
        onSelect={(val) => {
          if (val.cost !== undefined) setCost(val.cost);
          if (val.revenue !== undefined) setRevenue(val.revenue);
          if (val.targetMargin !== undefined) setTargetMargin(val.targetMargin);
          if (val.quantity !== undefined) setQuantity(val.quantity);
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Card */}
        <div className="lg:col-span-7 bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3.5 pb-4 border-b border-stone-100 dark:border-stone-800">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
              <Percent className="w-6 h-6" />
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

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 p-1 bg-stone-100 dark:bg-stone-800 rounded-2xl">
            <button
              type="button"
              onClick={() => setCalcMode('cost-rev')}
              className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                calcMode === 'cost-rev'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              {t.modeCostRevenue}
            </button>
            <button
              type="button"
              onClick={() => setCalcMode('target-margin')}
              className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                calcMode === 'target-margin'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              {t.modeTargetMargin}
            </button>
          </div>

          <div className="space-y-5">
            {/* Cost of Goods Sold */}
            <div>
              <label htmlFor="mg-cost" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                {t.cost} ({currencySymbol})
              </label>
              <input
                id="mg-cost"
                type="number"
                min="0"
                value={cost}
                onChange={(e) => setCost(Math.max(0, Number(e.target.value)))}
                className="w-full bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-3.5 text-xl font-bold text-stone-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{t.costDesc}</p>
            </div>

            {/* Revenue or Target Margin based on Mode */}
            {calcMode === 'cost-rev' ? (
              <div>
                <label htmlFor="mg-rev" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  {t.revenue} ({currencySymbol})
                </label>
                <input
                  id="mg-rev"
                  type="number"
                  min="0"
                  value={revenue}
                  onChange={(e) => setRevenue(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-3.5 text-xl font-bold text-stone-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{t.revenueDesc}</p>
              </div>
            ) : (
              <div>
                <label htmlFor="mg-tgt" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  {t.targetMargin}
                </label>
                <input
                  id="mg-tgt"
                  type="number"
                  min="0"
                  max="99.9"
                  step="0.5"
                  value={targetMargin}
                  onChange={(e) => setTargetMargin(Math.min(99.9, Math.max(0, Number(e.target.value))))}
                  className="w-full bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-3.5 text-xl font-bold text-stone-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{t.targetMarginDesc}</p>
              </div>
            )}

            {/* Sales Volume */}
            <div>
              <label htmlFor="mg-qty" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                {t.quantity}
              </label>
              <input
                id="mg-qty"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-3.5 text-xl font-bold text-stone-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{t.quantityDesc}</p>
            </div>
          </div>

          <ShareActions
            calculatorTitle={t.title}
            calculatorPath="/calculators/margin"
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
                <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
                  {t.marginPercent}
                </span>
                <ShinyText text="PROFIT MARGIN" speed={3} className="text-[10px] text-emerald-400 font-mono" />
              </div>
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-white flex items-baseline gap-2" dir="ltr">
                <CountUp to={results.marginPercent} suffix="%" duration={0.6} />
              </div>
              <p className="text-xs text-stone-400 mt-2">
                {calcMode === 'target-margin'
                  ? `${lang === 'he' ? 'מחיר מכירה מומלץ ליחידה:' : 'Required Selling Price:'} ${currencySymbol}${results.unitRevenue}`
                  : `${lang === 'he' ? 'רווח גולמי ליחידה:' : 'Gross Profit per unit:'} ${currencySymbol}${results.grossProfit}`}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1">
                  {t.markupPercent}
                </span>
                <div className="text-lg sm:text-xl font-bold text-blue-400" dir="ltr">
                  <CountUp to={results.markupPercent} suffix="%" duration={0.6} />
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1">
                  {t.grossProfit}
                </span>
                <div className="text-lg sm:text-xl font-bold text-emerald-400" dir="ltr">
                  <CountUp to={results.grossProfit} prefix={`${currencySymbol} `} duration={0.6} />
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1">
                  {t.totalRevenue}
                </span>
                <div className="text-lg sm:text-xl font-bold text-stone-200" dir="ltr">
                  <CountUp to={results.totalRevenue} prefix={`${currencySymbol} `} duration={0.6} />
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1">
                  {t.totalProfit}
                </span>
                <div className="text-lg sm:text-xl font-bold text-emerald-400" dir="ltr">
                  <CountUp to={results.totalProfit} prefix={`${currencySymbol} `} duration={0.6} />
                </div>
              </div>
            </div>

            {/* Visual Donut Chart */}
            <div className="w-full h-[180px] bg-white/5 p-3 rounded-2xl border border-white/10 flex items-center justify-center" dir="ltr">
              <Doughnut
                data={deferredChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'bottom', labels: { color: '#e2e8f0', font: { size: 10 } } },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <DisclaimerNotice type="financial" />

      <CalculatorGuide guideKey="margin" category="finance" />

      <FAQ items={guide.faq} />

      <RelatedCalculators currentId="margin" />
    </div>
  );
}
