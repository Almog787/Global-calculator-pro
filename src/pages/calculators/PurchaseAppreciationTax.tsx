import React from 'react';
import { useUrlState } from '../../hooks/useUrlState';
import { useI18n } from '../../contexts/i18n';
import SEO from '../../components/SEO';
import { calculatePurchaseTax, calculateAppreciationTax } from '../../lib/math/finance';
import { trackCalculation } from '../../lib/analytics';
import {
  Building2,
  Home,
  Receipt,
  Percent,
  TrendingUp,
  HelpCircle,
  CheckCircle2,
  Coins
} from 'lucide-react';

const localDict = {
  en: {
    title: 'Real Estate Purchase & Appreciation Tax Calculator',
    subtitle: 'Israel & Global Property Taxes: Tiered Purchase Tax & Linear Appreciation Tax',
    description: 'Calculate official Israel real estate purchase tax brackets (single home vs additional investor home) and linear property appreciation tax with deductible expenses and exemptions.',
    tabPurchaseTax: 'Purchase Tax (מס רכישה)',
    tabAppreciationTax: 'Appreciation Tax (מס שבח)',
    propertyPrice: 'Property Purchase Price (₪)',
    buyerType: 'Buyer Status / Category',
    singleHome: 'Single Home (Israeli Resident)',
    additionalHome: 'Additional Home / Real Estate Investor',
    foreignResident: 'Foreign Resident',
    commercial: 'Commercial Property / Land (6%)',
    olehDisabled: 'Oleh Hadash / Entitled Disabled',
    totalTaxDue: 'Total Purchase Tax Due',
    effectiveRate: 'Effective Tax Rate',
    bracketBreakdown: 'Marginal Tax Brackets Breakdown',
    tier: 'Tier / Bracket',
    range: 'Price Range',
    rate: 'Tax Rate',
    taxInTier: 'Tax in Tier',
    // Appreciation tab
    purchasePrice: 'Original Purchase Price (₪)',
    sellingPrice: 'Current Selling Price (₪)',
    purchaseYear: 'Year of Purchase',
    sellingYear: 'Year of Sale',
    singleHomeExempt: 'Eligible for Single Home Tax Exemption (Section 49b(2))',
    renovationExpenses: 'Renovation & Property Improvement (₪)',
    lawyerAndAgentFees: 'Legal & Real Estate Broker Fees (₪)',
    purchaseTaxPaid: 'Original Purchase Tax Paid (₪)',
    mortgageRealInterest: 'Real Mortgage Interest Incurred (₪)',
    improvementLevy: 'Municipal Improvement Levy - היטל השבחה (₪)',
    grossAppreciation: 'Gross Capital Gain / Appreciation',
    totalDeductions: 'Total Recognized Deductions',
    netAppreciation: 'Net Taxable Appreciation',
    appreciationTaxDue: 'Appreciation Tax (25% Linear)',
    netProfitAfterTax: 'Net Profit in Hand After Tax',
    exemptionGranted: 'Full Tax Exemption Granted',
    faqTitle: 'Frequently Asked Questions & Real Estate Tax Guide',
    q1: 'How is Israel Purchase Tax calculated?',
    a1: 'Purchase tax is progressive (tiered). For a single residential home up to ~1,978,745 NIS, the tax rate is 0%. Above that, progressive marginal brackets apply at 3.5%, 5%, 8%, and 10%. Second homes are taxed at 8% from the first shekel up to ~6.05M NIS and 10% above.',
    q2: 'What is the Linear Appreciation Tax (מס שבח ליניארי מוטב)?',
    a2: 'Following the 2014 tax reform, real appreciation is split linearly based on holding period. The portion of appreciation attributable to the period prior to January 1, 2014 is 100% tax-exempt, and only the portion generated after 2014 is taxed at 25%.',
    q3: 'Which expenses are deductible from appreciation tax?',
    a3: 'You can deduct brokerage fees (up to 2%), lawyer fees, certified renovations, municipal improvement levies (היטל השבחה), real mortgage interest, and original purchase taxes paid.'
  },
  he: {
    title: 'מחשבון מס רכישה ומס שבח מדורג (נדל"ן)',
    subtitle: 'מדרגות מס רכישה רשמיות 2026 | מס שבח ליניארי מוטב וניכוי הוצאות',
    description: 'מחשבון מס רכישה ומס שבח עדכני: חישוב אוטומטי לפי מדרגות רשות המיסים לדירה יחידה, דירה שנייה למשקיע, תושב חוץ ומס שבח ליניארי מנוכה הוצאות.',
    tabPurchaseTax: 'מחשבון מס רכישה מדורג',
    tabAppreciationTax: 'מחשבון מס שבח והיטל השבחה',
    propertyPrice: 'מחיר רכישת הנכס (₪)',
    buyerType: 'מעמד הרוכש וסוג הנכס',
    singleHome: 'דירה יחידה (תושב ישראל)',
    additionalHome: 'דירה נוספת / משקיע (דירה שנייה ומעלה)',
    foreignResident: 'תושב חוץ',
    commercial: 'קרקע / נכס מסחרי / חנות (6%)',
    olehDisabled: 'עולה חדש / נכה / זכאי',
    totalTaxDue: 'סך מס רכישה לתשלום',
    effectiveRate: 'שיעור מס אפקטיבי',
    bracketBreakdown: 'פירוט שכבות ומדרגות המס',
    tier: 'מדרגה',
    range: 'טווח מחיר',
    rate: 'אחוז מס',
    taxInTier: 'מס במדרגה',
    // Appreciation tab
    purchasePrice: 'מחיר רכישה מקורי בעבר (₪)',
    sellingPrice: 'מחיר מכירה נוכחי / צפוי (₪)',
    purchaseYear: 'שנת הרכישה המקורית',
    sellingYear: 'שנת המכירה',
    singleHomeExempt: 'זכאות לפטור דירה יחידה מזכה (סעיף 49ב(2))',
    renovationExpenses: 'הוצאות שיפוץ והשבחת הנכס (₪)',
    lawyerAndAgentFees: 'שכר טרחת עו"ד ותיווך (קנייה ומכירה) (₪)',
    purchaseTaxPaid: 'מס רכישה ששולם בעת הקנייה (₪)',
    mortgageRealInterest: 'ריבית ריאלית על המשכנתא (₪)',
    improvementLevy: 'היטל השבחה ששולם לעירייה (₪)',
    grossAppreciation: 'שבח גולמי (רווח עליית ערך)',
    totalDeductions: 'סך הוצאות מוכרות לניכוי',
    netAppreciation: 'שבח נטו לאחר ניכויים',
    appreciationTaxDue: 'סך מס שבח לתשלום (ליניארי 25%)',
    netProfitAfterTax: 'רווח נקי בכיס לאחר כל המיסים',
    exemptionGranted: 'פטור מלא מתשלום מס שבח',
    faqTitle: 'שאלות נפוצות, מדרגות רשות המיסים וזכויות פטור',
    q1: 'כיצד מחושב מס רכישה מדורג בישראל?',
    a1: 'מס רכישה הוא מס פרוגרסיבי המחושב במדרגות. בדירה יחידה יש פטור מלא (0% מס) עד לסכום של 1,978,745 ₪. מעל סכום זה משלמים 3.5%, 5%, 8% ו-10% לפי המדרגות הרשמיות. בדירה שנייה ומעלה המס מתחיל מ-8% מהשקל הראשון עד כ-6.05 מיליון ₪ ומעל זה 10%.',
    q2: 'מהו חישוב מס שבח ליניארי מוטב?',
    a2: 'רפורמת מס שבח שנכנסה לתוקף ב-1.1.2014 קובעת שרווח השבח מחולק באופן יחסי (ליניארי) על פני שנות ההחזקה. החלק בשבח שנצבר עד סוף 2013 פטור לחלוטין ממס, ורק החלק היחסי משנת 2014 ואילך מחויב במס שבח בשיעור 25%.',
    q3: 'אילו הוצאות מותר לנכות ממס שבח?',
    a3: 'ניתן לנכות הוצאות תיווך (עד 2% + מע"מ), שכר טרחת עורך דין בקנייה ובמכירה, הוצאות שיפוץ והשבחה עם חשבוניות, היטל השבחה לוועדה המקומית, מס רכישה ששולם במקור, וריבית ריאלית על הלוואת המשכנתא.'
  },
  es: {
    title: 'Calculadora de Impuestos Inmobiliarios (Compra y Plusvalía)',
    subtitle: 'Tramos Fiscales Progresivos de Compra y Ganancias Patrimoniales',
    description: 'Calcula el impuesto de transmisiones/compra inmobiliaria por tramos y el impuesto sobre el incremento de valor/plusvalía con deducciones de gastos.',
    tabPurchaseTax: 'Impuesto de Compra / Transmisiones',
    tabAppreciationTax: 'Impuesto sobre Plusvalía / Ganancia',
    propertyPrice: 'Precio de Compra del Inmueble (₪)',
    buyerType: 'Tipo de Comprador',
    singleHome: 'Vivienda Habitual Única',
    additionalHome: 'Segunda Residencia / Inversor',
    foreignResident: 'No Residente',
    commercial: 'Local Comercial / Terreno (6%)',
    olehDisabled: 'Nuevo Residente / Discapacidad',
    totalTaxDue: 'Total Impuesto a Pagar',
    effectiveRate: 'Tipo Impositivo Efectivo',
    bracketBreakdown: 'Desglose por Tramos Fiscales',
    tier: 'Tramo',
    range: 'Rango de Precio',
    rate: 'Tipo (%)',
    taxInTier: 'Impuesto en Tramo',
    purchasePrice: 'Precio de Compra Original (₪)',
    sellingPrice: 'Precio de Venta Actual (₪)',
    purchaseYear: 'Año de Compra',
    sellingYear: 'Año de Venta',
    singleHomeExempt: 'Exención por Vivienda Habitual',
    renovationExpenses: 'Gastos de Reformas y Mejoras (₪)',
    lawyerAndAgentFees: 'Gastos de Notaría, Abogado y Agencia (₪)',
    purchaseTaxPaid: 'Impuesto de Compra Pagado en su día (₪)',
    mortgageRealInterest: 'Intereses Reales de Hipoteca (₪)',
    improvementLevy: 'Tasas Municipales de Plusvalía (₪)',
    grossAppreciation: 'Plusvalía Bruta',
    totalDeductions: 'Total Deducciones Aplicables',
    netAppreciation: 'Plusvalía Neta Sujeta a Impuesto',
    appreciationTaxDue: 'Impuesto sobre Ganancia Patrimonial',
    netProfitAfterTax: 'Beneficio Neto Tras Impuestos',
    exemptionGranted: 'Exención Total de Impuesto',
    faqTitle: 'Preguntas Frecuentes sobre Fiscalidad Inmobiliaria',
    q1: '¿Cómo funciona el cálculo progresivo?',
    a1: 'Cada tramo de precio tributa a su porcentaje específico, permitiendo un tipo impositivo medio inferior al tipo marginal superior.',
    q2: '¿Qué gastos se pueden deducir?',
    a2: 'Reformas justificadas, honorarios de abogados y agencias, impuestos abonados en la compra e intereses hipotecarios.',
    q3: '¿Cuándo aplica la exención por vivienda habitual?',
    a3: 'Cuando se cumplen los requisitos legales de titularidad y residencia continuada bajo los límites de precio fijados por la normativa.'
  },
  fr: {
    title: 'Calculateur de Droits de Mutation & Plus-Value Immobilière',
    subtitle: 'Barème Progressif d\'Acquisition & Fiscalité des Plus-Values',
    description: 'Calculez les droits d\'enregistrement par tranches progressives et l\'impôt sur la plus-value immobilière avec déduction des frais et abattements légaux.',
    tabPurchaseTax: 'Droits d\'Acquisition / Achat',
    tabAppreciationTax: 'Impôt sur la Plus-Value',
    propertyPrice: 'Prix d\'Achat du Bien (₪)',
    buyerType: 'Statut de l\'Acquéreur',
    singleHome: 'Résidence Principale Unique',
    additionalHome: 'Investisseur / Résidence Secondaire',
    foreignResident: 'Non-Résident',
    commercial: 'Local Commercial / Terrain (6%)',
    olehDisabled: 'Nouvel Arrivant / Situation Spécifique',
    totalTaxDue: 'Total Droits de Mutation Dus',
    effectiveRate: 'Taux Moyen Effectif',
    bracketBreakdown: 'Détail par Tranche d\'Imposition',
    tier: 'Tranche',
    range: 'Fourchette de Prix',
    rate: 'Taux (%)',
    taxInTier: 'Impôt de la Tranche',
    purchasePrice: 'Prix d\'Achat Initial (₪)',
    sellingPrice: 'Prix de Vente Actuel (₪)',
    purchaseYear: 'Année d\'Achat',
    sellingYear: 'Année de Vente',
    singleHomeExempt: 'Exonération Résidence Principale',
    renovationExpenses: 'Travaux de Rénovation et Améliorations (₪)',
    lawyerAndAgentFees: 'Frais d\'Agence et Honoraires Juridiques (₪)',
    purchaseTaxPaid: 'Droits de Mutation Déjà Payés (₪)',
    mortgageRealInterest: 'Intérêts d\'Emprunt Réels (₪)',
    improvementLevy: 'Taxes d\'Urbanisme et d\'Aménagement (₪)',
    grossAppreciation: 'Plus-Value Brute',
    totalDeductions: 'Total des Frais Déductibles',
    netAppreciation: 'Plus-Value Nette Imposable',
    appreciationTaxDue: 'Impôt sur la Plus-Value (25% Linéaire)',
    netProfitAfterTax: 'Gain Net Réalisé Après Impôt',
    exemptionGranted: 'Exonération Totale Accordée',
    faqTitle: 'Guide et Questions Fréquentes sur la Fiscalité Immobilière',
    q1: 'Comment fonctionnent les droits d\'enregistrement ?',
    a1: 'L\'impôt est calculé de façon progressive par tranches de valeur du bien.',
    q2: 'Quels frais sont déductibles de la plus-value ?',
    a2: 'Les factures de travaux, frais de notaire et d\'agence, taxes d\'aménagement et intérêts de crédit.',
    q3: 'Quand bénéficie-t-on d\'une exonération ?',
    a3: 'La résidence principale unique bénéficie d\'une exonération sous condition de détention et sous réserve des plafonds légaux.'
  },
  ar: {
    title: 'حاسبة ضريبة الشراء وضريبة الأرباح العقارية (المسقفات والشبح)',
    subtitle: 'شرائح ضريبة الشراء المتدرجة وضريبة الأرباح الرأسمالية مع خصم المصروفات',
    description: 'احسب ضريبة الشراء العقارية المتدرجة للشقة الأولى وشقق الاستثمار وضريبة تحسين العقار (الشبح) مع احتساب كافة الخصومات والإعفاءات الرسمية.',
    tabPurchaseTax: 'ضريبة الشراء المتدرجة',
    tabAppreciationTax: 'ضريبة الأرباح الرأسمالية (الشبح)',
    propertyPrice: 'سعر شراء العقار (₪)',
    buyerType: 'صفة المشتري ونوع العقار',
    singleHome: 'شقة سكنية وحيدة (مقيم)',
    additionalHome: 'شقة إضافية / مستثمر عقاري',
    foreignResident: 'مقيم أجنبي',
    commercial: 'عقار تجاري / أرض (6%)',
    olehDisabled: 'قادم جديد / مستحق إعفاء',
    totalTaxDue: 'إجمالي ضريبة الشراء المستحقة',
    effectiveRate: 'النسبة الضريبية الفعلية',
    bracketBreakdown: 'تفصيل الشرائح الضريبية',
    tier: 'الشريحة',
    range: 'نطاق السعر',
    rate: 'نسبة الضريبة',
    taxInTier: 'الضريبة بالشريحة',
    purchasePrice: 'سعر الشراء الأصلي (₪)',
    sellingPrice: 'سعر البيع الحالي (₪)',
    purchaseYear: 'سنة الشراء',
    sellingYear: 'سنة البيع',
    singleHomeExempt: 'مستحق لإعفاء الشقة السكنية الوحيدة',
    renovationExpenses: 'تكاليف الترميم والتحسينات (₪)',
    lawyerAndAgentFees: 'أتعاب المحامي والوسيط العقاري (₪)',
    purchaseTaxPaid: 'ضريبة الشراء المدفوعة سابقاً (₪)',
    mortgageRealInterest: 'الفوائد الفعلية على الرهن العقاري (₪)',
    improvementLevy: 'رسوم التحسين البلدية (₪)',
    grossAppreciation: 'الربح الرأسمالي الإجمالي',
    totalDeductions: 'إجمالي المصروفات القابلة للخصم',
    netAppreciation: 'صافي الربح الخاضع للضريبة',
    appreciationTaxDue: 'ضريبة الأرباح المستحقة (25%)',
    netProfitAfterTax: 'صافي الربح المتبقي في اليد',
    exemptionGranted: 'إعفاء ضريبي كامل',
    faqTitle: 'الأسئلة الشائعة حول الضرائب العقارية',
    q1: 'كيف تُحسب ضريبة الشراء؟',
    a1: 'ضريبة الشراء تصاعدية؛ الشقة الأولى معفاة حتى ~1.97 مليون شيكل وتتدرج النسب للأعلى، بينما الشقة الإضافية تبدأ من 8%.',
    q2: 'ما هي المصروفات القابلة للخصم من ضريبة الأرباح؟',
    a2: 'أتعاب الوساطة والمحاماة، فواتير الترميم، رسوم التحسين والفوائد البنكية.',
    q3: 'متى يحصل البائع على إعفاء كامل؟',
    a3: 'عند بيع شقة سكنية وحيدة مؤهلة للإعفاء وفق الشروط والأسقف السعرية القانونية.'
  }
};

export default function PurchaseAppreciationTax() {
  const { lang } = useI18n();
  const t = localDict[lang as keyof typeof localDict] || localDict.en;

  const [activeTab, setActiveTab] = useUrlState<'purchase' | 'appreciation'>('tab', 'purchase');

  // Purchase Tax Inputs
  const [propertyPrice, setPropertyPrice] = useUrlState<number>('price', 2800000);
  const [buyerType, setBuyerType] = useUrlState<'single_home' | 'additional_home' | 'foreign_resident' | 'commercial' | 'oleh_disabled'>('buyer', 'single_home');

  // Appreciation Tax Inputs
  const [origPurchasePrice, setOrigPurchasePrice] = useUrlState<number>('origPrice', 1400000);
  const [sellingPrice, setSellingPrice] = useUrlState<number>('sellPrice', 3100000);
  const [purchaseYear, setPurchaseYear] = useUrlState<number>('buyYear', 2012);
  const [sellingYear, setSellingYear] = useUrlState<number>('sellYear', 2026);
  const [isSingleHomeExempt, setIsSingleHomeExempt] = useUrlState<boolean>('exempt', false);
  const [renovationExpenses, setRenovationExpenses] = useUrlState<number>('renov', 120000);
  const [lawyerAndAgentFees, setLawyerAndAgentFees] = useUrlState<number>('legalFees', 55000);
  const [purchaseTaxPaid, setPurchaseTaxPaid] = useUrlState<number>('prevTax', 0);
  const [mortgageRealInterest, setMortgageRealInterest] = useUrlState<number>('mortgageInt', 35000);
  const [improvementLevy, setImprovementLevy] = useUrlState<number>('levy', 40000);

  // Results calculations
  const purchaseResult = calculatePurchaseTax(propertyPrice, buyerType);
  const appreciationResult = calculateAppreciationTax({
    purchasePrice: origPurchasePrice,
    sellingPrice,
    purchaseYear,
    sellingYear,
    isSingleHomeExempt,
    renovationExpenses,
    lawyerAndAgentFees,
    purchaseTaxPaid,
    mortgageRealInterest,
    improvementLevy
  });

  const currencyFormat = new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    maximumFractionDigits: 0
  });

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8" id="purchase-appreciation-tax-calc">
      <SEO
        title={`${t.title} | GlobalCalcPro`}
        description={t.description}
        canonicalUrl={`/${lang}/calculators/purchase-appreciation-tax`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: t.title,
          description: t.description,
          applicationCategory: 'RealEstateApplication',
          operatingSystem: 'Any',
          url: `https://globalcalcpro.com/${lang}/calculators/purchase-appreciation-tax`
        }}
      />

      {/* Header */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
                  {t.title}
                </h1>
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {t.subtitle}
                </p>
              </div>
            </div>
            <p className="text-stone-600 dark:text-stone-300 text-sm max-w-2xl leading-relaxed mt-2">
              {t.description}
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-stone-100 dark:bg-stone-800 p-1.5 rounded-2xl self-start md:self-auto border border-stone-200 dark:border-stone-700">
            <button
              id="tab-purchase-tax-btn"
              onClick={() => {
                setActiveTab('purchase');
                trackCalculation('purchase_tax_tab_selected');
              }}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'purchase'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Receipt className="w-4 h-4" />
              {t.tabPurchaseTax}
            </button>
            <button
              id="tab-appreciation-tax-btn"
              onClick={() => {
                setActiveTab('appreciation');
                trackCalculation('appreciation_tax_tab_selected');
              }}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'appreciation'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              {t.tabAppreciationTax}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PURCHASE TAX */}
      {/* ========================================================================= */}
      {activeTab === 'purchase' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input Controls */}
            <div className="lg:col-span-7 bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Home className="w-5 h-5 text-emerald-600" />
                נתוני הרכישה ומעמד הרוכש
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                    {t.propertyPrice}
                  </label>
                  <input
                    id="purchase-price-input"
                    type="number"
                    min="0"
                    step="50000"
                    value={propertyPrice || ''}
                    onChange={(e) => setPropertyPrice(Number(e.target.value))}
                    className="w-full px-4 py-3.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-black text-xl text-stone-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                  <div className="flex gap-2 mt-2">
                    {[1800000, 2500000, 3500000, 5000000].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setPropertyPrice(preset)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/50"
                      >
                        {currencyFormat.format(preset)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                    {t.buyerType}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { key: 'single_home', label: t.singleHome, desc: 'מדרגות פטור 0% עד 1,978,745 ₪' },
                      { key: 'additional_home', label: t.additionalHome, desc: '8% מהשקל הראשון עד 6.05M ₪' },
                      { key: 'foreign_resident', label: t.foreignResident, desc: '8% ו-10% לפי המדרגות' },
                      { key: 'commercial', label: t.commercial, desc: '6% אחיד' },
                      { key: 'oleh_disabled', label: t.olehDisabled, desc: '0.5% מדרגה ראשונה' }
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => setBuyerType(opt.key as any)}
                        className={`p-3.5 rounded-2xl text-right transition-all border ${
                          buyerType === opt.key
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold shadow-sm'
                            : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
                        }`}
                      >
                        <div className="font-bold text-xs">{opt.label}</div>
                        <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Live Sticky Summary */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
              <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-800 space-y-6">
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-stone-400 block mb-1">
                    {t.totalTaxDue}
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-emerald-400" dir="ltr">
                    {currencyFormat.format(purchaseResult.totalTax)}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-stone-300">
                      {t.effectiveRate}:
                    </span>
                    <span className="text-sm font-black text-white px-2.5 py-0.5 rounded-md bg-emerald-600/80">
                      {purchaseResult.effectiveTaxRate}%
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700/60 text-xs space-y-2">
                  <div className="flex justify-between text-stone-300">
                    <span>מחיר הנכס</span>
                    <span className="font-bold text-white">{currencyFormat.format(purchaseResult.propertyPrice)}</span>
                  </div>
                  <div className="flex justify-between text-stone-300">
                    <span>סך עלות כוללת (נכס + מס)</span>
                    <span className="font-bold text-emerald-400">
                      {currencyFormat.format(purchaseResult.propertyPrice + purchaseResult.totalTax)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Brackets Breakdown Table */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm overflow-x-auto">
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2 flex items-center gap-2">
              <Percent className="w-5 h-5 text-emerald-600" />
              {t.bracketBreakdown}
            </h3>
            <p className="text-xs text-stone-500 mb-6">פירוט מדויק של חישוב המס בכל שכבת מחיר לפי הוראות ביצוע מיסוי מקרקעין.</p>

            <table className="w-full text-right text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-700 text-stone-500 font-bold uppercase">
                  <th className="py-3 px-4">{t.tier}</th>
                  <th className="py-3 px-4">{t.range}</th>
                  <th className="py-3 px-4">{t.rate}</th>
                  <th className="py-3 px-4">סכום החייב במדרגה</th>
                  <th className="py-3 px-4 text-left">{t.taxInTier}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {purchaseResult.brackets.map((b, idx) => (
                  <tr key={idx} className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-stone-900 dark:text-white">מדרגה {idx + 1}</td>
                    <td className="py-3 px-4 text-stone-600 dark:text-stone-300" dir="ltr">
                      {b.to === -1 ? `מעל ${currencyFormat.format(b.from)}` : `${currencyFormat.format(b.from)} - ${currencyFormat.format(b.to)}`}
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">{b.rate}%</td>
                    <td className="py-3 px-4 text-stone-600 dark:text-stone-300">{currencyFormat.format(b.taxableInBracket)}</td>
                    <td className="py-3 px-4 text-left font-black text-stone-900 dark:text-white">
                      {currencyFormat.format(b.taxInBracket)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: APPRECIATION TAX (מס שבח) */}
      {/* ========================================================================= */}
      {activeTab === 'appreciation' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input Form */}
            <div className="lg:col-span-7 bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                נתוני עסקת המכירה והשבח
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                    {t.purchasePrice}
                  </label>
                  <input
                    id="orig-purchase-price-input"
                    type="number"
                    min="0"
                    step="50000"
                    value={origPurchasePrice || ''}
                    onChange={(e) => setOrigPurchasePrice(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-stone-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                    {t.sellingPrice}
                  </label>
                  <input
                    id="selling-price-input"
                    type="number"
                    min="0"
                    step="50000"
                    value={sellingPrice || ''}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-stone-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 mb-1">
                    {t.purchaseYear}
                  </label>
                  <input
                    id="purchase-year-input"
                    type="number"
                    min="1970"
                    max={2026}
                    value={purchaseYear}
                    onChange={(e) => setPurchaseYear(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-stone-900 dark:text-white"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">רכישות לפני 2014 זכאיות לחישוב ליניארי מוטב</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 mb-1">
                    {t.sellingYear}
                  </label>
                  <input
                    id="selling-year-input"
                    type="number"
                    min={purchaseYear}
                    max={2035}
                    value={sellingYear}
                    onChange={(e) => setSellingYear(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Single Home Exemption Checkbox */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    id="single-home-exempt-checkbox"
                    type="checkbox"
                    checked={isSingleHomeExempt}
                    onChange={(e) => setIsSingleHomeExempt(e.target.checked)}
                    className="w-5 h-5 accent-emerald-600 rounded"
                  />
                  <div>
                    <span className="font-bold text-xs text-stone-900 dark:text-white block">
                      {t.singleHomeExempt}
                    </span>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 block">
                      פטור מלא ממס שבח במכירת דירת מגורים יחידה עד תקרת שווי של כ-4,846,000 ₪
                    </span>
                  </div>
                </label>
              </div>

              {/* Deductible Expenses Section */}
              <div className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-4">
                <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <Coins className="w-4 h-4 text-emerald-600" />
                  הוצאות מוכרות לניכוי ממס שבח
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-stone-500 dark:text-stone-400 mb-1">
                      {t.renovationExpenses}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={renovationExpenses || ''}
                      onChange={(e) => setRenovationExpenses(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-500 dark:text-stone-400 mb-1">
                      {t.lawyerAndAgentFees}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={lawyerAndAgentFees || ''}
                      onChange={(e) => setLawyerAndAgentFees(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-500 dark:text-stone-400 mb-1">
                      {t.improvementLevy}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={improvementLevy || ''}
                      onChange={(e) => setImprovementLevy(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-500 dark:text-stone-400 mb-1">
                      {t.mortgageRealInterest}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={mortgageRealInterest || ''}
                      onChange={(e) => setMortgageRealInterest(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-500 dark:text-stone-400 mb-1">
                      מס רכישה מקורי ששולם (₪)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={purchaseTaxPaid || ''}
                      onChange={(e) => setPurchaseTaxPaid(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Appreciation Summary Card */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
              <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-800 space-y-6">
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-stone-400 block mb-1">
                    {t.appreciationTaxDue}
                  </span>
                  {appreciationResult.isExempt ? (
                    <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-600/50">
                      <div className="flex items-center gap-2 text-emerald-400 font-black text-xl mb-1">
                        <CheckCircle2 className="w-6 h-6" />
                        {t.exemptionGranted}
                      </div>
                      <p className="text-xs text-emerald-200">{appreciationResult.exemptionReason}</p>
                    </div>
                  ) : (
                    <div>
                      <div className="text-3xl sm:text-4xl font-black text-rose-400" dir="ltr">
                        {currencyFormat.format(appreciationResult.totalTax)}
                      </div>
                      <div className="text-xs text-stone-400 mt-1">
                        שיעור מס אפקטיבי: <span className="font-bold text-white">{appreciationResult.effectiveTaxRate}%</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Net Profit */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/80 to-stone-900 border border-emerald-900/50">
                  <span className="text-xs uppercase font-bold tracking-wider text-emerald-400 block mb-1">
                    {t.netProfitAfterTax}
                  </span>
                  <div className="text-3xl font-black text-white" dir="ltr">
                    {currencyFormat.format(appreciationResult.netProfit)}
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-stone-300 pt-2 border-t border-stone-800">
                  <div className="flex justify-between">
                    <span>{t.grossAppreciation}</span>
                    <span className="font-bold text-white">{currencyFormat.format(appreciationResult.totalAppreciationGross)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.totalDeductions}</span>
                    <span className="font-bold text-emerald-400">-{currencyFormat.format(appreciationResult.totalDeductions)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.netAppreciation}</span>
                    <span className="font-bold text-white">{currencyFormat.format(appreciationResult.netAppreciation)}</span>
                  </div>
                  {!appreciationResult.isExempt && purchaseYear < 2014 && (
                    <div className="flex justify-between text-stone-400 pt-1 border-t border-stone-800">
                      <span>חלק חייב מ-2014 (ליניארי)</span>
                      <span className="font-bold text-white">{(appreciationResult.linearAfter2014Fraction * 100).toFixed(0)}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ & Real Estate Tax Guide */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-10 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
        <h3 className="text-xl font-black text-stone-900 dark:text-white flex items-center gap-3">
          <HelpCircle className="w-6 h-6 text-emerald-600" />
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
