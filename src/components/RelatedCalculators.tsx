import { Link } from "react-router-dom";
import { getRelatedCalculators, getCalculatorTitle, getCalculatorDescription, calculators } from "../data/calculators";
import { useI18n } from "../contexts/i18n";

export default function RelatedCalculators({
  currentId,
  limit = 4,
}: {
  currentId: string;
  limit?: number;
}) {
  const { t, lang } = useI18n();
  const related = getRelatedCalculators(currentId, limit);

  if (related.length === 0) return null;

  // Detect category from the current calculator or related ones
  const currentCalc = calculators.find(
    (c) => c.id === currentId || c.path === currentId || c.path === `/${currentId}` || c.path === `/calculators/${currentId}`
  );
  const targetCategory = currentCalc?.category || related[0]?.category;

  const headings: Record<string, string> = {
    en: 'Related & Recommended Calculators',
    he: 'מחשבונים קשורים ומומלצים',
    es: 'Calculadoras Relacionadas y Recomendadas',
    fr: 'Calculatrices Associées & Recommandées',
    ar: 'حاسبات ذات صلة وموصى بها'
  };

  const viewCategoryLabels: Record<string, string> = {
    en: 'Explore all in this category',
    he: 'לכל הכלים בקטגוריה זו',
    es: 'Ver todas en esta categoría',
    fr: 'Voir tous les outils de cette catégorie',
    ar: 'استكشف كافة الأدوات في هذا القسم'
  };

  const sectionHeading = headings[lang] || headings.en;
  const viewCategoryLabel = viewCategoryLabels[lang] || viewCategoryLabels.en;

  const categoryNames: Record<string, string> = {
    finance: t.catFinance || 'Finance',
    'real-estate': t.catRealEstate || 'Real Estate',
    health: t.catHealth || 'Health',
    math: t.catMath || 'Math',
    tech: t.catTech || 'Tech',
    lifestyle: t.catLifestyle || 'Lifestyle',
  };

  return (
    <nav
      aria-label={sectionHeading}
      className="mt-14 pt-8 border-t border-stone-200 dark:border-stone-800"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h2 className="text-base font-bold tracking-tight text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-lg">
              hub
            </span>
            <span>{sectionHeading}</span>
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            {lang === 'he'
              ? 'כלים משלימים שיסייעו לך לקבל תמונה מלאה ומדויקת יותר'
              : 'Complementary tools designed to help you verify data and plan ahead'}
          </p>
        </div>

        {targetCategory && (
          <Link
            to={`/${lang}/category/${targetCategory}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline transition-colors shrink-0"
          >
            <span>{viewCategoryLabel}</span>
            <span className="material-symbols-outlined text-[14px] rtl:rotate-180">
              arrow_forward
            </span>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {related.map((calc) => {
          const catName = categoryNames[calc.category] || calc.category;
          return (
            <Link
              key={calc.id}
              to={`/${lang}${calc.path}`}
              className="group flex flex-col justify-between p-4 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                    {catName}
                  </span>
                  <span className="material-symbols-outlined text-[15px] text-stone-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:rotate-180 transition-all">
                    arrow_forward
                  </span>
                </div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 mb-1.5">
                  {getCalculatorTitle(calc, t, lang)}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
                  {getCalculatorDescription(calc, t, lang)}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 font-medium transition-colors">
                <span>{lang === 'he' ? 'פתח מחשבון' : 'Open Calculator'}</span>
                <span className="material-symbols-outlined text-[13px] rtl:rotate-180">
                  trending_flat
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
