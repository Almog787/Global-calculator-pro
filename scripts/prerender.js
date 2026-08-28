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

console.log(
  `Static entry points generated successfully for ${allPaths.length} routes.`,
);
