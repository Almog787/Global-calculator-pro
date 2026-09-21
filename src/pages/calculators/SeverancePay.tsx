import React, { useMemo } from 'react';
import { useUrlState } from '../../hooks/useUrlState';
import { useI18n } from '../../contexts/i18n';
import SEO from '../../components/SEO';
import Breadcrumbs from '../../components/Breadcrumbs';
import RelatedCalculators from '../../components/RelatedCalculators';
import ShareActions from '../../components/ShareActions';
import FAQ from '../../components/FAQ';
import CountUp from '../../components/CountUp';
import ShinyText from '../../components/ShinyText';
import { Briefcase, ShieldCheck, Calculator, FileText } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, ChartTooltip, Legend);

const localDict = {
  en: {
    title: 'Severance Pay & Section 14 Calculator',
    subtitle: 'Comprehensive Israel & Global Severance Pay, Tax Exemption Ceiling & Section 14 Employer Completion',
    description: 'Calculate employee severance pay based on tenure and last salary, Section 14 pension deposits, statutory tax-exempt severance limits (13,750 NIS/year), taxable portion, and employer completion payments.',
    lastSalary: 'Last Monthly Gross Salary',
    yearsWorked: 'Years Worked',
    additionalMonths: 'Additional Months Worked',
    section14Toggle: 'Section 14 Arrangement Applies? (סעיף 14)',
    pensionSeveranceRate: 'Employer Monthly Pension Severance Deposit (%)',
    pensionAccumulated: 'Total Severance Balance Already Saved in Pension Fund',
    marginalTaxRate: 'Estimated Marginal Tax Rate on Taxable Portion (%)',
    totalTenure: 'Total Tenure (Years)',
    grossSeverance: 'Total Gross Severance Right',
    exemptAmount: 'Tax-Exempt Severance (Up to 13,750 NIS/year)',
    taxableAmount: 'Taxable Severance Portion',
    estimatedTax: 'Estimated Tax Due on Severance',
    netSeverance: 'Net Take-Home Severance After Tax',
    employerCompletion: 'Required Employer Completion Payment (השלמת פיצויים)',
    pensionFundPart: 'Paid directly from Pension Fund',
    chartTitle: 'Severance Pay Breakdown',
    exempt: 'Tax-Exempt',
    taxable: 'Taxable',
    net: 'Net Take-Home',
    tax: 'Tax Due',
    faqTitle: 'Frequently Asked Questions & Severance Pay Rights',
    q1: 'What is Section 14 of the Israeli Severance Pay Law (סעיף 14)?',
    a1: 'Section 14 allows employers to deposit 6.0% or 8.33% of the employee\'s monthly salary into a pension or severance fund. In return, these funds belong to the employee upon termination, and the employer is released from completing severance retroactively if the employee\'s salary increased, unless agreed otherwise.',
    q2: 'What is the statutory tax-exempt severance limit for 2026?',
    a2: 'Under Section 9(7a) of the Income Tax Ordinance, severance pay is tax-exempt up to 13,750 NIS per year of service (or up to 150% of monthly salary, whichever is lower, up to the ceiling). Any amount exceeding this limit is taxed at the employee\'s marginal income tax rate.',
    q3: 'How is employer severance completion calculated (השלמת פיצויים)?',
    a3: 'When Section 14 does not apply or only applies partially (e.g., 6% instead of 8.33%), the employer must pay the gap between last salary × total years worked and the actual amount accumulated in the pension severance component.'
  },
  he: {
    title: 'מחשבון פיצויי פיטורים וסעיף 14',
    subtitle: 'חישוב פיצויי פיטורים, תקרת פטור ממס (13,750 ₪ לשנה), סעיף 14 והשלמת מעסיק',
    description: 'מחשבון פיצויי פיטורים מתקדם: חשב את זכאות הפיצויים לפי ותק ושכר אחרון, תקרת הפטור ממס הכנסה (13,750 ₪ לשנת עבודה), חלק פטור מול חייב במס, השלמת מעסיק וסעיף 14.',
    lastSalary: 'שכר חודשי אחרון ברוטו (₪)',
    yearsWorked: 'שנות עבודה (ותק מלא)',
    additionalMonths: 'חודשי עבודה נוספים',
    section14Toggle: 'האם חל סעיף 14 לחוק פיצויי פיטורים?',
    pensionSeveranceRate: 'אחוז הפרשת מעסיק לפיצויים בקרן הפנסיה (%)',
    pensionAccumulated: 'צבירת פיצויים קיימת בקרן הפנסיה / קופה (₪)',
    marginalTaxRate: 'שיעור מס שולי משוער על החלק החייב (%)',
    totalTenure: 'סך הכל ותק בשנים',
    grossSeverance: 'סך זכאות פיצויים ברוטו',
    exemptAmount: 'חלק פטור ממס (עד 13,750 ₪ לשנת עבודה)',
    taxableAmount: 'חלק חייב במס הכנסה',
    estimatedTax: 'מס הכנסה מנוכה על הפיצויים',
    netSeverance: 'סך פיצויים נטו בכיס',
    employerCompletion: 'סכום השלמת פיצויים הנדרש מהמעסיק',
    pensionFundPart: 'משולם ישירות מתוך קופת הפנסיה',
    chartTitle: 'תקציר ניתוח פיצויי פיטורים',
    exempt: 'פטור ממס',
    taxable: 'חייב במס',
    net: 'נטו בכיס',
    tax: 'מס לתשלום',
    faqTitle: 'מדריך זכויות, סעיף 14 ופטור ממס על פיצויי פיטורים',
    q1: 'מהו סעיף 14 לחוק פיצויי פיטורים וכיצד הוא משפיע על העובד?',
    a1: 'סעיף 14 קובע כי ההפרשות החודשיות של המעסיק לרכיב הפיצויים בקרן הפנסיה (6% או 8.33%) באות במקום פיצויי פיטורים. היתרון לעובד הוא שהכספים שייכים לו גם במקרה של התפטרות מעצמו, והמעסיק אינו יתרגל חישוב שכר אחרון רטרואקטיבית אלא אם התחייב לכך.',
    q2: 'מהי תקרת הפטור ממס הכנסה על פיצויי פיטורים בשנת 2026?',
    a2: 'לפי סעיף 9(7א) לפקודת מס הכנסה, מענק פרישה/פיצויים פטור ממס עד לסכום של 13,750 ₪ לכל שנת עבודה (או משכורת חודשית אחת לכל שנה, לפי הנמוך). סכום הפיצויים שמעבר לתקרה זו מתווסף להכנסה החייבת ומחויב במס לפי המס השולי של העובד (ניתן לבצע פריסת מס עד 6 שנים).',
    q3: 'כיצד מחושבת השלמת פיצויים על ידי המעסיק (חובת המעביד)?',
    a3: 'כאשר לא חל סעיף 14 מלא (למשל כאשר המעסיק הפריש 6% בלבד במקום 8.33%), המעסיק מחויב לשלם לעובד השלמה במזומן בשיעור 28% מהשכר האחרון כפול שנות הוותק (הפרש בין 8.33% ל-6%), או את ההפרש בין השכר האחרון כפול הוותק לבין הסכום שנצבר בפועל מרכיב הפיצויים בקופה.'
  },
  es: {
    title: 'Calculadora de Indemnización por Despido y Exención Fiscal',
    subtitle: 'Cálculo de Indemnización por Antigüedad, Límites Exentos e Impuestos',
    description: 'Calcula la indemnización por despido según antigüedad y último salario, deducciones fiscales legalmente exentas, tramos impositivos y aportaciones a fondos de pensiones.',
    lastSalary: 'Último Salario Mensual Bruto',
    yearsWorked: 'Años Trabajados',
    additionalMonths: 'Meses Adicionales',
    section14Toggle: '¿Aplica Régimen Especial de Fondo de Reserva?',
    pensionSeveranceRate: 'Porcentaje de Depósito Mensual en Fondo (%)',
    pensionAccumulated: 'Saldo Acumulado Actual en el Fondo',
    marginalTaxRate: 'Tipo Impositivo Marginal Estimado (%)',
    totalTenure: 'Antigüedad Total (Años)',
    grossSeverance: 'Indemnización Bruta Total',
    exemptAmount: 'Parte Exenta de Impuestos',
    taxableAmount: 'Parte Sujeta a Impuestos',
    estimatedTax: 'Impuesto Estimado a Retener',
    netSeverance: 'Indemnización Neta Limpia',
    employerCompletion: 'Pago Adicional Directo de la Empresa',
    pensionFundPart: 'Pagado Directamente desde el Fondo',
    chartTitle: 'Desglose de Indemnización',
    exempt: 'Exento',
    taxable: 'Sujeto a Impuestos',
    net: 'Neto a Percibir',
    tax: 'Impuestos',
    faqTitle: 'Preguntas Frecuentes sobre Indemnización por Despido',
    q1: '¿Cómo se calcula la antigüedad?',
    a1: 'Se calcula proporcionalmente sumando los años completos más la fracción de meses trabajados sobre 12.',
    q2: '¿Qué parte de la indemnización está exenta de impuestos?',
    a2: 'La normativa fija un límite exento por año trabajado, tributando el exceso según la escala general de retenciones del trabajador.',
    q3: '¿Qué ocurre con las aportaciones al fondo de pensiones?',
    a3: 'Los fondos acumulados en la cuenta de despido reducen el importe que la empresa debe abonar directamente en efectivo.'
  },
  fr: {
    title: 'Calculateur d\'Indemnité de Licenciement et Exonération Fiscale',
    subtitle: 'Calcul des Indemnités selon l\'Ancienneté, Plafonds d\'Exonération et Impôts',
    description: 'Calculez votre indemnité légale ou conventionnelle de licenciement, la part exonérée d\'impôt, le reliquat imposable et les versements d\'abondement employeur.',
    lastSalary: 'Dernier Salaire Mensuel Brut',
    yearsWorked: 'Années d\'Ancienneté',
    additionalMonths: 'Mois Supplémentaires',
    section14Toggle: 'Accord Spécifique de Libération Employeur ?',
    pensionSeveranceRate: 'Taux de Cotisation Mensuel Employeur (%)',
    pensionAccumulated: 'Capital Déjà Accumulé sur le Fonds',
    marginalTaxRate: 'Taux Marginal d\'Imposition Estimé (%)',
    totalTenure: 'Ancienneté Totale (Années)',
    grossSeverance: 'Indemnité Brute Totale',
    exemptAmount: 'Partie Exonérée d\'Impôt',
    taxableAmount: 'Partie Imposable',
    estimatedTax: 'Impôt Estimé à Payer',
    netSeverance: 'Indemnité Nette perçue',
    employerCompletion: 'Abondement / Complément Employeur',
    pensionFundPart: 'Versé directement par le Fonds',
    chartTitle: 'Répartition de l\'Indemnité',
    exempt: 'Exonéré',
    taxable: 'Imposable',
    net: 'Net en Poche',
    tax: 'Impôt Dû',
    faqTitle: 'Foire Aux Questions sur le Licenciement',
    q1: 'Comment est calculée l\'ancienneté ?',
    a1: 'L\'ancienneté comprend les années complètes et le prorata des mois travaillés.',
    q2: 'Comment s\'applique l\'exonération fiscale ?',
    a2: 'Un plafond légal annuel exonère d\'impôt l\'indemnité. Tout dépassement est soumis au barème de l\'impôt sur le revenu.',
    q3: 'Quel est le rôle de l\'épargne accumulée ?',
    a3: 'Les sommes déjà versées sur les fonds dédiés viennent en déduction du montant restant à la charge directe de l\'employeur.'
  },
  ar: {
    title: 'حاسبة تعويضات نهاية الخدمة والإعفاء الضريبي',
    subtitle: 'احتساب تعويضات نهاية الخدمة، سقف الإعفاء الضريبي والمبلغ التكميلي للمشغل',
    description: 'احسب تعويضات نهاية الخدمة حسب الأقدمية والراتب الأخير، سقف الإعفاء الضريبي (13,750 شيكل/سنة)، الجزء الخاضع للضريبة والمبلغ التكميلي من المشغل.',
    lastSalary: 'الراتب الشهر الأخير (إجمالي)',
    yearsWorked: 'سنوات العمل (الأقدمية)',
    additionalMonths: 'أشهر إضافية',
    section14Toggle: 'هل ينطبق المادة 14 (ترتيب التقاعد)؟',
    pensionSeveranceRate: 'نسبة إيداع المشغل للتعويضات شهرياً (%)',
    pensionAccumulated: 'المبلغ المتراكم في صندوق التعويضات حالياً',
    marginalTaxRate: 'نسبة الضريبة الحدية المقدرة (%)',
    totalTenure: 'إجمالي فترة العمل (سنوات)',
    grossSeverance: 'إجمالي التعويض المستحق (إجمالي)',
    exemptAmount: 'الجزء المعفى من الضريبة',
    taxableAmount: 'الجزء الخاضع لضريبة الدخل',
    estimatedTax: 'الضريبة المقدرة المخصومة',
    netSeverance: 'صافي التعويض الصافي باليد',
    employerCompletion: 'المبلغ التكميلي المطلوب من المشغل',
    pensionFundPart: 'مدفوع مباشرة من صندوق التقاعد',
    chartTitle: 'تفصيل تعويضات نهاية الخدمة',
    exempt: 'معفى',
    taxable: 'خاضع للضريبة',
    net: 'الصافي باليد',
    tax: 'الضريبة المستحقة',
    faqTitle: 'الأسئلة الشائعة وحقوق تعويضات نهاية الخدمة',
    q1: 'ما هي المادة 14 من قانون التعويضات؟',
    a1: 'تنص المادة 14 على أن الإيداعات الشهرية للمشغل في صندوق التقاعد تحل محل تعويضات نهاية الخدمة وتكون ملكاً للموظف.',
    q2: 'ما هو سقف الإعفاء الضريبي لعام 2026؟',
    a2: 'سقف الإعفاء الضريبي هو 13,750 شيكل عن كل سنة عمل. ما يزيد عن هذا المبلغ يخضع לضريبة الدخل.',
    q3: 'كيف يتم احتساب المبلغ التكميلي من المشغل؟',
    a3: 'إذا لم تنطبق المادة 14 بشكل كامل، يدفع المشغل الفرق بين الراتب الأخير × سنوات العمل والمبلغ المتراكم بالصندوق.'
  }
};

export default function SeverancePay() {
  const { lang } = useI18n();
  const t = localDict[lang as keyof typeof localDict] || localDict.en;

  const [salary, setSalary] = useUrlState<number>('salary', 16000);
  const [years, setYears] = useUrlState<number>('years', 4);
  const [months, setMonths] = useUrlState<number>('months', 6);
  const [isSection14, setIsSection14] = useUrlState<boolean>('sec14', true);
  const [pensionSeveranceRate] = useUrlState<number>('rate', 8.33);
  const [accumulatedPension, setAccumulatedPension] = useUrlState<number>('accum', 50000);
  const [marginalTaxRate, setMarginalTaxRate] = useUrlState<number>('taxRate', 20);

  const results = useMemo(() => {
    const totalTenure = Math.max(0, (years || 0) + ((months || 0) / 12));
    const grossSalary = Math.max(0, salary || 0);

    // Statutory severance right: 1 month salary per year of service
    const grossSeverance = grossSalary * totalTenure;

    // Statutory Tax Exemption ceiling per year of tenure (2026 Israel Tax Authority standard: 13,750 NIS/year)
    const annualExemptionCeiling = 13750;
    const maxExemptCeiling = totalTenure * annualExemptionCeiling;

    // Exempt portion is min(Gross Severance, Max Exempt Ceiling)
    const exemptAmount = Math.min(grossSeverance, maxExemptCeiling);
    const taxableAmount = Math.max(0, grossSeverance - exemptAmount);

    // Tax calculation
    const taxRateFraction = Math.max(0, Math.min(50, marginalTaxRate || 0)) / 100;
    const estimatedTax = taxableAmount * taxRateFraction;
    const netSeverance = Math.max(0, grossSeverance - estimatedTax);

    // Employer Completion (השלמת פיצויים מעסיק)
    let employerCompletion: number;
    let pensionFundPart: number;

    if (isSection14 && pensionSeveranceRate >= 8.33) {
      // Under full Section 14 (8.33%), pension fund holds full liability, no employer cash completion required
      pensionFundPart = grossSeverance;
      employerCompletion = 0;
    } else {
      // Required completion = max(0, Gross Severance - Accumulated Pension Severance)
      const accum = Math.max(0, accumulatedPension || 0);
      pensionFundPart = Math.min(grossSeverance, accum);
      employerCompletion = Math.max(0, grossSeverance - accum);
    }

    return {
      totalTenure: Number(totalTenure.toFixed(2)),
      grossSeverance: Math.round(grossSeverance),
      exemptAmount: Math.round(exemptAmount),
      taxableAmount: Math.round(taxableAmount),
      estimatedTax: Math.round(estimatedTax),
      netSeverance: Math.round(netSeverance),
      employerCompletion: Math.round(employerCompletion),
      pensionFundPart: Math.round(pensionFundPart)
    };
  }, [salary, years, months, isSection14, pensionSeveranceRate, accumulatedPension, marginalTaxRate]);

  const currencySymbol = lang === 'he' ? '₪' : '$';

  const chartData = {
    labels: [t.exempt, t.taxable, t.tax],
    datasets: [{
      data: [results.exemptAmount, Math.max(0, results.taxableAmount - results.estimatedTax), results.estimatedTax],
      backgroundColor: ['#10b981', '#3b82f6', '#ef4444'],
      borderWidth: 0,
    }],
  };

  const chartOptions = {
    animation: false as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const },
    },
    cutout: '70%',
  };

  const faqList = [
    { question: t.q1, answer: t.a1 },
    { question: t.q2, answer: t.a2 },
    { question: t.q3, answer: t.a3 },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <SEO
        title={t.title}
        description={t.description}
        canonicalUrl={`/${lang}/calculators/severance-pay`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: t.title,
          description: t.description,
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Any',
        }}
      />

      <Breadcrumbs items={[
        { label: lang === 'he' ? 'כל המחשבונים' : 'All Calculators', path: `/${lang}/all` },
        { label: t.title }
      ]} />

      {/* Hero Title */}
      <div className="bg-surface-container-lowest border border-border-subtle rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <Briefcase className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">
              {t.title}
            </h1>
            <p className="text-on-surface-variant mt-1 text-sm sm:text-base">
              {t.subtitle}
            </p>
          </div>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-900/20 px-5 py-3 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 text-right rtl:text-right ltr:text-left shrink-0 w-full md:w-auto">
          <div className="flex items-center justify-between gap-3 mb-0.5">
            <span className="text-xs text-emerald-800 dark:text-emerald-300 font-medium block">
              {t.grossSeverance}
            </span>
            <ShinyText text="2026 TAX CAP" speed={3} className="text-[10px] text-emerald-700 dark:text-emerald-300 font-mono" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            <CountUp to={Math.round(results.grossSeverance)} prefix={currencySymbol} duration={0.6} />
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-7 bg-surface-container-lowest border border-border-subtle rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            <span>{lang === 'he' ? 'פרטי השכר והוותק' : 'Tenure & Salary Parameters'}</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1.5">
                {t.lastSalary}
              </label>
              <div className="relative">
                <span className="absolute top-1/2 -translate-y-1/2 ltr:left-4 rtl:right-4 text-on-surface-variant font-medium">
                  {currencySymbol}
                </span>
                <input
                  type="number"
                  min="0"
                  value={salary || ''}
                  onChange={(e) => setSalary(Number(e.target.value))}
                  className="w-full bg-surface-container-low border border-border-subtle rounded-xl ltr:pl-8 rtl:pr-8 px-4 py-3 text-lg font-semibold text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1.5">
                  {t.yearsWorked}
                </label>
                <input
                  type="number"
                  min="0"
                  value={years || ''}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full bg-surface-container-low border border-border-subtle rounded-xl px-4 py-3 text-lg font-semibold text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1.5">
                  {t.additionalMonths}
                </label>
                <input
                  type="number"
                  min="0"
                  max="11"
                  value={months || ''}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  className="w-full bg-surface-container-low border border-border-subtle rounded-xl px-4 py-3 text-lg font-semibold text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Section 14 Toggle */}
            <div className="p-4 bg-surface-container-low rounded-2xl border border-border-subtle space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-on-surface flex items-center gap-2 cursor-pointer">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span>{t.section14Toggle}</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsSection14(!isSection14)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isSection14 ? 'bg-primary' : 'bg-surface-container-high'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isSection14 ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-1 rtl:-translate-x-1'}`} />
                </button>
              </div>

              {!isSection14 && (
                <div className="pt-2 border-t border-border-subtle/60 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">
                      {t.pensionAccumulated}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={accumulatedPension || ''}
                      onChange={(e) => setAccumulatedPension(Number(e.target.value))}
                      className="w-full bg-surface-container-lowest border border-border-subtle rounded-lg px-3 py-2 text-sm font-medium text-on-surface"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Marginal Tax Rate Input */}
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1.5">
                {t.marginalTaxRate}
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={marginalTaxRate || ''}
                onChange={(e) => setMarginalTaxRate(Number(e.target.value))}
                className="w-full bg-surface-container-low border border-border-subtle rounded-xl px-4 py-3 text-lg font-semibold text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
          </div>
        </div>

        {/* Results & Visual Chart Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface-container-lowest border border-border-subtle rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <span>{lang === 'he' ? 'סיכום זכאות וניכויי מס' : 'Severance & Tax Breakdown'}</span>
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border-subtle text-sm">
                <span className="text-on-surface-variant">{t.totalTenure}</span>
                <span className="font-semibold text-on-surface">{results.totalTenure} {lang === 'he' ? 'שנים' : 'years'}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border-subtle text-sm">
                <span className="text-on-surface-variant">{t.exemptAmount}</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {currencySymbol}{results.exemptAmount.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border-subtle text-sm">
                <span className="text-on-surface-variant">{t.taxableAmount}</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  {currencySymbol}{results.taxableAmount.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border-subtle text-sm">
                <span className="text-on-surface-variant">{t.estimatedTax}</span>
                <span className="font-semibold text-rose-600 dark:text-rose-400">
                  -{currencySymbol}{results.estimatedTax.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 pt-4 text-base font-bold text-on-surface">
                <span>{t.netSeverance}</span>
                <span className="text-2xl text-emerald-600 dark:text-emerald-400">
                  <CountUp to={Math.round(results.netSeverance)} prefix={currencySymbol} duration={0.6} />
                </span>
              </div>
            </div>

            {/* Employer completion callout if needed */}
            {!isSection14 && results.employerCompletion > 0 && (
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl text-sm space-y-1">
                <div className="font-bold text-amber-900 dark:text-amber-200">
                  {t.employerCompletion}
                </div>
                <div className="text-xl font-bold text-amber-700 dark:text-amber-400">
                  {currencySymbol}{results.employerCompletion.toLocaleString()}
                </div>
                <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-1">
                  {lang === 'he' 
                    ? '* סכום זה נדרש לשילום ישירות מהמעסיק כהשלמת פיצויים במזומן מעבר לסכום שנצבר בקופה.' 
                    : '* Required cash payout directly from employer to complement existing pension deposits.'}
                </p>
              </div>
            )}

            {/* Doughnut Chart */}
            <div className="h-44 relative flex items-center justify-center pt-2">
              <Doughnut data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Component */}
      <FAQ items={faqList} title={t.faqTitle} />

      <ShareActions calculatorTitle={t.title} calculatorPath="/calculators/severance-pay" />

      <RelatedCalculators currentId="/calculators/severance-pay" />
    </div>
  );
}
