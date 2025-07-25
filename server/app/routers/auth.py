"""Authentication endpoints for user registration and login."""

from __future__ import annotations

from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..core.security import create_access_token, verify_password
from ..database import get_db
from ..schemas import Token, UserCreate, UserLogin
from ..crud import get_user_by_username, create_user


router = APIRouter()


@router.post("/register", response_model=Token, summary="Register a new user")
def register(user_in: UserCreate, db: Session = Depends(get_db)) -> Token:
    if get_user_by_username(db, user_in.username):
        raise HTTPException(status_code=400, detail="Username already registered")
    user = create_user(db, user_in.username, user_in.password)
    token = create_access_token({"sub": user.username})
    return Token(access_token=token)


@router.post("/login", response_model=Token, summary="Authenticate user and return a JWT token")
def login(user_in: UserLogin, db: Session = Depends(get_db)) -> Token:
    user = get_user_by_username(db, user_in.username)
    if not user or not verify_password(user_in.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    token = create_access_token({"sub": user.username})
    return Token(access_token=token)