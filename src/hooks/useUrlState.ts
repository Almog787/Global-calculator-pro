import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Sanitizes URL parameter values to prevent XSS, prototype pollution, script injection or invalid numerical formats
 */
export function sanitizeUrlValue<T extends string | number | boolean | null | undefined>(
  raw: string | null | undefined,
  defaultValue: T
): T {
  if (raw === null || raw === undefined) return defaultValue;

  if (typeof defaultValue === 'number') {
    if (typeof raw === 'string' && raw.trim() === '') return defaultValue;
    const num = Number(raw);
    // Disallow NaN, Infinity, -Infinity
    if (isNaN(num) || !Number.isFinite(num)) {
      return defaultValue;
    }
    return num as unknown as T;
  }

  if (typeof defaultValue === 'boolean') {
    if (raw === 'true' || raw === '1') return true as unknown as T;
    if (raw === 'false' || raw === '0') return false as unknown as T;
    return defaultValue;
  }

  if (typeof defaultValue === 'string') {
    // Strip control characters and limit excessive length to prevent memory exhaustion
    const sanitized = Array.from(raw)
      .filter(c => {
        const code = c.charCodeAt(0);
        return (code >= 32 && code !== 127) || code === 9 || code === 10 || code === 13;
      })
      .join('')
      .slice(0, 1000);
    return sanitized as unknown as T;
  }

  return (raw as unknown as T) ?? defaultValue;
}

export type UrlStateRecord = Record<string, string | number | boolean>;

export function useUrlState<T extends UrlStateRecord>(
  initialValues: T
): [T, (updater: Partial<T> | ((prev: T) => Partial<T>)) => void];
export function useUrlState(key: string, defaultValue: number): [number, Dispatch<SetStateAction<number>>];
export function useUrlState(key: string, defaultValue: boolean): [boolean, Dispatch<SetStateAction<boolean>>];
export function useUrlState(key: string, defaultValue: string): [string, Dispatch<SetStateAction<string>>];
export function useUrlState<T extends string | number | boolean | null | undefined>(key: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>];
export function useUrlState(
  arg1: string | UrlStateRecord,
  arg2?: any
): [any, any] {
  const [searchParams, setSearchParams] = useSearchParams();
  const isObjectMode = typeof arg1 === 'object' && arg1 !== null;
  const initialRef = useRef(arg1);

  // Initialize from URL or default
  const [value, setValue] = useState<any>(() => {
    if (isObjectMode) {
      const initialObj = arg1 as UrlStateRecord;
      const res: Record<string, any> = {};
      for (const k of Object.keys(initialObj)) {
        const param = searchParams.get(k);
        res[k] = sanitizeUrlValue(param, initialObj[k]);
      }
      return res;
    } else {
      const param = searchParams.get(arg1 as string);
      return sanitizeUrlValue(param, arg2);
    }
  });

  // Sync to URL when value changes
  useEffect(() => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (isObjectMode) {
        const initialObj = initialRef.current as UrlStateRecord;
        const currentObj = value as Record<string, any>;
        let changed = false;
        for (const k of Object.keys(currentObj)) {
          const val = currentObj[k];
          const def = initialObj[k];
          const existing = newParams.get(k);
          if (val !== def && val !== '' && (val as unknown) !== 0 && val !== null && val !== undefined) {
            const strVal = String(val);
            if (existing !== strVal) {
              newParams.set(k, strVal);
              changed = true;
            }
          } else if (existing !== null) {
            newParams.delete(k);
            changed = true;
          }
        }
        return changed ? newParams : prev;
      } else {
        const key = arg1 as string;
        const defaultValue = arg2;
        const existing = newParams.get(key);
        let changed = false;
        if (value !== defaultValue && value !== '' && (value as unknown) !== 0 && value !== null && value !== undefined) {
          const strVal = String(value);
          if (existing !== strVal) {
            newParams.set(key, strVal);
            changed = true;
          }
        } else if (existing !== null) {
          newParams.delete(key);
          changed = true;
        }
        return changed ? newParams : prev;
      }
    }, { replace: true });
  }, [value, isObjectMode, arg1, arg2, setSearchParams]);

  const setUrlValue = (updater: any) => {
    if (isObjectMode) {
      setValue((prev: any) => {
        const nextPartial = typeof updater === 'function' ? updater(prev) : updater;
        return { ...prev, ...nextPartial };
      });
    } else {
      setValue(updater);
    }
  };

  return [value, setUrlValue];
}



