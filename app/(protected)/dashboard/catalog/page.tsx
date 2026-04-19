"use client"

import { BookOpen, CheckCircle2, Loader2 } from "lucide-react"
import Link from "next/link"
import Loading from "@/components/_components/loading"
import { Error as ErrorComponent } from "@/components/_components/error"
import { Button } from "@/components/ui/button"
import { useCourseCatalog } from "@/hooks/use-course-catalog"

const levelUz: Record<string, string> = {
    BEGINNER: "Boshlang'ich",
    INTERMEDIATE: "O'rta",
    ADVANCED: "Murakkab",
}

export default function CourseCatalogPage() {
    const { courses, loading, error, enrollingId, enroll, refresh } =
        useCourseCatalog()

    if (loading) return <Loading fullScreen={true} />

    if (error) {
        return (
            <ErrorComponent
                title="Yuklanmadi"
                message={error}
                onRetry={refresh}
                fullScreen={true}
            />
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Kurslar katalogi</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Mavjud kurslar ro'yxati. Yoziling va o'rganishni boshlang.
                </p>
            </div>

            {courses.length === 0 ? (
                <p className="text-sm text-muted-foreground py-12 text-center border border-dashed border-border rounded-xl">
                    Hozircha kurs mavjud emas.
                </p>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {courses.map((course) => {
                        const enrolled = course.enrollments.length > 0

                        return (
                            <div
                                key={course.id}
                                className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="font-medium leading-snug truncate">
                                            {course.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {levelUz[course.level] ?? course.level}
                                            {course.duration
                                                ? ` · ${course.duration} soat`
                                                : ""}
                                        </p>
                                    </div>
                                    <BookOpen className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                </div>

                                {course.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {course.description}
                                    </p>
                                )}

                                {enrolled ? (
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="w-full mt-auto"
                                        asChild
                                    >
                                        <Link href={`/dashboard/courses/${course.id}`}>
                                            <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-500" />
                                            Davom etish
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button
                                        size="sm"
                                        className="w-full mt-auto"
                                        disabled={enrollingId === course.id}
                                        onClick={() => enroll(course.id)}
                                    >
                                        {enrollingId === course.id ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Yozilmoqda…
                                            </>
                                        ) : (
                                            "Kursga yozilish"
                                        )}
                                    </Button>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}