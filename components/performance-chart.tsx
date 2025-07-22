"use client"

import { useState } from "react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const timeframes = [
  { label: "1W" },
  { label: "1M" },
  { label: "3M" },
  { label: "6M" },
  { label: "1Y" },
]

export function PerformanceChart({ chartData }: { chartData: Record<string, any[]> }) {
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframes[1]) // Default to 1M

  const handleTimeframeChange = (timeframe: (typeof timeframes)[0]) => {
    setSelectedTimeframe(timeframe)
  }

  const data = chartData?.[selectedTimeframe.label] || []

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value)
  }

  const getTooltipContent = (payload: any) => {
    if (!payload || !payload.length) return null

    const data = payload[0].payload
    return (
      <div className="rounded-lg border bg-background p-2 shadow-md">
        <div className="mb-2 font-medium">{formatDate(data.date)}</div>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-8">
            <span className="text-sm text-muted-foreground">Equity:</span>
            <span className="font-medium">{formatCurrency(data.equity)}</span>
          </div>
          {data.drawdown < 0 && (
            <div className="flex items-center justify-between gap-8">
              <span className="text-sm text-muted-foreground">Drawdown:</span>
              <span className="font-medium text-red-500">{formatCurrency(data.drawdown)}</span>
            </div>
          )}
          <div className="flex items-center justify-between gap-8">
            <span className="text-sm text-muted-foreground">Volume:</span>
            <span className="font-medium">{data.volume}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="p-4">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h3 className="text-lg font-medium">Performance Over Time</h3>
        <div className="flex flex-wrap gap-2">
          {timeframes.map((timeframe) => (
            <Button
              key={timeframe.label}
              variant={selectedTimeframe.label === timeframe.label ? "default" : "outline"}
              size="sm"
              onClick={() => handleTimeframeChange(timeframe)}
              className="flex-1 sm:flex-none min-w-[60px]"
            >
              {timeframe.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="h-[300px] sm:h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorDrawdown" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              domain={["dataMin - 1000", "dataMax + 1000"]}
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
            <Tooltip
              content={({ payload }) => getTooltipContent(payload)}
              cursor={{ stroke: "hsl(var(--muted-foreground))" }}
            />
            <Area
              type="monotone"
              dataKey="equity"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#colorEquity)"
              strokeWidth={2}
              activeDot={{ r: 4 }}
              name="Equity"
            />
            <Area
              type="monotone"
              dataKey="drawdown"
              stroke="#ef4444"
              fillOpacity={1}
              fill="url(#colorDrawdown)"
              strokeWidth={2}
              name="Drawdown"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
