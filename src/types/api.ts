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
  entry: number;
  sl: number; // stop loss
  tp: number; // take profit
  rr: number; // risk reward ratio
  timestamp: string;
  proTip: string;
  confidence?: number;
}

// Greeks
export interface GreeksData {
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
  iv: number; // implied volatility
  theoreticalPrice: number;
  intrinsicValue: number;
  timeValue: number;
  status: 'ATM' | 'ITM' | 'OTM';
  moneynessPercent: number;
  breakEven: number;
  maxProfit: number | typeof Infinity;
  maxLoss: number;
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

// User Settings - Updated to match server flat structure
export interface UserSettings {
  // Basic settings (flat structure as per server)
  risk_capital: number;
  risk_per_trade: number;
  default_timeframe: string;
  advanced_filters: Record<string, any>;
  indicator_prefs: Record<string, any>;
  
  // Client-side computed nested structure for UI
  theme?: 'light' | 'dark';
  defaultSymbol?: string;
  defaultTimeframe?: string;
  riskSettings?: {
    maxBudget: number;
    maxLossPerTrade: number;
    riskRewardRatio: number;
  };
  displaySettings?: {
    showCPR: boolean;
    showEMA: boolean;
    showVWAP: boolean;
    showPivots: boolean;
  };
  notifications?: {
    signalAlerts: boolean;
    riskAlerts: boolean;
  };
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