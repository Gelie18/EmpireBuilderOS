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
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.65)', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', fontFamily: 'inherit', padding: 0, textTransform: 'uppercase' }}
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Demo Hub
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <button onClick={() => router.push('/how-it-works')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.65)', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', fontFamily: 'inherit', padding: 0, textTransform: 'uppercase' }}>How It Works</button>
        <button onClick={() => router.push('/onboarding')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.65)', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', fontFamily: 'inherit', padding: 0, textTransform: 'uppercase' }}>Onboarding</button>
        <button onClick={() => router.push('/packages')} style={{ background: '#F58A1F', border: 'none', borderRadius: 7, padding: '8px 20px', color: '#0B0D17', fontSize: 12, fontWeight: 800, letterSpacing: '0.10em', fontFamily: 'inherit', cursor: 'pointer', textTransform: 'uppercase' }}>
          Packages
        </button>
      </div>
    </header>
  );
}

type FaqItem = { q: string; a: string | React.ReactNode; big?: boolean };

const FAQS: FaqItem[] = [
  {
    q: "What is 783 OS?",
    a: "An operating system for your business — not software you buy, but a custom-built environment we build on top of your existing systems. Finance OS gives your CFO real-time P&L, cash flow, and variance analysis. HR OS gives every employee an AI advisor for their benefits, comp, and goals. Ops OS keeps fulfillment, inventory, and customer health in one view. Each module is trained on your actual data and wired to your actual tools.",
  },
  {
    q: "How long does the build take?",
    a: "90 days from signed engagement to live in production. Weeks 1–2: on-site scope and data audit. Weeks 3–8: integrations, AI training, dashboards, automations. Weeks 9–12: deploy, train your team, two-week hypercare. If we miss Day 90 through any fault of ours, you get 25% of the engagement fee back. We have never triggered that clause.",
  },
  {
    q: "Do we need to replace our existing systems?",
    a: "No. We build on top of whatever you have — QuickBooks, NetSuite, Rippling, Shopify, ShipBob, Salesforce, whatever. We connect via API, pull the data, and build intelligence on top. Nothing gets ripped out. The only thing that changes is how much visibility and automation you have.",
  },
  {
    q: "What data do you need access to?",
    a: "Read-only access to your accounting system, HRIS/payroll, commerce platform, and any inventory or spend tools. Full breakdown on the onboarding page — but in short: if you can log into it and see the numbers, we can connect to it.",
  },
  {
    q: "What does 'trained on our data' actually mean?",
    a: "We fine-tune AI on your historical records, naming conventions, GL structure, department breakdown, vendor list, and product catalog — so when someone asks 'what drove the margin dip in Q3?' the answer references your actual line items, not a generic explanation. It also means the AI doesn't hallucinate your data — it only answers what it can source from your systems.",
  },
  {
    q: "Who owns the IP?",
    a: "You do. 100%. Every line of code, every dashboard, every automation, every prompt is transferred to you on Day 90. We sign an IP assignment as part of the engagement letter. You can run it, modify it, or hire someone else to maintain it. We have no license hooks, no usage fees, no lock-in.",
  },
  {
    q: "How do you handle data security?",
    a: "We work inside your environment wherever possible. Credentials go into your shared 1Password vault — not ours. All data transfer is encrypted in transit and at rest. We sign an NDA before the scope begins. We don't store your production data on 783 Partners infrastructure. You can revoke all access the moment the engagement ends.",
  },
  {
    q: "What happens after Day 90?",
    a: "You're live and you own it. Most clients keep a 10–15 hour/month retainer for the first quarter — minor iteration, new data sources, and QA on model outputs as your business evolves. After that, some run it themselves and some keep us on a lighter touch. No obligation either way.",
  },
  {
    q: "Can you connect to [specific tool]?",
    a: "If it has an API, webhook, or a database we can read from — yes. We have 40+ pre-built connectors and build custom ones during the engagement at no extra cost. If you're using something deeply obscure, we'll tell you in scope week whether it's doable. In 4 years we have said 'we can't connect to that' exactly twice.",
  },
  {
    q: "Is this only for enterprise companies?",
    a: "No. Most of our clients are mid-market — $5M to $150M in revenue, 30 to 300 employees. That's actually the sweet spot: big enough to have real complexity, not so big that you have a 40-person internal data team that's already solved all of this. Enterprise companies need a different kind of engagement.",
  },
  {
    q: "What if our data is a mess?",
    a: "We scope for it. See the onboarding page for the three data quality tiers — Tier 2 (the most common) adds about a week to the timeline. Tier 3 (spreadsheet-heavy) adds 2–3 weeks and usually requires a light migration sprint. We've never walked away from a client because of data quality. We price it honestly and build the cleanup in.",
  },
  {
    q: "What's the demo we're looking at right now?",
    a: "This is Seager Apparel, a $28M direct-to-consumer and wholesale apparel brand. Finance OS shows their live P&L, cash flow, AR/AP aging, unit economics, and budget vs actual. HR OS has their full headcount, comp bands, onboarding tracker, review cycle, and an always-on AI advisor for every employee. Ops OS covers fulfillment SLA, support queue, inventory, returns, and customer health. All data is synthetic but modeled on real company structures.",
  },
  {
    big: true,
    q: "What else can you build?",
    a: (
      <>
        <p style={{ fontSize: 22, fontWeight: 800, color: '#F58A1F', lineHeight: 1.45, marginBottom: 20 }}>
          Basically anything.
        </p>
        <p style={{ marginBottom: 16, color: 'rgba(255,255,255,0.75)', lineHeight: 1.75 }}>
          If a human does it on a schedule using data from a system — we can automate it. Commission
          calculations. Board deck population. Renewal reminders. Contract redlines. Inventory
          reconciliation. Variance narratives. Compliance checklists. Investor updates. Payroll
          reconciliation. Anomaly alerts. Cash flow forecasting. Pricing updates. Customer health
          scoring. SOP maintenance. PO tracking. AR/AP aging. Sales pipeline summaries. NPS
          aggregation. Chargeback dispute prep. Onboarding document generation.
        </p>
        <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.75 }}>
          The constraint isn&apos;t what AI can do — it&apos;s making sure the output is reliable
          enough to act on. That&apos;s the actual work we do: building the data pipeline, the
          validation layer, and the interface so your team gets answers they trust, not suggestions
          they have to re-verify from scratch.
        </p>
        <p style={{ marginTop: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, fontSize: 15 }}>
          Bring us the thing your team hates doing most. That&apos;s usually where we start.
        </p>
      </>
    ),
  },
];

function FaqCard({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(item.big ?? false);
  return (
    <div
      style={{
        background: item.big ? '#0F1120' : '#0F1120',
        border: item.big ? '1px solid rgba(245,138,31,0.25)' : '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12,
        overflow: 'hidden',
        borderLeft: item.big ? '4px solid #F58A1F' : undefined,
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%', textAlign: 'left', padding: '22px 26px',
          background: 'transparent', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20,
          fontFamily: 'inherit',
        }}
      >
        <span style={{ fontSize: item.big ? 22 : 17, fontWeight: item.big ? 900 : 700, color: item.big ? '#F58A1F' : '#FFFFFF', lineHeight: 1.35, letterSpacing: item.big ? '-0.01em' : undefined }}>
          {item.q}
        </span>
        <span style={{ color: 'rgba(255,255,255,0.40)', fontSize: 20, flexShrink: 0, transition: 'transform 0.2s', display: 'block', transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
      </button>
      {open && (
        <div style={{ padding: '0 26px 24px', color: 'rgba(255,255,255,0.70)', fontSize: 15, lineHeight: 1.75 }}>
          {typeof item.a === 'string' ? <p>{item.a}</p> : item.a}
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
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
        @media (max-width: 768px) {
          .faq-topbar { padding: 0 16px !important; }
          .faq-hero { padding: 60px 16px 44px !important; }
          .faq-hero h1 { font-size: 40px !important; }
          .faq-body { padding: 56px 16px 72px !important; }
        }
      `}</style>

      <div style={{ background: '#0B0D17', color: '#FFFFFF', fontFamily: '"DM Sans", system-ui, sans-serif', overflowX: 'hidden' }}>
        <TopBar />

        {/* HERO */}
        <section className="faq-hero" style={{ padding: '88px 40px 64px', maxWidth: 900, margin: '0 auto', animation: 'fadeUp 0.6s ease both' }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#F58A1F', marginBottom: 22 }}>
            Frequently Asked Questions
          </div>
          <h1 style={{ fontSize: 68, fontWeight: 900, lineHeight: 1.03, letterSpacing: '-0.03em', marginBottom: 26 }}>
            Every question<br />we&apos;ve been asked.
          </h1>
          <p style={{ fontSize: 19, color: 'rgba(255,255,255,0.55)', lineHeight: 1.70, maxWidth: 580 }}>
            Honest answers. No sales-page hedging. If the answer is &ldquo;it depends,&rdquo; we explain what it depends on.
          </p>
        </section>

        {/* FAQ LIST */}
        <div className="faq-body" style={{ maxWidth: 900, margin: '0 auto', padding: '0 40px 88px' }}>
          <div style={{ display: 'grid', gap: 10 }}>
            {FAQS.map((item) => (
              <FaqCard key={item.q} item={item} />
            ))}
          </div>
        </div>

        {/* CTA STRIP */}
        <section style={{ background: '#1B4DE6', padding: '72px 40px', textAlign: 'center' }}>
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <h2 style={{ fontSize: 48, fontWeight: 900, color: '#FFFFFF', lineHeight: 1.08, letterSpacing: '-0.025em', marginBottom: 16 }}>
              Still have a question?
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.72)', lineHeight: 1.65, marginBottom: 36 }}>
              Ask it. We answer every one.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="mailto:info@783capital.com" style={{ padding: '15px 38px', background: '#F58A1F', color: '#0B0D17', border: 'none', borderRadius: 9, fontSize: 14, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'none', display: 'inline-block' }}>
                Email Us
              </a>
              <button onClick={() => router.push('/packages')} style={{ padding: '15px 38px', background: 'transparent', color: '#FFFFFF', border: '2px solid rgba(255,255,255,0.35)', borderRadius: 9, fontSize: 14, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>
                See Packages
              </button>
            </div>
          </div>
        </section>

        <div style={{ background: '#0F1120', padding: '22px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.04em' }}>783 OS · FAQ</span>
          <a href="mailto:info@783capital.com" style={{ fontSize: 13, color: 'rgba(255,255,255,0.28)', textDecoration: 'none', letterSpacing: '0.04em' }}>info@783capital.com</a>
        </div>
      </div>
    </>
  );
}
