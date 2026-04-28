"use client"

import { useState } from "react"
import { CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { LearnerQuiz } from "@/hooks/use-learner-lesson"

interface Props {
    quiz: LearnerQuiz
    lessonId: string
}

export function LessonQuiz({ quiz, lessonId }: Props) {
    const [selected, setSelected] = useState<Record<string, string>>({})
    const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const questions = quiz.questions
    const allAnswered = questions.every((q) => selected[q.id])

    const handleSubmit = async () => {
        try {
            setSubmitting(true)
            setError(null)
            const answers = Object.entries(selected).map(([questionId, optionId]) => ({
                questionId,
                optionId,
            }))
            const res = await fetch(`/api/quizzes/${quiz.id}/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answers, lessonId }),
            })
            if (!res.ok) throw new Error()
            const data = await res.json()
            setResult(data)
        } catch {
            setError("Xatolik yuz berdi")
        } finally {
            setSubmitting(false)
        }
    }

    const handleRetry = () => {
        setSelected({})
        setResult(null)
        setError(null)
    }

    if (result) {
        return (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <h3 className="font-medium text-sm">Test natijasi</h3>
                <div className={`flex items-center gap-3 p-4 rounded-xl ${result.passed ? "bg-emerald-500/10" : "bg-destructive/10"}`}>
                    {result.passed
                        ? <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                        : <XCircle className="h-6 w-6 text-destructive shrink-0" />
                    }
                    <div>
                        <p className="font-medium text-sm">
                            {result.passed ? "Muvaffaqiyatli!" : "Muvaffaqiyatsiz"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Natija: {result.score}%
                        </p>
                    </div>
                </div>
                {!result.passed && (
                    <Button variant="outline" size="sm" onClick={handleRetry}>
                        Qayta urinish
                    </Button>
                )}
            </div>
        )
    }

    return (
        <div className="rounded-xl border border-border bg-card p-5 space-y-5">
            <h3 className="font-medium text-sm">Savollar ({questions.length})</h3>

            {error && (
                <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
                    {error}
                </p>
            )}

            <div className="space-y-5">
                {questions.map((q, qi) => (
                    <div key={q.id} className="space-y-2">
                        <p className="text-sm font-medium">
                            {qi + 1}. {q.text}
                        </p>
                        <div className="space-y-1.5">
                            {q.options.map((opt) => {
                                const isSelected = selected[q.id] === opt.id
                                return (
                                    <button
                                        key={opt.id}
                                        onClick={() => setSelected((prev) => ({ ...prev, [q.id]: opt.id }))}
                                        className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors border ${isSelected
                                                ? "border-primary bg-primary/10 text-primary"
                                                : "border-border bg-secondary/40 hover:bg-secondary"
                                            }`}
                                    >
                                        {opt.text}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <Button onClick={handleSubmit} disabled={!allAnswered || submitting} className="w-full">
                {submitting ? "Tekshirilmoqda..." : "Javoblarni yuborish"}
            </Button>
        </div>
    )
}