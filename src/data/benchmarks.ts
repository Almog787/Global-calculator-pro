export interface BenchmarkRow {
  label: string;
  col1: string;
  col2: string;
  col3: string;
  col4?: string;
  preset?: Record<string, number | string>;
}

export interface CaseStudyData {
  title: Record<string, string>;
  scenario: Record<string, string>;
  calculations: Record<string, string[]>;
  takeaway: Record<string, string>;
  preset?: Record<string, number | string>;
}

export interface FormulaBreakdownData {
  name: Record<string, string>;
  formula: string;
  variables: Record<string, string[]>;
  stepExample?: Record<string, string[]>;
}

export interface BenchmarkData {
  category?: 'finance' | 'health' | 'math' | 'lifestyle' | 'real-estate' | 'tech';
  title: Record<string, string>;
  description: Record<string, string>;
  directAnswer?: Record<string, string>; // Concise AI Answer & Featured Snippet extract
  headers: Record<string, string[]>;
  rows: BenchmarkRow[];
  expertTip?: Record<string, string>;
  caseStudy?: CaseStudyData;
  formulaBreakdown?: FormulaBreakdownData;
}

export const benchmarkTables: Record<string, BenchmarkData> = {
  mortgage: {
    category: 'finance',
    title: {
      en: "Mortgage Payment Benchmarks (30-Year Fixed at 6.5%)",
      he: "טבלת השוואת החזר משכנתא לדוגמה (30 שנה בריבית 6.5%)",
      es: "Tabla de Pagos de Hipoteca (30 años al 6.5%)",
      fr: "Exemples de Mensualités Hypothécaires (30 ans à 6,5%)",
      ar: "جدول مقارنة دفعات الرهن العقاري (30 عاماً بفائدة 6.5%)",
    },
    description: {
      en: "Estimated monthly principal and interest payments and total lifetime interest across common loan amounts.",
      he: "החזר חודשי משוער וסך ריבית מצטברת לאורך חיי ההלוואה בסכומי משכנתא נפוצים.",
      es: "Pagos mensuales estimados e interés total para montos de préstamos comunes.",
      fr: "Estimation des mensualités et du coût total des intérêts selon le montant du prêt.",
      ar: "تقدير الدفعات الشهرية وإجمالي الفائدة لمبالغ القروض الشائعة.",
    },
    directAnswer: {
      en: "On a standard 30-year fixed mortgage at 6.5% interest rate, the monthly payment is approximately $6.32 per $1,000 borrowed (or ₪6,321/month per ₪1,000,000 borrowed). Total interest over 30 years typically exceeds 127% of the original principal amount.",
      he: "במשכנתא סטנדרטית בריבית שנתית של 6.5% ל-30 שנה, ההחזר החודשי עומד על כ-6,321 ₪ לכל 1,000,000 ₪ הלוואה. סך הריבית המצטברת לאורך 30 שנה עומד על כ-1,275,445 ₪ (יותר מ-127% מסכום הקרן המקורי).",
      es: "En una hipoteca fija a 30 años al 6.5% de interés, la cuota mensual es de unos $6.32 por cada $1,000 prestados. El interés total acumulado supera el 127% del capital original.",
      fr: "Pour un prêt immobilier sur 30 ans à un taux de 6,5 %, la mensualité est d'environ 6,32 € par tranche de 1 000 € empruntés. Le coût total des intérêts dépasse 127 % du capital initial.",
      ar: "في رهن عقاري قياسي مدته 30 عاماً بفائدة 6.5%، تبلغ الدفعة الشهرية حوالي 6.32 دولار لكل 1000 دولار مقترض. ويتجاوز إجمالي الفائدة المدفوعة 127% من أصل القرض.",
    },
    headers: {
      en: ["Loan Amount", "Monthly Payment", "Total Interest", "Total Cost"],
      he: ["סכום ההלוואה", "החזר חודשי", "סך ריבית לתשלום", "עלות כוללת"],
      es: ["Monto del Préstamo", "Pago Mensual", "Total de Intereses", "Costo Total"],
      fr: ["Montant du Prêt", "Mensualité", "Total des Intérêts", "Coût Total"],
      ar: ["مبلغ القرض", "الدفعة الشهرية", "إجمالي الفائدة", "التكلفة الإجمالية"],
    },
    rows: [
      { label: "$250,000 / ₪1,000,000", col1: "$1,580 / ₪6,321", col2: "$318,861 / ₪1,275,444", col3: "$568,861 / ₪2,275,444", preset: { principal: 250000, rate: 6.5, years: 30 } },
      { label: "$400,000 / ₪1,500,000", col1: "$2,528 / ₪9,481", col2: "$510,178 / ₪1,913,166", col3: "$910,178 / ₪3,413,166", preset: { principal: 400000, rate: 6.5, years: 30 } },
      { label: "$600,000 / ₪2,000,000", col1: "$3,792 / ₪12,641", col2: "$765,267 / ₪2,550,888", col3: "$1,365,267 / ₪4,550,888", preset: { principal: 600000, rate: 6.5, years: 30 } },
      { label: "$800,000 / ₪2,500,000", col1: "$5,057 / ₪15,802", col2: "$1,020,356 / ₪3,188,610", col3: "$1,820,356 / ₪5,688,610", preset: { principal: 800000, rate: 6.5, years: 30 } },
      { label: "$1,000,000 / ₪3,000,000", col1: "$6,321 / ₪18,962", col2: "$1,275,445 / ₪3,826,332", col3: "$2,275,445 / ₪6,826,332", preset: { principal: 1000000, rate: 6.5, years: 30 } },
    ],
    expertTip: {
      en: "Pro Tip: Adding just one extra monthly payment per year can shorten a 30-year mortgage by 4 to 6 years and save tens of thousands in total interest.",
      he: "טיפ מומחה: פירעון מוקדם של תשלום חודשי אחד נוסף בשנה יכול לקצר משכנתא של 30 שנה ב-4 עד 6 שנים ולחסוך עשרות אלפי שקלים בריביות.",
      es: "Consejo: Hacer un pago adicional al año puede reducir una hipoteca de 30 años entre 4 y 6 años y ahorrar miles en intereses.",
      fr: "Conseil Pro : Effectuer un remboursement anticipé équivalent à une mensualité par an permet de raccourcir votre prêt de 4 à 6 ans.",
      ar: "نصيحة الخبراء: سداد دفعة شهرية إضافية واحدة سنوياً يمكن أن يقلل مدة القرض بمقدار 4 إلى 6 سنوات ويوفر آلاف الدولارات من الفوائد.",
    },
    caseStudy: {
      title: {
        en: "Realistic Case Study: 25-Year vs 30-Year Loan Comparison",
        he: "תרחיש לדוגמה מהחיים: נטילת משכנתא של 1,200,000 ₪ – 25 שנה מול 30 שנה",
        es: "Caso Práctico: Hipoteca de $300,000 – 25 vs 30 años",
        fr: "Étude de Cas Réelle : Prêt de 300 000 € sur 25 ans vs 30 ans",
        ar: "دراسة حالة واقعية: قرض عقاري بقيمة 1,200,000 – مقارنة 25 سنة مقابل 30 سنة",
      },
      scenario: {
        en: "Borrowing $300,000 (₪1,200,000) at a 4.5% fixed interest rate. Should the borrower choose a 25-year or a 30-year amortization schedule?",
        he: "משפחה נוטלת משכנתא בסך 1,200,000 ₪ בריבית קבועה של 4.5%. מה ההבדל האמיתי בין פריסה ל-25 שנה לבין פריסה ל-30 שנה?",
        es: "Préstamo de $300,000 al 4.5% de interés. Comparativa directa entre 25 y 30 años de amortización.",
        fr: "Emprunt de 300 000 € à 4,5 % d'intérêt. Comparaison entre 25 et 30 ans d'amortissement.",
        ar: "اقتراض مبلغ 1,200,000 بفائدة سنوية 4.5%. ما الفارق المالي بين السداد على 25 سنة مقابل 30 سنة؟",
      },
      calculations: {
        he: [
          "מסלול ל-25 שנה (300 חודשים): החזר חודשי של 6,670 ₪ | סך ריבית לתשלום: 801,000 ₪ | עלות כוללת: 2,001,000 ₪.",
          "מסלול ל-30 שנה (360 חודשים): החזר חודשי של 6,080 ₪ | סך ריבית לתשלום: 988,800 ₪ | עלות כוללת: 2,188,800 ₪.",
          "פער ההחזר החודשי: תוספת של 590 ₪ בלבד לחודש במסלול ה-25 שנה.",
          "חיסכון מצטבר כולל: 187,800 ₪ חיסכון נקי בריביות + סיום מוקדם ב-5 שנים מלאות!"
        ],
        en: [
          "25-Year Schedule (300 mos): Monthly payment $1,668 | Total Interest: $200,260 | Total Cost: $500,260.",
          "30-Year Schedule (360 mos): Monthly payment $1,520 | Total Interest: $247,220 | Total Cost: $547,220.",
          "Monthly difference: Only $148 extra per month for the 25-year term.",
          "Total Net Savings: $46,960 in pure interest saved + debt-free 5 years sooner!"
        ],
        es: [
          "Plazo a 25 años: Cuota mensual $1,668 | Interés total: $200,260 | Coste total: $500,260.",
          "Plazo a 30 años: Cuota mensual $1,520 | Interés total: $247,220 | Coste total: $547,220.",
          "Ahorro total neto: $46,960 en intereses y libertad financiera 5 años antes.",
        ],
        fr: [
          "Prêt sur 25 ans : Mensualité 1 668 € | Intérêts totaux : 200 260 € | Coût total : 500 260 €.",
          "Prêt sur 30 ans : Mensualité 1 520 € | Intérêts totaux : 247 220 € | Coût total : 547 220 €.",
          "Économie totale : 46 960 € d'intérêts économisés et 5 ans d'endettement en moins.",
        ],
        ar: [
          "خطة 25 سنة: القسط الشهري 6,670 | إجمالي الفائدة: 801,000 | التكلفة الإجمالية: 2,001,000.",
          "خطة 30 سنة: القسط الشهري 6,080 | إجمالي الفائدة: 988,800 | التكلفة الإجمالية: 2,188,800.",
          "التوفير الصافي: توفير 187,800 من الفوائد والتخلص من القرض قبل 5 سنوات كاملة.",
        ]
      },
      takeaway: {
        en: "Key Insight: Opting for a 25-year term increases the monthly obligation by less than 10%, but slashes almost 20% off total lifetime interest charges.",
        he: "מסקנה פרקטית: העלאת ההחזר החודשי בכ-9.7% בלבד חוסכת כמעט 190,000 ₪ ומקצרת 60 תשלומי משכנתא שלמים.",
        es: "Conclusión: Pagar un 10% más al mes reduce los intereses globales en un 20% y elimina 5 años de deuda.",
        fr: "Conclusion : Augmenter la mensualité de seulement 10% permet de réduire les intérêts de 20% et de gagner 5 ans.",
        ar: "الخلاصة: زيادة القسط الشهري بنسبة 10% فقط توفر قرابة 20% من الفائدة الإجمالية وتختصر 5 سنوات كاملة من الديون.",
      },
      preset: { principal: 1200000, rate: 4.5, years: 25 }
    },
    formulaBreakdown: {
      name: {
        en: "Standard Amortization Formula (Spitzer Schedule)",
        he: "נוסחת שפיצר לחישוב החזר חודשי ולוח סילוקין",
        es: "Fórmula de Amortización Francesa (Spitzer)",
        fr: "Formule d'Amortissement Constant (Tableau Spitzer)",
        ar: "معادلة شبيتزر لحساب القسط الشهري وجدول الاستهلاك",
      },
      formula: "M = P · [ r(1 + r)^n ] / [ (1 + r)^n - 1 ]",
      variables: {
        he: [
          "M = סכום ההחזר החודשי הקבוע (Monthly Payment)",
          "P = סכום קרן ההלוואה המקורית (Principal Loan Amount)",
          "r = שיעור הריבית החודשית (שיעור ריבית שנתי באחוזים ÷ 100 ÷ 12)",
          "n = מספר התשלומים הכולל לאורך תקופת ההלוואה (שנים × 12 חודשים)"
        ],
        en: [
          "M = Fixed monthly mortgage payment",
          "P = Principal loan amount borrowed",
          "r = Monthly interest rate (Annual rate ÷ 100 ÷ 12)",
          "n = Total number of monthly payments (Loan term in years × 12)"
        ],
        es: [
          "M = Cuota mensual fija",
          "P = Monto del capital prestado",
          "r = Tasa de interés mensual (Tasa anual ÷ 100 ÷ 12)",
          "n = Número total de cuotas (Años × 12)"
        ],
        fr: [
          "M = Mensualité constante",
          "P = Montant du capital emprunté",
          "r = Taux d'intérêt mensuel (Taux annuel ÷ 100 ÷ 12)",
          "n = Nombre total de mensualités (Années × 12)"
        ],
        ar: [
          "M = القسط الشهري الثابت",
          "P = أصل مبلغ القرض",
          "r = معدل الفائدة الشهري (الفائدة السنوية ÷ 100 ÷ 12)",
          "n = إجمالي عدد الدفعات الشهرية (السنوات × 12)"
        ]
      },
      stepExample: {
        he: [
          "שלב 1: המרת הריבית לחודשית: r = 4.5% ÷ 12 = 0.00375",
          "שלב 2: חישוב מספר חודשים: n = 25 × 12 = 300 חודשים",
          "שלב 3: חישוב מקדם הריבית: (1 + 0.00375)^300 = 3.0694",
          "שלב 4: הכפלת הקרן במקדם וחילוק: 1,200,000 × (0.00375 × 3.0694) ÷ (3.0694 - 1) = 6,670 ₪ בחודש"
        ],
        en: [
          "Step 1: Convert annual rate to monthly: r = 4.5% ÷ 12 = 0.00375",
          "Step 2: Calculate total payment periods: n = 25 × 12 = 300 months",
          "Step 3: Compute compound multiplier: (1 + 0.00375)^300 = 3.0694",
          "Step 4: Solve for M: $300,000 × (0.00375 × 3.0694) ÷ (3.0694 - 1) = $1,668/month"
        ]
      }
    }
  },
  compound: {
    category: 'finance',
    title: {
      en: "Compound Interest Growth Benchmarks (8% Annual Return)",
      he: "טבלת צמיחת ריבית דריבית לדוגמה (תשואה שנתית 8%)",
      es: "Proyección de Interés Compuesto (8% Retorno Anual)",
      fr: "Croissance des Intérêts Composés (8% de Rendement Annuel)",
      ar: "مقارنة نمو الفائدة المركبة (عائد سنوي 8%)",
    },
    description: {
      en: "See how regular monthly contributions accumulate and multiply over 10, 20, and 30 years.",
      he: "כיצד הפקדה חודשית קבועה צומחת ומכפילה את עצמה לאורך 10, 20 ו-30 שנה בזכות כוח הריבית דריבית.",
      es: "Mira cómo crecen las contribuciones mensuales a lo largo de 10, 20 y 30 años.",
      fr: "Découvrez la croissance de versements mensuels réguliers sur 10, 20 et 30 ans.",
      ar: "شاهد كيف تتضاعف الإيداعات الشهرية المنتظمة على مدار 10 و20 و30 عاماً.",
    },
    directAnswer: {
      en: "With an average annual return of 8%, investing $500 (₪2,000) per month grows to $91,473 (₪365,900) after 10 years, $294,510 (₪1,178,040) after 20 years, and reaches $745,180 (₪2,980,720) in 30 years.",
      he: "בתשואה שנתית ממוצעת של 8%, הפקדה קבועה של 2,000 ₪ בחודש מגיעה לכ-365,900 ₪ לאחר 10 שנים, לכ-1,178,040 ₪ לאחר 20 שנה, ולכ-2,980,720 ₪ לאחר 30 שנה (מתוכם מעל 2.2 מיליון ₪ רווחי ריבית נקיים).",
      es: "Con un rendimiento anual del 8%, invertir $500 al mes acumula $91,473 en 10 años, $294,510 en 20 años y alcanza $745,180 en 30 años.",
      fr: "Avec un rendement annuel moyen de 8 %, épargner 500 € par mois permet d'accumuler 91 473 € au bout de 10 ans, 294 510 € après 20 ans et 745 180 € après 30 ans.",
      ar: "بعائد سنوي قدره 8%، فإن استثمار 500 دولار شهرياً ينمو إلى 91,473 دولار بعد 10 سنوات، و294,510 دولار بعد 20 سنة، ويصل إلى 745,180 دولار خلال 30 عاماً.",
    },
    headers: {
      en: ["Monthly Deposit", "After 10 Years", "After 20 Years", "After 30 Years"],
      he: ["הפקדה חודשית", "לאחר 10 שנים", "לאחר 20 שנה", "לאחר 30 שנה"],
      es: ["Depósito Mensual", "A los 10 años", "A los 20 años", "A los 30 años"],
      fr: ["Versement Mensuel", "Après 10 ans", "Après 20 ans", "Après 30 ans"],
      ar: ["الإيداع الشهري", "بعد 10 سنوات", "بعد 20 سنة", "بعد 30 سنة"],
    },
    rows: [
      { label: "$100 / ₪400 /mo", col1: "$18,295 / ₪73,180", col2: "$58,902 / ₪235,608", col3: "$149,036 / ₪596,144", preset: { principal: 0, monthlyContribution: 100, annualRate: 8, years: 30 } },
      { label: "$250 / ₪1,000 /mo", col1: "$45,737 / ₪182,950", col2: "$147,255 / ₪589,020", col3: "$372,590 / ₪1,490,360", preset: { principal: 0, monthlyContribution: 250, annualRate: 8, years: 30 } },
      { label: "$500 / ₪2,000 /mo", col1: "$91,473 / ₪365,900", col2: "$294,510 / ₪1,178,040", col3: "$745,180 / ₪2,980,720", preset: { principal: 0, monthlyContribution: 500, annualRate: 8, years: 30 } },
      { label: "$1,000 / ₪4,000 /mo", col1: "$182,946 / ₪731,800", col2: "$589,020 / ₪2,356,080", col3: "$1,490,359 / ₪5,961,440", preset: { principal: 0, monthlyContribution: 1000, annualRate: 8, years: 30 } },
    ],
    expertTip: {
      en: "The Rule of 72: Divide 72 by your expected annual return rate to estimate how many years it will take for your money to double (e.g., 72 ÷ 8% = ~9 years).",
      he: "כלל ה-72: חלקו 72 באחוז התשואה השנתית כדי לחשב תוך כמה שנים הכסף שלכם יוכפל (למשל: 72 חלקי 8% תשואה = הכפלת ההון תוך כ-9 שנים).",
      es: "Regla del 72: Divide 72 entre tu tasa de interés para estimar en cuántos años se duplicará tu dinero (ej. 72 ÷ 8% = ~9 años).",
      fr: "Règle des 72 : Divisez 72 par le taux de rendement annuel pour estimer le nombre d'années nécessaires pour doubler votre capital.",
      ar: "قاعدة 72: اقسم 72 على نسبة العائد السنوي لتقدير عدد السنوات اللازمة لمضاعفة أموالك (مثال: 72 ÷ 8% = ~9 سنوات).",
    },
    caseStudy: {
      title: {
        en: "Realistic Case Study: The Exponential Power of 20-Year Consistent Investing",
        he: "תרחיש לדוגמה מהחיים: חיסכון חודשי של 1,500 ₪ בריבית 8% לאורך 20 שנה",
        es: "Caso Práctico: Ahorro mensual de $400 al 8% durante 20 años",
        fr: "Étude de Cas : Épargne mensuelle de 400 € à 8 % sur 20 ans",
        ar: "دراسة حالة واقعية: ادخار شهري بمبلغ 1,500 بفائدة 8% على مدى 20 عاماً",
      },
      scenario: {
        en: "An investor deposits $400 (₪1,500) per month starting with $10,000 (₪40,000) initial capital into an index fund averaging 8% annual return over 20 years.",
        he: "משקיע מתחיל עם הון ראשוני של 40,000 ₪ ומפקיד 1,500 ₪ מדי חודש בקרן מחקה מדד עם תשואה שנתית ממוצעת של 8% למשך 20 שנה.",
        es: "Un inversor aporta $400 al mes con un capital inicial de $10,000 y un rendimiento anual del 8% a 20 años.",
        fr: "Un épargnant place 400 €/mois avec 10 000 € d'apport initial à un rendement de 8% sur 20 ans.",
        ar: "مستثمر يبدأ برأس مال 40,000 ويدخر 1,500 شهرياً في صندوق استثماري بعائد 8% لمدة 20 سنة.",
      },
      calculations: {
        he: [
          "הון עצמי שהופקד בפועל: 40,000 ₪ הון התחלתי + 360,000 ₪ (1,500 ₪ × 240 חודשים) = 400,000 ₪ סך הפקדות מהכיס.",
          "סך השווי הסופי המצטבר (Future Value): כ-1,072,000 ₪.",
          "סך רווחי ריבית דריבית נקיים: כ-672,000 ₪ (168% תשואה על סך כל ההפקדות!).",
          "תרומת הזמן: בשנה ה-20 לבדה, תיק ההשקעות מייצר כ-80,000 ₪ בריבית שנתית – יותר מפי 4 מסך כל ההפקדות השנתיות."
        ],
        en: [
          "Total Money Deposited: $10,000 initial + $96,000 ($400 × 240 mos) = $106,000 total out-of-pocket.",
          "Final Accumulated Portfolio Value: ~$286,000.",
          "Compound Interest Profit Earned: ~$180,000 (Profits exceed contributions by 170%!).",
          "The Velocity of Compounding: In year 20 alone, annual interest gains generate over $21,000—more than 4x annual deposits."
        ],
        es: [
          "Total aportado: $10,000 inicial + $96,000 mensuales = $106,000.",
          "Valor final acumulado: ~$286,000.",
          "Intereses netos ganados: ~$180,000.",
        ],
        fr: [
          "Total versé : 10 000 € + 96 000 € = 106 000 €.",
          "Valeur finale atteinte : ~286 000 €.",
          "Gains d'intérêts nets : ~180 000 €.",
        ],
        ar: [
          "إجمالي المبالغ المدفوعة: 40,000 + 360,000 = 400,000.",
          "القيمة النهائية المتراكمة: 1,072,000.",
          "أرباح الفائدة المركبة: 672,000.",
        ]
      },
      takeaway: {
        en: "Key Insight: The compound interest curve is exponential. More than 62% of the entire final portfolio value is pure generated profit, not deposited capital.",
        he: "מסקנה פרקטית: כוח הריבית דריבית עובד בצורה מעריכית. יותר מ-62% מכלל ההון הסופי נוצר מרווחי ריבית ולא מכספי ההפקדה האישיים.",
        es: "Conclusión: Más del 62% del capital final son intereses generados, demostrando la importancia de empezar temprano.",
        fr: "Conclusion : Plus de 62 % de la somme finale provient des intérêts composés et non de vos versements.",
        ar: "الخلاصة: أكثر من 62% من رأس المال النهائي هو أرباح فوائد مركبة ناتجة عن عامل الزمن والاستمرارية.",
      },
      preset: { principal: 40000, monthlyContribution: 1500, annualRate: 8, years: 20 }
    },
    formulaBreakdown: {
      name: {
        en: "Future Value of Compound Interest with Regular Monthly Contributions",
        he: "נוסחת ריבית דריבית עם הפקדות חודשיות שוטפות",
        es: "Fórmula de Interés Compuesto con Aportaciones Mensuales",
        fr: "Formule des Intérêts Composés avec Versements Mensuels",
        ar: "معادلة الفائدة المركبة مع الإيداعات الشهرية المنتظمة",
      },
      formula: "FV = P(1 + r/n)^(n·t) + PMT · [ ((1 + r/n)^(n·t) - 1) / (r/n) ]",
      variables: {
        he: [
          "FV = שווי עתידי מצטבר כולל (Future Value)",
          "P = סכום השקעה ראשונית (Principal)",
          "PMT = סכום הפקדה חודשית קבועה (Monthly Contribution)",
          "r = שיעור תשואה שנתית באחוזים (Annual Interest Rate)",
          "n = תדירות החישוב בשנה (לחישוב חודשי n = 12)",
          "t = מספר השנים לצמיחת ההשקעה (Years)"
        ],
        en: [
          "FV = Total accumulated Future Value",
          "P = Initial investment principal",
          "PMT = Regular monthly payment / deposit",
          "r = Annual nominal interest rate (as a decimal)",
          "n = Compounding periods per year (n = 12 for monthly)",
          "t = Number of investment years"
        ]
      }
    }
  },
  bmi: {
    category: 'health',
    title: {
      en: "WHO Official Body Mass Index (BMI) Classifications",
      he: "טבלת מדדי BMI לפי ארגון הבריאות העולמי (WHO)",
      es: "Clasificación Oficial de IMC según la OMS",
      fr: "Classification Officielle de l'IMC selon l'OMS",
      ar: "تصنيفات مؤشر كتلة الجسم (BMI) الرسمية من منظمة الصحة العالمية",
    },
    description: {
      en: "Standard adult weight category cutoffs and associated health risk profiles.",
      he: "טווחי המשקל התקניים למבוגרים ופרופיל הסיכון הבריאותי הנלווה לכל קטגוריה.",
      es: "Rangos de peso estándar para adultos y riesgos para la salud asociados.",
      fr: "Intervalles de poids standards pour adultes et niveau de risque pour la santé.",
      ar: "الفئات القياسية للبالغين ومستوى المخاطر الصحية المرتبطة بها.",
    },
    directAnswer: {
      en: "A healthy, normal BMI for adults is between 18.5 and 24.9 kg/m². A score under 18.5 is considered underweight, 25.0–29.9 is overweight, and 30.0 or higher is classified as obesity.",
      he: "טווח ה-BMI התקין והבריא לאדם בוגר לפי ארגון הבריאות העולמי (WHO) נע בין 18.5 ל-24.9 ק\"ג/מ\"ר. מדד מתחת ל-18.5 מוגדר כתת-משקל, בין 25.0 ל-29.9 כעודף משקל, ומעל 30.0 כהשמנה.",
      es: "Un IMC saludable para adultos oscila entre 18.5 y 24.9 kg/m². Menos de 18.5 indica bajo peso, de 25.0 a 29.9 sobrepeso y 30.0 o más obesidad.",
      fr: "Un IMC sain pour un adulte se situe entre 18,5 et 24,9 kg/m². En dessous de 18,5 il s'agit d'une insuffisance pondérale, entre 25,0 et 29,9 d'un surpoids et à partir de 30 d'obésité.",
      ar: "يتراوح مؤشر كتلة الجسم (BMI) الصحي والطبيعي للبالغين بين 18.5 و 24.9 كغ/م². يُعتبر أقل من 18.5 نقصاً في الوزن، ومن 25 إلى 29.9 زيادة في الوزن، و30 فما فوق سمنة.",
    },
    headers: {
      en: ["Category", "BMI Range (kg/m²)", "Health Risk Level", "Recommended Action"],
      he: ["קטגוריה", "טווח BMI (ק\"ג/מ\"ר)", "רמת סיכון בריאותי", "המלצה"],
      es: ["Categoría", "Rango de IMC", "Nivel de Riesgo", "Acción Recomendada"],
      fr: ["Catégorie", "Indice IMC", "Niveau de Risque", "Recommandation"],
      ar: ["الفئة", "نطاق BMI", "مستوى الخطر الصحي", "الإجراء الموصى به"],
    },
    rows: [
      { label: "Underweight / תת-משקל", col1: "< 18.5", col2: "Elevated (Nutritional deficiency)", col3: "Consult nutritionist / בדיקת תזונה" },
      { label: "Normal Weight / משקל תקין", col1: "18.5 – 24.9", col2: "Lowest / נמוך ביותר", col3: "Maintain healthy habits / שמירה על שגרה" },
      { label: "Overweight / עודף משקל", col1: "25.0 – 29.9", col2: "Increased / מוגבר מעט", col3: "Moderate activity & balanced diet" },
      { label: "Obesity Class I / השמנה דרגה 1", col1: "30.0 – 34.9", col2: "High / גבוה", col3: "Lifestyle intervention / ייעוץ רפואי" },
      { label: "Obesity Class II+ / השמנה חמורה", col1: "≥ 35.0", col2: "Very High / גבוה מאוד", col3: "Medical guidance recommended" },
    ],
    expertTip: {
      en: "Note: BMI is a screening indicator and does not differentiate between muscle mass and fat tissue. Athletes and bodybuilders may have a high BMI while maintaining healthy body fat.",
      he: "שימו לב: BMI הוא מדד סטטיסטי שאינו מבדיל בין מסת שריר למסת שומן. ספורטאים בעלי מסת שריר מפותחת עשויים לקבל BMI גבוה על אף אחוז שומן נמוך.",
      es: "Nota: El IMC no distingue entre masa muscular y grasa. Atletas con alta musculatura pueden tener un IMC elevado siendo saludables.",
      fr: "Remarque : L'IMC ne fait pas la différence entre masse musculaire et masse grasse. Les athlètes peuvent avoir un IMC élevé tout en étant en parfaite santé.",
      ar: "ملاحظة: مؤشر كتلة الجسم لا يميز بين الكتلة العضلية والدهون، لذلك قد يحصل الرياضيون على مؤشر مرتفع مع تمتعهم بصحة ممتازة.",
    },
    caseStudy: {
      title: {
        en: "Realistic Case Study: Adult BMI & Ideal Weight Target Calculation",
        he: "תרחיש לדוגמה מהחיים: חישוב BMI ויעד משקל בריא לגבר בגובה 178 ס״מ",
        es: "Caso Práctico: Cálculo de IMC y peso ideal para altura de 178 cm",
        fr: "Étude de Cas : Calcul de l'IMC et du poids idéal pour 178 cm",
        ar: "دراسة حالة واقعية: حساب مؤشر كتلة الجسم والوزن المثالي لطول 178 سم",
      },
      scenario: {
        en: "A 32-year-old individual with a height of 178 cm (5'10\") weighs 88 kg (194 lbs). What is their current BMI, and how much weight should they lose to enter the normal range?",
        he: "גבר בן 32 בגובה 178 ס״מ שוקל כיום 88 ק״ג. מהו מדד ה-BMI שלו, וכמה קילוגרמים עליו להפחית כדי להגיע לטווח משקל תקין ובריא?",
        es: "Una persona de 178 cm y 88 kg busca conocer su IMC y cuántos kilos necesita reducir para llegar a su peso óptimo.",
        fr: "Une personne mesurant 178 cm et pesant 88 kg souhaite connaître son IMC et le poids à perdre pour atteindre la zone normale.",
        ar: "شخص طوله 178 سم ووزنه الحالي 88 كغ. ما هو مؤشر كتلته وكم كيلوغراماً يحتاج لإنقاصه للوصول للوزن الطبيعي؟",
      },
      calculations: {
        he: [
          "חישוב גובה בריבוע: 1.78 מטר × 1.78 מטר = 3.1684 מ\"ר.",
          "חישוב מדד BMI נוכחי: 88 ק\"ג ÷ 3.1684 = 27.77 ק\"ג/מ\"ר (מוגדר כ-עודף משקל / Overweight).",
          "משקל תקין עליון (BMI 24.9): 24.9 × 3.1684 = 78.89 ק\"ג.",
          "טווח משקל יעד תקין (BMI 18.5 עד 24.9): 58.6 ק\"ג עד 78.9 ק\"ג.",
          "הפחתת משקל נדרשת להגעה לטווח הבריא: כ-9.1 ק\"ג."
        ],
        en: [
          "Height squared: 1.78 m × 1.78 m = 3.1684 m².",
          "Current BMI: 88 kg ÷ 3.1684 = 27.77 kg/m² (Overweight Category).",
          "Upper Normal Weight Cutoff (BMI 24.9): 24.9 × 3.1684 = 78.89 kg.",
          "Target Weight Reduction: 88 kg - 78.9 kg = ~9.1 kg (20 lbs) to reach normal category."
        ]
      },
      takeaway: {
        en: "Clinical Insight: A gradual weight reduction of 0.5 to 1 kg per week over 3–4 months is the safest and most sustainable approach to reaching the normal BMI range.",
        he: "מסקנה קלינית: ירידה הדרגתית ומבוקרת של 0.5 עד 1 ק\"ג בשבוע על פני 3-4 חודשים היא הדרך הבריאה והיציבה ביותר להשגת טווח ה-BMI התקין.",
        es: "Conclusión: Una pérdida gradual de 0.5 a 1 kg por semana es la vía recomendada para alcanzar el peso saludable.",
        fr: "Conclusion : Une perte de poids progressive de 0,5 à 1 kg par semaine permet d'atteindre durablement la zone normale.",
        ar: "الخلاصة: فقدان الوزن التدريجي بمعدل 0.5 إلى 1 كغ أسبوعياً هو المسار الأكثر أماناً واستدامة للوصول إلى النطاق الصحي.",
      },
      preset: { height: 178, weight: 88 }
    },
    formulaBreakdown: {
      name: {
        en: "Official WHO Metric BMI Formula",
        he: "נוסחת ה-BMI המטרית של ארגון הבריאות העולמי",
        es: "Fórmula Métrica Oficial del IMC (OMS)",
        fr: "Formule Officielle de l'IMC (Métrique OMS)",
        ar: "المعادلة المترية الرسمية لمؤشر كتلة الجسم (منظمة الصحة العالمية)",
      },
      formula: "BMI = Weight (kg) / [ Height (m) ]²",
      variables: {
        he: [
          "Weight (משקל) = משקל הגוף הנמדד בקילוגרמים (kg)",
          "Height (גובה) = גובה האדם במטרים (לדוגמה: 178 ס\"מ = 1.78 מטר)"
        ],
        en: [
          "Weight = Total body mass in kilograms (kg)",
          "Height = Body stature measured in meters (e.g., 178 cm = 1.78 m)"
        ]
      }
    }
  },
  pregnancy: {
    category: 'health',
    title: {
      en: "Pregnancy Trimester, Baby Size & Milestone Benchmarks",
      he: "טבלת אבני דרך, טרימסטרים וגודל העובר לפי שבועות הריון",
      es: "Hitos del Embarazo, Trimestres y Tamaño del Feto",
      fr: "Tableau de Suivi de Grossesse, Trimestres et Taille du Fœtus",
      ar: "جدول مراحل الحمل، الأثلاث ونمو الجنين حسب الأسابيع",
    },
    description: {
      en: "Clinical overview of gestational age, fetal length, average weight, and key prenatal screenings.",
      he: "סקירה קלינית של שבועות ההריון, אורך העובר, משקל ממוצע ובדיקות מעקב מרכזיות בכל שלב.",
      es: "Resumen clínico de semanas de gestación, longitud y peso fetal medio y pruebas prenatales clave.",
      fr: "Aperçu clinique des semaines de grossesse, taille et poids moyens du fœtus et examens recommandés.",
      ar: "نظرة سريرية شاملة على أسابيع الحمل، طول الجنين ووزنه التقريبي وأبرز الفحوصات الطبية الدورية.",
    },
    directAnswer: {
      en: "A full-term human pregnancy lasts 40 weeks (280 days) from the first day of the last menstrual period (LMP). It is divided into 3 trimesters: 1st (weeks 1–13), 2nd (weeks 14–27), and 3rd (weeks 28–40+). Full term is officially reached at week 37.",
      he: "הריון מלא נמשך בממוצע 40 שבועות (280 ימים) מהיום הראשון של הווסת האחרונה (LMP). ההריון מתחלק ל-3 טרימסטרים: שליש ראשון (שבועות 1–13), שליש שני (שבועות 14–27), ושליש שלישי (שבועות 28–40+). הריון נחשב במועד מלא (Full Term) החל משבוע 37.",
      es: "Un embarazo a término completo dura 40 semanas (280 días) desde la última menstruación. Consta de 3 trimestres: 1º (sem 1-13), 2º (sem 14-27) y 3º (sem 28-40+). Se considera a término a partir de la semana 37.",
      fr: "Une grossesse à terme dure 40 semaines d'aménorrhée (280 jours). Elle comprend 3 trimestres : 1er (sem 1 à 13), 2e (sem 14 à 27) et 3e (sem 28 à 40+). Le terme est atteint dès la 37e semaine.",
      ar: "يستمر الحمل المكتمل 40 أسبوعاً (280 يوماً) بدءاً من أول يوم لآخر دورة شهرية. ينقسم إلى 3 أثلاث: الأول (1-13 أسبوع)، الثاني (14-27 أسبوع)، والثالث (28-40+ أسبوع). يعتبر الحمل مكتملاً رسمياً عند الأسبوع 37.",
    },
    headers: {
      en: ["Pregnancy Stage", "Gestational Weeks", "Average Fetal Size & Weight", "Key Prenatal Checkup"],
      he: ["שלב בהריון", "שבועות הריון", "אורך ומשקל ממוצע של העובר", "בדיקת מעקב עיקרית"],
      es: ["Etapa del Embarazo", "Semanas de Gestación", "Tamaño y Peso Medio Fetal", "Prueba Prenatal Clave"],
      fr: ["Étape de la Grossesse", "Semaines d'Aménorrhée", "Taille et Poids Moyen", "Examen Médical Clé"],
      ar: ["مرحلة الحمل", "أسابيع الحمل", "حجم ووزن الجنين التقديري", "الفحص الطبي الرئيسي"],
    },
    rows: [
      { label: "Trimester 1 / שליש ראשון", col1: "Weeks 1–13 (שבועות 1–13)", col2: "5.4 cm / 14 g (שזיף)", col3: "אולטרסאונד דופק + שקיפות עורפית וסקר שליש ראשון" },
      { label: "Trimester 2 / שליש שני", col1: "Weeks 14–27 (שבועות 14–27)", col2: "35.6 cm / 760 g (חסה)", col3: "סקירת מערכות מוקדמת ומאוחרת + העמסת סוכר 50 גרם" },
      { label: "Trimester 3 / שליש שלישי", col1: "Weeks 28–36 (שבועות 28–36)", col2: "47.4 cm / 2,600 g (אננס)", col3: "מעקב גדילה והערכת משקל, חיסון שעלת, משטח GBS" },
      { label: "Full Term / מועד מלא", col1: "Weeks 37–40+ (שבועות 37–40+)", col2: "50–52 cm / 3,200–3,600 g (דלעת/אבטיח)", col3: "בדיקת פתיחה, מעקב תנועות והכנה לחדר לידה" },
    ],
    expertTip: {
      en: "Only about 4% to 5% of babies are born precisely on their estimated due date (EDD). Delivering anytime between 37 weeks and 41 weeks is completely normal and considered full term.",
      he: "רק כ-4% עד 5% מהתינוקות נולדים בדיוק בתאריך הלידה המשוער. לידה בכל שלב בין שבוע 37 לשבוע 41 נחשבת לידה תקינה ובמועד (Full Term).",
      es: "Solo el 4-5% de los bebés nacen exactamente en su fecha prevista de parto. Dar a luz entre las semanas 37 y 41 es totalmente normal.",
      fr: "Seulement 4 à 5 % des bébés naissent le jour exact du terme prévu. Un accouchement entre la 37e et 41e semaine est considéré comme à terme.",
      ar: "حوالي 4% إلى 5% فقط من المواليد يولدون في يوم موعد الولادة المتوقع بالضبط. الولادة بين الأسبوع 37 والأسبوع 41 تعتبر ولادة طبيعية مكتملة المدة.",
    },
    caseStudy: {
      title: {
        en: "Realistic Case Study: Due Date Calculation from LMP (Last Menstrual Period)",
        he: "תרחיש לדוגמה מהחיים: חישוב תאריך לידה ואבני דרך לווסת אחרונה ב-1 בינואר",
        es: "Caso Práctico: Cálculo de FPP con última regla el 1 de enero",
        fr: "Étude de Cas : Calcul du terme pour une DDR au 1er janvier",
        ar: "دراسة حالة واقعية: حساب موعد الولادة لآخر دورة شهرية في 1 يناير",
      },
      scenario: {
        en: "A mother's last menstrual period (LMP) began on January 1st with a standard 28-day menstrual cycle. When is the estimated due date (EDD) and when are key screenings scheduled?",
        he: "היום הראשון של הווסת האחרונה היה ב-1 בינואר. מחזור סדיר בן 28 יום. מהו תאריך הלידה המשוער (EDD) ומתי נערכות הבדיקות הקריטיות?",
        es: "Último periodo menstrual: 1 de enero con ciclo de 28 días. ¿Cuál es la fecha estimada de parto (FPP)?",
        fr: "Date des dernières règles : 1er janvier (cycle régulier de 28 jours). Quelle est la date prévue d'accouchement ?",
        ar: "أول يوم لآخر دورة شهرية كان في 1 يناير مع دورة منتظمة 28 يوماً. ما هو موعد الولادة المتوقع والجدول الطبي؟",
      },
      calculations: {
        he: [
          "הפעלת כלל נייגלה (Naegele's Rule): הוספת שנה אחת (+1), החסרת 3 חודשים (-3), והוספת 7 ימים (+7).",
          "תאריך לידה משוער (EDD): 8 באוקטובר של אותה שנה (סך הכל 280 ימים / 40 שבועות).",
          "שקיפות עורפית (שבועות 11-13): בין 19 במרץ ל-9 באפריל.",
          "סקירת מערכות מוקדמת (שבועות 14-16): בין 9 באפריל ל-23 באפריל.",
          "כניסה למועד מלא (Full Term - שבוע 37): החל מ-17 בספטמבר."
        ],
        en: [
          "Applying Naegele's Rule: Add 1 year, subtract 3 months, add 7 days.",
          "Estimated Due Date (EDD): October 8th (280 days total).",
          "Nuchal Translucency Scan (Weeks 11–13): March 19th – April 9th.",
          "Full Term Horizon (Week 37): From September 17th onwards."
        ]
      },
      takeaway: {
        en: "Clinical Insight: Ultrasound dating in the first trimester (CRL measurement) remains the gold standard for refining gestational age if ovulation was irregular.",
        he: "מסקנה קלינית: בדיקת אולטרסאונד בשליש הראשון (מדידת CRL) היא המדד המדויק ביותר לקביעת גיל ההריון הסופי במקרים של ביוץ לא סדיר.",
        es: "Conclusión: La ecografía del primer trimestre es la referencia médica más precisa para confirmar la edad gestacional.",
        fr: "Conclusion : L'échographie de datation au 1er trimestre reste la méthode la plus précise.",
        ar: "الخلاصة: فحص السونار في الثلث الأول هو المعيار الطبي الأدق لتأكيد عمر الحمل وتاريخ الولادة.",
      }
    },
    formulaBreakdown: {
      name: {
        en: "Naegele's Rule for Estimated Due Date (EDD)",
        he: "כלל נייגלה (Naegele's Rule) לחישוב תאריך לידה משוער",
        es: "Regla de Naegele para Fecha Prevista de Parto (FPP)",
        fr: "Règle de Naegele pour la Date Prévue d'Accouchement (DPA)",
        ar: "قاعدة نيغيل (Naegele) لحساب موعد الولادة المتوقع",
      },
      formula: "EDD = First Day of LMP + 1 Year - 3 Months + 7 Days (for 28-day cycle)",
      variables: {
        he: [
          "LMP = תאריך היום הראשון של הווסת האחרונה (Last Menstrual Period)",
          "תיקון אורך מחזור = במידה והמחזור ארוך מ-28 ימים מוסיפים ימים, במידה וקצר מחסירים ימים"
        ],
        en: [
          "LMP = First day of the Last Menstrual Period",
          "Cycle Adjustment = Add (Cycle Length - 28) days for irregular cycles"
        ]
      }
    }
  }
};
