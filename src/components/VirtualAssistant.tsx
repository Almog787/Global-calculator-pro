import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useI18n } from "../contexts/i18n";
import { calculators, getCalculatorTitle, getCalculatorDescription } from "../data/calculators";
import { quizSteps, assistantTranslations, assistantTips, QuizOption, AssistantTip } from "../data/assistantQuiz";

const ThreeCharacterCanvas = React.lazy(() => import("./ThreeCharacterCanvas"));

type AssistantTab = "quiz" | "quickCalc" | "tips" | "search";
type AssistantState = "idle" | "success" | "thinking" | "shake" | "sleep" | "panic";

export default function VirtualAssistant() {
  const { lang, t } = useI18n();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AssistantTab>("quiz");
  
  // Character Animation State
  const [assistantState, setAssistantState] = useState<AssistantState>("idle");
  const [assistantMessage, setAssistantMessage] = useState<string | undefined>();
  const [normalizedMousePos, setNormalizedMousePos] = useState({ x: 0, y: 0 });

  // Quiz State
  const [currentStepId, setCurrentStepId] = useState<string>("root");
  const [stepHistory, setStepHistory] = useState<string[]>([]);
  const [selectedResult, setSelectedResult] = useState<QuizOption | null>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Tips State
  const [selectedTipCategory, setSelectedTipCategory] = useState<string>("all");
  const [copiedTipId, setCopiedTipId] = useState<string | null>(null);

  // Quick Calc State
  const [calcMode, setCalcMode] = useState<"percent" | "discount" | "rule72">("percent");
  const [percentX, setPercentX] = useState<string>("15");
  const [percentY, setPercentY] = useState<string>("200");
  const [discountPrice, setDiscountPrice] = useState<string>("150");
  const [discountPct, setDiscountPct] = useState<string>("20");
  const [rule72Rate, setRule72Rate] = useState<string>("7");

  const buttonRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const currentLang = (lang as "he" | "en" | "es" | "fr" | "ar") || "he";
  const i18nTexts = assistantTranslations[currentLang] || assistantTranslations.he;

  // Global Calc-E API
  useEffect(() => {
    (window as any).CalcE = {
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      setTab: (tab: AssistantTab) => {
        setActiveTab(tab);
        setIsOpen(true);
      },
      triggerEmotion: (emotion: AssistantState, message?: string) => {
        setAssistantState(emotion);
        if (message) setAssistantMessage(message);
        
        if (emotion !== "sleep") {
          setTimeout(() => {
            setAssistantState("idle");
            setAssistantMessage(undefined);
          }, 2000);
        }
      }
    };
    return () => {
      delete (window as any).CalcE;
    };
  }, []);

  // Sleep & Panic Timers
  useEffect(() => {
    let idleTimer: NodeJS.Timeout;

    const resetIdleTimer = () => {
      if (assistantState === "sleep") {
        setAssistantState("idle");
      }
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        setAssistantState("sleep");
      }, 45000); // 45s of inactivity triggers sleep
    };

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 10) {
        setAssistantState("panic");
      }
    };

    const handleMouseEnter = () => {
      if (assistantState === "panic") {
        setAssistantState("idle");
      }
    };

    window.addEventListener("mousemove", resetIdleTimer);
    window.addEventListener("keydown", resetIdleTimer);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    resetIdleTimer();

    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener("mousemove", resetIdleTimer);
      window.removeEventListener("keydown", resetIdleTimer);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [assistantState]);

  // Reactive animation triggers
  const triggerSuccessJump = useCallback(() => {
    setAssistantState("success");
    setTimeout(() => setAssistantState("idle"), 1000);
  }, []);

  const triggerShakeNo = useCallback(() => {
    setAssistantState("shake");
    setTimeout(() => setAssistantState("idle"), 800);
  }, []);

  // Global pointer & scroll tracking for Three.js 3D character
  const [scrollVelocity, setScrollVelocity] = useState(0);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX, clientY;
      if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      
      const normX = (clientX / window.innerWidth) * 2 - 1;
      const normY = -(clientY / window.innerHeight) * 2 + 1;
      setNormalizedMousePos({ x: normX, y: normY });
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const delta = currentScrollY - lastScrollY;
          // Normalize scroll velocity roughly between -1 and 1
          const velocity = Math.max(-1, Math.min(1, delta / 50));
          setScrollVelocity(velocity);
          
          lastScrollY = currentScrollY;
          ticking = false;
          
          // Gradually reset scroll velocity
          setTimeout(() => {
            if (window.scrollY === lastScrollY) {
              setScrollVelocity(0);
            }
          }, 150);
        });
        ticking = true;
      }
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("touchstart", handlePointerMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchstart", handlePointerMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Event listener to open assistant from anywhere
  useEffect(() => {
    const handleOpenAssistant = () => {
      setIsOpen(true);
      triggerSuccessJump();
    };
    window.addEventListener("open-virtual-assistant", handleOpenAssistant);
    return () => window.removeEventListener("open-virtual-assistant", handleOpenAssistant);
  }, [triggerSuccessJump]);

  // Auto focus search on tab change
  useEffect(() => {
    if (activeTab === "search" && isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 150);
    }
  }, [activeTab, isOpen]);

  // Search input change handler with reactive animation triggers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    
    if (val.trim().length > 0) {
      setAssistantState("thinking");
      
      // Check if search yields results
      const matches = calculators.filter((calc) => {
        const title = getCalculatorTitle(calc, t, lang).toLowerCase();
        const desc = getCalculatorDescription(calc, t, lang).toLowerCase();
        const q = val.toLowerCase();
        return title.includes(q) || desc.includes(q) || calc.tags.some((tag) => tag.toLowerCase().includes(q));
      });

      if (matches.length === 0) {
        triggerShakeNo();
      }
    } else {
      setAssistantState("idle");
    }
  };

  // Handle Quiz navigation
  const handleOptionSelect = (option: QuizOption) => {
    triggerSuccessJump();

    if (option.targetPath) {
      setSelectedResult(option);
    } else if (option.nextStepId && quizSteps[option.nextStepId]) {
      setStepHistory((prev) => [...prev, currentStepId]);
      setCurrentStepId(option.nextStepId);
      setSelectedResult(null);
    }
  };

  const handleBack = () => {
    if (selectedResult) {
      setSelectedResult(null);
      return;
    }
    if (stepHistory.length > 0) {
      const prevStep = stepHistory[stepHistory.length - 1];
      setStepHistory((prev) => prev.slice(0, -1));
      setCurrentStepId(prevStep);
      setSelectedResult(null);
    }
  };

  const handleRestart = () => {
    setCurrentStepId("root");
    setStepHistory([]);
    setSelectedResult(null);
    setAssistantState("thinking");
    setTimeout(() => setAssistantState("idle"), 600);
  };

  const handleNavigateToCalc = (path: string) => {
    triggerSuccessJump();
    setTimeout(() => {
      setIsOpen(false);
      navigate(`/${lang}${path}`);
    }, 250);
  };

  const handleCopyTip = (tip: AssistantTip) => {
    const textToCopy = `${tip.title[currentLang] || tip.title.en}\n${tip.summary[currentLang] || tip.summary.en}${tip.formulaOrRule ? `\n${i18nTexts.ruleFormula} ${tip.formulaOrRule}` : ""}`;
    navigator.clipboard?.writeText(textToCopy);
    setCopiedTipId(tip.id);
    triggerSuccessJump();
    setTimeout(() => setCopiedTipId(null), 2000);
  };

  // Search Results
  const searchResults = searchQuery.trim()
    ? calculators.filter((calc) => {
        const title = getCalculatorTitle(calc, t, lang).toLowerCase();
        const desc = getCalculatorDescription(calc, t, lang).toLowerCase();
        const query = searchQuery.toLowerCase();
        const tagMatch = calc.tags.some((tag) => tag.toLowerCase().includes(query));
        return title.includes(query) || desc.includes(query) || tagMatch;
      })
    : calculators.slice(0, 6);

  // Filtered Tips
  const filteredTips = selectedTipCategory === "all"
    ? assistantTips
    : assistantTips.filter((tip) => tip.category === selectedTipCategory);

  // Quick calculations
  const numX = parseFloat(percentX) || 0;
  const numY = parseFloat(percentY) || 0;
  const percentResult = ((numX / 100) * numY).toLocaleString(undefined, { maximumFractionDigits: 2 });

  const numOrigPrice = parseFloat(discountPrice) || 0;
  const numDiscountPct = parseFloat(discountPct) || 0;
  const discountSavings = ((numDiscountPct / 100) * numOrigPrice);
  const discountFinal = Math.max(0, numOrigPrice - discountSavings).toLocaleString(undefined, { maximumFractionDigits: 2 });

  const numRate = parseFloat(rule72Rate) || 0;
  const yearsToDoubleVal = numRate > 0 ? (72 / numRate).toFixed(1) : "—";

  const currentStep = quizSteps[currentStepId] || quizSteps.root;

  return (
    <div
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 rtl:right-auto rtl:left-4 sm:rtl:left-6 z-50 flex flex-col items-end rtl:items-start select-none pointer-events-none`}
    >
      {/* Floating Dialog / Speech Bubble Container */}
      <div
        className={`bg-slate-900/95 backdrop-blur-2xl text-slate-100 rounded-3xl shadow-[0_25px_60px_-15px_rgba(6,182,212,0.35)] border border-cyan-500/30 w-[calc(100vw-32px)] sm:w-[415px] overflow-hidden transition-all duration-300 ease-out origin-bottom-right rtl:origin-bottom-left pointer-events-auto flex flex-col max-h-[85vh] sm:max-h-[620px] mb-3.5 ${
          isOpen
            ? "animate-pop-in-spring opacity-100 translate-y-0"
            : "scale-0 opacity-0 pointer-events-none translate-y-6"
        }`}
      >
        {/* Assistant Header with 3D Canvas */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950 px-4 sm:px-5 py-3.5 flex justify-between items-center text-white shrink-0 border-b border-cyan-500/20 relative overflow-hidden">
          {/* Animated decorative accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-sky-400 to-teal-400 animate-pulse"></div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-slate-950 border border-cyan-400/60 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20 overflow-hidden relative group">
              <div className="absolute inset-0 bg-radial from-cyan-500/40 via-transparent to-transparent opacity-80"></div>
              <Suspense fallback={<img src="/icon-192.jpg" alt="Calc-E Assistant" className="w-full h-full object-cover" />}>
                <ThreeCharacterCanvas
                  state={assistantState}
                  mousePos={normalizedMousePos}
                  scrollVelocity={scrollVelocity}
                  message={assistantMessage}
                  width={44}
                  height={44}
                  className="block"
                />
              </Suspense>
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-wide flex items-center gap-2 text-white">
                <span>{i18nTexts.title}</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  AI Active
                </span>
              </div>
              <p className="text-[11px] text-cyan-200/70 leading-none mt-1">
                {i18nTexts.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-800/60 hover:bg-cyan-500/20 flex items-center justify-center text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer border border-slate-700/50"
              title="Close"
              aria-label="Close Assistant"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800/80 bg-slate-950/80 p-1.5 gap-1 shrink-0">
          <button
            onClick={() => {
              setActiveTab("quiz");
              triggerSuccessJump();
            }}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "quiz"
                ? "bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-md shadow-cyan-500/25 border border-cyan-400/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">explore</span>
            <span className="truncate">{i18nTexts.guidedQuizTab}</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("quickCalc");
              triggerSuccessJump();
            }}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "quickCalc"
                ? "bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-md shadow-cyan-500/25 border border-cyan-400/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">bolt</span>
            <span className="truncate">{i18nTexts.quickCalcTab}</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("tips");
              triggerSuccessJump();
            }}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "tips"
                ? "bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-md shadow-cyan-500/25 border border-cyan-400/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">lightbulb</span>
            <span className="truncate">{i18nTexts.tipsTab}</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("search");
              setAssistantState("thinking");
            }}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "search"
                ? "bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-md shadow-cyan-500/25 border border-cyan-400/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">search</span>
            <span className="truncate">{i18nTexts.searchTab}</span>
          </button>
        </div>

        {/* Dialog Body Content */}
        <div className="p-4 overflow-y-auto flex-grow space-y-4">
          {/* TAB 1: GUIDED QUIZ */}
          {activeTab === "quiz" && (
            <div className="space-y-4 animate-fadeIn">
              {selectedResult ? (
                /* Quiz Result Card */
                <div className="bg-gradient-to-br from-cyan-950/80 via-slate-900 to-slate-900 p-4 rounded-2xl border border-cyan-500/40 space-y-3 animate-slide-up-fade shadow-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md font-bold">
                      <span className="material-symbols-outlined text-xl">{selectedResult.icon || "auto_awesome"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                        {i18nTexts.recommended}
                      </span>
                      <h4 className="font-extrabold text-base text-white leading-tight mt-1">
                        {selectedResult.label?.[currentLang] || selectedResult.label?.en || ""}
                      </h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {selectedResult.desc?.[currentLang] || selectedResult.desc?.en || ""}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleNavigateToCalc(selectedResult.targetPath!)}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer active:scale-98"
                  >
                    <span>{i18nTexts.openCalculator}</span>
                    <span className="material-symbols-outlined text-sm rtl:rotate-180">arrow_forward</span>
                  </button>

                  <button
                    onClick={handleBack}
                    className="w-full py-2 text-center text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    {i18nTexts.back}
                  </button>
                </div>
              ) : (
                /* Active Quiz Question */
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-semibold text-cyan-200">
                    <span>{currentStep?.question?.[currentLang] || currentStep?.question?.en || ""}</span>
                    {stepHistory.length > 0 && (
                      <button
                        onClick={handleBack}
                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 cursor-pointer font-bold"
                      >
                        <span className="material-symbols-outlined text-sm rtl:rotate-180">arrow_back</span>
                        <span>{i18nTexts.back}</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {currentStep?.options?.map((option, idx) => (
                      <button
                        key={option.id}
                        onClick={() => handleOptionSelect(option)}
                        style={{ animationDelay: `${idx * 60}ms` }}
                        className="w-full p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-400/60 rounded-2xl text-right rtl:text-right ltr:text-left transition-all duration-200 group flex items-start gap-3 cursor-pointer shadow-md animate-slide-up-fade"
                      >
                        <span className="w-8 h-8 rounded-xl bg-slate-900 text-cyan-400 flex items-center justify-center shrink-0 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors text-sm font-bold border border-slate-700/60">
                          <span className="material-symbols-outlined text-lg">{option.icon || "chevron_right"}</span>
                        </span>
                        <div className="flex-grow min-w-0">
                          <div className="font-bold text-xs text-slate-100 group-hover:text-cyan-300 transition-colors">
                            {option.label?.[currentLang] || option.label?.en || ""}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate mt-0.5">
                            {option.desc?.[currentLang] || option.desc?.en || ""}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {stepHistory.length > 0 && (
                    <button
                      onClick={handleRestart}
                      className="w-full py-1.5 text-center text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">refresh</span>
                      <span>{i18nTexts.restartQuiz}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: QUICK UTILITY CALCULATOR */}
          {activeTab === "quickCalc" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex rounded-xl bg-slate-950/80 p-1 gap-1 border border-slate-800">
                <button
                  onClick={() => setCalcMode("percent")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    calcMode === "percent" ? "bg-cyan-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {i18nTexts.instantCalc}
                </button>
                <button
                  onClick={() => setCalcMode("discount")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    calcMode === "discount" ? "bg-cyan-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {i18nTexts.calcDiscount}
                </button>
                <button
                  onClick={() => setCalcMode("rule72")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    calcMode === "rule72" ? "bg-cyan-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {i18nTexts.calcRule72}
                </button>
              </div>

              {calcMode === "percent" && (
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/60 space-y-3 animate-slide-up-fade">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="assistant-percent-x" className="text-[11px] font-medium text-slate-300 block mb-1">
                        {i18nTexts.valueX}
                      </label>
                      <input
                        id="assistant-percent-x"
                        aria-label={i18nTexts.valueX}
                        type="number"
                        value={percentX}
                        onChange={(e) => setPercentX(e.target.value)}
                        className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono-num font-bold text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label htmlFor="assistant-percent-y" className="text-[11px] font-medium text-slate-300 block mb-1">
                        {i18nTexts.valueY}
                      </label>
                      <input
                        id="assistant-percent-y"
                        aria-label={i18nTexts.valueY}
                        type="number"
                        value={percentY}
                        onChange={(e) => setPercentY(e.target.value)}
                        className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono-num font-bold text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-cyan-950 to-slate-900 border border-cyan-500/30 text-white p-3.5 rounded-xl flex items-center justify-between shadow-inner">
                    <span className="text-xs font-bold text-cyan-300">{i18nTexts.result}</span>
                    <span className="font-mono-num font-extrabold text-cyan-400 text-lg">
                      {percentResult}
                    </span>
                  </div>
                </div>
              )}

              {calcMode === "discount" && (
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/60 space-y-3 animate-slide-up-fade">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="assistant-discount-price" className="text-[11px] font-medium text-slate-300 block mb-1">
                        {i18nTexts.originalPrice}
                      </label>
                      <input
                        id="assistant-discount-price"
                        aria-label={i18nTexts.originalPrice}
                        type="number"
                        value={discountPrice}
                        onChange={(e) => setDiscountPrice(e.target.value)}
                        className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono-num font-bold text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label htmlFor="assistant-discount-pct" className="text-[11px] font-medium text-slate-300 block mb-1">
                        {i18nTexts.discountPercent}
                      </label>
                      <input
                        id="assistant-discount-pct"
                        aria-label={i18nTexts.discountPercent}
                        type="number"
                        value={discountPct}
                        onChange={(e) => setDiscountPct(e.target.value)}
                        className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono-num font-bold text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-cyan-950 to-slate-900 border border-cyan-500/30 text-white p-3.5 rounded-xl flex items-center justify-between shadow-inner">
                    <div>
                      <div className="text-[10px] text-slate-400">{i18nTexts.savingsAmount}</div>
                      <div className="text-xs font-bold text-emerald-400">₪{discountSavings.toFixed(2)}</div>
                    </div>
                    <div className="text-right rtl:text-right ltr:text-left">
                      <div className="text-[10px] text-slate-400">{i18nTexts.finalPrice}</div>
                      <div className="font-mono-num font-extrabold text-cyan-400 text-lg">
                        ₪{discountFinal}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {calcMode === "rule72" && (
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/60 space-y-3 animate-slide-up-fade">
                  <div>
                    <label htmlFor="assistant-rule72-rate" className="text-[11px] font-medium text-slate-300 block mb-1">
                      {i18nTexts.rateInput}
                    </label>
                    <input
                      id="assistant-rule72-rate"
                      aria-label={i18nTexts.rateInput}
                      type="number"
                      value={rule72Rate}
                      onChange={(e) => setRule72Rate(e.target.value)}
                      className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono-num font-bold text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="bg-gradient-to-r from-cyan-950 to-slate-900 border border-cyan-500/30 text-white p-3.5 rounded-xl flex items-center justify-between shadow-inner">
                    <span className="text-xs font-bold text-cyan-300">{i18nTexts.yearsToDouble}</span>
                    <span className="font-mono-num font-extrabold text-cyan-400 text-lg">
                      {yearsToDoubleVal} {i18nTexts.yearsLabel}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: GOLDEN TIPS & RULES */}
          {activeTab === "tips" && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                {["all", "finance", "health", "math"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedTipCategory(cat)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedTipCategory === cat
                        ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                        : "bg-slate-800/70 text-slate-300 hover:bg-slate-700/70"
                    }`}
                  >
                    {cat === "all" ? i18nTexts.allCategories : cat.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {filteredTips.map((tip, idx) => (
                  <div
                    key={tip.id}
                    style={{ animationDelay: `${idx * 50}ms` }}
                    className="p-3.5 bg-slate-800/40 border border-slate-700/50 hover:border-cyan-500/40 border-l-4 border-l-cyan-400 rounded-2xl space-y-2 shadow-sm transition-all animate-slide-up-fade"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h5 className="font-extrabold text-xs text-white leading-snug">
                        {tip.title[currentLang] || tip.title.en}
                      </h5>
                      <button
                        onClick={() => handleCopyTip(tip)}
                        className="text-cyan-400 hover:text-cyan-300 p-1 rounded-lg hover:bg-cyan-500/20 transition-colors cursor-pointer shrink-0"
                        title={i18nTexts.copyBtn}
                      >
                        <span className="material-symbols-outlined text-base">
                          {copiedTipId === tip.id ? "check" : "content_copy"}
                        </span>
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {tip.summary[currentLang] || tip.summary.en}
                    </p>

                    {tip.formulaOrRule && (
                      <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 text-[10px] font-mono-num font-semibold text-cyan-300 flex items-center justify-between">
                        <span>{tip.formulaOrRule}</span>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400">{tip.category}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: INSTANT SEARCH */}
          {activeTab === "search" && (
            <div className="space-y-3 animate-fadeIn">
              <div className="relative">
                <span className="material-symbols-outlined absolute right-3 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                  search
                </span>
                <input
                  ref={searchInputRef}
                  id="assistant-search-input"
                  aria-label={i18nTexts.searchPlaceholder}
                  type="text"
                  placeholder={i18nTexts.searchPlaceholder}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full py-2 pr-9 pl-9 rtl:pr-9 rtl:pl-3 ltr:pl-9 ltr:pr-3 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-1.5 max-h-[350px] overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map((calc, idx) => (
                    <button
                      key={calc.id}
                      onClick={() => handleNavigateToCalc(calc.path)}
                      style={{ animationDelay: `${idx * 40}ms` }}
                      className="w-full p-2.5 bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 hover:border-cyan-500/40 rounded-xl text-right rtl:text-right ltr:text-left transition-all flex items-center justify-between group cursor-pointer animate-slide-up-fade"
                    >
                      <div className="min-w-0 pr-2 rtl:pr-0 rtl:pl-2">
                        <div className="font-bold text-xs text-white group-hover:text-cyan-300 truncate">
                          {getCalculatorTitle(calc, t, lang)}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">
                          {getCalculatorDescription(calc, t, lang)}
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-slate-400 group-hover:text-cyan-400 text-base shrink-0 rtl:rotate-180">
                        arrow_forward
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-6 text-xs text-slate-400">
                    <span className="material-symbols-outlined text-2xl text-slate-500 mb-1 block">search_off</span>
                    <span>{i18nTexts.noResults}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Trigger Button with 3D Canvas */}
      <div className="relative pointer-events-auto" ref={buttonRef}>
        {/* Unread Ping Badge */}
        {!isOpen && (
          <div
            onClick={() => {
              setIsOpen(true);
              triggerSuccessJump();
            }}
            className="absolute -top-10 right-0 rtl:right-auto rtl:left-0 bg-slate-950/90 text-cyan-300 text-[11px] font-extrabold py-1 px-3 rounded-full shadow-xl whitespace-nowrap animate-bounce flex items-center gap-1.5 cursor-pointer hover:bg-cyan-950 transition-colors border border-cyan-500/40"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>{i18nTexts.badge}</span>
          </div>
        )}

        {/* The Animated 3D Character Button */}
        <button
          onClick={() => {
            setIsOpen((prev) => !prev);
            triggerSuccessJump();
          }}
          onPointerDown={(e) => {
            e.currentTarget.style.transform = "scale(0.9) scaleY(0.85) scaleX(1.1)"; // Squash
          }}
          onPointerUp={(e) => {
            e.currentTarget.style.transform = ""; // Revert stretch
          }}
          onPointerLeave={(e) => {
            e.currentTarget.style.transform = "";
          }}
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-slate-950 via-slate-900 to-cyan-950 text-white shadow-[0_10px_30px_rgba(6,182,212,0.4)] hover:shadow-[0_15px_40px_rgba(6,182,212,0.6)] transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center justify-center relative border-2 border-cyan-400 cursor-pointer overflow-hidden transform hover:-translate-y-1 ${
            isOpen ? "ring-4 ring-cyan-400/50 shadow-cyan-500/60" : ""
          }`}
          title={i18nTexts.title}
          aria-label={i18nTexts.title}
        >
          {/* Luminous Glow Behind Character */}
          <div className="absolute inset-0 bg-radial from-cyan-400/40 via-sky-500/20 to-transparent pointer-events-none"></div>

          {/* 3D Character Canvas */}
          <Suspense fallback={<img src="/icon-192.jpg" alt="Calc-E Assistant" className="w-10 h-10 object-cover rounded-full shadow-inner pointer-events-none" />}>
            <ThreeCharacterCanvas
              state={assistantState}
              mousePos={normalizedMousePos}
              scrollVelocity={scrollVelocity}
              message={assistantMessage}
              width={64}
              height={64}
              className="pointer-events-none block"
            />
          </Suspense>
        </button>
      </div>
    </div>
  );
}
