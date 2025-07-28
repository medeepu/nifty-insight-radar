"""
Historical candle data endpoint.

Clients request historical OHLCV data for chart rendering via this
endpoint.  It accepts a symbol, timeframe and optional start/end
timestamps and returns a list of candles.  The actual data is fetched
through ``utils.data_fetcher.get_historical_candles``, which should be
integrated with your real data provider.
"""

from __future__ import annotations

import datetime
from fastapi import APIRouter, HTTPException, Query

from ..schemas import CandleData
from ..utils.data_fetcher import get_historical_candles


router = APIRouter()


@router.get(
    "/candles",
    response_model=CandleData,
    summary="Fetch historical candles for charting",
)
async def candles(
    symbol: str = Query(..., description="Ticker symbol"),
    timeframe: str = Query("5m", description="Candle timeframe"),
    start: str = Query(None, description="Start timestamp (ISO8601)", alias="from"),
    end: str = Query(None, description="End timestamp (ISO8601)", alias="to"),
    limit: int = Query(100, description="Maximum number of candles"),
) -> CandleData:
    """Returns a list of candles for the given symbol and timeframe.

    If ``start`` and/or ``end`` are not provided, the function will
    generate a sensible default range based on the current time and
    ``limit``.  Note that the underlying ``get_historical_candles``
    implementation should respect ``start``, ``end`` and ``limit``.
    """
    # Default range: last ``limit`` intervals ending now
    now = datetime.datetime.utcnow()
    if end is None:
        end_ts = now.isoformat()
    else:
        end_ts = end
    if start is None:
        # Estimate start by subtracting ``limit`` intervals.  We assume
        # ``timeframe`` is in minutes when not ending with 'd' for daily.
        if timeframe.endswith("d"):
            # Daily timeframe: subtract ``limit`` days
            delta = datetime.timedelta(days=limit)
        else:
            # Extract numeric part (e.g. '5m' -> 5 minutes)
            try:
                unit = timeframe[-1]
                value = int(timeframe[:-1])
                if unit == "m":
                    delta = datetime.timedelta(minutes=value * limit)
                elif unit == "h":
                    delta = datetime.timedelta(hours=value * limit)
                else:
                    delta = datetime.timedelta(minutes=5 * limit)
            except Exception:
                delta = datetime.timedelta(minutes=5 * limit)
        start_ts = (now - delta).isoformat()
    else:
        start_ts = start
    candles_list = await get_historical_candles(
        symbol,
        start_ts,
        end_ts,
        timeframe=timeframe,
        limit=limit,
    )
    if not candles_list:
        raise HTTPException(status_code=404, detail="No candles found")
    return CandleData(symbol=symbol, timeframe=timeframe, candles=candles_list)