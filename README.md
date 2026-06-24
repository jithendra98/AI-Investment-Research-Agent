# AI Investment Research Agent

A production-grade, multi-agent financial research dashboard built for the InsideIIM × Altuni AI Labs assignment.

## 🚀 Features

- **Next.js Frontend**: Highly responsive, premium dark-mode UI using Tailwind CSS, Framer Motion, and Shadcn UI.
- **LangGraph Multi-Agent Workflow**: Sequential orchestration of specialized AI agents.
- **Gemini 2.5 Pro Integration**: Powered by Google's latest `gemini-2.5-pro` model via `@langchain/google-genai`.
- **Real Financial Data**: Utilizes `yahoo-finance2` to pull real-time market cap, stock prices, and financial ratios.
- **Invest/Pass Recommendation**: Final synthesis node generates a definitive "BUY/HOLD/SELL" recommendation with a confidence score.

## 🧠 Architecture & Agent Workflow

The backend uses **LangGraph.js** to route an `AgentState` through 5 distinct nodes sequentially:

1. **Research Agent**: Extracts company overview, industry, and sector details.
2. **Financial Analysis Agent**: Pulls real-time Yahoo Finance data and evaluates revenue growth and profitability.
3. **News Sentiment Agent**: Analyzes recent news to generate a sentiment score and identify positive/negative developments.
4. **Risk Analysis Agent**: Evaluates market, competition, and regulatory risks, generating a risk safety score.
5. **Investment Decision Agent**: Synthesizes the cumulative state to output a final recommendation and reasoned investment thesis.

## 💻 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4, Framer Motion, Radix UI (Shadcn)
- **AI/Orchestration**: LangChain.js, LangGraph.js
- **Models**: Gemini 2.5 Pro
- **Data Source**: Yahoo Finance API

## 🛠 Setup Instructions

1. **Clone the Repository**
2. **Install Dependencies**
   ```bash
   npm install
   ```
3. **Set Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   GOOGLE_API_KEY="your_gemini_api_key_here"
   ```
4. **Run the Development Server**
   ```bash
   npm run dev
   ```

## ⚖️ Trade-offs & Future Improvements

- **Trade-offs**: We opted for a sequential LangGraph workflow rather than parallel execution. While parallel execution is faster, sequential passing ensures the Decision Agent has access to the full synthesized context of the other agents. We simulated the UI loading states to mask the backend latency.
- **Future Improvements**: Implement Server-Sent Events (SSE) to stream the LangGraph execution steps to the frontend in real-time, replacing the simulated UI progress bars. Hook up a premium News API (like Bloomberg or NewsAPI) for deeper real-time sentiment analysis rather than relying on Gemini's recent event knowledge.

## 🚀 Deployment

This project is fully ready to be deployed on **Vercel**. 
Simply push the code to a GitHub repository, link it to Vercel, add your `GOOGLE_API_KEY` in the Vercel Environment Variables settings, and hit Deploy. No additional configuration is required!
