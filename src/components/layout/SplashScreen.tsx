'use client';

import { useState, useEffect } from 'react';
import BLCircleLogo from '@/components/brand/BLCircleLogo';

interface SplashScreenProps {
  product?: string;
}

export default function SplashScreen({ product = 'Finance OS' }: SplashScreenProps) {
  const [phase, setPhase] = useState<'visible' | 'fading' | 'gone'>('gone');

  useEffect(() => {
    const key = `splash-shown-${product}`;
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(key)) return;
    if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(key, '1');
    setPhase('visible');
    const t1 = setTimeout(() => setPhase('fading'), 1200);
    const t2 = setTimeout(() => setPhase('gone'),   1600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [product]);

  if (phase === 'gone') return null;

  return (
    <>
      <style>{`
        @keyframes bl-fadeUp  { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        @keyframes bl-spin    { to { transform:rotate(360deg) } }
        @keyframes bl-pulse   { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes bl-barIn   { from{width:0} to{width:100%} }
        @keyframes bl-logoIn  { from{opacity:0;transform:scale(0.85)} to{opacity:1;transform:scale(1)} }
      `}</style>

      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: '#4FA8FF',   /* Navy — our structural brand color */
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 32,
          opacity: phase === 'fading' ? 0 : 1,
          transition: phase === 'fading' ? 'opacity 0.4s ease' : undefined,
          pointerEvents: phase === 'fading' ? 'none' : 'all',
        }}
      >
        {/* Subtle dot grid */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        {/* Crimson glow */}
        <div style={{ position: 'absolute', top: '25%', left: '30%', width: 340, height: 340, background: 'radial-gradient(circle, rgba(27,77,230,0.35) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '25%', width: 240, height: 240, background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* BL Circle Logo */}
        <div style={{ animation: 'bl-logoIn 0.55s ease both', position: 'relative' }}>
          <BLCircleLogo size={96} />
        </div>

        {/* Product label */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, animation: 'bl-fadeUp 0.5s 0.15s ease both' }}>
          <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 900, fontSize: 22, color: '#FFFFFF', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            783 Partners
          </div>
          {/* Animated crimson → navy bar */}
          <div style={{ overflow: 'hidden', height: 2, width: 140 }}>
            <div style={{ height: 2, background: 'linear-gradient(90deg,#1B4DE6,#BF1A1A,#FFFFFF)', borderRadius: 2, animation: 'bl-barIn 0.65s 0.25s cubic-bezier(0.4,0,0.2,1) both' }} />
          </div>
          <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700, fontSize: 13, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            {product}
          </div>
        </div>

        {/* Spinner */}
        <div style={{ animation: 'bl-fadeUp 0.4s 0.3s ease both' }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ animation: 'bl-spin 0.85s linear infinite', transformOrigin: '20px 20px' }}>
            <circle cx="20" cy="20" r="16" stroke="rgba(255,255,255,0.10)" strokeWidth="2.5" />
            <circle cx="20" cy="20" r="16" stroke="url(#splashGrad)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="26 76" />
            <defs>
              <linearGradient id="splashGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1B4DE6" />
                <stop offset="100%" stopColor="#FFFFFF" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Loading label */}
        <div style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.30)', fontWeight: 600,
          animation: 'bl-pulse 1.6s ease infinite, bl-fadeUp 0.4s 0.4s ease both',
        }}>
          Loading…
        </div>
      </div>
    </>
  );
}
