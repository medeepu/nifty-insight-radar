"""Endpoints for pivot levels (daily, weekly, monthly)."""

from __future__ import annotations

import datetime
from fastapi import APIRouter, HTTPException, Query, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas import DailyLevels
from ..models import LevelsDaily
from ..utils.cpr import compute_cpr_levels
from ..utils.data_fetcher import get_candles


router = APIRouter()


async def compute_levels_for_period(symbol: str, period: str) -> dict:
    """Computes pivot and CPR levels for a given period (daily, weekly, monthly)."""
    now = datetime.datetime.utcnow()
    if period == "daily":
        start_dt = now - datetime.timedelta(days=2)
    elif period == "weekly":
        start_dt = now - datetime.timedelta(days=14)
    else:  # monthly
        start_dt = now - datetime.timedelta(days=60)
    candles = await get_candles(symbol, timeframe="1d", start=start_dt.isoformat(), end=now.isoformat())
    if len(candles) < 2:
        raise HTTPException(status_code=404, detail=f"Not enough data for {period} levels")
    # Determine the previous period's candles
    if period == "daily":
        prev_candle = candles[-2]
    elif period == "weekly":
        # Group by week number
        last_week = candles[-2].time.isocalendar()[1]
        prev_week_candles = [c for c in candles if c.time.isocalendar()[1] == last_week]
        prev_candle = prev_week_candles[-1] if prev_week_candles else candles[-2]
    else:
        # monthly
        last_month = candles[-2].time.month
        prev_month_candles = [c for c in candles if c.time.month == last_month]
        prev_candle = prev_month_candles[-1] if prev_month_candles else candles[-2]
    prev_high = max(c.high for c in candles[:-1])
    prev_low = min(c.low for c in candles[:-1])
    prev_close = prev_candle.close
    levels = compute_cpr_levels(prev_high, prev_low, prev_close)
    return levels


@router.get("/levels/daily", response_model=DailyLevels, summary="Get daily CPR levels")
async def daily_levels(symbol: str = Query(...), db: Session = Depends(get_db)) -> DailyLevels:
    today = datetime.date.today()
    entry = db.query(LevelsDaily).filter(LevelsDaily.symbol == symbol, LevelsDaily.date == today).first()
    if entry:
        return DailyLevels(
            symbol=symbol,
            date=today,
            pivot=float(entry.pivot),
            bc=float(entry.bc),
            tc=float(entry.tc),
            s1=float(entry.s1),
            s2=float(entry.s2),
            s3=float(entry.s3),
            r1=float(entry.r1),
            r2=float(entry.r2),
            r3=float(entry.r3),
            cpr_type=entry.cpr_type,
        )
    # Compute levels and persist
    levels = await compute_levels_for_period(symbol, "daily")
    entry = LevelsDaily(
        date=today,
        symbol=symbol,
        pivot=levels["pivot"],
        bc=levels["bc"],
        tc=levels["tc"],
        s1=levels["s1"],
        s2=levels["s2"],
        s3=levels["s3"],
        r1=levels["r1"],
        r2=levels["r2"],
        r3=levels["r3"],
        cpr_type=levels["cpr_type"],
    )
    db.add(entry)
    db.commit()
    return DailyLevels(
        symbol=symbol,
        date=today,
        pivot=levels["pivot"],
        bc=levels["bc"],
        tc=levels["tc"],
        s1=levels["s1"],
        s2=levels["s2"],
        s3=levels["s3"],
        r1=levels["r1"],
        r2=levels["r2"],
        r3=levels["r3"],
        cpr_type=levels["cpr_type"],
    )


@router.get("/levels/weekly", response_model=DailyLevels, summary="Get weekly CPR levels")
async def weekly_levels(symbol: str = Query(...)) -> DailyLevels:
    levels = await compute_levels_for_period(symbol, "weekly")
    today = datetime.date.today()
    return DailyLevels(
        symbol=symbol,
        date=today,
        pivot=levels["pivot"],
        bc=levels["bc"],
        tc=levels["tc"],
        s1=levels["s1"],
        s2=levels["s2"],
        s3=levels["s3"],
        r1=levels["r1"],
        r2=levels["r2"],
        r3=levels["r3"],
        cpr_type=levels["cpr_type"],
    )


@router.get("/levels/monthly", response_model=DailyLevels, summary="Get monthly CPR levels")
async def monthly_levels(symbol: str = Query(...)) -> DailyLevels:
    levels = await compute_levels_for_period(symbol, "monthly")
    today = datetime.date.today()
    return DailyLevels(
        symbol=symbol,
        date=today,
        pivot=levels["pivot"],
        bc=levels["bc"],
        tc=levels["tc"],
        s1=levels["s1"],
        s2=levels["s2"],
        s3=levels["s3"],
        r1=levels["r1"],
        r2=levels["r2"],
        r3=levels["r3"],
        cpr_type=levels["cpr_type"],
    )