"use client"

import { useState, useEffect, useCallback } from "react"

export interface DirectorReportEmployee {
    id: string
    firstName: string
    lastName: string
    email: string
    field: string | null
    isBlocked: boolean
    enrollments: number
    completed: number
    lessons: number
    certificates: number
    avgScore: number | null
}

export interface DirectorReportCourse {
    id: string
    title: string
    enrollments: number
    completed: number
    certificates: number
    avgScore: number | null
}

export interface DirectorReportActivity {
    date: string
    lessons: number
    completions: number
    certificates: number
}

export interface DirectorReportsData {
    range: { from: string; to: string }
    bucketSize: number
    company: { name: string; code: string }
    stats: {
        totalEmployees: number
        activeEmployees: number
        enrollmentsStarted: number
        enrollmentsCompleted: number
        certificatesIssued: number
        lessonsCompleted: number
        avgQuizScore: number
        quizAttempts: number
    }
    activity: DirectorReportActivity[]
    employees: DirectorReportEmployee[]
    courses: DirectorReportCourse[]
    courseOptions: { id: string; title: string }[]
}

function buildQuery(from: string, to: string, courseId: string) {
    const params = new URLSearchParams({ from, to })
    if (courseId) params.set("courseId", courseId)
    return `/api/director/reports?${params.toString()}`
}

export function useDirectorReports(from: string, to: string, courseId: string) {
    const [data, setData] = useState<DirectorReportsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const res = await fetch(buildQuery(from, to, courseId))

            if (!res.ok) {
                const body = await res.json().catch(() => ({}))
                throw new Error(
                    typeof body?.error === "string"
                        ? body.error
                        : `Server xatosi: ${res.status}`
                )
            }

            setData(await res.json())
        } catch (err) {
            setError(err instanceof Error ? err.message : "Xatolik yuz berdi")
        } finally {
            setLoading(false)
        }
    }, [from, to, courseId])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return { data, loading, error, refresh: fetchData }
}