"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useCallback, useState } from "react"

export function DashboardNav() {
  const pathname = usePathname()
  const [error, setError] = useState<Error | null>(null)

  const handleNavigation = useCallback(async (path: string) => {
    try {
      // Add any async operations here
      setError(null)
    } catch (err) {
      setError(err as Error)
      console.error("Navigation error:", err)
    }
  }, [])

  if (error) {
    return <div className="p-4 text-red-500">An error occurred. Please try again.</div>
  }

  return (
    <div className="flex rounded-lg bg-slate-100 p-1">
      <Link
        href="/performance"
        onClick={() => handleNavigation("/performance")}
        className={cn(
          "rounded-md px-4 py-2 text-sm font-medium transition-colors",
          pathname === "/performance" ? "bg-white shadow-sm" : "text-slate-600 hover:bg-white/50 hover:text-slate-900",
        )}
      >
        Performance
      </Link>
      <Link
        href="/win-loss"
        onClick={() => handleNavigation("/win-loss")}
        className={cn(
          "rounded-md px-4 py-2 text-sm font-medium transition-colors",
          pathname === "/win-loss" ? "bg-white shadow-sm" : "text-slate-600 hover:bg-white/50 hover:text-slate-900",
        )}
      >
        Win/Loss Analysis
      </Link>
      <Link
        href="/history"
        onClick={() => handleNavigation("/history")}
        className={cn(
          "rounded-md px-4 py-2 text-sm font-medium transition-colors",
          pathname === "/history" ? "bg-white shadow-sm" : "text-slate-600 hover:bg-white/50 hover:text-slate-900",
        )}
      >
        Trade History
      </Link>
    </div>
  )
}
