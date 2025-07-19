"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown, Search } from "lucide-react"

// Mock data for trade history
const tradeHistory = [
  {
    id: "1",
    openTime: "2023-06-15T10:30:00Z",
    closeTime: "2023-06-15T14:45:00Z",
    symbol: "BTC/USD",
    type: "buy",
    openPrice: 42350.75,
    closePrice: 43100.25,
    size: 0.5,
    profitLoss: 374.75,
    profitLossPercentage: 1.77,
    status: "win",
  },
  {
    id: "2",
    openTime: "2023-06-14T15:20:00Z",
    closeTime: "2023-06-14T19:50:00Z",
    symbol: "ETH/USD",
    type: "buy",
    openPrice: 2250.5,
    closePrice: 2310.75,
    size: 2.5,
    profitLoss: 150.63,
    profitLossPercentage: 2.68,
    status: "win",
  },
  {
    id: "3",
    openTime: "2023-06-14T09:15:00Z",
    closeTime: "2023-06-14T11:00:00Z",
    symbol: "SOL/USD",
    type: "sell",
    openPrice: 105.25,
    closePrice: 102.5,
    size: 10,
    profitLoss: 27.5,
    profitLossPercentage: 2.61,
    status: "win",
  },
  {
    id: "4",
    openTime: "2023-06-13T14:30:00Z",
    closeTime: "2023-06-13T17:40:00Z",
    symbol: "XRP/USD",
    type: "buy",
    openPrice: 0.5125,
    closePrice: 0.495,
    size: 1000,
    profitLoss: -17.5,
    profitLossPercentage: -3.42,
    status: "loss",
  },
  {
    id: "5",
    openTime: "2023-06-13T08:45:00Z",
    closeTime: "2023-06-13T14:10:00Z",
    symbol: "ADA/USD",
    type: "buy",
    openPrice: 0.385,
    closePrice: 0.3825,
    size: 2500,
    profitLoss: -6.25,
    profitLossPercentage: -0.65,
    status: "loss",
  },
  {
    id: "6",
    openTime: "2023-06-12T11:20:00Z",
    closeTime: "2023-06-12T16:30:00Z",
    symbol: "BTC/USD",
    type: "sell",
    openPrice: 43200.5,
    closePrice: 42800.25,
    size: 0.3,
    profitLoss: 120.08,
    profitLossPercentage: 0.93,
    status: "win",
  },
  {
    id: "7",
    openTime: "2023-06-12T09:10:00Z",
    closeTime: "2023-06-12T13:45:00Z",
    symbol: "ETH/USD",
    type: "buy",
    openPrice: 2220.75,
    closePrice: 2280.5,
    size: 1.8,
    profitLoss: 107.55,
    profitLossPercentage: 2.69,
    status: "win",
  },
  {
    id: "8",
    openTime: "2023-06-11T16:30:00Z",
    closeTime: "2023-06-11T19:15:00Z",
    symbol: "DOGE/USD",
    type: "buy",
    openPrice: 0.0725,
    closePrice: 0.0695,
    size: 15000,
    profitLoss: -45.0,
    profitLossPercentage: -4.14,
    status: "loss",
  },
  {
    id: "9",
    openTime: "2023-06-11T10:45:00Z",
    closeTime: "2023-06-11T14:20:00Z",
    symbol: "LINK/USD",
    type: "buy",
    openPrice: 15.75,
    closePrice: 16.25,
    size: 50,
    profitLoss: 25.0,
    profitLossPercentage: 3.17,
    status: "win",
  },
  {
    id: "10",
    openTime: "2023-06-10T13:15:00Z",
    closeTime: "2023-06-10T17:40:00Z",
    symbol: "BTC/USD",
    type: "buy",
    openPrice: 42100.25,
    closePrice: 42950.5,
    size: 0.4,
    profitLoss: 340.1,
    profitLossPercentage: 2.02,
    status: "win",
  },
]

export function TradeHistoryTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("Date (Newest)")

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const filteredTrades = tradeHistory.filter(
    (trade) =>
      trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trade.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedTrades = [...filteredTrades].sort((a, b) => {
    switch (sortBy) {
      case "Date (Newest)":
        return new Date(b.openTime).getTime() - new Date(a.openTime).getTime()
      case "Date (Oldest)":
        return new Date(a.openTime).getTime() - new Date(b.openTime).getTime()
      case "Profit (Highest)":
        return b.profitLoss - a.profitLoss
      case "Profit (Lowest)":
        return a.profitLoss - b.profitLoss
      default:
        return 0
    }
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-64">
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
            <Button variant="outline" className="gap-1">
              <span>Sort by: {sortBy}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSortBy("Date (Newest)")}>Date (Newest)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("Date (Oldest)")}>Date (Oldest)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("Profit (Highest)")}>Profit (Highest)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("Profit (Lowest)")}>Profit (Lowest)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Open Time</TableHead>
              <TableHead>Close Time</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Open Price</TableHead>
              <TableHead>Close Price</TableHead>
              <TableHead className="text-right">P/L</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTrades.map((trade) => (
              <TableRow key={trade.id}>
                <TableCell>{formatDate(trade.openTime)}</TableCell>
                <TableCell>{formatDate(trade.closeTime)}</TableCell>
                <TableCell className="font-medium">{trade.symbol}</TableCell>
                <TableCell>
                  <Badge
                    variant={trade.type === "buy" ? "default" : "secondary"}
                    className={`${trade.type === "buy" ? "bg-green-500" : "bg-red-500"} text-white`}
                  >
                    {trade.type.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>{trade.size}</TableCell>
                <TableCell>${trade.openPrice.toFixed(2)}</TableCell>
                <TableCell>${trade.closePrice.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <span className={`font-medium ${trade.status === "win" ? "text-green-500" : "text-red-500"}`}>
                    {trade.status === "win" ? "+" : ""}${Math.abs(trade.profitLoss).toFixed(2)} (
                    {trade.status === "win" ? "+" : ""}
                    {trade.profitLossPercentage.toFixed(2)}%)
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
