import { describe, it, expect, vi } from 'vitest';
import * as XLSX from 'xlsx';
import { exportMortgageToExcel, exportCompoundToExcel, exportTableToExcel } from './excelExport';

vi.mock('xlsx', () => {
  const writeFileMock = vi.fn();
  const bookNewMock = vi.fn(() => ({ SheetNames: [], Sheets: {} }));
  const aoaToSheetMock = vi.fn(() => ({}));
  const bookAppendSheetMock = vi.fn();

  return {
    writeFile: writeFileMock,
    utils: {
      book_new: bookNewMock,
      aoa_to_sheet: aoaToSheetMock,
      book_append_sheet: bookAppendSheetMock,
    },
  };
});

describe('Excel Export Utility', () => {
  it('should generate and write mortgage excel file with summary and schedule sheets', () => {
    exportMortgageToExcel({
      principal: 1000000,
      rate: 4.5,
      years: 25,
      monthlyPayment: 5558,
      totalInterest: 667490,
      currencySymbol: '₪',
      lang: 'he',
      schedule: [
        { period: 1, payment: 5558, principal: 1808, interest: 3750, balance: 998192, cumulativeInterest: 3750 },
        { period: 2, payment: 5558, principal: 1815, interest: 3743, balance: 996377, cumulativeInterest: 7493 },
      ]
    });

    expect(XLSX.writeFile).toHaveBeenCalled();
    const calls = vi.mocked(XLSX.writeFile).mock.calls;
    const lastCall = calls[calls.length - 1];
    expect(lastCall[1]).toContain('דוח_משכנתא_1000000');
  });

  it('should generate and write compound interest excel file', () => {
    exportCompoundToExcel({
      principal: 50000,
      rate: 8,
      years: 15,
      contribution: 1500,
      futureValue: 663456,
      totalContributions: 320000,
      totalInterest: 343456,
      currencySymbol: '$',
      lang: 'en',
      schedule: [
        { year: 1, contributions: 68000, interest: 4500, total: 72500 },
        { year: 2, contributions: 86000, interest: 10200, total: 96200 }
      ]
    });

    expect(XLSX.writeFile).toHaveBeenCalled();
    const calls = vi.mocked(XLSX.writeFile).mock.calls;
    const lastCall = calls[calls.length - 1];
    expect(lastCall[1]).toContain('Compound_Interest_15Y');
  });

  it('should export generic tabular data to excel', () => {
    exportTableToExcel(
      ['Header 1', 'Header 2'],
      [['Row 1 Col 1', 100], ['Row 2 Col 1', 200]],
      'CustomReport.xlsx'
    );

    expect(XLSX.writeFile).toHaveBeenCalled();
  });
});
