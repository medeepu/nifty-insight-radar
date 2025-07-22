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
  lastPrice: number;
  timestamp: string;
  change?: number;
  changePercent?: number;
}

export interface Candle {
  t: string; // timestamp
  o: number; // open
  h: number; // high
  l: number; // low
  c: number; // close
  v: number; // volume
}

export interface CandleData {
  candles: Candle[];
  symbol: string;
  timeframe: string;
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

// Indicators
export interface IndicatorData {
  ema: {
    9: number;
    21: number;
    50: number;
    200: number;
  };
  vwap: number;
  rsi: number;
  stoch: {
    k: number;
    d: number;
  };
  atr: number;
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

// User Settings
export interface UserSettings {
  theme: 'light' | 'dark';
  defaultSymbol: string;
  defaultTimeframe: string;
  riskSettings: {
    maxBudget: number;
    maxLossPerTrade: number;
    riskRewardRatio: number;
  };
  displaySettings: {
    showCPR: boolean;
    showEMA: boolean;
    showVWAP: boolean;
    showPivots: boolean;
  };
  notifications: {
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