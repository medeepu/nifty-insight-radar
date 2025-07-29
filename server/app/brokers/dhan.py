"""
Dhan broker integration.

This module outlines a client wrapper around the Dhan trading API.  It
closely mirrors the interface of the :class:`ZerodhaBroker` so that
the application can switch brokers transparently.  If the official
Dhan SDK is installed this wrapper will utilise it to perform
authentication, place orders and query positions.  When the SDK is not
available a series of mock responses are returned so that the rest of
the application continues to function without live broker access.

The constructor accepts your client credentials and an optional
``access_token``.  Call :meth:`authenticate` once to initialise a
session.  Order placement methods return dictionaries describing the
request outcome.
"""

from __future__ import annotations

from typing import Dict, Any, List, Optional

try:
    # Hypothetical Dhan SDK import; replace with the real import when available
    from dhan import DhanClient  # type: ignore[import-not-found]
except ImportError:
    DhanClient = None  # type: ignore[assignment]


class DhanBroker:
    def __init__(self, client_id: str, client_secret: str, access_token: Optional[str] = None) -> None:
        """
        Initialise the broker with client credentials.

        Real implementations should perform any required authentication here.
        """
        self.client_id = client_id
        self.client_secret = client_secret
        self.access_token = access_token
        self._client: DhanClient | None = None

    def authenticate(self, refresh_token: Optional[str] = None) -> None:
        """
        Authenticate with the Dhan API.

        When the Dhan SDK is available this method will either set the
        provided access token on the client or exchange a refresh token
        for a new access token.  Without the SDK it simply sets a mock
        token for development use.

        Args:
            refresh_token: Optional token used to obtain a new access token.
        """
        if DhanClient:
            self._client = DhanClient(client_id=self.client_id, client_secret=self.client_secret)
            if self.access_token:
                self._client.set_access_token(self.access_token)
            elif refresh_token:
                try:
                    token_data = self._client.refresh_access_token(refresh_token)
                    self.access_token = token_data["access_token"]
                    self._client.set_access_token(self.access_token)
                except Exception as exc:
                    raise RuntimeError(f"Failed to authenticate with Dhan: {exc}")
        else:
            if not self.access_token:
                self.access_token = "mock-access-token"

    def place_order(
        self,
        symbol: str,
        quantity: int,
        side: str,
        order_type: str = "MARKET",
        price: Optional[float] = None,
        product: str = "NRML",
        validity: str = "DAY",
    ) -> Dict[str, Any]:
        """
        Place an order with Dhan.

        Returns a mock response in this placeholder implementation.  When
        a real client is available the call will be forwarded to the
        SDK.  Side should be either ``"BUY"`` or ``"SELL"``.
        """
        if self._client:
            try:
                order = self._client.place_order(
                    symbol=symbol,
                    quantity=quantity,
                    side=side,
                    order_type=order_type,
                    price=price,
                    product=product,
                    validity=validity,
                )
                return {"status": "success", "order_id": order["order_id"]}
            except Exception as exc:
                raise RuntimeError(f"Dhan order placement failed: {exc}")
        return {
            "status": "success",
            "order_id": "DMOCK12345",
            "symbol": symbol,
            "quantity": quantity,
            "side": side,
            "order_type": order_type,
            "price": price,
        }

    def get_positions(self) -> List[Dict[str, Any]]:
        """
        Retrieve current open positions.

        Returns an empty list in the fallback implementation.  When a
        real client is available the SDK call is used.
        """
        if self._client:
            try:
                positions = self._client.get_positions()
                return positions  # type: ignore[no-any-return]
            except Exception as exc:
                raise RuntimeError(f"Failed to fetch Dhan positions: {exc}")
        return []

    def get_orders(self) -> List[Dict[str, Any]]:
        """
        Retrieve recent orders.

        Returns an empty list in the fallback implementation.  When
        authenticated with a real client, this method returns the list
        of all orders placed for the day.
        """
        if self._client:
            try:
                return self._client.get_orders()  # type: ignore[no-any-return]
            except Exception as exc:
                raise RuntimeError(f"Failed to fetch Dhan orders: {exc}")
        return []

    def cancel_order(self, order_id: str) -> Dict[str, Any]:
        """
        Cancel an existing order.

        If the Dhan client is available this will attempt to cancel the
        specified order.  Otherwise it returns a mock cancellation
        confirmation.
        """
        if self._client:
            try:
                resp = self._client.cancel_order(order_id)
                return {"status": "cancelled", "order_id": resp["order_id"]}
            except Exception as exc:
                raise RuntimeError(f"Failed to cancel Dhan order {order_id}: {exc}")
        return {"status": "cancelled", "order_id": order_id}