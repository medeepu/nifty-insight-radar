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
from .routers import greeks, indicators, price, settings, ws

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

# Register WebSocket routers without a prefix (WS routes must be absolute)
app.include_router(ws.router)