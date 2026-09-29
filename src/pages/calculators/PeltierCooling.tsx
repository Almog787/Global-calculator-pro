import React, { useDeferredValue, useMemo } from 'react';
import { ThermometerSnowflake } from 'lucide-react';
import { useI18n } from '../../contexts/i18n';
import SEO from '../../components/SEO';
import Breadcrumbs from '../../components/Breadcrumbs';
import RelatedCalculators from '../../components/RelatedCalculators';
import CalculatorGuide from '../../components/CalculatorGuide';
import ScenarioPresets from '../../components/ScenarioPresets';
import ShareActions from '../../components/ShareActions';
import CountUp from '../../components/CountUp';
import ShinyText from '../../components/ShinyText';
import FAQ from '../../components/FAQ';
import DisclaimerNotice from '../../components/DisclaimerNotice';
import { useCalculatorState } from '../../hooks/useCalculatorState';
import Decimal from 'decimal.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

const localDict = {
  en: {
    title: 'Peltier Cooling & TEC Calculator',
    subtitle: 'Calculate Cooling Power (Qc), Power Consumption & Efficiency (COP) for Thermoelectric Coolers',
    description: 'Calculate the expected heat pumping capacity, power consumption, and Coefficient of Performance (COP) of a Peltier module (TEC1-12706, TEC1-12710, etc.) under real temperature differentials.',
    maxCooling: 'Max Cooling Capacity (Qmax in Watts)',
    maxCoolingDesc: 'Module rated cooling power at ΔT = 0°C (e.g. 60W for TEC1-12706)',
    maxDeltaT: 'Maximum Temp Difference (ΔTmax in °C)',
    maxDeltaTDesc: 'Maximum temperature differential at zero heat load (typically 65°C-70°C)',
    operatingDeltaT: 'Operating Temp Difference (ΔT in °C)',
    operatingDeltaTDesc: 'Temperature difference between hot and cold sides (Thot - Tcold)',
    voltage: 'Operating Voltage (V)',
    voltageDesc: 'Applied DC voltage (e.g. 12V)',
    current: 'Operating Current (A)',
    currentDesc: 'Drawn electric current (e.g. 4.5A)',
    coolingCapacity: 'Actual Heat Pumped (Qc)',
    powerConsumption: 'Electrical Power Input',
    cop: 'Efficiency (COP)',
    copDesc: 'Coefficient of Performance (Cooling Power / Electric Power)',
    chartTitle: 'Cooling Power vs Electric Consumption',
    chartCooling: 'Cooling Capacity (Qc)',
    chartPower: 'Electrical Power (Pin)',
    faqTitle: 'Frequently Asked Questions: Thermoelectric Peltier Cooling',
  },
  he: {
    title: 'מחשבון קירור פלטייה ותרמואלקטרי (Peltier TEC)',
    subtitle: 'חישוב תפוקת קירור (Qc), צריכת חשמל ומקדם יעילות (COP) לרכיבי Peltier',
    description: 'מחשבון קירור פלטייה מדויק: חישוב עוצמת סילוק חום, הספק חשמלי ומקדם יעילות (COP) לרכיבי TEC1-12706 ודגמים נוספים בהפרשי טמפרטורה שונים.',
    maxCooling: 'הספק קירור נומינלי מקסימלי (Qmax בוואט)',
    maxCoolingDesc: 'הספק הקירור המרבי לפי היצרן ב-ΔT = 0 (למשל 60W ב-TEC1-12706)',
    maxDeltaT: 'הפרש טמפרטורה מקסימלי (ΔTmax ב-°C)',
    maxDeltaTDesc: 'הפרש הטמפרטורה המרבי בעומס חום אפס (לרוב 65°C-70°C)',
    operatingDeltaT: 'הפרש טמפרטורה בפועל (ΔT ב-°C)',
    operatingDeltaTDesc: 'ההפרש בין הצד החם לצד הקר (Thot - Tcold)',
    voltage: 'מתח עבודה (V)',
    voltageDesc: 'מתח DC מוזן (למשל 12 וולט)',
    current: 'זרם עבודה (A)',
    currentDesc: 'צריכת הזרם הנצרכת (למשל 4.5 אמפר)',
    coolingCapacity: 'תפוקת קירור בפועל (Qc)',
    powerConsumption: 'צריכת הספק חשמלי',
    cop: 'מקדם יעילות (COP)',
    copDesc: 'יחס תפוקת הקירור להספק החשמלי המושקע',
    chartTitle: 'השוואת תפוקת קירור מול צריכת חשמל',
    chartCooling: 'הספק קירור (Qc)',
    chartPower: 'הספק חשמלי (Pin)',
    faqTitle: 'שאלות ותשובות נפוצות: קירור באמצעות רכיב פלטייה',
  },
  es: {
    title: 'Calculadora de Refrigeración Peltier (TEC)',
    subtitle: 'Calcula capacidad de enfriamiento, consumo eléctrico y eficiencia (COP)',
    description: 'Calcula el rendimiento de módulos termoeléctricos Peltier bajo diferentes saltos térmicos.',
    maxCooling: 'Capacidad Máxima (Qmax en W)',
    maxCoolingDesc: 'Potencia nominal a ΔT = 0',
    maxDeltaT: 'Diferencia Máxima (ΔTmax en °C)',
    maxDeltaTDesc: 'Salto térmico límite',
    operatingDeltaT: 'Diferencia de Temp. Real (ΔT en °C)',
    operatingDeltaTDesc: 'Thot - Tcold',
    voltage: 'Voltaje (V)',
    voltageDesc: 'Tensión aplicada',
    current: 'Corriente (A)',
    currentDesc: 'Intensidad en amperios',
    coolingCapacity: 'Capacidad Real de Frío',
    powerConsumption: 'Consumo Eléctrico',
    cop: 'Eficiencia (COP)',
    copDesc: 'Coeficiente de rendimiento',
    chartTitle: 'Frío Producido vs Potencia Eléctrica',
    chartCooling: 'Capacidad de Frío',
    chartPower: 'Potencia Eléctrica',
    faqTitle: 'Preguntas Frecuentes sobre Células Peltier',
  },
  fr: {
    title: 'Calculateur de Refroidissement Peltier (TEC)',
    subtitle: 'Calculez puissance frigorifique, consommation et coefficient de performance (COP)',
    description: 'Évaluez les performances thermiques et électriques d\'un module thermoélectrique Peltier.',
    maxCooling: 'Puissance Frigorifique Max (Qmax en W)',
    maxCoolingDesc: 'Puissance nominale à ΔT = 0',
    maxDeltaT: 'Écart de Température Max (ΔTmax en °C)',
    maxDeltaTDesc: 'Différence thermique maximale',
    operatingDeltaT: 'Écart Thermique Réel (ΔT en °C)',
    operatingDeltaTDesc: 'Thot - Tcold',
    voltage: 'Tension (V)',
    voltageDesc: 'Tension continue appliquée',
    current: 'Courant (A)',
    currentDesc: 'Courant absorbé',
    coolingCapacity: 'Puissance Frigorifique Réelle',
    powerConsumption: 'Puissance Électrique',
    cop: 'Coefficient de Performance (COP)',
    copDesc: 'Rendement énergétique',
    chartTitle: 'Puissance Frigorifique vs Consommation',
    chartCooling: 'Froid Utile',
    chartPower: 'Puissance Électrique',
    faqTitle: 'Questions Fréquentes sur l\'Effet Peltier',
  },
  ar: {
    title: 'حاسبة التبريد الكهروحراري (Peltier TEC)',
    subtitle: 'احسب قدرة التبريد واستهلاك الطاقة ومعامل الأداء (COP) لوحدات بلتيير',
    description: 'احسب سعة ضخ الحرارة واستهلاك الكهرباء وكفاءة الأداء لمبردات بلتيير تحت فروق درجات الحرارة المختلفة.',
    maxCooling: 'أقصى قدرة تبريد (Qmax بالواط)',
    maxCoolingDesc: 'القدرة المصنفة عند فرق حرارة صفر',
    maxDeltaT: 'أقصى فرق درجات حرارة (ΔTmax بالمئوية)',
    maxDeltaTDesc: 'أقصى فارق حراري ممكن',
    operatingDeltaT: 'فرق الحرارة التشغيلي (ΔT بالمئوية)',
    operatingDeltaTDesc: 'حرارة الجانب الساخن ناقص البارد',
    voltage: 'جهد التشغيل (فولت)',
    voltageDesc: 'الجهد الكهربائي المباشر',
    current: 'تيار التشغيل (أمبير)',
    currentDesc: 'التيار الكهربائي المستهلك',
    coolingCapacity: 'سعة التبريد الفعلية',
    powerConsumption: 'القدرة الكهربائية المستهلكة',
    cop: 'معامل الأداء (COP)',
    copDesc: 'كفاءة استهلاك الطاقة',
    chartTitle: 'سعة التبريد مقابل استهلاك الكهرباء',
    chartCooling: 'سعة التبريد',
    chartPower: 'الطاقة الكهربائية',
    faqTitle: 'الأسئلة الشائعة حول تبريد بلتيير',
  }
};

export default function PeltierCooling() {
  const { lang, guides } = useI18n();
  const guide = guides['peltier-cooling'] || { guideTitle: 'Guide & Formulas', guideDesc: 'Comprehensive calculation breakdown and FAQs.', faq: [] };
  const t = localDict[lang as keyof typeof localDict] || localDict.en;

  const { state, updateState, saveToHistory, loadFromHistory, getHistory } = useCalculatorState('peltier-cooling', {
    qmax: 60,
    deltaTmax: 68,
    operatingDeltaT: 25,
    voltage: 12,
    current: 4.8,
  });

  const { qmax, deltaTmax, operatingDeltaT, voltage, current } = state;

  const setQmax = (v: number) => updateState({ qmax: v });
  const setDeltaTmax = (v: number) => updateState({ deltaTmax: v });
  const setOperatingDeltaT = (v: number) => updateState({ operatingDeltaT: v });
  const setVoltage = (v: number) => updateState({ voltage: v });
  const setCurrent = (v: number) => updateState({ current: v });

  const results = useMemo(() => {
    try {
      const decQmax = new Decimal(qmax || 0);
      const decDtMax = new Decimal(deltaTmax || 1);
      const decOpDt = new Decimal(operatingDeltaT || 0);
      const decV = new Decimal(voltage || 0);
      const decI = new Decimal(current || 0);

      // Linear thermal pumping model: Qc = Qmax * (1 - ΔT / ΔTmax)
      let capacity = decQmax.mul(new Decimal(1).sub(decOpDt.div(decDtMax)));
      if (capacity.isNegative()) capacity = new Decimal(0);

      const power = decV.mul(decI);
      let cop = new Decimal(0);
      if (!power.isZero()) {
        cop = capacity.div(power);
      }

      return {
        capacity: Math.round(capacity.toNumber() * 10) / 10,
        power: Math.round(power.toNumber() * 10) / 10,
        cop: Math.round(cop.toNumber() * 100) / 100,
      };
    } catch {
      return {
        capacity: 0,
        power: 0,
        cop: 0,
      };
    }
  }, [qmax, deltaTmax, operatingDeltaT, voltage, current]);

  const chartData = useMemo(() => {
    return {
      labels: [t.chartCooling, t.chartPower],
      datasets: [
        {
          label: 'Watts (W)',
          data: [results.capacity, results.power],
          backgroundColor: ['#0284c7', '#ef4444'],
          borderRadius: 12,
        },
      ],
    };
  }, [results.capacity, results.power, t]);

  const deferredChartData = useDeferredValue(chartData);

  const presets = [
    {
      label: 'TEC1-12706 Standard (60W / 12V)',
      values: { qmax: 60, deltaTmax: 68, operatingDeltaT: 25, voltage: 12, current: 4.8 }
    },
    {
      label: 'TEC1-12710 High Power (95W / 12V)',
      values: { qmax: 95, deltaTmax: 66, operatingDeltaT: 30, voltage: 12, current: 7.5 }
    },
    {
      label: 'CPU Direct Sub-Ambient Cooling',
      values: { qmax: 120, deltaTmax: 70, operatingDeltaT: 15, voltage: 12, current: 10 }
    },
    {
      label: 'Mini Portable Cooler Box',
      values: { qmax: 45, deltaTmax: 65, operatingDeltaT: 35, voltage: 12, current: 3.5 }
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      <SEO
        title={t.title}
        description={t.description}
        keywords={['peltier cooling calculator', 'thermoelectric cooler', 'TEC1-12706', 'קירור פלטייה', 'COP']}
      />

      <Breadcrumbs
        items={[
          { label: lang === 'he' ? 'מדע והנדסה' : 'Science & Math', path: `/${lang}/category/science` },
          { label: t.title },
        ]}
      />

      <ScenarioPresets
        presets={presets}
        onSelect={(val) => {
          if (val.qmax !== undefined) setQmax(val.qmax);
          if (val.deltaTmax !== undefined) setDeltaTmax(val.deltaTmax);
          if (val.operatingDeltaT !== undefined) setOperatingDeltaT(val.operatingDeltaT);
          if (val.voltage !== undefined) setVoltage(val.voltage);
          if (val.current !== undefined) setCurrent(val.current);
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Card */}
        <div className="lg:col-span-7 bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3.5 pb-4 border-b border-stone-100 dark:border-stone-800">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-xs">
              <ThermometerSnowflake className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
                {t.title}
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-medium">
                {t.subtitle}
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Qmax and DeltaTmax Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="tec-qmax" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  {t.maxCooling}
                </label>
                <input
                  id="tec-qmax"
                  type="number"
                  min="1"
                  value={qmax}
                  onChange={(e) => setQmax(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-3.5 text-xl font-bold text-stone-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                />
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{t.maxCoolingDesc}</p>
              </div>

              <div>
                <label htmlFor="tec-dtmax" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  {t.maxDeltaT}
                </label>
                <input
                  id="tec-dtmax"
                  type="number"
                  min="1"
                  value={deltaTmax}
                  onChange={(e) => setDeltaTmax(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-3.5 text-xl font-bold text-stone-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                />
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{t.maxDeltaTDesc}</p>
              </div>
            </div>

            {/* Operating DeltaT */}
            <div>
              <label htmlFor="tec-opdt" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                {t.operatingDeltaT}
              </label>
              <input
                id="tec-opdt"
                type="number"
                min="0"
                value={operatingDeltaT}
                onChange={(e) => setOperatingDeltaT(Math.max(0, Number(e.target.value)))}
                className="w-full bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-3.5 text-xl font-bold text-stone-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-none transition-all"
              />
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{t.operatingDeltaTDesc}</p>
            </div>

            {/* Voltage & Current Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="tec-volt" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  {t.voltage}
                </label>
                <input
                  id="tec-volt"
                  type="number"
                  step="0.1"
                  min="0.5"
                  value={voltage}
                  onChange={(e) => setVoltage(Math.max(0.5, Number(e.target.value)))}
                  className="w-full bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-3.5 text-xl font-bold text-stone-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                />
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{t.voltageDesc}</p>
              </div>

              <div>
                <label htmlFor="tec-curr" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  {t.current}
                </label>
                <input
                  id="tec-curr"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={current}
                  onChange={(e) => setCurrent(Math.max(0.1, Number(e.target.value)))}
                  className="w-full bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-3.5 text-xl font-bold text-stone-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                />
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{t.currentDesc}</p>
              </div>
            </div>
          </div>

          <ShareActions
            calculatorTitle={t.title}
            calculatorPath="/calculators/peltier-cooling"
            onSaveHistory={saveToHistory}
            historyEntries={getHistory()}
            onLoadHistory={loadFromHistory}
          />
        </div>

        {/* Right Sticky Dashboard */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          <div className="bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-800 text-white flex flex-col gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-sky-400">
                  {t.coolingCapacity}
                </span>
                <ShinyText text="COOLING POWER" speed={3} className="text-[10px] text-sky-400 font-mono" />
              </div>
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-white flex items-baseline gap-2" dir="ltr">
                <CountUp to={results.capacity} duration={0.6} />
                <span className="text-xl font-bold text-stone-400">Watts</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1">
                  {t.powerConsumption}
                </span>
                <div className="text-lg sm:text-xl font-bold text-rose-400" dir="ltr">
                  <CountUp to={results.power} suffix=" W" duration={0.6} />
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1">
                  {t.cop}
                </span>
                <div className="text-lg sm:text-xl font-bold text-emerald-400" dir="ltr">
                  <CountUp to={results.cop} duration={0.6} />
                </div>
              </div>
            </div>

            {/* Visual Bar Chart */}
            <div className="w-full h-[180px] bg-white/5 p-3 rounded-2xl border border-white/10" dir="ltr">
              <Bar
                data={deferredChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { ticks: { color: '#94a3b8', font: { size: 10 } }, grid: { display: false } },
                    y: { ticks: { color: '#94a3b8', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <DisclaimerNotice type="general" />

      <CalculatorGuide guideKey="peltier-cooling" category="tech" />

      <FAQ items={guide.faq} />

      <RelatedCalculators currentId="peltier-cooling" />
    </div>
  );
}
