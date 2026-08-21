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
    { id: 'finance', path: `/${lang}/category/finance`, label: t.catFinance, icon: 'account_balance_wallet' },
    { id: 'health', path: `/${lang}/category/health`, label: t.catHealth, icon: 'favorite' },
    { id: 'tech', path: `/${lang}/category/tech`, label: t.catTech, icon: 'memory' },
    { id: 'all', path: `/${lang}/all`, label: t.catAll, icon: 'grid_view' },
    { id: 'about', path: `/${lang}/about`, label: t.aboutTitle, icon: 'info' },
  ];

  return (
    <div className={`min-h-screen bg-background text-on-surface antialiased flex flex-col font-body-md ${t.dir === 'rtl' ? 'rtl' : 'ltr'}`}>
      <header className="bg-surface-container-lowest dark:bg-surface-container-lowest shadow-xs sticky w-full top-0 z-40 transition-all duration-200 border-b border-stone-200/70">
        <div className="flex justify-between items-center px-4 sm:px-6 md:px-gutter py-3.5 w-full max-w-container-max mx-auto gap-3">
          {/* Brand */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-xl bg-surface-container-low border border-outline-variant flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <span className="material-symbols-outlined text-[22px]">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>

            <Link to={`/${lang}`} className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim hover:text-secondary transition-colors duration-200 cursor-pointer active:scale-95 shrink-0 flex items-center gap-1.5">
              <span>{t.title}</span><span className="text-secondary">.</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                to={link.path}
                className="text-on-surface-variant dark:text-on-surface-variant hover:text-secondary transition-colors duration-200 font-body-md text-body-md cursor-pointer active:scale-95 whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:block w-64">
              <SearchBar />
            </div>
            
            <div className="flex items-center gap-2">
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
                className="bg-surface-container-low border border-outline-variant text-on-surface text-xs sm:text-sm rounded-full px-3 py-1.5 sm:py-2 cursor-pointer focus:ring-1 focus:ring-secondary transition-colors font-medium h-9 sm:h-10"
              >
                <option value="he">עברית</option>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="ar">العربية</option>
              </select>
              
              <Link to={`/${lang}/suggest`} className="hidden sm:flex items-center gap-1.5 bg-secondary text-on-secondary px-4 sm:px-5 py-2 rounded-full font-label-bold text-xs sm:text-label-bold hover:bg-on-secondary-container hover:text-on-secondary transition-colors active:scale-95 h-9 sm:h-10 shrink-0">
                <span className="material-symbols-outlined text-sm sm:text-base">add_circle</span>
                <span>{t.suggestionsTitle || 'Suggest'}</span>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Mobile Search */}
        <div className="lg:hidden px-4 sm:px-margin-mobile pb-3 w-full max-w-container-max mx-auto">
          <SearchBar />
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 bg-white px-4 py-4 space-y-2 animate-fadeIn shadow-lg">
            <div className="grid grid-cols-1 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-container text-on-surface font-medium text-sm transition-colors"
                >
                  <span className="material-symbols-outlined text-stone-400 text-lg">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
              <Link
                to={`/${lang}/suggest`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-secondary/10 text-secondary font-bold text-sm transition-colors mt-2"
              >
                <span className="material-symbols-outlined text-lg">add_circle</span>
                <span>{t.suggestionsTitle || 'Suggest Feature'}</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      <main id="main-content" className="flex-grow w-full max-w-container-max mx-auto px-4 sm:px-margin-mobile md:px-gutter py-6 sm:py-stack-lg">
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
