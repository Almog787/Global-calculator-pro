import React, { useDeferredValue, useMemo } from 'react';
import { TrendingDown } from 'lucide-react';
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
    title: 'Inflation & Purchasing Power Calculator',
    subtitle: 'Measure Real Purchasing Power Loss, Future Price Inflation & Cumulative Erosion',
    description: 'Calculate how inflation erodes your money’s buying power over time. Compare future costs, real value vs nominal value, and historical inflation curves.',
    initialAmount: 'Initial Capital / Current Cost',
    initialAmountDesc: 'Current cash or cost of a basket of goods today',
    inflationRate: 'Annual Inflation Rate (%)',
    inflationRateDesc: 'Expected average annual consumer price index (CPI) increase',
    years: 'Time Horizon (Years)',
    yearsDesc: 'Number of years into the future',
    investmentRate: 'Investment Return Rate (% / year)',
    investmentRateDesc: 'Optional: Compare with asset growth (e.g. S&P 500 at 8%)',
    purchasingPower: 'Future Purchasing Power',
    purchasingPowerDesc: 'What your money will effectively be worth in today’s dollars',
    futureCost: 'Future Equivalent Cost',
    futureCostDesc: 'How much money you will need to buy the exact same goods',
    lossPercent: 'Cumulative Loss in Buying Power',
    investedRealValue: 'Real Value If Invested',
    chartTitle: 'Purchasing Power Decay vs Future Inflated Cost',
    chartPurchasingPower: 'Purchasing Power (Real Value)',
    chartFutureCost: 'Inflated Basket Cost',
    chartInvested: 'Invested Capital (Real Adjusted)',
    faqTitle: 'Frequently Asked Questions: Inflation & Money Depreciation',
  },
  he: {
    title: 'מחשבון אינפלציה ושחיקת כוח קנייה',
    subtitle: 'חישוב שחיקת ערך הכסף, עליית מחירים עתידית וכוח קנייה ריאלי לאורך זמן',
    description: 'מחשבון אינפלציה מדויק: גלה כמה שווה הכסף שלך בעתיד, מה יהיה המחיר של סל מוצרים עם עליות מדד המחירים לצרכן, ותרשים שחיקה אינטראקטיבי.',
    initialAmount: 'סכום כסף נוכחי / עלות סל מוצרים',
    initialAmountDesc: 'סכום מזומן בעובר ושב או שווי קנייה של מוצרים כיום',
    inflationRate: 'אינפלציה שנתית צפויה (%)',
    inflationRateDesc: 'קצב עליית מדד המחירים לצרכן השנתי הממוצע',
    years: 'טווח זמן (שנים)',
    yearsDesc: 'מספר השנים קדימה',
    investmentRate: 'תשואת השקעה שנתית חלופית (%)',
    investmentRateDesc: 'אופציונלי: השוואה מול תיק השקעות (למשל S&P 500 ב-8%)',
    purchasingPower: 'כוח קנייה עתידי (ערך ריאלי)',
    purchasingPowerDesc: 'מה תוכל לקנות באותו הסכום במונחי כוח קנייה של היום',
    futureCost: 'עלות עתידית לסל זהה',
    futureCostDesc: 'כמה כסף תידרש לשלם בעתיד על אותם מוצרים בדיוק',
    lossPercent: 'שיעור שחיקת כוח הקנייה',
    investedRealValue: 'שווי ריאלי של כסף מושקע',
    chartTitle: 'שחיקת ערך הכסף מול עליית מחירי המוצרים',
    chartPurchasingPower: 'כוח קנייה ריאלי של מזומן',
    chartFutureCost: 'עלות עתידית של סל המוצרים',
    chartInvested: 'שווי ריאלי של השקעה',
    faqTitle: 'שאלות ותשובות נפוצות: אינפלציה ושחיקת ערך הכסף',
  },
  es: {
    title: 'Calculadora de Inflación y Poder Adquisitivo',
    subtitle: 'Mide la pérdida de valor de tu dinero y el costo futuro de bienes',
    description: 'Calcula cómo la inflación reduce tu poder adquisitivo y cuánto costarán tus bienes en el futuro.',
    initialAmount: 'Monto Inicial / Costo Actual',
    initialAmountDesc: 'Efectivo o costo actual de bienes',
    inflationRate: 'Tasa de Inflación Anual (%)',
    inflationRateDesc: 'Aumento promedio anual de precios',
    years: 'Horizonte Temporal (Años)',
    yearsDesc: 'Años hacia el futuro',
    investmentRate: 'Rendimiento de Inversión (%)',
    investmentRateDesc: 'Opcional: Comparar con inversión de activos',
    purchasingPower: 'Poder Adquisitivo Futuro',
    purchasingPowerDesc: 'Valor real en dinero de hoy',
    futureCost: 'Costo Futuro Equivalente',
    futureCostDesc: 'Monto necesario para comprar lo mismo',
    lossPercent: 'Pérdida de Poder de Compra',
    investedRealValue: 'Valor Real si se Invierte',
    chartTitle: 'Pérdida de Poder Adquisitivo vs Costo Futuro',
    chartPurchasingPower: 'Poder Adquisitivo',
    chartFutureCost: 'Costo Inflado',
    chartInvested: 'Capital Invertido (Ajustado)',
    faqTitle: 'Preguntas Frecuentes sobre Inflación',
  },
  fr: {
    title: 'Calculateur d\'Inflation et Pouvoir d\'Achat',
    subtitle: 'Mesurez l\'érosion monétaire et le coût futur de la vie',
    description: 'Calculez la perte de pouvoir d\'achat liée à l\'inflation au fil du temps.',
    initialAmount: 'Montant Initial / Coût Actuel',
    initialAmountDesc: 'Épargne actuelle ou panier d\'achats',
    inflationRate: 'Taux d\'Inflation Annuel (%)',
    inflationRateDesc: 'Hausse annuelle moyenne des prix',
    years: 'Horizon Temporel (Années)',
    yearsDesc: 'Nombre d\'années',
    investmentRate: 'Rendement d\'Investissement (%)',
    investmentRateDesc: 'Optionnel : Comparaison avec rendement financier',
    purchasingPower: 'Pouvoir d\'Achat Futur',
    purchasingPowerDesc: 'Valeur réelle en euros d\'aujourd\'hui',
    futureCost: 'Coût Futur Équivalent',
    futureCostDesc: 'Somme requise pour le même panier',
    lossPercent: 'Perte de Pouvoir d\'Achat',
    investedRealValue: 'Valeur Réelle si Investi',
    chartTitle: 'Érosion Monétaire vs Hausse des Prix',
    chartPurchasingPower: 'Pouvoir d\'Achat Réel',
    chartFutureCost: 'Coût Futur du Panier',
    chartInvested: 'Capital Investi (Réel)',
    faqTitle: 'Questions Fréquentes sur l\'Inflation',
  },
  ar: {
    title: 'حاسبة التضخم والقوة الشرائية',
    subtitle: 'احسب تآكل القيمة الحقيقية للأموال وارتفاع الأسعار المستقبلي',
    description: 'احسب تأثير التضخم على القوة الشرائية لأموالك مع مرور السنوات وقارن التكلفة المستقبلية.',
    initialAmount: 'المبلغ الحالي / تكلفة السلة',
    initialAmountDesc: 'النقد الحالي أو تكلفة سلة السلع اليوم',
    inflationRate: 'معدل التضخم السنوي (%)',
    inflationRateDesc: 'متوسط الزيادة السنوية في مؤشر الأسعار',
    years: 'المدى الزمني (بالسنوات)',
    yearsDesc: 'عدد السنوات المستقبلية',
    investmentRate: 'عائد الاستثمار السنوي (%)',
    investmentRateDesc: 'اختياري: مقارنة مع نمو استثماري بديل',
    purchasingPower: 'القوة الشرائية المستقبلية',
    purchasingPowerDesc: 'ما تشتريه أموالك بقيمة اليوم',
    futureCost: 'التكلفة المستقبلية المعادلة',
    futureCostDesc: 'المبلغ المطلوب لشراء نفس السلع لاحقاً',
    lossPercent: 'نسبة تآكل القوة الشرائية',
    investedRealValue: 'القيمة الحقيقية في حال الاستثمار',
    chartTitle: 'تآكل القوة الشرائية مقابل ارتفاع الأسعار',
    chartPurchasingPower: 'القوة الشرائية الحقيقية',
    chartFutureCost: 'تكلفة السلة المستقبلية',
    chartInvested: 'رأس المال المستثمر (المعدل)',
    faqTitle: 'الأسئلة الشائعة حول التضخم والقوة الشرائية',
  }
};

export default function Inflation() {
  const { lang, guides } = useI18n();
  const guide = guides['inflation'] || { guideTitle: 'Guide & Formulas', guideDesc: 'Comprehensive calculation breakdown and FAQs.', faq: [] };
  const t = localDict[lang as keyof typeof localDict] || localDict.en;

  const { state, updateState, saveToHistory, loadFromHistory, getHistory } = useCalculatorState('inflation', {
    amount: 100000,
    rate: 3.5,
    years: 15,
    investmentRate: 7.5,
  });

  const { amount, rate, years, investmentRate } = state;

  const setAmount = (v: number) => updateState({ amount: v });
  const setRate = (v: number) => updateState({ rate: v });
  const setYears = (v: number) => updateState({ years: v });
  const setInvestmentRate = (v: number) => updateState({ investmentRate: v });

  const currencySymbol = lang === 'he' ? '₪' : (lang === 'fr' || lang === 'es' ? '€' : '$');

  const results = useMemo(() => {
    try {
      const decAmount = new Decimal(amount || 0);
      const decRate = new Decimal(rate || 0).div(100);
      const decInv = new Decimal(investmentRate || 0).div(100);
      const n = years || 1;

      // Future Cost of same goods = P * (1 + r)^n
      const inflationMultiplier = decRate.add(1).pow(n);
      const futureCost = decAmount.mul(inflationMultiplier);

      // Purchasing Power of same nominal amount = P / (1 + r)^n
      const purchasingPower = inflationMultiplier.isZero() ? decAmount : decAmount.div(inflationMultiplier);

      // Loss percentage
      const lossAmount = decAmount.sub(purchasingPower);
      const lossPercent = decAmount.isZero() ? new Decimal(0) : lossAmount.div(decAmount).mul(100);

      // Real value if invested = P * (1 + inv)^n / (1 + r)^n
      const investedNominal = decAmount.mul(decInv.add(1).pow(n));
      const investedReal = inflationMultiplier.isZero() ? investedNominal : investedNominal.div(inflationMultiplier);

      return {
        futureCost: Math.round(futureCost.toNumber()),
        purchasingPower: Math.round(purchasingPower.toNumber()),
        lossPercent: Math.round(lossPercent.toNumber() * 10) / 10,
        investedRealValue: Math.round(investedReal.toNumber()),
      };
    } catch {
      return {
        futureCost: 0,
        purchasingPower: 0,
        lossPercent: 0,
        investedRealValue: 0,
      };
    }
  }, [amount, rate, years, investmentRate]);

  const chartData = useMemo(() => {
    const labels: string[] = [];
    const ppData: number[] = [];
    const fcData: number[] = [];
    const invData: number[] = [];

    const decAmount = new Decimal(amount || 0);
    const decRate = new Decimal(rate || 0).div(100);
    const decInv = new Decimal(investmentRate || 0).div(100);
    const totalYears = Math.min(Math.max(years, 1), 40);

    for (let y = 0; y <= totalYears; y++) {
      labels.push(y === 0 ? '0' : `${y}Y`);
      const infMult = decRate.add(1).pow(y);
      const pp = infMult.isZero() ? decAmount : decAmount.div(infMult);
      const fc = decAmount.mul(infMult);
      const invNom = decAmount.mul(decInv.add(1).pow(y));
      const invReal = infMult.isZero() ? invNom : invNom.div(infMult);

      ppData.push(Math.round(pp.toNumber()));
      fcData.push(Math.round(fc.toNumber()));
      invData.push(Math.round(invReal.toNumber()));
    }

    return {
      labels,
      datasets: [
        {
          label: t.chartPurchasingPower,
          data: ppData,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: true,
          tension: 0.3,
          borderWidth: 2.5,
        },
        {
          label: t.chartFutureCost,
          data: fcData,
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.05)',
          fill: false,
          tension: 0.3,
          borderWidth: 2.5,
        },
        {
          label: t.chartInvested,
          data: invData,
          borderColor: '#10b981',
          borderDash: [5, 5],
          fill: false,
          tension: 0.3,
          borderWidth: 2,
        },
      ],
    };
  }, [amount, rate, years, investmentRate, t]);

  const deferredChartData = useDeferredValue(chartData);

  const presets = [
    {
      label: lang === 'he' ? 'יעד בנק ישראל (2.5% ל-10 שנים)' : 'Central Bank Target (2.5% / 10 Yrs)',
      values: { amount: 100000, rate: 2.5, years: 10, investmentRate: 7 }
    },
    {
      label: lang === 'he' ? 'אינפלציה מתונה (4% ל-15 שנים)' : 'Moderate Inflation (4.0% / 15 Yrs)',
      values: { amount: 200000, rate: 4.0, years: 15, investmentRate: 8 }
    },
    {
      label: lang === 'he' ? 'שחיקת פנסיה ל-30 שנה (3% אינפלציה)' : '30-Year Retirement Horizon (3.0%)',
      values: { amount: 1000000, rate: 3.0, years: 30, investmentRate: 6.5 }
    },
    {
      label: lang === 'he' ? 'גל אינפלציוני גבוה (7% ל-5 שנים)' : 'High Inflation Surge (7.0% / 5 Yrs)',
      values: { amount: 50000, rate: 7.0, years: 5, investmentRate: 5 }
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      <SEO
        title={t.title}
        description={t.description}
        keywords={['inflation calculator', 'purchasing power', 'שחיקת כסף', 'מחשבון אינפלציה', 'מדד המחירים לצרכן']}
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
          if (val.amount !== undefined) setAmount(val.amount);
          if (val.rate !== undefined) setRate(val.rate);
          if (val.years !== undefined) setYears(val.years);
          if (val.investmentRate !== undefined) setInvestmentRate(val.investmentRate);
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Card */}
        <div className="lg:col-span-7 bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3.5 pb-4 border-b border-stone-100 dark:border-stone-800">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-xs">
              <TrendingDown className="w-6 h-6" />
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
            {/* Initial Amount */}
            <div>
              <label htmlFor="inf-amount" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                {t.initialAmount} ({currencySymbol})
              </label>
              <input
                id="inf-amount"
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                className="w-full bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-3.5 text-xl font-bold text-stone-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none transition-all"
              />
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{t.initialAmountDesc}</p>
            </div>

            {/* Inflation Rate & Years Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="inf-rate" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  {t.inflationRate}
                </label>
                <input
                  id="inf-rate"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={rate}
                  onChange={(e) => setRate(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-3.5 text-xl font-bold text-stone-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                />
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{t.inflationRateDesc}</p>
              </div>

              <div>
                <label htmlFor="inf-years" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  {t.years}
                </label>
                <input
                  id="inf-years"
                  type="number"
                  min="1"
                  max="60"
                  value={years}
                  onChange={(e) => setYears(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-3.5 text-xl font-bold text-stone-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                />
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{t.yearsDesc}</p>
              </div>
            </div>

            {/* Alternative Investment Return */}
            <div>
              <label htmlFor="inf-inv" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                {t.investmentRate}
              </label>
              <input
                id="inf-inv"
                type="number"
                step="0.1"
                min="0"
                value={investmentRate}
                onChange={(e) => setInvestmentRate(Math.max(0, Number(e.target.value)))}
                className="w-full bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-3.5 text-xl font-bold text-stone-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none transition-all"
              />
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{t.investmentRateDesc}</p>
            </div>
          </div>

          <ShareActions
            calculatorTitle={t.title}
            calculatorPath="/calculators/inflation"
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
                <span className="text-[11px] font-bold uppercase tracking-widest text-rose-400">
                  {t.purchasingPower}
                </span>
                <ShinyText text="REAL VALUE" speed={3} className="text-[10px] text-rose-400 font-mono" />
              </div>
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-white" dir="ltr">
                <CountUp to={results.purchasingPower} prefix={`${currencySymbol} `} duration={0.6} />
              </div>
              <p className="text-xs text-stone-400 mt-2">
                {lang === 'he'
                  ? `בעוד ${years} שנים, ${amount.toLocaleString()} ₪ יקנו מה ש-${results.purchasingPower.toLocaleString()} ₪ קונים היום.`
                  : `In ${years} years, ${currencySymbol}${amount.toLocaleString()} will only buy what ${currencySymbol}${results.purchasingPower.toLocaleString()} buys today.`}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1">
                  {t.futureCost}
                </span>
                <div className="text-lg sm:text-xl font-bold text-amber-400" dir="ltr">
                  <CountUp to={results.futureCost} prefix={`${currencySymbol} `} duration={0.6} />
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1">
                  {t.lossPercent}
                </span>
                <div className="text-lg sm:text-xl font-bold text-rose-400" dir="ltr">
                  <CountUp to={results.lossPercent} suffix="%" duration={0.6} />
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 col-span-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1">
                  {t.investedRealValue} ({investmentRate}%)
                </span>
                <div className="text-lg sm:text-xl font-bold text-emerald-400" dir="ltr">
                  <CountUp to={results.investedRealValue} prefix={`${currencySymbol} `} duration={0.6} />
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

      <CalculatorGuide guideKey="inflation" category="finance" />

      <FAQ items={guide.faq} />

      <RelatedCalculators currentId="inflation" />
    </div>
  );
}
