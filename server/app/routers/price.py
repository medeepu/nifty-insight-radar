"""Price endpoints for real‑time and historical data."""

from __future__ import annotations

import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas import PriceData
from ..utils.data_fetcher import get_current_price

router = APIRouter()


@router.get("/price/current", response_model=PriceData, summary="Get current price")
async def current_price(symbol: str = Query(...)) -> PriceData:
    """Returns the most recent price for the given symbol."""
    price = await get_current_price(symbol)
    if price is None:
        raise HTTPException(status_code=404, detail="Price not available")
    return PriceData(symbol=symbol, price=price, timestamp=datetime.datetime.utcnow())