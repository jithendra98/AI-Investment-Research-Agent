"use client"

import * as React from "react"
import { Brain, Menu, X } from "lucide-react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const navItems = [
  { name: "Dashboard", href: "/" },
  { name: "Reports", href: "/reports" },
  { name: "Settings", href: "/settings" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1600px] 2xl:max-w-[1800px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo / Brand */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/25">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300 bg-clip-text text-lg font-bold tracking-tight text-transparent">
            AI Research Agent
          </span>
        </div>

        {/* Center / Right: Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground",
                pathname === item.href && "bg-accent/50 text-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right: Badge + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="hidden border-border/50 bg-muted/30 text-xs text-muted-foreground backdrop-blur-sm sm:inline-flex"
          >
            InsideIIM × Altuni
          </Badge>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-t border-border/50 bg-background/95 backdrop-blur-xl md:hidden">
          <nav className="mx-auto flex w-full max-w-[1600px] 2xl:max-w-[1800px] flex-col gap-1 px-4 py-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2 text-left text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground",
                  pathname === item.href && "bg-accent/50 text-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-2 border-t border-border/50 pt-3">
              <Badge
                variant="outline"
                className="border-border/50 bg-muted/30 text-xs text-muted-foreground"
              >
                InsideIIM × Altuni
              </Badge>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
