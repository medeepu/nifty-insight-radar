"""Simplified trading signal generation logic.

This module distils the complex set of entry and exit rules from the original
PineScript into three core scenarios: trend breakouts, pullback continuations
and range reversals.  It relies on the CPR levels and various indicators to
minimise false positives.  Each generated signal includes a confidence
score based on volume, EMA alignment and momentum (RSI).
"""

from __future__ import annotations

import datetime
from typing import Optional

from sqlalchemy.orm import Session

from ..schemas import SignalData
from ..models import LevelsDaily, IndicatorSnapshot, User, UserSettings
from ..core.config import get_settings
from .data_fetcher import get_candles, get_current_price
from .cpr import compute_cpr_levels
from .indicators import compute_indicators, calculate_volume_ma


async def generate_signal(symbol: str, db: Session) -> SignalData:
    """Generates a trading signal for the given symbol.

    Args:
        symbol: The instrument symbol (e.g. "NIFTY").
        db: Database session used to retrieve levels and user settings.

    Returns:
        A SignalData instance representing the most recent trading signal.
    """
    # Fetch recent candles (for the last day, 5‑minute timeframe)
    candles = await get_candles(symbol, timeframe="5m")
    if not candles:
        # If we have no data return a neutral signal
        now = datetime.datetime.utcnow()
        return SignalData(
            timestamp=now,
            symbol=symbol,
            scenario="None",
            direction="neutral",
            entry_price=0.0,
            stop_price=0.0,
            target_price=0.0,
            risk_reward=0.0,
            position_size=0,
            confidence=0.0,
            reason="No data available",
        )
    # Compute indicators on the recent candles
    indicators = compute_indicators(candles)
    ema9 = indicators["ema9"]
    ema21 = indicators["ema21"]
    ema50 = indicators["ema50"]
    ema200 = indicators["ema200"]
    vwap = indicators["vwap"]
    atr = indicators["atr"]
    rsi = indicators["rsi"]
    stoch_k = indicators["stoch_k"]
    stoch_d = indicators["stoch_d"]
    vol_ma = indicators["volume_ma"]

    # Get the latest close and volume
    latest_candle = candles[-1]
    close_price = latest_candle.close
    current_volume = latest_candle.volume

    # Fetch daily levels from DB or compute them if missing
    today = datetime.date.today()
    level_entry: Optional[LevelsDaily] = (
        db.query(LevelsDaily)
        .filter(LevelsDaily.symbol == symbol, LevelsDaily.date == today)
        .first()
    )
    if not level_entry:
        # compute from previous day's high/low/close
        # We take the day before today's date using historical candles
        # Extract previous day high/low/close from 5m candles
        prev_day = today - datetime.timedelta(days=1)
        prev_candles = [c for c in candles if c.time.date() == prev_day]
        if prev_candles:
            prev_high = max(c.high for c in prev_candles)
            prev_low = min(c.low for c in prev_candles)
            prev_close = prev_candles[-1].close
        else:
            prev_high = latest_candle.high
            prev_low = latest_candle.low
            prev_close = latest_candle.close
        levels = compute_cpr_levels(prev_high, prev_low, prev_close)
        level_entry = LevelsDaily(
            date=today,
            symbol=symbol,
            pivot=levels["pivot"],
            bc=levels["bc"],
            tc=levels["tc"],
            s1=levels["s1"],
            s2=levels["s2"],
            s3=levels["s3"],
            r1=levels["r1"],
            r2=levels["r2"],
            r3=levels["r3"],
            cpr_type=levels["cpr_type"],
        )
        db.add(level_entry)
        db.commit()
    pivot = float(level_entry.pivot)
    bc = float(level_entry.bc)
    tc = float(level_entry.tc)
    s1 = float(level_entry.s1)
    r1 = float(level_entry.r1)
    pdh = float(level_entry.r1)  # reuse R1 as previous day high for now
    pdl = float(level_entry.s1)  # reuse S1 as previous day low for now

    # Determine risk and user preferences
    settings_obj: Optional[UserSettings] = db.query(UserSettings).first()
    # Provide sensible defaults if no settings exist
    if settings_obj:
        risk_per_trade = float(settings_obj.risk_per_trade or 1000.0)
        risk_reward = float(settings_obj.advanced_filters.get("minRiskRewardRatio", 2.0))
    else:
        risk_per_trade = 1000.0
        risk_reward = 2.0

    # Identify scenario
    scenario = "None"
    direction = "neutral"
    entry_price = 0.0
    stop_price = 0.0
    target_price = 0.0
    confidence = 0.0
    reason = ""

    # Compute tolerance based on ATR
    tolerance = 0.2 * atr

    # Momentum filter
    momentum_long = rsi > 60.0
    momentum_short = rsi < 40.0

    # Helper to compute confidence
    def compute_conf(volume_ratio: float, ema_align: bool, momentum: float) -> float:
        vol_score = min(volume_ratio / 2.0, 1.0)  # scale 0..2 -> 0..1
        ema_score = 1.0 if ema_align else 0.0
        mom_score = max(min(momentum, 1.0), 0.0)
        return round(0.4 * vol_score + 0.3 * ema_score + 0.3 * mom_score, 2)

    # Scenario 1: Trend/Breakout
    # Long breakout
    if close_price > tc and current_volume > 1.2 * vol_ma and ema9 > ema21 and momentum_long:
        # Retest condition: price has revisited TC within tolerance in last 3 candles
        retested = False
        for c in candles[-5:]:
            if abs(c.low - tc) <= tolerance:
                retested = True
                break
        if retested:
            scenario = "TrendBreakout"
            direction = "long"
            entry_price = close_price
            stop_price = bc  # Stop at central pivot bottom
            risk = entry_price - stop_price
            target_price = entry_price + risk_reward * risk
            confidence = compute_conf(current_volume / vol_ma, True, (rsi - 50) / 50)
            reason = "Price closed above TC with high volume; EMAs aligned bullish; retest confirmed"
    # Short breakout
    elif close_price < bc and current_volume > 1.2 * vol_ma and ema9 < ema21 and momentum_short:
        retested = False
        for c in candles[-5:]:
            if abs(c.high - bc) <= tolerance:
                retested = True
                break
        if retested:
            scenario = "TrendBreakout"
            direction = "short"
            entry_price = close_price
            stop_price = tc  # Stop at top central
            risk = stop_price - entry_price
            target_price = entry_price - risk_reward * risk
            confidence = compute_conf(current_volume / vol_ma, True, (50 - rsi) / 50)
            reason = "Price closed below BC with high volume; EMAs aligned bearish; retest confirmed"

    # Scenario 2: Pullback/Continuation
    # Long continuation
    if scenario == "None" and ema9 > ema21 and momentum_long:
        # Price pulled back to pivot or PDH (approx using R1) within tolerance
        if abs(close_price - pivot) <= tolerance or abs(close_price - r1) <= tolerance:
            # Check bullish candle and rising volume
            prev_candle = candles[-2] if len(candles) >= 2 else latest_candle
            if latest_candle.close > latest_candle.open and current_volume > prev_candle.volume:
                scenario = "PullbackContinuation"
                direction = "long"
                entry_price = close_price
                stop_price = bc
                risk = entry_price - stop_price
                target_price = entry_price + risk_reward * risk
                confidence = compute_conf(current_volume / vol_ma, True, (rsi - 50) / 50)
                reason = "Uptrend with pullback to pivot/PDH; bullish candle with rising volume"
    # Short continuation
    if scenario == "None" and ema9 < ema21 and momentum_short:
        if abs(close_price - pivot) <= tolerance or abs(close_price - s1) <= tolerance:
            prev_candle = candles[-2] if len(candles) >= 2 else latest_candle
            if latest_candle.close < latest_candle.open and current_volume > prev_candle.volume:
                scenario = "PullbackContinuation"
                direction = "short"
                entry_price = close_price
                stop_price = tc
                risk = stop_price - entry_price
                target_price = entry_price - risk_reward * risk
                confidence = compute_conf(current_volume / vol_ma, True, (50 - rsi) / 50)
                reason = "Downtrend with pullback to pivot/PDL; bearish candle with rising volume"

    # Scenario 3: Reversal/Range bound
    if scenario == "None" and atr > 0:
        # Check exhaustion at S1/R1 or PDL/PDH (approx using S1/R1)
        wick_long = (latest_candle.high - latest_candle.close) / max(latest_candle.high - latest_candle.low, 1e-6)
        wick_short = (latest_candle.close - latest_candle.low) / max(latest_candle.high - latest_candle.low, 1e-6)
        high_at_res = abs(close_price - r1) <= tolerance or abs(close_price - pdh) <= tolerance
        low_at_sup = abs(close_price - s1) <= tolerance or abs(close_price - pdl) <= tolerance
        volume_decline = current_volume < vol_ma
        high_atr = atr > 0.8 * (sum([abs(c.high - c.low) for c in candles[-14:]]) / 14.0)
        if low_at_sup and wick_short > 0.6 and volume_decline and high_atr and momentum_long:
            scenario = "Reversal"
            direction = "long"
            entry_price = close_price
            stop_price = latest_candle.low
            risk = entry_price - stop_price
            target_price = entry_price + 1.5 * risk
            confidence = compute_conf(current_volume / vol_ma, True, (rsi - 50) / 50)
            reason = "Exhaustion at support; long wick; declining volume; high ATR"
        elif high_at_res and wick_long > 0.6 and volume_decline and high_atr and momentum_short:
            scenario = "Reversal"
            direction = "short"
            entry_price = close_price
            stop_price = latest_candle.high
            risk = stop_price - entry_price
            target_price = entry_price - 1.5 * risk
            confidence = compute_conf(current_volume / vol_ma, True, (50 - rsi) / 50)
            reason = "Exhaustion at resistance; long wick; declining volume; high ATR"

    # If still None, return neutral
    if scenario == "None":
        now = datetime.datetime.utcnow()
        return SignalData(
            timestamp=now,
            symbol=symbol,
            scenario="None",
            direction="neutral",
            entry_price=close_price,
            stop_price=close_price,
            target_price=close_price,
            risk_reward=0.0,
            position_size=0,
            confidence=0.0,
            reason="No valid trading scenario detected",
        )

    # Determine position size
    risk = abs(entry_price - stop_price)
    position_size = 0
    if risk > 0:
        position_size = int(risk_per_trade / risk)
    return SignalData(
        timestamp=datetime.datetime.utcnow(),
        symbol=symbol,
        scenario=scenario,
        direction=direction,
        entry_price=round(entry_price, 2),
        stop_price=round(stop_price, 2),
        target_price=round(target_price, 2),
        risk_reward=round(risk_reward, 2),
        position_size=position_size,
        confidence=confidence,
        reason=reason,
    )
