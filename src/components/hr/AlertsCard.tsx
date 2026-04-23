'use client';

import { usePersona } from '@/lib/hr/context';

export default function AlertsCard() {
  const { persona } = usePersona();
  if (persona.alerts.length === 0) return null;

  return (
    <section
      style={{
        background: 'var(--color-surf)',
        border: '1px solid var(--color-border)',
        borderRadius: 14,
        padding: '22px 24px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#F58A1F', marginBottom: 6 }}>
            What you should know
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
            Proactive alerts for {persona.profile.firstName}
          </h2>
        </div>
        <span style={{ fontSize: 10, color: 'var(--color-subtle)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
          live
        </span>
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        {persona.alerts.map((a) => (
          <div
            key={a.id}
            style={{
              display: 'flex', gap: 14, alignItems: 'flex-start',
              padding: '14px 16px',
              background: severityBg(a.severity),
              border: `1px solid ${severityBorder(a.severity)}`,
              borderRadius: 10,
            }}
          >
            <div
              style={{
                flexShrink: 0, width: 28, height: 28, borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: severityIconBg(a.severity),
                color: severityIconColor(a.severity),
                fontWeight: 800, fontSize: 14,
              }}
              aria-hidden
            >
              {severityGlyph(a.severity)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)', marginBottom: 4, lineHeight: 1.3 }}>
                {a.title}
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.55 }}>
                {a.body}
              </div>
              {a.cta && (
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('hr-chat-prompt', { detail: { prompt: a.title } }))}
                  style={{
                    marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase',
                    color: severityCtaColor(a.severity),
                    background: 'transparent',
                    border: `1px solid ${severityCtaColor(a.severity)}40`,
                    borderRadius: 6, padding: '5px 10px',
                    fontFamily: 'inherit', cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = severityCtaColor(a.severity) + '18'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  {a.cta.label}
                  <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function severityBg(s: 'info' | 'warning' | 'success'): string {
  if (s === 'warning') return 'rgba(240,160,48,0.08)';
  if (s === 'success') return 'rgba(14,165,114,0.08)';
  return 'rgba(27,77,230,0.08)';
}
function severityBorder(s: 'info' | 'warning' | 'success'): string {
  if (s === 'warning') return 'rgba(240,160,48,0.28)';
  if (s === 'success') return 'rgba(14,165,114,0.28)';
  return 'rgba(27,77,230,0.28)';
}
function severityIconBg(s: 'info' | 'warning' | 'success'): string {
  if (s === 'warning') return 'rgba(240,160,48,0.18)';
  if (s === 'success') return 'rgba(14,165,114,0.18)';
  return 'rgba(27,77,230,0.18)';
}
function severityIconColor(s: 'info' | 'warning' | 'success'): string {
  if (s === 'warning') return '#F0A030';
  if (s === 'success') return '#0EA572';
  return '#3B62D6';
}
function severityCtaColor(s: 'info' | 'warning' | 'success'): string {
  if (s === 'warning') return '#F0A030';
  if (s === 'success') return '#0EA572';
  return '#F58A1F';
}
function severityGlyph(s: 'info' | 'warning' | 'success'): string {
  if (s === 'warning') return '!';
  if (s === 'success') return '✓';
  return 'i';
}
