/**
 * Modern Trading Chart - TradingView Style with Overlays
 */

import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Card } from '@/components/ui/card';
import { ChartControls } from './ChartControls';
import { useTradingStore } from '@/store/useTradingStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useCandles, useIndicators, useDailyLevels } from '@/hooks/useApi';

interface ModernTradingChartProps {
  symbol: string;
  timeframe: string;
  height?: number;
}

export const ModernTradingChart: React.FC<ModernTradingChartProps> = ({
  symbol,
  timeframe,
  height = 600
}) => {
  const { currentSignal } = useTradingStore();
  const { settings } = useSettingsStore();

  // Data fetching
  const { data: candleData, isLoading } = useCandles(symbol, timeframe);
  const { data: indicators } = useIndicators(symbol);
  const { data: levels } = useDailyLevels(symbol);

  // Process candle data for ApexCharts
  const chartData = useMemo(() => {
    if (!candleData?.candles) return [];
    return candleData.candles.map((candle: any) => ({
      x: new Date(candle.t),
      y: [candle.o, candle.h, candle.l, candle.c]
    }));
  }, [candleData]);

  // Volume data
  const volumeData = useMemo(() => {
    if (!candleData?.candles) return [];
    return candleData.candles.map((candle: any) => ({
      x: new Date(candle.t),
      y: candle.v
    }));
  }, [candleData]);

  // Chart options
  const chartOptions: ApexOptions = {
    theme: {
      mode: 'dark'
    },
    chart: {
      type: 'candlestick',
      height: height,
      background: 'transparent',
      animations: { enabled: false },
      zoom: { enabled: true },
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      }
    },
    grid: {
      show: true,
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: { colors: '#888' }
      }
    },
    yaxis: [
      {
        seriesName: 'candles',
        opposite: true,
        labels: {
          style: { colors: '#888' }
        }
      },
      {
        seriesName: 'volume',
        show: false,
        max: function(val: number) {
          return val * 4;
        }
      }
    ],
    plotOptions: {
      candlestick: {
        colors: {
          upward: 'hsl(var(--bull-green))',
          downward: 'hsl(var(--bear-red))'
        }
      }
    },
    annotations: {
      yaxis: [
        ...(currentSignal ? [
          {
            y: currentSignal.entry,
            borderColor: 'hsl(var(--primary))',
            label: {
              text: `Entry: ${currentSignal.entry}`,
              style: { background: 'hsl(var(--primary))' }
            }
          },
          {
            y: currentSignal.sl,
            borderColor: 'hsl(var(--bear-red))',
            label: {
              text: `SL: ${currentSignal.sl}`,
              style: { background: 'hsl(var(--bear-red))' }
            }
          },
          {
            y: currentSignal.tp,
            borderColor: 'hsl(var(--bull-green))',
            label: {
              text: `TP: ${currentSignal.tp}`,
              style: { background: 'hsl(var(--bull-green))' }
            }
          }
        ] : [])
      ]
    },
    tooltip: {
      theme: 'dark',
      shared: true,
      custom: function({ seriesIndex, dataPointIndex, w }) {
        const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
        if (seriesIndex === 0 && data) { // Candlestick tooltip
          return `
            <div class="p-3 bg-card border border-border rounded">
              <div class="text-sm font-medium mb-2">${symbol} - ${timeframe}</div>
              <div class="space-y-1 text-xs">
                <div>Open: <span class="float-right">${data.y[0]}</span></div>
                <div>High: <span class="float-right text-bull-green">${data.y[1]}</span></div>
                <div>Low: <span class="float-right text-bear-red">${data.y[2]}</span></div>
                <div>Close: <span class="float-right">${data.y[3]}</span></div>
              </div>
            </div>
          `;
        }
        return '';
      }
    }
  };

  // Series data
  const series = [
    {
      name: 'candles',
      type: 'candlestick',
      data: chartData
    },
    {
      name: 'volume',
      type: 'column',
      data: volumeData,
      yAxisIndex: 1
    },
    // EMA overlays (when enabled)
    ...(indicators && settings.ema.periods.ema21.enabled ? [{
      name: 'EMA 21',
      type: 'line' as const,
      data: candleData?.candles?.map((candle: any, index: number) => ({
        x: new Date(candle.t),
        y: indicators.ema?.[21] || candle.c
      })) || []
    }] : [])
  ];

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <ChartControls />
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{symbol}</h3>
            <p className="text-sm text-muted-foreground">Timeframe: {timeframe}</p>
          </div>
          {currentSignal && (
            <div className="flex items-center space-x-2">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                currentSignal.signal === 'BUY' 
                  ? 'bg-bull-green/10 text-bull-green border border-bull-green/20'
                  : currentSignal.signal === 'SELL'
                  ? 'bg-bear-red/10 text-bear-red border border-bear-red/20'
                  : 'bg-neutral-yellow/10 text-neutral-yellow border border-neutral-yellow/20'
              }`}>
                {currentSignal.signal}
              </div>
            </div>
          )}
        </div>
        
        <ReactApexChart
          options={chartOptions}
          series={series}
          height={height}
        />
      </Card>
    </div>
  );
};