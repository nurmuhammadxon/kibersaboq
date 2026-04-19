"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BookOpen, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import type { CatalogCourse } from "@/hooks/use-catalog-courses"

const levelUz: Record<string, string> = {
    BEGINNER: "Boshlang‘ich",
    INTERMEDIATE: "O‘rta",
    ADVANCED: "Murakkab",
}

interface CatalogCourseCardProps {
    course: CatalogCourse
}

export function CatalogCourseCard({ course }: CatalogCourseCardProps) {
    const router = useRouter()
    const enrolled = course.enrollments.length > 0
    const [busy, setBusy] = useState(false)

    async function enroll() {
        try {
            setBusy(true)
            const res = await fetch("/api/enrollments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ courseId: course.id }),
            })
            if (!res.ok) {
                const body = await res.json().catch(() => ({}))
                throw new Error(body?.error || "Yozilishda xatolik")
            }
            router.push(`/dashboard/courses/${course.id}`)
            router.refresh()
        } catch (e) {
            alert(e instanceof Error ? e.message : "Xatolik")
        } finally {
            setBusy(false)
        }
    }

    const priceLabel =
        course.price != null && String(course.price) !== ""
            ? `${Number(course.price).toLocaleString("uz-UZ")} so‘m`
            : null

    return (
        <Card className="flex flex-col overflow-hidden border-border">
            <div className="aspect-video bg-muted relative">
                {course.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={course.thumbnail}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-muted-foreground/40" />
                    </div>
                )}
            </div>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg leading-tight line-clamp-2">
                    {course.title}
                </CardTitle>
                <CardDescription className="text-xs">
                    {levelUz[course.level] ?? course.level}
                    {course.duration ? ` • ${course.duration} daq.` : ""}
                    {priceLabel ? ` • ${priceLabel}` : ""}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-2">
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {course.description || "Tavsif kiritilmagan"}
                </p>
            </CardContent>
            <CardFooter className="gap-2 pt-0 flex-col sm:flex-row">
                {enrolled ? (
                    <Button className="w-full" asChild>
                        <Link href={`/dashboard/courses/${course.id}`}>
                            Davom etish
                        </Link>
                    </Button>
                ) : (
                    <Button
                        className="w-full"
                        onClick={enroll}
                        disabled={busy}
                    >
                        {busy ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Yozilmoqda…
                            </>
                        ) : (
                            "Kursga yozilish"
                        )}
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
