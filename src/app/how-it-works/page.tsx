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
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={() => router.push('/demo-hub')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', fontFamily: 'inherit', padding: 0, textTransform: 'uppercase' }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Demo Hub
        </button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <button
          onClick={() => router.push('/packages')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', fontFamily: 'inherit', padding: 0, textTransform: 'uppercase' }}
        >
          Packages
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

const STATS = [
  { value: '80%', label: 'Automated', sub: 'Repetitive work handled by AI' },
  { value: '20%', label: 'Human Judgement', sub: 'Strategic decisions retained by your team' },
  { value: '10×', label: 'More Productive', sub: 'Efficiency multiplier across Finance, Ops & HR' },
];

const PHASES = [
  {
    num: '01',
    weeks: 'Weeks 1–2',
    title: 'Scope',
    subtitle: 'Map the function',
    desc: 'We embed on-site with your team to audit existing workflows, identify automation opportunities, and produce a signed build plan. You know exactly what gets built before a single line of code is written.',
    items: ['Workflow audit', 'Opportunity map', 'Signed build plan', 'ROI projection'],
  },
  {
    num: '02',
    weeks: 'Weeks 3–8',
    title: 'Build',
    subtitle: 'Build on your data',
    desc: 'Our team trains AI on your actual data, wires integrations to your existing systems, and builds dashboards and automations inside your environment. No generic templates — everything is built to your workflows.',
    items: ['AI trained on your data', 'Dashboards + alerts', 'ERP / HRIS integrations', 'Embedded build — no handoff lag'],
  },
  {
    num: '03',
    weeks: 'Weeks 9–12',
    title: 'Ship & Extend',
    subtitle: 'Deploy and iterate',
    desc: 'We go live in production, run hands-on team training, and stay in hypercare for two weeks. The final readout maps what\'s working and where we expand in Q2.',
    items: ['Live in production', 'Team training', 'Hypercare period', 'Quarterly expansion plan'],
  },
];

const INTEGRATIONS = [
  { category: 'Finance', tools: ['QuickBooks', 'NetSuite', 'Sage Intacct', 'Ramp'] },
  { category: 'HR & People', tools: ['Rippling', 'Gusto', 'Workday', 'BambooHR'] },
  { category: 'Ops & Data', tools: ['Notion', 'Slack', 'Airtable', 'Google Workspace'] },
];

const EXAMPLES = [
  'Commission calculation', 'Pricing updates', 'Customer onboarding',
  'Compliance checks', 'Inventory reconciliation', 'Contract redlines',
  'Investor updates', 'Expense coding', 'Renewal reminders',
  'KPI dashboards', 'Variance narratives', 'Board deck population',
  'Anomaly alerts', 'Vendor tracking', 'SOP maintenance',
];

export default function HowItWorksPage() {
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
        <section style={{ padding: '72px 24px 64px', textAlign: 'center', maxWidth: 720, margin: '0 auto', animation: 'fadeUp 0.6s ease both' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E8B84B', marginBottom: 16 }}>
            Empire Builder · How It Works
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 18 }}>
            We automate the work your Finance,<br />
            <span style={{ color: '#1D44BF' }}>HR & Ops teams</span> do every week
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
            Most companies aren't losing to competitors. They're losing to their own administrative burden.
            We eliminate it — systematically, in 90 days.
          </p>
        </section>

        {/* Stats bar */}
        <section style={{ borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ maxWidth: 860, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', animation: 'fadeUp 0.6s 0.1s ease both' }}>
            {STATS.map((s, i) => (
              <div key={s.value} style={{
                padding: '36px 24px',
                textAlign: 'center',
                borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              }}>
                <div style={{ fontSize: 44, fontWeight: 900, color: '#1D44BF', lineHeight: 1, letterSpacing: '-0.02em' }}>{s.value}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF', marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.40)', marginTop: 4, lineHeight: 1.5 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* What we do */}
        <section style={{ maxWidth: 860, margin: '0 auto', padding: '72px 24px 56px', animation: 'fadeUp 0.6s 0.15s ease both' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#E8B84B', marginBottom: 14 }}>What We Build</div>
              <h2 style={{ fontSize: 30, fontWeight: 900, lineHeight: 1.2, letterSpacing: '-0.01em', marginBottom: 16 }}>
                AI that lives inside your existing workflows
              </h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 20 }}>
                We don't sell software subscriptions or plug-in tools. We embed our team inside your business,
                build custom AI on your actual data, and hand you a live system — in 90 days.
              </p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
                Every engagement covers a specific function: Finance, HR, or Operations. Each one is trained
                on your data, connected to your existing platforms, and built to match how your team actually works.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: '📊', text: 'Variance analysis with AI-written narrative' },
                { icon: '🚨', text: 'Anomaly alerts on spend, margin & vendors' },
                { icon: '📋', text: 'Monthly board deck auto-population' },
                { icon: '💸', text: 'Cash flow forecasting from payment cycles' },
                { icon: '🤖', text: 'Employee-facing AI for HR & onboarding' },
                { icon: '⚙️', text: 'Automated status rollups for Ops & PM' },
              ].map((item) => (
                <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8 }}>
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.70)', lineHeight: 1.4 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3-phase process */}
        <section style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '72px 24px' }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 52 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#E8B84B', marginBottom: 12 }}>The Engagement Model</div>
              <h2 style={{ fontSize: 30, fontWeight: 900, letterSpacing: '-0.01em' }}>A 90-day build. Guaranteed live.</h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginTop: 10 }}>25% fee credit if the live system isn't delivered by Day 90.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {PHASES.map((phase, i) => (
                <div key={phase.num} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 12, padding: '28px 24px', position: 'relative', overflow: 'hidden' }}>
                  {/* Accent line */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, #1D44BF, #E8B84B)`, opacity: 0.6 + i * 0.2 }} />
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.25)', marginBottom: 4 }}>PHASE {phase.num}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.10em', color: '#E8B84B', textTransform: 'uppercase', marginBottom: 12 }}>{phase.weeks}</div>
                  <h3 style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF', marginBottom: 4 }}>{phase.title}</h3>
                  <div style={{ fontSize: 12, color: '#1D44BF', fontWeight: 600, marginBottom: 14, letterSpacing: '0.04em' }}>{phase.subtitle}</div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.50)', lineHeight: 1.65, marginBottom: 18 }}>{phase.desc}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {phase.items.map((item) => (
                      <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#1D44BF', flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.60)' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What can be automated */}
        <section style={{ maxWidth: 860, margin: '0 auto', padding: '72px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#E8B84B', marginBottom: 12 }}>What Gets Automated</div>
            <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.01em' }}>If your team does it every week on a schedule, we automate it.</h2>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {EXAMPLES.map((ex) => (
              <span key={ex} style={{
                fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.65)',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 6, padding: '7px 14px',
              }}>
                {ex}
              </span>
            ))}
            <span style={{
              fontSize: 12, fontWeight: 700, color: '#1D44BF',
              background: 'rgba(29,68,191,0.08)', border: '1px solid rgba(29,68,191,0.25)',
              borderRadius: 6, padding: '7px 14px',
            }}>
              + anything else →
            </span>
          </div>
        </section>

        {/* Integrations */}
        <section style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.07)', padding: '64px 24px' }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#E8B84B', marginBottom: 12 }}>Integrations</div>
              <h2 style={{ fontSize: 24, fontWeight: 900 }}>Built on your existing stack</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {INTEGRATIONS.map((group) => (
                <div key={group.category} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '20px 20px' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#E8B84B', marginBottom: 14 }}>{group.category}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {group.tools.map((tool) => (
                      <div key={tool} style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>{tool}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ textAlign: 'center', padding: '80px 24px 96px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#E8B84B', marginBottom: 16 }}>Ready to See It Live?</div>
          <h2 style={{ fontSize: 30, fontWeight: 900, marginBottom: 12, letterSpacing: '-0.01em' }}>Let's get your time back.</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 32, lineHeight: 1.6 }}>
            Explore the Finance OS demo or review the packages to find the right starting point.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => router.push('/dashboard')}
              style={{ padding: '13px 28px', background: '#1D44BF', color: '#FFFFFF', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              View Finance OS Demo
            </button>
            <button
              onClick={() => router.push('/packages')}
              style={{ padding: '13px 28px', background: 'transparent', color: '#E8B84B', border: '1px solid rgba(232,184,75,0.40)', borderRadius: 8, fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              See Packages
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
