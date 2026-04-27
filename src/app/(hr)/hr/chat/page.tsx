'use client';

import { usePersona } from '@/lib/hr/context';
import HRChat from '@/components/hr/HRChat';
import AlertsCard from '@/components/hr/AlertsCard';

export default function HRChatPage() {
  const { persona } = usePersona();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 24 }}>
      <header style={{ background: 'linear-gradient(135deg, rgba(27,77,230,0.14), rgba(245,138,31,0.04))', border: '1px solid rgba(27,77,230,0.28)', borderRadius: 14, padding: '22px 24px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E8B84B', marginBottom: 4 }}>Your HR Advisor</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          Hi {persona.profile.firstName} — ask me anything
        </h1>
        <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 6, maxWidth: 720 }}>
          I know your file, your goals, and every company policy. I can answer questions, draft PTO requests, start benefits enrollment, walk you through your self-review, or hand you off to a human.
        </div>
      </header>

      {persona.alerts.length > 0 && <AlertsCard />}
      <HRChat />
    </div>
  );
}
