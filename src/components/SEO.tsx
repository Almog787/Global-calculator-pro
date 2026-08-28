import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  type?: 'website' | 'article' | 'profile' | 'product' | 'SoftwareApplication';
  structuredData?: Record<string, any>;
  image?: string;
  noindex?: boolean;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords = [],
  canonicalUrl,
  type = 'website',
  structuredData,
  image = 'https://globalcalcpro.com/favicon.svg',
  noindex = false
}) => {
  const location = useLocation();
  const siteName = 'Global Calc Pro';
  const defaultTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const baseUrl = 'https://globalcalcpro.com';

  // Determine current pathname safely
  const currentPath = location ? location.pathname : '/en/all';
  const hasSearchParams = location ? (location.search.includes('search=') || location.search.includes('q=')) : false;
  const isNoIndex = noindex || hasSearchParams;

  // Extract language or fallback to 'en'
  const pathParts = currentPath.split('/').filter(Boolean);
  const validLangs = ['en', 'he', 'es', 'fr', 'ar'];
  const currentLang = pathParts.length > 0 && validLangs.includes(pathParts[0]) ? pathParts[0] : 'en';

  // Calculate canonical URL
  let resolvedCanonicalPath = canonicalUrl || currentPath;
  if (!resolvedCanonicalPath.startsWith('http')) {
    if (!resolvedCanonicalPath.startsWith('/')) {
      resolvedCanonicalPath = `/${resolvedCanonicalPath}`;
    }
    // Ensure language prefix exists on relative canonical
    const firstSegment = resolvedCanonicalPath.split('/')[1];
    if (!validLangs.includes(firstSegment)) {
      resolvedCanonicalPath = `/${currentLang}${resolvedCanonicalPath}`;
    }
  }

  const finalCanonicalUrl = resolvedCanonicalPath.startsWith('http') 
    ? resolvedCanonicalPath 
    : `${baseUrl}${resolvedCanonicalPath}`;

  const rawPath = finalCanonicalUrl.replace(baseUrl, '');
  const pathWithoutLang = rawPath.replace(/^\/(en|he|es|fr|ar)(\/|$)/, '$2');
  const normalizedPath = pathWithoutLang.startsWith('/') ? pathWithoutLang : `/${pathWithoutLang}`;
  const subPath = normalizedPath === '/' ? '' : normalizedPath;

  // Baseline WebPage + BreadcrumbList JSON-LD
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${finalCanonicalUrl}#webpage`,
    url: finalCanonicalUrl,
    name: defaultTitle,
    description: description,
    inLanguage: currentLang,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      url: baseUrl,
      name: siteName
    }
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${baseUrl}/${currentLang}/all`
      },
      ...(subPath ? [
        {
          '@type': 'ListItem',
          position: 2,
          name: title.replace(` | ${siteName}`, ''),
          item: finalCanonicalUrl
        }
      ] : [])
    ]
  };

  const schemasToEmit = [
    webPageSchema,
    breadcrumbSchema,
    ...(structuredData ? [structuredData] : [])
  ];

  return (
    <Helmet>
      {isNoIndex && <meta name="robots" content="noindex, follow" />}
      {!isNoIndex && <meta name="robots" content="index, follow" />}

      {/* Primary Meta Tags */}
      <title>{defaultTitle}</title>
      <meta name="title" content={defaultTitle} />
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}

      {/* Canonical Link */}
      <link rel="canonical" href={finalCanonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={finalCanonicalUrl} />
      <meta property="og:title" content={defaultTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={finalCanonicalUrl} />
      <meta property="twitter:title" content={defaultTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Structured Data Graph */}
      <script type="application/ld+json">
        {JSON.stringify(schemasToEmit)}
      </script>
    
      {/* hreflang tags for i18n */}
      <link rel="alternate" hrefLang="en" href={`${baseUrl}/en${subPath}`} />
      <link rel="alternate" hrefLang="he" href={`${baseUrl}/he${subPath}`} />
      <link rel="alternate" hrefLang="es" href={`${baseUrl}/es${subPath}`} />
      <link rel="alternate" hrefLang="fr" href={`${baseUrl}/fr${subPath}`} />
      <link rel="alternate" hrefLang="ar" href={`${baseUrl}/ar${subPath}`} />
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/en${subPath}`} />
    </Helmet>
  );
};

export default SEO;

