import React, { useMemo } from 'react';
import { useUrlState } from '../../hooks/useUrlState';
import { useI18n } from '../../contexts/i18n';
import SEO from '../../components/SEO';
import { calculateBitwise } from '../../lib/math/algebraCs';
import { trackCalculation } from '../../lib/analytics';
import {
  Cpu,
  HelpCircle,
  Sparkles
} from 'lucide-react';

const localDict = {
  en: {
    title: 'Bitwise Calculator & Binary Logic Operators',
    subtitle: 'Evaluate AND, OR, XOR, NOT, Bit Shifts & Binary Truth Tables',
    description: 'Free online bitwise calculator. Perform AND (&), OR (|), XOR (^), NOT (~), Left Shift (<<), and Right Shift (>>) on 8-bit, 16-bit, or 32-bit integers with binary visualizer.',
    operandA: 'Operand A (Integer)',
    operandB: 'Operand B (Integer)',
    bitWidthLabel: 'Bit Width Representation',
    andCard: 'Bitwise AND (&)',
    orCard: 'Bitwise OR (|)',
    xorCard: 'Bitwise XOR (^)',
    notACard: 'Bitwise NOT A (~A)',
    shiftLCard: 'Left Shift A (A << 1)',
    shiftRCard: 'Right Shift A (A >> 1)',
    truthTableTitle: 'Logic Truth Table & Bit Breakdown',
    faqTitle: 'Frequently Asked Questions: Bitwise Operations',
    q1: 'What is the XOR operator used for?',
    a1: 'XOR returns 1 only when the inputs differ. It is widely used in hashing, cryptographic ciphers, parity checks, and fast value toggling.',
    q2: 'What does a bit shift do mathematically?',
    a2: 'A left shift by 1 (A << 1) multiplies an integer by 2. A right shift by 1 (A >> 1) divides an integer by 2 (integer floor division).',
    q3: 'What is two’s complement?',
    a3: 'Two’s complement is the mathematical operation used by computers to represent signed negative integers in binary.'
  },
  he: {
    title: 'מחשבון פעולות סיביות (Bitwise) ולוגיקה בינארית',
    subtitle: 'חישוב AND, OR, XOR, NOT, הזזת סיביות (Shifts) וטבלת אמת',
    description: 'מחשבון פעולות סיביות אונליין: חישוב שערים לוגיים AND, OR, XOR, היפוך NOT והזזות סיביות ברוחב 8, 16 או 32 ביט.',
    operandA: 'אופרנד א׳ (מספר שלם)',
    operandB: 'אופרנד ב׳ (מספר שלם)',
    bitWidthLabel: 'רוחב מילת סיביות',
    andCard: 'פעולת AND (&)',
    orCard: 'פעולת OR (|)',
    xorCard: 'פעולת XOR (^)',
    notACard: 'פעולת NOT A (~A)',
    shiftLCard: 'הזזה שמאלה (A << 1)',
    shiftRCard: 'הזזה ימינה (A >> 1)',
    truthTableTitle: 'טבלת השוואת סיביות ופירוק לוגי',
    faqTitle: 'שאלות ותשובות נפוצות: פעולות Bitwise',
    q1: 'למה משמש שער XOR במדעי המחשב?',
    a1: 'שער XOR מחזיר 1 רק כאשר הסיביות שונות זו מזו. הוא חיוני בהצפנה, פונקציות גיבוב (Hash), בדיקות תקינות (Parity) והחלפת משתנים מהירה.',
    q2: 'מהי המשמעות המתמטית של הזזת סיביות (Bit Shift)?',
    a2: 'הזזה שמאלה בסיבית אחת (A << 1) מכפילה את המספר ב-2. הזזה ימינה (A >> 1) מחלקת את המספר ב-2 (חלוקת שלמים).',
    q3: 'כיצד מיוצגים מספרים שליליים בבינארי?',
    a3: 'מחשבים משתמשים בשיטת המשלים ל-2 (Two’s Complement), שבה הסיבית השמאלית ביותר (MSB) מציינת את סימן המספר.'
  },
  es: {
    title: 'Calculadora Bitwise y Operadores Binarios Lógicos',
    subtitle: 'Calcula AND, OR, XOR, NOT y Desplazamientos de Bits',
    description: 'Calculadora de operaciones a nivel de bits (Bitwise). Evalúa compuertas lógicas y desplazamientos en 8, 16 y 32 bits.',
    operandA: 'Operando A',
    operandB: 'Operando B',
    bitWidthLabel: 'Ancho de bits',
    andCard: 'AND (&)',
    orCard: 'OR (|)',
    xorCard: 'XOR (^)',
    notACard: 'NOT A (~A)',
    shiftLCard: 'Desplazamiento Izq (A << 1)',
    shiftRCard: 'Desplazamiento Der (A >> 1)',
    truthTableTitle: 'Tabla de Bits Detallada',
    faqTitle: 'Preguntas Frecuentes: Operaciones Bitwise',
    q1: '¿Para qué sirve XOR?',
    a1: 'Para criptografía, conmutación de bits y verificación de paridad.',
    q2: '¿Qué hace un bit shift?',
    a2: 'Mover a la izquierda multiplica por 2; a la derecha divide por 2.',
    q3: '¿Complemento a dos?',
    a3: 'Es el sistema para representar enteros negativos en binario.'
  },
  fr: {
    title: 'Calculateur Bitwise et Opérateurs Logiques Binaires',
    subtitle: 'Calculez AND, OR, XOR, NOT et Décalages de Bits',
    description: 'Évaluez les opérations logiques bit à bit (AND, OR, XOR, décalages gauche/droite) sur 8, 16 ou 32 bits.',
    operandA: 'Opérande A',
    operandB: 'Opérande B',
    bitWidthLabel: 'Largeur en bits',
    andCard: 'ET logique AND (&)',
    orCard: 'OU logique OR (|)',
    xorCard: 'OU exclusif XOR (^)',
    notACard: 'NON logique NOT (~A)',
    shiftLCard: 'Décalage gauche (A << 1)',
    shiftRCard: 'Décalage droite (A >> 1)',
    truthTableTitle: 'Tableau des Bits Comparés',
    faqTitle: 'Questions Fréquentes sur le Bitwise',
    q1: 'À quoi sert le XOR ?',
    a1: 'Aux algorithmes de chiffrement, masquage et parité.',
    q2: 'Quel est l’effet d’un décalage de bit ?',
    a2: 'Décaler à gauche multiplie par 2, décaler à droite divise par 2.',
    q3: 'Qu’est-ce que le complément à deux ?',
    a3: 'La méthode standard de représentation des nombres négatifs en binaire.'
  },
  ar: {
    title: 'حاسبة العمليات على مستوى البتات (Bitwise)',
    subtitle: 'حساب المعاملات المنطقية AND, OR, XOR, NOT وإزاحة البتات',
    description: 'حاسبة البتات الثنائية أونلاين: تقييم البوابات المنطقية والإزاحة الثنائية على 8، 16 أو 32 بت.',
    operandA: 'المعامل الأول A',
    operandB: 'المعامل الثاني B',
    bitWidthLabel: 'عرض البتات',
    andCard: 'معامل AND (&)',
    orCard: 'معامل OR (|)',
    xorCard: 'معامل XOR (^)',
    notACard: 'معامل NOT (~A)',
    shiftLCard: 'إزاحة لليسار (A << 1)',
    shiftRCard: 'إزاحة لليمين (A >> 1)',
    truthTableTitle: 'جدول مقارنة البتات المنطقية',
    faqTitle: 'الأسئلة الشائعة حول العمليات على البتات',
    q1: 'ما هي استخدامات معامل XOR؟',
    a1: 'يستخدم بكثرة في خوارزميات التشفير وجداول التجزئة وفحص التماثل.',
    q2: 'ما هو التأثير الحسابي لإزاحة البت؟',
    a2: 'الإزاحة لليسار تضاعف الرقم في 2، والإزاحة لليمين تقسمه على 2.',
    q3: 'ما هو المتمم الثنائي؟',
    a3: 'النظام الرياضي القياسي لتمثيل الأرقام السالبة في الحاسوب.'
  }
};

export default function BitwiseCalculator() {
  const { lang } = useI18n();
  const dict = localDict[lang as keyof typeof localDict] || localDict.en;

  const [operandA, setOperandA] = useUrlState<number>('a', 12);
  const [operandB, setOperandB] = useUrlState<number>('b', 10);
  const [bitWidth, setBitWidth] = useUrlState<8 | 16 | 32>('bits', 8);

  const bitResult = useMemo(() => {
    return calculateBitwise(Number(operandA) || 0, Number(operandB) || 0, bitWidth);
  }, [operandA, operandB, bitWidth]);

  const handleUpdate = () => {
    trackCalculation('bitwise_calc', { a: operandA, b: operandB, bits: bitWidth });
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8" dir={lang === 'he' || lang === 'ar' ? 'rtl' : 'ltr'}>
      <SEO
        title={dict.title}
        description={dict.description}
        canonicalUrl={`/${lang}/calculators/bitwise-calculator`}
      />

      {/* Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100 shadow-xs">
              <Cpu className="w-6 h-6" />
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

          <div className="flex bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
            {([8, 16, 32] as const).map((bw) => (
              <button
                key={bw}
                onClick={() => { setBitWidth(bw); handleUpdate(); }}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  bitWidth === bw
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {bw}-Bit
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              {dict.operandA}
            </label>
            <input
              type="number"
              value={operandA}
              onChange={(e) => { setOperandA(Number(e.target.value)); handleUpdate(); }}
              className="w-full h-12 px-4 bg-stone-50 border border-stone-200 rounded-xl font-bold font-mono text-stone-900 text-base"
              placeholder="12"
            />
            <span className="text-xs font-mono text-teal-700 font-bold mt-1 block">
              BIN: {bitResult.binaryA}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              {dict.operandB}
            </label>
            <input
              type="number"
              value={operandB}
              onChange={(e) => { setOperandB(Number(e.target.value)); handleUpdate(); }}
              className="w-full h-12 px-4 bg-stone-50 border border-stone-200 rounded-xl font-bold font-mono text-stone-900 text-base"
              placeholder="10"
            />
            <span className="text-xs font-mono text-orange-700 font-bold mt-1 block">
              BIN: {bitResult.binaryB}
            </span>
          </div>
        </div>
      </div>

      {/* Bitwise Operator Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* AND */}
        <div className="bg-teal-900 text-white p-6 rounded-3xl shadow-sm border border-teal-800 flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-200">
            {dict.andCard}
          </span>
          <div className="my-3">
            <span className="text-3xl font-black font-display text-white">
              {bitResult.and}
            </span>
            <span className="text-xs font-mono text-teal-300 block mt-1">
              {bitResult.binaryAnd}
            </span>
          </div>
          <span className="text-xs text-teal-300">1 when both bits are 1</span>
        </div>

        {/* OR */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            {dict.orCard}
          </span>
          <div className="my-3">
            <span className="text-3xl font-black font-display text-teal-700">
              {bitResult.or}
            </span>
            <span className="text-xs font-mono text-stone-500 block mt-1">
              {bitResult.binaryOr}
            </span>
          </div>
          <span className="text-xs text-stone-400">1 when either bit is 1</span>
        </div>

        {/* XOR */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            {dict.xorCard}
          </span>
          <div className="my-3">
            <span className="text-3xl font-black font-display text-stone-900">
              {bitResult.xor}
            </span>
            <span className="text-xs font-mono text-stone-500 block mt-1">
              {bitResult.binaryXor}
            </span>
          </div>
          <span className="text-xs text-stone-400">1 when bits are different</span>
        </div>

        {/* NOT A */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            {dict.notACard}
          </span>
          <div className="my-3">
            <span className="text-3xl font-black font-display text-stone-800">
              {bitResult.notA}
            </span>
            <span className="text-xs font-mono text-stone-500 block mt-1">
              {bitResult.binaryNotA}
            </span>
          </div>
          <span className="text-xs text-stone-400">Inverts all bits of A</span>
        </div>

        {/* Shift Left */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            {dict.shiftLCard}
          </span>
          <div className="my-3">
            <span className="text-3xl font-black font-display text-stone-800">
              {bitResult.shiftLeftA}
            </span>
          </div>
          <span className="text-xs text-stone-400">Multiplies A by 2</span>
        </div>

        {/* Shift Right */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            {dict.shiftRCard}
          </span>
          <div className="my-3">
            <span className="text-3xl font-black font-display text-stone-800">
              {bitResult.shiftRightA}
            </span>
          </div>
          <span className="text-xs text-stone-400">Divides A by 2</span>
        </div>
      </div>

      {/* Bit Breakdown Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-teal-600" />
          <h2 className="text-lg font-bold text-stone-900">{dict.truthTableTitle}</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-sm border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-xs text-stone-400 font-sans">
                <th className="py-2.5 px-3">Operation</th>
                <th className="py-2.5 px-3">Expression</th>
                <th className="py-2.5 px-3">Decimal</th>
                <th className="py-2.5 px-3">Binary Bit Representation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              <tr>
                <td className="py-2 px-3 font-sans font-bold text-stone-700">Operand A</td>
                <td className="py-2 px-3 text-stone-500">A</td>
                <td className="py-2 px-3 font-bold text-teal-800">{bitResult.a}</td>
                <td className="py-2 px-3 text-teal-700 font-bold">{bitResult.binaryA}</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-sans font-bold text-stone-700">Operand B</td>
                <td className="py-2 px-3 text-stone-500">B</td>
                <td className="py-2 px-3 font-bold text-orange-800">{bitResult.b}</td>
                <td className="py-2 px-3 text-orange-700 font-bold">{bitResult.binaryB}</td>
              </tr>
              <tr className="bg-teal-50/50">
                <td className="py-2 px-3 font-sans font-bold text-teal-900">A AND B</td>
                <td className="py-2 px-3 text-stone-500">A & B</td>
                <td className="py-2 px-3 font-bold text-teal-950">{bitResult.and}</td>
                <td className="py-2 px-3 text-teal-900 font-bold">{bitResult.binaryAnd}</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-sans font-bold text-stone-700">A OR B</td>
                <td className="py-2 px-3 text-stone-500">A | B</td>
                <td className="py-2 px-3 font-bold text-stone-900">{bitResult.or}</td>
                <td className="py-2 px-3 text-stone-700 font-bold">{bitResult.binaryOr}</td>
              </tr>
              <tr className="bg-stone-50">
                <td className="py-2 px-3 font-sans font-bold text-stone-700">A XOR B</td>
                <td className="py-2 px-3 text-stone-500">A ^ B</td>
                <td className="py-2 px-3 font-bold text-stone-900">{bitResult.xor}</td>
                <td className="py-2 px-3 text-stone-700 font-bold">{bitResult.binaryXor}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

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
