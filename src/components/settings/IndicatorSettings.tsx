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
      onChange: (checked: boolean) => updateSettings('indicators.cpr.pivot', checked)
    },
    {
      id: 'cpr-bc',
      label: 'Bottom Central (BC)',
      checked: settings.indicators.cpr.bc,
      onChange: (checked: boolean) => updateSettings('indicators.cpr.bc', checked)
    },
    {
      id: 'cpr-tc',
      label: 'Top Central (TC)',
      checked: settings.indicators.cpr.tc,
      onChange: (checked: boolean) => updateSettings('indicators.cpr.tc', checked)
    },
    {
      id: 'cpr-r1',
      label: 'Resistance 1 (R1)',
      checked: settings.indicators.cpr.r1,
      onChange: (checked: boolean) => updateSettings('indicators.cpr.r1', checked)
    },
    {
      id: 'cpr-r2',
      label: 'Resistance 2 (R2)',
      checked: settings.indicators.cpr.r2,
      onChange: (checked: boolean) => updateSettings('indicators.cpr.r2', checked)
    },
    {
      id: 'cpr-r3',
      label: 'Resistance 3 (R3)',
      checked: settings.indicators.cpr.r3,
      onChange: (checked: boolean) => updateSettings('indicators.cpr.r3', checked)
    },
    {
      id: 'cpr-s1',
      label: 'Support 1 (S1)',
      checked: settings.indicators.cpr.s1,
      onChange: (checked: boolean) => updateSettings('indicators.cpr.s1', checked)
    },
    {
      id: 'cpr-s2',
      label: 'Support 2 (S2)',
      checked: settings.indicators.cpr.s2,
      onChange: (checked: boolean) => updateSettings('indicators.cpr.s2', checked)
    },
    {
      id: 'cpr-s3',
      label: 'Support 3 (S3)',
      checked: settings.indicators.cpr.s3,
      onChange: (checked: boolean) => updateSettings('indicators.cpr.s3', checked)
    }
  ];

  // EMA Toggle Items
  const emaItems = [
    {
      id: 'ema-9',
      label: 'EMA 9',
      checked: settings.indicators.ema.ema9.enabled,
      onChange: (checked: boolean) => updateSettings('indicators.ema.ema9.enabled', checked)
    },
    {
      id: 'ema-21',
      label: 'EMA 21',
      checked: settings.indicators.ema.ema21.enabled,
      onChange: (checked: boolean) => updateSettings('indicators.ema.ema21.enabled', checked)
    },
    {
      id: 'ema-50',
      label: 'EMA 50',
      checked: settings.indicators.ema.ema50.enabled,
      onChange: (checked: boolean) => updateSettings('indicators.ema.ema50.enabled', checked)
    },
    {
      id: 'ema-200',
      label: 'EMA 200',
      checked: settings.indicators.ema.ema200.enabled,
      onChange: (checked: boolean) => updateSettings('indicators.ema.ema200.enabled', checked)
    }
  ];

  // Other Indicators Toggle Items
  const otherItems = [
    {
      id: 'rsi-enabled',
      label: 'RSI',
      description: 'Relative Strength Index',
      checked: settings.indicators.rsi.enabled,
      onChange: (checked: boolean) => updateSettings('indicators.rsi.enabled', checked)
    },
    {
      id: 'stochastic-enabled',
      label: 'Stochastic',
      description: 'Stochastic Oscillator',
      checked: settings.indicators.stochastic.enabled,
      onChange: (checked: boolean) => updateSettings('indicators.stochastic.enabled', checked)
    },
    {
      id: 'vwap-enabled',
      label: 'VWAP',
      description: 'Volume Weighted Average Price',
      checked: settings.indicators.vwap.enabled,
      onChange: (checked: boolean) => updateSettings('indicators.vwap.enabled', checked)
    },
    {
      id: 'pdh-pdl',
      label: 'Previous Day H/L',
      description: 'Previous Day High/Low levels',
      checked: settings.cprPivots.showPDH_PDL,
      onChange: (checked: boolean) => updateSettings('cprPivots.showPDH_PDL', checked)
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <CompactToggleWidget
        title="CPR (Central Pivot Range)"
        icon={<Activity className="h-4 w-4" />}
        items={cprItems}
        columns={1}
      />
      
      <CompactToggleWidget
        title="Moving Averages"
        icon={<TrendingUp className="h-4 w-4" />}
        items={emaItems}
        columns={1}
      />
      
      <div className="lg:col-span-2">
        <CompactToggleWidget
          title="Technical Indicators"
          icon={<BarChart3 className="h-4 w-4" />}
          items={otherItems}
          columns={2}
        />
      </div>
    </div>
  );
};
