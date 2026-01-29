
export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface CandleData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface FundamentalData {
  per: string;
  pbr: string;
  eps: string;
  marketCap: string;
  dividendYield: string;
  sources: { title: string; uri: string }[];
}

export interface TechnicalAnalysis {
  support: number[];
  resistance: number[];
  trend: 'Bullish' | 'Bearish' | 'Neutral';
  summary: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
}
