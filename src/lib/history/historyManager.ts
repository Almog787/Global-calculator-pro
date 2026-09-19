export interface CalculationHistoryItem {
  id: string;
  timestamp: number;
  calculatorId: string;
  title: {
    en: string;
    he: string;
    es: string;
    fr: string;
    ar: string;
  };
  summary: {
    en: string;
    he: string;
    es: string;
    fr: string;
    ar: string;
  };
  result: {
    en: string;
    he: string;
    es: string;
    fr: string;
    ar: string;
  };
  path: string; // e.g. "/en/mortgage-calculator?principal=1000000&rate=5.5&years=30"
  badge?: string;
}

export const STORAGE_KEY = 'globalcalcpro_recent_history_v1';
export const MAX_HISTORY_ITEMS = 5;

export function getStoredHistory(): CalculationHistoryItem[] {
  if (typeof window === 'undefined' && typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Failed to load calculation history from localStorage', e);
    return [];
  }
}

export function saveStoredHistory(items: CalculationHistoryItem[]): void {
  if (typeof window === 'undefined' && typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_HISTORY_ITEMS)));
  } catch (e) {
    console.warn('Failed to save calculation history to localStorage', e);
  }
}

export function addHistoryEntry(
  item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>
): CalculationHistoryItem[] {
  const current = getStoredHistory();
  const now = Date.now();

  // If identical calculator was saved within the last 3 seconds, replace it to avoid typing spam
  const first = current[0];
  if (first && first.calculatorId === item.calculatorId && (now - first.timestamp < 4000)) {
    const updated: CalculationHistoryItem = {
      ...item,
      id: first.id,
      timestamp: now,
    };
    const nextList = [updated, ...current.slice(1)];
    saveStoredHistory(nextList);
    return nextList;
  }

  const newItem: CalculationHistoryItem = {
    ...item,
    id: `calc_${now}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: now,
  };

  const nextList = [newItem, ...current].slice(0, MAX_HISTORY_ITEMS);
  saveStoredHistory(nextList);
  return nextList;
}

export function removeHistoryEntry(id: string): CalculationHistoryItem[] {
  const current = getStoredHistory();
  const nextList = current.filter(item => item.id !== id);
  saveStoredHistory(nextList);
  return nextList;
}

export function clearStoredHistory(): CalculationHistoryItem[] {
  if (typeof window !== 'undefined' || typeof localStorage !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear history from localStorage', e);
    }
  }
  return [];
}
