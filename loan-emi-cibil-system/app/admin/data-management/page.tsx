"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"
import { Loader2, DollarSign, TrendingUp, CreditCard, Search, Database } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminDataManagementPage() {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [targetUserId, setTargetUserId] = useState("")
    const [userLoans, setUserLoans] = useState<any[]>([])

    // Form States
    const [loanForm, setLoanForm] = useState({
        loanType: "PERSONAL",
        principal: "",
        interestRate: "",
        tenureMonths: "",
    })

    const [paymentForm, setPaymentForm] = useState({
        loanId: "",
        amount: "",
        dueDate: new Date().toISOString().split("T")[0],
    })

    const [cibilForm, setCibilForm] = useState({
        score: "",
        paymentHistory: "85",
        creditUtilization: "25",
        creditAge: "60",
        creditMix: "70",
        recentInquiries: "5",
    })

    const fetchUserLoans = async () => {
        if (!targetUserId) return
        try {
            const data = await apiClient.loans.getByUserId(targetUserId)
            setUserLoans(data || [])
            toast({ title: "User Found", description: `Loaded ${data.length} loans.` })
        } catch (error) {
            toast({ title: "Error", description: "User ID not found or error loading loans.", variant: "destructive" })
        }
    }

    const handleLoanSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!targetUserId) return
        setLoading(true)
        try {
            await apiClient.loans.apply(targetUserId, {
                ...loanForm,
                principal: Number(loanForm.principal),
                interestRate: Number(loanForm.interestRate),
                tenureMonths: Number(loanForm.tenureMonths),
            })
            toast({ title: "Success", description: "Loan added for user!" })
            setLoanForm({ loanType: "PERSONAL", principal: "", interestRate: "", tenureMonths: "" })
            fetchUserLoans()
        } catch (error) {
            toast({ title: "Error", description: "Failed to add loan.", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!targetUserId) return
        setLoading(true)
        try {
            await apiClient.payments.create(paymentForm.loanId, {
                user: { id: targetUserId },
                amount: Number(paymentForm.amount),
                dueDate: paymentForm.dueDate,
                status: "PENDING"
            })
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
        if (!targetUserId) return
        setLoading(true)
        try {
            await apiClient.cibil.update(targetUserId, {
                user: { id: targetUserId },
                score: Number(cibilForm.score),
                paymentHistory: Number(cibilForm.paymentHistory),
                creditUtilization: Number(cibilForm.creditUtilization),
                creditAge: Number(cibilForm.creditAge),
                creditMix: Number(cibilForm.creditMix),
                recentInquiries: Number(cibilForm.recentInquiries),
            })
            toast({ title: "Success", description: "CIBIL score updated!" })
        } catch (error) {
            toast({ title: "Error", description: "Failed to update CIBIL.", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                            <Database className="h-6 w-6 text-primary" />
                        </div>
                        {"Data Management"}
                    </h1>
                    <p className="text-slate-400 text-sm md:text-base">Administrative override for user financial records.</p>
                </div>
                <Card className="p-1.5 border-white/10 bg-black/40 backdrop-blur-xl flex gap-2 shadow-2xl">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <Input
                            value={targetUserId}
                            onChange={(e) => setTargetUserId(e.target.value)}
                            placeholder="Enter User UUID..."
                            className="w-64 pl-10 bg-white/5 border-white/5 text-white border-white/5"
                        />
                    </div>
                    <Button onClick={fetchUserLoans} variant="secondary" className="gap-2 bg-primary text-white hover:bg-primary/90 bg">
                        Load Data
                    </Button>
                </Card>
            </div>

            {!targetUserId ? (
                <Card className="py-24 text-center border-dashed border-white/10 bg-white backdrop-blur-sm">
                    <Database className="h-12 w-12 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Search for a unique User ID to begin session override.</p>
                </Card>
            ) : (
                <Tabs defaultValue="loan" className="space-y-6">
                    <TabsList className="grid grid-cols-3 w-full max-w-md bg-white/5 border border-white/10">
                        <TabsTrigger value="loan" className="data-[state=active]:bg-primary h-10">Loan</TabsTrigger>
                        <TabsTrigger value="payment" className="data-[state=active]:bg-primary h-10">Payment</TabsTrigger>
                        <TabsTrigger value="cibil" className="data-[state=active]:bg-primary h-10">CIBIL</TabsTrigger>
                    </TabsList>

                    <TabsContent value="loan">
                        <Card className="border-white/5 bg-black/40 backdrop-blur-xl">
                            <CardHeader><CardTitle className="text-white">Create New Loan Application</CardTitle></CardHeader>
                            <CardContent>
                                <form onSubmit={handleLoanSubmit} className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-slate-400">Loan Type</Label>
                                        <Select value={loanForm.loanType} onValueChange={(v) => setLoanForm({ ...loanForm, loanType: v })}>
                                            <SelectTrigger className="bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-white/10 text-white">
                                                <SelectItem value="PERSONAL">Personal</SelectItem>
                                                <SelectItem value="HOME">Home</SelectItem>
                                                <SelectItem value="CAR">Car</SelectItem>
                                                <SelectItem value="EDUCATION">Education</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-400">Principal Amount (₹)</Label>
                                        <Input type="number" value={loanForm.principal} onChange={(e) => setLoanForm({ ...loanForm, principal: e.target.value })} required className="bg-white/5 border-white/10" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-400">Interest Rate (%)</Label>
                                        <Input type="number" value={loanForm.interestRate} onChange={(e) => setLoanForm({ ...loanForm, interestRate: e.target.value })} required className="bg-white/5 border-white/10" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-400">Tenure (Months)</Label>
                                        <Input type="number" value={loanForm.tenureMonths} onChange={(e) => setLoanForm({ ...loanForm, tenureMonths: e.target.value })} required className="bg-white/5 border-white/10" />
                                    </div>
                                    <Button type="submit" className="col-span-2 bg-primary hover:bg-primary/90 mt-4 h-12" disabled={loading}>
                                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Authorize & Insert Loan"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="payment">
                        <Card className="border-white/5 bg-black/40 backdrop-blur-xl">
                            <CardHeader><CardTitle className="text-white">Log External Payment</CardTitle></CardHeader>
                            <CardContent>
                                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-slate-400">Target Loan Account</Label>
                                        <Select value={paymentForm.loanId} onValueChange={(v) => setPaymentForm({ ...paymentForm, loanId: v })}>
                                            <SelectTrigger className="bg-white/5 border-white/10"><SelectValue placeholder="Select active loan..." /></SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-white/10 text-white">
                                                {userLoans.map(loan => (
                                                    <SelectItem key={loan.id} value={loan.id}>{loan.loanType} - ₹{loan.principal}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-slate-400">Payment Amount</Label>
                                            <Input type="number" value={paymentForm.amount} onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })} placeholder="₹" className="bg-white/5 border-white/10" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-400">Due Date Reference</Label>
                                            <Input type="date" value={paymentForm.dueDate} onChange={(e) => setPaymentForm({ ...paymentForm, dueDate: e.target.value })} className="bg-white/5 border-white/10 invert dark:invert-0" />
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-12" disabled={loading || !paymentForm.loanId}>
                                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Record Manual Payment"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="cibil">
                        <Card className="border-white/5 bg-black/40 backdrop-blur-xl">
                            <CardHeader><CardTitle className="text-white">Override CIBIL Reporting</CardTitle></CardHeader>
                            <CardContent>
                                <form onSubmit={handleCibilSubmit} className="space-y-6">
                                    <div className="text-center">
                                        <Label className="text-slate-400 mb-2 block">Total Credit Score</Label>
                                        <Input type="number" value={cibilForm.score} onChange={(e) => setCibilForm({ ...cibilForm, score: e.target.value })} className="text-5xl h-24 text-center font-bold bg-primary/10 border-primary/30 text-primary rounded-2xl" required />
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        {Object.keys(cibilForm).filter(k => k !== 'score').map(k => (
                                            <div key={k} className="space-y-1.5">
                                                <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">{k.replace(/([A-Z])/g, ' $1')}</Label>
                                                <Input type="number" value={(cibilForm as any)[k]} onChange={(e) => setCibilForm({ ...cibilForm, [k]: e.target.value })} className="bg-white/5 border-white/10 h-9" />
                                            </div>
                                        ))}
                                    </div>
                                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-12" disabled={loading}>
                                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Commit Score Override"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            )}
        </div>
    )
}
