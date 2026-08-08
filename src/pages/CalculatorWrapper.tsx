import { useParams } from 'react-router-dom';
import { Suspense, lazy, useMemo } from 'react';
import NotFound from './NotFound';
import Breadcrumbs from '../components/Breadcrumbs';
import RelatedCalculators from '../components/RelatedCalculators';
import { calculators, getCalculatorTitle } from '../data/calculators';
import SkeletonLoader from '../components/SkeletonLoader';
import { useI18n } from '../contexts/i18n';

// Using Vite's import.meta.glob to dynamically discover all calculators in the folder.
const modules = import.meta.glob('./calculators/*.tsx');

export default function CalculatorWrapper() {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang } = useI18n();

  const Component = useMemo(() => {
    if (!slug) return null;
    
    // Find a file that matches the slug (e.g. 'auto-loan' -> 'AutoLoan.tsx')
    const match = Object.keys(modules).find(path => {
      const filename = path.split('/').pop()?.replace('.tsx', '').toLowerCase();
      const cleanSlug = slug.replace(/-/g, '').toLowerCase();
      return filename === cleanSlug;
    });

    if (match) {
      return lazy(modules[match] as any);
    }
    
    return null;
  }, [slug]);

  if (!Component) {
    return <NotFound />;
  }

  const currentPath = `/calculators/${slug}`;
  const calcData = calculators.find(c => c.path === currentPath);

  return (
    <div className="w-full">
      <Breadcrumbs items={[
        { label: t.catAll || 'Library', path: `/${lang}/all` },
        { label: calcData ? getCalculatorTitle(calcData, t, lang) : slug || 'Calculator' }
      ]} />
      
      <Suspense fallback={<SkeletonLoader />}>
        <Component />
      </Suspense>

      <RelatedCalculators currentId={currentPath} />
    </div>
  );
}
