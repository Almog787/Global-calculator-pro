import React, { useMemo, useState } from 'react';
import { useUrlState } from '../../hooks/useUrlState';
import { useI18n } from '../../contexts/i18n';
import SEO from '../../components/SEO';
import Breadcrumbs from '../../components/Breadcrumbs';
import RelatedCalculators from '../../components/RelatedCalculators';
import ShareActions from '../../components/ShareActions';
import FAQ from '../../components/FAQ';
import CountUp from '../../components/CountUp';
import ShinyText from '../../components/ShinyText';
import { calculateRetirementPlan } from '../../lib/math/pension';
import { sanitizeExcelRows } from '../../lib/export/excelExport';
import * as XLSX from 'xlsx';
import { ShieldCheck, TrendingUp, DollarSign, PieChart, Download, FileSpreadsheet, Layers, Sparkles } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const localDict = {
  en: {
    catFinance: 'Finance & Investments',
    title: 'Retirement & Pension Planner',
    subtitle: 'Simulate Pension Accumulation, Monthly Benefits & Management Fees',
    description: 'Calculate your retirement nest egg and estimated monthly pension benefit based on current age, salary contributions, expected market return, and annuity conversion factors.',
    currentAge: 'Current Age',
    retirementAge: 'Retirement Age',
    currentBalance: 'Current Pension Savings ($)',
    monthlySalary: 'Monthly Salary ($)',
    contributionRate: 'Total Contribution Rate (%)',
    expectedReturn: 'Expected Annual Return (%)',
    accumulationFee: 'Annual Accumulation Fee (%)',
    depositFee: 'Deposit Fee (%)',
    annuityFactor: 'Annuity Conversion Factor (מקדם)',
    inflationRate: 'Annual Inflation Rate (%)',
    totalNominal: 'Estimated Total Capital at Retirement',
    totalReal: 'Inflation-Adjusted Capital (Real Value)',
    monthlyPension: 'Estimated Monthly Pension',
    totalDeposits: 'Total Contributions',
    totalGains: 'Compound Investment Gains',
    totalFees: 'Total Management Fees Paid',
    exportExcel: 'Export Full Retirement Plan (.xlsx)',
    projectionTitle: 'Yearly Pension Accumulation Trajectory',
    yearCol: 'Year',
    ageCol: 'Age',
    depositCol: 'Annual Deposit',
    returnCol: 'Yearly Gain',
    feesCol: 'Fees',
    balanceCol: 'Ending Capital',
    realBalanceCol: 'Real Value',
    faqTitle: 'Frequently Asked Questions about Pension Planning',
    q1: 'How is the monthly pension benefit calculated from total capital?',
    a1: 'At retirement, your total accumulated capital is divided by the Annuity Conversion Factor (מקדם המרה לקצבה, typically 190–210 in modern pension funds). For example, $2,000,000 divided by a factor of 200 yields a gross monthly pension of $10,000 for life.',
    q2: 'What is the impact of management fees on long-term pension savings?',
    a2: 'Management fees from accumulation (דמי ניהול מצבירה) have an exponential compound effect over 30–40 years. Reducing accumulation fees by just 0.2% can increase your total retirement capital by 8% to 15% at retirement.',
    q3: 'What is the difference between nominal capital and real inflation-adjusted capital?',
    a3: 'Nominal capital is the future dollar figure in your account. Real capital discounts this sum by annual inflation (e.g. 2.5% per year) to show the true purchasing power in today’s money.'
  },
  he: {
    catFinance: 'פיננסים והשקעות',
    title: 'מחשבון פנסיה ותכנון פרישה',
    subtitle: 'סימולציית צבירה פנסיונית, קצבה חודשית צפויה ודמי ניהול',
    description: 'מחשבון פנסיה ותכנון פרישה מקצועי: חישוב צבירה הונית בגיל פרישה, קצבה חודשית ברוטו לפי מקדם המרה, השפעת דמי ניהול ותשואה, וייצוא לוח תחזית לאקסל.',
    currentAge: 'גיל נוכחי',
    retirementAge: 'גיל פרישה מתוכנן',
    currentBalance: 'צבירה קיימת בקרן הפנסיה (₪)',
    monthlySalary: 'שכר חודשי ברוטו (₪)',
    contributionRate: 'אחוז הפקדה כולל עובד+מעסיק (%)',
    expectedReturn: 'תשואה שנתית צפויה (%)',
    accumulationFee: 'דמי ניהול מצבירה שנתית (%)',
    depositFee: 'דמי ניהול מהפקדה חודשית (%)',
    annuityFactor: 'מקדם המרה לקצבה (בפרישה)',
    inflationRate: 'אינפלציה שנתית משוערת (%)',
    totalNominal: 'סך צבירה הונית צפויה בפרישה',
    totalReal: 'ערך ריאלי מנוכה אינפלציה (במונחי היום)',
    monthlyPension: 'קצבת פנסיה חודשית צפויה ברוטו',
    totalDeposits: 'סך כל ההפקדות שנצברו',
    totalGains: 'רווחי תשואה וריבית דריבית',
    totalFees: 'סך דמי ניהול ששולמו לקרן',
    exportExcel: 'ייצוא דוח פנסיה מלא לאקסל (.xlsx)',
    projectionTitle: 'לוח תחזית צבירה פנסיונית לאורך השנים',
    yearCol: 'שנה',
    ageCol: 'גיל',
    depositCol: 'הפקדה שנתית',
    returnCol: 'רווח שנתי',
    feesCol: 'דמי ניהול',
    balanceCol: 'יתרה צבורה',
    realBalanceCol: 'שווי ריאלי',
    faqTitle: 'שאלות נפוצות על תכנון פנסיה וחישוב קצבה',
    q1: 'כיצד מחושבת קצבת הפנסיה החודשית מתוך הצבירה הכוללת?',
    a1: 'בגיל הפרישה, סך הצבירה שנצברה בקרן הפנסיה מחולקת ב"מקדם ההמרה לקצבה" (בקרנות פנסיה מודרניות המקדם נע סביב 195–210 בהתאם לשנת הלידה, מין ומסלול הפרישה). לדוגמה: צבירה של 2,000,000 ₪ חלקי מקדם 200 מניבה קצבה חודשית ברוטו של 10,000 ₪ לכל החיים.',
    q2: 'מהי ההשפעה של דמי הניהול על הצבירה הפנסיונית לאורך זמן?',
    a2: 'דמי ניהול מצבירה נגבים מכלל הכסף שנצבר בקרן מדי שנה. לאורך תקופת חיסכון של 30–40 שנה, הפחתה של דמי הניהול מצבירה ב-0.2% בלבד יכולה להגדיל את החיסכון הכולל שלכם בפרישה ב-10% עד 15% (תוספת של מאות אלפי שקלים).',
    q3: 'מה ההבדל בין צבירה נומינלית לצבירה ריאלית במונחי היום?',
    a3: 'צבירה נומינלית היא הסכום הכספי שיופיע בחשבון בעתיד. צבירה ריאלית מנכה את עליית מדד המחירים לצרכן (אינפלציה שנתית משוערת) ומציגה את כוח הקנייה האמיתי של הכסף במונחי כוח הקנייה של היום.'
  },
  es: {
    catFinance: 'Finanzas e Inversiones',
    title: 'Planificador de Jubilación y Pensiones',
    subtitle: 'Simula el Ahorro para el Retiro, Pensión Mensual y Comisiones',
    description: 'Calcula tu fondo de jubilación y pensión mensual estimada según edad, salario, aportaciones y rentabilidad esperada.',
    currentAge: 'Edad Actual',
    retirementAge: 'Edad de Jubilación',
    currentBalance: 'Ahorro Acumulado Actual ($)',
    monthlySalary: 'Salario Mensual Bruto ($)',
    contributionRate: 'Aportación Mensual (%)',
    expectedReturn: 'Rentabilidad Anual (%)',
    accumulationFee: 'Comisión de Gestión Anual (%)',
    depositFee: 'Comisión por Aportación (%)',
    annuityFactor: 'Factor de Conversión',
    inflationRate: 'Inflación Anual (%)',
    totalNominal: 'Capital Total Estimado al Jubilarse',
    totalReal: 'Capital Real Ajustado por Inflación',
    monthlyPension: 'Pensión Mensual Estimada',
    totalDeposits: 'Total Aportaciones',
    totalGains: 'Ganancias por Interés Compuesto',
    totalFees: 'Comisiones de Gestión Pagadas',
    exportExcel: 'Descargar Plan en Excel (.xlsx)',
    projectionTitle: 'Evolución del Fondo de Pensiones',
    yearCol: 'Año',
    ageCol: 'Edad',
    depositCol: 'Aportación Anual',
    returnCol: 'Rendimiento',
    feesCol: 'Comisiones',
    balanceCol: 'Capital Final',
    realBalanceCol: 'Valor Real',
    faqTitle: 'Preguntas Frecuentes sobre Jubilación y Fondos de Pensiones',
    q1: '¿Cómo se calcula la pensión mensual?',
    a1: 'Se divide el capital acumulado al jubilarse entre el factor de conversión o esperanza de vida estimada.',
    q2: '¿Por qué son tan importantes las comisiones de gestión?',
    a2: 'Una reducción mínima en comisiones anuales puede aumentar el capital final un 10-15% gracias al interés compuesto.',
    q3: '¿Qué es el valor real ajustado a inflación?',
    a3: 'Muestra el poder adquisitivo real del dinero futuro expresado en moneda actual.'
  },
  fr: {
    catFinance: 'Finance et Investissement',
    title: 'Calculateur de Retraite et Pension',
    subtitle: 'Simulation d\'Épargne Retraite, Rente Mensuelle et Frais',
    description: 'Estimez votre capital à la retraite et votre rente mensuelle prévisionnelle selon vos cotisations et rendements.',
    currentAge: 'Âge Actuel',
    retirementAge: 'Âge de Départ en Retraite',
    currentBalance: 'Épargne Actuelle (€)',
    monthlySalary: 'Salaire Mensuel Brut (€)',
    contributionRate: 'Taux de Cotisation (%)',
    expectedReturn: 'Rendement Annuel Estimé (%)',
    accumulationFee: 'Frais de Gestion Annuels (%)',
    depositFee: 'Frais sur Versement (%)',
    annuityFactor: 'Coefficient de Conversion',
    inflationRate: 'Inflation Annuelle (%)',
    totalNominal: 'Capital Total Estimé à la Retraite',
    totalReal: 'Capital Réel Corrigé de l\'Inflation',
    monthlyPension: 'Rente Mensuelle Estimée',
    totalDeposits: 'Total des Versements',
    totalGains: 'Intérêts Cumulés',
    totalFees: 'Total des Frais de Gestion',
    exportExcel: 'Exporter le Plan en Excel (.xlsx)',
    projectionTitle: 'Projection Annuelle du Capital Retraite',
    yearCol: 'Année',
    ageCol: 'Âge',
    depositCol: 'Versement Annuel',
    returnCol: 'Intérêts',
    feesCol: 'Frais',
    balanceCol: 'Solde Final',
    realBalanceCol: 'Valeur Réelle',
    faqTitle: 'Questions Fréquentes sur l\'Épargne Retraite',
    q1: 'Comment est calculée la rente mensuelle ?',
    a1: 'Le capital accumulé est divisé par le coefficient de conversion viagère.',
    q2: 'Quel est l\'impact des frais de gestion ?',
    a2: 'Des frais plus bas permettent d\'augmenter significativement le capital final sur 30 ans.',
    q3: 'Quelle est la différence entre capital nominal et réel ?',
    a3: 'Le capital réel tient compte de l\'inflation pour exprimer le pouvoir d\'achat en euros d\'aujourd\'hui.'
  },
  ar: {
    catFinance: 'المال والاستثمار',
    title: 'حاسبة التقاعد والراتب التقاعدي',
    subtitle: 'محاكاة تراكم المدخرات التقاعدية والراتب الشهري ورسوم الإدارة',
    description: 'احسب مدخراتك التقاعدية والراتب الشهري المتوقع بناءً على العمر والراتب ونسبة المساهمة وعوائد الاستثمار.',
    currentAge: 'العمر الحالي',
    retirementAge: 'سن التقاعد المخطط',
    currentBalance: 'المدخرات الحالية ($)',
    monthlySalary: 'الراتب الشهري الإجمالي ($)',
    contributionRate: 'نسبة المساهمة الشهرية (%)',
    expectedReturn: 'العائد السنوي المتوقع (%)',
    accumulationFee: 'رسوم الإدارة السنوية (%)',
    depositFee: 'رسوم الإيداع (%)',
    annuityFactor: 'معامل تحويل الراتب التقاعدي',
    inflationRate: 'معدل التضخم السنوي (%)',
    totalNominal: 'إجمالي رأس المال المتوقع عند التقاعد',
    totalReal: 'القيمة الحقيقية بعد خصم التضخم',
    monthlyPension: 'الراتب التقاعدي الشهري المتوقع',
    totalDeposits: 'إجمالي المساهمات المدفوعة',
    totalGains: 'أرباح الفائدة المركبة',
    totalFees: 'إجمالي رسوم الإدارة المدفوعة',
    exportExcel: 'تصدير الخطة إلى ملف Excel (.xlsx)',
    projectionTitle: 'تطور المدخرات التقاعدية عبر السنوات',
    yearCol: 'السنة',
    ageCol: 'العمر',
    depositCol: 'الإيداع السنوي',
    returnCol: 'العائد السنوي',
    feesCol: 'الرسوم',
    balanceCol: 'الرصيد النهائي',
    realBalanceCol: 'القيمة الحقيقية',
    faqTitle: 'الأسئلة الشائعة حول التخطيط للتقاعد',
    q1: 'كيف يتم حساب الراتب التقاعدي الشهري؟',
    a1: 'يتم تقسيم رأس المال التراكمي على معامل تحويل المعاش التقاعدي.',
    q2: 'ما مدى تأثير رسوم الإدارة على المدخرات؟',
    a2: 'تخفيض الرسوم بنسبة بسيطة يرفع رأس المال النهائي بنسبة 10-15% بفضل الفائدة المركبة.',
    q3: 'ما الفرق بين القيمة الاسمية والحقيقية؟',
    a3: 'القيمة الحقيقية تخصم التضخم لتظهر القوة الشرائية الفعلية بأموال اليوم.'
  },
  ru: {
    catFinance: 'Финансы и инвестиции',
    title: 'Пенсионный калькулятор и планирование',
    subtitle: 'Расчет пенсионных накоплений, ежемесячной пенсии и комиссий фонда',
    description: 'Рассчитайте будущие пенсионные накопления и размер ежемесячной пенсии с учетом возраста, зарплаты, взносов и доходности.',
    currentAge: 'Текущий возраст',
    retirementAge: 'Возраст выхода на пенсию',
    currentBalance: 'Текущие пенсионные накопления (₽)',
    monthlySalary: 'Ежемесячная зарплата до вычетов (₽)',
    contributionRate: 'Общий процент взносов (%)',
    expectedReturn: 'Ожидаемая годовая доходность (%)',
    accumulationFee: 'Комиссия за управление активами (%)',
    depositFee: 'Комиссия с пополнений (%)',
    annuityFactor: 'Коэффициент конвертации в пенсию',
    inflationRate: 'Ожидаемая инфляция (%)',
    totalNominal: 'Итоговый капитал к выходу на пенсию',
    totalReal: 'Реальный капитал (с поправкой на инфляцию)',
    monthlyPension: 'Ожидаемая ежемесячная пенсия',
    totalDeposits: 'Сумма всех внесенных средств',
    totalGains: 'Доход от сложного процента',
    totalFees: 'Всего уплачено комиссий',
    exportExcel: 'Экспорт пенсионного плана в Excel (.xlsx)',
    projectionTitle: 'Ежегодная динамика роста пенсионного капитала',
    yearCol: 'Год',
    ageCol: 'Возраст',
    depositCol: 'Взнос за год',
    returnCol: 'Доход за год',
    feesCol: 'Комиссии',
    balanceCol: 'Капитал на конец года',
    realBalanceCol: 'Реальная стоимость',
    faqTitle: 'Часто задаваемые вопросы о пенсионных накоплениях',
    q1: 'Как рассчитывается ежемесячная пенсия из капитала?',
    a1: 'Накопленный капитал делится на пенсионный коэффициент периода дожития.',
    q2: 'Как комиссии влияют на пенсионный капитал?',
    a2: 'Снижение комиссии даже на 0.2% увеличивает итоговый капитал на 10–15% за 30 лет.',
    q3: 'В чем разница между номинальным и реальным капиталом?',
    a3: 'Реальный капитал учитывает инфляцию и показывает покупательскую способность в ценах сегодняшнего дня.'
  }
};

export default function RetirementPlanner() {
  const { lang, t } = useI18n();
  const d = localDict[lang as keyof typeof localDict] || localDict.en;

  // URL States
  const [currentAge, setCurrentAge] = useUrlState('age', 30);
  const [retirementAge, setRetirementAge] = useUrlState('retAge', 67);
  const [currentBalance, setCurrentBalance] = useUrlState('balance', 50000);
  const [monthlySalary, setMonthlySalary] = useUrlState('salary', 15000);
  const [contributionRate, setContributionRate] = useUrlState('contrib', 20.83);
  const [expectedReturn, setExpectedReturn] = useUrlState('return', 6.0);
  const [accumulationFee, setAccumulationFee] = useUrlState('feeAccum', 0.2);
  const [depositFee, setDepositFee] = useUrlState('feeDep', 1.5);
  const [annuityFactor, setAnnuityFactor] = useUrlState('factor', 200);
  const [inflationRate, setInflationRate] = useUrlState('inf', 2.5);

  const [showTable, setShowTable] = useState(false);

  // Calculation results
  const results = useMemo(() => {
    return calculateRetirementPlan({
      currentAge: Number(currentAge) || 30,
      retirementAge: Number(retirementAge) || 67,
      currentBalance: Number(currentBalance) || 0,
      monthlySalary: Number(monthlySalary) || 0,
      contributionRatePercent: Number(contributionRate) || 20.83,
      expectedAnnualReturnPercent: Number(expectedReturn) || 6.0,
      accumulationFeePercent: Number(accumulationFee) || 0.2,
      depositFeePercent: Number(depositFee) || 1.5,
      annuityConversionFactor: Number(annuityFactor) || 200,
      annualInflationPercent: Number(inflationRate) || 2.5,
    });
  }, [currentAge, retirementAge, currentBalance, monthlySalary, contributionRate, expectedReturn, accumulationFee, depositFee, annuityFactor, inflationRate]);

  // Chart Data
  const chartData = useMemo(() => {
    const labels = results.yearlyBreakdown.map(b => `${lang === 'he' ? 'גיל ' : 'Age '}${b.age}`);
    const nominalData = results.yearlyBreakdown.map(b => b.endingBalance);
    const realData = results.yearlyBreakdown.map(b => Math.round(b.realEndingBalance));

    return {
      labels,
      datasets: [
        {
          label: d.totalNominal,
          data: nominalData,
          borderColor: '#006B5B',
          backgroundColor: 'rgba(0, 107, 91, 0.15)',
          fill: true,
          tension: 0.35,
          borderWidth: 2.5,
          pointRadius: results.yearlyBreakdown.length > 25 ? 0 : 3,
        },
        {
          label: d.totalReal,
          data: realData,
          borderColor: '#D97706',
          backgroundColor: 'rgba(217, 119, 6, 0.05)',
          borderDash: [5, 5],
          fill: false,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 0,
        }
      ]
    };
  }, [results, d, lang]);

  const handleExportExcel = () => {
    const headers = [d.yearCol, d.ageCol, d.depositCol, d.returnCol, d.feesCol, d.balanceCol, d.realBalanceCol];
    const rows = results.yearlyBreakdown.map(b => [
      b.yearIndex,
      b.age,
      Math.round(b.annualContribution),
      Math.round(b.annualReturn),
      Math.round(b.annualFees),
      Math.round(b.endingBalance),
      Math.round(b.realEndingBalance),
    ]);

    const sanitized = sanitizeExcelRows([headers, ...rows]);
    const ws = XLSX.utils.aoa_to_sheet(sanitized);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Retirement Projection');
    XLSX.writeFile(wb, `Retirement_Plan_${currentAge}_to_${retirementAge}.xlsx`);
  };

  const currencySymbol = lang === 'he' ? '₪' : lang === 'fr' || lang === 'es' ? '€' : lang === 'ru' ? '₽' : '$';

  return (
    <>
      <SEO
        title={`${d.title} – ${d.subtitle}`}
        description={d.description}
        keywords={['pension calculator', 'retirement planner', 'מחשבון פנסיה', 'חישוב פנסיה', 'דמי ניהול פנסיה', 'מקדם קצבה']}
        canonicalUrl="/calculators/retirement-planner"
        type="SoftwareApplication"
        applicationCategory="FinanceApplication"
        faq={[
          { question: d.q1, answer: d.a1 },
          { question: d.q2, answer: d.a2 },
          { question: d.q3, answer: d.a3 }
        ]}
      />

      <div className="w-full max-w-5xl mx-auto space-y-8 animate-fadeIn pb-12">
        <Breadcrumbs
          items={[
            { label: t.home || 'Home', path: `/${lang}` },
            { label: d.catFinance, path: `/${lang}/category/finance` },
            { label: d.title, path: `/${lang}/calculators/retirement-planner` },
          ]}
        />

        {/* Hero Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>{d.catFinance}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-on-surface">
            {d.title}
          </h1>
          <p className="text-on-surface-variant max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            {d.subtitle}
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs Section */}
          <div className="lg:col-span-6 bg-surface border border-border-subtle rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2 border-b border-border-subtle pb-3">
              <TrendingUp className="w-5 h-5 text-secondary" />
              <span>{lang === 'he' ? 'פרטי החיסכון וההפקדות' : 'Savings & Contribution Parameters'}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Current Age */}
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">{d.currentAge}</label>
                <input
                  type="number"
                  min="18"
                  max="90"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(Number(e.target.value))}
                  className="w-full bg-surface-container-lowest border border-border-subtle rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-secondary transition-colors"
                />
              </div>

              {/* Retirement Age */}
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">{d.retirementAge}</label>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    min="40"
                    max="95"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(Number(e.target.value))}
                    className="w-full bg-surface-container-lowest border border-border-subtle rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-secondary transition-colors"
                  />
                  <button type="button" onClick={() => setRetirementAge(67)} className="px-2 py-1 bg-surface-container-low text-xs rounded-lg font-bold hover:bg-surface-container transition-colors">67</button>
                  <button type="button" onClick={() => setRetirementAge(65)} className="px-2 py-1 bg-surface-container-low text-xs rounded-lg font-bold hover:bg-surface-container transition-colors">65</button>
                </div>
              </div>
            </div>

            {/* Monthly Salary */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-on-surface">{d.monthlySalary}</label>
                <span className="text-xs font-semibold text-secondary">{currencySymbol}{Number(monthlySalary).toLocaleString()}</span>
              </div>
              <input
                type="number"
                min="0"
                step="500"
                value={monthlySalary}
                onChange={(e) => setMonthlySalary(Number(e.target.value))}
                className="w-full bg-surface-container-lowest border border-border-subtle rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-secondary transition-colors"
              />
            </div>

            {/* Current Accumulated Savings */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-on-surface">{d.currentBalance}</label>
                <span className="text-xs font-semibold text-secondary">{currencySymbol}{Number(currentBalance).toLocaleString()}</span>
              </div>
              <input
                type="number"
                min="0"
                step="5000"
                value={currentBalance}
                onChange={(e) => setCurrentBalance(Number(e.target.value))}
                className="w-full bg-surface-container-lowest border border-border-subtle rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-secondary transition-colors"
              />
            </div>

            {/* Contribution & Return Rates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">{d.contributionRate}</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="35"
                  value={contributionRate}
                  onChange={(e) => setContributionRate(Number(e.target.value))}
                  className="w-full bg-surface-container-lowest border border-border-subtle rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-secondary transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">{d.expectedReturn}</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="20"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  className="w-full bg-surface-container-lowest border border-border-subtle rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-secondary transition-colors"
                />
              </div>
            </div>

            {/* Fees & Factors Accordion */}
            <div className="pt-2 border-t border-border-subtle/80 space-y-3">
              <div className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                <span>{lang === 'he' ? 'דמי ניהול ומקדמי פרישה מתקדמים' : 'Advanced Fees & Conversion Factors'}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="block text-[11px] text-on-surface-variant mb-0.5">{d.accumulationFee}</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="2"
                    value={accumulationFee}
                    onChange={(e) => setAccumulationFee(Number(e.target.value))}
                    className="w-full bg-surface-container-lowest border border-border-subtle rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none focus:border-secondary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-on-surface-variant mb-0.5">{d.depositFee}</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="6"
                    value={depositFee}
                    onChange={(e) => setDepositFee(Number(e.target.value))}
                    className="w-full bg-surface-container-lowest border border-border-subtle rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none focus:border-secondary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-on-surface-variant mb-0.5">{d.annuityFactor}</label>
                  <input
                    type="number"
                    step="1"
                    min="100"
                    max="300"
                    value={annuityFactor}
                    onChange={(e) => setAnnuityFactor(Number(e.target.value))}
                    className="w-full bg-surface-container-lowest border border-border-subtle rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none focus:border-secondary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-on-surface-variant mb-0.5">{d.inflationRate}</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(Number(e.target.value))}
                    className="w-full bg-surface-container-lowest border border-border-subtle rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none focus:border-secondary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary & Key Cards */}
          <div className="lg:col-span-6 space-y-4">
            {/* Primary Monthly Pension Hero Card */}
            <div data-testid="result-card" className="bg-gradient-to-br from-[#005144] to-[#006B5B] text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
              <div className="relative z-10 space-y-1.5">
                <span className="text-xs uppercase tracking-wider font-semibold opacity-90">{d.monthlyPension}</span>
                <div className="text-3xl sm:text-4xl font-black flex items-baseline gap-1">
                  <span>{currencySymbol}</span>
                  <CountUp value={results.monthlyPensionGross} />
                  <span className="text-xs font-normal opacity-85">{lang === 'he' ? 'לחודש (ברוטו)' : '/ month'}</span>
                </div>
                <p className="text-xs text-emerald-100 opacity-90 pt-1">
                  {lang === 'he'
                    ? `מבוסס על צבירה כוללת של ${currencySymbol}${results.totalAccumulatedNominal.toLocaleString()} ומקדם פרישה ${annuityFactor}`
                    : `Based on ${currencySymbol}${results.totalAccumulatedNominal.toLocaleString()} total capital & ${annuityFactor} annuity factor`}
                </p>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="bg-surface border border-border-subtle rounded-xl p-4 shadow-2xs">
                <span className="text-[11px] text-on-surface-variant font-medium block mb-1">{d.totalNominal}</span>
                <div className="text-lg sm:text-xl font-bold text-primary">
                  {currencySymbol}{results.totalAccumulatedNominal.toLocaleString()}
                </div>
              </div>

              <div className="bg-surface border border-border-subtle rounded-xl p-4 shadow-2xs">
                <span className="text-[11px] text-on-surface-variant font-medium block mb-1">{d.totalReal}</span>
                <div className="text-lg sm:text-xl font-bold text-amber-600">
                  {currencySymbol}{results.totalAccumulatedReal.toLocaleString()}
                </div>
              </div>

              <div className="bg-surface border border-border-subtle rounded-xl p-4 shadow-2xs">
                <span className="text-[11px] text-on-surface-variant font-medium block mb-1">{d.totalGains}</span>
                <div className="text-base sm:text-lg font-bold text-emerald-600">
                  +{currencySymbol}{results.totalReturns.toLocaleString()}
                </div>
              </div>

              <div className="bg-surface border border-border-subtle rounded-xl p-4 shadow-2xs">
                <span className="text-[11px] text-on-surface-variant font-medium block mb-1">{d.totalFees}</span>
                <div className="text-base sm:text-lg font-bold text-red-500">
                  -{currencySymbol}{results.totalFeesPaid.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Export & Actions */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleExportExcel}
                className="flex-1 bg-secondary text-on-secondary px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm hover:bg-on-secondary-container transition-all flex items-center justify-center gap-2 shadow-xs active:scale-98"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>{d.exportExcel}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowTable(!showTable)}
                className="bg-surface border border-border-subtle text-on-surface px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm hover:bg-surface-container transition-all"
              >
                {showTable ? (lang === 'he' ? 'הסתר טבלה' : 'Hide Table') : (lang === 'he' ? 'הצג פירוט שנתי' : 'Show Breakdown')}
              </button>
            </div>
          </div>
        </div>

        {/* Growth Chart */}
        <div className="bg-surface border border-border-subtle rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-border-subtle pb-3">
            <h3 className="font-bold text-base sm:text-lg text-on-surface flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-secondary" />
              <span>{d.projectionTitle}</span>
            </h3>
            <span className="text-xs text-on-surface-variant font-semibold">
              {results.yearlyBreakdown.length} {lang === 'he' ? 'שנות חיסכון' : 'Years'}
            </span>
          </div>
          <div className="h-72 w-full">
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } },
                  tooltip: {
                    callbacks: {
                      label: (ctx) => ` ${ctx.dataset.label}: ${currencySymbol}${Number(ctx.raw).toLocaleString()}`
                    }
                  }
                },
                scales: {
                  y: {
                    ticks: {
                      callback: (val) => `${currencySymbol}${Number(val) >= 1000000 ? `${(Number(val) / 1000000).toFixed(1)}M` : `${(Number(val) / 1000).toFixed(0)}k`}`,
                      font: { size: 10 }
                    }
                  },
                  x: {
                    ticks: { font: { size: 10 }, maxRotation: 45 }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Year-by-Year Table (Conditional) */}
        {showTable && (
          <div className="bg-surface border border-border-subtle rounded-2xl p-4 sm:p-6 shadow-xs overflow-hidden">
            <h3 className="font-bold text-base text-on-surface mb-4">{d.projectionTitle}</h3>
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-surface-container-low text-on-surface font-bold sticky top-0 border-b border-border-subtle">
                  <tr>
                    <th className="p-2.5">{d.yearCol}</th>
                    <th className="p-2.5">{d.ageCol}</th>
                    <th className="p-2.5">{d.depositCol}</th>
                    <th className="p-2.5">{d.returnCol}</th>
                    <th className="p-2.5">{d.feesCol}</th>
                    <th className="p-2.5">{d.balanceCol}</th>
                    <th className="p-2.5">{d.realBalanceCol}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {results.yearlyBreakdown.map((row) => (
                    <tr key={row.yearIndex} className="hover:bg-surface-container-lowest transition-colors">
                      <td className="p-2.5 font-semibold text-on-surface-variant">#{row.yearIndex}</td>
                      <td className="p-2.5 font-bold text-primary">{row.age}</td>
                      <td className="p-2.5">{currencySymbol}{Math.round(row.annualContribution).toLocaleString()}</td>
                      <td className="p-2.5 text-emerald-600">+{currencySymbol}{Math.round(row.annualReturn).toLocaleString()}</td>
                      <td className="p-2.5 text-red-500">-{currencySymbol}{Math.round(row.annualFees).toLocaleString()}</td>
                      <td className="p-2.5 font-bold text-on-surface">{currencySymbol}{Math.round(row.endingBalance).toLocaleString()}</td>
                      <td className="p-2.5 text-amber-600 font-semibold">{currencySymbol}{Math.round(row.realEndingBalance).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Share Actions */}
        <ShareActions
          calculatorTitle={d.title}
          calculatorPath="/calculators/retirement-planner"
          shareMessage={d.description}
          onExportExcel={handleExportExcel}
        />

        {/* FAQ Section */}
        <FAQ
          title={d.faqTitle}
          items={[
            { question: d.q1, answer: d.a1 },
            { question: d.q2, answer: d.a2 },
            { question: d.q3, answer: d.a3 }
          ]}
        />

        {/* Related Calculators */}
        <RelatedCalculators currentId="retirement-planner" limit={4} />
      </div>
    </>
  );
}
