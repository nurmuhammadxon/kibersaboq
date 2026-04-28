"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, CheckCircle2, Clock, Loader2 } from "lucide-react"
import Loading from "@/components/_components/loading"
import { Error as ErrorComponent } from "@/components/_components/error"
import { Button } from "@/components/ui/button"
import { LessonViewer } from "@/components/dashboard/lesson-viewer"
import { LessonQuiz } from "@/components/dashboard/lesson-quiz"
import { useLearnerLesson } from "@/hooks/use-learner-lesson"

export default function LearnerLessonPage() {
    const params = useParams<{ courseId: string; lessonId: string }>()
    const lessonId = params.lessonId
    const courseId = params.courseId

    const {
        lesson, loading, error,
        completed, marking,
        timerReady, remaining,
        refresh, markComplete,
    } = useLearnerLesson(lessonId)

    if (loading) return <Loading fullScreen={true} />

    if (error || !lesson) {
        return (
            <ErrorComponent
                title="Dars ochilmadi"
                message={error || "Ruxsat yo'q yoki dars topilmadi"}
                onRetry={refresh}
                fullScreen={true}
            />
        )
    }

    const mm = String(Math.floor(remaining / 60)).padStart(2, "0")
    const ss = String(remaining % 60).padStart(2, "0")

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/dashboard/courses/${courseId}`} aria-label="Kursga qaytish">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div className="min-w-0 flex-1">
                    <h1 className="text-xl font-bold leading-tight truncate">{lesson.title}</h1>
                    <p className="text-xs text-muted-foreground capitalize mt-0.5">
                        {lesson.type.toLowerCase()} darsi
                    </p>
                </div>
            </div>

            <LessonViewer lesson={lesson} />

            {lesson.quizzes[0] && (
                <LessonQuiz quiz={lesson.quizzes[0]} lessonId={lessonId} />
            )}

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-2 text-sm">
                    {completed ? (
                        <>
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            <span>Dars yakunlangan</span>
                        </>
                    ) : !timerReady ? (
                        <>
                            <Clock className="h-5 w-5 text-muted-foreground" />
                            <span className="text-muted-foreground">
                                Yakunlash uchun kuting: <span className="font-mono font-medium text-foreground">{mm}:{ss}</span>
                            </span>
                        </>
                    ) : (
                        <span className="text-muted-foreground">
                            O'qib bo'lgach, yakunlashni bosing.
                        </span>
                    )}
                </div>

                {!completed && (
                    <Button onClick={markComplete} disabled={marking || !timerReady}>
                        {marking ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saqlanmoqda…
                            </>
                        ) : (
                            "Darsni yakunlash"
                        )}
                    </Button>
                )}
            </div>
        </div>
    )
}