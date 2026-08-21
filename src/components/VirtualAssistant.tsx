import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../contexts/i18n";
import { calculators, getCalculatorTitle, getCalculatorDescription } from "../data/calculators";
import { quizSteps, assistantTranslations, assistantTips, QuizOption, AssistantTip } from "../data/assistantQuiz";

type AssistantTab = "quiz" | "quickCalc" | "tips" | "search";

export default function VirtualAssistant() {
  const { lang, t } = useI18n();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AssistantTab>("quiz");
  
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

  // Lively animations & eye tracking
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [robotMood, setRobotMood] = useState<"idle" | "happy" | "thinking">("idle");
  const buttonRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const currentLang = (lang as "he" | "en" | "es" | "fr" | "ar") || "he";
  const i18nTexts = assistantTranslations[currentLang] || assistantTranslations.he;

  // Natural blinking interval
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4500);

    return () => clearInterval(blinkInterval);
  }, []);

  // Eye tracking logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance > 0) {
        const maxDist = 3.5;
        const normX = (deltaX / Math.max(distance, 80)) * maxDist;
        const normY = (deltaY / Math.max(distance, 80)) * maxDist;
        setEyePos({ x: normX, y: normY });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Auto focus search on tab change
  useEffect(() => {
    if (activeTab === "search" && isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 150);
    }
  }, [activeTab, isOpen]);

  // Handle Quiz navigation
  const handleOptionSelect = (option: QuizOption) => {
    setRobotMood("happy");
    setTimeout(() => setRobotMood("idle"), 1200);

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
    setRobotMood("thinking");
    setTimeout(() => setRobotMood("idle"), 800);
  };

  const handleNavigateToCalc = (path: string) => {
    setIsOpen(false);
    navigate(`/${lang}${path}`);
  };

  const handleCopyTip = (tip: AssistantTip) => {
    const textToCopy = `${tip.title[currentLang] || tip.title.en}\n${tip.summary[currentLang] || tip.summary.en}${tip.formulaOrRule ? `\n${i18nTexts.ruleFormula} ${tip.formulaOrRule}` : ""}`;
    navigator.clipboard?.writeText(textToCopy);
    setCopiedTipId(tip.id);
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
      {/* Floating Dialog Container */}
      <div
        className={`bg-white rounded-3xl shadow-2xl border border-stone-200 w-[calc(100vw-32px)] sm:w-[410px] overflow-hidden transition-all duration-300 origin-bottom-right rtl:origin-bottom-left pointer-events-auto flex flex-col max-h-[84vh] sm:max-h-[610px] mb-3 ${
          isOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-90 opacity-0 pointer-events-none translate-y-6"
        }`}
      >
        {/* Assistant Header */}
        <div className="bg-stone-900 px-4 sm:px-5 py-3.5 flex justify-between items-center text-white shrink-0 border-b border-stone-800 relative overflow-hidden">
          {/* Animated decorative accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-teal-400 to-indigo-500 animate-pulse"></div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 shadow-inner relative">
              <span className="material-symbols-outlined text-[20px] animate-pulse">smart_toy</span>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-stone-900"></span>
            </div>
            <div>
              <div className="font-bold text-sm tracking-wide flex items-center gap-1.5">
                {i18nTexts.title}
              </div>
              <p className="text-[11px] text-stone-400 leading-none mt-0.5">
                {i18nTexts.subtitle}
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

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-100 bg-stone-50/80 px-2 py-1.5 gap-1 shrink-0">
          <button
            onClick={() => setActiveTab("quiz")}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "quiz"
                ? "bg-white text-blue-600 shadow-sm border border-stone-200/80"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/60"
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">explore</span>
            <span className="truncate">{i18nTexts.guidedQuizTab}</span>
          </button>
          <button
            onClick={() => setActiveTab("quickCalc")}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "quickCalc"
                ? "bg-white text-blue-600 shadow-sm border border-stone-200/80"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/60"
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">bolt</span>
            <span className="truncate">{i18nTexts.quickCalcTab}</span>
          </button>
          <button
            onClick={() => setActiveTab("tips")}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "tips"
                ? "bg-white text-blue-600 shadow-sm border border-stone-200/80"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/60"
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">lightbulb</span>
            <span className="truncate">{i18nTexts.tipsTab}</span>
          </button>
          <button
            onClick={() => setActiveTab("search")}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "search"
                ? "bg-white text-blue-600 shadow-sm border border-stone-200/80"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/60"
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">search</span>
            <span className="truncate">{i18nTexts.searchTab}</span>
          </button>
        </div>

        {/* Assistant Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* TAB 1: GUIDED QUIZ */}
          {activeTab === "quiz" && (
            <div className="space-y-4">
              {/* Back / Restart Toolbar */}
              {(stepHistory.length > 0 || selectedResult) && (
                <div className="flex justify-between items-center text-xs font-medium text-stone-500 pb-1 border-b border-stone-100">
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1 text-stone-600 hover:text-blue-600 font-semibold cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm rtl:rotate-180">arrow_back</span>
                    {i18nTexts.back}
                  </button>
                  <button
                    onClick={handleRestart}
                    className="flex items-center gap-1 text-stone-400 hover:text-stone-700 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">refresh</span>
                    {i18nTexts.restartQuiz}
                  </button>
                </div>
              )}

              {/* Quiz Result View */}
              {selectedResult ? (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl p-5 border border-blue-100 text-center space-y-3.5 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
                    <span className="material-symbols-outlined text-2xl">{selectedResult.icon}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                      {i18nTexts.recommended}
                    </span>
                    <h3 className="text-base font-bold text-stone-900 mt-1">
                      {selectedResult.label[currentLang] || selectedResult.label.en}
                    </h3>
                    {selectedResult.desc && (
                      <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                        {selectedResult.desc[currentLang] || selectedResult.desc.en}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleNavigateToCalc(selectedResult.targetPath || "/all")}
                    className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                  >
                    <span>{i18nTexts.openCalculator}</span>
                    <span className="material-symbols-outlined text-sm rtl:rotate-180">arrow_forward</span>
                  </button>
                </div>
              ) : (
                /* Step Options View */
                <div className="space-y-3">
                  <div className="bg-blue-50/70 rounded-2xl p-3.5 border border-blue-100/70">
                    <h4 className="font-bold text-xs sm:text-sm text-stone-900">
                      {currentStep.question[currentLang] || currentStep.question.en}
                    </h4>
                    {currentStep.subtitle && (
                      <p className="text-[11px] text-stone-500 mt-1">
                        {currentStep.subtitle[currentLang] || currentStep.subtitle.en}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {currentStep.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleOptionSelect(option)}
                        className="group text-left rtl:text-right p-3 rounded-2xl border border-stone-200 bg-white hover:bg-blue-50/50 hover:border-blue-300 transition-all duration-200 flex items-start gap-3 cursor-pointer shadow-xs active:scale-[0.99]"
                      >
                        <div className="w-8 h-8 rounded-xl bg-stone-100 group-hover:bg-blue-600 text-stone-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors mt-0.5">
                          <span className="material-symbols-outlined text-base">{option.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-xs text-stone-900 group-hover:text-blue-600 transition-colors flex items-center justify-between">
                            <span className="truncate">{option.label[currentLang] || option.label.en}</span>
                            <span className="material-symbols-outlined text-sm text-stone-300 group-hover:text-blue-500 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                              chevron_right
                            </span>
                          </div>
                          {option.desc && (
                            <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-2 leading-tight">
                              {option.desc[currentLang] || option.desc.en}
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: QUICK CALC (Non-AI Instant Tool) */}
          {activeTab === "quickCalc" && (
            <div className="space-y-4">
              {/* Quick Calc Type Selector */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-100 rounded-xl">
                <button
                  onClick={() => setCalcMode("percent")}
                  className={`py-1.5 px-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer text-center ${
                    calcMode === "percent" ? "bg-white text-blue-600 shadow-xs" : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  X% of Y
                </button>
                <button
                  onClick={() => setCalcMode("discount")}
                  className={`py-1.5 px-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer text-center ${
                    calcMode === "discount" ? "bg-white text-blue-600 shadow-xs" : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  % הנחה / Disc
                </button>
                <button
                  onClick={() => setCalcMode("rule72")}
                  className={`py-1.5 px-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer text-center ${
                    calcMode === "rule72" ? "bg-white text-blue-600 shadow-xs" : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  כלל 72 / Rule
                </button>
              </div>

              {/* Mode: Percent of */}
              {calcMode === "percent" && (
                <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-blue-600 text-sm">percent</span>
                    {i18nTexts.calcXofY}
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] font-semibold text-stone-500 block mb-1">
                        {i18nTexts.valueX}
                      </label>
                      <input
                        type="number"
                        value={percentX}
                        onChange={(e) => setPercentX(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:border-blue-500 focus:outline-none"
                        placeholder="15"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-stone-500 block mb-1">
                        {i18nTexts.valueY}
                      </label>
                      <input
                        type="number"
                        value={percentY}
                        onChange={(e) => setPercentY(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:border-blue-500 focus:outline-none"
                        placeholder="200"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-600 text-white rounded-xl p-3 text-center shadow-xs">
                    <span className="text-[10px] uppercase tracking-wider font-semibold opacity-90 block">
                      {i18nTexts.result}
                    </span>
                    <span className="text-xl font-extrabold tracking-tight">
                      {percentResult}
                    </span>
                  </div>
                </div>
              )}

              {/* Mode: Discount */}
              {calcMode === "discount" && (
                <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-emerald-600 text-sm">local_offer</span>
                    {i18nTexts.calcDiscount}
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] font-semibold text-stone-500 block mb-1">
                        {i18nTexts.originalPrice}
                      </label>
                      <input
                        type="number"
                        value={discountPrice}
                        onChange={(e) => setDiscountPrice(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:border-blue-500 focus:outline-none"
                        placeholder="150"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-stone-500 block mb-1">
                        {i18nTexts.discountPercent}
                      </label>
                      <input
                        type="number"
                        value={discountPct}
                        onChange={(e) => setDiscountPct(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:border-blue-500 focus:outline-none"
                        placeholder="20"
                      />
                    </div>
                  </div>

                  <div className="bg-emerald-600 text-white rounded-xl p-3 text-center shadow-xs">
                    <span className="text-[10px] uppercase tracking-wider font-semibold opacity-90 block">
                      {i18nTexts.finalPrice}
                    </span>
                    <span className="text-xl font-extrabold tracking-tight">
                      {discountFinal}
                    </span>
                    <span className="text-[11px] block opacity-85 mt-0.5">
                      ({i18nTexts.savingsAmount}: {discountSavings.toLocaleString(undefined, { maximumFractionDigits: 2 })})
                    </span>
                  </div>
                </div>
              )}

              {/* Mode: Rule of 72 */}
              {calcMode === "rule72" && (
                <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-indigo-600 text-sm">trending_up</span>
                    {i18nTexts.calcRule72}
                  </h4>
                  <div>
                    <label className="text-[10px] font-semibold text-stone-500 block mb-1">
                      {i18nTexts.rateInput}
                    </label>
                    <input
                      type="number"
                      value={rule72Rate}
                      onChange={(e) => setRule72Rate(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:border-blue-500 focus:outline-none"
                      placeholder="7"
                    />
                  </div>

                  <div className="bg-indigo-600 text-white rounded-xl p-3 text-center shadow-xs">
                    <span className="text-[10px] uppercase tracking-wider font-semibold opacity-90 block">
                      {i18nTexts.yearsToDouble}
                    </span>
                    <span className="text-xl font-extrabold tracking-tight">
                      ~ {yearsToDoubleVal} {currentLang === "he" ? "שנים" : "years"}
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-500 leading-tight">
                    {i18nTexts.rule72Explain}
                  </p>
                </div>
              )}

              {/* Quick shortcut to all percentage tools */}
              <button
                onClick={() => handleNavigateToCalc("/percentage-finder")}
                className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">open_in_new</span>
                <span>{i18nTexts.goToTool}</span>
              </button>
            </div>
          )}

          {/* TAB 3: GOLDEN TIPS & RULES */}
          {activeTab === "tips" && (
            <div className="space-y-3">
              {/* Category Filter Chips */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                <button
                  onClick={() => setSelectedTipCategory("all")}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 transition-colors cursor-pointer ${
                    selectedTipCategory === "all"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {i18nTexts.allCategories}
                </button>
                <button
                  onClick={() => setSelectedTipCategory("finance")}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 transition-colors cursor-pointer ${
                    selectedTipCategory === "finance"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  💰 כספים / Finance
                </button>
                <button
                  onClick={() => setSelectedTipCategory("real-estate")}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 transition-colors cursor-pointer ${
                    selectedTipCategory === "real-estate"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  🏠 נדל״ן / Housing
                </button>
                <button
                  onClick={() => setSelectedTipCategory("math")}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 transition-colors cursor-pointer ${
                    selectedTipCategory === "math"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  📐 מתמטיקה / Math
                </button>
                <button
                  onClick={() => setSelectedTipCategory("tech")}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 transition-colors cursor-pointer ${
                    selectedTipCategory === "tech"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  ⚡ טכנולוגיה / Tech
                </button>
              </div>

              {/* Tips Cards List */}
              <div className="space-y-2.5">
                {filteredTips.map((tip) => (
                  <div
                    key={tip.id}
                    className="p-3.5 rounded-2xl bg-white border border-stone-200/90 shadow-xs hover:border-blue-300 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                          <span className="material-symbols-outlined text-sm">{tip.icon}</span>
                        </div>
                        <h4 className="text-xs font-bold text-stone-900">
                          {tip.title[currentLang] || tip.title.en}
                        </h4>
                      </div>

                      <button
                        onClick={() => handleCopyTip(tip)}
                        className="text-stone-400 hover:text-blue-600 transition-colors p-1 rounded-md cursor-pointer"
                        title="Copy tip"
                      >
                        <span className="material-symbols-outlined text-sm">
                          {copiedTipId === tip.id ? "check" : "content_copy"}
                        </span>
                      </button>
                    </div>

                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      {tip.summary[currentLang] || tip.summary.en}
                    </p>

                    {tip.formulaOrRule && (
                      <div className="bg-stone-50 border border-stone-200/60 rounded-lg px-2.5 py-1 text-[10px] font-mono text-stone-700 flex items-center justify-between">
                        <span className="font-semibold text-stone-500">{i18nTexts.ruleFormula}</span>
                        <span className="font-bold text-blue-700">{tip.formulaOrRule}</span>
                      </div>
                    )}

                    {tip.calcPath && (
                      <button
                        onClick={() => handleNavigateToCalc(tip.calcPath!)}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition-colors pt-0.5"
                      >
                        <span>{i18nTexts.openCalculator}</span>
                        <span className="material-symbols-outlined text-xs rtl:rotate-180">arrow_forward</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SEARCH */}
          {activeTab === "search" && (
            <div className="space-y-3">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={i18nTexts.searchPlaceholder}
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl py-2.5 px-3.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 rtl:right-auto rtl:left-3 top-2.5 text-stone-400 hover:text-stone-600"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                ) : (
                  <span className="absolute right-3 rtl:right-auto rtl:left-3 top-2.5 text-stone-400 pointer-events-none material-symbols-outlined text-sm">
                    search
                  </span>
                )}
              </div>

              {/* Search Results */}
              <div className="space-y-2">
                {searchResults.length > 0 ? (
                  searchResults.map((calc) => (
                    <button
                      key={calc.id}
                      onClick={() => handleNavigateToCalc(calc.path)}
                      className="w-full text-left rtl:text-right p-3 rounded-2xl border border-stone-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="min-w-0 flex-1 pr-2 rtl:pr-0 rtl:pl-2">
                        <div className="font-bold text-xs text-stone-900 group-hover:text-blue-600 truncate">
                          {getCalculatorTitle(calc, t, lang)}
                        </div>
                        <p className="text-[11px] text-stone-500 truncate mt-0.5">
                          {getCalculatorDescription(calc, t, lang)}
                        </p>
                      </div>
                      <span className="material-symbols-outlined text-stone-300 group-hover:text-blue-500 rtl:rotate-180 transition-transform">
                        arrow_forward
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-6 text-stone-400">
                    <span className="material-symbols-outlined text-3xl mb-1">search_off</span>
                    <p className="text-xs">{i18nTexts.noResults}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Quick Action */}
        <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs shrink-0">
          <span className="text-[11px] text-stone-500 truncate">{i18nTexts.quickTip}</span>
          <button
            onClick={() => handleNavigateToCalc("/all")}
            className="text-[11px] font-bold text-blue-600 hover:text-blue-700 whitespace-nowrap cursor-pointer ml-2 rtl:ml-0 rtl:mr-2"
          >
            {i18nTexts.allCalculators}
          </button>
        </div>
      </div>

      {/* Floating Animated Avatar Button with expressive animations */}
      <div ref={buttonRef} className="relative pointer-events-auto group">
        {/* Floating Bubble Badge when closed */}
        {!isOpen && (
          <div 
            onClick={() => setIsOpen(true)}
            className="absolute -top-10 right-0 rtl:right-auto rtl:left-0 bg-stone-900 text-white text-[11px] font-bold py-1 px-3 rounded-full shadow-lg whitespace-nowrap animate-bounce flex items-center gap-1.5 cursor-pointer hover:bg-stone-800 transition-colors border border-stone-700"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>{i18nTexts.badge}</span>
          </div>
        )}

        {/* The Animated Robot Button */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-stone-900 text-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center relative border-2 border-stone-700 cursor-pointer overflow-hidden transform hover:scale-105 active:scale-95 ${
            isOpen ? "ring-4 ring-blue-400/40" : ""
          }`}
          title={i18nTexts.title}
          aria-label={i18nTexts.title}
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-radial from-blue-500/20 via-transparent to-transparent opacity-60 pointer-events-none"></div>

          {/* SVG Animated Robot Face */}
          <svg
            viewBox="0 0 100 100"
            className="w-10 h-10 sm:w-11 sm:h-11 transition-transform duration-300"
          >
            {/* Robot Head Outer Frame */}
            <rect
              x="18"
              y="22"
              width="64"
              height="58"
              rx="18"
              fill="#1e293b"
              stroke="#38bdf8"
              strokeWidth="2.5"
            />

            {/* Glowing Antenna */}
            <line x1="50" y1="22" x2="50" y2="10" stroke="#38bdf8" strokeWidth="2.5" />
            <circle cx="50" cy="8" r="4.5" fill="#38bdf8" className="animate-pulse" />

            {/* Visor Display Screen */}
            <rect
              x="26"
              y="32"
              width="48"
              height="28"
              rx="10"
              fill="#0f172a"
              stroke="#0284c7"
              strokeWidth="1.5"
            />

            {/* Eyes Container */}
            {!isBlinking ? (
              <g className="transition-transform duration-100 ease-out">
                {/* Left Eye */}
                <ellipse
                  cx={39 + eyePos.x}
                  cy={46 + eyePos.y}
                  rx="5.5"
                  ry={robotMood === "happy" ? "3" : "6"}
                  fill="#38bdf8"
                />
                <circle
                  cx={40.5 + eyePos.x}
                  cy={44.5 + eyePos.y}
                  r="2"
                  fill="#ffffff"
                />

                {/* Right Eye */}
                <ellipse
                  cx={61 + eyePos.x}
                  cy={46 + eyePos.y}
                  rx="5.5"
                  ry={robotMood === "happy" ? "3" : "6"}
                  fill="#38bdf8"
                />
                <circle
                  cx={62.5 + eyePos.x}
                  cy={44.5 + eyePos.y}
                  r="2"
                  fill="#ffffff"
                />
              </g>
            ) : (
              /* Blinking Slit Lines */
              <g stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round">
                <line x1="34" y1="46" x2="44" y2="46" />
                <line x1="56" y1="46" x2="66" y2="46" />
              </g>
            )}

            {/* Mouth */}
            {robotMood === "happy" || isOpen ? (
              <path
                d="M 38 68 Q 50 76 62 68"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            ) : (
              <path
                d="M 42 70 Q 50 72 58 70"
                stroke="#64748b"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            )}

            {/* Side Ear Panels */}
            <rect x="13" y="42" width="5" height="18" rx="2" fill="#38bdf8" />
            <rect x="82" y="42" width="5" height="18" rx="2" fill="#38bdf8" />
          </svg>
        </button>
      </div>
    </div>
  );
}
