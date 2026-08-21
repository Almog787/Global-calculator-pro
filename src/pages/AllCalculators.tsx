import { useState, useEffect } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { calculators, getCalculatorTitle, getCalculatorDescription } from "../data/calculators";
import SEO from "../components/SEO";
import { useI18n } from "../contexts/i18n";

export default function AllCalculators() {
  const { t, lang } = useI18n();
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (categoryId) {
      setActiveCategory(categoryId);
    } else {
      const params = new URLSearchParams(location.search);
      const queryCategory = params.get("category");
      if (queryCategory) {
        setActiveCategory(queryCategory);
      } else {
        setActiveCategory("all");
      }
    }
  }, [categoryId, location.search]);

  const categories = [
    { id: "all", label: t.catAll },
    { id: "finance", label: t.catFinance },
    { id: "real-estate", label: t.catRealEstate },
    { id: "health", label: t.catHealth },
    { id: "math", label: t.catMath },
    { id: "tech", label: t.catTech },
    { id: "lifestyle", label: t.catLifestyle },
  ];

  const filtered =
    activeCategory === "all"
      ? calculators
      : calculators.filter((c) => c.category === activeCategory);

  return (
    <div className="w-full">
      <SEO
        title={t.libraryTitle}
        description={t.librarySubtitle}
        keywords={['calculators', 'AI assistant', 'Calc-E', 'finance', 'health', 'math', 'tools']}
        canonicalUrl={`/${lang}/all`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: t.title,
          description: t.librarySubtitle,
          url: `https://globalcalcpro.com/${lang}/all`,
          potentialAction: {
            '@type': 'SearchAction',
            target: `https://globalcalcpro.com/${lang}/all?search={search_term_string}`,
            'query-input': 'required name=search_term_string'
          }
        }}
      />

      {/* Hero Section */}
      <section className="mb-stack-lg text-center md:text-left rtl:md:text-right flex flex-col items-center md:items-start rtl:md:items-start">
        <h1 className="font-display-lg text-display-lg text-primary mb-stack-sm tracking-tight">
          {t.libraryTitle}
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          {t.librarySubtitle}
        </p>
      </section>

      {/* PWA Promotion Banner */}
      <section className="mb-stack-lg bg-surface-container-lowest text-on-surface rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-md border-2 border-secondary/20 hover:border-secondary/40 transition-colors relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute -top-12 -right-12 text-secondary opacity-5 pointer-events-none rtl:-left-12 rtl:right-auto">
          <span className="material-symbols-outlined text-[150px]">apps</span>
        </div>

        <div className="flex-grow z-10 text-center md:text-left rtl:md:text-right">
          <h2 className="font-headline-lg-mobile md:font-headline-lg mb-2 text-primary">{t.pwaPromoTitle}</h2>
          <p className="font-body-md text-on-surface-variant mb-4 max-w-xl">{t.pwaPromoDesc}</p>
          
          <ul className="flex flex-col md:flex-row gap-3 md:gap-6 font-label-sm text-on-surface-variant mb-6">
            <li className="flex items-center justify-center md:justify-start gap-2">
              <span className="material-symbols-outlined text-secondary text-lg">bolt</span>
              {(t as any).pwaPromoBen1 || 'Fast loading & offline'}
            </li>
            <li className="flex items-center justify-center md:justify-start gap-2">
              <span className="material-symbols-outlined text-secondary text-lg">no_sim</span>
              {(t as any).pwaPromoBen2 || 'No app store'}
            </li>
            <li className="flex items-center justify-center md:justify-start gap-2">
              <span className="material-symbols-outlined text-secondary text-lg">sd_storage</span>
              {(t as any).pwaPromoBen3 || 'Minimal storage'}
            </li>
          </ul>
          
          <div className="bg-secondary/5 border border-secondary/10 rounded-lg p-4 md:inline-block">
            <p className="font-label-bold text-secondary text-sm mb-2 flex items-center justify-center md:justify-start gap-1">
              <span className="material-symbols-outlined text-base">download</span>
              {t.dir === 'rtl' ? 'איך מתקינים?' : 'How to install?'}
            </p>
            <ol className="font-body-md text-sm list-decimal list-inside text-on-surface-variant space-y-1">
              <li>{(t as any).pwaPromoStep1 || 'Tap browser menu (⋮)'}</li>
              <li>{(t as any).pwaPromoStep2 || 'Select "Add to Home Screen"'}</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="mb-stack-lg overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex gap-4 min-w-max">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                if (cat.id === "all") {
                  navigate(`/${lang}/all`);
                } else {
                  navigate(`/${lang}/category/${cat.id}`);
                }
              }}
              className={`px-6 py-2 rounded-full font-label-bold text-label-bold transition-all ${
                activeCategory === cat.id
                  ? "bg-secondary text-on-secondary hover:shadow-md hover:-translate-y-0.5"
                  : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container hover:text-on-surface shadow-sm border border-outline-variant hover:border-secondary"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Calculator Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(180px,auto)]">
        {filtered.map((calc, index) => {
          const title = getCalculatorTitle(calc, t, lang);
          const description = getCalculatorDescription(calc, t, lang);
          
          // Bento Grid Logic: Feature specific items when viewing all
          const isFeatured = activeCategory === "all" && (index === 0 || index === 5);
          const gridSpan = isFeatured ? "md:col-span-2 md:row-span-2" : "col-span-1";
          const titleSize = isFeatured ? "text-2xl md:text-3xl font-black tracking-tight" : "text-lg font-bold tracking-tight";
          
          return (
            <Link
              key={calc.id}
              to={`/${lang}${calc.path}`}
              className={`group block bg-white rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-stone-200 hover:border-blue-500 relative overflow-hidden flex flex-col h-full ${gridSpan}`}
            >
              <div className="flex flex-col h-full z-10 relative">
                <div className="flex justify-between items-start mb-4">
                  <h3 className={`${titleSize} text-stone-900 group-hover:text-blue-600 transition-colors`}>
                    {title}
                  </h3>
                  <span className="material-symbols-outlined text-stone-300 group-hover:text-blue-600 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1 transition-transform duration-300">
                    {t.dir === 'rtl' ? 'arrow_back' : 'arrow_forward'}
                  </span>
                </div>
                <p className={`text-stone-500 mb-6 flex-grow leading-relaxed ${isFeatured ? 'md:text-lg max-w-sm' : 'text-sm'}`}>
                  {description}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {calc.tags.slice(0, isFeatured ? 5 : 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-stone-100 text-stone-600 rounded-md text-[11px] uppercase tracking-widest font-bold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {isFeatured && (
                <div className="absolute -bottom-8 -right-8 opacity-[0.03] group-hover:opacity-5 transition-opacity duration-500 pointer-events-none transform group-hover:scale-110 rtl:-left-8 rtl:right-auto">
                  <span className="material-symbols-outlined text-[200px]">calculate</span>
                </div>
              )}
            </Link>
          );
        })}
      </section>
    </div>
  );
}
