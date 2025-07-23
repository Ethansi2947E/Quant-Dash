"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WinLossChart } from "@/components/win-loss-chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line, LineChart, CartesianGrid } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Mock data will be removed.

export function WinLossAnalysis() {
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const response = await fetch("/api/win-loss")
        const data = await response.json()
        setAnalysisData(data)
      } catch (error) {
        console.error("Failed to fetch win/loss analysis:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const overview = analysisData?.overview
  const trends = analysisData?.trends
  const assetPerformance = analysisData?.assetPerformance || []
  const timingAnalysis = analysisData?.timingAnalysis

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
                <WinLossChart data={overview?.winLossDistribution || []} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Key Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                {loading || !overview ? (
                  <div className="h-48 animate-pulse rounded-md bg-muted" />
                ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Win Rate</h4>
                      <p className="text-xl md:text-2xl font-bold text-green-500">{overview.keyStatistics.winRate.toFixed(1)}%</p>
                      <Progress value={overview.keyStatistics.winRate} className="mt-1" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Loss Rate</h4>
                      <p className="text-xl md:text-2xl font-bold text-red-500">{overview.keyStatistics.lossRate.toFixed(1)}%</p>
                      <Progress value={overview.keyStatistics.lossRate} className="mt-1" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Profit Factor</h4>
                      <p className="text-xl md:text-2xl font-bold">{overview.keyStatistics.profitFactor.toFixed(2)}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Risk/Reward</h4>
                      <p className="text-xl md:text-2xl font-bold">1:{overview.keyStatistics.riskRewardRatio.toFixed(1)}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Avg Win</h4>
                      <p className="text-xl md:text-2xl font-bold text-green-500">
                        +${overview.keyStatistics.averageWin.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Avg Loss</h4>
                      <p className="text-xl md:text-2xl font-bold text-red-500">
                        -${overview.keyStatistics.averageLoss.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Streak Analysis</CardTitle>
            </CardHeader>
            <CardContent>
               {loading || !overview ? (
                  <div className="h-12 animate-pulse rounded-md bg-muted" />
                ) : (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-5">
                  <div className="text-center">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Current Streak</h4>
                    <p className={`text-lg md:text-xl font-bold ${overview.streakAnalysis.currentStreak.type === 'win' ? 'text-green-500' : 'text-red-500'}`}>
                      {overview.streakAnalysis.currentStreak.value}
                    </p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Longest Win Streak</h4>
                    <p className="text-lg md:text-xl font-bold text-green-500">{overview.streakAnalysis.longestWinStreak} Wins</p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Longest Loss Streak</h4>
                    <p className="text-lg md:text-xl font-bold text-red-500">{overview.streakAnalysis.longestLossStreak} Losses</p>
                  </div>
                   <div className="text-center">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Average Win Streak</h4>
                    <p className="text-lg md:text-xl font-bold text-blue-500">{overview.streakAnalysis.averageWinStreak.toFixed(1)} Wins</p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Average Loss Streak</h4>
                    <p className="text-lg md:text-xl font-bold text-blue-500">{overview.streakAnalysis.averageLossStreak.toFixed(1)} Losses</p>
                  </div>
              </div>
               )}
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
                  <LineChart data={trends?.winRateOverTime || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 10 }} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(value) => value.substring(0, 3)} // Abbreviate month name
                    />
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
                  <BarChart data={trends?.monthlyDistribution || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                        <p className="font-medium text-green-500">
                          +${asset.avgWin.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Avg Loss</p>
                        <p className="font-medium text-red-500">
                          -${asset.avgLoss.toFixed(2)}
                        </p>
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
                  <BarChart data={timingAnalysis?.byHour || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                  {[...(timingAnalysis?.bestHours || [])]
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
                  {[...(timingAnalysis?.mostActiveHours || [])]
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
