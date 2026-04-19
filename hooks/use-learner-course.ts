"use client"

import { useCallback, useEffect, useState } from "react"

export interface LearnerLessonRef {
    id: string
    title: string
    order: number
    type: string
}

export interface LearnerModule {
    id: string
    title: string
    order: number
    lessons: LearnerLessonRef[]
}

export interface LearnerCourseData {
    id: string
    title: string
    description: string | null
    thumbnail: string | null
    level: string
    modules: LearnerModule[]
}

export function useLearnerCourse(courseId: string) {
    const [course, setCourse] = useState<LearnerCourseData | null>(null)
    const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(
        new Set()
    )
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchAll = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const [courseRes, progRes] = await Promise.all([
                fetch(`/api/courses/${courseId}`),
                fetch("/api/progress"),
            ])

            if (!courseRes.ok) {
                const body = await courseRes.json().catch(() => ({}))
                throw new Error(
                    typeof body?.error === "string"
                        ? body.error
                        : "Kurs topilmadi"
                )
            }

            const courseJson = await courseRes.json()
            setCourse(courseJson)

            if (progRes.ok) {
                const prog = await progRes.json()
                const ids = new Set<string>()
                if (Array.isArray(prog)) {
                    for (const p of prog) {
                        if (p.completedAt && p.lessonId) ids.add(p.lessonId)
                    }
                }
                setCompletedLessonIds(ids)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Xatolik")
            setCourse(null)
        } finally {
            setLoading(false)
        }
    }, [courseId])

    useEffect(() => {
        fetchAll()
    }, [fetchAll])

    return {
        course,
        completedLessonIds,
        loading,
        error,
        refresh: fetchAll,
    }
}
