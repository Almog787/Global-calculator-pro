# Contributing to Global Calc Pro 🧮

Thank you for your interest in contributing to **Global Calc Pro**! We are building the most accurate, zero-latency, and embeddable multi-domain calculator engine for the web.

Whether you are fixing a calculation edge case, adding a new calculator or widget, translating to another language, or improving documentation, we welcome your contributions!

---

## 🚀 Getting Started

1. **Fork the Repository** on GitHub.
2. **Clone your fork locally**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Global-calculator-pro.git
   cd Global-calculator-pro
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧮 Adding a New Calculator or Widget

We follow clean architectural patterns for every calculator:

1. **High Precision Arithmetic**: Always use `decimal.js` for financial and mathematical calculations to avoid JavaScript floating point errors (`0.1 + 0.2 !== 0.3`).
2. **URL State Synchronization**: Use the `useUrlState` hook so users can share permalinks with their exact inputs pre-filled.
3. **Localization (i18n & RTL)**: Support all 5 active languages (`en`, `he`, `es`, `fr`, `ar`). Ensure the layout works seamlessly in RTL (Right-to-Left) for Hebrew and Arabic.
4. **Embeddable Widgets**: Ensure every calculator renders responsively when `?embed=true` is appended to the URL.
5. **Unit Tests**: Add tests under `src/lib/` or alongside your calculation logic to maintain 100% test passing status.

---

## 🧪 Testing & Code Quality

Before opening a pull request, run the automated test and lint suite:

```bash
# Type check, lint, and run all Vitest unit tests
npm test
```

All 210+ test cases must pass with zero TypeScript compilation errors.

---

## 📝 Pull Request Guidelines

1. Create a descriptive feature branch (`git checkout -b feature/crypto-compound-widget`).
2. Commit your changes with clear, concise messages (`feat: add crypto compound interest widget`).
3. Push to your branch and open a Pull Request against the `main` branch.
4. Describe what the calculator/widget does, link any relevant issues, and include screenshots if UI changes were made.

---

## 💬 Community & Feature Requests

Have an idea for a new calculator or embeddable widget?
Open a **[Widget Request](https://github.com/Almog787/Global-calculator-pro/issues/new?template=widget_request.md)** on GitHub!
