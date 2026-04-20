'use client';

import { useState } from 'react';
import { getDemoCashFlow } from '@/lib/data/demo-data';
import { formatCurrency } from '@/lib/utils';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from 'recharts';
import PeriodSelector, { type PeriodKey } from '@/components/ui/PeriodSelector';

const TOOLTIP_STYLE = {
  background:   '#FFFFFF',
  border:       '1px solid rgba(0,0,0,0.10)',
  borderRadius: 8,
  color:        '#1A1A1A',
  fontSize:     12,
  boxShadow:    '0 4px 16px rgba(0,0,0,0.10)',
};

const CARD: React.CSSProperties = {
  background:   'var(--color-surf)',
  borderRadius: 'var(--card-radius)',
  boxShadow:    'var(--card-shadow)',
  border:       '1px solid var(--color-border)',
};

// ── Small reusable components ─────────────────────────────────────────────────

function StatBadge({
  label,
  value,
  color,
  dimColor,
}: {
  label: string;
  value: string;
  color: string;
  dimColor: string;
}) {
  return (
    <div
      style={{
        background:   dimColor,
        border:       `1px solid ${color}44`,
        borderRadius: 10,
        padding:      '10px 18px',
        display:      'inline-flex',
        flexDirection: 'column',
        gap:          2,
      }}
    >
      <div
        style={{
          fontFamily:    'var(--font-condensed)',
          fontSize:      10,
          fontWeight:    700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color:         'var(--color-muted)',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-condensed)',
          fontSize:   20,
          fontWeight: 900,
          color,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background:    'var(--color-surf2)',
        padding:       '7px 16px',
        fontFamily:    'var(--font-condensed)',
        fontSize:      13,
        fontWeight:    700,
        textTransform: 'uppercase',
        letterSpacing: '0.09em',
        color:         'var(--color-muted)',
        borderTop:     '1px solid var(--color-border)',
        borderBottom:  '1px solid var(--color-border)',
      }}
    >
      {children}
    </div>
  );
}

// ── Period-aware data ─────────────────────────────────────────────────────────
const PERIOD_CF: Record<PeriodKey, {
  closingBalance: number; runway: number;
  operating: number; investing: number; financing: number;
  label: string;
}> = {
  current: { closingBalance: 873_500, runway: 8.2, operating: 142_800, investing: -48_200, financing: -12_400, label: 'Oct 2026' },
  last:    { closingBalance: 851_000, runway: 8.0, operating: 128_400, investing: -22_000, financing:       0, label: 'Sep 2026' },
  last3:   { closingBalance: 873_500, runway: 8.2, operating: 384_200, investing: -98_400, financing: -22_000, label: 'Aug–Oct 2026' },
  ytd:     { closingBalance: 873_500, runway: 8.2, operating: 1_284_000, investing: -248_000, financing: -87_000, label: 'YTD 2026' },
  last12:  { closingBalance: 873_500, runway: 8.2, operating: 1_847_000, investing: -312_000, financing: -124_000, label: 'TTM' },
};

function fmtCF(n: number): string {
  if (n === 0) return '$0';
  const abs = Math.abs(n);
  const formatted = abs >= 1_000_000
    ? `$${(abs / 1_000_000).toFixed(2)}M`
    : abs >= 1_000
    ? `$${(abs / 1_000).toFixed(0)}K`
    : `$${abs.toLocaleString()}`;
  return n > 0 ? `+${formatted}` : `–${formatted}`;
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function CashFlowPage() {
  const cf = getDemoCashFlow();
  const [period, setPeriod] = useState<PeriodKey>('current');
  const pcd = PERIOD_CF[period];

  // Build chart data: historical points only, sampled every 3 days
  const chartData = cf.dailyForecast
    .filter((p) => !p.isProjected)
    .filter((_, i) => i % 3 === 0)
    .map((p) => ({
      date: p.date.slice(5),   // "MM-DD"
      Cash: p.balance,
    }));

  const sections = [cf.operating, cf.investing, cf.financing];

  return (
    <div className="flex flex-col gap-5">

      {/* ── Header card ── */}
      <div
        style={{ ...CARD, padding: '22px 26px' }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div
            style={{
              fontFamily:    'var(--font-condensed)',
              fontSize:      10,
              fontWeight:    700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color:         'var(--color-muted)',
              marginBottom:  4,
            }}
          >
            Cash Flow Statement
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div
              style={{
                fontFamily:    'var(--font-condensed)',
                fontSize:      32,
                fontWeight:    900,
                lineHeight:    1,
                color:         'var(--color-text)',
                letterSpacing: '0.02em',
              }}
            >
              Cash Flow
            </div>
            <PeriodSelector value={period} onChange={setPeriod} />
          </div>
          <div
            style={{
              fontSize:  13,
              color:     'var(--color-muted)',
              marginTop: 5,
            }}
          >
            {pcd.label}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <StatBadge
            label="Cash on Hand"
            value={formatCurrency(pcd.closingBalance, true)}
            color="var(--color-green)"
            dimColor="var(--color-green-d)"
          />
          <StatBadge
            label="Runway"
            value={`${pcd.runway} months`}
            color="var(--color-blue)"
            dimColor="var(--color-blue-d)"
          />
        </div>
      </div>

      {/* ── 3 KPI cards — period-aware ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label:    'Operating Cash Flow',
            value:    pcd.operating,
            sub:      'Core business activity',
            color:    'var(--color-green)',
          },
          {
            label:    'Investing Cash Flow',
            value:    pcd.investing,
            sub:      'Capex & asset purchases',
            color:    'var(--color-red)',
          },
          {
            label:    'Financing Cash Flow',
            value:    pcd.financing,
            sub:      'Debt & equity activity',
            color:    'var(--color-muted)',
          },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              ...CARD,
              padding: '20px 22px',
              borderTop: `3px solid ${item.color}`,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div
                style={{
                  fontFamily:    'var(--font-condensed)',
                  fontSize:      12,
                  fontWeight:    700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.09em',
                  color:         'var(--color-muted)',
                  marginBottom:  10,
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontFamily:  'var(--font-condensed)',
                  fontSize:    40,
                  fontWeight:  900,
                  lineHeight:  1,
                  color:       item.color,
                  marginBottom: 6,
                  letterSpacing: '-0.01em',
                }}
              >
                {fmtCF(item.value)}
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>{item.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Cash position chart ── */}
      <div style={{ ...CARD, overflow: 'hidden', padding: 0 }}>
        <div
          style={{
            padding:       '14px 20px',
            borderBottom:  '1px solid var(--color-border)',
            background:    'var(--color-surf2)',
            display:       'flex',
            alignItems:    'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              style={{
                fontFamily:    'var(--font-condensed)',
                fontSize:      12,
                fontWeight:    700,
                textTransform: 'uppercase',
                letterSpacing: '0.09em',
                color:         'var(--color-muted)',
              }}
            >
              Cash Position — October
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 2 }}>
              Historical daily balance
            </div>
          </div>
          <div
            style={{
              fontFamily:    'var(--font-condensed)',
              fontSize:      22,
              fontWeight:    900,
              color:         'var(--color-green)',
            }}
          >
            {formatCurrency(cf.closingBalance, true)}
          </div>
        </div>
        <div style={{ padding: '16px 20px' }}>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6B7FCC" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#6B7FCC" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#6B7A8D', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                tick={{ fill: '#6B7A8D', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={52}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Cash Balance']}
              />
              <Area
                type="monotone"
                dataKey="Cash"
                stroke="#6B7FCC"
                strokeWidth={2.5}
                fill="url(#cashGrad)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Cash Flow Statement table ── */}
      <div style={{ ...CARD, overflow: 'hidden', padding: 0 }}>
        {/* Table header */}
        <div
          style={{
            padding:        '14px 20px',
            borderBottom:   '1px solid var(--color-border)',
            background:     'var(--color-surf2)',
            display:        'flex',
            justifyContent: 'space-between',
            alignItems:     'center',
          }}
        >
          <div
            style={{
              fontFamily:    'var(--font-condensed)',
              fontSize:      13,
              fontWeight:    700,
              textTransform: 'uppercase',
              letterSpacing: '0.09em',
              color:         'var(--color-muted)',
            }}
          >
            Cash Flow Statement — October 2026
          </div>
          <div
            style={{
              fontFamily:    'var(--font-condensed)',
              fontSize:      11,
              fontWeight:    700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color:         'var(--color-muted)',
            }}
          >
            Amount
          </div>
        </div>

        {/* Sections */}
        {sections.map((section) => {
          const isPos = section.total >= 0;
          const totalColor = section.total === 0
            ? 'var(--color-muted)'
            : isPos
            ? 'var(--color-green)'
            : 'var(--color-red)';

          return (
            <div key={section.label}>
              <SectionHeader>{section.label}</SectionHeader>

              {section.items.map((item, idx) => (
                <div
                  key={item.label}
                  style={{
                    display:        'flex',
                    justifyContent: 'space-between',
                    alignItems:     'center',
                    padding:        '11px 20px 11px 32px',
                    borderBottom:   idx < section.items.length - 1
                      ? '1px solid rgba(0,0,0,0.06)'
                      : 'none',
                  }}
                >
                  <span
                    style={{
                      fontSize: 15,
                      color:    'var(--color-muted)',
                    }}
                  >
                    {item.label}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-condensed)',
                      fontSize:   17,
                      fontWeight: 700,
                      color:      item.amount === 0
                        ? 'var(--color-muted)'
                        : item.amount > 0
                        ? 'var(--color-green)'
                        : 'var(--color-red)',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {item.amount === 0
                      ? '—'
                      : item.amount > 0
                      ? `+${formatCurrency(item.amount)}`
                      : `(${formatCurrency(Math.abs(item.amount))})`}
                  </span>
                </div>
              ))}

              {/* Section total */}
              <div
                style={{
                  display:        'flex',
                  justifyContent: 'space-between',
                  alignItems:     'center',
                  padding:        '12px 20px',
                  background:     'var(--color-surf2)',
                  borderTop:      '1px solid var(--color-border)',
                  borderBottom:   '1px solid var(--color-border)',
                }}
              >
                <span
                  style={{
                    fontFamily:    'var(--font-condensed)',
                    fontSize:      14,
                    fontWeight:    700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color:         'var(--color-text)',
                  }}
                >
                  Net {section.label.split(' ')[0]}
                </span>
                <span
                  style={{
                    fontFamily:    'var(--font-condensed)',
                    fontSize:      18,
                    fontWeight:    800,
                    color:         totalColor,
                    letterSpacing: '0.02em',
                  }}
                >
                  {section.total === 0
                    ? '$0'
                    : section.total > 0
                    ? `+${formatCurrency(section.total)}`
                    : `(${formatCurrency(Math.abs(section.total))})`}
                </span>
              </div>
            </div>
          );
        })}

        {/* Grand total */}
        <div
          style={{
            display:        'flex',
            justifyContent: 'space-between',
            alignItems:     'center',
            padding:        '16px 20px',
            background:     'var(--color-surf2)',
            borderTop:      '2px solid var(--color-border2)',
          }}
        >
          <span
            style={{
              fontFamily:    'var(--font-condensed)',
              fontSize:      16,
              fontWeight:    900,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color:         'var(--color-text)',
            }}
          >
            Net Change in Cash
          </span>
          <span
            style={{
              fontFamily:    'var(--font-condensed)',
              fontSize:      20,
              fontWeight:    900,
              color:         cf.netChange >= 0 ? 'var(--color-green)' : 'var(--color-red)',
              letterSpacing: '0.02em',
            }}
          >
            {cf.netChange >= 0
              ? `+${formatCurrency(cf.netChange)}`
              : `(${formatCurrency(Math.abs(cf.netChange))})`}
          </span>
        </div>
      </div>

      {/* ── Key Metrics card ── */}
      <div style={{ ...CARD, padding: '22px 24px' }}>
        <div
          style={{
            fontFamily:    'var(--font-condensed)',
            fontSize:      12,
            fontWeight:    700,
            textTransform: 'uppercase',
            letterSpacing: '0.09em',
            color:         'var(--color-muted)',
            marginBottom:  18,
          }}
        >
          Key Metrics
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            {
              label: 'Opening Balance',
              value: formatCurrency(cf.openingBalance, true),
              color: 'var(--color-text)',
            },
            {
              label: 'Net Change',
              value: cf.netChange >= 0
                ? `+${formatCurrency(cf.netChange, true)}`
                : `–${formatCurrency(Math.abs(cf.netChange), true)}`,
              color: cf.netChange >= 0 ? 'var(--color-green)' : 'var(--color-red)',
            },
            {
              label: 'Closing Balance',
              value: formatCurrency(cf.closingBalance, true),
              color: 'var(--color-green)',
            },
            {
              label: 'Monthly Burn',
              value: `~${formatCurrency(cf.runway.monthlyBurn, true)}`,
              color: 'var(--color-orange)',
            },
            {
              label: 'Runway',
              value: `${cf.runway.months} months`,
              color: 'var(--color-blue)',
            },
          ].map((metric) => (
            <div
              key={metric.label}
              style={{
                display:       'flex',
                flexDirection: 'column',
                gap:           6,
                padding:       '14px 16px',
                background:    'var(--color-surf2)',
                borderRadius:  10,
                border:        '1px solid var(--color-border)',
              }}
            >
              <div
                style={{
                  fontFamily:    'var(--font-condensed)',
                  fontSize:      10,
                  fontWeight:    700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.09em',
                  color:         'var(--color-muted)',
                }}
              >
                {metric.label}
              </div>
              <div
                style={{
                  fontFamily:    'var(--font-condensed)',
                  fontSize:      26,
                  fontWeight:    900,
                  lineHeight:    1,
                  color:         metric.color,
                  letterSpacing: '-0.01em',
                }}
              >
                {metric.value}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
