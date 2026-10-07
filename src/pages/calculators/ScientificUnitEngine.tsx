import React, { useMemo } from 'react';
import { useUrlState } from '../../hooks/useUrlState';
import { useI18n } from '../../contexts/i18n';
import SEO from '../../components/SEO';
import FAQ from '../../components/FAQ';
import CopyButton from '../../components/CopyButton';
import {
  SCIENTIFIC_CATEGORIES,
  convertScientificUnit,
  UnitCategory,
} from '../../lib/math/scientificUnits';
import { Atom, Gauge, Zap, HardDrive, Compass, Thermometer, Binary, ArrowRightLeft, Sparkles } from 'lucide-react';

const localDict = {
  en: {
    title: 'Scientific & Engineering Unit Converter',
    subtitle: 'High-Precision Multi-Unit Converter for Physics, Thermodynamics & Computer Science',
    description: 'Convert complex engineering and scientific units including Pressure (Pa, Bar, PSI), Energy (Joules, kWh, BTU), Power, Data Storage, Force, and Thermodynamics with high numerical precision.',
    selectCategory: 'Scientific Category',
    fromUnit: 'From Unit',
    toUnit: 'To Unit',
    enterValue: 'Input Value',
    convertedResult: 'Converted Result',
    scientificNotation: 'Scientific Notation',
    conversionFormula: 'Direct Conversion Factor',
    matrixTitle: 'Full Category Conversion Matrix',
    unitCol: 'Unit',
    symbolCol: 'Symbol',
    standardValCol: 'Standard Value',
    sciValCol: 'Scientific Form (Exponential)',
    catPressure: 'Pressure (Pa, Bar, PSI, atm)',
    catEnergy: 'Energy & Work (Joules, kWh, BTU, Cal)',
    catPower: 'Power (Watts, kW, HP, BTU/h)',
    catData: 'Data & Bandwidth (Bytes, MB, GiB, Bits)',
    catForce: 'Force & Mechanics (Newtons, kN, lbf, dyn)',
    catTemperature: 'Temperature (Celsius, °F, Kelvin, °R)',
    catDensity: 'Density (kg/m³, g/cm³, lb/ft³)',
    quickPreset1: 'Standard Atmosphere (1 atm)',
    quickPreset2: '1 Kilowatt-Hour to Joules',
    quickPreset3: '1 Gigabyte to Mebibytes (GiB)',
    faqTitle: 'Frequently Asked Questions: Scientific Unit Conversion',
    q1: 'Why does 1 GiB (Gibibyte) differ from 1 GB (Gigabyte)?',
    a1: 'Data storage uses two standards: decimal (SI prefix where 1 GB = 1,000,000,000 Bytes) used by drive manufacturers, and binary (IEC prefix where 1 GiB = 1,073,741,824 Bytes = 2^30 Bytes) used by computer operating systems like Windows and Linux.',
    q2: 'How accurate is this scientific conversion engine?',
    a2: 'Our calculation engine uses Decimal.js arbitrary-precision arithmetic to avoid floating-point rounding errors (such as 0.1 + 0.2 = 0.30000000000000004), preserving up to 20 significant digits.',
    q3: 'What is the absolute zero temperature in different scales?',
    a3: 'Absolute zero is 0 Kelvin (0 K), which equals -273.15 °C, -459.67 °F, and 0 °R (Rankine).',
  },
  he: {
    title: 'מחשבון המרת מידות הנדסיות ומדעיות',
    subtitle: 'מנוע המרה בדיוק גבוה לפיזיקה, תרמודינמיקה, חשמל ומדעי המחשב',
    description: 'מחשבון המרת יחידות מדעיות והנדסיות מתקדם: לחץ (Pa, Bar, PSI, אטמוספירה), אנרגיה ועבודה (ג\'אול, קוט"ש, BTU, קלוריות), הספק, אחסון נתונים, כוח ותרמודינמיקה בדיוק מתמטי מוחלט.',
    selectCategory: 'תחום מדעי / קטגוריה',
    fromUnit: 'מיחידה',
    toUnit: 'ליחידה',
    enterValue: 'ערך להמרה',
    convertedResult: 'תוצאה מומרת',
    scientificNotation: 'כתיב מדעי (חזקות)',
    conversionFormula: 'נוסחת ויחס המרה ישיר',
    matrixTitle: 'מטריצת המרה מלאה לכל היחידות בקטגוריה',
    unitCol: 'יחידה',
    symbolCol: 'סימול',
    standardValCol: 'ערך עשרוני',
    sciValCol: 'כתיב מדעי (E)',
    catPressure: 'לחץ (פסקל, בר, PSI, אטמוספירה)',
    catEnergy: 'אנרגיה ועבודה (ג\'אול, קוט"ש, BTU, קלוריות)',
    catPower: 'הספק (ואט, קילוואט, כוח סוס HP)',
    catData: 'נתונים ואחסון (בייטים, MB, GiB, ביטים)',
    catForce: 'כוח ומכניקה (ניוטון, kN, lbf, דיין)',
    catTemperature: 'טמפרטורה (צלזיוס, פרנהייט, קלווין)',
    catDensity: 'צפיפות חומר (ק"ג/מ"ק, גרם/סמ"ק)',
    quickPreset1: 'לחץ אטמוספרי (1 atm)',
    quickPreset2: 'קוט"ש אחד לג\'אול (1 kWh)',
    quickPreset3: '1 ג\'יגה-בייט ל-GiB בינארי',
    faqTitle: 'שאלות ותשובות על המרות מדעיות והנדסיות',
    q1: 'מה ההבדל בין GB (ג\'יגה-בייט) לבין GiB (גיבי-בייט)?',
    a1: 'GB מתבסס על בסיס 10 עשרוני (1,000,000,000 בייטים - נפוץ ביצרני כוננים), בעוד GiB מתבסס על בסיס 2 בינארי (2 בחזקת 30 = 1,073,741,824 בייטים - שפת מערכות ההפעלה).',
    q2: 'מה רמת הדיוק של מנוע ההמרה המדעי באתר?',
    a2: 'המנוע משתמש בספריית Decimal.js לדיוק שרירותי המונע שגיאות עיגול בינאריות אופייניות ל-JavaScript ומספק דיוק עד רמת 20 ספרות משמעותיות.',
    q3: 'מהו האפס המוחלט בסולמות הטמפרטורה השונים?',
    a3: 'האפס המוחלט הוא 0 קלווין (0 K), השווה ל-273.15- מעלות צלזיוס, 459.67- מעלות פרנהייט ו-0 מעלות רנקין.',
  },
  es: {
    title: 'Convertidor de Unidades Científicas e Ingeniería',
    subtitle: 'Conversor de alta precisión para física, termodinámica y computación',
    description: 'Convierte unidades complejas de ingeniería: Presión (Bar, PSI, Pa), Energía (Joules, kWh, BTU), Potencia, Datos y Fuerza con precisión absoluta.',
    selectCategory: 'Categoría Científica',
    fromUnit: 'De',
    toUnit: 'A',
    enterValue: 'Valor de Entrada',
    convertedResult: 'Resultado',
    scientificNotation: 'Notación Científica',
    conversionFormula: 'Fórmula Directa',
    matrixTitle: 'Matriz de Conversión Completa',
    unitCol: 'Unidad',
    symbolCol: 'Símbolo',
    standardValCol: 'Valor Estándar',
    sciValCol: 'Notación Científica',
    catPressure: 'Presión (Pa, Bar, PSI, atm)',
    catEnergy: 'Energía y Trabajo (Joules, kWh, BTU)',
    catPower: 'Potencia (Watts, kW, HP)',
    catData: 'Almacenamiento (Bytes, MB, GiB, Bits)',
    catForce: 'Fuerza (Newtons, kN, lbf)',
    catTemperature: 'Temperatura (°C, °F, Kelvin)',
    catDensity: 'Densidad (kg/m³, g/cm³)',
    quickPreset1: 'Atmósfera Estándar (1 atm)',
    quickPreset2: '1 kWh a Joules',
    quickPreset3: '1 GB a Gibibytes (GiB)',
    faqTitle: 'Preguntas Frecuentes sobre Conversión Científica',
    q1: '¿Por qué 1 GiB es diferente a 1 GB?',
    a1: 'GB utiliza base decimal (10^9) mientras que GiB utiliza base binaria (2^30 = 1,073,741,824 bytes).',
    q2: '¿Qué precisión ofrece este calculador?',
    a2: 'Utiliza aritmética de precisión arbitraria para eliminar errores de redondeo.',
    q3: '¿Cuál es el cero absoluto?',
    a3: 'El cero absoluto es 0 K, equivalente a -273.15 °C o -459.67 °F.',
  },
  fr: {
    title: 'Convertisseur d\'Unités Scientifiques et d\'Ingénierie',
    subtitle: 'Moteur de conversion haute précision pour la physique et la thermodynamique',
    description: 'Convertissez les unités complexes : Pression (Pa, Bar, PSI), Énergie (Joules, kWh, BTU), Puissance, Données et Température avec une précision décimale maximale.',
    selectCategory: 'Domaine Scientifique',
    fromUnit: 'De',
    toUnit: 'Vers',
    enterValue: 'Valeur à Convertir',
    convertedResult: 'Résultat Converti',
    scientificNotation: 'Notation Scientifique',
    conversionFormula: 'Facteur de Conversion',
    matrixTitle: 'Tableau de Conversion Intégral',
    unitCol: 'Unité',
    symbolCol: 'Symbole',
    standardValCol: 'Valeur Décimale',
    sciValCol: 'Forme Exponentielle',
    catPressure: 'Pression (Pa, Bar, PSI, atm)',
    catEnergy: 'Énergie et Travail (Joules, kWh, BTU)',
    catPower: 'Puissance (Watts, kW, Ch)',
    catData: 'Données (Octets, Mo, Gio, Bits)',
    catForce: 'Force (Newtons, kN, lbf)',
    catTemperature: 'Température (°C, °F, Kelvin)',
    catDensity: 'Masse Volumique (kg/m³, g/cm³)',
    quickPreset1: 'Pression Atmosphérique (1 atm)',
    quickPreset2: '1 kWh en Joules',
    quickPreset3: '1 Go en Gibioctets (Gio)',
    faqTitle: 'Questions Fréquentes sur les Unités Scientifiques',
    q1: 'Pourquoi 1 Gio diffère-t-il de 1 Go ?',
    a1: 'Le Go est décimal (10^9 octets) alors que le Gio est binaire (2^30 octets).',
    q2: 'Quelle est la précision du calcul ?',
    a2: 'Le moteur utilise une bibliothèque à précision arbitraire pour éliminer les erreurs d\'arrondi.',
    q3: 'Qu\'est-ce que le zéro absolu ?',
    a3: 'Le zéro absolu correspond à 0 Kelvin (-273,15 °C).',
  },
  ar: {
    title: 'محول الوحدات العلمية والهندسية الدقيق',
    subtitle: 'محرك تحويل فائق الدقة للفيزياء، الديناميكا الحرارية وعلوم الحاسوب',
    description: 'تحويل وحدات القياس الهندسية والعلمية المعقدة: الضغط (باسكال، بار، PSI)، الطاقة (جول، كيلوواط ساعي)، القدرة، تخزين البيانات، والحرارة بأعلى دقة حسابية.',
    selectCategory: 'المجال العلمي',
    fromUnit: 'من وحدة',
    toUnit: 'إلى وحدة',
    enterValue: 'القيمة المدخلة',
    convertedResult: 'النتيجة المحولة',
    scientificNotation: 'الترميز العلمي',
    conversionFormula: 'معادلة التحويل المباشرة',
    matrixTitle: 'مصفوفة التحويل الشاملة لجميع الوحدات',
    unitCol: 'الوحدة',
    symbolCol: 'الرمز',
    standardValCol: 'القيمة القياسية',
    sciValCol: 'الصيغة الأسية',
    catPressure: 'الضغط (باسكال، بار، PSI، ضغط جوي)',
    catEnergy: 'الطاقة والعمل (جول، ك.و.س، BTU، سعرة)',
    catPower: 'القدرة (واط، كيلوواط، حصان ميكانيكي)',
    catData: 'البيانات والتخزين (بايت، ميجابايت، جيبي بايت)',
    catForce: 'القوة والميكانيكا (نيوتن، كيلو نيوتن، باوند قوة)',
    catTemperature: 'درجة الحرارة (سيليزيوس، فهرنهايت، كلفن)',
    catDensity: 'الكثافة (كغ/م³، غ/سم³)',
    quickPreset1: 'الضغط الجوي القياسي (1 atm)',
    quickPreset2: '1 كيلوواط ساعي إلى جول',
    quickPreset3: '1 جيجابايت إلى جيبي بايت (GiB)',
    faqTitle: 'الأسئلة الشائعة حول التحويلات العلمية',
    q1: 'ما الفرق بين GB و GiB؟',
    a1: 'GB يعتمد النظام العشري (10^9 بايت) بينما GiB يعتمد النظام الثنائي (2^30 بايت).',
    q2: 'ما مدى دقة الحسابات؟',
    a2: 'يستخدم المحرك دقة حسابية غير محدودة لتفادي أخطاء التقريب الرقمي.',
    q3: 'ما هو الصفر المطلق؟',
    a3: 'الصفر المطلق هو 0 كلفن وهو يعادل -273.15 درجة مئوية.',
  },
  ru: {
    title: 'Инженерный и научный конвертер величин',
    subtitle: 'Высокоточный конвертер для физики, термодинамики и компьютерных наук',
    description: 'Конвертируйте сложные физические и инженерные величины: Давление (Па, Бар, PSI), Энергия (Джоули, кВт⋅ч, BTU), Мощность, Память и Температура.',
    selectCategory: 'Научный раздел',
    fromUnit: 'Из единицы',
    toUnit: 'В единицу',
    enterValue: 'Исходное значение',
    convertedResult: 'Результат',
    scientificNotation: 'Экспоненциальная запись',
    conversionFormula: 'Коэффициент пересчета',
    matrixTitle: 'Полная матрица перевода всех величин',
    unitCol: 'Единица',
    symbolCol: 'Символ',
    standardValCol: 'Числовое значение',
    sciValCol: 'Экспоненциальная форма',
    catPressure: 'Давление (Па, Бар, PSI, атм)',
    catEnergy: 'Энергия и работа (Джоули, кВт⋅ч, кал, BTU)',
    catPower: 'Мощность (Ватты, кВт, л.с.)',
    catData: 'Данные и память (Байты, МБ, ГиБ, Биты)',
    catForce: 'Сила (Ньютоны, кН, кгс)',
    catTemperature: 'Температура (°C, °F, Кельвин, °R)',
    catDensity: 'Плотность (кг/м³, г/см³)',
    quickPreset1: 'Стандартная атмосфера (1 атм)',
    quickPreset2: '1 кВт⋅ч в Джоули',
    quickPreset3: '1 ГБ в Гибибайты (GiB)',
    faqTitle: 'Частые вопросы о научных преобразованиях',
    q1: 'Чем отличается 1 ГБ от 1 ГиБ?',
    a1: 'ГБ основан на десятичной системе (10^9 байт), а ГиБ — на двоичной (2^30 = 1 073 741 824 байт).',
    q2: 'Какова точность расчетов?',
    a2: 'Движок использует арифметику произвольной точности Decimal.js без потерь в округлении.',
    q3: 'Что такое абсолютный ноль?',
    a3: 'Абсолютный ноль равен 0 Кельвинов (-273,15 °C).',
  },
};

export default function ScientificUnitEngine() {
  const { lang } = useI18n();
  const d = localDict[lang as keyof typeof localDict] || localDict.en;

  const [category, setCategory] = useUrlState<UnitCategory>('cat', 'pressure');
  const [inputValue, setInputValue] = useUrlState('val', 1);
  const [fromUnitId, setFromUnitId] = useUrlState('from', 'bar');
  const [toUnitId, setToUnitId] = useUrlState('to', 'psi');

  const currentCategoryConfig = useMemo(() => {
    return SCIENTIFIC_CATEGORIES.find((c) => c.id === category) || SCIENTIFIC_CATEGORIES[0];
  }, [category]);

  // Ensure selected units belong to current category
  const validFromUnitId = useMemo(() => {
    const exists = currentCategoryConfig.units.some((u) => u.id === fromUnitId);
    return exists ? fromUnitId : currentCategoryConfig.units[0].id;
  }, [currentCategoryConfig, fromUnitId]);

  const validToUnitId = useMemo(() => {
    const exists = currentCategoryConfig.units.some((u) => u.id === toUnitId);
    return exists ? toUnitId : (currentCategoryConfig.units[1]?.id || currentCategoryConfig.units[0].id);
  }, [currentCategoryConfig, toUnitId]);

  const conversion = useMemo(() => {
    return convertScientificUnit(category, validFromUnitId, validToUnitId, inputValue);
  }, [category, validFromUnitId, validToUnitId, inputValue]);

  const handleCategoryChange = (newCat: UnitCategory) => {
    setCategory(newCat);
    const catConf = SCIENTIFIC_CATEGORIES.find((c) => c.id === newCat) || SCIENTIFIC_CATEGORIES[0];
    setFromUnitId(catConf.units[0].id);
    setToUnitId(catConf.units[1]?.id || catConf.units[0].id);
  };

  const handleSwapUnits = () => {
    const prevFrom = validFromUnitId;
    const prevTo = validToUnitId;
    setFromUnitId(prevTo);
    setToUnitId(prevFrom);
  };

  const categoryIcons: Record<UnitCategory, React.ReactNode> = {
    pressure: <Gauge className="w-4 h-4" />,
    energy: <Zap className="w-4 h-4" />,
    power: <Atom className="w-4 h-4" />,
    data: <HardDrive className="w-4 h-4" />,
    force: <Compass className="w-4 h-4" />,
    temperature: <Thermometer className="w-4 h-4" />,
    density: <Binary className="w-4 h-4" />,
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fadeIn">
      <SEO
        title={d.title}
        description={d.description}
        canonicalUrl="/calculators/scientific-unit-engine"
      />

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
          <Atom className="w-4 h-4" />
          <span>{d.title}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
          {d.title}
        </h1>
        <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl mx-auto">
          {d.subtitle}
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-surface-container-low border border-border-subtle">
        {SCIENTIFIC_CATEGORIES.map((cat) => {
          const isSelected = cat.id === category;
          const label = d[cat.nameKey as keyof typeof d] || cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              {categoryIcons[cat.id]}
              <span>{label.split('(')[0].trim()}</span>
            </button>
          );
        })}
      </div>

      {/* Main Conversion Panel */}
      <div className="p-6 rounded-3xl bg-surface-container-lowest border border-border-subtle shadow-xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
          {/* Input Value & From Unit */}
          <div className="md:col-span-3 space-y-2">
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              {d.fromUnit}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(Number(e.target.value))}
                className="w-1/2 px-4 py-3 rounded-2xl bg-surface-container-low border border-border-subtle text-on-surface text-lg font-extrabold focus:outline-none focus:border-primary"
              />
              <select
                value={validFromUnitId}
                onChange={(e) => setFromUnitId(e.target.value)}
                className="w-1/2 px-3 py-3 rounded-2xl bg-surface-container-low border border-border-subtle text-on-surface text-sm font-bold focus:outline-none focus:border-primary cursor-pointer"
              >
                {currentCategoryConfig.units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.symbol} ({u.nameKey})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center pt-4 md:pt-0">
            <button
              onClick={handleSwapUnits}
              title="Swap Units"
              className="p-3 rounded-2xl bg-surface-container hover:bg-surface-container-high border border-border-subtle text-primary transition-all active:scale-95 cursor-pointer"
            >
              <ArrowRightLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Target Unit & Result */}
          <div className="md:col-span-3 space-y-2">
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              {d.toUnit}
            </label>
            <div className="flex items-center gap-2">
              <div className="w-1/2 px-4 py-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary text-lg font-black truncate flex items-center justify-between">
                <span className="truncate">{conversion.resultValue}</span>
                <CopyButton textToCopy={conversion.resultValue} />
              </div>
              <select
                value={validToUnitId}
                onChange={(e) => setToUnitId(e.target.value)}
                className="w-1/2 px-3 py-3 rounded-2xl bg-surface-container-low border border-border-subtle text-on-surface text-sm font-bold focus:outline-none focus:border-primary cursor-pointer"
              >
                {currentCategoryConfig.units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.symbol} ({u.nameKey})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Formula & Scientific Form Ribbon */}
        <div className="p-4 rounded-2xl bg-surface-container-low border border-border-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-mono text-on-surface">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="font-bold text-on-surface-variant">{d.conversionFormula}:</span>
            <span className="px-2 py-0.5 rounded-md bg-surface border border-border-subtle">{conversion.formulaDescription}</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-on-surface">
            <span className="font-bold text-on-surface-variant">{d.scientificNotation}:</span>
            <span className="px-2 py-0.5 rounded-md bg-surface border border-border-subtle font-bold text-primary">{conversion.scientificResult}</span>
          </div>
        </div>
      </div>

      {/* Multi-Unit Conversion Matrix Table */}
      <div className="p-6 rounded-3xl bg-surface-container-lowest border border-border-subtle space-y-4 shadow-xs">
        <h3 className="text-base font-extrabold text-on-surface flex items-center gap-2">
          <Binary className="w-5 h-5 text-primary" />
          <span>{d.matrixTitle}</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-on-surface-variant font-bold">
                <th className="pb-3 px-3">{d.unitCol}</th>
                <th className="pb-3 px-3">{d.symbolCol}</th>
                <th className="pb-3 px-3">{d.standardValCol}</th>
                <th className="pb-3 px-3">{d.sciValCol}</th>
                <th className="pb-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/50">
              {conversion.matrix.map((item) => {
                const isSelected = item.unitId === validToUnitId;
                return (
                  <tr
                    key={item.unitId}
                    className={`hover:bg-surface-container-low transition-colors ${
                      isSelected ? 'bg-primary/5 font-bold' : ''
                    }`}
                  >
                    <td className="py-3 px-3 font-semibold text-on-surface">{item.nameKey}</td>
                    <td className="py-3 px-3 font-mono text-primary">{item.unitSymbol}</td>
                    <td className="py-3 px-3 font-mono text-on-surface max-w-xs truncate">{item.value}</td>
                    <td className="py-3 px-3 font-mono text-on-surface-variant">{item.scientificNotation}</td>
                    <td className="py-3 px-3 text-right">
                      <CopyButton textToCopy={item.value} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Accordion */}
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
