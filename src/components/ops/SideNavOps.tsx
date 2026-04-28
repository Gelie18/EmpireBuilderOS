'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BLCircleLogo from '@/components/brand/BLCircleLogo';

const NAV = [
  {
    href: '/ops',
    label: 'Ops Dashboard',
    hint: 'Overview & KPIs',
    icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  },
  {
    href: '/ops/fulfillment',
    label: 'Fulfillment SLA',
    hint: 'Ship · deliver · exceptions',
    icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="1" y="6" width="15" height="11" rx="1.5"/><path d="M16 10h4l3 3v4h-7"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/></svg>,
  },
  {
    href: '/ops/support',
    label: 'Support Queue',
    hint: 'Tickets · SLA · CSAT',
    icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  },
  {
    href: '/ops/returns',
    label: 'Returns / RMA',
    hint: 'Pipeline · reasons · refunds',
    icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M3 6v6a9 9 0 0 0 9 9 9 9 0 0 0 9-9V6"/><path d="M9 9l-3-3 3-3"/><path d="M6 6h12" strokeLinecap="round"/></svg>,
  },
  {
    href: '/ops/customers',
    label: 'Customer Health',
    hint: 'LTV · churn · saves',
    icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  },
  {
    href: '/ops/chargebacks',
    label: 'Chargebacks',
    hint: 'Disputes · evidence · win rate',
    icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20" strokeLinecap="round"/><path d="M7 15h4" strokeLinecap="round"/></svg>,
  },
];

const INVENTORY_NAV = [
  {
    href: '/ops/inventory',
    label: 'Inventory Command',
    hint: 'DoC · stockouts · deadstock',
    icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 12l9 4 9-4M3 17l9 4 9-4" strokeLinejoin="round"/></svg>,
  },
  {
    href: '/ops/inventory/sku',
    label: 'SKU Detail',
    hint: 'Velocity · history',
    icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h10M7 13h6M7 17h8" strokeLinecap="round"/></svg>,
  },
  {
    href: '/ops/inventory/reorder',
    label: 'Reorder Planner',
    hint: 'Auto ROP + EOQ',
    icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 4v6h6M20 20v-6h-6" strokeLinecap="round"/><path d="M20 10A8 8 0 0 0 5 7m-1 7a8 8 0 0 0 15 3" strokeLinecap="round"/></svg>,
  },
  {
    href: '/ops/inventory/locations',
    label: 'Multi-Location',
    hint: 'Warehouses & 3PLs',
    icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 22s-7-7.5-7-13a7 7 0 1 1 14 0c0 5.5-7 13-7 13z"/><circle cx="12" cy="9" r="2.5"/></svg>,
  },
  {
    href: '/ops/inventory/po',
    label: 'PO Tracker',
    hint: '6 open · 1 late',
    icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M3 7h18l-2 12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L3 7z"/><path d="M8 7V5a4 4 0 0 1 8 0v2" strokeLinecap="round"/></svg>,
  },
  {
    href: '/ops/inventory/movements',
    label: 'Stock Movements',
    hint: 'Receipts · sales · xfers',
    icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 7h14M4 7l4-4M4 7l4 4" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 17H6M20 17l-4-4M20 17l-4 4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    href: '/ops/inventory/deadstock',
    label: 'Deadstock Console',
    hint: 'Markdown & write-offs',
    icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M5 7h14l-1 12H6L5 7z"/><path d="M9 10v6M12 10v6M15 10v6" strokeLinecap="round"/></svg>,
  },
  {
    href: '/ops/inventory/finance',
    label: 'Finance Tie-in',
    hint: 'COGS · valuation',
    icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M9 12h6M12 9v6" strokeLinecap="round"/></svg>,
  },
];

export default function SideNavOps() {
  const pathname = usePathname();

  return (
    <nav
      className="hidden md:flex flex-col flex-shrink-0 overflow-y-auto"
      style={{ width: 230, background: 'var(--color-shell-2)', borderRight: '1px solid var(--color-sidebar-divider)' }}
    >
      {/* Header */}
      <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid var(--color-sidebar-divider)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <BLCircleLogo size={32} theme="dark" />
          <div>
            <div style={{ fontWeight: 800, fontSize: 11, color: 'var(--color-sidebar-text)', letterSpacing: '0.18em', textTransform: 'uppercase', lineHeight: 1 }}>
              Ops OS
            </div>
            <div style={{ fontSize: 9.5, fontWeight: 500, color: 'var(--color-sidebar-muted)', letterSpacing: '0.06em', marginTop: 2 }}>
              Meritage Partners
            </div>
          </div>
        </div>
        {/* Crimson gradient bar */}
        <div style={{ width: '100%', height: 2, background: 'linear-gradient(90deg,#1D44BF,#BF1A1A,#4FA8FF)', borderRadius: 2, marginTop: 12 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
          <span style={{ background: 'rgba(45,180,122,0.18)', border: '1px solid rgba(45,180,122,0.35)', color: '#5EDBA8', fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 3 }}>● Live</span>
          <span style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.20)', color: 'rgba(255,255,255,0.65)', fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 3 }}>Apr 2026</span>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 py-3" style={{ overflowY: 'auto' }}>
        {/* Operations */}
        <div style={{ marginBottom: 4 }}>
          <div style={{ padding: '8px 16px 4px', fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--color-sidebar-section)' }}>
            Operations
          </div>
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className="no-underline block" style={{ padding: '2px 8px' }}>
                <div
                  style={{
                    display: 'flex', alignItems: 'center', gap: 9, padding: '7px 10px', borderRadius: 7,
                    background: active ? 'var(--color-sidebar-active)' : 'transparent',
                    color: active ? 'var(--color-sidebar-text)' : 'var(--color-sidebar-muted)',
                    border: active ? '1px solid var(--color-sidebar-active-border)' : '1px solid transparent',
                    transition: 'background 0.12s, color 0.12s',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.background = 'var(--color-sidebar-hover)';
                      (e.currentTarget as HTMLElement).style.color = 'var(--color-sidebar-text)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                      (e.currentTarget as HTMLElement).style.color = 'var(--color-sidebar-muted)';
                    }
                  }}
                >
                  {active && (
                    <div style={{ position: 'absolute', left: 0, top: '20%', height: '60%', width: 3, borderRadius: 2, background: '#FFFFFF' }} />
                  )}
                  <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0, opacity: active ? 1 : 0.65 }}>
                    {item.icon}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: active ? 700 : 500, lineHeight: 1.1, color: 'var(--color-sidebar-text)' }}>{item.label}</div>
                    {item.hint && (
                      <div style={{ fontSize: 9.5, color: 'var(--color-sidebar-subtle)', marginTop: 2 }}>{item.hint}</div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Inventory */}
        <div style={{ marginTop: 12 }}>
          <div style={{ padding: '8px 16px 4px', fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--color-sidebar-section)' }}>
            Inventory
          </div>
          {INVENTORY_NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className="no-underline block" style={{ padding: '2px 8px' }}>
                <div
                  style={{
                    display: 'flex', alignItems: 'center', gap: 9, padding: '7px 10px', borderRadius: 7,
                    background: active ? 'var(--color-sidebar-active)' : 'transparent',
                    color: active ? 'var(--color-sidebar-text)' : 'var(--color-sidebar-muted)',
                    border: active ? '1px solid var(--color-sidebar-active-border)' : '1px solid transparent',
                    transition: 'background 0.12s, color 0.12s',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.background = 'var(--color-sidebar-hover)';
                      (e.currentTarget as HTMLElement).style.color = 'var(--color-sidebar-text)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                      (e.currentTarget as HTMLElement).style.color = 'var(--color-sidebar-muted)';
                    }
                  }}
                >
                  {active && (
                    <div style={{ position: 'absolute', left: 0, top: '20%', height: '60%', width: 3, borderRadius: 2, background: '#FFFFFF' }} />
                  )}
                  <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0, opacity: active ? 1 : 0.65 }}>
                    {item.icon}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: active ? 700 : 500, lineHeight: 1.1, color: 'var(--color-sidebar-text)' }}>{item.label}</div>
                    {item.hint && (
                      <div style={{ fontSize: 9.5, color: 'var(--color-sidebar-subtle)', marginTop: 2 }}>{item.hint}</div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Views */}
        <div style={{ marginTop: 12 }}>
          <div style={{ padding: '8px 16px 4px', fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--color-sidebar-section)' }}>
            Quick Views
          </div>
          {[
            { label: 'Ticket Queue',      hint: 'All open tickets', tab: 'overview' },
            { label: 'Refunds & Returns', hint: 'By brand · MTD',    tab: 'refunds'  },
            { label: 'SLA & CSAT',        hint: 'Compliance trends', tab: 'sla'      },
            { label: '💬 CS Chat Demo',   hint: 'Customer view',    tab: 'chat'     },
          ].map((q) => (
            <button
              key={q.label}
              onClick={() => window.dispatchEvent(new CustomEvent('ops-tab', { detail: { tab: q.tab } }))}
              style={{
                width: 'calc(100% - 16px)', margin: '0 8px 2px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8,
                padding: '7px 10px', borderRadius: 7,
                background: 'transparent', border: '1px solid transparent',
                color: 'var(--color-sidebar-muted)',
                cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                transition: 'background 0.12s, color 0.12s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'var(--color-sidebar-hover)';
                (e.currentTarget as HTMLElement).style.color = 'var(--color-sidebar-text)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.color = 'var(--color-sidebar-muted)';
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-sidebar-text)' }}>{q.label}</span>
              <span style={{ fontSize: 9.5, color: 'var(--color-sidebar-subtle)', textAlign: 'right' }}>{q.hint}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '10px 10px 16px', borderTop: '1px solid var(--color-sidebar-divider)' }}>
        <Link href="/dashboard" className="no-underline block" style={{ padding: '2px 8px', marginBottom: 4 }}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px', borderRadius: 7, background: 'rgba(27,77,230,0.20)', border: '1px solid rgba(27,77,230,0.40)', color: '#FFAAAA', transition: 'background 0.12s' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(27,77,230,0.30)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(27,77,230,0.20)'; }}
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" strokeLinecap="round" strokeLinejoin="round"/><polyline points="16 7 22 7 22 13" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', lineHeight: 1 }}>Finance OS</div>
              <div style={{ fontSize: 10, color: 'rgba(255,170,170,0.65)', marginTop: 2 }}>Dashboard · P&L · Scenarios →</div>
            </div>
          </div>
        </Link>
        <Link href="/hr/chat" className="no-underline block" style={{ padding: '2px 8px', marginBottom: 4 }}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px', borderRadius: 7, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.75)', transition: 'background 0.12s' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; }}
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', lineHeight: 1 }}>HR OS</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.40)', marginTop: 2 }}>Chat · Profile · CEO Dashboard →</div>
            </div>
          </div>
        </Link>
        <div style={{ marginTop: 6, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-sidebar-subtle)', textAlign: 'center' }}>
          Meritage Partners Ops OS v1.0
        </div>
      </div>
    </nav>
  );
}
