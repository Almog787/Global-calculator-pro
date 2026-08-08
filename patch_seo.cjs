const fs = require('fs');
const path = require('path');

const dirsToScan = ['src/pages', 'src/pages/calculators'];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Skip if it doesn't have Helmet or already uses SEO
  if (!content.includes('<Helmet>')) return;

  const isNested = filePath.includes('calculators/');
  const seoImportPath = isNested ? '../../components/SEO' : '../components/SEO';

  // Replace import
  if (content.includes("import { Helmet } from 'react-helmet-async';")) {
    content = content.replace("import { Helmet } from 'react-helmet-async';", `import SEO from '${seoImportPath}';`);
  } else if (content.includes('import { Helmet } from "react-helmet-async";')) {
    content = content.replace('import { Helmet } from "react-helmet-async";', `import SEO from '${seoImportPath}';`);
  }

  // Extract Helmet block
  const helmetRegex = /<Helmet>([\s\S]*?)<\/Helmet>/;
  const match = content.match(helmetRegex);

  if (match) {
    const helmetContent = match[1];

    let titleMatch = helmetContent.match(/<title>([^<]+)<\/title>/);
    let titleStr = "''";
    if (titleMatch) {
      let rawTitle = titleMatch[1].trim();
      // If it looks like {t.mortgageTitle} | {t.title}, clean it up to just {t.mortgageTitle}
      rawTitle = rawTitle.replace(/\s*\|\s*\{t\.title\}/g, '');
      if (rawTitle.startsWith('{') && rawTitle.endsWith('}')) {
        titleStr = rawTitle.slice(1, -1);
      } else {
        titleStr = `\`${rawTitle.replace(/\{([^}]+)\}/g, '${$1}')}\``;
      }
    }

    let descMatch = helmetContent.match(/<meta[^>]*name="description"[^>]*content=({[^}]+}|"[^"]+")[^>]*>/);
    let descStr = "''";
    if (descMatch) {
      let rawDesc = descMatch[1].trim();
      if (rawDesc.startsWith('{') && rawDesc.endsWith('}')) {
        descStr = rawDesc.slice(1, -1);
      } else {
        descStr = rawDesc; // already a string literal
      }
    }

    let canonicalMatch = helmetContent.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"[^>]*>/);
    let canonicalStr = '';
    if (canonicalMatch) {
      let fullUrl = canonicalMatch[1];
      if (fullUrl.startsWith('https://globalcalcpro.com')) {
        canonicalStr = fullUrl.replace('https://globalcalcpro.com', '');
      } else {
        canonicalStr = fullUrl;
      }
    }

    // Default canonical if not found
    if (!canonicalStr) {
      const fileName = path.basename(filePath, '.tsx');
      canonicalStr = isNested ? `/calculators/${fileName.toLowerCase()}` : `/${fileName.toLowerCase()}`;
    }

    const replacement = `<SEO
        title={${titleStr}}
        description={${descStr}}
        canonicalUrl="${canonicalStr}"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: ${titleStr},
          description: ${descStr},
          applicationCategory: 'CalculatorApplication',
          operatingSystem: 'Any',
          url: \`https://globalcalcpro.com\${"${canonicalStr}"}\`
        }}
      />`;

    content = content.replace(match[0], replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

dirsToScan.forEach(dir => {
  const fullDirPath = path.resolve(dir);
  if (fs.existsSync(fullDirPath)) {
    const files = fs.readdirSync(fullDirPath);
    files.forEach(file => {
      if (file.endsWith('.tsx')) {
        processFile(path.join(fullDirPath, file));
      }
    });
  }
});
