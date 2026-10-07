import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code2, Sparkles, ArrowRight } from 'lucide-react';
import { useI18n } from '../contexts/i18n';

interface EmbedCtaBannerProps {
  calculatorId: string;
  calculatorTitle: string;
}

export default function EmbedCtaBanner({ calculatorId, calculatorTitle }: EmbedCtaBannerProps) {
  const { lang, t } = useI18n();
  const location = useLocation();

  // If page is viewed inside an embed iframe, do not show internal embed banner
  const isEmbed = new URLSearchParams(location.search).get('embed') === 'true';
  if (isEmbed) return null;

  const cleanSlug = calculatorId.replace(/^\/?(calculators\/)?/, '');

  const text = {
    en: {
      badge: 'Publisher & Blogger Tool',
      title: `Embed the ${calculatorTitle} on Your Website`,
      desc: 'Free responsive widget with zero coding. Customize brand colors, corner radius, and embed via HTML iFrame or React component.',
      cta: 'Customize & Get Embed Code',
    },
    he: {
      badge: 'חינם לבעלי אתרים ובלוגרים',
      title: `רוצה להטמיע את ${calculatorTitle} באתר שלך?`,
      desc: 'ווידג\'ט רספונסיבי מהיר ללא עלות. התאם אישית צבעי מותג, רדיוס פינות ורוחב, וקבל קוד HTML / React מוכן להעתקה מיידית.',
      cta: 'התאם אישית וקבל קוד הטמעה',
    },
    es: {
      badge: 'Herramienta para Bloggers y Webs',
      title: `Inserta ${calculatorTitle} en tu Sitio Web`,
      desc: 'Widget 100% adaptable y gratuito. Personaliza colores de marca y copia el código HTML o componente React en 30 segundos.',
      cta: 'Personalizar y Obtener Código',
    },
    fr: {
      badge: 'Outil pour Éditeurs & Blogs',
      title: `Intégrez ${calculatorTitle} sur Votre Site Web`,
      desc: 'Widget gratuit et responsive sans serveur. Personnalisez vos couleurs et obtenez le code HTML ou React prêt à l\'emploi.',
      cta: 'Personnaliser et Obtenir le Code',
    },
    ar: {
      badge: 'مجاناً لأصحاب المواقع والمدونات',
      title: `ضمّن ${calculatorTitle} في موقعك الإلكتروني`,
      desc: 'أداة تفاعلية سريعة ومجانية تماماً. خصص ألوان علامتك التجارية واحصل على كود HTML أو React جاهז للتضمين.',
      cta: 'تخصيص ونسخ كود التضمين',
    },
    ru: {
      badge: 'Бесплатно для владельцев сайтов',
      title: `Встройте ${calculatorTitle} на свой сайт`,
      desc: 'Адаптивный интерактивный виджет без серверов. Настройте фирменные цвета и получите готовый HTML или React код.',
      cta: 'Настроить и получить код',
    },
  }[lang as 'en' | 'he' | 'es' | 'fr' | 'ar' | 'ru'] || {
    badge: 'Publisher & Blogger Tool',
    title: `Embed the ${calculatorTitle} on Your Website`,
    desc: 'Free responsive widget with zero coding. Customize brand colors, corner radius, and embed via HTML iFrame or React component.',
    cta: 'Customize & Get Embed Code',
  };

  const widgetsHubUrl = `/${lang}/widgets?calc=${encodeURIComponent(cleanSlug)}`;

  return (
    <div className="my-8 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white shadow-md border border-emerald-800/60 relative overflow-hidden print:hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 end-0 -mt-8 -me-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{text.badge}</span>
          </div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight">
            {text.title}
          </h3>
          <p className="text-emerald-100/80 text-xs sm:text-sm leading-relaxed font-medium">
            {text.desc}
          </p>
        </div>

        <Link
          to={widgetsHubUrl}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 shrink-0"
        >
          <Code2 className="w-4 h-4" />
          <span>{text.cta}</span>
          <ArrowRight className={`w-4 h-4 ${t.dir === 'rtl' ? 'rotate-180' : ''}`} />
        </Link>
      </div>
    </div>
  );
}
