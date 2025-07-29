"""
Extended Pydantic schemas for request and response bodies.

This module mirrors the original schemas but introduces nested user
settings structures, optional indicator series responses and additional
fields for option Greeks such as moneyness and status.  Existing field
names are preserved where possible to maintain backwards compatibility.
"""

from __future__ import annotations

import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Authentication & User
# ---------------------------------------------------------------------------

class UserCreate(BaseModel):
    username: str
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserSettingsModel(BaseModel):
    """
    Nested user settings as expected by the client.

    The settings are grouped into logically related categories rather than
    being flat columns.  Risk parameters, display preferences and
    notifications all live in their own sub‑dictionaries.  New categories
    can be added over time without breaking backwards compatibility.
    """

    theme: str = Field("dark", description="UI theme (dark/light)")
    defaultSymbol: str = Field("NIFTY", description="Default trading symbol")
    defaultTimeframe: str = Field("5m", description="Default chart timeframe")
    riskSettings: Dict[str, float] = Field(default_factory=dict, description="Risk management settings")
    displaySettings: Dict[str, bool] = Field(default_factory=dict, description="Chart and UI display preferences")
    notifications: Dict[str, bool] = Field(default_factory=dict, description="Notification channel toggles")
    indicatorPreferences: Dict[str, Any] = Field(default_factory=dict, description="Preferred indicator parameters")
    chartConfiguration: Dict[str, Any] = Field(default_factory=dict, description="Chart configuration options")
    brokerSettings: Dict[str, Any] = Field(default_factory=dict, description="Broker connection details")


class UpdateUserSettings(BaseModel):
    theme: Optional[str] = None
    defaultSymbol: Optional[str] = None
    defaultTimeframe: Optional[str] = None
    riskSettings: Optional[Dict[str, float]] = None
    displaySettings: Optional[Dict[str, bool]] = None
    notifications: Optional[Dict[str, bool]] = None
    indicatorPreferences: Optional[Dict[str, Any]] = None
    chartConfiguration: Optional[Dict[str, Any]] = None
    brokerSettings: Optional[Dict[str, Any]] = None


# ---------------------------------------------------------------------------
# Market Data
# ---------------------------------------------------------------------------

class PriceData(BaseModel):
    symbol: str
    price: float
    timestamp: datetime.datetime
    # The absolute change from the previous close.  When unavailable this
    # field is ``None``.  Many client widgets rely on this to display
    # up/down arrows and colour coding.
    change: Optional[float] = None
    # Percentage change from the previous close.  Expressed as a number
    # between –100 and +∞.  When unavailable this field is ``None``.
    percent_change: Optional[float] = None


class Candle(BaseModel):
    time: datetime.datetime
    open: float
    high: float
    low: float
    close: float
    volume: float


class CandleData(BaseModel):
    symbol: str
    timeframe: str
    candles: List[Candle]


class DailyLevels(BaseModel):
    symbol: str
    date: datetime.date
    pivot: float
    bc: float
    tc: float
    s1: float
    s2: float
    s3: float
    r1: float
    r2: float
    r3: float
    cpr_type: str


# ---------------------------------------------------------------------------
# Indicators & Signals
# ---------------------------------------------------------------------------

class IndicatorData(BaseModel):
    """
    Single snapshot of indicator values.

    This model is retained for backwards compatibility when clients only
    need the most recent indicator values.  For historical series use
    `IndicatorSeriesData`.
    """

    timestamp: datetime.datetime
    symbol: str
    ema9: Optional[float]
    ema21: Optional[float]
    ema50: Optional[float]
    ema200: Optional[float]
    vwap: Optional[float]
    atr: Optional[float]
    rsi: Optional[float]
    stoch_k: Optional[float]
    stoch_d: Optional[float]
    volume_ma: Optional[float]


class IndicatorSeriesData(BaseModel):
    """
    Historical indicator series for chart overlays.

    Each field is either a list of time/value pairs or a dictionary keyed
    by period.  Clients can use these arrays to plot continuous indicator
    lines.  Values may be `None` for periods where insufficient history
    exists (e.g. ATR before 14 candles have formed).
    """

    symbol: str
    ema: Dict[str, List[Dict[str, Any]]]
    vwap: List[Dict[str, Any]]
    atr: List[Dict[str, Any]]
    rsi: List[Dict[str, Any]]
    stoch_k: List[Dict[str, Any]]
    stoch_d: List[Dict[str, Any]]
    volume_ma: List[Dict[str, Any]]


class SignalData(BaseModel):
    """
    Representation of a trading signal returned by the server.

    The client expects the field ``signal`` to convey the suggested trade
    direction (``'BUY'``, ``'SELL'`` or ``'NEUTRAL'``).  For backward
    compatibility the internal SQLAlchemy model still uses ``direction``,
    but this schema exposes only ``signal``.  All other numeric fields
    mirror the underlying database columns.
    """

    timestamp: datetime.datetime
    symbol: str
    scenario: str
    # Client‑friendly field representing the direction of the trade.  It
    # maps to the ``direction`` column on the ``Signal`` table.  Allowed
    # values are 'BUY', 'SELL' or 'NEUTRAL'.
    signal: str
    entry_price: float
    stop_price: float
    target_price: float
    risk_reward: float
    position_size: int
    confidence: float
    reason: Optional[str]

    # Legacy alias for the signal direction.  Some older clients may still
    # refer to ``direction`` rather than ``signal``.  This optional
    # attribute will be populated with the same value as ``signal`` in
    # responses to preserve backwards compatibility.
    direction: Optional[str] = None


# ---------------------------------------------------------------------------
# Greeks & Options
# ---------------------------------------------------------------------------

class GreeksData(BaseModel):
    option_symbol: str
    expiry: datetime.date
    strike: float
    option_type: str
    underlying_price: float
    implied_volatility: float
    option_price: float
    delta: float
    gamma: float
    theta: float
    vega: float
    rho: float
    intrinsic_value: float
    time_value: float
    entry_price: float
    stop_price: float
    target_price: float
    risk_reward: float
    position_size: int
    moneyness_percent: float
    status: str
    # The implied volatility rank (0–100) computed over a recent lookback
    # period.  When there is insufficient history this may be ``None``.
    iv_rank: Optional[float] = None
    # The real market price of the option (last traded price).  This field
    # allows the front‑end to compare theoretical and actual prices.
    market_option_price: Optional[float] = None
    # Client‑friendly naming: the theoretical option price.
    theoreticalPrice: Optional[float] = None
    # Break‑even point at expiry (strike ± option cost).
    breakEven: Optional[float] = None
    # Maximum possible profit (e.g. unlimited for calls).  ``None`` means unlimited.
    maxProfit: Optional[float] = None
    # Maximum loss (the option premium paid).
    maxLoss: Optional[float] = None

    # -------------------------------------------------------------------
    # Client‑friendly alias fields (deprecated)
    #
    # The client may still expect short field names such as ``iv``,
    # ``intrinsicValue``, ``timeValue`` and ``moneynessPercent`` due to
    # older implementations.  These optional fields simply mirror the
    # values from the longer canonical names and can be omitted in
    # responses where clients have been updated.
    # -------------------------------------------------------------------
    iv: Optional[float] = None
    intrinsicValue: Optional[float] = None
    timeValue: Optional[float] = None
    moneynessPercent: Optional[float] = None
    # --------------------------------------------------------------------
    # Backwards‑compatible aliases expected by older clients.  These
    # duplicate values already present above but use camelCase naming.
    # They are optional so that new clients can ignore them.
    iv: Optional[float] = Field(None, description="Alias for implied_volatility")
    intrinsicValue: Optional[float] = Field(None, description="Alias for intrinsic_value")
    timeValue: Optional[float] = Field(None, description="Alias for time_value")
    moneynessPercent: Optional[float] = Field(None, description="Alias for moneyness_percent")


# ---------------------------------------------------------------------------
# Logs
# ---------------------------------------------------------------------------

class LogEntryModel(BaseModel):
    timestamp: datetime.datetime
    level: str
    message: str
    context: Dict[str, Any]


class LogsResponse(BaseModel):
    logs: List[LogEntryModel]


# ---------------------------------------------------------------------------
# Risk Management
# ---------------------------------------------------------------------------

class RiskMetrics(BaseModel):
    symbol: str
    timeframe: str
    entry_price: float
    stop_price: float
    target_price: float
    position_size: int
    risk_per_trade: float
    max_loss: float
    potential_profit: float


# ---------------------------------------------------------------------------
# Volatility analytics
# ---------------------------------------------------------------------------

class SkewPoint(BaseModel):
    strike: float
    call_iv: Optional[float] = None
    put_iv: Optional[float] = None


class SkewData(BaseModel):
    symbol: str
    expiry: datetime.date
    points: List[SkewPoint]


class TermStructurePoint(BaseModel):
    expiry: datetime.date
    iv: float


class TermStructureData(BaseModel):
    symbol: str
    term_structure: List[TermStructurePoint]


# ---------------------------------------------------------------------------
# Broker & Trading
# ---------------------------------------------------------------------------

class BrokerCredentialsModel(BaseModel):
    broker_name: str
    api_key: str
    api_secret: str
    refresh_token: Optional[str] = None


class TradeOrder(BaseModel):
    symbol: str
    quantity: int
    side: str  # buy/sell
    order_type: str  # market/limit
    price: Optional[float] = None


class TradeOrderResponse(BaseModel):
    ok: bool
    order_id: Optional[str] = None
    filled_quantity: Optional[int] = None
    avg_price: Optional[float] = None
    pnl: Optional[float] = None


# ---------------------------------------------------------------------------
# Backtesting & ML
# ---------------------------------------------------------------------------

class TradeResult(BaseModel):
    """Result of a single trade in a backtest."""
    entry_time: datetime.datetime
    exit_time: datetime.datetime
    entry_price: float
    exit_price: float
    quantity: int
    pnl: float


class BacktestResult(BaseModel):
    """Summary of a backtest including equity curve and trades."""
    equity_curve: List[Dict[str, float]]
    trades: List[TradeResult]


class MLInsight(BaseModel):
    """Placeholder structure for machine learning insights."""
    symbol: str
    timeframe: str
    notes: List[str]
    confidence: float