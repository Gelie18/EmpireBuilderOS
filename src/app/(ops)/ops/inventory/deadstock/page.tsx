'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { DEADSTOCK_ITEMS, INVENTORY_SKUS } from '@/lib/data/inventory';

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

type Strategy = 'markdown' | 'bundle' | 'liquidate' | 'writeoff' | 'hold';

const STRATEGY_STYLE: Record<Strategy, { bg: string; fg: string; label: string }> = {
  markdown:  { bg: '#FFF0D9', fg: '#8A5A0F', label: 'Markdown' },
  bundle:    { bg: '#E3F0FC', fg: '#1B4DA8', label: 'Bundle' },
  liquidate: { bg: '#F4E4E3', fg: '#7A2420', label: 'Liquidate' },
  writeoff:  { bg: '#FDE2E0', fg: '#8A1C16', label: 'Write off' },
  hold:      { bg: '#E9EDF3', fg: '#4A5464', label: 'Hold' },
};

export default function DeadstockConsolePage() {
  const [strategies, setStrategies] = useState<Record<string, Strategy>>(() => ({
    'SSK-RAIN-GRN-L': 'liquidate',
    'SHUG-SOCK-3PK': 'bundle',
    'DDW-CAP-RED-OS': 'markdown',
  }));

  const rows = useMemo(() => {
    return DEADSTOCK_ITEMS.map((d) => {
      const sku = INVENTORY_SKUS.find((s) => s.sku === d.sku);
      const retailPrice = sku?.unitPrice ?? d.unitCost * 3;
      const grossRetailValue = d.qty * retailPrice;
      const strategy = strategies[d.sku] ?? 'markdown';
      const netRecovery =
        strategy === 'markdown'
          ? grossRetailValue * (1 - d.suggestedMarkdown / 100) * 0.7
          : strategy === 'bundle'
          ? grossRetailValue * 0.82 * 0.5
          : strategy === 'liquidate'
          ? d.estRecovery
          : strategy === 'writeoff'
          ? 0
          : d.bookValue;
      const gain = netRecovery - d.bookValue;
      return { ...d, retailPrice, grossRetailValue, strategy, netRecovery, gain };
    });
  }, [strategies]);

  const totals = useMemo(() => {
    const bookValue = rows.reduce((s, r) => s + r.bookValue, 0);
    const estRecovery = rows.reduce((s, r) => s + r.netRecovery, 0);
    const cashFree = estRecovery;
    const gain = rows.reduce((s, r) => s + r.gain, 0);
    return { bookValue, estRecovery, cashFree, gain };
  }, [rows]);

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
        &middot; Deadstock Console
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
          Deadstock & Markdown Console
        </h1>
        <div style={{ color: 'var(--color-muted)', fontSize: 14 }}>
          {rows.length} SKUs &middot; {fmt$(totals.bookValue)} book value &middot; plan recovers{' '}
          <strong style={{ color: 'var(--color-green, #165E36)' }}>{fmt$(totals.estRecovery)}</strong>
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
          { label: 'Book value at risk', value: fmt$(totals.bookValue), sub: 'current balance sheet' },
          { label: 'Est. recovery (plan)', value: fmt$(totals.estRecovery), sub: 'net of promo / fees', tone: 'good' as const },
          { label: 'Cash freed', value: fmt$(totals.cashFree), sub: 'redeployable working capital', tone: 'good' as const },
          { label: 'Upside vs book', value: (totals.gain >= 0 ? '+' : '') + fmt$(totals.gain), sub: 'if plan executes', tone: (totals.gain >= 0 ? 'good' : 'danger') as 'good' | 'danger' },
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
                fontSize: 26,
                fontWeight: 900,
                marginTop: 4,
                color:
                  kpi.tone === 'good'
                    ? '#165E36'
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

      {/* Main table */}
      <Card>
        <SectionTitle>Markdown candidates</SectionTitle>
        <div style={{ overflowX: 'auto' }}>
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
                <th style={{ padding: '10px 12px' }}>SKU</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Qty</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Book value</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Days on hand</th>
                <th style={{ padding: '10px 12px' }}>Last sold</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Suggested discount</th>
                <th style={{ padding: '10px 12px' }}>Strategy</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Net recovery</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>vs book</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const strat = STRATEGY_STYLE[r.strategy];
                return (
                  <tr key={r.sku} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontFamily: 'var(--font-condensed)', fontSize: 12, fontWeight: 700 }}>
                        {r.sku}
                      </div>
                      <div style={{ color: 'var(--color-muted)', fontSize: 11 }}>{r.name}</div>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontFamily: 'var(--font-condensed)' }}>
                      {r.qty.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontFamily: 'var(--font-condensed)', fontWeight: 700 }}>
                      {fmt$(r.bookValue)}
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        textAlign: 'right',
                        fontFamily: 'var(--font-condensed)',
                        color: r.daysOnHand > 180 ? '#8A1C16' : '#8A5A0F',
                        fontWeight: 700,
                      }}
                    >
                      {r.daysOnHand}
                    </td>
                    <td style={{ padding: '12px', fontFamily: 'var(--font-condensed)', fontSize: 12 }}>
                      {r.lastSold}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontFamily: 'var(--font-condensed)', fontWeight: 700 }}>
                      {r.suggestedMarkdown}%
                    </td>
                    <td style={{ padding: '12px' }}>
                      <select
                        value={r.strategy}
                        onChange={(e) =>
                          setStrategies((prev) => ({
                            ...prev,
                            [r.sku]: e.target.value as Strategy,
                          }))
                        }
                        style={{
                          background: strat.bg,
                          color: strat.fg,
                          padding: '4px 10px',
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="markdown">Markdown</option>
                        <option value="bundle">Bundle</option>
                        <option value="liquidate">Liquidate</option>
                        <option value="writeoff">Write off</option>
                        <option value="hold">Hold</option>
                      </select>
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        textAlign: 'right',
                        fontFamily: 'var(--font-condensed)',
                        fontWeight: 700,
                        color: '#165E36',
                      }}
                    >
                      {fmt$(r.netRecovery)}
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        textAlign: 'right',
                        fontFamily: 'var(--font-condensed)',
                        fontWeight: 700,
                        color: r.gain >= 0 ? '#165E36' : '#8A1C16',
                      }}
                    >
                      {r.gain >= 0 ? '+' : ''}
                      {fmt$(r.gain)}
                    </td>
                  </tr>
                );
              })}
              <tr style={{ background: 'var(--color-surf2)', fontWeight: 900 }}>
                <td style={{ padding: '14px 12px', fontFamily: 'var(--font-condensed)', letterSpacing: '0.06em', textTransform: 'uppercase' }} colSpan={2}>
                  Plan totals
                </td>
                <td style={{ padding: '14px 12px', textAlign: 'right', fontFamily: 'var(--font-condensed)' }}>
                  {fmt$(totals.bookValue)}
                </td>
                <td colSpan={4}></td>
                <td style={{ padding: '14px 12px', textAlign: 'right', fontFamily: 'var(--font-condensed)', color: '#165E36' }}>
                  {fmt$(totals.estRecovery)}
                </td>
                <td
                  style={{
                    padding: '14px 12px',
                    textAlign: 'right',
                    fontFamily: 'var(--font-condensed)',
                    color: totals.gain >= 0 ? '#165E36' : '#8A1C16',
                  }}
                >
                  {totals.gain >= 0 ? '+' : ''}
                  {fmt$(totals.gain)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Strategy legend */}
      <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <SectionTitle>Strategy playbook</SectionTitle>
          <div style={{ display: 'grid', gap: 12, fontSize: 13, lineHeight: 1.5 }}>
            <div>
              <strong>Markdown</strong> — first-line tool. Drop retail price by 20–45%, hold units on-site, accept
              ~70% of marked price net of promo. Best when demand curve still exists.
            </div>
            <div>
              <strong>Bundle</strong> — pair slow SKU with a fast one (hoodie + socks). Recovers ~40–50% but clears
              velocity.
            </div>
            <div>
              <strong>Liquidate</strong> — sell the whole lot to a jobber/off-price. Lower $/unit, fastest exit,
              zero storage cost tail.
            </div>
            <div>
              <strong>Write off</strong> — donate + take the GAAP write-down. Zero recovery, but frees warehouse
              space and gives a tax basis.
            </div>
            <div>
              <strong>Hold</strong> — reserve the call for the merchandising team next cycle. Use sparingly — every
              month of hold costs storage + opportunity.
            </div>
          </div>
        </Card>

        <Card>
          <SectionTitle>Recommended action</SectionTitle>
          <div style={{ display: 'grid', gap: 10, fontSize: 14, lineHeight: 1.55 }}>
            <div>
              <strong>Liquidate SSK-RAIN-GRN-L.</strong> 256 days on hand, last sale April 12. Forest Green never paced —
              take the ~$59K jobber offer and move on. Holding longer likely ends in a full write-down.
            </div>
            <div>
              <strong>Bundle SHUG-SOCK-3PK with Z7 Tee restock.</strong> 28.6K units is 130 days of cover. 3-for-2
              promo drives tee attach rate and clears sock inventory across the Q3 retail cycle.
            </div>
            <div>
              <strong>Markdown DDW-CAP-RED-OS 20%.</strong> Crimson Range Cap still sells — moderate markdown holds
              gross margin above 55% and clears 60% of the excess in 45 days.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
