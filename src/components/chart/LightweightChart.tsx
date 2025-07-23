/**
 * TradingView Lightweight Charts Implementation
 * Replaces ApexCharts with better performance and control
 */

import React, { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData, LineData, ColorType } from 'lightweight-charts';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Settings, X } from 'lucide-react';
import { Candle, IndicatorData } from '../../types/api';
import { ChartSettings } from './ChartSettings';
import { useChartStore } from '../../store/useChartStore';

interface LightweightChartProps {
  chart: any;
  onRemove?: () => void;
}

export const LightweightChart: React.FC<LightweightChartProps> = ({ chart, onRemove }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const { updateChart } = useChartStore();

  // Mock data - replace with real data fetching
  const mockCandles: Candle[] = [
    { time: 1640995200, open: 17800, high: 17850, low: 17750, close: 17820, volume: 1000000 },
    { time: 1641081600, open: 17820, high: 17880, low: 17800, close: 17860, volume: 1200000 },
    { time: 1641168000, open: 17860, high: 17900, low: 17840, close: 17875, volume: 980000 },
    { time: 1641254400, open: 17875, high: 17920, low: 17850, close: 17890, volume: 1100000 },
    { time: 1641340800, open: 17890, high: 17950, low: 17880, close: 17920, volume: 1300000 },
  ];

  const mockIndicators: IndicatorData = {
    ema: {
      9: [
        { time: 1640995200, value: 17810 },
        { time: 1641081600, value: 17840 },
        { time: 1641168000, value: 17865 },
        { time: 1641254400, value: 17880 },
        { time: 1641340800, value: 17900 },
      ],
      21: [
        { time: 1640995200, value: 17790 },
        { time: 1641081600, value: 17820 },
        { time: 1641168000, value: 17845 },
        { time: 1641254400, value: 17860 },
        { time: 1641340800, value: 17880 },
      ],
      50: [
        { time: 1640995200, value: 17750 },
        { time: 1641081600, value: 17780 },
        { time: 1641168000, value: 17805 },
        { time: 1641254400, value: 17820 },
        { time: 1641340800, value: 17840 },
      ],
      200: [
        { time: 1640995200, value: 17700 },
        { time: 1641081600, value: 17720 },
        { time: 1641168000, value: 17740 },
        { time: 1641254400, value: 17760 },
        { time: 1641340800, value: 17780 },
      ],
    },
    vwap: [
      { time: 1640995200, value: 17815 },
      { time: 1641081600, value: 17845 },
      { time: 1641168000, value: 17870 },
      { time: 1641254400, value: 17885 },
      { time: 1641340800, value: 17905 },
    ],
    rsi: [
      { time: 1640995200, value: 55 },
      { time: 1641081600, value: 62 },
      { time: 1641168000, value: 58 },
      { time: 1641254400, value: 65 },
      { time: 1641340800, value: 70 },
    ],
    stoch: {
      k: [
        { time: 1640995200, value: 60 },
        { time: 1641081600, value: 70 },
        { time: 1641168000, value: 65 },
        { time: 1641254400, value: 75 },
        { time: 1641340800, value: 80 },
      ],
      d: [
        { time: 1640995200, value: 58 },
        { time: 1641081600, value: 68 },
        { time: 1641168000, value: 63 },
        { time: 1641254400, value: 73 },
        { time: 1641340800, value: 78 },
      ],
    },
    atr: [
      { time: 1640995200, value: 45 },
      { time: 1641081600, value: 50 },
      { time: 1641168000, value: 42 },
      { time: 1641254400, value: 48 },
      { time: 1641340800, value: 55 },
    ],
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chartOptions = {
      layout: {
        textColor: 'hsl(var(--foreground))',
        background: { type: ColorType.Solid, color: 'hsl(var(--background))' },
      },
      grid: {
        vertLines: { color: 'hsl(var(--border))' },
        horzLines: { color: 'hsl(var(--border))' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderVisible: false,
        textColor: 'hsl(var(--foreground))',
      },
      timeScale: {
        borderVisible: false,
        textColor: 'hsl(var(--foreground))',
      },
      handleScroll: true,
      handleScale: true,
    };

    const newChart = createChart(chartContainerRef.current, {
      ...chartOptions,
      width: chartContainerRef.current.clientWidth,
      height: 400,
    });

    // Add candlestick series
    const candlestickSeries = newChart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderDownColor: '#ef4444',
      borderUpColor: '#22c55e',
      wickDownColor: '#ef4444',
      wickUpColor: '#22c55e',
    });

    // Convert candle data to Lightweight Charts format
    const chartData: CandlestickData[] = mockCandles.map(candle => ({
      time: candle.time as any,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    }));

    candlestickSeries.setData(chartData);

    // Add indicators based on chart settings
    chart.indicators?.forEach((indicator: any) => {
      if (!indicator.enabled) return;

      switch (indicator.name) {
        case 'EMA':
          if (indicator.subSettings?.ema9) {
            const ema9Series = newChart.addLineSeries({
              color: '#ff6b6b',
              lineWidth: 1,
              title: 'EMA 9',
            });
            ema9Series.setData(mockIndicators.ema[9] as LineData[]);
          }
          if (indicator.subSettings?.ema21) {
            const ema21Series = newChart.addLineSeries({
              color: '#4ecdc4',
              lineWidth: 1,
              title: 'EMA 21',
            });
            ema21Series.setData(mockIndicators.ema[21] as LineData[]);
          }
          if (indicator.subSettings?.ema50) {
            const ema50Series = newChart.addLineSeries({
              color: '#45b7d1',
              lineWidth: 1,
              title: 'EMA 50',
            });
            ema50Series.setData(mockIndicators.ema[50] as LineData[]);
          }
          if (indicator.subSettings?.ema200) {
            const ema200Series = newChart.addLineSeries({
              color: '#f39c12',
              lineWidth: 2,
              title: 'EMA 200',
            });
            ema200Series.setData(mockIndicators.ema[200] as LineData[]);
          }
          break;

        case 'VWAP':
          const vwapSeries = newChart.addLineSeries({
            color: '#9b59b6',
            lineWidth: 2,
            lineStyle: 1, // dashed
            title: 'VWAP',
          });
          vwapSeries.setData(mockIndicators.vwap as LineData[]);
          break;
      }
    });

    chartRef.current = newChart;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ 
          width: chartContainerRef.current.clientWidth 
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [chart]);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold">{chart.symbol}</h3>
          <span className="text-sm text-muted-foreground">{chart.timeframe}</span>
          {chart.indicators?.filter((i: any) => i.enabled).map((indicator: any) => (
            <span key={indicator.id} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
              {indicator.name}
            </span>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4" />
          </Button>
          {onRemove && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div ref={chartContainerRef} className="w-full h-96" />

      {showSettings && (
        <div className="mt-4 border-t pt-4">
          <ChartSettings
            chart={chart}
            onClose={() => setShowSettings(false)}
          />
        </div>
      )}
    </Card>
  );
};