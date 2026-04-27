'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { VENDOR_SPEND, type VendorSpend } from '@/lib/data/finance-extras';

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

const TIER_STYLE: Record<VendorSpend['tier'], { bg: string; fg: string; label: string }> = {
  strategic: { bg: '#1D44BF', fg: '#FFFFFF', label: 'Strategic' },
  core:      { bg: '#E3F0FC', fg: '#1B4DA8', label: 'Core' },
  tail:      { bg: '#E9EDF3', fg: '#4A5464', label: 'Tail' },
};

export default function VendorSpendPage() {
  const sorted = useMemo(() => [...VENDOR_SPEND].sort((a, b) => b.ytdSpend - a.ytdSpend), []);

  const totalYtd = sorted.reduce((s, v) => s + v.ytdSpend, 0);
  const totalLy = sorted.reduce((s, v) => s + v.lastYearSpend, 0);
  const strategicCount = sorted.filter((v) => v.tier === 'strategic').length;
  const top3Concentration = sorted.slice(0, 3).reduce((s, v) => s + v.concentration, 0);

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    sorted.forEach((v) => map.set(v.category, (map.get(v.category) ?? 0) + v.ytdSpend));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [sorted]);

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
        &middot; Vendor Spend
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
          Vendor Spend & Concentration
        </h1>
        <div style={{ color: 'var(--color-muted)', fontSize: 14 }}>
          {sorted.length} vendors &middot; {fmt$(totalYtd)} YTD spend &middot;{' '}
          {(((totalYtd - totalLy) / totalLy) * 100).toFixed(0)}% vs last year
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Total YTD spend', value: fmt$(totalYtd), sub: `${fmt$(totalYtd - totalLy)} vs LY` },
          { label: 'Strategic vendors', value: String(strategicCount), sub: 'locked contracts' },
          { label: 'Top-3 concentration', value: `${(top3Concentration * 100).toFixed(0)}%`, sub: 'of supplier spend', tone: (top3Concentration > 0.5 ? 'warn' : 'good') as 'warn' | 'good' },
          { label: 'Contracts expiring <90d', value: String(sorted.filter((v) => v.contractEnds.includes('2026') && v.contractEnds !== 'Month-to-month').length), sub: 'need renewal', tone: 'warn' as const },
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

      {/* Category mix */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
        <Card>
          <SectionTitle>Spend by category</SectionTitle>
          <div style={{ display: 'grid', gap: 10 }}>
            {byCategory.map(([cat, amt]) => {
              const pct = (amt / totalYtd) * 100;
              return (
                <div key={cat}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                    <div style={{ fontWeight: 600 }}>{cat}</div>
                    <div style={{ fontFamily: 'var(--font-condensed)', fontWeight: 700 }}>
                      {fmt$(amt)} · {pct.toFixed(0)}%
                    </div>
                  </div>
                  <div style={{ height: 8, background: 'var(--color-surf2)', borderRadius: 4 }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: '#4FA8FF', borderRadius: 4 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <SectionTitle>Vendors · YTD</SectionTitle>
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
                <th style={{ padding: '8px 10px' }}>Vendor</th>
                <th style={{ padding: '8px 10px' }}>Tier</th>
                <th style={{ padding: '8px 10px', textAlign: 'right' }}>YTD</th>
                <th style={{ padding: '8px 10px', textAlign: 'right' }}>vs LY</th>
                <th style={{ padding: '8px 10px', textAlign: 'right' }}>Share</th>
                <th style={{ padding: '8px 10px' }}>Contract ends</th>
                <th style={{ padding: '8px 10px' }}>Terms</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((v) => {
                const growth = ((v.ytdSpend - v.lastYearSpend) / v.lastYearSpend) * 100;
                const t = TIER_STYLE[v.tier];
                return (
                  <tr key={v.vendor} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '10px 10px', fontWeight: 600 }}>
                      {v.vendor}
                      <div style={{ fontSize: 11, color: 'var(--color-muted)', fontFamily: 'var(--font-condensed)', marginTop: 2 }}>
                        {v.category}
                      </div>
                    </td>
                    <td style={{ padding: '10px 10px' }}>
                      <span
                        style={{
                          background: t.bg,
                          color: t.fg,
                          padding: '2px 8px',
                          borderRadius: 999,
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {t.label}
                      </span>
                    </td>
                    <td style={{ padding: '10px 10px', textAlign: 'right', fontFamily: 'var(--font-condensed)', fontWeight: 700 }}>
                      {fmt$(v.ytdSpend)}
                    </td>
                    <td
                      style={{
                        padding: '10px 10px',
                        textAlign: 'right',
                        fontFamily: 'var(--font-condensed)',
                        fontWeight: 700,
                        color: growth > 20 ? '#8A5A0F' : growth > 0 ? 'var(--color-text)' : '#165E36',
                      }}
                    >
                      {growth > 0 ? '+' : ''}
                      {growth.toFixed(0)}%
                    </td>
                    <td style={{ padding: '10px 10px', textAlign: 'right', fontFamily: 'var(--font-condensed)' }}>
                      {(v.concentration * 100).toFixed(0)}%
                    </td>
                    <td
                      style={{
                        padding: '10px 10px',
                        fontFamily: 'var(--font-condensed)',
                        fontSize: 12,
                        color: v.contractEnds === 'Month-to-month' ? 'var(--color-muted)' : 'var(--color-text)',
                      }}
                    >
                      {v.contractEnds}
                    </td>
                    <td style={{ padding: '10px 10px', fontFamily: 'var(--font-condensed)', fontSize: 12, color: 'var(--color-muted)' }}>
                      {v.paymentTerms}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </div>

      <div style={{ marginTop: 20 }}>
        <Card>
          <SectionTitle>Concentration & renegotiation</SectionTitle>
          <div style={{ display: 'grid', gap: 12, fontSize: 14, lineHeight: 1.55 }}>
            <div>
              <strong>Pacific Textile at 34% of supplier spend is our biggest single-vendor concentration.</strong> Their contract
              renews Dec 2026. Start dual-sourcing Q3 — identify one backup mill for our top 4 SKUs before signing extension.
            </div>
            <div>
              <strong>Ironclad Legal grew 93% YoY.</strong> That's engagement-based (acquisition scoping, wholesale contracts) and
              expected to taper. Monitor Q3 — if still elevated, consider moving to a fixed-fee arrangement.
            </div>
            <div>
              <strong>Three contracts expire by September.</strong> Aon Insurance (Jun), Riverdale Packaging (Jul), Atlanta Warehouse
              (Sep). Start RFPs this month — each is a chance to pull 4–8% on rates.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
