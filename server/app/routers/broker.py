"""Endpoints for broker credential management."""

from __future__ import annotations

import base64
from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import BrokerCredentials, User
from ..schemas import BrokerCredentialsModel
from ..core.security import decode_token
from ..crud import get_user_by_username


router = APIRouter()


def get_current_user(token: str = Header(..., alias="Authorization"), db: Session = Depends(get_db)) -> User:
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


def _encrypt(value: str, key: str) -> str:
    """A naive reversible obfuscation using XOR and base64 encoding."""
    key_bytes = key.encode()
    value_bytes = value.encode()
    encrypted = bytes([b ^ key_bytes[i % len(key_bytes)] for i, b in enumerate(value_bytes)])
    return base64.b64encode(encrypted).decode()


@router.post("/broker/keys", response_model=dict, summary="Store broker API keys")
def store_broker_keys(
    credentials: BrokerCredentialsModel,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    # Encrypt keys
    from ..core.config import get_settings
    settings = get_settings()
    api_key_enc = _encrypt(credentials.api_key, settings.encryption_key)
    api_secret_enc = _encrypt(credentials.api_secret, settings.encryption_key)
    refresh_enc = _encrypt(credentials.refresh_token or "", settings.encryption_key)
    existing = db.query(BrokerCredentials).filter(BrokerCredentials.user_id == current_user.id).first()
    if existing:
        existing.broker_name = credentials.broker_name
        existing.api_key = api_key_enc
        existing.api_secret = api_secret_enc
        existing.refresh_token = refresh_enc
    else:
        existing = BrokerCredentials(
            user_id=current_user.id,
            broker_name=credentials.broker_name,
            api_key=api_key_enc,
            api_secret=api_secret_enc,
            refresh_token=refresh_enc,
        )
        db.add(existing)
    db.commit()
    return {"ok": True}