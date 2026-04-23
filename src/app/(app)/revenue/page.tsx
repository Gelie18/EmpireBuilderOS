'use client';

import { useState } from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import PeriodSelector, { type PeriodKey } from '@/components/ui/PeriodSelector';

// ─── Constants ───────────────────────────────────────────────────────────────

const BLUE   = '#1B4DE6';
const GOLD   = '#F58A1F';
const GREEN  = '#0A8A5C';
const RED    = '#C13333';
const ORANGE = '#D97706';
const PURPLE = '#7C3AED';
const GRAY   = 'rgba(255,255,255,0.50)';

// ─── Data ────────────────────────────────────────────────────────────────────

const PRODUCT_LINES = [
  { name: 'Industrial Equipment', revenue: 487200, pct: 37.2, color: BLUE,   recurring: false },
  { name: 'Parts & Components',   revenue: 340800, pct: 26.0, color: GRAY,   recurring: false },
  { name: 'Maintenance Contracts',revenue: 213600, pct: 16.3, color: GREEN,  recurring: true  },
  { name: 'Professional Services',revenue: 186000, pct: 14.2, color: ORANGE, recurring: false },
  { name: 'Service Retainers',    revenue: 84000,  pct: 6.4,  color: PURPLE, recurring: true  },
];

const CUSTOMERS = [
  { name: 'MegaCorp Industries',   oct: 312500, pctTotal: 23.8, ytd: '2,847K', type: 'Mixed',     flagged: true  },
  { name: 'Wexler Distribution',   oct: 198000, pctTotal: 15.1, ytd: '1,801K', type: 'Equipment', flagged: false },
  { name: 'Summit Holdings',       oct: 156200, pctTotal: 11.9, ytd: '1,421K', type: 'Service',   flagged: false },
  { name: 'Pinnacle Industrial',   oct: 134800, pctTotal: 10.3, ytd: '1,227K', type: 'Parts',     flagged: false },
  { name: 'Northland Corp',        oct: 112400, pctTotal: 8.6,  ytd: '1,023K', type: 'Mixed',     flagged: false },
  { name: 'Cascade Systems',       oct: 89600,  pctTotal: 6.8,  ytd: '815K',   type: 'Parts',     flagged: false },
  { name: 'Blue Ridge Partners',   oct: 71200,  pctTotal: 5.4,  ytd: '648K',   type: 'Service',   flagged: false },
  { name: 'Other (41 accounts)',   oct: 236900, pctTotal: 18.1, ytd: '2,155K', type: 'Various',   flagged: false },
];

const TREND_DATA = [
  { month: 'May', revenue: 1190000 },
  { month: 'Jun', revenue: 1220000 },
  { month: 'Jul', revenue: 1270000 },
  { month: 'Aug', revenue: 1260000 },
  { month: 'Sep', revenue: 1270000 },
  { month: 'Oct', revenue: 1311600 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtUSD(n: number): string {
  return '$' + n.toLocaleString('en-US');
}

function fmtCompact(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`;
  return fmtUSD(n);
}

// ─── Shared styles ───────────────────────────────────────────────────────────

const CARD: React.CSSProperties = {
  background:   'var(--color-surf)',
  borderRadius: 'var(--card-radius)',
  boxShadow:    'var(--card-shadow)',
  border:       '1px solid var(--color-border)',
  overflow:     'hidden',
};

const CARD_HEADER: React.CSSProperties = {
  background:    'var(--color-surf2)',
  borderBottom:  '1px solid var(--color-border)',
  padding:       '12px 20px',
};

const CARD_HEADER_TITLE: React.CSSProperties = {
  fontSize:   13,
  fontWeight: 600,
  color:      'var(--color-text)',
  margin:     0,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const TOOLTIP_STYLE: React.CSSProperties = {
  background:   '#1E2236',
  border:       '1px solid rgba(255,255,255,0.10)',
  color:        '#FFFFFF',
  fontSize:     12,
  boxShadow:    '0 1px 4px rgba(0,0,0,0.30), 0 4px 16px rgba(0,0,0,0.25)',
  borderRadius: 8,
};

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function RevenueTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ ...TOOLTIP_STYLE, padding: '10px 14px' }}>
      <div style={{ fontWeight: 600, marginBottom: 4, color: '#FFFFFF' }}>{label}</div>
      <div style={{ color: BLUE, fontWeight: 700 }}>{fmtCompact(payload[0].value)}</div>
    </div>
  );
}

function ProductTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ ...TOOLTIP_STYLE, padding: '10px 14px' }}>
      <div style={{ fontWeight: 600, marginBottom: 4, color: '#FFFFFF' }}>{label}</div>
      <div style={{ color: BLUE, fontWeight: 700 }}>{fmtCompact(payload[0].value)}</div>
    </div>
  );
}

// ─── Section 1: KPI Strip ────────────────────────────────────────────────────

const PERIOD_REV: Record<PeriodKey, { revenue: string; mrr: string; arr: string; recurring: string; label: string }> = {
  current: { revenue: '$1.31M',   mrr: '$297.6K',     arr: '$3.57M', recurring: '22.7%', label: 'Apr 2026' },
  last:    { revenue: '$1.27M',   mrr: '$289.4K',     arr: '$3.47M', recurring: '22.8%', label: 'Mar 2026' },
  last3:   { revenue: '$3.82M',   mrr: '$295K avg',   arr: '$3.54M', recurring: '23.1%', label: 'Feb–Apr 2026' },
  ytd:     { revenue: '$12.85M',  mrr: '$284K avg',   arr: '$3.41M', recurring: '22.1%', label: 'YTD 2026' },
  last12:  { revenue: '$15.64M',  mrr: '$271K avg',   arr: '$3.25M', recurring: '20.8%', label: 'Last 12M' },
};

function KpiStrip({ period }: { period: PeriodKey }) {
  const prd = PERIOD_REV[period];
  const cards = [
    { label: 'Total Revenue', value: prd.revenue,   accent: GREEN },
    { label: 'MRR',           value: prd.mrr,        accent: BLUE  },
    { label: 'ARR',           value: prd.arr,        accent: BLUE  },
    { label: 'Recurring %',   value: prd.recurring, accent: GOLD  },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {cards.map((k) => (
        <div
          key={k.label}
          style={{
            ...CARD,
            borderTop:  `4px solid ${k.accent}`,
            padding:    '20px 16px 24px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div
              style={{
                fontSize:      11,
                fontWeight:    600,
                color:         'rgba(255,255,255,0.50)',
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
                marginBottom:  10,
              }}
            >
              {k.label}
            </div>
            <div
              style={{
                fontSize:      34,
                fontWeight:    800,
                color:         'var(--color-text)',
                letterSpacing: '-0.02em',
                lineHeight:    1.1,
              }}
            >
              {k.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Section 2: Revenue by Product Line ──────────────────────────────────────

const barData = PRODUCT_LINES.map((p) => ({ name: p.name, revenue: p.revenue }));

function ProductLineSection() {
  return (
    <div style={CARD}>
      <div style={CARD_HEADER}>
        <p style={CARD_HEADER_TITLE}>Revenue by Product Line — April 2026</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 0 }}>
        {/* Chart */}
        <div style={{ padding: '24px 16px 24px 24px', borderRight: '1px solid var(--color-border)' }}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              layout="vertical"
              data={barData}
              margin={{ top: 0, right: 16, bottom: 0, left: 8 }}
            >
              <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="var(--color-chart-grid)" />
              <XAxis
                type="number"
                tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`}
                tick={{ fill: 'var(--color-chart-text)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: '#FFFFFF', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={140}
              />
              <Tooltip content={<ProductTooltip />} />
              <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                {PRODUCT_LINES.map((p) => (
                  <Cell key={p.name} fill={p.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', marginTop: 12 }}>
            {PRODUCT_LINES.map((p) => (
              <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: p.color, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: GRAY }}>{p.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--color-surf2)' }}>
                {['Product Line', 'Revenue', '%', 'Type'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding:     '10px 14px',
                      textAlign:   h === 'Revenue' || h === '%' ? 'right' : 'left',
                      fontSize:    11,
                      fontWeight:  600,
                      color:       GRAY,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: '1px solid var(--color-border)',
                      whiteSpace:  'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PRODUCT_LINES.map((p, i) => (
                <tr
                  key={p.name}
                  style={{
                    background:  i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.03)',
                    borderBottom: '1px solid var(--color-border)',
                  }}
                >
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        style={{
                          width:        3,
                          height:       28,
                          borderRadius: 2,
                          background:   p.color,
                          flexShrink:   0,
                        }}
                      />
                      <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 600, color: 'var(--color-text)' }}>
                    {fmtUSD(p.revenue)}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', color: GRAY }}>
                    {p.pct}%
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    {p.recurring ? (
                      <span
                        style={{
                          display:      'inline-block',
                          padding:      '2px 8px',
                          borderRadius: 20,
                          fontSize:     11,
                          fontWeight:   600,
                          background:   'rgba(10,138,92,0.10)',
                          color:        GREEN,
                          whiteSpace:   'nowrap',
                        }}
                      >
                        RECURRING
                      </span>
                    ) : (
                      <span
                        style={{
                          display:      'inline-block',
                          padding:      '2px 8px',
                          borderRadius: 20,
                          fontSize:     11,
                          fontWeight:   600,
                          background:   'rgba(107,114,128,0.10)',
                          color:        GRAY,
                          whiteSpace:   'nowrap',
                        }}
                      >
                        ONE-TIME
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Section 3: Customer Concentration ───────────────────────────────────────

function CustomerSection() {
  return (
    <div style={CARD}>
      <div style={CARD_HEADER}>
        <p style={CARD_HEADER_TITLE}>Customer Concentration — April 2026</p>
      </div>

      {/* Warning banner */}
      <div
        style={{
          margin:       '16px 20px 0',
          padding:      '12px 16px',
          background:   'rgba(220,38,38,0.06)',
          border:       `1px solid rgba(193,51,51,0.25)`,
          borderRadius: 8,
          display:      'flex',
          gap:          10,
          alignItems:   'flex-start',
        }}
      >
        <span style={{ fontSize: 16, flexShrink: 0 }}>⚠</span>
        <p style={{ margin: 0, fontSize: 13, color: RED, lineHeight: 1.5 }}>
          <strong>Concentration Risk:</strong> MegaCorp Industries represents 23.8% of revenue,
          exceeding the 20% threshold. Dependency creates revenue vulnerability.
        </p>
      </div>

      {/* Table */}
      <div style={{ padding: '16px 0 0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--color-surf2)' }}>
              {['Customer', 'Apr Revenue', '% of Total', 'YTD Revenue', 'Type', 'Status'].map((h) => (
                <th
                  key={h}
                  style={{
                    padding:       '10px 16px',
                    textAlign:     h === 'Apr Revenue' || h === 'YTD Revenue' ? 'right' : 'left',
                    fontSize:      11,
                    fontWeight:    600,
                    color:         GRAY,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottom:  '1px solid var(--color-border)',
                    whiteSpace:    'nowrap',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CUSTOMERS.map((c, i) => (
              <tr
                key={c.name}
                style={{
                  background:  c.flagged ? 'rgba(220,38,38,0.04)' : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.03)',
                  borderBottom: '1px solid var(--color-border)',
                  borderLeft:   c.flagged ? `3px solid ${RED}` : '3px solid transparent',
                }}
              >
                <td style={{ padding: '10px 16px' }}>
                  <span style={{ fontWeight: c.flagged ? 700 : 500, color: c.flagged ? RED : '#FFFFFF' }}>
                    {c.name}
                  </span>
                </td>
                <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 600, color: 'var(--color-text)' }}>
                  {fmtUSD(c.oct)}
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width:        80,
                        height:       6,
                        borderRadius: 3,
                        background:   'rgba(255,255,255,0.08)',
                        overflow:     'hidden',
                        flexShrink:   0,
                      }}
                    >
                      <div
                        style={{
                          height:       '100%',
                          width:        `${Math.min(c.pctTotal / 30 * 100, 100)}%`,
                          background:   c.flagged ? RED : BLUE,
                          borderRadius: 3,
                          transition:   'width 0.4s ease',
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize:   12,
                        fontWeight: 600,
                        color:      c.flagged ? RED : '#FFFFFF',
                        minWidth:   36,
                      }}
                    >
                      {c.pctTotal}%
                    </span>
                  </div>
                </td>
                <td style={{ padding: '10px 16px', textAlign: 'right', color: GRAY }}>
                  ${c.ytd}
                </td>
                <td style={{ padding: '10px 16px', color: GRAY }}>
                  {c.type}
                </td>
                <td style={{ padding: '10px 16px' }}>
                  {c.flagged ? (
                    <span
                      style={{
                        display:      'inline-flex',
                        alignItems:   'center',
                        gap:          4,
                        padding:      '3px 8px',
                        borderRadius: 20,
                        fontSize:     11,
                        fontWeight:   700,
                        background:   'rgba(193,51,51,0.10)',
                        color:        RED,
                        whiteSpace:   'nowrap',
                      }}
                    >
                      ⚠ FLAGGED
                    </span>
                  ) : (
                    <span style={{ color: GRAY, fontSize: 13 }}>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Section 4: Recurring vs One-Time ────────────────────────────────────────

const RECURRING_ITEMS = [
  { label: 'Maintenance Contracts', value: '$213,600' },
  { label: 'Service Retainers',     value: '$84,000'  },
];

const ONETIME_ITEMS = [
  { label: 'Equipment Sales',    value: '$487,200' },
  { label: 'Parts & Components', value: '$340,800' },
  { label: 'Prof. Services',     value: '$186,000' },
];

function RecurringSection() {
  return (
    <div>
      {/* Split Bar */}
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            display:       'flex',
            alignItems:    'center',
            gap:           8,
            marginBottom:  6,
          }}
        >
          <span style={{ fontSize: 12, color: GREEN, fontWeight: 600 }}>Recurring 22.7%</span>
          <span style={{ fontSize: 12, color: GRAY }}>|</span>
          <span style={{ fontSize: 12, color: BLUE, fontWeight: 600 }}>One-Time 77.3%</span>
        </div>
        <div
          style={{
            height:       12,
            borderRadius: 6,
            background:   'rgba(255,255,255,0.10)',
            overflow:     'hidden',
            display:      'flex',
          }}
        >
          <div
            style={{
              width:      '22.7%',
              height:     '100%',
              background: GREEN,
              transition: 'width 0.5s ease',
            }}
          />
          <div
            style={{
              width:      '77.3%',
              height:     '100%',
              background: BLUE,
            }}
          />
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Recurring Card */}
        <div style={{ ...CARD, borderTop: `4px solid ${GREEN}` }}>
          <div style={{ ...CARD_HEADER, borderTop: 'none' }}>
            <p style={CARD_HEADER_TITLE}>Recurring Revenue</p>
          </div>
          <div style={{ padding: '20px 20px 24px' }}>
            <div className="grid grid-cols-2 gap-4" style={{ marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-chart-text)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>MRR</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>$297,600</div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-chart-text)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>ARR</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>$3,571,200</div>
              </div>
            </div>
            <div
              style={{
                display:      'inline-block',
                padding:      '4px 12px',
                borderRadius: 20,
                fontSize:     12,
                fontWeight:   700,
                background:   'rgba(10,138,92,0.10)',
                color:        GREEN,
                marginBottom: 16,
              }}
            >
              22.7% of Total Revenue
            </div>
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
              {RECURRING_ITEMS.map((item) => (
                <div
                  key={item.label}
                  style={{
                    display:        'flex',
                    justifyContent: 'space-between',
                    alignItems:     'center',
                    padding:        '7px 0',
                    borderBottom:   '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: GREEN, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: 'var(--color-text)' }}>{item.label}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* One-Time Card */}
        <div style={{ ...CARD, borderTop: `4px solid ${BLUE}` }}>
          <div style={{ ...CARD_HEADER, borderTop: 'none' }}>
            <p style={CARD_HEADER_TITLE}>One-Time Revenue</p>
          </div>
          <div style={{ padding: '20px 20px 24px' }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-chart-text)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>Total One-Time</div>
              <div style={{ fontSize: 34, fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>$1,014,000</div>
            </div>
            <div
              style={{
                display:      'inline-block',
                padding:      '4px 12px',
                borderRadius: 20,
                fontSize:     12,
                fontWeight:   700,
                background:   'rgba(27,77,230,0.10)',
                color:        BLUE,
                marginBottom: 16,
              }}
            >
              77.3% of Total Revenue
            </div>
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
              {ONETIME_ITEMS.map((item) => (
                <div
                  key={item.label}
                  style={{
                    display:        'flex',
                    justifyContent: 'space-between',
                    alignItems:     'center',
                    padding:        '7px 0',
                    borderBottom:   '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: BLUE, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: 'var(--color-text)' }}>{item.label}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section 5: MoM Trend ────────────────────────────────────────────────────

function TrendSection() {
  return (
    <div style={CARD}>
      <div style={CARD_HEADER}>
        <p style={CARD_HEADER_TITLE}>Revenue Trend — 6-Month Rolling</p>
      </div>
      <div style={{ padding: '24px 24px 20px' }}>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={TREND_DATA} margin={{ top: 8, right: 24, bottom: 0, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-chart-grid)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: 'var(--color-chart-text)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v: number) => `$${(v / 1_000_000).toFixed(2)}M`}
              tick={{ fill: 'var(--color-chart-text)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              domain={[1_100_000, 1_400_000]}
              width={72}
            />
            <Tooltip content={<RevenueTooltip />} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke={BLUE}
              strokeWidth={2.5}
              dot={{ fill: BLUE, r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: BLUE, strokeWidth: 2, stroke: '#FFFFFF' }}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Trend summary */}
        <div
          style={{
            marginTop:            16,
            paddingTop:           16,
            borderTop:            '1px solid var(--color-border)',
            display:              'flex',
            justifyContent:       'space-between',
            flexWrap:             'wrap',
            gap:                  12,
          }}
        >
          {[
            { label: 'May Baseline', value: '$1.19M', color: 'var(--color-chart-text)' },
            { label: 'Apr Actual',   value: '$1.31M', color: BLUE },
            { label: '6-Mo Growth',  value: '+10.2%', color: GREEN },
            { label: '6-Mo Avg',     value: '$1.26M', color: 'var(--color-chart-text)' },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: 'var(--color-chart-text)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>
                {s.label}
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: s.color, letterSpacing: '-0.02em' }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RevenuePage() {
  const [period, setPeriod] = useState<PeriodKey>('current');

  return (
    <div style={{ background: '#0B0D17', minHeight: '100vh', padding: '28px 28px 48px' }}>
      {/* Page header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <h1
                style={{
                  fontSize:      22,
                  fontWeight:    800,
                  color:         'var(--color-text)',
                  margin:        0,
                  letterSpacing: '-0.01em',
                }}
              >
                Revenue Intelligence
              </h1>
              <PeriodSelector value={period} onChange={setPeriod} />
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--color-muted)' }}>
              783 Partners &nbsp;·&nbsp; {PERIOD_REV[period].label}
            </p>
          </div>
          <div
            style={{
              display:      'inline-flex',
              alignItems:   'center',
              gap:          6,
              padding:      '6px 14px',
              borderRadius: 20,
              background:   'rgba(10,138,92,0.10)',
              border:       `1px solid rgba(5,150,105,0.25)`,
              fontSize:     12,
              fontWeight:   600,
              color:        GREEN,
            }}
          >
            <span
              style={{
                display:      'inline-block',
                width:        7,
                height:       7,
                borderRadius: '50%',
                background:   GREEN,
              }}
            />
            Live Demo Data
          </div>
        </div>
      </div>

      {/* Content sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <KpiStrip period={period} />
        <ProductLineSection />
        <CustomerSection />
        <RecurringSection />
        <TrendSection />
      </div>
    </div>
  );
}
