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
        color: '#F58A1F', borderTop: '2px solid #F58A1F', background: '#0B0D17', minHeight: 52,
      }}
    >
      <svg width="18" height="18" fill="none" stroke="#F58A1F" strokeWidth="2" viewBox="0 0 24 24" style={{ marginBottom: 1 }}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      <span style={{ color: '#F58A1F', fontSize: 9, fontWeight: 700 }}>AI CFO</span>
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
        background: '#0B0D17',
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
              color: active ? '#F58A1F' : 'rgba(255,255,255,0.35)',
              borderTop: `2px solid ${active ? '#F58A1F' : 'transparent'}`,
              minHeight: 52,
            }}
          >
            <span style={{ fontSize: 16, color: active ? '#F58A1F' : 'rgba(255,255,255,0.35)' }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </Link>
        );
      })}
      <ChatTab />
    </nav>
  );
}
