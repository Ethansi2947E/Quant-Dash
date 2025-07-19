import { WinLossAnalysis } from "@/components/win-loss-analysis"
import { DashboardShell } from "@/components/dashboard-shell"
import { Suspense } from "react"

export default function WinLossPage() {
  return (
    <DashboardShell>
      <Suspense fallback={<div>Loading analysis...</div>}>
        <WinLossAnalysis />
      </Suspense>
    </DashboardShell>
  )
}
