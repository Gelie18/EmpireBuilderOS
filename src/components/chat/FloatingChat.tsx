'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useChat } from '@/hooks/useChat';

// ── Page-aware suggested questions — 12 per page (two sets of 6) ──────────────
const PAGE_CTX: Record<string, { label: string; allChips: string[] }> = {
  '/dashboard': {
    label: 'Dashboard',
    allChips: [
      'Why is net income below plan?',
      'What needs immediate attention?',
      'Cash and runway status?',
      'What do I tell the board?',
      'What are our biggest cost cuts?',
      'Q4 outlook?',
      'EBITDA this month?',
      'Gross margin trend?',
      'Revenue by channel breakdown?',
      'Where are we losing to plan?',
      'What improved vs last month?',
      'November priorities?',
    ],
  },
  '/pnl': {
    label: 'P&L',
    allChips: [
      'What drove the marketing overage?',
      'Why did gross margin expand?',
      'Break down OpEx by category',
      'P&L vs last October?',
      'What is our EBITDA?',
      'Where can we cut costs?',
      'Which line item concerns you most?',
      'Revenue beat — is it repeatable?',
      'Payroll vs revenue ratio?',
      'G&A — any leakage?',
      'Fulfillment savings this month?',
      'Best and worst variance lines?',
    ],
  },
  '/cashflow': {
    label: 'Cash Flow',
    allChips: [
      'Cash position and runway?',
      'AR aging — what to collect now?',
      'Should we extend AP terms?',
      'November cash outlook?',
      'What is our break-even?',
      'Liquidity risks to flag?',
      'Operating vs investing cash flow?',
      'Largest cash outflows this month?',
      'DSO trend — improving?',
      'Which vendor to delay paying?',
      'How does ShipBob affect cash?',
      'Cash if revenue drops 10%?',
    ],
  },
  '/balance-sheet': {
    label: 'Balance Sheet',
    allChips: [
      'How is working capital trending?',
      'AR aging breakdown?',
      'Should we extend AP terms?',
      'What is tying up cash?',
      'Inventory levels — any risk?',
      'Tax payment status?',
      'Current ratio vs benchmark?',
      'Debt-to-equity position?',
      'What assets can we liquidate fast?',
      'Accrued liabilities detail?',
      'Cash conversion cycle?',
      'How healthy is our balance sheet?',
    ],
  },
  '/backlog': {
    label: 'Ops Backlog',
    allChips: [
      'Wexler contract — next steps?',
      'AR aging action plan?',
      'IRS payment — are we covered?',
      'Which items need this week?',
      'Total dollar risk in backlog?',
      'Which vendor to hold payment on?',
      'Biggest single risk right now?',
      'What resolves fastest?',
      'Contracts close to expiring?',
      'Impact if Wexler falls through?',
      'Who owns each backlog item?',
      'Week-over-week backlog change?',
    ],
  },
  '/fin-backlog': {
    label: 'Financial Backlog',
    allChips: [
      'Which WIP contracts are blocked?',
      'Titan Energy — what is the holdup?',
      'Bellco Systems material delay?',
      'How much unbilled revenue is aged?',
      'When does backlog convert to revenue?',
      'What accelerates billing recognition?',
      'Total unbilled over 30 days?',
      'How do I reduce WIP cycle time?',
      'Which contract has highest margin?',
      'Change order impact on revenue?',
      'WIP to billed conversion rate?',
      'Which projects are most at risk?',
    ],
  },
  '/revenue': {
    label: 'Revenue Intel',
    allChips: [
      'Which product line is underperforming?',
      'Customer concentration risk?',
      'Scheels account — any risk?',
      'MRR and ARR trend?',
      'DTC vs wholesale mix shift?',
      'How do we grow recurring revenue?',
      'Top 5 customers by revenue?',
      'Fastest growing channel?',
      'Churn risk in wholesale?',
      'Oct 12 email campaign impact?',
      'Average order value trend?',
      'Which segment should we double down on?',
    ],
  },
  '/forecast': {
    label: 'Driver Model',
    allChips: [
      'What is the 12-month revenue target?',
      'Q1 2027 outlook?',
      'Key forecast assumptions?',
      'What breaks the forecast?',
      'Pipeline to revenue — timing?',
      'What drives our growth rate?',
      'Sensitivity to pricing change?',
      'Hiring impact on the model?',
      'What if wholesale slows?',
      'COGS trend in the forecast?',
      'Best-case NI margin for 2027?',
      'When do we hit $20M run rate?',
    ],
  },
  '/ai-forecast': {
    label: 'AI Forecast Builder',
    allChips: [
      'Q4 revenue on track?',
      'Q1 2027 outlook?',
      'Where is the forecast most uncertain?',
      'Marketing normalization impact?',
      'Enterprise pipeline — when does it close?',
      'Best case revenue this year?',
      'Downside scenario — revenue impact?',
      'What moves the needle most in Q1?',
      'Seasonal patterns in the forecast?',
      'Margin trajectory next 6 months?',
      'When do we beat last year?',
      'Biggest forecast risk right now?',
    ],
  },
  '/scenarios': {
    label: 'Scenarios',
    allChips: [
      'Best vs downside outcome?',
      'What breaks our runway?',
      'Enterprise pipeline impact?',
      'Margin if COGS rises 2%?',
      'What if marketing stays at $171K?',
      'Downside — how long is runway?',
      'Revenue if we land one more enterprise deal?',
      'Impact of a 10% price increase?',
      'What if we lose Scheels?',
      'Hiring freeze — NI impact?',
      'El Paso freight renegotiation impact?',
      'Cash if DTC drops 15%?',
    ],
  },
  '/market': {
    label: 'Market Intel',
    allChips: [
      'How do we rank vs peers?',
      'Where are we above industry median?',
      'NI margin gap — how to close it?',
      'Biggest competitive advantage?',
      'Freight cost vs competitors?',
      'Macro risks to monitor?',
      'Market share opportunity?',
      'Industry revenue growth rate?',
      'Where peers outperform us?',
      'Pricing power vs competitors?',
      'Which metric matters most to investors?',
      'Benchmark our gross margin?',
    ],
  },
  '/yoy': {
    label: 'Year-over-Year',
    allChips: [
      'YoY revenue growth summary?',
      'Why did NI margin compress?',
      'Gross margin trend YoY?',
      'OpEx growth vs revenue growth?',
      'What improved most vs last year?',
      'What got worse vs last year?',
      'Customer count YoY change?',
      'EBITDA YoY comparison?',
      'Which channel grew fastest?',
      'Headcount vs revenue YoY?',
      'Marketing ROI vs last year?',
      'Cash position YoY change?',
    ],
  },
  '/mom': {
    label: 'Month-over-Month',
    allChips: [
      'What changed most vs September?',
      'Is the marketing spike a trend?',
      'Revenue trend healthy?',
      'November outlook?',
      'Which line improved most?',
      'What explains the NI drop?',
      'Gross profit MoM change?',
      'Cash position change MoM?',
      'Biggest OpEx mover?',
      'DTC revenue vs last month?',
      'Inventory MoM change?',
      'AR aging better or worse?',
    ],
  },
  '/daily-revenue': {
    label: 'Daily Revenue',
    allChips: [
      'Which day drove the most revenue?',
      'DTC vs wholesale daily split?',
      'Email campaign impact on Oct 12?',
      'Revenue run rate for November?',
      'Slowest revenue days — why?',
      'Weekend vs weekday performance?',
      'Best single-day revenue record?',
      'Average daily DTC order count?',
      'Wholesale order frequency?',
      'Revenue consistency score?',
      'Which day to target for campaigns?',
      'Volatility in daily revenue?',
    ],
  },
};

const DEFAULT_CTX = {
  label: 'Empire Builder',
  allChips: [
    'Net income miss — root cause?',
    'Cash and runway status?',
    'What do I tell the board?',
    'Q4 outlook?',
    'Biggest cost reduction opportunity?',
    'November priorities?',
    'EBITDA this month?',
    'Top 3 things to fix right now?',
    'Revenue growth vs last year?',
    'Marketing ROI?',
    'Gross margin trend?',
    'Where are we losing to plan?',
  ],
};

// ── Think Big prompts — 4 sets of 3 creative/unconventional questions ─────────
const THINK_BIG_SETS: string[][] = [
  [
    'How do I 10x revenue without doubling headcount?',
    'What would a PE firm restructure first?',
    'What new revenue stream fits our model?',
  ],
  [
    'What business model shift would change our margins?',
    'Which customer segment are we completely ignoring?',
    'How do we build recurring revenue from a transactional business?',
  ],
  [
    'What would disrupt this business in the next 2 years?',
    'What partnership unlocks our biggest growth constraint?',
    'What would a 10% price increase actually do to our model?',
  ],
  [
    'What is our unfair competitive advantage — and are we using it?',
    'How do we monetize our data or domain expertise?',
    'If we had to grow 30% next year with no new hires, how?',
  ],
];

// ── Forecast quick scenarios ───────────────────────────────────────────────────
const FORECAST_QUARTERS = ['Q4 2026', 'Q1 2027', 'Q2 2027', 'Q3 2027', 'Q4 2027'];

const FORECAST_SCENARIOS = [
  'New wholesale account adds 5% revenue growth',
  'Hire 2 account executives at market rates',
  'Add a marketing consultant at $8.5K/month',
  'One-time trade show cost of $35K',
  'COGS pressure increases 2% from freight costs',
  'Revenue declines 5% — seasonal slowdown',
];

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
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

// ── Refresh icon ──────────────────────────────────────────────────────────────
function RefreshIcon({ spinning }: { spinning?: boolean }) {
  return (
    <svg
      width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={spinning ? { animation: 'eb-spin-once 0.4s ease' } : undefined}
    >
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}

type PanelMode = 'questions' | 'thinkbig' | 'forecast';

// ── Main component ────────────────────────────────────────────────────────────
export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<PanelMode>('questions');
  const [input, setInput] = useState('');
  const [chipSetIdx, setChipSetIdx] = useState(0);
  const [thinkBigIdx, setThinkBigIdx] = useState(0);
  const [refreshAnim, setRefreshAnim] = useState(false);
  const [thinkRefreshAnim, setThinkRefreshAnim] = useState(false);
  const [forecastInput, setForecastInput] = useState('');
  const [forecastQuarter, setForecastQuarter] = useState('Q4 2026');
  const [forecastSending, setForecastSending] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const ctx = PAGE_CTX[pathname as keyof typeof PAGE_CTX] ?? DEFAULT_CTX;
  const msgsEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const forecastInputRef = useRef<HTMLInputElement>(null);

  const { messages, isLoading, sendMessage } = useChat({
    currentView: pathname.replace('/', '') || 'dashboard',
    period: { type: 'month', startDate: '2026-10-01', endDate: '2026-10-31', label: 'Oct 2026' },
    highlights: [`Viewing: ${ctx.label}`],
  });

  // Derive visible chips
  const totalSets = Math.ceil(ctx.allChips.length / 6);
  const currentSet = chipSetIdx % totalSets;
  const visibleChips = ctx.allChips.slice(currentSet * 6, currentSet * 6 + 6);
  const currentThinkBig = THINK_BIG_SETS[thinkBigIdx % THINK_BIG_SETS.length];

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
    if (open && mode !== 'forecast') msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, open, mode]);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        if (mode === 'forecast') forecastInputRef.current?.focus();
        else inputRef.current?.focus();
      }, 220);
    }
  }, [open, mode]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Reset chip index when page changes; switch to forecast mode when on /ai-forecast
  useEffect(() => {
    setChipSetIdx(0);
    setThinkBigIdx(0);
    if (pathname === '/ai-forecast') setMode('forecast');
  }, [pathname]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput('');
  };

  const handleRefreshChips = () => {
    setRefreshAnim(true);
    setChipSetIdx((i) => i + 1);
    setTimeout(() => setRefreshAnim(false), 450);
  };

  const handleRefreshThinkBig = () => {
    setThinkRefreshAnim(true);
    setThinkBigIdx((i) => i + 1);
    setTimeout(() => setThinkRefreshAnim(false), 450);
  };

  // ── Forecast submit: dispatch event to ai-forecast page or navigate there ──
  const handleForecastSend = () => {
    if (!forecastInput.trim() || forecastSending) return;
    setForecastSending(true);

    const payload = { quarter: forecastQuarter, input: forecastInput.trim() };

    if (pathname === '/ai-forecast') {
      // Already on the page — dispatch event directly
      window.dispatchEvent(new CustomEvent('forecast-panel-input', { detail: payload }));
      setForecastInput('');
      setForecastSending(false);
    } else {
      // Navigate to the page; it will pick up from localStorage
      localStorage.setItem('eb-forecast-pending', JSON.stringify(payload));
      router.push('/ai-forecast');
      setForecastInput('');
      setTimeout(() => setForecastSending(false), 1500);
    }
  };

  const MODE_TABS: { key: PanelMode; label: string; icon: string }[] = [
    { key: 'questions', label: 'Quick Questions', icon: '❓' },
    { key: 'thinkbig',  label: 'Think Big',        icon: '💡' },
    { key: 'forecast',  label: 'Forecast',          icon: '📈' },
  ];

  return (
    <>
      <style>{`
        @keyframes eb-spin-once {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes eb-chip-fade {
          from { opacity: 0; transform: translateY(3px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

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
        {/* ── Header ── */}
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
              {mode === 'forecast' ? `Forecast · ${forecastQuarter}` : `Context: ${ctx.label} · Oct 2026`}
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

        {/* ── Mode tabs ── */}
        <div className="flex border-b flex-shrink-0" style={{ borderColor: 'rgba(0,0,0,0.08)', background: '#F8F8FA' }}>
          {MODE_TABS.map((tab) => {
            const active = mode === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setMode(tab.key)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-bold uppercase tracking-[0.06em] cursor-pointer transition-all border-b-2"
                style={{
                  background: active ? '#FFFFFF' : 'transparent',
                  color: active ? '#1D44BF' : '#6B7280',
                  borderBottomColor: active ? '#1D44BF' : 'transparent',
                  fontFamily: 'inherit',
                  border: 'none',
                  borderBottom: active ? '2px solid #1D44BF' : '2px solid transparent',
                }}
              >
                <span style={{ fontSize: 13 }}>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Chat messages (hidden in forecast mode) ── */}
        {mode !== 'forecast' && (
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
        )}

        {/* ── Forecast Assistant mode ── */}
        {mode === 'forecast' && (
          <div className="flex-1 overflow-y-auto flex flex-col min-h-0">
            {/* Explainer */}
            <div className="px-4 pt-4 pb-3 border-b" style={{ borderColor: 'rgba(0,0,0,0.08)', background: 'rgba(29,68,191,0.04)' }}>
              <div className="text-[12px] leading-relaxed" style={{ color: '#6B7280' }}>
                <strong style={{ color: '#1D44BF' }}>Forecast Assistant</strong> — describe your assumptions below. Results update live in the{' '}
                <button
                  onClick={() => { router.push('/ai-forecast'); }}
                  style={{ color: '#1D44BF', fontWeight: 700, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, padding: 0 }}
                >
                  AI Forecast Builder →
                </button>
              </div>
            </div>

            {/* Quarter selector */}
            <div className="px-4 pt-3 pb-2">
              <div className="text-[10px] font-bold uppercase tracking-[0.10em] mb-2" style={{ color: '#6B7280' }}>
                Target Quarter
              </div>
              <div className="flex flex-wrap gap-1.5">
                {FORECAST_QUARTERS.map((q) => {
                  const active = forecastQuarter === q;
                  return (
                    <button
                      key={q}
                      onClick={() => setForecastQuarter(q)}
                      style={{
                        fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 5, cursor: 'pointer',
                        border: `1px solid ${active ? '#1D44BF' : 'rgba(0,0,0,0.12)'}`,
                        background: active ? '#1D44BF' : 'transparent',
                        color: active ? '#FFFFFF' : '#6B7280',
                        fontFamily: 'inherit',
                      }}
                    >
                      {q}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick scenario templates */}
            <div className="px-4 pt-1 pb-3 border-b" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
              <div className="text-[10px] font-bold uppercase tracking-[0.10em] mb-2" style={{ color: '#6B7280' }}>
                Quick Scenarios
              </div>
              <div className="flex flex-col gap-1.5">
                {FORECAST_SCENARIOS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setForecastInput(s)}
                    className="text-left text-[12px] px-3 py-2 rounded cursor-pointer transition-all"
                    style={{
                      border: '1px solid rgba(29,68,191,0.18)',
                      color: '#374151',
                      background: 'rgba(29,68,191,0.04)',
                      fontFamily: 'inherit',
                      lineHeight: 1.4,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#1D44BF'; e.currentTarget.style.background = 'rgba(29,68,191,0.09)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(29,68,191,0.18)'; e.currentTarget.style.background = 'rgba(29,68,191,0.04)'; }}
                  >
                    ✦ {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Forecast input */}
            <div className="px-4 py-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.10em] mb-2" style={{ color: '#6B7280' }}>
                Custom Assumption for {forecastQuarter}
              </div>
              <div className="flex flex-col gap-2">
                <input
                  ref={forecastInputRef}
                  value={forecastInput}
                  onChange={(e) => setForecastInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleForecastSend(); } }}
                  placeholder={`Describe your ${forecastQuarter} assumptions...`}
                  className="w-full px-3.5 py-3 text-[13px] border rounded outline-none"
                  style={{ background: '#F8F8FA', borderColor: 'rgba(0,0,0,0.12)', color: '#1A1C2E', fontFamily: 'inherit' }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#1D44BF')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)')}
                />
                <button
                  onClick={handleForecastSend}
                  disabled={!forecastInput.trim() || forecastSending}
                  className="w-full py-3 text-[13px] font-bold uppercase tracking-[0.06em] rounded cursor-pointer transition-all"
                  style={{
                    background: !forecastInput.trim() || forecastSending ? '#F0F0F0' : '#1D44BF',
                    color: !forecastInput.trim() || forecastSending ? '#9CA3AF' : '#FFFFFF',
                    border: 'none',
                    fontFamily: 'inherit',
                    opacity: !forecastInput.trim() || forecastSending ? 0.7 : 1,
                  }}
                >
                  {forecastSending
                    ? (pathname === '/ai-forecast' ? 'Applied ✓' : 'Opening Forecast Builder…')
                    : (pathname === '/ai-forecast' ? `Apply to ${forecastQuarter} →` : `Open Forecast Builder →`)
                  }
                </button>
                {pathname !== '/ai-forecast' && (
                  <div className="text-[11px] text-center" style={{ color: '#9CA3AF' }}>
                    Results appear in the Forecast Builder tab
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Quick Questions chips (questions mode only) ── */}
        {mode === 'questions' && (
          <div className="border-t flex-shrink-0" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
            <div className="px-4 pt-2.5 pb-1.5 flex items-center justify-between">
              <div className="text-[10px] font-semibold uppercase tracking-[0.08em]" style={{ color: '#6B7280' }}>
                Quick questions
              </div>
              <button
                onClick={handleRefreshChips}
                title={`Refresh insights (${currentSet + 1}/${totalSets})`}
                className="flex items-center gap-1 cursor-pointer transition-all"
                style={{ color: '#9CA3AF', fontSize: 10, fontWeight: 600, background: 'none', border: 'none', padding: '2px 4px', letterSpacing: '0.04em' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#1D44BF'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#9CA3AF'; }}
              >
                <RefreshIcon spinning={refreshAnim} />
                <span>{currentSet + 1}/{totalSets}</span>
              </button>
            </div>
            <div
              key={`chips-${currentSet}-${pathname}`}
              className="px-4 pb-2.5 flex flex-wrap gap-1.5"
              style={{ animation: 'eb-chip-fade 0.25s ease both' }}
            >
              {visibleChips.map((chip) => (
                <button key={chip} onClick={() => sendMessage(chip)}
                  className="text-[11px] px-2.5 py-1 cursor-pointer transition-all rounded whitespace-nowrap"
                  style={{ border: '1px solid rgba(0,0,0,0.10)', color: '#6B7280', background: '#F8F8FA', fontWeight: 500 }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#1D44BF'; e.currentTarget.style.color = '#1D44BF'; e.currentTarget.style.background = 'rgba(29,68,191,0.07)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.10)'; e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.background = '#F8F8FA'; }}
                >{chip}</button>
              ))}
            </div>
          </div>
        )}

        {/* ── Think Big chips (thinkbig mode only) ── */}
        {mode === 'thinkbig' && (
          <div className="border-t flex-shrink-0" style={{ borderColor: 'rgba(232,184,75,0.30)', background: 'rgba(232,184,75,0.04)' }}>
            <div className="px-4 pt-2.5 pb-1.5 flex items-center justify-between">
              <div className="text-[10px] font-semibold uppercase tracking-[0.08em]" style={{ color: '#C9962A' }}>
                Think Outside the Box
              </div>
              <button
                onClick={handleRefreshThinkBig}
                title="New creative angles"
                className="flex items-center gap-1 cursor-pointer transition-all"
                style={{ color: '#C9962A', opacity: 0.7, fontSize: 10, fontWeight: 600, background: 'none', border: 'none', padding: '2px 4px' }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.7'; }}
              >
                <RefreshIcon spinning={thinkRefreshAnim} />
              </button>
            </div>
            <div
              key={`think-${thinkBigIdx}`}
              className="px-4 pb-3 flex flex-col gap-1.5"
              style={{ animation: 'eb-chip-fade 0.25s ease both' }}
            >
              {currentThinkBig.map((prompt) => (
                <button key={prompt} onClick={() => sendMessage(prompt)}
                  className="text-left text-[11px] px-3 py-1.5 cursor-pointer transition-all rounded-md w-full"
                  style={{ border: '1px solid rgba(232,184,75,0.28)', color: '#92680A', background: 'rgba(232,184,75,0.08)', fontWeight: 500, lineHeight: 1.4 }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#E8B84B'; e.currentTarget.style.background = 'rgba(232,184,75,0.16)'; e.currentTarget.style.color = '#7A5508'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(232,184,75,0.28)'; e.currentTarget.style.background = 'rgba(232,184,75,0.08)'; e.currentTarget.style.color = '#92680A'; }}
                >{prompt}</button>
              ))}
            </div>
          </div>
        )}

        {/* ── Text input (questions and thinkbig modes only) ── */}
        {mode !== 'forecast' && (
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
        )}
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
