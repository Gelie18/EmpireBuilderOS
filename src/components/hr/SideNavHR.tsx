'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePersona } from '@/lib/hr/context';
import BLCircleLogo from '@/components/brand/BLCircleLogo';

export default function SideNavHR() {
  const pathname = usePathname();
  const { persona } = usePersona();

  const NAV = [
    {
      href: '/hr/chat', label: 'Chat',
      hint: `${persona.snapshot.openAlerts} open alerts`,
      icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
    },
    {
      href: '/hr/profile', label: 'Profile',
      hint: persona.profile.employeeId,
      icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    },
  ];

  const ADMIN_NAV = [
    {
      href: '/hr/admin/dashboard', label: 'CEO Dashboard',
      hint: 'Headcount · open roles · hiring',
      icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
    },
    {
      href: '/hr/admin/headcount', label: 'Headcount',
      hint: 'Plan vs actual · attrition',
      icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    },
    {
      href: '/hr/admin/reqs', label: 'Open Reqs',
      hint: '8 open · ATS pipeline',
      icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 14h3"/></svg>,
    },
    {
      href: '/hr/admin/onboarding', label: 'Onboarding',
      hint: '90-day checklist',
      icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
    },
    {
      href: '/hr/admin/reviews', label: 'Performance',
      hint: 'H1 review cycle',
      icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15 8.5 22 9 17 14 18.5 21 12 17.5 5.5 21 7 14 2 9 9 8.5"/></svg>,
    },
    {
      href: '/hr/admin/comp', label: 'Comp Bands',
      hint: 'Ranges · pay equity',
      icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    },
    {
      href: '/hr/admin/pto', label: 'PTO Calendar',
      hint: 'Out today · upcoming',
      icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    },
    {
      href: '/hr/admin/enps', label: 'eNPS',
      hint: 'Engagement pulse',
      icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
    },
    {
      href: '/hr/admin/org', label: 'Org Chart',
      hint: 'Reporting tree',
      icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="8.5" y="14" width="7" height="7" rx="1"/><path d="M12 10v4"/><path d="M6.5 10v2h11v-2"/></svg>,
    },
    {
      href: '/hr/admin/documents', label: 'Policies',
      hint: 'Handbook & docs',
      icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
    },
    {
      href: '/hr/admin/goals', label: 'Goals (manager)',
      hint: 'Assign & review',
      icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    },
  ];

  const TOPICS: { label: string; hint: string }[] = [
    { label: "What's due soon?", hint: `${persona.snapshot.openAlerts} items` },
    { label: 'Draft a PTO request', hint: `${persona.timeOff.ptoRemainingDays} PTO days` },
    { label: 'Start open enrollment', hint: persona.benefits.openEnrollment.status },
    { label: 'Am I leaving 401k match?', hint: persona.retirement.leavingMatchOnTable > 0 ? `${fmt(persona.retirement.leavingMatchOnTable)}/yr` : 'All captured' },
    { label: 'Draft my self-review', hint: persona.performance.phase.replace('_', ' ') },
    { label: 'Show my goals', hint: `${persona.goals.length} active` },
    { label: 'Draft an expense report', hint: fmt(persona.expenses.ytdReimbursements) + ' YTD' },
    { label: 'Handbook — parental leave', hint: 'policy' },
  ];

  const navItem = (item: { href: string; label: string; icon: React.ReactNode }, active: boolean) => (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 9,
        padding: '7px 10px', borderRadius: 7, position: 'relative',
        background: active ? 'var(--color-sidebar-active)' : 'transparent',
        color: active ? 'var(--color-sidebar-text)' : 'var(--color-sidebar-muted)',
        border: active ? '1px solid var(--color-sidebar-active-border)' : '1px solid transparent',
        transition: 'background 0.12s, color 0.12s',
      }}
    >
      {active && (
        <div style={{ position: 'absolute', left: 0, top: '20%', height: '60%', width: 3, borderRadius: 2, background: '#FFFFFF' }} />
      )}
      <span style={{ display: 'flex', alignItems: 'center', opacity: active ? 1 : 0.65 }}>
        {item.icon}
      </span>
      <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, lineHeight: 1, color: 'var(--color-sidebar-text)' }}>
        {item.label}
      </span>
    </div>
  );

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
              HR OS
            </div>
            <div style={{ fontSize: 9.5, fontWeight: 500, color: 'var(--color-sidebar-muted)', letterSpacing: '0.06em', marginTop: 2 }}>
              Meritage Partners
            </div>
          </div>
        </div>
        {/* Crimson gradient bar */}
        <div style={{ width: '100%', height: 2, background: 'linear-gradient(90deg,#1D44BF,#BF1A1A,#4FA8FF)', borderRadius: 2, marginTop: 12 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
          <span style={{ background: 'rgba(45,180,122,0.18)', border: '1px solid rgba(45,180,122,0.35)', color: '#5EDBA8', fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 3 }}>Demo</span>
          <span style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.20)', color: 'rgba(255,255,255,0.65)', fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 3 }}>Phase 1</span>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 py-3" style={{ overflowY: 'auto' }}>
        {/* For me */}
        <div style={{ marginBottom: 4 }}>
          <div style={{ padding: '8px 16px 4px', fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--color-sidebar-section)' }}>
            For me
          </div>
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href === '/hr/chat' && pathname === '/hr');
            return (
              <Link key={item.href} href={item.href} className="no-underline block" style={{ padding: '2px 8px' }}>
                {navItem(item, active)}
              </Link>
            );
          })}
        </div>

        {/* HR Admin */}
        <div style={{ marginTop: 14 }}>
          <div style={{ padding: '8px 16px 4px', fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--color-sidebar-section)' }}>
            HR Admin
          </div>
          {ADMIN_NAV.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className="no-underline block" style={{ padding: '2px 8px' }}>
                {navItem(item, active)}
              </Link>
            );
          })}
        </div>

        {/* Ask the chat */}
        <div style={{ marginTop: 14 }}>
          <div style={{ padding: '8px 16px 4px', fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--color-sidebar-section)' }}>
            Ask the chat
          </div>
          {TOPICS.map((t) => (
            <button
              key={t.label}
              onClick={() => {
                if (pathname !== '/hr/chat') window.location.href = '/hr/chat';
                window.dispatchEvent(new CustomEvent('hr-chat-prompt', { detail: { prompt: t.label } }));
              }}
              style={{
                width: 'calc(100% - 16px)', margin: '0 8px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8,
                padding: '7px 10px', borderRadius: 7,
                background: 'transparent', border: '1px solid transparent',
                color: 'var(--color-sidebar-muted)',
                cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                transition: 'background 0.12s, color 0.12s, border-color 0.12s',
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
              <span style={{ fontSize: 12, fontWeight: 500 }}>{t.label}</span>
              <span style={{ fontSize: 9.5, color: 'var(--color-sidebar-subtle)', textAlign: 'right' }}>{t.hint}</span>
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
              <div style={{ fontSize: 10, color: 'rgba(255,170,170,0.65)', marginTop: 2 }}>Dashboard · CS · P&L →</div>
            </div>
          </div>
        </Link>
        <div style={{ marginTop: 6, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-sidebar-subtle)', textAlign: 'center' }}>
          Meritage Partners HR OS v1.0
        </div>
      </div>
    </nav>
  );
}

function fmt(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}
