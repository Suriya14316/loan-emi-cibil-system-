"use client"

import { useState, useEffect } from "react"
import { FileText, Trash2, Download, Search, File, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { apiClient } from "@/lib/api-client"

interface FileInfo {
    name: string
    size: number
    lastModified: number
}

export default function FileRepositoryPage() {
    const [files, setFiles] = useState<FileInfo[]>([])
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)
    const [searchTerm, setSearchTerm] = useState("")

    const fetchFiles = async () => {
        try {
            setLoading(true)
            const data = await apiClient.admin.getFiles()
            setFiles(data)
        } catch (error) {
            console.error("Failed to fetch files:", error)
            setStatus({ type: "error", message: "Failed to load files." })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchFiles()
    }, [])

    const handleDownload = async (filename: string) => {
        try {
            const response = await fetch(`http://localhost:8081/api/admin/files/${filename}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (!response.ok) throw new Error('Failed to download file')
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = filename
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch (error) {
            console.error('Failed to download file', error)
            alert('Failed to download file')
        }
    }

    const handleDelete = async (filename: string) => {
        if (!confirm(`Are you sure you want to delete "${filename}"?`)) return

        try {
            await apiClient.admin.deleteFile(filename)
            setStatus({ type: "success", message: `File "${filename}" deleted successfully.` })
            fetchFiles() // Refresh list
        } catch (error) {
            console.error("Failed to delete file:", error)
            setStatus({ type: "error", message: "Failed to delete file." })
        }
    }

    const filteredFiles = files.filter(file =>
        (file.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    )

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const formatDate = (ms: number) => {
        return new Date(ms).toLocaleString()
    }

    return (
        <div className="space-y-6 animate-fade-in max-w-6xl mx-auto py-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">File Repository</h1>
                    <p className="text-slate-500">Manage and view all system uploaded documents.</p>
                </div>
            </div>

            <Card className="border-slate-200 shadow-sm bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-bold">Stored Files</CardTitle>
                    <div className="relative w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                        <Input
                            placeholder="Search files..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {status && (
                        <Alert variant={status.type === "error" ? "destructive" : "default"} className={`mb-4 ${status.type === "success" ? "border-green-200 bg-green-50 text-green-800" : ""}`}>
                            <AlertTitle>{status.type === "success" ? "Success" : "Error"}</AlertTitle>
                            <AlertDescription>{status.message}</AlertDescription>
                        </Alert>
                    )}

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Size</TableHead>
                                    <TableHead>Date Modified</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">Loading files...</TableCell>
                                    </TableRow>
                                ) : filteredFiles.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-500">
                                                <File className="h-8 w-8 mb-2 opacity-50" />
                                                <p>No files found</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredFiles.map((file, index) => (
                                        <TableRow key={`${file.name || 'unknown'}-${index}`}>
                                            <TableCell className="font-medium flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-blue-500" />
                                                {file.name}
                                            </TableCell>
                                            <TableCell>{formatSize(file.size)}</TableCell>
                                            <TableCell>{formatDate(file.lastModified)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => handleDownload(file.name)} title="Download">
                                                        <Download className="h-4 w-4 text-slate-600" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(file.name)} title="Delete">
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
