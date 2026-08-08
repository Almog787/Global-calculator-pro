const fs = require('fs');
let code = fs.readFileSync('src/contexts/i18n.tsx', 'utf8');

const newEn = `
    bmiTitle: 'BMI Calculator',
    bmiDesc: 'Check your Body Mass Index.',
    bmiExplanation: 'Enter your height and weight to calculate your BMI and see which category you fall into.',
    height: 'Height',
    weightBmi: 'Weight',
    bmiResult: 'Your BMI',
    bmiCategory: 'Category',

    tipTitle: 'Tip Calculator',
    tipDesc: 'Calculate tips and split bills easily.',
    tipExplanation: 'Enter the bill amount and tip percentage to calculate the total and how much each person should pay.',
    billAmount: 'Bill Amount',
    tipPercentage: 'Tip %',
    numberOfPeople: 'Number of People',
    tipAmount: 'Tip Amount',
    totalPerPerson: 'Total per Person',

    salaryTitle: 'Salary Calculator',
    salaryDesc: 'Convert hourly, weekly, monthly, and annual salaries.',
    salaryExplanation: 'Enter your salary in any frequency to see the equivalent amount in other frequencies.',
    salaryAmount: 'Salary Amount',
    salaryFrequency: 'Frequency',
    hourly: 'Hourly',
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly',

    ageTitle: 'Age Calculator',
    ageDesc: 'Calculate your exact age in years, months, and days.',
    ageExplanation: 'Enter your date of birth to find out exactly how old you are today.',
    dateOfBirth: 'Date of Birth',
    exactAge: 'Exact Age',
    yearsOld: 'Years',
    monthsOld: 'Months',
    daysOld: 'Days'
  },`;

const newHe = `
    bmiTitle: 'מחשבון BMI',
    bmiDesc: 'בדוק את מדד מסת הגוף שלך.',
    bmiExplanation: 'הזן את הגובה והמשקל שלך כדי לחשב את ה-BMI שלך ולראות לאיזו קטגוריה אתה שייך.',
    height: 'גובה',
    weightBmi: 'משקל',
    bmiResult: 'ה-BMI שלך',
    bmiCategory: 'קטגוריה',

    tipTitle: 'מחשבון טיפים',
    tipDesc: 'חשב טיפים ופצל חשבונות בקלות.',
    tipExplanation: 'הזן את סכום החשבון ואחוז הטיפ כדי לחשב את הסך הכל וכמה כל אדם צריך לשלם.',
    billAmount: 'סכום החשבון',
    tipPercentage: 'אחוז טיפ',
    numberOfPeople: 'מספר אנשים',
    tipAmount: 'סכום הטיפ',
    totalPerPerson: 'סך הכל לאדם',

    salaryTitle: 'מחשבון שכר',
    salaryDesc: 'המרת שכר שעתי, שבועי, חודשי ושנתי.',
    salaryExplanation: 'הזן את השכר שלך בכל תדירות כדי לראות את הסכום המקביל בתדירויות אחרות.',
    salaryAmount: 'סכום השכר',
    salaryFrequency: 'תדירות',
    hourly: 'שעתי',
    weekly: 'שבועי',
    monthly: 'חודשי',
    yearly: 'שנתי',

    ageTitle: 'מחשבון גיל',
    ageDesc: 'חשב את גילך המדויק בשנים, חודשים וימים.',
    ageExplanation: 'הזן את תאריך הלידה שלך כדי לגלות בדיוק בן כמה אתה היום.',
    dateOfBirth: 'תאריך לידה',
    exactAge: 'גיל מדויק',
    yearsOld: 'שנים',
    monthsOld: 'חודשים',
    daysOld: 'ימים'
  },`;

const newEs = `
    bmiTitle: 'Calculadora de IMC',
    bmiDesc: 'Comprueba tu Índice de Masa Corporal.',
    bmiExplanation: 'Ingresa tu altura y peso para calcular tu IMC y ver en qué categoría te encuentras.',
    height: 'Altura',
    weightBmi: 'Peso',
    bmiResult: 'Tu IMC',
    bmiCategory: 'Categoría',

    tipTitle: 'Calculadora de Propinas',
    tipDesc: 'Calcula propinas y divide cuentas fácilmente.',
    tipExplanation: 'Ingresa el monto de la cuenta y el porcentaje de propina para calcular el total y cuánto debe pagar cada persona.',
    billAmount: 'Monto de la Cuenta',
    tipPercentage: '% de Propina',
    numberOfPeople: 'Número de Personas',
    tipAmount: 'Monto de Propina',
    totalPerPerson: 'Total por Persona',

    salaryTitle: 'Calculadora de Salario',
    salaryDesc: 'Convierte salarios por hora, semanales, mensuales y anuales.',
    salaryExplanation: 'Ingresa tu salario en cualquier frecuencia para ver el monto equivalente en otras frecuencias.',
    salaryAmount: 'Monto del Salario',
    salaryFrequency: 'Frecuencia',
    hourly: 'Por Hora',
    weekly: 'Semanal',
    monthly: 'Mensual',
    yearly: 'Anual',

    ageTitle: 'Calculadora de Edad',
    ageDesc: 'Calcula tu edad exacta en años, meses y días.',
    ageExplanation: 'Ingresa tu fecha de nacimiento para descubrir exactamente cuántos años tienes hoy.',
    dateOfBirth: 'Fecha de Nacimiento',
    exactAge: 'Edad Exacta',
    yearsOld: 'Años',
    monthsOld: 'Meses',
    daysOld: 'Días'
  },`;

const newFr = `
    bmiTitle: 'Calculatrice IMC',
    bmiDesc: 'Vérifiez votre Indice de Masse Corporelle.',
    bmiExplanation: 'Entrez votre taille et votre poids pour calculer votre IMC et voir dans quelle catégorie vous vous situez.',
    height: 'Taille',
    weightBmi: 'Poids',
    bmiResult: 'Votre IMC',
    bmiCategory: 'Catégorie',

    tipTitle: 'Calculatrice de Pourboire',
    tipDesc: 'Calculez les pourboires et divisez les additions facilement.',
    tipExplanation: 'Entrez le montant de l\'addition et le pourcentage de pourboire pour calculer le total et combien chaque personne doit payer.',
    billAmount: 'Montant de l\'Addition',
    tipPercentage: '% de Pourboire',
    numberOfPeople: 'Nombre de Personnes',
    tipAmount: 'Montant du Pourboire',
    totalPerPerson: 'Total par Personne',

    salaryTitle: 'Calculatrice de Salaire',
    salaryDesc: 'Convertissez les salaires horaires, hebdomadaires, mensuels et annuels.',
    salaryExplanation: 'Entrez votre salaire pour n\'importe quelle fréquence afin de voir le montant équivalent pour d\'autres fréquences.',
    salaryAmount: 'Montant du Salaire',
    salaryFrequency: 'Fréquence',
    hourly: 'Horaire',
    weekly: 'Hebdomadaire',
    monthly: 'Mensuel',
    yearly: 'Annuel',

    ageTitle: 'Calculatrice d\'Âge',
    ageDesc: 'Calculez votre âge exact en années, mois et jours.',
    ageExplanation: 'Entrez votre date de naissance pour découvrir exactement quel âge vous avez aujourd\'hui.',
    dateOfBirth: 'Date de Naissance',
    exactAge: 'Âge Exact',
    yearsOld: 'Années',
    monthsOld: 'Mois',
    daysOld: 'Jours'
  },`;

const newAr = `
    bmiTitle: 'حاسبة مؤشر كتلة الجسم',
    bmiDesc: 'تحقق من مؤشر كتلة الجسم الخاص بك.',
    bmiExplanation: 'أدخل طولك ووزنك لحساب مؤشر كتلة الجسم الخاص بك ومعرفة الفئة التي تقع فيها.',
    height: 'الطول',
    weightBmi: 'الوزن',
    bmiResult: 'مؤشر كتلة الجسم الخاص بك',
    bmiCategory: 'الفئة',

    tipTitle: 'حاسبة الإكرامية',
    tipDesc: 'حساب الإكراميات وتقسيم الفواتير بسهولة.',
    tipExplanation: 'أدخل مبلغ الفاتورة ونسبة الإكرامية لحساب الإجمالي والمبلغ الذي يجب أن يدفعه كل شخص.',
    billAmount: 'مبلغ الفاتورة',
    tipPercentage: 'نسبة الإكرامية %',
    numberOfPeople: 'عدد الأشخاص',
    tipAmount: 'مبلغ الإكرامية',
    totalPerPerson: 'الإجمالي لكل شخص',

    salaryTitle: 'حاسبة الراتب',
    salaryDesc: 'تحويل الرواتب بالساعة والأسبوع والشهر والسنة.',
    salaryExplanation: 'أدخل راتبك بأي تكرار لمعرفة المبلغ المعادل بالتكرارات الأخرى.',
    salaryAmount: 'مبلغ الراتب',
    salaryFrequency: 'التكرار',
    hourly: 'بالساعة',
    weekly: 'أسبوعي',
    monthly: 'شهري',
    yearly: 'سنوي',

    ageTitle: 'حاسبة العمر',
    ageDesc: 'احسب عمرك الدقيق بالسنوات والأشهر والأيام.',
    ageExplanation: 'أدخل تاريخ ميلادك لمعرفة عمرك بالضبط اليوم.',
    dateOfBirth: 'تاريخ الميلاد',
    exactAge: 'العمر الدقيق',
    yearsOld: 'سنوات',
    monthsOld: 'أشهر',
    daysOld: 'أيام'
  },`;

code = code.replace(/totalInterestEarned: 'Total Interest Earned'\n  },/g, "totalInterestEarned: 'Total Interest Earned',\n" + newEn);
code = code.replace(/totalInterestEarned: 'סך ריבית שנצברה'\n  },/g, "totalInterestEarned: 'סך ריבית שנצברה',\n" + newHe);
code = code.replace(/totalInterestEarned: 'Total de Intereses Ganados'\n  },/g, "totalInterestEarned: 'Total de Intereses Ganados',\n" + newEs);
code = code.replace(/totalInterestEarned: 'Total des Intérêts Gagnés'\n  },/g, "totalInterestEarned: 'Total des Intérêts Gagnés',\n" + newFr);
code = code.replace(/totalInterestEarned: 'إجمالي الفائدة المكتسبة'\n  },/g, "totalInterestEarned: 'إجمالي الفائدة المكتسبة',\n" + newAr);

fs.writeFileSync('src/contexts/i18n.tsx', code);
