"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WinLossChart } from "@/components/win-loss-chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line, LineChart, CartesianGrid } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Mock data for enhanced analysis
const winLossOverTime = [
  { date: "Jan", wins: 18, losses: 7, winRate: 72 },
  { date: "Feb", wins: 15, losses: 9, winRate: 62.5 },
  { date: "Mar", wins: 22, losses: 9, winRate: 71 },
  { date: "Apr", wins: 19, losses: 7, winRate: 73 },
  { date: "May", wins: 24, losses: 5, winRate: 83 },
  { date: "Jun", wins: 21, losses: 6, winRate: 78 },
]

const assetPerformance = [
  { asset: "BTC/USD", wins: 45, losses: 15, winRate: 75, avgWin: 2.3, avgLoss: -1.8 },
  { asset: "ETH/USD", wins: 38, losses: 22, winRate: 63.3, avgWin: 1.9, avgLoss: -1.5 },
  { asset: "SOL/USD", wins: 28, losses: 12, winRate: 70, avgWin: 2.1, avgLoss: -1.6 },
  { asset: "XRP/USD", wins: 22, losses: 18, winRate: 55, avgWin: 1.7, avgLoss: -1.4 },
  { asset: "ADA/USD", wins: 34, losses: 11, winRate: 75.6, avgWin: 1.8, avgLoss: -1.3 },
]

const streakAnalysis = [
  { type: "Current Streak", value: "5 Wins", color: "text-green-500" },
  { type: "Longest Win Streak", value: "12 Wins", color: "text-green-500" },
  { type: "Longest Loss Streak", value: "4 Losses", color: "text-red-500" },
  { type: "Average Win Streak", value: "3.2 Wins", color: "text-blue-500" },
  { type: "Average Loss Streak", value: "1.8 Losses", color: "text-blue-500" },
]

const timeAnalysis = [
  { hour: "00-04", wins: 8, losses: 12, winRate: 40 },
  { hour: "04-08", wins: 15, losses: 8, winRate: 65.2 },
  { hour: "08-12", wins: 42, losses: 18, winRate: 70 },
  { hour: "12-16", wins: 38, losses: 22, winRate: 63.3 },
  { hour: "16-20", wins: 35, losses: 15, winRate: 70 },
  { hour: "20-24", wins: 29, losses: 3, winRate: 90.6 },
]

export function WinLossAnalysis() {
  return (
    <div className="container space-y-4 py-4 px-4 md:py-8">
      <Tabs defaultValue="overview" className="space-y-4">
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-4 min-w-[400px]">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="trends" className="text-xs sm:text-sm">
              Trends
            </TabsTrigger>
            <TabsTrigger value="assets" className="text-xs sm:text-sm">
              By Asset
            </TabsTrigger>
            <TabsTrigger value="timing" className="text-xs sm:text-sm">
              Timing
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Win/Loss Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <WinLossChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Key Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Win Rate</h4>
                      <p className="text-xl md:text-2xl font-bold text-green-500">68.2%</p>
                      <Progress value={68.2} className="mt-1" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Loss Rate</h4>
                      <p className="text-xl md:text-2xl font-bold text-red-500">31.8%</p>
                      <Progress value={31.8} className="mt-1" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Profit Factor</h4>
                      <p className="text-xl md:text-2xl font-bold">2.4</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Risk/Reward</h4>
                      <p className="text-xl md:text-2xl font-bold">1:2.3</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Avg Win</h4>
                      <p className="text-xl md:text-2xl font-bold text-green-500">+$187</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Avg Loss</h4>
                      <p className="text-xl md:text-2xl font-bold text-red-500">-$82</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Streak Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-5">
                {streakAnalysis.map((streak, index) => (
                  <div key={index} className="text-center">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">{streak.type}</h4>
                    <p className={`text-lg md:text-xl font-bold ${streak.color}`}>{streak.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Win Rate Trend Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] sm:h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={winLossOverTime} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                    <YAxis
                      tick={{ fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}%`}
                      domain={[0, 100]}
                    />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, "Win Rate"]}
                      cursor={{ stroke: "hsl(var(--muted-foreground))" }}
                    />
                    <Line type="monotone" dataKey="winRate" stroke="#10b981" strokeWidth={3} activeDot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Win/Loss Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] sm:h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={winLossOverTime} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                    <Tooltip />
                    <Bar dataKey="wins" fill="#10b981" name="Wins" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="losses" fill="#ef4444" name="Losses" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance by Trading Pair</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assetPerformance.map((asset, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg space-y-3 sm:space-y-0"
                  >
                    <div className="flex items-center space-x-4">
                      <div>
                        <h4 className="font-medium">{asset.asset}</h4>
                        <p className="text-sm text-muted-foreground">{asset.wins + asset.losses} total trades</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:space-x-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Win Rate</p>
                        <Badge
                          variant={asset.winRate >= 70 ? "default" : asset.winRate >= 60 ? "secondary" : "destructive"}
                          className={asset.winRate >= 70 ? "bg-green-500" : asset.winRate >= 60 ? "bg-yellow-500" : ""}
                        >
                          {asset.winRate}%
                        </Badge>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Avg Win</p>
                        <p className="font-medium text-green-500">+{asset.avgWin}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Avg Loss</p>
                        <p className="font-medium text-red-500">{asset.avgLoss}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Trades</p>
                        <p className="font-medium">
                          {asset.wins}W / {asset.losses}L
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance by Time of Day</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] sm:h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeAnalysis} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <XAxis dataKey="hour" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                    <Tooltip />
                    <Bar dataKey="wins" fill="#10b981" name="Wins" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="losses" fill="#ef4444" name="Losses" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Best Trading Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...timeAnalysis]
                    .sort((a, b) => b.winRate - a.winRate)
                    .slice(0, 3)
                    .map((time, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium">{time.hour}</span>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-green-500">{time.winRate}%</Badge>
                          <span className="text-sm text-muted-foreground">
                            {time.wins}W / {time.losses}L
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trading Activity by Hour</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...timeAnalysis]
                    .sort((a, b) => b.wins + b.losses - (a.wins + a.losses))
                    .slice(0, 3)
                    .map((time, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium">{time.hour}</span>
                        <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                          <span className="font-medium text-sm">{time.wins + time.losses} trades</span>
                          <Badge variant="outline" className="text-xs">
                            {time.winRate}% win rate
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
