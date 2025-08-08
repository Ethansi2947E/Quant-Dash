"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, X, Filter } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface DateRange {
  from?: Date
  to?: Date
}
interface StrategiesFiltersProps {
  dateRange: DateRange
  onDateRangeChange: (r: DateRange) => void
  symbol: string
  onSymbolChange: (s: string) => void
  availableSymbols: string[]
  onReset: () => void
}

export default function StrategiesFilters({
  dateRange,
  onDateRangeChange,
  symbol,
  onSymbolChange,
  availableSymbols,
  onReset,
}: StrategiesFiltersProps) {
  const label =
    dateRange?.from && dateRange?.to
      ? `${format(dateRange.from, "LLL d, y")} - ${format(dateRange.to, "LLL d, y")}`
      : "Select date range"

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="justify-start gap-2 w-full sm:w-auto">
              <CalendarIcon className="h-4 w-4" />
              <span className="truncate">{label}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-2" align="start">
            <Calendar
              mode="range"
              selected={{ from: dateRange?.from, to: dateRange?.to }}
              onSelect={(r) => onDateRangeChange({ from: r?.from, to: r?.to })}
              numberOfMonths={2}
              initialFocus
            />
            <div className="flex gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDateRangeChange({ from: undefined, to: undefined })}
              >
                Clear
              </Button>
              <div className="ml-auto flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    const to = new Date()
                    const from = new Date(to)
                    from.setDate(to.getDate() - 7)
                    onDateRangeChange({ from, to })
                  }}
                >
                  Last 7d
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    const to = new Date()
                    const from = new Date(to)
                    from.setMonth(to.getMonth() - 1)
                    onDateRangeChange({ from, to })
                  }}
                >
                  Last 30d
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Select value={symbol} onValueChange={onSymbolChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Symbol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Symbols</SelectItem>
            {availableSymbols.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" onClick={onReset}>
          <X className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Filter className="h-4 w-4" />
        Filters
      </div>
    </div>
  )
}
