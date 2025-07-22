"use client"

import * as React from "react"
import { Suspense, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { PerformanceChart } from "@/components/performance-chart"

// Helper function to format numbers with a plus sign if positive
const formatChange = (change: number) => {
  return change > 0 ? `+${change}` : `${change}`
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)
}

export default function DashboardPage() {
  const [data, setData] = useState<any>(null)
  const [accountInfo, setAccountInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboardData(isInitialLoad = false) {
      if (isInitialLoad) setLoading(true)
      try {
        const res = await fetch("/api/dashboard")
        if (!res.ok) throw new Error("Failed to fetch dashboard data")
        const jsonData = await res.json()
        setData(jsonData)
        if (isInitialLoad) setError(null)
      } catch (err: any) {
        if (isInitialLoad) setError(err.message)
        else console.error("Failed to refresh dashboard data:", err.message)
      } finally {
        if (isInitialLoad) setLoading(false)
      }
    }

    async function fetchAccountInfo() {
      try {
        const res = await fetch("/api/dashboard/account-info")
        if (!res.ok) {
          // Don't throw an error, just log it, as the main dash can still function
          console.error("Failed to fetch live account data")
          return
        }
        const info = await res.json()
        setAccountInfo(info)
      } catch (err) {
        console.error("Error fetching live account data:", err)
      }
    }

    // Initial data fetch
    fetchDashboardData(true)
    fetchAccountInfo()

    // Set up polling
    const accountInfoIntervalId = setInterval(fetchAccountInfo, 5000) // Refresh live equity every 5s
    const dashboardDataIntervalId = setInterval(() => fetchDashboardData(false), 15000) // Refresh historical KPIs every 15s

    // Cleanup on component unmount
    return () => {
      clearInterval(accountInfoIntervalId)
      clearInterval(dashboardDataIntervalId)
    }
  }, [])

  if (loading) {
    return (
      <div className="container space-y-4 py-4 px-4 md:py-8">
        {/* Skeleton for KPI cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
        {/* Skeleton for charts */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
          <div className="lg:col-span-4 h-[400px] animate-pulse rounded-xl bg-muted" />
          <div className="lg:col-span-3 h-[400px] animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8 text-center text-red-500">
        <p>Error loading dashboard: {error}</p>
      </div>
    )
  }

  const { kpis, overviewChart, performanceChart } = data

  return (
    <div className="container space-y-4 py-4 px-4 md:py-8">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit/Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-xl md:text-2xl font-bold ${
                kpis.totalProfitLoss.value >= 0 ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {kpis.totalProfitLoss.value >= 0 ? "+" : ""}
              {formatCurrency(kpis.totalProfitLoss.value)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatChange(kpis.totalProfitLoss.change * 100)}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{kpis.winRate.value.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">
              {formatChange(kpis.winRate.change * 100)}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{kpis.totalTrades.value}</div>
            <p className="text-xs text-muted-foreground">{formatChange(kpis.totalTrades.change)} since yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            {accountInfo ? (
              <>
                <div className="text-xl md:text-2xl font-bold">{formatCurrency(accountInfo.equity)}</div>
                <p
                  className={`text-xs ${
                    accountInfo.profit >= 0 ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {accountInfo.profit >= 0 ? "+" : ""}
                  {formatCurrency(accountInfo.profit)} Today
                </p>
              </>
            ) : (
              <>
                <div className="text-xl md:text-2xl font-bold">
                  {formatCurrency(kpis.portfolioValue.value)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(kpis.portfolioValue.change)} (
                  {kpis.portfolioValue.changePercentage.toFixed(2)}%)
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <Suspense fallback={<div className="lg:col-span-4 h-[400px] animate-pulse rounded-xl bg-muted" />}>
          <div className="lg:col-span-4">
            <PerformanceChart chartData={performanceChart} />
          </div>
        </Suspense>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Overview data={overviewChart} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
