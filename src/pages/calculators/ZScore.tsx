import React, { useState, useMemo } from 'react';
import { useUrlState } from '../../hooks/useUrlState';
import { useI18n } from '../../contexts/i18n';
import SEO from '../../components/SEO';
import CountUp from '../../components/CountUp';
import ShinyText from '../../components/ShinyText';
import { calculateZScore, calculateInverseZScore, standardNormalPdf } from '../../lib/math/statistics';
import { trackCalculation } from '../../lib/analytics';
import {
  HelpCircle,
  Percent,
  Sliders,
  Sparkles,
  ArrowRightLeft
} from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

const localDict = {
  en: {
    title: 'Z-Score & Normal Distribution Calculator',
    subtitle: 'Calculate Standard Scores, Tail Probabilities, Percentiles & Bell Curve Visualizer',
    description: 'Free online Z-score calculator. Compute standard scores (Z), cumulative normal probabilities P(Z < z), two-tailed p-values, percentiles, and inverse raw scores with an interactive Gaussian bell curve.',
    modeStandard: 'Standard: Find Z & Probability from Raw Value (X)',
    modeInverse: 'Inverse: Find Raw Score (X) from Percentile / Area',
    rawScore: 'Raw Score (X)',
    rawScoreDesc: 'The observed value in your dataset',
    populationMean: 'Mean (μ)',
    populationMeanDesc: 'The arithmetic average of the distribution',
    stdDev: 'Standard Deviation (σ)',
    stdDevDesc: 'Must be greater than zero',
    percentileInput: 'Cumulative Probability / Percentile (%)',
    percentileInputDesc: 'Enter target percentile between 0.01% and 99.99%',
    calculateBtn: 'Calculate Z-Score',
    calculatedZ: 'Standard Z-Score',
    percentileRank: 'Percentile Rank',
    leftTail: 'P(Z < z) Left Tail Area',
    rightTail: 'P(Z > z) Right Tail Area',
    twoTail: 'P(-|z| < Z < |z|) Central Area',
    twoTailOuter: 'P(|Z| > |z|) Two-Tailed p-value',
    curveTitle: 'Standard Normal Distribution Bell Curve',
    interpretation: 'Interpretation of your Result',
    interpAbove: 'Your score is {z} standard deviations above the average.',
    interpBelow: 'Your score is {z} standard deviations below the average.',
    interpEqual: 'Your score is exactly equal to the distribution average (Z = 0).',
    interpHigherThan: 'Higher than {p}% of the population.',
    faqTitle: 'Frequently Asked Questions: Z-Scores & Normal Distribution',
    q1: 'What is a Z-score and what does it tell you?',
    a1: 'A Z-score (standard score) measures the exact number of standard deviations a data point (X) is from the mean (μ). A Z-score of 0 is dead-on average, +1.96 is top 2.5%, and negative values represent scores below the mean.',
    q2: 'What is the 68-95-99.7 Empirical Rule?',
    a2: 'In any normal distribution: ~68.2% of data falls within ±1σ of the mean (Z between -1 and +1), ~95.4% within ±2σ, and ~99.7% within ±3σ.',
    q3: 'How do you convert a Z-score back to a raw score?',
    a3: 'Using the inverse formula: X = μ + (Z × σ). If your mean is 100, standard deviation is 15, and Z is 2.0, then X = 100 + (2.0 × 15) = 130.'
  },
  he: {
    title: 'מחשבון ציון תקן Z והתפלגות נורמלית',
    subtitle: 'חישוב ציון תקן Z, הסתברויות זנב, אחוזונים ועקומת פעמון גאוס אינטראקטיבית',
    description: 'מחשבון Z-Score אונליין לחישוב ציון תקן, הסתברות מצטברת P(Z < z), מבחן דו-צדדי, אחוזון מיקום באוכלוסייה ותרשים התפלגות נורמלית אינטראקטיבי.',
    modeStandard: 'חישוב ישיר: מציאת Z והסתברות מתוך ערך (X)',
    modeInverse: 'חישוב הפוך: מציאת ערך (X) מתוך אחוזון או שטח',
    rawScore: 'ערך נתון לתצפית (X)',
    rawScoreDesc: 'הציון או התוצאה שנמדדה',
    populationMean: 'תוחלת / ממוצע (μ)',
    populationMeanDesc: 'הממוצע של האוכלוסייה או המדגם',
    stdDev: 'סטיית תקן (σ)',
    stdDevDesc: 'חייבת להיות גדולה מ-0',
    percentileInput: 'אחוזון מבוקש / הסתברות מצטברת (%)',
    percentileInputDesc: 'הזן ערך בין 0.01% ל-99.99%',
    calculateBtn: 'חשב ציון תקן Z',
    calculatedZ: 'ציון תקן Z מחושב',
    percentileRank: 'אחוזון מיקום באוכלוסייה',
    leftTail: 'הסתברות שמאלית P(Z < z)',
    rightTail: 'הסתברות ימנית P(Z > z)',
    twoTail: 'שטח מרכזי P(-|z| < Z < |z|)',
    twoTailOuter: 'מבחן דו-צדדי P(|Z| > |z|)',
    curveTitle: 'עקומת התפלגות נורמלית סטנדרטית (פעמון גאוס)',
    interpretation: 'משמעות התוצאה שלך',
    interpAbove: 'התוצאה שלך גבוהה ב-{z} סטיות תקן מעל הממוצע.',
    interpBelow: 'התוצאה שלך נמוכה ב-{z} סטיות תקן מתחת לממוצע.',
    interpEqual: 'התוצאה שלך זהה בדיוק לממוצע האוכלוסייה (Z = 0).',
    interpHigherThan: 'גבוה יותר מ-{p}% מכלל האוכלוסייה.',
    faqTitle: 'שאלות ותשובות נפוצות: ציוני תקן והתפלגות נורמלית',
    q1: 'מה זה ציון תקן Z ומה הוא מודד?',
    a1: 'ציון תקן Z מודד כמה סטיות תקן ערך מסוים (X) מרוחק מהממוצע (μ). ציון 0 מסמל ממוצע מדויק, ציון 1.96 ומעלה מייצג את ה-2.5% העליונים, וציון שלילי מייצג ערך מתחת לממוצע.',
    q2: 'מהו כלל האצבע 68-95-99.7 בסטטיסטיקה?',
    a2: 'בהתפלגות נורמלית: כ-68.2% מהתצפיות נופלות בטווח של סטיית תקן אחת מהממוצע (Z בין 1- ל-1+), כ-95.4% בטווח של שתי סטיות תקן, וכ-99.7% בטווח של 3 סטיות תקן.',
    q3: 'איך מחשבים ערך מקורי מתוך ציון Z?',
    a3: 'בעזרת הנוסחה ההפוכה: X = μ + (Z × σ). אם הממוצע הוא 100, סטיית התקן היא 15 וציון ה-Z הוא 2, הערך המקורי הוא 100 + (2 × 15) = 130 (למשל במבחני IQ).'
  },
  es: {
    title: 'Calculadora de Puntuación Z y Distribución Normal',
    subtitle: 'Calcula Puntuaciones Estándar Z, Probabilidades y Campana de Gauss',
    description: 'Calculadora de Z-Score online. Convierte valores brutos a puntuaciones estándar Z, calcula percentiles, probabilidades acumuladas e inversas.',
    modeStandard: 'Estándar: Hallar Z y Probabilidad desde X',
    modeInverse: 'Inverso: Hallar X desde Percentil',
    rawScore: 'Valor Bruto (X)',
    rawScoreDesc: 'El valor observado en tu muestra',
    populationMean: 'Media (μ)',
    populationMeanDesc: 'El promedio de la población',
    stdDev: 'Desviación Estándar (σ)',
    stdDevDesc: 'Debe ser mayor que cero',
    percentileInput: 'Percentil / Probabilidad (%)',
    percentileInputDesc: 'Entre 0.01% y 99.99%',
    calculateBtn: 'Calcular Z-Score',
    calculatedZ: 'Puntuación Z',
    percentileRank: 'Rango Percentil',
    leftTail: 'P(Z < z) Cola Izquierda',
    rightTail: 'P(Z > z) Cola Derecha',
    twoTail: 'Área Central P(-|z| < Z < |z|)',
    twoTailOuter: 'Valor p de Dos Colas P(|Z| > |z|)',
    curveTitle: 'Campana de Distribución Normal Estándar',
    interpretation: 'Interpretación del Resultado',
    interpAbove: 'Tu valor está {z} desviaciones estándar por encima de la media.',
    interpBelow: 'Tu valor está {z} desviaciones estándar por debajo de la media.',
    interpEqual: 'Tu valor es exactamente igual a la media (Z = 0).',
    interpHigherThan: 'Superior al {p}% de la población.',
    faqTitle: 'Preguntas Frecuentes: Z-Score y Distribución Normal',
    q1: '¿Qué es una puntuación Z?',
    a1: 'Es una medida estadística que indica cuántas desviaciones estándar dista un elemento de la media.',
    q2: '¿Qué es la regla empírica 68-95-99.7?',
    a2: 'El 68.2% de los datos se ubica a ±1σ, el 95.4% a ±2σ, y el 99.7% a ±3σ.',
    q3: '¿Cómo convertir Z a valor bruto?',
    a3: 'X = μ + (Z × σ).'
  },
  fr: {
    title: 'Calculateur de Score Z et Distribution Normale',
    subtitle: 'Score Centré Réduit, Probabilités et Courbe de Gauss',
    description: 'Calculez le score Z standardisé, les percentiles et les probabilités cumulées sous la loi normale gaussienne.',
    modeStandard: 'Standard : Trouver Z depuis X',
    modeInverse: 'Inverse : Trouver X depuis le percentile',
    rawScore: 'Valeur brute (X)',
    rawScoreDesc: 'La valeur observée',
    populationMean: 'Moyenne (μ)',
    populationMeanDesc: 'La moyenne de la distribution',
    stdDev: 'Écart-type (σ)',
    stdDevDesc: 'Doit être supérieur à zéro',
    percentileInput: 'Percentile ciblé (%)',
    percentileInputDesc: 'Entre 0.01% et 99.99%',
    calculateBtn: 'Calculer le score Z',
    calculatedZ: 'Score Z standardisé',
    percentileRank: 'Rang percentile',
    leftTail: 'P(Z < z) Queue gauche',
    rightTail: 'P(Z > z) Queue droite',
    twoTail: 'Zone centrale P(-|z| < Z < |z|)',
    twoTailOuter: 'P-valeur bilatérale P(|Z| > |z|)',
    curveTitle: 'Courbe en cloche de la distribution normale',
    interpretation: 'Interprétation',
    interpAbove: 'Votre valeur est à {z} écarts-types au-dessus de la moyenne.',
    interpBelow: 'Votre valeur est à {z} écarts-types en-dessous de la moyenne.',
    interpEqual: 'Votre valeur est égale à la moyenne (Z = 0).',
    interpHigherThan: 'Supérieur à {p}% de la population.',
    faqTitle: 'Questions Fréquentes sur le score Z',
    q1: 'Qu’est-ce qu’un score Z ?',
    a1: 'Il mesure le nombre d’écarts-types séparant une valeur de la moyenne.',
    q2: 'Quelle est la règle empirique 68-95-99.7 ?',
    a2: '68% des données sont à ±1σ, 95% à ±2σ et 99.7% à ±3σ.',
    q3: 'Comment retrouver la valeur brute ?',
    a3: 'X = μ + (Z × σ).'
  },
  ar: {
    title: 'حاسبة الدرجة المعيارية Z والتوزيع الطبيعي',
    subtitle: 'حساب درجات Z، الاحتمالات التراكمية، الرتب المئينية ومنحنى غاوس',
    description: 'حاسبة Z-Score أونلاين لحساب الدرجة المعيارية Z، الاحتمال التراكمي ومخطط التوزيع الطبيعي التفاعلي.',
    modeStandard: 'مباشر: إيجاد Z من القيمة الأصلية (X)',
    modeInverse: 'عكسي: إيجاد X من الرتبة المئينية',
    rawScore: 'القيمة المقاسة (X)',
    rawScoreDesc: 'القيمة المرصودة في العينة',
    populationMean: 'المتوسط الحسابي (μ)',
    populationMeanDesc: 'متوسط المجتمع الإحصائي',
    stdDev: 'الانحراف المعياري (σ)',
    stdDevDesc: 'يجب أن يكون أكبر من الصفر',
    percentileInput: 'الرتبة المئينية المطلوبة (%)',
    percentileInputDesc: 'بين 0.01% و 99.99%',
    calculateBtn: 'احسب الدرجة المعيارية Z',
    calculatedZ: 'درجة Z المعيارية',
    percentileRank: 'الرتبة المئينية',
    leftTail: 'P(Z < z) الاحتمال الأيسر',
    rightTail: 'P(Z > z) الاحتمال الأيمن',
    twoTail: 'المنطقة المركزية',
    twoTailOuter: 'القيمة الاحتمالية الثنائية',
    curveTitle: 'منحنى التوزيع الطبيعي القياسي (منحنى الجرس)',
    interpretation: 'تفسير النتيجة',
    interpAbove: 'درجتك أعلى بمقدار {z} انحراف معياري عن المتوسط.',
    interpBelow: 'درجتك أقل بمقدار {z} انحراف معياري عن المتوسط.',
    interpEqual: 'درجتك مطابقة تماماً لمتوسط المجتمع (Z = 0).',
    interpHigherThan: 'أعلى من {p}% من المجتمع.',
    faqTitle: 'الأسئلة الشائعة حول الدرجة المعيارية والتوزيع الطبيعي',
    q1: 'ما هي الدرجة المعيارية Z؟',
    a1: 'مقياس إحصائي يوضح عدد الانحرافات المعيارية التي تبعدها قيمة معينة عن المتوسط.',
    q2: 'ما هي القاعدة التجريبية 68-95-99.7؟',
    a2: '68% من البيانات تقع ضمن انحراف معياري واحد، و95% ضمن انحرافين، و99.7% ضمن 3 انحرافات.',
    q3: 'كيفية استرجاع القيمة الأصلية؟',
    a3: 'X = μ + (Z × σ).'
  }
};

export default function ZScore() {
  const { lang } = useI18n();
  const dict = localDict[lang as keyof typeof localDict] || localDict.en;

  const [mode, setMode] = useUrlState<'standard' | 'inverse'>('mode', 'standard');
  const [rawX, setRawX] = useUrlState<number>('x', 115);
  const [mean, setMean] = useUrlState<number>('mean', 100);
  const [stdDev, setStdDev] = useUrlState<number>('sd', 15);
  const [targetPercentile, setTargetPercentile] = useUrlState<number>('pct', 84.13);

  const [hasCalculated, setHasCalculated] = useState(true);

  // Compute Results
  const result = useMemo(() => {
    const validMean = Number(mean) || 0;
    const validSd = Math.max(0.0001, Number(stdDev) || 1);

    if (mode === 'standard') {
      const zRes = calculateZScore(Number(rawX) || 0, validMean, validSd);
      return {
        z: zRes.zScore,
        raw: Number(rawX) || 0,
        pLess: zRes.probabilityLess,
        pGreater: zRes.probabilityGreater,
        pBetween: zRes.probabilityBetweenOpposite,
        pTwoTail: Number((1 - zRes.probabilityBetweenOpposite).toFixed(5)),
        percentile: zRes.percentile
      };
    } else {
      const p = Math.max(0.0001, Math.min(0.9999, (Number(targetPercentile) || 50) / 100));
      const inv = calculateInverseZScore(p, validMean, validSd);
      const zRes = calculateZScore(inv.x, validMean, validSd);
      return {
        z: inv.zScore,
        raw: inv.x,
        pLess: zRes.probabilityLess,
        pGreater: zRes.probabilityGreater,
        pBetween: zRes.probabilityBetweenOpposite,
        pTwoTail: Number((1 - zRes.probabilityBetweenOpposite).toFixed(5)),
        percentile: zRes.percentile
      };
    }
  }, [mode, rawX, mean, stdDev, targetPercentile]);

  const handleAction = () => {
    setHasCalculated(true);
    trackCalculation('z_score', { mode, z: result.z });
  };

  // Generate Normal Distribution Bell Curve Chart Points
  const chartData = useMemo(() => {
    const labels: string[] = [];
    const curvePoints: number[] = [];
    const shadedPoints: (number | null)[] = [];

    const zMin = -3.5;
    const zMax = 3.5;
    const step = 0.1;

    for (let z = zMin; z <= zMax + 0.001; z += step) {
      const roundedZ = Number(z.toFixed(2));
      labels.push(roundedZ.toString());
      const pdf = standardNormalPdf(roundedZ);
      curvePoints.push(Number(pdf.toFixed(4)));

      if (roundedZ <= result.z) {
        shadedPoints.push(Number(pdf.toFixed(4)));
      } else {
        shadedPoints.push(null);
      }
    }

    return {
      labels,
      datasets: [
        {
          label: 'f(z) Standard Normal',
          data: curvePoints,
          borderColor: '#006a5a',
          backgroundColor: 'transparent',
          borderWidth: 2.5,
          tension: 0.35,
          pointRadius: 0
        },
        {
          label: 'P(Z < z) Cumulative Area',
          data: shadedPoints,
          borderColor: 'transparent',
          backgroundColor: 'rgba(0, 106, 90, 0.22)',
          fill: true,
          tension: 0.35,
          pointRadius: 0
        }
      ]
    };
  }, [result.z]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8" dir={lang === 'he' || lang === 'ar' ? 'rtl' : 'ltr'}>
      <SEO
        title={dict.title}
        description={dict.description}
        canonicalUrl={`/${lang}/calculators/z-score`}
      />

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100 shadow-xs">
              <Sliders className="w-6 h-6" />
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

          {/* Mode Switcher */}
          <div className="flex bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
            <button
              onClick={() => { setMode('standard'); handleAction(); }}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                mode === 'standard'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {dict.modeStandard}
            </button>
            <button
              onClick={() => { setMode('inverse'); handleAction(); }}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                mode === 'inverse'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {dict.modeInverse}
            </button>
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          {mode === 'standard' ? (
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                {dict.rawScore}
              </label>
              <input
                type="number"
                value={rawX}
                onChange={(e) => { setRawX(Number(e.target.value)); handleAction(); }}
                className="w-full h-12 px-4 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white text-base transition-all"
                placeholder="115"
              />
              <span className="text-[11px] text-stone-400 font-medium mt-1 block">
                {dict.rawScoreDesc}
              </span>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                {dict.percentileInput}
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0.01"
                  max="99.99"
                  value={targetPercentile}
                  onChange={(e) => { setTargetPercentile(Number(e.target.value)); handleAction(); }}
                  className="w-full h-12 px-4 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white text-base transition-all"
                  placeholder="84.13"
                />
                <Percent className="w-4 h-4 text-stone-400 absolute top-4 end-3" />
              </div>
              <span className="text-[11px] text-stone-400 font-medium mt-1 block">
                {dict.percentileInputDesc}
              </span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              {dict.populationMean}
            </label>
            <input
              type="number"
              value={mean}
              onChange={(e) => { setMean(Number(e.target.value)); handleAction(); }}
              className="w-full h-12 px-4 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white text-base transition-all"
              placeholder="100"
            />
            <span className="text-[11px] text-stone-400 font-medium mt-1 block">
              {dict.populationMeanDesc}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              {dict.stdDev}
            </label>
            <input
              type="number"
              min="0.001"
              value={stdDev}
              onChange={(e) => { setStdDev(Math.max(0.001, Number(e.target.value))); handleAction(); }}
              className="w-full h-12 px-4 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white text-base transition-all"
              placeholder="15"
            />
            <span className="text-[11px] text-stone-400 font-medium mt-1 block">
              {dict.stdDevDesc}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Results Display */}
      {hasCalculated && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-teal-900 text-white p-6 rounded-3xl shadow-sm flex flex-col justify-between border border-teal-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-200">
              {dict.calculatedZ}
            </span>
            <div className="my-3">
              <span className="text-4xl font-black font-display tracking-tight text-white">
                <CountUp value={result.z} decimals={2} />
              </span>
            </div>
            <span className="text-xs text-teal-300 font-medium">
              Z = (X - μ) / σ
            </span>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              {dict.percentileRank}
            </span>
            <div className="my-3">
              <span className="text-3xl font-black font-display tracking-tight text-stone-900">
                <CountUp value={result.percentile} decimals={2} suffix="%" />
              </span>
            </div>
            <span className="text-xs text-stone-400 font-medium">
              {dict.interpHigherThan.replace('{p}', result.percentile.toString())}
            </span>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              {dict.leftTail}
            </span>
            <div className="my-3">
              <span className="text-2xl font-black font-display tracking-tight text-teal-700">
                {result.pLess}
              </span>
            </div>
            <span className="text-xs text-stone-400 font-medium">
              Cumulative probability
            </span>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              {mode === 'standard' ? dict.rightTail : dict.rawScore}
            </span>
            <div className="my-3">
              {mode === 'standard' ? (
                <span className="text-2xl font-black font-display tracking-tight text-stone-800">
                  {result.pGreater}
                </span>
              ) : (
                <span className="text-3xl font-black font-display tracking-tight text-teal-700">
                  <CountUp value={result.raw} decimals={2} />
                </span>
              )}
            </div>
            <span className="text-xs text-stone-400 font-medium">
              {mode === 'standard' ? 'P(Z > z) upper tail' : 'Computed raw score (X)'}
            </span>
          </div>
        </div>
      )}

      {/* Bell Curve Visualizer & Interpretation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-stone-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-600" />
              <h2 className="text-lg font-bold text-stone-900">{dict.curveTitle}</h2>
            </div>
            <span className="text-xs font-bold bg-teal-50 text-teal-700 px-3 py-1 rounded-full border border-teal-100">
              Z = {result.z}
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      title: (items) => `Z = ${items[0].label}`,
                      label: (item) => `Density: ${item.raw}`
                    }
                  }
                },
                scales: {
                  x: {
                    grid: { display: false },
                    ticks: {
                      maxTicksLimit: 9,
                      callback: (val, index) => {
                        const label = chartData.labels[index];
                        return ['-3', '-2', '-1', '0', '1', '2', '3'].includes(label) ? `${label}σ` : '';
                      }
                    }
                  },
                  y: {
                    display: false
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Detailed Interpretation Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ArrowRightLeft className="w-5 h-5 text-teal-600" />
              <h2 className="text-lg font-bold text-stone-900">{dict.interpretation}</h2>
            </div>

            <p className="text-sm font-medium text-stone-600 leading-relaxed mb-4">
              {result.z > 0
                ? dict.interpAbove.replace('{z}', Math.abs(result.z).toString())
                : result.z < 0
                ? dict.interpBelow.replace('{z}', Math.abs(result.z).toString())
                : dict.interpEqual}
            </p>

            <div className="space-y-3 pt-2 border-t border-stone-100 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-500 font-medium">{dict.twoTail}:</span>
                <span className="font-bold text-stone-900">{Number((result.pBetween * 100).toFixed(2))}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500 font-medium">{dict.twoTailOuter}:</span>
                <span className="font-bold text-stone-900">{result.pTwoTail}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500 font-medium">Distance from Mean:</span>
                <span className="font-bold text-stone-900">{Math.abs(Number(result.raw) - Number(mean)).toFixed(2)} units</span>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-teal-50/60 p-4 rounded-2xl border border-teal-100">
            <span className="text-xs font-bold text-teal-900 block mb-1">
              <ShinyText text="Formula Reference" />
            </span>
            <code className="text-xs font-mono text-teal-800 font-bold block">
              Z = ({result.raw} - {mean}) / {stdDev} = {result.z}
            </code>
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
