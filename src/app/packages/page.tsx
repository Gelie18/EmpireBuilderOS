'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function TopBar() {
  const router = useRouter();
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(26,28,46,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      padding: '0 24px',
      height: 52,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <button
        onClick={() => router.push('/demo-hub')}
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', fontFamily: 'inherit', padding: 0, textTransform: 'uppercase' }}
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Demo Hub
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <button
          onClick={() => router.push('/how-it-works')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', fontFamily: 'inherit', padding: 0, textTransform: 'uppercase' }}
        >
          How It Works
        </button>
        <button
          onClick={() => router.push('/demo-hub')}
          style={{ background: 'rgba(232,184,75,0.12)', border: '1px solid rgba(232,184,75,0.30)', borderRadius: 6, padding: '6px 14px', color: '#E8B84B', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', fontFamily: 'inherit', cursor: 'pointer', textTransform: 'uppercase' }}
        >
          Exit Demo
        </button>
      </div>
    </header>
  );
}

const PACKAGES = [
  {
    id: 'finance',
    label: 'Finance OS',
    color: '#1D44BF',
    colorBg: 'rgba(29,68,191,0.08)',
    colorBorder: 'rgba(29,68,191,0.25)',
    duration: '90-Day Build · On-Site Scoping',
    problem: 'Your finance team assembles reports instead of doing strategy. 15 to 40 hours a week lost to work a machine can do.',
    payoff: 'Finance team back on strategy + next finance hire avoided',
    payoffValue: '~$220K/yr in value',
    demoLink: '/dashboard',
    hasDemoLink: true,
    pieces: [
      { title: 'Live Exec Dashboard', desc: 'Real-time KPIs, cash position, and P&L — always current, no manual assembly.' },
      { title: 'Automated Board Deck', desc: 'Monthly board materials auto-populated from your financials. Reviewed, not built.' },
      { title: 'Variance + Anomaly Alerts', desc: 'AI flags every meaningful deviation — spend, margin, vendor — before it becomes a problem.' },
      { title: 'ERP Integration', desc: 'Connects to QuickBooks, NetSuite, Sage Intacct, and Ramp. Your data, your systems.' },
      { title: 'AI CFO Assistant', desc: 'Ask questions about your financials in plain English. Get answers trained on your actual data.' },
      { title: 'Cash Flow Forecasting', desc: 'Rolling 12-month forecast built from real payment cycles and revenue trends.' },
    ],
  },
  {
    id: 'hr',
    label: 'HR OS',
    color: '#0A8A5C',
    colorBg: 'rgba(10,138,92,0.08)',
    colorBorder: 'rgba(10,138,92,0.25)',
    duration: '90-Day Build · On-Site Scoping',
    problem: 'People leaders answering repetitive questions instead of building culture and retention. Every policy question pulls a manager off the work that matters.',
    payoff: '20–30 hrs/wk back + one People Ops hire avoided',
    payoffValue: '~$200K/yr in value',
    demoLink: '#',
    hasDemoLink: false,
    pieces: [
      { title: 'Employee-Facing AI Assistant', desc: 'Answers policy questions, PTO requests, and HR FAQs instantly — 24/7, without involving a people lead.' },
      { title: 'Onboarding + Offboarding Workflows', desc: 'Fully automated from offer acceptance to Day 90. Equipment, access, intros, and check-ins — handled.' },
      { title: 'Handbook Bot', desc: 'Your policies, your voice — searchable by any employee at any time without digging through PDFs.' },
      { title: 'HRIS Integration', desc: 'Connects to Rippling, Gusto, Workday, or BambooHR. AI sits on top of your existing system.' },
      { title: 'Manager Insights', desc: 'Aggregated team signals — engagement, sentiment, open requests — surfaced in a single dashboard.' },
      { title: 'Compliance Checks', desc: 'Automated reminders and audit trails for certifications, I-9s, performance cycles, and renewals.' },
    ],
  },
  {
    id: 'ops',
    label: 'Ops OS',
    color: '#7C3AED',
    colorBg: 'rgba(124,58,237,0.08)',
    colorBorder: 'rgba(124,58,237,0.25)',
    duration: '90-Day Build · On-Site Scoping',
    problem: 'CEO and operators pulled into status chasing and vendor tracking week after week instead of building the company. The business runs on update meetings.',
    payoff: '25+ hrs/wk back + next Ops/PM hire avoided',
    payoffValue: '~$190K/yr in value',
    demoLink: '#',
    hasDemoLink: false,
    pieces: [
      { title: 'Automated Status Rollups', desc: 'Every project, team, and initiative summarized weekly — pulled from Notion, Slack, Asana — no update meetings required.' },
      { title: 'Vendor & Contract Tracking', desc: 'Renewal dates, rate changes, and contract terms surfaced automatically. No spreadsheet archaeology.' },
      { title: 'Workflow Automation', desc: 'Recurring ops tasks — approval chains, routing, escalation — automated end to end.' },
      { title: 'Exception Alerting', desc: 'AI monitors thresholds across inventory, fulfillment, and vendor performance. You\'re notified only when action is needed.' },
      { title: 'SOP Assistant', desc: 'Your standard operating procedures — searchable, updatable, and surfaced in context when your team needs them.' },
      { title: 'Exec Ops Dashboard', desc: 'One view of company-wide operational health: projects, blockers, team utilization, and vendor risk.' },
    ],
  },
  {
    id: 'suite',
    label: 'Full Suite',
    color: '#E8B84B',
    colorBg: 'rgba(232,184,75,0.08)',
    colorBorder: 'rgba(232,184,75,0.30)',
    duration: '90-Day Build · All Three Functions',
    problem: 'Executive team running the business instead of building it. No unified visibility across Finance, HR, and Operations — just three separate reporting silos.',
    payoff: '60–95 hrs/wk back across the org + 2–3 hires avoided',
    payoffValue: '~$600K+/yr in value',
    demoLink: '#',
    hasDemoLink: false,
    isFeatured: true,
    pieces: [
      { title: 'All Three Functions Integrated', desc: 'Finance OS + HR OS + Ops OS built concurrently on a shared data layer — so insights flow across the business, not just within silos.' },
      { title: 'Unified Exec Dashboard', desc: 'One place to see financial health, people metrics, and operational status. Built for the executive team, updated automatically.' },
      { title: 'Company-Wide AI', desc: 'A single AI trained on your entire business — financials, people data, ops workflows — that any team member or executive can query.' },
      { title: 'Shared Data Layer', desc: 'All three systems write to a common data model, enabling cross-functional analysis that\'s impossible with disconnected tools.' },
      { title: 'Quarterly Strategic Reviews', desc: 'Each quarter we review performance, identify expansion opportunities, and update the system as the business evolves.' },
      { title: 'Priority Build Queue', desc: 'Full Suite clients receive first access to new automation modules and dedicated build capacity for ongoing expansion.' },
    ],
  },
];

export default function PackagesPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #1A1C2E !important; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#1A1C2E', color: '#FFFFFF', fontFamily: '"DM Sans", system-ui, sans-serif' }}>
        <TopBar />

        {/* Hero */}
        <section style={{ padding: '72px 24px 56px', textAlign: 'center', maxWidth: 640, margin: '0 auto', animation: 'fadeUp 0.6s ease both' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E8B84B', marginBottom: 16 }}>
            Empire Builder · Packages
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 900, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 16 }}>
            Pick the function. We'll build the system.
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.50)', lineHeight: 1.7 }}>
            Every engagement is 90 days, on-site scoped, and built on your actual data.
            Start with one function or go full suite.
          </p>
        </section>

        {/* Package cards */}
        <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {PACKAGES.map((pkg, idx) => (
              <div
                key={pkg.id}
                style={{
                  background: pkg.isFeatured ? `rgba(232,184,75,0.04)` : 'rgba(255,255,255,0.025)',
                  border: `1px solid ${pkg.isFeatured ? 'rgba(232,184,75,0.25)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 14,
                  overflow: 'hidden',
                  animation: `fadeUp 0.6s ${0.1 + idx * 0.08}s ease both`,
                }}
              >
                {/* Top accent line */}
                <div style={{ height: 3, background: `linear-gradient(90deg, ${pkg.color}, ${pkg.color}80)` }} />

                {/* Card header */}
                <div style={{ padding: '28px 32px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                  <div style={{ flex: 1, minWidth: 240 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <h2 style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.01em' }}>{pkg.label}</h2>
                      {pkg.isFeatured && (
                        <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.12em', color: '#E8B84B', background: 'rgba(232,184,75,0.15)', border: '1px solid rgba(232,184,75,0.35)', borderRadius: 4, padding: '3px 7px' }}>BEST VALUE</span>
                      )}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: pkg.color, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>{pkg.duration}</div>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.50)', lineHeight: 1.65, maxWidth: 420 }}>{pkg.problem}</p>
                  </div>

                  {/* Payoff box */}
                  <div style={{ background: pkg.colorBg, border: `1px solid ${pkg.colorBorder}`, borderRadius: 10, padding: '16px 20px', minWidth: 200, flexShrink: 0 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.40)', marginBottom: 6 }}>The Payoff</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5, marginBottom: 10 }}>{pkg.payoff}</div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: pkg.color }}>{pkg.payoffValue}</div>
                  </div>
                </div>

                {/* Feature grid */}
                <div style={{ padding: '24px 32px 28px' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)', marginBottom: 18 }}>What's Inside</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
                    {pkg.pieces.map((piece) => (
                      <div key={piece.title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: pkg.color, flexShrink: 0, marginTop: 5 }} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF', marginBottom: 3 }}>{piece.title}</div>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.55 }}>{piece.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Demo link for Finance OS */}
                  {pkg.hasDemoLink && (
                    <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <button
                        onClick={() => router.push(pkg.demoLink)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: pkg.colorBg, border: `1px solid ${pkg.colorBorder}`, borderRadius: 7, color: pkg.color, fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Launch Live Demo
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.07)', padding: '64px 24px 80px', textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#E8B84B', marginBottom: 16 }}>Next Step</div>
          <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12, letterSpacing: '-0.01em' }}>Ready to scope your build?</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, maxWidth: 440, margin: '0 auto 32px' }}>
            Every engagement starts with a 2-week on-site scoping session.
            No commitment beyond the scope phase.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="mailto:info@783partners.com"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', background: '#E8B84B', color: '#1A1C2E', borderRadius: 8, fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none' }}
            >
              Get in Touch
            </a>
            <button
              onClick={() => router.push('/how-it-works')}
              style={{ padding: '13px 28px', background: 'transparent', color: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              How It Works
            </button>
          </div>
        </section>

        {/* Footer */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '20px 24px', textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.06em' }}>
          Empire Builder OS · 783 Capital Partners · info@783partners.com
        </div>
      </div>
    </>
  );
}
