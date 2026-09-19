import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as XLSX from 'xlsx';
import { exportMortgageToExcel, exportCompoundToExcel, exportTableToExcel } from './excelExport';

vi.mock('xlsx', () => {
  const writeFileMock = vi.fn();
  const bookNewMock = vi.fn(() => ({ SheetNames: [], Sheets: {} }));
  const aoaToSheetMock = vi.fn((data: any[][]) => ({ '!data': data }));
  const bookAppendSheetMock = vi.fn((wb: any, ws: any, name: string) => {
    wb.SheetNames.push(name);
    wb.Sheets[name] = ws;
  });

  return {
    writeFile: writeFileMock,
    utils: {
      book_new: bookNewMock,
      aoa_to_sheet: aoaToSheetMock,
      book_append_sheet: bookAppendSheetMock,
    },
  };
});

describe('Export System Comprehensive Test Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should format mortgage export in Spanish correctly', () => {
    exportMortgageToExcel({
      principal: 250000,
      rate: 3.5,
      years: 20,
      monthlyPayment: 1450,
      totalInterest: 98000,
      currencySymbol: '€',
      lang: 'es',
      schedule: [
        { period: 1, payment: 1450, principal: 721, interest: 729, balance: 249279, cumulativeInterest: 729 }
      ]
    });

    expect(XLSX.writeFile).toHaveBeenCalled();
    const calls = vi.mocked(XLSX.writeFile).mock.calls;
    expect(calls[0][1]).toContain('Hipoteca_250000');
  });

  it('should format mortgage export in French correctly', () => {
    exportMortgageToExcel({
      principal: 300000,
      rate: 2.8,
      years: 25,
      monthlyPayment: 1391,
      totalInterest: 117300,
      currencySymbol: '€',
      lang: 'fr',
      schedule: [
        { period: 1, payment: 1391, principal: 691, interest: 700, balance: 299309, cumulativeInterest: 700 }
      ]
    });

    expect(XLSX.writeFile).toHaveBeenCalled();
    const calls = vi.mocked(XLSX.writeFile).mock.calls;
    expect(calls[0][1]).toContain('Pret_Immobilier_300000');
  });

  it('should format mortgage export in Arabic correctly', () => {
    exportMortgageToExcel({
      principal: 500000,
      rate: 5.0,
      years: 30,
      monthlyPayment: 2684,
      totalInterest: 466240,
      currencySymbol: '₪',
      lang: 'ar',
      schedule: [
        { period: 1, payment: 2684, principal: 601, interest: 2083, balance: 499399, cumulativeInterest: 2083 }
      ]
    });

    expect(XLSX.writeFile).toHaveBeenCalled();
    const calls = vi.mocked(XLSX.writeFile).mock.calls;
    expect(calls[0][1]).toContain('تقرير_الرهن_العقاري_500000');
  });

  it('should format compound interest export in Hebrew with correct filename and sheets', () => {
    exportCompoundToExcel({
      principal: 20000,
      rate: 6.5,
      years: 10,
      contribution: 1000,
      futureValue: 195000,
      totalContributions: 140000,
      totalInterest: 55000,
      currencySymbol: '₪',
      lang: 'he',
      schedule: [
        { year: 1, contributions: 32000, interest: 1600, total: 33600 },
        { year: 2, contributions: 44000, interest: 4200, total: 48200 }
      ]
    });

    expect(XLSX.writeFile).toHaveBeenCalled();
    const calls = vi.mocked(XLSX.writeFile).mock.calls;
    expect(calls[0][1]).toContain('דוח_ריבית_דריבית_10שנים');
  });

  it('should safely handle table export with empty rows', () => {
    exportTableToExcel(['Col A', 'Col B'], [], 'EmptyReport.xlsx');
    expect(XLSX.writeFile).toHaveBeenCalled();
  });
});
