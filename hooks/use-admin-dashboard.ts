"use client"
import { useState, useEffect, useCallback } from "react"

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

export const useAdminDashboard = () => {
    const [data, setData] = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const res = await fetch("/api/admin/dashboard/")

            if (!res.ok) {
                throw new Error(`Server xatosi: ${res.status}`)
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
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return {
        data,
        loading,
        error,
        refresh: fetchData
    }
}