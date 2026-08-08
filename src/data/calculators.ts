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
