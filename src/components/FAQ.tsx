import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useI18n } from '../contexts/i18n';
import { FaqOverrideContext } from '../contexts/SeoOverrideContext';
import { calculators, getCalculatorDescription, getCalculatorTitle } from '../data/calculators';
import { buildCalculatorFallbackFaqs } from '../lib/seo/calculatorFallbackGuide';

type FAQItem = {
  question: string;
  answer: string;
};

export interface FAQProps {
  items: FAQItem[];
  title?: string;
}

export default function FAQ({ items, title }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { t, lang } = useI18n();
  const location = useLocation();
  const notifyChildFaq = useContext(FaqOverrideContext);

  const normalizedPath = location.pathname.replace(/^\/(en|he|es|fr|ar|ru)(\/|$)/, '$2');
  const subPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
  const matchedCalc = calculators.find((c) => c.path === subPath || c.path === normalizedPath);

  const effectiveItems =
    items && items.length > 0
      ? items
      : matchedCalc
        ? buildCalculatorFallbackFaqs(
            matchedCalc,
            lang,
            getCalculatorTitle(matchedCalc, t, lang),
            getCalculatorDescription(matchedCalc, t, lang),
            matchedCalc.tags
          )
        : [];

  useEffect(() => {
    if (notifyChildFaq && effectiveItems.length > 0) {
      notifyChildFaq();
    }
  }, [notifyChildFaq, effectiveItems.length]);

  if (effectiveItems.length === 0) return null;

  return (
    <div className="mt-12 mb-8">
      <h2 className="text-2xl font-bold text-on-surface mb-6">{title || t.faqTitle || 'Frequently Asked Questions'}</h2>
      
      <div className="space-y-4">
        {effectiveItems.map((item, index) => {
          const isOpen = openIndex === index;
          
          return (
            <div 
              key={index} 
              className={`border border-outline-variant rounded-xl overflow-hidden transition-all duration-200 ${isOpen ? 'bg-surface-container-low shadow-sm' : 'bg-surface-container-lowest hover:bg-surface-container-low'}`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-expanded={isOpen}
              >
                <span className="font-semibold text-on-surface">{item.question}</span>
                <span className={`material-symbols-outlined text-on-surface-variant transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>
              
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="text-on-surface-variant">{item.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
