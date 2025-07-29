"""
Machine learning insights endpoint.

This router provides a simple implementation of machine learning based
insights.  Instead of deferring to external models, it computes
market regime classification, signal confidence and volatility
forecasts directly from historical data.  The goal is to give
meaningful feedback to the client without requiring a separate ML
infrastructure.

For production use you can replace the computations here with calls to
pre‑trained models or microservices that perform regime detection and
forecasting.  The return format remains compatible with the
``MLInsight`` schema.
"""

from __future__ import annotations

import statistics
from typing import List

from fastapi import APIRouter, Query, Depends
from sqlalchemy.orm import Session

import datetime
import math
from ..schemas import MLInsight
from ..utils.data_fetcher import get_historical_candles
from ..utils.indicators import compute_indicator_series
from ..database import get_db


router = APIRouter()


@router.get(
    "/ml/insights",
    response_model=MLInsight,
    summary="Return ML insights for a symbol",
)
async def ml_insights(
    symbol: str = Query(..., description="Underlying symbol"),
    timeframe: str = Query("5m", description="Timeframe for the analysis"),
    lookback_days: int = Query(30, description="Number of days to look back for ML analysis"),
    db: Session = Depends(get_db),
) -> MLInsight:
    """
    Returns machine learning insights for the requested symbol.

    The implementation computes:

      * **Market regime classification** based on the relationship between
        short and long simple moving averages: ``bullish`` if SMA50 >
        SMA200, ``bearish`` if SMA50 < SMA200, otherwise ``sideways``.
      * **Volatility forecast** as the standard deviation of daily log
        returns over the lookback window.
      * **Signal confidence score** as the inverse of volatility (lower
        volatility implies higher confidence).

    Args:
        symbol: The underlying symbol.
        timeframe: Candle timeframe for indicator computation.
        lookback_days: Number of days of history to use.
        db: Database session (unused in this implementation).

    Returns:
        An :class:`MLInsight` object containing the computed insights.
    """
    # Load historical daily candles for volatility calculation
    end_date = datetime.date.today()
    start_date = end_date - datetime.timedelta(days=lookback_days)
    candles = await get_historical_candles(symbol, start_date.isoformat(), (end_date + datetime.timedelta(days=1)).isoformat(), timeframe="1d", limit=lookback_days + 1)
    closes: List[float] = [candle.close for candle in candles if hasattr(candle, "close")]
    # Compute daily log returns
    log_returns: List[float] = []
    for i in range(1, len(closes)):
        prev, curr = closes[i - 1], closes[i]
        if prev > 0:
            log_returns.append(math.log(curr / prev))
    volatility = statistics.stdev(log_returns) if len(log_returns) > 1 else 0.0
    # Compute indicators for market regime classification
    indicators = compute_indicator_series(symbol, "1d")
    try:
        sma50 = indicators.sma["50"]  # type: ignore[attr-defined]
        sma200 = indicators.sma["200"]  # type: ignore[attr-defined]
        latest_50 = sma50[-1]["value"] if sma50 else None
        latest_200 = sma200[-1]["value"] if sma200 else None
        if latest_50 is not None and latest_200 is not None:
            if latest_50 > latest_200:
                regime = "bullish"
            elif latest_50 < latest_200:
                regime = "bearish"
            else:
                regime = "sideways"
        else:
            regime = "unknown"
    except Exception:
        regime = "unknown"
    # Confidence inversely proportional to volatility, scaled to [0,1]
    confidence = max(min(1.0 - volatility * 10.0, 1.0), 0.0)
    notes = [
        f"Regime classified as {regime} based on SMA50/SMA200.",
        f"Volatility forecast (σ) = {volatility:.4f}.",
        f"Signal confidence derived from volatility = {confidence:.2f}.",
    ]
    return MLInsight(symbol=symbol, timeframe=timeframe, notes=notes, confidence=confidence)