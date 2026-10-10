import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
  ShieldCheck,
  Zap,
  Globe2,
  Layers,
  Palette,
  Search,
  Share2,
  RefreshCw,
  Box,
  FileCode2,
  Building2,
  TrendingUp,
  Car,
  HeartPulse,
  Cpu,
  HelpCircle,
  CheckCircle2,
  BookmarkPlus
} from 'lucide-react';
import {
  AVAILABLE_WIDGETS,
  THEME_PALETTES,
  generateIframeCode,
  generateReactCode,
  generateWordPressCode,
  generateWebComponentCode,
  buildEmbedUrl,
  buildRelativeEmbedUrl,
  buildCanonicalUrl,
  getShadowCss,
  EmbedOptions
} from '../lib/widgets/widgetsConfig';
import { trackWidgetInteraction } from '../lib/analytics';

export default function WidgetsHub() {
  const { lang, t } = useI18n();
  const location = useLocation();

  // Search parameters for deep linking (e.g. /widgets?calc=retirement&theme=dark)
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  // Widget selection & category filter
  const [selectedWidgetId, setSelectedWidgetId] = useState<string>('mortgage');
  const [widgetSearchQuery, setWidgetSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Customization state
  const [widgetLang, setWidgetLang] = useState<string>(lang);
  const [selectedPaletteId, setSelectedPaletteId] = useState<string>('emerald-pro');
  const [primaryColor, setPrimaryColor] = useState<string>('#006B5B');
  const [accentColor, setAccentColor] = useState<string>('#10B981');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [borderRadius, setBorderRadius] = useState<number>(16);
  const [shadowElevation, setShadowElevation] = useState<'none' | 'subtle' | 'elevated' | 'deep'>('elevated');
  const [showBorder, setShowBorder] = useState<boolean>(true);
  const [widthMode, setWidthMode] = useState<'responsive' | 'fixed' | 'compact'>('responsive');
  const [customWidth, setCustomWidth] = useState<number>(600);
  const [customHeight, setCustomHeight] = useState<number>(680);
  const [includeBacklink, setIncludeBacklink] = useState<boolean>(true);

  // Preview & Code tab state
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeCodeTab, setActiveCodeTab] = useState<'iframe' | 'react' | 'wp' | 'webcomponent' | 'url'>('iframe');
  const [activePlatformGuide, setActivePlatformGuide] = useState<'wp' | 'wix' | 'react' | 'webflow'>('wp');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  // Deep-link auto-selection on mount or searchParam change
  useEffect(() => {
    const calcParam = searchParams.get('calc') || searchParams.get('widget');
    if (calcParam) {
      const cleanParam = calcParam.toLowerCase().replace(/^(calculators\/)/, '');
      const matched = AVAILABLE_WIDGETS.find(
        (w) =>
          w.id === cleanParam ||
          w.slug === cleanParam ||
          w.slug.endsWith(`/${cleanParam}`) ||
          w.slug.replace('calculators/', '') === cleanParam
      );
      if (matched) {
        setSelectedWidgetId(matched.id);
        setCustomHeight(matched.defaultHeight);
      }
    }

    const themeParam = searchParams.get('theme');
    if (themeParam === 'dark' || themeParam === 'light') {
      setTheme(themeParam);
    }

    const primaryParam = searchParams.get('primary');
    if (primaryParam) {
      setPrimaryColor(primaryParam.startsWith('#') ? primaryParam : `#${primaryParam}`);
      setSelectedPaletteId('custom');
    }

    const langParam = searchParams.get('lang');
    if (langParam && ['en', 'he', 'es', 'fr', 'ar', 'ru'].includes(langParam)) {
      setWidgetLang(langParam);
    }
  }, [searchParams]);

  const selectedWidget = AVAILABLE_WIDGETS.find((w) => w.id === selectedWidgetId) || AVAILABLE_WIDGETS[0];

  // Available unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    AVAILABLE_WIDGETS.forEach((w) => set.add(w.category));
    return Array.from(set);
  }, []);

  // Filtered widgets
  const filteredWidgets = useMemo(() => {
    return AVAILABLE_WIDGETS.filter((w) => {
      const matchesCat = selectedCategory === 'all' || w.category === selectedCategory;
      const q = widgetSearchQuery.toLowerCase().trim();
      if (!q) return matchesCat;
      const localizedName = (w.name[lang as keyof typeof w.name] || w.name.en).toLowerCase();
      const localizedDesc = (w.description[lang as keyof typeof w.description] || w.description.en).toLowerCase();
      const matchesSearch = localizedName.includes(q) || localizedDesc.includes(q) || w.slug.includes(q);
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, widgetSearchQuery, lang]);

  const effectiveWidth =
    widthMode === 'responsive' ? '100%' : widthMode === 'compact' ? '380px' : `${customWidth}px`;

  const previewFrameWidth =
    previewDevice === 'mobile' ? '380px' : previewDevice === 'tablet' ? '640px' : '100%';

  const previewEmbedUrl = buildRelativeEmbedUrl(selectedWidget.slug, widgetLang, theme, {
    primaryColor,
    accentColor,
    borderRadius
  });
  const fullEmbedUrl = buildEmbedUrl(selectedWidget.slug, widgetLang, theme, {
    primaryColor,
    accentColor,
    borderRadius
  });
  const canonicalUrl = buildCanonicalUrl(selectedWidget.slug, widgetLang);

  const embedOptions: EmbedOptions = {
    widget: selectedWidget,
    widgetLang,
    uiLang: lang,
    width: effectiveWidth,
    height: customHeight,
    theme,
    primaryColor,
    accentColor,
    borderRadius,
    shadow: shadowElevation,
    showBorder,
    includeBacklink
  };

  const iframeCode = generateIframeCode(embedOptions);
  const reactCode = generateReactCode(embedOptions);
  const wpShortcode = generateWordPressCode(embedOptions);
  const webComponentCode = generateWebComponentCode(embedOptions);
  const shareableUrl = fullEmbedUrl;

  const handlePaletteSelect = (paletteId: string) => {
    setSelectedPaletteId(paletteId);
    const p = THEME_PALETTES.find((pal) => pal.id === paletteId);
    if (p) {
      setPrimaryColor(p.primary);
      setAccentColor(p.accent);
      setTheme(p.theme);
    }
  };

  const handleResetToDefaults = () => {
    setCustomHeight(selectedWidget.defaultHeight);
    setWidthMode('responsive');
    setBorderRadius(16);
    setShadowElevation('elevated');
    setShowBorder(true);
    handlePaletteSelect('emerald-pro');
  };

  const copyToClipboard = (text: string, formatId: string) => {
    navigator.clipboard.writeText(text);
    trackWidgetInteraction('copy_code', selectedWidget.slug, formatId, theme);
    setCopiedTab(formatId);
    setTimeout(() => setCopiedTab(null), 2500);
  };

  const scrollToCustomizer = (widgetId: string) => {
    setSelectedWidgetId(widgetId);
    const target = AVAILABLE_WIDGETS.find((w) => w.id === widgetId);
    if (target) {
      setCustomHeight(target.defaultHeight);
    }
    const el = document.getElementById('step-customizer');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const uiText = {
    en: {
      pageTitle: 'Free Embeddable Calculators & Interactive Widgets Hub',
      pageDesc: 'Embed customizable, high-performance financial, real estate, health, and math calculators onto your website or blog. Zero coding required, 100% responsive HTML iFrame and React code.',
      metaKeywords: 'embed calculator widget, mortgage calculator widget, compound interest iframe, free website calculators, financial calculator for bloggers, react calculator component, wordpress calculator embed',
      badge: 'High-Demand Webmaster & Blogger Embed Suite',
      feature1: '100% Client-Side Engine (Zero Latency & Serverless)',
      feature2: 'Live Visual Brand Customizer (Colors & Radius)',
      feature3: 'Multi-Format Embed Code (React, HTML iFrame, WordPress)',
      selectCalc: '1. Select Calculator',
      searchPlaceholder: 'Search calculators by name, category, or topic...',
      allCategories: 'All Categories',
      customizeWidget: '2. Customize Theme, Brand Colors & Layout',
      brandPaletteLabel: 'Color Theme & Brand Presets',
      customColors: 'Custom Colors (Hex / Swatches)',
      primaryColorLabel: 'Primary / Brand Color',
      accentColorLabel: 'Accent Color',
      borderRadiusLabel: 'Corner Border Radius',
      shadowElevationLabel: 'Box Shadow Elevation',
      shadowNone: 'Flat (None)',
      shadowSubtle: 'Subtle',
      shadowElevated: 'Modern (Elevated)',
      shadowDeep: 'Deep 3D',
      showBorderLabel: 'Show Outline Border',
      previewWidget: '3. Interactive Real-Time Preview',
      codeSnippet: '4. Export Ready-to-Use Embed Code',
      languageLabel: 'Widget Language',
      themeLabel: 'Color Theme Mode',
      lightTheme: 'Light Theme',
      darkTheme: 'Dark Theme',
      widthLabel: 'Widget Width Mode',
      responsiveWidth: 'Responsive 100% (Recommended for Articles)',
      fixedWidth: 'Standard (600px)',
      compactWidth: 'Sidebar (380px)',
      heightLabel: 'Height (px)',
      backlinkCheckbox: 'Include attribution link (Free for commercial & personal sites)',
      previewDesktop: 'Desktop',
      previewTablet: 'Tablet',
      previewMobile: 'Mobile',
      resetDefaults: 'Reset to Defaults',
      copied: 'Copied to Clipboard!',
      industryTitle: 'Recommended Calculator Kits by Industry',
      industrySubtitle: 'Boost reader engagement, time-on-site, and conversion rates with purpose-built calculator sets for your niche:',
      installGuideTitle: 'Quick Installation Guide for Popular Platforms',
      whyEmbedTitle: 'Why Embed GlobalCalc Pro Widgets on Your Website?',
      benefit1Title: 'Boost Time On Site (Dwell Time)',
      benefit1Desc: 'Interactive tools keep readers engaged 3x to 5x longer, sending positive user engagement signals directly to search engines.',
      benefit2Title: '100% Free & Zero Server Maintenance',
      benefit2Desc: 'Calculators run completely in the visitor\'s browser. No API keys, no monthly fees, and no server configuration needed.',
      benefit3Title: 'Multi-Language & Fully Responsive',
      benefit3Desc: 'Flawlessly scales from smartphone screens to ultra-wide displays in English, Hebrew, Spanish, French, and Arabic with native RTL support.',
      faqTitle: 'Frequently Asked Questions by Publishers & Webmasters',
    },
    he: {
      pageTitle: 'מחולל ווידג\'טים ומחשבונים להטמעה חינם באתרים ובלוגים',
      pageDesc: 'הטמיעו מחשבוני פרימיום מעוצבים באתר, בבלוג או באפליקציה שלכם: התאמת צבעי מותג, רדיוס פינות, צל ושפה. קוד HTML ו-React מוכן להעתקה מיידית ללא צורך בקוד.',
      metaKeywords: 'ווידג\'ט מחשבון להטמעה, מחשבון משכנתא להטמעה באתר, מחשבון ריבית דריבית לוורדפרס, מחשבונים להטמעה חינם, קוד HTML מחשבון, מחשבון לאתרי נדלן, רכיב ריאקט מחשבון',
      badge: 'מחולל ווידג\'טים אינטראקטיבי מתקדם למנהלי אתרים',
      feature1: 'טעינה מיידית ללא שרת (Zero Latency & Serverless)',
      feature2: 'עורך עיצוב וצבעי מותג חיים (Live Theme Customizer)',
      feature3: 'ייצוא רב-פורמטי (React, HTML iFrame, WordPress)',
      selectCalc: '1. בחירת מחשבון להטמעה',
      searchPlaceholder: 'חיפוש מחשבון לפי שם, קטגוריה או נושא...',
      allCategories: 'כל הקטגוריות',
      customizeWidget: '2. התאמת עיצוב, צבעי מותג וממדים',
      brandPaletteLabel: 'ערכות צבעים ומותג מוכנות',
      customColors: 'בחירת צבעים מותאמת אישית (HEX)',
      primaryColorLabel: 'צבע מותג ראשי',
      accentColorLabel: 'צבע משני (Accent)',
      borderRadiusLabel: 'רדיוס פינות (פינות מעוגלות)',
      shadowElevationLabel: 'הצללת מסגרת (Shadow)',
      shadowNone: 'שטוח (ללא צל)',
      shadowSubtle: 'עדין',
      shadowElevated: 'מודרני (מומלץ)',
      shadowDeep: 'תלת-ממדי עמוק',
      showBorderLabel: 'הצג גבול מסגרת דק',
      previewWidget: '3. תצוגה מקדימה אינטראקטיבית חיה',
      codeSnippet: '4. העתקת קוד הטמעה מוכן',
      languageLabel: 'שפת המחשבון',
      themeLabel: 'מצב תצוגה (Theme)',
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
      resetDefaults: 'איפוס לברירת מחדל',
      copied: 'הקוד הועתק בהצלחה!',
      industryTitle: 'ערכות מחשבונים מומלצות לפי ענף פעילות',
      industrySubtitle: 'הגדילו את זמן השהייה וההמרות באתר באמצעות ערכות מחשבונים מותאמות לתחום העיסוק שלכם:',
      installGuideTitle: 'מדריך הטמעה מהיר במערכות ניהול תוכן (CMS)',
      whyEmbedTitle: 'למה להטמיע מחשבונים מבית GlobalCalc Pro באתר שלך?',
      benefit1Title: 'הגדלת זמן השהייה באתר (Dwell Time)',
      benefit1Desc: 'כלים אינטראקטיביים מעלים את זמן השהייה של הגולשים בממוצע פי 3 עד 5, מה שתורם משמעותית לדירוג האתר במנועי חיפוש (SEO).',
      benefit2Title: 'חינם לחלוטין וללא תחזוקת שרתים',
      benefit2Desc: 'המחשבונים רצים ישירות בדפדפן הגולש. אין צורך במפתחות API, הרשמה או תשלומים חודשיים.',
      benefit3Title: 'תמיכה מלאה בריבוי שפות וב-RTL',
      benefit3Desc: 'התאמה מושלמת למכשירים ניידים ומחשבים, עם תמיכה מובנית בעברית, אנגלית, ספרדית, צרפתית וערבית.',
      faqTitle: 'שאלות ותשובות נפוצות למנהלי אתרים ומפתחים',
    },
    es: {
      pageTitle: 'Personalizador de Widgets y Calculadoras para Insertar en Webs',
      pageDesc: 'Inserta calculadoras financieras, hipotecarias y científicas en tu web o blog con una línea de código. Personaliza colores de marca y copia el código HTML o React.',
      metaKeywords: 'widget calculadora insertar, calculadora hipoteca iframe, widget interes compuesto, calculadoras para blogs, react calculadora',
      badge: 'Generador de Widgets Interactivos en Vivo',
      feature1: 'Motor 100% en el cliente sin servidores ni latencia',
      feature2: 'Personalizador visual de colores y bordes',
      feature3: 'Código listo para React, HTML y WordPress',
      selectCalc: '1. Seleccionar Calculadora',
      searchPlaceholder: 'Buscar calculadora por nombre o categoría...',
      allCategories: 'Todas las categorías',
      customizeWidget: '2. Personalizar Diseño y Colores',
      brandPaletteLabel: 'Paletas de Color Prediseñadas',
      customColors: 'Colores Personalizados',
      primaryColorLabel: 'Color Principal',
      accentColorLabel: 'Color Secundario',
      borderRadiusLabel: 'Radio de Bordes',
      shadowElevationLabel: 'Sombra y Elevación',
      shadowNone: 'Plano (Sin sombra)',
      shadowSubtle: 'Sutil',
      shadowElevated: 'Moderno (Elevado)',
      shadowDeep: 'Profundo 3D',
      showBorderLabel: 'Mostrar borde exterior',
      previewWidget: '3. Vista Previa en Vivo',
      codeSnippet: '4. Copiar Código de Inserción',
      languageLabel: 'Idioma del Widget',
      themeLabel: 'Modo de Tema',
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
      resetDefaults: 'Restablecer valores',
      copied: '¡Copiado con éxito!',
      industryTitle: 'Paquetes de Calculadoras por Sector',
      industrySubtitle: 'Herramientas interactivas diseñadas específicamente para maximizar la permanencia en tu web:',
      installGuideTitle: 'Guía de instalación en WordPress, Wix y Webflow',
      whyEmbedTitle: '¿Por qué integrar los widgets de GlobalCalc Pro?',
      benefit1Title: 'Mayor tiempo de permanencia en el sitio',
      benefit1Desc: 'Las herramientas interactivas incrementan el tiempo de visita y reducen la tasa de rebote.',
      benefit2Title: 'Sin costes de servidor ni mantenimiento',
      benefit2Desc: 'Ejecución 100% en el cliente, sin claves API ni suscripciones.',
      benefit3Title: 'Diseño móvil de máxima calidad',
      benefit3Desc: 'Se adapta de forma nativa a cualquier resolución de pantalla.',
      faqTitle: 'Preguntas Frecuentes',
    },
    fr: {
      pageTitle: 'Hub de Calculateurs & Widgets Intégrables Gratuits',
      pageDesc: 'Ajoutez des calculateurs interactifs sur votre site ou blog en quelques secondes. Personnalisez vos couleurs de marque et copiez le code HTML ou React.',
      metaKeywords: 'widget calculateur intégrer, simulateur prêt immobilier iframe, widget épargne wordpress, calculateurs gratuits blog',
      badge: 'Générateur de Widgets Interactifs en Direct',
      feature1: 'Moteur 100% côté client sans latence',
      feature2: 'Personnalisation graphique avancée',
      feature3: 'Code prêt pour React, HTML et WordPress',
      selectCalc: '1. Choisir un Calculateur',
      searchPlaceholder: 'Rechercher un calculateur...',
      allCategories: 'Toutes les catégories',
      customizeWidget: '2. Personnaliser le Design & Couleurs',
      brandPaletteLabel: 'Palettes de Couleurs Recommandées',
      customColors: 'Couleurs Personnalisées',
      primaryColorLabel: 'Couleur Principale',
      accentColorLabel: 'Couleur d\'Accent',
      borderRadiusLabel: 'Rayon des Bordures',
      shadowElevationLabel: 'Ombre et Élévation',
      shadowNone: 'Plat (Sans ombre)',
      shadowSubtle: 'Subtil',
      shadowElevated: 'Moderne (Élevé)',
      shadowDeep: 'Profond 3D',
      showBorderLabel: 'Afficher une bordure extérieure',
      previewWidget: '3. Aperçu en Direct',
      codeSnippet: '4. Copier le Code d\'Intégration',
      languageLabel: 'Langue du Widget',
      themeLabel: 'Mode Graphique',
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
      resetDefaults: 'Réinitialiser',
      copied: 'Copié dans le presse-papiers !',
      industryTitle: 'Kits de Calculateurs par Secteur',
      industrySubtitle: 'Outils sur mesure pour stimuler l\'engagement et le SEO de votre site:',
      installGuideTitle: 'Guide d\'intégration pour WordPress, Wix et Shopify',
      whyEmbedTitle: 'Pourquoi intégrer les widgets GlobalCalc Pro ?',
      benefit1Title: 'Augmentez le temps passé sur vos pages',
      benefit1Desc: 'Les outils interactifs multiplient l\'engagement de vos visiteurs et favorisent le référencement SEO.',
      benefit2Title: 'Totalement gratuit et sans maintenance',
      benefit2Desc: 'Fonctionne côté navigateur sans serveur, sans abonnement ni clé API.',
      benefit3Title: 'Multi-langues et design raffiné',
      benefit3Desc: 'Prend en charge l\'anglais, l\'hébreu, l\'espagnol, le français et l\'arabe.',
      faqTitle: 'Foire Aux Questions',
    },
    ar: {
      pageTitle: 'مركز الآلات الحاسبة والأدوات التفاعلية للتضمين مجاناً',
      pageDesc: 'خصص ألوان علامتك التجارية، حواف الإطار، الظلال، وضمّن آلات حاسبة مالية وهندسية متطورة مباشرة في موقعك أو تطبيق React.',
      metaKeywords: 'تضمين حاسبة في الموقع, ويدجت حاسبة قروض, حاسبة التمويل ووردبريس, ادوات تفاعلية للمواقع',
      badge: 'أداة إنشاء وتخصيص الودجات التفاعلية',
      feature1: 'محرك يعمل في المتصفح فورياً (Zero Latency)',
      feature2: 'تخصيص بصري لألوان العلامة التجارية',
      feature3: 'تصدير الأكواد لـ React و HTML و WordPress',
      selectCalc: '1. اختر الآلة الحاسبة',
      searchPlaceholder: 'بحث في الآلات الحاسبة...',
      allCategories: 'جميع الفئات',
      customizeWidget: '2. تخصيص المظهر والألوان والأبعاد',
      brandPaletteLabel: 'لوحات الألوان الجاهزة',
      customColors: 'ألوان مخصصة',
      primaryColorLabel: 'اللون الرئيسي للعلامة',
      accentColorLabel: 'اللون التكميلي',
      borderRadiusLabel: 'انحناء الحواف (Border Radius)',
      shadowElevationLabel: 'ظلال الإطار (Shadow)',
      shadowNone: 'مسطح (بدون ظل)',
      shadowSubtle: 'خفيف',
      shadowElevated: 'حديث وبارز',
      shadowDeep: 'عميق ثلاثي الأبعاد',
      showBorderLabel: 'إظهار حد خارجي دقيق',
      previewWidget: '3. معاينة حية تفاعلية',
      codeSnippet: '4. نسخ كود التضمين الجاهز',
      languageLabel: 'لغة الأداة',
      themeLabel: 'المظهر والألوان',
      lightTheme: 'المظهر الفاتح',
      darkTheme: 'المظهر الداكن',
      widthLabel: 'نمط العرض',
      responsiveWidth: 'متجاوب 100% (موصى به)',
      fixedWidth: 'عرض ثابت (600 بكسل)',
      compactWidth: 'الشريط الجانبي (380 بكسل)',
      heightLabel: 'الارتفاع (בפיקסלים)',
      backlinkCheckbox: 'تضمين رابط المصدر (مجاني للمواقع التجارية والشخصية)',
      previewDesktop: 'كمبيوتر',
      previewTablet: 'جهاز لوحي',
      previewMobile: 'هاتف ذكي',
      resetDefaults: 'إعادة التعيين',
      copied: 'تم النسخ بنجاح!',
      industryTitle: 'حزم الآلات الحاسبة حسب قطاع العمل',
      industrySubtitle: 'أدوات تفاعلية مخصصة ترفع من مدة بقاء الزائر ومعدلات التفاعل:',
      installGuideTitle: 'دليل التثبيت السريع على ووردبريس ومختلف المنصات',
      whyEmbedTitle: 'لماذا تقوم بتضمين أدوات GlobalCalc Pro في موقعك؟',
      benefit1Title: 'زيادة مدة بقاء الزائر في الموقع',
      benefit1Desc: 'الأدوات التفاعلية ترفع وقت بقاء الزائر بنسبة 3 إلى 5 أضعاف، مما يعزز ترتيب موقعك في محركات البحث (SEO).',
      benefit2Title: 'مجاني تماماً وبدون أي صيانة',
      benefit2Desc: 'تعمل الحسابات مباشرة في متصفح الزائر دون الحاجة إلى خوادم أو مفاتيح API.',
      benefit3Title: 'دعم كامل للغة العربية واتجاه اليمين لليسار (RTL)',
      benefit3Desc: 'متوافق بالكامل مع جميع الشاشات والأجهزة الذكية.',
      faqTitle: 'الأسئلة الشائعة من أصحاب المواقع والمدونات',
    },
    ru: {
      pageTitle: 'Интерактивный конструктор виджетов и встраиваемых калькуляторов',
      pageDesc: 'Настройте фирменные цвета, скругление углов, тени и встройте финансовые и научные калькуляторы на свой сайт или в React приложение.',
      metaKeywords: 'встроить калькулятор на сайт, виджет калькулятора ипотеки, калькулятор для wordpress, бесплатные виджеты для сайта, react калькулятор',
      badge: 'Визуальный генератор калькуляторов для сайтов',
      feature1: 'Работает на клиенте без задержек и серверов',
      feature2: 'Визуальный редактор тем и палитр',
      feature3: 'Экспорт для React, HTML, WordPress',
      selectCalc: '1. Выберите калькулятор',
      searchPlaceholder: 'Поиск калькулятора...',
      allCategories: 'Все категории',
      customizeWidget: '2. Настройка дизайна и параметров',
      brandPaletteLabel: 'Готовые цветовые палитры',
      customColors: 'Пользовательские цвета (HEX)',
      primaryColorLabel: 'Основной цвет бренда',
      accentColorLabel: 'Дополнительный акцент',
      borderRadiusLabel: 'Скругление углов',
      shadowElevationLabel: 'Эффект тени (Shadow)',
      shadowNone: 'Плоский (без тени)',
      shadowSubtle: 'Легкая',
      shadowElevated: 'Современная (рекомендуется)',
      shadowDeep: 'Глубокая 3D',
      showBorderLabel: 'Показывать внешнюю рамку',
      previewWidget: '3. Интерактивный предпросмотр',
      codeSnippet: '4. Экспорт готового кода',
      languageLabel: 'Язык виджета',
      themeLabel: 'Тема оформления',
      lightTheme: 'Светлая тема',
      darkTheme: 'Темная тема',
      widthLabel: 'Ширина виджета',
      responsiveWidth: 'Адаптивная 100% (Рекомендуется)',
      fixedWidth: 'Стандартная (600px)',
      compactWidth: 'Сайдбар (380px)',
      heightLabel: 'Высота (px)',
      backlinkCheckbox: 'Включить ссылку на источник (бесплатно для всех сайтов)',
      previewDesktop: 'Компьютер',
      previewTablet: 'Планшет',
      previewMobile: 'Смартфон',
      resetDefaults: 'Сбросить настройки',
      copied: 'Скопировано в буфер обмена!',
      industryTitle: 'Тематические наборы калькуляторов для сайтов',
      industrySubtitle: 'Готовые интерактивные модули для максимального удержания аудитории в вашей нише:',
      installGuideTitle: 'Инструкция по установке на WordPress, Tilda, React и HTML',
      whyEmbedTitle: 'Зачем встраивать виджеты GlobalCalc Pro на ваш сайт?',
      benefit1Title: 'Увеличение времени на сайте и улучшение SEO',
      benefit1Desc: 'Интерактивные инструменты удерживают посетителей в 3–5 раз дольше, что положительно влияет на поведенческие факторы в поиске.',
      benefit2Title: '100% бесплатно и без серверов',
      benefit2Desc: 'Все вычисления происходят прямо в браузере пользователя без задержек и без необходимости оплачивать API.',
      benefit3Title: 'Полная мультиязычность и адаптивность',
      benefit3Desc: 'Идеально отображается на любых экранах, от смартфонов до широкоформатных мониторов.',
      faqTitle: 'Часто задаваемые вопросы для владельцев сайтов',
    }
  }[lang as 'en' | 'he' | 'es' | 'fr' | 'ar' | 'ru'] || {
    pageTitle: 'Free Embeddable Calculators & Interactive Widgets Hub',
    pageDesc: 'Embed customizable, high-performance financial, real estate, health, and math calculators onto your website or blog. Zero coding required, 100% responsive HTML iFrame and React code.',
    metaKeywords: 'embed calculator widget, mortgage calculator widget, compound interest iframe, free website calculators, financial calculator for bloggers, react calculator component, wordpress calculator embed',
    badge: 'High-Demand Webmaster & Blogger Embed Suite',
    feature1: '100% Client-Side Engine (Zero Latency & Serverless)',
    feature2: 'Live Visual Brand Customizer (Colors & Radius)',
    feature3: 'Multi-Format Embed Code (React, HTML iFrame, WordPress)',
    selectCalc: '1. Select Calculator',
    searchPlaceholder: 'Search calculators by name, category, or topic...',
    allCategories: 'All Categories',
    customizeWidget: '2. Customize Theme, Brand Colors & Layout',
    brandPaletteLabel: 'Color Theme & Brand Presets',
    customColors: 'Custom Colors (Hex / Swatches)',
    primaryColorLabel: 'Primary / Brand Color',
    accentColorLabel: 'Accent Color',
    borderRadiusLabel: 'Corner Border Radius',
    shadowElevationLabel: 'Box Shadow Elevation',
    shadowNone: 'Flat (None)',
    shadowSubtle: 'Subtle',
    shadowElevated: 'Modern (Elevated)',
    shadowDeep: 'Deep 3D',
    showBorderLabel: 'Show Outline Border',
    previewWidget: '3. Interactive Real-Time Preview',
    codeSnippet: '4. Export Ready-to-Use Embed Code',
    languageLabel: 'Widget Language',
    themeLabel: 'Color Theme Mode',
    lightTheme: 'Light Theme',
    darkTheme: 'Dark Theme',
    widthLabel: 'Widget Width Mode',
    responsiveWidth: 'Responsive 100% (Recommended for Articles)',
    fixedWidth: 'Standard (600px)',
    compactWidth: 'Sidebar (380px)',
    heightLabel: 'Height (px)',
    backlinkCheckbox: 'Include attribution link (Free for commercial & personal sites)',
    previewDesktop: 'Desktop',
    previewTablet: 'Tablet',
    previewMobile: 'Mobile',
    resetDefaults: 'Reset to Defaults',
    copied: 'Copied to Clipboard!',
    industryTitle: 'Recommended Calculator Kits by Industry',
    industrySubtitle: 'Boost reader engagement, time-on-site, and conversion rates with purpose-built calculator sets for your niche:',
    installGuideTitle: 'Quick Installation Guide for Popular Platforms',
    whyEmbedTitle: 'Why Embed GlobalCalc Pro Widgets on Your Website?',
    benefit1Title: 'Boost Time On Site (Dwell Time)',
    benefit1Desc: 'Interactive tools keep readers engaged 3x to 5x longer, sending positive user engagement signals directly to search engines.',
    benefit2Title: '100% Free & Zero Server Maintenance',
    benefit2Desc: 'Calculators run completely in the visitor\'s browser. No API keys, no monthly fees, and no server configuration needed.',
    benefit3Title: 'Multi-Language & Fully Responsive',
    benefit3Desc: 'Flawlessly scales from smartphone screens to ultra-wide displays in English, Hebrew, Spanish, French, and Arabic with native RTL support.',
    faqTitle: 'Frequently Asked Questions by Publishers & Webmasters',
  };

  // Structured Schema.org data with ItemList of calculators and FAQPage
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'GlobalCalc Pro Widgets Hub',
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'All',
        url: `https://globalcalcpro.com/${lang}/widgets`,
        description: uiText.pageDesc,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        }
      },
      {
        '@type': 'ItemList',
        name: 'Supported Embeddable Calculators Catalog',
        description: 'Complete catalog of free interactive embeddable calculators for publishers and webmasters.',
        itemListElement: AVAILABLE_WIDGETS.map((w, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: w.name[lang as keyof typeof w.name] || w.name.en,
          url: `https://globalcalcpro.com/${lang}/${w.slug}`
        }))
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: lang === 'he' ? 'כיצד מטמיעים מחשבון באתר וורדפרס, וויקס או בלוג?' : 'How do I embed a calculator on WordPress, Wix, or a blog?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: lang === 'he'
                ? 'מעתיקים את קוד ה-HTML (iFrame) ממחולל הווידג\'טים ומדביקים אותו בתוך בלוק Custom HTML בוורדפרס, או בתוך רכיב Embed / HTML בוויקס או וובפלו.'
                : 'Copy the generated HTML iframe code and paste it directly into a WordPress Custom HTML block or an Embed/HTML element in Wix, Webflow, or Shopify.'
            }
          },
          {
            '@type': 'Question',
            name: lang === 'he' ? 'האם השימוש בווידג\'טים חינם לשימוש מסחרי?' : 'Is embedding calculators free for commercial websites?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: lang === 'he'
                ? 'כן, כל המחשבונים והווידג\'טים ניתנים להטמעה בחינם לחלוטין לכל אתר מסחרי, בלוג או עסק, ללא הגבלת צפיות וללא צורך במפתחות API.'
                : 'Yes, all calculator widgets are 100% free for both personal and commercial websites, with no view limits or API keys required.'
            }
          },
          {
            '@type': 'Question',
            name: lang === 'he' ? 'כיצד הטמעת מחשבונים משפרת את הקידום האורגני (SEO)?' : 'How does embedding calculator widgets help organic SEO?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: lang === 'he'
                ? 'מחשבונים אינטראקטיביים מעלים את זמן השהייה הממוצע באתר פי 3 עד 5 ומורידים את שיעור הנטישה (Bounce Rate), מה שמאותת למנועי חיפוש על עמוד איכותי ורלוונטי.'
                : 'Interactive calculators increase visitor dwell time by 3x to 5x and reduce bounce rate, signaling high page quality and relevance to search engines.'
            }
          }
        ]
      }
    ]
  };

  // Industry Kits definition for targeted publisher acquisition
  const industryKits = [
    {
      id: 'real-estate',
      icon: Building2,
      color: 'bg-blue-500/10 text-blue-600 border-blue-200',
      title: lang === 'he' ? 'אתרי נדל"ן ומשכנתאות' : 'Real Estate & Mortgages',
      desc: lang === 'he' ? 'מתאים למתווכי נדל"ן, יועצי משכנתאות, ויזמי בנייה שרוצים לספק לרוכשי דירות בדיקת היתכנות מיידית.' : 'Built for real estate brokers, mortgage advisors, and property listing portals.',
      widgets: [
        { id: 'mortgage', name: lang === 'he' ? 'מחשבון משכנתא' : 'Mortgage Calculator' },
        { id: 'compound', name: lang === 'he' ? 'ריבית דריבית' : 'Compound Interest' },
        { id: 'car-finance-lease', name: lang === 'he' ? 'מימון מול ליסינג' : 'Car Finance vs Lease' }
      ]
    },
    {
      id: 'finance',
      icon: TrendingUp,
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
      title: lang === 'he' ? 'בלוגים פיננסיים והשקעות' : 'Personal Finance & Wealth',
      desc: lang === 'he' ? 'פתרון אידיאלי למתכננים פיננסיים, בלוגרים של עצמאות כלכלית (FIRE), ואתרי חדשות שוק ההון.' : 'For personal finance bloggers, financial planners, and wealth creation publications.',
      widgets: [
        { id: 'retirement', name: lang === 'he' ? 'תכנון פרישה ופנסיה' : 'Retirement Planner' },
        { id: 'capital-gains', name: lang === 'he' ? 'מס רווחי הון' : 'Capital Gains Tax' },
        { id: 'salary', name: lang === 'he' ? 'שכר נטו וברוטו' : 'Salary Calculator' }
      ]
    },
    {
      id: 'auto',
      icon: Car,
      color: 'bg-amber-500/10 text-amber-600 border-amber-200',
      title: lang === 'he' ? 'רכב, ליסינג ותחבורה' : 'Auto Dealerships & Car Blogs',
      desc: lang === 'he' ? 'מסייע לרוכשי רכב להשוות בין רכישה במזומן, הלוואת מימון ועסקת ליסינג פרטי בזמן אמת.' : 'Compare loan vs lease vs cash purchase directly on car review and dealership sites.',
      widgets: [
        { id: 'car-finance-lease', name: lang === 'he' ? 'ליסינג מול מימון' : 'Finance vs Lease' },
        { id: 'tip', name: lang === 'he' ? 'פיצול הוצאות' : 'Bill / Expense Split' },
        { id: 'unit', name: lang === 'he' ? 'ממיר מידות' : 'Unit Converter' }
      ]
    },
    {
      id: 'health',
      icon: HeartPulse,
      color: 'bg-rose-500/10 text-rose-600 border-rose-200',
      title: lang === 'he' ? 'בריאות, כושר ותזונה' : 'Health, Fitness & Wellness',
      desc: lang === 'he' ? 'ווידג\'טים ויראליים לאתרי כושר, מאמנים אישיים, דיאטנים ופורטלי סגנון חיים בריא.' : 'Viral daily health calculators that drive returning organic visitors to fitness blogs.',
      widgets: [
        { id: 'bmi', name: lang === 'he' ? 'מחשבון BMI' : 'BMI Index' },
        { id: 'age', name: lang === 'he' ? 'גיל וימי הולדת' : 'Age Calculator' },
        { id: 'unit', name: lang === 'he' ? 'ממיר מידות' : 'Unit Converter' }
      ]
    },
    {
      id: 'tech',
      icon: Cpu,
      color: 'bg-purple-500/10 text-purple-600 border-purple-200',
      title: lang === 'he' ? 'הנדסה, מדע וטכנולוגיה' : 'Science, Math & Engineering',
      desc: lang === 'he' ? 'כלי עזר מתקדמים לאתרי לימודים, בלוגים למפתחים, סטודנטים ומהנדסים.' : 'Advanced scientific conversions and logic solvers for technical audiences and schools.',
      widgets: [
        { id: 'scientific-units', name: lang === 'he' ? 'מידות מדעיות' : 'Scientific Units' },
        { id: 'base-converter', name: lang === 'he' ? 'ממיר בסיסים' : 'Base Converter' },
        { id: 'z-score', name: lang === 'he' ? 'ציון תקן Z' : 'Z-Score Stats' }
      ]
    }
  ];

  return (
    <div className="w-full space-y-12">
      <SEO
        title={uiText.pageTitle}
        description={uiText.pageDesc}
        canonicalUrl={`/${lang}/widgets`}
        type="SoftwareApplication"
        applicationCategory="UtilityApplication"
        structuredData={structuredData}
      />

      <Breadcrumbs
        items={[
          { label: t.catAll || 'Library', path: `/${lang}/all` },
          { label: lang === 'he' ? 'מחולל ווידג\'טים בעיצוב אישי' : 'Widget Customizer & Hub' }
        ]}
      />

      {/* Hero Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{uiText.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 tracking-tight mb-4">
            {uiText.pageTitle}
          </h1>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed mb-6 font-medium">
            {uiText.pageDesc}
          </p>

          <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm font-semibold text-stone-600">
            <div className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>{uiText.feature1}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200">
              <Palette className="w-4 h-4 text-emerald-600" />
              <span>{uiText.feature2}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200">
              <FileCode2 className="w-4 h-4 text-blue-500" />
              <span>{uiText.feature3}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Industry Kits / Targeted Publisher Sets */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <BookmarkPlus className="w-6 h-6 text-emerald-700" />
            <span>{uiText.industryTitle}</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 font-medium">
            {uiText.industrySubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {industryKits.map((kit) => {
            const Icon = kit.icon;
            return (
              <div
                key={kit.id}
                className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all space-y-3"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`p-2.5 rounded-xl border ${kit.color}`}>
                      <Icon className="w-5 h-5" />
                    </span>
                    <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                      {kit.title}
                    </h3>
                  </div>
                  <p className="text-stone-500 text-xs leading-relaxed font-medium mb-3">
                    {kit.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-1.5">
                  {kit.widgets.map((kw) => (
                    <button
                      key={kw.id}
                      type="button"
                      onClick={() => scrollToCustomizer(kw.id)}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-[11px] font-bold text-stone-700 border border-stone-200 transition-colors cursor-pointer"
                    >
                      + {kw.name}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Step 1: Calculator Selector with Category Filters & Search */}
      <section className="space-y-4" id="step-selector">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-700 text-white text-xs flex items-center justify-center font-black">1</span>
            <span>{uiText.selectCalc}</span>
          </h2>
          <span className="text-xs text-stone-500 font-semibold">
            {filteredWidgets.length} / {AVAILABLE_WIDGETS.length} {lang === 'he' ? 'מחשבונים זמינים להטמעה' : 'calculators ready'}
          </span>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-stone-50 p-3 rounded-2xl border border-stone-200">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute top-1/2 -translate-y-1/2 start-3" />
            <input
              type="text"
              value={widgetSearchQuery}
              onChange={(e) => setWidgetSearchQuery(e.target.value)}
              placeholder={uiText.searchPlaceholder}
              className="w-full bg-white border border-stone-200 rounded-xl ps-9 pe-3 py-2 text-xs sm:text-sm font-medium focus:outline-none focus:border-emerald-600 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              {uiText.allCategories}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Calculator Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[460px] overflow-y-auto p-1 rounded-2xl">
          {filteredWidgets.map((widget) => {
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
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-500/20'
                    : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-2 rounded-xl bg-stone-100 text-stone-800 material-symbols-outlined text-[20px]">
                      {widget.icon}
                    </span>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
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
                <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                  <span>{isSelected ? (lang === 'he' ? 'נבחר להטמעה ✓' : 'Selected ✓') : (lang === 'he' ? 'בחר מחשבון' : 'Select')}</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Step 2 & 3: Visual Customizer & Live Real-Time Preview */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="step-customizer">
        {/* Step 2: Customization Controls Panel */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-700 text-white text-xs flex items-center justify-center font-black">2</span>
              <span>{uiText.customizeWidget}</span>
            </h2>
            <button
              type="button"
              onClick={handleResetToDefaults}
              className="text-xs text-stone-500 hover:text-emerald-700 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              title={uiText.resetDefaults}
            >
              <RefreshCw className="w-3 h-3" />
              <span>{uiText.resetDefaults}</span>
            </button>
          </div>

          {/* Preset Palettes */}
          <div>
            <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-2">
              {uiText.brandPaletteLabel}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {THEME_PALETTES.map((pal) => {
                const isPalSelected = selectedPaletteId === pal.id;
                return (
                  <button
                    key={pal.id}
                    type="button"
                    onClick={() => handlePaletteSelect(pal.id)}
                    className={`p-2.5 rounded-xl border text-start transition-all cursor-pointer flex items-center gap-2.5 ${
                      isPalSelected
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-500/20'
                        : 'border-stone-200 bg-stone-50/60 hover:bg-stone-100/80'
                    }`}
                  >
                    <div className="flex -space-x-1 shrink-0">
                      <span
                        className="w-4 h-4 rounded-full border border-white shadow-xs"
                        style={{ backgroundColor: pal.primary }}
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-white shadow-xs"
                        style={{ backgroundColor: pal.accent }}
                      />
                    </div>
                    <span className="text-xs font-bold text-stone-800 truncate">
                      {pal.name[lang as keyof typeof pal.name] || pal.name.en}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Color Pickers */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
              <Palette className="w-3.5 h-3.5 text-emerald-600" />
              <span>{uiText.customColors}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-stone-500 block mb-1">
                  {uiText.primaryColorLabel}
                </label>
                <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-stone-200">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => {
                      setPrimaryColor(e.target.value);
                      setSelectedPaletteId('custom');
                    }}
                    className="w-6 h-6 rounded-md border-0 p-0 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => {
                      setPrimaryColor(e.target.value);
                      setSelectedPaletteId('custom');
                    }}
                    className="text-xs font-mono font-bold text-stone-800 w-full focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-500 block mb-1">
                  {uiText.accentColorLabel}
                </label>
                <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-stone-200">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => {
                      setAccentColor(e.target.value);
                      setSelectedPaletteId('custom');
                    }}
                    className="w-6 h-6 rounded-md border-0 p-0 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => {
                      setAccentColor(e.target.value);
                      setSelectedPaletteId('custom');
                    }}
                    className="text-xs font-mono font-bold text-stone-800 w-full focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Border Radius & Shadow */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-2">
                {uiText.borderRadiusLabel}
              </label>
              <div className="grid grid-cols-4 gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200">
                {[
                  { value: 0, label: '0px' },
                  { value: 8, label: '8px' },
                  { value: 16, label: '16px' },
                  { value: 24, label: '24px' }
                ].map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setBorderRadius(r.value)}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                      borderRadius === r.value
                        ? 'bg-white text-emerald-800 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-2">
                {uiText.shadowElevationLabel}
              </label>
              <select
                value={shadowElevation}
                onChange={(e) => setShadowElevation(e.target.value as any)}
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-800 focus:outline-none focus:border-emerald-600"
              >
                <option value="none">{uiText.shadowNone}</option>
                <option value="subtle">{uiText.shadowSubtle}</option>
                <option value="elevated">{uiText.shadowElevated}</option>
                <option value="deep">{uiText.shadowDeep}</option>
              </select>
            </div>
          </div>

          {/* Language selector */}
          <div>
            <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-2">
              {uiText.languageLabel}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 p-1 bg-stone-100 rounded-xl border border-stone-200">
              {[
                { id: 'he', label: 'עברית' },
                { id: 'en', label: 'English' },
                { id: 'es', label: 'Español' },
                { id: 'fr', label: 'Français' },
                { id: 'ar', label: 'العربية' },
                { id: 'ru', label: 'Русский' }
              ].map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setWidgetLang(l.id)}
                  className={`py-2 px-1 text-xs font-bold rounded-lg transition-all ${
                    widgetLang === l.id
                      ? 'bg-white text-emerald-800 shadow-xs'
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
                { id: 'compact' as const, label: uiText.compactWidth, hint: '380px' }
              ].map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setWidthMode(w.id)}
                  className={`p-2.5 text-xs font-bold rounded-xl border transition-all text-center ${
                    widthMode === w.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
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
                  <span>{lang === 'he' ? 'רוחב מותאם אישית:' : 'Custom Width:'}</span>
                  <span className="font-mono">{customWidth}px</span>
                </div>
                <input
                  type="range"
                  min={320}
                  max={900}
                  step={10}
                  value={customWidth}
                  onChange={(e) => setCustomWidth(Number(e.target.value))}
                  className="w-full accent-emerald-700 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Height slider */}
          <div>
            <div className="flex justify-between text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">
              <label htmlFor="height-slider">{uiText.heightLabel}</label>
              <span className="font-mono text-emerald-700">{customHeight}px</span>
            </div>
            <input
              id="height-slider"
              type="range"
              min={480}
              max={950}
              step={10}
              value={customHeight}
              onChange={(e) => setCustomHeight(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
          </div>

          {/* Theme mode (Light / Dark) */}
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
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                    : 'border-stone-200 text-stone-600'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full bg-white border border-stone-300 shadow-xs" />
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
                <span className="w-3.5 h-3.5 rounded-full bg-stone-900 border border-stone-600" />
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
              className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
            />
            <label htmlFor="backlink-checkbox" className="text-xs text-stone-700 leading-relaxed cursor-pointer font-medium">
              <span className="font-bold block text-stone-900">{uiText.backlinkCheckbox}</span>
              <span className="text-[11px] text-stone-500 block mt-0.5">
                {lang === 'he'
                  ? 'הקישור מעניק קרדיט קטן ומאפשר שימוש חינמי לחלוטין ללא פרסומות.'
                  : 'Displays a clean discrete attribution link. Free for all personal and commercial web projects.'}
              </span>
            </label>
          </div>
        </div>

        {/* Step 3: Interactive Live Preview */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-700 text-white text-xs flex items-center justify-center font-black">3</span>
              <span>{uiText.previewWidget}</span>
            </h2>

            {/* Device Frame toggles */}
            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded-lg transition-all flex items-center gap-1 text-xs font-semibold ${
                  previewDevice === 'desktop' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-500'
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
                  previewDevice === 'tablet' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-500'
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
                  previewDevice === 'mobile' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-500'
                }`}
                title={uiText.previewMobile}
              >
                <Smartphone className="w-4 h-4" />
                <span className="hidden sm:inline">{uiText.previewMobile}</span>
              </button>
            </div>
          </div>

          {/* Iframe Live Render Frame */}
          <div className="w-full bg-stone-100/70 p-4 sm:p-6 rounded-2xl border border-stone-200 flex justify-center overflow-x-auto min-h-[520px]">
            <div
              style={{
                width: previewFrameWidth,
                maxWidth: '100%',
                transition: 'width 0.25s ease'
              }}
              className="flex flex-col items-center"
            >
              <div
                style={{
                  borderRadius: `${borderRadius}px`,
                  boxShadow: getShadowCss(shadowElevation),
                  border: showBorder ? (theme === 'dark' ? '1px solid #334155' : '1px solid #e5e7eb') : 'none',
                  overflow: 'hidden',
                  width: '100%'
                }}
                className="transition-all duration-200"
              >
                <iframe
                  key={previewEmbedUrl}
                  src={previewEmbedUrl}
                  width="100%"
                  height={customHeight}
                  frameBorder="0"
                  title={selectedWidget.name[lang as keyof typeof selectedWidget.name] || selectedWidget.name.en}
                  className="w-full bg-white block"
                />
              </div>

              {includeBacklink && (
                <p className="text-xs text-stone-500 mt-2 text-center font-sans">
                  {lang === 'he' ? 'מופעל ע״י' : 'Powered by'}{' '}
                  <a
                    href={canonicalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: primaryColor }}
                    className="underline font-semibold"
                  >
                    GlobalCalc Pro
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Step 4: Multi-Tab Embed Code Export */}
      <section className="bg-white rounded-3xl p-6 md:p-10 border border-stone-200 shadow-sm space-y-6">
        <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-emerald-700 text-white text-xs flex items-center justify-center font-black">4</span>
          <span>{uiText.codeSnippet}</span>
        </h2>

        {/* Format Selector Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-3 overflow-x-auto">
          {[
            { id: 'iframe' as const, label: 'HTML (iFrame)', icon: Code2 },
            { id: 'react' as const, label: 'React / Next.js', icon: Box },
            { id: 'wp' as const, label: 'WordPress Block', icon: Layers },
            { id: 'webcomponent' as const, label: 'Web Component', icon: FileCode2 },
            { id: 'url' as const, label: 'Direct Embed URL', icon: Share2 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeCodeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCodeTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-stone-50 text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Code Tab Content */}
        <div className="space-y-4">
          {activeCodeTab === 'iframe' && (
            <div className="space-y-3">
              <p className="text-xs text-stone-500 font-medium">
                {lang === 'he'
                  ? 'העתק את קוד ה-HTML והדבק בכל אתר אינטרנט, בלוג, Shopify, Wix או קוד סטטי.'
                  : 'Copy and paste this standard responsive HTML iframe into any website, blog, or CMS.'}
              </p>
              <div className="relative">
                <textarea
                  readOnly
                  rows={5}
                  value={iframeCode}
                  className="w-full bg-stone-900 text-emerald-400 p-4 rounded-2xl font-mono text-xs leading-relaxed border border-stone-800 resize-none focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(iframeCode, 'iframe')}
                  className="absolute top-3 end-3 px-3 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-600 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  {copiedTab === 'iframe' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTab === 'iframe' ? uiText.copied : (lang === 'he' ? 'העתק קוד' : 'Copy Code')}</span>
                </button>
              </div>
            </div>
          )}

          {activeCodeTab === 'react' && (
            <div className="space-y-3">
              <p className="text-xs text-stone-500 font-medium">
                {lang === 'he'
                  ? 'רכיב React מוכן לשימוש (TypeScript / JSX) עבור פרויקטי Next.js, Vite או Gatsby.'
                  : 'Ready-to-use TypeScript React component for modern Next.js, Vite, or Gatsby web apps.'}
              </p>
              <div className="relative">
                <textarea
                  readOnly
                  rows={8}
                  value={reactCode}
                  className="w-full bg-stone-900 text-blue-300 p-4 rounded-2xl font-mono text-xs leading-relaxed border border-stone-800 resize-none focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(reactCode, 'react')}
                  className="absolute top-3 end-3 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  {copiedTab === 'react' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTab === 'react' ? uiText.copied : (lang === 'he' ? 'העתק רכיב' : 'Copy Component')}</span>
                </button>
              </div>
            </div>
          )}

          {activeCodeTab === 'wp' && (
            <div className="space-y-3">
              <p className="text-xs text-stone-500 font-medium">
                {lang === 'he'
                  ? 'העתק את הקוד והדבק בתוך בלוק "Custom HTML" בוורדפרס (Gutenberg או Elementor).'
                  : 'Paste this snippet directly into a WordPress "Custom HTML" block or Elementor HTML widget.'}
              </p>
              <div className="relative">
                <textarea
                  readOnly
                  rows={5}
                  value={wpShortcode}
                  className="w-full bg-stone-900 text-stone-100 p-4 rounded-2xl font-mono text-xs leading-relaxed border border-stone-800 resize-none focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(wpShortcode, 'wp')}
                  className="absolute top-3 end-3 px-3 py-1.5 rounded-xl bg-stone-800 text-white text-xs font-bold hover:bg-stone-700 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  {copiedTab === 'wp' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTab === 'wp' ? uiText.copied : (lang === 'he' ? 'העתק לוורדפרס' : 'Copy for WordPress')}</span>
                </button>
              </div>
            </div>
          )}

          {activeCodeTab === 'webcomponent' && (
            <div className="space-y-3">
              <p className="text-xs text-stone-500 font-medium">
                {lang === 'he'
                  ? 'קוד מוכן עם קונטיינר מעוצב ואינטגרטיבי לשימוש ישיר בכל מערכת אירוח אתרים.'
                  : 'Styled container snippet for seamless integration into static sites, Webflow, and custom CMSs.'}
              </p>
              <div className="relative">
                <textarea
                  readOnly
                  rows={6}
                  value={webComponentCode}
                  className="w-full bg-stone-900 text-purple-300 p-4 rounded-2xl font-mono text-xs leading-relaxed border border-stone-800 resize-none focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(webComponentCode, 'webcomponent')}
                  className="absolute top-3 end-3 px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  {copiedTab === 'webcomponent' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTab === 'webcomponent' ? uiText.copied : (lang === 'he' ? 'העתק קוד' : 'Copy Snippet')}</span>
                </button>
              </div>
            </div>
          )}

          {activeCodeTab === 'url' && (
            <div className="space-y-3">
              <p className="text-xs text-stone-500 font-medium">
                {lang === 'he'
                  ? 'קישור ישיר לווידג\'ט במצב Embed כולל כל פרמטרי העיצוב המותאמים אישית.'
                  : 'Direct URL to the standalone embeddable widget with all custom theme query parameters.'}
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareableUrl}
                  className="w-full bg-stone-100 text-stone-800 px-4 py-3 rounded-xl font-mono text-xs border border-stone-200 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(shareableUrl, 'url')}
                  className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-600 transition-all flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
                >
                  {copiedTab === 'url' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedTab === 'url' ? uiText.copied : (lang === 'he' ? 'העתק קישור' : 'Copy URL')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Platform Installation Guide */}
      <section className="bg-stone-50 rounded-3xl p-6 sm:p-10 border border-stone-200 space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            {uiText.installGuideTitle}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
            {lang === 'he'
              ? 'הוראות פשוטות להטמעה ב-3 שלבים במערכות ה-CMS והפיתוח המובילות בעולם:'
              : 'Simple 3-step instructions for embedding into popular website builders and frameworks:'}
          </p>
        </div>

        <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
          {[
            { id: 'wp' as const, label: 'WordPress (Gutenberg/Elementor)' },
            { id: 'wix' as const, label: 'Wix / Squarespace' },
            { id: 'react' as const, label: 'React / Next.js' },
            { id: 'webflow' as const, label: 'Webflow' }
          ].map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setActivePlatformGuide(g.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activePlatformGuide === g.id
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 text-xs sm:text-sm text-stone-700 space-y-3 font-medium">
          {activePlatformGuide === 'wp' && (
            <ol className="list-decimal list-inside space-y-2 leading-relaxed">
              <li>{lang === 'he' ? 'היכנסו לעורך העמוד בוורדפרס (Gutenberg או Elementor).' : 'Open your page in the WordPress block editor (Gutenberg or Elementor).'}</li>
              <li>{lang === 'he' ? 'הוסיפו בלוק חדש מסוג "Custom HTML" (או ווידג\'ט HTML באלמנטור).' : 'Add a new block and search for "Custom HTML" (or HTML widget in Elementor).'}</li>
              <li>{lang === 'he' ? 'הדביקו את קוד ה-iFrame שהועתק למעלה ושמרו את העמוד.' : 'Paste the copied HTML iFrame code from above and publish your page.'}</li>
            </ol>
          )}
          {activePlatformGuide === 'wix' && (
            <ol className="list-decimal list-inside space-y-2 leading-relaxed">
              <li>{lang === 'he' ? 'בעורך וויקס, לחצו על כפתור "+" (הוספת אלמנט) ובחרו ב-"Embed Code".' : 'In the Wix editor, click "+" (Add elements) and select "Embed Code".'}</li>
              <li>{lang === 'he' ? 'בחרו ב-"Embed HTML" ולחצו על "Enter Code".' : 'Choose "Embed HTML" and click "Enter Code".'}</li>
              <li>{lang === 'he' ? 'הדביקו את הקוד, קבעו את הרוחב והגובה המתאימים ולחצו על Apply.' : 'Paste your embed code, adjust container dimensions, and click Apply.'}</li>
            </ol>
          )}
          {activePlatformGuide === 'react' && (
            <ol className="list-decimal list-inside space-y-2 leading-relaxed">
              <li>{lang === 'he' ? 'העתיקו את קוד קומפוננטת ה-React מלשונית "React / Next.js" למעלה.' : 'Copy the React component snippet from the "React / Next.js" tab above.'}</li>
              <li>{lang === 'he' ? 'צרו קובץ קומפוננטה חדש בפרויקט שלכם (לדוגמה: MortgageWidget.tsx).' : 'Create a component file in your components directory (e.g. MortgageWidget.tsx).'}</li>
              <li>{lang === 'he' ? 'ייבאו והציגו את הקומפוננטה בכל דף או עמוד נחיתה בפרויקט.' : 'Import and render <MortgageWidget /> anywhere in your application.'}</li>
            </ol>
          )}
          {activePlatformGuide === 'webflow' && (
            <ol className="list-decimal list-inside space-y-2 leading-relaxed">
              <li>{lang === 'he' ? 'גררו אלמנט "Embed" מלוח הרכיבים אל המיקום הרצוי בעמוד.' : 'Drag an "Embed" component from the Webflow add panel onto the canvas.'}</li>
              <li>{lang === 'he' ? 'הדביקו את קוד ה-iFrame בעורך הקוד של וובפלו.' : 'Paste the iFrame embed code into the HTML Embed Code Editor.'}</li>
              <li>{lang === 'he' ? 'לחצו על "Save & Close" ובצעו Publish לאתר.' : 'Click "Save & Close" and publish your Webflow site.'}</li>
            </ol>
          )}
        </div>
      </section>

      {/* Benefits & Value Proposition Section */}
      <section className="bg-stone-900 text-white rounded-3xl p-6 sm:p-10 md:p-12 space-y-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
            {uiText.whyEmbedTitle}
          </h2>
          <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
            {lang === 'he'
              ? 'ווידג\'טים אינטראקטיביים הם דרך מוכחת להעלות מדדי מעורבות גולשים, להפחית Bounce Rate ולחזק את הסמכות של האתר שלכם.'
              : 'Interactive embeds are a proven way to increase page session duration, reduce bounce rates, and boost domain authority.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-stone-800/80 border border-stone-700 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-white">{uiText.benefit1Title}</h3>
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">{uiText.benefit1Desc}</p>
          </div>

          <div className="p-6 rounded-2xl bg-stone-800/80 border border-stone-700 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-white">{uiText.benefit2Title}</h3>
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">{uiText.benefit2Desc}</p>
          </div>

          <div className="p-6 rounded-2xl bg-stone-800/80 border border-stone-700 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
              <Globe2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-white">{uiText.benefit3Title}</h3>
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">{uiText.benefit3Desc}</p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section for Rich Snippets */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <HelpCircle className="w-6 h-6 text-emerald-700" />
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            {uiText.faqTitle}
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: lang === 'he' ? 'כיצד מטמיעים את הווידג\'ט באתר וורדפרס או וויקס?' : 'How do I embed the calculator widget into WordPress or Wix?',
              a: lang === 'he'
                ? 'מעתיקים את קוד ה-HTML (iFrame) מלשונית ייצוא הקוד, ומדביקים אותו בתוך בלוק Custom HTML בוורדפרס (Gutenberg או Elementor), או באלמנט Embed HTML בוויקס או וובפלו. הכל עובד מיד ללא צורך בהתקנת תוספים.'
                : 'Simply copy the HTML iFrame code and paste it into a Custom HTML block in WordPress or an Embed HTML element in Wix or Webflow. It runs immediately with zero plugins required.'
            },
            {
              q: lang === 'he' ? 'האם השימוש בווידג\'טים חופשי גם לאתרים מסחריים ועסקיים?' : 'Is embedding calculators 100% free for commercial use?',
              a: lang === 'he'
                ? 'כן לחלוטין! הווידג\'טים מוצעים בחינם לכל אתר מסחרי, בלוג או עסק, ללא הגבלת צפיות, ללא צורך בהרשמה וללא עלויות שרתים.'
                : 'Yes! All calculator widgets are completely free for personal and commercial websites, with no traffic caps, no account registration, and no recurring fees.'
            },
            {
              q: lang === 'he' ? 'האם ניתן להתאים את הווידג\'ט לצבעי המותג שלי?' : 'Can I customize the widget colors to match my brand identity?',
              a: lang === 'he'
                ? 'בוודאי. מחולל הווידג\'טים מאפשר לבחור צבע ראשי, צבע משני, עיצוב בהיר או כהה, רדיוס פינות ורוחב מותאם, כך שהמחשבון ישתלב בצורה אורגנית בעיצוב האתר שלך.'
                : 'Absolutely. Use the visual editor on this page to set your primary brand color, dark/light theme, corner radius, and dimensions to seamlessly match your site\'s design system.'
            },
            {
              q: lang === 'he' ? 'האם הווידג\'ט מאט את זמן טעינת האתר שלי (Core Web Vitals)?' : 'Does the embedded widget slow down page loading or hurt Core Web Vitals?',
              a: lang === 'he'
                ? 'לא. קוד ה-iFrame כולל loading="lazy" כברירת מחדל, כך שהמחשבון נטען רק כאשר הגולש גולל אליו, והחישובים מבוצעים במלואם בצד הלקוח (Client-Side).'
                : 'No. The generated snippet includes native loading="lazy" and runs 100% client-side in the browser, ensuring your initial page load speed and Core Web Vitals remain lightning-fast.'
            },
            {
              q: lang === 'he' ? 'כיצד הטמעת מחשבונים מסייעת לקידום האתר שלי במנועי חיפוש (SEO)?' : 'How does embedding interactive tools help my website\'s SEO?',
              a: lang === 'he'
                ? 'מחשבונים מעודדים גולשים להישאר בעמוד 3 עד 5 דקות יותר בממוצע (Dwell Time גבוה) ומורידים דרסטית את אחוז הנטישה, מה שמקנה לאתר אותות איכות חזקים ביותר בעיני גוגל.'
                : 'Interactive calculators increase visitor dwell time by up to 500% and drastically lower bounce rates, sending authoritative quality and user engagement signals directly to search engines.'
            }
          ].map((item, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <h3 className="font-bold text-stone-900 text-sm sm:text-base flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{item.q}</span>
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-medium ps-6">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
