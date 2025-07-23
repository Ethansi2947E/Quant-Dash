"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface MonthlyData {
  month: string;
  return: number;
  trades: number;
  winRate: number;
  bestDay: number;
  worstDay: number;
}

interface YearlyStat {
  metric: string;
  value: string;
}

interface MonthlyPerformanceData {
  monthlyData: MonthlyData[];
  yearlyStats: YearlyStat[];
}

export function MonthlyPerformance() {
  const [performanceData, setPerformanceData] = useState<MonthlyPerformanceData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const response = await fetch("/api/performance")
        const result = await response.json()
        if (result.monthlyBreakdown) {
          setPerformanceData(result.monthlyBreakdown)
        }
      } catch (error) {
        console.error("Failed to fetch monthly performance data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
        <Card>
          <div className="h-96 animate-pulse rounded-xl bg-muted" />
        </Card>
      </div>
    )
  }
  
  if (!performanceData) {
     return <div className="text-center text-muted-foreground">No monthly data available.</div>
  }

  const { yearlyStats, monthlyData } = performanceData;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {yearlyStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{stat.metric}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Performance Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>Return</TableHead>
                <TableHead>Trades</TableHead>
                <TableHead>Win Rate</TableHead>
                <TableHead>Best Day</TableHead>
                <TableHead>Worst Day</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{data.month}</TableCell>
                  <TableCell>
                    <Badge
                      variant={data.return >= 0 ? "default" : "destructive"}
                      className={data.return >= 0 ? "bg-green-500" : ""}
                    >
                      {data.return >= 0 ? "+" : ""}
                      {data.return}%
                    </Badge>
                  </TableCell>
                  <TableCell>{data.trades}</TableCell>
                  <TableCell>{data.winRate}%</TableCell>
                  <TableCell className="text-green-500">+{data.bestDay}%</TableCell>
                  <TableCell className="text-red-500">{data.worstDay}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
