import React, { useMemo } from 'react';
import { useUrlState } from '../../hooks/useUrlState';
import { useI18n } from '../../contexts/i18n';
import SEO from '../../components/SEO';
import CountUp from '../../components/CountUp';
import ShinyText from '../../components/ShinyText';
import { solveTriangleSSS, solveTriangleSAS } from '../../lib/math/geometry';
import { trackCalculation } from '../../lib/analytics';
import {
  Triangle,
  HelpCircle,
  Sparkles,
  ArrowRightLeft,
  CheckCircle2,
  Compass
} from 'lucide-react';

const localDict = {
  en: {
    title: 'Triangle Solver & Trigonometry Calculator',
    subtitle: 'Solve Angles, Sides, Area, Inradius, Circumradius & Heron’s Formula',
    description: 'Comprehensive triangle calculator. Solve triangles using SSS (3 sides) or SAS (2 sides & angle), finding all angles, area, heights, and inscribed/circumscribed circle radii.',
    modeSSS: 'SSS (3 Sides: a, b, c)',
    modeSAS: 'SAS (2 Sides & Angle C)',
    sideALabel: 'Side a',
    sideBLabel: 'Side b',
    sideCLabel: 'Side c',
    angleCLabel: 'Angle C (°)',
    areaCard: 'Triangle Area',
    perimeterCard: 'Perimeter',
    inradiusCard: 'Inradius (r)',
    circumradiusCard: 'Circumradius (R)',
    classification: 'Triangle Classification',
    anglesSummary: 'Internal Angles (A, B, C)',
    heightsSummary: 'Altitudes / Heights (ha, hb, hc)',
    stepByStep: 'Step-by-Step Trigonometric Derivation',
    invalidTriangle: 'The entered side lengths do not satisfy the Triangle Inequality (a + b > c). Please enter valid values.',
    faqTitle: 'Frequently Asked Questions: Triangle Trigonometry',
    q1: 'What is the Triangle Inequality Theorem?',
    a1: 'The sum of the lengths of any two sides of a triangle must always be strictly greater than the length of the remaining side: a + b > c, a + c > b, and b + c > a.',
    q2: 'What is Heron’s formula for triangle area?',
    a2: 'Heron’s formula calculates the area of any triangle from its three side lengths without needing an angle or altitude: Area = √(s(s - a)(s - b)(s - c)), where s = (a + b + c) / 2 is the semi-perimeter.',
    q3: 'What is the difference between Inradius and Circumradius?',
    a3: 'The inradius (r) is the radius of the largest circle tangent to all three sides inside the triangle (r = Area / s). The circumradius (R) is the radius of the circle passing through all three vertices (R = abc / 4Area).'
  },
  he: {
    title: 'מחשבון משולשים וטריגונומטריה',
    subtitle: 'חישוב זוויות, צלעות, שטח, רדיוס מעגל חוסם וחסום ונוסחת הרון',
    description: 'מחשבון פתרון משולשים מקצועי. פתרון לפי 3 צלעות (SSS) או צלע-זווית-צלע (SAS), מציאת זוויות, שטח, גבהים ורדיוסי מעגלים חוסם וחסום.',
    modeSSS: '3 צלעות (צ.צ.צ - SSS)',
    modeSAS: 'שתי צלעות וזווית (צ.ז.צ - SAS)',
    sideALabel: 'צלע a',
    sideBLabel: 'צלע b',
    sideCLabel: 'צלע c',
    angleCLabel: 'זווית C (במעלות)',
    areaCard: 'שטח המשולש',
    perimeterCard: 'היקף המשולש',
    inradiusCard: 'רדיוס מעגל חסום (r)',
    circumradiusCard: 'רדיוס מעגל חוסם (R)',
    classification: 'סיווג המשולש',
    anglesSummary: 'זוויות פנימיות (A, B, C)',
    heightsSummary: 'גבהים לצלעות (ha, hb, hc)',
    stepByStep: 'שלבי הפתרון הטריגונומטרי',
    invalidTriangle: 'הצלעות שהוזנו אינן מקיימות את אי-שוויון המשולש (סכום כל שתי צלעות חייב להיות גדול מהשלישית). אנא הזן נתונים תקינים.',
    faqTitle: 'שאלות ותשובות נפוצות: טריגונומטריה ומשולשים',
    q1: 'מהו משפט אי-שוויון המשולש?',
    a1: 'סכום האורכים של כל שתי צלעות במשולש חייב להיות גדול ממש מאורך הצלע השלישית: a + b > c, וכן הלאה.',
    q2: 'מהי נוסחת הרון (Heron) לחישוב שטח משולש?',
    a2: 'נוסחת הרון מחשבת שטח באמצעות 3 הצלעות בלבד ללא צורך בגובה: Area = √(s(s - a)(s - b)(s - c)), כאשר s הוא מחצית ההיקף.',
    q3: 'מה ההבדל בין מעגל חוסם למעגל חסום?',
    a3: 'מעגל חסום משיק לכל שלוש הצלעות מבפנים (רדיוס r = S / s). מעגל חוסם עובר דרך שלושת קודקודי המשולש (רדיוס R = abc / 4S).'
  },
  es: {
    title: 'Calculadora de Triángulos y Trigonometría',
    subtitle: 'Resuelve Ángulos, Lados, Área, Inradio y Circunradio',
    description: 'Resuelve triángulos por LLL (3 lados) o LAL (2 lados y ángulo). Obtén ángulos, área con fórmula de Herón y radios circunscrito e inscrito.',
    modeSSS: '3 Lados (LLL / SSS)',
    modeSAS: '2 Lados y Ángulo (LAL / SAS)',
    sideALabel: 'Lado a',
    sideBLabel: 'Lado b',
    sideCLabel: 'Lado c',
    angleCLabel: 'Ángulo C (°)',
    areaCard: 'Área del Triángulo',
    perimeterCard: 'Perímetro',
    inradiusCard: 'Inradio (r)',
    circumradiusCard: 'Circunradio (R)',
    classification: 'Clasificación',
    anglesSummary: 'Ángulos Internos (A, B, C)',
    heightsSummary: 'Alturas (ha, hb, hc)',
    stepByStep: 'Paso a Paso Trigonométrico',
    invalidTriangle: 'Las longitudes no cumplen la desigualdad triangular.',
    faqTitle: 'Preguntas Frecuentes: Triángulos',
    q1: '¿Qué es la desigualdad triangular?',
    a1: 'La suma de dos lados siempre debe ser mayor al tercer lado.',
    q2: '¿Qué es la fórmula de Herón?',
    a2: 'Permite calcular el área con solo conocer los 3 lados: √(s(s-a)(s-b)(s-c)).',
    q3: '¿Inradio vs Circunradio?',
    a3: 'El inradio es el radio del círculo inscrito; el circunradio es del círculo circunscrito.'
  },
  fr: {
    title: 'Résolveur de Triangles et Trigonométrie',
    subtitle: 'Angles, Côtés, Aire (Héron), Rayons Inscrit et Circonscrit',
    description: 'Calculateur complet de triangles. Résolvez selon CCC (3 côtés) ou CAC (2 côtés et angle), trouvez les angles, hauteurs et rayons.',
    modeSSS: '3 Côtés (CCC / SSS)',
    modeSAS: '2 Côtés et Angle (CAC / SAS)',
    sideALabel: 'Côté a',
    sideBLabel: 'Côté b',
    sideCLabel: 'Côté c',
    angleCLabel: 'Angle C (°)',
    areaCard: 'Aire du Triangle',
    perimeterCard: 'Périmètre',
    inradiusCard: 'Rayon inscrit (r)',
    circumradiusCard: 'Rayon circonscrit (R)',
    classification: 'Classification',
    anglesSummary: 'Angles Intérieurs',
    heightsSummary: 'Hauteurs (ha, hb, hc)',
    stepByStep: 'Détails des Étapes',
    invalidTriangle: 'Les longueurs ne respectent pas l’inégalité triangulaire.',
    faqTitle: 'Questions Fréquentes : Trigonométrie',
    q1: 'Qu’est-ce que l’inégalité triangulaire ?',
    a1: 'La somme de deux côtés est toujours strictement supérieure au troisième.',
    q2: 'Comment fonctionne la formule de Héron ?',
    a2: 'Aire = √(s(s-a)(s-b)(s-c)), où s est le demi-périmètre.',
    q3: 'Cercle inscrit vs circonscrit ?',
    a3: 'Le cercle inscrit touche les 3 côtés, le circonscrit passe par les 3 sommets.'
  },
  ar: {
    title: 'حاسبة حل المثلثات وحساب المثلثات',
    subtitle: 'حساب الزوايا، الأضلاع، المساحة، نصف قطر الدائرة الداخلية والخارجية',
    description: 'حاسبة متقدمة للمثلثات بمعلومية ثلاثة أضلاع أو ضلعين وزاوية محصورة باستخدام قانون جيب التمام وصيغة هيرون.',
    modeSSS: 'ثلاثة أضلاع (SSS)',
    modeSAS: 'ضلعان وزاوية محصورة (SAS)',
    sideALabel: 'الضلع a',
    sideBLabel: 'الضلع b',
    sideCLabel: 'الضلع c',
    angleCLabel: 'الزاوية C (بالدرجات)',
    areaCard: 'مساحة المثلث',
    perimeterCard: 'المحيط',
    inradiusCard: 'نصف قطر الدائرة الداخلية (r)',
    circumradiusCard: 'نصف قطر الدائرة الخارجية (R)',
    classification: 'تصنيف المثلث',
    anglesSummary: 'الزوايا الداخلية (A, B, C)',
    heightsSummary: 'الارتفاعات (ha, hb, hc)',
    stepByStep: 'خطوات الحل بالتفصيل',
    invalidTriangle: 'الأطوال المدخلة لا تحقق متباينة المثلث (مجموع أي ضلعين يجب أن يكون أكبر من الثالث).',
    faqTitle: 'الأسئلة الشائعة حول المثلثات',
    q1: 'ما هي متباينة المثلث؟',
    a1: 'مجموع طولي أي ضلعين في المثلث يجب أن يكون أكبر من طول الضلع الثالث.',
    q2: 'ما هي صيغة هيرون لحساب المساحة؟',
    a2: 'صيغة لحساب المساحة بدلالة أطوال الأضلاع الثلاثة دون الحاجة للارتفاع.',
    q3: 'ما هو الفرق بين الدائرة المحاطة والدائرة المحيطة؟',
    a3: 'الدائرة الداخلية تمس أضلاع المثلث من الداخل، والدائرة الخارجية تمر برؤوسه الثلاثة.'
  }
};

export default function TriangleSolver() {
  const { lang } = useI18n();
  const dict = localDict[lang as keyof typeof localDict] || localDict.en;

  const [mode, setMode] = useUrlState<'sss' | 'sas'>('mode', 'sss');
  const [a, setA] = useUrlState<number>('a', 3);
  const [b, setB] = useUrlState<number>('b', 4);
  const [c, setC] = useUrlState<number>('c', 5);
  const [angleC, setAngleC] = useUrlState<number>('cDeg', 90);

  const result = useMemo(() => {
    const numA = Number(a) || 0;
    const numB = Number(b) || 0;
    if (mode === 'sss') {
      const numC = Number(c) || 0;
      return solveTriangleSSS(numA, numB, numC);
    } else {
      const numAngleC = Number(angleC) || 0;
      return solveTriangleSAS(numA, numB, numAngleC);
    }
  }, [mode, a, b, c, angleC]);

  const handleUpdate = () => {
    trackCalculation('triangle_solver', { mode, a, b, c, angleC });
  };

  // SVG Coordinates for visual triangle representation
  const triangleSvgPoints = useMemo(() => {
    if (!result) return null;
    const sideB = result.sideB; // AC
    const sideC = result.sideC; // AB

    // Let point A be at (0, 0), Point B at (sideC, 0)
    // Point C at (b * cos(A), b * sin(A))
    const angleARad = (result.angleA * Math.PI) / 180;
    const cx = sideB * Math.cos(angleARad);
    const cy = sideB * Math.sin(angleARad);

    // Normalize scale to fit 280x180 viewBox with padding
    const minX = Math.min(0, cx);
    const maxX = Math.max(sideC, cx);
    const maxY = cy;

    const width = maxX - minX || 1;
    const height = maxY || 1;

    const scale = Math.min(220 / width, 130 / height);
    const padX = 35;
    const padY = 25;

    const axScreen = padX + (0 - minX) * scale;
    const ayScreen = 160 - padY;
    const bxScreen = padX + (sideC - minX) * scale;
    const byScreen = 160 - padY;
    const cxScreen = padX + (cx - minX) * scale;
    const cyScreen = 160 - padY - cy * scale;

    return {
      points: `${axScreen},${ayScreen} ${bxScreen},${byScreen} ${cxScreen},${cyScreen}`,
      A: { x: axScreen, y: ayScreen },
      B: { x: bxScreen, y: byScreen },
      C: { x: cxScreen, y: cyScreen }
    };
  }, [result]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8" dir={lang === 'he' || lang === 'ar' ? 'rtl' : 'ltr'}>
      <SEO
        title={dict.title}
        description={dict.description}
        canonicalUrl={`/${lang}/calculators/triangle-solver`}
      />

      {/* Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100 shadow-xs">
              <Triangle className="w-6 h-6" />
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
            <button
              onClick={() => { setMode('sss'); handleUpdate(); }}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                mode === 'sss'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {dict.modeSSS}
            </button>
            <button
              onClick={() => { setMode('sas'); handleUpdate(); }}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                mode === 'sas'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {dict.modeSAS}
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              {dict.sideALabel}
            </label>
            <input
              type="number"
              min="0.001"
              step="any"
              value={a}
              onChange={(e) => { setA(Number(e.target.value)); handleUpdate(); }}
              className="w-full h-12 px-4 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900 text-base"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              {dict.sideBLabel}
            </label>
            <input
              type="number"
              min="0.001"
              step="any"
              value={b}
              onChange={(e) => { setB(Number(e.target.value)); handleUpdate(); }}
              className="w-full h-12 px-4 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900 text-base"
            />
          </div>

          {mode === 'sss' ? (
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                {dict.sideCLabel}
              </label>
              <input
                type="number"
                min="0.001"
                step="any"
                value={c}
                onChange={(e) => { setC(Number(e.target.value)); handleUpdate(); }}
                className="w-full h-12 px-4 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900 text-base"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                {dict.angleCLabel}
              </label>
              <input
                type="number"
                min="0.1"
                max="179.9"
                step="any"
                value={angleC}
                onChange={(e) => { setAngleC(Number(e.target.value)); handleUpdate(); }}
                className="w-full h-12 px-4 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900 text-base"
              />
            </div>
          )}
        </div>
      </div>

      {result ? (
        <>
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-teal-900 text-white p-6 rounded-3xl shadow-sm border border-teal-800 flex flex-col justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-200">
                {dict.areaCard}
              </span>
              <div className="my-3">
                <span className="text-3xl font-black font-display tracking-tight text-white">
                  <CountUp value={result.area} decimals={2} />
                </span>
              </div>
              <span className="text-xs text-teal-300 font-medium">
                Heron’s Formula √(s(s-a)(s-b)(s-c))
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                {dict.perimeterCard}
              </span>
              <div className="my-3">
                <span className="text-3xl font-black font-display tracking-tight text-stone-900">
                  <CountUp value={result.perimeter} decimals={2} />
                </span>
              </div>
              <span className="text-xs text-stone-400 font-medium">
                Semi-perimeter s = {result.semiPerimeter}
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                {dict.inradiusCard}
              </span>
              <div className="my-3">
                <span className="text-3xl font-black font-display tracking-tight text-teal-700">
                  <CountUp value={result.inradius} decimals={2} />
                </span>
              </div>
              <span className="text-xs text-stone-400 font-medium">
                r = Area / s
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                {dict.circumradiusCard}
              </span>
              <div className="my-3">
                <span className="text-3xl font-black font-display tracking-tight text-stone-800">
                  <CountUp value={result.circumradius} decimals={2} />
                </span>
              </div>
              <span className="text-xs text-stone-400 font-medium">
                R = abc / 4Area
              </span>
            </div>
          </div>

          {/* Visualization & Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Geometric SVG Drawing */}
            <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-stone-200 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-600" />
                  <h2 className="text-lg font-bold text-stone-900">{dict.classification}</h2>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-teal-50 text-teal-800 font-bold text-xs rounded-full border border-teal-200 capitalize">
                    {result.triangleType.bySides}
                  </span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-800 font-bold text-xs rounded-full border border-blue-200 capitalize">
                    {result.triangleType.byAngles}
                  </span>
                </div>
              </div>

              {triangleSvgPoints && (
                <div className="w-full h-48 bg-stone-50 rounded-2xl flex items-center justify-center p-2 border border-stone-100">
                  <svg viewBox="0 0 280 180" className="w-full h-full max-h-44">
                    {/* Triangle Polygon */}
                    <polygon
                      points={triangleSvgPoints.points}
                      fill="rgba(0, 106, 90, 0.12)"
                      stroke="#006a5a"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    {/* Vertex Labels */}
                    <text x={triangleSvgPoints.A.x - 12} y={triangleSvgPoints.A.y + 12} className="text-[11px] font-bold fill-stone-700">A ({result.angleA}°)</text>
                    <text x={triangleSvgPoints.B.x + 4} y={triangleSvgPoints.B.y + 12} className="text-[11px] font-bold fill-stone-700">B ({result.angleB}°)</text>
                    <text x={triangleSvgPoints.C.x - 8} y={triangleSvgPoints.C.y - 8} className="text-[11px] font-bold fill-teal-900">C ({result.angleC}°)</text>
                  </svg>
                </div>
              )}

              {/* Angles & Altitudes Breakdown */}
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-stone-100">
                <div className="bg-stone-50 p-3 rounded-xl">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                    {dict.anglesSummary}
                  </span>
                  <p className="text-xs font-mono font-bold text-stone-800">
                    ∠A: {result.angleA}° | ∠B: {result.angleB}° | ∠C: {result.angleC}°
                  </p>
                </div>
                <div className="bg-stone-50 p-3 rounded-xl">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                    {dict.heightsSummary}
                  </span>
                  <p className="text-xs font-mono font-bold text-stone-800">
                    ha: {result.heightA} | hb: {result.heightB} | hc: {result.heightC}
                  </p>
                </div>
              </div>
            </div>

            {/* Steps Card */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ArrowRightLeft className="w-5 h-5 text-teal-600" />
                  <h2 className="text-base font-bold text-stone-900">{dict.stepByStep}</h2>
                </div>

                <div className="space-y-2 text-xs font-medium text-stone-600">
                  {result.steps.map((st, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-stone-50 p-2 rounded-xl border border-stone-100">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span className="font-mono text-stone-800 leading-relaxed text-[11px]">{st}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 text-center">
                <span className="text-xs text-stone-400 font-medium">
                  <ShinyText text="Law of Cosines & Sines Precision" />
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="p-6 bg-amber-50 text-amber-900 rounded-3xl border border-amber-200 font-medium text-sm flex items-center gap-3">
          <Compass className="w-5 h-5 text-amber-700 shrink-0" />
          {dict.invalidTriangle}
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
