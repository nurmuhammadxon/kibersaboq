import Link from "next/link"
import { ArrowRight, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { UserDashboardCourse } from "@/hooks/use-user-dashboard"

interface InProgressListProps {
    items: UserDashboardCourse[]
}

export function InProgressList({ items }: InProgressListProps) {
    if (items.length === 0) {
        return (
            <Card className="border-border">
                <CardHeader>
                    <CardTitle className="text-base">Jarayondagi kurslar</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground flex items-center gap-2">
                    <BookOpen className="h-8 w-8 opacity-40 shrink-0" />
                    <p>Hozircha tugallanmagan kurs yo&apos;q. Kurslar bo&apos;limidan yoziling.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">Jarayondagi kurslar</CardTitle>
                <Button variant="ghost" size="sm" asChild className="text-xs">
                    <Link href="/dashboard/courses">Barcha kurslar</Link>
                </Button>
            </CardHeader>
            <CardContent className="space-y-3">
                {items.map((c) => (
                    <Link
                        key={c.courseId}
                        href={`/dashboard/courses/${c.courseId}`}
                        className="flex items-center gap-3 rounded-xl border border-border bg-card/50 p-3 transition-colors hover:bg-secondary/60"
                    >
                        <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm truncate">{c.title}</p>
                            <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-primary transition-all"
                                    style={{ width: `${c.progressPercent}%` }}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {c.completedLessons}/{c.totalLessons} dars •{" "}
                                {c.progressPercent}%
                            </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </Link>
                ))}
            </CardContent>
        </Card>
    )
}
