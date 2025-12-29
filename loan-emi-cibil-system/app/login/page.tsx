"use client"

import { useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/login-form"
import { TrendingUp, Shield, Zap, Cpu, Lock, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

export default function LoginPage() {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && user) {
            if (user.role === "ADMIN") {
                router.push("/admin")
            } else {
                router.push("/dashboard")
            }
        }
    }, [user, isLoading, router])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <div className="h-16 w-16 rounded-full border-t-2 border-primary animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Cpu className="h-6 w-6 text-primary animate-pulse" />
                        </div>
                    </div>
                    <div className="space-y-1 text-center">
                        <p className="text-white font-black uppercase tracking-[0.3em] text-xs">{"Decrypting Profile"}</p>
                        <p className="text-slate-500 text-[10px] uppercase font-bold">{"Establishing Secure Uplink..."}</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            {/* Cyberpunk Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150" />
            </div>

            <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10 animate-fade-in">
                <div className="space-y-10 text-center lg:text-left order-2 lg:order-1">
                    <div className="space-y-4 animate-slide-up">
                        <div className="flex items-center gap-2 justify-center lg:justify-start mb-6">
                            <div className="h-1 w-12 bg-primary" />
                            <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">{"Financial OS v2.0"}</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-none tracking-tighter">
                            {"SECURE YOUR"}
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-accent drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                                {"LEGACY."}
                            </span>
                        </h1>
                        <p className="text-lg text-slate-400 font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
                            {
                                "Deploy advanced capital management protocols. Track assets, optimize credit metrics, and intercept financial opportunities in real-time."
                            }
                        </p>
                    </div>

                    <div className="grid gap-4 max-w-lg mx-auto lg:mx-0">
                        <div
                            className="group flex items-center gap-5 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/30 transition-all duration-500 hover:bg-white/[0.04] animate-slide-up"
                            style={{ animationDelay: "0.1s" }}
                        >
                            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 shrink-0 group-hover:bg-primary/20 transition-all">
                                <TrendingUp className="h-5 w-5 text-primary" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-black text-white text-base tracking-tight">{"CREDIT TELEMETRY"}</h3>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                    {"Real-time CIBIL interception and optimization protocols."}
                                </p>
                            </div>
                        </div>

                        <div
                            className="group flex items-center gap-5 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-accent/30 transition-all duration-500 hover:bg-white/[0.04] animate-slide-up"
                            style={{ animationDelay: "0.2s" }}
                        >
                            <div className="p-3 rounded-xl bg-accent/10 border border-accent/20 shrink-0 group-hover:bg-accent/20 transition-all">
                                <Lock className="h-5 w-5 text-accent" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-black text-white text-base tracking-tight">{"BANK-GRADE ENCRYPTION"}</h3>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                    {"Data persistence via secure SQL-hardened channels."}
                                </p>
                            </div>
                        </div>

                        <div
                            className="group flex items-center gap-5 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-blue-400/30 transition-all duration-500 hover:bg-white/[0.04] animate-slide-up"
                            style={{ animationDelay: "0.3s" }}
                        >
                            <div className="p-3 rounded-xl bg-blue-400/10 border border-blue-400/20 shrink-0 group-hover:bg-blue-400/20 transition-all">
                                <Zap className="h-5 w-5 text-blue-400" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-black text-white text-base tracking-tight">{"SMART ALERTS"}</h3>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                    {"Automated notification matrix for critical scheduled events."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center lg:justify-end animate-scale-in order-1 lg:order-2 relative">
                    <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full opacity-20 animate-pulse" />
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}
