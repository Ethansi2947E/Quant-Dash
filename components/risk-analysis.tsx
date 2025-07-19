"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line, LineChart, CartesianGrid } from "recharts"

// Mock data for risk analysis
const drawdownData = [
  { period: "Jan", drawdown: -2.1 },
  { period: "Feb", drawdown: -1.5 },
  { period: "Mar", drawdown: -4.2 },
  { period: "Apr", drawdown: -0.8 },
  { period: "May", drawdown: -3.1 },
  { period: "Jun", drawdown: -8.2 },
]

const volatilityData = [
  { period: "Week 1", volatility: 8.5 },
  { period: "Week 2", volatility: 12.3 },
  { period: "Week 3", volatility: 15.7 },
  { period: "Week 4", volatility: 9.2 },
]

const riskMetrics = [
  { metric: "Value at Risk (95%)", value: "-$1,250", description: "Maximum expected loss over 1 day" },
  { metric: "Expected Shortfall", value: "-$1,850", description: "Average loss beyond VaR" },
  { metric: "Maximum Consecutive Losses", value: "4", description: "Longest losing streak" },
  { metric: "Recovery Factor", value: "2.87", description: "Net profit / Max drawdown" },
  { metric: "Ulcer Index", value: "3.2", description: "Measure of downside risk" },
  { metric: "Sterling Ratio", value: "1.95", description: "Return / Average drawdown" },
]

export function RiskAnalysis() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {riskMetrics.map((item, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{item.metric}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Drawdown Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={drawdownData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="period" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, "Drawdown"]}
                    cursor={{ fill: "hsl(var(--muted))" }}
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Bar dataKey="drawdown" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rolling Volatility (4 weeks)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={volatilityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="period" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, "Volatility"]}
                    cursor={{ stroke: "hsl(var(--muted-foreground))" }}
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="volatility"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
