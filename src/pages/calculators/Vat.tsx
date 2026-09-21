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
import { Calculator, PlusCircle, MinusCircle, FileText, Plus, Trash2 } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, ChartTooltip, Legend);

const localDict = {
  en: {
    title: 'VAT & Sales Tax Calculator',
    subtitle: 'Add or Remove Value Added Tax (VAT) Easily | Israel 18% VAT & Global Tax Rates',
    description: 'Calculate Value Added Tax (VAT) online: Add VAT to net amount, remove VAT from gross price, batch invoice itemization, and official tax rates for Israel (18%), UK, EU, and US.',
    amountLabel: 'Amount / Price',
    taxRateLabel: 'VAT / Tax Rate (%)',
    modeAdd: 'Add VAT (Net → Gross)',
    modeSub: 'Remove / Extract VAT (Gross → Net)',
    netAmount: 'Net Amount (Before Tax)',
    vatAmount: 'VAT Amount',
    grossAmount: 'Gross Amount (Total Price)',
    presetIsrael: 'Israel (18% - Updated)',
    presetIsraelOld: 'Israel (17% - Legacy)',
    presetEU: 'UK / France (20%)',
    presetSpain: 'Spain (21%)',
    presetGermany: 'Germany (19%)',
    batchTitle: 'Multi-Item Invoice VAT Breakdown',
    addItem: 'Add Line Item',
    itemName: 'Item Description',
    itemPrice: 'Price',
    totalInvoiceNet: 'Total Invoice Net',
    totalInvoiceVat: 'Total Invoice VAT',
    totalInvoiceGross: 'Total Invoice Gross',
    faqTitle: 'Frequently Asked Questions & Business VAT Guide',
    q1: 'What is the updated VAT rate in Israel for 2025–2026?',
    a1: 'The official standard VAT rate in Israel was updated from 17% to 18% starting January 2025 as enacted by the Ministry of Finance and Knesset tax revisions.',
    q2: 'How do you calculate net price before VAT from a gross price?',
    a2: 'To remove 18% VAT from a gross total price, divide the gross amount by 1.18. The result is the net price before VAT, and the difference is the exact VAT component.',
    q3: 'What is the difference between Output VAT (מס עסקאות) and Input VAT (מס תשומות)?',
    a3: 'Output VAT is the tax a business collects from customers on sales. Input VAT is the tax paid by the business on business expenses. Businesses report and pay the net difference (Output VAT minus Input VAT) to tax authorities.'
  },
  he: {
    title: 'מחשבון מע"מ (הוספה והפחתה מחישוב ברוטו/נטו)',
    subtitle: 'מחשבון מע"מ מעודכן 18% (2026) | הוספת מע"מ למחיר נטו, הפחתת מע"מ ממחיר כולל ופירוט חשבוניות',
    description: 'מחשבון מע"מ אונליין: חישוב הוספת מע"מ (סכום לפני מע"מ לכולל מע"מ), הפחתת מע"מ (חילוץ מע"מ ממחיר סופי), מע"מ 18% מעודכן, מע"מ 17% ופירוט חשבונית רב-פריטית.',
    amountLabel: 'סכום / מחיר (₪)',
    taxRateLabel: 'שיעור מע"מ (%)',
    modeAdd: 'הוספת מע"מ (ממחיר נטו למחיר כולל מע"מ)',
    modeSub: 'הפחתת / חילוץ מע"מ (ממחיר סופי סופר למחיר נטו)',
    netAmount: 'סכום נטו (לפני מע"מ)',
    vatAmount: 'סכום המע"מ',
    grossAmount: 'סכום ברוטו (כולל מע"מ סופי)',
    presetIsrael: 'ישראל (18% - מעודכן 2026)',
    presetIsraelOld: 'ישראל (17% - היסטורי)',
    presetEU: 'בריטניה / צרפת (20%)',
    presetSpain: 'ספרד (21%)',
    presetGermany: 'גרמניה (19%)',
    batchTitle: 'פירוט מע"מ לחשבוניות ורשימת פריטים',
    addItem: 'הוסף שורה לחשבונית',
    itemName: 'תיאור הפריט / שירות',
    itemPrice: 'מחיר',
    totalInvoiceNet: 'סך הכל נטו בחשבונית',
    totalInvoiceVat: 'סך הכל מע"מ בחשבונית',
    totalInvoiceGross: 'סך הכל לתשלום בחשבונית',
    faqTitle: 'שאלות נפוצות, מדריך מע"מ ודיווחים לעסקים',
    q1: 'מהו שיעור המע"מ המעודכן בישראל לשנת 2026?',
    a1: 'שיעור המע"מ הרשמי בישראל עודכן ל-18% (מ-17%). כל העסקאות והחשבוניות החל ממועד זה מופקות בתוספת מע"מ של 18%.',
    q2: 'כיצד מחלצים מע"מ (18%) ממחיר סופי כולל מע"מ?',
    a2: 'כדי לחלץ מע"מ 18% ממחיר סופי, מחלקים את המחיר הכולל ב-1.18. התוצאה היא סכום הנטו לפני מע"מ. סכום המע"מ עצמו מתקבל מהפחתת הנטו מהסכום הכולל (או הכפלת הסכום הכולל ב-18/118).',
    q3: 'מה ההבדל בין מס עסקאות למס תשומות בדיווח מע"מ תקופתי?',
    a3: 'מס עסקאות הוא המע"מ שהעסק גובה מלקוחותיו בגין מכירות. מס תשומות הוא המע"מ שהעסק שילם לספקים בגין הוצאות מוכרות. בדיווח התקופתי למע"מ העסק משלם לרשות המיסים את ההפרש (מס עסקאות פחות מס תשומות).'
  },
  es: {
    title: 'Calculadora de IVA e Impuestos de Ventas',
    subtitle: 'Añade o Desglosa el IVA Fácilmente | Tasas Oficiales de IVA',
    description: 'Calcula el IVA en línea: Añade IVA al importe neto, desglosa el IVA de un precio bruto final y gestiona desgloses para facturas completas.',
    amountLabel: 'Importe / Precio',
    taxRateLabel: 'Tipo de IVA (%)',
    modeAdd: 'Añadir IVA (Neto → Bruto)',
    modeSub: 'Desglosar IVA (Bruto → Neto)',
    netAmount: 'Base Imponible (Sin IVA)',
    vatAmount: 'Importe del IVA',
    grossAmount: 'Importe Total (Con IVA)',
    presetIsrael: 'Israel (18%)',
    presetIsraelOld: 'Israel (17%)',
    presetEU: 'Francia / RU (20%)',
    presetSpain: 'España (21%)',
    presetGermany: 'Alemania (19%)',
    batchTitle: 'Desglose de IVA para Facturación',
    addItem: 'Añadir Línea de Factura',
    itemName: 'Concepto',
    itemPrice: 'Precio',
    totalInvoiceNet: 'Base Imponible Total',
    totalInvoiceVat: 'Total IVA Factura',
    totalInvoiceGross: 'Total Factura',
    faqTitle: 'Preguntas Frecuentes sobre el IVA',
    q1: '¿Cómo desglosar el IVA de un importe total?',
    a1: 'Para desglosar el IVA de un precio total, divide el importe bruto entre (1 + porcentaje/100).',
    q2: '¿Qué es la Base Imponible?',
    a2: 'Es el valor del producto o servicio antes de aplicar los impuestos indirectos.',
    q3: '¿Cómo funciona la compensación de IVA soportado y repercutido?',
    a3: 'Las empresas restan el IVA pagado en sus compras del IVA cobrado en sus ventas para liquidar la diferencia con Hacienda.'
  },
  fr: {
    title: 'Calculateur de TVA (Ajout & Déduction de TVA)',
    subtitle: 'Calculateur TVA en Ligne | Taux de TVA 20% & Internationaux',
    description: 'Calculez la TVA facilement: ajoutez la TVA à un prix HT ou extrayez le montant de la TVA d\'un prix TTC.',
    amountLabel: 'Montant / Prix',
    taxRateLabel: 'Taux de TVA (%)',
    modeAdd: 'Ajouter la TVA (Prix HT → Prix TTC)',
    modeSub: 'Extraire la TVA (Prix TTC → Prix HT)',
    netAmount: 'Montant Hors Taxes (HT)',
    vatAmount: 'Montant de la TVA',
    grossAmount: 'Montant Toutes Taxes Comprises (TTC)',
    presetIsrael: 'Israël (18%)',
    presetIsraelOld: 'Israël (17%)',
    presetEU: 'France / RU (20%)',
    presetSpain: 'Espagne (21%)',
    presetGermany: 'Allemagne (19%)',
    batchTitle: 'Détail de la TVA sur Facture',
    addItem: 'Ajouter une Ligne',
    itemName: 'Description',
    itemPrice: 'Prix',
    totalInvoiceNet: 'Total Hors Taxes (HT)',
    totalInvoiceVat: 'Total TVA Facture',
    totalInvoiceGross: 'Total TTC à Payer',
    faqTitle: 'Foire Aux Questions sur la TVA',
    q1: 'Comment calculer le prix HT à partir du prix TTC ?',
    a1: 'Pour obtenir le montant HT avec une TVA à 20%, divisez le montant TTC par 1,20.',
    q2: 'Quelle est la différence entre TVA collectée et TVA déductible ?',
    a2: 'La TVA collectée est facturée aux clients, tandis que la TVA déductible est payée sur les achats professionnels.',
    q3: 'Comment déclarer la TVA ?',
    a3: 'L\'entreprise reverse à l\'administration fiscale la différence entre la TVA collectée et la TVA déductible.'
  },
  ar: {
    title: 'حاسبة ضريبة القيمة المضافة (VAT)',
    subtitle: 'إضافة أو إخراج ضريبة القيمة المضافة بسهولة | نسبة 18% ونسب عالمية',
    description: 'احسب ضريبة القيمة المضافة أونلاين: إضافة الضريبة للسعر الصافي، استخراج الضريبة من السعر الإجمالي، وتفصيل الفواتير.',
    amountLabel: 'المبلغ / السعر',
    taxRateLabel: 'نسبة الضريبة (%)',
    modeAdd: 'إضافة الضريبة (من الصافي ללإجمالي)',
    modeSub: 'استخراج الضريبة (من الإجمالي ללصافي)',
    netAmount: 'المبلغ قبل الضريبة (صافي)',
    vatAmount: 'مبلغ الضريبة',
    grossAmount: 'المبلغ الإجمالي (شامل الضريبة)',
    presetIsrael: 'إسرائيل (18%)',
    presetIsraelOld: 'إسرائيل (17%)',
    presetEU: 'بريطانيا / فرنسا (20%)',
    presetSpain: 'إسبانيا (21%)',
    presetGermany: 'ألمانيا (19%)',
    batchTitle: 'تفصيل الضريبة לפواتير متعددة العناصر',
    addItem: 'إضافة عنصر للفاتورة',
    itemName: 'الوصف / الخدمة',
    itemPrice: 'السعر',
    totalInvoiceNet: 'إجمالي الصافي للفاتورة',
    totalInvoiceVat: 'إجمالي الضريبة للفاتورة',
    totalInvoiceGross: 'إجمالي المطلوب بالفاتورة',
    faqTitle: 'الأسئلة الشائعة حول ضريبة القيمة المضافة',
    q1: 'كيف يتم استخراج الضريبة من المبلغ الإجمالي؟',
    a1: 'لقسمة المبلغ الإجمالي على (1 + نسبة الضريبة / 100) للحصول على المبلغ الصافي قبل الضريبة.',
    q2: 'ما هي ضريبة المخرجات وضريبة المدخلات؟',
    a2: 'ضريبة المخرجات هي ما يجمعه التجّار من الزبائن، وضريبة المدخلات هي ما يدفعونه للـموردين.',
    q3: 'كم تبلغ نسبة الضريبة في 2026؟',
    a3: 'نسبة الضريبة الرسمية هي 18%.'
  }
};

interface InvoiceLine {
  id: string;
  name: string;
  netPrice: number;
}

export default function Vat() {
  const { lang } = useI18n();
  const t = localDict[lang as keyof typeof localDict] || localDict.en;

  const [amount, setAmount] = useUrlState<number>('amount', 1000);
  const [rate, setRate] = useUrlState<number>('rate', 18);
  const [calculationMode, setCalculationMode] = useState<'add' | 'subtract'>('add');

  // Invoice Batch Items
  const [invoiceItems, setInvoiceItems] = useState<InvoiceLine[]>([
    { id: '1', name: lang === 'he' ? 'שירות יעוץ עסקי' : 'Consulting Service', netPrice: 2500 },
    { id: '2', name: lang === 'he' ? 'ציוד משרדי' : 'Office Equipment', netPrice: 800 }
  ]);

  const results = useMemo(() => {
    const amt = Math.max(0, amount || 0);
    const r = Math.max(0, rate || 0) / 100;

    let net: number;
    let vat: number;
    let gross: number;

    if (calculationMode === 'add') {
      net = amt;
      vat = net * r;
      gross = net + vat;
    } else {
      gross = amt;
      net = gross / (1 + r);
      vat = gross - net;
    }

    return {
      net: Number(net.toFixed(2)),
      vat: Number(vat.toFixed(2)),
      gross: Number(gross.toFixed(2))
    };
  }, [amount, rate, calculationMode]);

  const invoiceTotals = useMemo(() => {
    const r = Math.max(0, rate || 0) / 100;
    let totalNet = 0;
    invoiceItems.forEach(item => {
      totalNet += Math.max(0, item.netPrice || 0);
    });
    const totalVat = totalNet * r;
    const totalGross = totalNet + totalVat;

    return {
      totalNet: Number(totalNet.toFixed(2)),
      totalVat: Number(totalVat.toFixed(2)),
      totalGross: Number(totalGross.toFixed(2))
    };
  }, [invoiceItems, rate]);

  const addInvoiceItem = () => {
    const newItem: InvoiceLine = {
      id: Date.now().toString(),
      name: `${lang === 'he' ? 'פריט' : 'Item'} ${invoiceItems.length + 1}`,
      netPrice: 500
    };
    setInvoiceItems([...invoiceItems, newItem]);
  };

  const removeInvoiceItem = (id: string) => {
    setInvoiceItems(invoiceItems.filter(i => i.id !== id));
  };

  const updateInvoiceItem = (id: string, field: 'name' | 'netPrice', value: any) => {
    setInvoiceItems(invoiceItems.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const currencySymbol = lang === 'he' ? '₪' : '$';

  const chartData = {
    labels: [t.netAmount, t.vatAmount],
    datasets: [{
      data: [results.net, results.vat],
      backgroundColor: ['#0284c7', '#38bdf8'],
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
        canonicalUrl={`/${lang}/calculators/vat`}
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

      {/* Hero Header */}
      <div className="bg-surface-container-lowest border border-border-subtle rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-sky-100 dark:bg-sky-900/30 rounded-2xl flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
            <Calculator className="w-7 h-7" />
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

        <div className="bg-sky-50 dark:bg-sky-900/20 px-5 py-3 rounded-2xl border border-sky-100 dark:border-sky-900/40 text-right rtl:text-right ltr:text-left shrink-0 w-full md:w-auto">
          <div className="flex items-center justify-between gap-3 mb-0.5">
            <span className="text-xs text-sky-800 dark:text-sky-300 font-medium block">
              {t.grossAmount}
            </span>
            <ShinyText text="ISRAEL 18%" speed={3} className="text-[10px] text-sky-700 dark:text-sky-300 font-mono" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-sky-600 dark:text-sky-400">
            <CountUp to={Math.round(results.gross)} prefix={currencySymbol} duration={0.6} />
          </span>
        </div>
      </div>

      {/* Controls & Mode Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-surface-container-lowest border border-border-subtle rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-surface-container-low rounded-2xl border border-border-subtle">
            <button
              type="button"
              onClick={() => setCalculationMode('add')}
              className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${calculationMode === 'add' ? 'bg-sky-600 text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.modeAdd}</span>
            </button>
            <button
              type="button"
              onClick={() => setCalculationMode('subtract')}
              className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${calculationMode === 'subtract' ? 'bg-sky-600 text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              <MinusCircle className="w-4 h-4" />
              <span>{t.modeSub}</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1.5">
                {t.amountLabel}
              </label>
              <div className="relative">
                <span className="absolute top-1/2 -translate-y-1/2 ltr:left-4 rtl:right-4 text-on-surface-variant font-medium">
                  {currencySymbol}
                </span>
                <input
                  type="number"
                  min="0"
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-surface-container-low border border-border-subtle rounded-xl ltr:pl-8 rtl:pr-8 px-4 py-3 text-lg font-semibold text-on-surface focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1.5">
                {t.taxRateLabel}
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={rate || ''}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full bg-surface-container-low border border-border-subtle rounded-xl px-4 py-3 text-lg font-semibold text-on-surface focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
              />

              {/* Rate Presets */}
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setRate(18)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${rate === 18 ? 'bg-sky-600 text-white' : 'bg-surface-container-low border border-border-subtle text-on-surface-variant hover:bg-surface-container-high'}`}
                >
                  {t.presetIsrael}
                </button>
                <button
                  type="button"
                  onClick={() => setRate(17)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${rate === 17 ? 'bg-sky-600 text-white' : 'bg-surface-container-low border border-border-subtle text-on-surface-variant hover:bg-surface-container-high'}`}
                >
                  {t.presetIsraelOld}
                </button>
                <button
                  type="button"
                  onClick={() => setRate(20)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${rate === 20 ? 'bg-sky-600 text-white' : 'bg-surface-container-low border border-border-subtle text-on-surface-variant hover:bg-surface-container-high'}`}
                >
                  {t.presetEU}
                </button>
                <button
                  type="button"
                  onClick={() => setRate(21)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${rate === 21 ? 'bg-sky-600 text-white' : 'bg-surface-container-low border border-border-subtle text-on-surface-variant hover:bg-surface-container-high'}`}
                >
                  {t.presetSpain}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Card & Chart */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface-container-lowest border border-border-subtle rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <FileText className="w-5 h-5 text-sky-600" />
              <span>{lang === 'he' ? 'תוצאות חישוב המע"מ' : 'Calculation Results'}</span>
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border-subtle text-sm">
                <span className="text-on-surface-variant">{t.netAmount}</span>
                <span className="font-semibold text-on-surface">{currencySymbol}{results.net.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border-subtle text-sm">
                <span className="text-on-surface-variant">{t.vatAmount} ({rate}%)</span>
                <span className="font-semibold text-sky-600 dark:text-sky-400">
                  +{currencySymbol}{results.vat.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 pt-4 text-base font-bold text-on-surface">
                <span>{t.grossAmount}</span>
                <span className="text-2xl text-sky-600 dark:text-sky-400">
                  <CountUp to={Math.round(results.gross)} prefix={currencySymbol} duration={0.6} />
                </span>
              </div>
            </div>

            <div className="h-44 relative flex items-center justify-center pt-2">
              <Doughnut data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Batch Calculator Section */}
      <div className="bg-surface-container-lowest border border-border-subtle rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-border-subtle pb-4">
          <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-600" />
            <span>{t.batchTitle}</span>
          </h2>
          <button
            type="button"
            onClick={addInvoiceItem}
            className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold hover:bg-sky-700 transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addItem}</span>
          </button>
        </div>

        <div className="space-y-3">
          {invoiceItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3 bg-surface-container-low p-3 rounded-2xl border border-border-subtle">
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateInvoiceItem(item.id, 'name', e.target.value)}
                placeholder={t.itemName}
                className="flex-1 bg-surface-container-lowest border border-border-subtle rounded-xl px-3 py-2 text-sm font-medium text-on-surface"
              />
              <div className="relative w-36">
                <span className="absolute top-1/2 -translate-y-1/2 ltr:left-3 rtl:right-3 text-xs text-on-surface-variant font-medium">
                  {currencySymbol}
                </span>
                <input
                  type="number"
                  min="0"
                  value={item.netPrice || ''}
                  onChange={(e) => updateInvoiceItem(item.id, 'netPrice', Number(e.target.value))}
                  placeholder={t.itemPrice}
                  className="w-full bg-surface-container-lowest border border-border-subtle rounded-xl ltr:pl-7 rtl:pr-7 px-3 py-2 text-sm font-bold text-on-surface"
                />
              </div>
              <button
                type="button"
                onClick={() => removeInvoiceItem(item.id)}
                className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-sky-50 dark:bg-sky-900/20 p-4 sm:p-6 rounded-2xl border border-sky-100 dark:border-sky-900/40 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div>
            <span className="text-xs text-sky-800 dark:text-sky-300 font-medium block">{t.totalInvoiceNet}</span>
            <span className="text-lg font-bold text-on-surface">{currencySymbol}{invoiceTotals.totalNet.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-xs text-sky-800 dark:text-sky-300 font-medium block">{t.totalInvoiceVat} ({rate}%)</span>
            <span className="text-lg font-bold text-sky-600 dark:text-sky-400">+{currencySymbol}{invoiceTotals.totalVat.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-xs text-sky-800 dark:text-sky-300 font-medium block">{t.totalInvoiceGross}</span>
            <span className="text-xl font-bold text-sky-700 dark:text-sky-300">{currencySymbol}{invoiceTotals.totalGross.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* FAQ Component */}
      <FAQ items={faqList} title={t.faqTitle} />

      <ShareActions calculatorTitle={t.title} calculatorPath="/calculators/vat" />

      <RelatedCalculators currentId="/calculators/vat" />
    </div>
  );
}
