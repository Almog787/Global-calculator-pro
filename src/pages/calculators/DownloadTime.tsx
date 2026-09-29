import React, { useDeferredValue, useMemo } from 'react';
import { Download } from 'lucide-react';
import { useI18n } from '../../contexts/i18n';
import SEO from '../../components/SEO';
import Breadcrumbs from '../../components/Breadcrumbs';
import RelatedCalculators from '../../components/RelatedCalculators';
import CalculatorGuide from '../../components/CalculatorGuide';
import ScenarioPresets from '../../components/ScenarioPresets';
import ShareActions from '../../components/ShareActions';
import ShinyText from '../../components/ShinyText';
import FAQ from '../../components/FAQ';
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
    title: 'Download & Upload Time Calculator',
    subtitle: 'Estimate Exact Transfer Times for Any File Size across Fiber, 5G, Wi-Fi & Broadband Speeds',
    description: 'Calculate how long it takes to download or upload files, games, 4K movies, or backups based on internet connection speed and network overhead.',
    fileSize: 'File Size',
    fileSizeDesc: 'Size of file, archive, or software update',
    fileUnit: 'Unit',
    internetSpeed: 'Bandwidth Speed',
    internetSpeedDesc: 'Actual download or upload throughput',
    speedUnit: 'Speed Unit',
    downloadTime: 'Estimated Transfer Time',
    timeHours: 'Hours',
    timeMinutes: 'Minutes',
    timeSeconds: 'Seconds',
    chartTitle: 'Transfer Time Comparison across Speeds',
    chartCurrent: 'Current Speed',
    chart2x: '2x Speed',
    chartFiber: 'Gigabit Fiber (1 Gbps)',
    faqTitle: 'Frequently Asked Questions: Internet Speed & Download Times',
  },
  he: {
    title: 'מחשבון זמן הורדה והעלאה (Download Time)',
    subtitle: 'חישוב משך הזמן המדויק להורדת קבצים, משחקים וסרטים בסיבים, 5G ו-Wi-Fi',
    description: 'מחשבון זמן הורדה מדויק: גלה תוך כמה שניות, דקות או שעות ירד קובץ בכל גודל לפי מהירות ספק האינטרנט (Mbps / Gbps / MB/s) עם השוואת מהירויות.',
    fileSize: 'גודל הקובץ להורדה',
    fileSizeDesc: 'משקל הקובץ, המשחק, הסרט או הגיבוי',
    fileUnit: 'יחידת גודל',
    internetSpeed: 'מהירות אינטרנט בפועל',
    internetSpeedDesc: 'קצב העברת הנתונים (Download / Upload)',
    speedUnit: 'יחידת מהירות',
    downloadTime: 'זמן הורדה משוער',
    timeHours: 'שעות',
    timeMinutes: 'דקות',
    timeSeconds: 'שניות',
    chartTitle: 'השוואת זמני הורדה במהירויות שונות',
    chartCurrent: 'מהירות נוכחית',
    chart2x: 'מהירות כפולה (2x)',
    chartFiber: 'סיב אופטי (1 Gbps)',
    faqTitle: 'שאלות ותשובות נפוצות: מהירות אינטרנט וזמני הורדה',
  },
  es: {
    title: 'Calculadora de Tiempo de Descarga',
    subtitle: 'Calcula cuánto tarda en descargarse o subirse cualquier archivo',
    description: 'Calcula el tiempo de descarga para archivos, juegos y vídeos según tu velocidad de conexión.',
    fileSize: 'Tamaño del Archivo',
    fileSizeDesc: 'Peso del archivo',
    fileUnit: 'Unidad',
    internetSpeed: 'Velocidad de Conexión',
    internetSpeedDesc: 'Ancho de banda real',
    speedUnit: 'Unidad',
    downloadTime: 'Tiempo Estimado',
    timeHours: 'Horas',
    timeMinutes: 'Minutos',
    timeSeconds: 'Segundos',
    chartTitle: 'Comparativa de Velocidades',
    chartCurrent: 'Velocidad Actual',
    chart2x: 'Doble Velocidad (2x)',
    chartFiber: 'Fibra 1 Gbps',
    faqTitle: 'Preguntas Frecuentes sobre Velocidad y Descargas',
  },
  fr: {
    title: 'Calculateur de Temps de Téléchargement',
    subtitle: 'Estimez la durée de transfert pour tout fichier selon votre débit',
    description: 'Calculez le temps nécessaire pour télécharger un fichier selon votre débit fibre ou ADSL.',
    fileSize: 'Taille du Fichier',
    fileSizeDesc: 'Poids du fichier',
    fileUnit: 'Unité',
    internetSpeed: 'Débit Internet',
    internetSpeedDesc: 'Vitesse de transfert',
    speedUnit: 'Unité',
    downloadTime: 'Durée Estimée',
    timeHours: 'Heures',
    timeMinutes: 'Minutes',
    timeSeconds: 'Secondes',
    chartTitle: 'Comparaison des Débits',
    chartCurrent: 'Débit Actuel',
    chart2x: 'Débit Doublé (2x)',
    chartFiber: 'Fibre 1 Gbps',
    faqTitle: 'Questions Fréquentes sur le Téléchargement',
  },
  ar: {
    title: 'حاسبة وقت التنزيل والتحميل',
    subtitle: 'احسب المدة الدقيقة لنقل أي ملف بناءً على سرعة اتصالك بالإنترنت',
    description: 'احسب وقت تنزيل الملفات والألعاب والفيديوهات وفقاً لسرعة شبكة الألياف أو الجيل الخامس.',
    fileSize: 'حجم الملف',
    fileSizeDesc: 'وزن الملف المراد تنزيله',
    fileUnit: 'الوحدة',
    internetSpeed: 'سرعة الإنترنت',
    internetSpeedDesc: 'معدل نقل البيانات الفعلي',
    speedUnit: 'الوحدة',
    downloadTime: 'الوقت التقديري',
    timeHours: 'ساعات',
    timeMinutes: 'دقائق',
    timeSeconds: 'ثواني',
    chartTitle: 'مقارنة أوقات التنزيل حسب السرعات',
    chartCurrent: 'السرعة الحالية',
    chart2x: 'ضعف السرعة (2x)',
    chartFiber: 'ألياف 1 جيجابت',
    faqTitle: 'الأسئلة الشائعة حول سرعة الإنترنت ووقت التنزيل',
  }
};

export default function DownloadTime() {
  const { lang, guides } = useI18n();
  const guide = guides['download-time'] || { guideTitle: 'Guide & Formulas', guideDesc: 'Comprehensive calculation breakdown and FAQs.', faq: [] };
  const t = localDict[lang as keyof typeof localDict] || localDict.en;

  const { state, updateState, saveToHistory, loadFromHistory, getHistory } = useCalculatorState('download-time', {
    fileSize: 45,
    fileUnit: 'GB',
    speed: 200,
    speedUnit: 'Mbps',
  });

  const { fileSize, fileUnit, speed, speedUnit } = state;

  const setFileSize = (v: number) => updateState({ fileSize: v });
  const setFileUnit = (v: string) => updateState({ fileUnit: v });
  const setSpeed = (v: number) => updateState({ speed: v });
  const setSpeedUnit = (v: string) => updateState({ speedUnit: v });

  const results = useMemo(() => {
    try {
      let bytes = new Decimal(fileSize || 0);
      switch (fileUnit) {
        case 'KB': bytes = bytes.mul(1024); break;
        case 'MB': bytes = bytes.mul(1024 * 1024); break;
        case 'GB': bytes = bytes.mul(1024 * 1024 * 1024); break;
        case 'TB': bytes = bytes.mul(1024 * 1024 * 1024 * 1024); break;
      }

      let speedBps = new Decimal(speed || 1);
      switch (speedUnit) {
        case 'Kbps': speedBps = speedBps.mul(1000).div(8); break;
        case 'Mbps': speedBps = speedBps.mul(1000 * 1000).div(8); break;
        case 'Gbps': speedBps = speedBps.mul(1000 * 1000 * 1000).div(8); break;
        case 'MBps': speedBps = speedBps.mul(1024 * 1024); break;
      }

      if (speedBps.isZero()) speedBps = new Decimal(1);

      const totalSeconds = bytes.div(speedBps).toNumber();

      let formatted = '';
      if (totalSeconds < 60) {
        formatted = `${Math.ceil(totalSeconds)} ${t.timeSeconds}`;
      } else if (totalSeconds < 3600) {
        const mins = Math.floor(totalSeconds / 60);
        const secs = Math.ceil(totalSeconds % 60);
        formatted = `${mins}m ${secs}s`;
      } else {
        const hours = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        formatted = `${hours}h ${mins}m`;
      }

      // Fast comparisons (2x and 1Gbps Fiber)
      const fiberBps = new Decimal(1000 * 1000 * 1000).div(8);
      const fiberSecs = bytes.div(fiberBps).toNumber();

      return {
        totalSeconds,
        formatted,
        minutes: totalSeconds / 60,
        minutes2x: (totalSeconds / 60) / 2,
        minutesFiber: fiberSecs / 60,
      };
    } catch {
      return {
        totalSeconds: 0,
        formatted: '-',
        minutes: 0,
        minutes2x: 0,
        minutesFiber: 0,
      };
    }
  }, [fileSize, fileUnit, speed, speedUnit, t]);

  const chartData = useMemo(() => {
    return {
      labels: [t.chartCurrent, t.chart2x, t.chartFiber],
      datasets: [
        {
          label: 'Minutes',
          data: [
            Math.round(results.minutes * 10) / 10,
            Math.round(results.minutes2x * 10) / 10,
            Math.round(results.minutesFiber * 10) / 10,
          ],
          backgroundColor: ['#6366f1', '#10b981', '#f59e0b'],
          borderRadius: 12,
        },
      ],
    };
  }, [results.minutes, results.minutes2x, results.minutesFiber, t]);

  const deferredChartData = useDeferredValue(chartData);

  const presets = [
    {
      label: '4K Ultra HD Movie (25 GB on 200 Mbps)',
      values: { fileSize: 25, fileUnit: 'GB', speed: 200, speedUnit: 'Mbps' }
    },
    {
      label: 'AAA Game Install (80 GB on 500 Mbps Fiber)',
      values: { fileSize: 80, fileUnit: 'GB', speed: 500, speedUnit: 'Mbps' }
    },
    {
      label: 'Cloud Backup (1 TB on 100 Mbps Upload)',
      values: { fileSize: 1, fileUnit: 'TB', speed: 100, speedUnit: 'Mbps' }
    },
    {
      label: 'Mobile App Update (500 MB on 5G 50 Mbps)',
      values: { fileSize: 500, fileUnit: 'MB', speed: 50, speedUnit: 'Mbps' }
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      <SEO
        title={t.title}
        description={t.description}
        keywords={['download time calculator', 'file transfer speed', 'זמן הורדה', 'מהירות אינטרנט', 'Mbps to MB/s']}
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
          if (val.fileSize !== undefined) setFileSize(val.fileSize);
          if (val.fileUnit !== undefined) setFileUnit(val.fileUnit);
          if (val.speed !== undefined) setSpeed(val.speed);
          if (val.speedUnit !== undefined) setSpeedUnit(val.speedUnit);
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Card */}
        <div className="lg:col-span-7 bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3.5 pb-4 border-b border-stone-100 dark:border-stone-800">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
              <Download className="w-6 h-6" />
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
            {/* File Size & Unit Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="dl-size" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  {t.fileSize}
                </label>
                <input
                  id="dl-size"
                  type="number"
                  min="0.1"
                  step="0.5"
                  value={fileSize}
                  onChange={(e) => setFileSize(Math.max(0.1, Number(e.target.value)))}
                  className="w-full bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-3.5 text-xl font-bold text-stone-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{t.fileSizeDesc}</p>
              </div>

              <div>
                <label htmlFor="dl-unit" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  {t.fileUnit}
                </label>
                <select
                  id="dl-unit"
                  value={fileUnit}
                  onChange={(e) => setFileUnit(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-3.5 text-xl font-bold text-stone-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                >
                  <option value="MB">MB</option>
                  <option value="GB">GB</option>
                  <option value="TB">TB</option>
                </select>
              </div>
            </div>

            {/* Speed & Speed Unit Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="dl-spd" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  {t.internetSpeed}
                </label>
                <input
                  id="dl-spd"
                  type="number"
                  min="0.1"
                  value={speed}
                  onChange={(e) => setSpeed(Math.max(0.1, Number(e.target.value)))}
                  className="w-full bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-3.5 text-xl font-bold text-stone-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{t.internetSpeedDesc}</p>
              </div>

              <div>
                <label htmlFor="dl-spd-unit" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  {t.speedUnit}
                </label>
                <select
                  id="dl-spd-unit"
                  value={speedUnit}
                  onChange={(e) => setSpeedUnit(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-3.5 text-sm font-bold text-stone-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                >
                  <option value="Mbps">Mbps (Mbit/s)</option>
                  <option value="MBps">MB/s (MByte/s)</option>
                  <option value="Gbps">Gbps (Gbit/s)</option>
                </select>
              </div>
            </div>
          </div>

          <ShareActions
            calculatorTitle={t.title}
            calculatorPath="/calculators/download-time"
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
                <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-400">
                  {t.downloadTime}
                </span>
                <ShinyText text="TRANSFER TIME" speed={3} className="text-[10px] text-indigo-400 font-mono" />
              </div>
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-white flex items-baseline gap-2" dir="ltr">
                {results.formatted}
              </div>
            </div>

            {/* Visual Bar Chart */}
            <div className="w-full h-[200px] bg-white/5 p-3 rounded-2xl border border-white/10" dir="ltr">
              <Bar
                data={deferredChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (ctx) => `${ctx.raw} min`,
                      }
                    }
                  },
                  scales: {
                    x: { ticks: { color: '#94a3b8', font: { size: 10 } }, grid: { display: false } },
                    y: {
                      title: { display: true, text: 'Minutes', color: '#94a3b8', font: { size: 10 } },
                      ticks: { color: '#94a3b8', font: { size: 10 } },
                      grid: { color: 'rgba(255,255,255,0.05)' }
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <CalculatorGuide guideKey="download-time" category="tech" />

      <FAQ items={guide.faq} />

      <RelatedCalculators currentId="download-time" />
    </div>
  );
}
