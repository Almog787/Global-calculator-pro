import React, { useMemo } from 'react';
import { useUrlState } from '../../hooks/useUrlState';
import { useI18n } from '../../contexts/i18n';
import SEO from '../../components/SEO';
import CountUp from '../../components/CountUp';
import ShinyText from '../../components/ShinyText';
import { solveQuadratic } from '../../lib/math/algebraCs';
import { trackCalculation } from '../../lib/analytics';
import {
  FunctionSquare,
  HelpCircle,
  Sparkles,
  ArrowRightLeft,
  CheckCircle2
} from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const localDict = {
  en: {
    title: 'Quadratic Equation Solver (ax² + bx + c = 0)',
    subtitle: 'Find Real & Complex Roots, Discriminant, Vertex Apex & Parabola Graph',
    description: 'Free quadratic formula calculator. Solves quadratic equations step-by-step with real or complex numbers, discriminant analysis, factored form, and interactive parabola curve graph.',
    coefA: 'Coefficient a (x²)',
    coefADesc: 'Cannot be zero (a ≠ 0)',
    coefB: 'Coefficient b (x)',
    coefBDesc: 'Linear term multiplier',
    coefC: 'Constant c',
    coefCDesc: 'Y-intercept of parabola',
    rootsTitle: 'Equation Roots (Solutions)',
    discriminantTitle: 'Discriminant (Δ = b² - 4ac)',
    vertexTitle: 'Parabola Vertex (h, k)',
    axisTitle: 'Axis of Symmetry',
    twoRealRoots: 'Two Distinct Real Roots',
    oneRealRoot: 'One Real Repeated Root',
    complexRoots: 'Two Complex Conjugate Roots',
    opensUp: 'Parabola opens upward (Minimum vertex)',
    opensDown: 'Parabola opens downward (Maximum vertex)',
    stepByStep: 'Step-by-Step Mathematical Derivation',
    graphTitle: 'Parabola Curve & Roots Visualization',
    faqTitle: 'Frequently Asked Questions: Quadratic Equations',
    q1: 'What is the quadratic formula?',
    a1: 'The quadratic formula is x = (-b ± √(b² - 4ac)) / (2a). It provides the exact solutions for any quadratic equation in the form ax² + bx + c = 0.',
    q2: 'What does the discriminant (Δ) tell you?',
    a2: 'If Δ > 0, the equation has two distinct real roots. If Δ = 0, there is exactly one real root (a tangent touch at the vertex). If Δ < 0, there are two complex roots containing the imaginary unit i.',
    q3: 'How do you find the vertex of a parabola?',
    a3: 'The x-coordinate of the vertex is h = -b / (2a). Substituting this back into the equation yields the y-coordinate k = c - b² / (4a).'
  },
  he: {
    title: 'מחשבון משוואה ריבועית (ax² + bx + c = 0)',
    subtitle: 'פתרון משוואות ממעלה שנייה, שורשים ממשיים ומרוכבים, קודקוד ופרבולה',
    description: 'מחשבון משוואה ריבועית אונליין: חישוב שורשים, דלתא (דיסקרימיננטה), קודקוד הפרבולה, פירוק לגורמים, שלבי פתרון ותרשים פרבולה אינטראקטיבי.',
    coefA: 'מקדם a (של x²)',
    coefADesc: 'חייב להיות שונה מאפס (a ≠ 0)',
    coefB: 'מקדם b (של x)',
    coefBDesc: 'המקדם הלינארי',
    coefC: 'איבר חופשי c',
    coefCDesc: 'נקודת החיתוך עם ציר ה-Y',
    rootsTitle: 'פתרונות המשוואה (שורשים)',
    discriminantTitle: 'דיסקרימיננטה (דלתא Δ)',
    vertexTitle: 'קודקוד הפרבולה (x, y)',
    axisTitle: 'ציר הסימטריה',
    twoRealRoots: 'שני פתרונות ממשיים שונים',
    oneRealRoot: 'פתרון ממשי יחיד (שורש כפול)',
    complexRoots: 'שני פתרונות מרוכבים (מדומים)',
    opensUp: 'פרבולה צוחקת (מינימום בקודקוד)',
    opensDown: 'פרבולה בוכה (מקסימום בקודקוד)',
    stepByStep: 'שלבי הפתרון המתמטי המלאים',
    graphTitle: 'תרשים גרפי של הפרבולה והחיתוכים',
    faqTitle: 'שאלות ותשובות נפוצות: משוואות ריבועיות',
    q1: 'מהי נוסחת השורשים למשוואה ריבועית?',
    a1: 'נוסחת השורשים היא x = (-b ± √(b² - 4ac)) / (2a). היא מאפשרת למצוא את פתרונות המשוואה הריבועית בצורתה הסטנדרטית ax² + bx + c = 0.',
    q2: 'מה משמעות הדיסקרימיננטה (דלתא)?',
    a2: 'אם דלתא חיובית (Δ > 0) ישנם שני שורשים ממשיים. אם דלתא שווה לאפס ישנו שורש ממשי יחיד. אם דלתא שלילית (Δ < 0) השורשים מרוכבים וכוללים את היחידה המדומה i.',
    q3: 'איך מוצאים את נקודת הקודקוד של הפרבולה?',
    a3: 'שיעור ה-x של הקודקוד נקבע לפי x = -b / (2a). הצבת ערך זה במשוואה נותנת את שיעור ה-y של הקודקוד (נקודת המינימום או המקסימום).'
  },
  es: {
    title: 'Calculadora de Ecuaciones de Segundo Grado (ax² + bx + c = 0)',
    subtitle: 'Halla Raíces Reales y Complejas, Vértice de la Parábola y Gráfica',
    description: 'Resuelve ecuaciones cuadráticas paso a paso con la fórmula general, discriminante y gráfica interactiva.',
    coefA: 'Coeficiente a (x²)',
    coefADesc: 'a ≠ 0',
    coefB: 'Coeficiente b (x)',
    coefBDesc: 'Término lineal',
    coefC: 'Constante c',
    coefCDesc: 'Corte con eje Y',
    rootsTitle: 'Raíces de la Ecuación',
    discriminantTitle: 'Discriminante (Δ = b² - 4ac)',
    vertexTitle: 'Vértice de la Parábola',
    axisTitle: 'Eje de Simetría',
    twoRealRoots: 'Dos raíces reales distintas',
    oneRealRoot: 'Una raíz real doble',
    complexRoots: 'Dos raíces complejas conjugadas',
    opensUp: 'Parábola abierta hacia arriba',
    opensDown: 'Parábola abierta hacia abajo',
    stepByStep: 'Paso a Paso Detallado',
    graphTitle: 'Gráfica de la Función Cuadrática',
    faqTitle: 'Preguntas Frecuentes',
    q1: '¿Cuál es la fórmula cuadrática?',
    a1: 'x = (-b ± √(b² - 4ac)) / (2a).',
    q2: '¿Qué indica el discriminante?',
    a2: 'Positivo: dos raíces reales; Cero: una raíz doble; Negativo: raíces complejas.',
    q3: '¿Cómo hallar el vértice?',
    a3: 'x = -b / (2a).'
  },
  fr: {
    title: 'Résolveur d’Équations du Second Degré (ax² + bx + c = 0)',
    subtitle: 'Racines Réelles et Complexes, Discriminant Delta, Sommet et Parabole',
    description: 'Résolvez les équations du 2nd degré étape par étape avec calcul du discriminant Δ, sommet de la parabole et graphe.',
    coefA: 'Coefficient a (x²)',
    coefADesc: 'a ≠ 0',
    coefB: 'Coefficient b (x)',
    coefBDesc: 'Terme linéaire',
    coefC: 'Constante c',
    coefCDesc: 'Ordonnée à l’origine',
    rootsTitle: 'Solutions (Racines)',
    discriminantTitle: 'Discriminant (Δ = b² - 4ac)',
    vertexTitle: 'Sommet de la Parabole',
    axisTitle: 'Axe de Symétrie',
    twoRealRoots: 'Deux racines réelles distinctes',
    oneRealRoot: 'Une racine réelle double',
    complexRoots: 'Deux racines complexes conjuguées',
    opensUp: 'Parabole orientée vers le haut',
    opensDown: 'Parabole orientée vers le bas',
    stepByStep: 'Étapes de résolution',
    graphTitle: 'Tracé de la Parabole',
    faqTitle: 'Questions Fréquentes',
    q1: 'Quelle est la formule quadratique ?',
    a1: 'x = (-b ± √(b² - 4ac)) / (2a).',
    q2: 'Que signifie Delta ?',
    a2: 'Δ > 0 : deux racines réelles ; Δ = 0 : racine double ; Δ < 0 : racines complexes.',
    q3: 'Comment calculer le sommet ?',
    a3: 'x = -b / (2a).'
  },
  ar: {
    title: 'حاسبة المعادلات التربيعية (ax² + bx + c = 0)',
    subtitle: 'إيجاد الجذور الحقيقية والمركبة، المميز ورأس القطع المكافئ مع الرسم البياني',
    description: 'حاسبة حل المعادلة التربيعية بالخطوات بالتفصيل مع حساب المميز ورسم منحنى القطع المكافئ التفاعلي.',
    coefA: 'المعامل a (س²)',
    coefADesc: 'يجب ألا يساوي صفراً',
    coefB: 'المعامل b (س)',
    coefBDesc: 'معامل الحد الخطي',
    coefC: 'الحد الثابت c',
    coefCDesc: 'نقطة التقاطع مع محور الصادات',
    rootsTitle: 'جذور المعادلة (الحلول)',
    discriminantTitle: 'المميز (Δ = b² - 4ac)',
    vertexTitle: 'رأس القطع المكافئ',
    axisTitle: 'محور التماثل',
    twoRealRoots: 'جذران حقيقيان مختلفان',
    oneRealRoot: 'جذر حقيقي مكرر',
    complexRoots: 'جذران مركبان مترافقان',
    opensUp: 'مفتوح لأعلى (قيمة صغرى)',
    opensDown: 'مفتوح لأسفل (قيمة عظمى)',
    stepByStep: 'خطوات الحل بالتفصيل',
    graphTitle: 'التمثيل البياني للقطع المكافئ',
    faqTitle: 'الأسئلة الشائعة حول المعادلات التربيعية',
    q1: 'ما هو القانون العام لحل المعادلة التربيعية؟',
    a1: 'س = (-b ± √(b² - 4ac)) / (2a).',
    q2: 'ماذا يوضح المميز (دلتا)؟',
    a2: 'موجب: حلان حقيقيان، صفر: حل واحد، سالب: حلان مركبان.',
    q3: 'كيف يتم حساب رأس القطع المكافئ؟',
    a3: 'س = -b / (2a).'
  }
};

export default function QuadraticEquation() {
  const { lang } = useI18n();
  const dict = localDict[lang as keyof typeof localDict] || localDict.en;

  const [coefA, setCoefA] = useUrlState<number>('a', 1);
  const [coefB, setCoefB] = useUrlState<number>('b', -5);
  const [coefC, setCoefC] = useUrlState<number>('c', 6);

  const solution = useMemo(() => {
    const a = Number(coefA) || 1;
    const b = Number(coefB) || 0;
    const c = Number(coefC) || 0;
    return solveQuadratic(a, b, c);
  }, [coefA, coefB, coefC]);

  const handleInputChange = (field: 'a' | 'b' | 'c', val: number) => {
    if (field === 'a') setCoefA(val === 0 ? 1 : val);
    if (field === 'b') setCoefB(val);
    if (field === 'c') setCoefC(val);
    trackCalculation('quadratic_solver', { a: coefA, b: coefB, c: coefC });
  };

  // Parabola graph generation
  const chartData = useMemo(() => {
    if (!solution) return { labels: [], datasets: [] };

    const vx = solution.vertex.x;
    const range = 6;
    const step = 0.2;
    const labels: string[] = [];
    const values: number[] = [];

    for (let x = vx - range; x <= vx + range + 0.001; x += step) {
      const rx = Number(x.toFixed(1));
      labels.push(rx.toString());
      const y = solution.a * rx * rx + solution.b * rx + solution.c;
      values.push(Number(y.toFixed(2)));
    }

    return {
      labels,
      datasets: [
        {
          label: `f(x) = ${solution.a}x² + ${solution.b}x + ${solution.c}`,
          data: values,
          borderColor: '#006a5a',
          backgroundColor: 'rgba(0, 106, 90, 0.08)',
          fill: true,
          tension: 0.2,
          pointRadius: 0
        }
      ]
    };
  }, [solution]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8" dir={lang === 'he' || lang === 'ar' ? 'rtl' : 'ltr'}>
      <SEO
        title={dict.title}
        description={dict.description}
        canonicalUrl={`/${lang}/calculators/quadratic-equation`}
      />

      {/* Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100 shadow-xs">
              <FunctionSquare className="w-6 h-6" />
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

          {solution && (
            <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200/80">
              {solution.natureOfRoots === 'two_real'
                ? dict.twoRealRoots
                : solution.natureOfRoots === 'one_real'
                ? dict.oneRealRoot
                : dict.complexRoots}
            </span>
          )}
        </div>

        {/* Coefficients Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              {dict.coefA}
            </label>
            <input
              type="number"
              value={coefA}
              onChange={(e) => handleInputChange('a', Number(e.target.value))}
              className="w-full h-12 px-4 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white text-base transition-all"
              placeholder="1"
            />
            <span className="text-[11px] text-stone-400 font-medium mt-1 block">
              {dict.coefADesc}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              {dict.coefB}
            </label>
            <input
              type="number"
              value={coefB}
              onChange={(e) => handleInputChange('b', Number(e.target.value))}
              className="w-full h-12 px-4 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white text-base transition-all"
              placeholder="-5"
            />
            <span className="text-[11px] text-stone-400 font-medium mt-1 block">
              {dict.coefBDesc}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              {dict.coefC}
            </label>
            <input
              type="number"
              value={coefC}
              onChange={(e) => handleInputChange('c', Number(e.target.value))}
              className="w-full h-12 px-4 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white text-base transition-all"
              placeholder="6"
            />
            <span className="text-[11px] text-stone-400 font-medium mt-1 block">
              {dict.coefCDesc}
            </span>
          </div>
        </div>
      </div>

      {/* Solution Cards */}
      {solution && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-teal-900 text-white p-6 rounded-3xl shadow-sm flex flex-col justify-between border border-teal-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-200">
              {dict.rootsTitle}
            </span>
            <div className="my-3 space-y-1">
              <div className="text-xl sm:text-2xl font-black font-display text-white">
                x₁ = {solution.root1.text}
              </div>
              <div className="text-xl sm:text-2xl font-black font-display text-white">
                x₂ = {solution.root2.text}
              </div>
            </div>
            <span className="text-xs text-teal-300 font-medium">
              {solution.factoredForm || 'Standard quadratic form'}
            </span>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              {dict.discriminantTitle}
            </span>
            <div className="my-3">
              <span className="text-3xl font-black font-display tracking-tight text-teal-700">
                <CountUp value={solution.discriminant} decimals={2} />
              </span>
            </div>
            <span className="text-xs text-stone-500 font-bold">
              {solution.discriminant > 0 ? 'Δ > 0 (Two real)' : solution.discriminant === 0 ? 'Δ = 0 (One double root)' : 'Δ < 0 (Complex roots)'}
            </span>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              {dict.vertexTitle}
            </span>
            <div className="my-3">
              <span className="text-2xl font-black font-display tracking-tight text-stone-900">
                ({solution.vertex.x}, {solution.vertex.y})
              </span>
            </div>
            <span className="text-xs text-stone-400 font-medium">
              {solution.opensDirection === 'up' ? dict.opensUp : dict.opensDown}
            </span>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              {dict.axisTitle}
            </span>
            <div className="my-3">
              <span className="text-3xl font-black font-display tracking-tight text-stone-800">
                x = {solution.axisOfSymmetry}
              </span>
            </div>
            <span className="text-xs text-stone-400 font-medium">
              Y-Intercept: (0, {solution.yIntercept})
            </span>
          </div>
        </div>
      )}

      {/* Graph & Steps Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-stone-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-600" />
              <h2 className="text-lg font-bold text-stone-900">{dict.graphTitle}</h2>
            </div>
            {solution && (
              <span className="text-xs font-mono font-bold bg-stone-100 text-stone-700 px-3 py-1 rounded-full">
                Vertex: ({solution.vertex.x}, {solution.vertex.y})
              </span>
            )}
          </div>

          <div className="h-64 sm:h-72 w-full">
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false }
                },
                scales: {
                  x: {
                    grid: { color: 'rgba(0,0,0,0.05)' },
                    ticks: { maxTicksLimit: 11 }
                  },
                  y: {
                    grid: { color: 'rgba(0,0,0,0.05)' }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Mathematical Steps Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ArrowRightLeft className="w-5 h-5 text-teal-600" />
              <h2 className="text-base font-bold text-stone-900">{dict.stepByStep}</h2>
            </div>

            {solution && (
              <div className="space-y-2.5 text-xs font-medium text-stone-600">
                {solution.steps.map((st, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span className="font-mono text-stone-800 leading-relaxed">{st}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 text-center">
            <span className="text-xs text-stone-400 font-medium">
              <ShinyText text="Formula: x = (-b ± √(b²-4ac)) / 2a" />
            </span>
          </div>
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
