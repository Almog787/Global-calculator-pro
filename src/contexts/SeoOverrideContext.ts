import { createContext } from 'react';

export const SeoOverrideContext = createContext<(() => void) | null>(null);
export const FaqOverrideContext = createContext<(() => void) | null>(null);

