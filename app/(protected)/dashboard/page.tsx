"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Loading from "@/components/_components/loading"
import { Error as ErrorComponent } from "@/components/_components/error"
import { Button } from "@/components/ui/button"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { InProgressList } from "@/components/dashboard/in-progress-list"
import { useUserDashboard } from "@/hooks/use-user-dashboard"

export default function DashboardPage() {
    const { data, loading, error, refresh } = useUserDashboard()

    if (loading) return <Loading fullScreen={true} />

    if (error || !data) {
        return (
            <ErrorComponent
                title="Ma'lumot yuklanmadi"
                message={error || "Dashboard ma'lumotlari yo'q"}
                onRetry={refresh}
                fullScreen={true}
            />
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Bosh sahifa</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        O‘qish statistikangiz va davom ettirayotgan kurslar
                    </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/courses" className="gap-2">
                        Kurslar katalogi
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </Button>
            </div>

            <DashboardStats stats={data.stats} />

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <InProgressList items={data.inProgress} />
                </div>
                <div className="space-y-3">
                    <Button className="w-full" variant="secondary" asChild>
                        <Link href="/dashboard/certificates">Sertifikatlarim</Link>
                    </Button>
                    <p className="text-xs text-muted-foreground px-1">
                        Jami {data.courses.length} ta kursga yozilgansiz. Davom etish
                        uchun chapdagi ro‘yxatdan tanlang yoki katalogga o‘ting.
                    </p>
                </div>
            </div>
        </div>
    )
}
