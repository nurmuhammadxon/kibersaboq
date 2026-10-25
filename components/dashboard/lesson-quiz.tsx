"use client"

import { useEffect, useRef, useState } from "react"
import { CheckCircle2, XCircle, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { LearnerQuestion, LearnerQuiz } from "@/hooks/use-learner-lesson"

interface Props {
    quiz: LearnerQuiz
    lessonId: string
    canStart: boolean // dars yetarli faol o'qilganmi
    remaining: number // yana necha soniya o'qish kerak
    onBeforeStart: () => Promise<void> // serverdagi o'qish vaqtini yangilaydi
}

type Phase = "idle" | "running" | "result"

export function LessonQuiz({ quiz, canStart, remaining, onBeforeStart }: Props) {
    const [phase, setPhase] = useState<Phase>("idle")
    const [attemptId, setAttemptId] = useState<string | null>(null)
    const [questions, setQuestions] = useState<LearnerQuestion[]>([])
    const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null)
    const [selected, setSelected] = useState<Record<string, string>>({})
    const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null)
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Test vaqtida sahifadan necha marta chiqilganini hisoblaymiz
    const blurCount = useRef(0)
    const away = useRef(false)
    useEffect(() => {
        if (phase !== "running") return
        const leave = () => {
            if (!away.current) {
                away.current = true
                blurCount.current += 1
            }
        }
        const back = () => { away.current = false }
        const onVisibility = () => (document.visibilityState === "hidden" ? leave() : back())
        window.addEventListener("blur", leave)
        window.addEventListener("focus", back)
        document.addEventListener("visibilitychange", onVisibility)
        return () => {
            window.removeEventListener("blur", leave)
            window.removeEventListener("focus", back)
            document.removeEventListener("visibilitychange", onVisibility)
        }
    }, [phase])

    const mm = String(Math.floor(remaining / 60)).padStart(2, "0")
    const ss = String(remaining % 60).padStart(2, "0")

    const handleStart = async () => {
        try {
            setBusy(true)
            setError(null)
            await onBeforeStart()
            const res = await fetch(`/api/quizzes/${quiz.id}/start`, { method: "POST" })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) throw new Error(typeof data?.error === "string" ? data.error : "Xatolik yuz berdi")
            blurCount.current = 0
            away.current = false
            setAttemptId(data.attemptId)
            setQuestions(data.questions)
            setAttemptsLeft(typeof data.attemptsLeft === "number" ? data.attemptsLeft : null)
            setSelected({})
            setResult(null)
            setPhase("running")
        } catch (e) {
            setError(e instanceof Error ? e.message : "Xatolik yuz berdi")
        } finally {
            setBusy(false)
        }
    }

    const handleSubmit = async () => {
        try {
            setBusy(true)
            setError(null)
            const answers = Object.entries(selected).map(([questionId, optionId]) => ({ questionId, optionId }))
            const res = await fetch(`/api/quizzes/${quiz.id}/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answers, attemptId, blurCount: blurCount.current }),
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) throw new Error(typeof data?.error === "string" ? data.error : "Xatolik yuz berdi")
            setResult(data)
            setPhase("result")
        } catch (e) {
            setError(e instanceof Error ? e.message : "Xatolik yuz berdi")
        } finally {
            setBusy(false)
        }
    }

    const errorBox = error && (
        <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>
    )

    if (phase === "result" && result) {
        return (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <h3 className="font-medium text-sm">Test natijasi</h3>
                <div className={`flex items-center gap-3 p-4 rounded-xl ${result.passed ? "bg-emerald-500/10" : "bg-destructive/10"}`}>
                    {result.passed
                        ? <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                        : <XCircle className="h-6 w-6 text-destructive shrink-0" />}
                    <div>
                        <p className="font-medium text-sm">{result.passed ? "Muvaffaqiyatli!" : "Muvaffaqiyatsiz"}</p>
                        <p className="text-xs text-muted-foreground">Natija: {result.score}% (o'tish bali 70%)</p>
                    </div>
                </div>
                {!result.passed && (
                    <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">
                            Darsni qayta o'qib chiqing. Savollar har safar boshqacha tartibda beriladi.
                            {attemptsLeft !== null && ` Qolgan urinishlar: ${attemptsLeft}.`}
                        </p>
                        {errorBox}
                        <Button variant="outline" size="sm" onClick={() => { setPhase("idle"); setError(null) }}>
                            Qayta urinish
                        </Button>
                    </div>
                )}
            </div>
        )
    }

    if (phase === "idle") {
        return (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <h3 className="font-medium text-sm">Test</h3>
                {canStart ? (
                    <p className="text-sm text-muted-foreground">
                        Test boshlangach savollar ochiladi. Bir test uchun 24 soat ichida 3 ta urinish bor,
                        o'tish uchun kamida 70% kerak. Test vaqtida boshqa oynaga o'tmang.
                    </p>
                ) : (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Lock className="h-4 w-4 mt-0.5 shrink-0" />
                        <span>
                            Testni boshlash uchun darsni yana{" "}
                            <span className="font-mono font-medium text-foreground">{mm}:{ss}</span> o'qing.
                            Vaqt faqat sahifa ochiq va faol bo'lganda hisoblanadi.
                        </span>
                    </div>
                )}
                {errorBox}
                <Button onClick={handleStart} disabled={!canStart || busy}>
                    {busy ? "Yuklanmoqda..." : "Testni boshlash"}
                </Button>
            </div>
        )
    }

    const allAnswered = questions.length > 0 && questions.every((q) => selected[q.id])

    return (
        <div className="rounded-xl border border-border bg-card p-5 space-y-5">
            <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">Savollar ({questions.length})</h3>
                {attemptsLeft !== null && (
                    <span className="text-xs text-muted-foreground">Qolgan urinishlar: {attemptsLeft}</span>
                )}
            </div>

            {errorBox}

            <div className="space-y-5">
                {questions.map((q, qi) => (
                    <div key={q.id} className="space-y-2">
                        <p className="text-sm font-medium">{qi + 1}. {q.text}</p>
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

            <Button onClick={handleSubmit} disabled={!allAnswered || busy} className="w-full">
                {busy ? "Tekshirilmoqda..." : "Javoblarni yuborish"}
            </Button>
        </div>
    )
}
