"use client"

import { cn } from "@/lib/utils"
import { Payment } from "@/lib/types"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { CreditCard, Loader2, Search, ArrowUpDown, ChevronUp, ChevronDown, Filter } from "lucide-react"
import { CyberSkeleton } from "@/components/cyber-skeleton"
import { useToast } from "@/hooks/use-toast"
import { useEffect, useState, useMemo } from "react"
import { apiClient, transformers } from "@/lib/api-client"

export default function AdminPaymentsPage() {
  const [loading, setLoading] = useState(true)
  const [payments, setPayments] = useState<Payment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [sortKey, setSortKey] = useState<keyof Payment>("dueDate")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const { toast } = useToast()

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const data = await apiClient.payments.getAll()
      setPayments((data || []).map(transformers.payment))
    } catch (error) {
      console.error("Failed to fetch payments", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  const filteredAndSortedPayments = useMemo(() => {
    let result = [...payments]

    // Search Filtering
    if (searchTerm) {
      const lowSearch = searchTerm.toLowerCase()
      result = result.filter(p =>
        p.id?.toString().toLowerCase().includes(lowSearch) ||
        p.loanId?.toString().toLowerCase().includes(lowSearch) ||
        p.userId?.toString().toLowerCase().includes(lowSearch)
      )
    }

    // Status Filtering
    if (statusFilter !== "ALL") {
      result = result.filter(p => p.status.toUpperCase() === statusFilter)
    }

    // Sorting
    result.sort((a, b) => {
      const valA = a[sortKey] || ""
      const valB = b[sortKey] || ""

      if (valA < valB) return sortOrder === "asc" ? -1 : 1
      if (valA > valB) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    return result
  }, [payments, searchTerm, statusFilter, sortKey, sortOrder])

  const handleSort = (key: keyof Payment) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortOrder("asc")
    }
  }

  const SortIcon = ({ column }: { column: keyof Payment }) => {
    if (sortKey !== column) return <ArrowUpDown className="ml-2 h-3 w-3 opacity-30" />
    return sortOrder === "asc" ? <ChevronUp className="ml-2 h-3 w-3 text-primary" /> : <ChevronDown className="ml-2 h-3 w-3 text-primary" />
  }

  const getStatusBadge = (status: Payment["status"]) => {
    const variants = {
      pending: "secondary",
      paid: "default",
      overdue: "destructive",
    } as const
    return <Badge variant={variants[status]}>{status.toUpperCase()}</Badge>
  }

  const handleMarkPaid = async (paymentId: string) => {
    try {
      await apiClient.payments.updateStatus(paymentId, "PAID")
      toast({
        title: "Success",
        description: "Payment status updated to PAID",
      })
      fetchPayments()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6 animate-fade-in bg-white">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
            <CreditCard className="h-6 w-6 text-primary" />
          </div>
          {"Payment Tracking"}
        </h1>
        <p className="text-slate-400 text-sm md:text-base">Monitor and verify all system-wide payment transactions.</p>
      </div>

      <Card className="border-white/50 bg-white backdrop-blur-xl overflow-hidden shadow-2xl">
        <CardHeader className="border-b border-white/5 bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
          <div>
            <CardTitle className="text-white text-xl">Transaction Control Center</CardTitle>
            <CardDescription className="text-slate-500 font-mono text-[10px] uppercase tracking-wider mt-1">{"Live Liquidity Stream | Protocol: PAY-NET-V4"}</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Filter Transaction ID..."
                className="pl-10 w-48 bg-white/5 border-white/10 text-white h-9 focus-visible:ring-primary/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex bg-white/5 border border-white/10 rounded-lg p-0.5">
              {["ALL", "PENDING", "PAID"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-[10px] font-bold tracking-tighter transition-all",
                    statusFilter === status ? "bg-primary text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-white/[0.01]">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead
                  className="text-slate-500 font-mono font-bold uppercase tracking-wider text-[10px] px-6 cursor-pointer hover:text-slate-300 transition-colors"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center">{"ID"} <SortIcon column="id" /></div>
                </TableHead>
                <TableHead
                  className="text-slate-500 font-mono font-bold uppercase tracking-wider text-[10px] cursor-pointer hover:text-slate-300 transition-colors"
                  onClick={() => handleSort('loanId')}
                >
                  <div className="flex items-center">{"Loan"} <SortIcon column="loanId" /></div>
                </TableHead>
                <TableHead className="text-slate-500 font-mono font-bold uppercase tracking-wider text-[10px]">{"User"}</TableHead>
                <TableHead
                  className="text-slate-500 font-mono font-bold uppercase tracking-wider text-[10px] cursor-pointer hover:text-slate-300 transition-colors"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center">{"Amount"} <SortIcon column="amount" /></div>
                </TableHead>
                <TableHead
                  className="text-slate-500 font-mono font-bold uppercase tracking-wider text-[10px] cursor-pointer hover:text-slate-300 transition-colors"
                  onClick={() => handleSort('dueDate')}
                >
                  <div className="flex items-center">{"Due Date"} <SortIcon column="dueDate" /></div>
                </TableHead>
                <TableHead className="text-slate-500 font-mono font-bold uppercase tracking-wider text-[10px]">{"Paid Date"}</TableHead>
                <TableHead className="text-slate-500 font-mono font-bold uppercase tracking-wider text-[10px]">{"Status"}</TableHead>
                <TableHead className="text-slate-500 font-mono font-bold uppercase tracking-wider text-[10px]">{"Protocol"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i} className="border-white/5">
                    <TableCell colSpan={8} className="p-4">
                      <CyberSkeleton variant="row" className="h-4" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredAndSortedPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3 opacity-40">
                      <Filter className="h-12 w-12 text-slate-500" />
                      <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">
                        {searchTerm ? `No matches for "${searchTerm}"` : "No Financial Loops Detected"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedPayments.map((payment) => (
                  <TableRow key={payment.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <TableCell className="font-mono text-[11px] text-primary/70 group-hover:text-primary transition-colors px-6">{payment.id.toString().substring(0, 8)}...</TableCell>
                    <TableCell className="text-slate-500 text-[11px] font-mono group-hover:text-slate-400 transition-colors uppercase">{payment.loanId.toString().substring(0, 8)}...</TableCell>
                    <TableCell className="text-slate-500 text-[11px] font-mono group-hover:text-slate-400 transition-colors uppercase">{payment.userId.toString().substring(0, 8)}...</TableCell>
                    <TableCell className="text-slate-200 font-bold font-mono text-xs group-hover:text-white transition-colors">₹{payment.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-slate-400 text-[11px] font-mono group-hover:text-slate-300 transition-colors">{new Date(payment.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-slate-500 text-[11px] font-mono group-hover:text-slate-400 transition-colors">{payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : "---"}</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell>
                      {payment.status === "pending" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleMarkPaid(payment.id.toString())}
                          className="h-7 border border-primary/20 hover:bg-primary/20 hover:border-primary/40 text-primary uppercase font-bold text-[9px] tracking-widest rounded transition-all active:scale-95"
                        >
                          Verify Payment
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
