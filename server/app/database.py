"""
Simple SQLAlchemy session setup for the development server.

This module defines a SQLAlchemy engine and sessionmaker for use with
FastAPI dependency injection.  In a real deployment environment you
should customise the ``DATABASE_URL`` and connect arguments to match
your database backend.
"""

from __future__ import annotations

from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker


# Configure your database connection string here.  SQLite is used by
# default for convenience.
DATABASE_URL = "sqlite:///./app.db"

# When using SQLite in multithreaded applications (as with FastAPI) the
# ``check_same_thread`` flag must be set to ``False``.
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

# Create a configured session class.  ``autocommit`` and ``autoflush`` are
# disabled to let SQLAlchemy manage transactions explicitly.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for declarative models.  All SQLAlchemy models should
# inherit from this.
Base = declarative_base()


def get_db() -> Generator[sessionmaker, None, None]:
    """Yield a new database session for each request.

    This function is intended for use as a FastAPI dependency.  It
    ensures that sessions are properly closed after use.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()