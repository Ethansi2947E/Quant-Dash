import { TradeHistory } from "@/components/trade-history"
import { DashboardShell } from "@/components/dashboard-shell"
import { Suspense } from "react"

export default function HistoryPage() {
  return (
    <DashboardShell>
      <Suspense fallback={<div>Loading trade history...</div>}>
        <div className="container py-4 md:py-8">
          <TradeHistory />
        </div>
      </Suspense>
    </DashboardShell>
  )
}
