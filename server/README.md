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