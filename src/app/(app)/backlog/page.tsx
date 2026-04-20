'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// ─── Types ────────────────────────────────────────────────────────────────────

type Priority    = 'Critical' | 'High' | 'Medium' | 'Low';
type Status      = 'Overdue' | 'In Progress' | 'Blocked' | 'New' | 'Resolved';
type Category    = 'Revenue' | 'Collections' | 'Operations' | 'Finance' | 'Legal' | 'Procurement';
type ActionPhase = 'Immediate' | 'This Week' | 'This Month' | 'Next Quarter';

interface BacklogItem {
  id:           string;
  title:        string;
  description:  string;
  category:     Category;
  priority:     Priority;
  status:       Status;
  owner:        string;
  dueDate:      string;
  agingDays:    number;
  impact$:      number;       // dollar at risk / opportunity
  impactLabel:  string;       // e.g. "Revenue at risk"
  actionPhase:  ActionPhase;
  actions:      string[];     // recommended steps
  blockers?:    string;
}

// ─── Demo Backlog Data ────────────────────────────────────────────────────────

const BACKLOG: BacklogItem[] = [
  {
    id: 'B001',
    title: 'Apex-Wexler Contract Renewal Unsigned',
    description: 'Master supply agreement with Wexler Distribution (our #2 revenue account) expired Oct 1. Currently operating on expired terms. 60-day window before they can renegotiate pricing.',
    category: 'Legal',
    priority: 'Critical',
    status: 'Overdue',
    owner: 'Sarah Chen',
    dueDate: '2026-10-15',
    agingDays: 16,
    impact$: 480000,
    impactLabel: 'Annual contract value at risk',
    actionPhase: 'Immediate',
    actions: [
      'Legal to redline revised MSA — target same pricing + 2-year lock',
      'Schedule executive call with Wexler VP Procurement this week',
      'Prepare pricing concession fallback: max 3% discount to retain 2-year term',
      'Get signed LOI by Oct 22 to stop clock on renegotiation window',
    ],
    blockers: 'Legal counsel vacation until Oct 21 — escalate to outside counsel',
  },
  {
    id: 'B002',
    title: 'AR Aging: 4 Invoices 90+ Days Outstanding',
    description: 'Four accounts have invoices past 90 days totaling $127,400. Hartwell Group ($58K) and Peak Supply ($41K) are the two largest. Internal collections attempts made but no response in 3 weeks.',
    category: 'Collections',
    priority: 'Critical',
    status: 'Overdue',
    owner: 'Mike Torres',
    dueDate: '2026-10-10',
    agingDays: 21,
    impact$: 127400,
    impactLabel: 'Cash at risk (90+ day AR)',
    actionPhase: 'Immediate',
    actions: [
      'Escalate Hartwell Group to VP Sales for executive-level outreach by Oct 22',
      'Issue formal demand letter to Peak Supply — 10-day cure period before collections',
      'Engage factoring facility for Hartwell ($58K) — immediate 85% advance available',
      'Place all 4 accounts on credit hold until balances resolved',
      'Weekly CEO/CFO review until fully collected',
    ],
  },
  {
    id: 'B003',
    title: 'Altitude Creative Invoice Not Matched to PO',
    description: '$18,000 marketing invoice from Altitude Creative (Oct campaign) submitted without an approved PO. Spend not in budget. Requires executive approval before payment.',
    category: 'Finance',
    priority: 'High',
    status: 'Blocked',
    owner: 'Jordan Lee',
    dueDate: '2026-10-28',
    agingDays: 9,
    impact$: 18000,
    impactLabel: 'Unbudgeted spend pending approval',
    actionPhase: 'This Week',
    actions: [
      'Request campaign performance data from Altitude Creative to justify invoice',
      'CMO to approve or reject spend within 48 hours',
      'If approved: retroactively create PO and reclassify to Q4 marketing budget',
      'If rejected: negotiate partial payment or defer to Q4 contingency',
      'Implement PO-required policy for all vendor spend >$5K going forward',
    ],
    blockers: 'CMO approval pending — CMO OOO until Oct 23',
  },
  {
    id: 'B004',
    title: 'WestCoast Influencers: $13K Unreconciled',
    description: 'WestCoast Influencer Network invoice for $13,000 cannot be matched to an approved campaign brief or signed influencer agreement. May be duplicate or unauthorized.',
    category: 'Finance',
    priority: 'High',
    status: 'In Progress',
    owner: 'Jordan Lee',
    dueDate: '2026-10-25',
    agingDays: 6,
    impact$: 13000,
    impactLabel: 'Potentially unauthorized spend',
    actionPhase: 'This Week',
    actions: [
      'Audit all influencer contracts — confirm WestCoast is an authorized vendor',
      'Request campaign brief and deliverables from marketing team',
      'Do not pay until vendor contract and campaign deliverables confirmed',
      'If unauthorized: dispute invoice and document for compliance file',
    ],
  },
  {
    id: 'B005',
    title: 'Salesforce Enterprise Renewal: Nov 1 Deadline',
    description: 'Salesforce Enterprise contract renews Nov 1 at $22,000/year. Auto-renews if no action taken. Opportunity to downgrade to Professional tier ($14K) given current 40% seat utilization.',
    category: 'Procurement',
    priority: 'High',
    status: 'New',
    owner: 'Alex Rivera',
    dueDate: '2026-10-28',
    agingDays: 3,
    impact$: 8000,
    impactLabel: 'Annual savings opportunity',
    actionPhase: 'This Week',
    actions: [
      'IT to audit active Salesforce seat usage — identify unused licenses',
      'Get downgrade quote from Salesforce AE for Professional + 60% of seats',
      'If utilization <50%: downgrade to Professional — save $8K/year',
      'Negotiate multi-year pricing lock regardless of tier decision',
      'Deadline: must notify Salesforce by Oct 28 to avoid auto-renewal',
    ],
  },
  {
    id: 'B006',
    title: 'Q3 Federal Tax Estimated Payment Unconfirmed',
    description: 'Q3 estimated federal tax payment ($31,200) was scheduled for Sept 15. Bank records show ACH initiation but no IRS confirmation received. Risk of late payment penalty.',
    category: 'Finance',
    priority: 'High',
    status: 'Blocked',
    owner: 'Sarah Chen',
    dueDate: '2026-10-22',
    agingDays: 7,
    impact$: 31200,
    impactLabel: 'Potential underpayment penalty exposure',
    actionPhase: 'Immediate',
    actions: [
      'Call IRS Business Tax Line to confirm payment received (1-800-829-4933)',
      'Retrieve ACH trace number from bank and cross-reference with IRS',
      'If not received: resubmit immediately and document for penalty abatement request',
      'Engage CPA to file penalty waiver if payment missed',
    ],
    blockers: 'IRS confirmation can take 3-5 business days — initiate trace now',
  },
  {
    id: 'B007',
    title: 'ShipBob Rate Card Not Updated in ERP',
    description: 'New ShipBob fulfillment agreement (effective Oct 1) reduces per-unit cost by $0.34. ERP still billing at old rate. Creates ~$14K/month overstatement in COGS. Financial statements overstated.',
    category: 'Operations',
    priority: 'High',
    status: 'In Progress',
    owner: 'Alex Rivera',
    dueDate: '2026-10-31',
    agingDays: 14,
    impact$: 14000,
    impactLabel: 'Monthly COGS overstatement',
    actionPhase: 'This Week',
    actions: [
      'IT to update ShipBob rate card in NetSuite/ERP — effective Oct 1',
      'Reprocess October COGS transactions at corrected rate',
      'Issue corrected financial statements for Oct reporting package',
      'Confirm with ShipBob that new rate applies to all SKUs — request updated rate card PDF',
      'Set calendar reminder for Nov 1 to verify new rates auto-applied',
    ],
  },
  {
    id: 'B008',
    title: 'Product Line C: Margin Below Threshold',
    description: 'Product Line C gross margin running at 28.4% vs. 38% threshold — $47K revenue with only $13.4K gross profit. Three consecutive months below threshold triggers product review per policy.',
    category: 'Revenue',
    priority: 'Medium',
    status: 'New',
    owner: 'Sarah Chen',
    dueDate: '2026-11-15',
    agingDays: 0,
    impact$: 47000,
    impactLabel: 'Revenue line under performance review',
    actionPhase: 'This Month',
    actions: [
      'Product team to present margin improvement plan by Nov 1',
      'Options: price increase (+12%), COGS reduction (new supplier RFP), or product discontinuation',
      'Model all three scenarios with 12-month P&L impact',
      'Present to board with recommendation at Nov board meeting',
    ],
  },
  {
    id: 'B009',
    title: 'Q4 Budget Variance Reforecast Not Started',
    description: 'October actuals show material variance from Q4 budget (marketing +38%, COGS –2%). Board expects reforecast at Nov meeting. Work has not started.',
    category: 'Finance',
    priority: 'Medium',
    status: 'New',
    owner: 'Jordan Lee',
    dueDate: '2026-11-10',
    agingDays: 0,
    impact$: 0,
    impactLabel: 'Board deliverable due Nov 10',
    actionPhase: 'This Month',
    actions: [
      'Finance to pull October actuals by cost center — complete by Oct 25',
      'Update driver model with revised assumptions: marketing $124K/mo, COGS at new ShipBob rate',
      'Prepare Nov–Dec revenue sensitivity: base / upside / downside',
      'Circulate draft reforecast to CEO/CFO by Nov 5 for review',
      'Finalize for board pack by Nov 8',
    ],
  },
  {
    id: 'B010',
    title: 'ISO Certification Renewal: 47 Days Remaining',
    description: 'ISO 9001:2015 certification expires Dec 7. Renewal audit requires 8-week preparation. Pre-audit documentation review not scheduled.',
    category: 'Operations',
    priority: 'Medium',
    status: 'New',
    owner: 'Mike Torres',
    dueDate: '2026-12-07',
    agingDays: 0,
    impact$: 0,
    impactLabel: 'Key customer compliance requirement',
    actionPhase: 'This Month',
    actions: [
      'Schedule pre-audit internal review with quality team — target Oct 28',
      'Identify documentation gaps from last certification cycle',
      'Book external auditor for mid-November pre-assessment',
      'Confirm 4 key customer contracts that require ISO certification — alert if at risk',
    ],
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const PRIORITY_META: Record<Priority, { color: string; bg: string; order: number }> = {
  Critical: { color: '#DC2626', bg: 'rgba(220,38,38,0.09)',   order: 0 },
  High:     { color: '#D97706', bg: 'rgba(217,119,6,0.09)',   order: 1 },
  Medium:   { color: '#1D44BF', bg: 'rgba(29,68,191,0.09)',   order: 2 },
  Low:      { color: '#6B7280', bg: 'rgba(107,114,128,0.08)', order: 3 },
};

const STATUS_META: Record<Status, { color: string; bg: string }> = {
  Overdue:     { color: '#DC2626', bg: 'rgba(220,38,38,0.08)'   },
  Blocked:     { color: '#D97706', bg: 'rgba(217,119,6,0.08)'   },
  'In Progress':{ color: '#1D44BF', bg: 'rgba(29,68,191,0.08)'  },
  New:         { color: '#6B7280', bg: 'rgba(107,114,128,0.07)' },
  Resolved:    { color: '#059669', bg: 'rgba(5,150,105,0.08)'   },
};

const PHASE_META: Record<ActionPhase, { color: string; label: string }> = {
  'Immediate':    { color: '#DC2626', label: 'Act Now' },
  'This Week':    { color: '#D97706', label: 'This Week' },
  'This Month':   { color: '#1D44BF', label: 'This Month' },
  'Next Quarter': { color: '#6B7280', label: 'Next Quarter' },
};

const CATEGORIES: Category[] = ['Revenue', 'Collections', 'Operations', 'Finance', 'Legal', 'Procurement'];

const CARD: React.CSSProperties = {
  background: '#FFFFFF',
  borderRadius: 'var(--card-radius)',
  boxShadow: 'var(--card-shadow)',
  border: '1px solid rgba(0,0,0,0.08)',
};

function fmt$(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BacklogPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<Category | 'All'>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [view, setView] = useState<'items' | 'plan'>('items');

  const filtered = BACKLOG
    .filter((b) => filter === 'All' || b.category === filter)
    .sort((a, b) => PRIORITY_META[a.priority].order - PRIORITY_META[b.priority].order);

  const critical   = BACKLOG.filter((b) => b.priority === 'Critical');
  const totalRisk$ = BACKLOG.filter((b) => b.impact$ > 0).reduce((s, b) => s + b.impact$, 0);
  const overdue    = BACKLOG.filter((b) => b.status === 'Overdue');
  const blocked    = BACKLOG.filter((b) => b.status === 'Blocked');

  const byPhase = (phase: ActionPhase) => BACKLOG.filter((b) => b.actionPhase === phase);

  return (
    <div className="flex flex-col gap-5">

      {/* ── Header ── */}
      <div style={{ ...CARD, padding: '22px 26px' }}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#6B7280', marginBottom: 6 }}>
              Operations · October 2026
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1, color: '#1A1C2E', letterSpacing: '-0.02em' }}>
              Ops Backlog
            </div>
            <div style={{ fontSize: 14, color: '#6B7280', marginTop: 6 }}>
              {BACKLOG.length} open items · AI-driven action plan · Updated Oct 21, 2026
            </div>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {critical.length > 0 && (
              <span style={{ background: 'rgba(220,38,38,0.09)', border: '1px solid rgba(220,38,38,0.20)', color: '#DC2626', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', padding: '5px 14px', borderRadius: 5 }}>
                ⚠ {critical.length} Critical
              </span>
            )}
            <span style={{ background: 'rgba(232,184,75,0.12)', border: '1px solid rgba(232,184,75,0.30)', color: '#C9962A', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', padding: '5px 14px', borderRadius: 5 }}>
              {fmt$(totalRisk$)} at risk
            </span>
          </div>
        </div>
      </div>

      {/* ── KPI Strip ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Items',     value: BACKLOG.length.toString(),  color: '#1A1C2E', accent: '#1D44BF', href: null },
          { label: 'Overdue',         value: overdue.length.toString(),  color: '#DC2626', accent: '#DC2626', href: null },
          { label: 'Blocked',         value: blocked.length.toString(),  color: '#D97706', accent: '#D97706', href: null },
          { label: 'Total $ at Risk', value: fmt$(totalRisk$),           color: '#1A1C2E', accent: 'var(--color-gold)', href: null },
        ].map((m) => (
          <div key={m.label} style={{ ...CARD, padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: m.accent }} />
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#6B7280', marginBottom: 8, marginTop: 4 }}>
              {m.label}
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1, color: m.color, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
              {m.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── View Toggle ── */}
      <div className="flex gap-2">
        {(['items', 'plan'] as const).map((v) => (
          <button key={v} onClick={() => setView(v)} style={{
            padding: '8px 20px', fontSize: 13, fontWeight: 700, letterSpacing: '0.04em',
            textTransform: 'uppercase', borderRadius: 6, cursor: 'pointer',
            background: view === v ? '#1D44BF' : '#FFFFFF',
            color: view === v ? '#FFFFFF' : '#6B7280',
            border: `1px solid ${view === v ? '#1D44BF' : 'rgba(0,0,0,0.10)'}`,
            transition: 'all 0.14s',
          }}>
            {v === 'items' ? '☰ All Items' : '→ Action Plan'}
          </button>
        ))}
      </div>

      {/* ── ITEMS VIEW ── */}
      {view === 'items' && (
        <>
          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            {(['All', ...CATEGORIES] as const).map((cat) => (
              <button key={cat} onClick={() => setFilter(cat)} style={{
                padding: '5px 14px', fontSize: 12, fontWeight: 600, borderRadius: 5, cursor: 'pointer',
                background: filter === cat ? '#1A1C2E' : '#FFFFFF',
                color: filter === cat ? '#FFFFFF' : '#6B7280',
                border: `1px solid ${filter === cat ? '#1A1C2E' : 'rgba(0,0,0,0.10)'}`,
              }}>
                {cat}
                <span style={{ marginLeft: 6, fontSize: 10, opacity: 0.65 }}>
                  {cat === 'All' ? BACKLOG.length : BACKLOG.filter((b) => b.category === cat).length}
                </span>
              </button>
            ))}
          </div>

          {/* Backlog items */}
          <div className="flex flex-col gap-3">
            {filtered.map((item) => {
              const pm = PRIORITY_META[item.priority];
              const sm = STATUS_META[item.status];
              const isOpen = expandedId === item.id;
              const due = new Date(item.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              return (
                <div
                  key={item.id}
                  style={{
                    ...CARD,
                    borderLeft: `4px solid ${pm.color}`,
                    cursor: 'pointer',
                    transition: 'box-shadow 0.15s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--card-shadow-hover)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--card-shadow)'; }}
                >
                  {/* Item header row */}
                  <div
                    className="flex flex-wrap items-start gap-3 p-4"
                    onClick={() => setExpandedId(isOpen ? null : item.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.06em' }}>
                          {item.id}
                        </span>
                        <span style={{ background: pm.bg, color: pm.color, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {item.priority}
                        </span>
                        <span style={{ background: sm.bg, color: sm.color, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {item.status}
                        </span>
                        <span style={{ background: 'rgba(0,0,0,0.05)', color: '#6B7280', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 3 }}>
                          {item.category}
                        </span>
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1C2E', lineHeight: 1.3 }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4, lineHeight: 1.5 }}>
                        {item.description}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 flex-shrink-0 text-right">
                      {item.impact$ > 0 && (
                        <div>
                          <div style={{ fontSize: 20, fontWeight: 800, color: pm.color, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                            {fmt$(item.impact$)}
                          </div>
                          <div style={{ fontSize: 11, color: '#9CA3AF' }}>{item.impactLabel}</div>
                        </div>
                      )}
                      <div style={{ fontSize: 12, color: '#6B7280' }}>
                        Owner: <strong style={{ color: '#1A1C2E' }}>{item.owner}</strong>
                      </div>
                      <div style={{ fontSize: 12, color: item.status === 'Overdue' ? '#DC2626' : '#6B7280' }}>
                        Due: <strong>{due}</strong>
                        {item.agingDays > 0 && <span style={{ color: '#DC2626' }}> · {item.agingDays}d overdue</span>}
                      </div>
                      <div style={{ fontSize: 13, color: '#6B7280' }}>{isOpen ? '▲' : '▼'} Actions</div>
                    </div>
                  </div>

                  {/* Expanded action plan */}
                  {isOpen && (
                    <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', background: '#FAFAFA', padding: '16px 20px 20px' }}>
                      {item.blockers && (
                        <div style={{
                          background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.20)',
                          borderRadius: 6, padding: '10px 14px', marginBottom: 14,
                        }}>
                          <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#D97706' }}>⚠ Blocker — </span>
                          <span style={{ fontSize: 13, color: '#92400E' }}>{item.blockers}</span>
                        </div>
                      )}

                      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: PHASE_META[item.actionPhase].color, marginBottom: 10 }}>
                        {PHASE_META[item.actionPhase].label} — Recommended Actions
                      </div>

                      <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {item.actions.map((action, i) => (
                          <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                            <span style={{
                              width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                              background: PHASE_META[item.actionPhase].color,
                              color: '#FFFFFF', fontSize: 11, fontWeight: 800,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>{i + 1}</span>
                            <span style={{ fontSize: 14, color: '#374151', lineHeight: 1.5 }}>{action}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── ACTION PLAN VIEW ── */}
      {view === 'plan' && (
        <div className="flex flex-col gap-5">
          {/* AI Summary */}
          <div style={{ ...CARD, borderLeft: '4px solid #1D44BF', padding: '20px 24px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#1D44BF', marginBottom: 12 }}>
              AI CFO Summary — October 2026 — Ops Backlog
            </div>
            <div style={{ fontSize: 15, color: '#374151', lineHeight: 1.65 }}>
              You have <strong>10 open backlog items</strong> requiring structured resolution. The most urgent exposure is <strong>{fmt$(totalRisk$)}</strong> in combined financial risk — primarily from the Wexler contract ($480K ARR), 90-day AR ($127K), and unconfirmed Q3 tax payment ($31K).
            </div>
            <div style={{ fontSize: 15, color: '#374151', lineHeight: 1.65, marginTop: 10 }}>
              Two items are on hard deadlines in the next 7 days: the Salesforce renewal must be actioned by Oct 28 to avoid auto-renewal, and the Altitude Creative invoice needs CMO sign-off. The ShipBob ERP update is inflating COGS by $14K/month — this should be corrected before October closes.
            </div>
            <div style={{ fontSize: 15, color: '#374151', lineHeight: 1.65, marginTop: 10 }}>
              <strong>Recommended sequencing:</strong> (1) Legal — Wexler contract now. (2) Finance — IRS tax confirmation + ShipBob ERP fix this week. (3) Collections — Hartwell + Peak escalation this week. (4) Procurement — Salesforce renewal by Oct 28. (5) Operations — ISO prep begins this month.
            </div>
          </div>

          {/* Phase cards */}
          {(['Immediate', 'This Week', 'This Month', 'Next Quarter'] as ActionPhase[]).map((phase) => {
            const items = byPhase(phase);
            if (items.length === 0) return null;
            const meta = PHASE_META[phase];
            return (
              <div key={phase} style={{ ...CARD, overflow: 'hidden' }}>
                <div style={{
                  background: meta.color, padding: '10px 20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <span style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#FFFFFF' }}>
                    {meta.label}
                  </span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>
                    {items.length} item{items.length > 1 ? 's' : ''}
                  </span>
                </div>

                {items.map((item, idx) => {
                  const pm = PRIORITY_META[item.priority];
                  return (
                    <div
                      key={item.id}
                      style={{
                        padding: '16px 20px',
                        borderBottom: idx < items.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                        cursor: 'pointer',
                      }}
                      onClick={() => { setView('items'); setExpandedId(item.id); }}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span style={{ background: pm.bg, color: pm.color, fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 3, textTransform: 'uppercase' }}>
                              {item.priority}
                            </span>
                            <span style={{ fontSize: 11, color: '#9CA3AF' }}>{item.category}</span>
                          </div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1C2E', marginBottom: 6 }}>{item.title}</div>
                          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {item.actions.slice(0, 2).map((a, i) => (
                              <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                                <span style={{ color: meta.color, fontWeight: 800, fontSize: 12, flexShrink: 0 }}>{i + 1}.</span>
                                <span style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>{a}</span>
                              </li>
                            ))}
                            {item.actions.length > 2 && (
                              <li style={{ fontSize: 12, color: '#1D44BF', fontWeight: 600, paddingLeft: 18 }}>
                                +{item.actions.length - 2} more steps — click to expand
                              </li>
                            )}
                          </ol>
                        </div>
                        {item.impact$ > 0 && (
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{ fontSize: 18, fontWeight: 800, color: pm.color, fontVariantNumeric: 'tabular-nums' }}>
                              {fmt$(item.impact$)}
                            </div>
                            <div style={{ fontSize: 11, color: '#9CA3AF' }}>{item.impactLabel}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* Category breakdown */}
          <div style={{ ...CARD, padding: '20px 24px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#6B7280', marginBottom: 16 }}>
              Items by Category
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {CATEGORIES.map((cat) => {
                const items = BACKLOG.filter((b) => b.category === cat);
                const criticals = items.filter((b) => b.priority === 'Critical').length;
                if (items.length === 0) return null;
                return (
                  <div key={cat}
                    onClick={() => { setView('items'); setFilter(cat); }}
                    style={{
                      padding: '14px 16px', background: '#F8F8FA', borderRadius: 8,
                      border: '1px solid rgba(0,0,0,0.07)', cursor: 'pointer',
                      transition: 'box-shadow 0.14s',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--card-shadow)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#1A1C2E', marginBottom: 4 }}>{cat}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#1D44BF', lineHeight: 1 }}>{items.length}</div>
                    {criticals > 0 && (
                      <div style={{ fontSize: 11, color: '#DC2626', marginTop: 2, fontWeight: 600 }}>
                        {criticals} critical
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
