import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { searchCalculators, getCalculatorTitle, getCalculatorDescription, CalculatorMeta } from "../data/calculators";
import { useI18n } from "../contexts/i18n";

export default function SearchBar() {
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
    navigate(`/${lang}${path}`);
  };

  const placeholderText = t.dir === 'rtl' ? 'חפש מחשבון...' : 'Search calculators...';

  return (
    <div className="relative w-full lg:w-64" ref={ref}>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pl-0 rtl:pr-3 flex items-center pointer-events-none text-outline">
          <span className="material-symbols-outlined text-[18px]">search</span>
        </span>
        <input
          type="text"
          className="w-full pr-10 pl-10 rtl:pr-10 rtl:pl-4 py-2 bg-surface-container-low border border-outline-variant rounded-full font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors h-10 lg:h-12 placeholder:text-on-surface-variant"
          placeholder={placeholderText}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim().length > 1) setIsOpen(true);
          }}
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant overflow-hidden max-h-[300px] overflow-y-auto">
          {results.length > 0 ? (
            <ul className="py-1">
              {results.map((calc) => (
                <li key={calc.id}>
                  <button
                    onClick={() => handleSelect(calc.path)}
                    className="w-full text-left rtl:text-right px-4 py-2 hover:bg-surface-container focus:bg-surface-container outline-none flex flex-col gap-0.5 transition-colors cursor-pointer"
                  >
                    <span className="font-label-bold text-label-bold text-on-surface">
                      {getCalculatorTitle(calc, t, lang)}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant truncate">
                      {getCalculatorDescription(calc, t, lang)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 font-body-md text-body-md text-on-surface-variant text-center">
              {t.dir === 'rtl' ? 'לא נמצאו מחשבונים' : 'No calculators found.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
