/**
 * Zustand Store for Chart Management
 * Handles multiple charts and their individual settings
 */

import { create } from 'zustand';

export interface ChartIndicator {
  id: string;
  name: string;
  type: 'overlay' | 'oscillator';
  enabled: boolean;
  subSettings?: Record<string, boolean>;
}

export interface Chart {
  id: string;
  symbol: string;
  timeframe: string;
  indicators: ChartIndicator[];
  height: number;
  order: number;
}

interface ChartStore {
  charts: Chart[];
  activeChart: string | null;
  availableSymbols: string[];
  availableTimeframes: string[];
  
  // Actions
  addChart: (symbol: string, timeframe?: string) => void;
  removeChart: (chartId: string) => void;
  updateChart: (chartId: string, updates: Partial<Chart>) => void;
  toggleIndicator: (chartId: string, indicatorId: string) => void;
  toggleIndicatorSubSetting: (chartId: string, indicatorId: string, settingKey: string) => void;
  reorderCharts: (charts: Chart[]) => void;
  setActiveChart: (chartId: string) => void;
}

const createDefaultIndicators = (): ChartIndicator[] => [
  {
    id: 'cpr',
    name: 'CPR',
    type: 'overlay',
    enabled: false,
    subSettings: {
      pivot: true,
      centralTop: true,
      centralBottom: true,
      r1: false,
      r2: false,
      r3: false,
      s1: false,
      s2: false,
      s3: false,
    }
  },
  {
    id: 'ema-9',
    name: 'EMA 9',
    type: 'overlay',
    enabled: false,
  },
  {
    id: 'ema-21',
    name: 'EMA 21',
    type: 'overlay',
    enabled: false,
  },
  {
    id: 'ema-50',
    name: 'EMA 50',
    type: 'overlay',
    enabled: false,
  },
  {
    id: 'ema-200',
    name: 'EMA 200',
    type: 'overlay',
    enabled: false,
  },
  {
    id: 'vwap',
    name: 'VWAP',
    type: 'overlay',
    enabled: false,
  },
  {
    id: 'pivot-levels',
    name: 'Pivot Levels',
    type: 'overlay',
    enabled: false,
    subSettings: {
      daily: true,
      weekly: false,
      monthly: false,
    }
  },
  {
    id: 'rsi',
    name: 'RSI',
    type: 'oscillator',
    enabled: false,
  },
  {
    id: 'stochastic',
    name: 'Stochastic',
    type: 'oscillator',
    enabled: false,
  },
];

export const useChartStore = create<ChartStore>((set, get) => ({
  charts: [
    {
      id: 'default-chart',
      symbol: 'NIFTY',
      timeframe: '5m',
      indicators: createDefaultIndicators(),
      height: 600,
      order: 0,
    }
  ],
  activeChart: 'default-chart',
  availableSymbols: ['NIFTY', 'BANKNIFTY', 'FINNIFTY', 'MIDCPNIFTY', 'SENSEX'],
  availableTimeframes: ['1m', '3m', '5m', '15m', '30m', '1h', '4h', '1d'],

  addChart: (symbol: string, timeframe = '5m') => {
    const charts = get().charts;
    const newChart: Chart = {
      id: `chart-${Date.now()}`,
      symbol,
      timeframe,
      indicators: createDefaultIndicators(),
      height: 600,
      order: charts.length,
    };
    
    set({
      charts: [...charts, newChart],
      activeChart: newChart.id,
    });
  },

  removeChart: (chartId: string) => {
    const charts = get().charts.filter(chart => chart.id !== chartId);
    const activeChart = get().activeChart;
    
    set({
      charts,
      activeChart: activeChart === chartId ? (charts[0]?.id || null) : activeChart,
    });
  },

  updateChart: (chartId: string, updates: Partial<Chart>) => {
    const charts = get().charts.map(chart =>
      chart.id === chartId ? { ...chart, ...updates } : chart
    );
    set({ charts });
  },

  toggleIndicator: (chartId: string, indicatorId: string) => {
    const charts = get().charts.map(chart => {
      if (chart.id === chartId) {
        const indicators = chart.indicators.map(indicator =>
          indicator.id === indicatorId
            ? { ...indicator, enabled: !indicator.enabled }
            : indicator
        );
        return { ...chart, indicators };
      }
      return chart;
    });
    set({ charts });
  },

  toggleIndicatorSubSetting: (chartId: string, indicatorId: string, settingKey: string) => {
    const charts = get().charts.map(chart => {
      if (chart.id === chartId) {
        const indicators = chart.indicators.map(indicator => {
          if (indicator.id === indicatorId && indicator.subSettings) {
            return {
              ...indicator,
              subSettings: {
                ...indicator.subSettings,
                [settingKey]: !indicator.subSettings[settingKey],
              },
            };
          }
          return indicator;
        });
        return { ...chart, indicators };
      }
      return chart;
    });
    set({ charts });
  },

  reorderCharts: (charts: Chart[]) => {
    set({ charts });
  },

  setActiveChart: (chartId: string) => {
    set({ activeChart: chartId });
  },
}));