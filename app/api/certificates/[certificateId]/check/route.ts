import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
        }

        const { courseId } = await params
        const userId = (session.user as any).id as string

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