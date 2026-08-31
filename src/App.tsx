import VirtualAssistant from "./components/VirtualAssistant";
import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Routes, Route, Link, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
const MortgageCalculator = lazy(() => import('./pages/MortgageCalculator'));
const CompoundInterest = lazy(() => import('./pages/CompoundInterest'));
const PercentageFinder = lazy(() => import('./pages/PercentageFinder'));
const UnitConverter = lazy(() => import('./pages/UnitConverter'));
const BmiCalculator = lazy(() => import('./pages/BmiCalculator'));
const TipCalculator = lazy(() => import('./pages/TipCalculator'));
const SalaryCalculator = lazy(() => import('./pages/SalaryCalculator'));
const AgeCalculator = lazy(() => import('./pages/AgeCalculator'));
const AllCalculators = lazy(() => import('./pages/AllCalculators'));
const CalculatorWrapper = lazy(() => import('./pages/CalculatorWrapper'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const SuggestFeature = lazy(() => import('./pages/SuggestFeature'));
const NotFound = lazy(() => import('./pages/NotFound'));

import { useI18n } from './contexts/i18n';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import SkeletonLoader from './components/SkeletonLoader';
import { getCanonicalRedirect } from './utils/legacyRedirects';
import { initWebMCP } from './lib/webmcp';

function App() {
  const { lang, setLang, t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    initWebMCP();
  }, []);
  const prevPath = useRef(location.pathname);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Global input tracking for assistant
  useEffect(() => {
    let debounceTimer: NodeJS.Timeout;
    
    const handleInput = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'SELECT') {
        clearTimeout(debounceTimer);
        
        // Make the assistant "think" while typing
        if (typeof window !== 'undefined' && (window as any).CalcE) {
          (window as any).CalcE.triggerEmotion('thinking', 'מחשב...');
        }
        
        // Back to idle after stopped typing
        debounceTimer = setTimeout(() => {
           if (typeof window !== 'undefined' && (window as any).CalcE) {
              (window as any).CalcE.triggerEmotion('success', 'התעדכן!');
           }
        }, 1200);
      }
    };

    document.addEventListener('input', handleInput);
    return () => {
      document.removeEventListener('input', handleInput);
      clearTimeout(debounceTimer);
    };
  }, []);

  useEffect(() => {
    const currentPath = location.pathname;

    // Trigger assistant greeting on route change if navigating to a specific calculator
    if (prevPath.current !== currentPath) {
      if (typeof window !== 'undefined' && (window as any).CalcE) {
        // Find if it's a calculator path
        if (currentPath !== `/${lang}/all` && currentPath.split('/').length > 2) {
           setTimeout(() => {
             (window as any).CalcE.triggerEmotion('success', 'מוכן לחישוב!');
           }, 800);
        }
      }
    }

    // 301-equivalent redirect for legacy WordPress blog URLs, .html extensions, and trailing slashes
    const redirectPath = getCanonicalRedirect(currentPath, lang);
    if (redirectPath && redirectPath !== currentPath) {
      navigate(redirectPath + location.search, { replace: true });
      return;
    }

    // Scroll to relevant section logic
    const isCategoryView = currentPath.includes('/category/');
    const isAllView = currentPath.endsWith('/all');
    const wasCategoryOrAll = prevPath.current.includes('/category/') || prevPath.current.endsWith('/all');

    if (prevPath.current !== currentPath) {
      if ((isCategoryView || isAllView) && wasCategoryOrAll) {
        // Navigating between categories: Scroll to filters so they stay in view
        setTimeout(() => {
          const filterEl = document.getElementById('category-filters');
          if (filterEl) {
            const y = filterEl.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: y, behavior: 'smooth' });
          } else {
            window.scrollTo({ top: 0, behavior: "instant" });
          }
        }, 10);
      } else if (isCategoryView && !wasCategoryOrAll) {
        // Came from a calculator to a specific category: scroll to filters
        setTimeout(() => {
          const filterEl = document.getElementById('category-filters');
          if (filterEl) {
            const y = filterEl.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: y, behavior: 'smooth' });
          } else {
            window.scrollTo({ top: 0, behavior: "instant" });
          }
        }, 100); // slightly longer timeout to allow page render
      } else {
        // General page transitions (e.g. going to a calculator, or going to /all from calculator)
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    }

    prevPath.current = currentPath;
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.search, lang, navigate]);

  const navLinks = [
    { id: 'finance', path: `/${lang}/category/finance`, label: t.catFinance },
    { id: 'real-estate', path: `/${lang}/category/real-estate`, label: t.catRealEstate },
    { id: 'health', path: `/${lang}/category/health`, label: t.catHealth },
    { id: 'math', path: `/${lang}/category/math`, label: t.catMath },
    { id: 'all', path: `/${lang}/all`, label: t.catAll },
  ];

  const isEmbed = new URLSearchParams(location.search).get('embed') === 'true';

  return (
    <div className={`min-h-screen bg-surface-bg text-on-surface antialiased flex flex-col font-body-md ${t.dir === 'rtl' ? 'rtl' : 'ltr'} ${isEmbed ? 'is-embed-mode' : ''}`}>
      {/* TopNavBar */}
      {!isEmbed && (
        <nav className="bg-surface shadow-xs top-0 sticky z-50 border-b border-border-subtle">
        <div className="flex justify-between items-center px-4 sm:px-margin-desktop py-4 w-full max-w-container-max mx-auto">
          {/* Brand & Mobile Menu Toggle */}
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-lg border border-border-subtle bg-surface-container-lowest flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined text-[22px]">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>

            <Link to={`/${lang}`} className="font-headline-md text-headline-md font-bold text-primary hover:text-secondary transition-colors duration-200 cursor-pointer flex items-center">
              <span>{t.title}</span><span className="text-secondary">.</span>
            </Link>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                to={link.path}
                className="text-secondary hover:text-primary-container font-label-bold text-label-bold transition-colors cursor-pointer whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Trailing Action */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Bar */}
            <div className="hidden lg:block w-48 xl:w-56">
              <SearchBar />
            </div>

            {/* Language Selector */}
            <select 
              value={lang} 
              onChange={(e) => {
                const newLang = e.target.value as any;
                const currentPath = location.pathname;
                const match = currentPath.match(/^\/(en|he|es|fr|ar)(\/|$)/);
                let newPath: string;
                if (match) {
                  newPath = currentPath.replace(/^\/[^/]+/, `/${newLang}`);
                } else {
                  newPath = `/${newLang}${currentPath}`;
                }
                if (newPath === `/${newLang}/`) newPath = `/${newLang}`;
                setLang(newLang);
                navigate(newPath + location.search);
              }}
              aria-label="Select Language"
              className="bg-surface-container-lowest border border-border-subtle text-on-surface text-xs sm:text-sm rounded-lg px-2.5 py-2 cursor-pointer focus:outline-none focus:border-secondary transition-colors font-medium h-10"
            >
              <option value="he">עברית</option>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
            </select>

            {/* Suggest Button */}
            <Link 
              to={`/${lang}/suggest`} 
              className="font-label-bold text-xs sm:text-label-bold bg-secondary text-on-secondary px-3.5 sm:px-4 py-2 rounded-lg hover:bg-on-secondary-container transition-all duration-200 active:scale-95 border border-[#005144] whitespace-nowrap hidden sm:flex items-center gap-1.5 h-10"
            >
              <span className="material-symbols-outlined text-sm sm:text-base">add_circle</span>
              <span>{t.suggestionsTitle || 'Suggest a Feature'}</span>
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden px-4 pb-3 w-full max-w-container-max mx-auto">
          <SearchBar />
        </div>

        {/* Mobile Dropdown Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border-subtle bg-surface-container-lowest px-4 py-4 space-y-2 animate-fadeIn shadow-lg">
            <div className="grid grid-cols-1 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-container-low text-on-surface font-label-bold text-sm transition-colors"
                >
                  <span>{link.label}</span>
                </Link>
              ))}
              <Link
                to={`/${lang}/suggest`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-secondary text-on-secondary font-label-bold text-sm transition-colors mt-2"
              >
                <span className="material-symbols-outlined text-base">add_circle</span>
                <span>{t.suggestionsTitle || 'Suggest a Feature'}</span>
              </Link>
            </div>
          </div>
        )}
      </nav>
      )}

      {/* Main Content */}
      <main id="main-content" className={`flex-grow w-full max-w-container-max mx-auto px-4 sm:px-margin-desktop py-6 sm:py-8 md:py-12 ${isEmbed ? 'pb-16' : ''}`}>
        <Suspense fallback={<SkeletonLoader />}>
          <Routes>
            <Route path="/" element={<Navigate to={`/${lang}/all`} replace />} />

            {/* Direct unlocalized root redirects to language prefix */}
            <Route path="/all" element={<Navigate to={`/${lang}/all`} replace />} />
            <Route path="/percentage" element={<Navigate to={`/${lang}/percentage-finder`} replace />} />
            <Route path="/percent" element={<Navigate to={`/${lang}/percentage-finder`} replace />} />
            <Route path="/percentage-calculator" element={<Navigate to={`/${lang}/percentage-finder`} replace />} />
            <Route path="/percent-finder" element={<Navigate to={`/${lang}/percentage-finder`} replace />} />
            <Route path="/percentage-finder" element={<Navigate to={`/${lang}/percentage-finder`} replace />} />
            <Route path="/compound-interest" element={<Navigate to={`/${lang}/compound-interest`} replace />} />
            <Route path="/mortgage-calculator" element={<Navigate to={`/${lang}/mortgage-calculator`} replace />} />
            <Route path="/unit-converter" element={<Navigate to={`/${lang}/unit-converter`} replace />} />
            <Route path="/bmi-calculator" element={<Navigate to={`/${lang}/bmi-calculator`} replace />} />
            <Route path="/tip-calculator" element={<Navigate to={`/${lang}/tip-calculator`} replace />} />
            <Route path="/salary-calculator" element={<Navigate to={`/${lang}/salary-calculator`} replace />} />
            <Route path="/age-calculator" element={<Navigate to={`/${lang}/age-calculator`} replace />} />
            <Route path="/privacy" element={<Navigate to={`/${lang}/privacy-policy`} replace />} />
            <Route path="/privacy-policy" element={<Navigate to={`/${lang}/privacy-policy`} replace />} />
            <Route path="/terms" element={<Navigate to={`/${lang}/terms-of-service`} replace />} />
            <Route path="/terms-of-service" element={<Navigate to={`/${lang}/terms-of-service`} replace />} />
            <Route path="/about" element={<Navigate to={`/${lang}/about`} replace />} />
            <Route path="/about-us" element={<Navigate to={`/${lang}/about`} replace />} />
            <Route path="/contact" element={<Navigate to={`/${lang}/contact`} replace />} />
            <Route path="/contact-us" element={<Navigate to={`/${lang}/contact`} replace />} />
            <Route path="/suggest" element={<Navigate to={`/${lang}/suggest`} replace />} />

            {/* Localized Routing */}
            <Route path="/:urlLang/*" element={<LocalizedRoutes />} />
          </Routes>
        </Suspense>
      </main>

      {!isEmbed && <VirtualAssistant />}
      {!isEmbed && <Footer />}

      {isEmbed && (
        <div className="fixed bottom-0 left-0 w-full bg-surface border-t border-border-subtle p-2 text-center text-xs font-semibold z-50">
           <a href={`https://globalcalc.pro/${lang}/all`} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline flex items-center justify-center gap-1">
             Powered by GlobalCalc
             <span className="material-symbols-outlined text-[14px]">open_in_new</span>
           </a>
        </div>
      )}
    </div>
  );
}

export default App;

function LocalizedRoutes() {
  const { urlLang } = useParams<{ urlLang: string }>();
  const { lang: contextLang, setLang } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const validLangs = ['en', 'he', 'es', 'fr', 'ar'];
    if (urlLang && validLangs.includes(urlLang) && urlLang !== contextLang) {
      setLang(urlLang as any);
    } else if (urlLang && !validLangs.includes(urlLang)) {
      const targetLang = contextLang || 'en';
      const redirect = getCanonicalRedirect(location.pathname, targetLang);
      if (redirect && redirect !== location.pathname) {
        navigate(redirect + location.search, { replace: true });
      } else {
        navigate(`/${targetLang}${location.pathname}${location.search}`, { replace: true });
      }
    }
  }, [urlLang, contextLang, setLang, navigate, location.pathname, location.search]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="all" replace />} />
      <Route path="all" element={<AllCalculators />} />
      <Route path="category/:categoryId" element={<AllCalculators />} />
      <Route path="mortgage-calculator" element={<MortgageCalculator />} />
      <Route path="compound-interest" element={<CompoundInterest />} />
      <Route path="percentage-finder" element={<PercentageFinder />} />

      {/* Aliases inside language prefix */}
      <Route path="percentage" element={<Navigate to="../percentage-finder" replace />} />
      <Route path="percent" element={<Navigate to="../percentage-finder" replace />} />
      <Route path="percentage-calculator" element={<Navigate to="../percentage-finder" replace />} />
      <Route path="percent-finder" element={<Navigate to="../percentage-finder" replace />} />

      <Route path="unit-converter" element={<UnitConverter />} />
      <Route path="bmi-calculator" element={<BmiCalculator />} />
      <Route path="tip-calculator" element={<TipCalculator />} />
      <Route path="salary-calculator" element={<SalaryCalculator />} />
      <Route path="age-calculator" element={<AgeCalculator />} />
      <Route path="calculators/:slug" element={<CalculatorWrapper />} />
      <Route path="contact" element={<ContactUs />} />
      <Route path="contact-us" element={<Navigate to="../contact" replace />} />
      <Route path="privacy-policy" element={<PrivacyPolicy />} />
      <Route path="privacy" element={<Navigate to="../privacy-policy" replace />} />
      <Route path="terms-of-service" element={<TermsOfService />} />
      <Route path="terms" element={<Navigate to="../terms-of-service" replace />} />
      <Route path="about" element={<AboutUs />} />
      <Route path="about-us" element={<Navigate to="../about" replace />} />
      <Route path="suggest" element={<SuggestFeature />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
