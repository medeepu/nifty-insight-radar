"""
Price endpoints with change calculations.

This router exposes a `/price` endpoint that returns the current price of
a given symbol along with its absolute and percentage change from the
previous close.  These additional fields make it easier for clients to
render deltas on price cards without computing them locally.
"""

from __future__ import annotations

import datetime
from fastapi import APIRouter, HTTPException, Query

from ..schemas import PriceData
from ..utils.data_fetcher import get_current_price, get_previous_close


router = APIRouter()


@router.get(
    "/price",
    response_model=PriceData,
    summary="Get latest price with change and percent change",
)
async def price(symbol: str = Query(..., description="Ticker symbol")) -> PriceData:
    """Returns the latest price for ``symbol`` and its daily change.

    The endpoint computes both the absolute change (current minus previous
    close) and the percentage change.  When the previous close is not
    available both values will be ``None``.
    """
    current_price = await get_current_price(symbol)
    if current_price is None:
        raise HTTPException(status_code=404, detail="Price not available")
    prev_close = await get_previous_close(symbol)
    change = None
    percent_change = None
    if prev_close is not None and prev_close != 0:
        change = current_price - prev_close
        percent_change = (change / prev_close) * 100.0
    return PriceData(
        symbol=symbol,
        price=current_price,
        timestamp=datetime.datetime.utcnow(),
        change=change,
        percent_change=percent_change,
    )