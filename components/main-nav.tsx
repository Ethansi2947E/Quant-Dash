"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

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
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-1 rounded-lg bg-muted p-1">
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

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="h-9 w-9">
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>

        {isOpen && (
          <div className="absolute top-14 left-0 right-0 z-50 bg-background border-b shadow-lg">
            <nav className="container py-4">
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      pathname === item.href ? "bg-muted text-foreground" : "hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        )}
      </div>
    </>
  )
}
