import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
        }

        const { moduleId } = await params

        await prisma.module.delete({ where: { id: moduleId } })

        return NextResponse.json({ message: "Modul o'chirildi" })
    } catch (error) {
        console.error("Module DELETE xato:", error)
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}