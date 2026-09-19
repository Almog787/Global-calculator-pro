import React, { useDeferredValue } from 'react';
import { useUrlState } from '../../hooks/useUrlState';
import { useI18n } from '../../contexts/i18n';
import SEO from '../../components/SEO';
import { calculateEmployerCost } from '../../lib/math/finance';
import { trackCalculation } from '../../lib/analytics';
import {
  Users,
  Briefcase,
  Wallet,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, ChartTooltip, Legend);

const localDict = {
  en: {
    title: 'Employer Cost vs Employee Net Salary Calculator',
    subtitle: 'Comprehensive Breakdown of Social Security, Pension, Study Fund & Income Taxes',
    description: 'Calculate total cost of employment for Israeli employers alongside employee net take-home salary, national insurance, income tax brackets, pension, and study fund contributions.',
    grossSalary: 'Monthly Gross Salary (₪)',
    creditPoints: 'Tax Credit Points (נקודות זיכוי)',
    creditPointsDesc: '2.25 for resident male, 2.75 for resident female + points for children',
    pensionEmployer: 'Employer Pension Contributions (%)',
    severancePercent: 'Employer Severance Provision (%)',
    studyFundEmployer: 'Employer Study Fund - קרן השתלמות (%)',
    recuperationMonthly: 'Monthly Recuperation Pay - דמי הבראה (₪)',
    vacationSickProvision: 'Vacation & Sick Leave Provisions (₪)',
    wellnessAndPerks: 'Meal Vouchers / Car / Wellness Perks (₪)',
    totalEmployerCost: 'Total Employer Monthly Cost',
    netTakeHome: 'Employee Net Take-Home Pay',
    costMultiplier: 'Employer Cost Multiplier',
    costMultiplierDesc: 'Employer spends ₪{mult} for every ₪1.00 net received by the employee',
    employerBreakdown: 'Employer Cost Components',
    employeeDeductions: 'Employee Deductions & Taxes',
    incomeTax: 'Income Tax (מס הכנסה)',
    nationalInsurance: 'National Insurance & Health (ביטוח לאומי ובריאות)',
    pensionEmployee: 'Employee Pension (6%)',
    studyFundEmployee: 'Employee Study Fund (2.5%)',
    totalDeductions: 'Total Deductions',
    faqTitle: 'Frequently Asked Questions: Employment Costs & Payroll in Israel',
    q1: 'What is the mandatory pension contribution in Israel?',
    a1: 'Under Israeli expansion orders, minimum mandatory pension contributions are: 6.5% employer pension, 6.0% (or 8.33%) employer severance, and 6.0% employee pension.',
    q2: 'What is Keren Hishtalmut (Study Fund) tax exemption cap?',
    a2: 'Contributions to an advanced study fund (Keren Hishtalmut) are tax-exempt up to a salary cap of 15,712 NIS per month (employer pays up to 7.5% and employee 2.5%).',
    q3: 'How are tax credit points calculated?',
    a3: 'Every Israeli resident gets 2.25 credit points (men) or 2.75 points (women). Each credit point reduces monthly income tax by 242 NIS (2,904 NIS annually).'
  },
  he: {
    title: 'מחשבון עלות מעסיק מול שכר נטו לעובד',
    subtitle: 'פירוט מלא: ביטוח לאומי, מס הכנסה, קרן השתלמות, הפרשות סוציאליות ופנסיה',
    description: 'מחשבון שכר ועלות מעביד: חשב במדויק כמה עולה העובד למעסיק כולל פנסיה, פיצויים, ביטוח לאומי, הבראה והטבות, מול שכר הנטו שנשאר לעובד בכיס.',
    grossSalary: 'שכר ברוטו חודשי (₪)',
    creditPoints: 'נקודות זיכוי במס הכנסה',
    creditPointsDesc: '2.25 לגבר תושב, 2.75 לאישה תושבת + נקודות עבור ילדים',
    pensionEmployer: 'הפרשת מעסיק לתגמולים ופנסיה (%)',
    severancePercent: 'הפרשת מעסיק לפיצויי פיטורים (%)',
    studyFundEmployer: 'הפרשת מעסיק לקרן השתלמות (%)',
    recuperationMonthly: 'דמי הבראה (חלק יחסי חודשי) (₪)',
    vacationSickProvision: 'הפרשות לימי חופשה ומחלה (₪)',
    wellnessAndPerks: 'סיבוס / תן ביס / רכב / רווחה (₪)',
    totalEmployerCost: 'עלות מעסיק כוללת לחודש',
    netTakeHome: 'שכר נטו בכיס לעובד',
    costMultiplier: 'מכפיל עלות מעסיק לנטו',
    costMultiplierDesc: 'המעסיק מוציא ₪{mult} על כל ₪1.00 נטו שהעובד מקבל',
    employerBreakdown: 'פירוט רכיבי עלות המעסיק',
    employeeDeductions: 'ניכויי שכר ומיסים של העובד',
    incomeTax: 'מס הכנסה (מנוכה נקודות זיכוי)',
    nationalInsurance: 'ביטוח לאומי ומס בריאות',
    pensionEmployee: 'פנסיה חלק עובד (6%)',
    studyFundEmployee: 'קרן השתלמות חלק עובד (2.5%)',
    totalDeductions: 'סך ניכויים מהברוטו',
    faqTitle: 'שאלות נפוצות: דיני עבודה, הפרשות סוציאליות ומיסוי שכר',
    q1: 'מהן הפרשות החובה לפנסיה ופיצויים בישראל?',
    a1: 'לפי צו ההרחבה לפנסיית חובה, המעסיק מפריש 6.5% לתגמולים ו-6% (או 8.33% לפי סעיף 14 לחוק פיצויי פיטורים), והעובד מפריש 6% לתגמולים משכרו.',
    q2: 'מהי תקרת הפטור ממס לקרן השתלמות?',
    a2: 'תקרת השכר הפטורה ממס להפרשות לקרן השתלמות עומדת על 15,712 ₪ לחודש. הפרשת מעסיק עד 7.5% והפרשת עובד של 2.5% עד תקרה זו פטורות ממס הכנסה.',
    q3: 'כיצד משפיעות נקודות הזיכוי על השכר נטו?',
    a3: 'כל נקודת זיכוי שווה 242 ₪ לחודש (2,904 ₪ לשנה). גבר תושב ישראל זכאי ל-2.25 נקודות בסיס (שווי 544.5 ₪), אישה זכאית ל-2.75 נקודות (665.5 ₪), ונקודות נוספות מוענקות בגין פעוטות וילדים.'
  },
  es: {
    title: 'Calculadora de Coste de Empresa vs Sueldo Neto',
    subtitle: 'Desglose Completo de Seguridad Social, IRPF, Pensiones y Retenciones',
    description: 'Calcula el coste total que supone un empleado para la empresa frente al salario neto que percibe, incluyendo cotizaciones empresariales y retenciones.',
    grossSalary: 'Salario Bruto Mensual (₪)',
    creditPoints: 'Puntos de Deducción Fiscal',
    creditPointsDesc: 'Puntos fiscales y reducciones por situación personal y familiar',
    pensionEmployer: 'Aportación Empresa a Pensiones (%)',
    severancePercent: 'Provisión para Indemnizaciones (%)',
    studyFundEmployer: 'Fondo de Ahorro / Estudios Empresa (%)',
    recuperationMonthly: 'Pagas Extra / Complementos Prorrateados (₪)',
    vacationSickProvision: 'Provisión Vacaciones y Bajas (₪)',
    wellnessAndPerks: 'Cheques Comida / Vehículo / Beneficios (₪)',
    totalEmployerCost: 'Coste Total Empresa Mensual',
    netTakeHome: 'Sueldo Neto a Percibir',
    costMultiplier: 'Multiplicador Coste Empresa / Neto',
    costMultiplierDesc: 'La empresa abona {mult}€ por cada 1€ neto que recibe el trabajador',
    employerBreakdown: 'Desglose Costes de la Empresa',
    employeeDeductions: 'Deducciones e Impuestos del Empleado',
    incomeTax: 'Retención IRPF / Impuesto sobre la Renta',
    nationalInsurance: 'Seguridad Social y Salud',
    pensionEmployee: 'Plan de Pensiones Empleado (6%)',
    studyFundEmployee: 'Fondo de Ahorro Empleado (2.5%)',
    totalDeductions: 'Total Retenciones y Deducciones',
    faqTitle: 'Preguntas Frecuentes sobre Nóminas y Costes Laborales',
    q1: '¿Qué incluye el coste de empresa?',
    a1: 'Incluye el sueldo bruto más las cotizaciones empresariales obligatorias a la seguridad social, fondos de pensiones y provisiones de despido.',
    q2: '¿Cómo influyen las retenciones en el neto?',
    a2: 'El salario neto es el resultado de restar al bruto los impuestos directos y la cuota obrera a la seguridad social.',
    q3: '¿Por qué existe una gran diferencia entre coste y neto?',
    a3: 'Debido a la suma de impuestos directos, cuotas patronales y cargas sociales obligatorias.'
  },
  fr: {
    title: 'Calculateur Coût Employeur vs Salaire Net',
    subtitle: 'Charges Patronales, Cotisations Salariales, Retraite et Impôt sur le Revenu',
    description: 'Calculez le coût total employeur d\'un salarié et son salaire net après déduction des charges sociales, cotisations retraite et prélèvement à la source.',
    grossSalary: 'Salaire Brut Mensuel (₪)',
    creditPoints: 'Parts Fiscales / Crédits d\'Impôt',
    creditPointsDesc: 'Quotient familial et déductions fiscales',
    pensionEmployer: 'Cotisations Retraite Employeur (%)',
    severancePercent: 'Provisions Indemnités de Départ (%)',
    studyFundEmployer: 'Épargne Salariale / Formation (%)',
    recuperationMonthly: 'Primes & Indemnités Mensuelles (₪)',
    vacationSickProvision: 'Provisions Congés Payés (₪)',
    wellnessAndPerks: 'Tickets Restaurant / Mutuelle / Avantages (₪)',
    totalEmployerCost: 'Coût Total Employeur Mensuel',
    netTakeHome: 'Salaire Net Disponible pour le Salarié',
    costMultiplier: 'Multiplicateur Coût / Net',
    costMultiplierDesc: 'L\'employeur dépense {mult}€ pour 1€ net perçu par l\'employé',
    employerBreakdown: 'Détail des Charges Patronales',
    employeeDeductions: 'Cotisations Salariales & Impôts',
    incomeTax: 'Prélèvement à la Source (Impôt sur le Revenu)',
    nationalInsurance: 'Sécurité Sociale & Santé',
    pensionEmployee: 'Retraite Salarié (6%)',
    studyFundEmployee: 'Épargne Salarié (2.5%)',
    totalDeductions: 'Total des Déductions',
    faqTitle: 'Guide et Questions Fréquentes sur la Paie',
    q1: 'Quelles sont les charges obligatoires ?',
    a1: 'Les cotisations patronales de sécurité sociale, les caisses de retraite et les indemnités de fin de contrat.',
    q2: 'Quelle est la part nette restante ?',
    a2: 'Généralement entre 60% et 75% du salaire brut selon le niveau de rémunération et les taux marginaux d\'imposition.',
    q3: 'Comment réduire le multiplicateur de coût ?',
    a3: 'En optimisant les avantages sociaux exonérés de charges comme les titres restaurant ou les plans d\'épargne.'
  },
  ar: {
    title: 'حاسبة تكلفة صاحب العمل مقابل الراتب الصافي للموظف',
    subtitle: 'تفصيل شامل للتأمينات الاجتماعية، الضرائب، صناديق التقاعد والادخار',
    description: 'احسب إجمالي التكلفة الشهرية التي يتحملها المشغل لتوظيف موظف مقابل الراتب الصافي الذي يستلمه الموظف باليد بعد كافة الخصومات الرسمية.',
    grossSalary: 'الراتب الإجمالي - بروتو (₪)',
    creditPoints: 'نقاط الاستحقاق الضريبي',
    creditPointsDesc: '2.25 للرجل المقيم، 2.75 للمرأة المقيمة + نقاط إضافية للأطفال',
    pensionEmployer: 'مساهمة المشغل في صندوق التقاعد (%)',
    severancePercent: 'مخصصات تعويضات نهاية الخدمة (%)',
    studyFundEmployer: 'صندوق الاستكمال والادخار للمشغل (%)',
    recuperationMonthly: 'بدل استجمام شهري (₪)',
    vacationSickProvision: 'مخصصات الإجازات السنوية والمرضية (₪)',
    wellnessAndPerks: 'بدل وجبات / سيارة / مزايا عينية (₪)',
    totalEmployerCost: 'إجمالي تكلفة المشغل الشهرية',
    netTakeHome: 'الراتب الصافي المتبقي للموظف',
    costMultiplier: 'مضاعف تكلفة المشغل إلى الصافي',
    costMultiplierDesc: 'يدفع المشغل ₪{mult} مقابل كل ₪1.00 صافي يستلمه الموظف',
    employerBreakdown: 'تفصيل تكاليف المشغل',
    employeeDeductions: 'استقطاعات وضرائب الموظف',
    incomeTax: 'ضريبة الدخل (بعد خصم النقاط)',
    nationalInsurance: 'التأمين الوطني والتأمين الصحي',
    pensionEmployee: 'تقاعد حصة الموظف (6%)',
    studyFundEmployee: 'صندوق استكمال حصة الموظف (2.5%)',
    totalDeductions: 'إجمالي الاستقطاعات من الراتب',
    faqTitle: 'الأسئلة الشائعة حول الرواتب وتكاليف التوظيف',
    q1: 'ما هي النسبة الإلزامية للتقاعد؟',
    a1: 'يدفع المشغل 6.5% للتقاعد و 6% (أو 8.33%) لمكافأة نهاية الخدمة، ويدفع الموظف 6% من راتبه.',
    q2: 'ما هو سقف الإعفاء لصندوق الاستكمال؟',
    a2: 'سقف الراتب المعفى ضريبياً لصندوق الاستكمال هو 15,712 شيكل شهرياً.',
    q3: 'كيف تؤثر نقاط الاستحقاق على الراتب؟',
    a3: 'كل نقطة استحقاق تخصم 242 شيكل شهرياً من ضريبة الدخل المستحقة على الموظف.'
  }
};

export default function EmployerCost() {
  const { lang } = useI18n();
  const t = localDict[lang as keyof typeof localDict] || localDict.en;

  const [grossSalary, setGrossSalary] = useUrlState<number>('gross', 22000);
  const [creditPoints, setCreditPoints] = useUrlState<number>('credits', 2.25);
  const [pensionEmployerPercent, setPensionEmployerPercent] = useUrlState<number>('pensionEmp', 6.5);
  const [severancePercent, setSeverancePercent] = useUrlState<number>('sevPercent', 8.33);
  const [studyFundEmployerPercent, setStudyFundEmployerPercent] = useUrlState<number>('studyEmp', 7.5);
  const [studyFundEmployeePercent, setStudyFundEmployeePercent] = useUrlState<number>('studyEmpee', 2.5);
  const [recuperationMonthly, setRecuperationMonthly] = useUrlState<number>('recup', 180);
  const [vacationSickProvision, setVacationSickProvision] = useUrlState<number>('vacation', 0);
  const [wellnessAndPerks, setWellnessAndPerks] = useUrlState<number>('perks', 600);

  const results = calculateEmployerCost({
    grossSalary,
    creditPoints,
    pensionEmployerPercent,
    severancePercent,
    studyFundEmployerPercent,
    studyFundEmployeePercent,
    recuperationMonthly,
    vacationSickProvision,
    wellnessAndPerks
  });

  const currencyFormat = new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    maximumFractionDigits: 0
  });

  // Doughnut Chart Data: Distribution of Total Employer Outflow
  const chartData = {
    labels: [
      'שכר נטו לעובד',
      'מס הכנסה',
      'ביטוח לאומי ובריאות (עובד+מעסיק)',
      'חיסכון פנסיוני וקרן השתלמות',
      'הבראה והטבות נלוות'
    ],
    datasets: [
      {
        data: [
          results.netSalary,
          results.incomeTax,
          results.employeeNationalInsurance + results.employerNationalInsurance,
          results.employerPension + results.employerSeverance + results.employerStudyFund + results.employeePension + results.employeeStudyFund,
          results.employerPerksAndProvisions
        ],
        backgroundColor: ['#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6'],
        borderWidth: 0
      }
    ]
  };

  const deferredChartData = useDeferredValue(chartData);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8" id="employer-cost-calc">
      <SEO
        title={`${t.title} | GlobalCalcPro`}
        description={t.description}
        canonicalUrl={`/${lang}/calculators/employer-cost`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: t.title,
          description: t.description,
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Any',
          url: `https://globalcalcpro.com/${lang}/calculators/employer-cost`
        }}
      />

      {/* Header */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
              {t.title}
            </h1>
            <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              {t.subtitle}
            </p>
          </div>
        </div>
        <p className="text-stone-600 dark:text-stone-300 text-sm max-w-2xl leading-relaxed mt-2">
          {t.description}
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Controls (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            נתוני שכר והפרשות
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                {t.grossSalary}
              </label>
              <input
                id="gross-salary-input"
                type="number"
                min="0"
                step="500"
                value={grossSalary || ''}
                onChange={(e) => setGrossSalary(Number(e.target.value))}
                className="w-full px-4 py-3.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-black text-xl text-stone-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex gap-2 mt-2">
                {[12000, 18000, 25000, 35000, 50000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      setGrossSalary(preset);
                      trackCalculation('employer_cost_salary_preset');
                    }}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-950/50"
                  >
                    {currencyFormat.format(preset)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 mb-1">
                  {t.creditPoints}
                </label>
                <input
                  id="credit-points-input"
                  type="number"
                  min="0"
                  max="15"
                  step="0.25"
                  value={creditPoints}
                  onChange={(e) => setCreditPoints(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-stone-900 dark:text-white"
                />
                <p className="text-[11px] text-stone-400 mt-1">{t.creditPointsDesc}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 mb-1">
                  {t.wellnessAndPerks}
                </label>
                <input
                  id="perks-input"
                  type="number"
                  min="0"
                  value={wellnessAndPerks || ''}
                  onChange={(e) => setWellnessAndPerks(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-stone-900 dark:text-white"
                />
              </div>
            </div>

            {/* Advanced Social Benefits */}
            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-4">
              <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                שיעורי הפרשות מעסיק וסוציאליות
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-stone-500 dark:text-stone-400 mb-1">
                    {t.pensionEmployer}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    value={pensionEmployerPercent}
                    onChange={(e) => setPensionEmployerPercent(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold"
                  />
                  <span className="text-[10px] text-stone-400">חוקי: 6.5%</span>
                </div>

                <div>
                  <label className="block text-xs text-stone-500 dark:text-stone-400 mb-1">
                    {t.severancePercent}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.01"
                    value={severancePercent}
                    onChange={(e) => setSeverancePercent(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold"
                  />
                  <span className="text-[10px] text-stone-400">סעיף 14: 8.33% / 6%</span>
                </div>

                <div>
                  <label className="block text-xs text-stone-500 dark:text-stone-400 mb-1">
                    {t.studyFundEmployer}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    value={studyFundEmployerPercent}
                    onChange={(e) => setStudyFundEmployerPercent(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold"
                  />
                  <span className="text-[10px] text-stone-400">עד תקרת 15,712 ₪</span>
                </div>

                <div>
                  <label className="block text-xs text-stone-500 dark:text-stone-400 mb-1">
                    הפרשת עובד לקרן השתלמות (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    value={studyFundEmployeePercent}
                    onChange={(e) => setStudyFundEmployeePercent(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold"
                  />
                  <span className="text-[10px] text-stone-400">סטנדרט: 2.5%</span>
                </div>

                <div>
                  <label className="block text-xs text-stone-500 dark:text-stone-400 mb-1">
                    {t.recuperationMonthly}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={recuperationMonthly}
                    onChange={(e) => setRecuperationMonthly(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold"
                  />
                  <span className="text-[10px] text-stone-400">שווי יום הבראה: 418 ₪</span>
                </div>

                <div>
                  <label className="block text-xs text-stone-500 dark:text-stone-400 mb-1">
                    {t.vacationSickProvision}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={vacationSickProvision}
                    onChange={(e) => setVacationSickProvision(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold"
                  />
                  <span className="text-[10px] text-stone-400">הפרשה חודשית לצבירה</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Live KPI Dashboard (5 Cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-800 space-y-6">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-stone-400 block mb-1">
                {t.totalEmployerCost}
              </span>
              <div className="text-3xl sm:text-4xl font-black text-indigo-400" dir="ltr">
                {currencyFormat.format(results.totalEmployerCost)}
              </div>
              <span className="text-xs text-stone-400 block mt-1">
                ({results.employerCostPercentage}% משכר הברוטו)
              </span>
            </div>

            {/* Net Take-Home */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/80 to-stone-900 border border-emerald-900/50">
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-400 block mb-1">
                {t.netTakeHome}
              </span>
              <div className="text-3xl font-black text-white" dir="ltr">
                {currencyFormat.format(results.netSalary)}
              </div>
              <span className="text-xs text-emerald-200/70 block mt-1">
                ({results.netPercentageOfGross}% מהברוטו נשאר בכיס)
              </span>
            </div>

            {/* Multiplier Badge */}
            <div className="p-4 rounded-2xl bg-indigo-950/50 border border-indigo-800/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-300">{t.costMultiplier}</span>
                <span className="text-lg font-black text-indigo-400">{results.costToNetMultiplier}x</span>
              </div>
              <p className="text-[11px] text-stone-400 mt-1">
                {t.costMultiplierDesc.replace('{mult}', results.costToNetMultiplier.toString())}
              </p>
            </div>

            {/* Doughnut Chart */}
            <div className="w-full h-48 mt-4" dir="ltr">
              <Doughnut
                data={deferredChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  cutout: '70%'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Side-by-Side Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Employer Side */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            {t.employerBreakdown}
          </h3>

          <div className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
            <div className="flex justify-between py-2.5">
              <span className="text-stone-600 dark:text-stone-300">שכר יסוד ברוטו</span>
              <span className="font-bold text-stone-900 dark:text-white">{currencyFormat.format(results.grossSalary)}</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="text-stone-600 dark:text-stone-300">פנסיה מעסיק (תגמולים {pensionEmployerPercent}%)</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">+{currencyFormat.format(results.employerPension)}</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="text-stone-600 dark:text-stone-300">פיצויי פיטורים ({severancePercent}%)</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">+{currencyFormat.format(results.employerSeverance)}</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="text-stone-600 dark:text-stone-300">קרן השתלמות מעסיק ({studyFundEmployerPercent}%)</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">+{currencyFormat.format(results.employerStudyFund)}</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="text-stone-600 dark:text-stone-300">ביטוח לאומי חלק מעסיק</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">+{currencyFormat.format(results.employerNationalInsurance)}</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="text-stone-600 dark:text-stone-300">הבראה, חופשה, סיבוס והטבות</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">+{currencyFormat.format(results.employerPerksAndProvisions)}</span>
            </div>
            <div className="flex justify-between py-3 font-black text-sm bg-stone-50 dark:bg-stone-800/40 px-3 rounded-xl mt-2">
              <span className="text-stone-900 dark:text-white">{t.totalEmployerCost}</span>
              <span className="text-indigo-600 dark:text-indigo-400">{currencyFormat.format(results.totalEmployerCost)}</span>
            </div>
          </div>
        </div>

        {/* Employee Side */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-600" />
            {t.employeeDeductions}
          </h3>

          <div className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
            <div className="flex justify-between py-2.5">
              <span className="text-stone-600 dark:text-stone-300">שכר ברוטו</span>
              <span className="font-bold text-stone-900 dark:text-white">{currencyFormat.format(results.grossSalary)}</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="text-stone-600 dark:text-stone-300">{t.incomeTax}</span>
              <span className="font-bold text-rose-500">-{currencyFormat.format(results.incomeTax)}</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="text-stone-600 dark:text-stone-300">{t.nationalInsurance}</span>
              <span className="font-bold text-rose-500">-{currencyFormat.format(results.employeeNationalInsurance)}</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="text-stone-600 dark:text-stone-300">{t.pensionEmployee}</span>
              <span className="font-bold text-rose-500">-{currencyFormat.format(results.employeePension)}</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="text-stone-600 dark:text-stone-300">{t.studyFundEmployee}</span>
              <span className="font-bold text-rose-500">-{currencyFormat.format(results.employeeStudyFund)}</span>
            </div>
            <div className="flex justify-between py-3 font-black text-sm bg-emerald-50 dark:bg-emerald-950/30 px-3 rounded-xl mt-2">
              <span className="text-stone-900 dark:text-white">{t.netTakeHome}</span>
              <span className="text-emerald-600 dark:text-emerald-400">{currencyFormat.format(results.netSalary)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ & Labor Regulations Guide */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-10 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
        <h3 className="text-xl font-black text-stone-900 dark:text-white flex items-center gap-3">
          <HelpCircle className="w-6 h-6 text-indigo-600" />
          {t.faqTitle}
        </h3>

        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800">
            <h4 className="font-bold text-sm text-stone-900 dark:text-white mb-1.5">{t.q1}</h4>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">{t.a1}</p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800">
            <h4 className="font-bold text-sm text-stone-900 dark:text-white mb-1.5">{t.q2}</h4>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">{t.a2}</p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800">
            <h4 className="font-bold text-sm text-stone-900 dark:text-white mb-1.5">{t.q3}</h4>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">{t.a3}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
