import SEO from '../components/SEO';
import { useI18n } from '../contexts/i18n';

export default function PrivacyPolicy() {
  const { t } = useI18n();

  return (
    <article className="w-full bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-stone-200 max-w-3xl mx-auto space-y-6 text-stone-700">
      <SEO
        title={t.privacyTitle}
        description={t.privacyDesc}
        canonicalUrl="/privacy-policy"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: t.privacyTitle,
          description: t.privacyDesc,
          applicationCategory: 'CalculatorApplication',
          operatingSystem: 'Any',
          url: `https://globalcalcpro.com${"/privacy-policy"}`
        }}
      />

      <h1 className="text-3xl md:text-4xl font-headline text-stone-900 tracking-tight font-bold">
        {t.privacyTitle}
      </h1>

      <p className="text-sm text-stone-600">
        Last updated: July 31, 2026
      </p>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-stone-900">1. Information We Collect</h2>
        <p className="text-stone-600 leading-relaxed text-sm">
          At GlobalCalc Pro, accessible from globalcalcpro.com, one of our main priorities is the privacy of our visitors.
          We do not require user registration or account creation to use any of our free online calculation tools.
          However, standard web server log files and analytics software may collect non-personal information such as IP addresses,
          browser type, Internet Service Provider (ISP), date/time stamp, referring/exit pages, and number of clicks.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-stone-900">2. Cookies and Web Beacons</h2>
        <p className="text-stone-600 leading-relaxed text-sm">
          GlobalCalc Pro uses cookies to store information about visitors' preferences, to record user-specific information on which pages the user accesses or visits, and to customize web page content based on visitors' browser type or other information.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-stone-900">3. Google DoubleClick DART Cookie & AdSense</h2>
        <p className="text-stone-600 leading-relaxed text-sm">
          Google is one of our third-party vendors. It uses cookies, known as DART cookies, to serve ads to site visitors based upon their visit to globalcalcpro.com and other sites on the internet.
          Visitors may choose to decline the use of DART cookies by visiting the Google Ad and Content Network Privacy Policy at:
          <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-1">
            https://policies.google.com/technologies/ads
          </a>
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-stone-900">4. Third Party Privacy Policies</h2>
        <p className="text-stone-600 leading-relaxed text-sm">
          GlobalCalc Pro's Privacy Policy does not apply to other advertisers or websites. Thus, we advise you to consult the respective Privacy Policies of these third-party ad servers for more detailed information.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-stone-900">5. GDPR & CCPA Rights</h2>
        <p className="text-stone-600 leading-relaxed text-sm">
          Under GDPR and CCPA, users have rights regarding data access, rectification, erasure, and restricting processing. Because we do not collect personal data on our server databases, your personal privacy is inherently safeguarded.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-stone-900">6. Contact Us</h2>
        <p className="text-stone-600 leading-relaxed text-sm">
          If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us through our Contact Us page.
        </p>
      </section>
    </article>
  );
}
