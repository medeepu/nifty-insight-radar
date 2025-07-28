"""
User settings CRUD endpoints.

The client expects the server to persist user preferences such as risk
parameters, display options and broker credentials.  This router
provides simple GET and PUT operations to retrieve and update the
settings for the authenticated user.  At present authentication is not
implemented and the first user (ID = 1) is assumed.

In production you should integrate proper authentication, user
scoping and validation.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import UserSettings
from ..schemas import UserSettingsModel, UpdateUserSettings


router = APIRouter()


def _to_schema(settings: UserSettings) -> UserSettingsModel:
    """Converts a UserSettings ORM object into the nested schema used by the API."""
    return UserSettingsModel(
        theme=settings.theme or "dark",
        defaultSymbol=settings.default_symbol or "NIFTY",
        defaultTimeframe=settings.default_timeframe_nested or "5m",
        riskSettings=settings.risk_settings or {},
        displaySettings=settings.display_settings or {},
        notifications=settings.notifications or {},
        indicatorPreferences=settings.indicator_preferences or {},
        chartConfiguration=settings.chart_configuration or {},
        brokerSettings=settings.broker_settings or {},
    )


@router.get(
    "/settings",
    response_model=UserSettingsModel,
    summary="Retrieve the current user's settings",
)
def get_settings(db: Session = Depends(get_db)) -> UserSettingsModel:
    """Fetches settings for the first user.

    In a real application this would fetch settings for the authenticated
    user.  If no settings exist yet a default settings object is created
    in the database.
    """
    settings = db.query(UserSettings).first()
    if settings is None:
        # Create default settings row for the first user (ID = 1)
        settings = UserSettings(user_id=1)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return _to_schema(settings)


@router.put(
    "/settings",
    response_model=UserSettingsModel,
    summary="Update the current user's settings",
)
def update_settings(
    payload: UpdateUserSettings,
    db: Session = Depends(get_db),
) -> UserSettingsModel:
    """Updates settings for the first user with values provided in ``payload``.

    Only fields that are provided in ``payload`` will be updated.  Nested
    dictionaries completely replace their existing values to simplify the
    implementation.  A more sophisticated approach might deep‑merge
    partial updates instead.
    """
    settings = db.query(UserSettings).first()
    if settings is None:
        settings = UserSettings(user_id=1)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    # Update simple scalar fields
    if payload.theme is not None:
        settings.theme = payload.theme
    if payload.defaultSymbol is not None:
        settings.default_symbol = payload.defaultSymbol
    if payload.defaultTimeframe is not None:
        settings.default_timeframe_nested = payload.defaultTimeframe
    # Update nested JSON fields
    if payload.riskSettings is not None:
        settings.risk_settings = payload.riskSettings
    if payload.displaySettings is not None:
        settings.display_settings = payload.displaySettings
    if payload.notifications is not None:
        settings.notifications = payload.notifications
    if payload.indicatorPreferences is not None:
        settings.indicator_preferences = payload.indicatorPreferences
    if payload.chartConfiguration is not None:
        settings.chart_configuration = payload.chartConfiguration
    if payload.brokerSettings is not None:
        settings.broker_settings = payload.brokerSettings
    db.commit()
    db.refresh(settings)
    return _to_schema(settings)