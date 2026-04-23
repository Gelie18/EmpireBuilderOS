'use client';

import { useEffect, useRef, useState } from 'react';
import { usePersona } from '@/lib/hr/context';
import { classifyIntent, replyFor, SUGGESTED_PROMPTS } from '@/lib/hr/responses';
import type { ChatReply, Intent } from '@/lib/hr/responses';
import { useDocumentLibrary, searchDocuments, quoteFrom } from '@/lib/hr/documents';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  sources?: string[];
  timestamp?: string;
  rating?: 'up' | 'down';
}

function newId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function HRChat() {
  const { persona, personaId } = usePersona();
  const { all: docs } = useDocumentLibrary();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: newId(),
      role: 'assistant',
      text: `Hi ${persona.profile.firstName} — I'm your HR assistant. I know your file and our policies. Ask me anything about pay, PTO, benefits, 401k, certifications, expenses, performance, goals, or company policy. I can also draft PTO requests, expense reports, and your self-review. If I can't help, say "talk to a person" and I'll hand you off.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{
      id: newId(),
      role: 'assistant',
      text: `You're now viewing as ${persona.profile.firstName} ${persona.profile.lastName} — ${persona.profile.title}, ${persona.profile.department}. Ask me anything.`,
    }]);
  }, [personaId, persona.profile.firstName, persona.profile.lastName, persona.profile.title, persona.profile.department]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  useEffect(() => {
    function onPrompt(e: Event) {
      const detail = (e as CustomEvent).detail as { prompt?: string } | undefined;
      if (detail?.prompt) send(detail.prompt);
    }
    window.addEventListener('hr-chat-prompt', onPrompt as EventListener);
    return () => window.removeEventListener('hr-chat-prompt', onPrompt as EventListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personaId, docs.length]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Message = { id: newId(), role: 'user', text: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setIsTyping(true);

    const intent: Intent = classifyIntent(trimmed);
    const baseReply: ChatReply = replyFor(intent, persona);

    // For policy_lookup or unknown, also search the document library and
    // append quoted policy sections when we find something relevant.
    let finalText = baseReply.text;
    let finalSources = [...baseReply.sources];

    if (intent === 'policy_lookup' || intent === 'unknown') {
      const hits = searchDocuments(trimmed, docs, 2);
      if (hits.length > 0) {
        const quoted = hits.map((h) => (
          `> **${h.doc.title} · ${h.section.heading}**\n> ${quoteFrom(h.section).split('\n').join('\n> ')}`
        )).join('\n\n');

        if (intent === 'policy_lookup') {
          finalText = `Here's what our policy says:\n\n${quoted}`;
        } else {
          // unknown but we still found relevant policy text — use it
          finalText = `I may not have a direct answer, but here's the relevant policy:\n\n${quoted}\n\nIf this doesn't cover it, say "talk to a person" and I'll loop in HR.`;
        }
        finalSources = Array.from(new Set([...finalSources, ...hits.map((h) => `${h.doc.title} (${h.doc.version})`)]));
      }
    } else {
      // For every other intent, if the user's question happens to also match
      // a policy doc section strongly, attach one supporting quote.
      const hits = searchDocuments(trimmed, docs, 1);
      if (hits.length > 0 && hits[0].score >= 6) {
        const h = hits[0];
        finalText += `\n\n📖 **${h.doc.title} · ${h.section.heading}:** ${quoteFrom(h.section, 180)}`;
        finalSources = Array.from(new Set([...finalSources, `${h.doc.title} (${h.doc.version})`]));
      }
    }

    const delay = Math.min(1100, 400 + finalText.length * 1.2);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { id: newId(), role: 'assistant', text: finalText, sources: finalSources, timestamp: baseReply.timestamp },
      ]);
      setIsTyping(false);
    }, delay);
  }

  function rate(id: string, rating: 'up' | 'down') {
    setMessages((m) => m.map((msg) => (msg.id === id ? { ...msg, rating } : msg)));
  }

  return (
    <section
      style={{
        background: 'var(--color-surf)',
        border: '1px solid var(--color-border)',
        borderRadius: 14,
        padding: 0,
        display: 'flex', flexDirection: 'column',
        minHeight: 520,
      }}
    >
      {/* Header */}
      <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#F58A1F', marginBottom: 4 }}>
              AI HR Advisor
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
              Trained on your file + {docs.length} policies
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0EA572', boxShadow: '0 0 6px rgba(14,165,114,0.6)' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(14,165,114,0.85)' }}>
              Online
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 620 }}>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} onRate={rate} />
        ))}
        {isTyping && <TypingBubble />}
      </div>

      {/* Suggested prompts */}
      {messages.length <= 1 && (
        <div style={{ padding: '4px 22px 14px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SUGGESTED_PROMPTS[personaId].map((p) => (
            <button
              key={p}
              onClick={() => send(p)}
              style={{
                fontSize: 12, color: 'var(--color-blue)',
                background: 'rgba(27,77,230,0.07)',
                border: '1px solid rgba(27,77,230,0.22)',
                borderRadius: 999, padding: '6px 12px',
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(27,77,230,0.16)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(27,77,230,0.07)'; }}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '14px 22px 18px',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about pay, PTO, 401k, policies, performance…`}
          style={{
            flex: 1, padding: '11px 14px',
            background: 'var(--color-surf2)',
            border: '1px solid var(--color-border)',
            borderRadius: 8, color: 'var(--color-text)',
            fontSize: 14, fontFamily: 'inherit',
            outline: 'none',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = '#1B4DE6'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          style={{
            padding: '11px 16px', background: '#F58A1F', color: '#0B0D17',
            border: 'none', borderRadius: 8,
            fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
            cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
            opacity: input.trim() && !isTyping ? 1 : 0.5,
            transition: 'opacity 0.15s, filter 0.15s', fontFamily: 'inherit',
          }}
        >
          Send
        </button>
      </form>
    </section>
  );
}

function MessageBubble({ msg, onRate }: { msg: Message; onRate: (id: string, r: 'up' | 'down') => void }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      <div
        style={{
          maxWidth: '86%',
          background: isUser ? 'rgba(27,77,230,0.18)' : 'var(--color-surf2)',
          border: isUser ? '1px solid rgba(27,77,230,0.30)' : '1px solid var(--color-border)',
          color: 'var(--color-text)',
          borderRadius: 10,
          padding: '12px 14px',
          fontSize: 14, lineHeight: 1.55,
        }}
      >
        <div style={{ whiteSpace: 'pre-wrap' }}>{renderRich(msg.text)}</div>

        {!isUser && msg.sources && msg.sources.length > 0 && (
          <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--color-border)', fontSize: 10, color: 'var(--color-muted)' }}>
            <span style={{ fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Sources:</span>{' '}
            {msg.sources.join(' · ')}{msg.timestamp && <> · <span style={{ color: 'rgba(14,165,114,0.75)' }}>{msg.timestamp}</span></>}
          </div>
        )}

        {!isUser && (
          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <RatingButton onClick={() => onRate(msg.id, 'up')} active={msg.rating === 'up'} label="Helpful" glyph="↑" />
            <RatingButton onClick={() => onRate(msg.id, 'down')} active={msg.rating === 'down'} label="Not helpful" glyph="↓" />
          </div>
        )}
      </div>
    </div>
  );
}

function RatingButton({ onClick, active, label, glyph }: { onClick: () => void; active: boolean; label: string; glyph: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        fontSize: 11, padding: '3px 8px', borderRadius: 6,
        background: active ? 'rgba(14,165,114,0.16)' : 'transparent',
        border: '1px solid ' + (active ? 'rgba(14,165,114,0.32)' : 'var(--color-border)'),
        color: active ? '#0EA572' : 'var(--color-muted)',
        cursor: 'pointer', fontFamily: 'inherit',
        transition: 'background 0.15s, color 0.15s, border-color 0.15s',
      }}
    >
      <span style={{ fontWeight: 800 }}>{glyph}</span>
      <span>{label}</span>
    </button>
  );
}

function TypingBubble() {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
      <div
        style={{
          background: 'var(--color-surf2)',
          border: '1px solid var(--color-border)',
          borderRadius: 10,
          padding: '14px 16px',
          display: 'flex', gap: 6,
        }}
      >
        <style>{`
          @keyframes hr-dot { 0%,80%,100% { transform: scale(0.6); opacity: 0.4 } 40% { transform: scale(1); opacity: 1 } }
        `}</style>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 7, height: 7, borderRadius: '50%',
              background: '#F58A1F',
              animation: `hr-dot 1.2s ${i * 0.15}s infinite ease-in-out`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/** Light markdown-ish renderer: **bold** and > blockquote lines. */
function renderRich(text: string): React.ReactNode {
  const lines = text.split('\n');
  const blocks: React.ReactNode[] = [];
  let quoteBuf: string[] = [];

  function flushQuote() {
    if (quoteBuf.length === 0) return;
    blocks.push(
      <div key={`q-${blocks.length}`} style={{ margin: '6px 0', padding: '8px 12px', borderLeft: '3px solid #F58A1F', background: 'rgba(245,138,31,0.06)', fontSize: 13, color: 'var(--color-text)', borderRadius: '0 6px 6px 0' }}>
        {quoteBuf.map((ln, i) => <div key={i}>{renderBold(ln)}</div>)}
      </div>
    );
    quoteBuf = [];
  }

  for (const line of lines) {
    if (line.startsWith('> ')) {
      quoteBuf.push(line.slice(2));
    } else {
      flushQuote();
      blocks.push(<div key={`l-${blocks.length}`}>{renderBold(line)}</div>);
    }
  }
  flushQuote();
  return blocks;
}

function renderBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color: 'var(--color-text)', fontWeight: 800 }}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

