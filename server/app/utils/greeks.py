"""Option pricing and Greeks computations.

This module provides helpers for parsing option tickers, computing
Black–Scholes option values and Greeks, and estimating implied volatility
through Newton–Raphson iterations.  It also includes functions to
translate underlying price targets into option price targets using delta and
gamma.
"""

from __future__ import annotations

import datetime
import math
from dataclasses import dataclass
from typing import Optional, Tuple

# SciPy is not available in this environment.  Implement the standard normal
# cumulative distribution function and probability density function using
# approximations.  The Abramowitz and Stegun formula offers sufficient
# accuracy for our purposes.
import math


def norm_cdf(x: float) -> float:
    """Cumulative distribution function for the standard normal distribution."""
    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))


def norm_pdf(x: float) -> float:
    """Probability density function for the standard normal distribution."""
    return (1.0 / math.sqrt(2 * math.pi)) * math.exp(-0.5 * x * x)


def parse_option_symbol(symbol: str) -> Tuple[str, datetime.date, float, str]:
    """Parses an option ticker into its components.

    The expected format is something like `NIFTY250417C24000` where:
      * `NIFTY` is the underlying symbol
      * `250417` is the expiry date (YYMMDD)
      * `C` is the option type (call) or `P` (put)
      * `24000` is the strike price

    Returns a tuple of (underlying, expiry_date, strike, option_type).
    """
    underlying = symbol[:5].upper()
    # Extract the date – assume 6 digits after the underlying
    date_str = symbol[5:11]
    option_type = symbol[11].upper()
    strike_str = symbol[12:]
    # Parse date
    year = 2000 + int(date_str[:2])
    month = int(date_str[2:4])
    day = int(date_str[4:6])
    expiry_date = datetime.date(year, month, day)
    strike = float(strike_str)
    return underlying, expiry_date, strike, option_type


def black_scholes_price(
    S: float,
    K: float,
    T: float,
    r: float,
    q: float,
    sigma: float,
    option_type: str,
) -> float:
    """Returns the Black–Scholes price of a European call or put.

    Parameters:
        S: underlying price
        K: strike price
        T: time to expiry in years
        r: risk‑free interest rate (annualised, decimal)
        q: dividend yield (annualised, decimal)
        sigma: volatility (annualised, decimal)
        option_type: 'C' for call or 'P' for put
    """
    if T <= 0 or sigma <= 0:
        # Option has expired or zero volatility: intrinsic value
        if option_type == "C":
            return max(S - K, 0.0)
        else:
            return max(K - S, 0.0)
    d1 = (math.log(S / K) + (r - q + 0.5 * sigma * sigma) * T) / (sigma * math.sqrt(T))
    d2 = d1 - sigma * math.sqrt(T)
    if option_type == "C":
        price = S * math.exp(-q * T) * norm_cdf(d1) - K * math.exp(-r * T) * norm_cdf(d2)
    else:
        price = K * math.exp(-r * T) * norm_cdf(-d2) - S * math.exp(-q * T) * norm_cdf(-d1)
    return price


def greeks(
    S: float,
    K: float,
    T: float,
    r: float,
    q: float,
    sigma: float,
    option_type: str,
) -> Tuple[float, float, float, float, float, float]:
    """Computes Black–Scholes Greeks (delta, gamma, theta, vega, rho, price)."""
    if T <= 0 or sigma <= 0:
        price = black_scholes_price(S, K, T, r, q, sigma, option_type)
        delta = 1.0 if (option_type == "C" and S > K) else -1.0
        gamma = 0.0
        theta = 0.0
        vega = 0.0
        rho = 0.0
        return delta, gamma, theta, vega, rho, price
    d1 = (math.log(S / K) + (r - q + 0.5 * sigma * sigma) * T) / (sigma * math.sqrt(T))
    d2 = d1 - sigma * math.sqrt(T)
    pdf = norm_pdf(d1)
    if option_type == "C":
        delta = math.exp(-q * T) * norm_cdf(d1)
        theta = (
            - (S * pdf * sigma * math.exp(-q * T)) / (2 * math.sqrt(T))
            - r * K * math.exp(-r * T) * norm_cdf(d2)
            + q * S * math.exp(-q * T) * norm_cdf(d1)
        )
        rho = K * T * math.exp(-r * T) * norm_cdf(d2)
    else:
        delta = -math.exp(-q * T) * norm_cdf(-d1)
        theta = (
            - (S * pdf * sigma * math.exp(-q * T)) / (2 * math.sqrt(T))
            + r * K * math.exp(-r * T) * norm_cdf(-d2)
            - q * S * math.exp(-q * T) * norm_cdf(-d1)
        )
        rho = -K * T * math.exp(-r * T) * norm_cdf(-d2)
    gamma = (math.exp(-q * T) * pdf) / (S * sigma * math.sqrt(T))
    vega = S * math.exp(-q * T) * pdf * math.sqrt(T)
    price = black_scholes_price(S, K, T, r, q, sigma, option_type)
    return delta, gamma, theta, vega, rho, price


def implied_volatility(
    market_price: float,
    S: float,
    K: float,
    T: float,
    r: float,
    q: float,
    option_type: str,
    initial_guess: float = 0.25,
    tolerance: float = 1e-4,
    max_iterations: int = 100,
) -> float:
    """Estimates implied volatility using the Newton–Raphson method."""
    sigma = max(initial_guess, 1e-4)
    for _ in range(max_iterations):
        # Compute price and vega at current sigma
        delta_, gamma_, theta_, vega_, rho_, price = greeks(S, K, T, r, q, sigma, option_type)
        diff = price - market_price
        if abs(diff) < tolerance:
            return max(sigma, 0.0001)
        # Avoid division by zero
        if vega_ == 0:
            break
        sigma -= diff / (vega_ / 100)
        # Keep sigma within reasonable bounds
        sigma = max(min(sigma, 5.0), 1e-4)
    return max(sigma, 0.0001)


@dataclass
class OptionGreeks:
    """Data class representing option price and Greeks."""

    option_symbol: str
    expiry: datetime.date
    strike: float
    option_type: str
    underlying_price: float
    implied_volatility: float
    option_price: float
    delta: float
    gamma: float
    theta: float
    vega: float
    rho: float
    intrinsic_value: float
    time_value: float
    entry_price: float
    stop_price: float
    target_price: float
    risk_reward: float
    position_size: int


def compute_option_metrics(
    option_symbol: str,
    underlying_price: float,
    r: float,
    q: float,
    iv_guess: float,
    risk_reward: float,
    position_size: int,
    stop_underlying: float,
    target_underlying: float,
    risk_per_trade: float,
) -> OptionGreeks:
    """Computes implied volatility, Greeks and option price targets for a given option symbol.

    Args:
        option_symbol: e.g. "NIFTY250417C24000"
        underlying_price: current price of the underlying index
        r: risk free rate (percentage)
        q: dividend yield (percentage)
        iv_guess: initial implied volatility guess (decimal)
        risk_reward: risk/reward ratio
        position_size: number of lots/contracts to trade
        stop_underlying: stop loss level on underlying
        target_underlying: target level on underlying
        risk_per_trade: capital risk per trade (monetary)

    Returns:
        An OptionGreeks instance populated with pricing and Greeks.
    """
    underlying, expiry_date, strike, opt_type = parse_option_symbol(option_symbol)
    today = datetime.date.today()
    T = max((expiry_date - today).days, 0) / 365.0
    # Compute implied volatility by matching current market option price.  For this example
    # we do not have a live option price, so we approximate it using the initial guess.
    sigma = max(iv_guess, 0.0001)
    delta_, gamma_, theta_, vega_, rho_, price = greeks(underlying_price, strike, T, r / 100.0, q / 100.0, sigma, opt_type)
    # Compute intrinsic and time value
    intrinsic = max(underlying_price - strike, 0.0) if opt_type == "C" else max(strike - underlying_price, 0.0)
    time_value = max(price - intrinsic, 0.0)
    # Translate stop/target from underlying to option price using delta and gamma.  We ignore gamma for simplicity.
    option_stop = price - abs(underlying_price - stop_underlying) * abs(delta_)
    option_target = price + abs(target_underlying - underlying_price) * abs(delta_)
    # Ensure stop and target are not negative
    option_stop = max(option_stop, 0.01)
    option_target = max(option_target, option_stop + 0.01)
    return OptionGreeks(
        option_symbol=option_symbol,
        expiry=expiry_date,
        strike=strike,
        option_type=opt_type,
        underlying_price=underlying_price,
        implied_volatility=sigma,
        option_price=price,
        delta=delta_,
        gamma=gamma_,
        theta=theta_,
        vega=vega_,
        rho=rho_,
        intrinsic_value=intrinsic,
        time_value=time_value,
        entry_price=price,
        stop_price=option_stop,
        target_price=option_target,
        risk_reward=risk_reward,
        position_size=position_size,
    )