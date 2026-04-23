'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function TopBar() {
  const router = useRouter();
  return (
    <header style={{
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
        <button onClick={() => router.push('/faq')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', fontFamily: 'inherit', padding: 0, textTransform: 'uppercase' }}>FAQ</button>
        <button onClick={() => router.push('/packages')} style={{ background: '#F58A1F', border: 'none', borderRadius: 7, padding: '8px 20px', color: '#0B0D17', fontSize: 12, fontWeight: 800, letterSpacing: '0.10em', fontFamily: 'inherit', cursor: 'pointer', textTransform: 'uppercase' }}>
          Packages
        </button>
      </div>
    </header>
  );
}

const PHASES = [
  {
    num: '01',
    label: 'Scope & Audit',
    duration: 'Weeks 1–2',
    mode: 'On-site',
    color: '#1B4DE6',
    summary: 'We come to you. Two weeks on-site to map your systems, assess data quality, and lock the build plan before a single line of code is written.',
    weDeliver: [
      'On-site discovery with Finance, HR, and Ops leads',
      'Full data audit across all connected systems',
      'Signed build spec with confirmed integrations and timeline',
    ],
    youProvide: [
      'One internal owner with system access and approval authority',
      'Read-only credentials for accounting, HRIS, and commerce systems',
      '24 months of P&L — flag anything you know looks off',
    ],
    gate: 'Signed build spec. Every integration confirmed. Timeline locked.',
  },
  {
    num: '02',
    label: 'Build',
    duration: 'Weeks 3–8',
    mode: 'Remote',
    color: '#4FA8FF',
    summary: 'The core work happens remotely. We build every integration, train AI on your actual data, and construct the dashboards and automations defined in scope.',
    weDeliver: [
      'All API integrations and live data pipelines',
      'AI trained on your GL structure, naming, and product catalog',
      'Dashboards and automations for every OS module in scope',
    ],
    youProvide: [
      'Available for async questions — typically 1–2 per week',
      'Validate early dashboard outputs against what you know to be true',
      'Approve major UI decisions at Week 4 and Week 6 checkpoints',
    ],
    gate: 'Functional system in staging. All integrations live. Internal review.',
  },
  {
    num: '03',
    label: 'Deploy & Train',
    duration: 'Weeks 9–12',
    mode: 'On-site + Remote',
    color: '#0A6A3C',
    summary: 'We deploy to production, run team training sessions, and hold two weeks of hypercare before signing off and transferring full ownership to you.',
    weDeliver: [
      'Production deployment and final integration QA',
      'Role-specific training sessions for exec, finance, HR, and ops',
      'Full IP transfer — code, models, dashboards, and docs on Day 90',
    ],
    youProvide: [
      'Attend training and designate an internal admin per module',
      'Run the system live with us during the two-week hypercare window',
      'Sign off on the Day 90 handover checklist',
    ],
    gate: 'Live in production. Full IP transfer. You own it.',
  },
];

const DATA_ACCESS = [
  {
    category: 'Accounting / ERP',
    color: '#1B4DE6',
    systems: 'QuickBooks · NetSuite · Sage Intacct · Xero',
    access: 'Read-only API key or admin login',
    data: '24 months of P&L, balance sheet, AP/AR history',
  },
  {
    category: 'HRIS / Payroll',
    color: '#4FA8FF',
    systems: 'Rippling · Gusto · BambooHR · ADP · Workday',
    access: 'HR admin API access or employee record export',
    data: 'Full roster, titles, departments, comp, PTO balances',
  },
  {
    category: 'Commerce / POS',
    color: '#B38A00',
    systems: 'Shopify · BigCommerce · Faire · Amazon Seller',
    access: 'Read-only API key per storefront',
    data: '24 months of orders, SKU-level revenue, returns, channels',
  },
  {
    category: 'Inventory / WMS',
    color: '#5B21B6',
    systems: 'ShipBob · Cin7 · DEAR · 3PL WMS · Spreadsheets',
    access: 'API connection or CSV export',
    data: 'On-hand by location, cost basis per SKU, PO history',
  },
  {
    category: 'Spend / AP',
    color: '#0A5A8A',
    systems: 'Ramp · Brex · Bill.com · Expensify',
    access: 'Read access to card feed and AP inbox',
    data: 'Vendor transactions, GL codes, approval status — 12 months',
  },
  {
    category: 'Banking',
    color: '#374151',
    systems: 'Plaid (preferred) · Mercury · Chase · CSV exports',
    access: 'Read-only Plaid connection or monthly CSV',
    data: 'Daily cash positions, LOC draws, wire history — 12 months',
  },
];

const DATA_TIERS = [
  {
    label: 'Tier 1',
    sublabel: 'Clean',
    color: '#165E36',
    desc: 'Single system of record per function. Consistent coding. You can pull a report without fixing it first.',
    impact: 'Connect Week 1, AI training starts immediately.',
  },
  {
    label: 'Tier 2',
    sublabel: 'Workable',
    color: '#8A5A0F',
    desc: 'Data is in the right systems but has gaps — some miscoded transactions, duplicate vendors, catch-all GL accounts.',
    impact: 'Cleanup sprint runs alongside scoping. Adds ~5 days. Most common.',
  },
  {
    label: 'Tier 3',
    sublabel: 'Spreadsheet-Heavy',
    color: '#8A1C16',
    desc: 'Key numbers live in spreadsheets. Financials require a human to compile each month.',
    impact: 'Migration layer scoped into the engagement. Adds 2–3 weeks.',
  },
];

export default function OnboardingPage() {
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
          .phase-cols { flex-direction: column !important; }
          .data-grid { grid-template-columns: 1fr !important; }
          .tier-grid { grid-template-columns: 1fr !important; }
          .handover-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .ob-topbar { padding: 0 16px !important; }
          .ob-hero h1 { font-size: 42px !important; }
          .ob-pad { padding: 56px 20px !important; }
          .phase-num { font-size: 100px !important; }
          .phase-title { font-size: 36px !important; }
          .handover-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ background: '#0B0D17', color: '#FFFFFF', fontFamily: '"DM Sans", system-ui, sans-serif', overflowX: 'hidden' }}>
        <TopBar />

        {/* HERO */}
        <section className="ob-pad" style={{ padding: '96px 40px 80px', maxWidth: 1000, margin: '0 auto', animation: 'fadeUp 0.6s ease both' }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#F58A1F', marginBottom: 24 }}>
            783 OS · Engagement Plan
          </div>
          <h1 style={{ fontSize: 72, fontWeight: 900, lineHeight: 1.02, letterSpacing: '-0.03em', marginBottom: 28 }}>
            Signed to live<br />in 90 days.
          </h1>
          <p style={{ fontSize: 21, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, maxWidth: 560 }}>
            Three phases. On-site scoping, remote build, production deploy.
            If we miss Day 90 through any fault of ours — you get 25% back.
          </p>
        </section>

        {/* PHASE BLOCKS */}
        {PHASES.map((phase, i) => (
          <section key={phase.num} style={{
            borderTop: '1px solid rgba(255,255,255,0.07)',
            background: i % 2 === 1 ? '#0D0F1E' : '#0B0D17',
          }}>
            <div className="ob-pad" style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 40px' }}>

              {/* Phase number + title row */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 0, marginBottom: 16, overflow: 'hidden' }}>
                <div className="phase-num" style={{
                  fontSize: 140, fontWeight: 900, lineHeight: 1,
                  color: `${phase.color}20`,
                  letterSpacing: '-0.05em',
                  marginRight: 8,
                  flexShrink: 0,
                  userSelect: 'none',
                }}>
                  {phase.num}
                </div>
                <div style={{ paddingBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: phase.color }}>
                      {phase.duration}
                    </span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)', fontWeight: 600, letterSpacing: '0.04em' }}>
                      {phase.mode}
                    </span>
                  </div>
                  <div className="phase-title" style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.05, color: '#FFFFFF' }}>
                    {phase.label}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.60)', lineHeight: 1.65, maxWidth: 680, marginBottom: 48 }}>
                {phase.summary}
              </p>

              {/* Two columns */}
              <div className="phase-cols" style={{ display: 'flex', gap: 20, marginBottom: 32 }}>
                <div style={{ flex: 1, background: `${phase.color}0D`, border: `1px solid ${phase.color}30`, borderRadius: 12, padding: '32px 32px' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: phase.color, marginBottom: 24 }}>
                    What we deliver
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    {phase.weDeliver.map((item) => (
                      <div key={item} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: phase.color, flexShrink: 0, marginTop: 9 }} />
                        <span style={{ fontSize: 17, color: 'rgba(255,255,255,0.80)', lineHeight: 1.55 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '32px 32px' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)', marginBottom: 24 }}>
                    What you provide
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    {phase.youProvide.map((item) => (
                      <div key={item} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', flexShrink: 0, marginTop: 9 }} />
                        <span style={{ fontSize: 17, color: 'rgba(255,255,255,0.55)', lineHeight: 1.55 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Phase gate */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 12,
                padding: '14px 22px',
                background: `${phase.color}12`,
                border: `1px solid ${phase.color}35`,
                borderRadius: 8,
              }}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={phase.color} strokeWidth="2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontSize: 15, color: phase.color, fontWeight: 700 }}>Gate: </span>
                <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)' }}>{phase.gate}</span>
              </div>

              {/* System access — only Phase 1 */}
              {i === 0 && (
                <div style={{ marginTop: 64 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: 28 }}>
                    System access required at kickoff
                  </div>
                  <div className="data-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                    {DATA_ACCESS.map((s) => (
                      <div key={s.category} style={{
                        background: '#0B0D17',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderLeft: `3px solid ${s.color}`,
                        borderRadius: 10,
                        padding: '20px 22px',
                      }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF', marginBottom: 4 }}>{s.category}</div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.30)', marginBottom: 14 }}>{s.systems}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.60)' }}>
                            <span style={{ fontWeight: 700, color: 'rgba(255,255,255,0.35)', fontSize: 11, letterSpacing: '0.10em', textTransform: 'uppercase', marginRight: 8 }}>Access</span>
                            {s.access}
                          </div>
                          <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.60)' }}>
                            <span style={{ fontWeight: 700, color: 'rgba(255,255,255,0.35)', fontSize: 11, letterSpacing: '0.10em', textTransform: 'uppercase', marginRight: 8 }}>Data</span>
                            {s.data}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        ))}

        {/* DATA QUALITY */}
        <section style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: '#0F1120' }}>
          <div className="ob-pad" style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 40px' }}>
            <div style={{ marginBottom: 52 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: 16 }}>Data Quality</div>
              <h2 style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.025em', marginBottom: 16 }}>
                We work with what you have.
              </h2>
              <p style={{ fontSize: 19, color: 'rgba(255,255,255,0.50)', lineHeight: 1.65, maxWidth: 560 }}>
                Assessed in Week 1–2 and priced into scope. Most clients are a Tier 2.
                We have never walked away from an engagement because of data quality.
              </p>
            </div>

            <div className="tier-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {DATA_TIERS.map((t) => (
                <div key={t.label} style={{
                  background: '#0B0D17',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderTop: `3px solid ${t.color}`,
                  borderRadius: 12,
                  padding: '28px 26px',
                }}>
                  <div style={{ marginBottom: 16 }}>
                    <span style={{ fontSize: 28, fontWeight: 900, color: t.color, letterSpacing: '-0.01em' }}>{t.label}</span>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontWeight: 600, marginLeft: 10 }}>{t.sublabel}</span>
                  </div>
                  <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', lineHeight: 1.65, marginBottom: 20 }}>{t.desc}</p>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 16, fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.55 }}>
                    {t.impact}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DAY 90 HANDOVER */}
        <section style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="ob-pad" style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 40px' }}>
            <div style={{ marginBottom: 52 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: 16 }}>Day 90</div>
              <h2 style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.025em' }}>
                You own everything.
              </h2>
            </div>

            <div className="handover-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
              {[
                { title: 'Full IP transfer', body: 'Every line of code, model, dashboard, and automation transferred and signed over. No licensing, no hooks.' },
                { title: 'System docs', body: 'Integration map, data flow, admin guide. Any developer you hire can pick it up.' },
                { title: 'Owner credentials', body: 'Admin access to every environment. No dependency on us to run or modify anything.' },
                { title: 'Zero lock-in', body: 'Run it yourself, hire someone, or keep us on retainer. All three fully supported.' },
              ].map((item) => (
                <div key={item.title} style={{
                  background: '#0D0F1E',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12,
                  padding: '26px 24px',
                }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF', marginBottom: 12 }}>{item.title}</div>
                  <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.50)', lineHeight: 1.60 }}>{item.body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: '#0F1120', padding: '88px 40px', textAlign: 'center' }}>
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <h2 style={{ fontSize: 56, fontWeight: 900, lineHeight: 1.04, letterSpacing: '-0.025em', marginBottom: 18 }}>
              Ready to start<br />the 90 days?
            </h2>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.50)', lineHeight: 1.70, marginBottom: 44 }}>
              The scope phase is the only commitment. We confirm feasibility, price the build, and you decide.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="mailto:info@783capital.com"
                style={{ display: 'inline-block', padding: '16px 42px', background: '#F58A1F', color: '#0B0D17', borderRadius: 9, fontSize: 15, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none' }}
              >
                Get in Touch
              </a>
              <button
                onClick={() => router.push('/packages')}
                style={{ padding: '16px 42px', background: 'transparent', color: 'rgba(255,255,255,0.70)', border: '1px solid rgba(255,255,255,0.20)', borderRadius: 9, fontSize: 15, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                See Packages
              </button>
            </div>
          </div>
        </section>

        <div style={{ background: '#0B0D17', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '22px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.04em' }}>783 OS · Engagement Plan</span>
          <a href="mailto:info@783capital.com" style={{ fontSize: 13, color: 'rgba(255,255,255,0.28)', textDecoration: 'none', letterSpacing: '0.04em' }}>info@783capital.com</a>
        </div>
      </div>
    </>
  );
}
