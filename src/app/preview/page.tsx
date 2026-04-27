'use client';

/**
 * PATRIOTIC THEME PREVIEW
 * ─────────────────────────────────────────────────────────────────────────────
 * Mockup of the demo-hub main menu reimagined with the Empire OS / Meritage
 * Partners red · white · blue brand aesthetic.
 *
 * Palette:
 *   Crimson : #1D44BF  (top bar, secondary nav, CTAs)
 *   Navy    : #4FA8FF  (primary nav, structural headers, brand text)
 *   White   : #FFFFFF  (main content, cards, header bg)
 *   Off-white: #F5F6FA (page background)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import BrandLogo from '@/components/brand/BrandLogo';

const CRIMSON = '#1D44BF';
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
    accentLight: 'rgba(79,168,255,0.08)',
    icon: (
      <svg width="26" height="26" fill="none" stroke={NAVY} strokeWidth="1.8" viewBox="0 0 24 24">
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
      <svg width="26" height="26" fill="none" stroke={CRIMSON} strokeWidth="1.8" viewBox="0 0 24 24">
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
      <svg width="26" height="26" fill="none" stroke="#2952CC" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export default function PreviewPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #F5F6FA !important; font-family: 'Inter', system-ui, sans-serif; }

        .p-demo-card {
          background: ${WHITE};
          border: 1.5px solid rgba(79,168,255,0.10);
          border-radius: 12px;
          padding: 26px 24px 22px;
          cursor: pointer;
          transition: border-color 0.18s, box-shadow 0.18s, transform 0.14s;
          display: flex;
          flex-direction: column;
          gap: 16px;
          animation: fadeUp 0.45s ease both;
        }
        .p-demo-card:nth-child(1) { animation-delay: 0.08s; }
        .p-demo-card:nth-child(2) { animation-delay: 0.16s; }
        .p-demo-card:nth-child(3) { animation-delay: 0.24s; }
        .p-demo-card:hover {
          border-color: rgba(79,168,255,0.28);
          box-shadow: 0 4px 20px rgba(79,168,255,0.10), 0 1px 4px rgba(79,168,255,0.06);
          transform: translateY(-2px);
        }

        .p-enter-btn {
          display: inline-flex; align-items: center; gap: 7px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; border-radius: 6px;
          padding: 7px 14px; cursor: pointer; font-family: inherit;
          transition: filter 0.15s;
          border: none;
          align-self: flex-start;
        }
        .p-enter-btn:hover { filter: brightness(1.10); }

        .p-big-card {
          border: none; border-radius: 12px; padding: 40px 36px;
          cursor: pointer; text-align: left; font-family: inherit;
          transition: filter 0.18s, transform 0.14s;
          display: flex; flex-direction: column;
          justify-content: space-between; gap: 28px;
        }
        .p-big-card:hover { filter: brightness(1.06); transform: translateY(-2px); }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: '#F5F6FA',
        display: 'flex',
        flexDirection: 'column',
        color: '#111827',
      }}>

        {/* ── Crimson announcement strip — mirrors e783capital.com top bar ── */}
        <div style={{
          background: CRIMSON,
          height: 34,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: WHITE,
        }}>
          🎯 &nbsp;Theme Preview — Patriotic aesthetic &nbsp;·&nbsp; Not live production
        </div>

        {/* ── White header — mirrors e783capital.com header ── */}
        <header style={{
          background: WHITE,
          borderBottom: `3px solid ${NAVY}`,
          padding: '0 40px',
          height: 72,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          animation: 'fadeIn 0.35s ease both',
        }}>
          <BrandLogo product="OS" layout="horizontal" markHeight={38} markColor={NAVY} labelColor={CRIMSON} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {['How It Works', 'Packages', 'Log Out'].map((lbl, i) => (
              <button
                key={lbl}
                onClick={() => {
                  if (lbl === 'How It Works') router.push('/how-it-works');
                  if (lbl === 'Packages') router.push('/packages');
                }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  fontSize: 12, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
                  color: i === 2 ? 'rgba(79,168,255,0.40)' : NAVY,
                  padding: 0,
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = CRIMSON; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = i === 2 ? 'rgba(79,168,255,0.40)' : NAVY; }}
              >{lbl}</button>
            ))}
          </div>
        </header>

        {/* ── Navy sub-nav bar — mirrors e783capital.com primary nav ── */}
        <div style={{
          background: NAVY,
          padding: '0 40px',
          height: 44,
          display: 'flex', alignItems: 'center', gap: 32,
        }}>
          {['Finance OS', 'HR OS', 'Ops OS', 'All Modules', 'Packages'].map((item, i) => (
            <button
              key={item}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                fontSize: 11, fontWeight: i === 0 ? 800 : 600, letterSpacing: '0.07em', textTransform: 'uppercase',
                color: i === 0 ? WHITE : 'rgba(255,255,255,0.55)',
                padding: '4px 0',
                borderBottom: i === 0 ? `2px solid ${CRIMSON}` : '2px solid transparent',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = WHITE; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = i === 0 ? WHITE : 'rgba(255,255,255,0.55)'; }}
            >{item}</button>
          ))}
          {/* Apr badge — right side */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#2DB47A' }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.06em' }}>Demo · Apr 2026</span>
          </div>
        </div>

        {/* ── Main content ── */}
        <div style={{
          flex: 1,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '52px 24px 60px',
          animation: 'fadeUp 0.4s ease both',
        }}>

          {/* Hero */}
          <div style={{ textAlign: 'center', marginBottom: 48, maxWidth: 560 }}>
            <div style={{
              display: 'inline-block',
              fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase',
              color: CRIMSON, background: 'rgba(27,77,230,0.08)',
              border: `1px solid rgba(27,77,230,0.20)`,
              borderRadius: 4, padding: '4px 12px', marginBottom: 18,
            }}>
              Interactive Demo Environment
            </div>
            <h1 style={{
              fontSize: 40, fontWeight: 900, color: NAVY,
              lineHeight: 1.10, letterSpacing: '-0.02em', marginBottom: 16,
            }}>
              Select a Demo<br />to Explore
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(79,168,255,0.55)', lineHeight: 1.70 }}>
              Each OS module is a live, interactive environment built on real workflows.
              Pick one below or learn how we build them.
            </p>
          </div>

          {/* Demo cards */}
          <div style={{
            width: '100%', maxWidth: 880,
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 16, marginBottom: 52,
          }}>
            {DEMOS.map((demo) => (
              <div
                key={demo.id}
                className="p-demo-card"
                onClick={() => router.push(demo.href)}
                style={{ borderTop: `3px solid ${demo.accent}` }}
              >
                {/* Icon + tag row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: 10,
                    background: demo.accentLight,
                    border: `1px solid ${demo.accent}22`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {demo.icon}
                  </div>
                  <span style={{
                    fontSize: 9, fontWeight: 800, letterSpacing: '0.14em',
                    color: '#0A7C4E', background: 'rgba(10,124,78,0.10)',
                    border: '1px solid rgba(10,124,78,0.25)',
                    borderRadius: 4, padding: '3px 8px',
                  }}>{demo.tag}</span>
                </div>

                {/* Label + desc */}
                <div>
                  <div style={{ fontSize: 19, fontWeight: 800, color: NAVY, marginBottom: 8, letterSpacing: '-0.01em' }}>
                    {demo.label}
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(79,168,255,0.55)', lineHeight: 1.65 }}>
                    {demo.desc}
                  </div>
                </div>

                {/* CTA */}
                <button
                  className="p-enter-btn"
                  style={{ background: demo.accent, color: WHITE }}
                >
                  Enter Demo
                  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* ── Divider ── */}
          <div style={{ width: '100%', maxWidth: 880, display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(79,168,255,0.12)' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(79,168,255,0.30)' }}>Learn More</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(79,168,255,0.12)' }} />
          </div>

          {/* ── Big two cards ── */}
          <div style={{ width: '100%', maxWidth: 880, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

            {/* How This Works — Navy */}
            <button
              className="p-big-card"
              onClick={() => router.push('/how-it-works')}
              style={{ background: NAVY }}
            >
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 14 }}>
                  Our Process
                </div>
                <div style={{ fontSize: 40, fontWeight: 900, color: WHITE, lineHeight: 1.08, letterSpacing: '-0.02em' }}>
                  How This<br />Works
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.55, maxWidth: 200 }}>
                  90-day builds. On-site scoping. AI trained on your data.
                </span>
                <svg width="20" height="20" fill="none" stroke="rgba(255,255,255,0.60)" strokeWidth="2.5" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>

            {/* Packages — Crimson */}
            <button
              className="p-big-card"
              onClick={() => router.push('/packages')}
              style={{ background: CRIMSON }}
            >
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: 14 }}>
                  What We Offer
                </div>
                <div style={{ fontSize: 40, fontWeight: 900, color: WHITE, lineHeight: 1.08, letterSpacing: '-0.02em' }}>
                  Packages &<br />Pricing
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.55, maxWidth: 200 }}>
                  Finance OS, HR OS, Ops OS, and Full Suite.
                </span>
                <svg width="20" height="20" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2.5" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div style={{ marginTop: 44, fontSize: 11, color: 'rgba(79,168,255,0.25)', letterSpacing: '0.06em', textAlign: 'center' }}>
            Empire OS · Private Demo Environment
          </div>
        </div>
      </div>
    </>
  );
}
