"""
Backtesting endpoint (stub).

This router provides a basic backtesting API expected by the client.  At
present it returns placeholder equity curves and trade lists.  In a
production system you would load historical candles, simulate trading
logic over that period, compute PnL and return the resulting equity
curve and trade breakdown.
"""

from __future__ import annotations

import datetime
from typing import List

from fastapi import APIRouter, Query

from ..schemas import BacktestResult, TradeResult


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
) -> BacktestResult:
    """
    Runs a hypothetical backtest for the specified symbol and timeframe.

    This implementation is a stub that generates synthetic equity
    curves and trade results purely for demonstration purposes.  Replace
    this with a real backtesting engine that loads historical candles,
    applies your trading strategy, and produces PnL metrics.
    """
    # Create a simple linearly increasing equity curve as a placeholder
    days = (end - start).days + 1
    equity_curve: List[dict] = []
    for i in range(days):
        date = start + datetime.timedelta(days=i)
        # Simulate a 0.1% daily gain
        equity = initial_capital * (1 + 0.001 * i)
        equity_curve.append({"time": date.isoformat(), "value": equity})
    # Generate a couple of fake trades
    trades: List[TradeResult] = [
        TradeResult(
            entry_time=start + datetime.timedelta(days=1),
            exit_time=start + datetime.timedelta(days=2),
            entry_price=100.0,
            exit_price=105.0,
            quantity=10,
            pnl=50.0,
        ),
        TradeResult(
            entry_time=start + datetime.timedelta(days=4),
            exit_time=start + datetime.timedelta(days=5),
            entry_price=110.0,
            exit_price=108.0,
            quantity=10,
            pnl=-20.0,
        ),
    ]
    return BacktestResult(equity_curve=equity_curve, trades=trades)