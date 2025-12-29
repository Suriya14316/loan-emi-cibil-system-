"use client"

import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"
import { apiClient, transformers } from "@/lib/api-client"
import type { Loan, Payment, CibilScore } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DollarSign, CreditCard, TrendingUp, AlertCircle, ArrowRight } from "lucide-react"
import { getCibilScoreCategory } from "@/lib/utils/calculations"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Download, FileText } from "lucide-react"

function DocumentsList() {
  const [files, setFiles] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // @ts-ignore
    if (apiClient.admin?.getFiles) {
      apiClient.admin.getFiles() // @ts-ignore
        .then(setFiles) // @ts-ignore
        .catch(err => console.error(err)) // @ts-ignore
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  if (loading) return <div className="h-20 animate-pulse bg-muted/10 rounded" />

  if (files.length === 0) return (
    <div className="text-center py-8 text-muted-foreground text-sm">
      No circulars available.
    </div>
  )

  return (
    <div className="space-y-3">
      {files.map((file, i) => (
        <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/5 hover:bg-muted/10 transition-colors group">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-purple-500/10 text-purple-500">
              <FileText className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium text-foreground truncate max-w-[200px]">{file}</span>
          </div>
          <a href={`http://localhost:8081/api/admin/files/${file}`} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-purple-500">
              <Download className="h-4 w-4" />
            </Button>
          </a>
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [loans, setLoans] = useState<Loan[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [cibilScore, setCibilScore] = useState<CibilScore | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = async (isManualRefresh = false) => {
    if (user) {
      try {
        if (isManualRefresh) {
          setRefreshing(true)
        } else {
          setLoading(true)
        }

        // Fetch loans - handle empty array
        try {
          const loansData = await apiClient.loans.getByUserId(user.id)
          setLoans(loansData && loansData.length > 0 ? loansData.map(transformers.loan) : [])
        } catch (error) {
          console.log("No loans found for user, setting to empty array")
          setLoans([])
        }

        // Fetch payments - handle empty array
        try {
          const paymentsData = await apiClient.payments.getByUserId(user.id)
          setPayments(paymentsData && paymentsData.length > 0 ? paymentsData.map(transformers.payment) : [])
        } catch (error) {
          console.log("No payments found for user, setting to empty array")
          setPayments([])
        }

        // Fetch CIBIL score - handle null/not found
        try {
          const cibilData = await apiClient.cibil.getByUserId(user.id)
          if (cibilData && cibilData.score) {
            setCibilScore(transformers.cibilScore(cibilData))
          } else {
            setCibilScore(null)
          }
        } catch (error) {
          console.log("No CIBIL score found for user, setting to null")
          setCibilScore(null)
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        // Set default empty values on error
        setLoans([])
        setPayments([])
        setCibilScore(null)
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    }
  }

  useEffect(() => {
    fetchData()

    // Auto-refresh every 10 seconds to get latest loan status from admin
    const interval = setInterval(() => {
      fetchData()
    }, 10000) // 10 seconds

    return () => clearInterval(interval)
  }, [user])

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8 animate-fade-in p-4 sm:p-6 lg:p-0">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-balance">
            {"Welcome back, "}
            {user?.name}
            {"!"}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
            {"Establishing secure connection to credit bureaus..."}
          </p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      </div>
    )
  }

  const activeLoans = loans.filter((l) => l.status === "active")
  const totalOutstanding = activeLoans.reduce((sum, loan) => sum + loan.outstandingBalance, 0)
  const monthlyEMI = activeLoans.reduce((sum, loan) => sum + loan.emi, 0)
  const pendingPayments = payments.filter((p) => p.status === "pending" || p.status === "overdue")

  const scoreCategory = cibilScore ? getCibilScoreCategory(cibilScore.score) : null

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Welcome back, <span className="text-primary">{user?.name}</span>
        </h1>
        <p className="text-muted-foreground font-medium">
          Here's a summary of your current financial portfolio and credit health.
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white border-blue-100 shadow-2xl hover:shadow-xl transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-blue-600 uppercase tracking-wider">Active Loans</CardTitle>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{activeLoans.length}</div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Outstanding: <span className="text-slate-900 font-bold">₹{totalOutstanding.toLocaleString()}</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-purple-100 shadow-2xl hover:shadow-xl transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-purple-600 uppercase tracking-wider">Monthly EMI</CardTitle>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <CreditCard className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">₹{monthlyEMI.toLocaleString()}</div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Total monthly commitment</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-emerald-100 shadow-2xl hover:shadow-xl transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-emerald-600 uppercase tracking-wider">CIBIL Score</CardTitle>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{cibilScore?.score || "N/A"}</div>
            {scoreCategory && (
              <p className={cn("text-xs font-bold mt-1", scoreCategory.color)}>{scoreCategory.category}</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white border-rose-100 shadow-2xl hover:shadow-xl transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-rose-600 uppercase tracking-wider">Pending Alerts</CardTitle>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <AlertCircle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{pendingPayments.length}</div>
            <p className="text-xs text-slate-500 mt-1 font-medium italic">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20 pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Download className="h-5 w-5 text-purple-500" />
              System Circulars
            </CardTitle>
            <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
              Latest Updates
            </Badge>
          </CardHeader>
          <CardContent className="pt-6">
            <DocumentsList />
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20 pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Active Portfolios
            </CardTitle>
            <Link href="/dashboard/loans">
              <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-primary transition-colors group">
                View All
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {activeLoans.length > 0 ? (
              activeLoans.map((loan) => {
                const progress = ((loan.principal - loan.outstandingBalance) / loan.principal) * 100
                return (
                  <div
                    key={loan.id}
                    className="p-4 rounded-xl border border-border bg-muted/5 hover:bg-muted/10 transition-colors space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Principal Amount</p>
                        <p className="text-2xl font-black text-foreground">₹{loan.principal.toLocaleString()}</p>
                      </div>
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold uppercase text-[10px]">
                        {loan.loanType}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Monthly EMI</p>
                        <p className="text-sm font-bold">₹{loan.emi.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Interest Rate</p>
                        <p className="text-sm font-bold">{loan.interestRate}%</p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-bold uppercase">
                        <span className="text-muted-foreground">Repayment Progress</span>
                        <span className="text-primary">{progress.toFixed(0)}%</span>
                      </div>
                      <Progress value={progress} className="h-1.5" />
                      <p className="text-[10px] text-muted-foreground font-medium">REMAINING: ₹{loan.outstandingBalance.toLocaleString()}</p>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground font-medium">No active loans found.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20 pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-accent" />
              Upcoming Payments
            </CardTitle>
            <Link href="/dashboard/loans">
              <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-accent transition-colors group">
                Registry
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            {pendingPayments.length > 0 ? (
              pendingPayments.slice(0, 4).map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">₹{payment.amount.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">
                        Due: {new Date(payment.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={payment.status === "overdue" ? "destructive" : "secondary"}
                    className="uppercase text-[10px] font-black px-2.5 rounded-full"
                  >
                    {payment.status}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground font-medium">All payments up to date.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {cibilScore && (
        <Card className="border-border bg-card shadow-sm overflow-hidden">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle className="text-lg font-bold">Credit Health Analytics</CardTitle>
            <p className="text-xs text-muted-foreground font-medium">A detailed breakdown of your credit score factors.</p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
              {[
                { label: "Payment History", value: cibilScore.factors.paymentHistory },
                { label: "Credit Usage", value: cibilScore.factors.creditUtilization },
                { label: "Credit Age", value: cibilScore.factors.creditAge },
                { label: "Credit Mix", value: cibilScore.factors.creditMix },
                { label: "Recent Inquiries", value: cibilScore.factors.recentInquiries },
              ].map((factor) => (
                <div key={factor.label} className="p-4 rounded-xl bg-muted/10 border border-border/50 transition-all hover:bg-muted/20 space-y-3">
                  <p className="text-xs font-bold text-muted-foreground uppercase">{factor.label}</p>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xl font-black text-primary">{factor.value}%</span>
                  </div>
                  <Progress value={factor.value} className="h-1.5" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
