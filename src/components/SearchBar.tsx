import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { searchCalculators, getCalculatorTitle, getCalculatorDescription, CalculatorMeta } from "../data/calculators";
import { useI18n } from "../contexts/i18n";

interface SearchBarProps {
  placeholder?: string;
  isHero?: boolean;
  onSelect?: () => void;
}

export default function SearchBar({ placeholder, isHero = false, onSelect }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<CalculatorMeta[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t, lang } = useI18n();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length > 1) {
      setResults(searchCalculators(query, t, lang));
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [query, t, lang]);

  const handleSelect = (path: string) => {
    setQuery("");
    setIsOpen(false);
    if (onSelect) onSelect();
    navigate(`/${lang}${path}`);
  };

  const defaultPlaceholder = placeholder || (t.dir === 'rtl' ? 'חיפוש מחשבון...' : 'Search calculator...');

  if (isHero) {
    return (
      <div className="relative w-full" ref={ref}>
        <div className="w-full relative input-focus-ring bg-surface-container-lowest rounded-xl border border-border-subtle transition-all duration-300 shadow-sm">
          <span className="material-symbols-outlined absolute right-4 rtl:right-4 rtl:left-auto left-auto ltr:left-4 ltr:right-auto top-1/2 -translate-y-1/2 text-primary-container text-2xl pointer-events-none">
            search
          </span>
          <input
            id="hero-search-input"
            aria-label={defaultPlaceholder}
            type="text"
            className="w-full bg-transparent border-none py-4 pr-14 pl-14 rtl:pr-14 rtl:pl-4 ltr:pl-14 ltr:pr-4 text-lg text-on-surface placeholder:text-text-muted focus:outline-none focus:ring-0 rounded-xl"
            placeholder={defaultPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (query.trim().length > 1) setIsOpen(true);
            }}
          />
        </div>

        {isOpen && (
          <div className="absolute z-50 mt-2 w-full bg-surface-container-lowest rounded-xl shadow-xl border border-border-subtle overflow-hidden max-h-[350px] overflow-y-auto text-right rtl:text-right ltr:text-left">
            {results.length > 0 ? (
              <ul className="py-2 divide-y divide-border-subtle/50">
                {results.map((calc) => (
                  <li key={calc.id}>
                    <button
                      onClick={() => handleSelect(calc.path)}
                      className="w-full px-5 py-3 hover:bg-surface-container-low transition-colors cursor-pointer flex items-center justify-between group text-right rtl:text-right ltr:text-left"
                    >
                      <div>
                        <div className="font-label-bold text-headline-md text-primary-container group-hover:text-secondary transition-colors">
                          {getCalculatorTitle(calc, t, lang)}
                        </div>
                        <div className="font-body-md text-sm text-on-surface-variant truncate max-w-md mt-0.5">
                          {getCalculatorDescription(calc, t, lang)}
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-outline group-hover:text-secondary rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1 transition-transform">
                        {t.dir === 'rtl' ? 'arrow_back' : 'arrow_forward'}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-5 py-4 font-body-md text-on-surface-variant text-center">
                {t.dir === 'rtl' ? 'לא נמצאו מחשבונים המתאימים לחיפוש' : 'No calculators found for your search'}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full" ref={ref}>
      <div className="relative">
        <span className="absolute inset-y-0 right-3 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto flex items-center pointer-events-none text-outline">
          <span className="material-symbols-outlined text-[18px]">search</span>
        </span>
        <input
          id="header-search-input"
          aria-label={defaultPlaceholder}
          type="text"
          className="w-full pr-10 pl-10 rtl:pr-10 rtl:pl-3 ltr:pl-10 ltr:pr-3 py-2 bg-surface-container-lowest border border-border-subtle rounded-lg font-body-md text-sm text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all h-10 placeholder:text-text-muted"
          placeholder={defaultPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim().length > 1) setIsOpen(true);
          }}
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-surface-container-lowest rounded-xl shadow-lg border border-border-subtle overflow-hidden max-h-[300px] overflow-y-auto">
          {results.length > 0 ? (
            <ul className="py-1">
              {results.map((calc) => (
                <li key={calc.id}>
                  <button
                    onClick={() => handleSelect(calc.path)}
                    className="w-full text-left rtl:text-right px-4 py-2 hover:bg-surface-container-low focus:bg-surface-container-low outline-none flex flex-col gap-0.5 transition-colors cursor-pointer"
                  >
                    <span className="font-label-bold text-sm text-primary-container">
                      {getCalculatorTitle(calc, t, lang)}
                    </span>
                    <span className="font-label-sm text-xs text-text-muted truncate">
                      {getCalculatorDescription(calc, t, lang)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 font-body-md text-xs text-text-muted text-center">
              {t.dir === 'rtl' ? 'לא נמצאו מחשבונים' : 'No calculators found.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
