"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, BookOpen } from "lucide-react"
import Loading from "@/components/_components/loading"
import { Error as ErrorComponent } from "@/components/_components/error"
import { Button } from "@/components/ui/button"
import { LearnerCourseOutline } from "@/components/dashboard/learner-course-outline"
import { useLearnerCourse } from "@/hooks/use-learner-course"

const levelUz: Record<string, string> = {
    BEGINNER: "Boshlang‘ich",
    INTERMEDIATE: "O‘rta",
    ADVANCED: "Murakkab",
}

export default function LearnerCoursePage() {
    const params = useParams<{ courseId: string }>()
    const courseId = params.courseId
    const { course, completedLessonIds, loading, error, refresh } =
        useLearnerCourse(courseId)

    if (loading) return <Loading fullScreen={true} />

    if (error || !course) {
        return (
            <ErrorComponent
                title="Kurs ochilmadi"
                message={
                    error ||
                    "Kursga yoziling yoki havolani tekshiring"
                }
                onRetry={refresh}
                fullScreen={true}
            />
        )
    }

    const prefix = `/dashboard/courses/${course.id}`

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div className="flex items-start gap-3">
                <Button variant="ghost" size="icon" asChild className="shrink-0 mt-0.5">
                    <Link href="/dashboard/courses" aria-label="Orqaga">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div className="min-w-0 flex-1">
                    <h1 className="text-xl sm:text-2xl font-bold leading-tight">
                        {course.title}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {levelUz[course.level] ?? course.level}
                    </p>
                    {course.description ? (
                        <p className="text-sm text-muted-foreground mt-3 whitespace-pre-wrap">
                            {course.description}
                        </p>
                    ) : null}
                </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 flex gap-3">
                <BookOpen className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-sm">
                    <p className="font-medium">Modullar va darslar</p>
                    <p className="text-muted-foreground text-xs mt-1">
                        Darsni oching, materiallarni o‘qing va yakunlash tugmasini
                        bosing.
                    </p>
                </div>
            </div>

            <LearnerCourseOutline
                course={course}
                completedLessonIds={completedLessonIds}
                coursePathPrefix={prefix}
            />
        </div>
    )
}
