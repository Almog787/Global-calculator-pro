import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, "../dist");

// Read paths to prerender from calculators.ts
const calculatorsPath = path.resolve(__dirname, "../src/data/calculators.ts");
let dynamicPaths = [];
if (fs.existsSync(calculatorsPath)) {
  const content = fs.readFileSync(calculatorsPath, "utf8");
  const pathRegex = /path:\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = pathRegex.exec(content)) !== null) {
    dynamicPaths.push(match[1]);
  }
}

const staticPaths = [
  "/",
  "/all",
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
const languages = ["en", "he", "es", "fr", "ar"];

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
  `Generating static HTML entry points for ${allPaths.length} routes...`,
);

for (const route of allPaths) {
  const routeDir = path.join(distPath, route);
  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }

  // Extract language from route
  const langMatch = route.match(/^\/([a-z]{2})/);
  const lang = langMatch ? langMatch[1] : "en";
  const isRtl = lang === "he" || lang === "ar";

  let customHtml = baseHtml;
  // Update html lang and dir attribute
  customHtml = customHtml.replace(
    /<html[^>]*>/i,
    `<html lang="${lang}" dir="${isRtl ? "rtl" : "ltr"}">`,
  );

  fs.writeFileSync(path.join(routeDir, "index.html"), customHtml);
}

// Generate static redirect entry points for legacy URLs (.html, trailing slashes, old blog posts)
const legacyRedirectMap = {
  "/percentage": "/en/percentage-finder",
  "/percentage/": "/en/percentage-finder",
  "/percentage.html": "/en/percentage-finder",
  "/percent": "/en/percentage-finder",
  "/percent-finder": "/en/percentage-finder",
  "/compound-interest.html": "/en/compound-interest",
  "/unit-converter.html": "/en/unit-converter",
  "/privacy": "/en/privacy-policy",
  "/privacy/": "/en/privacy-policy",
  "/privacy.html": "/en/privacy-policy",
  "/terms": "/en/terms-of-service",
  "/terms/": "/en/terms-of-service",
  "/terms.html": "/en/terms-of-service",
  "/about-us": "/en/about",
  "/about/": "/en/about",
  "/contact-us": "/en/contact",
  "/contact/": "/en/contact",
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
  <title>Redirecting...</title>
  <meta http-equiv="refresh" content="0; url=${targetCanonical}">
  <link rel="canonical" href="${targetUrl}">
  <meta name="robots" content="noindex, follow">
  <script>window.location.replace('${targetCanonical}');</script>
</head>
<body style="font-family: sans-serif; text-align: center; padding: 50px;">
  <p>Redirecting to <a href="${targetCanonical}">${targetUrl}</a>...</p>
</body>
</html>`;

  // Write file directly if ending with .html, otherwise inside directory index.html
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
  `Static entry points generated successfully for ${allPaths.length} routes and ${Object.keys(legacyRedirectMap).length} legacy redirects.`,
);
