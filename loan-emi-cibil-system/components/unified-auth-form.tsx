"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Lock, User, Phone, ShieldCheck, CheckCircle2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { cn } from "@/lib/utils"

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z.enum(["USER", "ADMIN"]).default("USER"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

type RegisterValues = z.infer<typeof registerSchema>

export function UnifiedAuthForm() {
    const [activeTab, setActiveTab] = useState<"login" | "register">("login")
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")
    const [error, setError] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { login, register } = useAuth()
    const router = useRouter()

    const registerForm = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
            role: "USER",
        },
    })

    const onLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccessMessage("")
        setIsLoading(true)

        try {
            const user = await login(loginEmail, loginPassword)
            if (user) {
                router.push(user.role === "ADMIN" ? "/admin" : "/dashboard")
            } else {
                setError("Invalid email or password")
            }
        } catch (err) {
            setError("An unexpected error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    const onRegisterSubmit = async (data: RegisterValues) => {
        setError("")
        setSuccessMessage("")
        setIsLoading(true)

        try {
            const success = await register(data.name, data.email, data.password, data.phone, data.role)
            if (success) {
                setSuccessMessage("Account created successfully! Please login.")
                setActiveTab("login")
                registerForm.reset()
            } else {
                setError("Registration failed. Email might be already in use.")
            }
        } catch (err) {
            setError("An unexpected error occurred.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md border-border bg-card/70 backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />

            <CardHeader className="space-y-1 pb-6 pt-8">
                <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 shadow-sm transition-transform group-hover:scale-110 duration-500">
                        <ShieldCheck className="h-8 w-8 text-primary" />
                    </div>
                </div>
                <CardTitle className="text-3xl font-extrabold text-center tracking-tight text-foreground">
                    {activeTab === "login" ? "Sign In" : "Register"}
                </CardTitle>
                <CardDescription className="text-center text-muted-foreground text-sm font-medium">
                    {activeTab === "login"
                        ? "Access your professional dashboard"
                        : "Join as a User or Administrator"}
                </CardDescription>
            </CardHeader>

            <CardContent className="pb-8">
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50 p-1 rounded-xl">
                        <TabsTrigger value="login" className="rounded-lg py-2 text-xs font-bold uppercase tracking-widest transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">Login</TabsTrigger>
                        <TabsTrigger value="register" className="rounded-lg py-2 text-xs font-bold uppercase tracking-widest transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">Register</TabsTrigger>
                    </TabsList>

                    {successMessage && (
                        <Alert className="mb-6 bg-green-500/10 border-green-500/20 text-green-600 border animate-fade-in">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-xs font-bold">{successMessage}</AlertDescription>
                        </Alert>
                    )}

                    <TabsContent value="login">
                        <form onSubmit={onLoginSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="login-email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                                    <Input
                                        id="login-email"
                                        type="email"
                                        placeholder="name@company.com"
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        required
                                        className="pl-10 h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="login-password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Secret Key</Label>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                                    <Input
                                        id="login-password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        required
                                        className="pl-10 h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all"
                                    />
                                </div>
                            </div>

                            {error && activeTab === "login" && (
                                <Alert variant="destructive" className="py-2.5 bg-red-500/10 border-red-500/20 text-red-600 animate-shake">
                                    <AlertDescription className="text-xs font-bold uppercase tracking-tight">{error}</AlertDescription>
                                </Alert>
                            )}

                            <Button type="submit" className="w-full h-12 rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all" disabled={isLoading}>
                                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Authorize Uplink"}
                            </Button>
                        </form>
                    </TabsContent>

                    <TabsContent value="register">
                        <Form {...registerForm}>
                            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                                <FormField
                                    control={registerForm.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Full Identity</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                                                    <Input placeholder="Johnathan Doe" {...field} className="pl-10 h-11 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all" />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-[10px] font-bold" />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={registerForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1">
                                                <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Email</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="john@example.com" {...field} className="h-11 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all" />
                                                </FormControl>
                                                <FormMessage className="text-[10px] font-bold" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={registerForm.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1">
                                                <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Phone</FormLabel>
                                                <FormControl>
                                                    <Input type="tel" placeholder="+91..." {...field} className="h-11 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all" />
                                                </FormControl>
                                                <FormMessage className="text-[10px] font-bold" />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={registerForm.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1">
                                                <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Passkey</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="••••••••" {...field} className="h-11 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all" />
                                                </FormControl>
                                                <FormMessage className="text-[10px] font-bold" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={registerForm.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1">
                                                <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Verify</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="••••••••" {...field} className="h-11 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all" />
                                                </FormControl>
                                                <FormMessage className="text-[10px] font-bold" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={registerForm.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Account Role</FormLabel>
                                            <FormControl>
                                                <div className="flex gap-4 p-2 bg-muted/30 rounded-xl border border-border/50">
                                                    <label className={cn(
                                                        "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg cursor-pointer transition-all",
                                                        field.value === "USER" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                                                    )}>
                                                        <input type="radio" value="USER" checked={field.value === "USER"} onChange={() => field.onChange("USER")} className="sr-only" />
                                                        <User className="h-4 w-4" />
                                                        <span className="text-xs font-bold uppercase tracking-widest">User</span>
                                                    </label>
                                                    <label className={cn(
                                                        "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg cursor-pointer transition-all",
                                                        field.value === "ADMIN" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                                                    )}>
                                                        <input type="radio" value="ADMIN" checked={field.value === "ADMIN"} onChange={() => field.onChange("ADMIN")} className="sr-only" />
                                                        <ShieldCheck className="h-4 w-4" />
                                                        <span className="text-xs font-bold uppercase tracking-widest">Admin</span>
                                                    </label>
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {error && activeTab === "register" && (
                                    <Alert variant="destructive" className="py-2.5 bg-red-500/10 border-red-500/20 text-red-600 animate-shake mt-2">
                                        <AlertDescription className="text-xs font-bold uppercase tracking-tight">{error}</AlertDescription>
                                    </Alert>
                                )}

                                <Button type="submit" className="w-full h-12 rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all mt-4" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Deploy Identity"}
                                </Button>
                            </form>
                        </Form>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
