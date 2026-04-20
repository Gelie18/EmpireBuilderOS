'use client';

import {
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

// ── Design tokens (inline) ──────────────────────────────────────────────────
const CARD: React.CSSProperties = {
  background: 'var(--color-surf)',
  borderRadius: 'var(--card-radius)',
  boxShadow: 'var(--card-shadow)',
  border: '1px solid var(--color-border)',
};
const TT: React.CSSProperties = {
  background: '#FFFFFF',
  border: '1px solid rgba(0,0,0,0.10)',
  borderRadius: 8,
  color: '#1A1A1A',
  fontSize: 12,
  boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
};

// ── Synthetic October 2024 data ─────────────────────────────────────────────

const ASSETS = {
  cash:         873_500,
  ar:           412_300,
  inventory:    520_800,
  otherCurrent:  48_200,
  totalCurrent: 1_854_800,
  fixedNet:      284_600,
  totalAssets:  2_139_400,
};

const LIABILITIES = {
  ap:              142_800,
  accrued:          98_400,
  shortTermDebt:         0,
  totalCurrent:    241_200,
  longTerm:        147_300,
  totalLiabilities: 388_500,
};

const EQUITY = 1_750_900;

// 6-month Cash trend (May → Oct)
const CASH_TREND = [
  { label: "May '24", cash: 835_000 },
  { label: "Jun '24", cash: 842_000 },
  { label: "Jul '24", cash: 858_000 },
  { label: "Aug '24", cash: 847_000 },
  { label: "Sep '24", cash: 851_000 },
  { label: "Oct '24", cash: 873_500 },
];

// ── Helpers ─────────────────────────────────────────────────────────────────
function fmt(n: number): string {
  return '$' + n.toLocaleString('en-US');
}
function fmtCompact(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n}`;
}

// ── Tooltip ─────────────────────────────────────────────────────────────────
function CashTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={TT}>
      <div style={{ fontWeight: 700, marginBottom: 4, fontFamily: 'var(--font-condensed)' }}>{label}</div>
      <div style={{ color: 'var(--color-blue)' }}>Cash: {fmtCompact(payload[0].value)}</div>
    </div>
  );
}

// ── Ratio KPI ────────────────────────────────────────────────────────────────
const currentRatio = (ASSETS.totalCurrent / LIABILITIES.totalCurrent).toFixed(1);
const debtEquity   = ((LIABILITIES.totalLiabilities / EQUITY) * 100).toFixed(1);
const cashPctAssets = ((ASSETS.cash / ASSETS.totalAssets) * 100).toFixed(1);
const arDays       = '11.5';

// ── Asset rows ──────────────────────────────────────────────────────────────
const ASSET_ROWS: { label: string; value: number | null; type: 'section' | 'line' | 'subtotal' | 'total' }[] = [
  { label: 'CURRENT ASSETS',          value: null,               type: 'section'  },
  { label: 'Cash & Equivalents',      value: ASSETS.cash,        type: 'line'     },
  { label: 'Accounts Receivable',     value: ASSETS.ar,          type: 'line'     },
  { label: 'Inventory',               value: ASSETS.inventory,   type: 'line'     },
  { label: 'Other Current Assets',    value: ASSETS.otherCurrent,type: 'line'     },
  { label: 'Total Current Assets',    value: ASSETS.totalCurrent,type: 'subtotal' },
  { label: 'FIXED & OTHER ASSETS',    value: null,               type: 'section'  },
  { label: 'Fixed Assets (net)',       value: ASSETS.fixedNet,    type: 'line'     },
  { label: 'TOTAL ASSETS',            value: ASSETS.totalAssets, type: 'total'    },
];

// ── Liability + Equity rows ──────────────────────────────────────────────────
const LIAB_ROWS: { label: string; value: number | null; type: 'section' | 'line' | 'subtotal' | 'total' }[] = [
  { label: 'CURRENT LIABILITIES',        value: null,                         type: 'section'  },
  { label: 'Accounts Payable',           value: LIABILITIES.ap,               type: 'line'     },
  { label: 'Accrued Liabilities',        value: LIABILITIES.accrued,          type: 'line'     },
  { label: 'Short-Term Debt',            value: LIABILITIES.shortTermDebt,    type: 'line'     },
  { label: 'Total Current Liabilities',  value: LIABILITIES.totalCurrent,     type: 'subtotal' },
  { label: 'LONG-TERM LIABILITIES',      value: null,                         type: 'section'  },
  { label: 'Long-Term Debt',             value: LIABILITIES.longTerm,         type: 'line'     },
  { label: 'Total Liabilities',          value: LIABILITIES.totalLiabilities, type: 'subtotal' },
  { label: 'EQUITY',                     value: null,                         type: 'section'  },
  { label: 'Shareholder Equity',         value: EQUITY,                       type: 'line'     },
  { label: 'TOTAL LIAB + EQUITY',        value: LIABILITIES.totalLiabilities + EQUITY, type: 'total' },
];

// ── Table row ────────────────────────────────────────────────────────────────
function BSRow({ label, value, type }: { label: string; value: number | null; type: string }) {
  if (type === 'section') {
    return (
      <tr>
        <td
          colSpan={2}
          style={{
            padding: '10px 20px 4px',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.1em',
            fontFamily: 'var(--font-condensed)',
            color: 'var(--color-muted)',
            textTransform: 'uppercase',
            background: 'var(--color-surf2)',
          }}
        >
          {label}
        </td>
      </tr>
    );
  }

  const isTotal    = type === 'total';
  const isSubtotal = type === 'subtotal';

  return (
    <tr
      style={{
        borderTop: isTotal ? '1px solid var(--color-border2)' : undefined,
        background: isTotal ? 'rgba(53,184,232,0.06)' : undefined,
      }}
    >
      <td
        style={{
          padding: isTotal ? '13px 20px' : '10px 20px',
          fontSize: isTotal ? 15 : isSubtotal ? 14 : 14,
          fontWeight: isTotal || isSubtotal ? 700 : 400,
          color: isTotal ? 'var(--color-text)' : isSubtotal ? 'var(--color-text)' : '#1A1A1A',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          paddingLeft: type === 'line' ? 32 : 20,
        }}
      >
        {label}
      </td>
      <td
        style={{
          padding: isTotal ? '13px 20px' : '10px 20px',
          textAlign: 'right',
          fontFamily: 'var(--font-condensed)',
          fontSize: isTotal ? 18 : isSubtotal ? 16 : 15,
          fontWeight: isTotal || isSubtotal ? 700 : 500,
          color: isTotal ? 'var(--color-blue)' : isSubtotal ? 'var(--color-text)' : '#1A1A1A',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        {value !== null ? fmt(value) : '—'}
      </td>
    </tr>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function BalanceSheetPage() {
  return (
    <div className="flex flex-col gap-5">

      {/* ── 1. Header card ──────────────────────────────────────────────────── */}
      <div style={{ ...CARD, padding: '20px 24px' }}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div
              style={{
                fontFamily: 'var(--font-condensed)',
                fontSize: 30,
                fontWeight: 900,
                letterSpacing: '0.03em',
                color: 'var(--color-text)',
                lineHeight: 1,
                textTransform: 'uppercase',
              }}
            >
              Balance Sheet
            </div>
            <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 5 }}>
              October 31, 2024
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {/* Total Assets */}
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'var(--color-blue-d)', border: '1px solid rgba(53,184,232,0.3)',
              borderRadius: 8, padding: '6px 14px',
              fontFamily: 'var(--font-condensed)', fontSize: 13, fontWeight: 700,
              color: 'var(--color-blue)', letterSpacing: '0.04em',
            }}>
              <span style={{ fontWeight: 400, color: 'var(--color-muted)', fontSize: 11 }}>TOTAL ASSETS</span>
              $2.14M
            </span>

            {/* Total Liabilities */}
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(245,166,35,0.12)', border: '1px solid rgba(245,166,35,0.3)',
              borderRadius: 8, padding: '6px 14px',
              fontFamily: 'var(--font-condensed)', fontSize: 13, fontWeight: 700,
              color: 'var(--color-orange)', letterSpacing: '0.04em',
            }}>
              <span style={{ fontWeight: 400, color: 'var(--color-muted)', fontSize: 11 }}>TOTAL LIAB</span>
              $388.5K
            </span>

            {/* Equity */}
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'var(--color-green-d)', border: '1px solid rgba(34,217,122,0.3)',
              borderRadius: 8, padding: '6px 14px',
              fontFamily: 'var(--font-condensed)', fontSize: 13, fontWeight: 700,
              color: 'var(--color-green)', letterSpacing: '0.04em',
            }}>
              <span style={{ fontWeight: 400, color: 'var(--color-muted)', fontSize: 11 }}>EQUITY</span>
              $1.75M
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. KPI ratio cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: 'Current Ratio',
            value: `${currentRatio}x`,
            color: 'var(--color-green)',
            sub: 'Well above 2× threshold',
          },
          {
            label: 'Debt / Equity',
            value: `${debtEquity}%`,
            color: 'var(--color-green)',
            sub: 'Low leverage — healthy',
          },
          {
            label: 'Cash % of Assets',
            value: `${cashPctAssets}%`,
            color: 'var(--color-blue)',
            sub: 'Strong liquidity position',
          },
          {
            label: 'AR Days',
            value: `${arDays} days`,
            color: 'var(--color-green)',
            sub: 'Excellent DTC/wholesale mix',
          },
        ].map((kpi) => (
          <div key={kpi.label} style={{ ...CARD, padding: '18px 20px' }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.09em',
              textTransform: 'uppercase', fontFamily: 'var(--font-condensed)',
              color: 'var(--color-muted)', marginBottom: 8,
            }}>
              {kpi.label}
            </div>
            <div style={{
              fontFamily: 'var(--font-condensed)', fontSize: 36, fontWeight: 900,
              color: 'var(--color-text)', lineHeight: 1, letterSpacing: '-0.01em',
            }}>
              {kpi.value}
            </div>
            <div style={{ fontSize: 12, color: kpi.color, marginTop: 6, fontWeight: 500 }}>
              {kpi.sub}
            </div>
          </div>
        ))}
      </div>

      {/* ── 3. Balance sheet table — two columns side by side ───────────────── */}
      <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
        {/* Table header strip */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px', borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-surf2)',
        }}>
          <span style={{
            fontFamily: 'var(--font-condensed)', fontSize: 13, fontWeight: 700,
            letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-text)',
          }}>
            October 2024 Snapshot
          </span>
          <span style={{
            fontFamily: 'var(--font-condensed)', fontSize: 11,
            color: 'var(--color-muted)', fontWeight: 600,
          }}>
            Unaudited · Demo Data
          </span>
        </div>

        {/* Two tables */}
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ borderTop: 'none' }}>
          {/* Assets */}
          <div style={{ borderRight: '1px solid var(--color-border)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{
                    padding: '10px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700,
                    fontFamily: 'var(--font-condensed)', color: 'var(--color-blue)',
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    background: 'rgba(53,184,232,0.07)', borderBottom: '1px solid var(--color-border)',
                  }}>Assets</th>
                  <th style={{
                    padding: '10px 20px', textAlign: 'right', fontSize: 11, fontWeight: 700,
                    fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)',
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    background: 'rgba(53,184,232,0.07)', borderBottom: '1px solid var(--color-border)',
                  }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {ASSET_ROWS.map((r, i) => <BSRow key={i} {...r} />)}
              </tbody>
            </table>
          </div>

          {/* Liabilities & Equity */}
          <div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{
                    padding: '10px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700,
                    fontFamily: 'var(--font-condensed)', color: 'var(--color-orange)',
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    background: 'rgba(245,166,35,0.07)', borderBottom: '1px solid var(--color-border)',
                  }}>Liabilities &amp; Equity</th>
                  <th style={{
                    padding: '10px 20px', textAlign: 'right', fontSize: 11, fontWeight: 700,
                    fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)',
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    background: 'rgba(245,166,35,0.07)', borderBottom: '1px solid var(--color-border)',
                  }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {LIAB_ROWS.map((r, i) => <BSRow key={i} {...r} />)}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── 4. 6-month Cash trend chart ─────────────────────────────────────── */}
      <div style={{ ...CARD, padding: '20px 24px' }}>
        <div style={{
          fontFamily: 'var(--font-condensed)', fontSize: 13, fontWeight: 700,
          letterSpacing: '0.07em', textTransform: 'uppercase',
          color: 'var(--color-text)', marginBottom: 16,
        }}>
          Cash — 6-Month Trend
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={CASH_TREND} margin={{ top: 4, right: 8, left: 4, bottom: 0 }}>
            <defs>
              <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="var(--color-blue)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-blue)" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(0,0,0,0.06)" strokeDasharray="4 4" />
            <XAxis
              dataKey="label"
              tick={{ fill: 'var(--color-muted)', fontSize: 11, fontFamily: 'var(--font-condensed)' }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tick={{ fill: 'var(--color-muted)', fontSize: 11, fontFamily: 'var(--font-condensed)' }}
              axisLine={false} tickLine={false} width={58}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CashTooltip />} />
            <Area
              type="monotone" dataKey="cash" name="Cash"
              stroke="var(--color-blue)" strokeWidth={2.5}
              fill="url(#cashGrad)" dot={{ r: 3, fill: 'var(--color-blue)', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── 5. Balance Sheet Health card ────────────────────────────────────── */}
      <div style={{
        ...CARD,
        padding: '20px 24px',
        borderLeft: '4px solid var(--color-blue)',
      }}>
        <div style={{
          fontFamily: 'var(--font-condensed)', fontSize: 13, fontWeight: 700,
          letterSpacing: '0.07em', textTransform: 'uppercase',
          color: 'var(--color-blue)', marginBottom: 14,
        }}>
          Balance Sheet Health
        </div>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: 0, padding: 0, listStyle: 'none' }}>
          {[
            `Current ratio of ${currentRatio}x is well above the 2× liquidity threshold — the company can cover short-term obligations nearly 8× over from current assets alone.`,
            `Zero short-term debt outstanding. The $147.3K of long-term obligations represents just 8.4% of total assets, signaling a conservatively financed balance sheet.`,
            `AR collection cycle of 11.5 days is excellent for a DTC/wholesale mix at this scale. Tight receivables management reduces working capital drag heading into Q4 peak season.`,
          ].map((bullet, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span style={{
                flexShrink: 0, width: 6, height: 6, borderRadius: '50%',
                background: 'var(--color-blue)', marginTop: 5,
              }} />
              <span style={{ fontSize: 14, color: 'var(--color-text)', lineHeight: 1.55 }}>
                {bullet}
              </span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
