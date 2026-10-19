import { NextResponse } from "next/server"
import { requireUser } from "@/lib/authz"
import { prisma } from "@/lib/prisma"

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
    try {
        const guard = await requireUser(["SUPER_ADMIN"])
        if (guard.error) return guard.error

        const { moduleId } = await params

        await prisma.module.delete({ where: { id: moduleId } })

        return NextResponse.json({ message: "Modul o'chirildi" })
    } catch (error) {
        console.error("Module DELETE xato:", error)
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}