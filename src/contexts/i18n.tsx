/* eslint-disable react-refresh/only-export-components */
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import SkeletonLoader from '../components/SkeletonLoader';

export type Language = 'en' | 'he' | 'es' | 'fr' | 'ar';

export type Translations = {
  [key in Language]: {
    dir: 'ltr' | 'rtl';
    title: string;
    calculate: string;
    result: string;
    allTools: string;
    
    faqTitle: string;
    
    // Percentage Finder
    percFinderTitle: string;
    percFinderDesc: string;
    percFinderExplanation: string;
    whatIs: string;
    percOf: string;
    isWhatPercOf: string;
    percChange: string;
    from: string;
    to: string;

    // Unit Converter
    unitConvTitle: string;
    unitConvDesc: string;
    unitConvExplanation: string;
    length: string;
    weight: string;
    temp: string;

    // Mortgage
    mortgageTitle: string;
    mortgageDesc: string;
    mortgageExplanation: string;
    loanAmount: string;
    interestRate: string;
    loanTerm: string;
    monthlyPayment: string;
    totalInterest: string;

    // Compound Interest
    compoundTitle: string;
    compoundDesc: string;
    compoundExplanation: string;
    initialInvestment: string;
    monthlyContribution: string;
    yearsToGrow: string;
    futureValue: string;
    totalContributions: string;
    totalInterestEarned: string;

    // BMI
    bmiTitle: string;
    bmiDesc: string;
    bmiExplanation: string;
    height: string;
    weightBmi: string;
    bmiResult: string;
    bmiCategory: string;

    // Tip
    tipTitle: string;
    tipDesc: string;
    tipExplanation: string;
    billAmount: string;
    tipPercentage: string;
    numberOfPeople: string;
    tipAmount: string;
    totalPerPerson: string;

    // Salary
    salaryTitle: string;
    salaryDesc: string;
    salaryExplanation: string;
    salaryAmount: string;
    salaryFrequency: string;
    hourly: string;
    weekly: string;
    monthly: string;
    yearly: string;

    // Age
    ageTitle: string;
    ageDesc: string;
    ageExplanation: string;
    dateOfBirth: string;
    exactAge: string;
    yearsOld: string;
    monthsOld: string;
    daysOld: string;

    // Contact & Legal & About & Suggestions
    contactTitle: string;
    contactDesc: string;
    contactExplanation: string;
    fullName: string;
    emailAddress: string;
    subject: string;
    message: string;
    sendMessage: string;
    messageSentSuccess: string;
    contactInfoNote: string;

    privacyTitle: string;
    privacyDesc: string;
    termsTitle: string;
    termsDesc: string;
    aboutTitle: string;
    aboutDesc: string;

    suggestionsTitle: string;
    suggestionsDesc: string;
    suggestionsExplanation: string;
    suggestionSuccess: string;
    suggestionType: string;
    suggestionTypeCalc: string;
    suggestionTypeFeature: string;
    suggestionTypeBug: string;
    suggestionTitleField: string;
    suggestionDetailsField: string;
    submitGithubIssue: string;

    // Footer
    footerCalculators: string;
    footerLegal: string;
    footerRights: string;
    footerDisclaimer: string;

    // 404
    notFoundTitle: string;
    notFoundDesc: string;
    backToHome: string;

    // Categories
    catAll: string;
    catFinance: string;
    catRealEstate: string;
    catHealth: string;
    catMath: string;
    catTech: string;
    catLifestyle: string;
    pwaPromoTitle: string;
    pwaPromoDesc: string;
    pwaPromoBen1: string;
    pwaPromoBen2: string;
    pwaPromoBen3: string;
    pwaPromoStep1: string;
    pwaPromoStep2: string;

    libraryTitle: string;
    librarySubtitle: string;
  }
};

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: any;
  guides: any;
  assistant: any;
  tips: any;
  quiz: any; // We use 'any' here since the loaded JSON has nested structure (ui, guides, assistant, tips, quiz)
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
    t: dictionary.ui,
    guides: dictionary.guides,
    assistant: dictionary.assistant,
    tips: dictionary.tips,
    quiz: dictionary.quiz
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
