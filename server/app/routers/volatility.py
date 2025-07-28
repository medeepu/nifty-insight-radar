"""
Volatility analytics endpoints.

These endpoints compute implied volatility skew across strikes and
term structure across expiries using data from the ``OptionChain``
table.  They power the skew and term structure charts in the dashboard.
"""

from __future__ import annotations

import datetime
from typing import Dict

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import OptionChain
from ..schemas import SkewData, SkewPoint, TermStructureData, TermStructurePoint


router = APIRouter()


@router.get(
    "/volatility/skew",
    response_model=SkewData,
    summary="Compute implied volatility skew across strikes",
)
def volatility_skew(
    symbol: str = Query(..., description="Underlying symbol"),
    expiry: datetime.date = Query(..., description="Option expiry date in YYYY-MM-DD format"),
    db: Session = Depends(get_db),
) -> SkewData:
    """Returns call/put IV per strike for a given expiry.

    The function looks up the ``OptionChain`` table for the specified symbol
    and expiry and groups entries by strike.  For each strike it records
    the IV of the call and put options separately.  Results are sorted
    by strike.
    """
    rows = (
        db.query(OptionChain)
        .filter(OptionChain.symbol == symbol, OptionChain.expiry == expiry)
        .all()
    )
    if not rows:
        raise HTTPException(status_code=404, detail="Option chain not available")
    # Group by strike and option type
    grouped: Dict[float, Dict[str, float]] = {}
    for row in rows:
        strike = float(row.strike)
        grouped.setdefault(strike, {})[row.option_type] = float(row.iv) if row.iv is not None else None
    points: list[SkewPoint] = []
    for strike in sorted(grouped.keys()):
        data = grouped[strike]
        points.append(SkewPoint(strike=strike, call_iv=data.get("C"), put_iv=data.get("P")))
    return SkewData(symbol=symbol, expiry=expiry, points=points)


@router.get(
    "/volatility/term-structure",
    response_model=TermStructureData,
    summary="Compute implied volatility term structure",
)
def volatility_term_structure(
    symbol: str = Query(..., description="Underlying symbol"),
    db: Session = Depends(get_db),
) -> TermStructureData:
    """Returns average IV per expiry for the given symbol.

    The function retrieves all option chain entries for ``symbol`` and
    computes the average IV across strikes for each expiry.  Results are
    sorted by expiry.
    """
    rows = db.query(OptionChain).filter(OptionChain.symbol == symbol).all()
    if not rows:
        raise HTTPException(status_code=404, detail="Option chain not available")
    grouped: Dict[datetime.date, list[float]] = {}
    for row in rows:
        if row.iv is None:
            continue
        grouped.setdefault(row.expiry, []).append(float(row.iv))
    points: list[TermStructurePoint] = []
    for expiry, ivs in grouped.items():
        if not ivs:
            continue
        avg_iv = sum(ivs) / len(ivs)
        points.append(TermStructurePoint(expiry=expiry, iv=avg_iv))
    # Sort by expiry date
    points.sort(key=lambda p: p.expiry)
    return TermStructureData(symbol=symbol, term_structure=points)