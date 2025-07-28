"""
WebSocket endpoints for real‑time streaming.

The front‑end subscribes to a small set of channels (price, signal,
logs, greeks) via WebSockets.  This module defines one endpoint per
channel.  Upon connecting, the client is registered with the global
WebSocket manager and stays subscribed until it disconnects.  The
connection simply awaits incoming messages from the client (which are
ignored) and will automatically be cleaned up on disconnect.

To broadcast updates from other parts of the application, import
``manager`` from ``app.websocket_manager`` and call
``await manager.broadcast(channel, message)``.
"""

from __future__ import annotations

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from ..websocket_manager import manager


router = APIRouter()


async def _handle_ws(websocket: WebSocket, channel: str) -> None:
    """Internal helper to register a WebSocket and keep it alive."""
    await manager.connect(websocket, channel)
    try:
        while True:
            # Wait for any message from the client.  We ignore the content
            # here, but receiving is necessary to detect disconnects.
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, channel)


@router.websocket("/ws/price")
async def ws_price(websocket: WebSocket) -> None:
    await _handle_ws(websocket, "price")


@router.websocket("/ws/signal")
async def ws_signal(websocket: WebSocket) -> None:
    await _handle_ws(websocket, "signal")


@router.websocket("/ws/logs")
async def ws_logs(websocket: WebSocket) -> None:
    await _handle_ws(websocket, "logs")


@router.websocket("/ws/greeks")
async def ws_greeks(websocket: WebSocket) -> None:
    await _handle_ws(websocket, "greeks")