"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StrategiesOverview } from "@/components/strategies-overview"
import { StrategiesDetails } from "@/components/strategies-details"

export default function StrategiesPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedStrategy, setSelectedStrategy] = useState("momentum-1")

  const handleViewDetails = (strategyId: string) => {
    setSelectedStrategy(strategyId)
    setActiveTab("details")
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
          <StrategiesOverview onViewDetails={handleViewDetails} />
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <StrategiesDetails 
            selectedStrategy={selectedStrategy}
            onStrategyChange={setSelectedStrategy}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
