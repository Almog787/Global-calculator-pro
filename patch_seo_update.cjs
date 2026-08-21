const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/AllCalculators.tsx');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/<SEO\s+title=\{t\.libraryTitle\}\s+description=\{t\.librarySubtitle\}\s+canonicalUrl=\{`\/\$\{lang\}\/all`\}\s+structuredData=\{\{\s+'@context': 'https:\/\/schema\.org',\s+'@type': 'CollectionPage',\s+name: t\.libraryTitle,\s+description: t\.librarySubtitle,\s+url: `https:\/\/globalcalcpro\.com\/\$\{lang\}\/all`\s+\}\}\s+\/>/m, `<SEO
        title={t.libraryTitle}
        description={t.librarySubtitle}
        keywords={['calculators', 'AI assistant', 'Calc-E', 'finance', 'health', 'math', 'tools']}
        canonicalUrl={\`/\${lang}/all\`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: t.title,
          description: t.librarySubtitle,
          url: \`https://globalcalcpro.com/\${lang}/all\`,
          potentialAction: {
            '@type': 'SearchAction',
            target: \`https://globalcalcpro.com/\${lang}/all?search={search_term_string}\`,
            'query-input': 'required name=search_term_string'
          }
        }}
      />`);

fs.writeFileSync(file, content);
console.log('patched');
