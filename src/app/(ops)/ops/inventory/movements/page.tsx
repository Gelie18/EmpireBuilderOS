'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  INVENTORY_MOVEMENTS,
  INVENTORY_SKUS,
  type StockMovement,
} from '@/lib/data/inventory';

const TYPE_STYLE: Record<
  StockMovement['type'],
  { bg: string; fg: string; label: string }
> = {
  receipt:    { bg: '#DCF2E4', fg: '#165E36', label: 'Receipt' },
  sale:       { bg: '#E5EAF3', fg: '#4FA8FF', label: 'Sale' },
  transfer:   { bg: '#FFF0D9', fg: '#8A5A0F', label: 'Transfer' },
  adjustment: { bg: '#F4E4E3', fg: '#7A2420', label: 'Adjustment' },
  return:     { bg: '#E3F0FC', fg: '#1B4DA8', label: 'Return' },
  'write-off':{ bg: '#FDE2E0', fg: '#8A1C16', label: 'Write-off' },
};

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

const fmt = (n: number) => n.toLocaleString();

export default function StockMovementsPage() {
  const [typeFilter, setTypeFilter] = useState<'all' | StockMovement['type']>('all');
  const [locFilter, setLocFilter] = useState<'all' | string>('all');

  const skuName = (sku: string) =>
    INVENTORY_SKUS.find((s) => s.sku === sku)?.name ?? sku;

  const rows = useMemo(() => {
    return INVENTORY_MOVEMENTS.filter((m) => {
      if (typeFilter !== 'all' && m.type !== typeFilter) return false;
      if (locFilter !== 'all' && m.from !== locFilter && m.to !== locFilter) return false;
      return true;
    });
  }, [typeFilter, locFilter]);

  const mtdStats = useMemo(() => {
    const sale = INVENTORY_MOVEMENTS.filter((m) => m.type === 'sale').reduce((s, m) => s + Math.abs(m.qty), 0);
    const receipt = INVENTORY_MOVEMENTS.filter((m) => m.type === 'receipt').reduce((s, m) => s + m.qty, 0);
    const transfer = INVENTORY_MOVEMENTS.filter((m) => m.type === 'transfer').reduce((s, m) => s + Math.abs(m.qty), 0);
    const writeOff = INVENTORY_MOVEMENTS.filter((m) => m.type === 'write-off' || m.type === 'adjustment').reduce(
      (s, m) => s + Math.abs(m.qty),
      0,
    );
    const returns = INVENTORY_MOVEMENTS.filter((m) => m.type === 'return').reduce((s, m) => s + Math.abs(m.qty), 0);
    return { sale, receipt, transfer, writeOff, returns };
  }, []);

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
        &middot; Stock Movements
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
          Stock Movements
        </h1>
        <div style={{ color: 'var(--color-muted)', fontSize: 14 }}>
          Immutable ledger &middot; every unit in or out &middot; source of truth for COGS, shrink, and transfers
        </div>
      </header>

      {/* KPI strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 16,
          marginBottom: 20,
        }}
      >
        {[
          { label: 'Units sold', value: fmt(mtdStats.sale), sub: 'MTD' },
          { label: 'Units received', value: fmt(mtdStats.receipt), sub: 'from POs' },
          { label: 'Transfers', value: fmt(mtdStats.transfer), sub: 'inter-location' },
          { label: 'Returns', value: fmt(mtdStats.returns), sub: 'restocked' },
          { label: 'Adjustments + writeoffs', value: fmt(mtdStats.writeOff), sub: 'shrink / obsolete', tone: 'warn' as const },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <div
              style={{
                fontFamily: 'var(--font-condensed)',
                fontSize: 11,
                letterSpacing: '0.1em',
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
                color: kpi.tone === 'warn' ? '#8A5A0F' : 'var(--color-text)',
              }}
            >
              {kpi.value}
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 4 }}>{kpi.sub}</div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div
        style={{
          display: 'flex',
          gap: 16,
          alignItems: 'center',
          marginBottom: 16,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: 11,
              fontFamily: 'var(--font-condensed)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-muted)',
              alignSelf: 'center',
            }}
          >
            Type:
          </span>
          {(['all', 'sale', 'receipt', 'transfer', 'return', 'adjustment', 'write-off'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              style={{
                padding: '5px 12px',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                borderRadius: 999,
                border: '1px solid var(--color-border)',
                background: typeFilter === t ? 'var(--color-text)' : 'var(--color-surf)',
                color: typeFilter === t ? 'var(--color-surf)' : 'var(--color-text)',
                cursor: 'pointer',
              }}
            >
              {t === 'all' ? 'All' : t}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span
            style={{
              fontSize: 11,
              fontFamily: 'var(--font-condensed)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-muted)',
              alignSelf: 'center',
            }}
          >
            Location:
          </span>
          {(['all', 'SLC', 'ATL', 'RNO'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLocFilter(l)}
              style={{
                padding: '5px 12px',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                borderRadius: 999,
                border: '1px solid var(--color-border)',
                background: locFilter === l ? 'var(--color-text)' : 'var(--color-surf)',
                color: locFilter === l ? 'var(--color-surf)' : 'var(--color-text)',
                cursor: 'pointer',
              }}
            >
              {l === 'all' ? 'All' : l}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger */}
      <Card>
        <SectionTitle>
          Ledger &middot; {rows.length} {rows.length === 1 ? 'entry' : 'entries'}
        </SectionTitle>
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
                <th style={{ padding: '10px 12px' }}>Timestamp</th>
                <th style={{ padding: '10px 12px' }}>Type</th>
                <th style={{ padding: '10px 12px' }}>SKU</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Qty</th>
                <th style={{ padding: '10px 12px' }}>From &rarr; To</th>
                <th style={{ padding: '10px 12px' }}>Ref</th>
                <th style={{ padding: '10px 12px' }}>Actor</th>
                <th style={{ padding: '10px 12px' }}>Note</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((m) => {
                const ts = TYPE_STYLE[m.type];
                return (
                  <tr
                    key={m.id}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      background:
                        m.type === 'write-off' || m.type === 'adjustment'
                          ? 'rgba(27, 77, 230, 0.03)'
                          : 'transparent',
                    }}
                  >
                    <td
                      style={{
                        padding: '12px',
                        fontFamily: 'var(--font-condensed)',
                        fontSize: 12,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {m.ts}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          background: ts.bg,
                          color: ts.fg,
                          padding: '3px 10px',
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {ts.label}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontFamily: 'var(--font-condensed)', fontSize: 12, fontWeight: 700 }}>
                        {m.sku}
                      </div>
                      <div style={{ color: 'var(--color-muted)', fontSize: 11 }}>{skuName(m.sku)}</div>
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        textAlign: 'right',
                        fontFamily: 'var(--font-condensed)',
                        fontWeight: 700,
                        color: m.qty < 0 ? '#8A1C16' : '#165E36',
                      }}
                    >
                      {m.qty > 0 ? '+' : ''}
                      {m.qty.toLocaleString()}
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        fontFamily: 'var(--font-condensed)',
                        fontSize: 12,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {m.from ? (
                        <span style={{ color: 'var(--color-muted)' }}>{m.from}</span>
                      ) : (
                        <span style={{ color: 'var(--color-muted)' }}>—</span>
                      )}{' '}
                      {m.to && <>&rarr; <span>{m.to}</span></>}
                    </td>
                    <td style={{ padding: '12px', fontFamily: 'var(--font-condensed)', fontSize: 12 }}>
                      {m.ref ?? '—'}
                    </td>
                    <td style={{ padding: '12px', fontSize: 12, color: 'var(--color-muted)' }}>
                      {m.actor ?? '—'}
                    </td>
                    <td style={{ padding: '12px', fontSize: 12, color: 'var(--color-muted)' }}>
                      {m.note ?? ''}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Footer/reconciliation */}
      <div style={{ marginTop: 20 }}>
        <Card>
          <SectionTitle>Reconciliation trail</SectionTitle>
          <div style={{ display: 'grid', gap: 10, fontSize: 14, lineHeight: 1.55 }}>
            <div>
              Every row above is immutable once posted. Corrections require a new entry (reversal + repost), not an edit.
              That&apos;s how audit, cycle counts, and GL reconciliation stay honest.
            </div>
            <div style={{ color: 'var(--color-muted)', fontSize: 13 }}>
              Feeds daily: &nbsp;<strong style={{ color: 'var(--color-text)' }}>COGS journal</strong> &middot;{' '}
              <strong style={{ color: 'var(--color-text)' }}>inventory balance sheet value</strong> &middot;{' '}
              <strong style={{ color: 'var(--color-text)' }}>shrinkage report</strong> &middot;{' '}
              <strong style={{ color: 'var(--color-text)' }}>fulfillment SLA metrics</strong>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
