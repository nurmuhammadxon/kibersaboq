import { Award, Boxes, Building2, Users } from "lucide-react"
import { StatCard } from "@/components/admin/stat-card"
import type { AdminReportsData } from "@/hooks/use-admin-reports"

interface ReportsTotalsProps {
    totals: AdminReportsData["totals"]
}

export function ReportsTotals({ totals }: ReportsTotalsProps) {
    return (
        <div className="space-y-3">
            <h2 className="text-lg font-semibold">
                Umumiy ko'rsatkichlar{" "}
                <span className="text-xs font-normal text-muted-foreground">
                    (barcha vaqt)
                </span>
            </h2>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <StatCard
                    label="Jami xodimlar"
                    value={totals.totalUsers}
                    icon={Users}
                    color="text-blue-500"
                    bg="bg-blue-500/10"
                />
                <StatCard
                    label="Korxonalar"
                    value={totals.totalCompanies}
                    icon={Building2}
                    color="text-indigo-500"
                    bg="bg-indigo-500/10"
                />
                <StatCard
                    label="Kurslar"
                    value={totals.totalCourses}
                    icon={Boxes}
                    color="text-violet-500"
                    bg="bg-violet-500/10"
                />
                <StatCard
                    label="Sertifikatlar"
                    value={totals.totalCertificates}
                    icon={Award}
                    color="text-amber-500"
                    bg="bg-amber-500/10"
                />
            </div>
            <h2 className="pt-2 text-lg font-semibold">
                Tanlangan davr{" "}
                <span className="text-xs font-normal text-muted-foreground">
                    (filtr bo'yicha)
                </span>
            </h2>
        </div>
    )
}