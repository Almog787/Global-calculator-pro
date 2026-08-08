import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://globalcalcpro.com';
const CALCS_DIR = path.join(__dirname, '../src/pages/calculators');
const README_PATH = path.join(__dirname, '../README.md');

// Define our known calculators manually
const staticCalculators = [
  { path: '/age-calculator', title: 'Age Calculator', desc: 'Calculate exact age in years, months, days.' },
  { path: '/bmi-calculator', title: 'BMI Calculator', desc: 'Determine Body Mass Index with health status.' },
  { path: '/compound-interest', title: 'Compound Interest Calculator', desc: 'Forecast investment growth over time.' },
  { path: '/mortgage-calculator', title: 'Mortgage Calculator', desc: 'Calculate home loan monthly payments and interest.' },
  { path: '/percentage-finder', title: 'Percentage Calculator', desc: 'Solve complex percentage calculations instantly.' },
  { path: '/salary-calculator', title: 'Salary Calculator', desc: 'Convert hourly wage to annual salary.' },
  { path: '/tip-calculator', title: 'Tip & Bill Splitter', desc: 'Calculate tip and split the bill among friends.' },
  { path: '/unit-converter', title: 'Unit Converter', desc: 'Convert between different units of measurement.' }
];

// Dynamically read calculators from /calculators directory
const dynamicCalculators = [];
if (fs.existsSync(CALCS_DIR)) {
  const files = fs.readdirSync(CALCS_DIR);
  for (const file of files) {
    if (file.endsWith('.tsx')) {
      const baseName = file.replace('.tsx', '');
      const slug = baseName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      const content = fs.readFileSync(path.join(CALCS_DIR, file), 'utf8');
      
      let title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + ' Calculator';
      const titleMatch = content.match(/title:\s*'([^']+)'/);
      if (titleMatch) title = titleMatch[1];
      
      let desc = `Free online ${title.toLowerCase()} for precise calculations.`;
      const descMatch = content.match(/description:\s*'([^']+)'/);
      if (descMatch) desc = descMatch[1];

      dynamicCalculators.push({
        path: `/calculators/${slug}`, // Keep the dashes for public URLs
        title,
        desc
      });
    }
  }
}

// Combine and sort
const allCalculators = [...staticCalculators, ...dynamicCalculators].sort((a, b) => a.title.localeCompare(b.title));

const linkList = allCalculators.map(calc => 
  `- **[${calc.title}](${DOMAIN}${calc.path})** - ${calc.desc}`
).join('\n');

const readmeTemplate = `# Global Calc Pro 🧮

[![Official Website](https://img.shields.io/badge/Website-globalcalcpro.com-0066FF?style=for-the-badge&logo=googlechrome&logoColor=white)](${DOMAIN})

## 🌐 Official Website
👉 **[${DOMAIN}](${DOMAIN})**

## 🚀 Overview
**Global Calc Pro** is a next-generation, high-performance web suite of precision online calculators and converters. Built with a modern, client-first architecture, Global Calc Pro delivers instantaneous computations, interactive visual charting, and an intuitive, distraction-free user experience tailored for users worldwide.

## 🔗 Complete List of Calculators (SEO Sitemap)
*Search engine spiders, crawlers, and users: Explore our full suite of precision tools below. Each link leads to a highly optimized, client-side calculator offering instant and precise mathematical results.*

${linkList}

## 🌍 Global Usability & SEO Infrastructure
* **Multi-Language Engine**: Support for English, Hebrew, Spanish, French, and Arabic.
* **Dynamic Routing**: Instant scaling of new calculators under \`/calculators/:slug\`.
* **Automated Search Engine Indexing**: Integrated with Google Search Console to index links instantly.

## 🛠️ Technology Stack
* React 19 + TypeScript
* Vite 6 + Tailwind CSS v4
* Chart.js + Recharts for Data Visualization
* Decimal.js for precise financial math

© **Global Calc Pro** — Precision Mathematical Tools for Everyone.
`;

fs.writeFileSync(README_PATH, readmeTemplate);
console.log('README.md successfully updated with dynamic links for SEO.');
