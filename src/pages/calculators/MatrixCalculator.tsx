import React, { useMemo } from 'react';
import { useUrlState } from '../../hooks/useUrlState';
import { useI18n } from '../../contexts/i18n';
import SEO from '../../components/SEO';
import CountUp from '../../components/CountUp';
import ShinyText from '../../components/ShinyText';
import {
  Matrix,
  addMatrices,
  subtractMatrices,
  multiplyMatrices,
  analyzeSquareMatrix
} from '../../lib/math/matrix';
import { trackCalculation } from '../../lib/analytics';
import {
  Grid,
  HelpCircle,
  Sparkles,
  Layers,
  Repeat,
  CheckCircle2
} from 'lucide-react';

const localDict = {
  en: {
    title: 'Matrix Calculator & Linear Algebra',
    subtitle: 'Determinant, Inverse Matrix, Multiplication, Transpose, Rank & Trace',
    description: 'Solve 2x2 and 3x3 matrices with step-by-step solutions. Calculate determinant, inverse, transpose, rank, trace, matrix addition, subtraction, and multiplication.',
    tabSingle: 'Matrix Analysis (A)',
    tabBinary: 'Matrix Operations (A & B)',
    sizeLabel: 'Matrix Dimensions',
    presetLabel: 'Quick Presets',
    presetIdentity: 'Identity',
    presetSymmetric: 'Symmetric',
    presetSingular: 'Singular (Det = 0)',
    presetRandom: 'Standard',
    detCard: 'Determinant det(A)',
    traceCard: 'Trace tr(A)',
    rankCard: 'Matrix Rank',
    statusCard: 'Invertibility',
    invertible: 'Invertible (Non-Singular)',
    singular: 'Singular (No Inverse)',
    inverseTitle: 'Inverse Matrix A⁻¹',
    transposeTitle: 'Transpose Matrix Aᵀ',
    adjugateTitle: 'Adjugate Matrix adj(A)',
    cofactorTitle: 'Cofactor Matrix',
    matrixA: 'Matrix A',
    matrixB: 'Matrix B',
    operation: 'Operation',
    opAdd: 'A + B (Addition)',
    opSub: 'A - B (Subtraction)',
    opMul: 'A × B (Multiplication)',
    scalarK: 'Scalar Multiplier (k)',
    stepsTitle: 'Step-by-Step Mathematical Derivation',
    faqTitle: 'Frequently Asked Questions: Matrices & Linear Algebra',
    q1: 'How do you calculate the determinant of a 2x2 and 3x3 matrix?',
    a1: 'For a 2x2 matrix [[a, b], [c, d]], det = ad - bc. For a 3x3 matrix, the determinant is calculated using Laplace cofactor expansion along the first row: a(ei - fh) - b(di - fg) + c(dh - eg).',
    q2: 'When does a matrix have an inverse?',
    a2: 'A square matrix has an inverse if and only if its determinant is non-zero (det(A) ≠ 0). Such matrices are called non-singular or invertible. If det(A) = 0, the matrix is singular and cannot be inverted.',
    q3: 'What is matrix rank and trace?',
    a3: 'The trace is the sum of the elements on the main diagonal. The rank is the maximum number of linearly independent row or column vectors in the matrix, indicating the dimensionality of the vector space it spans.'
  },
  he: {
    title: 'מחשבון מטריצות ואלגברה לינארית',
    subtitle: 'חישוב דטרמיננטה, מטריצה הופכית, כפל מטריצות, שחלוף, עקבה ודרגה',
    description: 'פתרון וניתוח מטריצות 2x2 ו-3x3 עם שלבי פתרון מפורטים. חישוב דטרמיננטה, מטריצה הופכית, שחלוף (טרנספוז), דרגה, עקבה, חיבור, חיסור וכפל מטריצות.',
    tabSingle: 'ניתוח מטריצה בודדת (A)',
    tabBinary: 'פעולות בין שתי מטריצות (A ו-B)',
    sizeLabel: 'גודל המטריצה',
    presetLabel: 'תבניות מהירות',
    presetIdentity: 'מטריצת יחידה',
    presetSymmetric: 'סימטרית',
    presetSingular: 'סינגולרית (דטרמיננטה 0)',
    presetRandom: 'סטנדרטית',
    detCard: 'דטרמיננטה det(A)',
    traceCard: 'עקבה tr(A)',
    rankCard: 'דרגת המטריצה Rank',
    statusCard: 'הפיכות',
    invertible: 'הפיכה (רגולרית)',
    singular: 'סינגולרית (אין הופכית)',
    inverseTitle: 'מטריצה הופכית A⁻¹',
    transposeTitle: 'מטריצה משוחלפת Aᵀ',
    adjugateTitle: 'מטריצה מצורפת adj(A)',
    cofactorTitle: 'מטריצת מינורים וקו-פקטורים',
    matrixA: 'מטריצה A',
    matrixB: 'מטריצה B',
    operation: 'פעולה חשבונית',
    opAdd: 'A + B (חיבור)',
    opSub: 'A - B (חיסור)',
    opMul: 'A × B (כפל מטריצות)',
    scalarK: 'כפל בסקלר (k)',
    stepsTitle: 'שלבי הפיתוח המתמטי שלב-אחר-שלב',
    faqTitle: 'שאלות ותשובות נפוצות: מטריצות ואלגברה לינארית',
    q1: 'כיצד מחשבים דטרמיננטה של מטריצה 2x2 ו-3x3?',
    a1: 'עבור 2x2 הנוסחה היא ad - bc. עבור 3x3 משתמשים בפיתוח לפלס לפי השורה הראשונה (או כלל סארוס): a(ei - fh) - b(di - fg) + c(dh - eg).',
    q2: 'מתי למטריצה קיימת מטריצה הופכית?',
    a2: 'מטריצה ריבועית הינה הפיכה אם ורק אם הדטרמיננטה שלה שונה מאפס (det ≠ 0). אם הדטרמיננטה שווה 0, המטריצה נקראת סינגולרית (מנוונת) ואין לה הופכית.',
    q3: 'מה המשמעות של עקבה (Trace) ודרגה (Rank)?',
    a3: 'העקבה היא סכום איברי האלכסון הראשי. הדרגה היא מספר השורות (או העמודות) הבלתי-תלויות לינארית במטריצה, ומבטאת את ממד מרחב התמונה שלה.'
  },
  es: {
    title: 'Calculadora de Matrices y Álgebra Lineal',
    subtitle: 'Determinante, Matriz Inversa, Multiplicación, Rango y Traza',
    description: 'Calculadora completa de matrices 2x2 y 3x3 paso a paso. Determinante, matriz inversa, traspuesta, rango, traza, suma, resta y multiplicación de matrices.',
    tabSingle: 'Análisis de Matriz (A)',
    tabBinary: 'Operaciones (A y B)',
    sizeLabel: 'Dimensiones',
    presetLabel: 'Preajustes',
    presetIdentity: 'Identidad',
    presetSymmetric: 'Simétrica',
    presetSingular: 'Singular',
    presetRandom: 'Estándar',
    detCard: 'Determinante det(A)',
    traceCard: 'Traza tr(A)',
    rankCard: 'Rango',
    statusCard: 'Invertibilidad',
    invertible: 'Invertible',
    singular: 'Singular (Sin inversa)',
    inverseTitle: 'Matriz Inversa A⁻¹',
    transposeTitle: 'Matriz Traspuesta Aᵀ',
    adjugateTitle: 'Matriz Adjunta adj(A)',
    cofactorTitle: 'Matriz de Cofactores',
    matrixA: 'Matriz A',
    matrixB: 'Matriz B',
    operation: 'Operación',
    opAdd: 'A + B (Suma)',
    opSub: 'A - B (Resta)',
    opMul: 'A × B (Multiplicación)',
    scalarK: 'Multiplicador Escalar (k)',
    stepsTitle: 'Paso a Paso Matemático',
    faqTitle: 'Preguntas Frecuentes: Matrices',
    q1: '¿Cómo calcular el determinante?',
    a1: 'Para 2x2 es ad - bc. Para 3x3 se aplica la regla de Laplace o regla de Sarrus.',
    q2: '¿Cuándo tiene inversa una matriz?',
    a2: 'Únicamente cuando su determinante es diferente de cero (det ≠ 0).',
    q3: '¿Qué son la traza y el rango?',
    a3: 'La traza es la suma de la diagonal principal; el rango es el número de filas linealmente independientes.'
  },
  fr: {
    title: 'Calculateur de Matrices et Algèbre Linéaire',
    subtitle: 'Déterminant, Matrice Inverse, Produit, Rang et Trace',
    description: 'Résolvez vos matrices 2x2 et 3x3 avec étapes détaillées. Déterminant, inverse, transposée, rang, trace, addition et multiplication matricielle.',
    tabSingle: 'Analyse de Matrice (A)',
    tabBinary: 'Opérations (A et B)',
    sizeLabel: 'Dimension',
    presetLabel: 'Préréglages',
    presetIdentity: 'Identité',
    presetSymmetric: 'Symétrique',
    presetSingular: 'Singulière',
    presetRandom: 'Standard',
    detCard: 'Déterminant det(A)',
    traceCard: 'Trace tr(A)',
    rankCard: 'Rang',
    statusCard: 'Inversibilité',
    invertible: 'Inversible',
    singular: 'Singulière (Sans inverse)',
    inverseTitle: 'Matrice Inverse A⁻¹',
    transposeTitle: 'Matrice Transposée Aᵀ',
    adjugateTitle: 'Matrice Adjointe adj(A)',
    cofactorTitle: 'Matrice des Cofacteurs',
    matrixA: 'Matrice A',
    matrixB: 'Matrice B',
    operation: 'Opération',
    opAdd: 'A + B (Addition)',
    opSub: 'A - B (Soustraction)',
    opMul: 'A × B (Produit)',
    scalarK: 'Scalaire (k)',
    stepsTitle: 'Étapes Détaillées',
    faqTitle: 'Questions Fréquentes: Matrices',
    q1: 'Comment calculer le déterminant?',
    a1: 'Pour 2x2: ad - bc. Pour 3x3: développement de Laplace le long d’une ligne.',
    q2: 'Quand une matrice est-elle inversible?',
    a2: 'Une matrice carrée est inversible si et seulement si son déterminant est non nul.',
    q3: 'Que représentent la trace et le rang?',
    a3: 'La trace est la somme des éléments diagonaux. Le rang est le nombre de vecteurs lignes indépendants.'
  },
  ar: {
    title: 'حاسبة المصفوفات والجبر الخطي',
    subtitle: 'المحدد، معكوس المصفوفة، الضرب، المنقول، الرتبة والأثر',
    description: 'حل وتحليل مصفوفات 2x2 و 3x3 مع خطوات الحل التفصيلية. حساب المحدد، المعكوس، المنقول، الرتبة، الأثر والعمليات الحسابية.',
    tabSingle: 'تحليل مصفوفة فردية (A)',
    tabBinary: 'عمليات مصفوفتين (A و B)',
    sizeLabel: 'حجم المصفوفة',
    presetLabel: 'نماذج جاهزة',
    presetIdentity: 'مصفوفة الوحدة',
    presetSymmetric: 'متماثلة',
    presetSingular: 'شاذة (المحدد صفر)',
    presetRandom: 'قياسية',
    detCard: 'المحدد det(A)',
    traceCard: 'الأثر tr(A)',
    rankCard: 'رتبة المصفوفة Rank',
    statusCard: 'قابلية الانعكاس',
    invertible: 'قابلة للعكس (منتظمة)',
    singular: 'مصفوفة شاذة (لا يوجد معكوس)',
    inverseTitle: 'المعكوس A⁻¹',
    transposeTitle: 'المنقول Aᵀ',
    adjugateTitle: 'المصفوفة الملحقة adj(A)',
    cofactorTitle: 'مصفوفة العوامل المرافقة',
    matrixA: 'المصفوفة A',
    matrixB: 'المصفوفة B',
    operation: 'العملية',
    opAdd: 'A + B (جمع)',
    opSub: 'A - B (طرح)',
    opMul: 'A × B (ضرب)',
    scalarK: 'الضرب في عدد ثابت (k)',
    stepsTitle: 'خطوات الحل الرياضي بالتفصيل',
    faqTitle: 'الأسئلة الشائعة: الجبر الخطي والمصفوفات',
    q1: 'كيف يحسب محدد المصفوفة؟',
    a1: 'لمصفوفة 2x2: ad - bc. ولمصفوفة 3x3 يستخدم منشور لابلابلاس للعوامل المرافقة.',
    q2: 'متى تملك المصفوفة معكوساً؟',
    a2: 'عندما يكون محددها غير مساوٍ للصفر (det ≠ 0).',
    q3: 'ما هو الأثر والرتبة؟',
    a3: 'الأثر هو مجموع عناصر القطر الرئيسي. والرتبة هي عدد المتجهات المستقلة خطياً.'
  }
};

export default function MatrixCalculator() {
  const { lang } = useI18n();
  const dict = localDict[lang as keyof typeof localDict] || localDict.en;

  const [urlState, setUrlState] = useUrlState({
    mode: 'single', // 'single' | 'binary'
    size: '3',      // '2' | '3'
    op: 'multiply', // 'add' | 'subtract' | 'multiply'
    a: '1,2,3,0,1,4,5,6,0',
    b: '2,0,-1,1,3,2,0,-2,1'
  });

  const size = (urlState.size === '2' ? 2 : 3) as 2 | 3;
  const isSingle = urlState.mode === 'single';

  // Parse matrices from comma-separated strings
  const matrixA: Matrix = useMemo(() => {
    const parts = urlState.a.split(',').map(v => parseFloat(v) || 0);
    const targetLength = size * size;
    const filled = Array.from({ length: targetLength }, (_, i) => parts[i] ?? (i % (size + 1) === 0 ? 1 : 0));
    const m: Matrix = [];
    for (let r = 0; r < size; r++) {
      m.push(filled.slice(r * size, (r + 1) * size));
    }
    return m;
  }, [urlState.a, size]);

  const matrixB: Matrix = useMemo(() => {
    const parts = urlState.b.split(',').map(v => parseFloat(v) || 0);
    const targetLength = size * size;
    const filled = Array.from({ length: targetLength }, (_, i) => parts[i] ?? (i % (size + 1) === 0 ? 1 : 0));
    const m: Matrix = [];
    for (let r = 0; r < size; r++) {
      m.push(filled.slice(r * size, (r + 1) * size));
    }
    return m;
  }, [urlState.b, size]);

  // Update cell in Matrix A
  const updateCellA = (r: number, c: number, val: number) => {
    const copy = matrixA.map(row => [...row]);
    copy[r][c] = val;
    const flat = copy.flat().join(',');
    setUrlState({ a: flat });
    trackCalculation('matrix_update_cell_a', { size });
  };

  // Update cell in Matrix B
  const updateCellB = (r: number, c: number, val: number) => {
    const copy = matrixB.map(row => [...row]);
    copy[r][c] = val;
    const flat = copy.flat().join(',');
    setUrlState({ b: flat });
    trackCalculation('matrix_update_cell_b', { size });
  };

  // Apply preset matrix
  const applyPreset = (preset: 'identity' | 'symmetric' | 'singular' | 'standard') => {
    let newA: number[];
    if (size === 2) {
      if (preset === 'identity') newA = [1, 0, 0, 1];
      else if (preset === 'symmetric') newA = [4, 7, 7, 2];
      else if (preset === 'singular') newA = [2, 4, 1, 2];
      else newA = [3, 8, 4, 6];
    } else {
      if (preset === 'identity') newA = [1, 0, 0, 0, 1, 0, 0, 0, 1];
      else if (preset === 'symmetric') newA = [2, -1, 0, -1, 2, -1, 0, -1, 2];
      else if (preset === 'singular') newA = [1, 2, 3, 2, 4, 6, 1, 1, 1];
      else newA = [1, 2, 3, 0, 1, 4, 5, 6, 0];
    }
    setUrlState({ a: newA.join(',') });
  };

  // Perform single matrix analysis
  const analysis = useMemo(() => {
    return analyzeSquareMatrix(matrixA);
  }, [matrixA]);

  // Perform binary matrix operation
  const binaryResult = useMemo(() => {
    if (urlState.op === 'add') return addMatrices(matrixA, matrixB);
    if (urlState.op === 'subtract') return subtractMatrices(matrixA, matrixB);
    return multiplyMatrices(matrixA, matrixB);
  }, [matrixA, matrixB, urlState.op]);

  // Helper renderer for matrix grid with bracket styling
  const renderMatrixGrid = (
    m: Matrix,
    editable = false,
    onCellChange?: (r: number, c: number, val: number) => void
  ) => {
    return (
      <div className="relative inline-block px-3 py-1">
        {/* Left bracket border */}
        <div className="absolute top-0 bottom-0 left-0 w-2.5 border-l-2 border-t-2 border-b-2 border-slate-700 dark:border-slate-300 rounded-l" />
        {/* Right bracket border */}
        <div className="absolute top-0 bottom-0 right-0 w-2.5 border-r-2 border-t-2 border-b-2 border-slate-700 dark:border-slate-300 rounded-r" />

        <div
          className="grid gap-2 p-1 text-center font-mono font-medium"
          style={{ gridTemplateColumns: `repeat(${m[0].length}, minmax(44px, 1fr))` }}
        >
          {m.map((row, r) =>
            row.map((val, c) => (
              <div key={`${r}-${c}`} className="flex items-center justify-center">
                {editable ? (
                  <input
                    id={`matrix-input-${r}-${c}`}
                    type="number"
                    step="any"
                    value={val}
                    onChange={(e) => onCellChange?.(r, c, parseFloat(e.target.value) || 0)}
                    className="w-14 sm:w-16 h-10 text-center font-bold text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                  />
                ) : (
                  <div className="w-14 sm:w-16 h-10 flex items-center justify-center text-sm font-bold text-slate-800 dark:text-slate-100 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xs">
                    {Number.isInteger(val) ? val : Number(val.toFixed(3))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-12">
      <SEO
        title={dict.title}
        description={dict.description}
        canonicalUrl={`/${lang}/calculators/matrix-calculator`}
      />

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
          <Grid className="w-4 h-4" />
          <ShinyText text={dict.title} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {dict.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {dict.subtitle}
        </p>
      </div>

      {/* Mode & Size Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
        {/* Mode Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            id="tab-single-matrix"
            onClick={() => setUrlState({ mode: 'single' })}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              isSingle
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            {dict.tabSingle}
          </button>
          <button
            id="tab-binary-matrix"
            onClick={() => setUrlState({ mode: 'binary' })}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              !isSingle
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Repeat className="w-4 h-4" />
            {dict.tabBinary}
          </button>
        </div>

        {/* Size Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {dict.sizeLabel}:
          </span>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              id="size-2x2-btn"
              onClick={() => {
                setUrlState({
                  size: '2',
                  a: '4,7,2,6',
                  b: '1,2,3,4'
                });
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                size === 2
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              2 × 2
            </button>
            <button
              id="size-3x3-btn"
              onClick={() => {
                setUrlState({
                  size: '3',
                  a: '1,2,3,0,1,4,5,6,0',
                  b: '2,0,-1,1,3,2,0,-2,1'
                });
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                size === 3
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              3 × 3
            </button>
          </div>
        </div>
      </div>

      {/* Presets Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-500">{dict.presetLabel}:</span>
        <button
          id="preset-identity"
          onClick={() => applyPreset('identity')}
          className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-300 hover:text-blue-600 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
        >
          {dict.presetIdentity}
        </button>
        <button
          id="preset-symmetric"
          onClick={() => applyPreset('symmetric')}
          className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-300 hover:text-blue-600 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
        >
          {dict.presetSymmetric}
        </button>
        <button
          id="preset-singular"
          onClick={() => applyPreset('singular')}
          className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-700 dark:text-slate-300 hover:text-red-600 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
        >
          {dict.presetSingular}
        </button>
        <button
          id="preset-standard"
          onClick={() => applyPreset('standard')}
          className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-300 hover:text-blue-600 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
        >
          {dict.presetRandom}
        </button>
      </div>

      {/* Main Input Stage */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
        {isSingle ? (
          /* Single Matrix Analysis Layout */
          <div className="flex flex-col items-center justify-center space-y-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs">
                A
              </span>
              {dict.matrixA} ({size}×{size})
            </h2>
            <div className="overflow-x-auto py-2">
              {renderMatrixGrid(matrixA, true, updateCellA)}
            </div>
          </div>
        ) : (
          /* Binary Matrix Operations Layout */
          <div className="space-y-6">
            {/* Operation Selector */}
            <div className="flex justify-center gap-2">
              <button
                id="op-add-btn"
                onClick={() => setUrlState({ op: 'add' })}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  urlState.op === 'add'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {dict.opAdd}
              </button>
              <button
                id="op-sub-btn"
                onClick={() => setUrlState({ op: 'subtract' })}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  urlState.op === 'subtract'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {dict.opSub}
              </button>
              <button
                id="op-mul-btn"
                onClick={() => setUrlState({ op: 'multiply' })}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  urlState.op === 'multiply'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {dict.opMul}
              </button>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              {/* Matrix A */}
              <div className="flex flex-col items-center space-y-2">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {dict.matrixA}
                </span>
                {renderMatrixGrid(matrixA, true, updateCellA)}
              </div>

              {/* Symbol */}
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                {urlState.op === 'add' ? '+' : urlState.op === 'subtract' ? '−' : '×'}
              </div>

              {/* Matrix B */}
              <div className="flex flex-col items-center space-y-2">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {dict.matrixB}
                </span>
                {renderMatrixGrid(matrixB, true, updateCellB)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      {isSingle && analysis ? (
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Determinant */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {dict.detCard}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
                <CountUp end={analysis.determinant} decimals={Number.isInteger(analysis.determinant) ? 0 : 3} />
              </div>
            </div>

            {/* Trace */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {dict.traceCard}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                <CountUp end={analysis.trace} decimals={Number.isInteger(analysis.trace) ? 0 : 2} />
              </div>
            </div>

            {/* Rank */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {dict.rankCard}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
                {analysis.rank} / {size}
              </div>
            </div>

            {/* Invertibility Status */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {dict.statusCard}
              </span>
              <div
                className={`text-sm sm:text-base font-bold flex items-center gap-1.5 mt-1 ${
                  analysis.isSingular
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                {analysis.isSingular ? dict.singular : dict.invertible}
              </div>
            </div>
          </div>

          {/* Matrix Results Matrices: Inverse & Transpose */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Inverse Matrix */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs flex flex-col items-center">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4">
                {dict.inverseTitle}
              </h3>
              {analysis.inverse ? (
                renderMatrixGrid(analysis.inverse)
              ) : (
                <div className="text-center p-6 text-sm text-rose-500 font-semibold bg-rose-50 dark:bg-rose-950/30 rounded-xl w-full">
                  {dict.singular}
                </div>
              )}
            </div>

            {/* Transpose Matrix */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs flex flex-col items-center">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4">
                {dict.transposeTitle}
              </h3>
              {renderMatrixGrid(analysis.transpose)}
            </div>
          </div>

          {/* Adjugate / Cofactors for 3x3 */}
          {size === 3 && analysis.adjugate && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs flex flex-col items-center">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4">
                  {dict.adjugateTitle}
                </h3>
                {renderMatrixGrid(analysis.adjugate)}
              </div>

              {analysis.cofactors && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs flex flex-col items-center">
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4">
                    {dict.cofactorTitle}
                  </h3>
                  {renderMatrixGrid(analysis.cofactors)}
                </div>
              )}
            </div>
          )}

          {/* Step by step derivation */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              {dict.stepsTitle}
            </h3>
            <div className="space-y-2 font-mono text-sm bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto text-slate-700 dark:text-slate-300">
              {analysis.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold select-none">{idx + 1}.</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : !isSingle && binaryResult ? (
        /* Binary Operation Result */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              {urlState.op === 'add' ? 'A + B' : urlState.op === 'subtract' ? 'A − B' : 'A × B'} Result
            </h3>
            {renderMatrixGrid(binaryResult.result)}
          </div>

          {/* Steps */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              {dict.stepsTitle}
            </h4>
            <div className="space-y-1.5 font-mono text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto text-slate-700 dark:text-slate-300">
              {binaryResult.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold select-none">•</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* FAQ Section */}
      <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
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
