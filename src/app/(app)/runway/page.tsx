'use client';

import Link from 'next/link';
import { RUNWAY_BASE, RUNWAY_SERIES } from '@/lib/data/finance-extras';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';

const fmt$ = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
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

function monthsToZero(burn: number) {
  if (burn <= 0) return '∞';
  return Math.round(RUNWAY_BASE.cashOnHand / burn);
}

export default function RunwayPage() {
  const r = RUNWAY_BASE;

  return (
    <div style={{ padding: '24px 28px 60px', maxWidth: 1400, margin: '0 auto' }}>
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
        <Link href="/dashboard" style={{ color: 'var(--color-muted)' }}>
          Finance
        </Link>{' '}
        &middot; Runway
      </div>

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
          Runway Scenarios
        </h1>
        <div style={{ color: 'var(--color-muted)', fontSize: 14 }}>
          Cash {fmt$(r.cashOnHand)} on {r.asOf} &middot; Undrawn line {fmt$(r.undrawnLine)} &middot; Base burn {fmt$(r.monthlyBurnBase)}/mo
        </div>
      </header>

      {/* KPI — scenario runways */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Cash on hand', value: fmt$(r.cashOnHand), sub: `+ ${fmt$(r.undrawnLine)} undrawn line` },
          { label: 'Base case runway', value: `${monthsToZero(r.monthlyBurnBase)} mo`, sub: `${fmt$(r.monthlyBurnBase)}/mo burn` },
          { label: 'Bull case runway', value: `${monthsToZero(r.monthlyBurnBull)} mo`, sub: `${fmt$(r.monthlyBurnBull)}/mo burn`, tone: 'good' as const },
          { label: 'Bear case runway', value: `${monthsToZero(r.monthlyBurnBear)} mo`, sub: `${fmt$(r.monthlyBurnBear)}/mo burn`, tone: 'warn' as const },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <div
              style={{
                fontFamily: 'var(--font-condensed)',
                fontSize: 11,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-muted)',
              }}
            >
              {kpi.label}
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 900,
                marginTop: 4,
                color: kpi.tone === 'good' ? '#165E36' : kpi.tone === 'warn' ? '#8A5A0F' : 'var(--color-text)',
              }}
            >
              {kpi.value}
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 4 }}>{kpi.sub}</div>
          </Card>
        ))}
      </div>

      {/* Burn curve */}
      <Card>
        <SectionTitle>Cash balance · 18-month projection</SectionTitle>
        <div style={{ height: 340 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={RUNWAY_SERIES} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-chart-grid)" />
              <XAxis
                dataKey="month"
                tick={{ fill: 'var(--color-chart-text)', fontSize: 11, fontFamily: 'var(--font-condensed)' }}
              />
              <YAxis
                tick={{ fill: 'var(--color-chart-text)', fontSize: 11, fontFamily: 'var(--font-condensed)' }}
                tickFormatter={(v: number) => `$${(v / 1_000_000).toFixed(1)}M`}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--color-surf)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 6,
                  fontSize: 12,
                }}
                formatter={(v) => (typeof v === 'number' ? fmt$(v) : String(v))}
              />
              <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'var(--font-condensed)' }} />
              <ReferenceLine y={1_500_000} stroke="#8A1C16" strokeDasharray="4 3" label={{ value: 'Covenant floor ($1.5M)', position: 'insideTopRight', fill: '#8A1C16', fontSize: 11 }} />
              <Line type="monotone" dataKey="bull" stroke="#165E36" strokeWidth={2} dot={false} name="Bull" />
              <Line type="monotone" dataKey="base" stroke="#4FA8FF" strokeWidth={3} dot={{ r: 3 }} name="Base" />
              <Line type="monotone" dataKey="bear" stroke="#8A1C16" strokeWidth={2} dot={false} name="Bear" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Scenario assumptions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 20 }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ width: 10, height: 10, background: '#165E36', borderRadius: 2 }} />
            <h3 style={{ fontSize: 18, fontWeight: 900, margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Bull</h3>
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-muted)', marginBottom: 12, fontFamily: 'var(--font-condensed)' }}>
            Burn {fmt$(r.monthlyBurnBull)} / mo · Runway {monthsToZero(r.monthlyBurnBull)} mo
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.6 }}>
            <li>Email/SMS scale to 15% of marketing spend (from 4%)</li>
            <li>Wholesale reorders recover in Q2 with Dick's on plan</li>
            <li>No additional hires beyond Eng L5 already approved</li>
            <li>Freight renegotiation holds at Q1 new rate</li>
          </ul>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ width: 10, height: 10, background: '#4FA8FF', borderRadius: 2 }} />
            <h3 style={{ fontSize: 18, fontWeight: 900, margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Base</h3>
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-muted)', marginBottom: 12, fontFamily: 'var(--font-condensed)' }}>
            Burn {fmt$(r.monthlyBurnBase)} / mo · Runway {monthsToZero(r.monthlyBurnBase)} mo
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.6 }}>
            <li>Current plan holds; marketing spend flat at Q1 level</li>
            <li>Q2 reqs filled on schedule (+$68K loaded monthly)</li>
            <li>Wholesale recovers partially, $160K below original plan</li>
            <li>Q4 inventory build $200K front-loaded</li>
          </ul>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ width: 10, height: 10, background: '#8A1C16', borderRadius: 2 }} />
            <h3 style={{ fontSize: 18, fontWeight: 900, margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Bear</h3>
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-muted)', marginBottom: 12, fontFamily: 'var(--font-condensed)' }}>
            Burn {fmt$(r.monthlyBurnBear)} / mo · Runway {monthsToZero(r.monthlyBurnBear)} mo
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.6 }}>
            <li>Wholesale revenue down another 20% from current</li>
            <li>Nordstrom / Fanatics disputes turn into write-offs ($140K)</li>
            <li>Paid social CAC inflates 30% without pulling back spend</li>
            <li>Supplier surcharge: +$40K/mo COGS through summer</li>
          </ul>
        </Card>
      </div>

      <div style={{ marginTop: 20 }}>
        <Card>
          <SectionTitle>Triggers &amp; decisions</SectionTitle>
          <div style={{ display: 'grid', gap: 12, fontSize: 14, lineHeight: 1.55 }}>
            <div>
              <strong>If cash drops below $2.0M (trigger: June end-of-month):</strong> pull $500K line; freeze discretionary marketing
              above a fixed baseline; shift hiring to high-ROI roles only.
            </div>
            <div>
              <strong>If bear case activates by July:</strong> open conversations with First Western on covenant relief and explore
              $1–1.5M venture debt extension. Current lender has right of first refusal.
            </div>
            <div>
              <strong>Bull case unlocks the Q3 expansion plan.</strong> ATL fulfillment opening, Retail L3/L4 hiring push,
              and two more Eng reqs — all conditional on bull-case cash holding through August.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
