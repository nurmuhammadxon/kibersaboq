"use client"

import { useState, useEffect, useCallback } from "react"

export interface AdminReportsCourseRow {
    id: string
    title: string
    enrollments: number
    completed: number
    certificates: number
    avgScore: number | null
}

export interface AdminReportsData {
    range: { from: string; to: string }
    stats: {
        newUsers: number
        enrollmentsStarted: number
        enrollmentsCompleted: number
        certificatesIssued: number
        avgQuizScore: number
        quizAttempts: number
    }
    courses: AdminReportsCourseRow[]
    courseOptions: { id: string; title: string }[]
}

function buildQuery(from: string, to: string, courseId: string) {
    const params = new URLSearchParams({ from, to })
    if (courseId) params.set("courseId", courseId)
    return `/api/admin/reports?${params.toString()}`
}

export function useAdminReports(from: string, to: string, courseId: string) {
    const [data, setData] = useState<AdminReportsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const res = await fetch(buildQuery(from, to, courseId))

            if (!res.ok) {
                const body = await res.json().catch(() => ({}))
                const msg =
                    typeof body?.error === "string"
                        ? body.error
                        : `Server xatosi: ${res.status}`
                throw new Error(msg)
            }

            const result: AdminReportsData = await res.json()
            setData(result)
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Xatolik yuz berdi"
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }, [from, to, courseId])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return {
        data,
        loading,
        error,
        refresh: fetchData,
    }
}
