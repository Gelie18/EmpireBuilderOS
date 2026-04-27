'use client';

import { useState, useMemo } from 'react';
import { getDemoForecast } from '@/lib/data/demo-data';
import { formatCurrency } from '@/lib/utils';
import { useSubco } from '@/contexts/SubcoContext';
import { ALL_SUBCOS, ALL_PORTFOLIO_SUBCOS, CONSOLIDATED_VIEW } from '@/lib/subcos';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, CartesianGrid, ReferenceLine,
} from 'recharts';

// ── Constants ─────────────────────────────────────────────────────────────────

// Monthly fully-loaded cost per head (payroll + benefits + overhead)
// Derived from Apr actuals: $201,200 payroll ÷ 42 people = $4,790/mo
const COST_PER_HEAD = 4_790;

// The last actual month — all projections compound from here
const LAST_ACTUAL_MONTH = "Apr '26";

// Sum of all portfolio subco revenues — used to derive each subco's proportion
// of the consolidated actuals.
const SUBCO_TOTAL_REVENUE = ALL_PORTFOLIO_SUBCOS
  .reduce((sum, s) => sum + s.annualRevenue, 0);

const CARD: React.CSSProperties = {
  background:   'var(--color-surf)',
  borderRadius: 'var(--card-radius)',
  boxShadow:    'var(--card-shadow)',
  border:       '1px solid var(--color-border)',
};

const TOOLTIP_STYLE = {
  background: '#1E2236',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: 8,
  color: '#FFFFFF',
  fontSize: 12,
};

// ── Page ──────────────────────────────────────────────────────────────────────

// ── What-If Scenarios ─────────────────────────────────────────────────────────
const SCENARIOS = [
  {
    label: '🟢 Best Case',
    desc: 'Strong growth, normalized costs',
    values: { 'rev-growth': 5, 'cogs-pct': 52, 'opex-pct': 18, headcount: 44 },
  },
  {
    label: '🔵 Base Case',
    desc: 'Current trajectory, marketing normalizes',
    values: { 'rev-growth': 3, 'cogs-pct': 54.9, 'opex-pct': 19.8, headcount: 42 },
  },
  {
    label: '🟡 Conservative',
    desc: 'Slower growth, cost pressure',
    values: { 'rev-growth': 1, 'cogs-pct': 57, 'opex-pct': 21, headcount: 42 },
  },
  {
    label: '🔴 Downside',
    desc: 'Revenue decline, overspend continues',
    values: { 'rev-growth': -2, 'cogs-pct': 58, 'opex-pct': 23, headcount: 45 },
  },
];

export default function ForecastPage() {
  const baseForecast = getDemoForecast();
  const { subco, setSubcoId, isConsolidated } = useSubco();
  const [drivers, setDrivers] = useState(baseForecast.drivers);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  // Store base driver values for net-change indicators
  const BASE_DRIVERS = baseForecast.drivers.reduce<Record<string, number>>(
    (acc, d) => { acc[d.id] = d.value; return acc; },
    {}
  );

  // Scaling factor: consolidated = 1.0, specific portco = its share of total revenue.
  // This keeps the forecast actuals tied to the subco dropdown: switch to SSK and
  // the $1.31M Apr actual becomes ~$0.95M, etc. Consolidated view stays at $1.31M.
  const subcoScale = useMemo(() => {
    if (isConsolidated) return 1;
    // 783 Partners (holdco entity) uses full scale too
    if (subco.id === 'bases-loaded') return 1;
    return subco.annualRevenue / SUBCO_TOTAL_REVENUE;
  }, [isConsolidated, subco.id, subco.annualRevenue]);

  // ── The actual months are FROZEN — never recalculated ──
  // ── Only projected months (isActual === false) are recomputed ──
  const months = useMemo(() => {
    const revGrowth     = (drivers.find((d) => d.id === 'rev-growth')?.value  ?? 3)    / 100;
    const cogsPct       = (drivers.find((d) => d.id === 'cogs-pct')?.value    ?? 54.9) / 100;
    const nonPayrollPct = (drivers.find((d) => d.id === 'opex-pct')?.value    ?? 19.8) / 100;
    const headcount     =  drivers.find((d) => d.id === 'headcount')?.value   ?? 42;

    // Apply subco scaling to actuals so forecast values match the rest of the app
    // (the dashboard, revenue intel, etc. are all subco-scoped).
    const actuals = baseForecast.months.filter((m) => m.isActual);
    const lastActualRevenue = actuals[actuals.length - 1].revenue * subcoScale;

    // Payroll + non-payroll OpEx also scale with subco size (headcount stays
    // topco-level since the model's headcount slider represents the whole org,
    // but payroll dollars apportion pro-rata for display in projections).
    const scaledPayroll = headcount * COST_PER_HEAD * subcoScale;

    let projIndex = 0; // counts only projected months (1, 2, 3 …)

    return baseForecast.months.map((m) => {
      // ── ACTUAL: return with subco scaling applied ──
      if (m.isActual) {
        const rev  = Math.round(m.revenue * subcoScale);
        const cogs = Math.round(m.cogs * subcoScale);
        const gp   = Math.round(m.grossProfit * subcoScale);
        const opex = Math.round(m.opex * subcoScale);
        const ni   = Math.round(m.netIncome * subcoScale);
        return { ...m, revenue: rev, cogs, grossProfit: gp, opex, netIncome: ni };
      }

      // ── PROJECTED: recompute from drivers (already scaled via lastActualRevenue) ──
      projIndex++;

      const rev          = Math.round(lastActualRevenue * Math.pow(1 + revGrowth, projIndex));
      const cogs         = Math.round(rev * cogsPct);
      const gp           = rev - cogs;
      const payrollOpEx  = Math.round(scaledPayroll);
      const nonPayrollOpEx = Math.round(rev * nonPayrollPct);
      const totalOpEx    = payrollOpEx + nonPayrollOpEx;
      const ni           = gp - totalOpEx;

      return {
        ...m,
        revenue: rev,
        cogs,
        grossProfit: gp,
        opex: totalOpEx,
        netIncome: ni,
        _payroll: payrollOpEx,
        _nonPayroll: nonPayrollOpEx,
      };
    });
  }, [drivers, baseForecast.months, subcoScale]);

  // Per-subco exit run-rate projections for the consolidated breakdown card.
  // Computed with the same drivers but scaled per subco's share.
  const perSubcoProjection = useMemo(() => {
    const revGrowth     = (drivers.find((d) => d.id === 'rev-growth')?.value  ?? 3)    / 100;
    const cogsPct       = (drivers.find((d) => d.id === 'cogs-pct')?.value    ?? 54.9) / 100;
    const nonPayrollPct = (drivers.find((d) => d.id === 'opex-pct')?.value    ?? 19.8) / 100;
    const headcount     =  drivers.find((d) => d.id === 'headcount')?.value   ?? 42;

    const lastActualTopco = baseForecast.months.filter((m) => m.isActual).slice(-1)[0].revenue;
    const projMonths = baseForecast.months.filter((m) => !m.isActual).length;

    return ALL_PORTFOLIO_SUBCOS
      .map((s) => {
        const share = s.annualRevenue / SUBCO_TOTAL_REVENUE;
        const baseRev = lastActualTopco * share;
        const exitRev = baseRev * Math.pow(1 + revGrowth, projMonths);
        const fwdRev  = Array.from({ length: projMonths }, (_, i) =>
          baseRev * Math.pow(1 + revGrowth, i + 1),
        ).reduce((a, b) => a + b, 0);

        const fwdCogs    = fwdRev * cogsPct;
        const fwdGp      = fwdRev - fwdCogs;
        const fwdPayroll = headcount * COST_PER_HEAD * share * projMonths;
        const fwdNonPay  = fwdRev * nonPayrollPct;
        const fwdNi      = fwdGp - fwdPayroll - fwdNonPay;

        return {
          subco: s,
          share,
          currentMonthRev: baseRev,
          exitRevAnnualized: exitRev * 12,
          fwd6mRev: fwdRev,
          fwd6mNi: fwdNi,
        };
      })
      .sort((a, b) => b.exitRevAnnualized - a.exitRevAnnualized);
  }, [drivers, baseForecast.months]);

  const updateDriver = (id: string, value: number) => {
    setDrivers((prev) => prev.map((d) => (d.id === id ? { ...d, value } : d)));
    setActiveScenario(null);
  };

  const applyScenario = (scenario: typeof SCENARIOS[0]) => {
    setDrivers((prev) => prev.map((d) => ({
      ...d,
      value: scenario.values[d.id as keyof typeof scenario.values] ?? d.value,
    })));
    setActiveScenario(scenario.label);
  };

  // ── Summary metrics (projected only, so actuals don't distort the forward view) ──
  const projected   = months.filter((m) => !m.isActual);
  const totalFwdRev = projected.reduce((s, m) => s + m.revenue, 0);
  const totalFwdNI  = projected.reduce((s, m) => s + m.netIncome, 0);
  const exitMonth   = projected[projected.length - 1];

  // Derived driver values for display
  const headcount     = drivers.find((d) => d.id === 'headcount')?.value  ?? 42;
  const baseHeadcount = 42; // Apr actual
  const hcDelta       = headcount - baseHeadcount;
  const monthlyPayroll = headcount * COST_PER_HEAD;

  return (
    <div className="flex flex-col gap-5">
      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.12em] mb-1"
            style={{ color: subco.colors.accent }}>
            {isConsolidated ? 'Consolidated · All Portcos' : `${subco.shortName} · ${subco.id === 'bases-loaded' ? 'Holdco' : 'Portco'} Forecast`}
          </div>
          <div className="text-[22px] font-black uppercase tracking-[0.04em]"
            style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-text)' }}>
            Driver Model — 12-Month Forecast
          </div>
          <div className="text-[12px] mt-0.5" style={{ color: 'var(--color-muted)' }}>
            Actuals locked Nov 2025–Apr 2026 · Projections May 2026–Oct 2026
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          <div style={{ ...CARD, padding: '12px 16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div className="text-[13px] font-bold uppercase tracking-[0.10em]"
                style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)' }}>6M Fwd Revenue</div>
              <div className="text-[36px] font-black"
                style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-blue)', fontWeight: 900 }}>{formatCurrency(totalFwdRev, true)}</div>
            </div>
          </div>
          <div style={{ ...CARD, padding: '12px 16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div className="text-[13px] font-bold uppercase tracking-[0.10em]"
                style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)' }}>6M Fwd Net Income</div>
              <div className="text-[36px] font-black"
                style={{ fontFamily: 'var(--font-condensed)', color: totalFwdNI >= 0 ? 'var(--color-green)' : 'var(--color-red)', fontWeight: 900 }}>
                {formatCurrency(totalFwdNI, true)}
              </div>
            </div>
          </div>
          <div style={{ ...CARD, padding: '12px 16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div className="text-[13px] font-bold uppercase tracking-[0.10em]"
                style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)' }}>Exit Run Rate</div>
              <div className="text-[36px] font-black"
                style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-text)', fontWeight: 900 }}>
                {exitMonth ? formatCurrency(exitMonth.revenue * 12, true) : '—'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Actuals-locked callout ── */}
      <div className="flex items-center gap-3 px-3.5 py-2.5 border-l-[3px]"
        style={{ background: 'rgba(0,166,81,0.07)', borderLeft: '3px solid var(--color-green)' }}>
        <span style={{ color: 'var(--color-green)', fontSize: 16 }}>🔒</span>
        <div className="text-[11px] leading-snug" style={{ color: 'var(--color-muted)' }}>
          <strong style={{ color: 'var(--color-green)' }}>Actuals locked</strong> — November 2025 through April 2026 are real P&L data and are never recalculated.
          Sliders only affect the <strong style={{ color: 'var(--color-orange)' }}>6 projected months</strong> (May 2026 – Oct 2026),
          compounding from Apr's actual revenue of <strong style={{ color: 'var(--color-blue)' }}>{formatCurrency(Math.round(1_311_600 * subcoScale))}</strong>
          {!isConsolidated && subco.id !== 'bases-loaded' && <> ({subco.shortName} share: {(subcoScale * 100).toFixed(1)}%)</>}.
        </div>
      </div>

      {/* ── Driver Controls ── */}
      <div className="border p-4" style={{ background: 'var(--color-surf)', borderColor: 'var(--color-border)', borderRadius: 'var(--card-radius)', boxShadow: 'var(--card-shadow)' }}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="text-[13px] font-bold uppercase tracking-[0.10em]"
            style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)' }}>
            Projection Drivers — Affects May 2026 – Oct 2026 Only
          </div>
          <div className="text-[10px] px-2 py-1 font-bold uppercase"
            style={{ background: 'var(--color-orange-d)', color: 'var(--color-orange)', fontFamily: 'var(--font-condensed)' }}>
            PROJ MONTHS ONLY
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {drivers.map((d) => {
            const isHc = d.id === 'headcount';
            const delta = isHc ? hcDelta : null;
            const baseVal = BASE_DRIVERS[d.id] ?? d.value;
            const diff = d.value - baseVal;
            return (
              <div key={d.id}>
                <div className="flex justify-between mb-1.5">
                  <label className="text-[13px] leading-tight"
                    style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-condensed)' }}>
                    {d.label}
                  </label>
                  <span className="text-[15px] font-black ml-2 flex-shrink-0"
                    style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-blue)' }}>
                    {d.unit === 'percent' ? `${d.value}%` : d.value}
                  </span>
                </div>
                <input
                  type="range"
                  min={d.min}
                  max={d.max}
                  step={d.step}
                  value={d.value}
                  onChange={(e) => updateDriver(d.id, parseFloat(e.target.value))}
                  className="w-full h-1.5 appearance-none cursor-pointer"
                  style={{ background: 'var(--color-surf2)', accentColor: 'var(--color-blue)' }}
                />
                <div className="flex justify-between text-[9px] mt-1"
                  style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-condensed)' }}>
                  <span>{d.min}{d.unit === 'percent' ? '%' : ''}</span>
                  {/* Headcount: show payroll impact + delta */}
                  {isHc && delta !== null ? (
                    <span style={{ color: delta > 0 ? 'var(--color-orange)' : delta < 0 ? 'var(--color-green)' : 'var(--color-muted)' }}>
                      {delta > 0 ? `+${delta} hires → +${formatCurrency(Math.abs(delta) * COST_PER_HEAD)}/mo` :
                       delta < 0 ? `${delta} cuts → ${formatCurrency(Math.abs(delta) * COST_PER_HEAD)}/mo saved` :
                       `No change vs Apr`}
                    </span>
                  ) : (
                    <span>{d.max}{d.unit === 'percent' ? '%' : ''}</span>
                  )}
                </div>
                {/* Headcount: show monthly payroll cost */}
                {isHc && (
                  <div className="text-[10px] mt-1.5 px-2 py-1"
                    style={{ background: 'var(--color-surf2)', color: 'var(--color-muted)', fontFamily: 'var(--font-condensed)' }}>
                    Monthly payroll: <strong style={{ color: 'var(--color-text)' }}>{formatCurrency(monthlyPayroll)}</strong>
                    {' '}({headcount} × {formatCurrency(COST_PER_HEAD)}/head)
                  </div>
                )}
                {/* Net change indicator for non-headcount drivers */}
                {!isHc && diff !== 0 && (
                  <div className="text-[10px] mt-1.5 px-2 py-1"
                    style={{
                      fontFamily: 'var(--font-condensed)',
                      background: 'var(--color-surf2)',
                      color: d.id === 'rev-growth'
                        ? (diff > 0 ? 'var(--color-green)' : 'var(--color-red)')
                        : (diff > 0 ? 'var(--color-red)' : 'var(--color-green)'),
                    }}>
                    {d.id === 'rev-growth' && (
                      <>Base: {baseVal.toFixed(1)}% → Current: {d.value}% | {diff > 0 ? '+' : ''}{diff.toFixed(1)}pp change</>
                    )}
                    {d.id === 'cogs-pct' && (
                      <>Every +1pp COGS = –$13K/mo gross profit {diff > 0 ? `(+${diff.toFixed(1)}pp↑)` : `(${diff.toFixed(1)}pp↓)`}</>
                    )}
                    {d.id === 'opex-pct' && (
                      <>+1pp OpEx = –$13K/mo NI {diff > 0 ? `(+${diff.toFixed(1)}pp↑)` : `(${diff.toFixed(1)}pp↓)`}</>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── What-If Scenarios ── */}
      <div style={{ ...CARD, padding: '18px 20px' }}>
        <div className="text-[13px] font-bold uppercase tracking-[0.10em] mb-4"
          style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)' }}>
          What-If Scenarios
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {SCENARIOS.map((scenario) => {
            const isActive = activeScenario === scenario.label;
            return (
              <button
                key={scenario.label}
                onClick={() => applyScenario(scenario)}
                style={{
                  ...CARD,
                  padding: '14px 16px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  border: isActive ? '2px solid #1B4DE6' : '1px solid var(--color-border)',
                  background: isActive ? 'var(--color-blue-d)' : 'var(--color-surf)',
                  transition: 'border-color 0.15s, background 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = '#1B4DE6';
                    e.currentTarget.style.background = 'var(--color-blue-d)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                    e.currentTarget.style.background = 'var(--color-surf)';
                  }
                }}
              >
                <div className="text-[13px] font-bold mb-1"
                  style={{ fontFamily: 'var(--font-condensed)', color: isActive ? '#1B4DE6' : 'var(--color-text)' }}>
                  {scenario.label}
                </div>
                <div className="text-[11px]" style={{ color: 'var(--color-muted)', lineHeight: 1.4 }}>
                  {scenario.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Per-portco breakdown (consolidated view only) ── */}
      {isConsolidated && (
        <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
          <div className="px-4 py-2.5 border-b flex items-center justify-between flex-wrap gap-2"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-surf2)' }}>
            <div>
              <span className="text-[13px] font-bold uppercase tracking-[0.10em]"
                style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-text)' }}>
                Forecast by Portco
              </span>
              <span className="text-[11px] ml-3" style={{ color: 'var(--color-muted)' }}>
                Click a row to filter the entire app to that subco.
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.10em]"
              style={{ color: CONSOLIDATED_VIEW.colors.accent }}>
              {perSubcoProjection.length} subsidiaries · same drivers applied
            </span>
          </div>
          <div style={{ padding: '4px 0' }}>
            {perSubcoProjection.map((p, idx) => {
              const isLast = idx === perSubcoProjection.length - 1;
              return (
                <button
                  key={p.subco.id}
                  type="button"
                  onClick={() => setSubcoId(p.subco.id)}
                  className="w-full text-left"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto auto auto auto',
                    alignItems: 'center',
                    gap: 14,
                    padding: '14px 18px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: isLast ? 'none' : '1px solid var(--color-border)',
                    cursor: 'pointer',
                    transition: 'background 0.12s',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = `rgba(${p.subco.colors.primaryRgb}, 0.08)`; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <span style={{
                    background: p.subco.colors.primary,
                    color: '#FFFFFF',
                    borderRadius: 4,
                    padding: '4px 8px',
                    fontSize: 10, fontWeight: 900,
                    minWidth: 40, textAlign: 'center',
                  }}>
                    {p.subco.monogram}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)' }}>
                      {p.subco.name}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 2 }}>
                      {p.subco.tagline}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: 100 }}>
                    <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
                      Share
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-text)', fontFamily: 'var(--font-condensed)' }}>
                      {(p.share * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: 120 }}>
                    <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
                      6M Fwd Rev
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-blue)', fontFamily: 'var(--font-condensed)' }}>
                      {formatCurrency(p.fwd6mRev, true)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: 120 }}>
                    <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
                      Exit Run-Rate
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-text)', fontFamily: 'var(--font-condensed)' }}>
                      {formatCurrency(p.exitRevAnnualized, true)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: 60, fontSize: 11, fontWeight: 700, color: p.subco.colors.accent, letterSpacing: '0.06em' }}>
                    OPEN →
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Chart ── */}
      <div className="border overflow-hidden" style={{ background: 'var(--color-surf)', borderColor: 'var(--color-border)', borderRadius: 'var(--card-radius)', boxShadow: 'var(--card-shadow)' }}>
        <div className="px-4 py-2.5 border-b flex items-center justify-between flex-wrap gap-2"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-surf2)' }}>
          <span className="text-[13px] font-bold uppercase tracking-[0.10em]"
            style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)' }}>
            Revenue & Net Income — Actuals + Projections
          </span>
          <div className="flex items-center gap-4 text-[10px]" style={{ color: 'var(--color-muted)' }}>
            <span><span style={{ color: 'var(--color-blue)' }}>—</span> Revenue</span>
            <span><span style={{ color: 'var(--color-green)' }}>—</span> Net Income</span>
            <span style={{ color: 'var(--color-orange)' }}>│ Actuals / Projected boundary</span>
          </div>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={months} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <defs>
                <linearGradient id="revGradF" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#1B4DE6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#1B4DE6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="niGradF" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#F58A1F" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#F58A1F" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--color-chart-grid)" strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fill: 'var(--color-chart-text)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                tick={{ fill: 'var(--color-chart-text)', fontSize: 10 }}
                axisLine={false} tickLine={false} width={55}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(val, name, props) => {
                  const isAct = props.payload?.isActual;
                  return [`$${Number(val).toLocaleString()} ${isAct ? '(Actual)' : '(Projected)'}`, String(name)];
                }}
              />
              {/* Boundary line between last actual and first projected */}
              <ReferenceLine
                x={LAST_ACTUAL_MONTH}
                stroke="rgba(194,122,16,0.5)"
                strokeDasharray="4 3"
                label={{ value: '← Actual | Projected →', fill: '#D97706', fontSize: 9, position: 'top' }}
              />
              <Area type="monotone" dataKey="revenue"   stroke="#1B4DE6" fill="url(#revGradF)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="netIncome" stroke="#F58A1F" fill="url(#niGradF)"  strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Monthly Detail Table ── */}
      <div className="border overflow-hidden" style={{ background: 'var(--color-surf)', borderColor: 'var(--color-border)', borderRadius: 'var(--card-radius)', boxShadow: 'var(--card-shadow)' }}>
        <div className="px-4 py-2.5 border-b"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-surf2)' }}>
          <span className="text-[13px] font-bold uppercase tracking-[0.10em]"
            style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)' }}>
            Monthly Detail
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] border-collapse text-[14px]">
            <thead>
              <tr>
                {['Month', 'Revenue', 'COGS', 'Gross Profit', 'GM%', 'Payroll', 'Non-Payroll OpEx', 'Total OpEx', 'Net Income', 'NI %'].map((h, i) => (
                  <th key={h}
                    className="px-3 py-2 text-[11px] font-bold uppercase tracking-[0.08em] border-b"
                    style={{
                      textAlign: i === 0 ? 'left' : 'right',
                      fontFamily: 'var(--font-condensed)',
                      color: 'var(--color-muted)',
                      borderColor: 'var(--color-border)',
                      background: 'var(--color-surf2)',
                      whiteSpace: 'nowrap',
                    }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {months.map((m) => {
                const row = m as typeof m & { _payroll?: number; _nonPayroll?: number };
                const gmPct  = m.revenue > 0 ? (m.grossProfit / m.revenue) * 100 : 0;
                const niPct  = m.revenue > 0 ? (m.netIncome   / m.revenue) * 100 : 0;
                // For actuals, derive payroll from Apr known-data ratio; for projected, use stored _payroll
                const payroll    = m.isActual
                  ? Math.round(m.opex * 0.437) // Apr: $201,200 / $460,700 = 43.7% of OpEx is payroll
                  : (row._payroll ?? headcount * COST_PER_HEAD);
                const nonPayroll = m.isActual
                  ? m.opex - payroll
                  : (row._nonPayroll ?? m.opex - payroll);

                return (
                  <tr key={m.month}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      background: m.isActual
                        ? 'rgba(0,166,81,0.04)'
                        : 'transparent',
                    }}>
                    {/* Month label */}
                    <td className="px-3 py-2 font-semibold whitespace-nowrap"
                      style={{ fontFamily: 'var(--font-condensed)' }}>
                      {m.isActual ? (
                        <span className="flex items-center gap-1.5">
                          <span style={{ color: 'var(--color-green)', fontSize: 10 }}>🔒</span>
                          {m.label}
                          <span className="text-[8px] px-1 py-0.5 font-bold"
                            style={{ background: 'var(--color-green-d)', color: 'var(--color-green)', fontFamily: 'var(--font-condensed)' }}>
                            ACTUAL
                          </span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          {m.label}
                          <span className="text-[8px] px-1 py-0.5 font-bold"
                            style={{ background: 'var(--color-orange-d)', color: 'var(--color-orange)', fontFamily: 'var(--font-condensed)' }}>
                            PROJ
                          </span>
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right font-semibold" style={{ fontFamily: 'var(--font-condensed)' }}>{formatCurrency(m.revenue)}</td>
                    <td className="px-3 py-2 text-right" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-condensed)' }}>{formatCurrency(m.cogs)}</td>
                    <td className="px-3 py-2 text-right font-semibold" style={{ fontFamily: 'var(--font-condensed)' }}>{formatCurrency(m.grossProfit)}</td>
                    <td className="px-3 py-2 text-right text-[11px]"
                      style={{ fontFamily: 'var(--font-condensed)', color: gmPct >= 45 ? 'var(--color-green)' : 'var(--color-text)' }}>
                      {gmPct.toFixed(1)}%
                    </td>
                    {/* Payroll — highlighted on projected months so you can see headcount impact */}
                    <td className="px-3 py-2 text-right text-[11px]"
                      style={{ fontFamily: 'var(--font-condensed)', color: m.isActual ? 'var(--color-muted)' : 'var(--color-text)' }}>
                      {formatCurrency(payroll)}
                    </td>
                    <td className="px-3 py-2 text-right text-[11px]"
                      style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)' }}>
                      {formatCurrency(nonPayroll)}
                    </td>
                    <td className="px-3 py-2 text-right text-[11px]"
                      style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)' }}>
                      {formatCurrency(m.opex)}
                    </td>
                    <td className="px-3 py-2 text-right font-bold"
                      style={{ fontFamily: 'var(--font-condensed)', color: m.netIncome >= 0 ? 'var(--color-green)' : 'var(--color-red)' }}>
                      {formatCurrency(m.netIncome)}
                    </td>
                    <td className="px-3 py-2 text-right text-[11px]"
                      style={{ fontFamily: 'var(--font-condensed)', color: niPct >= 10 ? 'var(--color-green)' : niPct >= 5 ? 'var(--color-orange)' : 'var(--color-red)' }}>
                      {niPct.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
