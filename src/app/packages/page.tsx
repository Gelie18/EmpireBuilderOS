'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function TopBar() {
  const router = useRouter();
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(26,28,46,0.97)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255,255,255,0.10)',
      padding: '0 40px',
      height: 60,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <button
        onClick={() => router.push('/demo-hub')}
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.50)', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', fontFamily: 'inherit', padding: 0, textTransform: 'uppercase' }}
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Demo Hub
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <button onClick={() => router.push('/how-it-works')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.50)', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', fontFamily: 'inherit', padding: 0, textTransform: 'uppercase' }}>
          How It Works
        </button>
        <button onClick={() => router.push('/demo-hub')} style={{ background: '#E8B84B', border: 'none', borderRadius: 7, padding: '8px 20px', color: '#1A1C2E', fontSize: 12, fontWeight: 800, letterSpacing: '0.10em', fontFamily: 'inherit', cursor: 'pointer', textTransform: 'uppercase' }}>
          Exit
        </button>
      </div>
    </header>
  );
}

const PACKAGES = [
  {
    id: 'finance',
    label: 'Finance OS',
    tagline: 'Stop assembling reports. Start doing strategy.',
    bg: '#1D44BF',
    textColor: '#FFFFFF',
    accentColor: '#E8B84B',
    subColor: 'rgba(255,255,255,0.65)',
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
      { title: 'AI CFO Assistant', desc: 'Ask questions about your financials in plain English. Answers trained on your actual data.' },
      { title: 'Cash Flow Forecasting', desc: 'Rolling 12-month forecast built from real payment cycles and revenue trends.' },
    ],
  },
  {
    id: 'hr',
    label: 'HR OS',
    tagline: 'People leaders answering strategy, not policy questions.',
    bg: '#FFFFFF',
    textColor: '#1A1C2E',
    accentColor: '#0A8A5C',
    subColor: '#555',
    duration: '90-Day Build · On-Site Scoping',
    problem: 'People leaders answering repetitive questions instead of building culture and retention. Every policy question pulls a manager off the work that matters.',
    payoff: '20–30 hrs/wk back + one People Ops hire avoided',
    payoffValue: '~$200K/yr in value',
    demoLink: '#',
    hasDemoLink: false,
    pieces: [
      { title: 'Employee-Facing AI Assistant', desc: 'Answers policy questions, PTO requests, and HR FAQs instantly — 24/7, without involving a people lead.' },
      { title: 'Onboarding + Offboarding', desc: 'Fully automated from offer acceptance to Day 90. Equipment, access, intros, and check-ins — handled.' },
      { title: 'Handbook Bot', desc: 'Your policies, your voice — searchable by any employee at any time without digging through PDFs.' },
      { title: 'HRIS Integration', desc: 'Connects to Rippling, Gusto, Workday, or BambooHR. AI sits on top of your existing system.' },
      { title: 'Manager Insights', desc: 'Aggregated team signals — engagement, sentiment, open requests — surfaced in a single dashboard.' },
      { title: 'Compliance Checks', desc: 'Automated reminders and audit trails for certifications, I-9s, performance cycles, and renewals.' },
    ],
  },
  {
    id: 'ops',
    label: 'Ops OS',
    tagline: 'Stop status chasing. Start building the company.',
    bg: '#1A1C2E',
    textColor: '#FFFFFF',
    accentColor: '#E8B84B',
    subColor: 'rgba(255,255,255,0.60)',
    duration: '90-Day Build · On-Site Scoping',
    problem: 'CEO and operators pulled into status chasing and vendor tracking week after week instead of building the company. The business runs on update meetings.',
    payoff: '25+ hrs/wk back + next Ops/PM hire avoided',
    payoffValue: '~$190K/yr in value',
    demoLink: '#',
    hasDemoLink: false,
    pieces: [
      { title: 'Automated Status Rollups', desc: 'Every project summarized weekly — pulled from Notion, Slack, Asana — no update meetings required.' },
      { title: 'Vendor & Contract Tracking', desc: 'Renewal dates, rate changes, and contract terms surfaced automatically. No spreadsheet archaeology.' },
      { title: 'Workflow Automation', desc: 'Recurring ops tasks — approval chains, routing, escalation — automated end to end.' },
      { title: 'Exception Alerting', desc: 'AI monitors thresholds across inventory, fulfillment, and vendor performance. Notified when action is needed.' },
      { title: 'SOP Assistant', desc: 'Your standard operating procedures — searchable, updatable, surfaced in context when your team needs them.' },
      { title: 'Exec Ops Dashboard', desc: 'One view of company-wide operational health: projects, blockers, utilization, and vendor risk.' },
    ],
  },
  {
    id: 'suite',
    label: 'Full Suite',
    tagline: 'All three functions. One integrated system.',
    bg: '#E8B84B',
    textColor: '#1A1C2E',
    accentColor: '#1D44BF',
    subColor: 'rgba(26,28,46,0.65)',
    duration: '90-Day Build · All Three Functions',
    problem: 'Executive team running the business instead of building it. No unified visibility across Finance, HR, and Operations — just three separate reporting silos.',
    payoff: '60–95 hrs/wk back across the org + 2–3 hires avoided',
    payoffValue: '~$600K+/yr in value',
    demoLink: '#',
    hasDemoLink: false,
    isFeatured: true,
    pieces: [
      { title: 'All Three Functions Integrated', desc: 'Finance OS + HR OS + Ops OS built concurrently on a shared data layer — insights flow across the business.' },
      { title: 'Unified Exec Dashboard', desc: 'One place to see financial health, people metrics, and operational status — updated automatically.' },
      { title: 'Company-Wide AI', desc: 'A single AI trained on your entire business that any team member or executive can query.' },
      { title: 'Shared Data Layer', desc: 'All three systems write to a common data model, enabling cross-functional analysis impossible with disconnected tools.' },
      { title: 'Quarterly Strategic Reviews', desc: 'Each quarter we review performance, identify expansion, and update the system as the business evolves.' },
      { title: 'Priority Build Queue', desc: 'Full Suite clients receive first access to new automation modules and dedicated build capacity.' },
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
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #1A1C2E !important; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }

        @media (max-width: 768px) {
          .pkg-inner { flex-direction: column !important; }
          .pkg-features { grid-template-columns: 1fr !important; }
          .hero-h1 { font-size: 48px !important; }
        }
      `}</style>

      <div style={{ background: '#1A1C2E', fontFamily: '"DM Sans", system-ui, sans-serif', overflowX: 'hidden' }}>
        <TopBar />

        {/* ── HERO ── */}
        <section style={{ padding: '96px 40px 80px', maxWidth: 1100, margin: '0 auto', animation: 'fadeUp 0.7s ease both' }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#E8B84B', marginBottom: 24 }}>
            Empire Builder · Packages
          </div>
          <h1 className="hero-h1" style={{ fontSize: 72, fontWeight: 900, color: '#FFFFFF', lineHeight: 1.02, letterSpacing: '-0.03em', maxWidth: 860, marginBottom: 28 }}>
            Pick the function.<br />
            <span style={{ color: '#1D44BF' }}>We'll build the system.</span>
          </h1>
          <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.50)', lineHeight: 1.65, maxWidth: 560 }}>
            Every engagement is 90 days, on-site scoped, and built on your actual data.
            Start with one function or go full suite.
          </p>
        </section>

        {/* ── PACKAGES ── */}
        {PACKAGES.map((pkg, idx) => (
          <section key={pkg.id} style={{ background: pkg.bg }}>
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 40px' }}>

              {/* Header row */}
              <div className="pkg-inner" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 48, marginBottom: 56, flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 480px' }}>
                  {pkg.isFeatured && (
                    <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 800, letterSpacing: '0.16em', color: '#1D44BF', background: 'rgba(29,68,191,0.12)', border: '1px solid rgba(29,68,191,0.30)', borderRadius: 4, padding: '4px 10px', marginBottom: 16, textTransform: 'uppercase' }}>
                      Best Value
                    </span>
                  )}
                  <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: pkg.accentColor, marginBottom: 12 }}>{pkg.duration}</div>
                  <h2 style={{ fontSize: 60, fontWeight: 900, color: pkg.textColor, lineHeight: 1.0, letterSpacing: '-0.03em', marginBottom: 12 }}>{pkg.label}</h2>
                  <p style={{ fontSize: 20, fontWeight: 700, color: pkg.accentColor, marginBottom: 20 }}>{pkg.tagline}</p>
                  <p style={{ fontSize: 16, color: pkg.subColor, lineHeight: 1.7, maxWidth: 500 }}>{pkg.problem}</p>
                </div>

                {/* Payoff card */}
                <div style={{
                  background: idx === 0 ? 'rgba(255,255,255,0.10)' : idx === 1 ? '#F4F6FF' : idx === 2 ? 'rgba(255,255,255,0.06)' : 'rgba(26,28,46,0.12)',
                  border: `2px solid ${idx === 1 ? '#D0D8FF' : 'rgba(255,255,255,0.15)'}`,
                  borderRadius: 14,
                  padding: '32px 32px',
                  minWidth: 280,
                  flexShrink: 0,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: pkg.id === 'hr' ? '#888' : 'rgba(255,255,255,0.45)', marginBottom: 10 }}>The Payoff</div>
                  <p style={{ fontSize: 15, color: pkg.id === 'hr' ? '#333' : 'rgba(255,255,255,0.80)', lineHeight: 1.55, marginBottom: 16 }}>{pkg.payoff}</p>
                  <div style={{ fontSize: 28, fontWeight: 900, color: pkg.accentColor, letterSpacing: '-0.01em' }}>{pkg.payoffValue}</div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: idx === 1 ? '#E8EEFF' : 'rgba(255,255,255,0.10)', marginBottom: 48 }} />

              {/* Features label */}
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: idx === 1 ? '#AAB' : 'rgba(255,255,255,0.30)', marginBottom: 28 }}>What&apos;s Inside</div>

              {/* Feature grid */}
              <div className="pkg-features" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
                {pkg.pieces.map((piece) => (
                  <div key={piece.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: pkg.accentColor, flexShrink: 0, marginTop: 6 }} />
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: pkg.textColor, marginBottom: 6, lineHeight: 1.2 }}>{piece.title}</div>
                      <div style={{ fontSize: 14, color: pkg.subColor, lineHeight: 1.6 }}>{piece.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Demo CTA */}
              {pkg.hasDemoLink && (
                <div style={{ marginTop: 52 }}>
                  <button
                    onClick={() => router.push(pkg.demoLink)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 36px', background: '#E8B84B', border: 'none', borderRadius: 9, color: '#1A1C2E', fontSize: 14, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    Launch Live Demo
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </section>
        ))}

        {/* ── BOTTOM CTA ── */}
        <section style={{ background: '#1D44BF', padding: '96px 40px', textAlign: 'center' }}>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.20em', textTransform: 'uppercase', color: '#E8B84B', marginBottom: 20 }}>Next Step</div>
            <h2 style={{ fontSize: 60, fontWeight: 900, color: '#FFFFFF', lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 16 }}>
              Ready to scope<br />
              <span style={{ color: '#E8B84B' }}>your build?</span>
            </h2>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.60)', lineHeight: 1.65, marginBottom: 44 }}>
              Every engagement starts with a 2-week on-site scoping session.
              No commitment beyond the scope phase.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="mailto:info@783partners.com"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '18px 44px', background: '#E8B84B', color: '#1A1C2E', borderRadius: 10, fontSize: 15, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none' }}
              >
                Get in Touch
              </a>
              <button
                onClick={() => router.push('/how-it-works')}
                style={{ padding: '18px 44px', background: 'transparent', color: '#FFFFFF', border: '2px solid rgba(255,255,255,0.30)', borderRadius: 10, fontSize: 15, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                How It Works
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div style={{ background: '#0F1120', padding: '24px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.04em' }}>Empire Builder OS · 783 Capital Partners</span>
          <a href="mailto:info@783partners.com" style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', letterSpacing: '0.04em' }}>info@783partners.com</a>
        </div>
      </div>
    </>
  );
}
