"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Shield, Lock, Mail, User, Phone } from "lucide-react"

export default function AdminAuthPage() {
    const { login, register } = useAuth()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    // Login Form State
    const [loginForm, setLoginForm] = useState({
        email: "",
        password: "",
    })

    // Register Form State
    const [regForm, setRegForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    })

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const user = await login(loginForm.email, loginForm.password)
            if (user && user.role === "ADMIN") {
                router.push("/admin")
            } else if (user) {
                setError("Access denied. This portal is for administrators only.")
            } else {
                setError("Invalid credentials.")
            }
        } catch (err) {
            setError("An unexpected error occurred.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        if (regForm.password !== regForm.confirmPassword) {
            setError("Passwords do not match.")
            return
        }

        setIsLoading(true)
        setError("")

        try {
            const success = await register(regForm.name, regForm.email, regForm.password, regForm.phone, "ADMIN")
            if (success) {
                // Switch to login tab or auto-login? Manual redir to login is safer for demo.
                setError("Admin registration successful! Please log in.")
                // Optionally switch tabs here
            } else {
                setError("Registration failed. Email might be in use.")
            }
        } catch (err) {
            setError("An unexpected error occurred.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[128px]" />
            </div>

            <Card className="w-full max-w-md border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl relative">
                <CardHeader className="text-center space-y-2 pb-8">
                    <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-chart-4 flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
                        <Shield className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tight text-white">Admin Portal</CardTitle>
                    <CardDescription className="text-slate-400">Secure access for loan administrators</CardDescription>
                </CardHeader>

                <CardContent>
                    {error && (
                        <Alert variant={error.includes("successful") ? "default" : "destructive"} className="mb-6 bg-red-500/10 border-red-500/50 text-red-200">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <Tabs defaultValue="login" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10">
                            <TabsTrigger value="login" className="data-[state=active]:bg-primary h-10">Login</TabsTrigger>
                            <TabsTrigger value="register" className="data-[state=active]:bg-primary h-10">Register</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login">
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-white">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                        <Input
                                            type="email"
                                            placeholder="admin@example.com"
                                            className="pl-10 bg-white/5 border-white/10 text-white"
                                            value={loginForm.email}
                                            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-white">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                        <Input
                                            type="password"
                                            className="pl-10 bg-white/5 border-white/10 text-white"
                                            value={loginForm.password}
                                            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <Button className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold transition-all" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : "Access Dashboard"}
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="register">
                            <form onSubmit={handleRegister} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2 text-white">
                                        <Label>Full Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                            <Input
                                                placeholder="Admin Name"
                                                className="pl-10 bg-white/5 border-white/10"
                                                value={regForm.name}
                                                onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-white">
                                        <Label>Phone</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                            <Input
                                                placeholder="+1234..."
                                                className="pl-10 bg-white/5 border-white/10"
                                                value={regForm.phone}
                                                onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2 text-white">
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        placeholder="admin@loan.com"
                                        className="bg-white/5 border-white/10"
                                        value={regForm.email}
                                        onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2 text-white">
                                    <Label>Password</Label>
                                    <Input
                                        type="password"
                                        className="bg-white/5 border-white/10"
                                        value={regForm.password}
                                        onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2 text-white">
                                    <Label>Confirm Password</Label>
                                    <Input
                                        type="password"
                                        className="bg-white/5 border-white/10"
                                        value={regForm.confirmPassword}
                                        onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                                        required
                                    />
                                </div>
                                <Button className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : "Create Admin Account"}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
