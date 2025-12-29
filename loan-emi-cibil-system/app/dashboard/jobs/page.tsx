"use client"

import { useEffect, useState } from "react"
import { apiClient, transformers } from "@/lib/api-client"
import { cn } from "@/lib/utils"
import type { Job } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Briefcase, MapPin, DollarSign, Zap, Globe, Cpu } from "lucide-react"

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await apiClient.jobs.getAll()
        setJobs(data.map(transformers.job))
      } catch (error) {
        console.error("Failed to fetch jobs:", error)
      }
    }
    fetchJobs()
  }, [])

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      <div className="space-y-1">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
            <Cpu className="h-6 w-6 text-primary" />
          </div>
          {"Career Network"}
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">{"High-yield opportunities synced with your financial profile."}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {jobs.map((job, index) => (
          <Card
            key={job.id}
            className="border-border bg-white shadow-xl hover:shadow-2xl transition-all duration-300 animate-slide-up group"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader className="pb-4 border-b border-border">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Badge variant="outline" className="mb-2 border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">{job.type}</Badge>
                  <CardTitle className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">{job.title}</CardTitle>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1 font-bold">
                    <Globe className="h-3 w-3" />
                    {job.company}
                  </div>
                </div>
                <div className="p-3 bg-muted/20 rounded-2xl group-hover:bg-primary/10 transition-all">
                  <Briefcase className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-sm text-foreground font-medium">
                  <div className="p-2 bg-muted/20 rounded-lg">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-primary font-black">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <DollarSign className="h-4 w-4 text-primary" />
                  </div>
                  <span>{job.salary}</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-border pl-4">{job.description}</p>

              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">{"Required Skillsets"}</p>
                <div className="flex flex-wrap gap-2">
                  {job.requirements.map((req) => (
                    <Badge key={req} variant="secondary" className="bg-muted text-foreground border-border hover:bg-muted/80 px-3 py-1">
                      {req}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest h-12 rounded-xl shadow-lg shadow-primary/20 group">
                {"Initialize Application"}
                <Zap className="ml-2 h-4 w-4 group-hover:animate-pulse" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
