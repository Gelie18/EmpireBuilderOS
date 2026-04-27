import BLCircleLogo from '@/components/brand/BLCircleLogo';

export default function OpsLoading() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--color-bg)',
    }}>
      <style>{`@keyframes bl-spin { to { transform: rotate(360deg) } }`}</style>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <BLCircleLogo size={52} />
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ animation: 'bl-spin 0.8s linear infinite', transformOrigin: '16px 16px' }}>
          <circle cx="16" cy="16" r="12" stroke="rgba(79,168,255,0.12)" strokeWidth="2.5" />
          <circle cx="16" cy="16" r="12" stroke="#1D44BF" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="18 58" />
        </svg>
        <span style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-muted)', fontWeight: 600 }}>
          Loading…
        </span>
      </div>
    </div>
  );
}
