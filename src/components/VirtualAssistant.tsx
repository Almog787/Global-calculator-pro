import React, { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  searchCalculators,
  getCalculatorTitle,
  getCalculatorDescription,
  calculators,
  CalculatorMeta,
} from "../data/calculators";
import {
  quizSteps,
  assistantTranslations,
  QuizOption,
} from "../data/assistantQuiz";
import { useI18n, Language } from "../contexts/i18n";

export default function VirtualAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [activeTab, setActiveTab] = useState<"quiz" | "search">("quiz");
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CalculatorMeta[]>([]);
  
  // Quiz navigation stack
  const [stepHistory, setStepHistory] = useState<string[]>(["root"]);
  const [selectedResult, setSelectedResult] = useState<{
    calc: CalculatorMeta;
    reason?: string;
  } | null>(null);

  const { t, lang } = useI18n();
  const currentLang = (lang as Language) || "en";
  const location = useLocation();
  const navigate = useNavigate();

  const eyeLeftRef = useRef<SVGCircleElement>(null);
  const eyeRightRef = useRef<SVGCircleElement>(null);
  const robotContainerRef = useRef<HTMLDivElement>(null);

  const i18nTexts = useMemo(() => {
    return assistantTranslations[currentLang] || assistantTranslations.en;
  }, [currentLang]);

  const currentStepId = stepHistory[stepHistory.length - 1];
  const currentStep = quizSteps[currentStepId] || quizSteps.root;

  // Restore hidden state
  useEffect(() => {
    const hidden = localStorage.getItem("calc-e-hidden");
    if (hidden === "true") {
      setIsHidden(true);
    }
  }, []);

  const hideAssistant = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsHidden(true);
    localStorage.setItem("calc-e-hidden", "true");
  };

  const showAssistant = () => {
    setIsHidden(false);
    localStorage.setItem("calc-e-hidden", "false");
    setIsOpen(true);
  };

  // Eye tracking logic
  useEffect(() => {
    if (isHidden) return;

    const handleMouseMove = (e: MouseEvent) => {
      const moveEye = (eye: SVGCircleElement | null) => {
        if (!eye) return;
        const rect = eye.getBoundingClientRect();
        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height / 2;

        const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
        const distance = Math.min(
          3.5,
          Math.hypot(e.clientX - eyeCenterX, e.clientY - eyeCenterY) / 12
        );

        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        eye.style.transform = `translate(${x}px, ${y}px)`;
      };

      moveEye(eyeLeftRef.current);
      moveEye(eyeRightRef.current);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isHidden]);

  // Search logic
  useEffect(() => {
    if (query.trim().length > 1) {
      setSearchResults(searchCalculators(query, t, currentLang));
    } else {
      setSearchResults([]);
    }
  }, [query, t, currentLang]);

  // Handle choosing a multiple choice option in the questionnaire
  const handleOptionClick = (option: QuizOption) => {
    if (option.nextStepId && quizSteps[option.nextStepId]) {
      setStepHistory((prev) => [...prev, option.nextStepId!]);
    } else if (option.targetPath) {
      const foundCalc =
        calculators.find(
          (c) =>
            c.path === option.targetPath ||
            (option.calculatorId && c.id === option.calculatorId)
        ) || calculators[0];

      setSelectedResult({
        calc: foundCalc,
        reason: option.label[currentLang] || option.label.en,
      });
    }
  };

  // Back step in quiz
  const handleBackStep = () => {
    if (selectedResult) {
      setSelectedResult(null);
    } else if (stepHistory.length > 1) {
      setStepHistory((prev) => prev.slice(0, prev.length - 1));
    }
  };

  // Reset quiz
  const handleRestartQuiz = () => {
    setStepHistory(["root"]);
    setSelectedResult(null);
  };

  // Navigate to calculator
  const handleNavigateToCalc = (path: string) => {
    setIsOpen(false);
    setQuery("");
    navigate(`/${currentLang}${path}`);
  };

  // Context awareness tip
  const contextMessage = useMemo(() => {
    const p = location.pathname;
    if (p.includes("mortgage") || p.includes("rent-vs-buy") || p.includes("cap-rate")) {
      return currentLang === "he"
        ? "רוצה להשוות עם מחשבוני נדל״ן נוספים?"
        : currentLang === "es"
        ? "¿Quieres comparar con otras calculadoras inmobiliarias?"
        : currentLang === "fr"
        ? "Souhaitez-vous explorer d'autres calculs immobiliers ?"
        : currentLang === "ar"
        ? "هل ترغب بمقارنة حاسبات عقارية إضافية؟"
        : "Looking to compare other real estate calculators?";
    } else if (p.includes("compound") || p.includes("goal-savings") || p.includes("debt-snowball")) {
      return currentLang === "he"
        ? "מתכנן את העתיד הפיננסי? שאל אותי לכלים נוספים!"
        : currentLang === "es"
        ? "¿Planeando tu futuro financiero? ¡Pregúntame por más herramientas!"
        : currentLang === "fr"
        ? "Vous planifiez votre avenir financier ? Demandez-moi !"
        : currentLang === "ar"
        ? "هل تخطط لمستقبلك المالي؟ اسألني عن أدوات أخرى!"
        : "Planning your financial future? Ask me for more tools!";
    }
    return i18nTexts.quickTip;
  }, [location.pathname, currentLang, i18nTexts]);

  if (isHidden) {
    return (
      <button
        onClick={showAssistant}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-white rounded-full shadow-lg border border-stone-200 flex items-center justify-center hover:shadow-xl transition-all hover:scale-110 group rtl:right-auto rtl:left-6 cursor-pointer"
        aria-label="Show Assistant"
        title={i18nTexts.title}
      >
        <span className="material-symbols-outlined text-blue-600 text-2xl group-hover:rotate-12 transition-transform">
          smart_toy
        </span>
      </button>
    );
  }

  const isRtl = currentLang === "he" || currentLang === "ar";

  return (
    <div
      ref={robotContainerRef}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 rtl:right-auto rtl:left-6 rtl:items-start pointer-events-none"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Speech Bubble / Chat Interface */}
      <div
        className={`bg-white rounded-3xl shadow-2xl border border-stone-200 w-[330px] sm:w-[380px] overflow-hidden transition-all duration-300 origin-bottom-right rtl:origin-bottom-left pointer-events-auto flex flex-col max-h-[560px] ${
          isOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-90 opacity-0 pointer-events-none translate-y-6"
        }`}
      >
        {/* Assistant Header */}
        <div className="bg-stone-900 px-5 py-3.5 flex justify-between items-center text-white shrink-0 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <span className="material-symbols-outlined text-[18px]">smart_toy</span>
            </div>
            <div>
              <div className="font-bold text-sm tracking-wide flex items-center gap-1.5">
                {i18nTexts.title}
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <p className="text-[11px] text-stone-400 leading-none mt-0.5">
                AI Calculator Navigator
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-stone-400 hover:text-white transition-colors cursor-pointer"
              title="Close"
              aria-label="Close Assistant"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Tab Selection (Guided Questionnaire vs Free Search) */}
        <div className="flex border-b border-stone-200 bg-stone-100/70 p-1 gap-1 shrink-0">
          <button
            onClick={() => setActiveTab("quiz")}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "quiz"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/50"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">quiz</span>
            {i18nTexts.guidedQuizTab}
          </button>
          <button
            onClick={() => setActiveTab("search")}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "search"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/50"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">search</span>
            {i18nTexts.searchTab}
          </button>
        </div>

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col bg-stone-50/50">
          {activeTab === "quiz" ? (
            /* GUIDED MULTIPLE-CHOICE QUIZ LOOP */
            <div className="space-y-4 flex flex-col h-full">
              {selectedResult ? (
                /* RESULT CARD */
                <div className="animate-fadeIn space-y-4 py-1">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-950">
                    <div className="flex items-center gap-2 mb-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      {i18nTexts.recommended}
                    </div>
                    <h3 className="text-base font-bold text-stone-900 mb-1">
                      {getCalculatorTitle(selectedResult.calc, t, currentLang)}
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed mb-4">
                      {getCalculatorDescription(selectedResult.calc, t, currentLang)}
                    </p>
                    <button
                      onClick={() => handleNavigateToCalc(selectedResult.calc.path)}
                      className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">rocket_launch</span>
                      {i18nTexts.openCalculator}
                    </button>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-stone-200">
                    <button
                      onClick={handleRestartQuiz}
                      className="flex-1 py-2 px-3 bg-white border border-stone-200 hover:border-stone-300 rounded-xl text-xs font-semibold text-stone-700 hover:text-stone-900 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[16px]">refresh</span>
                      {i18nTexts.restartQuiz}
                    </button>
                    <button
                      onClick={handleBackStep}
                      className="py-2 px-3 bg-white border border-stone-200 hover:border-stone-300 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-xs"
                      title={i18nTexts.back}
                    >
                      <span className="material-symbols-outlined text-[16px] rtl:rotate-180">
                        arrow_back
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                /* QUESTION STEP */
                <div className="space-y-3 flex flex-col flex-1 animate-fadeIn">
                  {/* Step Header & Question */}
                  <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
                    <div className="flex items-center justify-between text-[11px] font-bold text-blue-600 mb-1.5">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">psychology</span>
                        {stepHistory.length === 1 ? "שלב 1 מתוך 2" : "שלב 2 מתוך 2"}
                      </span>
                      {stepHistory.length > 1 && (
                        <button
                          onClick={handleBackStep}
                          className="text-stone-500 hover:text-stone-900 flex items-center gap-0.5 text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px] rtl:rotate-180">
                            arrow_back
                          </span>
                          {i18nTexts.back}
                        </button>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-stone-900 leading-snug">
                      {currentStep.question[currentLang] || currentStep.question.en}
                    </h4>
                    {currentStep.subtitle && (
                      <p className="text-xs text-stone-500 mt-1">
                        {currentStep.subtitle[currentLang] || currentStep.subtitle.en}
                      </p>
                    )}
                  </div>

                  {/* Multiple Choice Options List */}
                  <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                    {currentStep.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleOptionClick(option)}
                        className="w-full text-left rtl:text-right p-3 rounded-2xl bg-white hover:bg-blue-50/60 border border-stone-200 hover:border-blue-300 shadow-xs hover:shadow-sm transition-all duration-200 flex items-start gap-3 group cursor-pointer active:scale-[0.99]"
                      >
                        <div className="w-8 h-8 rounded-xl bg-stone-100 group-hover:bg-blue-100 group-hover:text-blue-600 text-stone-600 flex items-center justify-center shrink-0 transition-colors mt-0.5">
                          <span className="material-symbols-outlined text-[18px]">
                            {option.icon}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs sm:text-sm font-bold text-stone-800 group-hover:text-blue-700 transition-colors flex items-center justify-between">
                            <span>{option.label[currentLang] || option.label.en}</span>
                            <span className="material-symbols-outlined text-[16px] text-stone-300 group-hover:text-blue-500 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:rotate-180">
                              chevron_right
                            </span>
                          </div>
                          {option.desc && (
                            <div className="text-[11px] text-stone-500 mt-0.5 line-clamp-2 leading-relaxed">
                              {option.desc[currentLang] || option.desc.en}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {stepHistory.length > 1 && (
                    <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-xs">
                      <button
                        onClick={handleRestartQuiz}
                        className="text-stone-500 hover:text-stone-800 text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span className="material-symbols-outlined text-[13px]">refresh</span>
                        {i18nTexts.restartQuiz}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* FREE SEARCH MODE */
            <div className="space-y-3 flex flex-col h-full">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pl-0 rtl:pr-3 flex items-center pointer-events-none text-stone-400">
                  <span className="material-symbols-outlined text-[18px]">search</span>
                </span>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={i18nTexts.searchPlaceholder}
                  autoFocus
                  className="w-full pl-9 pr-3 rtl:pr-9 rtl:pl-3 py-2 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-stone-900 placeholder:text-stone-400"
                />
              </div>

              {query.trim().length > 1 ? (
                searchResults.length > 0 ? (
                  <div className="space-y-2 overflow-y-auto max-h-[300px] pr-1">
                    {searchResults.map((calc) => (
                      <button
                        key={calc.id}
                        onClick={() => handleNavigateToCalc(calc.path)}
                        className="w-full text-left rtl:text-right p-3 rounded-xl bg-white hover:bg-blue-50 border border-stone-200 hover:border-blue-300 transition-all flex items-start gap-2.5 group cursor-pointer shadow-xs"
                      >
                        <span className="material-symbols-outlined text-stone-400 group-hover:text-blue-600 text-[20px] shrink-0 mt-0.5">
                          calculate
                        </span>
                        <div>
                          <div className="text-xs font-bold text-stone-900 group-hover:text-blue-700">
                            {getCalculatorTitle(calc, t, currentLang)}
                          </div>
                          <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                            {getCalculatorDescription(calc, t, currentLang)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-stone-400 text-xs">
                    <span className="material-symbols-outlined text-3xl mb-1 text-stone-300">
                      sentiment_dissatisfied
                    </span>
                    <p>{i18nTexts.noResults}</p>
                  </div>
                )
              ) : (
                <div className="space-y-3 py-2">
                  <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-3.5">
                    <p className="text-xs text-blue-900 leading-relaxed font-medium">
                      💡 {contextMessage}
                    </p>
                  </div>

                  <div className="text-xs font-bold text-stone-500 uppercase tracking-wider px-1">
                    {i18nTexts.allCalculators}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {calculators.slice(0, 6).map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleNavigateToCalc(c.path)}
                        className="p-2.5 rounded-xl bg-white border border-stone-200 hover:border-blue-300 hover:bg-blue-50/40 text-xs font-medium text-stone-700 hover:text-blue-700 text-left rtl:text-right truncate transition-all cursor-pointer"
                      >
                        {getCalculatorTitle(c, t, currentLang)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info in bubble */}
        <div className="bg-stone-100 px-4 py-2.5 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500 shrink-0">
          <span>GlobalCalc Pro AI Assistant</span>
          <span className="font-semibold text-blue-600">v2.0</span>
        </div>
      </div>

      {/* Floating Avatar Trigger Button with Micro-interactions */}
      <div className="relative pointer-events-auto flex items-end gap-2 group">
        {/* Helper Prompt Pill (Idle state) */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="absolute bottom-14 right-0 rtl:right-auto rtl:left-0 mb-1 whitespace-nowrap bg-stone-900 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 cursor-pointer border border-stone-700 flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
            {i18nTexts.startQuiz}
          </button>
        )}

        {/* Minimize Button */}
        <button
          onClick={hideAssistant}
          className="w-6 h-6 bg-white rounded-full shadow-md border border-stone-200 text-stone-400 hover:text-red-500 hover:border-red-200 flex items-center justify-center transition-colors absolute -top-2 -left-2 rtl:-right-2 rtl:-left-auto z-20 opacity-0 group-hover:opacity-100 cursor-pointer"
          aria-label="Hide Assistant"
          title="Hide"
        >
          <span className="material-symbols-outlined text-[13px]">close</span>
        </button>

        {/* Interactive Robot SVG Avatar */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-16 h-16 bg-white rounded-2xl shadow-xl border-2 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 z-10 cursor-pointer ${
            isOpen
              ? "border-blue-500 shadow-blue-500/25 ring-4 ring-blue-500/20"
              : "border-stone-200 animate-[float_4s_ease-in-out_infinite]"
          }`}
          aria-label={i18nTexts.title}
        >
          <svg
            width="44"
            height="44"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Robot Head Body */}
            <rect
              x="14"
              y="22"
              width="72"
              height="58"
              rx="18"
              fill="#f8fafc"
              stroke="#1e293b"
              strokeWidth="5"
            />
            {/* Dark Visor Screen */}
            <rect
              x="23"
              y="34"
              width="54"
              height="32"
              rx="10"
              fill="#0f172a"
            />
            {/* Left Eye White & Pupil */}
            <circle cx="38" cy="50" r="7.5" fill="#334155" />
            <circle cx="38" cy="50" r="6" fill="#1e293b" />
            <circle ref={eyeLeftRef} cx="38" cy="50" r="3.5" fill="#38bdf8" />
            {/* Right Eye White & Pupil */}
            <circle cx="62" cy="50" r="7.5" fill="#334155" />
            <circle cx="62" cy="50" r="6" fill="#1e293b" />
            <circle ref={eyeRightRef} cx="62" cy="50" r="3.5" fill="#38bdf8" />
            {/* Antenna with glowing beacon */}
            <path
              d="M50 22 V 10"
              stroke="#1e293b"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle
              cx="50"
              cy="8"
              r="4.5"
              fill={isOpen ? "#22c55e" : "#3b82f6"}
              className="transition-colors duration-300"
            />
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
