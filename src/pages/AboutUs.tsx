import SEO from '../components/SEO';
import { useI18n, Language } from '../contexts/i18n';

const content: Record<Language, {
  subtitle: string;
  missionTitle: string;
  missionDesc: string;
  precisionTitle: string;
  precisionDesc: string;
  transparencyTitle: string;
  transparencyDesc: string;
  accessibilityTitle: string;
  accessibilityDesc: string;
}> = {
  en: {
    subtitle: 'Welcome to GlobalCalc Pro — your authoritative destination for accurate, transparent, and completely free financial, mathematical, and measurement calculation tools.',
    missionTitle: 'Our Mission & Vision',
    missionDesc: 'Our core goal is to make complex calculations in personal finance, mortgage planning, compound interest, health metrics, and physics accessible, instantaneous, and transparent to everyone worldwide. All computations run 100% locally in your browser with zero latency, complete privacy, and no external AI or server dependencies.',
    precisionTitle: 'Mathematical & Financial Precision',
    precisionDesc: 'All calculations utilize arbitrary-precision decimal libraries to eliminate floating-point rounding errors. Formulas are verified against industry standards, financial compounding algorithms, and peer-reviewed reference physics models.',
    transparencyTitle: 'Educational Transparency & E-E-A-T',
    transparencyDesc: 'Every tool includes explicit formulas, mathematical derivations, real-world examples, and step-by-step guides so users understand the mechanics behind every result.',
    accessibilityTitle: 'Multilingual & Accessibility Excellence',
    accessibilityDesc: 'GlobalCalc Pro natively supports English, Hebrew, Spanish, French, and Arabic with localized currency formatting, full RTL/LTR text alignment, responsive layout optimization, and high contrast standards for maximum accessibility.'
  },
  he: {
    subtitle: 'ברוכים הבאים ל-GlobalCalc Pro — הפלטפורמה המקיפה והאמינה ביותר למחשבונים פיננסיים, מתמטיים והמרות יחידות ללא עלות.',
    missionTitle: 'המשימה והחזון שלנו',
    missionDesc: 'המטרה של GlobalCalc Pro היא להפוך חישובים מורכבים בניהול פיננסי, משכנתאות, השקעות, בריאות ומדע לזמינים, ברורים ומדויקים לכל אדם. כל החישובים מבוצעים באופן מקומי ומיידי בדפדפן (צד לקוח) בפרטיות מוחלטת, ללא צורך בהרשמה, תשלום, בינה מלאכותית חיצונית או תלות בשרתים.',
    precisionTitle: 'תקני הדיוק הפיננסי והמדע',
    precisionDesc: 'כל המחשבונים באתר נבנים ומתוחזקים תוך שימוש בספריות חישוב בעלות דיוק גבוה (Arbitrary-precision arithmetic) כדי למנוע שגיאות עיגול עשרוניות. הנוסחאות נבדקות בהתאמה לתקנים בנקאיים ומדעיים מקובלים.',
    transparencyTitle: 'שקיפות ומדריכים לימודיים',
    transparencyDesc: 'לצד כל מחשבון אנו מספקים מדריך מפורט הכולל את הנוסחה המתמטית, שלבי החישוב, דוגמאות מעשיות ושאלות נפוצות, על מנת שהמשתמש יבין בדיוק כיצד התוצאה התקבלה.',
    accessibilityTitle: 'תמיכה במגוון שפות ונגישות',
    accessibilityDesc: 'GlobalCalc Pro מתורגם באופן טבעי לאנגלית, עברית, ספרדית, צרפתית וערבית, תוך התאמה מלאה לכיווניות קריאה (RTL/LTR), עיצוב רספונסיבי וממשק נגיש לניידים ולמחשבים כאחד.'
  },
  es: {
    subtitle: 'Bienvenido a GlobalCalc Pro — su destino confiable para herramientas de cálculo financieras, matemáticas y de unidades precisas, transparentes y totalmente gratuitas.',
    missionTitle: 'Nuestra Misión y Visión',
    missionDesc: 'Nuestro objetivo fundamental es hacer que los cálculos complejos en finanzas personales, hipotecas, interés compuesto, salud y física sean accesibles, instantáneos y transparentes para todos. Todos los cálculos se realizan 100% localmente en el navegador con total privacidad y sin dependencias de IA externa.',
    precisionTitle: 'Precisión Matemática y Financiera',
    precisionDesc: 'Todos los cálculos utilizan librerías decimales de alta precisión para eliminar errores de redondeo. Las fórmulas están verificadas con estándares bancarios y modelos de física de referencia.',
    transparencyTitle: 'Transparencia Educativa',
    transparencyDesc: 'Cada herramienta incluye fórmulas explícitas, explicaciones paso a paso, ejemplos prácticos y preguntas frecuentes para que comprenda el funcionamiento exacto de cada resultado.',
    accessibilityTitle: 'Excelencia Multilingüe y Accesibilidad',
    accessibilityDesc: 'GlobalCalc Pro es compatible de forma nativa con inglés, hebreo, español, francés y árabe, con alineación completa RTL/LTR y diseño adaptable para todos los dispositivos.'
  },
  fr: {
    subtitle: 'Bienvenue sur GlobalCalc Pro — votre destination de référence pour des outils de calcul financiers, mathématiques et de mesure précis, transparents et entièrement gratuits.',
    missionTitle: 'Notre Mission & Vision',
    missionDesc: 'Notre objectif principal est de rendre les calculs complexes en finances personnelles, prêt immobilier, intérêt composé, santé et physique accessibles, instantanés et transparents pour tous. Tous les calculs s\'exécutent 100% localement dans le navigateur avec une confidentialité totale et sans dépendance d\'IA externe.',
    precisionTitle: 'Précision Mathématique & Financière',
    precisionDesc: 'Tous les calculs utilisent des bibliothèques décimales de haute précision pour éliminer les erreurs d\'arrondi. Les formules sont vérifiées selon les normes bancaires et scientifiques.',
    transparencyTitle: 'Transparence Éducative',
    transparencyDesc: 'Chaque outil comprend des formules explicites, des étapes de calcul, des exemples pratiques et des FAQ pour une compréhension totale de chaque résultat.',
    accessibilityTitle: 'Excellence Multilingue & Accessibilité',
    accessibilityDesc: 'GlobalCalc Pro prend en charge le français, l\'anglais, l\'hébreu, l\'espagnol et l\'arabe avec formatage monétaire localisé, support RTL/LTR et design responsive.'
  },
  ar: {
    subtitle: 'مرحبًا بك في GlobalCalc Pro — وجهتك الموثوقة لأدوات الحساب المالية والرياضية وقياس الوحدات الدقيقة والشفافة والمجانية تمامًا.',
    missionTitle: 'مهمتنا ورؤيتنا',
    missionDesc: 'هدفنا الرئيسي هو جعل الحسابات المعقدة في التمويل الشخصي والرهن العقاري والفائدة المركبة والمقاييس الصحية والفيزياء متاحًة وفورية وشفافة للجميع. تُجرى جميع الحسابات محليًا بنسبة 100% في المتصفح مع الحفاظ التام على الخصوصية ودون الحاجة إلى خوادم أو أدوات ذكاء اصطناعي خارجية.',
    precisionTitle: 'الدقة الرياضية والمالية',
    precisionDesc: 'تستخدم جميع الحسابات مكتبات عشرية عالية الدقة للتخلص من أخطاء التقريب. تم التحقق من الصيغ وفقًا للمعايير المصرفية والنماذج العلمية المعتمدة.',
    transparencyTitle: 'الشفافية التعليمية',
    transparencyDesc: 'تتضمن كل أداة صيغًا صريحة وشروحات خطوة بخطوة وأمثلة عملية وأسئلة شائعة لفهم الآلية خلف كل نتيجة.',
    accessibilityTitle: 'التميز متعدد اللغات وسهولة الاستخدام',
    accessibilityDesc: 'يدعم GlobalCalc Pro العربية والإنجليزية والعبرية والإسبانية والفرنسية بشكل أصلي مع دعم كامل لاتجاه النص من اليمين إلى اليسار (RTL) وتصميم متجاوب.'
  },
  ru: {
    subtitle: 'Добро пожаловать в GlobalCalc Pro — ваш надежный источник точных, прозрачных и полностью бесплатных инструментов для финансовых, математических и инженерных расчетов.',
    missionTitle: 'Наша миссия и видение',
    missionDesc: 'Наша главная цель — сделать сложные вычисления в сфере личных финансов, ипотеки, сложных процентов, здоровья и науки простыми, мгновенными и понятными каждому. Все вычисления производятся на 100% локально в браузере без серверов, внешнего ИИ и сторонних обработчиков.',
    precisionTitle: 'Математическая и финансовая точность',
    precisionDesc: 'Все вычисления выполняются с использованием библиотек произвольной десятичной точности без погрешностей округления с плавающей точкой. Алгоритмы протестированы в соответствии с банковскими и научными стандартами.',
    transparencyTitle: 'Образовательная прозрачность',
    transparencyDesc: 'Каждый инструмент снабжен подробными математическими формулами, пошаговыми инструкциями, практическими примерами и ответами на частые вопросы для полного понимания расчетов.',
    accessibilityTitle: 'Мультиязычность и доступность',
    accessibilityDesc: 'GlobalCalc Pro нативно поддерживает русский, английский, иврит, испанский, французский и арабский языки с локализацией валют, полной поддержкой LTR/RTL и быстрой работой на любых устройствах.'
  }
};

export default function AboutUs() {
  const { t, lang } = useI18n();
  const c = content[lang] || content.en;

  return (
    <article className="w-full bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-stone-200 max-w-4xl mx-auto space-y-8 text-stone-700">
      <SEO
        title={t.aboutTitle}
        description={t.aboutDesc}
        canonicalUrl={`/${lang}/about`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: t.aboutTitle,
          description: t.aboutDesc,
          url: `https://globalcalcpro.com/${lang}/about`,
          publisher: {
            '@type': 'Organization',
            name: 'GlobalCalc Pro',
            url: 'https://globalcalcpro.com'
          }
        }}
      />

      <div className="border-b border-stone-200 pb-6">
        <h1 className="text-3xl md:text-4xl font-headline text-stone-900 tracking-tight font-bold mb-3">
          {t.aboutTitle}
        </h1>
        <p className="text-stone-600 leading-relaxed text-base sm:text-lg">
          {c.subtitle}
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-stone-900 font-headline">
          {c.missionTitle}
        </h2>
        <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
          {c.missionDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-200">
        <div className="bg-stone-50 p-6 rounded-xl border border-stone-200/80 space-y-2">
          <h3 className="text-lg font-bold text-stone-900">
            {c.precisionTitle}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {c.precisionDesc}
          </p>
        </div>

        <div className="bg-stone-50 p-6 rounded-xl border border-stone-200/80 space-y-2">
          <h3 className="text-lg font-bold text-stone-900">
            {c.transparencyTitle}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {c.transparencyDesc}
          </p>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-stone-200">
        <h2 className="text-2xl font-bold text-stone-900 font-headline">
          {c.accessibilityTitle}
        </h2>
        <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
          {c.accessibilityDesc}
        </p>
      </div>
    </article>
  );
}
