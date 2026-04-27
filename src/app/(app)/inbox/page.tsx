'use client';

import { useMemo, useState } from 'react';
import { useSubco } from '@/contexts/SubcoContext';
import { useDecisions } from '@/contexts/DecisionsContext';
import { ALL_SUBCOS } from '@/lib/subcos';
import type { Decision } from '@/lib/ceo-intel';

const CARD: React.CSSProperties = {
  background: 'var(--color-surf)',
  borderRadius: 'var(--card-radius)',
  boxShadow: 'var(--card-shadow)',
  border: '1px solid var(--color-border)',
};

const DISPLAY_FONT = 'Aeonik, Inter, "DM Sans", system-ui, sans-serif';

type TabKey = 'pending' | 'approved' | 'rejected' | 'delegated' | 'all';

export default function InboxPage() {
  const { subco, isTopco } = useSubco();
  const { decisions, approve, reject, delegate } = useDecisions();
  const [tab, setTab] = useState<TabKey>('pending');
  const [filterSubco, setFilterSubco] = useState<string>('all');

  const scoped = useMemo(() => {
    // When topco is active, allow global view; when subco, force the subco filter.
    if (!isTopco) return decisions.filter((d) => d.subcoId === subco.id);
    if (filterSubco === 'all') return decisions;
    return decisions.filter((d) => d.subcoId === filterSubco);
  }, [decisions, isTopco, subco.id, filterSubco]);

  const tabbed = useMemo(() => {
    if (tab === 'all') return scoped;
    return scoped.filter((d) => d.status === tab);
  }, [scoped, tab]);

  const counts = useMemo(() => {
    const c = { pending: 0, approved: 0, rejected: 0, delegated: 0, all: scoped.length };
    for (const d of scoped) c[d.status]++;
    return c;
  }, [scoped]);

  const totalImpactPending = useMemo(() => {
    // Rough parse of "+$31K/mo GM recovery" etc — extract leading $X where possible.
    return scoped
      .filter((d) => d.status === 'pending')
      .map((d) => extractDollar(d.impact))
      .reduce((a, b) => a + b, 0);
  }, [scoped]);

  return (
    <div className="flex flex-col gap-5">

      {/* Hero */}
      <div style={{ ...CARD, padding: '24px 28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.4,
          background: `radial-gradient(650px circle at 90% 0%, rgba(${subco.colors.primaryRgb}, 0.12) 0%, transparent 60%)`,
        }} />
        <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: subco.colors.accent, marginBottom: 8 }}>
              Decision Inbox · one queue for everything
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.05, color: 'var(--color-text)', letterSpacing: '-0.02em', fontFamily: DISPLAY_FONT }}>
              {counts.pending} waiting on you
            </div>
            <div style={{ marginTop: 10, fontSize: 13, color: 'var(--color-muted)', maxWidth: 720 }}>
              {isTopco
                ? `All decisions across every brand. Approved items route to the owning team as action items in their backlog.`
                : `${subco.name} decisions only. Switch to topco in the top nav to see the full portfolio queue.`}
            </div>
          </div>
          {counts.pending > 0 && (
            <div style={{
              background: 'rgba(45,180,122,0.12)', border: '1px solid rgba(45,180,122,0.30)',
              color: '#2DB47A', padding: '10px 16px', borderRadius: 8,
              fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
              alignSelf: 'flex-start',
            }}>
              💰 ~${(totalImpactPending / 1000).toFixed(0)}K annualized impact pending
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div style={{ ...CARD, padding: '14px 18px', display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(['pending', 'approved', 'rejected', 'delegated', 'all'] as const).map((t) => {
            const active = tab === t;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  fontSize: 10, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase',
                  padding: '6px 12px', borderRadius: 5, cursor: 'pointer',
                  background: active ? `rgba(${subco.colors.primaryRgb}, 0.18)` : 'transparent',
                  border: active ? `1px solid ${subco.colors.primary}` : '1px solid var(--color-border)',
                  color: active ? 'var(--color-text)' : 'var(--color-muted)',
                  fontFamily: 'inherit',
                }}
              >
                {t} · {counts[t]}
              </button>
            );
          })}
        </div>
        {isTopco && (
          <>
            <div style={{ width: 1, height: 24, background: 'var(--color-border)', margin: '0 8px' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
              Brand
            </span>
            <select
              value={filterSubco}
              onChange={(e) => setFilterSubco(e.target.value)}
              style={{
                fontSize: 11, fontWeight: 600, padding: '5px 10px',
                background: 'transparent', color: 'var(--color-text)',
                border: '1px solid var(--color-border)', borderRadius: 5,
                fontFamily: 'inherit',
              }}
            >
              <option value="all">All brands</option>
              {ALL_SUBCOS.map((s) => (
                <option key={s.id} value={s.id}>{s.shortName}</option>
              ))}
            </select>
          </>
        )}
      </div>

      {/* Decision cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {tabbed.length === 0 && (
          <div style={{ ...CARD, padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, fontFamily: DISPLAY_FONT }}>
              {tab === 'pending' ? 'Inbox zero.' : `No ${tab} decisions.`}
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>
              {tab === 'pending'
                ? 'Every decision has an owner and a timestamp. Come back tomorrow.'
                : 'Switch to another tab to see more.'}
            </div>
          </div>
        )}
        {tabbed.map((d) => (
          <DecisionCard
            key={d.id}
            d={d}
            onApprove={() => approve(d.id)}
            onReject={() => reject(d.id)}
            onDelegate={() => delegate(d.id)}
          />
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────

function DecisionCard({
  d,
  onApprove,
  onReject,
  onDelegate,
}: {
  d: Decision;
  onApprove: () => void;
  onReject: () => void;
  onDelegate: () => void;
}) {
  const brand = ALL_SUBCOS.find((s) => s.id === d.subcoId) ?? ALL_SUBCOS[0];
  const statusMeta = {
    pending:   { label: 'AWAITING DECISION', color: '#F58A1F', bg: 'rgba(245,138,31,0.12)' },
    approved:  { label: 'APPROVED · ROUTED TO OWNER', color: '#2DB47A', bg: 'rgba(45,180,122,0.14)' },
    rejected:  { label: 'REJECTED', color: '#E06060', bg: 'rgba(224,96,96,0.14)' },
    delegated: { label: 'DELEGATED', color: '#4FA8FF', bg: 'rgba(79,168,255,0.14)' },
  }[d.status];

  return (
    <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
      {/* Top strip */}
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{
            background: brand.colors.primary, color: '#FFFFFF',
            borderRadius: 4, padding: '3px 8px', fontSize: 11, fontWeight: 900,
          }}>
            {brand.monogram}
          </span>
          <span style={{
            fontSize: 9, fontWeight: 800, letterSpacing: '0.10em',
            padding: '3px 8px', borderRadius: 3,
            background: d.urgency === 'URGENT' ? 'rgba(224,96,96,0.15)' : d.urgency === 'THIS WEEK' ? 'rgba(245,138,31,0.15)' : 'rgba(79,168,255,0.12)',
            color: d.urgency === 'URGENT' ? '#E06060' : d.urgency === 'THIS WEEK' ? '#F58A1F' : '#4FA8FF',
          }}>
            {d.urgency}
          </span>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '0.08em',
            color: 'var(--color-muted)', textTransform: 'uppercase',
          }}>
            {d.type} · {d.confidence} confidence
          </span>
        </div>
        <span style={{
          fontSize: 9, fontWeight: 800, letterSpacing: '0.10em',
          padding: '3px 10px', borderRadius: 3,
          color: statusMeta.color, background: statusMeta.bg,
        }}>
          {statusMeta.label}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '18px 22px' }}>
        <div style={{ fontSize: 17, fontWeight: 800, lineHeight: 1.3, marginBottom: 8, fontFamily: DISPLAY_FONT }}>
          {d.title}
        </div>
        <div style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.55, marginBottom: 14 }}>
          {d.summary}
        </div>

        <div style={{
          background: 'linear-gradient(180deg, rgba(245,138,31,0.10) 0%, rgba(27,77,230,0.04) 100%)',
          border: '1px solid rgba(245,138,31,0.30)',
          borderRadius: 8, padding: '14px 16px', marginBottom: 14,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{
              width: 18, height: 18, borderRadius: 4,
              background: 'linear-gradient(135deg,#1B4DE6,#F58A1F)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#FFFFFF">
                <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
              </svg>
            </span>
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F58A1F' }}>
              AI Recommendation
            </div>
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-text)', lineHeight: 1.55 }}>
            {d.recommendedAction}
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 16, fontSize: 11, color: 'var(--color-muted)' }}>
          <div>
            <span style={{ fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Owner</span>
            <span style={{ marginLeft: 8, color: 'var(--color-text)', fontWeight: 600 }}>{d.owner}</span>
          </div>
          <div>
            <span style={{ fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Impact</span>
            <span style={{ marginLeft: 8, color: '#2DB47A', fontWeight: 700 }}>💰 {d.impact}</span>
          </div>
          <div>
            <span style={{ fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Created</span>
            <span style={{ marginLeft: 8 }}>{d.createdAt}</span>
          </div>
        </div>

        {d.status === 'pending' ? (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={onApprove}
              style={{
                background: 'linear-gradient(135deg,#1B4DE6,#F58A1F)',
                border: 'none', color: '#FFFFFF',
                padding: '10px 16px', borderRadius: 7, cursor: 'pointer',
                fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
                boxShadow: '0 2px 10px rgba(27,77,230,0.30)',
              }}
            >
              Approve · route to {d.owner.split('·')[0].trim()}
            </button>
            <button
              onClick={onDelegate}
              style={{
                background: 'transparent',
                border: '1px solid var(--color-border)', color: 'var(--color-text)',
                padding: '10px 16px', borderRadius: 7, cursor: 'pointer',
                fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
              }}
            >
              Delegate
            </button>
            <button
              onClick={onReject}
              style={{
                background: 'transparent',
                border: '1px solid var(--color-border)', color: 'var(--color-muted)',
                padding: '10px 16px', borderRadius: 7, cursor: 'pointer',
                fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
              }}
            >
              Reject
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8, fontSize: 11, color: 'var(--color-muted)' }}>
            <span style={{ fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Status:</span>
            <span style={{ color: statusMeta.color, fontWeight: 700 }}>{statusMeta.label}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────

function extractDollar(impactText: string): number {
  // Match "+$31K/mo", "+$31K", "$89K", "+$14.4K GP" etc.
  const match = impactText.match(/\$([\d.]+)\s*(K|M)/i);
  if (!match) return 0;
  const n = parseFloat(match[1]);
  if (isNaN(n)) return 0;
  const unit = match[2].toUpperCase();
  const base = unit === 'M' ? 1_000_000 : 1_000;
  // Annualize "/mo" figures to an annual impact.
  const annualized = /\/mo/i.test(impactText) ? n * base * 12 : n * base;
  return annualized;
}
