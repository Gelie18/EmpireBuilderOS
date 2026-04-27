'use client';

import { useState } from 'react';
import { getDemoPnlReport, getDemoAnomalies, DEMO_PNL_ROWS } from '@/lib/data/demo-data';
import AnomalyBanner from '@/components/dashboard/AnomalyBanner';
import type { PnlRow } from '@/lib/data/types';
import PeriodSelector, { type PeriodKey, PERIOD_OPTIONS } from '@/components/ui/PeriodSelector';

const GREEN  = '#0A8A5C';
const RED    = '#C13333';
const ORANGE = '#C27A10';
const BLUE   = '#1D44BF';

function fmt(n: number, compact = false): string {
  if (compact) {
    if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
    if (Math.abs(n) >= 1_000)     return `$${(Math.abs(n) / 1_000).toFixed(0)}K`;
  }
  return '$' + Math.abs(n).toLocaleString('en-US');
}

const CARD: React.CSSProperties = {
  background:   'var(--color-surf)',
  borderRadius: 'var(--card-radius)',
  boxShadow:    'var(--card-shadow)',
  border:       '1px solid var(--color-border)',
};

function PnlRowComponent({ row, inExpense, isOpen, onToggle }: {
  row: PnlRow; inExpense: boolean; isOpen: boolean; onToggle: () => void;
}) {
  const v        = row.varianceDollar ?? 0;
  const isSmall  = Math.abs(v) < 1500;
  const favorable = inExpense ? v < 0 : v > 0;
  const varColor  = isSmall ? ORANGE : favorable ? GREEN : RED;
  const isTotalish = row.type === 'total' || row.type === 'subtotal';
  const isTotal    = row.type === 'total';

  // ── Section header row ──
  if (row.type === 'section') {
    return (
      <tr>
        <td colSpan={4}
          style={{
            padding:       '14px 24px 10px',
            fontSize:      13,
            fontWeight:    800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontFamily:    'var(--font-condensed)',
            color:         'var(--color-muted)',
            background:    'var(--color-surf2)',
            borderBottom:  '1px solid var(--color-border)',
          }}>
          {row.label}
        </td>
      </tr>
    );
  }

  return (
    <>
      <tr
        onClick={() => row.aiNote && onToggle()}
        style={{
          borderBottom: `1px solid var(--color-border)`,
          borderTop:    isTotal ? '2px solid var(--color-border2)' : undefined,
          background:   isOpen ? 'rgba(65,182,230,0.05)' : isTotalish ? 'rgba(255,255,255,0.03)' : 'transparent',
          cursor:       row.aiNote ? 'pointer' : 'default',
          transition:   'background 0.15s',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(65,182,230,0.06)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = isOpen ? 'rgba(65,182,230,0.05)' : isTotalish ? 'rgba(255,255,255,0.03)' : 'transparent'; }}
      >
        {/* Label */}
        <td style={{
          padding:    isTotalish ? '16px 24px' : '14px 24px 14px 40px',
          fontSize:   isTotal ? 16 : isTotalish ? 15 : 15,
          fontWeight: isTotalish ? 800 : 500,
          color:      isTotalish ? 'var(--color-text)' : 'var(--color-muted)',
          fontFamily: isTotalish ? 'var(--font-condensed)' : 'var(--font-body)',
          letterSpacing: isTotalish ? '0.02em' : 0,
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {row.label}
            {row.isAnomaly && (
              <span style={{ fontSize: 11, fontWeight: 800, color: ORANGE, letterSpacing: '0.06em', fontFamily: 'var(--font-condensed)' }}>
                △ FLAGGED
              </span>
            )}
            {row.aiNote && !isOpen && (
              <span style={{ fontSize: 11, color: BLUE, opacity: 0.5, fontFamily: 'var(--font-condensed)' }}>▾ insight</span>
            )}
            {row.aiNote && isOpen && (
              <span style={{ fontSize: 11, color: BLUE, fontFamily: 'var(--font-condensed)' }}>▴ close</span>
            )}
          </span>
        </td>

        {/* Budget */}
        <td style={{
          padding:    '14px 24px',
          textAlign:  'right',
          fontSize:   15,
          fontWeight: isTotalish ? 700 : 400,
          color:      'var(--color-muted)',
          fontFamily: 'var(--font-condensed)',
          fontVariantNumeric: 'tabular-nums',
          whiteSpace: 'nowrap',
        }}>
          {row.budget != null ? fmt(row.budget) : ''}
        </td>

        {/* Actual */}
        <td style={{
          padding:    '14px 24px',
          textAlign:  'right',
          fontSize:   isTotal ? 18 : isTotalish ? 17 : 16,
          fontWeight: 800,
          color:      'var(--color-text)',
          fontFamily: 'var(--font-condensed)',
          fontVariantNumeric: 'tabular-nums',
          whiteSpace: 'nowrap',
        }}>
          {row.actual != null ? fmt(row.actual) : ''}
        </td>

        {/* Variance */}
        <td style={{ padding: '14px 24px', textAlign: 'right', whiteSpace: 'nowrap' }}>
          {row.varianceDollar != null && (
            <span style={{
              display:       'inline-flex',
              alignItems:    'center',
              gap:           6,
              padding:       '4px 12px',
              borderRadius:  6,
              background:    varColor + '18',
              color:         varColor,
              fontFamily:    'var(--font-condensed)',
              fontSize:      14,
              fontWeight:    800,
              letterSpacing: '0.03em',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {v >= 0 ? '+' : '–'}{fmt(Math.abs(v), true)}
              <span style={{ fontSize: 12, opacity: 0.8 }}>
                ({v >= 0 ? '+' : ''}{row.variancePercent?.toFixed(1)}%)
              </span>
            </span>
          )}
        </td>
      </tr>

      {/* AI Insight row */}
      {row.aiNote && isOpen && (
        <tr>
          <td colSpan={4} style={{
            padding:    '16px 24px 16px 40px',
            background: 'rgba(65,182,230,0.05)',
            borderBottom: '1px solid var(--color-border)',
            borderLeft:   `3px solid ${BLUE}`,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: BLUE, fontFamily: 'var(--font-condensed)', marginBottom: 6 }}>
              AI CFO Analysis
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--color-muted)' }}>
              {row.aiNote}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ── Period-aware summary numbers ──
const PERIOD_S: Record<PeriodKey, {
  revActual: number; revBudget: number; revVar: number; revVarPct: number;
  gpActual: number;  gpBudget: number;  gpVar: number;  gpVarPct: number;
  opActual: number;  opBudget: number;  opVar: number;  opVarPct: number;
  niActual: number;  niBudget: number;  niVar: number;  niVarPct: number;
}> = {
  current: { revActual: 1_311_600, revBudget: 1_270_000, revVar: 41_600,    revVarPct: 3.3,  gpActual: 591_300,   gpBudget: 552_200,   gpVar: 39_100,    gpVarPct: 7.1,  opActual: 130_600,   opBudget: 139_800,   opVar: -9_200,    opVarPct: -6.6,  niActual: 71_400,   niBudget: 109_200,   niVar: -37_800,   niVarPct: -34.6 },
  last:    { revActual: 1_272_100, revBudget: 1_248_000, revVar: 24_100,    revVarPct: 1.9,  gpActual: 570_200,   gpBudget: 552_000,   gpVar: 18_200,    gpVarPct: 3.3,  opActual: 142_300,   opBudget: 138_000,   opVar:  4_300,    opVarPct:  3.1,  niActual: 108_400,  niBudget: 105_000,   niVar: 3_400,     niVarPct: 3.2  },
  last3:   { revActual: 3_821_400, revBudget: 3_720_000, revVar: 101_400,   revVarPct: 2.7,  gpActual: 1_718_200, gpBudget: 1_648_000, gpVar: 70_200,    gpVarPct: 4.3,  opActual: 392_100,   opBudget: 420_000,   opVar: -27_900,   opVarPct: -6.6,  niActual: 247_300,  niBudget: 310_000,   niVar: -62_700,   niVarPct: -20.2 },
  ytd:     { revActual: 12_847_000, revBudget: 12_600_000, revVar: 247_000, revVarPct: 2.0,  gpActual: 5_781_000, gpBudget: 5_600_000, gpVar: 181_000,   gpVarPct: 3.2,  opActual: 1_312_000, opBudget: 1_400_000, opVar: -88_000,   opVarPct: -6.3,  niActual: 847_200,  niBudget: 1_020_000, niVar: -172_800,  niVarPct: -16.9 },
  last12:  { revActual: 15_642_000, revBudget: 15_200_000, revVar: 442_000, revVarPct: 2.9,  gpActual: 7_038_900, gpBudget: 6_840_000, gpVar: 198_900,   gpVarPct: 2.9,  opActual: 1_571_200, opBudget: 1_700_000, opVar: -128_800,  opVarPct: -7.6,  niActual: 1_124_000, niBudget: 1_250_000, niVar: -126_000, niVarPct: -10.1 },
};

export default function PnlPage() {
  const anomalies   = getDemoAnomalies();
  const [openNotes, setOpenNotes] = useState<Set<string>>(new Set());
  const [period, setPeriod] = useState<PeriodKey>('current');
  const S = PERIOD_S[period];
  const toggle = (id: string) =>
    setOpenNotes((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  let inExpense = false;

  return (
    <div className="flex flex-col gap-5">

      {/* ── Header ── */}
      <div style={{ ...CARD, padding: '24px 28px' }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-muted)', fontFamily: 'var(--font-condensed)', marginBottom: 4 }}>
            Profit & Loss
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: '0.02em', fontFamily: 'var(--font-condensed)', color: 'var(--color-text)', lineHeight: 1 }}>
              P&amp;L Report
            </div>
            <PeriodSelector value={period} onChange={setPeriod} />
          </div>
          <div style={{ fontSize: 14, marginTop: 6, color: 'var(--color-muted)' }}>
            Budget vs Actuals · Click any row for AI analysis
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ background: 'var(--color-blue-d)', border: '1px solid var(--color-border2)', borderRadius: 8, padding: '8px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-muted)', fontFamily: 'var(--font-condensed)', marginBottom: 2 }}>Net Income</div>
            <div style={{ fontSize: 22, fontWeight: 900, fontFamily: 'var(--font-condensed)', color: RED }}>{fmt(S.niActual, true)}</div>
            <div style={{ fontSize: 12, color: RED, fontFamily: 'var(--font-condensed)', fontWeight: 700 }}>–$37.8K vs plan</div>
          </div>
          <div style={{ background: 'var(--color-green-d)', border: '1px solid rgba(34,217,122,0.2)', borderRadius: 8, padding: '8px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-muted)', fontFamily: 'var(--font-condensed)', marginBottom: 2 }}>Gross Margin</div>
            <div style={{ fontSize: 22, fontWeight: 900, fontFamily: 'var(--font-condensed)', color: GREEN }}>45.1%</div>
            <div style={{ fontSize: 12, color: GREEN, fontFamily: 'var(--font-condensed)', fontWeight: 700 }}>+0.4pp vs plan</div>
          </div>
        </div>
      </div>

      {/* ── Flags ── */}
      <AnomalyBanner anomalies={anomalies} />

      {/* ── KPI row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Revenue',     actual: S.revActual, budget: S.revBudget, var$: S.revVar,  varPct: S.revVarPct,  fav: true  },
          { label: 'Gross Profit',actual: S.gpActual,  budget: S.gpBudget,  var$: S.gpVar,   varPct: S.gpVarPct,   fav: true  },
          { label: 'Op. Income',  actual: S.opActual,  budget: S.opBudget,  var$: S.opVar,   varPct: S.opVarPct,   fav: false },
          { label: 'Net Income',  actual: S.niActual,  budget: S.niBudget,  var$: S.niVar,   varPct: S.niVarPct,   fav: false },
        ].map((c) => {
          const good  = c.fav ? c.var$ > 0 : c.var$ < 0;
          const color = Math.abs(c.var$) < 2000 ? ORANGE : good ? GREEN : RED;
          return (
            <div key={c.label} style={{ ...CARD, padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color, opacity: 0.7 }} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-muted)', fontFamily: 'var(--font-condensed)', marginBottom: 8, marginTop: 4 }}>
                  {c.label}
                </div>
                <div style={{ fontSize: 28, fontWeight: 900, lineHeight: 1, color: 'var(--color-text)', fontFamily: 'var(--font-condensed)', fontVariantNumeric: 'tabular-nums' }}>
                  {fmt(c.actual, true)}
                </div>
                <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 4, marginBottom: 8 }}>
                  Plan {fmt(c.budget, true)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color, fontFamily: 'var(--font-condensed)', fontVariantNumeric: 'tabular-nums' }}>
                    {c.var$ >= 0 ? '+' : '–'}{fmt(Math.abs(c.var$), true)}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: color + '20', color, fontFamily: 'var(--font-condensed)' }}>
                    {c.varPct >= 0 ? '+' : ''}{c.varPct.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── P&L Table ── */}
      <div style={{ ...CARD, overflow: 'hidden', padding: 0 }}>
        {/* Table header */}
        <div style={{
          display:       'flex',
          alignItems:    'center',
          justifyContent:'space-between',
          padding:       '16px 24px',
          background:    'var(--color-surf2)',
          borderBottom:  '1px solid var(--color-border)',
        }}>
          <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-condensed)', color: 'var(--color-text)' }}>
            Detailed P&L — {PERIOD_OPTIONS.find((p) => p.key === period)?.sublabel}
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>
            Click any row for AI analysis
          </div>
        </div>

        <div className="overflow-x-auto">
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                {[
                  { label: 'Line Item',   align: 'left'  as const },
                  { label: 'Budget',      align: 'right' as const },
                  { label: 'Actual',      align: 'right' as const },
                  { label: 'vs Plan',     align: 'right' as const },
                ].map((h) => (
                  <th key={h.label} style={{
                    padding:       '14px 24px',
                    textAlign:     h.align,
                    fontSize:      12,
                    fontWeight:    800,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontFamily:    'var(--font-condensed)',
                    color:         'var(--color-muted)',
                    background:    'var(--color-surf2)',
                  }}>
                    {h.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEMO_PNL_ROWS.map((row) => {
                if (row.type === 'section') inExpense = row.label === 'Operating Expenses';
                return (
                  <PnlRowComponent
                    key={row.id}
                    row={row}
                    inExpense={inExpense}
                    isOpen={openNotes.has(row.id)}
                    onToggle={() => toggle(row.id)}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── CFO Takeaways ── */}
      <div style={{ ...CARD, padding: '24px 28px', borderLeft: `4px solid ${BLUE}` }}>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: BLUE, fontFamily: 'var(--font-condensed)', marginBottom: 16 }}>
          CFO Takeaways — April 2026
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { icon: '▲', color: GREEN,  text: 'Revenue beat by $41.6K (+3.3%). DTC email campaign on Apr 12 converted at 14% with no discounting. Scheels pulled forward a Q4 reorder adding $13.2K wholesale.' },
            { icon: '▲', color: GREEN,  text: 'COGS came in $5.5K favorable. New ShipBob deal activated mid-April at a lower per-unit rate. Full $14K/month benefit starts May.' },
            { icon: '▼', color: RED,    text: 'Marketing $47.2K over budget — the only issue this month. Altitude Creative ($18K) and WestCoast Influencers ($13K) not matched to approved campaigns. Hold for reconciliation.' },
            { icon: '△', color: ORANGE, text: 'Net income $37.8K below plan despite the revenue beat. If the marketing run rate repeats, full-year net income compresses by ~$400K.' },
            { icon: '→', color: BLUE,   text: 'May: Salesforce renewal ($22K) hits, offset by full ShipBob savings ($14K). Net impact ~–$8K. Revenue trend healthy at 3% MoM.' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 14, color: item.color, fontWeight: 900, flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
              <span style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--color-muted)' }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
