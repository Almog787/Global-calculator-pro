import React from 'react';
import { useI18n } from '../contexts/i18n';
import Breadcrumbs from './Breadcrumbs';
import SearchBar from './SearchBar';
import { CategoryHubInfo } from '../data/categories';

interface CategoryHubBannerProps {
  hubInfo: CategoryHubInfo;
  categoryId: string;
  totalCalculators: number;
}

export default function CategoryHubBanner({
  hubInfo,
  categoryId,
  totalCalculators,
}: CategoryHubBannerProps) {
  const { lang } = useI18n();

  const categoryName = hubInfo.name[lang] || hubInfo.name.en;
  const heroTitle = hubInfo.heroTitle[lang] || hubInfo.heroTitle.en;
  const heroSubtitle = hubInfo.heroSubtitle[lang] || hubInfo.heroSubtitle.en;
  const overviewText = hubInfo.overview[lang] || hubInfo.overview.en;
  const methodologyText = hubInfo.methodology[lang] || hubInfo.methodology.en;
  const tags = hubInfo.tags[lang] || hubInfo.tags.en;

  const categoryStyles: Record<string, {
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
  }> = {
    finance: {
      badgeBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      badgeText: 'text-emerald-700 dark:text-emerald-300',
      badgeBorder: 'border-emerald-500/30',
    },
    'real-estate': {
      badgeBg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
      badgeText: 'text-indigo-700 dark:text-indigo-300',
      badgeBorder: 'border-indigo-500/30',
    },
    health: {
      badgeBg: 'bg-rose-500/10 dark:bg-rose-500/20',
      badgeText: 'text-rose-700 dark:text-rose-300',
      badgeBorder: 'border-rose-500/30',
    },
    math: {
      badgeBg: 'bg-amber-500/10 dark:bg-amber-500/20',
      badgeText: 'text-amber-700 dark:text-amber-300',
      badgeBorder: 'border-amber-500/30',
    },
    tech: {
      badgeBg: 'bg-sky-500/10 dark:bg-sky-500/20',
      badgeText: 'text-sky-700 dark:text-sky-300',
      badgeBorder: 'border-sky-500/30',
    },
    lifestyle: {
      badgeBg: 'bg-purple-500/10 dark:bg-purple-500/20',
      badgeText: 'text-purple-700 dark:text-purple-300',
      badgeBorder: 'border-purple-500/30',
    },
  };

  const currentStyle = categoryStyles[categoryId] || categoryStyles.finance;

  return (
    <header className="mb-10 p-6 sm:p-10 rounded-3xl bg-surface-container-lowest border border-border-subtle shadow-md">
      {/* Visual & Structured Breadcrumbs Navigation */}
      <Breadcrumbs items={[{ label: categoryName }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-border-subtle">
        <div className="flex items-center gap-3.5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${currentStyle.badgeBg}`}>
            <span className={`material-symbols-outlined text-2xl ${currentStyle.badgeText}`}>
              {hubInfo.icon}
            </span>
          </div>
          <div>
            <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${currentStyle.badgeBorder} ${currentStyle.badgeBg} ${currentStyle.badgeText}`}>
              {categoryName}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mt-1">
              {heroTitle}
            </h1>
          </div>
        </div>

        <div className="text-xs text-on-surface-variant bg-surface-container-low px-3 py-1.5 rounded-xl border border-border-subtle shrink-0">
          <span className="font-bold text-on-surface font-mono-num">{totalCalculators}</span> {lang === 'he' ? 'מחשבונים זמינים' : 'calculators available'}
        </div>
      </div>

      <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed max-w-3xl mb-6">
        {heroSubtitle}
      </p>

      {/* In-Category Quick Search */}
      <div className="max-w-xl mb-6">
        <SearchBar isHero placeholder={lang === 'he' ? `חיפוש במחשבוני ${categoryName}...` : `Search in ${categoryName}...`} />
      </div>

      {/* Topic Cluster Tags */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs font-bold text-on-surface-variant me-1">
          {lang === 'he' ? 'נושאים מרכזיים:' : 'Key Topics:'}
        </span>
        {tags.map((tag, i) => (
          <span
            key={i}
            className="text-xs font-medium px-2.5 py-1 rounded-lg bg-surface border border-border-subtle text-on-surface-variant shadow-xs"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* SEO Topic Pillar Overview & Clinical/Actuarial Methodology */}
      <div className="bg-surface-container-low/70 rounded-2xl p-4 sm:p-6 border border-border-subtle/80 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-on-surface flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[15px] text-primary">menu_book</span>
          <span>{lang === 'he' ? 'אודות מתודולוגיית החישוב והכלים במדור זה' : 'About the Methodology & Calculation Engine'}</span>
        </h2>
        <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
          {overviewText}
        </p>
        <p className="text-xs text-on-surface-variant/90 border-t border-border-subtle/60 pt-2 font-medium">
          💡 <span className="font-semibold">{lang === 'he' ? 'תקן חישוב:' : 'Standard:'}</span> {methodologyText}
        </p>
      </div>
    </header>
  );
}
