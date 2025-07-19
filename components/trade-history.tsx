"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
  // ... (previous mock data remains the same)
]

export function TradeHistory() {
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
    <Card>
      <CardHeader>
        <CardTitle>Trade History</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  )
}
