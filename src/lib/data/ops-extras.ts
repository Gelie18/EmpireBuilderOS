// Demo data for Ops extras: fulfillment SLA, support, returns, customer health, chargebacks.
// All anchored to demo date: Wednesday, April 22, 2026.

// ─── Fulfillment SLA ─────────────────────────────────────────────────────────
export const FULFILLMENT_SLA = {
  ordersMtd: 48_720,
  ordersYesterday: 2_180,
  targetSameDayPct: 95,
  actualSameDayPct: 93.8,
  targetOnTimeDeliveryPct: 97,
  actualOnTimeDeliveryPct: 96.2,
  targetPickAccuracyPct: 99.5,
  actualPickAccuracyPct: 99.3,
  avgShipCost: 7.84,
  shipCostBudget: 7.40,
};

export const SLA_TREND_14D = [
  { day: 'Apr 09', sameDay: 94, otd: 96, volume: 2_040 },
  { day: 'Apr 10', sameDay: 95, otd: 97, volume: 2_110 },
  { day: 'Apr 11', sameDay: 96, otd: 98, volume: 1_820 },
  { day: 'Apr 12', sameDay: 93, otd: 95, volume: 2_240 },
  { day: 'Apr 13', sameDay: 92, otd: 94, volume: 2_380 },
  { day: 'Apr 14', sameDay: 95, otd: 97, volume: 2_120 },
  { day: 'Apr 15', sameDay: 94, otd: 96, volume: 2_080 },
  { day: 'Apr 16', sameDay: 96, otd: 98, volume: 1_940 },
  { day: 'Apr 17', sameDay: 95, otd: 97, volume: 2_150 },
  { day: 'Apr 18', sameDay: 93, otd: 96, volume: 2_300 },
  { day: 'Apr 19', sameDay: 92, otd: 95, volume: 2_460 },
  { day: 'Apr 20', sameDay: 94, otd: 96, volume: 2_190 },
  { day: 'Apr 21', sameDay: 93, otd: 96, volume: 2_220 },
  { day: 'Apr 22', sameDay: 94, otd: 96, volume: 2_180 },
];

export const CARRIER_PERF = [
  { carrier: 'UPS Ground',      volumeShare: 48, otdPct: 96.8, avgDays: 3.1, costPerOrder: 7.20 },
  { carrier: 'USPS Priority',   volumeShare: 31, otdPct: 95.4, avgDays: 2.6, costPerOrder: 6.80 },
  { carrier: 'FedEx Home',      volumeShare: 14, otdPct: 97.1, avgDays: 3.4, costPerOrder: 8.90 },
  { carrier: 'DHL eCommerce',   volumeShare:  7, otdPct: 94.0, avgDays: 4.2, costPerOrder: 8.40 },
];

export type FulfillmentException = {
  id: string;
  orderId: string;
  customer: string;
  state: string;
  carrier: string;
  issue: string;
  age: string;
  priority: 'high' | 'med' | 'low';
};

export const FULFILLMENT_EXCEPTIONS: FulfillmentException[] = [
  { id: 'EX-4401', orderId: 'ORD-40128', customer: 'M. Reyes',      state: 'TX', carrier: 'UPS Ground',    issue: 'Stuck in Denver hub — 48h no scan',     age: '2d',  priority: 'high' },
  { id: 'EX-4400', orderId: 'ORD-40117', customer: 'J. Nguyen',     state: 'CA', carrier: 'USPS Priority', issue: 'Address verification failure',           age: '1d',  priority: 'high' },
  { id: 'EX-4398', orderId: 'ORD-40092', customer: 'Yost Sporting', state: 'NY', carrier: 'FedEx Home',    issue: 'Damaged in transit — replacement queued', age: '4h',  priority: 'med'  },
  { id: 'EX-4396', orderId: 'ORD-40071', customer: 'R. Park',       state: 'OR', carrier: 'DHL eCommerce', issue: 'Package weight discrepancy at carrier',   age: '6h',  priority: 'med'  },
  { id: 'EX-4395', orderId: 'ORD-40058', customer: 'T. Williams',   state: 'FL', carrier: 'UPS Ground',    issue: 'Signature required — 2 delivery attempts',age: '12h', priority: 'low'  },
];

// ─── Support / CSAT ──────────────────────────────────────────────────────────
export const SUPPORT_SNAPSHOT = {
  openTickets: 84,
  openAge: { under4h: 41, under24h: 28, under72h: 11, over72h: 4 },
  firstResponseMedianMin: 42,
  firstResponseTargetMin: 60,
  resolutionMedianHours: 6.4,
  resolutionTargetHours: 8,
  csat30d: 4.52,
  csatLastMonth: 4.41,
  ticketsMtd: 1_280,
  deflectedByBotMtd: 612,
  deflectedPct: 32,
};

export const SUPPORT_CATEGORY_MIX = [
  { category: 'Order status',        share: 28, trend: 'flat' as const },
  { category: 'Shipping / delivery', share: 22, trend: 'up' as const },
  { category: 'Sizing / fit',        share: 17, trend: 'down' as const },
  { category: 'Returns / refunds',   share: 14, trend: 'flat' as const },
  { category: 'Product defect',      share:  9, trend: 'down' as const },
  { category: 'Other',               share: 10, trend: 'flat' as const },
];

export type SupportTicket = {
  id: string;
  customer: string;
  subject: string;
  channel: 'email' | 'chat' | 'phone' | 'social';
  priority: 'urgent' | 'high' | 'normal';
  age: string;
  assignee: string;
  sentiment: 'happy' | 'neutral' | 'angry';
};

export const SUPPORT_QUEUE: SupportTicket[] = [
  { id: 'CS-8812', customer: 'D. Alvarez',     subject: 'Where is my order #40118?',              channel: 'chat',  priority: 'high',   age: '12m', assignee: 'K. Liu',      sentiment: 'neutral' },
  { id: 'CS-8811', customer: 'Yost Sporting',  subject: 'Bulk order — damaged case, 12 units',    channel: 'email', priority: 'urgent', age: '28m', assignee: 'B. Park',     sentiment: 'angry'   },
  { id: 'CS-8810', customer: 'A. Thompson',    subject: 'Return label for wrong size',            channel: 'email', priority: 'normal', age: '1h',  assignee: 'K. Liu',      sentiment: 'neutral' },
  { id: 'CS-8809', customer: 'R. Okeke',       subject: 'Love the hoodie — is Navy coming back?', channel: 'social',priority: 'normal', age: '2h',  assignee: 'bot',         sentiment: 'happy'   },
  { id: 'CS-8808', customer: 'Flagstaff Field',subject: 'Net-30 invoice #2031 — dispute line 4',  channel: 'email', priority: 'high',   age: '3h',  assignee: 'finance.kim', sentiment: 'neutral' },
  { id: 'CS-8807', customer: 'L. Johansson',   subject: 'Package says delivered but not here',    channel: 'chat',  priority: 'high',   age: '3h',  assignee: 'B. Park',     sentiment: 'angry'   },
  { id: 'CS-8806', customer: 'M. Patel',       subject: 'Can I combine two orders for shipping?', channel: 'chat',  priority: 'normal', age: '4h',  assignee: 'bot',         sentiment: 'neutral' },
  { id: 'CS-8805', customer: 'C. Okonkwo',     subject: 'Coupon code not applying',               channel: 'email', priority: 'normal', age: '5h',  assignee: 'K. Liu',      sentiment: 'neutral' },
];

// ─── Returns / RMA ───────────────────────────────────────────────────────────
export const RETURNS_SNAPSHOT = {
  activeRmas: 142,
  mtdReturnRate: 9.8,
  mtdReturnRatePriorMonth: 10.4,
  refundsMtd: 88_420,
  restockedValueMtd: 41_200,
  destroyedValueMtd: 6_480,
  avgProcessingDays: 2.8,
};

export const RETURN_REASON_MIX = [
  { reason: 'Wrong size / fit',      share: 38, avgDaysToReturn: 6 },
  { reason: 'Didn\'t like fabric',   share: 18, avgDaysToReturn: 9 },
  { reason: 'Different from photo',  share: 14, avgDaysToReturn: 7 },
  { reason: 'Defect / damage',       share: 11, avgDaysToReturn: 4 },
  { reason: 'Ordered multiple sizes',share: 10, avgDaysToReturn: 5 },
  { reason: 'Other / no reason',     share:  9, avgDaysToReturn: 8 },
];

export type RmaRecord = {
  id: string;
  orderId: string;
  customer: string;
  sku: string;
  qty: number;
  reason: string;
  status: 'requested' | 'label-sent' | 'in-transit' | 'received' | 'inspecting' | 'refunded' | 'denied';
  refundAmount: number;
  age: string;
};

export const RMA_LIST: RmaRecord[] = [
  { id: 'RMA-3108', orderId: 'ORD-40091', customer: 'K. Sato',       sku: 'BGL-HOOD-GRY-XL',   qty: 1, reason: 'Wrong size',            status: 'received',   refundAmount: 98.00,  age: '1d' },
  { id: 'RMA-3107', orderId: 'ORD-40085', customer: 'R. Bennett',    sku: 'SSK-Z7-BLK-M',      qty: 2, reason: 'Ordered multiple sizes',status: 'refunded',   refundAmount: 96.00,  age: '2d' },
  { id: 'RMA-3106', orderId: 'ORD-40077', customer: 'Yost Sporting', sku: 'DDW-CAP-RED-OS',    qty:12, reason: 'Defect — stitching',    status: 'inspecting', refundAmount: 336.00, age: '3d' },
  { id: 'RMA-3105', orderId: 'ORD-40064', customer: 'M. Okafor',     sku: 'SSK-RAIN-GRN-L',    qty: 1, reason: 'Didn\'t like fabric',   status: 'in-transit', refundAmount: 128.00, age: '3d' },
  { id: 'RMA-3104', orderId: 'ORD-40051', customer: 'L. Bach',       sku: 'AAS-SHORT-BLK-32',  qty: 1, reason: 'Wrong size',            status: 'label-sent', refundAmount: 64.00,  age: '4d' },
  { id: 'RMA-3103', orderId: 'ORD-40042', customer: 'Flagstaff Field',sku: 'DDW-BOTTLE-22',    qty: 6, reason: 'Different from photo', status: 'requested',  refundAmount: 132.00, age: '4d' },
  { id: 'RMA-3102', orderId: 'ORD-40030', customer: 'S. Park',       sku: 'SHUG-SOCK-3PK',     qty: 2, reason: 'Wrong size',            status: 'denied',     refundAmount: 0.00,   age: '5d' },
];

// ─── Customer health / churn ─────────────────────────────────────────────────
export const CUSTOMER_HEALTH = {
  totalActive: 18_420,
  newMtd: 1_340,
  churnedMtd: 520,
  ltvAvg: 184.50,
  ltvB2bAvg: 2_840,
  repeatPct: 41,
  cohortNetRevRetention12mo: 108,
};

export type CustomerRow = {
  id: string;
  name: string;
  segment: 'B2B' | 'VIP' | 'Subscription' | 'One-time';
  ltv: number;
  lastOrder: string;
  daysSinceLast: number;
  ordersL12M: number;
  healthScore: number;
  trend: 'up' | 'flat' | 'down';
  risk: 'low' | 'medium' | 'high' | 'critical';
};

export const CUSTOMER_RISK_LIST: CustomerRow[] = [
  { id: 'C-1042', name: 'Yost Sporting',       segment: 'B2B',          ltv: 18_420, lastOrder: 'Mar 14', daysSinceLast: 39, ordersL12M: 14, healthScore: 52, trend: 'down', risk: 'high'     },
  { id: 'C-1031', name: 'Flagstaff Field',     segment: 'B2B',          ltv: 12_860, lastOrder: 'Feb 28', daysSinceLast: 53, ordersL12M: 11, healthScore: 41, trend: 'down', risk: 'critical' },
  { id: 'C-4182', name: 'D. Alvarez',          segment: 'VIP',          ltv: 4_280,  lastOrder: 'Mar 02', daysSinceLast: 51, ordersL12M:  8, healthScore: 58, trend: 'down', risk: 'high'     },
  { id: 'C-4091', name: 'M. Reyes',            segment: 'Subscription', ltv: 1_420,  lastOrder: 'Apr 15', daysSinceLast:  7, ordersL12M: 12, healthScore: 82, trend: 'flat', risk: 'low'      },
  { id: 'C-3204', name: 'R. Okeke',            segment: 'VIP',          ltv: 3_120,  lastOrder: 'Apr 19', daysSinceLast:  3, ordersL12M:  9, healthScore: 91, trend: 'up',   risk: 'low'      },
  { id: 'C-2918', name: 'L. Johansson',        segment: 'One-time',     ltv: 84,     lastOrder: 'Apr 21', daysSinceLast:  1, ordersL12M:  1, healthScore: 38, trend: 'down', risk: 'medium'   },
  { id: 'C-1102', name: 'Piedmont Outfitters', segment: 'B2B',          ltv: 8_920,  lastOrder: 'Mar 22', daysSinceLast: 31, ordersL12M:  7, healthScore: 64, trend: 'down', risk: 'medium'   },
  { id: 'C-5012', name: 'J. Nguyen',           segment: 'Subscription', ltv: 840,    lastOrder: 'Apr 11', daysSinceLast: 11, ordersL12M:  8, healthScore: 71, trend: 'flat', risk: 'low'      },
];

// ─── Chargebacks ─────────────────────────────────────────────────────────────
export const CHARGEBACK_SNAPSHOT = {
  openDisputes: 14,
  mtdDisputes: 22,
  mtdLost: 1_820,
  mtdRecovered: 2_140,
  winRate: 64,
  disputeRateBps: 18, // basis points of revenue
  industryBenchmarkBps: 45,
};

export const CHARGEBACK_REASONS = [
  { code: '4855', label: 'Goods not received',   share: 34, winRate: 72 },
  { code: '4837', label: 'Fraud — no auth',      share: 28, winRate: 41 },
  { code: '4853', label: 'Not as described',     share: 18, winRate: 58 },
  { code: '4859', label: 'Service not provided', share:  9, winRate: 66 },
  { code: '4834', label: 'Duplicate processing', share:  6, winRate: 88 },
  { code: 'Other',label: 'Other',                share:  5, winRate: 50 },
];

export type Chargeback = {
  id: string;
  orderId: string;
  customer: string;
  amount: number;
  reasonCode: string;
  reasonLabel: string;
  openedAt: string;
  dueBy: string;
  status: 'new' | 'evidence-gathering' | 'evidence-submitted' | 'won' | 'lost' | 'expired';
  assignee: string;
};

export const CHARGEBACK_LIST: Chargeback[] = [
  { id: 'CB-0712', orderId: 'ORD-39871', customer: 'Visa ****4102', amount: 248.00, reasonCode: '4855', reasonLabel: 'Goods not received',   openedAt: 'Apr 18', dueBy: 'Apr 28', status: 'evidence-gathering', assignee: 'finance.kim' },
  { id: 'CB-0711', orderId: 'ORD-39802', customer: 'MC ****3281',   amount: 184.00, reasonCode: '4837', reasonLabel: 'Fraud — no auth',      openedAt: 'Apr 16', dueBy: 'Apr 26', status: 'evidence-submitted', assignee: 'finance.kim' },
  { id: 'CB-0710', orderId: 'ORD-39754', customer: 'Visa ****9012', amount: 128.00, reasonCode: '4853', reasonLabel: 'Not as described',     openedAt: 'Apr 15', dueBy: 'Apr 25', status: 'evidence-submitted', assignee: 'ops.liu'     },
  { id: 'CB-0709', orderId: 'ORD-39682', customer: 'Visa ****3344', amount:  96.00, reasonCode: '4855', reasonLabel: 'Goods not received',   openedAt: 'Apr 12', dueBy: 'Apr 22', status: 'new',                assignee: '—'           },
  { id: 'CB-0708', orderId: 'ORD-39604', customer: 'Amex ****4001', amount: 312.00, reasonCode: '4837', reasonLabel: 'Fraud — no auth',      openedAt: 'Apr 10', dueBy: 'Apr 20', status: 'lost',               assignee: 'finance.kim' },
  { id: 'CB-0707', orderId: 'ORD-39571', customer: 'MC ****1208',   amount: 142.00, reasonCode: '4834', reasonLabel: 'Duplicate processing', openedAt: 'Apr 08', dueBy: 'Apr 18', status: 'won',                assignee: 'finance.kim' },
  { id: 'CB-0706', orderId: 'ORD-39502', customer: 'Visa ****7701', amount: 208.00, reasonCode: '4853', reasonLabel: 'Not as described',     openedAt: 'Apr 06', dueBy: 'Apr 16', status: 'won',                assignee: 'ops.liu'     },
];
