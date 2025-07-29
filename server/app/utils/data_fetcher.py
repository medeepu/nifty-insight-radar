"""
Market data fetchers and NSE integration.

This module defines asynchronous helper functions to retrieve market data
from external providers.  In addition to the existing integrations with
Finnhub and Alpha Vantage, this version adds rudimentary support for
querying the National Stock Exchange of India (NSE) to obtain live
prices and option chains.  When no API keys are configured or the
``FEATURE_FLAG_FAKE_DATA`` environment variable is set, deterministic
synthetic data is returned instead of hitting any remote endpoints.

Historical candle requests will automatically persist the returned
series using the ``save_historical_candles`` helper.  Persistence is
implemented as a stub so that the rest of the application can be
extended later to write candles into a database or time series store.
"""

from __future__ import annotations

import datetime
import os
from typing import Optional, List, Dict, Any

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


async def get_nse_quote(symbol: str) -> Optional[Dict[str, Any]]:
    """Fetches the raw quote object for an equity listed on the NSE.

    NSE's website exposes an unofficial JSON endpoint for quote data at
    ``https://www.nseindia.com/api/quote-equity?symbol={symbol}``.  The
    response contains nested objects, of which ``priceInfo`` includes
    ``lastPrice``.  To avoid basic anti‑bot mechanisms the request sets a
    browser‑like user agent header.  If the request fails or the
    response is unexpected, ``None`` is returned.

    Args:
        symbol: The NSE ticker (e.g. ``"NIFTY 50"`` or ``"RELIANCE"``).

    Returns:
        A dictionary representing the quote JSON, or ``None`` if it could
        not be retrieved or parsed.
    """
    url = f"https://www.nseindia.com/api/quote-equity?symbol={symbol}"
    headers = {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Referer": "https://www.nseindia.com/",
    }
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(url, headers=headers)
            resp.raise_for_status()
            data = resp.json()
            return data  # type: ignore[no-any-return]
    except Exception:
        return None


async def get_nse_current_price(symbol: str) -> Optional[float]:
    """Returns the latest NSE last traded price for a given symbol.

    This helper uses ``get_nse_quote`` to retrieve the raw quote and then
    extracts the ``lastPrice`` field.  It gracefully handles missing
    fields and returns ``None`` if the price cannot be determined.
    """
    quote = await get_nse_quote(symbol)
    if quote and isinstance(quote, dict):
        price_info = quote.get("priceInfo")
        if price_info and isinstance(price_info, dict):
            last_price = price_info.get("lastPrice")
            if last_price is not None:
                try:
                    return float(last_price)
                except Exception:
                    pass
    return None


async def get_option_chain(symbol: str) -> List[Dict[str, Any]]:
    """Fetches the option chain for an index or stock from NSE.

    NSE exposes an option chain API under ``/api/option-chain-indices`` for
    indices and ``/api/option-chain-equities`` for stocks.  This helper
    attempts the indices endpoint first and falls back to equities.  The
    returned JSON contains deeply nested data; this function returns
    the list of option entries as provided by NSE.  If the request
    fails, an empty list is returned.
    """
    endpoints = [
        f"https://www.nseindia.com/api/option-chain-indices?symbol={symbol}",
        f"https://www.nseindia.com/api/option-chain-equities?symbol={symbol}",
    ]
    headers = {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Referer": "https://www.nseindia.com/",
    }
    for url in endpoints:
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                resp = await client.get(url, headers=headers)
                resp.raise_for_status()
                data = resp.json()
                records = data.get("records", {})
                contracts = records.get("data")
                if contracts and isinstance(contracts, list):
                    return contracts  # type: ignore[no-any-return]
        except Exception:
            continue
    return []


async def save_historical_candles(symbol: str, candles: List[Any]) -> None:
    """Persists historical candle data.

    This placeholder simply returns without performing any IO.  In a
    production environment you could write the candles into a SQL table,
    a time series database or an in‑memory cache.  The function is
    asynchronous to future‑proof the API and allow integration with
    async database drivers.

    Args:
        symbol: The symbol associated with the candles.
        candles: A list of candle objects to persist.
    """
    # TODO: integrate with a real persistence layer (e.g. SQLAlchemy, Redis)
    _ = symbol  # unused for now
    _ = candles  # unused for now
    return None


async def get_current_price(symbol: str) -> Optional[float]:
    """Returns the latest price for the given symbol.

    When ``use_fake_data`` is true this returns a synthetic value.  When
    API keys or NSE are available this function will query NSE first,
    then Finnhub and finally Alpha Vantage.  The first non‑null price
    returned will be used.

    Args:
        symbol: Ticker symbol (e.g. ``"NIFTY"``)

    Returns:
        The latest price as a float, or ``None`` if unavailable.
    """
    if use_fake_data():
        # Deterministic synthetic price based on symbol hash
        return float(abs(hash(symbol)) % 1000 + 100)
    # Try NSE for real‑time quotes
    try:
        price = await get_nse_current_price(symbol)
        if price is not None:
            return price
    except Exception:
        pass
    # Prefer Finnhub for real‑time quotes
    if FINNHUB_API_KEY:
        url = f"https://finnhub.io/api/v1/quote?symbol={symbol}&token={FINNHUB_API_KEY}"
        async with httpx.AsyncClient(timeout=10) as client:
            try:
                resp = await client.get(url)
                resp.raise_for_status()
                data = resp.json()
                price_val = data.get("c")
                if price_val is not None:
                    return float(price_val)
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
    # Try NSE quote for previous close if available
    try:
        quote = await get_nse_quote(symbol)
        if quote and isinstance(quote, dict):
            price_info = quote.get("priceInfo")
            if price_info and isinstance(price_info, dict):
                prev_close = price_info.get("previousClose")
                if prev_close is not None:
                    return float(prev_close)
    except Exception:
        pass
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
    Finnhub or NSE is configured the candles are fetched via the
    respective REST APIs.  The API returns timestamps in seconds since
    the epoch; these are converted to ``datetime.datetime`` for the
    schema.  After fetching, the candles are persisted via
    ``save_historical_candles``.

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
        # Persist synthetic candles so that downstream logic can still operate on them
        await save_historical_candles(symbol, candles)
        return candles
    # For intraday data NSE does not offer a public API; rely on Finnhub
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
                await save_historical_candles(symbol, candles)
                return candles
            except Exception:
                return []
    # If no provider is configured return an empty list
    return []