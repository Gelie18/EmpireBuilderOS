/**
 * 783 Partners topco + subsidiary brand directory.
 *
 * The topco (783 Partners) is the consolidated view; each subco is one of
 * the five operating brands under it. Every entity carries its own brand
 * palette, monogram, product categories, revenue-channel mix, and a short
 * narrative pitch. The Finance OS pages read from this via useSubco() so
 * switching the selector re-skins the whole demo.
 *
 * Numbers are defensible demo placeholders based on public-site product
 * mix and a ~$22M holdco revenue envelope (95% from SSK + BGL per the
 * intro brief). Replace with real QBO / ERP pulls in live mode.
 */

export type ChannelName = 'Amazon' | 'Shopify (DTC)' | 'BigCommerce (DTC)' | 'Retail (QB)' | 'Wholesale' | 'Direct';

export interface ChannelMix {
  name: ChannelName;
  pct: number;
  revenue: number;  // annualized, USD
}

export interface Subco {
  id: string;
  slug: string;            // url-safe
  name: string;            // full display name
  shortName: string;       // sidebar / nav label
  monogram: string;        // 2–4 char mark
  role: 'topco' | 'subco';
  tagline: string;         // one-line positioning
  description: string;     // 2–3 sentences, shown in subco landing card
  colors: {
    primary: string;       // hex
    primaryRgb: string;    // "217, 30, 24"
    accent: string;        // hex
    accentRgb: string;
  };
  /** Top product categories for SKU rationalization and revenue views. */
  products: string[];
  /** Channel mix for Channel Mix dashboard. Pct sums to ~100. */
  channels: ChannelMix[];
  /** Annualized revenue, USD (demo placeholder). */
  annualRevenue: number;
  /** Gross margin pct (demo). */
  grossMargin: number;
  /** Share of topco portfolio (topco = 100). */
  pctOfPortfolio: number;
  /** Ops/finance headline issues surfaced on dashboards. */
  headlineIssues: string[];
}

// ── Consolidated View (virtual — aggregates all portcos) ───────────────────
// This is NOT a real legal entity; it is a virtual "view" option in the
// SubcoSelector that shows all portcos aggregated. Selecting it puts the
// entire Finance OS into consolidated mode (isConsolidated === true).
export const CONSOLIDATED_VIEW: Subco = {
  id: 'consolidated',
  slug: 'consolidated',
  name: 'Consolidated',
  shortName: 'Consolidated',
  monogram: 'ALL',
  role: 'topco',
  tagline: 'All portcos aggregated — full portfolio view.',
  description:
    'Virtual view: aggregates all five operating brands under 783 Partners. No individual entity — switch to a specific portco to see brand-level data.',
  colors: {
    primary: '#1B4DE6',
    primaryRgb: '217, 30, 24',
    accent: '#F58A1F',
    accentRgb: '244, 185, 66',
  },
  products: ['Consolidated — all brands'],
  channels: [
    { name: 'Amazon',            pct: 38, revenue:  8360000 },
    { name: 'Shopify (DTC)',     pct: 27, revenue:  5940000 },
    { name: 'BigCommerce (DTC)', pct: 18, revenue:  3960000 },
    { name: 'Retail (QB)',       pct: 12, revenue:  2640000 },
    { name: 'Wholesale',         pct:  5, revenue:  1100000 },
  ],
  annualRevenue: 22000000,
  grossMargin: 42.8,
  pctOfPortfolio: 100,
  headlineIssues: [
    'SKU long-tail — 38% of SKUs drive 2% of revenue',
    'Amazon take-rate compressing margin on SSK core gloves',
    'SSK royalty reconciliation to Japan parent — manual, monthly',
    'Five platforms, four ledgers — no consolidated cash position',
  ],
};

// ── Holdco / Operating Parent ───────────────────────────────────────────────
// 783 Partners is a real operating entity (the holding company) that rolls up
// to the Consolidated view. It is its own selectable portco in the dropdown.
export const BASES_LOADED_TOPCO: Subco = {
  id: 'bases-loaded',
  slug: 'bases-loaded',
  name: '783 Partners',
  shortName: '783 Partners',
  monogram: 'BL',
  role: 'subco',
  tagline: 'Baseball & softball holdco — operating parent of 5 brands.',
  description:
    "783 Partners is the operating holding company that owns and operates five baseball/athletic brands. The entity handles shared services, finance, and cross-brand strategy. Revenue reflects holdco-level operations; the Consolidated view aggregates all portcos.",
  colors: {
    primary: '#1B4DE6',
    primaryRgb: '217, 30, 24',
    accent: '#F58A1F',
    accentRgb: '244, 185, 66',
  },
  products: ['Holdco operations', 'Shared services', 'Cross-brand strategy'],
  channels: [
    { name: 'Amazon',            pct: 38, revenue:  8360000 },
    { name: 'Shopify (DTC)',     pct: 27, revenue:  5940000 },
    { name: 'BigCommerce (DTC)', pct: 18, revenue:  3960000 },
    { name: 'Retail (QB)',       pct: 12, revenue:  2640000 },
    { name: 'Wholesale',         pct:  5, revenue:  1100000 },
  ],
  annualRevenue: 22000000,
  grossMargin: 42.8,
  pctOfPortfolio: 100,
  headlineIssues: [
    'SKU long-tail — 38% of SKUs drive 2% of revenue',
    'Amazon take-rate compressing margin on SSK core gloves',
    'SSK royalty reconciliation to Japan parent — manual, monthly',
    'Five platforms, four ledgers — no consolidated cash position',
  ],
};

// ── Subcos ─────────────────────────────────────────────────────────────────
export const SSK_BASEBALL: Subco = {
  id: 'ssk',
  slug: 'ssk-baseball',
  name: 'SSK Baseball',
  shortName: 'SSK',
  monogram: 'SSK',
  role: 'subco',
  tagline: 'US distributor for SSK Japan — premium gloves, bats, training gear.',
  description:
    'SSK is a Japanese baseball brand; 783 Partners owns the US distribution arm and operates the brand stateside end-to-end. Z9 / Z7 / Z5 glove series anchor the catalog, with FP5 softball catcher mitts as the emerging line. Revenue share arrangement remits back to Japan parent.',
  colors: {
    primary: '#FF6B00',
    primaryRgb: '255, 107, 0',
    accent: '#111111',
    accentRgb: '17, 17, 17',
  },
  products: [
    'Z9 Maestro gloves',
    'Z7 Specialist gloves',
    'Z5 Craftsman gloves',
    'FP5 fastpitch mitts',
    'Wood bats (fungo + full)',
    'Batting gloves',
    'Training gear',
    'Apparel',
  ],
  channels: [
    { name: 'Amazon',            pct: 52, revenue: 8320000 },
    { name: 'Shopify (DTC)',     pct: 31, revenue: 4960000 },
    { name: 'Wholesale',         pct: 12, revenue: 1920000 },
    { name: 'Retail (QB)',       pct:  5, revenue:  800000 },
  ],
  annualRevenue: 16000000,
  grossMargin: 38.2,
  pctOfPortfolio: 72.7,
  headlineIssues: [
    'Amazon fees + ad spend eating 11pts of margin on Z7 core SKUs',
    'Japan royalty reconciliation — last three months unposted',
    'FP5 launch inventory aging — 4 colorways DOH > 180',
  ],
};

export const BASEBALL_GLOVE_LACE: Subco = {
  id: 'bgl',
  slug: 'baseball-glove-lace',
  name: 'Baseball Glove Lace',
  shortName: 'BGL',
  monogram: 'BGL',
  role: 'subco',
  tagline: 'Specialty laces + pro relacing services — 33 colors, two thicknesses.',
  description:
    'Narrow-catalog specialty retailer: glove laces (Tanners, Red Hawk Tannery, Mizuno) at $4.95 a pop plus $25–$90 relacing services. Commodity unit price, service-heavy margin — the opposite of SSK. Strong long-tail SKU mix by color.',
  colors: {
    primary: '#8B5A2B',
    primaryRgb: '139, 90, 43',
    accent: '#E8C28A',
    accentRgb: '232, 194, 138',
  },
  products: [
    'Red Hawk laces (33 colors)',
    'Tanners laces (8 colors)',
    'Mizuno laces',
    'Relacing — fielders/trapeze',
    "Relacing — catcher's mitt",
    'Protective gear',
    'Maintenance tools',
  ],
  channels: [
    { name: 'Shopify (DTC)',     pct: 72, revenue: 3960000 },
    { name: 'Amazon',            pct: 22, revenue: 1210000 },
    { name: 'Wholesale',         pct:  6, revenue:  330000 },
  ],
  annualRevenue: 5500000,
  grossMargin: 58.4,
  pctOfPortfolio: 25.0,
  headlineIssues: [
    'Relacing service scheduling — 6-week backlog at peak',
    'Lace color long-tail — 19 of 33 colorways sell < 3 units/mo',
    'No attribution between lace sale and follow-on glove purchase',
  ],
};

export const DOUBLE_DUTCH_WAFFLES: Subco = {
  id: 'ddw',
  slug: 'double-dutch-waffles',
  name: 'Double Dutch Waffles',
  shortName: 'Double Dutch',
  monogram: 'DDW',
  role: 'subco',
  tagline: 'Authentic Dutch stroopwafels — DTC, gift, wholesale.',
  description:
    "Heritage Dutch stroopwafel brand with DTC Shopify plus a wholesale/gift program. Four flavors (Caramel, Blueberry, Chocolate Salted Caramel, Vanilla). Two-pack x 16-waffles SKU format at $16.99 retail. Seasonal gift volume dominates Q4.",
  colors: {
    primary: '#E97F2E',
    primaryRgb: '233, 127, 46',
    accent: '#2554A8',
    accentRgb: '37, 84, 168',
  },
  products: [
    'Caramel stroopwafel (2-pack)',
    'Blueberry stroopwafel',
    'Chocolate Salted Caramel',
    'Vanilla stroopwafel',
    'Gift pack bundles',
    'Wholesale cases',
  ],
  channels: [
    { name: 'Shopify (DTC)',     pct: 64, revenue:  512000 },
    { name: 'Wholesale',         pct: 28, revenue:  224000 },
    { name: 'Amazon',            pct:  8, revenue:   64000 },
  ],
  annualRevenue: 800000,
  grossMargin: 51.0,
  pctOfPortfolio: 3.6,
  headlineIssues: [
    'Q4 gift seasonality — 48% of revenue in Nov–Dec',
    'Wholesale collections — 38 days average',
    'Freshness window complicates international fulfillment',
  ],
};

export const ALL_AMERICAN_SOCKS: Subco = {
  id: 'aas',
  slug: 'all-american-socks',
  name: 'All American Socks',
  shortName: 'All American',
  monogram: 'AAS',
  role: 'subco',
  tagline: 'Made-in-USA athletic socks — Game Sock to Over-the-Knee Pro.',
  description:
    'Made-in-USA performance athletic socks, primarily for baseball/softball teams. Product tiers from entry-level Game Sock to premium Elite Player + Over-the-Knee Pro. Team-order volume outpaces individual DTC.',
  colors: {
    primary: '#B31B1B',
    primaryRgb: '179, 27, 27',
    accent: '#1E2F5F',
    accentRgb: '30, 47, 95',
  },
  products: [
    'Team Game Sock',
    'Elite Player (striped)',
    'Elite Player (solid)',
    'Over-the-Knee Pro',
    'City Elite Player',
  ],
  channels: [
    { name: 'Shopify (DTC)',     pct: 45, revenue:  225000 },
    { name: 'Wholesale',         pct: 42, revenue:  210000 },
    { name: 'Amazon',            pct: 13, revenue:   65000 },
  ],
  annualRevenue: 500000,
  grossMargin: 44.7,
  pctOfPortfolio: 2.3,
  headlineIssues: [
    '"Sold out" status persists across Elite line — stockout cost ~$38K/mo',
    'Team-order invoicing — manual QB entry, no PO integration',
    'Made-in-USA cost pressure vs. imports in entry tier',
  ],
};

export const SHUG0: Subco = {
  id: 'shug0',
  slug: 'shug0',
  name: 'Shug0',
  shortName: 'Shug0',
  monogram: 'SH',
  role: 'subco',
  tagline: 'Luxury baseball footwear + custom uniforms (Marcus Stroman).',
  description:
    'Athlete-led luxury baseball footwear brand helmed by Marcus Stroman. Cleats (metal + TPU), turf trainers, SSK-collab fielding gloves, and custom team uniforms. Aggressive sale pricing on core cleats drives volume.',
  colors: {
    primary: '#0A0A0A',
    primaryRgb: '10, 10, 10',
    accent: '#CCA24F',
    accentRgb: '204, 162, 79',
  },
  products: [
    'Metal cleats',
    'TPU molded cleats',
    'Turf trainers',
    'ZPro gloves (SSK collab)',
    'Custom team uniforms',
    'Digital gift cards',
  ],
  channels: [
    { name: 'Shopify (DTC)',     pct: 71, revenue:  852000 },
    { name: 'Wholesale',         pct: 18, revenue:  216000 },
    { name: 'Amazon',            pct: 11, revenue:  132000 },
  ],
  annualRevenue: 1200000,
  grossMargin: 39.1,
  pctOfPortfolio: 5.5,
  headlineIssues: [
    'Discount depth on cleats (~50%) compressing blended margin',
    'Custom uniform lead time — 6 weeks, collections trailing',
    'SSK-collab glove inventory shared across two subcos — attribution ambiguous',
  ],
};

// ALL_SUBCOS = the real portfolio entities (used for the "Portfolio" section
// in the selector dropdown and for per-portco breakdowns in the forecast).
export const ALL_SUBCOS: Subco[] = [
  BASES_LOADED_TOPCO,
  SSK_BASEBALL,
  BASEBALL_GLOVE_LACE,
  DOUBLE_DUTCH_WAFFLES,
  ALL_AMERICAN_SOCKS,
  SHUG0,
];

// ALL_PORTFOLIO_SUBCOS = only the operating subcos (no holdco), used when
// computing per-portco revenue shares for the consolidated forecast breakdown.
export const ALL_PORTFOLIO_SUBCOS: Subco[] = [
  SSK_BASEBALL,
  BASEBALL_GLOVE_LACE,
  DOUBLE_DUTCH_WAFFLES,
  ALL_AMERICAN_SOCKS,
  SHUG0,
];

// SUBCOS_BY_ID includes the CONSOLIDATED_VIEW virtual entry so getSubco()
// resolves 'consolidated' to the aggregate view correctly.
export const SUBCOS_BY_ID: Record<string, Subco> = Object.fromEntries(
  [...ALL_SUBCOS, CONSOLIDATED_VIEW].map((s) => [s.id, s]),
);

export function getSubco(id: string | undefined): Subco {
  if (!id) return CONSOLIDATED_VIEW;
  return SUBCOS_BY_ID[id] ?? CONSOLIDATED_VIEW;
}
