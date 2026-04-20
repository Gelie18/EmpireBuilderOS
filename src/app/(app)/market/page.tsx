'use client';

import { getDemoBenchmarks, getDemoMacroIndicators } from '@/lib/data/demo-data';
import { formatCurrency } from '@/lib/utils';

const benchmarks     = getDemoBenchmarks();
const macroIndicators = getDemoMacroIndicators();

// ── Design tokens ────────────────────────────────────────────────────────────
const CARD: React.CSSProperties = {
  background: 'var(--color-surf)',
  borderRadius: 'var(--card-radius)',
  boxShadow: 'var(--card-shadow)',
  border: '1px solid var(--color-border)',
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function fmtBenchmark(value: number, unit: string): string {
  if (unit === 'percent')  return `${value.toFixed(1)}%`;
  if (unit === 'currency') return formatCurrency(value, true);
  if (unit === 'multiple') return `${value.toFixed(1)}×`;
  return value.toFixed(1);
}

function benchmarkStatus(b: ReturnType<typeof getDemoBenchmarks>[0]): {
  label: string; color: string; bg: string;
} {
  const aboveIsGood = b.favorable === 'high';
  const vsMedian = aboveIsGood
    ? b.ridgeline >= b.industryMedian
    : b.ridgeline <= b.industryMedian;
  const vsTop = aboveIsGood
    ? b.ridgeline >= b.topQuartile
    : b.ridgeline <= b.topQuartile;

  if (vsTop) return { label: 'Top Quartile', color: 'var(--color-green)', bg: 'var(--color-green-d)' };
  if (vsMedian) return { label: 'Above Median', color: 'var(--color-blue)',  bg: 'var(--color-blue-d)'  };
  return          { label: 'Below Median', color: 'var(--color-red)',   bg: 'var(--color-red-d)'   };
}

// ── Competitive KPI cards ────────────────────────────────────────────────────
const COMP_KPIS = [
  {
    label: 'Revenue Growth',
    value: '+18.4%',
    comparison: 'Industry median 11%',
    badge: 'Top Quartile',
    badgeColor: 'var(--color-green)',
    badgeBg: 'var(--color-green-d)',
    valueColor: 'var(--color-green)',
  },
  {
    label: 'Gross Margin',
    value: '45.1%',
    comparison: 'Median 42% — +3.1pp above',
    badge: 'Above Median',
    badgeColor: 'var(--color-green)',
    badgeBg: 'var(--color-green-d)',
    valueColor: 'var(--color-green)',
  },
  {
    label: 'Net Margin',
    value: '5.4%',
    comparison: 'Median 8.2% — marketing gap',
    badge: 'Gap: Mktg Overage',
    badgeColor: 'var(--color-orange)',
    badgeBg: 'rgba(245,166,35,0.12)',
    valueColor: 'var(--color-orange)',
  },
  {
    label: 'YoY Headcount',
    value: '+10.5%',
    comparison: '42 FTEs — growing team',
    badge: 'Growing',
    badgeColor: 'var(--color-blue)',
    badgeBg: 'var(--color-blue-d)',
    valueColor: 'var(--color-blue)',
  },
];

// ── Macro cards to highlight ─────────────────────────────────────────────────
const MACRO_CARDS = [
  {
    name: 'Consumer Confidence',
    value: '104.2',
    change: '+2.1',
    changeColor: 'var(--color-green)',
    note: 'Outdoor discretionary spend broadly positive — supports DTC channel.',
  },
  {
    name: 'Outdoor Recreation Index',
    value: '+6.8%',
    change: 'YoY',
    changeColor: 'var(--color-blue)',
    note: 'Category tailwind intact; hiking & trail footwear growing above category.',
  },
  {
    name: 'Freight Index',
    value: '−3.2%',
    change: 'MoM — Favorable',
    changeColor: 'var(--color-green)',
    note: 'Spot freight easing; lock in rates before Q4 peak while favorable.',
  },
];

// ── Benchmark subset for the table ───────────────────────────────────────────
// Metric | Ridgeline | Industry Median | Top Quartile | Status
const TABLE_METRICS = [
  'Revenue Growth (YoY)',
  'Gross Margin',
  'Net Income Margin',
  'Marketing % Revenue',
  'Inventory Turns',
  'AR Days Outstanding',
];
const TABLE_ROWS = TABLE_METRICS
  .map((m) => benchmarks.find((b) => b.metric === m))
  .filter(Boolean) as ReturnType<typeof getDemoBenchmarks>;

// ── Page ─────────────────────────────────────────────────────────────────────
export default function MarketPage() {
  return (
    <div className="flex flex-col gap-5">

      {/* ── 1. Header card ──────────────────────────────────────────────────── */}
      <div style={{ ...CARD, padding: '20px 24px' }}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div style={{
              fontFamily: 'var(--font-condensed)', fontSize: 30, fontWeight: 900,
              letterSpacing: '0.03em', color: 'var(--color-text)',
              lineHeight: 1, textTransform: 'uppercase',
            }}>
              Market Intelligence
            </div>
            <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 5 }}>
              Outdoor Footwear — DTC &amp; Wholesale Benchmark
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'var(--color-green-d)', border: '1px solid rgba(34,217,122,0.3)',
              borderRadius: 8, padding: '6px 14px',
              fontFamily: 'var(--font-condensed)', fontSize: 13, fontWeight: 700,
              color: 'var(--color-green)', letterSpacing: '0.04em',
            }}>
              Above Median
            </span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'var(--color-blue-d)', border: '1px solid rgba(53,184,232,0.3)',
              borderRadius: 8, padding: '6px 14px',
              fontFamily: 'var(--font-condensed)', fontSize: 13, fontWeight: 700,
              color: 'var(--color-blue)', letterSpacing: '0.04em',
            }}>
              Oct 2026
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. Competitive position KPI cards ───────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {COMP_KPIS.map((kpi) => (
          <div key={kpi.label} style={{ ...CARD, padding: '18px 20px' }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.09em',
              textTransform: 'uppercase', fontFamily: 'var(--font-condensed)',
              color: 'var(--color-muted)', marginBottom: 8,
            }}>
              {kpi.label}
            </div>
            <div style={{
              fontFamily: 'var(--font-condensed)', fontSize: 32, fontWeight: 900,
              color: kpi.valueColor, lineHeight: 1, letterSpacing: '-0.01em',
            }}>
              {kpi.value}
            </div>
            <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 6 }}>
              {kpi.comparison}
            </div>
            <div style={{
              display: 'inline-block', marginTop: 10,
              background: kpi.badgeBg, color: kpi.badgeColor,
              borderRadius: 6, padding: '3px 10px',
              fontFamily: 'var(--font-condensed)', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              {kpi.badge}
            </div>
          </div>
        ))}
      </div>

      {/* ── 3. Benchmark comparison table ───────────────────────────────────── */}
      <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
        <div style={{
          padding: '14px 20px', borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-surf2)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{
            fontFamily: 'var(--font-condensed)', fontSize: 13, fontWeight: 700,
            letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-text)',
          }}>
            Benchmark Comparison — Outdoor Footwear
          </span>
          <span style={{ fontSize: 11, color: 'var(--color-muted)', fontWeight: 600 }}>
            Ridgeline vs Industry
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 580 }}>
            <thead>
              <tr style={{ background: 'var(--color-surf2)' }}>
                {['Metric', 'Ridgeline', 'Industry Median', 'Top Quartile', 'Status'].map((h, i) => (
                  <th key={h} style={{
                    padding: '11px 20px',
                    textAlign: i === 0 ? 'left' : 'right',
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.09em',
                    textTransform: 'uppercase', fontFamily: 'var(--font-condensed)',
                    color: 'var(--color-muted)',
                    borderBottom: '1px solid var(--color-border)',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map((b) => {
                const status = benchmarkStatus(b);
                return (
                  <tr key={b.metric} style={{ borderBottom: '1px solid rgba(35,100,140,0.3)' }}>
                    <td style={{
                      padding: '14px 20px', fontSize: 15,
                      color: 'var(--color-text)', fontWeight: 500,
                    }}>
                      {b.metric}
                    </td>
                    <td style={{
                      padding: '14px 20px', textAlign: 'right',
                      fontFamily: 'var(--font-condensed)', fontSize: 16, fontWeight: 700,
                      color: status.color,
                    }}>
                      {fmtBenchmark(b.ridgeline, b.unit)}
                    </td>
                    <td style={{
                      padding: '14px 20px', textAlign: 'right',
                      fontFamily: 'var(--font-condensed)', fontSize: 16, fontWeight: 600,
                      color: 'var(--color-muted)',
                    }}>
                      {fmtBenchmark(b.industryMedian, b.unit)}
                    </td>
                    <td style={{
                      padding: '14px 20px', textAlign: 'right',
                      fontFamily: 'var(--font-condensed)', fontSize: 16, fontWeight: 600,
                      color: 'var(--color-muted)',
                    }}>
                      {fmtBenchmark(b.topQuartile, b.unit)}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <span style={{
                        background: status.bg, color: status.color,
                        borderRadius: 6, padding: '4px 12px',
                        fontFamily: 'var(--font-condensed)', fontSize: 11, fontWeight: 700,
                        letterSpacing: '0.06em', textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                      }}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 4. 3 macro indicator cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {MACRO_CARDS.map((m) => (
          <div key={m.name} style={{ ...CARD, padding: '18px 20px' }}>
            <div style={{
              fontFamily: 'var(--font-condensed)', fontSize: 13, fontWeight: 700,
              letterSpacing: '0.07em', textTransform: 'uppercase',
              color: 'var(--color-muted)', marginBottom: 8,
            }}>
              {m.name}
            </div>
            <div style={{
              fontFamily: 'var(--font-condensed)', fontSize: 24, fontWeight: 700,
              color: 'var(--color-text)', lineHeight: 1, marginBottom: 4,
            }}>
              {m.value}
            </div>
            <div style={{ fontSize: 14, color: m.changeColor, fontWeight: 600, marginBottom: 8 }}>
              {m.change}
            </div>
            <div style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.5 }}>
              {m.note}
            </div>
          </div>
        ))}
      </div>

      {/* ── 5. Competitive Position insight card ────────────────────────────── */}
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
          Competitive Position
        </div>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: 0, padding: 0, listStyle: 'none' }}>
          {[
            'Ridgeline is outperforming the industry on both revenue growth (+18.4% vs 11% median) and gross margin (45.1% vs 42% median), driven by a differentiated DTC mix and improving channel economics.',
            'The net margin gap vs. median (5.4% vs 8.2%) is entirely attributable to the October marketing overage — it is not structural. Normalized marketing spend puts net margin at ~8.8%, above the industry median.',
            'Freight cost pressure is industry-wide; proactive carrier management and contract lock-in before Q4 peak is recommended to avoid the same headwinds hitting competitors in November–December.',
          ].map((bullet, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span style={{
                flexShrink: 0, width: 6, height: 6, borderRadius: '50%',
                background: 'var(--color-blue)', marginTop: 6,
              }} />
              <span style={{ fontSize: 14, color: 'rgba(237,244,250,0.8)', lineHeight: 1.55 }}>
                {bullet}
              </span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
