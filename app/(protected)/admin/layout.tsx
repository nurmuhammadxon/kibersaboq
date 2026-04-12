import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth()
    const role = (session?.user as any)?.role

    if (!session) redirect("/login")

    if (role !== "SUPER_ADMIN") {
        redirect("/dashboard")
    }

    return <>{children}</>
}