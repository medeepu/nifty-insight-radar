"""
Signal generation logic.

This module contains simple heuristics for generating BUY/SELL/NEUTRAL
signals based on technical indicators and Greeks.  In a production
environment these functions should be replaced with a more robust
strategy engine that considers multiple conditions, machine learning
models and portfolio context.
"""

from __future__ import annotations

import datetime
from typing import Dict, Any, Tuple

from sqlalchemy.orm import Session

from ..utils.indicators import compute_indicator_series
from ..utils.greeks import compute_option_metrics
from ..utils.data_fetcher import get_current_price
from ..schemas import IndicatorSeriesData


def generate_signal(
    symbol: str,
    timeframe: str,
    db: Session,
    iv_guess: float = 0.25,
) -> Tuple[str, float, Dict[str, Any]]:
    """Generates a trading signal for ``symbol`` on the given timeframe.

    The current implementation uses very simple rules:

      * If the latest RSI > 70 then the signal is ``SELL`` (overbought).
      * If the latest RSI < 30 then the signal is ``BUY`` (oversold).
      * Otherwise the signal is ``NEUTRAL``.

    The confidence score is proportional to how far the RSI is from the
    mid‑point of 50 (e.g. |RSI − 50| / 50).  Additional factors such as
    delta and trend can be incorporated easily.

    Args:
        symbol: Ticker symbol
        timeframe: Candle timeframe used for indicator computation
        db: SQLAlchemy session (not currently used)
        iv_guess: Initial guess for implied volatility when computing Greeks

    Returns:
        A tuple of (direction, confidence, context), where ``context``
        contains raw indicator values for further analysis.
    """
    # Compute indicator history; we only care about the latest RSI
    indicators = compute_indicator_series(symbol, timeframe)
    # Extract the most recent RSI value (period 14)
    try:
        rsi_series = indicators.rsi["14"]
        latest_rsi = rsi_series[-1]["value"] if rsi_series else None
    except Exception:
        latest_rsi = None
    # Fallback to neutral if RSI cannot be computed
    if latest_rsi is None:
        return "NEUTRAL", 0.0, {"reason": "RSI unavailable"}
    # Determine signal based on RSI thresholds
    direction: str
    confidence: float
    if latest_rsi > 70:
        direction = "SELL"
        confidence = min((latest_rsi - 50) / 50.0, 1.0)
    elif latest_rsi < 30:
        direction = "BUY"
        confidence = min((50 - latest_rsi) / 50.0, 1.0)
    else:
        direction = "NEUTRAL"
        confidence = abs(latest_rsi - 50) / 50.0
    context = {
        "latest_rsi": latest_rsi,
        "rsi_series": rsi_series,
    }
    return direction, confidence, context