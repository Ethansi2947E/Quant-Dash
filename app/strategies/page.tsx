"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StrategiesOverview } from "@/components/strategies-overview"
import { StrategiesDetails } from "@/components/strategies-details"

export default function StrategiesPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Trading Strategies</h1>
        <p className="text-muted-foreground">
          Monitor and analyze the performance of your trading strategies
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <StrategiesOverview />
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <StrategiesDetails />
        </TabsContent>
      </Tabs>
    </div>
  )
}
