'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { ALL_SUBCOS, CONSOLIDATED_VIEW, getSubco, type Subco } from '@/lib/subcos';

interface SubcoContextValue {
  subco: Subco;
  subcoId: string;
  setSubcoId: (id: string) => void;
  all: Subco[];
  /** True only when the Consolidated virtual view is active (id === 'consolidated'). */
  isConsolidated: boolean;
  /** Legacy alias: true when isConsolidated OR when the active entity is the holdco. */
  isTopco: boolean;
}

const SubcoContext = createContext<SubcoContextValue | null>(null);

const STORAGE_KEY = 'bl-active-subco';

// All valid selectable IDs (portfolio + the virtual consolidated view).
const VALID_IDS = new Set([...ALL_SUBCOS.map((s) => s.id), 'consolidated']);

export function SubcoProvider({ children }: { children: ReactNode }) {
  const [subcoId, setSubcoIdState] = useState<string>(CONSOLIDATED_VIEW.id);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (saved && VALID_IDS.has(saved)) setSubcoIdState(saved);
    setHydrated(true);
  }, []);

  const setSubcoId = (id: string) => {
    setSubcoIdState(id);
    if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, id);
  };

  const subco = getSubco(subcoId);
  const isConsolidated = (hydrated ? subcoId : CONSOLIDATED_VIEW.id) === 'consolidated';

  // Inject CSS custom properties for the active subco so non-React styles
  // (e.g. inline styles that read var(--subco-primary)) can theme themselves.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.style.setProperty('--subco-primary', subco.colors.primary);
    root.style.setProperty('--subco-primary-rgb', subco.colors.primaryRgb);
    root.style.setProperty('--subco-accent', subco.colors.accent);
    root.style.setProperty('--subco-accent-rgb', subco.colors.accentRgb);
  }, [subco.colors.primary, subco.colors.primaryRgb, subco.colors.accent, subco.colors.accentRgb]);

  // SSR/first-paint safety: render with consolidated defaults until hydration completes.
  const value: SubcoContextValue = {
    subco: hydrated ? subco : CONSOLIDATED_VIEW,
    subcoId: hydrated ? subcoId : CONSOLIDATED_VIEW.id,
    setSubcoId,
    all: ALL_SUBCOS,
    isConsolidated,
    isTopco: isConsolidated, // isTopco is now an alias for isConsolidated
  };

  return <SubcoContext.Provider value={value}>{children}</SubcoContext.Provider>;
}

export function useSubco(): SubcoContextValue {
  const ctx = useContext(SubcoContext);
  if (!ctx) throw new Error('useSubco must be used inside <SubcoProvider>');
  return ctx;
}
