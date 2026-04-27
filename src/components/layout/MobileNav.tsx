'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

// ── Pages within each demo ───────────────────────────────────────────────────

const FINANCE_NAV = [
  { label: 'CEO Dashboard',    href: '/dashboard' },
  { label: 'Decision Inbox',   href: '/inbox' },
  { label: 'P&L',              href: '/pnl' },
  { label: 'Cash Flow',        href: '/cashflow' },
  { label: 'Revenue Intel',    href: '/revenue' },
  { label: 'Runway',           href: '/runway' },
  { label: 'Scenarios',        href: '/scenarios' },
  { label: 'AP Aging',         href: '/ap-aging' },
  { label: 'AR Aging',         href: '/ar-aging' },
  { label: 'Vendor Spend',     href: '/vendors' },
  { label: 'Unit Economics',   href: '/unit-economics' },
  { label: 'Budget vs Actual', href: '/budget' },
];

const HR_NAV = [
  { label: 'CEO Dashboard',  href: '/hr/admin/dashboard' },
  { label: 'Headcount',      href: '/hr/admin/headcount' },
  { label: 'Org Chart',      href: '/hr/admin/org' },
  { label: 'Open Reqs',      href: '/hr/admin/reqs' },
  { label: 'Performance',    href: '/hr/admin/reviews' },
  { label: 'Comp Bands',     href: '/hr/admin/comp' },
  { label: 'eNPS',           href: '/hr/admin/enps' },
  { label: 'PTO Calendar',   href: '/hr/admin/pto' },
  { label: 'Employee Chat',  href: '/hr/chat' },
];

const OPS_NAV = [
  { label: 'Dashboard',       href: '/ops' },
  { label: 'Fulfillment SLA', href: '/ops/fulfillment' },
  { label: 'Support Queue',   href: '/ops/support' },
  { label: 'Inventory',       href: '/ops/inventory' },
  { label: 'Customer Health', href: '/ops/customers' },
  { label: 'Returns',         href: '/ops/returns' },
  { label: 'Chargebacks',     href: '/ops/chargebacks' },
];

// ── Drawer page grid ─────────────────────────────────────────────────────────

function DrawerLinks({
  items, pathname, onClose, accentColor,
}: {
  items: { label: string; href: string }[];
  pathname: string;
  onClose: () => void;
  accentColor: string;
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, padding: '0 14px 8px' }}>
      {items.map((item) => {
        const active = pathname === item.href ||
          (item.href.length > 5 && pathname.startsWith(item.href + '/'));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '13px 14px',
              background: active ? `${accentColor}20` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${active ? accentColor + '55' : 'rgba(255,255,255,0.07)'}`,
              borderRadius: 10,
              textDecoration: 'none',
              fontSize: 14, fontWeight: active ? 700 : 500,
              color: active ? '#FFFFFF' : 'rgba(255,255,255,0.62)',
              lineHeight: 1.3,
            }}
          >
            {active && (
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: accentColor, flexShrink: 0 }} />
            )}
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767.98px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Mobile-only — never render on desktop/tablet-landscape
  if (!isMobile) return null;

  const inHR  = pathname.startsWith('/hr');
  const inOps = pathname.startsWith('/ops');

  type Section = { title: string; color: string; items: { label: string; href: string }[]; showAI: boolean };
  const section: Section = inHR
    ? { title: 'HR OS',      color: '#0A6A3C', items: HR_NAV,      showAI: false }
    : inOps
    ? { title: 'Ops OS',     color: '#4FA8FF', items: OPS_NAV,     showAI: false }
    : { title: 'Finance OS', color: '#1D44BF', items: FINANCE_NAV, showAI: true  };

  return (
    <>
      {/* ── BOTTOM BAR ── */}
      <nav
        className="md:hidden"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
          display: 'flex',
          background: 'rgba(11,13,23,0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 -4px 24px rgba(0,0,0,0.30)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        {/* Exit */}
        <button
          onClick={() => router.push('/demo-hub')}
          style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '10px 0 9px', gap: 4, minHeight: 54,
            background: 'none', border: 'none', borderTop: '2px solid transparent',
            cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
          }}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', fontFamily: 'inherit' }}>
            Exit
          </span>
        </button>

        {/* Divider */}
        <div style={{ width: 1, background: 'rgba(255,255,255,0.08)', margin: '10px 0' }} />

        {/* Menu */}
        <button
          onClick={() => setOpen(true)}
          style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '10px 0 9px', gap: 4, minHeight: 54,
            background: 'none', border: 'none',
            borderTop: `2px solid ${open ? '#E8B84B' : 'transparent'}`,
            cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
          }}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke={open ? '#E8B84B' : 'rgba(255,255,255,0.45)'} strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6"  x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: open ? '#E8B84B' : 'rgba(255,255,255,0.45)', fontFamily: 'inherit' }}>
            Menu
          </span>
        </button>
      </nav>

      {/* ── DRAWER ── */}
      <div
        className="md:hidden"
        style={{
          position: 'fixed', inset: 0, zIndex: 60,
          pointerEvents: open ? 'auto' : 'none',
        }}
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
            opacity: open ? 1 : 0,
            transition: 'opacity 0.22s ease',
          }}
        />

        {/* Slide-up panel */}
        <div
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: '#0F1120',
            borderRadius: '20px 20px 0 0',
            maxHeight: '88dvh',
            overflowY: 'auto',
            transform: open ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.30s cubic-bezier(0.32,0.72,0,1)',
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          }}
        >
          {/* Pull handle */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.14)' }} />
          </div>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 20px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 3, height: 18, borderRadius: 2, background: section.color }} />
              <span style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.01em' }}>{section.title}</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.55)" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Page links */}
          <DrawerLinks
            items={section.items}
            pathname={pathname}
            onClose={() => setOpen(false)}
            accentColor={section.color}
          />

          {/* AI CFO — Finance only */}
          {section.showAI && (
            <div style={{ padding: '10px 14px 14px' }}>
              <button
                onClick={() => {
                  setOpen(false);
                  setTimeout(() => window.dispatchEvent(new CustomEvent('toggle-chat')), 200);
                }}
                style={{
                  width: '100%', padding: '14px 20px',
                  background: 'linear-gradient(135deg, #1D44BF 0%, #B38A00 100%)',
                  border: 'none', borderRadius: 11,
                  color: '#FFFFFF', fontSize: 14, fontWeight: 800,
                  letterSpacing: '0.07em', textTransform: 'uppercase',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Open AI CFO
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
