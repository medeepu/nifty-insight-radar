/**
 * TypeScript API Contracts for Nifty Options Trading Platform
 * These interfaces define the expected payloads from the backend server
 */

// Base Types
export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
  timestamp: string;
}

// Price Data
export interface PriceData {
  symbol: string;
  close: number; // standardized from lastPrice
  time: string;
  change?: number;
  changePercent?: number;
}

export interface Candle {
  time: string | number; // unix timestamp or ISO8601
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface CandleData {
  candles: Candle[];
  symbol: string;
  timeframe: string;
}

// Chart Configuration Parameters
export interface ChartParameters {
  atrPeriod: number;
  orbWindow: number;
  emaPeriods: number[];
  vwapEnabled: boolean;
  rsiPeriod: number;
  stochKPeriod: number;
  stochDPeriod: number;
}

// Levels & Pivots
export interface DailyLevels {
  pivot: number;
  bc: number; // bottom central
  tc: number; // top central
  s1: number;
  s2: number;
  s3: number;
  r1: number;
  r2: number;
  r3: number;
  prevHigh: number;
  prevLow: number;
}

export type WeeklyLevels = DailyLevels;
export type MonthlyLevels = DailyLevels;

// Indicators - Now expects full history arrays from backend
export interface IndicatorData {
  timestamp?: string;
  symbol?: string;
  ema: {
    9: Array<{ time: string | number; value: number }> | number;
    21: Array<{ time: string | number; value: number }> | number;
    50: Array<{ time: string | number; value: number }> | number;
    200: Array<{ time: string | number; value: number }> | number;
  };
  vwap: Array<{ time: string | number; value: number }> | number;
  rsi: Array<{ time: string | number; value: number }> | number;
  stoch: {
    k: Array<{ time: string | number; value: number }> | number;
    d: Array<{ time: string | number; value: number }> | number;
  };
  atr: Array<{ time: string | number; value: number }> | number;
  ivRank?: number;
}

// Signals
export type SignalType = 'BUY' | 'SELL' | 'NEUTRAL';

export interface SignalData {
  signal: SignalType;
  scenario: string;
  entry_price: number; // Updated to match server field
  stop_price: number; // Updated to match server field  
  target_price: number; // Updated to match server field
  risk_reward: number; // Updated to match server field
  timestamp: string;
  reason?: string; // Updated to match server field
  confidence: number; // Now required from server
  position_size: number; // New from server
  
  // Client-friendly aliases for backward compatibility
  entry?: number;
  sl?: number;
  tp?: number; 
  rr?: number;
  proTip?: string;
}

// Greeks - Updated to match server response exactly
export interface GreeksData {
  option_symbol: string;
  expiry: string; // date
  strike: number;
  option_type: string;
  underlying_price: number;
  implied_volatility: number; // server field name
  option_price: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
  intrinsic_value: number; // server field name
  time_value: number; // server field name
  entry_price: number;
  stop_price: number;
  target_price: number;
  risk_reward: number;
  position_size: number;
  moneyness_percent: number; // server field name
  status: 'ATM' | 'ITM' | 'OTM';
  iv_rank?: number; // server field name, optional
  market_option_price?: number;
  theoreticalPrice?: number; // client-friendly alias
  breakEven?: number; // client-friendly alias
  maxProfit?: number | null; // client-friendly alias
  maxLoss?: number; // client-friendly alias
  
  // Client-side computed properties for backward compatibility
  iv?: number;
  intrinsicValue?: number;
  timeValue?: number;
  moneynessPercent?: number;
}

// Backtesting
export interface BacktestRequest {
  symbol: string;
  from: string;
  to: string;
  timeframe: string;
  paramsOverride?: Record<string, any>;
}

export interface BacktestStats {
  totalPnL: number;
  winRate: number;
  maxDD: number; // max drawdown
  avgRR: number; // average risk reward
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  profitFactor: number;
  sharpeRatio?: number;
}

export interface BacktestTrade {
  id: string;
  dateIn: string;
  dateOut: string;
  entry: number;
  exit: number;
  sl: number;
  tp: number;
  rr: number;
  pnl: number;
  scenario: string;
  direction: 'LONG' | 'SHORT';
}

export interface BacktestResult {
  stats: BacktestStats;
  equityCurve: Array<{ t: string; value: number }>;
  trades: BacktestTrade[];
}

// ML Insights
export interface MLInsight {
  regime: string;
  confidence: number;
  notes: string[];
  timestamp: string;
}

// Logs
export interface LogEntry {
  ts: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  data?: Record<string, any>;
}

export interface LogsResponse {
  logs: LogEntry[];
  total: number;
}

// User Settings - Updated to match new server nested structure
export interface UserSettings {
  theme?: 'light' | 'dark';
  defaultSymbol?: string;
  defaultTimeframe?: string;
  riskSettings?: Record<string, any>;
  displaySettings?: Record<string, any>;
  notifications?: Record<string, any>;
  indicatorPreferences?: Record<string, any>;
  chartConfiguration?: Record<string, any>;
  brokerSettings?: Record<string, any>;
}

// Update Settings Request (partial updates)
export interface UpdateUserSettings {
  theme?: string;
  defaultSymbol?: string;
  defaultTimeframe?: string;
  riskSettings?: Record<string, any>;
  displaySettings?: Record<string, any>;
  notifications?: Record<string, any>;
  indicatorPreferences?: Record<string, any>;
  chartConfiguration?: Record<string, any>;
  brokerSettings?: Record<string, any>;
}

// Broker Integration
export interface BrokerCredentials {
  broker: 'zerodha' | 'dhan';
  apiKey: string;
  secret: string;
  token?: string;
}

export interface TradeOrder {
  broker: string;
  side: 'BUY' | 'SELL';
  instrument: string;
  qty: number;
  type: 'MARKET' | 'LIMIT';
  price?: number;
}

export interface TradeOrderResponse {
  orderId: string;
  status: 'PLACED' | 'FILLED' | 'REJECTED' | 'CANCELLED';
  message?: string;
}

// WebSocket Messages
export interface WSPriceMessage {
  type: 'price';
  data: PriceData;
}

export interface WSSignalMessage {
  type: 'signal';
  data: SignalData;
}

export interface WSLogMessage {
  type: 'log';
  data: LogEntry;
}

export type WSMessage = WSPriceMessage | WSSignalMessage | WSLogMessage;

// Chart Configuration
export interface ChartAnnotation {
  type: 'line' | 'text' | 'area';
  value: number | number[];
  label: string;
  color: string;
  strokeDashArray?: number;
}

export interface ChartOverlay {
  name: string;
  type: 'line' | 'area' | 'histogram';
  data: number[];
  color: string;
  visible: boolean;
}