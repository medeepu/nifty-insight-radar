/**
 * Advanced Indicator Settings Component
 * Granular control over all chart indicators
 */

import React from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { TrendingUp, BarChart3, Activity } from 'lucide-react';
import { CompactToggleWidget } from './CompactToggleWidget';

export const IndicatorSettings: React.FC = () => {
  const { settings, updateSettings } = useSettingsStore();

  // CPR Toggle Items
  const cprItems = [
    {
      id: 'cpr-enabled',
      label: 'Enable CPR',
      checked: settings.indicators.cpr.enabled,
      onChange: (checked: boolean) => updateSettings('indicators.cpr.enabled', checked)
    },
    {
      id: 'cpr-pivot',
      label: 'Central Pivot (P)',
      checked: settings.indicators.cpr.pivot,
      onChange: (checked: boolean) => updateSettings('indicators.cpr.pivot', checked),
      color: settings.cprPivots.lineStyles.cpr.color,
      onColorChange: (color: string) => updateSettings('cprPivots.lineStyles.cpr.color', color),
      lineStyle: settings.cprPivots.lineStyles.cpr.style,
      onLineStyleChange: (style: string) => updateSettings('cprPivots.lineStyles.cpr.style', style)
    },
    {
      id: 'cpr-bc',
      label: 'Bottom Central (BC)',
      checked: settings.indicators.cpr.bc,
      onChange: (checked: boolean) => updateSettings('indicators.cpr.bc', checked),
      color: settings.cprPivots.lineStyles.cpr.color,
      onColorChange: (color: string) => updateSettings('cprPivots.lineStyles.cpr.color', color),
      lineStyle: settings.cprPivots.lineStyles.cpr.style,
      onLineStyleChange: (style: string) => updateSettings('cprPivots.lineStyles.cpr.style', style)
    },
    {
      id: 'cpr-tc',
      label: 'Top Central (TC)',
      checked: settings.indicators.cpr.tc,
      onChange: (checked: boolean) => updateSettings('indicators.cpr.tc', checked),
      color: settings.cprPivots.lineStyles.cpr.color,
      onColorChange: (color: string) => updateSettings('cprPivots.lineStyles.cpr.color', color),
      lineStyle: settings.cprPivots.lineStyles.cpr.style,
      onLineStyleChange: (style: string) => updateSettings('cprPivots.lineStyles.cpr.style', style)
    },
    {
      id: 'cpr-r1',
      label: 'Resistance 1 (R1)',
      checked: settings.indicators.cpr.r1,
      onChange: (checked: boolean) => updateSettings('indicators.cpr.r1', checked),
      color: settings.cprPivots.lineStyles.pivots.color,
      onColorChange: (color: string) => updateSettings('cprPivots.lineStyles.pivots.color', color),
      lineStyle: settings.cprPivots.lineStyles.pivots.style,
      onLineStyleChange: (style: string) => updateSettings('cprPivots.lineStyles.pivots.style', style)
    },
    {
      id: 'cpr-r2',
      label: 'Resistance 2 (R2)',
      checked: settings.indicators.cpr.r2,
      onChange: (checked: boolean) => updateSettings('indicators.cpr.r2', checked),
      color: settings.cprPivots.lineStyles.pivots.color,
      onColorChange: (color: string) => updateSettings('cprPivots.lineStyles.pivots.color', color),
      lineStyle: settings.cprPivots.lineStyles.pivots.style,
      onLineStyleChange: (style: string) => updateSettings('cprPivots.lineStyles.pivots.style', style)
    },
    {
      id: 'cpr-r3',
      label: 'Resistance 3 (R3)',
      checked: settings.indicators.cpr.r3,
      onChange: (checked: boolean) => updateSettings('indicators.cpr.r3', checked),
      color: settings.cprPivots.lineStyles.pivots.color,
      onColorChange: (color: string) => updateSettings('cprPivots.lineStyles.pivots.color', color),
      lineStyle: settings.cprPivots.lineStyles.pivots.style,
      onLineStyleChange: (style: string) => updateSettings('cprPivots.lineStyles.pivots.style', style)
    },
    {
      id: 'cpr-s1',
      label: 'Support 1 (S1)',
      checked: settings.indicators.cpr.s1,
      onChange: (checked: boolean) => updateSettings('indicators.cpr.s1', checked),
      color: settings.cprPivots.lineStyles.pivots.color,
      onColorChange: (color: string) => updateSettings('cprPivots.lineStyles.pivots.color', color),
      lineStyle: settings.cprPivots.lineStyles.pivots.style,
      onLineStyleChange: (style: string) => updateSettings('cprPivots.lineStyles.pivots.style', style)
    },
    {
      id: 'cpr-s2',
      label: 'Support 2 (S2)',
      checked: settings.indicators.cpr.s2,
      onChange: (checked: boolean) => updateSettings('indicators.cpr.s2', checked),
      color: settings.cprPivots.lineStyles.pivots.color,
      onColorChange: (color: string) => updateSettings('cprPivots.lineStyles.pivots.color', color),
      lineStyle: settings.cprPivots.lineStyles.pivots.style,
      onLineStyleChange: (style: string) => updateSettings('cprPivots.lineStyles.pivots.style', style)
    },
    {
      id: 'cpr-s3',
      label: 'Support 3 (S3)',
      checked: settings.indicators.cpr.s3,
      onChange: (checked: boolean) => updateSettings('indicators.cpr.s3', checked),
      color: settings.cprPivots.lineStyles.pivots.color,
      onColorChange: (color: string) => updateSettings('cprPivots.lineStyles.pivots.color', color),
      lineStyle: settings.cprPivots.lineStyles.pivots.style,
      onLineStyleChange: (style: string) => updateSettings('cprPivots.lineStyles.pivots.style', style)
    }
  ];

  // Pivot Toggle Items (Weekly/Monthly)
  const pivotItems = [
    {
      id: 'weekly-pivots',
      label: 'Weekly Pivots',
      description: 'Show weekly pivot levels',
      checked: settings.cprPivots.showWeeklyPivots,
      onChange: (checked: boolean) => updateSettings('cprPivots.showWeeklyPivots', checked),
      color: settings.cprPivots.lineStyles.pivots.color,
      onColorChange: (color: string) => updateSettings('cprPivots.lineStyles.pivots.color', color),
      lineStyle: settings.cprPivots.lineStyles.pivots.style,
      onLineStyleChange: (style: string) => updateSettings('cprPivots.lineStyles.pivots.style', style)
    },
    {
      id: 'monthly-pivots',
      label: 'Monthly Pivots',
      description: 'Show monthly pivot levels',
      checked: settings.cprPivots.showMonthlyPivots,
      onChange: (checked: boolean) => updateSettings('cprPivots.showMonthlyPivots', checked),
      color: settings.cprPivots.lineStyles.pivots.color,
      onColorChange: (color: string) => updateSettings('cprPivots.lineStyles.pivots.color', color),
      lineStyle: settings.cprPivots.lineStyles.pivots.style,
      onLineStyleChange: (style: string) => updateSettings('cprPivots.lineStyles.pivots.style', style)
    },
    {
      id: 'pdh-pdl',
      label: 'Previous Day H/L',
      description: 'Previous Day High/Low levels',
      checked: settings.cprPivots.showPDH_PDL,
      onChange: (checked: boolean) => updateSettings('cprPivots.showPDH_PDL', checked),
      color: settings.cprPivots.lineStyles.pivots.color,
      onColorChange: (color: string) => updateSettings('cprPivots.lineStyles.pivots.color', color),
      lineStyle: settings.cprPivots.lineStyles.pivots.style,
      onLineStyleChange: (style: string) => updateSettings('cprPivots.lineStyles.pivots.style', style)
    }
  ];

  // EMA Toggle Items
  const emaItems = [
    {
      id: 'ema-9',
      label: 'EMA 9',
      checked: settings.indicators.ema.ema9.enabled,
      onChange: (checked: boolean) => updateSettings('indicators.ema.ema9.enabled', checked),
      color: settings.indicators.ema.ema9.color,
      onColorChange: (color: string) => updateSettings('indicators.ema.ema9.color', color),
      lineStyle: 'solid',
      onLineStyleChange: () => {}
    },
    {
      id: 'ema-21',
      label: 'EMA 21',
      checked: settings.indicators.ema.ema21.enabled,
      onChange: (checked: boolean) => updateSettings('indicators.ema.ema21.enabled', checked),
      color: settings.indicators.ema.ema21.color,
      onColorChange: (color: string) => updateSettings('indicators.ema.ema21.color', color),
      lineStyle: 'solid',
      onLineStyleChange: () => {}
    },
    {
      id: 'ema-50',
      label: 'EMA 50',
      checked: settings.indicators.ema.ema50.enabled,
      onChange: (checked: boolean) => updateSettings('indicators.ema.ema50.enabled', checked),
      color: settings.indicators.ema.ema50.color,
      onColorChange: (color: string) => updateSettings('indicators.ema.ema50.color', color),
      lineStyle: 'solid',
      onLineStyleChange: () => {}
    },
    {
      id: 'ema-200',
      label: 'EMA 200',
      checked: settings.indicators.ema.ema200.enabled,
      onChange: (checked: boolean) => updateSettings('indicators.ema.ema200.enabled', checked),
      color: settings.indicators.ema.ema200.color,
      onColorChange: (color: string) => updateSettings('indicators.ema.ema200.color', color),
      lineStyle: 'solid',
      onLineStyleChange: () => {}
    }
  ];

  // Other Indicators Toggle Items
  const otherItems = [
    {
      id: 'rsi-enabled',
      label: 'RSI',
      description: 'Relative Strength Index',
      checked: settings.indicators.rsi.enabled,
      onChange: (checked: boolean) => updateSettings('indicators.rsi.enabled', checked),
      color: '#f59e0b',
      onColorChange: () => {},
      lineStyle: 'solid',
      onLineStyleChange: () => {}
    },
    {
      id: 'stochastic-enabled',
      label: 'Stochastic',
      description: 'Stochastic Oscillator',
      checked: settings.indicators.stochastic.enabled,
      onChange: (checked: boolean) => updateSettings('indicators.stochastic.enabled', checked),
      color: '#8b5cf6',
      onColorChange: () => {},
      lineStyle: 'solid',
      onLineStyleChange: () => {}
    },
    {
      id: 'vwap-enabled',
      label: 'VWAP',
      description: 'Volume Weighted Average Price',
      checked: settings.indicators.vwap.enabled,
      onChange: (checked: boolean) => updateSettings('indicators.vwap.enabled', checked),
      color: settings.indicators.vwap.color,
      onColorChange: (color: string) => updateSettings('indicators.vwap.color', color),
      lineStyle: 'dashed',
      onLineStyleChange: () => {}
    }
  ];

  // Display Settings Toggle Items
  const displayItems = [
    {
      id: 'market-info-block',
      label: 'Market Info',
      description: 'Show market information block',
      checked: settings.dashboard.blocks.marketInfo,
      onChange: (checked: boolean) => updateSettings('dashboard.blocks.marketInfo', checked)
    },
    {
      id: 'option-params-block',
      label: 'Option Parameters',
      description: 'Show option parameters block',
      checked: settings.dashboard.blocks.optionParams,
      onChange: (checked: boolean) => updateSettings('dashboard.blocks.optionParams', checked)
    },
    {
      id: 'greeks-block',
      label: 'Greeks',
      description: 'Show Greeks analysis block',
      checked: settings.dashboard.blocks.greeks,
      onChange: (checked: boolean) => updateSettings('dashboard.blocks.greeks', checked)
    },
    {
      id: 'price-analysis-block',
      label: 'Price Analysis',
      description: 'Show price analysis block',
      checked: settings.dashboard.blocks.priceAnalysis,
      onChange: (checked: boolean) => updateSettings('dashboard.blocks.priceAnalysis', checked)
    },
    {
      id: 'pro-tip-block',
      label: 'Pro Tip',
      description: 'Show pro tip block',
      checked: settings.dashboard.blocks.proTip,
      onChange: (checked: boolean) => updateSettings('dashboard.blocks.proTip', checked)
    },
    {
      id: 'potential-entry-toggle',
      label: 'Potential Entry Zone',
      description: 'Show potential entry zone overlay',
      checked: settings.dashboard.potentialEntryToggle,
      onChange: (checked: boolean) => updateSettings('dashboard.potentialEntryToggle', checked)
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CompactToggleWidget
          title="CPR (Central Pivot Range)"
          icon={<Activity className="h-4 w-4" />}
          items={cprItems}
          columns={1}
        />
        
        <CompactToggleWidget
          title="Pivot Levels"
          icon={<Activity className="h-4 w-4" />}
          items={pivotItems}
          columns={1}
        />
        
        <CompactToggleWidget
          title="Moving Averages"
          icon={<TrendingUp className="h-4 w-4" />}
          items={emaItems}
          columns={1}
        />
        
        <CompactToggleWidget
          title="Technical Indicators"
          icon={<BarChart3 className="h-4 w-4" />}
          items={otherItems}
          columns={1}
        />
      </div>
      
      <CompactToggleWidget
        title="Dashboard Display Settings"
        icon={<BarChart3 className="h-4 w-4" />}
        items={displayItems}
        columns={2}
      />
    </div>
  );
};
