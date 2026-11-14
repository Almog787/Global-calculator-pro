import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";

const calculatorsPath = path.resolve("src/data/calculators.ts");
const content = fs.readFileSync(calculatorsPath, "utf8");

// Extract all path properties cleanly
const pathRegex = /path:\s*['"]([^'"]+)['"]/g;
let match;
const dynamicPaths = [];

while ((match = pathRegex.exec(content)) !== null) {
  dynamicPaths.push(match[1]);
}

// Predefined general public-index paths (excluding /suggest and root redirect)
const staticPaths = [
  "/all",
  "/percentage-finder",
  "/compound-interest",
  "/mortgage-calculator",
  "/unit-converter",
  "/bmi-calculator",
  "/tip-calculator",
  "/salary-calculator",
  "/age-calculator",
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
  "/widgets",
];

const rawPaths = Array.from(new Set([...staticPaths, ...dynamicPaths]));
const languages = ["en", "he", "es", "fr", "ar", "ru"];
const baseUrl = "https://globalcalcpro.com";

// Resolve accurate per-file lastmod date (avoids noisy daily date bumps on unchanged pages)
const FALLBACK_DATE = "2026-04-30";
const gitDateCache = new Map();

function getGitLastMod(relFilePath) {
  if (gitDateCache.has(relFilePath)) return gitDateCache.get(relFilePath);
  let date = FALLBACK_DATE;
  if (fs.existsSync(".git") && fs.existsSync(relFilePath)) {
    try {
      const out = execFileSync("git", ["log", "-1", "--format=%cs", "--", relFilePath], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(out)) {
        date = out;
      }
    } catch {
      // keep fallback
    }
  }
  gitDateCache.set(relFilePath, date);
  return date;
}

const staticFileMap = {
  "/all": "src/pages/AllCalculators.tsx",
  "/widgets": "src/pages/WidgetsHub.tsx",
  "/about": "src/pages/AboutUs.tsx",
  "/contact": "src/pages/ContactUs.tsx",
  "/privacy-policy": "src/pages/PrivacyPolicy.tsx",
  "/terms-of-service": "src/pages/TermsOfService.tsx",
};

function resolveLastModForPath(p) {
  if (staticFileMap[p]) return getGitLastMod(staticFileMap[p]);
  if (p.startsWith("/category/")) return getGitLastMod("src/data/categoryHubs.ts");
  const slug = p.replace(/^\/calculators\//, "").replace(/^\//, "");
  const pascal = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
  const calcFile = `src/pages/calculators/${pascal}.tsx`;
  if (fs.existsSync(calcFile)) return getGitLastMod(calcFile);
  return getGitLastMod("src/data/calculators.ts");
}

const urlEntries = [];

for (const lang of languages) {
  for (const p of rawPaths) {
    const loc = `${baseUrl}/${lang}${p}`;
    const lastmod = resolveLastModForPath(p);

    let hreflangLinks = "";
    for (const altLang of languages) {
      hreflangLinks += `\n    <xhtml:link rel="alternate" hreflang="${altLang}" href="${baseUrl}/${altLang}${p}"/>`;
    }
    hreflangLinks += `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en${p}"/>`;

    urlEntries.push(`  <url>
    <loc>${loc}</loc>${hreflangLinks}
    <lastmod>${lastmod}</lastmod>
  </url>`);
  }
}

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries.join("\n")}
</urlset>
`;

fs.writeFileSync(path.resolve("public/sitemap.xml"), sitemapContent);
console.log(`Generated sitemap with ${urlEntries.length} canonical URLs.`);
