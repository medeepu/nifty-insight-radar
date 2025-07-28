"""
ORM models for the Nifty Insight Radar backend (extended).

This version of the models module introduces a nested user settings
structure, additional tables to support option chains, historical implied
volatility and user portfolios, and renames indicator preference fields
for clarity.  Existing columns remain to support legacy data.
"""

from __future__ import annotations

import datetime
from sqlalchemy import (
    Column,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    Boolean,
    JSON,
)
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(64), unique=True, nullable=False)
    password_hash = Column(String(128), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    settings = relationship("UserSettings", back_populates="user", uselist=False)
    trades = relationship("Trade", back_populates="user")
    broker_credentials = relationship("BrokerCredentials", back_populates="user", uselist=False)
    portfolios = relationship("UserPortfolio", back_populates="user")


class UserSettings(Base):
    __tablename__ = "user_settings"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Legacy flat settings fields (retained for backward compatibility)
    risk_capital = Column(Numeric, default=0)
    risk_per_trade = Column(Numeric, default=0)
    default_timeframe = Column(String(16), default="5m")
    advanced_filters = Column(JSON, default={})
    indicator_prefs = Column(JSON, default={})

    # Nested settings structure used by the new client
    theme = Column(String(16), default="dark")
    default_symbol = Column(String(16), default="NIFTY")
    default_timeframe_nested = Column(String(16), default="5m")
    risk_settings = Column(JSON, default={})
    display_settings = Column(JSON, default={})
    notifications = Column(JSON, default={})
    indicator_preferences = Column(JSON, default={})
    chart_configuration = Column(JSON, default={})
    broker_settings = Column(JSON, default={})

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(
        DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow
    )

    user = relationship("User", back_populates="settings")


class LevelsDaily(Base):
    __tablename__ = "levels_daily"

    id = Column(Integer, primary_key=True)
    date = Column(Date, nullable=False)
    symbol = Column(String(16), nullable=False)
    pivot = Column(Numeric, nullable=False)
    bc = Column(Numeric, nullable=False)
    tc = Column(Numeric, nullable=False)
    s1 = Column(Numeric, nullable=False)
    s2 = Column(Numeric, nullable=False)
    s3 = Column(Numeric, nullable=False)
    r1 = Column(Numeric, nullable=False)
    r2 = Column(Numeric, nullable=False)
    r3 = Column(Numeric, nullable=False)
    cpr_type = Column(String(16), nullable=False)


class IndicatorSnapshot(Base):
    __tablename__ = "indicators"

    id = Column(Integer, primary_key=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    symbol = Column(String(16), nullable=False, index=True)
    ema9 = Column(Numeric)
    ema21 = Column(Numeric)
    ema50 = Column(Numeric)
    ema200 = Column(Numeric)
    vwap = Column(Numeric)
    atr = Column(Numeric)
    rsi = Column(Numeric)
    stoch_k = Column(Numeric)
    stoch_d = Column(Numeric)
    volume_ma = Column(Numeric)


class Signal(Base):
    __tablename__ = "signals"

    id = Column(Integer, primary_key=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    symbol = Column(String(16), nullable=False, index=True)
    scenario = Column(String(32), nullable=False)
    direction = Column(String(16), nullable=False)
    entry_price = Column(Numeric, nullable=False)
    stop_price = Column(Numeric, nullable=False)
    target_price = Column(Numeric, nullable=False)
    risk_reward = Column(Numeric, nullable=False)
    position_size = Column(Integer, nullable=False)
    confidence = Column(Numeric, nullable=False)
    reason = Column(Text, nullable=True)

    trades = relationship("Trade", back_populates="signal")


class Trade(Base):
    __tablename__ = "trades"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    signal_id = Column(Integer, ForeignKey("signals.id"))
    broker_order_id = Column(String(64), nullable=True)
    entry_time = Column(DateTime, nullable=True)
    entry_price = Column(Numeric, nullable=True)
    exit_time = Column(DateTime, nullable=True)
    exit_price = Column(Numeric, nullable=True)
    quantity = Column(Integer, nullable=True)
    pnl = Column(Numeric, nullable=True)
    status = Column(String(16), default="pending")

    user = relationship("User", back_populates="trades")
    signal = relationship("Signal", back_populates="trades")


class BrokerCredentials(Base):
    __tablename__ = "broker_credentials"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    broker_name = Column(String(32), nullable=False)
    api_key = Column(String(128), nullable=False)
    api_secret = Column(String(128), nullable=False)
    refresh_token = Column(String(128), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="broker_credentials")


class LogEntry(Base):
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    level = Column(String(16), nullable=False)
    message = Column(Text, nullable=False)
    context = Column(JSON, default={})


class OptionChain(Base):
    """
    Represents the real‑time option chain for a given symbol and expiry.

    Option chains are useful for displaying option ladders and calculating IV
    ranks.  They store the last traded price (ltp), implied volatility,
    volume and open interest for each strike.
    """

    __tablename__ = "option_chains"

    id = Column(Integer, primary_key=True)
    symbol = Column(String(16), nullable=False)
    expiry = Column(Date, nullable=False)
    strike = Column(Numeric, nullable=False)
    option_type = Column(String(1), nullable=False)
    ltp = Column(Numeric)
    iv = Column(Numeric)
    volume = Column(Numeric)
    oi = Column(Numeric)


class HistoricalIV(Base):
    """
    Stores historical implied volatility values for calculating IV ranks.
    """

    __tablename__ = "historical_iv"

    id = Column(Integer, primary_key=True)
    symbol = Column(String(16), nullable=False)
    date = Column(Date, nullable=False)
    iv_value = Column(Numeric, nullable=False)


class UserPortfolio(Base):
    """
    Aggregated positions and PnL per user across all instruments.
    """

    __tablename__ = "user_portfolios"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    positions = Column(JSON, default=[])
    pnl = Column(Numeric, default=0)

    user = relationship("User", back_populates="portfolios")