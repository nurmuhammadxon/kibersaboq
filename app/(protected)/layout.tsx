import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { LayoutWrapper } from "@/components/providers"

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const session = await auth()
    if (!session) redirect("/login")

    const role = (session.user as any).role
    const name = session.user?.name || "User"

    return (
        <LayoutWrapper role={role} name={name}>
            {children}
        </LayoutWrapper>
    )
}