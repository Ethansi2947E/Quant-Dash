"use client"

import { CalendarIcon, ChevronDown } from "lucide-react"
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
import { usePerformanceData } from "@/hooks/use-performance-data"

export function DetailedAnalytics() {
  const { data, loading, filters, setFilters } = usePerformanceData()

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0">
        <CardTitle className="flex-1">Performance Analytics</CardTitle>
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1 bg-transparent w-full sm:w-auto">
                <span className="truncate">{filters.asset}</span>
                <ChevronDown className="h-3.5 w-3.5 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-[200px] overflow-y-auto">
              <DropdownMenuLabel>Select Asset</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {data?.filters.assets.map(asset => (
                <DropdownMenuItem key={asset} onClick={() => setFilters({ asset })}>
                  {asset}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 w-full sm:w-[240px] justify-start text-left font-normal bg-transparent"
              >
                <CalendarIcon className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">
                  {filters.dateRange?.from ? (
                    filters.dateRange.to ? (
                      <>
                        {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                        {format(filters.dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(filters.dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={filters.dateRange?.from}
                selected={filters.dateRange}
                onSelect={(range) => setFilters({ dateRange: range })}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
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
                <PerformanceChart 
                  data={data?.overview?.performanceChart || []}
                  loading={loading}
                  selectedTimeframe={filters.timeframe}
                  onTimeframeChange={(timeframe: any) => setFilters({ timeframe: timeframe.label })}
                />
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
