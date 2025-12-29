"use client"

import { cn } from "@/lib/utils"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { apiClient } from "@/lib/api-client"
import { Users, DollarSign, CreditCard, TrendingUp, Bell, Shield, Zap, FileText, Activity, AlertCircle, CheckCircle, Clock, Download } from "lucide-react"
import { CyberSkeleton } from "@/components/cyber-skeleton"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend
} from "recharts"

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeLoans: 0,
    pendingLoans: 0,
    rejectedLoans: 0,
    pendingPayments: 0,
    totalDisbursed: 0,
    totalLoans: 0,
    totalPayments: 0,
  })
  const [loanDistribution, setLoanDistribution] = useState<any[]>([])
  const [monthlyTrends, setMonthlyTrends] = useState<any[]>([])
  const [logs, setLogs] = useState<any[]>([])
  const [selectedMonth, setSelectedMonth] = useState<string>("all")
  const [downloading, setDownloading] = useState(false)


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [statsData, distributionData, trendsData, logsData, allLoans] = await Promise.all([
          apiClient.admin.getStats(),
          apiClient.admin.getDistribution(),
          apiClient.admin.getTrends(),
          apiClient.admin.getLogs(),
          apiClient.loans.getAll() // Fetch actual loans for accurate counting
        ])

        // Calculate real-time stats from loans
        const loans = allLoans || []
        const activeCount = loans.filter((l: any) => l.status === 'ACTIVE').length
        const pendingCount = loans.filter((l: any) => l.status === 'PENDING').length
        const rejectedCount = loans.filter((l: any) => l.status === 'REJECTED').length
        const totalCount = loans.length

        setStats({
          totalUsers: statsData.totalUsers || 0,
          activeLoans: activeCount,
          pendingLoans: pendingCount,
          rejectedLoans: rejectedCount,
          pendingPayments: statsData.pendingPayments || 0,
          totalDisbursed: statsData.totalDisbursed || 0,
          totalLoans: totalCount,
          totalPayments: statsData.totalPayments || 0,
        })

        setLoanDistribution(distributionData || [])
        setMonthlyTrends(trendsData || [])

        // Transform backend logs
        const transformedLogs = (logsData || []).map((log: any) => {
          const createdAt = new Date(log.time)
          const now = new Date()
          const diffInMinutes = Math.floor((now.getTime() - createdAt.getTime()) / 60000)

          let timeLabel = "Just now"
          if (diffInMinutes > 0 && diffInMinutes < 60) timeLabel = `${diffInMinutes}m ago`
          else if (diffInMinutes >= 60 && diffInMinutes < 1440) timeLabel = `${Math.floor(diffInMinutes / 60)}h ago`
          else if (diffInMinutes >= 1440) timeLabel = `${Math.floor(diffInMinutes / 1440)}d ago`

          return {
            msg: log.msg,
            time: timeLabel,
            type: log.type
          }
        })
        setLogs(transformedLogs)

      } catch (error) {
        console.error("Failed to fetch admin data", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDownloadReport = async () => {
    try {
      setDownloading(true);
      const monthParam = selectedMonth === "all" ? "" : selectedMonth;
      const blob = await apiClient.admin.downloadReport(monthParam);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${selectedMonth || 'all'}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (e) {
      console.error("Download failed", e);
      alert("Failed to download report");
    } finally {
      setDownloading(false);
    }
  }

  const CHART_COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef']

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      href: "/admin/users",
      change: "+12% from last month"
    },
    {
      title: "Active Loans",
      value: stats.activeLoans,
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      href: "/admin/loans",
      change: "Safe"
    },
    {
      title: "Pending Loans",
      value: stats.pendingLoans,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      href: "/admin/loans?status=pending",
      change: "Action Required"
    },
    {
      title: "Rejected Loans",
      value: stats.rejectedLoans,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      href: "/admin/loans?status=rejected",
      change: "Review"
    },
  ]

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in p-6">
        <div className="h-10 w-1/3 bg-slate-100 animate-pulse rounded-md" />
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-100 rounded-xl animate-pulse" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
            Admin <span className="text-blue-600">Dashboard</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium">Overview of system performance and metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px] bg-white border-slate-200">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              {/* Simplified month generation - could be dynamic */}
              <SelectItem value="2024-01">January 2024</SelectItem>
              <SelectItem value="2024-02">February 2024</SelectItem>
              <SelectItem value="2024-03">March 2024</SelectItem>
              <SelectItem value="2024-12">December 2024</SelectItem>
              <SelectItem value="2025-01">January 2025</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleDownloadReport}
            disabled={downloading}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-sm"
          >
            {downloading ? <Activity className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className={cn("border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:-translate-y-1", stat.bgColor)}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-bold text-slate-700">{stat.title}</CardTitle>
                  <div className="p-2 bg-white/60 rounded-lg">
                    <Icon className={cn("h-4 w-4", stat.color)} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                  <p className="text-xs text-slate-600 mt-1 font-medium">{stat.change}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-slate-200 bg-white shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-900">
              <Activity className="h-5 w-5 text-blue-600" />
              Disbursement Trends
            </CardTitle>
            <CardDescription className="text-slate-500">Monthly loan disbursement analysis</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#1e293b' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAmt)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-900">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              Loan Distribution
            </CardTitle>
            <CardDescription className="text-slate-500">By Loan Type</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={loanDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {loanDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  itemStyle={{ color: '#0f172a', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#64748b' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Zap className="h-5 w-5 text-amber-500" /> Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4">
            {[
              {
                label: "Broadcast Alerts",
                href: "/admin/notifications",
                icon: Bell,
                color: "text-amber-600",
                bg: "bg-amber-50",
                description: "Broadcast system alerts and personalized messages to users."
              },
              {
                label: "Monitor Payments",
                href: "/admin/payments",
                icon: CreditCard,
                color: "text-emerald-600",
                bg: "bg-emerald-50",
                description: "Monitor and verify all system-wide payment transactions."
              },
              {
                label: "Manage Loans",
                href: "/admin/loans",
                icon: FileText,
                color: "text-blue-600",
                bg: "bg-blue-50",
                description: "Review and manage loan applications and agreements."
              },
              {
                label: "File Uploads",
                href: "/admin/file-upload",
                icon: Download,
                color: "text-purple-600",
                bg: "bg-purple-50",
                description: "Upload and manage system circulars and documents."
              },
            ].map((action, i) => (
              <Link key={i} href={action.href}>
                <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                  <div className={cn("p-2 rounded-lg shrink-0", action.bg)}>
                    <action.icon className={cn("h-5 w-5", action.color)} />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">{action.label}</p>
                    <p className="text-xs text-slate-500 line-clamp-2">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Recent Logs */}
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Shield className="h-5 w-5 text-slate-500" /> Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {logs.slice(0, 5).map((log, i) => (
                <div key={i} className="flex gap-3 items-start p-2 rounded-md hover:bg-slate-50 transition-colors">
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                    log.type === "alert" ? "bg-red-500" : "bg-emerald-500"
                  )} />
                  <div>
                    <p className="text-sm text-slate-800 font-medium">{log.msg}</p>
                    <p className="text-xs text-slate-500">{log.time}</p>
                  </div>
                </div>
              ))}
              {logs.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No recent activity.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
