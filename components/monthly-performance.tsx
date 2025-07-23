"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { usePerformanceData } from "@/hooks/use-performance-data"

export function MonthlyPerformance() {
  const { data, loading } = usePerformanceData()

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
  
  const performanceData = data?.monthlyBreakdown;

  if (!performanceData || !performanceData.monthlyData || performanceData.monthlyData.length === 0) {
     return <div className="text-center text-muted-foreground">No monthly data available for the selected period.</div>
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
