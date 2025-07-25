"""Pydantic schemas for request and response bodies.

These models define the structure of data exchanged between the API and
clients.  They also serve as documentation for the OpenAPI specification.
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
    risk_capital: float = Field(0, description="Total capital allocated for trading")
    risk_per_trade: float = Field(0, description="Maximum risk per individual trade")
    default_timeframe: str = Field("5m", description="Default chart timeframe")
    advanced_filters: Dict[str, Any] = Field(default_factory=dict)
    indicator_prefs: Dict[str, Any] = Field(default_factory=dict)


class UpdateUserSettings(BaseModel):
    risk_capital: Optional[float] = None
    risk_per_trade: Optional[float] = None
    default_timeframe: Optional[str] = None
    advanced_filters: Optional[Dict[str, Any]] = None
    indicator_prefs: Optional[Dict[str, Any]] = None


# ---------------------------------------------------------------------------
# Market Data
# ---------------------------------------------------------------------------

class PriceData(BaseModel):
    symbol: str
    price: float
    timestamp: datetime.datetime


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


class SignalData(BaseModel):
    timestamp: datetime.datetime
    symbol: str
    scenario: str
    direction: str
    entry_price: float
    stop_price: float
    target_price: float
    risk_reward: float
    position_size: int
    confidence: float
    reason: Optional[str]


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