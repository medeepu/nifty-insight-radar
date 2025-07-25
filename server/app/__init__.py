"""Nifty Insight Radar backend package.

This module initialises the FastAPI application and exposes all routers.
The heavy lifting is done in the subpackages `core`, `utils`, `routers` and
`database`.  See `app/main.py` for the actual application instance.
"""

from .main import app  # noqa: F401
