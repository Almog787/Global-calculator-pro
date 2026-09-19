export interface BenchmarkRow {
  label: string;
  col1: string;
  col2: string;
  col3: string;
  col4?: string;
  preset?: Record<string, number | string>;
}

export interface BenchmarkData {
  title: Record<string, string>;
  description: Record<string, string>;
  directAnswer?: Record<string, string>; // Concise AI Answer & Featured Snippet extract
  headers: Record<string, string[]>;
  rows: BenchmarkRow[];
  expertTip?: Record<string, string>;
}

export const benchmarkTables: Record<string, BenchmarkData> = {
  mortgage: {
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
    }
  },
  compound: {
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
      { label: "$100 / ₪400 /mo", col1: "$18,295 / ₪73,180", col2: "$58,902 / ₪235,608", col3: "$149,036 / ₪596,144", preset: { contribution: 100, rate: 8, years: 30 } },
      { label: "$250 / ₪1,000 /mo", col1: "$45,737 / ₪182,950", col2: "$147,255 / ₪589,020", col3: "$372,590 / ₪1,490,360", preset: { contribution: 250, rate: 8, years: 30 } },
      { label: "$500 / ₪2,000 /mo", col1: "$91,473 / ₪365,900", col2: "$294,510 / ₪1,178,040", col3: "$745,180 / ₪2,980,720", preset: { contribution: 500, rate: 8, years: 30 } },
      { label: "$1,000 / ₪4,000 /mo", col1: "$182,946 / ₪731,800", col2: "$589,020 / ₪2,356,080", col3: "$1,490,359 / ₪5,961,440", preset: { contribution: 1000, rate: 8, years: 30 } },
    ],
    expertTip: {
      en: "The Rule of 72: Divide 72 by your expected annual return rate to estimate how many years it will take for your money to double (e.g., 72 ÷ 8% = ~9 years).",
      he: "כלל ה-72: חלקו 72 באחוז התשואה השנתית כדי לחשב תוך כמה שנים הכסף שלכם יוכפל (למשל: 72 חלקי 8% תשואה = הכפלת ההון תוך כ-9 שנים).",
      es: "Regla del 72: Divide 72 entre tu tasa de interés para estimar en cuántos años se duplicará tu dinero (ej. 72 ÷ 8% = ~9 años).",
      fr: "Règle des 72 : Divisez 72 par le taux de rendement annuel pour estimer le nombre d'années nécessaires pour doubler votre capital.",
      ar: "قاعدة 72: اقسم 72 على نسبة العائد السنوي لتقدير عدد السنوات اللازمة لمضاعفة أموالك (مثال: 72 ÷ 8% = ~9 سنوات).",
    }
  },
  bmi: {
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
    }
  },
  percentage: {
    title: {
      en: "Common Percentage & Discount Quick Reference",
      he: "טבלת אחוזים, הנחות ושברים נפוצים",
      es: "Tabla Rápida de Porcentajes y Descuentos",
      fr: "Tableau de Référence des Pourcentages et Remises",
      ar: "جدول سريع للنسب المئوية والخصومات الشائعة",
    },
    description: {
      en: "Instant decimal and fraction equivalents for fast mental math and shopping discounts.",
      he: "ערכים עשרוניים ושברים מקבילים לחישוב מנטלי מהיר של הנחות ומבצעים בקניות.",
      es: "Equivalencias decimales y fraccionarias para cálculos rápidos de descuentos.",
      fr: "Équivalences décimales et fractions pour calculer rapidement les remises.",
      ar: "المكافئات العشرية والكسرية لحساب الخصومات والتسوق بسرعة.",
    },
    directAnswer: {
      en: "To find X% of Y, multiply Y by (X / 100). For quick mental discounts: 10% is moving the decimal left by one place, 20% is 10% multiplied by 2, and 50% is dividing by 2.",
      he: "לחישוב X% מתוך Y, כופלים את המספר Y ב-(X חלקי 100). לחישוב מנטלי מהיר של הנחה: 10% שווה להזזת הנקודה העשרונית מקום אחד שמאלה, 20% שווה להכפלת ה-10% פי 2, ו-50% שווה לחלוקה ב-2.",
      es: "Para calcular el X% de Y, multiplica Y por (X / 100). Para descuentos rápidos: 10% es mover la coma un lugar a la izquierda, 20% es duplicar el 10% y 50% es dividir entre 2.",
      fr: "Pour trouver X% de Y, multipliez Y par (X / 100). Pour un calcul mental rapide : 10% équivaut à décaler la virgule d'un rang vers la gauche et 50% à diviser par 2.",
      ar: "لحساب X% من القيمة Y، اضرب Y في (X ÷ 100). للحساب الذهني السريع للخصم: 10% تعني تحريك الفاصلة العشرية خانة واحدة لليسار، و20% تعني مضاعفة الـ 10%، و50% تعني القسمة على 2.",
    },
    headers: {
      en: ["Percentage", "Decimal Multiplier", "Fraction Equivalent", "Example on $100 / ₪100"],
      he: ["אחוז (%)", "מכפיל עשרוני", "שבר פשוט", "דוגמה על 100 ₪ / $100"],
      es: ["Porcentaje", "Multiplicador", "Fracción", "Ejemplo en $100"],
      fr: ["Pourcentage", "Multiplicateur", "Fraction", "Exemple sur 100 €"],
      ar: ["النسبة المئوية", "المعامل العشري", "الكسر", "مثال على 100"],
    },
    rows: [
      { label: "10%", col1: "0.10", col2: "1/10", col3: "$10 / ₪10 off" },
      { label: "15%", col1: "0.15", col2: "3/20", col3: "$15 / ₪15 off" },
      { label: "20%", col1: "0.20", col2: "1/5", col3: "$20 / ₪20 off" },
      { label: "25%", col1: "0.25", col2: "1/4", col3: "$25 / ₪25 off" },
      { label: "33.3%", col1: "0.333", col2: "1/3", col3: "$33.33 / ₪33.33 off" },
      { label: "50%", col1: "0.50", col2: "1/2", col3: "$50 / ₪50 off (Half price)" },
    ],
    expertTip: {
      en: "Quick Tip: To quickly calculate a 15% tip or discount, find 10% (move the decimal one spot to the left), then add half of that number.",
      he: "טיפ לחישוב מהיר: כדי לחשב 15% בראש, חשבו 10% (הזיזו את הנקודה העשרונית מקום אחד שמאלה) והוסיפו חצי מאותו הסכום.",
      es: "Consejo rápido: Para calcular el 15%, obtén el 10% (mueve la coma un lugar a la izquierda) y suma la mitad de ese valor.",
      fr: "Astuce : Pour calculer 15%, calculez d'abord 10% puis ajoutez la moitié de ce résultat.",
      ar: "حساب سريع: لحساب 15% ذهنياً، احسب 10% أولاً ثم أضف نصف تلك القيمة إليها.",
    }
  },
  salary: {
    title: {
      en: "Salary Conversion Reference Table (40-Hour Work Week)",
      he: "טבלת המרת שכר שעתי לשכר חודשי ושנתי (משרה מלאה)",
      es: "Tabla de Conversión Salarial (Semana de 40 Horas)",
      fr: "Tableau de Conversion Salaire Horaire en Mensuel et Annuel",
      ar: "جدول تحويل الراتب بالساعة إلى شهري وسنوي (40 ساعة أسبوعياً)",
    },
    description: {
      en: "Gross salary equivalents based on 52 working weeks (2,080 annual hours, ~173.3 monthly hours).",
      he: "המרת שכר ברוטו לפי 52 שבועות עבודה בשנה (2,080 שעות שנתיות, כ-173.33 שעות חודשיות בממוצע).",
      es: "Salarios brutos basados en 52 semanas laborales al año (2.080 horas anuales).",
      fr: "Équivalents salariaux bruts basés sur un temps plein standard annuel.",
      ar: "مقارنة الرواتب الإجمالية استناداً إلى 52 أسبوع عمل في السنة.",
    },
    directAnswer: {
      en: "A full-time hourly wage of $25/hour equals roughly $4,333 per month and $52,000 per year gross (based on 2,080 working hours annually). An hourly wage of ₪50/hr in Israel translates to approximately ₪8,667 gross per month.",
      he: "שכר שעתי של 50 ₪ לשעה במשרה מלאה שווה לכ-8,667 ₪ ברוטו בחודש ו-104,000 ₪ בשנה (לפי 173.33 שעות חודשיות ו-2,080 שעות עבודה שנתיות). שכר של 100 ₪ לשעה מתרגם ל-17,333 ₪ ברוטו לחודש.",
      es: "Un salario de $25/hora a tiempo completo equivale a aproximadamente $4,333 brutos al mes y $52,000 al año (2.080 horas anuales).",
      fr: "Un taux horaire brut de 25 € à temps plein (35h-40h) équivaut à environ 4 333 € brut par mois et 52 000 € brut par an.",
      ar: "أجر 25 دولاراً في الساعة بدوام كامل يعادل حوالي 4,333 دولار شهرياً و52,000 دولار سنوياً قبل خصم الضرائب (بناءً على 2080 ساعة عمل سنوياً).",
    },
    headers: {
      en: ["Hourly Wage", "Daily (8h)", "Monthly (~173h)", "Annual Gross"],
      he: ["שכר שעתי", "יומי (8 שעות)", "חודשי ממוצע", "שנתי ברוטו"],
      es: ["Por Hora", "Diario (8h)", "Mensual", "Anual Bruto"],
      fr: ["Taux Horaire", "Journalier (8h)", "Mensuel", "Annuel Brut"],
      ar: ["الساعة", "اليومي (8 ساعات)", "الشهري", "السنوي الإجمالي"],
    },
    rows: [
      { label: "$15 / ₪35 /hr", col1: "$120 / ₪280", col2: "$2,600 / ₪6,066", col3: "$31,200 / ₪72,800", preset: { amount: 15, frequency: 'hourly' } },
      { label: "$25 / ₪50 /hr", col1: "$200 / ₪400", col2: "$4,333 / ₪8,667", col3: "$52,000 / ₪104,000", preset: { amount: 25, frequency: 'hourly' } },
      { label: "$40 / ₪80 /hr", col1: "$320 / ₪640", col2: "$6,933 / ₪13,867", col3: "$83,200 / ₪166,400", preset: { amount: 40, frequency: 'hourly' } },
      { label: "$60 / ₪120 /hr", col1: "$480 / ₪960", col2: "$10,400 / ₪20,800", col3: "$124,800 / ₪249,600", preset: { amount: 60, frequency: 'hourly' } },
      { label: "$100 / ₪200 /hr", col1: "$800 / ₪1,600", col2: "$17,333 / ₪34,667", col3: "$208,000 / ₪416,000", preset: { amount: 100, frequency: 'hourly' } },
    ],
    expertTip: {
      en: "Take-Home Pay Rule: Net salary after income tax, pension contributions, and healthcare deductions typically ranges between 65% and 80% of gross pay.",
      he: "כלל אצבע לשכר נטו: השכר נטו שנכנס לבנק לאחר ניכויי מס הכנסה, ביטוח לאומי ופנסיה עומד בדרך כלל על 65% עד 82% מהשכר ברוטו.",
      es: "Regla del salario neto: El ingreso neto real tras impuestos suele representar entre el 65% y el 80% del salario bruto.",
      fr: "Salaire net : Le salaire net après cotisations et impôts représente en moyenne 75% à 80% du salaire brut.",
      ar: "صافي الراتب: يشكل الراتب الصافي بعد خصم الضرائب والتأمينات عادة ما بين 65% إلى 80% من الراتب الإجمالي.",
    }
  },
  "rent-vs-buy": {
    title: {
      en: "Rent vs Buy 10-Year Wealth Projections",
      he: "השוואת הון מצטבר: קנייה מול שכירות (אופק 10 שנים)",
      es: "Comparativa Alquilar vs Comprar a 10 Años",
      fr: "Comparatif Location vs Achat Immobilier sur 10 Ans",
      ar: "مقارنة بناء الثروة: الإيجار مقابل الشراء على مدار 10 سنوات",
    },
    description: {
      en: "How buying with home appreciation compares to renting and investing the down payment in index funds.",
      he: "כיצד עליית ערך הנכס ברכישה משתווה לשכירות והשקעת ההון העצמי והחיסכון החודשי בשוק ההון.",
      es: "Comparación entre la revalorización de la vivienda y la inversión del enganche en bolsa.",
      fr: "Comparaison du patrimoine net entre achat immobilier et investissement boursier de l'apport.",
      ar: "مقارنة بين نمو قيمة العقار المشتري مقابل استثمار رأس المال في الأسهم.",
    },
    directAnswer: {
      en: "Buying a home generally builds more long-term wealth when staying for 5+ years due to forced equity buildup and property appreciation, whereas renting wins in the short term (<4 years) due to high transaction taxes and closing costs.",
      he: "רכישת דירה נוטה לייצר הון מצטבר גבוה יותר כאשר מתכננים להתגורר בנכס מעל 5-7 שנים (בשל בניית הון בנכס ועליית ערך), בעוד ששכירות עדיפה לטווח קצר (עד 4 שנים) בשל חיסכון בעלויות עסקה כבדות (מס רכישה, עו\"ד, תיווך ושיפוץ).",
      es: "Comprar vivienda suele generar mayor patrimonio neto a partir del 5º o 7º año, mientras que alquilar resulta más ventajoso a corto plazo por el ahorro en gastos de compra.",
      fr: "L'achat immobilier permet de créer plus de patrimoine à partir de 5 à 7 ans de détention, tandis que la location est financièrement plus souple sur le court terme.",
      ar: "شراء العقار يحقق ثروة صافية أكبر عند الاستقرار لمدة تزيد عن 5 إلى 7 سنوات بفضل تراكم الأصول ونمو الأسعار، بينما يعد الإيجار أفضل مالياً للمدد القصيرة.",
    },
    headers: {
      en: ["Scenario", "Initial Capital", "Monthly Outlay", "Estimated 10-Yr Net Worth"],
      he: ["תרחיש", "הון עצמי ראשוני", "הוצאה חודשית", "שווי נטו מוערך (10 שנים)"],
      es: ["Escenario", "Capital Inicial", "Gasto Mensual", "Patrimonio Estimado (10a)"],
      fr: ["Scénario", "Apport Initial", "Dépense Mensuelle", "Patrimoine Net Estimé (10 ans)"],
      ar: ["السيناريو", "رأس المال الأولي", "المصروف الشهري", "صافي الثروة المقدرة (10 سنوات)"],
    },
    rows: [
      { label: "Buying Home ($500k / ₪2M)", col1: "$100,000 / ₪400,000", col2: "$3,100 / ₪11,500 (Mortgage+Tax)", col3: "~$340,000 / ₪1,350,000 (Equity)", preset: {} },
      { label: "Renting + Investing Capital", col1: "$100,000 (In Index Funds)", col2: "$2,200 / ₪7,500 (Rent)", col3: "~$310,000 / ₪1,200,000 (Portfolio)", preset: {} },
    ],
    expertTip: {
      en: "Break-even Rule: Buying usually builds more wealth if you plan to stay in the home for at least 5 to 7 years to offset initial transaction fees, taxes, and agent commissions.",
      he: "כלל נקודת האיזון: רכישת דירה משתלמת בדרך כלל אם מתכננים לגור בה לפחות 5 עד 7 שנים, על מנת לכסות את עלויות העסקה (מס רכישה, תיווך ועו\"ד).",
      es: "Regla del punto de equilibrio: Comprar es más rentable si permaneces en la vivienda al menos 5 a 7 años.",
      fr: "Règle d'amortissement : L'achat devient généralement plus avantageux que la location à partir de 5 à 7 ans de détention.",
      ar: "نقطة التعادل: يعتبر الشراء خياراً أفضل إذا كنت تخطط للإقامة في العقار لمدة 5 إلى 7 سنوات على الأقل لتغطية تكاليف الشراء والرسوم.",
    }
  },
  "auto-loan": {
    title: {
      en: "Car Loan Payment Benchmarks (5-Year Term at 7%)",
      he: "טבלת החזר הלוואת רכב לדוגמה (5 שנים בריבית 7%)",
      es: "Tabla de Pagos de Préstamo de Auto (5 Años al 7%)",
      fr: "Mensualités de Prêt Auto (5 Ans à 7%)",
      ar: "جدول أقساط قرض السيارة (5 سنوات بفائدة 7%)",
    },
    description: {
      en: "Estimated monthly payment and total interest across typical vehicle price points.",
      he: "החזר חודשי וסך ריבית עבור מחירי רכב נפוצים.",
      es: "Pago mensual estimado e interés total según el valor del vehículo.",
      fr: "Mensualité estimée et coût total des intérêts selon le prix du véhicule.",
      ar: "الدفعة الشهرية المقدرة وإجمالي الفائدة لمختلف أسعار السيارات.",
    },
    directAnswer: {
      en: "On a 5-year (60-month) car loan with 20% down payment at a 7% interest rate, financing a $35,000 (₪130,000) car results in a monthly payment of ~$554 (₪2,059) and total interest of ~$5,265 (₪19,550).",
      he: "בהלוואת רכב ל-5 שנים (60 חודשים) עם מקדמה של 20% ובריבית 7%, מימון רכב בשווי 130,000 ₪ מניב החזר חודשי של כ-2,059 ₪ וסך ריבית של כ-19,550 ₪ לאורך תקופת ההלוואה.",
      es: "En un préstamo de auto a 5 años al 7% con 20% de enganche, financiar un coche de $35,000 supone una cuota de unos $554/mes y $5,265 de interés total.",
      fr: "Pour un prêt auto sur 5 ans à 7 % avec 20 % d'apport, financer un véhicule de 35 000 € revient à une mensualité d'environ 554 € et 5 265 € d'intérêts totaux.",
      ar: "لقرض سيارة مدته 5 سنوات بفائدة 7% ودفعة أولى 20%، فإن تمويل سيارة بقيمة 35,000 دولار ينتج عنه قسط شهري قدره 554 دولار وإجمالي فائدة 5,265 دولار.",
    },
    headers: {
      en: ["Vehicle Price", "Down Payment (20%)", "Monthly Payment (60 mo)", "Total Interest"],
      he: ["מחיר הרכב", "מקדמה (20%)", "החזר חודשי (60 חודש)", "סך ריבית לתשלום"],
      es: ["Precio del Auto", "Enganche (20%)", "Pago Mensual (60m)", "Interés Total"],
      fr: ["Prix du Véhicule", "Apport (20%)", "Mensualité (60 mois)", "Total Intérêts"],
      ar: ["سعر السيارة", "الدفعة الأولى (20%)", "القسط الشهري (60 شهراً)", "إجمالي الفائدة"],
    },
    rows: [
      { label: "$20,000 / ₪75,000", col1: "$4,000 / ₪15,000", col2: "$317 / ₪1,188", col3: "$3,009 / ₪11,280" },
      { label: "$35,000 / ₪130,000", col1: "$7,000 / ₪26,000", col2: "$554 / ₪2,059", col3: "$5,265 / ₪19,550" },
      { label: "$50,000 / ₪190,000", col1: "$10,000 / ₪38,000", col2: "$792 / ₪3,009", col3: "$7,522 / ₪28,580" },
      { label: "$75,000 / ₪280,000", col1: "$15,000 / ₪56,000", col2: "$1,188 / ₪4,435", col3: "$11,283 / ₪42,120" },
    ],
    expertTip: {
      en: "The 20/4/10 Rule for Car Buying: Put at least 20% down, finance for no longer than 4 years (48 months), and keep total transportation costs (loan, insurance, fuel) below 10% of gross monthly income.",
      he: "כלל ה-20/4/10 לרכישת רכב: שלמו לפחות 20% מקדמה, פרסו לתקופה שלא עולה על 4 שנים (48 חודשים), והגבילו את סך כל הוצאות הרכב החודשיות לעד 10% מהכנסתכם ברוטו.",
      es: "Regla 20/4/10: 20% de enganche, financiamiento a máximo 4 años y gastos de transporte inferiores al 10% de tus ingresos brutos.",
      fr: "Règle 20/4/10 : 20% d'apport, crédit sur 4 ans maximum et budget auto limité à 10% de vos revenus bruts.",
      ar: "قاعدة 20/4/10: ادفع 20% كدفعة أولى، وقسط على مدة لا تتجاوز 4 سنوات، واجعل تكاليف السيارة أقل من 10% من دخلك الإجمالي.",
    }
  },
  tip: {
    title: {
      en: "Standard Gratuity & Tipping Benchmarks",
      he: "טבלת טיפים מומלצים לפי סכום החשבון",
      es: "Guía Rápida de Propinas por Monto",
      fr: "Guide des Pourboires selon l'Addition",
      ar: "جدول الإكراميات الموصى بها حسب الفاتورة",
    },
    description: {
      en: "Quick tip calculation chart for common dining and service amounts.",
      he: "חישוב טיפ מהיר (12%, 15%, 18%, 20%) לפי מגוון סכומי חשבון נפוצים.",
      es: "Cálculo rápido de propinas para diferentes montos de factura.",
      fr: "Tableau de calcul rapide pour le pourboire sur vos additions.",
      ar: "حساب سريع للإكرامية لمختلف مبالغ الفواتير والخدمات.",
    },
    directAnswer: {
      en: "A standard restaurant tip ranges between 15% and 20% in the US and Canada, and between 10% and 15% in Israel and Europe. On a $100 (₪400) restaurant bill, a 15% tip is $15 (₪60) and an 18% tip is $18 (₪72).",
      he: "טיפ סטנדרטי במסעדות ובתי קפה בישראל עומד על 12% עד 15%, ובארה\"ב על 18% עד 20%. על חשבון של 400 ₪, טיפ של 12% הוא 48 ₪, טיפ של 15% הוא 60 ₪, וטיפ של 18% עומד על 72 ₪.",
      es: "La propina habitual en restaurantes se sitúa entre el 10% y el 15% en Europa/Latinoamérica, y el 18-20% en EE.UU. En una cuenta de $100, el 15% son $15.",
      fr: "Le pourboire standard se situe entre 10% et 15% en Europe et entre 18% et 20% en Amérique du Nord. Sur une addition de 100 €, un pourboire de 15% équivaut à 15 €.",
      ar: "تتراوح الإكرامية القياسية في المطاعم بين 10% و 15% في الشرق الأوسط وأوروبا، وبين 18% و 20% في أمريكا الشمالية. على فاتورة بقيمة 100 دولار، تكون الإكرامية بنسبة 15% هي 15 دولاراً.",
    },
    headers: {
      en: ["Bill Amount", "12% Tip", "15% Standard", "18% Great Service", "20% Exceptional"],
      he: ["סכום החשבון", "12% בסיסי", "15% סטנדרטי", "18% שירות מצוין", "20% שירות יוצא דופן"],
      es: ["Monto de Cuenta", "12% Básico", "15% Estándar", "18% Excelente", "20% Excepcional"],
      fr: ["Montant Addition", "12% Basique", "15% Standard", "18% Très bon", "20% Exceptionnel"],
      ar: ["مبلغ الفاتورة", "12% أساسي", "15% قياسي", "18% خدمة ممتازة", "20% خدمة استثنائية"],
    },
    rows: [
      { label: "$25 / ₪100", col1: "$3.00 / ₪12", col2: "$3.75 / ₪15", col3: "$4.50 / ₪18", col4: "$5.00 / ₪20" },
      { label: "$50 / ₪200", col1: "$6.00 / ₪24", col2: "$7.50 / ₪30", col3: "$9.00 / ₪36", col4: "$10.00 / ₪40" },
      { label: "$100 / ₪400", col1: "$12.00 / ₪48", col2: "$15.00 / ₪60", col3: "$18.00 / ₪72", col4: "$20.00 / ₪80" },
      { label: "$200 / ₪800", col1: "$24.00 / ₪96", col2: "$30.00 / ₪120", col3: "$36.00 / ₪144", col4: "$40.00 / ₪160" },
    ],
    expertTip: {
      en: "Tipping Norms: In the US, 15–20% on the pre-tax bill is standard. In Israel and Europe, 10–15% is customary for table service.",
      he: "נוהגי מתן טיפ: בישראל מקובל להשאיר 12% עד 15% על שירות במסעדות ובתי קפה, ובארה\"ב הסטנדרט עומד על 18% עד 20%.",
      es: "Normas de propina: En EE.UU. lo habitual es 15-20%, mientras que en Europa y Latinoamérica oscila entre 10-15%.",
      fr: "Usage des pourboires : Aux États-Unis 18-20% est la norme. En France et Europe, 10% est apprécié pour un service soigné.",
      ar: "أعراف الإكرامية: في الولايات المتحدة تتراوح الإكرامية بين 18-20%، بينما في الشرق الأوسط وأوروبا تتراوح بين 10-15%.",
    }
  }
};
