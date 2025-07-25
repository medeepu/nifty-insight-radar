"""Security utilities: password hashing and JWT token management.

For the purposes of this example we use SHA‑256 for hashing and PyJWT for
token creation.  In production you should use a stronger password hashing
algorithm such as bcrypt or Argon2 and rotate your JWT secrets regularly.
"""

from __future__ import annotations

import hashlib
import hmac
import time
from datetime import datetime, timedelta
from typing import Any, Dict, Optional

try:
    import jwt  # type: ignore[import-not-found]
except ImportError:
    jwt = None  # type: ignore[assignment]

from .config import get_settings


def hash_password(password: str) -> str:
    """Computes a SHA‑256 hash of the given password."""
    return hashlib.sha256(password.encode()).hexdigest()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a password against a previously stored hash."""
    return hmac.compare_digest(hash_password(plain_password), hashed_password)


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Generates a JWT access token.

    Falls back to a simple time‑based concatenation if PyJWT is not available.
    """
    settings = get_settings()
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(hours=8))
    to_encode.update({"exp": expire})
    if jwt:
        return jwt.encode(to_encode, settings.jwt_secret, algorithm="HS256")  # type: ignore[no-any-return]
    # Fallback: naive token with expiration encoded into payload
    token = f"{to_encode}|{settings.jwt_secret}"
    return token


def decode_token(token: str) -> Dict[str, Any]:
    """Decodes a JWT access token.

    If PyJWT is unavailable the fallback implementation simply splits
    the token and ignores signature verification.  Returns an empty dict
    if decoding fails.
    """
    settings = get_settings()
    if jwt:
        try:
            return jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
        except Exception:
            return {}
    # Fallback decoding: expect the naive format from create_access_token
    try:
        payload_str, secret = token.rsplit("|", 1)
        if secret != settings.jwt_secret:
            return {}
        # Evaluate the payload string as Python literal
        return eval(payload_str)  # noqa: S307
    except Exception:
        return {}
