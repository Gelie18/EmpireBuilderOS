'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { href: '/dashboard',     label: 'Dashboard',
        icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg> },
      { href: '/revenue',       label: 'Revenue Intel',
        icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" strokeLinecap="round" strokeLinejoin="round"/><polyline points="16 7 22 7 22 13" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    ],
  },
  {
    label: 'Financials',
    items: [
      { href: '/pnl',           label: 'P&L',
        icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><line x1="4" y1="19" x2="4" y2="5"/><rect x="7" y="12" width="3" height="7" rx="1" fill="currentColor" stroke="none" opacity="0.5"/><rect x="12" y="7" width="3" height="12" rx="1" fill="currentColor" stroke="none"/><rect x="17" y="10" width="3" height="9" rx="1" fill="currentColor" stroke="none" opacity="0.65"/></svg> },
      { href: '/balance-sheet', label: 'Balance Sheet',
        icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 3v18M5 7l7-4 7 4M5 17l7 4 7-4"/><path d="M5 12h14" strokeDasharray="2 2"/></svg> },
      { href: '/cashflow',      label: 'Cash Flow',
        icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3" strokeLinecap="round"/></svg> },
      { href: '/yoy',           label: 'YoY Compare',
        icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M3 17l4-8 4 5 3-3 4 6" strokeLinejoin="round" strokeLinecap="round"/><path d="M3 11l4-4 4 3 3-3 4 4" strokeLinejoin="round" strokeLinecap="round" opacity="0.35"/></svg> },
      { href: '/mom',           label: 'MoM Trend',
        icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M3 17l4-8 4 5 3-3 4 6" strokeLinejoin="round" strokeLinecap="round"/></svg> },
    ],
  },
  {
    label: 'Operations',
    items: [
      { href: '/daily-revenue', label: 'Daily Revenue',
        icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4" strokeLinecap="round"/></svg> },
      { href: '/backlog',       label: 'Ops Backlog',
        icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" strokeLinecap="round"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4" strokeLinecap="round"/></svg> },
      { href: '/fin-backlog',   label: 'Fin. Backlog',
        icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" strokeLinecap="round"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4" strokeLinecap="round"/></svg> },
    ],
  },
  {
    label: 'Planning',
    items: [
      { href: '/ai-forecast',   label: 'AI Forecast',
        icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M2 20h20M5 20V10l7-7 7 7v10" strokeLinejoin="round"/><path d="M9 20v-5h6v5"/></svg> },
      { href: '/forecast',      label: 'Driver Model',
        icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="9" y2="6" strokeLinecap="round"/><line x1="15" y1="6" x2="20" y2="6" strokeLinecap="round"/><circle cx="12" cy="6" r="3"/><line x1="4" y1="12" x2="7" y2="12" strokeLinecap="round"/><line x1="13" y1="12" x2="20" y2="12" strokeLinecap="round"/><circle cx="10" cy="12" r="3"/><line x1="4" y1="18" x2="16" y2="18" strokeLinecap="round"/><circle cx="18" cy="18" r="3"/></svg> },
      { href: '/scenarios',     label: 'Scenarios',
        icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 3v8" strokeLinecap="round"/><path d="M6 11l4 4M6 11l-4 4" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 15v6M2 15v6" strokeLinecap="round"/></svg> },
      { href: '/market',        label: 'Market Intel',
        icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><ellipse cx="12" cy="12" rx="4" ry="10"/><line x1="2" y1="12" x2="22" y2="12"/></svg> },
    ],
  },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <nav
      className="hidden md:flex flex-col flex-shrink-0 overflow-y-auto"
      style={{
        width: 220,
        background: '#0F1120',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Wordmark */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontFamily: '"DM Sans", system-ui', fontWeight: 900, fontSize: 16, color: '#1D44BF', letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1 }}>
          Empire
        </div>
        <div style={{ fontFamily: '"DM Sans", system-ui', fontWeight: 900, fontSize: 10, color: '#E8B84B', letterSpacing: '0.28em', textTransform: 'uppercase', lineHeight: 1, marginTop: 3 }}>
          Builder
        </div>
        <div style={{ width: 28, height: 2, background: 'linear-gradient(90deg,#1D44BF,#E8B84B)', borderRadius: 2, marginTop: 8 }} />
        <div style={{ marginTop: 10, fontSize: 9.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.10em', color: 'rgba(255,255,255,0.28)', lineHeight: 1.3 }}>
          Finance OS · Meritage Partners
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
          <span style={{ background: 'rgba(232,184,75,0.12)', border: '1px solid rgba(232,184,75,0.28)', color: '#E8B84B', fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 3 }}>Apr 2026</span>
          <span style={{ background: 'rgba(14,165,114,0.12)', border: '1px solid rgba(14,165,114,0.25)', color: '#0EA572', fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 3 }}>Demo</span>
        </div>
      </div>

      {/* Nav groups */}
      <div className="flex-1 py-3" style={{ overflowY: 'auto' }}>
        {NAV_GROUPS.map((group) => (
          <div key={group.label} style={{ marginBottom: 4 }}>
            {/* Group label */}
            <div style={{ padding: '8px 16px 4px', fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.25)' }}>
              {group.label}
            </div>

            {/* Nav items */}
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="no-underline block"
                  style={{ padding: '2px 8px' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 9,
                      padding: '7px 10px',
                      borderRadius: 7,
                      background: active ? 'rgba(29,68,191,0.18)' : 'transparent',
                      color: active ? '#FFFFFF' : 'rgba(255,255,255,0.45)',
                      border: active ? '1px solid rgba(29,68,191,0.30)' : '1px solid transparent',
                      transition: 'background 0.12s, color 0.12s',
                      position: 'relative',
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                        (e.currentTarget as HTMLElement).style.color = '#FFFFFF';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                        (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)';
                      }
                    }}
                  >
                    {/* Active left bar */}
                    {active && (
                      <div style={{ position: 'absolute', left: 0, top: '20%', height: '60%', width: 2.5, borderRadius: 2, background: '#1D44BF' }} />
                    )}
                    <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0, color: active ? '#1D44BF' : 'inherit', opacity: active ? 1 : 0.6 }}>
                      {item.icon}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, lineHeight: 1 }}>
                      {item.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* AI CFO button */}
      <div style={{ padding: '10px 10px 16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('open-chat'))}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
            background: '#E8B84B', border: 'none', borderRadius: 8, cursor: 'pointer',
            boxShadow: '0 2px 12px rgba(232,184,75,0.28)',
            transition: 'filter 0.15s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1.08)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1)'; }}
        >
          <svg width="15" height="15" fill="none" stroke="#1A1C2E" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.10em', color: '#1A1C2E', lineHeight: 1 }}>AI CFO</div>
            <div style={{ fontSize: 10, color: 'rgba(26,28,46,0.60)', marginTop: 2 }}>Ask anything</div>
          </div>
          <svg width="11" height="11" fill="none" stroke="rgba(26,28,46,0.5)" strokeWidth="2.5" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div style={{ marginTop: 10, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.18)', textAlign: 'center' }}>
          Empire Builder v1.0
        </div>
      </div>
    </nav>
  );
}
