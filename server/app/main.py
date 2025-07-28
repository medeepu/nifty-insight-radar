"""
FastAPI application entry point.

This module constructs the FastAPI app, creates database tables and
registers all API routers.  It is intended as a minimal working server
that demonstrates the integration of Greeks calculations, indicator
historical series, price change fields, settings persistence and
WebSocket channels.  Further functionality (e.g. authentication,
broker integration, option chain feeds) can be added by extending
this file and the routers.
"""

from __future__ import annotations

from fastapi import FastAPI

from .database import engine
from .models import Base  # noqa: F401
from .routers import (
    greeks,
    indicators,
    price,
    settings,
    ws,
    levels,
    signal,
    candles,
    logs,
    risk,
    volatility,
    backtest,
    ml as ml_router,
    broker,
)

# Create the FastAPI application
app = FastAPI(title="Nifty Insight Radar API", version="0.2.0")

# Create database tables on startup.  In production consider using
# Alembic for migrations instead of ``create_all``.
Base.metadata.create_all(bind=engine)

# Register HTTP routers with a common /api prefix
app.include_router(greeks.router, prefix="/api")
app.include_router(indicators.router, prefix="/api")
app.include_router(price.router, prefix="/api")
app.include_router(settings.router, prefix="/api")
app.include_router(levels.router, prefix="/api")
app.include_router(signal.router, prefix="/api")
app.include_router(candles.router, prefix="/api")
app.include_router(logs.router, prefix="/api")
app.include_router(risk.router, prefix="/api")
app.include_router(volatility.router, prefix="/api")
# New stubbed routers for backtesting, ML insights and broker orders
app.include_router(backtest.router, prefix="/api")
app.include_router(ml_router.router, prefix="/api")
app.include_router(broker.router, prefix="/api")

# Register WebSocket routers without a prefix (WS routes must be absolute)
app.include_router(ws.router)


# ---------------------------------------------------------------------------
# Background tasks for real‑time WebSocket updates
# ---------------------------------------------------------------------------

import asyncio
import json

from .utils.data_fetcher import get_current_price
from .websocket_manager import manager


async def price_broadcaster(symbol: str = "NIFTY", interval: float = 5.0) -> None:
    """Continuously fetches the latest price and broadcasts it over the ``price`` channel."""
    while True:
        try:
            price = await get_current_price(symbol)
            if price is not None:
                message = json.dumps({"symbol": symbol, "price": price})
                await manager.broadcast("price", message)
        except Exception:
            pass
        await asyncio.sleep(interval)


async def heartbeat_broadcaster(interval: float = 30.0) -> None:
    """Sends a heartbeat ping on each WebSocket channel to keep connections alive."""
    while True:
        await manager.broadcast("price", json.dumps({"type": "heartbeat"}))
        await manager.broadcast("signal", json.dumps({"type": "heartbeat"}))
        await manager.broadcast("logs", json.dumps({"type": "heartbeat"}))
        await manager.broadcast("greeks", json.dumps({"type": "heartbeat"}))
        await asyncio.sleep(interval)


@app.on_event("startup")
async def startup_background_tasks() -> None:
    """Launch background tasks when the application starts."""
    asyncio.create_task(price_broadcaster())
    asyncio.create_task(heartbeat_broadcaster())