"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { apiClient } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, DollarSign, Calendar, Briefcase, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ApplyLoanPage() {
    const { user } = useAuth()
    const { toast } = useToast()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        principal: "",
        tenureMonths: "",
        loanType: "PERSONAL",
        purpose: ""
    })

    const calculateEMI = (principal: number, rate: number, months: number) => {
        const r = rate / (12 * 100)
        return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setLoading(true)
        try {
            const principal = Number(formData.principal)
            const tenure = Number(formData.tenureMonths)
            // Hardcoded interest rates for demo
            const rates: Record<string, number> = {
                PERSONAL: 12, HOME: 8.5, CAR: 9.5, EDUCATION: 7, BUSINESS: 14
            }
            const rate = rates[formData.loanType] || 10
            const emi = calculateEMI(principal, rate, tenure)

            // Create FormData for the API call
            const applicationData = new FormData()
            applicationData.append("userId", user.id)
            applicationData.append("loanType", formData.loanType)
            applicationData.append("principal", principal.toString())
            applicationData.append("interestRate", rate.toString())
            applicationData.append("tenureMonths", tenure.toString())

            await apiClient.loans.apply(applicationData)

            toast({
                title: "Application Submitted",
                description: "Your loan application has been sent for review.",
            })
            router.push("/dashboard/loans")
        } catch (error) {
            toast({
                title: "Application Failed",
                description: "Could not submit loan application. Please try again.",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-xl mx-auto space-y-6 animate-fade-in pb-12">
            <Link href="/dashboard/loans" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ChevronLeft className="h-4 w-4 mr-1" /> Back to Portfolio
            </Link>

            <div className="space-y-1">
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                    Quick Apply
                </h1>
                <p className="text-muted-foreground">Submit a new loan request in seconds.</p>
            </div>

            <Card className="border-border bg-white shadow-2xl">
                <CardHeader>
                    <CardTitle className="text-foreground">Loan Details</CardTitle>
                    <CardDescription className="text-muted-foreground">Enter the amount and tenure you need.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-foreground">Loan Type</Label>
                            <Select value={formData.loanType} onValueChange={(v) => setFormData({ ...formData, loanType: v })}>
                                <SelectTrigger className="bg-white border-border text-foreground h-11">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-border text-foreground">
                                    <SelectItem value="PERSONAL">Personal Loan</SelectItem>
                                    <SelectItem value="HOME">Home Loan</SelectItem>
                                    <SelectItem value="CAR">Auto Loan</SelectItem>
                                    <SelectItem value="EDUCATION">Education Loan</SelectItem>
                                    <SelectItem value="BUSINESS">Business Loan</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-foreground">Amount (₹)</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="number"
                                        placeholder="50000"
                                        className="pl-9 bg-white border-border text-foreground h-11"
                                        required
                                        min="1000"
                                        value={formData.principal}
                                        onChange={(e) => setFormData({ ...formData, principal: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-foreground">Tenure (Months)</Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="number"
                                        placeholder="12"
                                        className="pl-9 bg-white border-border text-foreground h-11"
                                        required
                                        min="3"
                                        max="360"
                                        value={formData.tenureMonths}
                                        onChange={(e) => setFormData({ ...formData, tenureMonths: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-primary uppercase tracking-wider">Estimated EMI</span>
                                <span className="text-xl font-bold text-foreground">
                                    ₹{formData.principal && formData.tenureMonths
                                        ? calculateEMI(Number(formData.principal), 10, Number(formData.tenureMonths)).toFixed(0)
                                        : "0"}
                                    <span className="text-xs text-muted-foreground font-normal ml-1">/mo</span>
                                </span>
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 font-bold text-white shadow-lg" disabled={loading}>
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Submit Application"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
