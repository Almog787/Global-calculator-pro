import { useState, useDeferredValue, useEffect } from 'react';
import SEO from '../../components/SEO';
import Decimal from 'decimal.js';
import { Bar } from 'react-chartjs-2';
import { useI18n } from '../../contexts/i18n';

const localDict = {
  en: {
    title: 'Download Time Calculator',
    description: 'Calculate exactly how long it will take to download or upload a file based on your internet speed.',
    fileSize: 'File Size',
    fileUnit: 'Unit',
    internetSpeed: 'Internet Speed',
    speedUnit: 'Unit',
    downloadTime: 'Estimated Time',
    timeHours: 'Hours',
    timeMinutes: 'Minutes',
    timeSeconds: 'Seconds',
  },
  he: {
    title: 'מחשבון זמן הורדה',
    description: 'חשב בדיוק כמה זמן ייקח להוריד או להעלות קובץ בהתבסס על מהירות האינטרנט שלך.',
    fileSize: 'גודל קובץ',
    fileUnit: 'יחידה',
    internetSpeed: 'מהירות אינטרנט',
    speedUnit: 'יחידה',
    downloadTime: 'זמן משוער',
    timeHours: 'שעות',
    timeMinutes: 'דקות',
    timeSeconds: 'שניות',
  },
  es: {
    title: 'Calculadora de Tiempo de Descarga',
    description: 'Calcula exactamente cuánto tardará en descargarse o subirse un archivo según tu velocidad de internet.',
    fileSize: 'Tamaño del Archivo',
    fileUnit: 'Unidad',
    internetSpeed: 'Velocidad de Internet',
    speedUnit: 'Unidad',
    downloadTime: 'Tiempo Estimado',
    timeHours: 'Horas',
    timeMinutes: 'Minutos',
    timeSeconds: 'Segundos',
  },
  fr: {
    title: 'Calculatrice de Temps de Téléchargement',
    description: 'Calculez exactement le temps nécessaire pour télécharger un fichier selon votre vitesse internet.',
    fileSize: 'Taille du Fichier',
    fileUnit: 'Unité',
    internetSpeed: 'Vitesse Internet',
    speedUnit: 'Unité',
    downloadTime: 'Temps Estimé',
    timeHours: 'Heures',
    timeMinutes: 'Minutes',
    timeSeconds: 'Secondes',
  },
  ar: {
    title: 'حاسبة وقت التنزيل',
    description: 'احسب بالظبط الوقت الذي يستغرقه تنزيل أو تحميل ملف بناءً على سرعة الإنترنت لديك.',
    fileSize: 'حجم الملف',
    fileUnit: 'الوحدة',
    internetSpeed: 'سرعة الإنترنت',
    speedUnit: 'الوحدة',
    downloadTime: 'الوقت المقدر',
    timeHours: 'ساعات',
    timeMinutes: 'دقائق',
    timeSeconds: 'ثواني',
  }
};

export default function DownloadTime() {
  const { lang, t: globalT } = useI18n();
  const t = localDict[lang as keyof typeof localDict] || localDict.en;

  const [fileSize, setFileSize] = useState(50);
  const [fileUnit, setFileUnit] = useState('GB');
  
  const [speed, setSpeed] = useState(100);
  const [speedUnit, setSpeedUnit] = useState('Mbps'); // Megabits per second

  const [results, setResults] = useState({ totalSeconds: 0, formatted: '' });

  useEffect(() => {
    try {
      let bytes = new Decimal(fileSize || 0);
      switch(fileUnit) {
        case 'KB': bytes = bytes.mul(1024); break;
        case 'MB': bytes = bytes.mul(1024 * 1024); break;
        case 'GB': bytes = bytes.mul(1024 * 1024 * 1024); break;
        case 'TB': bytes = bytes.mul(1024 * 1024 * 1024 * 1024); break;
      }

      let speedBps = new Decimal(speed || 1);
      switch(speedUnit) {
        case 'Kbps': speedBps = speedBps.mul(1000).div(8); break;
        case 'Mbps': speedBps = speedBps.mul(1000 * 1000).div(8); break;
        case 'Gbps': speedBps = speedBps.mul(1000 * 1000 * 1000).div(8); break;
        case 'MBps': speedBps = speedBps.mul(1024 * 1024); break; // Megabytes per sec
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

      setResults({ totalSeconds, formatted });
    } catch {
      setResults({ totalSeconds: 0, formatted: '-' });
    }
  }, [fileSize, fileUnit, speed, speedUnit, t]);

  const chartData = {
    labels: ['Current Speed', '2x Faster', '4x Faster'],
    datasets: [{
      label: 'Minutes',
      data: [
        results.totalSeconds / 60,
        (results.totalSeconds / 60) / 2,
        (results.totalSeconds / 60) / 4
      ],
      backgroundColor: ['#6366f1', '#10b981', '#f59e0b'],
      borderRadius: 8,
    }],
  };

  const chartOptions = {
    animation: false as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => `${Math.round(context.raw)} min`,
        }
      }
    },
    scales: {
      y: {
        title: { display: true, text: 'Minutes' },
        grid: { color: '#f3f4f6' },
      },
      x: { grid: { display: false } },
    }
  };

  const deferredChartData = useDeferredValue(chartData);

  return (
    <article className="w-full h-full flex flex-col lg:flex-row bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-stone-200 gap-10">
      <SEO
        title={t.title}
        description={t.description}
        canonicalUrl="/calculators/download-time"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: t.title,
          description: t.description,
          applicationCategory: 'CalculatorApplication',
          operatingSystem: 'Any',
          url: `https://globalcalcpro.com${"/calculators/download-time"}`
        }}
      />

      <div className="flex-[1.5] flex flex-col">
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-headline text-stone-900 tracking-tight mb-3">{t.title}</h1>
          <p className="text-stone-500 font-medium text-[15px] leading-relaxed max-w-md">{t.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.fileSize}</label>
            <input type="number" value={fileSize} onChange={e => setFileSize(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
          </div>
          <div>
            <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.fileUnit}</label>
            <select value={fileUnit} onChange={e => setFileUnit(e.target.value)} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors cursor-pointer">
              <option value="MB">MB</option>
              <option value="GB">GB</option>
              <option value="TB">TB</option>
            </select>
          </div>
          
          <div>
            <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.internetSpeed}</label>
            <input type="number" value={speed} onChange={e => setSpeed(Number(e.target.value))} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors" />
          </div>
          <div>
            <label className="text-xs tracking-wider uppercase font-bold text-stone-600 mb-1 block">{t.speedUnit}</label>
            <select value={speedUnit} onChange={e => setSpeedUnit(e.target.value)} className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-2xl font-headline text-stone-900 focus:ring-0 focus:border-stone-900 transition-colors cursor-pointer">
              <option value="Mbps">Mbps (Megabit/s)</option>
              <option value="MBps">MB/s (Megabyte/s)</option>
              <option value="Gbps">Gbps (Gigabit/s)</option>
            </select>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-200">
          <div>
            <span className="text-xs tracking-wider uppercase font-bold text-stone-600 block mb-1">{t.downloadTime}</span>
            <div className="text-3xl md:text-5xl font-headline text-blue-600" dir="ltr">{results.formatted}</div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center border-t lg:border-t-0 lg:border-l lg:rtl:border-r lg:rtl:border-l-0 border-stone-200 pt-10 lg:pt-0 lg:pl-10 lg:rtl:pr-10 lg:rtl:pl-0">
        <div className="w-full h-[320px]" dir="ltr">
          <Bar data={deferredChartData} options={chartOptions} />
        </div>
      </div>
    </article>
  );
}
