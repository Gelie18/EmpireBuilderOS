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
      'May priorities?',
    ],
  },
  '/pnl': {
    label: 'P&L',
    allChips: [
      'What drove the marketing overage?',
      'Why did gross margin expand?',
      'Break down OpEx by category',
      'P&L vs last April?',
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
      'May cash outlook?',
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
      'May outlook?',
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
      'Email campaign impact on Apr 12?',
      'Revenue run rate for May?',
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
  label: 'Empire OS',
  allChips: [
    'Net income miss — root cause?',
    'Cash and runway status?',
    'What do I tell the board?',
    'Q4 outlook?',
    'Biggest cost reduction opportunity?',
    'May priorities?',
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
const FORECAST_QUARTERS = ['Q2 2026', 'Q3 2026', 'Q4 2026', 'Q1 2027', 'Q2 2027'];

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
  const [forecastQuarter, setForecastQuarter] = useState('Q2 2026');
  const [forecastSending, setForecastSending] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const ctx = PAGE_CTX[pathname as keyof typeof PAGE_CTX] ?? DEFAULT_CTX;
  const msgsEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const forecastInputRef = useRef<HTMLInputElement>(null);

  const { messages, isLoading, sendMessage } = useChat({
    currentView: pathname.replace('/', '') || 'dashboard',
    period: { type: 'month', startDate: '2026-04-01', endDate: '2026-04-30', label: 'Apr 2026' },
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
        @keyframes eb-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
      `}</style>

      <div
        className="fixed z-[60] flex flex-col bottom-14 md:bottom-0"
        style={{
          top: 52, right: 0, width: '100%', maxWidth: 440,
          background: '#13172B',
          borderLeft: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '-8px 0 48px rgba(0,0,0,0.45)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* ── Header — premium gradient ── */}
        <div className="flex-shrink-0" style={{
          background: 'linear-gradient(135deg, #0B0D17 0%, #1A1028 50%, #0D1424 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '16px 16px 0',
        }}>
          {/* Top row: icon + title + close */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              {/* AI CFO icon mark */}
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: 'linear-gradient(135deg, #1D44BF 0%, #E8B84B 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 12px rgba(27,77,230,0.40)',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFFFFF">
                  <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
                </svg>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 16, fontWeight: 900, letterSpacing: '-0.01em', color: '#FFFFFF' }}>
                    AI CFO
                  </span>
                  {/* Live indicator */}
                  <span style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    background: 'rgba(45,180,122,0.15)',
                    border: '1px solid rgba(45,180,122,0.35)',
                    borderRadius: 20, padding: '2px 6px',
                  }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%', background: '#2DB47A',
                      animation: 'eb-pulse 2s infinite',
                      display: 'inline-block', flexShrink: 0,
                    }} />
                    <span style={{ fontSize: 8, fontWeight: 800, color: '#2DB47A', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
                      Live
                    </span>
                  </span>
                </div>
                {/* Page context chip */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  borderRadius: 4, padding: '2px 7px',
                }}>
                  <svg width="9" height="9" fill="none" stroke="rgba(255,255,255,0.40)" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.50)', letterSpacing: '0.06em' }}>
                    {mode === 'forecast' ? `Forecast · ${forecastQuarter}` : `${ctx.label} · Apr 2026`}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                background: 'transparent', border: '1px solid rgba(255,255,255,0.14)',
                color: 'rgba(255,255,255,0.45)', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: 14,
                transition: 'border-color 0.12s, color 0.12s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.40)'; e.currentTarget.style.color = '#FFFFFF'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
            >✕</button>
          </div>

          {/* Mode switcher — pill tabs pinned to bottom of header */}
          <div style={{ display: 'flex', gap: 2, marginBottom: 0, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10 }}>
            {MODE_TABS.map((tab) => {
              const active = mode === tab.key;
              const icons: Record<string, React.ReactNode> = {
                questions: <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
                thinkbig: <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M9 21h6M12 3a6 6 0 0 1 6 6c0 3-2 5-3 6H9c-1-1-3-3-3-6a6 6 0 0 1 6-6z"/></svg>,
                forecast: <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
              };
              return (
                <button
                  key={tab.key}
                  onClick={() => setMode(tab.key)}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                    padding: '8px 6px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: active ? '2px solid #1D44BF' : '2px solid transparent',
                    color: active ? '#FFFFFF' : 'rgba(255,255,255,0.40)',
                    cursor: 'pointer', fontFamily: 'inherit',
                    fontSize: 11, fontWeight: active ? 700 : 500,
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    transition: 'color 0.12s, border-color 0.12s',
                  }}
                  onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.70)'; }}
                  onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.40)'; }}
                >
                  {icons[tab.key]}
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Chat messages (hidden in forecast mode) ── */}
        {mode !== 'forecast' && (
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-5 min-h-0"
            style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.018) 40px)' }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{
                display: 'flex',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-end', gap: 8,
              }}>
                {/* Avatar */}
                <div style={{
                  width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg,#1D44BF,#B31010)'
                    : 'linear-gradient(135deg,#1D44BF,#E8B84B)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {msg.role === 'user' ? (
                    <svg width="12" height="12" fill="none" stroke="#FFFFFF" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#FFFFFF">
                      <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/>
                    </svg>
                  )}
                </div>
                <div style={{ maxWidth: '82%', display: 'flex', flexDirection: 'column', gap: 3,
                  alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.35)', paddingLeft: msg.role === 'assistant' ? 2 : 0, paddingRight: msg.role === 'user' ? 2 : 0 }}>
                    {msg.role === 'user' ? 'You' : 'AI CFO'}
                  </span>
                  <div style={{
                    padding: '11px 14px',
                    background: msg.role === 'user'
                      ? 'linear-gradient(135deg,#C91A14,#1D44BF)'
                      : 'linear-gradient(180deg,#1E2442 0%,#1A1F38 100%)',
                    color: '#FFFFFF',
                    borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '4px 14px 14px 14px',
                    border: msg.role === 'assistant' ? '1px solid rgba(255,255,255,0.08)' : 'none',
                    fontSize: 13, lineHeight: 1.55,
                    boxShadow: msg.role === 'user'
                      ? '0 2px 8px rgba(27,77,230,0.30)'
                      : '0 2px 6px rgba(0,0,0,0.20)',
                  }}>
                    {msg.role === 'assistant'
                      ? <FormattedMessage content={msg.content} />
                      : msg.content
                    }
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                  background: 'linear-gradient(135deg,#1D44BF,#E8B84B)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#FFFFFF">
                    <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/>
                  </svg>
                </div>
                <div style={{
                  padding: '12px 16px', borderRadius: '4px 14px 14px 14px',
                  background: 'linear-gradient(180deg,#1E2442 0%,#1A1F38 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.20)',
                }}>
                  <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                    {[0, 1, 2].map((i) => (
                      <span key={i} style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: i === 0 ? '#1D44BF' : i === 1 ? '#E85020' : '#E8B84B',
                        animation: 'eb-pulse 1.2s infinite',
                        animationDelay: `${i * 0.18}s`,
                        display: 'inline-block',
                      }} />
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

            {/* Quarter + Open Builder bar */}
            <div className="px-3 pt-3 pb-2.5 border-b flex items-center gap-2 flex-wrap" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              {FORECAST_QUARTERS.map((q) => {
                const active = forecastQuarter === q;
                return (
                  <button key={q} onClick={() => setForecastQuarter(q)}
                    style={{
                      fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, cursor: 'pointer',
                      border: `1px solid ${active ? '#1D44BF' : 'rgba(255,255,255,0.10)'}`,
                      background: active ? '#1D44BF' : 'transparent',
                      color: active ? '#FFFFFF' : 'rgba(255,255,255,0.50)', fontFamily: 'inherit',
                    }}>
                    {q}
                  </button>
                );
              })}
              <button
                onClick={() => { router.push('/ai-forecast'); setOpen(false); }}
                style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, color: '#1D44BF', background: 'rgba(27,77,230,0.08)', border: '1px solid rgba(27,77,230,0.20)', borderRadius: 4, padding: '3px 8px', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(27,77,230,0.15)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(27,77,230,0.08)'; }}
              >
                Open Builder →
              </button>
            </div>

            {/* Quick scenarios — 2-column compact grid */}
            <div className="px-3 pt-2.5 pb-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <div className="text-[9px] font-bold uppercase tracking-[0.10em] mb-1.5" style={{ color: 'rgba(255,255,255,0.50)' }}>Quick scenarios</div>
              <div className="grid grid-cols-2 gap-1">
                {FORECAST_SCENARIOS.map((s) => (
                  <button key={s} onClick={() => setForecastInput(s)}
                    className="text-left cursor-pointer transition-all"
                    style={{ fontSize: 10.5, padding: '5px 8px', border: '1px solid rgba(27,77,230,0.25)', color: 'rgba(255,255,255,0.50)', background: 'rgba(27,77,230,0.06)', borderRadius: 4, fontFamily: 'inherit', lineHeight: 1.35 }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#1D44BF'; e.currentTarget.style.background = 'rgba(27,77,230,0.15)'; e.currentTarget.style.color = '#FFFFFF'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(27,77,230,0.25)'; e.currentTarget.style.background = 'rgba(27,77,230,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.50)'; }}
                  >{s}</button>
                ))}
              </div>
            </div>

            {/* Custom input + apply */}
            <div className="px-3 py-3">
              <div className="flex gap-1.5">
                <input
                  ref={forecastInputRef}
                  value={forecastInput}
                  onChange={(e) => setForecastInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleForecastSend(); } }}
                  placeholder={`${forecastQuarter} assumption…`}
                  className="flex-1 px-3 py-2 text-[12px] border rounded outline-none"
                  style={{ background: '#1E2236', borderColor: 'rgba(255,255,255,0.12)', color: '#FFFFFF', fontFamily: 'inherit', minWidth: 0 }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#1D44BF')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                />
                <button
                  onClick={handleForecastSend}
                  disabled={!forecastInput.trim() || forecastSending}
                  className="flex-shrink-0 px-3 py-2 text-[11px] font-bold uppercase rounded cursor-pointer"
                  style={{
                    background: !forecastInput.trim() || forecastSending ? '#2A2F4A' : '#1D44BF',
                    color: !forecastInput.trim() || forecastSending ? 'rgba(255,255,255,0.28)' : '#FFFFFF',
                    border: 'none', fontFamily: 'inherit', letterSpacing: '0.04em',
                    opacity: !forecastInput.trim() || forecastSending ? 0.6 : 1,
                  }}
                >
                  {forecastSending ? '✓' : (pathname === '/ai-forecast' ? 'Apply' : 'Go →')}
                </button>
              </div>
              {pathname !== '/ai-forecast' && forecastInput.trim() && (
                <div className="text-[10px] mt-1.5" style={{ color: 'rgba(255,255,255,0.50)' }}>
                  Will open Forecast Builder and apply
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Quick Questions chips (questions mode only) ── */}
        {mode === 'questions' && (
          <div className="border-t flex-shrink-0" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <div className="px-4 pt-2.5 pb-1.5 flex items-center justify-between">
              <div className="text-[10px] font-semibold uppercase tracking-[0.08em]" style={{ color: 'rgba(255,255,255,0.50)' }}>
                Quick questions
              </div>
              <button
                onClick={handleRefreshChips}
                title={`Refresh insights (${currentSet + 1}/${totalSets})`}
                className="flex items-center gap-1 cursor-pointer transition-all"
                style={{ color: 'rgba(255,255,255,0.28)', fontSize: 10, fontWeight: 600, background: 'none', border: 'none', padding: '2px 4px', letterSpacing: '0.04em' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#1D44BF'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.28)'; }}
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
                  style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.50)', background: '#242840', fontWeight: 500 }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#1D44BF'; e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.background = 'rgba(27,77,230,0.15)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.50)'; e.currentTarget.style.background = '#242840'; }}
                >{chip}</button>
              ))}
            </div>
          </div>
        )}

        {/* ── Think Big chips (thinkbig mode only) ── */}
        {mode === 'thinkbig' && (
          <div className="border-t flex-shrink-0" style={{ borderColor: 'rgba(245,138,31,0.30)', background: 'rgba(245,138,31,0.04)' }}>
            <div className="px-4 pt-2.5 pb-1.5 flex items-center justify-between">
              <div className="text-[10px] font-semibold uppercase tracking-[0.08em]" style={{ color: '#D9700F' }}>
                Think Outside the Box
              </div>
              <button
                onClick={handleRefreshThinkBig}
                title="New creative angles"
                className="flex items-center gap-1 cursor-pointer transition-all"
                style={{ color: '#D9700F', opacity: 0.7, fontSize: 10, fontWeight: 600, background: 'none', border: 'none', padding: '2px 4px' }}
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
                  style={{ border: '1px solid rgba(245,138,31,0.28)', color: '#92680A', background: 'rgba(245,138,31,0.08)', fontWeight: 500, lineHeight: 1.4 }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#E8B84B'; e.currentTarget.style.background = 'rgba(245,138,31,0.16)'; e.currentTarget.style.color = '#7A5508'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(245,138,31,0.28)'; e.currentTarget.style.background = 'rgba(245,138,31,0.08)'; e.currentTarget.style.color = '#92680A'; }}
                >{prompt}</button>
              ))}
            </div>
          </div>
        )}

        {/* ── Text input (questions and thinkbig modes only) ── */}
        {mode !== 'forecast' && (
          <div style={{
            padding: '12px 14px',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            background: '#0D1020',
          }}>
            <div style={{
              display: 'flex', gap: 8, alignItems: 'center',
              background: '#1A1F38',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: 12, padding: '6px 6px 6px 14px',
              transition: 'border-color 0.12s',
            }}
              onFocusCapture={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(27,77,230,0.50)'; }}
              onBlurCapture={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.10)'; }}
            >
              <input
                ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Ask your AI CFO anything…"
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  color: '#FFFFFF', fontSize: 13, fontFamily: 'inherit',
                }}
              />
              <button onClick={handleSend} disabled={isLoading || !input.trim()}
                style={{
                  width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                  background: isLoading || !input.trim()
                    ? 'rgba(255,255,255,0.05)'
                    : 'linear-gradient(135deg,#1D44BF,#B31010)',
                  border: 'none', cursor: isLoading || !input.trim() ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.15s, box-shadow 0.15s',
                  boxShadow: !isLoading && input.trim() ? '0 2px 8px rgba(27,77,230,0.40)' : 'none',
                }}>
                <svg width="14" height="14" fill="none"
                  stroke={isLoading || !input.trim() ? 'rgba(255,255,255,0.20)' : '#FFFFFF'}
                  strokeWidth="2.5" viewBox="0 0 24 24">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            <div style={{ textAlign: 'center', marginTop: 6, fontSize: 9, color: 'rgba(255,255,255,0.20)', letterSpacing: '0.06em' }}>
              ENTER to send · ESC to close
            </div>
          </div>
        )}
      </div>

      {/* Desktop toggle — gradient pill */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="hidden md:flex fixed z-[61] items-center gap-2.5 cursor-pointer"
        style={{
          bottom: 28, right: open ? 448 : 28,
          background: open
            ? 'rgba(255,255,255,0.06)'
            : 'linear-gradient(135deg,#1D44BF 0%,#E8B84B 100%)',
          color: '#FFFFFF',
          padding: '10px 18px 10px 14px',
          border: open ? '1px solid rgba(255,255,255,0.12)' : 'none',
          boxShadow: open
            ? '0 2px 8px rgba(0,0,0,0.30)'
            : '0 4px 20px rgba(27,77,230,0.35), 0 2px 8px rgba(0,0,0,0.15)',
          fontWeight: 800, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase',
          transition: 'right 0.28s cubic-bezier(0.4,0,0.2,1), background 0.18s',
          borderRadius: 10,
        }}
        onMouseEnter={(e) => { if (!open) (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 28px rgba(27,77,230,0.50), 0 2px 8px rgba(0,0,0,0.20)'; }}
        onMouseLeave={(e) => { if (!open) (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(27,77,230,0.35), 0 2px 8px rgba(0,0,0,0.15)'; }}
      >
        {open ? (
          <><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>Close</>
        ) : (
          <><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/>
          </svg>AI CFO</>
        )}
      </button>
    </>
  );
}
