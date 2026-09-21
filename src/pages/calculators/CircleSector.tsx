import React, { useMemo } from 'react';
import { useUrlState } from '../../hooks/useUrlState';
import { useI18n } from '../../contexts/i18n';
import SEO from '../../components/SEO';
import CountUp from '../../components/CountUp';
import ShinyText from '../../components/ShinyText';
import { calculateCircleSector } from '../../lib/math/geometry';
import { trackCalculation } from '../../lib/analytics';
import {
  PieChart,
  HelpCircle,
  Sparkles,
  ArrowRightLeft,
  CheckCircle2,
  Circle
} from 'lucide-react';

const localDict = {
  en: {
    title: 'Circle Sector & Arc Length Calculator',
    subtitle: 'Calculate Arc Length (s), Sector Area, Chord Length & Circular Segment',
    description: 'Free online circle sector calculator. Compute arc length, sector area, chord length, and segment area from radius and central angle in degrees or radians with interactive SVG diagram.',
    radiusLabel: 'Circle Radius (r)',
    angleLabel: 'Central Angle θ (Degrees)',
    arcLengthCard: 'Arc Length (s)',
    sectorAreaCard: 'Sector Area (A)',
    chordCard: 'Chord Length (c)',
    segmentCard: 'Segment Area',
    diagramTitle: 'Interactive Sector & Arc Visualizer',
    stepByStep: 'Mathematical Formulation & Derivation',
    faqTitle: 'Frequently Asked Questions: Circle Sectors & Arcs',
    q1: 'What is the formula for arc length?',
    a1: 'Arc length s = r × θ, where r is the radius and θ is the central angle in radians. In degrees: s = 2πr × (θ / 360).',
    q2: 'How do you find the area of a circular segment?',
    a2: 'The segment is the region bounded by a chord and its arc. Its area equals the sector area minus the area of the isosceles triangle formed by the two radii: Area = ½r²(θ - sin θ).',
    q3: 'What is chord length in a circle?',
    a3: 'A chord is the straight line segment joining the two endpoints of the arc. Its length is c = 2r × sin(θ / 2).'
  },
  he: {
    title: 'מחשבון גזרה וקשת במעגל (Sector & Arc)',
    subtitle: 'חישוב אורך קשת (s), שטח גזרה, אורך מיתר ושטח מקטע מעגלי',
    description: 'מחשבון גיאומטרי מדויק למעגל: חישוב אורך קשת, שטח גזרה, אורך מיתר ושטח מקטע (Segment) מרדיוס וזווית מרכזית עם תרשים ויזואלי אינטראקטיבי.',
    radiusLabel: 'רדיוס המעגל (r)',
    angleLabel: 'זווית מרכזית θ (במעלות)',
    arcLengthCard: 'אורך הקשת (s)',
    sectorAreaCard: 'שטח הגזרה (A)',
    chordCard: 'אורך המיתר (c)',
    segmentCard: 'שטח המקטע (Segment)',
    diagramTitle: 'תרשים גיאומטרי ויזואלי של הגזרה',
    stepByStep: 'שלבי החישוב והפיתוח המתמטי',
    faqTitle: 'שאלות ותשובות נפוצות: גזרות וקשתות במעגל',
    q1: 'מהי הנוסחה לחישוב אורך קשת במעגל?',
    a1: 'אורך הקשת שווה לרדיוס כפול הזווית המרכזית ברדיאנים: s = r × θ. במעלות: s = 2πr × (θ / 360).',
    q2: 'כיצד מחשבים שטח מקטע מעגלי (Segment)?',
    a2: 'מקטע הוא השטח הכלוא בין המיתר לקשת. שטחו מתקבל מחיסור שטח המשולש משטח הגזרה: A_segment = A_sector - A_triangle.',
    q3: 'מהו מיתר במעגל ואיך מחשבים את אורכו?',
    a3: 'מיתר הוא קטע ישר המחבר בין שני קצוות הקשת. אורכו מחושב לפי c = 2r × sin(θ / 2).'
  },
  es: {
    title: 'Calculadora de Sector Circular y Longitud de Arco',
    subtitle: 'Calcula Longitud de Arco, Área del Sector, Cuerda y Segmento',
    description: 'Calcula fácilmente el arco, área del sector circular, longitud de cuerda y área del segmento circular con diagrama interactivo.',
    radiusLabel: 'Radio del Círculo (r)',
    angleLabel: 'Ángulo Central θ (°)',
    arcLengthCard: 'Longitud de Arco (s)',
    sectorAreaCard: 'Área del Sector (A)',
    chordCard: 'Longitud de Cuerda (c)',
    segmentCard: 'Área del Segmento',
    diagramTitle: 'Visualizador Gráfico del Sector',
    stepByStep: 'Fórmulas y Desarrollo',
    faqTitle: 'Preguntas Frecuentes: Círculos',
    q1: '¿Fórmula de longitud de arco?',
    a1: 's = r × θ (en radianes), o s = 2πr × (θ / 360) en grados.',
    q2: '¿Área del segmento circular?',
    a2: 'Es el área del sector menos el área del triángulo isósceles central.',
    q3: '¿Qué es una cuerda?',
    a3: 'El segmento recto que une los extremos del arco: c = 2r × sin(θ / 2).'
  },
  fr: {
    title: 'Calculateur de Secteur Circulaire et Longueur d’Arc',
    subtitle: 'Longueur d’arc, aire du secteur, corde et segment circulaire',
    description: 'Calculez la longueur d’arc, l’aire du secteur, la corde et le segment à partir du rayon et de l’angle au centre.',
    radiusLabel: 'Rayon du cercle (r)',
    angleLabel: 'Angle au centre θ (°)',
    arcLengthCard: 'Longueur de l’arc (s)',
    sectorAreaCard: 'Aire du secteur (A)',
    chordCard: 'Longueur de la corde (c)',
    segmentCard: 'Aire du segment',
    diagramTitle: 'Représentation Visuelle du Secteur',
    stepByStep: 'Détails des Formules',
    faqTitle: 'Questions Fréquentes : Cercle et Secteurs',
    q1: 'Quelle formule pour la longueur d’arc ?',
    a1: 's = r × θ (en radians). En degrés : s = 2πr × (θ / 360).',
    q2: 'Comment trouver l’aire du segment ?',
    a2: 'Aire du secteur moins l’aire du triangle central.',
    q3: 'Qu’est-ce qu’une corde ?',
    a3: 'Le segment droit reliant les deux extrémités de l’arc : c = 2r × sin(θ / 2).'
  },
  ar: {
    title: 'حاسبة القطاع الدائري وطول القوس',
    subtitle: 'حساب طول القوس (s)، مساحة القطاع، طول الوتر ومساحة القطعة الدائرية',
    description: 'حاسبة هندسية لحساب طول القوس ومساحة القطاع الدائري والوتر والقطعة الدائرية بمعلومية نصف القطر والزاوية المركزية.',
    radiusLabel: 'نصف قطر الدائرة (r)',
    angleLabel: 'الزاوية المركزية θ (بالدرجات)',
    arcLengthCard: 'طول القوس (s)',
    sectorAreaCard: 'مساحة القطاع (A)',
    chordCard: 'طول الوتر (c)',
    segmentCard: 'مساحة القطعة الدائرية',
    diagramTitle: 'الرسم الهندسي التفاعلي للقطاع',
    stepByStep: 'القوانين الرياضية وخطوات الحل',
    faqTitle: 'الأسئلة الشائعة حول القطاع الدائري',
    q1: 'ما هو قانون طول القوس؟',
    a1: 'طول القوس s = r × θ (بالراديان)، أو بالدرجات s = 2πr × (θ / 360).',
    q2: 'كيف تحسب مساحة القطعة الدائرية؟',
    a2: 'تساوي مساحة القطاع الدائري مطروحاً منها مساحة المثلث المركزي المتساوي الساقين.',
    q3: 'ما هو الوتر في الدائرة؟',
    a3: 'القطعة المستقيمة الواصلة بين طرفي القوس: c = 2r × sin(θ / 2).'
  }
};

export default function CircleSector() {
  const { lang } = useI18n();
  const dict = localDict[lang as keyof typeof localDict] || localDict.en;

  const [radius, setRadius] = useUrlState<number>('r', 10);
  const [angleDeg, setAngleDeg] = useUrlState<number>('deg', 90);

  const result = useMemo(() => {
    return calculateCircleSector(Number(radius) || 0, Number(angleDeg) || 0);
  }, [radius, angleDeg]);

  const handleUpdate = () => {
    trackCalculation('circle_sector', { radius, angleDeg });
  };

  // SVG Sector Arc Path generator
  const sectorSvgPath = useMemo(() => {
    if (!result) return null;
    const cx = 140;
    const cy = 130;
    const r = 90; // Visual SVG radius
    const aDeg = Math.min(359.99, Math.max(1, result.centralAngleDeg));
    const aRad = (aDeg * Math.PI) / 180;

    // Start angle at -90 deg (top), sweep clockwise
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + aRad;

    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);

    const largeArcFlag = aDeg > 180 ? 1 : 0;

    // SVG path for filled sector pie
    const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

    return {
      pathData,
      cx,
      cy,
      r,
      x1,
      y1,
      x2,
      y2
    };
  }, [result]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8" dir={lang === 'he' || lang === 'ar' ? 'rtl' : 'ltr'}>
      <SEO
        title={dict.title}
        description={dict.description}
        canonicalUrl={`/${lang}/calculators/circle-sector`}
      />

      {/* Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100 shadow-xs">
              <PieChart className="w-6 h-6" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              {dict.radiusLabel}
            </label>
            <input
              type="number"
              min="0.01"
              step="any"
              value={radius}
              onChange={(e) => { setRadius(Number(e.target.value)); handleUpdate(); }}
              className="w-full h-12 px-4 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900 text-base"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              {dict.angleLabel}
            </label>
            <input
              type="number"
              min="0.1"
              max="360"
              step="any"
              value={angleDeg}
              onChange={(e) => { setAngleDeg(Number(e.target.value)); handleUpdate(); }}
              className="w-full h-12 px-4 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900 text-base"
            />
          </div>
        </div>
      </div>

      {result ? (
        <>
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-teal-900 text-white p-6 rounded-3xl shadow-sm border border-teal-800 flex flex-col justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-200">
                {dict.arcLengthCard}
              </span>
              <div className="my-3">
                <span className="text-3xl font-black font-display tracking-tight text-white">
                  <CountUp value={result.arcLength} decimals={2} />
                </span>
              </div>
              <span className="text-xs text-teal-300 font-medium">
                s = r × θ ({result.centralAngleRad} rad)
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                {dict.sectorAreaCard}
              </span>
              <div className="my-3">
                <span className="text-3xl font-black font-display tracking-tight text-teal-700">
                  <CountUp value={result.sectorArea} decimals={2} />
                </span>
              </div>
              <span className="text-xs text-stone-400 font-medium">
                Area = ½ × r² × θ
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                {dict.chordCard}
              </span>
              <div className="my-3">
                <span className="text-3xl font-black font-display tracking-tight text-stone-900">
                  <CountUp value={result.chordLength} decimals={2} />
                </span>
              </div>
              <span className="text-xs text-stone-400 font-medium">
                c = 2r × sin(θ/2)
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                {dict.segmentCard}
              </span>
              <div className="my-3">
                <span className="text-3xl font-black font-display tracking-tight text-stone-800">
                  <CountUp value={result.segmentArea} decimals={2} />
                </span>
              </div>
              <span className="text-xs text-stone-400 font-medium">
                A_sector - A_triangle
              </span>
            </div>
          </div>

          {/* Visualization & Steps */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-stone-200 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-600" />
                  <h2 className="text-lg font-bold text-stone-900">{dict.diagramTitle}</h2>
                </div>
                <span className="px-3 py-1 bg-teal-50 text-teal-800 font-mono font-bold text-xs rounded-full border border-teal-200">
                  θ = {result.centralAngleDeg}° ({result.centralAngleRad} rad)
                </span>
              </div>

              {sectorSvgPath && (
                <div className="w-full h-56 bg-stone-50 rounded-2xl flex items-center justify-center p-2 border border-stone-100">
                  <svg viewBox="0 0 280 240" className="w-full h-full max-h-52">
                    {/* Full dashed circle background */}
                    <circle
                      cx={sectorSvgPath.cx}
                      cy={sectorSvgPath.cy}
                      r={sectorSvgPath.r}
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                    {/* Filled Sector Pie */}
                    <path
                      d={sectorSvgPath.pathData}
                      fill="rgba(0, 106, 90, 0.15)"
                      stroke="#006a5a"
                      strokeWidth="2.5"
                    />
                    {/* Chord dashed line connecting endpoints */}
                    <line
                      x1={sectorSvgPath.x1}
                      y1={sectorSvgPath.y1}
                      x2={sectorSvgPath.x2}
                      y2={sectorSvgPath.y2}
                      stroke="#e07a5f"
                      strokeWidth="2"
                      strokeDasharray="3 3"
                    />
                    {/* Center Point */}
                    <circle cx={sectorSvgPath.cx} cy={sectorSvgPath.cy} r="4" fill="#006a5a" />
                    <text x={sectorSvgPath.cx - 15} y={sectorSvgPath.cy + 18} className="text-[11px] font-bold fill-stone-600">O (Center)</text>
                    {/* Chord label */}
                    <text x={(sectorSvgPath.x1 + sectorSvgPath.x2) / 2 + 5} y={(sectorSvgPath.y1 + sectorSvgPath.y2) / 2} className="text-[10px] font-bold fill-orange-700">Chord c</text>
                  </svg>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-stone-100 flex flex-wrap justify-between text-xs text-stone-500 font-medium">
                <span>Perimeter of Sector (Arc + 2r): <strong className="text-stone-800 font-mono">{result.perimeter}</strong></span>
                <span>Central Angle Radians: <strong className="text-teal-700 font-mono">{result.centralAngleRad} rad</strong></span>
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
                  <ShinyText text="Radian & Degree Precision" />
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="p-6 bg-amber-50 text-amber-900 rounded-3xl border border-amber-200 font-medium text-sm flex items-center gap-3">
          <Circle className="w-5 h-5 text-amber-700 shrink-0" />
          Invalid radius or angle. Radius must be &gt; 0 and angle must be between 0.1° and 360°.
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
