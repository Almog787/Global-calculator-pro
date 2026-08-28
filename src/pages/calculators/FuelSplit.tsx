import { useState, useDeferredValue, useEffect } from 'react';
import SEO from '../../components/SEO';
import FAQ from '../../components/FAQ';
import RelatedCalculators from '../../components/RelatedCalculators';
import Decimal from 'decimal.js';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useI18n } from '../../contexts/i18n';
import { getGuideData } from '../../data/guideTranslations';
import { useMeasurementSystem } from '../../hooks/useMeasurementSystem';
import MeasurementToggle from '../../components/MeasurementToggle';

ChartJS.register(ArcElement, Tooltip, Legend);

const localDict = {
  en: {
    title: 'Fuel Split Calculator',
    description: 'Calculate and split travel costs fairly among passengers.',
    distance: 'Trip Distance',
    fuelEfficiency: 'Fuel Economy',
    fuelPrice: 'Fuel Price',
    passengers: 'Number of People',
    tolls: 'Tolls / Extra Costs',
    totalCost: 'Total Trip Cost',
    costPerPerson: 'Cost per Person',
  },
  he: {
    title: 'מחשבון השתתפות בדלק',
    description: 'חשב וחלק את עלויות הנסיעה (דלק, כבישי אגרה) באופן שווה בין הנוסעים.',
    distance: 'מרחק הנסיעה',
    fuelEfficiency: 'צריכת דלק',
    fuelPrice: 'מחיר דלק',
    passengers: 'מספר נוסעים',
    tolls: 'כבישי אגרה / הוצאות נוספות',
    totalCost: 'עלות נסיעה כוללת',
    costPerPerson: 'עלות לאדם',
  },
  es: {
    title: 'Calculadora de División de Combustible',
    description: 'Calcula y divide los costos de viaje equitativamente entre los pasajeros.',
    distance: 'Distancia del Viaje',
    fuelEfficiency: 'Consumo de Combustible',
    fuelPrice: 'Precio del Combustible',
    passengers: 'Número de Personas',
    tolls: 'Peajes / Costos Extras',
    totalCost: 'Costo Total del Viaje',
    costPerPerson: 'Costo por Persona',
  },
  fr: {
    title: 'Calculatrice de Partage de Carburant',
    description: 'Calculez et partagez équitablement les frais de trajet entre passagers.',
    distance: 'Distance du Trajet',
    fuelEfficiency: 'Consommation',
    fuelPrice: 'Prix du Carburant',
    passengers: 'Nombre de Personnes',
    tolls: 'Péages / Frais Annexes',
    totalCost: 'Coût Total du Trajet',
    costPerPerson: 'Coût par Personne',
  },
  ar: {
    title: 'حاسبة تقاسم الوقود',
    description: 'احسب وقسّم تكاليف السفر بالتساوي بين الركاب.',
    distance: 'مسافة الرحلة',
    fuelEfficiency: 'استهلاك الوقود',
    fuelPrice: 'سعر الوقود',
    passengers: 'عدد الأشخاص',
    tolls: 'رسوم المرور / تكاليف إضافية',
    totalCost: 'إجمالي تكلفة الرحلة',
    costPerPerson: 'التكلفة لكل شخص',
  }
};

export default function FuelSplit() {
  const { lang } = useI18n();
  const guide = getGuideData('fuel-split', lang);
  const t = localDict[lang as keyof typeof localDict] || localDict.en;
  const { system, setSystem } = useMeasurementSystem();

  const [distance, setDistance] = useState(150);
  const [fuelEfficiency, setFuelEfficiency] = useState(7.5); // L/100km or MPG
  const [fuelPrice, setFuelPrice] = useState(7.50);
  const [tolls, setTolls] = useState(30);
  const [passengers, setPassengers] = useState(3);

  const [results, setResults] = useState({ totalCost: 0, costPerPerson: 0, fuelCost: 0 });

  useEffect(() => {
    try {
      const decDist = new Decimal(distance || 0);
      const decEff = new Decimal(fuelEfficiency || 0);
      const decPrice = new Decimal(fuelPrice || 0);
      const decTolls = new Decimal(tolls || 0);
      const decPass = new Decimal(Math.max(1, passengers || 1));

      let fuelCost;
      if (system === 'metric') {
        // (Distance / 100) * Efficiency(L/100km) * Price(per L)
        fuelCost = decDist.div(100).mul(decEff).mul(decPrice);
      } else {
        // Distance(miles) / Efficiency(MPG) * Price(per Gallon)
        if (decEff.isZero()) {
          fuelCost = new Decimal(0);
        } else {
          fuelCost = decDist.div(decEff).mul(decPrice);
        }
      }

      const totalCost = fuelCost.add(decTolls);
      const costPerPerson = totalCost.div(decPass);

      setResults({
        totalCost: totalCost.toNumber(),
        costPerPerson: costPerPerson.toNumber(),
        fuelCost: fuelCost.toNumber()
      });
    } catch {
      setResults({ totalCost: 0, costPerPerson: 0, fuelCost: 0 });
    }
  }, [distance, fuelEfficiency, fuelPrice, tolls, passengers, system]);

  const defaultCurrency = lang === 'he' ? 'ILS' : 'USD';
  const currencyFormat = new Intl.NumberFormat(lang === 'en' ? 'en-US' : lang, { 
    style: 'currency', currency: defaultCurrency, minimumFractionDigits: 2, maximumFractionDigits: 2 
  });

  const chartData = {
    labels: ['Fuel Cost', t.tolls],
    datasets: [{
      data: [results.fuelCost, tolls],
      backgroundColor: ['#3b82f6', '#8b5cf6'],
      borderWidth: 0,
    }],
  };

  const chartOptions = {
    animation: false as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.label}: ${currencyFormat.format(context.raw || 0)}`,
        }
      }
    },
    cutout: '70%',
  };

  const deferredChartData = useDeferredValue(chartData);

  return (
    <div>
      <article className="w-full h-full flex flex-col lg:flex-row gap-8 items-start relative">
      {/* Input Form */}
      <div className="flex-[1.5] w-full bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-stone-200 flex flex-col">
      <SEO
        title={t.title}
        description={t.description}
        canonicalUrl={`/${lang}/calculators/fuel-split`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: t.title,
          description: t.description,
          applicationCategory: 'CalculatorApplication',
          operatingSystem: 'Any',
          url: `https://globalcalcpro.com/${lang}/calculators/fuel-split`
        }}
      />

      <div className="flex-[1.5] flex flex-col">
        <div className="mb-8 flex justify-between items-start flex-col sm:flex-row gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight mb-3">{t.title}</h1>
            <p className="text-stone-500 font-medium text-[15px] leading-relaxed max-w-md">{t.description}</p>
          </div>
          <MeasurementToggle system={system} onChange={setSystem} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="group">
<label className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">{t.distance} ({system === 'metric' ? 'km' : 'miles'})</label>
            <input type="number" value={distance} onChange={e => setDistance(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl md:text-3xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" />
          </div>
          <div className="group">
<label className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">{t.fuelEfficiency} ({system === 'metric' ? 'L/100km' : 'MPG'})</label>
            <input type="number" value={fuelEfficiency} onChange={e => setFuelEfficiency(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl md:text-3xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" />
          </div>
          <div className="group">
<label className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">{t.fuelPrice} ({system === 'metric' ? 'per L' : 'per Gallon'})</label>
            <input type="number" value={fuelPrice} onChange={e => setFuelPrice(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl md:text-3xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" />
          </div>
          <div className="group">
<label className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">{t.tolls}</label>
            <input type="number" value={tolls} onChange={e => setTolls(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl md:text-3xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" />
          </div>
          <div className="group">
<label className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-1 block group-focus-within:text-blue-600 transition-colors">{t.passengers}</label>
            <input type="number" value={passengers} onChange={e => setPassengers(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl md:text-3xl font-bold text-stone-900 focus:ring-0 focus:border-blue-600 transition-colors" />
          </div>
        </div></div>
      </div>
      {/* Sticky Results Dashboard */}
      <div className="flex-1 w-full lg:w-[420px] shrink-0 lg:sticky lg:top-24 bg-stone-900 rounded-3xl p-8 shadow-2xl border border-stone-800 text-white flex flex-col justify-between">

        <div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8">
            <div>
              <span className="text-xs tracking-wider uppercase font-bold text-stone-400 block mb-1">{t.costPerPerson}</span>
              <div className="text-3xl md:text-4xl font-headline text-blue-600" dir="ltr">{currencyFormat.format(results.costPerPerson)}</div>
            </div>
            <div>
              <span className="text-xs tracking-wider uppercase font-bold text-stone-400 block mb-1">{t.totalCost}</span>
              <div className="text-xl md:text-2xl font-black text-stone-900" dir="ltr">{currencyFormat.format(results.totalCost)}</div>
            </div>
          </div>
        </div>
      
        <div className="w-full h-[240px] bg-white/5 p-4 rounded-2xl border border-white/10 mt-6" dir="ltr">
          <Doughnut data={deferredChartData} options={chartOptions} />
        </div>
      </div>
    </article>

      {/* SEO EDUCATIONAL GUIDE & FORMULA BREAKDOWN */}
      <section className="w-full bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-xs border border-stone-200 mt-8 mb-8 space-y-8">
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
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold">1</span>
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

      <RelatedCalculators currentId="fuel-split" />
    </div>
  );
}
