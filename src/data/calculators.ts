export type CalculatorMeta = {
  id: string;
  path: string;
  titleKey?: string; // For i18n lookup if available
  descKey?: string;  // For i18n lookup if available
  fallbackTitle: string;
  description: string;
  category:
    "finance" | "health" | "math" | "lifestyle" | "tech" | "real-estate";
  tags: string[];
};

export const dynamicTranslations: Record<string, Record<string, { title: string; description: string }>> = {
  "mortgage-affordability": {
    en: { title: "Mortgage Affordability", description: "Calculate how much house you can afford based on your income." },
    he: { title: "כמה משכנתא אני יכול לקחת?", description: "חשב מהו תקציב קניית הדירה שלך בהתבסס על ההכנסה וההוצאות שלך." },
    es: { title: "Asequibilidad de Hipoteca", description: "Calcula cuánta casa puedes permitirte." },
    fr: { title: "Capacité d'Emprunt Immobilier", description: "Calculez le montant que vous pouvez emprunter." },
    ar: { title: "القدرة على تحمل الرهن العقاري", description: "احسب مقدار المنزل الذي يمكنك تحمل تكلفته." },
  },
  "refinance": {
    en: { title: "Refinance Calculator", description: "Calculate potential savings from refinancing your mortgage." },
    he: { title: "מחשבון מיחזור משכנתא", description: "בדוק האם שווה לך למחזר את המשכנתא ומה יהיה החיסכון." },
    es: { title: "Calculadora de Refinanciamiento", description: "Calcula los ahorros al refinanciar." },
    fr: { title: "Calculatrice de Refinancement", description: "Calculez les économies potentielles d'un refinancement." },
    ar: { title: "حاسبة إعادة التمويل", description: "احسب المدخرات المحتملة من إعادة تمويل رهنك العقاري." },
  },
  "vat": {
    en: { title: "VAT Calculator", description: "Calculate VAT or Sales Tax easily." },
    he: { title: "מחשבון מע\"מ", description: "הוסף או הפחת מע\"מ בקלות." },
    es: { title: "Calculadora de IVA", description: "Calcula el IVA o impuesto sobre las ventas." },
    fr: { title: "Calculatrice de TVA", description: "Calculez facilement la TVA." },
    ar: { title: "حاسبة ضريبة القيمة المضافة", description: "احسب ضريبة القيمة المضافة بسهولة." },
  },
  "break-even": {
    en: { title: "Break-Even Calculator", description: "Calculate your break-even point." },
    he: { title: "מחשבון נקודת איזון", description: "חשב מתי העסק שלך יתחיל להרוויח." },
    es: { title: "Punto de Equilibrio", description: "Calcula el punto de equilibrio de tu negocio." },
    fr: { title: "Seuil de Rentabilité", description: "Calculez votre seuil de rentabilité." },
    ar: { title: "نقطة التعادل", description: "احسب نقطة التعادل لعملك." },
  },
  "inflation": {
    en: { title: "Inflation Calculator", description: "Calculate the impact of inflation over time." },
    he: { title: "מחשבון אינפלציה", description: "חשב את השפעת האינפלציה על כוח הקנייה לאורך זמן." },
    es: { title: "Calculadora de Inflación", description: "Calcula el impacto de la inflación a lo largo del tiempo." },
    fr: { title: "Calculatrice d'Inflation", description: "Calculez l'impact de l'inflation au fil du temps." },
    ar: { title: "حاسبة التضخم", description: "احسب تأثير التضخم بمرور الوقت." },
  },
  "credit-card-payoff": {
    en: { title: "Credit Card Payoff", description: "Find out how long it will take to pay off your credit card." },
    he: { title: "סילוק חוב כרטיס אשראי", description: "חשב כמה זמן ייקח לחסל את החוב בכרטיס האשראי שלך." },
    es: { title: "Pago de Tarjeta de Crédito", description: "Descubre cuánto tiempo tomará pagar tu tarjeta de crédito." },
    fr: { title: "Remboursement de Carte de Crédit", description: "Découvrez combien de temps il faudra pour rembourser votre carte." },
    ar: { title: "سداد بطاقة الائتمان", description: "اكتشف المدة التي ستستغرقها لسداد بطاقتك الائتمانية." },
  },
  "bmr": {
    en: { title: "Calorie Calculator (TDEE)", description: "Calculate your daily calorie needs." },
    he: { title: "מחשבון שריפת קלוריות (BMR/TDEE)", description: "חשב כמה קלוריות הגוף שלך שורף ביום." },
    es: { title: "Calculadora de Calorías (TDEE)", description: "Calcula tus necesidades calóricas diarias." },
    fr: { title: "Calculatrice de Calories (TDEE)", description: "Calculez vos besoins caloriques quotidiens." },
    ar: { title: "حاسبة السعرات الحرارية", description: "احسب احتياجاتك اليومية من السعرات الحرارية." },
  },
  "water-intake": {
    en: { title: "Water Intake Calculator", description: "Calculate how much water you should drink daily." },
    he: { title: "מחשבון צריכת מים", description: "חשב כמה מים עליך לשתות ביום בהתאם למשקל ולפעילות שלך." },
    es: { title: "Calculadora de Agua", description: "Calcula cuánta agua debes beber al día." },
    fr: { title: "Calculatrice d'Hydratation", description: "Calculez la quantité d'eau que vous devez boire par jour." },
    ar: { title: "حاسبة استهلاك المياه", description: "احسب كمية الماء التي يجب أن تشربها يوميًا." },
  },
  "date-difference": {
    en: { title: "Date Difference Calculator", description: "Calculate exact days between dates." },
    he: { title: "מחשבון הפרשי תאריכים", description: "חשב מספר ימים בדיוק בין שני תאריכים (כולל ימי עסקים)." },
    es: { title: "Diferencia de Fechas", description: "Calcula los días exactos entre fechas." },
    fr: { title: "Différence de Dates", description: "Calculez les jours exacts entre deux dates." },
    ar: { title: "حاسبة فرق التواريخ", description: "احسب الأيام الدقيقة بين التواريخ." },
  },
  "bill-splitter": {
    en: { title: "Bill Splitter", description: "Split bills and tips easily." },
    he: { title: "חלוקת חשבון במסעדה", description: "חלק חשבון וטיפ בקלות בין חברים." },
    es: { title: "Divisor de Cuenta", description: "Divide cuentas y propinas fácilmente." },
    fr: { title: "Partage d'Addition", description: "Partagez facilement les additions et pourboires." },
    ar: { title: "مقسم الفاتورة", description: "قسّم الفواتير والإكراميات بسهولة." },
  },
  "auto-loan": {
    en: { title: "Auto Loan Calculator", description: "Calculate your monthly car loan payment, total interest, and total cost precisely." },
    he: { title: "מחשבון הלוואה לרכב", description: "חשב את התשלום החודשי, סך הריבית, והעלות הכוללת של הלוואת הרכב שלך בדיוק מירבי." },
    es: { title: "Calculadora de Préstamo de Auto", description: "Calcula tu pago mensual, interés total y costo total con precisión." },
    fr: { title: "Calculatrice de Prêt Auto", description: "Calculez précisément votre paiement mensuel, l'intérêt total et le coût total." },
    ar: { title: "حاسبة قروض السيارات", description: "احسب الدفعة الشهرية وإجمالي الفائدة والتكلفة الإجمالية بدقة." },
  },
  roi: {
    en: { title: "ROI Calculator", description: "Calculate Return on Investment and evaluate profitability." },
    he: { title: "מחשבון החזר השקעה (ROI)", description: "חשב את החזר ההשקעה (ROI) וקבל תובנות לגבי רווחיות העסקה." },
    es: { title: "Calculadora de ROI", description: "Calcula el retorno de la inversión y evalúa la rentabilidad." },
    fr: { title: "Calculatrice de ROI", description: "Calculez le retour sur investissement et évaluez la rentabilité." },
    ar: { title: "حاسبة العائد على الاستثمار", description: "احسب العائد على الاستثمار وقيم الربحية." },
  },
  margin: {
    en: { title: "Margin Calculator", description: "Calculate gross margin, markup percentage, and profit easily." },
    he: { title: "מחשבון רווח ושולי רווח", description: "חשב שולי רווח גולמי, אחוז תוספת מחיר (Markup) ורווח נטו בקלות." },
    es: { title: "Calculadora de Margen", description: "Calcula fácilmente el margen bruto, porcentaje de margen y ganancia." },
    fr: { title: "Calculatrice de Marge", description: "Calculez facilement la marge brute, le pourcentage de marque et le profit." },
    ar: { title: "حاسبة الهامش والربح", description: "احسب هامش الربح الإجمالي ونسبة الزيادة والربح بسهولة." },
  },
  "cap-rate": {
    en: { title: "Cap Rate Calculator", description: "Calculate the Capitalization Rate for real estate property investments." },
    he: { title: "מחשבון שיעור תשואה נטו (Cap Rate)", description: "חשב את שיעור התשואה הנטו (Cap Rate) עבור השקעות נדל\"ן." },
    es: { title: "Calculadora de Cap Rate", description: "Calcula la Tasa de Capitalización para inversiones inmobiliarias." },
    fr: { title: "Calculatrice de Taux de Capitalisation", description: "Calculez le taux de capitalisation pour les investissements immobiliers." },
    ar: { title: "حاسبة معدل الرأسمالية", description: "احسب معدل الرأسمالية للاستثمارات العقارية." },
  },
  "freelance-net-income": {
    en: { title: "Freelance Net Income", description: "Calculate take-home pay after taxes and business expenses for freelancers." },
    he: { title: "מחשבון הכנסה נטו לפרילנסרים", description: "חשב את ההכנסה נטו לאחר ניכוי מסים והוצאות מוכרות לפרילנסרים." },
    es: { title: "Ingreso Neto Freelance", description: "Calcula los ingresos netos después de impuestos y gastos para freelancers." },
    fr: { title: "Revenu Net Freelance", description: "Calculez le revenu net après impôts et dépenses pour les indépendants." },
    ar: { title: "صافي الدخل للمستقلين", description: "احسب الدخل الصافي بعد الضرائب والمصروفات للمستقلين." },
  },
  "debt-snowball": {
    en: { title: "Debt Snowball", description: "Calculate debt payoff time and interest using the snowball method." },
    he: { title: "מחשבון סילוק חובות (כדור שלג)", description: "חשב זמן החזר חובות וסך ריבית בשיטת כדור השלג." },
    es: { title: "Bola de Nieve de Deudas", description: "Calcula el tiempo de pago de deudas e intereses con el método de bola de nieve." },
    fr: { title: "Boule de Neige de Dettes", description: "Calculez le temps de remboursement des dettes avec la méthode de la boule de neige." },
    ar: { title: "كرة الثلج لسداد الديون", description: "احسب وقت سداد الديون وإجمالي الفائدة باستخدام طريقة كرة الثلج." },
  },
  "fuel-split": {
    en: { title: "Fuel Split", description: "Calculate and split travel fuel costs fairly among passengers." },
    he: { title: "מחשבון השתתפות בדלק", description: "חשב ופצל את עלויות הדלק והנסיעה באופן הוגן בין הנוסעים." },
    es: { title: "División de Combustible", description: "Calcula y divide los costos de combustible de viaje entre los pasajeros." },
    fr: { title: "Partage de Carburant", description: "Calculez et partagez équitablement les frais de carburant entre passagers." },
    ar: { title: "تقاسم الوقود", description: "احسب وقسّم تكاليف الوقود والسفر بالتساوي بين الركاب." },
  },
  "goal-savings": {
    en: { title: "Goal Savings", description: "Calculate how much you need to save periodically to reach a financial goal." },
    he: { title: "מחשבון חיסכון ליעד", description: "חשב כמה עליך לחסוך מדי חודש כדי להגיע ליעד החיסכון שלך." },
    es: { title: "Ahorro para Meta", description: "Calcula cuánto necesitas ahorrar periódicamente para alcanzar tu meta." },
    fr: { title: "Épargne Objectif", description: "Calculez combien vous devez épargner régulièrement pour atteindre votre objectif." },
    ar: { title: "الادخار للهدف", description: "احسب المبلغ الذي تحتاج إلى ادخاره دورياً للوصول إلى هدفك." },
  },
  "download-time": {
    en: { title: "Download Time", description: "Calculate how long a file download will take based on internet speed." },
    he: { title: "מחשבון זמן הורדה", description: "חשב כמה זמן תארך הורדת קובץ בהתבסס על מהירות האינטרנט שלך." },
    es: { title: "Tiempo de Descarga", description: "Calcula cuánto tardará la descarga de un archivo según la velocidad de conexión." },
    fr: { title: "Temps de Téléchargement", description: "Calculez le temps de téléchargement d'un fichier selon la vitesse de connexion." },
    ar: { title: "وقت التنزيل", description: "احسب الوقت الذي يستغرقه تنزيل الملف بناءً على سرعة الاتصال." },
  },
  "peltier-cooling": {
    en: { title: "Peltier Cooling", description: "Calculate Thermoelectric Cooler capacity, power, and COP." },
    he: { title: "מחשבון קירור פלטייה (Peltier)", description: "חשב קיבולת קירור, הספק ומדד יעילות (COP) עבור רכיב פלטייה." },
    es: { title: "Enfriamiento Peltier", description: "Calcula la capacidad de enfriamiento termoeléctrico, potencia y COP." },
    fr: { title: "Refroidissement Peltier", description: "Calculez la capacité de refroidissement thermoélectrique, la puissance et le COP." },
    ar: { title: "التبريد بعنصر بيلتير", description: "احسب سعة التبريد الكهروحراري والقدرة ومعامل الأداء (COP)." },
  },
  "rent-vs-buy": {
    en: { title: "Rent vs Buy Calculator", description: "Compare the financial costs and long-term value of renting vs buying a home." },
    he: { title: "מחשבון קנייה או שכירות", description: "השווה את העלויות הכספיות והערך לטווח ארוך בין שכירות לקניית דירה." },
    es: { title: "Alquilar vs Comprar", description: "Compara los costos financieros y el valor a largo plazo de alquilar vs comprar." },
    fr: { title: "Louer vs Acheter", description: "Comparez les coûts financiers et la valeur à terme entre louer et acheter." },
    ar: { title: "الإيجار مقابل الشراء", description: "قارن التكاليف المالية والقيمة طويلة الأجل بين الإيجار والشراء." },
  },
};

export const calculators: CalculatorMeta[] = [
  {
    id: "mortgage-affordability",
    path: "/calculators/mortgage-affordability",
    fallbackTitle: "Mortgage Affordability",
    description: "Calculate how much house you can afford.",
    category: "real-estate",
    tags: ["mortgage","afford","house","budget","loan"],
  },
  {
    id: "refinance",
    path: "/calculators/refinance",
    fallbackTitle: "Refinance Calculator",
    description: "Calculate savings from refinancing your mortgage.",
    category: "real-estate",
    tags: ["mortgage","refinance","loan","savings","house"],
  },
  {
    id: "vat",
    path: "/calculators/vat",
    fallbackTitle: "VAT / Sales Tax Calculator",
    description: "Calculate VAT or Sales Tax easily.",
    category: "finance",
    tags: ["vat","tax","sales","business","finance"],
  },
  {
    id: "break-even",
    path: "/calculators/break-even",
    fallbackTitle: "Break-Even Point Calculator",
    description: "Calculate when your business will become profitable.",
    category: "finance",
    tags: ["business","profit","breakeven","sales","finance"],
  },
  {
    id: "inflation",
    path: "/calculators/inflation",
    fallbackTitle: "Inflation Calculator",
    description: "Calculate the impact of inflation on purchasing power.",
    category: "finance",
    tags: ["inflation","money","purchasing power","economy","finance"],
  },
  {
    id: "credit-card-payoff",
    path: "/calculators/credit-card-payoff",
    fallbackTitle: "Credit Card Payoff",
    description: "Calculate how long it takes to pay off credit card debt.",
    category: "finance",
    tags: ["credit card","debt","payoff","loan","interest"],
  },
  {
    id: "bmr",
    path: "/calculators/bmr",
    fallbackTitle: "BMR / TDEE Calculator",
    description: "Calculate your daily calorie needs.",
    category: "health",
    tags: ["bmr","tdee","calories","health","fitness","diet"],
  },
  {
    id: "water-intake",
    path: "/calculators/water-intake",
    fallbackTitle: "Water Intake Calculator",
    description: "Calculate how much water you should drink daily.",
    category: "health",
    tags: ["water","hydration","health","fitness","drink"],
  },
  {
    id: "date-difference",
    path: "/calculators/date-difference",
    fallbackTitle: "Date Difference",
    description: "Calculate the exact number of days between two dates.",
    category: "lifestyle",
    tags: ["date","time","days","calendar","business days"],
  },
  {
    id: "bill-splitter",
    path: "/calculators/bill-splitter",
    fallbackTitle: "Bill Splitter",
    description: "Split restaurant bills and tips among friends.",
    category: "lifestyle",
    tags: ["restaurant","bill","split","tip","money","friends"],
  },
  // Static route calculators
  {
    id: "mortgage",
    path: "/mortgage-calculator",
    titleKey: "mortgageTitle",
    descKey: "mortgageDesc",
    fallbackTitle: "Mortgage Calculator",
    description: "Calculate monthly payments for a home mortgage.",
    category: "real-estate",
    tags: ["loan", "house", "interest", "payment"],
  },
  {
    id: "compound",
    path: "/compound-interest",
    titleKey: "compoundTitle",
    descKey: "compoundDesc",
    fallbackTitle: "Compound Interest",
    description: "Calculate compound interest over time.",
    category: "finance",
    tags: ["investment", "growth", "savings", "interest"],
  },
  {
    id: "percentage",
    path: "/percentage-finder",
    titleKey: "percFinderTitle",
    descKey: "percFinderDesc",
    fallbackTitle: "Percentage Finder",
    description: "Calculate percentages easily.",
    category: "math",
    tags: ["percent", "fraction", "discount"],
  },
  {
    id: "unit",
    path: "/unit-converter",
    titleKey: "unitConvTitle",
    descKey: "unitConvDesc",
    fallbackTitle: "Unit Converter",
    description: "Convert between different units of measurement.",
    category: "math",
    tags: ["measure", "length", "weight", "metric", "imperial"],
  },
  {
    id: "bmi",
    path: "/bmi-calculator",
    titleKey: "bmiTitle",
    descKey: "bmiDesc",
    fallbackTitle: "BMI Calculator",
    description: "Calculate your Body Mass Index.",
    category: "health",
    tags: ["weight", "height", "body", "fitness", "health"],
  },
  {
    id: "tip",
    path: "/tip-calculator",
    titleKey: "tipTitle",
    descKey: "tipDesc",
    fallbackTitle: "Tip Calculator",
    description: "Calculate tips and split bills.",
    category: "lifestyle",
    tags: ["restaurant", "bill", "split", "gratuity"],
  },
  {
    id: "salary",
    path: "/salary-calculator",
    titleKey: "salaryTitle",
    descKey: "salaryDesc",
    fallbackTitle: "Salary Calculator",
    description:
      "Convert between hourly, weekly, monthly, and annual salaries.",
    category: "finance",
    tags: ["job", "income", "wage", "pay"],
  },
  {
    id: "age",
    path: "/age-calculator",
    titleKey: "ageTitle",
    descKey: "ageDesc",
    fallbackTitle: "Age Calculator",
    description: "Calculate exact age in years, months, and days.",
    category: "lifestyle",
    tags: ["birthday", "date", "time", "years"],
  },

  // Dynamic route calculators
  {
    id: "auto-loan",
    path: "/calculators/auto-loan",
    fallbackTitle: "Auto Loan Calculator",
    description: "Calculate monthly car loan payments.",
    category: "finance",
    tags: ["car", "loan", "vehicle", "finance"],
  },
  {
    id: "roi",
    path: "/calculators/roi",
    fallbackTitle: "ROI Calculator",
    description: "Calculate Return on Investment.",
    category: "finance",
    tags: ["return", "investment", "profit", "business"],
  },
  {
    id: "margin",
    path: "/calculators/margin",
    fallbackTitle: "Margin Calculator",
    description: "Calculate gross margin, markup, and profit.",
    category: "finance",
    tags: ["profit", "sales", "business", "pricing"],
  },
  {
    id: "cap-rate",
    path: "/calculators/cap-rate",
    fallbackTitle: "Cap Rate Calculator",
    description: "Calculate the Capitalization Rate for real estate.",
    category: "real-estate",
    tags: ["property", "investment", "yield", "noi"],
  },
  {
    id: "freelance-net-income",
    path: "/calculators/freelance-net-income",
    fallbackTitle: "Freelance Net Income",
    description: "Calculate take-home pay for freelancers.",
    category: "finance",
    tags: ["freelance", "tax", "income", "business", "independent"],
  },
  {
    id: "debt-snowball",
    path: "/calculators/debt-snowball",
    fallbackTitle: "Debt Snowball",
    description: "Calculate debt payoff time using the snowball method.",
    category: "finance",
    tags: ["debt", "loan", "payoff", "snowball", "finance"],
  },
  {
    id: "fuel-split",
    path: "/calculators/fuel-split",
    fallbackTitle: "Fuel Split",
    description: "Calculate and split travel costs fairly among passengers.",
    category: "lifestyle",
    tags: ["car", "travel", "gas", "split", "trip"],
  },
  {
    id: "goal-savings",
    path: "/calculators/goal-savings",
    fallbackTitle: "Goal Savings",
    description: "Calculate how much you need to save to reach a goal.",
    category: "finance",
    tags: ["savings", "goal", "money", "future"],
  },
  {
    id: "download-time",
    path: "/calculators/download-time",
    fallbackTitle: "Download Time",
    description: "Calculate how long a file download will take.",
    category: "tech",
    tags: ["internet", "speed", "bandwidth", "file", "time"],
  },
  {
    id: "peltier-cooling",
    path: "/calculators/peltier-cooling",
    fallbackTitle: "Peltier Cooling",
    description: "Calculate Thermoelectric Cooler capacity and COP.",
    category: "tech",
    tags: ["cooling", "thermoelectric", "hardware", "power"],
  },
  {
    id: "rent-vs-buy",
    path: "/calculators/rent-vs-buy",
    fallbackTitle: "Rent vs Buy Calculator",
    description: "Compare the costs of renting vs buying a home.",
    category: "real-estate",
    tags: ["home", "house", "rent", "mortgage", "buy"],
  },
];

export function getCalculatorTitle(calc: CalculatorMeta, t: any, lang: string): string {
  if (calc.titleKey && t[calc.titleKey]) {
    return t[calc.titleKey];
  }
  if (dynamicTranslations[calc.id]?.[lang]?.title) {
    return dynamicTranslations[calc.id][lang].title;
  }
  return calc.fallbackTitle;
}

export function getCalculatorDescription(calc: CalculatorMeta, t: any, lang: string): string {
  if (calc.descKey && t[calc.descKey]) {
    return t[calc.descKey];
  }
  if (dynamicTranslations[calc.id]?.[lang]?.description) {
    return dynamicTranslations[calc.id][lang].description;
  }
  return calc.description;
}

export function getCalculatorsByCategory(category: string) {
  return calculators.filter((c) => c.category === category);
}

export function searchCalculators(query: string, t?: any, lang?: string) {
  const lowerQuery = query.toLowerCase();
  return calculators.filter((c) => {
    const title = (t && lang) ? getCalculatorTitle(c, t, lang) : c.fallbackTitle;
    const desc = (t && lang) ? getCalculatorDescription(c, t, lang) : c.description;
    return (
      title.toLowerCase().includes(lowerQuery) ||
      desc.toLowerCase().includes(lowerQuery) ||
      c.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  });
}

export function getRelatedCalculators(currentId: string, limit: number = 3) {
  const current = calculators.find(
    (c) => c.id === currentId || c.path === currentId,
  );
  if (!current) return calculators.slice(0, limit);

  // Find by same category first
  const related = calculators.filter(
    (c) => c.id !== current.id && c.category === current.category,
  );

  // If not enough in same category, pad with others
  if (related.length < limit) {
    const others = calculators.filter(
      (c) => c.id !== current.id && c.category !== current.category,
    );
    related.push(...others.slice(0, limit - related.length));
  }

  return related.slice(0, limit);
}
