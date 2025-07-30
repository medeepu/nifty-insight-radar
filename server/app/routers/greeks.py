"""
Endpoint for option Greeks and pricing (extended).

This router wraps the enhanced option metrics computation and exposes
additional fields such as moneyness percentage and option status.  It
also utilises the user's settings to derive the risk free rate and other
parameters where available.  Additional query parameters allow callers
to override the risk free rate, dividend yield, implied volatility guess
and days to expiry used in the calculation.
"""

from __future__ import annotations

import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas import GreeksData
from ..models import Signal, UserSettings
from ..utils.greeks import compute_option_metrics, compute_iv_rank, parse_option_symbol
from ..utils.data_fetcher import get_current_price
from ..core.config import get_settings


router = APIRouter()


@router.get(
    "/greeks",
    response_model=GreeksData,
    summary="Compute option Greeks and pricing",
)
async def greeks(
    optionSymbol: str = Query(..., description="Full option ticker (e.g. NIFTY250417C24000)"),
    riskFreeRate: float | None = Query(
        None,
        description="Override the risk free rate (percentage) used in the pricing model",
    ),
    dividendYield: float | None = Query(
        None,
        description="Override the dividend yield (percentage) used in the pricing model",
    ),
    ivGuess: float | None = Query(
        None,
        description="Initial implied volatility guess (decimal) when no market price is available",
    ),
    daysToExpiry: int | None = Query(
        None,
        description="Override the number of days to expiry used in the pricing model",
    ),
    db: Session = Depends(get_db),
) -> GreeksData:
    """Returns option price and Greeks for the specified option symbol.

    The endpoint computes theoretical option pricing and Greeks using the
    Black–Scholes model.  Callers may specify overrides for the risk free
    rate, dividend yield, initial IV guess and days to expiry.  If no
    overrides are provided, the server falls back to user settings or
    sensible defaults.
    """
    try:
        underlying_symbol, expiry, strike, option_type = parse_option_symbol(optionSymbol)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid option symbol format")
    # Fetch current underlying price
    underlying_price = await get_current_price(underlying_symbol)
    if underlying_price is None:
        raise HTTPException(status_code=404, detail="Underlying price not available")
    # Find the latest signal for the underlying to derive stop/target levels
    signal_entry = (
        db.query(Signal)
        .filter(Signal.symbol == underlying_symbol)
        .order_by(Signal.timestamp.desc())
        .first()
    )
    # Default values
    entry = underlying_price
    stop = underlying_price * 0.98
    target = underlying_price * 1.02
    risk_reward = 2.0
    position_size = 1
    risk_per_trade = 1000.0
    if signal_entry:
        entry = float(signal_entry.entry_price)
        stop = float(signal_entry.stop_price)
        target = float(signal_entry.target_price)
        risk_reward = float(signal_entry.risk_reward)
        position_size = signal_entry.position_size
    else:
        # Derive position size from user settings if available
        settings_obj = db.query(UserSettings).first()
        if settings_obj:
            try:
                risk_dict = settings_obj.risk_settings or {}
                risk_per_trade = float(risk_dict.get("riskPerTrade", 1000.0))
            except Exception:
                risk_per_trade = float(settings_obj.risk_per_trade or 1000.0)
        risk = abs(entry - stop)
        position_size = int(risk_per_trade / risk) if risk > 0 else 0
    # Rate and dividend yield: use overrides or fall back to settings/default
    settings = get_settings()
    r = riskFreeRate if riskFreeRate is not None else getattr(settings, "risk_free_rate", 6.01)
    q = dividendYield if dividendYield is not None else 0.0
    iv_guess_final = ivGuess if ivGuess is not None else 0.25
    # Compute option metrics including moneyness and recommended stops
    option_metrics = compute_option_metrics(
        optionSymbol,
        underlying_price,
        r,
        q,
        iv_guess_final,
        risk_reward,
        position_size,
        stop,
        target,
        risk_per_trade=risk_per_trade,
        days_to_expiry_override=daysToExpiry,
    )
    # Compute IV rank from historical implied volatilities
    try:
        iv_rank = compute_iv_rank(underlying_symbol, option_metrics.implied_volatility, db)
    except Exception:
        iv_rank = None
    # Fetch the real last traded price of this option if present in the option chain table
    try:
        from ..models import OptionChain
        market_record = (
            db.query(OptionChain)
            .filter(
                OptionChain.symbol == underlying_symbol,
                OptionChain.expiry == expiry,
                OptionChain.strike == strike,
                OptionChain.option_type == option_type,
            )
            .first()
        )
        market_option_price = float(market_record.ltp) if market_record else None
    except Exception:
        market_option_price = None
    # Derive additional option metrics expected by the client.  The
    # theoretical price corresponds to the calculated option price.  Break‑even
    # is strike ± premium paid.  For calls the maximum profit is
    # theoretically unlimited (``None`` indicates unlimited).  For puts the
    # maximum profit is limited to strike minus premium.  Maximum loss is
    # always the premium paid.
    theoretical_price = option_metrics.option_price
    if option_metrics.option_type == "C":
        break_even = option_metrics.strike + option_metrics.option_price
        max_profit = None  # Unlimited upside for a call
        max_loss = option_metrics.option_price
    else:
        break_even = option_metrics.strike - option_metrics.option_price
        max_profit = option_metrics.strike - option_metrics.option_price
        max_loss = option_metrics.option_price
    response = GreeksData(
        option_symbol=option_metrics.option_symbol,
        expiry=option_metrics.expiry,
        strike=option_metrics.strike,
        option_type=option_metrics.option_type,
        underlying_price=option_metrics.underlying_price,
        implied_volatility=option_metrics.implied_volatility,
        option_price=option_metrics.option_price,
        delta=option_metrics.delta,
        gamma=option_metrics.gamma,
        theta=option_metrics.theta,
        vega=option_metrics.vega,
        rho=option_metrics.rho,
        intrinsic_value=option_metrics.intrinsic_value,
        time_value=option_metrics.time_value,
        entry_price=option_metrics.entry_price,
        stop_price=option_metrics.stop_price,
        target_price=option_metrics.target_price,
        risk_reward=option_metrics.risk_reward,
        position_size=option_metrics.position_size,
        moneyness_percent=option_metrics.moneyness_percent,
        status=option_metrics.status,
        iv_rank=iv_rank,
        market_option_price=market_option_price,
        theoreticalPrice=theoretical_price,
        breakEven=break_even,
        maxProfit=max_profit,
        maxLoss=max_loss,
        # Populate backwards‑compatible aliases
        iv=option_metrics.implied_volatility,
        intrinsicValue=option_metrics.intrinsic_value,
        timeValue=option_metrics.time_value,
        moneynessPercent=option_metrics.moneyness_percent,
    )
    # Broadcast the Greek result over the WebSocket channel for real‑time updates
    try:
        import json as _json  # Local import to avoid global import at module level
        from ..websocket_manager import manager as _ws_manager
        await _ws_manager.broadcast("greeks", _json.dumps(response.dict()))
    except Exception:
        # Silently ignore any broadcast errors
        pass
    return response