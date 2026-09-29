export interface CategoryHubInfo {
  title: Record<string, string>;
  subtitle: Record<string, string>;
  introText: Record<string, string>;
  keyBenefits: Record<string, string[]>;
  recommendedWorkflow: Record<string, string>;
  expertQuote: Record<string, string>;
}

export const categoryHubsData: Record<string, CategoryHubInfo> = {
  finance: {
    title: {
      he: "מחשבונים פיננסיים, השקעות וחיסכון",
      en: "Financial, Investment & Wealth Calculators",
      es: "Calculadoras Financieras, Inversiones y Ahorro",
      fr: "Calculatrices Financières, Investissements et Épargne",
      ar: "حاسبات مالية، استثمار وادخار",
    },
    subtitle: {
      he: "כלים מתקדמים לתכנון פרישה, ניתוח ריבית דריבית, החזרי הלוואות ומינוף פיננסי בדיוק אקטוארי.",
      en: "Precision tools for retirement planning, compound interest projection, loan amortization, and capital growth.",
      es: "Herramientas de alta precisión para planificación de jubilación, interés compuesto y amortización.",
      fr: "Outils précis pour préparer sa retraite, calculer les intérêts composés et amortir ses emprunts.",
      ar: "أدوات دقيقة للتخطيط المالي، حساب الفائدة المركبة، وجداول سداد القروض.",
    },
    introText: {
      he: "תכנון פיננסי מושכל מבוסס על מתמטיקה מדויקת ולא על תחושות בטן. מחשבוני הכספים וההשקעות של GlobalCalc Pro פותחו על פי לוחות סילוקין סטנדרטיים ונוסחאות ריבית דריבית מתקדמות, תוך שימוש במנוע חישוב עשרוני בעל דיוק גבוה (Arbitrary Precision) למניעת שגיאות עיגול. בין אם אתם מתכננים הפקדות חודשיות לקרן השתלמות או קופת גמל להשקעה, בוחנים כדאיות פירעון מוקדם של הלוואה, או מעריכים את שווי התיק בעוד 20 שנה – חישוב מדויק של עמלות, ריביות ואינפלציה מאפשר לקבל החלטות מושכלות שחוסכות עשרות אלפי שקלים וממקסמות את התשואה המצטברת לאורך זמן.",
      en: "Smart financial management starts with rigorous quantitative analysis. GlobalCalc Pro financial calculators are built using actuarial amortization algorithms and compound capitalization models with high-precision decimal math. Whether you are projecting long-term index fund returns, calculating loan payoffs, or planning for financial independence, accurate modeling helps you optimize cash flow and compound lifetime wealth.",
      es: "La toma de decisiones financieras inteligentes requiere rigor matemático. Nuestras herramientas calculan el interés compuesto, la amortización de deudas y la rentabilidad de inversiones con máxima precisión decimal.",
      fr: "Une gestion financière optimale repose sur des calculs rigoureux. Nos simulateurs utilisent des formules actuarielles reconnues pour projeter vos rendements et amortir vos crédits sans approximations.",
      ar: "الإدارة المالية السليمة تعتمد على الدقة الحسابية العالية. تقدم حاسباتنا المالية نماذج دقيقة لحساب الفائدة المركبة، وجداول سداد القروض، وتخطيط الثروة على المدى الطويل.",
    },
    keyBenefits: {
      he: [
        "דיוק עשרוני מלא ללא סטיות נקודה צפה (Decimal.js)",
        "השוואת תרחישי תשואה ופירעון מוקדם בזמן אמת",
        "ייצוא דוחות ולוחות סילוקין מפורטים לקובץ Excel",
        "תאימות מלאה למודלים בנקאיים וקרנות פנסיה"
      ],
      en: [
        "Full Decimal.js precision preventing floating-point rounding errors",
        "Instant real-time scenario comparison with live charts",
        "One-click Excel export for financial and amortization reports",
        "Standard banking and institutional mathematical compliance"
      ]
    },
    recommendedWorkflow: {
      he: "מומלץ להתחיל בבדיקת מחשבון ריבית דריבית להגדרת יעד חיסכון, לשלב עם מחשבון אינפלציה לבדיקת כוח הקנייה הריאלי, ולהשתמש במחשבון החזר חובות לחיסול מהיר של התחייבויות יקרות.",
      en: "Recommended workflow: Start with Compound Interest to define savings goals, factor in purchasing power with the Inflation Calculator, and clear high-interest liabilities using Debt Snowball."
    },
    expertQuote: {
      he: "״ריבית דריבית היא הפלא השמיני בתבל. מי שמבין אותה – מרוויח אותה; מי שלא – משלם אותה.״ — אלברט איינשטיין",
      en: "\"Compound interest is the eighth wonder of the world. He who understands it, earns it; he who doesn't, pays it.\" — Albert Einstein"
    }
  },
  'real-estate': {
    title: {
      he: "מחשבוני נדל״ן, משכנתאות ומס רכישה",
      en: "Real Estate, Mortgage & Property Investment Calculators",
      es: "Calculadoras de Bienes Raíces e Hipotecas",
      fr: "Calculatrices Immobilières, Prêts et Fiscalité",
      ar: "حاسبات العقارات، الرهن العقاري والضرائب",
    },
    subtitle: {
      he: "בדיקת החזר חודשי, מדרגות מס רכישה עדכניות, תשואת Cap Rate והשוואת קנייה מול שכירות.",
      en: "Calculate monthly payments, current purchase tax brackets, Cap Rate rental yields, and buy-vs-rent breakevens.",
      es: "Simulación de hipotecas, impuestos de transmisiones patrimoniales y rentabilidad inmobiliaria.",
      fr: "Simulateurs de crédit immobilier, frais de notaire et rentabilité locative.",
      ar: "حساب أقساط الرهن العقاري، شرائح الضرائب العقارية، ومقارنة الشراء مقابل الإيجار.",
    },
    introText: {
      he: "רכישת דירה היא בדרך כלל העסקה הכלכלית המשמעותית ביותר בחייו של אדם או משפחה. כדי להימנע מטעויות קריטיות בעלות של מאות אלפי שקלים, פיתחנו מרכז מחשבוני נדל״ן מקיף הכולל את נוסחת שפיצר למשכנתאות, סימולטור מדרגות מס רכישה מעודכן (כולל הבחנה בין דירה יחידה לדירה נוספת), מחשבון תשואת שכירות (Cap Rate) ומחשבון שכירות מול קנייה. שימוש בכלים אלו מעניק תמונה מלאה על יכולת ההחזר החודשית, עלויות נלוות (עו״ד, תיווך, מסים ושיפוץ) ושווי הנכס לאורך 10 עד 30 שנה.",
      en: "Real estate transactions represent the largest financial commitment most individuals ever make. GlobalCalc Pro provides end-to-end property analysis: standard mortgage amortization, latest regulatory purchase tax tiers, capitalization rate (Cap Rate) analytics, and multi-decade rent vs. buy financial models. Calculating total interest, transaction expenses, and capital appreciation ensures you invest with confidence.",
      es: "La compra de vivienda requiere un análisis exhaustivo. Nuestras herramientas calculan cuotas hipotecarias, impuestos vigentes y la rentabilidad neta de tus inversiones.",
      fr: "L'investissement immobilier demande une précision sans faille. Calculez vos mensualités, frais d'acquisition et rentabilités locatives en toute simplicité.",
      ar: "شراء العقارات يتطلب تخطيطاً دقيقاً. تتيح حاسباتنا العقارية تقدير الأقساط الشهرية، الضرائب، والعائد الاستثماري لمساعدتك في اتخاذ القرار الأمثل.",
    },
    keyBenefits: {
      he: [
        "מדרגות מס רכישה מעודכנות לפי הנחיות רשות המסים",
        "סימולציית לוח שפיצר מלאה עד 30 שנה עם גרף פריסה",
        "בדיקת יכולת החזר והגבלות בנק ישראל (עד 50% יחס החזר)",
        "השוואת תשואת נדל״ן מול השקעה במדדי שוק ההון"
      ],
      en: [
        "Updated regulatory property tax brackets and deductions",
        "Full 30-year Spitzer amortization schedule with visual breakdown",
        "Debt-to-income and loan-to-value (LTV) affordability compliance",
        "Direct real estate ROI vs. stock index fund compounding comparisons"
      ]
    },
    recommendedWorkflow: {
      he: "בדקו תחילה את 'מחשבון יכולת החזר משכנתא' לקביעת תקציב היעד, המשיכו ל'מחשבון מס רכישה' לחישוב עלויות העסקה, והשוו ב'מחשבון שכירות מול קנייה'.",
      en: "Recommended workflow: Check Mortgage Affordability to establish your budget ceiling, compute closing taxes with the Purchase Tax Calculator, and compare long-term wealth in Rent vs. Buy."
    },
    expertQuote: {
      he: "״ההבדל בין משכנתא טובה למשכנתא לא מתאימה יכול להסתכם במאות אלפי שקלים של ריביות מיותרות.״",
      en: "\"The difference between an optimized mortgage structure and a generic loan can easily exceed tens of thousands in avoided interest.\""
    }
  },
  health: {
    title: {
      he: "מחשבוני בריאות, הריון ופיזיולוגיה",
      en: "Health, Pregnancy & Physiological Calculators",
      es: "Calculadoras de Salud, Embarazo y Bienestar",
      fr: "Calculatrices de Santé, Grossesse et Métabolisme",
      ar: "حاسبات الصحة، الحمل والأيض",
    },
    subtitle: {
      he: "מעקב שבועות הריון, מדדי BMI לפי ארגון הבריאות העולמי, שריפת קלוריות BMR/TDEE וצריכת מים יומית.",
      en: "Clinical pregnancy tracking, WHO BMI classifications, Mifflin-St Jeor metabolic expenditure, and optimal hydration.",
      es: "Seguimiento de embarazo, índice de masa corporal según la OMS, gasto calórico TMB y consumo de agua.",
      fr: "Suivi de grossesse, classification IMC OMS, calcul du métabolisme de base et hydratation quotidienne.",
      ar: "متابعة أسابيع الحمل، مؤشر كتلة الجسم، السعرات الحرارية اليومية واستهلاك الماء المثالي.",
    },
    introText: {
      he: "שמירה על אורח חיים בריא ומעקב קליני מבוססים על מדדים פיזיולוגיים מוכחים. מחשבוני הבריאות באתר מבוססים על פרוטוקולים בינלאומיים של ארגון הבריאות העולמי (WHO), איגוד הגינקולוגים האמריקאי (ACOG) ומשוואות חילוף חומרים מתקדמות דוגמת Mifflin-St Jeor. בין אם את עוקבת אחר התפתחות העובר ותאריך הלידה המשוער, מנטר את מדד מסת הגוף (BMI) ויעד המשקל התקין, או מחשב את הוצאת האנרגיה היומית (TDEE) לתפריט חיטוב או מסה – הכלים מספקים תובנות מדעיות ברורות ומובנות.",
      en: "Evidence-based wellness requires scientifically grounded physiological calculations. GlobalCalc Pro health tools implement clinical standards from the World Health Organization (WHO), American College of Obstetricians and Gynecologists (ACOG), and Mifflin-St Jeor metabolic equations. From gestational milestone tracking and target hydration to body composition indices, calculate your health metrics with clinical accuracy.",
      es: "El bienestar óptimo se basa en datos científicos contrastados. Nuestras calculadoras de salud implementan protocolos oficiales de la OMS y fórmulas metabólicas estándar.",
      fr: "La santé au quotidien s'appuie sur des indicateurs scientifiques fiables. Découvrez nos simulateurs validés selon les critères médicaux internationaux.",
      ar: "الحفاظ على الصحة السليمة يبدأ من القياسات الدقيقة. تعتمد حاسباتنا الصحية على معايير منظمة الصحة العالمية والبروتوكولات الطبية المعتمدة.",
    },
    keyBenefits: {
      he: [
        "סיווג BMI רשמי לפי טבלאות ארגון הבריאות העולמי (WHO)",
        "חישוב שבועות הריון ותאריך לידה לפי כלל נייגלה (Naegele's Rule)",
        "הערכת צריכת קלוריות יומית (TDEE) לפי רמת פעילות גופנית",
        "מחשבון צריכת מים מותאם משקל ומאמץ גופני"
      ],
      en: [
        "Official WHO Body Mass Index risk strata and target healthy weights",
        "Clinical gestational age and EDD calculation via Naegele's rule",
        "Mifflin-St Jeor Basal Metabolic Rate (BMR) and TDEE estimation",
        "Personalized daily hydration volume based on body mass and activity"
      ]
    },
    recommendedWorkflow: {
      he: "מומלץ לבדוק את מחשבון ה-BMI לקבלת תמונת מצב ראשונית, לעבור למחשבון BMR לקביעת תפריט קלורי יומי, ולהשתמש במחשבון צריכת מים לשמירה על הידרציה מיטבית.",
      en: "Recommended workflow: Check BMI for overall body mass classification, calculate daily caloric balance with BMR/TDEE, and ensure optimal hydration with the Water Intake Calculator."
    },
    expertQuote: {
      he: "״גוף האדם הוא המכונה המתוחכמת ביותר בעולם – ניהול מושכל של תזונה, שינה ומים הוא המפתח לאריכות ימים.״",
      en: "\"Tracking baseline metabolic and physiological indicators is the foundational step toward sustainable health and longevity.\""
    }
  },
  math: {
    title: {
      he: "מחשבוני מתמטיקה, אחוזים והמרות",
      en: "Mathematics, Percentages & Unit Conversion",
      es: "Calculadoras Matemáticas, Porcentajes y Conversión",
      fr: "Calculatrices Mathématiques, Pourcentages et Conversions",
      ar: "حاسبات الرياضيات، النسب المئوية والتحويلات",
    },
    subtitle: {
      he: "חישוב הנחות ואחוזים, המרת יחידות מידה מטריות ואימפריאליות, משוואות ריבועיות ואלגברה.",
      en: "Instant percentage calculations, metric/imperial unit conversions, quadratic solver, and matrix algebra.",
      es: "Cálculos instantáneos de porcentajes, descuentos, conversiones métricas y álgebra.",
      fr: "Calculs rapides de pourcentages, remises, conversion d'unités et résolutions d'équations.",
      ar: "حساب سريع للنسب المئوية والخصومات، تحويل الوحدات القياسية، وحل المعادلات الرياضية.",
    },
    introText: {
      he: "מתמטיקה יומיומית מקיפה אותנו בכל פעולה – החל מחישוב הנחות בקניות ועד לחישוב שינוי באחוזים, המרת יחידות משקל ומרחק, או פתרון משוואות מדעיות מורכבות. מחשבוני המתמטיקה של האתר מבצעים את כל הפעולות באופן מיידי עם פירוט דרך החישוב והסבר מנטלי מהיר. בעזרת מנוע Decimal.js המונע סטיות נקודה עשרונית, תוכלו ליהנות מתוצאות מדויקות ואמינות לכל צורך לימודי, עסקי או יומיומי.",
      en: "Mathematical precision is essential for daily commerce, scientific modeling, and education. GlobalCalc Pro math tools provide instant solutions with step-by-step formula breakdowns. Powered by arbitrary-precision arithmetic engines, our converters and algebraic solvers eliminate rounding errors across all dimensions.",
      es: "Herramientas matemáticas rápidas y exactas para calcular porcentajes, convertir unidades y resolver ecuaciones complejas con facilidad.",
      fr: "Des outils mathématiques précis pour calculer vos remises, convertir des unités de mesure et résoudre des problèmes algébriques.",
      ar: "حلول رياضية فورية ودقيقة لحساب النسب المئوية، تحويل الوحدات، وحل المعادلات الهندسية والجبرية بسهولة.",
    },
    keyBenefits: {
      he: [
        "מחשבון אחוזים רב-מצבי: הנחות, תוספות, שינוי באחוזים וחלוקה",
        "המרת יחידות מידה: אורך, משקל, טמפרטורה, נפח ושטח",
        "פתרון משוואות ריבועיות ומערכות לינאריות עם פירוט שלבים",
        "העתקה ושיתוף תוצאות בלחיצת כפתור אחת"
      ],
      en: [
        "Multi-modal percentage engine: discounts, growth, ratio, and reverse percent",
        "Comprehensive unit converter: length, mass, temperature, volume, and area",
        "Quadratic and linear system equation solvers with step-by-step proofs",
        "Instant one-click copy and share functionality"
      ]
    },
    recommendedWorkflow: {
      he: "השתמשו במחשבון האחוזים לחישוב הנחות ומבצעים, במחשבון המע״מ לחישוב מחיר לפני ואחרי מס, ובממיר היחידות לכל מעבר בין שיטה מטרית לאימפריאלית.",
      en: "Use Percentage Finder for instant shopping discounts, VAT Calculator for net/gross pricing, and Unit Converter for cross-system engineering standards."
    },
    expertQuote: {
      he: "״מתמטיקה היא השפה שבה נכתב היקום.״ — גלילאו גליליי",
      en: "\"Mathematics is the language in which the universe is written.\" — Galileo Galilei"
    }
  },
  tech: {
    title: {
      he: "מחשבוני טכנולוגיה, רשתות והנדסה",
      en: "Technology, Bandwidth & Engineering Calculators",
      es: "Calculadoras de Tecnología, Redes e Ingeniería",
      fr: "Calculatrices Technologiques, Réseaux et Ingénierie",
      ar: "حاسبات التكنولوجيا، الشبكات والهندسة",
    },
    subtitle: {
      he: "זמני הורדה ורוחב פס, ממירי בסיסים בינאריים/הקסדצימליים, אלגברה בינארית וקירור תרמואלקטרי.",
      en: "Download time benchmarks, binary/hex conversions, bitwise logic operations, and Peltier cooling models.",
      es: "Cálculo de tiempos de descarga, conversión binaria/hexadecimal y lógica digital.",
      fr: "Estimation des temps de téléchargement, conversion binaire/hexadécimale et physique thermique.",
      ar: "حساب سرعة ووقت التحميل، تحويل الأنظمة الثنائية والست عشرية، وتطبيقات الهندسة الإلكترونية.",
    },
    introText: {
      he: "בעולם הדיגיטלי והטכנולוגי, מהנדסים, מפתחי תוכנה ואנשי IT זקוקים לכלים מהירים ומדויקים לחישובי רוחב פס, זמני העברת קבצים, והמרות בין בסיסי ספירה בינאריים (Binary), הקסדצימליים (Hex) ואוקטליים. מחשבוני הטכנולוגיה של GlobalCalc Pro כוללים גם מודלים תרמודינמיים מתקדמים כגון מחשבון קירור פלטייה (Peltier Element) ואלגוריתמים לבדיקת פעולות Bitwise, ומאפשרים לתכנן מערכות חומרה ותוכנה ביעילות מרבית.",
      en: "Software engineers, network architects, and electronics designers require fast, deterministic computation. GlobalCalc Pro engineering tools cover network throughput, binary and hexadecimal base translations, bitwise logic operators, and thermoelectric Peltier cooling dynamics.",
      es: "Herramientas de ingeniería y software para calcular transferencias de datos, lógica binaria y modelos termoeléctricos.",
      fr: "Simulateurs dédiés aux ingénieurs et développeurs pour les débits réseaux, la logique binaire et les conversions de bases.",
      ar: "أدوات مخصصة للمطورين ومهندسي الشبكات لحساب سرعات النقل، العمليات الثنائية، والأنظمة الرقمية بدقة عالية.",
    },
    keyBenefits: {
      he: [
        "חישוב זמני הורדה והעלאה מדויקים לפי מהירות רוחב פס אמיתית",
        "ממיר בסיסים מיידי: Binary, Hex, Octal, Decimal",
        "מחשבון פעולות ביטים (Bitwise Operations: AND, OR, XOR, NOT, Shift)",
        "סימולטור פיזיקלי לקירור תרמואלקטרי (Peltier Module)"
      ],
      en: [
        "Accurate file transfer download estimation factoring protocol overhead",
        "Multi-base radix converter: Binary, Hex, Octal, and Decimal",
        "Bitwise operations simulator (AND, OR, XOR, NOT, Bit-shifts)",
        "Thermoelectric Peltier module cooling coefficient simulation"
      ]
    },
    recommendedWorkflow: {
      he: "השתמשו במחשבון זמני ההורדה להערכת גיבויים והעברת נתונים בענן, ובממיר הבסיסים לניפוח שגיאות ופיתוח תוכנה ברמת ה-Low-Level.",
      en: "Utilize Download Time to model cloud backup transfer windows, and Base Converter for low-level protocol development."
    },
    expertQuote: {
      he: "״קיימים 10 סוגי אנשים בעולם: אלו שמבינים בינארית, ואלו שלא.״",
      en: "\"There are only 10 types of people in the world: those who understand binary, and those who don't.\""
    }
  },
  lifestyle: {
    title: {
      he: "מחשבוני לייפסטייל, יום-יום ואירוח",
      en: "Lifestyle, Everyday & Dining Calculators",
      es: "Calculadoras de Estilo de Vida y Uso Diario",
      fr: "Calculatrices Quotidiennes et Art de Vivre",
      ar: "حاسبات الحياة اليومية والضيافة",
    },
    subtitle: {
      he: "חישוב טיפ ופיצול חשבון במסעדות, חישוב גיל מדויק, מחשבון שינה ומחזורי מנוחה, ומחשבון דלק לנסיעות.",
      en: "Restaurant tip & bill split, exact age & milestone tracker, sleep sleep-cycle optimizer, and road trip fuel cost.",
      es: "División de cuentas y propinas, cálculo de edad exacta, ciclos de sueño y consumo de combustible.",
      fr: "Partage d'addition et pourboires, calcul d'âge exact, cycles de sommeil et budget carburant.",
      ar: "تقسيم فواتير المطاعم والإكراميات، حساب العمر الدقيق، دورات النوم، ومصاريف الوقود للرحلات.",
    },
    introText: {
      he: "ניהול משימות היום-יום וההוצאות המשותפות הופך לפשוט ונעים בעזרת מחשבוני הלייפסטייל של האתר. בין אם אתם יושבים במסעדה עם חברים וצריכים לחשב טיפ ולפצל את החשבון בצורה הוגנת, מתכננים נסיעה ארוכה ורוצים לחלק את עלויות הדלק והאגרות, רוצים לחשב את גילכם המדויק בשנים, חודשים וימים, או לתכנן שעת שינה מושלמת לפי מחזורי שינה (Sleep Cycles) של 90 דקות – הכלים שלנו מותאמים לשימוש מהיר ואינטואיטיבי מהטלפון הנייד.",
      en: "Daily tasks and shared social expenses are seamless with GlobalCalc Pro lifestyle utilities. Calculate fair dining tips and split checks among friends, estimate road trip fuel allocations, compute precise chronological age down to days and hours, or plan sleep schedules based on 90-minute REM cycles for refreshed mornings.",
      es: "Facilita tu día a día con herramientas para dividir gastos de restaurantes, calcular combustible, conocer tu edad exacta y optimizar tus ciclos de sueño.",
      fr: "Optimisez votre quotidien : partagez facilement les additions, suivez vos cycles de sommeil et calculez vos dépenses de trajet entre amis.",
      ar: "أدوات مريحة وسريعة لتسهيل حياتك اليومية: تقسيم مصاريف السفر والمطاعم، حساب دورات النوم المثالية، وتتبع العمر الدقيق.",
    },
    keyBenefits: {
      he: [
        "מחשבון טיפ ופיצול חשבון כולל תוספת שירות ומספר סועדים",
        "מחשבון שינה מדעי לפי מחזורי REM של 90 דקות ליקיצה רעננה",
        "מחשבון פיצול דלק ונסיעות שיתופיות לפי מחיר לליטר ומרחק",
        "מחשבון גיל מדויק עם ימי הולדת ואבני דרך היסטוריות"
      ],
      en: [
        "Dynamic restaurant gratuity and per-person split calculator",
        "REM 90-minute sleep cycle scheduler for optimal waking alertness",
        "Shared ride fuel expense division by mileage, consumption, and passenger count",
        "Exact chronological age calculator with upcoming milestone countdowns"
      ]
    },
    recommendedWorkflow: {
      he: "פתחו את מחשבון הטיפ בסיום ארוחה משותפת לחלוקה מהירה, והשתמשו במחשבון השינה לפני השינה לקביעת שעת היקיצה האופטימלית.",
      en: "Use Tip Calculator at dinner for effortless tab splitting, and consult Sleep Calculator before bedtime for optimal alarm scheduling."
    },
    expertQuote: {
      he: "״ההצלחה בחיים נבנית מהרגלים קטנים ומדויקים שאנו מיישמים בכל יום.״",
      en: "\"Quality of life improves dramatically through small, optimized daily decisions.\""
    }
  }
};
