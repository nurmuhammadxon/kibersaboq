import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DirectorDashboard } from "@/components/director/director-dashboard"

export default async function DirectorPage() {
    const session = await auth()
    if (!session) redirect("/login")

    const companyId = (session.user as any).companyId

    return <DirectorDashboard companyId={companyId} />
}