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

for (const m of locMatches) {
  const fullUrl = m[1];
  const relPath = m[2].replace(/^\//, "");
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
  const canonicalMatch = html.match(/<link rel="canonical" href="([^"]*)"/i);
  if (!canonicalMatch || canonicalMatch[1] !== fullUrl) {
    errors.push(`Canonical mismatch on ${relPath}: got "${canonicalMatch?.[1]}", expected "${fullUrl}"`);
  }

  const ldMatch = html.match(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i);
  if (!ldMatch) {
    errors.push(`Missing JSON-LD script on ${relPath}`);
  } else {
    try {
      const json = JSON.parse(ldMatch[1]);
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
    } catch (e) {
      errors.push(`Invalid JSON-LD on ${relPath}: ${e.message}`);
    }
  }

  for (const linkMatch of html.matchAll(/<a\s+[^>]*href="([^"]*)"/gi)) {
    const href = linkMatch[1];
    if (href.startsWith("/") && !href.startsWith("//") && !distPathExists(href)) {
      errors.push(`Broken internal link "${href}" inside ${relPath}.html`);
    }
  }
}

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

if (errors.length > 0) {
  console.error(`❌ SEO & Link Verification Failed (${errors.length} issues):`);
  errors.slice(0, 25).forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}

console.log(
  `✅ Verified ${locMatches.length} sitemap URLs, JSON-LD schemas, 404.html noindex, and all internal links in dist/ with 0 errors.`,
);
