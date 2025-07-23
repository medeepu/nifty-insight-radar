/**
 * Interactive Trading Chart with Advanced Features
 * ApexCharts with zoom, hover values, responsive design
 */

import React, { useEffect, useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Settings, X, TrendingUp } from 'lucide-react';
import { useChartStore, Chart } from '../../store/useChartStore';
import { useTradingStore } from '../../store/useTradingStore';
import { useCandles, useDailyLevels, useIndicators } from '../../hooks/useApi';
import { ChartSettings } from './ChartSettings';

interface InteractiveChartProps {
  chart: Chart;
  onRemove?: () => void;
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  chart,
  onRemove,
}) => {
  const [showSettings, setShowSettings] = React.useState(false);
  const { updateChart, toggleIndicator } = useChartStore();
  const { currentSignal } = useTradingStore();
  
  // Data fetching
  const { data: candleData, isLoading } = useCandles(chart.symbol, chart.timeframe);
  const { data: dailyLevels } = useDailyLevels(chart.symbol);
  const { data: indicators } = useIndicators(chart.symbol);

  // Process candle data
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

  // Chart annotations based on enabled indicators
  const annotations = useMemo(() => {
    const yAxisAnnotations: any[] = [];
    const enabledIndicators = chart.indicators.filter(ind => ind.enabled);

    // CPR annotations
    const cprIndicator = enabledIndicators.find(ind => ind.id === 'cpr');
    if (cprIndicator && dailyLevels && cprIndicator.subSettings) {
      if (cprIndicator.subSettings.pivot) {
        yAxisAnnotations.push({
          y: dailyLevels.pivot,
          borderColor: '#fbbf24',
          label: { text: 'Pivot', style: { color: '#000', background: '#fbbf24' } }
        });
      }
      if (cprIndicator.subSettings.centralTop) {
        yAxisAnnotations.push({
          y: dailyLevels.tc,
          borderColor: '#06b6d4',
          label: { text: 'TC', style: { color: '#fff', background: '#06b6d4' } }
        });
      }
      if (cprIndicator.subSettings.centralBottom) {
        yAxisAnnotations.push({
          y: dailyLevels.bc,
          borderColor: '#06b6d4',
          label: { text: 'BC', style: { color: '#fff', background: '#06b6d4' } }
        });
      }
      if (cprIndicator.subSettings.r1) {
        yAxisAnnotations.push({
          y: dailyLevels.r1,
          borderColor: '#22c55e',
          label: { text: 'R1', style: { color: '#fff', background: '#22c55e' } }
        });
      }
      if (cprIndicator.subSettings.r2) {
        yAxisAnnotations.push({
          y: dailyLevels.r2,
          borderColor: '#22c55e',
          label: { text: 'R2', style: { color: '#fff', background: '#22c55e' } }
        });
      }
      if (cprIndicator.subSettings.r3) {
        yAxisAnnotations.push({
          y: dailyLevels.r3,
          borderColor: '#22c55e',
          label: { text: 'R3', style: { color: '#fff', background: '#22c55e' } }
        });
      }
      if (cprIndicator.subSettings.s1) {
        yAxisAnnotations.push({
          y: dailyLevels.s1,
          borderColor: '#ef4444',
          label: { text: 'S1', style: { color: '#fff', background: '#ef4444' } }
        });
      }
      if (cprIndicator.subSettings.s2) {
        yAxisAnnotations.push({
          y: dailyLevels.s2,
          borderColor: '#ef4444',
          label: { text: 'S2', style: { color: '#fff', background: '#ef4444' } }
        });
      }
      if (cprIndicator.subSettings.s3) {
        yAxisAnnotations.push({
          y: dailyLevels.s3,
          borderColor: '#ef4444',
          label: { text: 'S3', style: { color: '#fff', background: '#ef4444' } }
        });
      }
    }

    // Signal levels
    if (currentSignal && chart.symbol === 'NIFTY') {
      yAxisAnnotations.push(
        {
          y: currentSignal.entry,
          borderColor: '#06b6d4',
          borderWidth: 2,
          label: { text: 'Entry', style: { color: '#fff', background: '#06b6d4' } }
        },
        {
          y: currentSignal.sl,
          borderColor: '#ef4444',
          borderWidth: 2,
          label: { text: 'SL', style: { color: '#fff', background: '#ef4444' } }
        },
        {
          y: currentSignal.tp,
          borderColor: '#22c55e',
          borderWidth: 2,
          label: { text: 'TP', style: { color: '#fff', background: '#22c55e' } }
        }
      );
    }

    return { yaxis: yAxisAnnotations };
  }, [chart.indicators, dailyLevels, currentSignal, chart.symbol]);

  // EMA Series based on enabled indicators
  const emaSeries = useMemo(() => {
    const series: any[] = [];
    const enabledIndicators = chart.indicators.filter(ind => ind.enabled && ind.type === 'overlay');

    enabledIndicators.forEach(indicator => {
      if (indicator.id.startsWith('ema-') && indicators?.ema) {
        const period = parseInt(indicator.id.split('-')[1]);
        const colors = {
          9: '#fbbf24',
          21: '#06b6d4',
          50: '#22c55e',
          200: '#ef4444',
        };

        series.push({
          name: `EMA ${period}`,
          type: 'line',
          data: chartData.map((point, index) => ({
            x: point.x,
            y: indicators.ema[period] || point.y[3], // Fallback to close price
          })),
          color: colors[period as keyof typeof colors] || '#8b5cf6',
        });
      }

      if (indicator.id === 'vwap' && indicators?.vwap) {
        series.push({
          name: 'VWAP',
          type: 'line',
          data: chartData.map(point => ({
            x: point.x,
            y: indicators.vwap,
          })),
          color: '#8b5cf6',
        });
      }
    });

    return series;
  }, [chart.indicators, indicators, chartData]);

  const chartOptions: ApexOptions = {
    chart: {
      type: 'candlestick',
      height: chart.height,
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
        autoScaleYaxis: true,
      },
      animations: {
        enabled: true,
        speed: 800,
      },
    },
    theme: {
      mode: 'dark',
    },
    grid: {
      borderColor: 'hsl(var(--border))',
      strokeDashArray: 1,
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          colors: 'hsl(var(--muted-foreground))',
        },
        datetimeFormatter: {
          year: 'yyyy',
          month: "MMM 'yy",
          day: 'dd MMM',
          hour: 'HH:mm',
        },
      },
      axisBorder: {
        color: 'hsl(var(--border))',
      },
      axisTicks: {
        color: 'hsl(var(--border))',
      },
    },
    yaxis: [
      {
        tooltip: {
          enabled: true,
        },
        labels: {
          style: {
            colors: 'hsl(var(--muted-foreground))',
          },
          formatter: (value) => value?.toFixed(2),
        },
        axisBorder: {
          color: 'hsl(var(--border))',
        },
      },
      {
        opposite: true,
        max: Math.max(...(volumeData.length ? volumeData.map(v => v.y) : [0])) * 4,
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
      show: emaSeries.length > 0,
      position: 'top',
      horizontalAlign: 'left',
      labels: {
        colors: 'hsl(var(--foreground))',
      },
    },
    tooltip: {
      theme: 'dark',
      shared: true,
      intersect: false,
      custom: ({ seriesIndex, dataPointIndex, w }) => {
        const data = w.config.series[seriesIndex]?.data[dataPointIndex];
        if (!data) return '';

        if (seriesIndex === 0 && data?.y && Array.isArray(data.y)) {
          // Candlestick data
          const volume = volumeData[dataPointIndex]?.y;
          return `
            <div class="bg-card border border-border rounded-lg shadow-lg p-3 min-w-[200px]">
              <div class="font-semibold text-sm mb-2 text-foreground">
                ${chart.symbol} - ${new Date(data.x).toLocaleString()}
              </div>
              <div class="space-y-1 text-xs text-muted-foreground">
                <div class="flex justify-between">
                  <span>Open:</span>
                  <span class="text-foreground font-medium">₹${data.y[0].toFixed(2)}</span>
                </div>
                <div class="flex justify-between">
                  <span>High:</span>
                  <span class="text-bull-green font-medium">₹${data.y[1].toFixed(2)}</span>
                </div>
                <div class="flex justify-between">
                  <span>Low:</span>
                  <span class="text-bear-red font-medium">₹${data.y[2].toFixed(2)}</span>
                </div>
                <div class="flex justify-between">
                  <span>Close:</span>
                  <span class="text-foreground font-medium">₹${data.y[3].toFixed(2)}</span>
                </div>
                ${volume ? `
                <div class="flex justify-between">
                  <span>Volume:</span>
                  <span class="text-foreground font-medium">${volume.toLocaleString()}</span>
                </div>
                ` : ''}
              </div>
            </div>
          `;
        }
        return '';
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 400,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
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

  const enabledIndicators = chart.indicators.filter(ind => ind.enabled);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="animate-pulse text-lg">Loading {chart.symbol} chart...</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{chart.symbol}</h3>
              <Badge variant="outline">{chart.timeframe}</Badge>
            </div>
            {currentSignal && chart.symbol === 'NIFTY' && (
              <Badge 
                variant={currentSignal.signal === 'BUY' ? 'default' : 'secondary'}
                className={
                  currentSignal.signal === 'BUY' 
                    ? 'bg-bull-green text-white' 
                    : currentSignal.signal === 'SELL'
                    ? 'bg-bear-red text-white'
                    : 'bg-neutral-yellow text-black'
                }
              >
                {currentSignal.signal} Signal
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Active Indicators */}
            {enabledIndicators.map((indicator) => (
              <Badge 
                key={indicator.id} 
                variant="secondary"
                className="flex items-center gap-1"
              >
                <TrendingUp className="h-3 w-3" />
                {indicator.name}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => toggleIndicator(chart.id, indicator.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-1"
            >
              <Settings className="h-3 w-3" />
              Settings
            </Button>
            
            {onRemove && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRemove}
                className="flex items-center gap-1 hover:bg-destructive hover:text-destructive-foreground"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {showSettings && (
          <div className="mt-4">
            <ChartSettings 
              chart={chart} 
              onClose={() => setShowSettings(false)} 
            />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <ReactApexChart
          options={chartOptions}
          series={series}
          type="candlestick"
          height={chart.height}
        />
      </div>
    </Card>
  );
};