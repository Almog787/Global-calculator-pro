import { useParams } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import NotFound from './NotFound';
import Breadcrumbs from '../components/Breadcrumbs';
import RelatedCalculators from '../components/RelatedCalculators';
import { calculators, getCalculatorTitle, getCalculatorDescription } from '../data/calculators';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorBoundary from '../components/ErrorBoundary';
import { useI18n } from '../contexts/i18n';
import SEO from '../components/SEO';

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
  const calcData = calculators.find(c => c.path === currentPath);
  const title = calcData ? getCalculatorTitle(calcData, t, lang) : (slug || 'Calculator');
  const description = calcData ? getCalculatorDescription(calcData, t, lang) : 'Free online calculator tool';
  const canonicalUrl = `/${lang}${currentPath}`;

  return (
    <div className="w-full">
      <SEO
        title={title}
        description={description}
        canonicalUrl={canonicalUrl}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: title,
          description: description,
          applicationCategory: 'CalculatorApplication',
          operatingSystem: 'Any',
          url: `https://globalcalcpro.com${canonicalUrl}`
        }}
      />

      <Breadcrumbs items={[
        { label: t.catAll || 'Library', path: `/${lang}/all` },
        { label: title }
      ]} />
      
      <ErrorBoundary>
        <Suspense fallback={<SkeletonLoader />}>
          <Component />
        </Suspense>
      </ErrorBoundary>

      <RelatedCalculators currentId={currentPath} />
    </div>
  );
}
