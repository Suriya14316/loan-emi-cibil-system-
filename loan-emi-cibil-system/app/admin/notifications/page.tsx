"use client"

import type React from "react"

import { useState } from "react"
import { apiClient } from "@/lib/api-client"
import type { Notification } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Bell, Send, Zap, Loader2 } from "lucide-react"
import { CyberSkeleton } from "@/components/cyber-skeleton"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminNotificationsPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    userId: "",
    type: "PAYMENT_DUE",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await apiClient.notifications.create({
        user: { id: formData.userId },
        type: formData.type,
        message: formData.message,
        read: false,
        createdAt: new Date().toISOString(),
      })
      toast({
        title: "Broadcast Successful",
        description: "Notification has been dispatched to the target user.",
      })
      setIsOpen(false)
      setFormData({
        userId: "",
        type: "PAYMENT_DUE",
        message: "",
      })
    } catch (error) {
      toast({
        title: "Broadcast Failed",
        description: "Could not dispatch notification. Verify User UUID.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            {"Notifications"}
          </h1>
          <p className="text-slate-400 text-sm md:text-base">Broadcast system alerts and personalized messages to users.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 h-11 px-6">
              <Send className="h-4 w-4" />
              Send Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-white/10 text-white shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold tracking-tight">Dispatch Notification</DialogTitle>
              <DialogDescription className="text-slate-400">Target a specific user with a system-wide alert.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label htmlFor="userId" className="text-slate-300">Target User UUID</Label>
                <div className="relative">
                  <Input
                    id="userId"
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    placeholder="Enter unique ID..."
                    className="bg-white/5 border-white/10 pl-4 h-11"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type" className="text-slate-300">Alert Category</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as Notification["type"] })}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10 text-white">
                    <SelectItem value="payment_due">Payment Due Reminder</SelectItem>
                    <SelectItem value="payment_overdue">Overdue Alert</SelectItem>
                    <SelectItem value="loan_approved">Loan Approval Notice</SelectItem>
                    <SelectItem value="cibil_update">CIBIL Score Revision</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-slate-300">Personalized Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Draft your message here..."
                  className="bg-white/5 border-white/10 min-h-[120px]"
                  required
                />
              </div>
              <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 font-bold tracking-wide" disabled={loading}>
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Commence Broadcast"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-white/5 bg-white backdrop-blur-xl shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Latest Communication Logs
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <CyberSkeleton key={i} variant="row" className="h-4" />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="inline-flex p-4 rounded-full bg-white/5 mb-4">
                <Bell className="h-8 w-8 text-slate-700" />
              </div>
              <p className="text-slate-500 max-w-sm mx-auto">
                Operational logs will appear here as you dispatch system-wide or targeted notifications.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
