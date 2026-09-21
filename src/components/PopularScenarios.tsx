import React, { useState } from 'react';
import { useI18n } from '../contexts/i18n';
import { ProgrammaticScenario } from '../lib/seo/programmaticScenarios';
import { TrendingUp, ArrowRight, ChevronDown, ChevronUp, Sparkles, CheckCircle2 } from 'lucide-react';
import SpotlightCard from './SpotlightCard';

interface PopularScenariosProps {
  title?: string;
  subtitle?: string;
  scenarios: ProgrammaticScenario[];
  onSelectScenario: (params: Record<string, any>) => void;
  currentPrincipal?: number;
}

export default function PopularScenarios({
  title,
  subtitle,
  scenarios,
  onSelectScenario,
  currentPrincipal,
}: PopularScenariosProps) {
  const { lang } = useI18n();
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const defaultTitle = {
    he: 'תרחישים פופולריים וחיפושים נפוצים',
    en: 'Popular Scenarios & Quick Pre-Calculations',
    es: 'Escenarios Populares y Cálculos Frecuentes',
    fr: 'Scénarios Populaires et Simulations Fréquentes',
    ar: 'سيناريوهات شائعة وحسابات فورية',
  }[lang] || 'Popular Scenarios & Quick Pre-Calculations';

  const defaultSubtitle = {
    he: 'בחר תרחיש מוכן מראש בלחיצה אחת וקבל תוצאות מדויקות, לוח תשלומים וניתוח ריבית',
    en: 'Select a pre-calculated benchmark scenario with 1-click to view exact amortization and interest breakdown',
    es: 'Selecciona un escenario de referencia con un clic para ver el desglose completo',
    fr: 'Sélectionnez un scénario type en un clic pour obtenir l\'amortissement complet',
    ar: 'اختر سيناريو قياسي جاهز بنقرة واحدة لعرض النتائج وجدول السداد فوراً',
  }[lang] || 'Select a pre-calculated benchmark scenario with 1-click';

  const applyText = {
    he: 'הפעל תרחיש זה',
    en: 'Apply Scenario',
    es: 'Aplicar Escenario',
    fr: 'Appliquer ce scénario',
    ar: 'تطبيق هذا السيناريو',
  }[lang] || 'Apply Scenario';

  const isRtl = lang === 'he' || lang === 'ar';

  return (
    <div className="my-10 p-6 sm:p-8 rounded-3xl bg-surface border border-border-subtle shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{lang === 'he' ? 'זנב ארוך ותרחישי שוק' : 'Long-tail Benchmarks'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight">
            {title || defaultTitle}
          </h3>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1 max-w-2xl font-medium">
            {subtitle || defaultSubtitle}
          </p>
        </div>
      </div>

      {/* Grid of Scenarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {scenarios.map((scenario) => {
          const scenarioTitle = scenario.title[lang as keyof typeof scenario.title] || scenario.title.en;
          const scenarioDesc = scenario.description[lang as keyof typeof scenario.description] || scenario.description.en;
          const keyMetric = scenario.computedResult.keyMetric[lang as keyof typeof scenario.computedResult.keyMetric] || scenario.computedResult.keyMetric.en;
          const secondaryMetric = scenario.computedResult.secondaryMetric[lang as keyof typeof scenario.computedResult.secondaryMetric] || scenario.computedResult.secondaryMetric.en;
          const isActive = currentPrincipal !== undefined && currentPrincipal === scenario.params.principal;

          return (
            <SpotlightCard
              key={scenario.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isActive
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs'
                  : 'border-border-subtle bg-surface-container-low hover:border-primary/40 hover:bg-surface hover:shadow-xs'
              }`}
              spotlightColor="rgba(0, 107, 91, 0.12)"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-primary text-on-primary">
                    {scenario.badge}
                  </span>
                  {isActive && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{lang === 'he' ? 'פעיל כעת' : 'Currently Active'}</span>
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-base text-on-surface mb-1.5 leading-snug">
                  {scenarioTitle}
                </h4>

                <p className="text-xs text-on-surface-variant font-medium leading-relaxed mb-4">
                  {scenarioDesc}
                </p>

                {/* Precomputed metrics card */}
                <div className="p-3 rounded-xl bg-surface border border-border-subtle space-y-1 mb-4">
                  <div className="text-sm font-black text-on-surface" dir="ltr">
                    {keyMetric}
                  </div>
                  <div className="text-xs font-semibold text-on-surface-variant" dir="ltr">
                    {secondaryMetric}
                  </div>
                </div>
              </div>

              {/* Action Button & Q&A Toggle */}
              <div className="pt-2 border-t border-border-subtle/60 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onSelectScenario(scenario.params);
                    window.scrollTo({ top: 180, behavior: 'smooth' });
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{applyText}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                </button>

                {scenario.faq && scenario.faq.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(expandedFaq === scenario.id ? null : scenario.id)}
                    className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
                    title={lang === 'he' ? 'הצג תשובה מהירה' : 'Quick Q&A'}
                    aria-label="Toggle FAQ preview"
                  >
                    {expandedFaq === scenario.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>

              {/* Expandable FAQ details for instant answer */}
              {expandedFaq === scenario.id && scenario.faq && scenario.faq[0] && (() => {
                const firstFaq = scenario.faq[0];
                const qMap = firstFaq.question as Record<string, string>;
                const aMap = firstFaq.answer as Record<string, string>;
                const qText = qMap[lang] || qMap['en'] || '';
                const aText = aMap[lang] || aMap['en'] || '';

                return (
                  <div className="mt-3 pt-3 border-t border-border-subtle/80 text-xs bg-surface-container-lowest p-3 rounded-xl">
                    <p className="font-bold text-on-surface mb-1">
                      {qText}
                    </p>
                    <p className="text-on-surface-variant leading-relaxed">
                      {aText}
                    </p>
                  </div>
                );
              })()}
            </SpotlightCard>
          );
        })}
      </div>
    </div>
  );
}
