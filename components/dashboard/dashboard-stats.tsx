import { Award, BookOpen, CheckCircle, Trophy } from "lucide-react"
import { StatCard } from "@/components/admin/stat-card"
import type { UserDashboardData } from "@/hooks/use-user-dashboard"

interface DashboardStatsProps {
    stats: UserDashboardData["stats"]
}

export function DashboardStats({ stats }: DashboardStatsProps) {
    return (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard
                label="Kurslarim"
                value={stats.enrolledCourses}
                icon={BookOpen}
                color="text-violet-500"
                bg="bg-violet-500/10"
            />
            <StatCard
                label="Tugatilgan"
                value={stats.completedCourses}
                icon={CheckCircle}
                color="text-emerald-500"
                bg="bg-emerald-500/10"
            />
            <StatCard
                label="Sertifikatlar"
                value={stats.certificates}
                icon={Award}
                color="text-amber-500"
                bg="bg-amber-500/10"
            />
            <StatCard
                label="O'rtacha test"
                value={`${stats.avgQuizScore}%`}
                icon={Trophy}
                color="text-teal-500"
                bg="bg-teal-500/10"
            />
        </div>
    )
}
