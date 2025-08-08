"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { cn } from "@/lib/utils"

export interface StrategyEquityChartProps {
  title?: string
  data: { date: string; equity: number; drawdown?: number }[]
  className?: string
}
export default function StrategyEquityChart({ title = "Equity Curve", data, className }: StrategyEquityChartProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base md:text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer
          config={{
            equity: {
              label: "Equity",
              color: "hsl(var(--chart-1))",
            },
            drawdown: {
              label: "Drawdown",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[260px] sm:h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 12, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10 }}
                tickMargin={6}
                minTickGap={20}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                width={45}
                tickFormatter={(v) => (Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v}`)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="equity" stroke="var(--color-equity)" fill="var(--color-equity)" fillOpacity={0.15} />
              {/* Optional: visualize instantaneous drawdown below zero if provided */}
              <Area type="monotone" dataKey="drawdown" stroke="var(--color-drawdown)" fill="var(--color-drawdown)" fillOpacity={0.12} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
