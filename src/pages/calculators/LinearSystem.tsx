import React, { useMemo } from 'react';
import { useUrlState } from '../../hooks/useUrlState';
import { useI18n } from '../../contexts/i18n';
import SEO from '../../components/SEO';
import CountUp from '../../components/CountUp';
import ShinyText from '../../components/ShinyText';
import { solveSystem2x2 } from '../../lib/math/algebraCs';
import { trackCalculation } from '../../lib/analytics';
import {
  Layers,
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
    title: 'System of Linear Equations Solver (2x2)',
    subtitle: 'Cramer’s Rule, Determinants, Intersection Point & Line Graph',
    description: 'Solve 2x2 systems of simultaneous linear equations step-by-step using Cramer’s rule (D, Dx, Dy). Visualizes both linear equations and their intersection point.',
    eq1Title: 'Equation 1: a₁x + b₁y = c₁',
    eq2Title: 'Equation 2: a₂x + b₂y = c₂',
    solTitle: 'Intersection Solution (x, y)',
    detTitle: 'Main Determinant (D)',
    solTypeUnique: 'Unique Intersection Point (Consistent)',
    solTypeInfinite: 'Infinitely Many Solutions (Coincident Lines)',
    solTypeInconsistent: 'No Solution (Parallel Lines)',
    stepByStep: 'Cramer’s Rule Step-by-Step Derivation',
    graphTitle: 'Geometric Lines & Intersection Graph',
    faqTitle: 'Frequently Asked Questions: Systems of Linear Equations',
    q1: 'What is Cramer’s Rule for a 2x2 system?',
    a1: 'Cramer’s rule solves linear systems using determinants: D = a₁b₂ - a₂b₁, Dx = c₁b₂ - c₂b₁, and Dy = a₁c₂ - a₂c₁. When D ≠ 0, x = Dx / D and y = Dy / D.',
    q2: 'What happens when determinant D equals zero?',
    a2: 'If D = 0 and both Dx = 0 and Dy = 0, the two lines are identical and there are infinitely many solutions. If D = 0 but either Dx or Dy is non-zero, the lines are parallel and no solution exists.',
    q3: 'Can this be used for business break-even or supply/demand?',
    a3: 'Yes, supply and demand curves, cost vs. revenue break-even points, and mixture problems are common real-world examples of 2x2 linear systems.'
  },
  he: {
    title: 'מחשבון מערכת משוואות לינאריות (2 משוואות בשני נעלמים)',
    subtitle: 'פתרון בשיטת קרמר (דטרמיננטה), נקודת חיתוך ושרטוט גרפי',
    description: 'פתרון מערכת שתי משוואות בשני נעלמים צעד אחר צעד באמצעות דטרמיננטות וכלל קרמר, מציאת נקודת החיתוך ותרשים גרפי של שני הישרים.',
    eq1Title: 'משוואה ראשונה: a₁x + b₁y = c₁',
    eq2Title: 'משוואה שנייה: a₂x + b₂y = c₂',
    solTitle: 'פתרון המערכת (נקודת חיתוך)',
    detTitle: 'דטרמיננטה ראשית (D)',
    solTypeUnique: 'פתרון יחיד (נקודת חיתוך ברורה)',
    solTypeInfinite: 'אינסוף פתרונות (ישרים מתלכדים)',
    solTypeInconsistent: 'אין פתרון (ישרים מקבילים)',
    stepByStep: 'שלבי הפתרון לפי כלל קרמר (Cramer)',
    graphTitle: 'שרטוט גיאומטרי של שני הישרים והחיתוך',
    faqTitle: 'שאלות ותשובות נפוצות: מערכת משוואות לינאריות',
    q1: 'מהו כלל קרמר (Cramer’s Rule) לפתרון מערכת משוואות?',
    a1: 'כלל קרמר משתמש בדטרמיננטות למציאת הנעלמים: D = a₁b₂ - a₂b₁, Dx = c₁b₂ - c₂b₁, Dy = a₁c₂ - a₂c₁. כאשר D ≠ 0, x = Dx / D ו-y = Dy / D.',
    q2: 'מה קורה כאשר הדטרמיננטה הראשית D שווה לאפס?',
    a2: 'אם D = 0 וגם Dx=0 ו-Dy=0, הישרים מתלכדים ויש אינסוף פתרונות. אם D = 0 אך המונים שונים מאפס, הישרים מקבילים ואין פתרון.',
    q3: 'איפה משתמשים במערכת משוואות בחיי היומיום?',
    a3: 'במציאת שיווי משקל כלכלי בין היצע וביקוש, נקודת איזון (Break-Even) בין הוצאות והכנסות, ובעיות תנועה וריכוזים.'
  },
  es: {
    title: 'Calculadora de Sistemas de Ecuaciones Lineales (2x2)',
    subtitle: 'Regla de Cramer, Determinantes y Punto de Intersección',
    description: 'Resuelve sistemas 2x2 paso a paso con la regla de Cramer y visualiza la intersección gráfica de las dos rectas.',
    eq1Title: 'Ecuación 1: a₁x + b₁y = c₁',
    eq2Title: 'Ecuación 2: a₂x + b₂y = c₂',
    solTitle: 'Solución del Sistema (x, y)',
    detTitle: 'Determinante D',
    solTypeUnique: 'Solución Única',
    solTypeInfinite: 'Infinitas Soluciones',
    solTypeInconsistent: 'Sin Solución (Paralelas)',
    stepByStep: 'Regla de Cramer Paso a Paso',
    graphTitle: 'Gráfica de Rectas e Intersección',
    faqTitle: 'Preguntas Frecuentes: Sistemas Lineales',
    q1: '¿Qué es la regla de Cramer?',
    a1: 'Resuelve variables mediante cocientes de determinantes: x = Dx / D, y = Dy / D.',
    q2: '¿Qué pasa si D = 0?',
    a2: 'El sistema no tiene solución única (es incompatible o indeterminado).',
    q3: '¿Para qué sirve?',
    a3: 'Punto de equilibrio en economía, cruce de trayectorias, etc.'
  },
  fr: {
    title: 'Résolveur de Systèmes d’Équations Linéaires (2x2)',
    subtitle: 'Règle de Cramer, Déterminants et Point d’Intersection',
    description: 'Résolvez les systèmes à 2 inconnues étape par étape avec la méthode des déterminants de Cramer et graphe des droites.',
    eq1Title: 'Équation 1 : a₁x + b₁y = c₁',
    eq2Title: 'Équation 2 : a₂x + b₂y = c₂',
    solTitle: 'Point d’intersection (x, y)',
    detTitle: 'Déterminant D',
    solTypeUnique: 'Solution Unique',
    solTypeInfinite: 'Infinité de solutions',
    solTypeInconsistent: 'Aucune solution (Parallèles)',
    stepByStep: 'Méthode de Cramer détaillée',
    graphTitle: 'Représentation Graphique des Droites',
    faqTitle: 'Questions Fréquentes : Systèmes Linéaires',
    q1: 'Qu’est-ce que la règle de Cramer ?',
    a1: 'Une formule matricielle où x = Dx / D et y = Dy / D.',
    q2: 'Que signifie D = 0 ?',
    a2: 'Le système est soit impossible (droites parallèles), soit indéterminé.',
    q3: 'Quelles applications ?',
    a3: 'Point mort économique, offre et demande.'
  },
  ar: {
    title: 'حاسبة حل نظام المعادلات الخطية (2x2)',
    subtitle: 'طريقة كرامر، المحددات، ونقطة التقاطع بين المستقيمين مع الرسم',
    description: 'حل نظام من معادلتين خطيتين بمجهولين بالخطوات باستخدام محددات كرامر مع الرسم البياني التفاعلي.',
    eq1Title: 'المعادلة الأولى: a₁x + b₁y = c₁',
    eq2Title: 'المعادلة الثانية: a₂x + b₂y = c₂',
    solTitle: 'نقطة التقاطع (س, ص)',
    detTitle: 'المحدد الرئيسي (D)',
    solTypeUnique: 'حل وحيد (نقطة تقاطع)',
    solTypeInfinite: 'عدد لا نهائي من الحلول (مستقيمان متطابقان)',
    solTypeInconsistent: 'لا يوجد حل (مستقيمان متوازيان)',
    stepByStep: 'خطوات الحل بقاعدة كرامر',
    graphTitle: 'التمثيل البياني للمستقيمين',
    faqTitle: 'الأسئلة الشائعة حول أنظمة المعادلات',
    q1: 'ما هي قاعدة كرامر؟',
    a1: 'طريقة لحل المعادلات الخطية عبر قسمة المحددات س = Dx / D و ص = Dy / D.',
    q2: 'ماذا يعني أن المحدد D يساوي صفراً؟',
    a2: 'المستقيمان متوازيان (لا يوجد حل) أو متطابقان (حلول لا نهائية).',
    q3: 'ما هي تطبيقاتها؟',
    a3: 'نقطة التعادل الاقتصادي، تقاطع المسارات، وتوازن السوق.'
  }
};

export default function LinearSystem() {
  const { lang } = useI18n();
  const dict = localDict[lang as keyof typeof localDict] || localDict.en;

  const [a1, setA1] = useUrlState<number>('a1', 2);
  const [b1, setB1] = useUrlState<number>('b1', 1);
  const [c1, setC1] = useUrlState<number>('c1', 5);

  const [a2, setA2] = useUrlState<number>('a2', 1);
  const [b2, setB2] = useUrlState<number>('b2', -1);
  const [c2, setC2] = useUrlState<number>('c2', 1);

  const result = useMemo(() => {
    return solveSystem2x2(
      Number(a1) || 0, Number(b1) || 0, Number(c1) || 0,
      Number(a2) || 0, Number(b2) || 0, Number(c2) || 0
    );
  }, [a1, b1, c1, a2, b2, c2]);

  const handleUpdate = () => {
    trackCalculation('linear_system_2x2', { a1, b1, c1, a2, b2, c2 });
  };

  // Lines Graph Data
  const chartData = useMemo(() => {
    const centerX = result.x !== undefined ? result.x : 0;
    const range = 6;
    const labels: string[] = [];
    const line1Data: (number | null)[] = [];
    const line2Data: (number | null)[] = [];

    const numA1 = Number(a1) || 0;
    const numB1 = Number(b1) || 0;
    const numC1 = Number(c1) || 0;

    const numA2 = Number(a2) || 0;
    const numB2 = Number(b2) || 0;
    const numC2 = Number(c2) || 0;

    for (let x = centerX - range; x <= centerX + range + 0.001; x += 0.5) {
      const rx = Number(x.toFixed(1));
      labels.push(rx.toString());

      // Line 1: y = (c1 - a1*x) / b1
      if (Math.abs(numB1) > 1e-6) {
        line1Data.push(Number(((numC1 - numA1 * rx) / numB1).toFixed(2)));
      } else {
        line1Data.push(null);
      }

      // Line 2: y = (c2 - a2*x) / b2
      if (Math.abs(numB2) > 1e-6) {
        line2Data.push(Number(((numC2 - numA2 * rx) / numB2).toFixed(2)));
      } else {
        line2Data.push(null);
      }
    }

    return {
      labels,
      datasets: [
        {
          label: `Line 1: ${numA1}x + ${numB1}y = ${numC1}`,
          data: line1Data,
          borderColor: '#006a5a',
          backgroundColor: 'transparent',
          borderWidth: 2.5,
          tension: 0,
          pointRadius: 0
        },
        {
          label: `Line 2: ${numA2}x + ${numB2}y = ${numC2}`,
          data: line2Data,
          borderColor: '#e07a5f',
          backgroundColor: 'transparent',
          borderWidth: 2.5,
          tension: 0,
          pointRadius: 0
        }
      ]
    };
  }, [a1, b1, c1, a2, b2, c2, result]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8" dir={lang === 'he' || lang === 'ar' ? 'rtl' : 'ltr'}>
      <SEO
        title={dict.title}
        description={dict.description}
        canonicalUrl={`/${lang}/calculators/linear-system`}
      />

      {/* Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100 shadow-xs">
              <Layers className="w-6 h-6" />
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

          <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${
            result.solutionType === 'unique'
              ? 'bg-teal-50 text-teal-800 border-teal-200'
              : result.solutionType === 'infinite'
              ? 'bg-blue-50 text-blue-800 border-blue-200'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}>
            {result.solutionType === 'unique'
              ? dict.solTypeUnique
              : result.solutionType === 'infinite'
              ? dict.solTypeInfinite
              : dict.solTypeInconsistent}
          </span>
        </div>

        {/* Equations Input Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Eq 1 */}
          <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
            <h2 className="text-xs font-bold text-teal-800 uppercase tracking-wider mb-3">
              {dict.eq1Title}
            </h2>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-500 mb-1">a₁ (x)</label>
                <input
                  type="number"
                  value={a1}
                  onChange={(e) => { setA1(Number(e.target.value)); handleUpdate(); }}
                  className="w-full h-10 px-3 bg-white border border-stone-200 rounded-xl font-bold text-stone-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-stone-500 mb-1">b₁ (y)</label>
                <input
                  type="number"
                  value={b1}
                  onChange={(e) => { setB1(Number(e.target.value)); handleUpdate(); }}
                  className="w-full h-10 px-3 bg-white border border-stone-200 rounded-xl font-bold text-stone-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-stone-500 mb-1">c₁ (=)</label>
                <input
                  type="number"
                  value={c1}
                  onChange={(e) => { setC1(Number(e.target.value)); handleUpdate(); }}
                  className="w-full h-10 px-3 bg-white border border-stone-200 rounded-xl font-bold text-stone-900 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Eq 2 */}
          <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
            <h2 className="text-xs font-bold text-orange-800 uppercase tracking-wider mb-3">
              {dict.eq2Title}
            </h2>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-500 mb-1">a₂ (x)</label>
                <input
                  type="number"
                  value={a2}
                  onChange={(e) => { setA2(Number(e.target.value)); handleUpdate(); }}
                  className="w-full h-10 px-3 bg-white border border-stone-200 rounded-xl font-bold text-stone-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-stone-500 mb-1">b₂ (y)</label>
                <input
                  type="number"
                  value={b2}
                  onChange={(e) => { setB2(Number(e.target.value)); handleUpdate(); }}
                  className="w-full h-10 px-3 bg-white border border-stone-200 rounded-xl font-bold text-stone-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-stone-500 mb-1">c₂ (=)</label>
                <input
                  type="number"
                  value={c2}
                  onChange={(e) => { setC2(Number(e.target.value)); handleUpdate(); }}
                  className="w-full h-10 px-3 bg-white border border-stone-200 rounded-xl font-bold text-stone-900 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-teal-900 text-white p-6 rounded-3xl shadow-sm flex flex-col justify-between border border-teal-800">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-200">
            {dict.solTitle}
          </span>
          <div className="my-3">
            {result.solutionType === 'unique' ? (
              <span className="text-3xl font-black font-display tracking-tight text-white">
                ({result.x}, {result.y})
              </span>
            ) : (
              <span className="text-xl font-bold text-teal-100">
                {result.solutionType === 'infinite' ? '∞ Solutions' : 'No Solution'}
              </span>
            )}
          </div>
          <span className="text-xs text-teal-300 font-medium">
            x = Dx/D, y = Dy/D
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            {dict.detTitle}
          </span>
          <div className="my-3">
            <span className="text-3xl font-black font-display tracking-tight text-teal-700">
              <CountUp value={result.determinantD} decimals={2} />
            </span>
          </div>
          <span className="text-xs text-stone-400 font-medium">
            (a₁b₂) - (a₂b₁)
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Determinant Dx
          </span>
          <div className="my-3">
            <span className="text-3xl font-black font-display tracking-tight text-stone-800">
              <CountUp value={result.determinantDx} decimals={2} />
            </span>
          </div>
          <span className="text-xs text-stone-400 font-medium">
            (c₁b₂) - (c₂b₁)
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Determinant Dy
          </span>
          <div className="my-3">
            <span className="text-3xl font-black font-display tracking-tight text-stone-800">
              <CountUp value={result.determinantDy} decimals={2} />
            </span>
          </div>
          <span className="text-xs text-stone-400 font-medium">
            (a₁c₂) - (a₂c₁)
          </span>
        </div>
      </div>

      {/* Graph & Steps Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-stone-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-600" />
              <h2 className="text-lg font-bold text-stone-900">{dict.graphTitle}</h2>
            </div>
            {result.solutionType === 'unique' && (
              <span className="text-xs font-mono font-bold bg-stone-100 text-stone-700 px-3 py-1 rounded-full">
                Intersection: ({result.x}, {result.y})
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
                  legend: { position: 'top' as const }
                },
                scales: {
                  x: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { maxTicksLimit: 11 } },
                  y: { grid: { color: 'rgba(0,0,0,0.05)' } }
                }
              }}
            />
          </div>
        </div>

        {/* Steps Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ArrowRightLeft className="w-5 h-5 text-teal-600" />
              <h2 className="text-base font-bold text-stone-900">{dict.stepByStep}</h2>
            </div>

            <div className="space-y-2.5 text-xs font-medium text-stone-600">
              {result.steps.map((st, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span className="font-mono text-stone-800 leading-relaxed">{st}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 text-center">
            <span className="text-xs text-stone-400 font-medium">
              <ShinyText text="Cramer's Rule for Linear Systems" />
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
