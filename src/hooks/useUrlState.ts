import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { useSearchParams } from 'react-router-dom';

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
    if (param !== null) {
      if (typeof defaultValue === 'number') {
        const num = Number(param);
        return (isNaN(num) ? defaultValue : num) as unknown as T;
      }
      if (typeof defaultValue === 'boolean') {
        return (param === 'true') as unknown as T;
      }
      return param as unknown as T;
    }
    return defaultValue;
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


