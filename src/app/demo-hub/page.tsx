'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import BLCircleLogo from '@/components/brand/BLCircleLogo';
// Note: BrandLogo only supports 'horizontal' | 'stacked' — using BLCircleLogo directly

const CRIMSON = '#1B4DE6';
const NAVY    = '#4FA8FF';
const WHITE   = '#FFFFFF';

const DEMOS = [
  {
    id: 'finance',
    label: 'Finance OS',
    tag: 'LIVE DEMO',
    desc: 'Consolidated P&L across every brand, drill into any subco, SKU rationalization, channel mix, and an AI CFO that answers in plain English.',
    href: '/brief',
    accent: NAVY,
    accentLight: 'rgba(79,168,255,0.07)',
    icon: (
      <svg width="24" height="24" fill="none" stroke={NAVY} strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'hr',
    label: 'HR OS',
    tag: 'LIVE DEMO',
    desc: 'An always-on HR advisor for every team member — live HRMS, payroll, benefits, 401k — answered 24/7 in plain English.',
    href: '/hr/chat',
    accent: CRIMSON,
    accentLight: 'rgba(27,77,230,0.07)',
    icon: (
      <svg width="24" height="24" fill="none" stroke={CRIMSON} strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'ops',
    label: 'Ops OS',
    tag: 'LIVE DEMO',
    desc: 'Real-time ticket queue, refund & returns tracking, SLA compliance, CSAT trends, and a live CS chat demo — across every brand.',
    href: '/ops',
    accent: '#2952CC',
    accentLight: 'rgba(41,82,204,0.07)',
    icon: (
      <svg width="24" height="24" fill="none" stroke="#2952CC" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export default function DemoHubPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const handleLogout = () => {
    document.cookie = 'eb-auth=; path=/; max-age=0';
    router.push('/login');
  };

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #0B0D17 !important; font-family: 'Aeonik', 'Inter', system-ui, sans-serif; color: #FFFFFF; }

        .dh-card {
          background: #141827;
          border: 1.5px solid rgba(79,168,255,0.18);
          border-radius: 12px;
          padding: 26px 24px 22px;
          cursor: pointer;
          transition: border-color 0.18s, box-shadow 0.18s, transform 0.14s;
          display: flex; flex-direction: column; gap: 16px;
          animation: fadeUp 0.45s ease both;
        }
        .dh-card:nth-child(1) { animation-delay: 0.08s; }
        .dh-card:nth-child(2) { animation-delay: 0.16s; }
        .dh-card:nth-child(3) { animation-delay: 0.24s; }
        .dh-card:hover {
          border-color: rgba(79,168,255,0.28);
          box-shadow: 0 4px 24px rgba(79,168,255,0.10), 0 1px 4px rgba(79,168,255,0.06);
          transform: translateY(-2px);
        }
        .dh-enter-btn {
          display: inline-flex; align-items: center; gap: 7px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; border-radius: 6px;
          padding: 7px 14px; cursor: pointer; font-family: inherit;
          transition: filter 0.15s; border: none; align-self: flex-start;
          color: ${WHITE};
        }
        .dh-enter-btn:hover { filter: brightness(1.10); }
        .dh-big-card {
          border: none; border-radius: 12px; padding: 40px 36px;
          cursor: pointer; text-align: left; font-family: inherit;
          transition: filter 0.18s, transform 0.14s;
          display: flex; flex-direction: column; justify-content: space-between; gap: 28px;
        }
        .dh-big-card:hover { filter: brightness(1.06); transform: translateY(-2px); }
        .dh-nav-link {
          background: none; border: none; cursor: pointer; font-family: inherit;
          font-size: 12px; font-weight: 700; letter-spacing: 0.07em;
          text-transform: uppercase; color: ${NAVY}; padding: 0;
          transition: color 0.15s;
        }
        .dh-nav-link:hover { color: ${CRIMSON}; }
        @media (max-width: 640px) {
          .dh-header { padding: 0 16px !important; }
          .dh-hero h1 { font-size: 30px !important; }
          .dh-main { padding: 32px 16px 44px !important; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#0B0D17', display: 'flex', flexDirection: 'column', color: '#FFFFFF' }}>

        {/* Crimson top strip */}
        <div style={{
          background: CRIMSON, height: 32,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: WHITE,
          animation: 'fadeIn 0.3s ease both',
        }}>
          783 OS — Private Demo Environment &nbsp;·&nbsp; Apr 2026
        </div>

        {/* White header with BL logo only */}
        <header className="dh-header" style={{
          background: '#0F1220', borderBottom: `1px solid rgba(79,168,255,0.18)`,
          padding: '0 40px', height: 68,
          display: 'flex', alignItems: 'center',
          animation: 'fadeIn 0.35s ease both',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <BLCircleLogo size={44} />
            <div>
              <div style={{ fontWeight: 900, fontSize: 16, color: "#FFFFFF", letterSpacing: '-0.01em', lineHeight: 1 }}>783 Partners</div>
              <div style={{ fontWeight: 600, fontSize: 10, color: CRIMSON, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 2 }}>Operating System</div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="dh-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '52px 24px 60px' }}>

          {/* Hero */}
          <div style={{ textAlign: 'center', marginBottom: 48, maxWidth: 560, animation: 'fadeUp 0.4s ease both' }}>
            <div style={{
              display: 'inline-block', fontSize: 10, fontWeight: 800, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: CRIMSON, background: 'rgba(27,77,230,0.08)',
              border: '1px solid rgba(27,77,230,0.20)', borderRadius: 4, padding: '4px 12px', marginBottom: 18,
            }}>
              Interactive Demo Environment
            </div>
            <h1 style={{ fontSize: 40, fontWeight: 900, color: NAVY, lineHeight: 1.10, letterSpacing: '-0.02em', marginBottom: 16 }}>
              Select a Demo<br />to Explore
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.72)', lineHeight: 1.70 }}>
              Each OS module is a live, interactive environment built on real workflows.
              Pick one below or learn how we build them.
            </p>
          </div>

          {/* Demo cards */}
          <div style={{ width: '100%', maxWidth: 880, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px,1fr))', gap: 16, marginBottom: 52 }}>
            {DEMOS.map((demo) => (
              <div
                key={demo.id}
                className="dh-card"
                onClick={() => router.push(demo.href)}
                style={{ borderTop: `3px solid ${demo.accent}` }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: demo.accentLight, border: `1px solid ${demo.accent}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {demo.icon}
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.14em', color: '#0A7C4E', background: 'rgba(10,124,78,0.10)', border: '1px solid rgba(10,124,78,0.25)', borderRadius: 4, padding: '3px 8px' }}>
                    {demo.tag}
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: 19, fontWeight: 800, color: "#FFFFFF", marginBottom: 8, letterSpacing: '-0.01em' }}>{demo.label}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.72)', lineHeight: 1.65 }}>{demo.desc}</div>
                </div>
                <button className="dh-enter-btn" style={{ background: demo.accent }}>
                  Enter Demo
                  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ width: '100%', maxWidth: 880, display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.10)' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>Learn More</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.10)' }} />
          </div>

          {/* Big four cards */}
          <div style={{ width: '100%', maxWidth: 880, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 14 }}>
            <button className="dh-big-card" onClick={() => router.push('/how-it-works')} style={{ background: NAVY }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 14 }}>Our Process</div>
                <div style={{ fontSize: 34, fontWeight: 900, color: WHITE, lineHeight: 1.08, letterSpacing: '-0.02em' }}>How This<br />Works</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.55, maxWidth: 180 }}>90-day builds. On-site scoping. AI trained on your data.</span>
                <svg width="18" height="18" fill="none" stroke="rgba(255,255,255,0.60)" strokeWidth="2.5" viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </button>
            <button className="dh-big-card" onClick={() => router.push('/packages')} style={{ background: CRIMSON }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: 14 }}>What We Offer</div>
                <div style={{ fontSize: 34, fontWeight: 900, color: WHITE, lineHeight: 1.08, letterSpacing: '-0.02em' }}>Packages &<br />Pricing</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.55, maxWidth: 180 }}>Finance OS, HR OS, Ops OS, and Full Suite.</span>
                <svg width="18" height="18" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2.5" viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </button>
            <button className="dh-big-card" onClick={() => router.push('/onboarding')} style={{ background: '#0A3D2B' }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 14 }}>Client Guide</div>
                <div style={{ fontSize: 34, fontWeight: 900, color: WHITE, lineHeight: 1.08, letterSpacing: '-0.02em' }}>Getting<br />Started</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.55, maxWidth: 180 }}>Data inputs, system access, cleanliness standards.</span>
                <svg width="18" height="18" fill="none" stroke="rgba(255,255,255,0.60)" strokeWidth="2.5" viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </button>
            <button className="dh-big-card" onClick={() => router.push('/faq')} style={{ background: '#1A1200' }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,138,31,0.55)', marginBottom: 14 }}>Questions</div>
                <div style={{ fontSize: 34, fontWeight: 900, color: WHITE, lineHeight: 1.08, letterSpacing: '-0.02em' }}>FAQ</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.55, maxWidth: 180 }}>Honest answers to every question we&apos;ve been asked.</span>
                <svg width="18" height="18" fill="none" stroke="rgba(245,138,31,0.70)" strokeWidth="2.5" viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </button>
          </div>

          <div style={{ marginTop: 44, fontSize: 11, color: 'rgba(79,168,255,0.25)', letterSpacing: '0.06em', textAlign: 'center' }}>
            783 OS · Private Demo Environment
          </div>
        </div>
      </div>
    </>
  );
}
