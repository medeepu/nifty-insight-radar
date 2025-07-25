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

# Nifty Insight Radar Backend

This package contains the backend implementation for the **Nifty Insight Radar** project.

The goal of the backend is to provide a robust, real‑time trading API for the Nifty options market.  It exposes REST and WebSocket endpoints used by the accompanying React frontend to display live prices, indicator overlays, entry/exit signals, option Greeks and risk management metrics.

## Features

The server implements the following key features:

* **Real‑time price feeds** – fetches current quotes for indices and options from Finnhub and Alpha Vantage.  Endpoints like `/api/price/current` and `/api/candles` expose this data in a uniform format.
* **Daily/weekly/monthly levels** – calculates Central Pivot Range (CPR) levels (pivot, BC, TC) along with traditional support/resistance points.  It classifies the CPR as narrow, normal or wide based on the previous day’s range.  Results are persisted in the `levels_daily` table and returned via `/api/levels/daily`, `/api/levels/weekly` and `/api/levels/monthly`.
* **Technical indicators** – computes EMA (9/21/50/200), VWAP, ATR, RSI, stochastic and volume moving average for any symbol and timeframe.  The `/api/indicators` endpoint returns the most recent snapshot.
* **Simplified trade scenarios** – condenses the 25+ scenarios from the original TradingView script into three core patterns: trend breakouts, pullback continuations and range reversals.  Each scenario incorporates CPR levels, moving averages, ATR and volume filters to minimise whipsaws.  The `/api/signal/current` endpoint returns the latest trade signal along with recommended entry/stop/target levels, risk/reward and confidence score.
* **Options analytics** – parses option tickers (e.g. `NIFTY250417C24000`), computes implied volatility if necessary, and produces option prices and Greeks (delta, gamma, theta, vega, rho) using the Black–Scholes model.  Spot level stop/target values are translated to option price targets via delta/gamma.  See `/api/greeks`.
* **User management** – supports account creation, login with JWT authentication, and persistent user settings (risk capital, risk per trade, indicator preferences, etc.) via `/api/user/settings`.  Broker API keys are securely stored using simple symmetric encryption.
* **Trade logging** – records executed trades and their P&L into a `trades` table.  The `/api/trade/execute` endpoint simulates order placement and persists the result.
* **Logs and ML insights** – stores system messages in a `logs` table and exposes the most recent entries through `/api/logs/recent`.  A placeholder ML insight endpoint `/api/ml/insight` demonstrates how machine learning can classify market regimes.

The server is built using **FastAPI**, **SQLAlchemy** and **Pydantic**.  It uses PostgreSQL for persistent storage and Redis for short‑term caching.  Long‑running tasks such as data refreshes or backtesting can be offloaded to Celery workers, but the core logic runs synchronously for simplicity.

Refer to the `app/routers` directory for the full set of API definitions and to `app/utils` for the computational building blocks.

## Quick start

To run the server locally you need Python 3.10+.  Install the dependencies and start the application with the following commands:

```bash
cd nifty_insight_radar_server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Create a `.env` file at the project root to configure database connections and API keys:

```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost/nifty
REDIS_URL=redis://localhost:6379
FINNHUB_API_KEY=d1ur879r01qkk4t26qjgd1ur879r01qkk4t26qk0
ALPHAVANTAGE_API_KEY=EOTWMVGCG0VJUCYM
JWT_SECRET=mysecretkey
ENCRYPTION_KEY=my32byteencryptionkey1234567890
```

## Directory structure

```
nifty_insight_radar_server/
├── app/
│   ├── __init__.py
│   ├── main.py               # FastAPI application and router registration
│   ├── core/
│   │   ├── config.py         # Application settings loaded from environment
│   │   └── security.py       # Password hashing and JWT helpers
│   ├── database.py           # SQLAlchemy engine/session management
│   ├── models.py             # ORM models corresponding to database tables
│   ├── schemas.py            # Pydantic schemas for request/response validation
│   ├── utils/
│   │   ├── cpr.py            # CPR and pivot calculations
│   │   ├── data_fetcher.py    # External API integration (Finnhub/Alpha Vantage)
│   │   ├── greeks.py         # Black–Scholes pricing and Greeks
│   │   ├── indicators.py     # Technical indicator calculations
│   │   ├── options.py        # Option ticker parsing and level translation
│   │   └── scenario_logic.py # Signal generation logic
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py           # User registration/login endpoints
│   │   ├── backtest.py       # Simple backtesting engine (placeholder)
│   │   ├── broker.py         # Broker credentials and trade execution endpoints
│   │   ├── candles.py        # Historical candle data
│   │   ├── greeks.py         # Option Greeks endpoint
│   │   ├── indicators.py     # Indicators endpoint
│   │   ├── levels.py         # Daily/weekly/monthly levels
│   │   ├── logs.py           # Logs retrieval endpoint
│   │   ├── ml.py             # Machine learning insights (placeholder)
│   │   ├── price.py          # Current price endpoint
│   │   ├── signal.py         # Current trade signal endpoint
│   │   ├── trade.py          # Trade logging and execution
│   │   └── user.py           # User settings management
│   └── crud.py               # Database operations (helper functions)
├── migrations/               # Database migrations (not generated in this example)
├── requirements.txt          # Python dependencies
└── README.md                 # This file
```

---

This backend implementation is intentionally modular and extensible.  Each computation (e.g. CPR calculation, indicator generation, option pricing) lives in its own helper module.  The routers import these helpers and expose them as API endpoints.  If you wish to refine the trade logic or extend the calculation of Greeks, you can modify the respective functions in `app/utils` without touching the REST interfaces.
By following these steps you will have a complete, scalable trading platform that marries a polished React frontend with a robust CPR‑centric trading backend.
