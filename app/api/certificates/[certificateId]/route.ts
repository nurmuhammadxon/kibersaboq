import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()
        if (!session) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })

        // Sertifikat shu organizationga tegishli ekanini tekshirish
        const certificate = await prisma.certificate.findUnique({
            where: { id: params.id },
            include: { user: true },
        })

        if (!certificate) {
            return NextResponse.json({ error: "Sertifikat topilmadi" }, { status: 404 })
        }

        if (certificate.user.organizationId !== (session.user as any).organizationId) {
            return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })
        }

        await prisma.certificate.delete({ where: { id: params.id } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Admin certificate DELETE xato:", error)
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}