'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { AR_INVOICES, type ArInvoice } from '@/lib/data/finance-extras';

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

const STATUS_STYLE: Record<ArInvoice['status'], { bg: string; fg: string; label: string }> = {
  current:    { bg: '#DCF2E4', fg: '#165E36', label: 'Current' },
  overdue:    { bg: '#FFF0D9', fg: '#8A5A0F', label: 'Overdue' },
  disputed:   { bg: '#F3E3F7', fg: '#6A1A7A', label: 'Disputed' },
  collection: { bg: '#FBE0DE', fg: '#8A1C16', label: 'Collections' },
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

export default function ArAgingPage() {
  const [filter, setFilter] = useState<'all' | 'overdue' | 'disputed' | 'collection'>('all');

  const totals = useMemo(() => {
    const base = { current: 0, '1-30': 0, '31-60': 0, '61-90': 0, '>90': 0 } as Record<Bucket, number>;
    AR_INVOICES.forEach((inv) => (base[bucketOf(inv.daysOverdue)] += inv.amount));
    return base;
  }, []);

  const byCustomer = useMemo(() => {
    const map = new Map<string, { total: number; overdue: number }>();
    AR_INVOICES.forEach((inv) => {
      const m = map.get(inv.customer) ?? { total: 0, overdue: 0 };
      m.total += inv.amount;
      if (inv.daysOverdue > 0) m.overdue += inv.amount;
      map.set(inv.customer, m);
    });
    return Array.from(map.entries())
      .map(([customer, v]) => ({ customer, ...v }))
      .sort((a, b) => b.total - a.total);
  }, []);

  const rows = useMemo(
    () => (filter === 'all' ? AR_INVOICES : AR_INVOICES.filter((i) => i.status === filter)).slice().sort((a, b) => b.daysOverdue - a.daysOverdue),
    [filter]
  );

  const totalAr = Object.values(totals).reduce((s, v) => s + v, 0);
  const overdueAr = totals['1-30'] + totals['31-60'] + totals['61-90'] + totals['>90'];
  const collectionCount = AR_INVOICES.filter((i) => i.status === 'collection').length;
  const disputedTotal = AR_INVOICES.filter((i) => i.status === 'disputed').reduce((s, i) => s + i.amount, 0);
  const dso = 42;

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
        &middot; AR Aging
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
          Accounts Receivable Aging
        </h1>
        <div style={{ color: 'var(--color-muted)', fontSize: 14 }}>
          {AR_INVOICES.length} open invoices &middot; {fmt$(totalAr)} outstanding &middot; {fmt$(overdueAr)} past due
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Total AR', value: fmt$(totalAr), sub: `${AR_INVOICES.length} invoices` },
          { label: 'Overdue', value: fmt$(overdueAr), sub: `${Math.round((overdueAr / totalAr) * 100)}% of AR`, tone: 'warn' as const },
          { label: 'DSO (trailing 90d)', value: `${dso}d`, sub: 'target 35d', tone: (dso > 35 ? 'warn' : 'good') as 'warn' | 'good' },
          { label: 'In collections', value: String(collectionCount), sub: `${fmt$(disputedTotal)} also disputed`, tone: (collectionCount > 0 ? 'warn' : 'good') as 'warn' | 'good' },
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
                  {totalAr > 0 ? `${((amt / totalAr) * 100).toFixed(0)}% of AR` : '—'}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* By customer + filter table side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, marginTop: 20 }}>
        <Card>
          <SectionTitle>Top customers by AR</SectionTitle>
          <div style={{ display: 'grid', gap: 10 }}>
            {byCustomer.map((c) => (
              <div key={c.customer}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{c.customer}</div>
                  <div style={{ fontFamily: 'var(--font-condensed)', fontWeight: 700, fontSize: 13 }}>
                    {fmt$(c.total)}
                  </div>
                </div>
                <div style={{ height: 6, background: 'var(--color-surf2)', borderRadius: 3, display: 'flex', overflow: 'hidden' }}>
                  <div style={{ width: `${((c.total - c.overdue) / c.total) * 100}%`, background: '#165E36' }} />
                  <div style={{ width: `${(c.overdue / c.total) * 100}%`, background: '#8A1C16' }} />
                </div>
                {c.overdue > 0 && (
                  <div style={{ fontSize: 11, color: '#8A1C16', marginTop: 2, fontFamily: 'var(--font-condensed)' }}>
                    {fmt$(c.overdue)} overdue
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <SectionTitle>Invoices</SectionTitle>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['all', 'overdue', 'disputed', 'collection'] as const).map((f) => (
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
                <th style={{ padding: '8px 10px' }}>Customer</th>
                <th style={{ padding: '8px 10px', textAlign: 'right' }}>Days</th>
                <th style={{ padding: '8px 10px', textAlign: 'right' }}>Amount</th>
                <th style={{ padding: '8px 10px' }}>Status</th>
                <th style={{ padding: '8px 10px' }}>Owner</th>
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
                    <td style={{ padding: '10px 10px', fontWeight: 600 }}>{inv.customer}</td>
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
                    <td style={{ padding: '10px 10px', fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)' }}>
                      {inv.owner}
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
          <SectionTitle>Collection actions this week</SectionTitle>
          <div style={{ display: 'grid', gap: 12, fontSize: 14, lineHeight: 1.55 }}>
            <div>
              <strong>Nordstrom $48.2K is 55 days overdue — escalate.</strong> Second-demand letter goes out today; CFO-level call
              Thursday. This single invoice accounts for 11% of open AR and is pressuring covenant current-ratio.
            </div>
            <div>
              <strong>Fanatics $92.1K dispute — resolve by Friday.</strong> They're contesting a shortage claim from the March
              shipment. K. Sato has pulled the BOL and packing list; call scheduled for Wed 2pm with their AP lead.
            </div>
            <div>
              <strong>DSO at 42 days vs 35-day target.</strong> Concentrated in wholesale. Recommend offering 2/10 net 30 early-pay
              discount on next quarter's shipments to Nordstrom and Dick's — ROI positive above $3M/year volume with them.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
