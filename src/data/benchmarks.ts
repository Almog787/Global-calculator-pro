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
      ar: "مقارنة بناء الثרוة: الإيجار مقابل الشراء على مدار 10 سنوات",
    },
    description: {
      en: "How buying with home appreciation compares to renting and investing the down payment in index funds.",
      he: "כיצד עליית ערך הנכס ברכישה משתווה לשכירות והשקעת ההון העצמי והחיסכון החודשי בשוק ההון.",
      es: "Comparación entre la revalorización de la vivienda y la inversión del enganche en bolsa.",
      fr: "Comparaison du patrimoine net entre achat immobilier et investissement boursier de l'apport.",
      ar: "مقارنة بين نمو قيمة العقار المشتري مقابل استثمار رأس المال في الأسهم.",
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
