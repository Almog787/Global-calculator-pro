/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState, useCallback, useTransition } from 'react';
import {
  CalculationHistoryItem,
  getStoredHistory,
  addHistoryEntry,
  removeHistoryEntry,
  clearStoredHistory,
} from '../lib/history/historyManager';

interface HistoryContextType {
  history: CalculationHistoryItem[];
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  recordCalculation: (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => void;
  deleteCalculation: (id: string) => void;
  clearAllCalculations: () => void;
  recentCount: number;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<CalculationHistoryItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    // Initial load from localStorage on client
    setHistory(getStoredHistory());
  }, []);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setIsDrawerOpen(prev => !prev), []);

  const recordCalculation = useCallback((item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => {
    startTransition(() => {
      const updated = addHistoryEntry(item);
      setHistory(updated);
    });
  }, []);

  const deleteCalculation = useCallback((id: string) => {
    const updated = removeHistoryEntry(id);
    setHistory(updated);
  }, []);

  const clearAllCalculations = useCallback(() => {
    const updated = clearStoredHistory();
    setHistory(updated);
  }, []);

  return (
    <HistoryContext.Provider
      value={{
        history,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        toggleDrawer,
        recordCalculation,
        deleteCalculation,
        clearAllCalculations,
        recentCount: history.length,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export function useHistory(): HistoryContextType {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}
