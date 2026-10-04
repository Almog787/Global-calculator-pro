import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://globalcalcpro.com';
const CALCS_DIR = path.join(__dirname, '../src/pages/calculators');
const README_PATH = path.join(__dirname, '../README.md');

// Define known core calculators with custom top-level paths
const staticCalculators = [
  { path: '/mortgage-calculator', title: 'Mortgage & Loan Amortization Calculator', category: 'Finance', desc: 'Calculate home loan payments, interest breakdowns, and amortization schedules.' },
  { path: '/compound-interest', title: 'Compound Interest & Wealth Planner', category: 'Finance', desc: 'Forecast investment growth, monthly DCA compounding, and retirement targets.' },
  { path: '/salary-calculator', title: 'Salary Gross-to-Net Take-Home Calculator', category: 'Finance', desc: 'Convert gross salary to net pay with income tax, social security, and health deductions.' },
  { path: '/percentage-finder', title: 'Percentage & Discount Calculator', category: 'Math', desc: 'Solve complex percentage calculations, discounts, price markups, and differences.' },
  { path: '/unit-converter', title: 'Universal Unit Converter', category: 'Conversion', desc: 'High-precision conversion across length, weight, volume, temperature, and speed.' },
  { path: '/bmi-calculator', title: 'BMI (Body Mass Index) & Healthy Weight', category: 'Health', desc: 'Calculate Body Mass Index and find recommended healthy weight ranges.' },
  { path: '/tip-calculator', title: 'Tip & Fair Bill Splitter', category: 'Daily Life', desc: 'Calculate restaurant gratuity and split bills equally among diners.' },
  { path: '/age-calculator', title: 'Age & Milestone Birthday Calculator', category: 'Daily Life', desc: 'Calculate exact chronological age in years, months, days, hours, and next birthday.' }
];

// Dynamically read calculators from /calculators directory
const dynamicCalculators = [];
if (fs.existsSync(CALCS_DIR)) {
  const files = fs.readdirSync(CALCS_DIR);
  for (const file of files) {
    if (file.endsWith('.tsx')) {
      const baseName = file.replace('.tsx', '');
      
      // Skip files already in staticCalculators
      const isStatic = staticCalculators.some(sc => sc.path.replace('/', '') === baseName.toLowerCase() || sc.title.toLowerCase().includes(baseName.toLowerCase()));
      if (isStatic) continue;

      const slug = baseName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      const content = fs.readFileSync(path.join(CALCS_DIR, file), 'utf8');
      
      let title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + ' Calculator';
      const titleMatch = content.match(/title:\s*'([^']+)'/);
      if (titleMatch) title = titleMatch[1];
      
      let desc = `Free online ${title.toLowerCase()} for precise calculations.`;
      const descMatch = content.match(/description:\s*'([^']+)'/);
      if (descMatch) desc = descMatch[1];

      // Assign categories based on keywords
      let category = 'Utility';
      const lower = (slug + ' ' + title + ' ' + desc).toLowerCase();
      if (lower.match(/tax|vat|salary|mortgage|interest|loan|credit|debt|roi|margin|stock|equity|severance|pension|break-even|savings|inflation|cap-rate|finance/)) {
        category = 'Finance & Real Estate';
      } else if (lower.match(/matrix|linear|equation|regression|z-score|complex|quadratic|triangle|circle|bitwise|binary|math/)) {
        category = 'Math & Science';
      } else if (lower.match(/bmi|pregnancy|bmr|health|sleep|water/)) {
        category = 'Health & Medical';
      }

      dynamicCalculators.push({
        path: `/calculators/${slug}`,
        slug,
        title,
        desc,
        category
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
### Next-Gen Open-Source Calculator Engine & Free Embeddable Widgets Suite

[![Official Website](https://img.shields.io/badge/Website-globalcalcpro.com-0066FF?style=for-the-badge&logo=googlechrome&logoColor=white)](${DOMAIN})
[![Widgets Hub](https://img.shields.io/badge/Widgets-Embed%20Calculators-00A86B?style=for-the-badge&logo=html5&logoColor=white)](${DOMAIN}/en/widgets)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Vitest Tests](https://img.shields.io/badge/Tests-210%20Passed-brightgreen?style=for-the-badge&logo=vitest&logoColor=white)](https://github.com/Almog787/Global-calculator-pro)
[![TypeScript 5.9](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline%20First-purple?style=for-the-badge&logo=pwa&logoColor=white)](${DOMAIN})
[![i18n Ready](https://img.shields.io/badge/Languages-EN%20%7C%20HE%20%7C%20ES%20%7C%20FR%20%7C%20AR%20%7C%20RU-orange?style=for-the-badge)](${DOMAIN})

**[Global Calc Pro](https://globalcalcpro.com)** is an open-source, high-performance web suite of precision online calculators, financial modeling tools, and **[free embeddable calculator widgets](https://globalcalcpro.com/en/widgets)** for webmasters, developers, and bloggers. 

Built with a zero-latency, client-side first architecture, Global Calc Pro delivers arbitrary-precision math (powered by \`Decimal.js\`), interactive visual charts, offline Progressive Web App (PWA) capabilities, and full Right-to-Left (RTL) localization across 6 major languages: **English, Hebrew, Spanish, French, Arabic, and Russian**.

---

## 📑 Table of Contents

- [🌐 Live Interactive Portal](#-live-interactive-portal--widgets-hub)
- [🧩 Embed Calculator Widgets on Any Website](#-embed-calculator-widgets-on-any-website)
  - [1. Simple HTML / Iframe Embed](#1-simple-html--iframe-embed)
  - [2. React / Next.js Component Embed](#2-react--nextjs-component-embed)
  - [3. WordPress, Elementor & Gutenberg](#3-wordpress-elementor--gutenberg)
  - [🎛️ Widget Customization Parameters](#️-widget-customization-parameters)
- [⚡ Key Engineering Features](#-key-engineering-features)
- [📂 Complete Calculator Directory](#-complete-calculator-directory)
  - [💰 Finance, Taxes & Real Estate](#-finance-taxes--real-estate)
  - [📐 Mathematics, Statistics & Science](#-mathematics-statistics--science)
  - [🩺 Health, Fitness & Medical](#-health-fitness--medical)
  - [⚡ Daily Utility & Conversions](#-daily-utility--conversions)
- [🔗 Full SEO Sitemap Catalog (${allCalculators.length} Calculators)](#-full-seo-sitemap-catalog-${allCalculators.length}-calculators)
- [🧰 Developer Ecosystem & Recommended Open-Source SEO Tools](#-developer-ecosystem--recommended-open-source-seo-tools)
- [❓ Frequently Asked Questions (FAQ)](#-frequently-asked-questions-faq)
- [🛠️ Developer Quick Start](#️-developer-quick-start)
- [🏗️ Technical Architecture](#️-technical-architecture)
- [🤝 Contributing](#-contributing)
- [⭐ Star the Project](#-star-the-project)
- [📄 License](#-license)

---

## 🌐 Live Interactive Portal & Widgets Hub
- 🚀 **Full Web Application:** [https://globalcalcpro.com](https://globalcalcpro.com)
- 🧩 **Interactive Widget Builder:** [https://globalcalcpro.com/en/widgets](https://globalcalcpro.com/en/widgets)
- 📚 **Sitemap & Directory:** [https://globalcalcpro.com/en/all](https://globalcalcpro.com/en/all)
- 🔍 **SEO & Structured Data Index:** [https://globalcalcpro.com/sitemap.xml](https://globalcalcpro.com/sitemap.xml)

---

## 🧩 Embed Calculator Widgets on Any Website

You can embed any calculator from Global Calc Pro directly into your blog, documentation, WordPress site, Webflow, Shopify, or SaaS portal for free with a single line of HTML or React code!

### 1. Simple HTML / Iframe Embed
Copy and paste this snippet into any webpage:

\`\`\`html
<!-- Global Calc Pro: Mortgage & Loan Amortization Widget -->
<iframe 
  src="https://globalcalcpro.com/en/mortgage-calculator?embed=true" 
  width="100%" 
  height="680" 
  frameborder="0" 
  style="border: none; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); max-width: 800px; display: block; margin: 0 auto;" 
  title="Mortgage & Loan Calculator Widget" 
  loading="lazy">
</iframe>
\`\`\`

### 2. React / Next.js Component Embed
\`\`\`tsx
import React from 'react';

interface CalculatorWidgetProps {
  slug?: string;
  lang?: 'en' | 'he' | 'es' | 'fr' | 'ar' | 'ru';
  height?: number;
}

export const CalculatorWidget: React.FC<CalculatorWidgetProps> = ({ 
  slug = 'mortgage-calculator', 
  lang = 'en', 
  height = 680 
}) => {
  return (
    <iframe
      src={\`https://globalcalcpro.com/\${lang}/\${slug}?embed=true\`}
      width="100%"
      height={height}
      className="w-full max-w-4xl mx-auto rounded-2xl border-0 shadow-lg"
      title="Global Calc Pro Widget"
      loading="lazy"
    />
  );
};
\`\`\`

### 3. WordPress, Elementor & Gutenberg
1. Add a **Custom HTML** block in the Gutenberg editor or an **HTML Widget** in Elementor.
2. Paste the iframe embed code snippet above.
3. Replace \`mortgage-calculator\` with any calculator slug (e.g. \`compound-interest\`, \`calculators/vat\`, \`bmi-calculator\`, \`salary-calculator\`).
4. Click **Publish** — your visitors now have a live, reactive calculator on your website!

### 🎛️ Widget Customization Parameters
| Parameter | Values | Description |
| :--- | :--- | :--- |
| \`embed\` | \`true\` | Enables lightweight widget layout (hides header, footer, and assistant). |
| \`lang\` | \`en\`, \`he\`, \`es\`, \`fr\`, \`ar\`, \`ru\` | Sets language, RTL/LTR layout, and regional tax/currency presets. |
| \`theme\` | \`light\`, \`dark\` | Overrides color scheme to match your website theme. |

---

## ⚡ Key Engineering Features

- 🎯 **Arbitrary Precision Arithmetic**: Uses \`decimal.js\` to guarantee zero floating-point roundoff issues (no \`0.1 + 0.2 = 0.30000000000000004\` errors).
- 🧩 **Embeddable Widgets Hub**: Comprehensive interactive generator to customize widget height, language, and theme with live code copy.
- 🌐 **Native Multi-Language & RTL Engine**: Complete linguistic and directional parity for English, Hebrew (RTL), Spanish, French, Arabic (RTL), and Russian.
- 📊 **Dynamic Data Visualizations**: Real-time interactive charts powered by Chart.js and Recharts with responsive canvas rendering.
- 📱 **100% Offline-First PWA**: Service workers cache assets so all calculators function completely without an internet connection.
- 📥 **Export to Excel (.xlsx) & CSV**: Download amortization schedules, VAT breakdowns, or investment projections instantly.
- 🔒 **Privacy First & Zero Telemetry**: All calculations happen 100% locally in the user's browser. No private financial data ever touches a server.
- 🧪 **Rigorously Tested**: 210+ Vitest unit tests, mathematical fuzzing suites, and boundary condition checks.

---

## 📂 Complete Calculator Directory

### 💰 Finance, Taxes & Real Estate
- **[Mortgage Calculator](https://globalcalcpro.com/mortgage-calculator)** - Amortization tables, monthly payment, and interest breakdowns.
- **[VAT & Sales Tax Calculator](https://globalcalcpro.com/calculators/vat)** - Add VAT or extract net price with updated 18% Israel VAT, EU, UK, and US rates.
- **[Severance Pay & Section 14 Calculator](https://globalcalcpro.com/calculators/severance-pay)** - Israeli statutory severance rights, Section 14 completion, and tax exemption limit.
- **[Compound Interest & Wealth Planner](https://globalcalcpro.com/compound-interest)** - Model dollar-cost averaging (DCA), compounding frequency, and long-term wealth.
- **[Salary Calculator (Gross to Net)](https://globalcalcpro.com/salary-calculator)** - Israeli & global payroll deductions, tax brackets, and net take-home salary.
- **[Real Estate Purchase & Appreciation Tax](https://globalcalcpro.com/calculators/purchase-appreciation-tax)** - Israeli Mas Rechisha purchase tax brackets and capital gains tax.
- **[Auto Loan & Financing Calculator](https://globalcalcpro.com/calculators/auto-loan)** - Monthly car payments, total loan interest, and down payment modeling.
- **[Cap Rate & Property NOI Calculator](https://globalcalcpro.com/calculators/cap-rate)** - Capitalization rate, Net Operating Income, and rental real estate valuation.
- **[Break-Even & Margin Calculator](https://globalcalcpro.com/calculators/break-even)** - Unit economics, fixed/variable costs, contribution margin, and safety buffers.
- **[Credit Card Payoff & Interest Calculator](https://globalcalcpro.com/calculators/credit-card-payoff)** - Debt payoff schedules, interest minimization, and extra payment simulations.
- **[Debt Snowball vs Avalanche Calculator](https://globalcalcpro.com/calculators/debt-snowball)** - Compare debt payoff strategies to become debt-free faster.
- **[Stock Options & RSU Calculator](https://globalcalcpro.com/calculators/stock-options-rsu)** - Tech equity compensation, Section 102 tax, 4-year vesting, and dilution.
- **[Inflation & Purchasing Power Calculator](https://globalcalcpro.com/calculators/inflation)** - Future value of money adjusted for historical and estimated inflation.
- **[ROI & Annualized Return Calculator](https://globalcalcpro.com/calculators/roi)** - Return on Investment and Compound Annual Growth Rate (CAGR).
- **[Rent vs Buy Calculator](https://globalcalcpro.com/calculators/rent-vs-buy)** - 10-year comparative cost analysis of homeownership versus renting.

### 📐 Mathematics, Statistics & Science
- **[Matrix Calculator & Linear Algebra](https://globalcalcpro.com/calculators/matrix-calculator)** - 2x2 and 3x3 determinant, inverse, transpose, rank, and matrix multiplication.
- **[Complex Numbers Calculator](https://globalcalcpro.com/calculators/complex-numbers)** - Rectangular, polar, and Euler exponential forms with step-by-step arithmetic.
- **[Quadratic Equation Solver](https://globalcalcpro.com/calculators/quadratic-equation)** - Solves ax² + bx + c = 0 with real/complex roots, discriminant, and parabola plot.
- **[System of Linear Equations (2x2)](https://globalcalcpro.com/calculators/linear-system)** - Simultaneous linear equations solver using Cramer's rule with geometric intersection.
- **[Linear Regression & Pearson Correlation](https://globalcalcpro.com/calculators/linear-regression)** - Best-fit line (y = mx + b), Pearson r, R², and scatter plot chart.
- **[Z-Score & Normal Distribution Calculator](https://globalcalcpro.com/calculators/zscore)** - Standard scores, percentiles, two-tailed p-values, and interactive Gaussian bell curve.
- **[Triangle Solver & Trigonometry Calculator](https://globalcalcpro.com/calculators/triangle-solver)** - SSS and SAS triangle solver with laws of sines/cosines, area, and incircle/circumcircle.
- **[Circle Sector & Arc Length Calculator](https://globalcalcpro.com/calculators/circle-sector)** - Arc length, sector area, chord length, and segment area with dynamic SVG diagram.
- **[Bitwise Calculator & Binary Logic](https://globalcalcpro.com/calculators/bitwise-calculator)** - AND, OR, XOR, NOT, left/right bit shifts with binary bit visualizer.
- **[Base Converter (Binary, Hex, Octal, Decimal)](https://globalcalcpro.com/calculators/base-converter)** - High-precision number base conversions with bit length representation.
- **[Peltier Cooling & TEC Module Calculator](https://globalcalcpro.com/calculators/peltier-cooling)** - Heat pumping capacity, power consumption, and COP for thermoelectric coolers.

### 🩺 Health, Fitness & Medical
- **[BMI (Body Mass Index) Calculator](https://globalcalcpro.com/bmi-calculator)** - WHO-standard body mass index, weight categories, and healthy weight targets.
- **[Pregnancy Due Date & Trimester Calculator](https://globalcalcpro.com/calculators/pregnancy-calculator)** - Naegele's rule due date, weekly developmental milestones, and trimester timeline.
- **[BMR & Daily Caloric Needs](https://globalcalcpro.com/calculators/bmr)** - Basal metabolic rate via Mifflin-St Jeor and Harris-Benedict formulas with TDEE.
- **[Water Intake Hydration Calculator](https://globalcalcpro.com/calculators/water-intake)** - Optimal daily water consumption based on weight, activity level, and climate.
- **[Sleep Cycle & Circadian Calculator](https://globalcalcpro.com/calculators/sleep-calculator)** - Optimal bedtime and wake-up times aligned with 90-minute REM sleep cycles.

### ⚡ Daily Utility & Conversions
- **[Tip & Bill Splitter](https://globalcalcpro.com/tip-calculator)** - Custom gratuity rates and equal or custom bill splits among groups.
- **[Universal Unit Converter](https://globalcalcpro.com/unit-converter)** - Metric and imperial conversions for length, mass, temperature, speed, volume, and area.
- **[Percentage Calculator](https://globalcalcpro.com/percentage-finder)** - Percentage change, fraction to percent, discount calculation, and ratios.
- **[Age & Birthday Milestone Calculator](https://globalcalcpro.com/age-calculator)** - Exact chronological age in years, months, days, hours, and birthday countdown.
- **[Download & Upload Time Calculator](https://globalcalcpro.com/calculators/download-time)** - Transfer duration for files, videos, and backups given network bandwidth.

---

## 🔗 Full SEO Sitemap Catalog (${allCalculators.length} Calculators)

${linkList}

---

## 🧰 Developer Ecosystem & Recommended Open-Source SEO Tools

To help developers, webmasters, and creators monetize websites and optimize search performance, we recommend these industry-standard open-source tools:

| Tool & Repository | Category | Description & Synergy |
| :--- | :--- | :--- |
| **[python-seo-analyzer](https://github.com/sethblack/python-seo-analyzer)** | Technical SEO | Audits website structure, meta tags, and internal link health in CI/CD pipelines. |
| **[serpapi/awesome-seo-tools](https://github.com/serpapi/awesome-seo-tools)** | SEO Hub | Curated collection of open-source SEO, scraping, and search analytics frameworks. |
| **[payload-ai](https://github.com/ashbuilds/payload-ai)** | Content Automation | AI-driven content generation and CMS optimization plugin for programmatic SEO. |
| **[aimeos/aimeos](https://github.com/aimeos/aimeos)** | E-Commerce & Monetization | High-performance commerce and digital checkout engine with built-in SEO. |
| **[chenxingqiang/repo-seo](https://github.com/chenxingqiang/repo-seo)** | GitHub Repo SEO | AI-powered toolkit for optimizing repository visibility and traffic monetization. |

---

## ❓ Frequently Asked Questions (FAQ)

<details>
<summary><b>1. Is Global Calc Pro free to use and embed on external websites?</b></summary>
<p>Yes! Global Calc Pro is 100% open-source under the MIT license. You can embed any calculator widget into your commercial or non-commercial website, blog, or application free of charge using our responsive iframe or React components.</p>
</details>

<details>
<summary><b>2. How does Global Calc Pro achieve zero floating-point arithmetic errors?</b></summary>
<p>Standard JavaScript numbers use IEEE 754 double-precision binary floating-point representation, causing known issues like <code>0.1 + 0.2 = 0.30000000000000004</code>. Global Calc Pro utilizes <code>Decimal.js</code> for arbitrary-precision decimal arithmetic across all financial, mortgage, and tax computations.</p>
</details>

<details>
<summary><b>3. Does Global Calc Pro collect user data or calculation history on servers?</b></summary>
<p>No. Global Calc Pro is architected with a 100% client-side execution model. All inputs, financial simulations, and calculation history records reside strictly in the user's browser local storage and memory. No telemetry or server-side logging is performed.</p>
</details>

<details>
<summary><b>4. Can I use the calculators offline without an internet connection?</b></summary>
<p>Yes. Global Calc Pro is a compliant Progressive Web App (PWA) equipped with service workers and local asset caching. Once loaded, all mathematical engines run fully offline.</p>
</details>

<details>
<summary><b>5. Which languages and regional formats are supported?</b></summary>
<p>Global Calc Pro supports 6 languages with native Right-to-Left (RTL) layout switching and localized currencies: English (USD, EUR, GBP), Hebrew (ILS / ש״ח), Spanish, French, Arabic, and Russian.</p>
</details>

---

## 🛠️ Developer Quick Start

\`\`\`bash
# 1. Clone the repository
git clone https://github.com/Almog787/Global-calculator-pro.git
cd Global-calculator-pro

# 2. Install dependencies
npm install

# 3. Start local development server (port 3000)
npm run dev

# 4. Run automated test suite (tsc, eslint, vitest)
npm test

# 5. Build for production with sitemaps and prerendering
npm run build
\`\`\`

---

## 🏗️ Technical Architecture

\`\`\`
├── .github/                 # CI/CD Workflows, SEO metadata, and Issue Templates
├── scripts/                 # Automated Sitemap, Readme generator, and Indexing scripts
├── src/
│   ├── components/          # Reusable UI, SEO tags, Charts, and Layout components
│   ├── contexts/            # i18n localization, Calculation History, URL state
│   ├── lib/                 # Mathematical engines, Decimal.js logic, Vitest tests
│   │   ├── export/          # Excel (.xlsx) and CSV comprehensive exporters
│   │   ├── math/            # Financial, algebraic, geometric, and fuzzing engines
│   │   └── widgets/         # Widgets catalog and code generation utilities
│   ├── pages/               # Top-level view controllers and Widgets Hub
│   │   └── calculators/     # 40+ precision calculator implementations
│   └── locales/             # Multilingual dictionaries (EN, HE, ES, FR, AR, RU)
└── public/                  # Manifest, icons, sitemaps, and robots.txt
\`\`\`

---

## 🤝 Contributing

Contributions are warmly welcomed! Please read our **[CONTRIBUTING.md](CONTRIBUTING.md)** for details on code style, testing guidelines, and submission workflows.

To suggest a new calculator or widget, open a **[Widget Request Issue](https://github.com/Almog787/Global-calculator-pro/issues/new?template=widget_request.md)**.

---

## ⭐ Star the Project

If you find **Global Calc Pro** or its embeddable widgets useful for your website, project, or studies, please give us a **Star** on GitHub! It helps more developers and webmasters discover free, open-source calculator tools.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

© 2026 **Global Calc Pro** — Precision Mathematical Tools for Everyone.
`;

fs.writeFileSync(README_PATH, readmeTemplate);
console.log('README.md successfully updated with rich widgets, SEO discovery, and full catalog.');
