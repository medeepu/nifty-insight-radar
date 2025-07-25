"""Functions for computing the Central Pivot Range (CPR) and pivot levels.

The CPR consists of three lines: pivot, bottom central (BC) and top central
(TC).  It provides insight into the market’s likely direction.  We also
compute S1–S3 and R1–R3 support/resistance levels.
"""

from __future__ import annotations

from typing import Dict, Tuple


def compute_cpr_levels(
    prev_high: float,
    prev_low: float,
    prev_close: float,
    prev_cpr_width: float | None = None,
    narrow_threshold: float = 0.6,
    wide_threshold: float = 1.4,
) -> Dict[str, float | str]:
    """Computes daily pivot levels and classifies the CPR type.

    Args:
        prev_high: previous day high
        prev_low: previous day low
        prev_close: previous day close
        prev_cpr_width: width of previous day’s CPR (TC-BC) for classification
        narrow_threshold: ratio below which CPR is considered narrow
        wide_threshold: ratio above which CPR is considered wide

    Returns:
        A dictionary containing pivot, bc, tc, s1, s2, s3, r1, r2, r3 and cpr_type.
    """
    pivot = (prev_high + prev_low + prev_close) / 3.0
    bc = (prev_high + prev_low) / 2.0
    tc = pivot + (pivot - bc)
    # Standard pivot levels
    r1 = (2 * pivot) - prev_low
    s1 = (2 * pivot) - prev_high
    r2 = pivot + (prev_high - prev_low)
    s2 = pivot - (prev_high - prev_low)
    r3 = r2 + (prev_high - prev_low)
    s3 = s2 - (prev_high - prev_low)
    # CPR classification
    width = tc - bc
    if prev_cpr_width is None:
        cpr_type = "normal"
    else:
        ratio = width / prev_cpr_width
        if ratio <= narrow_threshold:
            cpr_type = "narrow"
        elif ratio >= wide_threshold:
            cpr_type = "wide"
        else:
            cpr_type = "normal"
    return {
        "pivot": pivot,
        "bc": bc,
        "tc": tc,
        "s1": s1,
        "s2": s2,
        "s3": s3,
        "r1": r1,
        "r2": r2,
        "r3": r3,
        "cpr_type": cpr_type,
    }