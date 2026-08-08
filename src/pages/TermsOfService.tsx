import SEO from '../components/SEO';
import { useI18n } from '../contexts/i18n';

export default function TermsOfService() {
  const { t } = useI18n();

  return (
    <article className="w-full bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-stone-200 max-w-3xl mx-auto space-y-6 text-stone-700">
      <SEO
        title={t.termsTitle}
        description={t.termsDesc}
        canonicalUrl="/terms-of-service"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: t.termsTitle,
          description: t.termsDesc,
          applicationCategory: 'CalculatorApplication',
          operatingSystem: 'Any',
          url: `https://globalcalcpro.com${"/terms-of-service"}`
        }}
      />

      <h1 className="text-3xl md:text-4xl font-headline text-stone-900 tracking-tight font-bold">
        {t.termsTitle}
      </h1>

      <p className="text-sm text-stone-600">
        Last updated: July 31, 2026
      </p>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-stone-900">1. Acceptance of Terms</h2>
        <p className="text-stone-600 leading-relaxed text-sm">
          By accessing and using GlobalCalc Pro (globalcalcpro.com), you agree to be bound by these Terms of Service and all applicable laws and regulations.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-stone-900">2. Disclaimer & Calculation Accuracy</h2>
        <p className="text-stone-600 leading-relaxed text-sm">
          All calculators and converters provided on GlobalCalc Pro (including Mortgage, Compound Interest, Percentage, Unit Conversion, Salary, BMI, Tip, and Age calculators) are for informational, educational, and estimation purposes only. Results do not constitute financial, medical, tax, or professional legal advice.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-stone-900">3. Intellectual Property</h2>
        <p className="text-stone-600 leading-relaxed text-sm">
          The software code, layout, design, text, and visual elements of GlobalCalc Pro are protected by applicable intellectual property laws.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-stone-900">4. Modifications to Service</h2>
        <p className="text-stone-600 leading-relaxed text-sm">
          We reserve the right to modify, update, or discontinue any feature or service on globalcalcpro.com at any time without prior notice.
        </p>
      </section>
    </article>
  );
}
