'use client';

import { useMemo, useRef, useEffect, useState } from 'react';
import { useSubco } from '@/contexts/SubcoContext';
import { ALL_PORTFOLIO_SUBCOS } from '@/lib/subcos';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

// ─── Shared styles ─────────────────────────────────────────────────────────────
const CARD: React.CSSProperties = {
  background:   'var(--color-surf)',
  borderRadius: 'var(--card-radius)',
  boxShadow:    'var(--card-shadow)',
  border:       '1px solid var(--color-border)',
};

const TOOLTIP_STYLE = {
  background:   '#1E2236',
  border:       '1px solid rgba(255,255,255,0.10)',
  borderRadius: 8,
  color:        '#FFFFFF',
  fontSize:     12,
  boxShadow:    '0 1px 4px rgba(0,0,0,0.30), 0 4px 16px rgba(0,0,0,0.25)',
};

const LABEL: React.CSSProperties = {
  fontSize:      11,
  fontWeight:    700,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.10em',
  color:         'var(--color-muted)',
  fontFamily:    'var(--font-condensed)',
};

// ─── Brand colours (parallel with ALL_PORTFOLIO_SUBCOS order) ─────────────────
const BRAND_COLORS = ['#1D44BF', '#0A8A5C', '#E8B84B', '#41B6E6', '#FF6B00'];

// ─── Consolidated base data ────────────────────────────────────────────────────
const TOTAL_REVENUE = ALL_PORTFOLIO_SUBCOS.reduce((a, s) => a + s.annualRevenue, 0);

const BASE_KPIS = {
  openTickets:         247,
  avgFirstResponseHrs: 2.4,
  csat:                4.3,
  refundRate:          3.8,
  slaCompliance:       87,
  escalationRate:      8.2,
};

// 30-day ticket volume trend (10 data points)
const TICKET_TREND = [
  { date: 'Apr 1',  opened: 38, resolved: 32 },
  { date: 'Apr 4',  opened: 42, resolved: 39 },
  { date: 'Apr 7',  opened: 35, resolved: 41 },
  { date: 'Apr 10', opened: 51, resolved: 44 },
  { date: 'Apr 13', opened: 47, resolved: 43 },
  { date: 'Apr 16', opened: 44, resolved: 38 },
  { date: 'Apr 19', opened: 58, resolved: 49 },
  { date: 'Apr 22', opened: 63, resolved: 47 },
];

// Ticket status breakdown (donut)
const TICKET_STATUS = [
  { name: 'Open',        value: 247, color: '#1D44BF'  },
  { name: 'In Progress', value:  89, color: '#E8B84B'  },
  { name: 'Escalated',   value:  34, color: '#FF6B00'  },
  { name: 'Closed Today',value: 128, color: '#2DB47A'  },
];

// Issue type breakdown (horizontal bar)
const ISSUE_TYPES = [
  { type: 'Late / Missing Shipment',  count: 87, color: '#FF6B00' },
  { type: 'Defective / Damaged Item', count: 64, color: '#1D44BF' },
  { type: 'Wrong Item Sent',          count: 41, color: '#E8B84B' },
  { type: 'Refund / Return Request',  count: 38, color: '#4FA8FF' },
  { type: 'Size / Fit Issue',         count: 29, color: '#2DB47A' },
  { type: 'Backorder / Stockout',     count: 24, color: '#9B59B6' },
  { type: 'Product Question',         count: 18, color: '#41B6E6' },
  { type: 'Other',                    count: 14, color: '#6B7280' },
];

// Ticket source channels
const TICKET_CHANNELS = [
  { channel: 'Amazon Seller', count: 98, color: '#E8B84B' },
  { channel: 'Email',         count: 71, color: '#4FA8FF' },
  { channel: 'Chat (DTC)',    count: 44, color: '#2DB47A' },
  { channel: 'Phone',         count: 21, color: '#FF6B00' },
  { channel: 'Social',        count: 13, color: '#9B59B6' },
];

// CSAT trend (6 months)
const CSAT_TREND = [
  { month: 'Nov', csat: 4.6 },
  { month: 'Dec', csat: 4.4 },
  { month: 'Jan', csat: 4.2 },
  { month: 'Feb', csat: 4.5 },
  { month: 'Mar', csat: 4.4 },
  { month: 'Apr', csat: 4.3 },
];

// SLA compliance by brand (parallel with ALL_PORTFOLIO_SUBCOS)
const SLA_BY_BRAND = [88, 95, 98, 83, 74];

// Refunds per brand (parallel with ALL_PORTFOLIO_SUBCOS)
const BRAND_REFUNDS = [
  { returns: 48,  refundAmt: 7_840, returnRate: 2.9, topReason: 'Defective (lacing/barrel)',    trend: '↑' as const },
  { returns: 12,  refundAmt:   892, returnRate: 1.8, topReason: 'Wrong item sent',               trend: '↓' as const },
  { returns:  6,  refundAmt:   244, returnRate: 4.2, topReason: 'Damaged in transit',            trend: '→' as const },
  { returns: 22,  refundAmt:   986, returnRate: 5.1, topReason: 'Size / fit issue',              trend: '↑' as const },
  { returns: 31,  refundAmt: 4_216, returnRate: 6.8, topReason: 'Backorder / cancellation',     trend: '↑' as const },
];

// Open ticket queue
interface TicketRow {
  id:        string;
  brandMonogram: string;
  brandColor:    string;
  brandName: string;
  issue:     string;
  channel:   string;
  priority:  'high' | 'medium' | 'low';
  age:       string;
  status:    'Open' | 'In Progress' | 'Escalated';
}

const ALL_TICKETS: TicketRow[] = [
  { id: 'CS-4821', brandMonogram: 'SSK',  brandColor: '#1D44BF', brandName: 'SSK Baseball',   issue: 'Z9 Elite glove — lacing snapped after 2 uses',              channel: 'Amazon',      priority: 'high',   age: '3h 12m',  status: 'Escalated'   },
  { id: 'CS-4820', brandMonogram: 'SHUG', brandColor: '#FF6B00', brandName: 'Shug0',          issue: 'Metal cleats backordered — needs ETA or refund',            channel: 'Email',       priority: 'high',   age: '4h 08m',  status: 'Escalated'   },
  { id: 'CS-4819', brandMonogram: 'AAS',  brandColor: '#41B6E6', brandName: 'All American',   issue: 'Ordered size Large, received size Small — Elite Pro socks', channel: 'Chat',        priority: 'medium', age: '6h 20m',  status: 'In Progress' },
  { id: 'CS-4818', brandMonogram: 'SSK',  brandColor: '#1D44BF', brandName: 'SSK Baseball',   issue: 'Youth bat — cracked barrel, warranty claim filed',           channel: 'Amazon',      priority: 'high',   age: '8h 45m',  status: 'Open'        },
  { id: 'CS-4816', brandMonogram: 'SHUG', brandColor: '#FF6B00', brandName: 'Shug0',          issue: 'Cleat backorder — refund requested, no ETA provided',       channel: 'Email',       priority: 'high',   age: '12h 30m', status: 'Escalated'   },
  { id: 'CS-4815', brandMonogram: 'DDW',  brandColor: '#E8B84B', brandName: 'Double Dutch',   issue: 'Gift box damaged in transit — holiday order',               channel: 'Chat',        priority: 'medium', age: '14h 10m', status: 'In Progress' },
  { id: 'CS-4814', brandMonogram: 'BGL',  brandColor: '#0A8A5C', brandName: 'Baseball Lace',  issue: 'Red laces sent instead of Navy — relacing kit order',       channel: 'Email',       priority: 'low',    age: '18h 55m', status: 'Open'        },
  { id: 'CS-4813', brandMonogram: 'AAS',  brandColor: '#41B6E6', brandName: 'All American',   issue: 'Missing compression sleeve in bundle order',                channel: 'Amazon',      priority: 'medium', age: '1d 2h',   status: 'Open'        },
  { id: 'CS-4812', brandMonogram: 'SSK',  brandColor: '#1D44BF', brandName: 'SSK Baseball',   issue: 'Glove break-in process — product care question',            channel: 'Social',      priority: 'low',    age: '1d 4h',   status: 'Open'        },
  { id: 'CS-4810', brandMonogram: 'BGL',  brandColor: '#0A8A5C', brandName: 'Baseball Lace',  issue: 'Pro relacing kit — back in stock ETA inquiry',             channel: 'Email',       priority: 'low',    age: '2d 1h',   status: 'Open'        },
];

// CS-flagged issues
const CS_FLAGS = [
  {
    id: 1, severity: 'critical' as const,
    brandMonogram: 'SHUG', brandColor: '#FF6B00', brandName: 'Shug0',
    ticketCount: 31,
    title: 'Metal cleat backorder — no supplier ETA',
    desc:  '31 open refund / cancellation requests from customers. K-Swiss has no confirmed ship date. Recommend proactive customer email + partial refund offer to stem escalations. Avg ticket age: 18h.',
  },
  {
    id: 2, severity: 'critical' as const,
    brandMonogram: 'SSK', brandColor: '#1D44BF', brandName: 'SSK Baseball',
    ticketCount: 18,
    title: 'Z9 Elite glove defect — lacing failure across recent batch',
    desc:  '18 warranty claims this week citing lacing snapping within first week of use. Suspected bad batch from Japan factory. Recommend pull-forward replacement program and notify operations to quarantine unsold inventory.',
  },
  {
    id: 3, severity: 'warning' as const,
    brandMonogram: 'AAS', brandColor: '#41B6E6', brandName: 'All American Socks',
    ticketCount: 11,
    title: '3 Elite sock sizes sold out — customers receiving unexpected cancellations',
    desc:  'Customers purchasing on Shopify then receiving order-cancelled emails when fulfillment detects stockout. 11 tickets, rising. Est. $3,200 in refunds this week. Fix: suppress out-of-stock sizes on PDP.',
  },
  {
    id: 4, severity: 'warning' as const,
    brandMonogram: 'SSK', brandColor: '#1D44BF', brandName: 'SSK Baseball',
    ticketCount: 6,
    title: 'Z9 batting gloves nearing reorder point',
    desc:  '6 customer inquiries about availability this week — early signal of demand spike. Safety stock at 12% of target. Reorder triggered; expect 22-day lead from Japan.',
  },
  {
    id: 5, severity: 'info' as const,
    brandMonogram: 'BGL', brandColor: '#0A8A5C', brandName: 'Baseball Lace',
    ticketCount: 3,
    title: 'Color mix-up in recent lace shipment batch',
    desc:  'Red laces shipped instead of Navy on 3 orders. Fulfillment team investigating. Low volume but CSAT risk — respond with prepaid return + replacement within 24h.',
  },
];

const SEVERITY_CONFIG = {
  critical: { color: '#E05454', bg: 'rgba(224,84,84,0.10)',  border: 'rgba(224,84,84,0.30)',  label: 'CRITICAL' },
  warning:  { color: '#E8B84B', bg: 'rgba(245,138,31,0.10)', border: 'rgba(245,138,31,0.28)', label: 'WARNING'  },
  info:     { color: '#4FA8FF', bg: 'rgba(79,168,255,0.10)', border: 'rgba(79,168,255,0.25)', label: 'INFO'     },
} as const;

const PRIORITY_CONFIG = {
  high:   { color: '#E05454', bg: 'rgba(224,84,84,0.12)',  label: 'HIGH'   },
  medium: { color: '#E8B84B', bg: 'rgba(245,138,31,0.12)', label: 'MED'    },
  low:    { color: '#2DB47A', bg: 'rgba(45,180,122,0.12)', label: 'LOW'    },
} as const;

const STATUS_CONFIG: Record<string, { color: string; bg: string }> = {
  'Open':        { color: '#4FA8FF', bg: 'rgba(79,168,255,0.12)'  },
  'In Progress': { color: '#E8B84B', bg: 'rgba(245,138,31,0.12)'  },
  'Escalated':   { color: '#E05454', bg: 'rgba(224,84,84,0.12)'   },
};

// ─── CS Chat ──────────────────────────────────────────────────────────────────
interface CSMessage {
  id: string;
  role: 'customer' | 'agent';
  text: string;
  ticketId?: string;
  actions?: { label: string; color: string }[];
}

type CSIntent = 'order_status' | 'return_refund' | 'defective' | 'wrong_item' | 'backorder' | 'product_question' | 'shipping' | 'escalate' | 'complaint' | 'general';

function classifyCSIntent(text: string): CSIntent {
  const t = text.toLowerCase();
  if (/broken|defect|damage|warranty|snap|crack|faulty|broke|lacing|barrel/.test(t)) return 'defective';
  if (/return|refund|money back|cancel|exchange/.test(t)) return 'return_refund';
  if (/wrong|incorrect|different.*item|sent.*wrong|received.*wrong/.test(t)) return 'wrong_item';
  if (/out of stock|backorder|when.*available|not available|eta|restock/.test(t)) return 'backorder';
  if (/order.*status|track|where.*order|when.*arriv|not.*arrived|deliver|shipment/.test(t)) return 'order_status';
  if (/ship|transit|fedex|ups|usps/.test(t)) return 'shipping';
  if (/speak.*human|talk.*person|manager|supervisor|escalate|real person/.test(t)) return 'escalate';
  if (/terrible|awful|horrible|worst|unacceptable|ridiculous|frustrated|angry/.test(t)) return 'complaint';
  if (/size|fit|measure|how.*use|care|break.?in|difference|which.*size/.test(t)) return 'product_question';
  return 'general';
}

const BRAND_AGENTS: Record<string, string> = {
  ssk:          'SSK Baseball',
  bgl:          'Baseball Lace',
  ddw:          'Double Dutch Wear',
  aas:          'All American Socks',
  shug0:        'Shug0',
  any:          'Meritage Partners Support',
};

const CS_SUGGESTED_PROMPTS: Record<string, string[]> = {
  ssk:   ['My Z9 glove lacing snapped after 2 uses', 'Where is my order?', 'Youth bat cracked — warranty claim', 'Z9 gloves appear to be back-ordered'],
  bgl:   ['I received red laces instead of navy', 'When will the pro relacing kit be back in stock?', 'How do I rellace my glove?', 'Damaged package on delivery'],
  ddw:   ['My jump rope handle broke', 'I need to return a damaged gift set', 'When will my order ship?', 'Wrong color rope sent'],
  aas:   ['I ordered Large, received Small', 'Elite socks out of stock — need ETA', 'Missing compression sleeve in my bundle', 'How do I track my order?'],
  shug0: ['My metal cleats are backordered — need a refund', 'When will the Gold Bat restock?', 'Cleat sizing question', 'Order arrived damaged'],
  any:   ['I need to return a defective item', 'Where is my order?', 'I received the wrong product', 'How do I file a warranty claim?'],
};

function csReply(text: string, brandId: string): { text: string; ticketId?: string; actions?: { label: string; color: string }[] } {
  const intent = classifyCSIntent(text);
  const ticketNum = Math.floor(4900 + Math.random() * 99);
  const ticketId = `CS-${ticketNum}`;

  switch (intent) {
    case 'defective':
      if (brandId === 'ssk') return {
        text: `I'm so sorry to hear about the quality issue with your SSK gear — that's absolutely not the standard we hold ourselves to.\n\nI've opened warranty claim **${ticketId}** for you. Our quality team will review within 24 hours.\n\n**What happens next:**\n• Prepaid return label sent to your email within 2 hours\n• Replacement ships within 2 business days of receiving your return\n• If this is part of a known batch issue, we may upgrade you to the next model at no charge\n\nCould you confirm the best email address for your return label?`,
        ticketId,
        actions: [{ label: 'Send Return Label Now', color: '#2DB47A' }, { label: 'Flag for QC Team', color: '#E8B84B' }],
      };
      if (brandId === 'shug0') return {
        text: `I'm really sorry about that — your gear should perform at the highest level.\n\nI've created warranty ticket **${ticketId}**. Since you're a Shug0 customer, we've got you covered with our Performance Guarantee.\n\n**Next steps:**\n• Prepaid return label on its way to your email\n• Replacement or full refund — your choice — within 3 business days\n\nCan I get your order number to pull up your details?`,
        ticketId,
        actions: [{ label: 'Issue Replacement', color: '#2DB47A' }, { label: 'Issue Full Refund', color: '#4FA8FF' }],
      };
      return {
        text: `I sincerely apologize for the experience. That's not what we stand for.\n\nI've created warranty case **${ticketId}** and our team will follow up within 24 hours.\n\n**Your next steps:**\n• Prepaid return label heading to your email now\n• Replacement or refund processed within 2–3 business days\n\nDo you have your order number handy so I can pull up your account?`,
        ticketId,
        actions: [{ label: 'Send Return Label', color: '#2DB47A' }, { label: 'Request Photos', color: '#4FA8FF' }],
      };

    case 'return_refund':
      return {
        text: `Of course — I'd be happy to start a return for you. Our 30-day return policy covers all unused and defective items.\n\nI've initiated return **${ticketId}**.\n\n**How it works:**\n• You'll receive a prepaid return label via email within 1 hour\n• Drop off at any FedEx or UPS location\n• Refund hits your original payment method within 3–5 business days of us receiving the item\n\nWould you like a refund or an exchange?`,
        ticketId,
        actions: [{ label: 'Process Refund', color: '#2DB47A' }, { label: 'Process Exchange', color: '#E8B84B' }],
      };

    case 'wrong_item':
      return {
        text: `Oh no — I'm so sorry about that mix-up! That's a fulfillment error on our end and we'll make it right immediately.\n\nI've flagged order **${ticketId}** as a wrong-item shipment.\n\n**Here's what we'll do:**\n• We'll ship the correct item to you today — no need to return the wrong one\n• You'll receive a shipping confirmation within 2 hours\n• Keep or donate the item you received\n\nCan you confirm your shipping address is still current?`,
        ticketId,
        actions: [{ label: 'Ship Correct Item', color: '#2DB47A' }, { label: 'Arrange Return', color: '#E8B84B' }],
      };

    case 'backorder':
      if (brandId === 'shug0') return {
        text: `I completely understand the frustration — I've checked with our operations team and unfortunately the metal cleats are still awaiting a confirmed ship date from our supplier.\n\n**Your options:**\n• **Keep your order** — we'll ship the moment inventory arrives and add a 15% discount code to your account for the wait\n• **Full refund** — processed immediately, no questions asked\n• **Substitute** — we can recommend similar in-stock options\n\nTicket **${ticketId}** has been flagged for priority fulfillment. Which option works best for you?`,
        ticketId,
        actions: [{ label: 'Apply 15% Credit', color: '#2DB47A' }, { label: 'Issue Full Refund', color: '#E05454' }],
      };
      return {
        text: `I can check on availability for you. I can see that item is currently on backorder.\n\n**Expected restock:** We're anticipating inventory within 2–3 weeks, though I'd recommend I add you to our **back-in-stock notification list** so you get an email the moment it's available.\n\nWould you like to:\n1. Stay on the waiting list with your current order held\n2. Get a full refund and re-order when stock arrives\n3. Explore in-stock alternatives\n\nTicket **${ticketId}** created for follow-up.`,
        ticketId,
        actions: [{ label: 'Add to Notify List', color: '#2DB47A' }, { label: 'Issue Refund', color: '#E05454' }],
      };

    case 'order_status':
      return {
        text: `Let me pull that up for you right now!\n\nI can see your order is currently **in transit** with the carrier.\n\n📦 **Estimated delivery: 2–3 business days**\n\nYour tracking number was sent in your confirmation email. If you can't find it, just share your order number and I'll resend it directly.\n\nIs everything else looking good with your order?`,
        actions: [{ label: 'Resend Tracking Email', color: '#4FA8FF' }],
      };

    case 'shipping':
      return {
        text: `Happy to help with shipping! Here's what I can see:\n\n📦 Orders typically ship within **1–2 business days** of purchase.\n• Standard shipping: 3–7 business days\n• Expedited: 2–3 business days\n• Priority: 1–2 business days\n\nOnce shipped, you'll receive an email with your tracking number. If your order has already shipped and you haven't received a tracking email, I can look that up — just share your order number!`,
        actions: [{ label: 'Resend Shipping Confirmation', color: '#4FA8FF' }],
      };

    case 'product_question':
      if (brandId === 'ssk') return {
        text: `Great question! I want to make sure your SSK gear performs at its best.\n\n**Glove Break-In Tips:**\n• Apply a light coat of SSK conditioner to the pocket and laces\n• Use a rubber mallet to work the pocket — 50–100 taps\n• Store a baseball in the pocket overnight with rubber bands\n• Play catch for 1–2 hours before game use\n\n**Sizing:** SSK gloves run true to size. For infield, go 11.25–11.75"; outfield, 12–12.75".\n\nAnything else I can help with?`,
      };
      if (brandId === 'bgl') return {
        text: `Happy to help with lacing questions!\n\n**Choosing lace length:**\n• Standard relace: 72" laces (most gloves)\n• Outfield/deep pocket: 84"+ laces\n• Wrist strap only: 27"\n\n**Lace Material:** We offer cowhide (durable, traditional feel) and rawhide (lighter, more flexible). Our pro customers mostly prefer cowhide for longevity.\n\nNeed help with a specific glove model? Share the make/model and I can give you an exact recommendation!`,
      };
      return {
        text: `Great question! I'd love to help you get the right fit and performance.\n\n**Quick sizing guide:**\n• Check the size chart in our product description — it covers measurements by size\n• When between sizes, we generally recommend sizing up for comfort\n• If the item doesn't fit perfectly, our exchange policy is hassle-free\n\nDo you have a specific product or size question I can answer more precisely?`,
        actions: [{ label: 'View Size Guide', color: '#4FA8FF' }],
      };

    case 'escalate':
      return {
        text: `Of course — I completely understand. I'm connecting you with a senior member of our team now.\n\n**Reference number: ${ticketId}**\n\nA customer success specialist will reach out within **30 minutes** during business hours (M–F 9am–6pm ET). If it's after hours, they'll contact you first thing tomorrow morning.\n\nIs there a preferred phone number or email for them to reach you?`,
        ticketId,
        actions: [{ label: 'Queue for Specialist', color: '#E8B84B' }, { label: 'Schedule Callback', color: '#4FA8FF' }],
      };

    case 'complaint':
      return {
        text: `I hear you, and I'm truly sorry. Your frustration is completely valid and this is not the experience we want for our customers.\n\n**I'm making this a priority right now.** I've flagged your case **${ticketId}** as high priority and it will be reviewed by a team lead within the hour.\n\nTo make this right, I'd like to:\n• Resolve your immediate issue as fast as possible\n• Apply a **20% discount** to your account for the trouble\n• Ensure this doesn't happen again by flagging for our quality team\n\nCan you tell me specifically what went wrong so I can fix it?`,
        ticketId,
        actions: [{ label: 'Apply 20% Credit', color: '#2DB47A' }, { label: 'Escalate to Manager', color: '#E05454' }],
      };

    default:
      return {
        text: `Thanks for reaching out to ${BRAND_AGENTS[brandId] ?? 'our support team'}! I'm here to help.\n\nI can assist you with:\n• **Order status & tracking**\n• **Returns & refunds**\n• **Warranty & defective items**\n• **Product questions & sizing**\n• **Backorder updates**\n\nWhat can I help you with today?`,
      };
  }
}

// ─── Helper ────────────────────────────────────────────────────────────────────
function fmtUSD(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function renderCSText(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color: 'var(--color-text)', fontWeight: 800 }}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px 12px',
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-surf2)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ ...LABEL }}>{title}</span>
        {sub && <span style={{ fontSize: 11, color: 'var(--color-muted)', fontWeight: 500 }}>{sub}</span>}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CustomerServicePage() {
  const { subco, isConsolidated } = useSubco();
  const [activeTab, setActiveTab] = useState<'overview' | 'refunds' | 'sla' | 'chat'>('overview');

  // Listen for ops-tab CustomEvents from SideNavOps quick links
  useEffect(() => {
    function handleOpsTab(e: Event) {
      const detail = (e as CustomEvent<{ tab: string }>).detail;
      if (detail?.tab) setActiveTab(detail.tab as 'overview' | 'refunds' | 'sla' | 'chat');
    }
    window.addEventListener('ops-tab', handleOpsTab);
    return () => window.removeEventListener('ops-tab', handleOpsTab);
  }, []);

  // CS Chat state
  const [chatBrand, setChatBrand] = useState<string>('any');
  const [chatMessages, setChatMessages] = useState<CSMessage[]>([
    { id: 'init', role: 'agent', text: `Hi there! 👋 Welcome to Meritage Partners Customer Support. I'm your CS agent — I can help with orders, returns, warranty claims, product questions, and more.\n\nSelect a brand above or just type your question below!` },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatTyping, setChatTyping] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const scale = useMemo(() => {
    if (isConsolidated) return 1;
    return subco.annualRevenue / TOTAL_REVENUE;
  }, [isConsolidated, subco.annualRevenue]);

  function sc(n: number) { return Math.round(n * scale); }
  function scf(n: number, dp = 1) { return (n * scale).toFixed(dp); }

  // Scale ticket trend
  const ticketTrend = TICKET_TREND.map((d) => ({
    ...d,
    opened:   sc(d.opened),
    resolved: sc(d.resolved),
  }));

  // Ticket status scaled
  const ticketStatus = TICKET_STATUS.map((s) => ({ ...s, value: sc(s.value) }));

  // Issue types scaled
  const issueTypes = ISSUE_TYPES.map((t) => ({ ...t, count: sc(t.count) }));

  // Channels scaled
  const channels = TICKET_CHANNELS.map((c) => ({ ...c, count: sc(c.count) }));

  // KPIs
  const kpis = [
    {
      label:   'Open Tickets',
      value:   sc(BASE_KPIS.openTickets).toLocaleString(),
      delta:   '+14 vs yesterday',
      dColor:  '#E05454',
      dBg:     'rgba(224,84,84,0.12)',
      accent:  '#1D44BF',
      sub:     'across all brands',
    },
    {
      label:   'Avg First Response',
      value:   `${scf(BASE_KPIS.avgFirstResponseHrs)}h`,
      delta:   'SLA target: 4h',
      dColor:  '#2DB47A',
      dBg:     'rgba(45,180,122,0.12)',
      accent:  '#2DB47A',
      sub:     'rolling 7-day avg',
    },
    {
      label:   'CSAT Score',
      value:   `${BASE_KPIS.csat.toFixed(1)} / 5`,
      delta:   '↓ 0.1 vs last month',
      dColor:  '#E8B84B',
      dBg:     'rgba(245,138,31,0.12)',
      accent:  '#E8B84B',
      sub:     'customer satisfaction',
    },
    {
      label:   'Refund Rate',
      value:   `${BASE_KPIS.refundRate}%`,
      delta:   '↑ 0.4% vs last month',
      dColor:  '#E05454',
      dBg:     'rgba(224,84,84,0.12)',
      accent:  '#E05454',
      sub:     'of orders this month',
    },
    {
      label:   'SLA Compliance',
      value:   `${BASE_KPIS.slaCompliance}%`,
      delta:   'Target: 95%',
      dColor:  '#E8B84B',
      dBg:     'rgba(245,138,31,0.12)',
      accent:  '#E8B84B',
      sub:     'resolved within SLA',
    },
    {
      label:   'Escalation Rate',
      value:   `${BASE_KPIS.escalationRate}%`,
      delta:   '↑ 1.8% vs last month',
      dColor:  '#E05454',
      dBg:     'rgba(224,84,84,0.12)',
      accent:  '#E05454',
      sub:     '% tickets escalated',
    },
  ];

  // Per-subco refund rows
  const refundRows = useMemo(() => {
    if (isConsolidated) {
      return ALL_PORTFOLIO_SUBCOS.map((s, i) => ({
        subco: s,
        color: BRAND_COLORS[i],
        ...BRAND_REFUNDS[i],
      }));
    }
    const idx = ALL_PORTFOLIO_SUBCOS.findIndex((s) => s.id === subco.id);
    if (idx === -1) return [];
    return [{ subco, color: BRAND_COLORS[idx], ...BRAND_REFUNDS[idx] }];
  }, [isConsolidated, subco]);

  // Per-subco SLA rows
  const slaRows = useMemo(() => {
    if (isConsolidated) {
      return ALL_PORTFOLIO_SUBCOS.map((s, i) => ({ subco: s, color: BRAND_COLORS[i], compliance: SLA_BY_BRAND[i] }));
    }
    const idx = ALL_PORTFOLIO_SUBCOS.findIndex((s) => s.id === subco.id);
    if (idx === -1) return [];
    return [{ subco, color: BRAND_COLORS[idx], compliance: SLA_BY_BRAND[idx] }];
  }, [isConsolidated, subco]);

  // Filter tickets to brand if not consolidated
  const visibleTickets = useMemo(() => {
    if (isConsolidated) return ALL_TICKETS;
    return ALL_TICKETS.filter((t) => t.brandMonogram === subco.monogram || t.brandName.toLowerCase().includes(subco.shortName.toLowerCase().slice(0, 4)));
  }, [isConsolidated, subco]);

  // Visible CS flags
  const visibleFlags = useMemo(() => {
    if (isConsolidated) return CS_FLAGS;
    return CS_FLAGS.filter((f) => f.brandMonogram === subco.monogram);
  }, [isConsolidated, subco]);

  const criticalCount = CS_FLAGS.filter((f) => f.severity === 'critical').length;

  useEffect(() => {
    if (chatScrollRef.current) chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
  }, [chatMessages, chatTyping]);

  function sendChatMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setChatInput('');
    const userMsg: CSMessage = { id: Math.random().toString(36).slice(2), role: 'customer', text: trimmed };
    setChatMessages((m) => [...m, userMsg]);
    setChatTyping(true);
    const reply = csReply(trimmed, chatBrand);
    const delay = Math.min(1600, 600 + trimmed.length * 3);
    setTimeout(() => {
      setChatMessages((m) => [
        ...m,
        { id: Math.random().toString(36).slice(2), role: 'agent', text: reply.text, ticketId: reply.ticketId, actions: reply.actions },
      ]);
      setChatTyping(false);
    }, delay);
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'refunds',  label: 'Refunds & Returns' },
    { id: 'sla',      label: 'SLA & CSAT' },
    { id: 'chat',     label: '💬 CS Chat Demo' },
  ] as const;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <div style={{ ...CARD, padding: '22px 26px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ ...LABEL, marginBottom: 6 }}>
              {isConsolidated ? 'Consolidated View' : subco.shortName} · Ops OS
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1, color: 'var(--color-text)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ background: '#1D44BF', color: '#FFFFFF', borderRadius: 5, padding: '3px 9px', fontSize: 14, fontWeight: 900, letterSpacing: '0.02em' }}>
                OPS
              </span>
              <span>Ops OS</span>
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: 'var(--color-muted)', fontWeight: 500, maxWidth: 640, lineHeight: 1.5 }}>
              Tickets, refunds, SLA compliance, CSAT, and inventory-driven issues — across all brands.
              {!isConsolidated && ` Filtered to ${subco.name}.`}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(45,180,122,0.12)', border: '1px solid rgba(45,180,122,0.28)', color: '#2DB47A', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '5px 12px', borderRadius: 5 }}>
              ● Live
            </span>
            {criticalCount > 0 && (
              <span style={{ background: 'rgba(224,84,84,0.12)', border: '1px solid rgba(224,84,84,0.28)', color: '#E05454', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '5px 12px', borderRadius: 5 }}>
                ⚠ {criticalCount} Critical
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginTop: 20, borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: '7px 16px', borderRadius: 6,
                fontSize: 12, fontWeight: 700, letterSpacing: '0.04em',
                cursor: 'pointer', fontFamily: 'inherit', border: 'none',
                background: activeTab === t.id ? 'rgba(27,77,230,0.18)' : 'transparent',
                color: activeTab === t.id ? '#FFFFFF' : 'var(--color-muted)',
                transition: 'background 0.15s, color 0.15s',
                outline: activeTab === t.id ? '1px solid rgba(27,77,230,0.35)' : 'none',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI Strip ───────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {kpis.map((k, i) => (
          <div key={i} style={{ ...CARD, padding: '18px 20px 14px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: k.accent, borderRadius: 'var(--card-radius) var(--card-radius) 0 0' }} />
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 8, marginTop: 4, fontFamily: 'var(--font-condensed)' }}>
              {k.label}
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1, color: 'var(--color-text)', letterSpacing: '-0.02em', marginBottom: 4, fontVariantNumeric: 'tabular-nums' }}>
              {k.value}
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-muted)', marginBottom: 10 }}>{k.sub}</div>
            <span style={{ background: k.dBg, color: k.dColor, fontSize: 10, fontWeight: 700, borderRadius: 3, padding: '2px 7px' }}>
              {k.delta}
            </span>
          </div>
        ))}
      </div>

      {/* ── TAB: OVERVIEW ─────────────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <>
          {/* Ticket Volume Trend + Status Donut */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>

            {/* Area chart */}
            <div style={{ ...CARD, overflow: 'hidden' }}>
              <SectionHeader title="Ticket Volume — 30 Day Trend" sub="opened vs resolved" />
              <div style={{ padding: '20px 16px 12px' }}>
                <div style={{ marginBottom: 8, display: 'flex', gap: 16, paddingLeft: 4 }}>
                  {[{ label: 'Opened', color: '#1D44BF' }, { label: 'Resolved', color: '#2DB47A' }].map((l) => (
                    <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color }} />
                      <span style={{ fontSize: 11, color: 'var(--color-muted)', fontWeight: 600 }}>{l.label}</span>
                    </div>
                  ))}
                </div>
                <ResponsiveContainer width="100%" height={210}>
                  <AreaChart data={ticketTrend} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradOpened" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#1D44BF" stopOpacity={0.30} />
                        <stop offset="95%" stopColor="#1D44BF" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradResolved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#2DB47A" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#2DB47A" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="var(--color-chart-grid)" strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fill: 'var(--color-chart-text)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'var(--color-chart-text)', fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Area type="monotone" dataKey="opened"   stroke="#1D44BF" fill="url(#gradOpened)"   strokeWidth={2} dot={false} />
                    <Area type="monotone" dataKey="resolved" stroke="#2DB47A" fill="url(#gradResolved)" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Status donut */}
            <div style={{ ...CARD, overflow: 'hidden' }}>
              <SectionHeader title="Ticket Status" />
              <div style={{ padding: '16px 16px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={ticketStatus} dataKey="value" nameKey="name" innerRadius={50} outerRadius={78} paddingAngle={3}>
                      {ticketStatus.map((s, i) => <Cell key={i} fill={s.color} />)}
                    </Pie>
                    <Tooltip contentStyle={TOOLTIP_STYLE} formatter={((v: unknown) => [`${v} tickets`, '']) as never} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 7, marginTop: 4 }}>
                  {ticketStatus.map((s) => (
                    <div key={s.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>{s.name}</span>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)', fontVariantNumeric: 'tabular-nums' }}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Open Ticket Queue */}
          <div style={{ ...CARD, overflow: 'hidden' }}>
            <SectionHeader
              title="Open Ticket Queue"
              sub={`— ${visibleTickets.length} tickets${!isConsolidated ? ` (${subco.shortName})` : ''}`}
            />
            <div style={{ overflowX: 'auto' }}>
              {/* Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '110px minmax(120px,1.5fr) 1fr 1fr 90px 110px 110px',
                padding: '8px 20px',
                fontSize: 10, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase',
                color: 'var(--color-muted)', borderBottom: '1px solid var(--color-border)',
                fontFamily: 'var(--font-condensed)', minWidth: 820,
              }}>
                <div>Ticket</div>
                <div>Issue</div>
                <div>Brand</div>
                <div>Channel</div>
                <div style={{ textAlign: 'center' }}>Priority</div>
                <div style={{ textAlign: 'right' }}>Age</div>
                <div style={{ textAlign: 'right' }}>Status</div>
              </div>
              {visibleTickets.length === 0 ? (
                <div style={{ padding: '24px 20px', color: 'var(--color-muted)', fontSize: 13, textAlign: 'center' }}>
                  No open tickets for {subco.shortName}
                </div>
              ) : visibleTickets.map((t, i) => {
                const pri = PRIORITY_CONFIG[t.priority];
                const st  = STATUS_CONFIG[t.status];
                return (
                  <div
                    key={t.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '110px minmax(120px,1.5fr) 1fr 1fr 90px 110px 110px',
                      alignItems: 'center',
                      padding: '12px 20px',
                      borderBottom: i === visibleTickets.length - 1 ? 'none' : '1px solid var(--color-border)',
                      minWidth: 820,
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-muted)', fontVariantNumeric: 'tabular-nums' }}>{t.id}</div>
                    <div style={{ fontSize: 13, color: 'var(--color-text)', fontWeight: 500, paddingRight: 12, lineHeight: 1.3 }}>{t.issue}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{ background: t.brandColor, color: '#FFFFFF', borderRadius: 3, padding: '2px 7px', fontSize: 10, fontWeight: 900 }}>{t.brandMonogram}</span>
                      <span style={{ fontSize: 11, color: 'var(--color-muted)', fontWeight: 500 }}>{t.brandName}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-muted)', fontWeight: 500 }}>{t.channel}</div>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ background: pri.bg, color: pri.color, fontSize: 10, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '2px 8px', borderRadius: 3 }}>
                        {pri.label}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-muted)', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>{t.age}</div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ background: st.bg, color: st.color, fontSize: 10, fontWeight: 800, letterSpacing: '0.06em', padding: '2px 8px', borderRadius: 3 }}>
                        {t.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Issue Types + Channel Mix */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>

            {/* Issue types horizontal bar */}
            <div style={{ ...CARD, overflow: 'hidden' }}>
              <SectionHeader title="Tickets by Issue Type" sub="— this month" />
              <div style={{ padding: '16px 20px 16px 16px' }}>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={issueTypes} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }}>
                    <XAxis type="number" tick={{ fill: 'var(--color-chart-text)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="type" tick={{ fill: 'var(--color-chart-text)', fontSize: 10 }} axisLine={false} tickLine={false} width={170} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} formatter={((v: unknown) => [`${v} tickets`, '']) as never} />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={18} label={{ position: 'right', fill: 'var(--color-chart-text)', fontSize: 10 }}>
                      {issueTypes.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Channel mix donut */}
            <div style={{ ...CARD, overflow: 'hidden' }}>
              <SectionHeader title="Ticket Source" />
              <div style={{ padding: '16px 16px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={channels} dataKey="count" nameKey="channel" innerRadius={40} outerRadius={66} paddingAngle={3}>
                      {channels.map((c, i) => <Cell key={i} fill={c.color} />)}
                    </Pie>
                    <Tooltip contentStyle={TOOLTIP_STYLE} formatter={((v: unknown) => [`${v} tickets`, '']) as never} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 7, marginTop: 4 }}>
                  {channels.map((c) => (
                    <div key={c.channel} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 2, background: c.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>{c.channel}</span>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)', fontVariantNumeric: 'tabular-nums' }}>{c.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CS-Flagged Issues */}
          {visibleFlags.length > 0 && (
            <div style={{ ...CARD, overflow: 'hidden' }}>
              <SectionHeader title="CS-Flagged Issues" sub={`— ${visibleFlags.length} active flags`} />
              <div style={{ padding: '8px 0' }}>
                {visibleFlags.map((f, i) => {
                  const sev = SEVERITY_CONFIG[f.severity];
                  return (
                    <div
                      key={f.id}
                      style={{
                        padding: '16px 20px',
                        borderBottom: i === visibleFlags.length - 1 ? 'none' : '1px solid var(--color-border)',
                        borderLeft: `4px solid ${sev.color}`,
                        display: 'flex', gap: 16, alignItems: 'flex-start',
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span style={{ background: sev.bg, color: sev.color, border: `1px solid ${sev.border}`, fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '2px 8px', borderRadius: 3 }}>
                            {sev.label}
                          </span>
                          <span style={{ background: f.brandColor + '22', border: `1px solid ${f.brandColor}44`, color: f.brandColor, fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 3, letterSpacing: '0.06em' }}>
                            {f.brandMonogram}
                          </span>
                          <span style={{ fontSize: 11, color: 'var(--color-muted)', fontWeight: 500 }}>
                            {f.ticketCount} ticket{f.ticketCount !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>{f.title}</div>
                        <div style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.6 }}>{f.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── TAB: REFUNDS & RETURNS ─────────────────────────────────────────────── */}
      {activeTab === 'refunds' && (
        <>
          {/* Summary KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {[
              { label: 'Total Returns (MTD)',    value: sc(119).toLocaleString(),     color: '#1D44BF', accent: '#1D44BF', sub: 'all brands combined' },
              { label: 'Refund $ (MTD)',          value: fmtUSD(sc(14178)),             color: '#E05454', accent: '#E05454', sub: 'cash returned' },
              { label: 'Avg Return Rate',         value: `${BASE_KPIS.refundRate}%`,    color: '#E8B84B', accent: '#E8B84B', sub: 'of orders this month' },
              { label: 'Defect-Driven Returns',   value: `${sc(82).toLocaleString()}`,  color: '#4FA8FF', accent: '#4FA8FF', sub: '69% of all returns' },
            ].map((k, i) => (
              <div key={i} style={{ ...CARD, padding: '18px 20px 14px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: k.accent, borderRadius: 'var(--card-radius) var(--card-radius) 0 0' }} />
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 8, marginTop: 4, fontFamily: 'var(--font-condensed)' }}>{k.label}</div>
                <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1, color: k.color, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{k.value}</div>
                <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 6 }}>{k.sub}</div>
              </div>
            ))}
          </div>

          {/* Refunds by Brand table */}
          <div style={{ ...CARD, overflow: 'hidden' }}>
            <SectionHeader title="Refunds & Returns by Brand" sub="— month to date" />
            <div style={{ overflowX: 'auto' }}>
              <div style={{
                display: 'grid', gridTemplateColumns: 'minmax(160px, 2fr) 1fr 1fr 1fr 2fr 80px',
                padding: '8px 20px', fontSize: 10, fontWeight: 800, letterSpacing: '0.10em',
                textTransform: 'uppercase', color: 'var(--color-muted)',
                borderBottom: '1px solid var(--color-border)', fontFamily: 'var(--font-condensed)', minWidth: 700,
              }}>
                <div>Brand</div>
                <div style={{ textAlign: 'right' }}>Returns</div>
                <div style={{ textAlign: 'right' }}>Refund $</div>
                <div style={{ textAlign: 'right' }}>Return Rate</div>
                <div>Top Reason</div>
                <div style={{ textAlign: 'center' }}>Trend</div>
              </div>
              {refundRows.map((row, i) => {
                const rateColor = row.returnRate >= 6 ? '#E05454' : row.returnRate >= 4 ? '#E8B84B' : '#2DB47A';
                const trendColor = row.trend === '↑' ? '#E05454' : row.trend === '↓' ? '#2DB47A' : '#E8B84B';
                return (
                  <div
                    key={row.subco.id}
                    style={{
                      display: 'grid', gridTemplateColumns: 'minmax(160px, 2fr) 1fr 1fr 1fr 2fr 80px',
                      alignItems: 'center', padding: '13px 20px',
                      borderBottom: i === refundRows.length - 1 ? 'none' : '1px solid var(--color-border)',
                      minWidth: 700,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ background: row.color, color: '#FFF', borderRadius: 4, padding: '2px 8px', fontSize: 10, fontWeight: 900, minWidth: 36, textAlign: 'center' }}>
                        {row.subco.monogram}
                      </span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.2 }}>{row.subco.shortName}</div>
                        <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 1 }}>{row.subco.products[0]}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      {Math.round(row.returns * scale)}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      {fmtUSD(Math.round(row.refundAmt * scale))}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: rateColor, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      {row.returnRate}%
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-muted)', paddingRight: 12 }}>{row.topReason}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: trendColor, textAlign: 'center' }}>{row.trend}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Return Reason Breakdown chart */}
          <div style={{ ...CARD, overflow: 'hidden' }}>
            <SectionHeader title="Return Reason Breakdown" sub="— all brands combined" />
            <div style={{ padding: '16px 20px 16px 16px' }}>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  layout="vertical"
                  margin={{ top: 0, right: 60, left: 0, bottom: 0 }}
                  data={[
                    { reason: 'Defective / Quality Issue',  pct: 39, color: '#1D44BF' },
                    { reason: 'Backorder / Cancellation',  pct: 26, color: '#FF6B00' },
                    { reason: 'Size / Fit',                pct: 18, color: '#E8B84B' },
                    { reason: 'Wrong Item Sent',           pct: 11, color: '#4FA8FF' },
                    { reason: 'Damaged in Transit',        pct:  6, color: '#9B59B6' },
                  ]}
                >
                  <XAxis type="number" tickFormatter={(v) => `${v}%`} tick={{ fill: 'var(--color-chart-text)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="reason" tick={{ fill: 'var(--color-chart-text)', fontSize: 10 }} axisLine={false} tickLine={false} width={180} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={((v: unknown) => [`${v}%`, 'Share of returns']) as never} />
                  <Bar dataKey="pct" radius={[0, 4, 4, 0]} maxBarSize={20} label={{ position: 'right', fill: 'var(--color-chart-text)', fontSize: 10, formatter: ((v: unknown) => `${v}%`) as never }}>
                    {[0,1,2,3,4].map((i) => (
                      <Cell key={i} fill={['#1D44BF','#FF6B00','#E8B84B','#4FA8FF','#9B59B6'][i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* ── TAB: CS CHAT DEMO ─────────────────────────────────────────────────── */}
      {activeTab === 'chat' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Context banner */}
          <div style={{ ...CARD, padding: '18px 22px', background: 'linear-gradient(135deg, rgba(27,77,230,0.10), rgba(245,138,31,0.04))', borderColor: 'rgba(27,77,230,0.28)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#E8B84B', marginBottom: 6 }}>Demo Mode — Customer Perspective</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.01em', marginBottom: 6 }}>Chat as a customer · See how the CS agent responds</div>
            <div style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.6, maxWidth: 760 }}>
              Select a brand below, pick a scenario or type your own message. The AI CS agent knows your product catalog, current known issues (glove lacing defects, cleat backorders, etc.), and can handle returns, warranty claims, order status, and more.
            </div>
          </div>

          {/* Brand selector + suggested prompts */}
          <div style={{ ...CARD, padding: '18px 22px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>Contacting:</div>
              {(['any', ...ALL_PORTFOLIO_SUBCOS.map((s) => s.id)] as string[]).map((id) => {
                const s = ALL_PORTFOLIO_SUBCOS.find((x) => x.id === id);
                const label = s ? s.shortName : 'Any Brand';
                const color = s ? s.colors.primary : '#1D44BF';
                const active = chatBrand === id;
                return (
                  <button
                    key={id}
                    onClick={() => {
                      setChatBrand(id);
                      setChatMessages([{ id: 'init-' + id, role: 'agent', text: `Hi there! 👋 You're chatting with ${BRAND_AGENTS[id] ?? 'Meritage Partners'} support. How can I help you today?` }]);
                    }}
                    style={{
                      padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 700,
                      cursor: 'pointer', fontFamily: 'inherit', border: 'none',
                      background: active ? color : 'var(--color-surf2)',
                      color: active ? '#FFFFFF' : 'var(--color-muted)',
                      outline: active ? `1px solid ${color}` : 'none',
                      transition: 'background 0.15s, color 0.15s',
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 8 }}>Try a scenario:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {(CS_SUGGESTED_PROMPTS[chatBrand] ?? CS_SUGGESTED_PROMPTS['any']).map((p) => (
                <button
                  key={p}
                  onClick={() => sendChatMessage(p)}
                  style={{
                    fontSize: 12, color: 'var(--color-text)',
                    background: 'var(--color-surf2)', border: '1px solid var(--color-border)',
                    borderRadius: 999, padding: '5px 12px',
                    cursor: 'pointer', fontFamily: 'inherit', transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#1D44BF'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)'; }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Chat window */}
          <div style={{ ...CARD, display: 'flex', flexDirection: 'column', minHeight: 480 }}>
            {/* Chat header */}
            <div style={{ padding: '14px 20px 12px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#E8B84B', marginBottom: 3 }}>CS Agent</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-text)' }}>
                  {BRAND_AGENTS[chatBrand] ?? 'Meritage Partners Support'}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#2DB47A', boxShadow: '0 0 6px rgba(45,180,122,0.6)' }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#2DB47A' }}>Online · Avg reply &lt;2 min</span>
              </div>
            </div>

            {/* Messages */}
            <div ref={chatScrollRef} style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 560 }}>
              {chatMessages.map((msg) => {
                const isCustomer = msg.role === 'customer';
                return (
                  <div key={msg.id} style={{ display: 'flex', justifyContent: isCustomer ? 'flex-end' : 'flex-start' }}>
                    <div style={{ maxWidth: '82%' }}>
                      {!isCustomer && (
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#E8B84B', marginBottom: 4 }}>
                          CS Agent
                        </div>
                      )}
                      <div style={{
                        background: isCustomer ? 'rgba(27,77,230,0.15)' : 'var(--color-surf2)',
                        border: isCustomer ? '1px solid rgba(27,77,230,0.28)' : '1px solid var(--color-border)',
                        borderRadius: 10, padding: '12px 14px',
                        fontSize: 13, lineHeight: 1.6, color: 'var(--color-text)',
                        whiteSpace: 'pre-wrap',
                      }}>
                        {renderCSText(msg.text)}
                      </div>
                      {msg.ticketId && (
                        <div style={{ marginTop: 6, fontSize: 11, color: '#2DB47A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
                          <span>✓</span>
                          <span>Ticket {msg.ticketId} created</span>
                        </div>
                      )}
                      {msg.actions && msg.actions.length > 0 && (
                        <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {msg.actions.map((a) => (
                            <button
                              key={a.label}
                              style={{
                                padding: '5px 12px', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
                                background: a.color + '1A', color: a.color, border: `1px solid ${a.color}44`,
                                borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit',
                              }}
                            >
                              {a.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {chatTyping && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ background: 'var(--color-surf2)', border: '1px solid var(--color-border)', borderRadius: 10, padding: '14px 16px', display: 'flex', gap: 5 }}>
                    <style>{`@keyframes cs-dot { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }`}</style>
                    {[0, 1, 2].map((i) => (
                      <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#1D44BF', display: 'inline-block', animation: `cs-dot 1.2s ${i * 0.15}s infinite ease-in-out` }} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); sendChatMessage(chatInput); }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px 18px', borderTop: '1px solid var(--color-border)' }}
            >
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your message as a customer…"
                style={{
                  flex: 1, padding: '10px 14px',
                  background: 'var(--color-surf2)', border: '1px solid var(--color-border)',
                  borderRadius: 8, color: 'var(--color-text)', fontSize: 14, fontFamily: 'inherit', outline: 'none',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#1D44BF'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || chatTyping}
                style={{
                  padding: '10px 16px', background: '#1D44BF', color: '#FFFFFF',
                  border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
                  cursor: chatInput.trim() && !chatTyping ? 'pointer' : 'not-allowed',
                  opacity: chatInput.trim() && !chatTyping ? 1 : 0.5,
                  fontFamily: 'inherit', transition: 'opacity 0.15s',
                }}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── TAB: SLA & CSAT ───────────────────────────────────────────────────── */}
      {activeTab === 'sla' && (
        <>
          {/* SLA by brand + CSAT trend side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

            {/* SLA by brand */}
            <div style={{ ...CARD, overflow: 'hidden' }}>
              <SectionHeader title="SLA Compliance by Brand" sub="— target: 95%" />
              <div style={{ padding: '16px 20px' }}>
                {slaRows.map((row) => {
                  const barColor = row.compliance >= 93 ? '#2DB47A' : row.compliance >= 80 ? '#E8B84B' : '#E05454';
                  return (
                    <div key={row.subco.id} style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ background: row.color, color: '#FFF', borderRadius: 3, padding: '2px 7px', fontSize: 10, fontWeight: 900, minWidth: 34, textAlign: 'center' }}>
                            {row.subco.monogram}
                          </span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>{row.subco.shortName}</span>
                        </div>
                        <span style={{ fontSize: 15, fontWeight: 800, color: barColor, fontVariantNumeric: 'tabular-nums' }}>{row.compliance}%</span>
                      </div>
                      <div style={{ height: 8, background: 'var(--color-surf3)', borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{ width: `${row.compliance}%`, height: '100%', background: barColor, borderRadius: 999, transition: 'width 0.4s' }} />
                      </div>
                      {/* Target line marker at 95% */}
                      <div style={{ position: 'relative', height: 4 }}>
                        <div style={{ position: 'absolute', left: '95%', top: -10, width: 1, height: 16, background: 'rgba(255,255,255,0.25)' }} />
                        <span style={{ position: 'absolute', left: '93%', top: 2, fontSize: 9, color: 'var(--color-chart-text)', fontWeight: 600 }}>95%</span>
                      </div>
                    </div>
                  );
                })}

                {/* Aggregate SLA metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8, paddingTop: 16, borderTop: '1px solid var(--color-border)' }}>
                  {[
                    { label: 'Avg Response Time', value: `${scf(BASE_KPIS.avgFirstResponseHrs)}h`, color: '#4FA8FF' },
                    { label: 'Within 24h',         value: '92%',                                    color: '#2DB47A' },
                    { label: 'Avg Resolution Time',value: '11.2h',                                  color: '#E8B84B' },
                    { label: 'Reopened Tickets',   value: `${sc(18)}`,                              color: '#E8B84B' },
                  ].map((m) => (
                    <div key={m.label} style={{ background: 'var(--color-surf2)', borderRadius: 8, padding: '14px 16px' }}>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 6, fontFamily: 'var(--font-condensed)' }}>{m.label}</div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: m.color, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>{m.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CSAT trend + agent metrics */}
            <div style={{ ...CARD, overflow: 'hidden' }}>
              <SectionHeader title="CSAT Trend" sub="— 6 months" />
              <div style={{ padding: '16px 16px 8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 36, fontWeight: 900, color: '#E8B84B', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                    {BASE_KPIS.csat.toFixed(1)}
                  </span>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--color-muted)', fontWeight: 600 }}>/ 5.0 rating</div>
                    <div style={{ fontSize: 11, color: '#E05454', fontWeight: 600 }}>↓ 0.1 vs last month</div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={CSAT_TREND} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="var(--color-chart-grid)" strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fill: 'var(--color-chart-text)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[3.8, 5.0]} tick={{ fill: 'var(--color-chart-text)', fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} formatter={((v: unknown) => [`${v} / 5.0`, 'CSAT']) as never} />
                    <Line type="monotone" dataKey="csat" stroke="#E8B84B" strokeWidth={2.5} dot={{ fill: '#E8B84B', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>

                {/* Agent performance */}
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 12, fontFamily: 'var(--font-condensed)' }}>
                    Agent Performance (MTD)
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { name: 'Jasmine T.', tickets: 142, csat: 4.7, avgRes: '7.2h' },
                      { name: 'Marco R.',   tickets: 118, csat: 4.4, avgRes: '9.8h' },
                      { name: 'Priya N.',   tickets: 103, csat: 4.6, avgRes: '8.1h' },
                      { name: 'Devon K.',   tickets:  89, csat: 4.1, avgRes: '13.4h' },
                    ].map((a) => (
                      <div key={a.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border)' }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)', flex: 1 }}>{a.name}</span>
                        <span style={{ fontSize: 11, color: 'var(--color-muted)', width: 60, textAlign: 'right' }}>{a.tickets} tickets</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#E8B84B', width: 48, textAlign: 'right' }}>{a.csat}/5</span>
                        <span style={{ fontSize: 11, color: 'var(--color-muted)', width: 56, textAlign: 'right' }}>{a.avgRes}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resolution time by issue type */}
          <div style={{ ...CARD, overflow: 'hidden' }}>
            <SectionHeader title="Avg Resolution Time by Issue Type" sub="— current month" />
            <div style={{ padding: '16px 20px 16px 16px' }}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  layout="vertical"
                  margin={{ top: 0, right: 60, left: 0, bottom: 0 }}
                  data={[
                    { type: 'Backorder / Stockout',     hours: 28.4, color: '#9B59B6' },
                    { type: 'Defective / Damaged',      hours: 18.7, color: '#1D44BF' },
                    { type: 'Wrong Item Sent',           hours: 12.1, color: '#E8B84B' },
                    { type: 'Refund / Return Request',  hours: 10.2, color: '#4FA8FF' },
                    { type: 'Late / Missing Shipment',  hours:  8.4, color: '#FF6B00' },
                    { type: 'Size / Fit',               hours:  6.8, color: '#2DB47A' },
                    { type: 'Product Question',         hours:  2.1, color: '#41B6E6' },
                  ]}
                >
                  <XAxis type="number" tickFormatter={(v) => `${v}h`} tick={{ fill: 'var(--color-chart-text)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="type" tick={{ fill: 'var(--color-chart-text)', fontSize: 10 }} axisLine={false} tickLine={false} width={180} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={((v: unknown) => [`${v}h avg`, 'Resolution time']) as never} />
                  <Bar dataKey="hours" radius={[0, 4, 4, 0]} maxBarSize={18} label={{ position: 'right', fill: 'var(--color-chart-text)', fontSize: 10, formatter: ((v: unknown) => `${v}h`) as never }}>
                    {[0,1,2,3,4,5,6].map((i) => (
                      <Cell key={i} fill={['#9B59B6','#1D44BF','#E8B84B','#4FA8FF','#FF6B00','#2DB47A','#41B6E6'][i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
