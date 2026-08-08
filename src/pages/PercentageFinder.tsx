import { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import Decimal from 'decimal.js';
import { useI18n } from '../contexts/i18n';
import Breadcrumbs from '../components/Breadcrumbs';
import RelatedCalculators from '../components/RelatedCalculators';
import CopyButton from '../components/CopyButton';
import VisualRatioBar from '../components/VisualRatioBar';
import PresetChips from '../components/PresetChips';

export default function PercentageFinder() {
  const { t, lang } = useI18n();
  const isHebrew = lang === 'he';

  // Active Mode: 'of' | 'isWhat' | 'change' | 'discount' | 'reverse'
  const [activeTab, setActiveTab] = useState<'of' | 'isWhat' | 'change' | 'discount' | 'reverse'>('of');

  // Mode 1: What is X% of Y?
  const [val1A, setVal1A] = useState<number | ''>(20);
  const [val1B, setVal1B] = useState<number | ''>(150);

  const res1 = (() => {
    try {
      const a = new Decimal(val1A || 0);
      const b = new Decimal(val1B || 0);
      return a.div(100).mul(b).toNumber();
    } catch {
      return 0;
    }
  })();

  // Mode 2: X is what % of Y?
  const [val2A, setVal2A] = useState<number | ''>(50);
  const [val2B, setVal2B] = useState<number | ''>(200);

  const res2 = (() => {
    try {
      const b = new Decimal(val2B || 0);
      if (b.isZero()) return 0;
      return new Decimal(val2A || 0).div(b).mul(100).toNumber();
    } catch {
      return 0;
    }
  })();

  // Mode 3: Percentage Change (From X to Y)
  const [val3A, setVal3A] = useState<number | ''>(100);
  const [val3B, setVal3B] = useState<number | ''>(125);

  const res3 = (() => {
    try {
      const a = new Decimal(val3A || 0);
      if (a.isZero()) return 0;
      const b = new Decimal(val3B || 0);
      return b.sub(a).div(a.abs()).mul(100).toNumber();
    } catch {
      return 0;
    }
  })();

  // Mode 4: Discount (Price - Discount% = Sale Price & Saved)
  const [val4Price, setVal4Price] = useState<number | ''>(80);
  const [val4Discount, setVal4Discount] = useState<number | ''>(25);

  const res4Savings = (() => {
    try {
      const p = new Decimal(val4Price || 0);
      const d = new Decimal(val4Discount || 0);
      return p.mul(d).div(100).toNumber();
    } catch {
      return 0;
    }
  })();

  const res4Final = (() => {
    try {
      const p = new Decimal(val4Price || 0);
      return p.sub(res4Savings).toNumber();
    } catch {
      return 0;
    }
  })();

  // Mode 5: Reverse Percentage (X is Y% of what number?)
  const [val5Part, setVal5Part] = useState<number | ''>(40);
  const [val5Perc, setVal5Perc] = useState<number | ''>(20);

  const res5Total = (() => {
    try {
      const p = new Decimal(val5Part || 0);
      const perc = new Decimal(val5Perc || 0);
      if (perc.isZero()) return 0;
      return p.div(perc).mul(100).toNumber();
    } catch {
      return 0;
    }
  })();

  // Analytics event tracking
  useEffect(() => {
    const handler = setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'calculate', {
          event_category: 'Percentage Finder',
          activeTab,
          val1A, val1B,
          val2A, val2B,
          val3A, val3B,
          val4Price, val4Discount,
          val5Part, val5Perc,
        });
      }
    }, 2000);
    return () => clearTimeout(handler);
  }, [activeTab, val1A, val1B, val2A, val2B, val3A, val3B, val4Price, val4Discount, val5Part, val5Perc]);

  const numFormat = new Intl.NumberFormat(lang === 'en' ? 'en-US' : lang, { maximumFractionDigits: 4 });

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqItems = [
    {
      qEn: "How do I calculate what percentage a number is of another?",
      qHe: "איך מחשבים איזה אחוז מהווה מספר אחד ממספר אחר?",
      aEn: "To find what percentage X is of Y, divide X by Y and multiply the result by 100. Formula: (X ÷ Y) × 100 = Percentage. For example, to find what percentage 25 is of 200: (25 ÷ 200) × 100 = 12.5%.",
      aHe: "כדי למצוא איזה אחוז מהווה X מתוך Y, מחלקים את X ב-Y ומכפילים ב-100. נוסחה: (X ÷ Y) × 100 = אחוז. לדוגמה, 25 מתוך 200: (25 ÷ 200) × 100 = 12.5%."
    },
    {
      qEn: "How to find a percentage of a number quickly?",
      qHe: "איך מוצאים אחוז ממספר במהירות?",
      aEn: "Multiply the number by the percentage, then divide by 100 (or convert the percentage to a decimal first). Formula: (Percentage ÷ 100) × Number. For example, 20% of 150 = (20 ÷ 100) × 150 = 0.20 × 150 = 30.",
      aHe: "מכפילים את המספר באחוז ומחלקים ב-100. נוסחה: (אחוז ÷ 100) × מספר. לדוגמה, 20% מתוך 150 = 0.20 × 150 = 30."
    },
    {
      qEn: "What is the formula for percentage increase or decrease?",
      qHe: "מהי הנוסחה לחישוב אחוז שינוי (עלייה/ירידה)?",
      aEn: "Subtract the original value from the new value, divide by the absolute original value, and multiply by 100. Formula: ((New Value - Original Value) ÷ Original Value) × 100. A positive result indicates a percentage increase, while a negative result indicates a decrease.",
      aHe: "מחסרים את הערך המקורי מהערך החדש, מחלקים בערך המקורי ומכפילים ב-100. נוסחה: ((ערך חדש - ערך מקורי) ÷ ערך מקורי) × 100."
    },
    {
      qEn: "How do you calculate percentage off (discount price)?",
      qHe: "איך מחשבים הנחה באחוזים ומחיר סופי?",
      aEn: "To calculate a discount: 1) Find the savings by multiplying the original price by the discount percentage divided by 100. 2) Subtract the savings from the original price to get the final sale price. Example: 25% off $80 = $20 saved, final price = $60.",
      aHe: "כדי לחשב הנחה: 1) מכפילים את המחיר המקורי באחוז ההנחה ומחלקים ב-100. 2) מחסרים את סכום ההנחה מהמחיר המקורי. לדוגמה: 25% הנחה על 80 ₪ = 20 ₪ חיסכון, מחיר סופי = 60 ₪."
    },
    {
      qEn: "What is reverse percentage and how do you calculate it?",
      qHe: "מהו חישוב אחוז הפוך ואיך מחשבים אותו?",
      aEn: "Reverse percentage calculates the original 100% total value when you only know a partial value and its corresponding percentage. Formula: Original Total = (Partial Value ÷ Percentage) × 100.",
      aHe: "חישוב אחוז הפוך מוצא את הערך המקורי (100%) כשמכירים רק חלק מהסכום והאחוז שהוא מייצג. נוסחה: סכום מקורי = (ערך חלקי ÷ אחוז) × 100."
    }
  ];

  // Schema.org JSON-LD structured data for SEO
  const jsonLdData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": "GlobalCalc Pro Percentage Finder & Calculator",
        "url": "https://globalcalcpro.com/percentage-finder",
        "applicationCategory": "EducationalApplication",
        "operatingSystem": "All",
        "browserRequirements": "Requires JavaScript",
        "description": "Free online percentage calculator. Learn how to find a percentage of a number, calculate percentage change, discount sale price, and reverse percentage easily with step-by-step formulas.",
      },
      {
        "@type": "HowTo",
        "name": "How to Find a Percentage of a Number",
        "description": "Learn how to find a percentage of any number step-by-step using a simple formula.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Convert Percentage to Decimal",
            "text": "Divide the percentage rate by 100. For example, 20% becomes 0.20."
          },
          {
            "@type": "HowToStep",
            "name": "Multiply by Total Value",
            "text": "Multiply the decimal value by the total number. For example, 0.20 × 150."
          },
          {
            "@type": "HowToStep",
            "name": "Get Final Result",
            "text": "The output is the calculated percentage value. In this example, 20% of 150 equals 30."
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqItems.map(item => ({
          "@type": "Question",
          "name": item.qEn,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.aEn
          }
        }))
      }
    ]
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-2">
      <Breadcrumbs items={[{ label: t.catAll || 'Library', path: `/${lang}/all` }, { label: t.percFinderTitle }]} />

      <SEO
        title={isHebrew ? 'מחשבון אחוזים - איך לחשב אחוזים בקלות' : 'Percentage Calculator - How to Find a Percentage Easily'}
        description={
            isHebrew
              ? 'מחשבון אחוזים חינמי ומדויק. למדו איך לחשב אחוזים, שינוי באחוזים, הנחות ומחיר סופי עם נוסחאות והסברים שלב אחר שלב.'
              : 'Free online percentage calculator. Calculate percentage of a number, percentage change, discount prices, and learn how to find percentages with formulas and examples.'
          }
        canonicalUrl={`/${lang}/percentage-finder`}
        structuredData={jsonLdData}
      />

      {/* Main Interactive Tool Container */}
      <article className="w-full bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-xs border border-stone-200/80 mb-10">
        
        {/* Header Title & Intro */}
        <div className="mb-6 border-b border-stone-100 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-headline font-bold text-stone-900 tracking-tight">
                {isHebrew ? 'מחשבון אחוזים מתקדם' : 'Percentage Calculator'}
              </h1>
              <p className="text-stone-500 text-sm sm:text-base mt-1">
                {isHebrew
                  ? 'כלי מהיר ונוח לחישוב אחוז מתוך מספר, אחוז שינוי, הנחות, וחישוב אחוז הפוך.'
                  : 'Fast and ergonomic tool to calculate percentages, percentage change, sales discounts, and reverse percentages.'}
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <span className="material-symbols-outlined text-[14px] mr-1">bolt</span>
                Instant Calculation
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs for Calculator Modes */}
        <div className="flex flex-wrap gap-2 mb-6 p-1.5 bg-stone-100/80 rounded-xl border border-stone-200/60">
          <button
            type="button"
            onClick={() => setActiveTab('of')}
            className={`flex-1 min-w-[130px] py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'of'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            {isHebrew ? 'X% מתוך Y' : 'X% of Y'}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('isWhat')}
            className={`flex-1 min-w-[130px] py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'isWhat'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            {isHebrew ? 'X איזה % מ-Y' : 'X is what % of Y'}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('change')}
            className={`flex-1 min-w-[130px] py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'change'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            {isHebrew ? 'אחוז שינוי' : '% Change (Increase/Decrease)'}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('discount')}
            className={`flex-1 min-w-[130px] py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'discount'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            {isHebrew ? 'הנחה ומחיר סופי' : 'Discount & Sale Price'}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reverse')}
            className={`flex-1 min-w-[130px] py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'reverse'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            {isHebrew ? 'אחוז הפוך (100%)' : 'Reverse Percentage'}
          </button>
        </div>

        {/* ACTIVE TAB 1: What is X% of Y? */}
        {activeTab === 'of' && (
          <div className="space-y-6 bg-stone-50/70 p-4 sm:p-6 rounded-2xl border border-stone-200/60 transition-all">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Input X */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                    {isHebrew ? 'אחוז (X%)' : 'Percentage (X%)'}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={val1A}
                      onChange={(e) => setVal1A(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-lg font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-2xs"
                      placeholder="e.g. 20"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-600 font-bold text-sm">
                      %
                    </span>
                  </div>
                  <PresetChips
                    className="mt-2"
                    presets={[5, 10, 15, 20, 25, 50, 75]}
                    selectedValue={typeof val1A === 'number' ? val1A : undefined}
                    onSelect={(v) => setVal1A(v)}
                  />
                </div>

                {/* Input Y */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                    {isHebrew ? 'מתוך המספר (Y)' : 'Of Total Number (Y)'}
                  </label>
                  <input
                    type="number"
                    value={val1B}
                    onChange={(e) => setVal1B(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-lg font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-2xs"
                    placeholder="e.g. 150"
                  />
                  <PresetChips
                    className="mt-2"
                    presets={[50, 100, 200, 500, 1000]}
                    selectedValue={typeof val1B === 'number' ? val1B : undefined}
                    onSelect={(v) => setVal1B(v)}
                    unit=""
                  />
                </div>
              </div>

              {/* Output Result Card */}
              <div className="lg:w-72 bg-blue-600 text-white rounded-xl p-4 flex flex-col justify-between shadow-xs border border-blue-700">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
                    {isHebrew ? 'תוצאה מחושבת' : 'Calculated Result'}
                  </span>
                  <CopyButton
                    textToCopy={res1.toString()}
                    className="bg-blue-500/80 text-white border-blue-400 hover:bg-white hover:text-blue-700"
                  />
                </div>
                <div className="text-3xl sm:text-4xl font-headline font-extrabold my-2 tracking-tight">
                  {!isNaN(res1) ? numFormat.format(res1) : '0'}
                </div>
                <div className="text-xs text-blue-100 border-t border-blue-500/60 pt-2 font-mono">
                  ({val1A || 0} ÷ 100) × {val1B || 0} = {res1}
                </div>
              </div>
            </div>

            {/* Visual Bar Indicator */}
            <VisualRatioBar
              percentage={typeof val1A === 'number' ? val1A : 0}
              label={isHebrew ? `יחס ויזואלי של ${val1A || 0}% מתוך ${val1B || 0}` : `Visual proportion of ${val1A || 0}%`}
            />
          </div>
        )}

        {/* ACTIVE TAB 2: X is what % of Y? */}
        {activeTab === 'isWhat' && (
          <div className="space-y-6 bg-stone-50/70 p-4 sm:p-6 rounded-2xl border border-stone-200/60 transition-all">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Input X */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                    {isHebrew ? 'חלק (X)' : 'Part Value (X)'}
                  </label>
                  <input
                    type="number"
                    value={val2A}
                    onChange={(e) => setVal2A(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-lg font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-2xs"
                    placeholder="e.g. 50"
                  />
                </div>

                {/* Input Y */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                    {isHebrew ? 'סך הכל (Y)' : 'Total Value (Y)'}
                  </label>
                  <input
                    type="number"
                    value={val2B}
                    onChange={(e) => setVal2B(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-lg font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-2xs"
                    placeholder="e.g. 200"
                  />
                </div>
              </div>

              {/* Swap Button */}
              <div className="self-center">
                <button
                  type="button"
                  onClick={() => {
                    const temp = val2A;
                    setVal2A(val2B);
                    setVal2B(temp);
                  }}
                  className="px-3 py-2 bg-stone-200 text-stone-700 hover:bg-stone-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                  title="Swap values"
                >
                  <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
                  <span>{isHebrew ? 'החלף' : 'Swap'}</span>
                </button>
              </div>

              {/* Output Result Card */}
              <div className="lg:w-72 bg-emerald-700 text-white rounded-xl p-4 flex flex-col justify-between shadow-xs border border-emerald-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
                    {isHebrew ? 'אחוז המייצג' : 'Calculated Percentage'}
                  </span>
                  <CopyButton
                    textToCopy={`${numFormat.format(res2)}%`}
                    className="bg-emerald-600 text-white border-emerald-500 hover:bg-white hover:text-emerald-800"
                  />
                </div>
                <div className="text-3xl sm:text-4xl font-headline font-extrabold my-2 tracking-tight" dir="ltr">
                  {!isNaN(res2) ? numFormat.format(res2) : '0'}%
                </div>
                <div className="text-xs text-emerald-100 border-t border-emerald-600/60 pt-2 font-mono" dir="ltr">
                  ({val2A || 0} ÷ {val2B || 0}) × 100 = {numFormat.format(res2)}%
                </div>
              </div>
            </div>

            {/* Visual Ratio Bar */}
            <VisualRatioBar
              percentage={res2}
              label={isHebrew ? `יחס של ${val2A || 0} מתוך ${val2B || 0}` : `Proportion of ${val2A || 0} out of ${val2B || 0}`}
            />
          </div>
        )}

        {/* ACTIVE TAB 3: Percentage Change (Increase / Decrease) */}
        {activeTab === 'change' && (
          <div className="space-y-6 bg-stone-50/70 p-4 sm:p-6 rounded-2xl border border-stone-200/60 transition-all">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Input A */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                    {isHebrew ? 'ערך מקורי (מ-)' : 'Original Value (From)'}
                  </label>
                  <input
                    type="number"
                    value={val3A}
                    onChange={(e) => setVal3A(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-lg font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-2xs"
                    placeholder="e.g. 100"
                  />
                </div>

                {/* Input B */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                    {isHebrew ? 'ערך חדש (ל-)' : 'New Value (To)'}
                  </label>
                  <input
                    type="number"
                    value={val3B}
                    onChange={(e) => setVal3B(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-lg font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-2xs"
                    placeholder="e.g. 125"
                  />
                </div>
              </div>

              {/* Output Result Card */}
              <div
                className={`lg:w-72 text-white rounded-xl p-4 flex flex-col justify-between shadow-xs border transition-colors ${
                  res3 > 0
                    ? 'bg-emerald-600 border-emerald-700'
                    : res3 < 0
                    ? 'bg-rose-600 border-rose-700'
                    : 'bg-stone-700 border-stone-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-90">
                    {res3 > 0
                      ? isHebrew ? 'עלייה באחוזים' : 'Percentage Increase'
                      : res3 < 0
                      ? isHebrew ? 'ירידה באחוזים' : 'Percentage Decrease'
                      : isHebrew ? 'ללא שינוי' : 'No Change'}
                  </span>
                  <CopyButton
                    textToCopy={`${res3 > 0 ? '+' : ''}${numFormat.format(res3)}%`}
                    className="bg-white/20 text-white border-white/30 hover:bg-white hover:text-stone-900"
                  />
                </div>
                <div className="text-3xl sm:text-4xl font-headline font-extrabold my-2 tracking-tight" dir="ltr">
                  {!isNaN(res3) ? (res3 > 0 ? '+' : '') + numFormat.format(res3) : '0'}%
                </div>
                <div className="text-xs opacity-90 border-t border-white/20 pt-2 font-mono" dir="ltr">
                  (({val3B || 0} - {val3A || 0}) ÷ {val3A || 0}) × 100
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ACTIVE TAB 4: Discount & Sale Price */}
        {activeTab === 'discount' && (
          <div className="space-y-6 bg-stone-50/70 p-4 sm:p-6 rounded-2xl border border-stone-200/60 transition-all">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Original Price */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                    {isHebrew ? 'מחיר מקורי' : 'Original Price ($)'}
                  </label>
                  <input
                    type="number"
                    value={val4Price}
                    onChange={(e) => setVal4Price(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-lg font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-2xs"
                    placeholder="e.g. 80"
                  />
                </div>

                {/* Discount Percentage */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                    {isHebrew ? 'אחוז הנחה' : 'Discount Percentage (%)'}
                  </label>
                  <input
                    type="number"
                    value={val4Discount}
                    onChange={(e) => setVal4Discount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-lg font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-2xs"
                    placeholder="e.g. 25"
                  />
                  <PresetChips
                    className="mt-2"
                    presets={[10, 15, 20, 25, 30, 50, 70]}
                    selectedValue={typeof val4Discount === 'number' ? val4Discount : undefined}
                    onSelect={(v) => setVal4Discount(v)}
                  />
                </div>
              </div>

              {/* Output Result Card */}
              <div className="lg:w-80 bg-stone-900 text-white rounded-xl p-4 flex flex-col justify-between shadow-xs border border-stone-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    {isHebrew ? 'מחיר לאחר הנחה' : 'Final Sale Price'}
                  </span>
                  <CopyButton
                    textToCopy={res4Final.toString()}
                    className="bg-stone-800 text-white border-stone-700 hover:bg-white hover:text-stone-900"
                  />
                </div>
                <div className="text-3xl sm:text-4xl font-headline font-extrabold my-2 text-emerald-400 tracking-tight">
                  {!isNaN(res4Final) ? numFormat.format(res4Final) : '0'}
                </div>
                <div className="text-xs text-stone-300 border-t border-stone-800 pt-2 flex justify-between items-center">
                  <span>{isHebrew ? 'סך חיסכון:' : 'You Save:'}</span>
                  <span className="font-bold text-amber-400">{numFormat.format(res4Savings)} ({val4Discount || 0}%)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ACTIVE TAB 5: Reverse Percentage */}
        {activeTab === 'reverse' && (
          <div className="space-y-6 bg-stone-50/70 p-4 sm:p-6 rounded-2xl border border-stone-200/60 transition-all">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Part Value */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                    {isHebrew ? 'הסכום החלקי (X)' : 'Partial Amount (X)'}
                  </label>
                  <input
                    type="number"
                    value={val5Part}
                    onChange={(e) => setVal5Part(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-lg font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-2xs"
                    placeholder="e.g. 40"
                  />
                </div>

                {/* What % it represents */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                    {isHebrew ? 'כמה % הוא מהווה?' : 'Which % does it represent?'}
                  </label>
                  <input
                    type="number"
                    value={val5Perc}
                    onChange={(e) => setVal5Perc(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-lg font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-2xs"
                    placeholder="e.g. 20"
                  />
                </div>
              </div>

              {/* Output Result Card */}
              <div className="lg:w-72 bg-indigo-700 text-white rounded-xl p-4 flex flex-col justify-between shadow-xs border border-indigo-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                    {isHebrew ? 'הסכום המלא (100%)' : 'Original Total (100%)'}
                  </span>
                  <CopyButton
                    textToCopy={res5Total.toString()}
                    className="bg-indigo-600 text-white border-indigo-500 hover:bg-white hover:text-indigo-900"
                  />
                </div>
                <div className="text-3xl sm:text-4xl font-headline font-extrabold my-2 tracking-tight">
                  {!isNaN(res5Total) ? numFormat.format(res5Total) : '0'}
                </div>
                <div className="text-xs text-indigo-200 border-t border-indigo-600/60 pt-2 font-mono">
                  ({val5Part || 0} ÷ {val5Perc || 0}) × 100 = {numFormat.format(res5Total)}
                </div>
              </div>
            </div>
          </div>
        )}
      </article>

      {/* SEO ARTICLE & EDUCATIONAL GUIDE: "How to Find a Percentage" */}
      <section className="w-full bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-xs border border-stone-200/80 mb-10 space-y-8">
        <div className="border-b border-stone-200 pb-6">
          <h2 className="text-2xl sm:text-3xl font-headline font-bold text-stone-900 tracking-tight mb-3">
            {isHebrew ? 'איך לחשב אחוזים - מדריך מקיף ונוסחאות' : 'How to Find a Percentage – Step-by-Step Guide & Formulas'}
          </h2>
          <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
            {isHebrew
              ? 'חישוב אחוזים הוא אחד הכלים המתמטיים השימושיים ביותר בחיי היומיום – החל מחישוב הנחות בקניות, דרך חישוב טיפ במסעדה ועד לבדיקת תשואות השקעה וריבית. להלן ההסברים והנוסחאות המלאות.'
              : 'Calculating percentages is an essential daily math skill. Whether you need to figure out sales discounts, tax rates, test scores, or financial growth, this step-by-step guide explains exactly how to find a percentage with practical formulas.'}
          </p>
        </div>

        {/* Section 1: How to find percentage of a number */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold">1</span>
            {isHebrew ? 'איך לחשב אחוז מתוך מספר?' : 'How to Find a Percentage of a Number'}
          </h3>
          <p className="text-stone-600 text-sm leading-relaxed">
            {isHebrew
              ? 'כדי למצוא אחוז מתוך מספר מסוים, ממירים את האחוז לשבר עשרוני (על ידי חלוקה ב-100) ואז מכפילים במספר השלם.'
              : 'To find a percentage of any number, divide the percentage by 100 to convert it into a decimal rate, then multiply it by the total number.'}
          </p>
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 font-mono text-xs sm:text-sm text-stone-800">
            <strong>Formula:</strong> Value = (Percentage ÷ 100) × Total
          </div>
          <p className="text-xs text-stone-500 italic">
            {isHebrew
              ? 'דוגמה: כמה זה 20% מתוך 150? (20 ÷ 100) × 150 = 0.20 × 150 = 30.'
              : 'Example: What is 20% of 150? (20 ÷ 100) × 150 = 0.20 × 150 = 30.'}
          </p>
        </div>

        {/* Section 2: How to find what percentage one number is of another */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold">2</span>
            {isHebrew ? 'איך למצוא איזה אחוז מהווה מספר אחד ממספר אחר?' : 'How to Calculate What Percentage One Number is of Another'}
          </h3>
          <p className="text-stone-600 text-sm leading-relaxed">
            {isHebrew
              ? 'כאשר יש לכם חלק וסך הכל, וברצונכם לדעת איזה אחוז החלק מהווה, מחלקים את החלק בסך הכל ומכפילים ב-100.'
              : 'When you know the partial amount and the total, divide the part by the total and multiply by 100 to convert to a percentage.'}
          </p>
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 font-mono text-xs sm:text-sm text-stone-800">
            <strong>Formula:</strong> Percentage = (Part ÷ Total) × 100
          </div>
          <p className="text-xs text-stone-500 italic">
            {isHebrew
              ? 'דוגמה: קיבלתם 45 תשובות נכונות מתוך 60 במבחן. איזה אחוז זה? (45 ÷ 60) × 100 = 0.75 × 100 = 75%.'
              : 'Example: You scored 45 out of 60 on an exam. (45 ÷ 60) × 100 = 0.75 × 100 = 75%.'}
          </p>
        </div>

        {/* Section 3: Percentage Change */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-bold">3</span>
            {isHebrew ? 'איך לחשב אחוז שינוי (עלייה או ירידה באחוזים)?' : 'How to Calculate Percentage Increase or Decrease'}
          </h3>
          <p className="text-stone-600 text-sm leading-relaxed">
            {isHebrew
              ? 'חישוב אחוז שינוי בודק את ההפרש היחסי בין ערך ישן לערך חדש.'
              : 'Percentage change measures the relative difference between an original starting value and a new final value.'}
          </p>
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 font-mono text-xs sm:text-sm text-stone-800">
            <strong>Formula:</strong> % Change = ((New Value - Original Value) ÷ Original Value) × 100
          </div>
          <p className="text-xs text-stone-500 italic">
            {isHebrew
              ? 'דוגמה: מחירו של מוצר עלה מ-100 ₪ ל-125 ₪. ((125 - 100) ÷ 100) × 100 = 25% עלייה.'
              : 'Example: An item price goes from $100 to $125. ((125 - 100) ÷ 100) × 100 = +25% increase.'}
          </p>
        </div>

        {/* Section 4: Quick Percentage Cheat Sheet Table */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xl font-bold text-stone-900">
            {isHebrew ? 'טבלת ייחוס מהירה לחישובי אחוזים נפוצים' : 'Quick Percentage Reference Cheat Sheet'}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse border border-stone-200">
              <thead>
                <tr className="bg-stone-100 text-stone-700 font-bold">
                  <th className="p-2.5 border border-stone-200">Total</th>
                  <th className="p-2.5 border border-stone-200">10%</th>
                  <th className="p-2.5 border border-stone-200">15%</th>
                  <th className="p-2.5 border border-stone-200">20%</th>
                  <th className="p-2.5 border border-stone-200">25%</th>
                  <th className="p-2.5 border border-stone-200">50%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 font-mono text-stone-800">
                <tr>
                  <td className="p-2.5 border border-stone-200 font-bold">$10</td>
                  <td className="p-2.5 border border-stone-200">$1.00</td>
                  <td className="p-2.5 border border-stone-200">$1.50</td>
                  <td className="p-2.5 border border-stone-200">$2.00</td>
                  <td className="p-2.5 border border-stone-200">$2.50</td>
                  <td className="p-2.5 border border-stone-200">$5.00</td>
                </tr>
                <tr className="bg-stone-50/50">
                  <td className="p-2.5 border border-stone-200 font-bold">$50</td>
                  <td className="p-2.5 border border-stone-200">$5.00</td>
                  <td className="p-2.5 border border-stone-200">$7.50</td>
                  <td className="p-2.5 border border-stone-200">$10.00</td>
                  <td className="p-2.5 border border-stone-200">$12.50</td>
                  <td className="p-2.5 border border-stone-200">$25.00</td>
                </tr>
                <tr>
                  <td className="p-2.5 border border-stone-200 font-bold">$100</td>
                  <td className="p-2.5 border border-stone-200">$10.00</td>
                  <td className="p-2.5 border border-stone-200">$15.00</td>
                  <td className="p-2.5 border border-stone-200">$20.00</td>
                  <td className="p-2.5 border border-stone-200">$25.00</td>
                  <td className="p-2.5 border border-stone-200">$50.00</td>
                </tr>
                <tr className="bg-stone-50/50">
                  <td className="p-2.5 border border-stone-200 font-bold">$500</td>
                  <td className="p-2.5 border border-stone-200">$50.00</td>
                  <td className="p-2.5 border border-stone-200">$75.00</td>
                  <td className="p-2.5 border border-stone-200">$100.00</td>
                  <td className="p-2.5 border border-stone-200">$125.00</td>
                  <td className="p-2.5 border border-stone-200">$250.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 5: FAQ Accordion Section */}
        <div className="space-y-4 pt-4 border-t border-stone-200">
          <h3 className="text-xl font-bold text-stone-900">
            {isHebrew ? 'שאלות נפוצות (FAQ)' : 'Frequently Asked Questions (FAQ)'}
          </h3>
          <div className="space-y-2">
            {faqItems.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="border border-stone-200 rounded-xl overflow-hidden transition-all">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 text-left flex justify-between items-center bg-stone-50 hover:bg-stone-100 transition-colors font-bold text-sm sm:text-base text-stone-900 cursor-pointer"
                  >
                    <span>{isHebrew ? item.qHe : item.qEn}</span>
                    <span className="material-symbols-outlined text-stone-400">
                      {isOpen ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="p-4 bg-white text-stone-600 text-xs sm:text-sm leading-relaxed border-t border-stone-100">
                      {isHebrew ? item.aHe : item.aEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <RelatedCalculators currentId="percentage" />
    </div>
  );
}
