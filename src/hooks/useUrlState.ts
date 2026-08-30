import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useUrlState<T extends string | number | boolean>(
  key: string,
  defaultValue: T
): [T, (val: T | ((prev: T) => T)) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize from URL or default
  const [value, setValue] = useState<T>(() => {
    const param = searchParams.get(key);
    if (param !== null) {
      if (typeof defaultValue === 'number') {
        return (Number(param) as unknown) as T;
      }
      if (typeof defaultValue === 'boolean') {
        return (param === 'true' as unknown) as T;
      }
      return (param as unknown) as T;
    }
    return defaultValue;
  });

  // Sync to URL when value changes
  useEffect(() => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (value !== defaultValue && value !== '' && value !== 0) {
        newParams.set(key, String(value));
      } else {
        newParams.delete(key);
      }
      return newParams;
    }, { replace: true });
  }, [value, key, defaultValue, setSearchParams]);

  return [value, setValue];
}
