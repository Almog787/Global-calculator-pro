import calculatorCapabilities from '../data/calculatorCapabilities.json';
import { Language, useI18n } from '../contexts/i18n';

interface CapabilityEntry {
  bestFor: Record<string, string>;
  features: Record<string, string[]>;
}

const capabilitiesMap = calculatorCapabilities as Record<string, CapabilityEntry>;

interface CalculatorCapabilitiesProps {
  calcId?: string;
  variant?: 'standalone' | 'embedded';
}

const SECTION_LABELS: Record<Language, { heading: string; bestForLabel: string; featuresLabel: string }> = {
  en: {
    heading: 'What This Calculator Can Do & Ideal Use Cases',
    bestForLabel: 'Best for',
    featuresLabel: 'Included Capabilities',
  },
  he: {
    heading: 'מה המחשבון הזה יודע לעשות ולמי הוא מתאים',
    bestForLabel: 'מתאים במיוחד עבור',
    featuresLabel: 'יכולות מרכזיות במחשבון',
  },
  es: {
    heading: 'Qué Puede Hacer Esta Calculadora y Cuándo Usarla',
    bestForLabel: 'Ideal para',
    featuresLabel: 'Capacidades Incluidas',
  },
  fr: {
    heading: 'Capacités de Cette Calculatrice et Cas d’Usage Idéaux',
    bestForLabel: 'Idéal pour',
    featuresLabel: 'Fonctionnalités Incluses',
  },
  ar: {
    heading: 'ماذا تقدم هذه الحاسبة ومتى يُنصح باستخدامها',
    bestForLabel: 'الأنسب لـ',
    featuresLabel: 'القدرات والمزايا المدمجة',
  },
  ru: {
    heading: 'Возможности калькулятора и сценарии применения',
    bestForLabel: 'Лучше всего подходит',
    featuresLabel: 'Ключевые возможности',
  },
};

export default function CalculatorCapabilities({ calcId, variant = 'standalone' }: CalculatorCapabilitiesProps) {
  const { lang } = useI18n();
  if (!calcId) return null;

  const entry = capabilitiesMap[calcId];
  if (!entry) return null;

  const bestFor = entry.bestFor?.[lang] || entry.bestFor?.en || '';
  const features = entry.features?.[lang] || entry.features?.en || [];
  if (!bestFor && features.length === 0) return null;

  const labels = SECTION_LABELS[lang] || SECTION_LABELS.en;

  const innerContent = (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5">
        <span className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 border border-teal-200/70 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[19px]">auto_awesome</span>
        </span>
        <h3 className="text-base sm:text-lg font-bold text-stone-900">
          {labels.heading}
        </h3>
      </div>

      {bestFor && (
        <div className="p-3.5 sm:p-4 rounded-xl bg-teal-50/70 border border-teal-200/80 text-xs sm:text-sm text-teal-950 leading-relaxed">
          <span className="font-bold text-teal-900 me-1.5">{labels.bestForLabel}:</span>
          <span>{bestFor}</span>
        </div>
      )}

      {features.length > 0 && (
        <div>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2.5">
            {labels.featuresLabel}
          </span>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {features.map((feat, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs sm:text-sm text-stone-800 leading-relaxed"
              >
                <span className="material-symbols-outlined text-teal-600 text-[18px] shrink-0 mt-0.5">
                  check_circle
                </span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  if (variant === 'embedded') {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-stone-50/50 border border-stone-200/90">
        {innerContent}
      </div>
    );
  }

  return (
    <section className="max-w-4xl mx-auto mt-8 bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-stone-200">
      {innerContent}
    </section>
  );
}
