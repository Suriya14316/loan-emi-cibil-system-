"use client"

import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"
import { apiClient, transformers } from "@/lib/api-client"
import { cn } from "@/lib/utils"
import type { CibilScore } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getCibilScoreCategory } from "@/lib/utils/calculations"
import { TrendingUp, CheckCircle, AlertTriangle, Info, Zap } from "lucide-react"

export default function CibilScorePage() {
  const { user } = useAuth()
  const [cibilScore, setCibilScore] = useState<CibilScore | null>(null)

  useEffect(() => {
    const fetchCibil = async () => {
      if (user) {
        try {
          const data = await apiClient.cibil.getByUserId(user.id)
          setCibilScore(transformers.cibilScore(data))
        } catch (error) {
          // Silent failure - user might not have a CIBIL score yet
        }
      }
    }
    fetchCibil()
  }, [user])

  if (!cibilScore) {
    return (
      <div className="space-y-6 sm:space-y-8 animate-fade-in">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            {"Credit Analysis"}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">{"Establishing secure connection to credit bureaus..."}</p>
        </div>
        <Card className="border-border bg-white backdrop-blur-xl animate-scale-in border shadow-2xl">
          <CardContent className="py-24">
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-muted/20 border border-border mx-auto mb-6 flex items-center justify-center animate-pulse">
                <Zap className="h-10 w-10 text-primary" />
              </div>
              <p className="text-lg font-bold text-foreground">
                {"Synchronizing Data Streams"}
              </p>
              <p className="text-sm text-muted-foreground mt-2 italic">{"No credit records found for current identity."}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const scoreCategory = getCibilScoreCategory(cibilScore.score)

  const factorDetails = [
    {
      name: "Payment History",
      value: cibilScore.factors.paymentHistory,
      weight: "35%",
      description: "Your track record of on-time payments",
      icon: CheckCircle,
    },
    {
      name: "Credit Utilization",
      value: cibilScore.factors.creditUtilization,
      weight: "30%",
      description: "How much credit you're using vs. available",
      icon: TrendingUp,
    },
    {
      name: "Credit Age",
      value: cibilScore.factors.creditAge,
      weight: "15%",
      description: "Length of your credit history",
      icon: Info,
    },
    {
      name: "Credit Mix",
      value: cibilScore.factors.creditMix,
      weight: "10%",
      description: "Variety of credit types you have",
      icon: Info,
    },
    {
      name: "Recent Inquiries",
      value: cibilScore.factors.recentInquiries,
      weight: "10%",
      description: "Number of recent credit applications",
      icon: AlertTriangle,
    },
  ]

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      <div className="space-y-1">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          {"Credit Telemetry"}
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          {"Real-time creditworthiness assessment and factor distribution."}
        </p>
      </div>

      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-white backdrop-blur-xl p-6 sm:p-8 lg:p-12 text-foreground shadow-2xl animate-bounce-in">
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-primary/10 rounded-full -mr-24 sm:-mr-32 -mt-24 sm:-mt-32 blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-accent/5 rounded-full -ml-16 sm:-ml-24 -mb-16 sm:-mb-24 blur-3xl"
        />

        <div className="relative">
          <p className="text-muted-foreground text-[10px] sm:text-xs font-bold mb-4 sm:mb-6 lg:mb-8 uppercase tracking-[0.3em] font-mono">
            {"[ Identity Credit Authorization Score ]"}
          </p>
          <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-12">
            <div className="relative" style={{ animationDelay: "0.3s" }}>
              <div className="w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 rounded-full border border-border backdrop-blur-md flex items-center justify-center bg-white shadow-[0_0_50px_rgba(59,130,246,0.1)] relative">
                <div className="text-center relative z-10">
                  <div className="text-5xl sm:text-6xl lg:text-8xl font-black mb-1 sm:mb-2 text-foreground drop-shadow-sm">{cibilScore.score}</div>
                  <div className={cn("text-[10px] sm:text-xs lg:text-sm font-bold border rounded-full px-3 py-1 uppercase tracking-wider bg-white", scoreCategory.color.replace('text-', 'border-').replace('text-', 'text-'))}>
                    {scoreCategory.category}
                  </div>
                </div>
                {/* Circular indicator */}
                <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" style={{ animationDuration: '3s' }} />
              </div>
            </div>
            <div className="flex-1 space-y-4 sm:space-y-6 text-center lg:text-left">
              <div>
                <h3 className="font-black text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-4 text-foreground">{"Score Briefing"}</h3>
                <p className="text-muted-foreground text-sm sm:text-base lg:text-xl leading-relaxed max-w-2xl font-medium">
                  {scoreCategory.description}
                </p>
              </div>
              <div className="space-y-3 sm:space-y-4 max-w-md mx-auto lg:mx-0">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                  {"Spectrum Position"}
                </div>
                <div className="flex gap-4 items-center">
                  <span className="text-[10px] font-bold text-muted-foreground font-mono">{"300"}</span>
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.6)]"
                      style={{ width: `${((cibilScore.score - 300) / 600) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground font-mono">{"900"}</span>
                </div>
              </div>
              <p className="text-muted-foreground text-[10px] sm:text-xs font-mono uppercase">
                {"Data Sync: "}
                {new Date(cibilScore.lastUpdated).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-black text-foreground uppercase tracking-wider animate-slide-right flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          {"Metrics Matrix"}
        </h2>
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
          {factorDetails.map((factor, index) => {
            const Icon = factor.icon
            return (
              <Card
                key={factor.name}
                className="border-border bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border animate-slide-up group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-4 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-black text-lg text-foreground mb-1">{factor.name}</h3>
                          <p className="text-xs text-muted-foreground font-medium leading-relaxed">{factor.description}</p>
                        </div>
                        <div className="text-left sm:text-right shrink-0">
                          <div className="text-3xl font-black text-foreground">
                            {factor.value}
                            <span className="text-muted-foreground text-xs font-bold ml-1">{"/ 100"}</span>
                          </div>
                          <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">
                            {"WGT: "}
                            {factor.weight}
                          </div>
                        </div>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full shadow-sm"
                          style={{ width: `${factor.value}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <Card
        className="border-border bg-white shadow-2xl animate-slide-up border"
        style={{ animationDelay: "0.5s" }}
      >
        <CardHeader className="pb-6 border-b border-border">
          <CardTitle className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-3">
            <div className="p-2 bg-green-500/10 border border-green-500/20 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            {"Operational Recommendations"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-6">
          {[
            "Pay all your EMIs on time to maintain a good payment history",
            "Keep your credit utilization below 30% of available credit",
            "Avoid applying for multiple loans or credit cards in a short period",
            "Maintain a healthy mix of secured and unsecured loans",
          ].map((tip, index) => (
            <div
              key={index}
              className="flex gap-4 p-4 rounded-xl border border-border bg-muted/5 hover:bg-muted/10 transition-all duration-300"
              style={{ animationDelay: `${0.6 + index * 0.1}s` }}
            >
              <div className="p-1 rounded-full bg-green-500/20 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              </div>
              <p className="text-sm sm:text-base font-bold text-muted-foreground">{tip}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
