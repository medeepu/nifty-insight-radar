"""
Stubbed data fetching utilities.

This module defines asynchronous helper functions to retrieve market data.
In a production environment these functions should integrate with real data
providers (e.g. NSE, broker APIs, or external market data services) to
fetch current prices, previous close values and other statistics.  For
development and testing purposes the functions below return constant
values.  Replace their bodies with actual API calls or database queries
as needed.
"""

from __future__ import annotations

import datetime
from typing import Optional


async def get_current_price(symbol: str) -> Optional[float]:
    """Returns the latest price for the given symbol.

    This stub returns a fixed number.  In production, implement logic to
    fetch real‐time prices from a data provider or database cache.

    Args:
        symbol: Ticker symbol (e.g. ``"NIFTY"``)

    Returns:
        The latest price as a float, or ``None`` if unavailable.
    """
    # TODO: Integrate with real market data provider here.
    return 100.0


async def get_previous_close(symbol: str) -> Optional[float]:
    """Returns the previous trading day's close price for the given symbol.

    This stub returns a fixed number slightly below ``get_current_price``.
    Replace this logic with a call to your data provider.

    Args:
        symbol: Ticker symbol

    Returns:
        The previous close price as a float, or ``None`` if unavailable.
    """
    # TODO: Fetch previous close from market data provider or database.
    current = await get_current_price(symbol)
    if current is None:
        return None
    return current - 1.0


async def get_historical_candles(
    symbol: str,
    start: str,
    end: str,
    timeframe: str = "1d",
    limit: int = 100,
) -> list:
    """Fetches historical OHLCV candles for a given symbol and time range.

    This is a stub implementation that returns a small list of synthetic
    candles.  Replace this function with a call to your data provider's
    historical candle API.  The timestamps should be ISO8601 strings.

    Args:
        symbol: Ticker symbol
        start: ISO timestamp (inclusive) for the beginning of the period
        end: ISO timestamp (exclusive) for the end of the period
        timeframe: Candle granularity (e.g. '5m', '15m', '1d')
        limit: Maximum number of candles to return

    Returns:
        A list of ``Candle`` schema instances in chronological order.
    """
    from ..schemas import Candle  # Local import to avoid circular deps
    # TODO: Implement real candle fetching using NSE or broker API.
    # For development we fabricate a couple of candles.
    now = datetime.datetime.utcnow()
    candles = []
    for i in range(min(limit, 2)):
        timestamp = now - datetime.timedelta(minutes=5 * (limit - i))
        candles.append(
            Candle(
                time=timestamp,
                open=100.0 + i,
                high=101.0 + i,
                low=99.0 + i,
                close=100.5 + i,
                volume=1000 + 10 * i,
            )
        )
    return candles