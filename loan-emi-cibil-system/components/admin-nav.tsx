"use client"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Home, Users, DollarSign, CreditCard, Bell, Briefcase, LogOut, Shield, Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

export function AdminNav() {
  const { logout, user } = useAuth()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/loans", label: "Loans", icon: DollarSign },
    { href: "/admin/payments", label: "Payments", icon: CreditCard },
    { href: "/admin/notifications", label: "Notifications", icon: Bell },
    { href: "/admin/jobs", label: "Jobs", icon: Briefcase },
    { href: "/admin/file-upload", label: "File Show", icon: Menu }, // Using Menu icon as placeholder or find a better File icon
    { href: "/admin/data-management", label: "Data Entry", icon: Shield },
  ]

  return (
    <>
      <div className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex h-16 items-center px-4 sm:px-6 gap-4 sm:gap-6 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Shield className="h-4 w-4" />
            </div>
            <span className="font-extrabold text-lg sm:text-xl text-foreground tracking-tight hidden xs:block">
              Admin<span className="text-primary font-bold">Panel</span>
            </span>
          </div>

          <nav className="hidden lg:flex items-center gap-1 flex-1 ml-4 sm:ml-10 overflow-x-auto no-scrollbar py-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href} className="flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "gap-2 px-3 sm:px-4 h-9 font-semibold transition-all rounded-md text-xs sm:text-sm",
                      isActive
                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg border border-border bg-muted/30">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <Shield className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[10px] font-bold text-primary uppercase tracking-tight">Admin</span>
                <span className="text-xs font-bold text-foreground">{user?.name}</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="hidden sm:flex gap-2 border-border text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all rounded-lg px-4"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
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
        <div className="lg:hidden fixed inset-0 top-16 bg-background/95 backdrop-blur-lg z-40 animate-fade-in border-t border-border">
          <nav className="flex flex-col p-4 gap-2">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 mb-4 border border-border">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <span className="text-sm font-bold block text-foreground">{user?.name}</span>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Administrator Access</span>
              </div>
            </div>

            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-4 h-12 text-base font-bold",
                      isActive ? "bg-primary/10 text-primary border border-primary/10" : "text-muted-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}

            <div className="mt-6 pt-6 border-t border-border">
              <Button
                variant="outline"
                className="w-full justify-start gap-4 h-12 text-destructive border-border hover:bg-destructive/10 hover:text-destructive font-bold"
                onClick={logout}
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </Button>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
