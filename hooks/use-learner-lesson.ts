"use client"

import { useCallback, useEffect, useState } from "react"

export interface LearnerLesson {
    id: string
    title: string
    type: string
    content: string
    videoUrl: string | null
    fileUrl: string | null
    quizzes: unknown[]
}

export function useLearnerLesson(lessonId: string) {
    const [lesson, setLesson] = useState<LearnerLesson | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [completed, setCompleted] = useState(false)
    const [marking, setMarking] = useState(false)
    const [courseCompleted, setCourseCompleted] = useState(false)

    const fetchLesson = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const res = await fetch(`/api/lessons/${lessonId}`)
            if (!res.ok) {
                const body = await res.json().catch(() => ({}))
                throw new Error(
                    typeof body?.error === "string"
                        ? body.error
                        : "Dars topilmadi"
                )
            }
            const data = await res.json()
            setLesson(data)

            const progRes = await fetch(`/api/progress?lessonId=${lessonId}`)
            if (progRes.ok) {
                const prog = await progRes.json()
                setCompleted(
                    Array.isArray(prog) &&
                    prog.some((p: { completedAt?: string }) => p.completedAt)
                )
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Xatolik")
            setLesson(null)
        } finally {
            setLoading(false)
        }
    }, [lessonId])

    useEffect(() => {
        fetchLesson()
    }, [fetchLesson])

    const markComplete = useCallback(async () => {
        try {
            setMarking(true)
            const res = await fetch("/api/progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lessonId }),
            })
            if (!res.ok) throw new Error()
            const data = await res.json()
            setCompleted(true)
            if (data.courseCompleted) {
                setCourseCompleted(true)
            }
        } catch {
            setError("Progress saqlanmadi")
        } finally {
            setMarking(false)
        }
    }, [lessonId])

    return {
        lesson,
        loading,
        error,
        completed,
        marking,
        courseCompleted,
        refresh: fetchLesson,
        markComplete,
    }
}