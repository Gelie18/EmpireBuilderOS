'use client';

import { useEffect } from 'react';

export default function OpsError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error('[Ops OS error]', error); }, [error]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16, textAlign: 'center', padding: 32 }}>
      <div style={{ fontSize: 13, color: 'var(--color-muted)', maxWidth: 400 }}>
        Something went wrong loading this page.
      </div>
      <button
        onClick={reset}
        style={{ padding: '8px 20px', borderRadius: 7, background: 'rgba(27,77,230,0.15)', border: '1px solid rgba(27,77,230,0.35)', color: 'var(--color-accent)', fontSize: 12, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase' }}
      >
        Try again
      </button>
    </div>
  );
}
