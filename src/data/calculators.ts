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
    en: { title: "Mortgage Affordability Calculator", description: "Calculate exactly how much house you can afford based on income, down payment, and monthly debt." },
    he: { title: "כמה משכנתא אני יכול לקחת?", description: "חשב את תקציב קניית הדירה המדויק שלך, גובה המשכנתא המקסימלי וההחזר החודשי לפי ההכנסה." },
    es: { title: "Calculadora de Asequibilidad de Hipoteca", description: "Calcula exactamente cuánta casa puedes permitirte según tus ingresos y gastos mensuales." },
    fr: { title: "Capacité d'Emprunt Immobilier", description: "Calculez précisément votre capacité d'emprunt et votre budget d'achat immobilier selon vos revenus." },
    ar: { title: "حاسبة القدرة على تحمل الرهن العقاري", description: "احسب بدقة سعر المنزل الذي يمكنك شراؤه ومبلغ التموיל المناسب لدخلك." },
  },
  "refinance": {
    en: { title: "Mortgage Refinance Calculator", description: "Calculate your monthly and lifetime savings from refinancing your home mortgage loan." },
    he: { title: "מחשבון מיחזור משכנתא", description: "בדוק האם כדאי למחזר את המשכנתא, כמה תחסוך בריביות ותוך כמה חודשים המהלך משתלם." },
    es: { title: "Calculadora de Refinanciamiento de Hipoteca", description: "Calcula el ahorro mensual y total al refinanciar tu préstamo hipotecario a una tasa menor." },
    fr: { title: "Calculatrice de Rachat de Crédit Immobilier", description: "Calculez vos économies mensuelles et totales en refinançant votre prêt immobilier." },
    ar: { title: "حاسبة إعادة تمويل الرهن العقاري", description: "احسب المدخرات الشهرية والإجمالية من إعادة تمويل رهنك العقاري بفائدة أقل." },
  },
  "vat": {
    en: { title: "VAT & Sales Tax Calculator", description: "Add or remove Value Added Tax (VAT) or Sales Tax easily with one click." },
    he: { title: "מחשבון מע\"מ (הוספה והפחתה)", description: "מחשבון מע\"מ אונליין: הוסף או הפחת מע\"מ בקלות (כולל מע\"מ 17% ומע\"מ 18%) בלחיצת כפתור." },
    es: { title: "Calculadora de IVA e Impuestos", description: "Calcula, añade o desglosa el IVA e impuestos de venta de cualquier precio al instante." },
    fr: { title: "Calculatrice de TVA (Ajout & Déduction)", description: "Calculez le montant TTC, HT et le montant de la TVA facilement en un clic." },
    ar: { title: "حاسبة ضريبة القيمة المضافة (VAT)", description: "احسب ضريبة القيمة المضافة، استخرج السعر قبل وبعد الضريبة بسهولة فورية." },
  },
  "break-even": {
    en: { title: "Break-Even Point Calculator", description: "Calculate your business break-even sales volume and revenue to achieve profitability." },
    he: { title: "מחשבון נקודת איזון לעסקים", description: "חשב כמה יחידות והכנסות העסק צריך למכור כדי לכסות הוצאות קבועות ומשתנות ולהתחיל להרוויח." },
    es: { title: "Calculadora de Punto de Equilibrio", description: "Calcula el volumen de ventas e ingresos necesarios para que tu negocio empiece a generar beneficios." },
    fr: { title: "Calculateur de Seuil de Rentabilité", description: "Calculez le chiffre d'affaires et les unités requises pour atteindre le seuil de rentabilité de votre entreprise." },
    ar: { title: "حاسبة نقطة التعادل التجاري", description: "احسب حجم المبيعات والإيرادات اللازمة لتغطية التكاليف وبدء تحقيق الأرباح." },
  },
  "inflation": {
    en: { title: "Inflation & Purchasing Power Calculator", description: "Calculate how inflation erodes purchasing power and the future value of money over time." },
    he: { title: "מחשבון אינפלציה ושחיקת כסף", description: "חשב כיצד מדד המחירים לצרכן והאינפלציה שוחקים את כוח הקנייה והערך הריאלי של הכסף לאורך שנים." },
    es: { title: "Calculadora de Inflación y Poder Adquisitivo", description: "Calcula el impacto de la inflación acumulada en el valor real de tu dinero y ahorros." },
    fr: { title: "Calculatrice d'Inflation et Pouvoir d'Achat", description: "Calculez l'impact de l'inflation sur le pouvoir d'achat et la valeur future de votre argent." },
    ar: { title: "حاسبة التضخم والقوة الشرائية", description: "احسب تأثير التضخم على القوة الشرائية والقيمة الحقيقية لأموالك مع مرور الوقت." },
  },
  "credit-card-payoff": {
    en: { title: "Credit Card Payoff Calculator", description: "Calculate how long it will take to eliminate credit card debt and total interest paid." },
    he: { title: "מחשבון סילוק חוב כרטיסי אשראי", description: "חשב תוך כמה חודשים תחסל את חוב האשראי וכמה ריבית תחסוך אם תגדיל את ההחזר החודשי." },
    es: { title: "Calculadora de Pago de Tarjeta de Crédito", description: "Descubre cuántos meses tardarás en liquidar tu tarjeta de crédito y cuánto interés pagarás." },
    fr: { title: "Calculatrice de Remboursement Carte de Crédit", description: "Calculez le délai pour rembourser votre dette de carte bancaire et le coût total des intérêts." },
    ar: { title: "حاسبة سداد ديون البطاقات الائتمانية", description: "اكتشف المدة اللازمة لسداد رصيد بطاقتك الائتمانية وإجمالي الفائدة المدفوعة." },
  },
  "bmr": {
    en: { title: "Calorie & TDEE Calculator", description: "Calculate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) to lose or gain weight." },
    he: { title: "מחשבון קלוריות יומי (BMR / TDEE)", description: "חשב את כמות הקלוריות שהגוף שלך שורף במנוחה ובפעילות, לתכנון חיטוב, דיאטה או עלייה במסה." },
    es: { title: "Calculadora de Calorías y TDEE", description: "Calcula tu Tasa Metabólica Basal (BMR) y gasto calórico diario para adelgazar o ganar masa." },
    fr: { title: "Calculateur de Calories et TDEE", description: "Calculez votre métabolisme de base (MB) et dépense énergétique totale quotidienne." },
    ar: { title: "حاسبة السعرات الحرارية و TDEE", description: "احسب معدל الأيض الأساسي (BMR) واحتياجك اليومي من السعرات لإنقاص أو زيادة الوزن." },
  },
  "water-intake": {
    en: { title: "Daily Water Intake Calculator", description: "Calculate optimal daily water consumption based on your body weight, climate, and exercise level." },
    he: { title: "מחשבון שתיית מים יומית", description: "חשב כמה ליטרים של מים עליך לשתות ביום בהתאם למשקל הגוף, רמת הפעילות ועונת השנה." },
    es: { title: "Calculadora de Consumo de Agua Diario", description: "Calcula cuántos litros de agua debes beber al día según tu peso corporal y actividad física." },
    fr: { title: "Calculateur d'Hydratation Quotidienne", description: "Calculez la quantité d'eau optimale à boire par jour selon votre poids et niveau d'activité." },
    ar: { title: "حاسبة شرب الماء اليومي", description: "احسب كمية الماء الموصى بها يومياً بناءً على وزنك ومستوى نشاطك البدني." },
  },
  "date-difference": {
    en: { title: "Date Duration & Business Days Calculator", description: "Calculate exact days, weeks, months, years, and working business days between any two dates." },
    he: { title: "מחשבון הפרשי תאריכים וימי עסקים", description: "חשב במדויק כמה ימים, שבועות, חודשים וימי עבודה מפרידים בין שני תאריכים בלוח השנה." },
    es: { title: "Calculadora de Diferencia de Fechas y Días Hábiles", description: "Calcula con precisión los días, meses, años y días laborables entre dos fechas." },
    fr: { title: "Calculateur de Différence de Dates et Jours Ouvrés", description: "Calculez le nombre exact de jours, semaines et jours ouvrés entre deux dates." },
    ar: { title: "حاسبة الفرق بين تاريخين وأيام العمل", description: "احسب بدقة عدد الأيام، الأشهر، السنوات وأيام العمل بين أي تاريخين." },
  },
  "bill-splitter": {
    en: { title: "Restaurant Bill Splitter & Tip Calculator", description: "Easily split restaurant bills, add customized tip percentages, and calculate each person's exact share." },
    he: { title: "מחשבון פיצול חשבון וטיפ במסעדה", description: "חלק חשבון מסעדה והוסף טיפ בקלות ובהוגנות לפי מספר הסועדים בלחיצת כפתור." },
    es: { title: "Divisor de Cuenta y Propinas para Restaurante", description: "Divide la cuenta del restaurante, añade propina y calcula cuánto paga cada comensal." },
    fr: { title: "Partage d'Addition et Calculateur de Pourboire", description: "Partagez équitablement l'addition du restaurant et le pourboire entre amis en toute simplicité." },
    ar: { title: "حاسبة تقسيم الفاتورة والإكرامية", description: "قسّم فاتورة المطعم واحسب حصة كل شخص بدقة متناهية مع نسبة الإكرامية." },
  },
  "auto-loan": {
    en: { title: "Auto Loan Payment Calculator", description: "Calculate monthly car loan payments, total interest cost, and compare financing options." },
    he: { title: "מחשבון הלוואה לרכב (מימון רכב)", description: "חשב החזר חודשי, סך ריבית ועלות כוללת למימון רכב חדש או משומש בדיוק מירבי." },
    es: { title: "Calculadora de Préstamo de Auto y Financiación", description: "Calcula las cuotas mensuales, el interés total y el coste real de financiar tu coche." },
    fr: { title: "Calculateur de Crédit Auto", description: "Calculez les mensualités, les intérêts et le coût total de votre prêt automobile." },
    ar: { title: "حاسبة أقساط قروض السيارات", description: "احسب القسط الشهري، إجمالي الفائدة والتكلفة الكلية لتمويل سيارتك بدقة." },
  },
  roi: {
    en: { title: "ROI (Return on Investment) Calculator", description: "Calculate Return on Investment percentage, annualized gain, and net profit for any financial venture." },
    he: { title: "מחשבון החזר השקעה (ROI) ותשואה", description: "חשב את אחוז הרווחיות, התשואה השנתית והרווח הנקי מכל השקעה, נכס או קמפיין שיווקי." },
    es: { title: "Calculadora de ROI (Retorno de Inversión)", description: "Calcula el porcentaje de retorno de inversión y la rentabilidad neta de tus proyectos." },
    fr: { title: "Calculateur de ROI (Retour sur Investissement)", description: "Calculez le rendement de votre investissement et la rentabilité nette de votre projet." },
    ar: { title: "حاسبة العائد على الاستثمار (ROI)", description: "احسب نسبة العائد على الاستثمار وصافي الربح لتقييم جدوى أي مشروع استثماري." },
  },
  margin: {
    en: { title: "Profit Margin & Markup Calculator", description: "Calculate gross profit margin, markup percentage, cost of goods, and selling price easily." },
    he: { title: "מחשבון שולי רווח ותוספת מחיר (Markup)", description: "חשב שולי רווח גולמי, אחוז רווח ותוספת מחיר (Markup) לתמחור מוצרים ושירותים בעסק." },
    es: { title: "Calculadora de Margen de Beneficio y Markup", description: "Calcula el margen de ganancia bruto, markup y precio de venta óptimo para tus productos." },
    fr: { title: "Calculateur de Marge et Taux de Marque", description: "Calculez facilement votre marge brute, votre taux de marque et le prix de vente optimal." },
    ar: { title: "حاسبة هامش الربح ونسبة الزيادة", description: "احسب هامش الربح الإجمالي ونسبة الزيادة على التكلفة لتسعיר المنتجات والخدمات بدقة." },
  },
  "cap-rate": {
    en: { title: "Cap Rate (Capitalization Rate) Calculator", description: "Calculate real estate capitalization rate (Cap Rate) and Net Operating Income (NOI) for property investments." },
    he: { title: "מחשבון תשואה נטו בנדל\"ן (Cap Rate)", description: "חשב את שיעור התשואה התפעולית הנטו (Cap Rate) וההכנסה התפעולית (NOI) להשקעות נדל\"ן מניב." },
    es: { title: "Calculadora de Cap Rate para Inmuebles", description: "Calcula la Tasa de Capitalización y los ingresos operativos netos de tus inversiones inmobiliarias." },
    fr: { title: "Calculateur de Taux de Rendement Immobilier (Cap Rate)", description: "Calculez le taux de capitalisation et le revenu net d'exploitation de vos biens immobiliers." },
    ar: { title: "حاسبة معدل رسملة العقارات (Cap Rate)", description: "احسب معدل الرأسمالية وصافي الدخل التشغيلي لتقييم الاستثمارات العقارية." },
  },
  "freelance-net-income": {
    en: { title: "Freelance Take-Home Pay & Tax Calculator", description: "Estimate net income after taxes, social security contributions, and business expenses for self-employed professionals." },
    he: { title: "מחשבון הכנסה נטו לפרילנסרים ועצמאים", description: "חשב את ההכנסה נטו שנשארת בכיס לאחר ניכוי מס הכנסה, ביטוח לאומי, מע\"מ והוצאות מוכרות." },
    es: { title: "Calculadora de Ingresos Netos para Autónomos", description: "Calcula tu sueldo neto real después de impuestos, cuotas y gastos de autónomo." },
    fr: { title: "Calculateur de Revenu Net pour Indépendants", description: "Calculez votre revenu net disponible après impôts, cotisations sociales et frais professionnels." },
    ar: { title: "حاسبة الدخل الصافي للمستقلين", description: "احسب صافي الأرباح المتبقية بعد خصم الضرائب والتأمينات والمصروفات التشغيلية." },
  },
  "debt-snowball": {
    en: { title: "Debt Snowball Payoff Calculator", description: "Accelerate debt freedom using the Debt Snowball strategy. Calculate payoff timeline and interest saved." },
    he: { title: "מחשבון סילוק חובות בשיטת כדור השלג", description: "תכנן סילוק חובות מהיר בשיטת כדור השלג, צפה בלוח הזמנים המדויק וחסוך אלפי שקלים בריביות." },
    es: { title: "Calculadora de Bola de Nieve de Deudas", description: "Elimina tus deudas más rápido con el método bola de nieve y calcula el interés que ahorrarás." },
    fr: { title: "Calculateur Boule de Neige de Dettes", description: "Remboursez vos dettes plus vite grâce à la méthode de la boule de neige financière." },
    ar: { title: "حاسبة سداد الديون بطريقة كرة الثلج", description: "تخلص من ديונك بأسرع وقت باستخدام استراتيجية كرة الثلج واحسب التوفير في الفوائد." },
  },
  "fuel-split": {
    en: { title: "Trip Fuel Cost & Gas Split Calculator", description: "Calculate total gasoline costs and split fuel expenses fairly among carpool passengers." },
    he: { title: "מחשבון הוצאות דלק ונסיעות משותפות", description: "חשב את עלות הדלק המדויקת לנסיעה ופצל את העלויות בצורה שווה בין כל הנוסעים ברכב." },
    es: { title: "Calculadora de Gastos de Gasolina y Viaje Compartido", description: "Calcula el costo total del combustible y divide los gastos de viaje entre los pasajeros." },
    fr: { title: "Calculateur de Frais d'Essence et Covoiturage", description: "Calculez le coût du carburant pour votre trajet et partagez les frais équitablement." },
    ar: { title: "حاسبة تكلفة الوقود وتقاسم الرحلات", description: "احسب تكلفة البنزين للرحلة وقسّم مصاريف الوقود بعدالة بين الركاب." },
  },
  "goal-savings": {
    en: { title: "Savings Goal & Monthly Contribution Calculator", description: "Calculate the exact monthly deposit needed to reach your financial target with compound interest." },
    he: { title: "מחשבון חיסכון ליעד כספי", description: "חשב כמה כסף עליך להפקיד מדי חודש כדי להגיע ליעד כספי (חתונה, רכב, דירה) בהתחשב בריבית." },
    es: { title: "Calculadora de Ahorro para Metas Financieras", description: "Calcula el ahorro mensual necesario para alcanzar tu objetivo financiero a tiempo." },
    fr: { title: "Calculateur d'Épargne Objectif", description: "Calculez le montant à épargner chaque mois pour atteindre votre objectif financier." },
    ar: { title: "حاسبة الادخار للوصول إلى هدف مالي", description: "احسب المبلغ الشهري المطلوب ادخاره لتحقيق هدفك المالي في الوقت المحدد." },
  },
  "download-time": {
    en: { title: "Download & Upload Time Calculator", description: "Calculate precise file transfer and download times based on your internet bandwidth speed." },
    he: { title: "מחשבון זמן הורדת קבצים", description: "חשב כמה זמן ייקח להוריד או להעלות קובץ בכל גודל (MB/GB) לפי מהירות האינטרנט שלך." },
    es: { title: "Calculadora de Tiempo de Descarga", description: "Calcula con precisión cuánto tiempo tardará en descargarse un archivo según tu velocidad." },
    fr: { title: "Calculateur de Temps de Téléchargement", description: "Estimez le temps nécessaire pour télécharger un fichier selon votre vitesse de connexion." },
    ar: { title: "حاسبة وقت تنزيل الملفات", description: "احسب الوقت الدقيق اللازم لتنزيل أو رفع أي ملف بناءً على سرعة اتصال الإنترنت لديك." },
  },
  "peltier-cooling": {
    en: { title: "Peltier Thermoelectric Cooling Calculator", description: "Calculate thermoelectric cooler (TEC) cooling capacity (Qc), electrical power, and Coefficient of Performance (COP)." },
    he: { title: "מחשבון קירור תרמואלקטרי (פלטייה Peltier)", description: "חשב קיבולת קירור (Qc), הספק חשמלי ומדד נצילות (COP) עבור רכיבי קירור פלטייה." },
    es: { title: "Calculadora de Refrigeración Termoeléctrica Peltier", description: "Calcula la capacidad de enfriamiento, potencia y coeficiente de rendimiento (COP) de módulos Peltier." },
    fr: { title: "Calculateur de Refroidissement Peltier", description: "Calculez la puissance frigorifique (Qc), électrique et le coefficient de performance (COP) de modules Peltier." },
    ar: { title: "حاسبة التبريد الكهروحراري (عنصر بيلتير)", description: "احسب سعة التبريد والقدرة الكهربائية ومعامل الأداء لوحدات التبريد الكهروحرارية." },
  },
  "rent-vs-buy": {
    en: { title: "Rent vs Buy Home Calculator [2026]", description: "Compare long-term wealth, net worth, and total financial cost of renting versus buying a home." },
    he: { title: "מחשבון קנייה או שכירות דירה [2026]", description: "השוואה כלכלית מעמיקה בין רכישת דירה לשכירות והשקעת ההון העצמי בשוק ההון לטווח ארוך." },
    es: { title: "Calculadora de Alquilar vs Comprar Vivienda [2026]", description: "Compara el costo total y el patrimonio neto a largo plazo entre alquilar o comprar una casa." },
    fr: { title: "Calculateur Louer ou Acheter son Logement [2026]", description: "Comparez les coûts financiers et le patrimoine créé sur le long terme entre achat et location." },
    ar: { title: "حاسبة الإيجار مقابل شراء العقار [2026]", description: "مقارنة مالية شاملة بين تكاليف الإيجار والشراء لحساب الخيار الأفضل لبناء الثروة." },
  },
  "currency-converter": {
    en: { title: "Live Currency Converter & Exchange Rates", description: "Convert world currencies in real-time with up-to-date foreign exchange (FX) market rates." },
    he: { title: "מחשבון המרת מט\"ח ושערי חליפין בזמן אמת", description: "המרת שערים בזמן אמת: דולר, יורו, שקל, פאונד ומטבעות נוספים עם שערי חליפין רציפים." },
    es: { title: "Conversor de Divisas y Tipos de Cambio en Vivo", description: "Convierte divisas del mundo en tiempo real con los tipos de cambio de divisas más recientes." },
    fr: { title: "Convertisseur de Devises et Taux de Change en Direct", description: "Convertissez les devises du monde entier en temps réel avec les derniers taux de change." },
    ar: { title: "محول العملات وأسعار الصرف المباشرة", description: "تحويل العملات العالمية فورياً بأسعار الصرف المحدثة في الوقت الفعلي." },
  },
  "sleep-calculator": {
    en: { title: "Sleep Cycle & Bedtime Calculator", description: "Calculate the ideal time to fall asleep or wake up refreshed based on natural 90-minute sleep cycles." },
    he: { title: "מחשבון שעות שינה ומחזורי שינה", description: "חשב מתי כדאי ללכת לישון או להתעורר כדי לקום רעננים ואנרגטיים בסיום מחזור שינה טבעי." },
    es: { title: "Calculadora de Ciclos de Sueño y Horarios", description: "Encuentra la mejor hora para acostarte o despertarte sintiéndote renovado según los ciclos de sueño." },
    fr: { title: "Calculateur de Cycles de Sommeil", description: "Trouvez l'heure idéale pour vous coucher ou vous réveiller frais et dispos selon vos cycles de sommeil." },
    ar: { title: "حاسبة دورات النوم والاستيقاظ", description: "احسب أفضل وقت للنوم أو الاستيقاظ بنشاط بناءً على دورات النوم الطبيعية (90 دقيقة)." },
  },
  "cooking-timer": {
    en: { title: "Meat Roasting & Cooking Time Calculator", description: "Calculate precise cooking times and optimal oven temperatures for beef, poultry, pork, and lamb." },
    he: { title: "מחשבון זמני צלייה ובישול בשר", description: "חשב את זמן הצלייה והטמפרטורה המדויקים בתנור לפי סוג הבשר, המשקל ומידת העשייה הרצויה." },
    es: { title: "Calculadora de Tiempo y Temperatura de Asado", description: "Calcula los tiempos y temperaturas óptimos de cocción al horno para carnes según su peso." },
    fr: { title: "Calculateur de Temps de Cuisson des Viandes", description: "Calculez le temps de cuisson et la température idéale au four pour toutes vos viandes selon le poids." },
    ar: { title: "حاسبة أوقات ودرجات حرارة طهي اللحوم", description: "احسب الوقت الدقيق ودرجة الحرارة المثلى لطهي وشواء اللحوم في الفرن حسب الوزن." },
  },
  "severance-pay": {
    en: { title: "Severance Pay & Compensation Calculator", description: "Calculate estimated severance pay, notice period compensation, and statutory redundancy benefits." },
    he: { title: "מחשבון פיצויי פיטורים (חוק פיצויי פיטורין)", description: "חשב את גובה פיצויי הפיטורים המדויק המגיע לך לפי חוק, בהתבסס על ותק במקום העבודה ושכר קובע." },
    es: { title: "Calculadora de Finiquito e Indemnización por Despido", description: "Calcula el importe estimado de tu indemnización por despido y finiquito según tu antigüedad." },
    fr: { title: "Calculateur d'Indemnité de Licenciement", description: "Calculez le montant légal estimé de votre indemnité de licenciement selon votre salaire et ancienneté." },
    ar: { title: "حاسبة مكافأة نهاية الخدمة والتعويضات", description: "احسب مكافأة نهاية الخدمة المستحقة ومستحقات إنهاء العمل بناءً على مدة الخدمة والراتب." },
  },
  "stock-options-rsu": {
    en: { title: "Stock Options & RSU Calculator", description: "Calculate 4-year vesting schedules, Section 102 capital gains tax (25%), dilution impact, and exit scenarios." },
    he: { title: "מחשבון שווי אופציות ו-RSU (הייטק ושכר)", description: "חישוב מס סעיף 102 (25%), מדרגות הבשלה (Vesting Schedule), תרחישי אקזיט ודילול מניות בהייטק." },
    es: { title: "Calculadora de Opciones sobre Acciones y RSU", description: "Calcula el cronograma de consolidación (vesting), impuestos sobre plusvalías, dilución y escenarios de salida." },
    fr: { title: "Calculateur Stock-Options et RSU", description: "Calculez l'échéancier d'acquisition (vesting), la fiscalité des plus-values, la dilution et les gains de sortie." },
    ar: { title: "حاسبة خيارات الأسهم والأسهم المقيدة (RSU)", description: "احسب جدول الاستحقاق الزمني، ضريبة الأرباح الرأسمالية (25%)، وتوقعات العائد المالي في التخارج." },
  },
  "purchase-appreciation-tax": {
    en: { title: "Real Estate Purchase & Appreciation Tax Calculator", description: "Tiered Israel purchase tax brackets and linear property appreciation tax with deductible expenses." },
    he: { title: "מחשבון מס רכישה ומס שבח מדורג (נדל\"ן)", description: "עדכון אוטומטי לפי מדרגות המס הרשמיות של רשות המיסים לדירה יחידה / דירה נוספת ומס שבח ליניארי מוטב." },
    es: { title: "Calculadora de Impuesto de Compra y Plusvalía Inmobiliaria", description: "Tramos fiscales progresivos de compra de vivienda e impuesto sobre plusvalía con deducciones." },
    fr: { title: "Calculateur Droits de Mutation & Plus-Value Immobilière", description: "Barème progressif des droits d'acquisition et impôt sur la plus-value immobilière linéaire." },
    ar: { title: "حاسبة ضريبة الشراء وضريبة الأرباح العقارية", description: "حساب ضريبة الشراء المتدرجة وضريبة تحسين العقار (الشبح) مع خصم كافة المصروفات والإعفاءات." },
  },
  "employer-cost": {
    en: { title: "Employer Total Cost vs Net Salary Calculator", description: "Comprehensive breakdown of employer social security, pension, severance, study fund, and income taxes." },
    he: { title: "מחשבון עלות מעסיק מול שכר נטו לעובד", description: "פירוט מלא של ביטוח לאומי, מס הכנסה, קרן השתלמות, הפרשות סוציאליות ופנסיה למעביד ולעובד." },
    es: { title: "Calculadora de Coste de Empresa vs Sueldo Neto", description: "Desglose completo de cotizaciones patronales, seguridad social, IRPF, pensiones y retenciones salariales." },
    fr: { title: "Calculateur Coût Total Employeur vs Salaire Net", description: "Détail complet des charges patronales, cotisations salariales, retraite, prévoyance et impôt sur le revenu." },
    ar: { title: "حاسبة تكلفة صاحب العمل مقابل الراتب الصافي", description: "تفصيل شامل للتأمينات الاجتماعية، ضريبة الدخل، صناديق التقاعد والاستكمال للمشغل والموظف." },
  },
  "z-score": {
    en: { title: "Z-Score & Normal Distribution Calculator", description: "Calculate standard scores (Z), cumulative tail probabilities, percentiles, and inverse raw scores with a bell curve." },
    he: { title: "מחשבון ציון תקן Z והתפלגות נורמלית", description: "חישוב ציון תקן Z, הסתברויות זנב, אחוזוני מיקום באוכלוסייה, ערך הפוך ועקומת פעמון גאוס אינטראקטיבית." },
    es: { title: "Calculadora de Puntuación Z y Distribución Normal", description: "Calcula puntuaciones Z estándar, percentiles, probabilidades acumuladas y campana de Gauss." },
    fr: { title: "Calculateur de Score Z et Distribution Normale", description: "Calculez le score Z standardisé, les percentiles et les probabilités cumulées gaussiennes." },
    ar: { title: "حاسبة الدرجة المعيارية Z والتوزيع الطبيعي", description: "حساب درجات Z، الاحتمالات التراكمية، الرتب المئينية ومخطط التوزيع الطبيعي." },
  },
  "linear-regression": {
    en: { title: "Linear Regression & Correlation Calculator", description: "Fit ordinary least squares best-fit line y = mx + b, Pearson r, R-squared, and scatter plot trendline." },
    he: { title: "מחשבון רגרסיה לינארית ומקדם מתאם (r / R²)", description: "מציאת קו מגמה y = mx + b, מקדם מתאם פירסון r, שונות מוסברת R² ותרשים פיזור אינטראקטיבי." },
    es: { title: "Calculadora de Regresión Lineal y Correlación", description: "Calcula la recta de mínimos cuadrados y = mx + b, correlación de Pearson r y R²." },
    fr: { title: "Calculateur de Régression Linéaire et Corrélation", description: "Trouvez l'équation de régression y = mx + b, le coefficient de corrélation r et le nuage de points." },
    ar: { title: "حاسبة الانحدار الخطي ومعامل الارتباط", description: "إيجاد معادلة خط الانحدار y = mx + b، معامل ارتباط بيرسون ومخطط التشتت." },
  },
  "quadratic-equation": {
    en: { title: "Quadratic Equation Solver (ax² + bx + c = 0)", description: "Find real and complex roots, discriminant, parabola vertex apex, and interactive curve graph." },
    he: { title: "מחשבון משוואה ריבועית ופרבולה (ax² + bx + c = 0)", description: "פתרון משוואות ממעלה שנייה, מציאת שורשים ממשיים ומרוכבים, קודקוד הפרבולה ותרשים גרפי." },
    es: { title: "Calculadora de Ecuaciones Cuadráticas (ax² + bx + c = 0)", description: "Halla raíces reales y complejas, discriminante, vértice y gráfica de la parábola." },
    fr: { title: "Résolveur d'Équations du Second Degré (ax² + bx + c = 0)", description: "Résolvez les équations du second degré avec calcul du discriminant Δ, sommet et graphe." },
    ar: { title: "حاسبة المعادلات التربيعية (ax² + bx + c = 0)", description: "إيجاد الجذور الحقيقية والمركبة والمميز ورأس القطع المكافئ مع الرسم البياني." },
  },
  "linear-system": {
    en: { title: "System of Linear Equations Solver (2x2)", description: "Solve simultaneous linear equations step-by-step using Cramer's rule determinants and intersection lines graph." },
    he: { title: "מחשבון מערכת משוואות לינאריות (2 נעלמים)", description: "פתרון שתי משוואות בשני נעלמים צעד אחר צעד לפי כלל קרמר, דטרמיננטות ונקודת חיתוך גרפית." },
    es: { title: "Calculadora de Sistemas de Ecuaciones Lineales (2x2)", description: "Resuelve sistemas lineales simultáneos con la regla de Cramer y visualiza el punto de corte." },
    fr: { title: "Résolveur de Systèmes d'Équations Linéaires (2x2)", description: "Résolvez les systèmes à deux inconnues avec les déterminants de Cramer et tracé des droites." },
    ar: { title: "حاسبة أنظمة المعادلات الخطية (2x2)", description: "حل معادلتين خطيتين بمجهولين بطريقة كرامر والمحددات مع إيجاد نقطة التقاطع والتمثيل البياني." },
  },
  "base-converter": {
    en: { title: "Binary, Hex, Octal & Base Converter", description: "Convert integers between Binary, Octal, Decimal, Hexadecimal, and any custom radix from base 2 to 36." },
    he: { title: "ממיר בסיסים: בינארי, הקסדצימלי, אוקטלי ועשרוני", description: "המרת מספרים מהירה בין בסיס 2, 8, 10, 16 וכל בסיס מותאם אישית (2-36) עם פירוק סיביות." },
    es: { title: "Conversor de Bases (Binario, Hex, Octal, Decimal)", description: "Conversión entre bases 2, 8, 10, 16 y bases personalizadas con representación binaria." },
    fr: { title: "Convertisseur de Bases (Binaire, Hex, Octal, Décimal)", description: "Convertissez instantanément vos nombres entre binaire, hexadécimal, octal et décimal." },
    ar: { title: "محول أنظمة العد (ثنائي، سداسي عشر، ثماني، عشري)", description: "تحويل الأعداد بين النظام الثنائي، العشري، السداسي عشري وأي أساس مخصص من 2 إلى 36." },
  },
  "bitwise-calculator": {
    en: { title: "Bitwise Calculator & Binary Logic Operators", description: "Evaluate AND, OR, XOR, NOT, Bit Shifts (<<, >>) on 8, 16, or 32-bit integers with truth tables." },
    he: { title: "מחשבון פעולות סיביות (Bitwise) ושערים לוגיים", description: "חישוב שערים לוגיים AND, OR, XOR, NOT, הזזות סיביות שמאלה וימינה וטבלת אמת בינארית." },
    es: { title: "Calculadora Bitwise y Operadores Lógicos", description: "Evalúa compuertas AND, OR, XOR, NOT y desplazamientos de bits en enteros de 8, 16 y 32 bits." },
    fr: { title: "Calculateur Bitwise et Opérateurs Logiques", description: "Calculez AND, OR, XOR, NOT et décalages bit à bit sur 8, 16 ou 32 bits avec table de vérité." },
    ar: { title: "حاسبة العمليات على مستوى البتات (Bitwise)", description: "تقييم البوابات المنطقية AND, OR, XOR, NOT وإزاحة البتات مع جدول مقارنة ثنائي متكامل." },
  },
  "triangle-solver": {
    en: { title: "Triangle Solver & Trigonometry Calculator", description: "Solve triangle sides, angles, area via Heron's formula, inradius, and circumradius." },
    he: { title: "מחשבון משולשים וטריגונומטריה", description: "חישוב זוויות, צלעות, שטח לפי נוסחת הרון, רדיוס מעגל חוסם וחסום." },
    es: { title: "Calculadora de Triángulos y Trigonometría", description: "Resuelve lados, ángulos, área con fórmula de Herón y radios circunscrito e inscrito." },
    fr: { title: "Résolveur de Triangles et Trigonométrie", description: "Angles, côtés, aire (Héron), rayons inscrit et circonscrit." },
    ar: { title: "حاسبة حل المثلثات وحساب المثلثات", description: "حساب الزوايا، الأضلاع، المساحة بصيغة هيرون ونصف قطر الدائرة الداخلية والخارجية." },
  },
  "circle-sector": {
    en: { title: "Circle Sector & Arc Length Calculator", description: "Compute arc length, sector area, chord length, and circular segment area." },
    he: { title: "מחשבון גזרה וקשת במעגל", description: "חישוב אורך קשת, שטח גזרה, אורך מיתר ושטח מקטע מעגלי מרדיוס וזווית מרכזית." },
    es: { title: "Calculadora de Sector Circular y Longitud de Arco", description: "Calcula longitud de arco, área del sector circular, cuerda y segmento circular." },
    fr: { title: "Calculateur de Secteur Circulaire et Longueur d'Arc", description: "Calculez la longueur d'arc, aire du secteur, corde et segment circulaire." },
    ar: { title: "حاسبة القطاع الدائري وطول القوس", description: "حساب طول القوس، مساحة القطاع الدائري، طول الوتر ومساحة القطعة الدائرية." },
  },
  "matrix-calculator": {
    en: { title: "Matrix Calculator & Linear Algebra", description: "Calculate determinant, inverse, transpose, rank, trace, and matrix operations (A+B, A-B, A×B)." },
    he: { title: "מחשבון מטריצות ואלגברה לינארית", description: "חישוב דטרמיננטה, מטריצה הופכית, שחלוף, דרגה, עקבה ופעולות כפל וחיבור מטריצות." },
    es: { title: "Calculadora de Matrices y Álgebra Lineal", description: "Calcula determinante, inversa, traspuesta, rango, traza y operaciones matriciales paso a paso." },
    fr: { title: "Calculateur de Matrices et Algèbre Linéaire", description: "Déterminant, inverse, transposée, rang, trace et produit matriciel étape par étape." },
    ar: { title: "حاسبة المصفوفات والجبر الخطي", description: "حساب المحدد، المعكوس، المنقول، الرتبة، الأثر والعمليات الحسابية خطوة بخطوة." },
  },
  "complex-numbers": {
    en: { title: "Complex Numbers Calculator", description: "Arithmetic, polar/Euler form, modulus, argument, powers (De Moivre), and Argand diagram." },
    he: { title: "מחשבון מספרים מרוכבים", description: "פעולות חשבון, הצגה קוטבית ואוילר, מודולוס, ארגומנט, חזקות (דה-מואבר) ודיאגרמת ארגנד." },
    es: { title: "Calculadora de Números Complejos", description: "Aritmética, forma polar y Euler, módulo, argumento, potencias (De Moivre) y plano complejo." },
    fr: { title: "Calculateur de Nombres Complexes", description: "Formes polaire/Euler, module, argument, puissances de De Moivre et diagramme d'Argand." },
    ar: { title: "حاسبة الأعداد المركبة", description: "العمليات الحسابية، الصيغة القطبية وأويلر، المقياس، السعة، قوى دي موافر والمستوى المركب." },
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
  {
    id: "currency-converter",
    path: "/calculators/currency-converter",
    fallbackTitle: "Currency Converter",
    description: "Real-time foreign exchange rate calculator.",
    category: "finance",
    tags: ["currency","money","exchange","forex","travel"],
  },
  {
    id: "sleep-calculator",
    path: "/calculators/sleep-calculator",
    fallbackTitle: "Sleep Calculator",
    description: "Find the best time to go to sleep or wake up.",
    category: "health",
    tags: ["sleep","health","lifestyle","cycles","time"],
  },
  {
    id: "cooking-timer",
    path: "/calculators/cooking-timer",
    fallbackTitle: "Cooking Timer",
    description: "Calculate optimal roasting time and temperature for meat.",
    category: "lifestyle",
    tags: ["cooking","food","meat","bbq","timer"],
  },
  {
    id: "severance-pay",
    path: "/calculators/severance-pay",
    fallbackTitle: "Severance Pay",
    description: "Calculate estimated severance pay based on tenure and salary.",
    category: "finance",
    tags: ["job","severance","salary","work","finance"],
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
  {
    id: "stock-options-rsu",
    path: "/calculators/stock-options-rsu",
    fallbackTitle: "Stock Options & RSU Calculator",
    description: "Calculate vesting schedules, Section 102 tax, dilution, and exit scenarios.",
    category: "finance",
    tags: ["options", "rsu", "equity", "vesting", "102", "tax", "hitech", "salary", "exit", "startup"],
  },
  {
    id: "purchase-appreciation-tax",
    path: "/calculators/purchase-appreciation-tax",
    fallbackTitle: "Purchase & Appreciation Tax Calculator",
    description: "Calculate Israel tiered purchase tax brackets and linear appreciation tax.",
    category: "real-estate",
    tags: ["real estate", "purchase tax", "appreciation", "mas rechisha", "mas shevach", "property", "tax", "apartment"],
  },
  {
    id: "employer-cost",
    path: "/calculators/employer-cost",
    fallbackTitle: "Employer Total Cost vs Net Salary",
    description: "Calculate total employer cost, pension, study fund, taxes, and net take-home pay.",
    category: "finance",
    tags: ["employer", "salary", "net", "gross", "cost", "pension", "taxes", "payroll", "social security"],
  },
  {
    id: "z-score",
    path: "/calculators/z-score",
    fallbackTitle: "Z-Score & Normal Distribution Calculator",
    description: "Calculate standard scores (Z), cumulative normal probabilities P(Z < z), percentiles, and inverse raw scores.",
    category: "math",
    tags: ["z-score", "statistics", "normal distribution", "bell curve", "standard deviation", "percentile", "p-value", "math"],
  },
  {
    id: "linear-regression",
    path: "/calculators/linear-regression",
    fallbackTitle: "Linear Regression & Correlation Calculator",
    description: "Calculate least squares line y = mx + b, Pearson correlation r, R², and scatter plot trendline.",
    category: "math",
    tags: ["linear regression", "correlation", "pearson r", "r-squared", "least squares", "scatter plot", "trendline", "statistics", "math"],
  },
  {
    id: "quadratic-equation",
    path: "/calculators/quadratic-equation",
    fallbackTitle: "Quadratic Equation Solver (ax² + bx + c = 0)",
    description: "Find real and complex roots, discriminant, parabola vertex apex, and interactive curve graph.",
    category: "math",
    tags: ["quadratic equation", "parabola", "algebra", "roots", "discriminant", "vertex", "math", "formulas"],
  },
  {
    id: "linear-system",
    path: "/calculators/linear-system",
    fallbackTitle: "System of Linear Equations Solver (2x2)",
    description: "Solve simultaneous linear equations step-by-step using Cramer's rule determinants and intersection lines graph.",
    category: "math",
    tags: ["linear equations", "systems of equations", "cramer rule", "determinant", "algebra", "intersection", "math"],
  },
  {
    id: "base-converter",
    path: "/calculators/base-converter",
    fallbackTitle: "Binary, Hex, Octal & Base Converter",
    description: "Convert integers between Binary, Octal, Decimal, Hexadecimal, and custom radix from base 2 to 36.",
    category: "tech",
    tags: ["base converter", "binary", "hexadecimal", "octal", "decimal", "radix", "computer science", "bits", "programming"],
  },
  {
    id: "bitwise-calculator",
    path: "/calculators/bitwise-calculator",
    fallbackTitle: "Bitwise Calculator & Binary Logic Operators",
    description: "Evaluate AND, OR, XOR, NOT, Bit Shifts (<<, >>) on 8, 16, or 32-bit integers with truth tables.",
    category: "tech",
    tags: ["bitwise", "logic gates", "and", "or", "xor", "not", "bit shift", "binary", "computer science", "programming"],
  },
  {
    id: "triangle-solver",
    path: "/calculators/triangle-solver",
    fallbackTitle: "Triangle Solver & Trigonometry Calculator",
    description: "Solve triangle sides, angles, area via Heron's formula, inradius, and circumradius.",
    category: "math",
    tags: ["triangle", "trigonometry", "heron formula", "law of cosines", "geometry", "angles", "hypotenuse", "math"],
  },
  {
    id: "circle-sector",
    path: "/calculators/circle-sector",
    fallbackTitle: "Circle Sector & Arc Length Calculator",
    description: "Compute arc length, sector area, chord length, and circular segment area.",
    category: "math",
    tags: ["circle", "sector", "arc length", "chord", "segment", "radians", "geometry", "trigonometry", "math"],
  },
  {
    id: "matrix-calculator",
    path: "/calculators/matrix-calculator",
    fallbackTitle: "Matrix Calculator & Linear Algebra",
    description: "Calculate determinant, inverse, transpose, rank, trace, and matrix operations (A+B, A-B, A×B).",
    category: "math",
    tags: ["matrix", "linear algebra", "determinant", "inverse matrix", "transpose", "rank", "trace", "matrix multiplication", "math"],
  },
  {
    id: "complex-numbers",
    path: "/calculators/complex-numbers",
    fallbackTitle: "Complex Numbers Calculator",
    description: "Arithmetic, polar/Euler form, modulus, argument, powers (De Moivre), and Argand diagram.",
    category: "math",
    tags: ["complex numbers", "polar form", "euler formula", "modulus", "argument", "de moivre", "imaginary", "argand diagram", "math"],
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
