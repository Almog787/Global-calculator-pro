import React, { useDeferredValue } from 'react';
import { useUrlState } from '../../hooks/useUrlState';
import { useI18n } from '../../contexts/i18n';
import SEO from '../../components/SEO';
import { calculateStockOptionsRsu } from '../../lib/math/finance';
import { trackCalculation } from '../../lib/analytics';
import { 
  TrendingUp, 
  PieChart as PieIcon, 
  ShieldCheck, 
  Layers, 
  Briefcase,
  HelpCircle,
  Clock,
  Award
} from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

const localDict = {
  en: {
    title: 'Stock Options & RSU Calculator',
    subtitle: 'Vesting Schedule, Section 102 Tax, Dilution & Exit Scenarios',
    description: 'Calculate net proceeds, 4-year vesting schedule, capital gains tax under Section 102, dilution impact, and exit scenarios for startup equity and tech compensation.',
    grantType: 'Grant Type',
    options: 'Stock Options (ESOP)',
    rsu: 'RSU (Restricted Stock Units)',
    quantity: 'Number of Shares / Options',
    strikePrice: 'Exercise / Strike Price ($)',
    currentPrice: 'Current Fair Market Value / Share ($)',
    exitPrice: 'Projected Exit / IPO Share Price ($)',
    vestingYears: 'Total Vesting Period (Years)',
    cliffMonths: 'Cliff Period (Months)',
    monthsElapsed: 'Time Since Grant (Months)',
    dilutionPercent: 'Expected Future Dilution (%)',
    taxRoute: 'Taxation Track (Israel Section 102)',
    tax102Capital: 'Section 102 Capital Gains Track (25%)',
    tax102Income: 'Section 102 Ordinary Income Track',
    vestedShares: 'Vested Shares',
    unvestedShares: 'Unvested Shares',
    vestedValue: 'Current Vested Value (Gross)',
    vestedNetValue: 'Current Vested Value (Net)',
    exerciseCost: 'Cost to Exercise Vested',
    totalExitValue: 'Full Grant Value at Exit',
    netExitValue: 'Net Proceeds at Exit (After Tax & Dilution)',
    vestingProgress: 'Vesting Progress',
    exitScenarios: 'Exit & Valuation Multiplier Scenarios',
    multiplier: 'Valuation Multiple',
    sharePriceAtExit: 'Share Price',
    grossGain: 'Gross Gain',
    netGain: 'Net Take-Home',
    faqTitle: 'Frequently Asked Questions & Section 102 Tax Guide',
    q1: 'What is Section 102 Capital Gains Track in Israel?',
    a1: 'Section 102 of the Israeli Income Tax Ordinance allows employees to pay a flat 25% capital gains tax (instead of ordinary marginal income tax up to 50%) when options or RSUs are deposited with a trustee for a holding period of at least 24 months from grant date.',
    q2: 'How does the 1-Year Cliff work?',
    a2: 'A standard 1-year cliff means 0% of your shares vest during your first 12 months. Upon reaching month 12, 25% (1/4th) of your grant vests immediately, and the remaining 75% vests in equal monthly or quarterly installments over the next 36 months.',
    q3: 'What is equity dilution in startups?',
    a3: 'When a startup raises new capital, new shares are issued, which reduces each existing shareholder\'s percentage ownership. Factoring in 10%-20% future dilution gives a much more realistic projection of your net exit payout.'
  },
  he: {
    title: 'מחשבון שווי אופציות ו-RSU (הייטק ושכר)',
    subtitle: 'מדרגות הבשלה (Vesting), חישוב מס סעיף 102, דילול ותרחישי אקזיט',
    description: 'חשב את שווי האופציות ו-RSU שלך, לוח זמני הבשלה (Vesting Schedule), מס רווח הון לפי סעיף 102 (25%), השפעת דילול בסבבי גיוס ותרחישי אקזיט ו-IPO.',
    grantType: 'סוג המענק',
    options: 'אופציות לעובדים (Options / ESOP)',
    rsu: 'יחידות מניה חסומות (RSUs)',
    quantity: 'כמות מניות / אופציות שהוענקו',
    strikePrice: 'מחיר מימוש ליחידה - Strike Price ($)',
    currentPrice: 'מחיר מניה נוכחי / שווי הוגן ($)',
    exitPrice: 'מחיר יעד באקזיט / הנפקה ($)',
    vestingYears: 'תקופת הבשלה כוללת (שנים)',
    cliffMonths: 'תקופת קליף (חודשים)',
    monthsElapsed: 'ותק מיום ההענקה (חודשים)',
    dilutionPercent: 'אחוז דילול צפוי בסבבים עתידיים (%)',
    taxRoute: 'מסלול מיסוי (סעיף 102 לפקודת מס הכנסה)',
    tax102Capital: 'מסלול רווח הון 102 (25% מס קבוע)',
    tax102Income: 'מסלול הכנסת עבודה / פירותי (לפי מס שולי)',
    vestedShares: 'מניות שהבשילו (Vested)',
    unvestedShares: 'מניות שטרם הבשילו',
    vestedValue: 'שווי נוכחי של מה שהבשיל (ברוטו)',
    vestedNetValue: 'רווח נקי כעת בכיס (נטו לאחר מס)',
    exerciseCost: 'עלות מימוש האופציות שהבשילו',
    totalExitValue: 'שווי מענק מלא באקזיט',
    netExitValue: 'רווח נקי באקזיט (אחרי מס ודילול)',
    vestingProgress: 'התקדמות הבשלה (Vesting Progress)',
    exitScenarios: 'תרחישי שווי באקזיט ומכפילי שווי',
    multiplier: 'מכפיל שווי',
    sharePriceAtExit: 'מחיר מניה',
    grossGain: 'רווח ברוטו',
    netGain: 'רווח נקי ביד',
    faqTitle: 'שאלות נפוצות, סעיף 102 וזכויות עובדים בהייטק',
    q1: 'מהו מסלול רווח הון לפי סעיף 102?',
    a1: 'סעיף 102 לפקודת מס הכנסה (מסלול רווח הון באמצעות נאמן) מאפשר לעובדים לשלם מס רווח הון בשיעור מופחת של 25% בלבד על הרווח (במקום מס שולי של עד 50%), בתנאי שהאופציות מוחזקות אצל הנאמן לפחות 24 חודשים ממועד ההענקה.',
    q2: 'כיצד פועל מנגנון ה-Cliff של שנה ראשונה?',
    a2: 'תקופת ה-Cliff היא שנת הניסיון: ב-12 החודשים הראשונים לא מבשילה אף אופציה. ביום השנה הראשון מבשילות בבת אחת 25% מסך האופציות, ולאחר מכן שאר ה-75% מבשילים בחלקים שווים מדי חודש או רבעון לאורך 3 השנים הבאות.',
    q3: 'מה המשמעות של דילול מניות (Dilution)?',
    a3: 'בכל פעם שהחברה מגייסת סבב הון נוסף ממשקיעים (Series A, B, C), היא מנפיקה מניות חדשות, מה שמקטין את האחוז היחסי של בעלי המניות והעובדים הקיימים. הערכת דילול של 10%-25% מאפשרת לחשב תחזית רווח ריאלית ומדויקת באקזיט.'
  },
  es: {
    title: 'Calculadora de Opciones sobre Acciones y RSU',
    subtitle: 'Cronograma de Vesting, Impuestos, Dilución y Escenarios de Salida',
    description: 'Calcula el valor de tus opciones sobre acciones y RSUs, calendario de consolidación (vesting), impuestos sobre ganancias de capital y escenarios de salida o IPO.',
    grantType: 'Tipo de Concesión',
    options: 'Opciones sobre Acciones (Stock Options)',
    rsu: 'Unidades de Acciones Restringidas (RSU)',
    quantity: 'Cantidad de Acciones / Opciones',
    strikePrice: 'Precio de Ejercicio / Strike ($)',
    currentPrice: 'Valor de Mercado Actual por Acción ($)',
    exitPrice: 'Precio Proyectado en Salida / IPO ($)',
    vestingYears: 'Período Total de Vesting (Años)',
    cliffMonths: 'Período Cliff (Meses)',
    monthsElapsed: 'Meses Transcurridos desde la Concesión',
    dilutionPercent: 'Dilución Futura Estimada (%)',
    taxRoute: 'Régimen Fiscal',
    tax102Capital: 'Ganancias de Capital (25%)',
    tax102Income: 'Rentas del Trabajo (Ordinario)',
    vestedShares: 'Acciones Consolidadas (Vested)',
    unvestedShares: 'Acciones Pendientes',
    vestedValue: 'Valor Consolidado Actual (Bruto)',
    vestedNetValue: 'Ganancia Neta Consolidada',
    exerciseCost: 'Coste de Ejercicio Consolidado',
    totalExitValue: 'Valor Total en la Salida',
    netExitValue: 'Beneficio Neto en Salida (Tras Impuestos y Dilución)',
    vestingProgress: 'Progreso de Consolidación (Vesting)',
    exitScenarios: 'Escenarios de Salida y Multiplicadores',
    multiplier: 'Múltiplo de Valoración',
    sharePriceAtExit: 'Precio Acción',
    grossGain: 'Ganancia Bruta',
    netGain: 'Ganancia Neta',
    faqTitle: 'Preguntas Frecuentes y Guía de Equidad',
    q1: '¿Qué es el período Cliff?',
    a1: 'El cliff es un período inicial (generalmente 12 meses) durante el cual no se adquieren acciones. Al cumplir el año, se consolida de golpe el 25% del paquete.',
    q2: '¿Cómo afecta la dilución a mis opciones?',
    a2: 'Nuevas rondas de inversión emiten nuevas acciones, reduciendo el porcentaje que posees de la empresa.',
    q3: '¿Cuál es la diferencia entre Opciones y RSUs?',
    a3: 'Las opciones te dan el derecho de comprar acciones a un precio fijo (strike). Los RSUs son acciones directas con un coste de adquisición de 0$.'
  },
  fr: {
    title: 'Calculateur Stock-Options et RSU',
    subtitle: 'Plan d\'Acquisition (Vesting), Fiscalité, Dilution et Scénarios de Sortie',
    description: 'Calculez la valeur de vos stock-options et actions gratuites (RSU), échéancier d\'acquisition, fiscalité des plus-values et gains nets lors d\'un rachat ou d\'une introduction en bourse.',
    grantType: 'Type d\'Attribution',
    options: 'Stock-Options',
    rsu: 'Actions Gratuites (RSU)',
    quantity: 'Nombre d\'Actions / Options',
    strikePrice: 'Prix d\'Exercice / Strike ($)',
    currentPrice: 'Valeur Actuelle par Action ($)',
    exitPrice: 'Prix Cible de Sortie / IPO ($)',
    vestingYears: 'Période Totale de Vesting (Années)',
    cliffMonths: 'Période de Cliff (Mois)',
    monthsElapsed: 'Mois Écoulés',
    dilutionPercent: 'Dilution Estimée (%)',
    taxRoute: 'Régime Fiscal',
    tax102Capital: 'Plus-values Mobilières (25%)',
    tax102Income: 'Barème Progressif de l\'Impôt',
    vestedShares: 'Actions Acquises (Vested)',
    unvestedShares: 'Actions Non Acquises',
    vestedValue: 'Valeur Acquise Actuelle (Brut)',
    vestedNetValue: 'Gain Net Acquis',
    exerciseCost: 'Coût d\'Exercice des Actions Acquises',
    totalExitValue: 'Valeur Totale en Sortie',
    netExitValue: 'Gain Net en Sortie (Après Impôts et Dilution)',
    vestingProgress: 'Progression du Vesting',
    exitScenarios: 'Scénarios de Sortie et Multiplicateurs',
    multiplier: 'Multiple',
    sharePriceAtExit: 'Prix Action',
    grossGain: 'Gain Brut',
    netGain: 'Gain Net',
    faqTitle: 'Questions Fréquentes sur l\'Actionnariat Salarié',
    q1: 'Qu\'est-ce que le Cliff ?',
    a1: 'Le cliff est une période initiale d\'un an au cours de laquelle aucune action n\'est acquise. Au 12ème mois, 25% des actions sont libérées d\'un coup.',
    q2: 'Comment fonctionne la dilution ?',
    a2: 'Les levées de fonds successives augmentent le nombre total d\'actions, diluant la part relative détenue par les salariés.',
    q3: 'Différence entre Stock-Options et RSUs ?',
    a3: 'Les options nécessitent de payer un prix d\'exercice (strike) pour devenir actionnaire, alors que les RSUs sont attribuées gratuitement (prix 0$).'
  },
  ar: {
    title: 'حاسبة خيارات الأسهم والأسهم المقيدة (RSU)',
    subtitle: 'جدول الاستحقاق (Vesting)، الضرائب، التخفيف وسيناريوهات التخارج',
    description: 'احسب قيمة خيارات الأسهم والـ RSU، جدول الاستحقاق الزمني، الضرائب على الأرباح الرأسمالية وتوقعات العائد المالي الصافي عند بيع الشركة أو الاكتتاب العام.',
    grantType: 'نوع المنحة',
    options: 'خيارات الأسهم (Stock Options)',
    rsu: 'وحدات الأسهم المقيدة (RSU)',
    quantity: 'عدد الأسهم أو الخيارات',
    strikePrice: 'سعر الممارسة / الشراء ($)',
    currentPrice: 'سعر السهم الحالي ($)',
    exitPrice: 'سعر السهم المستهدف عند التخارج ($)',
    vestingYears: 'مدة الاستحقاق الكاملة (سنوات)',
    cliffMonths: 'فترة الحظر الأولية - Cliff (شهور)',
    monthsElapsed: 'الشهور المنقضية منذ المنحة',
    dilutionPercent: 'نسبة التخفيف المتوقعة (%)',
    taxRoute: 'المسار الضريبي',
    tax102Capital: 'أرباح رأسمالية (25%)',
    tax102Income: 'ضريبة الدخل المعتادة',
    vestedShares: 'الأسهم المستحقة (Vested)',
    unvestedShares: 'الأسهم غير المستحقة',
    vestedValue: 'القيمة الحالية المستحقة (إجمالي)',
    vestedNetValue: 'الربح الصافي المستحق كاش',
    exerciseCost: 'تكلفة ممارسة الأسهم المستحقة',
    totalExitValue: 'القيمة الإجمالية عند التخارج',
    netExitValue: 'الربح الصافي عند التخارج (بعد الضريبة)',
    vestingProgress: 'مستوى الاستحقاق',
    exitScenarios: 'سيناريوهات التخارج ومضاعفات التقييم',
    multiplier: 'مضاعف التقييم',
    sharePriceAtExit: 'سعر السهم',
    grossGain: 'الربح الإجمالي',
    netGain: 'الربح الصافي',
    faqTitle: 'الأسئلة الشائعة حول أسهم الموظفين',
    q1: 'ما هي فترة الـ Cliff؟',
    a1: 'فترة الـ Cliff هي السنة الأولى التي لا يستحق فيها الموظف أي سهم، وعند إتمام 12 شهراً يستحق 25% من الأسهم دفعة واحدة.',
    q2: 'ما المقصود بتخفيف الملكية (Dilution)؟',
    a2: 'عندما تجمع الشركة جولات تمويلية جديدة تصدر أسهماً جديدة مما يقلل النسبة المئوية لملكية الموظفين القدامى.',
    q3: 'ما الفرق بين Options و RSU؟',
    a3: 'خيارات الأسهم تتطلب دفع سعر شراء (Strike)، بينما أسهم الـ RSU تُمنح بدون تكلفة شراء.'
  }
};

export default function StockOptionsRsu() {
  const { lang } = useI18n();
  const t = localDict[lang as keyof typeof localDict] || localDict.en;

  const [grantType, setGrantType] = useUrlState<'options' | 'rsu'>('type', 'options');
  const [quantity, setQuantity] = useUrlState<number>('qty', 10000);
  const [strikePrice, setStrikePrice] = useUrlState<number>('strike', 2.0);
  const [currentPrice, setCurrentPrice] = useUrlState<number>('currPrice', 15.0);
  const [exitPrice, setExitPrice] = useUrlState<number>('exitPrice', 45.0);
  const [vestingYears, setVestingYears] = useUrlState<number>('years', 4);
  const [cliffMonths, setCliffMonths] = useUrlState<number>('cliff', 12);
  const [monthsElapsed, setMonthsElapsed] = useUrlState<number>('elapsed', 20);
  const [dilutionPercent, setDilutionPercent] = useUrlState<number>('dilution', 15);
  const [taxRoute, setTaxRoute] = useUrlState<'section102_capital' | 'section102_income' | 'standard_capital'>('tax', 'section102_capital');

  const results = calculateStockOptionsRsu({
    grantType,
    quantity,
    strikePrice: grantType === 'rsu' ? 0 : strikePrice,
    currentPrice,
    exitPrice,
    vestingYears,
    cliffMonths,
    monthsElapsed,
    dilutionPercent,
    taxRoute
  });

  const currencyFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

  const chartLabels = results.vestingSchedule.map(p => `M${p.month}`);
  const chartValues = results.vestingSchedule.map(p => p.vestedGrossValue);

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: t.grossGain,
        data: chartValues,
        backgroundColor: '#3b82f6',
        borderRadius: 6,
      }
    ]
  };

  const deferredChartData = useDeferredValue(chartData);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8" id="stock-options-rsu-calc">
      <SEO
        title={`${t.title} | GlobalCalcPro`}
        description={t.description}
        canonicalUrl={`/${lang}/calculators/stock-options-rsu`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: t.title,
          description: t.description,
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Any',
          url: `https://globalcalcpro.com/${lang}/calculators/stock-options-rsu`
        }}
      />

      {/* Header */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
                  {t.title}
                </h1>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {t.subtitle}
                </p>
              </div>
            </div>
            <p className="text-stone-600 dark:text-stone-300 text-sm max-w-2xl leading-relaxed mt-2">
              {t.description}
            </p>
          </div>

          {/* Grant Type Selector */}
          <div className="flex bg-stone-100 dark:bg-stone-800 p-1.5 rounded-2xl self-start md:self-auto border border-stone-200 dark:border-stone-700">
            <button
              id="grant-type-options-btn"
              onClick={() => {
                setGrantType('options');
                trackCalculation('stock_options_rsu_toggle_options');
              }}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                grantType === 'options'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              {t.options}
            </button>
            <button
              id="grant-type-rsu-btn"
              onClick={() => {
                setGrantType('rsu');
                trackCalculation('stock_options_rsu_toggle_rsu');
              }}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                grantType === 'rsu'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              {t.rsu}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Inputs + Sticky Live KPI Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              {t.grantType} & Parameters
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                  {t.quantity}
                </label>
                <input
                  id="calc-quantity-input"
                  type="number"
                  min="0"
                  step="100"
                  value={quantity || ''}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-stone-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {grantType === 'options' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                    {t.strikePrice}
                  </label>
                  <input
                    id="calc-strike-input"
                    type="number"
                    min="0"
                    step="0.1"
                    value={strikePrice || ''}
                    onChange={(e) => setStrikePrice(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-stone-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                  {t.currentPrice}
                </label>
                <input
                  id="calc-current-price-input"
                  type="number"
                  min="0"
                  step="0.5"
                  value={currentPrice || ''}
                  onChange={(e) => setCurrentPrice(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-stone-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                  {t.exitPrice}
                </label>
                <input
                  id="calc-exit-price-input"
                  type="number"
                  min="0"
                  step="1"
                  value={exitPrice || ''}
                  onChange={(e) => setExitPrice(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-stone-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Vesting Schedule Parameters */}
            <div className="pt-6 border-t border-stone-100 dark:border-stone-800">
              <h3 className="text-sm font-bold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                Vesting Schedule & Timeline
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 mb-1">
                    {t.vestingYears}
                  </label>
                  <input
                    id="calc-vesting-years-input"
                    type="number"
                    min="1"
                    max="6"
                    value={vestingYears || 4}
                    onChange={(e) => setVestingYears(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-stone-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 mb-1">
                    {t.cliffMonths}
                  </label>
                  <input
                    id="calc-cliff-input"
                    type="number"
                    min="0"
                    max="24"
                    value={cliffMonths}
                    onChange={(e) => setCliffMonths(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-stone-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 mb-1">
                    {t.monthsElapsed}
                  </label>
                  <input
                    id="calc-elapsed-input"
                    type="number"
                    min="0"
                    max={vestingYears * 12}
                    value={monthsElapsed}
                    onChange={(e) => setMonthsElapsed(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-blue-600 dark:text-blue-400"
                  />
                </div>
              </div>

              {/* Slider for elapsed months */}
              <div className="mt-4">
                <input
                  id="calc-elapsed-slider"
                  type="range"
                  min="0"
                  max={vestingYears * 12}
                  value={monthsElapsed}
                  onChange={(e) => setMonthsElapsed(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-stone-400 mt-1">
                  <span>Day 1 (0 Mo)</span>
                  <span>1-Yr Cliff (12 Mo)</span>
                  <span>Fully Vested ({vestingYears * 12} Mo)</span>
                </div>
              </div>
            </div>

            {/* Dilution & Section 102 Tax */}
            <div className="pt-6 border-t border-stone-100 dark:border-stone-800">
              <h3 className="text-sm font-bold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                {t.taxRoute} & Dilution
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 mb-1">
                    {t.dilutionPercent}
                  </label>
                  <input
                    id="calc-dilution-input"
                    type="number"
                    min="0"
                    max="60"
                    step="5"
                    value={dilutionPercent}
                    onChange={(e) => setDilutionPercent(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-stone-900 dark:text-white"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">Typical 10-20% per major funding round</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 mb-1">
                    {t.taxRoute}
                  </label>
                  <select
                    id="calc-tax-route-select"
                    value={taxRoute}
                    onChange={(e) => setTaxRoute(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-stone-900 dark:text-white text-xs"
                  >
                    <option value="section102_capital">{t.tax102Capital}</option>
                    <option value="section102_income">{t.tax102Income}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Live Sticky Dashboard (5 Cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-800 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <span className="text-xs uppercase font-bold tracking-wider text-stone-400">
                {t.vestingProgress} ({monthsElapsed} / {vestingYears * 12} Mo)
              </span>
              <span className="text-sm font-black px-3 py-1 rounded-full bg-blue-600 text-white">
                {results.vestedPercent}% Vested
              </span>
            </div>

            {/* Vested Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-stone-800/60 p-4 rounded-2xl border border-stone-800">
                <span className="text-xs text-stone-400 block mb-1">{t.vestedShares}</span>
                <span className="text-2xl font-black text-blue-400">
                  {results.vestedShares.toLocaleString()}
                </span>
                <span className="text-[11px] text-stone-500 block mt-0.5">
                  out of {results.totalShares.toLocaleString()} total
                </span>
              </div>

              <div className="bg-stone-800/60 p-4 rounded-2xl border border-stone-800">
                <span className="text-xs text-stone-400 block mb-1">{t.vestedNetValue}</span>
                <span className="text-2xl font-black text-emerald-400" dir="ltr">
                  {currencyFormat.format(results.netProceedsCurrent)}
                </span>
                <span className="text-[11px] text-stone-500 block mt-0.5">
                  Gross: {currencyFormat.format(results.grossProceedsCurrent)}
                </span>
              </div>
            </div>

            {/* Big Exit Projection */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/60 to-emerald-950/60 border border-blue-900/40">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Award className="w-4 h-4" />
                {t.netExitValue}
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white" dir="ltr">
                {currencyFormat.format(results.netProceedsExit)}
              </div>
              <div className="flex justify-between items-center text-xs text-stone-300 mt-3 pt-3 border-t border-white/10">
                <span>{t.totalExitValue}: {currencyFormat.format(results.grossProceedsExit)}</span>
                <span>Tax Rate: {results.effectiveTaxRate}%</span>
              </div>
            </div>

            {/* Detailed Rows */}
            <div className="space-y-3 text-xs pt-2">
              {grantType === 'options' && (
                <div className="flex justify-between py-2 border-b border-stone-800">
                  <span className="text-stone-400">{t.exerciseCost}</span>
                  <span className="font-bold text-white" dir="ltr">
                    {currencyFormat.format(results.exerciseCostVested)}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-stone-800">
                <span className="text-stone-400">Effective Exit Share Price (post-dilution)</span>
                <span className="font-bold text-white" dir="ltr">
                  ${results.effectiveExitPrice}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-800">
                <span className="text-stone-400">Estimated Exit Tax Due</span>
                <span className="font-bold text-rose-400" dir="ltr">
                  {currencyFormat.format(results.taxEstimatedExit)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vesting Timeline Chart & Exit Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vesting Chart */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm">
          <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Vesting Growth Timeline
          </h3>
          <p className="text-xs text-stone-500 mb-6">Cumulative gross value of vested options across 48 months.</p>
          <div className="w-full h-64" dir="ltr">
            <Bar
              data={deferredChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: {
                    ticks: {
                      callback: (val) => `$${Number(val).toLocaleString()}`
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Exit Sensitivity Matrix */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm overflow-x-auto">
          <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2 flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-emerald-600" />
            {t.exitScenarios}
          </h3>
          <p className="text-xs text-stone-500 mb-4">Sensitivity matrix based on future valuation changes and dilution.</p>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-700 text-stone-500 font-bold uppercase">
                <th className="py-2.5 px-3">{t.multiplier}</th>
                <th className="py-2.5 px-3">{t.sharePriceAtExit}</th>
                <th className="py-2.5 px-3">{t.grossGain}</th>
                <th className="py-2.5 px-3 text-right">{t.netGain}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {results.exitScenarios.map((sc, idx) => (
                <tr key={idx} className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-black text-blue-600 dark:text-blue-400">{sc.multiplier}x</td>
                  <td className="py-2.5 px-3 text-stone-700 dark:text-stone-300">${sc.sharePrice}</td>
                  <td className="py-2.5 px-3 text-stone-700 dark:text-stone-300">{currencyFormat.format(sc.grossGain)}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    {currencyFormat.format(sc.netGain)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Educational Guide & FAQ Section */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-10 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
        <h3 className="text-xl font-black text-stone-900 dark:text-white flex items-center gap-3">
          <HelpCircle className="w-6 h-6 text-blue-600" />
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
