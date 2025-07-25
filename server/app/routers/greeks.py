"""Endpoint for option Greeks and pricing."""

from __future__ import annotations

import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas import GreeksData
from ..models import Signal, UserSettings
from ..utils.greeks import compute_option_metrics, parse_option_symbol
from ..utils.data_fetcher import get_current_price
from ..core.config import get_settings


router = APIRouter()


@router.get("/greeks", response_model=GreeksData, summary="Compute option Greeks and pricing")
async def greeks(optionSymbol: str = Query(...), db: Session = Depends(get_db)) -> GreeksData:
    """Returns option price and Greeks for the specified option symbol."""
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
    if signal_entry:
        entry = float(signal_entry.entry_price)
        stop = float(signal_entry.stop_price)
        target = float(signal_entry.target_price)
        risk_reward = float(signal_entry.risk_reward)
        position_size = signal_entry.position_size
    else:
        # Default stop and target: ±2% moves
        entry = underlying_price
        stop = underlying_price * 0.98
        target = underlying_price * 1.02
        risk_reward = 2.0
        # Determine position size from settings or fallback
        settings_obj = db.query(UserSettings).first()
        risk_per_trade = float(settings_obj.risk_per_trade) if settings_obj else 1000.0
        risk = abs(entry - stop)
        position_size = int(risk_per_trade / risk) if risk > 0 else 0
    # Rate and dividend yield
    settings = get_settings()
    r = 6.01  # risk‑free default if not available
    q = 0.0
    iv_guess = 0.25
    # risk_per_trade and risk_reward may come from latest signal; set
    option_metrics = compute_option_metrics(
        optionSymbol,
        underlying_price,
        r,
        q,
        iv_guess,
        risk_reward,
        position_size,
        stop,
        target,
        risk_per_trade=1000.0,
    )
    return GreeksData(
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
    )