"use client"

import { useState, useEffect } from "react"
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

interface ActiveTrade {
  ticket: string
  symbol: string
  order_type: "buy" | "sell"
  open_time: number
  open_price: number
  current_price: number
  volume: number
  sl: number
  tp: number
  profit: number
  swap: number
  comment: string
  magic: number
}

export function ActiveTrades() {
  const [trades, setTrades] = useState<ActiveTrade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchTrades = async () => {
    if (isRefreshing) return
    setIsRefreshing(true)
    try {
      const res = await fetch("/api/active-trades")
      if (!res.ok) {
        throw new Error(`Failed to fetch active trades: ${res.statusText}`)
      }
      const data: ActiveTrade[] = await res.json()
      setTrades(data)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsRefreshing(false)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrades()
    const intervalId = setInterval(fetchTrades, 5000) // Refresh every 5 seconds
    return () => clearInterval(intervalId)
  }, [])

  const formatTimestamp = (timestamp: number) => {
    if (!timestamp) return "N/A"
    return new Date(timestamp * 1000).toLocaleString()
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Active Trades</CardTitle>
        </CardHeader>
        <CardContent className="flex h-60 items-center justify-center">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2">Loading active trades...</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Active Trades</CardTitle>
        </CardHeader>
        <CardContent className="flex h-60 items-center justify-center">
          <span className="text-red-500">Error: {error}</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0">
        <CardTitle className="flex-1">Active Trades ({trades.length})</CardTitle>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 w-full sm:w-auto bg-transparent"
            onClick={fetchTrades}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="rounded-md border min-w-[900px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Open Time</TableHead>
                  <TableHead>Open Price</TableHead>
                  <TableHead>Current Price</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead>SL / TP</TableHead>
                  <TableHead className="text-right">Profit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trades.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No active trades found.
                    </TableCell>
                  </TableRow>
                ) : (
                  trades.map((trade) => {
                    const status = trade.profit >= 0 ? "profit" : "loss"
                    const isBuy = trade.order_type === "buy"
                    const isPriceUp = trade.current_price > trade.open_price
                    return (
                      <TableRow key={trade.ticket}>
                        <TableCell className="font-medium">{trade.symbol}</TableCell>
                        <TableCell>
                          <Badge
                            variant={isBuy ? "default" : "secondary"}
                            className={`${isBuy ? "bg-green-500" : "bg-red-500"} text-white text-xs`}
                          >
                            {trade.order_type.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{formatTimestamp(trade.open_time)}</TableCell>
                        <TableCell className="text-sm">${trade.open_price.toFixed(5)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span>${trade.current_price.toFixed(5)}</span>
                            {(isBuy && isPriceUp) || (!isBuy && !isPriceUp) ? (
                              <ArrowUp className="ml-1 h-3 w-3 text-green-500" />
                            ) : (
                              <ArrowDown className="ml-1 h-3 w-3 text-red-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{trade.volume}</TableCell>
                        <TableCell className="text-sm">
                          ${trade.sl.toFixed(5)} / ${trade.tp.toFixed(5)}
                        </TableCell>
                        <TableCell
                          className={`text-right font-medium ${
                            status === "profit" ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {status === "profit" ? "+" : ""}${trade.profit.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
