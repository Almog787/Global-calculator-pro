import fs from "fs";
import path from "path";

const distDir = path.resolve("dist");
const sitemapPath = path.resolve("public/sitemap.xml");

if (!fs.existsSync(distDir) || !fs.existsSync(sitemapPath)) {
  console.error("Error: dist/ or public/sitemap.xml not found. Run npm run build first.");
  process.exit(1);
}

const sitemap = fs.readFileSync(sitemapPath, "utf8");
const locMatches = [...sitemap.matchAll(/<loc>(https:\/\/globalcalcpro\.com([^<]*))<\/loc>/g)];

const errors = [];
const resolvedPaths = new Set();

function distPathExists(href) {
  const clean = href.split("#")[0].split("?")[0];
  if (!clean || !clean.startsWith("/")) return true;
  if (resolvedPaths.has(clean)) return true;

  const rel = clean.replace(/^\//, "");
  const candidates = [
    path.join(distDir, rel),
    path.join(distDir, `${rel}.html`),
    path.join(distDir, rel, "index.html"),
  ];
  const exists = candidates.some((c) => fs.existsSync(c) && fs.statSync(c).isFile());
  if (exists) resolvedPaths.add(clean);
  return exists;
}

const seenTitles = new Map();
const seenDescs = new Map();
const expectedHreflangs = ["en", "he", "es", "fr", "ar", "ru", "x-default"];

for (const m of locMatches) {
  const fullUrl = m[1];
  const relPath = m[2].replace(/^\//, "");
  const langMatch = relPath.match(/^([a-z]{2})\//);
  const lang = langMatch ? langMatch[1] : "en";
  const expectedDir = lang === "he" || lang === "ar" ? "rtl" : "ltr";
  const htmlFile = path.join(distDir, `${relPath}.html`);
  const indexFile = path.join(distDir, relPath, "index.html");

  if (!fs.existsSync(htmlFile)) {
    errors.push(`Missing prerendered HTML for sitemap URL: ${relPath}.html`);
    continue;
  }
  if (fs.existsSync(indexFile)) {
    errors.push(`Trailing-slash directory conflict exists for sitemap URL: ${relPath}/index.html`);
  }

  const html = fs.readFileSync(htmlFile, "utf8");

  // 1. Check html lang and dir
  const htmlTagMatch = html.match(/<html\s+lang="([^"]*)"\s+dir="([^"]*)"/i);
  if (!htmlTagMatch || htmlTagMatch[1] !== lang || htmlTagMatch[2] !== expectedDir) {
    errors.push(`HTML lang/dir mismatch on ${relPath}: got lang="${htmlTagMatch?.[1]}" dir="${htmlTagMatch?.[2]}", expected lang="${lang}" dir="${expectedDir}"`);
  }

  // 2. Check exactly 1 canonical matching fullUrl
  const canonicalMatches = [...html.matchAll(/<link\s+rel="canonical"\s+href="([^"]*)"/gi)];
  if (canonicalMatches.length !== 1 || canonicalMatches[0][1] !== fullUrl) {
    errors.push(`Canonical issue on ${relPath}: count=${canonicalMatches.length}, href="${canonicalMatches[0]?.[1]}", expected="${fullUrl}"`);
  }

  // 3. Check all 7 hreflang tags (en, he, es, fr, ar, ru, x-default) with no duplicates
  const hreflangMatches = [...html.matchAll(/<link\s+rel="alternate"\s+hreflang="([^"]*)"\s+href="([^"]*)"/gi)];
  const foundLangs = hreflangMatches.map((x) => x[1]);
  for (const reqLang of expectedHreflangs) {
    const occurrences = foundLangs.filter((l) => l === reqLang).length;
    if (occurrences !== 1) {
      errors.push(`Hreflang "${reqLang}" count=${occurrences} on ${relPath} (expected 1)`);
    }
  }

  // 4. Check unique non-empty title & meta description >= 50 chars
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  const titleText = titleMatch ? titleMatch[1].trim() : "";
  if (!titleText || titleText.length < 10) {
    errors.push(`Missing or too short <title> on ${relPath}: "${titleText}"`);
  } else if (seenTitles.has(titleText)) {
    errors.push(`Duplicate <title> "${titleText}" on ${relPath} (also on ${seenTitles.get(titleText)})`);
  } else {
    seenTitles.set(titleText, relPath);
  }

  const descMatches = [...html.matchAll(/<meta\s+name="description"\s+content="([^"]*)"/gi)];
  if (descMatches.length !== 1) {
    errors.push(`Expected 1 meta description on ${relPath}, found ${descMatches.length}`);
  } else {
    const descText = descMatches[0][1].trim();
    if (descText.length < 50) {
      errors.push(`Meta description too short (${descText.length} chars) on ${relPath}: "${descText}"`);
    } else if (seenDescs.has(descText)) {
      errors.push(`Duplicate meta description on ${relPath} (also on ${seenDescs.get(descText)})`);
    } else {
      seenDescs.set(descText, relPath);
    }
  }

  // 5. Ensure indexable sitemap pages are NOT noindex and do NOT contain duplicate robots tags with conflicting directives
  if (/content="[^"]*noindex/i.test(html)) {
    errors.push(`Sitemap URL ${relPath} contains noindex directive!`);
  }

  // 6. Check visible <h1> in prerendered HTML
  if (!/<h1\b[^>]*>[\s\S]+?<\/h1>/i.test(html)) {
    errors.push(`Missing visible <h1> in prerendered HTML: ${relPath}`);
  }

  // 7. Check JSON-LD schemas
  const ldMatches = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  if (ldMatches.length !== 1) {
    errors.push(`Expected 1 JSON-LD script on ${relPath}, found ${ldMatches.length}`);
  } else {
    try {
      const json = JSON.parse(ldMatches[0][1]);
      const types = (json["@graph"] || []).map((x) => x["@type"]);
      const isCalc =
        !relPath.endsWith("/all") &&
        !relPath.includes("/category/") &&
        !relPath.endsWith("/widgets") &&
        !relPath.endsWith("/about") &&
        !relPath.endsWith("/contact") &&
        !relPath.endsWith("/privacy-policy") &&
        !relPath.endsWith("/terms-of-service") &&
        !relPath.endsWith("/suggest");
      if (isCalc && !types.includes("FAQPage")) {
        errors.push(`Calculator route missing FAQPage JSON-LD: ${relPath}`);
      }
      if ((relPath.endsWith("/privacy-policy") || relPath.endsWith("/terms-of-service")) && types.includes("WebApplication")) {
        errors.push(`Legal page should not emit WebApplication schema: ${relPath}`);
      }
    } catch (e) {
      errors.push(`Invalid JSON-LD on ${relPath}: ${e.message}`);
    }
  }

  // 8. Check internal links
  for (const linkMatch of html.matchAll(/<a\s+[^>]*href="([^"]*)"/gi)) {
    const href = linkMatch[1];
    if (href.startsWith("/") && !href.startsWith("//") && !distPathExists(href)) {
      errors.push(`Broken internal link "${href}" inside ${relPath}.html`);
    }
  }
}

// Check noindex pages (/404.html and /{lang}/suggest.html)
const h404Path = path.join(distDir, "404.html");
if (!fs.existsSync(h404Path)) {
  errors.push("Missing dist/404.html");
} else {
  const h404 = fs.readFileSync(h404Path, "utf8");
  if (!h404.includes("noindex") || h404.includes('content="index,')) {
    errors.push("dist/404.html must be strictly noindex and not index,follow");
  }
  if (h404.includes('rel="canonical"')) {
    errors.push("dist/404.html must not contain a canonical link");
  }
}

for (const lang of ["en", "he", "es", "fr", "ar", "ru"]) {
  const suggestPath = path.join(distDir, lang, "suggest.html");
  if (fs.existsSync(suggestPath)) {
    const suggestHtml = fs.readFileSync(suggestPath, "utf8");
    if (!suggestHtml.includes("noindex") || suggestHtml.includes('content="index,')) {
      errors.push(`dist/${lang}/suggest.html must be strictly noindex and not index,follow`);
    }
  }
}

// Check dist/robots.txt
const distRobotsPath = path.join(distDir, "robots.txt");
if (!fs.existsSync(distRobotsPath)) {
  errors.push("Missing dist/robots.txt");
} else {
  const robotsTxt = fs.readFileSync(distRobotsPath, "utf8");
  if (!robotsTxt.includes("sitemap.xml")) {
    errors.push("dist/robots.txt must reference sitemap.xml");
  }
}

// Check Workbox Service Worker does not hijack prerendered navigation with index.html
const swPath = path.join(distDir, "sw.js");
if (!fs.existsSync(swPath)) {
  errors.push("Missing dist/sw.js");
} else {
  const swJs = fs.readFileSync(swPath, "utf8");
  if (swJs.includes('createHandlerBoundToURL("index.html")') || swJs.includes('createHandlerBoundToURL("/index.html")')) {
    errors.push('dist/sw.js must not use createHandlerBoundToURL("index.html") navigation fallback (breaks prerendered HTML)');
  }
}

if (errors.length > 0) {
  console.error(`❌ SEO & Link Verification Failed (${errors.length} issues):`);
  errors.slice(0, 25).forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}

console.log(
  `✅ Verified ${locMatches.length} sitemap URLs (unique titles/descriptions >=50 chars, canonical, 7 hreflangs, H1, JSON-LD, noindex guards, sw.js & internal links) with 0 errors.`,
);
