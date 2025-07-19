"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function PerformanceMetrics() {
  const metrics = [
    {
      title: "Total Return",
      value: "+23.5%",
      change: "+2.1%",
      color: "text-green-500",
    },
    {
      title: "Annualized Return",
      value: "+18.7%",
      change: "+1.5%",
      color: "text-green-500",
    },
    {
      title: "Sharpe Ratio",
      value: "1.85",
      change: "+0.12",
      color: "text-green-500",
    },
    {
      title: "Max Drawdown",
      value: "-8.2%",
      change: "-1.1%",
      color: "text-red-500",
    },
    {
      title: "Calmar Ratio",
      value: "2.28",
      change: "+0.15",
      color: "text-green-500",
    },
    {
      title: "Volatility",
      value: "12.4%",
      change: "-0.8%",
      color: "text-green-500",
    },
    {
      title: "Beta",
      value: "0.73",
      change: "-0.05",
      color: "text-green-500",
    },
    {
      title: "Alpha",
      value: "4.2%",
      change: "+0.3%",
      color: "text-green-500",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className={`text-xs ${metric.color}`}>{metric.change} from last month</p>
            {metric.title === "Max Drawdown" && (
              <Progress value={Math.abs(Number.parseFloat(metric.value))} className="mt-2" />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
