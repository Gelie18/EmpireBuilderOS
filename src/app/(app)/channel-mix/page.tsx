'use client';

import { useMemo } from 'react';
import { useSubco } from '@/contexts/SubcoContext';
import { ALL_PORTFOLIO_SUBCOS, type ChannelName } from '@/lib/subcos';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
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

const CHANNEL_COLOR: Record<ChannelName, string> = {
  'Amazon':            '#FF9900',
  'Shopify (DTC)':     '#5E8E3E',
  'BigCommerce (DTC)': '#0D52FF',
  'Retail (QB)':       '#7C3AED',
  'Wholesale':         '#E8B84B',
  'Direct':            '#2DB47A',
};

const CHANNEL_HEALTH: Record<ChannelName, { take: string; trend: 'up' | 'flat' | 'down'; note: string }> = {
  'Amazon':            { take: '15–22%',       trend: 'down', note: 'FBA fees + ad take-rate compressing margin' },
  'Shopify (DTC)':     { take: '2.9% + $0.30', trend: 'up',   note: 'Highest LTV; owns CX and data' },
  'BigCommerce (DTC)': { take: '2.9% + $0.30', trend: 'flat', note: 'Secondary DTC — legacy migration candidate' },
  'Retail (QB)':       { take: '0%',            trend: 'flat', note: 'Brick-and-mortar; QB manual entry' },
  'Wholesale':         { take: '0%',            trend: 'up',   note: 'Terms-based; strong on BGL + DDW' },
  'Direct':            { take: '0%',            trend: 'up',   note: 'Custom/pro orders; highest GM' },
};

export default function ChannelMixPage() {
  const { subco, isTopco } = useSubco();

  // Rolled up channel mix if topco, otherwise the subco's own channels.
  const channels = useMemo(() => {
    if (isTopco) {
      const map = new Map<ChannelName, number>();
      for (const s of ALL_PORTFOLIO_SUBCOS) {
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
    }
    return subco.channels
      .slice()
      .sort((a, b) => b.revenue - a.revenue)
      .map((c) => ({ name: c.name, revenue: c.revenue, pct: c.pct }));
  }, [subco, isTopco]);

  const totalRev = channels.reduce((a, c) => a + c.revenue, 0);
  const topChannel = channels[0];
  const concentrationRisk = topChannel && topChannel.pct >= 50;

  // Per-subco channel matrix (topco only)
  const matrix = useMemo(() => {
    if (!isTopco) return null;
    const operating = ALL_PORTFOLIO_SUBCOS;
    const allChannels = Array.from(
      new Set(operating.flatMap((s) => s.channels.map((c) => c.name))),
    ) as ChannelName[];

    return {
      channels: allChannels,
      rows: operating.map((s) => {
        const byChannel = new Map(s.channels.map((c) => [c.name, c]));
        return {
          subco: s,
          cells: allChannels.map((ch) => byChannel.get(ch)),
        };
      }),
    };
  }, [isTopco]);

  const chartData = channels.map((c) => ({ name: c.name, revenue: c.revenue, pct: c.pct }));

  return (
    <div className="flex flex-col gap-5">

      {/* Hero */}
      <div style={{ ...CARD, padding: '24px 28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.5,
          background: `radial-gradient(600px circle at 85% 0%, rgba(${subco.colors.primaryRgb}, 0.12) 0%, transparent 60%)`,
        }} />
        <div className="flex flex-wrap items-start justify-between gap-4" style={{ position: 'relative' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: subco.colors.accent, marginBottom: 8,
            }}>
              Channel Mix · Revenue by Sales Channel
            </div>
            <div style={{
              fontSize: 30, fontWeight: 800, lineHeight: 1.05,
              color: 'var(--color-text)', letterSpacing: '-0.02em',
              display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
              fontFamily: DISPLAY_FONT,
            }}>
              <span style={{
                background: subco.colors.primary, color: '#FFFFFF',
                borderRadius: 5, padding: '3px 9px', fontSize: 14, fontWeight: 900,
              }}>
                {subco.monogram}
              </span>
              <span>{isTopco ? 'Consolidated Channel Mix' : subco.name}</span>
            </div>
            <div style={{ marginTop: 10, fontSize: 13, color: 'var(--color-muted)', maxWidth: 720, lineHeight: 1.5 }}>
              {isTopco
                ? `Rolled up across all ${ALL_PORTFOLIO_SUBCOS.length} operating brands. ${money(totalRev)} annualized revenue distributed across ${channels.length} channels.`
                : `${money(totalRev)} annualized revenue across ${channels.length} channels. Top channel contributes ${topChannel?.pct.toFixed(0)}%.`
              }
            </div>
          </div>
          {concentrationRisk && (
            <div style={{
              background: 'rgba(247,165,0,0.12)', border: '1px solid rgba(247,165,0,0.35)',
              color: '#F7A500', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', padding: '6px 14px', borderRadius: 5,
              alignSelf: 'center',
            }}>
              ⚠ Concentration risk — {topChannel?.name} {topChannel?.pct.toFixed(0)}%
            </div>
          )}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="Total Channels" value={channels.length.toString()} sub="Distinct revenue streams" accent={subco.colors.primary} />
        <Kpi label="Top Channel" value={topChannel?.name ?? '—'} sub={`${topChannel?.pct.toFixed(1)}% of revenue`} accent={subco.colors.accent} />
        <Kpi label="DTC Share" value={`${channels.filter((c) => c.name.includes('DTC')).reduce((a, c) => a + c.pct, 0).toFixed(1)}%`} sub="Shopify + BigCommerce" accent="#2DB47A" />
        <Kpi label="Marketplace Share" value={`${channels.filter((c) => c.name === 'Amazon').reduce((a, c) => a + c.pct, 0).toFixed(1)}%`} sub="Amazon" accent="#FF9900" />
      </div>

      {/* Donut + bar */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-5" style={{ ...CARD, padding: '22px 24px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
            Revenue split
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, marginTop: 4, marginBottom: 14, fontFamily: DISPLAY_FONT }}>
            {money(totalRev)} across {channels.length} channels
          </div>
          <div style={{ height: 250 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="revenue"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={2}
                >
                  {chartData.map((c) => (
                    <Cell key={c.name} fill={CHANNEL_COLOR[c.name as ChannelName] ?? '#666'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1E2236', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, fontSize: 12, color: '#FFFFFF' }}
                  formatter={(v) => [money(Number(v)), 'Revenue']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7" style={{ ...CARD, padding: '22px 24px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
            Revenue · by channel
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, marginTop: 4, marginBottom: 14, fontFamily: DISPLAY_FONT }}>
            Dollar contribution, ranked
          </div>
          <div style={{ height: 250 }}>
            <ResponsiveContainer>
              <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--color-chart-grid)" horizontal={false} />
                <XAxis type="number" tick={{ fill: 'var(--color-chart-text)', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.12)' }} tickLine={false} tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`} />
                <YAxis type="category" dataKey="name" tick={{ fill: 'var(--color-chart-text)', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.12)' }} tickLine={false} width={130} />
                <Tooltip
                  contentStyle={{ background: '#1E2236', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, fontSize: 12, color: '#FFFFFF' }}
                  formatter={(v) => [money(Number(v)), 'Revenue']}
                />
                <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                  {chartData.map((c) => (
                    <Cell key={c.name} fill={CHANNEL_COLOR[c.name as ChannelName] ?? '#666'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Channel detail table */}
      <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
            Channel Detail
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, marginTop: 3, fontFamily: DISPLAY_FONT }}>
            Per-channel economics & signal
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--color-muted)', fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase' }}>
                <th style={thStyle}>Channel</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Revenue (12M)</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>% of Mix</th>
                <th style={thStyle}>Contribution</th>
                <th style={thStyle}>Take / Fees</th>
                <th style={thStyle}>Trend</th>
                <th style={thStyle}>Signal</th>
              </tr>
            </thead>
            <tbody>
              {channels.map((c, i) => {
                const health = CHANNEL_HEALTH[c.name as ChannelName];
                const color = CHANNEL_COLOR[c.name as ChannelName] ?? '#666';
                return (
                  <tr key={c.name} style={{ background: i % 2 === 1 ? 'rgba(255,255,255,0.015)' : 'transparent' }}>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
                        <span style={{ fontWeight: 700 }}>{c.name}</span>
                      </div>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontFamily: DISPLAY_FONT, fontWeight: 700 }}>
                      {money(c.revenue)}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700 }}>
                      {c.pct.toFixed(1)}%
                    </td>
                    <td style={tdStyle}>
                      <div style={{ width: 140, height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ width: `${c.pct}%`, height: '100%', background: color }} />
                      </div>
                    </td>
                    <td style={{ ...tdStyle, color: 'var(--color-muted)' }}>
                      {health?.take ?? '—'}
                    </td>
                    <td style={tdStyle}>
                      <TrendBadge trend={health?.trend ?? 'flat'} />
                    </td>
                    <td style={{ ...tdStyle, color: 'var(--color-muted)', whiteSpace: 'normal', maxWidth: 320 }}>
                      {health?.note ?? '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Per-subco channel matrix — topco only */}
      {matrix && (
        <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
              Channel Matrix · per brand
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, marginTop: 3, fontFamily: DISPLAY_FONT }}>
              Who sells where — dollar volume by brand × channel
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 12 }}>
              <thead>
                <tr style={{ textAlign: 'left', color: 'var(--color-muted)', fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase' }}>
                  <th style={thStyle}>Brand</th>
                  {matrix.channels.map((ch) => (
                    <th key={ch} style={{ ...thStyle, textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: CHANNEL_COLOR[ch] }} />
                        {ch}
                      </div>
                    </th>
                  ))}
                  <th style={{ ...thStyle, textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {matrix.rows.map((row, i) => {
                  const total = row.subco.annualRevenue;
                  return (
                    <tr key={row.subco.id} style={{ background: i % 2 === 1 ? 'rgba(255,255,255,0.015)' : 'transparent' }}>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{
                            background: row.subco.colors.primary, color: '#FFFFFF',
                            borderRadius: 4, padding: '2px 7px', fontSize: 10, fontWeight: 900,
                          }}>
                            {row.subco.monogram}
                          </span>
                          <span style={{ fontWeight: 600 }}>{row.subco.shortName}</span>
                        </div>
                      </td>
                      {row.cells.map((cell, j) => (
                        <td key={j} style={{ ...tdStyle, textAlign: 'right' }}>
                          {cell ? (
                            <div>
                              <div style={{ fontFamily: DISPLAY_FONT, fontWeight: 700 }}>{money(cell.revenue)}</div>
                              <div style={{ fontSize: 10, color: 'var(--color-muted)', marginTop: 1 }}>{cell.pct}%</div>
                            </div>
                          ) : (
                            <span style={{ color: 'var(--color-subtle)' }}>—</span>
                          )}
                        </td>
                      ))}
                      <td style={{ ...tdStyle, textAlign: 'right', fontFamily: DISPLAY_FONT, fontWeight: 700 }}>
                        {money(total)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Insights */}
      <div style={{ ...CARD, padding: '22px 24px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
          Observations
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, marginTop: 4, marginBottom: 14, fontFamily: DISPLAY_FONT }}>
          What the channel mix is telling you
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12 }}>
          {buildInsights(channels, isTopco).map((ins, i) => (
            <div key={i} style={{
              border: '1px solid var(--color-border)',
              borderRadius: 10,
              padding: '14px 16px',
              background: 'rgba(255,255,255,0.02)',
            }}>
              <div style={{
                fontSize: 10, fontWeight: 800, letterSpacing: '0.10em',
                textTransform: 'uppercase', color: ins.tone === 'warn' ? '#F7A500' : ins.tone === 'good' ? '#2DB47A' : '#E8B84B',
                marginBottom: 6,
              }}>
                {ins.tag}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, lineHeight: 1.35 }}>
                {ins.title}
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-muted)', lineHeight: 1.5 }}>
                {ins.body}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────

type Insight = { tag: string; title: string; body: string; tone: 'warn' | 'good' | 'info' };

function buildInsights(
  channels: Array<{ name: string; revenue: number; pct: number }>,
  isTopco: boolean,
): Insight[] {
  const out: Insight[] = [];
  const top = channels[0];
  const amazon = channels.find((c) => c.name === 'Amazon');
  const shopify = channels.find((c) => c.name === 'Shopify (DTC)');
  const wholesale = channels.find((c) => c.name === 'Wholesale');

  if (top && top.pct >= 50) {
    out.push({
      tag: 'Concentration risk',
      title: `${top.name} carries ${top.pct.toFixed(0)}% of revenue`,
      body: `If ${top.name} take-rate or terms move against you, ${(top.pct / 100 * 1).toFixed(2)}x of revenue is exposed. Consider diversifying into a second DTC or wholesale channel.`,
      tone: 'warn',
    });
  }

  if (amazon && amazon.pct >= 35) {
    out.push({
      tag: 'Marketplace dependency',
      title: `Amazon is ${amazon.pct.toFixed(0)}% of the mix`,
      body: `Amazon FBA + ad take-rate is 15–22%. At ${amazon.pct.toFixed(0)}% mix, a 3pt take-rate shift compresses blended GM by ~${(amazon.pct * 0.03).toFixed(1)}pts.`,
      tone: 'warn',
    });
  }

  if (shopify && shopify.pct >= 25) {
    out.push({
      tag: 'DTC strength',
      title: `${shopify.pct.toFixed(0)}% Shopify — you own the customer`,
      body: `Direct channel gives full control over pricing, data, and LTV. Use this share to fund retention programs and lifetime-value lift before chasing new acquisition.`,
      tone: 'good',
    });
  }

  if (wholesale && wholesale.pct >= 15) {
    out.push({
      tag: 'B2B leverage',
      title: `Wholesale at ${wholesale.pct.toFixed(0)}% — watch DSO`,
      body: `Wholesale adds terms-based revenue (Net-30/60). Strong channel for BGL + DDW, but collections cadence needs tracking to keep working capital healthy.`,
      tone: 'info',
    });
  }

  if (isTopco) {
    out.push({
      tag: 'Portfolio view',
      title: 'Mix differs wildly by brand',
      body: 'SSK is 52% Amazon; BGL is 72% Shopify; AAS is 42% Wholesale. Channel strategy should be set per-brand, not blanket — the matrix below shows where each one lives.',
      tone: 'info',
    });
  }

  return out;
}

function Kpi({ label, value, sub, accent }: { label: string; value: string; sub: string; accent: string }) {
  return (
    <div style={{ ...CARD, padding: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--color-text)', lineHeight: 1.1, fontFamily: DISPLAY_FONT }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: 'var(--color-muted)', fontWeight: 500 }}>
        {sub}
      </div>
      <div style={{ marginTop: 4, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div style={{ width: '100%', height: '100%', background: accent }} />
      </div>
    </div>
  );
}

function TrendBadge({ trend }: { trend: 'up' | 'flat' | 'down' }) {
  const meta = {
    up:   { color: '#2DB47A', bg: 'rgba(45,180,122,0.14)', arrow: '↑', label: 'Growing' },
    flat: { color: 'var(--color-muted)', bg: 'rgba(255,255,255,0.04)', arrow: '→', label: 'Flat' },
    down: { color: '#E06060', bg: 'rgba(224,96,96,0.14)', arrow: '↓', label: 'Declining' },
  }[trend];
  return (
    <span style={{
      fontSize: 10, fontWeight: 800, letterSpacing: '0.08em',
      padding: '3px 8px', borderRadius: 4,
      background: meta.bg, color: meta.color,
      display: 'inline-flex', alignItems: 'center', gap: 4,
    }}>
      <span>{meta.arrow}</span> {meta.label}
    </span>
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
