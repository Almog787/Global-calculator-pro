import re

with open('src/contexts/i18n.tsx', 'r') as f:
    content = f.read()

# We want to keep the types but remove the `export const translations: Translations = { ... }`
# Wait, it's easier to just write a new i18n.tsx and keep `export type Translations = any` for now,
# or we can keep the `export type Translations = { ... }` part.

type_def = re.search(r'export type Translations = \{(.*?)\};', content, re.DOTALL)
if type_def:
    new_content = """/* eslint-disable react-refresh/only-export-components */
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import SkeletonLoader from '../components/SkeletonLoader';

export type Language = 'en' | 'he' | 'es' | 'fr' | 'ar';

export type Translations = {""" + type_def.group(1) + """};

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: any; // We use 'any' here since the loaded JSON has nested structure (ui, guides, assistant, tips, quiz)
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  
  const path = window.location.pathname;
  const match = path.match(/^\/(en|he|es|fr|ar)(\/|$)/);
  if (match) {
    return match[1] as Language;
  }
  
  const savedLang = localStorage.getItem('globalcalc_lang') as Language;
  if (savedLang) return savedLang;
  
  return 'en';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(getInitialLanguage());
  const [dictionary, setDictionary] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    
    import(`../locales/${lang}.json`).then((mod) => {
      if (isMounted) {
        setDictionary(mod.default);
        document.documentElement.dir = mod.default.ui.dir || 'ltr';
        document.documentElement.lang = lang === 'en' ? 'en-US' : lang;
      }
    }).catch(err => {
      console.error('Failed to load locale:', err);
    });
    
    localStorage.setItem('globalcalc_lang', lang);
    
    return () => {
      isMounted = false;
    };
  }, [lang]);

  if (!dictionary) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-blue-200 rounded-full"></div>
          <div className="h-4 bg-stone-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  const value = {
    lang,
    setLang,
    t: dictionary
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
"""
    with open('src/contexts/i18n.tsx', 'w') as f:
        f.write(new_content)
else:
    print("Could not find type_def")
