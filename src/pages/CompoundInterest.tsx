import FAQ from '../components/FAQ';
import { useMemo } from 'react';
import SEO from '../components/SEO';
import Decimal from 'decimal.js';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useI18n } from '../contexts/i18n';
import Breadcrumbs from '../components/Breadcrumbs';
import RelatedCalculators from '../components/RelatedCalculators';
import { getGuideData } from '../data/guideTranslations';
import ShareActions from '../components/ShareActions';
import { useCalculatorState } from '../hooks/useCalculatorState';

export default function CompoundInterest() {
  const { t, lang } = useI18n();
  const guide = getGuideData('compound', lang);
  
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

  const { futureValue, totalContributions, totalInterest, scheduleData } = useMemo(() => {
    try {
      const decP = new Decimal(principal || 0);
      const decRate = new Decimal(rate || 0).div(100).div(12);
      const decN = new Decimal(years || 0).mul(12);
      const decContr = new Decimal(contribution || 0);

      let fv;
      if (decRate.isZero()) {
        fv = decP.add(decContr.mul(decN));
      } else {
        const rateFactor = decRate.add(1).pow(decN.toNumber());
        const pGrowth = decP.mul(rateFactor);
        const cGrowth = decContr.mul(rateFactor.sub(1)).div(decRate);
        fv = pGrowth.add(cGrowth);
      }

      const tc = decP.add(decContr.mul(decN));
      const ti = fv.sub(tc);

      // Generate schedule data for recharts & table
      const schedule = [];
      for (let i = 0; i <= years; i++) {
        const n = i * 12;
        let yrFv;
        if (decRate.isZero()) {
          yrFv = decP.add(decContr.mul(n));
        } else {
          const rf = decRate.add(1).pow(n);
          const pg = decP.mul(rf);
          const cg = decContr.mul(rf.sub(1)).div(decRate);
          yrFv = pg.add(cg);
        }
        const yrTc = decP.add(decContr.mul(n));
        const yrTi = yrFv.sub(yrTc);

        schedule.push({
          year: i,
          contributions: Math.round(yrTc.toNumber()),
          interest: Math.round(yrTi.toNumber()),
          total: Math.round(yrFv.toNumber())
        });
      }

      return {
        futureValue: fv.isFinite() ? fv.toNumber() : 0,
        totalContributions: tc.isFinite() ? tc.toNumber() : 0,
        totalInterest: ti.isFinite() ? ti.toNumber() : 0,
        scheduleData: schedule
      };
    } catch {
      return { futureValue: 0, totalContributions: 0, totalInterest: 0, scheduleData: [] };
    }
  }, [principal, rate, years, contribution]);

  const defaultCurrency = lang === 'he' ? 'ILS' : lang === 'fr' || lang === 'es' ? 'EUR' : 'USD';
  const currencyFormat = new Intl.NumberFormat(lang === 'en' ? 'en-US' : lang, { style: 'currency', currency: defaultCurrency, minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const compactFormat = new Intl.NumberFormat(lang === 'en' ? 'en-US' : lang, { style: 'currency', currency: defaultCurrency, notation: 'compact', compactDisplay: 'short' });

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
        <div className="mb-10">
          
          <h2 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight mb-3">{t.compoundTitle}</h2>
          <p className="text-stone-500 font-medium text-[15px] leading-relaxed max-w-sm">{t.compoundExplanation}</p>
        
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-8">
            
            <div className="group">
              <label htmlFor="ci-principal" className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">{t.initialInvestment}</label>
              <input id="ci-principal" aria-label={t.initialInvestment} type="number" value={principal} onChange={e => setPrincipal(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-3xl md:text-4xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" />
            </div>
            <div className="group">
              <label htmlFor="ci-contribution" className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">{t.monthlyContribution}</label>
              <input id="ci-contribution" aria-label={t.monthlyContribution} type="number" value={contribution} onChange={e => setContribution(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-3xl md:text-4xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" />
            </div>
            <div className="group">
              <label htmlFor="ci-rate" className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">{t.interestRate}</label>
              <input id="ci-rate" aria-label={t.interestRate} type="number" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-3xl md:text-4xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" />
            </div>
            <div className="group">
              <label htmlFor="ci-years" className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">{t.yearsToGrow}</label>
              <input id="ci-years" aria-label={t.yearsToGrow} type="number" value={years} onChange={e => setYears(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-3xl md:text-4xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" />
            </div>
          
          </div>
        </div>

        <ShareActions
          onSaveHistory={saveToHistory}
          historyEntries={getHistory()}
          onLoadHistory={loadFromHistory}
        />
      </div>
      
      {/* Sticky Results Dashboard */}
      <div className="w-full lg:w-[460px] shrink-0 lg:sticky lg:top-24 bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-800 text-white flex flex-col">
          
            <div className="mb-6">
              <span className="text-xs tracking-wider uppercase font-bold text-stone-400 block mb-2">{t.futureValue}</span>
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight" dir="ltr">{currencyFormat.format(futureValue)}</div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-8">

              <div className="p-4 sm:p-5 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-xs tracking-wider uppercase font-bold text-stone-400 block mb-1">{t.totalContributions}</span>
                <div className="text-lg md:text-xl font-headline text-stone-400" dir="ltr">{currencyFormat.format(totalContributions)}</div>
              </div>
              <div className="p-4 sm:p-5 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-xs tracking-wider uppercase font-bold text-stone-400 block mb-1">{t.totalInterestEarned}</span>
                <div className="text-lg md:text-xl font-bold text-blue-400" dir="ltr">+{currencyFormat.format(totalInterest)}</div>
              </div>
            </div>
          
          <div className="w-full h-[260px] bg-white/5 p-4 rounded-2xl border border-white/10 mt-6" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scheduleData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
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
              {scheduleData.filter((_, i) => i > 0 && (i % Math.max(1, Math.floor(years / 20)) === 0 || i === years)).map((row) => (
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
      <section className="w-full bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-sm border border-stone-200 mt-8 mb-8 space-y-8">
        <div className="border-b border-stone-200 pb-6">
          <h2 className="text-2xl sm:text-3xl font-headline font-bold text-stone-900 tracking-tight mb-3">
            {guide.guideTitle}
          </h2>
          <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
            {guide.guideDesc}
          </p>
        </div>

        {guide.formulaHeading && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold">1</span>
              {guide.formulaHeading}
            </h3>
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 font-mono text-xs sm:text-sm text-stone-800 space-y-2">
              {guide.formulaLines?.map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
          </div>
        )}
      </section>

      <FAQ items={guide.faq} />

      <RelatedCalculators currentId="compound" />
    </div>
  </div>
  );
}

