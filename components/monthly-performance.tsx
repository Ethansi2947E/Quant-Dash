"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Mock data for monthly performance
const monthlyData = [
  { month: "January 2024", return: 4.2, trades: 28, winRate: 71.4, bestDay: 2.1, worstDay: -1.3 },
  { month: "February 2024", return: 2.8, trades: 24, winRate: 66.7, bestDay: 1.8, worstDay: -0.9 },
  { month: "March 2024", return: -1.5, trades: 31, winRate: 58.1, bestDay: 1.5, worstDay: -2.8 },
  { month: "April 2024", return: 5.7, trades: 26, winRate: 73.1, bestDay: 2.4, worstDay: -1.1 },
  { month: "May 2024", return: 3.9, trades: 29, winRate: 69.0, bestDay: 2.0, worstDay: -1.6 },
  { month: "June 2024", return: 8.4, trades: 27, winRate: 77.8, bestDay: 3.2, worstDay: -0.8 },
]

const yearlyStats = [
  { metric: "Best Month", value: "June 2024 (+8.4%)" },
  { metric: "Worst Month", value: "March 2024 (-1.5%)" },
  { metric: "Positive Months", value: "5 out of 6 (83.3%)" },
  { metric: "Average Monthly Return", value: "+3.9%" },
  { metric: "Monthly Volatility", value: "3.2%" },
  { metric: "Consistency Score", value: "8.5/10" },
]

export function MonthlyPerformance() {
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
