'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BLCircleLogo from '@/components/brand/BLCircleLogo';
import {
  getAlerts,
  getConsolidatedCash,
  fmtMoney,
  fmtPct,
} from '@/lib/ceo-intel';
import { getDemoMoM } from '@/lib/data/demo-data';
import {
  HEADCOUNT_SUMMARY,
  ENPS_SUMMARY,
  OPEN_REQS,
} from '@/lib/data/hr-data';
import {
  SUPPORT_SNAPSHOT,
  FULFILLMENT_SLA,
  RETURNS_SNAPSHOT,
  CHARGEBACK_SNAPSHOT,
} from '@/lib/data/ops-extras';

// ── Fixed colors (don't change with theme) ────────────────────────────────────
const BLUE   = '#1D44BF';
const ORANGE = '#E8B84B';
const GREEN  = '#2DB47A';
const RED    = '#E06060';
const AMBER  = '#F7A500';

// ── Theme tokens ──────────────────────────────────────────────────────────────
type ThemeTokens = {
  bg: string; panel: string; hdr: string;
  border: string; borderHi: string;
  text: string; muted: string; faint: string;
  sky: string;
  metricBg: string; metricBorder: string;
  hoverBg: string;
  tabCountBg: string; tabCountActiveBg: string;
  ctaBg: string; ctaBorder: string; ctaColor: string;
  inputBorder: string;
  logoTheme: 'dark' | 'light';
};

const DARK_THEME: ThemeTokens = {
  bg:               '#0B0D17',
  panel:            '#141827',
  hdr:              '#0F1220',
  border:           'rgba(79,168,255,0.14)',
  borderHi:         'rgba(79,168,255,0.26)',
  text:             '#FFFFFF',
  muted:            'rgba(255,255,255,0.60)',
  faint:            'rgba(255,255,255,0.38)',
  sky:              '#4FA8FF',
  metricBg:         'rgba(255,255,255,0.02)',
  metricBorder:     'rgba(255,255,255,0.06)',
  hoverBg:          'rgba(255,255,255,0.03)',
  tabCountBg:       'rgba(255,255,255,0.08)',
  tabCountActiveBg: 'rgba(255,255,255,0.18)',
  ctaBg:            'rgba(27,77,230,0.14)',
  ctaBorder:        'rgba(79,168,255,0.35)',
  ctaColor:         '#4FA8FF',
  inputBorder:      'rgba(255,255,255,0.14)',
  logoTheme:        'dark',
};

const LIGHT_THEME: ThemeTokens = {
  bg:               '#F8F9FB',
  panel:            '#FFFFFF',
  hdr:              '#FFFFFF',
  border:           'rgba(0,0,0,0.08)',
  borderHi:         'rgba(0,0,0,0.14)',
  text:             '#111827',
  muted:            'rgba(0,0,0,0.52)',
  faint:            'rgba(0,0,0,0.35)',
  sky:              '#1D44BF',
  metricBg:         'rgba(0,0,0,0.02)',
  metricBorder:     'rgba(0,0,0,0.06)',
  hoverBg:          'rgba(0,0,0,0.02)',
  tabCountBg:       'rgba(0,0,0,0.07)',
  tabCountActiveBg: 'rgba(255,255,255,0.25)',
  ctaBg:            'rgba(29,68,191,0.07)',
  ctaBorder:        'rgba(29,68,191,0.22)',
  ctaColor:         '#1D44BF',
  inputBorder:      'rgba(0,0,0,0.12)',
  logoTheme:        'light',
};

// ── Attention feed ────────────────────────────────────────────────────────────
type Area = 'all' | 'finance' | 'hr' | 'ops';
type AttentionItem = {
  id: string; area: 'finance' | 'hr' | 'ops';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string; body: string; owner: string; due?: string;
  cta: { label: string; href: string };
};

function buildAttentionFeed(): AttentionItem[] {
  const financeAlerts = getAlerts('consolidated');
  const financeItems: AttentionItem[] = financeAlerts.map((a) => ({
    id: `fin-${a.id}`, area: 'finance', severity: a.severity,
    title: a.title, body: a.body, owner: a.owner, due: a.due, cta: a.cta,
  }));

  const urgentReqs = OPEN_REQS.filter((r) => r.priority === 'high' && r.daysOpen > 45).slice(0, 2);
  const hrItems: AttentionItem[] = [];
  if (urgentReqs.length > 0) {
    hrItems.push({
      id: 'hr-reqs', area: 'hr', severity: 'high',
      title: `${urgentReqs.length} critical role${urgentReqs.length === 1 ? '' : 's'} open > 45 days`,
      body: urgentReqs.map((r) => `${r.title} (${r.daysOpen}d)`).join(' · '),
      owner: 'HR · ' + urgentReqs[0].hiringManager, due: urgentReqs[0].targetFillBy,
      cta: { label: 'Open Reqs', href: '/hr/admin/reqs' },
    });
  }
  if (HEADCOUNT_SUMMARY.gapToPlan <= -5) {
    hrItems.push({
      id: 'hr-headcount', area: 'hr', severity: 'medium',
      title: `Headcount ${HEADCOUNT_SUMMARY.gapToPlan} vs plan — ${HEADCOUNT_SUMMARY.openReqs} open reqs`,
      body: `${HEADCOUNT_SUMMARY.actualFte} active / ${HEADCOUNT_SUMMARY.planFte} plan. $${((HEADCOUNT_SUMMARY.laborCostBudgetMonthly - HEADCOUNT_SUMMARY.laborCostMonthly) / 1000).toFixed(0)}K monthly payroll underspend.`,
      owner: 'People ops', cta: { label: 'HR Dashboard', href: '/hr/admin/dashboard' },
    });
  }
  if (ENPS_SUMMARY.current - ENPS_SUMMARY.priorQuarter >= 8) {
    hrItems.push({
      id: 'hr-enps', area: 'hr', severity: 'low',
      title: `eNPS climbed to ${ENPS_SUMMARY.current} (+${ENPS_SUMMARY.current - ENPS_SUMMARY.priorQuarter} QoQ)`,
      body: `Industry benchmark ${ENPS_SUMMARY.industryBench}. Response rate ${ENPS_SUMMARY.responseRate}%.`,
      owner: 'People ops', cta: { label: 'eNPS Detail', href: '/hr/admin/enps' },
    });
  }

  const opsItems: AttentionItem[] = [];
  if (FULFILLMENT_SLA.actualSameDayPct < FULFILLMENT_SLA.targetSameDayPct) {
    opsItems.push({
      id: 'ops-sla', area: 'ops',
      severity: FULFILLMENT_SLA.actualSameDayPct < FULFILLMENT_SLA.targetSameDayPct - 2 ? 'high' : 'medium',
      title: `Same-day ship SLA at ${FULFILLMENT_SLA.actualSameDayPct}% — target ${FULFILLMENT_SLA.targetSameDayPct}%`,
      body: `${FULFILLMENT_SLA.ordersMtd.toLocaleString()} orders MTD. Ship cost $${FULFILLMENT_SLA.avgShipCost.toFixed(2)} vs $${FULFILLMENT_SLA.shipCostBudget.toFixed(2)} budget.`,
      owner: 'Ops · Dre Morris', cta: { label: 'Fulfillment SLA', href: '/ops/fulfillment' },
    });
  }
  if (SUPPORT_SNAPSHOT.openAge.over72h > 0) {
    opsItems.push({
      id: 'ops-support-aged', area: 'ops',
      severity: SUPPORT_SNAPSHOT.openAge.over72h >= 5 ? 'high' : 'medium',
      title: `${SUPPORT_SNAPSHOT.openAge.over72h} support tickets aged > 72h`,
      body: `${SUPPORT_SNAPSHOT.openTickets} open · CSAT ${SUPPORT_SNAPSHOT.csat30d.toFixed(2)} (prior ${SUPPORT_SNAPSHOT.csatLastMonth.toFixed(2)}).`,
      owner: 'Support · Karen Liu', cta: { label: 'Support Queue', href: '/ops/support' },
    });
  }
  if (RETURNS_SNAPSHOT.mtdReturnRate > 8) {
    opsItems.push({
      id: 'ops-returns', area: 'ops', severity: 'medium',
      title: `Returns rate ${RETURNS_SNAPSHOT.mtdReturnRate}% MTD — ${RETURNS_SNAPSHOT.activeRmas} active RMAs`,
      body: `Top drivers: sizing/fit and damaged in transit. Watch for Q2 signals.`,
      owner: 'Ops · Returns team', cta: { label: 'Returns / RMA', href: '/ops/returns' },
    });
  }
  if (CHARGEBACK_SNAPSHOT.openDisputes >= 10) {
    opsItems.push({
      id: 'ops-chargebacks', area: 'ops', severity: 'low',
      title: `${CHARGEBACK_SNAPSHOT.openDisputes} open chargebacks — win rate ${CHARGEBACK_SNAPSHOT.winRate}%`,
      body: `MTD lost $${CHARGEBACK_SNAPSHOT.mtdLost.toLocaleString()}, recovered $${CHARGEBACK_SNAPSHOT.mtdRecovered.toLocaleString()}.`,
      owner: 'Finance ops', cta: { label: 'Chargebacks', href: '/ops/chargebacks' },
    });
  }

  const sevOrder = { critical: 0, high: 1, medium: 2, low: 3 } as const;
  return [...financeItems, ...hrItems, ...opsItems].sort(
    (a, b) => sevOrder[a.severity] - sevOrder[b.severity],
  );
}

// ── UI atoms ──────────────────────────────────────────────────────────────────
const SEVERITY_COLOR: Record<AttentionItem['severity'], string> = {
  critical: RED, high: ORANGE, medium: AMBER, low: '#4FA8FF',
};
const AREA_COLOR: Record<AttentionItem['area'], string> = {
  finance: '#4FA8FF', hr: BLUE, ops: '#6A8CFF',
};
const AREA_LABEL: Record<AttentionItem['area'], string> = {
  finance: 'Finance', hr: 'HR', ops: 'Ops',
};

function SeverityDot({ severity }: { severity: AttentionItem['severity'] }) {
  const c = SEVERITY_COLOR[severity];
  return <div style={{ width: 8, height: 8, borderRadius: '50%', background: c, boxShadow: `0 0 10px ${c}80`, flexShrink: 0, marginTop: 7 }} />;
}

function AreaChip({ area }: { area: AttentionItem['area'] }) {
  const color = AREA_COLOR[area];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', fontSize: 10, fontWeight: 800, letterSpacing: '0.09em', textTransform: 'uppercase', color, background: `${color}14`, border: `1px solid ${color}40`, borderRadius: 4 }}>
      {AREA_LABEL[area]}
    </span>
  );
}

function PulseCard({ title, accent, metrics, href, hrefLabel, T }: {
  title: string; accent: string;
  metrics: { label: string; value: string; tone?: 'pos' | 'neg' | 'flat' }[];
  href: string; hrefLabel: string;
  T: ThemeTokens;
}) {
  return (
    <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 16, boxShadow: T.logoTheme === 'light' ? '0 1px 4px rgba(0,0,0,0.04)' : 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 3, height: 16, background: accent, borderRadius: 2 }} />
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: T.text }}>{title}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {metrics.map((m) => (
          <div key={m.label} style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '10px 12px', background: T.metricBg, border: `1px solid ${T.metricBorder}`, borderRadius: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: T.faint }}>{m.label}</div>
            <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.02em', color: m.tone === 'pos' ? GREEN : m.tone === 'neg' ? RED : T.text }}>{m.value}</div>
          </div>
        ))}
      </div>
      <Link href={href} style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: T.ctaBg, color: T.ctaColor, border: `1px solid ${T.ctaBorder}`, borderRadius: 7, fontSize: 11, fontWeight: 800, letterSpacing: '0.09em', textTransform: 'uppercase', textDecoration: 'none' }}>
        {hrefLabel} →
      </Link>
    </div>
  );
}

// ── Theme toggle button ───────────────────────────────────────────────────────
function ThemeToggle({ dark, onToggle, T }: { dark: boolean; onToggle: () => void; T: ThemeTokens }) {
  return (
    <button
      onClick={onToggle}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '7px 12px',
        background: T.metricBg,
        border: `1px solid ${T.inputBorder}`,
        borderRadius: 7,
        cursor: 'pointer', fontFamily: 'inherit',
        fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
        color: T.muted,
        transition: 'background 0.15s, border-color 0.15s',
      }}
    >
      {dark ? (
        // Sun icon
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" strokeLinecap="round"/>
        </svg>
      ) : (
        // Moon icon
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      {dark ? 'Light' : 'Dark'}
    </button>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function MorningBriefPage() {
  const router = useRouter();
  const [area, setArea] = useState<Area>('all');
  const [dark, setDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const T = dark ? DARK_THEME : LIGHT_THEME;

  const attention = useMemo(() => buildAttentionFeed(), []);
  const filtered = useMemo(
    () => (area === 'all' ? attention : attention.filter((a) => a.area === area)),
    [area, attention],
  );
  const counts = useMemo(() => ({
    all:      attention.length,
    finance:  attention.filter((a) => a.area === 'finance').length,
    hr:       attention.filter((a) => a.area === 'hr').length,
    ops:      attention.filter((a) => a.area === 'ops').length,
    critical: attention.filter((a) => a.severity === 'critical').length,
    high:     attention.filter((a) => a.severity === 'high').length,
  }), [attention]);

  const cash   = getConsolidatedCash();
  const mom    = getDemoMoM();
  const latest = mom.latestMonth;
  const prev   = mom.priorMonth;
  const revDelta = prev.revenue > 0 ? ((latest.revenue - prev.revenue) / prev.revenue) * 100 : 0;

  const handleLogout = () => {
    document.cookie = 'eb-auth=; path=/; max-age=0';
    router.push('/login');
  };

  if (!mounted) return null;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  const showFinance = area === 'all' || area === 'finance';
  const showHR      = area === 'all' || area === 'hr';
  const showOps     = area === 'all' || area === 'ops';

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: ${T.bg} !important; font-family: 'Aeonik', 'Inter', system-ui, sans-serif; color: ${T.text}; transition: background 0.2s; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
        .mb-attention-row { animation: fadeUp 0.35s ease both; }
        .mb-attention-row:hover { background: ${T.hoverBg} !important; }
      `}</style>

      <div style={{ minHeight: '100vh', background: T.bg, color: T.text, display: 'flex', flexDirection: 'column', transition: 'background 0.2s, color 0.2s' }}>

        {/* Top strip */}
        <div style={{
          background: BLUE, height: 28,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', color: '#FFFFFF', textTransform: 'uppercase',
        }}>
          Empire OS · Morning Brief · Cross-OS Pulse
        </div>

        {/* Header */}
        <header style={{
          background: T.hdr,
          borderBottom: `1px solid ${T.border}`,
          boxShadow: dark ? 'none' : '0 1px 0 rgba(0,0,0,0.04)',
          padding: '14px 28px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 14, flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <BLCircleLogo size={40} theme={T.logoTheme} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 900, color: T.text, lineHeight: 1, letterSpacing: '-0.01em' }}>Morning Brief</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.sky, letterSpacing: '0.09em', textTransform: 'uppercase', marginTop: 3 }}>
                Meritage Partners · Pulse
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ThemeToggle dark={dark} onToggle={() => setDark((d) => !d)} T={T} />
            <Link
              href="/demo-hub"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '7px 12px',
                background: 'transparent', color: T.muted,
                border: `1px solid ${T.inputBorder}`,
                borderRadius: 7,
                fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              ← Demo Hub
            </Link>
            <button
              onClick={handleLogout}
              style={{
                padding: '7px 12px', background: 'transparent', color: T.faint,
                border: `1px solid ${T.inputBorder}`, borderRadius: 7,
                fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Log out
            </button>
          </div>
        </header>

        <main style={{ flex: 1, maxWidth: 1280, width: '100%', margin: '0 auto', padding: '28px 28px 60px' }}>

          {/* Greeting */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.sky, marginBottom: 6 }}>
              {today}
            </div>
            <h1 style={{ fontSize: 34, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.08, color: T.text }}>
              Good morning, Brian — here&rsquo;s the org pulse.
            </h1>
            <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.55, marginTop: 10, maxWidth: 720 }}>
              {counts.critical} critical · {counts.high} high-priority items across {counts.finance} Finance · {counts.hr} HR · {counts.ops} Ops.
              Filter below to zoom into one area, or drill into a specific demo for the deep dive.
            </p>
          </div>

          {/* Filter tabs */}
          <div style={{
            display: 'flex', gap: 6, marginBottom: 24, padding: 4,
            background: T.hdr, border: `1px solid ${T.border}`,
            borderRadius: 10, width: 'fit-content', flexWrap: 'wrap',
            boxShadow: dark ? 'none' : '0 1px 4px rgba(0,0,0,0.04)',
          }}>
            {([
              { k: 'all',     label: 'All',     count: counts.all     },
              { k: 'finance', label: 'Finance', count: counts.finance },
              { k: 'hr',      label: 'HR',      count: counts.hr      },
              { k: 'ops',     label: 'Ops',     count: counts.ops     },
            ] as const).map((t) => (
              <button
                key={t.k}
                onClick={() => setArea(t.k)}
                style={{
                  padding: '8px 16px',
                  background: area === t.k ? BLUE : 'transparent',
                  color: area === t.k ? '#FFFFFF' : T.muted,
                  border: 'none', borderRadius: 7,
                  fontSize: 11, fontWeight: 800, letterSpacing: '0.09em', textTransform: 'uppercase',
                  cursor: 'pointer', fontFamily: 'inherit',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  transition: 'background 0.15s, color 0.15s',
                }}
              >
                {t.label}
                <span style={{
                  padding: '1px 7px',
                  background: area === t.k ? T.tabCountActiveBg : T.tabCountBg,
                  color: area === t.k ? '#FFFFFF' : T.muted,
                  borderRadius: 10, fontSize: 10, fontWeight: 800, letterSpacing: '0.02em',
                }}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          {/* What needs attention */}
          <section style={{
            background: T.panel, border: `1px solid ${T.border}`,
            boxShadow: dark ? 'none' : '0 1px 4px rgba(0,0,0,0.04)',
            borderRadius: 12, marginBottom: 28, overflow: 'hidden',
          }}>
            <div style={{ padding: '16px 22px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.text }}>
                  What needs your attention
                </div>
                <div style={{ fontSize: 11, color: T.faint, marginTop: 4 }}>
                  Sorted by severity · {filtered.length} item{filtered.length === 1 ? '' : 's'}
                </div>
              </div>
            </div>
            <div>
              {filtered.length === 0 ? (
                <div style={{ padding: 36, textAlign: 'center', color: T.faint, fontSize: 13 }}>
                  Nothing flagged in this area.
                </div>
              ) : (
                filtered.map((item, i) => (
                  <div
                    key={item.id}
                    className="mb-attention-row"
                    style={{
                      padding: '14px 22px',
                      borderBottom: i === filtered.length - 1 ? 'none' : `1px solid ${T.border}`,
                      display: 'flex', gap: 14, alignItems: 'flex-start',
                      transition: 'background 0.12s',
                      animationDelay: `${i * 0.025}s`,
                    }}
                  >
                    <SeverityDot severity={item.severity} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
                        <AreaChip area={item.area} />
                        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: SEVERITY_COLOR[item.severity] }}>
                          {item.severity}
                        </span>
                        {item.due && (
                          <span style={{ fontSize: 10, color: T.faint, letterSpacing: '0.04em' }}>Due {item.due}</span>
                        )}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: T.text, lineHeight: 1.35, marginBottom: 4 }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.55, marginBottom: 6 }}>{item.body}</div>
                      <div style={{ fontSize: 10, color: T.faint, letterSpacing: '0.04em' }}>{item.owner}</div>
                    </div>
                    <Link
                      href={item.cta.href}
                      style={{
                        alignSelf: 'center', padding: '8px 13px',
                        background: T.ctaBg, color: T.ctaColor,
                        border: `1px solid ${T.ctaBorder}`,
                        borderRadius: 6, fontSize: 10, fontWeight: 800,
                        letterSpacing: '0.09em', textTransform: 'uppercase',
                        textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
                      }}
                    >
                      {item.cta.label} →
                    </Link>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Area pulses */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: area === 'all' ? 'repeat(auto-fit, minmax(300px, 1fr))' : '1fr',
            gap: 16,
          }}>
            {showFinance && (
              <PulseCard T={T} title="Finance Pulse" accent={T.sky}
                metrics={[
                  { label: 'Portfolio cash',  value: fmtMoney(cash.cash) },
                  { label: 'Runway',          value: `${cash.runway.toFixed(1)} mo` },
                  { label: 'MTD rev Δ',       value: fmtPct(revDelta), tone: revDelta >= 0 ? 'pos' : 'neg' },
                  { label: 'Net income MTD',  value: fmtMoney(latest.netIncome), tone: latest.netIncome >= 0 ? 'pos' : 'neg' },
                  { label: 'A/R outstanding', value: fmtMoney(cash.arOutstanding) },
                  { label: 'A/P due ≤30d',    value: fmtMoney(cash.apDue) },
                ]}
                href="/dashboard" hrefLabel="Finance CEO Dashboard"
              />
            )}
            {showHR && (
              <PulseCard T={T} title="HR Pulse" accent={BLUE}
                metrics={[
                  { label: 'Headcount',        value: `${HEADCOUNT_SUMMARY.actualFte} / ${HEADCOUNT_SUMMARY.planFte}`, tone: HEADCOUNT_SUMMARY.gapToPlan < 0 ? 'neg' : 'flat' },
                  { label: 'Open reqs',        value: `${HEADCOUNT_SUMMARY.openReqs}` },
                  { label: 'eNPS',             value: `${ENPS_SUMMARY.current}`, tone: 'pos' },
                  { label: 'Attrition YTD',    value: `${HEADCOUNT_SUMMARY.attritionYtd}` },
                  { label: 'Monthly payroll',  value: fmtMoney(HEADCOUNT_SUMMARY.laborCostMonthly) },
                  { label: 'Payroll vs budget',value: fmtMoney(HEADCOUNT_SUMMARY.laborCostMonthly - HEADCOUNT_SUMMARY.laborCostBudgetMonthly), tone: 'pos' },
                ]}
                href="/hr/admin/dashboard" hrefLabel="HR CEO Dashboard"
              />
            )}
            {showOps && (
              <PulseCard T={T} title="Ops Pulse" accent="#6A8CFF"
                metrics={[
                  { label: 'Open tickets',    value: `${SUPPORT_SNAPSHOT.openTickets}` },
                  { label: 'CSAT (30d)',      value: SUPPORT_SNAPSHOT.csat30d.toFixed(2), tone: SUPPORT_SNAPSHOT.csat30d >= SUPPORT_SNAPSHOT.csatLastMonth ? 'pos' : 'neg' },
                  { label: 'Same-day SLA',    value: `${FULFILLMENT_SLA.actualSameDayPct}%`, tone: FULFILLMENT_SLA.actualSameDayPct >= FULFILLMENT_SLA.targetSameDayPct ? 'pos' : 'neg' },
                  { label: 'On-time deliv.',  value: `${FULFILLMENT_SLA.actualOnTimeDeliveryPct}%`, tone: FULFILLMENT_SLA.actualOnTimeDeliveryPct >= FULFILLMENT_SLA.targetOnTimeDeliveryPct ? 'pos' : 'neg' },
                  { label: 'Return rate MTD', value: `${RETURNS_SNAPSHOT.mtdReturnRate}%` },
                  { label: 'Open disputes',   value: `${CHARGEBACK_SNAPSHOT.openDisputes}` },
                ]}
                href="/ops" hrefLabel="Ops CEO Dashboard"
              />
            )}
          </div>

          {/* Footnote */}
          <div style={{ marginTop: 32, padding: '16px 20px', background: T.hdr, border: `1px solid ${T.border}`, borderRadius: 10, fontSize: 12, color: T.muted, lineHeight: 1.6 }}>
            Morning Brief pulls live signals from every OS demo. Use the tabs to filter, or tap
            &ldquo;Finance CEO Dashboard&rdquo; / &ldquo;HR CEO Dashboard&rdquo; / &ldquo;Ops CEO Dashboard&rdquo; above to drill into any area.
            Want a different cadence or a new pulse metric? Flag it and we&rsquo;ll wire it in.
          </div>
        </main>
      </div>
    </>
  );
}
