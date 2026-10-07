export interface WidgetOption {
  id: string;
  slug: string;
  name: { en: string; he: string; es: string; fr: string; ar: string; ru: string };
  description: { en: string; he: string; es: string; fr: string; ar: string; ru: string };
  category: string;
  icon: string;
  defaultHeight: number;
}

export const AVAILABLE_WIDGETS: WidgetOption[] = [
  {
    id: 'mortgage',
    slug: 'mortgage-calculator',
    name: {
      en: 'Mortgage & Loan Calculator',
      he: 'מחשבון משכנתא והלוואות',
      es: 'Calculadora de Hipoteca y Préstamos',
      fr: 'Calculateur de Prêt Immobilier',
      ar: 'حاسبة الرهن العقاري والقروض'
    ,
      ru: 'Ипотечный калькулятор'
    },
    description: {
      en: 'Calculate monthly amortized mortgage payments, total interest, and scenario comparisons.',
      he: 'חישוב החזר חודשי, לוח סילוקין, ריבית מצטברת והשוואת מסלולים.',
      es: 'Calcula pagos mensuales de hipoteca, intereses totales y amortización.',
      fr: 'Calculez vos mensualités, le coût total du crédit et l\'amortissement.',
      ar: 'حساب الأقساط الشهرية للرهن العقاري، إجمالي الفוائد وجدول السداد.'
    ,
      ru: 'Расчет ежемесячных платежей по ипотеке, переплаты по процентам и сравнение графиков.'
    },
    category: 'Finance / Real Estate',
    icon: 'home',
    defaultHeight: 680
  },
  {
    id: 'compound',
    slug: 'compound-interest',
    name: {
      en: 'Compound Interest & Wealth Planner',
      he: 'מחשבון ריבית דריבית ותכנון הון',
      es: 'Calculadora de Interés Compuesto',
      fr: 'Calculateur d\'Intérêts Composés',
      ar: 'حاسبة الفائدة المركبة والادخار'
    ,
      ru: 'Калькулятор сложных процентов'
    },
    description: {
      en: 'Project future investment wealth, monthly DCA compounding, and reverse retirement targets.',
      he: 'חיזוי צמיחת תיק השקעות, ריבית דריבית חודשית וחישוב הפקדה ליעד הון.',
      es: 'Proyecta el crecimiento de tus ahorros e inversiones a largo plazo.',
      fr: 'Simulez l\'effet boule de neige des intérêts composés et votre épargne.',
      ar: 'توقع نمو استثماراتك وادخارك المالي المستقبلي بالفوائد المركبة.'
    ,
      ru: 'Расчет прироста инвестиционного капитала, ежемесячных довложений и финансовой цели.'
    },
    category: 'Finance / Investing',
    icon: 'trending_up',
    defaultHeight: 700
  },
  {
    id: 'salary',
    slug: 'salary-calculator',
    name: {
      en: 'Salary & Net Income Calculator',
      he: 'מחשבון שכר נטו וברוטו',
      es: 'Calculadora de Salario Neto y Bruto',
      fr: 'Calculateur Salaire Brut / Net',
      ar: 'حاسبة الراتب الصافي والإجمالي'
    ,
      ru: 'Калькулятор зарплаты Gross / Net'
    },
    description: {
      en: 'Estimate gross to net take-home pay with income tax, social security, and health deductions.',
      he: 'חישוב מדויק של שכר נטו משכר ברוטו, כולל מדרגות מס הכנסה וביטוח לאומי.',
      es: 'Calcula el sueldo neto mensual a partir del bruto con retenciones fiscales.',
      fr: 'Convertissez salaire brut en salaire net avec les cotisations sociales.',
      ar: 'حساب الراتب الصافي بعد خصم الضرائب والتأمينات الاجتماعية.'
    ,
      ru: 'Расчет чистого дохода из оклада с учетом подоходного налога и социальных взносов.'
    },
    category: 'Work / Taxes',
    icon: 'payments',
    defaultHeight: 650
  },
  {
    id: 'bmi',
    slug: 'bmi-calculator',
    name: {
      en: 'BMI Health & Weight Index',
      he: 'מחשבון BMI ומשקל בריא',
      es: 'Calculadora de IMC y Peso Saludable',
      fr: 'Calculateur d\'IMC (Masse Corporelle)',
      ar: 'حاسبة مؤشر كتلة الجسم (BMI)'
    ,
      ru: 'Калькулятор индекса массы тела (ИМТ)'
    },
    description: {
      en: 'Evaluate body mass index, healthy weight range, and tailored health guidance.',
      he: 'חישוב מדד מסת הגוף (BMI), טווח משקל מומלץ לפי גובה וקטגוריות בריאות.',
      es: 'Determina el índice de masa corporal y rango de peso saludable.',
      fr: 'Évaluez votre indice de masse corporelle et zone de poids santé.',
      ar: 'تقييم مؤشر كتلة الجسم والوزن الصحي المثالي للبالغين.'
    ,
      ru: 'Оценка индекса массы тела, диапазона здорового веса и рекомендации ВОЗ.'
    },
    category: 'Health & Fitness',
    icon: 'monitor_weight',
    defaultHeight: 600
  },
  {
    id: 'percentage',
    slug: 'percentage-finder',
    name: {
      en: 'Percentage & Discount Calculator',
      he: 'מחשבון אחוזים והנחות',
      es: 'Calculadora de Porcentajes y Descuentos',
      fr: 'Calculateur de Pourcentages et Remises',
      ar: 'حاسبة النسب المئوية والخصومات'
    ,
      ru: 'Калькулятор процентов и скидок'
    },
    description: {
      en: 'Instant percentage increase, sale discounts, ratio comparisons, and reverse percentages.',
      he: 'חישוב אחוזים מכל סוג: שינוי באחוזים, הנחות במבצע, מע״מ והפרשים.',
      es: 'Calcula rebajas, aumento porcentual e impuestos rápidamente.',
      fr: 'Calculez remises commerciales, TVA et hausses en pourcentage.',
      ar: 'حساب الخصومات التجارية، الزيادة المئوية والضرائب بسهولة.'
    ,
      ru: 'Быстрый расчет скидок на распродаже, процентного изменения и наценки.'
    },
    category: 'Math & Commerce',
    icon: 'percent',
    defaultHeight: 580
  },
  {
    id: 'unit',
    slug: 'unit-converter',
    name: {
      en: 'Unit Converter (Length, Weight, Temp)',
      he: 'ממיר מידות ויחידות מידה',
      es: 'Conversor Universal de Unidades',
      fr: 'Convertisseur d\'Unités Universel',
      ar: 'محول وحدات القياس الشامل'
    ,
      ru: 'Универсальный конвертер величин'
    },
    description: {
      en: 'Convert units across metric and imperial systems with high-precision decimals.',
      he: 'המרה מהירה בין יחידות אורך, משקל, טמפרטורה, נפח ושטח בדיוק מקסימלי.',
      es: 'Convierte medidas métricas e imperiales al instante.',
      fr: 'Convertissez unités de longueur, masse, volume et température.',
      ar: 'تحويل وحدات الطول والوزن ودرجات الحرارة والمساحة بدقة فائقة.'
    ,
      ru: 'Мгновенный перевод единиц длины, веса, объема, температуры и площади.'
    },
    category: 'Science & Tools',
    icon: 'sync_alt',
    defaultHeight: 580
  },
  {
    id: 'tip',
    slug: 'tip-calculator',
    name: {
      en: 'Tip & Bill Split Calculator',
      he: 'מחשבון טיפ וחלוקת חשבון',
      es: 'Calculadora de Propinas y Cuentas',
      fr: 'Calculateur de Pourboire et Addition',
      ar: 'حاسبة البقشيش وتقسيم الفاتورة'
    ,
      ru: 'Калькулятор чаевых и деления счета'
    },
    description: {
      en: 'Split restaurant bills fairly among friends with custom gratuity percentages.',
      he: 'חישוב טיפ במסעדה וחלוקת חשבון שווה והוגנת בין סועדים בלחיצת כפתור.',
      es: 'Divide la cuenta del restaurante y añade la propina adecuada.',
      fr: 'Partagez l\'addition au restaurant et ajoutez le pourboire adapté.',
      ar: 'تقسيم فاتورة المطعم وحساب البقشيش العادل بين الأصدقاء.'
    ,
      ru: 'Разделение счета в ресторане и расчет справедливых чаевых на человека.'
    },
    category: 'Daily Living',
    icon: 'receipt_long',
    defaultHeight: 580
  },
  {
    id: 'age',
    slug: 'age-calculator',
    name: {
      en: 'Age & Milestone Calculator',
      he: 'מחשבון גיל וימי הולדת',
      es: 'Calculadora de Edad y Aniversarios',
      fr: 'Calculateur d\'Âge et Dates Clés',
      ar: 'حاسبة العمر وتواريخ الميلاد'
    ,
      ru: 'Калькулятор точного возраста'
    },
    description: {
      en: 'Calculate exact age in years, months, days, hours, and next upcoming birthday.',
      he: 'חישוב גיל מדויק בשנים, חודשים, ימים ושעות, יחד עם ספירה לאחור ליום ההולדת.',
      es: 'Calcula tu edad exacta en días, meses y próximo cumpleaños.',
      fr: 'Calculez votre âge exact et compte à rebours jusqu\'au prochain anniversaire.',
      ar: 'حساب العمر الدقيق بالسنوات والأشهر والأيام والساعات مع العد التنازلي.'
    ,
      ru: 'Расчет возраста в годах, месяцах, днях, часах и таймер до дня рождения.'
    },
    category: 'Personal Tools',
    icon: 'cake',
    defaultHeight: 580
  },
  {
    id: 'z-score',
    slug: 'calculators/z-score',
    name: {
      en: 'Z-Score & Normal Distribution Calculator',
      he: 'מחשבון ציון תקן Z והתפלגות נורמלית',
      es: 'Calculadora de Z-Score y Distribución Normal',
      fr: 'Calculateur de Score Z et Loi Normale',
      ar: 'حاسبة الدرجة المعيارية Z والتوزيع الطبيعي'
    ,
      ru: 'Калькулятор Z-оценки и распределения Гаусса'
    },
    description: {
      en: 'Compute standard normal Z-scores, percentiles, tail probabilities, and bell curves.',
      he: 'חישוב ציון תקן Z, הסתברויות זנב, אחוזונים ותרשים עקומת פעמון גאוס אינטראקטיבי.',
      es: 'Calcula puntuaciones Z, probabilidades acumuladas y campana de Gauss.',
      fr: 'Calculez le score Z standardisé, les percentiles et la courbe de Gauss.',
      ar: 'حساب الدرجة المعيارية Z، الاحتمالات التراكمية ومنحنى التوزيع الطبيعي.'
    ,
      ru: 'Статистический расчет Z-оценки, p-value, перцентилей и интерактивная колоколообразная кривая.'
    },
    category: 'Statistics & Math',
    icon: 'analytics',
    defaultHeight: 640
  },
  {
    id: 'linear-regression',
    slug: 'calculators/linear-regression',
    name: {
      en: 'Linear Regression & Correlation Calculator',
      he: 'מחשבון רגרסיה לינארית ומתאם פירסון',
      es: 'Calculadora de Regresión Lineal y Correlación',
      fr: 'Calculateur de Régression Linéaire et Corrélation',
      ar: 'حاسبة الانحدار الخطي ومعامل الارتباط'
    ,
      ru: 'Калькулятор линейной регрессии'
    },
    description: {
      en: 'Calculate best-fit line y = mx + b, Pearson r, R-squared, and scatter plot trendline.',
      he: 'מציאת קו מגמה y = mx + b, מקדם מתאם פירסון r, שונות מוסברת R² ותרשים פיזור.',
      es: 'Calcula la recta y = mx + b, correlación de Pearson y gráfico de dispersión.',
      fr: 'Trouvez la droite de régression, le coefficient de corrélation r et le nuage de points.',
      ar: 'إيجاد معادلة خط الانحدار ومعامل ارتباط بيرسون ومخطط التشتت.'
    ,
      ru: 'Построение линии тренда, вычисление коэффициента корреляции Пирсона r и R².'
    },
    category: 'Statistics & Math',
    icon: 'show_chart',
    defaultHeight: 660
  },
  {
    id: 'quadratic',
    slug: 'calculators/quadratic-equation',
    name: {
      en: 'Quadratic Equation Solver',
      he: 'מחשבון משוואה ריבועית ופרבולה',
      es: 'Calculadora de Ecuaciones Cuadráticas',
      fr: 'Résolveur d\'Équations du Second Degré',
      ar: 'حاسبة المعادلات التربيعية'
    ,
      ru: 'Решение квадратных уравнений'
    },
    description: {
      en: 'Solve quadratic equations ax² + bx + c = 0 with real/complex roots and vertex.',
      he: 'פתרון משוואות ריבועיות עם שורשים ממשיים ומרוכבים, דיסקרימיננטה וקודקוד פרבולה.',
      es: 'Halla raíces reales, complejas, vértice y discriminante.',
      fr: 'Résolvez les équations ax² + bx + c = 0 avec racines et tracé du sommet.',
      ar: 'حل المعادلات التربيعية مع إيجاد الجذور والمميز ورأس القطع المكافئ.'
    ,
      ru: 'Пошаговый расчет корней через дискриминант D с интерактивным графиком параболы.'
    },
    category: 'Algebra & Math',
    icon: 'function',
    defaultHeight: 650
  },
  {
    id: 'linear-system',
    slug: 'calculators/linear-system',
    name: {
      en: 'Linear Equations System Solver',
      he: 'מחשבון מערכת משוואות לינאריות',
      es: 'Sistemas de Ecuaciones Lineales',
      fr: 'Systèmes d\'Équations Linéaires',
      ar: 'حاسبة أنظمة المعادلات الخطية'
    ,
      ru: 'Решение систем уравнений 2x2'
    },
    description: {
      en: 'Solve 2x2 simultaneous linear systems using Cramer\'s rule and line intersections.',
      he: 'פתרון מערכת שתי משוואות בשני נעלמים בשיטת קרמר ומציאת נקודת חיתוך.',
      es: 'Resuelve sistemas 2x2 con determinantes y punto de intersección.',
      fr: 'Résolvez les systèmes à 2 inconnues avec la règle de Cramer.',
      ar: 'حل معادلتين خطيتين بمجهولين بطريقة كرامر مع الرسم البياني.'
    ,
      ru: 'Решение системы из 2 уравнений методом Крамера, матричным способом и графиком.'
    },
    category: 'Algebra & Math',
    icon: 'layers',
    defaultHeight: 650
  },
  {
    id: 'base-converter',
    slug: 'calculators/base-converter',
    name: {
      en: 'Binary, Hex & Base Converter',
      he: 'ממיר בסיסים: בינארי, הקסה ועשרוני',
      es: 'Conversor de Bases Numéricas',
      fr: 'Convertisseur de Bases Numériques',
      ar: 'محول أنظمة العد الثنائية والسداسية'
    ,
      ru: 'Конвертер систем счисления'
    },
    description: {
      en: 'Convert numbers across Binary, Octal, Decimal, Hexadecimal, and custom bases.',
      he: 'המרת מספרים מהירה בין בסיס 2, 8, 10, 16 וכל בסיס מותאם אישית.',
      es: 'Convierte números entre bases 2, 8, 10, 16 y personalizadas.',
      fr: 'Convertissez entre binaire, octal, décimal et hexadécimal.',
      ar: 'تحويل الأرقام بين النظام الثنائي والعشري والسداسي عشر.'
    ,
      ru: 'Перевод чисел между двоичной (BIN), восьмеричной (OCT), десятичной (DEC) и 16-ричной (HEX).'
    },
    category: 'Computer Science',
    icon: 'binary',
    defaultHeight: 600
  },
  {
    id: 'bitwise',
    slug: 'calculators/bitwise-calculator',
    name: {
      en: 'Bitwise Logic Calculator',
      he: 'מחשבון פעולות סיביות ולוגיקה',
      es: 'Calculadora Bitwise y Lógica',
      fr: 'Calculateur Bitwise et Logique',
      ar: 'حاسبة العمليات المنطقية على البتات'
    ,
      ru: 'Побитовый калькулятор'
    },
    description: {
      en: 'Evaluate AND, OR, XOR, NOT and Bit Shifts on 8, 16, 32-bit integers.',
      he: 'חישוב פעולות סיביות AND, OR, XOR, NOT והזזות סיביות בינאריות.',
      es: 'Calcula compuertas lógicas bit a bit y desplazamientos binarios.',
      fr: 'Évaluez les opérations bit à bit et décalages sur entiers.',
      ar: 'تقييم العمليات المنطقية على البتات مع جدول مقارنة ثنائي.'
    ,
      ru: 'Побитовые логические операции AND, OR, XOR, NOT и битовые сдвиги с наглядным представлением.'
    },
    category: 'Computer Science',
    icon: 'cpu',
    defaultHeight: 620
  },
  {
    id: 'triangle',
    slug: 'calculators/triangle-solver',
    name: {
      en: 'Triangle Solver',
      he: 'מחשבון משולשים וטריגונומטריה',
      es: 'Calculadora de Triángulos',
      fr: 'Résolveur de Triangles',
      ar: 'حاسبة حل المثلثات'
    ,
      ru: 'Калькулятор треугольника'
    },
    description: {
      en: 'Solve sides, angles, area via Heron\'s formula, inradius and circumradius.',
      he: 'חישוב זוויות, צלעות, שטח לפי הרון ורדיוס מעגל חוסם וחסום.',
      es: 'Halla lados, ángulos, área con fórmula de Herón y radios.',
      fr: 'Résolvez les triangles avec angles, formule de Héron et rayons.',
      ar: 'حساب زوايا وأضلاع ومساحة المثلث مع الدائرة المحيطة والداخلية.'
    ,
      ru: 'Расчет всех сторон, углов, высот, площади и периметра по теореме синусов и косинусов.'
    },
    category: 'Geometry & Math',
    icon: 'change_history',
    defaultHeight: 650
  },
  {
    id: 'circle-sector',
    slug: 'calculators/circle-sector',
    name: {
      en: 'Circle Sector & Arc Calculator',
      he: 'מחשבון גזרה וקשת במעגל',
      es: 'Sector Circular y Longitud de Arco',
      fr: 'Secteur Circulaire et Longueur d\'Arc',
      ar: 'حاسبة القطاع الدائري وطول القوس'
    ,
      ru: 'Калькулятор сектора круга и дуги'
    },
    description: {
      en: 'Calculate arc length, sector area, chord length, and segment area.',
      he: 'חישוב אורך קשת, שטח גזרה, אורך מיתר ושטח מקטע מעגלי מרדיוס וזווית.',
      es: 'Calcula arco, área del sector circular, cuerda y segmento.',
      fr: 'Calculez longueur d\'arc, aire du secteur, corde et segment.',
      ar: 'حساب طول القوس ومساحة القطاع والوتر والمقطع الدائري.'
    ,
      ru: 'Расчет площади сектора, длины дуги, хорды и сегмента по радиусу и центральному углу.'
    },
    category: 'Geometry & Math',
    icon: 'pie_chart',
    defaultHeight: 650
  },
  {
    id: 'matrix',
    slug: 'calculators/matrix-calculator',
    name: {
      en: 'Matrix Calculator & Linear Algebra',
      he: 'מחשבון מטריצות ואלגברה לינארית',
      es: 'Calculadora de Matrices',
      fr: 'Calculateur de Matrices',
      ar: 'حاسبة المصفوفات والجبر الخطي'
    ,
      ru: 'Матричный калькулятор онлайн'
    },
    description: {
      en: 'Determinant, inverse matrix, transpose, rank, trace, and matrix multiplication.',
      he: 'דטרמיננטה, מטריצה הופכית, שחלוף, דרגה, עקבה וכפל מטריצות.',
      es: 'Determinante, inversa, traspuesta, rango, traza y producto matricial.',
      fr: 'Déterminant, inverse, transposée, rang, trace et produit matriciel.',
      ar: 'المحدد والمعكوس والمنقول والرتبة والأثر وضرب المصفوفات.'
    ,
      ru: 'Операции с матрицами: умножение, определитель, обратная матрица, ранг и транспонирование.'
    },
    category: 'Linear Algebra & Math',
    icon: 'grid_on',
    defaultHeight: 680
  },
  {
    id: 'complex-numbers',
    slug: 'calculators/complex-numbers',
    name: {
      en: 'Complex Numbers Calculator',
      he: 'מחשבון מספרים מרוכבים',
      es: 'Calculadora de Números Complejos',
      fr: 'Calculateur de Nombres Complexes',
      ar: 'حاسبة الأعداد المركبة'
    ,
      ru: 'Калькулятор комплексных чисел'
    },
    description: {
      en: 'Arithmetic, polar & Euler forms, modulus, argument, and Argand plane diagram.',
      he: 'פעולות חשבון, הצגה קוטבית ואוילר, מודולוס, ארגומנט ומישור גאוס.',
      es: 'Aritmética, forma polar y Euler, módulo, argumento y plano complejo.',
      fr: 'Formes polaire et Euler, module, argument et plan complexe.',
      ar: 'العمليات الحسابية والصيغة القطبية وأويلر والمقياس والمستوى المركب.'
    ,
      ru: 'Арифметика комплексных чисел, алгебраическая, тригонометрическая формы и плоскость Гаусса.'
    },
    category: 'Advanced Math',
    icon: 'compass',
    defaultHeight: 680
  },
  {
    id: 'retirement',
    slug: 'calculators/retirement-planner',
    name: {
      en: 'Retirement & Pension Planner',
      he: 'מחשבון פנסיה ותכנון פרישה',
      es: 'Planificador de Jubilación y Pensiones',
      fr: 'Calculateur de Retraite et Pension',
      ar: 'حاسبة التقاعد والراتب التقاعدי',
      ru: 'Пенсионный калькулятор и планирование'
    },
    description: {
      en: 'Simulate pension accumulation, monthly benefits, annuity factor, and management fees.',
      he: 'חישוב צבירה פנסיונית בגיל פרישה, קצבה חודשית לפי מקדם המרה ודמי ניהול.',
      es: 'Calcula tu fondo de jubilación acumulado, pensión mensual estimada y comisiones.',
      fr: 'Estimez votre capital à la retraite, rente mensuelle et frais de gestion.',
      ar: 'محاكاة تراكم المدخرات التقاعدية والراتب الشهري المتوقع ورسوم الإدارة.',
      ru: 'Расчет пенсионных накоплений, ежемесячной пенсии и комиссий фонда.'
    },
    category: 'Finance / Pension',
    icon: 'account_balance',
    defaultHeight: 740
  },
  {
    id: 'capital-gains',
    slug: 'calculators/capital-gains-tax',
    name: {
      en: 'Capital Gains Tax Calculator',
      he: 'מחשבון מס רווחי הון והשקעות',
      es: 'Calculadora de Ganancias de Capital',
      fr: 'Calculateur de Plus-Values Mobilières',
      ar: 'حاسبة ضريبة الأرباح الرأسمالية',
      ru: 'Калькулятор налога на прирост капитала'
    },
    description: {
      en: 'Compute real and nominal capital gains tax on stocks, crypto, real estate, and loss offsets.',
      he: 'חישוב מס רווחי הון ריאלי (25%), ניכוי אינפלציה, קיזוז הפסדי עבר ומניות וקריפטו.',
      es: 'Calcula el impuesto sobre plusvalías en acciones, cripto e inversiones con ajuste de inflación.',
      fr: 'Calculez l\'impôt sur les plus-values d\'actions, crypto et investissements.',
      ar: 'حساب ضريبة أرباح الأسهم والعملات الرقمية والعقارات مع خصم التضخم والخסائر.',
      ru: 'Расчет налога на прибыль от акций, криптовалюты и недвижимости.'
    },
    category: 'Finance / Taxes',
    icon: 'request_quote',
    defaultHeight: 720
  },
  {
    id: 'car-finance-lease',
    slug: 'calculators/car-finance-lease',
    name: {
      en: 'Car Finance vs Lease vs Cash Calculator',
      he: 'מחשבון ליסינג מול מימון מול רכישה במזומן',
      es: 'Calculadora de Financiamiento vs Leasing vs Contado',
      fr: 'Crédit Auto vs Leasing (LOA/LLD) vs Comptant',
      ar: 'حاسبة تمويل السيارات مقابل التأجير التمويלי والنقد',
      ru: 'Калькулятор автокредита, лизинга и покупки за наличные'
    },
    description: {
      en: 'Compare auto loan finance, lease, and cash purchase. Evaluate monthly cost & retained equity.',
      he: 'השוואה מקיפה בין מימון בנקאי, עסקת ליסינג וקנייה במזומן כולל ירידת ערך ועלות נטו.',
      es: 'Compara préstamo de auto, leasing y compra al contado para encontrar la opción más económica.',
      fr: 'Comparez le crédit automobile classique, le leasing (LOA/LLD) et l\'achat au comptant.',
      ar: 'مقارنة دقيقة بين القرض البنكي، التأجير التمويلي، والدفع نقداً לשراء السيارات.',
      ru: 'Сравните автокредит, лизинг и покупку авто за наличные: ежемесячные взносы и чистая стоимость.'
    },
    category: 'Auto / Finance',
    icon: 'directions_car',
    defaultHeight: 720
  },
  {
    id: 'scientific-units',
    slug: 'calculators/scientific-unit-engine',
    name: {
      en: 'Scientific Unit Engine & Engineering Converter',
      he: 'ממיר מידות הנדסיות ומדעיות מורכבות',
      es: 'Motor de Conversión de Unidades Científicas e Ingeniería',
      fr: 'Convertisseur d\'Unités Scientifiques et Ingénierie',
      ar: 'محول الوحدات العلمية والهندسية المتقدم',
      ru: 'Инженерный конвертер физических и научных величин'
    },
    description: {
      en: 'High-precision conversions for Pressure, Energy, Power, Force, Torque, Flow Rate, Viscosity, Bandwidth.',
      he: 'המרה מדעית מתקדמת של לחץ, אנרגיה, הספק, כוח, מומנט, ספיקה, צמיגות, רוחב פס וטיפוגרפיה.',
      es: 'Conversiones de alta precisión para presión, energía, potencia, fuerza, torsión y viscosidad.',
      fr: 'Conversions haute précision pour pression, énergie, puissance, force, débit et viscosité.',
      ar: 'تحويلات فائقة الدقة للضغط، الطاقة، القدرة، القوة، عزم الدوران واللزوجة.',
      ru: 'Прецизионный перевод единиц давления, энергии, мощности, силы, крутящего момента и вязкости.'
    },
    category: 'Science & Engineering',
    icon: 'science',
    defaultHeight: 700
  }
];

export interface ColorPreset {
  id: string;
  name: { en: string; he: string; es: string; fr: string; ar: string; ru: string };
  primary: string;
  accent: string;
  theme: 'light' | 'dark';
}

export const THEME_PALETTES: ColorPreset[] = [
  {
    id: 'emerald-pro',
    name: { en: 'Emerald Brand (Default)', he: 'ירוק אמרלד מותגי (ברירת מחדל)', es: 'Verde Esmeralda Pro', fr: 'Émeraude Pro', ar: 'زمردي احترافي', ru: 'Изумрудный бренд' },
    primary: '#006B5B',
    accent: '#10B981',
    theme: 'light'
  },
  {
    id: 'sapphire-blue',
    name: { en: 'Sapphire Modern Blue', he: 'כחול ספיר מודרני', es: 'Azul Zafiro Moderno', fr: 'Bleu Saphir Moderne', ar: 'أزرق ياقوتي حديث', ru: 'Сапфировый синий' },
    primary: '#1E40AF',
    accent: '#3B82F6',
    theme: 'light'
  },
  {
    id: 'indigo-violet',
    name: { en: 'Royal Indigo & Purple', he: 'אינדיגו וסגול מלכותי', es: 'Índigo Real', fr: 'Indigo Royal', ar: 'نيلي ملكي', ru: 'Королевский индиго' },
    primary: '#4F46E5',
    accent: '#8B5CF6',
    theme: 'light'
  },
  {
    id: 'sunset-amber',
    name: { en: 'Sunset Amber & Orange', he: 'כתום שקיעה חם', es: 'Ámbar Cálido', fr: 'Ambre Couchant', ar: 'عنبري دافئ', ru: 'Янтарный закат' },
    primary: '#C2410C',
    accent: '#F97316',
    theme: 'light'
  },
  {
    id: 'obsidian-dark',
    name: { en: 'Obsidian Night (Dark Mode)', he: 'שחור אובסידיאן (מצב כהה)', es: 'Obsidiana Oscuro', fr: 'Noir Obsidienne', ar: 'أوبسيديان ليلي', ru: 'Темный обсидиан' },
    primary: '#10B981',
    accent: '#059669',
    theme: 'dark'
  }
];

export interface EmbedOptions {
  widget: WidgetOption;
  widgetLang: string;
  uiLang?: string;
  width: string;
  height: number;
  theme: 'light' | 'dark';
  primaryColor?: string;
  accentColor?: string;
  borderRadius?: number;
  shadow?: 'none' | 'subtle' | 'elevated' | 'deep';
  fontFamily?: string;
  showBorder?: boolean;
  includeBacklink: boolean;
}

export function buildEmbedUrl(
  slug: string,
  lang: string,
  theme: 'light' | 'dark' = 'light',
  customization?: { primaryColor?: string; accentColor?: string; borderRadius?: number }
): string {
  let url = `https://globalcalcpro.com/${lang}/${slug}?embed=true`;
  if (theme === 'dark') url += '&theme=dark';
  if (customization?.primaryColor && customization.primaryColor !== '#006B5B') {
    url += `&primary=${encodeURIComponent(customization.primaryColor.replace('#', ''))}`;
  }
  if (customization?.borderRadius !== undefined && customization.borderRadius !== 16) {
    url += `&radius=${customization.borderRadius}`;
  }
  return url;
}

export function buildCanonicalUrl(slug: string, lang: string): string {
  return `https://globalcalcpro.com/${lang}/${slug}`;
}

export function getShadowCss(shadow: 'none' | 'subtle' | 'elevated' | 'deep' = 'elevated'): string {
  switch (shadow) {
    case 'none':
      return 'none';
    case 'subtle':
      return '0 2px 8px -1px rgba(0, 0, 0, 0.04)';
    case 'deep':
      return '0 20px 35px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
    case 'elevated':
    default:
      return '0 8px 24px -2px rgba(0, 0, 0, 0.08)';
  }
}

export function generateIframeCode(options: EmbedOptions): string {
  const {
    widget,
    widgetLang,
    uiLang = 'en',
    width,
    height,
    theme,
    primaryColor,
    accentColor,
    borderRadius = 16,
    shadow = 'elevated',
    showBorder = true,
    includeBacklink
  } = options;

  const embedUrl = buildEmbedUrl(widget.slug, widgetLang, theme, { primaryColor, accentColor, borderRadius });
  const canonicalUrl = buildCanonicalUrl(widget.slug, widgetLang);
  const widgetTitle = widget.name[uiLang as keyof typeof widget.name] || widget.name.en;
  const poweredByText =
    uiLang === 'he'
      ? 'מופעל ע״י'
      : uiLang === 'es'
      ? 'Desarrollado por'
      : uiLang === 'fr'
      ? 'Propulsé par'
      : uiLang === 'ar'
      ? 'مشغل بواسطة'
      : uiLang === 'ru'
      ? 'Работает на'
      : 'Powered by';

  const borderStyle = showBorder ? (theme === 'dark' ? 'border: 1px solid #334155;' : 'border: 1px solid #e5e7eb;') : 'border: none;';
  const shadowValue = getShadowCss(shadow);
  const linkColor = primaryColor || '#006B5B';

  return `<iframe 
  src="${embedUrl}" 
  width="${width}" 
  height="${height}" 
  frameborder="0" 
  loading="lazy" 
  title="${widgetTitle}" 
  style="${borderStyle} border-radius: ${borderRadius}px; width: ${width}; max-width: 100%; box-shadow: ${shadowValue};"
></iframe>${
    includeBacklink
      ? `\n<p style="font-size: 12px; color: ${theme === 'dark' ? '#94a3b8' : '#6b7280'}; margin-top: 8px; text-align: center; font-family: system-ui, sans-serif;">
  ${poweredByText} <a href="${canonicalUrl}" target="_blank" rel="noopener noreferrer" style="color: ${linkColor}; text-decoration: underline; font-weight: 600;">GlobalCalc Pro</a>
</p>`
      : ''
  }`;
}

export function generateReactCode(options: EmbedOptions): string {
  const {
    widget,
    widgetLang,
    uiLang = 'en',
    width,
    height,
    theme,
    primaryColor,
    accentColor,
    borderRadius = 16,
    shadow = 'elevated',
    showBorder = true,
    includeBacklink
  } = options;

  const embedUrl = buildEmbedUrl(widget.slug, widgetLang, theme, { primaryColor, accentColor, borderRadius });
  const canonicalUrl = buildCanonicalUrl(widget.slug, widgetLang);
  const componentName = widget.id.replace(/-/g, '').charAt(0).toUpperCase() + widget.id.replace(/-/g, '').slice(1) + 'Widget';
  const widgetTitle = widget.name[uiLang as keyof typeof widget.name] || widget.name.en;
  const poweredByText =
    uiLang === 'he'
      ? 'מופעל ע״י'
      : uiLang === 'es'
      ? 'Desarrollado por'
      : uiLang === 'fr'
      ? 'Propulsé par'
      : uiLang === 'ar'
      ? 'مشغل بواسطة'
      : uiLang === 'ru'
      ? 'Работает на'
      : 'Powered by';

  const shadowValue = getShadowCss(shadow);
  const borderColor = showBorder ? (theme === 'dark' ? '#334155' : '#e5e7eb') : 'transparent';
  const linkColor = primaryColor || '#006B5B';

  return `import React from 'react';

export function ${componentName}() {
  return (
    <div style={{ width: '${width}', maxWidth: '100%', margin: '0 auto' }}>
      <iframe
        src="${embedUrl}"
        width="100%"
        height="${height}"
        frameBorder="0"
        loading="lazy"
        title="${widgetTitle}"
        style={{
          border: '1px solid ${borderColor}',
          borderRadius: '${borderRadius}px',
          boxShadow: '${shadowValue}',
          width: '100%'
        }}
      />
      ${
        includeBacklink
          ? `<p style={{ fontSize: '12px', color: '${theme === 'dark' ? '#94a3b8' : '#6b7280'}', marginTop: '8px', textAlign: 'center' }}>
        ${poweredByText}{' '}
        <a href="${canonicalUrl}" target="_blank" rel="noopener noreferrer" style={{ color: '${linkColor}', fontWeight: 600 }}>
          GlobalCalc Pro
        </a>
      </p>`
          : ''
      }
    </div>
  );
}`;
}

export function generateWordPressCode(options: EmbedOptions): string {
  const iframe = generateIframeCode(options);
  return `<!-- WordPress Custom HTML Block: Paste the following directly -->\n${iframe}`;
}

export function generateWebComponentCode(options: EmbedOptions): string {
  const { widget, widgetLang, uiLang = 'en', width, height, theme, primaryColor, accentColor, borderRadius = 16, shadow = 'elevated', showBorder = true, includeBacklink } = options;
  const embedUrl = buildEmbedUrl(widget.slug, widgetLang, theme, { primaryColor, accentColor, borderRadius });
  const canonicalUrl = buildCanonicalUrl(widget.slug, widgetLang);
  const widgetTitle = widget.name[uiLang as keyof typeof widget.name] || widget.name.en;
  const shadowValue = getShadowCss(shadow);
  const borderColor = showBorder ? (theme === 'dark' ? '#334155' : '#e5e7eb') : 'transparent';
  const linkColor = primaryColor || '#006B5B';

  return `<!-- GlobalCalc Pro Interactive Widget Container -->
<div class="gcp-calc-widget" style="width: ${width}; max-width: 100%; margin: 0 auto;">
  <iframe 
    src="${embedUrl}" 
    width="100%" 
    height="${height}" 
    style="border: 1px solid ${borderColor}; border-radius: ${borderRadius}px; box-shadow: ${shadowValue}; width: 100%; display: block;" 
    frameborder="0" 
    loading="lazy" 
    title="${widgetTitle}">
  </iframe>
  ${includeBacklink ? `<div style="text-align: center; margin-top: 6px; font-size: 11px; font-family: sans-serif; color: #888;">Powered by <a href="${canonicalUrl}" target="_blank" rel="noopener" style="color: ${linkColor}; text-decoration: none; font-weight: bold;">GlobalCalc Pro</a></div>` : ''}
</div>`;
}

