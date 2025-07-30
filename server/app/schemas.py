"""
Pydantic schemas for the server API.

This module defines the data transfer objects used by the FastAPI
routers.  The schemas mirror the nested structure of the client
settings panels and support deep merging of arbitrary nested
dictionaries.  In a production codebase you may wish to organise
schemas across multiple files, but here we collect only the schemas
required for the settings endpoints and Greeks API.
"""

from __future__ import annotations

from typing import Any, Dict, Optional

from pydantic import BaseModel, Field
import datetime
from typing import Optional


class UserSettingsModel(BaseModel):
    """Schema representing the persistent settings for a single user.

    Each top level field corresponds to a panel or category on the
    client.  Nested objects are stored as JSON in the database and
    returned verbatim to the caller.  Where possible we provide
    sensible defaults so that a newly created settings record is
    immediately usable on the client.
    """

    theme: str = Field(default="dark")
    defaultSymbol: str = Field(alias="default_symbol", default="NIFTY")
    defaultTimeframe: str = Field(alias="default_timeframe_nested", default="5m")
    # Risk and money management settings (position sizing, max loss, etc.)
    riskSettings: Optional[Dict[str, Any]] = Field(
        default=None, alias="risk_settings"
    )
    # Visual display options (chart styles, colour themes, show/hide widgets)
    displaySettings: Optional[Dict[str, Any]] = Field(
        default=None, alias="display_settings"
    )
    # Notification preferences (email, Telegram, push)
    notifications: Optional[Dict[str, Any]] = Field(default=None)
    # Indicator preferences (RSI length, ATR length, etc.)
    indicatorPreferences: Optional[Dict[str, Any]] = Field(
        alias="indicator_preferences", default=None
    )
    # Chart configuration (indicator overlays, scales, timeframe mappings)
    chartConfiguration: Optional[Dict[str, Any]] = Field(
        alias="chart_configuration", default=None
    )
    # Broker connection settings (API keys, default broker)
    brokerSettings: Optional[Dict[str, Any]] = Field(
        alias="broker_settings", default=None
    )
    # Greeks parameters (risk free rate, dividend yield, IV guess, days to expiry)
    greeksSettings: Optional[Dict[str, Any]] = Field(
        alias="greeks_settings", default=None
    )

    class Config:
        allow_population_by_field_name = True


class GreeksData(BaseModel):
    """Schema for responses from the Greeks endpoint.

    This model mirrors the fields returned by ``compute_option_metrics`` and
    additional derived quantities such as break‑even and max profit/loss.  It
    provides aliases for backwards‑compatibility with different client field
    names (e.g. ``iv`` for ``implied_volatility``).
    """

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
    iv_rank: Optional[float] = None
    market_option_price: Optional[float] = None
    theoreticalPrice: float
    breakEven: float
    maxProfit: Optional[float] = None
    maxLoss: float
    # Backwards‑compatible aliases
    iv: float = Field(alias="implied_volatility")
    intrinsicValue: float = Field(alias="intrinsic_value")
    timeValue: float = Field(alias="time_value")
    moneynessPercent: float = Field(alias="moneyness_percent")

    class Config:
        allow_population_by_field_name = True


class UpdateUserSettings(BaseModel):
    """Schema for updating user settings.

    All fields are optional so that callers can update only the
    desired sections of the settings.  Nested dictionaries will be
    deep merged on the server when provided.
    """

    theme: Optional[str] = None
    defaultSymbol: Optional[str] = Field(alias="default_symbol", default=None)
    defaultTimeframe: Optional[str] = Field(
        alias="default_timeframe_nested", default=None
    )
    riskSettings: Optional[Dict[str, Any]] = Field(
        default=None, alias="risk_settings"
    )
    displaySettings: Optional[Dict[str, Any]] = Field(
        default=None, alias="display_settings"
    )
    notifications: Optional[Dict[str, Any]] = None
    indicatorPreferences: Optional[Dict[str, Any]] = Field(
        default=None, alias="indicator_preferences"
    )
    chartConfiguration: Optional[Dict[str, Any]] = Field(
        default=None, alias="chart_configuration"
    )
    brokerSettings: Optional[Dict[str, Any]] = Field(
        default=None, alias="broker_settings"
    )
    greeksSettings: Optional[Dict[str, Any]] = Field(
        default=None, alias="greeks_settings"
    )

    class Config:
        allow_population_by_field_name = True
