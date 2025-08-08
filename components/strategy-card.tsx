"use client"

import * as React from "react"
import { ArrowUpRight, ArrowDownRight, LineChart } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StrategyCardProps {
  name: string
  pnl: number
  winRate: number
  totalTrades: number
  bestPairs: { symbol: string; pnl: number }[]
  onOpenDetails: () => void
  className?: string
}

export default function StrategyCard({
  name,
  pnl,
  winRate,
  totalTrades,
  bestPairs,
  onOpenDetails,
  className,
}: StrategyCardProps) {
  const positive = pnl >= 0
  return (
    <Card
      className={cn(
        "hover:shadow-sm transition-shadow cursor-pointer",
        className
      )}
      onClick={onOpenDetails}
      role="button"
      aria-label={`Open details for ${name}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{name}</CardTitle>
        <LineChart className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className={cn("text-xl font-semibold tabular-nums", positive ? "text-emerald-600" : "text-red-600")}>
            {positive ? "+" : ""}
            {pnl.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </span>
          <span className="text-xs text-muted-foreground">PnL</span>
          {positive ? (
            <ArrowUpRight className="h-4 w-4 text-emerald-600" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-red-600" />
          )}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Win rate</span>
            <span className="font-medium tabular-nums">{(winRate * 100).toFixed(1)}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Trades</span>
            <span className="font-medium tabular-nums">{totalTrades}</span>
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xs text-muted-foreground">Best pairs</div>
          <div className="mt-1 flex flex-wrap gap-1">
            {bestPairs.slice(0, 3).map((p) => (
              <Badge key={p.symbol} variant="secondary" className="px-2 py-0.5">
                {p.symbol}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
