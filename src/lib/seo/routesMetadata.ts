/**
 * Single source of truth for SEO routes metadata, titles, descriptions, and JSON-LD schemas.
 */

export interface RouteMetadata {
  path: string;
  lang: 'en' | 'he' | 'es' | 'fr' | 'ar';
  title: string;
  description: string;
  category?: string;
  schemaType?: 'WebApplication' | 'SoftwareApplication' | 'WebPage' | 'AboutPage' | 'ContactPage';
}

export const SUPPORTED_LANGUAGES = ['en', 'he', 'es', 'fr', 'ar'] as const;
export type SupportedLang = typeof SUPPORTED_LANGUAGES[number];

export const STATIC_ROUTES = [
  '/',
  '/all',
  '/widgets',
  '/category/finance',
  '/category/real-estate',
  '/category/health',
  '/category/math',
  '/category/tech',
  '/category/lifestyle',
  '/contact',
  '/privacy-policy',
  '/terms-of-service',
  '/about',
  '/suggest',
] as const;

export function buildCanonicalUrl(lang: string, unlocalizedPath: string): string {
  const cleanPath = unlocalizedPath === '/' ? '' : unlocalizedPath;
  return `https://globalcalcpro.com/${lang}${cleanPath}`;
}

export function generateStructuredData(
  title: string,
  description: string,
  canonicalUrl: string,
  lang: string,
  type: string = 'WebApplication'
): Record<string, any> {
  const baseSchema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': type,
    name: title,
    description: description,
    url: canonicalUrl,
    inLanguage: lang,
  };

  if (type === 'WebApplication' || type === 'SoftwareApplication') {
    baseSchema.applicationCategory = 'UtilitiesApplication';
    baseSchema.operatingSystem = 'All';
    baseSchema.offers = {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    };
    baseSchema.browserRequirements = 'Requires JavaScript. Requires HTML5.';
  }

  return baseSchema;
}
