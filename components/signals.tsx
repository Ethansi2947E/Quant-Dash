"use client"

import { useState } from "react"
import { Info, RefreshCw, Search } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Mock data for signals
const signals = [
  {
    id: "1",
    timestamp: "2023-06-15T14:30:00Z",
    symbol: "BTC/USD",
    type: "buy",
    price: 42350.75,
    confidence: "high",
    explanation:
      "Strong bullish divergence on the 4-hour RSI, with price breaking above the 50-day moving average. Volume increasing with price action, suggesting strong buying pressure. MACD showing bullish crossover.",
  },
  {
    id: "2",
    timestamp: "2023-06-15T12:15:00Z",
    symbol: "ETH/USD",
    type: "buy",
    price: 2250.5,
    confidence: "medium",
    explanation:
      "Price bounced off major support level with increased volume. Stochastic RSI showing oversold conditions with potential reversal. ETH/BTC ratio improving, suggesting relative strength.",
  },
  {
    id: "3",
    timestamp: "2023-06-15T10:45:00Z",
    symbol: "SOL/USD",
    type: "sell",
    price: 105.25,
    confidence: "high",
    explanation:
      "Double top formation confirmed with price breaking below neckline. Decreasing volume on recent rallies suggests weakening buying pressure. RSI showing bearish divergence on multiple timeframes.",
  },
  {
    id: "4",
    timestamp: "2023-06-15T09:20:00Z",
    symbol: "XRP/USD",
    type: "buy",
    price: 0.5125,
    confidence: "low",
    explanation:
      "Price approaching long-term trendline support. Bollinger Bands showing potential squeeze, indicating upcoming volatility. Low confidence due to overall market uncertainty and regulatory concerns.",
  },
  {
    id: "5",
    timestamp: "2023-06-15T08:00:00Z",
    symbol: "ADA/USD",
    type: "sell",
    price: 0.385,
    confidence: "medium",
    explanation:
      "Head and shoulders pattern forming on the daily chart. Volume increasing on downward moves. 20-day EMA crossing below 50-day EMA, suggesting bearish momentum.",
  },
  {
    id: "6",
    timestamp: "2023-06-15T06:30:00Z",
    symbol: "DOGE/USD",
    type: "buy",
    price: 0.0725,
    confidence: "medium",
    explanation:
      "Bullish engulfing pattern on the daily chart. Social sentiment analysis showing increasing positive mentions. Price breaking above descending trendline with increased volume.",
  },
  {
    id: "7",
    timestamp: "2023-06-15T05:15:00Z",
    symbol: "LINK/USD",
    type: "buy",
    price: 15.75,
    confidence: "high",
    explanation:
      "Strong accumulation pattern with increasing on-chain activity. Price consolidating above major support level. Relative strength compared to other altcoins during market weakness.",
  },
]

export function Signals() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSignal, setSelectedSignal] = useState<any>(null)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const filteredSignals = [...signals].filter(
    (signal) =>
      signal.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      signal.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0">
        <CardTitle className="flex-1">Trading Signals</CardTitle>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative w-full sm:w-40 md:w-60">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search signals..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
          <div className="rounded-md border min-w-[700px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[140px]">Time</TableHead>
                  <TableHead className="min-w-[100px]">Symbol</TableHead>
                  <TableHead className="min-w-[80px]">Type</TableHead>
                  <TableHead className="min-w-[100px]">Price</TableHead>
                  <TableHead className="min-w-[100px]">Confidence</TableHead>
                  <TableHead className="text-right min-w-[80px]">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSignals.map((signal) => (
                  <TableRow key={signal.id} className="group animate-fadeIn">
                    <TableCell className="text-sm">{formatDate(signal.timestamp)}</TableCell>
                    <TableCell className="font-medium">{signal.symbol}</TableCell>
                    <TableCell>
                      <Badge
                        variant={signal.type === "buy" ? "default" : "secondary"}
                        className={`${signal.type === "buy" ? "bg-green-500" : "bg-red-500"} text-white text-xs`}
                      >
                        {signal.type.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">${signal.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          signal.confidence === "high"
                            ? "border-green-500 text-green-500"
                            : signal.confidence === "medium"
                              ? "border-yellow-500 text-yellow-500"
                              : "border-red-500 text-red-500"
                        }`}
                      >
                        {signal.confidence.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => setSelectedSignal(signal)}>
                            <Info className="h-4 w-4" />
                            <span className="sr-only">View signal details</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md mx-4">
                          <DialogHeader>
                            <DialogTitle className="text-base">
                              {signal.type.toUpperCase()} Signal for {signal.symbol}
                            </DialogTitle>
                            <DialogDescription className="text-sm">
                              Generated on {formatDate(signal.timestamp)}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Signal Type</h4>
                                <p className="font-medium">{signal.type.toUpperCase()}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Price</h4>
                                <p className="font-medium">${signal.price.toFixed(2)}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Confidence</h4>
                                <p className="font-medium">{signal.confidence.toUpperCase()}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Symbol</h4>
                                <p className="font-medium">{signal.symbol}</p>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground">Signal Explanation</h4>
                              <p className="mt-1 text-sm">{signal.explanation}</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
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
