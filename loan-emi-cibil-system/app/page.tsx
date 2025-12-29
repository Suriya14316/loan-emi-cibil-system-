"use client"

import { useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { UnifiedAuthForm } from "@/components/unified-auth-form"
import { TrendingUp, Shield, Zap, CheckCircle2, Globe, ArrowRight, Wallet, BadgeCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.push(user.role === "ADMIN" ? "/admin" : "/dashboard")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-t-2 border-primary animate-spin" />
          <p className="text-muted-foreground animate-pulse font-medium">Loading Experience...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider animate-fade-in">
              <BadgeCheck className="h-3.5 w-3.5" />
              Next-Gen Loan Management
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1] animate-slide-up">
                Smarter Loans for <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  Modern Growth.
                </span>
              </h1>
              <p className="text-xl text-muted-foreground font-medium leading-relaxed animate-slide-up [animation-delay:0.1s]">
                The most advanced interface for managing capital, tracking credit health, and securing your financial future. Built for professionals who demand excellence.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 animate-slide-up [animation-delay:0.2s]">
              <div className="flex gap-4 p-4 rounded-2xl bg-card border border-border transition-all hover:shadow-lg hover:border-primary/20 group">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Credit Analytics</h3>
                  <p className="text-sm text-muted-foreground">Real-time CIBIL score tracking and insights.</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-2xl bg-card border border-border transition-all hover:shadow-lg hover:border-accent/20 group">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Secure Vault</h3>
                  <p className="text-sm text-muted-foreground">Bank-grade encryption for all financial data.</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8 pt-4 animate-slide-up [animation-delay:0.3s]">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden ring-2 ring-primary/10">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                  </div>
                ))}
                <div className="h-10 w-10 rounded-full border-2 border-background bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center ring-2 ring-primary/10">
                  +2k
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Trusted by 2,000+ users</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Zap key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end animate-scale-in">
            <UnifiedAuthForm />
          </div>
        </div>
      </main>

      {/* Footer / Simple Info */}
      <footer className="container mx-auto px-4 py-12 border-t border-border mt-20">
        <div className="flex flex-col md:row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white">L</div>
            LoanSystem
          </div>
          <div className="flex gap-8 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 LoanSystem Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
