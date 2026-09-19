import React, { useState } from 'react';
import { useI18n } from '../contexts/i18n';

export interface ComparisonMetric {
  label: string;
  valA: string;
  valB: string;
  rawDiff?: number;
  diffText?: string;
  invertGood?: boolean; // true = lower is better (e.g. interest, debt payment); false = higher is better (e.g. savings, returns)
  subtext?: string;
}

export interface ScenarioComparatorProps {
  title?: string;
  scenarioAName?: string;
  scenarioBName?: string;
  metrics: ComparisonMetric[];
  highlight?: {
    headline: string;
    subtext?: string;
    type?: 'positive' | 'neutral' | 'warning';
  };
  presets?: Array<{
    label: string;
    description?: string;
    onClick: () => void;
  }>;
  reportSummaryText: string;
  children?: React.ReactNode;
}

export default function ScenarioComparator({
  title,
  scenarioAName,
  scenarioBName,
  metrics,
  highlight,
  presets,
  reportSummaryText,
  children,
}: ScenarioComparatorProps) {
  const { lang } = useI18n();
  const [copied, setCopied] = useState(false);

  const handleCopyReport = async () => {
    try {
      await navigator.clipboard.writeText(reportSummaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = reportSummaryText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const defaultTitle = {
    he: 'השוואת תרחישים צד-אל-צד',
    en: 'Side-by-Side Scenario Comparison',
    es: 'Comparación de Escenarios Cara a Cara',
    fr: 'Comparaison de Scénarios Côte à Côte',
    ar: 'مقارنة السيناريوهات جنباً إلى جنب'
  }[lang] || 'Scenario Comparison';

  const defaultNameA = {
    he: 'מסלול א׳ (נוכחי)',
    en: 'Scenario A (Baseline)',
    es: 'Escenario A (Base)',
    fr: 'Scénario A (Base)',
    ar: 'السيناريو أ (الأساس)'
  }[lang] || 'Scenario A';

  const defaultNameB = {
    he: 'מסלול ב׳ (חלופי)',
    en: 'Scenario B (Alternative)',
    es: 'Escenario B (Alternativa)',
    fr: 'Scénario B (Optionnel)',
    ar: 'السيناريو ب (البديل)'
  }[lang] || 'Scenario B';

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm mt-8 space-y-6">
      {/* Header & Copy Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            {lang === 'he' ? 'ניתוח השוואתי חכם' : 'Smart Comparison Analysis'}
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            {title || defaultTitle}
          </h3>
        </div>

        <button
          type="button"
          onClick={handleCopyReport}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 border border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-800 active:scale-95 shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px]">
            {copied ? 'check_circle' : 'content_copy'}
          </span>
          <span>
            {copied
              ? (lang === 'he' ? 'דוח ההשוואה הועתק!' : 'Report Copied!')
              : (lang === 'he' ? 'העתק סיכום השוואה' : 'Copy Comparison Report')}
          </span>
        </button>
      </div>

      {/* Optional Preset Quick-Buttons */}
      {presets && presets.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
            {lang === 'he' ? 'השוואות מהירות מוכנות מראש:' : 'Quick Comparison Presets:'}
          </span>
          <div className="flex flex-wrap gap-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={p.onClick}
                className="text-xs font-semibold px-3 py-2 rounded-xl bg-stone-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-stone-200 transition-all active:scale-95 text-stone-700"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Highlight Takeaway Banner */}
      {highlight && (
        <div
          className={`p-4 sm:p-5 rounded-2xl border transition-all ${
            highlight.type === 'positive'
              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
              : highlight.type === 'warning'
              ? 'bg-amber-50/80 border-amber-300 text-amber-950'
              : 'bg-blue-50/80 border-blue-300 text-blue-950'
          }`}
        >
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-2xl shrink-0 mt-0.5 text-current">
              {highlight.type === 'positive' ? 'verified' : highlight.type === 'warning' ? 'info' : 'analytics'}
            </span>
            <div className="space-y-1">
              <h4 className="font-extrabold text-sm sm:text-base leading-snug">
                {highlight.headline}
              </h4>
              {highlight.subtext && (
                <p className="text-xs sm:text-sm font-medium opacity-90">
                  {highlight.subtext}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Table / Cards */}
      <div className="overflow-x-auto rounded-2xl border border-stone-200">
        <table className="w-full text-start border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-stone-100 border-b border-stone-200">
              <th className="p-3 sm:p-4 text-start font-bold text-stone-600">
                {lang === 'he' ? 'מדד להשוואה' : 'Metric'}
              </th>
              <th className="p-3 sm:p-4 text-center font-bold text-blue-800 bg-blue-50/60 border-x border-stone-200">
                <span className="inline-block px-2 py-0.5 rounded-md bg-blue-100 font-extrabold">
                  {scenarioAName || defaultNameA}
                </span>
              </th>
              <th className="p-3 sm:p-4 text-center font-bold text-emerald-800 bg-emerald-50/60">
                <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-100 font-extrabold">
                  {scenarioBName || defaultNameB}
                </span>
              </th>
              <th className="p-3 sm:p-4 text-center font-bold text-stone-700 hidden md:table-cell border-s border-stone-200">
                {lang === 'he' ? 'הפרש (ב׳ מול א׳)' : 'Difference (B vs A)'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 font-medium">
            {metrics.map((m, idx) => {
              const diffVal = m.rawDiff ?? 0;
              const isPositive = diffVal > 0;
              const isNegative = diffVal < 0;
              
              // Determine if difference is "beneficial"
              const isGood = m.invertGood ? isNegative : isPositive;
              const isBad = m.invertGood ? isPositive : isNegative;

              return (
                <tr key={idx} className="hover:bg-stone-50/60 transition-colors">
                  <td className="p-3 sm:p-4 text-stone-900 font-bold">
                    <div>{m.label}</div>
                    {m.subtext && <div className="text-[11px] text-stone-500 font-normal">{m.subtext}</div>}
                  </td>
                  <td className="p-3 sm:p-4 text-center font-bold text-stone-900 bg-blue-50/30 border-x border-stone-200" dir="ltr">
                    {m.valA}
                  </td>
                  <td className="p-3 sm:p-4 text-center font-bold text-stone-900 bg-emerald-50/30" dir="ltr">
                    {m.valB}
                  </td>
                  <td className="p-3 sm:p-4 text-center hidden md:table-cell border-s border-stone-200" dir="ltr">
                    {m.diffText ? (
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold ${
                          isGood
                            ? 'bg-emerald-100 text-emerald-800'
                            : isBad
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {m.diffText}
                      </span>
                    ) : (
                      <span className="text-stone-400">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Optional Children (e.g. comparative chart or sliders) */}
      {children && <div className="pt-2">{children}</div>}
    </div>
  );
}
