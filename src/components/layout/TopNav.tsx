'use client';

import { useRouter } from 'next/navigation';

interface TopNavProps {
  companyName: string;
}

/**
 * Empire Builder logo — simple EMPIRE / BUILDER wordmark.
 * EMPIRE in cobalt blue, BUILDER in warm gold.
 */
function EmpireBuilderLogo() {
  return (
    <div className="flex flex-col leading-none select-none flex-shrink-0" aria-label="Empire Builder">
      <span
        style={{
          fontFamily: '"DM Sans", system-ui, sans-serif',
          fontWeight: 900,
          fontSize: 15,
          color: '#1D44BF',
          letterSpacing: '0.12em',
          lineHeight: 1,
          textTransform: 'uppercase',
        }}
      >
        Empire
      </span>
      <span
        style={{
          fontFamily: '"DM Sans", system-ui, sans-serif',
          fontWeight: 900,
          fontSize: 10,
          color: '#E8B84B',
          letterSpacing: '0.22em',
          lineHeight: 1,
          marginTop: 2,
          textTransform: 'uppercase',
        }}
      >
        Builder
      </span>
    </div>
  );
}

export default function TopNav({ companyName }: TopNavProps) {
  const isLive  = process.env.NEXT_PUBLIC_MODE === 'live';
  const router  = useRouter();

  const handleLogout = () => {
    document.cookie = 'eb-auth=; path=/; max-age=0';
    router.push('/login');
  };

  return (
    <header
      className="h-[52px] flex-shrink-0 sticky top-0 z-50 flex items-center justify-between px-4 md:px-6"
      style={{
        background: '#1A1C2E',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 1px 0 0 rgba(0,0,0,0.12)',
      }}
    >
      {/* Left: logo + divider + product name */}
      <div className="flex items-center gap-3 min-w-0">
        <EmpireBuilderLogo />

        <div className="w-px h-6 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }} />

        <div className="flex flex-col justify-center min-w-0">
          <span
            className="text-[11px] font-bold uppercase tracking-[0.10em] leading-none"
            style={{ color: '#E8B84B' }}
          >
            FinanceOS
          </span>
          <span
            className="text-[10px] uppercase tracking-[0.07em] leading-none mt-0.5 hidden sm:block truncate"
            style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}
          >
            {companyName}
          </span>
        </div>
      </div>

      {/* Right: badges + status */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div
          className="hidden sm:flex items-center px-2.5 py-1 rounded"
          style={{
            background: 'rgba(232,184,75,0.15)',
            border: '1px solid rgba(232,184,75,0.30)',
          }}
        >
          <span
            className="text-[10px] font-bold uppercase tracking-[0.08em]"
            style={{ color: '#E8B84B' }}
          >
            Apr 2026
          </span>
        </div>

        {isLive && (
          <a
            href="/api/auth/qbo/connect"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.05em] no-underline rounded transition-opacity hover:opacity-70"
            style={{
              color: '#E8B84B',
              border: '1px solid rgba(232,184,75,0.4)',
              background: 'rgba(232,184,75,0.10)',
            }}
          >
            Connect QBO
          </a>
        )}

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#0A8A5C' }} />
          <span className="hidden sm:block text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {isLive ? 'Live · QBO' : 'Demo · Apr 2026'}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="hidden sm:flex items-center gap-1.5 cursor-pointer transition-opacity hover:opacity-70"
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 6,
            padding: '5px 10px',
            color: 'rgba(255,255,255,0.40)',
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
