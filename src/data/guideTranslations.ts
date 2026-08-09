import { Language } from '../contexts/i18n';

export type GuideData = {
  guideTitle: string;
  guideDesc: string;
  formulaHeading?: string;
  formulaLines?: string[];
  faq: Array<{ question: string; answer: string }>;
};

export const guideTranslations: Record<string, Record<Language, GuideData>> = {
  'auto-loan': {
    en: {
      guideTitle: 'How Auto Loan Financing & Monthly Payments Work',
      guideDesc: 'Auto loans use amortization calculations where every monthly payment is divided between principal reduction and interest charges.',
      formulaHeading: 'Monthly Loan Payment Formula',
      formulaLines: [
        'Monthly Payment (M) = P × [ r(1+r)^n ÷ ((1+r)^n - 1) ]',
        'P = Loan Principal (Vehicle Price minus Down Payment)',
        'r = Monthly Interest Rate (Annual Rate ÷ 12)',
        'n = Total Number of Monthly Payments (Loan Term in Years × 12)'
      ],
      faq: [
        {
          question: 'How does a down payment affect an auto loan?',
          answer: 'A larger down payment directly reduces the financed principal amount, lowering both your monthly payment and the total interest accrued over the life of the loan.'
        },
        {
          question: 'Should I choose a 48-month or 72-month loan term?',
          answer: 'Shorter terms (e.g. 48 months) have higher monthly payments but save significant money on overall interest. Longer terms lower monthly costs but increase total borrowing costs.'
        }
      ]
    },
    he: {
      guideTitle: 'איך לחשב החזר חודשי על הלוואת רכב',
      guideDesc: 'הלוואות רכב מחושבות לפי לוח סילוקין שבו כל תשלום חודשי מתחלק בין החזר הקרן לבין תשלום הריבית.',
      formulaHeading: 'נוסחת החזר חודשי להלוואת רכב',
      formulaLines: [
        'החזר חודשי (M) = P × [ r(1+r)^n ÷ ((1+r)^n - 1) ]',
        'P = סכום ההלוואה (מחיר הרכב בניכוי מקדמה)',
        'r = שיעור ריבית חודשית (ריבית שנתית ÷ 12)',
        'n = מספר התשלומים הכולל (שנים × 12)'
      ],
      faq: [
        {
          question: 'איך מקדמה משפיעה על הלוואת הרכב?',
          answer: 'מקדמה גבוהה יותר מקטינה ישירות את יתרת הקרן הממומנת, מורידה את ההחזר החודשי וחוסכת סכום נכבד בסך הריבית.'
        },
        {
          question: 'האם עדיף לפרוס הלוואה ל-48 או 72 חודשים?',
          answer: 'תקופה קצרה יותר מציעה החזר חודשי גבוה יותר אך חוסכת ריבית רבה. תקופה ארוכה מקטינה החזר חודשי אך מעלה את סך העלות.'
        }
      ]
    },
    es: {
      guideTitle: 'Cómo funcionan los préstamos de autos y pagos mensuales',
      guideDesc: 'Los préstamos de autos utilizan tablas de amortización donde cada pago mensual se divide entre capital e intereses.',
      formulaHeading: 'Fórmula de pago mensual de auto',
      formulaLines: [
        'Pago Mensual (M) = P × [ r(1+r)^n ÷ ((1+r)^n - 1) ]',
        'P = Capital del préstamo (Precio del auto menos Enganche)',
        'r = Tasa de interés mensual (Tasa anual ÷ 12)',
        'n = Número total de pagos (Años × 12)'
      ],
      faq: [
        {
          question: '¿Cómo afecta el pago inicial (enganche) al préstamo?',
          answer: 'Un enganche mayor reduce directamente el capital financiado, disminuyendo el pago mensual y los intereses totales.'
        },
        {
          question: '¿Es mejor un plazo de 48 o 72 meses?',
          answer: 'Plazos más cortos tienen pagos mensuales más altos pero ahorran intereses. Plazos más largos reducen la cuota mensual pero aumentan el costo total.'
        }
      ]
    },
    fr: {
      guideTitle: 'Comment fonctionnent les paiements et le financement auto',
      guideDesc: 'Les prêts automobiles utilisent des calculs d\'amortissement où chaque mensualité se divise entre le capital et les intérêts.',
      formulaHeading: 'Formule de remboursement mensuel',
      formulaLines: [
        'Paiement Mensuel (M) = P × [ r(1+r)^n ÷ ((1+r)^n - 1) ]',
        'P = Capital emprunté (Prix du véhicule moins l\'apport)',
        'r = Taux d\'intérêt mensuel (Taux annuel ÷ 12)',
        'n = Nombre total de mensualités (Années × 12)'
      ],
      faq: [
        {
          question: 'Quel est l\'impact d\'un apport personnel sur le prêt auto ?',
          answer: 'Un apport personnel plus important réduit le montant du capital financé, diminuant vos mensualités et le coût total des intérêts.'
        },
        {
          question: 'Faut-il choisir une durée de 48 ou 72 mois ?',
          answer: 'Une durée plus courte augmente la mensualité mais économise sur les intérêts. Une durée plus longue réduit les mensualités mais augmente le coût global.'
        }
      ]
    },
    ar: {
      guideTitle: 'كيفية حساب أقساط قروض السيارات والتمويل',
      guideDesc: 'تعتمد قروض السيارات على جدول إطفاء الدين حيث تُقسّم الدفعة الشهرية بين أصل المبلغ والفائدة.',
      formulaHeading: 'صيغة القسط الشهرية لقرض السيارة',
      formulaLines: [
        'القسط Monthly Payment = P × [ r(1+r)^n ÷ ((1+r)^n - 1) ]',
        'P = أصل مبلغ القرض (سعر السيارة مطروحاً منه الدفعة الأولى)',
        'r = نسبة الفائدة الشهرية (الفائدة السنوية ÷ 12)',
        'n = إجمالي عدد الأقساط (عدد السنوات × 12)'
      ],
      faq: [
        {
          question: 'كيف تؤثر الدفعة الأولى على قرض السيارة؟',
          answer: 'تقليل المبلغ الممول بالدفعة الأولى يقلل من قيمة القسط الشهري وإجمالي الفوائد المترتبة.'
        },
        {
          question: 'هل الأفضل اختيار فترة 48 أم 72 شهراً؟',
          answer: 'الفترات الأقصر تزيد القسط الشهري لكنها توفر الفوائد، بينما الفترات الأطول تخفض القسط وتزيد التكلفة الإجمالية.'
        }
      ]
    }
  },

  roi: {
    en: {
      guideTitle: 'How to Calculate Return on Investment (ROI) & Profitability',
      guideDesc: 'Return on Investment evaluates the efficiency and profitability of an investment relative to its initial cost.',
      formulaHeading: 'Basic & Annualized ROI Formulas',
      formulaLines: [
        'Basic ROI (%) = [(Net Profit) ÷ (Cost of Investment)] × 100',
        'Net Profit = Final Investment Value - Initial Investment Cost',
        'Annualized ROI (%) = [(1 + Basic ROI)^(1 ÷ Years) - 1] × 100'
      ],
      faq: [
        {
          question: 'What is Annualized ROI?',
          answer: 'Annualized ROI measures the average geometric annual growth rate of an investment, allowing fair comparison across different time periods.'
        },
        {
          question: 'Can ROI be negative?',
          answer: 'Yes, a negative ROI indicates that the investment incurred a net financial loss relative to its initial outlay.'
        }
      ]
    },
    he: {
      guideTitle: 'איך לחשב תשואה על ההשקעה (ROI) ורווחיות',
      guideDesc: 'מדד ROI מעריך את רווחיות ההשקעה ביחס לעלות הראשונית שלה.',
      formulaHeading: 'נוסחת ROI בסיסית ומתואמת שנתית',
      formulaLines: [
        'תשואה בסיסית ROI (%) = [(רווח נטו) ÷ (עלות ההשקעה)] × 100',
        'רווח נטו = ערך השקעה סופי - עלות השקעה ראשונית',
        'תשואה שנתית ממוצעת (%) = [(1 + ROI)^(1 ÷ שנים) - 1] × 100'
      ],
      faq: [
        {
          question: 'מה זה תשואה מותאמת שנתית (Annualized ROI)?',
          answer: 'תשואה מותאמת שנתית מחשבת את קצב הצמיחה הגיאומטרי השנתי הממוצע של ההשקעה, וכך מאפשרת להשוות בין השקעות שנפרסו על פני פרקי זמן שונים.'
        },
        {
          question: 'האם תשואה (ROI) יכולה להיות שלילית?',
          answer: 'כן, תשואה שלילית מעידה על כך שההשקעה הניבה הפסד כספי נטו ביחס לסכום שהושקע.'
        }
      ]
    },
    es: {
      guideTitle: 'Cómo calcular el Retorno de Inversión (ROI)',
      guideDesc: 'El ROI evalúa la eficiencia y rentabilidad de una inversión en relación con su costo inicial.',
      formulaHeading: 'Fórmulas de ROI Básico y Anualizado',
      formulaLines: [
        'ROI Básico (%) = [(Ganancia Neta) ÷ (Costo de Inversión)] × 100',
        'Ganancia Neta = Valor Final - Costo Inicial',
        'ROI Anualizado (%) = [(1 + ROI Básico)^(1 ÷ Años) - 1] × 100'
      ],
      faq: [
        {
          question: '¿Qué es el ROI anualizado?',
          answer: 'El ROI anualizado mide la tasa de crecimiento promedio anual, permitiendo comparar inversiones de distintos períodos de tiempo.'
        }
      ]
    },
    fr: {
      guideTitle: 'Comment calculer le Retour sur Investissement (ROI)',
      guideDesc: 'Le ROI évalue la rentabilité d\'un investissement par rapport à son coût initial.',
      formulaHeading: 'Formules de ROI basique et annualisé',
      formulaLines: [
        'ROI Basique (%) = [(Profit Net) ÷ (Coût de l\'Investissement)] × 100',
        'Profit Net = Valeur Finale - Coût Initial',
        'ROI Annualisé (%) = [(1 + ROI Basique)^(1 ÷ Années) - 1] × 100'
      ],
      faq: [
        {
          question: 'Qu\'est-ce que le ROI annualisé ?',
          answer: 'Le ROI annualisé calcule le taux de croissance annuel moyen, ce qui permet de comparer des investissements sur des durées différentes.'
        }
      ]
    },
    ar: {
      guideTitle: 'كيفية حساب العائد على الاستثمار (ROI)',
      guideDesc: 'يقيم العائد على الاستثمار كفاءة وربحية الاستثمار مقارنة بتكلفته الأولية.',
      formulaHeading: 'صيغ حساب العائد البسيط والسنوي',
      formulaLines: [
        'العائد البسيط ROI (%) = [(صافي الربح) ÷ (تكلفة الاستثمار)] × 100',
        'صافي الربح = القيمة النهائية - التكلفة الأولية',
        'العائد السنوي (%) = [(1 + ROI)^(1 ÷ عدد السنوات) - 1] × 100'
      ],
      faq: [
        {
          question: 'ما هو العائد على الاستثمار السنوي؟',
          answer: 'يقيس معدل النمو السنوي الهندسي للاستثمار، مما يسمح بالمقارنة العادلة بين فترات زمنية مختلفة.'
        }
      ]
    }
  },

  margin: {
    en: {
      guideTitle: 'How Profit Margin & Markup Pricing Are Calculated',
      guideDesc: 'Profit Margin calculates profit relative to revenue, while Markup calculates profit relative to product cost.',
      formulaHeading: 'Margin vs Markup Formulas',
      formulaLines: [
        'Gross Profit = Revenue - Cost',
        'Profit Margin (%) = (Gross Profit ÷ Revenue) × 100',
        'Markup (%) = (Gross Profit ÷ Cost) × 100'
      ],
      faq: [
        {
          question: 'What is the main difference between Margin and Markup?',
          answer: 'Margin uses total sales revenue as the denominator, whereas Markup uses initial cost as the denominator.'
        }
      ]
    },
    he: {
      guideTitle: 'איך לחשב מרווח רווח (Margin) ותוספת מחיר (Markup)',
      guideDesc: 'מרווח רווח (Margin) מבטא את אחוז הרווח מתוך מחיר המכירה הסופי, בעוד שתמחור יתר (Markup) מבטא את אחוז התוספת מעל עלות המוצר.',
      formulaHeading: 'נוסחאות מרווח ותמחור',
      formulaLines: [
        'רווח גולמי = הכנסות - עלות',
        'שולי רווח (%) = (רווח גולמי ÷ הכנסות) × 100',
        'אחוז תוספת מחיר (%) = (רווח גולמי ÷ עלות) × 100'
      ],
      faq: [
        {
          question: 'מה ההבדל העיקרי בין Margin ל-Markup?',
          answer: 'Margin בוחן את הרווח ביחס לשורת ההכנסה הסופית, בעוד ש-Markup בוחן את העלאת המחיר מעל העלות המקורית.'
        }
      ]
    },
    es: {
      guideTitle: 'Cómo calcular Margen de Ganancia y Markup',
      guideDesc: 'El margen calcula el beneficio sobre los ingresos totales, mientras que el markup lo calcula sobre el costo del producto.',
      formulaHeading: 'Fórmulas de Margen vs Markup',
      formulaLines: [
        'Ganancia Bruta = Ingresos - Costo',
        'Margen de Ganancia (%) = (Ganancia Bruta ÷ Ingresos) × 100',
        'Markup (%) = (Ganancia Bruta ÷ Costo) × 100'
      ],
      faq: [
        {
          question: '¿Cuál es la diferencia clave entre Margen y Markup?',
          answer: 'El Margen toma los ingresos de venta como denominador, mientras que el Markup toma el costo inicial.'
        }
      ]
    },
    fr: {
      guideTitle: 'Comment calculer la marge bénéficiaire et le taux de marque',
      guideDesc: 'La marge bénéficiaire calcule le profit par rapport aux revenus, tandis que le taux de marque le calcule par rapport au coût.',
      formulaHeading: 'Formules de Marge vs Taux de Marque',
      formulaLines: [
        'Marge Brute = Chiffre d\'affaires - Coût',
        'Marge (%) = (Marge Brute ÷ Chiffre d\'affaires) × 100',
        'Taux de Marque (%) = (Marge Brute ÷ Coût) × 100'
      ],
      faq: [
        {
          question: 'Quelle est la différence entre marge et taux de marque ?',
          answer: 'La marge utilise les revenus comme dénominateur, tandis que le taux de marque utilise le coût de revient.'
        }
      ]
    },
    ar: {
      guideTitle: 'كيفية حساب هامش الربح ونسبة الزيادة (Markup)',
      guideDesc: 'يحسب هامش الربح النسبة من الإيرادات الكلية، بينما تحسب نسبة الزيادة النسبة المضافة فوق التكلفة.',
      formulaHeading: 'صيغ الهامش ونسبة الزيادة',
      formulaLines: [
        'إجمالي الربح = الإيرادات - التكلفة',
        'هامش الربح (%) = (إجمالي الربح ÷ الإيرادات) × 100',
        'نسبة الزيادة (%) = (إجمالي الربح ÷ التكلفة) × 100'
      ],
      faq: [
        {
          question: 'ما الفرق الرئيسي بين الهامش وزيادة السعر؟',
          answer: 'الهامش يعتمد على سعر البيع النهائي، بينما زيادة السعر تعتمد على تكلفة الشراء الأصلي.'
        }
      ]
    }
  },

  'cap-rate': {
    en: {
      guideTitle: 'How Capitalization Rate (Cap Rate) Is Calculated in Real Estate',
      guideDesc: 'Cap Rate reflects the expected net rate of return produced by a commercial or residential real estate property.',
      formulaHeading: 'Cap Rate Formula',
      formulaLines: [
        'Cap Rate (%) = (Net Operating Income ÷ Current Market Property Value) × 100',
        'Net Operating Income (NOI) = Gross Rental Income - Operating Expenses'
      ],
      faq: [
        {
          question: 'What is considered a good Cap Rate?',
          answer: 'Typically, a Cap Rate between 4% and 10% is common depending on market location, property risk, and asset condition.'
        }
      ]
    },
    he: {
      guideTitle: 'איך לחשב שיעור תשואה נטו (Cap Rate) בנדל"ן',
      guideDesc: 'מדד Cap Rate מייצג את אחוז התשואה השנתית הנטו שנכס נדל"ן מניב ביחס לשוויו בשוק.',
      formulaHeading: 'נוסחת חישוב Cap Rate',
      formulaLines: [
        'שיעור תשואה נטו Cap Rate (%) = (הכנסה תפעולית נטו NOI ÷ שווי הנכס) × 100',
        'הכנסה תפעולית נטו (NOI) = סך הכנסות שכירות - הוצאות תפעול שוטפות'
      ],
      faq: [
        {
          question: 'מה נחשב שיעור Cap Rate טוב?',
          answer: 'שיעור תשואה מקובל נע לרוב בין 4% ל-10%, בהתאם למיקום הנכס, רמת הסיכון ומצב השוק.'
        }
      ]
    },
    es: {
      guideTitle: 'Cómo calcular la Tasa de Capitalización (Cap Rate)',
      guideDesc: 'La Tasa de Capitalización refleja el retorno neto esperado generado por una propiedad inmobiliaria.',
      formulaHeading: 'Fórmula de Cap Rate',
      formulaLines: [
        'Cap Rate (%) = (Ingreso Operativo Neto ÷ Valor del Inmueble) × 100',
        'Ingreso Operativo Neto (NOI) = Ingresos por Renta - Gastos Operativos'
      ],
      faq: [
        {
          question: '¿Qué se considera un buen Cap Rate?',
          answer: 'Generalmente un Cap Rate entre 4% y 10% se considera saludable según la ubicación y el riesgo de la propiedad.'
        }
      ]
    },
    fr: {
      guideTitle: 'Comment calculer le Taux de Capitalisation (Cap Rate)',
      guideDesc: 'Le Cap Rate indique le taux de rendement net annuel produit par un bien immobilier.',
      formulaHeading: 'Formule du Cap Rate',
      formulaLines: [
        'Cap Rate (%) = (Revenu Net d\'Exploitation ÷ Valeur du Bien) × 100',
        'Revenu Net d\'Exploitation (NOI) = Loyers Bruts - Charges d\'Exploitation'
      ],
      faq: [
        {
          question: 'Qu\'est-ce qu\'un bon Cap Rate ?',
          answer: 'Un taux situé entre 4% et 10% est courant selon la localisation, l\'état du bien et le niveau de risque.'
        }
      ]
    },
    ar: {
      guideTitle: 'كيفية حساب معدل الرأسمالية (Cap Rate) في العقارات',
      guideDesc: 'يعكس معدل الرأسمالية العائد الصافي المتوقع الناتج عن العقارات الاستثمارية.',
      formulaHeading: 'صيغة معدل الرأسمالية',
      formulaLines: [
        'معدل الرأسمالية Cap Rate (%) = (صافي الدخل التشغيلي ÷ قيمة العقار) × 100',
        'صافي الدخل التشغيلي (NOI) = إجمالي الإيجارات - المصاريف التشغيلية'
      ],
      faq: [
        {
          question: 'ما هو معدل Cap Rate الجيد؟',
          answer: 'يتراوح المعدل الجيد عادة بين 4% و10% حسب موقع العقار ومستوى المخاطرة.'
        }
      ]
    }
  },

  'freelance-net-income': {
    en: {
      guideTitle: 'How Freelance Net Income & Tax Deductions Are Calculated',
      guideDesc: 'Calculating net take-home earnings for independent contractors requires deducting business expenses from gross revenues, followed by self-employment and income taxes.',
      formulaHeading: 'Net Freelance Income Formula',
      formulaLines: [
        'Taxable Profit = Gross Revenue - Eligible Business Expenses',
        'Total Tax Liability = Income Tax + Self-Employment Tax',
        'Net Take-Home Pay = Taxable Profit - Total Tax Liability'
      ],
      faq: [
        {
          question: 'What are eligible deductible business expenses?',
          answer: 'Ordinary and necessary operating expenses incurred directly to run your business, such as software subscriptions, accounting fees, and office supplies.'
        }
      ]
    },
    he: {
      guideTitle: 'איך לחשב הכנסה נטו לפרילנסרים ועצמאיים',
      guideDesc: 'חישוב הכנסה נטו לפרילנסרים מחייב הפחתת הוצאות מוכרות מעסקאות הברוטו, ולאחר מכן ניכוי מס הכנסה, ביטוח לאומי ודמי בריאות.',
      formulaHeading: 'נוסחת חישוב הכנסה נטו',
      formulaLines: [
        'רווח חייב במס = הכנסות ברוטו - הוצאות מוכרות',
        'סך חבות מס = מס הכנסה + ביטוח לאומי ודמי בריאות',
        'הכנסה נטו לכיס = רווח חייב במס - סך חבות מס'
      ],
      faq: [
        {
          question: 'מהן הוצאות מוכרות במס?',
          answer: 'הוצאות מוכרות הן הוצאות שהוצאו כולם לשם ייצור ההכנסה של העסק, כגון הנהלת חשבונות, תוכנות עבודה, אינטרנט וציוד משרדי.'
        }
      ]
    },
    es: {
      guideTitle: 'Cómo calcular el ingreso neto para autónomos y freelancers',
      guideDesc: 'El cálculo del ingreso neto requiere restar los gastos deducibles de los ingresos brutos, y luego aplicar los impuestos correspondientes.',
      formulaHeading: 'Fórmula de ingreso neto freelance',
      formulaLines: [
        'Ganancia Imponible = Ingreso Bruto - Gastos Deducibles',
        'Ingreso Neto = Ganancia Imponible - Impuestos Totales'
      ],
      faq: [
        {
          question: '¿Qué gastos se pueden deducir?',
          answer: 'Todos los gastos directos necesarios para operar su negocio, como software, contabilidad y equipamiento de oficina.'
        }
      ]
    },
    fr: {
      guideTitle: 'Comment calculer le revenu net pour les indépendants',
      guideDesc: 'Le calcul du revenu net nécessite de déduire les charges professionnelles du chiffre d\'affaires brut, puis d\'appliquer les cotisations et impôts.',
      formulaHeading: 'Formule du revenu net indépendant',
      formulaLines: [
        'Bénéfice Imposable = Chiffre d\'Affaires - Charges Déductibles',
        'Revenu Net = Bénéfice Imposable - Impôts & Cotisations'
      ],
      faq: [
        {
          question: 'Quelles sont les charges professionnelles déductibles ?',
          answer: 'Toutes les dépenses nécessaires à l\'activité : abonnements logiciels, matériel de bureau et honoraires comptables.'
        }
      ]
    },
    ar: {
      guideTitle: 'كيفية حساب صافي الدخل للمستقلين (Freelancers)',
      guideDesc: 'يتطلب حساب صافي الدخل خصم المصروفات التشغيلية المعتمدة من إجمالي الإيرادات، ثم خصم الضرائب والضرائب الذاتية.',
      formulaHeading: 'صيغة صافي الدخل للمستقل',
      formulaLines: [
        'الربح الخاضع للضريبة = إجمالي الإيرادات - المصروفات المعتمدة',
        'صافي الدخل = الربح الخاضע - إجمالي الضرائب'
      ],
      faq: [
        {
          question: 'ما هي المصروفات القابلة للخصم الضريبي؟',
          answer: 'المصاريف المباشرة الضرورية لتشغيل عملك مثل اشتراكات البرامج وأدوات المكتب والاستشارات.'
        }
      ]
    }
  },

  'debt-snowball': {
    en: {
      guideTitle: 'How the Debt Snowball Strategy Eliminates Debt',
      guideDesc: 'The Debt Snowball method prioritizes paying off debts from smallest balance to largest balance to build momentum through quick psychological wins.',
      formulaHeading: 'Debt Snowball Method Steps',
      formulaLines: [
        '1. List all debts ordered by remaining balance (smallest first)',
        '2. Pay minimum required payments on all debts except the smallest',
        '3. Roll all remaining extra budget into paying off the smallest debt',
        '4. Once cleared, roll that entire monthly payment into the next debt'
      ],
      faq: [
        {
          question: 'How does Debt Snowball compare to Debt Avalanche?',
          answer: 'Debt Snowball targets the smallest balance for psychological motivation, while Debt Avalanche targets the highest interest rate debt first to minimize total interest paid.'
        }
      ]
    },
    he: {
      guideTitle: 'איך שיטת כדור השלג עוזרת לחסל חובות',
      guideDesc: 'שיטת כדור השלג לסילוק חובות מתמקדת בסגירת החוב הקטן ביותר תחילה כדי לייצר מומנטום וניצחונות פסיכולוגיים מהירים.',
      formulaHeading: 'שלבי ביצוע השיטה',
      formulaLines: [
        '1. רשום את כל החובות מהקטן ביותר לגדול ביותר',
        '2. שלם תשלום מינימלי על כל החובות מלבד הקטן ביותר',
        '3. הפנה את כל התקציב העודף לחיסול החוב הקטן ביותר',
        '4. לאחר סגירת החוב, גלגל את סכום ההחזר כולו לחוב הבא בתור'
      ],
      faq: [
        {
          question: 'מה ההבדל בין שיטת כדור שלג לשיטת מפולת שלגים (Debt Avalanche)?',
          answer: 'כדור שלג מתמקד בחיסול היתרה הקטנה ביותר תחילה כדי לייצר ניצחונות פסיכולוגיים מהירים. מפולת שלגים מתמקדת בחוב בעל הריבית הגבוהה ביותר כדי לחסוך מקסימום ריבית מתמטית.'
        }
      ]
    },
    es: {
      guideTitle: 'Cómo la estrategia Bola de Nieve elimina deudas',
      guideDesc: 'El método de Bola de Nieve prioriza el pago de las deudas del saldo más pequeño al más grande para generar impulso psicológico.',
      formulaHeading: 'Pasos del Método Bola de Nieve',
      formulaLines: [
        '1. Ordene las deudas del saldo menor al mayor',
        '2. Pague el mínimo en todas excepto en la más pequeña',
        '3. Destine todo el dinero sobrante a liquidar la menor',
        '4. Al terminar, sume ese pago al siguiente saldo'
      ],
      faq: [
        {
          question: '¿Diferencia entre Bola de Nieve y Avalancha?',
          answer: 'Bola de nieve busca victorias psicológicas rápidas; Avalancha ataca la deuda con mayor tasa de interés para ahorrar más.'
        }
      ]
    },
    fr: {
      guideTitle: 'Comment la méthode Boule de Neige élimine les dettes',
      guideDesc: 'La méthode Boule de Neige classe les dettes du plus petit au plus grand solde pour créer un élan psychologique rapide.',
      formulaHeading: 'Étapes de la méthode',
      formulaLines: [
        '1. Classez vos dettes du plus petit solde au plus grand',
        '2. Payez le minimum requis sur toutes les dettes sauf la plus petite',
        '3. Allouez tout votre surplus au remboursement de la plus petite',
        '4. Reportez le montant libéré sur la dette suivante'
      ],
      faq: [
        {
          question: 'Boule de Neige vs Avalanche de dettes ?',
          answer: 'Boule de Neige privilégie la motivation psychologique ; Avalanche cible les taux d\'intérêt les plus élevés pour maximiser les économies.'
        }
      ]
    },
    ar: {
      guideTitle: 'كيف تنهي طريقة كرة الثلج الديون',
      guideDesc: 'ترتب طريقة كرة الثلج سداد الديون من الأصغر حجماً إلى الأكبر لبناء دافع نفسي قوي بالانتصارات السريعة.',
      formulaHeading: 'خطوات طريقة كرة الثلج',
      formulaLines: [
        '1. رتب جميع الديون من الأصغر رصيداً إلى الأكبر',
        '2. ادفع الحد الأدنى المطلوب لجميع الديون باستثناء الأصغر',
        '3. وجه كل المبلغ الفائض لسداد الدين الأصغر',
        '4. بعد إغلاقه، أضف مبلغه إلى سداد الدين التالي'
      ],
      faq: [
        {
          question: 'ما الفرق بين كرة الثلج والانهيار الجليدي؟',
          answer: 'كرة الثلج تركز على الرصيد الأصغر للدعم النفسي، بينما الانهيار الجليدي يركز على أعلى نسبة فائدة لتوفير المال.'
        }
      ]
    }
  },

  'fuel-split': {
    en: {
      guideTitle: 'How Road Trip Fuel Costs & Passenger Bill Splits Are Calculated',
      guideDesc: 'Trip fuel calculations combine distance, vehicle fuel efficiency, fuel price per unit, and optional toll fees.',
      formulaHeading: 'Fuel Cost Formula',
      formulaLines: [
        'Fuel Needed (L) = Distance (km) ÷ Fuel Efficiency (km/L)',
        'Total Trip Cost = (Fuel Needed × Fuel Price) + Tolls',
        'Cost Per Person = Total Trip Cost ÷ Number of Passengers'
      ],
      faq: [
        {
          question: 'How should toll fees be split among passengers?',
          answer: 'Tolls are added into the aggregate trip expenditure pool and divided equally among all carpool participants.'
        }
      ]
    },
    he: {
      guideTitle: 'איך לחשב עלויות דלק וחלוקת הוצאות נסיעה',
      guideDesc: 'חישוב עלות הדלק לנסיעה כולל את מרחק הנסיעה, צריכת הדלק של הרכב, מחיר הדלק לליטר ואגרות כבישי אגרה.',
      formulaHeading: 'נוסחת חישוב דלק',
      formulaLines: [
        'ליטרים נדרשים = מרחק (ק"מ) ÷ צריכת דלק (ק"מ לליטר)',
        'סך עלות נסיעה = (ליטרים × מחיר לליטר) + אגרות כביש',
        'עלות לנוסע = סך עלות נסיעה ÷ מספר נוסעים'
      ],
      faq: [
        {
          question: 'איך מומלץ לחלק אגרות כביש?',
          answer: 'אגרות כביש מתווספות לסך עלות הדלק הכוללת ומחולקות שווה בשווה בין כל הנוסעים ברכב.'
        }
      ]
    },
    es: {
      guideTitle: 'Cómo calcular costos de gasolina y división de viajes',
      guideDesc: 'Los cálculos de viaje combinan distancia, consumo del vehículo, precio del combustible y peajes.',
      formulaHeading: 'Fórmula de costo de combustible',
      formulaLines: [
        'Litros Necesarios = Distancia ÷ Eficiencia (km/L)',
        'Costo Total = (Litros × Precio) + Peajes',
        'Costo Por Persona = Costo Total ÷ Pasajeros'
      ],
      faq: [
        {
          question: '¿Cómo se dividen los peajes?',
          answer: 'Los peajes se suman al gasto total y se dividen en partes iguales entre todos los pasajeros.'
        }
      ]
    },
    fr: {
      guideTitle: 'Comment calculer les frais de carburant et le partage',
      guideDesc: 'Les calculs de trajet combinent la distance, la consommation du véhicule, le prix du carburant et les péages.',
      formulaHeading: 'Formule du coût de carburant',
      formulaLines: [
        'Litres Nécessaires = Distance ÷ Consommation (km/L)',
        'Coût Total = (Litres × Prix) + Péages',
        'Coût Par Personne = Coût Total ÷ Nombre de Passagers'
      ],
      faq: [
        {
          question: 'Comment partager les frais de péage ?',
          answer: 'Les péages sont ajoutés au coût total du trajet et divisés équitablement entre les passagers.'
        }
      ]
    },
    ar: {
      guideTitle: 'كيفية حساب تكاليف الوقود وتقاسم مصاريف السفر',
      guideDesc: 'تعتمد حسابات الوقود على المسافة ومعدل استهلاك السيارة وسعر الوقود ورسوم الطرق.',
      formulaHeading: 'صيغة حساب الوقود',
      formulaLines: [
        'الوقود المطلوب (لتر) = المسافة ÷ استهلاك السيارة (كم/لتر)',
        'التكلفة الإجمالية = (الوقود المطلوب × سعر اللتر) + الرسوم',
        'التكلفة لكل شخص = التكلفة الإجمالية ÷ عدد الركاب'
      ],
      faq: [
        {
          question: 'كيف تُقسّم رسوم الطرق المرورية؟',
          answer: 'تضاف رسوم الطرق إلى إجمالي تكلفة الرحلة وتُقسّم بالتساوي بين جميع الركاب.'
        }
      ]
    }
  },

  'goal-savings': {
    en: {
      guideTitle: 'How to Calculate Required Monthly Savings for Financial Goals',
      guideDesc: 'Reaching a future financial target requires calculating monthly deposits accounting for initial capital and compound interest.',
      formulaHeading: 'Sinking Fund Monthly Formula',
      formulaLines: [
        'Future Value of Initial Capital = Initial Balance × (1 + r)^n',
        'Remaining Target Gap = Goal Target Amount - Future Value of Initial',
        'Monthly Contribution = Target Gap × [ r ÷ ((1 + r)^n - 1) ]'
      ],
      faq: [
        {
          question: 'What if interest rates fluctuate over time?',
          answer: 'The calculator assumes a fixed return rate. Recalibrate your monthly target annually based on actual portfolio performance.'
        }
      ]
    },
    he: {
      guideTitle: 'איך לחשב חיסכון חודשי להשגת יעד פיננסי',
      guideDesc: 'כדי להגיע ליעד חיסכון מוגדר תוך מספר שנים, מחשבים את ההפקדה החודשית הנדרשת בהתחשב בהון הראשוני ובשיעור הריבית השנתית המצטברת.',
      formulaHeading: 'נוסחת ההפקדה החודשית',
      formulaLines: [
        'ערך עתידי של הון ראשוני = סכום התחלתי × (1 + r)^n',
        'פער נדרש ליעד = סכום היעד - ערך עתידי ראשוני',
        'הפקדה חודשית נדרשת = פער ליעד × [ r ÷ ((1 + r)^n - 1) ]'
      ],
      faq: [
        {
          question: 'מה קורה אם הריבית משתנה לאורך הדרך?',
          answer: 'המחשבון מניח תשואה שנתית קבועה. בפועל, מומלץ לעדכן את חישוב היעד מדי שנה בהתאם לביצועי תיק ההשקעות בפועל.'
        }
      ]
    },
    es: {
      guideTitle: 'Cómo calcular el ahorro mensual para alcanzar una meta',
      guideDesc: 'Alcanzar una meta financiera requiere calcular los depósitos mensuales considerando el capital inicial y el interés compuesto.',
      formulaHeading: 'Fórmula de aporte mensual',
      formulaLines: [
        'Valor Futuro del Capital Inicial = Saldo Inicial × (1 + r)^n',
        'Brecha Restante = Meta Deseada - Valor Futuro Inicial',
        'Depósito Mensual = Brecha × [ r ÷ ((1 + r)^n - 1) ]'
      ],
      faq: [
        {
          question: '¿Qué pasa si la tasa de interés cambia?',
          answer: 'La herramienta asume un rendimiento fijo. Se recomienda recalcular anualmente según los resultados reales.'
        }
      ]
    },
    fr: {
      guideTitle: 'Comment calculer l\'épargne mensuelle pour un objectif',
      guideDesc: 'Atteindre un objectif financier nécessite de calculer les versements mensuels en tenant compte du capital initial et des intérêts.',
      formulaHeading: 'Formule du versement mensuel',
      formulaLines: [
        'Valeur Future du Capital Initial = Solde Initial × (1 + r)^n',
        'Écart à Combler = Objectif Cible - Valeur Future Initiale',
        'Versement Mensuel = Écart × [ r ÷ ((1 + r)^n - 1) ]'
      ],
      faq: [
        {
          question: 'Que faire si les taux d\'intérêt varient ?',
          answer: 'L\'outil suppose un rendement fixe. Il est conseillé de réévaluer vos versements chaque année.'
        }
      ]
    },
    ar: {
      guideTitle: 'كيفية حساب الادخار الشهري المطلوب للوصول إلى هدف مالﻲ',
      guideDesc: 'يتطلب الوصول إلى هدف مالي مستقبلي حساب الإيداعات الشهرية مع مراعاة رأس المال الأولي والفائدة المركبة.',
      formulaHeading: 'صيغة الادخار الشهري للهدف',
      formulaLines: [
        'القيمة المستقبلية لرأس المال الأولي = الرصيد الأولي × (1 + r)^n',
        'الفجوة المتبقية للهدف = مبلغ الهدف - القيمة المستقبلية',
        'الإيداع الشهري المطلوب = الفجوة × [ r ÷ ((1 + r)^n - 1) ]'
      ],
      faq: [
        {
          question: 'ماذا لو تغيرت معدلات الفائدة عبر الوقت؟',
          answer: 'يفترض المنهج معدل عائد ثابت، يُنصح بإعادة تقييم المبلغ سنوياً بناءً على أداء المحفظة.'
        }
      ]
    }
  },

  'download-time': {
    en: {
      guideTitle: 'How File Download Times Are Calculated Based on Network Speed',
      guideDesc: 'Download duration depends on total file size, internet transfer speed, and network overhead losses.',
      formulaHeading: 'Download Time Formula',
      formulaLines: [
        '1 Byte = 8 Bits (Conversion factor)',
        'Speed in Bytes/sec = Speed in Mbps × 1,000,000 ÷ 8',
        'Download Time (seconds) = File Size (Bytes) ÷ Speed (Bytes/sec)'
      ],
      faq: [
        {
          question: 'What is the difference between Mbps and MB/s?',
          answer: 'Mbps (Megabits per second) measures bandwidth speed provided by ISPs, whereas MB/s (Megabytes per second) measures saved file size. Divide Mbps by 8 to convert to MB/s.'
        }
      ]
    },
    he: {
      guideTitle: 'איך לחשב זמן הורדת קבצים לפי מהירות אינטרנט',
      guideDesc: 'משך הורדת קובץ מבוסס על גודל הקובץ, מהירות החיבור בפועל ותקורה של פרוטוקולי תקשורת.',
      formulaHeading: 'נוסחת חישוב זמן הורדה',
      formulaLines: [
        '1 בייט (Byte) = 8 ביט (Bits)',
        'מהירות בבייטים לשנייה = מהירות ב-Mbps × 1,000,000 ÷ 8',
        'זמן הורדה בשניות = גודל הקובץ (בייטים) ÷ מהירות (בייטים לשנייה)'
      ],
      faq: [
        {
          question: 'מה ההבדל בין Mbps ל-MB/s?',
          answer: 'Mbps פירושו Megabits per second (מהירות ספק אינטרנט). MB/s פירושו Megabytes per second (גודל קובץ). חלוקת Mbps ב-8 מעבירה ל-MB/s.'
        }
      ]
    },
    es: {
      guideTitle: 'Cómo calcular el tiempo de descarga según la velocidad',
      guideDesc: 'El tiempo de descarga depende del tamaño del archivo y la velocidad real de transmisión de red.',
      formulaHeading: 'Fórmula de tiempo de descarga',
      formulaLines: [
        '1 Byte = 8 Bits',
        'Velocidad en Bytes/s = Mbps × 1,000,000 ÷ 8',
        'Tiempo (segundos) = Tamaño de archivo ÷ Velocidad (Bytes/s)'
      ],
      faq: [
        {
          question: 'Diferencia entre Mbps y MB/s',
          answer: 'Mbps mide el ancho de banda comercial, mientras que MB/s mide el tamaño de archivos. Divida Mbps entre 8 para obtener MB/s.'
        }
      ]
    },
    fr: {
      guideTitle: 'Comment calculer le temps de téléchargement selon la vitesse',
      guideDesc: 'La durée de téléchargement dépend de la taille du fichier et du débit réel de votre connexion.',
      formulaHeading: 'Formule du temps de téléchargement',
      formulaLines: [
        '1 Octet (Byte) = 8 Bits',
        'Vitesse en Octets/s = Mbps × 1 000 000 ÷ 8',
        'Temps (secondes) = Taille du fichier ÷ Vitesse (Octets/s)'
      ],
      faq: [
        {
          question: 'Différence entre Mbps et Mo/s (MB/s)',
          answer: 'Le Mbps mesure la vitesse réseau des fournisseurs, le Mo/s (MB/s) mesure la taille des fichiers. Divisez les Mbps par 8.'
        }
      ]
    },
    ar: {
      guideTitle: 'كيفية حساب זמן تنزيل الملفات بناءً على سرعة الإنترنت',
      guideDesc: 'تعتمد مدة التنزيل على حجم الملف الكلي وسرعة نقل البيانات الفعلية للشبكة.',
      formulaHeading: 'صيغة حساب وقت التنزيل',
      formulaLines: [
        '1 بايت = 8 بت',
        'السرعة بالبايت/ثانية = Mbps × 1,000,000 ÷ 8',
        'وقت التنزيل (بالثواني) = حجم الملف (بايت) ÷ السرعة (بايت/ثانية)'
      ],
      faq: [
        {
          question: 'ما الفرق بين Mbps و MB/s؟',
          answer: 'Mbps يقيس سرعة النطاق الترددي للشبكة، بينما MB/s يقيس حجم تخزين الملفات. اقسم Mbps على 8 للتحويل إلى MB/s.'
        }
      ]
    }
  },

  'peltier-cooling': {
    en: {
      guideTitle: 'Thermoelectric Cooling (Peltier/TEC) & COP Formula Guide',
      guideDesc: 'Thermoelectric coolers transfer heat via the Peltier effect. Cooling capacity (Qc) and Coefficient of Performance (COP) depend on current, voltage, and delta temperature.',
      formulaHeading: 'Thermoelectric Equations',
      formulaLines: [
        'Power Consumption (Pin) = Voltage (V) × Current (I)',
        'Coefficient of Performance (COP) = Cooling Capacity (Qc) ÷ Power Input (Pin)'
      ],
      faq: [
        {
          question: 'What is a typical Peltier COP?',
          answer: 'Peltier COP usually ranges between 0.3 and 0.8 depending on delta-T. While less efficient than vapor compression, TECs provide silent solid-state cooling.'
        }
      ]
    },
    he: {
      guideTitle: 'חישוב הספק קירור אלמנט פלטייה (TEC) ומקדם ביצועים (COP)',
      guideDesc: 'רכיבי פלטייה (TEC) יוצרים מפל טמפרטורה באמצעות אפקט פלטייה. הספק הקירור (Qc) ומקדם היעילות (COP) תלויים בזרם, מתח והפרש הטמפרטורה.',
      formulaHeading: 'נוסחאות פלטייה',
      formulaLines: [
        'הספק חשמלי ממושק (Pin) = מתח (V) × זרם (I)',
        'מקדם יעילות (COP) = הספק קירור אפקטיבי (Qc) ÷ הספק חשמלי (Pin)'
      ],
      faq: [
        {
          question: 'מהו COP אופייני של אלמנט פלטייה?',
          answer: 'מקדם הביצועים (COP) נע לרוב בין 0.3 ל-0.8. למרות יעילות חשמלית נמוכה בהשוואה למדחסים, רכיבי פלטייה מציעים קירור שקט ללא חלקים נעים.'
        }
      ]
    },
    es: {
      guideTitle: 'Guía de refrigeración termoeléctrica Peltier (TEC) y COP',
      guideDesc: 'Los módulos Peltier transfieren calor mediante el efecto Peltier. La capacidad de enfriamiento y el COP dependen del voltaje y la corriente.',
      formulaHeading: 'Ecuaciones Termoeléctricas',
      formulaLines: [
        'Consumo de Energía (Pin) = Voltaje (V) × Corriente (I)',
        'Coeficiente de Rendimiento (COP) = Capacidad Enfriamiento (Qc) ÷ Pin'
      ],
      faq: [
        {
          question: '¿Cuál es el COP típico de un módulo Peltier?',
          answer: 'Suele oscilar entre 0.3 y 0.8. Aunque son menos eficientes que los compresores, ofrecen refrigeración silenciosa sin partes móviles.'
        }
      ]
    },
    fr: {
      guideTitle: 'Guide de refroidissement thermoélectrique Peltier (TEC) & COP',
      guideDesc: 'Les modules Peltier transfèrent la chaleur via l\'effet Peltier. La capacité de refroidissement et le COP dépendent de la tension et du courant.',
      formulaHeading: 'Équations Thermoélectriques',
      formulaLines: [
        'Consommation Électrique (Pin) = Tension (V) × Courant (I)',
        'Coefficient de Performance (COP) = Capacité de Refroidissement (Qc) ÷ Pin'
      ],
      faq: [
        {
          question: 'Quel est le COP typique d\'un élément Peltier ?',
          answer: 'Le COP varie généralement entre 0,3 et 0,8. Bien que moins efficaces que les compresseurs, ils sont totalement silencieux.'
        }
      ]
    },
    ar: {
      guideTitle: 'دليل التبريد الكهروحراري بعنصر بيلتير (TEC) ومعامل الأداء (COP)',
      guideDesc: 'تنقل وحدات بيلتير الحرارة عبر تأثير بيلتير. تعتمد سعة التبريد ومعامل الأداء على التيار والجهد وفارق درجات الحرارة.',
      formulaHeading: 'المعادلات الكهروحرارية',
      formulaLines: [
        'استهلاك القدرة (Pin) = الجهد (V) × التيار (I)',
        'معامل الأداء (COP) = سعة التبريد (Qc) ÷ القدرة المدخلة (Pin)'
      ],
      faq: [
        {
          question: 'ما هو معامل COP النموذجي لعنصر بيلتير؟',
          answer: 'يتراوح معامل الأداء عادة بين 0.3 و 0.8. ورغم كفاءتها المنخفضة مقارنة بالضواغط، فإنها توفر تبريداً صامتاً بدون أجزاء متحركة.'
        }
      ]
    }
  },

  'rent-vs-buy': {
    en: {
      guideTitle: 'Renting vs. Buying Real Estate Financial Analysis Guide',
      guideDesc: 'Comparing renting versus buying a home evaluates equity accumulation and property appreciation against unrecoverable rent, interest, and maintenance costs.',
      formulaHeading: 'Financial Comparison Breakdown',
      formulaLines: [
        'Total Ownership Expense = Mortgage Interest + Property Taxes + Maintenance + HOA + Closing Costs',
        'Home Equity Wealth = Property Market Value Growth - Remaining Mortgage Principal Balance',
        'Total Renting Expense = Monthly Rent Paid + Rent Inflation + Renter Insurance - Investment Yields on Down Payment'
      ],
      faq: [
        {
          question: 'Is buying always better than renting long-term?',
          answer: 'Not always. Renting can be financially superior if the unallocated down payment capital is invested in high-yielding index funds and property appreciation is modest.'
        }
      ]
    },
    he: {
      guideTitle: 'מדריך ניתוח פיננסי: קניית דירה מול מגורים בשכירות',
      guideDesc: 'השוואה בין רכישת דירה לשכירות בוחנת הצטברות הון עצמי ועליית ערך מול עלויות שאינן חוזרות כגון ריבית, תחזוקה ושכר דירה.',
      formulaHeading: 'מרכיבי ההשוואה הכספית',
      formulaLines: [
        'עלויות קנייה שאינן חוזרות = תשלומי ריבית + מיסי מקרקעין + תחזוקה ושיפוצים + דמי ניהול',
        'צבירת הון נקי בנכס = עליית ערך הנכס - יתרת קרן המשכנתא',
        'עלויות שכירות = שכר דירה מצטבר + עליית שכר דירה - תשואת השקעת ההון העצמי בשוק ההון'
      ],
      faq: [
        {
          question: 'האם קניית דירה תמיד עדיפה על שכירות לטווח ארוך?',
          answer: 'לא בהכרח. אם ההון העצמי מושקע בשוק ההון בתשואה גבוהה ודמי השכירות נמוכים, שכירות עשויה להניב הון עתק גבוה יותר לקראת פרישה.'
        }
      ]
    },
    es: {
      guideTitle: 'Guía de Análisis Financiero: Alquilar vs. Comprar Vivienda',
      guideDesc: 'Comparar comprar vs alquilar evalúa la acumulación de patrimonio y apreciación frente a alquiler e intereses no recuperables.',
      formulaHeading: 'Desglose de Comparación Financiera',
      formulaLines: [
        'Costos no recuperables de compra = Intereses + Impuestos + Mantenamiento',
        'Patrimonio Neto = Valor Inmobiliario - Saldo Hipotecario',
        'Costo Total Alquiler = Renta Acumulada - Rendimiento de Inversión del Enganche'
      ],
      faq: [
        {
          question: '¿Comprar es siempre mejor que alquilar?',
          answer: 'No siempre. Alquilar puede ser superior si el capital del enganche se invierte en activos de alto rendimiento.'
        }
      ]
    },
    fr: {
      guideTitle: 'Guide d\'Analyse Financière : Louer vs Acheter un Logement',
      guideDesc: 'Comparer la location et l\'achat évalue la constitution de capital et la plus-value face aux loyers et intérêts non récupérables.',
      formulaHeading: 'Comparaison Financière',
      formulaLines: [
        'Coûts irrécupérables d\'achat = Intérêts + Taxes foncières + Entretien',
        'Capital constitué = Valeur du bien - Solde restant dû',
        'Coût total location = Loyers cumulés - Rendement de l\'apport placé'
      ],
      faq: [
        {
          question: 'Acheter est-il toujours plus avantageux que louer ?',
          answer: 'Pas nécessairement. Si l\'apport personnel est placé sur des marchés à fort rendement, la location peut être plus rentable.'
        }
      ]
    },
    ar: {
      guideTitle: 'دليل التحليل المالي: الإيجار مقابل شراء العقار',
      guideDesc: 'تقيم المقارنة بين الإيجار والشراء بناء الثروة العقارية وزيادة القيمة مقابل الإيجار والفوائد الصافية غير الاستردادية.',
      formulaHeading: 'تفاصيل المقارنة المالية',
      formulaLines: [
        'تكاليف الشراء غير الاستردادية = الفوائد + الضرائب العقارية + الصيانة',
        'صافي ثروة العقار = نمو قيمة العقار - رصيد القرض المتبقي',
        'تكلفة الإيجار الكلية = الإيجارات المدفوعة - عوائد استثمار الدفعة الأولى'
      ],
      faq: [
        {
          question: 'هل الشراء دائماً أفضل من الإيجار على المدى الطويل؟',
          answer: 'ليس دائماً. قد يكون الإيجار أفضل مالياً إذا تم استثمار مبلغ الدفعة الأولى في محفظة أوراق مالية ذات عائد مرتفع.'
        }
      ]
    }
  },

  mortgage: {
    en: {
      guideTitle: 'Mortgage Payment & Home Financing Amortization Guide',
      guideDesc: 'A mortgage divides monthly payments into principal reduction, interest, property taxes, and homeowners insurance.',
      formulaHeading: 'Standard Mortgage Amortization Formula',
      formulaLines: [
        'M = P × [ r(1+r)^n ÷ ((1+r)^n - 1) ]',
        'P = Loan Principal Amount',
        'r = Monthly Interest Rate (Annual Rate ÷ 12)',
        'n = Total Amortization Payments (Years × 12)'
      ],
      faq: [
        {
          question: 'How do extra principal payments affect a mortgage?',
          answer: 'Making additional payments toward your loan principal shortens your overall payoff timeline and drastically reduces total interest expense.'
        }
      ]
    },
    he: {
      guideTitle: 'מדריך חישוב תשלומי משכנתא ולוח סילוקין',
      guideDesc: 'תשלום המשכנתא החודשי מורכב מהחזר הקרן, תשלומי הריבית, ולעיתים ביטוחים ומיסים נלווים.',
      formulaHeading: 'נוסחת לוח סילוקין שפיצר למשכנתא',
      formulaLines: [
        'החזר חודשי (M) = P × [ r(1+r)^n ÷ ((1+r)^n - 1) ]',
        'P = סכום קרן המשכנתא',
        'r = שיעור ריבית חודשית (ריבית שנתית ÷ 12)',
        'n = מספר התשלומים בחודשים (שנים × 12)'
      ],
      faq: [
        {
          question: 'איך סילוק מוקדם של קרן המשכנתא משפיע על החוב?',
          answer: 'תשלומים נוספים המופנים ישירות לקרן מקצרים את תקופת ההחזר הכוללת וחוסכים עשרות ואלפי שקלים בתשלומי ריבית.'
        }
      ]
    },
    es: {
      guideTitle: 'Guía de Pagos Hipotecarios y Tabla de Amortización',
      guideDesc: 'La hipoteca divide los pagos mensuales entre reducción de principal, intereses, impuestos y seguros.',
      formulaHeading: 'Fórmula de Amortización Hipotecaria',
      formulaLines: [
        'M = P × [ r(1+r)^n ÷ ((1+r)^n - 1) ]',
        'P = Monto del Principal',
        'r = Tasa de Interés Mensual (Anual ÷ 12)',
        'n = Número de Pagos (Años × 12)'
      ],
      faq: [
        {
          question: '¿Cómo afectan los pagos adicionales al principal?',
          answer: 'Hacer pagos adicionales al capital reduce el plazo total del préstamo y ahorra miles en intereses.'
        }
      ]
    },
    fr: {
      guideTitle: 'Guide de Calcul de Prêt Immobilier et Tableau d\'Amortissement',
      guideDesc: 'Un prêt immobilier divise les mensualités entre le remboursement du capital, les intérêts, les taxes et les assurances.',
      formulaHeading: 'Formule d\'Amortissement Immobilier',
      formulaLines: [
        'M = P × [ r(1+r)^n ÷ ((1+r)^n - 1) ]',
        'P = Capital Emprunté',
        'r = Taux Mensuel (Taux Anuel ÷ 12)',
        'n = Durée Totale en Mois (Années × 12)'
      ],
      faq: [
        {
          question: 'Quel est l\'effet des remboursements anticipés ?',
          answer: 'Rembourser du capital par anticipation réduit la durée du prêt et économise considérablement sur les intérêts.'
        }
      ]
    },
    ar: {
      guideTitle: 'دليل حساب الرهن العقاري وجدول سداد القروض',
      guideDesc: 'يقسم الرهن العقاري الدفعات الشهرية بين خفض أصل الدين والفوائد والضرائب والتأمين.',
      formulaHeading: 'صيغة استهلاك الرهن العقاري',
      formulaLines: [
        'القسط M = P × [ r(1+r)^n ÷ ((1+r)^n - 1) ]',
        'P = أصل مبلغ الرهن',
        'r = نسبة الفائدة الشهرية (الفائدة السنوية ÷ 12)',
        'n = إجمالي الأشهر (السنوات × 12)'
      ],
      faq: [
        {
          question: 'كيف تؤثر السدادات الإضافية لأصل الدين؟',
          answer: 'الدفعات الإضافية لأصل الدين تقصر الفترة الزمنية الكلية للقرض وتوفر مبالغ ضخمة من الفوائد.'
        }
      ]
    }
  },

  compound: {
    en: {
      guideTitle: 'How Compound Interest Exponentially Grows Investment Wealth',
      guideDesc: 'Compound interest earns interest on both the initial principal and the accumulated interest from prior periods.',
      formulaHeading: 'Compound Interest Formula with Monthly Deposits',
      formulaLines: [
        'Total Future Value A = P(1 + r/n)^(nt) + PMT × [ ((1 + r/n)^(nt) - 1) ÷ (r/n) ]',
        'P = Initial Principal',
        'PMT = Regular Monthly Contribution',
        'r = Annual Interest Rate',
        'n = Compounding Frequency per year',
        't = Time Horizon in Years'
      ],
      faq: [
        {
          question: 'Why is compounding frequency important?',
          answer: 'More frequent compounding periods (e.g. daily vs annual) allow interest to generate additional yields faster over time.'
        }
      ]
    },
    he: {
      guideTitle: 'איך ריבית דריבית מצמיחה הון באופן מעריכי',
      guideDesc: 'ריבית דריבית מחושבת גם על הקרן המקורית וגם על הריבית שהצטברה בתקופות הקודמות.',
      formulaHeading: 'נוסחת ריבית דריבית עם הפקדות חודשיות',
      formulaLines: [
        'סך צבירה עתידית A = P(1 + r/n)^(nt) + PMT × [ ((1 + r/n)^(nt) - 1) ÷ (r/n) ]',
        'P = סכום הפקדה ראשוני',
        'PMT = הפקדה חודשית קבועה',
        'r = שיעור ריבית שנתית',
        'n = תדירות החישוב בשנה (למשל 12 עבור חודשי)',
        't = תקופת הזמן בשנים'
      ],
      faq: [
        {
          question: 'למה תדירות חישוב הריבית חשובה?',
          answer: 'ככל שתדירות הצבירה גבוהה יותר (למשל חודשית לעומת שנתית), הריבית מייצרת תשואה נוספת מהר יותר לאורך זמן.'
        }
      ]
    },
    es: {
      guideTitle: 'Cómo el Interés Compuesto Hace Crecer su Capital',
      guideDesc: 'El interés compuesto calcula intereses sobre el capital inicial y sobre los intereses acumulados previamente.',
      formulaHeading: 'Fórmula de Interés Compuesto',
      formulaLines: [
        'A = P(1 + r/n)^(nt) + PMT × [ ((1 + r/n)^(nt) - 1) ÷ (r/n) ]',
        'P = Capital Inicial',
        'PMT = Aporte Mensual',
        'r = Tasa de Interés Anual',
        't = Tiempo en Años'
      ],
      faq: [
        {
          question: '¿Por qué importa la frecuencia de capitalización?',
          answer: 'Capitalizaciones más frecuentes hacen crecer el interés sobre el interés con mayor rapidez.'
        }
      ]
    },
    fr: {
      guideTitle: 'Comment les Intérêts Composés Font Grandir Votre Capital',
      guideDesc: 'Les intérêts composés génèrent des gains sur le capital initial ainsi que sur les intérêts déjà accumulés.',
      formulaHeading: 'Formule des Intérêts Composés',
      formulaLines: [
        'A = P(1 + r/n)^(nt) + PMT × [ ((1 + r/n)^(nt) - 1) ÷ (r/n) ]',
        'P = Capital Initial',
        'PMT = Versement Mensuel',
        'r = Taux d\'Intérêt Anuel',
        't = Nombre d\'Années'
      ],
      faq: [
        {
          question: 'Pourquoi la fréquence de composition est-elle importante ?',
          answer: 'Une composition plus fréquente génère des intérêts sur les intérêts plus rapidement.'
        }
      ]
    },
    ar: {
      guideTitle: 'كيف تنمي الفائدة المركبة ثروتك الاستثمارية',
      guideDesc: 'تحسب الفائدة المركبة العوائد على أصل المبلغ الأولي وعلى الفوائد المتراكمة من الفترات السابقة.',
      formulaHeading: 'صيغة الفائدة المركبة مع الإيداعات',
      formulaLines: [
        'المبلغ المستقبلي A = P(1 + r/n)^(nt) + PMT × [ ((1 + r/n)^(nt) - 1) ÷ (r/n) ]',
        'P = أصل رأس المال الأولي',
        'PMT = الإيداع الشهري المنتظم',
        'r = نسبة الفائدة السنوية',
        't = النطاق الزمني بالسنوات'
      ],
      faq: [
        {
          question: 'لماذا تعد تكرارية تراكب الفائدة مهمة؟',
          answer: 'تراكب الفائدة بشكل أسرع (مثل الشهري مقارنة بالسنوي) يولد عوائد إضافية أسرع مع مرور الوقت.'
        }
      ]
    }
  },

  unit: {
    en: {
      guideTitle: 'Metric & Imperial Unit Conversions Guide',
      guideDesc: 'Unit conversion standardizes physical measurements across international system units (SI) and imperial systems.',
      formulaHeading: 'Standard Conversion Factors',
      formulaLines: [
        'Length: 1 Inch = 2.54 cm | 1 Meter = 3.28084 Feet',
        'Mass: 1 Kilogram = 2.20462 Pounds',
        'Temperature: °F = (°C × 9/5) + 32'
      ],
      faq: [
        {
          question: 'How accurate are these unit conversions?',
          answer: 'All conversions utilize high-precision floating-point factors verified by international standards organizations (NIST / ISO).'
        }
      ]
    },
    he: {
      guideTitle: 'מדריך המרת יחידות מידה מטריות ואימפריאליות',
      guideDesc: 'המרת יחידות מאפשרת למעוך ולהמיר מדידות פיזיקליות בין השיטה המטרית לשיטה האימפריאלית.',
      formulaHeading: 'מקאמי המרה תקניים',
      formulaLines: [
        'אורך: 1 אינץ\' = 2.54 ס"מ | 1 מטר = 3.28084 רגל',
        'משקל: 1 קילוגרם = 2.20462 פאונד (ליברות)',
        'טמפרטורה: מעלות פרנהייט = (צלזיוס × 9/5) + 32'
      ],
      faq: [
        {
          question: 'עד כמה המרות היחידות מדויקות?',
          answer: 'כל המקווים מבוססים על קבועים פיזיקליים תקניים של ארגוני התקינה הבינלאומיים (NIST / ISO).'
        }
      ]
    },
    es: {
      guideTitle: 'Guía de Conversión de Unidades Métricas e Imperiales',
      guideDesc: 'La conversión de unidades estandariza mediciones entre el sistema métrico internacional y el sistema imperial.',
      formulaHeading: 'Factores de Conversión',
      formulaLines: [
        'Longitud: 1 Pulgada = 2.54 cm | 1 Metro = 3.28084 Pies',
        'Peso: 1 Kilogramo = 2.20462 Libras',
        'Temperatura: °F = (°C × 9/5) + 32'
      ],
      faq: [
        {
          question: '¿Qué precisión tienen las conversiones?',
          answer: 'Todas las conversiones cumplen con los factores oficiales de organismos de estándares internacionales.'
        }
      ]
    },
    fr: {
      guideTitle: 'Guide de Conversion des Unités Métriques et Impériales',
      guideDesc: 'La conversion d\'unités standardise les mesures physiques entre le système métrique et le système impérial.',
      formulaHeading: 'Facteurs de Conversion',
      formulaLines: [
        'Longueur : 1 Pouce = 2,54 cm | 1 Mètre = 3,28084 Pieds',
        'Masse : 1 Kilogramme = 2,20462 Livres',
        'Température : °F = (°C × 9/5) + 32'
      ],
      faq: [
        {
          question: 'Quelle est la précision des conversions ?',
          answer: 'Les calculs utilisent des constantes officielles vérifiées par les organismes internationaux.'
        }
      ]
    },
    ar: {
      guideTitle: 'دليل تحويل الوحدات بين النظامين المتري والإمبراطوري',
      guideDesc: 'يوحد تحويل الوحدات القياسات الفيزيائية بين النظام المتري الدولي والنظام الإمبراطوري.',
      formulaHeading: 'معاملات التحويل القياسية',
      formulaLines: [
        'الطول: 1 بوصة = 2.54 سم | 1 متر = 3.28084 قدم',
        'الكتلة: 1 كيلوغرام = 2.20462 باوند',
        'الحرارة: فهرنهايت = (سيليزيوس × 9/5) + 32'
      ],
      faq: [
        {
          question: 'ما مدى دقة تحويل الوحدات؟',
          answer: 'تعتمد كافة التحويلات على معاملات دقيقة معتمدة من الهيئات الدولية القياسية.'
        }
      ]
    }
  },

  bmi: {
    en: {
      guideTitle: 'Body Mass Index (BMI) & Weight Status Categories Guide',
      guideDesc: 'BMI measures body mass relative to height, serving as a general health screening metric defined by WHO.',
      formulaHeading: 'BMI Calculation Formula',
      formulaLines: [
        'Metric: BMI = Weight (kg) ÷ [Height (m)]²',
        'Underweight: < 18.5 | Normal Weight: 18.5 - 24.9',
        'Overweight: 25.0 - 29.9 | Obese: ≥ 30.0'
      ],
      faq: [
        {
          question: 'Is BMI accurate for athletes and bodybuilders?',
          answer: 'BMI does not differentiate muscle mass from fat mass, so athletic individuals with high muscle density may score in the overweight category despite low body fat.'
        }
      ]
    },
    he: {
      guideTitle: 'מדריך מדד מסת הגוף (BMI) וקטגוריות משקל',
      guideDesc: 'מדד BMI מעריך את יחס המשקל לגובה ומשמש כמדד סקירה ראשוני להערכת מצב הבריאות לפי ארגון הבריאות העולמי (WHO).',
      formulaHeading: 'נוסחת חישוב BMI',
      formulaLines: [
        'נוסחה מטרת: BMI = משקל (ק"ג) ÷ [גובה (מטרים)]²',
        'תת-משקל: < 18.5 | משקל תקין: 18.5 - 24.9',
        'עודף משקל: 25.0 - 29.9 | השמנה: ≥ 30.0'
      ],
      faq: [
        {
          question: 'האם מדד BMI מדויק עבור ספורטאים ומפתחי גוף?',
          answer: 'BMI אינו מפריד בין מסת שריר למסת שומן. לכן ספורטאים בעלי מסת שריר גבוהה עשויים לקבל תוצאת עודף משקל למרות אחוז שומן נמוך.'
        }
      ]
    },
    es: {
      guideTitle: 'Guía de Índice de Masa Corporal (IMC) y Salud',
      guideDesc: 'El IMC mide la masa corporal en relación con la estatura, según los parámetros de la OMS.',
      formulaHeading: 'Fórmula de IMC',
      formulaLines: [
        'IMC = Peso (kg) ÷ [Estatura (m)]²',
        'Bajo peso: < 18.5 | Peso Normal: 18.5 - 24.9',
        'Sobrepeso: 25.0 - 29.9 | Obesidad: ≥ 30.0'
      ],
      faq: [
        {
          question: '¿Es preciso el IMC para atletas?',
          answer: 'El IMC no distingue entre masa muscular y grasa, por lo que personas musculosas pueden mostrar IMC elevado.'
        }
      ]
    },
    fr: {
      guideTitle: 'Guide de l\'Indice de Masse Corporelle (IMC) et Santé',
      guideDesc: 'L\'IMC évalue la masse corporelle par rapport à la taille selon les standards de l\'OMS.',
      formulaHeading: 'Formule de l\'IMC',
      formulaLines: [
        'IMC = Poids (kg) ÷ [Taille (m)]²',
        'Insuffisance pondérale : < 18,5 | Poids Normal : 18,5 - 24,9',
        'Surpoids : 25,0 - 29,9 | Obésité : ≥ 30,0'
      ],
      faq: [
        {
          question: 'L\'IMC est-il adapté aux sportifs ?',
          answer: 'L\'IMC ne différencie pas le muscle de la graisse, ce qui peut classer les personnes très musclées en surpoids.'
        }
      ]
    },
    ar: {
      guideTitle: 'دليل مؤشر كتلة الجسم (BMI) وفئات الوزن',
      guideDesc: 'يقيس مؤشر كتلة الجسم التناسب بين الوزن والطول كمقياس صحي أولي معتمد من منظمة الصحة العالمية.',
      formulaHeading: 'صيغة حساب مؤشر كتلة الجسم',
      formulaLines: [
        'مؤشر كتلة الجسم = الوزن (كغم) ÷ [الطول (متر)]²',
        'نقص الوزن: < 18.5 | الوزن الطبيعي: 18.5 - 24.9',
        'زيادة الوزن: 25.0 - 29.9 | السمنة: ≥ 30.0'
      ],
      faq: [
        {
          question: 'هل مؤشر BMI دقيق للرياضيين وبناة الأجسام؟',
          answer: 'لا يفرق المؤشر بين الكتلة العضلية والدهون، لذا قد يعطي قراءة مرتفعة للرياضيين رغم انخفاض نسبة الدهون.'
        }
      ]
    }
  },

  tip: {
    en: {
      guideTitle: 'Restaurant Tip & Bill Splitting Guide',
      guideDesc: 'Tip calculation applies a gratuity percentage to the pre-tax bill total and splits expenses evenly across group members.',
      formulaHeading: 'Tip & Split Formulas',
      formulaLines: [
        'Tip Amount = Bill Amount × (Tip Percentage ÷ 100)',
        'Total Bill = Bill Amount + Tip Amount',
        'Per Person Share = Total Bill ÷ Number of People'
      ],
      faq: [
        {
          question: 'Should tips be calculated before or after tax?',
          answer: 'Standard etiquette recommends calculating gratuity on the pre-tax subtotal amount.'
        }
      ]
    },
    he: {
      guideTitle: 'מדריך חישוב טיפ וחלוקת חשבון במסעדה',
      guideDesc: 'חישוב טיפ מחשב את דמי השירות מתוך סך החשבון ומחלק את הסכום הכולל בין הסועדים.',
      formulaHeading: 'נוסחאות חישוב טיפ וחלוקה',
      formulaLines: [
        'סכום הטיפ = סכום החשבון × (אחוז הטיפ ÷ 100)',
        'סך הכל לתשלום = סכום החשבון + סכום הטיפ',
        'חלק לכל סועד = סך הכל לתשלום ÷ מספר הסועדים'
      ],
      faq: [
        {
          question: 'האם לחשב טיפ לפני או אחרי מע"מ/מיסים?',
          answer: 'הנורמה המקובלת היא לחשב את אחוז הטיפ מתוך סכום הארוחה הנטו (לפני מיסים).'
        }
      ]
    },
    es: {
      guideTitle: 'Guía de Propinas y División de Cuentas',
      guideDesc: 'El cálculo de propina aplica un porcentaje sobre la cuenta y la divide equitativamente entre los comensales.',
      formulaHeading: 'Fórmulas de Propina',
      formulaLines: [
        'Monto Propina = Cuenta × (Porcentaje ÷ 100)',
        'Total = Cuenta + Propina',
        'Por Persona = Total ÷ Número de Personas'
      ],
      faq: [
        {
          question: '¿La propina se calcula antes o después de impuestos?',
          answer: 'La etiqueta estándar sugiere calcular la propina sobre el subtotal antes de impuestos.'
        }
      ]
    },
    fr: {
      guideTitle: 'Guide de Calcul de Pourboire et Partage d\'Addition',
      guideDesc: 'Le calcul du pourboire applique un pourcentage sur l\'addition et répartit le montant total entre les convives.',
      formulaHeading: 'Formules de Pourboire',
      formulaLines: [
        'Montant Pourboire = Addition × (Pourcentage ÷ 100)',
        'Total = Addition + Pourboire',
        'Par Personne = Total ÷ Nombre de Personnes'
      ],
      faq: [
        {
          question: 'Le pourboire se calcule-t-il avant ou après taxes ?',
          answer: 'L\'usage courant recommande de calculer le pourboire sur le montant hors taxes.'
        }
      ]
    },
    ar: {
      guideTitle: 'دليل حساب الإكرامية (الطيب) وتقسيم الفاتورة',
      guideDesc: 'يطبق حساب الإكرامية نسبة مئوية على الفاتورة ويقسم المبلغ الإجمالي بالتساوي على أفراد المجموعة.',
      formulaHeading: 'صيغ حساب الإكرامية والتقسيم',
      formulaLines: [
        'مبلغ الإكرامية = الفاتورة × (النسبة المئوية ÷ 100)',
        'المبلغ الإجمالي = الفاتورة + الإكرامية',
        'حصة الفرد = المبلغ الإجمالي ÷ عدد الأشخاص'
      ],
      faq: [
        {
          question: 'هل تحسب الإكرامية قبل أم بعد الضريبة؟',
          answer: 'توصي الأعراف المتبعة بحساب الإكرامية على المبلغ الإجمالي قبل إضافة الضرائب.'
        }
      ]
    }
  },

  salary: {
    en: {
      guideTitle: 'Hourly, Monthly, & Annual Salary Conversion Guide',
      guideDesc: 'Converting pay frequency translates hourly rates into weekly, bi-weekly, monthly, and annual gross compensation.',
      formulaHeading: 'Salary Conversion Formulas',
      formulaLines: [
        'Annual Pay = Hourly Rate × Hours per Week × 52 Weeks',
        'Monthly Pay = Annual Pay ÷ 12 Months',
        'Weekly Pay = Annual Pay ÷ 52 Weeks'
      ],
      faq: [
        {
          question: 'How are paid vacation days accounted for?',
          answer: 'The standard calculation assumes 52 paid weeks per year, including accrued paid time off (PTO).'
        }
      ]
    },
    he: {
      guideTitle: 'מדריך המרת שכר שעתי, חודשי ושנתי',
      guideDesc: 'המחשבון מציג את מקביל השכר השעתי, השבועי, החודשי והשנתי על בסיס היקף שעות העבודה השבועיות.',
      formulaHeading: 'נוסחאות המרת שכר',
      formulaLines: [
        'שכר שנתי = שכר שעתי × שעות שבועיות × 52 שבועות',
        'שכר חודשי = שכר שנתי ÷ 12 חודשים',
        'שכר שבועי = שכר שנתי ÷ 52 שבועות'
      ],
      faq: [
        {
          question: 'איך מחושבות ימי חופשה בתשלום?',
          answer: 'חישוב הסטנדרט מניח 52 שבועות בתשלום בשנה, הכוללים גם ימי חופשה וימי מחלה בתשלום.'
        }
      ]
    },
    es: {
      guideTitle: 'Guía de Conversión de Salario Horario, Mensual y Anual',
      guideDesc: 'Convierte tarifas por hora en remuneración semanal, mensual y anual bruta.',
      formulaHeading: 'Fórmulas de Conversión Salarial',
      formulaLines: [
        'Salario Anual = Tarifa por Hora × Horas/Semana × 52',
        'Salario Mensual = Salario Anual ÷ 12',
        'Salario Semanal = Salario Anual ÷ 52'
      ],
      faq: [
        {
          question: '¿Cómo se consideran los días de vacaciones pagadas?',
          answer: 'El cálculo estándar asume 52 semanas pagadas al año incluyendo vacaciones pagadas.'
        }
      ]
    },
    fr: {
      guideTitle: 'Guide de Conversion de Salaire Horaire, Mensuel et Annuel',
      guideDesc: 'Convertit un taux horaire en salaire hebdomadaire, mensuel et annuel brut.',
      formulaHeading: 'Formules de Conversion Salariale',
      formulaLines: [
        'Salaire Annuel = Taux Horaire × Heures/Semaine × 52',
        'Salaire Mensuel = Salaire Annuel ÷ 12',
        'Salaire Hebdomadaire = Salaire Annuel ÷ 52'
      ],
      faq: [
        {
          question: 'Comment les congés payés sont-ils pris en compte ?',
          answer: 'Le calcul prend en compte 52 semaines rémunérées par an, incluant les congés payés.'
        }
      ]
    },
    ar: {
      guideTitle: 'دليل تحويل الراتب من ساعي إلى شهري وسنوي',
      guideDesc: 'يحول الأجر بالساعة إلى إجمالي المستحقات الأسبوعية والشهرية والسنوية بناءً على ساعات العمل.',
      formulaHeading: 'صيغ تحويل الراتب',
      formulaLines: [
        'الراتب السنوي = أجر الساعة × ساعات العمل أسبوعياً × 52 أسبوعاً',
        'الراتب الشهري = الراتب السنوي ÷ 12 شهراً',
        'الراتب الأسبوعي = الراتب السنوي ÷ 52 أسبوعاً'
      ],
      faq: [
        {
          question: 'كيف تُحسب الإجازات المدفوعة؟',
          answer: 'يفترض الحساب القياسي 52 أسبوعاً مدفوع الأجر في السنة بما فيها الإجازات المدفوعة.'
        }
      ]
    }
  },

  age: {
    en: {
      guideTitle: 'Exact Calendar Age & Time Difference Guide',
      guideDesc: 'Calculating exact age computes elapsed calendar years, months, days, hours, and seconds accounting for leap years.',
      formulaHeading: 'Date Interval Metrics',
      formulaLines: [
        'Total Years = Target Year - Birth Year (adjusted for month/day)',
        'Total Days = Calendar Days difference including Leap Days',
        'Leap Year Rule: Extra day added for years divisible by 4 (except century years not ÷ 400)'
      ],
      faq: [
        {
          question: 'How are leap years handled in age calculations?',
          answer: 'Leap years add a 29th day to February, ensuring day counts between two calendar dates remain astronomically precise.'
        }
      ]
    },
    he: {
      guideTitle: 'מדריך חישוב גיל מדויק והפרשי תאריכים',
      guideDesc: 'חישוב גיל מדויק מחשב את השנים, החודשים, הימים והשעות שחלפו מיום הלידה בהתחשב בשנים מעוברות.',
      formulaHeading: 'מדדי זמן ולוח שנה',
      formulaLines: [
        'שנים שלמות = שנת יעד - שנת לידה (בהתאמה לחודש ויום)',
        'סך ימים = הפרש ימים בלוח השנה כולל ימי מעובר',
        'כלל שנה מעוברת: יום נוסף בפברואר בכל שנה המתחלקת ב-4'
      ],
      faq: [
        {
          question: 'איך מחושבות שנים מעוברות בחישוב הגיל?',
          answer: 'שנים מעוברות מוסיפות את ה-29 בפברואר, וכך סך הימים שחלפו בין התאריכים נשאר מדויק לחלוטין.'
        }
      ]
    },
    es: {
      guideTitle: 'Guía de Cálculo de Edad Exacta y Diferencia de Fechas',
      guideDesc: 'Calcula la edad exacta en años, meses, días y horas considerando años bisiestos.',
      formulaHeading: 'Métricas de Intervalo de Fechas',
      formulaLines: [
        'Años = Año Actual - Año de Nacimiento',
        'Días Totales = Diferencia en días de calendario incluyendo bisiestos'
      ],
      faq: [
        {
          question: '¿Cómo se manejan los años bisiestos?',
          answer: 'Los años bisiestos añaden el 29 de febrero, garantizando el recuento exacto de días.'
        }
      ]
    },
    fr: {
      guideTitle: 'Guide de Calcul d\'Âge Exact et Différence de Dates',
      guideDesc: 'Calcule l\'âge exact en années, mois, jours et heures en tenant compte des années bissextiles.',
      formulaHeading: 'Métrique des Intervalles de Dates',
      formulaLines: [
        'Années = Année Actuelle - Année de Naissance',
        'Jours Totaux = Différence réelle en jours incluant les bissextiles'
      ],
      faq: [
        {
          question: 'Comment sont gérées les années bissextiles ?',
          answer: 'Un jour supplémentaire est ajouté au mois de février pour les années bissextiles.'
        }
      ]
    },
    ar: {
      guideTitle: 'دليل حساب العمر الدقيق والفرق بين التاريخين',
      guideDesc: 'يحسب العمر الدقيق بالسنوات والأشهر والأيام والمدد الزمنية مع مراعاة السنوات الكبيسة.',
      formulaHeading: 'مقاييس الفوارق الزمنية',
      formulaLines: [
        'إجمالي السنوات = السنة الحالية - سنة الميلاد',
        'إجمالي الأيام = فارق الأيام التقويمية بما فيها الأيام الكبيسة'
      ],
      faq: [
        {
          question: 'كيف تُعالج السنوات الكبيسة في حساب العمر؟',
          answer: 'تضيف السنوات الكبيسة يوماً 29 لشهر فبراير لضمان دقة إجمالي عدد الأيام.'
        }
      ]
    }
  },

  percentage: {
    en: {
      guideTitle: 'Percentage Calculations, Increases, & Discount Guide',
      guideDesc: 'Percentages express proportions as fractions of 100, used everywhere from sales discounts to rate changes.',
      formulaHeading: 'Core Percentage Formulas',
      formulaLines: [
        'Percentage Value = Total × (Percentage ÷ 100)',
        'Percentage Change (%) = [(New Value - Original Value) ÷ Original Value] × 100',
        'Discount Price = Original Price × [ 1 - (Discount % ÷ 100) ]'
      ],
      faq: [
        {
          question: 'How do you calculate a percentage increase?',
          answer: 'Subtract the old value from the new value, divide by the old value, and multiply by 100.'
        }
      ]
    },
    he: {
      guideTitle: 'מדריך חישובי אחוזים, שינוי באחוזים והנחות',
      guideDesc: 'חישוב אחוזים מבטא חלק מתוך שלם בערכים של מאיות (100/X) ומשמש לחישוב הנחות, מיסים וגידול באחוזים.',
      formulaHeading: 'נוסחאות אחוזים מרכזיות',
      formulaLines: [
        'ערך האחוז = סך הכל × (אחוז ÷ 100)',
        'שינוי באחוזים (%) = [(ערך חדש - ערך מקורי) ÷ ערך מקורי] × 100',
        'מחיר לאחר הנחה = מחיר מקורי × [ 1 - (אחוז הנחה ÷ 100) ]'
      ],
      faq: [
        {
          question: 'איך מחשבים אחוז ענייה או שינוי באחוזים?',
          answer: 'מחסרים את הערך הישן מהערך החדש, מחלקים בערך הישן ומכפילים ב-100.'
        }
      ]
    },
    es: {
      guideTitle: 'Guía de Cálculos de Porcentajes, Aumentos y Descuentos',
      guideDesc: 'Los porcentajes expresan proporciones como fracciones de 100, usados en descuentos e incrementos.',
      formulaHeading: 'Fórmulas de Porcentajes',
      formulaLines: [
        'Valor = Total × (Porcentaje ÷ 100)',
        'Cambio (%) = [(Valor Nuevo - Valor Original) ÷ Valor Original] × 100',
        'Precio con Descuento = Precio Original × [ 1 - (Descuento % ÷ 100) ]'
      ],
      faq: [
        {
          question: '¿Cómo calcular un incremento porcentual?',
          answer: 'Reste el valor anterior del nuevo, divídalo entre el anterior y multiplique por 100.'
        }
      ]
    },
    fr: {
      guideTitle: 'Guide de Calcul de Pourcentages, Augmentations et Remises',
      guideDesc: 'Les pourcentages expriment des proportions sur 100, utilisés pour les soldes et les taux.',
      formulaHeading: 'Formules de Pourcentages',
      formulaLines: [
        'Valeur du Pourcentage = Total × (Pourcentage ÷ 100)',
        'Variation (%) = [(Nouvelle Valeur - Valeur Initiale) ÷ Valeur Initiale] × 100',
        'Prix Remisé = Prix Initial × [ 1 - (Remise % ÷ 100) ]'
      ],
      faq: [
        {
          question: 'Comment calculer une augmentation en pourcentage ?',
          answer: 'Soustrayez l\'ancienne valeur de la nouvelle, divisez par l\'ancienne et multipliez par 100.'
        }
      ]
    },
    ar: {
      guideTitle: 'دليل حساب النسب المئوية والزيادة والخصومات',
      guideDesc: 'تعبر النسب المئوية عن أجزاء من 100، وتستخدم في الخصومات والتغيرات النسبية.',
      formulaHeading: 'الصيغ الأساسية للنسب المئوية',
      formulaLines: [
        'قيمة النسبة = الإجمالي × (النسبة ÷ 100)',
        'التغير المئوي (%) = [(القيمة الجديدة - القيمة الأصلية) ÷ القيمة الأصلية] × 100',
        'السعر بعد الخصم = السعر الأصلي × [ 1 - (نسبة الخصم ÷ 100) ]'
      ],
      faq: [
        {
          question: 'كيف تحسب نسبة الزيادة المئوية؟',
          answer: 'اطرح القيمة القديمة من الجديدة، اقسم الناتج على القيمة القديمة ثم اضرب في 100.'
        }
      ]
    }
  },
};

export function getGuideData(calculatorId: string, lang: Language): GuideData {
  const calcData = guideTranslations[calculatorId];
  if (!calcData) {
    return {
      guideTitle: 'Guide & Formulas',
      guideDesc: 'Comprehensive calculation breakdown and FAQs.',
      faq: []
    };
  }
  return calcData[lang] || calcData.en;
}
