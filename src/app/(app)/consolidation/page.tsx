'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useSubco } from '@/contexts/SubcoContext';
import { ALL_PORTFOLIO_SUBCOS } from '@/lib/subcos';
import { getSkuBundle, type Sku } from '@/lib/sku-data';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell,
  PieChart, Pie,
} from 'recharts';

const CARD: React.CSSProperties = {
  background: 'var(--color-surf)',
  borderRadius: 'var(--card-radius)',
  boxShadow: 'var(--card-shadow)',
  border: '1px solid var(--color-border)',
};

const DISPLAY_FONT = 'Aeonik, Inter, "DM Sans", system-ui, sans-serif';

function money(n: number) {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

const CHANNEL_COLOR: Record<string, string> = {
  'Amazon':            '#FF9900',
  'Shopify (DTC)':     '#5E8E3E',
  'BigCommerce (DTC)': '#0D52FF',
  'Retail (QB)':       '#7C3AED',
  'Wholesale':         '#F58A1F',
  'Direct':            '#2DB47A',
};

export default function ConsolidationPage() {
  const { subco, isConsolidated, setSubcoId } = useSubco();

  // Always operate against the full portfolio (5 operating subcos, not holdco).
  const operating = useMemo(() => ALL_PORTFOLIO_SUBCOS, []);

  const totals = useMemo(() => {
    const totalRev = operating.reduce((a, s) => a + s.annualRevenue, 0);
    const weightedGM = totalRev > 0
      ? operating.reduce((a, s) => a + s.grossMargin * s.annualRevenue, 0) / totalRev
      : 0;
    const totalGP = operating.reduce((a, s) => a + (s.grossMargin / 100) * s.annualRevenue, 0);
    return { totalRev, weightedGM, totalGP };
  }, [operating]);

  // Roll up channel mix: sum dollars per channel across all subcos.
  const channelRollup = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of operating) {
      for (const c of s.channels) {
        map.set(c.name, (map.get(c.name) ?? 0) + c.revenue);
      }
    }
    const total = Array.from(map.values()).reduce((a, b) => a + b, 0);
    return Array.from(map.entries())
      .map(([name, revenue]) => ({
        name,
        revenue,
        pct: total > 0 ? (revenue / total) * 100 : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [operating]);

  // Cross-brand top SKUs
  const topSkus = useMemo(() => {
    const all: Array<Sku & { brandLabel: string; brandColor: string; brandId: string }> = [];
    for (const s of operating) {
      const bundle = getSkuBundle(s.id);
      for (const sku of bundle.skus) {
        all.push({ ...sku, brandLabel: s.monogram, brandColor: s.colors.primary, brandId: s.id });
      }
    }
    return all.sort((a, b) => b.revenue12M - a.revenue12M).slice(0, 10);
  }, [operating]);

  // SKU health aggregation across portfolio
  const skuHealth = useMemo(() => {
    let totalSkus = 0, activeSkus = 0, deadSkus = 0, bleederSkus = 0, cashInDeadStock = 0, proposedCuts = 0;
    for (const s of operating) {
      const b = getSkuBundle(s.id);
      totalSkus += b.totalSkus;
      activeSkus += b.activeSkus;
      deadSkus += b.deadSkus;
      bleederSkus += b.bleederSkus;
      cashInDeadStock += b.cashInDeadStock;
      proposedCuts += b.proposedCuts;
    }
    return { totalSkus, activeSkus, deadSkus, bleederSkus, cashInDeadStock, proposedCuts };
  }, [operating]);

  const contributionData = operating
    .map((s) => ({
      name: s.shortName,
      revenue: s.annualRevenue,
      pct: totals.totalRev > 0 ? (s.annualRevenue / totals.totalRev) * 100 : 0,
      color: s.colors.primary,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  const marginCompare = operating
    .map((s) => ({
      name: s.shortName,
      gm: s.grossMargin,
      color: s.colors.primary,
    }))
    .sort((a, b) => b.gm - a.gm);

  return (
    <div className="flex flex-col gap-5">

      {/* ── Hero ── */}
      <div style={{ ...CARD, padding: '28px 32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.55,
          background: 'radial-gradient(700px circle at 85% 0%, rgba(27,77,230,0.14) 0%, transparent 60%)',
        }} />
        <div className="flex flex-wrap items-start justify-between gap-4" style={{ position: 'relative' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: '#F58A1F', marginBottom: 8,
            }}>
              Consolidation Layer · Portfolio Roll-up
            </div>
            <div style={{
              fontSize: 32, fontWeight: 800, lineHeight: 1.05,
              color: 'var(--color-text)', letterSpacing: '-0.02em',
              fontFamily: DISPLAY_FONT,
            }}>
              783 Partners · {operating.length} Operating Brands
            </div>
            <div style={{ marginTop: 10, fontSize: 14, color: 'var(--color-muted)', maxWidth: 780, lineHeight: 1.5 }}>
              One financial picture across every subsidiary. Revenue, margin, channel mix, and SKU
              health consolidated in real time — no spreadsheet merge, no waiting on month-end close.
            </div>
          </div>
          {!isConsolidated && (
            <button
              onClick={() => setSubcoId('consolidated')}
              style={{
                background: '#1B4DE6', border: 'none', color: '#FFFFFF',
                padding: '10px 16px', borderRadius: 8, cursor: 'pointer',
                fontSize: 12, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase',
                boxShadow: '0 4px 14px rgba(27,77,230,0.35)',
              }}
            >
              Switch to Consolidated View →
            </button>
          )}
        </div>
      </div>

      {/* ── KPI strip ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="Consolidated Revenue" value={money(totals.totalRev)} sub="Trailing 12 months" accent="#1B4DE6" />
        <Kpi label="Blended Gross Margin" value={`${totals.weightedGM.toFixed(1)}%`} sub="Revenue-weighted avg" accent="#F58A1F" />
        <Kpi label="Total Gross Profit" value={money(totals.totalGP)} sub="Annualized" accent="#2DB47A" />
        <Kpi label="Dead-stock Capital" value={money(skuHealth.cashInDeadStock)} sub={`${skuHealth.deadSkus} zero-mover SKUs`} accent="#E06060" />
      </div>

      {/* ── Subsidiary rollup table ── */}
      <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
              Subsidiary Rollup
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, marginTop: 3, fontFamily: DISPLAY_FONT }}>
              Revenue · Margin · Contribution — all {operating.length} operating brands
            </div>
          </div>
          <div style={{
            alignSelf: 'center',
            background: 'rgba(45,180,122,0.12)', border: '1px solid rgba(45,180,122,0.30)',
            color: '#2DB47A', fontSize: 10, fontWeight: 800, letterSpacing: '0.10em',
            textTransform: 'uppercase', padding: '6px 12px', borderRadius: 5,
          }}>
            Live · synced Apr 22, 9:14 AM
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--color-muted)', fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase' }}>
                <th style={thStyle}>Subsidiary</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Revenue (12M)</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Gross Margin</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Gross Profit</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>% of Portfolio</th>
                <th style={thStyle}>Contribution</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>SKUs</th>
                <th style={{ ...thStyle, width: 40 }}></th>
              </tr>
            </thead>
            <tbody>
              {operating
                .slice()
                .sort((a, b) => b.annualRevenue - a.annualRevenue)
                .map((s, i) => {
                  const pct = totals.totalRev > 0 ? (s.annualRevenue / totals.totalRev) * 100 : 0;
                  const gp = (s.grossMargin / 100) * s.annualRevenue;
                  const bundle = getSkuBundle(s.id);
                  return (
                    <tr key={s.id} style={{ background: i % 2 === 1 ? 'rgba(255,255,255,0.015)' : 'transparent' }}>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{
                            background: s.colors.primary, color: '#FFFFFF',
                            borderRadius: 4, padding: '3px 7px', fontSize: 11, fontWeight: 900,
                            minWidth: 36, textAlign: 'center',
                          }}>
                            {s.monogram}
                          </span>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 700 }}>{s.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 2 }}>
                              {s.tagline}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'right', fontFamily: DISPLAY_FONT, fontWeight: 700 }}>
                        {money(s.annualRevenue)}
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'right', color: s.grossMargin >= 50 ? '#2DB47A' : s.grossMargin >= 40 ? 'var(--color-text)' : '#F7A500', fontWeight: 600 }}>
                        {s.grossMargin.toFixed(1)}%
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'right', color: 'var(--color-muted)' }}>
                        {money(gp)}
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700 }}>
                        {pct.toFixed(1)}%
                      </td>
                      <td style={tdStyle}>
                        <div style={{ width: 140, height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: s.colors.primary }} />
                        </div>
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'right', color: 'var(--color-muted)' }}>
                        {bundle.activeSkus.toLocaleString()}
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'right' }}>
                        <button
                          onClick={() => setSubcoId(s.id)}
                          style={{
                            background: 'transparent', border: '1px solid var(--color-border)',
                            color: 'var(--color-muted)', padding: '4px 10px', borderRadius: 5,
                            fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                            textTransform: 'uppercase', cursor: 'pointer',
                          }}
                          title={`Switch dashboard context to ${s.name}`}
                        >
                          Drill →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              {/* Totals */}
              <tr style={{ background: 'rgba(245,138,31,0.06)', borderTop: '2px solid rgba(245,138,31,0.30)' }}>
                <td style={{ ...tdStyle, fontWeight: 800, fontSize: 13 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      background: '#F58A1F', color: '#0B0D17',
                      borderRadius: 4, padding: '3px 7px', fontSize: 11, fontWeight: 900,
                      minWidth: 36, textAlign: 'center',
                    }}>
                      BL
                    </span>
                    <span>Consolidated Total</span>
                  </div>
                </td>
                <td style={{ ...tdStyle, textAlign: 'right', fontFamily: DISPLAY_FONT, fontWeight: 900, fontSize: 14, color: '#F58A1F' }}>
                  {money(totals.totalRev)}
                </td>
                <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 800, color: '#F58A1F' }}>
                  {totals.weightedGM.toFixed(1)}%
                </td>
                <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700 }}>
                  {money(totals.totalGP)}
                </td>
                <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 800 }}>100.0%</td>
                <td style={tdStyle}>
                  <div style={{ width: 140, height: 8, background: 'rgba(245,138,31,0.15)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg,#1B4DE6,#F58A1F)' }} />
                  </div>
                </td>
                <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: 'var(--color-muted)' }}>
                  {skuHealth.activeSkus.toLocaleString()}
                </td>
                <td style={tdStyle}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Revenue contribution + margin compare ── */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-7" style={{ ...CARD, padding: '22px 24px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
            Revenue Contribution
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, marginTop: 4, marginBottom: 14, fontFamily: DISPLAY_FONT }}>
            Who carries the portfolio
          </div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={contributionData} margin={{ top: 8, right: 16, left: -8, bottom: 8 }}>
                <CartesianGrid stroke="var(--color-chart-grid)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: 'var(--color-chart-text)', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.12)' }} tickLine={false} />
                <YAxis tick={{ fill: 'var(--color-chart-text)', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.12)' }} tickLine={false} tickFormatter={(v) => `$${(v / 1_000_000).toFixed(0)}M`} />
                <Tooltip
                  contentStyle={{ background: '#1E2236', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, fontSize: 12, color: '#FFFFFF' }}
                  formatter={(v, k) => k === 'revenue' ? [money(Number(v)), 'Revenue'] : [v, k]}
                />
                <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                  {contributionData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5" style={{ ...CARD, padding: '22px 24px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
            Gross Margin · per brand
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, marginTop: 4, marginBottom: 14, fontFamily: DISPLAY_FONT }}>
            Where margin is strongest
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {marginCompare.map((m) => (
              <div key={m.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 12 }}>
                  <span style={{ fontWeight: 600 }}>{m.name}</span>
                  <span style={{ fontFamily: DISPLAY_FONT, fontWeight: 800, color: m.gm >= 50 ? '#2DB47A' : 'var(--color-text)' }}>
                    {m.gm.toFixed(1)}%
                  </span>
                </div>
                <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${(m.gm / 70) * 100}%`, height: '100%', background: m.color, borderRadius: 4 }} />
                </div>
              </div>
            ))}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginTop: 4 }} />
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 12 }}>
                <span style={{ fontWeight: 800, color: '#F58A1F' }}>Blended (weighted)</span>
                <span style={{ fontFamily: DISPLAY_FONT, fontWeight: 900, color: '#F58A1F' }}>
                  {totals.weightedGM.toFixed(1)}%
                </span>
              </div>
              <div style={{ height: 10, background: 'rgba(245,138,31,0.10)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${(totals.weightedGM / 70) * 100}%`, height: '100%', background: 'linear-gradient(90deg,#1B4DE6,#F58A1F)' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Channel rollup + Top cross-brand SKUs ── */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-5" style={{ ...CARD, padding: '22px 24px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
            Consolidated Channel Mix
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, marginTop: 4, marginBottom: 8, fontFamily: DISPLAY_FONT }}>
            Where the portfolio sells
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={channelRollup}
                  dataKey="revenue"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                >
                  {channelRollup.map((c) => (
                    <Cell key={c.name} fill={CHANNEL_COLOR[c.name] ?? '#666'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1E2236', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, fontSize: 12, color: '#FFFFFF' }}
                  formatter={(v) => [money(Number(v)), 'Revenue']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
            {channelRollup.map((c) => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: CHANNEL_COLOR[c.name] ?? '#666', flexShrink: 0 }} />
                <span style={{ flex: 1, color: 'var(--color-muted)' }}>{c.name}</span>
                <span style={{ fontFamily: DISPLAY_FONT, fontWeight: 700 }}>{money(c.revenue)}</span>
                <span style={{ fontSize: 11, color: 'var(--color-muted)', minWidth: 40, textAlign: 'right' }}>{c.pct.toFixed(1)}%</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14 }}>
            <Link href="/channel-mix" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#F58A1F' }}>
              Deep-dive channel mix →
            </Link>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7" style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
              Top Cross-Brand SKUs
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, marginTop: 3, fontFamily: DISPLAY_FONT }}>
              The 10 SKUs that move the most dollars across all brands
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 13 }}>
              <thead>
                <tr style={{ textAlign: 'left', color: 'var(--color-muted)', fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase' }}>
                  <th style={thStyle}>#</th>
                  <th style={thStyle}>Brand</th>
                  <th style={thStyle}>SKU</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Revenue (12M)</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>GM</th>
                </tr>
              </thead>
              <tbody>
                {topSkus.map((s, i) => (
                  <tr key={s.sku} style={{ background: i % 2 === 1 ? 'rgba(255,255,255,0.015)' : 'transparent' }}>
                    <td style={{ ...tdStyle, color: 'var(--color-muted)', fontWeight: 700 }}>{i + 1}</td>
                    <td style={tdStyle}>
                      <span style={{
                        background: s.brandColor, color: '#FFFFFF',
                        borderRadius: 4, padding: '2px 6px', fontSize: 10, fontWeight: 800,
                      }}>
                        {s.brandLabel}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 600 }}>{s.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--color-muted)', marginTop: 2 }}>
                        <code>{s.sku}</code> · {s.category}
                      </div>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontFamily: DISPLAY_FONT, fontWeight: 700 }}>
                      {money(s.revenue12M)}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right', color: s.grossMargin >= 0.45 ? '#2DB47A' : s.grossMargin < 0 ? '#FF8A80' : 'var(--color-text)', fontWeight: 600 }}>
                      {(s.grossMargin * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '14px 22px', borderTop: '1px solid var(--color-border)' }}>
            <Link href="/sku-rationalization" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#F58A1F' }}>
              Full SKU rationalization →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Portfolio issues ── */}
      <div style={{ ...CARD, padding: '22px 24px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
          Headline Issues · flagged across the portfolio
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, marginTop: 4, marginBottom: 14, fontFamily: DISPLAY_FONT }}>
          What needs an owner this week
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
          {operating.map((s) => (
            <div key={s.id} style={{
              border: '1px solid var(--color-border)',
              borderRadius: 10,
              padding: '14px 16px',
              background: 'rgba(255,255,255,0.02)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{
                  background: s.colors.primary, color: '#FFFFFF',
                  borderRadius: 4, padding: '2px 7px', fontSize: 10, fontWeight: 900,
                }}>
                  {s.monogram}
                </span>
                <span style={{ fontWeight: 700, fontSize: 13 }}>{s.shortName}</span>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {s.headlineIssues.map((h, i) => (
                  <li key={i} style={{ fontSize: 12, color: 'var(--color-muted)', paddingLeft: 14, position: 'relative', lineHeight: 1.4 }}>
                    <span style={{ position: 'absolute', left: 0, color: s.colors.primary }}>•</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// ── UI helpers ────────────────────────────────────────────────────────────────
function Kpi({ label, value, sub, accent }: { label: string; value: string; sub: string; accent: string }) {
  return (
    <div style={{ ...CARD, padding: 18, display: 'flex', flexDirection: 'column', gap: 8, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(400px circle at 100% 0%, ${accent}22 0%, transparent 60%)`, pointerEvents: 'none' }} />
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-muted)', position: 'relative' }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--color-text)', lineHeight: 1, fontFamily: DISPLAY_FONT, position: 'relative' }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: 'var(--color-muted)', fontWeight: 500, position: 'relative' }}>
        {sub}
      </div>
      <div style={{ marginTop: 4, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', position: 'relative' }}>
        <div style={{ width: '100%', height: '100%', background: accent }} />
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: '12px 16px',
  borderBottom: '1px solid var(--color-border)',
  whiteSpace: 'nowrap',
};
const tdStyle: React.CSSProperties = {
  padding: '12px 16px',
  borderBottom: '1px solid rgba(255,255,255,0.04)',
  whiteSpace: 'nowrap',
};
