export interface QuizOption {
  id: string;
  icon: string;
  label: {
    he: string;
    en: string;
    es: string;
    fr: string;
    ar: string;
  };
  desc?: {
    he: string;
    en: string;
    es: string;
    fr: string;
    ar: string;
  };
  // Either leads to another question step or directly to a calculator path
  nextStepId?: string;
  targetPath?: string;
  calculatorId?: string;
}

export interface QuizStep {
  id: string;
  question: {
    he: string;
    en: string;
    es: string;
    fr: string;
    ar: string;
  };
  subtitle?: {
    he: string;
    en: string;
    es: string;
    fr: string;
    ar: string;
  };
  options: QuizOption[];
}

export const assistantTranslations = {
  he: {
    title: "Calc-E העוזר האישי",
    badge: "צריך עזרה?",
    guidedQuizTab: "שאלון מודרך",
    searchTab: "חיפוש חופשי",
    startQuiz: "🎯 מצא לי מחשבון בשאלון קצר",
    restartQuiz: "🔄 התחל שאלון מחדש",
    back: "חזור",
    recommended: "המחשבון המומלץ עבורך:",
    openCalculator: "פתח את המחשבון",
    searchPlaceholder: "חפש מחשבון...",
    noResults: "לא נמצאו מחשבונים תואמים",
    quickTip: "טיפ: בחר תחום כדי להגיע מיד לחישוב הנכון!",
    allCalculators: "לכל המחשבונים",
  },
  en: {
    title: "Calc-E Assistant",
    badge: "Need help?",
    guidedQuizTab: "Guided Quiz",
    searchTab: "Search",
    startQuiz: "🎯 Find Calculator via Short Quiz",
    restartQuiz: "🔄 Restart Quiz",
    back: "Back",
    recommended: "Recommended for you:",
    openCalculator: "Open Calculator",
    searchPlaceholder: "Search calculators...",
    noResults: "No matching calculators found",
    quickTip: "Tip: Select a topic to quickly reach the right calculator!",
    allCalculators: "All Calculators",
  },
  es: {
    title: "Calc-E Asistente",
    badge: "¿Necesitas ayuda?",
    guidedQuizTab: "Guía interactiva",
    searchTab: "Búsqueda",
    startQuiz: "🎯 Encuentra tu calculadora",
    restartQuiz: "🔄 Reiniciar cuestionario",
    back: "Atrás",
    recommended: "Recomendado para ti:",
    openCalculator: "Abrir Calculadora",
    searchPlaceholder: "Buscar calculadoras...",
    noResults: "No se encontraron calculadoras",
    quickTip: "Consejo: ¡Elige un tema para encontrar la calculadora adecuada!",
    allCalculators: "Todas las calculadoras",
  },
  fr: {
    title: "Calc-E Assistant",
    badge: "Besoin d'aide ?",
    guidedQuizTab: "Quiz guidé",
    searchTab: "Recherche",
    startQuiz: "🎯 Trouver ma calculatrice",
    restartQuiz: "🔄 Recommencer le quiz",
    back: "Retour",
    recommended: "Recommandé pour vous :",
    openCalculator: "Ouvrir la calculatrice",
    searchPlaceholder: "Rechercher des calculatrices...",
    noResults: "Aucune calculatrice trouvée",
    quickTip: "Astuce : Choisissez un domaine pour accéder directement au bon outil !",
    allCalculators: "Tous les calculateurs",
  },
  ar: {
    title: "Calc-E المساعد الذكي",
    badge: "هل تحتاج مساعدة؟",
    guidedQuizTab: "دليل تفاعلي",
    searchTab: "بحث",
    startQuiz: "🎯 اعثر على الآلة الحاسبة المناسبة",
    restartQuiz: "🔄 إعادة الاختبار",
    back: "رجوع",
    recommended: "الآلة الحاسبة الموصى بها:",
    openCalculator: "افتح الحاسبة",
    searchPlaceholder: "ابحث عن حاسبة...",
    noResults: "لم يتم العثور على حاسبات مطابقة",
    quickTip: "نصيحة: اختر مجالك للوصول الفوري للحاسبة الصحيحة!",
    allCalculators: "جميع الحاسبات",
  },
};

export const quizSteps: Record<string, QuizStep> = {
  root: {
    id: "root",
    question: {
      he: "באיזה תחום תרצה לבצע חישוב היום?",
      en: "What type of calculation do you need today?",
      es: "¿Qué tipo de cálculo necesitas hoy?",
      fr: "Quel type de calcul souhaitez-vous effectuer ?",
      ar: "ما نوع الحساب الذي ترغب في إجرائه اليوم؟",
    },
    subtitle: {
      he: "בחר את התחום הראשי:",
      en: "Select a primary category:",
      es: "Selecciona una categoría principal:",
      fr: "Sélectionnez une catégorie principale :",
      ar: "اختر الفئة الرئيسية:",
    },
    options: [
      {
        id: "finance",
        icon: "account_balance_wallet",
        nextStepId: "step_finance",
        label: {
          he: "כספים וחיסכון",
          en: "Finance & Savings",
          es: "Finanzas y Ahorro",
          fr: "Finances et Épargne",
          ar: "المال والادخار",
        },
        desc: {
          he: "ריבית דריבית, יעדי חיסכון, החזר חובות",
          en: "Compound interest, savings goals, debt payoff",
          es: "Interés compuesto, metas de ahorro, deudas",
          fr: "Intérêts composés, objectifs d'épargne, dettes",
          ar: "الفائدة المركبة، أهداف الادخار، سداد الديون",
        },
      },
      {
        id: "real_estate",
        icon: "home",
        nextStepId: "step_real_estate",
        label: {
          he: "נדל״ן ודיור",
          en: "Real Estate & Housing",
          es: "Bienes Raíces y Vivienda",
          fr: "Immobilier et Logement",
          ar: "العقارات والسكن",
        },
        desc: {
          he: "משכנתא, קנייה מול שכירות, תשואת נכס (Cap Rate)",
          en: "Mortgage, rent vs buy, cap rate",
          es: "Hipoteca, alquilar vs comprar, tasa cap",
          fr: "Prêt immobilier, louer vs acheter, taux de capitalisation",
          ar: "الرهن العقاري، الإيجار مقابل الشراء، عائد العقار",
        },
      },
      {
        id: "business_salary",
        icon: "payments",
        nextStepId: "step_business",
        label: {
          he: "עבודה, שכר ועסקים",
          en: "Work, Salary & Business",
          es: "Trabajo, Salario y Negocios",
          fr: "Travail, Salaire et Entreprise",
          ar: "العمل والراتب والأعمال",
        },
        desc: {
          he: "המרי שכר, הכנסת פרילנסר, מרווחי רווח (Margin), החזר השקעה (ROI)",
          en: "Salary conversion, freelance net, profit margin, ROI",
          es: "Conversión de salario, freelance, margen de ganancia, ROI",
          fr: "Conversion salaire, freelance net, marge bénéficiaire, ROI",
          ar: "تحويل الراتب، صافي العمل الحر، هامش الربح، العائد",
        },
      },
      {
        id: "auto_travel",
        icon: "directions_car",
        nextStepId: "step_auto_travel",
        label: {
          he: "רכב, דלק ונסיעות",
          en: "Auto, Fuel & Travel",
          es: "Autos, Combustible y Viajes",
          fr: "Auto, Carburant et Voyages",
          ar: "السيارات والوقود والسفر",
        },
        desc: {
          he: "הלוואת רכב, פיצול הוצאות דלק ונסיעה",
          en: "Car loans, fuel split for road trips",
          es: "Préstamo de auto, dividir gasolina en viajes",
          fr: "Prêt auto, partage des frais de carburant",
          ar: "قروض السيارات، تقسيم تكلفة الوقود",
        },
      },
      {
        id: "math_conv",
        icon: "calculate",
        nextStepId: "step_math_conv",
        label: {
          he: "מתמטיקה והמרת יחידות",
          en: "Math & Unit Conversions",
          es: "Matemáticas y Conversión",
          fr: "Maths et Conversions",
          ar: "الرياضيات وتحويل الوحدات",
        },
        desc: {
          he: "חישוב אחוזים, הנחות, המרת אורך/משקל/טמפרטורה",
          en: "Percentages, discounts, length/weight/temp conversion",
          es: "Porcentajes, descuentos, unidades métricas",
          fr: "Pourcentages, remises, conversion d'unités",
          ar: "النسب المئوية، الخصومات، تحويل الوحدات",
        },
      },
      {
        id: "health_lifestyle",
        icon: "favorite",
        nextStepId: "step_health_lifestyle",
        label: {
          he: "בריאות ואורח חיים",
          en: "Health & Lifestyle",
          es: "Salud y Estilo de Vida",
          fr: "Santé et Mode de Vie",
          ar: "الصحة وأسلوب الحياة",
        },
        desc: {
          he: "מדד מסת גוף (BMI), חישוב טיפ במסעדה, חישוב גיל",
          en: "BMI index, restaurant tip split, exact age calculator",
          es: "Índice IMC, propinas de restaurante, calculadora de edad",
          fr: "Indice IMC, pourboire au restaurant, calcul d'âge précis",
          ar: "مؤشر كتلة الجسم (BMI)، حساب الإكراميات، حساب العمر",
        },
      },
      {
        id: "tech_science",
        icon: "memory",
        nextStepId: "step_tech_science",
        label: {
          he: "טכנולוגיה ומחשבים",
          en: "Tech & Science",
          es: "Tecnología y Ciencia",
          fr: "Technologie et Science",
          ar: "التكنولوجيا والعلوم",
        },
        desc: {
          he: "זמן הורדת קבצים, קירור תרמואלקטרי (Peltier)",
          en: "Download time calculation, Peltier cooling efficiency",
          es: "Tiempo de descarga, refrigeración Peltier",
          fr: "Temps de téléchargement, refroidissement Peltier",
          ar: "وقت التحميل، التبريد الكهروحراري بيلتير",
        },
      },
    ],
  },

  // 1. Finance Step
  step_finance: {
    id: "step_finance",
    question: {
      he: "מה המטרה הפיננסית שלך?",
      en: "What is your financial goal?",
      es: "¿Cuál es tu meta financiera?",
      fr: "Quel est votre objectif financier ?",
      ar: "ما هو هدفك المالي؟",
    },
    subtitle: {
      he: "בחר את הפעולה שתרצה לבצע:",
      en: "Choose the calculation you need:",
      es: "Elige el cálculo que necesitas:",
      fr: "Choisissez le calcul nécessaire :",
      ar: "اختر العملية التي تريد إجراءها:",
    },
    options: [
      {
        id: "opt_compound",
        icon: "trending_up",
        targetPath: "/compound-interest",
        calculatorId: "compound",
        label: {
          he: "חישוב ריבית דריבית וצמיחת חיסכון",
          en: "Compound Interest & Investment Growth",
          es: "Interés Compuesto y Crecimiento",
          fr: "Intérêts composés et croissance",
          ar: "الفائدة المركبة ونمو الاستثمار",
        },
        desc: {
          he: "גלה כמה שווה ההשקעה שלך לאורך זמן בריבית קבועה",
          en: "See how your investment compounds over years",
          es: "Calcula el crecimiento de tu dinero con el tiempo",
          fr: "Visualisez l'effet des intérêts composés dans le temps",
          ar: "اكتشف كيف تتضاعف استثماراتك مع الوقت",
        },
      },
      {
        id: "opt_goal_savings",
        icon: "savings",
        targetPath: "/calculators/goal-savings",
        calculatorId: "goal-savings",
        label: {
          he: "חישוב יעד חיסכון (כמה להפקיד מדי חודש)",
          en: "Savings Goal Planner",
          es: "Planificador de Metas de Ahorro",
          fr: "Planificateur d'Objectif d'Épargne",
          ar: "مخطط هدف الادخار الشهري",
        },
        desc: {
          he: "הגדר סכום מטרה וגלה כמה צריך לחסוך בכל חודש",
          en: "Find out monthly deposits needed to reach your target",
          es: "Descubre cuánto depositar mensualmente para alcanzar tu meta",
          fr: "Déterminez le montant mensuel nécessaire pour atteindre votre but",
          ar: "احسب المبلغ الشهري المطلوب لتحقيق هدفك المالي",
        },
      },
      {
        id: "opt_debt_snowball",
        icon: "ac_unit",
        targetPath: "/calculators/debt-snowball",
        calculatorId: "debt-snowball",
        label: {
          he: "סילוק חובות בשיטת כדור שלג (Debt Snowball)",
          en: "Debt Snowball Payoff Calculator",
          es: "Eliminación de Deudas Bola de Nieve",
          fr: "Remboursement de Dettes Boule de Neige",
          ar: "خطة التخلص من الديون بطريقة كرة الثلج",
        },
        desc: {
          he: "תכנן תוכנית פריעת הלוואות מסודרת ומהירה",
          en: "Create a debt payoff plan starting from smallest balances",
          es: "Planifica el pago de préstamos ordenado de menor a mayor",
          fr: "Établissez un plan de remboursement accéléré",
          ar: "خطط لسداد ديونك وقروضك بأسرع وقت",
        },
      },
      {
        id: "opt_roi",
        icon: "query_stats",
        targetPath: "/calculators/roi",
        calculatorId: "roi",
        label: {
          he: "חישוב החזר השקעה (ROI)",
          en: "Return on Investment (ROI)",
          es: "Retorno de Inversión (ROI)",
          fr: "Retour sur investissement (ROI)",
          ar: "حساب العائد على الاستثمار (ROI)",
        },
        desc: {
          he: "חשב את אחוז הרווח או ההפסד על כל השקעה",
          en: "Calculate profit or loss percentage on any venture",
          es: "Calcula el porcentaje de ganancia o pérdida",
          fr: "Calculez le rendement en pourcentage de votre projet",
          ar: "احسب النسبة المئوية للربح أو الخسارة",
        },
      },
    ],
  },

  // 2. Real Estate Step
  step_real_estate: {
    id: "step_real_estate",
    question: {
      he: "איזה חישוב נדל״ן או דיור נחוץ לך?",
      en: "What housing or real estate calculation do you need?",
      es: "¿Qué cálculo inmobiliario necesitas?",
      fr: "Quel calcul immobilier ou logement recherchez-vous ?",
      ar: "ما هو الحساب العقاري أو السكني الذي تحتاجه؟",
    },
    subtitle: {
      he: "בחר את המקרה שמתאים לך:",
      en: "Select your scenario:",
      es: "Selecciona tu situación:",
      fr: "Sélectionnez votre situation :",
      ar: "اختر الحالة المناسبة لك:",
    },
    options: [
      {
        id: "opt_mortgage",
        icon: "real_estate_agent",
        targetPath: "/mortgage-calculator",
        calculatorId: "mortgage",
        label: {
          he: "מחשבון משכנתא ותשלום חודשי",
          en: "Mortgage Payment Calculator",
          es: "Calculadora de Hipoteca",
          fr: "Calculateur de Prêt Immobilier",
          ar: "حاسبة الرهن العقاري والأقساط",
        },
        desc: {
          he: "חשב החזר חודשי, סך ריביות ולוח סילוקין שפיצר",
          en: "Calculate monthly payment, total interest and amortization",
          es: "Calcula cuota mensual, intereses totales y amortización",
          fr: "Calculez mensualités, coût total du crédit et tableau d'amortissement",
          ar: "احسب القسط الشهري وإجمالي الفوائد وجدول السداد",
        },
      },
      {
        id: "opt_rent_vs_buy",
        icon: "balance",
        targetPath: "/calculators/rent-vs-buy",
        calculatorId: "rent-vs-buy",
        label: {
          he: "קנייה מול שכירות (Rent vs Buy)",
          en: "Rent vs Buy Calculator",
          es: "Alquilar vs Comprar Casa",
          fr: "Louer vs Acheter un Logement",
          ar: "مقارنة الإيجار مقابل شراء منزل",
        },
        desc: {
          he: "בדוק מה משתלם יותר כלכלית בטווח הקצר והארוך",
          en: "Compare total cost and equity over 5, 10, or 30 years",
          es: "Descubre qué opción es más rentable financieramente",
          fr: "Comparez les coûts réels et la constitution de patrimoine",
          ar: "قارن التكاليف المالية والقيمة التراكمية على المدى الطويل",
        },
      },
      {
        id: "opt_cap_rate",
        icon: "domain",
        targetPath: "/calculators/cap-rate",
        calculatorId: "cap-rate",
        label: {
          he: "תשואת נכס והשקעה (Cap Rate)",
          en: "Capitalization Rate (Cap Rate)",
          es: "Tasa de Capitalización (Cap Rate)",
          fr: "Taux de Capitalisation (Cap Rate)",
          ar: "معدل الرسملة وعائد العقار الاستثماري",
        },
        desc: {
          he: "חשב תשואה נטו על השכרת דירה או נכס מסחרי",
          en: "Calculate net rental yield and property investment returns",
          es: "Evalúa el rendimiento neto de propiedades en alquiler",
          fr: "Évaluez la rentabilité locative nette de votre bien",
          ar: "احسب صافي العائد الإيجاري للعقار الاستثماري",
        },
      },
    ],
  },

  // 3. Business & Salary Step
  step_business: {
    id: "step_business",
    question: {
      he: "באיזה תחום עסקי או תעסוקתי מדובר?",
      en: "What employment or business tool do you need?",
      es: "¿Qué herramienta laboral o de negocio buscas?",
      fr: "Quel outil professionnel ou salarial recherchez-vous ?",
      ar: "ما هي الأداة المهنية أو التجارية التي تبحث عنها؟",
    },
    subtitle: {
      he: "בחר את סוג החישוב:",
      en: "Select calculation type:",
      es: "Selecciona el tipo de cálculo:",
      fr: "Sélectionnez le type de calcul :",
      ar: "اختر نوع الحساب:",
    },
    options: [
      {
        id: "opt_salary",
        icon: "badge",
        targetPath: "/salary-calculator",
        calculatorId: "salary",
        label: {
          he: "המרת שכר (שעתי, חודשי, שנתי)",
          en: "Salary & Hourly Wage Converter",
          es: "Conversor de Salario y Sueldo por Hora",
          fr: "Convertisseur de Salaire et Taux Horaire",
          ar: "تحويل الراتب (ساعي، شهري، سنوي)",
        },
        desc: {
          he: "המר בקלות בין שכר לשעה, שכר שבועי, חודשי ושנתי",
          en: "Convert easily between hourly, weekly, monthly and annual pay",
          es: "Convierte entre tarifas por hora, mensual y anual",
          fr: "Passez facilement du taux horaire au salaire mensuel et annuel",
          ar: "حول بسهولة بين الأجر بالساعة والراتب الشهري والسنوي",
        },
      },
      {
        id: "opt_freelance",
        icon: "laptop_mac",
        targetPath: "/calculators/freelance-net-income",
        calculatorId: "freelance-net-income",
        label: {
          he: "מחשבון הכנסה נטו לפרילנסרים ועצמאיים",
          en: "Freelance Net Income Calculator",
          es: "Calculadora de Ingreso Neto Freelance",
          fr: "Revenu Net pour Indépendants / Freelances",
          ar: "صافي دخل المستقلين والعمل الحر",
        },
        desc: {
          he: "חשב כמה נשאר לך ביד לאחר הוצאות מוכרות ומיסים",
          en: "Calculate take-home net pay after business expenses and taxes",
          es: "Calcula lo que ganas en mano tras impuestos y gastos",
          fr: "Calculez votre revenu net après charges et impôts",
          ar: "احسب دخلك الصافي الحقيقي بعد خصم النفقات والضرائب",
        },
      },
      {
        id: "opt_margin",
        icon: "point_of_sale",
        targetPath: "/calculators/margin",
        calculatorId: "margin",
        label: {
          he: "שולי רווח ותמחור מוצרים (Margin & Markup)",
          en: "Profit Margin & Markup Calculator",
          es: "Calculadora de Margen de Ganancia y Markup",
          fr: "Calculateur de Marge et Coefficient Multiplicateur",
          ar: "حاسبة هامش الربح وتحديد الأسعار (Margin & Markup)",
        },
        desc: {
          he: "חשב שולי רווח גולמי, אחוז תוספת ורווח נקי במכירות",
          en: "Calculate gross margin, markup percentage and revenue profit",
          es: "Calcula márgenes brutos y precios de venta ideales",
          fr: "Déterminez votre marge brute et votre prix de vente optimal",
          ar: "احسب هامش الربح الإجمالي ونسبة الإضافة على التكلفة",
        },
      },
      {
        id: "opt_roi_biz",
        icon: "insights",
        targetPath: "/calculators/roi",
        calculatorId: "roi",
        label: {
          he: "החזר השקעה עסקית (ROI)",
          en: "Business ROI Calculator",
          es: "Calculadora de ROI de Negocios",
          fr: "Rentabilité d'Investissement Commercial (ROI)",
          ar: "حساب العائد على الاستثمار للمشاريع (ROI)",
        },
        desc: {
          he: "הערך את כדאיות הקמפיין, המיזם או המוצר החדש",
          en: "Evaluate profitability of campaigns, assets or projects",
          es: "Evalúa la rentabilidad de proyectos y campañas",
          fr: "Évaluez la rentabilité de vos campagnes et projets",
          ar: "قيم جدوى وربحية الحملات والمشاريع الجديدة",
        },
      },
    ],
  },

  // 4. Auto & Travel Step
  step_auto_travel: {
    id: "step_auto_travel",
    question: {
      he: "איזה חישוב לרכב או לנסיעות תרצה לבצע?",
      en: "What vehicle or travel calculation do you need?",
      es: "¿Qué cálculo de vehículo o viaje necesitas?",
      fr: "Quel calcul auto ou voyage souhaitez-vous faire ?",
      ar: "ما هو حساب المركبات أو السفر الذي تحتاجه؟",
    },
    subtitle: {
      he: "בחר את האפשרות המתאימה:",
      en: "Choose the right option:",
      es: "Elige la opción adecuada:",
      fr: "Choisissez l'option appropriée :",
      ar: "اختر الخيار المناسب:",
    },
    options: [
      {
        id: "opt_auto_loan",
        icon: "directions_car",
        targetPath: "/calculators/auto-loan",
        calculatorId: "auto-loan",
        label: {
          he: "מחשבון הלוואה ומימון לרכב",
          en: "Auto Loan Calculator",
          es: "Calculadora de Préstamo de Auto",
          fr: "Calculateur de Crédit Auto",
          ar: "حاسبة تمويل وقروض السيارات",
        },
        desc: {
          he: "חשב החזר חודשי, ריבית ועלות כוללת של הרכב",
          en: "Calculate monthly payment, interest rate and total car cost",
          es: "Calcula mensualidad, tasa de interés y costo total del vehículo",
          fr: "Calculez vos mensualités et le coût total de votre véhicule",
          ar: "احسب القسط الشهري والفائدة والتكلفة الإجمالية للسيارة",
        },
      },
      {
        id: "opt_fuel_split",
        icon: "local_gas_station",
        targetPath: "/calculators/fuel-split",
        calculatorId: "fuel-split",
        label: {
          he: "מחשבון פיצול דלק ונסיעות משותפות",
          en: "Fuel Split & Road Trip Calculator",
          es: "Calculadora de Gasolina Compartida",
          fr: "Partage des Frais d'Essence et Trajets",
          ar: "حاسبة تقسيم نفقات الوقود والسفر المشترك",
        },
        desc: {
          he: "חלק את הוצאות הדלק בצורה הוגנת בין כל הנוסעים",
          en: "Split gas costs fairly among passengers based on distance & consumption",
          es: "Divide el gasto de combustible equitativamente entre los pasajeros",
          fr: "Partagez équitablement le carburant entre les passagers",
          ar: "قسم تكلفة البنزين والرحلة بالتساوي بين الركاب",
        },
      },
    ],
  },

  // 5. Math & Conversions Step
  step_math_conv: {
    id: "step_math_conv",
    question: {
      he: "איזה חישוב מתמטי תרצה לפתור?",
      en: "What math problem would you like to solve?",
      es: "¿Qué cálculo matemático deseas resolver?",
      fr: "Quel calcul mathématique souhaitez-vous résoudre ?",
      ar: "ما هي المسألة الرياضية التي تريد حلها؟",
    },
    subtitle: {
      he: "בחר את סוג הפעולה:",
      en: "Select the operation type:",
      es: "Selecciona el tipo de operación:",
      fr: "Sélectionnez le type d'opération :",
      ar: "اختر نوع العملية:",
    },
    options: [
      {
        id: "opt_percentage",
        icon: "percent",
        targetPath: "/percentage-finder",
        calculatorId: "percentage",
        label: {
          he: "מחשבון אחוזים והנחות (Percentage Finder)",
          en: "Percentage & Discount Calculator",
          es: "Calculadora de Porcentajes y Descuentos",
          fr: "Calculateur de Pourcentages et Réductions",
          ar: "حاسبة النسب المئوية والخصومات",
        },
        desc: {
          he: "חשב מהו אחוז ממספר, אחוז שינוי, תוספת והנחות בקלות",
          en: "Find what percentage X is of Y, percentage increase or discounts",
          es: "Calcula porcentajes de números, aumentos y rebajas",
          fr: "Calculez facilement des pourcentages, augmentations et remises",
          ar: "احسب النسبة المئوية من رقم، نسبة التغير والخصومات بكل سهولة",
        },
      },
      {
        id: "opt_unit_converter",
        icon: "swap_horiz",
        targetPath: "/unit-converter",
        calculatorId: "unit",
        label: {
          he: "ממיר יחידות מידה מקיף",
          en: "Universal Unit Converter",
          es: "Conversor Universal de Unidades",
          fr: "Convertisseur d'Unités Universel",
          ar: "محول وحدات القياس الشامل",
        },
        desc: {
          he: "המר בין מטרים, אינצ'ים, ק״ג, פאונד, צלזיוס ופרנהייט ועוד",
          en: "Convert length, mass/weight, temperature, area and volume",
          es: "Convierte longitud, peso, temperatura, volumen y más",
          fr: "Convertissez longueurs, masses, températures et volumes",
          ar: "حول بين الأطوال، الأوزان، درجات الحرارة، والمساحات",
        },
      },
    ],
  },

  // 6. Health & Lifestyle Step
  step_health_lifestyle: {
    id: "step_health_lifestyle",
    question: {
      he: "באיזה כלי יומיומי או בריאותי תרצה להשתמש?",
      en: "Which lifestyle or health tool do you need?",
      es: "¿Qué herramienta de salud o estilo de vida necesitas?",
      fr: "Quel outil santé ou vie quotidienne recherchez-vous ?",
      ar: "ما هي الأداة الصحية أو اليومية التي تبحث عنها؟",
    },
    subtitle: {
      he: "בחר את הכלי המבוקש:",
      en: "Choose the tool you want:",
      es: "Elige la herramienta deseada:",
      fr: "Choisissez l'outil désiré :",
      ar: "اختر الأداة المطلوبة:",
    },
    options: [
      {
        id: "opt_bmi",
        icon: "monitor_weight",
        targetPath: "/bmi-calculator",
        calculatorId: "bmi",
        label: {
          he: "מחשבון מדד מסת גוף (BMI)",
          en: "BMI Calculator (Body Mass Index)",
          es: "Calculadora de IMC (Índice de Masa Corporal)",
          fr: "Calculateur d'IMC (Indice de Masse Corporelle)",
          ar: "حاسبة مؤشر كتلة الجسم (BMI)",
        },
        desc: {
          he: "בדוק האם המשקל שלך תקין לפי גובה ומשקל",
          en: "Check healthy weight categories according to WHO standards",
          es: "Comprueba si tu peso está en rango saludable",
          fr: "Vérifiez si votre poids se situe dans la norme santé",
          ar: "تحقق من وزنك المثالي وتصنيف مؤشر كتلة الجسم",
        },
      },
      {
        id: "opt_tip",
        icon: "restaurant",
        targetPath: "/tip-calculator",
        calculatorId: "tip",
        label: {
          he: "מחשבון טיפ ופיצול חשבון במסעדה",
          en: "Restaurant Tip & Bill Splitter",
          es: "Calculadora de Propinas y División de Cuenta",
          fr: "Calculateur de Pourboire et Partage d'Addition",
          ar: "حاسبة الإكراميات (البقشيش) وتقسيم الفاتورة",
        },
        desc: {
          he: "חשב טיפ הוגן לפי אחוזים וחלק את החשבון בין סועדים",
          en: "Calculate tip percentage and split the check per person",
          es: "Calcula la propina justa y divide el total por comensal",
          fr: "Calculez le pourboire et divisez la note par personne",
          ar: "احسب الإكرامية بدقة وقسم الفاتورة بالتساوي بين الحضور",
        },
      },
      {
        id: "opt_age",
        icon: "cake",
        targetPath: "/age-calculator",
        calculatorId: "age",
        label: {
          he: "מחשבון גיל מדויק ותאריכים",
          en: "Exact Age & Date Calculator",
          es: "Calculadora de Edad Exacta y Fechas",
          fr: "Calculateur d'Âge Exact et Dates",
          ar: "حاسبة العمر الدقيق وتواريخ الميلاد",
        },
        desc: {
          he: "גלה את גילך המדויק בשנים, חודשים, ימים ושעות",
          en: "Find exact age in years, months, days and next birthday countdown",
          es: "Descubre tu edad exacta en días, meses y próximo cumpleaños",
          fr: "Calculez votre âge précis en années, mois et jours",
          ar: "احسب عمرك بالتفصيل بالسنوات والشهور والأيام والعد التنازلي",
        },
      },
    ],
  },

  // 7. Tech & Science Step
  step_tech_science: {
    id: "step_tech_science",
    question: {
      he: "איזה חישוב טכנולוגי או הנדסי תרצה לבצע?",
      en: "What tech or engineering calculation do you need?",
      es: "¿Qué cálculo técnico o de ingeniería deseas?",
      fr: "Quel calcul technologique ou technique souhaitez-vous ?",
      ar: "ما هو الحساب التقني أو الهندسي الذي ترغب به؟",
    },
    subtitle: {
      he: "בחר את הנושא הרצוי:",
      en: "Choose the topic:",
      es: "Elige el tema:",
      fr: "Choisissez le sujet :",
      ar: "اختر الموضوع المطلوب:",
    },
    options: [
      {
        id: "opt_download_time",
        icon: "download",
        targetPath: "/calculators/download-time",
        calculatorId: "download-time",
        label: {
          he: "מחשבון זמן הורדת קבצים (Download Time)",
          en: "File Download Time Calculator",
          es: "Calculadora de Tiempo de Descarga",
          fr: "Calculateur de Temps de Téléchargement",
          ar: "حاسبة وقت تنزيل الملفات وسرعة الإنترنت",
        },
        desc: {
          he: "חשב כמה זמן ייקח להוריד קובץ לפי גודלו ומהירות החיבור",
          en: "Estimate transfer time based on file size and internet bandwidth",
          es: "Calcula el tiempo de bajada según el peso y tu velocidad",
          fr: "Estimez le temps de transfert selon la taille et le débit",
          ar: "احسب بدقة الوقت المستغرق لتحميل أي ملف بحسب سرعة اتصالك",
        },
      },
      {
        id: "opt_peltier",
        icon: "ac_unit",
        targetPath: "/calculators/peltier-cooling",
        calculatorId: "peltier-cooling",
        label: {
          he: "מחשבון קירור תרמואלקטרי (רכיבי Peltier TEC)",
          en: "Peltier Thermoelectric Cooling Calculator",
          es: "Calculadora de Refrigeración Peltier TEC",
          fr: "Calculateur de Refroidissement Peltier (TEC)",
          ar: "حاسبة التبريد الكهروحراري بعنصر بيلتير (TEC)",
        },
        desc: {
          he: "חשב תפוקת קירור (Qc), הספק חשמלי ומקדם יעילות COP",
          en: "Calculate cooling capacity, electrical power and COP",
          es: "Calcula capacidad frigorífica, consumo y coeficiente COP",
          fr: "Calculez la puissance frigorifique, la puissance absorbée et le COP",
          ar: "احسب سعة التبريد، الاستهلاك الكهربائي ومعامل الأداء COP",
        },
      },
    ],
  },
};
