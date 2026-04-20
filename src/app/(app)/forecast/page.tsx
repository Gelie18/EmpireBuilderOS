'use client';

import { useState, useMemo } from 'react';
import { getDemoForecast } from '@/lib/data/demo-data';
import { formatCurrency } from '@/lib/utils';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, CartesianGrid, ReferenceLine,
} from 'recharts';

// ── Constants ─────────────────────────────────────────────────────────────────

// Monthly fully-loaded cost per head (payroll + benefits + overhead)
// Derived from Oct actuals: $201,200 payroll ÷ 42 people = $4,790/mo
const COST_PER_HEAD = 4_790;

// The last actual month — all projections compound from here
const LAST_ACTUAL_MONTH = "Oct '24";

const TOOLTIP_STYLE = {
  background: '#FFFFFF',
  border: '1px solid rgba(0,0,0,0.10)',
  borderRadius: 8,
  color: '#1A1A1A',
  fontSize: 12,
  boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ForecastPage() {
  const baseForecast = getDemoForecast();
  const [drivers, setDrivers] = useState(baseForecast.drivers);

  // ── The actual months are FROZEN — never recalculated ──
  // ── Only projected months (isActual === false) are recomputed ──
  const months = useMemo(() => {
    const revGrowth     = (drivers.find((d) => d.id === 'rev-growth')?.value  ?? 3)    / 100;
    const cogsPct       = (drivers.find((d) => d.id === 'cogs-pct')?.value    ?? 54.9) / 100;
    const nonPayrollPct = (drivers.find((d) => d.id === 'opex-pct')?.value    ?? 19.8) / 100;
    const headcount     =  drivers.find((d) => d.id === 'headcount')?.value   ?? 42;

    // Lock in the last actual's revenue as the compounding base
    const actuals = baseForecast.months.filter((m) => m.isActual);
    const lastActualRevenue = actuals[actuals.length - 1].revenue; // Oct '24 = $1,311,600

    let projIndex = 0; // counts only projected months (1, 2, 3 …)

    return baseForecast.months.map((m) => {
      // ── ACTUAL: return exactly as stored — no driver touches it ──
      if (m.isActual) return m;

      // ── PROJECTED: recompute from drivers ──
      projIndex++;

      const rev          = Math.round(lastActualRevenue * Math.pow(1 + revGrowth, projIndex));
      const cogs         = Math.round(rev * cogsPct);
      const gp           = rev - cogs;
      const payrollOpEx  = headcount * COST_PER_HEAD;           // headcount × $/head
      const nonPayrollOpEx = Math.round(rev * nonPayrollPct);   // mktg + tech + G&A
      const totalOpEx    = payrollOpEx + nonPayrollOpEx;
      const ni           = gp - totalOpEx;

      return {
        ...m,
        revenue: rev,
        cogs,
        grossProfit: gp,
        opex: totalOpEx,
        netIncome: ni,
        // store breakdown for tooltip / table
        _payroll: payrollOpEx,
        _nonPayroll: nonPayrollOpEx,
      };
    });
  }, [drivers, baseForecast.months]);

  const updateDriver = (id: string, value: number) => {
    setDrivers((prev) => prev.map((d) => (d.id === id ? { ...d, value } : d)));
  };

  // ── Summary metrics (projected only, so actuals don't distort the forward view) ──
  const projected   = months.filter((m) => !m.isActual);
  const totalFwdRev = projected.reduce((s, m) => s + m.revenue, 0);
  const totalFwdNI  = projected.reduce((s, m) => s + m.netIncome, 0);
  const exitMonth   = projected[projected.length - 1];

  // Derived driver values for display
  const headcount     = drivers.find((d) => d.id === 'headcount')?.value  ?? 42;
  const baseHeadcount = 42; // Oct actual
  const hcDelta       = headcount - baseHeadcount;
  const monthlyPayroll = headcount * COST_PER_HEAD;

  return (
    <div className="flex flex-col gap-5">
      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="text-[22px] font-black uppercase tracking-[0.04em]"
            style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-text)' }}>
            Driver Model — 12-Month Forecast
          </div>
          <div className="text-[12px] mt-0.5" style={{ color: 'var(--color-muted)' }}>
            Actuals locked May–Oct 2024 · Projections Nov 2024–Apr 2025
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          <div className="border px-3 py-2" style={{ background: 'var(--color-surf)', borderColor: 'var(--color-border)', borderRadius: 'var(--card-radius)', boxShadow: 'var(--card-shadow)' }}>
            <div className="text-[13px] font-bold uppercase tracking-[0.10em]"
              style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)' }}>6M Fwd Revenue</div>
            <div className="text-[36px] font-black"
              style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-blue)', fontWeight: 900 }}>{formatCurrency(totalFwdRev, true)}</div>
          </div>
          <div className="border px-3 py-2" style={{ background: 'var(--color-surf)', borderColor: 'var(--color-border)', borderRadius: 'var(--card-radius)', boxShadow: 'var(--card-shadow)' }}>
            <div className="text-[13px] font-bold uppercase tracking-[0.10em]"
              style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)' }}>6M Fwd Net Income</div>
            <div className="text-[36px] font-black"
              style={{ fontFamily: 'var(--font-condensed)', color: totalFwdNI >= 0 ? 'var(--color-green)' : 'var(--color-red)', fontWeight: 900 }}>
              {formatCurrency(totalFwdNI, true)}
            </div>
          </div>
          <div className="border px-3 py-2" style={{ background: 'var(--color-surf)', borderColor: 'var(--color-border)', borderRadius: 'var(--card-radius)', boxShadow: 'var(--card-shadow)' }}>
            <div className="text-[13px] font-bold uppercase tracking-[0.10em]"
              style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)' }}>Exit Run Rate</div>
            <div className="text-[36px] font-black"
              style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-text)', fontWeight: 900 }}>
              {exitMonth ? formatCurrency(exitMonth.revenue * 12, true) : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* ── Actuals-locked callout ── */}
      <div className="flex items-center gap-3 px-3.5 py-2.5 border-l-[3px]"
        style={{ background: 'rgba(0,166,81,0.07)', borderLeft: '3px solid var(--color-green)' }}>
        <span style={{ color: 'var(--color-green)', fontSize: 16 }}>🔒</span>
        <div className="text-[11px] leading-snug" style={{ color: 'var(--color-muted)' }}>
          <strong style={{ color: 'var(--color-green)' }}>Actuals locked</strong> — May through October 2024 are real P&L data and are never recalculated.
          Sliders only affect the <strong style={{ color: 'var(--color-orange)' }}>6 projected months</strong> (Nov 2024 – Apr 2025),
          compounding from Oct's actual revenue of <strong style={{ color: 'var(--color-blue)' }}>$1,311,600</strong>.
        </div>
      </div>

      {/* ── Driver Controls ── */}
      <div className="border p-4" style={{ background: 'var(--color-surf)', borderColor: 'var(--color-border)', borderRadius: 'var(--card-radius)', boxShadow: 'var(--card-shadow)' }}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="text-[13px] font-bold uppercase tracking-[0.10em]"
            style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)' }}>
            Projection Drivers — Affects Nov 2024 – Apr 2025 Only
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
                       `No change vs Oct`}
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
              </div>
            );
          })}
        </div>
      </div>

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
                  <stop offset="5%"  stopColor="#1D44BF" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#1D44BF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="niGradF" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#00A651" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#00A651" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(0,0,0,0.06)" strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fill: '#6B7A8D', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                tick={{ fill: '#6B7A8D', fontSize: 10 }}
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
                stroke="rgba(255,107,53,0.5)"
                strokeDasharray="4 3"
                label={{ value: '← Actual | Projected →', fill: '#FF6B35', fontSize: 9, position: 'top' }}
              />
              <Area type="monotone" dataKey="revenue"   stroke="#1D44BF" fill="url(#revGradF)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="netIncome" stroke="#00A651" fill="url(#niGradF)"  strokeWidth={2} dot={false} />
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
                // For actuals, derive payroll from Oct known-data ratio; for projected, use stored _payroll
                const payroll    = m.isActual
                  ? Math.round(m.opex * 0.437) // Oct: $201,200 / $460,700 = 43.7% of OpEx is payroll
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
