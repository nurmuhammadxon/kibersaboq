"use client"

import { useCallback, useEffect, useState } from "react"

export interface CatalogLesson {
    id: string
    title: string
    order: number
    type: string
}

export interface CatalogModule {
    id: string
    title: string
    order: number
    lessons: CatalogLesson[]
}

export interface CatalogCourse {
    id: string
    title: string
    description: string | null
    thumbnail: string | null
    level: string
    duration: number | null
    price: unknown
    isPublished: boolean
    modules: CatalogModule[]
    enrollments: { id: string }[]
}

export function useCatalogCourses() {
    const [courses, setCourses] = useState<CatalogCourse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchCourses = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const res = await fetch("/api/courses")
            if (!res.ok) throw new Error("Kurslarni yuklashda xatolik")
            const json = await res.json()
            setCourses(json)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Xatolik")
            setCourses([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchCourses()
    }, [fetchCourses])

    return { courses, loading, error, refresh: fetchCourses }
}
