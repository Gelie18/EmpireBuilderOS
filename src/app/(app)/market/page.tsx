'use client';

import { useMemo } from 'react';
import { useSubco } from '@/contexts/SubcoContext';

// ── Design tokens ────────────────────────────────────────────────────────────
const CARD: React.CSSProperties = {
  background: 'var(--color-surf)',
  borderRadius: 'var(--card-radius)',
  boxShadow: 'var(--card-shadow)',
  border: '1px solid var(--color-border)',
};

// ── Per-subco market intelligence data ───────────────────────────────────────
interface SubcoMarketIntel {
  category: string;           // "Baseball Equipment — Gloves & Apparel"
  marketSize: string;         // "$1.4B US market"
  marketGrowth: string;       // "+4.2% CAGR"
  position: string;           // e.g. "#3 by Amazon Best Sellers in gloves"
  kpis: {
    label: string; value: string; comparison: string;
    badge: string; tone: 'good' | 'warn' | 'bad' | 'neutral';
  }[];
  benchmarks: {
    metric: string; self: string; industryMedian: string; topQuartile: string;
    tone: 'good' | 'warn' | 'bad';
    status: string;
  }[];
  competitors: { name: string; note: string; price: string; rank: string; threat: 'high' | 'med' | 'low' }[];
  macro: { name: string; value: string; change: string; tone: 'good' | 'warn' | 'bad' | 'neutral'; note: string }[];
  insights: string[];
}

const TONE_COLOR: Record<'good' | 'warn' | 'bad' | 'neutral', { fg: string; bg: string; border: string }> = {
  good:    { fg: '#2DB47A', bg: 'rgba(45,180,122,0.12)',  border: 'rgba(45,180,122,0.30)' },
  warn:    { fg: '#F7A500', bg: 'rgba(247,165,0,0.12)',   border: 'rgba(247,165,0,0.30)'  },
  bad:     { fg: '#E06060', bg: 'rgba(224,96,96,0.12)',   border: 'rgba(224,96,96,0.30)'  },
  neutral: { fg: '#8E9BB8', bg: 'rgba(142,155,184,0.10)', border: 'rgba(142,155,184,0.25)' },
};

const INTEL_BY_SUBCO: Record<string, SubcoMarketIntel> = {
  'bases-loaded': {
    category: 'Baseball & Softball Equipment · Consolidated',
    marketSize: '$2.8B US baseball/softball',
    marketGrowth: '+3.1% CAGR',
    position: 'Portfolio operator · 5 brands · #2 in US for Japanese import gloves (SSK)',
    kpis: [
      { label: 'Revenue Growth (portfolio)', value: '+6.4%', comparison: 'Category +3.1%',  badge: 'Above Category', tone: 'good' },
      { label: 'Blended Gross Margin',       value: '42.8%', comparison: 'Median 39.4%',    badge: '+3.4pt vs peers', tone: 'good' },
      { label: 'Amazon Share',               value: '38%',   comparison: 'Median 31%',      badge: 'Marketplace-heavy', tone: 'warn' },
      { label: 'Wholesale Share',            value: '5%',    comparison: 'Median 28%',      badge: 'Under-indexed', tone: 'warn' },
    ],
    benchmarks: [
      { metric: 'Revenue Growth (YoY)',   self: '+6.4%',  industryMedian: '+3.1%',  topQuartile: '+8.0%',  tone: 'good', status: 'Above Median' },
      { metric: 'Gross Margin',           self: '42.8%',  industryMedian: '39.4%',  topQuartile: '45.0%',  tone: 'good', status: 'Above Median' },
      { metric: 'Amazon Dependency',      self: '38%',    industryMedian: '31%',    topQuartile: '22%',    tone: 'warn', status: 'Concentration Risk' },
      { metric: 'DTC (Shopify+BigComm)',  self: '45%',    industryMedian: '40%',    topQuartile: '52%',    tone: 'good', status: 'Above Median' },
      { metric: 'Inventory Turns',        self: '3.2×',   industryMedian: '4.1×',   topQuartile: '5.0×',   tone: 'bad',  status: 'Below Median' },
      { metric: 'AR Days',                self: '38d',    industryMedian: '32d',    topQuartile: '25d',    tone: 'warn', status: 'DSO drift' },
    ],
    competitors: [
      { name: 'Mizuno USA',        note: 'Japanese import peer; strongest in gloves',           price: '$220–420', rank: '#1 Japanese glove', threat: 'high' },
      { name: 'Rawlings',          note: 'Incumbent US leader; wholesale-heavy',                price: '$160–600', rank: '#1 US overall',      threat: 'high' },
      { name: 'Wilson',            note: 'Pro-audience; strong in elite mitts',                 price: '$180–500', rank: '#2 US',              threat: 'med'  },
      { name: 'Franklin Sports',   note: 'Entry-tier; batting gloves & youth gear',             price: '$20–80',   rank: '#1 entry',           threat: 'low'  },
      { name: 'Marucci',           note: 'Premium bats & custom; high-end DTC',                 price: '$280–500', rank: '#2 bats',            threat: 'med'  },
    ],
    macro: [
      { name: 'Youth Sports Participation', value: '+2.8%', change: 'YoY',            tone: 'good', note: 'Baseball/softball up nationally. Supports BL portfolio demand.' },
      { name: 'Import Tariffs (Japan)',     value: 'Stable', change: 'No change',      tone: 'good', note: 'Japan SSK import pipeline unaffected. Continue forward-buy strategy.' },
      { name: 'Amazon Take-Rate Step',      value: '+0.8pt', change: 'Apr 2026',      tone: 'bad',  note: 'Hit SSK Z7 core line Monday. Industry-wide — price action needed.' },
    ],
    insights: [
      'The portfolio is outperforming on margin (+3.4pt vs peers) and revenue growth (+6.4% vs +3.1% category). DTC blend is healthy at 45%.',
      'Amazon at 38% of revenue is a concentration risk — industry top-quartile is 22%. Grow wholesale and direct retail to rebalance.',
      'Inventory turns (3.2×) trail the median (4.1×) — aging SKUs across BGL laces and DDW gift stock are dragging capital efficiency. Prune + clearance backlog is ready.',
    ],
  },

  ssk: {
    category: 'Baseball Gloves · Premium Japanese Import',
    marketSize: '$340M US premium-glove segment',
    marketGrowth: '+5.0% CAGR',
    position: '#1 in US Japanese-import gloves · Exclusive distributor for SSK Japan',
    kpis: [
      { label: 'Revenue Growth',          value: '+2.8%',  comparison: 'Premium glove cat +5.0%', badge: 'Below cat',         tone: 'warn' },
      { label: 'Gross Margin',            value: '46.0%',  comparison: 'Median 42%',              badge: '+4pt above',        tone: 'good' },
      { label: 'Amazon Share',            value: '52%',    comparison: 'Median 38%',              badge: 'Over-indexed',      tone: 'warn' },
      { label: 'Sell-Through (Z-line)',   value: '11 days',comparison: 'Plan 14 days',            badge: 'Ahead of plan',     tone: 'good' },
    ],
    benchmarks: [
      { metric: 'Revenue Growth (YoY)',  self: '+2.8%',  industryMedian: '+5.0%', topQuartile: '+9.0%', tone: 'warn', status: 'Below Median' },
      { metric: 'Gross Margin',          self: '46.0%',  industryMedian: '42.0%', topQuartile: '48.0%', tone: 'good', status: 'Above Median' },
      { metric: 'Avg Retail Price',      self: '$280',   industryMedian: '$240',  topQuartile: '$320',  tone: 'good', status: 'Premium tier' },
      { metric: 'Amazon Buy Box Win %',  self: '74%',    industryMedian: '68%',   topQuartile: '82%',   tone: 'good', status: 'Above Median' },
      { metric: 'Wholesale Share',       self: '6%',     industryMedian: '32%',   topQuartile: '45%',   tone: 'bad',  status: 'Severely under' },
    ],
    competitors: [
      { name: 'Mizuno USA',         note: 'Direct competitor — other dominant Japanese import',  price: '$220–420', rank: '#2 Japanese',   threat: 'high' },
      { name: 'Wilson A2000/A2K',   note: 'US premium benchmark; pro-level loyalty',             price: '$280–500', rank: '#1 premium',    threat: 'high' },
      { name: 'Rawlings Heart Hide',note: 'US heritage; strongest in wholesale channel',         price: '$260–450', rank: '#1 US',         threat: 'med'  },
      { name: 'Nokona',             note: 'Made-in-USA craft; small but loyal',                  price: '$350–700', rank: 'Niche premium', threat: 'low'  },
    ],
    macro: [
      { name: 'JPY/USD FX',            value: '152.4', change: 'Stable',    tone: 'good', note: 'Favorable for import cost; maintains current margin on Japan-sourced gloves.' },
      { name: 'Amazon Take-Rate',      value: '+0.8pt', change: 'Apr 2026',  tone: 'bad',  note: 'Hit Z7 line Monday — 2.4pt GM impact. Price action window: 7 days.' },
      { name: 'Youth Travel Ball',     value: '+3.6%',  change: 'YoY',       tone: 'good', note: 'Premium glove buyer persona expanding — reinforce Z-line positioning.' },
    ],
    insights: [
      'SSK is premium-priced and premium-margined — ARP $280 vs market $240. Elasticity on Z-line is low; 2–3% retail lift absorbs the Amazon take-rate step.',
      'Wholesale share of 6% is the biggest strategic gap vs peers at 32–45%. Dick\'s and travel-ball team channels are open-air opportunities.',
      'Japan FX stability plus strong youth travel-ball growth = forward-buy is the right call on Z9 Maestro.',
    ],
  },

  bgl: {
    category: 'Baseball Glove Laces & Relacing Service',
    marketSize: '$28M US lace & relacing niche',
    marketGrowth: '+7.2% CAGR',
    position: '#1 online for baseball-glove laces · Relacing service flywheel',
    kpis: [
      { label: 'Revenue Growth',         value: '+6.1%',  comparison: 'Cat +7.2%',          badge: 'In-line',         tone: 'neutral' },
      { label: 'Gross Margin',           value: '54.0%',  comparison: 'Median 44%',         badge: '+10pt above',     tone: 'good' },
      { label: 'Relacing Attach Rate',   value: '32%',    comparison: 'No peer benchmark',  badge: 'Category leader', tone: 'good' },
      { label: 'Colorway SKUs',          value: '33',     comparison: 'Median 12',          badge: 'Bloated',         tone: 'bad'  },
    ],
    benchmarks: [
      { metric: 'Revenue Growth (YoY)',  self: '+6.1%',   industryMedian: '+7.2%',  topQuartile: '+12.0%', tone: 'warn', status: 'Slightly below' },
      { metric: 'Gross Margin',          self: '54.0%',   industryMedian: '44.0%',  topQuartile: '56.0%',  tone: 'good', status: 'Near Top Quart' },
      { metric: 'Shopify DTC %',         self: '68%',     industryMedian: '35%',    topQuartile: '55%',    tone: 'good', status: 'Far Above' },
      { metric: 'SKU Count (colorways)', self: '33',      industryMedian: '12',     topQuartile: '8',      tone: 'bad',  status: 'Over-assorted' },
      { metric: 'Inventory Turns',       self: '2.1×',    industryMedian: '4.6×',   topQuartile: '6.0×',   tone: 'bad',  status: 'Far Below' },
    ],
    competitors: [
      { name: 'Generic Amazon laces',  note: 'Commodity $3–6 laces; no brand or service',        price: '$3–6',    rank: 'Long tail',      threat: 'med'  },
      { name: 'Glove Stop',            note: 'Relacing service only; no lace retail',            price: '$35–60 svc', rank: 'Service peer', threat: 'med'  },
      { name: 'Rawlings replacement',  note: 'Bundled with glove purchase; low awareness solo',  price: '$8–15',   rank: 'OEM bundle',     threat: 'low'  },
    ],
    macro: [
      { name: 'Glove Relacing Trend',  value: '+18%',  change: 'YoY searches', tone: 'good', note: 'TikTok/IG relacing content driving category-wide demand.' },
      { name: 'Leather Prices',        value: '+2.1%', change: 'YoY',          tone: 'warn', note: 'Modest COGS headwind for raw lace material; absorb via ASP.' },
      { name: 'Shopify DTC Costs',     value: 'Stable', change: 'Flat',        tone: 'good', note: 'Favorable unit economics on service attach.' },
    ],
    insights: [
      'BGL has category-leading margin (+10pt above peers) and DTC share (68% vs 35%). The flywheel — lace purchase → relacing service → brand loyalty — is working.',
      '33 colorways is 2.75× the market median. 19 colors sell <3 units/month, tying up $72K of working capital. The prune-19 decision is on the CEO desk now.',
      'Relacing-content trend on social is a free tailwind — double down on TikTok content + service attach at checkout.',
    ],
  },

  ddw: {
    category: 'Gift/Novelty Bags · Specialty Retail',
    marketSize: '$640M US novelty gift bag segment',
    marketGrowth: '+1.2% CAGR (flat)',
    position: 'Top-10 US novelty-bag wholesaler · Gift-shop distribution',
    kpis: [
      { label: 'Revenue Growth',         value: '-14.2%', comparison: 'Cat +1.2%',      badge: 'Underperforming', tone: 'bad' },
      { label: 'Gross Margin',           value: '38.8%',  comparison: 'Median 40%',     badge: '-1.2pt',          tone: 'warn' },
      { label: 'Wholesale Share',        value: '78%',    comparison: 'Median 62%',     badge: 'Over-indexed',    tone: 'warn' },
      { label: 'AR Days',                value: '52d',    comparison: 'Median 38d',     badge: 'Collections slip',tone: 'bad' },
    ],
    benchmarks: [
      { metric: 'Revenue Growth (YoY)',  self: '-14.2%',  industryMedian: '+1.2%',  topQuartile: '+6.0%',  tone: 'bad',  status: 'Well Below' },
      { metric: 'Gross Margin',          self: '38.8%',   industryMedian: '40.0%',  topQuartile: '44.0%',  tone: 'warn', status: 'Slightly Below' },
      { metric: 'Wholesale Dependency',  self: '78%',     industryMedian: '62%',    topQuartile: '45%',    tone: 'warn', status: 'Concentration' },
      { metric: 'AR Days',               self: '52d',     industryMedian: '38d',    topQuartile: '28d',    tone: 'bad',  status: 'Slow Collect' },
      { metric: 'DTC Share',             self: '8%',      industryMedian: '22%',    topQuartile: '38%',    tone: 'bad',  status: 'Under-developed' },
    ],
    competitors: [
      { name: 'GiftTree',           note: 'National gift-shop distribution; broad SKU base',   price: '$8–35',   rank: '#1 in gift stores', threat: 'high' },
      { name: 'Primitives by Kathy',note: 'Same retail doors; similar price band',             price: '$10–40',  rank: '#2 shared',         threat: 'high' },
      { name: 'About Face Designs', note: 'DTC + retail hybrid; stronger Shopify',             price: '$12–45',  rank: '#3 — DTC focus',    threat: 'med'  },
    ],
    macro: [
      { name: 'Gift-Shop Foot Traffic',   value: '-3.8%', change: 'YoY',        tone: 'bad',  note: 'Independent retail is under pressure industry-wide; accelerating DTC shift required.' },
      { name: 'Q4 Seasonality',           value: '68%',   change: 'of annual',  tone: 'warn', note: 'Heavily Q4-weighted — need capital bridge for 5-month gap.' },
      { name: 'B2B Credit Tightening',    value: 'Worse', change: 'QoQ',        tone: 'bad',  note: 'Gift-shop customers slower to pay. 3 accounts >60 days.' },
    ],
    insights: [
      'DDW is the portfolio problem child — revenue down 14% in a flat category, AR days at 52d (median 38d), 78% wholesale dependency.',
      'Gift-shop retail is structurally declining; DDW needs a DTC pivot (Shopify + Amazon) — industry top-quartile is 38% DTC, DDW is 8%.',
      'Q4 seasonality (68% of annual revenue) means runway is now — CEO needs a 5-month capital plan or accelerated DTC migration to survive to Q4.',
    ],
  },

  aas: {
    category: 'Made-in-USA Baseball Cleats · Youth & Elite',
    marketSize: '$380M US cleat market',
    marketGrowth: '+2.8% CAGR',
    position: 'Niche made-in-USA player · Elite-line cult following',
    kpis: [
      { label: 'Revenue Growth',      value: '-8.5%',  comparison: 'Cat +2.8%',     badge: 'Stockout drag',  tone: 'bad'  },
      { label: 'Gross Margin',        value: '41.6%',  comparison: 'Plan 44.7%',    badge: '-3.1pt',         tone: 'bad'  },
      { label: 'Elite Line Stock',    value: 'Out',    comparison: '$38K/mo miss',  badge: 'Vendor limit',   tone: 'bad'  },
      { label: 'Return Rate',         value: '2.1%',   comparison: 'Median 6.8%',   badge: 'Quality edge',   tone: 'good' },
    ],
    benchmarks: [
      { metric: 'Revenue Growth (YoY)',  self: '-8.5%',   industryMedian: '+2.8%', topQuartile: '+8.0%',  tone: 'bad',  status: 'Stockout drag' },
      { metric: 'Gross Margin',          self: '41.6%',   industryMedian: '38.0%', topQuartile: '43.0%',  tone: 'good', status: 'Above Median' },
      { metric: 'Made-in-USA Premium',   self: '+28%',    industryMedian: '+12%',  topQuartile: '+38%',   tone: 'good', status: 'Premium Pricing' },
      { metric: 'Return Rate',           self: '2.1%',    industryMedian: '6.8%',  topQuartile: '4.0%',   tone: 'good', status: 'Top Quartile' },
    ],
    competitors: [
      { name: 'New Balance (US-made)', note: 'Only major rival with US manufacturing',       price: '$120–180', rank: '#1 US-made',     threat: 'high' },
      { name: 'Nike baseball cleats',  note: 'Dominant but Asia-sourced; different buyer',    price: '$65–160',  rank: '#1 overall',     threat: 'low'  },
      { name: 'Under Armour cleats',   note: 'Value tier; Asia-sourced',                      price: '$60–130',  rank: '#2 overall',     threat: 'low'  },
    ],
    macro: [
      { name: 'USA Manufacturing Cost',   value: '+4.2%', change: 'YoY',     tone: 'bad',  note: 'Wage inflation + materials pressure; compressing made-in-USA margin.' },
      { name: 'Tariff on Asian Cleats',   value: 'Stable', change: 'No chg', tone: 'neutral', note: 'No tailwind from tariff policy shifts in this window.' },
      { name: 'Youth Tournament Demand',  value: '+5.1%', change: 'YoY',     tone: 'good', note: 'Travel-ball families value USA-made — maintain positioning.' },
    ],
    insights: [
      'AAS has a defensible niche — USA-made premium, 2.1% return rate (vs 6.8% median), +28% price premium — but stockout on Elite is destroying the year.',
      'Need to qualify alternate USA vendor urgently. $38K/mo missed revenue compounding. The $15K sample-budget decision is on the CEO desk.',
      'Cost inflation is structural; 4–6% retail lift may be required to hold 44% GM plan once Elite is back in stock.',
    ],
  },

  shug0: {
    category: 'MLB Licensed Baseball Accessories (Stroman)',
    marketSize: '$180M MLB-licensed accessories',
    marketGrowth: '+4.5% CAGR',
    position: 'Licensed-athlete brand · Limited-edition drop model',
    kpis: [
      { label: 'Revenue Growth',       value: '+1.8%',  comparison: 'Cat +4.5%',      badge: 'Limited SKU',      tone: 'neutral' },
      { label: 'Gross Margin',         value: '49.2%',  comparison: 'Median 42%',     badge: '+7pt above',       tone: 'good' },
      { label: 'Gold Bat Sellthrough', value: '11 days',comparison: 'Plan 30 days',   badge: 'Drop success',     tone: 'good' },
      { label: 'Repeat Buyer %',       value: '48%',    comparison: 'Median 22%',     badge: 'Collector base',   tone: 'good' },
    ],
    benchmarks: [
      { metric: 'Revenue Growth (YoY)', self: '+1.8%',  industryMedian: '+4.5%', topQuartile: '+12.0%', tone: 'warn', status: 'Limited drops' },
      { metric: 'Gross Margin',         self: '49.2%',  industryMedian: '42.0%', topQuartile: '48.0%',  tone: 'good', status: 'Top Quartile' },
      { metric: 'DTC Share',            self: '84%',    industryMedian: '45%',   topQuartile: '68%',    tone: 'good', status: 'Above Top Quart' },
      { metric: 'Repeat Buyer Rate',    self: '48%',    industryMedian: '22%',   topQuartile: '38%',    tone: 'good', status: 'Collector LTV' },
    ],
    competitors: [
      { name: 'Fanatics (MLB)',        note: 'Mass-market licensed ops; different buyer',           price: '$20–100',  rank: '#1 overall',      threat: 'low'  },
      { name: 'Louisville Slugger',    note: 'Heritage bat brand; overlap on collectibles',         price: '$35–250',  rank: '#1 bats',         threat: 'med'  },
      { name: 'Other MLB player lines',note: 'Individual-athlete licensed brands',                  price: '$25–150',  rank: 'Fragmented',      threat: 'low'  },
    ],
    macro: [
      { name: 'MLB Viewership',          value: '+3.2%', change: 'YoY',      tone: 'good', note: 'Baseball fandom growing — benefits licensed-player drops.' },
      { name: 'Stroman Performance',     value: 'Active',change: '2026 rot.', tone: 'good', note: 'Player-athlete brand intact; drops continue driving scarcity value.' },
      { name: 'Sneaker/Drop Culture',    value: '+6.8%', change: 'YoY',      tone: 'good', note: 'Limited-edition resale culture extending to MLB memorabilia.' },
    ],
    insights: [
      'Shug0 is small but remarkably well-positioned: 49.2% GM (top quartile), 84% DTC, 48% repeat rate. The drop model is working.',
      'Gold Bat sold through in 11 days vs 30-day plan — strong signal that demand exceeds supply. Hold the no-reorder line to preserve scarcity.',
      'Redeploy cash from the Gold Bat clear-through into the next metal-cleat drop rather than reorder.',
    ],
  },
};

function getIntel(subcoId: string): SubcoMarketIntel {
  return INTEL_BY_SUBCO[subcoId] ?? INTEL_BY_SUBCO['bases-loaded'];
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function MarketPage() {
  const { subco, isTopco } = useSubco();
  const intel = useMemo(() => getIntel(subco.id), [subco.id]);

  return (
    <div className="flex flex-col gap-5">

      {/* ── 1. Header card ──────────────────────────────────────────────────── */}
      <div style={{ ...CARD, padding: '20px 24px' }}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 6,
            }}>
              Market Intelligence · {isTopco ? 'Portfolio View' : subco.shortName}
            </div>
            <div style={{
              fontFamily: 'var(--font-condensed, var(--font-display))', fontSize: 26, fontWeight: 900,
              letterSpacing: '-0.01em', color: 'var(--color-text)', lineHeight: 1.1,
            }}>
              {intel.category}
            </div>
            <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 6 }}>
              {intel.position}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <span style={{
              background: 'rgba(45,180,122,0.12)', border: '1px solid rgba(45,180,122,0.30)',
              color: '#2DB47A', borderRadius: 6, padding: '5px 11px',
              fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              Market · {intel.marketSize}
            </span>
            <span style={{
              background: 'rgba(79,168,255,0.12)', border: '1px solid rgba(79,168,255,0.30)',
              color: '#4FA8FF', borderRadius: 6, padding: '5px 11px',
              fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              Growth · {intel.marketGrowth}
            </span>
            <span style={{
              background: 'rgba(27,77,230,0.14)', border: '1px solid rgba(27,77,230,0.35)',
              color: '#E8B84B', borderRadius: 6, padding: '5px 11px',
              fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              Apr 2026
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. Competitive position KPI cards ───────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {intel.kpis.map((kpi) => {
          const c = TONE_COLOR[kpi.tone];
          return (
            <div key={kpi.label} style={{ ...CARD, padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: c.fg, borderRadius: 'var(--card-radius) var(--card-radius) 0 0' }} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 6 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 8 }}>
                  {kpi.label}
                </div>
                <div style={{ fontSize: 30, fontWeight: 900, color: c.fg, lineHeight: 1, letterSpacing: '-0.01em' }}>
                  {kpi.value}
                </div>
                <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 6 }}>
                  {kpi.comparison}
                </div>
                <div style={{
                  display: 'inline-block', marginTop: 10,
                  background: c.bg, color: c.fg, border: `1px solid ${c.border}`,
                  borderRadius: 6, padding: '3px 10px',
                  fontSize: 10, fontWeight: 800, letterSpacing: '0.07em', textTransform: 'uppercase',
                }}>
                  {kpi.badge}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 3. Benchmark comparison table ───────────────────────────────────── */}
      <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
        <div style={{
          padding: '14px 20px', borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-surf2)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-text)' }}>
            Benchmark vs Industry — {subco.shortName}
          </span>
          <span style={{ fontSize: 11, color: 'var(--color-muted)', fontWeight: 600 }}>
            {intel.category.split('·')[0].trim()}
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 620 }}>
            <thead>
              <tr style={{ background: 'var(--color-surf2)' }}>
                {['Metric', subco.shortName, 'Industry Median', 'Top Quartile', 'Status'].map((h, i) => (
                  <th key={h} style={{
                    padding: '11px 20px',
                    textAlign: i === 0 ? 'left' : 'right',
                    fontSize: 10, fontWeight: 800, letterSpacing: '0.09em',
                    textTransform: 'uppercase',
                    color: 'var(--color-muted)',
                    borderBottom: '1px solid var(--color-border)',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {intel.benchmarks.map((b) => {
                const c = TONE_COLOR[b.tone];
                return (
                  <tr key={b.metric} style={{ borderBottom: '1px solid var(--color-divider)' }}>
                    <td style={{ padding: '14px 20px', fontSize: 14, color: 'var(--color-text)', fontWeight: 500 }}>
                      {b.metric}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right', fontSize: 15, fontWeight: 800, color: c.fg }}>
                      {b.self}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right', fontSize: 14, fontWeight: 600, color: 'var(--color-muted)' }}>
                      {b.industryMedian}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right', fontSize: 14, fontWeight: 600, color: 'var(--color-muted)' }}>
                      {b.topQuartile}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <span style={{
                        background: c.bg, color: c.fg, border: `1px solid ${c.border}`,
                        borderRadius: 6, padding: '4px 10px',
                        fontSize: 10, fontWeight: 800, letterSpacing: '0.07em', textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                      }}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 4. Competitor set ───────────────────────────────────────────────── */}
      <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
        <div style={{
          padding: '14px 20px', borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-surf2)',
        }}>
          <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-text)' }}>
            Competitive Set
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {intel.competitors.map((comp, i) => {
            const threatColor = comp.threat === 'high' ? '#E06060' : comp.threat === 'med' ? '#F7A500' : '#8E9BB8';
            return (
              <div key={comp.name} style={{
                padding: '14px 20px',
                borderTop: i === 0 ? 'none' : '1px solid var(--color-divider)',
                display: 'grid', gridTemplateColumns: '1.4fr 2.2fr 1fr 1fr auto', gap: 16, alignItems: 'center',
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>{comp.name}</div>
                <div style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.4 }}>{comp.note}</div>
                <div style={{ fontSize: 13, color: 'var(--color-text)', fontWeight: 600, textAlign: 'right' }}>{comp.price}</div>
                <div style={{ fontSize: 12, color: 'var(--color-muted)', textAlign: 'right' }}>{comp.rank}</div>
                <span style={{
                  background: 'transparent', border: `1px solid ${threatColor}`, color: threatColor,
                  borderRadius: 5, padding: '3px 9px',
                  fontSize: 10, fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase',
                  justifySelf: 'end',
                }}>
                  {comp.threat} threat
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 5. Macro indicator cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {intel.macro.map((m) => {
          const c = TONE_COLOR[m.tone];
          return (
            <div key={m.name} style={{ ...CARD, padding: '18px 20px', borderLeft: `3px solid ${c.fg}` }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 8 }}>
                {m.name}
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text)', lineHeight: 1, marginBottom: 4 }}>
                {m.value}
              </div>
              <div style={{ fontSize: 12, color: c.fg, fontWeight: 700, marginBottom: 8 }}>
                {m.change}
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.5 }}>
                {m.note}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 6. AI insight card ──────────────────────────────────────────────── */}
      <div style={{ ...CARD, padding: '20px 24px', borderLeft: '4px solid #4FA8FF' }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#4FA8FF', marginBottom: 14 }}>
          Strategic Read — {subco.shortName}
        </div>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: 0, padding: 0, listStyle: 'none' }}>
          {intel.insights.map((bullet, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span style={{ flexShrink: 0, width: 6, height: 6, borderRadius: '50%', background: '#4FA8FF', marginTop: 7 }} />
              <span style={{ fontSize: 14, color: 'var(--color-text)', lineHeight: 1.55 }}>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
