"""
Signal generation logic.

This module contains the heuristics for generating BUY/SELL/NEUTRAL
signals based on a combination of technical indicators, option Greeks
and rudimentary risk adjustments.  The simple RSI‑based strategy from
the original implementation has been extended to consider multiple
indicators (e.g. MACD, moving averages), option Greeks (delta and
gamma) and a basic risk adjusted position size.  Confidence scores
reflect how strongly the current market state agrees with the computed
direction.

In a production environment this logic should be replaced with a more
sophisticated strategy engine that considers additional conditions,
machine learning models and portfolio context.
"""

from __future__ import annotations

import datetime
from typing import Dict, Any, Tuple

from sqlalchemy.orm import Session

from ..utils.indicators import compute_indicator_series
from ..utils.greeks import compute_option_metrics
from ..utils.data_fetcher import get_current_price
from ..schemas import IndicatorSeriesData


def _compute_composite_score(indicators: IndicatorSeriesData) -> Tuple[float, Dict[str, Any]]:
    """
    Computes a composite score based on multiple technical indicators.

    A positive score suggests bullish conditions while a negative score
    suggests bearish conditions.  The magnitude represents the strength
    of the signal.  Missing indicators contribute zero to the score.

    Args:
        indicators: An object returned by ``compute_indicator_series``.

    Returns:
        A tuple of (score, details) where ``details`` records the
        individual indicator values for transparency.
    """
    score = 0.0
    details: Dict[str, Any] = {}
    # RSI contribution: scale between -1 and 1
    try:
        rsi_series = indicators.rsi.get("14")  # type: ignore[attr-defined]
        latest_rsi = rsi_series[-1]["value"] if rsi_series else None
        details["rsi"] = latest_rsi
        if latest_rsi is not None:
            # Normalise RSI to a range of [-1,1] relative to the midpoint 50
            score += (latest_rsi - 50.0) / 50.0
    except Exception:
        details["rsi"] = None
    # MACD contribution: positive histogram is bullish, negative bearish
    try:
        macd_hist = indicators.macd["hist"]  # type: ignore[attr-defined]
        latest_hist = macd_hist[-1]["value"] if macd_hist else None
        details["macd_hist"] = latest_hist
        if latest_hist is not None:
            # Scale histogram into a small range to avoid overpowering RSI
            score += max(min(latest_hist / 5.0, 1.0), -1.0)
    except Exception:
        details["macd_hist"] = None
    # Simple moving average crossover: if SMA50 > SMA200 -> bullish
    try:
        sma50 = indicators.sma["50"]  # type: ignore[attr-defined]
        sma200 = indicators.sma["200"]  # type: ignore[attr-defined]
        latest_50 = sma50[-1]["value"] if sma50 else None
        latest_200 = sma200[-1]["value"] if sma200 else None
        details["sma50"] = latest_50
        details["sma200"] = latest_200
        if latest_50 is not None and latest_200 is not None:
            score += 0.5 if latest_50 > latest_200 else -0.5
    except Exception:
        details["sma50"] = None
        details["sma200"] = None
    return score, details


def generate_signal(
    symbol: str,
    timeframe: str,
    db: Session,
    iv_guess: float = 0.25,
) -> Tuple[str, float, Dict[str, Any]]:
    """
    Generates a trading signal for ``symbol`` on the given timeframe.

    The signal is derived from a composite score that considers RSI,
    MACD histogram and moving average crossovers.  Option Greeks are
    computed for the at‑the‑money contract to adjust the confidence
    score; if delta suggests high sensitivity to price movements then
    confidence is increased.  A simplistic risk adjusted position size
    is computed based on the magnitude of the composite score.

    Args:
        symbol: Ticker symbol
        timeframe: Candle timeframe used for indicator computation
        db: SQLAlchemy session (currently unused in this implementation)
        iv_guess: Initial guess for implied volatility when computing Greeks

    Returns:
        A tuple of (direction, confidence, context), where ``context``
        contains raw indicator values and computed metrics for further analysis.
    """
    # Compute indicator history
    indicators = compute_indicator_series(symbol, timeframe)
    # Derive a composite score from various indicators
    score, indicator_details = _compute_composite_score(indicators)
    # Default to neutral if the score is zero (lack of signal)
    direction: str
    base_confidence: float
    if score > 0.1:
        direction = "BUY"
        base_confidence = min(score, 1.0)
    elif score < -0.1:
        direction = "SELL"
        base_confidence = min(abs(score), 1.0)
    else:
        direction = "NEUTRAL"
        base_confidence = abs(score)
    # Compute Greeks for at‑the‑money option (use current price as strike)
    try:
        current_price = get_current_price(symbol)
        # Await the coroutine if necessary
        current_price_val = current_price if not hasattr(current_price, "__await__") else None
        if current_price_val is None:
            # Running in async context would require ``await``, but in synchronous context we ignore Greeks
            greeks = {}
        else:
            greeks = compute_option_metrics(
                price=current_price_val,
                strike=current_price_val,
                days_to_expiry=7,  # assume weekly option
                iv=iv_guess,
                rate=0.05,
            )
    except Exception:
        greeks = {}
    # Adjust confidence based on delta magnitude
    delta = greeks.get("delta") if isinstance(greeks, dict) else None
    if delta is not None:
        base_confidence *= min(max(abs(delta), 0.5), 1.5)
    # Cap the confidence between 0 and 1
    confidence = max(min(base_confidence, 1.0), 0.0)
    # Determine a naive position size as a percentage of portfolio
    # Position sizing could incorporate volatility and account value in production
    position_size = round(confidence * 10)  # up to 10 units
    context: Dict[str, Any] = {
        "composite_score": score,
        "indicators": indicator_details,
        "greeks": greeks,
        "position_size": position_size,
    }
    return direction, confidence, context