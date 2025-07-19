"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WinLossChart } from "@/components/win-loss-chart"

export function WinLossAnalysis() {
  return (
    <div className="container space-y-4 py-4 md:py-8">
      <div className="grid gap-4 md:grid-cols-2">
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
            <CardTitle>Trade Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Win Rate</h4>
                  <p className="text-2xl font-bold">68.2%</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Loss Rate</h4>
                  <p className="text-2xl font-bold">31.8%</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Profit Factor</h4>
                  <p className="text-2xl font-bold">2.4</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Risk/Reward</h4>
                  <p className="text-2xl font-bold">1:2.3</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Max Drawdown</h4>
                  <p className="text-2xl font-bold">12.5%</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Avg Trade Duration</h4>
                  <p className="text-2xl font-bold">3h 15m</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
