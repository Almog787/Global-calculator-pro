import React, { useMemo } from 'react';
import { useUrlState } from '../../hooks/useUrlState';
import { useI18n } from '../../contexts/i18n';
import SEO from '../../components/SEO';
import CountUp from '../../components/CountUp';
import ShinyText from '../../components/ShinyText';
import {
  ComplexNumber,
  formatComplex,
  addComplex,
  subComplex,
  mulComplex,
  divComplex,
  powerComplex,
  analyzeComplex
} from '../../lib/math/complex';
import { trackCalculation } from '../../lib/analytics';
import {
  Zap,
  HelpCircle,
  Sparkles,
  Layers,
  Repeat,
  Compass
} from 'lucide-react';

const localDict = {
  en: {
    title: 'Complex Numbers Calculator',
    subtitle: 'Arithmetic, Polar & Euler Form, Modulus, Argument & Argand Diagram',
    description: 'Comprehensive complex numbers calculator. Convert between rectangular, polar, and exponential Euler forms. Calculate modulus, argument, conjugate, square roots, powers, addition, subtraction, multiplication, and division with step-by-step solutions.',
    tabSingle: 'Complex Number Analysis (z)',
    tabBinary: 'Complex Arithmetic (z₁ & z₂)',
    tabPower: 'Power & De Moivre (zⁿ)',
    realLabel: 'Real Part (Re)',
    imagLabel: 'Imaginary Part (Im)',
    z1Label: 'Complex Number z₁',
    z2Label: 'Complex Number z₂',
    powerNLabel: 'Exponent Power (n)',
    presets: 'Quick Presets',
    presetUnit: '1 + i',
    presetPureIm: '0 + 2i',
    presetNegative: '-3 + 4i',
    presetEulerSpecial: 'cos(60°) + i·sin(60°)',
    modulusCard: 'Modulus |z|',
    argDegCard: 'Argument (Degrees)',
    argRadCard: 'Argument (Radians)',
    conjugateCard: 'Conjugate (z̄)',
    reciprocalCard: 'Reciprocal (1/z)',
    polarFormTitle: 'Polar Trigonometric Form',
    eulerFormTitle: 'Exponential Euler Form',
    rootsTitle: 'Square Roots (±√z)',
    argandTitle: 'Argand Diagram (Complex Plane)',
    operation: 'Operation',
    opAdd: 'Addition (z₁ + z₂)',
    opSub: 'Subtraction (z₁ − z₂)',
    opMul: 'Multiplication (z₁ × z₂)',
    opDiv: 'Division (z₁ / z₂)',
    resultTitle: 'Operation Result',
    stepsTitle: 'Step-by-Step Mathematical Derivation',
    faqTitle: 'Frequently Asked Questions: Complex Numbers',
    q1: 'What is the difference between Rectangular, Polar, and Euler forms?',
    a1: 'Rectangular form expresses a complex number as z = a + bi (real and imaginary parts). Polar form expresses it as z = r(cos θ + i sin θ), where r = |z| is the modulus and θ is the argument angle. Euler’s form compactly writes this as z = r·e^(iθ).',
    q2: 'How do you multiply and divide complex numbers?',
    a2: 'To multiply, use the distributive property FOIL and substitute i² = -1: (a + bi)(c + di) = (ac - bd) + (ad + bc)i. In polar form, multiply moduli and add angles: r₁r₂ e^(i(θ₁+θ₂)). To divide, multiply numerator and denominator by the complex conjugate of the denominator.',
    q3: 'What is De Moivre’s Theorem?',
    a3: 'De Moivre’s theorem states that for any real number θ and integer n: [r(cos θ + i sin θ)]ⁿ = rⁿ(cos(nθ) + i sin(nθ)). It allows fast and exact calculation of high powers and roots of complex numbers.'
  },
  he: {
    title: 'מחשבון מספרים מרוכבים',
    subtitle: 'פעולות חשבון, הצגה קוטבית ואוילר, מודולוס, ארגומנט ומישור גאוס (דיאגרמת ארגנד)',
    description: 'מחשבון מספרים מרוכבים מתקדם. המרה בין הצגה אלגברית, קוטבית (טריגונומטרית) והצגת אוילר מעריכית. חישוב מודולוס, ארגומנט (זווית), צמוד, שורשים, חזקות לפי דה-מואבר, חיבור, חיסור, כפל וחילוק עם שלבי פתרון מלאים.',
    tabSingle: 'ניתוח מספר מרוכב (z)',
    tabBinary: 'פעולות חשבון (z₁ ו-z₂)',
    tabPower: 'חזקות ונוסחת דה-מואבר (zⁿ)',
    realLabel: 'חלק ממשי (Re)',
    imagLabel: 'חלק מדומה (Im)',
    z1Label: 'מספר מרוכב z₁',
    z2Label: 'מספר מרוכב z₂',
    powerNLabel: 'מעריך חזקה (n)',
    presets: 'דוגמאות מהירות',
    presetUnit: '1 + i',
    presetPureIm: '0 + 2i',
    presetNegative: '-3 + 4i',
    presetEulerSpecial: 'cos(60°) + i·sin(60°)',
    modulusCard: 'ערך מוחלט (מודולוס) |z|',
    argDegCard: 'ארגומנט (במעלות)',
    argRadCard: 'ארגומנט (ברדיאנים)',
    conjugateCard: 'מספר צמוד (z̄)',
    reciprocalCard: 'מספר הופכי (1/z)',
    polarFormTitle: 'הצגה קוטבית (טריגונומטרית)',
    eulerFormTitle: 'הצגת אוילר מעריכית (r·eⁱᶿ)',
    rootsTitle: 'שורשים ריבועיים (±√z)',
    argandTitle: 'דיאגרמת ארגנד (המישור המרוכב של גאוס)',
    operation: 'פעולה חשבונית',
    opAdd: 'חיבור (z₁ + z₂)',
    opSub: 'חיסור (z₁ − z₂)',
    opMul: 'כפל (z₁ × z₂)',
    opDiv: 'חילוק (z₁ / z₂)',
    resultTitle: 'תוצאת החישוב',
    stepsTitle: 'שלבי הפיתוח המתמטי שלב-אחר-שלב',
    faqTitle: 'שאלות ותשובות נפוצות: מספרים מרוכבים',
    q1: 'מה ההבדל בין הצגה אלגברית, קוטבית והצגת אוילר?',
    a1: 'הצגה אלגברית היא z = a + bi (חלק ממשי ומדומה). הצגה קוטבית (פולרית) מבוססת על מרחק r וזווית θ: r(cos θ + i sin θ). הצגת אוילר כותבת זאת בצורה מעריכית קומפקטית: z = r·e^(iθ).',
    q2: 'כיצד מבצעים כפל וחילוק במספרים מרוכבים?',
    a2: 'בכפל אלגברי פותחים סוגריים ומציבים i² = -1. בהצגה קוטבית: מכפילים את הרדיוסים ומחברים את הזוויות. בחילוק מכפילים את המונה והמכנה בצמוד המרוכב של המכנה.',
    q3: 'מהו משפט דה-מואבר (De Moivre)?',
    a3: 'משפט דה-מואבר קובע כי: [r(cos θ + i sin θ)]ⁿ = rⁿ(cos(nθ) + i sin(nθ)). משפט זה מאפשר לחשב חזקות ושורשים מורכבים בקלות ובמהירות ללא כפלים ארוכים.'
  },
  es: {
    title: 'Calculadora de Números Complejos',
    subtitle: 'Aritmética, Forma Polar y Euler, Módulo, Argumento y Plano Complejo',
    description: 'Calculadora de números complejos paso a paso. Conversión entre forma rectangular, polar y exponencial de Euler. Módulo, argumento, conjugado, raíces, potencias y operaciones.',
    tabSingle: 'Análisis de Número Complejo (z)',
    tabBinary: 'Aritmética (z₁ y z₂)',
    tabPower: 'Potencias y De Moivre (zⁿ)',
    realLabel: 'Parte Real (Re)',
    imagLabel: 'Parte Imaginaria (Im)',
    z1Label: 'Número Complejo z₁',
    z2Label: 'Número Complejo z₂',
    powerNLabel: 'Exponente (n)',
    presets: 'Preajustes',
    presetUnit: '1 + i',
    presetPureIm: '0 + 2i',
    presetNegative: '-3 + 4i',
    presetEulerSpecial: 'cos(60°) + i·sin(60°)',
    modulusCard: 'Módulo |z|',
    argDegCard: 'Argumento (°)',
    argRadCard: 'Argumento (rad)',
    conjugateCard: 'Conjugado (z̄)',
    reciprocalCard: 'Recíproco (1/z)',
    polarFormTitle: 'Forma Polar Trigonométrica',
    eulerFormTitle: 'Forma Exponencial de Euler',
    rootsTitle: 'Raíces Cuadradas (±√z)',
    argandTitle: 'Diagrama de Argand (Plano Complejo)',
    operation: 'Operación',
    opAdd: 'Suma (z₁ + z₂)',
    opSub: 'Resta (z₁ − z₂)',
    opMul: 'Multiplicación (z₁ × z₂)',
    opDiv: 'División (z₁ / z₂)',
    resultTitle: 'Resultado',
    stepsTitle: 'Paso a Paso Matemático',
    faqTitle: 'Preguntas Frecuentes: Números Complejos',
    q1: '¿Qué diferencia hay entre forma rectangular, polar y Euler?',
    a1: 'La rectangular es a + bi, la polar es r(cos θ + i sin θ), y la forma de Euler es r·e^(iθ).',
    q2: '¿Cómo multiplicar y dividir complejos?',
    a2: 'Multiplica expandiendo y usando i² = -1. Para dividir, multiplica por el conjugado del denominador.',
    q3: '¿Qué es el teorema de De Moivre?',
    a3: 'Establece que [r(cos θ + i sin θ)]ⁿ = rⁿ(cos(nθ) + i sin(nθ)).'
  },
  fr: {
    title: 'Calculateur de Nombres Complexes',
    subtitle: 'Forme Algébrique, Polaire et Euler, Module, Argument et Plan Complexe',
    description: 'Calculateur complet de nombres complexes. Formes algébrique, trigonométrique et exponentielle d’Euler. Module, argument, conjugué, racines et opérations.',
    tabSingle: 'Analyse d’un Nombre Complexe (z)',
    tabBinary: 'Arithmétique (z₁ et z₂)',
    tabPower: 'Puissances et De Moivre (zⁿ)',
    realLabel: 'Partie Réelle (Re)',
    imagLabel: 'Partie Imaginaire (Im)',
    z1Label: 'Nombre Complexe z₁',
    z2Label: 'Nombre Complexe z₂',
    powerNLabel: 'Exposant (n)',
    presets: 'Préréglages',
    presetUnit: '1 + i',
    presetPureIm: '0 + 2i',
    presetNegative: '-3 + 4i',
    presetEulerSpecial: 'cos(60°) + i·sin(60°)',
    modulusCard: 'Module |z|',
    argDegCard: 'Argument (°)',
    argRadCard: 'Argument (rad)',
    conjugateCard: 'Conjugué (z̄)',
    reciprocalCard: 'Inverse (1/z)',
    polarFormTitle: 'Forme Trigonométrique Polaire',
    eulerFormTitle: 'Forme Exponentielle d’Euler',
    rootsTitle: 'Racines Carrées (±√z)',
    argandTitle: 'Diagramme d’Argand (Plan Complexe)',
    operation: 'Opération',
    opAdd: 'Addition (z₁ + z₂)',
    opSub: 'Soustraction (z₁ − z₂)',
    opMul: 'Multiplication (z₁ × z₂)',
    opDiv: 'Division (z₁ / z₂)',
    resultTitle: 'Résultat',
    stepsTitle: 'Dérivation Détaillée',
    faqTitle: 'Questions Fréquentes: Nombres Complexes',
    q1: 'Différence entre formes algébrique, polaire et Euler?',
    a1: 'Algébrique: a + bi. Polaire: r(cos θ + i sin θ). Euler: r·e^(iθ).',
    q2: 'Comment multiplier et diviser?',
    a2: 'Multiplication: développer avec i² = -1. Division: multiplier par le conjugué du dénominateur.',
    q3: 'Qu’est-ce que le théorème de De Moivre?',
    a3: 'Il stipule que [r(cos θ + i sin θ)]ⁿ = rⁿ(cos(nθ) + i sin(nθ)).'
  },
  ar: {
    title: 'حاسبة الأعداد المركبة',
    subtitle: 'العمليات الحسابية، الصيغة القطبية وأويلر، المقياس، السعة والمستوى المركب',
    description: 'حاسبة شاملة للأعداد المركبة خطوة بخطوة. التحويل بين الصيغة الجبرية، القطبية وصيغة أويلر الأسية. حساب المقياس، السعة، المرافق، الجذور، القوى والعمليات الحسابية.',
    tabSingle: 'تحليل عدد مركب (z)',
    tabBinary: 'العمليات الحسابية (z₁ و z₂)',
    tabPower: 'القوى ونظرية دي موافر (zⁿ)',
    realLabel: 'الجزء الحقيقي (Re)',
    imagLabel: 'الجزء التخيلي (Im)',
    z1Label: 'العدد المركب z₁',
    z2Label: 'العدد المركب z₂',
    powerNLabel: 'الأس (n)',
    presets: 'نماذج سريعة',
    presetUnit: '1 + i',
    presetPureIm: '0 + 2i',
    presetNegative: '-3 + 4i',
    presetEulerSpecial: 'cos(60°) + i·sin(60°)',
    modulusCard: 'المقياس |z|',
    argDegCard: 'السعة (بالدرجات)',
    argRadCard: 'السعة (بالراديان)',
    conjugateCard: 'المرافق (z̄)',
    reciprocalCard: 'المقلوب (1/z)',
    polarFormTitle: 'الصيغة المثلثية القطبية',
    eulerFormTitle: 'صيغة أويلر الأسية',
    rootsTitle: 'الجذور التربيعية (±√z)',
    argandTitle: 'مخطط أرغاند (المستوى المركب)',
    operation: 'العملية',
    opAdd: 'الجمع (z₁ + z₂)',
    opSub: 'الطرح (z₁ − z₂)',
    opMul: 'الضرب (z₁ × z₂)',
    opDiv: 'القسمة (z₁ / z₂)',
    resultTitle: 'نتيجة العملية',
    stepsTitle: 'خطوات الحل بالتفصيل',
    faqTitle: 'الأسئلة الشائعة: الأعداد المركبة',
    q1: 'ما الفرق بين الصيغ الجبرية والقطبية وصيغة أويلر؟',
    a1: 'الجبرية: z = a + bi. القطبية: r(cos θ + i sin θ). صيغة أويلر: z = r·e^(iθ).',
    q2: 'كيف نضرب ونقسم الأعداد المركبة؟',
    a2: 'في الضرب نوزع ونعوض i² = -1. في القسمة نضرب البسط والمقام في مرافق المقام.',
    q3: 'ما هي نظرية دي موافر؟',
    a3: 'تنص على أن: [r(cos θ + i sin θ)]ⁿ = rⁿ(cos(nθ) + i sin(nθ)).'
  }
};

export default function ComplexNumbers() {
  const { lang } = useI18n();
  const dict = localDict[lang as keyof typeof localDict] || localDict.en;

  const [urlState, setUrlState] = useUrlState({
    mode: 'single', // 'single' | 'binary' | 'power'
    re1: '3',
    im1: '4',
    re2: '1',
    im2: '-2',
    op: 'multiply', // 'add' | 'subtract' | 'multiply' | 'divide'
    n: '3'
  });

  const z1: ComplexNumber = useMemo(() => ({
    re: parseFloat(urlState.re1) || 0,
    im: parseFloat(urlState.im1) || 0
  }), [urlState.re1, urlState.im1]);

  const z2: ComplexNumber = useMemo(() => ({
    re: parseFloat(urlState.re2) || 0,
    im: parseFloat(urlState.im2) || 0
  }), [urlState.re2, urlState.im2]);

  const exponentN = parseInt(urlState.n, 10) || 1;

  // Single analysis
  const analysis = useMemo(() => {
    return analyzeComplex(z1);
  }, [z1]);

  // Binary operation result
  const binaryResult = useMemo(() => {
    if (urlState.op === 'add') return addComplex(z1, z2);
    if (urlState.op === 'subtract') return subComplex(z1, z2);
    if (urlState.op === 'multiply') return mulComplex(z1, z2);
    return divComplex(z1, z2);
  }, [z1, z2, urlState.op]);

  // Power result
  const powerResult = useMemo(() => {
    return powerComplex(z1, exponentN);
  }, [z1, exponentN]);

  // SVG Argand diagram scaling and points
  const argandData = useMemo(() => {
    const points = [z1];
    if (urlState.mode === 'binary' && binaryResult) {
      points.push(z2);
      points.push(binaryResult.result);
    } else if (urlState.mode === 'power') {
      points.push(powerResult.result);
    }

    const maxCoord = Math.max(
      ...points.map(p => Math.max(Math.abs(p.re), Math.abs(p.im))),
      2
    );
    const domain = Math.ceil(maxCoord * 1.3);

    // Coordinate mapping to SVG 300x300 canvas
    const size = 280;
    const center = size / 2;
    const scale = (center - 20) / domain;

    const toSvgCoords = (p: ComplexNumber) => ({
      x: center + p.re * scale,
      y: center - p.im * scale
    });

    return {
      size,
      center,
      domain,
      toSvgCoords,
      p1: toSvgCoords(z1),
      p2: toSvgCoords(z2),
      pRes: toSvgCoords(
        urlState.mode === 'binary' && binaryResult
          ? binaryResult.result
          : powerResult.result
      )
    };
  }, [z1, z2, binaryResult, powerResult, urlState.mode]);

  const applyPreset = (re: number, im: number) => {
    setUrlState({ re1: String(re), im1: String(im) });
    trackCalculation('complex_apply_preset', { re, im });
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-12">
      <SEO
        title={dict.title}
        description={dict.description}
        canonicalUrl={`/${lang}/calculators/complex-numbers`}
      />

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-semibold uppercase tracking-wider">
          <Zap className="w-4 h-4" />
          <ShinyText text={dict.title} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {dict.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {dict.subtitle}
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
        <div className="flex flex-wrap items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            id="tab-single-complex"
            onClick={() => setUrlState({ mode: 'single' })}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              urlState.mode === 'single'
                ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            {dict.tabSingle}
          </button>
          <button
            id="tab-binary-complex"
            onClick={() => setUrlState({ mode: 'binary' })}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              urlState.mode === 'binary'
                ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Repeat className="w-4 h-4" />
            {dict.tabBinary}
          </button>
          <button
            id="tab-power-complex"
            onClick={() => setUrlState({ mode: 'power' })}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              urlState.mode === 'power'
                ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            {dict.tabPower}
          </button>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-500">{dict.presets}:</span>
          <button
            id="preset-unit-btn"
            onClick={() => applyPreset(1, 1)}
            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-violet-50 dark:hover:bg-violet-950/40 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700"
          >
            {dict.presetUnit}
          </button>
          <button
            id="preset-pure-im-btn"
            onClick={() => applyPreset(0, 2)}
            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-violet-50 dark:hover:bg-violet-950/40 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700"
          >
            {dict.presetPureIm}
          </button>
          <button
            id="preset-neg-btn"
            onClick={() => applyPreset(-3, 4)}
            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-violet-50 dark:hover:bg-violet-950/40 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700"
          >
            {dict.presetNegative}
          </button>
        </div>
      </div>

      {/* Inputs Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
        {urlState.mode === 'single' ? (
          /* Single input */
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">
              {dict.z1Label} = a + bi
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {dict.realLabel} (a)
                </label>
                <input
                  id="input-re1"
                  type="number"
                  step="any"
                  value={urlState.re1}
                  onChange={(e) => setUrlState({ re1: e.target.value })}
                  className="w-full h-11 px-4 text-base font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {dict.imagLabel} (b)
                </label>
                <input
                  id="input-im1"
                  type="number"
                  step="any"
                  value={urlState.im1}
                  onChange={(e) => setUrlState({ im1: e.target.value })}
                  className="w-full h-11 px-4 text-base font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none"
                />
              </div>
            </div>
          </div>
        ) : urlState.mode === 'binary' ? (
          /* Two complex numbers */
          <div className="space-y-6">
            {/* Operation Picker */}
            <div className="flex flex-wrap justify-center gap-2">
              {(['add', 'subtract', 'multiply', 'divide'] as const).map((op) => (
                <button
                  key={op}
                  id={`op-${op}-btn`}
                  onClick={() => setUrlState({ op })}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    urlState.op === op
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {op === 'add' ? dict.opAdd : op === 'subtract' ? dict.opSub : op === 'multiply' ? dict.opMul : dict.opDiv}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* z1 */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="text-sm font-bold text-violet-600 dark:text-violet-400">
                  {dict.z1Label} ({formatComplex(z1)})
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">Re(z₁)</label>
                    <input
                      type="number"
                      step="any"
                      value={urlState.re1}
                      onChange={(e) => setUrlState({ re1: e.target.value })}
                      className="w-full h-10 px-3 font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">Im(z₁)</label>
                    <input
                      type="number"
                      step="any"
                      value={urlState.im1}
                      onChange={(e) => setUrlState({ im1: e.target.value })}
                      className="w-full h-10 px-3 font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* z2 */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  {dict.z2Label} ({formatComplex(z2)})
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">Re(z₂)</label>
                    <input
                      type="number"
                      step="any"
                      value={urlState.re2}
                      onChange={(e) => setUrlState({ re2: e.target.value })}
                      className="w-full h-10 px-3 font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">Im(z₂)</label>
                    <input
                      type="number"
                      step="any"
                      value={urlState.im2}
                      onChange={(e) => setUrlState({ im2: e.target.value })}
                      className="w-full h-10 px-3 font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Power mode */
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">
              {dict.tabPower}: zⁿ = ({formatComplex(z1)})ⁿ
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Re(z)
                </label>
                <input
                  type="number"
                  step="any"
                  value={urlState.re1}
                  onChange={(e) => setUrlState({ re1: e.target.value })}
                  className="w-full h-11 px-4 font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Im(z)
                </label>
                <input
                  type="number"
                  step="any"
                  value={urlState.im1}
                  onChange={(e) => setUrlState({ im1: e.target.value })}
                  className="w-full h-11 px-4 font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {dict.powerNLabel}
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={urlState.n}
                  onChange={(e) => setUrlState({ n: e.target.value })}
                  className="w-full h-11 px-4 font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Results & Visualizer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Key Cards and Math representations */}
        <div className="lg:col-span-7 space-y-6">
          {urlState.mode === 'single' ? (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    {dict.modulusCard}
                  </span>
                  <div className="text-2xl font-black text-violet-600 dark:text-violet-400">
                    <CountUp end={analysis.modulus} decimals={3} />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    {dict.argDegCard}
                  </span>
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    <CountUp end={analysis.argumentDeg} decimals={2} />°
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    {dict.conjugateCard}
                  </span>
                  <div className="text-xl font-bold font-mono text-slate-800 dark:text-slate-100">
                    {formatComplex(analysis.conjugate)}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    {dict.reciprocalCard}
                  </span>
                  <div className="text-xl font-bold font-mono text-slate-800 dark:text-slate-100">
                    {analysis.reciprocal ? formatComplex(analysis.reciprocal) : 'Undefined'}
                  </div>
                </div>
              </div>

              {/* Mathematical Forms */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    {dict.polarFormTitle}
                  </h3>
                  <div className="font-mono text-base font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    z = {analysis.polarForm}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    {dict.eulerFormTitle}
                  </h3>
                  <div className="font-mono text-base font-bold text-violet-600 dark:text-violet-400 bg-violet-50/50 dark:bg-violet-950/20 p-3 rounded-xl border border-violet-200/50 dark:border-violet-900/40">
                    z = {analysis.eulerForm}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    {dict.rootsTitle}
                  </h3>
                  <div className="font-mono text-sm font-bold text-slate-700 dark:text-slate-300 space-y-1">
                    <div>z₁ = {formatComplex(analysis.squareRootPrimary)}</div>
                    <div>z₂ = {formatComplex(analysis.squareRootSecondary)}</div>
                  </div>
                </div>
              </div>
            </>
          ) : urlState.mode === 'binary' && binaryResult ? (
            /* Binary operation result card */
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-6">
              <div className="text-center space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {dict.resultTitle}
                </span>
                <div className="text-3xl sm:text-4xl font-black text-violet-600 dark:text-violet-400 font-mono">
                  {binaryResult.formatted}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-xs font-bold text-slate-500 block mb-1">{dict.modulusCard}</span>
                  <div className="text-xl font-black text-slate-900 dark:text-white">
                    <CountUp end={binaryResult.polar.r} decimals={3} />
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-xs font-bold text-slate-500 block mb-1">{dict.argDegCard}</span>
                  <div className="text-xl font-black text-slate-900 dark:text-white">
                    <CountUp end={binaryResult.polar.thetaDeg} decimals={2} />°
                  </div>
                </div>
              </div>

              <div className="font-mono text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div>Polar: {binaryResult.polar.polarString}</div>
                <div className="mt-1">Euler: {binaryResult.polar.eulerString}</div>
              </div>
            </div>
          ) : (
            /* Power result card */
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-6">
              <div className="text-center space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  z^{exponentN} Result
                </span>
                <div className="text-3xl sm:text-4xl font-black text-violet-600 dark:text-violet-400 font-mono">
                  {powerResult.formatted}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-xs font-bold text-slate-500 block mb-1">{dict.modulusCard}</span>
                  <div className="text-xl font-black text-slate-900 dark:text-white">
                    <CountUp end={powerResult.polar.r} decimals={3} />
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-xs font-bold text-slate-500 block mb-1">{dict.argDegCard}</span>
                  <div className="text-xl font-black text-slate-900 dark:text-white">
                    <CountUp end={powerResult.polar.thetaDeg} decimals={2} />°
                  </div>
                </div>
              </div>

              <div className="font-mono text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div>Euler: {powerResult.polar.eulerString}</div>
              </div>
            </div>
          )}
        </div>

        {/* Right column: Interactive Argand Diagram (Complex Plane SVG) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs flex flex-col items-center justify-center">
          <div className="w-full flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Compass className="w-4 h-4 text-violet-500" />
              {dict.argandTitle}
            </h3>
            <span className="text-xs font-semibold text-slate-400">
              ±{argandData.domain}
            </span>
          </div>

          {/* SVG Complex Plane */}
          <div className="relative border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/50 p-2">
            <svg
              width={argandData.size}
              height={argandData.size}
              className="overflow-visible"
            >
              {/* Grid circles */}
              <circle
                cx={argandData.center}
                cy={argandData.center}
                r={argandData.size * 0.35}
                fill="none"
                stroke="currentColor"
                className="text-slate-200 dark:text-slate-800 stroke-dasharray-2"
                strokeDasharray="4 4"
              />

              {/* Main axes: Horizontal Re, Vertical Im */}
              <line
                x1={0}
                y1={argandData.center}
                x2={argandData.size}
                y2={argandData.center}
                stroke="currentColor"
                className="text-slate-400 dark:text-slate-600"
                strokeWidth={1.5}
              />
              <line
                x1={argandData.center}
                y1={0}
                x2={argandData.center}
                y2={argandData.size}
                stroke="currentColor"
                className="text-slate-400 dark:text-slate-600"
                strokeWidth={1.5}
              />

              {/* Axis labels */}
              <text
                x={argandData.size - 20}
                y={argandData.center - 6}
                className="text-[11px] font-bold fill-slate-500"
              >
                Re
              </text>
              <text
                x={argandData.center + 6}
                y={15}
                className="text-[11px] font-bold fill-slate-500"
              >
                Im
              </text>

              {/* Vector z1 */}
              <line
                x1={argandData.center}
                y1={argandData.center}
                x2={argandData.p1.x}
                y2={argandData.p1.y}
                stroke="#8b5cf6"
                strokeWidth={3}
                strokeLinecap="round"
              />
              <circle
                cx={argandData.p1.x}
                cy={argandData.p1.y}
                r={5}
                fill="#8b5cf6"
                className="shadow-sm"
              />
              <text
                x={argandData.p1.x + 8}
                y={argandData.p1.y - 6}
                className="text-[12px] font-bold fill-violet-600 dark:fill-violet-400"
              >
                z₁
              </text>

              {/* In binary mode: Vector z2 */}
              {urlState.mode === 'binary' && (
                <>
                  <line
                    x1={argandData.center}
                    y1={argandData.center}
                    x2={argandData.p2.x}
                    y2={argandData.p2.y}
                    stroke="#6366f1"
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                  <circle
                    cx={argandData.p2.x}
                    cy={argandData.p2.y}
                    r={4}
                    fill="#6366f1"
                  />
                  <text
                    x={argandData.p2.x + 8}
                    y={argandData.p2.y - 6}
                    className="text-[12px] font-bold fill-indigo-600 dark:fill-indigo-400"
                  >
                    z₂
                  </text>
                </>
              )}

              {/* Result Vector */}
              {(urlState.mode === 'binary' || urlState.mode === 'power') && (
                <>
                  <line
                    x1={argandData.center}
                    y1={argandData.center}
                    x2={argandData.pRes.x}
                    y2={argandData.pRes.y}
                    stroke="#10b981"
                    strokeWidth={3}
                    strokeLinecap="round"
                  />
                  <circle
                    cx={argandData.pRes.x}
                    cy={argandData.pRes.y}
                    r={5}
                    fill="#10b981"
                  />
                  <text
                    x={argandData.pRes.x + 8}
                    y={argandData.pRes.y - 6}
                    className="text-[12px] font-bold fill-emerald-600 dark:fill-emerald-400"
                  >
                    Result
                  </text>
                </>
              )}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-violet-500" />
              <span className="text-slate-600 dark:text-slate-400">z₁ ({formatComplex(z1)})</span>
            </div>
            {urlState.mode === 'binary' && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-indigo-500" />
                <span className="text-slate-600 dark:text-slate-400">z₂ ({formatComplex(z2)})</span>
              </div>
            )}
            {(urlState.mode === 'binary' || urlState.mode === 'power') && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-600 dark:text-slate-400">Result</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Step by step derivation */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          {dict.stepsTitle}
        </h3>
        <div className="space-y-2 font-mono text-sm bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto text-slate-700 dark:text-slate-300">
          {(urlState.mode === 'single'
            ? analysis.steps
            : urlState.mode === 'binary' && binaryResult
            ? binaryResult.steps
            : powerResult.steps
          ).map((step, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-violet-500 font-bold select-none">{idx + 1}.</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {dict.faqTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              {dict.q1}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {dict.a1}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              {dict.q2}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {dict.a2}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              {dict.q3}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {dict.a3}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
