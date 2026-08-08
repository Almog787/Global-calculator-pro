# Global Calc Pro 🧮

[![Official Website](https://img.shields.io/badge/Website-globalcalcpro.com-0066FF?style=for-the-badge&logo=googlechrome&logoColor=white)](https://globalcalcpro.com)

## 🌐 Official Website
👉 **[https://globalcalcpro.com](https://globalcalcpro.com)**

## 🚀 Overview
**Global Calc Pro** is a next-generation, high-performance web suite of precision online calculators and converters. Built with a modern, client-first architecture, Global Calc Pro delivers instantaneous computations, interactive visual charting, and an intuitive, distraction-free user experience tailored for users worldwide.

## 🔗 Complete List of Calculators (SEO Sitemap)
*Search engine spiders, crawlers, and users: Explore our full suite of precision tools below. Each link leads to a highly optimized, client-side calculator offering instant and precise mathematical results.*

- **[Age Calculator](https://globalcalcpro.com/age-calculator)** - Calculate exact age in years, months, days.
- **[Auto Loan Calculator](https://globalcalcpro.com/calculators/auto-loan)** - Calculate your monthly car loan payment, total interest, and total cost precisely.
- **[BMI Calculator](https://globalcalcpro.com/bmi-calculator)** - Determine Body Mass Index with health status.
- **[Cap Rate Calculator](https://globalcalcpro.com/calculators/cap-rate)** - Calculate the Capitalization Rate and Net Operating Income (NOI) for real estate investments.
- **[Compound Interest Calculator](https://globalcalcpro.com/compound-interest)** - Forecast investment growth over time.
- **[Debt Snowball Calculator](https://globalcalcpro.com/calculators/debt-snowball)** - Calculate how fast you can become debt-free by paying extra toward your smallest debts first.
- **[Download Time Calculator](https://globalcalcpro.com/calculators/download-time)** - Calculate exactly how long it will take to download or upload a file based on your internet speed.
- **[Freelance Net Income Calculator](https://globalcalcpro.com/calculators/freelance-net-income)** - Calculate your actual take-home pay after business expenses and estimated taxes.
- **[Fuel Split Calculator](https://globalcalcpro.com/calculators/fuel-split)** - Calculate and split travel costs fairly among passengers.
- **[Goal Savings Calculator](https://globalcalcpro.com/calculators/goal-savings)** - Calculate how much you need to save monthly to reach your financial goal.
- **[Margin Calculator](https://globalcalcpro.com/calculators/margin)** - Quickly calculate your gross profit and profit margin from cost and revenue.
- **[Mortgage Calculator](https://globalcalcpro.com/mortgage-calculator)** - Calculate home loan monthly payments and interest.
- **[Peltier Cooling Calculator](https://globalcalcpro.com/calculators/peltier-cooling)** - Calculate the expected cooling capacity and efficiency (COP) of a Thermoelectric Cooler.
- **[Percentage Calculator](https://globalcalcpro.com/percentage-finder)** - Solve complex percentage calculations instantly.
- **[Rent vs Buy Calculator](https://globalcalcpro.com/calculators/rent-vs-buy)** - Compare the financial costs of renting versus buying a home over 10 years.
- **[ROI Calculator](https://globalcalcpro.com/calculators/roi)** - Calculate Return on Investment (ROI) and annualized ROI for your investments.
- **[Salary Calculator](https://globalcalcpro.com/salary-calculator)** - Convert hourly wage to annual salary.
- **[Tip & Bill Splitter](https://globalcalcpro.com/tip-calculator)** - Calculate tip and split the bill among friends.
- **[Unit Converter](https://globalcalcpro.com/unit-converter)** - Convert between different units of measurement.

## 🌍 Global Usability & SEO Infrastructure
* **Multi-Language Engine**: Support for English, Hebrew, Spanish, French, and Arabic.
* **Dynamic Routing**: Instant scaling of new calculators under `/calculators/:slug`.
* **Automated Search Engine Indexing**: Integrated with Google Search Console to index links instantly.

## 🛠️ Technology Stack
* React 19 + TypeScript
* Vite 6 + Tailwind CSS v4
* Chart.js + Recharts for Data Visualization
* Decimal.js for precise financial math

© **Global Calc Pro** — Precision Mathematical Tools for Everyone.

## 🧪 Automated Testing & QA Architecture

### ❓ Why are there over 1,100 internal links checked in QA?
**Global Calc Pro** is a multi-language, statically pre-rendered application supporting **5 languages** (English, Hebrew, Spanish, French, and Arabic) across **20+ calculators and pages**. 

During the static pre-rendering build phase (`npm run prerender`), over **100 HTML files** are generated in `./dist`. Each page contains:
1. **Header & Footer Navigation**: Global links to all calculators, about pages, and category indexes.
2. **Language Selector Dropdown**: Direct links switching to the same page in all 5 languages (`/en/...`, `/he/...`, `/es/...`, `/fr/...`, `/ar/...`).
3. **SEO Meta Tags (`<link rel="alternate">` & Canonical)**: `hreflang` tags pointing search engines to localized versions of every page.
4. **Related Calculators Grid**: Contextual internal links between relevant calculators.

Multiplying 100+ HTML files by ~10-15 internal links per page yields **over 1,100 links**. 

---

### 🛡️ What QA Tests Are Executed in GitHub Actions?
1. **🏗️ Application Build & Prerender (`npm run build`)**: 
   - Compiles TypeScript and packages Vite frontend assets.
   - Runs Playwright in a headless environment to pre-render full static HTML files into `./dist` for ultra-fast SEO loading.
2. **🧹 Code Quality & Type Safety (`npm run test`)**:
   - Runs `tsc --noEmit` to verify 100% strict TypeScript compliance.
   - Runs `eslint` to enforce code quality, clean imports, and hook dependencies.
3. **🔗 Deep Link Checking (`Lychee`)**:
   - Scans every generated HTML file in `./dist/**/*.html`.
   - Remaps production URLs (`https://globalcalcpro.com/*` ➔ `./dist/*`) to test all 1,100+ internal links directly against the generated static files locally without any external network dependency.
4. **🚀 Automatic Search Engine Indexing (`Google Indexing API`)**:
   - On deployment, notifies Google Search Console via JWT Service Account to instantly index new or updated calculator pages.

<!-- QA_SUMMARY_START -->
## 📊 Automated QA & Test Report
*This section is automatically updated by GitHub Actions during automated QA runs.*

### 🏗️ Build & Code Quality Status
- **Application Build**: ✅ Success
- **TypeScript & ESLint**: ✅ Passed without errors

### 🔗 Link Checker Summary (Lychee)
#### 📋 Excluded Patterns & Rules / חוקים והחרגות:
- `fonts.googleapis.com` / `fonts.gstatic.com`: External Google Fonts (פונטים חיצוניים)
- `https://globalcalcpro.com/*`: **Remapped to `./dist/*`** - כל 1,100 הקישורים הפנימיים נבדקים מקומית מול הקבצים הממשיים בתיקיית הבנייה!

#### 📝 Latest Lychee Report:
_Run QA workflow to generate latest report._
<!-- QA_SUMMARY_END -->

