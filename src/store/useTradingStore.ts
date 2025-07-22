/**
 * Zustand Store for Trading Data
 * Real-time trading state management
 */

import { create } from 'zustand';
import { PriceData, SignalData, IndicatorData, GreeksData } from '../types/api';

interface TradingStore {
  // Current Data
  currentPrice: PriceData | null;
  currentSignal: SignalData | null;
  indicators: IndicatorData | null;
  greeks: GreeksData | null;
  
  // Chart Data
  candles: any[];
  chartAnnotations: any[];
  
  // Connection Status
  isConnected: boolean;
  isLoading: boolean;
  lastUpdate: string | null;
  
  // UI State
  selectedSymbol: string;
  selectedTimeframe: string;
  chartType: 'candlestick' | 'line' | 'area';
  
  // Actions
  setCurrentPrice: (price: PriceData) => void;
  setCurrentSignal: (signal: SignalData) => void;
  setIndicators: (indicators: IndicatorData) => void;
  setGreeks: (greeks: GreeksData) => void;
  setCandles: (candles: any[]) => void;
  addAnnotation: (annotation: any) => void;
  clearAnnotations: () => void;
  
  // Connection Actions
  setConnected: (connected: boolean) => void;
  setLoading: (loading: boolean) => void;
  
  // UI Actions
  setSelectedSymbol: (symbol: string) => void;
  setSelectedTimeframe: (timeframe: string) => void;
  setChartType: (type: 'candlestick' | 'line' | 'area') => void;
  
  // Computed Values
  getSignalColor: () => string;
  getRiskRewardRatio: () => number;
  getPotentialProfit: () => number;
  getPotentialLoss: () => number;
}

export const useTradingStore = create<TradingStore>((set, get) => ({
  // Initial State
  currentPrice: null,
  currentSignal: null,
  indicators: null,
  greeks: null,
  candles: [],
  chartAnnotations: [],
  
  isConnected: false,
  isLoading: false,
  lastUpdate: null,
  
  selectedSymbol: 'NIFTY',
  selectedTimeframe: '5m',
  chartType: 'candlestick',
  
  // Data Actions
  setCurrentPrice: (price: PriceData) => {
    set({
      currentPrice: price,
      lastUpdate: new Date().toISOString(),
    });
  },
  
  setCurrentSignal: (signal: SignalData) => {
    set({
      currentSignal: signal,
      lastUpdate: new Date().toISOString(),
    });
  },
  
  setIndicators: (indicators: IndicatorData) => {
    set({
      indicators,
      lastUpdate: new Date().toISOString(),
    });
  },
  
  setGreeks: (greeks: GreeksData) => {
    set({
      greeks,
      lastUpdate: new Date().toISOString(),
    });
  },
  
  setCandles: (candles: any[]) => {
    set({ candles });
  },
  
  addAnnotation: (annotation: any) => {
    set((state) => ({
      chartAnnotations: [...state.chartAnnotations, annotation],
    }));
  },
  
  clearAnnotations: () => {
    set({ chartAnnotations: [] });
  },
  
  // Connection Actions
  setConnected: (connected: boolean) => {
    set({ isConnected: connected });
  },
  
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
  
  // UI Actions
  setSelectedSymbol: (symbol: string) => {
    set({ selectedSymbol: symbol });
  },
  
  setSelectedTimeframe: (timeframe: string) => {
    set({ selectedTimeframe: timeframe });
  },
  
  setChartType: (type: 'candlestick' | 'line' | 'area') => {
    set({ chartType: type });
  },
  
  // Computed Values
  getSignalColor: () => {
    const signal = get().currentSignal;
    if (!signal) return 'hsl(var(--muted))';
    
    switch (signal.signal) {
      case 'BUY':
        return 'hsl(var(--bull-green))';
      case 'SELL':
        return 'hsl(var(--bear-red))';
      default:
        return 'hsl(var(--neutral-yellow))';
    }
  },
  
  getRiskRewardRatio: () => {
    const signal = get().currentSignal;
    return signal?.rr || 0;
  },
  
  getPotentialProfit: () => {
    const signal = get().currentSignal;
    if (!signal) return 0;
    return signal.tp - signal.entry;
  },
  
  getPotentialLoss: () => {
    const signal = get().currentSignal;
    if (!signal) return 0;
    return signal.entry - signal.sl;
  },
}));