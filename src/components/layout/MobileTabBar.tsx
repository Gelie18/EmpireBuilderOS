'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

function ChatTab() {
  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent('toggle-chat'))}
      className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 cursor-pointer border-none transition-colors"
      style={{
        fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
        color: '#E8B84B', borderTop: '2px solid #E8B84B', background: '#1A1C2E', minHeight: 52,
      }}
    >
      <svg width="18" height="18" fill="none" stroke="#E8B84B" strokeWidth="2" viewBox="0 0 24 24" style={{ marginBottom: 1 }}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      <span style={{ color: '#E8B84B', fontSize: 9, fontWeight: 700 }}>AI CFO</span>
    </button>
  );
}

const NAV_TABS = [
  { href: '/dashboard', label: 'Home',      icon: '◎' },
  { href: '/pnl',       label: 'P&L',       icon: '▤' },
  { href: '/cashflow',  label: 'Cash Flow', icon: '◷' },
  { href: '/backlog',   label: 'Backlog',   icon: '☰' },
];

export default function MobileTabBar() {
  const pathname = usePathname();
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex"
      style={{
        background: '#1A1C2E',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 -2px 12px rgba(0,0,0,0.20)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {NAV_TABS.map((tab) => {
        const active = pathname === tab.href || pathname.startsWith(tab.href + '/');
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 no-underline transition-colors"
            style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
              color: active ? '#E8B84B' : 'rgba(255,255,255,0.35)',
              borderTop: `2px solid ${active ? '#E8B84B' : 'transparent'}`,
              minHeight: 52,
            }}
          >
            <span style={{ fontSize: 16, color: active ? '#E8B84B' : 'rgba(255,255,255,0.35)' }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </Link>
        );
      })}
      <ChatTab />
    </nav>
  );
}
