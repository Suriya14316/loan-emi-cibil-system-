"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Users, Loader2, Search, ArrowUpDown, ChevronUp, ChevronDown, Mail, Phone, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState, useMemo } from "react"
import { apiClient } from "@/lib/api-client"

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortKey, setSortKey] = useState<string>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const data = await apiClient.admin.getAllUsers()
        setUsers(data || [])
      } catch (error) {
        console.error("Failed to fetch users", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredAndSortedUsers = useMemo(() => {
    let result = [...users]

    // Search Filtering
    if (searchTerm) {
      const lowSearch = searchTerm.toLowerCase()
      result = result.filter(u =>
        u.name?.toLowerCase().includes(lowSearch) ||
        u.email?.toLowerCase().includes(lowSearch) ||
        u.id?.toString().includes(lowSearch)
      )
    }

    // Sorting
    result.sort((a, b) => {
      const valA = a[sortKey] || ""
      const valB = b[sortKey] || ""

      if (valA < valB) return sortOrder === "asc" ? -1 : 1
      if (valA > valB) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    return result
  }, [users, searchTerm, sortKey, sortOrder])

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortOrder("asc")
    }
  }

  const SortIcon = ({ column }: { column: string }) => {
    if (sortKey !== column) return <ArrowUpDown className="ml-2 h-3 w-3 opacity-30" />
    return sortOrder === "asc" ? <ChevronUp className="ml-2 h-3 w-3 text-blue-600" /> : <ChevronDown className="ml-2 h-3 w-3 text-blue-600" />
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-screen-2xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100 border border-blue-200">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          {"User Management"}
        </h1>
        <p className="text-slate-500 text-sm md:text-base">View and manage all system users in the portal. Clear data view.</p>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between space-y-0 py-4">
          <div>
            <CardTitle className="text-slate-800">Operational Database</CardTitle>
            <CardDescription className="text-slate-500 text-xs uppercase tracking-wider mt-1">Live User Manifest</CardDescription>
          </div>
          <div className="relative w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <Input
              placeholder="Search by Name, Email or ID..."
              className="pl-10 bg-white border-slate-200 text-slate-900 h-9 focus-visible:ring-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="border-slate-100 hover:bg-transparent">
                <TableHead
                  className="text-slate-500 font-semibold cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center">{"ID"} <SortIcon column="id" /></div>
                </TableHead>
                <TableHead
                  className="text-slate-500 font-semibold cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">{"Name"} <SortIcon column="name" /></div>
                </TableHead>
                <TableHead
                  className="text-slate-500 font-semibold cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center">{"Email"} <SortIcon column="email" /></div>
                </TableHead>
                <TableHead className="text-slate-500 font-semibold">{"Contact"}</TableHead>
                <TableHead
                  className="text-slate-500 font-semibold cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => handleSort('role')}
                >
                  <div className="flex items-center">{"Access"} <SortIcon column="role" /></div>
                </TableHead>
                <TableHead className="text-slate-500 font-semibold">{"Status"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i} className="border-slate-100">
                    <TableCell colSpan={6} className="p-4">
                      <div className="h-10 bg-slate-100 rounded animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredAndSortedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3 opacity-50">
                      <Search className="h-12 w-12 text-slate-300" />
                      <p className="text-slate-500 font-medium text-sm">
                        {searchTerm ? `No results for "${searchTerm}"` : "No Users Found"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedUsers.map((user) => (
                  <TableRow key={user.id} className="border-slate-100 hover:bg-slate-50 transition-colors group">
                    <TableCell className="font-mono text-xs text-slate-500">{user.id}</TableCell>
                    <TableCell className="text-slate-900 font-medium">
                      <div className="flex flex-col">
                        <span>{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3 text-slate-400" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600 text-sm">
                      {user.phone ? (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-slate-400" />
                          {user.phone}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No contact</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role?.toLowerCase() === "admin" ? "default" : "secondary"} className={cn("text-xs font-medium", user.role?.toLowerCase() === "admin" ? "bg-purple-100 text-purple-700 hover:bg-purple-200 border-none" : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-none")}>
                        {user.role?.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-slate-500 text-xs border-slate-200">{(user.status || "ACTIVE").toUpperCase()}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
