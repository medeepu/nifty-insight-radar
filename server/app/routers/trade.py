"""Endpoints for trade execution and logging."""

from __future__ import annotations

import datetime
import random
import string
from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Trade, User, Signal
from ..schemas import TradeOrder, TradeOrderResponse
from ..core.security import decode_token
from ..crud import get_user_by_username, record_log


router = APIRouter()


def get_current_user(token: str = Header(..., alias="Authorization"), db: Session = Depends(get_db)) -> User:
    if not token or not token.lower().startswith("bearer"):
        raise HTTPException(status_code=401, detail="Missing authentication token")
    _, _, jwt_token = token.partition(" ")
    payload = decode_token(jwt_token)
    username = payload.get("sub") if payload else None
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = get_user_by_username(db, username)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


@router.post("/trade/execute", response_model=TradeOrderResponse, summary="Execute a trade order")
def execute_trade(
    order: TradeOrder,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TradeOrderResponse:
    """Simulates placing a trade order and logs it in the database."""
    # In a real implementation this would interact with a broker API.  Here
    # we randomly generate an order ID and mark the trade as filled.
    order_id = "ORD" + "".join(random.choices(string.ascii_uppercase + string.digits, k=8))
    # Simulate fill at requested price or current price (not available here)
    fill_price = order.price or 0.0
    quantity = order.quantity
    # For demonstration we assume immediate fill and no P&L
    trade = Trade(
        user_id=current_user.id,
        signal_id=None,
        broker_order_id=order_id,
        entry_time=datetime.datetime.utcnow(),
        entry_price=fill_price,
        exit_time=None,
        exit_price=None,
        quantity=quantity,
        pnl=0.0,
        status="filled",
    )
    db.add(trade)
    db.commit()
    # Record log
    record_log(db, level="info", message=f"Executed trade {order.side} {order.quantity} {order.symbol}")
    return TradeOrderResponse(ok=True, order_id=order_id, filled_quantity=quantity, avg_price=fill_price, pnl=0.0)