"use client"

import { useCallback, useEffect, useState } from "react"

export interface CatalogCourse {
    id: string
    title: string
    description: string | null
    thumbnail: string | null
    level: string
    duration: number | null
    enrollments: { id: string }[]
}

export function useCourseCatalog() {
    const [courses, setCourses] = useState<CatalogCourse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [enrollingId, setEnrollingId] = useState<string | null>(null)

    const fetchCourses = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const res = await fetch("/api/courses")
            if (!res.ok) throw new Error("Kurslar yuklanmadi")
            const data = await res.json()
            setCourses(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Xatolik")
        } finally {
            setLoading(false)
        }
    }, [])

    const enroll = useCallback(async (courseId: string) => {
        try {
            setEnrollingId(courseId)
            const res = await fetch("/api/enrollments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ courseId }),
            })
            if (!res.ok) {
                const body = await res.json().catch(() => ({}))
                throw new Error(body?.error ?? "Yozilishda xato")
            }
            await fetchCourses()
        } catch (err) {
            alert(err instanceof Error ? err.message : "Xatolik")
        } finally {
            setEnrollingId(null)
        }
    }, [fetchCourses])

    useEffect(() => {
        fetchCourses()
    }, [fetchCourses])

    return { courses, loading, error, enrollingId, enroll, refresh: fetchCourses }
}