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
import { useCalculatorState } from '../../hooks/useCalculatorState';
import { calculateCompoundInterest, calculateTargetSavings } from '../../lib/math/finance';


export default function CompoundInterest() {
  const { t, lang, guides } = useI18n();
  const guide = guides['compound'] || { guideTitle: 'Guide & Formulas', guideDesc: 'Comprehensive calculation breakdown and FAQs.', faq: [] };
  
  const [mode, setMode] = useState<'growth' | 'target'>('growth');
  const [targetGoal, setTargetGoal] = useState<number>(1000000);

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

  // For chart display in target mode, we project using the computed monthly contribution
  const activeContribution = mode === 'growth' ? contribution : targetResult.requiredMonthlyContribution;
  const activeFutureValue = mode === 'growth' ? growthResult.futureValue : targetResult.totalSaved;
  const activeTotalContributions = mode === 'growth' ? growthResult.totalContributions : targetResult.totalContributions;
  const activeTotalInterest = mode === 'growth' ? growthResult.totalInterest : targetResult.totalInterest;

  const activeScheduleData = useMemo(() => {
    if (mode === 'growth') return growthResult.scheduleData;
    return calculateCompoundInterest(principal, rate, years, targetResult.requiredMonthlyContribution).scheduleData;
  }, [mode, growthResult.scheduleData, principal, rate, years, targetResult.requiredMonthlyContribution]);

  const defaultCurrency = lang === 'he' ? 'ILS' : lang === 'fr' || lang === 'es' ? 'EUR' : 'USD';
  const currencyFormat = new Intl.NumberFormat(lang === 'en' ? 'en-US' : lang, { style: 'currency', currency: defaultCurrency, minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const compactFormat = new Intl.NumberFormat(lang === 'en' ? 'en-US' : lang, { style: 'currency', currency: defaultCurrency, notation: 'compact', compactDisplay: 'short' });

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
    en: { growth: 'Investment Growth (Standard)', target: 'Reverse Goal Planner (Target)' },
    he: { growth: 'צמיחת הון והשקעה (רגיל)', target: 'מתכנן יעד: חישוב הפקדה חודשית (הפוך)' },
    es: { growth: 'Crecimiento de Inversión', target: 'Planificador de Meta (Inverso)' },
    fr: { growth: 'Croissance de l\'Épargne', target: 'Planificateur d\'Objectif (Inverse)' },
    ar: { growth: 'نمو الاستثمار (قياسي)', target: 'مخطط الهدف المالي (عكسي)' },
  }[lang] || { growth: 'Investment Growth', target: 'Reverse Goal Planner' };

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
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all ${
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
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              mode === 'target'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {modeLabels.target}
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight mb-2">
            {mode === 'growth' ? t.compoundTitle : modeLabels.target}
          </h2>
          <p className="text-stone-500 font-medium text-[14px] leading-relaxed max-w-lg">
            {mode === 'growth'
              ? t.compoundExplanation
              : (lang === 'he' ? 'הגדר את יעד ההון הסופי שלך וחשב כמה עליך לחסוך בכל חודש.' : 'Set your desired future wealth goal and discover the required monthly contribution.')}
          </p>
        </div>

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

        <ShareActions
          calculatorTitle={t.compoundTitle}
          calculatorPath="/compound-interest"
          onSaveHistory={saveToHistory}
          historyEntries={getHistory()}
          onLoadHistory={loadFromHistory}
        />
      </div>
      </div>
      
      {/* Sticky Results Dashboard */}
      <div className="w-full lg:w-[460px] shrink-0 lg:sticky lg:top-24 bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-800 text-white flex flex-col">
          
        <div className="mb-6">
          <span className="text-xs tracking-wider uppercase font-bold text-stone-400 block mb-2">
            {mode === 'growth' ? t.futureValue : (lang === 'he' ? 'הפקדה חודשית נדרשת' : lang === 'es' ? 'Aporte Mensual Requerido' : lang === 'fr' ? 'Épargne Mensuelle Requise' : lang === 'ar' ? 'الادخار الشهري المطلوب' : 'Required Monthly Savings')}
          </span>
          <div className="text-4xl sm:text-5xl font-black text-white tracking-tight" dir="ltr">
            {currencyFormat.format(mode === 'growth' ? activeFutureValue : activeContribution)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 sm:p-5 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-xs tracking-wider uppercase font-bold text-stone-400 block mb-1">
              {mode === 'growth' ? t.totalContributions : (lang === 'he' ? 'יעד הון סופי' : 'Target Goal')}
            </span>
            <div className="text-lg md:text-xl font-headline text-stone-300" dir="ltr">
              {currencyFormat.format(mode === 'growth' ? activeTotalContributions : activeFutureValue)}
            </div>
          </div>
          <div className="p-4 sm:p-5 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-xs tracking-wider uppercase font-bold text-stone-400 block mb-1">{t.totalInterestEarned}</span>
            <div className="text-lg md:text-xl font-bold text-blue-400" dir="ltr">+{currencyFormat.format(activeTotalInterest)}</div>
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

