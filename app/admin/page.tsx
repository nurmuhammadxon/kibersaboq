"use client"

import { useEffect, useState } from "react"
import { STATS_CONFIG } from "@/lib/constants"
import { StatCard } from "@/components/admin/stat-card"
import { TopUsers } from "@/components/admin/top-users"
import { RecentUsers } from "@/components/admin/recent-users"
import Loading from "@/components/_components/loading"
import { Error as ErrorComponent } from "@/components/_components/error"

interface DashboardData {
    stats: {
        totalUsers: number
        totalCourses: number
        totalEnrollments: number
        completedEnrollments: number
        avgScore: number
        completionRate: number
    }
    recentUsers: {
        id: string
        name: string
        email: string
        createdAt: string
    }[]
    topUsers: {
        id: string
        name: string
        email: string
        avgScore: number
        completedCourses: number
    }[]
}

export default function AdminDashboard() {
    const [data, setData] = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = async () => {
        try {
            setLoading(true)
            setError(null)
            const res = await fetch("/api/admin/dashboard/")

            if (!res.ok) {
                throw new Error(`API error: ${res.status}`)
            }

            const result: DashboardData = await res.json()
            setData(result)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Xatolik yuz berdi"
            setError(errorMessage)
            setData(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    if (loading) {
        return <Loading fullScreen={true} />
    }

    if (error) {
        return (
            <ErrorComponent
                title="Ma'lumot yuklanmadi"
                message={error}
                onRetry={fetchData}
                fullScreen={true}
            />
        )
    }

    if (!data) {
        return (
            <ErrorComponent
                title="Ma'lumot topilmadi"
                message="Admin ma'lumotlari mavjud emas"
                onRetry={fetchData}
                fullScreen={true}
            />
        )
    }

    return (
        <div className="min-h-screen bg-zinc-950 p-6 space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {STATS_CONFIG.map((config) => (
                    <StatCard
                        key={config.key}
                        label={config.label}
                        value={`${data?.stats[config.key as keyof typeof data.stats] || 0}${config.suffix || ""}`}
                        icon={config.icon}
                        color={config.color}
                        bg={config.bg}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <TopUsers users={data?.topUsers || []} />
                <RecentUsers users={data?.recentUsers || []} />
            </div>
        </div>
    )
}