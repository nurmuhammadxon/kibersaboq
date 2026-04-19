import {
    Award,
    BookOpen,
    CheckCircle,
    ClipboardList,
    Trophy,
    Users,
} from "lucide-react"
import { StatCard } from "@/components/admin/stat-card"
import type { AdminReportsData } from "@/hooks/use-admin-reports"

interface ReportsSummaryProps {
    stats: AdminReportsData["stats"]
}

export function ReportsSummary({ stats }: ReportsSummaryProps) {
    return (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            <StatCard
                label="Yangi foydalanuvchilar"
                value={stats.newUsers}
                icon={Users}
                color="text-blue-500"
                bg="bg-blue-500/10"
            />
            <StatCard
                label="Yozilishlar (davr)"
                value={stats.enrollmentsStarted}
                icon={BookOpen}
                color="text-violet-500"
                bg="bg-violet-500/10"
            />
            <StatCard
                label="Yakunlangan"
                value={stats.enrollmentsCompleted}
                icon={CheckCircle}
                color="text-green-500"
                bg="bg-green-500/10"
            />
            <StatCard
                label="Sertifikatlar"
                value={stats.certificatesIssued}
                icon={Award}
                color="text-amber-500"
                bg="bg-amber-500/10"
            />
            <StatCard
                label="O'rtacha test balli"
                value={`${stats.avgQuizScore}%`}
                icon={Trophy}
                color="text-teal-500"
                bg="bg-teal-500/10"
            />
            <StatCard
                label="Test urinishlari"
                value={stats.quizAttempts}
                icon={ClipboardList}
                color="text-pink-500"
                bg="bg-pink-500/10"
            />
        </div>
    )
}
