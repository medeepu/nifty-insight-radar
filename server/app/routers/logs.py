"""
Activity logs endpoint.

The dashboard's activity log widget queries recent log entries via this
endpoint.  Log entries can represent executed trades, error messages
or other events recorded by the server.  They are stored in the
``logs`` table and can also be broadcast to connected clients through
the ``logs`` WebSocket channel.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import LogEntry
from ..schemas import LogsResponse, LogEntryModel
from ..websocket_manager import manager


router = APIRouter()


@router.get(
    "/logs/recent",
    response_model=LogsResponse,
    summary="Retrieve the most recent log entries",
)
async def recent_logs(
    limit: int = Query(50, ge=1, le=1000, description="Maximum number of logs to return"),
    db: Session = Depends(get_db),
) -> LogsResponse:
    """Fetches the ``limit`` most recent logs from the database.
    Logs are returned in reverse chronological order.
    """
    entries = (
        db.query(LogEntry)
        .order_by(LogEntry.timestamp.desc())
        .limit(limit)
        .all()
    )
    models = [
        LogEntryModel(
            timestamp=entry.timestamp,
            level=entry.level,
            message=entry.message,
            context=entry.context,
        )
        for entry in entries
    ]
    return LogsResponse(logs=models)