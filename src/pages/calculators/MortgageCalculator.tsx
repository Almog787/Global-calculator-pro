import { useDeferredValue, useEffect, useMemo } from 'react';
import { useUrlState } from '../../hooks/useUrlState';
import SEO from '../../components/SEO';
import FAQ from '../../components/FAQ';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useI18n } from '../../contexts/i18n';
import Breadcrumbs from '../../components/Breadcrumbs';
import RelatedCalculators from '../../components/RelatedCalculators';
import CalculatorGuide from '../../components/CalculatorGuide';
import ShareActions from '../../components/ShareActions';
import ScenarioPresets from '../../components/ScenarioPresets';
import ScenarioComparator, { ComparisonMetric } from '../../components/ScenarioComparator';
import { calculateMortgage, calculateReverseMortgage, compareMortgages } from '../../lib/math/finance';
import { useRecordCalculation } from '../../hooks/useRecordCalculation';
import { MORTGAGE_REGIMES, MortgageRegimeId } from '../../lib/regimes/mortgageRegimes';
import PopularScenarios from '../../components/PopularScenarios';
import { POPULAR_MORTGAGE_SCENARIOS, getProgrammaticFaqs } from '../../lib/seo/programmaticScenarios';


ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

export default function MortgageCalculator() {
  const { t, lang, guides } = useI18n();
  const guide = guides['mortgage'] || { guideTitle: 'Guide & Formulas', guideDesc: 'Comprehensive calculation breakdown and FAQs.', faq: [] };
  
  const [mode, setMode] = useUrlState<'standard' | 'reverse' | 'compare'>('mode', 'standard');
  const [regimeId, setRegimeId] = useUrlState<MortgageRegimeId>('regime', lang === 'he' ? 'IL' : 'US');
  const [principal, setPrincipal] = useUrlState('principal', 300000);
  const [targetPayment, setTargetPayment] = useUrlState('targetPayment', 1900);
  const [rate, setRate] = useUrlState('rate', 6.5);
  const [years, setYears] = useUrlState('years', 30);

  const currentRegime = MORTGAGE_REGIMES[regimeId] || MORTGAGE_REGIMES.IL;

  // Scenario B parameters for comparison
  const [principalB, setPrincipalB] = useUrlState('principalB', 300000);
  const [rateB, setRateB] = useUrlState('rateB', 5.75);
  const [yearsB, setYearsB] = useUrlState('yearsB', 20);

  const standardResult = useMemo(() => {
    return calculateMortgage(principal, rate, years);
  }, [principal, rate, years]);

  const reverseResult = useMemo(() => {
    return calculateReverseMortgage(targetPayment, rate, years);
  }, [targetPayment, rate, years]);

  const comparisonResult = useMemo(() => {
    return compareMortgages(
      { principal, rate, years },
      { principal: principalB, rate: rateB, years: yearsB }
    );
  }, [principal, rate, years, principalB, rateB, yearsB]);

  const activeMonthlyPayment = mode === 'standard' ? standardResult.monthlyPayment : targetPayment;
  const activePrincipal = mode === 'standard' ? principal : reverseResult.maxLoanAmount;
  const activeTotalInterest = mode === 'standard' ? standardResult.totalInterest : reverseResult.totalInterest;

  useEffect(() => {
    const handler = setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'calculate', {
          event_category: 'Mortgage Calculator',
          mode,
          principal: activePrincipal,
          rate,
          years
        });
      }
    }, 2000);
    return () => clearTimeout(handler);
  }, [mode, activePrincipal, rate, years]);

  const defaultCurrency = currentRegime?.currency || (lang === 'he' ? 'ILS' : lang === 'fr' || lang === 'es' ? 'EUR' : 'USD');
  const currencyFormat = new Intl.NumberFormat(lang === 'en' ? 'en-US' : lang, {
    style: 'currency',
    currency: defaultCurrency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  // Automatically record calculation to recent history drawer
  useRecordCalculation(
    mode !== 'compare'
      ? {
          calculatorId: 'mortgage',
          title: {
            en: 'Mortgage Calculator',
            he: 'מחשבון משכנתא',
            es: 'Calculadora de Hipotecas',
            fr: 'Prêt Immobilier',
            ar: 'حاسبة الرهن العقاري',
          },
          summary: {
            en: `${currencyFormat.format(activePrincipal)} at ${rate}% for ${years} yrs (${currentRegime.countryCode})`,
            he: `${currencyFormat.format(activePrincipal)} בריבית ${rate}% ל-${years} שנה (${currentRegime.countryCode})`,
            es: `${currencyFormat.format(activePrincipal)} al ${rate}% por ${years} años`,
            fr: `${currencyFormat.format(activePrincipal)} à ${rate}% sur ${years} ans`,
            ar: `${currencyFormat.format(activePrincipal)} بفائدة ${rate}% لـ ${years} سنة`,
          },
          result: {
            en: `Payment: ${currencyFormat.format(activeMonthlyPayment)} / mo`,
            he: `החזר חודשי: ${currencyFormat.format(activeMonthlyPayment)}`,
            es: `Cuota: ${currencyFormat.format(activeMonthlyPayment)} / mes`,
            fr: `Mensualité : ${currencyFormat.format(activeMonthlyPayment)} / mois`,
            ar: `القسط: ${currencyFormat.format(activeMonthlyPayment)} شهריاً`,
          },
          path: `/${lang}/mortgage-calculator?mode=${mode}&principal=${activePrincipal}&rate=${rate}&years=${years}&regime=${regimeId}`,
          badge: `${years}Y @ ${rate}%`,
        }
      : null
  );

  const chartData = {
    labels: [t.loanAmount, t.totalInterest],
    datasets: [
      {
        data: [activePrincipal, activeTotalInterest],
        backgroundColor: ['#2563eb', '#f59e0b'],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    animation: false as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.label}: ${currencyFormat.format(context.raw || 0)}`,
        },
      },
    },
    cutout: '65%',
  };

  const deferredChartData = useDeferredValue(chartData);

  const presets = [
    {
      label: { en: 'First Home ($300k)', he: 'דירה ראשונה (300,000 $ / ₪)', es: 'Primera Vivienda ($300k)', fr: 'Premier Logement (300k €)', ar: 'المسكن الأول (300 ألف)' },
      description: { en: '30 Years @ 6.5%', he: '30 שנה בריבית 6.5%', es: '30 años al 6.5%', fr: '30 ans à 6,5%', ar: '30 سنة بفائدة 6.5%' },
      values: { mode: 'standard', principal: 300000, rate: 6.5, years: 30 },
      badge: '30Y'
    },
    {
      label: { en: 'Family Upgrade ($600k)', he: 'שדרוג משפחתי (600,000 $ / ₪)', es: 'Vivienda Familiar ($600k)', fr: 'Logement Familial (600k €)', ar: 'ترقية عائلية (600 ألف)' },
      description: { en: '25 Years @ 6.0%', he: '25 שנה בריבית 6.0%', es: '25 años al 6.0%', fr: '25 ans à 6,0%', ar: '25 سنة بفائدة 6.0%' },
      values: { mode: 'standard', principal: 600000, rate: 6.0, years: 25 },
      badge: '25Y'
    },
    {
      label: { en: 'Fast Payoff 15Y ($250k)', he: 'סילוק מואץ ל-15 שנה', es: 'Pago Rápido 15 Años', fr: 'Remboursement 15 Ans', ar: 'سداد سريع 15 سنة' },
      description: { en: '15 Years @ 5.5%', he: '15 שנה בריבית 5.5%', es: '15 años al 5.5%', fr: '15 ans à 5,5%', ar: '15 سنة بفائدة 5.5%' },
      values: { mode: 'standard', principal: 250000, rate: 5.5, years: 15 },
      badge: '15Y'
    },
    {
      label: { en: 'Target $2,500/mo Budget', he: 'תקציב החזר 2,500 לחודש', es: 'Presupuesto $2,500/mes', fr: 'Budget 2 500 €/mois', ar: 'ميزانية 2,500 شهرياً' },
      description: { en: 'Reverse calculate max loan', he: 'חישוב הלוואה מקסימלית (הפוך)', es: 'Capacidad de préstamo', fr: 'Capacité d\'emprunt', ar: 'أقصى قرض متاح' },
      values: { mode: 'reverse', targetPayment: 2500, rate: 6.5, years: 30 },
      badge: 'REVERSE'
    }
  ];

  const modeLabels = {
    en: { standard: 'Calculate Monthly Payment', reverse: 'Reverse: Borrowing Power / Max Loan', compare: 'Side-by-Side Comparison' },
    he: { standard: 'חישוב החזר חודשי (רגיל)', reverse: 'חישוב הפוך: כושר קנייה והלוואה', compare: 'השוואת תרחישים ומסלולים' },
    es: { standard: 'Calcular Pago Mensual', reverse: 'Cálculo Inverso: Capacidad', compare: 'Comparar Escenarios' },
    fr: { standard: 'Calculer la Mensualité', reverse: 'Calcul Inverse : Capacité', compare: 'Comparer les Scénarios' },
    ar: { standard: 'حساب القسط الشهري', reverse: 'حساب عكسي: القدرة الشرائية', compare: 'مقارنة السيناريوهات' },
  }[lang] || { standard: 'Calculate Monthly Payment', reverse: 'Reverse: Borrowing Power / Max Loan', compare: 'Side-by-Side Comparison' };

  const mortgageComparisonReportText = `
📊 GlobalCalc Pro - ${lang === 'he' ? 'דוח השוואת מסלולי משכנתא' : 'Mortgage Scenario Comparison Report'}
--------------------------------------------------
${lang === 'he' ? 'מסלול א׳ (נוכחי)' : 'Scenario A (Baseline)'}:
• ${t.loanAmount}: ${currencyFormat.format(principal)}
• ${t.interestRate}: ${rate}%
• ${t.loanTerm}: ${years} ${lang === 'he' ? 'שנים' : 'Years'}
→ ${t.monthlyPayment}: ${currencyFormat.format(comparisonResult.scenarioA.monthlyPayment)}
→ ${t.totalInterest}: ${currencyFormat.format(comparisonResult.scenarioA.totalInterest)}
→ ${lang === 'he' ? 'סה״כ תשלומים' : 'Total Paid'}: ${currencyFormat.format(comparisonResult.scenarioA.totalPaid)}

${lang === 'he' ? 'מסלול ב׳ (חלופי)' : 'Scenario B (Alternative)'}:
• ${t.loanAmount}: ${currencyFormat.format(principalB)}
• ${t.interestRate}: ${rateB}%
• ${t.loanTerm}: ${yearsB} ${lang === 'he' ? 'שנים' : 'Years'}
→ ${t.monthlyPayment}: ${currencyFormat.format(comparisonResult.scenarioB.monthlyPayment)}
→ ${t.totalInterest}: ${currencyFormat.format(comparisonResult.scenarioB.totalInterest)}
→ ${lang === 'he' ? 'סה״כ תשלומים' : 'Total Paid'}: ${currencyFormat.format(comparisonResult.scenarioB.totalPaid)}

--------------------------------------------------
${lang === 'he' ? 'הפרש וחיסכון' : 'Difference & Savings'}:
• ${lang === 'he' ? 'הפרש בהחזר חודשי' : 'Monthly Payment Diff'}: ${comparisonResult.diffMonthly >= 0 ? '+' : ''}${currencyFormat.format(comparisonResult.diffMonthly)} / ${lang === 'he' ? 'חודש' : 'mo'}
• ${lang === 'he' ? 'הפרש בריבית כוללת' : 'Total Interest Diff'}: ${comparisonResult.diffTotalInterest <= 0 ? currencyFormat.format(Math.abs(comparisonResult.diffTotalInterest)) + ' ' + (lang === 'he' ? 'חיסכון!' : 'Saved!') : '+' + currencyFormat.format(comparisonResult.diffTotalInterest)}
• ${lang === 'he' ? 'הפרש בעלות כוללת' : 'Total Cost Diff'}: ${comparisonResult.diffTotalPaid >= 0 ? '+' : ''}${currencyFormat.format(comparisonResult.diffTotalPaid)}
`.trim();

  const comparisonMetrics: ComparisonMetric[] = [
    {
      label: t.monthlyPayment,
      valA: currencyFormat.format(comparisonResult.scenarioA.monthlyPayment),
      valB: currencyFormat.format(comparisonResult.scenarioB.monthlyPayment),
      rawDiff: comparisonResult.diffMonthly,
      diffText: `${comparisonResult.diffMonthly >= 0 ? '+' : ''}${currencyFormat.format(comparisonResult.diffMonthly)} / ${lang === 'he' ? 'חודש' : 'mo'}`,
      invertGood: true,
    },
    {
      label: t.totalInterest,
      valA: currencyFormat.format(comparisonResult.scenarioA.totalInterest),
      valB: currencyFormat.format(comparisonResult.scenarioB.totalInterest),
      rawDiff: comparisonResult.diffTotalInterest,
      diffText: `${comparisonResult.diffTotalInterest <= 0 ? '-' : '+'}${currencyFormat.format(Math.abs(comparisonResult.diffTotalInterest))}`,
      invertGood: true,
      subtext: comparisonResult.interestSavingsPercent > 0 ? `${comparisonResult.interestSavingsPercent}% ${lang === 'he' ? 'פחות ריבית' : 'less interest'}` : undefined,
    },
    {
      label: lang === 'he' ? 'סה״כ תשלומים מצטבר' : 'Total Cost Paid',
      valA: currencyFormat.format(comparisonResult.scenarioA.totalPaid),
      valB: currencyFormat.format(comparisonResult.scenarioB.totalPaid),
      rawDiff: comparisonResult.diffTotalPaid,
      diffText: `${comparisonResult.diffTotalPaid <= 0 ? '-' : '+'}${currencyFormat.format(Math.abs(comparisonResult.diffTotalPaid))}`,
      invertGood: true,
    },
    {
      label: t.loanTerm,
      valA: `${years} ${lang === 'he' ? 'שנים' : 'Years'}`,
      valB: `${yearsB} ${lang === 'he' ? 'שנים' : 'Years'}`,
      rawDiff: yearsB - years,
      diffText: `${yearsB - years >= 0 ? '+' : ''}${yearsB - years} ${lang === 'he' ? 'שנים' : 'Yrs'}`,
      invertGood: true,
    }
  ];

  const comparisonHighlight = comparisonResult.diffTotalInterest < 0
    ? {
        headline: lang === 'he'
          ? `מסלול ב׳ חוסך ${currencyFormat.format(Math.abs(comparisonResult.diffTotalInterest))} בריביות! (${comparisonResult.interestSavingsPercent}% חיסכון)`
          : `Scenario B saves ${currencyFormat.format(Math.abs(comparisonResult.diffTotalInterest))} in total interest (${comparisonResult.interestSavingsPercent}% savings)!`,
        subtext: lang === 'he'
          ? (comparisonResult.diffMonthly > 0
              ? `ההחזר החודשי גבוה ב-${currencyFormat.format(comparisonResult.diffMonthly)} לחודש, אך קיצור התקופה חוסך הון בריבית.`
              : `בנוסף, ההחזר החודשי יורד ב-${currencyFormat.format(Math.abs(comparisonResult.diffMonthly))} בכל חודש!`)
          : (comparisonResult.diffMonthly > 0
              ? `Monthly payment is higher by ${currencyFormat.format(comparisonResult.diffMonthly)}/mo, but payoff time cuts interest substantially.`
              : `Monthly payment also decreases by ${currencyFormat.format(Math.abs(comparisonResult.diffMonthly))} every month!`),
        type: 'positive' as const
      }
    : {
        headline: lang === 'he'
          ? `מסלול ב׳ מוזיל את ההחזר החודשי ב-${currencyFormat.format(Math.abs(comparisonResult.diffMonthly))} לחודש`
          : `Scenario B reduces monthly payment by ${currencyFormat.format(Math.abs(comparisonResult.diffMonthly))}/mo`,
        subtext: lang === 'he'
          ? `עלות הריבית הכוללת עולה ב-${currencyFormat.format(comparisonResult.diffTotalInterest)} בשל הארכת התקופה.`
          : `Total interest increases by ${currencyFormat.format(comparisonResult.diffTotalInterest)} due to the longer term.`,
        type: 'warning' as const
      };

  const comparisonPresets = [
    {
      label: lang === 'he' ? 'סילוק מואץ: 15 שנה' : 'Fast Payoff: 15Y Term',
      onClick: () => { setYearsB(15); setRateB(Math.max(1, rate - 0.5)); }
    },
    {
      label: lang === 'he' ? 'מסלול ביניים: 20 שנה' : 'Balanced: 20Y Term',
      onClick: () => { setYearsB(20); setRateB(Math.max(1, rate - 0.25)); }
    },
    {
      label: lang === 'he' ? 'הפחתת ריבית ב-0.75%' : '0.75% Lower Rate',
      onClick: () => { setYearsB(years); setRateB(Math.max(0.5, rate - 0.75)); setPrincipalB(principal); }
    },
    {
      label: lang === 'he' ? 'הגדלת הון עצמי ב-10%' : '+10% Higher Down Payment',
      onClick: () => { setPrincipalB(Math.round(principal * 0.9)); setRateB(rate); setYearsB(years); }
    },
    {
      label: lang === 'he' ? 'שכפל מסלול א׳ לב׳' : 'Clone Scenario A to B',
      onClick: () => { setPrincipalB(principal); setRateB(rate); setYearsB(years); }
    }
  ];

  const programmaticTitle = useMemo(() => {
    if (principal === 1000000 && years === 30) {
      return lang === 'he'
        ? 'מחשבון משכנתא 1,000,000 ש״ח ל-30 שנה: החזר חודשי 5,368 ₪ ולוח שפיצר'
        : '$1,000,000 Mortgage Calculator for 30 Years: $5,368/mo & Amortization';
    }
    if (principal === 800000 && years === 25) {
      return lang === 'he'
        ? 'מחשבון משכנתא 800,000 ש״ח ל-25 שנה: החזר חודשי 4,583 ₪ וריבית'
        : '$800,000 Mortgage Calculator for 25 Years: Payment & Schedule';
    }
    return t.mortgageTitle;
  }, [principal, years, lang, t.mortgageTitle]);

  return (
    <div className="w-full">
      <Breadcrumbs items={[{ label: t.catAll || 'Library', path: `/${lang}/all` }, { label: t.mortgageTitle }]} />

      <ScenarioPresets
        presets={presets}
        onSelect={(vals) => {
          if (vals.mode) setMode(vals.mode);
          if (vals.principal !== undefined) setPrincipal(vals.principal);
          if (vals.targetPayment !== undefined) setTargetPayment(vals.targetPayment);
          if (vals.rate !== undefined) setRate(vals.rate);
          if (vals.years !== undefined) setYears(vals.years);
        }}
      />

      <div className="w-full h-full flex flex-col lg:flex-row gap-8 items-start relative">
      <SEO
        title={programmaticTitle}
        description={t.mortgageDesc}
        canonicalUrl={`/${lang}/mortgage-calculator`}
        faq={getProgrammaticFaqs('mortgage')}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: programmaticTitle,
          description: t.mortgageDesc,
          applicationCategory: 'CalculatorApplication',
          operatingSystem: 'Any',
          url: `https://globalcalcpro.com/${lang}/mortgage-calculator`
        }}
      />
      
      {/* Input Form */}
      <div className="flex-1 w-full bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-stone-200 flex flex-col">
        {/* Mode Selector Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-stone-100 rounded-2xl mb-6 border border-stone-200">
          <button
            type="button"
            onClick={() => setMode('standard')}
            className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              mode === 'standard'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {modeLabels.standard}
          </button>
          <button
            type="button"
            onClick={() => setMode('reverse')}
            className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              mode === 'reverse'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {modeLabels.reverse}
          </button>
          <button
            type="button"
            onClick={() => setMode('compare')}
            className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${
              mode === 'compare'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">compare_arrows</span>
            <span>{modeLabels.compare}</span>
          </button>
        </div>

        {/* Local Market & Regime Selector */}
        <div className="mb-6 p-4 rounded-2xl bg-stone-50/80 border border-stone-200/90">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">public</span>
              <span>{lang === 'he' ? 'שוק ומשטר ריבית מקומי:' : 'Market & Mortgage Regime:'}</span>
            </span>

            <div className="flex items-center gap-1.5 flex-wrap">
              {(['IL', 'US', 'EU', 'UK', 'CUSTOM'] as MortgageRegimeId[]).map((rId) => {
                const regime = MORTGAGE_REGIMES[rId];
                const isSelected = regimeId === rId;
                return (
                  <button
                    key={rId}
                    type="button"
                    onClick={() => {
                      setRegimeId(rId);
                      if (regime.tracks[0]) {
                        setRate(regime.tracks[0].defaultRate);
                        setYears(regime.tracks[0].defaultYears);
                        if (mode === 'standard') {
                          setPrincipal(regime.defaultPrincipal);
                        }
                      }
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
                    }`}
                  >
                    <span>{regime.flag}</span>
                    <span>{regime.countryCode}</span>
                    <span className="opacity-70 text-[10px]">({regime.currencySymbol})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Regime Tracks Bar */}
          {currentRegime && currentRegime.tracks.length > 0 && (
            <div className="pt-2.5 border-t border-stone-200">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold text-stone-500">
                  {lang === 'he' ? `מסלולים מובילים (${currentRegime.name.he}):` : `Standard Tracks (${currentRegime.name.en}):`}
                </span>
                <span className="text-[11px] text-stone-400 font-medium">
                  {currentRegime.currency} ({currentRegime.currencySymbol})
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentRegime.tracks.map((track) => {
                  const trackName = track.name[lang as keyof typeof track.name] || track.name.en;
                  const isCurrentTrack = Math.abs(rate - track.defaultRate) < 0.05 && years === track.defaultYears;
                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => {
                        setRate(track.defaultRate);
                        setYears(track.defaultYears);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                        isCurrentTrack
                          ? 'bg-blue-100 text-blue-900 border border-blue-300 font-bold shadow-2xs'
                          : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200 font-medium'
                      }`}
                      title={track.description[lang as keyof typeof track.description] || track.description.en}
                    >
                      <span>{trackName}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-stone-100 text-stone-600 font-bold" dir="ltr">
                        {track.defaultRate}% • {track.defaultYears}{lang === 'he' ? 'ש' : 'y'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight mb-2">
            {mode === 'standard' ? t.mortgageTitle : mode === 'reverse' ? modeLabels.reverse : modeLabels.compare}
          </h2>
          <p className="text-stone-500 font-medium text-[14px] leading-relaxed max-w-lg">
            {mode === 'standard'
              ? t.mortgageExplanation
              : mode === 'reverse'
              ? (lang === 'he' ? 'הזן את ההחזר החודשי הרצוי וגלה איזה סכום משכנתא כולל תוכל לקבל.' : 'Enter your target monthly payment to discover your maximum borrowing power.')
              : (lang === 'he' ? 'השווה בין שני מסלולים או תרחישי משכנתא (תקופה, ריבית, סכום) וגלה בדיוק איזה מסלול חוסך לך יותר כסף.' : 'Compare two mortgage scenarios side-by-side to discover which one saves you more money and shortens payoff time.')}
          </p>
        </div>

        {mode !== 'compare' ? (
          <form toolname="mortgage_calculator" tooldescription="Calculate monthly mortgage payment or reverse borrowing power" onSubmit={e => e.preventDefault()} className="flex-1 flex flex-col justify-between">
            <div className="space-y-8">
              {mode === 'standard' ? (
                <div className="group">
                  <label htmlFor="mc-principal" className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">{t.loanAmount}</label>
                  <input id="mc-principal" aria-label={t.loanAmount} toolparamdescription="Principal loan amount" type="number" value={principal} onChange={e => setPrincipal(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-3xl md:text-4xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" />
                </div>
              ) : (
                <div className="group">
                  <label htmlFor="mc-target-payment" className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">
                    {lang === 'he' ? 'החזר חודשי רצוי' : lang === 'es' ? 'Pago Mensual Deseado' : lang === 'fr' ? 'Mensualité Souhaitée' : lang === 'ar' ? 'القسط الشهري المستهدف' : 'Desired Monthly Payment'}
                  </label>
                  <input id="mc-target-payment" aria-label="Target monthly payment" type="number" value={targetPayment} onChange={e => setTargetPayment(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-3xl md:text-4xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" />
                </div>
              )}
              <div className="group">
                <label htmlFor="mc-rate" className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">{t.interestRate} (%)</label>
                <input id="mc-rate" aria-label={t.interestRate} toolparamdescription="Annual interest rate percentage" type="number" step="0.1" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-3xl md:text-4xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" />
              </div>
              <div className="group">
                <label htmlFor="mc-years" className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">{t.loanTerm} ({lang === 'he' ? 'שנים' : 'Years'})</label>
                <input id="mc-years" aria-label={t.loanTerm} toolparamdescription="Duration of loan in years" type="number" value={years} onChange={e => setYears(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-3xl md:text-4xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" />
              </div>
            </div>
          </form>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Scenario A Card */}
              <div className="p-5 rounded-2xl border-2 border-blue-200 bg-blue-50/30 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-black text-xs">
                    {lang === 'he' ? 'מסלול א׳ (נוכחי)' : 'Scenario A (Baseline)'}
                  </span>
                  <span className="text-xs font-bold text-blue-800" dir="ltr">
                    {currencyFormat.format(comparisonResult.scenarioA.monthlyPayment)} / {lang === 'he' ? 'חודש' : 'mo'}
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-500 block mb-1">{t.loanAmount}</label>
                  <input
                    type="number"
                    value={principal}
                    onChange={e => setPrincipal(Number(e.target.value))}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-lg font-bold text-stone-900 focus:border-blue-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-500 block mb-1">{t.interestRate} (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={rate}
                      onChange={e => setRate(Number(e.target.value))}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-lg font-bold text-stone-900 focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-500 block mb-1">{t.loanTerm} ({lang === 'he' ? 'שנים' : 'Yrs'})</label>
                    <input
                      type="number"
                      value={years}
                      onChange={e => setYears(Number(e.target.value))}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-lg font-bold text-stone-900 focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Scenario B Card */}
              <div className="p-5 rounded-2xl border-2 border-emerald-300 bg-emerald-50/30 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-black text-xs">
                    {lang === 'he' ? 'מסלול ב׳ (חלופי)' : 'Scenario B (Alternative)'}
                  </span>
                  <span className="text-xs font-bold text-emerald-800" dir="ltr">
                    {currencyFormat.format(comparisonResult.scenarioB.monthlyPayment)} / {lang === 'he' ? 'חודש' : 'mo'}
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-500 block mb-1">{t.loanAmount}</label>
                  <input
                    type="number"
                    value={principalB}
                    onChange={e => setPrincipalB(Number(e.target.value))}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-lg font-bold text-stone-900 focus:border-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-500 block mb-1">{t.interestRate} (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={rateB}
                      onChange={e => setRateB(Number(e.target.value))}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-lg font-bold text-stone-900 focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-500 block mb-1">{t.loanTerm} ({lang === 'he' ? 'שנים' : 'Yrs'})</label>
                    <input
                      type="number"
                      value={yearsB}
                      onChange={e => setYearsB(Number(e.target.value))}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-lg font-bold text-stone-900 focus:border-emerald-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Scenario Comparator Table & Highlights */}
            <ScenarioComparator
              title={lang === 'he' ? 'תוצאות השוואת מסלולי משכנתא' : 'Mortgage Scenario Comparison Results'}
              scenarioAName={lang === 'he' ? 'מסלול א׳ (נוכחי)' : 'Scenario A'}
              scenarioBName={lang === 'he' ? 'מסלול ב׳ (חלופי)' : 'Scenario B'}
              metrics={comparisonMetrics}
              highlight={comparisonHighlight}
              presets={comparisonPresets}
              reportSummaryText={mortgageComparisonReportText}
            >
              {/* Visual Comparative Bars */}
              <div className="p-4 sm:p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
                  {lang === 'he' ? 'השוואה גרפית: ריבית כוללת מול סכום הלוואה' : 'Visual Comparison: Total Interest vs Principal'}
                </span>
                <div className="space-y-3">
                  {/* Bar A */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-blue-700">{lang === 'he' ? 'מסלול א׳' : 'Scenario A'}: {currencyFormat.format(comparisonResult.scenarioA.totalPaid)}</span>
                      <span className="text-stone-500">{lang === 'he' ? 'ריבית' : 'Interest'}: {currencyFormat.format(comparisonResult.scenarioA.totalInterest)}</span>
                    </div>
                    <div className="w-full h-4 bg-stone-200 rounded-full overflow-hidden flex">
                      <div
                        className="bg-blue-600 h-full"
                        style={{ width: `${Math.round((principal / comparisonResult.scenarioA.totalPaid) * 100)}%` }}
                        title={`${t.loanAmount}: ${currencyFormat.format(principal)}`}
                      ></div>
                      <div
                        className="bg-amber-500 h-full"
                        style={{ width: `${Math.round((comparisonResult.scenarioA.totalInterest / comparisonResult.scenarioA.totalPaid) * 100)}%` }}
                        title={`${t.totalInterest}: ${currencyFormat.format(comparisonResult.scenarioA.totalInterest)}`}
                      ></div>
                    </div>
                  </div>

                  {/* Bar B */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-emerald-700">{lang === 'he' ? 'מסלול ב׳' : 'Scenario B'}: {currencyFormat.format(comparisonResult.scenarioB.totalPaid)}</span>
                      <span className="text-stone-500">{lang === 'he' ? 'ריבית' : 'Interest'}: {currencyFormat.format(comparisonResult.scenarioB.totalInterest)}</span>
                    </div>
                    <div className="w-full h-4 bg-stone-200 rounded-full overflow-hidden flex">
                      <div
                        className="bg-emerald-600 h-full"
                        style={{ width: `${Math.round((principalB / comparisonResult.scenarioB.totalPaid) * 100)}%` }}
                        title={`${t.loanAmount}: ${currencyFormat.format(principalB)}`}
                      ></div>
                      <div
                        className="bg-amber-500 h-full"
                        style={{ width: `${Math.round((comparisonResult.scenarioB.totalInterest / comparisonResult.scenarioB.totalPaid) * 100)}%` }}
                        title={`${t.totalInterest}: ${currencyFormat.format(comparisonResult.scenarioB.totalInterest)}`}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold text-stone-600 pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-blue-600"></span>
                    <span>{t.loanAmount} (A)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-emerald-600"></span>
                    <span>{t.loanAmount} (B)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-amber-500"></span>
                    <span>{t.totalInterest}</span>
                  </div>
                </div>
              </div>
            </ScenarioComparator>
          </div>
        )}
      </div>
      
      {/* Sticky Results Dashboard */}
      <div className="w-full lg:w-[420px] shrink-0 lg:sticky lg:top-24 bg-stone-900 rounded-3xl p-8 shadow-2xl border border-stone-800 text-white flex flex-col">
        <div className="mb-8">
          <span className="text-[11px] tracking-widest uppercase font-bold text-stone-400 block mb-3">
            {mode === 'standard'
              ? t.monthlyPayment
              : mode === 'reverse'
              ? (lang === 'he' ? 'סכום הלוואה מקסימלי' : lang === 'es' ? 'Monto Máximo' : lang === 'fr' ? 'Capacité Maximale' : lang === 'ar' ? 'أقصى قرض' : 'Maximum Borrowing Power')
              : (lang === 'he' ? 'הפרש בהחזר חודשי' : 'Monthly Payment Diff')}
          </span>
          <div className="text-4xl sm:text-5xl font-black text-white tracking-tighter" dir="ltr">
            {mode === 'compare'
              ? `${comparisonResult.diffMonthly >= 0 ? '+' : ''}${currencyFormat.format(comparisonResult.diffMonthly)}`
              : currencyFormat.format(mode === 'standard' ? activeMonthlyPayment : activePrincipal)}
          </div>
        </div>
        
        <div className="mb-8 p-5 bg-white/5 rounded-2xl border border-white/10 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[11px] tracking-widest uppercase font-bold text-stone-400">
              {mode === 'compare'
                ? (lang === 'he' ? 'הפרש בריבית כוללת' : 'Total Interest Diff')
                : (mode === 'standard' ? t.totalInterest : t.monthlyPayment)}
            </span>
            <div className={`text-lg font-bold ${mode === 'compare' && comparisonResult.diffTotalInterest <= 0 ? 'text-emerald-400' : 'text-blue-400'}`} dir="ltr">
              {mode === 'compare'
                ? `${comparisonResult.diffTotalInterest <= 0 ? '-' : '+'}${currencyFormat.format(Math.abs(comparisonResult.diffTotalInterest))}`
                : currencyFormat.format(mode === 'standard' ? activeTotalInterest : activeMonthlyPayment)}
            </div>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-white/10">
            <span className="text-[11px] tracking-widest uppercase font-bold text-stone-400">
              {mode === 'compare'
                ? (lang === 'he' ? 'אחוז חיסכון בריבית' : 'Interest Savings %')
                : (mode === 'standard' ? (lang === 'he' ? 'סה"כ לתשלום' : 'Total Paid') : t.totalInterest)}
            </span>
            <div className="text-sm font-semibold text-stone-300" dir="ltr">
              {mode === 'compare'
                ? `${comparisonResult.interestSavingsPercent}%`
                : currencyFormat.format(mode === 'standard' ? activePrincipal + activeTotalInterest : activeTotalInterest)}
            </div>
          </div>
        </div>
        
        <div className="w-full h-[220px]" dir="ltr">
          <Doughnut data={deferredChartData} options={chartOptions} />
        </div>

        <div className="mt-6 pt-4 border-t border-white/10">
          <ShareActions calculatorTitle={t.mortgageTitle} calculatorPath="/mortgage-calculator" />
        </div>
      </div>
    </div>

      {/* SEO Programmatic Scenarios & Popular Long-tail Queries */}
      <PopularScenarios
        scenarios={POPULAR_MORTGAGE_SCENARIOS}
        currentPrincipal={principal}
        onSelectScenario={(params) => {
          if (params.mode) setMode(params.mode);
          if (params.principal !== undefined) setPrincipal(Number(params.principal));
          if (params.rate !== undefined) setRate(Number(params.rate));
          if (params.years !== undefined) setYears(Number(params.years));
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* SEO EDUCATIONAL GUIDE & FORMULA BREAKDOWN */}
      <CalculatorGuide
        guideKey="mortgage"
        onApplyPreset={(preset) => {
          if (preset.principal) {
            setMode('standard');
            setPrincipal(Number(preset.principal));
          }
          if (preset.rate) setRate(Number(preset.rate));
          if (preset.years) setYears(Number(preset.years));
        }}
      />

      <FAQ items={guide.faq} />
      
      <RelatedCalculators currentId="mortgage" />
    </div>
  );
}
