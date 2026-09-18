import React from 'react';
import { useI18n } from '../contexts/i18n';
import { benchmarkTables } from '../data/benchmarks';
import { Link } from 'react-router-dom';
import { calculators, getCalculatorTitle } from '../data/calculators';

interface CalculatorGuideProps {
  guideKey: string;
  onApplyPreset?: (preset: Record<string, any>) => void;
}

export default function CalculatorGuide({ guideKey, onApplyPreset }: CalculatorGuideProps) {
  const { lang, guides, t } = useI18n();
  const guide = guides[guideKey] || null;
  const benchmark = benchmarkTables[guideKey] || null;

  // Contextual link suggestions based on guideKey
  const contextualLinksMap: Record<string, string[]> = {
    mortgage: ['/calculators/mortgage-affordability', '/calculators/rent-vs-buy', '/calculators/refinance', '/calculators/auto-loan'],
    compound: ['/calculators/goal-savings', '/calculators/inflation', '/calculators/roi', '/mortgage-calculator'],
    bmi: ['/calculators/bmr', '/calculators/water-intake', '/calculators/sleep-calculator'],
    percentage: ['/calculators/vat', '/calculators/margin', '/tip-calculator', '/salary-calculator'],
    salary: ['/calculators/freelance-net-income', '/calculators/break-even', '/percentage-finder'],
    'rent-vs-buy': ['/mortgage-calculator', '/calculators/cap-rate', '/calculators/mortgage-affordability'],
    'auto-loan': ['/mortgage-calculator', '/calculators/fuel-split', '/calculators/debt-snowball'],
    vat: ['/percentage-finder', '/calculators/margin', '/calculators/freelance-net-income'],
    bmr: ['/bmi-calculator', '/calculators/water-intake', '/calculators/sleep-calculator'],
  };

  const relatedPaths = contextualLinksMap[guideKey] || [];
  const relatedCalcs = relatedPaths
    .map(p => calculators.find(c => c.path === p))
    .filter(Boolean);

  if (!guide && !benchmark && relatedCalcs.length === 0) {
    return null;
  }

  const tableTitle = benchmark?.title[lang] || benchmark?.title.en || '';
  const tableDesc = benchmark?.description[lang] || benchmark?.description.en || '';
  const headers = benchmark?.headers[lang] || benchmark?.headers.en || [];
  const expertTip = benchmark?.expertTip?.[lang] || benchmark?.expertTip?.en || '';

  const labels = {
    en: {
      quickReference: 'Benchmark Reference Table',
      formula: 'Mathematical Formula & Calculation Method',
      expertAdvice: 'Expert Insight & Best Practices',
      exploreMore: 'Explore Related Calculators',
      applyPreset: 'Test Scenario',
    },
    he: {
      quickReference: 'טבלת נתונים ותרחישי השוואה',
      formula: 'נוסחת החישוב והסבר מתמטי מפורט',
      expertAdvice: 'תובנות מומחה וכללי אצבע',
      exploreMore: 'מחשבונים מומלצים נוספים',
      applyPreset: 'בדוק תרחיש זה',
    },
    es: {
      quickReference: 'Tabla de Referencia y Comparación',
      formula: 'Fórmula Matemática y Método de Cálculo',
      expertAdvice: 'Consejos de Expertos y Buenas Prácticas',
      exploreMore: 'Explorar Calculadoras Relacionadas',
      applyPreset: 'Probar este escenario',
    },
    fr: {
      quickReference: 'Tableau de Référence et Exemples',
      formula: 'Formule Mathématique et Méthode de Calcul',
      expertAdvice: 'Conseils d\'Experts et Bonnes Pratiques',
      exploreMore: 'Calculatrices Connexes',
      applyPreset: 'Tester ce scénario',
    },
    ar: {
      quickReference: 'جدول البيانات والمقارنات القياسية',
      formula: 'المعادلة الرياضية وطريقة الحساب',
      expertAdvice: 'نصائح الخبراء وأفضل الممارسات',
      exploreMore: 'حاسبات أخرى ذات صلة',
      applyPreset: 'اختبر هذا السيناريو',
    },
  }[lang] || {
    quickReference: 'Benchmark Reference Table',
    formula: 'Mathematical Formula & Calculation Method',
    expertAdvice: 'Expert Insight & Best Practices',
    exploreMore: 'Explore Related Calculators',
    applyPreset: 'Test Scenario',
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

      {/* Semantic Benchmark Table for Featured Snippets / Position 0 */}
      {benchmark && (
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

      {/* Mathematical Formula Breakdown */}
      {guide?.formulaHeading && (
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-[20px]">functions</span>
            {guide.formulaHeading || labels.formula}
          </h3>
          <div className="bg-stone-50 p-4 sm:p-5 rounded-xl border border-stone-200 font-mono text-xs sm:text-sm text-stone-800 space-y-2 overflow-x-auto" dir="ltr">
            {guide.formulaLines?.map((line: string, idx: number) => (
              <div key={idx} className="leading-relaxed">{line}</div>
            ))}
          </div>
        </div>
      )}

      {/* Expert E-E-A-T Insight Box */}
      {expertTip && (
        <div className="p-4 sm:p-5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-950 flex items-start gap-3.5">
          <span className="material-symbols-outlined text-amber-600 text-[24px] shrink-0 mt-0.5">lightbulb</span>
          <div className="text-xs sm:text-sm leading-relaxed">
            <span className="font-bold block mb-1">{labels.expertAdvice}</span>
            {expertTip}
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
