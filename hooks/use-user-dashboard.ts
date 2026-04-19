"use client"

import { useCallback, useEffect, useState } from "react"

export interface UserDashboardCourse {
    enrollmentId: string
    courseId: string
    title: string
    thumbnail: string | null
    level: string
    completedAt: string | null
    progressPercent: number
    totalLessons: number
    completedLessons: number
}

export interface UserDashboardData {
    stats: {
        enrolledCourses: number
        completedCourses: number
        certificates: number
        avgQuizScore: number
    }
    inProgress: UserDashboardCourse[]
    courses: UserDashboardCourse[]
}

export function useUserDashboard() {
    const [data, setData] = useState<UserDashboardData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const res = await fetch("/api/user/dashboard")
            if (!res.ok) {
                const body = await res.json().catch(() => ({}))
                throw new Error(
                    typeof body?.error === "string"
                        ? body.error
                        : `Server xatosi: ${res.status}`
                )
            }
            const json: UserDashboardData = await res.json()
            setData(json)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Xatolik yuz berdi")
            setData(null)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return { data, loading, error, refresh: fetchData }
}
