import { NextResponse } from "next/server"
import { requireUser } from "@/lib/authz"
import { prisma } from "@/lib/prisma"

export async function GET(
    req: Request,
    { params }: { params: Promise<{ certificateId: string }> }
) {
    try {
        const guard = await requireUser()
        if (guard.error) return guard.error

        const { certificateId: courseId } = await params // papka nomi [certificateId], lekin bu yerda kurs ID keladi
        const userId = guard.user.id

        const certificate = await prisma.certificate.findFirst({
            where: { userId, courseId },
        })

        return NextResponse.json({
            hasCertificate: !!certificate,
            certificate: certificate ?? null,
        })
    } catch (error) {
        console.error("Certificate check xato:", error)
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}