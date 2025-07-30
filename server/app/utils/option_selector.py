"""
Utility functions for selecting option tickers based on user preferences.

The ``select_option_symbol`` function allows the server to map the
underlying symbol, current market price, strike selection mode and trade
direction into a concrete option ticker.  This is a simplified
implementation designed for NIFTY and BANKNIFTY options.  In a
production system you would query the live option chain, handle
different expiries (weekly/monthly) and honour user‑selected expiry
dates.
"""

from __future__ import annotations

import datetime

from typing import Literal


def _next_thursday(today: datetime.date) -> datetime.date:
    """Returns the date of the next Thursday from ``today`` (inclusive)."""
    days_ahead = (3 - today.weekday()) % 7  # Thursday is weekday 3
    if days_ahead == 0:
        return today  # today is Thursday
    return today + datetime.timedelta(days=days_ahead)


def select_option_symbol(
    underlying_symbol: str,
    underlying_price: float,
    strike_mode: Literal[
        "closest_atm",
        "itm_100",
        "otm_100",
        "manual",
        "ticker",
    ] = "closest_atm",
    trade_direction: Literal["buy", "sell", "call", "put"] = "buy",
    days_to_expiry: int | None = None,
    manual_strike: float | None = None,
) -> str:
    """Selects an option ticker based on the specified mode and direction.

    Args:
        underlying_symbol: base symbol (e.g. 'NIFTY', 'BANKNIFTY').
        underlying_price: current price of the underlying.
        strike_mode: one of 'closest_atm', 'itm_100', 'otm_100', 'manual' or 'ticker'.
        trade_direction: either 'buy' or 'sell' (interpreted as a call or put).
        days_to_expiry: override the number of calendar days to expiry; if None
            the next weekly expiry (Thursday) is chosen.
        manual_strike: explicit strike price when ``strike_mode`` is 'manual'.

    Returns:
        A formatted option ticker string (e.g. 'NIFTY250814C19700').

    Note:
        This helper assumes that call options correspond to long trades
        ('buy') and put options correspond to short trades ('sell').  If
        the user explicitly specifies 'call' or 'put' as the trade
        direction then that option type is used regardless of long/short
        orientation.
    """
    underlying_symbol = underlying_symbol.upper()
    # Determine expiry date
    today = datetime.date.today()
    if days_to_expiry is not None and days_to_expiry >= 0:
        expiry_date = today + datetime.timedelta(days=days_to_expiry)
    else:
        expiry_date = _next_thursday(today)
    # Build expiry code YYMMDD
    expiry_code = expiry_date.strftime("%y%m%d")
    # Determine strike price
    base_strike = round(underlying_price / 100.0) * 100
    strike = base_strike
    if strike_mode == "itm_100":
        # In‑the‑money: calls move down, puts move up by 100 points
        if trade_direction in ("buy", "call"):
            strike = base_strike - 100
        else:
            strike = base_strike + 100
    elif strike_mode == "otm_100":
        # Out‑of‑the‑money: calls move up, puts move down by 100 points
        if trade_direction in ("buy", "call"):
            strike = base_strike + 100
        else:
            strike = base_strike - 100
    elif strike_mode == "manual" and manual_strike is not None:
        strike = round(manual_strike / 1.0)  # ensure numeric
    # Determine option type (C/P)
    if trade_direction in ("buy", "call"):
        option_type = "C"
    elif trade_direction in ("sell", "put"):
        option_type = "P"
    else:
        option_type = "C"
    ticker = f"{underlying_symbol}{expiry_code}{option_type}{int(strike):d}"
    return ticker