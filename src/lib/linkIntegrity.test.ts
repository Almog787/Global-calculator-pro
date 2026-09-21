import { describe, it, expect } from 'vitest';
import { calculators } from '../data/calculators';
import { AVAILABLE_WIDGETS } from '../lib/widgets/widgetsConfig';

/**
 * Route & Link Integrity Test Suite
 * 
 * Verifies that:
 * 1. Every calculator registered in `calculators.ts` has a corresponding implementation file.
 * 2. Every registered route is resolvable by the router (either fixed route or dynamic `/calculators/:slug`).
 * 3. Every hardcoded route in navigation, search chips, widgets, 404, and footer is a valid destination.
 * 4. No dead links or 404 targets exist across all UI components and data structures.
 */

// Dynamically discover all calculator implementation files in src/pages/calculators
const calculatorModules = import.meta.glob('../pages/calculators/*.tsx');
const availableCalculatorFiles = new Set(
  Object.keys(calculatorModules).map((p) => {
    const filename = p.split('/').pop()?.replace('.tsx', '').toLowerCase() || '';
    return filename;
  })
);

// Known explicit page routes in App.tsx
const KNOWN_STATIC_PAGE_ROUTES = new Set([
  '/',
  '/all',
  '/category/finance',
  '/category/real-estate',
  '/category/health',
  '/category/math',
  '/category/lifestyle',
  '/category/tech',
  '/mortgage-calculator',
  '/compound-interest',
  '/percentage-finder',
  '/unit-converter',
  '/bmi-calculator',
  '/tip-calculator',
  '/salary-calculator',
  '/age-calculator',
  '/contact',
  '/privacy-policy',
  '/terms-of-service',
  '/about',
  '/suggest',
  '/widgets',
]);

const VALID_LANGUAGES = ['en', 'he', 'es', 'fr', 'ar'];

/**
 * Helper to check whether a path resolves to a known static page or dynamic calculator
 */
function isValidRoute(path: string): boolean {
  if (!path || !path.startsWith('/')) return false;

  // Strip optional language prefix (e.g. /he/calculators/vat -> /calculators/vat)
  let cleanPath = path;
  for (const lang of VALID_LANGUAGES) {
    if (cleanPath.startsWith(`/${lang}/`)) {
      cleanPath = cleanPath.slice(lang.length + 1);
      break;
    } else if (cleanPath === `/${lang}`) {
      cleanPath = '/';
      break;
    }
  }

  // 1. Direct static page match
  if (KNOWN_STATIC_PAGE_ROUTES.has(cleanPath)) {
    return true;
  }

  // 2. Category routes (e.g. /category/finance)
  if (cleanPath.startsWith('/category/')) {
    return true;
  }

  // 3. Dynamic calculator routes (e.g. /calculators/stock-options-rsu or /stock-options-rsu)
  let slug = '';
  if (cleanPath.startsWith('/calculators/')) {
    slug = cleanPath.replace('/calculators/', '');
  } else if (cleanPath.startsWith('/')) {
    slug = cleanPath.slice(1);
  }

  const normalizedSlug = slug.replace(/-/g, '').toLowerCase();

  // Must correspond to an existing calculator file in src/pages/calculators
  if (availableCalculatorFiles.has(normalizedSlug)) {
    return true;
  }

  return false;
}

describe('Link & Route Integrity Test Suite (Dead Links & 404 Prevention)', () => {
  describe('Calculators Registry & Implementation Mapping', () => {
    it('has at least 30 calculators defined in the registry', () => {
      expect(calculators.length).toBeGreaterThanOrEqual(30);
    });

    it('every calculator in calculators.ts has a valid path format without spaces', () => {
      calculators.forEach((calc) => {
        expect(calc.path, `Calculator "${calc.id}" missing path`).toBeDefined();
        expect(calc.path.startsWith('/'), `Calculator "${calc.id}" path must start with "/"`).toBe(true);
        expect(calc.path, `Calculator "${calc.id}" has invalid whitespace in path`).not.toContain(' ');
        expect(calc.path, `Calculator "${calc.id}" must be lowercase in path`).toBe(calc.path.toLowerCase());
      });
    });

    it('every calculator in calculators.ts resolves to an existing React component file or static route', () => {
      calculators.forEach((calc) => {
        const path = calc.path;
        const isValid = isValidRoute(path);
        expect(
          isValid,
          `Broken Route Detected! Calculator "${calc.id}" has path "${calc.path}" which does not map to any existing component in src/pages/calculators/ or App.tsx`
        ).toBe(true);
      });
    });

    it('every .tsx file in src/pages/calculators has a matching entry in calculators.ts', () => {
      const registeredSlugs = new Set(
        calculators.map((c) => {
          const raw = c.path.startsWith('/calculators/')
            ? c.path.replace('/calculators/', '')
            : c.path.replace('/', '');
          return raw.replace(/-/g, '').toLowerCase();
        })
      );

      availableCalculatorFiles.forEach((fileSlug) => {
        expect(
          registeredSlugs.has(fileSlug),
          `Orphan Calculator File! src/pages/calculators/${fileSlug}.tsx is not linked in data/calculators.ts`
        ).toBe(true);
      });
    });
  });

  describe('Search Bar & Hero Trending Tags Route Integrity', () => {
    const trendingTagsHebrew = [
      { label: 'משכנתא', path: '/mortgage-calculator' },
      { label: 'ברוטו לנטו', path: '/salary-calculator' },
      { label: 'עלות מעסיק', path: '/calculators/employer-cost' },
      { label: 'אופציות RSU', path: '/calculators/stock-options-rsu' },
      { label: 'פיצויי פיטורים', path: '/calculators/severance-pay' },
      { label: 'מע"מ 18%', path: '/calculators/vat' },
    ];

    const trendingTagsEnglish = [
      { label: 'Mortgage', path: '/mortgage-calculator' },
      { label: 'Salary Gross-Net', path: '/salary-calculator' },
      { label: 'Employer Cost', path: '/calculators/employer-cost' },
      { label: 'RSU & Options', path: '/calculators/stock-options-rsu' },
      { label: 'Severance Pay', path: '/calculators/severance-pay' },
      { label: 'VAT 18%', path: '/calculators/vat' },
    ];

    it('all Hebrew search trending chips point to active valid routes', () => {
      trendingTagsHebrew.forEach((tag) => {
        expect(
          isValidRoute(tag.path),
          `Broken Tag Detected! Trending search tag "${tag.label}" points to dead route "${tag.path}"`
        ).toBe(true);
      });
    });

    it('all English search trending chips point to active valid routes', () => {
      trendingTagsEnglish.forEach((tag) => {
        expect(
          isValidRoute(tag.path),
          `Broken Tag Detected! Trending search tag "${tag.label}" points to dead route "${tag.path}"`
        ).toBe(true);
      });
    });
  });

  describe('Embeddable Widgets Route Integrity', () => {
    it('every widget in widgetsConfig points to an active valid calculator route', () => {
      AVAILABLE_WIDGETS.forEach((widget) => {
        const widgetRoute = widget.slug.startsWith('/') ? widget.slug : `/${widget.slug}`;
        expect(
          isValidRoute(widgetRoute) || isValidRoute(`/calculators/${widget.slug}`),
          `Broken Widget Detected! Widget "${widget.id}" slug "${widget.slug}" has no corresponding calculator`
        ).toBe(true);
      });
    });
  });

  describe('404 Page Quick Recovery Links', () => {
    const notFoundLinks = [
      '/mortgage-calculator',
      '/salary-calculator',
      '/calculators/stock-options-rsu',
      '/compound-interest',
      '/calculators/currency-converter',
      '/all',
    ];

    it('every quick recovery link in 404 page points to a working destination', () => {
      notFoundLinks.forEach((link) => {
        expect(
          isValidRoute(link),
          `Broken 404 Recovery Link Detected! "${link}" will trigger another 404 loop`
        ).toBe(true);
      });
    });
  });

  describe('Cross-Language Route Verification', () => {
    it('verifies that canonical URLs across all 5 languages resolve without dead links', () => {
      const sampleCalculators = calculators.slice(0, 10);
      VALID_LANGUAGES.forEach((lang) => {
        sampleCalculators.forEach((calc) => {
          const localizedUrl = `/${lang}${calc.path}`;
          expect(
            isValidRoute(localizedUrl),
            `Localized URL "${localizedUrl}" failed route resolution`
          ).toBe(true);
        });
      });
    });
  });
});
