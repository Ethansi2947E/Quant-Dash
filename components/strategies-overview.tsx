"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDateRangePicker } from "@/components/date-range-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react'

// Mock data for strategies
const strategiesData = [
  {
    id: "momentum-1",
    name: "Momentum Breakout",
    description: "Trades breakouts from key resistance levels",
    totalPnL: 12450.75,
    winRate: 68.5,
    totalTrades: 147,
    status: "active",
    topPairs: ["BTC/USD", "ETH/USD", "SOL/USD"],
    lastTrade: "2024-01-15T14:30:00Z",
  },
  {
    id: "mean-reversion-1",
    name: "Mean Reversion",
    description: "Capitalizes on price reversals from extreme levels",
    totalPnL: 8920.30,
    winRate: 72.3,
    totalTrades: 203,
    status: "active",
    topPairs: ["BTC/USD", "ETH/USD", "ADA/USD"],
    lastTrade: "2024-01-15T16:45:00Z",
  },
  {
    id: "scalping-1",
    name: "High-Frequency Scalping",
    description: "Quick trades on small price movements",
    totalPnL: -1250.45,
    winRate: 45.2,
    totalTrades: 892,
    status: "paused",
    topPairs: ["BTC/USD", "ETH/USD", "XRP/USD"],
    lastTrade: "2024-01-14T09:15:00Z",
  },
  {
    id: "trend-following-1",
    name: "Trend Following",
    description: "Follows established market trends",
    totalPnL: 15680.90,
    winRate: 58.7,
    totalTrades: 89,
    status: "active",
    topPairs: ["BTC/USD", "ETH/USD", "LINK/USD"],
    lastTrade: "2024-01-15T18:20:00Z",
  },
]

interface StrategiesOverviewProps {
  onViewDetails: (strategyId: string) => void
}

export function StrategiesOverview({ onViewDetails }: StrategiesOverviewProps) {
  const [selectedSymbol, setSelectedSymbol] = useState("all")

  // Calculate aggregated metrics
  const totalPnL = strategiesData.reduce((sum, strategy) => sum + strategy.totalPnL, 0)
  const totalTrades = strategiesData.reduce((sum, strategy) => sum + strategy.totalTrades, 0)
  const avgWinRate = strategiesData.reduce((sum, strategy) => sum + strategy.winRate, 0) / strategiesData.length

  // Get top performing pairs across all strategies
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

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="w-full sm:w-auto">
          <CalendarDateRangePicker />
        </div>
        <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by symbol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Symbols</SelectItem>
            <SelectItem value="BTC/USD">BTC/USD</SelectItem>
            <SelectItem value="ETH/USD">ETH/USD</SelectItem>
            <SelectItem value="SOL/USD">SOL/USD</SelectItem>
            <SelectItem value="ADA/USD">ADA/USD</SelectItem>
            <SelectItem value="XRP/USD">XRP/USD</SelectItem>
            <SelectItem value="LINK/USD">LINK/USD</SelectItem>
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

                <div className="flex items-center justify-between pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    Last trade: {formatDate(strategy.lastTrade)}
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
