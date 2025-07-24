/**
 * Trading Settings Types
 * Comprehensive configuration interfaces for all trading parameters
 */

// Core Trading Settings
export interface CoreTradingSettings {
  strikeSelectionMode: 'closest_atm' | 'itm_100' | 'otm_100' | 'manual' | 'ticker';
  tradeDirection: 'auto' | 'buy' | 'sell';
  riskRewardRatio: number;
  scenarioOverride?: string;
  tickerSymbol?: string;
  tickerFormat?: 'tradingview' | 'nse';
}

// Manual Option Trade Settings
export interface ManualOptionSettings {
  optionType: 'call' | 'put';
  strike: number;
  optionLTP: number;
  expiry: {
    day: number;
    month: number;
    year: number;
  };
}

// Greeks Configuration
export interface GreeksSettings {
  riskFreeRate: number;
  dividendYield: number;
  ivCalculation: {
    iterations: number;
    tolerance: number;
    initialGuess: number;
  };
  filters: {
    deltaMin?: number;
    deltaMax?: number;
    vegaMin?: number;
    vegaMax?: number;
    ivMin?: number;
    ivMax?: number;
  };
  thetaExit: boolean;
  gammaAdjust: boolean;
  ivAlerts: boolean;
  showVolatilityBand: boolean;
  ivRankPeriod: number;
}

// Dashboard Display Settings
export interface DashboardSettings {
  blocks: {
    marketInfo: boolean;
    optionParams: boolean;
    greeks: boolean;
    priceAnalysis: boolean;
    proTip: boolean;
  };
  colors: {
    frame: string;
    header: string;
    text: string;
    profit: string;
    loss: string;
    neutral: string;
  };
  potentialEntryToggle: boolean;
}

// Label Settings
export interface LabelSettings {
  showLabels: boolean;
  showValues: boolean;
  offset: number;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
}

// CPR & Pivot Settings
export interface CPRPivotSettings {
  showPDH_PDL: boolean;
  showCPR: boolean;
  showDailyPivots: boolean;
  showWeeklyPivots: boolean;
  showMonthlyPivots: boolean;
  thresholds: {
    narrow: number;
    wide: number;
  };
  lineStyles: {
    cpr: {
      color: string;
      width: number;
      style: 'solid' | 'dashed' | 'dotted';
    };
    pivots: {
      color: string;
      width: number;
      style: 'solid' | 'dashed' | 'dotted';
    };
  };
}

// EMA Settings
export interface EMASettings {
  periods: {
    ema9: { enabled: boolean; color: string };
    ema21: { enabled: boolean; color: string };
    ema50: { enabled: boolean; color: string };
    ema200: { enabled: boolean; color: string };
  };
  lineWidth: number;
}

// Other Technical Settings
export interface OtherTechnicalSettings {
  volumeThreshold: number;
  confirmationMode: boolean;
  confirmationCandles: number;
  rsiSettings: {
    enabled: boolean;
    period: number;
    overbought: number;
    oversold: number;
  };
  stochasticSettings: {
    enabled: boolean;
    kPeriod: number;
    dPeriod: number;
    smooth: number;
  };
  orbSettings: {
    enabled: boolean;
    openingRangeMinutes: number;
  };
  atrPeriod: number;
  reversalSettings: {
    enabled: boolean;
    lookbackPeriods: number;
  };
  gapThresholds: {
    small: number;
    medium: number;
    large: number;
  };
  consolidationPercent: number;
  nr7Lookback: number;
}

// Budget & Risk Management
export interface BudgetRiskSettings {
  maxBudget: number;
  maxLossPerTrade: number; // percentage
  positionSizing: 'FIXED' | 'PERCENTAGE' | 'KELLY' | 'VOLATILITY';
  stopLossType: 'PERCENTAGE' | 'ATR' | 'SUPPORT_RESISTANCE';
  takeProfitMultiplier: number;
  trailingStopLoss: boolean;
  maxOpenPositions: number;
  dailyLossLimit: number;
  weeklyLossLimit: number;
  monthlyLossLimit: number;
}

// Broker Integration Settings
export interface BrokerSettings {
  selectedBroker: 'zerodha' | 'dhan' | null;
  credentials: {
    zerodha?: {
      apiKey: string;
      apiSecret: string;
      accessToken?: string;
    };
    dhan?: {
      clientId: string;
      accessToken: string;
    };
  };
  autoTrade: boolean;
  paperTrade: boolean;
  orderConfirmation: boolean;
}

// Chart Settings
export interface ChartSettings {
  timeframe: '1m' | '5m' | '15m' | '30m' | '1h' | '1d';
  candleType: 'CANDLES' | 'HEIKIN_ASHI' | 'LINE' | 'AREA';
  theme: 'DARK' | 'LIGHT';
  gridLines: boolean;
  crosshair: boolean;
  zoom: boolean;
  pan: boolean;
  annotations: boolean;
  overlays: {
    vwap: boolean;
    bollinger: boolean;
    fibonacciRetracements: boolean;
    supportResistance: boolean;
  };
}

// Notification Settings
export interface NotificationSettings {
  signalAlerts: boolean;
  priceAlerts: boolean;
  riskAlerts: boolean;
  orderAlerts: boolean;
  sound: boolean;
  browser: boolean;
  email: boolean;
  webhook?: string;
}

// Indicator Settings
export interface IndicatorSettings {
  cpr: {
    enabled: boolean;
    pivot: boolean;
    bc: boolean;
    tc: boolean;
    r1: boolean;
    r2: boolean;
    r3: boolean;
    s1: boolean;
    s2: boolean;
    s3: boolean;
  };
  pivots: {
    daily: boolean;
    weekly: boolean;
    monthly: boolean;
    r1: boolean;
    r2: boolean;
    r3: boolean;
    s1: boolean;
    s2: boolean;
    s3: boolean;
  };
  ema: {
    ema9: { enabled: boolean; color: string; };
    ema21: { enabled: boolean; color: string; };
    ema50: { enabled: boolean; color: string; };
    ema200: { enabled: boolean; color: string; };
  };
  vwap: {
    enabled: boolean;
    color: string;
  };
  rsi: {
    enabled: boolean;
    period: number;
    overbought: number;
    oversold: number;
  };
  stochastic: {
    enabled: boolean;
    kPeriod: number;
    dPeriod: number;
    smooth: number;
  };
}

// Complete Settings Interface
export interface TradingSettings {
  core: CoreTradingSettings;
  manual: ManualOptionSettings;
  greeks: GreeksSettings;
  dashboard: DashboardSettings;
  labels: LabelSettings;
  cprPivots: CPRPivotSettings;
  ema: EMASettings;
  technical: OtherTechnicalSettings;
  indicators: IndicatorSettings;
  budgetRisk: BudgetRiskSettings;
  broker: BrokerSettings;
  chart: ChartSettings;
  notifications: NotificationSettings;
}

// Settings Presets
export interface SettingsPreset {
  id: string;
  name: string;
  description: string;
  settings: Partial<TradingSettings>;
  isDefault?: boolean;
}

// Settings Categories for UI Organization
export const SETTINGS_CATEGORIES = {
  CORE: 'Core Trading',
  MANUAL: 'Manual Trading',
  GREEKS: 'Greeks Configuration',
  DASHBOARD: 'Dashboard Display',
  LABELS: 'Chart Labels',
  CPR_PIVOTS: 'CPR & Pivots',
  EMA: 'EMA Settings',
  TECHNICAL: 'Technical Indicators',
  BUDGET_RISK: 'Budget & Risk',
  BROKER: 'Broker Integration',
  CHART: 'Chart Configuration',
  NOTIFICATIONS: 'Notifications'
} as const;

export type SettingsCategory = keyof typeof SETTINGS_CATEGORIES;
