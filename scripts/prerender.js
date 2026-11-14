import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, "../dist");

// Load all locales for meta tag, guides, FAQ & text injection
const locales = {
  en: JSON.parse(fs.readFileSync(path.resolve(__dirname, "../src/locales/en.json"), "utf8")),
  he: JSON.parse(fs.readFileSync(path.resolve(__dirname, "../src/locales/he.json"), "utf8")),
  es: JSON.parse(fs.readFileSync(path.resolve(__dirname, "../src/locales/es.json"), "utf8")),
  fr: JSON.parse(fs.readFileSync(path.resolve(__dirname, "../src/locales/fr.json"), "utf8")),
  ar: JSON.parse(fs.readFileSync(path.resolve(__dirname, "../src/locales/ar.json"), "utf8")),
  ru: JSON.parse(fs.readFileSync(path.resolve(__dirname, "../src/locales/ru.json"), "utf8")),
};

const localeMap = {
  en: "en_US",
  he: "he_IL",
  es: "es_ES",
  fr: "fr_FR",
  ar: "ar_AR",
  ru: "ru_RU",
};

const homeLabels = {
  en: "Home",
  he: "ראשי",
  es: "Inicio",
  fr: "Accueil",
  ar: "الرئيسية",
  ru: "Главная",
};

const categoryLabels = {
  finance: {
    en: "Finance",
    he: "פיננסים",
    es: "Finanzas",
    fr: "Finances",
    ar: "المالية",
    ru: "Финансы",
  },
  "real-estate": {
    en: "Real Estate",
    he: 'נדל"ן ומשכנתאות',
    es: "Bienes Raíces",
    fr: "Immobilier",
    ar: "العقارات",
    ru: "Недвижимость",
  },
  health: {
    en: "Health",
    he: "בריאות",
    es: "Salud",
    fr: "Santé",
    ar: "الصحة",
    ru: "Здоровье",
  },
  math: {
    en: "Math",
    he: "מתמטיקה",
    es: "Matemáticas",
    fr: "Maths",
    ar: "الرياضيات",
    ru: "Математика",
  },
  tech: {
    en: "Tech",
    he: "טכנולוגיה ומחשבים",
    es: "Tecnología",
    fr: "Technologie",
    ar: "التكنولوجيا والتقنية",
    ru: "Технологии",
  },
  lifestyle: {
    en: "Lifestyle",
    he: "לייף סטייל",
    es: "Estilo de vida",
    fr: "Vie quotidienne",
    ar: "نمط الحياة",
    ru: "Повседневное",
  },
};

const categorySubMap = {
  finance: "FinancialCalculator",
  "real-estate": "RealEstateCalculator",
  health: "HealthAndFitnessCalculator",
  math: "ScientificCalculator",
  tech: "DeveloperApplication",
  lifestyle: "LifestyleApplication",
};

// Parse calculators registry, translations, category hubs, and benchmark tables
const calculatorsPath = path.resolve(__dirname, "../src/data/calculators.ts");
let calculatorsList = [];
let dynamicTranslations = {};

if (fs.existsSync(calculatorsPath)) {
  const content = fs.readFileSync(calculatorsPath, "utf8");

  const dtMatch = /export const dynamicTranslations[^=]*=\s*(\{[\s\S]*?^\};)/m.exec(content);
  if (dtMatch) {
    try {
      dynamicTranslations = new Function(`return ${dtMatch[1].replace(/;$/, "")}`)();
    } catch {
      // ignore fallback
    }
  }

  const calcArrMatch = /export const calculators[^=]*=\s*(\[[\s\S]*?^\];)/m.exec(content);
  if (calcArrMatch) {
    try {
      calculatorsList = new Function(`return ${calcArrMatch[1].replace(/;$/, "")}`)();
    } catch {
      // ignore fallback
    }
  }
}

const categoryHubsPath = path.resolve(__dirname, "../src/data/categoryHubs.ts");
let categoryHubsData = {};
if (fs.existsSync(categoryHubsPath)) {
  const hubsContent = fs.readFileSync(categoryHubsPath, "utf8");
  const hubsMatch = /export const categoryHubsData[^=]*=\s*(\{[\s\S]*?^\};)/m.exec(hubsContent);
  if (hubsMatch) {
    try {
      categoryHubsData = new Function(`return ${hubsMatch[1].replace(/;$/, "")}`)();
    } catch {
      // ignore fallback
    }
  }
}

const benchmarksPath = path.resolve(__dirname, "../src/data/benchmarks.ts");
let benchmarkTables = {};
if (fs.existsSync(benchmarksPath)) {
  const benchContent = fs.readFileSync(benchmarksPath, "utf8");
  const benchMatch = /export const benchmarkTables[^=]*=\s*(\{[\s\S]*?^\};)/m.exec(benchContent);
  if (benchMatch) {
    try {
      benchmarkTables = new Function(`return ${benchMatch[1].replace(/;$/, "")}`)();
    } catch {
      // ignore fallback
    }
  }
}

const calculatorsByPath = new Map(calculatorsList.map((c) => [c.path, c]));
const dynamicPaths = calculatorsList.map((c) => c.path);

const staticPaths = [
  "/",
  "/all",
  "/widgets",
  "/category/finance",
  "/category/real-estate",
  "/category/health",
  "/category/math",
  "/category/tech",
  "/category/lifestyle",
  "/contact",
  "/privacy-policy",
  "/terms-of-service",
  "/about",
  "/suggest",
];

const rawPaths = Array.from(new Set([...staticPaths, ...dynamicPaths]));
const languages = ["en", "he", "es", "fr", "ar", "ru"];

const allPaths = [];
for (const lang of languages) {
  for (const p of rawPaths) {
    allPaths.push(`/${lang}${p === "/" ? "" : p}`);
  }
}

const baseHtmlPath = path.join(distPath, "index.html");
if (!fs.existsSync(baseHtmlPath)) {
  console.log("dist/index.html not found, skipping static route generation.");
  process.exit(0);
}

const baseHtml = fs.readFileSync(baseHtmlPath, "utf8");

console.log(
  `[Prerender] Generating static HTML entry points for ${allPaths.length} routes...`,
);

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getLocalizedCalcTitle(calc, lang) {
  const t = locales[lang]?.ui || locales.en.ui;
  if (calc.titleKey && t[calc.titleKey]) return t[calc.titleKey];
  if (dynamicTranslations[calc.id]?.[lang]?.title) return dynamicTranslations[calc.id][lang].title;
  return calc.fallbackTitle;
}

function getLocalizedCalcDesc(calc, lang) {
  const t = locales[lang]?.ui || locales.en.ui;
  if (calc.descKey && t[calc.descKey]) return t[calc.descKey];
  if (dynamicTranslations[calc.id]?.[lang]?.description) return dynamicTranslations[calc.id][lang].description;
  return calc.description;
}

// Guide key lookup (maps calculator id/path to locales[lang].guides key)
const guideKeyAliases = {
  "mortgage-calculator": "mortgage",
  "compound-interest": "compound",
  "percentage-finder": "percentage",
  "unit-converter": "unit",
  "bmi-calculator": "bmi",
  "tip-calculator": "tip",
  "salary-calculator": "salary",
  "age-calculator": "age",
  "pregnancy-calculator": "pregnancy",
};

function resolveGuideAndBenchmark(unlocalizedPath, calc) {
  const slug = unlocalizedPath.replace(/^\/calculators\//, "").replace(/^\//, "");
  const candidates = [
    calc?.id,
    slug,
    guideKeyAliases[slug],
    guideKeyAliases[calc?.id],
  ].filter(Boolean);

  let guide = null;
  let benchmark = null;
  for (const lang of Object.keys(locales)) {
    // checked per lang below
    void lang;
  }
  return { candidates, guide, benchmark };
}

// Route metadata resolver
function getRouteMetadata(route, lang) {
  const t = locales[lang]?.ui || locales.en.ui;
  const siteName = "Global Calc Pro";
  const unlocalizedPath = route.replace(new RegExp(`^\\/${lang}`), "") || "/";
  const matchedCalc = calculatorsByPath.get(unlocalizedPath) || null;

  // Home / Language Root
  if (unlocalizedPath === "/") {
    const titles = {
      en: "GlobalCalc Pro – Free Online Smart Calculators [2026]",
      he: "GlobalCalc Pro – מחשבונים אונליין בחינם לכל מטרה [2026]",
      es: "GlobalCalc Pro – Calculadoras Online Gratuitas [2026]",
      fr: "GlobalCalc Pro – Calculatrices en Ligne Gratuites [2026]",
      ar: "GlobalCalc Pro – حاسبات مجانية ذكية عبر الإنترنت [2026]",
      ru: "GlobalCalc Pro – Бесплатные умные онлайн-калькуляторы [2026]",
    };
    const descs = {
      en: "Free online calculators for finance, mortgages, health, math, and daily life. Fast, accurate, and easy to use.",
      he: "מגוון מחשבונים חכמים בחינם: מחשבון משכנתא, ריבית דריבית, אחוזים, BMI, המרת מידות ועוד בדיוק מושלם.",
      es: "Calculadoras online gratuitas para finanzas, salud, matemáticas y vida cotidiana. Rápidas y precisas.",
      fr: "Calculatrices en ligne gratuites pour les finances, la santé, les maths et le quotidien. Rapide et précis.",
      ar: "حاسبات مجانية عبر الإنترنت للمال، الرهن العقاري، الصحة، الرياضيات والحياة اليومية.",
      ru: "Бесплатные онлайн-калькуляторы для финансов, ипотеки, здоровья, математики и повседневной жизни. Быстро, точно и удобно.",
    };
    return {
      title: titles[lang] || titles.en,
      description: descs[lang] || descs.en,
      keywords: [t.libraryTitle, t.catFinance, t.catRealEstate, t.catHealth, t.catMath, "online calculators", "Global Calc Pro"].filter(Boolean),
      schemaType: "CollectionPage",
      category: null,
      calc: null,
    };
  }

  // All Calculators Library
  if (unlocalizedPath === "/all") {
    const pageTitle = t.libraryTitle || "Calculator Library";
    const pageDesc = t.librarySubtitle || "Find the perfect tool for your calculations.";
    return {
      title: `${pageTitle} | ${siteName}`,
      description: pageDesc,
      keywords: [pageTitle, t.catFinance, t.catRealEstate, t.catHealth, t.catMath, t.catTech, t.catLifestyle, "Global Calc Pro"].filter(Boolean),
      schemaType: "CollectionPage",
      category: null,
      calc: null,
    };
  }

  // Widgets Hub
  if (unlocalizedPath === "/widgets") {
    const titles = {
      en: "Embeddable Calculator Widgets Hub | GlobalCalc Pro",
      he: "ווידג'טים של מחשבונים להטמעה באתרים | GlobalCalc Pro",
      es: "Widgets de Calculadoras Integrables | GlobalCalc Pro",
      fr: "Widgets de Calculatrices Intégrables | GlobalCalc Pro",
      ar: "أدوات حاسبة قابلة للتضمين في المواقع | GlobalCalc Pro",
      ru: "Виджеты калькуляторов для встраивания на сайт | GlobalCalc Pro",
    };
    const descs = {
      en: "Embed free, customizable financial, math, and health calculator widgets directly into your website or blog with clean iframe codes.",
      he: "הטמע מחשבוני משכנתא, פיננסים, בריאות ומתמטיקה באתר או בבלוג שלך בקלות עם קוד iframe נקי ומותאם אישית.",
      es: "Integra widgets de calculadoras financieras y de salud gratis en tu web o blog con código iframe responsivo.",
      fr: "Intégrez gratuitement des widgets de calculatrices financières et mathématiques sur votre site web avec du code iframe.",
      ar: "قم بتضمين أدوات حاسبة مالية وصحية مجانية ومخصصة مباشرة في موقعك الإلكتروني عبر كود iframe بسيط.",
      ru: "Встраивайте бесплатные настраиваемые виджеты финансовых, математических и медицинских калькуляторов на ваш сайт через iframe.",
    };
    return {
      title: titles[lang] || titles.en,
      description: descs[lang] || descs.en,
      keywords: ["embeddable calculator widgets", "iframe calculator", "WordPress calculator widget", "React calculator component", titles[lang]].filter(Boolean),
      schemaType: "SoftwareApplication",
      category: null,
      calc: null,
    };
  }

  // Static common calculators
  const staticCalcMap = {
    "/mortgage-calculator": { titleKey: "mortgageTitle", descKey: "mortgageDesc" },
    "/compound-interest": { titleKey: "compoundTitle", descKey: "compoundDesc" },
    "/percentage-finder": { titleKey: "percFinderTitle", descKey: "percFinderDesc" },
    "/unit-converter": { titleKey: "unitConvTitle", descKey: "unitConvDesc" },
    "/bmi-calculator": { titleKey: "bmiTitle", descKey: "bmiDesc" },
    "/tip-calculator": { titleKey: "tipTitle", descKey: "tipDesc" },
    "/salary-calculator": { titleKey: "salaryTitle", descKey: "salaryDesc" },
    "/age-calculator": { titleKey: "ageTitle", descKey: "ageDesc" },
  };

  if (staticCalcMap[unlocalizedPath]) {
    const map = staticCalcMap[unlocalizedPath];
    const pageTitle = t[map.titleKey] || map.titleKey;
    const pageDesc = t[map.descKey] || "";
    const cat = matchedCalc?.category || null;
    const catName = cat && categoryLabels[cat] ? categoryLabels[cat][lang] || categoryLabels[cat].en : "";
    const kws = Array.from(new Set([pageTitle, catName, ...(matchedCalc?.tags || [])].filter(Boolean)));
    return {
      title: `${pageTitle} | ${siteName}`,
      description: pageDesc,
      keywords: kws,
      schemaType: "WebApplication",
      category: cat,
      calc: matchedCalc,
    };
  }

  // Dynamic calculators: /calculators/:id
  const calcMatch = unlocalizedPath.match(/^\/calculators\/([a-zA-Z0-9-]+)/);
  if (calcMatch) {
    const calcId = calcMatch[1];
    const calcMeta = dynamicTranslations[calcId]?.[lang] || dynamicTranslations[calcId]?.en;
    const pageTitle = calcMeta?.title || matchedCalc?.fallbackTitle || calcId;
    const pageDesc = calcMeta?.description || matchedCalc?.description || "";
    const cat = matchedCalc?.category || null;
    const catName = cat && categoryLabels[cat] ? categoryLabels[cat][lang] || categoryLabels[cat].en : "";
    const kws = Array.from(new Set([pageTitle, catName, ...(matchedCalc?.tags || [])].filter(Boolean)));
    return {
      title: `${pageTitle} | ${siteName}`,
      description: pageDesc,
      keywords: kws,
      schemaType: "WebApplication",
      category: cat,
      calc: matchedCalc,
    };
  }

  // Categories
  const catMatch = unlocalizedPath.match(/^\/category\/([a-zA-Z0-9-]+)/);
  if (catMatch) {
    const catKey = catMatch[1];
    const localizedCat = categoryLabels[catKey]?.[lang] || categoryLabels[catKey]?.en || catKey;
    const hub = categoryHubsData[catKey];
    const hubTitle = hub?.title?.[lang] || hub?.title?.en;
    const hubSub = hub?.subtitle?.[lang] || hub?.subtitle?.en;
    const catTemplates = {
      en: {
        title: `${hubTitle || localizedCat + " Calculators"} | ${siteName}`,
        desc: hubSub || `Explore all verified ${localizedCat.toLowerCase()} calculators and tools on Global Calc Pro. Free, fast, and accurate.`,
      },
      he: {
        title: `${hubTitle || "מחשבוני " + localizedCat} | ${siteName}`,
        desc: hubSub || `גלו את כל מחשבוני ה${localizedCat} המקצועיים ב-Global Calc Pro. חישוב מהיר, מדויק ובחינם.`,
      },
      es: {
        title: `${hubTitle || "Calculadoras de " + localizedCat} | ${siteName}`,
        desc: hubSub || `Explora todas las calculadoras y herramientas verificadas de ${localizedCat} en Global Calc Pro. Gratis y precisas.`,
      },
      fr: {
        title: `${hubTitle || "Calculatrices " + localizedCat} | ${siteName}`,
        desc: hubSub || `Découvrez toutes les calculatrices ${localizedCat} vérifiées sur Global Calc Pro. Gratuites, rapides et précises.`,
      },
      ar: {
        title: `${hubTitle || "حاسبات " + localizedCat} | ${siteName}`,
        desc: hubSub || `استكشف جميع حاسبات وأدوات ${localizedCat} المعتمدة على Global Calc Pro مجاناً وبدقة عالية.`,
      },
      ru: {
        title: `Калькуляторы: ${localizedCat} | ${siteName}`,
        desc: `Все проверенные онлайн-калькуляторы категории «${localizedCat}» на Global Calc Pro. Бесплатно, быстро и точно.`,
      },
    };
    const tmpl = catTemplates[lang] || catTemplates.en;
    const catCalcs = calculatorsList.filter((c) => c.category === catKey);
    const catKws = Array.from(
      new Set([
        localizedCat,
        ...catCalcs.map((c) => getLocalizedCalcTitle(c, lang)),
        ...catCalcs.flatMap((c) => c.tags.slice(0, 2)),
      ].filter(Boolean))
    ).slice(0, 15);
    return {
      title: tmpl.title,
      description: tmpl.desc,
      keywords: catKws,
      schemaType: "CollectionPage",
      category: catKey,
      calc: null,
      isCategoryHub: true,
    };
  }

  // Informational pages
  if (unlocalizedPath === "/about") {
    return {
      title: `${t.aboutTitle || "About Us"} | ${siteName}`,
      description:
        t.aboutDesc ||
        "Learn more about Global Calc Pro and our mission to provide accurate, accessible mathematical tools for everyone.",
      keywords: [t.aboutTitle, "Global Calc Pro", "Decimal.js", "client-side calculators"].filter(Boolean),
      schemaType: "AboutPage",
      category: null,
      calc: null,
    };
  }

  if (unlocalizedPath === "/contact") {
    return {
      title: `${t.contactTitle || "Contact Us"} | ${siteName}`,
      description:
        t.contactDesc ||
        "Get in touch with the Global Calc Pro engineering team for support, feedback, or custom calculator requests.",
      keywords: [t.contactTitle, "Global Calc Pro", "support", "feedback"].filter(Boolean),
      schemaType: "ContactPage",
      category: null,
      calc: null,
    };
  }

  if (unlocalizedPath === "/privacy-policy") {
    return {
      title: `${t.privacyTitle || "Privacy Policy"} | ${siteName}`,
      description:
        t.privacyDesc ||
        "Global Calc Pro privacy policy, client-side data security, and privacy commitments.",
      keywords: [t.privacyTitle, "privacy", "client-side", "Global Calc Pro"].filter(Boolean),
      schemaType: "WebPage",
      category: null,
      calc: null,
    };
  }

  if (unlocalizedPath === "/terms-of-service") {
    return {
      title: `${t.termsTitle || "Terms of Service"} | ${siteName}`,
      description:
        t.termsDesc ||
        "Terms of service and usage guidelines for Global Calc Pro online calculations.",
      keywords: [t.termsTitle, "terms of service", "Global Calc Pro"].filter(Boolean),
      schemaType: "WebPage",
      category: null,
      calc: null,
    };
  }

  if (unlocalizedPath === "/suggest") {
    return {
      title: `${t.suggestionsTitle || "Suggest a Calculator"} | ${siteName}`,
      description:
        t.suggestionsDesc ||
        "Suggest a new calculator, feature, or improvement for Global Calc Pro.",
      keywords: [t.suggestionsTitle, "suggest calculator"].filter(Boolean),
      schemaType: "WebPage",
      category: null,
      calc: null,
      noindex: true,
    };
  }

  return {
    title: `${t.libraryTitle || siteName} | ${siteName}`,
    description: t.librarySubtitle || "Free, instant online tools and calculators for everyday decisions.",
    keywords: ["calculators", "Global Calc Pro"],
    schemaType: "WebPage",
    category: null,
    calc: null,
  };
}

// Generate Unified JSON-LD Schema Graph (mirrors SEO.tsx to prevent duplicate/conflicting schemas)
function createSchemaJsonLd(
  title,
  description,
  canonicalUrl,
  lang,
  schemaType,
  unlocalizedPath = "/",
  category = null,
  keywords = [],
  faqs = [],
) {
  const isApp = schemaType === "WebApplication" || schemaType === "SoftwareApplication";
  const siteName = "Global Calc Pro";
  const baseUrl = "https://globalcalcpro.com";
  const cleanTitle = title.replace(/ \| Global ?Calc Pro/gi, "").replace(/ – GlobalCalc Pro.*/g, "").trim();

  const breadcrumbList = [
    {
      "@type": "ListItem",
      position: 1,
      name: homeLabels[lang] || homeLabels.en,
      item: `${baseUrl}/${lang}/all`,
    },
  ];

  if (category && categoryLabels[category] && !unlocalizedPath.startsWith("/category/")) {
    breadcrumbList.push({
      "@type": "ListItem",
      position: 2,
      name: categoryLabels[category][lang] || categoryLabels[category].en,
      item: `${baseUrl}/${lang}/category/${category}`,
    });
  }

  if (unlocalizedPath && unlocalizedPath !== "/" && unlocalizedPath !== "/all") {
    breadcrumbList.push({
      "@type": "ListItem",
      position: breadcrumbList.length + 1,
      name: cleanTitle,
      item: canonicalUrl,
    });
  }

  const graph = [
    {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      name: siteName,
      url: baseUrl,
      logo: `${baseUrl}/favicon.svg`,
    },
    {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      url: baseUrl,
      name: siteName,
      inLanguage: ["en", "he", "es", "fr", "ar", "ru"],
      potentialAction: {
        "@type": "SearchAction",
        target: `${baseUrl}/${lang}/all?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "WebPage",
      "@id": `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: title,
      description: description,
      inLanguage: lang,
      ...(keywords.length > 0 ? { keywords: keywords.join(", ") } : {}),
      isPartOf: {
        "@id": `${baseUrl}/#website`,
      },
      breadcrumb: {
        "@id": `${canonicalUrl}#breadcrumb`,
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${canonicalUrl}#breadcrumb`,
      itemListElement: breadcrumbList,
    },
  ];

  if (isApp) {
    graph.push({
      "@type": "WebApplication",
      "@id": `${canonicalUrl}#software`,
      name: cleanTitle,
      description: description,
      url: canonicalUrl,
      applicationCategory: "CalculatorApplication",
      applicationSubCategory: (category && categorySubMap[category]) || "UtilitiesApplication",
      operatingSystem: "All",
      browserRequirements: "Requires JavaScript. Requires HTML5.",
      isAccessibleForFree: true,
      inLanguage: lang,
      ...(keywords.length > 0 ? { keywords: keywords.join(", ") } : {}),
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    });
  }

  if (Array.isArray(faqs) && faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${canonicalUrl}#faq`,
      mainEntity: faqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    });
  }

  return JSON.stringify(
    {
      "@context": "https://schema.org",
      "@graph": graph,
    },
    null,
    2,
  );
}

function buildCalculatorFallbackFaqs(meta, lang, cleanTitle) {
  if (meta.schemaType !== "WebApplication" || !meta.calc) return [];
  const catName =
    meta.category && categoryLabels[meta.category]
      ? categoryLabels[meta.category][lang] || categoryLabels[meta.category].en
      : "";
  const kwSummary = (meta.keywords || []).slice(0, 6).join(", ");
  const desc = meta.description || cleanTitle;

  const templates = {
    en: [
      {
        question: `What does the ${cleanTitle} calculate?`,
        answer: `${desc} It belongs to the ${catName || "online tools"} category and supports key terms such as ${kwSummary || cleanTitle}.`,
      },
      {
        question: `Is the ${cleanTitle} accurate and private?`,
        answer: `Yes. All formulas run locally in your browser using high-precision Decimal.js arithmetic with zero server data storage.`,
      },
      {
        question: `Can I export or share results from the ${cleanTitle}?`,
        answer: `Yes. You can copy shareable result links with URL parameters, export data, or embed the calculator directly on your website.`,
      },
    ],
    he: [
      {
        question: `מה מחשב ${cleanTitle}?`,
        answer: `${desc} הכלי שייך לקטגוריית ${catName || "המחשבונים"} ונותן מענה מדויק לחיפושים ומונחים כגון ${kwSummary || cleanTitle}.`,
      },
      {
        question: `האם החישוב ב-${cleanTitle} מדויק ושומר על פרטיות?`,
        answer: `כן. כל הנוסחאות מבוצעות מקומית בדפדפן ברמת דיוק גבוהה (Decimal.js) ללא שמירת מידע אישי בשרת.`,
      },
      {
        question: `האם ניתן לשתף או לייצא את תוצאות ה-${cleanTitle}?`,
        answer: `כן. ניתן להעתיק קישור שיתוף עם הערכים שהזנת, לשמור למועדפים או להטמיע את המחשבון באתר אחר.`,
      },
    ],
    es: [
      {
        question: `¿Qué calcula la herramienta ${cleanTitle}?`,
        answer: `${desc} Pertenece a la categoría de ${catName || "calculadoras"} y cubre consultas clave como ${kwSummary || cleanTitle}.`,
      },
      {
        question: `¿Es precisa y privada la calculadora ${cleanTitle}?`,
        answer: `Sí. Todos los cálculos se ejecutan en tu navegador con aritmética Decimal.js de alta precisión sin almacenar datos personales.`,
      },
      {
        question: `¿Puedo exportar o compartir resultados de ${cleanTitle}?`,
        answer: `Sí. Puedes compartir enlaces con parámetros URL o integrar la herramienta gratuitamente en tu sitio web.`,
      },
    ],
    fr: [
      {
        question: `Que permet de calculer l'outil ${cleanTitle} ?`,
        answer: `${desc} Il fait partie de la catégorie ${catName || "Calculatrices"} et répond aux recherches liées à ${kwSummary || cleanTitle}.`,
      },
      {
        question: `La calculatrice ${cleanTitle} est-elle fiable et confidentielle ?`,
        answer: `Oui. Tous les calculs s'effectuent localement dans votre navigateur avec Decimal.js, sans envoi de données sur serveur.`,
      },
      {
        question: `Puis-je partager ou exporter les résultats de ${cleanTitle} ?`,
        answer: `Oui. Vous pouvez partager l'URL avec vos paramètres ou intégrer l'outil sur votre site web.`,
      },
    ],
    ar: [
      {
        question: `ماذا تحسب أداة ${cleanTitle}؟`,
        answer: `${desc} تندرج هذه الأداة ضمن قسم ${catName || "الحاسبات"} وتغطي مفاهيم ومصطلحات مثل ${kwSummary || cleanTitle}.`,
      },
      {
        question: `هل الحسابات في ${cleanTitle} دقيقة وآمنة؟`,
        answer: `نعم، يتم تنفيذ جميع المعادلات محلياً داخل المتصفح بدقة عالية (Decimal.js) دون تخزين أي بيانات شخصية على الخادم.`,
      },
      {
        question: `هل يمكنني مشاركة أو تصدير نتائج ${cleanTitle}؟`,
        answer: `نعم، يمكنك نسخ رابط النتائج المباشر مع القيم المدخلة أو تضمين الأداة مجاناً في موقعك الإلكتروني.`,
      },
    ],
    ru: [
      {
        question: `Что рассчитывает ${cleanTitle}?`,
        answer: `${desc} Инструмент относится к разделу «${catName || "Калькуляторы"}» и охватывает ключевые запросы: ${kwSummary || cleanTitle}.`,
      },
      {
        question: `Насколько точны и безопасны расчеты в ${cleanTitle}?`,
        answer: `Все вычисления выполняются локально в браузере с высокой точностью (Decimal.js) без передачи персональных данных на сервер.`,
      },
      {
        question: `Можно ли поделиться результатами или встроить ${cleanTitle}?`,
        answer: `Да, вы можете скопировать ссылку с параметрами расчета, экспортировать данные или встроить виджет на свой сайт.`,
      },
    ],
  };

  return templates[lang] || templates.en;
}

// Build rich semantic HTML shell inside #root so Googlebot sees full content & internal links before hydration
function buildSemanticShell(route, lang, meta, guide, benchmark, resolvedFaqs = []) {
  const t = locales[lang]?.ui || locales.en.ui;
  const unlocalizedPath = route.replace(new RegExp(`^\\/${lang}`), "") || "/";
  const cleanTitle = meta.title.replace(/ \| Global ?Calc Pro/gi, "").trim();
  const isRtl = lang === "he" || lang === "ar";

  const relatedCalcs = meta.isCategoryHub
    ? calculatorsList.filter((c) => c.category === meta.category)
    : unlocalizedPath === "/" || unlocalizedPath === "/all"
      ? calculatorsList
      : calculatorsList
          .filter((c) => c.path !== unlocalizedPath && (!meta.category || c.category === meta.category))
          .slice(0, 8);

  const navCategories = Object.keys(categoryLabels)
    .map(
      (catId) =>
        `<a href="/${lang}/category/${catId}" style="margin-inline-end:12px;color:#0f766e;text-decoration:none;font-weight:600;">${escapeHtml(categoryLabels[catId][lang] || categoryLabels[catId].en)}</a>`,
    )
    .join("");

  const hub = meta.category && meta.isCategoryHub ? categoryHubsData[meta.category] : null;
  const hubIntro = hub?.introText?.[lang] || hub?.introText?.en || "";
  const hubBenefits = hub?.keyBenefits?.[lang] || hub?.keyBenefits?.en || [];

  const directAnswer = benchmark?.directAnswer?.[lang] || benchmark?.directAnswer?.en || "";
  const formulaLines = guide?.formulaLines || benchmark?.formulaBreakdown?.variables?.[lang] || benchmark?.formulaBreakdown?.variables?.en || [];
  const faqs = Array.isArray(resolvedFaqs) ? resolvedFaqs : [];

  const faqHtml =
    faqs.length > 0
      ? `<section style="margin-top:24px;">
          <h2 style="font-size:1.25rem;font-weight:700;margin-bottom:12px;">${escapeHtml(t.faqTitle || "FAQ")}</h2>
          ${faqs
            .map(
              (f) => `<article style="margin-bottom:12px;padding:12px;background:#fff;border:1px solid #e7e5e4;border-radius:10px;">
                <h3 style="font-size:1rem;font-weight:700;margin:0 0 6px 0;">${escapeHtml(f.question)}</h3>
                <p style="margin:0;color:#44403c;line-height:1.6;">${escapeHtml(f.answer)}</p>
              </article>`,
            )
            .join("")}
        </section>`
      : "";

  const linksHeading =
    lang === "he"
      ? "מחשבונים קשורים וכלים מומלצים"
      : lang === "ar"
        ? "حاسبات وأدوات ذات صلة"
        : lang === "ru"
          ? "Похожие калькуляторы и инструменты"
          : lang === "es"
            ? "Calculadoras y herramientas relacionadas"
            : lang === "fr"
              ? "Calculatrices et outils associés"
              : "Related Calculators & Tools";

  const relatedHtml =
    relatedCalcs.length > 0
      ? `<section style="margin-top:24px;">
          <h2 style="font-size:1.15rem;font-weight:700;margin-bottom:12px;">${escapeHtml(linksHeading)}</h2>
          <ul style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px;list-style:none;padding:0;margin:0;">
            ${relatedCalcs
              .map(
                (c) => `<li style="padding:10px 12px;background:#fff;border:1px solid #e7e5e4;border-radius:10px;">
                  <a href="/${lang}${c.path}" style="font-weight:700;color:#0f766e;text-decoration:none;display:block;margin-bottom:4px;">${escapeHtml(getLocalizedCalcTitle(c, lang))}</a>
                  <span style="font-size:0.85rem;color:#57534e;line-height:1.4;">${escapeHtml(getLocalizedCalcDesc(c, lang))}</span>
                </li>`,
              )
              .join("")}
          </ul>
        </section>`
      : "";

  const catCrumb =
    meta.category && categoryLabels[meta.category] && !meta.isCategoryHub
      ? ` &rsaquo; <a href="/${lang}/category/${meta.category}" style="color:#57534e;text-decoration:none;">${escapeHtml(categoryLabels[meta.category][lang] || categoryLabels[meta.category].en)}</a>`
      : "";

  return `<div dir="${isRtl ? "rtl" : "ltr"}" style="min-height:100vh;background:#fafaf9;color:#1c1917;font-family:system-ui,-apple-system,sans-serif;">
      <header style="background:#fff;border-bottom:1px solid #e7e5e4;padding:14px 20px;">
        <div style="max-width:64rem;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;">
          <a href="/${lang}/all" style="font-weight:800;font-size:1.15rem;color:#1c1917;text-decoration:none;">GlobalCalc Pro</a>
          <nav aria-label="Main navigation">${navCategories}<a href="/${lang}/all" style="color:#0f766e;text-decoration:none;font-weight:600;">${escapeHtml(t.allTools || "All Calculators")}</a></nav>
        </div>
      </header>
      <main style="max-width:64rem;margin:0 auto;padding:24px 20px;">
        <nav aria-label="Breadcrumb" style="font-size:0.85rem;color:#57534e;margin-bottom:14px;">
          <a href="/${lang}/all" style="color:#57534e;text-decoration:none;">${escapeHtml(homeLabels[lang] || homeLabels.en)}</a>${catCrumb}${unlocalizedPath !== "/" && unlocalizedPath !== "/all" ? ` &rsaquo; <span>${escapeHtml(cleanTitle)}</span>` : ""}
        </nav>
        <h1 style="font-size:1.9rem;font-weight:800;margin:0 0 10px 0;line-height:1.25;">${escapeHtml(cleanTitle)}</h1>
        <p style="font-size:1.05rem;color:#44403c;line-height:1.65;margin:0 0 16px 0;">${escapeHtml(meta.description)}</p>
        ${directAnswer ? `<p style="padding:12px 14px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;color:#1e3a8a;line-height:1.6;">${escapeHtml(directAnswer)}</p>` : ""}
        ${hubIntro ? `<p style="color:#44403c;line-height:1.7;margin:14px 0;">${escapeHtml(hubIntro)}</p>` : ""}
        ${hubBenefits.length > 0 ? `<ul style="margin:12px 0;padding-inline-start:20px;color:#44403c;">${hubBenefits.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
        ${guide?.guideTitle ? `<section style="margin-top:20px;padding:16px;background:#fff;border:1px solid #e7e5e4;border-radius:12px;"><h2 style="font-size:1.25rem;font-weight:700;margin:0 0 8px 0;">${escapeHtml(guide.guideTitle)}</h2><p style="margin:0;color:#44403c;line-height:1.65;">${escapeHtml(guide.guideDesc || "")}</p>${formulaLines.length > 0 ? `<ul style="margin:10px 0 0 0;padding-inline-start:20px;color:#292524;">${formulaLines.map((l) => `<li>${escapeHtml(l)}</li>`).join("")}</ul>` : ""}</section>` : ""}
        ${faqHtml}
        ${relatedHtml}
        ${meta.keywords?.length > 0 ? `<p style="margin-top:24px;font-size:0.8rem;color:#78716c;">${escapeHtml(meta.keywords.join(" · "))}</p>` : ""}
      </main>
    </div>`;
}

// Process and write prerendered files
for (const route of allPaths) {
  const langMatch = route.match(/^\/([a-z]{2})/);
  const lang = langMatch ? langMatch[1] : "en";
  const isRtl = lang === "he" || lang === "ar";
  const unlocalizedPath = route.replace(new RegExp(`^\\/${lang}`), "") || "/";
  const canonicalUrl =
    unlocalizedPath === "/"
      ? `https://globalcalcpro.com/${lang}/all`
      : `https://globalcalcpro.com${route}`;
  const hreflangSubPath = unlocalizedPath === "/" ? "/all" : unlocalizedPath;

  const meta = getRouteMetadata(route, lang);
  const { candidates } = resolveGuideAndBenchmark(unlocalizedPath, meta.calc);
  const langGuides = locales[lang]?.guides || {};
  let guide = null;
  let benchmark = null;
  for (const key of candidates) {
    if (!guide && langGuides[key]) guide = langGuides[key];
    if (!benchmark && benchmarkTables[key]) benchmark = benchmarkTables[key];
  }

  const safeTitle = escapeHtml(meta.title);
  const safeDesc = escapeHtml(meta.description);
  const safeKeywords = escapeHtml((meta.keywords || []).join(", "));
  const ogLocale = localeMap[lang] || "en_US";
  const cleanTitleForFaq = meta.title.replace(/ \| Global ?Calc Pro/gi, "").trim();
  const guideFaqs = Array.isArray(guide?.faq) ? guide.faq : [];
  const faqs =
    guideFaqs.length > 0
      ? guideFaqs
      : buildCalculatorFallbackFaqs(meta, lang, cleanTitleForFaq);

  let customHtml = baseHtml;

  // 1. Update html lang and dir attribute
  customHtml = customHtml.replace(
    /<html[^>]*>/i,
    `<html lang="${lang}" dir="${isRtl ? "rtl" : "ltr"}">`,
  );

  // 2. Update title tag
  customHtml = customHtml.replace(
    /<title>[^<]*<\/title>/i,
    `<title>${safeTitle}</title>`,
  );

  // 3. Update or inject meta description & page-specific localized keywords
  if (customHtml.includes('<meta name="description"')) {
    customHtml = customHtml.replace(
      /<meta name="description" content="[^"]*"/i,
      `<meta name="description" content="${safeDesc}"`,
    );
  } else {
    customHtml = customHtml.replace(
      "</head>",
      `  <meta name="description" content="${safeDesc}" />\n</head>`,
    );
  }

  if (safeKeywords) {
    if (customHtml.includes('<meta name="keywords"')) {
      customHtml = customHtml.replace(
        /<meta name="keywords" content="[^"]*"/i,
        `<meta name="keywords" content="${safeKeywords}"`,
      );
    } else {
      customHtml = customHtml.replace(
        "</head>",
        `  <meta name="keywords" content="${safeKeywords}" />\n</head>`,
      );
    }
  }

  // Handle noindex pages (like /suggest)
  if (meta.noindex) {
    customHtml = customHtml.replace(
      /<meta name="(robots|googlebot|bingbot)" content="[^"]*"/gi,
      `<meta name="$1" content="noindex, follow"`,
    );
  }

  // 4. Update OpenGraph tags
  customHtml = customHtml.replace(
    /<meta property="og:title" content="[^"]*"/i,
    `<meta property="og:title" content="${safeTitle}"`,
  );
  customHtml = customHtml.replace(
    /<meta property="og:description" content="[^"]*"/i,
    `<meta property="og:description" content="${safeDesc}"`,
  );
  customHtml = customHtml.replace(
    /<meta property="og:url" content="[^"]*"/i,
    `<meta property="og:url" content="${canonicalUrl}"`,
  );
  if (customHtml.includes('property="og:locale"')) {
    customHtml = customHtml.replace(
      /<meta property="og:locale" content="[^"]*"/i,
      `<meta property="og:locale" content="${ogLocale}"`,
    );
  } else {
    customHtml = customHtml.replace(
      "</head>",
      `  <meta property="og:locale" content="${ogLocale}" />\n</head>`,
    );
  }

  // 5. Update Twitter tags
  customHtml = customHtml.replace(
    /<meta name="twitter:title" content="[^"]*"/i,
    `<meta name="twitter:title" content="${safeTitle}"`,
  );
  customHtml = customHtml.replace(
    /<meta name="twitter:description" content="[^"]*"/i,
    `<meta name="twitter:description" content="${safeDesc}"`,
  );

  // 6. Inject or Replace Canonical and Hreflang tags
  const hreflangTags = languages
    .map(
      (l) =>
        `  <link rel="alternate" hreflang="${l}" href="https://globalcalcpro.com/${l}${hreflangSubPath}" />`,
    )
    .concat(
      `  <link rel="alternate" hreflang="x-default" href="https://globalcalcpro.com/en${hreflangSubPath}" />`,
    )
    .join("\n");

  const canonicalAndHreflang = `  <link rel="canonical" href="${canonicalUrl}" />\n${hreflangTags}`;

  if (customHtml.includes('rel="canonical"')) {
    customHtml = customHtml.replace(/<link rel="canonical"[^>]*>\s*/i, "");
    customHtml = customHtml.replace(/<link rel="alternate" hreflang="[^"]*"[^>]*>\s*/gi, "");
    customHtml = customHtml.replace("</head>", `${canonicalAndHreflang}\n</head>`);
  } else {
    customHtml = customHtml.replace("</head>", `${canonicalAndHreflang}\n</head>`);
  }

  // 7. Inject or Replace Schema.org JSON-LD Structured Data
  const jsonLdContent = createSchemaJsonLd(
    meta.title,
    meta.description,
    canonicalUrl,
    lang,
    meta.schemaType,
    unlocalizedPath,
    meta.category,
    meta.keywords,
    faqs,
  );
  const jsonLdScript = `  <script id="prerender-ld-json" type="application/ld+json">\n${jsonLdContent}\n  </script>`;

  if (customHtml.includes("application/ld+json")) {
    customHtml = customHtml.replace(
      /<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/i,
      jsonLdScript,
    );
  } else {
    customHtml = customHtml.replace("</head>", `${jsonLdScript}\n</head>`);
  }

  // 8. Replace #root inner shell with rich, crawlable semantic HTML (no sr-only hiding penalty)
  const localizedHeader = buildSemanticShell(route, lang, meta, guide, benchmark, faqs);
  customHtml = customHtml.replace(
    /<div id="root">[\s\S]*?<\/div>\s*(?=<script\b[^>]*type="module"|<\/body>)/i,
    `<div id="root">\n      ${localizedHeader}\n    </div>\n    `,
  );

  // Write extensionless .html files for subpaths so GitHub Pages / Vercel / Cloudflare serve HTTP 200 without 301 trailing-slash redirects
  if (unlocalizedPath === "/") {
    const langDir = path.join(distPath, lang);
    if (!fs.existsSync(langDir)) fs.mkdirSync(langDir, { recursive: true });
    fs.writeFileSync(path.join(langDir, "index.html"), customHtml);
  } else {
    const relHtmlFile = `${route.replace(/^\//, "")}.html`;
    const outFile = path.join(distPath, relHtmlFile);
    const outDir = path.dirname(outFile);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outFile, customHtml);
  }
}

// Ensure the root dist/index.html also has clean canonical pointing to https://globalcalcpro.com/en/all
const rootTitle = "Global Calculator Pro – Free Financial, Mortgage & Math Suite";
const rootDesc =
  "Multi-lingual financial, mortgage, compound interest, health, and math online calculators with high-precision Decimal math, Excel export, offline PWA, and embeddable widgets.";
const rootJsonLd = createSchemaJsonLd(
  rootTitle,
  rootDesc,
  "https://globalcalcpro.com/en/all",
  "en",
  "CollectionPage",
  "/all",
  null,
  ["Global Calculator Pro", "calculators", "mortgage calculator", "compound interest", "finance", "math"],
  [],
);

let rootHtml = baseHtml;
rootHtml = rootHtml.replace(/<link rel="canonical"[^>]*>/i, `<link rel="canonical" href="https://globalcalcpro.com/en/all" />`);
rootHtml = rootHtml.replace(/<link rel="alternate" hreflang="[^"]*"[^>]*>\s*/gi, "");
const rootHreflangs = languages
  .map((l) => `  <link rel="alternate" hreflang="${l}" href="https://globalcalcpro.com/${l}/all" />`)
  .concat(`  <link rel="alternate" hreflang="x-default" href="https://globalcalcpro.com/en/all" />`)
  .join("\n");
rootHtml = rootHtml.replace("</head>", `${rootHreflangs}\n</head>`);
if (rootHtml.includes("application/ld+json")) {
  rootHtml = rootHtml.replace(
    /<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/i,
    `  <script id="prerender-ld-json" type="application/ld+json">\n${rootJsonLd}\n  </script>`,
  );
} else {
  rootHtml = rootHtml.replace("</head>", `  <script id="prerender-ld-json" type="application/ld+json">\n${rootJsonLd}\n  </script>\n</head>`);
}
fs.writeFileSync(baseHtmlPath, rootHtml);

// Generate clean dist/404.html (strictly noindex, nofollow, no canonical/hreflang) for GitHub Pages SPA fallback
let notFoundHtml = baseHtml;
notFoundHtml = notFoundHtml.replace(
  /<meta name="(robots|googlebot|bingbot)" content="[^"]*"/gi,
  `<meta name="$1" content="noindex, nofollow"`,
);
notFoundHtml = notFoundHtml.replace(/<link rel="canonical"[^>]*>\s*/gi, "");
notFoundHtml = notFoundHtml.replace(/<link rel="alternate" hreflang="[^"]*"[^>]*>\s*/gi, "");
notFoundHtml = notFoundHtml.replace(/<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>\s*/gi, "");
fs.writeFileSync(path.join(distPath, "404.html"), notFoundHtml);

// Generate static redirect entry points for legacy URLs (.html, trailing slashes, old blog posts)
const legacyRedirectMap = {
  "/percentage": "/en/percentage-finder",
  "/percentage/": "/en/percentage-finder",
  "/percentage.html": "/en/percentage-finder",
  "/percentage-calculator": "/en/percentage-finder",
  "/percent": "/en/percentage-finder",
  "/percent/": "/en/percentage-finder",
  "/percent-finder": "/en/percentage-finder",
  "/percentages": "/en/percentage-finder",
  "/mortgage": "/en/mortgage-calculator",
  "/mortgage/": "/en/mortgage-calculator",
  "/mortgage-calculator.html": "/en/mortgage-calculator",
  "/compound": "/en/compound-interest",
  "/compound-interest.html": "/en/compound-interest",
  "/unit": "/en/unit-converter",
  "/unit-converter.html": "/en/unit-converter",
  "/bmi": "/en/bmi-calculator",
  "/bmi-calculator.html": "/en/bmi-calculator",
  "/tip": "/en/tip-calculator",
  "/tip-calculator.html": "/en/tip-calculator",
  "/salary": "/en/salary-calculator",
  "/salary-calculator.html": "/en/salary-calculator",
  "/age": "/en/age-calculator",
  "/age-calculator.html": "/en/age-calculator",
  "/privacy": "/en/privacy-policy",
  "/privacy/": "/en/privacy-policy",
  "/privacy.html": "/en/privacy-policy",
  "/terms": "/en/terms-of-service",
  "/terms/": "/en/terms-of-service",
  "/terms.html": "/en/terms-of-service",
  "/about-us": "/en/about",
  "/about/": "/en/about",
  "/about.html": "/en/about",
  "/contact-us": "/en/contact",
  "/contact/": "/en/contact",
  "/contact.html": "/en/contact",
  "/suggest-feature": "/en/suggest",
  "/2026/04/12/tech-as-your-personal-time-machine": "/en/calculators/download-time",
  "/2026/04/18/iran-negotiations-global-economy-impact": "/en/calculators/inflation",
  "/2026/04/10/happiness-roi-the-1-percent-rule": "/en/percentage-finder",
  "/2026/04/06/high-yield-savings-illusion": "/en/compound-interest",
  "/2026/03/30/mastering-mental-math-tricks": "/en/percentage-finder",
  "/2026/04/09/shrinkflation-hidden-price-hikes": "/en/calculators/inflation",
  "/2026/04/07/iran-conflict-strait-of-hormuz-economic-impact-on-global-markets-gas-prices-today": "/en/calculators/fuel-split",
  "/2026/04/08/hormuz-strait-iran-global-economy": "/en/calculators/fuel-split",
  "/2026/03/28/4-Simple-Ways-to-Calculate-Percentages-in-Your-Head-(No-Math-Degree-Required.html": "/en/percentage-finder",
  "/2026/03/28/4-simple-ways-to-calculate-percentages-in-your-head-no-math-degree-required": "/en/percentage-finder",
  "/2026/03/28/the-magic-of-compound-interest": "/en/compound-interest",
  "/2026/04/01/why-your-wallet-feels-the-squeeze-navigating-global-tensions-and-your-finances": "/en/category/finance",
  "/2026/04/16/the-silver-tax-demographic-economic-impact": "/en/calculators/severance-pay",
};

for (const [legacyPath, targetCanonical] of Object.entries(legacyRedirectMap)) {
  const targetUrl = `https://globalcalcpro.com${targetCanonical}`;
  const redirectHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="robots" content="noindex, follow">
  <title>Redirecting to ${targetCanonical}...</title>
  <meta http-equiv="refresh" content="0; url=${targetCanonical}">
  <link rel="canonical" href="${targetUrl}">
  <script>window.location.replace('${targetCanonical}');</script>
</head>
<body style="font-family: sans-serif; text-align: center; padding: 50px;">
  <p>Redirecting to <a href="${targetCanonical}">${targetUrl}</a>...</p>
</body>
</html>`;

  if (legacyPath.endsWith(".html")) {
    const filePath = path.join(distPath, legacyPath.replace(/^\//, ""));
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, redirectHtml);
  } else if (legacyPath.endsWith("/")) {
    const dir = path.join(distPath, legacyPath.replace(/^\//, ""));
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), redirectHtml);
  } else {
    const filePath = path.join(distPath, `${legacyPath.replace(/^\//, "")}.html`);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, redirectHtml);
  }
}

console.log(
  `[Prerender] Complete! Generated ${allPaths.length} static HTML pages with full SEO metadata, keywords, semantic HTML shells, FAQs, and JSON-LD schemas.`,
);
