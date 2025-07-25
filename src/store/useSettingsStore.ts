/**
 * Zustand Store for Trading Settings
 * Centralized state management for all trading configuration
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TradingSettings, SettingsPreset } from '../types/settings';

interface SettingsStore {
  // Current settings
  settings: TradingSettings;
  
  // Presets
  presets: SettingsPreset[];
  activePresetId: string | null;
  
  // UI State
  settingsOpen: boolean;
  activeCategory: string;
  unsavedChanges: boolean;
  
  // Actions
  updateSettings: (path: string, value: any) => void;
  resetSettings: () => void;
  loadPreset: (presetId: string) => void;
  savePreset: (name: string, description: string) => void;
  deletePreset: (presetId: string) => void;
  
  // UI Actions
  setSettingsOpen: (open: boolean) => void;
  setActiveCategory: (category: string) => void;
  markUnsavedChanges: (hasChanges: boolean) => void;
  
  // Persistence
  saveToServer: () => Promise<void>;
  loadFromServer: () => Promise<void>;
}

// Default Settings Configuration
const DEFAULT_SETTINGS: TradingSettings = {
  core: {
    strikeSelectionMode: 'closest_atm',
    tradeDirection: 'auto',
    riskRewardRatio: 2.0,
  },
  manual: {
    optionType: 'call',
    strike: 0,
    optionLTP: 0,
    expiry: {
      day: new Date().getDate(),
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    },
  },
  greeks: {
    riskFreeRate: 6.5,
    dividendYield: 1.5,
    ivCalculation: {
      iterations: 100,
      tolerance: 0.001,
      initialGuess: 0.2,
    },
    filters: {},
    thetaExit: false,
    gammaAdjust: false,
    ivAlerts: true,
    showVolatilityBand: true,
    ivRankPeriod: 252,
  },
  dashboard: {
    blocks: {
      marketInfo: true,
      optionParams: true,
      greeks: true,
      priceAnalysis: true,
      proTip: true,
    },
    colors: {
      frame: '#1a1a1a',
      header: '#2a2a2a',
      text: '#ffffff',
      profit: '#22c55e',
      loss: '#ef4444',
      neutral: '#fbbf24',
    },
    potentialEntryToggle: true,
  },
  labels: {
    showLabels: true,
    showValues: true,
    offset: 10,
    fontSize: 12,
    fontWeight: 'normal',
  },
  cprPivots: {
    showPDH_PDL: true,
    showCPR: true,
    showDailyPivots: true,
    showWeeklyPivots: true,
    showMonthlyPivots: false,
    thresholds: {
      narrow: 0.5,
      wide: 1.5,
    },
    lineStyles: {
      cpr: {
        color: '#fbbf24',
        width: 1,
        style: 'solid',
      },
      pivots: {
        color: '#06b6d4',
        width: 1,
        style: 'dashed',
      },
    },
  },
  ema: {
    periods: {
      ema9: { enabled: true, color: '#f97316' },
      ema21: { enabled: true, color: '#06b6d4' },
      ema50: { enabled: true, color: '#8b5cf6' },
      ema200: { enabled: false, color: '#ef4444' },
    },
    lineWidth: 2,
  },
  technical: {
    volumeThreshold: 100000,
    confirmationMode: false,
    confirmationCandles: 3,
    rsiSettings: {
      enabled: true,
      period: 14,
      overbought: 70,
      oversold: 30,
    },
    stochasticSettings: {
      enabled: false,
      kPeriod: 14,
      dPeriod: 3,
      smooth: 3,
    },
    orbSettings: {
      enabled: true,
      openingRangeMinutes: 15,
    },
    atrPeriod: 14,
    reversalSettings: {
      enabled: true,
      lookbackPeriods: 5,
    },
    gapThresholds: {
      small: 0.5,
      medium: 1.0,
      large: 2.0,
    },
    consolidationPercent: 1.0,
    nr7Lookback: 7,
  },
  indicators: {
    cpr: {
      enabled: true,
      pivot: { enabled: true, color: '#fbbf24', thickness: 2, style: 'solid' },
      bc: { enabled: true, color: '#3b82f6', thickness: 2, style: 'solid' },
      tc: { enabled: true, color: '#3b82f6', thickness: 2, style: 'solid' },
      r1: { enabled: true, color: '#ef4444', thickness: 1, style: 'dashed' },
      r2: { enabled: false, color: '#dc2626', thickness: 1, style: 'dashed' },
      r3: { enabled: false, color: '#b91c1c', thickness: 1, style: 'dashed' },
      s1: { enabled: true, color: '#22c55e', thickness: 1, style: 'dashed' },
      s2: { enabled: false, color: '#16a34a', thickness: 1, style: 'dashed' },
      s3: { enabled: false, color: '#15803d', thickness: 1, style: 'dashed' },
    },
    pivots: {
      daily: { enabled: true, color: '#06b6d4', thickness: 1, style: 'solid' },
      weekly: { enabled: true, color: '#8b5cf6', thickness: 1, style: 'dotted' },
      monthly: { enabled: false, color: '#ec4899', thickness: 1, style: 'dotted' },
      r1: { enabled: true, color: '#ef4444', thickness: 1, style: 'dashed' },
      r2: { enabled: false, color: '#dc2626', thickness: 1, style: 'dashed' },
      r3: { enabled: false, color: '#b91c1c', thickness: 1, style: 'dashed' },
      s1: { enabled: true, color: '#22c55e', thickness: 1, style: 'dashed' },
      s2: { enabled: false, color: '#16a34a', thickness: 1, style: 'dashed' },
      s3: { enabled: false, color: '#15803d', thickness: 1, style: 'dashed' },
    },
    ema: {
      ema9: { enabled: true, color: '#f97316', thickness: 2, style: 'solid' },
      ema21: { enabled: true, color: '#06b6d4', thickness: 2, style: 'solid' },
      ema50: { enabled: true, color: '#8b5cf6', thickness: 2, style: 'solid' },
      ema200: { enabled: false, color: '#ef4444', thickness: 2, style: 'solid' },
    },
    vwap: {
      enabled: true,
      color: '#fbbf24',
      thickness: 2,
      style: 'solid',
    },
    rsi: {
      enabled: true,
      period: 14,
      overbought: 70,
      oversold: 30,
      color: '#8b5cf6',
      thickness: 1,
      style: 'solid',
    },
    stochastic: {
      enabled: false,
      kPeriod: 14,
      dPeriod: 3,
      smooth: 3,
      color: '#06b6d4',
      thickness: 1,
      style: 'solid',
    },
    previousDayHL: {
      enabled: true,
      high: { enabled: true, color: '#ef4444', thickness: 1, style: 'dash-dot' },
      low: { enabled: true, color: '#22c55e', thickness: 1, style: 'dash-dot' },
    },
  },
  budgetRisk: {
    maxBudget: 100000,
    maxLossPerTrade: 2,
    positionSizing: 'PERCENTAGE',
    stopLossType: 'PERCENTAGE',
    takeProfitMultiplier: 2,
    trailingStopLoss: false,
    maxOpenPositions: 3,
    dailyLossLimit: 5,
    weeklyLossLimit: 10,
    monthlyLossLimit: 20,
  },
  broker: {
    selectedBroker: null,
    credentials: {},
    autoTrade: false,
    paperTrade: true,
    orderConfirmation: true,
  },
  chart: {
    timeframe: '5m',
    candleType: 'CANDLES',
    theme: 'DARK',
    gridLines: true,
    crosshair: true,
    zoom: true,
    pan: true,
    annotations: true,
    overlays: {
      vwap: true,
      bollinger: false,
      fibonacciRetracements: false,
      supportResistance: true,
    },
  },
  notifications: {
    signalAlerts: true,
    priceAlerts: true,
    riskAlerts: true,
    orderAlerts: true,
    sound: true,
    browser: true,
    email: false,
  },
};

// Helper function to set nested object values
const setNestedValue = (obj: any, path: string, value: any) => {
  const keys = path.split('.');
  let current = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      // Initial State
      settings: DEFAULT_SETTINGS,
      presets: [],
      activePresetId: null,
      settingsOpen: false,
      activeCategory: 'CORE',
      unsavedChanges: false,
      
      // Settings Actions
      updateSettings: (path: string, value: any) => {
        set((state) => {
          const newSettings = { ...state.settings };
          setNestedValue(newSettings, path, value);
          
          return {
            settings: newSettings,
            unsavedChanges: true,
            activePresetId: null, // Clear active preset when manually editing
          };
        });
      },
      
      resetSettings: () => {
        set({
          settings: DEFAULT_SETTINGS,
          activePresetId: null,
          unsavedChanges: false,
        });
      },
      
      loadPreset: (presetId: string) => {
        const preset = get().presets.find(p => p.id === presetId);
        if (preset) {
          set((state) => ({
            settings: { ...state.settings, ...preset.settings },
            activePresetId: presetId,
            unsavedChanges: false,
          }));
        }
      },
      
      savePreset: (name: string, description: string) => {
        const newPreset: SettingsPreset = {
          id: Date.now().toString(),
          name,
          description,
          settings: get().settings,
        };
        
        set((state) => ({
          presets: [...state.presets, newPreset],
          activePresetId: newPreset.id,
          unsavedChanges: false,
        }));
      },
      
      deletePreset: (presetId: string) => {
        set((state) => ({
          presets: state.presets.filter(p => p.id !== presetId),
          activePresetId: state.activePresetId === presetId ? null : state.activePresetId,
        }));
      },
      
      // UI Actions
      setSettingsOpen: (open: boolean) => {
        set({ settingsOpen: open });
      },
      
      setActiveCategory: (category: string) => {
        set({ activeCategory: category });
      },
      
      markUnsavedChanges: (hasChanges: boolean) => {
        set({ unsavedChanges: hasChanges });
      },
      
      // Server Persistence
      saveToServer: async () => {
        try {
          // TODO: Implement API call to save settings
          console.log('Saving settings to server...', get().settings);
          set({ unsavedChanges: false });
        } catch (error) {
          console.error('Failed to save settings:', error);
        }
      },
      
      loadFromServer: async () => {
        try {
          // TODO: Implement API call to load settings
          console.log('Loading settings from server...');
        } catch (error) {
          console.error('Failed to load settings:', error);
        }
      },
    }),
    {
      name: 'trading-settings',
      partialize: (state) => ({
        settings: state.settings,
        presets: state.presets,
        activePresetId: state.activePresetId,
      }),
    }
  )
);