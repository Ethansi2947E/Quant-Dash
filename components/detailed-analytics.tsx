"use client"

import { useState } from "react"
import { CalendarIcon, ChevronDown, Filter } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { PerformanceChart } from "@/components/performance-chart"
import { PerformanceMetrics } from "@/components/performance-metrics"
import { RiskAnalysis } from "@/components/risk-analysis"
import { MonthlyPerformance } from "@/components/monthly-performance"

export function DetailedAnalytics() {
  const [date, setDate] = useState<Date>()
  const [asset, setAsset] = useState<string>("All Assets")

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <CardTitle>Performance Analytics</CardTitle>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1 bg-transparent">
                <span>{asset}</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Select Asset</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setAsset("All Assets")}>All Assets</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAsset("BTC/USD")}>BTC/USD</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAsset("ETH/USD")}>ETH/USD</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAsset("SOL/USD")}>SOL/USD</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAsset("XRP/USD")}>XRP/USD</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 w-[240px] justify-start text-left font-normal bg-transparent"
              >
                <CalendarIcon className="h-3.5 w-3.5" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="sm" className="h-8 gap-1 bg-transparent">
            <Filter className="h-3.5 w-3.5" />
            <span>Filter</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Breakdown</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <PerformanceMetrics />
            <Card>
              <CardHeader>
                <CardTitle>Equity Curve & Drawdown</CardTitle>
              </CardHeader>
              <CardContent>
                <PerformanceChart />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="risk" className="space-y-4">
            <RiskAnalysis />
          </TabsContent>
          <TabsContent value="monthly" className="space-y-4">
            <MonthlyPerformance />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
