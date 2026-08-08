import SEO from '../components/SEO';
import { useI18n } from '../contexts/i18n';

export default function AboutUs() {
  const { t } = useI18n();

  return (
    <article className="w-full bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-stone-200 max-w-3xl mx-auto space-y-6 text-stone-700">
      <SEO
        title={t.aboutTitle}
        description={t.aboutDesc}
        canonicalUrl="/about"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: t.aboutTitle,
          description: t.aboutDesc,
          applicationCategory: 'CalculatorApplication',
          operatingSystem: 'Any',
          url: `https://globalcalcpro.com${"/about"}`
        }}
      />

      <h1 className="text-3xl md:text-4xl font-headline text-stone-900 tracking-tight font-bold">
        {t.aboutTitle}
      </h1>

      <p className="text-stone-600 leading-relaxed text-base">
        Welcome to <strong>GlobalCalc Pro</strong> — your all-in-one platform for fast, accurate, and completely free online calculation and unit conversion tools.
      </p>

      <div className="space-y-4 pt-4 border-t border-stone-200">
        <h2 className="text-xl font-bold text-stone-900">Our Mission</h2>
        <p className="text-stone-600 leading-relaxed text-sm">
          Our goal is to make complex everyday financial, mathematical, and measurement calculations effortless and accessible to anyone, anywhere in the world. Whether you are estimating monthly mortgage payments, projecting investment growth with compound interest, converting metric or imperial units, or calculating hourly to annual salary conversions, GlobalCalc Pro delivers instant results in a clean, ad-friendly interface.
        </p>
      </div>

      <div className="space-y-4 pt-4 border-t border-stone-200">
        <h2 className="text-xl font-bold text-stone-900">Multilingual & Accessibility First</h2>
        <p className="text-stone-600 leading-relaxed text-sm">
          We support multiple languages including American English, Hebrew, Spanish, French, and Arabic with native RTL/LTR formatting, enabling seamless usage across desktop and mobile devices worldwide.
        </p>
      </div>
    </article>
  );
}
