'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { SEED_DECISIONS, type Decision } from '@/lib/ceo-intel';

type DecisionStatus = Decision['status'];

interface DecisionsContextValue {
  decisions: Decision[];
  pending: Decision[];
  approve: (id: string) => void;
  reject: (id: string) => void;
  delegate: (id: string) => void;
  addDecision: (d: Omit<Decision, 'status' | 'createdAt'> & Partial<Pick<Decision, 'status' | 'createdAt'>>) => void;
}

const DecisionsContext = createContext<DecisionsContextValue | null>(null);

const STORAGE_KEY = 'bl-decisions-v1';

export function DecisionsProvider({ children }: { children: ReactNode }) {
  const [decisions, setDecisions] = useState<Decision[]>(SEED_DECISIONS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Decision[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge saved statuses onto seed (so new seed items still appear).
          const savedById = new Map(parsed.map((d) => [d.id, d]));
          const merged = SEED_DECISIONS.map((seed) => savedById.get(seed.id) ?? seed);
          // Keep any user-added decisions that aren't in the seed.
          const extras = parsed.filter((d) => !SEED_DECISIONS.some((s) => s.id === d.id));
          setDecisions([...merged, ...extras]);
        }
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(decisions));
  }, [decisions, hydrated]);

  const setStatus = (id: string, status: DecisionStatus) => {
    setDecisions((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
  };

  const value = useMemo<DecisionsContextValue>(() => ({
    decisions,
    pending: decisions.filter((d) => d.status === 'pending'),
    approve: (id) => setStatus(id, 'approved'),
    reject: (id) => setStatus(id, 'rejected'),
    delegate: (id) => setStatus(id, 'delegated'),
    addDecision: (d) => {
      const newDec: Decision = {
        status: 'pending',
        createdAt: new Date().toISOString().slice(0, 10),
        ...d,
      } as Decision;
      setDecisions((prev) => {
        // Don't duplicate if id already exists.
        if (prev.some((x) => x.id === newDec.id)) return prev;
        return [newDec, ...prev];
      });
    },
  }), [decisions]);

  return <DecisionsContext.Provider value={value}>{children}</DecisionsContext.Provider>;
}

export function useDecisions(): DecisionsContextValue {
  const ctx = useContext(DecisionsContext);
  if (!ctx) throw new Error('useDecisions must be used inside <DecisionsProvider>');
  return ctx;
}
