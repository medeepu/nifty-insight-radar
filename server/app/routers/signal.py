"""
Signal generation endpoint.

This router exposes an endpoint to compute a current trading signal for
a given symbol and timeframe.  It uses simple heuristics based on RSI
as implemented in ``utils.signals.generate_signal`` and returns the
signal along with a confidence score.  The result can also be stored
in the database and broadcast over the ``signal`` WebSocket channel.
"""

from __future__ import annotations

import datetime
import json
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Signal as SignalModel
from ..schemas import SignalData
from ..utils.signals import generate_signal
from ..utils.data_fetcher import get_current_price
from ..websocket_manager import manager


router = APIRouter()


@router.get(
    "/signal/current",
    response_model=SignalData,
    summary="Generate a simple BUY/SELL/NEUTRAL signal",
)
async def current_signal(
    symbol: str = Query(..., description="Ticker symbol"),
    timeframe: str = Query("5m", description="Candle timeframe (e.g. 5m, 15m, 1h)"),
    db: Session = Depends(get_db),
) -> SignalData:
    """Computes a signal based on RSI and returns it.

    The implementation here is intentionally basic: it fetches the
    latest RSI and derives a direction and confidence.  It also
    populates ``entry_price`` with the current price and uses a
    symmetrical stop/target of ±1% for demonstration.  The result is
    stored in the ``Signal`` table and broadcast on the WebSocket
    channel.
    """
    # Compute the signal (await the async generate_signal)
    direction, confidence, context = await generate_signal(symbol, timeframe, db)
    # Fetch current price
    current_price = await get_current_price(symbol)
    if current_price is None:
        raise HTTPException(status_code=404, detail="Price not available")
    # Simple stop/target: 1% away from current price
    stop_price = current_price * (0.99 if direction == "BUY" else 1.01)
    target_price = current_price * (1.01 if direction == "BUY" else 0.99)
    risk_reward = 1.0 if stop_price == 0 else abs(target_price - current_price) / abs(current_price - stop_price)
    position_size = context.get("position_size", 1)
    timestamp = datetime.datetime.utcnow()
    # Persist the signal
    signal_row = SignalModel(
        timestamp=timestamp,
        symbol=symbol,
        scenario=timeframe,
        direction=direction,
        entry_price=current_price,
        stop_price=stop_price,
        target_price=target_price,
        risk_reward=risk_reward,
        position_size=position_size,
        confidence=confidence,
        reason=context.get("reason") if isinstance(context, dict) else None,
    )
    db.add(signal_row)
    db.commit()
    # Build the API response.  The ``signal`` field maps to the internal
    # ``direction``.  Do not expose the raw ``direction`` property to the
    # client.
    response = SignalData(
        timestamp=timestamp,
        symbol=symbol,
        scenario=timeframe,
        signal=direction,
        entry_price=current_price,
        stop_price=stop_price,
        target_price=target_price,
        risk_reward=risk_reward,
        position_size=position_size,
        confidence=confidence,
        reason=context.get("reason") if isinstance(context, dict) else None,
        # Populate legacy alias field for backwards compatibility
        direction=direction,
    )
    # Broadcast over WebSocket
    try:
        # Send the response dictionary over the ``signal`` WebSocket
        await manager.broadcast("signal", json.dumps(response.dict()))
    except Exception:
        # Suppress any WebSocket errors from bubbling up
        pass
    return response