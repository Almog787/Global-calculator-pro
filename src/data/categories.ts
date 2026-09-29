export interface CategoryHubInfo {
  id: string;
  icon: string;
  name: Record<string, string>;
  seoTitle: Record<string, string>;
  seoDescription: Record<string, string>;
  heroTitle: Record<string, string>;
  heroSubtitle: Record<string, string>;
  overview: Record<string, string>;
  methodology: Record<string, string>;
  tags: Record<string, string[]>;
}

export const CATEGORY_HUBS: Record<string, CategoryHubInfo> = {
  finance: {
    id: 'finance',
    icon: 'account_balance',
    name: {
      he: 'פיננסים וכסף',
      en: 'Finance & Money',
      es: 'Finanzas y Dinero',
      fr: 'Finance & Argent',
      ar: 'المال والتمويل'
    },
    seoTitle: {
      he: 'מחשבונים פיננסיים וכלכליים | ריבית דריבית, הלוואות ושכר נטו | GlobalCalc Pro',
      en: 'Financial & Investment Calculators | Compound Interest, Loans & Pay | GlobalCalc Pro',
      es: 'Calculadoras Financieras | Interés Compuesto, Préstamos y Salario | GlobalCalc Pro',
      fr: 'Calculatrices Financières | Intérêts Composés, Prêts et Salaire | GlobalCalc Pro',
      ar: 'حاسبات مالية واستثمارية | الفائدة المركبة والقروض والرواتب | GlobalCalc Pro'
    },
    seoDescription: {
      he: 'אוסף מחשבונים פיננסיים מתקדמים לחישוב ריבית דריבית, הלוואות, חיסכון, שכר נטו, מע"מ, נקודת איזון ואינפלציה. דיוק מתמטי גבוה ב-Decimal.js וייצוא ל-Excel.',
      en: 'Advanced financial calculators for compound interest, loan amortization, savings goals, net salary, VAT, and inflation with arbitrary Decimal precision and Excel export.',
      es: 'Calculadoras financieras avanzadas para interés compuesto, amortización de préstamos, metas de ahorro, salario neto e inflación con exportación a Excel.',
      fr: 'Calculatrices financières pour intérêts composés, amortissement d’emprunt, salaire net, TVA et inflation avec haute précision Decimal.js et export Excel.',
      ar: 'حاسبات مالية متطورة للفائدة المركبة، إطفاء القروض، أهداف الادخار، الراتب الصافي، والتضخم بدقة حسابية عالية وتصدير Excel.'
    },
    heroTitle: {
      he: 'מחשבונים פיננסיים וכלכליים מתקדמים',
      en: 'Advanced Financial & Investment Calculators',
      es: 'Calculadoras Financieras y de Inversión',
      fr: 'Calculatrices Financières et d’Investissement',
      ar: 'حاسبات مالية واستثمارية متقدمة'
    },
    heroSubtitle: {
      he: 'קבל החלטות כספיות מושכלות בעזרת חישובי ריבית דריבית, הלוואות, שכר נטו ורווחיות בדיוק מתמטי מוחלט.',
      en: 'Make confident money decisions with precise compound growth, loan amortization, net take-home pay, and business profitability models.',
      es: 'Toma decisiones económicas acertadas con cálculos precisos de interés compuesto, amortizaciones y proyecciones salariales.',
      fr: 'Prenez des décisions financières éclairées grâce à des modèles de croissance composée et d’amortissement d’une précision absolue.',
      ar: 'اتخذ قرارات مالية حكيمة بفضل حسابات دقيقة لنمو الفائدة المركبة وإطفاء القروض وصافي الرواتب.'
    },
    overview: {
      he: 'מרכז הכלים הפיננסיים של GlobalCalc Pro מציע מגוון מחשבונים כלכליים שתוכננו לספק שקיפות מלאה בניהול כספים אישי ועסקי. מחישוב צמיחת תיק השקעות בריבית דריבית לאורך עשרות שנים, דרך תכנון החזרי הלוואות, ועד חישוב שכר נטו ועלויות מעסיק – כל כלי עושה שימוש במנוע החישוב המתקדם Decimal.js המונע שגיאות עיגול אופייניות ומאפשר ייצוא של לוחות סילוקין שלמים לקובצי Excel מקצועיים.',
      en: 'The GlobalCalc Pro Financial Suite delivers institutional-grade modeling tools for personal finance, investment planning, and corporate budgeting. From decades-long compound growth simulations to loan paydown schedules and gross-to-net payroll conversions, every engine uses arbitrary-precision Decimal arithmetic to prevent floating-point drift, complete with Excel schedule exports.',
      es: 'La suite financiera de GlobalCalc Pro ofrece herramientas de cálculo precisas para finanzas personales, inversiones y empresas, evitando errores de redondeo.',
      fr: 'La suite financière GlobalCalc Pro offre des outils de modélisation financière de pointe sans erreurs d’arrondi avec export Excel.',
      ar: 'توفر باقة الأدوات المالية من GlobalCalc Pro حلولاً احترافية لإدارة الأموال والتخطيط الاستثماري وتفادي أخطاء التقريب الحسابية.'
    },
    methodology: {
      he: 'כל הנוסחאות מבוססות על סטנדרטים אקטואריים ובנקאיים מקובלים (כגון לוח שפיצר, נוסחאות ערך עתידי FV, ומדרגות מס הכנסה עדכניות).',
      en: 'All formulas adhere to standard financial engineering practices, including standard annuity amortization, compound annual growth rate (CAGR), and net present value calculations.',
      es: 'Todas las fórmulas siguen las normas contables estándar de anualidades y tasas de crecimiento compuesto.',
      fr: 'Toutes les formules respectent les principes actuariels standard d’amortissement et d’intérêts composés.',
      ar: 'تتبع جميع المعادلات المعايير المصرفية والمالية المعترف بها دولياً لحساب الفوائد والإهلاك.'
    },
    tags: {
      he: ['ריבית דריבית', 'החזרי הלוואות', 'שכר נטו', 'מס הכנסה', 'מע"מ 17%-18%', 'אינפלציה', 'נקודת איזון', 'אופציות ו-RSU'],
      en: ['Compound Interest', 'Loan Amortization', 'Net Salary', 'Income Tax', 'Sales Tax & VAT', 'Inflation', 'Break-Even', 'Stock Options'],
      es: ['Interés Compuesto', 'Préstamos', 'Salario Neto', 'Impuestos e IVA', 'Inflación', 'Punto de Equilibrio'],
      fr: ['Intérêts Composés', 'Prêts Bancaires', 'Salaire Net', 'TVA', 'Inflation', 'Seuil de Rentabilité'],
      ar: ['الفائدة المركبة', 'سداد القروض', 'الراتب الصافي', 'الضرائب وVAT', 'التضخم', 'نقطة التعادل']
    }
  },
  'real-estate': {
    id: 'real-estate',
    icon: 'real_estate_agent',
    name: {
      he: 'נדל״ן ומשכנתאות',
      en: 'Real Estate & Mortgages',
      es: 'Bienes Raíces e Hipotecas',
      fr: 'Immobilier & Prêts',
      ar: 'العقارات والرهن العقاري'
    },
    seoTitle: {
      he: 'מחשבוני נדל״ן ומשכנתא | לוח שפיצר, תשואת שכירות ומס רכישה | GlobalCalc Pro',
      en: 'Real Estate & Mortgage Calculators | Amortization, Cap Rate & ROI | GlobalCalc Pro',
      es: 'Calculadoras Inmobiliarias y de Hipotecas | Amortización y Rentabilidad | GlobalCalc Pro',
      fr: 'Calculatrices Immobilières | Prêt Immobilier, Rendement Locatif | GlobalCalc Pro',
      ar: 'حاسبات العقارات والرهن العقاري | إطفاء الديون وعائد الإيجار | GlobalCalc Pro'
    },
    seoDescription: {
      he: 'מחשבוני נדל"ן ומשכנתא מתקדמים: חישוב החזר חודשי, לוח שפיצר, מיחזור משכנתא, שכירות מול קנייה, תשואת Cap Rate ומס רכישה ושבח מעודכן 2026.',
      en: 'Comprehensive real estate and mortgage calculators: monthly mortgage repayment, amortization tables, refinance savings, rent vs. buy, cap rate, and purchase taxes.',
      es: 'Calculadoras inmobiliarias: cuotas hipotecarias, rentabilidad de alquiler (Cap Rate), ahorro por refinanciamiento y compra vs. alquiler.',
      fr: 'Calculatrices immobilières complètes: mensualités de crédit, tableau d’amortissement, rachat de prêt et rendement locatif.',
      ar: 'حاسبات عقارية متكاملة: أقساط الرهن الشهري، جداول السداد، عوائد الإيجار، والمقارنة بين الإيجار والشراء.'
    },
    heroTitle: {
      he: 'מחשבוני נדל״ן, משכנתאות ותשואה מתקדמים',
      en: 'Real Estate & Mortgage Calculation Suite',
      es: 'Calculadoras de Bienes Raíces e Hipotecas',
      fr: 'Suite de Calculs Immobiliers & Hypothèques',
      ar: 'مجموعة حاسبات العقارات والرهن العقاري'
    },
    heroSubtitle: {
      he: 'תכנן רכישת נכס, השווה מסלולי משכנתא וחשב את התשואה הריאלית על השקעות נדל"ן בדיוק מקסימלי.',
      en: 'Plan property acquisitions, compare mortgage tracks side-by-side, and calculate real rental yields with clinical precision.',
      es: 'Planifica la compra de propiedades, compara opciones hipotecarias y calcula la rentabilidad neta de tus inversiones.',
      fr: 'Planifiez vos investissements immobiliers, comparez les offres de crédit et estimez vos rendements locatifs réels.',
      ar: 'خطط لشراء العقارات، قارن بين مسارات الرهن العقاري، واحسب العوائد الإيجارية الصافية.'
    },
    overview: {
      he: 'רכישת דירה ונטילת משכנתא הן לרוב ההחלטות הכלכליות המשמעותיות ביותר בחיי משק בית או משקיע. הכלים הייעודיים במדור הנדל"ן מאפשרים סימולציה של החזרים חודשיים לפי לוח שפיצר, השוואת מסלולי משכנתא A מול B, הערכת כדאיות מיחזור משכנתא, חישוב שיעור תשואה תפעולית (Cap Rate), ובדיקת עלויות מס רכישה ומס שבח לפי מדרגות החוק.',
      en: 'Real estate acquisitions and mortgage borrowing represent key long-term financial commitments. This suite provides detailed amortization schedules, Plan A vs. Plan B loan scenario comparisons, refinance break-even analytics, and rental property capitalization rate (Cap Rate) modeling.',
      es: 'Herramientas esenciales para evaluar hipotecas, calcular rendimientos de propiedades en alquiler y comparar opciones de financiamiento.',
      fr: 'Outils indispensables pour simuler vos crédits immobiliers, évaluer la rentabilité brute et nette, et optimiser votre fiscalité.',
      ar: 'أدوات أساسية لحساب أقساط الرهن العقاري، وتحليل عوائد الاستثمار في العقارات المؤجرة وتكاليف الضرائب.'
    },
    methodology: {
      he: 'החישובים מבוססים על מתודולוגיית שפיצר (קבוע חודשי), חישובי ריבית דריבית חודשית מורכבת, ועדכוני מדרגות מס רכישה רשמיים.',
      en: 'All mortgage amortization models apply exact standard monthly compounding and legal tiered purchase tax schedules.',
      es: 'Los modelos aplican fórmulas estándar de cuotas fijas amortizables y tablas oficiales de impuestos.',
      fr: 'Les calculs appliquent la formule des mensualités constantes avec amortissement du capital et intérêts dégressifs.',
      ar: 'تعتمد النماذج على طريقة الأقساط الثابتة المركبة شهرياً وجداول الضرائب المعتمدة.'
    },
    tags: {
      he: ['מחשבון משכנתא', 'לוח שפיצר', 'מיחזור משכנתא', 'מס רכישה ושבח', 'שכירות מול קנייה', 'תשואת Cap Rate', 'יכולת החזר'],
      en: ['Mortgage Calculator', 'Amortization Schedule', 'Refinance', 'Purchase Tax', 'Rent vs Buy', 'Cap Rate', 'Affordability'],
      es: ['Calculadora de Hipoteca', 'Tabla de Amortización', 'Refinanciamiento', 'Comprar o Alquilar', 'Cap Rate'],
      fr: ['Prêt Immobilier', 'Tableau d’Amortissement', 'Rachat de Crédit', 'Acheter ou Louer', 'Rendement Locatif'],
      ar: ['حاسبة الرهن', 'جدول الإهلاك', 'إعادة التمويل', 'الإيجار أم الشراء', 'عائد العقار']
    }
  },
  health: {
    id: 'health',
    icon: 'favorite',
    name: {
      he: 'בריאות וכושר',
      en: 'Health & Wellness',
      es: 'Salud y Bienestar',
      fr: 'Santé & Forme',
      ar: 'الصحة واللياقة'
    },
    seoTitle: {
      he: 'מחשבוני בריאות, הריון וכושר | מחשבון שבועות הריון, BMI וקלוריות BMR | GlobalCalc Pro',
      en: 'Health, Pregnancy & Fitness Calculators | Due Date, BMI & BMR | GlobalCalc Pro',
      es: 'Calculadoras de Salud, Embarazo y Forma | FPP, IMC y BMR | GlobalCalc Pro',
      fr: 'Calculatrices Santé, Grossesse & Forme | Date d’Accouchement, IMC & Métabolisme | GlobalCalc Pro',
      ar: 'حاسبات الصحة والحمل واللياقة | موعد الولادة، كتلة الجسم وBMR | GlobalCalc Pro'
    },
    seoDescription: {
      he: 'מחשבוני בריאות מדויקים: מחשבון שבועות הריון ותאריך לידה משוער (LMP, הפריה, ביוץ), מחשבון BMI לפי מדדי ארגון הבריאות העולמי, שריפת קלוריות BMR וצריכת מים יומית.',
      en: 'Scientifically validated health calculators: Pregnancy & Due Date estimation (LMP, IVF, conception), WHO Body Mass Index (BMI), BMR/TDEE calorie targets, and hydration.',
      es: 'Calculadoras de salud basadas en estándares médicos: cálculo de semanas de embarazo y FPP, índice de masa corporal (IMC), calorías BMR y consumo de agua.',
      fr: 'Calculatrices santé basées sur les normes médicales: calculatrice de grossesse et terme, IMC (OMS), métabolisme de base (BMR) et hydratation.',
      ar: 'حاسبات صحية دقيقة: حاسبة أسابيع الحمل وتاريخ الولادة المتوقع، مؤشر كتلة الجسم (BMI)، حرق السعرات BMR واحتياجات الماء.'
    },
    heroTitle: {
      he: 'מחשבוני בריאות, הריון ואורח חיים בריא',
      en: 'Health, Pregnancy & Wellness Calculators',
      es: 'Calculadoras de Salud, Embarazo y Bienestar',
      fr: 'Calculatrices Santé, Maternité et Bien-être',
      ar: 'حاسبات الصحة والحمل والنمط الصحي'
    },
    heroSubtitle: {
      he: 'מעקב שבועות הריון ותאריך לידה, מדד מסת גוף BMI, צריכת מים קלורית וחישובי שינה לפי סטנדרטים רפואיים מקובלים.',
      en: 'Track pregnancy gestation milestones, due dates, BMI classifications, hydration, and sleep cycles grounded in established clinical guidelines.',
      es: 'Seguimiento de embarazo, cálculo de fecha de parto, índice de masa corporal (IMC) y requerimientos de hidratación.',
      fr: 'Suivi de grossesse et terme prévu, calcul d’indice de masse corporelle (IMC), besoins hydriques et cycles de sommeil.',
      ar: 'متابعة مراحل الحمل وموعد الولادة، مؤشر كتلة الجسم، واحتياجات الماء اليومية ودورات النوم.'
    },
    overview: {
      he: 'מדור הבריאות של GlobalCalc Pro מספק כלים אינטראקטיביים לתכנון אורח חיים מאוזן ומעקב גופני. המחשבונים במדור כוללים את מחשבון שבועות ההריון ותאריך הלידה (הכולל 4 שיטות חישוב קליניות, ציר אבני דרך ובדיקות, ונתוני גודל ומשקל עוברי), מחשבון BMI לפי תקני ארגון הבריאות העולמי (WHO), מחשבון חילוף חומרים בסיסי (BMR/TDEE), מחשבון צריכת מים מותאם משקל ומחשבון מחזורי שינה (REM).',
      en: 'The Health and Wellness Suite offers interactive wellness tools grounded in peer-reviewed clinical research. Features include our clinical Pregnancy & Due Date calculator (supporting LMP, conception, and IVF transfers with fetal milestones), WHO-standard BMI evaluations, Mifflin-St Jeor BMR metrics, weight-adjusted hydration, and 90-minute REM sleep cycle optimization.',
      es: 'Herramientas de salud para el seguimiento del embarazo, masa corporal, metabolismo basal y recomendaciones de hidratación.',
      fr: 'Outils de santé interactifs pour le calcul du terme de grossesse, de l’IMC selon l’OMS, du métabolisme basal et du sommeil.',
      ar: 'توفر باقة الصحة أدوات دقيقة لحساب مراحل الحمل وموعد الولادة، مؤشر كتلة الجسم، ومعدلات الأيض واحتياجات الجسم الحيوية.'
    },
    methodology: {
      he: 'שיטות החישוב מתבססות על כלל נייגלה (Naegele’s Rule) להריון, נוסחת Mifflin-St Jeor ל-BMR, ותקני המשקל התקין של ארגון הבריאות העולמי (WHO). הכלים מיועדים למטרות מידע בלבד ואינם מהווים תחליף לייעוץ רפואי.',
      en: 'Calculations reference Naegele’s rule for gestational estimation, Mifflin-St Jeor for energy expenditure, and WHO classifications for BMI. All tools are strictly informational and non-diagnostic.',
      es: 'Las fórmulas se basan en la regla de Naegele para gestación y los estándares de la OMS para el índice de masa corporal.',
      fr: 'Les calculs reposent sur la règle de Naegele pour la grossesse et les seuils de l’Organisation Mondiale de la Santé pour l’IMC.',
      ar: 'تستند العمليات الحسابية إلى قاعدة نيجيلي الطبية للحمل، ومعايير منظمة الصحة العالمية لمؤشر كتلة الجسم.'
    },
    tags: {
      he: ['מחשבון שבועות הריון', 'תאריך לידה משוער', 'מחשבון BMI', 'צריכת מים יומית', 'שריפת קלוריות BMR', 'מחזורי שינה REM', 'משקל תקין'],
      en: ['Pregnancy Due Date', 'Gestational Age', 'BMI Calculator', 'Daily Water Intake', 'BMR Calories', 'Sleep Cycles', 'Fetal Milestones'],
      es: ['Calculadora de Embarazo', 'Fecha de Parto', 'Calculadora IMC', 'Consumo de Agua', 'Calorías BMR', 'Ciclos de Sueño'],
      fr: ['Calculatrice Grossesse', 'Date d’Accouchement', 'Indice IMC', 'Hydratation Quotidienne', 'Calories BMR', 'Cycles de Sommeil'],
      ar: ['حاسبة الحمل', 'موعد الولادة المتوقع', 'مؤشر كتلة الجسم', 'احتياج الماء', 'سعرات BMR', 'دورات النوم']
    }
  },
  math: {
    id: 'math',
    icon: 'functions',
    name: {
      he: 'מתמטיקה והמרות',
      en: 'Math & Conversions',
      es: 'Matemáticas y Conversiones',
      fr: 'Mathématiques & Conversions',
      ar: 'الرياضيات والتحويلات'
    },
    seoTitle: {
      he: 'מחשבוני מתמטיקה והמרת יחידות | מחשבון אחוזים, מטריצות וגיאומטריה | GlobalCalc Pro',
      en: 'Math, Unit Converter & Geometry Calculators | Percentage, Matrix & Algebra | GlobalCalc Pro',
      es: 'Calculadoras de Matemáticas y Conversión de Unidades | Porcentajes y Matrices | GlobalCalc Pro',
      fr: 'Calculatrices Mathématiques et Conversion d’Unités | Pourcentage & Matrices | GlobalCalc Pro',
      ar: 'حاسبات الرياضيات وتحويل الوحدات | حاسبة النسبة المئوية والمصفوفات | GlobalCalc Pro'
    },
    seoDescription: {
      he: 'מחשבוני מתמטיקה מתקדמים: מחשבון אחוזים רב-שימושי, המרת מידות ויחידות אורך, משקל וטמפרטורה, חישוב מטריצות, מספרים מרוכבים, גיאומטריה וסטטיסטיקה בדיוק מוחלט.',
      en: 'Precision math and scientific calculation suite: multi-scenario percentage finder, unit conversions across length/weight/temp, matrix operations, complex numbers, and geometry.',
      es: 'Calculadoras matemáticas y científicas: porcentaje en varias modalidades, conversión de medidas (longitud, peso, temperatura), matrices y números complejos.',
      fr: 'Calculatrices mathématiques de haute précision: recherche de pourcentages, conversion d’unités métriques et impériales, matrices et géométrie.',
      ar: 'حاسبات رياضية وعلمية دقيقة: حساب النسب المئوية، تحويل وحدات الطول والوزن والحرارة، ضرب المصفوفات والأرقام المركبة.'
    },
    heroTitle: {
      he: 'מחשבוני מתמטיקה, אלגברה והמרת מידות',
      en: 'Mathematics, Algebra & Conversion Suite',
      es: 'Matemáticas, Álgebra y Conversión de Unidades',
      fr: 'Mathématiques, Algèbre et Conversions d’Unités',
      ar: 'مجموعة حاسبات الرياضيات والتحويلات'
    },
    heroSubtitle: {
      he: 'בצע חישובי אחוזים, המרות יחידות מטריות ואימפריאליות, וחישובים אלגבריים וגיאומטריים מורכבים בזמן אמת.',
      en: 'Execute instant percentage computations, metric-to-imperial conversions, and advanced matrix or statistical operations.',
      es: 'Realiza cálculos de porcentajes, conversiones métricas e imperiales y operaciones matriciales con precisión instantánea.',
      fr: 'Effectuez des calculs de pourcentage, des conversions d’unités et des opérations matricielles en temps réel.',
      ar: 'أجرِ حسابات النسب المئوية المعقدة، والتحويلات بين الوحدات المترية والإنجليزية، والعمليات الجبرية.'
    },
    overview: {
      he: 'מדור המתמטיקה של GlobalCalc Pro נבנה לתת מענה לתלמידים, מהנדסים, אנשי מקצוע ומשתמשים יומיומיים הזקוקים לחישובים אמינים. המערכת כוללת מחשבון אחוזים חכם (הנחות, מציאת ערך ושינוי באחוזים), ממיר יחידות מקיף למדידת אורך, שטח, נפח, משקל, מהירות וטמפרטורה, וכלים מתקדמים למספרים מרוכבים ומטריצות.',
      en: 'Designed for students, engineers, and quantitative professionals, the Math suite provides fast, error-free calculations. Featuring our intuitive Percentage Finder, multi-unit converters covering length, area, volume, mass, velocity, and temperature, plus matrix algebra and geometry solvers.',
      es: 'Herramientas matemáticas para estudiantes y profesionales: porcentajes rápidos, convertidor de unidades completo y cálculos algebraicos.',
      fr: 'Conçu pour les étudiants et professionnels: calculatrice de pourcentages, convertisseur d’unités métriques/impériales et géométrie.',
      ar: 'صُممت باقة الرياضيات للطلاب والمهندسين لتوفير عمليات حسابية سريعة ودقيقة للنسب المئوية والتحويلات بين الوحدات.'
    },
    methodology: {
      he: 'החישובים מבוססים על קבועים מתמטיים מדויקים (IEEE 754 מורחב דרך Decimal.js) למניעת אי-דיוקים בינאריים בעשרוניות.',
      en: 'All arithmetic operations utilize arbitrary-precision Decimal libraries to prevent binary floating-point rounding errors.',
      es: 'Todas las operaciones utilizan precisión decimal exacta para evitar desviaciones numéricas.',
      fr: 'Toutes les opérations utilisent une bibliothèque de calcul décimal arbitraire garantissant une précision totale.',
      ar: 'تعتمد جميع العمليات الحسابية على مكتبات الحساب العشري الدقيق لتجنب أخطاء التقريب.'
    },
    tags: {
      he: ['מחשבון אחוזים', 'המרת מידות', 'חישוב הנחות', 'אחוז שינוי', 'מטריצות', 'מספרים מרוכבים', 'גיאומטריה ושטחים'],
      en: ['Percentage Calculator', 'Unit Converter', 'Discounts', 'Percent Change', 'Matrix Operations', 'Complex Numbers', 'Geometry'],
      es: ['Calculadora de Porcentajes', 'Conversor de Unidades', 'Descuentos', 'Cambio Porcentual', 'Matrices'],
      fr: ['Calcul de Pourcentage', 'Convertisseur d’Unités', 'Remises', 'Variation en %', 'Matrices'],
      ar: ['حاسبة النسبة المئوية', 'تحويل الوحدات', 'حساب الخصومات', 'نسبة التغير', 'المصفوفات']
    }
  },
  tech: {
    id: 'tech',
    icon: 'devices',
    name: {
      he: 'טכנולוגיה והנדסה',
      en: 'Tech & Engineering',
      es: 'Tecnología e Ingeniería',
      fr: 'Technologie & Ingénierie',
      ar: 'التكنولوجيا والهندسة'
    },
    seoTitle: {
      he: 'מחשבוני טכנולוגיה והנדסה | זמן הורדה, רכיבי פלטייה ורוחב פס | GlobalCalc Pro',
      en: 'Technology & Engineering Calculators | Download Time & Bandwidth | GlobalCalc Pro',
      es: 'Calculadoras de Tecnología e Ingeniería | Tiempo de Descarga y Ancho de Banda | GlobalCalc Pro',
      fr: 'Calculatrices Technologie & Ingénierie | Temps de Téléchargement | GlobalCalc Pro',
      ar: 'حاسبات التكنولوجيا والهندسة | وقت التحميل وسرعة الإنترنت | GlobalCalc Pro'
    },
    seoDescription: {
      he: 'מחשבוני טכנולוגיה: חישוב זמן הורדת קבצים לפי מהירות אינטרנט, המרת נפחי אחסון ורכיבי קירור תרמואלקטריים (Peltier) בדיוק הנדסי.',
      en: 'Engineering and technology tools: network bandwidth download time estimations, data storage volume conversions, and thermoelectric Peltier cooling physics.',
      es: 'Herramientas de ingeniería y tecnología: cálculo de tiempo de descarga por velocidad de red, almacenamiento digital y refrigeración Peltier.',
      fr: 'Outils d’ingénierie et technologie: estimation du temps de téléchargement selon la bande passante, stockage numérique et effet Peltier.',
      ar: 'أدوات تقنية وهندسية: حساب مدة تحميل الملفات حسب سرعة الاتصال، وتحويل سعات التخزين الرقمي.'
    },
    heroTitle: {
      he: 'מחשבוני טכנולוגיה, רשתות והנדסה',
      en: 'Technology, Network & Engineering Tools',
      es: 'Tecnología, Redes e Ingeniería',
      fr: 'Technologie, Réseau et Ingénierie',
      ar: 'أدوات التكنولوجيا والشبكات والهندسة'
    },
    heroSubtitle: {
      he: 'חשב זמני העברת קבצים, מהירויות הורדה, קיבולות אחסון וחישובים תרמיים בדיוק גבוה.',
      en: 'Compute bandwidth transfer durations, storage requirements, and thermal engineering parameters.',
      es: 'Calcula tiempos de transferencia de archivos, capacidades de almacenamiento y parámetros de ingeniería.',
      fr: 'Estimez les temps de transfert réseau, les volumes de données et les calculs thermiques.',
      ar: 'احسب مدة نقل الملفات وسرعات التحميل وسعات التخزين بدقة عالية.'
    },
    overview: {
      he: 'מדור הטכנולוגיה וההנדסה מרכז כלים שימושיים למפתחים, מנהלי רשתות ומהנדסים. מחשבון זמן ההורדה מאפשר לבדוק במדויק כמה זמן ייקח להוריד או להעלות קובץ בכל גודל לפי מהירות החיבור בפועל, כולל המרת יחידות מידע (MB/s מול Mbps) וחישובי יעילות.',
      en: 'The Tech and Engineering hub is built for IT administrators, developers, and technical professionals. Features include our file transfer bandwidth calculator, data size conversions, and thermoelectric physics modeling.',
      es: 'Herramientas técnicas para administradores de red y desarrolladores: cálculos de velocidad de descarga y almacenamiento.',
      fr: 'Outils techniques pour développeurs et techniciens: bande passante, temps de téléchargement et transferts de données.',
      ar: 'أدوات تقنية للمطورين ومديري الشبكات: حساب أوقات التحميل وسرعة نقل البيانات الفعلية.'
    },
    methodology: {
      he: 'החישובים מביאים בחשבון את ההבדלים התקניים בין ביטים (b) לבייטים (B), מקדמי תקשורת רשת ופרוטוקולי שידור.',
      en: 'Models incorporate standard telecom distinctions between bits and bytes, taking into account transmission overhead.',
      es: 'Los cálculos consideran la diferencia técnica entre bits y bytes y la sobrecarga de red.',
      fr: 'Les formules prennent en compte la distinction exacte entre bits et octets ainsi que les protocoles de transmission.',
      ar: 'تراعي النماذج الفرق الدقيق بين البت والبايت وحسابات الكفاءة الشبكية.'
    },
    tags: {
      he: ['זמן הורדה', 'מהירות אינטרנט', 'המרת בייטים לביטים', 'רוחב פס', 'קירור פלטייה', 'אחסון דיגיטלי'],
      en: ['Download Time', 'Internet Speed', 'Bits to Bytes', 'Bandwidth', 'Peltier Cooling', 'Digital Storage'],
      es: ['Tiempo de Descarga', 'Velocidad de Internet', 'Bits a Bytes', 'Ancho de Banda', 'Almacenamiento'],
      fr: ['Temps de Téléchargement', 'Débit Internet', 'Bits en Octets', 'Bande Passante', 'Stockage'],
      ar: ['وقت التحميل', 'سرعة الإنترنت', 'تحويل البايت', 'سعة التخزين', 'عرض النطاق']
    }
  },
  lifestyle: {
    id: 'lifestyle',
    icon: 'mood',
    name: {
      he: 'לייפסטייל ויום-יום',
      en: 'Lifestyle & Everyday',
      es: 'Estilo de Vida y Diario',
      fr: 'Quotidien & Mode de Vie',
      ar: 'نمط الحياة واليوميات'
    },
    seoTitle: {
      he: 'מחשבוני לייפסטייל, טיפים ויום-יום | מחשבון טיפים, גיל מדויק ודלק | GlobalCalc Pro',
      en: 'Lifestyle & Everyday Calculators | Tip Splitter, Exact Age & Fuel | GlobalCalc Pro',
      es: 'Calculadoras de Estilo de Vida y Diario | Propinas, Edad Exacta y Gasolina | GlobalCalc Pro',
      fr: 'Calculatrices du Quotidien | Pourboire, Âge Exact & Carburant | GlobalCalc Pro',
      ar: 'حاسبات نمط الحياة واليوميات | تقسيم الفاتورة، العمر الدقيق والوقود | GlobalCalc Pro'
    },
    seoDescription: {
      he: 'מחשבונים שימושיים לחיי היום-יום: מחשבון טיפים ופיצול חשבון במסעדה, מחשבון גיל מדויק וימי הולדת, חלוקת הוצאות דלק ונסיעות, וזמני צלייה ובישול לפי משקל.',
      en: 'Everyday utility calculators: restaurant tip and bill splitters, exact age and birthday countdown, road trip fuel cost sharing, and meat roasting timers.',
      es: 'Calculadoras prácticas para el día a día: reparto de propinas y cuentas, cálculo exacto de edad, gastos de gasolina en viajes y tiempos de cocción.',
      fr: 'Calculatrices pratiques pour le quotidien: partage de l’addition et pourboire, calcul d’âge exact, frais de carburant et temps de cuisson.',
      ar: 'حاسبات عملية للحياة اليومية: حساب البقشيش وتقسيم الفاتورة، حساب العمر الدقيق، وتقاسم تكاليف وقود الرحلات.'
    },
    heroTitle: {
      he: 'מחשבוני לייפסטייל, נסיעות ויום-יום',
      en: 'Lifestyle, Dining & Travel Calculators',
      es: 'Calculadoras de Estilo de Vida, Restaurantes y Viajes',
      fr: 'Calculatrices Quotidien, Restauration et Voyages',
      ar: 'حاسبات الحياة اليومية والمطاعم والسفر'
    },
    heroSubtitle: {
      he: 'כלים פשוטים, מהירים ומדויקים לפעולות יומיומיות: פיצול חשבונות, חישוב גיל, נסיעות ובישול.',
      en: 'Fast, dependable everyday tools: split dining checks fairly, calculate exact age metrics, and estimate travel fuel.',
      es: 'Herramientas rápidas y confiables para repartir cuentas de restaurantes, calcular edades y viajes.',
      fr: 'Des outils simples et rapides pour diviser vos additions, calculer votre âge exact et vos trajets.',
      ar: 'أدوات سريعة وموثوقة لتقسيم فواتير المطاعم، حساب العمر الدقيق، وتقدير تكاليف الوقود.'
    },
    overview: {
      he: 'מדור הלייפסטייל מרכז פתרונות חישוב מהירים לסיטואציות יומיומיות: כמה טיפ להשאיר וכיצד לחלק את החשבון בין סועדים, חישוב הגיל המדויק בשנים, חודשים, ימים ושעות, פיצול עלויות דלק בנסיעות משותפות (Carpool), וזמני צליית בשר בתנור לפי משקל מומלץ.',
      en: 'The Lifestyle suite addresses practical daily questions: fair restaurant bill and tip splitting, exact age and milestone countdowns, shared carpool travel fuel calculations, and culinary oven roasting timers.',
      es: 'Soluciones prácticas para situaciones comunes: propinas en restaurantes, cálculo de cumpleaños, gastos de viajes y cocina.',
      fr: 'Des solutions immédiates pour partager une note de restaurant, calculer son âge au jour près et organiser un covoiturage.',
      ar: 'حلول ذكية للمواقف اليومية: تقسيم الفواتير والإكراميات، حساب العمر بالميلادي واليومي، وتقاسم مصاريف الرحلات.'
    },
    methodology: {
      he: 'החישובים מבוססים על נוהגי שירות מקובלים, תאריכי לוח שנה גרגוריאני מדויקים, וטבלאות טמפרטורה וזמני בישול בטוחים.',
      en: 'Calculations follow regional hospitality tipping customs, exact Gregorian date intervals, and USDA food safety cooking guidelines.',
      es: 'Las fórmulas respetan las normas habituales de propinas, calendarios exactos y tiempos seguros de cocción.',
      fr: 'Les calculs suivent les usages de pourboire, le calendrier grégorien et les recommandations culinaires.',
      ar: 'تتبع الحسابات أعراف الضيافة المعتمدة وحسابات التقويم الدقيقة وإرشادات سلامة الطهي.'
    },
    tags: {
      he: ['מחשבון טיפים', 'פיצול חשבון', 'מחשבון גיל מדויק', 'עלויות דלק ונסיעה', 'טיימר בישול וצלייה', 'ימי עסקים'],
      en: ['Tip Calculator', 'Bill Splitter', 'Exact Age', 'Fuel Cost Splitter', 'Cooking Roasting Timer', 'Business Days'],
      es: ['Calculadora de Propinas', 'Dividir Cuenta', 'Edad Exacta', 'Gasto de Gasolina', 'Tiempos de Cocina'],
      fr: ['Calculateur Pourboire', 'Partage d’Addition', 'Âge Exact', 'Frais Carburant', 'Temps de Cuisson'],
      ar: ['حاسبة البقشيش', 'تقسيم الحساب', 'العمر الدقيق', 'تكلفة الوقود', 'مؤقت الطهي']
    }
  }
};

export function getCategoryHubInfo(categoryId: string): CategoryHubInfo | null {
  return CATEGORY_HUBS[categoryId] || null;
}
