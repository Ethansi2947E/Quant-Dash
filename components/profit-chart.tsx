"use client"

import { useState } from "react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Button } from "@/components/ui/button"

// Mock data for profit chart
const dailyData = [
  { date: "2023-06-09", profit: 250 },
  { date: "2023-06-10", profit: 320 },
  { date: "2023-06-11", profit: -150 },
  { date: "2023-06-12", profit: 450 },
  { date: "2023-06-13", profit: -200 },
  { date: "2023-06-14", profit: 380 },
  { date: "2023-06-15", profit: 520 },
]

const weeklyData = [
  { date: "Week 1", profit: 1250 },
  { date: "Week 2", profit: -450 },
  { date: "Week 3", profit: 1800 },
  { date: "Week 4", profit: 2100 },
]

const monthlyData = [
  { date: "Jan", profit: 4500 },
  { date: "Feb", profit: 3200 },
  { date: "Mar", profit: -1500 },
  { date: "Apr", profit: 5200 },
  { date: "May", profit: 6800 },
  { date: "Jun", profit: 4300 },
]

export function ProfitChart() {
  const [timeframe, setTimeframe] = useState("daily")
  const [data, setData] = useState(dailyData)

  const handleTimeframeChange = (tf: string) => {
    setTimeframe(tf)
    if (tf === "daily") setData(dailyData)
    if (tf === "weekly") setData(weeklyData)
    if (tf === "monthly") setData(monthlyData)
  }

  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant={timeframe === "daily" ? "default" : "outline"}
          size="sm"
          onClick={() => handleTimeframeChange("daily")}
        >
          Daily
        </Button>
        <Button
          variant={timeframe === "weekly" ? "default" : "outline"}
          size="sm"
          onClick={() => handleTimeframeChange("weekly")}
        >
          Weekly
        </Button>
        <Button
          variant={timeframe === "monthly" ? "default" : "outline"}
          size="sm"
          onClick={() => handleTimeframeChange("monthly")}
        >
          Monthly
        </Button>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <Tooltip
              formatter={(value: number) => [`${value >= 0 ? "+" : ""}$${Math.abs(value).toFixed(2)}`, "Profit/Loss"]}
            />
            <Area
              type="monotone"
              dataKey="profit"
              stroke={(d) => (d.profit >= 0 ? "#10b981" : "#ef4444")}
              fill={(d) => (d.profit >= 0 ? "url(#colorProfit)" : "url(#colorLoss)")}
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
