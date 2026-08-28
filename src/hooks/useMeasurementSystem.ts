import { useState, useEffect } from 'react';

type System = 'metric' | 'imperial';

export function useMeasurementSystem() {
  const [system, setSystemState] = useState<System>('metric');

  useEffect(() => {
    const saved = localStorage.getItem('measurementSystem') as System;
    if (saved === 'metric' || saved === 'imperial') {
      setSystemState(saved);
    } else {
      // Auto-detect based on locale
      const lang = navigator.language;
      // US, Liberia, Myanmar use Imperial/US Customary by default
      if (lang === 'en-US' || lang === 'en-LR' || lang === 'my-MM') {
        setSystemState('imperial');
      } else {
        setSystemState('metric');
      }
    }
  }, []);

  const setSystem = (newSystem: System) => {
    setSystemState(newSystem);
    localStorage.setItem('measurementSystem', newSystem);
  };

  return { system, setSystem };
}
