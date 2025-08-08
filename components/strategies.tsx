"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { subDays } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Card, CardContent } from "@/components/ui/card"
import StrategiesFilters, { type DateRange } from "./strategies-filters"
import StrategyCard from "./strategy-card"
import StrategyTradesTable from "./strategy-trades-table"
import StrategyEquityChart from "./strategy-equity-chart"
import { useIsMobile } from "@/hooks/use-mobile"
import { computeMaxDrawdown } from "@/lib/drawdown"
import type { StrategyTrade, StrategyDefinition, StrategyMetrics } from "./strategy-types"
import { Badge } from "@/components/ui/badge"

function mockTrades(): StrategyTrade[] {
  const strategies: StrategyDefinition[] = [
    { id: "mean-reversion", name: "Mean Reversion" },
    { id: "trend-following", name: "Trend Following" },
    { id: "breakout", name: "Breakout" },
  ]
  const symbols = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "AVAX/USDT", "BNB/USDT"]

  const trades: StrategyTrade[] = []
  let id = 1
  const now = new Date()
  for (let d = 90; d >= 0; d--) {
    const dt = subDays(now, d)
    for (const s of strategies) {
      // 0-2 trades per strategy per day
      const count = Math.floor(Math.random() * 3)
      for (let i = 0; i < count; i++) {
        const symbol = symbols[Math.floor(Math.random() * symbols.length)]
        const side = Math.random() > 0.5 ? "LONG" : "SHORT"
        const qty = Math.floor(Math.random() * 4 + 1) * 10
        const entry = Number((Math.random() * 1000 + 10).toFixed(2))
        const pnl = Number(((Math.random() - 0.4) * 50).toFixed(2)) // slightly positive tilt
        const exit =
          side === "LONG" ? Number((entry + pnl / Math.max(qty, 1)).toFixed(2)) : Number((entry - pnl / Math.max(qty, 1)).toFixed(2))
        trades.push({
          id: `t-${id++}`,
          strategyId: s.id,
          strategyName: s.name,
          date: new Date(dt.getTime() + Math.floor(Math.random() * 86400000)).toISOString(),
          symbol,
          side,
          quantity: qty,
          entryPrice: entry,
          exitPrice: exit,
          pnl,
        })
      }
    }
  }
  return trades
}

function computeMetricsForStrategy(name: string, id: string, trades: StrategyTrade[]): StrategyMetrics {
  const sorted = [...trades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const pnl = sorted.reduce((acc, t) => acc + t.pnl, 0)
  const totalTrades = sorted.length
  const wins = sorted.filter((t) => t.pnl > 0).length
  const winRate = totalTrades ? wins / totalTrades : 0

  // equity curve
  const equityCurve: { date: string; equity: number }[] = []
  let equity = 0
  for (const t of sorted) {
    equity += t.pnl
    equityCurve.push({ date: t.date.slice(0, 10), equity: Number(equity.toFixed(2)) })
  }

  // daily collapsed equity for cleaner chart
  const byDay = new Map<string, number>()
  for (const point of equityCurve) {
    byDay.set(point.date, point.equity)
  }
  const daily = [...byDay.entries()].map(([date, value]) => ({ date, value })).sort((a, b) => (a.date < b.date ? -1 : 1))
  const dd = computeMaxDrawdown(daily)
  const equityChartData = daily.map((d) => ({ date: d.date, equity: d.value }))

  // best pairs
  const pnlBySymbol = new Map<string, number>()
  for (const t of sorted) {
    pnlBySymbol.set(t.symbol, (pnlBySymbol.get(t.symbol) || 0) + t.pnl)
  }
  const bestPairs = [...pnlBySymbol.entries()]
    .map(([symbol, sPnl]) => ({ symbol, pnl: sPnl }))
    .sort((a, b) => b.pnl - a.pnl)
    .slice(0, 3)

  return {
    strategyId: id,
    strategyName: name,
    pnl: Number(pnl.toFixed(2)),
    winRate,
    totalTrades,
    bestPairs,
    equityCurve: equityChartData,
    maxDrawdown: dd,
  }
}

export default function Strategies() {
  // In a real app, fetch from API with server components or route handlers.
  const allTrades = React.useMemo(() => mockTrades(), [])
  const availableSymbols = useMemo(() => {
    const set = new Set(allTrades.map((t) => t.symbol))
    return [...set].sort()
  }, [allTrades])

  // filters
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })
  const [symbol, setSymbol] = useState<string>("ALL")

  const filteredTrades = useMemo(() => {
    const from = dateRange.from ? dateRange.from.getTime() : Number.NEGATIVE_INFINITY
    const to = dateRange.to ? dateRange.to.getTime() : Number.POSITIVE_INFINITY
    return allTrades.filter((t) => {
      const ts = new Date(t.date).getTime()
      if (ts < from || ts > to) return false
      if (symbol !== "ALL" && t.symbol !== symbol) return false
      return true
    })
  }, [allTrades, dateRange.from, dateRange.to, symbol])

  const strategies = useMemo(() => {
    const byStrategy = new Map<string, { name: string; trades: StrategyTrade[] }>()
    for (const t of filteredTrades) {
      const prev = byStrategy.get(t.strategyId) || { name: t.strategyName, trades: [] as StrategyTrade[] }
      prev.trades = [...prev.trades, t]
      byStrategy.set(t.strategyId, prev)
    }
    const computed = [...byStrategy.entries()].map(([id, { name, trades }]) => computeMetricsForStrategy(name, id, trades))
    // sort by PnL desc, work on a clone
    return [...computed].sort((a, b) => b.pnl - a.pnl)
  }, [filteredTrades])

  const [openStrategyId, setOpenStrategyId] = useState<string | null>(null)
  const openMetrics = strategies.find((s) => s.strategyId === openStrategyId)
  const openTrades = filteredTrades.filter((t) => t.strategyId === openStrategyId)
  const isMobile = useIsMobile()

  function resetFilters() {
    setDateRange({ from: subDays(new Date(), 30), to: new Date() })
    setSymbol("ALL")
  }

  return (
    <div className="space-y-4">
      <StrategiesFilters
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        symbol={symbol}
        onSymbolChange={setSymbol}
        availableSymbols={availableSymbols}
        onReset={resetFilters}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {strategies.map((s) => (
          <StrategyCard
            key={s.strategyId}
            name={s.strategyName}
            pnl={s.pnl}
            winRate={s.winRate}
            totalTrades={s.totalTrades}
            bestPairs={s.bestPairs}
            onOpenDetails={() => setOpenStrategyId(s.strategyId)}
          />
        ))}
        {strategies.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="py-10 text-center text-muted-foreground">No strategies match the current filters.</CardContent>
          </Card>
        )}
      </div>

      {/* Details drawer/dialog */}
      {isMobile ? (
        <Drawer open={!!openStrategyId} onOpenChange={(o) => !o && setOpenStrategyId(null)}>
          <DrawerContent className="p-0">
            <DrawerHeader className="text-left">
              <DrawerTitle>{openMetrics?.strategyName ?? "Strategy"}</DrawerTitle>
              {openMetrics && (
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary">PnL: {openMetrics.pnl >= 0 ? "+" : ""}{openMetrics.pnl.toFixed(2)}</Badge>
                  <Badge variant="secondary">Win rate: {(openMetrics.winRate * 100).toFixed(1)}%</Badge>
                  <Badge variant="secondary">Trades: {openMetrics.totalTrades}</Badge>
                  <Badge variant="secondary">Max DD: {(openMetrics.maxDrawdown.value * 100).toFixed(1)}%</Badge>
                </div>
              )}
            </DrawerHeader>
            <div className="p-4 space-y-4">
              {openMetrics && (
                <StrategyEquityChart
                  title="Equity Curve"
                  data={openMetrics.equityCurve.map((p) => ({ date: p.date, equity: p.equity }))}
                />
              )}
              <StrategyTradesTable trades={openTrades} />
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={!!openStrategyId} onOpenChange={(o) => !o && setOpenStrategyId(null)}>
          <DialogContent className="max-w-5xl">
            <DialogHeader>
              <DialogTitle>{openMetrics?.strategyName ?? "Strategy"}</DialogTitle>
              {openMetrics && (
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary">PnL: {openMetrics.pnl >= 0 ? "+" : ""}{openMetrics.pnl.toFixed(2)}</Badge>
                  <Badge variant="secondary">Win rate: {(openMetrics.winRate * 100).toFixed(1)}%</Badge>
                  <Badge variant="secondary">Trades: {openMetrics.totalTrades}</Badge>
                  <Badge variant="secondary">Max DD: {(openMetrics.maxDrawdown.value * 100).toFixed(1)}%</Badge>
                </div>
              )}
            </DialogHeader>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {openMetrics && (
                <StrategyEquityChart
                  title="Equity Curve"
                  data={openMetrics.equityCurve.map((p) => ({ date: p.date, equity: p.equity }))}
                />
              )}
              <div className="lg:col-span-1">
                <StrategyTradesTable trades={openTrades} />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
