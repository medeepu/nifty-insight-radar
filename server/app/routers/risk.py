"""
Risk management endpoint.

This router calculates risk metrics based on the most recent signal and
the user's risk settings.  It returns recommended position sizing,
maximum loss and potential profit for the next trade.  These
calculations can be extended to incorporate Greeks and portfolio
context.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Signal as SignalModel, UserSettings
from ..schemas import RiskMetrics


router = APIRouter()


@router.get(
    "/risk",
    response_model=RiskMetrics,
    summary="Compute risk metrics for the next trade",
)
def risk_metrics(
    symbol: str = Query(..., description="Ticker symbol"),
    timeframe: str = Query("5m", description="Timeframe used by the signal"),
    db: Session = Depends(get_db),
) -> RiskMetrics:
    """Calculates position size, max loss and potential profit.

    The function looks up the most recent signal for the given symbol
    and timeframe and combines it with the user's risk settings to
    recommend a position size.  The maximum loss is based on risk per
    trade and the difference between entry and stop prices; potential
    profit is based on the distance between entry and target prices.
    """
    # Find latest signal
    signal_entry = (
        db.query(SignalModel)
        .filter(SignalModel.symbol == symbol, SignalModel.scenario == timeframe)
        .order_by(SignalModel.timestamp.desc())
        .first()
    )
    if not signal_entry:
        raise HTTPException(status_code=404, detail="No signal available")
    # Get risk per trade from user settings
    settings = db.query(UserSettings).first()
    risk_per_trade = 1000.0
    if settings:
        risk_dict = settings.risk_settings or {}
        risk_per_trade = float(risk_dict.get("riskPerTrade", 1000.0))
    # Compute risk per contract
    risk_per_contract = abs(signal_entry.entry_price - signal_entry.stop_price)
    if risk_per_contract <= 0:
        position_size = 0
    else:
        position_size = int(risk_per_trade / risk_per_contract)
    max_loss = risk_per_contract * position_size
    potential_profit = abs(signal_entry.target_price - signal_entry.entry_price) * position_size
    return RiskMetrics(
        symbol=symbol,
        timeframe=timeframe,
        entry_price=signal_entry.entry_price,
        stop_price=signal_entry.stop_price,
        target_price=signal_entry.target_price,
        position_size=position_size,
        risk_per_trade=risk_per_trade,
        max_loss=max_loss,
        potential_profit=potential_profit,
    )