import React, { useState, useMemo } from 'react';
import { useUrlState } from '../../hooks/useUrlState';
import { useI18n } from '../../contexts/i18n';
import SEO from '../../components/SEO';
import ShinyText from '../../components/ShinyText';
import { convertNumberBase } from '../../lib/math/algebraCs';
import { trackCalculation } from '../../lib/analytics';
import {
  Binary,
  HelpCircle,
  Copy,
  Check,
  Sparkles,
  ArrowRightLeft
} from 'lucide-react';

const localDict = {
  en: {
    title: 'Binary, Hex, Octal & Base Converter',
    subtitle: 'Convert between Binary (2), Octal (8), Decimal (10), Hex (16) & Custom Radix (2-36)',
    description: 'Free number system converter. Easily convert between Binary, Hexadecimal, Octal, and Decimal integers with bit length representations and step-by-step conversion.',
    inputLabel: 'Source Number Value',
    inputPlaceholder: 'Enter number e.g. 255 or 11111111',
    fromBaseLabel: 'Source Base (Radix)',
    targetBaseLabel: 'Custom Target Base (2 to 36)',
    binCard: 'Binary (Base 2)',
    octCard: 'Octal (Base 8)',
    decCard: 'Decimal (Base 10)',
    hexCard: 'Hexadecimal (Base 16)',
    customCard: 'Custom Radix (Base {base})',
    copySuccess: 'Copied!',
    bitsLabel: 'Bit representation',
    stepsTitle: 'Base Conversion Steps',
    invalidInput: 'Invalid number for the selected base.',
    faqTitle: 'Frequently Asked Questions: Number Systems & Bases',
    q1: 'How do you convert Hexadecimal to Binary?',
    a1: 'Each Hexadecimal digit converts directly to 4 binary bits (nibble). For example, 0x2F = 0010 (2) and 1111 (F) = 00101111.',
    q2: 'Why is Hexadecimal used in programming and memory?',
    a2: 'Hexadecimal provides a concise, human-readable way to represent binary bytes. Two hex digits represent one 8-bit byte (0x00 to 0xFF).',
    q3: 'What is the maximum radix supported?',
    a3: 'Standard computer alphanumeric systems support up to Base 36 using digits 0-9 and letters A-Z.'
  },
  he: {
    title: 'ממיר בסיסים: בינארי, הקסדצימלי, אוקטלי ועשרוני',
    subtitle: 'המרת מספרים מהירה בין בסיס 2, 8, 10, 16 וכל בסיס מותאם אישית (2-36)',
    description: 'מחשבון המרת בסיסי ספירה: המרה בין בינארי, הקסה, אוקטלי ועשרוני עם ייצוג סיביות (Bits) ושלבי המרה מפורטים.',
    inputLabel: 'הזן ערך להמרה',
    inputPlaceholder: 'לדוגמה 255 או 11111111',
    fromBaseLabel: 'בסיס המקור (Radix)',
    targetBaseLabel: 'בסיס יעד מותאם (2 עד 36)',
    binCard: 'בינארי (בסיס 2)',
    octCard: 'אוקטלי (בסיס 8)',
    decCard: 'עשרוני (בסיס 10)',
    hexCard: 'הקסדצימלי (בסיס 16)',
    customCard: 'בסיס מותאם אישית (בסיס {base})',
    copySuccess: 'הועתק!',
    bitsLabel: 'ייצוג סיביות',
    stepsTitle: 'שלבי ההמרה והחישוב',
    invalidInput: 'המספר אינו תקין עבור הבסיס שנבחר.',
    faqTitle: 'שאלות ותשובות נפוצות: בסיסי ספירה ומחשבים',
    q1: 'איך ממירים מהקסדצימלי (Hex) לבינארי?',
    a1: 'כל ספרה הקסדצימלית מתורגמת ישירות ל-4 סיביות (Nibble). למשל 2F הופך ל-0010 (עבור 2) ו-1111 (עבור F).',
    q2: 'מדוע משתמשים בבסיס הקסדצימלי במדעי המחשב?',
    a2: 'משום שהוא קומפקטי וקריא: כל בית (Byte) בזיכרון מיוצג בדיוק על ידי שתי ספרות הקס (בין 00 ל-FF).',
    q3: 'עד איזה בסיס ניתן להמיר?',
    a3: 'המערכת תומכת בכל בסיס מ-2 ועד 36 תוך שימוש בספרות 0-9 והאותיות A-Z.'
  },
  es: {
    title: 'Conversor de Bases Numéricas (Binario, Hex, Octal, Decimal)',
    subtitle: 'Conversión entre Bases 2, 8, 10, 16 y Base Personalizada (2-36)',
    description: 'Convierte números enteros entre binario, hexadecimal, decimal y octal con desglose paso a paso.',
    inputLabel: 'Número de Entrada',
    inputPlaceholder: 'Ej. 255 o FF',
    fromBaseLabel: 'Base de Origen',
    targetBaseLabel: 'Base de Destino',
    binCard: 'Binario (Base 2)',
    octCard: 'Octal (Base 8)',
    decCard: 'Decimal (Base 10)',
    hexCard: 'Hexadecimal (Base 16)',
    customCard: 'Base Personalizada ({base})',
    copySuccess: '¡Copiado!',
    bitsLabel: 'Representación en bits',
    stepsTitle: 'Pasos de Conversión',
    invalidInput: 'Número no válido para la base seleccionada.',
    faqTitle: 'Preguntas Frecuentes',
    q1: '¿Cómo convertir Hex a Binario?',
    a1: 'Cada dígito hexadecimal equivale a 4 bits binarios.',
    q2: '¿Por qué usar Hexadecimal?',
    a2: 'Permite leer bytes de memoria de forma compacta (0x00 a 0xFF).',
    q3: '¿Bases soportadas?',
    a3: 'De base 2 a base 36.'
  },
  fr: {
    title: 'Convertisseur de Bases (Binaire, Hexadécimal, Octal, Décimal)',
    subtitle: 'Conversion Rapide entre Base 2, 8, 10, 16 et Base Personnalisée',
    description: 'Convertissez instantanément vos nombres entre binaire, hexadécimal, octal et décimal avec affichage par blocs de bits.',
    inputLabel: 'Nombre source',
    inputPlaceholder: 'Ex : 255 ou 1010',
    fromBaseLabel: 'Base d’origine',
    targetBaseLabel: 'Base cible',
    binCard: 'Binaire (Base 2)',
    octCard: 'Octal (Base 8)',
    decCard: 'Décimal (Base 10)',
    hexCard: 'Hexadécimal (Base 16)',
    customCard: 'Base personnalisée ({base})',
    copySuccess: 'Copié !',
    bitsLabel: 'Représentation en bits',
    stepsTitle: 'Étapes de calcul',
    invalidInput: 'Valeur invalide pour cette base.',
    faqTitle: 'Questions Fréquentes',
    q1: 'Comment convertir de l’Hex en binaire ?',
    a1: 'Chaque chiffre hexadécimal correspond à 4 bits binaires.',
    q2: 'Pourquoi le format hexadécimal ?',
    a2: 'Chaque octet de mémoire est représenté par exactement 2 caractères hex.',
    q3: 'Quelles bases sont gérées ?',
    a3: 'Toutes les bases de 2 à 36.'
  },
  ar: {
    title: 'محول أنظمة العد (ثنائي، سداسي عشر، ثماني، عشري)',
    subtitle: 'تحويل بين النظام الثنائي، العشري، السداسي عشري وأي أساس من 2 إلى 36',
    description: 'حاسبة تحويل أنظمة العد البرمجية بين Binary, Hex, Octal, Decimal مع تمثيل البتات وخطوات التحويل.',
    inputLabel: 'الرقم المدخل',
    inputPlaceholder: 'مثال: 255 أو 11111111',
    fromBaseLabel: 'نظام العد المصدر',
    targetBaseLabel: 'نظام العد الهدف',
    binCard: 'النظام الثنائي (أساس 2)',
    octCard: 'النظام الثماني (أساس 8)',
    decCard: 'النظام العشري (أساس 10)',
    hexCard: 'النظام السداسي عشري (أساس 16)',
    customCard: 'نظام مخصص (أساس {base})',
    copySuccess: 'تم النسخ!',
    bitsLabel: 'تمثيل البتات',
    stepsTitle: 'خطوات التحويل الرياضية',
    invalidInput: 'الرقم المدخل غير صالح للأساس المحدد.',
    faqTitle: 'الأسئلة الشائعة حول أنظمة العد',
    q1: 'كيف يتم تحويل السداسي عشري إلى ثنائي؟',
    a1: 'كل خانة سداسية عشرية تقابل 4 خانات ثنائية (Bits).',
    q2: 'لماذا يستخدم النظام السداسي عشري؟',
    a2: 'لأنه يمثل البايت في الذاكرة بحرفين فقط بدقة وسهولة قراءة.',
    q3: 'ما هي الأنظمة المدعومة؟',
    a3: 'جميع الأنظمة من الأساس 2 إلى 36.'
  }
};

const BASE_OPTIONS = [
  { label: 'Binary (Base 2)', value: 2 },
  { label: 'Octal (Base 8)', value: 8 },
  { label: 'Decimal (Base 10)', value: 10 },
  { label: 'Hexadecimal (Base 16)', value: 16 }
];

export default function BaseConverter() {
  const { lang } = useI18n();
  const dict = localDict[lang as keyof typeof localDict] || localDict.en;

  const [inputVal, setInputVal] = useUrlState<string>('val', '255');
  const [fromBase, setFromBase] = useUrlState<number>('from', 10);
  const [customBase, setCustomBase] = useUrlState<number>('to', 36);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const conversion = useMemo(() => {
    return convertNumberBase(inputVal, Number(fromBase) || 10, Number(customBase) || 36);
  }, [inputVal, fromBase, customBase]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
    trackCalculation('base_converter_copy', { key });
  };

  // Group binary in nibbles (4-bit chunks)
  const formatBinary = (bin: string) => {
    const padded = bin.length % 4 === 0 ? bin : bin.padStart(bin.length + (4 - (bin.length % 4)), '0');
    return padded.match(/.{1,4}/g)?.join(' ') || bin;
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8" dir={lang === 'he' || lang === 'ar' ? 'rtl' : 'ltr'}>
      <SEO
        title={dict.title}
        description={dict.description}
        canonicalUrl={`/${lang}/calculators/base-converter`}
      />

      {/* Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100 shadow-xs">
              <Binary className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                {dict.title}
              </h1>
              <p className="text-stone-500 font-medium text-sm mt-0.5">
                {dict.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              {dict.inputLabel}
            </label>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full h-12 px-4 bg-stone-50 border border-stone-200 rounded-xl font-bold font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white text-base uppercase"
              placeholder={dict.inputPlaceholder}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              {dict.fromBaseLabel}
            </label>
            <select
              value={fromBase}
              onChange={(e) => setFromBase(Number(e.target.value))}
              className="w-full h-12 px-4 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white text-base"
            >
              {BASE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              {dict.targetBaseLabel}
            </label>
            <input
              type="number"
              min="2"
              max="36"
              value={customBase}
              onChange={(e) => setCustomBase(Math.min(36, Math.max(2, Number(e.target.value))))}
              className="w-full h-12 px-4 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white text-base"
            />
          </div>
        </div>
      </div>

      {/* Conversion Cards */}
      {conversion ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Decimal */}
          <div className="bg-teal-900 text-white p-6 rounded-3xl shadow-sm flex flex-col justify-between border border-teal-800">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-200">
                {dict.decCard}
              </span>
              <button
                onClick={() => handleCopy(conversion.decimal.toString(), 'dec')}
                className="text-teal-300 hover:text-white transition-colors"
                title="Copy"
              >
                {copiedKey === 'dec' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="my-3">
              <span className="text-3xl font-black font-mono tracking-tight text-white break-words">
                {conversion.decimal}
              </span>
            </div>
            <span className="text-xs text-teal-300 font-medium">
              Standard Base 10 Integer
            </span>
          </div>

          {/* Hexadecimal */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                {dict.hexCard}
              </span>
              <button
                onClick={() => handleCopy(`0x${conversion.hexadecimal}`, 'hex')}
                className="text-stone-400 hover:text-stone-700 transition-colors"
                title="Copy"
              >
                {copiedKey === 'hex' ? <Check className="w-4 h-4 text-teal-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="my-3">
              <span className="text-3xl font-black font-mono tracking-tight text-teal-700 break-words">
                0x{conversion.hexadecimal}
              </span>
            </div>
            <span className="text-xs text-stone-400 font-medium">
              Byte-aligned memory hex
            </span>
          </div>

          {/* Octal */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                {dict.octCard}
              </span>
              <button
                onClick={() => handleCopy(conversion.octal, 'oct')}
                className="text-stone-400 hover:text-stone-700 transition-colors"
                title="Copy"
              >
                {copiedKey === 'oct' ? <Check className="w-4 h-4 text-teal-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="my-3">
              <span className="text-3xl font-black font-mono tracking-tight text-stone-900 break-words">
                0o{conversion.octal}
              </span>
            </div>
            <span className="text-xs text-stone-400 font-medium">
              Base 8 Octal representation
            </span>
          </div>

          {/* Custom Base */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                {dict.customCard.replace('{base}', customBase.toString())}
              </span>
              <button
                onClick={() => handleCopy(conversion.customBaseValue || '', 'custom')}
                className="text-stone-400 hover:text-stone-700 transition-colors"
                title="Copy"
              >
                {copiedKey === 'custom' ? <Check className="w-4 h-4 text-teal-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="my-3">
              <span className="text-3xl font-black font-mono tracking-tight text-stone-800 break-words">
                {conversion.customBaseValue}
              </span>
            </div>
            <span className="text-xs text-stone-400 font-medium">
              Radix {customBase} (0-9, A-Z)
            </span>
          </div>
        </div>
      ) : (
        <div className="p-8 bg-red-50 text-red-800 rounded-2xl border border-red-200 font-bold text-center">
          {dict.invalidInput}
        </div>
      )}

      {/* Binary Nibble Breakdown & Steps */}
      {conversion && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-600" />
                <h2 className="text-lg font-bold text-stone-900">{dict.binCard}</h2>
              </div>
              <button
                onClick={() => handleCopy(conversion.binary, 'bin')}
                className="flex items-center gap-1 text-xs font-bold bg-teal-50 text-teal-700 px-3 py-1 rounded-full border border-teal-100"
              >
                {copiedKey === 'bin' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === 'bin' ? dict.copySuccess : 'Copy Binary'}
              </button>
            </div>

            <div className="p-4 bg-stone-900 text-teal-400 font-mono text-lg sm:text-2xl rounded-2xl tracking-widest break-all">
              {formatBinary(conversion.binary)}
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-stone-500">
              <span className="bg-stone-100 px-2.5 py-1 rounded-lg">Length: {conversion.binary.length} bits</span>
              <span className="bg-stone-100 px-2.5 py-1 rounded-lg">Bytes: {Math.ceil(conversion.binary.length / 8)} B</span>
              <span className="bg-stone-100 px-2.5 py-1 rounded-lg">High bit (MSB): {conversion.binary[0]}</span>
            </div>
          </div>

          {/* Steps */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ArrowRightLeft className="w-5 h-5 text-teal-600" />
                <h2 className="text-base font-bold text-stone-900">{dict.stepsTitle}</h2>
              </div>

              <div className="space-y-2 text-xs font-medium text-stone-600">
                {conversion.steps.map((st, idx) => (
                  <div key={idx} className="bg-stone-50 p-2 rounded-lg font-mono text-stone-800">
                    {st}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 text-center">
              <span className="text-xs text-stone-400 font-medium">
                <ShinyText text="Positional Numeral Conversion" />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SEO FAQs */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200">
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="w-6 h-6 text-teal-600" />
          <h2 className="text-xl font-extrabold text-stone-900">{dict.faqTitle}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200/80">
            <h3 className="text-sm font-bold text-stone-900 mb-2">{dict.q1}</h3>
            <p className="text-xs text-stone-600 leading-relaxed">{dict.a1}</p>
          </div>
          <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200/80">
            <h3 className="text-sm font-bold text-stone-900 mb-2">{dict.q2}</h3>
            <p className="text-xs text-stone-600 leading-relaxed">{dict.a2}</p>
          </div>
          <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200/80">
            <h3 className="text-sm font-bold text-stone-900 mb-2">{dict.q3}</h3>
            <p className="text-xs text-stone-600 leading-relaxed">{dict.a3}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
