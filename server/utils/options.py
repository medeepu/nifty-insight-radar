"""Option utility functions.

This module re‑exports helper functions for parsing option symbols.  It also
provides convenience functions for translating spot levels to option price
targets using Greeks.  The heavy lifting lives in `utils.greeks`.
"""

from __future__ import annotations

from .greeks import parse_option_symbol, compute_option_metrics, OptionGreeks  # noqa: F401

__all__ = ["parse_option_symbol", "compute_option_metrics", "OptionGreeks"]
