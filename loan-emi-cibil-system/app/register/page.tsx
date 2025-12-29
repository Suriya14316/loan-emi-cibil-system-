import { RegisterForm } from "@/components/register-form"

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            {/* Cyberpunk Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150" />
            </div>

            <div className="w-full flex justify-center relative z-10 animate-fade-in">
                <div className="relative">
                    <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full opacity-20 animate-pulse" />
                    <RegisterForm />
                </div>
            </div>
        </div>
    )
}
