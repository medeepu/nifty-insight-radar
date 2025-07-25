"""Database engine and session management.

This module sets up the SQLAlchemy engine and session factory.  It can
connect to either PostgreSQL or SQLite depending on the configuration.
"""

from __future__ import annotations

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from .core.config import get_settings


settings = get_settings()

# Create the SQLAlchemy engine.  If a PostgreSQL URL is provided, use it,
# otherwise fall back to an in‑memory SQLite database for development and
# testing.  SQLite is not suitable for production but avoids the need for
# external services during development.
DATABASE_URL = settings.database_url or "sqlite:///./nifty.db"

connect_args = {}
if DATABASE_URL.startswith("sqlite"):  # pragma: no cover
    # Required for SQLite to work in a multithreaded environment
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args)

# Declare the base class for ORM models
Base = declarative_base()

# Configure the session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """Dependency that yields a database session and ensures it is closed."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()