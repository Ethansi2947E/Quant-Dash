"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, Clock, Filter, RefreshCw } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data for active trades
const activeTrades = [
  {
    id: "1",
    symbol: "BTC/USD",
    type: "buy",
    entryPrice: 42350.75,
    currentPrice: 43100.25,
    stopLoss: 41500.0,
    takeProfit: 45000.0,
    duration: "2h 15m",
    status: "profit",
    profitLoss: 749.5,
    profitLossPercentage: 1.77,
  },
  {
    id: "2",
    symbol: "ETH/USD",
    type: "buy",
    entryPrice: 2250.5,
    currentPrice: 2310.75,
    stopLoss: 2150.0,
    takeProfit: 2400.0,
    duration: "4h 30m",
    status: "profit",
    profitLoss: 60.25,
    profitLossPercentage: 2.68,
  },
  {
    id: "3",
    symbol: "SOL/USD",
    type: "sell",
    entryPrice: 105.25,
    currentPrice: 102.5,
    stopLoss: 110.0,
    takeProfit: 95.0,
    duration: "1h 45m",
    status: "profit",
    profitLoss: 2.75,
    profitLossPercentage: 2.61,
  },
  {
    id: "4",
    symbol: "XRP/USD",
    type: "buy",
    entryPrice: 0.5125,
    currentPrice: 0.495,
    stopLoss: 0.48,
    takeProfit: 0.55,
    duration: "3h 10m",
    status: "loss",
    profitLoss: -0.0175,
    profitLossPercentage: -3.42,
  },
  {
    id: "5",
    symbol: "ADA/USD",
    type: "buy",
    entryPrice: 0.385,
    currentPrice: 0.3825,
    stopLoss: 0.37,
    takeProfit: 0.41,
    duration: "5h 25m",
    status: "loss",
    profitLoss: -0.0025,
    profitLossPercentage: -0.65,
  },
]

export function ActiveTrades() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const tradesCopy = [...activeTrades]

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0">
        <CardTitle className="flex-1">Active Trades</CardTitle>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1 w-full sm:w-auto bg-transparent">
                <Filter className="h-3.5 w-3.5" />
                <span>Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>All Trades</DropdownMenuItem>
              <DropdownMenuItem>Buy Orders</DropdownMenuItem>
              <DropdownMenuItem>Sell Orders</DropdownMenuItem>
              <DropdownMenuItem>Profitable Trades</DropdownMenuItem>
              <DropdownMenuItem>Losing Trades</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 w-full sm:w-auto bg-transparent"
            onClick={handleRefresh}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="rounded-md border min-w-[800px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[100px]">Symbol</TableHead>
                  <TableHead className="min-w-[80px]">Type</TableHead>
                  <TableHead className="min-w-[100px]">Entry Price</TableHead>
                  <TableHead className="min-w-[110px]">Current Price</TableHead>
                  <TableHead className="min-w-[100px]">Stop Loss</TableHead>
                  <TableHead className="min-w-[110px]">Take Profit</TableHead>
                  <TableHead className="min-w-[100px]">Duration</TableHead>
                  <TableHead className="text-right min-w-[120px]">P/L</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tradesCopy.map((trade) => (
                  <TableRow key={trade.id} className="group animate-fadeIn">
                    <TableCell className="font-medium">{trade.symbol}</TableCell>
                    <TableCell>
                      <Badge
                        variant={trade.type === "buy" ? "default" : "secondary"}
                        className={`${trade.type === "buy" ? "bg-green-500" : "bg-red-500"} text-white text-xs`}
                      >
                        {trade.type.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">${trade.entryPrice.toFixed(2)}</TableCell>
                    <TableCell className="relative">
                      <div className="flex items-center">
                        <span className="text-sm">${trade.currentPrice.toFixed(2)}</span>
                        {trade.currentPrice > trade.entryPrice && trade.type === "buy" ? (
                          <ArrowUp className="ml-1 h-3 w-3 text-green-500" />
                        ) : trade.currentPrice < trade.entryPrice && trade.type === "sell" ? (
                          <ArrowDown className="ml-1 h-3 w-3 text-green-500" />
                        ) : (
                          <ArrowDown className="ml-1 h-3 w-3 text-red-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">${trade.stopLoss.toFixed(2)}</TableCell>
                    <TableCell className="text-sm">${trade.takeProfit.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{trade.duration}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`font-medium text-sm ${trade.status === "profit" ? "text-green-500" : "text-red-500"}`}
                      >
                        {trade.status === "profit" ? "+" : ""}${Math.abs(trade.profitLoss).toFixed(2)} (
                        {trade.status === "profit" ? "+" : ""}
                        {trade.profitLossPercentage.toFixed(2)}%)
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
