"use client"

import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"
import { apiClient, transformers } from "@/lib/api-client"
import { cn } from "@/lib/utils"
import type { Notification } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, AlertCircle, DollarSign, TrendingUp, Zap, Radio } from "lucide-react"

export default function NotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        try {
          const data = await apiClient.notifications.getByUserId(user.id)
          setNotifications(data.map(transformers.notification))
        } catch (error) {
          console.error("Failed to fetch notifications:", error)
        }
      }
    }
    fetchNotifications()
  }, [user])

  const getNotificationIcon = (type: Notification["type"]) => {
    const baseClasses = "h-5 w-5"
    switch (type) {
      case "payment_due":
        return <Bell className={cn(baseClasses, "text-blue-400")} />
      case "payment_overdue":
        return <AlertCircle className={cn(baseClasses, "text-red-400")} />
      case "loan_approved":
        return <CheckCircle className={cn(baseClasses, "text-green-400")} />
      case "cibil_update":
        return <TrendingUp className={cn(baseClasses, "text-purple-400")} />
      default:
        return <DollarSign className={cn(baseClasses, "text-slate-400")} />
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      <div className="space-y-1">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
            <Radio className="h-6 w-6 text-primary animate-pulse" />
          </div>
          {"LOAN APPLICATION"}
        </h1>
        <p className="text-slate-400 text-sm md:text-base">
          {"Real-time monitoring of system alerts and status updates."}
        </p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <Card
              key={notification.id}
              className={cn(
                "border-white/5 bg-white backdrop-blur-xl transition-all duration-300 shadow-2xl animate-slide-up group border",
                notification.read ? "opacity-60 grayscale-[0.5]" : "border-primary/20 bg-primary/[0.02]"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-4 sm:gap-6">
                  <div className={cn(
                    "p-3 rounded-xl shrink-0 transition-all duration-300",
                    notification.read ? "bg-white/5" : "bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                  )}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <p className={cn(
                          "text-base sm:text-lg leading-snug",
                          notification.read ? "text-slate-400 font-medium" : "text-white font-black"
                        )}>{notification.message}</p>
                        <p className="text-[10px] sm:text-xs text-slate-500 mt-2 font-mono uppercase tracking-widest">
                          {new Date(notification.createdAt).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {!notification.read && (
                        <Badge className="bg-primary text-white border-0 self-start rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-tighter shadow-lg shadow-primary/20">
                          {"Intercepted"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-white/5 bg-white backdrop-blur-xl animate-scale-in border shadow-2xl">
            <CardContent className="py-24">
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-white/[0.02] border border-white/5 mx-auto mb-6 flex items-center justify-center">
                  <Zap className="h-10 w-10 text-slate-700" />
                </div>
                <p className="text-lg font-black text-slate-400">{"COMMUNICATION SILENCE"}</p>
                <p className="text-sm text-slate-500 mt-2">{"The broadcast frequency is currently clear."}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
