"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  {
    title: "Dashboard",
    href: "/",
  },
  {
    title: "Performance",
    href: "/performance",
  },
  {
    title: "Win/Loss Analysis",
    href: "/win-loss",
  },
  {
    title: "Trade History",
    href: "/history",
  },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-1 rounded-lg bg-muted p-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            pathname === item.href
              ? "bg-background text-foreground shadow"
              : "hover:bg-background/50 hover:text-foreground",
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
