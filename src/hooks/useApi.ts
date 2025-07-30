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
export const useCurrentSignal = (symbol: string, timeframe: string = '5m') => {
  return useQuery({
    queryKey: [QUERY_KEYS.SIGNAL, symbol, timeframe],
    queryFn: async (): Promise<SignalData> => {
      const response = await apiClient.get(`/signal/current?symbol=${symbol}&timeframe=${timeframe}`);
      
      return {
        signal: response.data.signal, // Server now returns 'BUY'/'SELL'/'NEUTRAL' directly
        scenario: response.data.scenario,
        entry_price: response.data.entry_price,
        stop_price: response.data.stop_price,
        target_price: response.data.target_price,
        risk_reward: response.data.risk_reward,
        timestamp: response.data.timestamp,
        reason: response.data.reason,
        confidence: response.data.confidence,
        position_size: response.data.position_size,
        
        // Client-friendly aliases for backward compatibility
        entry: response.data.entry_price,
        sl: response.data.stop_price,
        tp: response.data.target_price,
        rr: response.data.risk_reward,
        proTip: response.data.reason || 'No additional information available',
      };
    },
    enabled: !!symbol,
    refetchInterval: 10000, // Update every 10 seconds
  });
};

// Greeks Data - Enhanced with optional parameters
export const useGreeks = (
  optionSymbol: string, 
  options?: {
    riskFreeRate?: number;
    dividendYield?: number;
    ivGuess?: number;
    daysToExpiry?: number;
  }
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GREEKS, optionSymbol, options],
    queryFn: async (): Promise<GreeksData> => {
      const params = new URLSearchParams({
        optionSymbol,
        ...(options?.riskFreeRate !== undefined && { riskFreeRate: options.riskFreeRate.toString() }),
        ...(options?.dividendYield !== undefined && { dividendYield: options.dividendYield.toString() }),
        ...(options?.ivGuess !== undefined && { ivGuess: options.ivGuess.toString() }),
        ...(options?.daysToExpiry !== undefined && { daysToExpiry: options.daysToExpiry.toString() }),
      });
      
      const response = await apiClient.get(`/greeks?${params}`);
      
      // Handle case where server returns error or no data
      if (!response.data) {
        throw new Error('No Greeks data available');
      }
      
      return {
        // Server fields - keep original names  
        option_symbol: response.data.option_symbol,
        expiry: response.data.expiry,
        strike: response.data.strike,
        option_type: response.data.option_type,
        underlying_price: response.data.underlying_price,
        implied_volatility: response.data.implied_volatility,
        option_price: response.data.option_price,
        delta: response.data.delta,
        gamma: response.data.gamma,
        theta: response.data.theta,
        vega: response.data.vega,
        rho: response.data.rho,
        intrinsic_value: response.data.intrinsic_value,
        time_value: response.data.time_value,
        entry_price: response.data.entry_price,
        stop_price: response.data.stop_price,
        target_price: response.data.target_price,
        risk_reward: response.data.risk_reward,
        position_size: response.data.position_size,
        moneyness_percent: response.data.moneyness_percent,
        status: response.data.status,
        iv_rank: response.data.iv_rank,
        market_option_price: response.data.market_option_price,
        theoreticalPrice: response.data.theoreticalPrice,
        breakEven: response.data.breakEven,
        maxProfit: response.data.maxProfit,
        maxLoss: response.data.maxLoss,
        
        // Client-friendly aliases for backward compatibility
        iv: response.data.implied_volatility,
        intrinsicValue: response.data.intrinsic_value,
        timeValue: response.data.time_value,
        moneynessPercent: response.data.moneyness_percent,
      };
    },
    enabled: !!optionSymbol,
    refetchInterval: 30000, // Update every 30 seconds to avoid excessive requests
    retry: 3,
    retryDelay: 1000,
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

// User Settings - Updated to use new /settings endpoint
export const useUserSettings = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER_SETTINGS],
    queryFn: async (): Promise<UserSettings> => {
      const response = await apiClient.get('/settings');
      return response.data;
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

// User Settings Update - Updated to use new /settings endpoint with deep merge
export const useUpdateUserSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (settings: Partial<UserSettings>): Promise<UserSettings> => {
      // Send only changed fields to leverage server-side deep merge
      const response = await apiClient.put('/settings', settings);
      return response.data;
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
