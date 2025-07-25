# Nifty Options Trading Dashboard with CPR‑Centric Backend

This repository bundles the original **Nifty Options Trading Dashboard** frontend with a brand new **FastAPI backend** that implements a CPR‑focused trading engine.  Use this package as a unified starting point for local development or further customisation.

## Frontend Overview

The React dashboard is a comprehensive real‑time trading interface for intraday NIFTY options analysis and automated execution.  Key features include:

- **Live price feeds** via WebSocket.
- **Interactive charts** with multi‑timeframe support using TradingView Lightweight Charts.
- **Technical indicators**: EMA (9/21/50/200), VWAP, RSI, Stochastic, and CPR levels.
- **Signal system**: Buy/Sell/Neutral signals with risk–reward metrics.
- **Options analytics**: Greeks calculator (Delta, Gamma, Theta, Vega), implied volatility rank, and strike selection.
- **Comprehensive settings**: Customisable widget layouts, indicator styling, risk limits, and timeframe synchronisation.
- **Broker integration**: Built‑in support for Zerodha and Dhan for order placement and account queries (when backend is connected).

For full details on the UI, component structure and design system, refer to the original project documentation.

## Backend Overview

The new backend resides in the `nifty_backend` folder and provides a high‑performance trading engine and API written with **FastAPI**.  It is designed to align with the frontend’s expectations (see `src/hooks/useApi.ts`) and implements the following:

1. **CPR‑centric trading engine**: Calculates daily Central Pivot Range and uses breakout, pullback and reversal scenarios to generate entry, stop and target prices.  Risk management, position sizing and risk–reward calculations are built in.
2. **Option‑level metrics**: Given an option’s Delta, the engine translates underlying stop and target levels into approximate option prices and potential P&L.
3. **Indicator service**: Computes EMA, ATR, RSI, stochastic oscillator and VWAP on demand.
4. **Greeks calculation**: Implements Black–Scholes pricing to return Delta, Gamma, Theta, Vega, Rho and theoretical price for call or put options.
5. **API endpoints** that mirror the frontend’s requirements:
   - `GET /api/price/current?symbol=` – latest spot price.
   - `GET /api/candles?symbol=&tf=&start=&end=` – historical candles.
   - `GET /api/levels/daily?symbol=` – daily pivot and CPR levels.
   - `GET /api/indicators?symbol=&tf=` – current indicator values.
   - `GET /api/signal/current?symbol=&tf=&delta=` – latest trading signal with optional option‑level metrics.
   - `GET /api/greeks?optionSymbol=&spot=&strike=&expiry=&iv=&option_type=` – Greeks and theoretical price.
   - `POST /api/backtest` – stub endpoint for backtesting.
   - `POST /api/broker/keys` and `POST /api/trade/execute` – stubs for broker integration.
   - `GET/POST /api/user/settings` – user configuration persistence (stub).

The backend is modular: indicator calculations live in `nifty_backend/indicators.py`, the trading logic in `nifty_backend/trading_engine.py`, and the API definitions in `nifty_backend/main.py`.  For integration with real market data and brokers, replace the stubs in `nifty_backend/data_provider.py` and extend the broker endpoints accordingly.

## Installation & Setup

### Prerequisites

- **Node.js 18+** or Bun for the frontend.
- **Python 3.10+** for the backend.
- A modern web browser with WebSocket support.

### Backend Setup

1. Create a virtual environment (optional but recommended):

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use venv\Scripts\activate
   ```

2. Install Python dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Run the FastAPI server:

   ```bash
   uvicorn nifty_backend.main:app --reload --port 8000
   ```

   The API will be available at `http://localhost:8000`.  Modify `port` as needed.

### Frontend Setup

1. Install Node dependencies:

   ```bash
   npm install
   # or
   bun install
   ```

2. Create a `.env.local` file with environment variables:

   ```env
   # API Configuration
   VITE_API_BASE_URL=http://localhost:8000
   VITE_WS_URL=ws://localhost:8000

   # Default Settings
   VITE_DEFAULT_SYMBOL=NIFTY
   VITE_DEFAULT_TIMEFRAME=5m
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   bun dev
   ```

Open your browser at `http://localhost:5173` (default Vite port) to view the dashboard.  Ensure the backend is running so that the frontend can retrieve data.

## API Integration Notes

The frontend expects specific REST endpoints and WebSocket channels for price updates, trading signals and logs【969225270487737†L194-L242】.  The provided backend implements all REST endpoints listed in the original README.  WebSocket streaming is currently stubbed; implement `WebSocket` endpoints in `nifty_backend/main.py` if you need real‑time updates.  To integrate with real brokers (Zerodha or Dhan), use their official Python SDKs within the `/api/trade/execute` endpoint.

## Combining Frontend and Backend

This repository does **not** contain the full source code of the original client (to keep the repository size manageable in this environment).  To assemble a complete project:

1. Clone or copy the original frontend files from your existing `nifty-insight-radar` project into this repository, preserving the `src/`, `public/`, `package.json`, and other configuration files.
2. Copy the `nifty_backend` folder and `requirements.txt` into the project root.
3. Replace the existing `README.md` with this file to include backend setup instructions.
4. Commit and push the combined project to your own GitHub repository.

Once combined, you will have a single monorepo containing both React frontend and FastAPI backend.  Use `npm` (or Bun) to develop the UI and `uvicorn` to run the backend concurrently.  Configure a reverse proxy (e.g. Nginx) or Vite’s proxy settings to forward `/api` requests to the backend during development.

## Next Steps

1. **Real data feeds**: Replace the dummy price and candle generation in `nifty_backend/data_provider.py` with actual WebSocket subscriptions from your broker or third‑party APIs (Finnhub, Alpha Vantage).  Cache these ticks in Redis for sub‑100 ms access.
2. **Broker integration**: Implement order placement and execution tracking using `dhanhq` or `kiteconnect` SDKs within `/api/trade/execute`.
3. **WebSocket streaming**: Add `/ws/price`, `/ws/signal` and `/ws/logs` endpoints to broadcast live data and signals to the frontend.  You can utilise `fastapi.WebSocket` and `redis` pub/sub for efficient fan‑out.
4. **Persistence layer**: Connect to PostgreSQL for persisting user settings, API keys, trade history and analytics.  Consider using SQLAlchemy or the `databases` library for asynchronous DB access.
5. **Testing & backtesting**: Extend `/api/backtest` to load historical candles and run the trading engine over a date range.  Write unit tests for indicator calculations and signal logic.

By following these steps you will have a complete, scalable trading platform that marries a polished React frontend with a robust CPR‑centric trading backend.
