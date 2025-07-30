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
from ..utils.greeks import (
    compute_option_metrics,
    compute_iv_rank,
    parse_option_symbol,
    implied_volatility,
)
from ..utils.option_selector import select_option_symbol
from ..utils.data_fetcher import get_current_price
from ..core.config import get_settings


router = APIRouter()


@router.get(
    "/greeks",
    response_model=GreeksData,
    summary="Compute option Greeks and pricing",
)
async def greeks(
    optionSymbol: str | None = Query(
        None,
        description="Full option ticker (e.g. NIFTY250417C24000).  If omitted, the server will construct one based on strikeSelectionMode and tradeDirection.",
    ),
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
    strikeSelectionMode: str | None = Query(
        None,
        description="Select strike mode: closest_atm, itm_100, otm_100, manual, ticker",
    ),
    tradeDirection: str | None = Query(
        None,
        description="Trade direction: buy, sell, call or put.  Used with strikeSelectionMode.",
    ),
    manualStrike: float | None = Query(
        None,
        description="Explicit strike price when strikeSelectionMode is manual.",
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
    # 1. Determine the underlying symbol from the option symbol or query parameters.
    #    When ``optionSymbol`` is not provided, we will construct one based on the
    #    strike selection mode and trade direction.  Otherwise we parse the provided
    #    ticker to derive the underlying and expiry.
    underlying_symbol: str | None = None
    expiry = None
    strike = None
    option_type = None

    # Fetch user settings to obtain default Greeks parameters and strike selection
    settings_obj = db.query(UserSettings).first()
    user_greeks_settings = settings_obj.greeks_settings if settings_obj else None

    # Use defaults from user settings if no query overrides
    default_rfr = None
    default_dividend = None
    default_iv_guess = None
    default_days = None
    default_strike_mode = None
    default_trade_direction = None
    default_manual_strike = None
    if user_greeks_settings:
        default_rfr = user_greeks_settings.get("riskFreeRate")
        default_dividend = user_greeks_settings.get("dividendYield")
        default_iv_guess = user_greeks_settings.get("ivGuess")
        default_days = user_greeks_settings.get("daysToExpiry")
        default_strike_mode = user_greeks_settings.get("strikeSelectionMode")
        default_trade_direction = user_greeks_settings.get("tradeDirection")
        default_manual_strike = user_greeks_settings.get("manualStrike")

    # Determine underlying and option details
    if optionSymbol:
        # Parse the provided ticker
        try:
            underlying_symbol, expiry, strike, option_type = parse_option_symbol(optionSymbol)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid option symbol format")
    else:
        # Construct an option symbol based on the strike selection mode and trade direction
        # Determine underlying_symbol from query or default to user setting
        # Here we default to the general default symbol stored in UserSettings
        underlying_symbol = settings_obj.default_symbol if settings_obj else "NIFTY"
        # Determine effective strike mode and direction
        mode = strikeSelectionMode or default_strike_mode or "closest_atm"
        direction = tradeDirection or default_trade_direction or "buy"
        days_override = daysToExpiry if daysToExpiry is not None else default_days
        eff_manual = manualStrike if manualStrike is not None else default_manual_strike
        # Fetch current price for underlying to build the ticker
        current_price = await get_current_price(underlying_symbol)
        if current_price is None:
            raise HTTPException(status_code=404, detail="Underlying price not available")
        optionSymbol = select_option_symbol(
            underlying_symbol,
            current_price,
            strike_mode=mode,
            trade_direction=direction,
            days_to_expiry=days_override,
            manual_strike=eff_manual,
        )
        try:
            underlying_symbol, expiry, strike, option_type = parse_option_symbol(optionSymbol)
        except Exception:
            raise HTTPException(status_code=400, detail="Constructed option symbol invalid")

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
    # Default values for stop/target and position sizing
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
        # risk_per_trade has been loaded earlier if user settings exist
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
    # Determine the effective parameters: query overrides > user greeks settings > global config
    r = (
        riskFreeRate
        if riskFreeRate is not None
        else (default_rfr if default_rfr is not None else getattr(settings, "risk_free_rate", 6.01))
    )
    q = (
        dividendYield
        if dividendYield is not None
        else (default_dividend if default_dividend is not None else 0.0)
    )
    # ivGuess may be refined below using implied volatility; set initial guess from user or default
    iv_guess_final = (
        ivGuess if ivGuess is not None else (default_iv_guess if default_iv_guess is not None else 0.25)
    )
    # Determine days to expiry: query > user setting > computed difference
    effective_days = daysToExpiry if daysToExpiry is not None else default_days
    # Compute option metrics including moneyness and recommended stops
    # Attempt to calibrate implied volatility using market option price if available
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
    # If we have a market price and non‑zero T, compute implied volatility using Newton–Raphson
    T_for_iv = None
    if expiry is not None:
        today = datetime.date.today()
        T_for_iv = max((expiry - today).days, 0) / 365.0
        if effective_days is not None:
            # Override if user provided days to expiry
            T_for_iv = max(effective_days, 0) / 365.0
    if market_option_price is not None and T_for_iv and T_for_iv > 0:
        try:
            iv_calibrated = implied_volatility(
                market_option_price,
                underlying_price,
                strike,
                T_for_iv,
                r / 100.0,
                q / 100.0,
                option_type,
                initial_guess=iv_guess_final,
            )
            iv_guess_final = iv_calibrated
        except Exception:
            # If calibration fails, fall back to guess
            pass
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
        days_to_expiry_override=effective_days,
    )
    # Compute IV rank from historical implied volatilities
    try:
        iv_rank = compute_iv_rank(underlying_symbol, option_metrics.implied_volatility, db)
    except Exception:
        iv_rank = None
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