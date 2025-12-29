"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2, User, Mail, Phone, Lock, ShieldPlus, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

type RegisterValues = z.infer<typeof registerSchema>

export function RegisterForm() {
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { register: registerUser } = useAuth()
    const router = useRouter()

    const form = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
        },
    })

    const onSubmit = async (data: RegisterValues) => {
        setError("")
        setIsLoading(true)

        try {
            const success = await registerUser(data.name, data.email, data.password, data.phone)
            if (success) {
                router.push("/login")
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
        <Card className="w-full max-w-md border-white/10 bg-black/60 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

            <CardHeader className="space-y-2 relative z-10 pt-8">
                <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                        <ShieldPlus className="h-8 w-8 text-primary" />
                    </div>
                </div>
                <CardTitle className="text-3xl font-black text-center text-white tracking-tighter">{"NEW IDENTITY"}</CardTitle>
                <CardDescription className="text-center text-slate-500 font-mono text-[10px] uppercase tracking-[0.2em]">
                    {"[ Protocol: Credential Initialization ]"}
                </CardDescription>
            </CardHeader>

            <CardContent className="relative z-10 pb-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Identity</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                            <Input placeholder="John Doe" {...field} className="bg-white/[0.03] border-white/10 h-11 pl-10 text-white font-medium rounded-xl focus:border-primary/50 transition-all placeholder:text-slate-700" />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-[10px] text-red-400 font-bold" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Comm Channel (Email)</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                            <Input type="email" placeholder="john@nexus.com" {...field} className="bg-white/[0.03] border-white/10 h-11 pl-10 text-white font-medium rounded-xl focus:border-primary/50 transition-all placeholder:text-slate-700" />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-[10px] text-red-400 font-bold" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Terminal Link (Phone)</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                            <Input type="tel" placeholder="+91 XXXXX XXXXX" {...field} className="bg-white/[0.03] border-white/10 h-11 pl-10 text-white font-medium rounded-xl focus:border-primary/50 transition-all placeholder:text-slate-700" />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-[10px] text-red-400 font-bold" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Initialize Passkey</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                            <Input type="password" placeholder="••••••••" {...field} className="bg-white/[0.03] border-white/10 h-11 pl-10 text-white font-medium rounded-xl focus:border-primary/50 transition-all placeholder:text-slate-700" />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-[10px] text-red-400 font-bold" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Verify Passkey</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                            <Input type="password" placeholder="••••••••" {...field} className="bg-white/[0.03] border-white/10 h-11 pl-10 text-white font-medium rounded-xl focus:border-primary/50 transition-all placeholder:text-slate-700" />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-[10px] text-red-400 font-bold" />
                                </FormItem>
                            )}
                        />

                        {error && (
                            <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-400 animate-shake mt-2">
                                <AlertDescription className="font-bold text-xs uppercase tracking-tight">{error}</AlertDescription>
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-primary/20 group transition-all active:scale-[0.98] mt-6"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    {"Initialize Profile"} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </Button>

                        <div className="text-center mt-6">
                            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">
                                {"Already Decrypted? "}
                                <Link href="/login" className="text-primary hover:text-primary/80 transition-colors ml-1 underline decoration-primary/30 underline-offset-4">
                                    {"Uplink Here"}
                                </Link>
                            </p>
                        </div>
                    </form>
                </Form>
            </CardContent>
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
        </Card>
    )
}
