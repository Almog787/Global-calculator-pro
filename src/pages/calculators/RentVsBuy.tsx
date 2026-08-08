import { useState, useDeferredValue, useEffect } from 'react';
import SEO from '../../components/SEO';
import Decimal from 'decimal.js';
import { Doughnut } from 'react-chartjs-2';
import { useI18n } from '../../contexts/i18n';

const localDict = {
  en: {
    title: 'Rent vs Buy Calculator',
    description: 'Compare the financial costs of renting versus buying a home over 10 years.',
    homePrice: 'Home Price',
    monthlyRent: 'Current Monthly Rent',
    downPayment: 'Down Payment (%)',
    interestRate: 'Mortgage Rate (%)',
    buyCost: '10-Year Cost of Buying',
    rentCost: '10-Year Cost of Renting',
    winner: 'Financial Winner',
  },
  he: {
    title: 'מחשבון קנייה או שכירות',
    description: 'השווה את העלויות הפיננסיות של שכירות מול קניית דירה על פני עשור.',
    homePrice: 'מחיר הדירה',
    monthlyRent: 'שכר דירה חודשי',
    downPayment: 'הון עצמי (%)',
    interestRate: 'ריבית משכנתא (%)',
    buyCost: 'עלות קנייה (10 שנים)',
    rentCost: 'עלות שכירות (10 שנים)',
    winner: 'משתלם יותר',
  },
  es: {
    title: 'Calculadora de Alquilar vs Comprar',
    description: 'Compara los costos financieros de alquilar frente a comprar una vivienda a 10 años.',
    homePrice: 'Precio de la Vivienda',
    monthlyRent: 'Alquiler Mensual Actual',
    downPayment: 'Pago Inicial (%)',
    interestRate: 'Tasa de Hipoteca (%)',
    buyCost: 'Costo de Comprar (10 años)',
    rentCost: 'Costo de Alquilar (10 años)',
    winner: 'Opción Más Ventajosa',
  },
  fr: {
    title: 'Calculatrice Louer vs Acheter',
    description: 'Comparez les coûts financiers de la location par rapport à l\'achat d\'un logement sur 10 ans.',
    homePrice: 'Prix du Logement',
    monthlyRent: 'Loyer Mensuel Actuel',
    downPayment: 'Apport Personnel (%)',
    interestRate: 'Taux Hypothécaire (%)',
    buyCost: 'Coût de l\'Achat (10 ans)',
    rentCost: 'Coût de la Location (10 ans)',
    winner: 'Choix Le Plus Avantageux',
  },
  ar: {
    title: 'حاسبة الإيجار مقابل الشراء',
    description: 'قارن التكاليف المالية للاستئجار مقابل شراء منزل على مدى 10 سنوات.',
    homePrice: 'سعر المنزل',
    monthlyRent: 'الإيجار الشهري الحالي',
    downPayment: 'الدفعة الأولى (%)',
    interestRate: 'معدل الفائدة على الرهن (%)',
    buyCost: 'تكلفة الشراء (10 سنوات)',
    rentCost: 'تكلفة الإيجار (10 سنوات)',
    winner: 'الخيار الأكثر فائدة مالية',
  }
};

export default function RentVsBuy() {
  const { lang, t: globalT } = useI18n();
  const t = localDict[lang as keyof typeof localDict] || localDict.en;

  const [homePrice, setHomePrice] = useState(400000);
  const [rent, setRent] = useState(2000);
  const [downPercent, setDownPercent] = useState(20);
  const [rate, setRate] = useState(5.5);

  const [results, setResults] = useState({ buyTotal: 0, rentTotal: 0, isBuyBetter: true });

  useEffect(() => {
    try {
      const decPrice = new Decimal(homePrice || 0);
      const decRent = new Decimal(rent || 0);
      const decRate = new Decimal(rate || 0).div(100).div(12);
      const decDownPercent = new Decimal(downPercent || 0).div(100);
      
      const downPayment = decPrice.mul(decDownPercent);
      const principal = decPrice.sub(downPayment);
      const termMonths = 360; // 30 year standard mortgage
      
      let mp = new Decimal(0);
      if (decRate.isZero()) {
        mp = principal.div(termMonths);
      } else {
        const rateFactor = decRate.add(1).pow(termMonths);
        mp = principal.mul(decRate.mul(rateFactor)).div(rateFactor.sub(1));
      }

      // Simplified 10 year projection
      const months = 120;
      
      // Renting: assume 3% annual rent increase
      let totalRent = new Decimal(0);
      let currentRent = decRent;
      for (let i = 0; i < 10; i++) {
        totalRent = totalRent.add(currentRent.mul(12));
        currentRent = currentRent.mul(1.03); // 3% inflation
      }

      // Buying: Down payment + (Mortgage + 1% property tax/maint) * 120 - Equity Gained - Property Appreciation
      const monthlyTaxMaint = decPrice.mul(0.01).div(12); // 1% annual
      const totalPayments = mp.add(monthlyTaxMaint).mul(months).add(downPayment);
      
      // Rough equity after 10 years (amortization approximation)
      // FV of mortgage after 120 payments
      const rateFactor10y = decRate.add(1).pow(months);
      const balanceAfter10y = principal.mul(rateFactor10y).sub(mp.mul(rateFactor10y.sub(1)).div(decRate));
      const equityGained = decPrice.sub(balanceAfter10y);
      
      // Assume 3% annual appreciation
      const futureHomeValue = decPrice.mul(Math.pow(1.03, 10));
      const appreciation = futureHomeValue.sub(decPrice);

      // Total Cost of Buying = Cash Outflow - Wealth Gained
      let buyTotalCost = totalPayments.sub(equityGained).sub(appreciation);
      if (buyTotalCost.isNegative()) buyTotalCost = new Decimal(0);

      setResults({
        buyTotal: buyTotalCost.toNumber(),
        rentTotal: totalRent.toNumber(),
        isBuyBetter: buyTotalCost.toNumber() < totalRent.toNumber(),
      });
    } catch {
      setResults({ buyTotal: 0, rentTotal: 0, isBuyBetter: true });
    }
  }, [homePrice, rent, downPercent, rate]);

  const defaultCurrency = lang === 'he' ? 'ILS' : 'USD';
  const currencyFormat = new Intl.NumberFormat(lang === 'en' ? 'en-US' : lang, { 
    style: 'currency', currency: defaultCurrency, minimumFractionDigits: 0, maximumFractionDigits: 0 
  });

  const chartData = {
    labels: [t.buyCost, t.rentCost],
    datasets: [{
      data: [Math.max(0, results.buyTotal), results.rentTotal],
      backgroundColor: ['#3b82f6', '#f43f5e'],
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
        canonicalUrl="/calculators/rent-vs-buy"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: t.title,
          description: t.description,
          applicationCategory: 'CalculatorApplication',
          operatingSystem: 'Any',
          url: `https://globalcalcpro.com${"/calculators/rent-vs-buy"}`
        }}
      />

      <div className="flex-[1.5] flex flex-col">
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-headline text-stone-900 tracking-tight mb-3">{t.title}</h1>
          <p className="text-stone-500 font-medium text-[15px] leading-relaxed max-w-md">{t.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.homePrice}</label>
            <input type="number" value={homePrice} onChange={e => setHomePrice(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
          </div>
          <div>
            <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.monthlyRent}</label>
            <input type="number" value={rent} onChange={e => setRent(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
          </div>
          <div>
            <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.downPayment}</label>
            <input type="number" value={downPercent} onChange={e => setDownPercent(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
          </div>
          <div>
            <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.interestRate}</label>
            <input type="number" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-200">
          <div className="grid grid-cols-2 gap-x-4 gap-y-8">
            <div>
              <span className="text-xs tracking-wider uppercase font-bold text-stone-600 block mb-1">{t.buyCost}</span>
              <div className="text-3xl md:text-4xl font-headline text-blue-600" dir="ltr">{currencyFormat.format(results.buyTotal)}</div>
            </div>
            <div>
              <span className="text-xs tracking-wider uppercase font-bold text-stone-600 block mb-1">{t.rentCost}</span>
              <div className="text-3xl md:text-4xl font-headline text-rose-500" dir="ltr">{currencyFormat.format(results.rentTotal)}</div>
            </div>
          </div>
          <div className="mt-6">
            <span className="inline-block px-4 py-2 rounded-full bg-stone-100 text-stone-800 text-sm font-bold tracking-wide">
              {t.winner}: <span className={results.isBuyBetter ? 'text-blue-600' : 'text-rose-500'}>{results.isBuyBetter ? 'Buying' : 'Renting'}</span>
            </span>
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
