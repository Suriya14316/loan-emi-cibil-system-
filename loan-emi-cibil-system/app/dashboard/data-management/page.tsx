"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { apiClient } from "@/lib/api-client"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Plus, DollarSign, TrendingUp, CreditCard, Database, Zap, ArrowRight, ShieldCheck } from "lucide-react"

export default function DataManagementPage() {
    const { user } = useAuth()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [userLoans, setUserLoans] = useState<any[]>([])

    // Form States
    const [loanForm, setLoanForm] = useState({
        loanType: "PERSONAL",
        principal: "",
        interestRate: "",
        tenureMonths: "",
    })
    const [loanFile, setLoanFile] = useState<File | null>(null)

    const [paymentForm, setPaymentForm] = useState({
        loanId: "",
        amount: "",
        dueDate: new Date().toISOString().split("T")[0],
    })

    const [cibilForm, setCibilForm] = useState({
        score: "",
        paymentHistory: "80",
        creditUtilization: "30",
        creditAge: "50",
        creditMix: "60",
        recentInquiries: "10",
    })

    useEffect(() => {
        if (user) {
            fetchUserLoans()
        }
    }, [user])

    const fetchUserLoans = async () => {
        try {
            const data = await apiClient.loans.getByUserId(user!.id)
            setUserLoans(data || [])
        } catch (error) {
            console.error("Failed to fetch loans", error)
        }
    }

    const handleLoanSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        // Validate file if provided
        if (loanFile) {
            const maxSize = 40 * 1024 // 40KB
            if (loanFile.size > maxSize) {
                toast({ title: "Error", description: "File size exceeds 40KB limit.", variant: "destructive" })
                return
            }
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            ]
            if (!allowedTypes.includes(loanFile.type)) {
                toast({ title: "Error", description: "Invalid file type. Please upload PDF, DOC, DOCX, XLS, or XLSX files.", variant: "destructive" })
                return
            }
        }

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('loanType', loanForm.loanType)
            formData.append('principal', loanForm.principal)
            formData.append('interestRate', loanForm.interestRate)
            formData.append('tenureMonths', loanForm.tenureMonths)
            if (loanFile) {
                formData.append('file', loanFile)
            }

            const response = await fetch(`http://localhost:8081/api/loans/apply?userId=${user.id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            })

            if (!response.ok) throw new Error('Failed to apply for loan')

            toast({ title: "Success", description: "Loan application submitted successfully!" })
            setLoanForm({ loanType: "PERSONAL", principal: "", interestRate: "", tenureMonths: "" })
            setLoanFile(null)
            fetchUserLoans()
        } catch (error) {
            toast({ title: "Error", description: "Failed to submit loan application.", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return
        setLoading(true)
        try {
            const response = await fetch(`http://localhost:8081/api/payments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    loan: { id: paymentForm.loanId },
                    user: { id: user.id },
                    amount: Number(paymentForm.amount),
                    dueDate: paymentForm.dueDate,
                    status: "PENDING"
                })
            })
            if (!response.ok) throw new Error()
            toast({ title: "Success", description: "Payment record added!" })
            setPaymentForm({ loanId: "", amount: "", dueDate: new Date().toISOString().split("T")[0] })
        } catch (error) {
            toast({ title: "Error", description: "Failed to add payment.", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    const handleCibilSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return
        setLoading(true)
        try {
            const response = await fetch(`http://localhost:8081/api/cibil/user/${user.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    user: { id: user.id },
                    score: Number(cibilForm.score),
                    lastUpdated: new Date().toISOString(),
                    paymentHistory: Number(cibilForm.paymentHistory),
                    creditUtilization: Number(cibilForm.creditUtilization),
                    creditAge: Number(cibilForm.creditAge),
                    creditMix: Number(cibilForm.creditMix),
                    recentInquiries: Number(cibilForm.recentInquiries),
                })
            })
            if (!response.ok) throw new Error()
            toast({ title: "Success", description: "CIBIL score updated!" })
        } catch (error) {
            toast({ title: "Error", description: "Failed to update CIBIL score.", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
            <div className="space-y-1">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                        <Database className="h-6 w-6 text-primary" />
                    </div>
                    {"System Overwrite"}
                </h1>
                <p className="text-slate-400 text-sm md:text-base font-medium">
                    {"Inject financial datasets directly into the core SQL persistence layer."}
                </p>
            </div>

            <Tabs defaultValue="loan" className="space-y-8">
                <TabsList className="bg-black/40 border border-white/5 p-1 rounded-xl h-auto w-full max-w-2xl overflow-x-auto justify-start">
                    <TabsTrigger value="loan" className="gap-2 px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg transition-all font-bold uppercase tracking-widest text-[10px] shrink-0">
                        <DollarSign className="h-3 w-3" /> Loan Entry
                    </TabsTrigger>
                    <TabsTrigger value="payment" className="gap-2 px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg transition-all font-bold uppercase tracking-widest text-[10px] shrink-0">
                        <CreditCard className="h-3 w-3" /> Payment Log
                    </TabsTrigger>
                    <TabsTrigger value="cibil" className="gap-2 px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg transition-all font-bold uppercase tracking-widest text-[10px] shrink-0">
                        <TrendingUp className="h-3 w-3" /> Credit Mod
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="loan">
                    <Card className="border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl animate-slide-up border overflow-hidden">
                        <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                        <CardHeader className="pb-8 pt-6">
                            <CardTitle className="text-2xl font-black text-white flex items-center gap-2">
                                <Plus className="h-5 w-5 text-primary" />
                                {"Initialize Loan Vector"}
                            </CardTitle>
                            <CardDescription className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">
                                {"[ Protocol: Manual Principal Assignment ]"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-8">
                            <form onSubmit={handleLoanSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Loan Classifier</Label>
                                    <Select value={loanForm.loanType} onValueChange={(v) => setLoanForm({ ...loanForm, loanType: v })}>
                                        <SelectTrigger className="bg-white/[0.02] border-white/10 h-12 text-white font-bold rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-white/10 text-white">
                                            <SelectItem value="PERSONAL">Personal</SelectItem>
                                            <SelectItem value="HOME">Home</SelectItem>
                                            <SelectItem value="CAR">Car</SelectItem>
                                            <SelectItem value="EDUCATION">Education</SelectItem>
                                            <SelectItem value="BUSINESS">Business</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Principal Volume (₹)</Label>
                                    <Input type="number" value={loanForm.principal} onChange={(e) => setLoanForm({ ...loanForm, principal: e.target.value })} placeholder="500000" className="bg-white/[0.02] border-white/10 h-12 text-white font-mono font-bold rounded-xl placeholder:text-slate-700" required />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Interest Variance (%)</Label>
                                    <Input type="number" step="0.1" value={loanForm.interestRate} onChange={(e) => setLoanForm({ ...loanForm, interestRate: e.target.value })} placeholder="10.5" className="bg-white/[0.02] border-white/10 h-12 text-white font-mono font-bold rounded-xl placeholder:text-slate-700" required />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Tenure Cycle (Months)</Label>
                                    <Input type="number" value={loanForm.tenureMonths} onChange={(e) => setLoanForm({ ...loanForm, tenureMonths: e.target.value })} placeholder="36" className="bg-white/[0.02] border-white/10 h-12 text-white font-mono font-bold rounded-xl placeholder:text-slate-700" required />
                                </div>
                                <div className="md:col-span-2 space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Supporting Document (Optional)</Label>
                                    <div className="relative">
                                        <Input
                                            type="file"
                                            onChange={(e) => setLoanFile(e.target.files?.[0] || null)}
                                            accept=".pdf,.doc,.docx,.xls,.xlsx"
                                            className="bg-white/[0.02] border-white/10 h-12 text-white font-mono rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-primary file:text-white hover:file:bg-primary/90 file:cursor-pointer cursor-pointer"
                                        />
                                        {loanFile && (
                                            <p className="text-xs text-slate-400 mt-2 font-mono">Selected: {loanFile.name} ({(loanFile.size / 1024).toFixed(2)} KB)</p>
                                        )}
                                        <p className="text-[10px] text-slate-600 mt-1">Max 40KB • PDF, DOC, DOCX, XLS, XLSX</p>
                                    </div>
                                </div>
                                <Button type="submit" className="md:col-span-2 w-full h-14 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98]" disabled={loading}>
                                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                                        <span className="flex items-center gap-2">
                                            {"Commit to Persistence"} <ArrowRight className="h-5 w-5" />
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="payment">
                    <Card className="border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl animate-slide-up border overflow-hidden">
                        <div className="h-1 w-full bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />
                        <CardHeader className="pb-8 pt-6">
                            <CardTitle className="text-2xl font-black text-white flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-accent" />
                                {"Log Transaction Event"}
                            </CardTitle>
                            <CardDescription className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">
                                {"[ Protocol: Payment Stream Injection ]"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-8">
                            <form onSubmit={handlePaymentSubmit} className="space-y-8">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Target Loan Identifier</Label>
                                    <Select value={paymentForm.loanId} onValueChange={(v) => setPaymentForm({ ...paymentForm, loanId: v })}>
                                        <SelectTrigger className="bg-white/[0.02] border-white/10 h-12 text-white font-bold rounded-xl">
                                            <SelectValue placeholder="Identify source stream" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-white/10 text-white">
                                            {userLoans.map(loan => (
                                                <SelectItem key={loan.id} value={loan.id}>{loan.loanType} - ₹{loan.principal}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Credit Volume (₹)</Label>
                                        <Input type="number" value={paymentForm.amount} onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })} placeholder="15000" className="bg-white/[0.02] border-white/10 h-12 text-white font-mono font-bold rounded-xl placeholder:text-slate-700" required />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Timestamp Due</Label>
                                        <Input type="date" value={paymentForm.dueDate} onChange={(e) => setPaymentForm({ ...paymentForm, dueDate: e.target.value })} className="bg-white/[0.02] border-white/10 h-12 text-white font-mono font-bold rounded-xl" required />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full h-14 bg-accent hover:bg-accent/90 text-white font-black uppercase tracking-widest rounded-xl shadow-xl shadow-accent/20 transition-all active:scale-[0.98]" disabled={loading || !paymentForm.loanId}>
                                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                                        <span className="flex items-center gap-2">
                                            {"Inject Credit Pulse"} <Zap className="h-5 w-5" />
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="cibil">
                    <Card className="border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl animate-slide-up border overflow-hidden">
                        <div className="h-1 w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
                        <CardHeader className="pb-8 pt-6">
                            <CardTitle className="text-2xl font-black text-white flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-purple-400" />
                                {"Credit Reputation Mod"}
                            </CardTitle>
                            <CardDescription className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">
                                {"[ Protocol: Reputation Parameter Override ]"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-8">
                            <form onSubmit={handleCibilSubmit} className="space-y-8">
                                <div className="space-y-4 text-center pb-6 border-b border-white/5">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Reputation Coefficient (300-900)</Label>
                                    <div className="relative max-w-xs mx-auto">
                                        <Input type="number" value={cibilForm.score} onChange={(e) => setCibilForm({ ...cibilForm, score: e.target.value })} className="text-5xl h-24 text-center font-black bg-white/[0.02] border-white/10 text-primary rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.1)]" placeholder="750" required />
                                        <div className="absolute inset-x-0 -bottom-2 h-1 bg-primary/20 blur-sm rounded-full" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {Object.keys(cibilForm).filter(k => k !== 'score').map(key => (
                                        <div key={key} className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{key.replace(/([A-Z])/g, ' $1').trim()} variance (%)</Label>
                                            <Input type="number" value={(cibilForm as any)[key]} onChange={(e) => setCibilForm({ ...cibilForm, [key]: e.target.value })} max="100" className="bg-white/[0.02] border-white/10 h-10 text-white font-mono font-bold rounded-lg placeholder:text-slate-700" />
                                        </div>
                                    ))}
                                </div>
                                <Button type="submit" className="w-full h-14 bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-widest rounded-xl shadow-xl shadow-purple-500/20 transition-all active:scale-[0.98]" disabled={loading}>
                                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                                        <span className="flex items-center gap-2">
                                            {"Authorize Matrix Sync"} <ShieldCheck className="h-5 w-5" />
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
