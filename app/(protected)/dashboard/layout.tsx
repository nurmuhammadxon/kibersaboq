import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function UserLayout({ children }: { children: React.ReactNode }) {
    const session = await auth()
    const role = (session?.user as any)?.role

    if (!session) redirect("/login")
        
    if (role === "SUPER_ADMIN") {
        redirect("/admin")
    }

    return <>{children}</>
}