"use client"

import { useState, useEffect } from "react"
import { DateRange } from "react-day-picker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDateRangePicker } from "@/components/date-range-picker"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Search, TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react'

type StrategyDetails = {
  strategy: {
    id: string
    name: string
    description: string
    totalPnL: number
    winRate: number
    totalTrades: number
    maxDrawdown: number
    sharpeRatio: number
    status: string
  }
  equity: { date: string; equity: number; drawdown: number }[]
  trades: { id: string; date: string; symbol: string; direction: string; entryPrice: number; exitPrice: number; pnL: number; notes: string }[]
}

interface StrategiesDetailsProps {
  strategies: { id: string, name: string }[]
  selectedStrategy: string
  onStrategyChange: (strategyId: string) => void
  availableAssets: string[]
  selectedSymbol: string
  onSymbolChange: (symbol: string) => void
  dateRange: DateRange | undefined
  onDateChange: (range: DateRange | undefined) => void
}

export function StrategiesDetails({
  strategies,
  selectedStrategy,
  onStrategyChange,
  availableAssets,
  selectedSymbol,
  onSymbolChange,
  dateRange,
  onDateChange,
}: StrategiesDetailsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [details, setDetails] = useState<StrategyDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        // Build query params from filters
        const params = new URLSearchParams()
        if (selectedSymbol && selectedSymbol !== "All Assets") {
          params.append("asset", selectedSymbol)
        }
        if (dateRange?.from) {
          params.append("start_date", dateRange.from.toISOString().split("T")[0])
        }
        if (dateRange?.to) {
          params.append("end_date", dateRange.to.toISOString().split("T")[0])
        }

        const qs = params.toString()
        const url = qs ? `/api/strategies/${selectedStrategy}?${qs}` : `/api/strategies/${selectedStrategy}`
        const res = await fetch(url, { signal: controller.signal })
        if (!res.ok) throw new Error(`Failed to load strategy details: ${res.status}`)
        const data = await res.json()
        setDetails(data)
      } catch (e: any) {
        if (e?.name !== 'AbortError') setError(e.message || 'Failed to load')
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => controller.abort()
  }, [selectedStrategy, selectedSymbol, dateRange?.from, dateRange?.to])

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

  if (loading) {
    return <div className="py-8 text-sm text-muted-foreground">Loading strategy details...</div>
  }
  if (error) {
    return <div className="py-8 text-sm text-red-600">{error}</div>
  }
  if (!details) {
    return <div className="py-8 text-sm text-muted-foreground">No data</div>
  }

  const currentStrategy = details.strategy
  const equityData = details.equity
  const tradeHistory = details.trades

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
            {strategies.map((strategy) => (
              <SelectItem key={strategy.id} value={strategy.id}>
                {strategy.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="w-full sm:w-auto">
          <CalendarDateRangePicker date={dateRange} onDateChange={onDateChange} />
        </div>
        <Select value={selectedSymbol} onValueChange={onSymbolChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by symbol" />
          </SelectTrigger>
          <SelectContent>
            {availableAssets.map((asset) => (
              <SelectItem key={asset} value={asset}>
                {asset}
              </SelectItem>
            ))}
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
