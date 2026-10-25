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

// Savollar darsning o'zi bilan kelmaydi: test boshlanganda /start orqali olinadi
export interface LearnerQuiz {
    id: string
    questionCount: number
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

const PING_EVERY_MS = 10_000
const IDLE_MS = 45_000 // shuncha vaqt hech narsa bosilmasa/siljitilmasa, vaqt to'xtaydi
const TOLERANCE_S = 2 // serverdagi bilan bir xil

export function useLearnerLesson(lessonId: string) {
    const [lesson, setLesson] = useState<LearnerLesson | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [completed, setCompleted] = useState(false)
    const [marking, setMarking] = useState(false)
    const [courseCompleted, setCourseCompleted] = useState(false)

    // Faol o'qish vaqti (soniya): asosiy qiymatni server hisoblaydi, bu yerda faqat ko'rsatiladi
    const [activeSec, setActiveSec] = useState(0)
    const [paused, setPaused] = useState(false)

    const lastInteraction = useRef(Date.now())
    const isVideo = lesson?.type === "VIDEO"

    const sendPing = useCallback(async () => {
        try {
            const res = await fetch("/api/progress/ping", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lessonId }),
            })
            if (!res.ok) return
            const data = await res.json()
            if (typeof data.activeSeconds === "number") setActiveSec(data.activeSeconds)
        } catch {
            /* tarmoq xatosi: keyingi pingda davom etadi */
        }
    }, [lessonId])

    const fetchLesson = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            setActiveSec(0)
            lastInteraction.current = Date.now()

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
                const rows = Array.isArray(prog) ? prog : []
                setCompleted(rows.some((p: { completedAt?: string }) => p.completedAt))
                const saved = rows[0]?.activeSeconds
                if (typeof saved === "number") setActiveSec(saved)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Xatolik")
            setLesson(null)
        } finally {
            setLoading(false)
        }
    }, [lessonId])

    useEffect(() => { fetchLesson() }, [fetchLesson])

    // Foydalanuvchi faolligini kuzatish va vaqtni hisoblash
    useEffect(() => {
        if (!lesson || completed) return

        const touch = () => { lastInteraction.current = Date.now() }
        const events = ["mousemove", "keydown", "scroll", "touchstart", "pointerdown", "click"]
        events.forEach((e) => window.addEventListener(e, touch, { passive: true }))

        const active = () => {
            if (document.visibilityState !== "visible") return false
            if (!document.hasFocus()) return false
            // Video ko'rilayotganda sichqoncha qimirlamasligi mumkin
            return isVideo || Date.now() - lastInteraction.current < IDLE_MS
        }

        const tick = setInterval(() => {
            if (active()) {
                setPaused(false)
                setActiveSec((s) => s + 1)
            } else {
                setPaused(true)
            }
        }, 1000)

        sendPing()
        const ping = setInterval(() => {
            if (active()) sendPing()
        }, PING_EVERY_MS)

        return () => {
            events.forEach((e) => window.removeEventListener(e, touch))
            clearInterval(tick)
            clearInterval(ping)
        }
    }, [lesson, completed, isVideo, sendPing])

    const markComplete = useCallback(async () => {
        try {
            setMarking(true)
            await sendPing() // serverdagi hisobni so'nggi holatga keltiramiz
            const res = await fetch("/api/progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lessonId }),
            })
            if (!res.ok) {
                const body = await res.json().catch(() => ({}))
                throw new Error(typeof body?.error === "string" ? body.error : "")
            }
            const data = await res.json()
            setCompleted(true)
            if (data.courseCompleted) setCourseCompleted(true)
        } catch (err) {
            setError(err instanceof Error && err.message ? err.message : "Progress saqlanmadi")
        } finally {
            setMarking(false)
        }
    }, [lessonId, sendPing])

    const minDuration = lesson?.minDuration ?? null
    const timerReady = minDuration === null || activeSec >= minDuration - TOLERANCE_S
    const remaining = minDuration !== null ? Math.max(minDuration - activeSec, 0) : 0

    return {
        lesson, loading, error,
        completed, marking, courseCompleted,
        activeSec, paused, timerReady, remaining,
        syncActive: sendPing,
        refresh: fetchLesson, markComplete,
    }
}
