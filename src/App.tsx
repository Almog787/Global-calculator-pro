import { lazy, Suspense, useEffect } from 'react';
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


  const navLinks = [
    { id: 'finance', path: `/${lang}/all?category=finance`, label: t.catFinance },
    { id: 'health', path: `/${lang}/all?category=health`, label: t.catHealth },
    { id: 'tech', path: `/${lang}/all?category=tech`, label: t.catTech },
    { id: 'all', path: `/${lang}/all`, label: t.catAll },
    { id: 'about', path: `/${lang}/about`, label: t.aboutTitle },
  ];

  return (
    <div className={`min-h-screen bg-background text-on-surface antialiased flex flex-col font-body-md ${t.dir === 'rtl' ? 'rtl' : 'ltr'}`}>
      <header className="bg-surface-container-lowest dark:bg-surface-container-lowest shadow-sm sticky w-full top-0 z-50 transition-all duration-200">
        <div className="flex justify-between items-center px-gutter py-4 w-full max-w-container-max mx-auto">
          {/* Brand */}
          <div className="flex items-center gap-4">
            <Link to={`/${lang}`} className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim hover:text-secondary transition-colors duration-200 cursor-pointer active:scale-95 shrink-0">
              {t.title}<span className="text-secondary">.</span>
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
          <div className="flex items-center gap-4">
            <div className="hidden lg:block">
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
                className="bg-surface-container-low border border-outline-variant text-on-surface text-sm rounded-full px-3 py-2 cursor-pointer focus:ring-1 focus:ring-secondary transition-colors font-medium h-10"
              >
                <option value="he">עברית</option>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="ar">العربية</option>
              </select>
              
              <Link to={`/${lang}/suggest`} className="hidden md:flex items-center gap-2 bg-secondary text-on-secondary px-6 py-2 rounded-full font-label-bold text-label-bold hover:bg-on-secondary-container hover:text-on-secondary transition-colors active:scale-95 h-10">
                {t.suggestionsTitle || 'Suggest Feature'}
              </Link>
            </div>
          </div>
        </div>
        
        {/* Mobile Search */}
        <div className="lg:hidden px-margin-mobile pb-3 w-full max-w-container-max mx-auto">
          <SearchBar />
        </div>
      </header>

      <main id="main-content" className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-gutter py-stack-lg">
        <Suspense fallback={<SkeletonLoader />}>
        <Routes>
          <Route path="/" element={<Navigate to={`/${lang}/all`} replace />} />
          <Route path="/:urlLang/*" element={<LocalizedRoutes />} />
        </Routes>
        </Suspense>
      </main>

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
      navigate(`/en${location.pathname.replace(`/${urlLang}`, '')}`, { replace: true });
    }
  }, [urlLang, contextLang, setLang, navigate, location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="all" replace />} />
      <Route path="all" element={<AllCalculators />} />
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
