import React, { useDeferredValue, useMemo, useState } from 'react';
import { Layers, Plus, Trash2 } from 'lucide-react';
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
import { calculateDebtSnowball, DebtItem } from '../../lib/math/finance';
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
    title: 'Debt Snowball & Avalanche Calculator',
    subtitle: 'Accelerate Your Path to Debt Freedom by Rolling Payments into Smaller or Higher-Interest Debts',
    description: 'Compare Debt Snowball (lowest balance first) and Debt Avalanche (highest APR first). See how fast you become debt-free and calculate total interest savings.',
    strategySnowball: 'Debt Snowball (Smallest Balance First)',
    strategyAvalanche: 'Debt Avalanche (Highest Interest First)',
    debtsList: 'Your Debts & Loans',
    debtName: 'Debt Name / Account',
    balance: 'Current Balance',
    rate: 'Interest (APR %)',
    minPayment: 'Minimum Monthly Payment',
    extraPayment: 'Extra Monthly Payment',
    extraPaymentDesc: 'Additional monthly cash dedicated to paying down debt aggressively',
    snowballPayoff: 'Debt-Free Timeline',
    monthsSaved: 'Months Saved',
    interestSaved: 'Total Interest Saved',
    totalInterestPaid: 'Total Interest with Extra Payment',
    addDebt: '+ Add Another Debt',
    removeDebt: 'Remove',
    chartTitle: 'Interest Paid vs Interest Saved',
    chartInterestPaid: 'Interest Paid',
    chartInterestSaved: 'Interest Saved',
    faqTitle: 'Frequently Asked Questions: Debt Snowball vs Avalanche',
  },
  he: {
    title: 'מחשבון חיסול חובות: כדור שלג ומפולת (Snowball vs Avalanche)',
    subtitle: 'תכנון סילוק הלוואות ומינוסים, חיסכון בריבית והגעה לחופש כלכלי מהיר',
    description: 'מחשבון חיסול חובות מתקדם: השווה בין שיטת כדור השלג (סגירת החוב הקטן תחילה) לשיטת המפולת (סגירת הריבית הגבוהה תחילה) וגלה כמה חודשים וכסף תחסוך.',
    strategySnowball: 'שיטת כדור השלג (החוב הקטן ביותר תחילה)',
    strategyAvalanche: 'שיטת המפולת (הריבית הגבוהה ביותר תחילה)',
    debtsList: 'רשימת ההלוואות והחובות שלך',
    debtName: 'שם ההלוואה / כרטיס',
    balance: 'יתרת חוב',
    rate: 'ריבית (APR %)',
    minPayment: 'החזר חודשי מינימלי',
    extraPayment: 'החזר חודשי נוסף מואץ',
    extraPaymentDesc: 'סכום כסף נוסף שתוכל לפנות מדי חודש לטובת סגירת החובות במהירות',
    snowballPayoff: 'מועד סגירת כל החובות',
    monthsSaved: 'חודשים שנחסכו',
    interestSaved: 'סך ריבית שנחסכה',
    totalInterestPaid: 'סך ריבית שתשולם',
    addDebt: '+ הוסף הלוואה / חוב נוסף',
    removeDebt: 'מחק',
    chartTitle: 'השוואת ריבית ששולמה מול ריבית שנחסכה',
    chartInterestPaid: 'ריבית שתשולם',
    chartInterestSaved: 'ריבית שנחסכה',
    faqTitle: 'שאלות ותשובות נפוצות: שיטת כדור השלג מול שיטת המפולת',
  },
  es: {
    title: 'Calculadora Bola de Nieve y Avalancha de Deudas',
    subtitle: 'Acelera tu libertad financiera pagando deudas estratégicamente',
    description: 'Compara el método Bola de Nieve y Avalancha de Deudas para pagar tus préstamos más rápido.',
    strategySnowball: 'Bola de Nieve (Menor Saldo)',
    strategyAvalanche: 'Avalancha (Mayor Interés)',
    debtsList: 'Lista de Deudas',
    debtName: 'Nombre de la Deuda',
    balance: 'Saldo',
    rate: 'Tasa (APR %)',
    minPayment: 'Pago Mínimo',
    extraPayment: 'Pago Extra Mensual',
    extraPaymentDesc: 'Monto adicional para pagar deudas',
    snowballPayoff: 'Tiempo para Ser Libre de Deuda',
    monthsSaved: 'Meses Ahorrados',
    interestSaved: 'Intereses Ahorrados',
    totalInterestPaid: 'Interés Pagado',
    addDebt: '+ Agregar Deuda',
    removeDebt: 'Eliminar',
    chartTitle: 'Interés Pagado vs Ahorrado',
    chartInterestPaid: 'Interés Pagado',
    chartInterestSaved: 'Interés Ahorrado',
    faqTitle: 'Preguntas Frecuentes sobre Liquidación de Deudas',
  },
  fr: {
    title: 'Calculateur Boule de Neige et Avalanche de Dettes',
    subtitle: 'Remboursez vos crédits plus vite grâce aux stratégies d\'accélération',
    description: 'Comparez la méthode Boule de neige et Avalanche pour solder vos dettes.',
    strategySnowball: 'Boule de Neige (Plus Petit Solde)',
    strategyAvalanche: 'Avalanche (Plus Fort Taux)',
    debtsList: 'Liste des Crédits',
    debtName: 'Nom du Crédit',
    balance: 'Capital Restant Dû',
    rate: 'Taux (TAEG %)',
    minPayment: 'Mensualité Minimale',
    extraPayment: 'Remboursement Supplémentaire',
    extraPaymentDesc: 'Montant mensuel supplémentaire alloué',
    snowballPayoff: 'Délai Total de Remboursement',
    monthsSaved: 'Mois Gagnés',
    interestSaved: 'Intérêts Économisés',
    totalInterestPaid: 'Intérêts Payés',
    addDebt: '+ Ajouter un Crédit',
    removeDebt: 'Supprimer',
    chartTitle: 'Intérêts Payés vs Économisés',
    chartInterestPaid: 'Intérêts Payés',
    chartInterestSaved: 'Intérêts Économisés',
    faqTitle: 'Questions Fréquentes sur le Désendettement',
  },
  ar: {
    title: 'حاسبة كرة الثلج والانهيار الجليدي لسداد الديون',
    subtitle: 'تخلص من كافة الديون والقروض بأسرع وقت ووفر آلاف الدولارات من الفوائد',
    description: 'قارن بين استراتيجية كرة الثلج واستراتيجية الانهيار الجليدي لتسريع سداد الديون.',
    strategySnowball: 'كرة الثلج (الرصيد الأصغر أولاً)',
    strategyAvalanche: 'الانهيار الجليدي (الفائدة الأعلى أولاً)',
    debtsList: 'قائمة الديون والقروض',
    debtName: 'اسم الدين',
    balance: 'الرصيد المتبقي',
    rate: 'الفائدة السنوية (%)',
    minPayment: 'الحد الأدنى للدفع',
    extraPayment: 'دفعة شهرية إضافية',
    extraPaymentDesc: 'مبلغ إضافي يخصص لتسريع السداد',
    snowballPayoff: 'الوقت للتخلص من كافة الديون',
    monthsSaved: 'الأشهر الموفرة',
    interestSaved: 'الفوائد الموفرة',
    totalInterestPaid: 'إجمالي الفوائد المدفوعة',
    addDebt: '+ إضافة دين جديد',
    removeDebt: 'حذف',
    chartTitle: 'الفوائد المدفوعة مقابل الموفرة',
    chartInterestPaid: 'الفوائد المدفوعة',
    chartInterestSaved: 'الفوائد الموفرة',
    faqTitle: 'الأسئلة الشائعة حول استراتيجيات سداد الديون',
  }
};

export default function DebtSnowball() {
  const { lang, guides } = useI18n();
  const guide = guides['debt-snowball'] || { guideTitle: 'Guide & Formulas', guideDesc: 'Comprehensive calculation breakdown and FAQs.', faq: [] };
  const t = localDict[lang as keyof typeof localDict] || localDict.en;

  const [strategy, setStrategy] = useState<'snowball' | 'avalanche'>('snowball');
  const [debts, setDebts] = useState<DebtItem[]>([
    { id: 1, bal: 4500, rate: 21.5, min: 140 },
    { id: 2, bal: 12000, rate: 14.0, min: 300 },
    { id: 3, bal: 28000, rate: 7.5, min: 450 },
  ]);
  const [extraPayment, setExtraPayment] = useState<number>(400);

  const { saveToHistory, loadFromHistory, getHistory } = useCalculatorState('debt-snowball', {
    extraPayment: 400,
  });

  const currencySymbol = lang === 'he' ? '₪' : (lang === 'fr' || lang === 'es' ? '€' : '$');

  const updateDebt = (index: number, field: keyof Omit<DebtItem, 'id'>, value: number) => {
    const updated = [...debts];
    updated[index] = { ...updated[index], [field]: value };
    setDebts(updated);
  };

  const addDebt = () => {
    const newId = debts.length > 0 ? Math.max(...debts.map((d) => d.id)) + 1 : 1;
    setDebts([...debts, { id: newId, bal: 5000, rate: 12, min: 150 }]);
  };

  const removeDebt = (index: number) => {
    if (debts.length <= 1) return;
    setDebts(debts.filter((_, i) => i !== index));
  };

  const sortedDebts = useMemo(() => {
    const copy = [...debts];
    if (strategy === 'snowball') {
      return copy.sort((a, b) => a.bal - b.bal);
    }
    return copy.sort((a, b) => b.rate - a.rate);
  }, [debts, strategy]);

  const results = useMemo(() => {
    return calculateDebtSnowball(sortedDebts, extraPayment);
  }, [sortedDebts, extraPayment]);

  const interestSaved = Math.max(0, results.baseInterest - results.snowballInterest);
  const monthsSaved = results.baseMonths >= 1200 ? 0 : Math.max(0, results.baseMonths - results.snowballMonths);

  const formatMonths = (m: number) => {
    if (m >= 1200) return lang === 'he' ? '> 50 שנה' : '> 50 Years';
    const yrs = Math.floor(m / 12);
    const mos = m % 12;
    if (yrs === 0) return `${mos} ${lang === 'he' ? 'חודשים' : 'months'}`;
    return `${yrs} ${lang === 'he' ? 'שנים' : 'yrs'} ${mos > 0 ? `${mos}m` : ''}`;
  };

  const chartData = useMemo(() => {
    return {
      labels: [t.chartInterestPaid, t.chartInterestSaved],
      datasets: [
        {
          data: [results.snowballInterest, interestSaved],
          backgroundColor: ['#ef4444', '#10b981'],
          borderColor: ['#dc2626', '#059669'],
          borderWidth: 2,
        },
      ],
    };
  }, [results.snowballInterest, interestSaved, t]);

  const deferredChartData = useDeferredValue(chartData);

  const presets = [
    {
      label: lang === 'he' ? '3 הלוואות ממוצעות (כרטיס, רכב, אישית)' : '3 Common Debts (Card, Auto, Loan)',
      values: {
        extra: 500,
        presetDebts: [
          { id: 1, bal: 5000, rate: 22, min: 150 },
          { id: 2, bal: 15000, rate: 11, min: 320 },
          { id: 3, bal: 30000, rate: 6.5, min: 500 },
        ]
      }
    },
    {
      label: lang === 'he' ? 'סילוק מהיר של 2 כרטיסי אשראי' : 'Aggressive 2-Card Wipeout',
      values: {
        extra: 800,
        presetDebts: [
          { id: 1, bal: 3500, rate: 24, min: 120 },
          { id: 2, bal: 8000, rate: 19, min: 220 },
        ]
      }
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      <SEO
        title={t.title}
        description={t.description}
        keywords={['debt snowball calculator', 'debt avalanche', 'כדור שלג חובות', 'מחשבון סילוק חובות', 'חופש מחובות']}
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
          if (val.extra !== undefined) setExtraPayment(val.extra);
          if (val.presetDebts) setDebts(val.presetDebts);
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Card */}
        <div className="lg:col-span-7 bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3.5 pb-4 border-b border-stone-100 dark:border-stone-800">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
              <Layers className="w-6 h-6" />
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

          {/* Strategy Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 p-1 bg-stone-100 dark:bg-stone-800 rounded-2xl gap-1">
            <button
              type="button"
              onClick={() => setStrategy('snowball')}
              className={`py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                strategy === 'snowball'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              {t.strategySnowball}
            </button>
            <button
              type="button"
              onClick={() => setStrategy('avalanche')}
              className={`py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                strategy === 'avalanche'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              {t.strategyAvalanche}
            </button>
          </div>

          {/* Debts Table / Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                {t.debtsList} ({debts.length})
              </span>
              <button
                type="button"
                onClick={addDebt}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                {t.addDebt}
              </button>
            </div>

            {debts.map((debt, index) => (
              <div key={debt.id} className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 dark:text-white">
                    #{index + 1} {lang === 'he' ? `חוב / הלוואה` : `Debt Account`}
                  </span>
                  {debts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDebt(index)}
                      className="text-rose-500 hover:text-rose-700 p-1 rounded-lg transition-colors"
                      title={t.removeDebt}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                      {t.balance} ({currencySymbol})
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={debt.bal}
                      onChange={(e) => updateDebt(index, 'bal', Math.max(0, Number(e.target.value)))}
                      className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl p-2.5 font-bold text-stone-900 dark:text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                      {t.rate}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={debt.rate}
                      onChange={(e) => updateDebt(index, 'rate', Math.max(0, Number(e.target.value)))}
                      className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl p-2.5 font-bold text-stone-900 dark:text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                      {t.minPayment} ({currencySymbol})
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={debt.min}
                      onChange={(e) => updateDebt(index, 'min', Math.max(0, Number(e.target.value)))}
                      className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl p-2.5 font-bold text-stone-900 dark:text-white text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Extra Monthly Payment */}
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-1">
              <label htmlFor="ds-extra" className="block text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
                {t.extraPayment} ({currencySymbol})
              </label>
              <input
                id="ds-extra"
                type="number"
                min="0"
                value={extraPayment}
                onChange={(e) => setExtraPayment(Math.max(0, Number(e.target.value)))}
                className="w-full bg-white dark:bg-stone-900 border border-indigo-200 dark:border-indigo-800 rounded-xl p-3 text-xl font-black text-indigo-700 dark:text-indigo-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <p className="text-[11px] text-indigo-700/80 dark:text-indigo-400">{t.extraPaymentDesc}</p>
            </div>
          </div>

          <ShareActions
            calculatorTitle={t.title}
            calculatorPath="/calculators/debt-snowball"
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
                <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-400">
                  {t.snowballPayoff}
                </span>
                <ShinyText text="DEBT FREE" speed={3} className="text-[10px] text-emerald-400 font-mono" />
              </div>
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-white" dir="ltr">
                {formatMonths(results.snowballMonths)}
              </div>
              <p className="text-xs text-stone-400 mt-2">
                {lang === 'he'
                  ? `בעזרת שיטת ${strategy === 'snowball' ? 'כדור השלג' : 'המפולת'}, תסגור את החובות ${monthsSaved} חודשים מהר יותר!`
                  : `Using the ${strategy === 'snowball' ? 'Snowball' : 'Avalanche'} method, you become debt-free ${monthsSaved} months sooner!`}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1">
                  {t.monthsSaved}
                </span>
                <div className="text-lg sm:text-xl font-bold text-emerald-400" dir="ltr">
                  <CountUp to={monthsSaved} duration={0.6} />
                  <span className="text-xs font-bold text-stone-400 ms-1">{lang === 'he' ? 'חודשים' : 'mo'}</span>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1">
                  {t.interestSaved}
                </span>
                <div className="text-lg sm:text-xl font-bold text-emerald-400" dir="ltr">
                  <CountUp to={interestSaved} prefix={`${currencySymbol} `} duration={0.6} />
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 col-span-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1">
                  {t.totalInterestPaid}
                </span>
                <div className="text-lg sm:text-xl font-bold text-rose-400" dir="ltr">
                  <CountUp to={results.snowballInterest} prefix={`${currencySymbol} `} duration={0.6} />
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

      <CalculatorGuide guideKey="debt-snowball" category="finance" />

      <FAQ items={guide.faq} />

      <RelatedCalculators currentId="debt-snowball" />
    </div>
  );
}
