import {
    LayoutDashboard,
    Users,
    BookOpen,
    Award,
    BarChart3,
    Trophy,
    TrendingUp,
    CheckCircle,
    Clock,
    GraduationCap
} from "lucide-react"

export const adminNav = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "Foydalanuvchilar", icon: Users },
    { href: "/admin/courses", label: "Kurslar", icon: BookOpen },
    { href: "/admin/certificates", label: "Sertifikatlar", icon: Award },
    { href: "/admin/reports", label: "Hisobotlar", icon: BarChart3 },
]

export const userNav = [
    { href: "/dashboard", label: "Bosh sahifa", icon: LayoutDashboard },
    { href: "/dashboard/courses", label: "Kurslarim", icon: BookOpen },
    { href: "/dashboard/catalog", label: "Katalog", icon: GraduationCap }, // ← yangi
    { href: "/dashboard/certificates", label: "Sertifikatlarim", icon: Award },
]

export const STATS_CONFIG = [
    { key: "totalUsers", label: "Jami Foydalanuvchilar", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { key: "totalCourses", label: "Jami kurslar", icon: BookOpen, color: "text-violet-500", bg: "bg-violet-500/10" },
    { key: "completedEnrollments", label: "Yakunlangan kurslar", icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" },
    { key: "avgScore", label: "O'rtacha test natijasi", icon: Trophy, color: "text-amber-500", bg: "bg-amber-500/10", suffix: "%" },
    { key: "completionRate", label: "Yakunlash darajasi", icon: TrendingUp, color: "text-teal-500", bg: "bg-teal-500/10", suffix: "%" },
    { key: "totalEnrollments", label: "Jami yozilishlar", icon: Clock, color: "text-pink-500", bg: "bg-pink-500/10" },
]

export const features = [
    {
        icon: BookOpen,
        title: "Interaktiv kurslar",
        description: "Video, matn va testlar orqali qulay o'qish imkoniyati",
    },
    {
        icon: Award,
        title: "Sertifikatlar",
        description: "Kursni yakunlagan xodimlar rasmiy sertifikat oladi",
    },
    {
        icon: Users,
        title: "Tashkilot boshqaruvi",
        description: "Xodimlar progressini kuzating va hisobotlar oling",
    },
]
