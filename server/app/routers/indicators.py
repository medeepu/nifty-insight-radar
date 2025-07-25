"""Endpoint for technical indicator snapshots."""

from __future__ import annotations

import datetime
from fastapi import APIRouter, HTTPException, Query, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas import IndicatorData
from ..utils.data_fetcher import get_candles
from ..utils.indicators import compute_indicators
from ..models import IndicatorSnapshot


router = APIRouter()


@router.get("/indicators", response_model=IndicatorData, summary="Get latest technical indicators")
async def indicators(symbol: str = Query(...), db: Session = Depends(get_db)) -> IndicatorData:
    """Returns the most recent indicator values for a symbol."""
    candles = await get_candles(symbol, timeframe="5m")
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