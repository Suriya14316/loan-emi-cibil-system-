"use client"

import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Home, DollarSign, Bell, Briefcase, LogOut, TrendingUp, User, Menu, X, Plus } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

export function UserNav() {
  const { logout, user } = useAuth()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: Home },
    { href: "/dashboard/loans", label: "My Loans", icon: DollarSign },
    { href: "/dashboard/loans/apply", label: "Apply for Loan", icon: Plus },
    { href: "/dashboard/cibil", label: "CIBIL Score", icon: TrendingUp },
    { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
    { href: "/dashboard/jobs", label: "Jobs", icon: Briefcase },
    { href: "/dashboard/file-upload", label: "File Upload", icon: Menu }, // Using Menu as placeholder for Upload
    { href: "/dashboard/data-management", label: "Correction Request", icon: Plus },
  ]

  return (
    <>
      <div className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex h-16 items-center px-4 sm:px-8 gap-6 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <span className="font-bold text-lg">L</span>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-foreground">
              Loan<span className="text-primary font-bold">System</span>
            </span>
          </div>

          <nav className="hidden lg:flex items-center gap-1 flex-1 ml-10">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "gap-2 px-4 h-9 font-semibold transition-all rounded-md",
                      isActive
                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-4 ml-auto">
            <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg border border-border bg-muted/30">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <User className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-xs font-bold text-foreground">{user?.name}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="gap-2 border-border text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all rounded-lg px-4"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "lg:hidden h-9 w-9 transition-all rounded-lg shadow-sm border border-border/50",
                mobileMenuOpen
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-14 sm:top-16 bg-background/95 backdrop-blur-lg z-40 animate-fade-in">
          <nav className="flex flex-col p-4 gap-2">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <span className="text-sm font-medium block">{user?.name}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
            </div>

            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={`w-full justify-start gap-3 h-12 text-base ${isActive ? "shadow-sm" : ""}`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </>
  )
}
