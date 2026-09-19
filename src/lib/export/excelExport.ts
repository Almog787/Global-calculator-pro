import * as XLSX from 'xlsx';

export interface ExportMortgageOptions {
  principal: number;
  rate: number;
  years: number;
  monthlyPayment: number;
  totalInterest: number;
  currencySymbol?: string;
  currencyCode?: string;
  lang?: string;
  schedule?: Array<{
    period: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
    cumulativeInterest: number;
  }>;
}

export interface ExportCompoundOptions {
  principal: number;
  rate: number;
  years: number;
  contribution: number;
  futureValue: number;
  totalContributions: number;
  totalInterest: number;
  currencySymbol?: string;
  currencyCode?: string;
  lang?: string;
  schedule?: Array<{
    year: number;
    contributions: number;
    interest: number;
    total: number;
  }>;
}

/**
 * Exports Mortgage Amortization Schedule and Executive Summary to Excel (.xlsx)
 */
export function exportMortgageToExcel(options: ExportMortgageOptions): void {
  const {
    principal,
    rate,
    years,
    monthlyPayment,
    totalInterest,
    currencySymbol = '₪',
    lang = 'he',
    schedule = []
  } = options;

  const labelsByLang: Record<string, {
    title: string;
    summarySheet: string;
    scheduleSheet: string;
    date: string;
    params: string;
    val: string;
    principal: string;
    rate: string;
    term: string;
    termVal: string;
    results: string;
    monthly: string;
    interest: string;
    totalCost: string;
    scheduleHeaders: string[];
    filePrefix: string;
  }> = {
    he: {
      title: 'דוח משכנתא מפורט - GlobalCalc Pro',
      summarySheet: 'סיכום מנהלים',
      scheduleSheet: 'לוח סילוקין',
      date: 'תאריך הפקה',
      params: 'פרמטרי הלוואה',
      val: 'ערך',
      principal: 'סכום ההלוואה (קרן)',
      rate: 'ריבית שנתית',
      term: 'תקופת הלוואה',
      termVal: `${years} שנים (${years * 12} חודשים)`,
      results: 'תוצאות חישוב ולוח תשלומים',
      monthly: 'החזר חודשי קבוע',
      interest: 'סה״כ ריבית לתשלום',
      totalCost: 'סה״כ עלות כוללת (קרן + ריבית)',
      scheduleHeaders: ['חודש', 'החזר חודשי', 'תשלום ע״ח קרן', 'תשלום ע״ח ריבית', 'יתרת קרן לסילוק', 'ריבית מצטברת'],
      filePrefix: `דוח_משכנתא_${principal}`,
    },
    es: {
      title: 'Informe Hipotecario Detallado - GlobalCalc Pro',
      summarySheet: 'Resumen Ejecutivo',
      scheduleSheet: 'Tabla de Amortización',
      date: 'Fecha de Emisión',
      params: 'Parámetros del Préstamo',
      val: 'Valor',
      principal: 'Monto del Préstamo (Principal)',
      rate: 'Tasa de Interés Anual',
      term: 'Plazo del Préstamo',
      termVal: `${years} Años (${years * 12} Meses)`,
      results: 'Resultados y Pagos',
      monthly: 'Pago Mensual Estimado',
      interest: 'Interés Total a Pagar',
      totalCost: 'Costo Total (Principal + Interés)',
      scheduleHeaders: ['Mes', 'Pago Mensual', 'Amortización', 'Intereses', 'Saldo Pendiente', 'Interés Acumulado'],
      filePrefix: `Hipoteca_${principal}`,
    },
    fr: {
      title: 'Rapport Détaillé de Prêt Immobilier - GlobalCalc Pro',
      summarySheet: 'Résumé Exécutif',
      scheduleSheet: 'Tableau d\'Amortissement',
      date: 'Date d\'Émission',
      params: 'Paramètres du Prêt',
      val: 'Valeur',
      principal: 'Montant Emprunté (Capital)',
      rate: 'Taux d\'Intérêt Annuel',
      term: 'Durée du Prêt',
      termVal: `${years} Ans (${years * 12} Mois)`,
      results: 'Résultats et Mensualités',
      monthly: 'Mensualité Estimée',
      interest: 'Total des Intérêts',
      totalCost: 'Coût Total du Crédit',
      scheduleHeaders: ['Mois', 'Mensualité', 'Capital Remboursé', 'Intérêts', 'Capital Restant Dû', 'Intérêts Cumulés'],
      filePrefix: `Pret_Immobilier_${principal}`,
    },
    ar: {
      title: 'تقرير الرهن العقاري المفصل - GlobalCalc Pro',
      summarySheet: 'ملخص تنفيذي',
      scheduleSheet: 'جدول السداد',
      date: 'تاريخ الإنشاء',
      params: 'معلمات القرض',
      val: 'القيمة',
      principal: 'مبلغ القرض (أصل الدين)',
      rate: 'سعر الفائدة السنوي',
      term: 'مدة القرض',
      termVal: `${years} سنوات (${years * 12} شهراً)`,
      results: 'نتائج الحساب وجدول الأقساط',
      monthly: 'الدفعة الشهرية الثابتة',
      interest: 'إجمالي الفائدة المدفوعة',
      totalCost: 'التكلفة الإجمالية (الأصل + الفائدة)',
      scheduleHeaders: ['الشهر', 'الدفعة الشهرية', 'سداد الأصل', 'سداد الفائدة', 'الرصيد المتبقي', 'الفائدة التراكمية'],
      filePrefix: `تقرير_الرهن_العقاري_${principal}`,
    },
    en: {
      title: 'Detailed Mortgage Amortization Report - GlobalCalc Pro',
      summarySheet: 'Executive Summary',
      scheduleSheet: 'Amortization Schedule',
      date: 'Generated Date',
      params: 'Loan Parameters',
      val: 'Value',
      principal: 'Loan Principal Amount',
      rate: 'Annual Interest Rate',
      term: 'Loan Term',
      termVal: `${years} Years (${years * 12} Months)`,
      results: 'Payment Summary',
      monthly: 'Estimated Monthly Payment',
      interest: 'Total Interest Payable',
      totalCost: 'Total Cost of Loan',
      scheduleHeaders: ['Month', 'Monthly Payment', 'Principal Paid', 'Interest Paid', 'Remaining Balance', 'Cumulative Interest'],
      filePrefix: `Mortgage_Report_${principal}`,
    },
  };

  const l = labelsByLang[lang] || labelsByLang.en;

  // 1. Summary Sheet Data
  const summaryRows = [
    [l.title, ''],
    [l.date, new Date().toLocaleDateString(lang === 'he' ? 'he-IL' : 'en-US')],
    ['', ''],
    [l.params, l.val],
    [l.principal, `${principal.toLocaleString()} ${currencySymbol}`],
    [l.rate, `${rate}%`],
    [l.term, l.termVal],
    ['', ''],
    [l.results, l.val],
    [l.monthly, `${Math.round(monthlyPayment).toLocaleString()} ${currencySymbol}`],
    [l.interest, `${Math.round(totalInterest).toLocaleString()} ${currencySymbol}`],
    [l.totalCost, `${Math.round(principal + totalInterest).toLocaleString()} ${currencySymbol}`]
  ];

  const scheduleRows = schedule.map(row => [
    row.period,
    Math.round(row.payment),
    Math.round(row.principal),
    Math.round(row.interest),
    Math.round(row.balance),
    Math.round(row.cumulativeInterest)
  ]);

  // Create workbook
  const wb = XLSX.utils.book_new();

  // Create Summary worksheet
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
  wsSummary['!cols'] = [{ wch: 32 }, { wch: 25 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, l.summarySheet);

  // Create Schedule worksheet
  if (scheduleRows.length > 0) {
    const wsSchedule = XLSX.utils.aoa_to_sheet([l.scheduleHeaders, ...scheduleRows]);
    wsSchedule['!cols'] = [{ wch: 10 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 20 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, wsSchedule, l.scheduleSheet);
  }

  // Trigger download
  const filename = `${l.filePrefix}_GlobalCalcPro.xlsx`;
  XLSX.writeFile(wb, filename);
}

/**
 * Exports Compound Interest Schedule and Growth Summary to Excel (.xlsx)
 */
export function exportCompoundToExcel(options: ExportCompoundOptions): void {
  const {
    principal,
    rate,
    years,
    contribution,
    futureValue,
    totalContributions,
    totalInterest,
    currencySymbol = '₪',
    lang = 'he',
    schedule = []
  } = options;

  const isHe = lang === 'he';

  // 1. Summary Sheet Data
  const summaryRows = isHe ? [
    ['דוח תחזית ריבית דריבית - GlobalCalc Pro', ''],
    ['תאריך הפקה', new Date().toLocaleDateString('he-IL')],
    ['', ''],
    ['פרמטרי השקעה', 'ערך'],
    ['הפקדה ראשונית (הון עצמי)', `${principal.toLocaleString()} ${currencySymbol}`],
    ['הפקדה חודשית קבועה', `${contribution.toLocaleString()} ${currencySymbol}`],
    ['תשואה שנתית משוערת', `${rate}%`],
    ['תקופת השקעה', `${years} שנים`],
    ['', ''],
    ['תחזית ושווי עתידי', 'ערך'],
    ['שווי תיק עתידי כולל', `${Math.round(futureValue).toLocaleString()} ${currencySymbol}`],
    ['סה״כ הפקדות עצמיות', `${Math.round(totalContributions).toLocaleString()} ${currencySymbol}`],
    ['סה״כ רווח מריבית דריבית', `${Math.round(totalInterest).toLocaleString()} ${currencySymbol}`],
    ['רווח באחוזים מההון שהופקד', `${totalContributions > 0 ? Math.round((totalInterest / totalContributions) * 100) : 0}%`]
  ] : [
    ['Compound Interest Growth Report - GlobalCalc Pro', ''],
    ['Generated Date', new Date().toLocaleDateString('en-US')],
    ['', ''],
    ['Investment Parameters', 'Value'],
    ['Initial Deposit', `${principal.toLocaleString()} ${currencySymbol}`],
    ['Monthly Contribution', `${contribution.toLocaleString()} ${currencySymbol}`],
    ['Estimated Annual Return', `${rate}%`],
    ['Investment Period', `${years} Years`],
    ['', ''],
    ['Growth Forecast', 'Value'],
    ['Total Future Value', `${Math.round(futureValue).toLocaleString()} ${currencySymbol}`],
    ['Total Contributions', `${Math.round(totalContributions).toLocaleString()} ${currencySymbol}`],
    ['Total Compound Interest Earned', `${Math.round(totalInterest).toLocaleString()} ${currencySymbol}`],
    ['Return on Investment %', `${totalContributions > 0 ? Math.round((totalInterest / totalContributions) * 100) : 0}%`]
  ];

  // 2. Schedule Sheet Data
  const scheduleHeaders = isHe
    ? ['שנה', 'סך הפקדות מצטבר', 'ריבית דריבית שנצברה', 'שווי תיק בסוף שנה']
    : ['Year', 'Total Contributions', 'Compound Interest Earned', 'Year-End Portfolio Value'];

  const scheduleRows = schedule.map(row => [
    row.year,
    Math.round(row.contributions),
    Math.round(row.interest),
    Math.round(row.total)
  ]);

  // Create workbook
  const wb = XLSX.utils.book_new();

  // Create Summary worksheet
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
  wsSummary['!cols'] = [{ wch: 32 }, { wch: 25 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, isHe ? 'תחזית השקעה' : 'Investment Summary');

  // Create Schedule worksheet
  if (scheduleRows.length > 0) {
    const wsSchedule = XLSX.utils.aoa_to_sheet([scheduleHeaders, ...scheduleRows]);
    wsSchedule['!cols'] = [{ wch: 10 }, { wch: 22 }, { wch: 25 }, { wch: 25 }];
    XLSX.utils.book_append_sheet(wb, wsSchedule, isHe ? 'טבלת צמיחה שנתית' : 'Yearly Growth Table');
  }

  // Trigger download
  const filename = isHe
    ? `דוח_ריבית_דריבית_${years}שנים_GlobalCalcPro.xlsx`
    : `Compound_Interest_${years}Y_GlobalCalcPro.xlsx`;

  XLSX.writeFile(wb, filename);
}

/**
 * Generic Table Export to Excel
 */
export function exportTableToExcel(
  headers: string[],
  rows: (string | number)[][],
  filename: string,
  sheetName: string = 'Sheet1'
): void {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
}
