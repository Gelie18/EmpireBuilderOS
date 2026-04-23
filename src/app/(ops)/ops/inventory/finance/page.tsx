'use client';

import Link from 'next/link';
import {
  getInventoryFinanceTieIn,
  getInventoryRollup,
  INVENTORY_POS,
} from '@/lib/data/inventory';

const fmt$ = (n: number) =>
  n >= 1000
    ? `$${(n / 1000).toFixed(n >= 100_000 ? 0 : 1)}K`
    : `$${n.toLocaleString()}`;

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

export default function InventoryFinanceTieInPage() {
  const tie = getInventoryFinanceTieIn();
  const rollup = getInventoryRollup();

  return (
    <div style={{ padding: '24px 28px 60px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Breadcrumb */}
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
        <Link href="/ops/inventory" style={{ color: 'var(--color-muted)' }}>
          Inventory
        </Link>{' '}
        &middot; Finance Tie-in
      </div>

      {/* Header */}
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
          Inventory &rarr; Finance
        </h1>
        <div style={{ color: 'var(--color-muted)', fontSize: 14 }}>
          Reconciled daily &middot; ledger + perpetual system &middot; GL-grade
        </div>
      </header>

      {/* KPI strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 20,
        }}
      >
        {[
          {
            label: 'Balance sheet inventory',
            value: fmt$(tie.balanceSheetInventory),
            sub: `${fmt$(tie.rawOnHandValue)} on-hand + ${fmt$(tie.rawInTransitValue)} in-transit`,
          },
          { label: 'COGS (MTD)', value: fmt$(tie.cogsMTD), sub: `YTD ${fmt$(tie.cogsYTD)}` },
          { label: 'Inventory turns', value: `${tie.turns.toFixed(1)}x`, sub: 'annualized · apparel bench ~4x' },
          { label: 'Days inventory outstanding', value: `${tie.daysInventoryOutstanding} d`, sub: '365 / turns' },
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
            <div style={{ fontSize: 26, fontWeight: 900, marginTop: 4 }}>{kpi.value}</div>
            <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 4 }}>{kpi.sub}</div>
          </Card>
        ))}
      </div>

      {/* Balance sheet composition */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <Card>
          <SectionTitle>Balance sheet composition</SectionTitle>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <tbody>
              {[
                { label: 'Raw materials', value: 0, note: 'Finished-goods model — no raw inventory' },
                { label: 'WIP', value: 0, note: '' },
                { label: 'Finished goods (on-hand)', value: tie.rawOnHandValue, note: 'SLC + ATL + RNO' },
                { label: 'In-transit (goods on water)', value: tie.rawInTransitValue, note: 'PO-2042 · PO-2043 · PO-2045' },
                { label: 'Reserved for open orders', value: -28_400, note: 'Liability side — not removed from asset' },
              ].map((row) => (
                <tr key={row.label} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '10px 0', fontWeight: 600 }}>{row.label}</td>
                  <td
                    style={{
                      padding: '10px 0',
                      textAlign: 'right',
                      fontFamily: 'var(--font-condensed)',
                      fontWeight: 700,
                      color: row.value < 0 ? '#8A1C16' : row.value === 0 ? 'var(--color-muted)' : 'var(--color-text)',
                    }}
                  >
                    {row.value === 0 ? '—' : fmt$(Math.abs(row.value))}
                  </td>
                  <td
                    style={{
                      padding: '10px 0',
                      paddingLeft: 12,
                      color: 'var(--color-muted)',
                      fontSize: 12,
                      textAlign: 'right',
                      maxWidth: 200,
                    }}
                  >
                    {row.note}
                  </td>
                </tr>
              ))}
              <tr style={{ background: 'var(--color-surf2)', fontWeight: 900 }}>
                <td style={{ padding: '12px 10px', textTransform: 'uppercase', fontFamily: 'var(--font-condensed)', letterSpacing: '0.06em' }}>
                  Total inventory asset
                </td>
                <td style={{ padding: '12px 10px', textAlign: 'right', fontFamily: 'var(--font-condensed)' }}>
                  {fmt$(tie.balanceSheetInventory)}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </Card>

        <Card>
          <SectionTitle>MTD movements → P&amp;L</SectionTitle>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <tbody>
              {[
                { label: 'COGS — direct cost of sold units', value: tie.cogsMTD, sign: '-', account: 'COGS · 5000' },
                { label: 'Shrinkage (cycle count variance)', value: tie.shrinkageMTD, sign: '-', account: 'Inventory shrink · 5120' },
                { label: 'Write-offs (obsolete)', value: tie.writeOffsMTD, sign: '-', account: 'Inventory write-down · 5140' },
                { label: 'Returns — restocked', value: 1_320, sign: '+', account: 'Sales returns · 4100' },
              ].map((row) => (
                <tr key={row.label} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '10px 0', fontWeight: 600 }}>{row.label}</td>
                  <td
                    style={{
                      padding: '10px 0',
                      textAlign: 'right',
                      fontFamily: 'var(--font-condensed)',
                      fontWeight: 700,
                      color: row.sign === '-' ? '#8A1C16' : '#165E36',
                    }}
                  >
                    {row.sign}
                    {fmt$(row.value)}
                  </td>
                  <td
                    style={{
                      padding: '10px 0',
                      paddingLeft: 12,
                      color: 'var(--color-muted)',
                      fontSize: 11,
                      textAlign: 'right',
                      fontFamily: 'var(--font-condensed)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {row.account}
                  </td>
                </tr>
              ))}
              <tr style={{ background: 'var(--color-surf2)', fontWeight: 900 }}>
                <td style={{ padding: '12px 10px', textTransform: 'uppercase', fontFamily: 'var(--font-condensed)', letterSpacing: '0.06em' }}>
                  Net inventory-driven P&amp;L hit (MTD)
                </td>
                <td
                  style={{
                    padding: '12px 10px',
                    textAlign: 'right',
                    fontFamily: 'var(--font-condensed)',
                    color: '#8A1C16',
                  }}
                >
                  -{fmt$(tie.cogsMTD + tie.shrinkageMTD + tie.writeOffsMTD - 1_320)}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </Card>
      </div>

      {/* Cash commitments + metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 20, marginBottom: 20 }}>
        <Card>
          <SectionTitle>Open PO commitments (cash outflow schedule)</SectionTitle>
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
                <th style={{ padding: '8px 10px' }}>PO</th>
                <th style={{ padding: '8px 10px' }}>Supplier</th>
                <th style={{ padding: '8px 10px' }}>ETA</th>
                <th style={{ padding: '8px 10px', textAlign: 'right' }}>Amount</th>
                <th style={{ padding: '8px 10px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {INVENTORY_POS.filter((p) => ['sent', 'in-transit', 'late'].includes(p.status)).map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '10px', fontFamily: 'var(--font-condensed)', fontWeight: 700 }}>{p.id}</td>
                  <td style={{ padding: '10px' }}>{p.supplier}</td>
                  <td style={{ padding: '10px', fontFamily: 'var(--font-condensed)' }}>{p.expectedArrival}</td>
                  <td
                    style={{
                      padding: '10px',
                      textAlign: 'right',
                      fontFamily: 'var(--font-condensed)',
                      fontWeight: 700,
                    }}
                  >
                    {fmt$(p.total)}
                  </td>
                  <td
                    style={{
                      padding: '10px',
                      fontFamily: 'var(--font-condensed)',
                      fontSize: 11,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: p.status === 'late' ? '#8A1C16' : 'var(--color-muted)',
                      fontWeight: 700,
                    }}
                  >
                    {p.status}
                  </td>
                </tr>
              ))}
              <tr style={{ background: 'var(--color-surf2)', fontWeight: 900 }}>
                <td
                  style={{
                    padding: '12px 10px',
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-condensed)',
                    letterSpacing: '0.06em',
                  }}
                  colSpan={3}
                >
                  Committed cash (next 30 days)
                </td>
                <td style={{ padding: '12px 10px', textAlign: 'right', fontFamily: 'var(--font-condensed)' }}>
                  {fmt$(tie.openPoCommitments)}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
          <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 10 }}>
            &uarr; Feeds the <strong style={{ color: 'var(--color-text)' }}>13-week cash flow forecast</strong>{' '}
            automatically. Every PO status change re-shuffles expected cash outflows.
          </div>
        </Card>

        <Card>
          <SectionTitle>Inventory health metrics</SectionTitle>
          <div style={{ display: 'grid', gap: 14, fontSize: 13 }}>
            {[
              { label: 'Avg unit cost (blended)', value: `$${tie.avgUnitCost.toFixed(2)}`, note: 'On-hand $ / units' },
              { label: 'Turns (annualized)', value: `${tie.turns.toFixed(2)}x`, note: 'Benchmark: 4.0x apparel' },
              { label: 'Days inventory outstanding', value: `${tie.daysInventoryOutstanding} d`, note: '365 / turns' },
              { label: 'On-hand value at retail', value: fmt$(rollup.totalRetailValue), note: `Implied GMV if sold thru` },
              { label: 'Stockouts (SKUs)', value: String(rollup.stockouts), note: `$ lost sales tracked on SKU view`, tone: 'danger' as const },
              { label: 'Deadstock book value', value: fmt$(rollup.deadstockValue), note: 'At-risk for markdown/write-down', tone: 'warn' as const },
            ].map((row) => (
              <div
                key={row.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  borderBottom: '1px solid var(--color-border)',
                  paddingBottom: 10,
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{row.label}</div>
                  <div style={{ color: 'var(--color-muted)', fontSize: 11, marginTop: 2 }}>{row.note}</div>
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-condensed)',
                    fontWeight: 900,
                    fontSize: 18,
                    color:
                      row.tone === 'danger'
                        ? '#8A1C16'
                        : row.tone === 'warn'
                        ? '#8A5A0F'
                        : 'var(--color-text)',
                  }}
                >
                  {row.value}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* How it connects */}
      <Card>
        <SectionTitle>How inventory flows to the GL</SectionTitle>
        <div style={{ display: 'grid', gap: 12, fontSize: 14, lineHeight: 1.55 }}>
          <div>
            <strong>Every stock movement posts a journal entry.</strong> Receipts debit Inventory (1200), credit AP
            (2100). Sales debit COGS (5000), credit Inventory. Transfers net to zero (inter-location 1200s).
            Write-offs debit Inventory write-down (5140), credit Inventory. No manual keying.
          </div>
          <div>
            <strong>Nightly cycle count reconciles physical vs system.</strong> Variances post to shrinkage (5120)
            with the location, SKU, and operator attributed. Variance &gt; 0.5% of location $ triggers an audit alert
            to ops + finance.
          </div>
          <div>
            <strong>Month-end close is a formality, not a scramble.</strong> Because the ledger is live, the close
            process is confirming what&apos;s already been posted — no cutoff accrual surprises, no inventory mystery
            variance. Target close day: BD+2.
          </div>
        </div>
      </Card>
    </div>
  );
}
