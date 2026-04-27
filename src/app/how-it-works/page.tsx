'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function TopBar() {
  const router = useRouter();
  return (
    <header className="hiw-topbar" style={{
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
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-chart-text)', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', fontFamily: 'inherit', padding: 0, textTransform: 'uppercase' }}
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Demo Hub
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <button onClick={() => router.push('/onboarding')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-chart-text)', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', fontFamily: 'inherit', padding: 0, textTransform: 'uppercase' }}>
          Onboarding
        </button>
        <button onClick={() => router.push('/faq')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-chart-text)', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', fontFamily: 'inherit', padding: 0, textTransform: 'uppercase' }}>
          FAQ
        </button>
        <button onClick={() => router.push('/packages')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-chart-text)', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', fontFamily: 'inherit', padding: 0, textTransform: 'uppercase' }}>
          Packages
        </button>
        <button onClick={() => router.push('/demo-hub')} style={{ background: '#E8B84B', border: 'none', borderRadius: 7, padding: '8px 20px', color: '#0B0D17', fontSize: 12, fontWeight: 800, letterSpacing: '0.10em', fontFamily: 'inherit', cursor: 'pointer', textTransform: 'uppercase' }}>
          Exit
        </button>
      </div>
    </header>
  );
}

const PHASES = [
  {
    num: '01',
    weeks: 'Weeks 1–2',
    title: 'Scope',
    subtitle: 'Map the function',
    color: '#1D44BF',
    desc: 'We embed on-site with your team to audit existing workflows, identify automation opportunities, and produce a signed build plan. You know exactly what gets built before a single line of code is written.',
    items: ['On-site workflow audit', 'Full opportunity map', 'Signed build plan', 'ROI projection'],
  },
  {
    num: '02',
    weeks: 'Weeks 3–8',
    title: 'Build',
    subtitle: 'Build on your data',
    color: '#1D44BF',
    desc: 'Our team trains AI on your actual data, wires integrations to your existing systems, and builds dashboards and automations inside your environment. No generic templates — everything is built to your workflows.',
    items: ['AI trained on your data', 'Dashboards + alerts live', 'ERP / HRIS integrations', 'Embedded build — no lag'],
  },
  {
    num: '03',
    weeks: 'Weeks 9–12',
    title: 'Ship',
    subtitle: 'Deploy and iterate',
    color: '#E8B84B',
    desc: "We go live in production, run hands-on team training, and stay in hypercare for two weeks. The final readout maps what's working and where we expand next quarter.",
    items: ['Live in production', 'Team training session', 'Two-week hypercare', 'Quarterly expansion plan'],
  },
];

const EXAMPLES = [
  'Commission calculation', 'Pricing updates', 'Customer onboarding',
  'Compliance checks', 'Inventory reconciliation', 'Contract redlines',
  'Investor updates', 'Expense coding', 'Renewal reminders',
  'KPI dashboards', 'Variance narratives', 'Board deck population',
  'Anomaly alerts', 'Vendor tracking', 'SOP maintenance',
  'Cash flow forecasting', 'Payroll reconciliation', 'AR/AP aging',
];

const INTEGRATIONS = [
  { category: 'Accounting / ERP', color: '#1D44BF', tools: ['QuickBooks', 'NetSuite', 'Sage Intacct', 'Xero', 'Microsoft Dynamics', 'Oracle NetLedger'] },
  { category: 'HRIS / Payroll', color: '#0A8A5C', tools: ['Rippling', 'Gusto', 'Workday', 'BambooHR', 'ADP', 'Paychex', 'Justworks'] },
  { category: 'Commerce', color: '#E8B84B', tools: ['Shopify', 'BigCommerce', 'WooCommerce', 'Amazon Seller Central', 'Faire', 'Square', 'Etsy'] },
  { category: 'Spend / Cards', color: '#7C3AED', tools: ['Ramp', 'Brex', 'Bill.com', 'Expensify', 'Divvy', 'Airbase'] },
  { category: 'Banking / Payments', color: '#0A6AB0', tools: ['Stripe', 'Plaid', 'Mercury', 'Chase', 'Wise', 'Modern Treasury'] },
  { category: 'Ops / CRM / Data', color: '#1D44BF', tools: ['Shopify Flow', 'HubSpot', 'Salesforce', 'Notion', 'Slack', 'Airtable', 'Google Workspace', 'Microsoft 365'] },
];

export default function HowItWorksPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0B0D17 !important; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }

        @media (max-width: 768px) {
          .stat-grid { grid-template-columns: 1fr !important; }
          .two-col { grid-template-columns: 1fr !important; }
          .phase-grid { grid-template-columns: 1fr !important; }
          .int-grid { grid-template-columns: 1fr !important; }
          .hero-h1 { font-size: 38px !important; }
          .stat-val { font-size: 72px !important; }
          .hiw-topbar { padding: 0 16px !important; }
          .hiw-hero { padding: 52px 16px 44px !important; }
          .hiw-section { padding: 56px 16px !important; }
          .hiw-h2 { font-size: 32px !important; }
          .hiw-h2-lg { font-size: 36px !important; }
          .hiw-cta-h2 { font-size: 40px !important; }
          .hiw-stat-cell { padding: 36px 24px !important; border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.15) !important; }
          .hiw-footer { padding: 20px 16px !important; flex-direction: column !important; align-items: flex-start !important; }
        }
      `}</style>

      <div style={{ background: '#0B0D17', color: '#FFFFFF', fontFamily: '"DM Sans", system-ui, sans-serif', overflowX: 'hidden' }}>
        <TopBar />

        {/* ── HERO ── */}
        <section className="hiw-hero" style={{ padding: '96px 40px 80px', maxWidth: 1100, margin: '0 auto', animation: 'fadeUp 0.7s ease both' }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#E8B84B', marginBottom: 24 }}>
            Empire OS · How It Works
          </div>
          <h1 className="hero-h1" style={{ fontSize: 72, fontWeight: 900, lineHeight: 1.02, letterSpacing: '-0.03em', maxWidth: 900, marginBottom: 32 }}>
            We automate the work your team does{' '}
            <span style={{ color: '#1D44BF' }}>every single week.</span>
          </h1>
          <p style={{ fontSize: 20, color: 'var(--color-chart-text)', lineHeight: 1.65, maxWidth: 620, marginBottom: 44 }}>
            Most companies aren't losing to competitors. They're losing to their own
            administrative burden. We eliminate it — systematically, in 90 days.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button onClick={() => router.push('/packages')} style={{ padding: '16px 36px', background: '#E8B84B', color: '#0B0D17', border: 'none', borderRadius: 9, fontSize: 14, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>
              See Packages
            </button>
            <button onClick={() => router.push('/dashboard')} style={{ padding: '16px 36px', background: 'transparent', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.20)', borderRadius: 9, fontSize: 14, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>
              View Finance Demo
            </button>
          </div>
        </section>

        {/* ── STATS BAR ── */}
        <section style={{ background: '#1D44BF', padding: '0' }}>
          <div className="stat-grid" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)' }}>
            {[
              { val: '80%', label: 'Automated', sub: 'Repetitive work handled by AI' },
              { val: '20%', label: 'Human Judgement', sub: 'Strategic decisions stay with your team' },
              { val: '10×', label: 'More Productive', sub: 'Efficiency multiplier across Finance, Ops & HR' },
            ].map((s, i) => (
              <div key={s.val} className="hiw-stat-cell" style={{ padding: '56px 48px', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.15)' : 'none', textAlign: 'center' }}>
                <div className="stat-val" style={{ fontSize: 104, fontWeight: 900, color: '#FFFFFF', lineHeight: 1, letterSpacing: '-0.04em' }}>{s.val}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#E8B84B', marginTop: 10, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{s.label}</div>
                <div style={{ fontSize: 14, color: 'var(--color-chart-text)', marginTop: 6, lineHeight: 1.5 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── WHAT WE BUILD ── */}
        <section className="hiw-section" style={{ background: '#FFFFFF', padding: '96px 40px' }}>
          <div className="two-col" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.20em', textTransform: 'uppercase', color: '#1D44BF', marginBottom: 20 }}>What We Build</div>
              <h2 className="hiw-h2" style={{ fontSize: 52, fontWeight: 900, color: '#0B0D17', lineHeight: 1.08, letterSpacing: '-0.025em', marginBottom: 24 }}>
                AI that lives inside your existing workflows.
              </h2>
              <p style={{ fontSize: 17, color: '#444', lineHeight: 1.75, marginBottom: 20 }}>
                We don't sell software subscriptions or plug-in tools. We embed our team inside your
                business, build custom AI on your actual data, and hand you a live system — in 90 days.
              </p>
              <p style={{ fontSize: 17, color: '#444', lineHeight: 1.75 }}>
                Every engagement covers a specific function: Finance, HR, or Operations. Each one is
                trained on your data, connected to your existing platforms, and built to match how your
                team actually works.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'Variance analysis with AI-written narrative',
                'Anomaly alerts on spend, margin & vendors',
                'Monthly board deck auto-population',
                'Cash flow forecasting from payment cycles',
                'Employee-facing AI for HR & onboarding',
                'Automated status rollups for Ops & PM',
              ].map((text) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: '#F4F6FF', border: '1px solid #E0E6FF', borderRadius: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1D44BF', flexShrink: 0 }} />
                  <span style={{ fontSize: 15, color: '#0B0D17', fontWeight: 600, lineHeight: 1.4 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3-PHASE PROCESS ── */}
        <section className="hiw-section" style={{ background: '#0B0D17', padding: '96px 40px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ marginBottom: 64 }}>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.20em', textTransform: 'uppercase', color: '#E8B84B', marginBottom: 18 }}>The Engagement Model</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                <h2 className="hiw-h2-lg" style={{ fontSize: 56, fontWeight: 900, color: '#FFFFFF', lineHeight: 1.05, letterSpacing: '-0.025em' }}>
                  A 90-day build.<br />
                  <span style={{ color: '#E8B84B' }}>Guaranteed live.</span>
                </h2>
                <div style={{ padding: '16px 24px', background: 'rgba(245,138,31,0.10)', border: '1px solid rgba(245,138,31,0.30)', borderRadius: 10 }}>
                  <div style={{ fontSize: 13, color: 'var(--color-chart-text)', marginBottom: 4 }}>Delivery guarantee</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#E8B84B' }}>25% fee credit if not live by Day 90</div>
                </div>
              </div>
            </div>

            <div className="phase-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2 }}>
              {PHASES.map((phase, i) => (
                <div key={phase.num} style={{
                  background: i === 2 ? '#E8B84B' : i === 1 ? '#1D44BF' : '#0F1120',
                  padding: '52px 44px',
                  border: i === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                }}>
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.18em', color: i === 2 ? 'rgba(11,13,23,0.50)' : 'rgba(255,255,255,0.30)', marginBottom: 6 }}>PHASE {phase.num}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: i === 2 ? '#0B0D17' : '#E8B84B', marginBottom: 18 }}>{phase.weeks}</div>
                  <div style={{ fontSize: 52, fontWeight: 900, color: i === 2 ? '#0B0D17' : '#FFFFFF', lineHeight: 1, marginBottom: 6, letterSpacing: '-0.025em' }}>{phase.title}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: i === 2 ? 'rgba(11,13,23,0.65)' : 'rgba(255,255,255,0.55)', marginBottom: 24 }}>{phase.subtitle}</div>
                  <p style={{ fontSize: 15, color: i === 2 ? 'rgba(11,13,23,0.75)' : 'rgba(255,255,255,0.70)', lineHeight: 1.7, marginBottom: 28 }}>{phase.desc}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {phase.items.map((item) => (
                      <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: i === 2 ? '#0B0D17' : '#E8B84B', flexShrink: 0 }} />
                        <span style={{ fontSize: 14, fontWeight: 600, color: i === 2 ? '#0B0D17' : 'rgba(255,255,255,0.80)' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHAT GETS AUTOMATED ── */}
        <section className="hiw-section" style={{ background: '#F4F6FF', padding: '96px 40px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ marginBottom: 52 }}>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.20em', textTransform: 'uppercase', color: '#1D44BF', marginBottom: 16 }}>What Gets Automated</div>
              <h2 className="hiw-h2" style={{ fontSize: 52, fontWeight: 900, color: '#0B0D17', lineHeight: 1.08, letterSpacing: '-0.025em', maxWidth: 700 }}>
                If your team does it on a schedule, we automate it.
              </h2>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {EXAMPLES.map((ex) => (
                <span key={ex} style={{ fontSize: 15, fontWeight: 600, color: '#0B0D17', background: '#FFFFFF', border: '1.5px solid #D0D8FF', borderRadius: 8, padding: '10px 18px', letterSpacing: '0.01em' }}>
                  {ex}
                </span>
              ))}
              <span style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF', background: '#1D44BF', border: '1.5px solid #1D44BF', borderRadius: 8, padding: '10px 18px' }}>
                + anything else →
              </span>
            </div>
          </div>
        </section>

        {/* ── INTEGRATIONS ── */}
        <section className="hiw-section" style={{ background: '#0B0D17', padding: '96px 40px' }}>
          <div style={{ maxWidth: 1180, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, marginBottom: 56 }}>
              <div style={{ maxWidth: 720 }}>
                <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.20em', textTransform: 'uppercase', color: '#E8B84B', marginBottom: 18 }}>API + Integrations</div>
                <h2 className="hiw-h2" style={{ fontSize: 52, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.025em', lineHeight: 1.08, marginBottom: 18 }}>
                  We plug into every system<br />your business already runs on.
                </h2>
                <p style={{ fontSize: 17, color: 'var(--color-chart-text)', lineHeight: 1.7, maxWidth: 640 }}>
                  Your ERP, HRIS, accounting, Shopify storefronts, banks, payroll, CRM — we connect to them
                  via native APIs, keep them in sync, and build AI and dashboards on top. No rip-and-replace.
                  No data migration project. Your stack, supercharged.
                </p>
              </div>
              <div style={{ padding: '18px 24px', background: 'rgba(245,138,31,0.10)', border: '1px solid rgba(245,138,31,0.30)', borderRadius: 10, minWidth: 220 }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', color: 'var(--color-chart-text)', textTransform: 'uppercase', marginBottom: 8 }}>Pre-built connectors</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: '#E8B84B', lineHeight: 1, letterSpacing: '-0.02em' }}>40+</div>
                <div style={{ fontSize: 13, color: 'var(--color-chart-text)', marginTop: 6 }}>Anything else, we custom-build.</div>
              </div>
            </div>

            <div className="int-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
              {INTEGRATIONS.map((group) => (
                <div key={group.category} style={{ background: '#FFFFFF', borderRadius: 12, padding: '28px 28px', overflow: 'hidden', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: group.color }} />
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: group.color, marginBottom: 20, marginTop: 4 }}>{group.category}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {group.tools.map((tool) => (
                      <span key={tool} style={{ fontSize: 13, fontWeight: 700, color: '#0B0D17', background: '#F4F6FF', border: '1px solid #E0E6FF', borderRadius: 6, padding: '7px 12px', letterSpacing: '0.01em' }}>{tool}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 32, padding: '22px 28px', background: 'rgba(27,77,230,0.08)', border: '1px solid rgba(27,77,230,0.25)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
              <div style={{ width: 42, height: 42, borderRadius: 8, background: 'rgba(27,77,230,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="22" height="22" fill="none" stroke="#1D44BF" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.71" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF', marginBottom: 4 }}>Don&apos;t see your system?</div>
                <div style={{ fontSize: 14, color: 'var(--color-chart-text)', lineHeight: 1.5 }}>
                  If it has an API, webhook, or database — we build a connector during the 90-day engagement. Custom pipelines included.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="hiw-section" style={{ background: '#1D44BF', padding: '96px 40px', textAlign: 'center' }}>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <h2 className="hiw-cta-h2" style={{ fontSize: 64, fontWeight: 900, color: '#FFFFFF', lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 20 }}>
              Let's get your<br />
              <span style={{ color: '#E8B84B' }}>time back.</span>
            </h2>
            <p style={{ fontSize: 18, color: 'var(--color-chart-text)', lineHeight: 1.65, marginBottom: 44 }}>
              Explore the Finance OS demo or review the packages to find the right starting point.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => router.push('/packages')} style={{ padding: '18px 44px', background: '#E8B84B', color: '#0B0D17', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>
                See Packages
              </button>
              <button onClick={() => router.push('/dashboard')} style={{ padding: '18px 44px', background: 'transparent', color: '#FFFFFF', border: '2px solid rgba(255,255,255,0.35)', borderRadius: 10, fontSize: 15, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>
                View Finance Demo
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="hiw-footer" style={{ background: '#0F1120', padding: '24px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 13, color: 'var(--color-chart-text)', letterSpacing: '0.04em' }}>Empire OS · Meritage Partners</span>
        </div>
      </div>
    </>
  );
}
