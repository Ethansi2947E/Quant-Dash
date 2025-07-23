"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { DateRange } from "react-day-picker"

interface MonthlyData {
  month: string;
  return: number;
  trades: number;
  winRate: number;
  bestDay: number;
  worstDay: number;
}

interface YearlyStat {
  metric: string;
  value: string;
}

interface MonthlyBreakdownData {
  monthlyData: MonthlyData[];
  yearlyStats: YearlyStat[];
}

interface PerformanceData {
  overview: any;
  riskAnalysis: any;
  monthlyBreakdown: MonthlyBreakdownData;
  filters: {
    assets: string[];
    dateRange: { min: string; max: string };
  };
}

interface PerformanceContextType {
  data: PerformanceData | null;
  loading: boolean;
  error: string | null;
  filters: {
    asset: string;
    timeframe: string;
    dateRange: DateRange | undefined;
  };
  setFilters: (filters: {
    asset?: string;
    timeframe?: string;
    dateRange?: DateRange;
  }) => void;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined)

export function PerformanceProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PerformanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [filters, setFiltersState] = useState({
    asset: "All Assets",
    timeframe: "1W",
    dateRange: undefined as DateRange | undefined,
  })

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.asset && filters.asset !== "All Assets") {
        params.append("asset", filters.asset)
      }
      if (filters.timeframe) {
        params.append("timeframe", filters.timeframe)
      }
      if (filters.dateRange?.from) {
        params.append("start_date", filters.dateRange.from.toISOString().split('T')[0])
      }
      if (filters.dateRange?.to) {
        params.append("end_date", filters.dateRange.to.toISOString().split('T')[0])
      }

      try {
        const response = await fetch(`/api/performance?${params.toString()}`)
        if (!response.ok) throw new Error("Failed to fetch performance data")
        const result = await response.json()
        setData(result)
        setError(null)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [filters])

  const setFilters = (newFilters: Partial<typeof filters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }))
  }

  const value = { data, loading, error, filters, setFilters }

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  )
}

export function usePerformanceData() {
  const context = useContext(PerformanceContext)
  if (context === undefined) {
    throw new Error("usePerformanceData must be used within a PerformanceProvider")
  }
  return context
} 