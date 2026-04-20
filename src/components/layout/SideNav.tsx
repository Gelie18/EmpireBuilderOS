'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const icons = {
  dashboard: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  pnl: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <line x1="4" y1="19" x2="4" y2="5" />
      <rect x="7" y="12" width="3" height="7" rx="1" fill="currentColor" stroke="none" opacity="0.5" />
      <rect x="12" y="7" width="3" height="12" rx="1" fill="currentColor" stroke="none" />
      <rect x="17" y="10" width="3" height="9" rx="1" fill="currentColor" stroke="none" opacity="0.65" />
    </svg>
  ),
  balance: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M12 3v18M5 7l7-4 7 4M5 17l7 4 7-4" />
      <path d="M5 12h14" strokeDasharray="2 2" />
    </svg>
  ),
  cashflow: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4l3 3" strokeLinecap="round" />
    </svg>
  ),
  yoy: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M3 17l4-8 4 5 3-3 4 6" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M3 11l4-4 4 3 3-3 4 4" strokeLinejoin="round" strokeLinecap="round" opacity="0.35" />
    </svg>
  ),
  mom: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="16 7 22 7 22 13" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  dailyrev: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M3 9h18M8 2v4M16 2v4" strokeLinecap="round" />
      <path d="M12 13v4M10 15h4" strokeLinecap="round" />
    </svg>
  ),
  backlog: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" strokeLinecap="round" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 12h6M9 16h4" strokeLinecap="round" />
    </svg>
  ),
  forecast: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M2 20h20M5 20V10l7-7 7 7v10" strokeLinejoin="round" />
      <path d="M9 20v-5h6v5" />
    </svg>
  ),
  driver: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <line x1="4" y1="6" x2="9" y2="6" strokeLinecap="round" />
      <line x1="15" y1="6" x2="20" y2="6" strokeLinecap="round" />
      <circle cx="12" cy="6" r="3" />
      <line x1="4" y1="12" x2="7" y2="12" strokeLinecap="round" />
      <line x1="13" y1="12" x2="20" y2="12" strokeLinecap="round" />
      <circle cx="10" cy="12" r="3" />
      <line x1="4" y1="18" x2="16" y2="18" strokeLinecap="round" />
      <line x1="22" y1="18" x2="20" y2="18" strokeLinecap="round" />
      <circle cx="18" cy="18" r="3" />
    </svg>
  ),
  scenarios: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M6 3v8" strokeLinecap="round" />
      <path d="M6 11l4 4M6 11l-4 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 15v6M2 15v6" strokeLinecap="round" />
    </svg>
  ),
  market: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <ellipse cx="12" cy="12" rx="4" ry="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
    </svg>
  ),
};

const GROUP_META: Record<string, { color: string; bg: string; dot: string; activeBorder: string }> = {
  'Overview':   { color: '#1D44BF', bg: 'rgba(29,68,191,0.08)',  dot: '#1D44BF', activeBorder: 'rgba(29,68,191,0.18)' },
  'Financials': { color: '#059669', bg: 'rgba(5,150,105,0.07)',  dot: '#059669', activeBorder: 'rgba(5,150,105,0.18)' },
  'Operations': { color: '#D97706', bg: 'rgba(217,119,6,0.07)',  dot: '#E8B84B', activeBorder: 'rgba(217,119,6,0.18)' },
  'Planning':   { color: '#7C3AED', bg: 'rgba(124,58,237,0.07)', dot: '#7C3AED', activeBorder: 'rgba(124,58,237,0.18)' },
};

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { href: '/dashboard',     label: 'Dashboard',     icon: icons.dashboard },
    ],
  },
  {
    label: 'Financials',
    items: [
      { href: '/pnl',           label: 'P&L',           icon: icons.pnl },
      { href: '/balance-sheet', label: 'Balance Sheet', icon: icons.balance },
      { href: '/cashflow',      label: 'Cash Flow',     icon: icons.cashflow },
      { href: '/yoy',           label: 'YoY Compare',   icon: icons.yoy },
      { href: '/mom',           label: 'MoM Trend',     icon: icons.mom },
    ],
  },
  {
    label: 'Operations',
    items: [
      { href: '/daily-revenue', label: 'Daily Revenue', icon: icons.dailyrev },
      { href: '/revenue',       label: 'Revenue Intel',  icon: icons.pnl },
      { href: '/backlog',       label: 'Ops Backlog',    icon: icons.backlog },
      { href: '/fin-backlog',   label: 'Fin. Backlog',   icon: icons.backlog },
    ],
  },
  {
    label: 'Planning',
    items: [
      { href: '/ai-forecast',   label: 'AI Forecast',   icon: icons.forecast },
      { href: '/forecast',      label: 'Driver Model',  icon: icons.driver },
      { href: '/scenarios',     label: 'Scenarios',     icon: icons.scenarios },
      { href: '/market',        label: 'Market Intel',  icon: icons.market },
    ],
  },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <nav
      className="hidden md:flex flex-col flex-shrink-0 overflow-y-auto"
      style={{
        width: 214,
        background: '#1A1C2E',
        borderRight: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Company badge */}
      <div
        style={{
          padding: '16px 14px 14px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(0,0,0,0.15)',
        }}
      >
        <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.10em', color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>
          Active company
        </div>
        <div style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
          Apex Industrial
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
          <span style={{
            background: 'rgba(232,184,75,0.15)',
            border: '1px solid rgba(232,184,75,0.30)',
            color: '#E8B84B',
            fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
            textTransform: 'uppercase', padding: '2px 8px', borderRadius: 3,
          }}>Oct 2026</span>
          <span style={{
            background: 'rgba(5,150,105,0.15)',
            border: '1px solid rgba(5,150,105,0.30)',
            color: '#059669',
            fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
            textTransform: 'uppercase', padding: '2px 8px', borderRadius: 3,
          }}>Demo</span>
        </div>
      </div>

      {/* Nav groups */}
      <div className="flex-1 py-2">
        {NAV_GROUPS.map((group) => {
          const meta = GROUP_META[group.label];
          return (
            <div key={group.label} style={{ marginBottom: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 14px 4px' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: meta.dot, flexShrink: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)' }}>
                  {group.label}
                </span>
              </div>

              {group.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="no-underline"
                    style={{ display: 'block', padding: '1px 8px' }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        const el = e.currentTarget.querySelector('.nav-inner') as HTMLElement;
                        if (el) { el.style.background = 'rgba(255,255,255,0.06)'; el.style.color = '#FFFFFF'; }
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        const el = e.currentTarget.querySelector('.nav-inner') as HTMLElement;
                        if (el) { el.style.background = 'transparent'; el.style.color = 'rgba(255,255,255,0.50)'; }
                      }
                    }}
                  >
                    <div
                      className="nav-inner"
                      style={{
                        display: 'flex', alignItems: 'center', gap: 9, padding: '7px 10px', borderRadius: 6,
                        background: active ? meta.bg : 'transparent',
                        color: active ? meta.color : 'rgba(255,255,255,0.50)',
                        border: active ? `1px solid ${meta.activeBorder}` : '1px solid transparent',
                        transition: 'background 0.12s, color 0.12s',
                        position: 'relative',
                      }}
                    >
                      {active && (
                        <div style={{
                          position: 'absolute', left: 0, top: '18%', height: '64%', width: 2.5,
                          borderRadius: 2, background: meta.dot,
                        }} />
                      )}
                      <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0, opacity: active ? 1 : 0.55, color: active ? meta.color : 'inherit', transition: 'opacity 0.12s' }}>
                        {item.icon}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, lineHeight: 1, flex: 1 }}>
                        {item.label}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* AI CFO launch */}
      <div style={{ padding: '10px 10px 14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('open-chat'))}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
            background: '#E8B84B', border: 'none', borderRadius: 7, cursor: 'pointer',
            transition: 'background 0.14s, box-shadow 0.14s',
            boxShadow: '0 2px 10px rgba(232,184,75,0.30)',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#D4A338'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#E8B84B'; }}
        >
          <svg width="16" height="16" fill="none" stroke="#1A1C2E" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#1A1C2E', lineHeight: 1 }}>AI CFO</div>
            <div style={{ fontSize: 10, color: 'rgba(26,28,46,0.65)', marginTop: 2, fontWeight: 400 }}>Ask anything</div>
          </div>
          <svg width="12" height="12" fill="none" stroke="rgba(26,28,46,0.6)" strokeWidth="2.5" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
        <div style={{ marginTop: 10, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.20)', textAlign: 'center' }}>
          Empire Builder v1.0
        </div>
      </div>
    </nav>
  );
}
