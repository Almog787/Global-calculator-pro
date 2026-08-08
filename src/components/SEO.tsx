import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  type?: 'website' | 'article' | 'profile' | 'product' | 'SoftwareApplication';
  structuredData?: Record<string, any>;
  image?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords = [],
  canonicalUrl,
  type = 'website',
  structuredData,
  image = 'https://globalcalcpro.com/favicon.svg' // Fallback image, could be replaced with a real open graph image
}) => {
  const siteName = 'Global Calc Pro';
  const defaultTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const baseUrl = 'https://globalcalcpro.com';
  const finalCanonicalUrl = canonicalUrl ? (canonicalUrl.startsWith('http') ? canonicalUrl : `${baseUrl}${canonicalUrl}`) : baseUrl;

  // Default WebSite structured data if none is provided
  const schemaOrgJSONLD = structuredData || {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: baseUrl,
    name: siteName,
    description: description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/all?search={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  const rawPath = finalCanonicalUrl.replace(baseUrl, '');
  const pathWithoutLang = rawPath.replace(/^\/(en|he|es|fr|ar)(\/|$)/, '$2');
  const normalizedPath = pathWithoutLang.startsWith('/') ? pathWithoutLang : `/${pathWithoutLang}`;
  const subPath = normalizedPath === '/' ? '' : normalizedPath;

  return (
    <Helmet>
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

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schemaOrgJSONLD)}
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
