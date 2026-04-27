'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BrandLogo from '@/components/brand/BrandLogo';

// ── Valid credentials ─────────────────────────────────────────────────────────
const CREDENTIALS = [
  { username: 'empire', password: 'demo2026' },
];

function AnimatedBrandLogo({ animate = false }: { animate?: boolean }) {
  return (
    <div style={{ animation: animate ? 'fadeUp 0.7s ease both' : undefined }}>
      <BrandLogo layout="stacked" markHeight={48} />
    </div>
  );
}

// ── Loading animation overlay ─────────────────────────────────────────────────
function LoadingOverlay() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#F8F9FB',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 40,
      animation: 'fadeIn 0.3s ease',
    }}>
      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes fadeUp  { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes spin    { to { transform: rotate(360deg) } }
        @keyframes pulse   { 0%,100% { opacity: 1 } 50% { opacity: 0.4 } }
      `}</style>

      <AnimatedBrandLogo animate />

      {/* Spinner ring */}
      <div style={{ position: 'relative', width: 56, height: 56 }}>
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ position: 'absolute', inset: 0 }}>
          <circle cx="28" cy="28" r="24" stroke="rgba(0,0,0,0.06)" strokeWidth="3" />
          <circle
            cx="28" cy="28" r="24"
            stroke="url(#spinGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="60 90"
            style={{ animation: 'spin 1s linear infinite', transformOrigin: '28px 28px' }}
          />
          <defs>
            <linearGradient id="spinGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1D44BF" />
              <stop offset="100%" stopColor="#E8B84B" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div style={{
        fontSize: 12,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'rgba(0,0,0,0.35)',
        fontWeight: 600,
        animation: 'pulse 1.8s ease infinite',
      }}>
        Loading your dashboard…
      </div>
    </div>
  );
}

// ── Login page ────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [mounted, setMounted]   = useState(false);

  useEffect(() => {
    setMounted(true);
    if (document.cookie.includes('eb-auth=')) {
      router.replace('/demo-hub');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const match = CREDENTIALS.find(
      (c) => c.username === username.toLowerCase().trim() && c.password === password
    );

    if (!match) {
      setError('Invalid username or password.');
      return;
    }

    setLoading(true);
    document.cookie = `eb-auth=authenticated; path=/; SameSite=Strict`;
    setShowOverlay(true);
    setTimeout(() => {
      router.push('/demo-hub');
    }, 2200);
  };

  if (!mounted) return null;
  if (showOverlay) return <LoadingOverlay />;

  return (
    <>
      <style>{`
        @keyframes fadeUp   { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes fadeIn   { from { opacity: 0 } to { opacity: 1 } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F8F9FB !important; }

        .login-input {
          width: 100%;
          padding: 13px 16px;
          background: #FFFFFF;
          border: 1.5px solid rgba(0,0,0,0.12);
          border-radius: 8px;
          color: #111827;
          font-size: 15px;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .login-input::placeholder { color: rgba(0,0,0,0.28); }
        .login-input:focus { border-color: #1D44BF; box-shadow: 0 0 0 3px rgba(29,68,191,0.08); }

        .login-btn {
          width: 100%;
          padding: 14px;
          background: #1D44BF;
          color: #FFFFFF;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.18s, transform 0.12s, box-shadow 0.18s;
          font-family: inherit;
          box-shadow: 0 4px 16px rgba(29,68,191,0.22);
        }
        .login-btn:hover:not(:disabled) { background: #2452D6; transform: translateY(-1px); box-shadow: 0 6px 22px rgba(29,68,191,0.32); }
        .login-btn:active:not(:disabled) { transform: translateY(0); }
        .login-btn:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }

        @media (max-width: 480px) {
          .login-card { padding: 32px 20px 28px !important; }
          .login-logo { margin-bottom: 20px !important; }
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: '#F8F9FB',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Subtle grid texture */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(29,68,191,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(29,68,191,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }} />

        {/* Soft glows */}
        <div style={{
          position: 'absolute',
          top: '10%', left: '15%',
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(29,68,191,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%', right: '15%',
          width: 380, height: 380,
          background: 'radial-gradient(circle, rgba(232,184,75,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Card */}
        <div className="login-card" style={{
          position: 'relative',
          width: '100%',
          maxWidth: 420,
          background: '#FFFFFF',
          border: '1.5px solid rgba(0,0,0,0.08)',
          borderRadius: 16,
          padding: '44px 40px 40px',
          boxShadow: '0 4px 32px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)',
          animation: 'fadeUp 0.6s ease both',
        }}>

          {/* Logo */}
          <div className="login-logo" style={{ marginBottom: 28, display: 'flex', justifyContent: 'center' }}>
            <BrandLogo layout="stacked" markHeight={52} />
          </div>

          {/* Tagline */}
          <div style={{
            fontSize: 13,
            color: 'rgba(0,0,0,0.40)',
            textAlign: 'center',
            letterSpacing: '0.04em',
            marginBottom: 32,
            lineHeight: 1.5,
          }}>
            Business Intelligence Platform<br />
            <span style={{ color: '#1D44BF', fontWeight: 600 }}>Meritage Partners · Private Access</span>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.40)', marginBottom: 7 }}>
                Username
              </label>
              <input
                className="login-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                autoComplete="username"
                autoFocus
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.40)', marginBottom: 7 }}>
                Password
              </label>
              <input
                className="login-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <div style={{
                padding: '10px 14px',
                background: 'rgba(220,38,38,0.06)',
                border: '1px solid rgba(220,38,38,0.20)',
                borderRadius: 7,
                fontSize: 13,
                color: '#DC2626',
                letterSpacing: '0.01em',
                animation: 'fadeUp 0.3s ease',
              }}>
                {error}
              </div>
            )}

            <div style={{ marginTop: 6 }}>
              <button className="login-btn" type="submit" disabled={loading || !username || !password}>
                {loading ? 'Signing in…' : 'Log In'}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div style={{
            marginTop: 28,
            paddingTop: 20,
            borderTop: '1px solid rgba(0,0,0,0.07)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0A8A5C', boxShadow: '0 0 8px rgba(10,138,92,0.4)' }} />
            <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.28)', letterSpacing: '0.06em' }}>
              SECURED · PRIVATE DEMO
            </span>
          </div>
        </div>

        {/* Bottom credit */}
        <div style={{
          marginTop: 28,
          fontSize: 11,
          color: 'rgba(0,0,0,0.22)',
          letterSpacing: '0.06em',
          textAlign: 'center',
        }}>
          Powered by Empire OS · Meritage Partners
        </div>
      </div>
    </>
  );
}
