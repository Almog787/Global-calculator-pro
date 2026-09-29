import React, { useDeferredValue, useMemo, useState } from 'react';
import { CreditCard, AlertTriangle, Zap } from 'lucide-react';
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
    title: 'Credit Card Payoff Calculator',
    subtitle: 'Find How Fast You Can Eliminate Credit Card Debt & Minimize Compound Interest',
    description: 'Calculate your exact credit card payoff timeline, total interest charges, and see how extra monthly payments can save thousands of dollars.',
    modeFixedPayment: 'Fixed Monthly Payment',
    modeTargetMonths: 'Target Payoff Time (Months)',
    balance: 'Current Card Balance',
    balanceDesc: 'Total outstanding credit card balance',
    rate: 'Interest Rate (APR %)',
    rateDesc: 'Annual percentage rate charged by your credit card issuer',
    payment: 'Monthly Payment',
    paymentDesc: 'Amount you can pay each month toward this card',
    targetMonths: 'Desired Payoff Timeline (Months)',
    targetMonthsDesc: 'Number of months in which you want to be completely debt-free',
    extraPaymentOption: 'Accelerated Payoff (+ Extra $50/mo)',
    timeToPayoff: 'Time to Debt-Free',
    totalInterest: 'Total Interest Paid',
    totalPayment: 'Total Amount Repaid',
    monthlyRequired: 'Required Monthly Payment',
    interestSavingsWithExtra: 'Potential Interest Savings',
    warningPaymentTooLow: 'Monthly payment is too low to cover monthly interest. Balance will continue growing indefinitely.',
    chartTitle: 'Remaining Balance & Interest Over Time',
    chartBalance: 'Remaining Balance',
    chartInterestPaid: 'Cumulative Interest Paid',
    faqTitle: 'Frequently Asked Questions: Credit Card Debt Payoff',
  },
  he: {
    title: 'מחשבון סילוק חובות כרטיסי אשראי',
    subtitle: 'חישוב מדויק של זמן סגירת המינוס וההלוואות וחיסכון בריבית מצטברת',
    description: 'מחשבון סילוק חובות אשראי: גלה תוך כמה חודשים תסגור את החוב, כמה ריבית תשלם לבנק, וכמה כסף תחסוך בעזרת הגדלת ההחזר החודשי.',
    modeFixedPayment: 'החזר חודשי קבוע',
    modeTargetMonths: 'יעד חודשים לסגירת החוב',
    balance: 'יתרת חוב בכרטיס האשראי',
    balanceDesc: 'סך יתרת החוב או מסגרת האשראי המנוצלת',
    rate: 'ריבית שנתית (APR %)',
    rateDesc: 'אחוז הריבית השנתי שהבנק או חברת האשראי גובים (לרוב 12%-24%)',
    payment: 'תשלום חודשי',
    paymentDesc: 'הסכום שבאפשרותך לשלם מדי חודש לכיסוי החוב',
    targetMonths: 'יעד חודשים לסילוק מלא',
    targetMonthsDesc: 'תוך כמה חודשים תרצה להגיע ליתרה אפסית',
    extraPaymentOption: 'החזר מואץ (תוספת 200 ₪ לחודש)',
    timeToPayoff: 'זמן לסגירת החוב במלואו',
    totalInterest: 'סך ריבית שתשולם',
    totalPayment: 'סך כל התשלומים',
    monthlyRequired: 'החזר חודשי נדרש ליעד',
    interestSavingsWithExtra: 'חיסכון אפשרי בריבית',
    warningPaymentTooLow: 'התשלום החודשי נמוך מהריבית החודשית המצטברת. החוב רק ילך ויגדל.',
    chartTitle: 'ירידת יתרת החוב וצבירת הריבית לאורך זמן',
    chartBalance: 'יתרת חוב שנותרה',
    chartInterestPaid: 'ריבית מצטברת ששולמה',
    faqTitle: 'שאלות ותשובות נפוצות: סילוק חובות כרטיסי אשראי',
  },
  es: {
    title: 'Calculadora de Liquidación de Tarjetas de Crédito',
    subtitle: 'Calcula cuánto tiempo tardarás en pagar tus tarjetas y ahorra en intereses',
    description: 'Calcula el tiempo exacto para liquidar tu tarjeta de crédito, los intereses totales y el ahorro con pagos adicionales.',
    modeFixedPayment: 'Pago Mensual Fijo',
    modeTargetMonths: 'Meses Objetivo',
    balance: 'Saldo Actual',
    balanceDesc: 'Deuda total de la tarjeta',
    rate: 'Tasa de Interés (APR %)',
    rateDesc: 'Tasa de interés anual de la tarjeta',
    payment: 'Pago Mensual',
    paymentDesc: 'Monto que puedes pagar al mes',
    targetMonths: 'Meses Deseados',
    targetMonthsDesc: 'Tiempo objetivo para quedar libre de deuda',
    extraPaymentOption: 'Pago Acelerado (+50€/mes)',
    timeToPayoff: 'Tiempo para Liquidar',
    totalInterest: 'Interés Total',
    totalPayment: 'Total Pagado',
    monthlyRequired: 'Pago Mensual Requerido',
    interestSavingsWithExtra: 'Ahorro Potencial de Interés',
    warningPaymentTooLow: 'El pago mensual es inferior a los intereses generados.',
    chartTitle: 'Saldo Restante vs Interés Acumulado',
    chartBalance: 'Saldo Restante',
    chartInterestPaid: 'Interés Acumulado',
    faqTitle: 'Preguntas Frecuentes sobre Tarjetas de Crédito',
  },
  fr: {
    title: 'Calculateur de Remboursement de Carte de Crédit',
    subtitle: 'Éliminez vos dettes de carte de crédit et réduisez les intérêts composés',
    description: 'Calculez le calendrier de remboursement de vos cartes de crédit et les économies d\'intérêts.',
    modeFixedPayment: 'Mensualité Fixe',
    modeTargetMonths: 'Délai Cible (Mois)',
    balance: 'Solde Débiteur Actuel',
    balanceDesc: 'Montant total de la dette',
    rate: 'Taux Annuel Effectif Global (TAEG %)',
    rateDesc: 'Taux d\'intérêt annuel appliqué',
    payment: 'Mensualité Prévue',
    paymentDesc: 'Montant payé chaque mois',
    targetMonths: 'Nombre de Mois Cible',
    targetMonthsDesc: 'Durée souhaitée pour solder la dette',
    extraPaymentOption: 'Paiement Accéléré (+50€/mois)',
    timeToPayoff: 'Délai de Remboursement',
    totalInterest: 'Intérêts Totaux',
    totalPayment: 'Montant Total Remboursé',
    monthlyRequired: 'Mensualité Requise',
    interestSavingsWithExtra: 'Économie d\'Intérêts Potentielle',
    warningPaymentTooLow: 'Le paiement est inférieur aux intérêts mensuels.',
    chartTitle: 'Évolution du Solde et Intérêts',
    chartBalance: 'Solde Restant',
    chartInterestPaid: 'Intérêts Cumulés',
    faqTitle: 'Questions Fréquentes sur les Cartes de Crédit',
  },
  ar: {
    title: 'حاسبة سداد البطاقات الائتمانية',
    subtitle: 'احسب الوقت اللازم للتخلص من ديون البطاقة الائتمانية وتقليل الفوائد',
    description: 'احسب الجدول الزمني لسداد بطاقتك الائتمانية وإجمالي الفوائد وكيف توفر المدفوعات الإضافية أموالك.',
    modeFixedPayment: 'دفعة شهرية ثابتة',
    modeTargetMonths: 'الهدف الزمني (بالأشهر)',
    balance: 'رصيد البطاقة المستحق',
    balanceDesc: 'إجمالي مبلغ الدين القائم',
    rate: 'نسبة الفائدة السنوية (APR %)',
    rateDesc: 'معدل الفائدة السنوي المفروض من البنك',
    payment: 'الدفعة الشهرية',
    paymentDesc: 'المبلغ المتاح شهرياً للسداد',
    targetMonths: 'عدد الأشهر المستهدفة',
    targetMonthsDesc: 'المدة المطلوبة لتصفير المديونية',
    extraPaymentOption: 'سداد سريع (+50 شهرياً)',
    timeToPayoff: 'الوقت حتى تصفير الدين',
    totalInterest: 'إجمالي الفوائد المدفوعة',
    totalPayment: 'إجمالي المبلغ المسدد',
    monthlyRequired: 'الدفعة الشهرية المطلوبة',
    interestSavingsWithExtra: 'توفير الفائدة المحتمل',
    warningPaymentTooLow: 'الدفعة الشهرية أقل من الفائدة المستحقة، وسينمو الدين بدلاً من أن ينخفض.',
    chartTitle: 'الرصيد المتبقي والفوائد التراكمية',
    chartBalance: 'الرصيد المتبقي',
    chartInterestPaid: 'الفوائد التراكمية',
    faqTitle: 'الأسئلة الشائعة حول سداد البطاقات الائتمانية',
  }
};

export default function CreditCardPayoff() {
  const { lang, guides } = useI18n();
  const guide = guides['credit-card-payoff'] || { guideTitle: 'Guide & Formulas', guideDesc: 'Comprehensive calculation breakdown and FAQs.', faq: [] };
  const t = localDict[lang as keyof typeof localDict] || localDict.en;

  const [mode, setMode] = useState<'fixed' | 'target'>('fixed');

  const { state, updateState, saveToHistory, loadFromHistory, getHistory } = useCalculatorState('credit-card-payoff', {
    balance: 15000,
    rate: 19.5,
    payment: 450,
    targetMonths: 24,
  });

  const { balance, rate, payment, targetMonths } = state;

  const setBalance = (v: number) => updateState({ balance: v });
  const setRate = (v: number) => updateState({ rate: v });
  const setPayment = (v: number) => updateState({ payment: v });
  const setTargetMonths = (v: number) => updateState({ targetMonths: v });

  const currencySymbol = lang === 'he' ? '₪' : (lang === 'fr' || lang === 'es' ? '€' : '$');

  const results = useMemo(() => {
    try {
      const decBal = new Decimal(balance || 0);
      const decRate = new Decimal(rate || 0).div(100).div(12);

      if (decBal.isZero()) {
        return {
          isValid: true,
          months: 0,
          totalInterest: 0,
          totalPayment: 0,
          requiredMonthly: 0,
          savingsWithExtra: 0,
          breakdown: [] as { month: number; balance: number; interest: number }[],
        };
      }

      if (mode === 'target') {
        const n = Math.max(1, targetMonths || 1);
        let reqMonthly = new Decimal(0);
        
        if (decRate.isZero()) {
          reqMonthly = decBal.div(n);
        } else {
          // PMT formula: P * r * (1+r)^n / ((1+r)^n - 1)
          const factor = decRate.add(1).pow(n);
          reqMonthly = decBal.mul(decRate).mul(factor).div(factor.sub(1));
        }

        const totalPaid = reqMonthly.mul(n);
        const totalInt = totalPaid.sub(decBal);

        return {
          isValid: true,
          months: n,
          totalInterest: Math.round(totalInt.toNumber()),
          totalPayment: Math.round(totalPaid.toNumber()),
          requiredMonthly: Math.round(reqMonthly.toNumber()),
          savingsWithExtra: 0,
          breakdown: [] as { month: number; balance: number; interest: number }[],
        };
      }

      // Fixed Monthly Payment mode
      const decPay = new Decimal(payment || 0);
      const monthlyInterest = decBal.mul(decRate);

      if (decPay.lte(monthlyInterest) && !decRate.isZero()) {
        return {
          isValid: false,
          months: Infinity,
          totalInterest: Infinity,
          totalPayment: Infinity,
          requiredMonthly: 0,
          savingsWithExtra: 0,
          breakdown: [] as { month: number; balance: number; interest: number }[],
        };
      }

      let curBal = decBal;
      let cumInt = new Decimal(0);
      let monthCount = 0;
      const breakdown: { month: number; balance: number; interest: number }[] = [];
      const maxIter = 600; // 50 years cap

      while (curBal.gt(0.01) && monthCount < maxIter) {
        monthCount++;
        const intForMonth = curBal.mul(decRate);
        cumInt = cumInt.add(intForMonth);
        const prinForMonth = Decimal.min(curBal, decPay.sub(intForMonth));
        curBal = curBal.sub(prinForMonth);

        if (monthCount % 3 === 0 || curBal.lte(0.01)) {
          breakdown.push({
            month: monthCount,
            balance: Math.round(curBal.toNumber()),
            interest: Math.round(cumInt.toNumber()),
          });
        }
      }

      // Calculate potential savings with extra payment
      const extraPay = decPay.add(lang === 'he' ? 200 : 50);
      let extraBal = decBal;
      let extraInt = new Decimal(0);
      let extraMonths = 0;
      while (extraBal.gt(0.01) && extraMonths < maxIter) {
        extraMonths++;
        const intForMonth = extraBal.mul(decRate);
        extraInt = extraInt.add(intForMonth);
        const prinForMonth = Decimal.min(extraBal, extraPay.sub(intForMonth));
        extraBal = extraBal.sub(prinForMonth);
      }
      const savingsWithExtra = Math.max(0, cumInt.sub(extraInt).toNumber());

      return {
        isValid: true,
        months: monthCount,
        totalInterest: Math.round(cumInt.toNumber()),
        totalPayment: Math.round(decBal.add(cumInt).toNumber()),
        requiredMonthly: payment,
        savingsWithExtra: Math.round(savingsWithExtra),
        breakdown,
      };
    } catch {
      return {
        isValid: false,
        months: 0,
        totalInterest: 0,
        totalPayment: 0,
        requiredMonthly: 0,
        savingsWithExtra: 0,
        breakdown: [],
      };
    }
  }, [balance, rate, payment, targetMonths, mode, lang]);

  const chartData = useMemo(() => {
    if (!results.breakdown || results.breakdown.length === 0) {
      return { labels: [], datasets: [] };
    }

    const labels = results.breakdown.map((b) => `${b.month}m`);
    const balanceData = results.breakdown.map((b) => b.balance);
    const interestData = results.breakdown.map((b) => b.interest);

    return {
      labels,
      datasets: [
        {
          label: t.chartBalance,
          data: balanceData,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: true,
          tension: 0.2,
          borderWidth: 2.5,
        },
        {
          label: t.chartInterestPaid,
          data: interestData,
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.05)',
          fill: false,
          tension: 0.2,
          borderWidth: 2,
        },
      ],
    };
  }, [results.breakdown, t]);

  const deferredChartData = useDeferredValue(chartData);

  const presets = [
    {
      label: lang === 'he' ? 'חוב ממוצע (15,000 ₪ ב-18.5%)' : 'Average Debt ($5,000 at 19.5%)',
      values: { balance: 15000, rate: 18.5, payment: 500, targetMonths: 36 }
    },
    {
      label: lang === 'he' ? 'סגירה מהירה תוך שנה' : '1-Year Payoff Target',
      values: { balance: 20000, rate: 16.0, payment: 1800, targetMonths: 12 }
    },
    {
      label: lang === 'he' ? 'הלוואת כרטיס בריבית נמוכה (9.5%)' : 'Low APR Promotion (9.5%)',
      values: { balance: 30000, rate: 9.5, payment: 900, targetMonths: 36 }
    },
    {
      label: lang === 'he' ? 'חוב כבד בריבית מקסימלית (22%)' : 'High APR Debt ($10,000 at 22%)',
      values: { balance: 40000, rate: 22.0, payment: 1200, targetMonths: 48 }
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      <SEO
        title={t.title}
        description={t.description}
        keywords={['credit card payoff calculator', 'credit card debt', 'סילוק חובות', 'מחשבון כרטיס אשראי', 'ריבית אשראי']}
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
          if (val.balance !== undefined) setBalance(val.balance);
          if (val.rate !== undefined) setRate(val.rate);
          if (val.payment !== undefined) setPayment(val.payment);
          if (val.targetMonths !== undefined) setTargetMonths(val.targetMonths);
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Card */}
        <div className="lg:col-span-7 bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3.5 pb-4 border-b border-stone-100 dark:border-stone-800">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-xs">
              <CreditCard className="w-6 h-6" />
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

          {/* Mode Selector */}
          <div className="grid grid-cols-2 p-1 bg-stone-100 dark:bg-stone-800 rounded-2xl">
            <button
              type="button"
              onClick={() => setMode('fixed')}
              className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                mode === 'fixed'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              {t.modeFixedPayment}
            </button>
            <button
              type="button"
              onClick={() => setMode('target')}
              className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                mode === 'target'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              {t.modeTargetMonths}
            </button>
          </div>

          <div className="space-y-5">
            {/* Balance */}
            <div>
              <label htmlFor="cc-balance" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                {t.balance} ({currencySymbol})
              </label>
              <input
                id="cc-balance"
                type="number"
                min="0"
                value={balance}
                onChange={(e) => setBalance(Math.max(0, Number(e.target.value)))}
                className="w-full bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-3.5 text-xl font-bold text-stone-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none transition-all"
              />
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{t.balanceDesc}</p>
            </div>

            {/* Interest Rate (APR) */}
            <div>
              <label htmlFor="cc-rate" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                {t.rate}
              </label>
              <input
                id="cc-rate"
                type="number"
                step="0.1"
                min="0"
                max="99"
                value={rate}
                onChange={(e) => setRate(Math.max(0, Number(e.target.value)))}
                className="w-full bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-3.5 text-xl font-bold text-stone-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none transition-all"
              />
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{t.rateDesc}</p>
            </div>

            {/* Dynamic Input Based on Mode */}
            {mode === 'fixed' ? (
              <div>
                <label htmlFor="cc-payment" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  {t.payment} ({currencySymbol})
                </label>
                <input
                  id="cc-payment"
                  type="number"
                  min="1"
                  value={payment}
                  onChange={(e) => setPayment(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-3.5 text-xl font-bold text-stone-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                />
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{t.paymentDesc}</p>
              </div>
            ) : (
              <div>
                <label htmlFor="cc-target" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  {t.targetMonths}
                </label>
                <input
                  id="cc-target"
                  type="number"
                  min="1"
                  max="120"
                  value={targetMonths}
                  onChange={(e) => setTargetMonths(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-3.5 text-xl font-bold text-stone-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                />
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{t.targetMonthsDesc}</p>
              </div>
            )}
          </div>

          <ShareActions
            calculatorTitle={t.title}
            calculatorPath="/calculators/credit-card-payoff"
            onSaveHistory={saveToHistory}
            historyEntries={getHistory()}
            onLoadHistory={loadFromHistory}
          />
        </div>

        {/* Right Sticky Dashboard */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          <div className="bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-800 text-white flex flex-col gap-6">
            {!results.isValid ? (
              <div className="p-6 bg-rose-950/60 border border-rose-800 rounded-2xl text-center space-y-2">
                <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto" />
                <p className="font-bold text-rose-300">{t.warningPaymentTooLow}</p>
              </div>
            ) : (
              <>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-rose-400">
                      {mode === 'fixed' ? t.timeToPayoff : t.monthlyRequired}
                    </span>
                    <ShinyText text="DEBT FREE" speed={3} className="text-[10px] text-emerald-400 font-mono" />
                  </div>
                  <div className="text-4xl sm:text-5xl font-black tracking-tight text-white flex items-baseline gap-2" dir="ltr">
                    {mode === 'fixed' ? (
                      <>
                        <CountUp to={results.months} duration={0.6} />
                        <span className="text-lg font-bold text-stone-400">
                          {lang === 'he' ? 'חודשים' : 'Months'} ({Math.round((results.months / 12) * 10) / 10} yrs)
                        </span>
                      </>
                    ) : (
                      <CountUp to={results.requiredMonthly} prefix={`${currencySymbol} `} duration={0.6} />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1">
                      {t.totalInterest}
                    </span>
                    <div className="text-lg sm:text-xl font-bold text-rose-400" dir="ltr">
                      <CountUp to={results.totalInterest} prefix={`${currencySymbol} `} duration={0.6} />
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1">
                      {t.totalPayment}
                    </span>
                    <div className="text-lg sm:text-xl font-bold text-stone-200" dir="ltr">
                      <CountUp to={results.totalPayment} prefix={`${currencySymbol} `} duration={0.6} />
                    </div>
                  </div>

                  {results.savingsWithExtra > 0 && mode === 'fixed' && (
                    <div className="p-4 bg-emerald-950/40 rounded-2xl border border-emerald-800 col-span-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-4 h-4 text-emerald-400" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                          {t.interestSavingsWithExtra}
                        </span>
                      </div>
                      <div className="text-lg sm:text-xl font-bold text-emerald-300" dir="ltr">
                        <CountUp to={results.savingsWithExtra} prefix={`${currencySymbol} `} duration={0.6} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Visual Line Chart */}
                {results.breakdown.length > 0 && (
                  <div className="w-full h-[200px] bg-white/5 p-3 rounded-2xl border border-white/10" dir="ltr">
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
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <DisclaimerNotice type="financial" />

      <CalculatorGuide guideKey="credit-card-payoff" category="finance" />

      <FAQ items={guide.faq} />

      <RelatedCalculators currentId="credit-card-payoff" />
    </div>
  );
}
