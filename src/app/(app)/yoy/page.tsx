'use client';

import { getDemoYoY } from '@/lib/data/demo-data';
import { formatCurrency } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const yoy = getDemoYoY();

const CHART_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

const revenueData = yoy.currentYear.map((m, i) => ({
  month: CHART_LABELS[i],
  'FY 2026': m.revenue,
  'FY 2023': yoy.priorYear[i]?.revenue ?? 0,
}));

const CARD_STYLE = {
  background: 'var(--color-surf)',
  borderRadius: 'var(--card-radius)',
  boxShadow: 'var(--card-shadow)',
  border: '1px solid var(--color-border)',
};

const TOOLTIP_STYLE = {
  background: '#FFFFFF',
  border: '1px solid rgba(0,0,0,0.10)',
  borderRadius: 8,
  color: '#1A1A1A',
  fontSize: 12,
  boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
};

function Card({ children, className = '', style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`p-5 ${className}`} style={{ ...CARD_STYLE, ...style }}>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-[12px] font-bold uppercase tracking-[0.10em] mb-2"
      style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)', letterSpacing: '0.1em' }}
    >
      {children}
    </div>
  );
}

function Badge({ children, color, bg }: { children: React.ReactNode; color: string; bg: string }) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 text-[13px] font-bold rounded"
      style={{ background: bg, color, fontFamily: 'var(--font-condensed)', letterSpacing: '0.04em' }}
    >
      {children}
    </span>
  );
}

const MONTH_LABELS = ['January', 'February', 'March', 'April'];

export default function YoYPage() {
  const cur = yoy.currentYear;
  const pri = yoy.priorYear;
  const s = yoy.summary;

  // Compute YTD totals
  const ytdCurRev  = cur.reduce((a, m) => a + m.revenue, 0);
  const ytdPriRev  = pri.reduce((a, m) => a + m.revenue, 0);
  const ytdCurGP   = cur.reduce((a, m) => a + m.grossProfit, 0);
  const ytdPriGP   = pri.reduce((a, m) => a + m.grossProfit, 0);
  const ytdCurOpex = cur.reduce((a, m) => a + m.opex, 0);
  const ytdPriOpex = pri.reduce((a, m) => a + m.opex, 0);
  const ytdCurNI   = cur.reduce((a, m) => a + m.netIncome, 0);
  const ytdPriNI   = pri.reduce((a, m) => a + m.netIncome, 0);

  const ytdCurMargin = Math.round((ytdCurGP / ytdCurRev) * 1000) / 10;
  const ytdPriMargin = Math.round((ytdPriGP / ytdPriRev) * 1000) / 10;

  return (
    <div className="flex flex-col gap-5">
      {/* ── HEADER CARD ── */}
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div
              className="text-[32px] font-black uppercase leading-none"
              style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-text)', letterSpacing: '0.04em' }}
            >
              Year-over-Year
            </div>
            <div className="text-[15px] mt-1" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-condensed)' }}>
              Jan–Apr 2026 vs 2023
            </div>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Badge color="var(--color-green)" bg="var(--color-green-d)">Revenue Growth +{s.revenueGrowth}%</Badge>
            <Badge color="var(--color-blue)"  bg="var(--color-blue-d)">Margin Expansion +{s.grossMarginExpansion.toFixed(1)}pp</Badge>
            <Badge color="var(--color-orange)" bg="var(--color-orange-d)">OpEx Growth +{s.opexGrowth}% ⚠</Badge>
            <Badge color="var(--color-green)" bg="var(--color-green-d)">Net Income +{s.netIncomeGrowth}%</Badge>
          </div>
        </div>
      </Card>

      {/* ── 4 KPI COMPARISON CARDS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Revenue */}
        <Card>
          <Label>Revenue</Label>
          <div
            className="text-[32px] font-black leading-none"
            style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-text)' }}
          >
            {formatCurrency(ytdCurRev, true)}
          </div>
          <div className="text-[15px] mt-1.5" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-condensed)' }}>
            2023: {formatCurrency(ytdPriRev, true)}
          </div>
          <div className="mt-2">
            <Badge color="var(--color-green)" bg="var(--color-green-d)">+{s.revenueGrowth}%</Badge>
          </div>
        </Card>

        {/* Gross Margin */}
        <Card>
          <Label>Gross Margin</Label>
          <div
            className="text-[32px] font-black leading-none"
            style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-text)' }}
          >
            {ytdCurMargin.toFixed(1)}%
          </div>
          <div className="text-[15px] mt-1.5" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-condensed)' }}>
            2023: {ytdPriMargin.toFixed(1)}%
          </div>
          <div className="mt-2">
            <Badge color="var(--color-blue)" bg="var(--color-blue-d)">+{s.grossMarginExpansion.toFixed(1)}pp</Badge>
          </div>
        </Card>

        {/* OpEx */}
        <Card>
          <Label>OpEx</Label>
          <div
            className="text-[32px] font-black leading-none"
            style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-text)' }}
          >
            {formatCurrency(ytdCurOpex, true)}
          </div>
          <div className="text-[15px] mt-1.5" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-condensed)' }}>
            2023: {formatCurrency(ytdPriOpex, true)}
          </div>
          <div className="mt-2">
            <Badge color="var(--color-orange)" bg="var(--color-orange-d)">+{s.opexGrowth}% ⚠</Badge>
          </div>
        </Card>

        {/* Net Income */}
        <Card>
          <Label>Net Income</Label>
          <div
            className="text-[32px] font-black leading-none"
            style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-text)' }}
          >
            {formatCurrency(ytdCurNI, true)}
          </div>
          <div className="text-[15px] mt-1.5" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-condensed)' }}>
            2023: {formatCurrency(ytdPriNI, true)}
          </div>
          <div className="mt-2">
            <Badge color="var(--color-green)" bg="var(--color-green-d)">+{s.netIncomeGrowth}%</Badge>
          </div>
        </Card>
      </div>

      {/* ── REVENUE COMPARISON CHART ── */}
      <Card>
        <Label>Monthly Revenue — Jan–Apr 2026 vs Jan–Apr 2023</Label>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={revenueData} barGap={3} barCategoryGap="28%">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: 'var(--color-muted)', fontSize: 12, fontFamily: 'var(--font-condensed)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
              tick={{ fill: 'var(--color-muted)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={52}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(val) => [`$${Number(val).toLocaleString()}`, '']}
              cursor={{ fill: 'rgba(29,68,191,0.06)' }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, color: 'var(--color-muted)', fontFamily: 'var(--font-condensed)' }}
            />
            <Bar dataKey="FY 2023" fill="var(--color-muted)" fillOpacity={0.35} radius={[3, 3, 0, 0]} />
            <Bar dataKey="FY 2026" fill="var(--color-blue)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* ── COMPARISON TABLE ── */}
      <Card style={{ padding: 0 }}>
        <div className="px-5 pt-5 pb-3">
          <Label>Monthly Revenue Comparison</Label>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[520px]">
            <thead>
              <tr style={{ background: 'var(--color-surf2)' }}>
                {['Month', '2023 Revenue', '2026 Revenue', 'YoY Growth'].map((h, i) => (
                  <th
                    key={h}
                    className="px-[14px] py-3 text-[12px] font-bold uppercase tracking-[0.09em] border-b"
                    style={{
                      textAlign: i === 0 ? 'left' : 'right',
                      fontFamily: 'var(--font-condensed)',
                      color: 'var(--color-muted)',
                      borderColor: 'var(--color-border)',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cur.map((m, idx) => {
                const priRev = pri[idx]?.revenue ?? 0;
                const growthPct = priRev > 0 ? ((m.revenue - priRev) / priRev) * 100 : 0;
                const growthColor = growthPct >= 0 ? 'var(--color-green)' : 'var(--color-red)';
                const isLast = idx === cur.length - 1;
                return (
                  <tr
                    key={m.month}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      background: isLast ? 'rgba(29,68,191,0.06)' : 'transparent',
                    }}
                  >
                    <td
                      className="px-[14px] py-[14px] text-[15px] font-bold"
                      style={{ fontFamily: 'var(--font-condensed)', color: isLast ? 'var(--color-blue)' : 'var(--color-text)' }}
                    >
                      {MONTH_LABELS[idx]}
                    </td>
                    <td
                      className="px-[14px] py-[14px] text-[15px] text-right"
                      style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)' }}
                    >
                      {formatCurrency(priRev, true)}
                    </td>
                    <td
                      className="px-[14px] py-[14px] text-[15px] text-right font-bold"
                      style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-text)' }}
                    >
                      {formatCurrency(m.revenue, true)}
                    </td>
                    <td className="px-[14px] py-[14px] text-right">
                      <span
                        className="inline-block text-[14px] font-black px-2 py-0.5 rounded"
                        style={{
                          fontFamily: 'var(--font-condensed)',
                          color: growthColor,
                          background: growthPct >= 0 ? 'var(--color-green-d)' : 'var(--color-red-d)',
                        }}
                      >
                        {growthPct >= 0 ? '+' : ''}{growthPct.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── KEY INSIGHT CARD ── */}
      <div
        style={{
          ...CARD_STYLE,
          borderLeft: '4px solid var(--color-blue)',
          padding: '20px 24px',
        }}
      >
        <div
          className="text-[12px] font-bold uppercase tracking-[0.10em] mb-3"
          style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-blue)' }}
        >
          Key Insights — What Drove YoY Performance
        </div>
        <ul className="flex flex-col gap-2.5" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {[
            'ShipBob renegotiation delivered a structural COGS improvement mid-April — $14K/month in fulfilled savings that will compound from May onward, directly expanding gross margin from 43.9% (2023) to 43.3% (2026 Apr).',
            'DTC channel mix shift drove higher-margin revenue: e-commerce now represents a larger share of the top line, and the Apr 12 email campaign generated a 14% conversion spike without any discounting, demonstrating pricing power vs 2023.',
            'OpEx concern: expenses grew +22.1% YoY versus revenue growth of +18.4% — operating leverage is not yet materializing. The divergence is concentrated in marketing spend, which at $171K in April was the largest overage in 14 months and inflated the YoY OpEx line. If April normalizes in May, the full-year OpEx growth rate drops to roughly 15%, putting the business back on the right side of leverage.',
          ].map((bullet, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span
                className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full"
                style={{ background: 'var(--color-blue)', marginTop: 7 }}
              />
              <span className="text-[14px] leading-relaxed" style={{ color: 'var(--color-text)' }}>
                {bullet}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
