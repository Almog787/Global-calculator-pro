import { useParams } from 'react-router-dom';
import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import NotFound from './NotFound';
import Breadcrumbs from '../components/Breadcrumbs';
import RelatedCalculators from '../components/RelatedCalculators';
import ShareActions from '../components/ShareActions';
import { calculators, getCalculatorTitle, getCalculatorDescription } from '../data/calculators';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorBoundary from '../components/ErrorBoundary';
import { useI18n } from '../contexts/i18n';
import SEO from '../components/SEO';
import { SeoOverrideContext, FaqOverrideContext } from '../contexts/SeoOverrideContext';
import DisclaimerNotice, { DisclaimerType } from '../components/DisclaimerNotice';
import EmbedCtaBanner from '../components/EmbedCtaBanner';
import FAQ from '../components/FAQ';
import {
  buildCalculatorFallbackFaqs,
  buildCalculatorOverview,
  resolveGuideKey,
} from '../lib/seo/calculatorFallbackGuide';

// Using Vite's import.meta.glob to dynamically discover all calculators in the folder.
const modules = import.meta.glob('./calculators/*.tsx');

const calculatorComponents: Record<string, React.LazyExoticComponent<any>> = {};

Object.keys(modules).forEach((path) => {
  const filename = path.split('/').pop()?.replace('.tsx', '').toLowerCase() || '';
  calculatorComponents[filename] = lazy(modules[path] as any);
});

const INLINE_FAQ_CALC_IDS = new Set(['stock-options-rsu', 'triangle-solver', 'z-score']);

export default function CalculatorWrapper() {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang, guides } = useI18n();
  const [hasChildSeo, setHasChildSeo] = useState(false);
  const [hasChildFaq, setHasChildFaq] = useState(false);

  useEffect(() => {
    setHasChildSeo(false);
    setHasChildFaq(false);
  }, [slug]);

  const registerChildSeo = useCallback(() => {
    setHasChildSeo(true);
  }, []);

  const registerChildFaq = useCallback(() => {
    setHasChildFaq(true);
  }, []);

  const cleanSlug = slug ? slug.replace(/-/g, '').toLowerCase() : '';
  const Component = cleanSlug ? calculatorComponents[cleanSlug] : null;

  if (!Component) {
    return <NotFound />;
  }

  const currentPath = `/calculators/${slug}`;
  const calcData = calculators.find(c => 
    c.path === currentPath || 
    c.path === `/${slug}` || 
    c.id === slug || 
    c.id === cleanSlug ||
    c.path.replace(/^\/calculators\//, '').replace(/^\//, '') === cleanSlug
  );
  const title = calcData ? getCalculatorTitle(calcData, t, lang) : (slug || 'Calculator');
  const description = calcData ? getCalculatorDescription(calcData, t, lang) : 'Free online calculator tool';
  const canonicalUrl = `/${lang}${calcData?.path || currentPath}`;

  let disclaimerType: DisclaimerType = 'general';
  if (calcData?.category === 'health') {
    disclaimerType = 'medical';
  } else if (calcData?.category === 'finance' || calcData?.category === 'real-estate') {
    disclaimerType = 'financial';
  } else if (calcData?.id === 'severance-pay' || cleanSlug === 'severancepay') {
    disclaimerType = 'legal';
  }

  const categoryNames: Record<string, string> = {
    finance: t.catFinance || 'Finance',
    'real-estate': t.catRealEstate || 'Real Estate',
    health: t.catHealth || 'Health',
    math: t.catMath || 'Math',
    tech: t.catTech || 'Tech',
    lifestyle: t.catLifestyle || 'Lifestyle',
  };

  const categoryLabel = calcData?.category ? categoryNames[calcData.category] : null;
  const categoryPath = calcData?.category ? `/${lang}/category/${calcData.category}` : undefined;

  const breadcrumbItems = [
    ...(categoryLabel && categoryPath
      ? [{ label: categoryLabel, path: categoryPath }]
      : [{ label: t.catAll || 'Library', path: `/${lang}/all` }]),
    { label: title }
  ];

  const guideKey = resolveGuideKey(calcData || slug || cleanSlug);
  const guideFaq = Array.isArray(guides?.[guideKey]?.faq) ? guides[guideKey].faq : [];
  const effectiveFaq =
    guideFaq.length > 0
      ? guideFaq
      : buildCalculatorFallbackFaqs(calcData, lang, title, description, calcData?.tags || []);

  const hasInlineFaq = INLINE_FAQ_CALC_IDS.has(calcData?.id || slug || '');
  const shouldRenderFallbackContent = !hasChildFaq && !hasInlineFaq;
  const overviewContent = shouldRenderFallbackContent
    ? buildCalculatorOverview(calcData, lang, title, description)
    : null;

  return (
    <div className="w-full">
      {!hasChildSeo && (
        <SEO
          title={title}
          description={description}
          keywords={calcData?.tags || []}
          canonicalUrl={canonicalUrl}
          type="SoftwareApplication"
          faq={effectiveFaq}
          breadcrumbs={breadcrumbItems.map((b) => ({ name: b.label, url: b.path }))}
        />
      )}

      <Breadcrumbs items={breadcrumbItems} />
      
      <SeoOverrideContext.Provider value={registerChildSeo}>
        <FaqOverrideContext.Provider value={registerChildFaq}>
          <ErrorBoundary>
            <Suspense fallback={<SkeletonLoader />}>
              <Component />
            </Suspense>
          </ErrorBoundary>
        </FaqOverrideContext.Provider>
      </SeoOverrideContext.Provider>

      {overviewContent && (
        <section className="max-w-4xl mx-auto mt-8 bg-surface-container-lowest border border-border-subtle rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-on-surface">
            {overviewContent.heading}
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
            {overviewContent.summary}
          </p>
          <div className="pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-secondary mb-2.5">
              {overviewContent.pointsTitle}
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {overviewContent.points.map((pt, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 p-3 rounded-xl bg-surface-container-low border border-border-subtle/70 text-xs sm:text-sm text-on-surface"
                >
                  <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
          <FAQ items={effectiveFaq} />
        </section>
      )}

      <div className="mt-6 mb-6">
        <DisclaimerNotice type={disclaimerType} />
      </div>

      <EmbedCtaBanner
        calculatorId={calcData?.id || cleanSlug}
        calculatorTitle={title}
      />

      <div className="mt-6 mb-8">
        <ShareActions calculatorTitle={title} calculatorPath={currentPath} />
      </div>

      <RelatedCalculators currentId={currentPath} />
    </div>
  );
}

