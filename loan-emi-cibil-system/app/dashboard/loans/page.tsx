"use client"

import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"
import { apiClient, transformers } from "@/lib/api-client"
import { cn } from "@/lib/utils"
import type { Loan } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar, DollarSign, Plus, Upload, Loader2, FileText, RefreshCw } from "lucide-react"

export default function UserLoansPage() {
  const { user } = useAuth()
  const [loans, setLoans] = useState<Loan[]>([])
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Form State
  const [loanType, setLoanType] = useState("")
  const [principal, setPrincipal] = useState("")
  const [interestRate, setInterestRate] = useState("10.5") // Default example rate
  const [tenureMonths, setTenureMonths] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const fetchLoans = async (isManualRefresh = false) => {
    if (user) {
      try {
        if (isManualRefresh) {
          setRefreshing(true)
        }
        const data = await apiClient.loans.getByUserId(user.id)
        setLoans(data.map(transformers.loan))
      } catch (error) {
        console.error("Failed to fetch loans:", error)
      } finally {
        if (isManualRefresh) {
          setRefreshing(false)
        }
      }
    }
  }

  useEffect(() => {
    fetchLoans()

    // Auto-refresh every 10 seconds to get latest loan status from admin
    const interval = setInterval(() => {
      fetchLoans()
    }, 10000) // 10 seconds

    return () => clearInterval(interval)
  }, [user])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.size > 40 * 1024) { // 40KB limit
        alert("File size exceeds 40KB. Please upload a smaller file.")
        e.target.value = "" // Reset input
        setFile(null)
        return
      }
      setFile(selectedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      setSubmitting(true)
      const formData = new FormData()
      formData.append("userId", user.id)
      formData.append("loanType", loanType)
      formData.append("principal", principal)
      formData.append("interestRate", interestRate)
      formData.append("tenureMonths", tenureMonths)
      if (file) {
        formData.append("file", file)
      }

      await apiClient.loans.apply(formData)

      setOpen(false)
      // Reset form
      setLoanType("")
      setPrincipal("")
      setTenureMonths("")
      setFile(null)

      // Refresh list
      fetchLoans()
    } catch (error) {
      console.error("Failed to apply for loan:", error)
      alert("Failed to apply for loan. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            {"Portfolio Ledger"}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">Comprehensive record of active and closed loan accounts.</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchLoans(true)}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
            Refresh
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all h-11 px-6 rounded-xl">
                <Plus className="h-4 w-4" />
                Apply for Loan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Loan Application</DialogTitle>
                <DialogDescription>
                  Submit your request for a new loan. Our team will review your application shortly.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Loan Type</Label>
                  <Select value={loanType} onValueChange={setLoanType} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select loan type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERSONAL">Personal Loan</SelectItem>
                      <SelectItem value="HOME">Home Loan</SelectItem>
                      <SelectItem value="CAR">Car Loan</SelectItem>
                      <SelectItem value="EDUCATION">Education Loan</SelectItem>
                      <SelectItem value="BUSINESS">Business Loan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="principal">Amount (₹)</Label>
                    <Input
                      id="principal"
                      type="number"
                      placeholder="Ex. 500000"
                      value={principal}
                      onChange={(e) => setPrincipal(e.target.value)}
                      required
                      min="1000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tenure">Tenure (Months)</Label>
                    <Input
                      id="tenure"
                      type="number"
                      placeholder="Ex. 24"
                      value={tenureMonths}
                      onChange={(e) => setTenureMonths(e.target.value)}
                      required
                      min="6"
                      max="360"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rate">Interest Rate (%)</Label>
                  <Input
                    id="rate"
                    type="number"
                    step="0.01"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    readOnly // Could be editable or fixed based on policy
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Supporting Document (Optional)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="file"
                      type="file"
                      onChange={handleFileChange}
                      className="cursor-pointer file:cursor-pointer file:text-primary file:border-0 file:bg-transparent file:font-semibold"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">Upload proof of income or collateral documents.</p>
                </div>

                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 sm:gap-6">
          {loans.length === 0 ? (
            <Card className="border-dashed border-2 border-border/50 bg-muted/5 p-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="p-4 rounded-full bg-muted/10">
                <DollarSign className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-semibold text-muted-foreground">No Active Loans</h3>
              <p className="text-sm text-muted-foreground/60 max-w-xs">You don't have any active loans. Apply for a new loan to get started.</p>
            </Card>
          ) : (
            loans.map((loan, index) => {
              const progress = ((loan.principal - loan.outstandingBalance) / loan.principal) * 100
              const monthsPaid = Math.floor((loan.principal - loan.outstandingBalance) / loan.emi)
              const monthsRemaining = loan.tenureMonths - monthsPaid

              return (
                <div key={loan.id} className="animate-slide-up hover-lift group" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="relative overflow-hidden rounded-t-2xl sm:rounded-t-3xl p-5 sm:p-6 lg:p-8 border border-border bg-white backdrop-blur-xl shadow-2xl">
                    <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-primary/10 rounded-full -mr-16 sm:-mr-20 -mt-16 sm:-mt-20 blur-3xl group-hover:bg-primary/20 transition-all" />

                    <div className="relative space-y-4 sm:space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-1 sm:mb-2 italic">
                            {loan.loanType}
                            {" Segment"}
                          </p>
                          <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-1">
                            {"₹"}
                            {loan.principal.toLocaleString()}
                          </p>
                          <p className="text-muted-foreground text-xs sm:text-sm font-mono tracking-tighter">{"BASE PRINCIPAL MATRIC"}</p>
                        </div>
                        <Badge className={cn(
                          "border backdrop-blur-sm px-4 py-1 self-start font-bold uppercase text-[10px]",
                          loan.status === "ACTIVE" ? "bg-green-100 text-green-700 border-green-200" :
                            loan.status === "PENDING" ? "bg-amber-100 text-amber-700 border-amber-200" :
                              loan.status === "REJECTED" ? "bg-red-100 text-red-700 border-red-200" :
                                "bg-muted text-muted-foreground border-border"
                        )}>
                          {loan.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 py-4 border-y border-border bg-muted/5">
                        <div className="space-y-1 text-center">
                          <p className="text-muted-foreground text-[10px] font-bold uppercase">{"Monthly EMI"}</p>
                          <p className="text-base sm:text-lg lg:text-2xl font-black text-foreground">
                            {"₹"}
                            {loan.emi.toLocaleString()}
                          </p>
                        </div>
                        <div className="space-y-1 text-center border-x border-border">
                          <p className="text-muted-foreground text-[10px] font-bold uppercase">{"Yield Rate"}</p>
                          <p className="text-base sm:text-lg lg:text-2xl font-black text-primary">
                            {loan.interestRate}
                            {"%"}
                          </p>
                        </div>
                        <div className="space-y-1 text-center">
                          <p className="text-muted-foreground text-[10px] font-bold uppercase">{"Duration"}</p>
                          <p className="text-base sm:text-lg lg:text-2xl font-black text-foreground">
                            {loan.tenureMonths}
                            {"M"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-muted-foreground">{"Equity Retrieval Progress"}</span>
                          <span className="text-primary text-sm sm:text-base">
                            {progress.toFixed(0)}
                            {"%"}
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-1000 shadow-sm"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                          <span>
                            {"EQUITY: ₹"}
                            {(loan.principal - loan.outstandingBalance).toLocaleString()}
                          </span>
                          <span>
                            {"RESIDUAL: ₹"}
                            {loan.outstandingBalance.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {loan.rejectionReason && loan.status === 'REJECTED' && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg">
                          <p className="text-xs font-bold text-red-800 uppercase mb-1">Rejection Reason</p>
                          <p className="text-sm text-red-700">{loan.rejectionReason}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <Card className="border-border bg-white backdrop-blur-xl rounded-t-none rounded-b-2xl sm:rounded-b-3xl shadow-2xl -mt-1 overflow-hidden">
                    <CardContent className="pt-6 sm:pt-10 pb-6 sm:pb-8 px-6 sm:px-10">
                      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
                        <div className="p-5 rounded-2xl bg-muted/10 border border-border hover:border-primary/20 transition-all duration-300">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{"Cycles Complete"}</p>
                          <p className="text-4xl sm:text-5xl font-black text-foreground">{monthsPaid}</p>
                        </div>
                        <div className="p-5 rounded-2xl bg-muted/10 border border-border hover:border-accent/20 transition-all duration-300">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{"Cycles Residual"}</p>
                          <p className="text-4xl sm:text-5xl font-black text-foreground">{monthsRemaining}</p>
                        </div>
                        <div className="p-5 rounded-2xl bg-muted/10 border border-border hover:border-chart-3/20 transition-all duration-300 flex flex-col justify-center">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-3.5 w-3.5 text-chart-3" />
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{"Initiation"}</p>
                          </div>
                          <p className="text-lg sm:text-xl font-bold text-foreground">
                            {new Date(loan.startDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            }))}
        </div>
      </div>
      )
}
