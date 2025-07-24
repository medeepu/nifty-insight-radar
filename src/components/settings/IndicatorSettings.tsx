/**
 * Advanced Indicator Settings Component
 * Granular control over all chart indicators with independent styling
 */

import React from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { TrendingUp, BarChart3, Activity } from 'lucide-react';
import { CompactToggleWidget } from './CompactToggleWidget';

export const IndicatorSettings: React.FC = () => {
  const { settings, updateSettings } = useSettingsStore();

  // CPR Toggle Items with individual styling
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
      checked: settings.indicators.cpr.pivot.enabled,
      onChange: (checked: boolean) => updateSettings('indicators.cpr.pivot.enabled', checked),
      color: settings.indicators.cpr.pivot.color,
      onColorChange: (color: string) => updateSettings('indicators.cpr.pivot.color', color),
      lineStyle: settings.indicators.cpr.pivot.style,
      onLineStyleChange: (style: string) => updateSettings('indicators.cpr.pivot.style', style),
      thickness: settings.indicators.cpr.pivot.thickness,
      onThicknessChange: (thickness: number) => updateSettings('indicators.cpr.pivot.thickness', thickness)
    },
    {
      id: 'cpr-bc',
      label: 'Bottom Central (BC)',
      checked: settings.indicators.cpr.bc.enabled,
      onChange: (checked: boolean) => updateSettings('indicators.cpr.bc.enabled', checked),
      color: settings.indicators.cpr.bc.color,
      onColorChange: (color: string) => updateSettings('indicators.cpr.bc.color', color),
      lineStyle: settings.indicators.cpr.bc.style,
      onLineStyleChange: (style: string) => updateSettings('indicators.cpr.bc.style', style),
      thickness: settings.indicators.cpr.bc.thickness,
      onThicknessChange: (thickness: number) => updateSettings('indicators.cpr.bc.thickness', thickness)
    },
    {
      id: 'cpr-tc',
      label: 'Top Central (TC)',
      checked: settings.indicators.cpr.tc.enabled,
      onChange: (checked: boolean) => updateSettings('indicators.cpr.tc.enabled', checked),
      color: settings.indicators.cpr.tc.color,
      onColorChange: (color: string) => updateSettings('indicators.cpr.tc.color', color),
      lineStyle: settings.indicators.cpr.tc.style,
      onLineStyleChange: (style: string) => updateSettings('indicators.cpr.tc.style', style),
      thickness: settings.indicators.cpr.tc.thickness,
      onThicknessChange: (thickness: number) => updateSettings('indicators.cpr.tc.thickness', thickness)
    },
    {
      id: 'cpr-r1',
      label: 'Resistance 1 (R1)',
      checked: settings.indicators.cpr.r1.enabled,
      onChange: (checked: boolean) => updateSettings('indicators.cpr.r1.enabled', checked),
      color: settings.indicators.cpr.r1.color,
      onColorChange: (color: string) => updateSettings('indicators.cpr.r1.color', color),
      lineStyle: settings.indicators.cpr.r1.style,
      onLineStyleChange: (style: string) => updateSettings('indicators.cpr.r1.style', style),
      thickness: settings.indicators.cpr.r1.thickness,
      onThicknessChange: (thickness: number) => updateSettings('indicators.cpr.r1.thickness', thickness)
    },
    {
      id: 'cpr-r2',
      label: 'Resistance 2 (R2)',
      checked: settings.indicators.cpr.r2.enabled,
      onChange: (checked: boolean) => updateSettings('indicators.cpr.r2.enabled', checked),
      color: settings.indicators.cpr.r2.color,
      onColorChange: (color: string) => updateSettings('indicators.cpr.r2.color', color),
      lineStyle: settings.indicators.cpr.r2.style,
      onLineStyleChange: (style: string) => updateSettings('indicators.cpr.r2.style', style),
      thickness: settings.indicators.cpr.r2.thickness,
      onThicknessChange: (thickness: number) => updateSettings('indicators.cpr.r2.thickness', thickness)
    },
    {
      id: 'cpr-r3',
      label: 'Resistance 3 (R3)',
      checked: settings.indicators.cpr.r3.enabled,
      onChange: (checked: boolean) => updateSettings('indicators.cpr.r3.enabled', checked),
      color: settings.indicators.cpr.r3.color,
      onColorChange: (color: string) => updateSettings('indicators.cpr.r3.color', color),
      lineStyle: settings.indicators.cpr.r3.style,
      onLineStyleChange: (style: string) => updateSettings('indicators.cpr.r3.style', style),
      thickness: settings.indicators.cpr.r3.thickness,
      onThicknessChange: (thickness: number) => updateSettings('indicators.cpr.r3.thickness', thickness)
    },
    {
      id: 'cpr-s1',
      label: 'Support 1 (S1)',
      checked: settings.indicators.cpr.s1.enabled,
      onChange: (checked: boolean) => updateSettings('indicators.cpr.s1.enabled', checked),
      color: settings.indicators.cpr.s1.color,
      onColorChange: (color: string) => updateSettings('indicators.cpr.s1.color', color),
      lineStyle: settings.indicators.cpr.s1.style,
      onLineStyleChange: (style: string) => updateSettings('indicators.cpr.s1.style', style),
      thickness: settings.indicators.cpr.s1.thickness,
      onThicknessChange: (thickness: number) => updateSettings('indicators.cpr.s1.thickness', thickness)
    },
    {
      id: 'cpr-s2',
      label: 'Support 2 (S2)',
      checked: settings.indicators.cpr.s2.enabled,
      onChange: (checked: boolean) => updateSettings('indicators.cpr.s2.enabled', checked),
      color: settings.indicators.cpr.s2.color,
      onColorChange: (color: string) => updateSettings('indicators.cpr.s2.color', color),
      lineStyle: settings.indicators.cpr.s2.style,
      onLineStyleChange: (style: string) => updateSettings('indicators.cpr.s2.style', style),
      thickness: settings.indicators.cpr.s2.thickness,
      onThicknessChange: (thickness: number) => updateSettings('indicators.cpr.s2.thickness', thickness)
    },
    {
      id: 'cpr-s3',
      label: 'Support 3 (S3)',
      checked: settings.indicators.cpr.s3.enabled,
      onChange: (checked: boolean) => updateSettings('indicators.cpr.s3.enabled', checked),
      color: settings.indicators.cpr.s3.color,
      onColorChange: (color: string) => updateSettings('indicators.cpr.s3.color', color),
      lineStyle: settings.indicators.cpr.s3.style,
      onLineStyleChange: (style: string) => updateSettings('indicators.cpr.s3.style', style),
      thickness: settings.indicators.cpr.s3.thickness,
      onThicknessChange: (thickness: number) => updateSettings('indicators.cpr.s3.thickness', thickness)
    }
  ];

  // EMA Toggle Items with individual styling
  const emaItems = [
    {
      id: 'ema-9',
      label: 'EMA 9',
      checked: settings.indicators.ema.ema9.enabled,
      onChange: (checked: boolean) => updateSettings('indicators.ema.ema9.enabled', checked),
      color: settings.indicators.ema.ema9.color,
      onColorChange: (color: string) => updateSettings('indicators.ema.ema9.color', color),
      lineStyle: settings.indicators.ema.ema9.style,
      onLineStyleChange: (style: string) => updateSettings('indicators.ema.ema9.style', style),
      thickness: settings.indicators.ema.ema9.thickness,
      onThicknessChange: (thickness: number) => updateSettings('indicators.ema.ema9.thickness', thickness)
    },
    {
      id: 'ema-21',
      label: 'EMA 21',
      checked: settings.indicators.ema.ema21.enabled,
      onChange: (checked: boolean) => updateSettings('indicators.ema.ema21.enabled', checked),
      color: settings.indicators.ema.ema21.color,
      onColorChange: (color: string) => updateSettings('indicators.ema.ema21.color', color),
      lineStyle: settings.indicators.ema.ema21.style,
      onLineStyleChange: (style: string) => updateSettings('indicators.ema.ema21.style', style),
      thickness: settings.indicators.ema.ema21.thickness,
      onThicknessChange: (thickness: number) => updateSettings('indicators.ema.ema21.thickness', thickness)
    },
    {
      id: 'ema-50',
      label: 'EMA 50',
      checked: settings.indicators.ema.ema50.enabled,
      onChange: (checked: boolean) => updateSettings('indicators.ema.ema50.enabled', checked),
      color: settings.indicators.ema.ema50.color,
      onColorChange: (color: string) => updateSettings('indicators.ema.ema50.color', color),
      lineStyle: settings.indicators.ema.ema50.style,
      onLineStyleChange: (style: string) => updateSettings('indicators.ema.ema50.style', style),
      thickness: settings.indicators.ema.ema50.thickness,
      onThicknessChange: (thickness: number) => updateSettings('indicators.ema.ema50.thickness', thickness)
    },
    {
      id: 'ema-200',
      label: 'EMA 200',
      checked: settings.indicators.ema.ema200.enabled,
      onChange: (checked: boolean) => updateSettings('indicators.ema.ema200.enabled', checked),
      color: settings.indicators.ema.ema200.color,
      onColorChange: (color: string) => updateSettings('indicators.ema.ema200.color', color),
      lineStyle: settings.indicators.ema.ema200.style,
      onLineStyleChange: (style: string) => updateSettings('indicators.ema.ema200.style', style),
      thickness: settings.indicators.ema.ema200.thickness,
      onThicknessChange: (thickness: number) => updateSettings('indicators.ema.ema200.thickness', thickness)
    }
  ];

  // Pivot Points with individual styling
  const pivotItems = [
    {
      id: 'pivots-daily',
      label: 'Daily Pivots',
      checked: settings.indicators.pivots.daily.enabled,
      onChange: (checked: boolean) => updateSettings('indicators.pivots.daily.enabled', checked),
      color: settings.indicators.pivots.daily.color,
      onColorChange: (color: string) => updateSettings('indicators.pivots.daily.color', color),
      lineStyle: settings.indicators.pivots.daily.style,
      onLineStyleChange: (style: string) => updateSettings('indicators.pivots.daily.style', style),
      thickness: settings.indicators.pivots.daily.thickness,
      onThicknessChange: (thickness: number) => updateSettings('indicators.pivots.daily.thickness', thickness)
    },
    {
      id: 'pivots-weekly',
      label: 'Weekly Pivots',
      checked: settings.indicators.pivots.weekly.enabled,
      onChange: (checked: boolean) => updateSettings('indicators.pivots.weekly.enabled', checked),
      color: settings.indicators.pivots.weekly.color,
      onColorChange: (color: string) => updateSettings('indicators.pivots.weekly.color', color),
      lineStyle: settings.indicators.pivots.weekly.style,
      onLineStyleChange: (style: string) => updateSettings('indicators.pivots.weekly.style', style),
      thickness: settings.indicators.pivots.weekly.thickness,
      onThicknessChange: (thickness: number) => updateSettings('indicators.pivots.weekly.thickness', thickness)
    },
    {
      id: 'pivots-monthly',
      label: 'Monthly Pivots',
      checked: settings.indicators.pivots.monthly.enabled,
      onChange: (checked: boolean) => updateSettings('indicators.pivots.monthly.enabled', checked),
      color: settings.indicators.pivots.monthly.color,
      onColorChange: (color: string) => updateSettings('indicators.pivots.monthly.color', color),
      lineStyle: settings.indicators.pivots.monthly.style,
      onLineStyleChange: (style: string) => updateSettings('indicators.pivots.monthly.style', style),
      thickness: settings.indicators.pivots.monthly.thickness,
      onThicknessChange: (thickness: number) => updateSettings('indicators.pivots.monthly.thickness', thickness)
    },
    {
      id: 'pivots-r1',
      label: 'Resistance 1 (R1)',
      checked: settings.indicators.pivots.r1.enabled,
      onChange: (checked: boolean) => updateSettings('indicators.pivots.r1.enabled', checked),
      color: settings.indicators.pivots.r1.color,
      onColorChange: (color: string) => updateSettings('indicators.pivots.r1.color', color),
      lineStyle: settings.indicators.pivots.r1.style,
      onLineStyleChange: (style: string) => updateSettings('indicators.pivots.r1.style', style),
      thickness: settings.indicators.pivots.r1.thickness,
      onThicknessChange: (thickness: number) => updateSettings('indicators.pivots.r1.thickness', thickness)
    },
    {
      id: 'pivots-r2',
      label: 'Resistance 2 (R2)',
      checked: settings.indicators.pivots.r2.enabled,
      onChange: (checked: boolean) => updateSettings('indicators.pivots.r2.enabled', checked),
      color: settings.indicators.pivots.r2.color,
      onColorChange: (color: string) => updateSettings('indicators.pivots.r2.color', color),
      lineStyle: settings.indicators.pivots.r2.style,
      onLineStyleChange: (style: string) => updateSettings('indicators.pivots.r2.style', style),
      thickness: settings.indicators.pivots.r2.thickness,
      onThicknessChange: (thickness: number) => updateSettings('indicators.pivots.r2.thickness', thickness)
    },
    {
      id: 'pivots-r3',
      label: 'Resistance 3 (R3)',
      checked: settings.indicators.pivots.r3.enabled,
      onChange: (checked: boolean) => updateSettings('indicators.pivots.r3.enabled', checked),
      color: settings.indicators.pivots.r3.color,
      onColorChange: (color: string) => updateSettings('indicators.pivots.r3.color', color),
      lineStyle: settings.indicators.pivots.r3.style,
      onLineStyleChange: (style: string) => updateSettings('indicators.pivots.r3.style', style),
      thickness: settings.indicators.pivots.r3.thickness,
      onThicknessChange: (thickness: number) => updateSettings('indicators.pivots.r3.thickness', thickness)
    },
    {
      id: 'pivots-s1',
      label: 'Support 1 (S1)',
      checked: settings.indicators.pivots.s1.enabled,
      onChange: (checked: boolean) => updateSettings('indicators.pivots.s1.enabled', checked),
      color: settings.indicators.pivots.s1.color,
      onColorChange: (color: string) => updateSettings('indicators.pivots.s1.color', color),
      lineStyle: settings.indicators.pivots.s1.style,
      onLineStyleChange: (style: string) => updateSettings('indicators.pivots.s1.style', style),
      thickness: settings.indicators.pivots.s1.thickness,
      onThicknessChange: (thickness: number) => updateSettings('indicators.pivots.s1.thickness', thickness)
    },
    {
      id: 'pivots-s2',
      label: 'Support 2 (S2)',
      checked: settings.indicators.pivots.s2.enabled,
      onChange: (checked: boolean) => updateSettings('indicators.pivots.s2.enabled', checked),
      color: settings.indicators.pivots.s2.color,
      onColorChange: (color: string) => updateSettings('indicators.pivots.s2.color', color),
      lineStyle: settings.indicators.pivots.s2.style,
      onLineStyleChange: (style: string) => updateSettings('indicators.pivots.s2.style', style),
      thickness: settings.indicators.pivots.s2.thickness,
      onThicknessChange: (thickness: number) => updateSettings('indicators.pivots.s2.thickness', thickness)
    },
    {
      id: 'pivots-s3',
      label: 'Support 3 (S3)',
      checked: settings.indicators.pivots.s3.enabled,
      onChange: (checked: boolean) => updateSettings('indicators.pivots.s3.enabled', checked),
      color: settings.indicators.pivots.s3.color,
      onColorChange: (color: string) => updateSettings('indicators.pivots.s3.color', color),
      lineStyle: settings.indicators.pivots.s3.style,
      onLineStyleChange: (style: string) => updateSettings('indicators.pivots.s3.style', style),
      thickness: settings.indicators.pivots.s3.thickness,
      onThicknessChange: (thickness: number) => updateSettings('indicators.pivots.s3.thickness', thickness)
    }
  ];

  // Other Indicators
  const otherItems = [
    {
      id: 'vwap',
      label: 'VWAP',
      checked: settings.indicators.vwap.enabled,
      onChange: (checked: boolean) => updateSettings('indicators.vwap.enabled', checked),
      color: settings.indicators.vwap.color,
      onColorChange: (color: string) => updateSettings('indicators.vwap.color', color),
      lineStyle: settings.indicators.vwap.style,
      onLineStyleChange: (style: string) => updateSettings('indicators.vwap.style', style),
      thickness: settings.indicators.vwap.thickness,
      onThicknessChange: (thickness: number) => updateSettings('indicators.vwap.thickness', thickness)
    },
    {
      id: 'rsi',
      label: 'RSI',
      checked: settings.indicators.rsi.enabled,
      onChange: (checked: boolean) => updateSettings('indicators.rsi.enabled', checked),
      color: settings.indicators.rsi.color,
      onColorChange: (color: string) => updateSettings('indicators.rsi.color', color),
      lineStyle: settings.indicators.rsi.style,
      onLineStyleChange: (style: string) => updateSettings('indicators.rsi.style', style),
      thickness: settings.indicators.rsi.thickness,
      onThicknessChange: (thickness: number) => updateSettings('indicators.rsi.thickness', thickness)
    },
    {
      id: 'stochastic',
      label: 'Stochastic',
      checked: settings.indicators.stochastic.enabled,
      onChange: (checked: boolean) => updateSettings('indicators.stochastic.enabled', checked),
      color: settings.indicators.stochastic.color,
      onColorChange: (color: string) => updateSettings('indicators.stochastic.color', color),
      lineStyle: settings.indicators.stochastic.style,
      onLineStyleChange: (style: string) => updateSettings('indicators.stochastic.style', style),
      thickness: settings.indicators.stochastic.thickness,
      onThicknessChange: (thickness: number) => updateSettings('indicators.stochastic.thickness', thickness)
    },
    {
      id: 'pdh',
      label: 'Previous Day High',
      checked: settings.indicators.previousDayHL?.high?.enabled || false,
      onChange: (checked: boolean) => updateSettings('indicators.previousDayHL.high.enabled', checked),
      color: settings.indicators.previousDayHL?.high?.color || '#ff4444',
      onColorChange: (color: string) => updateSettings('indicators.previousDayHL.high.color', color),
      lineStyle: settings.indicators.previousDayHL?.high?.style || 'solid',
      onLineStyleChange: (style: string) => updateSettings('indicators.previousDayHL.high.style', style),
      thickness: settings.indicators.previousDayHL?.high?.thickness || 1,
      onThicknessChange: (thickness: number) => updateSettings('indicators.previousDayHL.high.thickness', thickness)
    },
    {
      id: 'pdl',
      label: 'Previous Day Low',
      checked: settings.indicators.previousDayHL?.low?.enabled || false,
      onChange: (checked: boolean) => updateSettings('indicators.previousDayHL.low.enabled', checked),
      color: settings.indicators.previousDayHL?.low?.color || '#44ff44',
      onColorChange: (color: string) => updateSettings('indicators.previousDayHL.low.color', color),
      lineStyle: settings.indicators.previousDayHL?.low?.style || 'solid',
      onLineStyleChange: (style: string) => updateSettings('indicators.previousDayHL.low.style', style),
      thickness: settings.indicators.previousDayHL?.low?.thickness || 1,
      onThicknessChange: (thickness: number) => updateSettings('indicators.previousDayHL.low.thickness', thickness)
    }
  ];

  return (
    <div className="space-y-6">
      <CompactToggleWidget
        title="CPR & Levels"
        icon={<TrendingUp className="w-4 h-4" />}
        items={cprItems}
        columns={2}
      />

      <CompactToggleWidget
        title="Pivot Points"
        icon={<BarChart3 className="w-4 h-4" />}
        items={pivotItems}
        columns={2}
      />

      <CompactToggleWidget
        title="Moving Averages"
        icon={<Activity className="w-4 h-4" />}
        items={emaItems}
        columns={2}
      />

      <CompactToggleWidget
        title="Other Indicators"
        icon={<BarChart3 className="w-4 h-4" />}
        items={otherItems}
        columns={2}
      />
    </div>
  );
};
