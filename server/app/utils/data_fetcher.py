"""External data fetching utilities.

This module contains asynchronous functions for retrieving market data from
third‑party APIs such as Finnhub and Alpha Vantage.  The functions wrap
blocking HTTP calls in an executor so they can be awaited from async
contexts.
"""

from __future__ import annotations

import datetime
import os
import random
import time
from typing import List, Optional

import requests
import asyncio

from ..core.config import get_settings
from ..schemas import Candle


settings = get_settings()


def _finnhub_quote(symbol: str) -> Optional[float]:
    """Fetches the current price for a symbol from Finnhub.

    Returns `None` if the API call fails or the response is invalid.
    """
    api_key = settings.finnhub_api_key
    if not api_key:
        return None
    try:
        url = f"https://finnhub.io/api/v1/quote?symbol={symbol}&token={api_key}"
        resp = requests.get(url, timeout=5)
        data = resp.json()
        return float(data.get("c")) if data.get("c") else None
    except Exception:
        return None


async def get_current_price(symbol: str) -> float:
    """Asynchronously returns the current price of the given symbol.

    It first attempts to query Finnhub; if that fails it returns a random
    price to keep the UI responsive during development.
    """
    loop = asyncio.get_event_loop()
    price = await loop.run_in_executor(None, _finnhub_quote, symbol)
    if price is None:
        # Fallback: generate a pseudo random price around 20000 for NIFTY
        base = 20000.0 if symbol.upper().startswith("NIFTY") else 0.0
        return base + random.uniform(-100, 100)
    return price


def _finnhub_candles(
    symbol: str,
    resolution: str,
    start_ts: int,
    end_ts: int,
) -> Optional[List[Candle]]:
    """Fetches historical candles from Finnhub and returns a list of Candle objects.
    Returns None if the API call fails.
    """
    api_key = settings.finnhub_api_key
    if not api_key:
        return None
    url = (
        f"https://finnhub.io/api/v1/stock/candle?symbol={symbol}&resolution={resolution}"
        f"&from={start_ts}&to={end_ts}&token={api_key}"
    )
    try:
        resp = requests.get(url, timeout=10)
        data = resp.json()
        if data.get("s") != "ok":
            return None
        candles: List[Candle] = []
        for ts, o, h, l, c, v in zip(
            data["t"], data["o"], data["h"], data["l"], data["c"], data["v"]
        ):
            candles.append(
                Candle(
                    time=datetime.datetime.fromtimestamp(ts),
                    open=float(o),
                    high=float(h),
                    low=float(l),
                    close=float(c),
                    volume=float(v),
                )
            )
        return candles
    except Exception:
        return None


async def get_candles(
    symbol: str,
    timeframe: str,
    start: Optional[str] = None,
    end: Optional[str] = None,
) -> List[Candle]:
    """Asynchronously fetches historical candles for a symbol.

    Args:
        symbol: the instrument symbol (e.g. "NIFTY")
        timeframe: resolution like "1m", "5m", "15m", "1h", "1d"
        start: ISO 8601 start timestamp
        end: ISO 8601 end timestamp

    Returns:
        A list of Candle objects sorted by time ascending.
    """
    # Map timeframe to Finnhub resolution
    resolution_map = {
        "1m": "1",
        "5m": "5",
        "15m": "15",
        "1h": "60",
        "1d": "D",
    }
    resolution = resolution_map.get(timeframe, "5")
    # Parse start and end times
    now = datetime.datetime.utcnow()
    if start:
        start_dt = datetime.datetime.fromisoformat(start)
    else:
        start_dt = now - datetime.timedelta(days=1)
    if end:
        end_dt = datetime.datetime.fromisoformat(end)
    else:
        end_dt = now
    start_ts = int(start_dt.timestamp())
    end_ts = int(end_dt.timestamp())
    loop = asyncio.get_event_loop()
    candles = await loop.run_in_executor(None, _finnhub_candles, symbol, resolution, start_ts, end_ts)
    if candles is None:
        # Fallback: generate dummy candles with random walk
        candles = []
        steps = int((end_ts - start_ts) / 300)  # approximate 5‑min bars
        price = 20000.0
        for i in range(steps):
            open_price = price
            close_price = price + random.uniform(-20, 20)
            high_price = max(open_price, close_price) + random.uniform(0, 10)
            low_price = min(open_price, close_price) - random.uniform(0, 10)
            volume = random.uniform(10000, 50000)
            candles.append(
                Candle(
                    time=start_dt + datetime.timedelta(minutes=5 * i),
                    open=open_price,
                    high=high_price,
                    low=low_price,
                    close=close_price,
                    volume=volume,
                )
            )
            price = close_price
    return candles