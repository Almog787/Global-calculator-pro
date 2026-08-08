import { useState, useDeferredValue, useEffect } from 'react';
import SEO from '../../components/SEO';
import Decimal from 'decimal.js';
import { Doughnut } from 'react-chartjs-2';
import { useI18n } from '../../contexts/i18n';

const localDict = {
  en: {
    title: 'Fuel Split Calculator',
    description: 'Calculate and split travel costs fairly among passengers.',
    distance: 'Trip Distance',
    fuelEfficiency: 'Fuel Economy (per 100 distance)',
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
    fuelEfficiency: 'צריכת דלק (ליטר ל-100 ק"מ)',
    fuelPrice: 'מחיר ליטר דלק',
    passengers: 'מספר נוסעים',
    tolls: 'כבישי אגרה / הוצאות נוספות',
    totalCost: 'עלות נסיעה כוללת',
    costPerPerson: 'עלות לאדם',
  },
  es: {
    title: 'Calculadora de División de Combustible',
    description: 'Calcula y divide los costos de viaje equitativamente entre los pasajeros.',
    distance: 'Distancia del Viaje',
    fuelEfficiency: 'Consumo de Combustible (L/100km)',
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
    fuelEfficiency: 'Consommation (L/100km)',
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
    fuelEfficiency: 'استهلاك الوقود (لتر لكل 100 كم)',
    fuelPrice: 'سعر الوقود',
    passengers: 'عدد الأشخاص',
    tolls: 'رسوم المرور / تكاليف إضافية',
    totalCost: 'إجمالي تكلفة الرحلة',
    costPerPerson: 'التكلفة لكل شخص',
  }
};

export default function FuelSplit() {
  const { lang, t: globalT } = useI18n();
  const t = localDict[lang as keyof typeof localDict] || localDict.en;

  const [distance, setDistance] = useState(150);
  const [fuelEfficiency, setFuelEfficiency] = useState(7.5);
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

      // (Distance / 100) * Efficiency * Price
      const fuelCost = decDist.div(100).mul(decEff).mul(decPrice);
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
  }, [distance, fuelEfficiency, fuelPrice, tolls, passengers]);

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
    <article className="w-full h-full flex flex-col lg:flex-row bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-stone-200 gap-10">
      <SEO
        title={t.title}
        description={t.description}
        canonicalUrl="/calculators/fuel-split"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: t.title,
          description: t.description,
          applicationCategory: 'CalculatorApplication',
          operatingSystem: 'Any',
          url: `https://globalcalcpro.com${"/calculators/fuel-split"}`
        }}
      />

      <div className="flex-[1.5] flex flex-col">
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-headline text-stone-900 tracking-tight mb-3">{t.title}</h1>
          <p className="text-stone-500 font-medium text-[15px] leading-relaxed max-w-md">{t.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.distance}</label>
            <input type="number" value={distance} onChange={e => setDistance(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
          </div>
          <div>
            <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.fuelEfficiency}</label>
            <input type="number" value={fuelEfficiency} onChange={e => setFuelEfficiency(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
          </div>
          <div>
            <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.fuelPrice}</label>
            <input type="number" value={fuelPrice} onChange={e => setFuelPrice(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
          </div>
          <div>
            <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.tolls}</label>
            <input type="number" value={tolls} onChange={e => setTolls(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
          </div>
          <div>
            <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.passengers}</label>
            <input type="number" value={passengers} onChange={e => setPassengers(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-200">
          <div className="grid grid-cols-2 gap-x-4 gap-y-8">
            <div>
              <span className="text-xs tracking-wider uppercase font-bold text-stone-600 block mb-1">{t.costPerPerson}</span>
              <div className="text-3xl md:text-4xl font-headline text-blue-600" dir="ltr">{currencyFormat.format(results.costPerPerson)}</div>
            </div>
            <div>
              <span className="text-xs tracking-wider uppercase font-bold text-stone-600 block mb-1">{t.totalCost}</span>
              <div className="text-xl md:text-2xl font-headline text-stone-900" dir="ltr">{currencyFormat.format(results.totalCost)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center border-t lg:border-t-0 lg:border-l lg:rtl:border-r lg:rtl:border-l-0 border-stone-200 pt-10 lg:pt-0 lg:pl-10 lg:rtl:pr-10 lg:rtl:pl-0">
        <div className="w-full h-[320px]" dir="ltr">
          <Doughnut data={deferredChartData} options={chartOptions} />
        </div>
      </div>
    </article>
  );
}
