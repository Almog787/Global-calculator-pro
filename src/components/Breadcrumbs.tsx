import { Link } from "react-router-dom";
import { useI18n } from "../contexts/i18n";

export type BreadcrumbItem = {
  label: string;
  path?: string;
};

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const { lang } = useI18n();
  const baseUrl = "https://globalcalcpro.com";

  const homeLabels: Record<string, string> = {
    he: 'ראשי',
    en: 'Home',
    es: 'Inicio',
    fr: 'Accueil',
    ar: 'الرئيسية'
  };

  const homeLabel = homeLabels[lang] || 'Home';
  const homePath = `/${lang}`;

  return (
    <nav
      className="flex items-center text-xs font-semibold text-stone-500 dark:text-stone-400 mb-6 py-1 overflow-x-auto no-scrollbar"
      aria-label="Breadcrumb"
      itemScope
      itemType="https://schema.org/BreadcrumbList"
    >
      <ol className="flex items-center space-x-2 rtl:space-x-reverse list-none p-0 m-0">
        {/* Home Item */}
        <li
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
          className="flex items-center"
        >
          <Link
            to={homePath}
            itemProp="item"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-1.5 focus:outline-hidden"
          >
            <span className="material-symbols-outlined text-[15px] leading-none">home</span>
            <span itemProp="name">{homeLabel}</span>
          </Link>
          <meta itemProp="position" content="1" />
        </li>

        {/* Trail Items */}
        {items.map((item, index) => {
          const position = index + 2;
          const isLast = index === items.length - 1;
          const itemUrl = item.path ? `${baseUrl}${item.path}` : undefined;

          return (
            <li
              key={index}
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
              className="flex items-center space-x-2 rtl:space-x-reverse"
            >
              <span
                className="material-symbols-outlined text-[14px] text-stone-300 dark:text-stone-600 rtl:rotate-180 select-none"
                aria-hidden="true"
              >
                chevron_right
              </span>
              {item.path && !isLast ? (
                <Link
                  to={item.path}
                  itemProp="item"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors max-w-[200px] truncate focus:outline-hidden"
                >
                  <span itemProp="name">{item.label}</span>
                </Link>
              ) : (
                <span
                  itemProp="name"
                  className="text-stone-900 dark:text-stone-100 font-bold max-w-[260px] truncate"
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {itemUrl && <link itemProp="item" href={itemUrl} />}
              <meta itemProp="position" content={String(position)} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
