import React, { useDeferredValue, useMemo } from 'react';
import { PiggyBank } from 'lucide-react';
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
    title: 'Goal Savings Calculator',
    subtitle: 'Plan Exactly How Much to Save Monthly to Reach Any Financial Milestone',
    description: 'Calculate your required monthly savings contribution to reach your financial goal on time. Model compound interest, starting balance, and growth timelines.',
    goalAmount: 'Target Savings Goal',
    goalAmountDesc: 'The target amount you want to accumulate (e.g. house down payment, emergency fund)',
    initialSavings: 'Initial Starting Capital',
    initialSavingsDesc: 'Current funds you already have saved toward this goal',
    years: 'Time to Reach Goal (Years)',
    yearsDesc: 'How many years you have to build this savings fund',
    interestRate: 'Expected Annual Interest Rate (%)',
    interestRateDesc: 'Annual return on savings account, CD, bonds, or investment index',
    monthlyContribution: 'Required Monthly Deposit',
    totalPrincipal: 'Total You Will Deposit',
    totalInterest: 'Total Compound Interest Earned',
    interestShare: 'Interest Share of Goal',
    chartTitle: 'Goal Savings Trajectory & Compound Growth',
    chartGoalTarget: 'Goal Target Line',
    chartBalance: 'Total Accumulated Balance',
    chartDeposits: 'Your Total Deposits',
    faqTitle: 'Frequently Asked Questions: Savings Goal Planning',
  },
  he: {
    title: 'מחשבון חיסכון ליעד',
    subtitle: 'תכנון מדויק של הפקדה חודשית להשגת כל יעד פיננסי בזמן',
    description: 'מחשבון חיסכון ליעד: גלה כמה עליך להפקיד מדי חודש כדי להגיע ליעד החלומות שלך (הון עצמי לדירה, קרן חירום, טיול או רכב), כולל רווחי ריבית דריבית.',
    goalAmount: 'סכום יעד לחיסכון',
    goalAmountDesc: 'הסכום הסופי שברצונך להגיע אליו (למשל הון עצמי לדירה או קרן חירום)',
    initialSavings: 'חיסכון התחלתי קיים',
    initialSavingsDesc: 'סכום שכבר צברת ומוכן להשקעה או חיסכון',
    years: 'שנות חיסכון להשגת היעד',
    yearsDesc: 'כמה שנים עומדות לרשותך עד למועד היעד',
    interestRate: 'ריבית / תשואה שנתית צפויה (%)',
    interestRateDesc: 'תשואה שנתית צפויה על פיקדון, קופת גמל להשקעה או מדד מניות',
    monthlyContribution: 'הפקדה חודשית נדרשת',
    totalPrincipal: 'סך כל הפקדותיך מהכיס',
    totalInterest: 'סך ריבית דריבית שנצברה',
    interestShare: 'חלק הריבית מסך היעד',
    chartTitle: 'מסלול הצמיחה לעבר היעד עם ריבית דריבית',
    chartGoalTarget: 'קו יעד החיסכון',
    chartBalance: 'סך צבירה בחיסכון',
    chartDeposits: 'סך הפקדות מהכיס',
    faqTitle: 'שאלות ותשובות נפוצות: תכנון חיסכון ליעד',
  },
  es: {
    title: 'Calculadora de Ahorro para Meta',
    subtitle: 'Calcula cuánto ahorrar al mes para alcanzar cualquier meta financiera',
    description: 'Calcula tu aporte mensual necesario para alcanzar tu objetivo de ahorro con interés compuesto.',
    goalAmount: 'Meta de Ahorro Deseada',
    goalAmountDesc: 'Monto total a alcanzar',
    initialSavings: 'Ahorro Inicial',
    initialSavingsDesc: 'Dinero disponible actualmente',
    years: 'Plazo en Años',
    yearsDesc: 'Años para alcanzar la meta',
    interestRate: 'Tasa de Interés Anual (%)',
    interestRateDesc: 'Rendimiento anual estimado',
    monthlyContribution: 'Aporte Mensual Necesario',
    totalPrincipal: 'Total Depositado',
    totalInterest: 'Intereses Ganados',
    interestShare: 'Aporte del Interés',
    chartTitle: 'Crecimiento del Ahorro hacia la Meta',
    chartGoalTarget: 'Meta de Ahorro',
    chartBalance: 'Saldo Acumulado',
    chartDeposits: 'Tus Depósitos',
    faqTitle: 'Preguntas Frecuentes sobre Ahorro para Metas',
  },
  fr: {
    title: 'Calculateur d\'Épargne Objectif',
    subtitle: 'Planifiez votre effort d\'épargne mensuel pour tout projet de vie',
    description: 'Calculez la mensualité d\'épargne nécessaire pour atteindre votre objectif financier.',
    goalAmount: 'Montant de l\'Objectif',
    goalAmountDesc: 'Somme finale souhaitée',
    initialSavings: 'Épargne Initiale',
    initialSavingsDesc: 'Capital déjà disponible',
    years: 'Durée (Années)',
    yearsDesc: 'Nombre d\'années pour épargner',
    interestRate: 'Taux d\'Intérêt Annuel (%)',
    interestRateDesc: 'Rendement annuel estimé',
    monthlyContribution: 'Versement Mensuel Requis',
    totalPrincipal: 'Total de vos Versements',
    totalInterest: 'Total des Intérêts Générés',
    interestShare: 'Part des Intérêts',
    chartTitle: 'Trajectoire d\'Épargne et Intérêts Composés',
    chartGoalTarget: 'Objectif Fixé',
    chartBalance: 'Capital Final',
    chartDeposits: 'Total Épargné',
    faqTitle: 'Questions Fréquentes sur l\'Épargne Objectif',
  },
  ar: {
    title: 'حاسبة الادخار للهدف',
    subtitle: 'خطط بدقة للمبلغ الواجب ادخاره شهرياً لتحقيق أي هدف مالي',
    description: 'احسب الدفعة الشهرية المطلوبة للوصول إلى هدفك المالي في الوقت المحدد مع الفائدة المركبة.',
    goalAmount: 'المبلغ المستهدف للادخار',
    goalAmountDesc: 'المبلغ النهائي المراد الوصول إليه',
    initialSavings: 'الادخار الأولي المتوفر',
    initialSavingsDesc: 'المبلغ المتوفر لديك بالفعل',
    years: 'مدة الادخار (بالسنوات)',
    yearsDesc: 'عدد السنوات حتى موعد الهدف',
    interestRate: 'معدل العائد السنوي المتوقع (%)',
    interestRateDesc: 'العائد السنوي المتوقع من حساب التوفير أو الاستثمار',
    monthlyContribution: 'الادخار الشهري المطلوب',
    totalPrincipal: 'إجمالي ما ستدفعه من جيبك',
    totalInterest: 'إجمالي الأرباح المركبة',
    interestShare: 'نسبة الأرباح من الهدف',
    chartTitle: 'مسار نمو الادخار نحو الهدف',
    chartGoalTarget: 'خط الهدف',
    chartBalance: 'الرصيد الإجمالي المتراكم',
    chartDeposits: 'إجمالي مدخراتك',
    faqTitle: 'الأسئلة الشائعة حول ادخار الأهداف المالية',
  }
};

export default function GoalSavings() {
  const { lang, guides } = useI18n();
  const guide = guides['goal-savings'] || { guideTitle: 'Guide & Formulas', guideDesc: 'Comprehensive calculation breakdown and FAQs.', faq: [] };
  const t = localDict[lang as keyof typeof localDict] || localDict.en;

  const { state, updateState, saveToHistory, loadFromHistory, getHistory } = useCalculatorState('goal-savings', {
    goal: 150000,
    initial: 20000,
    years: 5,
    rate: 6.0,
  });

  const { goal, initial, years, rate } = state;

  const setGoal = (v: number) => updateState({ goal: v });
  const setInitial = (v: number) => updateState({ initial: v });
  const setYears = (v: number) => updateState({ years: v });
  const setRate = (v: number) => updateState({ rate: v });

  const currencySymbol = lang === 'he' ? '₪' : (lang === 'fr' || lang === 'es' ? '€' : '$');

  const results = useMemo(() => {
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
      const interestShare = decGoal.isZero() ? new Decimal(0) : Decimal.max(0, totalInterest).div(decGoal).mul(100);

      return {
        monthly: Math.round(Math.max(0, requiredMonthly.toNumber())),
        totalPrincipal: Math.round(totalDeposited.toNumber()),
        totalInterest: Math.round(Math.max(0, totalInterest.toNumber())),
        interestShare: Math.round(interestShare.toNumber() * 10) / 10,
      };
    } catch {
      return {
        monthly: 0,
        totalPrincipal: 0,
        totalInterest: 0,
        interestShare: 0,
      };
    }
  }, [goal, initial, years, rate]);

  const chartData = useMemo(() => {
    const labels: string[] = [];
    const balanceData: number[] = [];
    const depositsData: number[] = [];
    const targetLine: number[] = [];

    const decInitial = new Decimal(initial || 0);
    const decRate = new Decimal(rate || 0).div(100).div(12);
    const decMonthly = new Decimal(results.monthly || 0);
    const totalYears = Math.min(Math.max(years, 1), 30);

    for (let y = 0; y <= totalYears; y++) {
      labels.push(y === 0 ? '0' : `${y}Y`);
      const m = y * 12;

      let bal: Decimal;
      if (decRate.isZero()) {
        bal = decInitial.add(decMonthly.mul(m));
      } else {
        const factor = decRate.add(1).pow(m);
        const pGrowth = decInitial.mul(factor);
        const cGrowth = decMonthly.mul(factor.sub(1)).div(decRate);
        bal = pGrowth.add(cGrowth);
      }

      const dep = decInitial.add(decMonthly.mul(m));

      balanceData.push(Math.round(bal.toNumber()));
      depositsData.push(Math.round(dep.toNumber()));
      targetLine.push(goal);
    }

    return {
      labels,
      datasets: [
        {
          label: t.chartBalance,
          data: balanceData,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.3,
          borderWidth: 3,
        },
        {
          label: t.chartDeposits,
          data: depositsData,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.05)',
          fill: false,
          tension: 0.3,
          borderWidth: 2,
        },
        {
          label: t.chartGoalTarget,
          data: targetLine,
          borderColor: '#f59e0b',
          borderDash: [6, 6],
          fill: false,
          borderWidth: 2,
        },
      ],
    };
  }, [initial, rate, results.monthly, years, goal, t]);

  const deferredChartData = useDeferredValue(chartData);

  const presets = [
    {
      label: lang === 'he' ? 'הון עצמי לדירה (300,000 ₪ ל-5 שנים)' : 'House Down Payment ($60,000 / 4 Yrs)',
      values: { goal: 300000, initial: 50000, years: 5, rate: 7.0 }
    },
    {
      label: lang === 'he' ? 'קרן חירום (50,000 ₪ לשנתיים)' : 'Emergency Fund ($20,000 / 2 Yrs)',
      values: { goal: 50000, initial: 5000, years: 2, rate: 4.5 }
    },
    {
      label: lang === 'he' ? 'קרן לימודים לילד (120,000 ₪ ל-10 שנים)' : 'College Fund ($100,000 / 12 Yrs)',
      values: { goal: 120000, initial: 10000, years: 10, rate: 8.0 }
    },
    {
      label: lang === 'he' ? 'חופשה / רכב חדש (35,000 ₪ לשנה)' : 'Vacation / Car ($15,000 / 1.5 Yrs)',
      values: { goal: 35000, initial: 2000, years: 2, rate: 4.0 }
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      <SEO
        title={t.title}
        description={t.description}
        keywords={['goal savings calculator', 'savings planner', 'חיסכון ליעד', 'מחשבון חיסכון', 'הפקדה חודשית']}
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
          if (val.goal !== undefined) setGoal(val.goal);
          if (val.initial !== undefined) setInitial(val.initial);
          if (val.years !== undefined) setYears(val.years);
          if (val.rate !== undefined) setRate(val.rate);
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Card */}
        <div className="lg:col-span-7 bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3.5 pb-4 border-b border-stone-100 dark:border-stone-800">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <PiggyBank className="w-6 h-6" />
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
            {/* Target Goal Amount */}
            <div>
              <label htmlFor="gs-goal" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                {t.goalAmount} ({currencySymbol})
              </label>
              <input
                id="gs-goal"
                type="number"
                min="0"
                value={goal}
                onChange={(e) => setGoal(Math.max(0, Number(e.target.value)))}
                className="w-full bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-3.5 text-xl font-bold text-stone-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{t.goalAmountDesc}</p>
            </div>

            {/* Initial Savings & Years Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="gs-initial" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  {t.initialSavings} ({currencySymbol})
                </label>
                <input
                  id="gs-initial"
                  type="number"
                  min="0"
                  value={initial}
                  onChange={(e) => setInitial(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-3.5 text-xl font-bold text-stone-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{t.initialSavingsDesc}</p>
              </div>

              <div>
                <label htmlFor="gs-years" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  {t.years}
                </label>
                <input
                  id="gs-years"
                  type="number"
                  min="1"
                  max="50"
                  value={years}
                  onChange={(e) => setYears(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-3.5 text-xl font-bold text-stone-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{t.yearsDesc}</p>
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <label htmlFor="gs-rate" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                {t.interestRate}
              </label>
              <input
                id="gs-rate"
                type="number"
                step="0.1"
                min="0"
                value={rate}
                onChange={(e) => setRate(Math.max(0, Number(e.target.value)))}
                className="w-full bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-3.5 text-xl font-bold text-stone-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{t.interestRateDesc}</p>
            </div>
          </div>

          <ShareActions
            calculatorTitle={t.title}
            calculatorPath="/calculators/goal-savings"
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
                  {t.monthlyContribution}
                </span>
                <ShinyText text="MONTHLY DEPOSIT" speed={3} className="text-[10px] text-emerald-400 font-mono" />
              </div>
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-white" dir="ltr">
                <CountUp to={results.monthly} prefix={`${currencySymbol} `} duration={0.6} />
              </div>
              <p className="text-xs text-stone-400 mt-2">
                {lang === 'he'
                  ? `הפקדה חודשית של ${results.monthly.toLocaleString()} ₪ תביא אותך ליעד של ${goal.toLocaleString()} ₪ בתוך ${years} שנים.`
                  : `A monthly deposit of ${currencySymbol}${results.monthly.toLocaleString()} reaches your ${currencySymbol}${goal.toLocaleString()} goal in ${years} years.`}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1">
                  {t.totalPrincipal}
                </span>
                <div className="text-lg sm:text-xl font-bold text-blue-400" dir="ltr">
                  <CountUp to={results.totalPrincipal} prefix={`${currencySymbol} `} duration={0.6} />
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1">
                  {t.totalInterest}
                </span>
                <div className="text-lg sm:text-xl font-bold text-emerald-400" dir="ltr">
                  <CountUp to={results.totalInterest} prefix={`${currencySymbol} `} duration={0.6} />
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 col-span-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                    {t.interestShare}
                  </span>
                  <span className="text-xs font-bold text-emerald-400">{results.interestShare}%</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, results.interestShare)}%` }} />
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

      <CalculatorGuide guideKey="goal-savings" category="finance" />

      <FAQ items={guide.faq} />

      <RelatedCalculators currentId="goal-savings" />
    </div>
  );
}
