"use client"

import { useState } from "react"
import { apiClient } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"

export default function UserFileUploadPage() {
    const { user } = useAuth()
    const { toast } = useToast()
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [uploadSuccess, setUploadSuccess] = useState(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0]
            // Client-side validation
            if (selectedFile.size > 40 * 1024) {
                toast({
                    title: "File too large",
                    description: "Please select a file smaller than 40KB.",
                    variant: "destructive"
                })
                return
            }
            if (!selectedFile.name.match(/\.(xls|xlsx|doc|docx)$/)) {
                toast({
                    title: "Invalid Format",
                    description: "Only Excel (.xls, .xlsx) and Word (.doc, .docx) files are allowed.",
                    variant: "destructive"
                })
                return
            }
            setFile(selectedFile)
            setUploadSuccess(false)
        }
    }

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) return

        setUploading(true)
        const formData = new FormData()
        formData.append("file", file)

        // Append user ID or name to filename if possible, or just upload as is.
        // Backend currently saves as original filename. 
        // Ideally we'd rename it, but for now we follow the existing pattern.

        try {
            await apiClient.admin.uploadFile(formData)
            setUploadSuccess(true)
            toast({
                title: "Upload Successful",
                description: "Your document has been securely submitted to the admin team.",
            })
            setFile(null)
        } catch (error) {
            console.error("Upload error", error)
            toast({
                title: "Upload Failed",
                description: "There was an error uploading your file. Please try again.",
                variant: "destructive"
            })
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold text-foreground">Data Correction Request</h1>
                <p className="text-muted-foreground">Upload supporting documents for data correction or verification.</p>
            </div>

            <Card className="max-w-xl mx-auto border-border bg-card shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                            <Upload className="h-5 w-5" />
                        </div>
                        Submit Document
                    </CardTitle>
                    <CardDescription>
                        If you believe your financial data or loan entries are incorrect, please upload the relevant proof (Excel or Word) for Admin review.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {uploadSuccess ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center space-y-4 animate-fade-in">
                            <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-8 w-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-green-700">Submission Received</h3>
                                <p className="text-sm text-green-600/80 mt-1">Our admin team will review your document shortly.</p>
                            </div>
                            <Button variant="outline" onClick={() => setUploadSuccess(false)}>
                                Upload Another File
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleUpload} className="space-y-6">
                            <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-muted/5 transition-colors cursor-pointer group relative">
                                <Input
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleFileChange}
                                    accept=".doc,.docx,.xls,.xlsx"
                                />
                                {file ? (
                                    <div className="space-y-2">
                                        <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <p className="font-bold text-foreground">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2 group-hover:scale-105 transition-transform">
                                        <div className="h-12 w-12 bg-muted text-muted-foreground rounded-full flex items-center justify-center mx-auto group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                            <Upload className="h-6 w-6" />
                                        </div>
                                        <p className="font-medium text-foreground">Click to browse or drag file here</p>
                                        <p className="text-xs text-muted-foreground">Supports .xls, .xlsx, .doc, .docx (Max 40KB)</p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-amber-800 text-sm">
                                <AlertCircle className="h-5 w-5 shrink-0" />
                                <p>Please ensure you do not upload sensitive personal documents like Aadhar or PAN directly unless requested. This channel is for data correction proofs.</p>
                            </div>

                            <Button type="submit" className="w-full h-11 text-base" disabled={!file || uploading}>
                                {uploading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                                    </>
                                ) : (
                                    "Submit for Review"
                                )}
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
