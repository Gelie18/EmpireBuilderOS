'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useChat } from '@/hooks/useChat';

// ── Page-aware suggested questions ────────────────────────────────────────────
const PAGE_CTX: Record<string, { label: string; chips: string[] }> = {
  '/dashboard': {
    label: 'Dashboard',
    chips: [
      'Why is net income below plan?',
      'What needs immediate attention?',
      'Cash and runway status?',
      'What to tell the board?',
    ],
  },
  '/pnl': {
    label: 'P&L',
    chips: [
      'What drove the marketing overage?',
      'Why did gross margin expand?',
      'Which line items need action?',
      'P&L vs last October?',
    ],
  },
  '/cashflow': {
    label: 'Cash Flow',
    chips: [
      'Cash position and runway?',
      'Any AR aging concerns?',
      'November cash outlook?',
      'Liquidity risks to flag?',
    ],
  },
  '/balance-sheet': {
    label: 'Balance Sheet',
    chips: [
      'How is working capital trending?',
      'Any liability concerns?',
      'Current ratio vs benchmark?',
      'What is tying up cash?',
    ],
  },
  '/backlog': {
    label: 'Backlog',
    chips: [
      'What is the highest-risk backlog item?',
      'Wexler contract — next steps?',
      'AR aging action plan?',
      'Which items need this week?',
    ],
  },
  '/revenue': {
    label: 'Revenue Intel',
    chips: [
      'Which product line is underperforming?',
      'Customer concentration risk?',
      'MRR and ARR trend?',
      'Recurring revenue growth?',
    ],
  },
  '/forecast': {
    label: 'Driver Model',
    chips: [
      'What is the 12-month revenue target?',
      'Key forecast assumptions?',
      'Where are the biggest risks?',
      'What drives the growth rate?',
    ],
  },
  '/scenarios': {
    label: 'Scenarios',
    chips: [
      'Best vs downside outcome?',
      'Enterprise pipeline impact?',
      'What breaks our runway?',
      'Margin sensitivity to COGS?',
    ],
  },
  '/market': {
    label: 'Market Intel',
    chips: [
      'How do we rank vs peers?',
      'Where are we above industry median?',
      'Biggest competitive gap?',
      'Macro risks to monitor?',
    ],
  },
  '/yoy': {
    label: 'Year-over-Year',
    chips: [
      'YoY revenue growth summary?',
      'Why did NI margin compress?',
      'Gross margin trend?',
      'OpEx growth vs revenue?',
    ],
  },
  '/mom': {
    label: 'Month-over-Month',
    chips: [
      'What changed most vs September?',
      'Is the marketing spike one-time?',
      'Revenue trend healthy?',
      'November outlook?',
    ],
  },
};

const DEFAULT_CTX = {
  label: 'Empire Builder',
  chips: [
    'Net income miss — root cause?',
    'Cash and runway status?',
    'What to tell the board?',
    'November priorities?',
  ],
};

// ── Message formatter ─────────────────────────────────────────────────────────
function FormattedMessage({ content }: { content: string }) {
  const paragraphs = content.split(/\n\n+/);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {paragraphs.map((para, pi) => {
        const lines = para.split('\n');
        const isList = lines.some((l) =>
          /^[●•✅❌🟢🔵🟡🔴⚠️]/.test(l.trim())
        );

        if (isList) {
          return (
            <div key={pi} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {lines.map((line, li) => {
                const trimmed = line.trim();
                if (!trimmed) return null;
                const isBullet = /^[●•✅❌🟢🔵🟡🔴⚠️]/.test(trimmed);
                return isBullet ? (
                  <div key={li} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ flexShrink: 0, lineHeight: 1.5, fontSize: 12 }}>
                      {trimmed.charAt(0)}
                    </span>
                    <span style={{ lineHeight: 1.55 }}>
                      {renderInline(trimmed.slice(1).replace(/^[\s—\-]+/, ''))}
                    </span>
                  </div>
                ) : (
                  <span key={li} style={{ lineHeight: 1.55 }}>{renderInline(trimmed)}</span>
                );
              })}
            </div>
          );
        }

        return (
          <p key={pi} style={{ margin: 0, lineHeight: 1.6 }}>
            {lines.map((l, li) => (
              <span key={li}>
                {renderInline(l)}
                {li < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

function renderInline(text: string): React.ReactNode {
  // Bold: **text** or text that looks like a dollar/metric figure
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const pathname = usePathname();
  const ctx = PAGE_CTX[pathname as keyof typeof PAGE_CTX] ?? DEFAULT_CTX;
  const msgsEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, isLoading, sendMessage } = useChat({
    currentView: pathname.replace('/', '') || 'dashboard',
    period: { type: 'month', startDate: '2026-10-01', endDate: '2026-10-31', label: 'Oct 2026' },
    highlights: [`Viewing: ${ctx.label}`],
  });

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-chat', handler);
    return () => window.removeEventListener('open-chat', handler);
  }, []);

  useEffect(() => {
    const handler = () => setOpen((o) => !o);
    window.addEventListener('toggle-chat', handler);
    return () => window.removeEventListener('toggle-chat', handler);
  }, []);

  useEffect(() => {
    if (open) msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 220);
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput('');
  };

  return (
    <>
      <div
        className="fixed z-[60] flex flex-col bottom-14 md:bottom-0"
        style={{
          top: 52, right: 0, width: '100%', maxWidth: 420,
          background: '#FFFFFF',
          borderLeft: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '-4px 0 32px rgba(0,0,0,0.12)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.26s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b flex-shrink-0"
          style={{ borderColor: 'rgba(0,0,0,0.08)', background: '#1A1C2E' }}>
          <div className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
            style={{ background: '#E8B84B' }}>
            <svg width="14" height="14" fill="none" stroke="#1A1C2E" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-bold uppercase tracking-[0.08em] leading-none" style={{ color: '#FFFFFF' }}>
              AI CFO
            </div>
            <div className="text-[11px] mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Context: {ctx.label} · Oct 2026
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-7 h-7 flex items-center justify-center cursor-pointer text-[12px] transition-colors rounded"
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.20)', color: 'rgba(255,255,255,0.55)' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#E8B84B'; e.currentTarget.style.color = '#E8B84B'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}
          >✕</button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4 min-h-0">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className="text-[10px] font-bold uppercase tracking-[0.08em]" style={{ color: '#6B7280' }}>
                {msg.role === 'user' ? 'You' : 'AI CFO'}
              </div>
              <div className="max-w-[92%] px-4 py-3 text-[13px]" style={{
                background: msg.role === 'user' ? '#1D44BF' : '#F8F8FA',
                color: msg.role === 'user' ? '#FFFFFF' : '#1A1C2E',
                borderRadius: msg.role === 'user' ? '12px 12px 3px 12px' : '12px 12px 12px 3px',
                border: msg.role === 'assistant' ? '1px solid rgba(0,0,0,0.08)' : 'none',
                fontWeight: msg.role === 'user' ? 500 : 400,
              }}>
                {msg.role === 'assistant'
                  ? <FormattedMessage content={msg.content} />
                  : msg.content
                }
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex flex-col gap-1 items-start">
              <div className="text-[10px] font-bold uppercase tracking-[0.08em]" style={{ color: '#6B7280' }}>AI CFO</div>
              <div className="px-4 py-3 border rounded-xl" style={{ background: '#F8F8FA', borderColor: 'rgba(0,0,0,0.08)' }}>
                <div className="flex gap-1.5 items-center">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full"
                      style={{ background: '#1D44BF', animation: 'blink 1.2s infinite', animationDelay: `${i * 0.22}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={msgsEndRef} />
        </div>

        {/* Quick chips */}
        <div className="px-4 pt-3 pb-2.5 border-t" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] mb-2" style={{ color: '#6B7280' }}>
            Quick questions
          </div>
          <div className="flex flex-wrap gap-1.5">
            {ctx.chips.map((chip) => (
              <button key={chip} onClick={() => sendMessage(chip)}
                className="text-[11px] px-2.5 py-1 cursor-pointer transition-all rounded"
                style={{ border: '1px solid rgba(0,0,0,0.10)', color: '#6B7280', background: '#F8F8FA', fontWeight: 500 }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#1D44BF'; e.currentTarget.style.color = '#1D44BF'; e.currentTarget.style.background = 'rgba(29,68,191,0.07)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.10)'; e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.background = '#F8F8FA'; }}
              >{chip}</button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="px-4 py-3.5 border-t" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
          <div className="flex gap-2">
            <input
              ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Ask anything about your financials..."
              className="flex-1 px-3.5 py-2.5 text-[13px] border outline-none min-w-0 rounded"
              style={{ background: '#F8F8FA', borderColor: 'rgba(0,0,0,0.10)', color: '#1A1C2E', fontFamily: 'inherit' }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#1D44BF')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.10)')}
            />
            <button onClick={handleSend} disabled={isLoading || !input.trim()}
              className="w-[44px] h-[44px] flex items-center justify-center flex-shrink-0 cursor-pointer border-none transition-all rounded"
              style={{ background: isLoading || !input.trim() ? '#F0F0F0' : '#1D44BF', opacity: isLoading || !input.trim() ? 0.5 : 1 }}>
              <svg width="16" height="16" fill="none" stroke={isLoading || !input.trim() ? '#9CA3AF' : '#FFFFFF'} strokeWidth="2.5" viewBox="0 0 24 24">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop toggle */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="hidden md:flex fixed z-[61] items-center gap-2.5 cursor-pointer border-none transition-all"
        style={{
          bottom: 28, right: open ? 428 : 28,
          background: open ? '#FFFFFF' : '#E8B84B',
          color: open ? '#1D44BF' : '#1A1C2E',
          padding: '11px 20px 11px 16px',
          border: open ? '1px solid rgba(0,0,0,0.10)' : 'none',
          boxShadow: open ? '0 2px 16px rgba(0,0,0,0.10)' : '0 4px 20px rgba(232,184,75,0.40), 0 2px 8px rgba(0,0,0,0.12)',
          fontWeight: 700, fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase',
          transition: 'right 0.26s cubic-bezier(0.4,0,0.2,1), background 0.18s, color 0.18s',
          borderRadius: 6,
        }}
      >
        {open ? (
          <><svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>Close</>
        ) : (
          <><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>AI CFO</>
        )}
      </button>
    </>
  );
}
