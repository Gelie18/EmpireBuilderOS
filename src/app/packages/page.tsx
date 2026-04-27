'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function TopBar() {
  const router = useRouter();
  return (
    <header className="pkg-topbar" style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(11,13,23,0.97)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255,255,255,0.10)',
      padding: '0 40px',
      height: 60,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <button
        onClick={() => router.push('/demo-hub')}
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', fontFamily: 'inherit', padding: 0, textTransform: 'uppercase' }}
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Demo Hub
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <button onClick={() => router.push('/how-it-works')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', fontFamily: 'inherit', padding: 0, textTransform: 'uppercase' }}>How It Works</button>
        <button onClick={() => router.push('/onboarding')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', fontFamily: 'inherit', padding: 0, textTransform: 'uppercase' }}>Onboarding</button>
        <button onClick={() => router.push('/faq')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', fontFamily: 'inherit', padding: 0, textTransform: 'uppercase' }}>FAQ</button>
        <button onClick={() => router.push('/demo-hub')} style={{ background: '#E8B84B', border: 'none', borderRadius: 7, padding: '8px 20px', color: '#0B0D17', fontSize: 12, fontWeight: 800, letterSpacing: '0.10em', fontFamily: 'inherit', cursor: 'pointer', textTransform: 'uppercase' }}>
          Exit
        </button>
      </div>
    </header>
  );
}

const TIERS = [
  {
    id: 'one',
    label: 'One Function',
    price: '$25K',
    per: '/ quarter',
    annual: '~$100K / year',
    badge: null,
    featured: false,
    desc: 'One OS module built end-to-end. Finance, HR, or Ops — your choice. Integrations, AI training, dashboards, and automations all included.',
    includes: [
      'One OS module (Finance, HR, or Ops)',
      '90-day build · on-site scope week',
      'All integrations for that function',
      'AI trained on your actual data',
      'Full IP transfer on Day 90',
    ],
  },
  {
    id: 'two',
    label: 'Two Functions',
    price: '$40K',
    per: '/ quarter',
    annual: '~$160K / year',
    badge: 'Most Common',
    featured: true,
    desc: 'Two modules built concurrently on a shared data layer. Cross-function insights — headcount cost against P&L, fulfillment against cash — emerge automatically.',
    includes: [
      'Two OS modules of your choice',
      '90-day concurrent build',
      'Shared data layer across both functions',
      'Cross-functional AI assistant',
      'Full IP transfer on Day 90',
    ],
  },
  {
    id: 'suite',
    label: 'Full Suite',
    price: '$55K',
    per: '/ quarter',
    annual: '~$220K / year',
    badge: 'Best Value',
    featured: false,
    desc: 'All three functions on one unified system. A single AI that knows your entire business. One dashboard for Finance, HR, and Ops together.',
    includes: [
      'Finance OS + HR OS + Ops OS',
      'Unified executive dashboard',
      'Company-wide AI on a shared data model',
      'Quarterly strategic review sessions',
      'Full IP transfer on Day 90',
    ],
  },
  {
    id: 'custom',
    label: 'Custom Build',
    price: 'Scoped',
    per: 'per engagement',
    annual: 'Determined in Week 1–2 audit',
    badge: null,
    featured: false,
    desc: 'For needs that fall outside the three standard modules — a specialized data product, industry-specific workflow, or AI application built around your specific requirements.',
    includes: [
      'Fully custom scope defined in audit week',
      'Any function, data source, or output format',
      'Proprietary industry workflows',
      'Standalone AI products and tooling',
      'Full IP transfer on Day 90',
    ],
  },
];

const MODULES = [
  {
    id: 'finance',
    label: 'Finance OS',
    color: '#1D44BF',
    tagline: 'Stop assembling reports. Start doing strategy.',
    pieces: [
      { title: 'Live Exec Dashboard', desc: 'Real-time KPIs, cash position, and P&L — always current, no manual assembly.' },
      { title: 'Automated Board Deck', desc: 'Monthly board materials auto-populated from your financials. Reviewed, not built.' },
      { title: 'Variance + Anomaly Alerts', desc: 'AI flags every meaningful deviation — spend, margin, vendor — before it becomes a problem.' },
      { title: 'AI CFO Assistant', desc: 'Questions about your financials answered in plain English, trained on your actual data.' },
      { title: 'Cash Flow Forecasting', desc: 'Rolling 12-month forecast built from real payment cycles and revenue trends.' },
      { title: 'Native Integrations', desc: 'QuickBooks, NetSuite, Sage, Xero, Ramp, Brex, Bill.com, Stripe, Plaid, Shopify.' },
    ],
  },
  {
    id: 'hr',
    label: 'HR OS',
    color: '#0A6A3C',
    tagline: 'People leaders answering strategy, not policy questions.',
    pieces: [
      { title: 'Employee AI Assistant', desc: 'Answers policy questions, PTO requests, and HR FAQs instantly — 24/7.' },
      { title: 'Onboarding + Offboarding', desc: 'Fully automated from offer acceptance to Day 90 — equipment, access, intros, check-ins.' },
      { title: 'Handbook Bot', desc: 'Your policies, your voice — searchable by any employee without digging through PDFs.' },
      { title: 'Manager Insights', desc: 'Aggregated team signals — engagement, sentiment, open requests — in one dashboard.' },
      { title: 'HRIS + Payroll Integrations', desc: 'Rippling, Gusto, Workday, BambooHR, ADP, Paychex, Justworks — AI on top of your stack.' },
      { title: 'Compliance Checks', desc: 'Automated reminders and audit trails for certifications, I-9s, and renewals.' },
    ],
  },
  {
    id: 'ops',
    label: 'Ops OS',
    color: '#4FA8FF',
    tagline: 'Stop status chasing. Start building the company.',
    pieces: [
      { title: 'Automated Status Rollups', desc: 'Every project summarized weekly from Notion, Slack, Asana — no update meetings.' },
      { title: 'Vendor + Contract Tracking', desc: 'Renewal dates, rate changes, and contract terms surfaced automatically.' },
      { title: 'Workflow Automation', desc: 'Recurring ops tasks — approval chains, routing, escalation — automated end to end.' },
      { title: 'Exception Alerting', desc: 'AI monitors thresholds across inventory, fulfillment, and vendor performance.' },
      { title: 'SOP Assistant', desc: 'Your standard operating procedures — searchable, updatable, surfaced in context.' },
      { title: 'Exec Ops Dashboard', desc: 'One view of company-wide health: projects, blockers, utilization, vendor risk.' },
    ],
  },
];

const INTEGRATION_CATEGORIES = [
  { category: 'Accounting / ERP', color: '#1D44BF', tools: ['QuickBooks', 'NetSuite', 'Sage Intacct', 'Xero', 'Microsoft Dynamics'] },
  { category: 'HRIS / Payroll', color: '#0A6A3C', tools: ['Rippling', 'Gusto', 'Workday', 'BambooHR', 'ADP', 'Paychex'] },
  { category: 'Commerce', color: '#B38A00', tools: ['Shopify', 'BigCommerce', 'WooCommerce', 'Amazon Seller', 'Faire', 'Square'] },
  { category: 'Spend / Cards', color: '#5B21B6', tools: ['Ramp', 'Brex', 'Bill.com', 'Expensify', 'Divvy'] },
  { category: 'Banking / Payments', color: '#0A5A8A', tools: ['Stripe', 'Plaid', 'Mercury', 'Chase', 'Wise'] },
  { category: 'Ops / CRM / Data', color: '#374151', tools: ['HubSpot', 'Salesforce', 'Notion', 'Slack', 'Airtable', 'Google Workspace'] },
];

export default function PackagesPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0B0D17 !important; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
        @media (max-width: 900px) {
          .tier-grid { grid-template-columns: repeat(2,1fr) !important; }
          .module-grid { grid-template-columns: 1fr !important; }
          .int-grid { grid-template-columns: repeat(2,1fr) !important; }
          .retainer-cols { flex-direction: column !important; }
        }
        @media (max-width: 600px) {
          .pkg-topbar { padding: 0 16px !important; }
          .pkg-pad { padding: 60px 20px !important; }
          .pkg-hero h1 { font-size: 42px !important; }
          .tier-grid { grid-template-columns: 1fr !important; }
          .int-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ background: '#0B0D17', color: '#FFFFFF', fontFamily: '"DM Sans", system-ui, sans-serif', overflowX: 'hidden' }}>
        <TopBar />

        {/* HERO */}
        <section className="pkg-pad" style={{ padding: '88px 40px 72px', maxWidth: 1100, margin: '0 auto', animation: 'fadeUp 0.6s ease both' }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#E8B84B', marginBottom: 22 }}>
            Empire OS · Pricing &amp; Packages
          </div>
          <h1 className="pkg-hero" style={{ fontSize: 68, fontWeight: 900, lineHeight: 1.03, letterSpacing: '-0.03em', maxWidth: 820, marginBottom: 24 }}>
            What you get,<br />and what it costs.
          </h1>
          <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, maxWidth: 580 }}>
            Four engagement models. Every build is 90 days, on-site scoped, and delivered
            with full IP transfer. Price is fixed at the end of the Week 1–2 audit.
          </p>
        </section>

        {/* TIER CARDS */}
        <section className="pkg-pad" style={{ padding: '0 40px 88px', maxWidth: 1100, margin: '0 auto' }}>
          <div className="tier-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, alignItems: 'start' }}>
            {TIERS.map((tier) => (
              <div
                key={tier.id}
                style={{
                  background: tier.featured ? '#0F1120' : '#0D0F1E',
                  border: tier.featured
                    ? '1px solid rgba(245,138,31,0.30)'
                    : tier.id === 'custom'
                    ? '1px solid rgba(255,255,255,0.08)'
                    : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 14,
                  padding: '28px 24px',
                  position: 'relative',
                  ...(tier.featured ? { boxShadow: '0 0 0 1px rgba(245,138,31,0.12), 0 8px 32px rgba(0,0,0,0.35)' } : {}),
                }}
              >
                {tier.badge && (
                  <div style={{
                    position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)',
                    background: tier.featured ? '#E8B84B' : 'rgba(255,255,255,0.12)',
                    color: tier.featured ? '#0B0D17' : '#FFFFFF',
                    fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase',
                    padding: '3px 12px', borderRadius: 20, whiteSpace: 'nowrap',
                  }}>{tier.badge}</div>
                )}

                <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: tier.featured ? '#E8B84B' : 'rgba(255,255,255,0.40)', marginBottom: 14 }}>
                  {tier.label}
                </div>

                <div style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: tier.id === 'custom' ? 32 : 44, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.02em', color: '#FFFFFF' }}>{tier.price}</span>
                  {tier.id !== 'custom' && (
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontWeight: 600, marginLeft: 6 }}>{tier.per}</span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginBottom: 18 }}>{tier.annual}</div>

                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, marginBottom: 22, minHeight: 80 }}>
                  {tier.desc}
                </p>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {tier.includes.map((item) => (
                    <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                      <svg width="13" height="13" fill="none" viewBox="0 0 16 16" style={{ flexShrink: 0, marginTop: 2 }}>
                        <circle cx="8" cy="8" r="7.5" stroke={tier.featured ? '#E8B84B' : 'rgba(255,255,255,0.18)'} strokeWidth="1"/>
                        <path d="M4.5 8l2.5 2.5 4-5" stroke={tier.featured ? '#E8B84B' : 'rgba(255,255,255,0.40)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.45 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>
            All engagements begin with a 2-week on-site scope. Final price confirmed before build begins.
          </p>
        </section>

        {/* MODULE BREAKDOWN */}
        <section style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="pkg-pad" style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 40px' }}>
            <div style={{ marginBottom: 48 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: 14 }}>What&apos;s Inside Each Module</div>
              <h2 style={{ fontSize: 48, fontWeight: 900, lineHeight: 1.06, letterSpacing: '-0.025em' }}>
                Every module is a complete system.
              </h2>
            </div>

            <div className="module-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
              {MODULES.map((mod) => (
                <div key={mod.id} style={{ background: '#0D0F1E', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden' }}>
                  <div style={{ height: 3, background: mod.color }} />
                  <div style={{ padding: '24px 22px 28px' }}>
                    <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.01em', marginBottom: 6 }}>{mod.label}</div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.40)', marginBottom: 24, lineHeight: 1.45 }}>{mod.tagline}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {mod.pieces.map((piece) => (
                        <div key={piece.title}>
                          <div style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF', marginBottom: 3 }}>{piece.title}</div>
                          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.42)', lineHeight: 1.55 }}>{piece.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RETAINER */}
        <section style={{ background: '#0F1120', borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="pkg-pad" style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 40px' }}>
            <div className="retainer-cols" style={{ display: 'flex', alignItems: 'flex-start', gap: 56, flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 360px', minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: 16 }}>Ongoing Partnership</div>
                <h2 style={{ fontSize: 44, fontWeight: 900, lineHeight: 1.06, letterSpacing: '-0.025em', marginBottom: 20 }}>
                  AI Implementation<br />Partner Retainer
                </h2>
                <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, maxWidth: 480 }}>
                  For companies that want Meritage Partners as a standing member of the team —
                  not just a one-time build partner. We act as your in-house AI function:
                  expanding coverage, maintaining systems, building new automations as the
                  business evolves, and keeping model outputs reliable as your data changes.
                </p>
              </div>

              <div style={{ flex: '1 1 300px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { title: 'Dedicated build capacity', desc: 'Reserved hours each month — your work moves first, no queuing.' },
                  { title: 'System maintenance', desc: 'Model drift monitoring, integration health checks, output QA.' },
                  { title: 'New automation development', desc: 'Expand into new functions, workflows, or data sources on a rolling roadmap.' },
                  { title: 'Quarterly strategic advisory', desc: 'Roadmap sessions, ROI tracking, and guidance on where AI moves the needle next.' },
                ].map((item) => (
                  <div key={item.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '16px 18px', background: '#0B0D17', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#E8B84B', flexShrink: 0, marginTop: 8 }} />
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF', marginBottom: 3 }}>{item.title}</div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.55 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* INTEGRATIONS */}
        <section>
          <div className="pkg-pad" style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 40px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, marginBottom: 36 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: 14 }}>Integrations</div>
                <h2 style={{ fontSize: 40, fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.02em' }}>
                  Plugs into your existing stack.
                </h2>
                <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, maxWidth: 540, marginTop: 12 }}>
                  Native APIs for everything listed below. Custom pipelines built during the engagement for anything else. No rip-and-replace.
                </p>
              </div>
              <div style={{ padding: '14px 20px', background: '#0D0F1E', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10 }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginBottom: 4 }}>Pre-built connectors</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: '#FFFFFF', lineHeight: 1 }}>40+</div>
              </div>
            </div>

            <div className="int-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
              {INTEGRATION_CATEGORIES.map((group) => (
                <div key={group.category} style={{ background: '#0D0F1E', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '16px 18px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: group.color }} />
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.32)', marginBottom: 10, marginTop: 2 }}>{group.category}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {group.tools.map((tool) => (
                      <span key={tool} style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.60)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 5, padding: '4px 9px' }}>{tool}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: '#0F1120', padding: '88px 40px', textAlign: 'center' }}>
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <h2 style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.025em', marginBottom: 16 }}>
              Ready to scope<br />your build?
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', lineHeight: 1.70, marginBottom: 40 }}>
              Every engagement starts with a 2-week on-site scoping session. No commitment beyond scope.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => router.push('/how-it-works')} style={{ padding: '15px 40px', background: '#E8B84B', color: '#0B0D17', border: 'none', borderRadius: 9, fontSize: 14, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>
                How It Works
              </button>
            </div>
          </div>
        </section>

        <div style={{ background: '#0B0D17', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '22px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.04em' }}>Empire OS · Pricing &amp; Packages</span>
        </div>
      </div>
    </>
  );
}
