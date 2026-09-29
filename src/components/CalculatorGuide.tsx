import React from 'react';
import { useI18n } from '../contexts/i18n';
import { benchmarkTables } from '../data/benchmarks';
import { Link } from 'react-router-dom';
import { calculators, getCalculatorTitle } from '../data/calculators';
import ExpertReviewBox from './ExpertReviewBox';

interface CalculatorGuideProps {
  guideKey: string;
  category?: 'finance' | 'health' | 'math' | 'lifestyle' | 'real-estate' | 'tech';
  onApplyPreset?: (preset: Record<string, any>) => void;
}

export default function CalculatorGuide({ guideKey, category, onApplyPreset }: CalculatorGuideProps) {
  const { lang, guides, t } = useI18n();
  const guide = guides?.[guideKey] || null;
  const benchmark = benchmarkTables[guideKey] || null;

  const effectiveCategory = category || benchmark?.category || 'finance';

  // Contextual link suggestions based on guideKey
  const contextualLinksMap: Record<string, string[]> = {
    mortgage: ['/calculators/mortgage-affordability', '/calculators/rent-vs-buy', '/calculators/refinance', '/calculators/auto-loan', '/calculators/cap-rate'],
    compound: ['/calculators/goal-savings', '/calculators/inflation', '/calculators/roi', '/mortgage-calculator', '/calculators/stock-options-rsu'],
    bmi: ['/calculators/bmr', '/calculators/water-intake', '/calculators/sleep-calculator'],
    percentage: ['/calculators/vat', '/calculators/margin', '/tip-calculator', '/salary-calculator', '/calculators/break-even'],
    salary: ['/calculators/freelance-net-income', '/calculators/break-even', '/percentage-finder', '/calculators/employer-cost', '/calculators/severance-pay'],
    'rent-vs-buy': ['/mortgage-calculator', '/calculators/cap-rate', '/calculators/mortgage-affordability', '/calculators/purchase-appreciation-tax'],
    'auto-loan': ['/mortgage-calculator', '/calculators/fuel-split', '/calculators/debt-snowball'],
    vat: ['/percentage-finder', '/calculators/margin', '/calculators/freelance-net-income'],
    bmr: ['/bmi-calculator', '/calculators/water-intake', '/calculators/sleep-calculator'],
    pregnancy: ['/bmi-calculator', '/calculators/water-intake', '/calculators/sleep-calculator', '/calculators/date-difference'],
    'water-intake': ['/bmi-calculator', '/calculators/bmr', '/calculators/sleep-calculator'],
    'sleep-calculator': ['/calculators/water-intake', '/bmi-calculator', '/calculators/date-difference'],
    'goal-savings': ['/calculators/compound-interest', '/calculators/inflation', '/mortgage-calculator'],
    inflation: ['/calculators/compound-interest', '/salary-calculator', '/calculators/goal-savings'],
    'freelance-net-income': ['/salary-calculator', '/calculators/vat', '/calculators/break-even'],
    'debt-snowball': ['/calculators/credit-card-payoff', '/mortgage-calculator', '/calculators/auto-loan'],
  };

  const relatedPaths = contextualLinksMap[guideKey] || [];
  const relatedCalcs = relatedPaths
    .map(p => calculators.find(c => c.path === p))
    .filter(Boolean);

  if (!guide && !benchmark && relatedCalcs.length === 0) {
    return null;
  }

  const tableTitle = benchmark?.title?.[lang] || benchmark?.title?.en || '';
  const tableDesc = benchmark?.description?.[lang] || benchmark?.description?.en || '';
  const directAnswerText = benchmark?.directAnswer?.[lang] || benchmark?.directAnswer?.en || '';
  const headers = benchmark?.headers?.[lang] || benchmark?.headers?.en || [];
  const expertTip = benchmark?.expertTip?.[lang] || benchmark?.expertTip?.en || '';

  const caseStudy = benchmark?.caseStudy;
  const caseStudyTitle = caseStudy?.title?.[lang] || caseStudy?.title?.en || '';
  const caseStudyScenario = caseStudy?.scenario?.[lang] || caseStudy?.scenario?.en || '';
  const caseStudyCalcs = caseStudy?.calculations?.[lang] || caseStudy?.calculations?.en || [];
  const caseStudyTakeaway = caseStudy?.takeaway?.[lang] || caseStudy?.takeaway?.en || '';
  const caseStudyPreset = caseStudy?.preset;

  const formulaData = benchmark?.formulaBreakdown;
  const formulaName = formulaData?.name?.[lang] || formulaData?.name?.en || guide?.formulaHeading || '';
  const formulaFormula = formulaData?.formula || '';
  const formulaVars = formulaData?.variables?.[lang] || formulaData?.variables?.en || guide?.formulaLines || [];
  const formulaSteps = formulaData?.stepExample?.[lang] || formulaData?.stepExample?.en || [];

  const labels = {
    en: {
      directAnswer: 'Direct Answer & Key Summary',
      quickReference: 'Benchmark Reference Table',
      formula: 'Mathematical Formula & Calculation Method',
      formulaBreakdownHeading: 'Step-by-Step Calculation Breakdown',
      caseStudyHeading: 'Realistic Worked Case Study',
      practicalTakeaway: 'Actionable Key Takeaway',
      expertAdvice: 'Expert Insight & Best Practices',
      exploreMore: 'Explore Related Topic Calculators',
      applyPreset: 'Apply Scenario to Calculator',
      variablesLegend: 'Variables & Notation Legend',
    },
    he: {
      directAnswer: 'תשובה ישירה ותקציר החישוב',
      quickReference: 'טבלת נתונים ותרחישי השוואה',
      formula: 'נוסחת החישוב והסבר מתמטי מפורט',
      formulaBreakdownHeading: 'שלבי חישוב ופירוט מתמטי שלב-אחר-שלב',
      caseStudyHeading: 'דוגמה מוחשית מהחיים (Worked Case Study)',
      practicalTakeaway: 'מסקנה מעשית וערך מוסף',
      expertAdvice: 'תובנות מומחה וכללי אצבע',
      exploreMore: 'מחשבונים מומלצים נוספים באותו נושא',
      applyPreset: 'טען תרחיש זה למחשבון',
      variablesLegend: 'מקרא משתנים והגדרות',
    },
    es: {
      directAnswer: 'Respuesta Directa y Resumen Clave',
      quickReference: 'Tabla de Referencia y Comparación',
      formula: 'Fórmula Matemática y Método de Cálculo',
      formulaBreakdownHeading: 'Desglose del Cálculo Paso a Paso',
      caseStudyHeading: 'Caso Práctico Real',
      practicalTakeaway: 'Conclusión Práctica',
      expertAdvice: 'Consejos de Expertos y Buenas Prácticas',
      exploreMore: 'Calculadoras Relacionadas',
      applyPreset: 'Aplicar Escenario a la Calculadora',
      variablesLegend: 'Leyenda de Variables',
    },
    fr: {
      directAnswer: 'Réponse Directe et Points Clés',
      quickReference: 'Tableau de Référence et Exemples',
      formula: 'Formule Mathématique et Méthode de Calcul',
      formulaBreakdownHeading: 'Calcul Étape par Étape',
      caseStudyHeading: 'Étude de Cas Réelle',
      practicalTakeaway: 'Conseil Pratique',
      expertAdvice: 'Conseils d\'Experts et Bonnes Pratiques',
      exploreMore: 'Calculatrices Connexes',
      applyPreset: 'Appliquer ce Scénario',
      variablesLegend: 'Légende des Variables',
    },
    ar: {
      directAnswer: 'الإجابة المباشرة والملخص السريع',
      quickReference: 'جدول البيانات والمقارنات القياسية',
      formula: 'المعادلة الرياضية وطريقة الحساب',
      formulaBreakdownHeading: 'خطوات الحساب الرياضي التفصيلية',
      caseStudyHeading: 'دراسة حالة واقعية ومثال عملي',
      practicalTakeaway: 'الخلاصة العملية',
      expertAdvice: 'نصائح الخبراء وأفضل الممارسات',
      exploreMore: 'حاسبات أخرى ذات صلة',
      applyPreset: 'تطبيق السيناريو في الحاسبة',
      variablesLegend: 'دليل المتغيرات والمعادلات',
    },
  }[lang] || {
    directAnswer: 'Direct Answer & Key Summary',
    quickReference: 'Benchmark Reference Table',
    formula: 'Mathematical Formula & Calculation Method',
    formulaBreakdownHeading: 'Step-by-Step Calculation Breakdown',
    caseStudyHeading: 'Realistic Worked Case Study',
    practicalTakeaway: 'Actionable Key Takeaway',
    expertAdvice: 'Expert Insight & Best Practices',
    exploreMore: 'Explore Related Topic Calculators',
    applyPreset: 'Apply Scenario to Calculator',
    variablesLegend: 'Variables & Notation Legend',
  };

  return (
    <section className="w-full bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-xs border border-stone-200 mt-8 mb-8 space-y-8">
      {/* Title & Overview */}
      {guide && (
        <div className="border-b border-stone-200 pb-6">
          <h2 className="text-2xl sm:text-3xl font-headline font-bold text-stone-900 tracking-tight mb-3">
            {guide.guideTitle}
          </h2>
          <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
            {guide.guideDesc}
          </p>
        </div>
      )}

      {/* Expert Review & Freshness Verification Box (E-E-A-T Seal) */}
      <ExpertReviewBox category={effectiveCategory} />

      {/* Direct Answer / AI Snippet Box */}
      {directAnswerText && (
        <div className="p-4 sm:p-5 rounded-xl bg-blue-50/70 border border-blue-200/80 text-blue-950 flex items-start gap-3.5 shadow-xs">
          <span className="material-symbols-outlined text-blue-600 text-[24px] shrink-0 mt-0.5">verified</span>
          <div className="text-xs sm:text-sm leading-relaxed">
            <span className="font-bold block mb-1 text-blue-900">{labels.directAnswer}</span>
            <p className="text-stone-700 leading-relaxed">{directAnswerText}</p>
          </div>
        </div>
      )}

      {/* Semantic Benchmark Table for Featured Snippets / Position 0 */}
      {benchmark && headers.length > 0 && benchmark.rows.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-[20px]">table_chart</span>
                {tableTitle || labels.quickReference}
              </h3>
              {tableDesc && <p className="text-xs sm:text-sm text-stone-500 mt-1">{tableDesc}</p>}
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-stone-200 shadow-xs">
            <table className="w-full text-left rtl:text-right border-collapse text-xs sm:text-sm">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  {headers.map((h: string, idx: number) => (
                    <th key={idx} scope="col" className="px-4 py-3.5 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                  {onApplyPreset && (
                    <th scope="col" className="px-4 py-3.5 text-center whitespace-nowrap">
                      {labels.applyPreset}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 bg-white">
                {benchmark.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-stone-50/80 transition-colors">
                    <th scope="row" className="px-4 py-3 font-semibold text-stone-900 whitespace-nowrap">
                      {row.label}
                    </th>
                    <td className="px-4 py-3 text-stone-700 whitespace-nowrap">{row.col1}</td>
                    <td className="px-4 py-3 text-stone-700 whitespace-nowrap">{row.col2}</td>
                    {row.col3 && <td className="px-4 py-3 text-stone-700 whitespace-nowrap">{row.col3}</td>}
                    {row.col4 && <td className="px-4 py-3 text-stone-700 whitespace-nowrap">{row.col4}</td>}
                    {onApplyPreset && (
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        {row.preset && (
                          <button
                            type="button"
                            onClick={() => onApplyPreset(row.preset!)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition-colors"
                          >
                            <span className="material-symbols-outlined text-[13px]">play_arrow</span>
                            {labels.applyPreset}
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Worked Case Study Section (דוגמה מוחשית מהחיים) */}
      {caseStudyScenario && (
        <div className="p-5 sm:p-6 rounded-2xl bg-stone-50 border border-stone-200/90 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/80 pb-3.5">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
              </span>
              <div>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                  {labels.caseStudyHeading}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-stone-900">
                  {caseStudyTitle}
                </h3>
              </div>
            </div>

            {onApplyPreset && caseStudyPreset && (
              <button
                type="button"
                onClick={() => onApplyPreset(caseStudyPreset)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-100/90 hover:bg-emerald-200 border border-emerald-300 shadow-xs transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-[16px]">tune</span>
                <span>{labels.applyPreset}</span>
              </button>
            )}
          </div>

          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
            {caseStudyScenario}
          </p>

          {caseStudyCalcs.length > 0 && (
            <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2 text-xs sm:text-sm">
              {caseStudyCalcs.map((item: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2 text-stone-700 leading-relaxed">
                  <span className="material-symbols-outlined text-emerald-600 text-[16px] shrink-0 mt-0.5">check_circle</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}

          {caseStudyTakeaway && (
            <div className="pt-2 flex items-start gap-2 text-xs sm:text-sm text-stone-800 font-semibold bg-emerald-50/60 p-3 rounded-xl border border-emerald-200/60">
              <span className="material-symbols-outlined text-emerald-700 text-[18px] shrink-0 mt-0.5">tips_and_updates</span>
              <div>
                <span className="text-emerald-900 font-bold block mb-0.5">{labels.practicalTakeaway}</span>
                <p className="text-stone-700 font-normal leading-relaxed">{caseStudyTakeaway}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mathematical Formula & Step Breakdown */}
      {(formulaFormula || formulaVars.length > 0) && (
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-[20px]">functions</span>
            {formulaName || labels.formula}
          </h3>

          {formulaFormula && (
            <div className="bg-stone-900 text-emerald-400 p-4 sm:p-5 rounded-xl font-mono text-sm sm:text-base tracking-wide overflow-x-auto shadow-inner border border-stone-800" dir="ltr">
              {formulaFormula}
            </div>
          )}

          {formulaVars.length > 0 && (
            <div className="bg-stone-50 p-4 sm:p-5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-800 space-y-2">
              <span className="font-bold text-stone-900 block mb-2 text-xs uppercase tracking-wider text-stone-500">
                {labels.variablesLegend}
              </span>
              {formulaVars.map((line: string, idx: number) => (
                <div key={idx} className="leading-relaxed flex items-start gap-2">
                  <span className="text-emerald-600 font-mono font-bold">•</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
          )}

          {formulaSteps.length > 0 && (
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/60 text-xs sm:text-sm space-y-1.5">
              <span className="font-bold text-blue-900 block mb-1">
                {labels.formulaBreakdownHeading}
              </span>
              {formulaSteps.map((step: string, idx: number) => (
                <div key={idx} className="text-stone-700 leading-relaxed font-mono text-xs">
                  {step}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Expert E-E-A-T Insight Box */}
      {expertTip && (
        <div className="p-4 sm:p-5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-950 flex items-start gap-3.5 shadow-xs">
          <span className="material-symbols-outlined text-amber-600 text-[24px] shrink-0 mt-0.5">lightbulb</span>
          <div className="text-xs sm:text-sm leading-relaxed">
            <span className="font-bold block mb-1 text-amber-900">{labels.expertAdvice}</span>
            <p className="text-stone-700 leading-relaxed">{expertTip}</p>
          </div>
        </div>
      )}

      {/* Contextual In-Content Links for SEO & Crawl Depth */}
      {relatedCalcs.length > 0 && (
        <div className="pt-4 border-t border-stone-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
            {labels.exploreMore}
          </h4>
          <div className="flex flex-wrap gap-2">
            {relatedCalcs.map((c) => (
              c && (
                <Link
                  key={c.id}
                  to={`/${lang}${c.path}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-100 hover:bg-blue-50 text-stone-700 hover:text-blue-700 border border-stone-200 hover:border-blue-300 transition-all"
                >
                  <span className="material-symbols-outlined text-[14px]">calculate</span>
                  <span>{getCalculatorTitle(c, t, lang)}</span>
                </Link>
              )
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
