import { CalculatorMeta } from '../../data/calculators';
import { Language } from '../../contexts/i18n';
import calculatorCapabilities from '../../data/calculatorCapabilities.json';

interface CapabilityRecord {
  bestFor?: Record<string, string>;
  features?: Record<string, string[]>;
}
const capabilitiesRegistry = calculatorCapabilities as Record<string, CapabilityRecord>;

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface GuideOverviewInput {
  guideTitle?: string;
  guideDesc?: string;
  formulaHeading?: string;
  formulaLines?: string[];
}

export interface CalculatorOverviewContent {
  heading: string;
  summary: string;
  bestFor: string;
  pointsTitle: string;
  points: string[];
  formulaHeading?: string;
  formulaLines?: string[];
}

const categoryLabels: Record<string, Record<Language, string>> = {
  finance: {
    en: 'Finance',
    he: 'פיננסים',
    es: 'Finanzas',
    fr: 'Finances',
    ar: 'المالية',
    ru: 'Финансы',
  },
  'real-estate': {
    en: 'Real Estate',
    he: 'נדל"ן ומשכנתאות',
    es: 'Bienes Raíces',
    fr: 'Immobilier',
    ar: 'العقارات',
    ru: 'Недвижимость',
  },
  health: {
    en: 'Health',
    he: 'בריאות',
    es: 'Salud',
    fr: 'Santé',
    ar: 'الصحة',
    ru: 'Здоровье',
  },
  math: {
    en: 'Math',
    he: 'מתמטיקה',
    es: 'Matemáticas',
    fr: 'Maths',
    ar: 'الرياضيات',
    ru: 'Математика',
  },
  tech: {
    en: 'Tech',
    he: 'טכנולוגיה ומחשבים',
    es: 'Tecnología',
    fr: 'Technologie',
    ar: 'التكنولوجيا والتقنية',
    ru: 'Технологии',
  },
  lifestyle: {
    en: 'Lifestyle',
    he: 'לייף סטייל',
    es: 'Estilo de vida',
    fr: 'Vie quotidienne',
    ar: 'نمط الحياة',
    ru: 'Повседневное',
  },
};

export const guideKeyAliases: Record<string, string> = {
  'mortgage-calculator': 'mortgage',
  'compound-interest': 'compound',
  'percentage-finder': 'percentage',
  'unit-converter': 'unit',
  'bmi-calculator': 'bmi',
  'tip-calculator': 'tip',
  'salary-calculator': 'salary',
  'age-calculator': 'age',
  'pregnancy-calculator': 'pregnancy',
};

export function resolveGuideKey(calcOrSlug: CalculatorMeta | string | undefined): string {
  if (!calcOrSlug) return '';
  if (typeof calcOrSlug === 'string') {
    return guideKeyAliases[calcOrSlug] || calcOrSlug;
  }
  const slug = calcOrSlug.path.replace(/^\/calculators\//, '').replace(/^\//, '');
  return guideKeyAliases[calcOrSlug.id] || guideKeyAliases[slug] || calcOrSlug.id || slug;
}

export function buildCalculatorFallbackFaqs(
  calc: Pick<CalculatorMeta, 'category' | 'tags'> | null | undefined,
  lang: Language,
  cleanTitle: string,
  description: string,
  extraKeywords: string[] = []
): FaqEntry[] {
  const catName =
    calc?.category && categoryLabels[calc.category]
      ? categoryLabels[calc.category][lang] || categoryLabels[calc.category].en
      : '';
  const kwList = Array.from(new Set([...(extraKeywords || []), ...(calc?.tags || [])])).slice(0, 6);
  const kwSummary = kwList.join(', ') || cleanTitle;
  const desc = description || cleanTitle;

  const templates: Record<Language, FaqEntry[]> = {
    en: [
      {
        question: `What does the ${cleanTitle} calculate?`,
        answer: `${desc} It belongs to the ${catName || 'online tools'} category and supports key terms such as ${kwSummary}.`,
      },
      {
        question: `Is the ${cleanTitle} accurate and private?`,
        answer: `Yes. All formulas run locally in your browser using high-precision Decimal.js arithmetic with zero server data storage.`,
      },
      {
        question: `Can I export or share results from the ${cleanTitle}?`,
        answer: `Yes. You can copy shareable result links with URL parameters, save calculation history locally, or embed the calculator directly on your website.`,
      },
    ],
    he: [
      {
        question: `מה מחשב ${cleanTitle}?`,
        answer: `${desc} הכלי שייך לקטגוריית ${catName || 'המחשבונים'} ונותן מענה מדויק לחיפושים ומונחים כגון ${kwSummary}.`,
      },
      {
        question: `האם החישוב ב-${cleanTitle} מדויק ושומר על פרטיות?`,
        answer: `כן. כל הנוסחאות מבוצעות מקומית בדפדפן ברמת דיוק גבוהה (Decimal.js) ללא שמירת מידע אישי בשרת.`,
      },
      {
        question: `האם ניתן לשתף או לייצא את תוצאות ה-${cleanTitle}?`,
        answer: `כן. ניתן להעתיק קישור שיתוף עם הערכים שהזנת, לשמור להיסטוריה המקומית או להטמיע את המחשבון באתר אחר.`,
      },
    ],
    es: [
      {
        question: `¿Qué calcula la herramienta ${cleanTitle}?`,
        answer: `${desc} Pertenece a la categoría de ${catName || 'calculadoras'} y cubre consultas clave como ${kwSummary}.`,
      },
      {
        question: `¿Es precisa y privada la calculadora ${cleanTitle}?`,
        answer: `Sí. Todos los cálculos se ejecutan en tu navegador con aritmética Decimal.js de alta precisión sin almacenar datos personales.`,
      },
      {
        question: `¿Puedo exportar o compartir resultados de ${cleanTitle}?`,
        answer: `Sí. Puedes compartir enlaces con parámetros URL o integrar la herramienta gratuitamente en tu sitio web.`,
      },
    ],
    fr: [
      {
        question: `Que permet de calculer l'outil ${cleanTitle} ?`,
        answer: `${desc} Il fait partie de la catégorie ${catName || 'Calculatrices'} et répond aux recherches liées à ${kwSummary}.`,
      },
      {
        question: `La calculatrice ${cleanTitle} est-elle fiable et confidentielle ?`,
        answer: `Oui. Tous les calculs s'effectuent localement dans votre navigateur avec Decimal.js, sans envoi de données sur serveur.`,
      },
      {
        question: `Puis-je partager ou exporter les résultats de ${cleanTitle} ?`,
        answer: `Oui. Vous pouvez partager l'URL avec vos paramètres ou intégrer l'outil sur votre site web.`,
      },
    ],
    ar: [
      {
        question: `ماذا تحسب أداة ${cleanTitle}؟`,
        answer: `${desc} تندرج هذه الأداة ضمن قسم ${catName || 'الحاسبات'} وتغطي مفاهيم ومصطلحات مثل ${kwSummary}.`,
      },
      {
        question: `هل الحسابات في ${cleanTitle} دقيقة وآمنة؟`,
        answer: `نعم، يتم تنفيذ جميع المعادلات محلياً داخل المتصفح بدقة عالية (Decimal.js) دون تخزين أي بيانات شخصية على الخادم.`,
      },
      {
        question: `هل يمكنني مشاركة أو تصدير نتائج ${cleanTitle}؟`,
        answer: `نعم، يمكنك نسخ رابط النتائج المباشر مع القيم المدخلة أو تضمين الأداة مجاناً في موقعك الإلكتروني.`,
      },
    ],
    ru: [
      {
        question: `Что рассчитывает ${cleanTitle}?`,
        answer: `${desc} Инструмент относится к разделу «${catName || 'Калькуляторы'}» и охватывает ключевые запросы: ${kwSummary}.`,
      },
      {
        question: `Насколько точны и безопасны расчеты в ${cleanTitle}?`,
        answer: `Все вычисления выполняются локально в браузере с высокой точностью (Decimal.js) без передачи персональных данных на сервер.`,
      },
      {
        question: `Можно ли поделиться результатами или встроить ${cleanTitle}?`,
        answer: `Да, вы можете скопировать ссылку с параметрами расчета, сохранить историю локально или встроить виджет на свой сайт.`,
      },
    ],
  };

  return templates[lang] || templates.en;
}

export function buildCalculatorOverview(
  calc: Pick<CalculatorMeta, 'id' | 'category' | 'tags'> | null | undefined,
  lang: Language,
  cleanTitle: string,
  description: string,
  guide?: GuideOverviewInput | null
): CalculatorOverviewContent {
  const catName =
    calc?.category && categoryLabels[calc.category]
      ? categoryLabels[calc.category][lang] || categoryLabels[calc.category].en
      : '';
  const desc = description || cleanTitle;
  const calcCaps = calc?.id ? capabilitiesRegistry[calc.id] : undefined;
  const specificBestFor = calcCaps?.bestFor?.[lang] || calcCaps?.bestFor?.en || '';
  const specificFeatures = calcCaps?.features?.[lang] || calcCaps?.features?.en || [];

  const labels: Record<Language, { heading: string; summary: string; pointsTitle: string; fallbackPoints: string[] }> = {
    en: {
      heading: guide?.guideTitle || `About the ${cleanTitle}`,
      summary: guide?.guideDesc || `${desc} Designed as part of our ${catName || 'Online Tools'} collection, this tool computes results instantaneously in your browser with consistent decimal precision.`,
      pointsTitle: 'What This Calculator Can Do & Key Capabilities',
      fallbackPoints: [
        'Instant client-side calculation with zero data sent to external servers',
        'Shareable URL parameters so you can bookmark or send exact scenarios',
        'Mobile-ready responsive layout with automatic locale formatting',
      ],
    },
    he: {
      heading: guide?.guideTitle || `אודות ${cleanTitle}`,
      summary: guide?.guideDesc || `${desc} הכלי פותח כחלק ממרכז המחשבונים בקטגוריית ${catName || 'כלים שימושיים'}, ומבצע חישוב מיידי ומדויק בדפדפן ללא עיגולי נקודה צפה.`,
      pointsTitle: 'מה המחשבון הזה יודע לעשות ויכולות מרכזיות',
      fallbackPoints: [
        'חישוב מיידי 100% בצד הלקוח תוך שמירה מלאה על פרטיות המשתמש',
        'קישורים לשיתוף ושמירת תרחישים באמצעות פרמטרים בכתובת ה-URL',
        'התאמה מלאה למובייל, טאבלט ומחשב עם תמיכה בשפות ופורמט מקומי',
      ],
    },
    es: {
      heading: guide?.guideTitle || `Acerca de ${cleanTitle}`,
      summary: guide?.guideDesc || `${desc} Parte de nuestra suite de ${catName || 'Calculadoras'}, esta herramienta realiza cálculos instantáneos directamente en su navegador con alta precisión.`,
      pointsTitle: 'Capacidades clave de esta calculadora',
      fallbackPoints: [
        'Cálculo inmediato en el navegador sin enviar datos personales a servidores',
        'Enlaces compartibles mediante parámetros URL para guardar escenarios',
        'Interfaz adaptable a dispositivos móviles y múltiples idiomas',
      ],
    },
    fr: {
      heading: guide?.guideTitle || `À propos de l'outil ${cleanTitle}`,
      summary: guide?.guideDesc || `${desc} Intégré à notre collection ${catName || 'Calculatrices'}, cet outil calcule vos résultats instantanément dans votre navigateur avec une précision fiable.`,
      pointsTitle: 'Fonctionnalités clés de cette calculatrice',
      fallbackPoints: [
        'Calcul instantané en local sans transmission de données personnelles',
        'Liens de partage intégrant les paramètres de votre simulation',
        'Interface responsive optimisée pour ordinateur, tablette et mobile',
      ],
    },
    ar: {
      heading: guide?.guideTitle || `حول أداة ${cleanTitle}`,
      summary: guide?.guideDesc || `${desc} تم تصميم هذه الأداة ضمن قسم ${catName || 'الحاسبات'} لتنفيذ الحسابات فوراً داخل المتصفح بدقة رقمية عالية وسهولة استخدام.`,
      pointsTitle: 'القدرات والمزايا الرئيسية للأداة',
      fallbackPoints: [
        'حساب فوري بالكامل داخل المتصفح مع حماية تامة لخصوصية بياناتك',
        'إمكانية نسخ رابط المشاركة مع حفظ القيم المدخلة في الرابط',
        'تصميم متجاوب وسريع يعمل بكفاءة على الهواتف وأجهزة الحاسوب',
      ],
    },
    ru: {
      heading: guide?.guideTitle || `О калькуляторе «${cleanTitle}»`,
      summary: guide?.guideDesc || `${desc} Инструмент входит в раздел «${catName || 'Калькуляторы'}» и выполняет точные вычисления в реальном времени прямо в вашем браузере.`,
      pointsTitle: 'Ключевые возможности калькулятора',
      fallbackPoints: [
        'Мгновенные локальные расчеты без передачи персональных данных на сервер',
        'Поддержка ссылок с параметрами для сохранения и отправки сценариев',
        'Адаптивный интерфейс для компьютеров, планшетов и смартфонов',
      ],
    },
  };

  const localized = labels[lang] || labels.en;

  return {
    heading: localized.heading,
    summary: localized.summary,
    bestFor: specificBestFor,
    pointsTitle: localized.pointsTitle,
    points: specificFeatures.length > 0 ? specificFeatures : localized.fallbackPoints,
    formulaHeading: guide?.formulaHeading,
    formulaLines: guide?.formulaLines,
  };
}
