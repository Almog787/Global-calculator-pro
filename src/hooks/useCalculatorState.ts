import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * A hook to sync calculator state with URL search params and save it to localStorage history.
 * @param calculatorId Unique ID for the calculator (used for history storage)
 * @param defaultState The initial state if no URL params exist
 */
export function useCalculatorState<T extends Record<string, any>>(
  calculatorId: string,
  defaultState: T
) {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize state from URL params if they exist, otherwise fallback to default
  const [state, setState] = useState<T>(() => {
    const initialState = { ...defaultState };
    
    for (const key of Object.keys(defaultState)) {
      const val = searchParams.get(key);
      if (val !== null) {
        // Parse numbers/booleans appropriately based on default state type
        if (typeof defaultState[key] === 'number') {
          (initialState as any)[key] = Number(val);
        } else if (typeof defaultState[key] === 'boolean') {
          (initialState as any)[key] = val === 'true';
        } else {
          (initialState as any)[key] = val;
        }
      }
    }
    return initialState;
  });

  // Sync state changes back to URL
  const updateState = (newState: Partial<T>) => {
    setState(prev => {
      const updated = { ...prev, ...newState };
      
      const newParams = new URLSearchParams(searchParams);
      for (const [key, value] of Object.entries(updated)) {
        if (value !== undefined && value !== null && value !== '') {
           newParams.set(key, String(value));
        } else {
           newParams.delete(key);
        }
      }
      setSearchParams(newParams, { replace: true });
      return updated;
    });
  };

  // Save to history (e.g. debounced or on explicit save action)
  const saveToHistory = () => {
    const key = `calc_history_${calculatorId}`;
    try {
      const existing = localStorage.getItem(key);
      const history = existing ? JSON.parse(existing) : [];
      // Keep last 5 calculations
      const newEntry = { timestamp: Date.now(), state };
      const newHistory = [newEntry, ...history].slice(0, 5);
      localStorage.setItem(key, JSON.stringify(newHistory));
    } catch (e) {
      console.error('Could not save history to localStorage', e);
    }
  };

  const loadFromHistory = (index: number) => {
    const key = `calc_history_${calculatorId}`;
    try {
      const existing = localStorage.getItem(key);
      if (existing) {
        const history = JSON.parse(existing);
        if (history[index]) {
          updateState(history[index].state);
        }
      }
    } catch (e) {
      console.error('Could not load history from localStorage', e);
    }
  };

  const getHistory = () => {
    const key = `calc_history_${calculatorId}`;
    try {
      const existing = localStorage.getItem(key);
      return existing ? JSON.parse(existing) : [];
    } catch {
      return [];
    }
  };

  return { state, updateState, saveToHistory, loadFromHistory, getHistory };
}
