'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function EmpireLogo() {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontWeight: 900,
        fontSize: 38,
        letterSpacing: '0.18em',
        color: '#1D44BF',
        lineHeight: 1,
        textTransform: 'uppercase',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        Empire
      </div>
      <div style={{
        fontWeight: 900,
        fontSize: 16,
        letterSpacing: '0.38em',
        color: '#E8B84B',
        lineHeight: 1,
        textTransform: 'uppercase',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        marginTop: 3,
      }}>
        Builder
      </div>
      <div style={{
        width: 40,
        height: 2,
        background: 'linear-gradient(90deg, #1D44BF, #E8B84B)',
        margin: '10px auto 0',
        borderRadius: 2,
      }} />
    </div>
  );
}

const DEMOS = [
  {
    id: 'finance',
    label: 'Finance OS',
    tag: 'LIVE DEMO',
    tagColor: '#0A8A5C',
    tagBg: 'rgba(10,138,92,0.15)',
    desc: 'AI-powered financial intelligence. Live P&L, cash flow, anomaly detection, and an AI CFO that answers questions about your numbers in real time.',
    href: '/dashboard',
    active: true,
    icon: (
      <svg width="28" height="28" fill="none" stroke="#1D44BF" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'ops',
    label: 'Ops OS',
    tag: 'COMING SOON',
    tagColor: '#E8B84B',
    tagBg: 'rgba(232,184,75,0.12)',
    desc: 'Automated status rollups, vendor & contract tracking, exception alerting, and an SOP assistant — so operators stop chasing and start building.',
    href: '#',
    active: false,
    icon: (
      <svg width="28" height="28" fill="none" stroke="#1D44BF" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="2" y="3" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 21h8M12 17v4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'hr',
    label: 'HR OS',
    tag: 'COMING SOON',
    tagColor: '#E8B84B',
    tagBg: 'rgba(232,184,75,0.12)',
    desc: 'Employee-facing AI assistant, onboarding & offboarding workflows, handbook bot, and manager insights — people ops on autopilot.',
    href: '#',
    active: false,
    icon: (
      <svg width="28" height="28" fill="none" stroke="#1D44BF" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round"/>
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
        @keyframes fadeUp { from { opacity: 0; transform: translateY(18px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #1A1C2E !important; }

        .demo-card {
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 14px;
          padding: 28px 26px 24px;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, transform 0.15s;
          position: relative;
          animation: fadeUp 0.5s ease both;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .demo-card.active:hover {
          border-color: rgba(29,68,191,0.45);
          background: rgba(29,68,191,0.06);
          transform: translateY(-2px);
        }
        .demo-card.inactive {
          opacity: 0.55;
          cursor: default;
        }
        .demo-card:nth-child(1) { animation-delay: 0.1s; }
        .demo-card:nth-child(2) { animation-delay: 0.2s; }
        .demo-card:nth-child(3) { animation-delay: 0.3s; }

        .nav-link {
          color: rgba(255,255,255,0.45);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          cursor: pointer;
          transition: color 0.18s;
          background: none;
          border: none;
          font-family: inherit;
          padding: 0;
        }
        .nav-link:hover { color: rgba(255,255,255,0.80); }

        .enter-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 4px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #1D44BF;
          background: rgba(29,68,191,0.10);
          border: 1px solid rgba(29,68,191,0.25);
          border-radius: 6px;
          padding: 6px 12px;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.18s;
          align-self: flex-start;
        }
        .enter-btn:hover { background: rgba(29,68,191,0.18); }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: '#1A1C2E',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '48px 20px 60px',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Background grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(rgba(29,68,191,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(29,68,191,0.04) 1px, transparent 1px)`,
          backgroundSize: '40px 40px', pointerEvents: 'none',
        }} />
        <div style={{ position: 'absolute', top: '10%', left: '15%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(29,68,191,0.10) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '15%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(232,184,75,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Top bar */}
        <div style={{ width: '100%', maxWidth: 860, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 56, animation: 'fadeIn 0.4s ease both', position: 'relative' }}>
          <EmpireLogo />
          <button className="nav-link" onClick={handleLogout}>Log Out</button>
        </div>

        {/* Hero text */}
        <div style={{ textAlign: 'center', marginBottom: 52, animation: 'fadeUp 0.5s ease both', position: 'relative' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E8B84B', marginBottom: 12 }}>
            Interactive Demo Environment
          </div>
          <h1 style={{ fontSize: 34, fontWeight: 900, color: '#FFFFFF', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 14 }}>
            Select a Demo to Explore
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', maxWidth: 480, margin: '0 auto', lineHeight: 1.65 }}>
            Each OS module is a live, interactive environment built on real workflows.
            Pick one below or learn how we build them.
          </p>
        </div>

        {/* Demo cards */}
        <div style={{ width: '100%', maxWidth: 860, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 48, position: 'relative' }}>
          {DEMOS.map((demo) => (
            <div
              key={demo.id}
              className={`demo-card ${demo.active ? 'active' : 'inactive'}`}
              onClick={() => demo.active && router.push(demo.href)}
            >
              {/* Tag */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(29,68,191,0.10)', border: '1px solid rgba(29,68,191,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {demo.icon}
                </div>
                <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.14em', color: demo.tagColor, background: demo.tagBg, border: `1px solid ${demo.tagColor}40`, borderRadius: 4, padding: '3px 7px' }}>
                  {demo.tag}
                </span>
              </div>

              {/* Label + desc */}
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF', marginBottom: 8, letterSpacing: '-0.01em' }}>{demo.label}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.50)', lineHeight: 1.6 }}>{demo.desc}</div>
              </div>

              {/* CTA */}
              {demo.active && (
                <button className="enter-btn">
                  Enter Demo
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* ── Learn More section ── */}
        <div style={{ width: '100%', maxWidth: 860, position: 'relative', animation: 'fadeUp 0.5s 0.35s ease both' }}>

          {/* Divider with label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>Learn More</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* Two big cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

            {/* How This Works */}
            <button
              onClick={() => router.push('/how-it-works')}
              style={{
                background: '#1D44BF',
                border: 'none',
                borderRadius: 14,
                padding: '44px 40px',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'inherit',
                transition: 'filter 0.18s, transform 0.15s',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 32,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.12)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}
            >
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: 14 }}>Our Process</div>
                <div style={{ fontSize: 42, fontWeight: 900, color: '#FFFFFF', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
                  How This<br />Works
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.60)', lineHeight: 1.5, maxWidth: 200 }}>
                  90-day builds. On-site scoping. AI trained on your data.
                </span>
                <svg width="22" height="22" fill="none" stroke="rgba(255,255,255,0.70)" strokeWidth="2.5" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>

            {/* Packages */}
            <button
              onClick={() => router.push('/packages')}
              style={{
                background: '#E8B84B',
                border: 'none',
                borderRadius: 14,
                padding: '44px 40px',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'inherit',
                transition: 'filter 0.18s, transform 0.15s',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 32,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.08)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}
            >
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(26,28,46,0.45)', marginBottom: 14 }}>What We Offer</div>
                <div style={{ fontSize: 42, fontWeight: 900, color: '#1A1C2E', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
                  Packages
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: 'rgba(26,28,46,0.60)', lineHeight: 1.5, maxWidth: 200 }}>
                  Finance OS, HR OS, Ops OS, and Full Suite.
                </span>
                <svg width="22" height="22" fill="none" stroke="rgba(26,28,46,0.60)" strokeWidth="2.5" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>

          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 40, fontSize: 11, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.06em', textAlign: 'center', position: 'relative' }}>
          Empire Builder OS · 783 Capital Partners · Private Demo Environment
        </div>
      </div>
    </>
  );
}
