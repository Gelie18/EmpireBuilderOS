'use client';

import { useRef, useEffect, useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { usePathname } from 'next/navigation';

const SUGGESTED_CHIPS: Record<string, string[]> = {
  '/dashboard':       ['What needs my attention?', 'Board risk summary', 'Month-over-month trend', 'Revenue drivers'],
  '/pnl':             ['Why is net income down?', 'Marketing overage', 'Explain COGS variance', 'Revenue drivers'],
  '/cashflow':        ['Cash runway', 'AR collection risk', 'When do we need funding?', 'Working capital'],
  '/forecast':        ['Revenue sensitivity', 'What if COGS rises 5%?', 'Break-even month', 'Worst case'],
  '/scenarios':       ['Compare scenarios', 'Which has best margin?', 'Downside risk', 'Hiring impact'],
  '/yoy':             ['Revenue growth vs last year', 'Margin expansion', 'What changed?', 'YoY headcount'],
  '/mom':             ['MoM revenue trend', 'What drove the change?', 'Biggest swing line', 'April vs March'],
  '/daily-revenue':   ['Daily revenue pace', 'DTC vs wholesale split', 'Best day this month', 'Track to budget'],
  '/daily-ceo':       ['Top 3 risks today', 'Cash position', 'Action items', 'What to watch'],
  '/comments':        ['Open items', 'Unresolved flags', 'Marketing anomaly', 'Board prep items'],
  '/market':          ['Industry benchmarks', 'How do we compare?', 'Macro risks', 'Competitor context'],
};

export default function ChatPanel() {
  const pathname = usePathname();
  const [input, setInput] = useState('');
  const msgsEndRef = useRef<HTMLDivElement>(null);

  const { messages, isLoading, sendMessage } = useChat({
    currentView: pathname.replace('/', '') || 'dashboard',
    period: { type: 'month', startDate: '2026-04-01', endDate: '2026-04-30', label: 'Apr 2026' },
  });

  const chips = SUGGESTED_CHIPS[pathname] ?? SUGGESTED_CHIPS['/dashboard'];

  useEffect(() => {
    msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--color-surf)' }}>
      {/* Header */}
      <div className="px-4 py-3.5 border-b flex items-center gap-2.5" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surf2)' }}>
        <div className="w-[7px] h-[7px] rounded-full flex-shrink-0"
          style={{ background: 'var(--color-blue)', boxShadow: '0 0 8px var(--color-blue)' }} />
        <div>
          <div
            className="text-[11px] font-bold uppercase tracking-[0.08em]"
            style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-blue)' }}
          >
            AI CFO
          </div>
          <div className="text-[11px]" style={{ color: 'var(--color-muted)' }}>
            Trained on your financials
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-2.5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[90%] flex flex-col gap-0.5 ${msg.role === 'user' ? 'self-end' : 'self-start'}`}
          >
            <div
              className="px-3 py-2.5 text-[12px] leading-relaxed"
              style={{
                background: msg.role === 'user' ? 'var(--color-blue)' : 'var(--color-surf2)',
                color: msg.role === 'user' ? '#0B1B26' : 'var(--color-text)',
                borderRadius: msg.role === 'user' ? '10px 10px 3px 10px' : '10px 10px 10px 3px',
                border: msg.role === 'assistant' ? '1px solid var(--color-border2)' : 'none',
                fontWeight: msg.role === 'user' ? 600 : 400,
              }}
            >
              {msg.content}
            </div>
            <div
              className={`text-[10px] px-1 ${msg.role === 'user' ? 'text-right' : ''}`}
              style={{ color: 'var(--color-muted)' }}
            >
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="self-start">
            <div
              className="px-3 py-2.5 border"
              style={{ background: 'var(--color-surf2)', borderColor: 'var(--color-border2)', borderRadius: '10px 10px 10px 3px' }}
            >
              <div className="flex gap-1.5 items-center h-4">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: 'var(--color-blue)',
                      animation: 'blink 1.2s infinite',
                      animationDelay: `${i * 0.22}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={msgsEndRef} />
      </div>

      {/* Chips */}
      <div className="px-3.5 pt-2 pb-1 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex flex-wrap gap-1.5">
          {chips.map((chip) => (
            <button
              key={chip}
              onClick={() => { sendMessage(chip); }}
              className="text-[11px] px-2 py-1 cursor-pointer transition-colors"
              style={{
                border: '1px solid var(--color-border2)',
                color: 'var(--color-muted)',
                background: 'transparent',
                fontFamily: 'var(--font-condensed)',
                letterSpacing: '0.02em',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-blue)';
                e.currentTarget.style.color = 'var(--color-blue)';
                e.currentTarget.style.background = 'var(--color-blue-d)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border2)';
                e.currentTarget.style.color = 'var(--color-muted)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="px-3.5 py-3">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask about your financials..."
            className="flex-1 px-3 py-2.5 text-[13px] border outline-none transition-colors min-w-0"
            style={{
              background: 'var(--color-surf2)',
              borderColor: 'var(--color-border2)',
              color: 'var(--color-text)',
              fontFamily: 'inherit',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-blue)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border2)')}
          />
          <button
            onClick={handleSend}
            className="w-[42px] h-[42px] flex items-center justify-center flex-shrink-0 cursor-pointer border-none"
            style={{ background: 'var(--color-blue)' }}
          >
            <svg width="15" height="15" fill="none" stroke="#0B1B26" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
