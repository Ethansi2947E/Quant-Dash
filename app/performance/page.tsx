import { DetailedAnalytics } from "@/components/detailed-analytics"
import { DashboardShell } from "@/components/dashboard-shell"
import { PerformanceProvider } from "@/hooks/use-performance-data"

export default function PerformancePage() {
  return (
    <DashboardShell>
      <PerformanceProvider>
        <DetailedAnalytics />
      </PerformanceProvider>
    </DashboardShell>
  )
}
