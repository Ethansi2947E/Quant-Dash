"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDateRangePicker } from "@/components/date-range-picker"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Search, TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react'

// Mock data for strategies
const strategiesData = {
  "momentum-1": {
    id: "momentum-1",
    name: "Momentum Breakout",
    description: "Trades breakouts from key resistance levels",
    totalPnL: 12450.75,
    winRate: 68.5,
    totalTrades: 147,
    maxDrawdown: -2150.30,
    sharpeRatio: 1.85,
    status: "active",
  },
  "mean-reversion-1": {
    id: "mean-reversion-1",
    name: "Mean Reversion",
    description: "Capitalizes on price reversals from extreme levels",
    totalPnL: 8920.30,
    winRate: 72.3,
    totalTrades: 203,
    maxDrawdown: -1850.45,
    sharpeRatio: 2.12,
    status: "active",
  },
  "scalping-1": {
    id: "scalping-1",
    name: "High-Frequency Scalping",
    description: "Quick trades on small price movements",
    totalPnL: -1250.45,
    winRate: 45.2,
    totalTrades: 892,
    maxDrawdown: -3200.75,
    sharpeRatio: -0.45,
    status: "paused",
  },
  "trend-following-1": {
    id: "trend-following-1",
    name: "Trend Following",
    description: "Follows established market trends",
    totalPnL: 15680.90,
    winRate: 58.7,
    totalTrades: 89,
    maxDrawdown: -1950.20,
    sharpeRatio: 1.95,
    status: "active",
  },
}

// Mock equity curve data for different strategies
const equityDataMap = {
  "momentum-1": [
    { date: "2024-01-01", equity: 10000, drawdown: 0 },
    { date: "2024-01-02", equity: 10250, drawdown: 0 },
    { date: "2024-01-03", equity: 10180, drawdown: -70 },
    { date: "2024-01-04", equity: 10420, drawdown: 0 },
    { date: "2024-01-05", equity: 10380, drawdown: -40 },
    { date: "2024-01-06", equity: 10650, drawdown: 0 },
    { date: "2024-01-07", equity: 10580, drawdown: -70 },
    { date: "2024-01-08", equity: 10820, drawdown: 0 },
    { date: "2024-01-09", equity: 10750, drawdown: -70 },
    { date: "2024-01-10", equity: 11000, drawdown: 0 },
    { date: "2024-01-11", equity: 11180, drawdown: 0 },
    { date: "2024-01-12", equity: 11050, drawdown: -130 },
    { date: "2024-01-13", equity: 11320, drawdown: 0 },
    { date: "2024-01-14", equity: 11280, drawdown: -40 },
    { date: "2024-01-15", equity: 11450, drawdown: 0 },
  ],
  "mean-reversion-1": [
    { date: "2024-01-01", equity: 10000, drawdown: 0 },
    { date: "2024-01-02", equity: 10150, drawdown: 0 },
    { date: "2024-01-03", equity: 10320, drawdown: 0 },
    { date: "2024-01-04", equity: 10280, drawdown: -40 },
    { date: "2024-01-05", equity: 10450, drawdown: 0 },
    { date: "2024-01-06", equity: 10520, drawdown: 0 },
    { date: "2024-01-07", equity: 10480, drawdown: -40 },
    { date: "2024-01-08", equity: 10650, drawdown: 0 },
    { date: "2024-01-09", equity: 10720, drawdown: 0 },
    { date: "2024-01-10", equity: 10680, drawdown: -40 },
    { date: "2024-01-11", equity: 10850, drawdown: 0 },
    { date: "2024-01-12", equity: 10920, drawdown: 0 },
    { date: "2024-01-13", equity: 10880, drawdown: -40 },
    { date: "2024-01-14", equity: 11050, drawdown: 0 },
    { date: "2024-01-15", equity: 11120, drawdown: 0 },
  ],
  "scalping-1": [
    { date: "2024-01-01", equity: 10000, drawdown: 0 },
    { date: "2024-01-02", equity: 9950, drawdown: -50 },
    { date: "2024-01-03", equity: 9920, drawdown: -80 },
    { date: "2024-01-04", equity: 9880, drawdown: -120 },
    { date: "2024-01-05", equity: 9850, drawdown: -150 },
    { date: "2024-01-06", equity: 9820, drawdown: -180 },
    { date: "2024-01-07", equity: 9780, drawdown: -220 },
    { date: "2024-01-08", equity: 9750, drawdown: -250 },
    { date: "2024-01-09", equity: 9720, drawdown: -280 },
    { date: "2024-01-10", equity: 9680, drawdown: -320 },
    { date: "2024-01-11", equity: 9650, drawdown: -350 },
    { date: "2024-01-12", equity: 9620, drawdown: -380 },
    { date: "2024-01-13", equity: 9580, drawdown: -420 },
    { date: "2024-01-14", equity: 9550, drawdown: -450 },
    { date: "2024-01-15", equity: 9520, drawdown: -480 },
  ],
  "trend-following-1": [
    { date: "2024-01-01", equity: 10000, drawdown: 0 },
    { date: "2024-01-02", equity: 10180, drawdown: 0 },
    { date: "2024-01-03", equity: 10350, drawdown: 0 },
    { date: "2024-01-04", equity: 10520, drawdown: 0 },
    { date: "2024-01-05", equity: 10480, drawdown: -40 },
    { date: "2024-01-06", equity: 10650, drawdown: 0 },
    { date: "2024-01-07", equity: 10820, drawdown: 0 },
    { date: "2024-01-08", equity: 10980, drawdown: 0 },
    { date: "2024-01-09", equity: 11150, drawdown: 0 },
    { date: "2024-01-10", equity: 11320, drawdown: 0 },
    { date: "2024-01-11", equity: 11480, drawdown: 0 },
    { date: "2024-01-12", equity: 11650, drawdown: 0 },
    { date: "2024-01-13", equity: 11820, drawdown: 0 },
    { date: "2024-01-14", equity: 11980, drawdown: 0 },
    { date: "2024-01-15", equity: 12150, drawdown: 0 },
  ],
}

// Mock trade history for different strategies
const tradeHistoryMap = {
  "momentum-1": [
    {
      id: "1",
      date: "2024-01-15T14:30:00Z",
      symbol: "BTC/USD",
      direction: "Long",
      entryPrice: 42350.75,
      exitPrice: 43100.25,
      pnL: 374.75,
      notes: "Breakout above resistance",
    },
    {
      id: "2",
      date: "2024-01-14T16:45:00Z",
      symbol: "ETH/USD",
      direction: "Long",
      entryPrice: 2250.50,
      exitPrice: 2310.75,
      pnL: 150.63,
      notes: "Volume confirmation",
    },
    {
      id: "3",
      date: "2024-01-14T09:15:00Z",
      symbol: "SOL/USD",
      direction: "Short",
      entryPrice: 105.25,
      exitPrice: 102.50,
      pnL: 137.50,
      notes: "Failed breakout reversal",
    },
  ],
  "mean-reversion-1": [
    {
      id: "1",
      date: "2024-01-15T11:20:00Z",
      symbol: "BTC/USD",
      direction: "Long",
      entryPrice: 41800.25,
      exitPrice: 42150.75,
      pnL: 175.25,
      notes: "Oversold bounce",
    },
    {
      id: "2",
      date: "2024-01-14T13:30:00Z",
      symbol: "ETH/USD",
      direction: "Short",
      entryPrice: 2380.50,
      exitPrice: 2320.75,
      pnL: 119.50,
      notes: "Overbought reversal",
    },
  ],
  "scalping-1": [
    {
      id: "1",
      date: "2024-01-15T09:45:00Z",
      symbol: "BTC/USD",
      direction: "Long",
      entryPrice: 42100.25,
      exitPrice: 42080.75,
      pnL: -9.75,
      notes: "Quick scalp attempt",
    },
    {
      id: "2",
      date: "2024-01-15T09:30:00Z",
      symbol: "BTC/USD",
      direction: "Short",
      entryPrice: 42150.50,
      exitPrice: 42140.25,
      pnL: 5.13,
      notes: "Small profit scalp",
    },
  ],
  "trend-following-1": [
    {
      id: "1",
      date: "2024-01-15T10:15:00Z",
      symbol: "BTC/USD",
      direction: "Long",
      entryPrice: 41500.25,
      exitPrice: 42800.75,
      pnL: 650.25,
      notes: "Strong trend continuation",
    },
    {
      id: "2",
      date: "2024-01-12T14:20:00Z",
      symbol: "ETH/USD",
      direction: "Long",
      entryPrice: 2180.50,
      exitPrice: 2420.75,
      pnL: 480.50,
      notes: "Uptrend follow-through",
    },
  ],
}

interface StrategiesDetailsProps {
  selectedStrategy: string
  onStrategyChange: (strategyId: string) => void
}

export function StrategiesDetails({ selectedStrategy, onStrategyChange }: StrategiesDetailsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSymbol, setSelectedSymbol] = useState("all")

  const currentStrategy = strategiesData[selectedStrategy as keyof typeof strategiesData]
  const equityData = equityDataMap[selectedStrategy as keyof typeof equityDataMap] || []
  const tradeHistory = tradeHistoryMap[selectedStrategy as keyof typeof tradeHistoryMap] || []

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const filteredTrades = tradeHistory.filter(
    (trade) =>
      trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trade.direction.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trade.notes.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!currentStrategy) {
    return <div>Strategy not found</div>
  }

  return (
    <div className="space-y-6">
      {/* Strategy Selection */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <Select value={selectedStrategy} onValueChange={onStrategyChange}>
          <SelectTrigger className="w-full sm:w-[300px]">
            <SelectValue placeholder="Select strategy" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="momentum-1">Momentum Breakout</SelectItem>
            <SelectItem value="mean-reversion-1">Mean Reversion</SelectItem>
            <SelectItem value="scalping-1">High-Frequency Scalping</SelectItem>
            <SelectItem value="trend-following-1">Trend Following</SelectItem>
          </SelectContent>
        </Select>
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
          </SelectContent>
        </Select>
      </div>

      {/* Strategy Info */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle className="text-xl lg:text-2xl">{currentStrategy.name}</CardTitle>
            <CardDescription className="mt-1 text-sm lg:text-base">
              {currentStrategy.description}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      {/* Strategy Metrics */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-xl lg:text-2xl font-bold ${currentStrategy.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(currentStrategy.totalPnL)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl lg:text-2xl font-bold">{currentStrategy.winRate}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl lg:text-2xl font-bold">{currentStrategy.totalTrades}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Max Drawdown</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl lg:text-2xl font-bold text-red-600">
              {formatCurrency(currentStrategy.maxDrawdown)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-xl lg:text-2xl font-bold ${currentStrategy.sharpeRatio >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {currentStrategy.sharpeRatio}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Equity Curve */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg lg:text-xl">Equity Curve</CardTitle>
          <CardDescription>Strategy performance over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] sm:h-[400px] lg:h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={equityData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorDrawdown" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  type="category"
                />
                <YAxis
                  tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  domain={['dataMin - 500', 'dataMax + 500']}
                />
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                <Tooltip
                  formatter={(value, name) => [formatCurrency(Number(value)), name]}
                  labelFormatter={(label) => formatDate(label)}
                />
                <Area
                  type="monotone"
                  dataKey="equity"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorEquity)"
                  strokeWidth={2}
                  name="Equity"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Trade History */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <CardTitle className="text-lg lg:text-xl">Trade History</CardTitle>
              <CardDescription>Detailed trade records for this strategy</CardDescription>
            </div>
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search trades..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[140px]">Date</TableHead>
                  <TableHead className="min-w-[80px]">Symbol</TableHead>
                  <TableHead className="min-w-[80px]">Direction</TableHead>
                  <TableHead className="min-w-[100px]">Entry Price</TableHead>
                  <TableHead className="min-w-[100px]">Exit Price</TableHead>
                  <TableHead className="text-right min-w-[100px]">P&L</TableHead>
                  <TableHead className="min-w-[200px]">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrades.length > 0 ? (
                  filteredTrades.map((trade) => (
                    <TableRow key={trade.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {formatDateTime(trade.date)}
                      </TableCell>
                      <TableCell>{trade.symbol}</TableCell>
                      <TableCell>
                        <Badge
                          variant={trade.direction === "Long" ? "default" : "secondary"}
                          className={`${
                            trade.direction === "Long" ? "bg-green-500" : "bg-red-500"
                          } text-white`}
                        >
                          {trade.direction}
                        </Badge>
                      </TableCell>
                      <TableCell>${trade.entryPrice.toFixed(2)}</TableCell>
                      <TableCell>${trade.exitPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`font-medium ${
                            trade.pnL >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {trade.pnL >= 0 ? "+" : ""}
                          {formatCurrency(trade.pnL)}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {trade.notes}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No trades found for this strategy
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
