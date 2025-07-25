"""User settings management endpoints."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session

from ..core.security import decode_token
from ..database import get_db
from ..crud import get_user_by_username, create_or_update_settings
from ..models import UserSettings
from ..schemas import UpdateUserSettings, UserSettingsModel


router = APIRouter()


def get_current_user(token: str = Header(..., alias="Authorization"), db: Session = Depends(get_db)):
    """Extracts the current user from a Bearer token."""
    if not token or not token.lower().startswith("bearer"):
        raise HTTPException(status_code=401, detail="Missing authentication token")
    _, _, jwt_token = token.partition(" ")
    payload = decode_token(jwt_token)
    username = payload.get("sub") if payload else None
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = get_user_by_username(db, username)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


@router.get("/user/settings", response_model=UserSettingsModel, summary="Get current user settings")
def read_user_settings(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
) -> UserSettingsModel:
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    if not settings:
        # Create default settings if missing
        settings = create_or_update_settings(db, current_user, {})
    return UserSettingsModel(
        risk_capital=float(settings.risk_capital or 0),
        risk_per_trade=float(settings.risk_per_trade or 0),
        default_timeframe=settings.default_timeframe,
        advanced_filters=settings.advanced_filters or {},
        indicator_prefs=settings.indicator_prefs or {},
    )


@router.post("/user/settings", response_model=dict, summary="Update user settings")
def update_user_settings(
    payload: UpdateUserSettings,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    updates = payload.dict(exclude_unset=True)
    settings = create_or_update_settings(db, current_user, updates)
    return {"ok": True}