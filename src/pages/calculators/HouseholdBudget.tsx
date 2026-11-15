import React, { useCallback, useMemo, useState } from 'react';
import {
  Wallet,
  Home,
  ShoppingCart,
  Zap,
  Car,
  PiggyBank,
  CheckCircle2,
  AlertTriangle,
  Scale,
  RotateCcw,
  PieChart as PieChartIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from 'recharts';
import { useI18n } from '../../contexts/i18n';
import SEO from '../../components/SEO';
import CalculatorGuide from '../../components/CalculatorGuide';
import FAQ from '../../components/FAQ';
import { useUrlState } from '../../hooks/useUrlState';
import { useRecordCalculation } from '../../hooks/useRecordCalculation';
import {
  calculateHouseholdBudget,
  BudgetCategoryId,
} from '../../lib/math/householdBudget';

interface LocalCopy {
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  presetsLabel: string;
  presetBalanced: string;
  presetFamily: string;
  presetStarter: string;
  presetAggressiveSave: string;
  resetBtn: string;
  currencyLabel: string;
  inputsHeading: string;
  monthlyIncome: string;
  monthlyIncomeHint: string;
  housing: string;
  housingHint: string;
  groceries: string;
  groceriesHint: string;
  utilities: string;
  utilitiesHint: string;
  transportation: string;
  transportationHint: string;
  savings: string;
  savingsHint: string;
  ofIncome: string;
  remainingLabel: string;
  remainingShort: string;
  deficitShort: string;
  statusSurplus: string;
  statusTight: string;
  statusBalanced: string;
  statusDeficit: string;
  statusEmpty: string;
  statusSurplusDesc: string;
  statusTightDesc: string;
  statusBalancedDesc: string;
  statusDeficitDesc: string;
  statusEmptyDesc: string;
  livingExpenses: string;
  savingsAllocated: string;
  incomeUsed: string;
  chartTitle: string;
  chartEmptyTitle: string;
  chartEmptyDesc: string;
  categoryCol: string;
  amountCol: string;
  shareCol: string;
  unallocatedLabel: string;
  benchmarkTitle: string;
  benchmarkSubtitle: string;
  needsTarget: string;
  wantsTarget: string;
  savingsTarget: string;
  faqTitle: string;
  faq: Array<{ question: string; answer: string }>;
}

const localDict: Record<string, LocalCopy> = {
  he: {
    eyebrow: 'פיננסים וכלכלת המשפחה · תכנון תקציב חודשי',
    title: 'מחשבון תקציב משק בית',
    subtitle: 'תכנון חודשי נקי ואינטראקטיבי של הכנסות, הוצאות מחיה וחיסכון — כולל חישוב אוטומטי של היתרה שנותרה ותרשים ויזואלי בזמן אמת.',
    description: 'מחשבון תקציב משק בית פשוט ואינטראקטיבי: הזינו הכנסה חודשית, דיור, מצרכים, שירותים, תחבורה וחסכונות וקבלו מיד את הסכום שנותר לאחר הוצאות עם גרף חלוקה והשוואה לכלל 50/30/20.',
    presetsLabel: 'תרחישים מהירים:',
    presetBalanced: 'מאוזן (50/30/20)',
    presetFamily: 'משפחה בישראל',
    presetStarter: 'זוג צעיר / שכירות',
    presetAggressiveSave: 'חיסכון מוגבר',
    resetBtn: 'איפוס',
    currencyLabel: 'מטבע',
    inputsHeading: 'הכנסה והוצאות חודשיות',
    monthlyIncome: 'הכנסה חודשית נטו',
    monthlyIncomeHint: 'סך ההכנסה הנכנסת למשק הבית בחודש לאחר ניכויים',
    housing: 'דיור',
    housingHint: 'שכירות או משכנתא, ועד בית וביטוח מבנה',
    groceries: 'מצרכים',
    groceriesHint: 'קניות סופרמרקט, מזון, פארם ומוצרי בית שוטפים',
    utilities: 'שירותים',
    utilitiesHint: 'חשמל, מים, גז, ארנונה, אינטרנט ותקשורת',
    transportation: 'תחבורה',
    transportationHint: 'דלק, תחבורה ציבורית, ביטוח רכב, טסט וחניה',
    savings: 'חסכונות',
    savingsHint: 'הפרשה חודשית לקרן חירום, פיקדון, קופת גמל או השקעות',
    ofIncome: 'מההכנסה',
    remainingLabel: 'הסכום שנותר לאחר הוצאות וחסכונות',
    remainingShort: 'יתרה פנויה',
    deficitShort: 'חריגה מהתקציב',
    statusSurplus: 'יתרה חיובית בריאה',
    statusTight: 'מרווח ביטחון נמוך (מתחת ל-5%)',
    statusBalanced: 'תקציב מאוזן (אפס יתרה)',
    statusDeficit: 'גירעון חודשי — הוצאות עולות על ההכנסה',
    statusEmpty: 'הזן הכנסה והוצאות להתחלה',
    statusSurplusDesc: 'נשאר לך כסף פנוי להוצאות גמישות, פנאי או חיזוק החיסכון.',
    statusTightDesc: 'היתרה הפנויה צרה מאוד; הוצאה בלתי צפויה עלולה ליצור חריגה.',
    statusBalancedDesc: 'כל שקל מההכנסה הוקצה מראש לסעיפי ההוצאה והחיסכון.',
    statusDeficitDesc: 'סך ההוצאות והחיסכון גבוה מההכנסה החודשית ב-',
    statusEmptyDesc: 'הזינו הכנסה חודשית וסעיפי הוצאה כדי לראות את הפירוט והתרשים.',
    livingExpenses: 'סה״כ הוצאות מחיה',
    savingsAllocated: 'הפרשה לחיסכון',
    incomeUsed: 'ניצול מההכנסה',
    chartTitle: 'התפלגות התקציב החודשי',
    chartEmptyTitle: 'אין נתונים להצגה בתרשים',
    chartEmptyDesc: 'הזינו סכומים חיוביים בשדות הכנסה והוצאות כדי להציג את ההתפלגות.',
    categoryCol: 'סעיף',
    amountCol: 'סכום חודשי',
    shareCol: 'אחוז מההכנסה',
    unallocatedLabel: 'יתרה פנויה שנותרה',
    benchmarkTitle: 'השוואה לכלל התקציב 50 / 30 / 20',
    benchmarkSubtitle: '50% צרכים שוטפים · 30% פנאי ויתרה גמישה · 20% חיסכון והשקעות',
    needsTarget: 'צרכים (יעד ≤50%)',
    wantsTarget: 'יתרה גמישה (~30%)',
    savingsTarget: 'חיסכון (יעד ≥20%)',
    faqTitle: 'שאלות נפוצות על ניהול תקציב משק בית',
    faq: [
      {
        question: 'איך מחשבים כמה כסף נשאר בסוף החודש?',
        answer: 'מחברים את כל הוצאות המחיה הקבועות והמשתנות (דיור, מצרכים, שירותים ותחבורה) יחד עם ההפרשה החודשית לחיסכון, ומפחיתים את הסכום הכולל מההכנסה החודשית נטו. תוצאה חיובית היא יתרה פנויה, ותוצאה שלילית מעידה על גירעון חודשי.',
      },
      {
        question: 'מהו כלל 50/30/20 לניהול תקציב משפחתי?',
        answer: 'כלל אצבע פיננסי נפוץ הממליץ להקצות עד 50% מההכנסה נטו לצרכים חיוניים (דיור, מצרכים, שירותים ותחבורה), 30% להוצאות רשות ופנאי (היתרה הפנויה), ו-20% לפחות לחיסכון, קרן חירום או השקעות.',
      },
      {
        question: 'מה עושים אם המחשבון מראה גירעון חודשי?',
        answer: 'ראשית בדקו את שיעור סעיף הדיור והתחבורה (שבדרך כלל מהווים את עיקר ההוצאה), אתרו הוצאות תקשורת ושירותים הניתנות להוזלה, והגדירו יעד חיסכון ריאלי שמשאיר מרווח ביטחון חיובי של לפחות 5%–10% מההכנסה.',
      },
    ],
  },
  en: {
    eyebrow: 'Personal Finance · Monthly Cash Flow Planner',
    title: 'Household Budget Calculator',
    subtitle: 'Track monthly income, housing, groceries, utilities, transportation, and savings with automatic remaining-balance math and live visual breakdown.',
    description: 'Simple, interactive household budget calculator with fields for monthly income, housing, groceries, utilities, transportation, and savings. Automatically calculates remaining cash flow with an interactive visual chart.',
    presetsLabel: 'Quick Scenarios:',
    presetBalanced: 'Balanced 50/30/20',
    presetFamily: 'Family Household',
    presetStarter: 'Single / Young Couple',
    presetAggressiveSave: 'High Savings',
    resetBtn: 'Reset',
    currencyLabel: 'Currency',
    inputsHeading: 'Monthly Income & Expenses',
    monthlyIncome: 'Monthly Net Income',
    monthlyIncomeHint: 'Total take-home household pay per month after tax deductions',
    housing: 'Housing',
    housingHint: 'Rent or mortgage payment, HOA fees, and home insurance',
    groceries: 'Groceries',
    groceriesHint: 'Supermarket food, pantry staples, and household supplies',
    utilities: 'Utilities',
    utilitiesHint: 'Electricity, water, gas, municipal tax, internet, and phone',
    transportation: 'Transportation',
    transportationHint: 'Fuel, transit pass, auto insurance, maintenance, and parking',
    savings: 'Savings',
    savingsHint: 'Monthly transfers to emergency fund, investments, or retirement',
    ofIncome: 'of income',
    remainingLabel: 'Remaining Amount After Expenses & Savings',
    remainingShort: 'Remaining Cash',
    deficitShort: 'Monthly Deficit',
    statusSurplus: 'Healthy Monthly Surplus',
    statusTight: 'Tight Margin (Under 5%)',
    statusBalanced: 'Zero-Based Balanced Budget',
    statusDeficit: 'Budget Deficit — Outflows Exceed Income',
    statusEmpty: 'Enter Income & Expenses to Begin',
    statusSurplusDesc: 'You have unallocated cash left over for discretionary spending or extra savings.',
    statusTightDesc: 'Your leftover buffer is thin; a small unexpected bill could push you negative.',
    statusBalancedDesc: 'Every unit of monthly income is assigned to living costs and savings.',
    statusDeficitDesc: 'Total expenses and savings exceed monthly income by ',
    statusEmptyDesc: 'Add your monthly income and spending categories to view your breakdown chart.',
    livingExpenses: 'Living Expenses',
    savingsAllocated: 'Monthly Savings',
    incomeUsed: 'Income Allocated',
    chartTitle: 'Monthly Budget Distribution',
    chartEmptyTitle: 'No Chart Data Yet',
    chartEmptyDesc: 'Enter positive amounts for income or expenses to visualize your household split.',
    categoryCol: 'Category',
    amountCol: 'Monthly Amount',
    shareCol: 'Share of Income',
    unallocatedLabel: 'Remaining Balance',
    benchmarkTitle: '50 / 30 / 20 Rule Comparison',
    benchmarkSubtitle: '50% Essentials · 30% Flexible & Remaining · 20% Savings',
    needsTarget: 'Essentials (≤50% target)',
    wantsTarget: 'Remaining (~30%)',
    savingsTarget: 'Savings (≥20% target)',
    faqTitle: 'Household Budgeting FAQ',
    faq: [
      {
        question: 'How is the remaining amount after expenses calculated?',
        answer: 'Remaining balance equals Monthly Net Income minus Living Expenses (Housing + Groceries + Utilities + Transportation) minus Monthly Savings. Positive values represent unallocated cash surplus; negative values indicate a monthly deficit.',
      },
      {
        question: 'What is the 50/30/20 household budget rule?',
        answer: 'The 50/30/20 framework allocates up to 50% of take-home income to essential needs (housing, groceries, utilities, transport), 30% to flexible wants or buffer cash, and at least 20% to savings and debt reduction.',
      },
      {
        question: 'Should savings be counted before calculating remaining spending money?',
        answer: 'Yes. Treating savings as a dedicated monthly line item ("pay yourself first") ensures your remaining balance reflects truly spendable cash flow without eating into long-term goals.',
      },
    ],
  },
  es: {
    eyebrow: 'Finanzas Personales · Control Mensual',
    title: 'Calculadora de Presupuesto Familiar',
    subtitle: 'Organiza ingresos mensuales, vivienda, alimentación, servicios, transporte y ahorro con cálculo automático del saldo restante y gráfico visual.',
    description: 'Calculadora interactiva de presupuesto del hogar para ingresos, vivienda, supermercado, servicios, transporte y ahorros con saldo disponible automático.',
    presetsLabel: 'Escenarios rápidos:',
    presetBalanced: 'Equilibrado 50/30/20',
    presetFamily: 'Hogar Familiar',
    presetStarter: 'Pareja Joven',
    presetAggressiveSave: 'Ahorro Alto',
    resetBtn: 'Reiniciar',
    currencyLabel: 'Moneda',
    inputsHeading: 'Ingresos y Gastos Mensuales',
    monthlyIncome: 'Ingreso Mensual Neto',
    monthlyIncomeHint: 'Total de ingresos disponibles del hogar al mes tras impuestos',
    housing: 'Vivienda',
    housingHint: 'Alquiler o hipoteca, comunidad y seguro del hogar',
    groceries: 'Alimentación',
    groceriesHint: 'Supermercado, comida y artículos básicos del hogar',
    utilities: 'Servicios',
    utilitiesHint: 'Electricidad, agua, gas, internet y telefonía',
    transportation: 'Transporte',
    transportationHint: 'Combustible, transporte público, seguro y mantenimiento',
    savings: 'Ahorros',
    savingsHint: 'Aporte mensual a fondo de emergencia o inversión',
    ofIncome: 'del ingreso',
    remainingLabel: 'Saldo Restante Tras Gastos y Ahorros',
    remainingShort: 'Saldo Disponible',
    deficitShort: 'Déficit Mensual',
    statusSurplus: 'Superávit Saludable',
    statusTight: 'Margen Ajustado (<5%)',
    statusBalanced: 'Presupuesto Equilibrado (0)',
    statusDeficit: 'Déficit — Los Gastos Superan al Ingreso',
    statusEmpty: 'Introduce Ingresos y Gastos',
    statusSurplusDesc: 'Tienes dinero disponible para imprevistos, ocio o ahorro extra.',
    statusTightDesc: 'El margen restante es estrecho ante gastos imprevistos.',
    statusBalancedDesc: 'Todo tu ingreso mensual está asignado entre gastos y ahorros.',
    statusDeficitDesc: 'Los gastos y ahorros superan tu ingreso mensual en ',
    statusEmptyDesc: 'Ingresa valores positivos para ver el gráfico de distribución.',
    livingExpenses: 'Gastos de Vida',
    savingsAllocated: 'Ahorro Mensual',
    incomeUsed: 'Ingreso Asignado',
    chartTitle: 'Distribución del Presupuesto',
    chartEmptyTitle: 'Sin datos para graficar',
    chartEmptyDesc: 'Introduce ingresos o gastos positivos para visualizar el reparto.',
    categoryCol: 'Categoría',
    amountCol: 'Importe',
    shareCol: '% Ingreso',
    unallocatedLabel: 'Saldo Restante',
    benchmarkTitle: 'Comparativa Regla 50 / 30 / 20',
    benchmarkSubtitle: '50% Esenciales · 30% Margen Libre · 20% Ahorro',
    needsTarget: 'Esenciales (≤50%)',
    wantsTarget: 'Restante (~30%)',
    savingsTarget: 'Ahorro (≥20%)',
    faqTitle: 'Preguntas Frecuentes sobre Presupuesto Familiar',
    faq: [
      {
        question: '¿Cómo se calcula el saldo restante después de gastos?',
        answer: 'Se resta la suma de vivienda, alimentación, servicios, transporte y ahorro mensual del ingreso neto total. Un valor positivo indica excedente disponible.',
      },
      {
        question: '¿Qué es la regla 50/30/20?',
        answer: 'Sugiere destinar hasta un 50% de tus ingresos netos a necesidades básicas, un 30% a gastos flexibles y al menos un 20% al ahorro.',
      },
    ],
  },
  fr: {
    eyebrow: 'Finances Personnelles · Budget du Foyer',
    title: 'Calculateur de Budget Familial',
    subtitle: 'Suivez revenus mensuels, logement, alimentation, charges, transport et épargne avec calcul automatique du reste à vivre et graphique interactif.',
    description: 'Calculateur simple et interactif de budget du ménage : revenus mensuels, logement, courses, charges, transport et épargne avec graphique en direct.',
    presetsLabel: 'Scénarios rapides :',
    presetBalanced: 'Équilibré 50/30/20',
    presetFamily: 'Famille',
    presetStarter: 'Jeune Actif',
    presetAggressiveSave: 'Épargne Élevée',
    resetBtn: 'Réinitialiser',
    currencyLabel: 'Devise',
    inputsHeading: 'Revenus et Dépenses Mensuels',
    monthlyIncome: 'Revenu Mensuel Net',
    monthlyIncomeHint: 'Total des revenus nets du foyer chaque mois',
    housing: 'Logement',
    housingHint: 'Loyer ou crédit immobilier, charges de copropriété et assurance',
    groceries: 'Courses & Alimentation',
    groceriesHint: 'Supermarché, alimentation et produits du quotidien',
    utilities: 'Charges & Services',
    utilitiesHint: 'Électricité, eau, gaz, internet et téléphone',
    transportation: 'Transport',
    transportationHint: 'Carburant, transports en commun, assurance et entretien',
    savings: 'Épargne',
    savingsHint: 'Virement mensuel vers livret, fonds d’urgence ou placements',
    ofIncome: 'du revenu',
    remainingLabel: 'Montant Restant Après Dépenses et Épargne',
    remainingShort: 'Reste à Vivre',
    deficitShort: 'Déficit Mensuel',
    statusSurplus: 'Excédent Mensuel Sain',
    statusTight: 'Marge Réduite (<5%)',
    statusBalanced: 'Budget Équilibré (0)',
    statusDeficit: 'Déficit — Dépenses Supérieures au Revenu',
    statusEmpty: 'Saisissez Revenus et Dépenses',
    statusSurplusDesc: 'Il vous reste une marge disponible pour les loisirs ou une épargne supplémentaire.',
    statusTightDesc: 'Votre marge de sécurité reste faible face aux imprévus.',
    statusBalancedDesc: 'Chaque euro de revenu est affecté à vos postes ou à votre épargne.',
    statusDeficitDesc: 'Vos sorties dépassent vos revenus mensuels de ',
    statusEmptyDesc: 'Ajoutez vos montants mensuels pour afficher le graphique.',
    livingExpenses: 'Dépenses Courantes',
    savingsAllocated: 'Épargne Mensuelle',
    incomeUsed: 'Part Allouée',
    chartTitle: 'Répartition du Budget Mensuel',
    chartEmptyTitle: 'Aucune donnée à afficher',
    chartEmptyDesc: 'Entrez des montants positifs pour visualiser votre répartition.',
    categoryCol: 'Poste',
    amountCol: 'Montant',
    shareCol: '% du Revenu',
    unallocatedLabel: 'Reste à Vivre',
    benchmarkTitle: 'Comparaison Règle 50 / 30 / 20',
    benchmarkSubtitle: '50% Essentiels · 30% Marge Libre · 20% Épargne',
    needsTarget: 'Essentiels (≤50%)',
    wantsTarget: 'Reste (~30%)',
    savingsTarget: 'Épargne (≥20%)',
    faqTitle: 'Questions Fréquentes sur le Budget du Foyer',
    faq: [
      {
        question: 'Comment calculer le reste à vivre mensuel ?',
        answer: 'Le reste à vivre correspond au revenu net mensuel moins les dépenses de logement, courses, charges, transport et épargne programmée.',
      },
      {
        question: 'Qu’est-ce que la règle budgétaire 50/30/20 ?',
        answer: 'Elle consiste à consacrer environ 50 % des revenus aux besoins essentiels, 30 % aux dépenses flexibles et au moins 20 % à l’épargne.',
      },
    ],
  },
  ar: {
    eyebrow: 'التمويل الشخصي · تخطيط ميزانية الأسرة',
    title: 'حاسبة ميزانية الأسرة والمنزل',
    subtitle: 'نظّم الدخل الشهري والسكن والمواد الغذائية والمرافق والمواصلات والادخار مع حساب تلقائي للمتبقي ورسم بياني تفاعلي.',
    description: 'حاسبة ميزانية الأسرة البسيطة والتفاعلية لحساب الدخل الشهري وتكاليف السكن والطعام والمرافق والمواصلات والادخار مع عرض المبلغ المتبقي فوراً.',
    presetsLabel: 'سيناريوهات سريعة:',
    presetBalanced: 'متوازن 50/30/20',
    presetFamily: 'أسرة متوسطة',
    presetStarter: 'شاب / بداية المسار',
    presetAggressiveSave: 'ادخار مرتفع',
    resetBtn: 'إعادة ضبط',
    currencyLabel: 'العملة',
    inputsHeading: 'الدخل والمصروفات الشهرية',
    monthlyIncome: 'الدخل الشهري الصافي',
    monthlyIncomeHint: 'إجمالي الدخل الشهري المتاح للأسرة بعد الضرائب',
    housing: 'السكن',
    housingHint: 'الإيجار أو قسط المنزل ورسوم الصيانة والتأمين',
    groceries: 'المواد الغذائية والمشتريات',
    groceriesHint: 'مشتريات السوبرماركت والطعام ومستلزمات المنزل اليومية',
    utilities: 'الخدمات والمرافق',
    utilitiesHint: 'الكهرباء والماء والغاز والإنترنت والاتصالات',
    transportation: 'المواصلات والنقل',
    transportationHint: 'الوقود والمواصلات العامة وتأمين وصيانة السيارة',
    savings: 'الادخار',
    savingsHint: 'المبلغ الشهري المخصص لصندوق الطوارئ أو الاستثمار',
    ofIncome: 'من الدخل',
    remainingLabel: 'المبلغ المتبقي بعد المصروفات والادخار',
    remainingShort: 'الفائض المتاح',
    deficitShort: 'العجز الشهري',
    statusSurplus: 'فائض شهري صحي',
    statusTight: 'هامش أمان منخفض (أقل من 5%)',
    statusBalanced: 'ميزانية متوازنة تماماً',
    statusDeficit: 'عجز شهري — المصروفات تتجاوز الدخل',
    statusEmpty: 'أدخل الدخل والمصروفات للبدء',
    statusSurplusDesc: 'يتبقى لديك سيولة متاحة للطوارئ أو النفقات المرنة أو زيادة الادخار.',
    statusTightDesc: 'المبلغ المتبقي ضئيل جداً وقد تؤدي أي فاتورة طارئة لعجز.',
    statusBalancedDesc: 'تم توزيع كامل الدخل الشهري على المصروفات والادخار.',
    statusDeficitDesc: 'تتجاوز المصروفات والادخار دخلك الشهري بمقدار ',
    statusEmptyDesc: 'أدخل قيماً موجبة لعرض التوزيع البياني للميزانية.',
    livingExpenses: 'إجمالي المصروفات المعيشية',
    savingsAllocated: 'الادخار الشهري',
    incomeUsed: 'نسبة الاستهلاك',
    chartTitle: 'توزيع الميزانية الشهرية',
    chartEmptyTitle: 'لا توجد بيانات للرسم البياني',
    chartEmptyDesc: 'أدخل قيماً للدخل والمصروفات لعرض التوزيع النسبي.',
    categoryCol: 'البند',
    amountCol: 'المبلغ الشهري',
    shareCol: 'النسبة من الدخل',
    unallocatedLabel: 'المتبقي غير المخصص',
    benchmarkTitle: 'مقارنة مع قاعدة 50 / 30 / 20',
    benchmarkSubtitle: '50% أساسيات · 30% مرونة ومتبقي · 20% ادخار',
    needsTarget: 'الأساسيات (الهدف ≤50%)',
    wantsTarget: 'المتبقي (~30%)',
    savingsTarget: 'الادخار (الهدف ≥20%)',
    faqTitle: 'الأسئلة الشائعة حول ميزانية الأسرة',
    faq: [
      {
        question: 'كيف يُحسب المبلغ المتبقي بعد المصروفات؟',
        answer: 'يتم جمع تكاليف السكن والغذاء والمرافق والمواصلات مع مبلغ الادخار الشهري، ثم طرح المجموع من صافي الدخل الشهري لإظهار الفائض أو العجز.',
      },
      {
        question: 'ما هي قاعدة 50/30/20 لإدارة الميزانية؟',
        answer: 'تنصح القاعدة بتخصيص حتى 50% من الدخل للاحتياجات الأساسية، و30% للنفقات المرنة والترفيه، و20% على الأقل للادخار وبناء الثروة.',
      },
    ],
  },
  ru: {
    eyebrow: 'Личные финансы · Семейный бюджет',
    title: 'Калькулятор семейного бюджета',
    subtitle: 'Удобное планирование ежемесячного дохода, жилья, продуктов, коммунальных услуг, транспорта и сбережений с расчетом остатка и графиком.',
    description: 'Интерактивный калькулятор домашнего бюджета: доход, жилье, продукты, коммунальные платежи, транспорт и сбережения с автоматическим расчетом остатка и диаграммой.',
    presetsLabel: 'Быстрые сценарии:',
    presetBalanced: 'Баланс 50/30/20',
    presetFamily: 'Семья',
    presetStarter: 'Молодой специалист',
    presetAggressiveSave: 'Высокие накопления',
    resetBtn: 'Сбросить',
    currencyLabel: 'Валюта',
    inputsHeading: 'Доходы и расходы за месяц',
    monthlyIncome: 'Чистый доход в месяц',
    monthlyIncomeHint: 'Совокупный доход домохозяйства на руки после налогов',
    housing: 'Жилье',
    housingHint: 'Аренда или ипотека, содержание и страховка жилья',
    groceries: 'Продукты',
    groceriesHint: 'Покупки в супермаркетах и бытовые товары',
    utilities: 'Коммунальные услуги',
    utilitiesHint: 'Электричество, вода, газ, интернет и связь',
    transportation: 'Транспорт',
    transportationHint: 'Топливо, общественный транспорт, страховка и сервис',
    savings: 'Сбережения',
    savingsHint: 'Ежемесячные отчисления в резерв и инвестиции',
    ofIncome: 'от дохода',
    remainingLabel: 'Остаток после расходов и сбережений',
    remainingShort: 'Свободный остаток',
    deficitShort: 'Дефицит бюджета',
    statusSurplus: 'Здоровый профицит бюджета',
    statusTight: 'Небольшой запас (<5%)',
    statusBalanced: 'Сбалансированный бюджет (0)',
    statusDeficit: 'Дефицит — расходы превышают доход',
    statusEmpty: 'Введите доход и расходы',
    statusSurplusDesc: 'У вас остается свободный резерв на досуг или дополнительные накопления.',
    statusTightDesc: 'Запас прочности небольшой; внеплановые траты могут создать дефицит.',
    statusBalancedDesc: 'Весь ежемесячный доход полностью распределен по статьям.',
    statusDeficitDesc: 'Расходы и сбережения превышают ежемесячный доход на ',
    statusEmptyDesc: 'Укажите суммы доходов и расходов для построения графика.',
    livingExpenses: 'Текущие расходы',
    savingsAllocated: 'В накопления',
    incomeUsed: 'Доля расхода',
    chartTitle: 'Структура бюджета',
    chartEmptyTitle: 'Нет данных для диаграммы',
    chartEmptyDesc: 'Введите положительные значения дохода или расходов.',
    categoryCol: 'Категория',
    amountCol: 'Сумма в месяц',
    shareCol: 'Доля дохода',
    unallocatedLabel: 'Свободный остаток',
    benchmarkTitle: 'Сравнение с правилом 50 / 30 / 20',
    benchmarkSubtitle: '50% базовые нужды · 30% гибкий остаток · 20% сбережения',
    needsTarget: 'Базовые (цель ≤50%)',
    wantsTarget: 'Остаток (~30%)',
    savingsTarget: 'Сбережения (цель ≥20%)',
    faqTitle: 'Частые вопросы о семейном бюджете',
    faq: [
      {
        question: 'Как рассчитывается остаток после всех расходов?',
        answer: 'Из чистого ежемесячного дохода вычитаются расходы на жилье, продукты, ЖКУ, транспорт и ежемесячные сбережения.',
      },
      {
        question: 'В чем суть правила 50/30/20?',
        answer: 'До 50% дохода направляется на базовые потребности, 30% — на гибкие траты и резерв, и не менее 20% — на сбережения.',
      },
    ],
  },
};

type CurrencyCode = 'ILS' | 'USD' | 'EUR' | 'GBP';

const CURRENCY_CONFIG: Record<CurrencyCode, { symbol: string; locale: string }> = {
  ILS: { symbol: '₪', locale: 'he-IL' },
  USD: { symbol: '$', locale: 'en-US' },
  EUR: { symbol: '€', locale: 'fr-FR' },
  GBP: { symbol: '£', locale: 'en-GB' },
};

function getDefaultCurrencyForLang(lang: string): CurrencyCode {
  if (lang === 'he') return 'ILS';
  if (lang === 'fr' || lang === 'es') return 'EUR';
  return 'USD';
}

export default function HouseholdBudget() {
  const { lang, guides } = useI18n();
  const d = localDict[lang] || localDict.en;
  const isRtl = lang === 'he' || lang === 'ar';

  const defaultCurrency = getDefaultCurrencyForLang(lang);
  const [currency, setCurrency] = useState<CurrencyCode>(defaultCurrency);

  const [monthlyIncome, setMonthlyIncome] = useUrlState<number>('income', lang === 'he' ? 18000 : 6500);
  const [housing, setHousing] = useUrlState<number>('housing', lang === 'he' ? 6200 : 2100);
  const [groceries, setGroceries] = useUrlState<number>('groceries', lang === 'he' ? 2800 : 850);
  const [utilities, setUtilities] = useUrlState<number>('utilities', lang === 'he' ? 1100 : 380);
  const [transportation, setTransportation] = useUrlState<number>('transportation', lang === 'he' ? 1600 : 520);
  const [savings, setSavings] = useUrlState<number>('savings', lang === 'he' ? 3200 : 1300);

  const currMeta = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.USD;

  const formatMoney = useCallback(
    (value: number) => {
      const absVal = Math.abs(value);
      const formatted = absVal.toLocaleString(currMeta.locale, {
        maximumFractionDigits: Number.isInteger(absVal) ? 0 : 2,
      });
      return value < 0 ? `-${currMeta.symbol}${formatted}` : `${currMeta.symbol}${formatted}`;
    },
    [currMeta.locale, currMeta.symbol]
  );

  const result = useMemo(
    () =>
      calculateHouseholdBudget({
        monthlyIncome,
        housing,
        groceries,
        utilities,
        transportation,
        savings,
      }),
    [monthlyIncome, housing, groceries, utilities, transportation, savings]
  );

  useRecordCalculation({
    calculatorId: 'household-budget',
    title: {
      en: localDict.en.title,
      he: localDict.he.title,
      es: localDict.es.title,
      fr: localDict.fr.title,
      ar: localDict.ar.title,
    },
    summary: {
      en: `${formatMoney(result.monthlyIncome)} income · ${result.savingsRatePercent}% saved`,
      he: `הכנסה ${formatMoney(result.monthlyIncome)} · חיסכון ${result.savingsRatePercent}%`,
      es: `Ingreso ${formatMoney(result.monthlyIncome)} · Ahorro ${result.savingsRatePercent}%`,
      fr: `Revenu ${formatMoney(result.monthlyIncome)} · Épargne ${result.savingsRatePercent}%`,
      ar: `الدخل ${formatMoney(result.monthlyIncome)} · ادخار ${result.savingsRatePercent}%`,
    },
    result: {
      en: `${d.remainingShort}: ${formatMoney(result.remainingBalance)}`,
      he: `${localDict.he.remainingShort}: ${formatMoney(result.remainingBalance)}`,
      es: `${localDict.es.remainingShort}: ${formatMoney(result.remainingBalance)}`,
      fr: `${localDict.fr.remainingShort}: ${formatMoney(result.remainingBalance)}`,
      ar: `${localDict.ar.remainingShort}: ${formatMoney(result.remainingBalance)}`,
    },
    path: `/${lang}/calculators/household-budget`,
  });

  const applyValues = (vals: Partial<{
    monthlyIncome: number;
    housing: number;
    groceries: number;
    utilities: number;
    transportation: number;
    savings: number;
  }>) => {
    if (typeof vals.monthlyIncome === 'number') setMonthlyIncome(vals.monthlyIncome);
    if (typeof vals.housing === 'number') setHousing(vals.housing);
    if (typeof vals.groceries === 'number') setGroceries(vals.groceries);
    if (typeof vals.utilities === 'number') setUtilities(vals.utilities);
    if (typeof vals.transportation === 'number') setTransportation(vals.transportation);
    if (typeof vals.savings === 'number') setSavings(vals.savings);
  };

  const handleReset = () => {
    applyValues({
      monthlyIncome: 0,
      housing: 0,
      groceries: 0,
      utilities: 0,
      transportation: 0,
      savings: 0,
    });
  };

  const presets = useMemo(() => {
    const scale = currency === 'ILS' ? 3 : 1;
    return [
      {
        id: 'balanced',
        label: d.presetBalanced,
        values: {
          monthlyIncome: 6000 * scale,
          housing: 1800 * scale,
          groceries: 600 * scale,
          utilities: 300 * scale,
          transportation: 300 * scale,
          savings: 1200 * scale,
        },
      },
      {
        id: 'family',
        label: d.presetFamily,
        values: {
          monthlyIncome: 7500 * scale,
          housing: 2400 * scale,
          groceries: 1100 * scale,
          utilities: 450 * scale,
          transportation: 650 * scale,
          savings: 1300 * scale,
        },
      },
      {
        id: 'starter',
        label: d.presetStarter,
        values: {
          monthlyIncome: 4200 * scale,
          housing: 1450 * scale,
          groceries: 500 * scale,
          utilities: 240 * scale,
          transportation: 260 * scale,
          savings: 750 * scale,
        },
      },
      {
        id: 'save',
        label: d.presetAggressiveSave,
        values: {
          monthlyIncome: 7000 * scale,
          housing: 1750 * scale,
          groceries: 650 * scale,
          utilities: 300 * scale,
          transportation: 350 * scale,
          savings: 2450 * scale,
        },
      },
    ];
  }, [currency, d]);

  const chartData = useMemo(() => {
    const labels: Record<BudgetCategoryId, string> = {
      housing: d.housing,
      groceries: d.groceries,
      utilities: d.utilities,
      transportation: d.transportation,
      savings: d.savings,
      remaining: d.unallocatedLabel,
    };
    return result.chartSlices.map((slice) => ({
      ...slice,
      name: labels[slice.id],
    }));
  }, [result.chartSlices, d.housing, d.groceries, d.utilities, d.transportation, d.savings, d.unallocatedLabel]);

  const expenseFields = [
    {
      id: 'housing' as const,
      label: d.housing,
      hint: d.housingHint,
      value: housing,
      onChange: setHousing,
      share: result.categoryShares.housing,
      color: '#0f766e',
      icon: Home,
      sliderMax: Math.max(2000, Math.round((monthlyIncome || 6000) * 0.7), housing),
    },
    {
      id: 'groceries' as const,
      label: d.groceries,
      hint: d.groceriesHint,
      value: groceries,
      onChange: setGroceries,
      share: result.categoryShares.groceries,
      color: '#0284c7',
      icon: ShoppingCart,
      sliderMax: Math.max(1000, Math.round((monthlyIncome || 6000) * 0.4), groceries),
    },
    {
      id: 'utilities' as const,
      label: d.utilities,
      hint: d.utilitiesHint,
      value: utilities,
      onChange: setUtilities,
      share: result.categoryShares.utilities,
      color: '#d97706',
      icon: Zap,
      sliderMax: Math.max(600, Math.round((monthlyIncome || 6000) * 0.25), utilities),
    },
    {
      id: 'transportation' as const,
      label: d.transportation,
      hint: d.transportationHint,
      value: transportation,
      onChange: setTransportation,
      share: result.categoryShares.transportation,
      color: '#6366f1',
      icon: Car,
      sliderMax: Math.max(800, Math.round((monthlyIncome || 6000) * 0.3), transportation),
    },
    {
      id: 'savings' as const,
      label: d.savings,
      hint: d.savingsHint,
      value: savings,
      onChange: setSavings,
      share: result.categoryShares.savings,
      color: '#10b981',
      icon: PiggyBank,
      sliderMax: Math.max(1500, Math.round((monthlyIncome || 6000) * 0.6), savings),
    },
  ];

  const statusMeta = useMemo(() => {
    switch (result.status) {
      case 'deficit':
        return {
          label: d.statusDeficit,
          desc: `${d.statusDeficitDesc}${formatMoney(result.deficitAmount)}`,
          textClass: 'text-red-700 dark:text-red-400',
          boxClass: 'bg-red-50/80 dark:bg-red-950/30 border-red-200 dark:border-red-900/60',
          valueClass: 'text-red-700 dark:text-red-400',
          Icon: AlertTriangle,
        };
      case 'tight':
        return {
          label: d.statusTight,
          desc: d.statusTightDesc,
          textClass: 'text-amber-700 dark:text-amber-400',
          boxClass: 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60',
          valueClass: 'text-amber-700 dark:text-amber-400',
          Icon: AlertTriangle,
        };
      case 'balanced':
        return {
          label: d.statusBalanced,
          desc: d.statusBalancedDesc,
          textClass: 'text-teal-700 dark:text-teal-400',
          boxClass: 'bg-teal-50/80 dark:bg-teal-950/30 border-teal-200 dark:border-teal-900/60',
          valueClass: 'text-teal-700 dark:text-teal-300',
          Icon: Scale,
        };
      case 'empty':
        return {
          label: d.statusEmpty,
          desc: d.statusEmptyDesc,
          textClass: 'text-stone-600 dark:text-stone-400',
          boxClass: 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700',
          valueClass: 'text-stone-700 dark:text-stone-200',
          Icon: Wallet,
        };
      case 'surplus':
      default:
        return {
          label: d.statusSurplus,
          desc: d.statusSurplusDesc,
          textClass: 'text-emerald-700 dark:text-emerald-400',
          boxClass: 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60',
          valueClass: 'text-emerald-700 dark:text-emerald-400',
          Icon: CheckCircle2,
        };
    }
  }, [result.status, result.deficitAmount, d, formatMoney]);

  const faqItems = useMemo(() => {
    const localeFaq = guides?.['household-budget']?.faq;
    if (Array.isArray(localeFaq) && localeFaq.length > 0) return localeFaq;
    return d.faq;
  }, [guides, d.faq]);

  const needsBarWidth = Math.min(100, result.benchmark503020.actualNeedsPercent);
  const savingsBarWidth = Math.min(
    Math.max(0, 100 - needsBarWidth),
    result.benchmark503020.actualSavingsPercent
  );
  const freeBarWidth = Math.min(
    Math.max(0, 100 - needsBarWidth - savingsBarWidth),
    result.benchmark503020.actualFreeCashPercent
  );

  const StatusIcon = statusMeta.Icon;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-8">
      <SEO
        title={d.title}
        description={d.description}
        keywords={[
          'household budget calculator',
          'monthly budget planner',
          'budget calculator',
          'מחשבון תקציב משק בית',
          'ניהול תקציב חודשי',
          'חישוב הוצאות והכנסות',
        ]}
        canonicalUrl="/calculators/household-budget"
        type="SoftwareApplication"
        applicationCategory="FinanceApplication"
        faq={faqItems}
      />

      {/* Page Header — clean typography without pill enclosures */}
      <header className="space-y-2 pt-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
          {d.eyebrow}
        </p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-stone-900 dark:text-white">
              {d.title}
            </h1>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed">
              {d.subtitle}
            </p>
          </div>

          {/* Currency & Reset Controls */}
          <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
            <div
              className="inline-flex items-center rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 p-1"
              role="group"
              aria-label={d.currencyLabel}
            >
              {(['ILS', 'USD', 'EUR', 'GBP'] as CurrencyCode[]).map((code) => {
                const active = currency === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setCurrency(code)}
                    className={`min-h-[36px] px-2.5 rounded-lg text-xs font-bold transition-colors tabular-nums ${
                      active
                        ? 'bg-teal-700 text-white'
                        : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    {CURRENCY_CONFIG[code].symbol} {code}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="min-h-[44px] inline-flex items-center gap-1.5 px-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title={d.resetBtn}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{d.resetBtn}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Scenario Presets Strip */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 me-1">
          {d.presetsLabel}
        </span>
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => applyValues(preset.values)}
            className="min-h-[36px] px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-semibold text-stone-700 dark:text-stone-200 hover:border-teal-600 hover:text-teal-700 dark:hover:border-teal-400 dark:hover:text-teal-300 transition-colors"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Main 2-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left/Start Column: Clean Interactive Budget Inputs */}
        <section
          aria-label={d.inputsHeading}
          className="lg:col-span-7 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 sm:p-6 space-y-6"
        >
          {/* Monthly Income Highlight Row */}
          <div className="pb-5 border-b border-stone-200 dark:border-stone-800 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="hb-income"
                className="flex items-center gap-2 text-sm font-bold text-stone-900 dark:text-white"
              >
                <Wallet className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                <span>{d.monthlyIncome}</span>
              </label>
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 tabular-nums" dir="ltr">
                100% Baseline
              </span>
            </div>

            <div className="relative">
              <span
                className={`absolute top-1/2 -translate-y-1/2 ${
                  isRtl ? 'right-3.5' : 'left-3.5'
                } text-base font-bold text-stone-500 dark:text-stone-400 pointer-events-none select-none`}
              >
                {currMeta.symbol}
              </span>
              <input
                id="hb-income"
                type="number"
                inputMode="decimal"
                min={0}
                step="100"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Math.max(0, Number(e.target.value) || 0))}
                className={`w-full min-h-[48px] bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 rounded-xl ${
                  isRtl ? 'pr-9 pl-4' : 'pl-9 pr-4'
                } py-2.5 text-xl font-extrabold text-stone-900 dark:text-white tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-colors`}
              />
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">{d.monthlyIncomeHint}</p>
          </div>

          {/* 5 Expense & Savings Categories */}
          <div className="space-y-5">
            {expenseFields.map((field) => {
              const Icon = field.icon;
              return (
                <div key={field.id} className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor={`hb-${field.id}`}
                      className="flex items-center gap-2 text-sm font-semibold text-stone-800 dark:text-stone-200"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-sm shrink-0"
                        style={{ backgroundColor: field.color }}
                        aria-hidden="true"
                      />
                      <Icon className="w-4 h-4 text-stone-500 dark:text-stone-400 shrink-0" />
                      <span>{field.label}</span>
                    </label>

                    <span className="text-xs font-semibold text-stone-600 dark:text-stone-400 tabular-nums">
                      {result.monthlyIncome > 0 ? `${field.share}% ${d.ofIncome}` : '—'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <div className="sm:col-span-5 relative">
                      <span
                        className={`absolute top-1/2 -translate-y-1/2 ${
                          isRtl ? 'right-3' : 'left-3'
                        } text-sm font-bold text-stone-500 dark:text-stone-400 pointer-events-none select-none`}
                      >
                        {currMeta.symbol}
                      </span>
                      <input
                        id={`hb-${field.id}`}
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="50"
                        value={field.value}
                        onChange={(e) => field.onChange(Math.max(0, Number(e.target.value) || 0))}
                        className={`w-full min-h-[44px] bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-xl ${
                          isRtl ? 'pr-8 pl-3' : 'pl-8 pr-3'
                        } py-2 text-base font-bold text-stone-900 dark:text-white tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-colors`}
                      />
                    </div>

                    <div className="sm:col-span-7 flex items-center gap-2">
                      <input
                        type="range"
                        aria-label={`${field.label} slider`}
                        min={0}
                        max={field.sliderMax}
                        step={50}
                        value={Math.min(field.value, field.sliderMax)}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-stone-200 dark:bg-stone-700 accent-teal-700 dark:accent-teal-400"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-stone-500 dark:text-stone-400">{field.hint}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right/End Column: Automatic Results & Visual Chart */}
        <aside className="lg:col-span-5 lg:sticky lg:top-24 space-y-5">
          {/* Primary Results + Remaining Balance */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 sm:p-6 space-y-5">
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                {d.remainingLabel}
              </div>

              <div
                className={`text-3xl sm:text-4xl font-black tracking-tight tabular-nums ${statusMeta.valueClass}`}
                dir="ltr"
              >
                {formatMoney(result.remainingBalance)}
              </div>

              {/* Status Banner — paired icon + explicit label (never hue-only) */}
              <div className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs ${statusMeta.boxClass}`}>
                <StatusIcon className={`w-4 h-4 shrink-0 mt-0.5 ${statusMeta.textClass}`} />
                <div className="space-y-0.5">
                  <div className={`font-bold ${statusMeta.textClass}`}>{statusMeta.label}</div>
                  <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                    {statusMeta.desc}
                  </p>
                </div>
              </div>
            </div>

            {/* 3 Secondary Summary Metrics (flat grid dividers) */}
            <div className="grid grid-cols-3 divide-x rtl:divide-x-reverse divide-stone-200 dark:divide-stone-800 border-t border-b border-stone-200 dark:border-stone-800 py-3.5">
              <div className="px-2 first:ps-0 last:pe-0">
                <div className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
                  {d.livingExpenses}
                </div>
                <div className="text-sm sm:text-base font-bold text-stone-900 dark:text-white tabular-nums mt-0.5" dir="ltr">
                  {formatMoney(result.totalLivingExpenses)}
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 tabular-nums">
                  {result.expenseSharePercent}%
                </div>
              </div>

              <div className="px-2 first:ps-0 last:pe-0">
                <div className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
                  {d.savingsAllocated}
                </div>
                <div className="text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-400 tabular-nums mt-0.5" dir="ltr">
                  {formatMoney(result.savings)}
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 tabular-nums">
                  {result.savingsRatePercent}%
                </div>
              </div>

              <div className="px-2 first:ps-0 last:pe-0">
                <div className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
                  {d.incomeUsed}
                </div>
                <div className="text-sm sm:text-base font-bold text-stone-900 dark:text-white tabular-nums mt-0.5">
                  {result.allocationPercent}%
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 tabular-nums" dir="ltr">
                  {formatMoney(result.totalAllocated)}
                </div>
              </div>
            </div>

            {/* Visual Donut Chart */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                  <span>{d.chartTitle}</span>
                </h2>
              </div>

              {chartData.length > 0 ? (
                <>
                  <div className="h-[220px] w-full" dir="ltr">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius="56%"
                          outerRadius="86%"
                          paddingAngle={2}
                          stroke="none"
                        >
                          {chartData.map((entry) => (
                            <Cell key={entry.id} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          formatter={(value, name) => {
                            const num = Number(value) || 0;
                            const pct = result.monthlyIncome > 0
                              ? ` (${((num / result.monthlyIncome) * 100).toFixed(1)}%)`
                              : '';
                            return [`${formatMoney(num)}${pct}`, String(name)];
                          }}
                          contentStyle={{
                            borderRadius: '0.75rem',
                            border: '1px solid #e7e5e4',
                            fontSize: '12px',
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Clean Breakdown Table */}
                  <div className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
                    {chartData.map((slice) => (
                      <div
                        key={slice.id}
                        className="flex items-center justify-between py-2 gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="w-2.5 h-2.5 rounded-sm shrink-0"
                            style={{ backgroundColor: slice.color }}
                            aria-hidden="true"
                          />
                          <span className="font-medium text-stone-700 dark:text-stone-300 truncate">
                            {slice.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 tabular-nums">
                          <span className="font-bold text-stone-900 dark:text-white" dir="ltr">
                            {formatMoney(slice.value)}
                          </span>
                          <span className="w-12 text-end text-stone-500 dark:text-stone-400">
                            {result.monthlyIncome > 0
                              ? `${slice.percentOfIncome}%`
                              : `${slice.percentOfChart}%`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="py-10 px-4 text-center rounded-xl border border-dashed border-stone-200 dark:border-stone-700 space-y-1">
                  <PieChartIcon className="w-7 h-7 text-stone-400 mx-auto" />
                  <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                    {d.chartEmptyTitle}
                  </p>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {d.chartEmptyDesc}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 50/30/20 Comparison Card (Single-elevation sibling card) */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 space-y-3">
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                {d.benchmarkTitle}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                {d.benchmarkSubtitle}
              </p>
            </div>

            <div className="w-full h-3 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden flex">
              <div
                className="h-full bg-teal-700 transition-all duration-300"
                style={{ width: `${needsBarWidth}%` }}
                title={`${d.needsTarget}: ${result.benchmark503020.actualNeedsPercent}%`}
              />
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${savingsBarWidth}%` }}
                title={`${d.savingsTarget}: ${result.benchmark503020.actualSavingsPercent}%`}
              />
              <div
                className="h-full bg-slate-400 transition-all duration-300"
                style={{ width: `${freeBarWidth}%` }}
                title={`${d.wantsTarget}: ${result.benchmark503020.actualFreeCashPercent}%`}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px] tabular-nums">
              <div>
                <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
                  <span className="w-2 h-2 rounded-xs bg-teal-700 shrink-0" />
                  <span className="truncate">{d.needsTarget}</span>
                </div>
                <div className="font-bold text-stone-900 dark:text-white mt-0.5">
                  {result.benchmark503020.actualNeedsPercent}%
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
                  <span className="w-2 h-2 rounded-xs bg-emerald-500 shrink-0" />
                  <span className="truncate">{d.savingsTarget}</span>
                </div>
                <div className="font-bold text-stone-900 dark:text-white mt-0.5">
                  {result.benchmark503020.actualSavingsPercent}%
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
                  <span className="w-2 h-2 rounded-xs bg-slate-400 shrink-0" />
                  <span className="truncate">{d.wantsTarget}</span>
                </div>
                <div className="font-bold text-stone-900 dark:text-white mt-0.5">
                  {result.benchmark503020.actualFreeCashPercent}%
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Educational Guide & Worked Benchmark Scenarios */}
      <CalculatorGuide
        guideKey="household-budget"
        category="finance"
        onApplyPreset={(preset) => applyValues(preset)}
      />

      {/* Multilingual FAQ Section */}
      <FAQ title={d.faqTitle} items={faqItems} />
    </div>
  );
}
