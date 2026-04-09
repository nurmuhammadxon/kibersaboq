import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth()
    if (!session) redirect("/login")

    const role = (session.user as any).role
    const name = session.user?.name || "Admin"

    if (role === "Users") redirect("/dashboard")

    return (
        <div className="min-h-screen bg-zinc-950 flex">
            <Sidebar role={role} name={name} />
            <div className="flex-1 flex flex-col ml-64 transition-all duration-300">
                <Header role={role} name={name} />
                <main className="flex-1 p-6">{children}</main>
                <Footer />
            </div>
        </div>
    )
}