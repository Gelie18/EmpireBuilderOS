'use client';

import { useState, useRef, useEffect } from 'react';
import { usePersona } from '@/lib/hr/context';
import { PERSONA_ORDER, PERSONA_SUMMARIES } from '@/lib/hr/personas';

export default function PersonaSwitcher() {
  const { personaId, persona, setPersonaId } = usePersona();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'rgba(245,138,31,0.10)',
          border: '1px solid rgba(245,138,31,0.30)',
          borderRadius: 8, padding: '6px 12px',
          cursor: 'pointer', fontFamily: 'inherit',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(245,138,31,0.16)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(245,138,31,0.10)'; }}
      >
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#F58A1F' }} />
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(245,138,31,0.80)', lineHeight: 1 }}>
            Viewing as
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text)', marginTop: 2, lineHeight: 1 }}>
            {persona.profile.firstName} {persona.profile.lastName}
          </div>
        </div>
        <svg width="10" height="10" fill="none" stroke="#F58A1F" strokeWidth="2.5" viewBox="0 0 24 24" style={{ marginLeft: 4 }}>
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          style={{
            position: 'absolute', top: 'calc(100% + 6px)', right: 0,
            minWidth: 280,
            background: '#1E2236',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 10,
            boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
            padding: 6,
            zIndex: 100,
          }}
        >
          <div style={{ padding: '8px 10px 6px', fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
            Switch demo persona
          </div>
          {PERSONA_ORDER.map((id) => {
            const summary = PERSONA_SUMMARIES[id];
            const active = id === personaId;
            return (
              <button
                key={id}
                role="option"
                aria-selected={active}
                onClick={() => { setPersonaId(id); setOpen(false); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 10px', borderRadius: 7,
                  background: active ? 'rgba(27,77,230,0.18)' : 'transparent',
                  border: '1px solid ' + (active ? 'rgba(27,77,230,0.35)' : 'transparent'),
                  cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                  transition: 'background 0.12s, border-color 0.12s',
                }}
                onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: active ? '#1B4DE6' : 'rgba(255,255,255,0.15)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2 }}>
                    {summary.label}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>
                    {summary.hint}
                  </div>
                </div>
              </button>
            );
          })}
          <div style={{ padding: '8px 10px', fontSize: 10, color: 'rgba(255,255,255,0.30)', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 4 }}>
            All data is simulated. Switching persona updates every number on the page.
          </div>
        </div>
      )}
    </div>
  );
}
