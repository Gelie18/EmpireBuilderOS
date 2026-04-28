'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import BLCircleLogo from '@/components/brand/BLCircleLogo';
import { useSubco } from '@/contexts/SubcoContext';
import { useTheme } from '@/contexts/ThemeContext';

interface TopNavProps {
  companyName?: string;
  product?: string;
  rightSlot?: ReactNode;
}

export default function TopNav({ companyName, product = 'Finance OS', rightSlot }: TopNavProps) {
  const isLive  = process.env.NEXT_PUBLIC_MODE === 'live';
  const router  = useRouter();
  const { subco, isConsolidated } = useSubco();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const displayCompanyName = companyName ?? (
    isConsolidated
      ? 'Consolidated · All Portcos'
      : subco.id === 'bases-loaded'
        ? 'Meritage Partners · Holdco'
        : `${subco.name} · Meritage Partners`
  );

  const handleLogout = () => {
    document.cookie = 'eb-auth=; path=/; max-age=0';
    router.push('/login');
  };

  return (
    <header
      className="h-[52px] flex-shrink-0 sticky top-0 z-50 flex items-center justify-between px-4 md:px-6"
      style={{
        background: 'var(--color-shell)',
        borderBottom: isDark
          ? '1px solid var(--color-divider)'
          : '2px solid #4FA8FF',
        boxShadow: isDark ? '0 1px 0 0 rgba(0,0,0,0.08)' : 'none',
      }}
    >
      {/* Left: logo + divider + product label */}
      <div className="flex items-center gap-3 min-w-0">
        <BLCircleLogo size={34} theme="dark" />

        <div
          className="w-px h-6 flex-shrink-0"
          style={{ background: isDark ? 'var(--color-divider)' : 'rgba(79,168,255,0.15)' }}
        />

        <div className="flex flex-col justify-center min-w-0">
          <span
            className="text-[11px] font-bold uppercase tracking-[0.14em] leading-none"
            style={{ color: isDark ? 'var(--color-accent)' : '#1D44BF' }}
          >
            {product}
          </span>
          <span
            className="text-[10px] uppercase tracking-[0.07em] leading-none mt-0.5 hidden sm:block truncate"
            style={{ color: 'var(--color-on-shell-muted)', fontWeight: 500 }}
          >
            {displayCompanyName}
          </span>
        </div>
      </div>

      {/* Right: slot + controls */}
      <div className="flex items-center gap-3 flex-shrink-0">

        {rightSlot && <div className="hidden sm:flex items-center">{rightSlot}</div>}

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
          className="flex items-center justify-center cursor-pointer transition-opacity hover:opacity-80"
          style={{
            background: 'transparent',
            border: `1px solid ${isDark ? 'var(--color-divider)' : 'rgba(79,168,255,0.18)'}`,
            borderRadius: 6,
            padding: 6,
            color: 'var(--color-on-shell-muted)',
            width: 30, height: 30,
          }}
        >
          {isDark ? (
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        {/* Exit Demo */}
        <button
          onClick={() => router.push('/demo-hub')}
          className="hidden sm:flex items-center gap-1.5 cursor-pointer transition-opacity hover:opacity-80"
          style={{
            background: isDark ? 'rgba(27,77,230,0.12)' : 'rgba(27,77,230,0.08)',
            border: '1px solid rgba(27,77,230,0.30)',
            borderRadius: 6,
            padding: '5px 10px',
            color: '#1D44BF',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="hidden md:inline">Exit Demo</span>
        </button>

        {/* Live/Demo status */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#0A8A5C' }} />
          <span
            className="text-[11px] font-medium"
            style={{ color: 'var(--color-on-shell-muted)' }}
          >
            {isLive ? 'Live · QBO' : 'Demo · Apr 2026'}
          </span>
        </div>

        {isLive && product === 'Finance OS' && (
          <a
            href="/api/auth/qbo/connect"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.05em] no-underline rounded transition-opacity hover:opacity-70"
            style={{
              color: '#4FA8FF',
              border: '1px solid rgba(79,168,255,0.35)',
              background: 'rgba(79,168,255,0.08)',
            }}
          >
            Connect QBO
          </a>
        )}

        {/* Log Out */}
        <button
          onClick={handleLogout}
          className="hidden sm:flex items-center gap-1.5 cursor-pointer transition-opacity hover:opacity-70"
          style={{
            background: 'transparent',
            border: `1px solid ${isDark ? 'var(--color-divider)' : 'rgba(79,168,255,0.18)'}`,
            borderRadius: 6,
            padding: '5px 10px',
            color: 'var(--color-on-shell-muted)',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round"/>
          </svg>
          <span className="hidden md:inline">Log Out</span>
        </button>
      </div>
    </header>
  );
}
