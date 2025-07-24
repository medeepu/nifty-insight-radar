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
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

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
  (response) => response.data,
  (error) => {
    console.error('API Error:', error);
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
      return apiClient.get(`/price/current?symbol=${symbol}`);
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

// Indicators
export const useIndicators = (symbol: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.INDICATORS, symbol],
    queryFn: async (): Promise<IndicatorData> => {
      return apiClient.get(`/indicators?symbol=${symbol}`);
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
      return apiClient.get(`/signal/current?symbol=${symbol}`);
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
      return apiClient.get(`/greeks?optionSymbol=${optionSymbol}`);
    },
    enabled: !!optionSymbol,
    refetchInterval: 5000, // Update every 5 seconds
  });
};

// ML Insights
export const useMLInsight = (symbol: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ML_INSIGHT, symbol],
    queryFn: async (): Promise<MLInsight> => {
      return apiClient.get(`/ml/insight?symbol=${symbol}`);
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

// User Settings
export const useUserSettings = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER_SETTINGS],
    queryFn: async (): Promise<UserSettings> => {
      return apiClient.get('/user/settings');
    },
    staleTime: Infinity, // Cache indefinitely
  });
};

// Mutation Hooks

// Backtesting
export const useBacktest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (request: BacktestRequest): Promise<BacktestResult> => {
      return apiClient.post('/backtest', request);
    },
    onSuccess: () => {
      // Invalidate related queries if needed
      queryClient.invalidateQueries({ queryKey: ['backtest'] });
    },
  });
};

// User Settings
export const useUpdateUserSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (settings: UserSettings): Promise<{ ok: boolean }> => {
      return apiClient.post('/user/settings', settings);
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
    
    // You can add toast notifications here
    const message = error?.response?.data?.message || error?.message || 'An unexpected error occurred';
    
    // TODO: Add toast notification
    console.error('Error message:', message);
    
    return message;
  };
  
  return { handleError };
};