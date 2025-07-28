"""
Simple WebSocket manager for channel‑based broadcasting.

The manager keeps track of active WebSocket connections grouped by
channel name.  It provides methods to connect and disconnect clients,
send messages to individual connections and broadcast to all clients on
a channel.
"""

from __future__ import annotations

from typing import Dict, Set

from fastapi import WebSocket


class WebSocketManager:
    """Manage multiple WebSocket connections across arbitrary channels."""

    def __init__(self) -> None:
        # Map channel names to sets of connected WebSockets
        self.channels: Dict[str, Set[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, channel: str) -> None:
        """Accepts an incoming WebSocket and registers it under ``channel``."""
        await websocket.accept()
        self.channels.setdefault(channel, set()).add(websocket)

    def disconnect(self, websocket: WebSocket, channel: str) -> None:
        """Removes a WebSocket from the given channel."""
        if channel in self.channels and websocket in self.channels[channel]:
            self.channels[channel].remove(websocket)
            if not self.channels[channel]:
                del self.channels[channel]

    async def send_personal_message(self, message: str, websocket: WebSocket) -> None:
        """Sends a text message to a single WebSocket client."""
        await websocket.send_text(message)

    async def broadcast(self, channel: str, message: str) -> None:
        """Broadcasts a text message to all clients subscribed to ``channel``."""
        websockets = list(self.channels.get(channel, set()))
        for connection in websockets:
            try:
                await connection.send_text(message)
            except Exception:
                # If sending fails, drop the connection silently
                self.disconnect(connection, channel)


# Global WebSocket manager instance shared across all routers
manager = WebSocketManager()