"""
Technical levels endpoints (daily and intraday).

The price analysis card and other dashboard components need central
pivot, support and resistance levels to display market context.  This
router computes such levels from historical candles using the functions
in ``utils.levels``.  Daily levels use the previous day's OHLC, while
intraday levels can use the last completed session's high/low/close on
the selected timeframe.
"""

from __future__ import annotations

import datetime
from fastapi import APIRouter, HTTPException, Query

from ..schemas import DailyLevels, Candle
from ..utils.levels import compute_daily_levels
from ..utils.data_fetcher import get_historical_candles


router = APIRouter()


@router.get(
    "/levels/daily",
    response_model=DailyLevels,
    summary="Compute daily pivot and support/resistance levels",
)
async def daily_levels(
    symbol: str = Query(..., description="Ticker symbol"),
) -> DailyLevels:
    """Calculates daily pivot levels based on the previous day's candle.

    The endpoint fetches the last daily candle for the given symbol via
    ``get_historical_candles`` (which should be implemented to query
    a real market data source).  It then computes the pivot and central
    pivot range using ``compute_daily_levels``.
    """
    # Determine the previous trading day.  For simplicity we subtract
    # one calendar day; in production use exchange calendars.
    end = datetime.datetime.utcnow().date()
    start = end - datetime.timedelta(days=2)
    candles = await get_historical_candles(
        symbol,
        start.isoformat(),
        end.isoformat(),
        timeframe="1d",
        limit=2,
    )
    if not candles:
        raise HTTPException(status_code=404, detail="No candle data available")
    previous_candle = candles[-2] if len(candles) >= 2 else candles[-1]
    levels = compute_daily_levels(previous_candle)
    return DailyLevels(
        symbol=symbol,
        date=previous_candle.time.date(),
        **levels,
        cpr_type="classic",
    )


# Intraday levels follow the same pattern but use a shorter timeframe (e.g. 5m).
@router.get(
    "/levels/intraday",
    response_model=DailyLevels,
    summary="Compute intraday pivot and support/resistance levels",
)
async def intraday_levels(
    symbol: str = Query(..., description="Ticker symbol"),
    timeframe: str = Query("15m", description="Intraday timeframe (e.g. 5m, 15m)"),
) -> DailyLevels:
    """Calculates intraday pivot levels based on the last completed candle.

    This endpoint behaves similarly to the daily version but uses the
    specified intraday timeframe.  The number of candles fetched is
    configurable; here we retrieve the two most recent candles and
    compute levels from the penultimate one to avoid using a partial
    candle.
    """
    end = datetime.datetime.utcnow()
    start = end - datetime.timedelta(hours=3)  # fetch recent hours
    candles = await get_historical_candles(
        symbol,
        start.isoformat(),
        end.isoformat(),
        timeframe=timeframe,
        limit=2,
    )
    if not candles:
        raise HTTPException(status_code=404, detail="No intraday candles available")
    previous_candle = candles[-2] if len(candles) >= 2 else candles[-1]
    levels = compute_daily_levels(previous_candle)
    return DailyLevels(
        symbol=symbol,
        date=previous_candle.time.date(),
        **levels,
        cpr_type="intraday",
    )