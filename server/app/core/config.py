"""Application settings loaded from environment variables.

Configuration is centralised in this module.  Settings are loaded once
when imported and can be accessed via `get_settings()`.  Do not instantiate
the Settings class directly; use the factory function to ensure values are
cached.
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from functools import lru_cache
from typing import Any, Optional


@dataclass
class Settings:
    """Holds configuration for the application."""

    database_url: Optional[str] = os.getenv("DATABASE_URL")
    redis_url: Optional[str] = os.getenv("REDIS_URL")
    finnhub_api_key: str = os.getenv("FINNHUB_API_KEY", "")
    alpha_vantage_api_key: str = os.getenv("ALPHAVANTAGE_API_KEY", "")
    jwt_secret: str = os.getenv("JWT_SECRET", "secret-key")
    encryption_key: str = os.getenv("ENCRYPTION_KEY", "0123456789abcdef0123456789abcdef")
    # Interval in seconds between WebSocket updates
    websocket_refresh_rate: float = float(os.getenv("WS_REFRESH_RATE", "5"))
    # Default risk parameters
    default_risk_reward: float = float(os.getenv("DEFAULT_RR", "2.0"))
    default_position_size: float = float(os.getenv("DEFAULT_POSITION_SIZE", "1.0"))


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Returns a cached instance of Settings."""
    return Settings()