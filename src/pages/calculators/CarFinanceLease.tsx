import React, { useMemo, useState } from 'react';
import { useUrlState } from '../../hooks/useUrlState';
import { useI18n } from '../../contexts/i18n';
import SEO from '../../components/SEO';
import FAQ from '../../components/FAQ';
import CountUp from '../../components/CountUp';
import { calculateCarFinanceComparison } from '../../lib/math/carFinance';
import { sanitizeExcelRows } from '../../lib/export/excelExport';
import * as XLSX from 'xlsx';
import { Car, DollarSign, Download, CheckCircle2, TrendingDown, Percent, Sparkles, Scale } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const localDict = {
  en: {
    title: 'Car Finance vs Lease vs Cash Calculator',
    subtitle: 'Comprehensive 3-Way Auto Acquisition Comparison & Total Cost of Ownership',
    description: 'Compare financing a car loan, leasing, or paying in full cash. Evaluate monthly payments, retained equity, depreciation, and net lifetime costs.',
    vehiclePrice: 'Vehicle Price ($)',
    downPayment: 'Loan Down Payment ($)',
    loanTerm: 'Loan Term (Months)',
    loanRate: 'Loan APR Interest Rate (%)',
    salesTax: 'Sales Tax Rate (%)',
    fees: 'Registration & Dealer Fees ($)',
    leaseTerm: 'Lease Term (Months)',
    leaseApr: 'Lease APR or Money Factor (%)',
    leaseDown: 'Lease Down Payment ($)',
    leaseResidual: 'Lease Residual Value (%)',
    oppReturn: 'Investment Return Rate / Opp. Cost (%)',
    depreciation: 'Annual Vehicle Depreciation (%)',
    recommendedBadge: 'Optimal Financial Choice',
    loanOption: 'Loan Financing',
    leaseOption: 'Leasing',
    cashOption: 'Cash Purchase',
    monthlyPay: 'Monthly Payment',
    upfrontPaid: 'Upfront Out-of-Pocket',
    totalSpent: 'Total Cash Outlay',
    retainedEquity: 'Retained Vehicle Equity',
    netCost: 'Net True Cost of Ownership',
    exportSchedule: 'Export Amortization Schedule (.xlsx)',
    comparisonChart: 'Net Cost & Outlay Comparison',
    presetEconomy: 'Economy Commuter ($25,000)',
    presetFamily: 'Family SUV ($45,000)',
    presetLuxury: 'Luxury EV ($70,000)',
    faqTitle: 'Frequently Asked Questions: Buy vs Finance vs Lease',
    q1: 'Is it better to lease or finance a new car?',
    a1: 'Leasing offers lower monthly payments and lower upfront costs, making it ideal for drivers who prefer driving a new car every 3 years. Financing builds equity; once the loan is paid off, you own the asset outright with no ongoing payments.',
    q2: 'How is the Net True Cost of Ownership calculated?',
    a2: 'Net Cost takes all upfront fees and monthly payments plus opportunity cost of capital, and subtracts the retained resale value of the car at the end of the term.',
    q3: 'Why does paying in cash involve an opportunity cost?',
    a3: 'Paying $40,000 upfront in cash means that money cannot be invested elsewhere (e.g. at 6% annual return in index funds). The calculator factors in this lost compound return.',
  },
  he: {
    title: 'מחשבון ליסינג מול מימון מול רכישה במזומן',
    subtitle: 'השוואה תלת-ממדית מדויקת: מימון בנקאי, ליסינג פרטי/תפעולי או קנייה ישירה',
    description: 'חשב והשווה בין הלוואת מימון לרכב, עסקת ליסינג או תשלום מלא במזומן. גלה את התשלום החודשי, ירידת הערך, שווי הרכב הנותר והעלות הכוללת האמיתית.',
    vehiclePrice: 'מחיר הרכב (₪)',
    downPayment: 'מקדמה בהלוואה (₪)',
    loanTerm: 'תקופת הלוואה (חודשים)',
    loanRate: 'ריבית שנתית על ההלוואה (%)',
    salesTax: 'מע"מ / מס (%)',
    fees: 'אגרות רישוי וטיפול (₪)',
    leaseTerm: 'תקופת הליסינג (חודשים)',
    leaseApr: 'ריבית ליסינג משוקללת (%)',
    leaseDown: 'מקדמה בליסינג (₪)',
    leaseResidual: 'שווי רכב בסוף תקופה / אופציה (%)',
    oppReturn: 'תשואה שנתית אלטרנטיבית על הכסף (%)',
    depreciation: 'ירידת ערך שנתית של הרכב (%)',
    recommendedBadge: 'הבחירה הכלכלית המומלצת',
    loanOption: 'מימון / הלוואת רכב',
    leaseOption: 'עסקת ליסינג',
    cashOption: 'רכישה במזומן',
    monthlyPay: 'תשלום חודשי',
    upfrontPaid: 'הון עצמי ומקדמה',
    totalSpent: 'סך תשלומים מצטברים',
    retainedEquity: 'שווי רכב שנשאר בבעלותך',
    netCost: 'עלות בעלות נטו אמיתית',
    exportSchedule: 'ייצוא לוח סילוקין ופחת לאקסל (.xlsx)',
    comparisonChart: 'השוואת עלות נטו ותשלומים',
    presetEconomy: 'רכב עירוני חסכוני (₪100,000)',
    presetFamily: 'רכב משפחתי / קרוסאובר (₪180,000)',
    presetLuxury: 'רכב חשמלי / פרימיום (₪260,000)',
    faqTitle: 'שאלות ותשובות נפוצות על מימון וליסינג לרכב',
    q1: 'מה עדיף – ליסינג או מימון והלוואה?',
    a1: 'ליסינג מאפשר תשלום חודשי נמוך יותר ורכב חדש כל 3 שנים ללא דאגות מכירה. מאידך, מימון והלוואה משאירים את הרכב בבעלותך כנכס בתום תקופת ההלוואה ולרוב זולים יותר בטווח הארוך.',
    q2: 'כיצד מחושבת עלות הבעלות נטו (Net Cost)?',
    a2: 'עלות נטו מחשבת את כל התשלומים, המקדמות ועלות הכסף האלטרנטיבית, ומקזזת את השווי הריאלי של הרכב שנותר בבעלותך.',
    q3: 'מהי עלות אלטרנטיבית ברכישה במזומן?',
    a3: 'הוצאת מאות אלפי שקלים במזומן בבת אחת מונעת מהכסף לצבור תשואה באפיקי השקעה (למשל 5%-6% בשנה). המחשבון משקלל אובדן תשואה זה.',
  },
  es: {
    title: 'Calculadora de Financiamiento vs Leasing vs Contado',
    subtitle: 'Comparación completa de adquisición y costo total de propiedad',
    description: 'Compara préstamo de auto, leasing y compra al contado. Analiza pagos mensuales, plusvalía retenida y costo neto real.',
    vehiclePrice: 'Precio del Vehículo ($)',
    downPayment: 'Enganche del Préstamo ($)',
    loanTerm: 'Plazo del Préstamo (Meses)',
    loanRate: 'Tasa de Interés Anual (%)',
    salesTax: 'Impuesto de Venta (%)',
    fees: 'Gastos de Registro ($)',
    leaseTerm: 'Plazo del Leasing (Meses)',
    leaseApr: 'Tasa Estimada del Leasing (%)',
    leaseDown: 'Pago Inicial Leasing ($)',
    leaseResidual: 'Valor Residual al Final (%)',
    oppReturn: 'Rendimiento de Inversión Alternativo (%)',
    depreciation: 'Depreciación Anual del Auto (%)',
    recommendedBadge: 'Opción Financiera Óptima',
    loanOption: 'Financiamiento / Préstamo',
    leaseOption: 'Leasing / Arrendamiento',
    cashOption: 'Pago al Contado',
    monthlyPay: 'Pago Mensual',
    upfrontPaid: 'Desembolso Inicial',
    totalSpent: 'Total Pagos Realizados',
    retainedEquity: 'Valor del Auto Retenido',
    netCost: 'Costo Neto Real de Propiedad',
    exportSchedule: 'Exportar Tabla a Excel (.xlsx)',
    comparisonChart: 'Comparativa de Costo Neto',
    presetEconomy: 'Auto Económico ($25,000)',
    presetFamily: 'SUV Familiar ($45,000)',
    presetLuxury: 'Vehículo Eléctrico Premium ($70,000)',
    faqTitle: 'Preguntas Frecuentes sobre Compra vs Leasing',
    q1: '¿Conviene más hacer leasing o financiar?',
    a1: 'El leasing ofrece cuotas mensuales más bajas pero no deja el auto a tu nombre. El financiamiento genera plusvalía y el auto es tuyo.',
    q2: '¿Qué es el costo neto real?',
    a2: 'Es la suma de todos los pagos menos el valor de reventa que conservas al final.',
    q3: '¿Por qué pagar al contado tiene un costo de oportunidad?',
    a3: 'El dinero pagado de golpe no puede invertirse en fondos que generen rentabilidad anual.',
  },
  fr: {
    title: 'Crédit Auto vs Leasing (LOA/LLD) vs Comptant',
    subtitle: 'Comparateur complet des modes de financement automobile',
    description: 'Comparez le crédit automobile classique, le leasing (LOA/LLD) et l\'achat au comptant pour identifier la formule la plus avantageuse.',
    vehiclePrice: 'Prix du Véhicule (€)',
    downPayment: 'Apport Crédit (€)',
    loanTerm: 'Durée du Prêt (Mois)',
    loanRate: 'Taux Annuel Effectif Global (%)',
    salesTax: 'TVA (%)',
    fees: 'Frais de Dossier et Carte Grise (€)',
    leaseTerm: 'Durée du Leasing (Mois)',
    leaseApr: 'Taux Équivalent Leasing (%)',
    leaseDown: 'Premier Loyer Majoré (€)',
    leaseResidual: 'Valeur Résiduelle / Option d\'Achat (%)',
    oppReturn: 'Rendement de Placement Alternatif (%)',
    depreciation: 'Décote Annuelle du Véhicule (%)',
    recommendedBadge: 'Meilleur Choix Économique',
    loanOption: 'Crédit Automobile',
    leaseOption: 'Leasing (LOA / LLD)',
    cashOption: 'Achat Comptant',
    monthlyPay: 'Mensualité',
    upfrontPaid: 'Apport Initial',
    totalSpent: 'Total Décaissé',
    retainedEquity: 'Valeur Résiduelle Conservée',
    netCost: 'Coût Réel Net de Détention',
    exportSchedule: 'Exporter vers Excel (.xlsx)',
    comparisonChart: 'Comparaison des Coûts Nets',
    presetEconomy: 'Citadine Économique (25 000 €)',
    presetFamily: 'SUV Familial (45 000 €)',
    presetLuxury: 'Véhicule Électrique Haut de Gamme (70 000 €)',
    faqTitle: 'Questions Fréquentes sur le Financement Automobile',
    q1: 'Est-il plus avantageux de louer (LOA) ou d\'acheter à crédit ?',
    a1: 'Le leasing réduit les mensualités mais ne vous laisse aucun capital à terme. Le crédit vous rend propriétaire du véhicule.',
    q2: 'Comment est calculé le coût net ?',
    a2: 'Il intègre toutes les mensualités et déduit la valeur résiduelle du véhicule à la revente.',
    q3: 'Quel est le coût d\'opportunité du paiement comptant ?',
    a3: 'L\'argent dépensé d\'un coup ne produit plus d\'intérêts sur vos comptes d\'épargne.',
  },
  ar: {
    title: 'حاسبة تمويل السيارات مقابل التأجير التمويلي والنقد',
    subtitle: 'مقارنة شاملة ودقيقة لاقتناء السيارات وتكلفة التملك الحقيقية',
    description: 'قارن بين القرض البنكي، عقد التأجير (الليسينغ)، والدفع نقداً بالكامل لتحديد الخيار الأوفر مالياً.',
    vehiclePrice: 'سعر السيارة ($)',
    downPayment: 'الدفعة الأولى للقرض ($)',
    loanTerm: 'مدة القرض (بالأشهر)',
    loanRate: 'معدل الفائدة السنوي (%)',
    salesTax: 'الضريبة (%)',
    fees: 'رسوم التسجيل والخدمات ($)',
    leaseTerm: 'مدة التأجير (بالأشهر)',
    leaseApr: 'معدل فائدة التأجير (%)',
    leaseDown: 'دفعة التأجير الأولى ($)',
    leaseResidual: 'القيمة المتبقية التقديرية (%)',
    oppReturn: 'العائد الاستثماري البديل للسيولة (%)',
    depreciation: 'نسبة استهلاك السيارة سنوياً (%)',
    recommendedBadge: 'الخيار المالي الأفضل',
    loanOption: 'التمويل البنكي',
    leaseOption: 'التأجير التمويلي',
    cashOption: 'الشراء نقداً',
    monthlyPay: 'القسط الشهري',
    upfrontPaid: 'المبلغ المدفوع مقدماً',
    totalSpent: 'إجمالي المبالغ المدفوعة',
    retainedEquity: 'قيمة السيارة المتبقية ملكك',
    netCost: 'صافي التكلفة الحقيقية',
    exportSchedule: 'تصدير جدول السداد لإكسل (.xlsx)',
    comparisonChart: 'مقارنة التكاليف الإجمالية',
    presetEconomy: 'سيارة اقتصادية (25,000$)',
    presetFamily: 'سيارة عائلية (45,000$)',
    presetLuxury: 'سيارة كهربائية فاخرة (70,000$)',
    faqTitle: 'الأسئلة الشائعة حول تمويل السيارات',
    q1: 'هل التأجير أفضل أم التمويل البنكي؟',
    a1: 'التأجير يمنحك أقساطاً شهرية أقل وسيارة جديدة باستمرار، بينما التمويل يجعلك مالكاً للسيارة بعد سداد القرض.',
    q2: 'ما هي صافي التكلفة الحقيقية؟',
    a2: 'مجموع الأقساط والمصاريف مخصوماً منها القيمة السوقية للسيارة في نهاية الفترة.',
    q3: 'ما هي تكلفة الفرصة البديلة للشراء نقداً؟',
    a3: 'دفع المبلغ نقداً بالكامل يمنعك من استثماره وجني عوائد مركبة سنوية.',
  },
  ru: {
    title: 'Калькулятор автокредита, лизинга и покупки за наличные',
    subtitle: 'Комплексное сравнение 3 вариантов приобретения и реальной стоимости владения',
    description: 'Сравните автокредит, лизинг и покупку за наличные: ежемесячные платежи, остаточная стоимость и чистые затраты.',
    vehiclePrice: 'Стоимость автомобиля ($)',
    downPayment: 'Первоначальный взнос ($)',
    loanTerm: 'Срок кредита (месяцев)',
    loanRate: 'Процентная ставка по кредиту (%)',
    salesTax: 'Налог / НДС (%)',
    fees: 'Регистрационные сборы ($)',
    leaseTerm: 'Срок лизинга (месяцев)',
    leaseApr: 'Эффективная ставка лизинга (%)',
    leaseDown: 'Первый платеж по лизингу ($)',
    leaseResidual: 'Остаточная стоимость автомобиля (%)',
    oppReturn: 'Альтернативная доходность на капитал (%)',
    depreciation: 'Годовой износ / удешевление авто (%)',
    recommendedBadge: 'Оптимальный финансовый выбор',
    loanOption: 'Автокредит',
    leaseOption: 'Лизинг',
    cashOption: 'Покупка за наличные',
    monthlyPay: 'Ежемесячный платеж',
    upfrontPaid: 'Первоначальные расходы',
    totalSpent: 'Всего выплачено',
    retainedEquity: 'Остаточная стоимость авто',
    netCost: 'Чистая реальная стоимость владения',
    exportSchedule: 'Экспорт графика в Excel (.xlsx)',
    comparisonChart: 'Сравнение затрат',
    presetEconomy: 'Эконом-класс ($25,000)',
    presetFamily: 'Семейный кроссовер ($45,000)',
    presetLuxury: 'Премиальный электромобиль ($70,000)',
    faqTitle: 'Частые вопросы: кредит, лизинг или наличные',
    q1: 'Что выгоднее: автокредит или лизинг?',
    a1: 'Лизинг обеспечивает меньший ежемесячный платеж, но по окончании срока машина не остается в вашей собственности. Кредит оставляет автомобиль вам.',
    q2: 'Как рассчитывается чистая стоимость владения?',
    a2: 'Из суммы всех платежей и упущенной выгоды вычитается остаточная рыночная стоимость авто.',
    q3: 'В чем упущенная выгода при покупке за наличные?',
    a3: 'Единоразово потраченная крупная сумма могла бы приносить процентный доход на депозитах или фондовом рынке.',
  },
};

export default function CarFinanceLease() {
  const { lang } = useI18n();
  const d = localDict[lang as keyof typeof localDict] || localDict.en;

  // URL State Hooks
  const [vehiclePrice, setVehiclePrice] = useUrlState('price', 35000);
  const [downPayment, setDownPayment] = useUrlState('down', 5000);
  const [loanTermMonths, setLoanTermMonths] = useUrlState('term', 48);
  const [loanInterestRateAnnual, setLoanInterestRateAnnual] = useUrlState('rate', 6.0);
  const [salesTaxPercent, setSalesTaxPercent] = useUrlState('tax', 0);
  const [feesAndRegistration] = useUrlState('fees', 500);

  const [leaseTermMonths, setLeaseTermMonths] = useUrlState('lterm', 36);
  const [leaseMoneyFactorOrApr, setLeaseMoneyFactorOrApr] = useUrlState('lapr', 4.5);
  const [leaseDownPayment, setLeaseDownPayment] = useUrlState('ldown', 2500);
  const [leaseResidualPercent, setLeaseResidualPercent] = useUrlState('lres', 55);
  const [investmentReturnRateAnnual, setInvestmentReturnRateAnnual] = useUrlState('opp', 5.0);
  const [annualDepreciationRate, setAnnualDepreciationRate] = useUrlState('deprec', 15.0);

  const [isExporting, setIsExporting] = useState(false);

  const results = useMemo(() => {
    return calculateCarFinanceComparison({
      vehiclePrice,
      downPayment,
      loanTermMonths,
      loanInterestRateAnnual,
      salesTaxPercent,
      feesAndRegistration,
      leaseTermMonths,
      leaseMoneyFactorOrApr,
      leaseDownPayment,
      leaseResidualPercent,
      leaseDispositionFee: 350,
      leaseAcquisitionFee: 650,
      investmentReturnRateAnnual,
      annualDepreciationRate,
    });
  }, [
    vehiclePrice,
    downPayment,
    loanTermMonths,
    loanInterestRateAnnual,
    salesTaxPercent,
    feesAndRegistration,
    leaseTermMonths,
    leaseMoneyFactorOrApr,
    leaseDownPayment,
    leaseResidualPercent,
    investmentReturnRateAnnual,
    annualDepreciationRate,
  ]);

  const chartData = useMemo(() => {
    return {
      labels: [d.loanOption, d.leaseOption, d.cashOption],
      datasets: [
        {
          label: d.totalSpent,
          data: [
            results.finance.totalPaymentsOverTerm + results.finance.upfrontOutOfPocket,
            results.lease.totalPaymentsOverTerm + results.lease.upfrontOutOfPocket,
            results.cash.upfrontOutOfPocket,
          ],
          backgroundColor: 'rgba(59, 130, 246, 0.65)',
          borderColor: '#3b82f6',
          borderWidth: 1.5,
          borderRadius: 6,
        },
        {
          label: d.netCost,
          data: [
            results.finance.netCostOfOwnership,
            results.lease.netCostOfOwnership,
            results.cash.netCostOfOwnership,
          ],
          backgroundColor: 'rgba(16, 185, 129, 0.65)',
          borderColor: '#10b981',
          borderWidth: 1.5,
          borderRadius: 6,
        },
      ],
    };
  }, [results, d]);

  const handleExportExcel = () => {
    setIsExporting(true);
    try {
      const summaryRows = [
        ['Parameter', 'Value'],
        ['Vehicle Price', vehiclePrice],
        ['Finance Monthly Payment', results.finance.monthlyPayment],
        ['Finance Net True Cost', results.finance.netCostOfOwnership],
        ['Lease Monthly Payment', results.lease.monthlyPayment],
        ['Lease Net True Cost', results.lease.netCostOfOwnership],
        ['Cash Purchase Net True Cost', results.cash.netCostOfOwnership],
        ['Recommended Choice', results.recommendedOption],
      ];

      const scheduleHeaders = ['Month', 'Payment', 'Principal', 'Interest', 'Remaining Loan Balance', 'Estimated Car Value'];
      const scheduleRows = results.amortizationSchedule.map((row) => [
        row.month,
        row.payment,
        row.principal,
        row.interest,
        row.remainingBalance,
        row.vehicleValue,
      ]);

      const wb = XLSX.utils.book_new();
      const wsSummary = XLSX.utils.aoa_to_sheet(sanitizeExcelRows(summaryRows));
      const wsSchedule = XLSX.utils.aoa_to_sheet(sanitizeExcelRows([scheduleHeaders, ...scheduleRows]));

      XLSX.utils.book_append_sheet(wb, wsSummary, 'Comparison Summary');
      XLSX.utils.book_append_sheet(wb, wsSchedule, 'Amortization & Value');
      XLSX.writeFile(wb, `GlobalCalcPro_CarFinanceVsLease_${new Date().toISOString().slice(0, 10)}.xlsx`);
    } finally {
      setIsExporting(false);
    }
  };

  const applyPreset = (price: number, down: number, term: number) => {
    setVehiclePrice(price);
    setDownPayment(down);
    setLoanTermMonths(term);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fadeIn">
      <SEO
        title={d.title}
        description={d.description}
        canonicalUrl="/calculators/car-finance-lease"
      />

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
          <Scale className="w-4 h-4" />
          <span>{d.title}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
          {d.title}
        </h1>
        <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl mx-auto">
          {d.subtitle}
        </p>
      </div>

      {/* Preset Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => applyPreset(25000, 3000, 48)}
          className="px-3.5 py-1.5 rounded-lg border border-border-subtle bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-all"
        >
          {d.presetEconomy}
        </button>
        <button
          onClick={() => applyPreset(45000, 7000, 60)}
          className="px-3.5 py-1.5 rounded-lg border border-border-subtle bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-all"
        >
          {d.presetFamily}
        </button>
        <button
          onClick={() => applyPreset(70000, 12000, 60)}
          className="px-3.5 py-1.5 rounded-lg border border-border-subtle bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-all"
        >
          {d.presetLuxury}
        </button>
      </div>

      {/* Recommendation Banner */}
      <div className="p-4 sm:p-6 rounded-2xl bg-linear-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500 text-white shadow-md">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {d.recommendedBadge}
            </div>
            <div className="text-lg font-black text-on-surface capitalize">
              {results.recommendedOption === 'finance'
                ? d.loanOption
                : results.recommendedOption === 'lease'
                ? d.leaseOption
                : d.cashOption}
            </div>
            <div className="text-xs text-on-surface-variant max-w-xl">
              {results.recommendationReason}
            </div>
          </div>
        </div>
        <button
          onClick={handleExportExcel}
          disabled={isExporting}
          className="px-4 py-2 rounded-xl bg-surface-container border border-border-subtle hover:bg-surface-container-high text-xs font-bold text-on-surface flex items-center gap-2 transition-all shrink-0 cursor-pointer shadow-xs"
        >
          <Download className="w-4 h-4 text-primary" />
          <span>{d.exportSchedule}</span>
        </button>
      </div>

      {/* 3-Way Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Loan Finance Card */}
        <div className={`p-5 rounded-2xl border transition-all ${results.recommendedOption === 'finance' ? 'border-primary shadow-lg bg-surface-container-low ring-2 ring-primary/20' : 'border-border-subtle bg-surface-container-lowest'}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="font-extrabold text-base text-on-surface flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-blue-500" />
              {d.loanOption}
            </span>
            {results.recommendedOption === 'finance' && (
              <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-bold">Best Value</span>
            )}
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-on-surface-variant">{d.monthlyPay}</div>
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                $<CountUp end={results.finance.monthlyPayment} />
                <span className="text-xs font-normal text-on-surface-variant">/mo</span>
              </div>
            </div>
            <div className="pt-2 border-t border-border-subtle grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-on-surface-variant">{d.upfrontPaid}:</span>
                <p className="font-bold text-on-surface">${results.finance.upfrontOutOfPocket.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-on-surface-variant">{d.retainedEquity}:</span>
                <p className="font-bold text-emerald-600">${results.finance.residualVehicleValue.toLocaleString()}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-border-subtle">
              <div className="text-xs text-on-surface-variant">{d.netCost}</div>
              <div className="text-lg font-extrabold text-on-surface">
                ${results.finance.netCostOfOwnership.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Lease Card */}
        <div className={`p-5 rounded-2xl border transition-all ${results.recommendedOption === 'lease' ? 'border-primary shadow-lg bg-surface-container-low ring-2 ring-primary/20' : 'border-border-subtle bg-surface-container-lowest'}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="font-extrabold text-base text-on-surface flex items-center gap-1.5">
              <Car className="w-4 h-4 text-purple-500" />
              {d.leaseOption}
            </span>
            {results.recommendedOption === 'lease' && (
              <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-bold">Best Value</span>
            )}
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-on-surface-variant">{d.monthlyPay}</div>
              <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
                $<CountUp end={results.lease.monthlyPayment} />
                <span className="text-xs font-normal text-on-surface-variant">/mo</span>
              </div>
            </div>
            <div className="pt-2 border-t border-border-subtle grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-on-surface-variant">{d.upfrontPaid}:</span>
                <p className="font-bold text-on-surface">${results.lease.upfrontOutOfPocket.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-on-surface-variant">{d.retainedEquity}:</span>
                <p className="font-bold text-on-surface-variant">$0 (Rented)</p>
              </div>
            </div>
            <div className="pt-2 border-t border-border-subtle">
              <div className="text-xs text-on-surface-variant">{d.netCost}</div>
              <div className="text-lg font-extrabold text-on-surface">
                ${results.lease.netCostOfOwnership.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Cash Card */}
        <div className={`p-5 rounded-2xl border transition-all ${results.recommendedOption === 'cash' ? 'border-primary shadow-lg bg-surface-container-low ring-2 ring-primary/20' : 'border-border-subtle bg-surface-container-lowest'}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="font-extrabold text-base text-on-surface flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-emerald-500" />
              {d.cashOption}
            </span>
            {results.recommendedOption === 'cash' && (
              <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-bold">Best Value</span>
            )}
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-on-surface-variant">{d.monthlyPay}</div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                $0
                <span className="text-xs font-normal text-on-surface-variant">/mo</span>
              </div>
            </div>
            <div className="pt-2 border-t border-border-subtle grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-on-surface-variant">{d.upfrontPaid}:</span>
                <p className="font-bold text-on-surface">${results.cash.upfrontOutOfPocket.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-on-surface-variant">{d.retainedEquity}:</span>
                <p className="font-bold text-emerald-600">${results.cash.residualVehicleValue.toLocaleString()}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-border-subtle">
              <div className="text-xs text-on-surface-variant">{d.netCost}</div>
              <div className="text-lg font-extrabold text-on-surface">
                ${results.cash.netCostOfOwnership.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Input Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-surface-container-low border border-border-subtle">
        {/* Vehicle & Loan Inputs */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider flex items-center gap-2">
            <Car className="w-4 h-4 text-primary" />
            <span>Vehicle & Loan Parameters</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">{d.vehiclePrice}</label>
            <input
              type="number"
              value={vehiclePrice}
              onChange={(e) => setVehiclePrice(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-surface border border-border-subtle text-on-surface font-semibold text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">{d.downPayment}</label>
              <input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-border-subtle text-on-surface font-semibold text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">{d.loanTerm}</label>
              <select
                value={loanTermMonths}
                onChange={(e) => setLoanTermMonths(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-border-subtle text-on-surface font-semibold text-sm focus:outline-none focus:border-primary"
              >
                <option value={36}>36 Months (3 Yrs)</option>
                <option value={48}>48 Months (4 Yrs)</option>
                <option value={60}>60 Months (5 Yrs)</option>
                <option value={72}>72 Months (6 Yrs)</option>
                <option value={84}>84 Months (7 Yrs)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">{d.loanRate}</label>
              <input
                type="number"
                step="0.1"
                value={loanInterestRateAnnual}
                onChange={(e) => setLoanInterestRateAnnual(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-border-subtle text-on-surface font-semibold text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">{d.salesTax}</label>
              <input
                type="number"
                step="0.5"
                value={salesTaxPercent}
                onChange={(e) => setSalesTaxPercent(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-border-subtle text-on-surface font-semibold text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Lease & Market Assumptions */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider flex items-center gap-2">
            <Percent className="w-4 h-4 text-purple-500" />
            <span>Lease & Market Variables</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">{d.leaseDown}</label>
              <input
                type="number"
                value={leaseDownPayment}
                onChange={(e) => setLeaseDownPayment(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-border-subtle text-on-surface font-semibold text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">{d.leaseResidual}</label>
              <input
                type="number"
                step="1"
                value={leaseResidualPercent}
                onChange={(e) => setLeaseResidualPercent(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-border-subtle text-on-surface font-semibold text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">{d.leaseApr}</label>
              <input
                type="number"
                step="0.1"
                value={leaseMoneyFactorOrApr}
                onChange={(e) => setLeaseMoneyFactorOrApr(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-border-subtle text-on-surface font-semibold text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">{d.leaseTerm}</label>
              <select
                value={leaseTermMonths}
                onChange={(e) => setLeaseTermMonths(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-border-subtle text-on-surface font-semibold text-sm focus:outline-none focus:border-primary"
              >
                <option value={24}>24 Months (2 Yrs)</option>
                <option value={36}>36 Months (3 Yrs)</option>
                <option value={48}>48 Months (4 Yrs)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">{d.depreciation}</label>
              <input
                type="number"
                step="0.5"
                value={annualDepreciationRate}
                onChange={(e) => setAnnualDepreciationRate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-border-subtle text-on-surface font-semibold text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">{d.oppReturn}</label>
              <input
                type="number"
                step="0.5"
                value={investmentReturnRateAnnual}
                onChange={(e) => setInvestmentReturnRateAnnual(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-border-subtle text-on-surface font-semibold text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Visual Chart Section */}
      <div className="p-6 rounded-2xl bg-surface-container-lowest border border-border-subtle space-y-4">
        <h3 className="text-base font-extrabold text-on-surface flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span>{d.comparisonChart}</span>
        </h3>
        <div className="h-72 w-full">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'top' as const },
                tooltip: {
                  callbacks: {
                    label: (context) => ` ${context.dataset.label}: $${Number(context.raw).toLocaleString()}`,
                  },
                },
              },
              scales: {
                y: {
                  ticks: {
                    callback: (value) => `$${Number(value).toLocaleString()}`,
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {/* FAQ Section */}
      <FAQ
        title={d.faqTitle}
        items={[
          { question: d.q1, answer: d.a1 },
          { question: d.q2, answer: d.a2 },
          { question: d.q3, answer: d.a3 },
        ]}
      />
    </div>
  );
}
