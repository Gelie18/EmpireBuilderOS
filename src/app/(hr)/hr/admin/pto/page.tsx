'use client';

import Link from 'next/link';
import { PTO_SUMMARY, PTO_EVENTS, type PtoEvent } from '@/lib/data/hr-data';

function Card({ children }: { children: React.ReactNode }) {
  return (
    <section
      style={{
        background: 'var(--color-surf)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--card-radius)',
        boxShadow: 'var(--card-shadow)',
        padding: 20,
      }}
    >
      {children}
    </section>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: 'var(--font-condensed)',
        fontSize: 14,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--color-muted)',
        margin: '0 0 16px 0',
      }}
    >
      {children}
    </h2>
  );
}

const TYPE_COLOR: Record<PtoEvent['type'], { bg: string; fg: string; label: string }> = {
  pto:         { bg: '#E3F0FC', fg: '#1B4DA8', label: 'PTO' },
  sick:        { bg: '#FFF0D9', fg: '#8A5A0F', label: 'Sick' },
  parental:    { bg: '#F3E3F7', fg: '#6A1A7A', label: 'Parental' },
  bereavement: { bg: '#E9EDF3', fg: '#4A5464', label: 'Bereavement' },
};

const STATUS_COLOR: Record<PtoEvent['status'], { bg: string; fg: string }> = {
  approved: { bg: '#DCF2E4', fg: '#165E36' },
  pending:  { bg: '#FFF0D9', fg: '#8A5A0F' },
};

export default function PtoPage() {
  const p = PTO_SUMMARY;

  return (
    <div style={{ padding: '24px 28px 60px', maxWidth: 1400, margin: '0 auto' }}>
      <div
        style={{
          fontSize: 12,
          color: 'var(--color-muted)',
          marginBottom: 8,
          fontFamily: 'var(--font-condensed)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        <Link href="/hr/admin/dashboard" style={{ color: 'var(--color-muted)' }}>
          HR Admin
        </Link>{' '}
        &middot; PTO
      </div>

      <header style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 900,
            letterSpacing: '-0.01em',
            textTransform: 'uppercase',
            margin: '0 0 6px 0',
            lineHeight: 1.05,
          }}
        >
          PTO Calendar & Balances
        </h1>
        <div style={{ color: 'var(--color-muted)', fontSize: 14 }}>
          {p.currentOnPto} out today &middot; {p.upcomingNext14Days} upcoming in next 14 days &middot;{' '}
          {p.pendingApprovals} pending approval
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Out today', value: String(p.currentOnPto), sub: 'Org coverage unaffected' },
          { label: 'Upcoming (14d)', value: String(p.upcomingNext14Days), sub: `${p.pendingApprovals} need approval`, tone: (p.pendingApprovals > 0 ? 'warn' : 'good') as 'warn' | 'good' },
          { label: 'Avg balance (days)', value: `${p.avgBalanceDays}`, sub: `of ${p.policyDaysPerYear} policy` },
          { label: 'Accrued YTD (days)', value: `${p.avgAccruedThisYear}`, sub: '~30% thru year' },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <div
              style={{
                fontFamily: 'var(--font-condensed)',
                fontSize: 11,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-muted)',
              }}
            >
              {kpi.label}
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 900,
                marginTop: 4,
                color: kpi.tone === 'good' ? '#165E36' : kpi.tone === 'warn' ? '#8A5A0F' : 'var(--color-text)',
              }}
            >
              {kpi.value}
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 4 }}>{kpi.sub}</div>
          </Card>
        ))}
      </div>

      {/* Calendar gantt-style */}
      <Card>
        <SectionTitle>Time off calendar · next 30 days</SectionTitle>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '220px 1fr',
            gap: 6,
            fontSize: 12,
          }}
        >
          {/* Header — 30 days */}
          <div></div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(30, 1fr)',
              gap: 2,
              borderBottom: '1px solid var(--color-border)',
              paddingBottom: 6,
              marginBottom: 8,
            }}
          >
            {Array.from({ length: 30 }).map((_, i) => {
              const day = 22 + i;
              const month = day > 30 ? 'May' : 'Apr';
              const displayDay = day > 30 ? day - 30 : day;
              return (
                <div
                  key={i}
                  style={{
                    fontFamily: 'var(--font-condensed)',
                    fontSize: 10,
                    textAlign: 'center',
                    color: 'var(--color-muted)',
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{displayDay}</div>
                  <div style={{ fontSize: 8 }}>{month}</div>
                </div>
              );
            })}
          </div>

          {PTO_EVENTS.map((e) => {
            const startDay = parseInt(e.start.split(' ')[1]);
            const startMonth = e.start.split(' ')[0];
            const startIdx = startMonth === 'Apr' ? startDay - 22 : startDay - 22 + 30;
            const leftPct = (Math.max(0, startIdx) / 30) * 100;
            const widthPct = Math.min(30 - Math.max(0, startIdx), e.days) / 30 * 100;
            const type = TYPE_COLOR[e.type];
            const statusC = STATUS_COLOR[e.status];
            return (
              <div key={e.employeeId + e.start} style={{ display: 'contents' }}>
                <div
                  style={{
                    fontSize: 12,
                    padding: '6px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{e.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--color-muted)', fontFamily: 'var(--font-condensed)' }}>
                      {e.dept} · {e.days}d
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    position: 'relative',
                    height: 28,
                    background: 'var(--color-surf2)',
                    borderRadius: 4,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: `${leftPct}%`,
                      width: `${widthPct}%`,
                      top: 3,
                      bottom: 3,
                      background: type.bg,
                      border: `1px solid ${type.fg}40`,
                      borderLeft: `3px solid ${type.fg}`,
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '0 8px',
                      fontFamily: 'var(--font-condensed)',
                      fontSize: 10,
                      fontWeight: 700,
                      color: type.fg,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                    }}
                  >
                    <span>{type.label}</span>
                    {e.status === 'pending' && (
                      <span
                        style={{
                          background: statusC.bg,
                          color: statusC.fg,
                          padding: '1px 5px',
                          borderRadius: 2,
                          fontSize: 9,
                        }}
                      >
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
