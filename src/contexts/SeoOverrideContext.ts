import { createContext } from 'react';

export const SeoOverrideContext = createContext<(() => void) | null>(null);
