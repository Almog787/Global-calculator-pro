import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { calculators, getCalculatorTitle, getCalculatorDescription } from "../data/calculators";
import SEO from "../components/SEO";
import { useI18n } from "../contexts/i18n";

export default function AllCalculators() {
  const { t, lang } = useI18n();
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    if (category) {
      setActiveCategory(category);
    } else {
      setActiveCategory("all");
    }
  }, [location.search]);

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
        canonicalUrl={`/${lang}/all`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: t.libraryTitle,
          description: t.librarySubtitle,
          url: `https://globalcalcpro.com/${lang}/all`
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
              onClick={() => setActiveCategory(cat.id)}
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
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
        {filtered.map((calc) => {
          const title = getCalculatorTitle(calc, t, lang);
          const description = getCalculatorDescription(calc, t, lang);
          return (
            <Link
              key={calc.id}
              to={`/${lang}${calc.path}`}
              className="group block bg-surface-container-lowest rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-outline-variant hover:border-secondary relative overflow-hidden flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-secondary transition-colors">
                  {title}
                </h3>
                <span className="material-symbols-outlined text-outline-variant group-hover:text-secondary rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1 transition-all">
                  {t.dir === 'rtl' ? 'arrow_back' : 'arrow_forward'}
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6 flex-grow">
                {description}
              </p>
              <div className="flex flex-wrap gap-2 mt-auto">
                {calc.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-full font-label-sm text-label-sm uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
