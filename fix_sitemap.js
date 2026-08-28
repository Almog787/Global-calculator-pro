import fs from 'fs';
let code = fs.readFileSync('scripts/generate-sitemap.js', 'utf8');

const replacement = `// Add root domain as standalone entry
let rootHreflangLinks = "";
for (const altLang of languages) {
  rootHreflangLinks += \`\\n    <xhtml:link rel="alternate" hreflang="\${altLang}" href="\${baseUrl}/\${altLang}"/>\`;
}
rootHreflangLinks += \`\\n    <xhtml:link rel="alternate" hreflang="x-default" href="\${baseUrl}/en"/>\`;

urlEntries.unshift(\`  <url>
    <loc>\${baseUrl}/</loc>\${rootHreflangLinks}
    <lastmod>\${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>\`);

const sitemapContent =`;

code = code.replace('const sitemapContent =', replacement);
fs.writeFileSync('scripts/generate-sitemap.js', code);
