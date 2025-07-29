"""
Backtesting endpoint.

This router exposes an API to run simple backtests over a historical
period.  The implementation here loads historical candle data,
evaluates the trading strategy on each candle, executes synthetic
trades and produces an equity curve along with a list of trade
results.  It is intentionally straightforward and should be replaced
with a more robust engine for production use.
"""

from __future__ import annotations

import datetime
from typing import List

from fastapi import APIRouter, Query, Depends
from sqlalchemy.orm import Session

from ..schemas import BacktestResult, TradeResult
from ..utils.data_fetcher import get_historical_candles
from ..utils.signals import generate_signal
from ..database import get_db


router = APIRouter()


@router.post(
    "/backtest",
    response_model=BacktestResult,
    summary="Run a backtest over a historical period",
)
async def run_backtest(
    symbol: str = Query(..., description="Underlying symbol to backtest"),
    timeframe: str = Query("5m", description="Candle timeframe"),
    start: datetime.date = Query(..., description="Start date (YYYY‑MM‑DD)"),
    end: datetime.date = Query(..., description="End date (YYYY‑MM‑DD)"),
    initial_capital: float = Query(100000.0, description="Starting capital for the backtest"),
    db: Session = Depends(get_db),
) -> BacktestResult:
    """
    Runs a hypothetical backtest for the specified symbol and timeframe.

    Historical candles are fetched asynchronously via ``get_historical_candles``.
    For each candle the strategy's signal is computed using
    ``generate_signal``.  Long positions are opened on BUY signals and
    closed on SELL signals.  The backtest tracks equity over time and
    returns a list of executed trades.  Any open position is closed at
    the final candle.

    Args:
        symbol: Underlying symbol to backtest
        timeframe: Candle timeframe (e.g. '5m', '1d')
        start: Start date (inclusive)
        end: End date (inclusive)
        initial_capital: Starting capital for the backtest
        db: Database session for indicator computations

    Returns:
        A :class:`BacktestResult` containing the equity curve and trade list.
    """
    # Convert dates to ISO strings for the fetcher
    start_iso = start.isoformat()
    # Add one day to end date for exclusive end in ISO format
    end_iso = (end + datetime.timedelta(days=1)).isoformat()
    candles = await get_historical_candles(symbol, start_iso, end_iso, timeframe=timeframe, limit=1000)
    equity = initial_capital
    equity_curve: List[dict] = []
    trades: List[TradeResult] = []
    position: dict | None = None
    for candle in candles:
        price = candle.close
        # Generate signal based on historical context
        direction, confidence, context = generate_signal(symbol, timeframe, db)
        # If we receive a BUY signal and have no position, open one
        if direction == "BUY" and position is None:
            qty = context.get("position_size", 1)
            position = {
                "entry_time": candle.time,
                "entry_price": price,
                "quantity": qty,
            }
        # If we receive a SELL signal and currently hold a position, close it
        elif direction == "SELL" and position is not None:
            pnl = (price - position["entry_price"]) * position["quantity"]
            trades.append(
                TradeResult(
                    entry_time=position["entry_time"],
                    exit_time=candle.time,
                    entry_price=position["entry_price"],
                    exit_price=price,
                    quantity=position["quantity"],
                    pnl=pnl,
                )
            )
            equity += pnl
            position = None
        # Record the current equity value at this candle
        equity_curve.append({"time": candle.time.isoformat(), "value": equity})
    # Close any open position at the final candle
    if position is not None and candles:
        final_price = candles[-1].close
        pnl = (final_price - position["entry_price"]) * position["quantity"]
        trades.append(
            TradeResult(
                entry_time=position["entry_time"],
                exit_time=candles[-1].time,
                entry_price=position["entry_price"],
                exit_price=final_price,
                quantity=position["quantity"],
                pnl=pnl,
            )
        )
        equity += pnl
        equity_curve.append({"time": candles[-1].time.isoformat(), "value": equity})
    return BacktestResult(equity_curve=equity_curve, trades=trades)