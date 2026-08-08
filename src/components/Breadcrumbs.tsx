import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useI18n } from "../contexts/i18n";

type BreadcrumbItem = {
  label: string;
  path?: string;
};

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const baseUrl = 'https://globalcalcpro.com';
  const { lang } = useI18n();

  const homeLabels: Record<string, string> = {
    he: 'ראשי',
    en: 'Home',
    es: 'Inicio',
    fr: 'Accueil',
    ar: 'الرئيسية'
  };

  const homeLabel = homeLabels[lang] || 'Home';

  const schemaItems = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": homeLabel,
      "item": `${baseUrl}/${lang}`
    },
    ...items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 2,
      "name": item.label,
      "item": item.path ? `${baseUrl}${item.path}` : undefined
    }))
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": schemaItems
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>
      <nav
        className="flex text-xs font-semibold text-stone-500 mb-6 space-x-2 rtl:space-x-reverse"
        aria-label="Breadcrumb"
      >
        <Link
          to={`/${lang}`}
          className="hover:text-blue-600 transition-colors inline-flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[14px]">home</span>
          <span>{homeLabel}</span>
        </Link>
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center space-x-2 rtl:space-x-reverse"
          >
            <span className="material-symbols-outlined text-[14px] text-stone-300 rtl:rotate-180">
              chevron_right
            </span>
            {item.path ? (
              <Link
                to={item.path}
                className="hover:text-blue-600 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-stone-900">{item.label}</span>
            )}
          </div>
        ))}
      </nav>
    </>
  );
}
