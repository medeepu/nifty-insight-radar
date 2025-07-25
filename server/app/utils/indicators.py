"""Technical indicator calculations.

This module implements lightweight versions of several commonly used
indicators without relying on external libraries.  All functions expect a
list of candle objects (with open, high, low, close, volume attributes).
"""

from __future__ import annotations

from typing import Iterable, List, Sequence, Tuple

from ..schemas import Candle


def _ema(values: Sequence[float], period: int) -> List[float]:
    """Calculates the Exponential Moving Average (EMA) over a series."""
    ema_values: List[float] = []
    k = 2.0 / (period + 1)
    for i, v in enumerate(values):
        if i == 0:
            ema_values.append(v)
        else:
            ema_values.append((v * k) + (ema_values[-1] * (1 - k)))
    return ema_values


def calculate_vwap(candles: Sequence[Candle]) -> float:
    """Calculates the Volume Weighted Average Price (VWAP) for a sequence of candles."""
    cumulative_pv = 0.0
    cumulative_volume = 0.0
    for c in candles:
        typical = (c.high + c.low + c.close) / 3.0
        cumulative_pv += typical * c.volume
        cumulative_volume += c.volume
    return cumulative_pv / cumulative_volume if cumulative_volume != 0 else 0.0


def calculate_atr(candles: Sequence[Candle], period: int = 14) -> float:
    """Calculates the Average True Range (ATR) for the last `period` candles."""
    if len(candles) < period + 1:
        return 0.0
    trs: List[float] = []
    for i in range(1, len(candles)):
        high = candles[i].high
        low = candles[i].low
        prev_close = candles[i - 1].close
        tr = max(high - low, abs(high - prev_close), abs(low - prev_close))
        trs.append(tr)
    # Use simple moving average of TRs
    recent_trs = trs[-period:]
    return sum(recent_trs) / len(recent_trs)


def calculate_rsi(candles: Sequence[Candle], period: int = 14) -> float:
    """Calculates the Relative Strength Index (RSI) for the last `period` closes."""
    if len(candles) < period + 1:
        return 50.0
    gains = []
    losses = []
    for i in range(1, len(candles)):
        change = candles[i].close - candles[i - 1].close
        gains.append(max(change, 0))
        losses.append(max(-change, 0))
    avg_gain = sum(gains[-period:]) / period
    avg_loss = sum(losses[-period:]) / period
    if avg_loss == 0:
        return 100.0
    rs = avg_gain / avg_loss
    return 100 - (100 / (1 + rs))


def calculate_stochastic(candles: Sequence[Candle], period: int = 14) -> Tuple[float, float]:
    """Calculates the Stochastic Oscillator (%K and %D) for the last `period` candles."""
    if len(candles) < period:
        return 50.0, 50.0
    highs = [c.high for c in candles[-period:]]
    lows = [c.low for c in candles[-period:]]
    closes = [c.close for c in candles[-period:]]
    highest_high = max(highs)
    lowest_low = min(lows)
    current_close = closes[-1]
    if highest_high == lowest_low:
        k = 50.0
    else:
        k = ((current_close - lowest_low) / (highest_high - lowest_low)) * 100
    # %D is 3‑period SMA of %K; here we approximate using the last three %K values
    ks = []
    for i in range(3):
        subset = candles[-(period - i):]
        if not subset:
            continue
        highs_sub = [c.high for c in subset]
        lows_sub = [c.low for c in subset]
        closes_sub = [c.close for c in subset]
        hh = max(highs_sub)
        ll = min(lows_sub)
        cc = closes_sub[-1]
        if hh == ll:
            ks.append(50.0)
        else:
            ks.append(((cc - ll) / (hh - ll)) * 100)
    d = sum(ks) / len(ks) if ks else k
    return k, d


def calculate_volume_ma(candles: Sequence[Candle], period: int = 20) -> float:
    """Calculates a simple moving average of volume."""
    vols = [c.volume for c in candles[-period:]]
    return sum(vols) / len(vols) if vols else 0.0


def calculate_emas(candles: Sequence[Candle], periods: List[int]) -> List[float]:
    """Calculates EMAs for multiple periods and returns the last values."""
    closes = [c.close for c in candles]
    ema_results = []
    for p in periods:
        ema_series = _ema(closes, p)
        ema_results.append(ema_series[-1])
    return ema_results


def compute_indicators(candles: Sequence[Candle]) -> dict:
    """Computes all supported indicators on the provided candles."""
    ema9, ema21, ema50, ema200 = calculate_emas(candles, [9, 21, 50, 200])
    vwap = calculate_vwap(candles)
    atr = calculate_atr(candles, 14)
    rsi = calculate_rsi(candles, 14)
    stoch_k, stoch_d = calculate_stochastic(candles, 14)
    vol_ma = calculate_volume_ma(candles, 20)
    return {
        "ema9": ema9,
        "ema21": ema21,
        "ema50": ema50,
        "ema200": ema200,
        "vwap": vwap,
        "atr": atr,
        "rsi": rsi,
        "stoch_k": stoch_k,
        "stoch_d": stoch_d,
        "volume_ma": vol_ma,
    }