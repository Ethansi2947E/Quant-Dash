"use client"

import { useState, useEffect } from "react"
import { DateRange } from "react-day-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StrategiesOverview } from "@/components/strategies-overview"
import { StrategiesDetails } from "@/components/strategies-details"

// Define a minimal type for the strategy list
type Strategy = {
  id: string
  name: string
  // Add other fields if needed for other components
}

export default function StrategiesPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null)
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [availableAssets, setAvailableAssets] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // State for filters
  const [selectedSymbol, setSelectedSymbol] = useState<string>("All Assets")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (selectedSymbol && selectedSymbol !== "All Assets") {
          params.append("asset", selectedSymbol)
        }
        if (dateRange?.from) {
          params.append("start_date", dateRange.from.toISOString().split('T')[0])
        }
        if (dateRange?.to) {
          params.append("end_date", dateRange.to.toISOString().split('T')[0])
        }
        
        const response = await fetch(`/api/strategies?${params.toString()}`)
        if (!response.ok) {
          throw new Error("Failed to fetch strategies")
        }
        const data = await response.json()
        
        const fetchedStrategies = data.strategies || []
        setStrategies(fetchedStrategies)
        setAvailableAssets(data.availableAssets || [])

        if (fetchedStrategies.length > 0 && !selectedStrategy) {
          setSelectedStrategy(fetchedStrategies[0].id)
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStrategies()
  }, [selectedSymbol, dateRange]) // Refetch when filters change

  const handleViewDetails = (strategyId: string) => {
    setSelectedStrategy(strategyId)
    setActiveTab("details")
  }

  if (loading) {
    return <div className="container mx-auto p-4 lg:p-6 xl:p-8">Loading strategies...</div>
  }

  if (error) {
    return <div className="container mx-auto p-4 lg:p-6 xl:p-8 text-red-500">Error: {error}</div>
  }

  return (
    <div className="container mx-auto p-4 lg:p-6 xl:p-8 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">Trading Strategies</h1>
        <p className="text-muted-foreground text-sm lg:text-base">
          Monitor and analyze the performance of your trading strategies
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px] xl:w-[500px]">
          <TabsTrigger value="overview" className="text-sm lg:text-base">Overview</TabsTrigger>
          <TabsTrigger value="details" className="text-sm lg:text-base">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <StrategiesOverview 
            strategies={strategies} 
            onViewDetails={handleViewDetails}
            availableAssets={availableAssets}
            selectedSymbol={selectedSymbol}
            onSymbolChange={setSelectedSymbol}
            dateRange={dateRange}
            onDateChange={setDateRange}
          />
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          {selectedStrategy && (
          <StrategiesDetails 
              strategies={strategies}
            selectedStrategy={selectedStrategy}
            onStrategyChange={setSelectedStrategy}
              availableAssets={availableAssets}
              selectedSymbol={selectedSymbol}
              onSymbolChange={setSelectedSymbol}
              dateRange={dateRange}
              onDateChange={setDateRange}
          />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
