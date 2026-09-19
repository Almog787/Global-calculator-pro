import { describe, it, expect, beforeEach } from 'vitest';
import {
  getStoredHistory,
  addHistoryEntry,
  removeHistoryEntry,
  clearStoredHistory,
  MAX_HISTORY_ITEMS
} from './historyManager';

// Mock localStorage for Node test environment
const storageMock: Record<string, string> = {};
global.localStorage = {
  getItem: (key: string) => storageMock[key] ?? null,
  setItem: (key: string, val: string) => { storageMock[key] = String(val); },
  removeItem: (key: string) => { delete storageMock[key]; },
  clear: () => { Object.keys(storageMock).forEach(k => delete storageMock[k]); },
  length: 0,
  key: () => null,
};

describe('historyManager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with an empty history list', () => {
    expect(getStoredHistory()).toEqual([]);
  });

  it('adds an entry to the top of history', () => {
    const list = addHistoryEntry({
      calculatorId: 'mortgage',
      title: { en: 'Mortgage', he: 'משכנתא', es: 'Hipoteca', fr: 'Prêt', ar: 'رهن' },
      summary: { en: '1M @ 5% for 30y', he: '1 מיליון בריבית 5%', es: '1M al 5%', fr: '1M à 5%', ar: 'مليون' },
      result: { en: '$5,368/mo', he: '5,368 ₪/חודש', es: '5.368/mes', fr: '5 368 €/mois', ar: '5368' },
      path: '/he/mortgage-calculator?principal=1000000',
      badge: '30Y'
    });

    expect(list.length).toBe(1);
    expect(list[0].id).toBeDefined();
    expect(list[0].timestamp).toBeGreaterThan(0);

    const history = getStoredHistory();
    expect(history.length).toBe(1);
    expect(history[0].calculatorId).toBe('mortgage');
  });

  it(`caps saved history items to ${MAX_HISTORY_ITEMS} entries`, () => {
    for (let i = 1; i <= 8; i++) {
      addHistoryEntry({
        calculatorId: `calc-${i}`,
        title: { en: `Calc ${i}`, he: `חישוב ${i}`, es: `Calc ${i}`, fr: `Calc ${i}`, ar: `حساب ${i}` },
        summary: { en: `Sum ${i}`, he: `סיכום ${i}`, es: `Sum ${i}`, fr: `Sum ${i}`, ar: `ملخص ${i}` },
        result: { en: `Res ${i}`, he: `תוצאה ${i}`, es: `Res ${i}`, fr: `Res ${i}`, ar: `نتيجة ${i}` },
        path: `/he/calc?val=${i}`
      });
    }

    const history = getStoredHistory();
    expect(history.length).toBe(MAX_HISTORY_ITEMS);
    expect(history[0].calculatorId).toBe('calc-8');
  });

  it('removes a specific calculation by id', () => {
    const list1 = addHistoryEntry({
      calculatorId: 'mortgage',
      title: { en: 'A', he: 'א', es: 'A', fr: 'A', ar: 'أ' },
      summary: { en: 'A', he: 'א', es: 'A', fr: 'A', ar: 'أ' },
      result: { en: 'A', he: 'א', es: 'A', fr: 'A', ar: 'أ' },
      path: '/a'
    });
    const list2 = addHistoryEntry({
      calculatorId: 'compound',
      title: { en: 'B', he: 'ב', es: 'B', fr: 'B', ar: 'ב' },
      summary: { en: 'B', he: 'ב', es: 'B', fr: 'B', ar: 'ב' },
      result: { en: 'B', he: 'ב', es: 'B', fr: 'B', ar: 'ב' },
      path: '/b'
    });

    expect(getStoredHistory().length).toBe(2);

    const updated = removeHistoryEntry(list1[0].id);
    expect(updated.length).toBe(1);
    expect(updated[0].id).toBe(list2[0].id);
  });

  it('clears all calculation history', () => {
    addHistoryEntry({
      calculatorId: 'mortgage',
      title: { en: 'A', he: 'א', es: 'A', fr: 'A', ar: 'أ' },
      summary: { en: 'A', he: 'א', es: 'A', fr: 'A', ar: 'أ' },
      result: { en: 'A', he: 'א', es: 'A', fr: 'A', ar: 'أ' },
      path: '/a'
    });

    const emptied = clearStoredHistory();
    expect(emptied).toEqual([]);
    expect(getStoredHistory()).toEqual([]);
  });
});
