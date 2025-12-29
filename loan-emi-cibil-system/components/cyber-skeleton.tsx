"use client"

import { cn } from "@/lib/utils"

interface CyberSkeletonProps {
    className?: string
    variant?: "default" | "card" | "row" | "text"
    style?: React.CSSProperties
}

export function CyberSkeleton({ className, variant = "default", style }: CyberSkeletonProps) {
    return (
        <div
            style={style}
            className={cn(
                "relative overflow-hidden bg-muted/20 border border-border/50",
                {
                    "rounded-2xl h-32": variant === "card",
                    "rounded-lg h-12 w-full": variant === "row",
                    "rounded-md h-4 w-3/4": variant === "text",
                    "rounded-md": variant === "default",
                },
                className
            )}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
    )
}
