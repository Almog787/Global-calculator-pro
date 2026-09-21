import React, { useState, useMemo } from 'react';
import { useUrlState } from '../../hooks/useUrlState';
import { useI18n } from '../../contexts/i18n';
import SEO from '../../components/SEO';
import CountUp from '../../components/CountUp';
import ShinyText from '../../components/ShinyText';
import { calculateLinearRegression, DataPoint } from '../../lib/math/statistics';
import { trackCalculation } from '../../lib/analytics';
import {
  TrendingUp,
  HelpCircle,
  Sparkles,
  Plus,
  Trash2,
  FileSpreadsheet
} from 'lucide-react';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

const localDict = {
  en: {
    title: 'Linear Regression & Correlation Calculator',
    subtitle: 'Ordinary Least Squares Fit, Pearson Correlation (r), R-Squared & Trendline',
    description: 'Free online linear regression calculator. Enter bivariate data points (X, Y) to find the best fit line equation y = mx + b, Pearson correlation coefficient (r), coefficient of determination (R²), and scatter plot graph.',
    dataInputTitle: 'Bivariate Data Points (X, Y)',
    dataInputDesc: 'Enter paired values or paste from Excel / CSV',
    addPoint: 'Add Data Point',
    loadPreset: 'Load Sample Data',
    clearAll: 'Clear All',
    predictX: 'Predict Y for given X:',
    predictResult: 'Predicted Y value',
    regressionEq: 'Best-Fit Line Equation',
    pearsonR: 'Pearson Correlation (r)',
    rSquared: 'R-Squared (R²)',
    slopeLabel: 'Slope (m)',
    interceptLabel: 'Y-Intercept (b)',
    stdError: 'Standard Error (SE)',
    scatterTitle: 'Scatter Plot & Regression Trendline',
    strengthLabel: 'Correlation Strength',
    faqTitle: 'Frequently Asked Questions: Linear Regression & Correlation',
    q1: 'What does the Pearson correlation coefficient (r) indicate?',
    a1: 'The Pearson correlation coefficient (r) ranges between -1 and +1. +1 indicates a perfect positive linear relationship, -1 indicates a perfect negative relationship, and 0 indicates no linear correlation.',
    q2: 'What is the difference between r and R² (R-squared)?',
    a2: 'While r shows the direction and strength of the linear relationship, R² (coefficient of determination) represents the percentage of variation in Y that is directly explained by the variation in X.',
    q3: 'How does ordinary least squares (OLS) work?',
    a3: 'OLS calculates the best-fitting line by minimizing the sum of squared vertical distances (residuals) between the actual data points and the regression line.'
  },
  he: {
    title: 'מחשבון רגרסיה לינארית ומקדם מתאם (r / R²)',
    subtitle: 'מציאת קו מגמה בשיטת הריבועים הפחותים, מקדם פירסון וניבוי ערכים',
    description: 'מחשבון רגרסיה לינארית אונליין: הזן נקודות (X, Y) וקבל את משוואת קו המגמה y = mx + b, מקדם המתאם של פירסון r, שונות מוסברת R² ותרשים פיזור אינטראקטיבי.',
    dataInputTitle: 'נקודות נתונים (X, Y)',
    dataInputDesc: 'הזן זוגות ערכים או השתמש בדוגמה מוכנה',
    addPoint: 'הוסף נקודה',
    loadPreset: 'טען נתוני דוגמה',
    clearAll: 'נקה הכל',
    predictX: 'חיזוי וניבוי Y עבור ערך X נתון:',
    predictResult: 'ערך Y חזוי',
    regressionEq: 'משוואת קו המגמה הלינארי',
    pearsonR: 'מקדם מתאם פירסון (r)',
    rSquared: 'מקדם קביעה (R²)',
    slopeLabel: 'שיפוע הקו (m)',
    interceptLabel: 'נקודת חיתוך עם ציר Y (b)',
    stdError: 'שגיאת תקן (SE)',
    scatterTitle: 'תרשים פיזור (Scatter Plot) וקו רגרסיה',
    strengthLabel: 'עוצמת הקשר הלינארי',
    faqTitle: 'שאלות ותשובות נפוצות: רגרסיה לינארית ומתאם פירסון',
    q1: 'מה אומר מקדם המתאם של פירסון (r)?',
    a1: 'מקדם פירסון נע בין 1- ל-1+. ערך של 1+ מייצג קשר חיובי מושלם, 1- מייצג קשר שלילי מושלם, ו-0 מסמל היעדר קשר לינארי בין המשתנים.',
    q2: 'מה ההבדל בין r ל-R² (R-Squared)?',
    a2: 'בעוד ש-r מציין את כיוון ועוצמת הקשר, R² (אחוז השונות המוסברת) מציין איזה חלק מהשונות במשתנה Y מוסבר על ידי המשתנה X.',
    q3: 'כיצד עובדת שיטת הריבועים הפחותים (OLS)?',
    a3: 'השיטה מוצאת את הקו הישר המדויק שממזער את סכום ריבועי המרחקים (השאריות) בין הנקודות בפועל לבין הקו המנובא.'
  },
  es: {
    title: 'Calculadora de Regresión Lineal y Correlación',
    subtitle: 'Ajuste de Mínimos Cuadrados, Coeficiente de Pearson (r) y R²',
    description: 'Calcula la recta de regresión lineal y = mx + b, correlación de Pearson y gráfico de dispersión a partir de tus puntos de datos.',
    dataInputTitle: 'Puntos de Datos (X, Y)',
    dataInputDesc: 'Introduce pares de valores',
    addPoint: 'Añadir Punto',
    loadPreset: 'Cargar Muestra',
    clearAll: 'Borrar Todo',
    predictX: 'Predecir Y para X:',
    predictResult: 'Y predicha',
    regressionEq: 'Ecuación de la Recta',
    pearsonR: 'Correlación de Pearson (r)',
    rSquared: 'Coeficiente R²',
    slopeLabel: 'Pendiente (m)',
    interceptLabel: 'Ordenada en el origen (b)',
    stdError: 'Error Estándar (SE)',
    scatterTitle: 'Gráfico de Dispersión y Tendencia',
    strengthLabel: 'Fuerza de la Correlación',
    faqTitle: 'Preguntas Frecuentes sobre Regresión Lineal',
    q1: '¿Qué indica el coeficiente de Pearson (r)?',
    a1: 'Mide la dirección y fuerza lineal entre -1 y +1.',
    q2: '¿Qué es R²?',
    a2: 'La proporción de varianza de Y explicada por X.',
    q3: '¿Cómo funciona mínimos cuadrados?',
    a3: 'Minimiza la suma de distancias residuales cuadradas.'
  },
  fr: {
    title: 'Calculateur de Régression Linéaire et Corrélation',
    subtitle: 'Moindres Carrés Ordinaires, Coefficient de Pearson (r) et R²',
    description: 'Trouvez l’équation de régression y = mx + b, le coefficient de corrélation r et visualisez le nuage de points.',
    dataInputTitle: 'Points de données (X, Y)',
    dataInputDesc: 'Saisissez les couples de valeurs',
    addPoint: 'Ajouter un point',
    loadPreset: 'Données d’exemple',
    clearAll: 'Tout effacer',
    predictX: 'Prédire Y pour X :',
    predictResult: 'Valeur Y prédite',
    regressionEq: 'Équation de régression',
    pearsonR: 'Corrélation de Pearson (r)',
    rSquared: 'Coefficient R²',
    slopeLabel: 'Pente (m)',
    interceptLabel: 'Ordonnée à l’origine (b)',
    stdError: 'Erreur standard (SE)',
    scatterTitle: 'Nuage de points & Droite d’ajustement',
    strengthLabel: 'Force de la corrélation',
    faqTitle: 'Questions Fréquentes : Régression Linéaire',
    q1: 'Que mesure le r de Pearson ?',
    a1: 'L’intensité et le sens de la liaison linéaire entre -1 et 1.',
    q2: 'Que représente R² ?',
    a2: 'Le pourcentage de variance expliquée par le modèle.',
    q3: 'Qu’est-ce que la méthode des moindres carrés ?',
    a3: 'Elle minimise la somme des carrés des écarts verticaux.'
  },
  ar: {
    title: 'حاسبة الانحدار الخطي ومعامل الارتباط',
    subtitle: 'طريقة المربعات الصغرى، معامل ارتباط بيرسون (r) ومعامل التحديد R²',
    description: 'حاسبة الانحدار الخطي التفاعلية لإيجاد معادلة الخط المستقيم y = mx + b ومعامل ارتباط بيرسون.',
    dataInputTitle: 'نقاط البيانات (X, Y)',
    dataInputDesc: 'أدخل أزواج القيم أو استخدم بيانات تجريبية',
    addPoint: 'إضافة نقطة',
    loadPreset: 'تحميل نموذج بيانات',
    clearAll: 'مسح الكل',
    predictX: 'التنبؤ بقيمة Y لقيمة X معينة:',
    predictResult: 'قيمة Y المتوقعة',
    regressionEq: 'معادلة خط الانحدار',
    pearsonR: 'معامل ارتباط بيرسون (r)',
    rSquared: 'معامل التحديد (R²)',
    slopeLabel: 'الميل (m)',
    interceptLabel: 'الجزء المقطوع من Y (b)',
    stdError: 'الخطأ المعياري',
    scatterTitle: 'مخطط التشتت وخط الانحدار',
    strengthLabel: 'قوة الارتباط',
    faqTitle: 'الأسئلة الشائعة حول الانحدار الخطي والارتباط',
    q1: 'ماذا يوضح معامل ارتباط بيرسون؟',
    a1: 'يقيس قوة واتجاه العلاقة الخطية ويتراوح بين -1 و +1.',
    q2: 'ما الفرق بين r و R²؟',
    a2: 'R² يوضح النسبة المئوية للتباين في Y التي يفسرها X.',
    q3: 'كيف تعمل طريقة المربعات الصغرى؟',
    a3: 'تقلل مجموع مربعات الفروق بين النقاط والخط.'
  }
};

const DEFAULT_POINTS: DataPoint[] = [
  { x: 1, y: 2.5 },
  { x: 2, y: 3.8 },
  { x: 3, y: 5.2 },
  { x: 4, y: 6.9 },
  { x: 5, y: 8.4 },
  { x: 6, y: 9.8 }
];

export default function LinearRegression() {
  const { lang } = useI18n();
  const dict = localDict[lang as keyof typeof localDict] || localDict.en;

  const [points, setPoints] = useState<DataPoint[]>(DEFAULT_POINTS);
  const [predictInputX, setPredictInputX] = useUrlState<number>('px', 7);

  const regression = useMemo(() => {
    return calculateLinearRegression(points);
  }, [points]);

  const predictedY = useMemo(() => {
    if (!regression) return null;
    return Number((regression.slope * Number(predictInputX) + regression.intercept).toFixed(4));
  }, [regression, predictInputX]);

  const handleAddPoint = () => {
    const nextX = points.length > 0 ? Math.max(...points.map(p => p.x)) + 1 : 1;
    const nextY = points.length > 0 && regression ? Number((regression.slope * nextX + regression.intercept).toFixed(1)) : 2;
    setPoints([...points, { x: nextX, y: nextY }]);
  };

  const handleUpdatePoint = (index: number, field: 'x' | 'y', val: number) => {
    const updated = [...points];
    updated[index] = { ...updated[index], [field]: val };
    setPoints(updated);
  };

  const handleRemovePoint = (index: number) => {
    if (points.length <= 2) return;
    setPoints(points.filter((_, i) => i !== index));
  };

  const handleResetSample = () => {
    setPoints(DEFAULT_POINTS);
    trackCalculation('linear_regression', { pointsCount: DEFAULT_POINTS.length });
  };

  // Scatter Chart Preparation
  const chartData = useMemo(() => {
    if (!regression || points.length === 0) {
      return { datasets: [] };
    }

    const scatterPoints = points.map(p => ({ x: p.x, y: p.y }));
    const xValues = points.map(p => p.x);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues, Number(predictInputX) || 0);

    const linePoints = [
      { x: minX, y: Number((regression.slope * minX + regression.intercept).toFixed(2)) },
      { x: maxX, y: Number((regression.slope * maxX + regression.intercept).toFixed(2)) }
    ];

    const datasets: any[] = [
      {
        type: 'scatter',
        label: 'Observed Data Points (X, Y)',
        data: scatterPoints,
        backgroundColor: '#006a5a',
        borderColor: '#004f43',
        pointRadius: 6,
        pointHoverRadius: 8
      },
      {
        type: 'line',
        label: 'Trendline: ' + regression.formula,
        data: linePoints,
        borderColor: '#e07a5f',
        borderWidth: 2.5,
        fill: false,
        pointRadius: 0
      }
    ];

    if (predictedY !== null) {
      datasets.push({
        type: 'scatter',
        label: 'Predicted Point',
        data: [{ x: Number(predictInputX), y: predictedY }],
        backgroundColor: '#e76f51',
        pointRadius: 8,
        pointStyle: 'rectRot'
      });
    }

    return { datasets };
  }, [points, regression, predictInputX, predictedY]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8" dir={lang === 'he' || lang === 'ar' ? 'rtl' : 'ltr'}>
      <SEO
        title={dict.title}
        description={dict.description}
        canonicalUrl={`/${lang}/calculators/linear-regression`}
      />

      {/* Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100 shadow-xs">
              <TrendingUp className="w-6 h-6" />
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

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetSample}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs sm:text-sm rounded-xl transition-all"
            >
              <FileSpreadsheet className="w-4 h-4" />
              {dict.loadPreset}
            </button>
          </div>
        </div>

        {/* Data Points Grid Editor */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              {dict.dataInputTitle} ({points.length})
            </h2>
            <button
              onClick={handleAddPoint}
              className="flex items-center gap-1 px-3 py-1.5 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-lg text-xs font-bold transition-all border border-teal-200/60"
            >
              <Plus className="w-3.5 h-3.5" />
              {dict.addPoint}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {points.map((pt, idx) => (
              <div key={idx} className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 flex flex-col gap-1.5 relative group">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-stone-400">#{idx + 1}</span>
                  {points.length > 2 && (
                    <button
                      onClick={() => handleRemovePoint(idx)}
                      className="text-stone-400 hover:text-red-600 transition-colors"
                      title="Remove point"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-stone-500">X:</span>
                  <input
                    type="number"
                    value={pt.x}
                    onChange={(e) => handleUpdatePoint(idx, 'x', Number(e.target.value))}
                    className="w-full h-8 px-2 bg-white border border-stone-200 rounded font-bold text-xs text-stone-900"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-stone-500">Y:</span>
                  <input
                    type="number"
                    value={pt.y}
                    onChange={(e) => handleUpdatePoint(idx, 'y', Number(e.target.value))}
                    className="w-full h-8 px-2 bg-white border border-stone-200 rounded font-bold text-xs text-stone-900"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Regression Results Summary */}
      {regression && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-teal-900 text-white p-6 rounded-3xl shadow-sm flex flex-col justify-between border border-teal-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-200">
              {dict.regressionEq}
            </span>
            <div className="my-3">
              <span className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white break-words">
                {regression.formula}
              </span>
            </div>
            <span className="text-xs text-teal-300 font-medium">
              m = {regression.slope}, b = {regression.intercept}
            </span>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              {dict.pearsonR}
            </span>
            <div className="my-3">
              <span className="text-3xl font-black font-display tracking-tight text-teal-700">
                <CountUp value={regression.correlationR} decimals={4} />
              </span>
            </div>
            <span className="text-xs text-stone-500 font-bold">
              {regression.relationshipStrength}
            </span>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              {dict.rSquared}
            </span>
            <div className="my-3">
              <span className="text-3xl font-black font-display tracking-tight text-stone-900">
                <CountUp value={Number((regression.rSquared * 100).toFixed(2))} decimals={2} suffix="%" />
              </span>
            </div>
            <span className="text-xs text-stone-400 font-medium">
              Explained variance: {regression.rSquared}
            </span>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              {dict.stdError}
            </span>
            <div className="my-3">
              <span className="text-3xl font-black font-display tracking-tight text-stone-800">
                <CountUp value={regression.standardError} decimals={4} />
              </span>
            </div>
            <span className="text-xs text-stone-400 font-medium">
              Residual standard error
            </span>
          </div>
        </div>
      )}

      {/* Scatter Plot Visualizer & Live Predictor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-stone-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-600" />
              <h2 className="text-lg font-bold text-stone-900">{dict.scatterTitle}</h2>
            </div>
            {regression && (
              <span className="text-xs font-bold bg-teal-50 text-teal-700 px-3 py-1 rounded-full border border-teal-100">
                R² = {regression.rSquared}
              </span>
            )}
          </div>

          <div className="h-72 sm:h-80 w-full">
            <Scatter
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' as const }
                },
                scales: {
                  x: {
                    title: { display: true, text: 'X Variable' },
                    grid: { color: 'rgba(0,0,0,0.05)' }
                  },
                  y: {
                    title: { display: true, text: 'Y Variable' },
                    grid: { color: 'rgba(0,0,0,0.05)' }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Prediction Engine Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-stone-900 mb-3">
              {dict.predictX}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">
                  Target X value
                </label>
                <input
                  type="number"
                  value={predictInputX}
                  onChange={(e) => setPredictInputX(Number(e.target.value))}
                  className="w-full h-11 px-3 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white text-sm"
                  placeholder="7"
                />
              </div>

              {predictedY !== null && (
                <div className="bg-teal-50/70 p-4 rounded-2xl border border-teal-100">
                  <span className="text-xs font-bold text-teal-900 block mb-1">
                    {dict.predictResult}
                  </span>
                  <span className="text-3xl font-black font-display text-teal-800 block">
                    <CountUp value={predictedY} decimals={4} />
                  </span>
                  <span className="text-[11px] text-teal-700/80 font-mono mt-1 block">
                    y = ({regression?.slope} × {predictInputX}) + {regression?.intercept}
                  </span>
                </div>
              )}
            </div>

            {regression && (
              <div className="mt-6 pt-4 border-t border-stone-100 text-xs space-y-2">
                <div className="flex justify-between text-stone-600">
                  <span>Mean of X (x̄):</span>
                  <span className="font-bold text-stone-900">{regression.meanX}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Mean of Y (ȳ):</span>
                  <span className="font-bold text-stone-900">{regression.meanY}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Sample Size (n):</span>
                  <span className="font-bold text-stone-900">{regression.n}</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 text-center">
            <span className="text-xs text-stone-400 font-medium">
              <ShinyText text="Ordinary Least Squares Regression" />
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
