'use client';

import { useEffect, useRef, useState } from 'react';
import { useSubco } from '@/contexts/SubcoContext';
import { CONSOLIDATED_VIEW } from '@/lib/subcos';

/**
 * Topco/subco selector — dropdown menu mounted in TopNav.
 * Shows "Consolidated" as a special virtual view at the top, then the
 * full portfolio of operating entities below a "Portfolio" section header.
 */
export default function SubcoSelector() {
  const { subco, subcoId, all, setSubcoId, isConsolidated } = useSubco();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  // Active display entity — for button, use CONSOLIDATED_VIEW when consolidated
  const displaySubco = isConsolidated ? CONSOLIDATED_VIEW : subco;

  return (
    <div ref={rootRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2"
        style={{
          background: `rgba(${displaySubco.colors.primaryRgb}, 0.12)`,
          border: `1px solid rgba(${displaySubco.colors.primaryRgb}, 0.38)`,
          borderRadius: 6,
          padding: '5px 9px 5px 6px',
          color: 'var(--color-on-shell)',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          transition: 'background 0.15s',
        }}
      >
        {/* Monogram chip */}
        <span
          style={{
            background: displaySubco.colors.primary,
            color: '#FFFFFF',
            borderRadius: 4,
            padding: '2px 6px',
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: '0.02em',
            minWidth: 28,
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          {displaySubco.monogram}
        </span>
        <span className="hidden sm:inline" style={{ color: 'var(--color-on-shell)' }}>
          {displaySubco.shortName}
        </span>
        {isConsolidated && (
          <span
            className="hidden md:inline"
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: displaySubco.colors.accent,
              background: `rgba(${displaySubco.colors.accentRgb}, 0.18)`,
              border: `1px solid rgba(${displaySubco.colors.accentRgb}, 0.40)`,
              borderRadius: 3,
              padding: '1px 5px',
              letterSpacing: '0.10em',
            }}
          >
            ALL PORTCOS
          </span>
        )}
        <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ opacity: 0.7 }}>
          <polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            minWidth: 300,
            maxWidth: 360,
            background: 'var(--color-menu)',
            border: '1px solid var(--color-border)',
            borderRadius: 10,
            boxShadow: 'var(--card-shadow-hover)',
            padding: 6,
            zIndex: 1000,
            animation: 'fadeUp 0.18s ease both',
          }}
        >
          {/* ── Consolidated virtual view ── */}
          <div
            style={{
              padding: '8px 10px 6px',
              fontSize: 9,
              fontWeight: 800,
              color: 'var(--color-muted)',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
            }}
          >
            View
          </div>
          {(() => {
            const s = CONSOLIDATED_VIEW;
            const active = isConsolidated;
            return (
              <button
                key={s.id}
                type="button"
                role="menuitem"
                onClick={() => { setSubcoId(s.id); setOpen(false); }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 10px',
                  borderRadius: 6,
                  background: active ? `rgba(${s.colors.primaryRgb}, 0.15)` : 'transparent',
                  border: active ? `1px solid rgba(${s.colors.primaryRgb}, 0.42)` : '1px solid transparent',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.12s, border 0.12s',
                  fontFamily: 'inherit',
                  marginBottom: 2,
                }}
                onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--color-surf2)'; }}
                onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <span
                  style={{
                    background: s.colors.primary,
                    color: '#FFFFFF',
                    borderRadius: 4,
                    padding: '3px 5px',
                    fontSize: 9,
                    fontWeight: 900,
                    minWidth: 34,
                    textAlign: 'center',
                    flexShrink: 0,
                  }}
                >
                  {s.monogram}
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.1 }}>{s.name}</span>
                    <span style={{
                      fontSize: 8,
                      fontWeight: 800,
                      color: s.colors.accent,
                      background: `rgba(${s.colors.accentRgb}, 0.20)`,
                      border: `1px solid rgba(${s.colors.accentRgb}, 0.40)`,
                      borderRadius: 3,
                      padding: '1px 4px',
                      letterSpacing: '0.10em',
                    }}>
                      ALL PORTCOS
                    </span>
                  </div>
                </div>
                {active && (
                  <svg width="13" height="13" fill="none" stroke={s.colors.accent} strokeWidth="3" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                    <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            );
          })()}

          {/* Divider */}
          <div style={{ height: 1, background: 'var(--color-border)', margin: '6px 4px' }} />

          {/* ── Portfolio entities ── */}
          <div
            style={{
              padding: '6px 10px 4px',
              fontSize: 9,
              fontWeight: 800,
              color: 'var(--color-muted)',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
            }}
          >
            Portfolio
          </div>
          {all.map((s) => {
            const active = !isConsolidated && s.id === subcoId;
            return (
              <button
                key={s.id}
                type="button"
                role="menuitem"
                onClick={() => { setSubcoId(s.id); setOpen(false); }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 10px',
                  borderRadius: 6,
                  background: active ? `rgba(${s.colors.primaryRgb}, 0.15)` : 'transparent',
                  border: active ? `1px solid rgba(${s.colors.primaryRgb}, 0.42)` : '1px solid transparent',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.12s, border 0.12s',
                  fontFamily: 'inherit',
                  marginBottom: 2,
                }}
                onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--color-surf2)'; }}
                onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <span
                  style={{
                    background: s.colors.primary,
                    color: '#FFFFFF',
                    borderRadius: 4,
                    padding: '3px 6px',
                    fontSize: 10,
                    fontWeight: 900,
                    minWidth: 34,
                    textAlign: 'center',
                    flexShrink: 0,
                  }}
                >
                  {s.monogram}
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.1 }}>{s.name}</span>
                    {s.id === 'bases-loaded' && (
                      <span style={{
                        fontSize: 8,
                        fontWeight: 800,
                        color: s.colors.accent,
                        background: `rgba(${s.colors.accentRgb}, 0.20)`,
                        border: `1px solid rgba(${s.colors.accentRgb}, 0.40)`,
                        borderRadius: 3,
                        padding: '1px 4px',
                        letterSpacing: '0.10em',
                      }}>
                        HOLDCO
                      </span>
                    )}
                  </div>
                </div>
                {active && (
                  <svg width="13" height="13" fill="none" stroke={s.colors.accent} strokeWidth="3" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                    <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
