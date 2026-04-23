# Bases Loaded OS — AI-Powered Business Operating System

Built for **Bases Loaded** · Powered by Claude AI

Three product modules under one roof:
- **Finance OS** — AI-augmented FP&A, live P&L, cash flow, AI CFO (QuickBooks-connected in live mode)
- **HR OS** — Employee-facing AI HR advisor with live HRMS, payroll, benefits, and 401k context
- **Ops OS** — (Coming Soon) Status rollups, vendor tracking, SOP assistant

---

## Overview

Finance OS is a modern financial intelligence platform that gives executives and finance teams a real-time, AI-augmented view of their business. It runs in two modes:

| Mode | Description |
|------|-------------|
| **Demo** | Synthetic data for "Ridgeline Supply Co." — no auth required |
| **Live** | Connected to a real QuickBooks Online account via OAuth 2.0 |

### Features
- **Dashboard** — KPI summary cards with one-click drill-down
- **P&L** — Budget vs. Actuals with AI-generated variance notes
- **Cash Flow** — Position, runway, and operating cash analysis
- **YoY / MoM** — Year-over-year and month-over-month comparisons
- **CEO Report** — Executive priorities and action items
- **Daily Revenue** — Day-by-day revenue breakdown
- **AI Forecast** — Claude-powered 12-month projection
- **Driver Model** — Assumption-driven financial model
- **Scenarios** — Base / Best Case / Conservative / Downside
- **Market Intel** — Competitive benchmarking
- **AI CFO** — Floating chat panel, context-aware on every page

---

## Tech Stack

- **Next.js 15** App Router + TypeScript
- **Tailwind CSS 4** + CSS custom properties
- **Anthropic Claude** (`@anthropic-ai/sdk`) — streaming AI chat
- **Recharts** — financial charts
- **intuit-oauth** — QuickBooks Online OAuth 2.0
- **Vercel** — deployment

---

## Local Development

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/bases-loaded.git
cd bases-loaded
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# App mode — "demo" requires no other env vars
NEXT_PUBLIC_MODE=demo

# Required for AI CFO chat (get from console.anthropic.com)
ANTHROPIC_API_KEY=sk-ant-...

# Required only for NEXT_PUBLIC_MODE=live
QBO_CLIENT_ID=
QBO_CLIENT_SECRET=
QBO_REDIRECT_URI=http://localhost:3000/api/auth/qbo/callback
QBO_ENVIRONMENT=sandbox
```

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Demo Mode

With `NEXT_PUBLIC_MODE=demo` (the default), the app runs entirely on synthetic data for "Ridgeline Supply Co." No QuickBooks account needed. Add your `ANTHROPIC_API_KEY` to enable the AI CFO chat.

---

## Live Mode (QuickBooks Online)

1. Create an app at [developer.intuit.com](https://developer.intuit.com)
2. Set `NEXT_PUBLIC_MODE=live` and fill in the QBO vars in `.env.local`
3. Navigate to `/api/auth/qbo/connect` to start the OAuth flow
4. Financial data will be pulled live from your QBO account

---

## Deploying to Vercel

### One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/bases-loaded)

### Manual deploy

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your repo
3. Add environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_MODE` = `demo`
   - `ANTHROPIC_API_KEY` = your key
   - *(Live mode)* `QBO_CLIENT_ID`, `QBO_CLIENT_SECRET`, `QBO_REDIRECT_URI`, `QBO_ENVIRONMENT`
4. Click **Deploy**

> **Tip:** For live mode on Vercel, set `QBO_REDIRECT_URI` to your production URL:
> `https://your-app.vercel.app/api/auth/qbo/callback`

---

## Project Structure

```
src/
├── app/
│   ├── (app)/              # Main app shell (auth-optional)
│   │   ├── layout.tsx      # TopNav + SideNav + FloatingChat
│   │   ├── dashboard/      # KPI summary + module cards
│   │   ├── pnl/            # P&L with AI variance notes
│   │   ├── cashflow/       # Cash position + runway
│   │   ├── yoy/            # Year-over-year comparison
│   │   ├── mom/            # Month-over-month trend
│   │   ├── daily-revenue/  # Daily revenue breakdown
│   │   ├── daily-ceo/      # CEO executive report
│   │   ├── ai-forecast/    # AI-powered forecast
│   │   ├── forecast/       # Driver-based model
│   │   ├── scenarios/      # What-if scenarios
│   │   ├── balance-sheet/  # Balance sheet
│   │   └── market/         # Market intelligence
│   └── api/
│       ├── chat/           # Claude streaming proxy
│       └── auth/qbo/       # QuickBooks OAuth
├── components/
│   ├── layout/             # TopNav, SideNav, MobileTabBar
│   ├── dashboard/          # KpiCard, KpiGrid, AnomalyBanner
│   └── chat/               # FloatingChat (global AI CFO)
├── hooks/                  # useChat, useFinancialData
└── lib/
    ├── data/               # Types, demo data, data provider
    ├── qbo/                # QuickBooks API client
    └── ai/                 # Claude wrappers, system prompts
```

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_MODE` | Yes | `demo` or `live` |
| `ANTHROPIC_API_KEY` | For chat | From [console.anthropic.com](https://console.anthropic.com) |
| `QBO_CLIENT_ID` | Live only | QuickBooks app client ID |
| `QBO_CLIENT_SECRET` | Live only | QuickBooks app client secret |
| `QBO_REDIRECT_URI` | Live only | OAuth callback URL |
| `QBO_ENVIRONMENT` | Live only | `sandbox` or `production` |

---

*Built with Claude Code · Bases Loaded*
