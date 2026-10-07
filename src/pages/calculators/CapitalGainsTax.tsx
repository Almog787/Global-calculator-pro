import React, { useMemo } from 'react';
import { useUrlState } from '../../hooks/useUrlState';
import { useI18n } from '../../contexts/i18n';
import SEO from '../../components/SEO';
import Breadcrumbs from '../../components/Breadcrumbs';
import RelatedCalculators from '../../components/RelatedCalculators';
import ShareActions from '../../components/ShareActions';
import FAQ from '../../components/FAQ';
import CountUp from '../../components/CountUp';
import { calculateCapitalGains } from '../../lib/math/capitalGains';
import { sanitizeExcelRows } from '../../lib/export/excelExport';
import * as XLSX from 'xlsx';
import { Receipt, FileSpreadsheet, Sparkles } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const localDict = {
  en: {
    catFinance: 'Finance & Tax',
    title: 'Capital Gains Tax Calculator',
    subtitle: 'Calculate Real Capital Gains, Inflation Indexation & Loss Offset',
    description: 'Calculate real and nominal capital gains tax on stocks, crypto, real estate, and investments with inflation indexation adjustment and tax loss carryforward.',
    assetType: 'Asset Type',
    stocks: 'Stocks / ETFs (25% Real)',
    crypto: 'Cryptocurrency (25% Real)',
    realEstate: 'Real Estate / Land (25% Real)',
    bonds: 'Unlinked Bonds (15% Nominal)',
    buyPrice: 'Purchase Price / Initial Basis ($)',
    sellPrice: 'Selling Price / Total Proceeds ($)',
    inflationRate: 'Total Inflation During Holding Period (%)',
    lossCarryforward: 'Previous Accumulated Capital Losses ($)',
    taxRate: 'Applicable Tax Rate (%)',
    nominalGain: 'Nominal Profit (Gain)',
    adjustedBasis: 'Inflation-Adjusted Purchase Price',
    inflationGain: 'Inflationary Gain (Tax-Exempt)',
    realGain: 'Real Capital Gain (Taxable Base)',
    lossOffsetApplied: 'Loss Offset Applied',
    taxDue: 'Capital Gains Tax Due',
    netProfit: 'Net Profit After Tax',
    netProceeds: 'Net Cash Proceeds After Tax',
    effectiveTaxRate: 'Effective Tax Rate on Nominal Gain',
    exportExcel: 'Export Tax Summary (.xlsx)',
    taxBreakdown: 'Capital Gains Tax Breakdown',
    faqTitle: 'Frequently Asked Questions about Capital Gains Tax',
    q1: 'What is the difference between real capital gains and nominal gains?',
    a1: 'In Israel and many tax regimes, capital gains tax (typically 25%) is levied only on the "Real Gain" (the profit exceeding inflation). The portion of the gain that merely keeps pace with the Consumer Price Index (CPI) is considered tax-exempt inflationary gain.',
    q2: 'How does capital loss carryforward work?',
    a2: 'If you realized losses from stocks, crypto, or investments in current or previous tax years, you can offset these losses against current capital gains to reduce or completely eliminate your tax liability.',
    q3: 'What is the tax rate on cryptocurrency and foreign stocks?',
    a3: 'In Israel, cryptocurrency sales and foreign stock gains are generally classified as capital assets subject to a 25% real capital gains tax rate on profits after inflation indexation.'
  },
  he: {
    catFinance: 'פיננסים ומיסוי',
    title: 'מחשבון מס רווחי הון והשקעות',
    subtitle: 'חישוב מס רווחי הון ריאלי (25%), ניכוי אינפלציה וקיזוז הפסדים',
    description: 'מחשבון מס רווחי הון אונליין: חישוב מס ריאלי 25% על מניות, קריפטו, נדל"ן ואג"ח, חילוץ רווח אינפלציוני פטור ממס, קיזוז הפסדי עבר וייצוא דוח מס לאקסל.',
    assetType: 'סוג הנכס / השקעה',
    stocks: 'מניות וקרנות סל (25% ריאלי)',
    crypto: 'מטבעות קריפטוגרפיים (25% ריאלי)',
    realEstate: 'נדל"ן / שבח מקרקעין (25% ריאלי)',
    bonds: 'אג"ח שקלי לא צמוד (15% נומינלי)',
    buyPrice: 'מחיר / עלות רכישה מקורית (₪)',
    sellPrice: 'מחיר / תמורת מכירה סופית (₪)',
    inflationRate: 'שיעור עליית המדד / אינפלציה בתקופה (%)',
    lossCarryforward: 'הפסדי הון צבורים לקיזוז משנים קודמות (₪)',
    taxRate: 'שיעור מס רווחי הון (%)',
    nominalGain: 'רווח הון נומינלי (ברוטו)',
    adjustedBasis: 'שווי רכישה מתואם למדד',
    inflationGain: 'רווח אינפלציוני (פטור ממס)',
    realGain: 'רווח הון ריאלי (חייב במס)',
    lossOffsetApplied: 'הפסד עבר שקוזז',
    taxDue: 'סך מס רווחי הון לתשלום',
    netProfit: 'רווח נקי סופי (לאחר מס)',
    netProceeds: 'תמורה נטו שתועבר לחשבון',
    effectiveTaxRate: 'שיעור מס אפקטיבי מהרווח הכולל',
    exportExcel: 'ייצוא תחשיב מס מלא לאקסל (.xlsx)',
    taxBreakdown: 'התפלגות תמורת המכירה והמס',
    faqTitle: 'שאלות נפוצות ומדריך מס רווחי הון',
    q1: 'כיצד מחושב מס רווחי הון ריאלי (25%) בישראל?',
    a1: 'מס רווחי הון בישראל על ניירות ערך וקריפטו עומד על 25% מהרווח הריאלי בלבד. מחיר הרכישה מתואם לעליית מדד המחירים לצרכן. החלק ברווח שנובע רק מאינפלציה הינו פטור ממס, והמס בשיעור 25% נגבה רק על הרווח שמעבר לאינפלציה.',
    q2: 'כיצד מתבצע קיזוז הפסדי הון מול רווחים?',
    a2: 'אם היו לכם הפסדים ממומשים ממכירת מניות או קריפטו בשנה הנוכחית או בשנים קודמות (בכפוף להגשת דוח שנתי), ניתן לקזז את ההפסדים שקל מול שקל כנגד הרווח הריאלי ולהקטין או לאפס את תשלום המס.',
    q3: 'מהו שיעור המס על אג"ח שקלי לא צמוד?',
    a3: 'על מכירת אג"ח שקליות או פיקדונות שאינם צמודי מדד חל מס בשיעור 15% מהרווח הנומינלי (ללא ניכוי הצמדה למדד).'
  },
  es: {
    catFinance: 'Finanzas e Impuestos',
    title: 'Calculadora de Ganancias de Capital',
    subtitle: 'Calcula Impuestos sobre Acciones, Cripto e Inversiones',
    description: 'Calcula el impuesto sobre ganancias patrimoniales ajustado a la inflación y compensación de pérdidas acumuladas.',
    assetType: 'Tipo de Activo',
    stocks: 'Acciones / ETFs (25%)',
    crypto: 'Criptomonedas (25%)',
    realEstate: 'Bienes Inmuebles (25%)',
    bonds: 'Bonos Nominales (15%)',
    buyPrice: 'Precio de Compra / Coste Base ($)',
    sellPrice: 'Precio de Venta / Ingreso Total ($)',
    inflationRate: 'Inflación Acumulada (%)',
    lossCarryforward: 'Pérdidas Acumuladas Previas ($)',
    taxRate: 'Tipo Impositivo (%)',
    nominalGain: 'Ganancia Nominal',
    adjustedBasis: 'Coste Ajustado por Inflación',
    inflationGain: 'Ganancia Inflacionaria (Exenta)',
    realGain: 'Ganancia Real Sujeta a Impuesto',
    lossOffsetApplied: 'Pérdidas Compensadas',
    taxDue: 'Impuesto a Pagar',
    netProfit: 'Beneficio Neto tras Impuestos',
    netProceeds: 'Importe Neto Recibido',
    effectiveTaxRate: 'Tasa Impositiva Efectiva',
    exportExcel: 'Exportar a Excel (.xlsx)',
    taxBreakdown: 'Desglose del Impuesto',
    faqTitle: 'Preguntas Frecuentes sobre Ganancias de Capital',
    q1: '¿Qué es la ganancia real frente a la nominal?',
    a1: 'La ganancia real descuenta la inflación para tributar solo sobre el aumento real del poder adquisitivo.',
    q2: '¿Cómo funciona la compensación de pérdidas?',
    a2: 'Las pérdidas anteriores pueden restarse de las ganancias actuales para pagar menos impuestos.',
    q3: '¿Cómo tributan las criptomonedas?',
    a3: 'Suelen tributar como ganancias de capital sobre el beneficio neto obtenido.'
  },
  fr: {
    catFinance: 'Finance et Fiscalité',
    title: 'Calculateur de Plus-Values Mobilières',
    subtitle: 'Calcul de l\'Impôt sur Plus-Values, Inflation et Moins-Values',
    description: 'Calculez l\'impôt sur les plus-values d\'actions, crypto-monnaies et investissements avec déduction de l\'inflation.',
    assetType: 'Type d\'Actif',
    stocks: 'Actions / ETF (25%)',
    crypto: 'Crypto-monnaies (25%)',
    realEstate: 'Immobilier (25%)',
    bonds: 'Obligations (15%)',
    buyPrice: 'Prix d\'Achat Initial (€)',
    sellPrice: 'Prix de Vente Total (€)',
    inflationRate: 'Inflation Cumulée (%)',
    lossCarryforward: 'Moins-Values Antérieures (€)',
    taxRate: 'Taux d\'Imposition (%)',
    nominalGain: 'Plus-Value Nominale',
    adjustedBasis: 'Prix d\'Achat Corrigé de l\'Inflation',
    inflationGain: 'Gain Inflationniste (Exonéré)',
    realGain: 'Plus-Value Réelle Imposable',
    lossOffsetApplied: 'Moins-Values Imputées',
    taxDue: 'Impôt sur la Plus-Value Dû',
    netProfit: 'Gain Net Après Impôt',
    netProceeds: 'Produit Net Après Impôt',
    effectiveTaxRate: 'Taux Effectif Global',
    exportExcel: 'Exporter en Excel (.xlsx)',
    taxBreakdown: 'Répartition de la Plus-Value',
    faqTitle: 'Questions Fréquentes sur l\'Imposition des Plus-Values',
    q1: 'Quelle est la différence entre plus-value réelle et nominale ?',
    a1: 'La plus-value réelle déduit l\'érosion monétaire due à l\'inflation pour ne taxer que l\'enrichissement réel.',
    q2: 'Comment imputer les moins-values ?',
    a2: 'Les pertes antérieures viennent en déduction des gains imposables.',
    q3: 'Quelle est la fiscalité des cryptos ?',
    a3: 'Les gains nets sont assujettis au régime des plus-values sur actifs numériques.'
  },
  ar: {
    catFinance: 'المال والضرائب',
    title: 'حاسبة ضريبة الأرباح الرأسمالية',
    subtitle: 'حساب ضريبة أرباح الأسهم والعملات الرقمية وخصم التضخم',
    description: 'احسب ضريبة الأرباح الرأسمالية الحقيقية على الأسهم والكريبتو والعقارات مع تعديل التضخم وخصم الخسائر السابقة.',
    assetType: 'نوع الأصل الاستثماري',
    stocks: 'أسهم وصناديق مؤشرات (25%)',
    crypto: 'عملات رقمية مشفرة (25%)',
    realEstate: 'عقارات وأراضي (25%)',
    bonds: 'سندات اسمية (15%)',
    buyPrice: 'سعر الشراء الأصلي ($)',
    sellPrice: 'سعر البيع النهائي ($)',
    inflationRate: 'نسبة التضخم التراكمي (%)',
    lossCarryforward: 'الخسائر الرأسمالية السابقة ($)',
    taxRate: 'نسبة الضريبة (%)',
    nominalGain: 'الربح الاسمي الإجمالي',
    adjustedBasis: 'سعر الشراء المعدل بالتضخم',
    inflationGain: 'الربح الناتج عن التضخم (معفى)',
    realGain: 'الربح الرأسمالي الحقيقي الخاضع للضريبة',
    lossOffsetApplied: 'الخسائر المخصومة',
    taxDue: 'مبلغ الضريبة المستحق',
    netProfit: 'صافي الربح بعد الضريبة',
    netProceeds: 'صافي المبلغ المستلم',
    effectiveTaxRate: 'معدل الضريبة الفعلي',
    exportExcel: 'تصدير التقرير إلى Excel (.xlsx)',
    taxBreakdown: 'توزيع مبلغ البيع والضريبة',
    faqTitle: 'الأسئلة الشائعة حول ضريبة الأرباح الرأسمالية',
    q1: 'ما الفرق بين الأرباح الاسمية والحقيقية؟',
    a1: 'الأرباح الحقيقية تخصم نسبة التضخم لفرض الضريبة على الزيادة الفعلية في القوة الشرائية فقط.',
    q2: 'كيف يتم ترحيل وخصم الخسائر السابقة؟',
    a2: 'يمكن خصم الخسائر المحققة سابقاً من أرباح العام الحالي لتخفيض الضريبة.',
    q3: 'كيف تخضع العملات الرقمية للضريبة؟',
    a3: 'تُعامل أرباح الكريبتو كأصول رأسمالية وتخضع لضريبة الأرباح الرأسمالية.'
  },
  ru: {
    catFinance: 'Финансы и налоги',
    title: 'Калькулятор налога на прирост капитала',
    subtitle: 'Расчет налога на прибыль от акций, криптовалюты и недвижимости',
    description: 'Рассчитайте налог на прибыль от инвестиций с учетом инфляционной индексации и зачета накопленных убытков прошлых лет.',
    assetType: 'Тип актива',
    stocks: 'Акции и ETF (25% реальный)',
    crypto: 'Криптовалюта (25% реальный)',
    realEstate: 'Недвижимость (25% реальный)',
    bonds: 'Облигации (15% номинальный)',
    buyPrice: 'Цена покупки / затраты (₽)',
    sellPrice: 'Цена продажи / выручка (₽)',
    inflationRate: 'Накопленная инфляция (%)',
    lossCarryforward: 'Убытки прошлых лет для зачета (₽)',
    taxRate: 'Ставка налога (%)',
    nominalGain: 'Номинальная прибыль',
    adjustedBasis: 'Цена покупки с учетом инфляции',
    inflationGain: 'Инфляционный доход (не облагается)',
    realGain: 'Реальная налогооблагаемая прибыль',
    lossOffsetApplied: 'Зачтенный убыток',
    taxDue: 'Сумма налога к уплате',
    netProfit: 'Чистая прибыль после налога',
    netProceeds: 'Сумма к получению на руки',
    effectiveTaxRate: 'Эффективная ставка налога',
    exportExcel: 'Экспорт расчета в Excel (.xlsx)',
    taxBreakdown: 'Структура выручки и налога',
    faqTitle: 'Часто задаваемые вопросы о налоге на прирост капитала',
    q1: 'В чем разница между реальной и номинальной прибылью?',
    a1: 'Реальная прибыль исключает инфляционную составляющую, налог взимается только с чистого прироста капитала.',
    q2: 'Как работает зачет убытков прошлых лет?',
    a2: 'Убытки прошлых периодов уменьшают налогооблагаемую базу текущего года.',
    q3: 'Как облагается налогом доход от криптовалют?',
    a3: 'Криптовалюта рассматривается как инвестиционный актив с налогом на чистую прибыль.'
  }
};

export default function CapitalGainsTax() {
  const { lang, t } = useI18n();
  const d = localDict[lang as keyof typeof localDict] || localDict.en;

  // URL States
  const [assetType, setAssetType] = useUrlState('asset', 'stocks');
  const [buyPrice, setBuyPrice] = useUrlState('buy', 50000);
  const [sellPrice, setSellPrice] = useUrlState('sell', 120000);
  const [inflationRate, setInflationRate] = useUrlState('inf', 10);
  const [lossCarryforward, setLossCarryforward] = useUrlState('loss', 0);
  const [taxRate, setTaxRate] = useUrlState('rate', 25);

  const isNominalOnly = assetType === 'bonds';

  // Handle preset selection
  const handleAssetSelect = (type: string) => {
    setAssetType(type);
    if (type === 'bonds') {
      setTaxRate(15);
      setInflationRate(0);
    } else {
      setTaxRate(25);
    }
  };

  const results = useMemo(() => {
    return calculateCapitalGains({
      buyAmount: Number(buyPrice) || 0,
      sellAmount: Number(sellPrice) || 0,
      totalInflationPercent: Number(inflationRate) || 0,
      lossCarryforward: Number(lossCarryforward) || 0,
      taxRatePercent: Number(taxRate) || 25,
      isNominalOnly,
    });
  }, [buyPrice, sellPrice, inflationRate, lossCarryforward, taxRate, isNominalOnly]);

  const currencySymbol = lang === 'he' ? '₪' : lang === 'fr' || lang === 'es' ? '€' : lang === 'ru' ? '₽' : '$';

  // Doughnut Chart Data
  const chartData = useMemo(() => {
    const buyVal = Number(buyPrice) || 0;
    const taxVal = results.taxDue;
    const netProfitVal = Math.max(0, results.netProfitAfterTax);

    return {
      labels: [
        lang === 'he' ? 'עלות רכישה מקורית' : 'Initial Investment',
        lang === 'he' ? 'מס רווחי הון לתשלום' : 'Tax Due',
        lang === 'he' ? 'רווח נקי שנשאר בכיס' : 'Net Profit After Tax'
      ],
      datasets: [
        {
          data: [buyVal, taxVal, netProfitVal],
          backgroundColor: ['#94A3B8', '#EF4444', '#006B5B'],
          borderColor: ['#CBD5E1', '#F87171', '#005144'],
          borderWidth: 1.5,
        }
      ]
    };
  }, [buyPrice, results, lang]);

  const handleExportExcel = () => {
    const rows = [
      ['Capital Gains Tax Calculation Report'],
      ['Asset Type', assetType],
      ['Original Buy Price', buyPrice],
      ['Final Sell Price', sellPrice],
      ['Inflation Adjustment', `${inflationRate}%`],
      ['Nominal Profit', results.nominalGain],
      ['Inflation-Adjusted Basis', results.adjustedBasis],
      ['Tax-Exempt Inflation Gain', results.inflationGain],
      ['Real Taxable Capital Gain', results.realGain],
      ['Loss Carryforward Offset', results.lossOffsetApplied],
      ['Tax Rate', `${taxRate}%`],
      ['Total Tax Due', results.taxDue],
      ['Net Profit After Tax', results.netProfitAfterTax],
      ['Net Proceeds Received', results.netProceedsAfterTax],
      ['Effective Tax Rate', `${results.effectiveTaxRatePercent}%`],
    ];

    const sanitized = sanitizeExcelRows(rows);
    const ws = XLSX.utils.aoa_to_sheet(sanitized);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Capital Gains Tax');
    XLSX.writeFile(wb, `Capital_Gains_Tax_${buyPrice}_to_${sellPrice}.xlsx`);
  };

  return (
    <>
      <SEO
        title={`${d.title} – ${d.subtitle}`}
        description={d.description}
        keywords={['capital gains tax calculator', 'מחשבון מס רווחי הון', 'מס רווחי הון מניות', 'מס קריפטו', 'קיזוז הפסדי הון']}
        canonicalUrl="/calculators/capital-gains-tax"
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
            { label: d.title, path: `/${lang}/calculators/capital-gains-tax` },
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
              <Receipt className="w-5 h-5 text-secondary" />
              <span>{lang === 'he' ? 'פרטי עסקת ההשקעה' : 'Investment & Sale Parameters'}</span>
            </h2>

            {/* Asset Type Chips */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-2">{d.assetType}</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleAssetSelect('stocks')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all text-center ${assetType === 'stocks' ? 'bg-primary text-on-primary shadow-xs' : 'bg-surface-container-low text-on-surface hover:bg-surface-container'}`}
                >
                  {d.stocks}
                </button>
                <button
                  type="button"
                  onClick={() => handleAssetSelect('crypto')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all text-center ${assetType === 'crypto' ? 'bg-primary text-on-primary shadow-xs' : 'bg-surface-container-low text-on-surface hover:bg-surface-container'}`}
                >
                  {d.crypto}
                </button>
                <button
                  type="button"
                  onClick={() => handleAssetSelect('realEstate')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all text-center ${assetType === 'realEstate' ? 'bg-primary text-on-primary shadow-xs' : 'bg-surface-container-low text-on-surface hover:bg-surface-container'}`}
                >
                  {d.realEstate}
                </button>
                <button
                  type="button"
                  onClick={() => handleAssetSelect('bonds')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all text-center ${assetType === 'bonds' ? 'bg-primary text-on-primary shadow-xs' : 'bg-surface-container-low text-on-surface hover:bg-surface-container'}`}
                >
                  {d.bonds}
                </button>
              </div>
            </div>

            {/* Purchase & Sale Amounts */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-on-surface">{d.buyPrice}</label>
                  <span className="text-xs font-semibold text-on-surface-variant">{currencySymbol}{Number(buyPrice).toLocaleString()}</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(Number(e.target.value))}
                  className="w-full bg-surface-container-lowest border border-border-subtle rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-secondary transition-colors"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-on-surface">{d.sellPrice}</label>
                  <span className="text-xs font-semibold text-secondary font-bold">{currencySymbol}{Number(sellPrice).toLocaleString()}</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(Number(e.target.value))}
                  className="w-full bg-surface-container-lowest border border-border-subtle rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-secondary transition-colors"
                />
              </div>
            </div>

            {/* Inflation & Loss Carryforward */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border-subtle/80">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">{d.inflationRate}</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="100"
                  disabled={isNominalOnly}
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                  className={`w-full border border-border-subtle rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-secondary ${isNominalOnly ? 'bg-surface-container-low opacity-50 cursor-not-allowed' : 'bg-surface-container-lowest'}`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">{d.lossCarryforward}</label>
                <input
                  type="number"
                  step="500"
                  min="0"
                  value={lossCarryforward}
                  onChange={(e) => setLossCarryforward(Number(e.target.value))}
                  className="w-full bg-surface-container-lowest border border-border-subtle rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-secondary"
                />
              </div>
            </div>

            {/* Tax Rate Setting */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-on-surface">{d.taxRate}</label>
                <span className="text-xs font-bold text-primary">{taxRate}%</span>
              </div>
              <input
                type="number"
                step="0.5"
                min="0"
                max="50"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full bg-surface-container-lowest border border-border-subtle rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-secondary"
              />
            </div>
          </div>

          {/* Results Summary & Breakdown */}
          <div className="lg:col-span-6 space-y-4">
            {/* Primary Tax Due Hero Card */}
            <div data-testid="result-card" className="bg-gradient-to-br from-[#005144] to-[#006B5B] text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
              <div className="relative z-10 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-semibold opacity-90">{d.taxDue}</span>
                    <div className="text-3xl sm:text-4xl font-black flex items-baseline gap-1 mt-0.5">
                      <span>{currencySymbol}</span>
                      <CountUp value={results.taxDue} />
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs opacity-90">{d.effectiveTaxRate}</span>
                    <div className="text-xl font-black text-emerald-200">{results.effectiveTaxRatePercent}%</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/20 flex justify-between items-center text-xs">
                  <span>{d.netProfit}:</span>
                  <span className="font-bold text-sm text-emerald-200">{currencySymbol}{results.netProfitAfterTax.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Detailed Metric Cards */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="bg-surface border border-border-subtle rounded-xl p-4 shadow-2xs">
                <span className="text-[11px] text-on-surface-variant font-medium block mb-1">{d.nominalGain}</span>
                <div className="text-base sm:text-lg font-bold text-on-surface">
                  {currencySymbol}{results.nominalGain.toLocaleString()}
                </div>
              </div>

              <div className="bg-surface border border-border-subtle rounded-xl p-4 shadow-2xs">
                <span className="text-[11px] text-on-surface-variant font-medium block mb-1">{d.inflationGain}</span>
                <div className="text-base sm:text-lg font-bold text-emerald-600">
                  {currencySymbol}{results.inflationGain.toLocaleString()}
                </div>
              </div>

              <div className="bg-surface border border-border-subtle rounded-xl p-4 shadow-2xs">
                <span className="text-[11px] text-on-surface-variant font-medium block mb-1">{d.realGain}</span>
                <div className="text-base sm:text-lg font-bold text-primary">
                  {currencySymbol}{results.realGain.toLocaleString()}
                </div>
              </div>

              <div className="bg-surface border border-border-subtle rounded-xl p-4 shadow-2xs">
                <span className="text-[11px] text-on-surface-variant font-medium block mb-1">{d.netProceeds}</span>
                <div className="text-base sm:text-lg font-bold text-secondary">
                  {currencySymbol}{results.netProceedsAfterTax.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Donut Chart */}
            <div className="bg-surface border border-border-subtle rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="h-44 w-44 shrink-0">
                <Doughnut
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          label: (ctx) => ` ${ctx.label}: ${currencySymbol}${Number(ctx.raw).toLocaleString()}`
                        }
                      }
                    },
                    cutout: '68%',
                  }}
                />
              </div>

              <div className="space-y-2 text-xs w-full">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> {lang === 'he' ? 'השקעה מקורית' : 'Initial Buy'}</span>
                  <span className="font-bold">{currencySymbol}{Number(buyPrice).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> {lang === 'he' ? 'רווח נקי בכיס' : 'Net Profit'}</span>
                  <span className="font-bold text-emerald-600">{currencySymbol}{results.netProfitAfterTax.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> {lang === 'he' ? 'מס רווחי הון' : 'Tax Due'}</span>
                  <span className="font-bold text-red-500">{currencySymbol}{results.taxDue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Export Actions */}
            <button
              type="button"
              onClick={handleExportExcel}
              className="w-full bg-secondary text-on-secondary px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm hover:bg-on-secondary-container transition-all flex items-center justify-center gap-2 shadow-xs active:scale-98"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{d.exportExcel}</span>
            </button>
          </div>
        </div>

        {/* Share Actions */}
        <ShareActions
          calculatorTitle={d.title}
          calculatorPath="/calculators/capital-gains-tax"
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
        <RelatedCalculators currentId="capital-gains-tax" limit={4} />
      </div>
    </>
  );
}
