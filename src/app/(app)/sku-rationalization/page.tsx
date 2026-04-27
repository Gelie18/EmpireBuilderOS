'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSubco } from '@/contexts/SubcoContext';
import { useDecisions } from '@/contexts/DecisionsContext';
import { getSkuBundle, type Sku } from '@/lib/sku-data';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell,
  LineChart, Line,
} from 'recharts';

const CARD: React.CSSProperties = {
  background: 'var(--color-surf)',
  borderRadius: 'var(--card-radius)',
  boxShadow: 'var(--card-shadow)',
  border: '1px solid var(--color-border)',
};

const DISPLAY_FONT = 'Aeonik, Inter, "DM Sans", system-ui, sans-serif';

const SEGMENT_META: Record<
  Sku['segment'],
  { label: string; color: string; bg: string }
> = {
  core:     { label: 'CORE',     color: '#2DB47A', bg: 'rgba(45,180,122,0.14)' },
  healthy:  { label: 'HEALTHY',  color: '#4FA8FF', bg: 'rgba(79,168,255,0.14)' },
  tail:     { label: 'LONG TAIL',color: '#F7A500', bg: 'rgba(247,165,0,0.14)' },
  dead:     { label: 'DEAD',     color: '#E06060', bg: 'rgba(224,96,96,0.14)' },
  bleeder:  { label: 'MARGIN -', color: '#C13333', bg: 'rgba(193,51,51,0.18)' },
};

function money(n: number) {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

function kShort(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

// Generate a plausible 12-month trend for a given SKU based on segment + total.
function trend12m(sku: Sku): Array<{ month: string; revenue: number }> {
  const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
  const base = sku.revenue12M / 12;
  // Pseudo-random but deterministic from SKU code.
  const seed = sku.sku.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const rand = (i: number) => {
    const x = Math.sin(seed + i * 7.913) * 10000;
    return x - Math.floor(x);
  };

  return months.map((m, i) => {
    let multiplier: number;
    switch (sku.segment) {
      case 'core':    multiplier = 0.85 + rand(i) * 0.35; break;                       // steady ±
      case 'healthy': multiplier = 0.75 + rand(i) * 0.50; break;                       // moderate variance
      case 'tail':    multiplier = 1.5 - i * 0.05 + rand(i) * 0.40; break;             // fading
      case 'bleeder': multiplier = 1.4 - i * 0.08 + rand(i) * 0.35; break;             // fading + loss
      case 'dead':    multiplier = i < 4 ? 0.8 + rand(i) * 0.4 : 0;  break;            // died early
      default:        multiplier = 1;
    }
    multiplier = Math.max(0, multiplier);
    return { month: m, revenue: Math.round(base * multiplier) };
  });
}

// Given a SKU, compute diagnosis + AI recommendation + projected upside.
interface AltAction {
  id: string;
  label: string;
  tone: 'primary' | 'alt' | 'warn';
  headline: string;
  detail: string;
  impact: string;
  risk: string;
}

function analyze(sku: Sku, subcoName: string): {
  diagnosis: { headline: string; reasons: string[] };
  recommendation: { action: string; detail: string; steps: string[]; impact: string; confidence: 'HIGH' | 'MEDIUM' | 'LOW' };
  alternatives: AltAction[];
} {
  const invValue = sku.inventoryUnits * (sku.grossMargin < 0 ? 8 : 12); // rough avg unit cost
  const gmPct = sku.grossMargin * 100;
  const monthsOfCover = sku.daysOfCover > 9000 ? '∞' : (sku.daysOfCover / 30).toFixed(1);

  switch (sku.segment) {
    case 'core':
      return {
        diagnosis: {
          headline: 'Core revenue driver — protect and scale.',
          reasons: [
            `${money(sku.revenue12M)} in trailing 12 months — top decile for ${subcoName}.`,
            `Gross margin holding at ${gmPct.toFixed(1)}% with ${sku.daysOfCover} days of cover (healthy).`,
            `Moving ${sku.units12M.toLocaleString()} units across ${sku.channels.length} channels.`,
          ],
        },
        recommendation: {
          action: 'Double down · protect inventory position',
          detail: `This SKU is doing the heavy lifting. Priority is keeping it in stock across ${sku.channels.join(', ')} and protecting margin against marketplace take-rate creep.`,
          steps: [
            `Lock safety stock — target 60 days of cover (currently ${sku.daysOfCover}).`,
            `Negotiate volume tier with supplier — ${Math.round(sku.units12M * 1.15).toLocaleString()} units/yr forward buy.`,
            `Raise price $1–2 on Amazon before next take-rate step; elasticity is low at this tier.`,
          ],
          impact: `Est. +${money(sku.revenue12M * 0.04)} GP/yr from a 1pt margin lift + stockout avoidance.`,
          confidence: 'HIGH',
        },
        alternatives: [
          { id: 'forward-buy', label: 'Forward-buy inventory', tone: 'primary',
            headline: `Buy ${Math.round(sku.units12M * 1.25).toLocaleString()} units at 8% volume discount`,
            detail: 'Lock 15 months of cover. Hedges against supplier price lift and protects Amazon Buy Box share.',
            impact: `+${money(sku.revenue12M * 0.06)} GP over 15mo · $${Math.round(sku.units12M * 0.08 * 12 / 1000)}K cash outlay`,
            risk: 'Ties up cash for 15mo; aging risk if demand softens.' },
          { id: 'price-lift', label: 'Price lift 2–3%', tone: 'alt',
            headline: 'Lift Amazon retail 2–3% next Monday',
            detail: 'Low-elasticity tier; prior lifts absorbed with <5% volume impact.',
            impact: `+${money(sku.revenue12M * 0.025)} GP/yr at current volume`,
            risk: 'Small volume risk; reversible in 30d if traffic drops.' },
          { id: 'hold', label: 'Hold — no change', tone: 'alt',
            headline: 'Status quo, reassess in 90 days',
            detail: 'SKU is healthy; skip action and revisit at next quarterly review.',
            impact: 'Preserves current GP run-rate; no upside.',
            risk: 'Cedes margin ground if Amazon take-rate steps up again.' },
        ],
      };

    case 'healthy':
      return {
        diagnosis: {
          headline: 'Steady performer — no immediate action.',
          reasons: [
            `${money(sku.revenue12M)} revenue · ${gmPct.toFixed(1)}% GM — within healthy band.`,
            `Inventory turn at ${sku.daysOfCover} days is acceptable.`,
            'No flags from margin, stockout, or channel-mix signals.',
          ],
        },
        recommendation: {
          action: 'Hold · monitor',
          detail: `No intervention needed. Keep ops steady. Next review in 90 days unless channel mix or COGS shift materially.`,
          steps: [
            'Track sell-through vs. forecast weekly.',
            'Flag for review if GM drops below 35% or days cover exceeds 90.',
          ],
          impact: `Status quo preserves ${money(sku.revenue12M * sku.grossMargin)} gross profit annually.`,
          confidence: 'HIGH',
        },
        alternatives: [
          { id: 'hold', label: 'Hold — monitor', tone: 'primary',
            headline: 'No action; review in 90 days',
            detail: 'Metrics are within healthy band. Routine monitoring sufficient.',
            impact: 'Preserves run-rate GP. No change to cashflow.',
            risk: 'Miss opportunity if demand inflects up; lose margin if costs inflect.' },
          { id: 'modest-lift', label: 'Test small price lift', tone: 'alt',
            headline: '+$1 retail test on Shopify',
            detail: '14-day A/B test to probe elasticity before considering Amazon lift.',
            impact: `Upside ~${money(sku.revenue12M * 0.015)} GP if elasticity confirms.`,
            risk: 'Low — DTC-only test is easily reversed.' },
          { id: 'bundle', label: 'Bundle with core SKU', tone: 'alt',
            headline: 'Pair with top-decile SKU in a value bundle',
            detail: 'Increase attach rate; lift AOV and protect this SKU from long-tail decline.',
            impact: `+10–15% units for this SKU; bundle halo effect on core.`,
            risk: 'Requires merchandising work; cannibalization risk if priced wrong.' },
        ],
      };

    case 'tail':
      return {
        diagnosis: {
          headline: 'Long-tail SKU — low volume, high carrying cost.',
          reasons: [
            `Only ${money(sku.revenue12M)} over 12 months — ~${money(sku.revenue12M / 12)}/mo.`,
            `Days of cover is ${sku.daysOfCover} (${monthsOfCover} months) — you're holding more than you'll sell.`,
            `Margin at ${gmPct.toFixed(1)}% doesn't carry the storage + complexity cost of this SKU.`,
          ],
        },
        recommendation: {
          action: 'Discontinue · clear inventory, remove from catalog',
          detail: `The unit economics don't justify shelf space. Run a short clearance on current stock, then sunset the SKU.`,
          steps: [
            `Run 30% promo on Shopify DTC for 21 days — target sell-through of ${Math.round(sku.inventoryUnits * 0.6).toLocaleString()} units.`,
            `Liquidate remaining ${Math.round(sku.inventoryUnits * 0.4).toLocaleString()} units to closeout wholesaler @ ~60% recovery.`,
            `Delist from Amazon after stock clears — avoid future restock trigger.`,
            `Redirect next replenishment PO dollars to top-decile SKUs.`,
          ],
          impact: `Recover ~${money(invValue * 0.45)} in working capital · free ops capacity for faster movers.`,
          confidence: 'MEDIUM',
        },
        alternatives: [
          { id: 'clearance', label: 'Clearance + delist', tone: 'primary',
            headline: `30% promo 21 days, then delist`,
            detail: 'Expect ~60% sell-through; liquidate remainder via closeout wholesaler.',
            impact: `Recover ~${money(invValue * 0.45)} cash · removes SKU bloat`,
            risk: 'Promo dilutes margin; small brand-equity hit for promoted SKU.' },
          { id: 'liquidate', label: 'Immediate liquidation', tone: 'alt',
            headline: 'Dump to closeout wholesaler now',
            detail: 'One-shot cash recovery; no promo ramp. Fastest path to free capital.',
            impact: `Recover ~${money(invValue * 0.22)} cash · fast close`,
            risk: 'Lower recovery per unit than clearance path.' },
          { id: 'price-test', label: 'Last-ditch price test', tone: 'warn',
            headline: 'Raise price 20% on DTC for 14 days',
            detail: 'Convert remaining volume at higher margin before deciding final path.',
            impact: `Best case recovers ${money(sku.revenue12M * 0.15)} GP; decision reframed after test.`,
            risk: 'Extends decision window 2 weeks; may simply stop moving.' },
        ],
      };

    case 'bleeder':
      return {
        diagnosis: {
          headline: 'Margin bleeder — selling below cost.',
          reasons: [
            `Gross margin is ${gmPct.toFixed(1)}% — every unit sold destroys ~${money(Math.abs(sku.revenue12M * Math.abs(sku.grossMargin) / sku.units12M))} of profit.`,
            `You've moved ${sku.units12M.toLocaleString()} units in 12M, generating ${money(sku.revenue12M * sku.grossMargin)} in negative contribution.`,
            `Sitting on ${sku.inventoryUnits.toLocaleString()} units · ${sku.daysOfCover} days cover — continuing to lose money with every sale.`,
          ],
        },
        recommendation: {
          action: 'Urgent · stop bleeding now',
          detail: `This SKU is converting your working capital into losses one unit at a time. Pull from marketplaces immediately, then choose between raising price or write-off.`,
          steps: [
            `Pause all advertising today — marketplace ad spend is amplifying the loss.`,
            `Remove from Amazon Buy Box within 48 hours.`,
            `Attempt price lift of 25–40% on Shopify to test demand at positive margin.`,
            `If no conversion in 14 days at new price → write down ${sku.inventoryUnits.toLocaleString()} units to zero and move to liquidation.`,
            `Identify root cause: was it a COGS spike, freight, or mispriced promo?`,
          ],
          impact: `Stops ~${money(Math.abs(sku.revenue12M * sku.grossMargin))} annualized GM drag · recovers any retrievable margin via price test.`,
          confidence: 'HIGH',
        },
        alternatives: [
          { id: 'stop-bleed', label: 'Pull + price test + write down', tone: 'primary',
            headline: 'Full 4-step stop-bleeding protocol',
            detail: 'Stops the drag today; preserves upside via price test; clean write-down on failure.',
            impact: `Stops ~${money(Math.abs(sku.revenue12M * sku.grossMargin))} annualized drag`,
            risk: 'Customer disappointment for shoppers who saw the low price.' },
          { id: 'write-off', label: 'Immediate write-off', tone: 'warn',
            headline: 'Skip price test, write down today',
            detail: 'Clean accounting hit this month. No management overhead on a marginal SKU.',
            impact: `-${money(invValue)} book value this month · no further losses`,
            risk: 'Forgoes any potential margin recovery from repricing.' },
          { id: 'root-cause', label: 'Root-cause investigation first', tone: 'alt',
            headline: 'Pause bleeding, investigate cause for 7 days',
            detail: 'If COGS spike is reversible (freight, exchange rate, mispriced promo), SKU may recover.',
            impact: 'Could save SKU if cause is fixable. Else proceed to write-off.',
            risk: 'Another week of active drag at current run-rate.' },
        ],
      };

    case 'dead':
      return {
        diagnosis: {
          headline: 'Dead stock — zero sales, locked-up cash.',
          reasons: [
            `No sales recorded since ${sku.lastSold}.`,
            `${sku.inventoryUnits.toLocaleString()} units sitting in inventory · estimated ${money(invValue)} in tied-up working capital.`,
            'No clear path to organic sell-through — product is dormant in the catalog.',
          ],
        },
        recommendation: {
          action: 'Liquidate · recover cash, free warehouse space',
          detail: `The longer this sits, the more it costs in holding fees and opportunity cost. Move it in the next 30 days.`,
          steps: [
            `Bundle with a moving SKU as a "+1 free" promo — attempt 50% clear in 14 days.`,
            `Remaining units → auction on B-stock channel (Forward, B-Stock Solutions) — expect ${Math.round(invValue * 0.20)} recovery.`,
            `Write down remaining book value and close the SKU.`,
            `Add to the "do-not-reorder" list — prevents future auto-replenishment.`,
          ],
          impact: `Recover ~${money(invValue * 0.25)} cash · remove ${sku.inventoryUnits.toLocaleString()} units of warehouse bloat.`,
          confidence: 'HIGH',
        },
        alternatives: [
          { id: 'liquidate', label: 'Bundle + B-stock liquidation', tone: 'primary',
            headline: '"+1 free" promo, then B-stock auction',
            detail: 'Maximizes sell-through; B-stock auction cleans remainder within 30 days.',
            impact: `Recover ~${money(invValue * 0.25)} cash · clear warehouse`,
            risk: 'B-stock price discovery dependent on channel demand.' },
          { id: 'donate', label: 'Donate for tax deduction', tone: 'alt',
            headline: 'Inventory donation — book fair market value',
            detail: 'Immediate warehouse clear; tax benefit depending on donation channel and jurisdiction.',
            impact: `Tax shield of ~${money(invValue * 0.30)} depending on entity structure`,
            risk: 'Tax treatment requires CPA confirmation; slower than B-stock.' },
          { id: 'scrap', label: 'Scrap & write-off', tone: 'warn',
            headline: 'Remove from warehouse this week',
            detail: 'Zero recovery but fastest path to freed space and cleaner books.',
            impact: `${money(invValue)} write-off · ${sku.inventoryUnits.toLocaleString()} units of space freed`,
            risk: 'Leaves money on the table vs. auction or donation.' },
        ],
      };
  }
}

export default function SkuRationalizationPage() {
  const { subco, isTopco } = useSubco();
  const bundle = getSkuBundle(subco.id);
  const [segment, setSegment] = useState<'all' | Sku['segment']>('all');
  const [selected, setSelected] = useState<Sku | null>(null);

  const filtered = useMemo(() => {
    return segment === 'all' ? bundle.skus : bundle.skus.filter((s) => s.segment === segment);
  }, [bundle, segment]);

  const top10 = useMemo(() => {
    return [...bundle.skus].sort((a, b) => b.revenue12M - a.revenue12M).slice(0, 10);
  }, [bundle]);

  const deadCount = bundle.deadSkus;
  const bleederCount = bundle.bleederSkus;

  const paretoCumulative = useMemo(() => {
    const sorted = [...bundle.skus]
      .filter((s) => s.revenue12M > 0)
      .sort((a, b) => b.revenue12M - a.revenue12M);
    const total = sorted.reduce((acc, s) => acc + s.revenue12M, 0);
    let running = 0;
    return sorted.map((s, i) => {
      running += s.revenue12M;
      return {
        rank: i + 1,
        name: s.name.length > 24 ? `${s.name.slice(0, 22)}…` : s.name,
        revenue: s.revenue12M,
        cumPct: total > 0 ? running / total : 0,
      };
    });
  }, [bundle]);

  return (
    <div className="flex flex-col gap-5">

      {/* ── Executive summary header ── */}
      <div style={{ ...CARD, padding: '24px 28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.5,
          background: `radial-gradient(600px circle at 85% 0%, rgba(${subco.colors.primaryRgb}, 0.10) 0%, transparent 60%)`,
        }} />
        <div className="flex flex-wrap items-start justify-between gap-4" style={{ position: 'relative' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: subco.colors.accent, marginBottom: 8,
            }}>
              Executive Summary · SKU Rationalization
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
              <span>{isTopco ? 'Portfolio-wide SKU Pareto' : subco.name}</span>
            </div>
            <div style={{ marginTop: 10, fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.5, maxWidth: 720 }}>
              {isTopco
                ? 'Topco roll-up: 3,840 SKUs across 5 brands. Top 20% drive 78% of revenue. The tail is carrying $1.24M in dead stock and 614 zero-movers eligible for prune.'
                : `${bundle.totalSkus.toLocaleString()} SKUs in catalog · ${bundle.activeSkus.toLocaleString()} active · ${bundle.paretoShare * 100}% of revenue comes from top 20% · ${money(bundle.cashInDeadStock)} tied up in dead stock.`
              }
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: subco.colors.accent, fontWeight: 700, letterSpacing: '0.06em' }}>
              → Click any SKU row below for diagnosis + AI recommendation.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{
              background: 'rgba(193,51,51,0.12)', border: '1px solid rgba(193,51,51,0.35)',
              color: '#FF8A80', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', padding: '6px 14px', borderRadius: 5,
            }}>
              ⚠ {bundle.proposedCuts} SKUs proposed for cut
            </div>
            <div style={{
              background: `rgba(${subco.colors.accentRgb}, 0.14)`,
              border: `1px solid rgba(${subco.colors.accentRgb}, 0.35)`,
              color: subco.colors.accent, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', padding: '6px 14px', borderRadius: 5,
            }}>
              +{bundle.marginUpliftPct.toFixed(1)}% GM upside
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI bento row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Active SKUs"
          value={bundle.activeSkus.toLocaleString()}
          sub={`of ${bundle.totalSkus.toLocaleString()} total`}
          progressPct={Math.round((bundle.activeSkus / bundle.totalSkus) * 100)}
          accent={subco.colors.primary}
          icon={<IconGrid />}
        />
        <KpiCard
          label="Top-20% Revenue Share"
          value={`${Math.round(bundle.paretoShare * 100)}%`}
          sub={`${Math.round(bundle.tailShare * 100)}% from bottom 50%`}
          progressPct={Math.round(bundle.paretoShare * 100)}
          accent="#2DB47A"
          icon={<IconPareto />}
        />
        <KpiCard
          label="Dead Stock Value"
          value={money(bundle.cashInDeadStock)}
          sub={`${deadCount} zero-mover SKUs`}
          progressPct={Math.min(100, Math.round((bundle.cashInDeadStock / Math.max(1, subco.annualRevenue)) * 300))}
          accent="#E06060"
          icon={<IconBox />}
        />
        <KpiCard
          label="Margin Bleeders"
          value={bleederCount.toString()}
          sub="negative contribution"
          progressPct={Math.min(100, Math.round((bleederCount / Math.max(1, bundle.activeSkus)) * 1000))}
          accent="#C13333"
          icon={<IconAlert />}
        />
      </div>

      {/* ── Pareto chart + priority actions (bento) ── */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8" style={{ ...CARD, padding: '22px 24px' }}>
          <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
                Pareto · Revenue concentration
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, marginTop: 4, fontFamily: DISPLAY_FONT }}>
                Top 10 SKUs — {Math.round(bundle.paretoShare * 100)}% of revenue lives here
              </div>
            </div>
            <div style={{ display: 'flex', gap: 14, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-muted)' }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: subco.colors.primary }} /> Revenue
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-muted)' }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: subco.colors.accent }} /> Cumulative %
              </span>
            </div>
          </div>
          <div style={{ height: 280, width: '100%' }}>
            <ResponsiveContainer>
              <BarChart data={paretoCumulative} margin={{ top: 8, right: 16, left: -8, bottom: 8 }}>
                <CartesianGrid stroke="var(--color-chart-grid)" vertical={false} />
                <XAxis
                  dataKey="rank"
                  tick={{ fill: 'var(--color-chart-text)', fontSize: 11 }}
                  axisLine={{ stroke: 'var(--color-chart-grid)' }}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: 'var(--color-chart-text)', fontSize: 11 }}
                  axisLine={{ stroke: 'var(--color-chart-grid)' }}
                  tickLine={false}
                  tickFormatter={(v) => `$${kShort(v)}`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: subco.colors.accent, fontSize: 11 }}
                  axisLine={{ stroke: 'var(--color-chart-grid)' }}
                  tickLine={false}
                  tickFormatter={(v) => `${Math.round(v * 100)}%`}
                  domain={[0, 1]}
                />
                <Tooltip
                  contentStyle={{
                    background: '#1E2236',
                    border: '1px solid rgba(255,255,255,0.10)',
                    borderRadius: 8, fontSize: 12, color: '#FFFFFF',
                  }}
                  labelFormatter={(l) => `Rank #${l}`}
                  formatter={(val, key) => {
                    if (key === 'revenue') return [money(Number(val)), 'Revenue'];
                    if (key === 'cumPct') return [`${Math.round(Number(val) * 100)}%`, 'Cumulative'];
                    return [val, key];
                  }}
                />
                <Bar yAxisId="left" dataKey="revenue" radius={[4, 4, 0, 0]}>
                  {paretoCumulative.map((_, i) => (
                    <Cell key={i} fill={subco.colors.primary} fillOpacity={i < 3 ? 1 : 0.75} />
                  ))}
                </Bar>
                <Bar yAxisId="right" dataKey="cumPct" radius={[4, 4, 0, 0]} fill={subco.colors.accent} fillOpacity={0.28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority actions — mirrored from mockup */}
        <div
          className="col-span-12 lg:col-span-4"
          style={{
            ...CARD,
            padding: '24px 22px',
            background: `linear-gradient(180deg, rgba(${subco.colors.primaryRgb}, 0.12) 0%, var(--color-surf) 65%)`,
            borderColor: `rgba(${subco.colors.primaryRgb}, 0.32)`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ color: subco.colors.accent }}><IconBolt /></span>
            <div style={{ fontSize: 17, fontWeight: 800, fontFamily: DISPLAY_FONT }}>Priority Actions</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <ActionRow
              label="Urgent"
              when="Next close"
              title={`Prune ${bleederCount} margin bleeders`}
              body="SKUs selling below cost. Cease restocks, move remaining units via clearance."
              accent="#FF6B6B"
            />
            <div style={{ height: 1, background: 'var(--color-border)' }} />
            <ActionRow
              label="Cash"
              when="30 days"
              title={`Liquidate ${deadCount} dead-stock SKUs`}
              body={`~${money(bundle.cashInDeadStock)} tied up in zero-movers. Auction to wholesale or write down.`}
              accent={subco.colors.accent}
            />
            <div style={{ height: 1, background: 'var(--color-border)' }} />
            <ActionRow
              label="Re-invest"
              when="Next quarter"
              title="Double down on top-decile"
              body={`Redirect freed cash to top ${Math.min(20, top10.length)} SKUs — ${Math.round(bundle.paretoShare * 100)}% of revenue today.`}
              accent="#2DB47A"
            />
          </div>
        </div>
      </div>

      {/* ── Segment filter + SKU table ── */}
      <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, borderBottom: '1px solid var(--color-border)' }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
              SKU Deep-dive
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, marginTop: 3, fontFamily: DISPLAY_FONT }}>
              {filtered.length} SKU{filtered.length === 1 ? '' : 's'} · {segment === 'all' ? 'all segments' : SEGMENT_META[segment].label.toLowerCase()} · click to inspect
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {(['all', 'core', 'healthy', 'tail', 'dead', 'bleeder'] as const).map((s) => {
              const meta = s === 'all' ? null : SEGMENT_META[s as Sku['segment']];
              const active = segment === s;
              return (
                <button
                  key={s}
                  onClick={() => setSegment(s)}
                  style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase',
                    padding: '6px 10px', borderRadius: 5, cursor: 'pointer',
                    background: active ? (meta ? meta.bg : `rgba(${subco.colors.primaryRgb}, 0.18)`) : 'transparent',
                    border: active
                      ? `1px solid ${meta ? meta.color : subco.colors.primary}`
                      : '1px solid var(--color-border)',
                    color: active ? (meta ? meta.color : subco.colors.primary) : 'var(--color-muted)',
                    fontFamily: 'inherit',
                    transition: 'background 0.12s, color 0.12s',
                  }}
                >
                  {s === 'all' ? `All · ${bundle.skus.length}` : meta?.label}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--color-muted)', fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase' }}>
                <th style={thStyle}>SKU</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Category</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Revenue 12M</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Units</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>GM %</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Days Cover</th>
                <th style={thStyle}>Segment</th>
                <th style={{ ...thStyle, width: 56, textAlign: 'right' }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => {
                const meta = SEGMENT_META[s.segment];
                const gmColor = s.grossMargin < 0 ? '#FF8A80' : s.grossMargin >= 0.45 ? '#2DB47A' : 'var(--color-text)';
                const isSelected = selected?.sku === s.sku;
                return (
                  <tr
                    key={s.sku}
                    onClick={() => setSelected(s)}
                    style={{
                      background: isSelected
                        ? `rgba(${subco.colors.primaryRgb}, 0.12)`
                        : i % 2 === 1 ? 'var(--color-surf2)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'var(--color-surf3)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) (e.currentTarget as HTMLElement).style.background = i % 2 === 1 ? 'var(--color-surf2)' : 'transparent';
                    }}
                  >
                    <td style={tdStyle}><code style={{ fontSize: 11, color: 'var(--color-muted)' }}>{s.sku}</code></td>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{s.name}</td>
                    <td style={{ ...tdStyle, color: 'var(--color-muted)' }}>{s.category}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontFamily: DISPLAY_FONT, fontWeight: 700 }}>{s.revenue12M === 0 ? '—' : money(s.revenue12M)}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', color: 'var(--color-muted)' }}>{s.units12M.toLocaleString()}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', color: gmColor, fontWeight: 600 }}>
                      {s.grossMargin === 0 ? '—' : `${(s.grossMargin * 100).toFixed(1)}%`}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right', color: s.daysOfCover > 365 ? '#FF8A80' : 'var(--color-muted)' }}>
                      {s.daysOfCover > 1500 ? '∞' : s.daysOfCover}
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        fontSize: 9, fontWeight: 800, letterSpacing: '0.10em',
                        padding: '3px 7px', borderRadius: 3,
                        color: meta.color, background: meta.bg,
                        border: `1px solid ${meta.color}40`,
                      }}>
                        {meta.label}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right', color: subco.colors.accent, fontWeight: 700, fontSize: 11, letterSpacing: '0.08em' }}>
                      Inspect →
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Drawer ── */}
      {selected && (
        <SkuDetailDrawer sku={selected} subcoName={subco.name} subcoId={subco.id} accent={subco.colors.accent} onClose={() => setSelected(null)} />
      )}

    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SKU Detail Drawer — diagnosis + AI recommendation
// ──────────────────────────────────────────────────────────────────────────

function SkuDetailDrawer({
  sku, subcoName, subcoId, accent, onClose,
}: { sku: Sku; subcoName: string; subcoId: string; accent: string; onClose: () => void }) {
  const analysis = analyze(sku, subcoName);
  const meta = SEGMENT_META[sku.segment];
  const trend = trend12m(sku);
  const router = useRouter();
  const { addDecision, decisions } = useDecisions();
  const decisionId = `sku-${sku.sku}`;
  const alreadyQueued = decisions.some((d) => d.id === decisionId);
  const [submitted, setSubmitted] = useState(alreadyQueued);

  const handleApprove = () => {
    const urgency: 'URGENT' | 'THIS WEEK' | 'THIS MONTH' =
      sku.segment === 'bleeder' || sku.segment === 'dead' ? 'URGENT'
      : sku.segment === 'tail' ? 'THIS WEEK'
      : 'THIS MONTH';
    const type: 'sku' | 'pricing' =
      analysis.recommendation.action.toLowerCase().includes('price') ||
      analysis.recommendation.action.toLowerCase().includes('raise') ? 'pricing' : 'sku';
    addDecision({
      id: decisionId,
      subcoId,
      type,
      urgency,
      confidence: analysis.recommendation.confidence,
      title: `${analysis.recommendation.action} — ${sku.sku}`,
      summary: `${sku.name} · ${analysis.diagnosis.headline}`,
      recommendedAction: analysis.recommendation.detail,
      owner: 'Ops · Dre Morris',
      impact: analysis.recommendation.impact,
    });
    setSubmitted(true);
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(2px)', zIndex: 100,
          animation: 'drawerFade 0.18s ease',
        }}
      />
      {/* Drawer */}
      <div
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: 'min(560px, 100vw)',
          background: 'var(--color-surf)',
          borderLeft: '1px solid var(--color-border)',
          boxShadow: '-12px 0 40px rgba(0,0,0,0.5)',
          zIndex: 101, overflowY: 'auto',
          animation: 'drawerSlide 0.22s cubic-bezier(0.2,0.7,0.3,1)',
        }}
      >
        <style>{`
          @keyframes drawerFade  { from { opacity: 0 } to { opacity: 1 } }
          @keyframes drawerSlide { from { transform: translateX(100%) } to { transform: translateX(0) } }
        `}</style>

        {/* Header */}
        <div style={{
          padding: '18px 22px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12,
          position: 'sticky', top: 0, background: 'var(--color-surf)', zIndex: 2,
        }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{
                fontSize: 9, fontWeight: 800, letterSpacing: '0.10em',
                padding: '3px 7px', borderRadius: 3,
                color: meta.color, background: meta.bg,
                border: `1px solid ${meta.color}40`,
              }}>
                {meta.label}
              </span>
              <code style={{ fontSize: 11, color: 'var(--color-muted)' }}>{sku.sku}</code>
            </div>
            <div style={{ fontSize: 17, fontWeight: 800, fontFamily: DISPLAY_FONT, lineHeight: 1.2 }}>
              {sku.name}
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 3 }}>
              {sku.category} · {subcoName}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent', border: '1px solid var(--color-border)',
              borderRadius: 5, color: 'var(--color-muted)',
              width: 30, height: 30, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 700,
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Metric strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            <MiniMetric label="Revenue (12M)" value={sku.revenue12M === 0 ? '—' : money(sku.revenue12M)} accent={accent} />
            <MiniMetric label="Units (12M)" value={sku.units12M.toLocaleString()} accent={accent} />
            <MiniMetric
              label="Gross Margin"
              value={sku.grossMargin === 0 ? '—' : `${(sku.grossMargin * 100).toFixed(1)}%`}
              accent={sku.grossMargin < 0 ? '#FF8A80' : sku.grossMargin >= 0.45 ? '#2DB47A' : accent}
            />
            <MiniMetric
              label="Days of Cover"
              value={sku.daysOfCover > 1500 ? '∞' : sku.daysOfCover.toString()}
              accent={sku.daysOfCover > 365 ? '#FF8A80' : accent}
            />
            <MiniMetric label="Inventory Units" value={sku.inventoryUnits.toLocaleString()} accent={accent} />
            <MiniMetric label="Last Sold" value={sku.lastSold} accent={accent} />
          </div>

          {/* Channels */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 6 }}>
              Sales Channels
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {sku.channels.map((ch) => (
                <span
                  key={ch}
                  style={{
                    fontSize: 11, fontWeight: 600,
                    padding: '4px 10px', borderRadius: 4,
                    background: 'var(--color-surf2)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                >
                  {ch}
                </span>
              ))}
            </div>
          </div>

          {/* Trend sparkline */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 6 }}>
              Revenue Trend · last 12 months
            </div>
            <div style={{ height: 200, background: 'var(--color-surf2)', border: '1px solid var(--color-border)', borderRadius: 8, padding: '8px 8px 0' }}>
              <ResponsiveContainer>
                <LineChart data={trend} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                  <XAxis dataKey="month" tick={{ fill: 'var(--color-chart-text)', fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis hide domain={[0, 'auto']} />
                  <Tooltip
                    contentStyle={{ background: '#1E2236', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 6, fontSize: 11, color: '#FFFFFF' }}
                    formatter={(v) => [money(Number(v)), 'Revenue']}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke={meta.color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, stroke: meta.color, fill: meta.color }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Diagnosis */}
          <div style={{
            background: `linear-gradient(180deg, ${meta.bg} 0%, transparent 100%)`,
            border: `1px solid ${meta.color}40`,
            borderRadius: 10, padding: '16px 18px',
          }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: meta.color, marginBottom: 6 }}>
              Diagnosis · Why this is flagged
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)', marginBottom: 10, lineHeight: 1.3, fontFamily: DISPLAY_FONT }}>
              {analysis.diagnosis.headline}
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
              {analysis.diagnosis.reasons.map((r, i) => (
                <li key={i} style={{ fontSize: 12, color: 'var(--color-muted)', paddingLeft: 14, position: 'relative', lineHeight: 1.5 }}>
                  <span style={{ position: 'absolute', left: 0, color: meta.color }}>•</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* AI recommendation */}
          <div style={{
            background: 'linear-gradient(180deg, rgba(245,138,31,0.10) 0%, rgba(27,77,230,0.04) 100%)',
            border: '1px solid rgba(245,138,31,0.30)',
            borderRadius: 10, padding: '18px 20px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  width: 22, height: 22, borderRadius: 5,
                  background: 'linear-gradient(135deg,#1B4DE6,#F58A1F)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#FFFFFF">
                    <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
                  </svg>
                </span>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text)' }}>
                  AI Recommendation
                </div>
              </div>
              <span style={{
                fontSize: 9, fontWeight: 800, letterSpacing: '0.08em',
                padding: '2px 8px', borderRadius: 3,
                color: analysis.recommendation.confidence === 'HIGH' ? '#2DB47A' : analysis.recommendation.confidence === 'MEDIUM' ? '#F7A500' : 'var(--color-muted)',
                background: analysis.recommendation.confidence === 'HIGH' ? 'rgba(45,180,122,0.14)' : 'rgba(247,165,0,0.14)',
              }}>
                {analysis.recommendation.confidence} CONFIDENCE
              </span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-text)', lineHeight: 1.3, marginBottom: 6, fontFamily: DISPLAY_FONT }}>
              {analysis.recommendation.action}
            </div>
            <div style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.5, marginBottom: 14 }}>
              {analysis.recommendation.detail}
            </div>

            <div style={{
              background: 'rgba(45,180,122,0.08)',
              border: '1px solid rgba(45,180,122,0.25)',
              borderRadius: 6, padding: '10px 12px', marginBottom: 14,
              fontSize: 12, color: '#2DB47A', fontWeight: 700, letterSpacing: '0.02em',
            }}>
              💰 {analysis.recommendation.impact}
            </div>

            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 8 }}>
              Action plan
            </div>
            <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9 }}>
              {analysis.recommendation.steps.map((step, i) => (
                <li key={i} style={{
                  fontSize: 12, color: 'var(--color-text)', lineHeight: 1.5,
                  paddingLeft: 28, position: 'relative',
                }}>
                  <span style={{
                    position: 'absolute', left: 0, top: 0,
                    width: 20, height: 20, borderRadius: '50%',
                    background: 'rgba(245,138,31,0.15)',
                    color: '#F58A1F',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 900,
                  }}>
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>

            {submitted ? (
              <div style={{
                marginTop: 16,
                background: 'rgba(45,180,122,0.10)',
                border: '1px solid rgba(45,180,122,0.35)',
                borderRadius: 8, padding: '12px 14px',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <svg width="18" height="18" fill="none" stroke="#2DB47A" strokeWidth="2.4" viewBox="0 0 24 24">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#2DB47A', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Routed to Decision Inbox
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 2 }}>
                    Awaiting CEO approval in /inbox
                  </div>
                </div>
                <button
                  onClick={() => { onClose(); router.push('/inbox'); }}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(45,180,122,0.45)', color: '#2DB47A',
                    padding: '6px 10px', borderRadius: 6, cursor: 'pointer',
                    fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
                  }}
                >
                  View inbox
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button
                  onClick={handleApprove}
                  style={{
                    background: 'linear-gradient(135deg,#1B4DE6,#F58A1F)',
                    border: 'none', color: '#FFFFFF',
                    padding: '9px 14px', borderRadius: 7, cursor: 'pointer',
                    fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
                    boxShadow: '0 2px 10px rgba(27,77,230,0.30)',
                    flex: 1,
                  }}
                >
                  Route to Decision Inbox
                </button>
                <button
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--color-border)', color: 'var(--color-muted)',
                    padding: '9px 14px', borderRadius: 7, cursor: 'pointer',
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                  }}
                  onClick={onClose}
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>

          {/* Alternative paths */}
          {analysis.alternatives && analysis.alternatives.length > 0 && (
            <div style={{
              ...CARD,
              padding: '18px 20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text)' }}>
                  Alternative paths
                </div>
                <div style={{ fontSize: 10, color: 'var(--color-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {analysis.alternatives.length} options · compare trade-offs
                </div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-muted)', marginBottom: 14, lineHeight: 1.5 }}>
                Other routes the AI considered for this SKU. Pick one to preview the change in Decision Inbox.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {analysis.alternatives.map((alt) => {
                  const toneColor =
                    alt.tone === 'primary' ? accent :
                    alt.tone === 'warn' ? '#F7A500' :
                    'var(--color-muted)';
                  const toneBg =
                    alt.tone === 'primary' ? `${accent}14` :
                    alt.tone === 'warn' ? 'rgba(247,165,0,0.10)' :
                    'var(--color-surf2)';
                  const toneBorder =
                    alt.tone === 'primary' ? `${accent}55` :
                    alt.tone === 'warn' ? 'rgba(247,165,0,0.30)' :
                    'var(--color-border)';
                  return (
                    <AltActionCard
                      key={alt.id}
                      alt={alt}
                      toneColor={toneColor}
                      toneBg={toneBg}
                      toneBorder={toneBorder}
                      accent={accent}
                      onSelect={() => {
                        const altUrgency: 'URGENT' | 'THIS WEEK' | 'THIS MONTH' =
                          sku.segment === 'bleeder' || sku.segment === 'dead' ? 'URGENT'
                          : sku.segment === 'tail' ? 'THIS WEEK'
                          : 'THIS MONTH';
                        const altType: 'sku' | 'pricing' =
                          alt.label.toLowerCase().includes('price') ||
                          alt.label.toLowerCase().includes('lift') ? 'pricing' : 'sku';
                        addDecision({
                          id: `sku-${sku.sku}-${alt.id}`,
                          subcoId,
                          type: altType,
                          urgency: altUrgency,
                          confidence: alt.tone === 'primary' ? 'HIGH' : 'MEDIUM',
                          title: `${alt.label} — ${sku.sku}`,
                          summary: `${sku.name} · ${alt.headline}`,
                          recommendedAction: alt.detail,
                          owner: 'Ops · Dre Morris',
                          impact: alt.impact,
                        });
                        setSubmitted(true);
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function AltActionCard({
  alt, toneColor, toneBg, toneBorder, accent, onSelect,
}: {
  alt: AltAction;
  toneColor: string;
  toneBg: string;
  toneBorder: string;
  accent: string;
  onSelect: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: toneBg,
      border: `1px solid ${toneBorder}`,
      borderRadius: 9,
      overflow: 'hidden',
      transition: 'border-color 0.15s',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', textAlign: 'left',
          background: 'transparent', border: 'none', cursor: 'pointer',
          padding: '12px 14px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}
      >
        <div style={{
          width: 6, height: 40, borderRadius: 3, background: toneColor, flexShrink: 0,
        }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: toneColor, marginBottom: 3 }}>
            {alt.tone === 'primary' ? 'Recommended' : alt.tone === 'warn' ? 'Risk path' : 'Alternative'} · {alt.label}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.3, fontFamily: DISPLAY_FONT }}>
            {alt.headline}
          </div>
        </div>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="var(--color-muted)" strokeWidth="2.4"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', flexShrink: 0 }}
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div style={{ padding: '0 14px 14px 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 12, color: 'var(--color-muted)', lineHeight: 1.5 }}>
            {alt.detail}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{
              background: 'rgba(45,180,122,0.08)',
              border: '1px solid rgba(45,180,122,0.25)',
              borderRadius: 6, padding: '8px 10px',
            }}>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#2DB47A', marginBottom: 3 }}>
                Upside
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-text)', lineHeight: 1.4 }}>
                {alt.impact}
              </div>
            </div>
            <div style={{
              background: 'rgba(247,165,0,0.08)',
              border: '1px solid rgba(247,165,0,0.25)',
              borderRadius: 6, padding: '8px 10px',
            }}>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#F7A500', marginBottom: 3 }}>
                Risk
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-text)', lineHeight: 1.4 }}>
                {alt.risk}
              </div>
            </div>
          </div>
          <button
            onClick={onSelect}
            style={{
              alignSelf: 'flex-start',
              background: 'transparent',
              border: `1px solid ${toneColor === 'var(--color-muted)' ? 'var(--color-border)' : toneColor}`,
              color: toneColor === 'var(--color-muted)' ? 'var(--color-text)' : toneColor,
              padding: '7px 12px', borderRadius: 6, cursor: 'pointer',
              fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
            }}
          >
            Route this option →
          </button>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────────────────────────────────

function MiniMetric({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div style={{
      background: 'var(--color-surf2)',
      border: '1px solid var(--color-border)',
      borderRadius: 8, padding: '10px 12px',
    }}>
      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
        {label}
      </div>
      <div style={{ fontSize: 15, fontWeight: 800, color: accent, marginTop: 3, fontFamily: DISPLAY_FONT, letterSpacing: '-0.01em' }}>
        {value}
      </div>
    </div>
  );
}

function KpiCard({
  label, value, sub, progressPct, accent, icon,
}: {
  label: string;
  value: string;
  sub: string;
  progressPct: number;
  accent: string;
  icon: React.ReactNode;
}) {
  return (
    <div style={{ ...CARD, padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          width: 32, height: 32, borderRadius: 6,
          background: `${accent}22`, color: accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {icon}
        </span>
      </div>
      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: 'var(--color-muted)',
      }}>
        {label}
      </div>
      <div style={{
        fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em',
        color: 'var(--color-text)', lineHeight: 1, fontFamily: DISPLAY_FONT,
      }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: 'var(--color-muted)', fontWeight: 500 }}>
        {sub}
      </div>
      <div style={{ marginTop: 4, height: 3, borderRadius: 2, background: 'var(--color-border)', overflow: 'hidden' }}>
        <div style={{ width: `${Math.min(100, Math.max(2, progressPct))}%`, height: '100%', background: accent }} />
      </div>
    </div>
  );
}

function ActionRow({
  label, when, title, body, accent,
}: { label: string; when: string; title: string; body: string; accent: string }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{
          fontSize: 10, fontWeight: 800, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: accent,
        }}>
          {label}
        </span>
        <span style={{ fontSize: 10, color: 'var(--color-muted)', fontWeight: 600 }}>
          {when}
        </span>
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.3, marginBottom: 4, fontFamily: DISPLAY_FONT }}>
        {title}
      </div>
      <div style={{ fontSize: 12, color: 'var(--color-muted)', lineHeight: 1.5 }}>
        {body}
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
  borderBottom: '1px solid var(--color-border)',
  whiteSpace: 'nowrap',
};

// ── Inline icons (sized to fit 16x16 bounds) ──
function IconGrid() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>); }
function IconPareto() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18" strokeLinecap="round"/><path d="M7 14l4-4 3 3 5-7" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function IconBox() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 7.5V17a2 2 0 0 1-1 1.73l-7 4a2 2 0 0 1-2 0l-7-4A2 2 0 0 1 3 17V7.5"/><path d="M3.27 6.96L12 12l8.73-5.04M12 22V12"/></svg>); }
function IconAlert() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>); }
function IconBolt() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>); }
