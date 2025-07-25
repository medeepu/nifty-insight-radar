"""Endpoints for historical candle data."""

from __future__ import annotations

import datetime
from fastapi import APIRouter, HTTPException, Query
from ..schemas import Candle, CandleData
from ..utils.data_fetcher import get_candles


router = APIRouter()


@router.get("/candles", response_model=CandleData, summary="Get historical candles")
async def candles(
    symbol: str = Query(...),
    tf: str = Query(..., alias="tf"),
    start: str | None = Query(None),
    end: str | None = Query(None),
) -> CandleData:
    """Returns OHLCV candles for a symbol and timeframe.

    Timeframe strings such as "1m", "5m", "15m", "1h", or "1d" are supported.
    Optionally specify ISO 8601 start and end timestamps to bound the data.
    """
    data = await get_candles(symbol, tf, start, end)
    if not data:
        raise HTTPException(status_code=404, detail="No candle data available")
    return CandleData(symbol=symbol, timeframe=tf, candles=data)