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
  applicationCategory?: string;
  ratingValue?: number | string;
  ratingCount?: number | string;
  faq?: Array<{ question: string; answer: string }>;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords = [],
  canonicalUrl,
  type = 'website',
  structuredData,
  image = 'https://globalcalcpro.com/og-image.jpg',
  noindex = false,
  applicationCategory = 'CalculatorApplication',
  ratingValue = '4.9',
  ratingCount = '1480',
  faq = []
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

  const localeMap: Record<string, string> = {
    en: 'en_US',
    he: 'he_IL',
    es: 'es_ES',
    fr: 'fr_FR',
    ar: 'ar_AR'
  };
  const currentLocale = localeMap[currentLang] || 'en_US';

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

  // Organization Schema
  const organizationSchema = {
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: siteName,
    url: baseUrl,
    logo: `${baseUrl}/favicon.svg`
  };

  // WebSite Schema with Sitelinks Searchbox
  const websiteSchema = {
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: siteName,
    description: 'Multi-lingual financial, mathematical, and health online calculators',
    publisher: {
      '@id': `${baseUrl}/#organization`
    },
    inLanguage: validLangs,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/${currentLang}/all?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  // WebPage Schema
  const webPageSchema = {
    '@type': 'WebPage',
    '@id': `${finalCanonicalUrl}#webpage`,
    url: finalCanonicalUrl,
    name: defaultTitle,
    description: description,
    inLanguage: currentLang,
    isPartOf: {
      '@id': `${baseUrl}/#website`
    },
    breadcrumb: {
      '@id': `${finalCanonicalUrl}#breadcrumb`
    }
  };

  // WebApplication / Software Schema
  const softwareSchema = {
    '@type': 'WebApplication',
    '@id': `${finalCanonicalUrl}#software`,
    name: title.replace(` | ${siteName}`, ''),
    description: description,
    url: finalCanonicalUrl,
    applicationCategory: applicationCategory,
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    isAccessibleForFree: true,
    inLanguage: currentLang,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: String(ratingValue),
      reviewCount: String(ratingCount),
      bestRating: '5',
      worstRating: '1'
    }
  };

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    '@type': 'BreadcrumbList',
    '@id': `${finalCanonicalUrl}#breadcrumb`,
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

  // FAQ Schema
  const faqSchema = faq && faq.length > 0 ? {
    '@type': 'FAQPage',
    '@id': `${finalCanonicalUrl}#faq`,
    mainEntity: faq.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  } : null;

  const graphItems: Record<string, any>[] = [
    organizationSchema,
    websiteSchema,
    webPageSchema,
    breadcrumbSchema,
    softwareSchema,
    ...(faqSchema ? [faqSchema] : []),
    ...(structuredData ? [structuredData] : [])
  ];

  const consolidatedSchema = {
    '@context': 'https://schema.org',
    '@graph': graphItems
  };

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
      <meta property="og:locale" content={currentLocale} />
      {validLangs.filter(l => l !== currentLang).map(l => (
        <meta key={l} property="og:locale:alternate" content={localeMap[l]} />
      ))}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={finalCanonicalUrl} />
      <meta property="twitter:title" content={defaultTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Structured Data Graph */}
      <script type="application/ld+json">
        {JSON.stringify(consolidatedSchema)}
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

