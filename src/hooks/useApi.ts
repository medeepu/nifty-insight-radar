/**
 * React Query Hooks for API Endpoints
 * Centralized data fetching with caching and error handling
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { 
  PriceData, 
  CandleData, 
  DailyLevels, 
  IndicatorData, 
  SignalData, 
  GreeksData,
  BacktestRequest,
  BacktestResult,
  MLInsight,
  LogsResponse,
  UserSettings,
  BrokerCredentials,
  TradeOrder,
  TradeOrderResponse
} from '../types/api';

// API Base Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // Handle both wrapped and unwrapped responses
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    // Show toast notification for errors
    import('@/hooks/use-toast').then(({ toast }) => {
      const message = error?.response?.data?.message || error?.message || 'An unexpected error occurred';
      toast({
        title: "API Error",
        description: message,
        variant: "destructive",
      });
    });
    
    throw error;
  }
);

// Query Keys
export const QUERY_KEYS = {
  PRICE: 'price',
  CANDLES: 'candles',
  LEVELS: 'levels',
  INDICATORS: 'indicators',
  SIGNAL: 'signal',
  GREEKS: 'greeks',
  ML_INSIGHT: 'mlInsight',
  LOGS: 'logs',
  USER_SETTINGS: 'userSettings',
} as const;

// Custom Hooks

// Price Data
export const useCurrentPrice = (symbol: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRICE, symbol],
    queryFn: async (): Promise<PriceData> => {
      const response = await apiClient.get(`/price/current?symbol=${symbol}`);
      // Transform server response to match client expectations
      return {
        symbol: response.data.symbol,
        close: response.data.price, // Server uses 'price', client expects 'close'
        time: response.data.timestamp,
        change: 0, // Server doesn't provide this, set default
        changePercent: 0 // Server doesn't provide this, set default
      };
    },
    refetchInterval: 1000, // Update every second
    enabled: !!symbol,
  });
};

// Candle Data
export const useCandles = (symbol: string, timeframe: string, start?: string, end?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CANDLES, symbol, timeframe, start, end],
    queryFn: async (): Promise<CandleData> => {
      const params = new URLSearchParams({
        symbol,
        tf: timeframe,
        ...(start && { start }),
        ...(end && { end }),
      });
      return apiClient.get(`/candles?${params}`);
    },
    enabled: !!(symbol && timeframe),
    staleTime: 5000, // 5 seconds
  });
};

// Levels Data
export const useDailyLevels = (symbol: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.LEVELS, 'daily', symbol],
    queryFn: async (): Promise<DailyLevels> => {
      return apiClient.get(`/levels/daily?symbol=${symbol}`);
    },
    enabled: !!symbol,
    staleTime: 60000, // 1 minute
  });
};

export const useWeeklyLevels = (symbol: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.LEVELS, 'weekly', symbol],
    queryFn: async (): Promise<DailyLevels> => {
      return apiClient.get(`/levels/weekly?symbol=${symbol}`);
    },
    enabled: !!symbol,
    staleTime: 300000, // 5 minutes
  });
};

export const useMonthlyLevels = (symbol: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.LEVELS, 'monthly', symbol],
    queryFn: async (): Promise<DailyLevels> => {
      return apiClient.get(`/levels/monthly?symbol=${symbol}`);
    },
    enabled: !!symbol,
    staleTime: 3600000, // 1 hour
  });
};

// Indicators - Handle both single values and arrays
export const useIndicators = (symbol: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.INDICATORS, symbol],
    queryFn: async (): Promise<IndicatorData> => {
      const response = await apiClient.get(`/indicators?symbol=${symbol}`);
      // Transform server response to handle both single values and arrays
      const transformIndicatorValue = (value: any) => {
        if (typeof value === 'number') {
          // Server returns single value, convert to array format for consistency
          const timestamp = new Date().getTime();
          return [{ time: timestamp, value }];
        }
        return value; // Already in array format
      };

      return {
        timestamp: response.data.timestamp,
        symbol: response.data.symbol,
        ema: {
          9: transformIndicatorValue(response.data.ema9),
          21: transformIndicatorValue(response.data.ema21),
          50: transformIndicatorValue(response.data.ema50),
          200: transformIndicatorValue(response.data.ema200),
        },
        vwap: transformIndicatorValue(response.data.vwap),
        rsi: transformIndicatorValue(response.data.rsi),
        stoch: {
          k: transformIndicatorValue(response.data.stoch_k),
          d: transformIndicatorValue(response.data.stoch_d),
        },
        atr: transformIndicatorValue(response.data.atr),
        ivRank: response.data.ivRank,
      };
    },
    enabled: !!symbol,
    refetchInterval: 5000, // Update every 5 seconds
  });
};

// Signal Data
export const useCurrentSignal = (symbol: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SIGNAL, symbol],
    queryFn: async (): Promise<SignalData> => {
      const response = await apiClient.get(`/signal/current?symbol=${symbol}`);
      // Transform server response to match client expectations
      return {
        signal: response.data.direction === 'long' ? 'BUY' : 
                response.data.direction === 'short' ? 'SELL' : 'NEUTRAL',
        scenario: response.data.scenario,
        entry: response.data.entry_price,
        sl: response.data.stop_price,
        tp: response.data.target_price,
        rr: response.data.risk_reward,
        timestamp: response.data.timestamp,
        proTip: response.data.reason || 'No additional information available',
        confidence: response.data.confidence * 100 // Convert to percentage
      };
    },
    enabled: !!symbol,
    refetchInterval: 10000, // Update every 10 seconds
  });
};

// Greeks Data
export const useGreeks = (optionSymbol: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GREEKS, optionSymbol],
    queryFn: async (): Promise<GreeksData> => {
      const response = await apiClient.get(`/greeks?optionSymbol=${optionSymbol}`);
      // Transform server response to match client expectations
      return {
        delta: response.data.delta,
        gamma: response.data.gamma,
        theta: response.data.theta,
        vega: response.data.vega,
        rho: response.data.rho,
        iv: response.data.implied_volatility, // Server uses 'implied_volatility'
        theoreticalPrice: response.data.option_price, // Server uses 'option_price'
        intrinsicValue: response.data.intrinsic_value,
        timeValue: response.data.time_value,
        status: response.data.underlying_price > response.data.strike ? 'ITM' : 
                response.data.underlying_price < response.data.strike ? 'OTM' : 'ATM',
        moneynessPercent: ((response.data.underlying_price - response.data.strike) / response.data.strike) * 100
      };
    },
    enabled: !!optionSymbol,
    //refetchInterval: 5000, // Update every 5 seconds
  });
};

// ML Insights - Transform server response to match client expectations
export const useMLInsight = (symbol: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ML_INSIGHT, symbol],
    queryFn: async (): Promise<MLInsight> => {
      const response = await apiClient.get(`/ml/insight?symbol=${symbol}`);
      // Transform server response to match client expectations
      return {
        regime: response.data.regime,
        confidence: response.data.rsi || 50, // Use RSI as confidence if not provided
        notes: [
          `Slope: ${response.data.slope?.toFixed(4) || 'N/A'}`,
          `RSI: ${response.data.rsi?.toFixed(2) || 'N/A'}`,
          `Market regime classification based on price slope and momentum`
        ],
        timestamp: response.data.timestamp,
      };
    },
    enabled: !!symbol,
    staleTime: 60000, // 1 minute
  });
};

// Logs
export const useRecentLogs = (limit: number = 100) => {
  return useQuery({
    queryKey: [QUERY_KEYS.LOGS, limit],
    queryFn: async (): Promise<LogsResponse> => {
      return apiClient.get(`/logs/recent?limit=${limit}`);
    },
    refetchInterval: 30000, // Update every 30 seconds
  });
};

// User Settings - Transform server flat structure to client nested structure
export const useUserSettings = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER_SETTINGS],
    queryFn: async (): Promise<UserSettings> => {
      const response = await apiClient.get('/user/settings');
      const serverData = response.data;
      
      // Transform server's flat structure to client's expected nested structure
      return {
        // Server fields (keep original for API calls)
        risk_capital: serverData.risk_capital || 0,
        risk_per_trade: serverData.risk_per_trade || 1000,
        default_timeframe: serverData.default_timeframe || '5m',
        advanced_filters: serverData.advanced_filters || {},
        indicator_prefs: serverData.indicator_prefs || {},
        
        // Client-side nested structure for UI
        theme: serverData.advanced_filters?.theme || 'dark',
        defaultSymbol: serverData.advanced_filters?.defaultSymbol || 'NIFTY',
        defaultTimeframe: serverData.default_timeframe || '5m',
        riskSettings: {
          maxBudget: serverData.risk_capital || 100000,
          maxLossPerTrade: serverData.risk_per_trade || 1000,
          riskRewardRatio: serverData.advanced_filters?.minRiskRewardRatio || 2.0,
        },
        displaySettings: {
          showCPR: serverData.indicator_prefs?.showCPR !== false,
          showEMA: serverData.indicator_prefs?.showEMA !== false,
          showVWAP: serverData.indicator_prefs?.showVWAP !== false,
          showPivots: serverData.indicator_prefs?.showPivots !== false,
        },
        notifications: {
          signalAlerts: serverData.advanced_filters?.signalAlerts !== false,
          riskAlerts: serverData.advanced_filters?.riskAlerts !== false,
        },
      };
    },
    staleTime: Infinity, // Cache indefinitely
  });
};

// Mutation Hooks

// Backtesting - Transform server response to match client expectations
export const useBacktest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (request: BacktestRequest): Promise<BacktestResult> => {
      // Transform request to match server's expected format
      const serverRequest = {
        symbol: request.symbol,
        from_date: request.from, // Server expects 'from_date' 
        to_date: request.to,     // Server expects 'to_date'
        timeframe: request.timeframe,
        paramsOverride: request.paramsOverride
      };
      
      const response = await apiClient.post('/backtest', serverRequest);
      
      // Transform server response to match client expectations
      return {
        stats: {
          totalPnL: response.data.net_pnl,
          winRate: response.data.win_rate,
          maxDD: 0, // Server doesn't provide this yet
          avgRR: 2.0, // Default value
          totalTrades: response.data.total_trades,
          winningTrades: response.data.winning_trades,
          losingTrades: response.data.losing_trades,
          profitFactor: response.data.winning_trades / Math.max(response.data.losing_trades, 1),
          sharpeRatio: 0, // Server doesn't provide this yet
        },
        equityCurve: [], // Server doesn't provide this yet - return empty array
        trades: response.data.trades.map((trade: any) => ({
          id: `${trade.entry_time}_${trade.side}`,
          dateIn: trade.entry_time,
          dateOut: trade.exit_time,
          entry: trade.entry_price,
          exit: trade.exit_price,
          sl: trade.entry_price, // Approximation
          tp: trade.exit_price,  // Approximation
          rr: Math.abs(trade.exit_price - trade.entry_price) / Math.abs(trade.entry_price * 0.02),
          pnl: trade.pnl,
          scenario: 'Generated',
          direction: trade.side.toUpperCase() as 'LONG' | 'SHORT'
        }))
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backtest'] });
    },
  });
};

// User Settings Update - Transform client nested structure to server flat structure
export const useUpdateUserSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (settings: UserSettings): Promise<{ ok: boolean }> => {
      // Transform client's nested structure to server's expected flat structure
      const serverPayload = {
        risk_capital: settings.riskSettings?.maxBudget || settings.risk_capital || 0,
        risk_per_trade: settings.riskSettings?.maxLossPerTrade || settings.risk_per_trade || 1000,
        default_timeframe: settings.defaultTimeframe || settings.default_timeframe || '5m',
        advanced_filters: {
          ...settings.advanced_filters,
          theme: settings.theme || 'dark',
          defaultSymbol: settings.defaultSymbol || 'NIFTY',
          minRiskRewardRatio: settings.riskSettings?.riskRewardRatio || 2.0,
          signalAlerts: settings.notifications?.signalAlerts !== false,
          riskAlerts: settings.notifications?.riskAlerts !== false,
        },
        indicator_prefs: {
          ...settings.indicator_prefs,
          showCPR: settings.displaySettings?.showCPR !== false,
          showEMA: settings.displaySettings?.showEMA !== false,
          showVWAP: settings.displaySettings?.showVWAP !== false,
          showPivots: settings.displaySettings?.showPivots !== false,
        },
      };
      
      return apiClient.post('/user/settings', serverPayload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_SETTINGS] });
    },
  });
};

// Broker Credentials
export const useUpdateBrokerCredentials = () => {
  return useMutation({
    mutationFn: async (credentials: BrokerCredentials): Promise<{ ok: boolean }> => {
      return apiClient.post('/broker/keys', credentials);
    },
  });
};

// Trade Execution
export const useExecuteTrade = () => {
  return useMutation({
    mutationFn: async (order: TradeOrder): Promise<TradeOrderResponse> => {
      return apiClient.post('/trade/execute', order);
    },
  });
};

// Error Handling Hook
export const useApiError = () => {
  const handleError = (error: any) => {
    console.error('API Error:', error);
    
    const message = error?.response?.data?.message || error?.message || 'An unexpected error occurred';
    
    // Import and use toast
    import('@/hooks/use-toast').then(({ toast }) => {
      toast({
        title: "API Error",
        description: message,
        variant: "destructive",
      });
    });
    
    return message;
  };
  
  return { handleError };
};
