import React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../contexts/i18n";

export type BreadcrumbItem = {
  label: string;
  path?: string;
};

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const { lang } = useI18n();

  const homeLabels: Record<string, string> = {
    he: 'ראשי',
    en: 'Home',
    es: 'Inicio',
    fr: 'Accueil',
    ar: 'الرئيسية',
    ru: 'Главная'
  };

  const homeLabel = homeLabels[lang] || 'Home';

  return (
    <nav
      className="flex items-center text-xs font-semibold text-stone-500 mb-6 flex-wrap gap-1.5"
      aria-label="Breadcrumb"
    >
        <Link
          to={`/${lang}`}
          className="hover:text-primary transition-colors inline-flex items-center gap-1 text-stone-600 hover:underline"
        >
          <span className="material-symbols-outlined text-[15px]">home</span>
          <span>{homeLabel}</span>
        </Link>
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-1.5 text-stone-400"
          >
            <span className="material-symbols-outlined text-[13px] text-stone-400 rtl:rotate-180 select-none">
              chevron_right
            </span>
            {item.path ? (
              <Link
                to={item.path}
                className="hover:text-primary transition-colors text-stone-600 hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-stone-900 font-bold">{item.label}</span>
            )}
          </div>
        ))}
      </nav>
  );
}
