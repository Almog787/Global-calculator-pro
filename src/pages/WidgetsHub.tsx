import React, { useState } from 'react';
import { useI18n } from '../contexts/i18n';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import {
  Code2,
  Copy,
  Check,
  Smartphone,
  Tablet,
  Monitor,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap,
  Globe2,
  Layers,
  ChevronRight
} from 'lucide-react';
import {
  AVAILABLE_WIDGETS,
  generateIframeCode,
  generateReactCode,
  generateWordPressCode,
  buildEmbedUrl,
  buildCanonicalUrl
} from '../lib/widgets/widgetsConfig';

export default function WidgetsHub() {
  const { lang, t } = useI18n();

  const [selectedWidgetId, setSelectedWidgetId] = useState<string>('mortgage');
  const [widgetLang, setWidgetLang] = useState<string>(lang);
  const [widthMode, setWidthMode] = useState<'responsive' | 'fixed' | 'compact'>('responsive');
  const [customWidth, setCustomWidth] = useState<number>(600);
  const [customHeight, setCustomHeight] = useState<number>(680);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [includeBacklink, setIncludeBacklink] = useState<boolean>(true);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [copiedFormat, setCopiedFormat] = useState<'iframe' | 'react' | 'wp' | null>(null);

  const selectedWidget = AVAILABLE_WIDGETS.find(w => w.id === selectedWidgetId) || AVAILABLE_WIDGETS[0];

  const effectiveWidth =
    widthMode === 'responsive' ? '100%' : widthMode === 'compact' ? '380px' : `${customWidth}px`;

  const previewFrameWidth =
    previewDevice === 'mobile' ? '380px' : previewDevice === 'tablet' ? '640px' : '100%';

  const fullEmbedUrl = buildEmbedUrl(selectedWidget.slug, widgetLang, theme);
  const canonicalUrl = buildCanonicalUrl(selectedWidget.slug, widgetLang);

  const embedOptions = {
    widget: selectedWidget,
    widgetLang,
    uiLang: lang,
    width: effectiveWidth,
    height: customHeight,
    theme,
    includeBacklink
  };

  const iframeCode = generateIframeCode(embedOptions);
  const reactCode = generateReactCode(embedOptions);
  const wpShortcode = generateWordPressCode(embedOptions);

  const copyToClipboard = (text: string, format: 'iframe' | 'react' | 'wp') => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2500);
  };

  const uiText = {
    en: {
      pageTitle: 'Free Embeddable Calculators & Widgets Hub',
      pageDesc: 'Add high-performance, responsive financial and utility calculators to your blog, news site, or client website with zero coding required.',
      selectCalc: '1. Select Calculator',
      customizeWidget: '2. Customize Appearance & Settings',
      previewWidget: '3. Interactive Live Preview',
      codeSnippet: '4. Copy Embed Code',
      languageLabel: 'Widget Language',
      themeLabel: 'Color Theme',
      lightTheme: 'Light Theme',
      darkTheme: 'Dark Theme',
      widthLabel: 'Width Style',
      responsiveWidth: 'Responsive 100% (Recommended)',
      fixedWidth: 'Standard (600px)',
      compactWidth: 'Sidebar (380px)',
      heightLabel: 'Height (px)',
      backlinkCheckbox: 'Include attribution link (Free for commercial & personal sites)',
      previewDesktop: 'Desktop',
      previewTablet: 'Tablet',
      previewMobile: 'Mobile',
      copyIframe: 'Copy HTML iFrame',
      copyReact: 'Copy React Component',
      copyWP: 'Copy WordPress Code',
      copied: 'Copied to Clipboard!',
      whyEmbedTitle: 'Why Embed GlobalCalc Pro Widgets on Your Website?',
      benefit1Title: 'Boost Time On Site (Dwell Time)',
      benefit1Desc: 'Interactive tools keep readers engaged 3x to 5x longer, sending positive user engagement signals directly to search engines.',
      benefit2Title: '100% Free & Zero Server Maintenance',
      benefit2Desc: 'Calculators run completely in the visitor\'s browser. No API keys, no monthly fees, and no server configuration needed.',
      benefit3Title: 'Multi-Language & Fully Responsive',
      benefit3Desc: 'Flawlessly scales from smartphone screens to ultra-wide displays in English, Hebrew, Spanish, French, and Arabic with native RTL support.',
      integrationGuideTitle: 'Quick Installation Guide for Popular Platforms',
      faqTitle: 'Frequently Asked Questions by Publishers & Webmasters',
    },
    he: {
      pageTitle: 'מרכז מחשבונים ווידג\'טים להטמעה חינם באתרים',
      pageDesc: 'הטמיעו מחשבונים אינטראקטיביים מדויקים ומעוצבים באתר, בבלוג או באפליקציה שלכם בלחיצת כפתור - ללא עלות, ללא צורך בקוד ובהתאמה רספונסיבית מלאה.',
      selectCalc: '1. בחירת מחשבון להטמעה',
      customizeWidget: '2. התאמה אישית של עיצוב והגדרות',
      previewWidget: '3. תצוגה מקדימה אינטראקטיבית',
      codeSnippet: '4. העתקת קוד הטמעה',
      languageLabel: 'שפת הווידג\'ט',
      themeLabel: 'ערכת נושא (צבעים)',
      lightTheme: 'עיצוב בהיר',
      darkTheme: 'עיצוב כהה',
      widthLabel: 'רוחב הווידג\'ט',
      responsiveWidth: 'רספונסיבי 100% (מומלץ למאמרים)',
      fixedWidth: 'קבוע (600 פיקסלים)',
      compactWidth: 'סרגל צד (380 פיקסלים)',
      heightLabel: 'גובה (בפיקסלים)',
      backlinkCheckbox: 'כלול קישור קרדיט ל-GlobalCalc Pro (חינם לאתרים מסחריים ואישיים)',
      previewDesktop: 'מחשב',
      previewTablet: 'טאבלט',
      previewMobile: 'סלולר',
      copyIframe: 'העתק קוד HTML (iFrame)',
      copyReact: 'העתק קומפוננטת React',
      copyWP: 'העתק עבור WordPress',
      copied: 'הקוד הועתק בהצלחה!',
      whyEmbedTitle: 'למה להטמיע מחשבונים מבית GlobalCalc Pro באתר שלך?',
      benefit1Title: 'הגדלת זמן השהייה באתר (Dwell Time)',
      benefit1Desc: 'כלים אינטראקטיביים מעלים את זמן השהייה של הגולשים בממוצע פי 3 עד 5, מה שתורם משמעותית לדירוג האתר במנועי חיפוש (SEO).',
      benefit2Title: 'חינם לחלוטין וללא תחזוקת שרתים',
      benefit2Desc: 'המחשבונים רצים ישירות בדפדפן הגולש. אין צורך במפתחות API, הרשמה או תשלומים חודשיים.',
      benefit3Title: 'תמיכה מלאה בריבוי שפות וב-RTL',
      benefit3Desc: 'התאמה מושלמת למכשירים ניידים ומחשבים, עם תמיכה מובנית בעברית, אנגלית, ספרדית, צרפתית וערבית.',
      integrationGuideTitle: 'מדריך התקנה מהיר למערכות ניהול תוכן (CMS)',
      faqTitle: 'שאלות ותשובות נפוצות למנהלי אתרים ומפתחים',
    },
    es: {
      pageTitle: 'Centro de Widgets y Calculadoras para Insertar',
      pageDesc: 'Integra calculadoras financieras y prácticas en tu blog o web con una línea de código. 100% gratuito y adaptable.',
      selectCalc: '1. Seleccionar Calculadora',
      customizeWidget: '2. Personalizar Ajustes',
      previewWidget: '3. Vista Previa en Vivo',
      codeSnippet: '4. Copiar Código de Inserción',
      languageLabel: 'Idioma del Widget',
      themeLabel: 'Tema de Color',
      lightTheme: 'Tema Claro',
      darkTheme: 'Tema Oscuro',
      widthLabel: 'Estilo de Ancho',
      responsiveWidth: 'Adaptable 100% (Recomendado)',
      fixedWidth: 'Estándar (600px)',
      compactWidth: 'Barra lateral (380px)',
      heightLabel: 'Altura (px)',
      backlinkCheckbox: 'Incluir enlace de atribución (Recomendado)',
      previewDesktop: 'Escritorio',
      previewTablet: 'Tableta',
      previewMobile: 'Móvil',
      copyIframe: 'Copiar Código HTML',
      copyReact: 'Copiar Componente React',
      copyWP: 'Copiar para WordPress',
      copied: '¡Copiado con éxito!',
      whyEmbedTitle: '¿Por qué integrar los widgets de GlobalCalc Pro?',
      benefit1Title: 'Mayor tiempo de permanencia en el sitio',
      benefit1Desc: 'Las herramientas interactivas incrementan el tiempo de visita y reducen la tasa de rebote.',
      benefit2Title: 'Sin costes de servidor ni mantenimiento',
      benefit2Desc: 'Ejecución 100% en el cliente, sin claves API ni suscripciones.',
      benefit3Title: 'Diseño móvil de máxima calidad',
      benefit3Desc: 'Se adapta de forma nativa a cualquier resolución de pantalla.',
      integrationGuideTitle: 'Guía de instalación en WordPress, Wix y Webflow',
      faqTitle: 'Preguntas Frecuentes',
    },
    fr: {
      pageTitle: 'Hub des Calculateurs & Widgets Intégrables Gratuits',
      pageDesc: 'Ajoutez des calculateurs interactifs sur votre site ou blog en quelques secondes. Zéro code requis, 100% responsive.',
      selectCalc: '1. Choisir un Calculateur',
      customizeWidget: '2. Personnaliser le Widget',
      previewWidget: '3. Aperçu en Direct',
      codeSnippet: '4. Copier le Code d\'Intégration',
      languageLabel: 'Langue du Widget',
      themeLabel: 'Thème Graphique',
      lightTheme: 'Thème Clair',
      darkTheme: 'Thème Sombre',
      widthLabel: 'Type de Largeur',
      responsiveWidth: 'Responsive 100% (Recommandé)',
      fixedWidth: 'Fixe (600px)',
      compactWidth: 'Barre latérale (380px)',
      heightLabel: 'Hauteur (px)',
      backlinkCheckbox: 'Inclure le lien de crédit (Gratuit)',
      previewDesktop: 'Bureau',
      previewTablet: 'Tablette',
      previewMobile: 'Mobile',
      copyIframe: 'Copier Code HTML',
      copyReact: 'Copier Composant React',
      copyWP: 'Copier pour WordPress',
      copied: 'Copié dans le presse-papiers !',
      whyEmbedTitle: 'Pourquoi intégrer les widgets GlobalCalc Pro ?',
      benefit1Title: 'Augmentez le temps passé sur vos pages',
      benefit1Desc: 'Les outils interactifs multiplient l\'engagement de vos visiteurs et favorisent le référencement SEO.',
      benefit2Title: 'Totalement gratuit et sans maintenance',
      benefit2Desc: 'Fonctionne côté navigateur sans serveur, sans abonnement ni clé API.',
      benefit3Title: 'Multi-langues et design raffiné',
      benefit3Desc: 'Prend en charge l\'anglais, l\'hébreu, l\'espagnol, le français et l\'arabe.',
      integrationGuideTitle: 'Guide d\'intégration pour WordPress, Wix et Shopify',
      faqTitle: 'Foire Aux Questions',
    },
    ar: {
      pageTitle: 'مركز الآلات الحاسبة والأدوات التفاعلية للتضمين مجاناً',
      pageDesc: 'أضف آلات حاسبة مالية وصحية متطورة وتفاعلية إلى موقعك الإلكتروني أو مدونتك بنقرة زر واحدة دون الحاجة إلى برمجة.',
      selectCalc: '1. اختر الآلة الحاسبة',
      customizeWidget: '2. تخصيص المظهر والإعدادات',
      previewWidget: '3. معاينة حية تفاعلية',
      codeSnippet: '4. نسخ كود التضمين',
      languageLabel: 'لغة الأداة',
      themeLabel: 'المظهر والألوان',
      lightTheme: 'المظهر الفاتح',
      darkTheme: 'المظهر الداكن',
      widthLabel: 'نمط العرض',
      responsiveWidth: 'متجاوب 100% (موصى به)',
      fixedWidth: 'عرض ثابت (600 بكسل)',
      compactWidth: 'الشريط الجانبي (380 بكسل)',
      heightLabel: 'الارتفاع (بكسل)',
      backlinkCheckbox: 'تضمين رابط المصدر (مجاني للمواقع التجارية والشخصية)',
      previewDesktop: 'كمبيوتر',
      previewTablet: 'جهاز لوحي',
      previewMobile: 'هاتف ذكي',
      copyIframe: 'نسخ كود HTML (iFrame)',
      copyReact: 'نسخ كود React',
      copyWP: 'نسخ لووردبريس (WordPress)',
      copied: 'تم النسخ بنجاح!',
      whyEmbedTitle: 'لماذا تقوم بتضمين أدوات GlobalCalc Pro في موقعك؟',
      benefit1Title: 'زيادة مدة بقاء الزائر في الموقع',
      benefit1Desc: 'الأدوات التفاعلية ترفع وقت بقاء الزائر بنسبة 3 إلى 5 أضعاف، مما يعزز ترتيب موقعك في محركات البحث (SEO).',
      benefit2Title: 'مجاني تماماً وبدون أي صيانة',
      benefit2Desc: 'تعمل الحسابات مباشرة في متصفح الزائر دون الحاجة إلى خوادم أو مفاتيح API.',
      benefit3Title: 'دعم كامل للغة العربية واتجاه اليمين لليسار (RTL)',
      benefit3Desc: 'متوافق بالكامل مع جميع الشاشات والأجهزة الذكية.',
      integrationGuideTitle: 'دليل التثبيت السريع على ووردبريس ومختلف المنصات',
      faqTitle: 'الأسئلة الشائعة من أصحاب المواقع والمدونات',
    }
  }[lang as 'en' | 'he' | 'es' | 'fr' | 'ar'] || {
    pageTitle: 'Free Embeddable Calculators & Widgets Hub',
    pageDesc: 'Add high-performance, responsive financial and utility calculators to your blog, news site, or client website with zero coding required.',
    selectCalc: '1. Select Calculator',
    customizeWidget: '2. Customize Appearance & Settings',
    previewWidget: '3. Interactive Live Preview',
    codeSnippet: '4. Copy Embed Code',
    languageLabel: 'Widget Language',
    themeLabel: 'Color Theme',
    lightTheme: 'Light Theme',
    darkTheme: 'Dark Theme',
    widthLabel: 'Width Style',
    responsiveWidth: 'Responsive 100% (Recommended)',
    fixedWidth: 'Standard (600px)',
    compactWidth: 'Sidebar (380px)',
    heightLabel: 'Height (px)',
    backlinkCheckbox: 'Include attribution link (Free for commercial & personal sites)',
    previewDesktop: 'Desktop',
    previewTablet: 'Tablet',
    previewMobile: 'Mobile',
    copyIframe: 'Copy HTML iFrame',
    copyReact: 'Copy React Component',
    copyWP: 'Copy WordPress Code',
    copied: 'Copied to Clipboard!',
    whyEmbedTitle: 'Why Embed GlobalCalc Pro Widgets on Your Website?',
    benefit1Title: 'Boost Time On Site (Dwell Time)',
    benefit1Desc: 'Interactive tools keep readers engaged 3x to 5x longer, sending positive user engagement signals directly to search engines.',
    benefit2Title: '100% Free & Zero Server Maintenance',
    benefit2Desc: 'Calculators run completely in the visitor\'s browser. No API keys, no monthly fees, and no server configuration needed.',
    benefit3Title: 'Multi-Language & Fully Responsive',
    benefit3Desc: 'Flawlessly scales from smartphone screens to ultra-wide displays in English, Hebrew, Spanish, French, and Arabic with native RTL support.',
    integrationGuideTitle: 'Quick Installation Guide for Popular Platforms',
    faqTitle: 'Frequently Asked Questions by Publishers & Webmasters',
  };

  return (
    <div className="w-full space-y-12">
      <SEO
        title={uiText.pageTitle}
        description={uiText.pageDesc}
        canonicalUrl={`/${lang}/widgets`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: uiText.pageTitle,
          description: uiText.pageDesc,
          url: `https://globalcalcpro.com/${lang}/widgets`,
          publisher: {
            '@type': 'Organization',
            name: 'GlobalCalc Pro',
            url: 'https://globalcalcpro.com'
          }
        }}
      />

      <Breadcrumbs
        items={[
          { label: t.catAll || 'Library', path: `/${lang}/all` },
          { label: lang === 'he' ? 'מרכז וידג\'טים להטמעה' : 'Widgets Hub' }
        ]}
      />

      {/* Hero Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'he' ? 'חינם למפתחים, בלוגרים ובעלי אתרים' : 'Free for Bloggers, Publishers & Webmasters'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 tracking-tight mb-4">
            {uiText.pageTitle}
          </h1>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed mb-6 font-medium">
            {uiText.pageDesc}
          </p>

          <div className="flex flex-wrap gap-4 text-xs sm:text-sm font-semibold text-stone-600">
            <div className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>{lang === 'he' ? 'טעינה מיידית ללא השהייה' : 'Instant Client-Side Engine'}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200">
              <Globe2 className="w-4 h-4 text-blue-500" />
              <span>{lang === 'he' ? 'תמיכה ב-5 שפות + RTL מלא' : '5 Languages with Full RTL'}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>{lang === 'he' ? 'רספונסיבי ומותאם SEO' : '100% Mobile Responsive'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Step 1: Calculator Selector */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs flex items-center justify-center font-black">1</span>
            <span>{uiText.selectCalc}</span>
          </h2>
          <span className="text-xs text-stone-500 font-semibold">{AVAILABLE_WIDGETS.length} {lang === 'he' ? 'מחשבונים זמינים' : 'calculators available'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {AVAILABLE_WIDGETS.map((widget) => {
            const isSelected = widget.id === selectedWidgetId;
            return (
              <button
                key={widget.id}
                type="button"
                onClick={() => {
                  setSelectedWidgetId(widget.id);
                  setCustomHeight(widget.defaultHeight);
                }}
                className={`p-4 rounded-2xl border text-start transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-2 ring-blue-500/20'
                    : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-2 rounded-xl bg-stone-100 text-stone-800 material-symbols-outlined text-[22px]">
                      {widget.icon}
                    </span>
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                      {widget.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm mb-1 line-clamp-1">
                    {widget.name[lang as keyof typeof widget.name] || widget.name.en}
                  </h3>
                  <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed font-medium">
                    {widget.description[lang as keyof typeof widget.description] || widget.description.en}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-blue-600">
                  <span>{isSelected ? (lang === 'he' ? 'נבחר להטמעה ✓' : 'Selected ✓') : (lang === 'he' ? 'בחר מחשבון' : 'Select')}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Step 2 & 3: Customizer & Live Preview */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Step 2: Customization Controls Panel */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-6">
          <h2 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs flex items-center justify-center font-black">2</span>
            <span>{uiText.customizeWidget}</span>
          </h2>

          {/* Language selector */}
          <div>
            <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-2">
              {uiText.languageLabel}
            </label>
            <div className="grid grid-cols-5 gap-1.5 p-1 bg-stone-100 rounded-xl border border-stone-200">
              {[
                { id: 'he', label: 'עברית' },
                { id: 'en', label: 'English' },
                { id: 'es', label: 'Español' },
                { id: 'fr', label: 'Français' },
                { id: 'ar', label: 'العربية' },
              ].map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setWidgetLang(l.id)}
                  className={`py-2 px-1 text-xs font-bold rounded-lg transition-all ${
                    widgetLang === l.id
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Width selector */}
          <div>
            <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-2">
              {uiText.widthLabel}
            </label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { id: 'responsive' as const, label: uiText.responsiveWidth, hint: '100%' },
                { id: 'fixed' as const, label: uiText.fixedWidth, hint: '600px' },
                { id: 'compact' as const, label: uiText.compactWidth, hint: '380px' },
              ].map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setWidthMode(w.id)}
                  className={`p-2.5 text-xs font-bold rounded-xl border transition-all text-center ${
                    widthMode === w.id
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-stone-200 text-stone-600 hover:border-stone-300'
                  }`}
                >
                  <span className="block font-bold">{w.hint}</span>
                  <span className="text-[10px] text-stone-500 font-medium block truncate">{w.label}</span>
                </button>
              ))}
            </div>

            {widthMode === 'fixed' && (
              <div className="mt-2">
                <div className="flex justify-between text-xs font-semibold text-stone-600 mb-1">
                  <span>{lang === 'he' ? 'הגדר רוחב מותאם:' : 'Custom Width:'}</span>
                  <span className="font-mono">{customWidth}px</span>
                </div>
                <input
                  type="range"
                  min={320}
                  max={900}
                  step={10}
                  value={customWidth}
                  onChange={(e) => setCustomWidth(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Height slider */}
          <div>
            <div className="flex justify-between text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">
              <label htmlFor="height-slider">{uiText.heightLabel}</label>
              <span className="font-mono text-blue-600">{customHeight}px</span>
            </div>
            <input
              id="height-slider"
              type="range"
              min={480}
              max={950}
              step={10}
              value={customHeight}
              onChange={(e) => setCustomHeight(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Theme selector */}
          <div>
            <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-2">
              {uiText.themeLabel}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-2 ${
                  theme === 'light'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-stone-200 text-stone-600'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full bg-white border border-stone-300"></span>
                <span>{uiText.lightTheme}</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-2 ${
                  theme === 'dark'
                    ? 'border-stone-900 bg-stone-900 text-white'
                    : 'border-stone-200 text-stone-600'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full bg-stone-900 border border-stone-600"></span>
                <span>{uiText.darkTheme}</span>
              </button>
            </div>
          </div>

          {/* Backlink toggle */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-3">
            <input
              id="backlink-checkbox"
              type="checkbox"
              checked={includeBacklink}
              onChange={(e) => setIncludeBacklink(e.target.checked)}
              className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
            />
            <label htmlFor="backlink-checkbox" className="text-xs text-stone-700 leading-relaxed cursor-pointer font-medium">
              <span className="font-bold block text-stone-900">{uiText.backlinkCheckbox}</span>
              <span className="text-[11px] text-stone-500 block mt-0.5">
                {lang === 'he'
                  ? 'הקישור מעניק קרדיט קטן ועוזר לנו להמשיך להציע את כל המחשבונים בחינם ללא פרסומות.'
                  : 'Displays a clean discrete attribution link. Free for all personal and commercial web projects.'}
              </span>
            </label>
          </div>

          <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
            <span>{lang === 'he' ? 'דף מקור מלא:' : 'Direct URL:'}</span>
            <a
              href={canonicalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-blue-600 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>/{widgetLang}/{selectedWidget.slug}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Step 3: Interactive Live Preview */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs flex items-center justify-center font-black">3</span>
              <span>{uiText.previewWidget}</span>
            </h2>

            {/* Device Frame toggles */}
            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded-lg transition-all flex items-center gap-1 text-xs font-semibold ${
                  previewDevice === 'desktop' ? 'bg-white text-blue-700 shadow-xs' : 'text-stone-500'
                }`}
                title={uiText.previewDesktop}
              >
                <Monitor className="w-4 h-4" />
                <span className="hidden sm:inline">{uiText.previewDesktop}</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('tablet')}
                className={`p-1.5 rounded-lg transition-all flex items-center gap-1 text-xs font-semibold ${
                  previewDevice === 'tablet' ? 'bg-white text-blue-700 shadow-xs' : 'text-stone-500'
                }`}
                title={uiText.previewTablet}
              >
                <Tablet className="w-4 h-4" />
                <span className="hidden sm:inline">{uiText.previewTablet}</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded-lg transition-all flex items-center gap-1 text-xs font-semibold ${
                  previewDevice === 'mobile' ? 'bg-white text-blue-700 shadow-xs' : 'text-stone-500'
                }`}
                title={uiText.previewMobile}
              >
                <Smartphone className="w-4 h-4" />
                <span className="hidden sm:inline">{uiText.previewMobile}</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-stone-500 font-medium">
            {lang === 'he'
              ? 'תצוגה מקדימה פעילה בזמן אמת. ניתן להזין ערכים ולבדוק את פעולת המחשבון בדיוק כפי שיופיע באתר שלך:'
              : 'Interactive live rendering. You can interact with the inputs below exactly as your readers will:'}
          </p>

          {/* Iframe Preview Container */}
          <div className="w-full bg-stone-100/70 p-4 sm:p-6 rounded-2xl border border-stone-200 flex justify-center overflow-x-auto min-h-[500px]">
            <div
              style={{
                width: previewFrameWidth,
                maxWidth: '100%',
                transition: 'width 0.25s ease'
              }}
              className="flex flex-col items-center"
            >
              <iframe
                src={fullEmbedUrl}
                width="100%"
                height={customHeight}
                frameBorder="0"
                title={selectedWidget.name[lang as keyof typeof selectedWidget.name] || selectedWidget.name.en}
                className="w-full rounded-2xl border border-stone-200 bg-white shadow-md"
              />
              {includeBacklink && (
                <p className="text-xs text-stone-500 mt-2 text-center font-sans">
                  {lang === 'he' ? 'מופעל ע״י' : 'Powered by'}{' '}
                  <a href={canonicalUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">
                    GlobalCalc Pro
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Step 4: Ready-to-copy code snippets */}
      <section className="bg-white rounded-3xl p-6 md:p-10 border border-stone-200 shadow-sm space-y-6">
        <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs flex items-center justify-center font-black">4</span>
          <span>{uiText.codeSnippet}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* HTML iFrame format */}
          <div className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 font-bold text-sm text-stone-900 mb-1">
                <Code2 className="w-4 h-4 text-blue-600" />
                <span>HTML / iFrame</span>
              </div>
              <p className="text-xs text-stone-500 mb-3">
                {lang === 'he' ? 'מתאים לכל אתר אינטרנט, HTML רגיל, בלוגים ומערכות תוכן.' : 'Standard HTML snippet for any website, raw HTML, or custom CMS.'}
              </p>
              <textarea
                readOnly
                rows={4}
                value={iframeCode}
                className="w-full bg-stone-900 text-stone-100 p-3 rounded-xl font-mono text-xs leading-relaxed border border-stone-800 resize-none"
                dir="ltr"
              />
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(iframeCode, 'iframe')}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              {copiedFormat === 'iframe' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copiedFormat === 'iframe' ? uiText.copied : uiText.copyIframe}</span>
            </button>
          </div>

          {/* WordPress Format */}
          <div className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 font-bold text-sm text-stone-900 mb-1">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>WordPress / Gutenberg</span>
              </div>
              <p className="text-xs text-stone-500 mb-3">
                {lang === 'he' ? 'הדבק ישירות בתוך בלוק Custom HTML בעורך גוטנברג או אלמנטור.' : 'Paste directly into Gutenberg "Custom HTML" block or Elementor HTML widget.'}
              </p>
              <textarea
                readOnly
                rows={4}
                value={wpShortcode}
                className="w-full bg-stone-900 text-stone-100 p-3 rounded-xl font-mono text-xs leading-relaxed border border-stone-800 resize-none"
                dir="ltr"
              />
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(wpShortcode, 'wp')}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              {copiedFormat === 'wp' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copiedFormat === 'wp' ? uiText.copied : uiText.copyWP}</span>
            </button>
          </div>

          {/* React / Next.js Component */}
          <div className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 font-bold text-sm text-stone-900 mb-1">
                <Code2 className="w-4 h-4 text-emerald-600" />
                <span>React / Next.js Component</span>
              </div>
              <p className="text-xs text-stone-500 mb-3">
                {lang === 'he' ? 'רכיב מוכן לשימוש באפליקציות React, Next.js, Gatsby או Remix.' : 'Ready-to-use React functional component for React, Next.js, or Remix.'}
              </p>
              <textarea
                readOnly
                rows={4}
                value={reactCode}
                className="w-full bg-stone-900 text-stone-100 p-3 rounded-xl font-mono text-xs leading-relaxed border border-stone-800 resize-none"
                dir="ltr"
              />
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(reactCode, 'react')}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              {copiedFormat === 'react' ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
              <span>{copiedFormat === 'react' ? uiText.copied : uiText.copyReact}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Value Proposition / Why Embed Section */}
      <section className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 border border-stone-800">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-8 text-center">
          {uiText.whyEmbedTitle}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">{uiText.benefit1Title}</h3>
            <p className="text-stone-400 text-sm leading-relaxed font-medium">{uiText.benefit1Desc}</p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">{uiText.benefit2Title}</h3>
            <p className="text-stone-400 text-sm leading-relaxed font-medium">{uiText.benefit2Desc}</p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Globe2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">{uiText.benefit3Title}</h3>
            <p className="text-stone-400 text-sm leading-relaxed font-medium">{uiText.benefit3Desc}</p>
          </div>
        </div>
      </section>

      {/* Platform installation guide */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
        <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
          {uiText.integrationGuideTitle}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <span className="font-bold text-stone-900 text-sm block">WordPress / Elementor</span>
            <p className="text-xs text-stone-600 leading-relaxed font-medium">
              {lang === 'he'
                ? 'הוסיפו בלוק מסוג "HTML מותאם" בעורך גוטנברג או ווידג\'ט HTML באלמנטור, והדביקו את הקוד.'
                : 'Add a "Custom HTML" block in the Gutenberg editor or an HTML widget in Elementor, and paste the iframe snippet.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <span className="font-bold text-stone-900 text-sm block">Wix</span>
            <p className="text-xs text-stone-600 leading-relaxed font-medium">
              {lang === 'he'
                ? 'לחצו על "הוסף אלמנט" (Add) ← בחרו "Embed Code" ← בחרו "Embed HTML" והדביקו את הקוד.'
                : 'Click "Add Elements" (+) → choose "Embed Code" → select "Embed HTML" and paste the code snippet.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <span className="font-bold text-stone-900 text-sm block">Squarespace</span>
            <p className="text-xs text-stone-600 leading-relaxed font-medium">
              {lang === 'he'
                ? 'הוסיפו בלוק "Code" או "Embed", ודאו שהפורמט מוגדר כ-HTML, והדביקו את קוד ה-iframe.'
                : 'Add a "Code" block to any page or post, set the mode to HTML, and paste the iframe snippet.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <span className="font-bold text-stone-900 text-sm block">Webflow / Shopify</span>
            <p className="text-xs text-stone-600 leading-relaxed font-medium">
              {lang === 'he'
                ? 'השתמשו באלמנט "Embed" ב-Webflow או במקטע "Custom Liquid / HTML" ב-Shopify.'
                : 'Drop an "Embed Code" element in Webflow Designer or a "Custom Liquid / HTML" section in Shopify.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
