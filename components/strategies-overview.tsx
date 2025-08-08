"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDateRangePicker } from "@/components/date-range-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react'
import { DateRange } from "react-day-picker"

type StrategyOverview = {
  id: string
  name: string
  description: string
  totalPnL: number
  winRate: number
  totalTrades: number
  status: string
  topPairs: string[]
  lastTrade: string | null
  bestPair: { symbol: string; pnl: number; trades: number }
  worstPair: { symbol: string; pnl: number; trades: number }
}

interface StrategiesOverviewProps {
  strategies: StrategyOverview[]
  onViewDetails: (strategyId: string) => void
  availableAssets: string[]
  selectedSymbol: string
  onSymbolChange: (symbol: string) => void
  dateRange: DateRange | undefined
  onDateChange: (dateRange: DateRange | undefined) => void
}

export function StrategiesOverview({ 
  strategies: strategiesData, 
  onViewDetails,
  availableAssets,
  selectedSymbol,
  onSymbolChange,
  dateRange,
  onDateChange,
}: StrategiesOverviewProps) {

  // Calculate aggregated metrics from the filtered data passed in props
  const totalPnL = strategiesData.reduce((sum, strategy) => sum + (strategy.totalPnL || 0), 0)
  const totalTrades = strategiesData.reduce((sum, strategy) => sum + (strategy.totalTrades || 0), 0)
  const avgWinRate = strategiesData.length > 0
    ? strategiesData.reduce((sum, strategy) => sum + (strategy.winRate || 0), 0) / strategiesData.length
    : 0

  // Get top performing pairs across all strategies in the current view
  const allPairs = strategiesData.flatMap(strategy => strategy.topPairs)
  const pairCounts = allPairs.reduce((acc, pair) => {
    acc[pair] = (acc[pair] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  const topPairs = Object.entries(pairCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([pair]) => pair)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }
  
  if (!strategiesData) {
    return <div className="py-8 text-sm text-muted-foreground">Loading...</div>
  }
  if (strategiesData.length === 0) {
    return <div className="py-8 text-sm text-muted-foreground">No strategies found for the selected filters.</div>
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="w-full sm:w-auto">
          <CalendarDateRangePicker date={dateRange} onDateChange={onDateChange} />
        </div>
        <Select value={selectedSymbol} onValueChange={onSymbolChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by symbol" />
          </SelectTrigger>
          <SelectContent>
            {availableAssets.map(asset => (
              <SelectItem key={asset} value={asset}>{asset}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Aggregated Metrics */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalPnL)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all strategies
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Win Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgWinRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Weighted average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTrades.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              All strategies combined
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Pairs</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {topPairs.map((pair) => (
                <Badge key={pair} variant="secondary" className="text-xs">
                  {pair}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Most traded pairs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Strategy Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Strategy Performance</h3>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {strategiesData.map((strategy) => (
            <Card key={strategy.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div>
                  <CardTitle className="text-lg leading-tight">{strategy.name}</CardTitle>
                  <CardDescription className="mt-1 text-sm">
                    {strategy.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className={`text-base lg:text-lg font-bold ${strategy.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {strategy.totalPnL >= 0 ? '+' : ''}{formatCurrency(strategy.totalPnL)}
                    </div>
                    <p className="text-xs text-muted-foreground">P&L</p>
                  </div>
                  <div>
                    <div className="text-base lg:text-lg font-bold">{strategy.winRate}%</div>
                    <p className="text-xs text-muted-foreground">Win Rate</p>
                  </div>
                  <div>
                    <div className="text-base lg:text-lg font-bold">{strategy.totalTrades}</div>
                    <p className="text-xs text-muted-foreground">Trades</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Top Pairs:</p>
                  <div className="flex flex-wrap gap-1">
                    {strategy.topPairs.map((pair) => (
                      <Badge key={pair} variant="outline" className="text-xs">
                        {pair}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Key Pairs:</p>
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-green-600">Best:</span>
                    <span>
                      {strategy.bestPair.symbol} ({formatCurrency(strategy.bestPair.pnl)}) · {strategy.bestPair.trades} trades
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-red-600">Worst:</span>
                    <span>
                      {strategy.worstPair.symbol} ({formatCurrency(strategy.worstPair.pnl)}) · {strategy.worstPair.trades} trades
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    Last trade: {strategy.lastTrade ? formatDate(strategy.lastTrade) : "N/A"}
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onViewDetails(strategy.id)}
                    className="shrink-0"
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
