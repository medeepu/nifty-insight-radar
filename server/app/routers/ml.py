"""Machine learning insight endpoint (placeholder)."""

from __future__ import annotations

import datetime
from fastapi import APIRouter, HTTPException, Query
from ..utils.data_fetcher import get_candles
from ..utils.indicators import calculate_rsi, calculate_atr


router = APIRouter()


@router.get("/ml/insight", summary="Get ML market regime insight")
async def ml_insight(symbol: str = Query(...)) -> dict:
    """Returns a simple market regime classification for the given symbol.

    The current implementation uses the slope of the last 20 close prices and
    the 14‑period RSI to label the market as 'bullish', 'bearish' or 'range'.
    This is a placeholder for a more sophisticated ML model.
    """
    candles = await get_candles(symbol, timeframe="5m")
    if len(candles) < 20:
        raise HTTPException(status_code=404, detail="Insufficient data for ML insight")
    closes = [c.close for c in candles[-20:]]
    # Calculate linear regression slope as a proxy for trend
    n = len(closes)
    x = list(range(n))
    x_mean = sum(x) / n
    y_mean = sum(closes) / n
    numer = sum((xi - x_mean) * (yi - y_mean) for xi, yi in zip(x, closes))
    denom = sum((xi - x_mean) ** 2 for xi in x)
    slope = numer / denom if denom else 0.0
    rsi = calculate_rsi(candles, 14)
    # Simple classification rules
    if slope > 0 and rsi > 55:
        regime = "bullish"
    elif slope < 0 and rsi < 45:
        regime = "bearish"
    else:
        regime = "range"
    return {
        "symbol": symbol,
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "regime": regime,
        "slope": slope,
        "rsi": rsi,
    }