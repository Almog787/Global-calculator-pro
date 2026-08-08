import fs from 'fs';
import path from 'path';

// Read calculators.ts
const calculatorsPath = path.resolve('src/data/calculators.ts');
const content = fs.readFileSync(calculatorsPath, 'utf8');

// Extract all path properties
const pathRegex = /path:\s*['"]([^'"]+)['"]/g;
let match;
const dynamicPaths = [];

while ((match = pathRegex.exec(content)) !== null) {
  dynamicPaths.push(match[1]);
}

// Predefined general paths
const staticPaths = [
  '/',
  '/all',
  '/contact',
  '/privacy-policy',
  '/terms-of-service',
  '/about',
  '/suggest'
];

const rawPaths = Array.from(new Set([...staticPaths, ...dynamicPaths]));
const languages = ['en', 'he', 'es', 'fr', 'ar'];

const baseUrl = 'https://globalcalcpro.com';
const lastmod = new Date().toISOString().split('T')[0];

const urlEntries = [];

for (const lang of languages) {
  for (const p of rawPaths) {
    const loc = `${baseUrl}/${lang}${p === '/' ? '' : p}`;
    
    // Generate hreflang links for this path
    let hreflangLinks = '';
    for (const altLang of languages) {
      hreflangLinks += `\n    <xhtml:link rel="alternate" hreflang="${altLang}" href="${baseUrl}/${altLang}${p === '/' ? '' : p}"/>`;
    }
    hreflangLinks += `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en${p === '/' ? '' : p}"/>`;

    urlEntries.push(`  <url>
    <loc>${loc}</loc>${hreflangLinks}
    <lastmod>${lastmod}</lastmod>
    <changefreq>${p === '/all' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${p === '/all' ? '1.0' : p.startsWith('/calculators') ? '0.8' : '0.9'}</priority>
  </url>`);
  }
}

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries.join('\n')}
</urlset>
`;

fs.writeFileSync(path.resolve('public/sitemap.xml'), sitemapContent);
console.log(`Generated sitemap with ${urlEntries.length} URLs (Multilingual).`);
