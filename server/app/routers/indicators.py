"""
Endpoint for technical indicator data.

This router exposes both single snapshot and historical series of
indicators.  Clients may request the recent indicator series by
specifying `history=true` on the query.  The underlying calculation is
performed in `utils.indicators.compute_indicator_series`.
"""

from __future__ import annotations

import datetime
from fastapi import APIRouter, HTTPException, Query, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas import IndicatorData, IndicatorSeriesData
from ..utils.data_fetcher import get_candles
from ..utils.indicators import compute_indicators, compute_indicator_series
from ..models import IndicatorSnapshot


router = APIRouter()


@router.get(
    "/indicators",
    response_model=IndicatorData,
    summary="Get latest technical indicators",
    deprecated=True,
)
async def indicators(
    symbol: str = Query(...),
    timeframe: str = Query("5m"),
    db: Session = Depends(get_db),
) -> IndicatorData:
    """
    Returns the most recent indicator values for a symbol.

    This endpoint is deprecated; use `/indicators/history` for a full series.
    """
    candles = await get_candles(symbol, timeframe=timeframe)
    if not candles:
        raise HTTPException(status_code=404, detail="No candle data available")
    values = compute_indicators(candles)
    # Persist snapshot
    snapshot = IndicatorSnapshot(
        timestamp=datetime.datetime.utcnow(),
        symbol=symbol,
        ema9=values["ema9"],
        ema21=values["ema21"],
        ema50=values["ema50"],
        ema200=values["ema200"],
        vwap=values["vwap"],
        atr=values["atr"],
        rsi=values["rsi"],
        stoch_k=values["stoch_k"],
        stoch_d=values["stoch_d"],
        volume_ma=values["volume_ma"],
    )
    db.add(snapshot)
    db.commit()
    return IndicatorData(
        timestamp=snapshot.timestamp,
        symbol=symbol,
        ema9=values["ema9"],
        ema21=values["ema21"],
        ema50=values["ema50"],
        ema200=values["ema200"],
        vwap=values["vwap"],
        atr=values["atr"],
        rsi=values["rsi"],
        stoch_k=values["stoch_k"],
        stoch_d=values["stoch_d"],
        volume_ma=values["volume_ma"],
    )


@router.get(
    "/indicators/history",
    response_model=IndicatorSeriesData,
    summary="Get historical technical indicator series",
)
async def indicators_history(
    symbol: str = Query(...),
    timeframe: str = Query("5m"),
    limit: int = Query(300),
) -> IndicatorSeriesData:
    """
    Returns arrays of indicator values for the specified symbol and timeframe.

    The `limit` parameter controls how many candles are fetched; the default
    of 300 provides roughly one trading day of 5‑minute candles.
    """
    candles = await get_candles(symbol, timeframe=timeframe)
    if not candles:
        raise HTTPException(status_code=404, detail="No candle data available")
    # Trim to the most recent `limit` candles
    candles = candles[-limit:]
    series = compute_indicator_series(candles)
    return IndicatorSeriesData(
        symbol=symbol,
        ema=series["ema"],
        vwap=series["vwap"],
        atr=series["atr"],
        rsi=series["rsi"],
        stoch_k=series["stoch_k"],
        stoch_d=series["stoch_d"],
        volume_ma=series["volume_ma"],
    )