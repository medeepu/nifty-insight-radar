"""
Market data fetchers.

This module defines asynchronous helper functions to retrieve market data
from external providers such as Finnhub or Alpha Vantage.  When
``FEATURE_FLAG_FAKE_DATA`` is enabled or no API keys are configured, it
falls back to deterministic synthetic data to avoid accidents in
production.  API keys are loaded from environment variables:

* ``FINNHUB_API_KEY`` – used for quotes and historical candles via
  https://finnhub.io
* ``ALPHAVANTAGE_API_KEY`` – used as a fallback provider via Alpha Vantage
* ``FEATURE_FLAG_FAKE_DATA`` – when set to ``true`` or ``1``, forces
  synthetic data regardless of available API keys

The high‑level fetcher functions in this module are consumed by the
routers; replacing these with real implementations automatically
enables live data throughout the API.
"""

from __future__ import annotations

import datetime
import os
from typing import Optional, List

import httpx

# Load API keys and feature flags from environment variables
ALPHAVANTAGE_API_KEY = os.getenv("ALPHAVANTAGE_API_KEY")
FINNHUB_API_KEY = os.getenv("FINNHUB_API_KEY")
FEATURE_FLAG_FAKE_DATA = os.getenv("FEATURE_FLAG_FAKE_DATA", "false").lower() in ("1", "true", "yes")


def use_fake_data() -> bool:
    """Determines whether to use synthetic data instead of real API calls."""
    if FEATURE_FLAG_FAKE_DATA:
        return True
    # If neither API key is configured we cannot fetch real data
    return not (ALPHAVANTAGE_API_KEY or FINNHUB_API_KEY)


async def get_current_price(symbol: str) -> Optional[float]:
    """Returns the latest price for the given symbol.

    When ``use_fake_data`` is true this returns a synthetic value.  When
    API keys are available it will query Finnhub first and fall back to
    Alpha Vantage.

    Args:
        symbol: Ticker symbol (e.g. ``"NIFTY"``)

    Returns:
        The latest price as a float, or ``None`` if unavailable.
    """
    if use_fake_data():
        # Deterministic synthetic price based on symbol hash
        return float(abs(hash(symbol)) % 1000 + 100)
    # Prefer Finnhub for real‑time quotes
    if FINNHUB_API_KEY:
        url = f"https://finnhub.io/api/v1/quote?symbol={symbol}&token={FINNHUB_API_KEY}"
        async with httpx.AsyncClient(timeout=10) as client:
            try:
                resp = await client.get(url)
                resp.raise_for_status()
                data = resp.json()
                price = data.get("c")
                if price is not None:
                    return float(price)
            except Exception:
                pass
    # Fallback to Alpha Vantage
    if ALPHAVANTAGE_API_KEY:
        url = (
            f"https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey={ALPHAVANTAGE_API_KEY}"
        )
        async with httpx.AsyncClient(timeout=10) as client:
            try:
                resp = await client.get(url)
                resp.raise_for_status()
                data = resp.json()
                quote = data.get("Global Quote", {})
                price_str = quote.get("05. price")
                if price_str:
                    return float(price_str)
            except Exception:
                pass
    return None


async def get_previous_close(symbol: str) -> Optional[float]:
    """Returns the previous trading day's close price for the given symbol."""
    if use_fake_data():
        current = await get_current_price(symbol)
        return current - 1.0 if current is not None else None
    if FINNHUB_API_KEY:
        url = f"https://finnhub.io/api/v1/quote?symbol={symbol}&token={FINNHUB_API_KEY}"
        async with httpx.AsyncClient(timeout=10) as client:
            try:
                resp = await client.get(url)
                resp.raise_for_status()
                data = resp.json()
                close = data.get("pc")
                return float(close) if close is not None else None
            except Exception:
                pass
    if ALPHAVANTAGE_API_KEY:
        url = (
            f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&apikey={ALPHAVANTAGE_API_KEY}"
        )
        async with httpx.AsyncClient(timeout=10) as client:
            try:
                resp = await client.get(url)
                resp.raise_for_status()
                data = resp.json()
                series = data.get("Time Series (Daily)", {})
                if series:
                    latest_date = sorted(series.keys())[-1]
                    price_str = series[latest_date].get("4. close")
                    if price_str:
                        return float(price_str)
            except Exception:
                pass
    return None


async def get_historical_candles(
    symbol: str,
    start: str,
    end: str,
    timeframe: str = "1d",
    limit: int = 100,
) -> List:
    """Fetches historical OHLCV candles for a given symbol and time range.

    When ``use_fake_data`` is true synthetic candles are returned.  If
    Finnhub is configured the candles are fetched via its REST API.  The
    API returns timestamps in seconds since the epoch; these are
    converted to ``datetime.datetime`` for the schema.

    Args:
        symbol: Ticker symbol
        start: ISO timestamp (inclusive)
        end: ISO timestamp (exclusive)
        timeframe: Candle granularity (e.g. '5m', '15m', '1d')
        limit: Maximum number of candles to return

    Returns:
        A list of ``Candle`` schema instances in chronological order.
    """
    from ..schemas import Candle  # Local import to avoid circular deps
    if use_fake_data():
        now = datetime.datetime.utcnow()
        candles: List[Candle] = []
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
    if FINNHUB_API_KEY:
        # Convert ISO timestamps to UNIX epoch seconds
        def iso_to_epoch(ts: str) -> int:
            try:
                dt = datetime.datetime.fromisoformat(ts)
                return int(dt.timestamp())
            except Exception:
                return 0
        start_ts = iso_to_epoch(start)
        end_ts = iso_to_epoch(end)
        res_map = {
            "1m": "1",
            "5m": "5",
            "15m": "15",
            "30m": "30",
            "1h": "60",
            "1d": "D",
        }
        resolution = res_map.get(timeframe, "5")
        url = (
            f"https://finnhub.io/api/v1/stock/candle?symbol={symbol}&resolution={resolution}&from={start_ts}&to={end_ts}&token={FINNHUB_API_KEY}"
        )
        async with httpx.AsyncClient(timeout=15) as client:
            try:
                resp = await client.get(url)
                resp.raise_for_status()
                data = resp.json()
                if data.get("s") != "ok":
                    return []
                times = data.get("t", [])
                opens = data.get("o", [])
                highs = data.get("h", [])
                lows = data.get("l", [])
                closes = data.get("c", [])
                volumes = data.get("v", [])
                candles: List[Candle] = []
                for idx in range(min(len(times), limit)):
                    ts = datetime.datetime.fromtimestamp(times[idx])
                    candles.append(
                        Candle(
                            time=ts,
                            open=float(opens[idx]),
                            high=float(highs[idx]),
                            low=float(lows[idx]),
                            close=float(closes[idx]),
                            volume=float(volumes[idx]),
                        )
                    )
                return candles
            except Exception:
                return []
    # If no provider is configured return an empty list
    return []