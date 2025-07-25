"""FastAPI application entry point for the Nifty Insight Radar backend.

This module sets up the FastAPI application, configures CORS, registers all
routers and exposes WebSocket endpoints for real‑time streams.  During
startup the database tables are created if they do not already exist.
"""

import asyncio
import json
from datetime import datetime, timedelta
from typing import Dict

from fastapi import Depends, FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .core.config import Settings, get_settings
from .database import Base, get_db, engine
from .routers import (
    auth,
    backtest,
    broker,
    candles,
    greeks,
    indicators,
    levels,
    logs as logs_router,
    ml,
    price as price_router,
    signal,
    trade,
    user,
)
from .utils.data_fetcher import get_current_price
from .utils.scenario_logic import generate_signal

# OptionGreeks is imported only for type hints; ensure the module is loaded
try:
    from .utils.greeks import OptionGreeks  # noqa: F401
except Exception:
    pass


settings: Settings = get_settings()

app = FastAPI(title="Nifty Insight Radar API", openapi_url="/api/openapi.json")

# Allow requests from any origin by default.  In production this should be
# restricted to your frontend's origin.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    """Initialise database tables when the application starts."""
    Base.metadata.create_all(bind=engine)


# Register routers under the `/api` prefix
app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(user.router, prefix="/api", tags=["user"])
app.include_router(price_router.router, prefix="/api", tags=["price"])
app.include_router(candles.router, prefix="/api", tags=["candles"])
app.include_router(levels.router, prefix="/api", tags=["levels"])
app.include_router(indicators.router, prefix="/api", tags=["indicators"])
app.include_router(signal.router, prefix="/api", tags=["signals"])
app.include_router(greeks.router, prefix="/api", tags=["greeks"])
app.include_router(backtest.router, prefix="/api", tags=["backtest"])
app.include_router(ml.router, prefix="/api", tags=["ml"])
app.include_router(logs_router.router, prefix="/api", tags=["logs"])
app.include_router(broker.router, prefix="/api", tags=["broker"])
app.include_router(trade.router, prefix="/api", tags=["trade"])


class ConnectionManager:
    """Manages active WebSocket connections for different streams."""

    def __init__(self) -> None:
        self.active_connections: Dict[str, list[WebSocket]] = {
            "price": [],
            "signal": [],
            "logs": [],
        }

    async def connect(self, websocket: WebSocket, stream: str) -> None:
        await websocket.accept()
        self.active_connections[stream].append(websocket)

    def disconnect(self, websocket: WebSocket, stream: str) -> None:
        if websocket in self.active_connections[stream]:
            self.active_connections[stream].remove(websocket)

    async def broadcast(self, stream: str, message: dict) -> None:
        for connection in list(self.active_connections[stream]):
            try:
                await connection.send_json(message)
            except WebSocketDisconnect:
                self.disconnect(connection, stream)


manager = ConnectionManager()


async def price_feed(symbol: str) -> None:
    """Continuously fetches the current price and broadcasts it over the price stream."""
    while True:
        try:
            price = await get_current_price(symbol)
            await manager.broadcast(
                "price", {"type": "price", "data": {"symbol": symbol, "price": price, "timestamp": datetime.utcnow().isoformat()}},
            )
        except Exception:
            # fail silently, client will handle errors
            pass
        await asyncio.sleep(settings.websocket_refresh_rate)


async def signal_feed(symbol: str, db: Session) -> None:
    """Continuously generates trading signals and broadcasts them over the signal stream."""
    while True:
        try:
            signal_data = await generate_signal(symbol, db)
            await manager.broadcast("signal", {"type": "signal", "data": signal_data.dict()})
        except Exception:
            pass
        await asyncio.sleep(settings.websocket_refresh_rate)


async def log_feed(limit: int, db: Session) -> None:
    """Continuously streams the most recent logs to connected clients."""
    from .crud import get_recent_logs  # imported here to avoid circular import
    while True:
        try:
            logs = get_recent_logs(db, limit=limit)
            await manager.broadcast("logs", {"type": "log", "data": logs})
        except Exception:
            pass
        await asyncio.sleep(settings.websocket_refresh_rate)


@app.websocket("/ws/price")
async def websocket_price(websocket: WebSocket, symbol: str) -> None:
    """WebSocket endpoint for streaming current price updates."""
    await manager.connect(websocket, "price")
    task: asyncio.Task | None = None
    try:
        # Start background task
        task = asyncio.create_task(price_feed(symbol))
        while True:
            # Keep the connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        pass
    finally:
        if task:
            task.cancel()
        manager.disconnect(websocket, "price")


@app.websocket("/ws/signal")
async def websocket_signal(websocket: WebSocket, symbol: str) -> None:
    """WebSocket endpoint for streaming trading signals."""
    await manager.connect(websocket, "signal")
    db = next(get_db())
    task: asyncio.Task | None = None
    try:
        task = asyncio.create_task(signal_feed(symbol, db))
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        pass
    finally:
        if task:
            task.cancel()
        manager.disconnect(websocket, "signal")


@app.websocket("/ws/logs")
async def websocket_logs(websocket: WebSocket, limit: int = 100) -> None:
    """WebSocket endpoint for streaming recent log entries."""
    await manager.connect(websocket, "logs")
    db = next(get_db())
    task: asyncio.Task | None = None
    try:
        task = asyncio.create_task(log_feed(limit, db))
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        pass
    finally:
        if task:
            task.cancel()
        manager.disconnect(websocket, "logs")