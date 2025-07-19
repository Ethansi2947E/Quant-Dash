import { DetailedAnalytics } from "@/components/detailed-analytics"
import { DashboardShell } from "@/components/dashboard-shell"
import { Suspense } from "react"

export default function PerformancePage() {
  return (
    <DashboardShell>
      <Suspense fallback={<div>Loading...</div>}>
        <DetailedAnalytics />
      </Suspense>
    </DashboardShell>
  )
}
