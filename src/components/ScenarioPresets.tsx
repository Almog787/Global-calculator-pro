import React from 'react';
import { useI18n } from '../contexts/i18n';
import { Sparkles } from 'lucide-react';

export interface ScenarioPresetItem {
  id?: string;
  label: Record<string, string> | string;
  description?: Record<string, string> | string;
  values: Record<string, any>;
  badge?: string;
}

interface ScenarioPresetsProps {
  title?: string;
  presets: ScenarioPresetItem[];
  onSelect: (values: Record<string, any>) => void;
  className?: string;
}

export default function ScenarioPresets({
  title,
  presets,
  onSelect,
  className = ''
}: ScenarioPresetsProps) {
  const { lang } = useI18n();

  if (!presets || presets.length === 0) return null;

  const defaultTitle = {
    en: 'Popular Long-Tail Scenarios & Quick Presets',
    he: 'תרחישים נפוצים וחישובים מהירים בלחיצה',
    es: 'Escenarios Comunes y Ajustes Rápidos',
    fr: 'Scénarios Fréquents et Préréglages Rapides',
    ar: 'السيناريوهات الشائعة والإعدادات المسبقة السريعة',
  }[lang] || 'Popular Scenarios & Quick Presets';

  return (
    <div className={`w-full bg-surface-container-low/60 border border-border-subtle rounded-2xl p-4 sm:p-5 my-6 ${className}`}>
      <div className="flex items-center gap-2 mb-3.5">
        <span className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-100 text-blue-600">
          <Sparkles className="w-3.5 h-3.5" />
        </span>
        <h3 className="font-bold text-xs sm:text-sm text-on-surface tracking-tight">
          {title || defaultTitle}
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {presets.map((item, idx) => {
          const labelText = typeof item.label === 'object' ? item.label[lang] || item.label.en || '' : item.label;
          const descText = typeof item.description === 'object' ? item.description?.[lang] || item.description?.en || '' : item.description;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelect(item.values)}
              className="group text-start p-3 bg-surface-container-lowest hover:bg-blue-50/70 border border-border-subtle hover:border-blue-300 rounded-xl transition-all shadow-2xs hover:shadow-xs cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-bold text-xs sm:text-sm text-on-surface group-hover:text-blue-700 transition-colors line-clamp-1">
                    {labelText}
                  </span>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 uppercase tracking-wide shrink-0">
                      {item.badge}
                    </span>
                  )}
                </div>
                {descText && (
                  <p className="text-[11px] text-on-surface-variant leading-tight line-clamp-2">
                    {descText}
                  </p>
                )}
              </div>
              <div className="mt-2 text-[10px] font-semibold text-blue-600 group-hover:text-blue-800 flex items-center gap-1">
                <span>{lang === 'he' ? 'החל תרחיש' : lang === 'es' ? 'Aplicar' : lang === 'fr' ? 'Appliquer' : lang === 'ar' ? 'تطبيق' : 'Apply Preset'}</span>
                <span className="material-symbols-outlined text-[13px] group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform">
                  arrow_forward
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
