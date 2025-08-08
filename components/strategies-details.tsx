"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDateRangePicker } from "@/components/date-range-picker"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Search, TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react'

// Mock data for individual strategy
const strategyData = {
  id: "momentum-1",
  name: "Momentum Breakout",
  description: "Trades breakouts from key resistance levels",
  totalPnL: 12450.75,
  winRate: 68.5,
  totalTrades: 147,
  maxDrawdown: -2150.30,
  sharpeRatio: 1.85,
  status: "active",
}

// Mock equity curve data
const equityData = [
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
]

// Mock trade history
const tradeHistory = [
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
  {
    id: "4",
    date: "2024-01-13T11:20:00Z",
    symbol: "BTC/USD",
    direction: "Long",
    entryPrice: 41800.25,
    exitPrice: 41650.75,
    pnL: -74.75,
    notes: "Stop loss triggered",
  },
  {
    id: "5",
    date: "2024-01-12T15:30:00Z",
    symbol: "ETH/USD",
    direction: "Long",
    entryPrice: 2180.30,
    exitPrice: 2245.80,
    pnL: 327.50,
    notes: "Strong momentum follow-through",
  },
]

export function StrategiesDetails() {
  const [selectedStrategy, setSelectedStrategy] = useState("momentum-1")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSymbol, setSelectedSymbol] = useState("all")

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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const filteredTrades = tradeHistory.filter(
    (trade) =>
      trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trade.direction.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trade.notes.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Strategy Selection */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
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
        <CalendarDateRangePicker />
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

      {/* Strategy Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(strategyData.totalPnL)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{strategyData.winRate}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{strategyData.totalTrades}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Max Drawdown</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(strategyData.maxDrawdown)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{strategyData.sharpeRatio}</div>
          </CardContent>
        </Card>
      </div>

      {/* Equity Curve */}
      <Card>
        <CardHeader>
          <CardTitle>Equity Curve</CardTitle>
          <CardDescription>Strategy performance over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] sm:h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={equityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div>
              <CardTitle>Trade History</CardTitle>
              <CardDescription>Detailed trade records for this strategy</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
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
                  <TableHead>Date</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Direction</TableHead>
                  <TableHead>Entry Price</TableHead>
                  <TableHead>Exit Price</TableHead>
                  <TableHead className="text-right">P&L</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrades.map((trade) => (
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
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
