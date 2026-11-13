import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, "../dist");

// Load all locales for meta tag & text injection
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

// Read paths, categories, and translations from calculators.ts
const calculatorsPath = path.resolve(__dirname, "../src/data/calculators.ts");
let dynamicPaths = [];
let dynamicTranslations = {};
const pathCategoryMap = {};

if (fs.existsSync(calculatorsPath)) {
  const content = fs.readFileSync(calculatorsPath, "utf8");
  const pathRegex = /path:\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = pathRegex.exec(content)) !== null) {
    dynamicPaths.push(match[1]);
  }

  const calcBlockRegex = /path:\s*['"]([^'"]+)['"][\s\S]{0,400}?category:\s*['"]([^'"]+)['"]/g;
  let blockMatch;
  while ((blockMatch = calcBlockRegex.exec(content)) !== null) {
    pathCategoryMap[blockMatch[1]] = blockMatch[2];
  }

  // Parse dynamic translations dictionary
  const dtRegex = /export const dynamicTranslations[^=]*=\s*({[\s\S]*?^};)/m;
  const dtMatch = dtRegex.exec(content);
  if (dtMatch) {
    try {
      const fn = new Function(`return ${dtMatch[1].replace(/;$/, "")}`);
      dynamicTranslations = fn();
    } catch {
      // Fallback if direct evaluation fails
    }
  }
}

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

function escapeHtmlAttr(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Route metadata resolver
function getRouteMetadata(route, lang) {
  const t = locales[lang]?.ui || locales.en.ui;
  const siteName = "Global Calc Pro";
  const unlocalizedPath = route.replace(new RegExp(`^\\/${lang}`), "") || "/";

  // Home
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
      schemaType: "WebApplication",
      category: null,
    };
  }

  // All Calculators Library
  if (unlocalizedPath === "/all") {
    const pageTitle = t.libraryTitle || "Calculator Library";
    const pageDesc = t.librarySubtitle || "Find the perfect tool for your calculations.";
    return {
      title: `${pageTitle} | ${siteName}`,
      description: pageDesc,
      schemaType: "CollectionPage",
      category: null,
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
      schemaType: "SoftwareApplication",
      category: null,
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
    return {
      title: `${pageTitle} | ${siteName}`,
      description: pageDesc,
      schemaType: "WebApplication",
      category: pathCategoryMap[unlocalizedPath] || null,
    };
  }

  // Dynamic calculators: /calculators/:id
  const calcMatch = unlocalizedPath.match(/^\/calculators\/([a-zA-Z0-9-]+)/);
  if (calcMatch) {
    const calcId = calcMatch[1];
    const calcMeta = dynamicTranslations[calcId]?.[lang] || dynamicTranslations[calcId]?.en;
    if (calcMeta) {
      return {
        title: `${calcMeta.title} | ${siteName}`,
        description: calcMeta.description,
        schemaType: "WebApplication",
        category: pathCategoryMap[unlocalizedPath] || null,
      };
    }
  }

  // Categories
  const catMatch = unlocalizedPath.match(/^\/category\/([a-zA-Z0-9-]+)/);
  if (catMatch) {
    const catKey = catMatch[1];
    const localizedCat = categoryLabels[catKey]?.[lang] || categoryLabels[catKey]?.en || catKey;
    const catTemplates = {
      en: {
        title: `${localizedCat} Calculators | ${siteName}`,
        desc: `Explore all verified ${localizedCat.toLowerCase()} calculators and tools on Global Calc Pro. Free, fast, and accurate.`,
      },
      he: {
        title: `מחשבוני ${localizedCat} | ${siteName}`,
        desc: `גלו את כל מחשבוני ה${localizedCat} המקצועיים ב-Global Calc Pro. חישוב מהיר, מדויק ובחינם.`,
      },
      es: {
        title: `Calculadoras de ${localizedCat} | ${siteName}`,
        desc: `Explora todas las calculadoras y herramientas verificadas de ${localizedCat} en Global Calc Pro. Gratis y precisas.`,
      },
      fr: {
        title: `Calculatrices ${localizedCat} | ${siteName}`,
        desc: `Découvrez toutes les calculatrices ${localizedCat} vérifiées sur Global Calc Pro. Gratuites, rapides et précises.`,
      },
      ar: {
        title: `حاسبات ${localizedCat} | ${siteName}`,
        desc: `استكشف جميع حاسبات وأدوات ${localizedCat} المعتمدة على Global Calc Pro مجاناً وبدقة عالية.`,
      },
      ru: {
        title: `Калькуляторы: ${localizedCat} | ${siteName}`,
        desc: `Все проверенные онлайн-калькуляторы категории «${localizedCat}» на Global Calc Pro. Бесплатно, быстро и точно.`,
      },
    };
    const tmpl = catTemplates[lang] || catTemplates.en;
    return {
      title: tmpl.title,
      description: tmpl.desc,
      schemaType: "CollectionPage",
      category: null,
    };
  }

  // Informational pages
  if (unlocalizedPath === "/about") {
    return {
      title: `${t.aboutTitle || "About Us"} | ${siteName}`,
      description:
        t.aboutDesc ||
        "Learn more about Global Calc Pro and our mission to provide accurate, accessible mathematical tools for everyone.",
      schemaType: "AboutPage",
      category: null,
    };
  }

  if (unlocalizedPath === "/contact") {
    return {
      title: `${t.contactTitle || "Contact Us"} | ${siteName}`,
      description:
        t.contactDesc ||
        "Get in touch with the Global Calc Pro engineering team for support, feedback, or custom calculator requests.",
      schemaType: "ContactPage",
      category: null,
    };
  }

  if (unlocalizedPath === "/privacy-policy") {
    return {
      title: `${t.privacyTitle || "Privacy Policy"} | ${siteName}`,
      description:
        t.privacyDesc ||
        "Global Calc Pro privacy policy, client-side data security, and privacy commitments.",
      schemaType: "WebPage",
      category: null,
    };
  }

  if (unlocalizedPath === "/terms-of-service") {
    return {
      title: `${t.termsTitle || "Terms of Service"} | ${siteName}`,
      description:
        t.termsDesc ||
        "Terms of service and usage guidelines for Global Calc Pro online calculations.",
      schemaType: "WebPage",
      category: null,
    };
  }

  if (unlocalizedPath === "/suggest") {
    return {
      title: `${t.suggestionsTitle || "Suggest a Calculator"} | ${siteName}`,
      description:
        t.suggestionsDesc ||
        "Suggest a new calculator, feature, or improvement for Global Calc Pro.",
      schemaType: "WebPage",
      category: null,
    };
  }

  return {
    title: `${t.libraryTitle || siteName} | ${siteName}`,
    description: t.librarySubtitle || "Free, instant online tools and calculators for everyday decisions.",
    schemaType: "WebPage",
    category: null,
  };
}

// Generate Unified JSON-LD Schema Graph (mirrors SEO.tsx to prevent duplicate/conflicting schemas)
function createSchemaJsonLd(title, description, canonicalUrl, lang, schemaType, unlocalizedPath = "/", category = null) {
  const isApp = schemaType === "WebApplication" || schemaType === "SoftwareApplication";
  const siteName = "Global Calc Pro";
  const baseUrl = "https://globalcalcpro.com";
  const cleanTitle = title.replace(/ \| Global ?Calc Pro/gi, "").replace(/ – GlobalCalc Pro.*/g, "");

  const breadcrumbList = [
    {
      "@type": "ListItem",
      position: 1,
      name: homeLabels[lang] || homeLabels.en,
      item: `${baseUrl}/${lang}`,
    },
  ];

  if (category && categoryLabels[category]) {
    breadcrumbList.push({
      "@type": "ListItem",
      position: 2,
      name: categoryLabels[category][lang] || categoryLabels[category].en,
      item: `${baseUrl}/${lang}/category/${category}`,
    });
  }

  if (unlocalizedPath && unlocalizedPath !== "/") {
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
    },
    {
      "@type": "WebPage",
      "@id": `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: title,
      description: description,
      inLanguage: lang,
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
      operatingSystem: "All",
      browserRequirements: "Requires JavaScript. Requires HTML5.",
      isAccessibleForFree: true,
      inLanguage: lang,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
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

// Process and write prerendered files
for (const route of allPaths) {
  const routeDir = path.join(distPath, route);
  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }

  // Extract language from route
  const langMatch = route.match(/^\/([a-z]{2})/);
  const lang = langMatch ? langMatch[1] : "en";
  const isRtl = lang === "he" || lang === "ar";
  const canonicalUrl = `https://globalcalcpro.com${route}`;
  const unlocalizedPath = route.replace(new RegExp(`^\\/${lang}`), "") || "/";
  const { title, description, schemaType, category } = getRouteMetadata(route, lang);
  const safeTitle = escapeHtmlAttr(title);
  const safeDesc = escapeHtmlAttr(description);
  const ogLocale = localeMap[lang] || "en_US";

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

  // 3. Update or inject meta description
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
        `  <link rel="alternate" hreflang="${l}" href="https://globalcalcpro.com/${l}${unlocalizedPath === "/" ? "" : unlocalizedPath}" />`,
    )
    .concat(
      `  <link rel="alternate" hreflang="x-default" href="https://globalcalcpro.com/en${unlocalizedPath === "/" ? "" : unlocalizedPath}" />`,
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
    title,
    description,
    canonicalUrl,
    lang,
    schemaType,
    unlocalizedPath,
    category,
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

  // 8. Inject or Replace Semantic Content Shell inside <div id="root"> for crawlers & bots
  const localizedHeader = `<header class="sr-only" style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0;">\n        <h1>${safeTitle}</h1>\n        <p>${safeDesc}</p>\n      </header>`;

  if (customHtml.includes('<header class="sr-only"')) {
    customHtml = customHtml.replace(/<header class="sr-only"[^>]*>[\s\S]*?<\/header>/i, localizedHeader);
  } else if (customHtml.includes('<div id="root">')) {
    customHtml = customHtml.replace(
      /<div id="root">/i,
      `<div id="root">\n      ${localizedHeader}`,
    );
  }

  fs.writeFileSync(path.join(routeDir, "index.html"), customHtml);
}

// Ensure the root dist/index.html also has full rich SEO metadata, JSON-LD, and H1
const rootTitle = "GlobalCalc Pro – Free Online Smart Calculators [2026]";
const rootDesc = "Free online calculators for finance, mortgages, health, math, and daily life. Fast, accurate, and easy to use.";
const rootJsonLd = createSchemaJsonLd(rootTitle, rootDesc, "https://globalcalcpro.com/en", "en", "WebApplication", "/", null);

let rootHtml = baseHtml;
rootHtml = rootHtml.replace(/<title>[^<]*<\/title>/i, `<title>${rootTitle}</title>`);
if (!rootHtml.includes('rel="canonical"')) {
  const rootHreflang = languages
    .map((l) => `  <link rel="alternate" hreflang="${l}" href="https://globalcalcpro.com/${l}" />`)
    .concat(`  <link rel="alternate" hreflang="x-default" href="https://globalcalcpro.com/en" />`)
    .join("\n");
  rootHtml = rootHtml.replace("</head>", `  <link rel="canonical" href="https://globalcalcpro.com/en" />\n${rootHreflang}\n</head>`);
}
if (rootHtml.includes("application/ld+json")) {
  rootHtml = rootHtml.replace(
    /<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/i,
    `  <script id="prerender-ld-json" type="application/ld+json">\n${rootJsonLd}\n  </script>`,
  );
} else {
  rootHtml = rootHtml.replace("</head>", `  <script id="prerender-ld-json" type="application/ld+json">\n${rootJsonLd}\n  </script>\n</head>`);
}
fs.writeFileSync(baseHtmlPath, rootHtml);

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
  } else {
    const dir = path.join(distPath, legacyPath.replace(/^\//, ""));
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), redirectHtml);
  }
}

console.log(
  `[Prerender] Complete! Generated ${allPaths.length} static HTML pages with full SEO metadata, JSON-LD schemas, and hreflang links.`,
);
