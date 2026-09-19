import FAQ from '../../components/FAQ';
import { useMemo, useState } from 'react';
import SEO from '../../components/SEO';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useI18n } from '../../contexts/i18n';
import Breadcrumbs from '../../components/Breadcrumbs';
import RelatedCalculators from '../../components/RelatedCalculators';
import CalculatorGuide from '../../components/CalculatorGuide';
import ShareActions from '../../components/ShareActions';
import ScenarioPresets from '../../components/ScenarioPresets';
import ScenarioComparator, { ComparisonMetric } from '../../components/ScenarioComparator';
import { useCalculatorState } from '../../hooks/useCalculatorState';
import { useRecordCalculation } from '../../hooks/useRecordCalculation';
import { calculateCompoundInterest, calculateTargetSavings, compareCompoundInterest } from '../../lib/math/finance';
import { exportCompoundToExcel } from '../../lib/export/excelExport';
import AnimatedNumber from '../../components/AnimatedNumber';


export default function CompoundInterest() {
  const { t, lang, guides } = useI18n();
  const guide = guides['compound'] || { guideTitle: 'Guide & Formulas', guideDesc: 'Comprehensive calculation breakdown and FAQs.', faq: [] };
  
  const [mode, setMode] = useState<'growth' | 'target' | 'compare'>('growth');
  const [targetGoal, setTargetGoal] = useState<number>(1000000);

  // Scenario B state for comparison mode
  const [principalB, setPrincipalB] = useState<number>(10000);
  const [rateB, setRateB] = useState<number>(9);
  const [yearsB, setYearsB] = useState<number>(10);
  const [contributionB, setContributionB] = useState<number>(800);

  const { state, updateState, saveToHistory, loadFromHistory, getHistory } = useCalculatorState('compound-interest', {
    principal: 10000,
    rate: 7,
    years: 10,
    contribution: 500
  });

  const { principal, rate, years, contribution } = state;

  const setPrincipal = (v: number) => updateState({ principal: v });
  const setRate = (v: number) => updateState({ rate: v });
  const setYears = (v: number) => updateState({ years: v });
  const setContribution = (v: number) => updateState({ contribution: v });

  // Standard forward compound interest calculation
  const growthResult = useMemo(() => {
    return calculateCompoundInterest(principal, rate, years, contribution);
  }, [principal, rate, years, contribution]);

  // Reverse / Goal Planner calculation
  const targetResult = useMemo(() => {
    return calculateTargetSavings(targetGoal, rate, years, principal);
  }, [targetGoal, rate, years, principal]);

  // Comparison calculation
  const comparisonResult = useMemo(() => {
    return compareCompoundInterest(
      { principal, rate, years, contribution },
      { principal: principalB, rate: rateB, years: yearsB, contribution: contributionB }
    );
  }, [principal, rate, years, contribution, principalB, rateB, yearsB, contributionB]);

  // For chart display in target mode, we project using the computed monthly contribution
  const activeContribution = mode === 'growth' ? contribution : targetResult.requiredMonthlyContribution;
  const activeFutureValue = mode === 'growth' ? growthResult.futureValue : targetResult.totalSaved;
  const activeTotalContributions = mode === 'growth' ? growthResult.totalContributions : targetResult.totalContributions;
  const activeTotalInterest = mode === 'growth' ? growthResult.totalInterest : targetResult.totalInterest;

  const activeScheduleData = useMemo(() => {
    if (mode === 'growth') return growthResult.scheduleData;
    if (mode === 'target') return calculateCompoundInterest(principal, rate, years, targetResult.requiredMonthlyContribution).scheduleData;
    return comparisonResult.scenarioB.scheduleData;
  }, [mode, growthResult.scheduleData, principal, rate, years, targetResult.requiredMonthlyContribution, comparisonResult.scenarioB.scheduleData]);

  const defaultCurrency = lang === 'he' ? 'ILS' : lang === 'fr' || lang === 'es' ? 'EUR' : 'USD';
  const currencyFormat = new Intl.NumberFormat(lang === 'en' ? 'en-US' : lang, { style: 'currency', currency: defaultCurrency, minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const compactFormat = new Intl.NumberFormat(lang === 'en' ? 'en-US' : lang, { style: 'currency', currency: defaultCurrency, notation: 'compact', compactDisplay: 'short' });

  // Record calculation to Recent History Drawer
  useRecordCalculation(
    mode !== 'compare'
      ? {
          calculatorId: 'compound-interest',
          title: {
            en: 'Compound Interest Calculator',
            he: 'מחשבון ריבית דריבית',
            es: 'Calculadora de Interés Compuesto',
            fr: 'Intérêts Composés',
            ar: 'حاسبة الفائدة المركبة',
          },
          summary: {
            en: mode === 'growth'
              ? `${currencyFormat.format(principal)} + ${currencyFormat.format(contribution)}/mo @ ${rate}% (${years} yrs)`
              : `Goal ${currencyFormat.format(targetGoal)} in ${years} yrs @ ${rate}%`,
            he: mode === 'growth'
              ? `קרן ${currencyFormat.format(principal)} + ${currencyFormat.format(contribution)}/חודש ב-${rate}% (${years} שנה)`
              : `יעד ${currencyFormat.format(targetGoal)} ל-${years} שנה בריבית ${rate}%`,
            es: `${currencyFormat.format(principal)} + ${currencyFormat.format(contribution)}/mes al ${rate}% (${years} años)`,
            fr: `${currencyFormat.format(principal)} + ${currencyFormat.format(contribution)}/mois à ${rate}% (${years} ans)`,
            ar: `رأس المال ${currencyFormat.format(principal)} بفائدة ${rate}% (${years} سنة)`,
          },
          result: {
            en: `Future Value: ${currencyFormat.format(activeFutureValue)}`,
            he: `שווי עתידי: ${currencyFormat.format(activeFutureValue)}`,
            es: `Valor futuro: ${currencyFormat.format(activeFutureValue)}`,
            fr: `Valeur future : ${currencyFormat.format(activeFutureValue)}`,
            ar: `القيمة المستقبلية: ${currencyFormat.format(activeFutureValue)}`,
          },
          path: `/${lang}/compound-interest-calculator?mode=${mode}&principal=${principal}&rate=${rate}&years=${years}&contribution=${contribution}`,
          badge: `${years}Y @ ${rate}%`,
        }
      : null
  );

  const presets = [
    {
      label: { en: 'S&P 500 DCA ($500/mo)', he: 'השקעה במדד (500 $ / ₪ לחודש)', es: 'Inversión Indexada $500/mes', fr: 'ETF S&P 500 500€/mois', ar: 'استثمار شهري 500' },
      description: { en: '20 Years @ 8.5% annual return', he: '20 שנה בריבית שנתית 8.5%', es: '20 años al 8.5%', fr: '20 ans à 8,5%', ar: '20 سنة بعائد 8.5%' },
      values: { mode: 'growth', principal: 5000, contribution: 500, rate: 8.5, years: 20 },
      badge: '20Y'
    },
    {
      label: { en: 'Retirement $1M Goal', he: 'יעד פרישה: 1,000,000', es: 'Meta de Jubilación $1M', fr: 'Objectif Retraite 1M €', ar: 'هدف التقاعد مليون' },
      description: { en: 'Reverse calculate monthly savings', he: 'חישוב חיסכון חודשי נדרש להון יעד', es: 'Ahorro mensual necesario', fr: 'Épargne mensuelle requise', ar: 'الادخار الشهري المطلوب' },
      values: { mode: 'target', targetGoal: 1000000, principal: 10000, rate: 8.0, years: 25 },
      badge: 'GOAL'
    },
    {
      label: { en: 'College Fund 18Y', he: 'קרן לימודים לילד (18 שנה)', es: 'Fondo Universitario 18 Años', fr: 'Fonds Études 18 Ans', ar: 'صندوق تعليم 18 سنة' },
      description: { en: 'Target $150,000 @ 7% return', he: 'יעד 150,000 בריבית 7%', es: 'Meta $150,000 al 7%', fr: 'Objectif 150k € à 7%', ar: 'هدف 150 ألف بعائد 7%' },
      values: { mode: 'target', targetGoal: 150000, principal: 2000, rate: 7.0, years: 18 },
      badge: '18Y'
    },
    {
      label: { en: 'Aggressive Growth ($1k/mo)', he: 'צמיחה אגרסיבית (1,000 לחודש)', es: 'Crecimiento Agresivo ($1k/mes)', fr: 'Croissance Active 1000€/m', ar: 'نمو قوي 1000 شهرياً' },
      description: { en: '15 Years @ 10% average return', he: '15 שנה בריבית 10%', es: '15 años al 10%', fr: '15 ans à 10%', ar: '15 سنة بعائد 10%' },
      values: { mode: 'growth', principal: 15000, contribution: 1000, rate: 10.0, years: 15 },
      badge: '15Y'
    }
  ];

  const modeLabels = {
    en: { growth: 'Investment Growth (Standard)', target: 'Reverse Goal Planner (Target)', compare: 'Side-by-Side Comparison' },
    he: { growth: 'צמיחת הון והשקעה (רגיל)', target: 'מתכנן יעד: חישוב הפקדה (הפוך)', compare: 'השוואת תוכניות השקעה' },
    es: { growth: 'Crecimiento de Inversión', target: 'Planificador de Meta (Inverso)', compare: 'Comparar Estrategias' },
    fr: { growth: 'Croissance de l\'Épargne', target: 'Planificateur d\'Objectif (Inverse)', compare: 'Comparer les Plans' },
    ar: { growth: 'نمو الاستثمار (قياسي)', target: 'مخطط الهدف المالي (عكسي)', compare: 'مقارنة خطط الاستثمار' },
  }[lang] || { growth: 'Investment Growth', target: 'Reverse Goal Planner', compare: 'Side-by-Side Comparison' };

  const compoundComparisonReportText = `
📈 GlobalCalc Pro - ${lang === 'he' ? 'דוח השוואת תוכניות ריבית דריבית' : 'Compound Interest Scenario Comparison'}
--------------------------------------------------
${lang === 'he' ? 'תוכנית א׳ (נוכחית)' : 'Plan A (Baseline)'}:
• ${t.initialInvestment}: ${currencyFormat.format(principal)}
• ${t.monthlyContribution}: ${currencyFormat.format(contribution)}
• ${t.interestRate}: ${rate}% | ${t.yearsToGrow}: ${years} ${lang === 'he' ? 'שנים' : 'Yrs'}
→ ${t.futureValue}: ${currencyFormat.format(comparisonResult.scenarioA.futureValue)}
→ ${t.totalContributions}: ${currencyFormat.format(comparisonResult.scenarioA.totalContributions)}
→ ${t.totalInterestEarned}: ${currencyFormat.format(comparisonResult.scenarioA.totalInterest)}

${lang === 'he' ? 'תוכנית ב׳ (חלופית)' : 'Plan B (Alternative)'}:
• ${t.initialInvestment}: ${currencyFormat.format(principalB)}
• ${t.monthlyContribution}: ${currencyFormat.format(contributionB)}
• ${t.interestRate}: ${rateB}% | ${t.yearsToGrow}: ${yearsB} ${lang === 'he' ? 'שנים' : 'Yrs'}
→ ${t.futureValue}: ${currencyFormat.format(comparisonResult.scenarioB.futureValue)}
→ ${t.totalContributions}: ${currencyFormat.format(comparisonResult.scenarioB.totalContributions)}
→ ${t.totalInterestEarned}: ${currencyFormat.format(comparisonResult.scenarioB.totalInterest)}

--------------------------------------------------
${lang === 'he' ? 'הפרש ורווח עודף' : 'Difference & Extra Returns'}:
• ${lang === 'he' ? 'הפרש בהון הסופי' : 'Extra Future Value'}: ${comparisonResult.diffFutureValue >= 0 ? '+' : ''}${currencyFormat.format(comparisonResult.diffFutureValue)} (${comparisonResult.gainPercentage >= 0 ? '+' : ''}${comparisonResult.gainPercentage}%)
• ${lang === 'he' ? 'הפרש בהפקדות עצמיות' : 'Extra Out-of-Pocket Deposits'}: ${comparisonResult.diffContributions >= 0 ? '+' : ''}${currencyFormat.format(comparisonResult.diffContributions)}
• ${lang === 'he' ? 'הפרש בריבית דריבית שנצברה' : 'Extra Compound Interest'}: ${comparisonResult.diffInterest >= 0 ? '+' : ''}${currencyFormat.format(comparisonResult.diffInterest)}
`.trim();

  const comparisonMetrics: ComparisonMetric[] = [
    {
      label: t.futureValue,
      valA: currencyFormat.format(comparisonResult.scenarioA.futureValue),
      valB: currencyFormat.format(comparisonResult.scenarioB.futureValue),
      rawDiff: comparisonResult.diffFutureValue,
      diffText: `${comparisonResult.diffFutureValue >= 0 ? '+' : ''}${currencyFormat.format(comparisonResult.diffFutureValue)}`,
      invertGood: false,
      subtext: `${comparisonResult.gainPercentage >= 0 ? '+' : ''}${comparisonResult.gainPercentage}% ${lang === 'he' ? 'יותר הון סופי' : 'wealth boost'}`,
    },
    {
      label: t.totalInterestEarned,
      valA: currencyFormat.format(comparisonResult.scenarioA.totalInterest),
      valB: currencyFormat.format(comparisonResult.scenarioB.totalInterest),
      rawDiff: comparisonResult.diffInterest,
      diffText: `${comparisonResult.diffInterest >= 0 ? '+' : ''}${currencyFormat.format(comparisonResult.diffInterest)}`,
      invertGood: false,
    },
    {
      label: t.totalContributions,
      valA: currencyFormat.format(comparisonResult.scenarioA.totalContributions),
      valB: currencyFormat.format(comparisonResult.scenarioB.totalContributions),
      rawDiff: comparisonResult.diffContributions,
      diffText: `${comparisonResult.diffContributions >= 0 ? '+' : ''}${currencyFormat.format(comparisonResult.diffContributions)}`,
      invertGood: false,
    },
    {
      label: t.monthlyContribution,
      valA: `${currencyFormat.format(contribution)} / ${lang === 'he' ? 'חודש' : 'mo'}`,
      valB: `${currencyFormat.format(contributionB)} / ${lang === 'he' ? 'חודש' : 'mo'}`,
      rawDiff: contributionB - contribution,
      diffText: `${contributionB - contribution >= 0 ? '+' : ''}${currencyFormat.format(contributionB - contribution)}`,
      invertGood: false,
    }
  ];

  const comparisonHighlight = comparisonResult.diffFutureValue >= 0
    ? {
        headline: lang === 'he'
          ? `תוכנית ב׳ מניבה תוספת הון עצומה של ${currencyFormat.format(comparisonResult.diffFutureValue)}! (+${comparisonResult.gainPercentage}%)`
          : `Plan B generates an extra ${currencyFormat.format(comparisonResult.diffFutureValue)} in future wealth! (+${comparisonResult.gainPercentage}%)`,
        subtext: lang === 'he'
          ? `מתוך סכום זה, ${currencyFormat.format(comparisonResult.diffInterest)} נוצר בריבית דריבית טהורה, ללא הפקדה מהכיס!`
          : `Of that increase, ${currencyFormat.format(comparisonResult.diffInterest)} is pure compound growth generated without extra out-of-pocket savings!`,
        type: 'positive' as const
      }
    : {
        headline: lang === 'he'
          ? `תוכנית א׳ מייצרת הון סופי גבוה יותר ב-${currencyFormat.format(Math.abs(comparisonResult.diffFutureValue))}`
          : `Plan A generates more wealth by ${currencyFormat.format(Math.abs(comparisonResult.diffFutureValue))}`,
        subtext: lang === 'he'
          ? `התוכנית החלופית מניבה פחות בשל הפקדות חודשיות או תשואה נמוכות יותר.`
          : `The alternative plan yields less due to lower contributions or rate of return.`,
        type: 'warning' as const
      };

  const comparisonPresets = [
    {
      label: lang === 'he' ? '+250 ₪/חודש להפקדה' : '+$250/mo Extra Deposit',
      onClick: () => { setContributionB(contribution + 250); setRateB(rate); setYearsB(years); setPrincipalB(principal); }
    },
    {
      label: lang === 'he' ? '+2% תשואה שנתית גבוהה יותר' : '+2% Higher Return Rate',
      onClick: () => { setRateB(rate + 2); setContributionB(contribution); setYearsB(years); setPrincipalB(principal); }
    },
    {
      label: lang === 'he' ? '+5 שנות צבירה נוספות' : '+5 Years Longer Time Horizon',
      onClick: () => { setYearsB(years + 5); setRateB(rate); setContributionB(contribution); setPrincipalB(principal); }
    },
    {
      label: lang === 'he' ? 'שכפל תוכנית א׳ ל-ב׳' : 'Clone Plan A to B',
      onClick: () => { setPrincipalB(principal); setRateB(rate); setYearsB(years); setContributionB(contribution); }
    }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface-container-lowest border border-border-subtle p-3 rounded-xl shadow-lg">
          <p className="font-bold text-on-surface mb-2">{lang === 'he' ? 'שנה' : 'Year'} {label}</p>
          <div className="space-y-1">
            <p className="text-sm" style={{ color: payload[0].color }}>
              {t.totalContributions}: {currencyFormat.format(payload[0].value)}
            </p>
            <p className="text-sm" style={{ color: payload[1].color }}>
              {t.totalInterestEarned}: {currencyFormat.format(payload[1].value)}
            </p>
            <div className="pt-1 mt-1 border-t border-border-subtle font-bold text-sm text-on-surface">
              {t.futureValue}: {currencyFormat.format(payload[0].value + payload[1].value)}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <Breadcrumbs items={[{ label: t.catAll || 'Library', path: `/${lang}/all` }, { label: t.compoundTitle }]} />
      
      {/* Programmatic Scenario Presets */}
      <ScenarioPresets
        presets={presets}
        onSelect={(vals) => {
          if (vals.mode) setMode(vals.mode);
          if (vals.targetGoal !== undefined) setTargetGoal(vals.targetGoal);
          if (vals.principal !== undefined) setPrincipal(vals.principal);
          if (vals.contribution !== undefined) setContribution(vals.contribution);
          if (vals.rate !== undefined) setRate(vals.rate);
          if (vals.years !== undefined) setYears(vals.years);
        }}
      />

      <div className="w-full h-full flex flex-col lg:flex-row gap-8 items-start relative">
      
      <SEO
        title={t.compoundTitle}
        description={t.compoundDesc}
        canonicalUrl={`/${lang}/compound-interest`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: t.compoundTitle,
          description: t.compoundDesc,
          applicationCategory: 'CalculatorApplication',
          operatingSystem: 'Any',
          url: `https://globalcalcpro.com/${lang}/compound-interest`
        }}
      />
      
      <div className="flex-1 flex flex-col">
        
      {/* Input Form */}
      <div className="flex-1 w-full bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-stone-200 flex flex-col">
        {/* Mode Selector Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-stone-100 rounded-2xl mb-8 border border-stone-200">
          <button
            type="button"
            onClick={() => setMode('growth')}
            className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              mode === 'growth'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {modeLabels.growth}
          </button>
          <button
            type="button"
            onClick={() => setMode('target')}
            className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              mode === 'target'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {modeLabels.target}
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

        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight mb-2">
            {mode === 'growth' ? t.compoundTitle : mode === 'target' ? modeLabels.target : modeLabels.compare}
          </h2>
          <p className="text-stone-500 font-medium text-[14px] leading-relaxed max-w-lg">
            {mode === 'growth'
              ? t.compoundExplanation
              : mode === 'target'
              ? (lang === 'he' ? 'הגדר את יעד ההון הסופי שלך וחשב כמה עליך לחסוך בכל חודש.' : 'Set your desired future wealth goal and discover the required monthly contribution.')
              : (lang === 'he' ? 'השווה שתי תוכניות השקעה במקביל (הפקדה חודשית, תשואה שנתית, אופק זמן) ובחן כיצד שינוי קטן מגדיל את ההון בעשרות אחוזים.' : 'Compare two investment plans side-by-side to visualize how slight changes in deposits or returns multiply compounding wealth over time.')}
          </p>
        </div>

        {mode !== 'compare' ? (
          <form toolname="compound_interest_calculator" tooldescription="Calculate investment growth, monthly compounding, or target savings requirements" onSubmit={e => e.preventDefault()} className="flex-1 flex flex-col justify-between">
            <div className="space-y-8">
              {mode === 'target' ? (
                <div className="group">
                  <label htmlFor="ci-target-goal" className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">
                    {lang === 'he' ? 'יעד הון סופי רצוי' : lang === 'es' ? 'Meta Financiera Final' : lang === 'fr' ? 'Objectif de Patrimoine' : lang === 'ar' ? 'هدف الثروة النهائي' : 'Target Goal Amount'}
                  </label>
                  <input id="ci-target-goal" aria-label="Target goal" type="number" value={targetGoal} onChange={e => setTargetGoal(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-3xl md:text-4xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" />
                </div>
              ) : null}

              <div className="group">
                <label htmlFor="ci-principal" className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">{t.initialInvestment}</label>
                <input id="ci-principal" aria-label={t.initialInvestment} toolparamdescription="Initial principal deposit amount" type="number" value={principal} onChange={e => setPrincipal(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-3xl md:text-4xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" />
              </div>

              {mode === 'growth' ? (
                <div className="group">
                  <label htmlFor="ci-contribution" className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">{t.monthlyContribution}</label>
                  <input id="ci-contribution" aria-label={t.monthlyContribution} toolparamdescription="Monthly recurring contribution amount" type="number" value={contribution} onChange={e => setContribution(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-3xl md:text-4xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" />
                </div>
              ) : null}

              <div className="group">
                <label htmlFor="ci-rate" className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">{t.interestRate} (%)</label>
                <input id="ci-rate" aria-label={t.interestRate} toolparamdescription="Expected annual return percentage rate" type="number" step="0.1" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-3xl md:text-4xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" />
              </div>

              <div className="group">
                <label htmlFor="ci-years" className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">{t.yearsToGrow} ({lang === 'he' ? 'שנים' : 'Years'})</label>
                <input id="ci-years" aria-label={t.yearsToGrow} toolparamdescription="Investment growth period in years" type="number" value={years} onChange={e => setYears(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-3xl md:text-4xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" />
              </div>
            </div>
          </form>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Plan A Card */}
              <div className="p-5 rounded-2xl border-2 border-blue-200 bg-blue-50/30 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-black text-xs">
                    {lang === 'he' ? 'תוכנית א׳ (נוכחית)' : 'Plan A (Baseline)'}
                  </span>
                  <span className="text-xs font-bold text-blue-800" dir="ltr">
                    {currencyFormat.format(comparisonResult.scenarioA.futureValue)}
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-500 block mb-1">{t.initialInvestment}</label>
                  <input
                    type="number"
                    value={principal}
                    onChange={e => setPrincipal(Number(e.target.value))}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-lg font-bold text-stone-900 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-500 block mb-1">{t.monthlyContribution}</label>
                  <input
                    type="number"
                    value={contribution}
                    onChange={e => setContribution(Number(e.target.value))}
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
                    <label className="text-xs font-bold text-stone-500 block mb-1">{t.yearsToGrow} ({lang === 'he' ? 'שנים' : 'Yrs'})</label>
                    <input
                      type="number"
                      value={years}
                      onChange={e => setYears(Number(e.target.value))}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-lg font-bold text-stone-900 focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Plan B Card */}
              <div className="p-5 rounded-2xl border-2 border-purple-200 bg-purple-50/30 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-purple-600 text-white font-black text-xs">
                    {lang === 'he' ? 'תוכנית ב׳ (חלופית)' : 'Plan B (Alternative)'}
                  </span>
                  <span className="text-xs font-bold text-purple-800" dir="ltr">
                    {currencyFormat.format(comparisonResult.scenarioB.futureValue)}
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-500 block mb-1">{t.initialInvestment}</label>
                  <input
                    type="number"
                    value={principalB}
                    onChange={e => setPrincipalB(Number(e.target.value))}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-lg font-bold text-stone-900 focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-500 block mb-1">{t.monthlyContribution}</label>
                  <input
                    type="number"
                    value={contributionB}
                    onChange={e => setContributionB(Number(e.target.value))}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-lg font-bold text-stone-900 focus:border-purple-600"
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
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-lg font-bold text-stone-900 focus:border-purple-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-500 block mb-1">{t.yearsToGrow} ({lang === 'he' ? 'שנים' : 'Yrs'})</label>
                    <input
                      type="number"
                      value={yearsB}
                      onChange={e => setYearsB(Number(e.target.value))}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-lg font-bold text-stone-900 focus:border-purple-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Scenario Comparator Component */}
            <ScenarioComparator
              title={lang === 'he' ? 'תוצאות השוואת תוכניות ריבית דריבית' : 'Compound Interest Scenario Comparison Results'}
              scenarioAName={lang === 'he' ? 'תוכנית א׳' : 'Plan A'}
              scenarioBName={lang === 'he' ? 'תוכנית ב׳' : 'Plan B'}
              metrics={comparisonMetrics}
              highlight={comparisonHighlight}
              presets={comparisonPresets}
              reportSummaryText={compoundComparisonReportText}
            >
              {/* Comparative bars */}
              <div className="p-4 sm:p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
                  {lang === 'he' ? 'השוואה גרפית: הון עצמי מול ריבית דריבית שנצברה' : 'Visual Comparison: Deposits vs Compound Growth'}
                </span>
                <div className="space-y-3">
                  {/* Bar A */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-blue-700">{lang === 'he' ? 'תוכנית א׳' : 'Plan A'}: {currencyFormat.format(comparisonResult.scenarioA.futureValue)}</span>
                      <span className="text-stone-500">{t.totalInterestEarned}: {currencyFormat.format(comparisonResult.scenarioA.totalInterest)}</span>
                    </div>
                    <div className="w-full h-4 bg-stone-200 rounded-full overflow-hidden flex">
                      <div
                        className="bg-blue-600 h-full"
                        style={{ width: `${Math.round((comparisonResult.scenarioA.totalContributions / comparisonResult.scenarioA.futureValue) * 100)}%` }}
                        title={`${t.totalContributions}: ${currencyFormat.format(comparisonResult.scenarioA.totalContributions)}`}
                      ></div>
                      <div
                        className="bg-purple-500 h-full"
                        style={{ width: `${Math.round((comparisonResult.scenarioA.totalInterest / comparisonResult.scenarioA.futureValue) * 100)}%` }}
                        title={`${t.totalInterestEarned}: ${currencyFormat.format(comparisonResult.scenarioA.totalInterest)}`}
                      ></div>
                    </div>
                  </div>

                  {/* Bar B */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-purple-700">{lang === 'he' ? 'תוכנית ב׳' : 'Plan B'}: {currencyFormat.format(comparisonResult.scenarioB.futureValue)}</span>
                      <span className="text-stone-500">{t.totalInterestEarned}: {currencyFormat.format(comparisonResult.scenarioB.totalInterest)}</span>
                    </div>
                    <div className="w-full h-4 bg-stone-200 rounded-full overflow-hidden flex">
                      <div
                        className="bg-purple-600 h-full"
                        style={{ width: `${Math.round((comparisonResult.scenarioB.totalContributions / comparisonResult.scenarioB.futureValue) * 100)}%` }}
                        title={`${t.totalContributions}: ${currencyFormat.format(comparisonResult.scenarioB.totalContributions)}`}
                      ></div>
                      <div
                        className="bg-amber-500 h-full"
                        style={{ width: `${Math.round((comparisonResult.scenarioB.totalInterest / comparisonResult.scenarioB.futureValue) * 100)}%` }}
                        title={`${t.totalInterestEarned}: ${currencyFormat.format(comparisonResult.scenarioB.totalInterest)}`}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold text-stone-600 pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-blue-600"></span>
                    <span>{t.totalContributions} (A)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-purple-600"></span>
                    <span>{t.totalContributions} (B)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-amber-500"></span>
                    <span>{t.totalInterestEarned} (Compound Boost)</span>
                  </div>
                </div>
              </div>
            </ScenarioComparator>
          </div>
        )}

        <ShareActions
          calculatorTitle={t.compoundTitle}
          calculatorPath="/compound-interest"
          onSaveHistory={saveToHistory}
          historyEntries={getHistory()}
          onLoadHistory={loadFromHistory}
          onExportExcel={() => {
            exportCompoundToExcel({
              principal,
              rate,
              years,
              contribution,
              futureValue: activeFutureValue,
              totalContributions: activeTotalContributions,
              totalInterest: activeTotalInterest,
              currencySymbol: lang === 'he' ? '₪' : '$',
              lang,
              schedule: growthResult.scheduleData
            });
          }}
          shareMessage={
            lang === 'he'
              ? `חישוב ריבית דריבית מגלובל קאלק פרו:\nהפקדה ראשונית: ${currencyFormat.format(principal)}\nהפקדה חודשית: ${currencyFormat.format(contribution)}\nתשואה שנתית: ${rate}%\nתקופה: ${years} שנים\nשווי עתידי משוער: ${currencyFormat.format(activeFutureValue)}`
              : `Compound Interest Calculation:\nPrincipal: ${currencyFormat.format(principal)}\nMonthly Contribution: ${currencyFormat.format(contribution)}\nAnnual Rate: ${rate}%\nTerm: ${years} Years\nFuture Value: ${currencyFormat.format(activeFutureValue)}`
          }
        />
      </div>
      </div>
      
      {/* Sticky Results Dashboard */}
      <div className="w-full lg:w-[460px] shrink-0 lg:sticky lg:top-24 bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-800 text-white flex flex-col">
          
        <div className="mb-6">
          <span className="text-xs tracking-wider uppercase font-bold text-stone-400 block mb-2">
            {mode === 'growth'
              ? t.futureValue
              : mode === 'target'
              ? (lang === 'he' ? 'הפקדה חודשית נדרשת' : lang === 'es' ? 'Aporte Mensual' : lang === 'fr' ? 'Épargne Mensuelle' : lang === 'ar' ? 'الادخار المطلوب' : 'Required Monthly Savings')
              : (lang === 'he' ? 'הפרש בהון הסופי' : 'Extra Future Wealth')}
          </span>
          <div className="text-4xl sm:text-5xl font-black text-white tracking-tight" dir="ltr">
            {mode === 'compare' ? (
              `${comparisonResult.diffFutureValue >= 0 ? '+' : ''}${currencyFormat.format(comparisonResult.diffFutureValue)}`
            ) : (
              <AnimatedNumber
                value={Math.round(mode === 'growth' ? activeFutureValue : activeContribution)}
                prefix={lang === 'he' ? '₪ ' : '$ '}
                locale={lang === 'he' ? 'he-IL' : 'en-US'}
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 sm:p-5 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-xs tracking-wider uppercase font-bold text-stone-400 block mb-1">
              {mode === 'compare'
                ? (lang === 'he' ? 'תוספת ריבית דריבית' : 'Extra Compound Int.')
                : (mode === 'growth' ? t.totalContributions : (lang === 'he' ? 'יעד הון סופי' : 'Target Goal'))}
            </span>
            <div className={`text-lg md:text-xl font-headline ${mode === 'compare' && comparisonResult.diffInterest >= 0 ? 'text-emerald-400' : 'text-stone-300'}`} dir="ltr">
              {mode === 'compare' ? (
                `${comparisonResult.diffInterest >= 0 ? '+' : ''}${currencyFormat.format(comparisonResult.diffInterest)}`
              ) : (
                <AnimatedNumber
                  value={Math.round(mode === 'growth' ? activeTotalContributions : activeFutureValue)}
                  prefix={lang === 'he' ? '₪ ' : '$ '}
                  locale={lang === 'he' ? 'he-IL' : 'en-US'}
                />
              )}
            </div>
          </div>
          <div className="p-4 sm:p-5 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-xs tracking-wider uppercase font-bold text-stone-400 block mb-1">
              {mode === 'compare'
                ? (lang === 'he' ? 'אחוז הגדלת ההון' : 'Wealth Increase %')
                : t.totalInterestEarned}
            </span>
            <div className="text-lg md:text-xl font-bold text-blue-400" dir="ltr">
              {mode === 'compare' ? (
                `${comparisonResult.gainPercentage >= 0 ? '+' : ''}${comparisonResult.gainPercentage}%`
              ) : (
                <AnimatedNumber
                  value={Math.round(activeTotalInterest)}
                  prefix={(lang === 'he' ? '+₪ ' : '+$ ')}
                  locale={lang === 'he' ? 'he-IL' : 'en-US'}
                />
              )}
            </div>
          </div>
        </div>
          
        <div className="w-full h-[240px] bg-white/5 p-4 rounded-2xl border border-white/10" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activeScheduleData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorContrib" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorInt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="year" stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis 
                stroke="#6b7280" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(val) => compactFormat.format(val)}
                width={55}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="contributions" stackId="1" stroke="#3b82f6" fillOpacity={1} fill="url(#colorContrib)" />
              <Area type="monotone" dataKey="interest" stackId="1" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorInt)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

      {/* Amortization / Growth Schedule Table */}
      <section className="w-full bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-sm border border-stone-200 mt-8 space-y-6">
        <div className="border-b border-stone-200 pb-4">
          <h2 className="text-xl sm:text-2xl font-headline font-bold text-stone-900">{lang === 'he' ? 'טבלת צמיחה שנתית' : 'Yearly Growth Schedule'}</h2>
          <p className="text-stone-500 text-sm mt-1">{lang === 'he' ? 'פירוט ההון והריבית לאורך השנים' : 'Breakdown of principal and interest over time'}</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-stone-200 text-stone-500 text-sm">
                <th className="pb-3 font-semibold text-center">{lang === 'he' ? 'שנה' : 'Year'}</th>
                <th className="pb-3 font-semibold text-end">{lang === 'he' ? 'הפקדות (מצטבר)' : 'Total Contributions'}</th>
                <th className="pb-3 font-semibold text-end">{lang === 'he' ? 'ריבית (מצטבר)' : 'Total Interest'}</th>
                <th className="pb-3 font-semibold text-end">{lang === 'he' ? 'יתרה סופית' : 'Total Balance'}</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {activeScheduleData.filter((_, i) => i > 0 && (i % Math.max(1, Math.floor(years / 20)) === 0 || i === years)).map((row) => (
                <tr key={row.year} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                  <td className="py-4 font-medium text-stone-900 text-center">{row.year}</td>
                  <td className="py-4 text-stone-600 text-end" dir="ltr">{currencyFormat.format(row.contributions)}</td>
                  <td className="py-4 text-emerald-600 font-medium text-end" dir="ltr">+{currencyFormat.format(row.interest)}</td>
                  <td className="py-4 font-bold text-stone-900 text-end" dir="ltr">{currencyFormat.format(row.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SEO EDUCATIONAL GUIDE & FORMULA BREAKDOWN */}
      <CalculatorGuide
        guideKey="compound"
        onApplyPreset={(preset) => {
          if (preset.contribution !== undefined) setContribution(Number(preset.contribution));
          if (preset.rate !== undefined) setRate(Number(preset.rate));
          if (preset.years !== undefined) setYears(Number(preset.years));
        }}
      />

      <FAQ items={guide.faq} />

      <RelatedCalculators currentId="compound" />
    </div>
  );
}

