'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { PERSONAS, PERSONA_ORDER } from './personas';
import type { Persona, PersonaId } from './personas';

interface PersonaContextValue {
  personaId: PersonaId;
  persona: Persona;
  setPersonaId: (id: PersonaId) => void;
}

const PersonaContext = createContext<PersonaContextValue | null>(null);

const STORAGE_KEY = 'hr-persona';
const DEFAULT_PERSONA: PersonaId = 'field_tech';

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [personaId, setPersonaIdState] = useState<PersonaId>(DEFAULT_PERSONA);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored && PERSONA_ORDER.includes(stored as PersonaId)) {
        setPersonaIdState(stored as PersonaId);
      }
    } catch { /* localStorage unavailable — stick with default */ }
  }, []);

  const setPersonaId = useCallback((id: PersonaId) => {
    setPersonaIdState(id);
    try { window.localStorage.setItem(STORAGE_KEY, id); } catch { /* ignore */ }
  }, []);

  const value: PersonaContextValue = {
    personaId,
    persona: PERSONAS[personaId],
    setPersonaId,
  };

  return <PersonaContext.Provider value={value}>{children}</PersonaContext.Provider>;
}

export function usePersona(): PersonaContextValue {
  const ctx = useContext(PersonaContext);
  if (!ctx) throw new Error('usePersona must be used inside <PersonaProvider>');
  return ctx;
}
