/**
 * Chart Data Mapping Utilities
 * Converts API data to Lightweight Charts format
 */

import { CandlestickData, LineData, HistogramData } from 'lightweight-charts';

export interface PriceData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface IndicatorData {
  ema9?: number[];
  ema21?: number[];
  ema50?: number[];
  ema200?: number[];
  vwap?: number[];
  timestamps?: string[];
}

// Convert timestamp to lightweight charts format
export const convertTimestamp = (timestamp: string | number): number => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp * 1000);
  return Math.floor(date.getTime() / 1000);
};

// Map price data to candlestick format
export const mapToCandlestickData = (priceData: PriceData[]): CandlestickData[] => {
  return priceData.map(candle => ({
    time: convertTimestamp(candle.timestamp) as any,
    open: candle.open,
    high: candle.high,
    low: candle.low,
    close: candle.close,
  }));
};

// Map indicator data to line format
export const mapToLineData = (values: number[], timestamps: string[]): LineData[] => {
  return values.map((value, index) => ({
    time: convertTimestamp(timestamps[index]) as any,
    value: value,
  }));
};

// Map volume data to histogram format
export const mapToVolumeData = (priceData: PriceData[]): HistogramData[] => {
  return priceData
    .filter(candle => candle.volume !== undefined)
    .map(candle => ({
      time: convertTimestamp(candle.timestamp) as any,
      value: candle.volume!,
      color: candle.close >= candle.open ? 
        'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)',
    }));
};

// Generate sample data for testing
export const generateSampleCandleData = (count: number = 100): CandlestickData[] => {
  const data: CandlestickData[] = [];
  const now = Math.floor(Date.now() / 1000);
  let price = 19500;

  for (let i = count; i >= 0; i--) {
    const time = now - i * 300; // 5-minute intervals
    const change = (Math.random() - 0.5) * 100;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * 50;
    const low = Math.min(open, close) - Math.random() * 50;
    
    data.push({
      time: time as any,
      open,
      high,
      low,
      close,
    });
    
    price = close;
  }

  return data;
};

// Generate EMA data
export const generateSampleEMAData = (candleData: CandlestickData[], period: number): LineData[] => {
  const emaData: LineData[] = [];
  let ema = candleData[0]?.close || 19500;
  const multiplier = 2 / (period + 1);

  candleData.forEach((candle) => {
    ema = (candle.close * multiplier) + (ema * (1 - multiplier));
    emaData.push({
      time: candle.time,
      value: ema,
    });
  });

  return emaData;
};

// Generate VWAP data
export const generateSampleVWAPData = (candleData: CandlestickData[]): LineData[] => {
  return candleData.map((candle) => ({
    time: candle.time,
    value: (candle.high + candle.low + candle.close) / 3,
  }));
};