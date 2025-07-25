"""Aggregates all API routers for easy import in `main.py`.

Each file in this package defines a FastAPI router with a specific
responsibility.  Importing them here allows `app.main` to include them
collectively under a common prefix.
"""

from . import auth, backtest, broker, candles, greeks, indicators, levels, logs, ml, price, signal, trade, user  # noqa: F401

__all__ = [
    "auth",
    "backtest",
    "broker",
    "candles",
    "greeks",
    "indicators",
    "levels",
    "logs",
    "ml",
    "price",
    "signal",
    "trade",
    "user",
]