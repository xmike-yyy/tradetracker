export interface Trade {
  id: string;
  symbol: string;
  side: 'LONG' | 'SHORT';
  profit: number;
  date: Date;
  notes: string;
}

export interface TradeStats {
  totalTrades: number;
  winRate: number;
  profitFactor: number;
  totalProfit: number;
}