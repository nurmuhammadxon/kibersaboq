import {
    LayoutDashboard,
    Users,
    BookOpen,
    Award,
    BarChart3,
    User,
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
    { href: "/dashboard/certificates", label: "Sertifikatlarim", icon: Award },
    { href: "/dashboard/profile", label: "Profil", icon: User },
]