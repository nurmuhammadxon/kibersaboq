import {
    Award,
    BookOpen,
    CheckCircle,
    GraduationCap,
    Trophy,
    UserCheck,
    Users,
    ClipboardList,
} from "lucide-react"
import { StatCard } from "@/components/admin/stat-card"
import type { DirectorReportsData } from "@/hooks/use-director-reports"

interface Props {
    stats: DirectorReportsData["stats"]
}

export function DirectorReportsSummary({ stats }: Props) {
    return (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard
                label="Jami xodimlar"
                value={stats.totalEmployees}
                icon={Users}
                color="text-blue-500"
                bg="bg-blue-500/10"
            />
            <StatCard
                label="Faol xodimlar"
                value={stats.activeEmployees}
                icon={UserCheck}
                color="text-emerald-500"
                bg="bg-emerald-500/10"
            />
            <StatCard
                label="Yozilishlar (davr)"
                value={stats.enrollmentsStarted}
                icon={BookOpen}
                color="text-violet-500"
                bg="bg-violet-500/10"
            />
            <StatCard
                label="Yakunlangan kurslar"
                value={stats.enrollmentsCompleted}
                icon={CheckCircle}
                color="text-green-500"
                bg="bg-green-500/10"
            />
            <StatCard
                label="Tugatilgan darslar"
                value={stats.lessonsCompleted}
                icon={GraduationCap}
                color="text-sky-500"
                bg="bg-sky-500/10"
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