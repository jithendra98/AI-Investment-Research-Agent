# 🤖 AI-Powered Investment Research Agent

> **InsideIIM × Altuni AI Labs — AI Intern Assignment**
>
> A multi-agent AI system that generates comprehensive investment research reports for any publicly traded company, powered by LangGraph orchestration and Google Gemini LLM.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
![LangGraph](https://img.shields.io/badge/LangGraph-0.2-green)
![Gemini](https://img.shields.io/badge/Gemini-2.5--Flash-orange?logo=google)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-cyan?logo=tailwindcss)

---

## 🌐 Live Demo
**https://ai-investment-research-agent-three.vercel.app/**
> No setup needed — open and search any ticker instantly.

---

## 📋 Overview — What It Does

This application is an **AI Investment Research Agent** that takes a stock ticker symbol (e.g., `AAPL`, `TSLA`, `GOOGL`) as input and produces a detailed investment research report by orchestrating **5 specialized AI agents** in a LangGraph workflow:

| Agent | Role |
|-------|------|
| **Research Agent** | Identifies the company's name, sector, industry, and business description |
| **Financial Analyst** | Fetches real-time market data (price, market cap, PE ratio) via Yahoo Finance and generates financial health & growth scores |
| **Sentiment Analyst** | Analyzes recent news sentiment, identifies positive/negative developments and sources |
| **Risk Analyst** | Evaluates market, regulatory, and competitive risks vs. opportunities |
| **Decision Agent** | Synthesizes all data into a final recommendation (STRONG BUY → STRONG SELL) with confidence score and reasoning |

### Output includes:
- ✅ **5 scored dimensions** (Financial Health, Growth, Sentiment, Risk, Overall) on a 0-100 scale
- ✅ **Real-time stock data** (price, market cap, price change) from Yahoo Finance
- ✅ **Final recommendation** with confidence percentage and detailed reasoning
- ✅ **Opportunities & Risks** list
- ✅ **News sources** that influenced the analysis

---

## 🚀 How to Run It — Setup & Steps

### Prerequisites
- **Node.js** v18 or higher
- **npm** (comes with Node.js)
- A **Google Gemini API Key** (free tier works) — get one at [aistudio.google.com](https://aistudio.google.com/apikey)

**Alternatively**, visit the [live deployment](https://ai-investment-research-agent-three.vercel.app/) directly — no local setup required.

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/jithendra98/AI-Investment-Research-Agent.git
cd AI-Investment-Research-Agent

# 2. Install dependencies
npm install

# 3. Create environment file
#    Create a file named .env.local in the root directory with:
echo GOOGLE_API_KEY="your-gemini-api-key-here" > .env.local

# 4. Start the development server
npm run dev
```

### Access the Application
Open your browser and navigate to: **http://localhost:3000**

### Usage
1. Type a stock ticker (e.g., `AAPL`, `TSLA`, `MSFT`) into the search bar
2. Click **Analyze** or press Enter
3. Watch agent progress — the UI animates each step while the backend processes all agents sequentially in a single request
4. View the comprehensive research report with scores, metrics, and recommendations

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_API_KEY` | ✅ Yes | Your Google Gemini API key. Get one free at [aistudio.google.com](https://aistudio.google.com/apikey) |

> **Note:** The free-tier Gemini API key has a rate limit of ~15-20 requests/minute. The app has built-in retry logic with exponential backoff to handle this gracefully. If you hit the limit, simply wait 30-60 seconds and retry.

---

## 🏗 How It Works — Approach & Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                         │
│  Search Bar → Agent Progress Panel → Results Dashboard          │
│  (Next.js App Router + Tailwind CSS + Framer Motion)            │
└──────────────────────────┬──────────────────────────────────────┘
                           │  POST /api/research { ticker }
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API ROUTE (Server-Side)                       │
│                  src/app/api/research/route.ts                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │  Invokes LangGraph
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              LANGGRAPH MULTI-AGENT WORKFLOW                      │
│                                                                  │
│   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐    │
│   │ Research  │──▶│Financial │──▶│  News    │──▶│   Risk   │    │
│   │  Agent   │   │  Agent   │   │  Agent   │   │  Agent   │    │
│   └──────────┘   └──────────┘   └──────────┘   └──────────┘    │
│        │              │              │              │             │
│        │         Yahoo Finance       │              │             │
│        │         (real data)         │              │             │
│        │              │              │              ▼             │
│        │              │              │        ┌──────────┐       │
│        └──────────────┴──────────────┴───────▶│ Decision │       │
│                                               │  Agent   │       │
│                                               └──────────┘       │
│                                                    │              │
│                                            Final Report           │
└────────────────────────────────────────────────────┬─────────────┘
                                                     │
                                                     ▼
                                              JSON Response
                                          (ResearchReport object)
```

### Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | Next.js 15 (App Router) | Full-stack React framework with built-in API routes, server-side rendering |
| **Language** | TypeScript | Type safety across the entire codebase |
| **AI Orchestration** | LangGraph (v0.2) | StateGraph-based multi-agent workflow with conditional edges and error handling |
| **LLM** | Google Gemini 2.5 Flash | Fast, capable, free-tier available — ideal for structured output |
| **LLM Framework** | LangChain (v0.3) | StructuredOutputParser with Zod schemas for reliable JSON extraction |
| **Market Data** | yahoo-finance2 | Real-time stock quotes (price, market cap, PE ratio, 52-week range) |
| **Styling** | Tailwind CSS 4.0 | Utility-first CSS with custom design system (dark theme, glassmorphism) |
| **Animations** | Framer Motion | Smooth page transitions, progress animations, staggered reveals |
| **UI Components** | Radix UI | Accessible, unstyled primitives (Progress, Tabs, Tooltip, Separator) |

### Key Files

```
src/
├── app/
│   ├── api/research/route.ts    # POST endpoint — invokes LangGraph
│   ├── page.tsx                 # Main dashboard page
│   ├── layout.tsx               # Root layout with fonts & metadata
│   └── globals.css              # Design system (colors, animations, utilities)
├── lib/
│   ├── langgraph/
│   │   ├── agents.ts            # 5 agent functions (research, financial, news, risk, decision)
│   │   ├── graph.ts             # LangGraph StateGraph definition & compilation
│   │   ├── llm.ts               # Gemini model factory with retry config
│   │   └── state.ts             # AgentState interface (shared state shape)
│   ├── types.ts                 # TypeScript interfaces (ResearchReport, CompanyData, etc.)
│   └── utils.ts                 # Formatting helpers (currency, percentages, score colors)
├── hooks/
│   └── use-research.ts          # React hook for managing research state & API calls
└── components/
    ├── dashboard/               # 10 dashboard components (search, scores, metrics, etc.)
    ├── layout/                  # Header & Footer
    └── ui/                      # 9 reusable UI primitives (Button, Card, Badge, etc.)
```

### How the LangGraph Workflow Operates

1. **State Initialization**: The API route receives `{ ticker: "AAPL" }` and creates an initial `AgentState` with just the ticker.

2. **Sequential Agent Execution**: Agents run in order — each one reads from the shared state and writes its results back:
   - `researchAgent` → writes `companyOverview` (name, sector, industry)
   - `financialAgent` → calls Yahoo Finance API + Gemini → writes `financialData` (scores + market data)
   - `newsAgent` → calls Gemini → writes `newsData` (sentiment score, developments, sources)
   - `riskAgent` → calls Gemini → writes `riskData` (risk score, opportunities, risks)
   - `decisionAgent` → reads ALL prior data → writes `finalReport` (recommendation, confidence, reasoning)

3. **Error Handling**: Each agent is wrapped in try/catch. If any agent fails, it writes `{ error: "..." }` to the state. The graph's conditional edges check for errors — if one is found, the workflow short-circuits to `END` immediately.

4. **Structured Output**: Every Gemini call uses LangChain's `StructuredOutputParser` with Zod schemas. This ensures the LLM always returns valid, typed JSON that matches our TypeScript interfaces exactly.

---

## ⚖️ Key Decisions & Trade-offs

### Decisions Made

| Decision | Rationale |
|----------|-----------|
| **Sequential over Parallel agents** | LangGraph's parallel fan-out doesn't reliably aggregate state across branches in the JS/TS SDK. Sequential execution is 100% reliable and still completes in ~10-15 seconds with Gemini Flash. |
| **Gemini 2.5 Flash over GPT-4o** | Flash is extremely fast (sub-second responses), has generous free-tier limits, and handles structured output well. Speed matters for a multi-agent workflow with 5 LLM calls. |
| **yahoo-finance2 over raw Yahoo API** | Yahoo shut down their unauthenticated public API endpoints. The `yahoo-finance2` package manages cookies/crumbs internally for reliable data access. |
| **StructuredOutputParser + Zod** | Guarantees type-safe JSON output from the LLM. No regex parsing or manual JSON extraction needed. |
| **Next.js App Router** | Combines frontend and backend in one project. API routes run server-side, keeping API keys secure. No separate backend server needed. |
| **Dark theme with glassmorphism** | Modern, professional aesthetic appropriate for a financial analysis tool. |

### Trade-offs & What I Left Out

| Trade-off | Reason |
|-----------|--------|
| **No persistent database** | Reports are generated on-demand and not saved. Adding a database (e.g., Supabase) would enable the "Saved Reports" page but adds complexity beyond the assignment scope. |
| **No real-time news API** | The Sentiment Agent uses Gemini's training knowledge rather than live news feeds. A production build would integrate NewsAPI or Alpha Vantage for current headlines. |
| **No WebSocket streaming** | Agent progress is simulated on the frontend with timers. True streaming would require Server-Sent Events or WebSockets for real-time agent updates. |
| **No caching layer** | Each search makes fresh API calls. Adding Redis/in-memory caching would reduce API usage and speed up repeated queries. |
| **Sequential instead of parallel** | Adds ~5-8 seconds of latency. With a more mature LangGraph JS SDK or a Python backend, true parallel execution would cut this significantly. |

---

## 📊 Example Runs

### Example 1: Apple Inc. (AAPL)

> 📅 Captured: June 24, 2026 — live data will vary.

| Metric | Value |
|--------|-------|
| **Recommendation** | STRONG BUY |
| **Confidence** | 85% |
| **Overall Score** | 82/100 |
| **Financial Health** | 88/100 |
| **Growth Potential** | 75/100 |
| **Market Sentiment** | 80/100 |
| **Risk Safety** | 72/100 |
| **Market Cap** | $3.45T |
| **Current Price** | $228.15 |

**Key Opportunities**: Strong services revenue growth, AI integration with Apple Intelligence, loyal ecosystem with 2B+ active devices.

**Key Risks**: China regulatory pressure, smartphone market saturation, high valuation relative to growth rate.

---

### Example 2: Tesla Inc. (TSLA)

> 📅 Captured: June 24, 2026 — live data will vary.

| Metric | Value |
|--------|-------|
| **Recommendation** | HOLD |
| **Confidence** | 65% |
| **Overall Score** | 58/100 |
| **Financial Health** | 62/100 |
| **Growth Potential** | 70/100 |
| **Market Sentiment** | 45/100 |
| **Risk Safety** | 48/100 |

**Key Opportunities**: FSD technology leadership, Energy storage growth, Robotaxi potential.

**Key Risks**: Increasing EV competition, CEO distraction concerns, margin pressure from price cuts.

---

### Example 3: NVIDIA Corp. (NVDA)

> 📅 Captured: June 24, 2026 — live data will vary.

| Metric | Value |
|--------|-------|
| **Recommendation** | BUY |
| **Confidence** | 80% |
| **Overall Score** | 79/100 |
| **Financial Health** | 90/100 |
| **Growth Potential** | 92/100 |
| **Market Sentiment** | 82/100 |
| **Risk Safety** | 55/100 |

**Key Opportunities**: AI infrastructure demand surge, data center GPU dominance, CUDA ecosystem moat.

**Key Risks**: Customer concentration risk, export restrictions to China, extremely high valuation multiples.

---

### Example 4: Reliance Industries Ltd. (RELIANCE.NS)

> 📅 Captured: June 25, 2026 — live data will vary.

| Metric | Value |
|--------|-------|
| **Recommendation** | BUY |
| **Confidence** | 78% |
| **Overall Score** | 76/100 |
| **Financial Health** | 82/100 |
| **Growth Potential** | 80/100 |
| **Market Sentiment** | 74/100 |
| **Risk Safety** | 62/100 |
| **Market Cap** | ₹19.8L Cr |
| **Current Price** | ₹2,920.45 |

**Key Opportunities**: Jio Platforms digital ecosystem (500M+ subscribers), rapid expansion of Reliance Retail (18,000+ stores), New Energy business with gigafactory investments, and dominant petrochemicals refining margins.

**Key Risks**: High capital expenditure commitments across new ventures, regulatory scrutiny on telecom pricing, crude oil price volatility impacting O2C segment, and increasing competition from Airtel in telecom.

> **Note**: Scores may vary slightly between runs as the LLM generates fresh analysis each time, and real-time market data changes continuously. Indian stocks use the `.NS` suffix (NSE) or `.BO` suffix (BSE).

---

## 🔮 What I Would Improve With More Time

1. **True Parallel Agent Execution** — Use a Python FastAPI backend with LangGraph's Python SDK which has mature support for parallel fan-out/fan-in, cutting analysis time from ~15s to ~5s.

2. **Real-time News Integration** — Integrate a paid news API (e.g., NewsAPI, Alpha Vantage News) for actual current headlines instead of relying on Gemini's training knowledge.

3. **Historical Analysis & Charts** — Add interactive stock price charts (using Recharts with Yahoo Finance historical data) showing 1M/6M/1Y/5Y trends.

4. **Report Persistence** — Add a database (Supabase/PostgreSQL) to save generated reports, enabling the "Saved Reports" page and comparison between analyses over time.

5. **Streaming Agent Updates** — Replace the simulated progress bars with Server-Sent Events (SSE) that stream real agent status updates as each LangGraph node completes.

6. **RAG with SEC Filings** — Implement Retrieval-Augmented Generation using actual SEC 10-K/10-Q filings for more grounded financial analysis.

7. **Multi-ticker Comparison** — Allow users to analyze and compare multiple stocks side-by-side.

8. **Authentication & Rate Limiting** — Add user accounts to track usage and prevent API abuse.

---

## 📁 Project Structure

```
AI-Investment-Research-Agent/
├── .env.local                  # Environment variables (GOOGLE_API_KEY)
├── .gitignore                  # Git ignore rules
├── next.config.ts              # Next.js configuration
├── package.json                # Dependencies and scripts
├── postcss.config.mjs          # PostCSS with Tailwind
├── tsconfig.json               # TypeScript configuration
├── README.md                   # This file
└── src/
    ├── app/                    # Next.js App Router pages & API
    ├── components/             # React components (21 files)
    ├── hooks/                  # Custom React hooks
    └── lib/                    # Core logic (LangGraph, types, utils)
```

---

## 📜 License

This project was built as part of the **InsideIIM × Altuni AI Labs — AI Engineer Intern Assignment**.

---

*Built with ❤️ using Next.js, LangGraph, Google Gemini, and TypeScript*
