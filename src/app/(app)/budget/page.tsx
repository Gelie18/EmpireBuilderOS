'use client';

import Link from 'next/link';
import { BUDGET_ROWS } from '@/lib/data/finance-extras';

const fmt$ = (n: number) => {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(0)}K`;
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

const CATEGORY_LABEL = {
  revenue: 'Revenue',
  cogs: 'COGS',
  opex: 'OpEx',
};

export default function BudgetPage() {
  const revenue = BUDGET_ROWS.filter((r) => r.category === 'revenue');
  const cogs    = BUDGET_ROWS.filter((r) => r.category === 'cogs');
  const opex    = BUDGET_ROWS.filter((r) => r.category === 'opex');

  const totalBudgetRevenue = revenue.reduce((s, r) => s + r.budget, 0);
  const totalActualRevenue = revenue.reduce((s, r) => s + r.actual, 0);
  const totalForecastRevenue = revenue.reduce((s, r) => s + r.forecast, 0);
  const totalBudgetCogs = cogs.reduce((s, r) => s + r.budget, 0);
  const totalActualCogs = cogs.reduce((s, r) => s + r.actual, 0);
  const totalBudgetOpex = opex.reduce((s, r) => s + r.budget, 0);
  const totalActualOpex = opex.reduce((s, r) => s + r.actual, 0);
  const ebitdaBudget = totalBudgetRevenue - totalBudgetCogs - totalBudgetOpex;
  const ebitdaActual = totalActualRevenue - totalActualCogs - totalActualOpex;
  const revenueDelta = totalActualRevenue - totalBudgetRevenue;
  const revenueDeltaPct = (revenueDelta / totalBudgetRevenue) * 100;

  const renderRow = (r: (typeof BUDGET_ROWS)[number]) => {
    const delta = r.actual - r.budget;
    const isFavorable = r.category === 'revenue' ? delta > 0 : delta < 0;
    const color = Math.abs(delta / r.budget) < 0.02 ? 'var(--color-muted)' : isFavorable ? '#165E36' : '#8A1C16';
    const deltaPct = (delta / r.budget) * 100;
    return (
      <tr key={r.account} style={{ borderBottom: '1px solid var(--color-border)' }}>
        <td style={{ padding: '10px 10px', fontWeight: 600 }}>{r.account}</td>
        <td style={{ padding: '10px 10px', fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)' }}>{r.ownerDept}</td>
        <td style={{ padding: '10px 10px', textAlign: 'right', fontFamily: 'var(--font-condensed)' }}>{fmt$(r.budget)}</td>
        <td style={{ padding: '10px 10px', textAlign: 'right', fontFamily: 'var(--font-condensed)', fontWeight: 700 }}>
          {fmt$(r.actual)}
        </td>
        <td style={{ padding: '10px 10px', textAlign: 'right', fontFamily: 'var(--font-condensed)', fontWeight: 700, color }}>
          {delta > 0 ? '+' : ''}
          {fmt$(delta)}
        </td>
        <td style={{ padding: '10px 10px', textAlign: 'right', fontFamily: 'var(--font-condensed)', fontWeight: 700, color }}>
          {delta > 0 ? '+' : ''}
          {deltaPct.toFixed(1)}%
        </td>
        <td style={{ padding: '10px 10px', textAlign: 'right', fontFamily: 'var(--font-condensed)' }}>{fmt$(r.forecast)}</td>
      </tr>
    );
  };

  const subtotal = (label: string, b: number, a: number, f: number) => {
    const delta = a - b;
    const isFav = label.toLowerCase().includes('revenue') ? delta > 0 : delta < 0;
    const color = isFav ? '#165E36' : '#8A1C16';
    return (
      <tr style={{ background: 'var(--color-surf2)', fontWeight: 700 }}>
        <td style={{ padding: '12px 10px', fontFamily: 'var(--font-condensed)', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 12 }}>
          {label}
        </td>
        <td />
        <td style={{ padding: '12px 10px', textAlign: 'right', fontFamily: 'var(--font-condensed)' }}>{fmt$(b)}</td>
        <td style={{ padding: '12px 10px', textAlign: 'right', fontFamily: 'var(--font-condensed)' }}>{fmt$(a)}</td>
        <td style={{ padding: '12px 10px', textAlign: 'right', fontFamily: 'var(--font-condensed)', color }}>
          {delta > 0 ? '+' : ''}
          {fmt$(delta)}
        </td>
        <td style={{ padding: '12px 10px', textAlign: 'right', fontFamily: 'var(--font-condensed)', color }}>
          {delta > 0 ? '+' : ''}
          {((delta / b) * 100).toFixed(1)}%
        </td>
        <td style={{ padding: '12px 10px', textAlign: 'right', fontFamily: 'var(--font-condensed)' }}>{fmt$(f)}</td>
      </tr>
    );
  };

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
        &middot; Budget vs Actual
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
          Budget vs Actual · March 2026
        </h1>
        <div style={{ color: 'var(--color-muted)', fontSize: 14 }}>
          Revenue {fmt$(totalActualRevenue)} vs {fmt$(totalBudgetRevenue)} plan &middot; EBITDA {fmt$(ebitdaActual)} vs {fmt$(ebitdaBudget)}
          &middot; Forecast reflects May payroll increase
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Revenue vs plan', value: `${revenueDeltaPct > 0 ? '+' : ''}${revenueDeltaPct.toFixed(1)}%`, sub: fmt$(revenueDelta) + ' delta', tone: (revenueDelta > 0 ? 'good' : 'warn') as 'good' | 'warn' },
          { label: 'COGS vs plan', value: fmt$(totalActualCogs - totalBudgetCogs), sub: `${((totalActualCogs - totalBudgetCogs) / totalBudgetCogs * 100).toFixed(1)}% over`, tone: 'warn' as const },
          { label: 'OpEx vs plan', value: fmt$(totalActualOpex - totalBudgetOpex), sub: 'Marketing + SaaS overages', tone: 'warn' as const },
          { label: 'EBITDA vs plan', value: fmt$(ebitdaActual - ebitdaBudget), sub: `actual ${fmt$(ebitdaActual)}`, tone: (ebitdaActual > ebitdaBudget ? 'good' : 'warn') as 'good' | 'warn' },
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

      <Card>
        <SectionTitle>Budget vs actual · by account</SectionTitle>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr
              style={{
                textAlign: 'left',
                fontFamily: 'var(--font-condensed)',
                fontSize: 11,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-muted)',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <th style={{ padding: '8px 10px' }}>Account</th>
              <th style={{ padding: '8px 10px' }}>Owner</th>
              <th style={{ padding: '8px 10px', textAlign: 'right' }}>Budget</th>
              <th style={{ padding: '8px 10px', textAlign: 'right' }}>Actual</th>
              <th style={{ padding: '8px 10px', textAlign: 'right' }}>Δ $</th>
              <th style={{ padding: '8px 10px', textAlign: 'right' }}>Δ %</th>
              <th style={{ padding: '8px 10px', textAlign: 'right' }}>Forecast</th>
            </tr>
          </thead>
          <tbody>
            {revenue.map(renderRow)}
            {subtotal('Total revenue', totalBudgetRevenue, totalActualRevenue, totalForecastRevenue)}
            <tr><td colSpan={7} style={{ height: 8 }} /></tr>
            {cogs.map(renderRow)}
            {subtotal('Total COGS', totalBudgetCogs, totalActualCogs, cogs.reduce((s, r) => s + r.forecast, 0))}
            <tr><td colSpan={7} style={{ height: 8 }} /></tr>
            {opex.map(renderRow)}
            {subtotal('Total OpEx', totalBudgetOpex, totalActualOpex, opex.reduce((s, r) => s + r.forecast, 0))}
            <tr><td colSpan={7} style={{ height: 8 }} /></tr>
            <tr style={{ background: '#1D44BF', color: '#FFFFFF', fontWeight: 900 }}>
              <td style={{ padding: '14px 10px', fontFamily: 'var(--font-condensed)', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 13 }}>
                EBITDA
              </td>
              <td />
              <td style={{ padding: '14px 10px', textAlign: 'right', fontFamily: 'var(--font-condensed)' }}>{fmt$(ebitdaBudget)}</td>
              <td style={{ padding: '14px 10px', textAlign: 'right', fontFamily: 'var(--font-condensed)' }}>{fmt$(ebitdaActual)}</td>
              <td style={{ padding: '14px 10px', textAlign: 'right', fontFamily: 'var(--font-condensed)' }}>
                {ebitdaActual - ebitdaBudget > 0 ? '+' : ''}
                {fmt$(ebitdaActual - ebitdaBudget)}
              </td>
              <td style={{ padding: '14px 10px', textAlign: 'right', fontFamily: 'var(--font-condensed)' }}>
                {(((ebitdaActual - ebitdaBudget) / ebitdaBudget) * 100).toFixed(1)}%
              </td>
              <td style={{ padding: '14px 10px', textAlign: 'right', fontFamily: 'var(--font-condensed)' }}>
                {fmt$(totalForecastRevenue - cogs.reduce((s, r) => s + r.forecast, 0) - opex.reduce((s, r) => s + r.forecast, 0))}
              </td>
            </tr>
          </tbody>
        </table>
      </Card>

      <div style={{ marginTop: 20 }}>
        <Card>
          <SectionTitle>Variance story</SectionTitle>
          <div style={{ display: 'grid', gap: 12, fontSize: 14, lineHeight: 1.55 }}>
            <div>
              <strong>DTC is carrying the whole quarter.</strong> +$122K revenue vs budget, fully offsetting wholesale short-fall.
              Drive: paid search ROAS ran 3.2x vs 2.4x plan; email revenue is up 41% YoY with half the spend.
            </div>
            <div>
              <strong>Wholesale is $128K under.</strong> Two culprits: Nordstrom pulled April re-order back to June, and Fanatics dispute
              has held $92K in AR. Re-baselining Q2 wholesale forecast down by $160K — meets budget if that holds.
            </div>
            <div>
              <strong>Marketing +$17K over is intentional.</strong> Early test budget for Meta creative refresh — ROAS above target.
              Not a flag, but move $10K/mo from paid social into email tooling in the May re-plan.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
