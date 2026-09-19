import { useEffect, useRef } from 'react';
import { useHistory } from '../contexts/HistoryContext';
import { CalculationHistoryItem } from '../lib/history/historyManager';

export function useRecordCalculation(
  entry: Omit<CalculationHistoryItem, 'id' | 'timestamp'> | null,
  delayMs = 1600
) {
  const { recordCalculation } = useHistory();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prevPathRef = useRef<string>('');

  useEffect(() => {
    if (!entry) return;
    if (entry.path === prevPathRef.current) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      recordCalculation(entry);
      prevPathRef.current = entry.path;
    }, delayMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [entry, delayMs, recordCalculation]);
}
