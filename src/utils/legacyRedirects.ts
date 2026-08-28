/**
 * URL normalization and legacy 301-equivalent redirect resolver.
 * Maps legacy URLs (WordPress blog posts, .html extensions, trailing slashes, unlocalized routes)
 * to their current clean canonical destinations.
 */

const VALID_LANGS = ['en', 'he', 'es', 'fr', 'ar'] as const;
type ValidLang = (typeof VALID_LANGS)[number];

const KNOWN_BASE_ROUTES = [
  'all',
  'mortgage-calculator',
  'compound-interest',
  'percentage-finder',
  'unit-converter',
  'bmi-calculator',
  'tip-calculator',
  'salary-calculator',
  'age-calculator',
  'contact',
  'privacy-policy',
  'terms-of-service',
  'about',
  'suggest',
];

export function getCanonicalRedirect(pathname: string, currentLang: string = 'en'): string | null {
  if (!pathname || pathname === '/') return null;

  // 1. Clean path: remove trailing slash, lowercase check
  let raw = pathname.trim();
  
  // Ignore external or asset links
  if (raw.startsWith('/assets/') || raw.startsWith('/images/') || raw.includes('.')) {
    // If it has .html or .htm extension, strip it
    if (raw.endsWith('.html') || raw.endsWith('.htm')) {
      raw = raw.replace(/\.html?$/i, '');
    } else {
      return null;
    }
  }

  // Remove trailing slashes (e.g. /percentage/ -> /percentage)
  while (raw.length > 1 && raw.endsWith('/')) {
    raw = raw.slice(0, -1);
  }

  // 2. Extract potential language prefix
  const parts = raw.split('/').filter(Boolean);
  let lang: ValidLang = (VALID_LANGS.includes(currentLang as ValidLang) ? currentLang : 'en') as ValidLang;
  let subPathParts = parts;

  if (parts.length > 0 && VALID_LANGS.includes(parts[0] as ValidLang)) {
    lang = parts[0] as ValidLang;
    subPathParts = parts.slice(1);
  }

  const subPath = subPathParts.join('/');
  const subPathLower = subPath.toLowerCase();

  // 3. Match legacy blog posts / date-based URLs from WordPress / Search Console
  if (raw.includes('/2026/') || raw.startsWith('/2026') || subPath.startsWith('2026/') || subPathLower.includes('insights/')) {
    if (subPathLower.includes('percentage') || subPathLower.includes('mental-math') || subPathLower.includes('happiness-roi')) {
      return `/${lang}/percentage-finder`;
    }
    if (subPathLower.includes('compound-interest') || subPathLower.includes('savings-illusion') || subPathLower.includes('high-yield')) {
      return `/${lang}/compound-interest`;
    }
    if (subPathLower.includes('shrinkflation') || subPathLower.includes('iran-negotiations') || subPathLower.includes('inflation')) {
      return `/${lang}/calculators/inflation`;
    }
    if (subPathLower.includes('tech-as-your-personal-time-machine') || subPathLower.includes('download-time') || subPathLower.includes('time-machine')) {
      return `/${lang}/calculators/download-time`;
    }
    if (subPathLower.includes('hormuz') || subPathLower.includes('gas-prices') || subPathLower.includes('fuel')) {
      return `/${lang}/calculators/fuel-split`;
    }
    if (subPathLower.includes('silver-tax') || subPathLower.includes('severance')) {
      return `/${lang}/calculators/severance-pay`;
    }
    if (subPathLower.includes('wallet-feels-the-squeeze') || subPathLower.includes('finances') || subPathLower.includes('reskilling')) {
      return `/${lang}/category/finance`;
    }
    // Default blog fallback to library
    return `/${lang}/all`;
  }

  // 4. Exact legacy single-slug mappings
  const legacyAliases: Record<string, string> = {
    'percentage': 'percentage-finder',
    'percent': 'percentage-finder',
    'percent-finder': 'percentage-finder',
    'percentage-calculator': 'percentage-finder',
    'percentages': 'percentage-finder',
    'mortgage': 'mortgage-calculator',
    'compound': 'compound-interest',
    'interest': 'compound-interest',
    'bmi': 'bmi-calculator',
    'tip': 'tip-calculator',
    'tips': 'tip-calculator',
    'salary': 'salary-calculator',
    'age': 'age-calculator',
    'unit': 'unit-converter',
    'units': 'unit-converter',
    'privacy': 'privacy-policy',
    'privacy-policy': 'privacy-policy',
    'terms': 'terms-of-service',
    'terms-of-service': 'terms-of-service',
    'about-us': 'about',
    'contact-us': 'contact',
    'suggest-feature': 'suggest',
    'insights': 'all',
  };

  if (legacyAliases[subPathLower]) {
    const canonicalSub = legacyAliases[subPathLower];
    const canonicalTarget = `/${lang}/${canonicalSub}`;
    if (canonicalTarget !== pathname) {
      return canonicalTarget;
    }
  }

  // 5. Handle unlocalized direct calculator routes (e.g. /compound-interest -> /en/compound-interest)
  if (parts.length > 0 && !VALID_LANGS.includes(parts[0] as ValidLang)) {
    // If it's a known route like "compound-interest", "calculators/xyz", "category/abc"
    if (KNOWN_BASE_ROUTES.includes(parts[0]) || parts[0] === 'calculators' || parts[0] === 'category') {
      return `/${lang}/${subPath}`;
    }
  }

  // 6. Trailing slash cleanup on already localized routes (e.g. /en/percentage-finder/ -> /en/percentage-finder)
  if (pathname.endsWith('/') && pathname !== '/') {
    const cleaned = pathname.replace(/\/+$/, '');
    if (cleaned !== pathname) {
      return cleaned;
    }
  }

  return null;
}
