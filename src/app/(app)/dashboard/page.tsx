'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDemoActionItems, getDemoMoM, getDemoKpis, getDemoAnomalies } from '@/lib/data/demo-data';
import AnomalyBanner from '@/components/dashboard/AnomalyBanner';
import PeriodSelector, { type PeriodKey, PERIOD_OPTIONS } from '@/components/ui/PeriodSelector';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const actions   = getDemoActionItems();
const mom       = getDemoMoM();
const anomalies = getDemoAnomalies();

const highPriorityActions = actions.filter((a) => a.priority === 'high');

const trendData = mom.months.map((m) => ({
  month:        m.label,
  Revenue:      m.revenue,
  'Net Income': m.netIncome,
}));

const CARD: React.CSSProperties = {
  background:   'var(--color-surf)',
  borderRadius: 'var(--card-radius)',
  boxShadow:    'var(--card-shadow)',
  border:       '1px solid var(--color-border)',
};

const TOOLTIP_STYLE = {
  background:   '#FFFFFF',
  border:       '1px solid rgba(0,0,0,0.10)',
  borderRadius: 8,
  color:        '#1A1A1A',
  fontSize:     12,
  boxShadow:    '0 4px 16px rgba(0,0,0,0.10)',
};

// Metric cards — each links to a detail page
const EXEC_METRICS = [
  {
    id:         'revenue',
    label:      'October Revenue',
    value:      '$1.31M',
    delta:      '+3.3% vs plan',
    sub:        'Beat by $41.6K',
    deltaColor: 'var(--color-green)',
    deltaBg:    'var(--color-green-d)',
    valueColor: 'var(--color-text)',
    href:       '/mom',
    accentColor:'var(--color-green)',
  },
  {
    id:         'cash',
    label:      'Cash on Hand',
    value:      '$873.5K',
    delta:      '8.2 mo runway',
    sub:        '+$26.5K net change',
    deltaColor: 'var(--color-blue)',
    deltaBg:    'var(--color-blue-d)',
    valueColor: 'var(--color-text)',
    href:       '/cashflow',
    accentColor:'var(--color-blue)',
  },
  {
    id:         'ni',
    label:      'Net Income',
    value:      '$71.4K',
    delta:      '–34.6% vs plan',
    sub:        '$37.8K below budget',
    deltaColor: 'var(--color-red)',
    deltaBg:    'var(--color-red-d)',
    valueColor: 'var(--color-red)',
    href:       '/pnl',
    accentColor:'var(--color-red)',
  },
  {
    id:         'mktg',
    label:      'Marketing Overage',
    value:      '$47.2K',
    delta:      '+38% over budget',
    sub:        '$171K vs $124K plan',
    deltaColor: 'var(--color-orange)',
    deltaBg:    'var(--color-orange-d)',
    valueColor: 'var(--color-orange)',
    href:       '/pnl',
    accentColor:'var(--color-orange)',
  },
];

// Period-aware KPI data
const PERIOD_DATA: Record<PeriodKey, {
  revenue: string; revSub: string; revDelta: string; revDeltaColor: string; revDeltaBg: string;
  expenses: string; expSub: string; expDelta: string; expDeltaColor: string; expDeltaBg: string;
  netIncome: string; niSub: string; niDelta: string; niDeltaColor: string; niDeltaBg: string;
  cashBalance: string; cashSub: string; cashDelta: string; cashDeltaColor: string; cashDeltaBg: string;
}> = {
  current: {
    revenue: '$1.31M', revSub: 'vs $1.27M budget', revDelta: '+3.3% vs plan', revDeltaColor: '#059669', revDeltaBg: 'rgba(5,150,105,0.10)',
    expenses: '$1.24M', expSub: 'COGS + OpEx', expDelta: '+11.7% vs Sep', expDeltaColor: '#DC2626', expDeltaBg: 'rgba(220,38,38,0.10)',
    netIncome: '$71.4K', niSub: 'vs $109.2K budget', niDelta: '–34.6% vs plan', niDeltaColor: '#DC2626', niDeltaBg: 'rgba(220,38,38,0.10)',
    cashBalance: '$873.5K', cashSub: '~8.2 months runway', cashDelta: '+2.6% vs Sep', cashDeltaColor: '#059669', cashDeltaBg: 'rgba(5,150,105,0.10)',
  },
  last: {
    revenue: '$1.27M', revSub: 'vs $1.25M budget', revDelta: '+1.8% vs plan', revDeltaColor: '#059669', revDeltaBg: 'rgba(5,150,105,0.10)',
    expenses: '$1.10M', expSub: 'COGS + OpEx', expDelta: '+2.1% vs Aug', expDeltaColor: '#DC2626', expDeltaBg: 'rgba(220,38,38,0.10)',
    netIncome: '$108.4K', niSub: 'vs $105K budget', niDelta: '+3.2% vs plan', niDeltaColor: '#059669', niDeltaBg: 'rgba(5,150,105,0.10)',
    cashBalance: '$851.0K', cashSub: '~8.0 months runway', cashDelta: '+0.5% vs Aug', cashDeltaColor: '#059669', cashDeltaBg: 'rgba(5,150,105,0.10)',
  },
  last3: {
    revenue: '$3.82M', revSub: 'Aug–Oct 2026 total', revDelta: '+3.8% avg growth', revDeltaColor: '#059669', revDeltaBg: 'rgba(5,150,105,0.10)',
    expenses: '$3.39M', expSub: 'COGS + OpEx combined', expDelta: '+5.1% vs prior 3M', expDeltaColor: '#DC2626', expDeltaBg: 'rgba(220,38,38,0.10)',
    netIncome: '$247.3K', niSub: '3-month total NI', niDelta: '–8.4% vs prior 3M', niDeltaColor: '#DC2626', niDeltaBg: 'rgba(220,38,38,0.10)',
    cashBalance: '$873.5K', cashSub: 'End of period cash', cashDelta: '+4.6% over 3M', cashDeltaColor: '#059669', cashDeltaBg: 'rgba(5,150,105,0.10)',
  },
  ytd: {
    revenue: '$12.85M', revSub: 'Jan–Oct 2026 total', revDelta: '+18.4% YoY', revDeltaColor: '#059669', revDeltaBg: 'rgba(5,150,105,0.10)',
    expenses: '$11.32M', expSub: 'YTD COGS + OpEx', expDelta: '+19.1% YoY', expDeltaColor: '#DC2626', expDeltaBg: 'rgba(220,38,38,0.10)',
    netIncome: '$847.2K', niSub: 'YTD net income', niDelta: '+6.2% YoY', niDeltaColor: '#059669', niDeltaBg: 'rgba(5,150,105,0.10)',
    cashBalance: '$873.5K', cashSub: 'Current cash on hand', cashDelta: '+4.6% vs Jan', cashDeltaColor: '#059669', cashDeltaBg: 'rgba(5,150,105,0.10)',
  },
  last12: {
    revenue: '$15.64M', revSub: 'Trailing 12-month total', revDelta: '+18.4% vs prior 12M', revDeltaColor: '#059669', revDeltaBg: 'rgba(5,150,105,0.10)',
    expenses: '$13.72M', expSub: 'COGS + OpEx TTM', expDelta: '+17.2% vs prior 12M', expDeltaColor: '#DC2626', expDeltaBg: 'rgba(220,38,38,0.10)',
    netIncome: '$1.12M', niSub: 'Trailing 12-month NI', niDelta: '+8.7% vs prior 12M', niDeltaColor: '#059669', niDeltaBg: 'rgba(5,150,105,0.10)',
    cashBalance: '$873.5K', cashSub: 'Current cash on hand', cashDelta: '+4.6% since Nov 2025', cashDeltaColor: '#059669', cashDeltaBg: 'rgba(5,150,105,0.10)',
  },
};

// Quick-access report links
const REPORTS = [
  { href: '/pnl',           label: 'P&L',            sub: 'Budget vs Actuals',   accent: 'var(--color-green)'  },
  { href: '/cashflow',      label: 'Cash Flow',       sub: '8.2 mo runway',      accent: 'var(--color-blue)'   },
  { href: '/yoy',           label: 'Year-over-Year',  sub: '+18.4% growth',      accent: 'var(--color-green)'  },
  { href: '/mom',           label: 'MoM Trend',       sub: '+3.1% Oct vs Sep',   accent: 'var(--color-blue)'   },
  { href: '/ai-forecast',   label: 'AI Forecast',     sub: '$16.8M proj. ARR',   accent: 'var(--color-blue)'   },
  { href: '/scenarios',     label: 'Scenarios',       sub: '4 cases modeled',    accent: '#7C5CBF'             },
  { href: '/daily-revenue', label: 'Daily Revenue',   sub: 'Oct 31-day view',    accent: 'var(--color-orange)' },
  { href: '/backlog',       label: 'Backlog',         sub: '10 items · $659K risk', accent: 'var(--color-red)'    },
  { href: '/market',        label: 'Market Intel',    sub: 'Above median peers', accent: 'var(--color-green)'  },
];

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  open:        { label: 'Open',        color: 'var(--color-red)'    },
  in_progress: { label: 'In Progress', color: 'var(--color-orange)' },
  done:        { label: 'Done',        color: 'var(--color-green)'  },
};

export default function DashboardPage() {
  const router = useRouter();
  const [period, setPeriod] = useState<PeriodKey>('current');
  const pd = PERIOD_DATA[period];

  return (
    <div className="flex flex-col gap-5">

      {/* ── Header ── */}
      <div style={{ ...CARD, padding: '22px 26px' }}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div
              style={{
                fontSize:      11,
                fontWeight:    600,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                color:         'var(--color-muted)',
                marginBottom:  6,
              }}
            >
              Financial Overview · October 2026
            </div>
            <div
              style={{
                fontSize:      30,
                fontWeight:    800,
                lineHeight:    1,
                color:         'var(--color-text)',
                letterSpacing: '-0.02em',
              }}
            >
              Apex Industrial Group
            </div>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span
              style={{
                background:    'var(--color-orange-d)',
                border:        '1px solid rgba(247,99,0,0.20)',
                color:         'var(--color-orange)',
                fontSize:      12,
                fontWeight:    700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding:       '5px 14px',
                borderRadius:  5,
              }}
            >
              ⚠ 2 Priority Actions
            </span>
            <PeriodSelector value={period} onChange={setPeriod} />
          </div>
        </div>
      </div>

      {/* ── Anomaly flags ── */}
      <AnomalyBanner anomalies={anomalies} />

      {/* ── Priority actions ── */}
      <div className="flex flex-col gap-3">
        {highPriorityActions.map((action) => {
          const sc  = STATUS_LABELS[action.status];
          const due = new Date(action.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          return (
            <div
              key={action.id}
              role="button"
              tabIndex={0}
              onClick={() => router.push('/pnl')}
              onKeyDown={(e) => e.key === 'Enter' && router.push('/pnl')}
              style={{
                ...CARD,
                borderLeft: '4px solid var(--color-red)',
                padding:    '18px 22px',
                cursor:     'pointer',
                transition: 'box-shadow 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'var(--card-shadow-hover)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'var(--card-shadow)';
              }}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      style={{
                        background:    'var(--color-red-d)',
                        color:         'var(--color-red)',
                        fontSize:      10,
                        fontWeight:    700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        padding:       '2px 8px',
                        borderRadius:  3,
                      }}
                    >
                      HIGH PRIORITY
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize:   17,
                      fontWeight: 600,
                      color:      'var(--color-text)',
                      lineHeight: 1.3,
                    }}
                  >
                    {action.text}
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <span style={{ fontSize: 13, color: 'var(--color-muted)' }}>
                      Owner: <strong style={{ color: 'var(--color-text)', fontWeight: 600 }}>{action.owner}</strong>
                    </span>
                    <span style={{ fontSize: 13, color: 'var(--color-muted)' }}>
                      Due: <strong style={{ color: 'var(--color-text)', fontWeight: 600 }}>{due}</strong>
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span
                    style={{
                      background:    'var(--color-red-d)',
                      color:         sc.color,
                      fontSize:      12,
                      fontWeight:    600,
                      padding:       '4px 10px',
                      borderRadius:  4,
                      border:        '1px solid rgba(0,0,0,0.08)',
                    }}
                  >
                    ● {sc.label}
                  </span>
                  <span style={{ fontSize: 18, color: 'var(--color-muted)', fontWeight: 600 }}>→</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 4 KPI cards — period-aware ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            id: 'revenue', label: 'Revenue', href: '/mom',
            value: pd.revenue, sub: pd.revSub, delta: pd.revDelta,
            deltaColor: pd.revDeltaColor, deltaBg: pd.revDeltaBg,
            valueColor: 'var(--color-text)', accentColor: 'var(--color-green)',
          },
          {
            id: 'expenses', label: 'Total Expenses', href: '/pnl',
            value: pd.expenses, sub: pd.expSub, delta: pd.expDelta,
            deltaColor: pd.expDeltaColor, deltaBg: pd.expDeltaBg,
            valueColor: 'var(--color-text)', accentColor: 'var(--color-red)',
          },
          {
            id: 'ni', label: 'Net Income', href: '/pnl',
            value: pd.netIncome, sub: pd.niSub, delta: pd.niDelta,
            deltaColor: pd.niDeltaColor, deltaBg: pd.niDeltaBg,
            valueColor: pd.niDeltaColor, accentColor: pd.niDeltaColor,
          },
          {
            id: 'cash', label: 'Cash on Hand', href: '/cashflow',
            value: pd.cashBalance, sub: pd.cashSub, delta: pd.cashDelta,
            deltaColor: pd.cashDeltaColor, deltaBg: pd.cashDeltaBg,
            valueColor: 'var(--color-text)', accentColor: 'var(--color-blue)',
          },
        ].map((m) => (
          <div
            key={m.id}
            role="button"
            tabIndex={0}
            onClick={() => router.push(m.href)}
            onKeyDown={(e) => e.key === 'Enter' && router.push(m.href)}
            style={{
              ...CARD,
              padding:    '20px 20px 16px',
              cursor:     'pointer',
              position:   'relative',
              overflow:   'hidden',
              transition: 'box-shadow 0.15s, border-color 0.15s',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.boxShadow   = 'var(--card-shadow-hover)';
              el.style.borderColor = `${m.accentColor}44`;
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.boxShadow   = 'var(--card-shadow)';
              el.style.borderColor = 'var(--color-border)';
            }}
          >
            {/* Top accent stripe */}
            <div
              style={{
                position:     'absolute',
                top: 0, left: 0, right: 0,
                height:       3,
                background:   m.accentColor,
                borderRadius: 'var(--card-radius) var(--card-radius) 0 0',
                opacity:      0.9,
              }}
            />
            <div
              style={{
                display:       'flex',
                flexDirection: 'column',
                alignItems:    'center',
                textAlign:     'center',
              }}
            >
              <div
                style={{
                  fontSize:      11,
                  fontWeight:    600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.09em',
                  color:         'var(--color-muted)',
                  marginBottom:  10,
                  marginTop:     6,
                }}
              >
                {m.label}
              </div>
              <div
                style={{
                  fontSize:     34,
                  fontWeight:   800,
                  lineHeight:   1,
                  color:        m.valueColor,
                  marginBottom: 6,
                  letterSpacing: '-0.02em',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {m.value}
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 10 }}>
                {m.sub}
              </div>
              <span
                style={{
                  background:    m.deltaBg,
                  color:         m.deltaColor,
                  fontSize:      11,
                  fontWeight:    700,
                  borderRadius:  3,
                  padding:       '3px 8px',
                  letterSpacing: '0.03em',
                }}
              >
                {m.delta}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: -8 }}>
        Showing: {PERIOD_OPTIONS.find((p) => p.key === period)?.sublabel}
      </div>

      {/* ── Revenue & NI Trend Chart ── */}
      <div style={{ ...CARD, overflow: 'hidden' }}>
        <div
          className="flex items-center justify-between px-5 py-3.5 border-b"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-surf2)' }}
        >
          <span
            style={{
              fontSize:      12,
              fontWeight:    700,
              textTransform: 'uppercase',
              letterSpacing: '0.09em',
              color:         'var(--color-muted)',
            }}
          >
            Revenue &amp; Net Income — 6-Month Trend
          </span>
          <button
            onClick={() => router.push('/mom')}
            style={{
              fontSize:      11,
              fontWeight:    700,
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              color:         '#1D44BF',
              background:    'transparent',
              border:        'none',
              cursor:        'pointer',
            }}
          >
            Deep Dive →
          </button>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: '#6B7A8D', fontSize: 12 }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                tick={{ fill: '#6B7A8D', fontSize: 11 }}
                axisLine={false} tickLine={false} width={54}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(val) => [`$${Number(val).toLocaleString()}`, '']}
                cursor={{ stroke: 'rgba(65,182,230,0.20)', strokeWidth: 1 }}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: '#6B7A8D' }} />
              <Line type="monotone" dataKey="Revenue"
                stroke="#1D44BF" strokeWidth={2.5}
                dot={{ r: 4, fill: '#1D44BF', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#1D44BF', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
              <Line type="monotone" dataKey="Net Income"
                stroke="#1D44BF" strokeWidth={2}
                dot={{ r: 4, fill: '#059669', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#059669', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── November Preview ── */}
      <div
        style={{
          ...CARD,
          borderLeft: '4px solid var(--color-orange)',
          padding:    '20px 24px',
        }}
      >
        <div
          style={{
            fontSize:      11,
            fontWeight:    700,
            textTransform: 'uppercase',
            letterSpacing: '0.10em',
            color:         'var(--color-orange)',
            marginBottom:  14,
          }}
        >
          November Preview
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { text: 'Salesforce renewal: +$22K expense hitting Nov 1. Partially offset by full ShipBob savings.', color: 'var(--color-red)' },
            { text: 'Full ShipBob savings: +$14K/month beginning November — gross margin should expand 0.5–0.8pp.', color: 'var(--color-green)' },
            { text: 'Marketing must normalize from $171K back to the $124K budget to restore net income to $100K+.', color: 'var(--color-orange)' },
          ].map((item, i) => (
            <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{
                background: item.color,
                width: 6, height: 6,
                borderRadius: '50%',
                flexShrink: 0,
                marginTop: 8,
              }} />
              <span style={{ fontSize: 14, color: 'var(--color-text)', lineHeight: 1.55 }}>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── All Reports quick access ── */}
      <div>
        <div
          style={{
            fontSize:      11,
            fontWeight:    700,
            textTransform: 'uppercase',
            letterSpacing: '0.10em',
            color:         'var(--color-muted)',
            marginBottom:  14,
          }}
        >
          All Reports
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {REPORTS.map((r) => (
            <div
              key={r.href}
              role="button"
              tabIndex={0}
              onClick={() => router.push(r.href)}
              onKeyDown={(e) => e.key === 'Enter' && router.push(r.href)}
              style={{
                ...CARD,
                padding:    '14px 16px',
                cursor:     'pointer',
                display:    'flex',
                alignItems: 'center',
                gap:        12,
                transition: 'box-shadow 0.15s, border-color 0.15s',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = `${r.accent}55`;
                el.style.boxShadow   = 'var(--card-shadow-hover)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'var(--color-border)';
                el.style.boxShadow   = 'var(--card-shadow)';
              }}
            >
              <div
                style={{
                  width: 3, height: 32,
                  background:   r.accent,
                  borderRadius: 2,
                  flexShrink:   0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize:      13,
                    fontWeight:    700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color:         'var(--color-text)',
                    lineHeight:    1.2,
                  }}
                >
                  {r.label}
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 2 }}>
                  {r.sub}
                </div>
              </div>
              <span style={{ fontSize: 14, color: r.accent, fontWeight: 700, flexShrink: 0, opacity: 0.7 }}>→</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
