export type MortgageRegimeId = 'IL' | 'US' | 'EU' | 'UK' | 'CUSTOM';

export interface MortgageTrack {
  id: string;
  name: {
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
  defaultRate: number;
  defaultYears: number;
  riskLevel: 'low' | 'medium' | 'high';
  badge: string;
  notes?: {
    en: string;
    he: string;
    es: string;
    fr: string;
    ar: string;
  };
}

export interface MortgageRegime {
  id: MortgageRegimeId;
  countryCode: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  name: {
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
  defaultPrincipal: number;
  tracks: MortgageTrack[];
}

export const MORTGAGE_REGIMES: Record<MortgageRegimeId, MortgageRegime> = {
  IL: {
    id: 'IL',
    countryCode: 'IL',
    flag: '🇮🇱',
    currency: 'ILS',
    currencySymbol: '₪',
    name: {
      en: 'Israel (שוק המשכנתאות בישראל)',
      he: 'ישראל (שפיצר, פריים, קל״צ ומל״צ)',
      es: 'Israel (Mercado Hipotecario IL)',
      fr: 'Israël (Marché Hypothécaire IL)',
      ar: 'إسرائيل (سوق الرهن العقاري المحلي)',
    },
    description: {
      en: 'Standard Israeli mortgage tracks regulated by Bank of Israel (Spitzer, Prime, Fixed Unlinked, CPI-linked).',
      he: 'מסלולי משכנתא תקניים על פי הנחיות בנק ישראל: לוח שפיצר, מסלול פריים, קל״צ, מל״צ ותמהיל משולב.',
      es: 'Vías hipotecarias estándar reguladas por el Banco de Israel.',
      fr: 'Prêts immobiliers selon la réglementation de la Banque d\'Israël.',
      ar: 'مسارات الرهن العقاري الخاضعة لتعليمات بنك إسرائيل.',
    },
    defaultPrincipal: 1000000,
    tracks: [
      {
        id: 'il-klatz',
        name: {
          en: 'Fixed Unlinked (קל״צ)',
          he: 'קבועה לא צמודה (קל״צ)',
          es: 'Fijo No Vinculado (Klatz)',
          fr: 'Taux Fixe Non Indexé (Klatz)',
          ar: 'ثابت غير مرتبط (كلاتس)',
        },
        description: {
          en: '100% stable monthly payment. No CPI inflation risk and no interest rate fluctuations.',
          he: 'החזר חודשי קבוע וידוע מראש לכל אורך חיי ההלוואה. ללא סיכון עליית מדד או שינויי ריבית.',
          es: 'Cuota 100% estable sin riesgo de inflación ni subidas de tipos.',
          fr: 'Mensualité 100% fixe sans aucun risque d\'inflation.',
          ar: 'قسط شهري ثابت ومعروف مسبقاً دون مخاطر تضخم أو تغير في الفائدة.',
        },
        defaultRate: 4.85,
        defaultYears: 25,
        riskLevel: 'low',
        badge: 'קל״צ יציב',
        notes: {
          en: 'Ideal for risk-averse buyers who want total predictability.',
          he: 'מומלץ ללווים המעוניינים ביציבות תקציבית מוחלטת וללא הפתעות עתידיות.',
          es: 'Ideal para compradores que buscan certidumbre total.',
          fr: 'Idéal pour ceux qui privilégient la sérénité budgétaire.',
          ar: 'مناسب للمقترضين الراغبين في استقرار مالي تام.',
        },
      },
      {
        id: 'il-prime',
        name: {
          en: 'Prime Floating Rate (פריים)',
          he: 'מסלול פריים (משתנה לא צמודה)',
          es: 'Tasa Prime Flotante',
          fr: 'Taux Prime Variable',
          ar: 'مسار برايم (متغير غير مرتبط)',
        },
        description: {
          en: 'Linked to Bank of Israel Prime rate (Prime - 0.5%). Zero prepayment exit penalties.',
          he: 'מבוסס על ריבית הפריים (ריבית בנק ישראל + 1.5%). ללא עמלת פירעון מוקדם בכל עת.',
          es: 'Vinculado a la tasa Prime. Sin comisión por amortización anticipada.',
          fr: 'Indexé sur le taux préférentiel. Sans pénalités de remboursement.',
          ar: 'مرتبط بفائدة البرايم دون غرامات سداد مبكر في أي وقت.',
        },
        defaultRate: 5.5,
        defaultYears: 30,
        riskLevel: 'medium',
        badge: 'ללא קנס פירעון',
        notes: {
          en: 'Flexible repayment anytime, but monthly payment fluctuates when the central bank changes interest rates.',
          he: 'גמיש לפירעון או מחזור בכל עת, אך ההחזר החודשי עולה או יורד בהתאם לריבית בנק ישראל.',
          es: 'Flexible pero la cuota varía según decisiones del banco central.',
          fr: 'Flexible mais la mensualité évolue avec la banque centrale.',
          ar: 'مرن للسداد لكن القسط يتغير مع قرارات الفائدة المركزية.',
        },
      },
      {
        id: 'il-mlatz',
        name: {
          en: 'Adjustable 5Y Linked/Unlinked (מל״צ)',
          he: 'משתנה כל 5 שנים (מל״צ)',
          es: 'Ajustable cada 5 Años',
          fr: 'Révisable tous les 5 Ans',
          ar: 'متغير كل 5 سنوات (ملاتس)',
        },
        description: {
          en: 'Fixed rate for 5-year periods. Re-evaluates based on government bond yields.',
          he: 'ריבית קבועה לתקופות של 5 שנים, המתעדכנת לפי תשואות אג״ח ממשלתיות בנקודות היציאה.',
          es: 'Tipo fijo durante periodos de 5 años con revisión por bonos estatales.',
          fr: 'Taux fixe par périodes de 5 ans, révisé aux échéances.',
          ar: 'فائدة ثابتة لفترات 5 سنوات تتغير وفق عوائد السندات الحكومية.',
        },
        defaultRate: 4.4,
        defaultYears: 25,
        riskLevel: 'medium',
        badge: 'תחנת יציאה 5 שנים',
      },
      {
        id: 'il-mix',
        name: {
          en: 'Classic Diversified Mix (תמהיל שלישים)',
          he: 'תמהיל שלישים מומלץ (1/3 פריים, 1/3 קל״צ, 1/3 משתנה)',
          es: 'Mezcla Diversificada Recomendada',
          fr: 'Panier Équilibré Recommandé',
          ar: 'المزيج المتوازن الموصى به (أثلاث)',
        },
        description: {
          en: 'The classic balanced Israeli basket: 33% Prime, 33% Fixed Unlinked, 34% 5Y Adjustable.',
          he: 'תמהיל פיננסי מאוזן ומפוזר: שליש במסלול פריים, שליש בקל״צ יציב, ושליש במשתנה כל 5 שנים.',
          es: 'La clásica cartera balanceada israelí que equilibra riesgo y costo.',
          fr: 'Panier classique équilibrant stabilité et coût global.',
          ar: 'التوزيع الكلاسيكي المتوازن لتقليل المخاطر وخفض التكلفة.',
        },
        defaultRate: 4.9,
        defaultYears: 25,
        riskLevel: 'low',
        badge: 'תמהיל מאוזן',
      },
    ],
  },
  US: {
    id: 'US',
    countryCode: 'US',
    flag: '🇺🇸',
    currency: 'USD',
    currencySymbol: '$',
    name: {
      en: 'United States (Conventional & FHA)',
      he: 'ארצות הברית (30Y Fixed, 15Y ו-ARM)',
      es: 'Estados Unidos (Fijo 30A y 15A)',
      fr: 'États-Unis (Prêts 30 Ans / 15 Ans)',
      ar: 'الولايات المتحدة (30 سنة و15 سنة ثابت)',
    },
    description: {
      en: 'Standard US Fannie Mae / Freddie Mac conventional loans and FHA government-backed mortgages.',
      he: 'מסלולי משכנתא אמריקאיים סטנדרטיים: הלוואות קונבנציונליות בריבית קבועה ל-30 ו-15 שנה, ומשכנתאות FHA.',
      es: 'Préstamos convencionales estadounidenses a 30 y 15 años y programas FHA.',
      fr: 'Prêts conventionnels américains sur 30 et 15 ans et programmes FHA.',
      ar: 'قروض الرهن العقاري الأمريكية التقليدية لـ 30 و15 عاماً وبرامج FHA.',
    },
    defaultPrincipal: 400000,
    tracks: [
      {
        id: 'us-30y-fixed',
        name: {
          en: '30-Year Fixed Conventional',
          he: '30 שנה ריבית קבועה (30Y Fixed)',
          es: 'Fijo a 30 Años Convencional',
          fr: 'Taux Fixe sur 30 Ans',
          ar: '30 سنة بفائدة ثابتة تقليدية',
        },
        description: {
          en: 'The benchmark American mortgage: fixed monthly principal & interest for 360 months.',
          he: 'המסלול האמריקאי הפופולרי ביותר: תשלום קרן וריבית קבוע ומובטח למשך 30 שנה (360 חודשים).',
          es: 'La hipoteca de referencia en EE. UU.: cuota fija durante 360 meses.',
          fr: 'Le prêt américain de référence : mensualités fixes sur 360 mois.',
          ar: 'الرهن العقاري الأمريكي الأبرز: قسط ثابت مضمون لمدة 360 شهراً.',
        },
        defaultRate: 6.65,
        defaultYears: 30,
        riskLevel: 'low',
        badge: 'US Benchmark',
      },
      {
        id: 'us-15y-fixed',
        name: {
          en: '15-Year Fixed (Fast Payoff)',
          he: '15 שנה ריבית קבועה (סילוק מהיר)',
          es: 'Fijo a 15 Años (Amortización Rápida)',
          fr: 'Taux Fixe 15 Ans (Remboursement Accéléré)',
          ar: '15 سنة ثابت (سداد سريع)',
        },
        description: {
          en: 'Lower interest rate, builds home equity twice as fast, saves over $150,000 in interest.',
          he: 'ריבית נמוכה יותר, צבירת בעלות כפולה במהירות וחיסכון של עשרות עד מאות אלפי דולרים בריבית.',
          es: 'Tasa más baja, acumulación rápida de capital y gran ahorro de intereses.',
          fr: 'Taux réduit, constitution rapide de patrimoine et économies majeures.',
          ar: 'فائدة أقل، بناء حقوق الملكية بضعف السرعة وتوفير هائل في الفوائد.',
        },
        defaultRate: 5.95,
        defaultYears: 15,
        riskLevel: 'low',
        badge: 'High Savings',
      },
      {
        id: 'us-5-1-arm',
        name: {
          en: '5/1 ARM (Adjustable Rate Mortgage)',
          he: 'משכנתא מתכווננת 5/1 ARM',
          es: '5/1 ARM (Hipotecario Ajustable)',
          fr: '5/1 ARM (Taux Ajustable)',
          ar: 'رهن متغير 5/1 ARM',
        },
        description: {
          en: 'Fixed discounted rate for first 5 years, then resets annually based on market SOFR index.',
          he: 'ריבית מוזלת קבועה ב-5 השנים הראשונות, ולאחר מכן עדכון שנתי לפי מדד השוק.',
          es: 'Tasa inicial con descuento por 5 años, luego se ajusta anualmente.',
          fr: 'Taux préférentiel fixe 5 ans puis révision annuelle selon marché.',
          ar: 'فائدة مخفضة لأول 5 سنوات ثم تعديل سنوي وفق مؤشرات السوق.',
        },
        defaultRate: 6.15,
        defaultYears: 30,
        riskLevel: 'medium',
        badge: '5Y Intro Discount',
      },
    ],
  },
  EU: {
    id: 'EU',
    countryCode: 'EU',
    flag: '🇪🇺',
    currency: 'EUR',
    currencySymbol: '€',
    name: {
      en: 'Eurozone / France / Spain (Taux Fixe)',
      he: 'אירופה / צרפת / ספרד (EUR €)',
      es: 'Zona Euro / España (Tasa Fija / Variable)',
      fr: 'France / Zone Euro (Crédit Immobilier)',
      ar: 'منطقة اليورو / فرنسا / إسبانيا',
    },
    description: {
      en: 'European amortized fixed-rate credit and Euribor-linked mortgages.',
      he: 'אשראי נדל״ן אירופאי בריבית קבועה ומסלולים צמודי יוריבור (Euribor).',
      es: 'Crédito hipotecario amortizable europeo a tipo fijo o Euríbor.',
      fr: 'Prêts immobiliers amortissables classiques à taux fixe en euros.',
      ar: 'قروض التمويل العقاري الأوروبية بفائدة ثابتة أو مرتبطة باليوريبور.',
    },
    defaultPrincipal: 250000,
    tracks: [
      {
        id: 'eu-fixed-20y',
        name: {
          en: 'Crédit Taux Fixe (20-25 Ans)',
          he: 'ריבית קבועה אירופאית (20-25 שנה)',
          es: 'Hipoteca Fija Europea (20-25 Años)',
          fr: 'Crédit Immobilier à Taux Fixe (20-25 Ans)',
          ar: 'تمويل عقاري أوروبي بفائدة ثابتة (20-25 سنة)',
        },
        description: {
          en: 'Standard French & Spanish fixed amortizing home loan with strict consumer rate caps.',
          he: 'הלוואת דיור אירופאית סטנדרטית בריבית קבועה ויציבה לאורך כל התקופה.',
          es: 'Préstamo amortizable estándar a tipo fijo muy extendido en España y Francia.',
          fr: 'Le standard français et européen par excellence : taux fixe et garanti.',
          ar: 'التمويل السكني الأوروبي القياسي بفائدة ثابتة ومحمية.',
        },
        defaultRate: 3.65,
        defaultYears: 20,
        riskLevel: 'low',
        badge: 'Taux Fixe',
      },
      {
        id: 'eu-variable-cape',
        name: {
          en: 'Taux Variable Capé (+/- 1%)',
          he: 'ריבית משתנה עם תקרת הגנה (Capé)',
          es: 'Variable con Techo Cap (+/- 1%)',
          fr: 'Taux Variable Capé (+/- 1%)',
          ar: 'فائدة متغيرة مع سقف حماية كابي (+/- 1%)',
        },
        description: {
          en: 'Variable rate linked to Euribor but protected by a strict 1% maximum increase cap.',
          he: 'ריבית משתנה צמודת יוריבור, אך מוגנת בחוזה בתקרה מקסימלית של עלייה של 1% בלבד.',
          es: 'Variable vinculado al Euríbor con techo de subida limitado al 1%.',
          fr: 'Taux variable sécurisé par un plafond de variation de 1% maximum.',
          ar: 'فائدة متغيرة مع سقف تعاقدي صارم يمنع الارتفاع بأكثر من 1%.',
        },
        defaultRate: 3.25,
        defaultYears: 20,
        riskLevel: 'medium',
        badge: 'Capé Sécurisé',
      },
    ],
  },
  UK: {
    id: 'UK',
    countryCode: 'UK',
    flag: '🇬🇧',
    currency: 'GBP',
    currencySymbol: '£',
    name: {
      en: 'United Kingdom (Fixed Deals & Trackers)',
      he: 'בריטניה (2Y/5Y Fixed ו-Tracker)',
      es: 'Reino Unido (Hipotecas Fijas y Tracker)',
      fr: 'Royaume-Uni (Prêts à Taux Fixe et Tracker)',
      ar: 'المملكة المتحدة (عروض الفائدة الثابتة والمتابعة)',
    },
    description: {
      en: 'British mortgages structured around 2-year or 5-year introductory fixed deals and Bank of England trackers.',
      he: 'משכנתאות בבריטניה הבנויות סביב עסקאות ריבית קבועה ל-2 או 5 שנים ומסלולי מעקב אחרי ריבית בנק אנגליה.',
      es: 'Hipotecas británicas con acuerdos promocionales fijos a 2 o 5 años.',
      fr: 'Prêts britanniques structurés en offres promotionnelles fixes à 2 ou 5 ans.',
      ar: 'قروض الرهن العقاري البريطانية القائمة على عروض فائدة ثابتة لسنتين أو 5 سنوات.',
    },
    defaultPrincipal: 280000,
    tracks: [
      {
        id: 'uk-5y-fixed',
        name: {
          en: '5-Year Fixed Rate Deal',
          he: 'ריבית קבועה ל-5 שנים (5Y Fixed Deal)',
          es: 'Oferta Fija a 5 Años',
          fr: 'Offre Fixe sur 5 Ans',
          ar: 'عرض فائدة ثابتة لمدة 5 سنوات',
        },
        description: {
          en: 'Guaranteed payments for 5 years before refinancing or reverting to Standard Variable Rate (SVR).',
          he: 'החזר מובטח וקבוע ל-5 שנים, לפני מחזור או מעבר לריבית הבנקאית הכללית (SVR).',
          es: 'Pagos garantizados durante 5 años antes de refinanciar.',
          fr: 'Paiements garantis pendant 5 ans avant renégociation.',
          ar: 'دفعات مضمونة لمدة 5 سنوات قبل إعادة التمويل أو التبديل.',
        },
        defaultRate: 4.75,
        defaultYears: 25,
        riskLevel: 'low',
        badge: 'Most Popular UK',
      },
      {
        id: 'uk-tracker',
        name: {
          en: 'Base Rate Tracker Mortgage',
          he: 'מסלול מעקב בנק אנגליה (BOE Tracker)',
          es: 'Hipoteca Tracker Base Rate',
          fr: 'Prêt Tracker Banque d\'Angleterre',
          ar: 'رهن متابع للفائدة الأساسية لبنك إنجلترا',
        },
        description: {
          en: 'Directly follows the Bank of England Base Rate plus a fixed margin (e.g. Base + 0.75%).',
          he: 'עוקב ישירות אחר ריבית הבסיס של בנק אנגליה בתוספת מרווח קבוע (למשל ריבית בסיס + 0.75%).',
          es: 'Sigue directamente el tipo oficial del Banco de Inglaterra más diferencial.',
          fr: 'Suit directement le taux directeur de la Banque d\'Angleterre.',
          ar: 'يتبع مباشرة الفائدة الأساسية لبنك إنجلترا مع هامש ثابت.',
        },
        defaultRate: 5.25,
        defaultYears: 25,
        riskLevel: 'medium',
        badge: 'Tracker + Margin',
      },
    ],
  },
  CUSTOM: {
    id: 'CUSTOM',
    countryCode: 'GLOBAL',
    flag: '🌐',
    currency: 'USD',
    currencySymbol: '$',
    name: {
      en: 'Universal / Custom Math',
      he: 'גלובלי / חישוב אוניברסלי',
      es: 'Universal / Personalizado',
      fr: 'Universel / Personnalisé',
      ar: 'شامل / مخصص',
    },
    description: {
      en: 'Standard mathematical loan amortization without country-specific fiscal rules.',
      he: 'חישוב מתמטי טהור של לוח סילוקין שפיצר ללא מגבלות רגולציה מקומיות.',
      es: 'Cálculo matemático universal de amortización de préstamos.',
      fr: 'Calcul mathématique universel d\'amortissement.',
      ar: 'حساب رياضي شامل لجدول السداد دون قيود محلية.',
    },
    defaultPrincipal: 300000,
    tracks: [
      {
        id: 'custom-standard',
        name: {
          en: 'Standard Amortized Loan',
          he: 'הלוואה בלוח שפיצר סטנדרטי',
          es: 'Préstamo Amortizado Estándar',
          fr: 'Prêt Amortissable Standard',
          ar: 'قرض سداد قياسي',
        },
        description: {
          en: 'Constant annuity periodic payments with decreasing interest and increasing principal.',
          he: 'תשלומים חודשיים שווים (אנונה) עם ריבית פוחתת וסילוק קרן עולה.',
          es: 'Cuotas periódicas constantes con interés decreciente.',
          fr: 'Mensualités constantes avec amortissement progressif.',
          ar: 'أقساط دورية متساوية مع انخفاض الفائدة وزيادة سداد الأصل.',
        },
        defaultRate: 6.0,
        defaultYears: 30,
        riskLevel: 'low',
        badge: 'Universal',
      },
    ],
  },
};

export function getRegimeByCountry(countryCode: string): MortgageRegime {
  const upper = (countryCode || '').toUpperCase();
  if (upper in MORTGAGE_REGIMES) {
    return MORTGAGE_REGIMES[upper as MortgageRegimeId];
  }
  return MORTGAGE_REGIMES.CUSTOM;
}
