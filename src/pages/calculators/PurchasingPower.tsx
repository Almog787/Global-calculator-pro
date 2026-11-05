import React, { useMemo } from 'react';
import { useI18n } from '../../contexts/i18n';
import { useUrlState } from '../../hooks/useUrlState';
import { useRecordCalculation } from '../../hooks/useRecordCalculation';
import SEO from '../../components/SEO';
import Breadcrumbs from '../../components/Breadcrumbs';
import FAQ from '../../components/FAQ';
import ShareActions from '../../components/ShareActions';
import EmbedCtaBanner from '../../components/EmbedCtaBanner';
import AnimatedNumber from '../../components/AnimatedNumber';
import RelatedCalculators from '../../components/RelatedCalculators';
import DisclaimerNotice from '../../components/DisclaimerNotice';
import {
  GLOBAL_CITIES_COST_DATA,
  calculatePurchasingPower,
} from '../../lib/math/purchasingPower';
import {
  Globe2,
  Building2,
  TrendingUp,
  TrendingDown,
  ArrowRightLeft,
  Utensils,
  ShoppingBag,
  Home,
  Sparkles,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function PurchasingPower() {
  const { lang } = useI18n();

  // State management via URL params for 100% client-side persistence and sharing
  const [sourceCityId, setSourceCityId] = useUrlState('from', 'tel-aviv');
  const [targetCityId, setTargetCityId] = useUrlState('to', 'singapore');
  const [monthlySalary, setMonthlySalary] = useUrlState('salary', 15000);

  const citiesList = useMemo(() => Object.values(GLOBAL_CITIES_COST_DATA), []);

  const result = useMemo(() => {
    return calculatePurchasingPower({
      sourceCityId,
      targetCityId,
      sourceMonthlySalary: Number(monthlySalary) || 0,
    });
  }, [sourceCityId, targetCityId, monthlySalary]);

  // Record calculation to local history
  useRecordCalculation({
    calculatorId: 'purchasing-power',
    title: {
      en: 'Global Purchasing Power & Relocation Calculator',
      he: 'השוואת כוח קנייה ועלויות מחייה בין ערים',
      es: 'Calculadora de Poder Adquisitivo y Coste de Vida',
      fr: 'Calculateur de Pouvoir d\'Achat et Coût de la Vie',
      ar: 'حاسبة القوة الشرائية وتكلفة المعيشة',
    },
    summary: {
      en: `${result.sourceCity.flag} ${result.sourceCity.name.en} (${result.sourceCity.currencySymbol}${result.sourceSalary.toLocaleString()}) ➔ ${result.targetCity.flag} ${result.targetCity.name.en}`,
      he: `${result.sourceCity.flag} ${result.sourceCity.name.he} (${result.sourceCity.currencySymbol}${result.sourceSalary.toLocaleString()}) ➔ ${result.targetCity.flag} ${result.targetCity.name.he}`,
      es: `${result.sourceCity.flag} ${result.sourceCity.name.es} ➔ ${result.targetCity.flag} ${result.targetCity.name.es}`,
      fr: `${result.sourceCity.flag} ${result.sourceCity.name.fr} ➔ ${result.targetCity.flag} ${result.targetCity.name.fr}`,
      ar: `${result.sourceCity.flag} ${result.sourceCity.name.ar} ➔ ${result.targetCity.flag} ${result.targetCity.name.ar}`,
    },
    result: {
      en: `Equivalent: ${result.targetCity.currencySymbol}${result.equivalentTargetSalary.toLocaleString()} / mo (${result.livingCostDiffPercentage > 0 ? '+' : ''}${result.livingCostDiffPercentage}%)`,
      he: `שכר שווה ערך: ${result.targetCity.currencySymbol}${result.equivalentTargetSalary.toLocaleString()} לחודש (${result.livingCostDiffPercentage > 0 ? '+' : ''}${result.livingCostDiffPercentage}%)`,
      es: `Equivalente: ${result.targetCity.currencySymbol}${result.equivalentTargetSalary.toLocaleString()} / mes`,
      fr: `Équivalent : ${result.targetCity.currencySymbol}${result.equivalentTargetSalary.toLocaleString()} / mois`,
      ar: `المعادل: ${result.targetCity.currencySymbol}${result.equivalentTargetSalary.toLocaleString()} شهرياً`,
    },
    path: `/${lang}/calculators/purchasing-power?from=${sourceCityId}&to=${targetCityId}&salary=${monthlySalary}`,
    badge: `${result.sourceCity.countryCode}➔${result.targetCity.countryCode}`,
  });

  const swapCities = () => {
    setSourceCityId(targetCityId);
    setTargetCityId(sourceCityId);
  };

  const chartData = [
    {
      category: lang === 'he' ? 'מדד מחירים כללי' : 'Consumer Prices',
      [result.sourceCity.name[lang as keyof typeof result.sourceCity.name] || result.sourceCity.name.en]: result.sourceCity.cpiIndex,
      [result.targetCity.name[lang as keyof typeof result.targetCity.name] || result.targetCity.name.en]: result.targetCity.cpiIndex,
    },
    {
      category: lang === 'he' ? 'שכירות ודיור' : 'Rent & Housing',
      [result.sourceCity.name[lang as keyof typeof result.sourceCity.name] || result.sourceCity.name.en]: result.sourceCity.rentIndex,
      [result.targetCity.name[lang as keyof typeof result.targetCity.name] || result.targetCity.name.en]: result.targetCity.rentIndex,
    },
    {
      category: lang === 'he' ? 'מזון וקניות' : 'Groceries',
      [result.sourceCity.name[lang as keyof typeof result.sourceCity.name] || result.sourceCity.name.en]: result.sourceCity.groceriesIndex,
      [result.targetCity.name[lang as keyof typeof result.targetCity.name] || result.targetCity.name.en]: result.targetCity.groceriesIndex,
    },
    {
      category: lang === 'he' ? 'מסעדות ובילוי' : 'Restaurants',
      [result.sourceCity.name[lang as keyof typeof result.sourceCity.name] || result.sourceCity.name.en]: result.sourceCity.restaurantIndex,
      [result.targetCity.name[lang as keyof typeof result.targetCity.name] || result.targetCity.name.en]: result.targetCity.restaurantIndex,
    },
  ];

  const presets = [
    {
      label: lang === 'he' ? '🇮🇱 תל אביב ➔ 🇸🇬 סינגפור' : '🇮🇱 Tel Aviv ➔ 🇸🇬 Singapore',
      action: () => {
        setSourceCityId('tel-aviv');
        setTargetCityId('singapore');
        setMonthlySalary(15000);
      },
    },
    {
      label: lang === 'he' ? '🇬🇧 לונדון ➔ 🇺🇸 ניו יורק' : '🇬🇧 London ➔ 🇺🇸 New York',
      action: () => {
        setSourceCityId('london');
        setTargetCityId('new-york');
        setMonthlySalary(4000);
      },
    },
    {
      label: lang === 'he' ? '🇫🇷 פריז ➔ 🇪🇸 מדריד' : '🇫🇷 Paris ➔ 🇪🇸 Madrid',
      action: () => {
        setSourceCityId('paris');
        setTargetCityId('madrid');
        setMonthlySalary(3200);
      },
    },
    {
      label: lang === 'he' ? '🇺🇸 ניו יורק ➔ 🇦🇪 דובאי' : '🇺🇸 New York ➔ 🇦🇪 Dubai',
      action: () => {
        setSourceCityId('new-york');
        setTargetCityId('dubai');
        setMonthlySalary(7500);
      },
    },
  ];

  const pageTitle =
    lang === 'he'
      ? 'מחשבון כוח קנייה והשוואת עלויות מחייה בין ערים בעולם'
      : 'Global Purchasing Power & Cost of Living Relocation Calculator';

  const pageDesc =
    lang === 'he'
      ? 'השוואת עלויות מחייה ושכר נדרש בין ערים מובילות בעולם: תל אביב, סינגפור, ניו יורק, לונדון, פריז, ברלין, דובאי ועוד. חשב שכר שווה ערך וכוח קנייה ריאלי.'
      : 'Compare cost of living and calculate equivalent net salary required across major global cities: Tel Aviv, Singapore, New York, London, Paris, Berlin, Dubai, Tokyo, and more.';

  const faqItems = [
    {
      question: lang === 'he' ? 'כיצד מחושב השכר שווה הערך בין שני ערים?' : 'How is equivalent salary calculated between two cities?',
      answer: lang === 'he'
        ? 'החישוב מתבסס על המדד המורכב של עלויות המחייה (Consumer Price Index) והשכירות (Rent Index) בכל עיר, בשילוב שער החליפין העדכני בין המטבעות.'
        : 'The equivalent salary is computed using combined cost of living and rent indices (0.65 CPI + 0.35 Rent Index) combined with real-time currency exchange rates.',
    },
    {
      question: lang === 'he' ? 'מהו מדד כוח הקנייה המקומי (Local Purchasing Power)?' : 'What is Local Purchasing Power?',
      answer: lang === 'he'
        ? 'מדד כוח הקנייה משקף כמה מוצרים ושירותים תושב המשתכר שכר ממוצע מקומי יכול לרכוש באותה עיר ביחס לערים אחרות בעולם.'
        : 'Local Purchasing Power measures how many goods and services an average local salary can purchase in that city compared to benchmark global cities.',
    },
    {
      question: lang === 'he' ? 'האם הנתונים והחישובים מבוצעים באופן פרטי בדפדפן?' : 'Is calculation privacy guaranteed?',
      answer: lang === 'he'
        ? 'כן, 100% מהחישובים מבוצעים בצד הלקוח (Client-Side) בלבד. שום נתון שכר או מיקום אינו נשלח לשרת.'
        : 'Yes, 100% of calculations execute locally inside your browser with complete privacy and zero server data storage.',
    },
  ];

  return (
    <div className="w-full space-y-10">
      <SEO
        title={pageTitle}
        description={pageDesc}
        canonicalUrl={`/${lang}/calculators/purchasing-power`}
      />

      <Breadcrumbs
        items={[
          { label: lang === 'he' ? 'כל הכלים' : 'All Calculators', path: `/${lang}/all` },
          { label: lang === 'he' ? 'כוח קנייה ועלויות מחייה' : 'Purchasing Power' },
        ]}
      />

      {/* Hero Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider mb-4">
            <Globe2 className="w-3.5 h-3.5 text-blue-600" />
            <span>{lang === 'he' ? 'כלי השוואה בינלאומי לרילוקיישן ושכר' : 'Global Relocation & Purchasing Power Suite'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 tracking-tight mb-4">
            {pageTitle}
          </h1>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed font-medium">
            {pageDesc}
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-4">
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={p.action}
                className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 border border-stone-200 hover:border-emerald-300 transition-colors cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Panel */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-700" />
            <span>{lang === 'he' ? 'פרטי ההשוואה והשכר' : 'Comparison Inputs'}</span>
          </h2>

          {/* City Selection Grid with Swap Button */}
          <div className="space-y-4">
            {/* Source City */}
            <div>
              <label htmlFor="source-city-select" className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-2">
                {lang === 'he' ? 'עיר מוצא (כיום)' : 'Source City (Current)'}
              </label>
              <select
                id="source-city-select"
                aria-label={lang === 'he' ? 'עיר מוצא' : 'Source City'}
                value={sourceCityId}
                onChange={(e) => setSourceCityId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-sm font-bold text-stone-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all cursor-pointer"
              >
                {citiesList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.flag} {c.name[lang as keyof typeof c.name] || c.name.en} ({c.currencySymbol} {c.currency})
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={swapCities}
                aria-label={lang === 'he' ? 'החלף בין ערים' : 'Swap Cities'}
                className="p-2.5 rounded-full bg-stone-100 hover:bg-emerald-50 text-stone-600 hover:text-emerald-700 border border-stone-200 transition-all cursor-pointer shadow-xs active:scale-95"
                title={lang === 'he' ? 'החלף בין ערים' : 'Swap Cities'}
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Target City */}
            <div>
              <label htmlFor="target-city-select" className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-2">
                {lang === 'he' ? 'עיר יעד (רילוקיישן / השוואה)' : 'Target City (Relocation)'}
              </label>
              <select
                id="target-city-select"
                aria-label={lang === 'he' ? 'עיר יעד' : 'Target City'}
                value={targetCityId}
                onChange={(e) => setTargetCityId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-sm font-bold text-stone-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all cursor-pointer"
              >
                {citiesList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.flag} {c.name[lang as keyof typeof c.name] || c.name.en} ({c.currencySymbol} {c.currency})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Monthly Salary Input */}
          <div>
            <label htmlFor="salary-input" className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-2">
              {lang === 'he' ? `שכר נטו חודשי בעיר המוצא (${result.sourceCity.currencySymbol})` : `Current Net Monthly Salary (${result.sourceCity.currencySymbol})`}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-stone-400 font-bold text-sm">
                {result.sourceCity.currencySymbol}
              </div>
              <input
                id="salary-input"
                type="number"
                min="0"
                step="500"
                value={monthlySalary}
                onChange={(e) => setMonthlySalary(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl ps-10 pe-4 py-3.5 text-base font-bold text-stone-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          <ShareActions
            calculatorTitle={pageTitle}
            calculatorPath="/calculators/purchasing-power"
          />
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Key Result Card */}
          <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  {lang === 'he' ? 'תוצאת שכר שווה ערך' : 'Equivalent Target Salary'}
                </span>
              </div>
              <span className="text-xs font-bold bg-stone-800 px-3 py-1 rounded-full text-stone-300">
                1 {result.sourceCity.currency} ≈ {result.exchangeRateSourceToTarget} {result.targetCity.currency}
              </span>
            </div>

            <div>
              <p className="text-stone-400 text-xs font-semibold mb-1">
                {lang === 'he'
                  ? `כדי לשמור על רמת החיים שלך ב-${result.targetCity.name.he}, תצטרך שכר חודשי של:`
                  : `To maintain the exact same lifestyle in ${result.targetCity.name.en}, you need:`}
              </p>
              <div className="text-3xl sm:text-5xl font-black text-emerald-400 tracking-tight flex items-baseline gap-1.5">
                <span>{result.targetCity.currencySymbol}</span>
                <AnimatedNumber value={result.equivalentTargetSalary} />
                <span className="text-sm font-semibold text-stone-400">
                  {lang === 'he' ? 'חודשי' : '/ month'}
                </span>
              </div>
            </div>

            {/* Living Cost Indicator */}
            <div className="p-4 rounded-2xl bg-stone-800/90 border border-stone-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`p-2.5 rounded-xl ${result.livingCostDiffPercentage > 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {result.livingCostDiffPercentage > 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                </span>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    {result.livingCostDiffPercentage > 0
                      ? (lang === 'he' ? `${result.targetCity.name.he} יקרה יותר ב-${Math.abs(result.livingCostDiffPercentage)}%` : `${result.targetCity.name.en} is ${Math.abs(result.livingCostDiffPercentage)}% more expensive`)
                      : (lang === 'he' ? `${result.targetCity.name.he} זולה יותר ב-${Math.abs(result.livingCostDiffPercentage)}%` : `${result.targetCity.name.en} is ${Math.abs(result.livingCostDiffPercentage)}% cheaper`)}
                  </h3>
                  <p className="text-stone-400 text-xs font-medium">
                    {lang === 'he'
                      ? `כוח הקנייה הריאלי פי ${result.purchasingPowerMultiplier}`
                      : `Purchasing power factor: ${result.purchasingPowerMultiplier}x`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Category Differences Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 text-stone-500 text-xs font-bold uppercase tracking-wider">
                <Home className="w-4 h-4 text-blue-600" />
                <span>{lang === 'he' ? 'שכירות ודיור' : 'Rent & Housing'}</span>
              </div>
              <p className={`text-lg font-black ${result.rentDiffPercentage > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {result.rentDiffPercentage > 0 ? '+' : ''}{result.rentDiffPercentage}%
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 text-stone-500 text-xs font-bold uppercase tracking-wider">
                <ShoppingBag className="w-4 h-4 text-amber-600" />
                <span>{lang === 'he' ? 'מזון וסופר' : 'Groceries'}</span>
              </div>
              <p className={`text-lg font-black ${result.groceriesDiffPercentage > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {result.groceriesDiffPercentage > 0 ? '+' : ''}{result.groceriesDiffPercentage}%
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 text-stone-500 text-xs font-bold uppercase tracking-wider">
                <Utensils className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'he' ? 'מסעדות ובילוי' : 'Restaurants'}</span>
              </div>
              <p className={`text-lg font-black ${result.restaurantDiffPercentage > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {result.restaurantDiffPercentage > 0 ? '+' : ''}{result.restaurantDiffPercentage}%
              </p>
            </div>
          </div>

          {/* Visual Comparison Chart */}
          <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>{lang === 'he' ? 'השוואת מדדי מחירים חזותית' : 'Cost Indices Comparison Chart'}</span>
            </h3>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#6B7280' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      borderColor: '#374151',
                      borderRadius: '12px',
                      color: '#F9FAFB',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar
                    dataKey={result.sourceCity.name[lang as keyof typeof result.sourceCity.name] || result.sourceCity.name.en}
                    fill="#3B82F6"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey={result.targetCity.name[lang as keyof typeof result.targetCity.name] || result.targetCity.name.en}
                    fill="#10B981"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <EmbedCtaBanner calculatorId="purchasing-power" calculatorTitle={pageTitle} />

      {/* Comprehensive Relocation & Cost of Living Guide */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
            {lang === 'he' ? 'מדריך מעשי ומומחיות' : 'Practical Expert Guide'}
          </span>
          <h2 className="text-2xl font-black text-stone-900 tracking-tight">
            {lang === 'he' ? 'מדריך השוואת עלויות מחייה ורילוקיישן' : 'Purchasing Power & Relocation Guide'}
          </h2>
          <p className="text-stone-600 text-sm mt-1">
            {lang === 'he'
              ? 'כיצד לתכנן רילוקיישן נכון, להבין את פערי כוח הקנייה הריאליים ולחשב שכר נטו הוגן במעבר בין מדינות.'
              : 'How to plan a global relocation, evaluate real purchasing power differentials, and negotiate fair international salary packages.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
            <h3 className="font-bold text-base text-stone-900">
              {lang === 'he' ? '1. חישוב עלויות הדיור והשכירות' : '1. Evaluate Housing & Rent Expenses'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
              {lang === 'he'
                ? 'הסעיף המשמעותי ביותר בתקציב המשפחתי הוא דיור. בערים כמו ניו יורק, סינגפור ולונדון, השכירות תופסת נתח מרכזי מההכנסה.'
                : 'Housing is typically the largest component of personal expense. Cities like New York, Singapore, and London have significantly higher rental ratios.'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
            <h3 className="font-bold text-base text-stone-900">
              {lang === 'he' ? '2. מיסוי והפרשות סוציאליות' : '2. Consider Taxes & Benefits'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
              {lang === 'he'
                ? 'בדוק את מדרגות מס ההכנסה המקומיות ואת ההפרשות הפנסיוניות והבריאותיות במדינת היעד (כגון חשבון CPF בסינגפור או הביטוח הלאומי באירופה).'
                : 'Evaluate local income tax brackets and mandatory social security or pension contributions (e.g. CPF in Singapore or social insurance in Europe).'}
            </p>
          </div>
        </div>
      </section>

      <FAQ items={faqItems} />

      <RelatedCalculators currentId="purchasing-power" />

      <DisclaimerNotice />
    </div>
  );
}
