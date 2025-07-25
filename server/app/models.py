"""ORM models for the Nifty Insight Radar backend.

Each class in this module maps to a table defined in the project specification.
We use SQLAlchemy's declarative base to define columns, relationships and
indexes.
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


class UserSettings(Base):
    __tablename__ = "user_settings"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    risk_capital = Column(Numeric, default=0)
    risk_per_trade = Column(Numeric, default=0)
    default_timeframe = Column(String(16), default="5m")
    advanced_filters = Column(JSON, default={})
    indicator_prefs = Column(JSON, default={})
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

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