export interface ProgrammaticScenario {
  id: string;
  category: 'mortgage' | 'compound' | 'salary';
  title: {
    en: string;
    he: string;
    es: string;
    fr: string;
    ar: string;
  };
  description: {
    en: string;
    he: string;
    es: string;
    fr: string;
    ar: string;
  };
  badge: string;
  params: Record<string, any>;
  path: string;
  computedResult: {
    keyMetric: {
      en: string;
      he: string;
      es: string;
      fr: string;
      ar: string;
    };
    secondaryMetric: {
      en: string;
      he: string;
      es: string;
      fr: string;
      ar: string;
    };
  };
  faq: Array<{
    question: { en: string; he: string; es: string; fr: string; ar: string };
    answer: { en: string; he: string; es: string; fr: string; ar: string };
  }>;
}

export const POPULAR_MORTGAGE_SCENARIOS: ProgrammaticScenario[] = [
  {
    id: 'mortgage-1m-30y-5p',
    category: 'mortgage',
    title: {
      en: '$1,000,000 Mortgage for 30 Years at 5.0%',
      he: 'משכנתא 1,000,000 ₪ ל-30 שנה בריבית 5.0%',
      es: 'Hipoteca de $1.000.000 a 30 años al 5.0%',
      fr: 'Prêt de 1 000 000 € sur 30 ans à 5,0%',
      ar: 'رهن عقاري 1,000,000 لـ 30 سنة بفائدة 5.0%',
    },
    description: {
      en: 'Exact monthly repayment, total interest, and Spitzer amortization schedule for a $1,000,000 home loan.',
      he: 'חישוב מדויק של החזר חודשי, ריבית מצטברת ולוח סילוקין שפיצר למשכנתא של מיליון ש״ח בריבית שוק ממוצעת.',
      es: 'Cálculo de cuota mensual y coste total para préstamo de 1 millón a 30 años.',
      fr: 'Simulation complète d\'un emprunt d\'un million d\'euros sur 30 ans.',
      ar: 'حساب الأقساط الشهرية وجدول السداد لقرض مليون على 30 عاماً.',
    },
    badge: '1M / 30Y',
    params: { principal: 1000000, rate: 5.0, years: 30, mode: 'standard' },
    path: '/mortgage-calculator?principal=1000000&rate=5.0&years=30',
    computedResult: {
      keyMetric: {
        en: 'Monthly: $5,368 / mo',
        he: 'החזר חודשי: 5,368 ₪',
        es: 'Cuota: 5.368 $ / mes',
        fr: 'Mensualité : 5 368 € / mois',
        ar: 'القسط الشهري: 5,368',
      },
      secondaryMetric: {
        en: 'Total Interest: $932,558',
        he: 'סה״כ ריבית: 932,558 ₪',
        es: 'Interés Total: 932.558 $',
        fr: 'Coût Intérêts : 932 558 €',
        ar: 'إجمالي הפוائد: 932,558',
      },
    },
    faq: [
      {
        question: {
          en: 'How much is the monthly payment on a $1,000,000 mortgage for 30 years at 5%?',
          he: 'כמה החזר חודשי יוצא על משכנתא של 1,000,000 ש״ח ל-30 שנה בריבית 5%?',
          es: '¿Cuánto se paga al mes por una hipoteca de 1.000.000 a 30 años al 5%?',
          fr: 'Quelle est la mensualité pour un crédit de 1 000 000 € sur 30 ans à 5% ?',
          ar: 'كم يبلغ القسط الشهري لقرض بقيمة مليون على 30 سنة بفائدة 5%؟',
        },
        answer: {
          en: 'The monthly amortized payment is approximately $5,368 per month. Over 30 years (360 payments), you will repay a total of $1,932,558, of which $932,558 is total interest.',
          he: 'ההחזר החודשי בלוח שפיצר עומד על כ-5,368 ₪ לחודש. לאורך 30 שנה (360 תשלומים), סך כל ההחזרים לבנק יעמוד על כ-1,932,558 ₪, מתוכם 932,558 ₪ ריבית.',
          es: 'La cuota mensual aproximada es de 5.368 $. El total pagado en 30 años ascenderá a 1.932.558 $, de los cuales 932.558 $ corresponden a intereses.',
          fr: 'La mensualité estimée est de 5 368 €. Sur 30 ans, le remboursement total s\'élèvera à 1 932 558 €, dont 932 558 € d\'intérêts.',
          ar: 'القسط الشهري التقديري هو 5,368 شهرياً، بإجمالي سداد يصل إلى 1,932,558 منها 932,558 فوائد.',
        },
      },
    ],
  },
  {
    id: 'mortgage-800k-25y-4.8p',
    category: 'mortgage',
    title: {
      en: '$800,000 Mortgage for 25 Years at 4.8%',
      he: 'משכנתא 800,000 ₪ ל-25 שנה בריבית 4.8%',
      es: 'Hipoteca de $800.000 a 25 años al 4.8%',
      fr: 'Prêt de 800 000 € sur 25 ans à 4,8%',
      ar: 'رهن عقاري 800,000 لـ 25 سنة بفائدة 4.8%',
    },
    description: {
      en: 'Popular balanced loan scenario: 25 years with a competitive 4.8% rate.',
      he: 'תרחיש נפוץ מאוד לשדרוג דירה: הלוואה של 800 אלף ש״ח ל-25 שנה בריבית יציבה.',
      es: 'Escenario habitual de compra de vivienda con plazo equilibrado a 25 años.',
      fr: 'Prêt immobilier standard pour l\'acquisition d\'une résidence familiale.',
      ar: 'سيناريو قياسي لشراء منزل على مدى 25 عاماً بفائدة منافسة.',
    },
    badge: '800K / 25Y',
    params: { principal: 800000, rate: 4.8, years: 25, mode: 'standard' },
    path: '/mortgage-calculator?principal=800000&rate=4.8&years=25',
    computedResult: {
      keyMetric: {
        en: 'Monthly: $4,583 / mo',
        he: 'החזר חודשי: 4,583 ₪',
        es: 'Cuota: 4.583 $ / mes',
        fr: 'Mensualité : 4 583 € / mois',
        ar: 'القسط الشهري: 4,583',
      },
      secondaryMetric: {
        en: 'Total Interest: $574,842',
        he: 'סה״כ ריבית: 574,842 ₪',
        es: 'Interés Total: 574.842 $',
        fr: 'Coût Intérêts : 574 842 €',
        ar: 'إجمالي الفוائد: 574,842',
      },
    },
    faq: [
      {
        question: {
          en: 'What is the payment for an $800k mortgage over 25 years at 4.8%?',
          he: 'כמה משלמים בחודש על משכנתא של 800 אלף ש״ח ל-25 שנה בריבית 4.8%?',
          es: '¿Cuánto se paga por una hipoteca de 800.000 a 25 años al 4.8%?',
          fr: 'Combien coûte un emprunt de 800 000 € sur 25 ans à 4,8% ?',
          ar: 'ما هو القسط الشهري لقرض 800 ألف على 25 عاماً بفائدة 4.8%؟',
        },
        answer: {
          en: 'Your monthly payment is $4,583. Shortening the loan from 30 to 25 years saves more than $140,000 in total interest!',
          he: 'ההחזר החודשי הוא כ-4,583 ₪. קיצור התקופה מ-30 ל-25 שנה חוסך מעל 140,000 ₪ בתשלומי ריבית לבנק!',
          es: 'La cuota es de 4.583 $. ¡Reducir el plazo a 25 años ahorra más de 140.000 $ en intereses!',
          fr: 'La mensualité est de 4 583 €. Raccourcir le prêt à 25 ans permet d\'économiser plus de 140 000 € d\'intérêts !',
          ar: 'القسط هو 4,583، وتقليص المدة إلى 25 عاماً يوفر أكثر من 140,000 من الفוائد الإجمالية!',
        },
      },
    ],
  },
  {
    id: 'mortgage-500k-20y-4.5p',
    category: 'mortgage',
    title: {
      en: '$500,000 Mortgage for 20 Years at 4.5%',
      he: 'משכנתא 500,000 ₪ ל-20 שנה בריבית 4.5%',
      es: 'Hipoteca de $500.000 a 20 años al 4.5%',
      fr: 'Prêt de 500 000 € sur 20 ans à 4,5%',
      ar: 'رهن عقاري 500,000 لـ 20 سنة بفائدة 4.5%',
    },
    description: {
      en: 'Fast payoff scenario: $500k loan cleared in 20 years with minimal interest waste.',
      he: 'מסלול חיסכון מואץ: הלוואה של חצי מיליון ש״ח המסתיימת תוך 20 שנה במינימום ריבית.',
      es: 'Amortización rápida de $500k en 20 años con mínimo gasto en intereses.',
      fr: 'Remboursement rapide sur 20 ans pour minimiser le coût du crédit.',
      ar: 'خطة سداد سريعة خلال 20 عاماً مع تقليل الفوائد إلى أدنى حد.',
    },
    badge: '500K / 20Y',
    params: { principal: 500000, rate: 4.5, years: 20, mode: 'standard' },
    path: '/mortgage-calculator?principal=500000&rate=4.5&years=20',
    computedResult: {
      keyMetric: {
        en: 'Monthly: $3,163 / mo',
        he: 'החזר חודשי: 3,163 ₪',
        es: 'Cuota: 3.163 $ / mes',
        fr: 'Mensualité : 3 163 € / mois',
        ar: 'القسط الشهري: 3,163',
      },
      secondaryMetric: {
        en: 'Total Interest: $259,165',
        he: 'סה״כ ריבית: 259,165 ₪',
        es: 'Interés Total: 259.165 $',
        fr: 'Coût Intérêts : 259 165 €',
        ar: 'إجمالي הפוائد: 259,165',
      },
    },
    faq: [
      {
        question: {
          en: 'How much interest do I pay on a $500,000 20-year mortgage at 4.5%?',
          he: 'כמה ריבית משלמים בסה״כ על משכנתא 500,000 ש״ח ל-20 שנה ב-4.5%?',
          es: '¿Cuánto interés se paga por $500,000 a 20 años al 4.5%?',
          fr: 'Combien d\'intérêts paye-t-on pour 500 000 € sur 20 ans à 4,5% ?',
          ar: 'كم إجمالي الفוائد لقرض 500,000 على 20 سنة بنسبة 4.5%؟',
        },
        answer: {
          en: 'Total interest paid is approximately $259,165. Total payments equal $759,165.',
          he: 'סך הריבית שתשולם עומדת על כ-259,165 ₪ בלבד, וסך כל התשלומים יעמוד על 759,165 ₪.',
          es: 'El total de intereses será de aproximadamente 259.165 $, con un pago global de 759.165 $.',
          fr: 'Le total des intérêts payés est d\'environ 259 165 €, pour un coût global de 759 165 €.',
          ar: 'إجمالي الفוائد هو 259,165 فقط، مع سداد كلي قدره 759,165.',
        },
      },
    ],
  },
];

export const POPULAR_COMPOUND_SCENARIOS: ProgrammaticScenario[] = [
  {
    id: 'compound-500-20y-8p',
    category: 'compound',
    title: {
      en: '$500 / Month Investment for 20 Years at 8% Return',
      he: 'חיסכון של 500 ₪ בחודש ל-20 שנה בריבית 8%',
      es: 'Inversión de $500 al mes por 20 años al 8%',
      fr: 'Épargne de 500 € par mois pendant 20 ans à 8%',
      ar: 'استثمار 500 شهرياً لمدة 20 سنة بعائد 8%',
    },
    description: {
      en: 'See the compound interest snowball: how a modest $500 monthly deposit turns into nearly $300,000.',
      he: 'כוחה האמיתי של ריבית דריבית: כיצד הפקדה צנועה של 500 ₪ בחודש צומחת לכמעט 300,000 ₪.',
      es: 'El poder del interés compuesto: cómo $500 mensuales se convierten en casi $300.000.',
      fr: 'L\'effet boule de neige : comment 500 € mensuels génèrent près de 300 000 €.',
      ar: 'أثر الفائدة المركبة: كيف تتحول 500 شهرياً إلى نحو 300 ألف.',
    },
    badge: '500/MO • 20Y',
    params: { principal: 5000, contribution: 500, rate: 8.0, years: 20 },
    path: '/compound-interest?principal=5000&contribution=500&rate=8.0&years=20',
    computedResult: {
      keyMetric: {
        en: 'Future Wealth: $318,367',
        he: 'הון עתידי: 318,367 ₪',
        es: 'Patrimonio Final: 318.367 $',
        fr: 'Capital Futur : 318 367 €',
        ar: 'القيمة المستقبلية: 318,367',
      },
      secondaryMetric: {
        en: 'Interest Earned: $193,367 (61%)',
        he: 'רווחי ריבית: 193,367 ₪ (61%)',
        es: 'Intereses Ganados: 193.367 $ (61%)',
        fr: 'Intérêts Générés : 193 367 € (61%)',
        ar: 'أرباح الفوائد: 193,367 (61%)',
      },
    },
    faq: [
      {
        question: {
          en: 'How much will $500 a month be worth in 20 years at 8% compound interest?',
          he: 'כמה שווה הפקדה של 500 ₪ בחודש אחרי 20 שנה בריבית דריבית של 8%?',
          es: '¿Cuánto valdrá ahorrar $500 al mes durante 20 años al 8%?',
          fr: 'Que vaut une épargne de 500 € par mois après 20 ans à 8% ?',
          ar: 'كم تبلغ قيمة استثمار 500 شهرياً بعد 20 عاماً بعائد 8%؟',
        },
        answer: {
          en: 'With an initial deposit of $5,000 and $500 monthly at 8%, your portfolio grows to over $318,000. You deposited only $125,000, earning over $193,000 in pure compound interest!',
          he: 'בהפקדה ראשונית של 5,000 ₪ ו-500 ₪ בכל חודש בריבית שנתית של 8%, התיק יצמח לכ-318,000 ₪. מתוכם הפקדת מכיסך רק 125,000 ₪ והרווחת מעל 193,000 ₪ בריבית נטו!',
          es: 'Aportando $125.000 de tu bolsillo, tu capital superará los $318.000 gracias a más de $193.000 en ganancias.',
          fr: 'En ayant versé 125 000 €, votre capital atteint 318 000 € grâce à plus de 193 000 € d\'intérêts composés.',
          ar: 'بإيداع 125 ألفاً من مالك، يرتفع رصيدك إلى أكثر من 318 ألفاً بفضل أكثر من 193 ألفاً من الأرباح المركبة.',
        },
      },
    ],
  },
  {
    id: 'compound-1000-25y-9p',
    category: 'compound',
    title: {
      en: '$1,000 / Month Investment for 25 Years at 9% (S&P 500)',
      he: 'חיסכון של 1,000 ₪ בחודש ל-25 שנה בריבית 9% (מדד S&P 500)',
      es: 'Inversión de $1.000 al mes por 25 años al 9% (S&P 500)',
      fr: 'Épargne de 1 000 € par mois pendant 25 ans à 9% (S&P 500)',
      ar: 'استثمار 1,000 شهرياً لمدة 25 سنة بعائد 9% (مؤشر S&P 500)',
    },
    description: {
      en: 'Retirement wealth builder based on historical stock market index compounding: turns into over $1,100,000.',
      he: 'בניית הון לפרישה לפי התשואה ההיסטורית של שוק ההון: הפקדה חודשית של אלף שקל שהופכת למיליון ומאה אלף!',
      es: 'Plan de jubilación basado en la rentabilidad histórica bursátil: supera los $1.100.000.',
      fr: 'Stratégie retraite basée sur le rendement boursier historique : dépasse 1 100 000 €.',
      ar: 'بناء ثروة التقاعد بناءً على عوائد الأسهم التاريخية لتصل إلى أكثر من 1.1 مليون.',
    },
    badge: '1,000/MO • 25Y',
    params: { principal: 10000, contribution: 1000, rate: 9.0, years: 25 },
    path: '/compound-interest?principal=10000&contribution=1000&rate=9.0&years=25',
    computedResult: {
      keyMetric: {
        en: 'Future Wealth: $1,192,204',
        he: 'הון עתידי: 1,192,204 ₪',
        es: 'Patrimonio Final: 1.192.204 $',
        fr: 'Capital Futur : 1 192 204 €',
        ar: 'القيمة المستقبلية: 1,192,204',
      },
      secondaryMetric: {
        en: 'Interest Earned: $882,204 (74%)',
        he: 'רווחי ריבית: 882,204 ₪ (74%)',
        es: 'Intereses Ganados: 882.204 $ (74%)',
        fr: 'Intérêts Générés : 882 204 € (74%)',
        ar: 'أرباح الفוائد: 882,204 (74%)',
      },
    },
    faq: [
      {
        question: {
          en: 'Can you become a millionaire by investing $1,000 a month?',
          he: 'האם אפשר להגיע למיליון ש״ח על ידי השקעה של 1,000 ₪ בחודש?',
          es: '¿Se puede llegar a 1 millón invirtiendo $1.000 al mes?',
          fr: 'Peut-on devenir millionnaire en épargnant 1 000 € par mois ?',
          ar: 'هل يمكن الوصول إلى مليون باستثمار 1,000 شهرياً؟',
        },
        answer: {
          en: 'Yes. At an average 9% annual return over 25 years, depositing $1,000 per month creates over $1.19 million, with interest accounting for nearly 75% of the total fortune.',
          he: 'כן בהחלט. בתשואה ממוצעת של 9% לשנה (קרובה לממוצע ההיסטורי של מדד S&P 500) לאורך 25 שנה, הפקדה של 1,000 ₪ בחודש מניבה מעל 1,190,000 ₪!',
          es: 'Sí. Con un 9% anual durante 25 años, $1.000 al mes producen más de 1,19 millones de dólares.',
          fr: 'Oui, avec un rendement moyen de 9% sur 25 ans, 1 000 € par mois génèrent plus de 1,19 million d\'euros.',
          ar: 'نعم، بعائد سنوي متوسط 9% على مدى 25 عاماً، يولد استثمار 1,000 شهرياً أكثر من 1.19 مليون.',
        },
      },
    ],
  },
];

export function getProgrammaticFaqs(category: 'mortgage' | 'compound'): Array<{ question: string; answer: string }> {
  const list = category === 'mortgage' ? POPULAR_MORTGAGE_SCENARIOS : POPULAR_COMPOUND_SCENARIOS;
  return list.flatMap(s =>
    s.faq.map(item => ({
      question: item.question.en,
      answer: item.answer.en,
    }))
  );
}
