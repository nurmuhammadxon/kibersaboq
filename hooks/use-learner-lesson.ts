"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export interface LearnerOption {
    id: string
    text: string
}

export interface LearnerQuestion {
    id: string
    text: string
    options: LearnerOption[]
}

export interface LearnerQuiz {
    id: string
    questions: LearnerQuestion[]
}

export interface LearnerLesson {
    id: string
    title: string
    type: string
    content: string
    videoUrl: string | null
    fileUrl: string | null
    minDuration: number | null
    quizzes: LearnerQuiz[]
}

export function useLearnerLesson(lessonId: string) {
    const [lesson, setLesson] = useState<LearnerLesson | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [completed, setCompleted] = useState(false)
    const [marking, setMarking] = useState(false)
    const [courseCompleted, setCourseCompleted] = useState(false)

    // Timer
    const [elapsed, setElapsed] = useState(0)
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const startTimer = useCallback(() => {
        if (timerRef.current) return
        timerRef.current = setInterval(() => {
            setElapsed((prev) => prev + 1)
        }, 1000)
    }, [])

    const stopTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
        }
    }, [])

    useEffect(() => {
        return () => stopTimer()
    }, [stopTimer])

    const fetchLesson = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            setElapsed(0)
            stopTimer()

            const res = await fetch(`/api/lessons/${lessonId}`)
            if (!res.ok) {
                const body = await res.json().catch(() => ({}))
                throw new Error(typeof body?.error === "string" ? body.error : "Dars topilmadi")
            }
            const data = await res.json()
            setLesson(data)

            const progRes = await fetch(`/api/progress?lessonId=${lessonId}`)
            if (progRes.ok) {
                const prog = await progRes.json()
                const isCompleted =
                    Array.isArray(prog) &&
                    prog.some((p: { completedAt?: string }) => p.completedAt)
                setCompleted(isCompleted)
                if (!isCompleted) startTimer()
            } else {
                startTimer()
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Xatolik")
            setLesson(null)
        } finally {
            setLoading(false)
        }
    }, [lessonId, startTimer, stopTimer])

    useEffect(() => { fetchLesson() }, [fetchLesson])

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
            stopTimer()
            if (data.courseCompleted) setCourseCompleted(true)
        } catch {
            setError("Progress saqlanmadi")
        } finally {
            setMarking(false)
        }
    }, [lessonId, stopTimer])

    const minDuration = lesson?.minDuration ?? null
    const timerReady = minDuration === null || elapsed >= minDuration
    const remaining = minDuration !== null ? Math.max(minDuration - elapsed, 0) : 0

    return {
        lesson, loading, error,
        completed, marking, courseCompleted,
        elapsed, timerReady, remaining,
        refresh: fetchLesson, markComplete,
    }
}