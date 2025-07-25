"""Database CRUD helper functions.

These functions encapsulate common database operations so that routers
remain thin.  They operate synchronously using SQLAlchemy ORM sessions.
"""

from __future__ import annotations

import datetime
from typing import List, Optional

from sqlalchemy.orm import Session

from .models import (
    BrokerCredentials,
    IndicatorSnapshot,
    LevelsDaily,
    LogEntry,
    Signal,
    Trade,
    User,
    UserSettings,
)
from .core.security import hash_password


def get_user_by_username(db: Session, username: str) -> Optional[User]:
    return db.query(User).filter(User.username == username).first()


def create_user(db: Session, username: str, password: str) -> User:
    user = User(username=username, password_hash=hash_password(password))
    db.add(user)
    db.commit()
    db.refresh(user)
    # Initialise default settings for the user
    settings = UserSettings(user_id=user.id, risk_capital=0, risk_per_trade=1000, default_timeframe="5m")
    db.add(settings)
    db.commit()
    return user


def create_or_update_settings(db: Session, user: User, updates: dict) -> UserSettings:
    settings = db.query(UserSettings).filter(UserSettings.user_id == user.id).first()
    if not settings:
        settings = UserSettings(user_id=user.id)
        db.add(settings)
    # Update fields if provided
    for key, value in updates.items():
        if hasattr(settings, key) and value is not None:
            setattr(settings, key, value)
    settings.updated_at = datetime.datetime.utcnow() if hasattr(settings, "updated_at") else None
    db.commit()
    db.refresh(settings)
    return settings


def record_log(db: Session, level: str, message: str, context: dict | None = None) -> LogEntry:
    entry = LogEntry(timestamp=datetime.datetime.utcnow(), level=level, message=message, context=context or {})
    db.add(entry)
    db.commit()
    return entry


def get_recent_logs(db: Session, limit: int = 100) -> List[dict]:
    logs = (
        db.query(LogEntry).order_by(LogEntry.timestamp.desc()).limit(limit).all()
    )
    return [
        {
            "timestamp": log.timestamp.isoformat(),
            "level": log.level,
            "message": log.message,
            "context": log.context,
        }
        for log in logs
    ]