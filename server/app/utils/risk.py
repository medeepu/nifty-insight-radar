"""
Advanced risk management utilities.

This module provides helper functions for computing portfolio‑level
risk, dynamic position sizing and correlation analysis between
instruments.  These functions are currently stubs but illustrate how
you might structure a risk management library for a trading system.
Integrating these routines into your strategy will allow you to
respect portfolio constraints and adjust leverage based on market
conditions.
"""

from __future__ import annotations

import numpy as np
from typing import Dict, List, Tuple


def calculate_portfolio_risk(positions: Dict[str, Tuple[float, float]]) -> float:
    """
    Computes the approximate portfolio risk given a set of positions.

    Args:
        positions: A mapping from symbol to a tuple of (quantity, price).

    Returns:
        A float representing the portfolio's exposure.  Higher values
        indicate greater risk.  This implementation computes a simple
        dollar‑weighted sum of absolute position sizes.
    """
    exposure = 0.0
    for symbol, (qty, price) in positions.items():
        exposure += abs(qty * price)
    return exposure


def dynamic_position_size(target_risk: float, current_risk: float, max_size: int = 10) -> int:
    """
    Determines a dynamic position size based on desired and current risk.

    Args:
        target_risk: The maximum acceptable risk exposure.
        current_risk: The current portfolio risk.
        max_size: The maximum allowable size for an individual position.

    Returns:
        An integer position size capped by ``max_size``.  If current risk
        is below target risk, the size increases proportionally; otherwise
        it is reduced.
    """
    if current_risk <= 0:
        return max_size
    ratio = max(min((target_risk - current_risk) / target_risk, 1.0), 0.0)
    return int(max_size * ratio)


def compute_correlation_matrix(price_series: Dict[str, List[float]]) -> Dict[str, Dict[str, float]]:
    """
    Computes the Pearson correlation matrix for a set of instruments.

    Args:
        price_series: A mapping from symbol to a list of historical prices.

    Returns:
        A nested dictionary where the outer keys and inner keys are symbols
        and the values are correlation coefficients.  A value of 1
        indicates perfect correlation, -1 perfect inverse correlation and
        0 no correlation.  Missing or insufficient data yields NaN.
    """
    symbols = list(price_series.keys())
    matrix: Dict[str, Dict[str, float]] = {s: {} for s in symbols}
    for i, sym_i in enumerate(symbols):
        for j, sym_j in enumerate(symbols):
            if j < i:
                matrix[sym_i][sym_j] = matrix[sym_j][sym_i]
                continue
            xi = price_series[sym_i]
            xj = price_series[sym_j]
            if len(xi) != len(xj) or len(xi) < 2:
                matrix[sym_i][sym_j] = float("nan")
                continue
            corr = np.corrcoef(xi, xj)[0, 1]
            matrix[sym_i][sym_j] = float(corr)
    return matrix