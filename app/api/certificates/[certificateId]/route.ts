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

        if ((session.user as any).role !== "SUPER_ADMIN") {
            return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })
        }

        const certificate = await prisma.certificate.findUnique({
            where: { id: params.id },
        })

        if (!certificate) {
            return NextResponse.json({ error: "Sertifikat topilmadi" }, { status: 404 })
        }

        await prisma.certificate.delete({ where: { id: params.id } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Admin certificate DELETE xato:", error)
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}