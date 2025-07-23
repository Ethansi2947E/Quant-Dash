"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDebounce } from "@/hooks/use-debounce"

interface Trade {
    id: string;
    open_time: string;
    close_time: string;
    symbol: string;
    order_type: string;
    open_price: number;
    close_price: number;
    volume: number;
    profit: number;
    // These are calculated on the frontend for display
    status: "win" | "loss";
    profitLossPercentage: number;
}

const SORT_OPTIONS = {
  "Date (Newest)": { sortBy: "close_time", sortOrder: "desc" },
  "Date (Oldest)": { sortBy: "close_time", sortOrder: "asc" },
  "Profit (Highest)": { sortBy: "profit", sortOrder: "desc" },
  "Profit (Lowest)": { sortBy: "profit", sortOrder: "asc" },
};

export function TradeHistory() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [totalTrades, setTotalTrades] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeSort, setActiveSort] = useState("Date (Newest)")
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  useEffect(() => {
    async function fetchTrades() {
      setLoading(true)
      const { sortBy, sortOrder } = SORT_OPTIONS[activeSort];
      const params = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize),
        sort_by: sortBy,
        sort_order: sortOrder,
      })
      if (debouncedSearchTerm) {
        params.append("search", debouncedSearchTerm)
      }
      
      try {
        const response = await fetch(`/api/history?${params.toString()}`)
        const data = await response.json()
        setTrades(data.trades)
        setTotalTrades(data.total_trades)
      } catch (error) {
        console.error("Failed to fetch trade history:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTrades()
  }, [page, pageSize, activeSort, debouncedSearchTerm])
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const processedTrades = useMemo(() => {
    return trades.map(trade => ({
      ...trade,
      status: trade.profit >= 0 ? "win" : "loss",
      profitLossPercentage: (trade.profit / (trade.open_price * trade.volume)) * 100
    }))
  }, [trades])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search trades..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1 w-full sm:w-auto bg-transparent">
                  <span className="truncate">Sort by: {activeSort}</span>
                  <ChevronDown className="h-4 w-4 flex-shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.keys(SORT_OPTIONS).map(option => (
                  <DropdownMenuItem key={option} onClick={() => setActiveSort(option)}>
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="overflow-x-auto">
            <div className="rounded-md border min-w-[900px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[140px]">Open Time</TableHead>
                    <TableHead className="min-w-[140px]">Close Time</TableHead>
                    <TableHead className="min-w-[100px]">Symbol</TableHead>
                    <TableHead className="min-w-[80px]">Type</TableHead>
                    <TableHead className="min-w-[80px]">Size</TableHead>
                    <TableHead className="min-w-[100px]">Open Price</TableHead>
                    <TableHead className="min-w-[100px]">Close Price</TableHead>
                    <TableHead className="text-right min-w-[120px]">P/L</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : processedTrades.length > 0 ? (
                    processedTrades.map((trade) => (
                      <TableRow key={trade.id}>
                        <TableCell className="text-sm">{formatDate(trade.open_time)}</TableCell>
                        <TableCell className="text-sm">{formatDate(trade.close_time)}</TableCell>
                        <TableCell className="font-medium">{trade.symbol}</TableCell>
                        <TableCell>
                          <Badge
                            variant={trade.order_type === "buy" ? "default" : "secondary"}
                            className={`${trade.order_type === "buy" ? "bg-green-500" : "bg-red-500"} text-white text-xs`}
                          >
                            {trade.order_type.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{trade.volume}</TableCell>
                        <TableCell className="text-sm">${trade.open_price.toFixed(2)}</TableCell>
                        <TableCell className="text-sm">${trade.close_price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <span
                            className={`font-medium text-sm ${trade.status === "win" ? "text-green-500" : "text-red-500"}`}
                          >
                            {trade.status === "win" ? "+" : ""}${Math.abs(trade.profit).toFixed(2)} (
                            {trade.status === "win" ? "+" : ""}
                            {trade.profitLossPercentage.toFixed(2)}%)
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        No trades found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {processedTrades.length} of {totalTrades} trades.
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => p + 1)}
                disabled={page * pageSize >= totalTrades}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
