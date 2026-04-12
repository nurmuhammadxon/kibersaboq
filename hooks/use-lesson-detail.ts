"use client"
import { useState, useEffect, useCallback } from "react"

export interface Option {
    id: string
    text: string
    isCorrect: boolean
}

export interface Question {
    id: string
    text: string
    options: Option[]
}

export interface Quiz {
    id: string
    questions: Question[]
}

export interface Lesson {
    id: string
    title: string
    type: string
    content: string
    videoUrl?: string
    fileUrl?: string
    quizzes: Quiz[]
}

export function useLessonDetail(lessonId: string) {
    const [lesson, setLesson] = useState<Lesson | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    // Content
    const [content, setContent] = useState("")
    const [videoUrl, setVideoUrl] = useState("")
    const [fileUrl, setFileUrl] = useState("")

    // Quiz
    const [quizModal, setQuizModal] = useState(false)
    const [questionText, setQuestionText] = useState("")
    const [options, setOptions] = useState(["", "", "", ""])
    const [correctIndex, setCorrectIndex] = useState(0)
    const [quizSaving, setQuizSaving] = useState(false)
    const [quizError, setQuizError] = useState("")
    const [deleteQuizId, setDeleteQuizId] = useState<string | null>(null)

    const fetchLesson = useCallback(async () => {
        setLoading(true)
        setError("")
        try {
            const res = await fetch(`/api/lessons/${lessonId}`)
            if (!res.ok) throw new Error()
            const data = await res.json()
            setLesson(data)
            setContent(data.content || "")
            setVideoUrl(data.videoUrl || "")
            setFileUrl(data.fileUrl || "")
        } catch {
            setError("Dars yuklanmadi")
        } finally {
            setLoading(false)
        }
    }, [lessonId])

    useEffect(() => { fetchLesson() }, [fetchLesson])

    const handleSaveContent = async () => {
        setSaving(true)
        try {
            await fetch(`/api/lessons/${lessonId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content, videoUrl, fileUrl })
            })
            setSaved(true)
            setTimeout(() => setSaved(false), 2000)
        } catch {
            setError("Saqlashda xatolik yuz berdi")
        } finally {
            setSaving(false)
        }
    }

    const handleAddQuiz = async () => {
        if (!questionText) { setQuizError("Savol matni kiritilishi shart"); return }
        if (options.some(o => !o)) { setQuizError("Barcha variantlarni to'ldiring"); return }
        setQuizSaving(true)
        setQuizError("")
        try {
            // Quiz yo'q bo'lsa yaratamiz
            let quizId = lesson?.quizzes[0]?.id
            if (!quizId) {
                const quizRes = await fetch(`/api/lessons/${lessonId}/quiz`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({})
                })
                const quiz = await quizRes.json()
                quizId = quiz.id
            }

            await fetch(`/api/quizzes/${quizId}/questions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: questionText,
                    options: options.map((text, i) => ({
                        text,
                        isCorrect: i === correctIndex
                    }))
                })
            })

            setQuizModal(false)
            setQuestionText("")
            setOptions(["", "", "", ""])
            setCorrectIndex(0)
            await fetchLesson()
        } catch {
            setQuizError("Xatolik yuz berdi")
        } finally {
            setQuizSaving(false)
        }
    }

    const handleDeleteQuestion = async (quizId: string, questionId: string) => {
        await fetch(`/api/quizzes/${quizId}/questions/${questionId}`, { method: "DELETE" })
        await fetchLesson()
    }

    return {
        lesson, loading, error, fetchLesson,
        content, setContent,
        videoUrl, setVideoUrl,
        fileUrl, setFileUrl,
        saving, saved, handleSaveContent,
        quizModal, setQuizModal,
        questionText, setQuestionText,
        options, setOptions,
        correctIndex, setCorrectIndex,
        quizSaving, quizError,
        deleteQuizId, setDeleteQuizId,
        handleAddQuiz, handleDeleteQuestion,
    }
}