import { useParams } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import NotFound from './NotFound';
import Breadcrumbs from '../components/Breadcrumbs';
import RelatedCalculators from '../components/RelatedCalculators';
import ShareActions from '../components/ShareActions';
import { calculators, getCalculatorTitle, getCalculatorDescription } from '../data/calculators';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorBoundary from '../components/ErrorBoundary';
import { useI18n } from '../contexts/i18n';
import SEO from '../components/SEO';
import DisclaimerNotice, { DisclaimerType } from '../components/DisclaimerNotice';
import EmbedCtaBanner from '../components/EmbedCtaBanner';

// Using Vite's import.meta.glob to dynamically discover all calculators in the folder.
const modules = import.meta.glob('./calculators/*.tsx');

const calculatorComponents: Record<string, React.LazyExoticComponent<any>> = {};

Object.keys(modules).forEach((path) => {
  const filename = path.split('/').pop()?.replace('.tsx', '').toLowerCase() || '';
  calculatorComponents[filename] = lazy(modules[path] as any);
});

export default function CalculatorWrapper() {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang } = useI18n();

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

  return (
    <div className="w-full">
      <SEO
        title={title}
        description={description}
        canonicalUrl={canonicalUrl}
        type="SoftwareApplication"
        applicationCategory="CalculatorApplication"
      />

      <Breadcrumbs items={breadcrumbItems} />
      
      <ErrorBoundary>
        <Suspense fallback={<SkeletonLoader />}>
          <Component />
        </Suspense>
      </ErrorBoundary>

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
