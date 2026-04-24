'use client';

import Link from 'next/link';
import {
  CHARGEBACK_SNAPSHOT,
  CHARGEBACK_REASONS,
  CHARGEBACK_LIST,
  type Chargeback,
} from '@/lib/data/ops-extras';

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

const STATUS_STYLE: Record<Chargeback['status'], { bg: string; fg: string; label: string }> = {
  new:                    { bg: '#FDE2E0', fg: '#8A1C16', label: 'New' },
  'evidence-gathering':   { bg: '#FFF0D9', fg: '#8A5A0F', label: 'Gathering' },
  'evidence-submitted':   { bg: '#DCE9FF', fg: '#1B4DA8', label: 'Submitted' },
  won:                    { bg: '#DCF2E4', fg: '#165E36', label: 'Won' },
  lost:                   { bg: '#E9EDF3', fg: '#4A5464', label: 'Lost' },
  expired:                { bg: '#F4E4E3', fg: '#7A2420', label: 'Expired' },
};

export default function ChargebacksPage() {
  const s = CHARGEBACK_SNAPSHOT;

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
        <Link href="/ops" style={{ color: 'var(--color-muted)' }}>
          Ops OS
        </Link>{' '}
        &middot; Chargebacks
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
          Chargebacks & Disputes
        </h1>
        <div style={{ color: 'var(--color-muted)', fontSize: 14 }}>
          {s.openDisputes} open &middot; {s.winRate}% win rate &middot; {s.disputeRateBps}bps (industry:{' '}
          {s.industryBenchmarkBps}bps)
        </div>
      </header>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Open disputes', value: String(s.openDisputes), sub: `${s.mtdDisputes} opened MTD`, tone: 'warn' as const },
          { label: 'Win rate', value: `${s.winRate}%`, sub: 'trailing 90 days', tone: 'good' as const },
          { label: 'Lost revenue (MTD)', value: fmt$(s.mtdLost), sub: `${fmt$(s.mtdRecovered)} recovered`, tone: 'danger' as const },
          { label: 'Dispute rate', value: `${s.disputeRateBps}bps`, sub: `vs ${s.industryBenchmarkBps}bps benchmark`, tone: 'good' as const },
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
                color:
                  kpi.tone === 'good'
                    ? '#165E36'
                    : kpi.tone === 'warn'
                    ? '#8A5A0F'
                    : kpi.tone === 'danger'
                    ? '#8A1C16'
                    : 'var(--color-text)',
              }}
            >
              {kpi.value}
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 4 }}>{kpi.sub}</div>
          </Card>
        ))}
      </div>

      {/* Reason code breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <Card>
          <SectionTitle>Reason code mix</SectionTitle>
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
                <th style={{ padding: '8px 0' }}>Code</th>
                <th style={{ padding: '8px 0' }}>Reason</th>
                <th style={{ padding: '8px 0', textAlign: 'right' }}>Share</th>
                <th style={{ padding: '8px 0', textAlign: 'right' }}>Win rate</th>
              </tr>
            </thead>
            <tbody>
              {CHARGEBACK_REASONS.map((r) => (
                <tr key={r.code} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '10px 0', fontFamily: 'var(--font-condensed)', fontWeight: 700 }}>
                    {r.code}
                  </td>
                  <td style={{ padding: '10px 0' }}>{r.label}</td>
                  <td
                    style={{
                      padding: '10px 0',
                      textAlign: 'right',
                      fontFamily: 'var(--font-condensed)',
                      fontWeight: 700,
                    }}
                  >
                    {r.share}%
                  </td>
                  <td
                    style={{
                      padding: '10px 0',
                      textAlign: 'right',
                      fontFamily: 'var(--font-condensed)',
                      fontWeight: 700,
                      color: r.winRate >= 65 ? '#165E36' : r.winRate >= 50 ? '#8A5A0F' : '#8A1C16',
                    }}
                  >
                    {r.winRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card>
          <SectionTitle>What&apos;s driving disputes</SectionTitle>
          <div style={{ display: 'grid', gap: 12, fontSize: 13, lineHeight: 1.55 }}>
            <div>
              <strong>4855 — Goods not received (34%, 72% win).</strong> These are largely &quot;lost in transit&quot;
              claims on UPS Ground to CA/TX. We win when we have delivery scan + GPS geotag. Auto-attach both to
              evidence bundle.
            </div>
            <div>
              <strong>4837 — Fraud / no auth (28%, 41% win).</strong> These are expensive. Evaluate signals (new
              card, mismatched BIN, high-value first-order) <em>before</em> shipping — the real fight is prevention,
              not rebuttal.
            </div>
            <div>
              <strong>4834 — Duplicate processing (6%, 88% win).</strong> Highest win rate, clean evidence trail.
              These are gifts — always respond.
            </div>
          </div>
        </Card>
      </div>

      {/* Open disputes table */}
      <Card>
        <SectionTitle>Open disputes</SectionTitle>
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
              <th style={{ padding: '8px 10px' }}>CB #</th>
              <th style={{ padding: '8px 10px' }}>Order</th>
              <th style={{ padding: '8px 10px' }}>Card</th>
              <th style={{ padding: '8px 10px', textAlign: 'right' }}>Amount</th>
              <th style={{ padding: '8px 10px' }}>Reason</th>
              <th style={{ padding: '8px 10px' }}>Opened</th>
              <th style={{ padding: '8px 10px' }}>Due by</th>
              <th style={{ padding: '8px 10px' }}>Status</th>
              <th style={{ padding: '8px 10px' }}>Owner</th>
            </tr>
          </thead>
          <tbody>
            {CHARGEBACK_LIST.map((cb) => {
              const s = STATUS_STYLE[cb.status];
              const urgent = ['new', 'evidence-gathering'].includes(cb.status);
              return (
                <tr
                  key={cb.id}
                  style={{
                    borderBottom: '1px solid var(--color-border)',
                    background: urgent ? 'rgba(27, 77, 230, 0.03)' : 'transparent',
                  }}
                >
                  <td style={{ padding: '12px 10px', fontFamily: 'var(--font-condensed)', fontWeight: 700 }}>
                    {cb.id}
                  </td>
                  <td style={{ padding: '12px 10px', fontFamily: 'var(--font-condensed)', fontSize: 12 }}>
                    {cb.orderId}
                  </td>
                  <td style={{ padding: '12px 10px', fontFamily: 'var(--font-condensed)' }}>{cb.customer}</td>
                  <td
                    style={{
                      padding: '12px 10px',
                      textAlign: 'right',
                      fontFamily: 'var(--font-condensed)',
                      fontWeight: 700,
                    }}
                  >
                    {fmt$(cb.amount)}
                  </td>
                  <td style={{ padding: '12px 10px', fontSize: 12 }}>
                    <div style={{ fontFamily: 'var(--font-condensed)', fontWeight: 700 }}>{cb.reasonCode}</div>
                    <div style={{ color: 'var(--color-muted)', fontSize: 11 }}>{cb.reasonLabel}</div>
                  </td>
                  <td style={{ padding: '12px 10px', fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)' }}>
                    {cb.openedAt}
                  </td>
                  <td
                    style={{
                      padding: '12px 10px',
                      fontFamily: 'var(--font-condensed)',
                      fontWeight: 700,
                      color: urgent ? '#8A1C16' : 'var(--color-text)',
                    }}
                  >
                    {cb.dueBy}
                  </td>
                  <td style={{ padding: '12px 10px' }}>
                    <span
                      style={{
                        background: s.bg,
                        color: s.fg,
                        padding: '3px 10px',
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {s.label}
                    </span>
                  </td>
                  <td style={{ padding: '12px 10px', fontSize: 12, color: 'var(--color-muted)' }}>
                    {cb.assignee}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
