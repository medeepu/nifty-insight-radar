"""Endpoints for retrieving system logs."""

from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas import LogsResponse, LogEntryModel
from ..crud import get_recent_logs


router = APIRouter()


@router.get("/logs/recent", response_model=LogsResponse, summary="Get recent logs")
def recent_logs(limit: int = Query(100, ge=1, le=1000), db: Session = Depends(get_db)) -> LogsResponse:
    entries = get_recent_logs(db, limit)
    models = [LogEntryModel(**entry) for entry in entries]
    return LogsResponse(logs=models)