'use client';

import { useState, useEffect } from 'react';

export default function SplashScreen() {
  const [phase, setPhase] = useState<'visible' | 'fading' | 'gone'>('visible');

  useEffect(() => {
    // Show for 1.8s, then fade out over 0.5s
    const fadeTimer = setTimeout(() => setPhase('fading'), 1800);
    const goneTimer = setTimeout(() => setPhase('gone'), 2300);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(goneTimer);
    };
  }, []);

  if (phase === 'gone') return null;

  return (
    <>
      <style>{`
        @keyframes eb-fadeUp  { from { opacity: 0; transform: translateY(18px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes eb-spin    { to { transform: rotate(360deg) } }
        @keyframes eb-pulse   { 0%,100% { opacity: 1 } 50% { opacity: 0.35 } }
        @keyframes eb-barIn   { from { width: 0 } to { width: 100% } }
      `}</style>

      <div
        style={{
          position:        'fixed',
          inset:           0,
          zIndex:          9999,
          background:      '#1A1C2E',
          display:         'flex',
          flexDirection:   'column',
          alignItems:      'center',
          justifyContent:  'center',
          gap:             36,
          opacity:         phase === 'fading' ? 0 : 1,
          transition:      phase === 'fading' ? 'opacity 0.5s ease' : undefined,
          pointerEvents:   phase === 'fading' ? 'none' : 'all',
        }}
      >
        {/* Background grid */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `
            linear-gradient(rgba(29,68,191,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(29,68,191,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }} />

        {/* Ambient glow */}
        <div style={{
          position: 'absolute', top: '20%', left: '25%',
          width: 380, height: 380, pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(29,68,191,0.14) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', right: '25%',
          width: 280, height: 280, pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(232,184,75,0.09) 0%, transparent 70%)',
        }} />

        {/* Wordmark */}
        <div style={{ textAlign: 'center', position: 'relative' }}>
          <div style={{
            fontWeight: 900, fontSize: 58, letterSpacing: '0.18em',
            color: '#1D44BF', lineHeight: 1, textTransform: 'uppercase',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            animation: 'eb-fadeUp 0.65s ease both',
          }}>
            Empire
          </div>
          <div style={{
            fontWeight: 900, fontSize: 23, letterSpacing: '0.40em',
            color: '#E8B84B', lineHeight: 1, textTransform: 'uppercase',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            marginTop: 5,
            animation: 'eb-fadeUp 0.65s 0.12s ease both',
          }}>
            Builder
          </div>

          {/* Animated gradient bar */}
          <div style={{ overflow: 'hidden', marginTop: 14, height: 2 }}>
            <div style={{
              height: 2,
              background: 'linear-gradient(90deg, #1D44BF, #E8B84B)',
              borderRadius: 2,
              animation: 'eb-barIn 0.7s 0.3s cubic-bezier(0.4,0,0.2,1) both',
            }} />
          </div>
        </div>

        {/* Spinner */}
        <div style={{ position: 'relative', width: 52, height: 52, animation: 'eb-fadeUp 0.5s 0.4s ease both' }}>
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none" style={{ position: 'absolute', inset: 0 }}>
            <circle cx="26" cy="26" r="22" stroke="rgba(255,255,255,0.07)" strokeWidth="3" />
            <circle
              cx="26" cy="26" r="22"
              stroke="url(#splashGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="55 85"
              style={{ animation: 'eb-spin 0.9s linear infinite', transformOrigin: '26px 26px' }}
            />
            <defs>
              <linearGradient id="splashGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%"   stopColor="#1D44BF" />
                <stop offset="100%" stopColor="#E8B84B" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Label */}
        <div style={{
          fontSize: 11, letterSpacing: '0.20em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.30)', fontWeight: 600,
          animation: 'eb-pulse 1.8s ease infinite, eb-fadeUp 0.5s 0.5s ease both',
        }}>
          Loading your dashboard…
        </div>
      </div>
    </>
  );
}
