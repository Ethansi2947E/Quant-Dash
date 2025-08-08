"use client"

import * as React from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import type { StrategyTrade } from "./strategy-types"

interface StrategyTradesTableProps {
  trades: StrategyTrade[]
}

export default function StrategyTradesTable({ trades }: StrategyTradesTableProps) {
  const items = React.useMemo(() => {
    // work on a copy to avoid mutating upstream arrays
    return [...trades].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [trades])

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[130px]">Date</TableHead>
            <TableHead className="min-w-[100px]">Symbol</TableHead>
            <TableHead className="min-w-[80px]">Side</TableHead>
            <TableHead className="min-w-[90px]">Qty</TableHead>
            <TableHead className="min-w-[110px]">Entry</TableHead>
            <TableHead className="min-w-[110px]">Exit</TableHead>
            <TableHead className="min-w-[110px]">PnL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((t) => {
            const profit = t.pnl >= 0
            return (
              <TableRow key={t.id}>
                <TableCell className="tabular-nums text-muted-foreground">
                  {new Date(t.date).toLocaleString()}
                </TableCell>
                <TableCell>{t.symbol}</TableCell>
                <TableCell className="uppercase">{t.side}</TableCell>
                <TableCell className="tabular-nums">{t.quantity}</TableCell>
                <TableCell className="tabular-nums">{t.entryPrice.toFixed(2)}</TableCell>
                <TableCell className="tabular-nums">{t.exitPrice.toFixed(2)}</TableCell>
                <TableCell className={`tabular-nums ${profit ? "text-emerald-600" : "text-red-600"}`}>
                  {profit ? "+" : ""}
                  {t.pnl.toFixed(2)}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
        <TableCaption>Most recent trades first</TableCaption>
      </Table>
    </div>
  )
}
