"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { usePerformanceData } from "@/hooks/use-performance-data"

interface Metric {
  title: string;
  value: string;
  change: string;
  color: string;
}

export function PerformanceMetrics() {
  const { data, loading } = usePerformanceData()

  if (loading) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-2/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const metrics: Metric[] = data?.overview?.metrics || []

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric: Metric, index: number) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{metric.value}</div>
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
