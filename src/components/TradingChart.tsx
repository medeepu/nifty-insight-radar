/**
 * Advanced Trading Chart Component
 * ApexCharts candlestick chart with overlays and annotations
 */

import React, { useEffect, useMemo, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { useTradingStore } from '../store/useTradingStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useCandles, useDailyLevels, useIndicators } from '../hooks/useApi';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';

interface TradingChartProps {
  symbol: string;
  timeframe: string;
  height?: number;
}

export const TradingChart: React.FC<TradingChartProps> = ({
  symbol,
  timeframe,
  height = 600,
}) => {
  const [showAddChart, setShowAddChart] = useState(false);
  
  const { currentSignal, chartAnnotations } = useTradingStore();
  const { settings } = useSettingsStore();
  
  // Data fetching
  const { data: candleData, isLoading: candlesLoading } = useCandles(symbol, timeframe);
  const { data: dailyLevels } = useDailyLevels(symbol);
  const { data: indicators } = useIndicators(symbol);

  // Process candle data for ApexCharts
  const chartData = useMemo(() => {
    if (!candleData?.candles) return [];
    
    return candleData.candles.map(candle => ({
      x: new Date(candle.t).getTime(),
      y: [candle.o, candle.h, candle.l, candle.c],
    }));
  }, [candleData]);

  // Volume data
  const volumeData = useMemo(() => {
    if (!candleData?.candles) return [];
    
    return candleData.candles.map(candle => ({
      x: new Date(candle.t).getTime(),
      y: candle.v,
    }));
  }, [candleData]);

  // Chart annotations for levels and signals
  const annotations = useMemo(() => {
    const yAxisAnnotations: any[] = [];
    
    // CPR Levels
    if (settings.cprPivots.showCPR && dailyLevels) {
      yAxisAnnotations.push(
        {
          y: dailyLevels.pivot,
          borderColor: settings.cprPivots.lineStyles.cpr.color,
          label: { text: 'Pivot', style: { color: '#fff', background: settings.cprPivots.lineStyles.cpr.color } }
        },
        {
          y: dailyLevels.bc,
          borderColor: settings.cprPivots.lineStyles.cpr.color,
          label: { text: 'BC', style: { color: '#fff', background: settings.cprPivots.lineStyles.cpr.color } }
        },
        {
          y: dailyLevels.tc,
          borderColor: settings.cprPivots.lineStyles.cpr.color,
          label: { text: 'TC', style: { color: '#fff', background: settings.cprPivots.lineStyles.cpr.color } }
        }
      );
    }
    
    // Daily Pivots
    if (settings.cprPivots.showDailyPivots && dailyLevels) {
      yAxisAnnotations.push(
        { y: dailyLevels.s1, borderColor: '#ef4444', label: { text: 'S1' } },
        { y: dailyLevels.s2, borderColor: '#ef4444', label: { text: 'S2' } },
        { y: dailyLevels.s3, borderColor: '#ef4444', label: { text: 'S3' } },
        { y: dailyLevels.r1, borderColor: '#22c55e', label: { text: 'R1' } },
        { y: dailyLevels.r2, borderColor: '#22c55e', label: { text: 'R2' } },
        { y: dailyLevels.r3, borderColor: '#22c55e', label: { text: 'R3' } }
      );
    }
    
    // Signal levels
    if (currentSignal) {
      yAxisAnnotations.push(
        {
          y: currentSignal.entry,
          borderColor: '#06b6d4',
          label: { text: 'Entry', style: { color: '#fff', background: '#06b6d4' } }
        },
        {
          y: currentSignal.sl,
          borderColor: '#ef4444',
          label: { text: 'SL', style: { color: '#fff', background: '#ef4444' } }
        },
        {
          y: currentSignal.tp,
          borderColor: '#22c55e',
          label: { text: 'TP', style: { color: '#fff', background: '#22c55e' } }
        }
      );
    }
    
    return { yaxis: yAxisAnnotations };
  }, [dailyLevels, currentSignal, settings]);

  // EMA Series
  const emaSeries = useMemo(() => {
    const series: any[] = [];
    
    if (indicators && settings.ema.periods.ema9.enabled) {
      series.push({
        name: 'EMA 9',
        type: 'line',
        data: chartData.map((point, index) => ({
          x: point.x,
          y: indicators.ema[9] // This would be calculated properly in real implementation
        })),
        color: settings.ema.periods.ema9.color,
      });
    }
    
    // Add other EMAs similarly...
    
    return series;
  }, [indicators, settings.ema, chartData]);

  const chartOptions: ApexOptions = {
    chart: {
      type: 'candlestick',
      height,
      background: 'transparent',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      zoom: {
        enabled: true,
        type: 'x',
      },
    },
    theme: {
      mode: 'dark',
    },
    grid: {
      borderColor: 'hsl(var(--chart-grid))',
      strokeDashArray: 1,
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          colors: 'hsl(var(--chart-axis))',
        },
      },
      axisBorder: {
        color: 'hsl(var(--chart-axis))',
      },
      axisTicks: {
        color: 'hsl(var(--chart-axis))',
      },
    },
    yaxis: [
      {
        tooltip: {
          enabled: true,
        },
        labels: {
          style: {
            colors: 'hsl(var(--chart-axis))',
          },
        },
        axisBorder: {
          color: 'hsl(var(--chart-axis))',
        },
      },
      {
        opposite: true,
        max: Math.max(...volumeData.map(v => v.y)) * 4,
        labels: {
          show: false,
        },
      },
    ],
    plotOptions: {
      candlestick: {
        colors: {
          upward: 'hsl(var(--bull-green))',
          downward: 'hsl(var(--bear-red))',
        },
        wick: {
          useFillColor: true,
        },
      },
    },
    annotations,
    legend: {
      show: true,
      position: 'bottom',
      labels: {
        colors: 'hsl(var(--foreground))',
      },
    },
    tooltip: {
      theme: 'dark',
      custom: ({ seriesIndex, dataPointIndex, w }) => {
        const data = w.config.series[seriesIndex].data[dataPointIndex];
        if (seriesIndex === 0 && data?.y) { // Candlestick data
          return `
            <div class="p-3 bg-card border border-border rounded-lg shadow-lg">
              <div class="font-semibold text-sm mb-2">${symbol} - ${new Date(data.x).toLocaleString()}</div>
              <div class="space-y-1 text-xs">
                <div class="flex justify-between"><span>Open:</span><span>${data.y[0].toFixed(2)}</span></div>
                <div class="flex justify-between"><span>High:</span><span>${data.y[1].toFixed(2)}</span></div>
                <div class="flex justify-between"><span>Low:</span><span>${data.y[2].toFixed(2)}</span></div>
                <div class="flex justify-between"><span>Close:</span><span>${data.y[3].toFixed(2)}</span></div>
              </div>
            </div>
          `;
        }
        return '';
      },
    },
  };

  const series = [
    {
      name: 'Price',
      type: 'candlestick' as const,
      data: chartData,
    },
    {
      name: 'Volume',
      type: 'column' as const,
      data: volumeData,
      yAxisIndex: 1,
    },
    ...emaSeries,
  ];

  if (candlesLoading) {
    return (
      <Card className="chart-container p-6">
        <div className="flex items-center justify-center h-96">
          <div className="animate-pulse-trading text-lg">Loading chart data...</div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="chart-container p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold">{symbol} - {timeframe}</h3>
            {currentSignal && (
              <div className={`signal-badge-${currentSignal.signal.toLowerCase()}`}>
                {currentSignal.signal} Signal
              </div>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddChart(!showAddChart)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Chart
          </Button>
        </div>
        
        <ReactApexChart
          options={chartOptions}
          series={series}
          type="candlestick"
          height={height}
        />
      </Card>
      
      {showAddChart && (
        <Card className="chart-container p-4">
          <div className="text-center text-muted-foreground">
            Additional chart comparison feature - Select another index to compare
          </div>
        </Card>
      )}
    </div>
  );
};