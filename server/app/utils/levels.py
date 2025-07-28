"""
Pivot point and support/resistance level calculations.

The client charts rely on daily or intraday pivot levels to draw
horizontal support/resistance lines.  This module provides helper
functions to compute central pivot range (CPR) and classic pivot
supports/resistances from OHLCV candles.
"""

from __future__ import annotations

from typing import Tuple

from ..schemas import Candle


def compute_pivot_levels(candle: Candle) -> Tuple[float, float, float, float, float, float, float, float, float]:
    """Computes pivot and support/resistance levels from a single candle.

    The formulas are based on classic floor trader pivots:

      * Pivot (P) = (High + Low + Close) / 3
      * Base Central Pivot (BC) = (High + Low) / 2
      * Top Central Pivot (TC) = (BC + P) / 2
      * Support 1 (S1) = 2 * P − High
      * Resistance 1 (R1) = 2 * P − Low
      * Support 2 (S2) = P − (High − Low)
      * Resistance 2 (R2) = P + (High − Low)
      * Support 3 (S3) = Low − 2 * (High − P)
      * Resistance 3 (R3) = High + 2 * (P − Low)

    Args:
        candle: A candle representing the high/low/close of the previous session.

    Returns:
        A tuple containing (P, BC, TC, S1, S2, S3, R1, R2, R3).
    """
    high = float(candle.high)
    low = float(candle.low)
    close = float(candle.close)
    pivot = (high + low + close) / 3.0
    bc = (high + low) / 2.0
    tc = (bc + pivot) / 2.0
    s1 = 2 * pivot - high
    r1 = 2 * pivot - low
    s2 = pivot - (high - low)
    r2 = pivot + (high - low)
    s3 = low - 2 * (high - pivot)
    r3 = high + 2 * (pivot - low)
    return pivot, bc, tc, s1, s2, s3, r1, r2, r3


def compute_daily_levels(previous_candle: Candle) -> dict:
    """Convenience wrapper to compute daily CPR and pivot levels.

    Returns a dict keyed by level name to match ``DailyLevels`` schema.
    """
    pivot, bc, tc, s1, s2, s3, r1, r2, r3 = compute_pivot_levels(previous_candle)
    return {
        "pivot": pivot,
        "bc": bc,
        "tc": tc,
        "s1": s1,
        "s2": s2,
        "s3": s3,
        "r1": r1,
        "r2": r2,
        "r3": r3,
    }