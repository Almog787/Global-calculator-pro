import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
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

export function useUrlState(key: string, defaultValue: number): [number, Dispatch<SetStateAction<number>>];
export function useUrlState(key: string, defaultValue: boolean): [boolean, Dispatch<SetStateAction<boolean>>];
export function useUrlState(key: string, defaultValue: string): [string, Dispatch<SetStateAction<string>>];
export function useUrlState<T extends string | number | boolean | null | undefined>(key: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>];
export function useUrlState<T extends string | number | boolean | null | undefined>(
  key: string,
  defaultValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize from URL or default
  const [value, setValue] = useState<T>(() => {
    const param = searchParams.get(key);
    return sanitizeUrlValue(param, defaultValue);
  });

  // Sync to URL when value changes
  useEffect(() => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (value !== defaultValue && value !== '' && (value as unknown) !== 0 && value !== null && value !== undefined) {
        newParams.set(key, String(value));
      } else {
        newParams.delete(key);
      }
      return newParams;
    }, { replace: true });
  }, [value, key, defaultValue, setSearchParams]);

  return [value, setValue];
}



