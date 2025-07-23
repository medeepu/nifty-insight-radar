# README – Nifty Insight Radar  
*A modern, full-stack platform for intraday NIFTY-50 options analysis and real-time trading*

## 1  Purpose

Nifty Insight Radar gives discretionary and systematic traders a single pane of glass for price action, options analytics and automated execution.  
The front-end is a **React 18 + TypeScript** SPA, the server side (separate repo) is a **FastAPI** micro-service that ingests live market feeds, computes indicators and streams events over WebSockets.

## 2  Key Capabilities

| Category | Highlights |
|----------|------------|
| Real-time charting | TradingView **Lightweight Charts™** with millisecond updates, multi-pane layouts, dark/light themes |
| Technical studies | EMA (9 / 21 / 50 / 200), VWAP, RSI, Stochastic, CPR, Pivot levels, ATR-based risk bands |
| Options toolkit | IV surface, IV rank, payoff builder for 8 preset strategies, Greeks calculator |
| Signal engine | Server-side detection of ORB, ATR breakouts, EMA crossovers; buy/sell markers pushed live |
| Risk management | Visual SL/TP handles, max-loss guard, position sizing by %-risk |
| ML insights | Regime classification (bull / bear / volatile / sideways) via gradient-boosted ensemble |
| Back-tester | Tick-accurate replay of any strategy with equity curve and tradesheet export |
| Broker hooks | Zerodha & Dhan REST integration, sandbox mode, smart-order‐routing with quota fail-over |
| Responsive UI | Works from 320 px mobile to 4 K ultra-wide; touch gestures and haptic tooltips |

## 3  High-Level Architecture

```
┌──────────────┐   REST/WS    ┌──────────────────┐
│ Front-End    │◄────────────►│ FastAPI Gateway  │──► Task queue / workers
│  React + LV  │              └──────────────────┘
│  (Vite)      │ WS Push               │
└──────┬───────┘                       ▼
       │                    ┌────────────────────┐
       │  Charts/Stores     │ Market Feed Layer  │─► Finnhub
       │                    │ (fail-over logic)  │   AlphaVantage
       │                    └────────────────────┘
       ▼
LocalStorage            PostgreSQL  Redis  Kafka (optional)
```

*Fail-over rule*  

```
if finnhub.remaining   > 0:   use Finnhub
elif alpha.burst/min   (null);

  useEffect(() => {
    if (!ref.current) return;
    const chart  = createChart(ref.current, { height: 400 });
    const series = chart.addCandlestickSeries();
    series.setData(candles);                 // initial load

    // live update via WS
    const ws = new WebSocket(import.meta.env.VITE_WS_URL + '/candles/stream?symbol=NIFTY');
    ws.onmessage = e => {
      const pkt: IndicatorPacket = JSON.parse(e.data);
      series.update(pkt.candle);
    };
    return () => ws.close();
  }, []);

  return ;
}
```

## 6  Configuration

| Variable | Purpose | Default |
|----------|---------|---------|
| `VITE_API_BASE_URL` | REST base URL | http://localhost:8000 |
| `VITE_WS_URL` | WebSocket root | ws://localhost:8000 |
| `VITE_DEFAULT_SYMBOL` | boot symbol | NSE:NIFTY |
| `VITE_THEME` | ui-theme hint | system |

## 7  Testing & CI

```bash
# type-strict
bun run type-check      # or: npm run type-check
# lint + prettier
bun run lint && bun run format
# unit tests
bunx vitest run
```

CI (GitHub Actions) runs lint, type-check and vitest on every push and blocks merges on failure.

## 8  Deployment

```bash
bun run build           # output → dist/
```

`dist/` is a static bundle that can be dropped onto Vercel, Netlify, S3 + CloudFront or served behind nginx.

## 9  Road-Map

1. Plug live broker execution APIs (order-sync & PnL).
2. Expand ML module with transformer-based news sentiment stream.
3. Mobile-native wrapper via Capacitor (push notifications & biometrics).

## 10 Contributing

1. Open an issue describing feature or bug.  
2. Fork → create branch `feat/your-feature`.  
3. Follow the **commitizen** conventional commit spec.  
4. Make sure `bun test` passes and docs are updated.  
5. Create PR; the maintainer squad will review within 48 h.

## 11 License

`nifty-insight-radar` is **proprietary software**.  
For evaluation or partnership enquiries, please contact the repository owner.

### Happy trading 📈🚀
