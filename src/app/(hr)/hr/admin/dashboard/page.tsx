'use client';

import { useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell,
  AreaChart, Area, PieChart, Pie,
} from 'recharts';

// ── Demo data ──────────────────────────────────────────────────────────────────

const DEPARTMENTS = [
  { name: 'Warehouse & Fulfillment', count: 18, avgSalary: 52_400, turnoverPct: 14.2, color: '#FF6B00' },
  { name: 'Sales & Wholesale',       count: 9,  avgSalary: 78_000, turnoverPct: 8.8,  color: '#1D44BF' },
  { name: 'Marketing',               count: 5,  avgSalary: 82_500, turnoverPct: 6.0,  color: '#E8B84B' },
  { name: 'Finance & Ops',           count: 6,  avgSalary: 95_000, turnoverPct: 5.0,  color: '#2DB47A' },
  { name: 'Program Mgmt Office',     count: 4,  avgSalary: 118_000, turnoverPct: 3.5, color: '#8B5A2B' },
  { name: 'Tech & Data',             count: 4,  avgSalary: 125_000, turnoverPct: 9.5, color: '#4FA8FF' },
  { name: 'Executive',               count: 2,  avgSalary: 195_000, turnoverPct: 0,   color: '#CCA24F' },
];

const TOTAL_HC = DEPARTMENTS.reduce((s, d) => s + d.count, 0);
const TOTAL_PAYROLL_ANNUAL = DEPARTMENTS.reduce((s, d) => s + d.count * d.avgSalary, 0);

const BRANDS = [
  { name: 'SSK Baseball',        count: 16, color: '#FF6B00' },
  { name: 'Baseball Glove Lace', count: 8,  color: '#8B5A2B' },
  { name: 'Shug0',               count: 6,  color: '#0A0A0A' },
  { name: 'All American Socks',  count: 4,  color: '#B31B1B' },
  { name: 'Double Dutch Waffles',count: 4,  color: '#E97F2E' },
  { name: 'Holdco (BL)',         count: 10, color: '#1D44BF' },
];

const PAYROLL_MONTHLY = [
  { month: "Nov '25", payroll: 381_200, benefits: 52_800 },
  { month: "Dec '25", payroll: 388_600, benefits: 53_100 },
  { month: "Jan '26", payroll: 375_400, benefits: 54_200 },
  { month: "Feb '26", payroll: 382_800, benefits: 54_500 },
  { month: "Mar '26", payroll: 390_200, benefits: 55_100 },
  { month: "Apr '26", payroll: 398_800, benefits: 55_900, current: true },
];

// ── Interview pipeline stages (in order) ──────────────────────────────────────
const PIPELINE_STAGES = ['Applied', 'Phone Screen', 'Hiring Manager', 'Panel', 'Final Round', 'Offer'] as const;
type PipelineStage = typeof PIPELINE_STAGES[number];
type CandidateStatus = 'active' | 'rejected' | 'on_hold';

interface Candidate {
  name: string;
  stage: PipelineStage;
  lastUpdate: string;
  status: CandidateStatus;
  notes?: string;
}

interface OpenRole {
  id: string;
  title: string;
  dept: string;
  brand: string;
  brandColor: string;
  daysOpen: number;
  priority: 'urgent' | 'high' | 'normal';
  postingStatus: 'Posted' | 'Interviewing' | 'Offer Out';
  salaryMin: number;
  salaryMax: number;
  type: string;
  location: string;
  hiringManager: string;
  recruiter: string;
  applicants: number;
  description: string;
  candidates: Candidate[];
}

interface RequestedRole {
  id: string;
  title: string;
  dept: string;
  brand: string;
  brandColor: string;
  headcount: number;
  requestedBy: string;
  requestDate: string;
  approvalStatus: 'Pending' | 'Approved' | 'On Hold';
  salaryBudget: string;
  justification: string;
  targetStart: string;
  priority: 'high' | 'normal';
}

const OPEN_ROLES: OpenRole[] = [
  {
    id: 'r1',
    title: 'Senior Fulfillment Lead',
    dept: 'Warehouse & Fulfillment', brand: 'SSK', brandColor: '#1D44BF',
    daysOpen: 28, priority: 'urgent', postingStatus: 'Interviewing',
    salaryMin: 58_000, salaryMax: 72_000, type: 'Full-time', location: 'Kent, WA (On-site)',
    hiringManager: 'Sarah Kim, VP Operations', recruiter: 'Internal HR',
    applicants: 47,
    description: 'Lead warehouse team of 6 in SSK\'s Kent, WA facility. Own inbound receiving, pick-pack-ship, carrier coordination, and daily SLA reporting. Reports to VP Operations.',
    candidates: [
      { name: 'Derek Liu',     stage: 'Panel',          lastUpdate: 'Apr 15', status: 'active',   notes: 'Strong 3PL background — top candidate' },
      { name: 'James Kowalski',stage: 'Hiring Manager', lastUpdate: 'Apr 18', status: 'active' },
      { name: 'Maria Santos',  stage: 'Phone Screen',   lastUpdate: 'Apr 12', status: 'rejected', notes: 'Salary expectations too high' },
      { name: 'Priya Mehta',   stage: 'Applied',        lastUpdate: 'Apr 20', status: 'active' },
    ],
  },
  {
    id: 'r2',
    title: 'Amazon Channel Manager',
    dept: 'Sales & Wholesale', brand: 'SSK', brandColor: '#1D44BF',
    daysOpen: 41, priority: 'high', postingStatus: 'Interviewing',
    salaryMin: 85_000, salaryMax: 105_000, type: 'Full-time', location: 'Remote (U.S.)',
    hiringManager: 'Tom Rivera, Head of Sales', recruiter: 'Internal HR',
    applicants: 89,
    description: 'Own SSK\'s Amazon Seller Central P&L. Manage listings, $2.4M ad spend, A+ content, FBA reorder triggers, and channel-specific promotions. 41 days open — exceeds 30-day hiring SLA.',
    candidates: [
      { name: 'Alex Turner',  stage: 'Final Round',    lastUpdate: 'Apr 19', status: 'active',   notes: 'Former Helium 10 team — strong fit' },
      { name: 'Priya Mehta',  stage: 'Panel',          lastUpdate: 'Apr 14', status: 'active' },
      { name: 'Sam Chen',     stage: 'Hiring Manager', lastUpdate: 'Apr 10', status: 'rejected', notes: 'Salary mismatch — $130K ask' },
    ],
  },
  {
    id: 'r3',
    title: 'Brand Designer',
    dept: 'Marketing', brand: 'Shug0', brandColor: '#FF6B00',
    daysOpen: 14, priority: 'normal', postingStatus: 'Interviewing',
    salaryMin: 70_000, salaryMax: 88_000, type: 'Full-time', location: 'Hybrid — Chicago, IL',
    hiringManager: 'Brandon Lee, CMO', recruiter: 'Internal HR',
    applicants: 31,
    description: 'Own visual identity for Shug0 — cleats, footwear accessories, and lifestyle brand. Create assets for Amazon storefront, DTC site, and paid social. Work cross-brand on holdco collateral.',
    candidates: [
      { name: 'Nina Okafor', stage: 'Phone Screen', lastUpdate: 'Apr 21', status: 'active' },
    ],
  },
  {
    id: 'r4',
    title: 'Data Analyst',
    dept: 'Tech & Data', brand: 'BL Holdco', brandColor: '#4FA8FF',
    daysOpen: 63, priority: 'high', postingStatus: 'Interviewing',
    salaryMin: 95_000, salaryMax: 118_000, type: 'Full-time', location: 'Remote',
    hiringManager: 'CTO', recruiter: 'External (search firm)',
    applicants: 42,
    description: 'Build out BI stack for Meritage Partners Holdings. Own Looker dashboards, QuickBooks data pulls, cross-brand revenue rollups, and ad hoc CEO/CFO analysis requests. 63 days open — urgent.',
    candidates: [
      { name: 'Sam Chen',    stage: 'Panel',          lastUpdate: 'Apr 16', status: 'active' },
      { name: 'Rohan Kumar', stage: 'Hiring Manager', lastUpdate: 'Apr 9',  status: 'on_hold', notes: 'Candidate requested delay — offer from another firm' },
      { name: 'Wei Lin',     stage: 'Applied',        lastUpdate: 'Apr 22', status: 'active' },
    ],
  },
  {
    id: 'r5',
    title: 'E-commerce Coordinator',
    dept: 'Sales & Wholesale', brand: 'BGL', brandColor: '#0A8A5C',
    daysOpen: 9, priority: 'normal', postingStatus: 'Posted',
    salaryMin: 55_000, salaryMax: 68_000, type: 'Full-time', location: 'Remote',
    hiringManager: 'BGL Brand Manager', recruiter: 'Internal HR',
    applicants: 18,
    description: 'Support BGL\'s Shopify and Amazon storefronts. Update product listings, manage inventory alerts, coordinate with 3PL on restock, and track channel KPIs weekly.',
    candidates: [],
  },
];

const REQUESTED_ROLES: RequestedRole[] = [
  {
    id: 'req1',
    title: 'Warehouse Associate',
    dept: 'Warehouse & Fulfillment', brand: 'SSK', brandColor: '#1D44BF',
    headcount: 2,
    requestedBy: 'Sarah Kim, VP Operations', requestDate: 'Apr 8',
    approvalStatus: 'Pending',
    salaryBudget: '$48K each ($96K total)',
    justification: 'Q3 volume ramp + two open exit headcount replacements. Warehouse turnover at 14.2% — backfill critical to maintain ship SLAs.',
    targetStart: 'Jun 1, 2026',
    priority: 'high',
  },
  {
    id: 'req2',
    title: 'Senior Software Developer',
    dept: 'Tech & Data', brand: 'BL Holdco', brandColor: '#4FA8FF',
    headcount: 1,
    requestedBy: 'CTO', requestDate: 'Mar 15',
    approvalStatus: 'Approved',
    salaryBudget: '$130K – $155K',
    justification: 'Finance OS + HR OS internal development. Agency contract expires June. Full-time hire needed for product roadmap execution.',
    targetStart: 'Jul 1, 2026',
    priority: 'high',
  },
  {
    id: 'req3',
    title: 'Regional Sales Representative',
    dept: 'Sales & Wholesale', brand: 'AAS', brandColor: '#41B6E6',
    headcount: 1,
    requestedBy: 'Head of Sales', requestDate: 'Feb 20',
    approvalStatus: 'On Hold',
    salaryBudget: '$65K base + commission',
    justification: 'Expand wholesale penetration in Southeast U.S. Current rep coverage leaves 4 key retail chains unserved. On hold pending Q2 revenue review.',
    targetStart: 'TBD',
    priority: 'normal',
  },
];

const COMPLIANCE_DATA = [
  { category: 'Anti-Harassment Training',   complete: 38, total: 48, pct: 79 },
  { category: 'Data Security Refresher',    complete: 21, total: 48, pct: 44 },
  { category: 'Handbook Acknowledgement',   complete: 45, total: 48, pct: 94 },
  { category: 'Safety Orientation',         complete: 18, total: 18, pct: 100 },
  { category: 'Manager Essentials Q2',      complete: 4,  total: 6,  pct: 67 },
];

const ALERTS = [
  { severity: 'critical', text: 'Data Security Refresher: only 44% complete — May 15 deadline in 23 days' },
  { severity: 'warning',  text: 'Amazon Channel Manager role open 41 days — exceeds 30-day SLA for critical hires' },
  { severity: 'warning',  text: 'Warehouse turnover at 14.2% — above 10% target; 2 exit interviews pending review' },
  { severity: 'info',     text: '3 employees due for annual merit review by May 31' },
];

const BENEFITS_BREAKDOWN = [
  { label: 'Health (employer portion)',  monthly: 28_400, pct: 50.8 },
  { label: 'Dental + Vision',           monthly: 4_200,  pct: 7.5  },
  { label: '401k match',                monthly: 11_200, pct: 20.0 },
  { label: 'Life / LTD insurance',      monthly: 3_800,  pct: 6.8  },
  { label: 'FSA employer contrib.',     monthly: 2_100,  pct: 3.8  },
  { label: 'Payroll taxes (employer)',  monthly: 5_900,  pct: 10.6 },
  { label: 'Other',                     monthly: 300,    pct: 0.5  },
];
const TOTAL_BENEFITS_MONTHLY = BENEFITS_BREAKDOWN.reduce((s, b) => s + b.monthly, 0);

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmt  = (n: number) => n >= 1_000_000 ? `$${(n/1_000_000).toFixed(2)}M` : `$${(n/1_000).toFixed(0)}K`;
const fmtM = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const CARD: React.CSSProperties = {
  background: 'var(--color-surf)',
  borderRadius: 'var(--card-radius)',
  boxShadow: 'var(--card-shadow)',
  border: '1px solid var(--color-border)',
};
const TOOLTIP_STYLE = {
  background: '#1E2236',
  border: '1px solid var(--color-border)',
  borderRadius: 8,
  color: '#FFFFFF',
  fontSize: 12,
};

// ── Component ──────────────────────────────────────────────────────────────────
export default function HRCEODashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'payroll' | 'talent'>('overview');
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [selectedReqId, setSelectedReqId] = useState<string | null>(null);

  const selectedRole = useMemo(() => OPEN_ROLES.find((r) => r.id === selectedRoleId) ?? null, [selectedRoleId]);
  const selectedReq  = useMemo(() => REQUESTED_ROLES.find((r) => r.id === selectedReqId) ?? null, [selectedReqId]);

  const blendedTurnover = useMemo(() => {
    const weighted = DEPARTMENTS.reduce((s, d) => s + d.turnoverPct * d.count, 0);
    return weighted / TOTAL_HC;
  }, []);

  const totalBenefitsAnnual = TOTAL_BENEFITS_MONTHLY * 12;
  const totalCompAnnual     = TOTAL_PAYROLL_ANNUAL + totalBenefitsAnnual;
  const totalPayrollMTD     = PAYROLL_MONTHLY[PAYROLL_MONTHLY.length - 1].payroll;
  const totalBenefitsMTD    = PAYROLL_MONTHLY[PAYROLL_MONTHLY.length - 1].benefits;

  const sevColor = (s: string) =>
    s === 'critical' ? '#E06060' : s === 'warning' ? '#F7A500' : '#4FA8FF';
  const sevBg = (s: string) =>
    s === 'critical' ? 'rgba(224,96,96,0.08)' : s === 'warning' ? 'rgba(247,165,0,0.08)' : 'rgba(79,168,255,0.08)';
  const sevBorder = (s: string) =>
    s === 'critical' ? 'rgba(224,96,96,0.28)' : s === 'warning' ? 'rgba(247,165,0,0.28)' : 'rgba(79,168,255,0.28)';

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#4FA8FF', marginBottom: 4 }}>
            HR Admin · CEO View
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--color-text)', letterSpacing: '-0.01em', fontFamily: 'var(--font-condensed)' }}>
            People &amp; Payroll Intelligence
          </h1>
          <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 3 }}>
            Meritage Partners Holdings · {TOTAL_HC} employees · Apr 2026 snapshot
          </div>
        </div>
        {/* Admin badge */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ background: 'rgba(224,96,96,0.12)', border: '1px solid rgba(224,96,96,0.30)', color: '#E06060', fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 5 }}>
            Admin Only
          </span>
          <span style={{ background: 'rgba(45,180,122,0.12)', border: '1px solid rgba(45,180,122,0.28)', color: '#2DB47A', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 5 }}>
            Live · Apr 22
          </span>
        </div>
      </div>

      {/* Alerts strip */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {ALERTS.map((a, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 14px',
            background: sevBg(a.severity),
            border: `1px solid ${sevBorder(a.severity)}`,
            borderLeft: `3px solid ${sevColor(a.severity)}`,
            borderRadius: 8,
          }}>
            <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: sevColor(a.severity), flexShrink: 0 }}>
              {a.severity}
            </span>
            <span style={{ fontSize: 12, color: 'var(--color-text)', lineHeight: 1.4 }}>{a.text}</span>
          </div>
        ))}
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Headcount',   value: `${TOTAL_HC}`, sub: `+2 QoQ · ${OPEN_ROLES.length} open roles`,      accent: '#4FA8FF' },
          { label: 'Annual Payroll',    value: fmt(TOTAL_PAYROLL_ANNUAL), sub: `${fmt(totalCompAnnual)} w/ benefits`,  accent: '#1D44BF' },
          { label: 'Benefits / Month',  value: fmtM(TOTAL_BENEFITS_MONTHLY), sub: `${((TOTAL_BENEFITS_MONTHLY / (TOTAL_PAYROLL_ANNUAL / 12)) * 100).toFixed(1)}% of payroll`, accent: '#E8B84B' },
          { label: 'Blended Turnover',  value: `${blendedTurnover.toFixed(1)}%`, sub: 'Annualized · 10% target',         accent: blendedTurnover > 10 ? '#E06060' : '#2DB47A' },
        ].map((kpi) => (
          <div key={kpi.label} style={{ ...CARD, padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(300px circle at 100% 0%, ${kpi.accent}18 0%, transparent 65%)`, pointerEvents: 'none' }} />
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 6 }}>{kpi.label}</div>
            <div style={{ fontSize: 30, fontWeight: 900, color: 'var(--color-text)', lineHeight: 1, fontFamily: 'var(--font-condensed)' }}>{kpi.value}</div>
            <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 5 }}>{kpi.sub}</div>
            <div style={{ marginTop: 10, height: 3, borderRadius: 2, background: 'var(--color-border)', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '100%', background: kpi.accent }} />
            </div>
          </div>
        ))}
      </div>

      {/* Open Roles callout banner */}
      <button
        onClick={() => setActiveTab('talent')}
        style={{
          width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
          background: 'linear-gradient(135deg, rgba(79,168,255,0.10), rgba(79,168,255,0.04))',
          border: '1px solid rgba(79,168,255,0.35)',
          borderRadius: 10, padding: '14px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
          transition: 'border-color 0.15s, background 0.15s',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(79,168,255,0.60)'; (e.currentTarget as HTMLElement).style.background = 'rgba(79,168,255,0.14)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(79,168,255,0.35)'; (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, rgba(79,168,255,0.10), rgba(79,168,255,0.04))'; }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#4FA8FF', fontVariantNumeric: 'tabular-nums' }}>{OPEN_ROLES.length}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-text)' }}>Open Roles — hiring pipeline</div>
              <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 2 }}>
                {OPEN_ROLES.filter(r => r.priority === 'urgent').length} urgent · {OPEN_ROLES.filter(r => r.postingStatus === 'Interviewing').length} in interview · {OPEN_ROLES.filter(r => r.postingStatus === 'Offer Out').length} offer out
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {OPEN_ROLES.slice(0, 4).map((r) => (
              <span key={r.id} style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: r.priority === 'urgent' ? 'rgba(224,84,84,0.15)' : 'rgba(79,168,255,0.12)', color: r.priority === 'urgent' ? '#E05454' : '#4FA8FF', border: `1px solid ${r.priority === 'urgent' ? 'rgba(224,84,84,0.30)' : 'rgba(79,168,255,0.25)'}` }}>
                {r.title}
              </span>
            ))}
            {OPEN_ROLES.length > 4 && <span style={{ fontSize: 10, color: 'var(--color-muted)', padding: '2px 4px' }}>+{OPEN_ROLES.length - 4} more</span>}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#4FA8FF', flexShrink: 0 }}>
          <span style={{ fontSize: 12, fontWeight: 700 }}>See pipeline</span>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </button>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--color-border)', paddingBottom: 0 }}>
        {(['overview', 'payroll', 'talent'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              padding: '8px 16px',
              fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.10em',
              color: activeTab === tab ? '#4FA8FF' : 'var(--color-muted)',
              borderBottom: activeTab === tab ? '2px solid #4FA8FF' : '2px solid transparent',
              marginBottom: -1,
              transition: 'color 0.15s',
            }}
          >
            {tab === 'overview' ? 'Headcount' : tab === 'payroll' ? 'Payroll & Benefits' : '🎯 Open Roles & Hiring'}
          </button>
        ))}
      </div>

      {/* ── TAB: Headcount Overview ── */}
      {activeTab === 'overview' && (
        <div className="flex flex-col gap-5">

          <div className="grid grid-cols-12 gap-4">
            {/* Headcount by department */}
            <div className="col-span-12 lg:col-span-7" style={{ ...CARD, padding: '22px 24px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 4 }}>
                Headcount by Department
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 14, fontFamily: 'var(--font-condensed)' }}>
                {TOTAL_HC} employees · {DEPARTMENTS.length} departments
              </div>
              <div style={{ height: 175 }}>
                <ResponsiveContainer>
                  <BarChart data={DEPARTMENTS} layout="vertical" margin={{ top: 0, right: 20, left: 8, bottom: 0 }} barCategoryGap="10%">
                    <CartesianGrid horizontal={false} stroke="var(--color-chart-grid)" />
                    <XAxis type="number" tick={{ fill: 'var(--color-chart-text)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fill: 'var(--color-chart-text)', fontSize: 10 }} axisLine={false} tickLine={false} width={160} />
                    <Tooltip
                      contentStyle={TOOLTIP_STYLE}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      formatter={((v: unknown, _k: unknown, props: any) => [`${v} employees · avg ${fmt(props?.payload?.avgSalary ?? 0)} · ${props?.payload?.turnoverPct ?? 0}% turnover`, 'HC']) as never}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {DEPARTMENTS.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Insight strip */}
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--color-border)', display: 'flex', gap: 20 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.10em', color: 'var(--color-muted)', marginBottom: 3 }}>Largest dept</div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>Warehouse & Fulfillment</div>
                  <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 1 }}>18 HC · 14.2% turnover risk</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.10em', color: 'var(--color-muted)', marginBottom: 3 }}>Highest avg salary</div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>Tech & Data</div>
                  <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 1 }}>{fmt(125_000)} avg · 9.5% turnover</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.10em', color: 'var(--color-muted)', marginBottom: 3 }}>Annual payroll</div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{fmt(TOTAL_PAYROLL_ANNUAL)}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 1 }}>{fmt(TOTAL_PAYROLL_ANNUAL / 12)}/mo fully loaded</div>
                </div>
              </div>
            </div>

            {/* Headcount by brand */}
            <div className="col-span-12 lg:col-span-5" style={{ ...CARD, padding: '22px 24px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 4 }}>
                Headcount by Brand
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 14, fontFamily: 'var(--font-condensed)' }}>
                {BRANDS.length} entities
              </div>
              <div style={{ height: 165, marginBottom: 10 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={BRANDS} dataKey="count" nameKey="name" innerRadius={44} outerRadius={70} paddingAngle={2}>
                      {BRANDS.map((b, i) => <Cell key={i} fill={b.color} />)}
                    </Pie>
                    <Tooltip contentStyle={TOOLTIP_STYLE} formatter={((v: unknown) => [`${v} employees`, '']) as never} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {BRANDS.map((b) => (
                  <div key={b.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: b.color, flexShrink: 0 }} />
                    <span style={{ flex: 1, color: 'var(--color-muted)' }}>{b.name}</span>
                    <span style={{ fontWeight: 700 }}>{b.count}</span>
                    <span style={{ fontSize: 10, color: 'var(--color-muted)', minWidth: 36, textAlign: 'right' }}>{((b.count / TOTAL_HC) * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Department detail table */}
          <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surf2)' }}>
              <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.10em', fontFamily: 'var(--font-condensed)', color: 'var(--color-text)' }}>
                Department Breakdown
              </span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>
                    {['Department', 'Headcount', 'Avg Salary', 'Annual Cost', '% of Payroll', 'Turnover'].map((h, i) => (
                      <th key={h} style={{
                        padding: '10px 16px',
                        textAlign: i === 0 ? 'left' : 'right',
                        fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
                        color: 'var(--color-muted)', borderBottom: '1px solid var(--color-border)',
                        background: 'var(--color-surf2)', whiteSpace: 'nowrap',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DEPARTMENTS.sort((a, b) => b.count - a.count).map((d, i) => {
                    const deptCost = d.count * d.avgSalary;
                    const pct = (deptCost / TOTAL_PAYROLL_ANNUAL) * 100;
                    return (
                      <tr key={d.name} style={{ borderBottom: '1px solid var(--color-border)', background: i % 2 === 1 ? 'var(--color-surf2)' : 'transparent' }}>
                        <td style={{ padding: '11px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ width: 8, height: 8, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                            <span style={{ fontWeight: 600 }}>{d.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '8px 16px', textAlign: 'right', fontWeight: 700, fontFamily: 'var(--font-condensed)' }}>{d.count}</td>
                        <td style={{ padding: '8px 16px', textAlign: 'right', color: 'var(--color-muted)', fontFamily: 'var(--font-condensed)' }}>{fmtM(d.avgSalary)}</td>
                        <td style={{ padding: '8px 16px', textAlign: 'right', fontWeight: 600, fontFamily: 'var(--font-condensed)' }}>{fmt(deptCost)}</td>
                        <td style={{ padding: '8px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                            <div style={{ width: 60, height: 5, background: 'var(--color-border)', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ width: `${pct}%`, height: '100%', background: d.color }} />
                            </div>
                            <span style={{ fontSize: 11, color: 'var(--color-muted)', minWidth: 36 }}>{pct.toFixed(1)}%</span>
                          </div>
                        </td>
                        <td style={{ padding: '8px 16px', textAlign: 'right', fontWeight: 600, color: d.turnoverPct > 10 ? '#E06060' : d.turnoverPct > 6 ? '#F7A500' : '#2DB47A' }}>
                          {d.turnoverPct > 0 ? `${d.turnoverPct}%` : '—'}
                        </td>
                      </tr>
                    );
                  })}
                  <tr style={{ background: 'rgba(245,138,31,0.05)', borderTop: '2px solid rgba(245,138,31,0.25)' }}>
                    <td style={{ padding: '8px 16px', fontWeight: 800, color: '#E8B84B' }}>Total</td>
                    <td style={{ padding: '8px 16px', textAlign: 'right', fontWeight: 800, color: '#E8B84B', fontFamily: 'var(--font-condensed)' }}>{TOTAL_HC}</td>
                    <td style={{ padding: '8px 16px', textAlign: 'right', color: 'var(--color-muted)', fontFamily: 'var(--font-condensed)' }}>—</td>
                    <td style={{ padding: '8px 16px', textAlign: 'right', fontWeight: 800, color: '#E8B84B', fontFamily: 'var(--font-condensed)' }}>{fmt(TOTAL_PAYROLL_ANNUAL)}</td>
                    <td style={{ padding: '8px 16px', textAlign: 'right', fontWeight: 800, color: '#E8B84B' }}>100.0%</td>
                    <td style={{ padding: '8px 16px', textAlign: 'right', fontWeight: 700, color: blendedTurnover > 10 ? '#E06060' : '#2DB47A' }}>{blendedTurnover.toFixed(1)}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: Payroll & Benefits ── */}
      {activeTab === 'payroll' && (
        <div className="flex flex-col gap-5">

          {/* Monthly payroll trend chart */}
          <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surf2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.10em', fontFamily: 'var(--font-condensed)', color: 'var(--color-text)' }}>
                  Monthly Payroll + Benefits
                </span>
              </div>
              <div style={{ display: 'flex', gap: 14, fontSize: 10, color: 'var(--color-muted)' }}>
                <span><span style={{ color: '#1D44BF' }}>—</span> Payroll</span>
                <span><span style={{ color: '#4FA8FF' }}>—</span> Benefits</span>
              </div>
            </div>
            <div style={{ padding: '20px 20px 12px' }}>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={PAYROLL_MONTHLY} margin={{ top: 5, right: 5, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="payG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#1D44BF" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#1D44BF" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="benG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#4FA8FF" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#4FA8FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--color-chart-grid)" strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fill: 'var(--color-chart-text)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} tick={{ fill: 'var(--color-chart-text)', fontSize: 10 }} axisLine={false} tickLine={false} width={52} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={((v: unknown, name: unknown) => [fmtM(Number(v)), name === 'payroll' ? 'Payroll' : 'Benefits']) as never} />
                  <Area type="monotone" dataKey="payroll"  stroke="#1D44BF" fill="url(#payG)" strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="benefits" stroke="#4FA8FF" fill="url(#benG)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            {/* Current month summary */}
            <div className="col-span-12 lg:col-span-5" style={{ ...CARD, padding: '22px 24px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 4 }}>
                Apr 2026 · Current Period
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 18, fontFamily: 'var(--font-condensed)' }}>
                Monthly Spend Summary
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Gross Payroll',    value: totalPayrollMTD,  color: '#1D44BF' },
                  { label: 'Benefits Cost',    value: totalBenefitsMTD, color: '#4FA8FF' },
                  { label: 'Total People Cost',value: totalPayrollMTD + totalBenefitsMTD, color: '#E8B84B', bold: true },
                ].map((r) => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: r.bold ? 'rgba(245,138,31,0.07)' : 'var(--color-surf2)', borderRadius: 8, border: `1px solid ${r.bold ? 'rgba(245,138,31,0.20)' : 'var(--color-border)'}` }}>
                    <span style={{ fontSize: 13, fontWeight: r.bold ? 800 : 500, color: r.bold ? '#E8B84B' : 'var(--color-text)' }}>{r.label}</span>
                    <span style={{ fontSize: 16, fontWeight: 900, color: r.color, fontFamily: 'var(--font-condensed)' }}>{fmtM(r.value)}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 18, padding: '12px 14px', background: 'var(--color-surf2)', borderRadius: 8, border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.10em', color: 'var(--color-muted)', marginBottom: 8 }}>Annualized Run Rate</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--color-text)', fontFamily: 'var(--font-condensed)' }}>
                  {fmt((totalPayrollMTD + totalBenefitsMTD) * 12)}
                </div>
                <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 3 }}>Total people cost · annualized</div>
              </div>
            </div>

            {/* Benefits breakdown */}
            <div className="col-span-12 lg:col-span-7" style={{ ...CARD, padding: '22px 24px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 4 }}>
                Benefits Cost Breakdown
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 18, fontFamily: 'var(--font-condensed)' }}>
                {fmtM(TOTAL_BENEFITS_MONTHLY)}/mo employer cost · {TOTAL_HC} employees
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {BENEFITS_BREAKDOWN.map((b) => (
                  <div key={b.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 12 }}>
                      <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>{b.label}</span>
                      <span style={{ fontFamily: 'var(--font-condensed)', fontWeight: 700 }}>{fmtM(b.monthly)}/mo</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--color-border)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${b.pct}%`, height: '100%', background: '#4FA8FF', borderRadius: 3 }} />
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--color-muted)', marginTop: 2, textAlign: 'right' }}>
                      {b.pct}% of benefits spend · {fmtM(b.monthly * 12)}/yr
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: Talent & Compliance ── */}
      {activeTab === 'talent' && (
        <div className="flex flex-col gap-5">

          {/* ── Open Roles ── */}
          <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surf2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.10em', fontFamily: 'var(--font-condensed)', color: 'var(--color-text)' }}>
                  Open Roles
                </span>
                <span style={{ marginLeft: 10, fontSize: 11, color: 'var(--color-muted)' }}>{OPEN_ROLES.length} positions · click to see pipeline</span>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#E06060' }}>
                {OPEN_ROLES.filter(r => r.priority === 'urgent').length} urgent
              </span>
            </div>

            {OPEN_ROLES.map((r, i) => {
              const priColor = r.priority === 'urgent' ? '#E06060' : r.priority === 'high' ? '#F7A500' : '#4FA8FF';
              const statusColor = r.postingStatus === 'Offer Out' ? '#2DB47A' : r.postingStatus === 'Interviewing' ? '#E8B84B' : '#4FA8FF';
              const isOpen = selectedRoleId === r.id;
              const activeCount = r.candidates.filter(c => c.status === 'active').length;
              return (
                <div key={r.id}>
                  {/* Row */}
                  <div
                    onClick={() => setSelectedRoleId(isOpen ? null : r.id)}
                    style={{
                      display: 'grid', gridTemplateColumns: '1fr auto auto auto auto',
                      alignItems: 'center', gap: 14, padding: '13px 20px',
                      borderBottom: (!isOpen && i < OPEN_ROLES.length - 1) ? '1px solid var(--color-border)' : 'none',
                      cursor: 'pointer',
                      background: isOpen ? 'var(--color-surf2)' : 'transparent',
                      transition: 'background 0.15s',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ background: r.brandColor, color: '#FFF', borderRadius: 3, padding: '1px 6px', fontSize: 10, fontWeight: 900 }}>{r.brand}</span>
                        {r.title}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 3 }}>
                        {r.dept} · {fmtM(r.salaryMin)}–{fmtM(r.salaryMax)} · {r.location}
                      </div>
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: statusColor, background: `${statusColor}18`, border: `1px solid ${statusColor}35`, borderRadius: 4, padding: '3px 8px', whiteSpace: 'nowrap' }}>
                      {r.postingStatus}
                    </span>
                    <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: priColor, background: `${priColor}18`, border: `1px solid ${priColor}35`, borderRadius: 4, padding: '3px 8px', whiteSpace: 'nowrap' }}>
                      {r.priority}
                    </span>
                    <span style={{ fontSize: 12, color: r.daysOpen > 30 ? '#E06060' : 'var(--color-muted)', fontWeight: r.daysOpen > 30 ? 700 : 500, whiteSpace: 'nowrap' }}>
                      {r.daysOpen}d open
                    </span>
                    <span style={{ fontSize: 20, color: 'var(--color-muted)', transition: 'transform 0.2s', transform: isOpen ? 'rotate(90deg)' : 'none' }}>›</span>
                  </div>

                  {/* Expanded detail panel */}
                  {isOpen && (
                    <div style={{ background: 'var(--color-surf2)', borderTop: '1px solid var(--color-border)', borderBottom: i < OPEN_ROLES.length - 1 ? '1px solid var(--color-border)' : 'none', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>

                      {/* Role meta */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
                        {[
                          { label: 'Hiring Manager', value: r.hiringManager },
                          { label: 'Recruiter',      value: r.recruiter },
                          { label: 'Employment',     value: r.type },
                          { label: 'Total Applicants', value: `${r.applicants} total` },
                          { label: 'Active Candidates', value: `${activeCount} in pipeline` },
                        ].map((m) => (
                          <div key={m.label} style={{ background: 'var(--color-surf)', border: '1px solid var(--color-border)', borderRadius: 7, padding: '10px 14px' }}>
                            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 4 }}>{m.label}</div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.3 }}>{m.value}</div>
                          </div>
                        ))}
                      </div>

                      {/* Description */}
                      <div style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.6, background: 'var(--color-surf)', border: '1px solid var(--color-border)', borderRadius: 7, padding: '12px 16px' }}>
                        {r.description}
                      </div>

                      {/* Interview pipeline */}
                      {r.candidates.length > 0 && (
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 12 }}>
                            Interview Pipeline · {r.candidates.length} candidate{r.candidates.length !== 1 ? 's' : ''}
                          </div>

                          {/* Stage track */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 18, overflowX: 'auto' }}>
                            {PIPELINE_STAGES.map((stage, si) => {
                              const hasCandidate = r.candidates.some(c => c.stage === stage && c.status === 'active');
                              return (
                                <div key={stage} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                                  <div style={{
                                    padding: '5px 12px', borderRadius: 4,
                                    fontSize: 10, fontWeight: 700,
                                    background: hasCandidate ? 'rgba(245,138,31,0.18)' : 'var(--color-surf)',
                                    border: `1px solid ${hasCandidate ? 'rgba(245,138,31,0.40)' : 'var(--color-border)'}`,
                                    color: hasCandidate ? '#E8B84B' : 'var(--color-subtle)',
                                    whiteSpace: 'nowrap',
                                  }}>
                                    {stage}
                                    {hasCandidate && (
                                      <span style={{ marginLeft: 6, background: '#E8B84B', color: '#0B0D17', borderRadius: 10, padding: '0px 5px', fontSize: 9, fontWeight: 900 }}>
                                        {r.candidates.filter(c => c.stage === stage && c.status === 'active').length}
                                      </span>
                                    )}
                                  </div>
                                  {si < PIPELINE_STAGES.length - 1 && (
                                    <div style={{ width: 20, height: 1, background: 'var(--color-border)', flexShrink: 0 }} />
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Candidate table */}
                          <div style={{ background: 'var(--color-surf)', border: '1px solid var(--color-border)', borderRadius: 8, overflow: 'hidden' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px 80px', padding: '8px 16px', fontSize: 9, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-muted)', borderBottom: '1px solid var(--color-border)', fontFamily: 'var(--font-condensed)' }}>
                              <div>Candidate</div><div>Stage</div><div>Last Update</div><div>Status</div>
                            </div>
                            {r.candidates.map((c, ci) => {
                              const stColor = c.status === 'active' ? '#2DB47A' : c.status === 'rejected' ? '#E06060' : '#F7A500';
                              return (
                                <div key={ci} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px 80px', alignItems: 'center', padding: '8px 16px', borderBottom: ci < r.candidates.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                                  <div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)' }}>{c.name}</div>
                                    {c.notes && <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 2, fontStyle: 'italic' }}>{c.notes}</div>}
                                  </div>
                                  <div style={{ fontSize: 12, color: 'var(--color-muted)', fontWeight: 500 }}>{c.stage}</div>
                                  <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>{c.lastUpdate}</div>
                                  <div>
                                    <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: stColor, background: `${stColor}18`, border: `1px solid ${stColor}35`, borderRadius: 3, padding: '2px 7px' }}>
                                      {c.status.replace('_', ' ')}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                            {r.candidates.length === 0 && (
                              <div style={{ padding: '16px 20px', color: 'var(--color-muted)', fontSize: 13 }}>
                                No candidates yet — role just posted.
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {r.candidates.length === 0 && (
                        <div style={{ fontSize: 13, color: 'var(--color-muted)', fontStyle: 'italic' }}>
                          Role posted {r.daysOpen} day{r.daysOpen !== 1 ? 's' : ''} ago — {r.applicants} applicants, screening not yet begun.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Headcount Requests ── */}
          <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surf2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.10em', fontFamily: 'var(--font-condensed)', color: 'var(--color-text)' }}>
                  Headcount Requests
                </span>
                <span style={{ marginLeft: 10, fontSize: 11, color: 'var(--color-muted)' }}>{REQUESTED_ROLES.length} pending / approved · click to expand</span>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#F7A500' }}>
                {REQUESTED_ROLES.filter(r => r.approvalStatus === 'Pending').length} awaiting approval
              </span>
            </div>

            {REQUESTED_ROLES.map((r, i) => {
              const apColor = r.approvalStatus === 'Approved' ? '#2DB47A' : r.approvalStatus === 'On Hold' ? '#E8B84B' : '#E8B84B';
              const isOpen = selectedReqId === r.id;
              return (
                <div key={r.id}>
                  <div
                    onClick={() => setSelectedReqId(isOpen ? null : r.id)}
                    style={{
                      display: 'grid', gridTemplateColumns: '1fr auto auto auto auto',
                      alignItems: 'center', gap: 14, padding: '13px 20px',
                      borderBottom: (!isOpen && i < REQUESTED_ROLES.length - 1) ? '1px solid var(--color-border)' : 'none',
                      cursor: 'pointer',
                      background: isOpen ? 'var(--color-surf2)' : 'transparent',
                      transition: 'background 0.15s',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ background: r.brandColor, color: '#FFF', borderRadius: 3, padding: '1px 6px', fontSize: 10, fontWeight: 900 }}>{r.brand}</span>
                        {r.title}
                        {r.headcount > 1 && <span style={{ fontSize: 11, color: 'var(--color-muted)', fontWeight: 500 }}>×{r.headcount}</span>}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 3 }}>
                        {r.dept} · {r.salaryBudget} · Target: {r.targetStart}
                      </div>
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: apColor, background: `${apColor}18`, border: `1px solid ${apColor}35`, borderRadius: 4, padding: '3px 8px', whiteSpace: 'nowrap' }}>
                      {r.approvalStatus}
                    </span>
                    <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: r.priority === 'high' ? '#F7A500' : '#4FA8FF', background: r.priority === 'high' ? 'rgba(247,165,0,0.12)' : 'rgba(79,168,255,0.12)', border: `1px solid ${r.priority === 'high' ? 'rgba(247,165,0,0.30)' : 'rgba(79,168,255,0.30)'}`, borderRadius: 4, padding: '3px 8px', whiteSpace: 'nowrap' }}>
                      {r.priority}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>Req. {r.requestDate}</span>
                    <span style={{ fontSize: 20, color: 'var(--color-muted)', transition: 'transform 0.2s', transform: isOpen ? 'rotate(90deg)' : 'none' }}>›</span>
                  </div>

                  {isOpen && (
                    <div style={{ background: 'var(--color-surf2)', borderTop: '1px solid var(--color-border)', borderBottom: i < REQUESTED_ROLES.length - 1 ? '1px solid var(--color-border)' : 'none', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
                        {[
                          { label: 'Requested By',    value: r.requestedBy },
                          { label: 'Request Date',    value: r.requestDate },
                          { label: 'Headcount',       value: `${r.headcount} FTE` },
                          { label: 'Budget',          value: r.salaryBudget },
                          { label: 'Target Start',    value: r.targetStart },
                        ].map((m) => (
                          <div key={m.label} style={{ background: 'var(--color-surf)', border: '1px solid var(--color-border)', borderRadius: 7, padding: '10px 14px' }}>
                            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 4 }}>{m.label}</div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.3 }}>{m.value}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.6, background: 'var(--color-surf)', border: '1px solid var(--color-border)', borderRadius: 7, padding: '12px 16px' }}>
                        <strong style={{ color: 'var(--color-text)' }}>Justification:</strong> {r.justification}
                      </div>
                      {r.approvalStatus === 'Pending' && (
                        <div style={{ display: 'flex', gap: 10 }}>
                          <button style={{ background: 'rgba(45,180,122,0.15)', border: '1px solid rgba(45,180,122,0.35)', color: '#2DB47A', padding: '7px 16px', borderRadius: 6, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', fontFamily: 'inherit' }}>
                            Approve
                          </button>
                          <button style={{ background: 'rgba(224,84,84,0.10)', border: '1px solid rgba(224,84,84,0.28)', color: '#E06060', padding: '7px 16px', borderRadius: 6, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', fontFamily: 'inherit' }}>
                            Decline
                          </button>
                          <button style={{ background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-muted)', padding: '7px 16px', borderRadius: 6, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', fontFamily: 'inherit' }}>
                            Put on Hold
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Training compliance */}
          <div style={{ ...CARD, padding: '22px 24px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 4 }}>
              Training Compliance
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 18, fontFamily: 'var(--font-condensed)' }}>
              Required training completion rates — Apr 2026
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {COMPLIANCE_DATA.map((c) => {
                const color = c.pct === 100 ? '#2DB47A' : c.pct >= 80 ? '#E8B84B' : '#E06060';
                return (
                  <div key={c.category}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>{c.category}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 11, color: 'var(--color-muted)' }}>{c.complete}/{c.total} employees</span>
                        <span style={{ fontSize: 14, fontWeight: 900, color, fontFamily: 'var(--font-condensed)', minWidth: 42, textAlign: 'right' }}>{c.pct}%</span>
                      </div>
                    </div>
                    <div style={{ height: 8, background: 'var(--color-border)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${c.pct}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 0.4s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Turnover & retention metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Avg Tenure',         value: '2.8 yrs',  sub: '+0.4 yrs YoY',          accent: '#2DB47A' },
              { label: 'Time to Fill',        value: '34 days',  sub: '30-day target · +13%',   accent: '#F7A500' },
              { label: 'Retention Rate',      value: '88.1%',    sub: 'Rolling 12M',            accent: '#4FA8FF' },
              { label: 'Promotion Rate',      value: '14%',      sub: 'Promoted in last 12M',   accent: '#E8B84B' },
            ].map((m) => (
              <div key={m.label} style={{ ...CARD, padding: '16px 18px' }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 6 }}>{m.label}</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--color-text)', fontFamily: 'var(--font-condensed)' }}>{m.value}</div>
                <div style={{ fontSize: 10, color: 'var(--color-muted)', marginTop: 4 }}>{m.sub}</div>
                <div style={{ marginTop: 8, height: 2, borderRadius: 1, background: m.accent }} />
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
