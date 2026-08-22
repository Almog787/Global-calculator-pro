import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../contexts/i18n";
import { calculators, getCalculatorTitle, getCalculatorDescription } from "../data/calculators";
import { quizSteps, assistantTranslations, assistantTips, QuizOption, AssistantTip } from "../data/assistantQuiz";
import ThreeCharacterCanvas from "./ThreeCharacterCanvas";

type AssistantTab = "quiz" | "quickCalc" | "tips" | "search";
type AssistantState = "idle" | "success" | "thinking" | "shake";

export default function VirtualAssistant() {
  const { lang, t } = useI18n();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AssistantTab>("quiz");
  
  // Character Animation State
  const [assistantState, setAssistantState] = useState<AssistantState>("idle");
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

  // Reactive animation triggers
  const triggerSuccessJump = useCallback(() => {
    setAssistantState("success");
    setTimeout(() => setAssistantState("idle"), 1000);
  }, []);

  const triggerShakeNo = useCallback(() => {
    setAssistantState("shake");
    setTimeout(() => setAssistantState("idle"), 800);
  }, []);

  // Global mouse tracking for Three.js 3D eye tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Convert to normalized viewport coordinates (-1 to +1)
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      setNormalizedMousePos({ x: normX, y: normY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
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
        className={`bg-surface-container-lowest rounded-3xl shadow-2xl border border-border-subtle w-[calc(100vw-32px)] sm:w-[410px] overflow-hidden transition-all duration-300 ease-out origin-bottom-right rtl:origin-bottom-left pointer-events-auto flex flex-col max-h-[84vh] sm:max-h-[610px] mb-3.5 ${
          isOpen
            ? "animate-pop-in-spring opacity-100 translate-y-0"
            : "scale-0 opacity-0 pointer-events-none translate-y-6"
        }`}
      >
        {/* Assistant Header with 3D Canvas */}
        <div className="bg-primary-container px-4 sm:px-5 py-3.5 flex justify-between items-center text-on-primary shrink-0 border-b border-primary-container relative overflow-hidden">
          {/* Animated decorative accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-secondary-fixed via-secondary to-primary-fixed animate-pulse"></div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-surface-container-lowest/10 border border-secondary-fixed/30 flex items-center justify-center shrink-0 shadow-inner overflow-hidden">
              <ThreeCharacterCanvas
                state={assistantState}
                mousePos={normalizedMousePos}
                width={44}
                height={44}
              />
            </div>
            <div>
              <div className="font-bold text-sm tracking-wide flex items-center gap-1.5 text-on-primary">
                {i18nTexts.title}
              </div>
              <p className="text-[11px] text-primary-fixed-dim leading-none mt-0.5">
                {i18nTexts.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-primary-fixed-dim hover:text-on-primary transition-colors cursor-pointer"
              title="Close"
              aria-label="Close Assistant"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border-subtle bg-surface px-2 py-1.5 gap-1 shrink-0">
          <button
            onClick={() => {
              setActiveTab("quiz");
              triggerSuccessJump();
            }}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "quiz"
                ? "bg-surface-container-lowest text-secondary shadow-xs border border-border-subtle"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
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
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "quickCalc"
                ? "bg-surface-container-lowest text-secondary shadow-xs border border-border-subtle"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
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
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "tips"
                ? "bg-surface-container-lowest text-secondary shadow-xs border border-border-subtle"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
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
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "search"
                ? "bg-surface-container-lowest text-secondary shadow-xs border border-border-subtle"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
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
                <div className="bg-gradient-to-br from-secondary/10 via-surface to-surface-container-low p-4 rounded-2xl border border-secondary/30 space-y-3 animate-slide-up-fade">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary text-on-secondary flex items-center justify-center shrink-0 shadow-sm">
                      <span className="material-symbols-outlined text-xl">{selectedResult.icon || "auto_awesome"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                        {i18nTexts.recommended}
                      </span>
                      <h4 className="font-bold text-base text-primary-container leading-tight">
                        {selectedResult.label?.[currentLang] || selectedResult.label?.en || ""}
                      </h4>
                      <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                        {selectedResult.desc?.[currentLang] || selectedResult.desc?.en || ""}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleNavigateToCalc(selectedResult.targetPath!)}
                    className="w-full py-2.5 px-4 bg-secondary text-on-secondary rounded-xl font-bold text-xs hover:bg-on-secondary-container transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98"
                  >
                    <span>{i18nTexts.openCalculator}</span>
                    <span className="material-symbols-outlined text-sm rtl:rotate-180">arrow_forward</span>
                  </button>

                  <button
                    onClick={handleBack}
                    className="w-full py-2 text-center text-xs text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                  >
                    {i18nTexts.back}
                  </button>
                </div>
              ) : (
                /* Active Quiz Question */
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs text-on-surface-variant font-medium">
                    <span>{currentStep?.question?.[currentLang] || currentStep?.question?.en || ""}</span>
                    {stepHistory.length > 0 && (
                      <button
                        onClick={handleBack}
                        className="text-secondary hover:underline flex items-center gap-0.5 cursor-pointer font-bold"
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
                        className="w-full p-3 bg-surface-container-lowest hover:bg-surface-container-low border border-border-subtle hover:border-secondary/50 rounded-2xl text-right rtl:text-right ltr:text-left transition-all duration-200 group flex items-start gap-3 cursor-pointer shadow-xs animate-slide-up-fade"
                      >
                        <span className="w-8 h-8 rounded-xl bg-surface-container-low text-secondary flex items-center justify-center shrink-0 group-hover:bg-secondary group-hover:text-on-secondary transition-colors text-sm">
                          <span className="material-symbols-outlined text-lg">{option.icon || "chevron_right"}</span>
                        </span>
                        <div className="flex-grow min-w-0">
                          <div className="font-bold text-xs text-primary-container group-hover:text-secondary transition-colors">
                            {option.label?.[currentLang] || option.label?.en || ""}
                          </div>
                          <div className="text-[11px] text-on-surface-variant truncate mt-0.5">
                            {option.desc?.[currentLang] || option.desc?.en || ""}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {stepHistory.length > 0 && (
                    <button
                      onClick={handleRestart}
                      className="w-full py-1.5 text-center text-xs text-text-muted hover:text-on-surface transition-colors cursor-pointer flex items-center justify-center gap-1"
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
              <div className="flex rounded-xl bg-surface-container-low p-1 gap-1">
                <button
                  onClick={() => setCalcMode("percent")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    calcMode === "percent" ? "bg-surface-container-lowest text-secondary shadow-xs" : "text-on-surface-variant"
                  }`}
                >
                  {i18nTexts.instantCalc}
                </button>
                <button
                  onClick={() => setCalcMode("discount")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    calcMode === "discount" ? "bg-surface-container-lowest text-secondary shadow-xs" : "text-on-surface-variant"
                  }`}
                >
                  {i18nTexts.calcDiscount}
                </button>
                <button
                  onClick={() => setCalcMode("rule72")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    calcMode === "rule72" ? "bg-surface-container-lowest text-secondary shadow-xs" : "text-on-surface-variant"
                  }`}
                >
                  {i18nTexts.calcRule72}
                </button>
              </div>

              {calcMode === "percent" && (
                <div className="bg-surface-container-lowest p-4 rounded-2xl border border-border-subtle space-y-3 animate-slide-up-fade">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-medium text-on-surface-variant block mb-1">
                        {i18nTexts.valueX}
                      </label>
                      <input
                        type="number"
                        value={percentX}
                        onChange={(e) => setPercentX(e.target.value)}
                        className="w-full p-2 bg-surface border border-border-subtle rounded-xl text-xs font-mono-num font-bold text-primary-container focus:outline-none focus:border-secondary"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-on-surface-variant block mb-1">
                        {i18nTexts.valueY}
                      </label>
                      <input
                        type="number"
                        value={percentY}
                        onChange={(e) => setPercentY(e.target.value)}
                        className="w-full p-2 bg-surface border border-border-subtle rounded-xl text-xs font-mono-num font-bold text-primary-container focus:outline-none focus:border-secondary"
                      />
                    </div>
                  </div>

                  <div className="bg-primary-container text-on-primary p-3 rounded-xl flex items-center justify-between">
                    <span className="text-xs text-primary-fixed-dim">{i18nTexts.result}</span>
                    <span className="font-mono-num font-extrabold text-secondary-fixed text-lg">
                      {percentResult}
                    </span>
                  </div>
                </div>
              )}

              {calcMode === "discount" && (
                <div className="bg-surface-container-lowest p-4 rounded-2xl border border-border-subtle space-y-3 animate-slide-up-fade">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-medium text-on-surface-variant block mb-1">
                        {i18nTexts.originalPrice}
                      </label>
                      <input
                        type="number"
                        value={discountPrice}
                        onChange={(e) => setDiscountPrice(e.target.value)}
                        className="w-full p-2 bg-surface border border-border-subtle rounded-xl text-xs font-mono-num font-bold text-primary-container focus:outline-none focus:border-secondary"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-on-surface-variant block mb-1">
                        {i18nTexts.discountPercent}
                      </label>
                      <input
                        type="number"
                        value={discountPct}
                        onChange={(e) => setDiscountPct(e.target.value)}
                        className="w-full p-2 bg-surface border border-border-subtle rounded-xl text-xs font-mono-num font-bold text-primary-container focus:outline-none focus:border-secondary"
                      />
                    </div>
                  </div>

                  <div className="bg-primary-container text-on-primary p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-primary-fixed-dim">{i18nTexts.savingsAmount}</div>
                      <div className="text-xs font-bold text-emerald-400">₪{discountSavings.toFixed(2)}</div>
                    </div>
                    <div className="text-right rtl:text-right ltr:text-left">
                      <div className="text-[10px] text-primary-fixed-dim">{i18nTexts.finalPrice}</div>
                      <div className="font-mono-num font-extrabold text-secondary-fixed text-lg">
                        ₪{discountFinal}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {calcMode === "rule72" && (
                <div className="bg-surface-container-lowest p-4 rounded-2xl border border-border-subtle space-y-3 animate-slide-up-fade">
                  <div>
                    <label className="text-[11px] font-medium text-on-surface-variant block mb-1">
                      {i18nTexts.rateInput}
                    </label>
                    <input
                      type="number"
                      value={rule72Rate}
                      onChange={(e) => setRule72Rate(e.target.value)}
                      className="w-full p-2 bg-surface border border-border-subtle rounded-xl text-xs font-mono-num font-bold text-primary-container focus:outline-none focus:border-secondary"
                    />
                  </div>

                  <div className="bg-primary-container text-on-primary p-3 rounded-xl flex items-center justify-between">
                    <span className="text-xs text-primary-fixed-dim">{i18nTexts.yearsToDouble}</span>
                    <span className="font-mono-num font-extrabold text-secondary-fixed text-lg">
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
                        ? "bg-secondary text-on-secondary"
                        : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
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
                    className="p-3 bg-surface-container-lowest border border-border-subtle rounded-2xl space-y-1.5 shadow-xs hover:border-secondary/40 transition-colors animate-slide-up-fade"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h5 className="font-bold text-xs text-primary-container leading-snug">
                        {tip.title[currentLang] || tip.title.en}
                      </h5>
                      <button
                        onClick={() => handleCopyTip(tip)}
                        className="text-secondary hover:text-on-secondary-container p-1 rounded-lg hover:bg-secondary/10 transition-colors cursor-pointer shrink-0"
                        title={i18nTexts.copyBtn}
                      >
                        <span className="material-symbols-outlined text-base">
                          {copiedTipId === tip.id ? "check" : "content_copy"}
                        </span>
                      </button>
                    </div>

                    <p className="text-[11px] text-on-surface-variant leading-relaxed">
                      {tip.summary[currentLang] || tip.summary.en}
                    </p>

                    {tip.formulaOrRule && (
                      <div className="bg-surface p-2 rounded-xl border border-border-subtle text-[10px] font-mono-num font-semibold text-secondary flex items-center justify-between">
                        <span>{tip.formulaOrRule}</span>
                        <span className="text-[9px] uppercase tracking-wider text-text-muted">{tip.category}</span>
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
                <span className="material-symbols-outlined absolute right-3 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto top-1/2 -translate-y-1/2 text-outline text-lg">
                  search
                </span>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={i18nTexts.searchPlaceholder}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full py-2 pr-9 pl-9 rtl:pr-9 rtl:pl-3 ltr:pl-9 ltr:pr-3 bg-surface-container-lowest border border-border-subtle rounded-xl text-xs text-on-surface focus:outline-none focus:border-secondary"
                />
              </div>

              <div className="space-y-1.5 max-h-[350px] overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map((calc, idx) => (
                    <button
                      key={calc.id}
                      onClick={() => handleNavigateToCalc(calc.path)}
                      style={{ animationDelay: `${idx * 40}ms` }}
                      className="w-full p-2.5 bg-surface-container-lowest hover:bg-surface-container-low border border-border-subtle rounded-xl text-right rtl:text-right ltr:text-left transition-all flex items-center justify-between group cursor-pointer animate-slide-up-fade"
                    >
                      <div className="min-w-0 pr-2 rtl:pr-0 rtl:pl-2">
                        <div className="font-bold text-xs text-primary-container group-hover:text-secondary truncate">
                          {getCalculatorTitle(calc, t, lang)}
                        </div>
                        <div className="text-[11px] text-on-surface-variant truncate">
                          {getCalculatorDescription(calc, t, lang)}
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-outline group-hover:text-secondary text-base shrink-0 rtl:rotate-180">
                        arrow_forward
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-6 text-xs text-text-muted">
                    <span className="material-symbols-outlined text-2xl text-outline mb-1 block">search_off</span>
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
            className="absolute -top-10 right-0 rtl:right-auto rtl:left-0 bg-primary-container text-on-primary text-[11px] font-bold py-1 px-3 rounded-full shadow-lg whitespace-nowrap animate-bounce flex items-center gap-1.5 cursor-pointer hover:bg-secondary transition-colors border border-border-subtle"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed animate-ping"></span>
            <span>{i18nTexts.badge}</span>
          </div>
        )}

        {/* The Animated 3D Character Button */}
        <button
          onClick={() => {
            setIsOpen((prev) => !prev);
            triggerSuccessJump();
          }}
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary-container text-on-primary shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center relative border-2 border-secondary/40 cursor-pointer overflow-hidden transform hover:scale-105 active:scale-95 ${
            isOpen ? "ring-4 ring-secondary/40" : ""
          }`}
          title={i18nTexts.title}
          aria-label={i18nTexts.title}
        >
          {/* Subtle Glow */}
          <div className="absolute inset-0 bg-radial from-secondary/20 via-transparent to-transparent pointer-events-none"></div>

          {/* Three.js 3D Character Canvas */}
          <ThreeCharacterCanvas
            state={assistantState}
            mousePos={normalizedMousePos}
            width={64}
            height={64}
            className="pointer-events-none"
          />
        </button>
      </div>
    </div>
  );
}
