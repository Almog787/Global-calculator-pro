const fs = require('fs');
const path = require('path');

// 1. Modify src/contexts/i18n.tsx
let i18nContent = fs.readFileSync('src/contexts/i18n.tsx', 'utf8');
i18nContent = i18nContent.replace(
`function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  
  const savedLang = localStorage.getItem('globalcalc_lang') as Language;
  if (savedLang && translations[savedLang]) return savedLang;
  
  return 'en';
}`, 
`function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  
  const path = window.location.pathname;
  const match = path.match(/^\\/(en|he|es|fr|ar)(\\/|$)/);
  if (match) {
    return match[1] as Language;
  }
  
  const savedLang = localStorage.getItem('globalcalc_lang') as Language;
  if (savedLang && translations[savedLang]) return savedLang;
  
  return 'en';
}`);
fs.writeFileSync('src/contexts/i18n.tsx', i18nContent);

// 2. Modify src/App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
// add useNavigate
appContent = appContent.replace(`import { Routes, Route, Link, Navigate }`, `import { Routes, Route, Link, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';`);

// Replace navLinks to use lang
appContent = appContent.replace(/path: '\/all\?category=finance'/g, 'path: `/${lang}/all?category=finance`');
appContent = appContent.replace(/path: '\/all\?category=health'/g, 'path: `/${lang}/all?category=health`');
appContent = appContent.replace(/path: '\/all\?category=tech'/g, 'path: `/${lang}/all?category=tech`');
appContent = appContent.replace(/path: '\/all'/g, 'path: `/${lang}/all`');
appContent = appContent.replace(/path: '\/about'/g, 'path: `/${lang}/about`');

// Replace Brand Link
appContent = appContent.replace(/<Link to="\/" className="font-headline-md/g, '<Link to={`/${lang}`} className="font-headline-md');

// Replace Suggest Feature Link
appContent = appContent.replace(/<Link to="\/suggest"/g, '<Link to={`/${lang}/suggest`}');

// Replace Language Selector onChange
appContent = appContent.replace(
`onChange={(e) => setLang(e.target.value as any)}`,
`onChange={(e) => {
                  const newLang = e.target.value as any;
                  const currentPath = location.pathname;
                  const match = currentPath.match(/^\\/(en|he|es|fr|ar)(\\/|$)/);
                  let newPath = currentPath;
                  if (match) {
                    newPath = currentPath.replace(/^\\/[^\\/]+/, \`/\${newLang}\`);
                  } else {
                    newPath = \`/\${newLang}\${currentPath}\`;
                  }
                  if (newPath === \`/\${newLang}/\`) newPath = \`/\${newLang}\`;
                  setLang(newLang);
                  navigate(newPath + location.search);
                }}`);
                
// Add hooks inside App
appContent = appContent.replace(
`function App() {
  const { lang, setLang, t } = useI18n();`,
`function App() {
  const { lang, setLang, t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
`);

// Replace Routes
const routesRegex = /<Routes>[\s\S]*?<\/Routes>/;
appContent = appContent.replace(routesRegex, `<Routes>
          <Route path="/" element={<Navigate to={\`/\${lang}/all\`} replace />} />
          <Route path="/:urlLang/*" element={<LocalizedRoutes />} />
        </Routes>`);

// Add LocalizedRoutes component at the end
appContent += `

function LocalizedRoutes() {
  const { urlLang } = useParams<{ urlLang: string }>();
  const { lang: contextLang, setLang } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  import('react').then(({ useEffect }) => {
    const validLangs = ['en', 'he', 'es', 'fr', 'ar'];
    if (urlLang && validLangs.includes(urlLang) && urlLang !== contextLang) {
      setLang(urlLang as any);
    } else if (urlLang && !validLangs.includes(urlLang)) {
      navigate(\`/en\${location.pathname.replace(\`/\${urlLang}\`, '')}\`, { replace: true });
    }
  });

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
`;
fs.writeFileSync('src/App.tsx', appContent);
console.log('Fixed routing in App.tsx');

// 3. Update SEO to support hreflang
let seoContent = fs.readFileSync('src/components/SEO.tsx', 'utf8');
// Just inject hreflang links before </Helmet>
if (!seoContent.includes('hreflang')) {
  seoContent = seoContent.replace('</Helmet>', `
      {/* hreflang tags for i18n */}
      <link rel="alternate" hrefLang="en" href={\`\${baseUrl}/en\${finalCanonicalUrl.replace(baseUrl, '').replace(/^\\/(en|he|es|fr|ar)\\//, '/')}\`} />
      <link rel="alternate" hrefLang="he" href={\`\${baseUrl}/he\${finalCanonicalUrl.replace(baseUrl, '').replace(/^\\/(en|he|es|fr|ar)\\//, '/')}\`} />
      <link rel="alternate" hrefLang="es" href={\`\${baseUrl}/es\${finalCanonicalUrl.replace(baseUrl, '').replace(/^\\/(en|he|es|fr|ar)\\//, '/')}\`} />
      <link rel="alternate" hrefLang="fr" href={\`\${baseUrl}/fr\${finalCanonicalUrl.replace(baseUrl, '').replace(/^\\/(en|he|es|fr|ar)\\//, '/')}\`} />
      <link rel="alternate" hrefLang="ar" href={\`\${baseUrl}/ar\${finalCanonicalUrl.replace(baseUrl, '').replace(/^\\/(en|he|es|fr|ar)\\//, '/')}\`} />
      <link rel="alternate" hrefLang="x-default" href={\`\${baseUrl}/en\${finalCanonicalUrl.replace(baseUrl, '').replace(/^\\/(en|he|es|fr|ar)\\//, '/')}\`} />
    </Helmet>`);
  fs.writeFileSync('src/components/SEO.tsx', seoContent);
  console.log('Fixed SEO.tsx');
}
