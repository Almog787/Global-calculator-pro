import React, { useDeferredValue, useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
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
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

const localDict = {
  en: {
    title: 'ROI (Return on Investment) Calculator',
    subtitle: 'Calculate Total Return, Annualized ROI (CAGR) & Net Capital Multiplier',
    description: 'Calculate your exact return on investment (ROI) and annualized growth rate (CAGR). Compare real estate, stocks, venture capital, and business investments.',
    amountInvested: 'Initial Capital Invested',
    amountInvestedDesc: 'Total cost of investment at start',
    amountReturned: 'Total Amount Returned / Final Value',
    amountReturnedDesc: 'Total liquidation value, sale price, or current portfolio balance',
    investmentLength: 'Investment Duration (Years)',
    investmentLengthDesc: 'Length of holding period in years',
    roi: 'Total Return on Investment (ROI)',
    annualizedRoi: 'Annualized ROI (CAGR %)',
    investmentGain: 'Net Investment Profit',
    multiple: 'Capital Multiplier',
    chartTitle: 'Invested Capital vs Net Gain',
    chartInvested: 'Initial Principal',
    chartGain: 'Net Capital Gain',
    faqTitle: 'Frequently Asked Questions: ROI & Annualized Returns',
  },
  he: {
    title: 'מחשבון תשואת השקעה (ROI)',
    subtitle: 'חישוב תשואה כוללת, תשואה שנתית ממוצעת (CAGR) ומכפיל הון',
    description: 'מחשבון ROI מדויק: גלה את אחוז הרווח על ההשקעה, התשואה השנתית המשוקללת (CAGR), רווח נקי ומכפיל הון להשקעות נדל"ן, שוק ההון, עסקים וסטארטאפים.',
    amountInvested: 'סכום השקעה התחלתי',
    amountInvestedDesc: 'סך ההון העצמי שהושקע בנכס או במיזם בתחילת הדרך',
    amountReturned: 'סכום סופי שהתקבל / שווי נוכחי',
    amountReturnedDesc: 'סך המזומנים לאחר מכירה, דיבידנדים או שווי שוק עדכני',
    investmentLength: 'תקופת השקעה (בשנים)',
    investmentLengthDesc: 'משך תקופת ההחזקה בשנים (למשל 3 או 5 שנים)',
    roi: 'תשואה כוללת (ROI %)',
    annualizedRoi: 'תשואה שנתית ממוצעת (CAGR %)',
    investmentGain: 'רווח הון נקי',
    multiple: 'מכפיל הון (Multiple)',
    chartTitle: 'השוואת הון מושקע מול רווח נקי',
    chartInvested: 'קרן מושקעת',
    chartGain: 'רווח הון נקי',
    faqTitle: 'שאלות ותשובות נפוצות: חישוב ROI ותשואה שנתית',
  },
  es: {
    title: 'Calculadora de ROI (Retorno de Inversión)',
    subtitle: 'Calcula retorno total, ROI anualizado (CAGR) y múltiplo de capital',
    description: 'Calcula tu retorno de inversión (ROI) y tasa anualizada en inmuebles, bolsa y negocios.',
    amountInvested: 'Capital Invertido Inicial',
    amountInvestedDesc: 'Costo total de entrada',
    amountReturned: 'Valor Final / Retornado',
    amountReturnedDesc: 'Valor de salida o liquidación',
    investmentLength: 'Duración (Años)',
    investmentLengthDesc: 'Años de tenencia',
    roi: 'ROI Total (%)',
    annualizedRoi: 'ROI Anualizado (CAGR %)',
    investmentGain: 'Ganancia Neta',
    multiple: 'Múltiplo de Capital',
    chartTitle: 'Capital Invertido vs Ganancia',
    chartInvested: 'Principal',
    chartGain: 'Ganancia Neta',
    faqTitle: 'Preguntas Frecuentes sobre ROI',
  },
  fr: {
    title: 'Calculateur de ROI (Retour sur Investissement)',
    subtitle: 'Calculez rentabilité totale, taux de rendement annualisé (CAGR) et multiple',
    description: 'Mesurez la performance de vos investissements financiers, immobiliers ou d\'entreprise.',
    amountInvested: 'Capital Initial Investi',
    amountInvestedDesc: 'Montant injecté',
    amountReturned: 'Valeur Finale / Récupérée',
    amountReturnedDesc: 'Montant de sortie ou revente',
    investmentLength: 'Durée (Années)',
    investmentLengthDesc: 'Horizon en années',
    roi: 'ROI Total (%)',
    annualizedRoi: 'ROI Annualisé (CAGR %)',
    investmentGain: 'Plus-Value Nette',
    multiple: 'Multiple de Capital',
    chartTitle: 'Capital Investi vs Plus-Value',
    chartInvested: 'Capital Initial',
    chartGain: 'Plus-Value',
    faqTitle: 'Questions Fréquentes sur le ROI',
  },
  ar: {
    title: 'حاسبة العائد على الاستثمار (ROI)',
    subtitle: 'احسب العائد الإجمالي، العائد السنوي المركب (CAGR) ومضاعف رأس المال',
    description: 'احسب العائد على استثمارك العقاري أو التجاري أو في الأسهم مع حساب النسبة السنوية وصافي الأرباح.',
    amountInvested: 'المبلغ المستثمر مبدئياً',
    amountInvestedDesc: 'رأس المال المبدئي',
    amountReturned: 'المبلغ المسترد / القيمة النهائية',
    amountReturnedDesc: 'إجمالي القيمة بعد التخارج أو الأرباح',
    investmentLength: 'مدة الاستثمار (بالسنوات)',
    investmentLengthDesc: 'عدد سنوات الاحتفاظ بالاستثمار',
    roi: 'العائد الإجمالي (ROI %)',
    annualizedRoi: 'العائد السنوي المركب (CAGR %)',
    investmentGain: 'صافي ربح الاستثمار',
    multiple: 'مضاعف رأس المال',
    chartTitle: 'رأس المال المستثمر مقابل صافي الربح',
    chartInvested: 'رأس المال الأصلي',
    chartGain: 'صافي الأرباح',
    faqTitle: 'الأسئلة الشائعة حول العائد على الاستثمار',
  }
};

export default function Roi() {
  const { lang, guides } = useI18n();
  const guide = guides['roi'] || { guideTitle: 'Guide & Formulas', guideDesc: 'Comprehensive calculation breakdown and FAQs.', faq: [] };
  const t = localDict[lang as keyof typeof localDict] || localDict.en;

  const { state, updateState, saveToHistory, loadFromHistory, getHistory } = useCalculatorState('roi', {
    amountInvested: 50000,
    amountReturned: 85000,
    investmentLength: 3,
  });

  const { amountInvested, amountReturned, investmentLength } = state;

  const setAmountInvested = (v: number) => updateState({ amountInvested: v });
  const setAmountReturned = (v: number) => updateState({ amountReturned: v });
  const setInvestmentLength = (v: number) => updateState({ investmentLength: v });

  const currencySymbol = lang === 'he' ? '₪' : (lang === 'fr' || lang === 'es' ? '€' : '$');

  const results = useMemo(() => {
    try {
      const decInv = new Decimal(amountInvested || 0);
      const decRet = new Decimal(amountReturned || 0);
      const n = Math.max(0.1, investmentLength || 1);

      const gain = decRet.sub(decInv);
      let roi = new Decimal(0);
      let cagr = new Decimal(0);
      let multiple = new Decimal(0);

      if (!decInv.isZero()) {
        roi = gain.div(decInv).mul(100);
        multiple = decRet.div(decInv);

        if (decRet.isPositive() && !decRet.isZero()) {
          // CAGR = (End / Start) ^ (1/n) - 1
          const ratio = decRet.div(decInv).toNumber();
          if (ratio > 0) {
            cagr = new Decimal(Math.pow(ratio, 1 / n) - 1).mul(100);
          }
        }
      }

      return {
        gain: Math.round(gain.toNumber()),
        roi: Math.round(roi.toNumber() * 10) / 10,
        cagr: Math.round(cagr.toNumber() * 10) / 10,
        multiple: Math.round(multiple.toNumber() * 100) / 100,
      };
    } catch {
      return {
        gain: 0,
        roi: 0,
        cagr: 0,
        multiple: 0,
      };
    }
  }, [amountInvested, amountReturned, investmentLength]);

  const chartData = useMemo(() => {
    const invVal = Math.max(0, amountInvested || 0);
    const gainVal = Math.max(0, results.gain || 0);

    return {
      labels: [t.chartInvested, t.chartGain],
      datasets: [
        {
          label: 'Capital Allocation',
          data: [invVal, gainVal],
          backgroundColor: ['#3b82f6', '#10b981'],
          borderRadius: 12,
        },
      ],
    };
  }, [amountInvested, results.gain, t]);

  const deferredChartData = useDeferredValue(chartData);

  const presets = [
    {
      label: lang === 'he' ? 'מדד S&P 500 (10% שנתי ל-5 שנים)' : 'S&P 500 Index (5 Yrs Growth)',
      values: { amountInvested: 100000, amountReturned: 161000, investmentLength: 5 }
    },
    {
      label: lang === 'he' ? 'השבחת נדל"ן / אקזיט (שנתיים)' : 'Real Estate Flip (2 Yrs)',
      values: { amountInvested: 500000, amountReturned: 680000, investmentLength: 2 }
    },
    {
      label: lang === 'he' ? 'השקעת סיד בסטארטאפ (מכפיל 5x)' : 'Startup Angel Seed (5x in 6 Yrs)',
      values: { amountInvested: 25000, amountReturned: 125000, investmentLength: 6 }
    },
    {
      label: lang === 'he' ? 'תיק אג"ח סולידי (4% ל-3 שנים)' : 'Conservative Bond (3 Yrs at 4%)',
      values: { amountInvested: 200000, amountReturned: 225000, investmentLength: 3 }
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      <SEO
        title={t.title}
        description={t.description}
        keywords={['roi calculator', 'return on investment', 'תשואת השקעה', 'מחשבון ROI', 'CAGR']}
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
          if (val.amountInvested !== undefined) setAmountInvested(val.amountInvested);
          if (val.amountReturned !== undefined) setAmountReturned(val.amountReturned);
          if (val.investmentLength !== undefined) setInvestmentLength(val.investmentLength);
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Card */}
        <div className="lg:col-span-7 bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3.5 pb-4 border-b border-stone-100 dark:border-stone-800">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <TrendingUp className="w-6 h-6" />
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
            {/* Amount Invested */}
            <div>
              <label htmlFor="roi-inv" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                {t.amountInvested} ({currencySymbol})
              </label>
              <input
                id="roi-inv"
                type="number"
                min="1"
                value={amountInvested}
                onChange={(e) => setAmountInvested(Math.max(1, Number(e.target.value)))}
                className="w-full bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-3.5 text-xl font-bold text-stone-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{t.amountInvestedDesc}</p>
            </div>

            {/* Amount Returned */}
            <div>
              <label htmlFor="roi-ret" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                {t.amountReturned} ({currencySymbol})
              </label>
              <input
                id="roi-ret"
                type="number"
                min="0"
                value={amountReturned}
                onChange={(e) => setAmountReturned(Math.max(0, Number(e.target.value)))}
                className="w-full bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-3.5 text-xl font-bold text-stone-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{t.amountReturnedDesc}</p>
            </div>

            {/* Duration (Years) */}
            <div>
              <label htmlFor="roi-len" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                {t.investmentLength}
              </label>
              <input
                id="roi-len"
                type="number"
                min="0.1"
                step="0.5"
                value={investmentLength}
                onChange={(e) => setInvestmentLength(Math.max(0.1, Number(e.target.value)))}
                className="w-full bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-3.5 text-xl font-bold text-stone-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{t.investmentLengthDesc}</p>
            </div>
          </div>

          <ShareActions
            calculatorTitle={t.title}
            calculatorPath="/calculators/roi"
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
                  {t.roi}
                </span>
                <ShinyText text="NET RETURN" speed={3} className="text-[10px] text-emerald-400 font-mono" />
              </div>
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-white flex items-baseline gap-2" dir="ltr">
                <CountUp to={results.roi} suffix="%" duration={0.6} />
              </div>
              <p className="text-xs text-stone-400 mt-2">
                {lang === 'he'
                  ? `רווח נקי של ${results.gain.toLocaleString()} ₪ לאורך ${investmentLength} שנים (מכפיל ${results.multiple}x על הקרן).`
                  : `Net profit of ${currencySymbol}${results.gain.toLocaleString()} over ${investmentLength} years (${results.multiple}x capital multiple).`}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1">
                  {t.annualizedRoi}
                </span>
                <div className="text-lg sm:text-xl font-bold text-blue-400" dir="ltr">
                  <CountUp to={results.cagr} suffix="%" duration={0.6} />
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1">
                  {t.multiple}
                </span>
                <div className="text-lg sm:text-xl font-bold text-amber-400" dir="ltr">
                  <CountUp to={results.multiple} suffix="x" duration={0.6} />
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 col-span-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1">
                  {t.investmentGain}
                </span>
                <div className="text-xl sm:text-2xl font-bold text-emerald-400" dir="ltr">
                  <CountUp to={results.gain} prefix={`${currencySymbol} `} duration={0.6} />
                </div>
              </div>
            </div>

            {/* Visual Bar Chart */}
            <div className="w-full h-[180px] bg-white/5 p-3 rounded-2xl border border-white/10" dir="ltr">
              <Bar
                data={deferredChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { ticks: { color: '#94a3b8', font: { size: 10 } }, grid: { display: false } },
                    y: { ticks: { color: '#94a3b8', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <DisclaimerNotice type="financial" />

      <CalculatorGuide guideKey="roi" category="finance" />

      <FAQ items={guide.faq} />

      <RelatedCalculators currentId="roi" />
    </div>
  );
}
