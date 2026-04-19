"use client"

import Loading from "@/components/_components/loading"
import { Error as ErrorComponent } from "@/components/_components/error"
import { CatalogCourseCard } from "@/components/dashboard/catalog-course-card"
import { useCatalogCourses } from "@/hooks/use-catalog-courses"

export default function DashboardCoursesPage() {
    const { courses, loading, error, refresh } = useCatalogCourses()

    if (loading) return <Loading fullScreen={true} />

    if (error) {
        return (
            <ErrorComponent
                title="Kurslar yuklanmadi"
                message={error}
                onRetry={refresh}
                fullScreen={true}
            />
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Kurslar</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Tashkilotingizning ochiq kurslari. Yoziling va o‘qishni boshlang.
                </p>
            </div>

            {courses.length === 0 ? (
                <p className="text-sm text-muted-foreground py-12 text-center border border-dashed border-border rounded-xl">
                    Hozircha ochiq kurs yo‘q.
                </p>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {courses.map((c) => (
                        <CatalogCourseCard key={c.id} course={c} />
                    ))}
                </div>
            )}
        </div>
    )
}
