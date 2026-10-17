"use client"

import { useEffect, useState } from "react"
import { Users, BookOpen, Award, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Loading from "@/components/_components/loading"

interface DashboardStats {
    totalEmployees: number
    activeEmployees: number
    totalEnrollments: number
    completedEnrollments: number
    certificatesIssued: number
    avgScore: number
}

interface Props {
    companyId: string
}

export function DirectorDashboard({ companyId }: Props) {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`/api/director/dashboard`)
            .then(r => r.json())
            .then(setStats)
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <Loading />

    const cards = [
        { label: "Jami xodimlar", value: stats?.totalEmployees ?? 0, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Faol o'quvchilar", value: stats?.activeEmployees ?? 0, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Yakunlangan kurslar", value: stats?.completedEnrollments ?? 0, icon: BookOpen, color: "text-violet-500", bg: "bg-violet-500/10" },
        { label: "Sertifikatlar", value: stats?.certificatesIssued ?? 0, icon: Award, color: "text-amber-500", bg: "bg-amber-500/10" },
    ]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">Korxonangiz xodimlarining o'quv jarayoni</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((card) => (
                    <Card key={card.label} className="bg-card border-border">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`p-2 rounded-lg ${card.bg}`}>
                                    <card.icon className={`w-5 h-5 ${card.color}`} />
                                </div>
                            </div>
                            <p className="text-2xl font-bold">{card.value}</p>
                            <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}