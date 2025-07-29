"""
WebSocket endpoints for real‑time streaming.

This module exposes a small set of WebSocket channels that the
front‑end can subscribe to in order to receive streaming updates.  In
addition to merely registering connections, the price, signal and
greeks channels can also periodically push fresh data back to the
client when the application integrates with live market feeds.

The helpers defined here abstract away the boilerplate of accepting
WebSocket connections, registering them with the global manager and
cleanly handling disconnects.  To broadcast data to all subscribers
you can import ``manager`` from ``app.websocket_manager`` and call
``await manager.broadcast(channel, message)`` from anywhere in the
application.
"""

from __future__ import annotations

import asyncio
from typing import Callable, Awaitable

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from ..websocket_manager import manager
from ..utils import data_fetcher


router = APIRouter()


async def _handle_ws(websocket: WebSocket, channel: str, on_connect: Callable[[WebSocket], Awaitable[None]] | None = None) -> None:
    """Internal helper to register a WebSocket and keep it alive.

    This helper encapsulates common logic for WebSocket endpoints: it
    accepts the incoming socket, registers it with the global manager
    under the given channel name, optionally triggers a callback on
    successful connection and finally keeps the socket open until the
    client disconnects.  Incoming messages from the client are ignored,
    but must be awaited to detect disconnects properly.

    Args:
        websocket: The ``WebSocket`` instance accepted by FastAPI.
        channel: A short identifier for the stream (e.g. ``"price"``).
        on_connect: Optional coroutine invoked immediately after the
            client is registered.  This can be used to kick off a
            background task such as sending an initial snapshot.
    """
    await manager.connect(websocket, channel)
    # Execute the optional callback outside of the connect call so
    # errors don't break registration.  Swallow exceptions to avoid
    # tearing down the connection unexpectedly.
    if on_connect is not None:
        try:
            await on_connect(websocket)
        except Exception:
            pass
    try:
        while True:
            # Wait for any message from the client.  We ignore the content
            # here, but receiving is necessary to detect disconnects.
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, channel)


@router.websocket("/ws/price")
async def ws_price(websocket: WebSocket) -> None:
    """Subscribe to streaming price updates.

    When a client connects to this endpoint it is subscribed to the
    ``price`` channel.  As a convenience the first time a client
    connects we immediately send back the current price for the
    default symbol (if available).  Ongoing updates are broadcast from
    other parts of the application via the ``manager.broadcast`` API.
    """

    async def send_initial_price(ws: WebSocket) -> None:
        # Fetch the latest price for the default symbol.  This call
        # intentionally ignores errors and will silently do nothing if
        # data cannot be fetched.
        price = await data_fetcher.get_current_price("NIFTY")
        if price is not None:
            await ws.send_json({"symbol": "NIFTY", "price": price})

    await _handle_ws(websocket, "price", on_connect=send_initial_price)


@router.websocket("/ws/signal")
async def ws_signal(websocket: WebSocket) -> None:
    """Subscribe to trading signal updates.

    Subscribers to this channel receive real‑time trading signals.  The
    first message is intentionally left blank as signals are only
    generated when your strategy engine emits them.
    """
    await _handle_ws(websocket, "signal")


@router.websocket("/ws/greeks")
async def ws_greeks(websocket: WebSocket) -> None:
    """Subscribe to option Greeks updates.

    Clients connecting to this endpoint will receive updates about
    Greeks such as delta, gamma, theta and vega.  No message is sent
    on connect since Greeks are only computed on demand.
    """
    await _handle_ws(websocket, "greeks")