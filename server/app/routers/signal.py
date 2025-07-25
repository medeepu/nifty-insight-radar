"""Endpoint for trade signal generation."""

from __future__ import annotations

import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas import SignalData
from ..utils.scenario_logic import generate_signal
from ..models import Signal


router = APIRouter()


@router.get("/signal/current", response_model=SignalData, summary="Get the latest trade signal")
async def current_signal(symbol: str = Query(...), db: Session = Depends(get_db)) -> SignalData:
    """Calculates and returns the most recent trading signal for a symbol."""
    signal_data = await generate_signal(symbol, db)
    if signal_data.scenario == "None":
        return signal_data
    # Persist signal
    db_signal = Signal(
        timestamp=signal_data.timestamp,
        symbol=signal_data.symbol,
        scenario=signal_data.scenario,
        direction=signal_data.direction,
        entry_price=signal_data.entry_price,
        stop_price=signal_data.stop_price,
        target_price=signal_data.target_price,
        risk_reward=signal_data.risk_reward,
        position_size=signal_data.position_size,
        confidence=signal_data.confidence,
        reason=signal_data.reason,
    )
    db.add(db_signal)
    db.commit()
    return signal_data