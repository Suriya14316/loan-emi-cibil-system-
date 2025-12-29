"use client"

import { cn } from "@/lib/utils"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Plus, DollarSign, Loader2, Search, ArrowUpDown, ChevronUp, ChevronDown, Filter, XCircle, CheckCircle, FileText, Download } from "lucide-react"
import { useEffect, useState, useMemo } from "react"
import { apiClient, transformers } from "@/lib/api-client"
import type { Loan } from "@/lib/types"
// Assuming Dialog components exist given standard shadcn setup
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function AdminLoansPage() {
  const [loading, setLoading] = useState(true)
  const [loans, setLoans] = useState<Loan[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("ALL")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [sortKey, setSortKey] = useState<keyof Loan>("startDate")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // For Rejection Dialog
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchLoans = async () => {
    try {
      setLoading(true)
      const data = await apiClient.loans.getAll()
      setLoans((data || []).map(transformers.loan))
    } catch (error) {
      console.error("Failed to fetch loans", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLoans()
  }, [])

  const filteredAndSortedLoans = useMemo(() => {
    let result = [...loans]

    // Search Filtering
    if (searchTerm) {
      const lowSearch = searchTerm.toLowerCase()
      result = result.filter(l =>
        l.id?.toString().toLowerCase().includes(lowSearch) ||
        l.userId?.toString().toLowerCase().includes(lowSearch) ||
        l.loanType?.toLowerCase().includes(lowSearch)
      )
    }

    // Type Filtering
    if (typeFilter !== "ALL") {
      result = result.filter(l => l.loanType.toUpperCase() === typeFilter)
    }

    // Status Filtering (Optional add-on)
    if (statusFilter !== "ALL") {
      result = result.filter(l => l.status.toUpperCase() === statusFilter)
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
  }, [loans, searchTerm, typeFilter, statusFilter, sortKey, sortOrder])

  const handleSort = (key: keyof Loan) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortOrder("asc")
    }
  }

  const SortIcon = ({ column }: { column: keyof Loan }) => {
    if (sortKey !== column) return <ArrowUpDown className="ml-2 h-3 w-3 opacity-30" />
    return sortOrder === "asc" ? <ChevronUp className="ml-2 h-3 w-3 text-blue-600" /> : <ChevronDown className="ml-2 h-3 w-3 text-blue-600" />
  }

  const getStatusBadge = (status: Loan["status"]) => {
    const s = status.toLowerCase()
    if (s === 'active') return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200">Active</Badge>
    if (s === 'completed') return <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200">Completed</Badge>
    if (s === 'rejected') return <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200">Rejected</Badge>
    if (s === 'pending') return <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200">Pending</Badge>
    return <Badge variant="outline">{status}</Badge>
  }

  const handleDownloadFile = async (loan: Loan) => {
    if (!loan.uploadedFilePath) return
    try {
      const filename = loan.uploadedFilePath.split('/').pop() || loan.uploadedFileName || 'document'
      const response = await fetch(`http://localhost:8081/api/admin/files/${filename}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (!response.ok) throw new Error('Failed to download file')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = loan.uploadedFileName || 'document'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Failed to download file', error)
      alert('Failed to download file')
    }
  }

  const openRejectDialog = (loan: Loan) => {
    setSelectedLoan(loan)
    setRejectReason("")
    setIsRejectDialogOpen(true)
  }

  const handleRejectLoan = async () => {
    if (!selectedLoan) return;
    try {
      setActionLoading(true)

      // Optimistic UI update
      setLoans(prev => prev.map(l => l.id === selectedLoan.id ? { ...l, status: 'REJECTED', rejectionReason: rejectReason } : l))

      await apiClient.loans.update(selectedLoan.id, {
        ...selectedLoan,
        loanType: selectedLoan.loanType.toUpperCase(),
        status: 'REJECTED',
        rejectionReason: rejectReason
      })

      await fetchLoans()
      setIsRejectDialogOpen(false)
    } catch (error) {
      console.error("Error rejected loan", error)
      alert("Failed to reject loan")
    } finally {
      setActionLoading(false)
    }
  }

  const handleApprove = async (loan: Loan) => {
    if (!confirm("Are you sure you want to approve this loan?")) return
    try {
      setActionLoading(true)

      // Optimistic UI update
      setLoans(prev => prev.map(l => l.id === loan.id ? { ...l, status: 'ACTIVE' as const, rejectionReason: undefined } : l))

      await apiClient.loans.update(loan.id, {
        ...loan,
        loanType: loan.loanType.toUpperCase(),
        status: 'ACTIVE'
      })
      await fetchLoans()
    } catch (e) {
      console.error(e)
      alert("Failed to approve loan")
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-screen-2xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            {"Loan Management"}
          </h1>
          <p className="text-slate-500 text-sm md:text-base">Review applications, approve/reject loans, and track portfolios.</p>
        </div>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm h-11 px-6">
          <Plus className="h-4 w-4" />
          Create Loan
        </Button>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
          <div>
            <CardTitle className="text-slate-800">Loan Repository</CardTitle>
            <CardDescription className="text-slate-500">Manage all loan records</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search loans..."
                className="pl-10 bg-white border-slate-200 focus-visible:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              {["ALL", "PERSONAL", "HOME", "CAR"].map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-xs font-semibold transition-all",
                    typeFilter === type ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-100 hover:bg-transparent">
                <TableHead
                  className="text-slate-500 font-semibold cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center">{"Reference ID"} <SortIcon column="id" /></div>
                </TableHead>
                <TableHead className="text-slate-500 font-semibold">User</TableHead>
                <TableHead className="text-slate-500 font-semibold">Type</TableHead>
                <TableHead
                  className="text-slate-500 font-semibold cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => handleSort('principal')}
                >
                  <div className="flex items-center">{"Principal"} <SortIcon column="principal" /></div>
                </TableHead>
                <TableHead className="text-slate-500 font-semibold">Status</TableHead>
                <TableHead className="text-right text-slate-500 font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i} className="border-slate-100">
                    <TableCell colSpan={6} className="p-4">
                      <div className="h-10 bg-slate-100 rounded animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredAndSortedLoans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3 opacity-50">
                      <FileText className="h-12 w-12 text-slate-300" />
                      <p className="text-slate-500 font-medium">No records found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedLoans.map((loan) => (
                  <TableRow key={loan.id} className="border-slate-100 hover:bg-slate-50 transition-colors group">
                    <TableCell className="font-mono text-xs font-medium text-slate-600">
                      {loan.id.toString().substring(0, 8)}...
                      {loan.rejectionReason && (
                        <div className="text-[10px] text-red-500 mt-1 max-w-[150px] truncate" title={loan.rejectionReason}>
                          Note: {loan.rejectionReason}
                        </div>
                      )}
                      {loan.uploadedFileName && (
                        <div className="text-[10px] text-blue-600 mt-1 max-w-[150px] truncate flex items-center gap-1" title={loan.uploadedFileName}>
                          <FileText className="h-3 w-3" /> {loan.uploadedFileName}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-700 font-medium">{loan.userId.toString().substring(0, 8)}...</TableCell>
                    <TableCell className="capitalize text-slate-600">{loan.loanType}</TableCell>
                    <TableCell className="text-slate-900 font-bold">₹{loan.principal.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(loan.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {loan.uploadedFileName && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => handleDownloadFile(loan)}
                            title="Download document"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        {loan.status === 'PENDING' && (
                          <>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" onClick={() => handleApprove(loan)}>
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => openRejectDialog(loan)}>
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {(loan.status === 'REJECTED' || loan.status === 'ACTIVE') && (
                          <Button size="sm" variant="ghost" className="text-xs text-slate-400">View</Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Loan Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this loan application. This will be visible to the user.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Rejection Reason</Label>
              <Textarea
                placeholder="e.g. Low CIBIL score, Insufficient income documentation..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleRejectLoan} disabled={!rejectReason || actionLoading}>
              {actionLoading ? "Rejecting..." : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
