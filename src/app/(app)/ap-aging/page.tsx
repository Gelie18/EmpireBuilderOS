'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { AP_INVOICES, type ApInvoice } from '@/lib/data/finance-extras';

const fmt$ = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(1)}K` : `$${n.toLocaleString()}`;

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

const STATUS_STYLE: Record<ApInvoice['status'], { bg: string; fg: string; label: string }> = {
  overdue:   { bg: '#FBE0DE', fg: '#8A1C16', label: 'Overdue' },
  scheduled: { bg: '#E3F0FC', fg: '#1B4DA8', label: 'Scheduled' },
  'on-hold': { bg: '#FFF0D9', fg: '#8A5A0F', label: 'On hold' },
  paid:      { bg: '#DCF2E4', fg: '#165E36', label: 'Paid' },
};

type Bucket = 'current' | '1-30' | '31-60' | '61-90' | '>90';

function bucketOf(days: number): Bucket {
  if (days <= 0) return 'current';
  if (days <= 30) return '1-30';
  if (days <= 60) return '31-60';
  if (days <= 90) return '61-90';
  return '>90';
}

const BUCKET_ORDER: Bucket[] = ['current', '1-30', '31-60', '61-90', '>90'];

export default function ApAgingPage() {
  const [filter, setFilter] = useState<'all' | 'overdue' | 'scheduled' | 'on-hold'>('all');

  const totals = useMemo(() => {
    const base = { current: 0, '1-30': 0, '31-60': 0, '61-90': 0, '>90': 0 } as Record<Bucket, number>;
    AP_INVOICES.forEach((inv) => (base[bucketOf(inv.daysOverdue)] += inv.amount));
    return base;
  }, []);

  const rows = useMemo(
    () => (filter === 'all' ? AP_INVOICES : AP_INVOICES.filter((i) => i.status === filter)).slice().sort((a, b) => b.daysOverdue - a.daysOverdue),
    [filter]
  );

  const totalOwed = Object.values(totals).reduce((s, v) => s + v, 0);
  const overdueTotal = totals['1-30'] + totals['31-60'] + totals['61-90'] + totals['>90'];
  const overdueCount = AP_INVOICES.filter((i) => i.status === 'overdue').length;
  const dueThis7Days = AP_INVOICES.filter((i) => i.status === 'scheduled' && i.daysOverdue >= -7 && i.daysOverdue <= 0).length;

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
        <Link href="/dashboard" style={{ color: 'var(--color-muted)' }}>
          Finance
        </Link>{' '}
        &middot; AP Aging
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
          Accounts Payable Aging
        </h1>
        <div style={{ color: 'var(--color-muted)', fontSize: 14 }}>
          {AP_INVOICES.length} open invoices &middot; {fmt$(totalOwed)} total owed &middot; {overdueCount} overdue ({fmt$(overdueTotal)})
        </div>
      </header>

      {/* KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Total AP open', value: fmt$(totalOwed), sub: `${AP_INVOICES.length} invoices` },
          { label: 'Overdue balance', value: fmt$(overdueTotal), sub: `${overdueCount} invoices`, tone: (overdueCount > 0 ? 'warn' : 'good') as 'warn' | 'good' },
          { label: 'Due this week', value: String(dueThis7Days), sub: 'scheduled' },
          { label: 'Top vendor share', value: '32%', sub: 'Pacific Textile Mills', tone: 'warn' as const },
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

      {/* Aging buckets */}
      <Card>
        <SectionTitle>Aging buckets</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
          {BUCKET_ORDER.map((b) => {
            const amt = totals[b];
            const color =
              b === 'current' ? '#165E36' :
              b === '1-30'    ? '#8A5A0F' :
              b === '31-60'   ? '#B85C00' :
              b === '61-90'   ? '#8A1C16' : '#5A0F0C';
            return (
              <div
                key={b}
                style={{
                  padding: 14,
                  background: 'var(--color-surf2)',
                  borderRadius: 8,
                  borderTop: `3px solid ${color}`,
                }}
              >
                <div style={{ fontFamily: 'var(--font-condensed)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-muted)', fontWeight: 700 }}>
                  {b === 'current' ? 'Current (not yet due)' : `${b} days overdue`}
                </div>
                <div style={{ fontSize: 22, fontWeight: 900, marginTop: 4, fontFamily: 'var(--font-condensed)', color }}>
                  {fmt$(amt)}
                </div>
                <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 2, fontFamily: 'var(--font-condensed)' }}>
                  {totalOwed > 0 ? `${((amt / totalOwed) * 100).toFixed(0)}% of AP` : '—'}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Filter + table */}
      <div style={{ marginTop: 20 }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <SectionTitle>Invoices</SectionTitle>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['all', 'overdue', 'scheduled', 'on-hold'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: 6,
                    fontFamily: 'var(--font-condensed)',
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    background: filter === f ? 'var(--color-text)' : 'var(--color-surf2)',
                    color: filter === f ? 'var(--color-surf)' : 'var(--color-muted)',
                    border: '1px solid var(--color-border)',
                    cursor: 'pointer',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr
                style={{
                  textAlign: 'left',
                  fontFamily: 'var(--font-condensed)',
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--color-muted)',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <th style={{ padding: '8px 10px' }}>Invoice</th>
                <th style={{ padding: '8px 10px' }}>Vendor</th>
                <th style={{ padding: '8px 10px' }}>Category</th>
                <th style={{ padding: '8px 10px' }}>Due</th>
                <th style={{ padding: '8px 10px', textAlign: 'right' }}>Days over</th>
                <th style={{ padding: '8px 10px', textAlign: 'right' }}>Amount</th>
                <th style={{ padding: '8px 10px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((inv) => {
                const s = STATUS_STYLE[inv.status];
                return (
                  <tr
                    key={inv.id}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      background: inv.daysOverdue > 30 ? 'rgba(27, 77, 230, 0.04)' : undefined,
                    }}
                  >
                    <td style={{ padding: '10px 10px', fontFamily: 'var(--font-condensed)', fontWeight: 700 }}>
                      {inv.id}
                    </td>
                    <td style={{ padding: '10px 10px', fontWeight: 600 }}>
                      {inv.vendor}
                      {inv.po && (
                        <span style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-condensed)', fontSize: 11, marginLeft: 6 }}>
                          · {inv.po}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '10px 10px', fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)' }}>
                      {inv.category}
                    </td>
                    <td style={{ padding: '10px 10px', fontFamily: 'var(--font-condensed)' }}>
                      {inv.dueDate}
                    </td>
                    <td
                      style={{
                        padding: '10px 10px',
                        textAlign: 'right',
                        fontFamily: 'var(--font-condensed)',
                        fontWeight: 700,
                        color: inv.daysOverdue > 30 ? '#8A1C16' : inv.daysOverdue > 0 ? '#8A5A0F' : 'var(--color-muted)',
                      }}
                    >
                      {inv.daysOverdue > 0 ? `+${inv.daysOverdue}d` : '—'}
                    </td>
                    <td style={{ padding: '10px 10px', textAlign: 'right', fontFamily: 'var(--font-condensed)', fontWeight: 700 }}>
                      {fmt$(inv.amount)}
                    </td>
                    <td style={{ padding: '10px 10px' }}>
                      <span
                        style={{
                          background: s.bg,
                          color: s.fg,
                          padding: '3px 10px',
                          borderRadius: 999,
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {s.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </div>

      <div style={{ marginTop: 20 }}>
        <Card>
          <SectionTitle>Recommended actions</SectionTitle>
          <div style={{ display: 'grid', gap: 12, fontSize: 14, lineHeight: 1.55 }}>
            <div>
              <strong>Pay Pacific Textile Mills this week.</strong> $84.2K is 21d overdue and they're our strategic fabric supplier —
              delaying further risks Q3 pre-season shipments. Approved for wire today.
            </div>
            <div>
              <strong>Negotiate Atlanta Warehouse terms.</strong> Invoice is 14d overdue and we've been 30+ days late 3 months running.
              Offer Net-45 swap for 0.5% discount instead of continuing to pay late.
            </div>
            <div>
              <strong>Ironclad Legal on hold is intentional</strong> — waiting on engagement letter cleanup. Release by Friday.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
