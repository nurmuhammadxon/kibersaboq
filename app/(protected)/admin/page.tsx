"use client"
import { STATS_CONFIG } from "@/lib/constants"
import { StatCard } from "@/components/admin/stat-card"
import { TopUsers } from "@/components/admin/top-users"
import { RecentUsers } from "@/components/admin/recent-users"
import Loading from "@/components/_components/loading"
import { Error as ErrorComponent } from "@/components/_components/error"
import { useAdminDashboard } from "@/hooks/use-admin-dashboard"

export default function AdminDashboard() {
    const { data, loading, error, refresh } = useAdminDashboard()

    if (loading) return <Loading fullScreen={true} />

    if (error || !data) {
        return (
            <ErrorComponent
                title={error ? "Ma'lumot yuklanmadi" : "Ma'lumot topilmadi"}
                message={error || "Admin ma'lumotlari mavjud emas"}
                onRetry={refresh}
                fullScreen={true}
            />
        )
    }

    return (
        <div className="min-h-screen bg-background p-4 sm:p-6 space-y-6">
            {/* Statistika Kartalari */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {STATS_CONFIG.map((config) => (
                    <StatCard
                        key={config.key}
                        label={config.label}
                        value={`${data.stats[config.key as keyof typeof data.stats] || 0}${config.suffix || ""}`}
                        icon={config.icon}
                        color={config.color}
                        bg={config.bg}
                    />
                ))}
            </div>

            {/* Foydalanuvchilar Ro'yxati */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <TopUsers users={data.topUsers} />
                <RecentUsers users={data.recentUsers} />
            </div>
        </div>
    )
}