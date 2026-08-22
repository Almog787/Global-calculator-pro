import VirtualAssistant from "./components/VirtualAssistant";
import { lazy, Suspense, useEffect, useState } from 'react';
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

function App() {
  const { lang, setLang, t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { id: 'finance', path: `/${lang}/category/finance`, label: t.catFinance },
    { id: 'real-estate', path: `/${lang}/category/real-estate`, label: t.catRealEstate },
    { id: 'health', path: `/${lang}/category/health`, label: t.catHealth },
    { id: 'math', path: `/${lang}/category/math`, label: t.catMath },
    { id: 'all', path: `/${lang}/all`, label: t.catAll },
  ];

  return (
    <div className={`min-h-screen bg-surface-bg text-on-surface antialiased flex flex-col font-body-md ${t.dir === 'rtl' ? 'rtl' : 'ltr'}`}>
      {/* TopNavBar */}
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

      {/* Main Content */}
      <main id="main-content" className="flex-grow w-full max-w-container-max mx-auto px-4 sm:px-margin-desktop py-6 sm:py-8 md:py-12">
        <Suspense fallback={<SkeletonLoader />}>
          <Routes>
            <Route path="/" element={<Navigate to={`/${lang}/all`} replace />} />
            <Route path="/:urlLang/*" element={<LocalizedRoutes />} />
          </Routes>
        </Suspense>
      </main>

      <VirtualAssistant />
      <Footer />
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
      navigate(`/${targetLang}${location.pathname}${location.search}`, { replace: true });
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
      <Route path="unit-converter" element={<UnitConverter />} />
      <Route path="bmi-calculator" element={<BmiCalculator />} />
      <Route path="tip-calculator" element={<TipCalculator />} />
      <Route path="salary-calculator" element={<SalaryCalculator />} />
      <Route path="age-calculator" element={<AgeCalculator />} />
      <Route path="calculators/:slug" element={<CalculatorWrapper />} />
      <Route path="contact" element={<ContactUs />} />
      <Route path="privacy-policy" element={<PrivacyPolicy />} />
      <Route path="terms-of-service" element={<TermsOfService />} />
      <Route path="about" element={<AboutUs />} />
      <Route path="suggest" element={<SuggestFeature />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
