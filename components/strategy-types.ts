export type TradeSide = "LONG" | "SHORT"

export interface StrategyTrade {
  id: string
  strategyId: string
  strategyName: string
  date: string // ISO date
  symbol: string
  side: TradeSide
  quantity: number
  entryPrice: number
  exitPrice: number
  pnl: number // profit/loss in quote currency
}

export interface StrategyDefinition {
  id: string
  name: string
  description?: string
}

export interface StrategyMetrics {
  strategyId: string
  strategyName: string
  pnl: number
  winRate: number
  totalTrades: number
  bestPairs: { symbol: string; pnl: number }[]
  equityCurve: { date: string; equity: number }[]
  maxDrawdown: {
    value: number // expressed as negative number for drawdown (e.g., -0.12 for -12%)
    peakDate?: string
    troughDate?: string
  }
}
